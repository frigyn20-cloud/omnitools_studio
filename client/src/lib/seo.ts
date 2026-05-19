/**
 * seo.ts — Dynamic per-page SEO helper
 * Call setSEO() in each route/page component on mount.
 * Updates <title>, <meta description>, <link canonical>, and injects
 * a SoftwareApplication JSON-LD structured data block for tool pages.
 */

export interface SEOConfig {
  title: string;
  description: string;
  canonical: string;
  /** Optional: inject SoftwareApplication schema for tool pages */
  toolSchema?: {
    name: string;
    description: string;
    url: string;
  };
}

export function setSEO(config: SEOConfig): void {
  // Title
  document.title = `${config.title} | OmniTool Studio`;

  // Meta description
  setMeta("name", "description", config.description);

  // Canonical
  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = config.canonical;

  // OG tags
  setMeta("property", "og:title", config.title + " | OmniTool Studio");
  setMeta("property", "og:description", config.description);
  setMeta("property", "og:url", config.canonical);

  // Twitter tags
  setMeta("name", "twitter:title", config.title + " | OmniTool Studio");
  setMeta("name", "twitter:description", config.description);

  // Tool structured data
  removeById("tool-schema");
  if (config.toolSchema) {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "tool-schema";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": config.toolSchema.name,
      "description": config.toolSchema.description,
      "url": config.toolSchema.url,
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    });
    document.head.appendChild(script);
  }
}

