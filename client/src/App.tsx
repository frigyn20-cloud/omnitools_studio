import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, Switch, Route, Router, useParams } from "wouter";
import { useBrowserLocation } from "wouter/use-browser-location";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClientProvider } from "@tanstack/react-query";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import {
  BadgeDollarSign,
  Calculator,
  CalendarDays,
  Clock,
  Copy,
  Download,
  FileText,
  Gauge,
  KeyRound,
  Moon,
  NotebookPen,
  QrCode,
  RefreshCw,
  Search,
  Sparkles,
  Sun,
  Timer,
  Type,
  WalletCards,
} from "lucide-react";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

type Category = "calculators" | "converters" | "utilities";
type ToolFilter = "all" | Category;
type Language = "en" | "es";

type Tool = {
  id: string;
  slug: string;
  category: Category;
  name: string;
  description: string;
  icon: typeof Calculator;
  keyword: string;
  example: string;
};

type SeoLanding = {
  slug: string;
  title: string;
  description: string;
  toolSlug: string;
  useCase: string;
  steps: string[];
};

type BlogPost = {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  sections: { heading: string; body: string }[];
};

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

type ThemeContextValue = {
  dark: boolean;
  setDark: (dark: boolean) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const ThemeContext = createContext<ThemeContextValue | null>(null);

function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageContext.Provider");
  return context;
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeContext.Provider");
  return context;
}

const tools: Tool[] = [
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
  { id: "pdf", slug: "file-to-pdf-converter", category: "converters", name: "File to PDF", description: "Turn text or images into PDFs.", icon: FileText, keyword: "file to PDF converter", example: "Use it to create a simple PDF from text, CSV, JSON, PNG, or JPG files." },
  { id: "qr", slug: "qr-code-generator", category: "utilities", name: "QR Code", description: "Generate a downloadable QR code.", icon: QrCode, keyword: "free QR code generator", example: "Use it to create a QR code for a website, contact card, event note, or plain text." },
  { id: "words", slug: "word-counter", category: "utilities", name: "Word Counter", description: "Counts, density, reading time.", icon: Type, keyword: "word counter", example: "Use it to check word count, character count, sentence count, and reading time." },
  { id: "notes", slug: "online-notepad", category: "utilities", name: "Notes Pad", description: "Fast scratch notes for the session.", icon: NotebookPen, keyword: "online notepad", example: "Use it as a temporary scratch pad, then download your note as a text file." },
  { id: "stopwatch", slug: "online-stopwatch", category: "utilities", name: "Stopwatch", description: "Lap-ready stopwatch.", icon: Timer, keyword: "online stopwatch", example: "Use it to time study sessions, workouts, calls, or quick personal tasks." },
  { id: "countdown", slug: "countdown-timer", category: "utilities", name: "Countdown", description: "A simple focus timer.", icon: Clock, keyword: "countdown timer", example: "Use it as a 25-minute focus timer or any custom countdown." },
  { id: "password", slug: "password-generator", category: "utilities", name: "Password", description: "Generate strong passwords.", icon: KeyRound, keyword: "password generator", example: "Use it to create a strong random password with your preferred length." },
  { id: "text", slug: "text-tools", category: "utilities", name: "Text Tools", description: "Case, slug, reverse, cleanup.", icon: Sparkles, keyword: "online text tools", example: "Use it to uppercase, lowercase, title case, slugify, clean, or reverse text." },
];

const toolTranslations: Record<string, { name: string; description: string; keyword: string; example: string }> = {
  discount: { name: "Descuento", description: "Precio final, impuestos y ahorro.", keyword: "calculadora de descuentos con impuestos", example: "Úsala para revisar un artículo de $120 con 25% de descuento y 9.5% de impuesto antes de comprar." },
  tip: { name: "Propina", description: "Divide una cuenta con propina.", keyword: "calculadora de propina para dividir cuenta", example: "Úsala para dividir una cena de $86 entre tres personas con 20% de propina." },
  budget: { name: "Presupuesto", description: "Ingresos, gastos y tasa de ahorro.", keyword: "calculadora de presupuesto mensual", example: "Úsala para comparar ingresos, costos fijos, costos variables y una meta mensual de ahorro." },
  loan: { name: "Préstamo", description: "Pago mensual e interés total.", keyword: "calculadora de pagos de préstamo", example: "Úsala para estimar el pago mensual de un préstamo de $25,000 durante cinco años." },
  savings: { name: "Ahorros", description: "Crecimiento compuesto con depósitos.", keyword: "calculadora de ahorro compuesto", example: "Úsala para proyectar el crecimiento de tus ahorros con un depósito inicial y aportes mensuales." },
  calories: { name: "Calorías", description: "BMR y meta diaria de calorías.", keyword: "calculadora diaria de calorías", example: "Úsala para estimar calorías de mantenimiento y ajustar para bajar o subir de peso." },
  date: { name: "Fechas", description: "Suma días o compara dos fechas.", keyword: "calculadora de fechas para sumar días", example: "Úsala para encontrar la fecha dentro de 45 días o contar días entre dos fechas límite." },
  units: { name: "Unidades", description: "Longitud, peso, temperatura y volumen.", keyword: "conversor de unidades", example: "Úsala para convertir metros a pies, kilogramos a libras, litros a galones o Celsius a Fahrenheit." },
  currency: { name: "Moneda", description: "Tipos de cambio con respaldo.", keyword: "conversor de moneda", example: "Úsala para estimar conversiones de USD a EUR, GBP, JPY, CAD, AUD, CHF o MXN." },
  timezones: { name: "Zonas horarias", description: "Compara ciudades y convierte horas.", keyword: "conversor de zonas horarias", example: "Úsala para comparar Los Ángeles, Nueva York, Londres, Moscú, Dubái y Tokio." },
  timestamps: { name: "Timestamps", description: "Unix, ISO y fechas locales.", keyword: "conversor de timestamp Unix", example: "Úsala para convertir segundos Unix en formatos ISO y hora local." },
  data: { name: "Formatos de datos", description: "Herramientas JSON, Base64 y CSV.", keyword: "conversor JSON Base64 CSV", example: "Úsala para formatear JSON, minificar JSON, codificar Base64, decodificar Base64 o convertir CSV a JSON." },
  pdf: { name: "Archivo a PDF", description: "Convierte texto o imágenes a PDF.", keyword: "conversor de archivos a PDF", example: "Úsala para crear un PDF simple desde texto, CSV, JSON, PNG o JPG." },
  qr: { name: "Código QR", description: "Genera un código QR descargable.", keyword: "generador gratuito de códigos QR", example: "Úsala para crear un código QR para un sitio web, contacto, evento o texto simple." },
  words: { name: "Contador de palabras", description: "Conteos, densidad y tiempo de lectura.", keyword: "contador de palabras", example: "Úsala para revisar palabras, caracteres, oraciones y tiempo de lectura." },
  notes: { name: "Bloc de notas", description: "Notas rápidas para la sesión.", keyword: "bloc de notas en línea", example: "Úsala como bloc temporal y descarga tu nota como archivo de texto." },
  stopwatch: { name: "Cronómetro", description: "Cronómetro con vueltas.", keyword: "cronómetro en línea", example: "Úsala para medir sesiones de estudio, entrenamientos, llamadas o tareas rápidas." },
  countdown: { name: "Cuenta regresiva", description: "Temporizador simple de enfoque.", keyword: "temporizador de cuenta regresiva", example: "Úsala como temporizador de enfoque de 25 minutos o cualquier cuenta personalizada." },
  password: { name: "Contraseña", description: "Genera contraseñas fuertes.", keyword: "generador de contraseñas", example: "Úsala para crear una contraseña aleatoria fuerte con la longitud que prefieras." },
  text: { name: "Herramientas de texto", description: "Mayúsculas, slug, reversa y limpieza.", keyword: "herramientas de texto en línea", example: "Úsala para mayúsculas, minúsculas, título, slug, limpiar o invertir texto." },
};

const seoLandings: SeoLanding[] = [
  { slug: "25-percent-off-calculator", title: "25% Off Calculator", description: "Calculate the sale price, discount saved, tax, and final total when an item is 25 percent off.", toolSlug: "discount-calculator", useCase: "This page is useful when a store shows a 25% discount and you want to know the real checkout price before buying.", steps: ["Enter the original price.", "Set the discount field to 25%.", "Add your local sales tax if needed.", "Compare the final total with your budget."] },
  { slug: "20-percent-off-calculator", title: "20% Off Calculator", description: "Quickly calculate a 20 percent discount, amount saved, and final price after tax.", toolSlug: "discount-calculator", useCase: "Use this when a product is marked 20% off and you need a fast estimate of the real price.", steps: ["Enter the sticker price.", "Set discount to 20%.", "Add tax if the store applies sales tax.", "Use the final total to decide if the deal is worth it."] },
  { slug: "30-percent-off-calculator", title: "30% Off Calculator", description: "Find the final sale price and savings for 30 percent off deals.", toolSlug: "discount-calculator", useCase: "Great for clothing, electronics, and seasonal sales where the discount is listed as 30% off.", steps: ["Type the original price.", "Use 30 in the discount field.", "Add tax if you want a checkout estimate.", "Review discount saved and final total."] },
  { slug: "discount-calculator-with-sales-tax", title: "Discount Calculator With Sales Tax", description: "Calculate discount savings and estimated after-tax checkout total in one place.", toolSlug: "discount-calculator", useCase: "Use this when the sale sign shows the discount, but you still need to include tax.", steps: ["Enter original price.", "Enter discount percentage.", "Enter sales tax percentage.", "Check the final total."] },
  { slug: "tip-calculator-for-2-people", title: "Tip Calculator for 2 People", description: "Split a restaurant bill and tip between two people.", toolSlug: "tip-calculator", useCase: "Use this for dates, lunches, coffee meetings, and shared restaurant bills.", steps: ["Enter the bill amount.", "Choose your tip percentage.", "Set people to 2.", "Use the per-person result."] },
  { slug: "tip-calculator-for-4-people", title: "Tip Calculator for 4 People", description: "Calculate tip and split a bill evenly between four people.", toolSlug: "tip-calculator", useCase: "Useful for group dinners when everyone wants a quick fair split.", steps: ["Enter the total bill.", "Pick 15%, 18%, 20%, or another tip.", "Set people to 4.", "Share the per-person amount."] },
  { slug: "20-percent-tip-calculator", title: "20% Tip Calculator", description: "Calculate a 20 percent tip and total bill amount.", toolSlug: "tip-calculator", useCase: "Use this when you want a standard strong tip without doing mental math.", steps: ["Enter the restaurant bill.", "Set tip to 20%.", "Add the number of people if splitting.", "Review total and per-person cost."] },
  { slug: "monthly-budget-calculator-students", title: "Monthly Budget Calculator for Students", description: "Plan student income, expenses, and savings goals month by month.", toolSlug: "budget-calculator", useCase: "Helpful for students balancing part-time work, rent, food, school costs, and savings.", steps: ["Enter monthly income.", "Add fixed expenses like rent and subscriptions.", "Add flexible expenses like food and gas.", "Set a savings target and review remaining money."] },
  { slug: "monthly-savings-goal-calculator", title: "Monthly Savings Goal Calculator", description: "Estimate how much you can save monthly after expenses.", toolSlug: "budget-calculator", useCase: "Use this before setting a savings goal for travel, emergency funds, school, or a purchase.", steps: ["Enter income.", "Enter fixed and variable costs.", "Add desired savings.", "Check if the plan is realistic."] },
  { slug: "car-loan-payment-calculator", title: "Car Loan Payment Calculator", description: "Estimate monthly car loan payments and total interest.", toolSlug: "loan-calculator", useCase: "Use this before visiting a dealership or comparing financing offers.", steps: ["Enter loan amount.", "Enter interest rate.", "Choose loan term.", "Review monthly payment and total interest."] },
  { slug: "personal-loan-payment-calculator", title: "Personal Loan Payment Calculator", description: "Calculate estimated personal loan payments by amount, rate, and term.", toolSlug: "loan-calculator", useCase: "Useful for comparing loan options before applying.", steps: ["Enter the borrowed amount.", "Add APR or interest rate.", "Enter the term in years.", "Compare the payment with your budget."] },
  { slug: "compound-interest-savings-calculator", title: "Compound Interest Savings Calculator", description: "Project savings growth with deposits and compound interest.", toolSlug: "savings-calculator", useCase: "Use this to see how monthly deposits can grow over time.", steps: ["Enter starting savings.", "Add monthly contribution.", "Enter expected annual return.", "Set the number of years."] },
  { slug: "emergency-fund-calculator", title: "Emergency Fund Calculator", description: "Plan a savings target for emergency expenses.", toolSlug: "savings-calculator", useCase: "Helpful when building three to six months of basic expenses.", steps: ["Estimate monthly expenses.", "Choose a target number of months.", "Enter current savings.", "Use the savings tool to project progress."] },
  { slug: "daily-calorie-calculator-for-weight-loss", title: "Daily Calorie Calculator for Weight Loss", description: "Estimate daily calories and adjust for a weight-loss goal.", toolSlug: "calorie-calculator", useCase: "Use this for a simple maintenance estimate before creating a calorie deficit.", steps: ["Enter age, height, weight, and activity level.", "Review estimated maintenance calories.", "Subtract a reasonable deficit.", "Track progress and adjust carefully."] },
  { slug: "bmr-calculator", title: "BMR Calculator", description: "Estimate basal metabolic rate and daily calorie needs.", toolSlug: "calorie-calculator", useCase: "Useful for understanding a rough baseline before planning nutrition.", steps: ["Enter personal body details.", "Choose activity level.", "Review BMR and daily target.", "Treat results as estimates, not medical advice."] },
  { slug: "days-between-dates-calculator", title: "Days Between Dates Calculator", description: "Count the number of days between two dates.", toolSlug: "date-calculator", useCase: "Use this for deadlines, trips, assignments, billing periods, and countdown planning.", steps: ["Choose the start date.", "Choose the end date.", "Review the day difference.", "Use date add if you need a future deadline."] },
  { slug: "add-days-to-date-calculator", title: "Add Days to Date Calculator", description: "Add a number of days to any date and find the result.", toolSlug: "date-calculator", useCase: "Helpful for project deadlines, return windows, study plans, and reminders.", steps: ["Enter the starting date.", "Enter days to add.", "Review the resulting date.", "Save or copy the date if needed."] },
  { slug: "meters-to-feet-converter", title: "Meters to Feet Converter", description: "Convert meters to feet quickly using the unit converter.", toolSlug: "unit-converter", useCase: "Useful for travel, school, real estate dimensions, and fitness measurements.", steps: ["Open the unit converter.", "Choose length.", "Enter meters.", "Read the feet result."] },
  { slug: "kg-to-pounds-converter", title: "Kg to Pounds Converter", description: "Convert kilograms to pounds for weight measurements.", toolSlug: "unit-converter", useCase: "Use this for fitness, shipping, travel luggage, or product weights.", steps: ["Choose weight units.", "Enter kilograms.", "Select pounds as the output.", "Use the converted result."] },
  { slug: "celsius-to-fahrenheit-converter", title: "Celsius to Fahrenheit Converter", description: "Convert Celsius temperatures to Fahrenheit.", toolSlug: "unit-converter", useCase: "Useful for weather, recipes, travel, and schoolwork.", steps: ["Choose temperature conversion.", "Enter Celsius.", "Review Fahrenheit.", "Reverse the units if needed."] },
  { slug: "usd-to-eur-converter", title: "USD to EUR Converter", description: "Estimate United States dollar to euro conversions.", toolSlug: "currency-converter", useCase: "Use this for travel planning, online shopping, and quick international estimates.", steps: ["Enter USD amount.", "Choose EUR as the target currency.", "Review live or fallback rate result.", "Check your bank for final fees."] },
  { slug: "usd-to-mxn-converter", title: "USD to MXN Converter", description: "Estimate United States dollar to Mexican peso conversions.", toolSlug: "currency-converter", useCase: "Useful for travel, shopping, and quick cross-border estimates.", steps: ["Enter USD amount.", "Select MXN.", "Review the converted result.", "Remember exchange fees may differ."] },
  { slug: "los-angeles-to-new-york-time-converter", title: "Los Angeles to New York Time Converter", description: "Compare Los Angeles and New York time zones.", toolSlug: "time-zone-converter", useCase: "Great for calls, classes, meetings, and deadlines across US time zones.", steps: ["Open the time zone converter.", "Compare Los Angeles and New York.", "Choose a meeting time.", "Confirm AM and PM carefully."] },
  { slug: "los-angeles-to-london-time-converter", title: "Los Angeles to London Time Converter", description: "Compare Los Angeles and London times for meetings and travel.", toolSlug: "time-zone-converter", useCase: "Use this when scheduling with someone in the UK.", steps: ["Select Los Angeles.", "Compare with London.", "Pick a reasonable time window.", "Confirm the date because time zones may cross midnight."] },
  { slug: "unix-timestamp-to-date-converter", title: "Unix Timestamp to Date Converter", description: "Convert Unix timestamps into readable dates.", toolSlug: "timestamp-converter", useCase: "Useful for developers, spreadsheets, logs, and data cleanup.", steps: ["Paste the Unix timestamp.", "Review ISO and local date formats.", "Copy the readable result.", "Check seconds versus milliseconds if needed."] },
  { slug: "json-formatter-online", title: "JSON Formatter Online", description: "Format, minify, and clean JSON text online.", toolSlug: "data-format-converter", useCase: "Use this when API or spreadsheet data is hard to read.", steps: ["Paste JSON text.", "Choose format or minify.", "Review the cleaned output.", "Copy the result."] },
  { slug: "base64-encoder-decoder", title: "Base64 Encoder and Decoder", description: "Encode text to Base64 or decode Base64 back to text.", toolSlug: "data-format-converter", useCase: "Helpful for simple data encoding, testing, and developer workflows.", steps: ["Paste text or Base64.", "Choose encode or decode.", "Review the output.", "Copy the result."] },
  { slug: "csv-to-json-converter", title: "CSV to JSON Converter", description: "Convert simple CSV text into JSON.", toolSlug: "data-format-converter", useCase: "Use this when moving spreadsheet-style data into apps or scripts.", steps: ["Paste CSV rows.", "Choose CSV to JSON.", "Review the structured output.", "Copy the JSON."] },
  { slug: "text-to-pdf-converter", title: "Text to PDF Converter", description: "Create a simple PDF from text.", toolSlug: "file-to-pdf-converter", useCase: "Use this for notes, simple documents, receipts, or quick exports.", steps: ["Open the PDF converter.", "Paste or upload text.", "Generate the PDF.", "Download the file."] },
  { slug: "image-to-pdf-converter", title: "Image to PDF Converter", description: "Turn PNG or JPG images into a simple PDF.", toolSlug: "file-to-pdf-converter", useCase: "Useful for combining screenshots, receipts, or homework images into a PDF.", steps: ["Upload an image.", "Generate the PDF.", "Preview the output if needed.", "Download the PDF."] },
  { slug: "qr-code-generator-for-url", title: "QR Code Generator for URL", description: "Create a QR code for a website link.", toolSlug: "qr-code-generator", useCase: "Use this for flyers, business cards, events, and quick link sharing.", steps: ["Paste the URL.", "Generate the QR code.", "Download the image.", "Test the code with your phone."] },
  { slug: "qr-code-generator-for-text", title: "QR Code Generator for Text", description: "Create a QR code from plain text.", toolSlug: "qr-code-generator", useCase: "Useful for notes, Wi-Fi instructions, short messages, or event details.", steps: ["Type your text.", "Generate the QR code.", "Download it.", "Scan it to confirm it works."] },
  { slug: "essay-word-counter", title: "Essay Word Counter", description: "Count words, characters, sentences, and reading time for essays.", toolSlug: "word-counter", useCase: "Helpful for school assignments, application essays, and writing limits.", steps: ["Paste your essay.", "Review word and character counts.", "Check reading time.", "Edit until you meet the requirement."] },
  { slug: "character-counter", title: "Character Counter", description: "Count characters for posts, bios, titles, and descriptions.", toolSlug: "word-counter", useCase: "Use this for social posts, meta descriptions, form limits, and short bios.", steps: ["Paste your text.", "Review character count.", "Shorten or expand as needed.", "Copy the finished text."] },
  { slug: "online-notepad-no-login", title: "Online Notepad No Login", description: "Use a fast temporary notepad without creating an account.", toolSlug: "online-notepad", useCase: "Great for quick notes during studying, calls, or browsing.", steps: ["Open the notes tool.", "Type your note.", "Keep it during the session.", "Download it if you want to save it."] },
  { slug: "pomodoro-countdown-timer", title: "Pomodoro Countdown Timer", description: "Use a simple countdown timer for focus sessions.", toolSlug: "countdown-timer", useCase: "Useful for 25-minute study blocks, workouts, breaks, and timed tasks.", steps: ["Set the countdown length.", "Start the timer.", "Focus until it ends.", "Reset for the next session."] },
  { slug: "online-stopwatch-with-laps", title: "Online Stopwatch With Laps", description: "Track elapsed time and laps in the browser.", toolSlug: "online-stopwatch", useCase: "Use this for workouts, studying, calls, or practice sessions.", steps: ["Start the stopwatch.", "Add laps when needed.", "Pause or reset.", "Review elapsed time."] },
  { slug: "strong-password-generator", title: "Strong Password Generator", description: "Generate strong random passwords online.", toolSlug: "password-generator", useCase: "Use this when creating new accounts or replacing weak passwords.", steps: ["Choose password length.", "Generate a password.", "Copy it.", "Save it in a password manager."] },
  { slug: "slug-generator", title: "Slug Generator", description: "Turn text into clean URL slugs.", toolSlug: "text-tools", useCase: "Useful for blog titles, page URLs, filenames, and SEO-friendly links.", steps: ["Paste your title.", "Choose slug output.", "Review the result.", "Copy the clean slug."] },
  { slug: "uppercase-lowercase-converter", title: "Uppercase and Lowercase Converter", description: "Convert text to uppercase, lowercase, title case, and more.", toolSlug: "text-tools", useCase: "Use this for titles, captions, documents, and quick text cleanup.", steps: ["Paste text.", "Choose the format you need.", "Review the transformed text.", "Copy the result."] },
];

