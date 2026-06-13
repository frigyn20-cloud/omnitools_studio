import type { VercelRequest, VercelResponse } from "@vercel/node";

// ─── Data (mirrored from App.tsx) ────────────────────────────────────────────

type SeoLanding = {
  slug: string;
  title: string;
  description: string;
  useCase: string;
  steps: string[];
  example?: string;
  howWorks?: string;
  equation?: string;
};

type BlogPost = {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  sections: { heading: string; body: string }[];
};

const tools: Record<string, { name: string; description: string; keyword: string }> = {
  "after-tax-salary-calculator": { name: "After Tax Salary Calculator", description: "Estimate take-home pay from a 55k salary after taxes.", keyword: "55k salary after taxes" },
  "discount-calculator": { name: "Discount Calculator", description: "Calculate sale price, tax, and saved amount.", keyword: "discount calculator with tax" },
  "tip-calculator": { name: "Tip Calculator", description: "Split a bill with tip.", keyword: "tip calculator split bill" },
  "budget-calculator": { name: "Budget Calculator", description: "Track income, expenses, and savings rate.", keyword: "monthly budget calculator" },
  "loan-calculator": { name: "Loan Calculator", description: "Monthly payment and total interest.", keyword: "loan payment calculator" },
  "savings-calculator": { name: "Savings Calculator", description: "Compound growth with deposits.", keyword: "compound savings calculator" },
  "calorie-calculator": { name: "Calorie Calculator", description: "BMR and daily calorie target.", keyword: "daily calorie calculator" },
  "date-calculator": { name: "Date Calculator", description: "Add days or compare two dates.", keyword: "date calculator add days" },
  "unit-converter": { name: "Unit Converter", description: "Length, weight, temperature, volume.", keyword: "unit converter" },
  "currency-converter": { name: "Currency Converter", description: "Live exchange rates.", keyword: "currency converter" },
  "time-zone-converter": { name: "Time Zone Converter", description: "Compare cities and convert times.", keyword: "time zone converter" },
  "timestamp-converter": { name: "Timestamp Converter", description: "Unix, ISO, and local date strings.", keyword: "unix timestamp converter" },
  "data-format-converter": { name: "Data Format Converter", description: "JSON, Base64, and CSV tools.", keyword: "JSON Base64 CSV converter" },
  "file-to-pdf-converter": { name: "JSON & CSV to PDF Converter", description: "Convert JSON, CSV, text, and images into PDFs.", keyword: "json to pdf converter" },
  "qr-code-generator": { name: "QR Code Generator", description: "Generate a downloadable QR code.", keyword: "free QR code generator" },
  "word-counter": { name: "Word Counter", description: "Counts, density, reading time.", keyword: "word counter" },
  "online-notepad": { name: "Online Notepad", description: "Fast scratch notes for the session.", keyword: "online notepad" },
  "online-stopwatch": { name: "Online Stopwatch", description: "Lap-ready stopwatch.", keyword: "online stopwatch" },
  "countdown-timer": { name: "Countdown Timer", description: "A simple focus timer.", keyword: "countdown timer" },
  "password-generator": { name: "Password Generator", description: "Generate strong passwords.", keyword: "password generator" },
  "text-tools": { name: "Text Tools", description: "Case, slug, reverse, cleanup.", keyword: "online text tools" },
  "ai-text-summarizer": { name: "AI Text Summarizer", description: "Summarize any text in seconds with AI.", keyword: "ai text summarizer free" },
  "pdf-signature-text-tool": { name: "PDF Annotate Tool", description: "Add text and signatures to any PDF in your browser.", keyword: "pdf signature tool online" },
};

