import { useState } from "react";

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

export default function Navbar({ onNavigate, active }) {
  const NAV_LINKS = [
    { label: "About",        page: "about" },
    { label: "Features",     page: "features" },
    { label: "How it Works", page: "home" },
    { label: "Contact",      page: "contact" },
  ];

  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:"rgba(5,8,15,0.85)", backdropFilter:"blur(24px)", borderBottom:"1px solid rgba(79,70,229,0.1)" }}>
      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .nav-a { color:rgba(255,255,255,0.5); text-decoration:none; font-size:14px; transition:color .2s; font-family:'Sora',sans-serif; cursor:pointer; background:none; border:none; padding:0; }
        .nav-a:hover, .nav-a.active { color:#fff; }
        .nav-a.active { color:#06B6D4; }
      `}</style>
      <div style={{ maxWidth:1280, margin:"0 auto", height:66, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 40px" }}>
        {/* Logo */}
        <div onClick={() => onNavigate("home")} style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0, cursor:"pointer" }}>
          <div style={{ width:34, height:34, borderRadius:9, background:"linear-gradient(135deg,#4F46E5,#06B6D4)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:16, color:"#fff", boxShadow:"0 0 20px rgba(79,70,229,0.55)" }}>A</div>
          <div>
            <div style={{ fontWeight:800, fontSize:19, background:"linear-gradient(135deg,#fff,#06B6D4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1.1 }}>AskBI</div>
            <div style={{ fontSize:8, color:"rgba(6,182,212,0.55)", fontFamily:"monospace", letterSpacing:2.5 }}>CONVERSATIONAL BI</div>
          </div>
        </div>

        {/* Nav links */}
        <div style={{ display:"flex", gap:36, position:"absolute", left:"50%", transform:"translateX(-50%)" }}>
          {NAV_LINKS.map(({ label, page }) => (
            <button key={label} onClick={() => onNavigate(page)}
              className={`nav-a${active === page ? " active" : ""}`}>
              {label}
            </button>
          ))}
        </div>

        <GetStartedButton onClick={() => onNavigate("dashboard")} />
      </div>
    </nav>
  );
}