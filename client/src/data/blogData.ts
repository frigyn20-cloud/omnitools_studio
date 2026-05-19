export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  sections: { heading: string; body: string }[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-calculate-tip",
    title: "How to Calculate a Tip Without a Calculator",
    description: "A simple mental-math method for tipping at restaurants, plus when to use a tip calculator for group splits.",
    readTime: "3 min read",
    sections: [
      { heading: "The 10% Method", body: "Move the decimal point one place left to get 10% of your bill. Double it for 20%, or add half for 15%. This works for most everyday tipping situations and requires no calculator." },
      { heading: "When the Bill Is Uneven", body: "Round to the nearest dollar before applying the tip percentage. It makes mental math easier and the small difference rarely matters in practice." },
      { heading: "Splitting a Group Bill", body: "For groups of three or more, total the bill plus tip first, then divide evenly. Splitting before adding tip often leads to rounding errors that leave someone short." },
      { heading: "Using a Tip Calculator", body: "A tip calculator handles the math instantly and lets you experiment with percentages. Enter the total, choose your tip rate, and it shows each person's share to the cent." },
    ],
  },
  {
    slug: "how-compound-interest-works",
    title: "How Compound Interest Works and Why It Matters",
    description: "Compound interest can work for you in savings accounts or against you in loans. Here is how it works in plain terms.",
    readTime: "4 min read",
    sections: [
      { heading: "Simple vs Compound Interest", body: "Simple interest is calculated only on the original principal. Compound interest is calculated on the principal plus all previously earned interest, so it grows faster over time." },
      { heading: "Compounding Frequency", body: "Interest can compound daily, monthly, quarterly, or annually. More frequent compounding means slightly more growth. Most savings accounts compound daily or monthly." },
      { heading: "The Rule of 72", body: "Divide 72 by your annual interest rate to estimate how many years it takes to double your money. At 6% annual return, your money doubles in about 12 years." },
      { heading: "Debt and Compound Interest", body: "Credit cards typically compound daily on unpaid balances. This is why carrying a balance is expensive. Paying the full balance each month avoids compound interest charges entirely." },
    ],
  },
  {
    slug: "understanding-loan-amortization",
    title: "Understanding Loan Amortization",
    description: "Why do early loan payments go mostly to interest? Amortization explains how your payment is split between principal and interest each month.",
    readTime: "4 min read",
    sections: [
      { heading: "What Is Amortization", body: "Amortization is the process of spreading a loan into fixed payments over time. Each payment covers both interest and a portion of the principal balance." },
      { heading: "Why Early Payments Are Mostly Interest", body: "Interest is calculated on the remaining balance. Early on, the balance is high, so the interest portion is large. As you pay down principal, more of each payment goes toward the balance." },
      { heading: "How to Pay Off a Loan Faster", body: "Making extra principal payments reduces your balance faster, which reduces future interest charges. Even small extra payments early in a loan can save a significant amount over the full term." },
      { heading: "Using a Loan Calculator", body: "A loan calculator shows the monthly payment, total interest paid, and the full amortization schedule. Use it to compare different loan terms or see the effect of a larger down payment." },
    ],
  },
];