const seoLandings: SeoLanding[] = [
  { slug: "percent-off-calculator", title: "Percent Off Calculator", description: "Calculate any percent-off discount, the amount saved, the sale price before tax, and the final total after tax.", useCase: "Use this page when a sale tag says 10%, 15%, 30%, or any other percent off and you want the real checkout estimate.", steps: ["Enter the original price.", "Enter the percent-off discount.", "Add sales tax if you want the final checkout estimate.", "Review the amount saved, sale price, and total."], example: "A $120 item with 25% off saves $30. The sale price before tax is $90, and with 9.5% tax the estimated total is $98.55.", howWorks: "The calculator converts the discount percentage into a decimal, multiplies it by the original price to find savings, subtracts the savings from the original price, then optionally adds sales tax.", equation: "Savings = Price × Discount %. Sale price = Price - Savings. Final total = Sale price × (1 + Tax %)." },
  { slug: "25-percent-off-calculator", title: "25 Percent Off Calculator", description: "Find the sale price, savings, and estimated after-tax total for a 25% discount.", useCase: "Use this page for common retail promotions where an item is marked 25% off.", steps: ["Enter the original price.", "Use 25 in the discount field.", "Enter tax if needed.", "Compare the final total with your budget."], example: "If the original price is $80, 25% off saves $20 and the sale price before tax is $60.", howWorks: "A 25% discount means you pay 75% of the original price before taxes or fees.", equation: "Sale price = Price × 0.75. Savings = Price × 0.25." },
  { slug: "50-percent-off-calculator", title: "50 Percent Off Calculator", description: "Calculate half-off sale prices, savings, and checkout totals with optional sales tax.", useCase: "Use this for clearance, Black Friday, seasonal sale, or buy-one-half-off price checks.", steps: ["Enter the original price.", "Set discount to 50.", "Add tax if you need checkout total.", "Review the half-price amount and savings."], example: "A $150 jacket at 50% off saves $75, leaving a $75 sale price before tax.", howWorks: "A 50% discount cuts the original price in half before any sales tax is applied.", equation: "Sale price = Price ÷ 2. Savings = Price ÷ 2." },
  { slug: "discount-calculator-with-tax", title: "Discount Calculator With Tax", description: "Calculate the discounted price and then add sales tax to estimate the final checkout total.", useCase: "Use this when a discount looks good but you need to know the total after local tax.", steps: ["Enter original price.", "Enter discount percentage.", "Enter your local tax rate.", "Read the final total after discount and tax."], example: "A $200 item with 15% off becomes $170 before tax. With 8% tax, the estimated total is $183.60.", howWorks: "The discount is applied first. Sales tax is calculated on the discounted sale price, not the original price.", equation: "Discounted price = Price × (1 - Discount %). Final total = Discounted price × (1 + Tax %)." },
  { slug: "sale-price-calculator", title: "Sale Price Calculator", description: "Estimate the sale price of an item after a discount and optional sales tax.", useCase: "Use this for shopping decisions, comparing promotions, and checking whether a sale is actually worth it.", steps: ["Type the regular price.", "Type the sale discount.", "Add tax if you want the checkout estimate.", "Use the sale price and savings to compare deals."], example: "If shoes cost $95 and are 30% off, the sale price is $66.50 before tax.", howWorks: "The sale price is the original price minus the discount value.", equation: "Sale price = Regular price - Discount value." },
  { slug: "days-between-dates-calculator", title: "Days Between Dates Calculator", description: "Count calendar days between two dates for deadlines, trips, billing periods, and planning.", useCase: "Use this when you need to know how many days are between a start date and an end date.", steps: ["Choose the start date.", "Choose the comparison date.", "Review the days between result.", "Use the answer for planning or scheduling."], example: "From May 1 to May 31, there are 30 days between the dates when counting elapsed days.", howWorks: "The calculator converts both dates into date values and subtracts the earlier date from the later date.", equation: "Days between = End date - Start date." },
  { slug: "business-days-between-dates", title: "Business Days Between Dates", description: "Estimate weekday business days between two dates by excluding Saturdays and Sundays.", useCase: "Use this for work deadlines, school timelines, shipping estimates, and project planning.", steps: ["Enter the start date.", "Enter the end date.", "Count weekdays between the dates.", "Adjust manually for holidays if needed."], example: "A Monday-to-Friday range in the same week has 4 elapsed business days.", howWorks: "Business-day estimates count weekdays and exclude weekend dates.", equation: "Business days = Calendar days - Saturdays - Sundays." },
  { slug: "age-calculator", title: "Age Calculator", description: "Calculate age or elapsed time between a birth date and another date.", useCase: "Use this for age checks, applications, school forms, and milestone planning.", steps: ["Enter the birth date as the start date.", "Enter today or another comparison date.", "Review the difference in days.", "Convert the result into years if needed."], example: "Someone born on May 4, 2000 is about 26 years old on May 4, 2026.", howWorks: "Age is based on the difference between the birth date and the comparison date.", equation: "Approximate age in years = Days between dates ÷ 365.2425." },
  { slug: "date-calculator-add-days", title: "Date Calculator Add Days", description: "Add a number of days to a date to find a future deadline or target date.", useCase: "Use this for return windows, project due dates, reminders, travel planning, and school assignments.", steps: ["Choose the starting date.", "Enter the number of days to add.", "Read the resulting date.", "Check weekends or holidays if the deadline is business-related."], example: "Adding 45 days to May 4, 2026 gives a future planning date in mid-June 2026.", howWorks: "The calculator adds the selected number of calendar days to the starting date.", equation: "Result date = Start date + Number of days." },
  { slug: "loan-payment-calculator", title: "Loan Payment Calculator", description: "Estimate a loan payment using loan amount, annual interest rate, and repayment term.", useCase: "Use this before comparing personal loans, car loans, student loans, or financing offers.", steps: ["Enter the loan amount.", "Enter the APR or interest rate.", "Enter the term in years.", "Review monthly payment, total paid, and total interest."], example: "A $25,000 loan at 7% APR for 5 years has an estimated monthly payment of about $495.", howWorks: "The loan tool uses a standard amortization formula.", equation: "Payment = P × r ÷ (1 - (1 + r)^-n)." },
  { slug: "monthly-loan-payment-calculator", title: "Monthly Loan Payment Calculator", description: "Calculate the estimated monthly payment for a fixed-rate loan.", useCase: "Use this when you care most about whether a payment fits your monthly budget.", steps: ["Enter borrowed amount.", "Add interest rate.", "Choose repayment term.", "Compare the monthly payment against your income."], example: "A smaller payment can come from a longer term, but total interest usually increases.", howWorks: "Monthly payment depends on principal, monthly interest rate, and number of payments.", equation: "Monthly rate = APR ÷ 12. Number of payments = Years × 12." },
  { slug: "savings-goal-calculator", title: "Savings Goal Calculator", description: "Project savings growth from a starting balance, monthly deposits, interest rate, and time horizon.", useCase: "Use this for emergency funds, travel, school costs, a car down payment, or any planned purchase.", steps: ["Enter your starting savings.", "Enter monthly deposit.", "Enter expected APY.", "Choose the number of years and review the future value."], example: "Starting with $1,000 and adding $250 monthly can build a meaningful savings balance over several years.", howWorks: "The calculator compounds growth monthly and adds regular deposits to estimate a future balance.", equation: "Future value ≈ Starting balance × (1 + monthly rate)^months + accumulated deposits." },
  { slug: "hourly-to-salary-calculator", title: "Hourly to Salary Calculator", description: "Convert an hourly wage into estimated weekly, monthly, and annual salary.", useCase: "Use this to compare hourly jobs, internship offers, part-time schedules, and full-time salary equivalents.", steps: ["Enter hourly pay.", "Multiply by hours per week.", "Multiply weekly pay by 52 for annual salary.", "Compare estimated income with expenses."], example: "$25 per hour at 40 hours per week is about $52,000 per year before taxes.", howWorks: "Salary conversion multiplies hourly pay by weekly hours and the number of paid weeks per year.", equation: "Annual salary = Hourly wage × Hours per week × 52." },
  { slug: "salary-to-hourly-calculator", title: "Salary to Hourly Calculator", description: "Convert annual salary into an estimated hourly wage.", useCase: "Use this to compare salary jobs with hourly work or understand the hourly value of an offer.", steps: ["Start with annual salary.", "Choose weekly hours.", "Divide salary by annual work hours.", "Use the result to compare offers."], example: "A $60,000 salary at 40 hours per week is about $28.85 per hour before taxes.", howWorks: "The calculator divides yearly pay by estimated yearly work hours.", equation: "Hourly wage = Annual salary ÷ (Hours per week × 52)." },
  { slug: "word-counter", title: "Word Counter – Count Words, Characters & Reading Time", description: "Count words, characters, sentences, and estimated reading time for text.", useCase: "Use this for essays, applications, blog posts, social captions, and writing assignments.", steps: ["Paste or type your text.", "Review word count and character count.", "Check sentence count and reading time.", "Edit the text until it matches your limit."], example: "A 750-word essay at about 200 words per minute takes roughly 4 minutes to read.", howWorks: "The tool splits text by spaces for words, counts all characters, and estimates reading time from word count.", equation: "Reading time ≈ Word count ÷ 200 words per minute." },
  { slug: "character-counter", title: "Character Counter", description: "Count characters for titles, bios, meta descriptions, posts, and form limits.", useCase: "Use this when a platform limits the number of characters you can submit.", steps: ["Paste the text.", "Check total characters.", "Shorten or expand the copy.", "Copy the final version."], example: "A search meta description works best when it is concise, clear, and under common display limits.", howWorks: "The counter measures every character in the text, including letters, numbers, punctuation, spaces, and line breaks.", equation: "Character count = Total number of text characters." },
  { slug: "qr-code-generator", title: "Free QR Code Generator", description: "Generate a QR code for a URL, text, contact detail, event note, or quick message.", useCase: "Use this for flyers, business cards, menus, presentations, classroom materials, or quick link sharing.", steps: ["Enter the URL or text.", "Generate the QR code.", "Download the QR image.", "Scan it with your phone to confirm it works."], example: "A flyer can include a QR code that opens a website without people typing the full address.", howWorks: "A QR code stores text data as a machine-readable pattern. Phone cameras decode the pattern.", equation: "QR output = Encoded text data + error correction pattern." },
  { slug: "password-generator", title: "Strong Password Generator – Free Online Tool", description: "Create strong random passwords for accounts, logins, and password managers.", useCase: "Use this to generate secure passwords for new accounts or when updating old ones.", steps: ["Choose password length.", "Select character types.", "Generate the password.", "Copy it to your password manager."], example: "A 16-character password with letters, numbers, and symbols is extremely hard to crack.", howWorks: "The generator combines random selections from each character category you choose.", equation: "Password strength increases exponentially with each additional character." },
  { slug: "after-tax-salary-calculator", title: "55k Salary After Taxes Calculator", description: "Estimate take-home pay from a 55k salary after taxes, including federal tax, state tax, FICA, and other yearly deductions.", useCase: "Use this to estimate how much of a 55k salary after taxes you actually keep.", steps: ["Enter gross annual salary.", "Enter estimated federal, state, and FICA tax rates.", "Add any extra yearly deductions.", "Review your estimated net yearly, monthly, biweekly, or weekly pay."], example: "A 55k salary after taxes will be lower than gross pay because federal tax, state tax, FICA, and other deductions reduce take-home income.", howWorks: "The calculator starts with gross salary, subtracts estimated taxes and deductions, then converts to yearly, monthly, biweekly, and weekly take-home pay.", equation: "Net income = Gross salary − Federal tax − State tax − FICA − Other deductions." },
];

