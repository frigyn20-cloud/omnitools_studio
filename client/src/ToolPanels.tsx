import { useEffect, useMemo, useRef, useState } from "react";
import { Calculator, Copy, Download, Type } from "lucide-react";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import PdfAnnotateTool from "@/components/PdfAnnotateTool";
import { type Tool, type Category, tools, toolTranslations } from "@/data/tools";
import { type Language } from "@/App";

/* ── shared helpers ─────────────────────────────────────────────────── */
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  });
}

/* ── UtilityPanels dispatcher ───────────────────────────────────────── */
export default function UtilityPanels({ activeId, language }: { activeId: string; language: Language }) {
  if (activeId === "discount")       return <DiscountTool language={language} />;
  if (activeId === "tip")            return <TipTool language={language} />;
  if (activeId === "budget")         return <BudgetTool language={language} />;
  if (activeId === "after-tax-salary") return <AfterTaxSalaryTool language={language} />;
  if (activeId === "loan")           return <LoanTool language={language} />;
  if (activeId === "savings")        return <SavingsTool language={language} />;
  if (activeId === "calories")       return <CaloriesTool language={language} />;
  if (activeId === "date")           return <DateTool language={language} />;
  if (activeId === "units")          return <UnitsTool language={language} />;
  if (activeId === "currency")       return <CurrencyTool language={language} />;
  if (activeId === "timezones")      return <TimeZonesTool language={language} />;
  if (activeId === "timestamps")     return <TimestampTool language={language} />;
  if (activeId === "data")           return <DataTool language={language} />;
  if (activeId === "pdf")            return <PdfTool language={language} />;
  if (activeId === "qr")             return <QrTool language={language} />;
  if (activeId === "words")          return <WordTool language={language} />;
  if (activeId === "notes")          return <NotesTool language={language} />;
  if (activeId === "stopwatch")      return <StopwatchTool language={language} />;
  if (activeId === "countdown")      return <CountdownTool language={language} />;
  if (activeId === "password")       return <PasswordTool language={language} />;
  if (activeId === "text")           return <TextTool language={language} />;
  if (activeId === "summarizer")     return <SummarizerTool />;
  if (activeId === "pdf-annotate")   return <PdfAnnotateTool />;
  return null;
}

