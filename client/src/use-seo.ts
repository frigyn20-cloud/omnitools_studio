import { useEffect } from "react";
import { seoOverrides } from "./seo-patches";

const BASE_URL = "https://omnitoolstudio.com";
const SITE_NAME = "OmniTool Studio";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

function setMeta(selector: string, attr: string, value: string) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

export function useSeo(slug: string, fallbackTitle: string, fallbackDescription: string) {
  useEffect(() => {
    const override = seoOverrides[slug];
    const title = override?.title ?? fallbackTitle;
    const description = override?.description ?? fallbackDescription;
    const canonical = override?.canonical ?? `${BASE_URL}/${slug}`;

    // Page title
    document.title = `${title} | ${SITE_NAME}`;

    // Meta description
    setMeta('meta[name="description"]', "content", description);

    // Canonical
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      canonicalEl.rel = "canonical";
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.href = canonical;

    // Open Graph
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", canonical);
    setMeta('meta[property="og:image"]', "content", DEFAULT_IMAGE);

    // Twitter
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", DEFAULT_IMAGE);

    // Inject per-page JSON-LD BreadcrumbList
    const existingBreadcrumb = document.getElementById("jsonld-breadcrumb");
    if (existingBreadcrumb) existingBreadcrumb.remove();
    const breadcrumbScript = document.createElement("script");
    breadcrumbScript.type = "application/ld+json";
    breadcrumbScript.id = "jsonld-breadcrumb";
    breadcrumbScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "OmniTool Studio", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: title, item: canonical },
      ],
    });
    document.head.appendChild(breadcrumbScript);

    return () => {
      const s = document.getElementById("jsonld-breadcrumb");
      if (s) s.remove();
    };
  }, [slug, fallbackTitle, fallbackDescription]);
}