const blogPosts: BlogPost[] = [
  { slug: "how-to-calculate-a-discount", title: "How to Calculate a Discount: A Simple Guide", description: "Learn how discount percentages work and how to find the final price after a sale.", readTime: "4 min read", sections: [{ heading: "What Is a Discount?", body: "A discount is a reduction from an original price. Retailers apply discounts to attract buyers, clear inventory, or reward customers. Understanding discounts helps you shop smarter." }, { heading: "The Basic Discount Formula", body: "To find savings: multiply the original price by the discount percentage. To find the sale price: subtract savings from the original price. For checkout total: add sales tax to the sale price." }, { heading: "Example: 25% Off a $120 Item", body: "Savings = $120 × 0.25 = $30. Sale price = $120 - $30 = $90. With 9.5% tax: $90 × 1.095 = $98.55 total." }] },
  { slug: "how-much-should-you-tip", title: "How Much Should You Tip? A Practical Guide", description: "Tipping can be confusing. This guide covers standard tip amounts, how to split bills, and when to tip more or less.", readTime: "5 min read", sections: [{ heading: "Standard Tip Amounts", body: "In the US, 15% is the minimum for acceptable service, 18-20% is standard, and 25%+ is for exceptional service at sit-down restaurants." }, { heading: "How to Calculate a Tip", body: "Multiply your bill by the tip percentage. For a $60 bill with 20% tip: $60 × 0.20 = $12 tip, $72 total." }, { heading: "Splitting the Bill", body: "Divide the total (bill plus tip) by the number of people. For $72 split 3 ways: $72 ÷ 3 = $24 per person." }] },
  { slug: "student-monthly-budget-basics", title: "Student Monthly Budget Basics", description: "A practical introduction to budgeting for students, covering income, fixed costs, variable spending, and savings goals.", readTime: "6 min read", sections: [{ heading: "Why Students Need a Budget", body: "A budget helps students avoid debt, understand their financial limits, and build savings habits early. Even a simple monthly plan makes a big difference." }, { heading: "Fixed vs. Variable Expenses", body: "Fixed expenses are the same every month: rent, subscriptions, loan payments. Variable expenses change: food, entertainment, clothing, transport." }, { heading: "The 50/30/20 Rule for Students", body: "Allocate 50% of income to needs, 30% to wants, and 20% to savings or debt repayment. Adjust based on your situation." }] },
  { slug: "loan-payment-basics", title: "Loan Payment Basics: How Monthly Payments Are Calculated", description: "Understand how lenders calculate monthly payments and total interest using the amortization formula.", readTime: "5 min read", sections: [{ heading: "What Is Amortization?", body: "Amortization spreads a loan into equal monthly payments. Each payment covers some interest and some principal. Early payments are mostly interest; later ones are mostly principal." }, { heading: "The Payment Formula", body: "Payment = P × r ÷ (1 − (1 + r)^−n), where P is principal, r is monthly interest rate, and n is total number of payments." }, { heading: "Why Longer Terms Mean More Interest", body: "A 5-year loan costs less interest than a 7-year loan on the same principal. Lower monthly payments come at the cost of higher total interest paid." }] },
  { slug: "compound-savings-explained", title: "Compound Savings Explained", description: "Learn how compound interest grows your savings over time, and why starting early matters.", readTime: "5 min read", sections: [{ heading: "What Is Compound Interest?", body: "Compound interest earns interest on both your original deposit and previous interest. This creates exponential growth over time, unlike simple interest which only earns on the principal." }, { heading: "The Power of Time", body: "Starting savings early dramatically increases final balances. An extra 10 years of growth can double or triple a savings balance at the same deposit rate." }, { heading: "Monthly Deposits Multiply Growth", body: "Adding regular monthly contributions accelerates compounding. Even small deposits, like $50 per month, significantly increase long-term savings balances." }] },
  { slug: "days-between-dates-guide", title: "Days Between Dates: A Complete Guide", description: "How to count calendar days, business days, and weeks between two dates accurately.", readTime: "4 min read", sections: [{ heading: "Counting Calendar Days", body: "Calendar days count every day including weekends and holidays. To count them, subtract the start date from the end date. Most date tools do this automatically." }, { heading: "Business Days vs. Calendar Days", body: "Business days exclude Saturdays and Sundays. Some calculations also exclude public holidays. Shipping estimates, project deadlines, and legal timelines often use business days." }, { heading: "Common Uses for Date Calculations", body: "Date math is useful for billing periods, return windows, age verification, project scheduling, lease end dates, and countdown timers." }] },
  { slug: "time-zone-meeting-tips", title: "Time Zone Meeting Tips for Remote Teams", description: "How to schedule meetings across time zones without confusion or missed calls.", readTime: "5 min read", sections: [{ heading: "The Core Problem with Time Zones", body: "Time zones can differ by 12+ hours. What is morning in New York is evening in Tokyo. Without a conversion tool, scheduling errors are common." }, { heading: "Best Practices for Scheduling", body: "Always confirm the time zone when scheduling. Use UTC or a shared reference city. Send calendar invites that automatically convert to each recipient's local time." }, { heading: "Overlap Windows", body: "Find the daily overlap between locations. For US and Europe, early morning US / mid-afternoon Europe usually works. For US and Asia, late evening US / morning Asia is the typical window." }] },
  { slug: "qr-code-ideas-for-small-projects", title: "QR Code Ideas for Small Projects", description: "Creative ways to use QR codes for personal projects, small businesses, and classroom materials.", readTime: "4 min read", sections: [{ heading: "Business Cards", body: "Add a QR code to your business card that links to your website, LinkedIn profile, or contact page. It saves space and makes your card interactive." }, { heading: "Event Flyers and Posters", body: "Replace long URLs with a QR code on flyers. Attendees scan to RSVP, view schedules, or get directions without typing anything." }, { heading: "Classroom and Education", body: "Teachers can use QR codes to link to assignment pages, instructional videos, or reference materials. Students scan instead of manually entering URLs." }] },
  { slug: "word-count-tips-for-essays", title: "Word Count Tips for Essays and Applications", description: "How to meet word count requirements for essays, college applications, and professional writing.", readTime: "4 min read", sections: [{ heading: "Why Word Counts Matter", body: "Word limits ensure fairness in college applications and standardize submissions for competitions and publications. Exceeding limits can disqualify work." }, { heading: "How to Reach a Word Count", body: "Add specific examples and evidence. Expand short paragraphs with context. Define key terms. Add a brief conclusion that reinforces your main point." }, { heading: "How to Cut Word Count", body: "Remove redundant phrases. Eliminate filler words like 'very', 'really', and 'basically'. Use active voice. Combine short, choppy sentences." }] },
  { slug: "password-safety-basics", title: "Password Safety Basics", description: "How to create strong passwords, avoid common mistakes, and protect your accounts.", readTime: "4 min read", sections: [{ heading: "What Makes a Password Weak?", body: "Short passwords, dictionary words, and personal information like birthdays or names are easy targets. Reusing the same password across sites is extremely risky." }, { heading: "What Makes a Password Strong?", body: "Strong passwords are at least 12 characters, use a mix of uppercase, lowercase, numbers, and symbols, and are unique for every account." }, { heading: "Use a Password Manager", body: "A password manager stores and generates unique strong passwords for every site. You only remember one master password. This is the most practical way to stay secure." }] },
];

