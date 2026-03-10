import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LabelList
} from "recharts";

const API_URL = "http://127.0.0.1:8000";

const EXAMPLE_PROMPTS = [
  "Show total revenue by campaign type",
  "Which campaign type has the highest average ROI?",
  "Show total conversions by target audience",
  "Show total revenue by language",
];

const CHART_COLORS = ["#06B6D4","#4F46E5","#8B5CF6","#EC4899","#F59E0B","#10B981","#3B82F6","#F97316"];

// ── Format numbers nicely ─────────────────────────────────────────
function fmt(v) {
  if (typeof v !== "number") return v;
  if (Math.abs(v) >= 1_000_000) return `${(v/1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000)     return `${(v/1_000).toFixed(1)}K`;
  if (Math.abs(v) < 10)         return v.toFixed(2);
  return v.toLocaleString();
}

// ── Custom Tooltip ────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background:"rgba(8,12,24,0.97)",
      border:"1px solid rgba(6,182,212,0.35)",
      borderRadius:12, padding:"12px 18px",
      fontFamily:"monospace", fontSize:13,
      boxShadow:"0 8px 32px rgba(0,0,0,0.6)"
    }}>
      <div style={{ color:"rgba(255,255,255,0.55)", marginBottom:6, fontSize:11 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.fill || p.stroke || "#06B6D4", fontWeight:700, fontSize:15 }}>
          {fmt(p.value)}
        </div>
      ))}
    </div>
  );
}

// ── Smart tick — truncate long labels ─────────────────────────────
function SmartTick({ x, y, payload, maxLen = 14 }) {
  const label = String(payload.value);
  const display = label.length > maxLen ? label.slice(0, maxLen) + "…" : label;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0} y={0} dy={12}
        textAnchor="middle"
        fill="rgba(255,255,255,0.45)"
        fontSize={11}
        fontFamily="monospace"
      >
        {display}
      </text>
    </g>
  );
}

// ── Chart Renderer ────────────────────────────────────────────────
function ChartRenderer({ type, data, xKey, yKey, color }) {
  const c = color || "#06B6D4";
  const isSmall = data.length <= 8;
  const chartH = data.length > 20 ? 420 : data.length > 10 ? 360 : 300;
  const bottomMargin = data.length > 6 ? 70 : 30;

  if (type === "bar") return (
    <ResponsiveContainer width="100%" height={chartH}>
      <BarChart
        data={data}
        margin={{ top:20, right:30, left:10, bottom:bottomMargin }}
        barCategoryGap={data.length > 15 ? "15%" : "28%"}
      >
        <defs>
          {CHART_COLORS.map((col, i) => (
            <linearGradient key={i} id={`barGrad${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={col} stopOpacity={0.95}/>
              <stop offset="100%" stopColor={col} stopOpacity={0.4}/>
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
        <XAxis
          dataKey={xKey}
          tick={<SmartTick maxLen={data.length > 10 ? 10 : 16}/>}
          axisLine={{ stroke:"rgba(255,255,255,0.08)" }}
          tickLine={false}
          interval={0}
          angle={data.length > 6 ? -30 : 0}
          textAnchor={data.length > 6 ? "end" : "middle"}
        />
        <YAxis
          tickFormatter={fmt}
          tick={{ fill:"rgba(255,255,255,0.35)", fontSize:11, fontFamily:"monospace" }}
          axisLine={false} tickLine={false} width={65}
        />
        <Tooltip content={<CustomTooltip/>} cursor={{ fill:"rgba(255,255,255,0.03)" }}/>
        <Bar dataKey={yKey} radius={[8,8,0,0]} maxBarSize={72}>
          {data.map((_, i) => (
            <Cell key={i} fill={`url(#barGrad${i % CHART_COLORS.length})`}/>
          ))}
          {isSmall && (
            <LabelList
              dataKey={yKey}
              position="top"
              formatter={fmt}
              style={{ fill:"rgba(255,255,255,0.5)", fontSize:10, fontFamily:"monospace" }}
            />
          )}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  if (type === "line") return (
    <ResponsiveContainer width="100%" height={chartH}>
      <LineChart data={data} margin={{ top:20, right:30, left:10, bottom:bottomMargin }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
        <XAxis
          dataKey={xKey}
          tick={<SmartTick/>}
          axisLine={{ stroke:"rgba(255,255,255,0.08)" }}
          tickLine={false} interval={0}
          angle={data.length > 6 ? -30 : 0}
          textAnchor={data.length > 6 ? "end" : "middle"}
        />
        <YAxis
          tickFormatter={fmt}
          tick={{ fill:"rgba(255,255,255,0.35)", fontSize:11, fontFamily:"monospace" }}
          axisLine={false} tickLine={false} width={65}
        />
        <Tooltip content={<CustomTooltip/>} cursor={{ stroke:c, strokeWidth:1, strokeDasharray:"4 4" }}/>
        <Line
          type="monotone" dataKey={yKey}
          stroke={c} strokeWidth={3}
          dot={{ fill:c, strokeWidth:0, r:4 }}
          activeDot={{ r:7, fill:c, stroke:"rgba(255,255,255,0.3)", strokeWidth:2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  if (type === "pie") {
    const RADIAN = Math.PI / 180;
    const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percent }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
      if (percent < 0.04) return null;
      return (
        <text x={x} y={y} fill="rgba(255,255,255,0.65)"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central" fontSize={11} fontFamily="monospace">
          {`${name} ${(percent*100).toFixed(1)}%`}
        </text>
      );
    };
    return (
      <ResponsiveContainer width="100%" height={360}>
        <PieChart>
          <defs>
            {CHART_COLORS.map((col, i) => (
              <radialGradient key={i} id={`pieGrad${i}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor={col} stopOpacity={1}/>
                <stop offset="100%" stopColor={col} stopOpacity={0.65}/>
              </radialGradient>
            ))}
          </defs>
          <Pie
            data={data} dataKey={yKey} nameKey={xKey}
            cx="50%" cy="50%"
            innerRadius="35%" outerRadius="60%"
            paddingAngle={3}
            labelLine={false} label={renderLabel}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={`url(#pieGrad${i % CHART_COLORS.length})`}
                stroke="rgba(0,0,0,0.3)" strokeWidth={2}/>
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip/>}/>
          <Legend
            iconType="circle" iconSize={8}
            formatter={v => <span style={{ color:"rgba(255,255,255,0.55)", fontSize:11, fontFamily:"monospace" }}>{v}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return null;
}

// ── Chart Card ────────────────────────────────────────────────────
function ChartCard({ dataset, index }) {
  const [chartType, setChartType] = useState(dataset.defaultType || "bar");
  const [hovered,   setHovered]   = useState(false);
  const [showSQL,   setShowSQL]   = useState(false);
  const color = CHART_COLORS[index % CHART_COLORS.length];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:"rgba(8,12,24,0.9)",
        border:`1px solid ${hovered ? "rgba(6,182,212,0.45)" : "rgba(79,70,229,0.2)"}`,
        borderRadius:22, padding:"28px 32px",
        position:"relative", overflow:"hidden",
        transition:"all 0.35s ease",
        boxShadow: hovered
          ? "0 28px 70px rgba(6,182,212,0.12), 0 0 0 1px rgba(6,182,212,0.08)"
          : "0 4px 30px rgba(0,0,0,0.5)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        animation:`cardIn 0.6s cubic-bezier(0.34,1.2,0.64,1) ${index*0.1}s both`
      }}
    >
      {/* Top glow line */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2,
        background:`linear-gradient(90deg,transparent,${color},transparent)`,
        opacity: hovered ? 1 : 0.55, transition:"opacity 0.3s" }}/>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24, gap:14 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:9, color:color, fontFamily:"monospace", letterSpacing:3,
            textTransform:"uppercase", marginBottom:7, display:"flex", alignItems:"center", gap:7 }}>
            <span style={{ display:"inline-block", width:7, height:7, borderRadius:"50%",
              background:color, boxShadow:`0 0 7px ${color}` }}/>
            Live Data
          </div>
          <h3 style={{ fontSize:17, fontWeight:700, color:"#fff", lineHeight:1.35 }}>
            {dataset.title}
          </h3>
          {dataset.rowCount !== undefined && (
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.22)", fontFamily:"monospace", marginTop:5 }}>
              {dataset.rowCount} rows returned
            </div>
          )}
        </div>

        {/* Chart type switcher */}
        <div style={{ display:"flex", gap:5, flexShrink:0 }}>
          {[{ t:"bar", icon:"▊" },{ t:"line", icon:"∿" },{ t:"pie", icon:"◉" }].map(({ t, icon }) => (
            <button key={t} onClick={() => setChartType(t)} style={{
              background: chartType===t ? `${color}22` : "rgba(255,255,255,0.03)",
              border:`1px solid ${chartType===t ? color : "rgba(255,255,255,0.1)"}`,
              borderRadius:9, padding:"6px 13px",
              color: chartType===t ? color : "rgba(255,255,255,0.3)",
              fontSize:13, cursor:"pointer", fontFamily:"monospace", transition:"all 0.2s"
            }}>{icon}</button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ChartRenderer type={chartType} data={dataset.data} xKey={dataset.xKey} yKey={dataset.yKey} color={color}/>

      {/* SQL toggle */}
      {dataset.sql && (
        <div style={{ marginTop:18 }}>
          <button onClick={() => setShowSQL(s => !s)} style={{
            background:"transparent", border:"none", padding:0,
            color:"rgba(79,70,229,0.55)", fontSize:11, fontFamily:"monospace",
            cursor:"pointer", display:"flex", alignItems:"center", gap:7, transition:"color 0.2s"
          }}
            onMouseEnter={e => e.currentTarget.style.color="#4F46E5"}
            onMouseLeave={e => e.currentTarget.style.color="rgba(79,70,229,0.55)"}
          >
            🗄 {showSQL ? "Hide SQL ▲" : "Show SQL ▼"}
          </button>
          {showSQL && (
            <div style={{
              marginTop:10, background:"rgba(0,0,0,0.45)",
              border:"1px solid rgba(79,70,229,0.22)",
              borderRadius:11, padding:"12px 16px",
              fontFamily:"monospace", fontSize:12,
              color:"rgba(255,255,255,0.5)", lineHeight:1.8, wordBreak:"break-all"
            }}>
              {dataset.sql}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Loader ────────────────────────────────────────────────────────
function Loader() {
  const steps = ["Parsing your query...","Generating SQL...","Querying database...","Building charts..."];
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s+1) % steps.length), 700);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"90px 0", gap:28 }}>
      <div style={{ position:"relative", width:76, height:76 }}>
        <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"2px solid rgba(79,70,229,0.12)" }}/>
        <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"2.5px solid transparent",
          borderTopColor:"#06B6D4", borderRightColor:"#4F46E5", animation:"spin 1s linear infinite" }}/>
        <div style={{ position:"absolute", inset:11, borderRadius:"50%", border:"2px solid transparent",
          borderTopColor:"#8B5CF6", animation:"spin 0.65s linear infinite reverse" }}/>
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:24 }}>⚡</div>
      </div>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:18, fontWeight:700, color:"#fff", marginBottom:10 }}>Generating AI Insights...</div>
        <div style={{ fontSize:13, color:"rgba(6,182,212,0.8)", fontFamily:"monospace" }}>{steps[step]}</div>
      </div>
      <div style={{ display:"flex", gap:8 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:"#4F46E5",
            animation:`bounce 1.4s ease-in-out ${i*0.18}s infinite` }}/>
        ))}
      </div>
    </div>
  );
}

