import { Link } from "wouter";

// Rich content blocks for specific SEO landing pages.
// Usage in App.tsx SeoLandingPage render, after the tool embed:
//   import { SeoLandingRichContent } from "./SeoLandingExtras";
//   <SeoLandingRichContent slug={landing.slug} />

type FaqItem = { q: string; a: string };
type ContentSection = { heading: string; body: string };

type RichContent = {
  intro: string;
  sections: ContentSection[];
  faq: FaqItem[];
  relatedLinks: { label: string; href: string }[];
  howToSchema?: { name: string; steps: string[] };
  faqSchema: boolean;
};

const richContentMap: Record<string, RichContent> = {
  "monthly-budget-planner-free": {
    intro:
      "Most people don't overspend because they're careless — they overspend because they don't have a clear picture of what's coming in and going out. This planner gives you that picture in under two minutes.",
    sections: [
      {
        heading: "How to Use the Budget Planner",
        body: [
          "1. Enter your total monthly take-home income — the amount that actually hits your bank account after taxes.",
          "2. Add your fixed costs: rent or mortgage, insurance premiums, loan payments, and any subscriptions you pay every month.",
          "3. Add your variable costs: groceries, gas, dining out, entertainment, and anything that changes month to month.",
          "4. Set a savings goal — even a small one. Treating savings as a non-negotiable line item is the single most effective budgeting habit.",
          "5. Review the remaining balance. If it's negative, look at variable spending first. If it's positive, decide whether to increase your savings goal or leave a buffer.",
        ].join("\n"),
      },
      {
        heading: "The 50/30/20 Rule — A Starting Point",
        body:
          "The 50/30/20 rule splits take-home income into three buckets: 50% for needs, 30% for wants, and 20% for savings and debt repayment. On a $4,500/month take-home salary, that's $2,250 for housing, utilities, food, and transportation; $1,350 for dining out, subscriptions, and hobbies; and $900 toward savings or extra loan payments. It's not a perfect fit for everyone — high-rent cities often push the 'needs' bucket well above 50% — but it's a useful benchmark to start from and adjust.",
      },
      {
        heading: "Common Budget Categories: Fixed, Variable, and Irregular",
        body: [
          "Fixed expenses are the same every month: rent, car payment, insurance, phone plan.",
          "Variable expenses shift: groceries, gas, entertainment, clothing.",
          "The category most planners skip is irregular expenses — annual fees, car registration, holiday gifts, medical co-pays, home repairs. These aren't surprises if you plan for them. Divide your annual irregular total by 12 and add that amount as a monthly line item called a 'sinking fund.' When the bill arrives, the money is already set aside.",
        ].join("\n"),
      },
      {
        heading: "What a Realistic Budget Looks Like at $3,800/Month",
        body: [
          "Here's a sample budget for $3,800 monthly take-home pay:",
          "• Rent: $1,200",
          "• Utilities & internet: $120",
          "• Groceries: $380",
          "• Transportation (gas + insurance): $280",
          "• Dining out: $180",
          "• Subscriptions: $60",
          "• Personal & miscellaneous: $160",
          "• Sinking fund (irregular expenses): $120",
          "• Savings goal: $500",
          "• Remaining buffer: $800",
          "",
          "The buffer isn't wasted — it covers months where variable spending runs high, or gets rolled into savings if the month goes smoothly.",
        ].join("\n"),
      },
    ],
    faq: [
      {
        q: "How often should I update my budget?",
        a: "Review it at the start of each month before you spend anything. Do a full reset any time your income, rent, or regular expenses change significantly.",
      },
      {
        q: "How do I budget with variable income?",
        a: "Use your lowest typical monthly income as your baseline. When you earn more, allocate the extra to savings or irregular expenses first — don't expand your lifestyle spending until the surplus is consistent.",
      },
      {
        q: "How much of my income should I save?",
        a: "The standard starting target is 20% of take-home pay. If that's not achievable right now, start with whatever you can — even 5% — and increase it by 1–2% every few months as you reduce variable expenses.",
      },
      {
        q: "Should I include debt payments in my budget?",
        a: "Yes. Minimum debt payments belong in fixed expenses. Any extra payments above the minimum can go in your savings goal category — paying down high-interest debt is one of the highest-return financial moves available.",
      },
    ],
    relatedLinks: [
      { label: "After-Tax Salary Calculator", href: "/after-tax-salary-calculator" },
      { label: "Savings Calculator", href: "/savings-calculator" },
      { label: "Loan Calculator", href: "/loan-calculator" },
      { label: "Compound Interest Calculator", href: "/compound-interest-calculator-free" },
    ],
    howToSchema: {
      name: "How to Use the Free Monthly Budget Planner",
      steps: [
        "Enter your total monthly take-home income.",
        "Add your fixed costs such as rent, insurance, and loan payments.",
        "Add your variable costs such as groceries, gas, and dining out.",
        "Set a monthly savings goal.",
        "Review the remaining balance and adjust spending categories as needed.",
      ],
    },
    faqSchema: true,
  },

  "ai-text-summarizer": {
    intro:
      "Reading everything isn't always an option. Paste any article, research paper, essay, or long document below and get a clean summary — the key points, nothing else.",
    sections: [
      {
        heading: "How to Summarize Text",
        body: [
          "1. Paste your text into the input box above. The tool works best with at least 100 words — short snippets don't give the model enough context to summarize.",
          "2. Choose a summary length: short (2–3 sentences), medium (a short paragraph), or long (a longer overview that preserves more detail).",
          "3. Click Summarize. The AI reads the full input and generates a condensed version in a few seconds.",
          "4. Copy the result and use it directly in your notes, email, or document.",
        ].join("\n"),
      },
      {
        heading: "What It's Good For",
        body: [
          "Research and studying: Condense a 10-page paper into a paragraph before deciding whether to read the full version.",
          "News and current events: Get the core facts from a long article without reading through filler.",
          "Work documents: Turn a lengthy report, meeting transcript, or email thread into a short briefing.",
          "Writing and editing: Paste a draft and get a summary of what you actually wrote — useful for checking whether your main point comes through clearly.",
        ].join("\n"),
      },
      {
        heading: "How the Summarizer Works",
        body:
          "The tool sends your text to a BART-large-CNN transformer model hosted on Hugging Face. BART (Bidirectional and Auto-Regressive Transformers) was fine-tuned on news articles and documents to generate abstractive summaries — meaning it generates new sentences rather than just pulling lines from the original. The model reads the entire input, identifies the most important information, and writes a shorter version that preserves the core meaning. Your text is sent to the API for processing only and is not stored or logged.",
      },
      {
        heading: "What Makes a Good Summary",
        body:
          "A useful summary covers the main claim or finding, the key supporting points, and any important conclusion — without padding, repetition, or tangential details. The 'short' setting is best for a one-line takeaway. 'Medium' works well for most use cases and gives you a paragraph that can stand on its own. 'Long' is better when you need to preserve nuance, like summarizing a legal document or academic paper where details matter. If the output misses something important, try pasting a shorter, more focused section of the original text.",
      },
    ],
    faq: [
      {
        q: "Is there a word or character limit?",
        a: "The tool works best with text between 100 and 1,500 words. Very long inputs may be truncated by the model before processing. For long documents, paste the most important section first.",
      },
      {
        q: "Does it work with non-English text?",
        a: "The model is trained primarily on English text and performs best with English input. Results with other languages will vary and may not be accurate.",
      },
      {
        q: "Can I summarize a PDF?",
        a: "Not directly. Open the PDF, select and copy the text you want to summarize, then paste it into the tool. Most PDF readers support Ctrl+A to select all text.",
      },
      {
        q: "Is my text stored or shared?",
        a: "No. Your text is sent to the Hugging Face inference API for processing only. It is not logged, stored, or used for any other purpose. Nothing is saved on our servers.",
      },
      {
        q: "How is this different from ChatGPT?",
        a: "ChatGPT is a general-purpose chat assistant. This tool is purpose-built for summarization — it's faster for that specific task, requires no account, and doesn't ask you to start a conversation. It uses a model specifically fine-tuned for document summarization rather than general dialogue.",
      },
    ],
    relatedLinks: [
      { label: "Word Counter", href: "/word-counter" },
      { label: "Text Tools", href: "/text-tools" },
      { label: "Online Notepad", href: "/online-notepad" },
    ],
    faqSchema: true,
  },
};