// ─── Crawler detection ────────────────────────────────────────────────────────

const CRAWLER_PATTERNS = [
  /googlebot/i, /bingbot/i, /slurp/i, /duckduckbot/i, /baiduspider/i,
  /yandexbot/i, /sogou/i, /exabot/i, /facebot/i, /ia_archiver/i,
  /facebookexternalhit/i, /twitterbot/i, /linkedinbot/i, /whatsapp/i,
  /applebot/i, /semrushbot/i, /ahrefsbot/i, /mj12bot/i, /dotbot/i,
  /screaming.frog/i, /lighthouse/i, /gtmetrix/i, /pagespeed/i,
];

function isCrawler(ua: string): boolean {
  return CRAWLER_PATTERNS.some((p) => p.test(ua));
}

// ─── HTML builder ─────────────────────────────────────────────────────────────

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(opts: {
  title: string;
  description: string;
  canonical: string;
  h1: string;
  bodyHtml: string;
}): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${esc(opts.title)}</title>
<meta name="description" content="${esc(opts.description)}"/>
<link rel="canonical" href="${esc(opts.canonical)}"/>
<meta property="og:title" content="${esc(opts.title)}"/>
<meta property="og:description" content="${esc(opts.description)}"/>
<meta property="og:url" content="${esc(opts.canonical)}"/>
<meta property="og:type" content="website"/>
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"/>
<meta name="google-site-verification" content="tol0Wx9RC73L4p9cQh5AykkiEhNgLrhmnV7pdbmo2Qk"/>
<style>body{font-family:system-ui,sans-serif;max-width:900px;margin:0 auto;padding:1rem 1.5rem;line-height:1.6;color:#1a1a1a}h1{font-size:2rem;margin-bottom:.5rem}h2{font-size:1.3rem;margin-top:1.5rem}p{margin:.5rem 0}ol{padding-left:1.4rem}a{color:#01696f}nav{margin-bottom:1.5rem}</style>
</head>
<body>
<nav><a href="https://omnitoolstudio.com/">OmniTool Studio</a> &rsaquo; ${esc(opts.h1)}</nav>
<h1>${esc(opts.h1)}</h1>
${opts.bodyHtml}
<p style="margin-top:2rem"><a href="https://omnitoolstudio.com/">← Back to all free tools</a></p>
</body>
</html>`;
}

// ─── Page generators ──────────────────────────────────────────────────────────

function homePage(): string {
  const toolLinks = Object.entries(tools)
    .map(([slug, t]) => `<li><a href="https://omnitoolstudio.com/${slug}">${esc(t.name)}</a> – ${esc(t.description)}</li>`)
    .join("\n");
  return buildHtml({
    title: "OmniTool Studio – Free Online Calculators, Converters & Utilities",
    description: "Free online calculators, unit converters, QR code generator, password generator, word counter, text tools, timers and more. No sign-up required. Fast and mobile-friendly.",
    canonical: "https://omnitoolstudio.com/",
    h1: "Free Online Calculators, Converters & Utilities",
    bodyHtml: `
<p>OmniTool Studio offers 22+ free online tools — no sign-up required, no ads interrupting your workflow, and everything works on mobile.</p>
<h2>All Tools</h2>
<ul>${toolLinks}</ul>
<h2>Why OmniTool Studio?</h2>
<p>Every tool loads instantly, works without an account, and is completely free. Use our discount calculator, tip calculator, loan calculator, unit converter, currency converter, QR code generator, password generator, word counter, AI text summarizer, and more.</p>`,
  });
}

function toolPage(slug: string): string | null {
  const tool = tools[slug];
  if (!tool) return null;
  return buildHtml({
    title: `${tool.name} – Free Online Tool | OmniTool Studio`,
    description: tool.description + " Free, no sign-up required. Works on any device.",
    canonical: `https://omnitoolstudio.com/${slug}`,
    h1: tool.name,
    bodyHtml: `
<p>${esc(tool.description)}</p>
<p>Search for: <strong>${esc(tool.keyword)}</strong></p>
<p>This free online tool works on any device without sign-up or download. Part of <a href="https://omnitoolstudio.com/">OmniTool Studio</a>'s free tool suite.</p>
<h2>How to Use</h2>
<p>Open the tool, enter your values, and get instant results. No account required.</p>`,
  });
}