const blogPosts: BlogPost[] = [
  { slug: "how-to-calculate-a-discount", title: "How to Calculate a Discount Before You Buy", description: "A simple guide to calculating sale prices, tax, and the real amount saved.", readTime: "4 min read", sections: [{ heading: "Start with the original price", body: "The original price is the number on the tag before the discount. Multiply it by the discount percentage to find how much money comes off the price." }, { heading: "Remember sales tax", body: "A discount lowers the item price, but tax may still be added at checkout. That is why a discount calculator with tax is more useful than mental math." }, { heading: "Compare deals", body: "If two stores show different discounts, calculate the final total for both. The bigger percentage is not always the better deal if the starting prices are different." }] },
  { slug: "how-much-should-you-tip", title: "How Much Should You Tip at a Restaurant?", description: "Learn a simple way to estimate tips and split bills with friends.", readTime: "3 min read", sections: [{ heading: "Use the bill before splitting", body: "Start with the full bill amount, choose the tip percentage, then split the final total by the number of people." }, { heading: "Common tip percentages", body: "Many people use 15%, 18%, or 20% depending on service, location, and personal preference. A tip calculator helps avoid awkward group math." }, { heading: "Check the receipt", body: "Some restaurants include service charges or automatic gratuity for larger groups. If that is already added, avoid tipping twice by mistake." }] },
  { slug: "student-monthly-budget-basics", title: "Monthly Budget Basics for Students", description: "A beginner-friendly student budget method for income, expenses, and savings.", readTime: "5 min read", sections: [{ heading: "Separate fixed and flexible costs", body: "Fixed costs are things like rent, insurance, and subscriptions. Flexible costs are food, gas, shopping, and entertainment." }, { heading: "Give savings a line item", body: "Treat savings like an expense you pay yourself. Even a small monthly amount builds the habit and creates a buffer." }, { heading: "Review every month", body: "A budget is not something you set once. Update it when your work hours, school costs, or rent change." }] },
  { slug: "loan-payment-basics", title: "How Loan Payments Work", description: "Understand loan amount, interest rate, term, monthly payment, and total interest.", readTime: "4 min read", sections: [{ heading: "Three numbers matter most", body: "Your payment depends mainly on the loan amount, the interest rate, and the length of the loan." }, { heading: "Longer terms lower payments", body: "A longer loan can make the monthly payment smaller, but it usually increases total interest paid over time." }, { heading: "Estimate before applying", body: "A loan calculator helps you compare scenarios before talking to a lender or dealership." }] },
  { slug: "compound-savings-explained", title: "Compound Savings Explained Simply", description: "See how deposits, time, and compound growth can affect savings.", readTime: "4 min read", sections: [{ heading: "Compounding means growth on growth", body: "When savings earn interest or returns, future growth can build on both the original money and previous growth." }, { heading: "Monthly deposits matter", body: "Consistent deposits often matter more than a perfect starting amount. The habit creates momentum." }, { heading: "Use estimates carefully", body: "Savings calculators are helpful for planning, but real returns and rates can change." }] },
  { slug: "days-between-dates-guide", title: "How to Count Days Between Dates", description: "A quick guide for deadlines, trips, billing periods, and countdowns.", readTime: "3 min read", sections: [{ heading: "Choose the start and end date", body: "The simplest way is to enter both dates into a date calculator and review the number of days between them." }, { heading: "Watch for inclusive counting", body: "Some situations count both the start and end date, while others count only full days between. Check what your deadline requires." }, { heading: "Use date add for planning", body: "If you know a project is due 45 days from now, use date add to find the exact future date." }] },
  { slug: "time-zone-meeting-tips", title: "Time Zone Tips for Scheduling Meetings", description: "Avoid AM/PM mistakes and date confusion when scheduling across cities.", readTime: "4 min read", sections: [{ heading: "Compare cities directly", body: "Use a time zone converter instead of guessing the offset, especially when daylight saving time might apply." }, { heading: "Check the date too", body: "A meeting can move to the next day in another country. Always confirm both time and date." }, { heading: "Share the time in both zones", body: "When sending an invite, include both local times so everyone can verify the meeting quickly." }] },
  { slug: "qr-code-ideas-for-small-projects", title: "QR Code Ideas for Small Projects", description: "Practical ways to use QR codes for links, notes, events, and business cards.", readTime: "3 min read", sections: [{ heading: "Use QR codes for links", body: "A QR code is helpful when people need to open a URL from a flyer, poster, card, or presentation." }, { heading: "Test before printing", body: "Always scan the QR code with your phone before using it publicly. Make sure the destination works." }, { heading: "Keep the design clear", body: "Leave enough white space around the QR code and avoid making it too small." }] },
  { slug: "word-count-tips-for-essays", title: "Word Count Tips for Essays", description: "Use word count, character count, and reading time to improve writing.", readTime: "3 min read", sections: [{ heading: "Check requirements first", body: "Before editing, know whether the assignment limit is based on words, characters, pages, or another format." }, { heading: "Cut repeated ideas", body: "If your essay is too long, remove repeated points and tighten sentences before deleting important evidence." }, { heading: "Use reading time", body: "Reading time helps you estimate whether a speech, post, or essay feels too short or too long." }] },
  { slug: "password-safety-basics", title: "Password Safety Basics", description: "Simple rules for creating stronger passwords and avoiding common mistakes.", readTime: "4 min read", sections: [{ heading: "Use long random passwords", body: "Long random passwords are harder to guess than short memorable ones. A password generator can create strong options quickly." }, { heading: "Do not reuse passwords", body: "If one reused password leaks, multiple accounts can be at risk. Use a unique password for every important account." }, { heading: "Store passwords safely", body: "A password manager is safer than keeping passwords in notes, screenshots, or messages." }] },
];

