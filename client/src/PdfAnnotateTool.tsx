import { useRef, useState, useEffect, useCallback } from "react";
import { jsPDF } from "jspdf";
import { Download, Pen, Type, Trash2, RotateCcw } from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────
type TextAnnotation = {
  id: string;
  page: number;
  x: number; // relative 0-1
  y: number; // relative 0-1
  text: string;
  fontSize: number;
  color: string;
};

type Mode = "text" | "signature" | "select";

// ─── Signature Pad ─────────────────────────────────────────────────────────────
function SignaturePad({
  onSave,
  onCancel,
}: {
  onSave: (dataUrl: string) => void;
  onCancel: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      const t = e.touches[0];
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  };

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    drawing.current = true;
    lastPos.current = getPos(e);
  };

  const move = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current || !lastPos.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#1a1a2e";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.stroke();
    lastPos.current = pos;
  };

  const end = () => {
    drawing.current = false;
    lastPos.current = null;
  };

  const clear = () => {
    const canvas = canvasRef.current!;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
  };

  const save = () => {
    const canvas = canvasRef.current!;
    onSave(canvas.toDataURL("image/png"));
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-bold text-muted-foreground">Draw your signature below</p>
      <canvas
        ref={canvasRef}
        width={400}
        height={160}
        className="w-full rounded-2xl border-2 border-dashed border-primary/50 bg-white cursor-crosshair touch-none"
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
      />
      <div className="flex flex-wrap gap-2">
        <button onClick={clear} className="inline-flex h-10 items-center gap-2 rounded-xl border border-border/70 bg-card px-4 text-sm font-bold">
          <RotateCcw className="h-4 w-4" /> Clear
        </button>
        <button onClick={save} className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-black text-primary-foreground">
          <Pen className="h-4 w-4" /> Use Signature
        </button>
        <button onClick={onCancel} className="inline-flex h-10 items-center gap-2 rounded-xl border border-border/70 bg-card px-4 text-sm font-bold">
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Main Tool ─────────────────────────────────────────────────────────────────
export function PdfAnnotateTool() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [mode, setMode] = useState<Mode>("text");
  const [annotations, setAnnotations] = useState<TextAnnotation[]>([]);
  const [signature, setSignature] = useState<string | null>(null);
  const [sigAnnotations, setSigAnnotations] = useState<
    { id: string; page: number; x: number; y: number; w: number; h: number }[]
  >([]);
  const [showSigPad, setShowSigPad] = useState(false);
  const [pendingText, setPendingText] = useState<{ x: number; y: number } | null>(null);
  const [textInput, setTextInput] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const [fontColor, setFontColor] = useState("#1a1a2e");
  const [status, setStatus] = useState("Upload a PDF to get started.");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Load PDF via PDF.js from CDN ──────────────────────────────────────────
  const loadPdf = useCallback(async (file: File) => {
    setLoading(true);
    setStatus("Loading PDF…");
    try {
      // Dynamically load PDF.js from CDN
      if (!(window as any).pdfjsLib) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
          script.onload = () => resolve();
          script.onerror = reject;
          document.head.appendChild(script);
        });
        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      }
      const pdfjsLib = (window as any).pdfjsLib;
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdfDoc.numPages;
      const images: string[] = [];
      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;
        images.push(canvas.toDataURL("image/png"));
      }
      setPageImages(images);
      setCurrentPage(0);
      setAnnotations([]);
      setSigAnnotations([]);
      setStatus(`PDF loaded — ${numPages} page${numPages !== 1 ? "s" : ""}. Click a mode below to start annotating.`);
    } catch {
      setStatus("Could not load PDF. Make sure it's a valid, unlocked PDF file.");
    }
    setLoading(false);
  }, []);

  // ── Canvas render ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || pageImages.length === 0) return;
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      // Draw text annotations
      annotations
        .filter((a) => a.page === currentPage)
        .forEach((a) => {
          ctx.font = `${a.fontSize}px Arial, sans-serif`;
          ctx.fillStyle = a.color;
          ctx.fillText(a.text, a.x * canvas.width, a.y * canvas.height);
        });
      // Draw signature annotations
      sigAnnotations
        .filter((s) => s.page === currentPage)
        .forEach((s) => {
          if (!signature) return;
          const sImg = new Image();
          sImg.onload = () => {
            ctx.drawImage(sImg, s.x * canvas.width, s.y * canvas.height, s.w * canvas.width, s.h * canvas.height);
          };
          sImg.src = signature;
        });
    };
    img.src = pageImages[currentPage];
  }, [pageImages, currentPage, annotations, sigAnnotations, signature]);

  // ── Canvas click handler ──────────────────────────────────────────────────
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = ((e.clientX - rect.left) * scaleX) / canvas.width;
    const y = ((e.clientY - rect.top) * scaleY) / canvas.height;
    if (mode === "text") {
      setPendingText({ x, y });
      setTextInput("");
    } else if (mode === "signature") {
      if (!signature) {
        setShowSigPad(true);
        return;
      }
      setSigAnnotations((prev) => [
        ...prev,
        { id: crypto.randomUUID(), page: currentPage, x, y, w: 0.25, h: 0.08 },
      ]);
    }
  };

  const addTextAnnotation = () => {
    if (!pendingText || !textInput.trim()) return;
    setAnnotations((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        page: currentPage,
        x: pendingText.x,
        y: pendingText.y,
        text: textInput.trim(),
        fontSize,
        color: fontColor,
      },
    ]);
    setPendingText(null);
    setTextInput("");
  };

  // ── Download annotated PDF ────────────────────────────────────────────────
  const downloadPdf = async () => {
    if (pageImages.length === 0) return;
    setStatus("Generating annotated PDF…");
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    const pW = pdf.internal.pageSize.getWidth();
    const pH = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < pageImages.length; i++) {
      if (i > 0) pdf.addPage();
      // Composite page: base image + all annotations drawn on a temp canvas
      const tempCanvas = document.createElement("canvas");
      const baseImg = await new Promise<HTMLImageElement>((res) => {
        const img = new Image();
        img.onload = () => res(img);
        img.src = pageImages[i];
      });
      tempCanvas.width = baseImg.width;
      tempCanvas.height = baseImg.height;
      const ctx = tempCanvas.getContext("2d")!;
      ctx.drawImage(baseImg, 0, 0);
      // Text
      annotations
        .filter((a) => a.page === i)
        .forEach((a) => {
          ctx.font = `${a.fontSize * 1.5}px Arial, sans-serif`;
          ctx.fillStyle = a.color;
          ctx.fillText(a.text, a.x * tempCanvas.width, a.y * tempCanvas.height);
        });
      // Signatures
      for (const s of sigAnnotations.filter((s) => s.page === i)) {
        if (!signature) continue;
        const sImg = await new Promise<HTMLImageElement>((res) => {
          const img = new Image();
          img.onload = () => res(img);
          img.src = signature;
        });
        ctx.drawImage(sImg, s.x * tempCanvas.width, s.y * tempCanvas.height, s.w * tempCanvas.width, s.h * tempCanvas.height);
      }
      const composite = tempCanvas.toDataURL("image/png");
      pdf.addImage(composite, "PNG", 0, 0, pW, pH, undefined, "FAST");
    }
    pdf.save(`${pdfFile?.name.replace(/\.pdf$/i, "") || "annotated"}-annotated.pdf`);
    setStatus("Annotated PDF downloaded.");
  };

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <div className="grid gap-6">
      {/* Status bar */}
      <div className="rounded-2xl bg-secondary/70 px-4 py-3 text-sm font-medium text-muted-foreground">
        {status}
      </div>

      {/* Upload */}
      {pageImages.length === 0 && (
        <label className="flex min-h-[12rem] cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-primary/40 bg-accent/30 p-6 text-center transition hover:bg-accent/50">
          <Download className="h-9 w-9 text-primary" aria-hidden />
          <span className="text-sm font-black">Drop a PDF or click to choose</span>
          <span className="text-xs text-muted-foreground">Everything stays in your browser — nothing is uploaded.</span>
          <input
            data-testid="input-file-pdf-annotate"
            className="sr-only"
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) { setPdfFile(f); loadPdf(f); }
            }}
          />
        </label>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center gap-3 py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm font-bold">Loading pages…</span>
        </div>
      )}

      {/* Toolbar + Canvas + Sidebar */}
      {pageImages.length > 0 && !loading && (
        <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
          {/* Canvas area */}
          <div className="flex flex-col gap-3">
            {/* Mode toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase tracking-[0.15em] text-muted-foreground">Mode:</span>
              {(["text", "signature", "select"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`inline-flex h-9 items-center gap-2 rounded-xl px-3 text-sm font-black transition ${
                    mode === m ? "bg-primary text-primary-foreground" : "border border-border/70 bg-card hover:bg-secondary"
                  }`}
                >
                  {m === "text" && <Type className="h-4 w-4" />}
                  {m === "signature" && <Pen className="h-4 w-4" />}
                  {m === "select" && <Trash2 className="h-4 w-4" />}
                  {m === "text" ? "Add Text" : m === "signature" ? "Signature" : "Clear All"}
                </button>
              ))}
              {mode === "select" && (
                <button
                  onClick={() => { setAnnotations([]); setSigAnnotations([]); setMode("text"); }}
                  className="inline-flex h-9 items-center gap-2 rounded-xl border border-destructive/50 bg-destructive/10 px-3 text-sm font-black text-destructive"
                >
                  Confirm Clear
                </button>
              )}
            </div>

            {/* Canvas */}
            <div ref={containerRef} className="relative w-full overflow-auto rounded-2xl border border-border/70 bg-card shadow-sm">
              <canvas
                ref={canvasRef}
                className={`w-full ${
                  mode === "text" ? "cursor-text" : mode === "signature" ? "cursor-crosshair" : "cursor-default"
                }`}
                onClick={handleCanvasClick}
                data-testid="canvas-pdf-annotate"
              />
            </div>

            {/* Inline text input popup */}
            {pendingText && (
              <div className="rounded-2xl border border-primary/40 bg-card p-4 shadow-md">
                <p className="mb-3 text-sm font-black">Type your annotation text</p>
                <div className="flex flex-wrap gap-3">
                  <input
                    autoFocus
                    className="h-11 flex-1 rounded-xl border border-border/70 bg-secondary px-3 text-sm text-foreground outline-none focus:border-primary"
                    placeholder="Your text…"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") addTextAnnotation(); if (e.key === "Escape") setPendingText(null); }}
                  />
                  <input
                    type="number"
                    min={8}
                    max={72}
                    className="h-11 w-20 rounded-xl border border-border/70 bg-secondary px-3 text-sm text-foreground outline-none focus:border-primary"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    title="Font size"
                  />
                  <input
                    type="color"
                    className="h-11 w-12 cursor-pointer rounded-xl border border-border/70 bg-secondary p-1"
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                    title="Text color"
                  />
                  <button onClick={addTextAnnotation} className="h-11 rounded-xl bg-primary px-4 text-sm font-black text-primary-foreground">
                    Place
                  </button>
                  <button onClick={() => setPendingText(null)} className="h-11 rounded-xl border border-border/70 bg-card px-4 text-sm font-bold">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Signature pad */}
            {showSigPad && (
              <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-md">
                <SignaturePad
                  onSave={(dataUrl) => { setSignature(dataUrl); setShowSigPad(false); setStatus("Signature saved. Click on the PDF to place it."); }}
                  onCancel={() => setShowSigPad(false)}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Page navigation */}
            {pageImages.length > 1 && (
              <div className="rounded-2xl border border-border/70 bg-card p-4">
                <p className="mb-3 text-xs font-black uppercase tracking-[0.15em] text-muted-foreground">Pages</p>
                <div className="flex flex-wrap gap-2">
                  {pageImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`h-10 w-12 rounded-xl text-sm font-black transition ${
                        i === currentPage ? "bg-primary text-primary-foreground" : "border border-border/70 bg-card hover:bg-secondary"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Signature preview */}
            {signature && (
              <div className="rounded-2xl border border-border/70 bg-card p-4">
                <p className="mb-3 text-xs font-black uppercase tracking-[0.15em] text-muted-foreground">Saved Signature</p>
                <img src={signature} alt="Saved signature" className="w-full rounded-xl border border-border/50" />
                <button
                  onClick={() => { setSignature(null); setSigAnnotations([]); }}
                  className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-border/70 bg-card text-sm font-bold hover:bg-secondary"
                >
                  <Trash2 className="h-4 w-4" /> Remove
                </button>
              </div>
            )}

            {/* Annotation count */}
            <div className="rounded-2xl border border-border/70 bg-card p-4">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.15em] text-muted-foreground">Annotations</p>
              <p className="text-sm">
                <span className="font-black">{annotations.length}</span> text{" "}
                <span className="text-muted-foreground">·</span>{" "}
                <span className="font-black">{sigAnnotations.length}</span> signature{sigAnnotations.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Help */}
            <div className="rounded-2xl bg-secondary/60 p-4">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.15em] text-muted-foreground">How to use</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>① Upload a PDF above</li>
                <li>② Pick <strong>Add Text</strong>, click anywhere on the page, type your annotation</li>
                <li>③ Pick <strong>Signature</strong>, draw in the pad, then click to place it on the PDF</li>
                <li>④ Click <strong>Download PDF</strong> when ready</li>
              </ul>
            </div>

            {/* Download */}
            <button
              onClick={downloadPdf}
              data-testid="button-download-pdf-annotate"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-black text-primary-foreground transition hover:opacity-90"
            >
              <Download className="h-5 w-5" /> Download Annotated PDF
            </button>

            {/* Change PDF */}
            <label className="flex h-10 cursor-pointer items-center justify-center rounded-xl border border-border/70 bg-card text-sm font-bold hover:bg-secondary">
              Change PDF
              <input
                className="sr-only"
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { setPdfFile(f); loadPdf(f); }
                }}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
