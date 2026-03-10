import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const DUMMY_DATASETS = {
  "revenue_by_channel": {
    title: "Revenue by Marketing Channel",
    insight: "Paid Search is driving 34% of total revenue, outperforming all other channels.",
    defaultType: "bar",
    data: [
      { name: "Paid Search", value: 420000 },
      { name: "Social Media", value: 310000 },
      { name: "Email", value: 275000 },
      { name: "Organic", value: 198000 },
      { name: "Referral", value: 142000 },
      { name: "Direct", value: 95000 },
    ],
    xKey: "name", yKey: "value",
  },
  "roi_by_campaign": {
    title: "ROI by Campaign Type",
    insight: "Retargeting campaigns yield 4.2x ROI — 60% higher than brand awareness campaigns.",
    defaultType: "bar",
    data: [
      { name: "Retargeting", value: 4.2 },
      { name: "Prospecting", value: 3.1 },
      { name: "Brand Awareness", value: 2.6 },
      { name: "Email Drip", value: 3.8 },
      { name: "Influencer", value: 2.1 },
    ],
    xKey: "name", yKey: "value",
  },
  "conversions_by_audience": {
    title: "Conversions by Audience Segment",
    insight: "25–34 age group converts at the highest rate, accounting for 38% of total conversions.",
    defaultType: "pie",
    data: [
      { name: "18–24", value: 18400 },
      { name: "25–34", value: 42100 },
      { name: "35–44", value: 31600 },
      { name: "45–54", value: 19800 },
      { name: "55+",   value: 11200 },
    ],
    xKey: "name", yKey: "value",
  },
  "revenue_trend": {
    title: "Revenue Trend Over Time",
    insight: "Revenue grew 28% MoM in Q3, with a peak in August driven by summer campaigns.",
    defaultType: "line",
    data: [
      { name: "Jan", value: 185000 },
      { name: "Feb", value: 204000 },
      { name: "Mar", value: 231000 },
      { name: "Apr", value: 198000 },
      { name: "May", value: 267000 },
      { name: "Jun", value: 312000 },
      { name: "Jul", value: 298000 },
      { name: "Aug", value: 401000 },
      { name: "Sep", value: 374000 },
      { name: "Oct", value: 420000 },
      { name: "Nov", value: 398000 },
      { name: "Dec", value: 445000 },
    ],
    xKey: "name", yKey: "value",
  },
};

const QUERY_MAP = [
  { keywords: ["revenue", "channel"], key: "revenue_by_channel" },
  { keywords: ["roi", "campaign"], key: "roi_by_campaign" },
  { keywords: ["conversion", "audience"], key: "conversions_by_audience" },
  { keywords: ["trend", "time", "month"], key: "revenue_trend" },
];

const EXAMPLE_PROMPTS = [
  "Show revenue by marketing channel",
  "Which campaign type has the highest ROI?",
  "Show conversion trend over time",
  "Which audience generates the most revenue?",
];

const CHART_COLORS = ["#06B6D4","#4F46E5","#8B5CF6","#EC4899","#F59E0B","#10B981"];

function matchQuery(query) {
  const q = query.toLowerCase();
  const matched = [];
  for (const { keywords, key } of QUERY_MAP) {
    if (keywords.some(k => q.includes(k))) matched.push(key);
  }
  return matched.length === 0 ? Object.keys(DUMMY_DATASETS) : [...new Set(matched)];
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"rgba(8,12,24,0.97)", border:"1px solid rgba(6,182,212,0.3)", borderRadius:10, padding:"10px 16px", fontFamily:"monospace", fontSize:12 }}>
      <div style={{ color:"rgba(255,255,255,0.5)", marginBottom:4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color:p.color||"#06B6D4", fontWeight:700 }}>
          {typeof p.value==="number"&&p.value>1000 ? `$${p.value.toLocaleString()}` : typeof p.value==="number"&&p.value<10 ? `${p.value}x` : p.value?.toLocaleString()}
        </div>
      ))}
    </div>
  );
}