const seoLandingTranslationsEs: Record<string, Omit<SeoLanding, "slug" | "toolSlug">> = {
  "25-percent-off-calculator": { title: "Calculadora de 25% de descuento", description: "Calcula el precio de oferta, el ahorro, el impuesto y el total final cuando un artículo tiene 25% de descuento.", useCase: "Esta página es útil cuando una tienda muestra un descuento de 25% y quieres saber el precio real antes de comprar.", steps: ["Ingresa el precio original.", "Pon 25% en el campo de descuento.", "Agrega el impuesto local si lo necesitas.", "Compara el total final con tu presupuesto."] },
  "20-percent-off-calculator": { title: "Calculadora de 20% de descuento", description: "Calcula rápidamente un descuento de 20%, el monto ahorrado y el precio final después de impuestos.", useCase: "Úsala cuando un producto está marcado con 20% de descuento y necesitas una estimación rápida del precio real.", steps: ["Ingresa el precio de etiqueta.", "Pon el descuento en 20%.", "Agrega impuestos si la tienda los aplica.", "Usa el total final para decidir si vale la pena."] },
  "30-percent-off-calculator": { title: "Calculadora de 30% de descuento", description: "Encuentra el precio final y el ahorro para ofertas con 30% de descuento.", useCase: "Ideal para ropa, electrónicos y ofertas de temporada donde el descuento aparece como 30%.", steps: ["Escribe el precio original.", "Usa 30 en el campo de descuento.", "Agrega impuestos si quieres una estimación de pago.", "Revisa el descuento ahorrado y el total final."] },
  "discount-calculator-with-sales-tax": { title: "Calculadora de descuento con impuesto de venta", description: "Calcula el ahorro por descuento y el total estimado después de impuestos en un solo lugar.", useCase: "Úsala cuando el anuncio muestra el descuento, pero todavía necesitas incluir impuestos.", steps: ["Ingresa el precio original.", "Ingresa el porcentaje de descuento.", "Ingresa el porcentaje de impuesto de venta.", "Revisa el total final."] },
  "tip-calculator-for-2-people": { title: "Calculadora de propina para 2 personas", description: "Divide una cuenta de restaurante y la propina entre dos personas.", useCase: "Úsala para citas, almuerzos, cafés y cuentas compartidas.", steps: ["Ingresa el monto de la cuenta.", "Elige el porcentaje de propina.", "Pon personas en 2.", "Usa el resultado por persona."] },
  "tip-calculator-for-4-people": { title: "Calculadora de propina para 4 personas", description: "Calcula la propina y divide una cuenta de forma pareja entre cuatro personas.", useCase: "Útil para cenas de grupo cuando todos quieren una división rápida y justa.", steps: ["Ingresa la cuenta total.", "Elige 15%, 18%, 20% u otra propina.", "Pon personas en 4.", "Comparte el monto por persona."] },
  "20-percent-tip-calculator": { title: "Calculadora de propina del 20%", description: "Calcula una propina del 20% y el total de la cuenta.", useCase: "Úsala cuando quieres dejar una buena propina estándar sin hacer cálculo mental.", steps: ["Ingresa la cuenta del restaurante.", "Pon la propina en 20%.", "Agrega el número de personas si van a dividir.", "Revisa el total y el costo por persona."] },
  "monthly-budget-calculator-students": { title: "Calculadora de presupuesto mensual para estudiantes", description: "Planifica ingresos, gastos y metas de ahorro de estudiante mes a mes.", useCase: "Útil para estudiantes que equilibran trabajo de medio tiempo, renta, comida, escuela y ahorro.", steps: ["Ingresa el ingreso mensual.", "Agrega gastos fijos como renta y suscripciones.", "Agrega gastos flexibles como comida y gasolina.", "Define una meta de ahorro y revisa el dinero restante."] },
  "monthly-savings-goal-calculator": { title: "Calculadora de meta de ahorro mensual", description: "Estima cuánto puedes ahorrar cada mes después de gastos.", useCase: "Úsala antes de fijar una meta de ahorro para viajes, emergencias, escuela o una compra.", steps: ["Ingresa ingresos.", "Ingresa costos fijos y variables.", "Agrega el ahorro deseado.", "Revisa si el plan es realista."] },
  "car-loan-payment-calculator": { title: "Calculadora de pago de préstamo de auto", description: "Estima pagos mensuales de auto e interés total.", useCase: "Úsala antes de visitar un concesionario o comparar ofertas de financiamiento.", steps: ["Ingresa el monto del préstamo.", "Ingresa la tasa de interés.", "Elige el plazo del préstamo.", "Revisa el pago mensual y el interés total."] },
  "personal-loan-payment-calculator": { title: "Calculadora de pago de préstamo personal", description: "Calcula pagos estimados por monto, tasa y plazo.", useCase: "Útil para comparar opciones antes de solicitar un préstamo.", steps: ["Ingresa el monto prestado.", "Agrega APR o tasa de interés.", "Ingresa el plazo en años.", "Compara el pago con tu presupuesto."] },
  "compound-interest-savings-calculator": { title: "Calculadora de ahorro con interés compuesto", description: "Proyecta el crecimiento de ahorros con depósitos e interés compuesto.", useCase: "Úsala para ver cómo los depósitos mensuales pueden crecer con el tiempo.", steps: ["Ingresa el ahorro inicial.", "Agrega la contribución mensual.", "Ingresa el rendimiento anual esperado.", "Define el número de años."] },
  "emergency-fund-calculator": { title: "Calculadora de fondo de emergencia", description: "Planifica una meta de ahorro para gastos de emergencia.", useCase: "Útil para construir de tres a seis meses de gastos básicos.", steps: ["Estima tus gastos mensuales.", "Elige el número de meses objetivo.", "Ingresa tus ahorros actuales.", "Usa la herramienta de ahorro para proyectar tu progreso."] },
  "daily-calorie-calculator-for-weight-loss": { title: "Calculadora diaria de calorías para bajar de peso", description: "Estima calorías diarias y ajusta para una meta de pérdida de peso.", useCase: "Úsala para una estimación simple de mantenimiento antes de crear un déficit calórico.", steps: ["Ingresa edad, altura, peso y actividad.", "Revisa calorías estimadas de mantenimiento.", "Resta un déficit razonable.", "Da seguimiento y ajusta con cuidado."] },
  "bmr-calculator": { title: "Calculadora de BMR", description: "Estima la tasa metabólica basal y necesidades diarias de calorías.", useCase: "Útil para entender una base aproximada antes de planificar nutrición.", steps: ["Ingresa detalles personales.", "Elige nivel de actividad.", "Revisa BMR y meta diaria.", "Trata los resultados como estimaciones, no consejo médico."] },
  "days-between-dates-calculator": { title: "Calculadora de días entre fechas", description: "Cuenta el número de días entre dos fechas.", useCase: "Úsala para fechas límite, viajes, tareas, periodos de facturación y cuentas regresivas.", steps: ["Elige la fecha inicial.", "Elige la fecha final.", "Revisa la diferencia de días.", "Usa sumar días si necesitas una fecha futura."] },
  "add-days-to-date-calculator": { title: "Calculadora para sumar días a una fecha", description: "Agrega un número de días a cualquier fecha y encuentra el resultado.", useCase: "Útil para plazos de proyectos, devoluciones, planes de estudio y recordatorios.", steps: ["Ingresa la fecha inicial.", "Ingresa los días a sumar.", "Revisa la fecha resultante.", "Guarda o copia la fecha si la necesitas."] },
  "meters-to-feet-converter": { title: "Conversor de metros a pies", description: "Convierte metros a pies rápidamente con el conversor de unidades.", useCase: "Útil para viajes, escuela, dimensiones de propiedades y medidas de fitness.", steps: ["Abre el conversor de unidades.", "Elige longitud.", "Ingresa metros.", "Lee el resultado en pies."] },
  "kg-to-pounds-converter": { title: "Conversor de kg a libras", description: "Convierte kilogramos a libras para medidas de peso.", useCase: "Úsalo para fitness, envíos, equipaje de viaje o peso de productos.", steps: ["Elige unidades de peso.", "Ingresa kilogramos.", "Selecciona libras como salida.", "Usa el resultado convertido."] },
  "celsius-to-fahrenheit-converter": { title: "Conversor de Celsius a Fahrenheit", description: "Convierte temperaturas Celsius a Fahrenheit.", useCase: "Útil para clima, recetas, viajes y tareas escolares.", steps: ["Elige conversión de temperatura.", "Ingresa Celsius.", "Revisa Fahrenheit.", "Invierte las unidades si lo necesitas."] },
  "usd-to-eur-converter": { title: "Conversor de USD a EUR", description: "Estima conversiones de dólar estadounidense a euro.", useCase: "Úsalo para viajes, compras en línea y estimaciones internacionales rápidas.", steps: ["Ingresa el monto en USD.", "Elige EUR como moneda destino.", "Revisa el resultado con tasa en vivo o de respaldo.", "Consulta tu banco para tarifas finales."] },
  "usd-to-mxn-converter": { title: "Conversor de USD a MXN", description: "Estima conversiones de dólar estadounidense a peso mexicano.", useCase: "Útil para viajes, compras y estimaciones transfronterizas rápidas.", steps: ["Ingresa el monto en USD.", "Selecciona MXN.", "Revisa el resultado convertido.", "Recuerda que las comisiones pueden variar."] },
  "los-angeles-to-new-york-time-converter": { title: "Conversor de hora de Los Ángeles a Nueva York", description: "Compara las zonas horarias de Los Ángeles y Nueva York.", useCase: "Excelente para llamadas, clases, reuniones y fechas límite entre zonas de EE. UU.", steps: ["Abre el conversor de zonas horarias.", "Compara Los Ángeles y Nueva York.", "Elige una hora de reunión.", "Confirma AM y PM con cuidado."] },
  "los-angeles-to-london-time-converter": { title: "Conversor de hora de Los Ángeles a Londres", description: "Compara horarios de Los Ángeles y Londres para reuniones y viajes.", useCase: "Úsalo cuando programes con alguien en Reino Unido.", steps: ["Selecciona Los Ángeles.", "Compara con Londres.", "Elige una ventana de tiempo razonable.", "Confirma la fecha porque las zonas pueden cruzar medianoche."] },
  "unix-timestamp-to-date-converter": { title: "Conversor de timestamp Unix a fecha", description: "Convierte timestamps Unix en fechas legibles.", useCase: "Útil para desarrolladores, hojas de cálculo, logs y limpieza de datos.", steps: ["Pega el timestamp Unix.", "Revisa formatos ISO y fecha local.", "Copia el resultado legible.", "Verifica segundos contra milisegundos si hace falta."] },
  "json-formatter-online": { title: "Formateador JSON en línea", description: "Formatea, minifica y limpia texto JSON en línea.", useCase: "Úsalo cuando datos de API u hojas de cálculo son difíciles de leer.", steps: ["Pega texto JSON.", "Elige formatear o minificar.", "Revisa la salida limpia.", "Copia el resultado."] },
  "base64-encoder-decoder": { title: "Codificador y decodificador Base64", description: "Codifica texto a Base64 o decodifica Base64 a texto.", useCase: "Útil para codificación simple, pruebas y flujos de desarrollo.", steps: ["Pega texto o Base64.", "Elige codificar o decodificar.", "Revisa la salida.", "Copia el resultado."] },
  "csv-to-json-converter": { title: "Conversor CSV a JSON", description: "Convierte texto CSV simple en JSON.", useCase: "Úsalo cuando muevas datos tipo hoja de cálculo a apps o scripts.", steps: ["Pega filas CSV.", "Elige CSV a JSON.", "Revisa la salida estructurada.", "Copia el JSON."] },
  "text-to-pdf-converter": { title: "Conversor de texto a PDF", description: "Crea un PDF simple desde texto.", useCase: "Úsalo para notas, documentos simples, recibos o exportaciones rápidas.", steps: ["Abre el conversor PDF.", "Pega o sube texto.", "Genera el PDF.", "Descarga el archivo."] },
  "image-to-pdf-converter": { title: "Conversor de imagen a PDF", description: "Convierte imágenes PNG o JPG en un PDF simple.", useCase: "Útil para combinar capturas, recibos o imágenes de tarea en un PDF.", steps: ["Sube una imagen.", "Genera el PDF.", "Previsualiza la salida si hace falta.", "Descarga el PDF."] },
  "qr-code-generator-for-url": { title: "Generador de código QR para URL", description: "Crea un código QR para un enlace web.", useCase: "Úsalo para folletos, tarjetas, eventos y compartir enlaces rápido.", steps: ["Pega la URL.", "Genera el código QR.", "Descarga la imagen.", "Prueba el código con tu teléfono."] },
  "qr-code-generator-for-text": { title: "Generador de código QR para texto", description: "Crea un código QR desde texto simple.", useCase: "Útil para notas, instrucciones de Wi-Fi, mensajes cortos o detalles de eventos.", steps: ["Escribe tu texto.", "Genera el código QR.", "Descárgalo.", "Escanéalo para confirmar que funciona."] },
  "essay-word-counter": { title: "Contador de palabras para ensayos", description: "Cuenta palabras, caracteres, oraciones y tiempo de lectura para ensayos.", useCase: "Útil para tareas escolares, ensayos de aplicación y límites de escritura.", steps: ["Pega tu ensayo.", "Revisa conteo de palabras y caracteres.", "Comprueba el tiempo de lectura.", "Edita hasta cumplir el requisito."] },
  "character-counter": { title: "Contador de caracteres", description: "Cuenta caracteres para publicaciones, biografías, títulos y descripciones.", useCase: "Úsalo para publicaciones sociales, meta descripciones, límites de formularios y bios cortas.", steps: ["Pega tu texto.", "Revisa el conteo de caracteres.", "Acorta o amplía según necesites.", "Copia el texto final."] },
  "online-notepad-no-login": { title: "Bloc de notas en línea sin registro", description: "Usa un bloc temporal rápido sin crear una cuenta.", useCase: "Excelente para notas rápidas durante estudio, llamadas o navegación.", steps: ["Abre la herramienta de notas.", "Escribe tu nota.", "Mantén la nota durante la sesión.", "Descárgala si quieres guardarla."] },
  "pomodoro-countdown-timer": { title: "Temporizador Pomodoro de cuenta regresiva", description: "Usa un temporizador simple para sesiones de enfoque.", useCase: "Útil para bloques de estudio de 25 minutos, entrenamientos, descansos y tareas cronometradas.", steps: ["Define la duración.", "Inicia el temporizador.", "Concéntrate hasta que termine.", "Reinicia para la siguiente sesión."] },
  "online-stopwatch-with-laps": { title: "Cronómetro en línea con vueltas", description: "Mide tiempo transcurrido y vueltas en el navegador.", useCase: "Úsalo para entrenamientos, estudio, llamadas o práctica.", steps: ["Inicia el cronómetro.", "Agrega vueltas cuando necesites.", "Pausa o reinicia.", "Revisa el tiempo transcurrido."] },
  "strong-password-generator": { title: "Generador de contraseñas fuertes", description: "Genera contraseñas aleatorias fuertes en línea.", useCase: "Úsalo cuando crees nuevas cuentas o reemplaces contraseñas débiles.", steps: ["Elige la longitud.", "Genera una contraseña.", "Cópiala.", "Guárdala en un gestor de contraseñas."] },
  "slug-generator": { title: "Generador de slugs", description: "Convierte texto en slugs limpios para URL.", useCase: "Útil para títulos de blog, URLs, nombres de archivo y enlaces SEO.", steps: ["Pega tu título.", "Elige salida tipo slug.", "Revisa el resultado.", "Copia el slug limpio."] },
  "uppercase-lowercase-converter": { title: "Conversor de mayúsculas y minúsculas", description: "Convierte texto a mayúsculas, minúsculas, título y más.", useCase: "Úsalo para títulos, subtítulos, documentos y limpieza rápida de texto.", steps: ["Pega texto.", "Elige el formato que necesitas.", "Revisa el texto transformado.", "Copia el resultado."] },
};

