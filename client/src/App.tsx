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