function seoLandingPage(slug: string): string | null {
  const page = seoLandings.find((s) => s.slug === slug);
  if (!page) return null;
  const steps = page.steps.map((s) => `<li>${esc(s)}</li>`).join("\n");
  return buildHtml({
    title: `${page.title} | OmniTool Studio`,
    description: page.description,
    canonical: `https://omnitoolstudio.com/${slug}`,
    h1: page.title,
    bodyHtml: `
<p>${esc(page.description)}</p>
<h2>How to Use</h2>
<ol>${steps}</ol>
${page.example ? `<h2>Example</h2><p>${esc(page.example)}</p>` : ""}
${page.howWorks ? `<h2>How It Works</h2><p>${esc(page.howWorks)}</p>` : ""}
${page.equation ? `<h2>Formula</h2><p><strong>${esc(page.equation)}</strong></p>` : ""}
<h2>Use Case</h2><p>${esc(page.useCase)}</p>`,
  });
}

function blogPostPage(slug: string): string | null {
  const post = blogPosts.find((b) => b.slug === slug);
  if (!post) return null;
  const sections = post.sections
    .map((s) => `<h2>${esc(s.heading)}</h2><p>${esc(s.body)}</p>`)
    .join("\n");
  return buildHtml({
    title: `${post.title} | OmniTool Studio Blog`,
    description: post.description,
    canonical: `https://omnitoolstudio.com/blog/${slug}`,
    h1: post.title,
    bodyHtml: `<p><em>${esc(post.readTime)}</em></p><p>${esc(post.description)}</p>${sections}`,
  });
}

