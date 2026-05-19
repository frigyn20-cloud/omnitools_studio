import {
  BadgeDollarSign,
  Calculator,
  CalendarDays,
  Clock,
  FileText,
  Gauge,
  KeyRound,
  NotebookPen,
  QrCode,
  RefreshCw,
  Brain,
  Sparkles,
  Timer,
  Type,
  WalletCards,
} from "lucide-react";

export type Category = "calculators" | "converters" | "utilities";

export type Tool = {
  id: string;
  slug: string;
  category: Category;
  name: string;
  description: string;
  icon: typeof Calculator;
  keyword: string;
  example: string;
};

export const tools: Tool[] = [
  { id: "after-tax-salary", slug: "after-tax-salary-calculator", category: "calculators", name: "After Tax Salary", description: "Estimate take-home pay from a 55k salary after taxes and other income levels.", icon: WalletCards, keyword: "55k salary after taxes", example: "Use it to estimate take-home pay from a 55k salary after taxes, including federal, state, FICA, and other deductions." },
  { id: "discount", slug: "discount-calculator", category: "calculators", name: "Discount", description: "Sale price, tax, and saved amount.", icon: BadgeDollarSign, keyword: "discount calculator with tax", example: "Use it to check a $120 item with a 25% discount and 9.5% tax before you buy." },
  { id: "tip", slug: "tip-calculator", category: "calculators", name: "Tip", description: "Split a bill with tip.", icon: WalletCards, keyword: "tip calculator split bill", example: "Use it to split an $86 dinner bill between three people with a 20% tip." },
  { id: "budget", slug: "budget-calculator", category: "calculators", name: "Budget", description: "Income, expenses, savings rate.", icon: Gauge, keyword: "monthly budget calculator", example: "Use it to compare income, fixed costs, variable costs, and a monthly savings goal." },
  { id: "loan", slug: "loan-calculator", category: "calculators", name: "Loan", description: "Monthly payment and total interest.", icon: Calculator, keyword: "loan payment calculator", example: "Use it to estimate the monthly payment on a $25,000 loan over five years." },
  { id: "savings", slug: "savings-calculator", category: "calculators", name: "Savings", description: "Compound growth with deposits.", icon: Sparkles, keyword: "compound savings calculator", example: "Use it to project savings growth from an initial deposit and monthly contributions." },
  { id: "calories", slug: "calorie-calculator", category: "calculators", name: "Calories", description: "BMR and daily calorie target.", icon: Gauge, keyword: "daily calorie calculator", example: "Use it to estimate maintenance calories, then adjust for cutting or bulking." },
  { id: "date", slug: "date-calculator", category: "calculators", name: "Date Math", description: "Add days or compare two dates.", icon: CalendarDays, keyword: "date calculator add days", example: "Use it to find the date 45 days from today or count days between two deadlines." },
  { id: "units", slug: "unit-converter", category: "converters", name: "Units", description: "Length, weight, temperature, volume.", icon: RefreshCw, keyword: "unit converter", example: "Use it to convert meters to feet, kilograms to pounds, liters to gallons, or Celsius to Fahrenheit." },
  { id: "currency", slug: "currency-converter", category: "converters", name: "Currency", description: "Live exchange rates with fallback.", icon: BadgeDollarSign, keyword: "currency converter", example: "Use it to estimate USD to EUR, GBP, JPY, CAD, AUD, CHF, or MXN conversions." },
  { id: "timezones", slug: "time-zone-converter", category: "converters", name: "Time Zones", description: "Compare cities and convert times.", icon: Clock, keyword: "time zone converter", example: "Use it to compare Los Angeles, New York, London, Moscow, Dubai, and Tokyo." },
  { id: "timestamps", slug: "timestamp-converter", category: "converters", name: "Timestamps", description: "Unix, ISO, and local date strings.", icon: Timer, keyword: "unix timestamp converter", example: "Use it to turn Unix seconds into ISO and local time formats." },
  { id: "data", slug: "data-format-converter", category: "converters", name: "Data Formats", description: "JSON, Base64, and CSV tools.", icon: FileText, keyword: "JSON Base64 CSV converter", example: "Use it to format JSON, minify JSON, encode Base64, decode Base64, or convert CSV to JSON." },
  { id: "pdf", slug: "file-to-pdf-converter", category: "converters", name: "JSON & CSV to PDF", description: "Convert JSON, CSV, text, and images into PDFs.", icon: FileText, keyword: "json to pdf converter", example: "Use it to convert JSON to PDF, convert a CSV file to PDF, or create a simple PDF from text, PNG, or JPG files." },
  { id: "qr", slug: "qr-code-generator", category: "utilities", name: "QR Code", description: "Generate a downloadable QR code.", icon: QrCode, keyword: "free QR code generator", example: "Use it to create a QR code for a website, contact card, event note, or plain text." },
  { id: "words", slug: "word-counter", category: "utilities", name: "Word Counter", description: "Counts, density, reading time.", icon: Type, keyword: "word counter", example: "Use it to check word count, character count, sentence count, and reading time." },
  { id: "notes", slug: "online-notepad", category: "utilities", name: "Notes Pad", description: "Fast scratch notes for the session.", icon: NotebookPen, keyword: "online notepad", example: "Use it as a temporary scratch pad, then download your note as a text file." },
  { id: "stopwatch", slug: "online-stopwatch", category: "utilities", name: "Stopwatch", description: "Lap-ready stopwatch.", icon: Timer, keyword: "online stopwatch", example: "Use it to time study sessions, workouts, calls, or quick personal tasks." },
  { id: "countdown", slug: "countdown-timer", category: "utilities", name: "Countdown", description: "A simple focus timer.", icon: Clock, keyword: "countdown timer", example: "Use it as a 25-minute focus timer or any custom countdown." },
  { id: "password", slug: "password-generator", category: "utilities", name: "Password", description: "Generate strong passwords.", icon: KeyRound, keyword: "password generator", example: "Use it to create a strong random password with your preferred length." },
  { id: "text", slug: "text-tools", category: "utilities", name: "Text Tools", description: "Case, slug, reverse, cleanup.", icon: Sparkles, keyword: "online text tools", example: "Use it to uppercase, lowercase, title case, slugify, clean, or reverse text." },
  { id: "pdf-annotate", slug: "pdf-annotate-tool", category: "utilities", name: "PDF Annotate", description: "Add text and a signature to any PDF in your browser.", icon: FileText, keyword: "add text to pdf online", example: "Use it to add a typed or drawn signature and custom text to a PDF — no upload to any server." },
  { id: "summarizer", slug: "ai-text-summarizer", category: "utilities", name: "AI Summarizer", description: "Summarize any text in seconds with AI.", icon: Brain, keyword: "ai text summarizer free", example: "Use it to summarize articles, essays, notes, or any long text into a short, clear summary." },
];