const blogPostTranslationsEs: Record<string, Omit<BlogPost, "slug">> = {
  "how-to-calculate-a-discount": { title: "Cómo calcular un descuento antes de comprar", description: "Una guía simple para calcular precios de oferta, impuestos y el ahorro real.", readTime: "4 min de lectura", sections: [{ heading: "Empieza con el precio original", body: "El precio original es el número de la etiqueta antes del descuento. Multiplícalo por el porcentaje de descuento para saber cuánto dinero se resta del precio." }, { heading: "Recuerda el impuesto de venta", body: "Un descuento baja el precio del artículo, pero todavía puede agregarse impuesto al pagar. Por eso una calculadora de descuento con impuestos es más útil que hacer cálculo mental." }, { heading: "Compara ofertas", body: "Si dos tiendas muestran descuentos distintos, calcula el total final en ambas. El porcentaje más grande no siempre es la mejor oferta si los precios iniciales son diferentes." }] },
  "how-much-should-you-tip": { title: "¿Cuánto deberías dejar de propina en un restaurante?", description: "Aprende una forma simple de estimar propinas y dividir cuentas con amigos.", readTime: "3 min de lectura", sections: [{ heading: "Usa la cuenta antes de dividir", body: "Empieza con el monto completo, elige el porcentaje de propina y luego divide el total final entre el número de personas." }, { heading: "Porcentajes comunes de propina", body: "Muchas personas usan 15%, 18% o 20% según el servicio, la ubicación y la preferencia personal. Una calculadora evita cuentas incómodas en grupo." }, { heading: "Revisa el recibo", body: "Algunos restaurantes incluyen cargos de servicio o propina automática para grupos grandes. Si ya está incluida, evita pagar propina dos veces por error." }] },
  "student-monthly-budget-basics": { title: "Bases de presupuesto mensual para estudiantes", description: "Un método sencillo para ingresos, gastos y ahorro de estudiantes.", readTime: "5 min de lectura", sections: [{ heading: "Separa costos fijos y flexibles", body: "Los costos fijos son renta, seguro y suscripciones. Los costos flexibles son comida, gasolina, compras y entretenimiento." }, { heading: "Dale una línea al ahorro", body: "Trata el ahorro como un gasto que te pagas a ti mismo. Incluso una cantidad pequeña mensual crea el hábito y un colchón." }, { heading: "Revisa cada mes", body: "Un presupuesto no se configura una sola vez. Actualízalo cuando cambien tus horas de trabajo, costos escolares o renta." }] },
  "loan-payment-basics": { title: "Cómo funcionan los pagos de préstamo", description: "Entiende monto, tasa de interés, plazo, pago mensual e interés total.", readTime: "4 min de lectura", sections: [{ heading: "Tres números importan más", body: "Tu pago depende principalmente del monto del préstamo, la tasa de interés y la duración del préstamo." }, { heading: "Plazos más largos bajan pagos", body: "Un préstamo más largo puede hacer que el pago mensual sea menor, pero normalmente aumenta el interés total pagado con el tiempo." }, { heading: "Estima antes de aplicar", body: "Una calculadora de préstamo te ayuda a comparar escenarios antes de hablar con un prestamista o concesionario." }] },
  "compound-savings-explained": { title: "Ahorro compuesto explicado de forma simple", description: "Mira cómo depósitos, tiempo y crecimiento compuesto pueden afectar tus ahorros.", readTime: "4 min de lectura", sections: [{ heading: "Compuesto significa crecimiento sobre crecimiento", body: "Cuando los ahorros ganan interés o rendimientos, el crecimiento futuro puede acumularse sobre el dinero original y sobre ganancias previas." }, { heading: "Los depósitos mensuales importan", body: "Los depósitos constantes suelen importar más que una cantidad inicial perfecta. El hábito crea impulso." }, { heading: "Usa estimaciones con cuidado", body: "Las calculadoras de ahorro ayudan a planificar, pero las tasas y rendimientos reales pueden cambiar." }] },
  "days-between-dates-guide": { title: "Cómo contar días entre fechas", description: "Una guía rápida para fechas límite, viajes, facturación y cuentas regresivas.", readTime: "3 min de lectura", sections: [{ heading: "Elige fecha inicial y final", body: "La forma más simple es ingresar ambas fechas en una calculadora de fechas y revisar el número de días entre ellas." }, { heading: "Cuidado con el conteo inclusivo", body: "Algunas situaciones cuentan tanto el día inicial como el final, mientras otras solo cuentan días completos entre fechas. Revisa qué requiere tu plazo." }, { heading: "Usa sumar días para planificar", body: "Si sabes que un proyecto vence en 45 días, usa sumar días para encontrar la fecha futura exacta." }] },
  "time-zone-meeting-tips": { title: "Consejos de zonas horarias para reuniones", description: "Evita errores de AM/PM y confusión de fechas al programar entre ciudades.", readTime: "4 min de lectura", sections: [{ heading: "Compara ciudades directamente", body: "Usa un conversor de zonas horarias en vez de adivinar el desfase, especialmente cuando puede aplicar horario de verano." }, { heading: "Revisa también la fecha", body: "Una reunión puede pasar al día siguiente en otro país. Confirma siempre la hora y la fecha." }, { heading: "Comparte la hora en ambas zonas", body: "Cuando envíes una invitación, incluye ambas horas locales para que todos puedan verificar rápido." }] },
  "qr-code-ideas-for-small-projects": { title: "Ideas de códigos QR para proyectos pequeños", description: "Formas prácticas de usar códigos QR para enlaces, notas, eventos y tarjetas.", readTime: "3 min de lectura", sections: [{ heading: "Usa códigos QR para enlaces", body: "Un código QR ayuda cuando las personas necesitan abrir una URL desde un folleto, cartel, tarjeta o presentación." }, { heading: "Prueba antes de imprimir", body: "Escanea siempre el código con tu teléfono antes de usarlo públicamente. Asegúrate de que el destino funcione." }, { heading: "Mantén el diseño claro", body: "Deja suficiente espacio alrededor del código QR y evita hacerlo demasiado pequeño." }] },
  "word-count-tips-for-essays": { title: "Consejos de conteo de palabras para ensayos", description: "Usa conteo de palabras, caracteres y tiempo de lectura para mejorar tu escritura.", readTime: "3 min de lectura", sections: [{ heading: "Revisa primero los requisitos", body: "Antes de editar, confirma si el límite de la tarea se basa en palabras, caracteres, páginas u otro formato." }, { heading: "Corta ideas repetidas", body: "Si tu ensayo es demasiado largo, elimina puntos repetidos y ajusta frases antes de borrar evidencia importante." }, { heading: "Usa tiempo de lectura", body: "El tiempo de lectura ayuda a estimar si un discurso, publicación o ensayo se siente demasiado corto o largo." }] },
  "password-safety-basics": { title: "Bases de seguridad de contraseñas", description: "Reglas simples para crear contraseñas más fuertes y evitar errores comunes.", readTime: "4 min de lectura", sections: [{ heading: "Usa contraseñas largas y aleatorias", body: "Las contraseñas largas y aleatorias son más difíciles de adivinar que las cortas y memorables. Un generador puede crear opciones fuertes rápidamente." }, { heading: "No reutilices contraseñas", body: "Si una contraseña reutilizada se filtra, varias cuentas pueden quedar en riesgo. Usa una contraseña única para cada cuenta importante." }, { heading: "Guárdalas con seguridad", body: "Un gestor de contraseñas es más seguro que guardar contraseñas en notas, capturas o mensajes." }] },
};

const categoryMeta: Record<ToolFilter, { label: string; kicker: string }> = {
  all: { label: "All", kicker: "Search every tool at once." },
  calculators: { label: "Calculators", kicker: "Money, dates, health, and planning." },
  converters: { label: "Converters", kicker: "Units, currencies, time, files, and data." },
  utilities: { label: "Quick utilities", kicker: "QR, writing, passwords, timers, and notes." },
};

const categoryMetaEs: Record<ToolFilter, { label: string; kicker: string }> = {
  all: { label: "Todo", kicker: "Busca en todas las herramientas." },
  calculators: { label: "Calculadoras", kicker: "Dinero, fechas, salud y planificación." },
  converters: { label: "Convertidores", kicker: "Unidades, moneda, tiempo, archivos y datos." },
  utilities: { label: "Utilidades rápidas", kicker: "QR, escritura, contraseñas, temporizadores y notas." },
};

const uiText = {
  en: {
    tagline: "Fast everyday tools",
    navTools: "Tools",
    navBlog: "Blog",
    navAbout: "About",
    navContact: "Contact",
    navPrivacy: "Privacy",
    navTerms: "Terms",
    language: "Language",
    english: "English",
    spanish: "Spanish",
    adReserved: "AdSense slot reserved. Replace this placeholder after Google approves the site.",
    advertisement: "Advertisement",
    pageAdvertisement: "Page advertisement",
    guideAdvertisement: "Guide advertisement",
    articleAdvertisement: "Article advertisement",
    bottomPageAdvertisement: "Bottom page advertisement",
    backToAllTools: "Back to all tools",
    runsInBrowser: "Runs in your browser",
    relatedTools: "Related tools",
    howToUse: "How to use the",
    tool: "tool",
    howStep1: "Enter your numbers, text, dates, or file information in the fields above.",
    howStep2: "Review the result instantly and adjust any inputs if you want to compare options.",
    howStep3: "Copy, download, or reuse the output when the tool provides an export action.",
    example: "Example",
    quickNote: "Quick note",
    quickNoteBody: "Results are made for quick everyday planning. Double-check important financial, health, legal, or business decisions before acting on them.",
    faq: "FAQ",
    isFree: "Is this tool free?",
    isFreeBody: "Yes. You can use this page without creating an account.",
    savesData: "Does it save my data?",
    savesDataBody: "No account storage is used for these quick tools. Most work directly in the browser.",
    mobile: "Can I use it on mobile?",
    mobileBody: "Yes. The layout is built to work on phones, tablets, and desktop screens.",
    searchTools: "Search tools",
    openPage: "Open page",
    homeKicker: "Calculator cockpit",
    homeTitle: "One clean workspace for quick math, conversions, writing utilities, and focus tools.",
    homeBody: "Switch tools on the left, enter values, and copy or download the output. Everything runs locally in the browser unless the currency tool can load live exchange rates.",
    toolGuide: "Tool guide",
    toolGuideTitle: "Useful calculators and converters without a cluttered tab stack.",
    toolGuideP1: "Use the finance tools for quick shopping, budgeting, loan, tip, and savings estimates. The date and time tools help with deadlines, timestamps, and timezone comparisons.",
    toolGuideP2: "The utility set covers QR codes, word counts, temporary notes, timers, passwords, and text cleanup. These short explanations add helpful context for visitors and improve the site’s crawlable content.",
    directoryKicker: "Tool directory",
    directoryTitle: "All free calculators, converters, and quick utilities",
    directoryBody: "This directory helps visitors and search engines discover every main tool, focused guide page, and practical article in OmniTool Studio.",
    popularSearchPages: "Popular search pages",
    helpfulArticles: "Helpful articles",
    footerBody: "Calculators, converters, and quick utilities for everyday decisions.",
  },
  es: {
    tagline: "Herramientas rápidas para cada día",
    navTools: "Herramientas",
    navBlog: "Blog",
    navAbout: "Acerca de",
    navContact: "Contacto",
    navPrivacy: "Privacidad",
    navTerms: "Términos",
    language: "Idioma",
    english: "Inglés",
    spanish: "Español",
    adReserved: "Espacio reservado para AdSense. Reemplaza este marcador después de que Google apruebe el sitio.",
    advertisement: "Publicidad",
    pageAdvertisement: "Publicidad de la página",
    guideAdvertisement: "Publicidad de la guía",
    articleAdvertisement: "Publicidad del artículo",
    bottomPageAdvertisement: "Publicidad inferior",
    backToAllTools: "Volver a todas las herramientas",
    runsInBrowser: "Funciona en tu navegador",
    relatedTools: "Herramientas relacionadas",
    howToUse: "Cómo usar",
    tool: "herramienta",
    howStep1: "Ingresa números, texto, fechas o información de archivo en los campos de arriba.",
    howStep2: "Revisa el resultado al instante y ajusta los datos si quieres comparar opciones.",
    howStep3: "Copia, descarga o reutiliza el resultado cuando la herramienta tenga una acción de exportación.",
    example: "Ejemplo",
    quickNote: "Nota rápida",
    quickNoteBody: "Los resultados son para planificación rápida del día a día. Verifica decisiones financieras, de salud, legales o comerciales importantes antes de actuar.",
    faq: "Preguntas frecuentes",
    isFree: "¿Esta herramienta es gratis?",
    isFreeBody: "Sí. Puedes usar esta página sin crear una cuenta.",
    savesData: "¿Guarda mis datos?",
    savesDataBody: "No se usa almacenamiento de cuenta para estas herramientas rápidas. La mayoría funciona directamente en el navegador.",
    mobile: "¿Puedo usarla en móvil?",
    mobileBody: "Sí. El diseño funciona en teléfonos, tablets y computadoras.",
    searchTools: "Buscar herramientas",
    openPage: "Abrir página",
    homeKicker: "Panel de calculadoras",
    homeTitle: "Un espacio limpio para cálculos rápidos, conversiones, escritura y herramientas de enfoque.",
    homeBody: "Cambia herramientas a la izquierda, ingresa valores y copia o descarga el resultado. Todo funciona localmente en el navegador excepto cuando el convertidor de moneda carga tasas en vivo.",
    toolGuide: "Guía de herramientas",
    toolGuideTitle: "Calculadoras y convertidores útiles sin abrir demasiadas pestañas.",
    toolGuideP1: "Usa las herramientas financieras para compras, presupuestos, préstamos, propinas y estimaciones de ahorro. Las herramientas de fecha y hora ayudan con plazos, timestamps y zonas horarias.",
    toolGuideP2: "Las utilidades incluyen códigos QR, conteo de palabras, notas temporales, temporizadores, contraseñas y limpieza de texto. Estas explicaciones también ayudan a que el sitio sea más útil para buscadores.",
    directoryKicker: "Directorio de herramientas",
    directoryTitle: "Todas las calculadoras, convertidores y utilidades rápidas gratis",
    directoryBody: "Este directorio ayuda a visitantes y buscadores a descubrir cada herramienta principal, página guía y artículo práctico de OmniTool Studio.",
    popularSearchPages: "Páginas populares de búsqueda",
    helpfulArticles: "Artículos útiles",
    footerBody: "Calculadoras, convertidores y utilidades rápidas para decisiones cotidianas.",
  },
} as const;

const legalUpdated = "May 3, 2026";

function shouldUseHashRouting() {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  const path = window.location.pathname;
  return host.includes("pplx") || host.includes("perplexity") || path.includes("/computer/") || path.includes("/web/direct-files/");
}

const adaptiveLocationHook = Object.assign(
  (options?: any) => {
    const browserLocation = useBrowserLocation(options);
    const hashLocation = useHashLocation(options);
    return shouldUseHashRouting() ? hashLocation : browserLocation;
  },
  {
    hrefs: (href: string) => (shouldUseHashRouting() ? `#${href}` : href),
  },
);

function getCategoryMeta(category: ToolFilter, language: Language) {
  return language === "es" ? categoryMetaEs[category] : categoryMeta[category];
}

function getToolCopy(tool: Tool, language: Language) {
  return language === "es" ? { ...tool, ...toolTranslations[tool.id] } : tool;
}

function getSeoLandingCopy(landing: SeoLanding, language: Language): SeoLanding {
  return language === "es" ? { ...landing, ...seoLandingTranslationsEs[landing.slug] } : landing;
}

function getBlogPostCopy(post: BlogPost, language: Language): BlogPost {
  return language === "es" ? { ...post, ...blogPostTranslationsEs[post.slug] } : post;
}

function getAdLabel(label: string, language: Language) {
  if (language === "en") return label;
  const map: Record<string, string> = {
    Advertisement: uiText.es.advertisement,
    "Page advertisement": uiText.es.pageAdvertisement,
    "Guide advertisement": uiText.es.guideAdvertisement,
    "Article advertisement": uiText.es.articleAdvertisement,
    "Bottom page advertisement": uiText.es.bottomPageAdvertisement,
  };
  return map[label] || label;
}

