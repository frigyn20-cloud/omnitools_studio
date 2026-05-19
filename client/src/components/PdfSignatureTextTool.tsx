import { useState, useRef } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

// ─── Types ────────────────────────────────────────────────────────────────────

type SignatureMode = "draw" | "type" | "upload";

interface TextEntry {
  id: string;
  page: number;
  text: string;
  x: number;
  y: number;
  size: number;
  colorHex: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return rgb(r, g, b);
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function PdfSignatureTextTool() {
  // File state
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // Text entries
  const [texts, setTexts] = useState<TextEntry[]>([]);
  const [newText, setNewText] = useState("Your text here");
  const [newPage, setNewPage] = useState(1);
  const [newX, setNewX] = useState(72);
  const [newY, setNewY] = useState(700);
  const [newSize, setNewSize] = useState(14);
  const [newColor, setNewColor] = useState("#000000");

  // Signature state
  const [sigMode, setSigMode] = useState<SignatureMode>("draw");
  const [sigText, setSigText] = useState("");
  const [sigPage, setSigPage] = useState(1);
  const [sigX, setSigX] = useState(72);
  const [sigY, setSigY] = useState(100);
  const [sigSize, setSigSize] = useState(28);
  const [sigImageBytes, setSigImageBytes] = useState<Uint8Array | null>(null);
  const [sigImageName, setSigImageName] = useState("");
  const [sigImgWidth, setSigImgWidth] = useState(200);
  const [sigImgHeight, setSigImgHeight] = useState(60);

  // Canvas drawing
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);