// ── Error Banner ──────────────────────────────────────────────────
function ErrorBanner({ message, onDismiss }) {
  return (
    <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.3)",
      borderRadius:14, padding:"16px 22px", marginBottom:28,
      display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <span style={{ fontSize:20 }}>⚠️</span>
        <p style={{ fontSize:13, color:"rgba(255,120,120,0.9)", fontFamily:"monospace" }}>{message}</p>
      </div>
      <button onClick={onDismiss} style={{ background:"transparent", border:"none",
        color:"rgba(255,255,255,0.3)", fontSize:20, cursor:"pointer" }}>✕</button>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────
function EmptyState() {
  const cards = [
    { icon:"📈", label:"Revenue Chart",  color:"#06B6D4" },
    { icon:"🎯", label:"ROI Analysis",   color:"#4F46E5" },
    { icon:"👥", label:"Audience Split", color:"#8B5CF6" },
    { icon:"📊", label:"Trend Graph",    color:"#EC4899" },
    { icon:"💰", label:"Conversions",    color:"#F59E0B" },
    { icon:"🚀", label:"Campaign KPIs",  color:"#10B981" },
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"20px 0 80px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:36 }}>
        <div style={{ height:1, width:80, background:"linear-gradient(90deg,transparent,rgba(79,70,229,0.4))" }}/>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.22)", fontFamily:"monospace",
          letterSpacing:3, textTransform:"uppercase" }}>Dashboard Preview</span>
        <div style={{ height:1, width:80, background:"linear-gradient(90deg,rgba(79,70,229,0.4),transparent)" }}/>
      </div>
      <div style={{ width:"100%", maxWidth:1100, background:"rgba(8,12,24,0.6)",
        border:"1px dashed rgba(79,70,229,0.2)", borderRadius:24, padding:36,
        position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:"-100%", height:1, width:"100%",
          background:"linear-gradient(90deg,transparent,rgba(6,182,212,0.5),transparent)",
          animation:"scanRight 3s ease-in-out infinite" }}/>
        <div style={{ textAlign:"center", marginBottom:44 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:10,
            background:"rgba(79,70,229,0.08)", border:"1px solid rgba(79,70,229,0.2)",
            borderRadius:100, padding:"8px 22px", marginBottom:18 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"rgba(6,182,212,0.5)",
              animation:"blink 2s ease-in-out infinite" }}/>
            <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)", fontFamily:"monospace", letterSpacing:1 }}>Awaiting your query</span>
          </div>
          <h3 style={{ fontSize:24, fontWeight:700, color:"rgba(255,255,255,0.55)", marginBottom:10 }}>
            Your insights will appear here
          </h3>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.22)", fontFamily:"monospace",
            maxWidth:420, margin:"0 auto", lineHeight:1.8 }}>
            Ask a question above → AI generates SQL → live charts render below
          </p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:28 }}>
          {["Total Revenue","Avg ROI","Conversions","Query Time"].map((label, i) => (
            <div key={label} style={{ background:"rgba(255,255,255,0.02)",
              border:"1px solid rgba(255,255,255,0.05)", borderRadius:14, padding:16 }}>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.2)", fontFamily:"monospace",
                letterSpacing:1, marginBottom:10 }}>{label}</div>
              <div style={{ height:22, borderRadius:5, background:"rgba(255,255,255,0.05)",
                marginBottom:8, width:"70%", animation:`shimmerBar 2s ease-in-out ${i*0.2}s infinite` }}/>
              <div style={{ height:10, borderRadius:4, background:"rgba(255,255,255,0.03)", width:"40%" }}/>
            </div>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }}>
          {cards.map(({ icon, label, color }, i) => (
            <div key={label} style={{ background:"rgba(255,255,255,0.02)",
              border:"1px solid rgba(255,255,255,0.05)", borderRadius:16, padding:20,
              position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:1,
                background:`linear-gradient(90deg,transparent,${color}44,transparent)` }}/>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                <span style={{ fontSize:18, opacity:0.4 }}>{icon}</span>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.2)", fontFamily:"monospace" }}>{label}</div>
              </div>
              <div style={{ display:"flex", alignItems:"flex-end", gap:5, height:70, marginBottom:12 }}>
                {[55,80,40,90,65,75,50].map((h, j) => (
                  <div key={j} style={{ flex:1, borderRadius:"3px 3px 0 0", height:`${h}%`,
                    background:`${color}20`,
                    animation:`ghostBar 2.5s ease-in-out ${(i*0.15)+(j*0.08)}s infinite` }}/>
                ))}
              </div>
              <div style={{ height:8, borderRadius:4, background:"rgba(255,255,255,0.04)", width:"60%",
                animation:`shimmerBar 2s ease-in-out ${i*0.3}s infinite` }}/>
            </div>
          ))}
        </div>
        <div style={{ textAlign:"center", marginTop:32 }}>
          <span style={{ fontSize:12, color:"rgba(255,255,255,0.18)", fontFamily:"monospace" }}>
            <span style={{ animation:"arrowBounce 1.5s ease-in-out infinite", display:"inline-block", marginRight:8 }}>↑</span>
            Type a question above to bring this dashboard to life
            <span style={{ animation:"arrowBounce 1.5s ease-in-out infinite 0.3s", display:"inline-block", marginLeft:8 }}>↑</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────