const interfaceTranslationsEs: Record<string, string> = {
  "Original price": "Precio original",
  "Discount %": "Descuento %",
  "Tax %": "Impuesto %",
  "Final total": "Total final",
  "Discount saved": "Descuento ahorrado",
  "Before tax": "Antes de impuestos",
  Bill: "Cuenta",
  "Tip %": "Propina %",
  People: "Personas",
  "Each person": "Cada persona",
  "Tip amount": "Monto de propina",
  "Grand total": "Total general",
  "Monthly income": "Ingreso mensual",
  "Fixed costs": "Costos fijos",
  "Variable costs": "Costos variables",
  "Savings goal": "Meta de ahorro",
  "Left before goal": "Disponible antes de la meta",
  "After goal": "Después de la meta",
  "Savings rate": "Tasa de ahorro",
  "Loan amount": "Monto del préstamo",
  "APR %": "APR %",
  Years: "Años",
  "Monthly pay": "Pago mensual",
  "Total interest": "Interés total",
  "Total paid": "Total pagado",
  "Starting amount": "Monto inicial",
  "Monthly deposit": "Depósito mensual",
  "APY %": "APY %",
  "Future value": "Valor futuro",
  Contributed: "Aportado",
  Growth: "Crecimiento",
  Gender: "Género",
  male: "hombre",
  female: "mujer",
  Age: "Edad",
  "Height cm": "Altura cm",
  "Weight kg": "Peso kg",
  Activity: "Actividad",
  Goal: "Meta",
  cut: "bajar",
  maintain: "mantener",
  bulk: "subir",
  "Target calories": "Calorías objetivo",
  BMR: "BMR",
  Maintain: "Mantenimiento",
  "Start date": "Fecha inicial",
  "Add days": "Sumar días",
  "Compare date": "Comparar fecha",
  "Date result": "Fecha resultante",
  "Days between": "Días entre fechas",
  Group: "Grupo",
  Amount: "Cantidad",
  From: "De",
  To: "A",
  Converted: "Convertido",
  Temperature: "Temperatura",
  "Temp from": "Temperatura de",
  "Temp to": "Temperatura a",
  "Temperature result": "Resultado de temperatura",
  "From currency": "Moneda de origen",
  "To currency": "Moneda de destino",
  "Rate status": "Estado de tasa",
  "Date and time": "Fecha y hora",
  "Source zone": "Zona de origen",
  "Target zone": "Zona destino",
  "Unix seconds": "Segundos Unix",
  ISO: "ISO",
  Local: "Local",
  Mode: "Modo",
  "Format JSON": "Formatear JSON",
  "Minify JSON": "Minificar JSON",
  "Base64 Encode": "Codificar Base64",
  "Base64 Decode": "Decodificar Base64",
  "CSV to JSON": "CSV a JSON",
  Status: "Estado",
  Words: "Palabras",
  Characters: "Caracteres",
  Sentences: "Oraciones",
  "Reading time": "Tiempo de lectura",
  Minutes: "Minutos",
  Length: "Longitud",
  Copy: "Copiar",
  Copied: "Copiado",
};

function translateInterfaceText(value: string | undefined, language: Language) {
  if (!value || language === "en") return value;
  return interfaceTranslationsEs[value] || value;
}

function Seo({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = `${title} | OmniTool Studio`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description);
  }, [title, description]);
  return null;
}

