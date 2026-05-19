# PDF Annotate Tool — App.tsx Patch Instructions

This file documents the 5 manual insertions to apply in `client/src/App.tsx`.
All changes are additive (no deletions). Apply in order.

---

## 1. Import (after `import NotFound from "@/pages/not-found";`)

```ts
import PdfAnnotateTool from "@/components/PdfAnnotateTool";
```

---

## 2. tools[] entry (before the `summarizer` entry)

```ts
{ id: "pdf-annotate", slug: "pdf-annotate-tool", category: "utilities", name: "PDF Annotate", description: "Add text and a signature to any PDF in your browser.", icon: FileText, keyword: "add text to pdf online", example: "Use it to add a typed or drawn signature and custom text to a PDF — no upload to any server." },
```

---

## 3. UtilityPanels (before `return <TextTool />;`)

```tsx
if (activeId === "pdf-annotate") return <PdfAnnotateTool />;
```

---

## 4. toolTranslations ES (before `discount:` key)

```ts
"pdf-annotate": { name: "Anotar PDF", description: "Agrega texto y firma a cualquier PDF en tu navegador.", keyword: "agregar texto a PDF en línea", example: "Úsala para agregar una firma escrita o dibujada y texto personalizado a un PDF sin subirlo a ningún servidor." },
```

---

## 5. seoLandings[] entries (before closing `];` of seoLandings, i.e. before `const blogPosts`)

```ts
{ slug: "add-text-to-pdf-online", title: "Add Text to PDF Online — Free No-Upload Tool", description: "Add custom text to any PDF page in your browser. No account, no file upload to a server.", toolSlug: "pdf-annotate-tool", useCase: "Use this when you need to annotate a PDF with a label, note, date, or short message without installing software.", steps: ["Upload your PDF.", "Type the text you want to add.", "Set position, font size, and color.", "Click Apply & Download."], example: "Add 'Approved — May 2026' to page 1 of a contract PDF and download the result instantly.", howWorks: "The tool uses pdf-lib entirely in your browser to modify the PDF bytes and embed new text. Nothing is sent to a server.", equation: "Your file never leaves your device — all processing is done client-side." },
{ slug: "sign-pdf-online-free", title: "Sign PDF Online Free — No Login Required", description: "Add a typed, drawn, or uploaded signature to a PDF in your browser. Free, instant, no account needed.", toolSlug: "pdf-annotate-tool", useCase: "Use this for quick signatures on contracts, forms, permission slips, or any document that needs your name.", steps: ["Upload the PDF.", "Choose Type, Draw, or Upload for your signature.", "Set the position on the page.", "Download the signed PDF."], example: "Type your name in italic to sign a simple agreement, or draw your real signature with the canvas tool.", howWorks: "Typed signatures are embedded as styled text. Drawn or uploaded signatures are placed as transparent PNG images on the page.", equation: "Signature = image or text overlay embedded into the PDF page at your chosen X/Y coordinates." },
{ slug: "add-signature-to-pdf-free", title: "Add Signature to PDF Free — Browser-Based Tool", description: "Place a typed, drawn, or image signature on any page of a PDF file. Free, private, no upload.", toolSlug: "pdf-annotate-tool", useCase: "Use this when you receive a PDF form or document and need to sign it without printing.", steps: ["Open the PDF Annotate tool.", "Upload your PDF file.", "Go to the signature section.", "Choose your signature style and download."], example: "Draw your signature with the canvas, position it at the bottom of a lease page, and download the signed copy.", howWorks: "The browser reads the PDF, stamps the signature as an embedded image or text on the selected page, and saves a new file.", equation: "Output PDF = Original PDF bytes + signature overlay at (X, Y) on chosen page." },
{ slug: "annotate-pdf-without-adobe", title: "Annotate PDF Without Adobe — Free Online Tool", description: "Add text and signatures to a PDF without Adobe Acrobat or any installed software.", toolSlug: "pdf-annotate-tool", useCase: "Use this when you need basic PDF annotation but don't have Adobe or another PDF editor installed.", steps: ["Upload your PDF (stays in your browser).", "Add text with font size and color options.", "Add a signature.", "Download the annotated PDF."], example: "A one-page invoice can have an approval note and a manager's signature added in under a minute.", howWorks: "pdf-lib runs in the browser and edits the PDF directly in memory — no Adobe dependency, no server, no cost.", equation: "All PDF editing logic runs 100% client-side via WebAssembly-compatible JavaScript." },
```

---

> After applying all patches, delete this file.