function setMeta(attr: string, key: string, content: string): void {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function removeById(id: string): void {
  const el = document.getElementById(id);
  if (el) el.remove();
}

/** Pre-built SEO configs for every tool/SEO-landing page */
export const PAGE_SEO: Record<string, SEOConfig> = {
  "/": {
    title: "Free Online Calculators, Converters & Utilities",
    description: "Free online calculators, unit converters, QR code generator, password generator, word counter, text tools and timers. No sign-up required.",
    canonical: "https://omnitoolstudio.com/",
  },
  "/tools": {
    title: "All Free Online Tools",
    description: "Browse all free online tools: calculators, converters, text tools, QR codes, password generators, timers and more.",
    canonical: "https://omnitoolstudio.com/tools",
  },
  "/discount-calculator": {
    title: "Discount Calculator – Calculate Sale Price & Savings",
    description: "Instantly calculate any discount percentage. Enter original price and % off to see your sale price and total savings. Free, fast, no sign-up.",
    canonical: "https://omnitoolstudio.com/discount-calculator",
    toolSchema: { name: "Discount Calculator", description: "Calculate sale price and savings for any discount percentage.", url: "https://omnitoolstudio.com/discount-calculator" },
  },
  "/tip-calculator": {
    title: "Tip Calculator – Split Bill & Calculate Tip Amount",
    description: "Calculate tip amount and split the bill between friends. Supports custom tip percentages. Free online tip calculator.",
    canonical: "https://omnitoolstudio.com/tip-calculator",
    toolSchema: { name: "Tip Calculator", description: "Calculate tip and split bill between people.", url: "https://omnitoolstudio.com/tip-calculator" },
  },
  "/budget-calculator": {
    title: "Budget Calculator – Free Monthly Budget Planner",
    description: "Plan your monthly budget by entering income and expenses. See your savings rate and spending breakdown instantly.",
    canonical: "https://omnitoolstudio.com/budget-calculator",
    toolSchema: { name: "Budget Calculator", description: "Free monthly budget planner and expense tracker.", url: "https://omnitoolstudio.com/budget-calculator" },
  },
  "/loan-calculator": {
    title: "Loan Calculator – Monthly Payment & Interest",
    description: "Calculate monthly loan payments, total interest paid, and amortization for any loan amount, rate, and term. Free online loan calculator.",
    canonical: "https://omnitoolstudio.com/loan-calculator",
    toolSchema: { name: "Loan Calculator", description: "Calculate monthly loan payment and total interest.", url: "https://omnitoolstudio.com/loan-calculator" },
  },
  "/savings-calculator": {
    title: "Savings Calculator – Compound Interest & Savings Goal",
    description: "Calculate how your savings grow with compound interest. Set a savings goal and see how long it takes to reach it.",
    canonical: "https://omnitoolstudio.com/savings-calculator",
    toolSchema: { name: "Savings Calculator", description: "Compound interest and savings goal calculator.", url: "https://omnitoolstudio.com/savings-calculator" },
  },
  "/calorie-calculator": {
    title: "Calorie Calculator – Daily Calorie Needs (TDEE)",
    description: "Calculate your daily calorie needs based on age, weight, height, and activity level. Free TDEE and BMR calculator.",
    canonical: "https://omnitoolstudio.com/calorie-calculator",
    toolSchema: { name: "Calorie Calculator", description: "Calculate daily calorie needs and TDEE.", url: "https://omnitoolstudio.com/calorie-calculator" },
  },
  "/date-calculator": {
    title: "Date Calculator – Days Between Dates & Add Days",
    description: "Calculate days between two dates, add or subtract days from a date, and find the day of the week. Free online date calculator.",
    canonical: "https://omnitoolstudio.com/date-calculator",
    toolSchema: { name: "Date Calculator", description: "Calculate days between dates and add/subtract days.", url: "https://omnitoolstudio.com/date-calculator" },
  },
  "/unit-converter": {
    title: "Unit Converter – Length, Weight, Temperature & More",
    description: "Convert between length, weight, temperature, volume, area, speed and more units instantly. Free online unit converter.",
    canonical: "https://omnitoolstudio.com/unit-converter",
    toolSchema: { name: "Unit Converter", description: "Convert length, weight, temperature, and many more units.", url: "https://omnitoolstudio.com/unit-converter" },
  },
  "/currency-converter": {
    title: "Currency Converter – Free Exchange Rate Calculator",
    description: "Convert between currencies with up-to-date exchange rates. Free online currency converter, no sign-up needed.",
    canonical: "https://omnitoolstudio.com/currency-converter",
    toolSchema: { name: "Currency Converter", description: "Convert currencies using live exchange rates.", url: "https://omnitoolstudio.com/currency-converter" },
  },
  "/qr-code-generator": {
    title: "QR Code Generator – Free, Instant, No Sign-Up",
    description: "Generate a QR code for any URL, text, or contact. Download as PNG instantly. Free online QR code generator, no account needed.",
    canonical: "https://omnitoolstudio.com/qr-code-generator",
    toolSchema: { name: "QR Code Generator", description: "Generate free QR codes for URLs, text, and more.", url: "https://omnitoolstudio.com/qr-code-generator" },
  },
  "/word-counter": {
    title: "Word Counter – Count Words, Characters & Sentences",
    description: "Count words, characters, sentences, and paragraphs in your text instantly. Free online word counter and character counter.",
    canonical: "https://omnitoolstudio.com/word-counter",
    toolSchema: { name: "Word Counter", description: "Count words, characters, sentences and reading time.", url: "https://omnitoolstudio.com/word-counter" },
  },
  "/password-generator": {
    title: "Password Generator – Strong Random Passwords Free",
    description: "Generate strong, random, secure passwords instantly. Customize length, symbols, numbers, and uppercase. Free online password generator.",
    canonical: "https://omnitoolstudio.com/password-generator",
    toolSchema: { name: "Password Generator", description: "Generate strong random passwords with custom settings.", url: "https://omnitoolstudio.com/password-generator" },
  },
  "/age-calculator": {
    title: "Age Calculator – How Old Am I? Exact Age in Years",
    description: "Calculate your exact age in years, months, and days from your date of birth. Free online age calculator.",
    canonical: "https://omnitoolstudio.com/age-calculator",
    toolSchema: { name: "Age Calculator", description: "Calculate exact age in years, months, and days.", url: "https://omnitoolstudio.com/age-calculator" },
  },
  "/ai-text-summarizer": {
    title: "AI Text Summarizer – Summarize Any Article Free",
    description: "Summarize any article, essay, or text in seconds using AI. Free online text summarizer, no login required.",
    canonical: "https://omnitoolstudio.com/ai-text-summarizer",
    toolSchema: { name: "AI Text Summarizer", description: "Free AI-powered text summarizer. No login required.", url: "https://omnitoolstudio.com/ai-text-summarizer" },
  },
  "/percent-off-calculator": {
    title: "Percent Off Calculator – How Much Do You Save?",
    description: "Calculate the final price after a percent-off discount. Enter any original price and discount to see your savings instantly.",
    canonical: "https://omnitoolstudio.com/percent-off-calculator",
    toolSchema: { name: "Percent Off Calculator", description: "Calculate final price and savings from a percent-off discount.", url: "https://omnitoolstudio.com/percent-off-calculator" },
  },
  "/how-old-am-i-calculator": {
    title: "How Old Am I? – Age Calculator",
    description: "Find out exactly how old you are in years, months, and days. Enter your birthday and get your precise age instantly.",
    canonical: "https://omnitoolstudio.com/how-old-am-i-calculator",
    toolSchema: { name: "How Old Am I Calculator", description: "Calculate your exact age from your date of birth.", url: "https://omnitoolstudio.com/how-old-am-i-calculator" },
  },
  "/how-many-days-between-two-dates": {
    title: "How Many Days Between Two Dates – Date Calculator",
    description: "Find the exact number of days between any two dates. Free calculator — count calendar days or business days.",
    canonical: "https://omnitoolstudio.com/how-many-days-between-two-dates",
    toolSchema: { name: "Days Between Dates Calculator", description: "Count the exact days between two dates.", url: "https://omnitoolstudio.com/how-many-days-between-two-dates" },
  },
  "/how-many-days-until-my-birthday": {
    title: "How Many Days Until My Birthday?",
    description: "Find out exactly how many days, weeks, and months until your next birthday. Free birthday countdown calculator.",
    canonical: "https://omnitoolstudio.com/how-many-days-until-my-birthday",
    toolSchema: { name: "Birthday Countdown", description: "Calculate days until your next birthday.", url: "https://omnitoolstudio.com/how-many-days-until-my-birthday" },
  },
  "/how-much-is-20-percent-off": {
    title: "How Much is 20% Off? – Discount Calculator",
    description: "Calculate exactly how much 20% off is on any price. Enter any amount to see the discounted price and savings.",
    canonical: "https://omnitoolstudio.com/how-much-is-20-percent-off",
    toolSchema: { name: "20% Off Calculator", description: "Calculate how much 20% off saves on any price.", url: "https://omnitoolstudio.com/how-much-is-20-percent-off" },
  },
  "/student-budget-calculator": {
    title: "Student Budget Calculator – Free Monthly Budget Planner",
    description: "Free budget calculator designed for students. Track income, rent, food, tuition, and other expenses to plan your monthly budget.",
    canonical: "https://omnitoolstudio.com/student-budget-calculator",
    toolSchema: { name: "Student Budget Calculator", description: "Monthly budget planner for college students.", url: "https://omnitoolstudio.com/student-budget-calculator" },
  },
  "/car-loan-monthly-payment-calculator": {
    title: "Car Loan Monthly Payment Calculator",
    description: "Calculate your monthly car loan payment based on price, interest rate, and loan term. Free auto loan calculator.",
    canonical: "https://omnitoolstudio.com/car-loan-monthly-payment-calculator",
    toolSchema: { name: "Car Loan Calculator", description: "Calculate monthly car loan payment.", url: "https://omnitoolstudio.com/car-loan-monthly-payment-calculator" },
  },
  "/strong-random-password-generator": {
    title: "Strong Random Password Generator – Free & Secure",
    description: "Generate a strong, random password instantly. Choose length and include symbols, numbers, and mixed case. No account needed.",
    canonical: "https://omnitoolstudio.com/strong-random-password-generator",
    toolSchema: { name: "Strong Password Generator", description: "Generate secure random passwords instantly.", url: "https://omnitoolstudio.com/strong-random-password-generator" },
  },
  "/kg-to-lbs-converter": {
    title: "kg to lbs Converter – Kilograms to Pounds",
    description: "Convert kilograms to pounds instantly. Free online kg to lbs converter with formula and conversion table.",
    canonical: "https://omnitoolstudio.com/kg-to-lbs-converter",
    toolSchema: { name: "kg to lbs Converter", description: "Convert kilograms to pounds.", url: "https://omnitoolstudio.com/kg-to-lbs-converter" },
  },
  "/celsius-to-fahrenheit-converter": {
    title: "Celsius to Fahrenheit Converter – °C to °F",
    description: "Convert Celsius to Fahrenheit instantly. Free online temperature converter with formula. Enter any °C value to get °F.",
    canonical: "https://omnitoolstudio.com/celsius-to-fahrenheit-converter",
    toolSchema: { name: "Celsius to Fahrenheit Converter", description: "Convert Celsius to Fahrenheit.", url: "https://omnitoolstudio.com/celsius-to-fahrenheit-converter" },
  },
  "/fahrenheit-to-celsius-converter": {
    title: "Fahrenheit to Celsius Converter – °F to °C",
    description: "Convert Fahrenheit to Celsius instantly. Free online temperature converter. Enter any °F value to get °C.",
    canonical: "https://omnitoolstudio.com/fahrenheit-to-celsius-converter",
    toolSchema: { name: "Fahrenheit to Celsius Converter", description: "Convert Fahrenheit to Celsius.", url: "https://omnitoolstudio.com/fahrenheit-to-celsius-converter" },
  },
  "/qr-code-generator-for-website-link": {
    title: "QR Code Generator for Website Link – Free",
    description: "Generate a QR code for any website URL instantly. Free, no login, downloadable as PNG.",
    canonical: "https://omnitoolstudio.com/qr-code-generator-for-website-link",
    toolSchema: { name: "QR Code Generator for URLs", description: "Generate a QR code for any website link.", url: "https://omnitoolstudio.com/qr-code-generator-for-website-link" },
  },
  "/character-counter-for-twitter-and-instagram": {
    title: "Character Counter for Twitter & Instagram",
    description: "Count characters for Twitter (280 limit) and Instagram (2200 limit). Free online character counter.",
    canonical: "https://omnitoolstudio.com/character-counter-for-twitter-and-instagram",
    toolSchema: { name: "Social Media Character Counter", description: "Character counter for Twitter and Instagram.", url: "https://omnitoolstudio.com/character-counter-for-twitter-and-instagram" },
  },
};