function toolsPage(): string {
  const toolLinks = Object.entries(tools)
    .map(([slug, t]) => `<li><a href="https://omnitoolstudio.com/${slug}">${esc(t.name)}</a> – ${esc(t.description)}</li>`)
    .join("\n");
  return buildHtml({
    title: "All Free Online Tools | OmniTool Studio",
    description: "Browse all 22+ free online tools on OmniTool Studio: calculators, converters, utilities, and AI tools. No sign-up required.",
    canonical: "https://omnitoolstudio.com/tools",
    h1: "All Free Online Tools",
    bodyHtml: `<p>Browse every free tool available on OmniTool Studio. No account needed.</p><ul>${toolLinks}</ul>`,
  });
}

function blogIndexPage(): string {
  const postLinks = blogPosts
    .map((b) => `<li><a href="https://omnitoolstudio.com/blog/${b.slug}">${esc(b.title)}</a> – ${esc(b.description)}</li>`)
    .join("\n");
  return buildHtml({
    title: "Blog | OmniTool Studio",
    description: "Tips, guides, and how-to articles about calculators, converters, and everyday math from OmniTool Studio.",
    canonical: "https://omnitoolstudio.com/blog",
    h1: "OmniTool Studio Blog",
    bodyHtml: `<p>Guides and tips for using calculators, converters, and everyday tools.</p><ul>${postLinks}</ul>`,
  });
}

