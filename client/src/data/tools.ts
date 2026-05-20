import {
  BadgeDollarSign,
  Brain,
  Calculator,
  CalendarDays,
  Clock,
  FileText,
  Gauge,
  KeyRound,
  NotebookPen,
  QrCode,
  RefreshCw,
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
  { id: "summarizer", slug: "ai-text-summarizer", category: "utilities", name: "AI Summarizer", description: "Summarize any text in seconds with AI.", icon: Brain, keyword: "ai text summarizer free", example: "Use it to summarize articles, essays, notes, or any long text into a short, clear summary." },
  { id: "pdf-annotate", slug: "pdf-signature-text-tool", category: "utilities", name: "PDF Annotate", description: "Add text and signatures to any PDF in your browser.", icon: FileText, keyword: "pdf signature tool online", example: "Use it to add text annotations or draw a signature on any PDF file, then download the annotated result." },
];