function LogoMark() {
  return (
    <svg className="h-10 w-10 text-primary" viewBox="0 0 44 44" fill="none" aria-label="OmniTool Studio logo">
      <path d="M22 4L37.5885 13V31L22 40L6.41154 31V13L22 4Z" stroke="currentColor" strokeWidth="2.5" />
      <path d="M15 17.5H29M15 26.5H29M22 11V33" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function PublicNav({ dark, setDark }: { dark: boolean; setDark: (value: boolean) => void }) {
  const { language, setLanguage } = useLanguage();
  const text = uiText[language];
  return (
    <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-5">
      <Link href="/" data-testid="link-home" className="flex items-center gap-3 rounded-xl">
        <LogoMark />
        <span>
          <span className="block text-lg font-black tracking-[-0.04em]">OmniTool Studio</span>
          <span className="block text-xs font-medium text-muted-foreground">{text.tagline}</span>
        </span>
      </Link>
      <nav className="hidden items-center gap-2 md:flex" aria-label="Public pages">
        {[
          [text.navTools, "/tools", "tools"],
          [text.navBlog, "/blog", "blog"],
          [text.navAbout, "/about", "about"],
          [text.navContact, "/contact", "contact"],
          [text.navPrivacy, "/privacy", "privacy"],
          [text.navTerms, "/terms", "terms"],
        ].map(([label, href, id]) => (
          <Link key={href} href={href} data-testid={`link-${id}`} className="rounded-xl px-3 py-2 text-sm font-bold text-muted-foreground transition hover:bg-secondary hover:text-foreground">
            {label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <label className="hidden text-xs font-black uppercase tracking-[0.16em] text-muted-foreground sm:block" htmlFor="language-select">
          {text.language}
        </label>
        <select
          id="language-select"
          data-testid="select-language"
          className="h-11 rounded-xl border border-border/70 bg-card px-3 text-sm font-black text-foreground shadow-xs outline-none transition focus:border-primary"
          value={language}
          onChange={(event) => setLanguage(event.target.value as Language)}
          aria-label={text.language}
        >
          <option value="en">EN</option>
          <option value="es">ES</option>
        </select>
        <button
          data-testid="button-theme-toggle-public"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/70 bg-card shadow-xs transition hover:bg-secondary"
          aria-label="Toggle dark mode"
          onClick={() => setDark(!dark)}
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}

function SiteFooter() {
  const { language } = useLanguage();
  const text = uiText[language];
  return (
    <footer className="mx-auto mt-6 max-w-7xl px-4 pb-8 sm:px-5">
      <div className="glass-panel rounded-[2rem] border hairline p-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black">OmniTool Studio</p>
            <p className="mt-1 text-sm text-muted-foreground">{text.footerBody}</p>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm font-bold text-muted-foreground" aria-label="Footer pages">
            <Link href="/tools" className="rounded-xl px-3 py-2 hover:bg-secondary hover:text-foreground">{text.navTools}</Link>
            <Link href="/blog" className="rounded-xl px-3 py-2 hover:bg-secondary hover:text-foreground">{text.navBlog}</Link>
            <Link href="/about" className="rounded-xl px-3 py-2 hover:bg-secondary hover:text-foreground">{text.navAbout}</Link>
            <Link href="/contact" className="rounded-xl px-3 py-2 hover:bg-secondary hover:text-foreground">{text.navContact}</Link>
            <Link href="/privacy" className="rounded-xl px-3 py-2 hover:bg-secondary hover:text-foreground">{text.navPrivacy}</Link>
            <Link href="/terms" className="rounded-xl px-3 py-2 hover:bg-secondary hover:text-foreground">{text.navTerms}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

}

const fallbackRates: Record<string, number> = {
  USD: 1,
  EUR: 0.91,
  GBP: 0.78,
  CAD: 1.37,
  JPY: 155.2,
  AUD: 1.52,
  CHF: 0.91,
  MXN: 17.1,
};

function money(value: number, currency = "USD") {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
}

function number(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(value);
}

function Field({
  label,
  value,
  onChange,
  type = "number",
  min,
  max,
  step,
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  min?: number;
  max?: number;
  step?: string;
  placeholder?: string;
}) {
  const { language } = useLanguage();
  const visibleLabel = translateInterfaceText(label, language);
  const visiblePlaceholder = translateInterfaceText(placeholder, language);
  return (
    <label className="space-y-2 text-sm font-medium text-muted-foreground">
      <span>{visibleLabel}</span>
      <input
        data-testid={`input-${label.toLowerCase().replace(/\s+/g, "-")}`}
        className="h-11 w-full rounded-xl border border-border/70 bg-card px-3 text-foreground shadow-xs outline-none transition focus:border-primary"
        type={type}
        min={min}
        max={max}
        step={step}
        value={value}
        placeholder={visiblePlaceholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const { language } = useLanguage();
  const visibleLabel = translateInterfaceText(label, language);
  return (
    <label className="space-y-2 text-sm font-medium text-muted-foreground">
      <span>{visibleLabel}</span>
      <select
        data-testid={`select-${label.toLowerCase().replace(/\s+/g, "-")}`}
        className="h-11 w-full rounded-xl border border-border/70 bg-card px-3 text-foreground shadow-xs outline-none transition focus:border-primary"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {translateInterfaceText(option, language)}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 8,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  const { language } = useLanguage();
  const visibleLabel = translateInterfaceText(label, language);
  const visiblePlaceholder = translateInterfaceText(placeholder, language);
  return (
    <label className="space-y-2 text-sm font-medium text-muted-foreground">
      <span>{visibleLabel}</span>
      <textarea
        data-testid={`textarea-${label.toLowerCase().replace(/\s+/g, "-")}`}
        className="w-full rounded-2xl border border-border/70 bg-card px-3 py-3 text-sm text-foreground shadow-xs outline-none transition focus:border-primary"
        rows={rows}
        value={value}
        placeholder={visiblePlaceholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function Result({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "accent" | "warn" }) {
  const { language } = useLanguage();
  const visibleLabel = translateInterfaceText(label, language);
  const toneClass =
    tone === "accent"
      ? "bg-primary text-primary-foreground"
      : tone === "warn"
        ? "bg-destructive/10 text-destructive"
        : "bg-secondary text-secondary-foreground";
  return (
    <div className={`rounded-2xl p-4 ${toneClass}`} data-testid={`text-result-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="text-xs font-medium uppercase tracking-[0.18em] opacity-70">{visibleLabel}</div>
      <div className="num mt-2 text-xl font-black">{value}</div>
    </div>
  );
}

function ToolShell({ tool, children }: { tool: Tool; children: React.ReactNode }) {
  const Icon = tool.icon;
  const { language } = useLanguage();
  const toolCopy = getToolCopy(tool, language);
  return (
    <section className="glass-panel rounded-[2rem] border hairline p-4 sm:p-6" data-testid={`panel-${tool.id}`}>
      <div className="mb-5 flex flex-col justify-between gap-4 border-b border-border/60 pb-5 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-[-0.03em]">{toolCopy.name}</h2>
            <p className="text-sm text-muted-foreground">{toolCopy.description}</p>
          </div>
        </div>
        <span className="w-fit rounded-full border border-border/70 bg-card px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
          {getCategoryMeta(tool.category, language).label}
        </span>
      </div>
      {children}
    </section>
  );
}

function CopyButton({ value }: { value: string }) {
  const { language } = useLanguage();
  const [done, setDone] = useState(false);
  return (
    <button
      data-testid="button-copy"
      className="inline-flex h-10 items-center gap-2 rounded-xl border border-border/70 bg-card px-3 text-sm font-bold shadow-xs transition hover:bg-secondary"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setDone(true);
        window.setTimeout(() => setDone(false), 1200);
      }}
    >
      <Copy className="h-4 w-4" aria-hidden="true" />
      {translateInterfaceText(done ? "Copied" : "Copy", language)}
    </button>
  );
}

function CalculatorPanels({ activeId }: { activeId: string }) {
  if (activeId === "discount") return <DiscountTool />;
  if (activeId === "tip") return <TipTool />;
  if (activeId === "budget") return <BudgetTool />;
  if (activeId === "loan") return <LoanTool />;
  if (activeId === "savings") return <SavingsTool />;
  if (activeId === "calories") return <CaloriesTool />;
  return <DateTool />;
}

function ConverterPanels({ activeId }: { activeId: string }) {
  if (activeId === "units") return <UnitsTool />;
  if (activeId === "currency") return <CurrencyTool />;
  if (activeId === "timezones") return <TimeZonesTool />;
  if (activeId === "timestamps") return <TimestampTool />;
  if (activeId === "data") return <DataTool />;
  return <PdfTool />;
}

function UtilityPanels({ activeId }: { activeId: string }) {
  if (activeId === "qr") return <QrTool />;
  if (activeId === "words") return <WordTool />;
  if (activeId === "notes") return <NotesTool />;
  if (activeId === "stopwatch") return <StopwatchTool />;
  if (activeId === "countdown") return <CountdownTool />;
  if (activeId === "password") return <PasswordTool />;
  return <TextTool />;
}

function ToolInteractive({ tool }: { tool: Tool }) {
  if (tool.category === "calculators") return <CalculatorPanels activeId={tool.id} />;
  if (tool.category === "converters") return <ConverterPanels activeId={tool.id} />;
  return <UtilityPanels activeId={tool.id} />;
}

function DiscountTool() {
  const [price, setPrice] = useState("120");
  const [discount, setDiscount] = useState("25");
  const [tax, setTax] = useState("9.5");
  const base = Number(price) || 0;
  const saved = base * ((Number(discount) || 0) / 100);
  const subtotal = base - saved;
  const total = subtotal * (1 + (Number(tax) || 0) / 100);
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Original price" value={price} onChange={setPrice} />
        <Field label="Discount %" value={discount} onChange={setDiscount} />
        <Field label="Tax %" value={tax} onChange={setTax} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result label="Final total" value={money(total)} tone="accent" />
        <Result label="Discount saved" value={money(saved)} />
        <Result label="Before tax" value={money(subtotal)} />
      </div>
    </div>
  );
}

function TipTool() {
  const [bill, setBill] = useState("86");
  const [tip, setTip] = useState("20");
  const [people, setPeople] = useState("3");
  const tipAmount = (Number(bill) || 0) * ((Number(tip) || 0) / 100);
  const total = (Number(bill) || 0) + tipAmount;
  const perPerson = total / Math.max(1, Number(people) || 1);
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Bill" value={bill} onChange={setBill} />
        <Field label="Tip %" value={tip} onChange={setTip} />
        <Field label="People" value={people} onChange={setPeople} min={1} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result label="Each person" value={money(perPerson)} tone="accent" />
        <Result label="Tip amount" value={money(tipAmount)} />
        <Result label="Grand total" value={money(total)} />
      </div>
    </div>
  );
}

function BudgetTool() {
  const [income, setIncome] = useState("3600");
  const [fixed, setFixed] = useState("1750");
  const [variable, setVariable] = useState("820");
  const [goal, setGoal] = useState("600");
  const left = (Number(income) || 0) - (Number(fixed) || 0) - (Number(variable) || 0);
  const afterGoal = left - (Number(goal) || 0);
  const rate = ((Number(goal) || 0) / Math.max(1, Number(income) || 1)) * 100;
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Monthly income" value={income} onChange={setIncome} />
        <Field label="Fixed costs" value={fixed} onChange={setFixed} />
        <Field label="Variable costs" value={variable} onChange={setVariable} />
        <Field label="Savings goal" value={goal} onChange={setGoal} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result label="Left before goal" value={money(left)} tone="accent" />
        <Result label="After goal" value={money(afterGoal)} tone={afterGoal < 0 ? "warn" : "default"} />
        <Result label="Savings rate" value={`${number(rate, 1)}%`} />
      </div>
    </div>
  );
}

function LoanTool() {
  const [principal, setPrincipal] = useState("25000");
  const [apr, setApr] = useState("7.25");
  const [years, setYears] = useState("5");
  const months = Math.max(1, (Number(years) || 0) * 12);
  const monthlyRate = (Number(apr) || 0) / 100 / 12;
  const payment =
    monthlyRate === 0
      ? (Number(principal) || 0) / months
      : ((Number(principal) || 0) * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  const total = payment * months;
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Loan amount" value={principal} onChange={setPrincipal} />
        <Field label="APR %" value={apr} onChange={setApr} step="0.01" />
        <Field label="Years" value={years} onChange={setYears} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result label="Monthly pay" value={money(payment)} tone="accent" />
        <Result label="Total interest" value={money(total - (Number(principal) || 0))} />
        <Result label="Total paid" value={money(total)} />
      </div>
    </div>
  );
}

function SavingsTool() {
  const [start, setStart] = useState("1500");
  const [monthly, setMonthly] = useState("250");
  const [apy, setApy] = useState("5");
  const [years, setYears] = useState("10");
  const months = Math.max(1, (Number(years) || 0) * 12);
  const rate = (Number(apy) || 0) / 100 / 12;
  let balance = Number(start) || 0;
  for (let i = 0; i < months; i += 1) balance = balance * (1 + rate) + (Number(monthly) || 0);
  const contributed = (Number(start) || 0) + (Number(monthly) || 0) * months;
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Starting amount" value={start} onChange={setStart} />
        <Field label="Monthly deposit" value={monthly} onChange={setMonthly} />
        <Field label="APY %" value={apy} onChange={setApy} />
        <Field label="Years" value={years} onChange={setYears} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result label="Future value" value={money(balance)} tone="accent" />
        <Result label="Contributed" value={money(contributed)} />
        <Result label="Growth" value={money(balance - contributed)} />
      </div>
    </div>
  );
}

function CaloriesTool() {
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("20");
  const [height, setHeight] = useState("178");
  const [weight, setWeight] = useState("75");
  const [activity, setActivity] = useState("1.55");
  const [goal, setGoal] = useState("maintain");
  const bmr =
    10 * (Number(weight) || 0) + 6.25 * (Number(height) || 0) - 5 * (Number(age) || 0) + (gender === "male" ? 5 : -161);
  const maintenance = bmr * (Number(activity) || 1);
  const target = goal === "cut" ? maintenance - 500 : goal === "bulk" ? maintenance + 300 : maintenance;
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField label="Gender" value={gender} options={["male", "female"]} onChange={setGender} />
        <Field label="Age" value={age} onChange={setAge} />
        <Field label="Height cm" value={height} onChange={setHeight} />
        <Field label="Weight kg" value={weight} onChange={setWeight} />
        <SelectField label="Activity" value={activity} options={["1.2", "1.375", "1.55", "1.725", "1.9"]} onChange={setActivity} />
        <SelectField label="Goal" value={goal} options={["cut", "maintain", "bulk"]} onChange={setGoal} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result label="Target calories" value={`${number(target, 0)} kcal`} tone="accent" />
        <Result label="BMR" value={`${number(bmr, 0)} kcal`} />
        <Result label="Maintain" value={`${number(maintenance, 0)} kcal`} />
      </div>
    </div>
  );
}

function DateTool() {
  const today = new Date().toISOString().slice(0, 10);
  const [start, setStart] = useState(today);
  const [days, setDays] = useState("45");
  const [end, setEnd] = useState(today);
  const resultDate = new Date(`${start}T12:00:00`);
  resultDate.setDate(resultDate.getDate() + (Number(days) || 0));
  const diff = Math.round((new Date(`${end}T12:00:00`).getTime() - new Date(`${start}T12:00:00`).getTime()) / 86400000);
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Start date" type="date" value={start} onChange={setStart} />
        <Field label="Add days" value={days} onChange={setDays} />
        <Field label="Compare date" type="date" value={end} onChange={setEnd} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Result label="Date result" value={resultDate.toLocaleDateString()} tone="accent" />
        <Result label="Days between" value={`${number(Math.abs(diff), 0)} days`} />
      </div>
    </div>
  );
}

const unitGroups = {
  Length: { meter: 1, kilometer: 1000, mile: 1609.344, foot: 0.3048, inch: 0.0254 },
  Weight: { kilogram: 1, gram: 0.001, pound: 0.45359237, ounce: 0.0283495 },
  Volume: { liter: 1, milliliter: 0.001, gallon: 3.78541, cup: 0.236588 },
};

function UnitsTool() {
  const [group, setGroup] = useState("Length");
  const [amount, setAmount] = useState("10");
  const names = Object.keys(unitGroups[group as keyof typeof unitGroups]);
  const [from, setFrom] = useState("meter");
  const [to, setTo] = useState("foot");
  const [tempFrom, setTempFrom] = useState("C");
  const [tempTo, setTempTo] = useState("F");
  const [temp, setTemp] = useState("22");
  const factors = unitGroups[group as keyof typeof unitGroups] as Record<string, number>;
  const converted = ((Number(amount) || 0) * (factors[from] || 1)) / (factors[to] || 1);
  const c = tempFrom === "C" ? Number(temp) || 0 : tempFrom === "F" ? ((Number(temp) || 0) - 32) * (5 / 9) : (Number(temp) || 0) - 273.15;
  const tempConverted = tempTo === "C" ? c : tempTo === "F" ? c * (9 / 5) + 32 : c + 273.15;
  useEffect(() => {
    const nextNames = Object.keys(unitGroups[group as keyof typeof unitGroups]);
    setFrom(nextNames[0]);
    setTo(nextNames[1]);
  }, [group]);
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="grid gap-4 sm:grid-cols-4">
          <SelectField label="Group" value={group} options={Object.keys(unitGroups)} onChange={setGroup} />
          <Field label="Amount" value={amount} onChange={setAmount} />
          <SelectField label="From" value={from} options={names} onChange={setFrom} />
          <SelectField label="To" value={to} options={names} onChange={setTo} />
        </div>
        <Result label="Converted" value={`${number(converted, 4)} ${to}`} tone="accent" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Temperature" value={temp} onChange={setTemp} />
          <SelectField label="Temp from" value={tempFrom} options={["C", "F", "K"]} onChange={setTempFrom} />
          <SelectField label="Temp to" value={tempTo} options={["C", "F", "K"]} onChange={setTempTo} />
        </div>
        <Result label="Temperature result" value={`${number(tempConverted, 2)} °${tempTo}`} />
      </div>
    </div>
  );
}

function CurrencyTool() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [rates, setRates] = useState(fallbackRates);
  const [status, setStatus] = useState("Offline fallback rates loaded");
  const codes = Object.keys(rates);
  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((response) => response.json())
      .then((data) => {
        if (data?.rates) {
          setRates({ ...fallbackRates, ...data.rates });
          setStatus(`Live rates loaded: ${new Date().toLocaleTimeString()}`);
        }
      })
      .catch(() => setStatus("Live rates unavailable, using fallback rates"));
  }, []);
  const usd = (Number(amount) || 0) / (rates[from] || 1);
  const converted = usd * (rates[to] || 1);
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Amount" value={amount} onChange={setAmount} />
        <SelectField label="From currency" value={from} options={codes} onChange={setFrom} />
        <SelectField label="To currency" value={to} options={codes} onChange={setTo} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Result label="Converted" value={money(converted, to)} tone="accent" />
        <Result label="Rate status" value={status} />
      </div>
    </div>
  );
}

function TimeZonesTool() {
  const zones = ["America/Los_Angeles", "America/New_York", "Europe/London", "Europe/Moscow", "Asia/Dubai", "Asia/Tokyo"];
  const [sourceZone, setSourceZone] = useState("America/Los_Angeles");
  const [targetZone, setTargetZone] = useState("Asia/Tokyo");
  const [dateTime, setDateTime] = useState(new Date().toISOString().slice(0, 16));
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const sourceDate = new Date(dateTime);
  return (
    <div className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Date and time" type="datetime-local" value={dateTime} onChange={setDateTime} />
        <SelectField label="Source zone" value={sourceZone} options={zones} onChange={setSourceZone} />
        <SelectField label="Target zone" value={targetZone} options={zones} onChange={setTargetZone} />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <Result
          label="Target display"
          value={new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: targetZone }).format(sourceDate)}
          tone="accent"
        />
        {zones.slice(0, 5).map((zone) => (
          <Result
            key={zone}
            label={zone.replace("_", " ").split("/").pop() || zone}
            value={new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: zone }).format(now)}
          />
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Browser timezone conversion displays the same moment in another zone. Use the source field as your local input moment.
      </p>
    </div>
  );
}

function TimestampTool() {
  const [stamp, setStamp] = useState(String(Math.floor(Date.now() / 1000)));
  const date = new Date((Number(stamp) || 0) * 1000);
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <div className="grid gap-4">
        <Field label="Unix seconds" value={stamp} onChange={setStamp} />
        <button
          data-testid="button-now-timestamp"
          className="h-11 rounded-xl bg-primary px-4 text-sm font-black text-primary-foreground transition hover:opacity-90"
          onClick={() => setStamp(String(Math.floor(Date.now() / 1000)))}
        >
          Use current time
        </button>
      </div>
      <div className="grid gap-3">
        <Result label="ISO" value={Number.isFinite(date.getTime()) ? date.toISOString() : "Invalid"} tone="accent" />
        <Result label="Local" value={Number.isFinite(date.getTime()) ? date.toLocaleString() : "Invalid"} />
      </div>
    </div>
  );
}

function DataTool() {
  const [input, setInput] = useState('{"name":"OmniTool","active":true,"tools":20}');
  const [mode, setMode] = useState("Format JSON");
  const output = useMemo(() => {
    try {
      if (mode === "Format JSON") return JSON.stringify(JSON.parse(input), null, 2);
      if (mode === "Minify JSON") return JSON.stringify(JSON.parse(input));
      if (mode === "Base64 Encode") return btoa(unescape(encodeURIComponent(input)));
      if (mode === "Base64 Decode") return decodeURIComponent(escape(atob(input)));
      const rows = input.trim().split(/\r?\n/).map((row) => row.split(","));
      const headers = rows.shift() || [];
      return JSON.stringify(rows.map((row) => Object.fromEntries(headers.map((h, i) => [h.trim(), row[i]?.trim() ?? ""]))), null, 2);
    } catch (error) {
      return `Could not process input: ${(error as Error).message}`;
    }
  }, [input, mode]);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <SelectField label="Mode" value={mode} options={["Format JSON", "Minify JSON", "Base64 Encode", "Base64 Decode", "CSV to JSON"]} onChange={setMode} />
        <TextArea label="Input" value={input} onChange={setInput} placeholder="Paste JSON, CSV, or text." rows={10} />
      </div>
      <div className="space-y-4">
        <div className="flex justify-end">
          <CopyButton value={output} />
        </div>
        <pre
          data-testid="text-data-output"
          className="min-h-[18rem] overflow-auto rounded-2xl border border-border/70 bg-secondary/70 p-4 text-sm text-foreground"
        >
          {output}
        </pre>
      </div>
    </div>
  );
}

function PdfTool() {
  const [status, setStatus] = useState("Choose a text, CSV, JSON, or image file.");
  const handleFile = async (file?: File) => {
    if (!file) return;
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text(file.name, 14, 18);
    pdf.setFontSize(10);
    pdf.text(`Generated by OmniTool Studio on ${new Date().toLocaleString()}`, 14, 26);
    if (file.type.startsWith("image/")) {
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.readAsDataURL(file);
      });
      pdf.addImage(dataUrl, file.type.includes("png") ? "PNG" : "JPEG", 14, 36, 170, 120, undefined, "FAST");
    } else {
      const text = await file.text();
      pdf.setFontSize(11);
      pdf.text(pdf.splitTextToSize(text.slice(0, 12000), 180), 14, 38);
    }
    pdf.save(`${file.name.replace(/\.[^.]+$/, "") || "file"}.pdf`);
    setStatus(`PDF generated for ${file.name}`);
  };
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <div className="rounded-3xl border border-dashed border-primary/45 bg-accent/40 p-6">
        <label className="flex min-h-[12rem] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl bg-card/70 p-6 text-center transition hover:bg-card">
          <Download className="h-8 w-8 text-primary" aria-hidden="true" />
          <span className="text-sm font-black">Drop in a file or click to choose</span>
          <span className="max-w-sm text-sm text-muted-foreground">Best for text, CSV, JSON, PNG, and JPG. Other file types receive a cover page with metadata.</span>
          <input data-testid="input-file-pdf" className="sr-only" type="file" onChange={(event) => handleFile(event.target.files?.[0])} />
        </label>
      </div>
      <div className="grid content-start gap-3">
        <Result label="Status" value={status} tone="accent" />
        <p className="text-sm leading-6 text-muted-foreground">
          Browser-only PDF conversion avoids uploading your file anywhere. Advanced Office document conversion would normally require a server-side converter.
        </p>
      </div>
    </div>
  );
}

function QrTool() {
  const [text, setText] = useState("https://www.perplexity.ai/");
  const [qr, setQr] = useState("");
  useEffect(() => {
    QRCode.toDataURL(text || " ", { margin: 2, width: 320, color: { dark: "#0F3037", light: "#FFFFFF" } }).then(setQr);
  }, [text]);
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <TextArea label="QR content" value={text} onChange={setText} rows={7} placeholder="Paste a URL, contact info, or plain text." />
        <CopyButton value={text} />
      </div>
      <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
        {qr && <img data-testid="img-qr-code" className="mx-auto rounded-2xl" src={qr} alt="Generated QR code" />}
        <a
          data-testid="link-download-qr"
          className="mt-4 flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-black text-primary-foreground"
          href={qr}
          download="omnitool-qr.png"
        >
          Download PNG
        </a>
      </div>
    </div>
  );
}

function WordTool() {
  const [text, setText] = useState("Paste your essay, LinkedIn post, or trading notes here.");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const sentences = (text.match(/[.!?]+/g) || []).length;
  const minutes = words / 220;
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <TextArea label="Text" value={text} onChange={setText} rows={11} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Result label="Words" value={number(words, 0)} tone="accent" />
        <Result label="Characters" value={number(chars, 0)} />
        <Result label="Sentences" value={number(sentences, 0)} />
        <Result label="Reading time" value={`${number(Math.max(1, minutes), 1)} min`} />
      </div>
    </div>
  );
}

function NotesTool() {
  const [note, setNote] = useState("");
  const download = () => {
    const blob = new Blob([note], { type: "text/plain" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = "omnitool-note.txt";
    link.click();
    URL.revokeObjectURL(href);
  };
  return (
    <div className="grid gap-4">
      <TextArea label="Session note" value={note} onChange={setNote} rows={12} placeholder="Write anything. Notes stay in this browser session only." />
      <div className="flex flex-wrap gap-3">
        <button data-testid="button-clear-note" className="h-11 rounded-xl border border-border/70 bg-card px-4 text-sm font-black" onClick={() => setNote("")}>
          Clear
        </button>
        <button data-testid="button-download-note" className="h-11 rounded-xl bg-primary px-4 text-sm font-black text-primary-foreground" onClick={download}>
          Download TXT
        </button>
      </div>
    </div>
  );
}

function StopwatchTool() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const started = useRef(0);
  useEffect(() => {
    if (!running) return;
    started.current = Date.now() - elapsed;
    const id = window.setInterval(() => setElapsed(Date.now() - started.current), 30);
    return () => window.clearInterval(id);
  }, [running]);
  const display = new Date(elapsed).toISOString().slice(14, 22);
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <div className="rounded-3xl bg-secondary p-6 text-center">
        <div className="num text-xl font-black tracking-[-0.03em]" data-testid="text-stopwatch-display">
          {display}
        </div>
        <div className="mt-5 flex justify-center gap-3">
          <button data-testid="button-toggle-stopwatch" className="h-11 rounded-xl bg-primary px-5 text-sm font-black text-primary-foreground" onClick={() => setRunning(!running)}>
            {running ? "Pause" : "Start"}
          </button>
          <button data-testid="button-lap-stopwatch" className="h-11 rounded-xl border border-border/70 bg-card px-5 text-sm font-black" onClick={() => setLaps([elapsed, ...laps])}>
            Lap
          </button>
          <button data-testid="button-reset-stopwatch" className="h-11 rounded-xl border border-border/70 bg-card px-5 text-sm font-black" onClick={() => { setRunning(false); setElapsed(0); setLaps([]); }}>
            Reset
          </button>
        </div>
      </div>
      <div className="max-h-56 overflow-auto rounded-3xl border border-border/70 bg-card p-4">
        {laps.length === 0 ? <p className="text-sm text-muted-foreground">Laps will appear here.</p> : laps.map((lap, index) => <div className="flex justify-between border-b border-border/50 py-2 text-sm" key={`${lap}-${index}`}><span>Lap {laps.length - index}</span><span className="num">{new Date(lap).toISOString().slice(14, 22)}</span></div>)}
      </div>
    </div>
  );
}

function CountdownTool() {
  const [minutes, setMinutes] = useState("25");
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          setRunning(false);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);
  const display = `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <div className="grid content-start gap-4">
        <Field label="Minutes" value={minutes} onChange={setMinutes} />
        <button data-testid="button-set-countdown" className="h-11 rounded-xl border border-border/70 bg-card px-4 text-sm font-black" onClick={() => setRemaining(Math.max(0, Number(minutes) || 0) * 60)}>
          Set timer
        </button>
      </div>
      <div className="rounded-3xl bg-secondary p-6 text-center">
        <div className="num text-xl font-black" data-testid="text-countdown-display">{display}</div>
        <div className="mt-5 flex justify-center gap-3">
          <button data-testid="button-toggle-countdown" className="h-11 rounded-xl bg-primary px-5 text-sm font-black text-primary-foreground" onClick={() => setRunning(!running)}>
            {running ? "Pause" : "Start"}
          </button>
          <button data-testid="button-reset-countdown" className="h-11 rounded-xl border border-border/70 bg-card px-5 text-sm font-black" onClick={() => { setRunning(false); setRemaining(Math.max(0, Number(minutes) || 0) * 60); }}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

function PasswordTool() {
  const [length, setLength] = useState("18");
  const [password, setPassword] = useState("");
  const generate = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*_-+=?";
    const array = new Uint32Array(Number(length) || 18);
    crypto.getRandomValues(array);
    setPassword(Array.from(array, (x) => chars[x % chars.length]).join(""));
  };
  useEffect(generate, []);
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-[180px_1fr_auto_auto] sm:items-end">
        <Field label="Length" value={length} onChange={setLength} min={8} max={64} />
        <div className="rounded-2xl border border-border/70 bg-secondary p-4">
          <div className="num break-all text-sm font-black" data-testid="text-generated-password">{password}</div>
        </div>
        <button data-testid="button-generate-password" className="h-11 rounded-xl bg-primary px-4 text-sm font-black text-primary-foreground" onClick={generate}>
          Generate
        </button>
        <CopyButton value={password} />
      </div>
    </div>
  );
}

function TextTool() {
  const [text, setText] = useState("Make this text cleaner and faster to reuse.");
  const slug = text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const outputs = [
    ["Uppercase", text.toUpperCase()],
    ["Lowercase", text.toLowerCase()],
    ["Title Case", text.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase())],
    ["Slug", slug],
    ["No Extra Spaces", text.replace(/\s+/g, " ").trim()],
    ["Reverse", Array.from(text).reverse().join("")],
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <TextArea label="Source text" value={text} onChange={setText} rows={10} />
      <div className="grid gap-3">
        {outputs.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-border/70 bg-card p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
              <CopyButton value={value} />
            </div>
            <p className="break-words text-sm" data-testid={`text-transform-${label.toLowerCase().replace(/\s+/g, "-")}`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StaticPageLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const { dark, setDark } = useTheme();
  return (
    <div className="quiet-grid min-h-screen">
      <Seo title={title} description={description} />
      <PublicNav dark={dark} setDark={setDark} />
      <main className="mx-auto max-w-4xl px-4 pb-6 sm:px-5">
        <article className="glass-panel rounded-[2rem] border hairline p-5 sm:p-8">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-primary">OmniTool Studio</p>
          <h1 className="text-xl font-black tracking-[-0.04em]">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
          <div className="mt-7 space-y-7 text-sm leading-7 text-foreground">{children}</div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

function AboutPage() {
  return (
    <StaticPageLayout
      title="About"
      description="OmniTool Studio is a fast browser-based collection of calculators, converters, and lightweight utilities."
    >
      <section>
        <h2 className="text-lg font-black tracking-[-0.02em]">What this site does</h2>
        <p className="mt-3 text-muted-foreground">
          OmniTool Studio brings everyday tools into one calm workspace: discount and tip calculators, budgeting helpers, loan and savings math, unit and currency conversion, date math, QR codes, word counting, notes, timers, password generation, text cleanup, and simple PDF creation.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-black tracking-[-0.02em]">How it is built</h2>
        <p className="mt-3 text-muted-foreground">
          Most utilities run directly in your browser for speed and privacy. The currency converter may request live exchange-rate data when available and falls back to sample rates if a network request fails.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-black tracking-[-0.02em]">Accuracy note</h2>
        <p className="mt-3 text-muted-foreground">
          The tools are designed for quick estimates and everyday planning. They are not financial, legal, medical, tax, or professional advice. Always verify important calculations before acting on them.
        </p>
      </section>
    </StaticPageLayout>
  );
}

function ContactPage() {
  return (
    <StaticPageLayout
      title="Contact"
      description="Reach the OmniTool Studio team with questions, bug reports, partnership requests, or correction suggestions."
    >
      <section>
        <h2 className="text-lg font-black tracking-[-0.02em]">Public contact email</h2>
        <p className="mt-3 text-muted-foreground">
          Gmail: kirill.moiseev.prof@gmail.com
        </p>
      </section>
      <section className="rounded-3xl bg-secondary p-5">
        <h2 className="text-lg font-black tracking-[-0.02em]">Suggested message format</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
          <li>What tool you used</li>
          <li>What result you expected</li>
          <li>What result you received</li>
          <li>Your device and browser if the issue is visual or interactive</li>
        </ul>
      </section>
    </StaticPageLayout>
  );
}

function PrivacyPage() {
  return (
    <StaticPageLayout
      title="Privacy Policy"
      description={`Last updated ${legalUpdated}. This page explains what OmniTool Studio collects and how browser-based tools handle data.`}
    >
      <section>
        <h2 className="text-lg font-black tracking-[-0.02em]">Information you enter into tools</h2>
        <p className="mt-3 text-muted-foreground">
          Most calculator, converter, QR, note, password, and text-tool inputs are processed in your browser session. The site does not require an account and does not intentionally store your tool inputs on a server.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-black tracking-[-0.02em]">Third-party services</h2>
        <p className="mt-3 text-muted-foreground">
          Some features may contact third-party services, such as exchange-rate providers for currency conversion or advertising providers after ads are enabled. Those services may receive technical data such as IP address, browser information, page URL, and request metadata.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-black tracking-[-0.02em]">Advertising and cookies</h2>
        <p className="mt-3 text-muted-foreground">
          If Google AdSense or another ad network is added, advertising partners may use cookies or similar technologies to serve, measure, and personalize ads according to their own policies and consent requirements. Ad placeholders on the current site are not active ad network code.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-black tracking-[-0.02em]">Contact</h2>
        <p className="mt-3 text-muted-foreground">
          Replace this paragraph with your public support email before submitting the site for ad approval or publishing it on a custom domain.
        </p>
      </section>
    </StaticPageLayout>
  );
}

function TermsPage() {
  return (
    <StaticPageLayout
      title="Terms of Use"
      description={`Last updated ${legalUpdated}. These terms explain the basic rules for using OmniTool Studio.`}
    >
      <section>
        <h2 className="text-lg font-black tracking-[-0.02em]">Use of the tools</h2>
        <p className="mt-3 text-muted-foreground">
          OmniTool Studio is provided for general information, estimation, productivity, and personal convenience. You are responsible for checking results before using them for financial, business, health, legal, or other important decisions.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-black tracking-[-0.02em]">No professional advice</h2>
        <p className="mt-3 text-muted-foreground">
          The calculators and utilities do not provide professional advice. Loan, savings, calorie, budget, and currency results are estimates and may differ from real-world outcomes, provider terms, taxes, fees, or market rates.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-black tracking-[-0.02em]">Availability</h2>
        <p className="mt-3 text-muted-foreground">
          The site may change, pause, or remove tools at any time. Some features depend on browser support, network access, or third-party data availability.
        </p>
      </section>
    </StaticPageLayout>
  );
}

function ToolPage() {
  const params = useParams<{ slug: string }>();
  const tool = tools.find((item) => item.slug === params.slug);
  const { dark, setDark } = useTheme();
  const { language } = useLanguage();
  const text = uiText[language];

  if (!tool) return <NotFound />;

  const relatedTools = tools.filter((item) => item.category === tool.category && item.id !== tool.id).slice(0, 5);
  const toolCopy = getToolCopy(tool, language);
  const titleKeyword = toolCopy.keyword.toLowerCase().startsWith("free ") ? toolCopy.keyword : `free ${toolCopy.keyword}`;
  const title = language === "es" ? `${toolCopy.name} gratis` : titleKeyword.charAt(0).toUpperCase() + titleKeyword.slice(1);
  const description =
    language === "es"
      ? `${toolCopy.description} Úsalo en línea dentro de OmniTool Studio.`
      : `${toolCopy.description} Use this ${toolCopy.keyword} online inside OmniTool Studio.`;

  return (
    <div className="quiet-grid min-h-screen">
      <Seo title={title} description={description} />
      <PublicNav dark={dark} setDark={setDark} />
      <main className="mx-auto grid max-w-7xl gap-4 px-4 pb-6 sm:px-5 lg:grid-cols-[1fr_20rem]">
        <section className="grid content-start gap-4">
          <section className="glass-panel rounded-[2rem] border hairline p-5 sm:p-7">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-primary">{getCategoryMeta(tool.category, language).label}</p>
            <h1 className="max-w-3xl text-xl font-black tracking-[-0.04em]">{title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/"
                data-testid="link-back-to-all-tools"
                className="rounded-xl bg-primary px-4 py-2 text-sm font-black text-primary-foreground shadow-sm transition hover:opacity-90"
              >
                {text.backToAllTools}
              </Link>
              <span className="rounded-xl border border-border/70 bg-card px-4 py-2 text-sm font-bold text-muted-foreground">
                {text.runsInBrowser}
              </span>
            </div>
          </section>

          <ToolShell tool={tool}>
            <ToolInteractive tool={tool} />
          </ToolShell>

          <section className="grid gap-4 md:grid-cols-2">
            <article className="glass-panel rounded-[2rem] border hairline p-5 sm:p-6">
              <h2 className="text-lg font-black tracking-[-0.03em]">
                {language === "es" ? `${text.howToUse} ${toolCopy.name}` : `${text.howToUse} ${toolCopy.name.toLowerCase()} ${text.tool}`}
              </h2>
              <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-muted-foreground">
                <li>{text.howStep1}</li>
                <li>{text.howStep2}</li>
                <li>{text.howStep3}</li>
              </ol>
            </article>
            <article className="glass-panel rounded-[2rem] border hairline p-5 sm:p-6">
              <h2 className="text-lg font-black tracking-[-0.03em]">{text.example}</h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{toolCopy.example}</p>
              <h3 className="mt-6 text-sm font-black uppercase tracking-[0.16em] text-primary">{text.quickNote}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {text.quickNoteBody}
              </p>
            </article>
          </section>

          <section className="glass-panel rounded-[2rem] border hairline p-5 sm:p-6">
            <h2 className="text-lg font-black tracking-[-0.03em]">{text.faq}</h2>
            <div className="mt-4 grid gap-4 text-sm leading-6 text-muted-foreground md:grid-cols-3">
              <div>
                <h3 className="font-black text-foreground">{text.isFree}</h3>
                <p className="mt-2">{text.isFreeBody}</p>
              </div>
              <div>
                <h3 className="font-black text-foreground">{text.savesData}</h3>
                <p className="mt-2">{text.savesDataBody}</p>
              </div>
              <div>
                <h3 className="font-black text-foreground">{text.mobile}</h3>
                <p className="mt-2">{text.mobileBody}</p>
              </div>
            </div>
          </section>
        </section>

        <aside className="grid content-start gap-4">
          <section className="glass-panel rounded-[2rem] border hairline p-5">
            <h2 className="text-lg font-black tracking-[-0.03em]">{text.relatedTools}</h2>
            <div className="mt-4 grid gap-2">
              {relatedTools.map((item) => {
                const Icon = item.icon;
                const itemCopy = getToolCopy(item, language);
                return (
                  <Link
                    key={item.id}
                    href={`/${item.slug}`}
                    data-testid={`link-related-tool-${item.id}`}
                    className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-3 transition hover:border-primary/50 hover:bg-accent"
                  >
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <span>
                      <span className="block text-sm font-black">{itemCopy.name}</span>
                      <span className="block text-xs leading-5 text-muted-foreground">{itemCopy.description}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}

function ToolsIndexPage() {
  const { language } = useLanguage();
  const text = uiText[language];
  const { dark, setDark } = useTheme();

  return (
    <div className="quiet-grid min-h-screen">
      <Seo
        title={language === "es" ? "Todas las calculadoras, convertidores y utilidades gratis" : "All Free Calculators, Converters, and Utilities"}
        description={language === "es" ? "Explora cada calculadora, convertidor, utilidad, guía y artículo de OmniTool Studio." : "Browse every OmniTool Studio calculator, converter, utility, SEO guide page, and article."}
      />
      <PublicNav dark={dark} setDark={setDark} />
      <main className="mx-auto max-w-7xl px-4 pb-6 sm:px-5">
        <section className="glass-panel rounded-[2rem] border hairline p-5 sm:p-7">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-primary">{text.directoryKicker}</p>
          <h1 className="text-xl font-black tracking-[-0.04em]">{text.directoryTitle}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            {text.directoryBody}
          </p>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-3">
          {(["calculators", "converters", "utilities"] as Category[]).map((category) => {
            const meta = getCategoryMeta(category, language);
            return (
              <article key={category} className="glass-panel rounded-[2rem] border hairline p-5">
                <h2 className="text-lg font-black tracking-[-0.03em]">{meta.label}</h2>
                <div className="mt-4 grid gap-2">
                  {tools.filter((tool) => tool.category === category).map((tool) => {
                    const toolCopy = getToolCopy(tool, language);
                    return (
                      <Link key={tool.id} href={`/${tool.slug}`} className="rounded-xl border border-border/60 bg-card px-3 py-2 text-sm font-bold transition hover:border-primary/50 hover:bg-accent">
                        {toolCopy.name}
                      </Link>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-4 glass-panel rounded-[2rem] border hairline p-5 sm:p-6">
          <h2 className="text-lg font-black tracking-[-0.03em]">{text.popularSearchPages}</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {seoLandings.map((page) => {
              const pageCopy = getSeoLandingCopy(page, language);
              return (
                <Link key={page.slug} href={`/${page.slug}`} className="rounded-xl border border-border/60 bg-card px-3 py-2 text-sm font-bold transition hover:border-primary/50 hover:bg-accent">
                  {pageCopy.title}
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-4 glass-panel rounded-[2rem] border hairline p-5 sm:p-6">
          <h2 className="text-lg font-black tracking-[-0.03em]">{text.helpfulArticles}</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => {
              const postCopy = getBlogPostCopy(post, language);
              return (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-xl border border-border/60 bg-card px-3 py-2 text-sm font-bold transition hover:border-primary/50 hover:bg-accent">
                  {postCopy.title}
                </Link>
              );
            })}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function SeoLandingPage() {
  const { language } = useLanguage();
  const text = uiText[language];
  const params = useParams<{ slug: string }>();
  const landing = seoLandings.find((item) => item.slug === params.slug);
  const tool = landing ? tools.find((item) => item.slug === landing.toolSlug) : undefined;
  const { dark, setDark } = useTheme();

  if (!landing || !tool) return <NotFound />;
  const toolCopy = getToolCopy(tool, language);
  const landingCopy = getSeoLandingCopy(landing, language);

  return (
    <div className="quiet-grid min-h-screen">
      <Seo title={landingCopy.title} description={landingCopy.description} />
      <PublicNav dark={dark} setDark={setDark} />
      <main className="mx-auto grid max-w-7xl gap-4 px-4 pb-6 sm:px-5 lg:grid-cols-[1fr_20rem]">
        <section className="grid content-start gap-4">
          <section className="glass-panel rounded-[2rem] border hairline p-5 sm:p-7">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-primary">{language === "es" ? "Guía popular" : "Popular guide"}</p>
            <h1 className="max-w-3xl text-xl font-black tracking-[-0.04em]">{landingCopy.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{landingCopy.description}</p>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">{landingCopy.useCase}</p>
          </section>

          <ToolShell tool={tool}>
            <ToolInteractive tool={tool} />
          </ToolShell>

          <section className="glass-panel rounded-[2rem] border hairline p-5 sm:p-6">
            <h2 className="text-lg font-black tracking-[-0.03em]">{language === "es" ? "Cómo usar esta página" : "How to use this page"}</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-muted-foreground">
              {landingCopy.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          <section className="glass-panel rounded-[2rem] border hairline p-5 sm:p-6">
            <h2 className="text-lg font-black tracking-[-0.03em]">{language === "es" ? "Recordatorio útil" : "Helpful reminder"}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {language === "es"
                ? "Esta página está pensada para estimaciones rápidas del día a día. Para decisiones financieras, médicas, fiscales, legales o de negocio importantes, verifica los resultados con una fuente profesional de confianza."
                : "This page is built for fast everyday estimates. For important financial, medical, tax, legal, or business decisions, verify results with a trusted professional source."}
            </p>
          </section>
        </section>

        <aside className="grid content-start gap-4">
          <section className="glass-panel rounded-[2rem] border hairline p-5">
            <h2 className="text-lg font-black tracking-[-0.03em]">{language === "es" ? "Páginas relacionadas" : "Related pages"}</h2>
            <div className="mt-4 grid gap-2">
              <Link href={`/${tool.slug}`} className="rounded-xl border border-border/60 bg-card px-3 py-2 text-sm font-bold transition hover:border-primary/50 hover:bg-accent">
                {language === "es" ? `Herramienta principal: ${toolCopy.name}` : `Main ${toolCopy.name} tool`}
              </Link>
              {seoLandings.filter((item) => item.toolSlug === tool.slug && item.slug !== landing.slug).slice(0, 5).map((item) => {
                const itemCopy = getSeoLandingCopy(item, language);
                return (
                  <Link key={item.slug} href={`/${item.slug}`} className="rounded-xl border border-border/60 bg-card px-3 py-2 text-sm font-bold transition hover:border-primary/50 hover:bg-accent">
                    {itemCopy.title}
                  </Link>
                );
              })}
            </div>
          </section>
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}

function BlogIndexPage() {
  const { language } = useLanguage();
  const { dark, setDark } = useTheme();

  return (
    <div className="quiet-grid min-h-screen">
      <Seo
        title={language === "es" ? "Guías útiles de calculadoras y productividad" : "Helpful Calculator and Productivity Guides"}
        description={language === "es" ? "Guías sencillas para descuentos, propinas, presupuestos, préstamos, ahorros, fechas, códigos QR, conteo de palabras y seguridad de contraseñas." : "Simple guides for discounts, tips, budgets, loans, savings, date math, QR codes, word counts, and password safety."}
      />
      <PublicNav dark={dark} setDark={setDark} />
      <main className="mx-auto max-w-7xl px-4 pb-6 sm:px-5">
        <section className="glass-panel rounded-[2rem] border hairline p-5 sm:p-7">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-primary">Blog</p>
          <h1 className="text-xl font-black tracking-[-0.04em]">{language === "es" ? "Guías útiles para cálculos diarios y herramientas rápidas" : "Helpful guides for everyday calculations and quick tools"}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            {language === "es"
              ? "Artículos cortos y fáciles para principiantes que explican cómo usar calculadoras, convertidores y utilidades de productividad en la vida real."
              : "Short, beginner-friendly articles that explain how to use calculators, converters, and productivity utilities in real life."}
          </p>
        </section>
        <section className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => {
            const postCopy = getBlogPostCopy(post, language);
            return (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="glass-panel rounded-[2rem] border hairline p-5 transition hover:border-primary/50 hover:bg-accent">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">{postCopy.readTime}</p>
                <h2 className="mt-3 text-lg font-black tracking-[-0.03em]">{postCopy.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{postCopy.description}</p>
              </Link>
            );
          })}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function BlogPostPage() {
  const { language } = useLanguage();
  const params = useParams<{ slug: string }>();
  const post = blogPosts.find((item) => item.slug === params.slug);
  const { dark, setDark } = useTheme();

  if (!post) return <NotFound />;
  const postCopy = getBlogPostCopy(post, language);

  return (
    <div className="quiet-grid min-h-screen">
      <Seo title={postCopy.title} description={postCopy.description} />
      <PublicNav dark={dark} setDark={setDark} />
      <main className="mx-auto grid max-w-7xl gap-4 px-4 pb-6 sm:px-5 lg:grid-cols-[1fr_20rem]">
        <article className="glass-panel rounded-[2rem] border hairline p-5 sm:p-8">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-primary">{postCopy.readTime}</p>
          <h1 className="max-w-3xl text-xl font-black tracking-[-0.04em]">{postCopy.title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{postCopy.description}</p>
          <div className="mt-8 space-y-7">
            {postCopy.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-lg font-black tracking-[-0.03em]">{section.heading}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{section.body}</p>
              </section>
            ))}
          </div>
        </article>
        <aside className="grid content-start gap-4">
          <section className="glass-panel rounded-[2rem] border hairline p-5">
            <h2 className="text-lg font-black tracking-[-0.03em]">{language === "es" ? "Herramientas útiles" : "Useful tools"}</h2>
            <div className="mt-4 grid gap-2">
              {tools.slice(0, 6).map((tool) => {
                const toolCopy = getToolCopy(tool, language);
                return (
                  <Link key={tool.id} href={`/${tool.slug}`} className="rounded-xl border border-border/60 bg-card px-3 py-2 text-sm font-bold transition hover:border-primary/50 hover:bg-accent">
                    {toolCopy.name}
                  </Link>
                );
              })}
            </div>
          </section>
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}

function Home() {
  const { language, setLanguage } = useLanguage();
  const { dark, setDark } = useTheme();
  const text = uiText[language];
  const [activeCategory, setActiveCategory] = useState<ToolFilter>("all");
  const [activeTool, setActiveTool] = useState("discount");
  const [query, setQuery] = useState("");
  useEffect(() => {
    document.title = language === "es" ? "OmniTool Studio - Calculadoras, convertidores y utilidades rápidas" : "OmniTool Studio - Calculators, Converters, and Quick Utilities";
  }, [language]);
  const filtered = tools.filter((tool) => {
    const categoryMatches = activeCategory === "all" || tool.category === activeCategory;
    const toolCopy = getToolCopy(tool, language);
    const meta = getCategoryMeta(tool.category, language);
    const queryMatches = `${tool.name} ${tool.description} ${tool.keyword} ${toolCopy.name} ${toolCopy.description} ${toolCopy.keyword} ${meta.label}`.toLowerCase().includes(query.toLowerCase());
    return categoryMatches && queryMatches;
  });
  const selected = tools.find((tool) => tool.id === activeTool) || tools[0];
  useEffect(() => {
    const visible = tools.filter((tool) => activeCategory === "all" || tool.category === activeCategory);
    if (!visible.some((tool) => tool.id === activeTool)) setActiveTool(visible[0].id);
  }, [activeCategory, activeTool]);
  return (
    <main className="quiet-grid min-h-screen p-3 sm:p-5">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[20rem_1fr]">
        <aside className="glass-panel rounded-[2rem] border hairline p-4 lg:sticky lg:top-5 lg:h-[calc(100dvh-2.5rem)] lg:overflow-auto">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <LogoMark />
              <div>
                <h1 className="text-xl font-black tracking-[-0.04em]">OmniTool Studio</h1>
                <p className="text-xs font-medium text-muted-foreground">{text.tagline}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="sr-only" htmlFor="home-language-select">
                {text.language}
              </label>
              <select
                id="home-language-select"
                data-testid="select-language-home"
                className="h-11 rounded-xl border border-border/70 bg-card px-2 text-xs font-black shadow-xs outline-none transition hover:bg-secondary"
                value={language}
                onChange={(event) => setLanguage(event.target.value as Language)}
                aria-label={text.language}
              >
                <option value="en">EN</option>
                <option value="es">ES</option>
              </select>
              <button
                data-testid="button-theme-toggle"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/70 bg-card shadow-xs transition hover:bg-secondary"
                aria-label="Toggle dark mode"
                onClick={() => setDark(!dark)}
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-border/70 bg-card p-2 lg:mt-5">
            {(["all", "calculators", "converters", "utilities"] as ToolFilter[]).map((category) => {
              const meta = getCategoryMeta(category, language);
              return (
                <button
                  key={category}
                  data-testid={`button-category-${category}`}
                  className={`w-full rounded-xl px-3 py-2.5 text-left transition lg:py-3 ${activeCategory === category ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-secondary"}`}
                  onClick={() => setActiveCategory(category)}
                >
                  <span className="block text-sm font-black">{meta.label}</span>
                  <span className="hidden text-xs opacity-75 sm:block">{meta.kicker}</span>
                </button>
              );
            })}
          </div>

          <label className="mt-4 flex h-11 items-center gap-2 rounded-xl border border-border/70 bg-card px-3 lg:mt-5">
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <input
              data-testid="input-search-tools"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              value={query}
              placeholder={text.searchTools}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>


          <div className="mt-4 grid max-h-56 gap-2 overflow-auto pr-1 lg:mt-5 lg:max-h-none lg:overflow-visible lg:pr-0">
            {filtered.map((tool) => {
              const Icon = tool.icon;
              const toolCopy = getToolCopy(tool, language);
              return (
                <div
                  key={tool.id}
                  className={`rounded-2xl border p-2 transition ${
                    activeTool === tool.id ? "border-primary/50 bg-accent text-accent-foreground shadow-sm" : "border-transparent hover:border-border/70 hover:bg-card"
                  }`}
                >
                  <button
                    data-testid={`button-tool-${tool.id}`}
                    className="group flex w-full items-start gap-3 rounded-xl p-1 text-left"
                    onClick={() => setActiveTool(tool.id)}
                  >
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <span>
                      <span className="block text-sm font-black">{toolCopy.name}</span>
                      <span className="hidden text-xs leading-5 text-muted-foreground sm:block">{toolCopy.description}</span>
                    </span>
                  </button>
                  <Link
                    href={`/${tool.slug}`}
                    data-testid={`link-tool-page-${tool.id}`}
                    className="ml-8 mt-1 inline-flex rounded-lg px-2 py-1 text-xs font-black text-primary transition hover:bg-primary/10"
                  >
                    {text.openPage}
                  </Link>
                </div>
              );
            })}
          </div>
        </aside>

        <section className="grid content-start gap-4">
          <div className="glass-panel order-2 overflow-hidden rounded-[2rem] border hairline lg:order-1">
            <div className="grid gap-5 p-5 md:grid-cols-[1.3fr_0.7fr] md:p-7">
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-primary">{text.homeKicker}</p>
                <h2 className="max-w-2xl text-xl font-black tracking-[-0.04em]">
                  {text.homeTitle}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {text.homeBody}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(["calculators", "converters", "utilities"] as Category[]).map((category) => (
                  <div key={category} className="rounded-2xl bg-secondary p-3">
                    <div className="num text-xl font-black">{tools.filter((tool) => tool.category === category).length}</div>
                    <div className="text-xs font-bold text-muted-foreground">{getCategoryMeta(category, language).label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <ToolShell tool={selected}>
              <ToolInteractive tool={selected} />
            </ToolShell>
          </div>

          <div className="order-3 grid gap-4">
            <section className="glass-panel rounded-[2rem] border hairline p-5 sm:p-6">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-primary">{text.toolGuide}</p>
              <h2 className="text-xl font-black tracking-[-0.04em]">{text.toolGuideTitle}</h2>
              <div className="mt-4 grid gap-4 text-sm leading-6 text-muted-foreground md:grid-cols-2">
                <p>
                  {text.toolGuideP1}
                </p>
                <p>
                  {text.toolGuideP2}
                </p>
              </div>
            </section>
          </div>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}

function SlugPage() {
  const params = useParams<{ slug: string }>();
  if (tools.some((tool) => tool.slug === params.slug)) return <ToolPage />;
  if (seoLandings.some((landing) => landing.slug === params.slug)) return <SeoLandingPage />;
  return <NotFound />;
}

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/tools" component={ToolsIndexPage} />
      <Route path="/blog" component={BlogIndexPage} />
      <Route path="/blog/:slug" component={BlogPostPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/:slug" component={SlugPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("es")) return "es";
    return "en";
  });
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <ThemeContext.Provider value={{ dark, setDark }}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Router hook={adaptiveLocationHook}>
              <AppRouter />
            </Router>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeContext.Provider>
    </LanguageContext.Provider>
  );
}

export default App;
