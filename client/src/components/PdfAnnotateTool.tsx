import { useRef, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

type SignatureMode = "draw" | "type" | "upload";

export default function PdfAnnotateTool() {
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [pdfName, setPdfName] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [selectedPage, setSelectedPage] = useState(1);
  const [textContent, setTextContent] = useState("");
  const [textX, setTextX] = useState(50);
  const [textY, setTextY] = useState(50);
  const [fontSize, setFontSize] = useState(14);
  const [textColor, setTextColor] = useState("#000000");
  const [sigMode, setSigMode] = useState<SignatureMode>("type");
  const [typedSig, setTypedSig] = useState("");
  const [sigX, setSigX] = useState(50);
  const [sigY, setSigY] = useState(100);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const sigImageRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const buf = await file.arrayBuffer();
    const bytes = new Uint8Array(buf);
    const doc = await PDFDocument.load(bytes);
    setPdfBytes(bytes);
    setPdfName(file.name);
    setPageCount(doc.getPageCount());
    setStatus(`Loaded "${file.name}" — ${doc.getPageCount()} page(s).`);
  }

  // Canvas drawing helpers
  function startDraw(e: React.MouseEvent<HTMLCanvasElement>) {
    isDrawing.current = true;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  }
  function draw(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  function stopDraw() {
    isDrawing.current = false;
    sigImageRef.current = canvasRef.current?.toDataURL("image/png") ?? null;
  }
  function clearCanvas() {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !canvasRef.current) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    sigImageRef.current = null;
  }

  async function handleSigImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { sigImageRef.current = reader.result as string; };
    reader.readAsDataURL(file);
  }

  function hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return rgb(r, g, b);
  }

  async function applyAndDownload() {
    if (!pdfBytes) { setStatus("Please upload a PDF first."); return; }
    setLoading(true);
    try {
      const doc = await PDFDocument.load(pdfBytes);
      const pages = doc.getPages();
      const page = pages[selectedPage - 1];
      const { height } = page.getSize();

      // Add text
      if (textContent.trim()) {
        const font = await doc.embedFont(StandardFonts.Helvetica);
        page.drawText(textContent, {
          x: textX,
          y: height - textY - fontSize,
          size: fontSize,
          font,
          color: hexToRgb(textColor),
        });
      }

      // Add signature
      if (sigMode === "type" && typedSig.trim()) {
        const font = await doc.embedFont(StandardFonts.TimesRomanItalic);
        page.drawText(typedSig, {
          x: sigX,
          y: height - sigY - 20,
          size: 22,
          font,
          color: rgb(0.1, 0.1, 0.6),
        });
      } else if ((sigMode === "draw" || sigMode === "upload") && sigImageRef.current) {
        const dataUrl = sigImageRef.current;
        const base64 = dataUrl.split(",")[1];
        const imgBytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        const img = dataUrl.startsWith("data:image/png")
          ? await doc.embedPng(imgBytes)
          : await doc.embedJpg(imgBytes);
        page.drawImage(img, { x: sigX, y: height - sigY - 60, width: 160, height: 60 });
      }

      const saved = await doc.save();
      const blob = new Blob([saved], { type: "application/pdf" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = pdfName.replace(/\.pdf$/i, "") + "_annotated.pdf";
      a.click();
      setStatus("✓ Download started.");
    } catch (err) {
      setStatus("Error modifying PDF. Please try a different file.");
      console.error(err);
    }
    setLoading(false);
  }

  const inputClass = "w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]";
  const labelClass = "block text-xs font-medium text-[var(--color-text-muted)] mb-1";

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <p className="text-[var(--color-text-muted)] text-sm mb-4">
          Upload a PDF, add text and a signature, then download the modified file — all in your browser.
        </p>

        {/* Step 1 — Upload PDF */}
        <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-3">
          <h2 className="text-sm font-semibold">1. Upload PDF</h2>
          <input type="file" accept="application/pdf" onChange={handleFileUpload}
            className="block w-full text-sm text-[var(--color-text-muted)] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-[var(--color-primary)] file:text-white file:text-xs cursor-pointer" />
          {pageCount > 0 && (
            <div className="flex items-center gap-3">
              <label className={labelClass + " mb-0"}>Page</label>
              <select value={selectedPage} onChange={e => setSelectedPage(+e.target.value)} className={inputClass + " w-24"}>
                {Array.from({ length: pageCount }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <span className="text-xs text-[var(--color-text-muted)]">of {pageCount}</span>
            </div>
          )}
        </section>

        {/* Step 2 — Add Text */}
        <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-3 mt-4">
          <h2 className="text-sm font-semibold">2. Add Text (optional)</h2>
          <div>
            <label className={labelClass}>Text content</label>
            <input type="text" value={textContent} onChange={e => setTextContent(e.target.value)}
              placeholder="e.g. Approved — Jane Smith" className={inputClass} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>X position (px)</label>
              <input type="number" value={textX} onChange={e => setTextX(+e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Y from top (px)</label>
              <input type="number" value={textY} onChange={e => setTextY(+e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Font size</label>
              <input type="number" value={fontSize} min={6} max={72} onChange={e => setFontSize(+e.target.value)} className={inputClass} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className={labelClass + " mb-0"}>Color</label>
            <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)}
              className="h-8 w-12 rounded border border-[var(--color-border)] cursor-pointer" />
            <span className="text-xs text-[var(--color-text-muted)]">{textColor}</span>
          </div>
        </section>

        {/* Step 3 — Signature */}
        <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-3 mt-4">
          <h2 className="text-sm font-semibold">3. Add Signature (optional)</h2>
          <div className="flex gap-2">
            {(["type", "draw", "upload"] as SignatureMode[]).map(m => (
              <button key={m} onClick={() => setSigMode(m)}
                className={`px-3 py-1 rounded text-xs font-medium border ${
                  sigMode === m
                    ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                    : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                }`}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>

          {sigMode === "type" && (
            <div>
              <label className={labelClass}>Type your name</label>
              <input type="text" value={typedSig} onChange={e => setTypedSig(e.target.value)}
                placeholder="Your Name" className={inputClass} style={{ fontStyle: "italic", fontFamily: "Georgia, serif", fontSize: 18 }} />
            </div>
          )}

          {sigMode === "draw" && (
            <div className="space-y-2">
              <p className="text-xs text-[var(--color-text-muted)]">Draw your signature below:</p>
              <canvas ref={canvasRef} width={400} height={100}
                className="rounded border border-[var(--color-border)] bg-white cursor-crosshair touch-none"
                onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw} />
              <button onClick={clearCanvas} className="text-xs text-[var(--color-primary)] underline">Clear</button>
            </div>
          )}

          {sigMode === "upload" && (
            <div>
              <label className={labelClass}>Upload signature image (PNG or JPG)</label>
              <input type="file" accept="image/png,image/jpeg" onChange={handleSigImageUpload}
                className="block w-full text-sm text-[var(--color-text-muted)] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-[var(--color-primary)] file:text-white file:text-xs cursor-pointer" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Sig X (px)</label>
              <input type="number" value={sigX} onChange={e => setSigX(+e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Sig Y from top (px)</label>
              <input type="number" value={sigY} onChange={e => setSigY(+e.target.value)} className={inputClass} />
            </div>
          </div>
        </section>

        {/* Apply & Download */}
        <div className="mt-5 flex items-center gap-4">
          <button onClick={applyAndDownload} disabled={loading || !pdfBytes}
            className="px-5 py-2.5 rounded-md bg-[var(--color-primary)] text-white text-sm font-medium disabled:opacity-50 hover:bg-[var(--color-primary-hover)] transition-colors">
            {loading ? "Processing…" : "Apply & Download PDF"}
          </button>
          {status && <p className="text-sm text-[var(--color-text-muted)]">{status}</p>}
        </div>
      </div>
    </div>
  );
}