function FaqSchemaScript({ faq }: { faq: FaqItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function HowToSchemaScript({ howTo }: { howTo: { name: string; steps: string[] } }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: howTo.name,
    step: howTo.steps.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function SeoLandingRichContent({ slug }: { slug: string }) {
  const content = richContentMap[slug];
  if (!content) return null;

  return (
    <>
      {/* Structured data */}
      {content.faqSchema && <FaqSchemaScript faq={content.faq} />}
      {content.howToSchema && <HowToSchemaScript howTo={content.howToSchema} />}

      {/* Intro */}
      <div className="mt-8 rounded-[2rem] border hairline glass-panel p-6 sm:p-8">
        <p className="text-base leading-7 text-muted-foreground">{content.intro}</p>
      </div>

      {/* Content sections */}
      <div className="mt-6 space-y-6">
        {content.sections.map((section) => (
          <div key={section.heading} className="rounded-[2rem] border hairline glass-panel p-6 sm:p-8">
            <h2 className="mb-4 text-xl font-black tracking-[-0.02em]">{section.heading}</h2>
            <div className="space-y-2">
              {section.body.split("\n").map((line, i) =>
                line.trim() === "" ? null : (
                  <p key={i} className="text-sm leading-7 text-muted-foreground">
                    {line}
                  </p>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="mt-6 rounded-[2rem] border hairline glass-panel p-6 sm:p-8">
        <h2 className="mb-5 text-xl font-black tracking-[-0.02em]">FAQ</h2>
        <div className="space-y-5">
          {content.faq.map(({ q, a }) => (
            <div key={q}>
              <h3 className="mb-1 text-sm font-black">{q}</h3>
              <p className="text-sm leading-7 text-muted-foreground">{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Related tools */}
      <div className="mt-6 rounded-[2rem] border hairline glass-panel p-6 sm:p-8">
        <h2 className="mb-4 text-xl font-black tracking-[-0.02em]">Related Tools</h2>
        <div className="flex flex-wrap gap-3">
          {content.relatedLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl border border-border/70 bg-card px-4 py-2 text-sm font-bold transition hover:bg-secondary hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