// ─── Route resolver ───────────────────────────────────────────────────────────

function resolvePage(pathname: string): string | null {
  const p = pathname.replace(/\/$/, "") || "/";

  if (p === "/" || p === "") return homePage();
  if (p === "/tools") return toolsPage();
  if (p === "/blog") return blogIndexPage();

  // blog post
  const blogMatch = p.match(/^\/blog\/(.+)$/);
  if (blogMatch) return blogPostPage(blogMatch[1]);

  const slug = p.replace(/^\//, "");

  // tool page
  if (tools[slug]) return toolPage(slug);

  // seo landing
  const landing = seoLandingPage(slug);
  if (landing) return landing;

  // fallback: generic page based on slug
  const formatted = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return buildHtml({
    title: `${formatted} | OmniTool Studio`,
    description: `Use the free ${formatted.toLowerCase()} on OmniTool Studio. No sign-up required.`,
    canonical: `https://omnitoolstudio.com/${slug}`,
    h1: formatted,
    bodyHtml: `<p>Use this free online tool on <a href="https://omnitoolstudio.com/">OmniTool Studio</a>. No account required.</p>`,
  });
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default function handler(req: VercelRequest, res: VercelResponse) {
  const ua = (req.headers["user-agent"] || "").toString();
  const pathname = (req.query.__path as string) || req.url || "/";

  // Only serve pre-rendered HTML to crawlers; redirect browsers to the SPA
  if (!isCrawler(ua)) {
    res.setHeader("Location", pathname === "/api/render" ? "/" : pathname);
    return res.status(302).end();
  }

  const html = resolvePage(pathname);
  if (!html) {
    return res.status(404).send("Not found");
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=3600");
  res.setHeader("X-Robots-Tag", "index, follow");
  return res.status(200).send(html);
}
