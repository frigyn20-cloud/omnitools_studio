export type SeoLanding = {
  slug: string;
  title: string;
  description: string;
  toolSlug: string;
  faqs: { question: string; answer: string }[];
};

export const seoLandings: SeoLanding[] = [
  {
    slug: "add-text-to-pdf-online",
    title: "Add Text to PDF Online — Free, No Upload",
    description: "Add typed text and a drawn or uploaded signature to any PDF right in your browser. Nothing is sent to a server.",
    toolSlug: "pdf-annotate-tool",
    faqs: [
      { question: "Is my PDF uploaded to a server?", answer: "No. Everything happens locally in your browser using pdf-lib. Your file never leaves your device." },
      { question: "Can I add a signature to a PDF?", answer: "Yes. You can draw a signature with your mouse or finger, or upload a signature image, and stamp it anywhere on the PDF." },
      { question: "What PDF features are supported?", answer: "You can add text at any position and font size, and place a signature image. Full content editing of existing PDF text is not supported." },
      { question: "Does it work on mobile?", answer: "Yes. The tool is fully responsive and the signature canvas supports touch drawing on phones and tablets." },
    ],
  },
  {
    slug: "discount-calculator-with-tax",
    title: "Discount Calculator with Tax — See Final Price Instantly",
    description: "Enter any original price, discount percentage, and sales tax rate to see the final price and how much you save.",
    toolSlug: "discount-calculator",
    faqs: [
      { question: "How do I calculate a discount?", answer: "Multiply the original price by the discount percentage to get the discount amount, then subtract it from the original price." },
      { question: "Does the calculator include tax?", answer: "Yes. After applying the discount it adds your sales tax rate so you see the true out-of-pocket cost." },
      { question: "Can I use it for coupons?", answer: "Yes. Enter the pre-coupon price as the original price and your coupon value as a percentage discount." },
    ],
  },
  {
    slug: "tip-calculator-split-bill",
    title: "Tip Calculator — Split Any Bill Evenly",
    description: "Enter the bill total, choose a tip percentage, and split the result between any number of people.",
    toolSlug: "tip-calculator",
    faqs: [
      { question: "How do I split a bill with tip?", answer: "Add the tip to the bill total first, then divide by the number of people. Our calculator does all three steps at once." },
      { question: "What tip percentage is standard?", answer: "15% is the traditional minimum in the US; 18–20% is now the common standard for sit-down restaurants." },
      { question: "Can I enter a custom tip amount?", answer: "Yes. Use the custom percentage field to enter any tip rate you prefer." },
    ],
  },
  {
    slug: "monthly-budget-calculator",
    title: "Monthly Budget Calculator — Income, Expenses & Savings Rate",
    description: "Plan your monthly budget by entering your income, fixed costs, and variable expenses to see your savings rate.",
    toolSlug: "budget-calculator",
    faqs: [
      { question: "What is a savings rate?", answer: "Your savings rate is the percentage of your income left after all expenses. A common target is 20% using the 50/30/20 rule." },
      { question: "What counts as a fixed expense?", answer: "Rent, mortgage, loan payments, insurance premiums, and subscriptions you pay the same amount for every month." },
      { question: "How do I reduce my expenses?", answer: "Start with variable costs like dining, entertainment, and subscriptions — these are easiest to cut without affecting daily life." },
    ],
  },
  {
    slug: "loan-payment-calculator",
    title: "Loan Payment Calculator — Monthly Payment & Total Interest",
    description: "Calculate the monthly payment and total interest for any loan amount, interest rate, and term.",
    toolSlug: "loan-calculator",
    faqs: [
      { question: "How is a monthly loan payment calculated?", answer: "The formula uses the loan principal, monthly interest rate, and number of payments to compute a fixed monthly amount that fully amortizes the loan." },
      { question: "What is a good interest rate for a personal loan?", answer: "Rates vary by credit score and lender. As of 2025, strong-credit borrowers see 7–12%; average credit borrowers see 15–25%." },
      { question: "Does the calculator show total interest paid?", answer: "Yes. It shows the monthly payment, total amount paid over the life of the loan, and total interest charged." },
    ],
  },
  {
    slug: "compound-savings-calculator",
    title: "Compound Savings Calculator — Grow Your Money Over Time",
    description: "See how an initial deposit and monthly contributions grow with compound interest over any number of years.",
    toolSlug: "savings-calculator",
    faqs: [
      { question: "What is compound interest?", answer: "Compound interest is interest earned on both the original principal and the accumulated interest from previous periods." },
      { question: "How often does interest compound?", answer: "Our calculator uses monthly compounding, which matches most savings accounts and CDs." },
      { question: "What annual return should I use?", answer: "High-yield savings accounts currently offer 4–5%. Broad index fund historical averages are around 7–10% annually." },
    ],
  },
  {
    slug: "daily-calorie-calculator",
    title: "Daily Calorie Calculator — Find Your TDEE & BMR",
    description: "Calculate your Basal Metabolic Rate and Total Daily Energy Expenditure based on age, height, weight, and activity level.",
    toolSlug: "calorie-calculator",
    faqs: [
      { question: "What is BMR?", answer: "Basal Metabolic Rate is the number of calories your body burns at complete rest to maintain basic functions like breathing and circulation." },
      { question: "What is TDEE?", answer: "Total Daily Energy Expenditure is your BMR multiplied by an activity factor. It estimates how many calories you burn in a typical day." },
      { question: "How many calories should I eat to lose weight?", answer: "A deficit of 500 calories per day below your TDEE typically produces about 1 pound of weight loss per week." },
    ],
  },
  {
    slug: "date-calculator-add-days",
    title: "Date Calculator — Add Days or Find Difference Between Dates",
    description: "Add or subtract days from any date, or calculate the number of days between two dates.",
    toolSlug: "date-calculator",
    faqs: [
      { question: "How do I add days to a date?", answer: "Enter a start date and the number of days to add. The calculator returns the resulting date, accounting for month lengths and leap years." },
      { question: "Can I subtract days from a date?", answer: "Yes. Enter a negative number of days to go backward from the start date." },
      { question: "How do I count business days?", answer: "Our date calculator counts all calendar days. For business days only, exclude Saturdays and Sundays from your count." },
    ],
  },
  {
    slug: "unit-converter",
    title: "Unit Converter — Length, Weight, Temperature & Volume",
    description: "Convert between metric and imperial units for length, weight, temperature, and volume instantly.",
    toolSlug: "unit-converter",
    faqs: [
      { question: "How do I convert kilometers to miles?", answer: "Multiply kilometers by 0.621371. For example, 10 km equals 6.21 miles." },
      { question: "How do I convert Celsius to Fahrenheit?", answer: "Multiply Celsius by 9/5 and add 32. For example, 20°C equals 68°F." },
      { question: "How do I convert kilograms to pounds?", answer: "Multiply kilograms by 2.20462. For example, 70 kg equals 154.32 pounds." },
    ],
  },
  {
    slug: "currency-converter",
    title: "Currency Converter — Live Exchange Rates",
    description: "Convert between major currencies using up-to-date exchange rates. Supports USD, EUR, GBP, JPY, CAD, AUD, CHF, and MXN.",
    toolSlug: "currency-converter",
    faqs: [
      { question: "How accurate are the exchange rates?", answer: "Rates are fetched from a public API and updated regularly. For large financial transactions, always verify with your bank or broker." },
      { question: "Which currencies are supported?", answer: "USD, EUR, GBP, JPY, CAD, AUD, CHF, and MXN. More currencies may be added in future updates." },
      { question: "Does it work offline?", answer: "If the API is unavailable, the converter falls back to recent cached rates so you still get a reasonable estimate." },
    ],
  },
  {
    slug: "time-zone-converter",
    title: "Time Zone Converter — Compare Cities Around the World",
    description: "Enter a time in one city and see the equivalent time in up to six major cities simultaneously.",
    toolSlug: "time-zone-converter",
    faqs: [
      { question: "Which cities are included?", answer: "Los Angeles, New York, London, Moscow, Dubai, and Tokyo — covering all major global time zones." },
      { question: "Does it account for daylight saving time?", answer: "Yes. The converter uses the browser's Intl API which automatically applies current DST rules for each location." },
      { question: "Can I use it to schedule international meetings?", answer: "Yes. Enter your proposed meeting time and instantly see what time that is for participants in other cities." },
    ],
  },
  {
    slug: "unix-timestamp-converter",
    title: "Unix Timestamp Converter — Epoch to Human-Readable Date",
    description: "Convert Unix epoch timestamps to ISO 8601, UTC, and local time formats, or convert a date back to a timestamp.",
    toolSlug: "timestamp-converter",
    faqs: [
      { question: "What is a Unix timestamp?", answer: "A Unix timestamp is the number of seconds that have elapsed since January 1, 1970, 00:00:00 UTC. It is used in most programming languages and databases." },
      { question: "How do I convert a Unix timestamp to a date?", answer: "Enter the number in the timestamp field and the converter shows the equivalent ISO 8601, UTC, and your local time." },
      { question: "What is the maximum Unix timestamp?", answer: "The 32-bit signed integer limit is 2,147,483,647, which corresponds to January 19, 2038 — known as the Year 2038 problem." },
    ],
  },
  {
    slug: "json-base64-csv-converter",
    title: "JSON, Base64 & CSV Converter — Format and Transform Data Online",
    description: "Format and minify JSON, encode and decode Base64 strings, and convert CSV data to JSON in your browser.",
    toolSlug: "data-format-converter",
    faqs: [
      { question: "How do I format JSON online?", answer: "Paste your minified JSON into the input field and click Format. The tool adds indentation and line breaks to make it readable." },
      { question: "How do I encode a string to Base64?", answer: "Switch to the Base64 tab, paste your plain text, and click Encode. The tool returns the Base64-encoded string instantly." },
      { question: "How do I convert CSV to JSON?", answer: "Switch to the CSV tab, paste your CSV data (first row as headers), and click Convert. The tool returns a JSON array of objects." },
    ],
  },
  {
    slug: "json-to-pdf-converter",
    title: "JSON to PDF Converter — Convert JSON, CSV & Text to PDF Free",
    description: "Upload or paste JSON, CSV, or plain text and download it as a formatted PDF. Images supported too.",
    toolSlug: "file-to-pdf-converter",
    faqs: [
      { question: "How do I convert JSON to PDF?", answer: "Paste your JSON into the text area or upload a .json file, then click Generate PDF. The tool formats the data and downloads the file." },
      { question: "Can I convert a CSV file to PDF?", answer: "Yes. Upload a .csv file or paste CSV text. The converter renders it as a formatted table in the PDF." },
      { question: "Are images supported?", answer: "Yes. Upload a PNG or JPG file and the converter embeds it into a PDF page at full width." },
    ],
  },
  {
    slug: "free-qr-code-generator",
    title: "Free QR Code Generator — Create & Download PNG Instantly",
    description: "Generate a QR code for any URL, text, phone number, or contact info and download it as a PNG for free.",
    toolSlug: "qr-code-generator",
    faqs: [
      { question: "What can I encode in a QR code?", answer: "Any plain text: URLs, email addresses, phone numbers, Wi-Fi credentials, contact cards, or short notes." },
      { question: "What file format is the download?", answer: "The QR code downloads as a PNG image at a resolution suitable for print and digital use." },
      { question: "Is there a character limit?", answer: "QR codes support up to about 4,296 alphanumeric characters, but shorter content produces a simpler, easier-to-scan code." },
    ],
  },
  {
    slug: "word-counter",
    title: "Word Counter — Count Words, Characters & Reading Time Online",
    description: "Paste any text to instantly count words, characters, sentences, paragraphs, and estimated reading time.",
    toolSlug: "word-counter",
    faqs: [
      { question: "How is reading time calculated?", answer: "Reading time is estimated at 200 words per minute, which is close to the average silent reading speed for adults." },
      { question: "Does it count characters with or without spaces?", answer: "The tool shows both: total characters including spaces, and total characters excluding spaces." },
      { question: "Can I use it for SEO meta descriptions?", answer: "Yes. Meta descriptions should be under 160 characters. Paste your draft and check the character count instantly." },
    ],
  },
  {
    slug: "online-notepad",
    title: "Online Notepad — Free Browser-Based Text Editor",
    description: "A fast, distraction-free scratch pad that lives in your browser. Type notes and download them as a text file.",
    toolSlug: "online-notepad",
    faqs: [
      { question: "Are my notes saved?", answer: "Notes are kept in your browser session. If you close the tab they are gone unless you download the file first." },
      { question: "Can I download my notes?", answer: "Yes. Click the download button to save your notes as a plain .txt file." },
      { question: "Does it support formatting?", answer: "The notepad is plain text only. For rich formatting, use the text tools or the PDF converter." },
    ],
  },
  {
    slug: "online-stopwatch",
    title: "Online Stopwatch — Free Lap Timer in Your Browser",
    description: "A precise browser-based stopwatch with lap recording. No app install needed.",
    toolSlug: "online-stopwatch",
    faqs: [
      { question: "How accurate is the stopwatch?", answer: "The stopwatch uses the browser's performance.now() API, which is accurate to sub-millisecond resolution." },
      { question: "Can I record laps?", answer: "Yes. Press the Lap button while the stopwatch is running to record a split time without stopping the main timer." },
      { question: "Does it work on mobile?", answer: "Yes. The buttons are touch-friendly and sized for easy tapping on phones and tablets." },
    ],
  },
  {
    slug: "countdown-timer",
    title: "Countdown Timer — Free Online Focus Timer",
    description: "Set any countdown duration and get a clear visual timer. Great for Pomodoro sessions, cooking, or meetings.",
    toolSlug: "countdown-timer",
    faqs: [
      { question: "Can I use it as a Pomodoro timer?", answer: "Yes. Set it to 25 minutes for a focus session and 5 minutes for a break — the classic Pomodoro intervals." },
      { question: "Does it play a sound when it finishes?", answer: "The timer plays a short alert tone when it reaches zero so you know it has finished without watching the screen." },
      { question: "Can I pause and resume?", answer: "Yes. Pause the countdown at any point and resume where you left off." },
    ],
  },
  {
    slug: "password-generator",
    title: "Password Generator — Create Strong Random Passwords Free",
    description: "Generate strong, random passwords with custom length and character sets. Copy with one click.",
    toolSlug: "password-generator",
    faqs: [
      { question: "How long should a password be?", answer: "Security experts recommend at least 16 characters for important accounts. Longer is always better." },
      { question: "Should I include symbols?", answer: "Yes. Mixing uppercase, lowercase, numbers, and symbols greatly increases entropy and makes brute-force attacks impractical." },
      { question: "Is the password generated locally?", answer: "Yes. Passwords are generated entirely in your browser using the Web Crypto API. Nothing is sent to any server." },
    ],
  },
  {
    slug: "online-text-tools",
    title: "Online Text Tools — Case Converter, Slug Generator & More",
    description: "Transform text with one click: uppercase, lowercase, title case, sentence case, slug, reverse, and cleanup tools.",
    toolSlug: "text-tools",
    faqs: [
      { question: "How do I convert text to title case?", answer: "Paste your text and click Title Case. The tool capitalizes the first letter of each major word following standard title-case rules." },
      { question: "What does the slug tool do?", answer: "The slug tool converts text to lowercase, replaces spaces with hyphens, and removes special characters — ready for use in URLs." },
      { question: "Can I remove extra spaces and line breaks?", answer: "Yes. The cleanup option collapses multiple spaces and removes extra blank lines from pasted text." },
    ],
  },
  {
    slug: "ai-text-summarizer-free",
    title: "AI Text Summarizer — Summarize Any Text Free Online",
    description: "Paste any article, essay, or long text and get a clear, concise AI-generated summary in seconds.",
    toolSlug: "ai-text-summarizer",
    faqs: [
      { question: "How does the AI summarizer work?", answer: "It sends your text to an AI language model that identifies the key points and returns a condensed version in plain language." },
      { question: "What is the maximum text length?", answer: "The tool handles texts up to several thousand words. Very long documents may need to be split into sections." },
      { question: "Is my text stored or used for training?", answer: "Text is sent to the AI API to generate the summary and is not stored or used to train any model." },
    ],
  },
];