function Navbar({ onHome }) {
  return (
    <nav style={{ position:"sticky", top:0, zIndex:100,
      background:"rgba(5,8,15,0.92)", backdropFilter:"blur(28px)",
      borderBottom:"1px solid rgba(79,70,229,0.12)" }}>
      <div style={{ maxWidth:1400, margin:"0 auto", height:64,
        display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 48px" }}>
        <div onClick={onHome} style={{ display:"flex", alignItems:"center", gap:11, cursor:"pointer" }}>
          <div style={{ width:35, height:35, borderRadius:10,
            background:"linear-gradient(135deg,#4F46E5,#06B6D4)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontWeight:900, fontSize:16, color:"#fff", boxShadow:"0 0 20px rgba(79,70,229,0.55)" }}>A</div>
          <div>
            <div style={{ fontWeight:800, fontSize:19,
              background:"linear-gradient(135deg,#fff,#06B6D4)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>AskBI</div>
            <div style={{ fontSize:8, color:"rgba(6,182,212,0.5)", fontFamily:"monospace",
              letterSpacing:2.5, marginTop:-2 }}>CONVERSATIONAL BI</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:18 }}>
          <div style={{ display:"flex", alignItems:"center", gap:7,
            background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.25)",
            borderRadius:100, padding:"5px 14px" }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 8px #22c55e" }}/>
            <span style={{ fontSize:11, color:"rgba(34,197,94,0.8)", fontFamily:"monospace" }}>AI Ready</span>
          </div>
          <div style={{ height:18, width:1, background:"rgba(255,255,255,0.08)" }}/>
          {["About","Features","Contact"].map(l => (
            <a key={l} href="#" style={{ color:"rgba(255,255,255,0.4)", textDecoration:"none", fontSize:13 }}
              onMouseEnter={e => e.target.style.color="#fff"}
              onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.4)"}>
              {l}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────
export default function DashboardPage({ onHome }) {
  const [charts,       setCharts]       = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [hasResults,   setHasResults]   = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [inputVal,     setInputVal]     = useState("");
  const [focused,      setFocused]      = useState(false);
  const [error,        setError]        = useState(null);
  const [kpis,         setKpis]         = useState(null);
  const resultsRef = useRef(null);

  const handleSubmit = async (q) => {
    if (!q.trim() || loading) return;
    const query = q.trim();
    setCurrentQuery(query);
    setLoading(true);
    setCharts([]);
    setHasResults(false);
    setError(null);
    setKpis(null);

    try {
      const t0 = Date.now();
      const res = await fetch(`${API_URL}/generate-dashboard`, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ prompt: query }),
      });
      const result = await res.json();
      const elapsed = ((Date.now() - t0) / 1000).toFixed(2);

      if (!res.ok) {
        setError(result.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      const chartObj = {
        title:       result.title || query,
        data:        result.data  || [],
        defaultType: result.chart_type || "bar",
        xKey:        result.x_axis,
        yKey:        result.y_axis,
        sql:         result.sql_generated,
        rowCount:    result.row_count,
      };

      const nums  = (result.data || []).map(r => r[result.y_axis]).filter(v => typeof v === "number");
      const total = nums.reduce((a,b) => a+b, 0);
      const avg   = nums.length ? total / nums.length : 0;
      const peak  = nums.length ? Math.max(...nums) : 0;

      setKpis([
        { label:"Total",      value:fmt(total),    c:"#06B6D4" },
        { label:"Average",    value:fmt(avg),      c:"#4F46E5" },
        { label:"Peak",       value:fmt(peak),     c:"#8B5CF6" },
        { label:"Query Time", value:`${elapsed}s`, c:"#F59E0B" },
      ]);

      setCharts([chartObj]);
      setHasResults(true);

    } catch {
      setError("Cannot connect to backend. Is it running on http://127.0.0.1:8000?");
    } finally {
      setLoading(false);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 150);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html, body { background:#05080f; font-family:'Sora',sans-serif; overflow-x:hidden; margin:0; }

        @keyframes fadeUp      { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cardIn      { from{opacity:0;transform:translateY(28px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes spin        { to{transform:rotate(360deg)} }
        @keyframes bounce      { 0%,80%,100%{transform:scale(0.3);opacity:.3} 40%{transform:scale(1);opacity:1} }
        @keyframes shimmer     { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes blink       { 0%,100%{opacity:1} 50%{opacity:0.25} }
        @keyframes drift1      { 0%,100%{transform:translate(0,0)} 50%{transform:translate(28px,-18px)} }
        @keyframes drift2      { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-22px,28px)} }
        @keyframes drift3      { 0%,100%{transform:translate(0,0)} 50%{transform:translate(18px,14px)} }
        @keyframes scanRight   { 0%{left:-100%} 100%{left:200%} }
        @keyframes shimmerBar  { 0%,100%{opacity:0.45} 50%{opacity:0.9} }
        @keyframes ghostBar    { 0%,100%{opacity:0.25} 50%{opacity:0.65} }
        @keyframes arrowBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }

        .grad-text {
          background:linear-gradient(135deg,#fff 0%,#06B6D4 40%,#4F46E5 80%,#8B5CF6 100%);
          background-size:250% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          animation:shimmer 4s linear infinite;
        }
        input::placeholder { color:rgba(255,255,255,0.2) !important; }
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#05080f}
        ::-webkit-scrollbar-thumb{background:rgba(79,70,229,0.45);border-radius:3px}
      `}</style>

      <div style={{ minHeight:"100vh", background:"#05080f", color:"#fff", overflowX:"hidden" }}>

        {/* Background */}
        <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }}>
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }}>
            <defs>
              <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.8" fill="rgba(79,70,229,0.16)"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)"/>
          </svg>
          <div style={{ position:"absolute", top:"5%", left:"10%", width:500, height:500, borderRadius:"50%",
            background:"radial-gradient(circle,rgba(79,70,229,0.1) 0%,transparent 70%)", animation:"drift1 20s ease-in-out infinite" }}/>
          <div style={{ position:"absolute", top:"50%", right:"8%", width:420, height:420, borderRadius:"50%",
            background:"radial-gradient(circle,rgba(6,182,212,0.07) 0%,transparent 70%)", animation:"drift2 24s ease-in-out infinite" }}/>
          <div style={{ position:"absolute", bottom:"8%", left:"30%", width:380, height:380, borderRadius:"50%",
            background:"radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 70%)", animation:"drift3 16s ease-in-out infinite" }}/>
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at center,transparent 30%,rgba(5,8,15,0.7) 100%)" }}/>
        </div>

        <div style={{ position:"relative", zIndex:1 }}>
          <Navbar onHome={onHome}/>

          {/* Hero */}
          <div style={{ width:"100%", display:"flex", flexDirection:"column",
            alignItems:"center", textAlign:"center", padding:"70px 24px 50px" }}>

            <div style={{ display:"inline-flex", alignItems:"center", gap:8,
              background:"rgba(79,70,229,0.1)", border:"1px solid rgba(79,70,229,0.28)",
              borderRadius:100, padding:"5px 18px 5px 10px", marginBottom:24,
              animation:"fadeUp .5s ease .05s both" }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:"#06B6D4",
                boxShadow:"0 0 8px #06B6D4", animation:"blink 2s ease-in-out infinite" }}/>
              <span style={{ fontSize:11, color:"rgba(6,182,212,0.8)", fontFamily:"monospace",
                letterSpacing:2.5, textTransform:"uppercase" }}>AI Dashboard Generator</span>
            </div>

            <h1 style={{ fontSize:"clamp(30px,5vw,58px)", fontWeight:800, lineHeight:1.1,
              marginBottom:16, animation:"fadeUp .5s ease .1s both", maxWidth:680 }}>
              What do you want to{" "}
              <span className="grad-text">explore?</span>
            </h1>

            <p style={{ fontSize:15, color:"rgba(255,255,255,0.36)", maxWidth:460,
              lineHeight:1.9, marginBottom:38, animation:"fadeUp .5s ease .15s both" }}>
              Ask any marketing question in plain English and get instant interactive dashboards powered by AI.
            </p>

            {/* Query input */}
            <div style={{ width:"100%", maxWidth:760, animation:"fadeUp .5s ease .2s both" }}>
              <div style={{
                background:"rgba(8,12,24,0.94)", borderRadius:20,
                border:`1.5px solid ${focused ? "rgba(6,182,212,0.7)" : "rgba(79,70,229,0.35)"}`,
                padding:"18px 22px",
                boxShadow: focused
                  ? "0 0 70px rgba(6,182,212,0.15), inset 0 0 24px rgba(79,70,229,0.04)"
                  : "0 10px 60px rgba(0,0,0,0.55)",
                transition:"all 0.3s", position:"relative", overflow:"hidden"
              }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:1,
                  background:`linear-gradient(90deg,transparent,${focused?"rgba(6,182,212,0.7)":"rgba(79,70,229,0.4)"},transparent)`,
                  transition:"all 0.3s" }}/>

                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:38, height:38, borderRadius:11,
                    background:"linear-gradient(135deg,#4F46E5,#06B6D4)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:18, flexShrink:0, boxShadow:"0 0 18px rgba(79,70,229,0.55)" }}>✦</div>
                  <input
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onKeyDown={e => e.key === "Enter" && handleSubmit(inputVal)}
                    placeholder="Ask your marketing question..."
                    style={{ flex:1, background:"transparent", border:"none", outline:"none",
                      color:"#fff", fontSize:15, fontFamily:"'Sora',sans-serif", caretColor:"#06B6D4" }}
                  />
                  <button
                    onClick={() => handleSubmit(inputVal)}
                    disabled={!inputVal.trim() || loading}
                    style={{
                      background: inputVal.trim() && !loading
                        ? "linear-gradient(135deg,#4F46E5,#06B6D4)"
                        : "rgba(255,255,255,0.05)",
                      border:`1px solid ${inputVal.trim()&&!loading?"transparent":"rgba(255,255,255,0.08)"}`,
                      borderRadius:12, padding:"11px 24px",
                      color: inputVal.trim() && !loading ? "#fff" : "rgba(255,255,255,0.22)",
                      fontSize:14, fontWeight:700,
                      cursor: inputVal.trim() && !loading ? "pointer" : "not-allowed",
                      fontFamily:"'Sora',sans-serif", transition:"all 0.3s", flexShrink:0,
                      boxShadow: inputVal.trim()&&!loading ? "0 4px 22px rgba(79,70,229,0.5)" : "none",
                      whiteSpace:"nowrap"
                    }}
                    onMouseEnter={e => { if(inputVal.trim()&&!loading){ e.currentTarget.style.transform="scale(1.04)"; e.currentTarget.style.boxShadow="0 6px 30px rgba(79,70,229,0.7)"; }}}
                    onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow=inputVal.trim()&&!loading?"0 4px 22px rgba(79,70,229,0.5)":"none"; }}
                  >
                    {loading ? "Analyzing..." : "Generate Insights →"}
                  </button>
                </div>

                {/* Chips */}
                <div style={{ marginTop:14, paddingTop:13, borderTop:"1px solid rgba(255,255,255,0.05)",
                  display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", justifyContent:"center" }}>
                  <span style={{ fontSize:10, color:"rgba(255,255,255,0.2)", fontFamily:"monospace", flexShrink:0 }}>Try:</span>
                  {EXAMPLE_PROMPTS.map(p => (
                    <span key={p} onClick={() => setInputVal(p)}
                      style={{ fontSize:11, color:"rgba(6,182,212,0.5)", fontFamily:"monospace",
                        cursor:"pointer", padding:"3px 11px", background:"rgba(6,182,212,0.05)",
                        borderRadius:8, border:"1px solid rgba(6,182,212,0.12)",
                        transition:"all 0.2s", whiteSpace:"nowrap" }}
                      onMouseEnter={e => { e.currentTarget.style.background="rgba(6,182,212,0.12)"; e.currentTarget.style.color="#06B6D4"; }}
                      onMouseLeave={e => { e.currentTarget.style.background="rgba(6,182,212,0.05)"; e.currentTarget.style.color="rgba(6,182,212,0.5)"; }}
                    >{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div ref={resultsRef} style={{ width:"100%", maxWidth:1400, margin:"0 auto", padding:"0 48px 120px" }}>

            {error && <ErrorBanner message={error} onDismiss={() => setError(null)}/>}
            {loading && <Loader/>}

            {!loading && hasResults && charts.length > 0 && (
              <div style={{ animation:"fadeUp .5s ease" }}>

                {/* Results header */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                  marginBottom:28, paddingBottom:18, borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                  <div>
                    <div style={{ fontSize:10, color:"rgba(6,182,212,0.65)", fontFamily:"monospace",
                      letterSpacing:2.5, textTransform:"uppercase", marginBottom:7 }}>Results for</div>
                    <div style={{ fontSize:17, fontWeight:600, color:"#fff",
                      display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ color:"rgba(139,92,246,0.8)", fontFamily:"monospace" }}>›</span>
                      "{currentQuery}"
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.28)", fontFamily:"monospace" }}>
                      {charts[0]?.rowCount} rows · {charts.length} chart{charts.length !== 1 ? "s" : ""}
                    </div>
                    <div style={{ background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.28)",
                      borderRadius:100, padding:"5px 14px", fontSize:11, color:"#22c55e", fontFamily:"monospace" }}>
                      ✓ Complete
                    </div>
                  </div>
                </div>

                {/* KPI strip */}
                {kpis && (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:32 }}>
                    {kpis.map(({ label, value, c }, i) => (
                      <div key={label} style={{
                        background:"rgba(8,12,24,0.85)", border:`1px solid ${c}20`,
                        borderRadius:18, padding:"18px 22px",
                        animation:`fadeUp 0.5s ease ${i*0.08}s both`,
                        position:"relative", overflow:"hidden"
                      }}>
                        <div style={{ position:"absolute", top:0, left:0, right:0, height:2,
                          background:`linear-gradient(90deg,transparent,${c},transparent)` }}/>
                        <div style={{ fontSize:10, color:"rgba(255,255,255,0.28)", fontFamily:"monospace",
                          marginBottom:10, letterSpacing:1.5, textTransform:"uppercase" }}>{label}</div>
                        <div style={{ fontSize:26, fontWeight:800, color:"#fff", marginBottom:5 }}>{value}</div>
                        <div style={{ fontSize:11, color:c, fontFamily:"monospace" }}>● Live data</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Full width chart */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:24 }}>
                  {charts.map((chart, i) => (
                    <ChartCard key={i} dataset={chart} index={i}/>
                  ))}
                </div>
              </div>
            )}

            {!loading && !hasResults && !error && <EmptyState/>}
          </div>
        </div>
      </div>
    </>
  );
}