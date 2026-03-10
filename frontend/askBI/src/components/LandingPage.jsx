import { useState, useEffect, useRef } from "react";

const TYPING_EXAMPLES = [
  "Show revenue by marketing channel for Q3...",
  "Which campaign type has the highest ROI?",
  "Show conversion trend over last 6 months...",
  "Compare CAC across all ad platforms...",
  "What's the best performing audience segment?",
];

const STATS = [
  { value: "2.4M+", label: "Queries Answered" },
  { value: "180ms", label: "Avg Response Time" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "500+", label: "Enterprise Teams" },
];

function ParticleGrid() {
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
      <svg width="100%" height="100%">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(6,182,212,0.07)" strokeWidth="1"/>
          </pattern>
          <radialGradient id="fade" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="rgba(79,70,229,0.18)"/>
            <stop offset="60%" stopColor="rgba(6,182,212,0.05)"/>
            <stop offset="100%" stopColor="transparent"/>
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
        <rect width="100%" height="100%" fill="url(#fade)"/>
      </svg>
      <div style={{ position:"absolute", top:"10%", left:"5%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(79,70,229,0.13) 0%,transparent 70%)", animation:"pulse 8s ease-in-out infinite" }}/>
      <div style={{ position:"absolute", top:"50%", right:"5%", width:350, height:350, borderRadius:"50%", background:"radial-gradient(circle,rgba(6,182,212,0.09) 0%,transparent 70%)", animation:"pulse 10s ease-in-out infinite 2s" }}/>
      <div style={{ position:"absolute", bottom:"5%", left:"40%", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,0.1) 0%,transparent 70%)", animation:"pulse 9s ease-in-out infinite 1s" }}/>
    </div>
  );
}

function MiniBarChart({ data, color }) {
  const max = Math.max(...data);
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:44 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex:1, borderRadius:3, height:`${(v/max)*100}%`, background:`linear-gradient(to top,${color}66,${color})` }}/>
      ))}
    </div>
  );
}