/* ── ToolInteractive wrapper ────────────────────────────────────────── */
function ToolInteractive({ children }: { children: React.ReactNode }) {
  return (
    <div className="tool-interactive rounded-xl border border-border bg-surface p-5 shadow-sm">
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   CALCULATOR TOOLS
══════════════════════════════════════════════════════════════════════ */

/* ── Discount ────────────────────────────────────────────────────────── */
function DiscountTool({ language }: { language: Language }) {
  const [price, setPrice] = useState("100");
  const [discount, setDiscount] = useState("20");
  const [tax, setTax] = useState("0");

  const original = parseFloat(price) || 0;
  const pct = parseFloat(discount) || 0;
  const taxPct = parseFloat(tax) || 0;
  const saved = original * (pct / 100);
  const afterDiscount = original - saved;
  const final = afterDiscount * (1 + taxPct / 100);

  const fmt = (n: number) => n.toFixed(2);

  const es = language === "es";
  return (
    <ToolInteractive>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-text-muted">{es ? "Precio original ($)" : "Original price ($)"}</span>
          <input className="input" type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-text-muted">{es ? "Descuento (%)" : "Discount (%)"}</span>
          <input className="input" type="number" min="0" max="100" value={discount} onChange={e => setDiscount(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-text-muted">{es ? "Impuesto (%)" : "Tax (%)"}</span>
          <input className="input" type="number" min="0" value={tax} onChange={e => setTax(e.target.value)} />
        </label>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <div className="result-card">
          <span className="label">{es ? "Ahorro" : "You save"}</span>
          <span className="value text-primary">${fmt(saved)}</span>
        </div>
        <div className="result-card">
          <span className="label">{es ? "Tras descuento" : "After discount"}</span>
          <span className="value">${fmt(afterDiscount)}</span>
        </div>
        <div className="result-card">
          <span className="label">{es ? "Total final" : "Final total"}</span>
          <span className="value font-bold">${fmt(final)}</span>
        </div>
      </div>
    </ToolInteractive>
  );
}

/* ── Tip ─────────────────────────────────────────────────────────────── */
function TipTool({ language }: { language: Language }) {
  const [bill, setBill] = useState("50");
  const [tipPct, setTipPct] = useState("18");
  const [people, setPeople] = useState("2");

  const total = parseFloat(bill) || 0;
  const tip = total * ((parseFloat(tipPct) || 0) / 100);
  const grand = total + tip;
  const perPerson = grand / (parseInt(people) || 1);
  const fmt = (n: number) => n.toFixed(2);
  const es = language === "es";

  return (
    <ToolInteractive>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-text-muted">{es ? "Cuenta ($)" : "Bill ($)"}</span>
          <input className="input" type="number" min="0" value={bill} onChange={e => setBill(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-text-muted">{es ? "Propina (%)" : "Tip (%)"}</span>
          <input className="input" type="number" min="0" value={tipPct} onChange={e => setTipPct(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-text-muted">{es ? "Personas" : "People"}</span>
          <input className="input" type="number" min="1" value={people} onChange={e => setPeople(e.target.value)} />
        </label>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <div className="result-card"><span className="label">{es ? "Propina" : "Tip amount"}</span><span className="value">${fmt(tip)}</span></div>
        <div className="result-card"><span className="label">{es ? "Total" : "Grand total"}</span><span className="value">${fmt(grand)}</span></div>
        <div className="result-card"><span className="label">{es ? "Por persona" : "Per person"}</span><span className="value font-bold text-primary">${fmt(perPerson)}</span></div>
      </div>
    </ToolInteractive>
  );
}

/* ── Budget ──────────────────────────────────────────────────────────── */
function BudgetTool({ language }: { language: Language }) {
  const [income, setIncome] = useState("3000");
  const [fixed, setFixed] = useState("1200");
  const [variable, setVariable] = useState("600");
  const [goal, setGoal] = useState("300");
  const es = language === "es";

  const inc = parseFloat(income) || 0;
  const fx = parseFloat(fixed) || 0;
  const vr = parseFloat(variable) || 0;
  const gl = parseFloat(goal) || 0;
  const remaining = inc - fx - vr;
  const savingsRate = inc > 0 ? ((remaining / inc) * 100).toFixed(1) : "0.0";
  const onTrack = remaining >= gl;

  return (
    <ToolInteractive>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          [es ? "Ingresos mensuales ($)" : "Monthly income ($)", income, setIncome],
          [es ? "Gastos fijos ($)" : "Fixed expenses ($)", fixed, setFixed],
          [es ? "Gastos variables ($)" : "Variable expenses ($)", variable, setVariable],
          [es ? "Meta de ahorro ($)" : "Savings goal ($)", goal, setGoal],
        ].map(([label, val, setter]: any) => (
          <label key={label} className="flex flex-col gap-1 text-sm">
            <span className="text-text-muted">{label}</span>
            <input className="input" type="number" min="0" value={val} onChange={e => setter(e.target.value)} />
          </label>
        ))}
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <div className="result-card"><span className="label">{es ? "Restante" : "Remaining"}</span><span className={`value ${remaining < 0 ? "text-error" : "text-primary"}`}>${remaining.toFixed(2)}</span></div>
        <div className="result-card"><span className="label">{es ? "Tasa de ahorro" : "Savings rate"}</span><span className="value">{savingsRate}%</span></div>
        <div className="result-card"><span className="label">{es ? "Meta" : "Goal status"}</span><span className={`value font-bold ${onTrack ? "text-primary" : "text-error"}`}>{onTrack ? (es ? "En camino ✓" : "On track ✓") : (es ? "Por debajo ✗" : "Below goal ✗")}</span></div>
      </div>
    </ToolInteractive>
  );
}

/* ── After-Tax Salary ────────────────────────────────────────────────── */
function AfterTaxSalaryTool({ language }: { language: Language }) {
  const [salary, setSalary] = useState("55000");
  const [state, setState] = useState("0");
  const es = language === "es";

  const gross = parseFloat(salary) || 0;
  const stateTax = parseFloat(state) || 0;
  const federal = gross <= 11600 ? gross * 0.10 : gross <= 47150 ? 1160 + (gross - 11600) * 0.12 : gross <= 100525 ? 5426 + (gross - 47150) * 0.22 : gross <= 191950 ? 17168.5 + (gross - 100525) * 0.24 : gross <= 243725 ? 39110.5 + (gross - 191950) * 0.32 : gross <= 609350 ? 55678.5 + (gross - 243725) * 0.35 : 183647.25 + (gross - 609350) * 0.37;
  const fica = gross * 0.0765;
  const stateAmt = gross * (stateTax / 100);
  const total = federal + fica + stateAmt;
  const net = gross - total;
  const monthly = net / 12;
  const effective = gross > 0 ? ((total / gross) * 100).toFixed(1) : "0.0";

  return (
    <ToolInteractive>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-text-muted">{es ? "Salario bruto anual ($)" : "Gross annual salary ($)"}</span>
          <input className="input" type="number" min="0" value={salary} onChange={e => setSalary(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-text-muted">{es ? "Impuesto estatal (%)" : "State tax rate (%)"}</span>
          <input className="input" type="number" min="0" max="20" step="0.1" value={state} onChange={e => setState(e.target.value)} />
        </label>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <div className="result-card"><span className="label">{es ? "Impuesto federal" : "Federal tax"}</span><span className="value">${federal.toFixed(0)}</span></div>
        <div className="result-card"><span className="label">FICA</span><span className="value">${fica.toFixed(0)}</span></div>
        <div className="result-card"><span className="label">{es ? "Tasa efectiva" : "Effective rate"}</span><span className="value">{effective}%</span></div>
        <div className="result-card"><span className="label">{es ? "Neto mensual" : "Monthly take-home"}</span><span className="value font-bold text-primary">${monthly.toFixed(0)}</span></div>
      </div>
      <div className="mt-2 result-card">
        <span className="label">{es ? "Neto anual estimado" : "Estimated annual take-home"}</span>
        <span className="value text-xl font-bold text-primary">${net.toFixed(0)}</span>
      </div>
    </ToolInteractive>
  );
}

/* ── Loan ─────────────────────────────────────────────────────────────── */
function LoanTool({ language }: { language: Language }) {
  const [principal, setPrincipal] = useState("25000");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("5");
  const es = language === "es";

  const P = parseFloat(principal) || 0;
  const r = (parseFloat(rate) || 0) / 100 / 12;
  const n = (parseInt(years) || 1) * 12;
  const monthly = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const total = monthly * n;
  const interest = total - P;

  return (
    <ToolInteractive>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-text-muted">{es ? "Monto del préstamo ($)" : "Loan amount ($)"}</span>
          <input className="input" type="number" min="0" value={principal} onChange={e => setPrincipal(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-text-muted">{es ? "Tasa anual (%)" : "Annual rate (%)"}</span>
          <input className="input" type="number" min="0" step="0.1" value={rate} onChange={e => setRate(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-text-muted">{es ? "Plazo (años)" : "Term (years)"}</span>
          <input className="input" type="number" min="1" value={years} onChange={e => setYears(e.target.value)} />
        </label>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <div className="result-card"><span className="label">{es ? "Pago mensual" : "Monthly payment"}</span><span className="value font-bold text-primary">${monthly.toFixed(2)}</span></div>
        <div className="result-card"><span className="label">{es ? "Total pagado" : "Total paid"}</span><span className="value">${total.toFixed(2)}</span></div>
        <div className="result-card"><span className="label">{es ? "Interés total" : "Total interest"}</span><span className="value text-error">${interest.toFixed(2)}</span></div>
      </div>
    </ToolInteractive>
  );
}

/* ── Savings ──────────────────────────────────────────────────────────── */
function SavingsTool({ language }: { language: Language }) {
  const [initial, setInitial] = useState("1000");
  const [monthly, setMonthly] = useState("200");
  const [rate, setRate] = useState("5");
  const [years, setYears] = useState("10");
  const es = language === "es";

  const P = parseFloat(initial) || 0;
  const m = parseFloat(monthly) || 0;
  const r = (parseFloat(rate) || 0) / 100 / 12;
  const n = (parseInt(years) || 1) * 12;
  const fv = r === 0 ? P + m * n : P * Math.pow(1 + r, n) + m * ((Math.pow(1 + r, n) - 1) / r);
  const contributed = P + m * n;
  const interest = fv - contributed;

  return (
    <ToolInteractive>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [es ? "Depósito inicial ($)" : "Initial deposit ($)", initial, setInitial],
          [es ? "Aporte mensual ($)" : "Monthly contribution ($)", monthly, setMonthly],
          [es ? "Tasa anual (%)" : "Annual rate (%)", rate, setRate],
          [es ? "Años" : "Years", years, setYears],
        ].map(([label, val, setter]: any) => (
          <label key={label} className="flex flex-col gap-1 text-sm">
            <span className="text-text-muted">{label}</span>
            <input className="input" type="number" min="0" step="0.1" value={val} onChange={e => setter(e.target.value)} />
          </label>
        ))}
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <div className="result-card"><span className="label">{es ? "Total aportado" : "Total contributed"}</span><span className="value">${contributed.toFixed(2)}</span></div>
        <div className="result-card"><span className="label">{es ? "Interés ganado" : "Interest earned"}</span><span className="value text-primary">${interest.toFixed(2)}</span></div>
        <div className="result-card"><span className="label">{es ? "Valor final" : "Final value"}</span><span className="value font-bold text-primary text-lg">${fv.toFixed(2)}</span></div>
      </div>
    </ToolInteractive>
  );
}

/* ── Calories ─────────────────────────────────────────────────────────── */
function CaloriesTool({ language }: { language: Language }) {
  const [age, setAge] = useState("30");
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("170");
  const [sex, setSex] = useState<"male"|"female">("male");
  const [activity, setActivity] = useState("1.55");
  const es = language === "es";

  const w = parseFloat(weight)||0, h = parseFloat(height)||0, a = parseInt(age)||0;
  const bmr = sex === "male" ? 10*w + 6.25*h - 5*a + 5 : 10*w + 6.25*h - 5*a - 161;
  const tdee = bmr * parseFloat(activity);
  const levels = es
    ? [["Sedentario","1.2"],["Ligero","1.375"],["Moderado","1.55"],["Activo","1.725"],["Muy activo","1.9"]]
    : [["Sedentary","1.2"],["Light","1.375"],["Moderate","1.55"],["Active","1.725"],["Very active","1.9"]];

  return (
    <ToolInteractive>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1 text-sm"><span className="text-text-muted">{es?"Edad":"Age"}</span><input className="input" type="number" min="10" max="100" value={age} onChange={e=>setAge(e.target.value)}/></label>
        <label className="flex flex-col gap-1 text-sm"><span className="text-text-muted">{es?"Peso (kg)":"Weight (kg)"}</span><input className="input" type="number" min="30" value={weight} onChange={e=>setWeight(e.target.value)}/></label>
        <label className="flex flex-col gap-1 text-sm"><span className="text-text-muted">{es?"Altura (cm)":"Height (cm)"}</span><input className="input" type="number" min="100" value={height} onChange={e=>setHeight(e.target.value)}/></label>
        <label className="flex flex-col gap-1 text-sm"><span className="text-text-muted">{es?"Sexo":"Sex"}</span>
          <select className="input" value={sex} onChange={e=>setSex(e.target.value as "male"|"female")}>
            <option value="male">{es?"Hombre":"Male"}</option>
            <option value="female">{es?"Mujer":"Female"}</option>
          </select>
        </label>
      </div>
      <label className="mt-3 flex flex-col gap-1 text-sm"><span className="text-text-muted">{es?"Nivel de actividad":"Activity level"}</span>
        <select className="input" value={activity} onChange={e=>setActivity(e.target.value)}>
          {levels.map(([l,v])=><option key={v} value={v}>{l}</option>)}
        </select>
      </label>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <div className="result-card"><span className="label">BMR</span><span className="value">{Math.round(bmr)} kcal</span></div>
        <div className="result-card"><span className="label">TDEE</span><span className="value font-bold text-primary">{Math.round(tdee)} kcal</span></div>
        <div className="result-card"><span className="label">{es?"Déficit (−500)":"Deficit (−500)"}</span><span className="value">{Math.round(tdee-500)} kcal</span></div>
      </div>
    </ToolInteractive>
  );
}

/* ── Date ─────────────────────────────────────────────────────────────── */
function DateTool({ language }: { language: Language }) {
  const today = new Date().toISOString().split("T")[0];
  const [mode, setMode] = useState<"add"|"diff">("add");
  const [dateA, setDateA] = useState(today);
  const [days, setDays] = useState("30");
  const [dateB, setDateB] = useState(today);
  const es = language === "es";

  const result = useMemo(() => {
    if (mode === "add") {
      const d = new Date(dateA); d.setDate(d.getDate() + parseInt(days||"0"));
      return d.toLocaleDateString(es?"es-MX":"en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
    }
    const a = new Date(dateA), b = new Date(dateB);
    const diff = Math.round((b.getTime()-a.getTime())/(1000*60*60*24));
    return `${Math.abs(diff)} ${es?"días":"days"} (${diff>=0?(es?"en el futuro":"in the future"):(es?"en el pasado":"in the past")})`;
  },[mode,dateA,days,dateB,es]);

  return (
    <ToolInteractive>
      <div className="flex gap-2 mb-4">
        {(["add","diff"] as const).map(m=>(
          <button key={m} onClick={()=>setMode(m)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode===m?"bg-primary text-surface":"bg-surface-offset text-text-muted hover:text-text"}`}>
            {m==="add"?(es?"Sumar días":"Add days"):(es?"Diferencia":"Difference")}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm"><span className="text-text-muted">{es?"Fecha A":"Date A"}</span><input className="input" type="date" value={dateA} onChange={e=>setDateA(e.target.value)}/></label>
        {mode==="add"
          ? <label className="flex flex-col gap-1 text-sm"><span className="text-text-muted">{es?"Días a sumar":"Days to add"}</span><input className="input" type="number" value={days} onChange={e=>setDays(e.target.value)}/></label>
          : <label className="flex flex-col gap-1 text-sm"><span className="text-text-muted">{es?"Fecha B":"Date B"}</span><input className="input" type="date" value={dateB} onChange={e=>setDateB(e.target.value)}/></label>
        }
      </div>
      <div className="mt-4 result-card"><span className="label">{es?"Resultado":"Result"}</span><span className="value font-semibold text-primary">{result}</span></div>
    </ToolInteractive>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   CONVERTER TOOLS
══════════════════════════════════════════════════════════════════════ */

/* ── Units ───────────────────────────────────────────────────────────── */
function UnitsTool({ language }: { language: Language }) {
  const [category, setCategory] = useState("length");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("ft");
  const [value, setValue] = useState("1");
  const es = language === "es";

  const categories: Record<string,{label:string;units:{id:string;label:string;toBase:number}[]}> = {
    length:{label:es?"Longitud":"Length",units:[{id:"m",label:"Meter",toBase:1},{id:"km",label:"Kilometer",toBase:1000},{id:"cm",label:"Centimeter",toBase:0.01},{id:"mm",label:"Millimeter",toBase:0.001},{id:"ft",label:"Foot",toBase:0.3048},{id:"in",label:"Inch",toBase:0.0254},{id:"yd",label:"Yard",toBase:0.9144},{id:"mi",label:"Mile",toBase:1609.344}]},
    weight:{label:es?"Peso":"Weight",units:[{id:"kg",label:"Kilogram",toBase:1},{id:"g",label:"Gram",toBase:0.001},{id:"lb",label:"Pound",toBase:0.453592},{id:"oz",label:"Ounce",toBase:0.0283495},{id:"t",label:"Metric ton",toBase:1000}]},
    temperature:{label:es?"Temperatura":"Temperature",units:[{id:"c",label:"Celsius",toBase:1},{id:"f",label:"Fahrenheit",toBase:1},{id:"k",label:"Kelvin",toBase:1}]},
    volume:{label:es?"Volumen":"Volume",units:[{id:"l",label:"Liter",toBase:1},{id:"ml",label:"Milliliter",toBase:0.001},{id:"gal",label:"Gallon (US)",toBase:3.78541},{id:"qt",label:"Quart",toBase:0.946353},{id:"pt",label:"Pint",toBase:0.473176},{id:"cup",label:"Cup",toBase:0.236588},{id:"floz",label:"Fl oz",toBase:0.0295735}]},
  };

  const cat = categories[category];
  const v = parseFloat(value) || 0;
  let result: number;
  if (category === "temperature") {
    const toC = from==="c"?v:from==="f"?(v-32)*5/9:v-273.15;
    result = to==="c"?toC:to==="f"?toC*9/5+32:toC+273.15;
  } else {
    const base = v * (cat.units.find(u=>u.id===from)?.toBase||1);
    result = base / (cat.units.find(u=>u.id===to)?.toBase||1);
  }

  const handleCategoryChange = (c:string) => { setCategory(c); setFrom(categories[c].units[0].id); setTo(categories[c].units[1].id); };

  return (
    <ToolInteractive>
      <div className="flex gap-2 flex-wrap mb-4">
        {Object.entries(categories).map(([key,{label}])=>(
          <button key={key} onClick={()=>handleCategoryChange(key)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${category===key?"bg-primary text-surface":"bg-surface-offset text-text-muted hover:text-text"}`}>{label}</button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm"><span className="text-text-muted">{es?"Valor":"Value"}</span><input className="input" type="number" value={value} onChange={e=>setValue(e.target.value)}/></label>
        <label className="flex flex-col gap-1 text-sm"><span className="text-text-muted">{es?"De":"From"}</span><select className="input" value={from} onChange={e=>setFrom(e.target.value)}>{cat.units.map(u=><option key={u.id} value={u.id}>{u.label}</option>)}</select></label>
        <label className="flex flex-col gap-1 text-sm"><span className="text-text-muted">{es?"A":"To"}</span><select className="input" value={to} onChange={e=>setTo(e.target.value)}>{cat.units.map(u=><option key={u.id} value={u.id}>{u.label}</option>)}</select></label>
      </div>
      <div className="mt-4 result-card"><span className="label">{es?"Resultado":"Result"}</span><span className="value font-bold text-primary text-lg">{isFinite(result)?result.toPrecision(7).replace(/\.?0+$/,""):"—"} {to.toUpperCase()}</span></div>
    </ToolInteractive>
  );
}

/* ── Currency ────────────────────────────────────────────────────────── */
function CurrencyTool({ language }: { language: Language }) {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [rates, setRates] = useState<Record<string,number>>({});
  const [status, setStatus] = useState<"loading"|"live"|"fallback">("loading");
  const es = language === "es";

  const fallback: Record<string,number> = {USD:1,EUR:0.92,GBP:0.79,JPY:149.5,CAD:1.36,AUD:1.53,CHF:0.88,MXN:17.1};
  const currencies = ["USD","EUR","GBP","JPY","CAD","AUD","CHF","MXN"];

  useEffect(()=>{
    fetch("https://api.exchangerate-api.com/v4/latest/USD")
      .then(r=>r.json()).then(d=>{setRates(d.rates);setStatus("live");})
      .catch(()=>{setRates(fallback);setStatus("fallback");});
  },[]);

  const r = Object.keys(rates).length ? rates : fallback;
  const result = (parseFloat(amount)||0) / r[from] * r[to];

  return (
    <ToolInteractive>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm"><span className="text-text-muted">{es?"Monto":"Amount"}</span><input className="input" type="number" min="0" value={amount} onChange={e=>setAmount(e.target.value)}/></label>
        <label className="flex flex-col gap-1 text-sm"><span className="text-text-muted">{es?"De":"From"}</span><select className="input" value={from} onChange={e=>setFrom(e.target.value)}>{currencies.map(c=><option key={c}>{c}</option>)}</select></label>
        <label className="flex flex-col gap-1 text-sm"><span className="text-text-muted">{es?"A":"To"}</span><select className="input" value={to} onChange={e=>setTo(e.target.value)}>{currencies.map(c=><option key={c}>{c}</option>)}</select></label>
      </div>
      <div className="mt-4 result-card">
        <span className="label">{status==="loading"?(es?"Cargando...":"Loading..."):`${amount} ${from} =`} {status==="fallback"&&<span className="text-xs text-text-muted ml-1">({es?"tasa estimada":"estimated rate"})</span>}</span>
        <span className="value font-bold text-primary text-lg">{status==="loading"?"…":result.toFixed(2)} {to}</span>
      </div>
    </ToolInteractive>
  );
}

/* ── TimeZones ───────────────────────────────────────────────────────── */
function TimeZonesTool({ language }: { language: Language }) {
  const [input, setInput] = useState(() => new Date().toISOString().slice(0,16));
  const es = language === "es";
  const cities = [
    {name:"Los Angeles",tz:"America/Los_Angeles"},{name:"New York",tz:"America/New_York"},
    {name:"London",tz:"Europe/London"},{name:"Moscow",tz:"Europe/Moscow"},
    {name:"Dubai",tz:"Asia/Dubai"},{name:"Tokyo",tz:"Asia/Tokyo"},
  ];
  const base = new Date(input);
  return (
    <ToolInteractive>
      <label className="flex flex-col gap-1 text-sm mb-4">
        <span className="text-text-muted">{es?"Fecha y hora":"Date & time"}</span>
        <input className="input" type="datetime-local" value={input} onChange={e=>setInput(e.target.value)}/>
      </label>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {cities.map(c=>(
          <div key={c.tz} className="result-card">
            <span className="label">{c.name}</span>
            <span className="value text-sm">{isNaN(base.getTime())?"—":base.toLocaleTimeString(es?"es-MX":"en-US",{timeZone:c.tz,hour:"2-digit",minute:"2-digit",weekday:"short"})}</span>
          </div>
        ))}
      </div>
    </ToolInteractive>
  );
}

/* ── Timestamps ──────────────────────────────────────────────────────── */
function TimestampTool({ language }: { language: Language }) {
  const [unix, setUnix] = useState(()=>Math.floor(Date.now()/1000).toString());
  const es = language === "es";
  const ts = parseInt(unix)||0;
  const d = new Date(ts*1000);
  const valid = !isNaN(d.getTime());
  return (
    <ToolInteractive>
      <label className="flex flex-col gap-1 text-sm mb-4">
        <span className="text-text-muted">{es?"Unix timestamp (segundos)":"Unix timestamp (seconds)"}</span>
        <div className="flex gap-2">
          <input className="input flex-1" type="number" value={unix} onChange={e=>setUnix(e.target.value)}/>
          <button className="btn-secondary px-3 text-sm" onClick={()=>setUnix(Math.floor(Date.now()/1000).toString())}>{es?"Ahora":"Now"}</button>
        </div>
      </label>
      {valid&&(
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="result-card"><span className="label">ISO 8601</span><span className="value text-sm font-mono">{d.toISOString()}</span></div>
          <div className="result-card"><span className="label">UTC</span><span className="value text-sm font-mono">{d.toUTCString()}</span></div>
          <div className="result-card sm:col-span-2"><span className="label">{es?"Hora local":"Local time"}</span><span className="value text-sm font-mono">{d.toLocaleString(es?"es-MX":"en-US")}</span></div>
        </div>
      )}
    </ToolInteractive>
  );
}

/* ── Data Formats ────────────────────────────────────────────────────── */
function DataTool({ language }: { language: Language }) {
  const [tab, setTab] = useState<"json"|"base64"|"csv">("json");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const es = language === "es";

  const process = (mode: string) => {
    setError(""); setOutput("");
    try {
      if (tab==="json") {
        if (mode==="format") setOutput(JSON.stringify(JSON.parse(input),null,2));
        else setOutput(JSON.stringify(JSON.parse(input)));
      } else if (tab==="base64") {
        if (mode==="encode") setOutput(btoa(unescape(encodeURIComponent(input))));
        else setOutput(decodeURIComponent(escape(atob(input))));
      } else {
        const lines = input.trim().split("\n");
        const headers = lines[0].split(",");
        const arr = lines.slice(1).map(l=>{ const v=l.split(","); return Object.fromEntries(headers.map((h,i)=>[h.trim(),v[i]?.trim()||""])); });
        setOutput(JSON.stringify(arr,null,2));
      }
    } catch(e:any) { setError(e.message); }
  };

  const tabs: {id:"json"|"base64"|"csv";label:string}[] = [{id:"json",label:"JSON"},{id:"base64",label:"Base64"},{id:"csv",label:"CSV → JSON"}];
  return (
    <ToolInteractive>
      <div className="flex gap-2 mb-4">
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>{setTab(t.id);setInput("");setOutput("");setError("");}} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab===t.id?"bg-primary text-surface":"bg-surface-offset text-text-muted hover:text-text"}`}>{t.label}</button>
        ))}
      </div>
      <textarea className="input w-full h-28 font-mono text-xs resize-y" placeholder={tab==="json"?"Paste JSON…":tab==="base64"?"Paste text or Base64…":"Paste CSV with header row…"} value={input} onChange={e=>setInput(e.target.value)}/>
      <div className="flex gap-2 mt-2 flex-wrap">
        {tab==="json"&&<><button className="btn-primary text-sm" onClick={()=>process("format")}>{es?"Formatear":"Format"}</button><button className="btn-secondary text-sm" onClick={()=>process("minify")}>{es?"Minificar":"Minify"}</button></>}
        {tab==="base64"&&<><button className="btn-primary text-sm" onClick={()=>process("encode")}>{es?"Codificar":"Encode"}</button><button className="btn-secondary text-sm" onClick={()=>process("decode")}>{es?"Decodificar":"Decode"}</button></>}
        {tab==="csv"&&<button className="btn-primary text-sm" onClick={()=>process("convert")}>{es?"Convertir":"Convert"}</button>}
      </div>
      {error&&<p className="mt-2 text-sm text-error">{error}</p>}
      {output&&<div className="relative mt-3"><textarea readOnly className="input w-full h-28 font-mono text-xs resize-y bg-surface-offset" value={output}/><button className="absolute top-2 right-2" onClick={()=>copyToClipboard(output)}><Copy size={14}/></button></div>}
    </ToolInteractive>
  );
}

/* ── PDF (JSON/CSV/Text to PDF) ──────────────────────────────────────── */
function PdfTool({ language }: { language: Language }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File|null>(null);
  const es = language === "es";

  const generate = async () => {
    const doc = new jsPDF();
    if (file) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext==="png"||ext==="jpg"||ext==="jpeg") {
        const url = URL.createObjectURL(file);
        const img = new Image(); img.src=url;
        await new Promise(r=>{ img.onload=r; });
        const ratio = img.height/img.width;
        doc.addImage(img,"JPEG",10,10,190,190*ratio);
      } else {
        const t = await file.text();
        doc.setFontSize(10);
        doc.text(doc.splitTextToSize(t,180),10,15);
      }
    } else {
      doc.setFontSize(11);
      doc.text(doc.splitTextToSize(text||"(empty)",180),10,15);
    }
    doc.save("document.pdf");
  };

  return (
    <ToolInteractive>
      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-text-muted">{es?"Pega texto o sube archivo (JSON, CSV, TXT, PNG, JPG)":"Paste text or upload file (JSON, CSV, TXT, PNG, JPG)"}</span>
          <textarea className="input h-28 font-mono text-xs resize-y" placeholder={es?"Texto aquí…":"Text here…"} value={text} onChange={e=>{setText(e.target.value);setFile(null);}}/>
        </label>
        <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
          <span>{es?"O sube un archivo:":"Or upload a file:"}</span>
          <input type="file" accept=".txt,.json,.csv,.png,.jpg,.jpeg" className="text-sm" onChange={e=>{ const f=e.target.files?.[0]; if(f){setFile(f);setText("");} }}/>
        </label>
        {file&&<p className="text-xs text-text-muted">{es?"Archivo:":"File:"} {file.name}</p>}
        <button className="btn-primary flex items-center gap-2 self-start" onClick={generate}><Download size={16}/>{es?"Generar PDF":"Generate PDF"}</button>
      </div>
    </ToolInteractive>
  );
}

/* ── QR Code ─────────────────────────────────────────────────────────── */
function QrTool({ language }: { language: Language }) {
  const [text, setText] = useState("https://omnitoolstudio.com");
  const [dataUrl, setDataUrl] = useState("");
  const es = language === "es";

  useEffect(()=>{ if(text) QRCode.toDataURL(text,{width:256,margin:2}).then(setDataUrl).catch(()=>{}); },[text]);

  const download = () => { const a=document.createElement("a"); a.href=dataUrl; a.download="qrcode.png"; a.click(); };

  return (
    <ToolInteractive>
      <label className="flex flex-col gap-1 text-sm mb-4">
        <span className="text-text-muted">{es?"Texto o URL":"Text or URL"}</span>
        <input className="input" type="text" value={text} onChange={e=>setText(e.target.value)} placeholder="https://…"/>
      </label>
      {dataUrl&&(
        <div className="flex flex-col items-center gap-3">
          <img src={dataUrl} alt="QR code" width={200} height={200} className="rounded-lg border border-border"/>
          <button className="btn-primary flex items-center gap-2" onClick={download}><Download size={16}/>{es?"Descargar PNG":"Download PNG"}</button>
        </div>
      )}
    </ToolInteractive>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   UTILITY TOOLS
══════════════════════════════════════════════════════════════════════ */

/* ── Word Counter ────────────────────────────────────────────────────── */
function WordTool({ language }: { language: Language }) {
  const [text, setText] = useState("");
  const es = language === "es";
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g,"").length;
  const sentences = text.split(/[.!?]+/).filter(s=>s.trim()).length;
  const readTime = Math.ceil(words/200);
  return (
    <ToolInteractive>
      <textarea className="input w-full h-36 resize-y text-sm mb-4" placeholder={es?"Pega texto aquí…":"Paste text here…"} value={text} onChange={e=>setText(e.target.value)}/>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {[
          [es?"Palabras":"Words", words],
          [es?"Caracteres":"Chars (total)", chars],
          [es?"Sin espacios":"Chars (no spaces)", charsNoSpace],
          [es?"Oraciones":"Sentences", sentences],
          [es?"Tiempo lectura":"Read time", `${readTime} min`],
        ].map(([label, val])=>(
          <div key={label as string} className="result-card"><span className="label">{label}</span><span className="value font-bold">{val}</span></div>
        ))}
      </div>
    </ToolInteractive>
  );
}

/* ── Notes Pad ───────────────────────────────────────────────────────── */
function NotesTool({ language }: { language: Language }) {
  const [text, setText] = useState("");
  const es = language === "es";
  const download = () => { const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([text],{type:"text/plain"})); a.download="note.txt"; a.click(); };
  return (
    <ToolInteractive>
      <textarea className="input w-full h-48 resize-y text-sm font-mono" placeholder={es?"Escribe aquí…":"Start typing…"} value={text} onChange={e=>setText(e.target.value)}/>
      <div className="flex gap-2 mt-3">
        <button className="btn-primary flex items-center gap-2 text-sm" onClick={download}><Download size={14}/>{es?"Descargar .txt":"Download .txt"}</button>
        <button className="btn-secondary flex items-center gap-2 text-sm" onClick={()=>copyToClipboard(text)}><Copy size={14}/>{es?"Copiar":"Copy"}</button>
        <button className="btn-secondary text-sm ml-auto" onClick={()=>setText("")}>{es?"Limpiar":"Clear"}</button>
      </div>
    </ToolInteractive>
  );
}

/* ── Stopwatch ───────────────────────────────────────────────────────── */
function StopwatchTool({ language }: { language: Language }) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const es = language === "es";

  useEffect(()=>{
    if(running){ startRef.current=Date.now()-elapsed; const tick=()=>{ setElapsed(Date.now()-startRef.current); rafRef.current=requestAnimationFrame(tick); }; rafRef.current=requestAnimationFrame(tick); }
    else cancelAnimationFrame(rafRef.current);
    return ()=>cancelAnimationFrame(rafRef.current);
  },[running]);

  const fmt = (ms:number) => { const t=Math.floor(ms/10); const cs=t%100; const s=Math.floor(t/100)%60; const m=Math.floor(t/6000); return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}.${String(cs).padStart(2,"0")}`; };

  return (
    <ToolInteractive>
      <div className="text-center mb-6">
        <div className="font-mono text-5xl font-bold tracking-tight text-primary">{fmt(elapsed)}</div>
      </div>
      <div className="flex justify-center gap-3 mb-4">
        <button className={`btn-primary px-6 ${running?"bg-error":""}`} onClick={()=>setRunning(!running)}>{running?(es?"Pausar":"Pause"):(es?"Iniciar":"Start")}</button>
        <button className="btn-secondary px-6" onClick={()=>{if(running)setLaps(l=>[...l,elapsed]);}}>{es?"Vuelta":"Lap"}</button>
        <button className="btn-secondary px-6" onClick={()=>{setRunning(false);setElapsed(0);setLaps([]);}}>{es?"Reiniciar":"Reset"}</button>
      </div>
      {laps.length>0&&<div className="grid gap-1 max-h-32 overflow-y-auto">{laps.map((l,i)=><div key={i} className="flex justify-between text-sm px-2 py-1 rounded bg-surface-offset"><span>{es?"Vuelta":"Lap"} {i+1}</span><span className="font-mono">{fmt(l)}</span></div>)}</div>}
    </ToolInteractive>
  );
}

/* ── Countdown ───────────────────────────────────────────────────────── */
function CountdownTool({ language }: { language: Language }) {
  const [minutes, setMinutes] = useState("25");
  const [seconds, setSeconds] = useState("00");
  const [remaining, setRemaining] = useState<number|null>(null);
  const [running, setRunning] = useState(false);
  const rafRef = useRef<number>(0);
  const endRef = useRef<number>(0);
  const es = language === "es";

  useEffect(()=>{
    if(running&&remaining!==null){
      endRef.current=Date.now()+remaining;
      const tick=()=>{
        const r=Math.max(0,endRef.current-Date.now());
        setRemaining(r);
        if(r>0) rafRef.current=requestAnimationFrame(tick);
        else { setRunning(false); try{new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAA...").play();}catch{} }
      };
      rafRef.current=requestAnimationFrame(tick);
    } else cancelAnimationFrame(rafRef.current);
    return ()=>cancelAnimationFrame(rafRef.current);
  },[running]);

  const start = () => { if(remaining===null){const r=(parseInt(minutes)||0)*60000+(parseInt(seconds)||0)*1000;if(r>0){setRemaining(r);setRunning(true);}}else setRunning(true); };
  const reset = () => { setRunning(false); setRemaining(null); cancelAnimationFrame(rafRef.current); };
  const r = remaining??0;
  const m = Math.floor(r/60000); const s = Math.floor((r%60000)/1000); const ms = Math.floor((r%1000)/10);

  return (
    <ToolInteractive>
      {remaining===null?(
        <div className="flex gap-2 justify-center mb-6">
          <label className="flex flex-col items-center gap-1 text-sm"><span className="text-text-muted">{es?"Min":"Min"}</span><input className="input w-20 text-center text-2xl font-mono" type="number" min="0" max="99" value={minutes} onChange={e=>setMinutes(e.target.value)}/></label>
          <span className="text-3xl font-bold text-text-muted self-end mb-1">:</span>
          <label className="flex flex-col items-center gap-1 text-sm"><span className="text-text-muted">{es?"Seg":"Sec"}</span><input className="input w-20 text-center text-2xl font-mono" type="number" min="0" max="59" value={seconds} onChange={e=>setSeconds(e.target.value)}/></label>
        </div>
      ):(
        <div className="text-center mb-6"><div className={`font-mono text-5xl font-bold tracking-tight ${r<10000?"text-error":"text-primary"}`}>{String(m).padStart(2,"0")}:{String(s).padStart(2,"0")}.{String(ms).padStart(2,"0")}</div></div>
      )}
      <div className="flex justify-center gap-3">
        {!running&&<button className="btn-primary px-6" onClick={start}>{remaining===null?(es?"Iniciar":"Start"):(es?"Reanudar":"Resume")}</button>}
        {running&&<button className="btn-secondary px-6" onClick={()=>setRunning(false)}>{es?"Pausar":"Pause"}</button>}
        <button className="btn-secondary px-6" onClick={reset}>{es?"Reiniciar":"Reset"}</button>
      </div>
    </ToolInteractive>
  );
}

/* ── Password ────────────────────────────────────────────────────────── */
function PasswordTool({ language }: { language: Language }) {
  const [length, setLength] = useState(20);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const es = language === "es";

  const generate = () => {
    let chars = "";
    if(upper) chars+="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if(lower) chars+="abcdefghijklmnopqrstuvwxyz";
    if(numbers) chars+="0123456789";
    if(symbols) chars+="!@#$%^&*()-_=+[]{}|;:,.<>?";
    if(!chars) return;
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    setPassword(Array.from(arr).map(n=>chars[n%chars.length]).join(""));
  };

  useEffect(()=>{ generate(); },[length,upper,lower,numbers,symbols]);

  const copy = () => { copyToClipboard(password); setCopied(true); setTimeout(()=>setCopied(false),2000); };

  const opts = [{label:es?"Mayúsculas":"Uppercase",val:upper,set:setUpper},{label:es?"Minúsculas":"Lowercase",val:lower,set:setLower},{label:es?"Números":"Numbers",val:numbers,set:setNumbers},{label:es?"Símbolos":"Symbols",val:symbols,set:setSymbols}];

  return (
    <ToolInteractive>
      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm text-text-muted whitespace-nowrap">{es?"Longitud:":"Length:"} {length}</label>
        <input type="range" min="8" max="64" value={length} onChange={e=>setLength(parseInt(e.target.value))} className="flex-1"/>
      </div>
      <div className="flex flex-wrap gap-3 mb-4">
        {opts.map(o=>(
          <label key={o.label} className="flex items-center gap-1.5 text-sm cursor-pointer">
            <input type="checkbox" checked={o.val} onChange={e=>o.set(e.target.checked)} className="rounded"/>
            {o.label}
          </label>
        ))}
      </div>
      <div className="flex gap-2">
        <code className="flex-1 input font-mono text-sm truncate bg-surface-offset">{password}</code>
        <button className="btn-primary flex items-center gap-1.5 text-sm px-4" onClick={copy}><Copy size={14}/>{copied?(es?"¡Copiado!":"Copied!"):(es?"Copiar":"Copy")}</button>
      </div>
      <button className="mt-2 btn-secondary text-sm w-full" onClick={generate}>{es?"Nueva contraseña":"Regenerate"}</button>
    </ToolInteractive>
  );
}

/* ── Text Tools ──────────────────────────────────────────────────────── */
function TextTool({ language }: { language: Language }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const es = language === "es";

  const apply = (fn: (s:string)=>string) => { setOutput(fn(input)); };
  const copy = () => { copyToClipboard(output); setCopied(true); setTimeout(()=>setCopied(false),2000); };

  const ops = [
    [es?"MAYÚSCULAS":"UPPERCASE", (s:string)=>s.toUpperCase()],
    [es?"minúsculas":"lowercase", (s:string)=>s.toLowerCase()],
    [es?"Título":"Title Case", (s:string)=>s.replace(/\b\w/g,c=>c.toUpperCase())],
    [es?"Oración":"Sentence case", (s:string)=>s.charAt(0).toUpperCase()+s.slice(1).toLowerCase()],
    [es?"Slug (URL)":"Slug (URL)", (s:string)=>s.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")],
    [es?"Invertir":"Reverse", (s:string)=>s.split("").reverse().join("")],
    [es?"Limpiar":"Trim & Clean", (s:string)=>s.replace(/\s+/g," ").trim()],
    [es?"Eliminar líneas vacías":"Remove blank lines", (s:string)=>s.split("\n").filter(l=>l.trim()).join("\n")],
  ] as const;

  return (
    <ToolInteractive>
      <textarea className="input w-full h-28 text-sm resize-y mb-3" placeholder={es?"Pega texto aquí…":"Paste text here…"} value={input} onChange={e=>setInput(e.target.value)}/>
      <div className="flex flex-wrap gap-2 mb-3">
        {ops.map(([label, fn])=>(
          <button key={label as string} className="btn-secondary text-sm px-3" onClick={()=>apply(fn as (s:string)=>string)}>{label}</button>
        ))}
      </div>
      {output&&(
        <div className="relative">
          <textarea readOnly className="input w-full h-28 text-sm resize-y bg-surface-offset" value={output}/>
          <button className="absolute top-2 right-2 p-1 rounded hover:bg-surface-dynamic transition-colors" onClick={copy}><Copy size={14}/>{copied&&<span className="sr-only">Copied</span>}</button>
        </div>
      )}
    </ToolInteractive>
  );
}

/* ── AI Summarizer ───────────────────────────────────────────────────── */
function SummarizerTool() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const summarize = async () => {
    if(!text.trim()) return;
    setLoading(true); setError(""); setSummary("");
    try {
      const res = await fetch("/api/summarize",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({text}) });
      if(!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setSummary(data.summary||"");
    } catch(e:any) { setError(e.message||"Failed to summarize"); }
    finally { setLoading(false); }
  };

  return (
    <ToolInteractive>
      <textarea className="input w-full h-36 resize-y text-sm mb-3" placeholder="Paste any text to summarize…" value={text} onChange={e=>setText(e.target.value)}/>
      <button className="btn-primary flex items-center gap-2 text-sm mb-3" onClick={summarize} disabled={loading||!text.trim()}>
        {loading?<span className="animate-spin">⟳</span>:<Calculator size={16}/>}
        {loading?"Summarizing…":"Summarize"}
      </button>
      {error&&<p className="text-sm text-error mb-2">{error}</p>}
      {summary&&(
        <div className="relative">
          <div className="input bg-surface-offset rounded-lg p-3 text-sm leading-relaxed whitespace-pre-wrap">{summary}</div>
          <button className="absolute top-2 right-2" onClick={()=>copyToClipboard(summary)}><Copy size={14}/></button>
        </div>
      )}
    </ToolInteractive>
  );
}
