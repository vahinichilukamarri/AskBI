import React, { useState } from "react";
import Navbar from "./Navbar";

/* ── Fonts + Global Styles ── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;600&family=Sora:wght@600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ink:    #0A0B10;
      --paper:  #F4F1EB;
      --accent: #C8402A;
      --blue:   #1A7FEB;
      --gold:   #C9A84C;
    }

    body { background: var(--ink); }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(36px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes floatA {
      0%,100% { transform: translateY(0) rotate(0deg); }
      50%     { transform: translateY(-20px) rotate(3deg); }
    }
    @keyframes floatB {
      0%,100% { transform: translateY(0) rotate(0deg); }
      50%     { transform: translateY(16px) rotate(-3deg); }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes ripple {
      0%   { transform: scale(1); opacity: .5; }
      100% { transform: scale(1.8); opacity: 0; }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes blink {
      0%,100% { opacity: 1; }
      50%     { opacity: 0; }
    }

    .fade-up { animation: fadeUp 0.75s cubic-bezier(0.16,1,0.3,1) both; }
    .float-a { animation: floatA 8s ease-in-out infinite; }
    .float-b { animation: floatB 10s ease-in-out infinite; }

    .nav-a {
      color: rgba(255,255,255,0.5);
      text-decoration: none;
      font-size: 14px;
      transition: color .2s;
      font-family: 'Sora', sans-serif;
    }
    .nav-a:hover { color: #fff; }

    /* ── Form inputs ── */
    .ct-input {
      width: 100%;
      background: rgba(244,241,235,0.04);
      border: 1px solid rgba(244,241,235,0.1);
      border-radius: 3px;
      padding: 14px 18px;
      color: var(--paper);
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      outline: none;
      transition: border-color 0.25s, background 0.25s;
      resize: none;
    }
    .ct-input::placeholder { color: rgba(244,241,235,0.25); }
    .ct-input:focus {
      border-color: rgba(200,64,42,0.6);
      background: rgba(200,64,42,0.04);
    }

    .ct-label {
      display: block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: rgba(244,241,235,0.35);
      margin-bottom: 8px;
    }

    .submit-btn {
      width: 100%;
      padding: 16px;
      background: var(--accent);
      color: var(--paper);
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 3px;
      text-transform: uppercase;
      border: none;
      border-radius: 2px;
      cursor: pointer;
      transition: background 0.25s, transform 0.2s;
      margin-top: 8px;
    }
    .submit-btn:hover { background: #a33220; transform: translateY(-2px); }
    .submit-btn:disabled { background: rgba(200,64,42,0.3); cursor: default; transform: none; }

    .contact-card {
      border: 1px solid rgba(244,241,235,0.08);
      border-radius: 3px;
      padding: 28px 24px;
      transition: border-color 0.3s, transform 0.3s;
      cursor: default;
    }
    .contact-card:hover {
      border-color: rgba(200,64,42,0.4);
      transform: translateY(-3px);
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--ink); }
    ::-webkit-scrollbar-thumb { background: rgba(200,64,42,0.4); border-radius: 2px; }
  `}</style>
);


/* ── Contact info card ── */
function InfoCard({ icon, label, value, sub }) {
  return (
    <div className="contact-card">
      <div style={{ fontSize:22, marginBottom:14 }}>{icon}</div>
      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, letterSpacing:2.5, textTransform:"uppercase", color:"rgba(244,241,235,0.3)", marginBottom:6 }}>{label}</div>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, color:"var(--paper)", marginBottom:4 }}>{value}</div>
      {sub && <div style={{ fontSize:13, color:"rgba(244,241,235,0.4)", fontWeight:300 }}>{sub}</div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
export default function ContactUs({ onNavigate }) {
  const [form, setForm]       = useState({ name:"", email:"", subject:"", message:"" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]    = useState(false);
  const [focused, setFocused]    = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1400);
  };

  return (
    <div style={{ minHeight:"100vh", background:"var(--ink)", color:"var(--paper)", fontFamily:"'DM Sans',sans-serif", overflowX:"hidden" }}>
      <FontLink />
      <Navbar onNavigate={onNavigate} active="contact" />

      {/* ── floating ambient glows ── */}
      <div className="float-a" style={{ position:"fixed", top:"15%", right:"5%", width:380, height:380, borderRadius:"50%", background:"radial-gradient(circle at 40% 40%,rgba(200,64,42,0.1),transparent 70%)", pointerEvents:"none", zIndex:0 }}/>
      <div className="float-b" style={{ position:"fixed", bottom:"10%", left:"3%",  width:280, height:280, borderRadius:"50%", background:"radial-gradient(circle at 60% 60%,rgba(26,127,235,0.08),transparent 70%)",  pointerEvents:"none", zIndex:0 }}/>

      {/* fine grid */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, backgroundImage:`linear-gradient(rgba(244,241,235,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(244,241,235,0.02) 1px,transparent 1px)`, backgroundSize:"80px 80px" }}/>

      <div style={{ position:"relative", zIndex:1 }}>

        {/* ── HERO ── */}
        <section style={{ maxWidth:1280, margin:"0 auto", padding:"148px 48px 80px" }}>
          <div className="fade-up" style={{ animationDelay:"0.05s", display:"flex", alignItems:"center", gap:16, marginBottom:32 }}>
            <div style={{ width:32, height:1, background:"var(--accent)" }}/>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, letterSpacing:3, color:"var(--accent)", textTransform:"uppercase" }}>Contact Us</span>
          </div>

          <h1 className="fade-up" style={{ animationDelay:"0.15s", fontFamily:"'Playfair Display',serif", fontSize:"clamp(48px,7vw,96px)", fontWeight:900, lineHeight:0.95, letterSpacing:-3, marginBottom:32 }}>
            Let's talk<br/>
            <em style={{ color:"var(--accent)" }}>business.</em>
          </h1>

          <p className="fade-up" style={{ animationDelay:"0.25s", fontSize:16, color:"rgba(244,241,235,0.5)", maxWidth:520, lineHeight:1.85, fontWeight:300 }}>
            Whether you're evaluating AskBI for your team, need a demo,
            or just have a question — we respond to every message within one business day.
          </p>
        </section>

        {/* ── MAIN CONTENT ── */}
        <section style={{ maxWidth:1280, margin:"0 auto", padding:"0 48px 120px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1.5fr", gap:80, alignItems:"start" }}>

            {/* ── LEFT: info + channels ── */}
            <div>
              {/* Info cards */}
              <div style={{ display:"flex", flexDirection:"column", gap:16, marginBottom:52 }}>
                <InfoCard icon="✉️" label="Email" value="team@askbi.ai" sub="We reply within 24 hours" />
                <InfoCard icon="📞" label="Sales" value="+91 91000 45231" sub="Mon–Fri, 9am–6pm PT" />
                <InfoCard icon="📍" label="Office" value="Telangana, India" sub="HITEC City, Madhapur, Hyderabad" />
              </div>

              {/* Divider */}
              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:32 }}>
                <div style={{ width:32, height:1, background:"var(--accent)" }}/>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, letterSpacing:3, color:"rgba(244,241,235,0.3)", textTransform:"uppercase" }}>Or reach us on</span>
                <div style={{ flex:1, height:1, background:"rgba(244,241,235,0.06)" }}/>
              </div>

              {/* Social links */}
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {[
                  { platform:"Twitter / X", handle:"@askbi_io",   color:"#1DA1F2" },
                  { platform:"LinkedIn",    handle:"AskBI",         color:"#0A66C2" },
                  { platform:"GitHub",      handle:"askbi-io",      color:"rgba(244,241,235,0.7)" },
                ].map(({ platform, handle, color }) => (
                  <div key={platform} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px", border:"1px solid rgba(244,241,235,0.07)", borderRadius:3, transition:"border-color 0.25s, transform 0.25s", cursor:"pointer" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(200,64,42,0.35)"; e.currentTarget.style.transform="translateX(6px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(244,241,235,0.07)"; e.currentTarget.style.transform="none"; }}>
                    <div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, letterSpacing:2, color:"rgba(244,241,235,0.3)", textTransform:"uppercase", marginBottom:3 }}>{platform}</div>
                      <div style={{ fontSize:14, color, fontWeight:500 }}>{handle}</div>
                    </div>
                    <span style={{ color:"rgba(244,241,235,0.2)", fontSize:18 }}>→</span>
                  </div>
                ))}
              </div>

              {/* Response time badge */}
              <div style={{ marginTop:40, display:"inline-flex", alignItems:"center", gap:10, background:"rgba(200,64,42,0.07)", border:"1px solid rgba(200,64,42,0.2)", borderRadius:2, padding:"12px 18px" }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 8px #22c55e" }}/>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, letterSpacing:2, color:"rgba(244,241,235,0.5)" }}>MEDIAN REPLY TIME: &lt; 4 HOURS</span>
              </div>
            </div>

            {/* ── RIGHT: form ── */}
            <div style={{ background:"rgba(244,241,235,0.02)", border:"1px solid rgba(244,241,235,0.07)", borderRadius:4, padding:"44px 40px", position:"relative", overflow:"hidden" }}>

              {/* top accent line */}
              <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,var(--accent),transparent)" }}/>

              {submitted ? (
                /* ── SUCCESS STATE ── */
                <div style={{ textAlign:"center", padding:"60px 0" }}>
                  <div style={{ fontSize:52, marginBottom:20 }}>✓</div>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, marginBottom:12 }}>Message received.</h3>
                  <p style={{ fontSize:15, color:"rgba(244,241,235,0.45)", lineHeight:1.8, maxWidth:320, margin:"0 auto 32px" }}>
                    We'll be in touch within one business day. Keep an eye on <strong style={{ color:"var(--paper)" }}>{form.email}</strong>.
                  </p>
                  <button onClick={() => { setSubmitted(false); setForm({ name:"", email:"", subject:"", message:"" }); }}
                    style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, letterSpacing:2.5, textTransform:"uppercase", color:"var(--accent)", background:"transparent", border:"1px solid rgba(200,64,42,0.4)", borderRadius:2, padding:"10px 24px", cursor:"pointer", transition:"all .2s" }}
                    onMouseEnter={e => e.currentTarget.style.background="rgba(200,64,42,0.08)"}
                    onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                    Send another →
                  </button>
                </div>
              ) : (
                /* ── FORM ── */
                <>
                  <div style={{ marginBottom:32 }}>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, letterSpacing:3, color:"rgba(244,241,235,0.3)", textTransform:"uppercase", marginBottom:10 }}>Send a message</div>
                    <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, letterSpacing:-0.5 }}>
                      We'd love to hear<br/><em style={{ color:"var(--accent)" }}>from you.</em>
                    </h2>
                  </div>

                  <div style={{ display:"flex", flexDirection:"column", gap:22 }}>

                    {/* Name + Email row */}
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                      <div>
                        <label className="ct-label">Your name *</label>
                        <input className="ct-input" name="name" value={form.name} onChange={handleChange}
                          placeholder="Jane Smith"
                          onFocus={() => setFocused("name")} onBlur={() => setFocused("")} />
                      </div>
                      <div>
                        <label className="ct-label">Work email *</label>
                        <input className="ct-input" name="email" type="email" value={form.email} onChange={handleChange}
                          placeholder="jane@company.com"
                          onFocus={() => setFocused("email")} onBlur={() => setFocused("")} />
                      </div>
                    </div>

                    {/* Subject — dropdown feel */}
                    <div>
                      <label className="ct-label">I'm reaching out about</label>
                      <select className="ct-input" name="subject" value={form.subject} onChange={handleChange}
                        style={{ appearance:"none", cursor:"pointer" }}>
                        <option value="" disabled>Select a topic...</option>
                        <option value="demo">Book a demo</option>
                        <option value="pricing">Pricing & plans</option>
                        <option value="enterprise">Enterprise inquiry</option>
                        <option value="support">Technical support</option>
                        <option value="partnership">Partnership</option>
                        <option value="other">Something else</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="ct-label">Message *</label>
                      <textarea className="ct-input" name="message" value={form.message} onChange={handleChange}
                        placeholder="Tell us what's on your mind..."
                        rows={5}
                        onFocus={() => setFocused("message")} onBlur={() => setFocused("")} />
                    </div>

                    {/* Submit */}
                    <button className="submit-btn" onClick={handleSubmit} disabled={loading || !form.name || !form.email || !form.message}>
                      {loading ? "Sending..." : "Send Message →"}
                    </button>

                    <p style={{ fontSize:11, color:"rgba(244,241,235,0.2)", fontFamily:"'JetBrains Mono',monospace", letterSpacing:1, textAlign:"center" }}>
                      No spam. No selling your data. Ever.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── BOTTOM STRIP — what happens next ── */}
        <section style={{ borderTop:"1px solid rgba(244,241,235,0.06)", borderBottom:"1px solid rgba(244,241,235,0.06)", background:"rgba(244,241,235,0.015)", padding:"60px 48px" }}>
          <div style={{ maxWidth:1280, margin:"0 auto" }}>
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:44 }}>
              <div style={{ width:32, height:1, background:"var(--accent)" }}/>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, letterSpacing:3, color:"rgba(244,241,235,0.35)", textTransform:"uppercase" }}>What happens next</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2 }}>
              {[
                { num:"01", title:"We read your message", desc:"Every submission lands in a real inbox — no bots, no auto-filtering." },
                { num:"02", title:"We route it right",    desc:"Sales, support, or partnerships — it goes to the person who can actually help." },
                { num:"03", title:"You hear back fast",   desc:"Median reply time is under 4 hours on business days. We take that seriously." },
              ].map(({ num, title, desc }) => (
                <div key={num} style={{ padding:"32px 28px", border:"1px solid rgba(244,241,235,0.07)", borderRadius:2, transition:"border-color .3s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor="rgba(200,64,42,0.35)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor="rgba(244,241,235,0.07)"}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"var(--accent)", letterSpacing:1, marginBottom:12 }}>{num}</div>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, marginBottom:10 }}>{title}</h3>
                  <p style={{ fontSize:13, color:"rgba(244,241,235,0.4)", lineHeight:1.75, fontWeight:300 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop:"1px solid rgba(244,241,235,0.05)", padding:"36px 48px" }}>
          <div style={{ maxWidth:1280, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700, color:"var(--paper)" }}>AskBI</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"rgba(244,241,235,0.2)", letterSpacing:2 }}>© 2025 ASKBI. ALL RIGHTS RESERVED.</div>
            <div style={{ display:"flex", gap:28 }}>
              {["Privacy","Terms","Status"].map(l => (
                <span key={l} style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"rgba(244,241,235,0.3)", cursor:"pointer", transition:"color .2s" }}
                  onMouseEnter={e => e.target.style.color="var(--accent)"}
                  onMouseLeave={e => e.target.style.color="rgba(244,241,235,0.3)"}>{l}</span>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}