import { useEffect, useState } from "react";
import { Calculator, Copy, Moon, Search, Sun } from "lucide-react";
import { Link, Switch, Route, Router, useParams } from "wouter";
import { useBrowserLocation } from "wouter/use-browser-location";
import { useHashLocation } from "wouter/use-hash-location";
import { Analytics } from "@vercel/analytics/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { type Tool, type Category, tools } from "@/data/tools";
import { type SeoLanding, seoLandings } from "@/data/seoData";
import { type BlogPost, blogPosts } from "@/data/blogData";
import { useLanguage, useTheme, type Language } from "@/App";
import UtilityPanels from "@/ToolPanels";

type ToolFilter = "all" | Category;

/* ── helpers re-used by page components ─────────────────────────────────── */
function getCategoryMeta(category: ToolFilter, language: Language) {
  if (language === "es") {
    const map: Record<ToolFilter, {title:string;description:string}> = {
      all:        {title:"Todas las herramientas",description:"Calculadoras, conversores y utilidades gratuitas en un solo lugar."},
      calculators:{title:"Calculadoras",description:"Calculadoras financieras, de salud y de fecha para uso diario."},
      converters: {title:"Conversores",description:"Convierte unidades, monedas, zonas horarias y formatos de datos."},
      utilities:  {title:"Utilidades",description:"Herramientas de productividad: notas, cronómetro, QR, contraseñas y más."},
    };
    return map[category];
  }
  const map: Record<ToolFilter, {title:string;description:string}> = {
    all:        {title:"All Tools",description:"Free calculators, converters, and utilities in one place."},
    calculators:{title:"Calculators",description:"Financial, health, and date calculators for everyday use."},
    converters: {title:"Converters",description:"Convert units, currencies, time zones, and data formats."},
    utilities:  {title:"Utilities",description:"Productivity tools: notes, stopwatch, QR codes, passwords, and more."},
  };
  return map[category];
}

function getToolCopy(tool: Tool, language: Language) {
  if (language !== "es") return { name: tool.name, description: tool.description };
  const t = (await import("@/data/tools") as any).toolTranslations?.[tool.id];
  return { name: t?.name ?? tool.name, description: t?.description ?? tool.description };
}

function getSeoLandingCopy(landing: SeoLanding, language: Language): SeoLanding {
  if (language !== "es") return landing;
  return landing; // Spanish copy would be added here
}

function getBlogPostCopy(post: BlogPost, language: Language): BlogPost {
  if (language !== "es") return post;
  return post; // Spanish copy would be added here
}

/* ── StaticPageLayout ─────────────────────────────────────────────────────── */
function StaticPageLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="font-bold text-primary text-sm">Omni Tool Studio</Link>
          <span className="text-text-faint">/</span>
          <span className="text-sm text-text-muted">{title}</span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-12">
        {children}
      </main>
    </div>
  );
}

/* ── About ─────────────────────────────────────────────────────────────── */
function AboutPage() {
  return (
    <StaticPageLayout title="About">
      <h1 className="text-3xl font-bold mb-6">About Omni Tool Studio</h1>
      <div className="prose-like space-y-4 text-text-muted leading-relaxed">
        <p>Omni Tool Studio is a free collection of everyday calculators, converters, and utilities that run entirely in your browser. No accounts, no tracking, no ads.</p>
        <p>Every tool is designed to be fast, simple, and accurate. We cover financial math, unit conversions, time utilities, text processing, file tools, and more — all in one place.</p>
        <p>Built with React, TypeScript, and a focus on clean UX. If you have a tool suggestion or find a bug, reach out via the Contact page.</p>
      </div>
    </StaticPageLayout>
  );
}

/* ── Contact ───────────────────────────────────────────────────────────── */
function ContactPage() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const submit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); };
  return (
    <StaticPageLayout title="Contact">
      <h1 className="text-3xl font-bold mb-6">Contact</h1>
      {sent ? (
        <div className="rounded-xl bg-primary/10 border border-primary/20 p-6 text-center">
          <p className="text-lg font-medium text-primary">Thanks! We'll get back to you soon.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <label className="flex flex-col gap-1 text-sm"><span className="text-text-muted">Name</span><input className="input" type="text" required value={name} onChange={e=>setName(e.target.value)}/></label>
          <label className="flex flex-col gap-1 text-sm"><span className="text-text-muted">Email</span><input className="input" type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label>
          <label className="flex flex-col gap-1 text-sm"><span className="text-text-muted">Message</span><textarea className="input h-32 resize-y" required value={message} onChange={e=>setMessage(e.target.value)}/></label>
          <button type="submit" className="btn-primary">Send message</button>
        </form>
      )}
    </StaticPageLayout>
  );
}