export const toolTranslations: Record<string, { name: string; description: string; keyword: string; example: string }> = {
  "pdf-annotate": { name: "Anotar PDF", description: "Agrega texto y firma a cualquier PDF en tu navegador.", keyword: "agregar texto a PDF en l\u00ednea", example: "\u00dasala para agregar una firma escrita o dibujada y texto personalizado a un PDF sin subirlo a ning\u00fan servidor." },
  discount: { name: "Descuento", description: "Precio final, impuestos y ahorro.", keyword: "calculadora de descuentos con impuestos", example: "\u00dasala para revisar un art\u00edculo de $120 con 25% de descuento y 9.5% de impuesto antes de comprar." },
  tip: { name: "Propina", description: "Divide una cuenta con propina.", keyword: "calculadora de propina para dividir cuenta", example: "\u00dasala para dividir una cena de $86 entre tres personas con 20% de propina." },
  budget: { name: "Presupuesto", description: "Ingresos, gastos y tasa de ahorro.", keyword: "calculadora de presupuesto mensual", example: "\u00dasala para comparar ingresos, costos fijos, costos variables y una meta mensual de ahorro." },
  loan: { name: "Pr\u00e9stamo", description: "Pago mensual e inter\u00e9s total.", keyword: "calculadora de pagos de pr\u00e9stamo", example: "\u00dasala para estimar el pago mensual de un pr\u00e9stamo de $25,000 durante cinco a\u00f1os." },
  savings: { name: "Ahorros", description: "Crecimiento compuesto con dep\u00f3sitos.", keyword: "calculadora de ahorro compuesto", example: "\u00dasala para proyectar el crecimiento de tus ahorros con un dep\u00f3sito inicial y aportes mensuales." },
  calories: { name: "Calor\u00edas", description: "BMR y meta diaria de calor\u00edas.", keyword: "calculadora diaria de calor\u00edas", example: "\u00dasala para estimar calor\u00edas de mantenimiento y ajustar para bajar o subir de peso." },
  date: { name: "Fechas", description: "Suma d\u00edas o compara dos fechas.", keyword: "calculadora de fechas para sumar d\u00edas", example: "\u00dasala para encontrar la fecha dentro de 45 d\u00edas o contar d\u00edas entre dos fechas l\u00edmite." },
  units: { name: "Unidades", description: "Longitud, peso, temperatura y volumen.", keyword: "conversor de unidades", example: "\u00dasala para convertir metros a pies, kilogramos a libras, litros a galones o Celsius a Fahrenheit." },
  currency: { name: "Moneda", description: "Tipos de cambio con respaldo.", keyword: "conversor de moneda", example: "\u00dasala para estimar conversiones de USD a EUR, GBP, JPY, CAD, AUD, CHF o MXN." },
  timezones: { name: "Zonas horarias", description: "Compara ciudades y convierte horas.", keyword: "conversor de zonas horarias", example: "\u00dasala para comparar Los \u00c1ngeles, Nueva York, Londres, Mosc\u00fa, Dub\u00e1i y Tokio." },
  timestamps: { name: "Timestamps", description: "Unix, ISO y fechas locales.", keyword: "conversor de timestamp Unix", example: "\u00dasala para convertir segundos Unix en formatos ISO y hora local." },
  data: { name: "Formatos de datos", description: "Herramientas JSON, Base64 y CSV.", keyword: "conversor JSON Base64 CSV", example: "\u00dasala para formatear JSON, minificar JSON, codificar Base64, decodificar Base64 o convertir CSV a JSON." },
  pdf: { name: "Archivo a PDF", description: "Convierte texto o im\u00e1genes a PDF.", keyword: "conversor de archivos a PDF", example: "\u00dasala para crear un PDF simple desde texto, CSV, JSON, PNG o JPG." },
  qr: { name: "C\u00f3digo QR", description: "Genera un c\u00f3digo QR descargable.", keyword: "generador gratuito de c\u00f3digos QR", example: "\u00dasala para crear un c\u00f3digo QR para un sitio web, contacto, evento o texto simple." },
  words: { name: "Contador de palabras", description: "Conteos, densidad y tiempo de lectura.", keyword: "contador de palabras", example: "\u00dasala para revisar palabras, caracteres, oraciones y tiempo de lectura." },
  notes: { name: "Bloc de notas", description: "Notas r\u00e1pidas para la sesi\u00f3n.", keyword: "bloc de notas en l\u00ednea", example: "\u00dasala como bloc temporal y descarga tu nota como archivo de texto." },
  stopwatch: { name: "Cron\u00f3metro", description: "Cron\u00f3metro con vueltas.", keyword: "cron\u00f3metro en l\u00ednea", example: "\u00dasala para medir sesiones de estudio, entrenamientos, llamadas o tareas r\u00e1pidas." },
  countdown: { name: "Cuenta regresiva", description: "Temporizador simple de enfoque.", keyword: "temporizador de cuenta regresiva", example: "\u00dasala como temporizador de enfoque de 25 minutos o cualquier cuenta personalizada." },
  password: { name: "Contrase\u00f1a", description: "Genera contrase\u00f1as fuertes.", keyword: "generador de contrase\u00f1as", example: "\u00dasala para crear una contrase\u00f1a aleatoria fuerte con la longitud que prefieras." },
  text: { name: "Herramientas de texto", description: "May\u00fasculas, slug, reversa y limpieza.", keyword: "herramientas de texto en l\u00ednea", example: "\u00dasala para may\u00fasculas, min\u00fasculas, t\u00edtulo, slug, limpiar o invertir texto." },
  summarizer: { name: "Resumen con IA", description: "Resume cualquier texto en segundos con IA.", keyword: "resumidor de texto con IA gratis", example: "\u00dasala para resumir art\u00edculos, ensayos, notas o cualquier texto largo en un resumen breve y claro." },
};
