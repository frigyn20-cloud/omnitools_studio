import { useRef, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Download, FileUp, Pen, Type, Trash2, Plus } from "lucide-react";

type Annotation =
  | { kind: "text"; page: number; x: number; y: number; text: string; size: number; r: number; g: number; b: number }
  | { kind: "sig"; page: number; x: number; y: number; w: number; h: number; dataUrl: string };

export default function PdfSignatureTextTool() {
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [selectedPage, setSelectedPage] = useState(1);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [mode, setMode] = useState<"text" | "sig">("text");
  const [downloading, setDownloading] = useState(false);

  const [textInput, setTextInput] = useState("Your text here");
  const [fontSize, setFontSize] = useState(14);
  const [textColor, setTextColor] = useState("#000000");
  const [posX, setPosX] = useState(72);
  const [posY, setPosY] = useState(700);

  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSig, setHasSig] = useState(false);
  const [sigX, setSigX] = useState(72);
  const [sigY, setSigY] = useState(600);
  const [sigW, setSigW] = useState(200);
  const [sigH, setSigH] = useState(60);
  const lastPt = useRef<{ x: number; y: number } | null>(null);

  function hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return { r, g, b };
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const ab = await file.arrayBuffer();
    const bytes = new Uint8Array(ab);
    const doc = await PDFDocument.load(bytes);
    setPageCount(doc.getPageCount());
    setPdfBytes(bytes);
    setAnnotations([]);
  }

  function addTextAnnotation() {
    if (!textInput.trim()) return;
    const { r, g, b } = hexToRgb(textColor);
    setAnnotations((prev) => [
      ...prev,
      { kind: "text", page: selectedPage, x: posX, y: posY, text: textInput, size: fontSize, r, g, b },
    ]);
  }

  function addSignatureAnnotation() {
    const canvas = sigCanvasRef.current;
    if (!canvas || !hasSig) return;
    const dataUrl = canvas.toDataURL("image/png");
    setAnnotations((prev) => [
      ...prev,
      { kind: "sig", page: selectedPage, x: sigX, y: sigY, w: sigW, h: sigH, dataUrl },
    ]);
  }

  function clearSigCanvas() {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    setHasSig(false);
  }

  function getSigPoint(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    const canvas = sigCanvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function startDraw(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    e.preventDefault();
    setIsDrawing(true);
    lastPt.current = getSigPoint(e);
  }

  function draw(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = sigCanvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const pt = getSigPoint(e);
    if (lastPt.current) {
      ctx.beginPath();
      ctx.moveTo(lastPt.current.x, lastPt.current.y);
      ctx.lineTo(pt.x, pt.y);
      ctx.strokeStyle = "#1a1a2e";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.stroke();
      setHasSig(true);
    }
    lastPt.current = pt;
  }

  function endDraw() {
    setIsDrawing(false);
    lastPt.current = null;
  }

  async function handleDownload() {
    if (!pdfBytes || annotations.length === 0) return;
    setDownloading(true);
    try {
      const doc = await PDFDocument.load(pdfBytes);
      const font = await doc.embedFont(StandardFonts.Helvetica);
      for (const ann of annotations) {
        const page = doc.getPage(ann.page - 1);
        if (ann.kind === "text") {
          page.drawText(ann.text, {
            x: ann.x,
            y: ann.y,
            size: ann.size,
            font,
            color: rgb(ann.r, ann.g, ann.b),
          });
        } else if (ann.kind === "sig") {
          const base64 = ann.dataUrl.replace(/^data:image\/png;base64,/, "");
          const pngBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
          const pngImage = await doc.embedPng(pngBytes);
          page.drawImage(pngImage, { x: ann.x, y: ann.y, width: ann.w, height: ann.h });
        }
      }
      const outBytes = await doc.save();
      const blob = new Blob([outBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName.replace(".pdf", "") + "-edited.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload */}
      <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
        <label className="cursor-pointer flex flex-col items-center gap-3">
          <FileUp className="w-10 h-10 text-teal-600" />
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-100">Upload your PDF</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Click to choose a PDF file</p>
          </div>
          <input type="file" accept="application/pdf" className="sr-only" onChange={handleFileUpload} />
        </label>
        {fileName && (
          <p className="mt-3 text-sm font-medium text-teal-700 dark:text-teal-400">
            ✓ {fileName} — {pageCount} page{pageCount !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {pdfBytes && (
        <>
          {/* Page selector */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Target page
            </label>
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(Number(e.target.value))}
              className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            >
              {Array.from({ length: pageCount }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Page {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Mode tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setMode("text")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === "text"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <Type className="w-4 h-4" /> Add Text
            </button>
            <button
              onClick={() => setMode("sig")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === "sig"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <Pen className="w-4 h-4" /> Add Signature
            </button>
          </div>

          {/* Text panel */}
          {mode === "text" && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Text</label>
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                  placeholder="Enter text to add..."
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Font size</label>
                  <input
                    type="number"
                    value={fontSize}
                    min={6}
                    max={72}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Color</label>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-full h-[38px] border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">X (from left)</label>
                  <input
                    type="number"
                    value={posX}
                    onChange={(e) => setPosX(Number(e.target.value))}
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Y (from bottom)</label>
                  <input
                    type="number"
                    value={posY}
                    onChange={(e) => setPosY(Number(e.target.value))}
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Coordinates are in PDF points (1 pt = 1/72 inch). A standard 8.5×11" page is 612 × 792 pts. Y=0 is the bottom edge.
              </p>
              <button
                onClick={addTextAnnotation}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Text to Page {selectedPage}
              </button>
            </div>
          )}

          {/* Signature panel */}
          {mode === "sig" && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Draw your signature
                </label>
                <canvas
                  ref={sigCanvasRef}
                  width={500}
                  height={140}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-lg bg-white cursor-crosshair touch-none"
                  style={{ touchAction: "none" }}
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={endDraw}
                  onMouseLeave={endDraw}
                  onTouchStart={startDraw}
                  onTouchMove={draw}
                  onTouchEnd={endDraw}
                />
                <button
                  onClick={clearSigCanvas}
                  className="mt-2 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">X</label>
                  <input type="number" value={sigX} onChange={(e) => setSigX(Number(e.target.value))} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Y (from bottom)</label>
                  <input type="number" value={sigY} onChange={(e) => setSigY(Number(e.target.value))} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Width</label>
                  <input type="number" value={sigW} onChange={(e) => setSigW(Number(e.target.value))} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Height</label>
                  <input type="number" value={sigH} onChange={(e) => setSigH(Number(e.target.value))} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100" />
                </div>
              </div>
              <button
                onClick={addSignatureAnnotation}
                disabled={!hasSig}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Signature to Page {selectedPage}
              </button>
            </div>
          )}

          {/* Annotation queue */}
          {annotations.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Queued additions ({annotations.length})
                </h3>
                <button
                  onClick={() => setAnnotations([])}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  Clear all
                </button>
              </div>
              <ul className="space-y-1.5">
                {annotations.map((ann, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-600 dark:text-gray-300"
                  >
                    <span>
                      {ann.kind === "text" ? (
                        <>
                          <Type className="inline w-3.5 h-3.5 mr-1" />
                          <strong>Text</strong> — &ldquo;{ann.text}&rdquo; at ({ann.x}, {ann.y}) &middot; Page {ann.page}
                        </>
                      ) : (
                        <>
                          <Pen className="inline w-3.5 h-3.5 mr-1" />
                          <strong>Signature</strong> at ({ann.x}, {ann.y}) &middot; Page {ann.page}
                        </>
                      )}
                    </span>
                    <button
                      onClick={() => setAnnotations((prev) => prev.filter((_, j) => j !== i))}
                      className="ml-3 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Download */}
          <button
            onClick={handleDownload}
            disabled={annotations.length === 0 || downloading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            {downloading ? "Generating PDF…" : "Download Edited PDF"}
          </button>
        </>
      )}
    </div>
  );
}