/* ── Privacy ───────────────────────────────────────────────────────────── */
function PrivacyPage() {
  return (
    <StaticPageLayout title="Privacy Policy">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="space-y-4 text-text-muted leading-relaxed">
        <p><strong className="text-text">No personal data collected.</strong> All calculations and conversions run entirely in your browser. No input data is sent to any server.</p>
        <p><strong className="text-text">Analytics.</strong> We use Vercel Analytics to collect anonymous page-view data (country, browser, page path). No personal identifiers are stored.</p>
        <p><strong className="text-text">Cookies.</strong> We do not use tracking cookies. Your theme preference is stored in JavaScript memory for the current session only.</p>
        <p><strong className="text-text">Third-party APIs.</strong> The Currency Converter fetches exchange rates from a public API. No personal data is included in that request.</p>
        <p><strong className="text-text">Contact form.</strong> If you contact us, your name, email, and message are used only to respond to your inquiry.</p>
        <p className="text-xs">Last updated: May 2025</p>
      </div>
    </StaticPageLayout>
  );
}

/* ── Terms ─────────────────────────────────────────────────────────────── */
function TermsPage() {
  return (
    <StaticPageLayout title="Terms of Service">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="space-y-4 text-text-muted leading-relaxed">
        <p>Omni Tool Studio provides free browser-based tools for informational and personal productivity purposes. Use of this site is at your own risk.</p>
        <p><strong className="text-text">Accuracy.</strong> Tools are provided as-is. Results should not be used as the sole basis for financial, medical, or legal decisions. Always verify important calculations independently.</p>
        <p><strong className="text-text">No warranty.</strong> We make no guarantees about the accuracy, reliability, or availability of the tools.</p>
        <p><strong className="text-text">Prohibited use.</strong> Do not attempt to scrape, automate, or abuse this service.</p>
        <p className="text-xs">Last updated: May 2025</p>
      </div>
    </StaticPageLayout>
  );
}

/* ── ToolPage (individual tool page) ───────────────────────────────────── */
function ToolPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const { theme } = useTheme();
  const tool = tools.find(t => t.slug === slug);

  if (!tool) return <NotFound />;

  const name  = language === "es" ? ((tools as any).toolTranslations?.[tool.id]?.name  ?? tool.name)  : tool.name;
  const desc  = language === "es" ? ((tools as any).toolTranslations?.[tool.id]?.desc  ?? tool.description) : tool.description;

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="font-bold text-primary text-sm">Omni Tool Studio</Link>
          <span className="text-text-faint">/</span>
          <Link href="/tools" className="text-sm text-text-muted hover:text-text transition-colors">{language==="es"?"Herramientas":"Tools"}</Link>
          <span className="text-text-faint">/</span>
          <span className="text-sm text-text truncate">{name}</span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">{name}</h1>
          <p className="text-text-muted">{desc}</p>
        </div>
        <UtilityPanels activeId={tool.id} language={language} />
      </main>
    </div>
  );
}