function MiniLineChart({ data, color }) {
  const max = Math.max(...data), min = Math.min(...data);
  const w = 120, h = 44;
  const pts = data.map((v, i) => {
    const x = (i/(data.length-1))*w;
    const y = h - ((v-min)/(max-min))*(h-10) - 5;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} style={{ overflow:"visible" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function FloatingDashboard() {
  const barData = [40,65,55,80,70,90,75];
  const lineData = [30,45,40,60,55,75,70,85];
  return (
    <div style={{ background:"rgba(8,12,24,0.95)", border:"1px solid rgba(6,182,212,0.25)", borderRadius:20, padding:22, width:"100%", maxWidth:420, animation:"float 6s ease-in-out infinite", position:"relative", overflow:"hidden", boxShadow:"0 0 80px rgba(79,70,229,0.25), 0 40px 80px rgba(0,0,0,0.7)" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(6,182,212,0.7),transparent)" }}/>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:14 }}>
        {["#ef4444","#f59e0b","#22c55e"].map(c => <div key={c} style={{ width:8, height:8, borderRadius:"50%", background:c }}/>)}
        <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.05)", marginLeft:8 }}/>
        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 6px #22c55e" }}/>
          <span style={{ fontSize:9, color:"rgba(6,182,212,0.8)", fontFamily:"monospace", letterSpacing:1 }}>LIVE</span>
        </div>
      </div>
      <div style={{ background:"rgba(79,70,229,0.12)", border:"1px solid rgba(79,70,229,0.25)", borderRadius:10, padding:"8px 12px", marginBottom:14, fontFamily:"monospace", fontSize:11, color:"rgba(6,182,212,0.95)" }}>
        <span style={{ color:"rgba(139,92,246,0.9)" }}>› </span>Show revenue by marketing channel Q3
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
        {[
          {l:"Revenue",v:"$2.4M",d:"+18%",c:"#06B6D4"},
          {l:"Conversions",v:"48.2K",d:"+12%",c:"#4F46E5"},
          {l:"ROI",v:"3.8x",d:"+6%",c:"#8B5CF6"},
        ].map(({l,v,d,c}) => (
          <div key={l} style={{ background:"rgba(255,255,255,0.03)", border:`1px solid ${c}30`, borderRadius:10, padding:"10px 8px" }}>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)", marginBottom:4, fontFamily:"monospace" }}>{l}</div>
            <div style={{ fontSize:16, fontWeight:700, color:"#fff" }}>{v}</div>
            <div style={{ fontSize:10, color:"#22c55e", marginTop:3 }}>{d}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(6,182,212,0.12)", borderRadius:12, padding:12 }}>
          <div style={{ fontSize:9, color:"rgba(255,255,255,0.35)", marginBottom:8, fontFamily:"monospace", letterSpacing:1 }}>CHANNEL REV</div>
          <MiniBarChart data={barData} color="#06B6D4"/>
        </div>
        <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(139,92,246,0.15)", borderRadius:12, padding:12 }}>
          <div style={{ fontSize:9, color:"rgba(255,255,255,0.35)", marginBottom:8, fontFamily:"monospace", letterSpacing:1 }}>CONVERSIONS</div>
          <MiniLineChart data={lineData} color="#8B5CF6"/>
        </div>
      </div>
    </div>
  );
}

function TypewriterInput({ onGenerate }) {
  const [displayText, setDisplayText] = useState("");
  const [inputVal, setInputVal] = useState("");
  const [exIdx, setExIdx] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isFocused) return;
    const example = TYPING_EXAMPLES[exIdx];
    clearTimeout(timerRef.current);
    if (isTyping) {
      if (displayText.length < example.length) {
        timerRef.current = setTimeout(() => setDisplayText(example.slice(0, displayText.length + 1)), 48);
      } else {
        timerRef.current = setTimeout(() => setIsTyping(false), 2200);
      }
    } else {
      if (displayText.length > 0) {
        timerRef.current = setTimeout(() => setDisplayText(displayText.slice(0, -1)), 20);
      } else {
        setExIdx((exIdx + 1) % TYPING_EXAMPLES.length);
        setIsTyping(true);
      }
    }
    return () => clearTimeout(timerRef.current);
  }, [displayText, isTyping, exIdx, isFocused]);

  return (
    <div style={{ background:"rgba(8,12,24,0.9)", borderRadius:14, border:`1.5px solid ${isFocused ? "rgba(6,182,212,0.7)" : "rgba(79,70,229,0.4)"}`, padding:"14px 18px", display:"flex", alignItems:"center", gap:10, boxShadow: isFocused ? "0 0 40px rgba(6,182,212,0.15), inset 0 0 20px rgba(79,70,229,0.05)" : "0 4px 30px rgba(0,0,0,0.5)", transition:"all 0.3s" }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(6,182,212,0.6)" strokeWidth="2.5" style={{ flexShrink:0 }}>
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        value={isFocused ? inputVal : displayText}
        onChange={e => setInputVal(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => { if (!inputVal) setIsFocused(false); }}
        onKeyDown={e => e.key === "Enter" && onGenerate(inputVal)}
        placeholder={isFocused ? "Ask anything about your marketing data..." : ""}
        style={{ flex:1, background:"transparent", border:"none", outline:"none", color: isFocused ? "#fff" : "rgba(255,255,255,0.7)", fontSize:14, caretColor:"#06B6D4", fontFamily:"'Sora',sans-serif" }}
      />
      {!isFocused && <div style={{ width:2, height:16, background:"rgba(6,182,212,0.9)", animation:"blink 1s step-end infinite", flexShrink:0 }}/>}
      <button
        onClick={() => onGenerate(inputVal || displayText)}
        style={{ background:"linear-gradient(135deg,#4F46E5,#06B6D4)", border:"none", borderRadius:10, padding:"9px 20px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 20px rgba(79,70,229,0.5)", whiteSpace:"nowrap", fontFamily:"'Sora',sans-serif", transition:"all 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.transform="scale(1.04)"; e.currentTarget.style.boxShadow="0 6px 28px rgba(79,70,229,0.7)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 4px 20px rgba(79,70,229,0.5)"; }}>
        Generate →
      </button>
    </div>
  );
}

function StepCard({ num, icon, title, desc }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background:"rgba(8,12,24,0.8)", border:`1px solid ${hovered ? "rgba(6,182,212,0.5)" : "rgba(79,70,229,0.18)"}`, borderRadius:20, padding:32, position:"relative", overflow:"hidden", transform: hovered ? "translateY(-8px)" : "translateY(0)", boxShadow: hovered ? "0 24px 60px rgba(6,182,212,0.12)" : "none", transition:"all 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}>
      <div style={{ position:"absolute", top:-10, right:14, fontSize:80, fontWeight:900, color:"rgba(79,70,229,0.06)", fontFamily:"monospace", lineHeight:1, userSelect:"none" }}>{num}</div>
      <div style={{ width:48, height:48, borderRadius:14, marginBottom:20, background:"linear-gradient(135deg,rgba(79,70,229,0.3),rgba(6,182,212,0.1))", border:"1px solid rgba(79,70,229,0.35)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{icon}</div>
      <div style={{ fontSize:10, color:"rgba(6,182,212,0.7)", fontFamily:"monospace", letterSpacing:3, textTransform:"uppercase", marginBottom:10 }}>Step {num}</div>
      <h3 style={{ fontSize:20, fontWeight:700, color:"#fff", marginBottom:12 }}>{title}</h3>
      <p style={{ fontSize:14, color:"rgba(255,255,255,0.45)", lineHeight:1.75 }}>{desc}</p>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,rgba(79,70,229,0.6),rgba(6,182,212,0.6),transparent)", opacity: hovered ? 1 : 0, transition:"opacity 0.3s" }}/>
    </div>
  );
}

function GetStartedButton({ onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ position:"relative", display:"inline-flex", alignItems:"center", justifyContent:"center" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{
        position:"absolute",
        width: hovered ? 130 : 110, height: hovered ? 130 : 110,
        borderRadius:"50%",
        animation:"spin 4s linear infinite",
        transition:"all 0.4s ease",
        backgroundImage:"conic-gradient(from 0deg, rgba(6,182,212,0.7) 0deg, transparent 60deg, transparent 300deg, rgba(79,70,229,0.7) 360deg)",
        WebkitMask:"radial-gradient(transparent 46%, black 47%)",
        mask:"radial-gradient(transparent 46%, black 47%)",
      }}/>
      {hovered && <>
        <div style={{ position:"absolute", width:150, height:150, borderRadius:"50%", border:"1px solid rgba(6,182,212,0.2)", animation:"ripple 1.5s ease-out infinite" }}/>
        <div style={{ position:"absolute", width:150, height:150, borderRadius:"50%", border:"1px solid rgba(79,70,229,0.2)", animation:"ripple 1.5s ease-out infinite 0.6s" }}/>
      </>}
      <button onClick={onClick} style={{
        background: hovered ? "linear-gradient(135deg,#4F46E5,#06B6D4,#8B5CF6)" : "linear-gradient(135deg,#4F46E5,#06B6D4)",
        border:"none", borderRadius:50, padding:"13px 30px",
        color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer",
        fontFamily:"'Sora',sans-serif",
        boxShadow: hovered ? "0 0 40px rgba(79,70,229,0.7), 0 0 80px rgba(6,182,212,0.25)" : "0 0 20px rgba(79,70,229,0.4)",
        transition:"all 0.3s ease",
        transform: hovered ? "scale(1.05)" : "scale(1)",
        position:"relative", zIndex:1, letterSpacing:0.5,
      }}>
        {hovered ? "✦ Let's Go →" : "Get Started"}
      </button>
    </div>
  );
}

// ─── MAIN EXPORT ───────────────────────────────────────────────
export default function LandingPage({ onNavigate }) {

  // Both the typewriter Generate button AND Get Started navigate to dashboard
  const handleGenerate = () => {
    onNavigate();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html, body { width:100%; overflow-x:hidden; }
        body { background:#05080f; font-family:'Sora',sans-serif; }
        @keyframes float    { 0%,100%{transform:translateY(0) rotate(-0.5deg)} 50%{transform:translateY(-16px) rotate(0.5deg)} }
        @keyframes pulse    { 0%,100%{transform:scale(1);opacity:.7} 50%{transform:scale(1.08);opacity:1} }
        @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes slideDown{ from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes ripple   { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(1.8);opacity:0} }
        .grad-text {
          background:linear-gradient(135deg,#fff 0%,#06B6D4 40%,#4F46E5 80%,#8B5CF6 100%);
          background-size:250% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          animation:shimmer 4s linear infinite;
        }
        .nav-a { color:rgba(255,255,255,0.5); text-decoration:none; font-size:14px; transition:color .2s; font-family:'Sora',sans-serif; }
        .nav-a:hover { color:#fff; }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:#05080f} ::-webkit-scrollbar-thumb{background:rgba(79,70,229,0.5);border-radius:2px}
      `}</style>

      <div style={{ minHeight:"100vh", background:"#05080f", color:"#fff", overflowX:"hidden" }}>

        {/* Scanlines */}
        <div style={{ position:"fixed", inset:0, background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.02) 2px,rgba(0,0,0,0.02) 4px)", pointerEvents:"none", zIndex:9998 }}/>

        {/* ── NAVBAR ── */}
        <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:"rgba(5,8,15,0.85)", backdropFilter:"blur(24px)", borderBottom:"1px solid rgba(79,70,229,0.1)" }}>
          <div style={{ maxWidth:1280, margin:"0 auto", height:66, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 40px" }}>

            {/* Logo */}
            <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
              <div style={{ width:34, height:34, borderRadius:9, background:"linear-gradient(135deg,#4F46E5,#06B6D4)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:16, color:"#fff", boxShadow:"0 0 20px rgba(79,70,229,0.55)" }}>A</div>
              <div>
                <div style={{ fontWeight:800, fontSize:19, background:"linear-gradient(135deg,#fff,#06B6D4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1.1 }}>AskBI</div>
                <div style={{ fontSize:8, color:"rgba(6,182,212,0.55)", fontFamily:"monospace", letterSpacing:2.5 }}>CONVERSATIONAL BI</div>
              </div>
            </div>

            {/* Nav links — centered absolutely */}
            <div style={{ display:"flex", gap:36, position:"absolute", left:"50%", transform:"translateX(-50%)" }}>
              {["About","Features","How it Works","Contact"].map(l => (
                <a key={l} href="#" className="nav-a">{l}</a>
              ))}
            </div>

            {/* Get Started */}
            <GetStartedButton onClick={handleGenerate}/>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section style={{ position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", overflow:"hidden" }}>
          <ParticleGrid/>
          <div style={{ maxWidth:1280, margin:"0 auto", width:"100%", padding:"110px 40px 60px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center", position:"relative", zIndex:1 }}>

            {/* LEFT */}
            <div style={{ animation:"fadeUp .8s ease .1s both" }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(79,70,229,0.1)", border:"1px solid rgba(79,70,229,0.32)", borderRadius:100, padding:"5px 14px 5px 6px", marginBottom:28 }}>
                <div style={{ background:"linear-gradient(135deg,#4F46E5,#06B6D4)", borderRadius:100, padding:"3px 10px", fontSize:10, fontWeight:700, color:"#fff", fontFamily:"monospace" }}>NEW</div>
                <span style={{ fontSize:12, color:"rgba(255,255,255,0.55)" }}>Powered by next-gen AI reasoning</span>
              </div>

              <h1 style={{ fontSize:"clamp(36px,4.2vw,60px)", fontWeight:800, lineHeight:1.08, marginBottom:20 }}>
                Ask Questions.<br/>
                <span className="grad-text">Get Instant<br/>Marketing</span><br/>Insights.
              </h1>

              <p style={{ fontSize:16, color:"rgba(255,255,255,0.45)", lineHeight:1.8, marginBottom:32, maxWidth:440 }}>
                AskBI converts natural language into powerful analytics dashboards — no SQL, no BI training, no waiting for your data team.
              </p>

              <TypewriterInput onGenerate={handleGenerate}/>

              <div style={{ marginTop:14, display:"flex", flexWrap:"wrap", gap:8 }}>
                {["Revenue by channel","Highest ROI campaign","Conversion trend"].map(c => (
                  <span key={c} onClick={handleGenerate}
                    style={{ background:"rgba(79,70,229,0.08)", border:"1px solid rgba(79,70,229,0.2)", borderRadius:100, padding:"5px 14px", fontSize:12, color:"rgba(255,255,255,0.5)", cursor:"pointer", fontFamily:"monospace", display:"inline-flex", alignItems:"center", gap:5, transition:"all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(6,182,212,0.5)"; e.currentTarget.style.color="#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(79,70,229,0.2)"; e.currentTarget.style.color="rgba(255,255,255,0.5)"; }}>
                    <span style={{ color:"rgba(6,182,212,0.7)" }}>↗</span>{c}
                  </span>
                ))}
              </div>

              <div style={{ marginTop:32, paddingTop:24, borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ display:"flex" }}>
                  {["#4F46E5","#06B6D4","#8B5CF6","#EC4899","#F59E0B"].map((c,i) => (
                    <div key={i} style={{ width:28, height:28, borderRadius:"50%", background:`linear-gradient(135deg,${c},${c}99)`, border:"2px solid #05080f", marginLeft: i > 0 ? -8 : 0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700 }}>
                      {String.fromCharCode(65+i)}
                    </div>
                  ))}
                </div>
                <span style={{ fontSize:13, color:"rgba(255,255,255,0.35)" }}>Trusted by <strong style={{ color:"#fff" }}>500+ teams</strong> worldwide</span>
              </div>
            </div>

            {/* RIGHT */}
            <div style={{ display:"flex", justifyContent:"center", alignItems:"center", animation:"fadeUp .8s ease .3s both" }}>
              <div style={{ position:"relative", width:"100%", maxWidth:440 }}>
                <FloatingDashboard/>
                <div style={{ position:"absolute", top:-16, right:-10, background:"rgba(17,24,12,0.92)", border:"1px solid rgba(34,197,94,0.4)", borderRadius:12, padding:"8px 14px", backdropFilter:"blur(12px)", animation:"float 5s ease-in-out infinite 1s", zIndex:10 }}>
                  <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)", fontFamily:"monospace", marginBottom:2 }}>Revenue ↑</div>
                  <div style={{ fontSize:20, fontWeight:800, color:"#22c55e", lineHeight:1 }}>+24.8%</div>
                </div>
                <div style={{ position:"absolute", bottom:-16, left:-10, background:"rgba(8,10,30,0.92)", border:"1px solid rgba(79,70,229,0.4)", borderRadius:12, padding:"8px 14px", backdropFilter:"blur(12px)", animation:"float 7s ease-in-out infinite 2s", zIndex:10 }}>
                  <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)", fontFamily:"monospace", marginBottom:2 }}>Generated in</div>
                  <div style={{ fontSize:20, fontWeight:800, color:"#4F46E5", lineHeight:1 }}>0.18s ⚡</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <div style={{ background:"rgba(79,70,229,0.05)", borderTop:"1px solid rgba(79,70,229,0.12)", borderBottom:"1px solid rgba(79,70,229,0.12)", padding:"28px 40px" }}>
          <div style={{ maxWidth:900, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)", textAlign:"center" }}>
            {STATS.map(({value,label},i) => (
              <div key={label} style={{ padding:"0 20px", borderRight: i<3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                <div style={{ fontSize:28, fontWeight:800, background:"linear-gradient(135deg,#06B6D4,#4F46E5)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{value}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", marginTop:4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── HOW IT WORKS ── */}
        <section style={{ padding:"100px 40px", position:"relative", overflow:"hidden" }}>
          <ParticleGrid/>
          <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>
            <div style={{ textAlign:"center", marginBottom:60 }}>
              <div style={{ fontSize:10, color:"rgba(6,182,212,0.7)", fontFamily:"monospace", letterSpacing:4, textTransform:"uppercase", marginBottom:14 }}>The Pipeline</div>
              <h2 style={{ fontSize:36, fontWeight:800, marginBottom:14 }}>From question to dashboard<br/><span className="grad-text">in under a second.</span></h2>
              <p style={{ fontSize:15, color:"rgba(255,255,255,0.35)", maxWidth:440, margin:"0 auto" }}>No SQL. No configuration. No waiting for the data team.</p>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 48px 1fr 48px 1fr", alignItems:"center" }}>
              <StepCard num="01" icon="💬" title="Ask in Plain English" desc="Type any marketing question naturally. AskBI understands business context, synonyms, and complex multi-part queries instantly."/>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <div style={{ width:1, height:30, background:"linear-gradient(to bottom,rgba(79,70,229,0.5),rgba(6,182,212,0.5))" }}/>
                <div style={{ width:8, height:8, borderRadius:"50%", background:"#06B6D4", boxShadow:"0 0 14px #06B6D4" }}/>
                <div style={{ width:1, height:30, background:"linear-gradient(to bottom,rgba(6,182,212,0.5),rgba(79,70,229,0.5))" }}/>
              </div>
              <StepCard num="02" icon="⚡" title="AI Generates SQL" desc="Our fine-tuned LLM converts your question into optimized SQL, selects the right chart type, and validates results automatically."/>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <div style={{ width:1, height:30, background:"linear-gradient(to bottom,rgba(79,70,229,0.5),rgba(6,182,212,0.5))" }}/>
                <div style={{ width:8, height:8, borderRadius:"50%", background:"#4F46E5", boxShadow:"0 0 14px #4F46E5" }}/>
                <div style={{ width:1, height:30, background:"linear-gradient(to bottom,rgba(6,182,212,0.5),rgba(79,70,229,0.5))" }}/>
              </div>
              <StepCard num="03" icon="📊" title="Instant Dashboard" desc="Interactive charts appear in milliseconds. Share with one click, drill down on any metric, or export to any format."/>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding:"80px 40px 110px", textAlign:"center", position:"relative" }}>
          <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:700, height:350, borderRadius:"50%", background:"radial-gradient(ellipse,rgba(79,70,229,0.1) 0%,transparent 70%)", pointerEvents:"none" }}/>
          <div style={{ position:"relative", maxWidth:600, margin:"0 auto" }}>
            <h2 style={{ fontSize:38, fontWeight:800, marginBottom:14 }}>Ready to talk to<br/><span className="grad-text">your data?</span></h2>
            <p style={{ fontSize:15, color:"rgba(255,255,255,0.35)", marginBottom:40, lineHeight:1.8 }}>
              Join 500+ marketing teams who've eliminated the wait for analytics. Your first dashboard in 30 seconds.
            </p>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:18 }}>
              <GetStartedButton onClick={handleGenerate}/>
            </div>
            <p style={{ fontSize:11, color:"rgba(255,255,255,0.2)", fontFamily:"monospace" }}>No credit card required · 2-minute setup · Cancel anytime</p>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop:"1px solid rgba(255,255,255,0.05)", padding:"24px 40px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.2)", fontFamily:"monospace" }}>© 2025 AskBI · Conversational Business Intelligence</div>
          <div style={{ display:"flex", gap:24 }}>
            {["Privacy","Terms","GitHub"].map(l => (
              <a key={l} href="#" style={{ fontSize:12, color:"rgba(255,255,255,0.25)", textDecoration:"none" }}
                onMouseEnter={e => e.target.style.color="#fff"}
                onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.25)"}>
                {l}
              </a>
            ))}
          </div>
        </footer>

      </div>
    </>
  );
}