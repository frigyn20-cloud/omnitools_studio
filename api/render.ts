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
  "age-calculator": { name: "Age Calculator", description: "Calculate your exact age or time between dates.", keyword: "age calculator" },
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
  "bmr-calculator": { name: "BMR Calculator", description: "Calculate your Basal Metabolic Rate and daily calorie needs.", keyword: "bmr calculator" },
  "base64-encoder-decoder": { name: "Base64 Encoder / Decoder", description: "Encode or decode Base64 strings instantly.", keyword: "base64 encoder decoder online" },
  "csv-to-json-converter": { name: "CSV to JSON Converter", description: "Convert CSV data to JSON format online for free.", keyword: "csv to json converter" },
};

const seoLandings: SeoLanding[] = [
  // ── DISCOUNT / PERCENT ──────────────────────────────────────────────────────
  { slug: "percent-off-calculator", title: "Percent Off Calculator", description: "Calculate any percent-off discount, the amount saved, the sale price before tax, and the final total after tax.", useCase: "Use this page when a sale tag says 10%, 15%, 30%, or any other percent off and you want the real checkout estimate.", steps: ["Enter the original price.", "Enter the percent-off discount.", "Add sales tax if you want the final checkout estimate.", "Review the amount saved, sale price, and total."], example: "A $120 item with 25% off saves $30. The sale price before tax is $90, and with 9.5% tax the estimated total is $98.55.", howWorks: "The calculator converts the discount percentage into a decimal, multiplies it by the original price to find savings, subtracts the savings from the original price, then optionally adds sales tax.", equation: "Savings = Price × Discount %. Sale price = Price - Savings. Final total = Sale price × (1 + Tax %)." },
  { slug: "25-percent-off-calculator", title: "25 Percent Off Calculator", description: "Find the sale price, savings, and estimated after-tax total for a 25% discount.", useCase: "Use this page for common retail promotions where an item is marked 25% off.", steps: ["Enter the original price.", "Use 25 in the discount field.", "Enter tax if needed.", "Compare the final total with your budget."], example: "If the original price is $80, 25% off saves $20 and the sale price before tax is $60.", howWorks: "A 25% discount means you pay 75% of the original price before taxes or fees.", equation: "Sale price = Price × 0.75. Savings = Price × 0.25." },
  { slug: "50-percent-off-calculator", title: "50 Percent Off Calculator", description: "Calculate half-off sale prices, savings, and checkout totals with optional sales tax.", useCase: "Use this for clearance, Black Friday, seasonal sale, or buy-one-half-off price checks.", steps: ["Enter the original price.", "Set discount to 50.", "Add tax if you need checkout total.", "Review the half-price amount and savings."], example: "A $150 jacket at 50% off saves $75, leaving a $75 sale price before tax.", howWorks: "A 50% discount cuts the original price in half before any sales tax is applied.", equation: "Sale price = Price ÷ 2. Savings = Price ÷ 2." },
  { slug: "discount-calculator-with-tax", title: "Discount Calculator With Tax", description: "Calculate the discounted price and then add sales tax to estimate the final checkout total.", useCase: "Use this when a discount looks good but you need to know the total after local tax.", steps: ["Enter original price.", "Enter discount percentage.", "Enter your local tax rate.", "Read the final total after discount and tax."], example: "A $200 item with 15% off becomes $170 before tax. With 8% tax, the estimated total is $183.60.", howWorks: "The discount is applied first. Sales tax is calculated on the discounted sale price, not the original price.", equation: "Discounted price = Price × (1 - Discount %). Final total = Discounted price × (1 + Tax %)." },
  { slug: "sale-price-calculator", title: "Sale Price Calculator", description: "Estimate the sale price of an item after a discount and optional sales tax.", useCase: "Use this for shopping decisions, comparing promotions, and checking whether a sale is actually worth it.", steps: ["Type the regular price.", "Type the sale discount.", "Add tax if you want the checkout estimate.", "Use the sale price and savings to compare deals."], example: "If shoes cost $95 and are 30% off, the sale price is $66.50 before tax.", howWorks: "The sale price is the original price minus the discount value.", equation: "Sale price = Regular price - Discount value." },
  { slug: "how-much-is-20-percent-off", title: "How Much Is 20 Percent Off?", description: "Instantly calculate the sale price and savings when something is 20% off.", useCase: "Use this when a price tag or online sale shows 20% off and you want to verify the actual price.", steps: ["Enter the original price.", "The tool applies 20% off automatically.", "Add tax if needed.", "See the final price and savings."], example: "20% off a $75 item saves $15, making the sale price $60 before tax.", howWorks: "20% off means you pay 80% of the original price.", equation: "Sale price = Price × 0.80. Savings = Price × 0.20." },
  { slug: "discount-calculator-how-much-do-i-save", title: "How Much Do I Save? Discount Calculator", description: "Find out exactly how much money you save with any discount percentage.", useCase: "Use this to quickly check real savings before making a purchase decision.", steps: ["Enter the original price.", "Enter the discount percentage.", "Read the savings amount and final price.", "Compare with your budget."], example: "A 35% discount on a $200 item saves $70, leaving a $130 sale price.", howWorks: "Savings equal the original price multiplied by the discount percentage.", equation: "Savings = Original price × Discount %." },
  { slug: "percentage-of-a-number-calculator", title: "Percentage of a Number Calculator", description: "Calculate what percentage one number is of another, or find a percentage of any number.", useCase: "Use this for tips, test scores, discounts, tax calculations, and any percentage math.", steps: ["Enter the percentage.", "Enter the total number.", "Read the result.", "Use for any percentage calculation."], example: "15% of 200 = 30. Or: 30 is 15% of 200.", howWorks: "A percentage is a fraction out of 100 multiplied by the base number.", equation: "Result = (Percentage ÷ 100) × Number." },

  // ── DATE ────────────────────────────────────────────────────────────────────
  { slug: "days-between-dates-calculator", title: "Days Between Dates Calculator", description: "Count calendar days between two dates for deadlines, trips, billing periods, and planning.", useCase: "Use this when you need to know how many days are between a start date and an end date.", steps: ["Choose the start date.", "Choose the comparison date.", "Review the days between result.", "Use the answer for planning or scheduling."], example: "From May 1 to May 31, there are 30 days between the dates when counting elapsed days.", howWorks: "The calculator converts both dates into date values and subtracts the earlier date from the later date.", equation: "Days between = End date - Start date." },
  { slug: "business-days-between-dates", title: "Business Days Between Dates", description: "Estimate weekday business days between two dates by excluding Saturdays and Sundays.", useCase: "Use this for work deadlines, school timelines, shipping estimates, and project planning.", steps: ["Enter the start date.", "Enter the end date.", "Count weekdays between the dates.", "Adjust manually for holidays if needed."], example: "A Monday-to-Friday range in the same week has 4 elapsed business days.", howWorks: "Business-day estimates count weekdays and exclude weekend dates.", equation: "Business days = Calendar days - Saturdays - Sundays." },
  { slug: "date-calculator-add-days", title: "Date Calculator Add Days", description: "Add a number of days to a date to find a future deadline or target date.", useCase: "Use this for return windows, project due dates, reminders, travel planning, and school assignments.", steps: ["Choose the starting date.", "Enter the number of days to add.", "Read the resulting date.", "Check weekends or holidays if the deadline is business-related."], example: "Adding 45 days to May 4, 2026 gives a future planning date in mid-June 2026.", howWorks: "The calculator adds the selected number of calendar days to the starting date.", equation: "Result date = Start date + Number of days." },
  { slug: "day-of-week-calculator", title: "Day of Week Calculator", description: "Find out what day of the week any date falls on — past, present, or future.", useCase: "Use this to check what day a birthday, holiday, deadline, or historical date lands on.", steps: ["Enter any date.", "Read the day of the week result.", "Use for planning or historical lookup."], example: "January 1, 2030 falls on a Tuesday.", howWorks: "The calculator converts the date into a numeric day value using the Gregorian calendar algorithm.", equation: "Day of week = (Date value) mod 7." },
  { slug: "how-many-days-between-two-dates", title: "How Many Days Between Two Dates", description: "Count the exact number of days between any two calendar dates.", useCase: "Use this for event planning, billing periods, lease calculations, or travel countdowns.", steps: ["Set the first date.", "Set the second date.", "Read the day count.", "Use for scheduling or legal deadlines."], example: "From January 1 to December 31 in the same year, there are 364 days between the dates.", howWorks: "The tool calculates the absolute difference in days between two calendar dates.", equation: "Days = |End date - Start date|." },
  { slug: "how-many-days-until-my-birthday", title: "How Many Days Until My Birthday?", description: "Find out exactly how many days remain until your next birthday.", useCase: "Use this for birthday countdowns, party planning, or just satisfying curiosity.", steps: ["Enter your birth month and day.", "The tool finds the next occurrence.", "Read the days remaining.", "Use for countdown planning."], example: "If today is June 13 and your birthday is August 15, there are 63 days until your birthday.", howWorks: "The tool compares today's date with the next occurrence of your birthday in the current or upcoming year.", equation: "Days until birthday = Next birthday date - Today's date." },
  { slug: "how-old-am-i-calculator", title: "How Old Am I? Age Calculator", description: "Calculate your exact age in years, months, and days from your date of birth.", useCase: "Use this for age verification, legal checks, school enrollment, or milestone tracking.", steps: ["Enter your date of birth.", "The tool calculates your age as of today.", "Read years, months, and days.", "Use for forms, applications, or trivia."], example: "Someone born on June 13, 2000 is exactly 26 years old on June 13, 2026.", howWorks: "The calculator subtracts the birth date from today's date and breaks down the difference into full years, remaining months, and remaining days.", equation: "Age = Today - Birth date (in years, months, days)." },

  // ── FINANCE ─────────────────────────────────────────────────────────────────
  { slug: "loan-payment-calculator", title: "Loan Payment Calculator", description: "Estimate a loan payment using loan amount, annual interest rate, and repayment term.", useCase: "Use this before comparing personal loans, car loans, student loans, or financing offers.", steps: ["Enter the loan amount.", "Enter the APR or interest rate.", "Enter the term in years.", "Review monthly payment, total paid, and total interest."], example: "A $25,000 loan at 7% APR for 5 years has an estimated monthly payment of about $495.", howWorks: "The loan tool uses a standard amortization formula.", equation: "Payment = P × r ÷ (1 - (1 + r)^-n)." },
  { slug: "monthly-loan-payment-calculator", title: "Monthly Loan Payment Calculator", description: "Calculate the estimated monthly payment for a fixed-rate loan.", useCase: "Use this when you care most about whether a payment fits your monthly budget.", steps: ["Enter borrowed amount.", "Add interest rate.", "Choose repayment term.", "Compare the monthly payment against your income."], example: "A smaller payment can come from a longer term, but total interest usually increases.", howWorks: "Monthly payment depends on principal, monthly interest rate, and number of payments.", equation: "Monthly rate = APR ÷ 12. Number of payments = Years × 12." },
  { slug: "savings-goal-calculator", title: "Savings Goal Calculator", description: "Project savings growth from a starting balance, monthly deposits, interest rate, and time horizon.", useCase: "Use this for emergency funds, travel, school costs, a car down payment, or any planned purchase.", steps: ["Enter your starting savings.", "Enter monthly deposit.", "Enter expected APY.", "Choose the number of years and review the future value."], example: "Starting with $1,000 and adding $250 monthly can build a meaningful savings balance over several years.", howWorks: "The calculator compounds growth monthly and adds regular deposits to estimate a future balance.", equation: "Future value ≈ Starting balance × (1 + monthly rate)^months + accumulated deposits." },
  { slug: "hourly-to-salary-calculator", title: "Hourly to Salary Calculator", description: "Convert an hourly wage into estimated weekly, monthly, and annual salary.", useCase: "Use this to compare hourly jobs, internship offers, part-time schedules, and full-time salary equivalents.", steps: ["Enter hourly pay.", "Multiply by hours per week.", "Multiply weekly pay by 52 for annual salary.", "Compare estimated income with expenses."], example: "$25 per hour at 40 hours per week is about $52,000 per year before taxes.", howWorks: "Salary conversion multiplies hourly pay by weekly hours and the number of paid weeks per year.", equation: "Annual salary = Hourly wage × Hours per week × 52." },
  { slug: "salary-to-hourly-calculator", title: "Salary to Hourly Calculator", description: "Convert annual salary into an estimated hourly wage.", useCase: "Use this to compare salary jobs with hourly work or understand the hourly value of an offer.", steps: ["Start with annual salary.", "Choose weekly hours.", "Divide salary by annual work hours.", "Use the result to compare offers."], example: "A $60,000 salary at 40 hours per week is about $28.85 per hour before taxes.", howWorks: "The calculator divides yearly pay by estimated yearly work hours.", equation: "Hourly wage = Annual salary ÷ (Hours per week × 52)." },
  { slug: "student-budget-calculator", title: "Student Budget Calculator", description: "Plan a monthly budget as a student: track income, fixed expenses, variable spending, and savings goals.", useCase: "Use this to create a realistic monthly budget while studying.", steps: ["Enter monthly income.", "List fixed costs like rent and subscriptions.", "Add variable spending like food and transport.", "See how much is left for savings."], example: "A student earning $1,200/month who spends $900 on necessities has $300 for savings or extras.", howWorks: "The calculator subtracts total expenses from income to show remaining budget.", equation: "Remaining = Income - Fixed expenses - Variable expenses." },
  { slug: "monthly-budget-planner-free", title: "Free Monthly Budget Planner", description: "Create a complete monthly budget plan with income, expenses by category, and savings targets — free, no sign-up.", useCase: "Use this every month to stay on top of your spending and savings.", steps: ["Enter all income sources.", "List expenses by category.", "Set a savings target.", "Track the difference between income and total spend."], example: "A household earning $4,500/month that spends $3,800 is saving $700, which is about a 15% savings rate.", howWorks: "The planner totals income and subtracts categorized expenses to show surplus or deficit.", equation: "Surplus = Total income - Total expenses." },
  { slug: "car-loan-monthly-payment-calculator", title: "Car Loan Monthly Payment Calculator", description: "Estimate your monthly car loan payment based on price, down payment, interest rate, and term.", useCase: "Use before buying a car to see if the monthly payment fits your budget.", steps: ["Enter the vehicle price.", "Subtract the down payment.", "Enter the APR.", "Choose the loan term in months."], example: "A $25,000 car with $3,000 down at 6% APR over 60 months has an estimated payment of about $386/month.", howWorks: "Car loan payments use the same amortization formula as personal loans.", equation: "Payment = P × r ÷ (1 - (1 + r)^-n), where P = price minus down payment." },
  { slug: "personal-loan-calculator-monthly-payments", title: "Personal Loan Calculator – Monthly Payments", description: "Calculate the monthly payment, total paid, and total interest for a personal loan.", useCase: "Use before accepting a personal loan to understand the true cost.", steps: ["Enter loan amount.", "Enter interest rate.", "Enter term in months or years.", "Review monthly payment and total interest."], example: "A $10,000 personal loan at 12% APR for 3 years costs about $332/month and $1,950 in total interest.", howWorks: "Uses the standard amortization formula.", equation: "Payment = P × r ÷ (1 - (1 + r)^-n)." },
  { slug: "how-long-to-save-1000-dollars", title: "How Long to Save $1,000?", description: "Calculate how many months or weeks it takes to save $1,000 based on your monthly savings amount.", useCase: "Use this to set a realistic savings timeline for a specific goal.", steps: ["Enter how much you can save per month.", "The tool calculates time to reach $1,000.", "Adjust the monthly amount to speed up or slow down."], example: "Saving $125 per month, you reach $1,000 in 8 months.", howWorks: "Simple division: goal divided by monthly savings gives months needed.", equation: "Months = Goal ÷ Monthly savings." },
  { slug: "compound-interest-calculator-free", title: "Compound Interest Calculator – Free", description: "Calculate compound interest growth over time with optional regular deposits.", useCase: "Use this to estimate investment growth, savings balances, or the effect of compounding on debt.", steps: ["Enter the principal amount.", "Enter the annual interest rate.", "Choose compounding frequency.", "Set the time period and review the result."], example: "$5,000 at 7% annually compounded for 10 years grows to about $9,836.", howWorks: "Compound interest adds earned interest to the principal, so future interest is earned on a growing base.", equation: "A = P × (1 + r/n)^(n×t)." },
  { slug: "how-much-tip-on-100-dollars", title: "How Much Is a Tip on $100?", description: "Calculate the exact tip amount and total bill for a $100 check at any tip percentage.", useCase: "Use this for restaurant bills, delivery orders, or any service charge on $100.", steps: ["Start with a $100 bill.", "Choose the tip percentage.", "Read the tip amount and total.", "Split the total if dining with others."], example: "20% tip on $100 = $20 tip, $120 total. Split between 4 people = $30 each.", howWorks: "Tip is calculated as a percentage of the pre-tax bill.", equation: "Tip = $100 × Tip %. Total = $100 + Tip." },
  { slug: "tip-calculator-split-bill-between-friends", title: "Tip Calculator – Split Bill Between Friends", description: "Calculate tip and split the total bill evenly between any number of people.", useCase: "Use this at restaurants, food orders, or group outings to split fairly.", steps: ["Enter the bill total.", "Choose the tip percentage.", "Enter the number of people.", "Read each person's share."], example: "A $90 bill with 20% tip = $108 total, split between 3 people = $36 each.", howWorks: "The tip is added to the bill total, then divided by the number of people.", equation: "Per person = (Bill + Tip) ÷ Number of people." },

  // ── CONVERTERS ──────────────────────────────────────────────────────────────
  { slug: "kg-to-lbs-converter", title: "Kg to Lbs Converter", description: "Convert kilograms to pounds instantly.", useCase: "Use for weight conversions in fitness, travel, cooking, or shipping.", steps: ["Enter weight in kilograms.", "Read the result in pounds."], example: "70 kg = 154.32 lbs.", howWorks: "Multiply kilograms by 2.20462 to get pounds.", equation: "Pounds = Kg × 2.20462." },
  { slug: "lbs-to-kg-converter", title: "Lbs to Kg Converter", description: "Convert pounds to kilograms instantly.", useCase: "Use for weight conversions in fitness, science, or international labeling.", steps: ["Enter weight in pounds.", "Read the result in kilograms."], example: "150 lbs = 68.04 kg.", howWorks: "Divide pounds by 2.20462 to get kilograms.", equation: "Kg = Lbs ÷ 2.20462." },
  { slug: "celsius-to-fahrenheit-converter", title: "Celsius to Fahrenheit Converter", description: "Convert temperature from Celsius to Fahrenheit.", useCase: "Use for weather, cooking, science, or travel between metric and imperial systems.", steps: ["Enter temperature in Celsius.", "Read the Fahrenheit result."], example: "100°C = 212°F (boiling point of water).", howWorks: "Multiply by 9/5 and add 32.", equation: "°F = (°C × 9/5) + 32." },
  { slug: "fahrenheit-to-celsius-converter", title: "Fahrenheit to Celsius Converter", description: "Convert temperature from Fahrenheit to Celsius.", useCase: "Use when you see a Fahrenheit temperature and need the Celsius equivalent.", steps: ["Enter temperature in Fahrenheit.", "Read the Celsius result."], example: "98.6°F = 37°C (normal body temperature).", howWorks: "Subtract 32, then multiply by 5/9.", equation: "°C = (°F - 32) × 5/9." },
  { slug: "mb-to-gb-converter", title: "MB to GB Converter", description: "Convert megabytes to gigabytes for file sizes, storage, and data plans.", useCase: "Use when comparing file sizes, cloud storage plans, or data allowances.", steps: ["Enter size in megabytes.", "Read the result in gigabytes."], example: "2,048 MB = 2 GB.", howWorks: "Divide megabytes by 1,024 to get gigabytes.", equation: "GB = MB ÷ 1024." },
  { slug: "inches-to-cm-converter", title: "Inches to CM Converter", description: "Convert inches to centimeters for measurements, dimensions, and screen sizes.", useCase: "Use when you have a measurement in inches and need the metric equivalent.", steps: ["Enter the measurement in inches.", "Read the result in centimeters."], example: "12 inches = 30.48 cm.", howWorks: "Multiply inches by 2.54 to get centimeters.", equation: "CM = Inches × 2.54." },
  { slug: "ml-to-oz-converter", title: "mL to Oz Converter", description: "Convert milliliters to fluid ounces for cooking, recipes, and product labels.", useCase: "Use when a recipe or product label shows ml and you need oz or vice versa.", steps: ["Enter volume in milliliters.", "Read the result in fluid ounces."], example: "250 ml = 8.45 fl oz.", howWorks: "Divide milliliters by 29.5735 to get fluid ounces.", equation: "Fl oz = mL ÷ 29.5735." },
  { slug: "timestamp-to-date-converter", title: "Timestamp to Date Converter", description: "Convert a Unix timestamp to a readable date and time.", useCase: "Use for debugging APIs, reading log files, or converting epoch timestamps.", steps: ["Enter the Unix timestamp.", "Read the converted date and time."], example: "1700000000 = November 14, 2023 22:13:20 UTC.", howWorks: "Unix timestamps count seconds since January 1, 1970 UTC.", equation: "Date = Epoch + Seconds elapsed." },
  { slug: "unix-timestamp-converter-online", title: "Unix Timestamp Converter Online", description: "Convert Unix timestamps to human-readable dates and vice versa, online and free.", useCase: "Use for development, API debugging, log analysis, or data processing.", steps: ["Enter a Unix timestamp or a date.", "Read the converted result."], example: "Timestamp 0 = January 1, 1970 00:00:00 UTC (the Unix epoch).", howWorks: "Unix time measures seconds elapsed since the epoch.", equation: "Date = Unix epoch + Seconds." },
  { slug: "convert-date-to-unix-timestamp", title: "Convert Date to Unix Timestamp", description: "Convert any calendar date and time to a Unix timestamp.", useCase: "Use for programming, database entries, or any system that stores dates as Unix time.", steps: ["Enter the date and time.", "Read the Unix timestamp."], example: "January 1, 2030 00:00:00 UTC = timestamp 1893456000.", howWorks: "The tool calculates seconds elapsed from the Unix epoch to the entered date.", equation: "Timestamp = Seconds since January 1, 1970 UTC." },

  // ── TEXT / QR / PASSWORD ────────────────────────────────────────────────────
  { slug: "character-counter", title: "Character Counter", description: "Count characters for titles, bios, meta descriptions, posts, and form limits.", useCase: "Use this when a platform limits the number of characters you can submit.", steps: ["Paste the text.", "Check total characters.", "Shorten or expand the copy.", "Copy the final version."], example: "A search meta description works best when it is concise, clear, and under common display limits.", howWorks: "The counter measures every character in the text, including letters, numbers, punctuation, spaces, and line breaks.", equation: "Character count = Total number of text characters." },
  { slug: "word-count-checker-free", title: "Free Word Count Checker", description: "Check word count, character count, sentence count, and estimated reading time for any text.", useCase: "Use for essays, blog posts, social media captions, and submission requirements.", steps: ["Paste or type your text.", "Read the word and character count.", "Check reading time.", "Adjust text to meet limits."], example: "A 500-word essay takes about 2.5 minutes to read at average reading speed.", howWorks: "Words are counted by splitting text on whitespace. Characters include all symbols.", equation: "Reading time ≈ Word count ÷ 200 words per minute." },
  { slug: "character-counter-for-twitter-and-instagram", title: "Character Counter for Twitter and Instagram", description: "Count characters to stay within Twitter and Instagram post limits.", useCase: "Use before posting to make sure your caption fits the platform character limit.", steps: ["Paste your draft post.", "Check the character count.", "Edit until it fits.", "Copy and paste into the platform."], example: "Twitter/X allows 280 characters per post. Instagram captions allow up to 2,200 characters.", howWorks: "The counter measures every character, including spaces, emoji, and punctuation.", equation: "Characters remaining = Limit - Current character count." },
  { slug: "qr-code-generator-for-website-link", title: "QR Code Generator for Website Link", description: "Generate a scannable QR code that links directly to any URL or website.", useCase: "Use on flyers, packaging, business cards, or event materials to link to a web page.", steps: ["Enter the full URL.", "Generate the QR code.", "Download and use in print or digital materials."], example: "A QR code for https://omnitoolstudio.com lets visitors scan instead of typing the URL.", howWorks: "QR codes encode the URL as a machine-readable pattern of black and white squares.", equation: "QR = Encoded URL with error correction." },
  { slug: "qr-code-generator-for-business-card", title: "QR Code Generator for Business Card", description: "Create a QR code for your business card that links to your website, email, or contact page.", useCase: "Use to make your business card interactive and save space.", steps: ["Enter your URL, email, or contact info.", "Generate the QR code.", "Download and add to your card design."], example: "Scanning the QR code on a business card can open a LinkedIn profile, a website, or auto-fill a contact.", howWorks: "The QR code stores any text or URL in a scannable format.", equation: "QR = Encoded contact data." },
  { slug: "strong-random-password-generator", title: "Strong Random Password Generator", description: "Generate a strong, random password with letters, numbers, and symbols.", useCase: "Use when creating a new account or updating a weak password.", steps: ["Choose password length.", "Select character types.", "Generate the password.", "Copy to your password manager."], example: "A 16-character password like X7#mK2@pL9vQ!nR3 is extremely difficult to crack.", howWorks: "The generator randomly selects from each chosen character set.", equation: "Password strength = Character set size ^ Password length." },
  { slug: "text-case-converter-online", title: "Text Case Converter Online", description: "Convert text to uppercase, lowercase, title case, sentence case, or camelCase instantly.", useCase: "Use for formatting headings, code variables, social posts, or document corrections.", steps: ["Paste your text.", "Choose the desired case format.", "Copy the converted text."], example: "'hello world' becomes 'Hello World' in title case.", howWorks: "The tool applies a transformation function to each character based on the selected case type.", equation: "Output = Transform(Input, Case type)." },
  { slug: "url-slug-generator-from-title", title: "URL Slug Generator from Title", description: "Convert a page title or heading into a clean, SEO-friendly URL slug.", useCase: "Use when publishing blog posts, product pages, or any web content that needs a URL.", steps: ["Enter the title.", "Read the generated slug.", "Copy and use in your CMS or code."], example: "'How to Calculate a Discount' becomes 'how-to-calculate-a-discount'.", howWorks: "The tool lowercases all letters, replaces spaces and special characters with hyphens, and removes non-URL characters.", equation: "Slug = Lowercase(Title).replace(spaces and special chars, '-')." },

  // ── AI SUMMARIZER ───────────────────────────────────────────────────────────
  { slug: "summarize-article-online", title: "Summarize Article Online – Free AI Tool", description: "Paste any article and get an instant AI-generated summary.", useCase: "Use to quickly understand long articles, news, research papers, or blog posts.", steps: ["Paste the article text.", "Click summarize.", "Read the condensed summary.", "Use the key points for notes or research."], example: "A 2,000-word article can be summarized into 3-5 sentences covering the main points.", howWorks: "The AI reads the full text and identifies the most important information to condense.", equation: "Summary = Key points extracted from full text." },
  { slug: "summarize-essay-free", title: "Summarize Essay Free – AI Text Summarizer", description: "Summarize any essay or long-form text for free using AI.", useCase: "Use for academic reading, research, or quickly reviewing written work.", steps: ["Paste the essay.", "Run the summarizer.", "Read the condensed version.", "Use for study notes or review."], example: "A 5-paragraph essay can be summarized in 2-3 sentences.", howWorks: "The AI identifies thesis statements, key arguments, and conclusions.", equation: "Summary = Thesis + Key arguments + Conclusion." },
  { slug: "free-ai-summarizer-no-login", title: "Free AI Summarizer – No Login Required", description: "Summarize any text instantly with AI, completely free, no account needed.", useCase: "Use when you need a quick summary without signing up for any service.", steps: ["Paste text.", "Click summarize.", "Read the summary instantly.", "No sign-up or account required."], example: "Any text — articles, emails, reports, essays — can be summarized in seconds.", howWorks: "The AI processes the text and returns the most essential information.", equation: "Summary = Essential information extracted by AI." },
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
<p style="margin-top:2rem"><a href="https://omnitoolstudio.com/">&#8592; Back to all free tools</a></p>
</body>
</html>`;
}

// ─── Page generators ──────────────────────────────────────────────────────────

function homePage(): string {
  const toolLinks = Object.entries(tools)
    .map(([slug, t]) => `<li><a href="https://omnitoolstudio.com/${slug}">${esc(t.name)}</a> &#8211; ${esc(t.description)}</li>`)
    .join("\n");
  return buildHtml({
    title: "OmniTool Studio &#8211; Free Online Calculators, Converters &amp; Utilities",
    description: "Free online calculators, unit converters, QR code generator, password generator, word counter, text tools, timers and more. No sign-up required. Fast and mobile-friendly.",
    canonical: "https://omnitoolstudio.com/",
    h1: "Free Online Calculators, Converters & Utilities",
    bodyHtml: `
<p>OmniTool Studio offers 22+ free online tools &#8212; no sign-up required, no ads interrupting your workflow, and everything works on mobile.</p>
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
    title: `${tool.name} &#8211; Free Online Tool | OmniTool Studio`,
    description: tool.description + " Free, no sign-up required. Works on any device.",
    canonical: `https://omnitoolstudio.com/${slug}`,
    h1: tool.name,
    bodyHtml: `
<p>${esc(tool.description)}</p>
<p>Search for: <strong>${esc(tool.keyword)}</strong></p>
<p>This free online tool works on any device without sign-up or download. Part of <a href="https://omnitoolstudio.com/">OmniTool Studio</a>&#8217;s free tool suite.</p>
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
    .map(([slug, t]) => `<li><a href="https://omnitoolstudio.com/${slug}">${esc(t.name)}</a> &#8211; ${esc(t.description)}</li>`)
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
    .map((b) => `<li><a href="https://omnitoolstudio.com/blog/${b.slug}">${esc(b.title)}</a> &#8211; ${esc(b.description)}</li>`)
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