/* ── ToolsIndexPage ──────────────────────────────────────────────────────── */
function ToolsIndexPage() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [filter, setFilter] = useState<ToolFilter>("all");
  const [search, setSearch] = useState("");
  const es = language === "es";

  const filtered = tools.filter(t => {
    if (filter !== "all" && t.category !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.keyword.toLowerCase().includes(q);
    }
    return true;
  });

  const meta = getCategoryMeta(filter, language);
  const categories: {id:ToolFilter;label:string}[] = [
    {id:"all",        label:es?"Todas":"All"},
    {id:"calculators",label:es?"Calculadoras":"Calculators"},
    {id:"converters", label:es?"Conversores":"Converters"},
    {id:"utilities",  label:es?"Utilidades":"Utilities"},
  ];

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="font-bold text-primary text-sm">Omni Tool Studio</Link>
          <span className="text-text-faint">/</span>
          <span className="text-sm text-text">{es?"Herramientas":"Tools"}</span>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
          <p className="text-text-muted">{meta.description}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint"/>
            <input className="input pl-9 w-full" placeholder={es?"Buscar herramientas…":"Search tools…"} value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <div className="flex gap-2">
            {categories.map(c=>(
              <button key={c.id} onClick={()=>setFilter(c.id)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter===c.id?"bg-primary text-surface":"bg-surface-offset text-text-muted hover:text-text"}`}>{c.label}</button>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(tool=>{
            const name = es ? ((tools as any).toolTranslations?.[tool.id]?.name ?? tool.name) : tool.name;
            const desc = es ? ((tools as any).toolTranslations?.[tool.id]?.description ?? tool.description) : tool.description;
            return (
              <Link key={tool.id} href={`/tools/${tool.slug}`} className="group block rounded-xl border border-border bg-surface p-4 hover:border-primary/40 hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <tool.icon size={20} className="mt-0.5 text-primary shrink-0"/>
                  <div>
                    <div className="font-semibold text-sm mb-0.5 group-hover:text-primary transition-colors">{name}</div>
                    <div className="text-xs text-text-muted leading-snug">{desc}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}

/* ── SeoLandingPage ─────────────────────────────────────────────────────── */
function SeoLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const landing = seoLandings.find(l => l.slug === slug);
  if (!landing) return <NotFound />;

  const copy = getSeoLandingCopy(landing, language);
  const tool  = tools.find(t => t.slug === copy.toolSlug);

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="font-bold text-primary text-sm">Omni Tool Studio</Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-3">{copy.title}</h1>
        <p className="text-text-muted mb-8">{copy.description}</p>
        {tool && <UtilityPanels activeId={tool.id} language={language} />}
        {copy.faqs.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {copy.faqs.map((faq,i) => (
                <div key={i} className="rounded-xl border border-border bg-surface p-4">
                  <h3 className="font-semibold mb-1">{faq.question}</h3>
                  <p className="text-sm text-text-muted">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

/* ── BlogIndexPage ──────────────────────────────────────────────────────── */
function BlogIndexPage() {
  const { language } = useLanguage();
  const es = language === "es";
  return (
    <StaticPageLayout title={es ? "Blog" : "Blog"}>
      <h1 className="text-3xl font-bold mb-8">{es ? "Artículos" : "Articles"}</h1>
      <div className="space-y-4">
        {blogPosts.map(post => {
          const p = getBlogPostCopy(post, language);
          return (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group block rounded-xl border border-border bg-surface p-5 hover:border-primary/40 hover:shadow-md transition-all">
              <h2 className="font-semibold mb-1 group-hover:text-primary transition-colors">{p.title}</h2>
              <p className="text-sm text-text-muted mb-2">{p.description}</p>
              <span className="text-xs text-text-faint">{p.readTime}</span>
            </Link>
          );
        })}
      </div>
    </StaticPageLayout>
  );
}

/* ── BlogPostPage ───────────────────────────────────────────────────────── */
function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const post = blogPosts.find(p => p.slug === slug);
  if (!post) return <NotFound />;
  const p = getBlogPostCopy(post, language);
  return (
    <StaticPageLayout title={p.title}>
      <article>
        <h1 className="text-3xl font-bold mb-2">{p.title}</h1>
        <p className="text-xs text-text-faint mb-8">{p.readTime}</p>
        <div className="space-y-6">
          {p.sections.map((s,i) => (
            <section key={i}>
              <h2 className="text-lg font-semibold mb-2">{s.heading}</h2>
              <p className="text-text-muted leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>
      </article>
    </StaticPageLayout>
  );
}

/* ── Home ───────────────────────────────────────────────────────────────── */
function Home() {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [filter, setFilter] = useState<ToolFilter>("all");
  const [search, setSearch] = useState("");
  const es = language === "es";

  const filtered = tools.filter(t => {
    if (filter !== "all" && t.category !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.keyword.toLowerCase().includes(q);
    }
    return true;
  });

  const categories: {id:ToolFilter;label:string}[] = [
    {id:"all",        label:es?"Todas":"All"},
    {id:"calculators",label:es?"Calculadoras":"Calculators"},
    {id:"converters", label:es?"Conversores":"Converters"},
    {id:"utilities",  label:es?"Utilidades":"Utilities"},
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <div className="font-bold text-primary tracking-tight">Omni Tool Studio</div>
          <div className="flex-1"/>
          <nav className="hidden sm:flex items-center gap-4 text-sm text-text-muted">
            <Link href="/tools" className="hover:text-text transition-colors">{es?"Herramientas":"Tools"}</Link>
            <Link href="/blog" className="hover:text-text transition-colors">Blog</Link>
            <Link href="/about" className="hover:text-text transition-colors">{es?"Acerca de":"About"}</Link>
          </nav>
          <div className="flex items-center gap-2">
            <select className="text-xs bg-surface-offset border border-border rounded px-1.5 py-1 text-text-muted" value={language} onChange={e=>setLanguage(e.target.value as Language)}>
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>
            <button onClick={()=>setTheme(theme==="dark"?"light":"dark")} aria-label="Toggle theme" className="p-1.5 rounded hover:bg-surface-dynamic transition-colors text-text-muted">
              {theme==="dark"?<Sun size={16}/>:<Moon size={16}/>}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border bg-surface">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold mb-2">{es?"Herramientas gratuitas para el día a día":"Free everyday tools, all in one place"}</h1>
          <p className="text-text-muted max-w-xl">{es?"Calculadoras, conversores y utilidades que funcionan al instante en tu navegador.":"Calculators, converters, and utilities that run instantly in your browser."}</p>
        </div>
      </section>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {activeTool ? (
          <div>
            <button onClick={()=>setActiveTool(null)} className="mb-4 text-sm text-text-muted hover:text-text flex items-center gap-1 transition-colors">
              ← {es?"Volver":"Back"}
            </button>
            <h2 className="text-xl font-bold mb-1">
              {es ? ((tools as any).toolTranslations?.[activeTool.id]?.name ?? activeTool.name) : activeTool.name}
            </h2>
            <p className="text-sm text-text-muted mb-4">
              {es ? ((tools as any).toolTranslations?.[activeTool.id]?.description ?? activeTool.description) : activeTool.description}
            </p>
            <UtilityPanels activeId={activeTool.id} language={language} />
          </div>
        ) : (
          <div>
            {/* Filter + Search */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint"/>
                <input className="input pl-9 w-full" placeholder={es?"Buscar herramientas…":"Search tools…"} value={search} onChange={e=>setSearch(e.target.value)}/>
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map(c=>(
                  <button key={c.id} onClick={()=>setFilter(c.id)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter===c.id?"bg-primary text-surface":"bg-surface-offset text-text-muted hover:text-text"}`}>{c.label}</button>
                ))}
              </div>
            </div>

            {/* Tool Grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map(tool => {
                const name = es ? ((tools as any).toolTranslations?.[tool.id]?.name ?? tool.name) : tool.name;
                const desc = es ? ((tools as any).toolTranslations?.[tool.id]?.description ?? tool.description) : tool.description;
                return (
                  <button key={tool.id} onClick={()=>setActiveTool(tool)} className="group text-left rounded-xl border border-border bg-surface p-4 hover:border-primary/40 hover:shadow-md transition-all">
                    <div className="flex items-start gap-3">
                      <tool.icon size={20} className="mt-0.5 text-primary shrink-0"/>
                      <div>
                        <div className="font-semibold text-sm mb-0.5 group-hover:text-primary transition-colors">{name}</div>
                        <div className="text-xs text-text-muted leading-snug">{desc}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-wrap gap-4 items-center justify-between text-xs text-text-faint">
          <span>© 2025 Omni Tool Studio</span>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-text-muted transition-colors">{es?"Acerca de":"About"}</Link>
            <Link href="/privacy" className="hover:text-text-muted transition-colors">{es?"Privacidad":"Privacy"}</Link>
            <Link href="/terms" className="hover:text-text-muted transition-colors">{es?"Términos":"Terms"}</Link>
            <Link href="/contact" className="hover:text-text-muted transition-colors">{es?"Contacto":"Contact"}</Link>
            <Link href="/blog" className="hover:text-text-muted transition-colors">Blog</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── SlugPage (SEO landing dispatcher) ───────────────────────────────── */
function SlugPage() {
  const { slug } = useParams<{ slug: string }>();
  const landing = seoLandings.find(l => l.slug === slug);
  if (landing) return <SeoLandingPage />;
  return <NotFound />;
}

/* ── AppRouter ───────────────────────────────────────────────────────────── */
export function AppRouter() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router hook={useBrowserLocation}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/tools" component={ToolsIndexPage} />
            <Route path="/tools/:slug" component={ToolPage} />
            <Route path="/blog" component={BlogIndexPage} />
            <Route path="/blog/:slug" component={BlogPostPage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/contact" component={ContactPage} />
            <Route path="/privacy" component={PrivacyPage} />
            <Route path="/terms" component={TermsPage} />
            <Route path="/:slug" component={SlugPage} />
            <Route component={NotFound} />
          </Switch>
        </Router>
        <Toaster />
        <Analytics />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
