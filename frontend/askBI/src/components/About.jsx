import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";

/* ── Fonts ── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ink: #0A0B10;
      --paper: #F4F1EB;
      --accent: #C8402A;
      --electric: #1A7FEB;
      --gold: #C9A84C;
      --muted: rgba(10,11,16,0.45);
    }

    body { background: var(--ink); }

    @keyframes floatA {
      0%,100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-22px) rotate(3deg); }
    }
    @keyframes floatB {
      0%,100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(18px) rotate(-4deg); }
    }
    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    @keyframes fadeUp {
      from { opacity:0; transform:translateY(40px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes revealWidth {
      from { width: 0; }
      to   { width: 100%; }
    }
    @keyframes pulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(200,64,42,0.4); }
      50%      { box-shadow: 0 0 0 18px rgba(200,64,42,0); }
    }
    @keyframes countUp {
      from { opacity:0; transform:scale(0.7); }
      to   { opacity:1; transform:scale(1); }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }

    .fade-in-up { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both; }
    .float-a    { animation: floatA 7s ease-in-out infinite; }
    .float-b    { animation: floatB 9s ease-in-out infinite; }

    .nav-link {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: rgba(244,241,235,0.5);
      cursor: pointer;
      transition: color 0.2s;
      text-decoration: none;
    }
    .nav-link:hover { color: var(--accent); }

    .stat-card {
      border: 1px solid rgba(244,241,235,0.08);
      border-radius: 2px;
      padding: 32px 28px;
      transition: border-color 0.3s, transform 0.3s;
      cursor: default;
    }
    .stat-card:hover {
      border-color: var(--accent);
      transform: translateY(-4px);
    }

    .feature-row {
      border-bottom: 1px solid rgba(244,241,235,0.08);
      padding: 28px 0;
      display: grid;
      grid-template-columns: 56px 1fr 1fr;
      gap: 24px;
      align-items: start;
      transition: background 0.3s;
      cursor: default;
    }
    .feature-row:hover {
      background: rgba(200,64,42,0.04);
      padding-left: 12px;
    }
    .feature-row:first-child { border-top: 1px solid rgba(244,241,235,0.08); }

    .cta-btn {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 16px 36px;
      background: var(--accent);
      color: var(--paper);
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      border: none;
      cursor: pointer;
      transition: background 0.25s, transform 0.2s;
      border-radius: 1px;
    }
    .cta-btn:hover { background: #a33220; transform: translateY(-2px); }

    .marquee-track {
      display: flex;
      gap: 64px;
      animation: marquee 20s linear infinite;
      white-space: nowrap;
    }
    @keyframes marquee {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
  `}</style>
);

/* ── Animated Counter ── */
function Counter({ target, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setCount(Math.floor(ease * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}


/* ── Main ── */
export default function AboutPage({ onNavigate }) {

  const features = [
    {
      num: "01",
      title: "Natural Language Queries",
      desc: "Ask in plain English. No SQL. No configuration. Just questions and answers.",
      tag: "LANGUAGE → DATA"
    },
    {
      num: "02",
      title: "Adaptive Visualizations",
      desc: "The AI reads your intent and selects the optimal chart type automatically.",
      tag: "DATA → INSIGHT"
    },
    {
      num: "03",
      title: "Real-Time Dashboards",
      desc: "Live KPI panels and drill-down charts generated in under two seconds.",
      tag: "INSIGHT → ACTION"
    },
    {
      num: "04",
      title: "Collaborative Reports",
      desc: "Share findings as interactive documents. No screenshots, no stale decks.",
      tag: "ACTION → IMPACT"
    },
  ];

  const stats = [
    { value: 12, suffix: "s", label: "Avg. dashboard generation" },
    { value: 94, suffix: "%", label: "Query accuracy rate" },
    { value: 3, suffix: "x", label: "Faster than traditional BI" },
    { value: 200, suffix: "+", label: "Enterprise customers" },
  ];

  const marqueeItems = [
    "Natural Language", "→", "Instant Insights", "→",
    "No Code Required", "→", "Real-Time KPIs", "→",
    "AI-Powered BI", "→", "Zero SQL", "→",
    "Natural Language", "→", "Instant Insights", "→",
    "No Code Required", "→", "Real-Time KPIs", "→",
    "AI-Powered BI", "→", "Zero SQL", "→",
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)", color: "var(--paper)", fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>
      <FontLink />
      <Navbar onNavigate={onNavigate} active="about" />

      {/* ── HERO ── */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 60 }}>

        {/* Floating shapes */}
        <div className="float-a" style={{
          position: "absolute", top: "18%", right: "8%",
          width: 320, height: 320,
          background: "radial-gradient(circle at 40% 40%, rgba(200,64,42,0.18), transparent 70%)",
          borderRadius: "50%", pointerEvents: "none"
        }} />
        <div className="float-b" style={{
          position: "absolute", bottom: "15%", left: "5%",
          width: 240, height: 240,
          background: "radial-gradient(circle at 60% 60%, rgba(26,127,235,0.14), transparent 70%)",
          borderRadius: "50%", pointerEvents: "none"
        }} />

        {/* Fine grid overlay */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `
            linear-gradient(rgba(244,241,235,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(244,241,235,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px"
        }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", width: "100%", position: "relative", zIndex: 1 }}>

          {/* Eyebrow */}
          <div className="fade-in-up" style={{ animationDelay: "0.1s", display: "flex", alignItems: "center", gap: 16, marginBottom: 36 }}>
            <div style={{ width: 32, height: 1, background: "var(--accent)" }} />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, letterSpacing: 3,
              color: "var(--accent)", textTransform: "uppercase"
            }}>About AskBI</span>
          </div>

          {/* Big headline */}
          <h1 className="fade-in-up" style={{
            animationDelay: "0.2s",
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(52px, 8vw, 110px)",
            fontWeight: 900, lineHeight: 0.95,
            letterSpacing: -3,
            marginBottom: 48
          }}>
            <span>Business</span><br />
            <span style={{ fontStyle: "italic", color: "var(--accent)" }}>Intelligence</span><br />
            <span>Reimagined.</span>
          </h1>

          {/* Two-column sub */}
          <div className="fade-in-up" style={{
            animationDelay: "0.35s",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            maxWidth: 860
          }}>
            <p style={{ fontSize: 16, color: "rgba(244,241,235,0.55)", lineHeight: 1.85, fontWeight: 300 }}>
              AskBI is a conversational AI platform that transforms natural
              language into powerful business intelligence — no SQL,
              no configuration, no waiting on data teams.
            </p>
            <p style={{ fontSize: 16, color: "rgba(244,241,235,0.55)", lineHeight: 1.85, fontWeight: 300 }}>
              We believe every business decision should be informed by data.
              We built AskBI so that everyone — not just analysts — can
              access the insights they need, instantly.
            </p>
          </div>

          {/* CTA row */}
          <div className="fade-in-up" style={{ animationDelay: "0.5s", display: "flex", gap: 20, marginTop: 56, alignItems: "center" }}>
            <button className="cta-btn">Request Demo →</button>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, color: "rgba(244,241,235,0.35)",
              letterSpacing: 2, cursor: "pointer"
            }}>Watch Video ↓</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8
        }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: 3, color: "rgba(244,241,235,0.3)", textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(200,64,42,0.7), transparent)" }} />
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{
        overflow: "hidden", padding: "20px 0",
        background: "var(--accent)",
        borderTop: "1px solid rgba(0,0,0,0.1)",
        borderBottom: "1px solid rgba(0,0,0,0.1)"
      }}>
        <div className="marquee-track">
          {marqueeItems.map((item, i) => (
            <span key={i} style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12, letterSpacing: 2,
              color: item === "→" ? "rgba(244,241,235,0.5)" : "var(--paper)",
              fontWeight: item === "→" ? 300 : 600,
              textTransform: "uppercase"
            }}>{item}</span>
          ))}
        </div>
      </div>

      {/* ── PROBLEM / SOLUTION ── */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "120px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>

          {/* Problem */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 3, color: "rgba(244,241,235,0.3)", textTransform: "uppercase" }}>01 / Problem</span>
              <div style={{ flex: 1, height: 1, background: "rgba(244,241,235,0.08)" }} />
            </div>

            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 38, fontWeight: 700, lineHeight: 1.15,
              marginBottom: 24, letterSpacing: -1
            }}>
              Data locked behind<br /><em style={{ color: "var(--accent)" }}>technical barriers</em>
            </h2>

            <p style={{ color: "rgba(244,241,235,0.5)", lineHeight: 1.9, fontSize: 15, fontWeight: 300 }}>
              Business users depend on data teams for every query. Traditional BI tools
              demand SQL fluency, schema knowledge, and hours of configuration.
              Decisions stall. Opportunities vanish. Teams burn out.
            </p>

            {/* Quote callout */}
            <div style={{
              marginTop: 40, padding: "24px 28px",
              borderLeft: "3px solid var(--accent)",
              background: "rgba(200,64,42,0.06)"
            }}>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 17, fontStyle: "italic",
                color: "rgba(244,241,235,0.7)", lineHeight: 1.7
              }}>
                "The average data team ticket backlog is 47 requests.
                 Average wait time: 11 days."
              </p>
              <p style={{ marginTop: 12, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 2, color: "rgba(244,241,235,0.3)" }}>
                — STATE OF BI REPORT, 2024
              </p>
            </div>
          </div>

          {/* Solution */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 3, color: "rgba(244,241,235,0.3)", textTransform: "uppercase" }}>02 / Solution</span>
              <div style={{ flex: 1, height: 1, background: "rgba(244,241,235,0.08)" }} />
            </div>

            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 38, fontWeight: 700, lineHeight: 1.15,
              marginBottom: 24, letterSpacing: -1
            }}>
              Ask a question.<br /><em style={{ color: "#1A7FEB" }}>Get an answer.</em>
            </h2>

            <p style={{ color: "rgba(244,241,235,0.5)", lineHeight: 1.9, fontSize: 15, fontWeight: 300 }}>
              AskBI uses large language models to translate plain English into
              structured queries and interactive visualizations — instantly.
              Any user, any question, zero engineering required.
            </p>

            {/* Fake terminal */}
            <div style={{
              marginTop: 40, background: "rgba(8,10,18,0.9)",
              border: "1px solid rgba(244,241,235,0.08)",
              borderRadius: 4, overflow: "hidden"
            }}>
              <div style={{
                padding: "10px 16px",
                background: "rgba(244,241,235,0.04)",
                borderBottom: "1px solid rgba(244,241,235,0.06)",
                display: "flex", alignItems: "center", gap: 8
              }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#C8402A", opacity: 0.8 }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#C9A84C", opacity: 0.8 }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#4CAF50", opacity: 0.8 }} />
                <span style={{ marginLeft: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(244,241,235,0.25)" }}>askbi — query</span>
              </div>
              <div style={{ padding: "20px 20px 24px" }}>
                {[
                  { prompt: "> ", text: "Show me Q3 revenue by region vs last year", color: "rgba(244,241,235,0.7)" },
                  { prompt: "  ", text: "Generating chart... ████████░░ 80%", color: "rgba(26,127,235,0.6)" },
                  { prompt: "✓ ", text: "Bar chart ready — APAC +23% YoY", color: "#4CAF50" },
                ].map((line, i) => (
                  <div key={i} style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12, color: line.color,
                    lineHeight: 1.9
                  }}>
                    <span style={{ opacity: 0.4 }}>{line.prompt}</span>{line.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{
        borderTop: "1px solid rgba(244,241,235,0.06)",
        borderBottom: "1px solid rgba(244,241,235,0.06)",
        background: "rgba(244,241,235,0.015)"
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 48px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2 }}>
            {stats.map((s, i) => (
              <div key={i} className="stat-card" style={{ textAlign: i % 2 === 0 ? "left" : "right" }}>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 58, fontWeight: 900,
                  color: i === 0 ? "var(--accent)" : i === 1 ? "#C9A84C" : i === 2 ? "#1A7FEB" : "var(--paper)",
                  lineHeight: 1, marginBottom: 12
                }}>
                  <Counter target={s.value} suffix={s.suffix} />
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 2, color: "rgba(244,241,235,0.35)", textTransform: "uppercase" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "120px 48px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 64 }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 52, fontWeight: 900, lineHeight: 1,
            letterSpacing: -2
          }}>
            How it<br /><em style={{ color: "var(--accent)" }}>works</em>
          </h2>
          <p style={{ maxWidth: 320, fontSize: 14, color: "rgba(244,241,235,0.4)", lineHeight: 1.8, fontWeight: 300 }}>
            Four capabilities that replace an entire BI stack.
          </p>
        </div>

        <div>
          {features.map((f, i) => (
            <div key={i} className="feature-row">
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--accent)", letterSpacing: 1 }}>
                {f.num}
              </span>
              <div>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 22, fontWeight: 700, marginBottom: 8,
                  letterSpacing: -0.5
                }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(244,241,235,0.45)", lineHeight: 1.75, fontWeight: 300 }}>{f.desc}</p>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start", paddingTop: 4 }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10, letterSpacing: 2,
                  color: "rgba(244,241,235,0.2)",
                  border: "1px solid rgba(244,241,235,0.1)",
                  padding: "6px 12px"
                }}>{f.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MANIFESTO BLOCK ── */}
      <section style={{
        background: "var(--paper)",
        padding: "120px 48px",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decorative big letter */}
        <div style={{
          position: "absolute", right: -20, top: -40,
          fontFamily: "'Playfair Display', serif",
          fontSize: 400, fontWeight: 900,
          color: "rgba(10,11,16,0.04)",
          lineHeight: 1, userSelect: "none", pointerEvents: "none"
        }}>BI</div>

        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48 }}>
            <div style={{ width: 40, height: 1, background: "var(--ink)" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 3, color: "rgba(10,11,16,0.4)", textTransform: "uppercase" }}>Our Belief</span>
          </div>

          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(28px, 4vw, 52px)",
            fontWeight: 700, lineHeight: 1.25,
            color: "var(--ink)", maxWidth: 900,
            letterSpacing: -1.5
          }}>
            "Every person in your organization deserves to ask questions
            of their data — and get answers{" "}
            <em style={{ color: "var(--accent)" }}>in the time it takes
            to form the thought.</em>"
          </p>

          <div style={{ marginTop: 56, display: "flex", gap: 20 }}>
            <button className="cta-btn" style={{ background: "var(--ink)", color: "var(--paper)" }}>
              Start for Free →
            </button>
            <button className="cta-btn" style={{ background: "transparent", color: "var(--ink)", border: "1.5px solid var(--ink)" }}>
              Talk to Sales
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid rgba(244,241,235,0.06)",
        padding: "40px 48px"
      }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "var(--paper)" }}>
            AskBI
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(244,241,235,0.2)", letterSpacing: 2 }}>
            © 2025 ASKBI. ALL RIGHTS RESERVED.
          </div>
          <div style={{ display: "flex", gap: 32 }}>
            {["Privacy", "Terms", "Status"].map(l => (
              <span key={l} className="nav-link" style={{ fontSize: 10 }}>{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}