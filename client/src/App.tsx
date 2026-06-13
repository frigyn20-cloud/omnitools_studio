import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
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
  Brain,
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
import { PdfAnnotateTool } from "./PdfAnnotateTool";
import { useSeo } from "./use-seo";

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
  example?: string;
  howWorks?: string;
  equation?: string;
  sections?: { heading: string; body: string }[];
  faqItems?: { q: string; a: string }[];
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