function ChartRenderer({ type, data, xKey, yKey, color }) {
  const c = color || "#06B6D4";
  if (type === "bar") return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top:5, right:5, left:-10, bottom:5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
        <XAxis dataKey={xKey} tick={{ fill:"rgba(255,255,255,0.35)", fontSize:10, fontFamily:"monospace" }} axisLine={false} tickLine={false}/>
        <YAxis tick={{ fill:"rgba(255,255,255,0.35)", fontSize:10, fontFamily:"monospace" }} axisLine={false} tickLine={false} tickFormatter={v => v>=1000?`${(v/1000).toFixed(0)}k`:v}/>
        <Tooltip content={<CustomTooltip/>}/>
        <Bar dataKey={yKey} radius={[6,6,0,0]}>
          {data.map((_,i) => <Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]}/>)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
  if (type === "line") return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top:5, right:5, left:-10, bottom:5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
        <XAxis dataKey={xKey} tick={{ fill:"rgba(255,255,255,0.35)", fontSize:10, fontFamily:"monospace" }} axisLine={false} tickLine={false}/>
        <YAxis tick={{ fill:"rgba(255,255,255,0.35)", fontSize:10, fontFamily:"monospace" }} axisLine={false} tickLine={false} tickFormatter={v => v>=1000?`${(v/1000).toFixed(0)}k`:v}/>
        <Tooltip content={<CustomTooltip/>}/>
        <Line type="monotone" dataKey={yKey} stroke={c} strokeWidth={2.5} dot={{ fill:c, strokeWidth:0, r:3 }} activeDot={{ r:5, fill:c, strokeWidth:0 }}/>
      </LineChart>
    </ResponsiveContainer>
  );
  if (type === "pie") return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} dataKey={yKey} nameKey={xKey} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
          {data.map((_,i) => <Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]}/>)}
        </Pie>
        <Tooltip content={<CustomTooltip/>}/>
        <Legend iconType="circle" iconSize={7} formatter={v => <span style={{ color:"rgba(255,255,255,0.45)", fontSize:10, fontFamily:"monospace" }}>{v}</span>}/>
      </PieChart>
    </ResponsiveContainer>
  );
  return null;
}