  // ── PDF upload ──────────────────────────────────────────────────────────────
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const doc = await PDFDocument.load(bytes);
    setPdfBytes(bytes);
    setFileName(file.name);
    setPageCount(doc.getPageCount());
    setTexts([]);
    setHasDrawing(false);
    setSigImageBytes(null);
    setSigImageName("");
    setStatus(`Loaded "${file.name}" — ${doc.getPageCount()} page(s)`);
  };

  // ── Canvas drawing ──────────────────────────────────────────────────────────
  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!drawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineCap = "round";
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawing(true);
  };

  const endDraw = () => setDrawing(false);

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    setHasDrawing(false);
  };

  // ── Signature image upload ──────────────────────────────────────────────────
  const handleSigImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const bytes = new Uint8Array(await file.arrayBuffer());
    setSigImageBytes(bytes);
    setSigImageName(file.name);
  };

  // ── Add text entry ──────────────────────────────────────────────────────────
  const addText = () => {
    if (!newText.trim()) return;
    setTexts(prev => [...prev, { id: uid(), page: newPage, text: newText, x: newX, y: newY, size: newSize, colorHex: newColor }]);
    setStatus("Text entry added. Add more or click Generate.");
  };

  const removeText = (id: string) => setTexts(prev => prev.filter(t => t.id !== id));

  // ── Generate PDF ────────────────────────────────────────────────────────────
  const generate = async () => {
    if (!pdfBytes) { setStatus("Please upload a PDF first."); return; }
    setLoading(true);
    setStatus("Processing…");

    try {
      const doc = await PDFDocument.load(pdfBytes);
      const pages = doc.getPages();
      const font = await doc.embedFont(StandardFonts.Helvetica);

      for (const entry of texts) {
        const page = pages[entry.page - 1];
        if (!page) continue;
        page.drawText(entry.text, { x: entry.x, y: entry.y, size: entry.size, font, color: hexToRgb(entry.colorHex) });
      }

      if (sigMode === "type" && sigText.trim()) {
        const cursiveFont = await doc.embedFont(StandardFonts.TimesRomanItalic);
        const page = pages[sigPage - 1];
        if (page) {
          page.drawText(sigText, { x: sigX, y: sigY, size: sigSize, font: cursiveFont, color: rgb(0.05, 0.05, 0.45) });
        }
      } else if (sigMode === "draw" && hasDrawing && canvasRef.current) {
        const dataUrl = canvasRef.current.toDataURL("image/png");
        const res = await fetch(dataUrl);
        const imgBytes = new Uint8Array(await res.arrayBuffer());
        const pngImage = await doc.embedPng(imgBytes);
        const page = pages[sigPage - 1];
        if (page) {
          page.drawImage(pngImage, { x: sigX, y: sigY, width: sigImgWidth, height: sigImgHeight });
        }
      } else if (sigMode === "upload" && sigImageBytes) {
        const name = sigImageName.toLowerCase();
        const page = pages[sigPage - 1];
        if (page) {
          const img = name.endsWith(".png")
            ? await doc.embedPng(sigImageBytes)
            : await doc.embedJpg(sigImageBytes);
          page.drawImage(img, { x: sigX, y: sigY, width: sigImgWidth, height: sigImgHeight });
        }
      }

      const saved = await doc.save();
      const blob = new Blob([saved], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName.replace(".pdf", "") + "-signed.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setStatus("✓ PDF downloaded!");
    } catch (err) {
      setStatus("Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  const sectionClass = "rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-4";
  const labelClass = "block text-sm font-medium text-[var(--color-text-muted)] mb-1";
  const inputClass = "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition";
  const btnPrimary = "inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)] transition disabled:opacity-50";
  const btnGhost = "inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium hover:bg-[var(--color-surface-offset)] transition";

  return (
    <div className="space-y-6 max-w-2xl mx-auto">

      {/* Step 1 — Upload PDF */}
      <div className={sectionClass}>
        <h2 className="text-base font-semibold">1. Upload PDF</h2>
        <label className={labelClass}>Choose a PDF file</label>
        <input type="file" accept="application/pdf" onChange={handlePdfUpload} className={inputClass} />
        {fileName && (
          <p className="text-sm text-[var(--color-text-muted)]">
            📄 <span className="font-medium text-[var(--color-text)]">{fileName}</span> — {pageCount} page(s)
          </p>
        )}
      </div>

      {/* Step 2 — Add Text */}
      {pdfBytes && (
        <div className={sectionClass}>
          <h2 className="text-base font-semibold">2. Add Text (optional)</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className={labelClass}>Text content</label>
              <input type="text" value={newText} onChange={e => setNewText(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Page (1–{pageCount})</label>
              <input type="number" min={1} max={pageCount} value={newPage} onChange={e => setNewPage(Number(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Font size (pt)</label>
              <input type="number" min={6} max={72} value={newSize} onChange={e => setNewSize(Number(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>X position (pts from left)</label>
              <input type="number" min={0} value={newX} onChange={e => setNewX(Number(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Y position (pts from bottom)</label>
              <input type="number" min={0} value={newY} onChange={e => setNewY(Number(e.target.value))} className={inputClass} />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Text color</label>
              <input type="color" value={newColor} onChange={e => setNewColor(e.target.value)} className="h-10 w-full rounded-lg border border-[var(--color-border)] cursor-pointer" />
            </div>
          </div>
          <button onClick={addText} className={btnPrimary}>+ Add text entry</button>

          {texts.length > 0 && (
            <ul className="divide-y divide-[var(--color-divider)]">
              {texts.map(t => (
                <li key={t.id} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-[var(--color-text)]">
                    Page {t.page} · "{t.text}" · {t.size}pt
                  </span>
                  <button onClick={() => removeText(t.id)} className="text-[var(--color-error)] text-xs hover:underline">Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Step 3 — Signature */}
      {pdfBytes && (
        <div className={sectionClass}>
          <h2 className="text-base font-semibold">3. Add Signature (optional)</h2>

          <div className="flex gap-2 flex-wrap">
            {(["draw", "type", "upload"] as SignatureMode[]).map(m => (
              <button key={m} onClick={() => setSigMode(m)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                  sigMode === m
                    ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                    : "border-[var(--color-border)] hover:bg-[var(--color-surface-offset)]"
                }`}>
                {m === "draw" ? "✏️ Draw" : m === "type" ? "⌨️ Type" : "📁 Upload image"}
              </button>
            ))}
          </div>

          {sigMode === "draw" && (
            <div className="space-y-2">
              <p className="text-xs text-[var(--color-text-muted)]">Draw your signature below:</p>
              <canvas
                ref={canvasRef}
                width={480}
                height={140}
                className="w-full rounded-lg border border-[var(--color-border)] bg-white cursor-crosshair touch-none"
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={endDraw}
                onMouseLeave={endDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={endDraw}
              />
              <button onClick={clearCanvas} className={btnGhost}>Clear</button>
            </div>
          )}

          {sigMode === "type" && (
            <div>
              <label className={labelClass}>Signature text</label>
              <input
                type="text"
                value={sigText}
                onChange={e => setSigText(e.target.value)}
                placeholder="Your Name"
                className={inputClass}
                style={{ fontStyle: "italic", fontFamily: "Georgia, serif", fontSize: "18px" }}
              />
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Rendered in Times Roman Italic on the PDF.</p>
            </div>
          )}

          {sigMode === "upload" && (
            <div>
              <label className={labelClass}>Signature image (PNG or JPG)</label>
              <input type="file" accept="image/png,image/jpeg" onChange={handleSigImageUpload} className={inputClass} />
              {sigImageName && <p className="text-xs text-[var(--color-text-muted)] mt-1">Loaded: {sigImageName}</p>}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className={labelClass}>Page (1–{pageCount})</label>
              <input type="number" min={1} max={pageCount} value={sigPage} onChange={e => setSigPage(Number(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Font size / draw height (pt)</label>
              <input type="number" min={8} max={96} value={sigSize} onChange={e => setSigSize(Number(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>X (pts from left)</label>
              <input type="number" min={0} value={sigX} onChange={e => setSigX(Number(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Y (pts from bottom)</label>
              <input type="number" min={0} value={sigY} onChange={e => setSigY(Number(e.target.value))} className={inputClass} />
            </div>
            {(sigMode === "draw" || sigMode === "upload") && (
              <>
                <div>
                  <label className={labelClass}>Width (pts)</label>
                  <input type="number" min={20} value={sigImgWidth} onChange={e => setSigImgWidth(Number(e.target.value))} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Height (pts)</label>
                  <input type="number" min={10} value={sigImgHeight} onChange={e => setSigImgHeight(Number(e.target.value))} className={inputClass} />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Step 4 — Generate */}
      {pdfBytes && (
        <div className={sectionClass}>
          <h2 className="text-base font-semibold">4. Download Modified PDF</h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            {texts.length} text {texts.length === 1 ? "entry" : "entries"} queued.
            {sigMode === "type" && sigText ? " Typed signature ready." : ""}
            {sigMode === "draw" && hasDrawing ? " Drawn signature ready." : ""}
            {sigMode === "upload" && sigImageBytes ? " Image signature ready." : ""}
          </p>
          <button onClick={generate} disabled={loading} className={btnPrimary}>
            {loading ? "Processing…" : "⬇ Generate & Download PDF"}
          </button>
          {status && <p className="text-sm text-[var(--color-text-muted)] mt-2">{status}</p>}
        </div>
      )}

      <p className="text-xs text-[var(--color-text-faint)] text-center pb-4">
        Your file is processed entirely in your browser — nothing is uploaded to any server.
      </p>
    </div>
  );
}
