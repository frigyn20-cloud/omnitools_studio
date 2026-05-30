// SEO patches — applied by App.tsx via the enhanced Seo component
// This file centralises per-page overrides so they are easy to audit.

export type SeoOverride = {
  title: string;
  description: string;
  canonical?: string;
};

// Keyed by slug (matches seoLandings[].slug or tool slug)
export const seoOverrides: Record<string, SeoOverride> = {
  // ─── HIGHEST IMPRESSION PAGES (GSC data May 2026) ────────────────────────

  // 463 impressions, pos 89 → needs click-worthy title
  "monthly-budget-planner-free": {
    title: "Free Monthly Budget Planner — Track Income & Expenses Online",
    description:
      "Plan your monthly budget in seconds. Enter income, fixed costs, and variable expenses to see exactly what you have left to save. Free, no account needed.",
    canonical: "https://omnitoolstudio.com/monthly-budget-planner-free",
  },

  // 169 impressions, pos 61 → salary queries already surfacing
  "after-tax-salary-calculator": {
    title: "After-Tax Salary Calculator — $55k, $60k, $70k Take-Home Pay",
    description:
      "Find out how much you take home from a $55k, $60k, or $70k salary after federal tax, state tax, and FICA. Instant estimate — no login required.",
    canonical: "https://omnitoolstudio.com/after-tax-salary-calculator",
  },

  // 169 impressions, pos 92 → buried, needs stronger description
  "ai-text-summarizer": {
    title: "AI Text Summarizer — Summarize Any Article Free (No Login)",
    description:
      "Paste any article, essay, or long text and get a clean AI summary in seconds. Choose short, medium, or long output. Completely free, no sign-up.",
    canonical: "https://omnitoolstudio.com/ai-text-summarizer",
  },

  // 99 impressions, pos 93
  "compound-interest-calculator-free": {
    title: "Compound Interest Calculator — See How Savings Grow Over Time",
    description:
      "Calculate compound interest with monthly deposits. Enter starting balance, contribution, interest rate, and years to see your future savings balance instantly.",
    canonical: "https://omnitoolstudio.com/compound-interest-calculator-free",
  },

  // 24 impressions, pos 85 → car loan queries
  "car-loan-monthly-payment-calculator": {
    title: "Car Loan Monthly Payment Calculator — Estimate Any Auto Loan",
    description:
      "Calculate your exact monthly car payment. Enter the vehicle price, down payment, interest rate, and loan term. Works for any loan amount — free and instant.",
    canonical: "https://omnitoolstudio.com/car-loan-monthly-payment-calculator",
  },

  // 22 impressions, pos 68 → tip blog near page 1
  "blog/how-much-should-you-tip": {
    title: "How Much Should You Tip at a Restaurant? A Simple Guide",
    description:
      "Standard tip percentages explained: 15%, 18%, or 20%? Learn how to calculate a tip and split the bill fairly between friends.",
    canonical: "https://omnitoolstudio.com/blog/how-much-should-you-tip",
  },

  // 19 impressions, pos 53 → discount/percent
  "discount-calculator": {
    title: "Discount Calculator — Sale Price, Tax & Amount Saved",
    description:
      "Quickly calculate the sale price, amount saved, and total after tax for any discount. Works for 10%, 20%, 25%, 30%, 50% off — and any custom percent.",
    canonical: "https://omnitoolstudio.com/discount-calculator",
  },

  // pos 10 → very close to page 1, small nudge can get it there
  "25-percent-off-calculator": {
    title: "25 Percent Off Calculator — Instant Sale Price & Savings",
    description:
      "Enter any price to instantly see the sale price after 25% off, how much you save, and the total with tax. Free, no sign-up.",
    canonical: "https://omnitoolstudio.com/25-percent-off-calculator",
  },

  // pos 9.7 → just off page 1
  "date-calculator-add-days": {
    title: "Add Days to a Date Calculator — Find Any Future or Past Date",
    description:
      "Enter a start date and number of days to add (or subtract) to find the exact resulting date. Perfect for deadlines, return windows, and project planning.",
    canonical: "https://omnitoolstudio.com/date-calculator-add-days",
  },

  // pos 6.4 → already near top, improve CTR
  "bmr-calculator": {
    title: "BMR Calculator — Daily Calorie Needs Based on Your Body Stats",
    description:
      "Calculate your Basal Metabolic Rate (BMR) and daily calorie target for weight loss, maintenance, or muscle gain. Enter age, height, weight, and activity level.",
    canonical: "https://omnitoolstudio.com/bmr-calculator",
  },

  // pos 8 → close to page 1
  "base64-encoder-decoder": {
    title: "Base64 Encoder & Decoder — Free Online Tool",
    description:
      "Encode any text to Base64 or decode Base64 back to plain text instantly. Also includes JSON formatter, JSON minifier, and CSV-to-JSON converter.",
    canonical: "https://omnitoolstudio.com/base64-encoder-decoder",
  },

  // pos 5.3 → very close to top
  "csv-to-json-converter": {
    title: "CSV to JSON Converter — Free Online Tool (No Login)",
    description:
      "Paste CSV data and convert it to formatted JSON instantly. Also supports JSON formatting, minification, and Base64 encoding/decoding.",
    canonical: "https://omnitoolstudio.com/csv-to-json-converter",
  },

  // ─── CORE TOOLS ────────────────────────────────────────────────────────────
  "loan-calculator": {
    title: "Loan Payment Calculator — Monthly Payment & Total Interest",
    description:
      "Calculate monthly loan payments for personal loans, car loans, and student loans. Enter amount, APR, and term to see payment and total interest instantly.",
    canonical: "https://omnitoolstudio.com/loan-calculator",
  },

  "date-calculator": {
    title: "Date Calculator — Add Days to a Date or Days Between Dates",
    description:
      "Add or subtract days from any date, or count the number of days between two dates. Fast, free, works for deadlines, countdowns, and event planning.",
    canonical: "https://omnitoolstudio.com/date-calculator",
  },

  "savings-calculator": {
    title: "Savings Calculator — Compound Growth With Monthly Deposits",
    description:
      "See how your savings grow over time with starting balance, monthly deposits, and an annual interest rate. Free compound interest projection tool.",
    canonical: "https://omnitoolstudio.com/savings-calculator",
  },

  "budget-calculator": {
    title: "Budget Calculator — Monthly Income, Expenses & Savings Rate",
    description:
      "Enter your monthly income, fixed costs, and variable expenses to calculate how much you can save each month. Free budget planner, no account needed.",
    canonical: "https://omnitoolstudio.com/budget-calculator",
  },
};