function ChartCard({ dataset, index }) {
  const [chartType, setChartType] = useState(dataset.defaultType);
  const [hovered, setHovered] = useState(false);
  const color = CHART_COLORS[index % CHART_COLORS.length];
  return (
    <div onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      style={{ background:"rgba(8,12,24,0.85)", border:`1px solid ${hovered?"rgba(6,182,212,0.4)":"rgba(79,70,229,0.2)"}`, borderRadius:20, padding:22, position:"relative", overflow:"hidden", transition:"all 0.35s ease", boxShadow:hovered?"0 24px 60px rgba(6,182,212,0.1)":"0 4px 24px rgba(0,0,0,0.4)", transform:hovered?"translateY(-5px)":"translateY(0)", animation:`cardIn 0.6s cubic-bezier(0.34,1.2,0.64,1) ${index*0.12}s both` }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${color},transparent)`, opacity:hovered?1:0.4, transition:"opacity 0.3s" }}/>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16, gap:10 }}>
        <div>
          <div style={{ fontSize:9, color:color, fontFamily:"monospace", letterSpacing:2.5, textTransform:"uppercase", marginBottom:5 }}>● Live</div>
          <h3 style={{ fontSize:14, fontWeight:700, color:"#fff", lineHeight:1.3 }}>{dataset.title}</h3>
        </div>
        <div style={{ display:"flex", gap:3, flexShrink:0 }}>
          {["bar","line","pie"].map(t => (
            <button key={t} onClick={()=>setChartType(t)} style={{ background:chartType===t?`${color}20`:"rgba(255,255,255,0.03)", border:`1px solid ${chartType===t?color:"rgba(255,255,255,0.08)"}`, borderRadius:7, padding:"3px 9px", color:chartType===t?color:"rgba(255,255,255,0.35)", fontSize:10, cursor:"pointer", fontFamily:"monospace", transition:"all 0.2s" }}>
              {t==="bar"?"▊":t==="line"?"∿":"◉"}
            </button>
          ))}
        </div>
      </div>
      <ChartRenderer type={chartType} data={dataset.data} xKey={dataset.xKey} yKey={dataset.yKey} color={color}/>
      {dataset.insight && (
        <div style={{ marginTop:14, background:`${color}0a`, border:`1px solid ${color}20`, borderRadius:10, padding:"9px 12px", display:"flex", gap:8 }}>
          <span style={{ fontSize:13, flexShrink:0 }}>💡</span>
          <p style={{ fontSize:11, color:"rgba(255,255,255,0.5)", lineHeight:1.6, fontFamily:"monospace" }}>{dataset.insight}</p>
        </div>
      )}
    </div>
  );
}

function Loader() {
  const steps = ["Parsing your query...","Generating SQL...","Fetching data...","Building charts..."];
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s+1)%steps.length), 500);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px 0", gap:24 }}>
      <div style={{ position:"relative", width:64, height:64 }}>
        <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"2px solid rgba(79,70,229,0.12)" }}/>
        <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"2px solid transparent", borderTopColor:"#06B6D4", borderRightColor:"#4F46E5", animation:"spin 1s linear infinite" }}/>
        <div style={{ position:"absolute", inset:10, borderRadius:"50%", border:"2px solid transparent", borderTopColor:"#8B5CF6", animation:"spin 0.65s linear infinite reverse" }}/>
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>⚡</div>
      </div>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:17, fontWeight:700, color:"#fff", marginBottom:8 }}>Generating AI Insights...</div>
        <div style={{ fontSize:12, color:"rgba(6,182,212,0.8)", fontFamily:"monospace" }}>{steps[step]}</div>
      </div>
      <div style={{ display:"flex", gap:7 }}>
        {[0,1,2,3].map(i => <div key={i} style={{ width:6, height:6, borderRadius:"50%", background:"#4F46E5", animation:`bounce 1.4s ease-in-out ${i*0.18}s infinite` }}/>)}
      </div>
    </div>
  );
}

// ── INNOVATIVE EMPTY STATE ──────────────────────────────────────
function EmptyState() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(x => x+1), 1800);
    return () => clearInterval(t);
  }, []);

  const pulseCards = [
    { icon:"📈", label:"Revenue Chart", w:"60%", color:"#06B6D4" },
    { icon:"🎯", label:"ROI Analysis", w:"45%", color:"#4F46E5" },
    { icon:"👥", label:"Audience Split", w:"75%", color:"#8B5CF6" },
    { icon:"📊", label:"Trend Graph", w:"55%", color:"#EC4899" },
    { icon:"💰", label:"Conversions", w:"40%", color:"#F59E0B" },
    { icon:"🚀", label:"Campaign KPIs", w:"65%", color:"#10B981" },
  ];

  return (
    <div style={{ width:"100%", display:"flex", flexDirection:"column", alignItems:"center", padding:"20px 0 60px" }}>

      {/* Section label */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:32 }}>
        <div style={{ height:1, width:60, background:"linear-gradient(90deg,transparent,rgba(79,70,229,0.4))" }}/>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.25)", fontFamily:"monospace", letterSpacing:3, textTransform:"uppercase" }}>Dashboard Preview</span>
        <div style={{ height:1, width:60, background:"linear-gradient(90deg,rgba(79,70,229,0.4),transparent)" }}/>
      </div>

      {/* Ghost dashboard frame */}
      <div style={{ width:"100%", maxWidth:1000, background:"rgba(8,12,24,0.6)", border:"1px dashed rgba(79,70,229,0.25)", borderRadius:24, padding:32, position:"relative", overflow:"hidden" }}>

        {/* Top shimmer line */}
        <div style={{ position:"absolute", top:0, left:"-100%", right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(6,182,212,0.6),transparent)", animation:"scanRight 3s ease-in-out infinite" }}/>

        {/* Center message */}
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:10, background:"rgba(79,70,229,0.08)", border:"1px solid rgba(79,70,229,0.2)", borderRadius:100, padding:"8px 20px", marginBottom:16 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"rgba(6,182,212,0.5)", animation:"blink 2s ease-in-out infinite" }}/>
            <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)", fontFamily:"monospace", letterSpacing:1 }}>Awaiting your query</span>
          </div>
          <h3 style={{ fontSize:22, fontWeight:700, color:"rgba(255,255,255,0.6)", marginBottom:8 }}>
            Your insights will appear here
          </h3>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.25)", fontFamily:"monospace", maxWidth:400, margin:"0 auto", lineHeight:1.7 }}>
            Ask a question above → AI generates SQL → charts render instantly below
          </p>
        </div>

        {/* Ghost KPI row */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
          {["Total Revenue","Avg ROI","Conversions","Query Time"].map((label,i) => (
            <div key={label} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"16px", position:"relative", overflow:"hidden" }}>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.2)", fontFamily:"monospace", letterSpacing:1, marginBottom:8 }}>{label}</div>
              <div style={{ height:20, borderRadius:4, background:"rgba(255,255,255,0.05)", marginBottom:6, width:"70%", animation:`shimmerBar 2s ease-in-out ${i*0.2}s infinite` }}/>
              <div style={{ height:10, borderRadius:4, background:"rgba(255,255,255,0.03)", width:"40%" }}/>
            </div>
          ))}
        </div>

        {/* Ghost chart cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
          {pulseCards.map(({icon,label,w,color},i) => (
            <div key={label} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:16, padding:18, position:"relative", overflow:"hidden" }}>
              {/* Top colored line */}
              <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${color}44,transparent)` }}/>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <span style={{ fontSize:16, opacity:0.4 }}>{icon}</span>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.2)", fontFamily:"monospace" }}>{label}</div>
              </div>
              {/* Ghost bars */}
              <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:60, marginBottom:10 }}>
                {[70,45,85,55,90,65,75].map((h,j) => (
                  <div key={j} style={{ flex:1, borderRadius:"3px 3px 0 0", height:`${h}%`, background:`${color}18`, animation:`ghostBar 2.5s ease-in-out ${(i*0.15)+(j*0.08)}s infinite` }}/>
                ))}
              </div>
              {/* Ghost text lines */}
              <div style={{ height:8, borderRadius:4, background:"rgba(255,255,255,0.04)", width:w, animation:`shimmerBar 2s ease-in-out ${i*0.3}s infinite` }}/>
            </div>
          ))}
        </div>

        {/* Bottom CTA hint */}
        <div style={{ textAlign:"center", marginTop:28 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, fontSize:12, color:"rgba(255,255,255,0.2)", fontFamily:"monospace" }}>
            <span style={{ animation:`arrowBounce 1.5s ease-in-out infinite`, display:"inline-block" }}>↑</span>
            Type a question above to bring this dashboard to life
            <span style={{ animation:`arrowBounce 1.5s ease-in-out infinite 0.3s`, display:"inline-block" }}>↑</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Navbar({ onHome }) {
  return (
    <nav style={{ position:"sticky", top:0, zIndex:100, background:"rgba(5,8,15,0.9)", backdropFilter:"blur(24px)", borderBottom:"1px solid rgba(79,70,229,0.12)" }}>
      <div style={{ maxWidth:1280, margin:"0 auto", height:62, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 48px" }}>
        <div onClick={onHome} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
          <div style={{ width:33, height:33, borderRadius:9, background:"linear-gradient(135deg,#4F46E5,#06B6D4)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:15, color:"#fff", boxShadow:"0 0 18px rgba(79,70,229,0.5)" }}>A</div>
          <div>
            <div style={{ fontWeight:800, fontSize:18, background:"linear-gradient(135deg,#fff,#06B6D4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>AskBI</div>
            <div style={{ fontSize:8, color:"rgba(6,182,212,0.55)", fontFamily:"monospace", letterSpacing:2.5, marginTop:-2 }}>CONVERSATIONAL BI</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.25)", borderRadius:100, padding:"5px 13px" }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 6px #22c55e" }}/>
            <span style={{ fontSize:11, color:"rgba(34,197,94,0.8)", fontFamily:"monospace" }}>AI Ready</span>
          </div>
          <div style={{ height:18, width:1, background:"rgba(255,255,255,0.08)" }}/>
          {["About","Features","Contact"].map(l => (
            <a key={l} href="#" style={{ color:"rgba(255,255,255,0.45)", textDecoration:"none", fontSize:13, transition:"color 0.2s" }}
              onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.45)"}>
              {l}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default function DashboardPage({ onHome }) {
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [inputVal, setInputVal] = useState("");
  const [focused, setFocused] = useState(false);
  const resultsRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSubmit = async (q) => {
    if (!q.trim() || loading) return;
    setCurrentQuery(q.trim());
    setLoading(true);
    setCharts([]);
    setHasResults(false);
    await new Promise(r => setTimeout(r, 2000));
    setCharts(matchQuery(q));
    setLoading(false);
    setHasResults(true);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 100);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { background:#05080f; }
        body { background:#05080f; font-family:'Sora',sans-serif; overflow-x:hidden; margin:0; }

        @keyframes fadeUp    { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cardIn    { from{opacity:0;transform:translateY(30px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes bounce    { 0%,80%,100%{transform:scale(0.3);opacity:.4} 40%{transform:scale(1);opacity:1} }
        @keyframes shimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes drift1    { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,-20px)} }
        @keyframes drift2    { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-25px,30px)} }
        @keyframes drift3    { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,15px)} }
        @keyframes scanRight { 0%{left:-100%} 100%{left:200%} }
        @keyframes shimmerBar{ 0%,100%{opacity:0.5} 50%{opacity:1} }
        @keyframes ghostBar  { 0%,100%{opacity:0.3} 50%{opacity:0.7} }
        @keyframes arrowBounce{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }

        .grad-text {
          background:linear-gradient(135deg,#fff 0%,#06B6D4 40%,#4F46E5 80%,#8B5CF6 100%);
          background-size:250% auto; -webkit-background-clip:text;
          -webkit-text-fill-color:transparent; background-clip:text;
          animation:shimmer 4s linear infinite;
        }
        textarea::placeholder { color:rgba(255,255,255,0.22) !important; }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:#05080f} ::-webkit-scrollbar-thumb{background:rgba(79,70,229,0.5);border-radius:2px}
      `}</style>

      <div style={{ minHeight:"100vh", background:"#05080f", color:"#fff", fontFamily:"'Sora',sans-serif", overflowX:"hidden" }}>

        {/* ── FIXED BACKGROUND ── */}
        <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }}>
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }}>
            <defs>
              <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.8" fill="rgba(79,70,229,0.18)"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)"/>
          </svg>
          <div style={{ position:"absolute", top:"5%",  left:"10%",  width:480, height:480, borderRadius:"50%", background:"radial-gradient(circle,rgba(79,70,229,0.11) 0%,transparent 70%)", animation:"drift1 20s ease-in-out infinite" }}/>
          <div style={{ position:"absolute", top:"50%", right:"8%",  width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(6,182,212,0.08) 0%,transparent 70%)", animation:"drift2 24s ease-in-out infinite" }}/>
          <div style={{ position:"absolute", bottom:"8%", left:"30%", width:360, height:360, borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,0.08) 0%,transparent 70%)", animation:"drift3 16s ease-in-out infinite" }}/>
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at center,transparent 30%,rgba(5,8,15,0.65) 100%)" }}/>
          <div style={{ position:"absolute", inset:0, background:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.012) 3px,rgba(0,0,0,0.012) 4px)" }}/>
        </div>

        {/* ── CONTENT LAYER ── */}
        <div style={{ position:"relative", zIndex:1 }}>
          <Navbar onHome={onHome}/>

          {/* ══════════════════════════════════════════
              HERO  —  fully centered, no left drift
          ══════════════════════════════════════════ */}
          <div style={{
            /* THIS is the key fix: full width, flex column, center everything */
            width:"100%",
            display:"flex",
            flexDirection:"column",
            alignItems:"center",       /* horizontal center */
            textAlign:"center",
            padding:"68px 24px 48px",
          }}>

            {/* Badge */}
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(79,70,229,0.1)", border:"1px solid rgba(79,70,229,0.28)", borderRadius:100, padding:"5px 16px 5px 8px", marginBottom:22, animation:"fadeUp .5s ease .05s both" }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#06B6D4", boxShadow:"0 0 8px #06B6D4", animation:"blink 2s ease-in-out infinite" }}/>
              <span style={{ fontSize:11, color:"rgba(6,182,212,0.8)", fontFamily:"monospace", letterSpacing:2.5, textTransform:"uppercase" }}>AI Dashboard Generator</span>
            </div>

            {/* Headline */}
            <h1 style={{ fontSize:"clamp(30px,5vw,56px)", fontWeight:800, lineHeight:1.1, marginBottom:14, animation:"fadeUp .5s ease .1s both", maxWidth:660 }}>
              What do you want to{" "}
              <span className="grad-text">explore?</span>
            </h1>

            <p style={{ fontSize:15, color:"rgba(255,255,255,0.38)", maxWidth:440, lineHeight:1.8, marginBottom:36, animation:"fadeUp .5s ease .15s both" }}>
              Ask any marketing question in plain English and get instant interactive dashboards powered by AI.
            </p>

            {/* ── QUERY INPUT — centered block ── */}
            <div style={{ width:"100%", maxWidth:740, animation:"fadeUp .5s ease .2s both" }}>
              <div style={{ background:"rgba(8,12,24,0.92)", borderRadius:18, border:`1.5px solid ${focused?"rgba(6,182,212,0.65)":"rgba(79,70,229,0.38)"}`, padding:"18px 20px", boxShadow:focused?"0 0 60px rgba(6,182,212,0.14), inset 0 0 20px rgba(79,70,229,0.04)":"0 8px 50px rgba(0,0,0,0.5)", transition:"all 0.3s", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${focused?"rgba(6,182,212,0.7)":"rgba(79,70,229,0.45)"},transparent)`, transition:"all 0.3s" }}/>

                {/* Input row */}
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#4F46E5,#06B6D4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0, boxShadow:"0 0 16px rgba(79,70,229,0.5)" }}>✦</div>
                  <input
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onKeyDown={e => e.key==="Enter" && handleSubmit(inputVal)}
                    placeholder="Ask your marketing question (e.g. Show revenue by channel)"
                    style={{ flex:1, background:"transparent", border:"none", outline:"none", color:"#fff", fontSize:15, fontFamily:"'Sora',sans-serif", caretColor:"#06B6D4" }}
                  />
                  <button onClick={() => handleSubmit(inputVal)} disabled={!inputVal.trim()||loading}
                    style={{ background:inputVal.trim()&&!loading?"linear-gradient(135deg,#4F46E5,#06B6D4)":"rgba(255,255,255,0.05)", border:`1px solid ${inputVal.trim()&&!loading?"transparent":"rgba(255,255,255,0.08)"}`, borderRadius:11, padding:"10px 22px", color:inputVal.trim()&&!loading?"#fff":"rgba(255,255,255,0.25)", fontSize:14, fontWeight:700, cursor:inputVal.trim()&&!loading?"pointer":"not-allowed", fontFamily:"'Sora',sans-serif", transition:"all 0.3s", flexShrink:0, boxShadow:inputVal.trim()&&!loading?"0 4px 20px rgba(79,70,229,0.45)":"none", whiteSpace:"nowrap" }}
                    onMouseEnter={e=>{if(inputVal.trim()&&!loading){e.currentTarget.style.transform="scale(1.04)";e.currentTarget.style.boxShadow="0 6px 28px rgba(79,70,229,0.65)";}}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow=inputVal.trim()&&!loading?"0 4px 20px rgba(79,70,229,0.45)":"none";}}>
                    {loading?"Analyzing...":"Generate Insights →"}
                  </button>
                </div>

                {/* Example chips */}
                <div style={{ marginTop:14, paddingTop:12, borderTop:"1px solid rgba(255,255,255,0.05)", display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", justifyContent:"center" }}>
                  <span style={{ fontSize:10, color:"rgba(255,255,255,0.22)", fontFamily:"monospace", flexShrink:0 }}>Try:</span>
                  {EXAMPLE_PROMPTS.map(p => (
                    <span key={p} onClick={() => setInputVal(p)}
                      style={{ fontSize:11, color:"rgba(6,182,212,0.55)", fontFamily:"monospace", cursor:"pointer", padding:"3px 10px", background:"rgba(6,182,212,0.05)", borderRadius:7, border:"1px solid rgba(6,182,212,0.12)", transition:"all 0.2s", whiteSpace:"nowrap" }}
                      onMouseEnter={e=>{e.currentTarget.style.background="rgba(6,182,212,0.12)";e.currentTarget.style.color="#06B6D4";}}
                      onMouseLeave={e=>{e.currentTarget.style.background="rgba(6,182,212,0.05)";e.currentTarget.style.color="rgba(6,182,212,0.55)";}}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── RESULTS / EMPTY STATE ── */}
          <div ref={resultsRef} style={{ width:"100%", maxWidth:1280, margin:"0 auto", padding:"0 48px 100px" }}>

            {loading && <Loader/>}

            {!loading && hasResults && (
              <div style={{ animation:"fadeUp .5s ease" }}>
                {/* Results header */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, paddingBottom:16, borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                  <div>
                    <div style={{ fontSize:10, color:"rgba(6,182,212,0.7)", fontFamily:"monospace", letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>Results for</div>
                    <div style={{ fontSize:16, fontWeight:600, color:"#fff", display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ color:"rgba(139,92,246,0.8)", fontFamily:"monospace" }}>›</span>
                      "{currentQuery}"
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.3)", fontFamily:"monospace" }}>{charts.length} chart{charts.length!==1?"s":""} generated</div>
                    <div style={{ background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.25)", borderRadius:100, padding:"4px 12px", fontSize:11, color:"#22c55e", fontFamily:"monospace" }}>✓ Complete</div>
                  </div>
                </div>

                {/* KPI Strip */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:26 }}>
                  {[
                    {label:"Total Revenue",value:"$1.44M",delta:"+18.2%",c:"#06B6D4"},
                    {label:"Avg ROI",value:"3.2x",delta:"+0.4x",c:"#4F46E5"},
                    {label:"Conversions",value:"123.1K",delta:"+12.4%",c:"#8B5CF6"},
                    {label:"Query Time",value:"0.18s",delta:"AI-powered",c:"#F59E0B"},
                  ].map(({label,value,delta,c},i) => (
                    <div key={label} style={{ background:"rgba(8,12,24,0.8)", border:`1px solid ${c}22`, borderRadius:16, padding:"16px 18px", animation:`fadeUp 0.5s ease ${i*0.08}s both`, position:"relative", overflow:"hidden" }}>
                      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${c}88,transparent)` }}/>
                      <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", fontFamily:"monospace", marginBottom:8, letterSpacing:1 }}>{label}</div>
                      <div style={{ fontSize:24, fontWeight:800, color:"#fff", marginBottom:4 }}>{value}</div>
                      <div style={{ fontSize:11, color:c, fontFamily:"monospace" }}>↑ {delta}</div>
                    </div>
                  ))}
                </div>

                {/* Charts Grid */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:20 }}>
                  {charts.map((key,i) => <ChartCard key={key} dataset={DUMMY_DATASETS[key]} index={i}/>)}
                </div>
              </div>
            )}

            {!loading && !hasResults && <EmptyState/>}
          </div>
        </div>
      </div>
    </>
  );
}