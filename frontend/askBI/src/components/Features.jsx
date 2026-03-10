import { useState } from "react";
import Navbar from "./Navbar";

/* ── Fonts & Global Styles ── */
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
      --muted: rgba(244,241,235,0.45);
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
    @keyframes fadeUp {
      from { opacity:0; transform:translateY(40px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes pulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(200,64,42,0.4); }
      50%      { box-shadow: 0 0 0 18px rgba(200,64,42,0); }
    }
    @keyframes marquee {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
    @keyframes scanline {
      0% { top: -10%; }
      100% { top: 110%; }
    }

    .fade-in-up { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both; }
    .float-a    { animation: floatA 7s ease-in-out infinite; }
    .float-b    { animation: floatB 9s ease-in-out infinite; }

    .feat-nav-link {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: rgba(244,241,235,0.5);
      cursor: pointer;
      transition: color 0.2s;
      text-decoration: none;
    }
    .feat-nav-link:hover { color: var(--accent); }

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

    .tab-btn {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 12px 24px;
      border: none;
      cursor: pointer;
      transition: all 0.25s;
    }

    .feature-card {
      border: 1px solid rgba(244,241,235,0.08);
      padding: 40px 32px;
      position: relative;
      transition: border-color 0.3s, transform 0.3s;
      cursor: default;
      overflow: hidden;
    }
    .feature-card:hover {
      border-color: var(--accent);
      transform: translateY(-4px);
    }
    .feature-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: var(--accent);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.4s ease;
    }
    .feature-card:hover::before { transform: scaleX(1); }

    .compare-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      border-bottom: 1px solid rgba(244,241,235,0.06);
      transition: background 0.2s;
    }
    .compare-row:hover { background: rgba(200,64,42,0.04); }

    .marquee-track {
      display: flex;
      gap: 64px;
      animation: marquee 24s linear infinite;
      white-space: nowrap;
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--ink); }
    ::-webkit-scrollbar-thumb { background: rgba(200,64,42,0.4); border-radius: 2px; }
  `}</style>
);

/* ── Stats Dial ── */
function StatsDial() {
  const [active, setActive] = useState(null);

  const stats = [
    { label: "Queries Answered", value: "2.4M+", sub: "and counting", color: "#C8402A",  pct: 0.92, angle: -90 },
    { label: "Avg Response",     value: "180ms",  sub: "per query",   color: "#C9A84C",  pct: 0.68, angle: 0   },
    { label: "Query Accuracy",   value: "94%",    sub: "first attempt",color: "#1A7FEB", pct: 0.94, angle: 90  },
    { label: "Enterprise Teams", value: "500+",   sub: "worldwide",   color: "#F4F1EB",  pct: 0.55, angle: 180 },
  ];

  const cx = 200, cy = 200, R = 130, r = 90, strokeW = 14;
  const circumference = 2 * Math.PI * R;

  function arcPath(pct, offsetAngle) {
    const dashLen = circumference * pct;
    const dashOffset = circumference * 0.25 - (circumference - dashLen) / 2;
    return { strokeDasharray: `${dashLen} ${circumference - dashLen}`, strokeDashoffset: circumference * 0.25 };
  }

  const activeIdx = active !== null ? active : -1;

  return (
    <section style={{
      borderTop: "1px solid rgba(244,241,235,0.06)",
      borderBottom: "1px solid rgba(244,241,235,0.06)",
      background: "rgba(244,241,235,0.012)",
      padding: "80px 48px"
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 400px", gap: 80, alignItems: "center" }}>

        {/* Left — label list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
            <div style={{ width: 32, height: 1, background: "var(--accent)" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: 3, color: "var(--accent)", textTransform: "uppercase" }}>By the numbers</span>
          </div>

          {stats.map((s, i) => (
            <div key={s.label}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              style={{
                display: "grid",
                gridTemplateColumns: "48px 1fr auto",
                alignItems: "center",
                gap: 20,
                padding: "20px 0",
                borderBottom: "1px solid rgba(244,241,235,0.06)",
                cursor: "default",
                transition: "padding-left 0.3s",
                paddingLeft: activeIdx === i ? 12 : 0,
              }}>
              {/* Dot */}
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: activeIdx === i ? s.color : "transparent",
                border: `1.5px solid ${activeIdx === i ? s.color : "rgba(244,241,235,0.15)"}`,
                transition: "all 0.3s",
                boxShadow: activeIdx === i ? `0 0 12px ${s.color}88` : "none",
              }} />
              {/* Label */}
              <div>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 17, fontWeight: 700,
                  color: activeIdx === i ? "var(--paper)" : "rgba(244,241,235,0.4)",
                  transition: "color 0.3s",
                  marginBottom: 2
                }}>{s.label}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 2, color: "rgba(244,241,235,0.2)", textTransform: "uppercase" }}>{s.sub}</div>
              </div>
              {/* Value */}
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 28, fontWeight: 900,
                color: activeIdx === i ? s.color : "rgba(244,241,235,0.15)",
                transition: "color 0.3s",
                letterSpacing: -1,
              }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Right — SVG dial */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <svg width="400" height="400" viewBox="0 0 400 400" style={{ overflow: "visible" }}>
            <defs>
              {stats.map((s, i) => (
                <filter key={i} id={`glow-${i}`} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              ))}
            </defs>

            {/* Outer ghost ring */}
            <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(244,241,235,0.04)" strokeWidth={strokeW} />

            {/* Tick marks */}
            {Array.from({ length: 36 }).map((_, i) => {
              const angle = (i / 36) * 2 * Math.PI - Math.PI / 2;
              const inner = R - strokeW / 2 - 6, outer = R + strokeW / 2 + 6;
              return (
                <line key={i}
                  x1={cx + Math.cos(angle) * inner} y1={cy + Math.sin(angle) * inner}
                  x2={cx + Math.cos(angle) * (i % 9 === 0 ? outer + 4 : inner + 4)}
                  y2={cy + Math.sin(angle) * (i % 9 === 0 ? outer + 4 : inner + 4)}
                  stroke="rgba(244,241,235,0.08)" strokeWidth={i % 9 === 0 ? 1.5 : 0.5}
                />
              );
            })}

            {/* Arc segments */}
            {stats.map((s, i) => {
              const startAngle = (i / 4) * 2 * Math.PI - Math.PI / 2;
              const endAngle = startAngle + (2 * Math.PI / 4) * 0.85;
              const segCirc = 2 * Math.PI * R;
              const segLen = (segCirc / 4) * 0.85 * s.pct;
              const gapOffset = segCirc * (i / 4) + (segCirc / 4) * 0.075;
              const isActive = activeIdx === i;

              return (
                <circle key={i} cx={cx} cy={cy} r={R}
                  fill="none"
                  stroke={isActive ? s.color : `${s.color}44`}
                  strokeWidth={isActive ? strokeW + 2 : strokeW}
                  strokeDasharray={`${segLen} ${segCirc - segLen}`}
                  strokeDashoffset={-gapOffset + segCirc * 0.25}
                  strokeLinecap="round"
                  filter={isActive ? `url(#glow-${i})` : "none"}
                  style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
                />
              );
            })}

            {/* Inner ring */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(244,241,235,0.04)" strokeWidth={1} />
            <circle cx={cx} cy={cy} r={r - 16} fill="none" stroke="rgba(244,241,235,0.03)" strokeWidth={1} strokeDasharray="3 6" />

            {/* Center content */}
            {activeIdx >= 0 ? (
              <>
                <text x={cx} y={cy - 14} textAnchor="middle" style={{ fontFamily: "'Playfair Display', serif" }}
                  fill={stats[activeIdx].color} fontSize={36} fontWeight={900}>{stats[activeIdx].value}</text>
                <text x={cx} y={cy + 12} textAnchor="middle" style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  fill="rgba(244,241,235,0.4)" fontSize={9} letterSpacing={2}>{stats[activeIdx].label.toUpperCase()}</text>
              </>
            ) : (
              <>
                <text x={cx} y={cy - 6} textAnchor="middle" style={{ fontFamily: "'Playfair Display', serif" }}
                  fill="rgba(244,241,235,0.15)" fontSize={13} fontWeight={400} letterSpacing={1}>HOVER TO</text>
                <text x={cx} y={cy + 14} textAnchor="middle" style={{ fontFamily: "'Playfair Display', serif" }}
                  fill="rgba(244,241,235,0.15)" fontSize={13} fontWeight={400} letterSpacing={1}>EXPLORE</text>
              </>
            )}

            {/* Cardinal dots */}
            {stats.map((s, i) => {
              const angle = (i / 4) * 2 * Math.PI - Math.PI / 2 + (2 * Math.PI / 8);
              const labelR = R + strokeW / 2 + 28;
              return (
                <circle key={`dot-${i}`}
                  cx={cx + Math.cos(angle) * labelR}
                  cy={cy + Math.sin(angle) * labelR}
                  r={3}
                  fill={activeIdx === i ? s.color : "rgba(244,241,235,0.12)"}
                  style={{ transition: "fill 0.3s" }}
                />
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}


/* ══════════════════════════════════════════════════════════ */
export default function FeaturesPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ["Query Engine", "Visualizations", "Integrations", "Security"];

  const tabContent = [
    {
      num: "01",
      tag: "LANGUAGE → SQL",
      headline: "Ask anything.\nGet exact data.",
      body: "Our fine-tuned LLM understands business intent, schema context, and query complexity. It generates optimized SQL, validates against your schema, and self-corrects on failure — all before a single row is fetched.",
      bullets: [
        "Multi-step query decomposition",
        "Dialect-aware SQL (Snowflake, BigQuery, Redshift, Postgres)",
        "94% first-attempt accuracy",
        "Auto-retry with self-correction up to 3×",
      ],
      visual: (
        <div style={{
          background: "rgba(6,8,14,0.97)",
          border: "1px solid rgba(244,241,235,0.08)",
          borderRadius: 2, overflow: "hidden"
        }}>
          <div style={{
            padding: "10px 16px",
            background: "rgba(244,241,235,0.03)",
            borderBottom: "1px solid rgba(244,241,235,0.06)",
            display: "flex", alignItems: "center", gap: 8
          }}>
            {["#C8402A", "#C9A84C", "#4CAF50"].map(c => (
              <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, opacity: 0.8 }} />
            ))}
            <span style={{ marginLeft: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(244,241,235,0.2)", letterSpacing: 2 }}>askbi — query engine</span>
          </div>
          <div style={{ padding: "24px 22px" }}>
            {[
              { color: "rgba(200,64,42,0.9)", text: '> "Show me top 5 campaigns by ROI this quarter"' },
              { color: "rgba(244,241,235,0.15)", text: "" },
              { color: "rgba(244,241,235,0.3)", text: "-- Generated SQL" },
              { color: "rgba(26,127,235,0.85)", text: "SELECT  campaign_name," },
              { color: "rgba(244,241,235,0.6)", text: "        ROUND(revenue/spend,2) AS roi" },
              { color: "rgba(26,127,235,0.85)", text: "FROM    campaigns" },
              { color: "rgba(26,127,235,0.85)", text: "WHERE   quarter = CURRENT_QUARTER()" },
              { color: "rgba(26,127,235,0.85)", text: "ORDER BY roi DESC  LIMIT 5" },
              { color: "rgba(244,241,235,0.15)", text: "" },
              { color: "#4CAF50", text: "✓  Validated · 8 rows · 143ms" },
            ].map((l, i) => (
              <div key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, lineHeight: 1.9, color: l.color }}>
                {l.text || "\u00a0"}
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      num: "02",
      tag: "DATA → CHART",
      headline: "The right chart,\nevery time.",
      body: "AskBI reads your data shape and query intent to automatically select the most appropriate visualization — bar, line, scatter, funnel, heatmap, and more. Every chart is interactive and drill-down ready.",
      bullets: [
        "12 chart types auto-selected by intent",
        "Drill-down on any data point",
        "One-click PDF & PNG export",
        "Embeddable iframes — no login required",
      ],
      visual: (
        <div style={{
          background: "rgba(6,8,14,0.97)",
          border: "1px solid rgba(244,241,235,0.08)",
          borderRadius: 2, padding: "28px 24px"
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(244,241,235,0.3)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 24 }}>
            Campaign ROI — Q1 2025
          </div>
          {[
            { label: "Email",       val: 95, color: "#4CAF50" },
            { label: "Paid Search", val: 88, color: "var(--accent)" },
            { label: "Social Ads",  val: 72, color: "var(--electric)" },
            { label: "Influencer",  val: 63, color: "var(--gold)" },
            { label: "Display",     val: 41, color: "rgba(244,241,235,0.3)" },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(244,241,235,0.5)", letterSpacing: 1 }}>{label}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color, fontWeight: 600 }}>{val}%</span>
              </div>
              <div style={{ height: 2, background: "rgba(244,241,235,0.06)", borderRadius: 1, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${val}%`, background: color, borderRadius: 1, transition: "width .8s ease" }} />
              </div>
            </div>
          ))}
          <div style={{
            marginTop: 24, padding: "12px 16px",
            borderLeft: "2px solid #4CAF50",
            background: "rgba(76,175,80,0.06)"
          }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(76,175,80,0.8)" }}>
              ✓  AI insight: Email leads at 95% ROI — 8% above average
            </p>
          </div>
        </div>
      )
    },
    {
      num: "03",
      tag: "CONNECT EVERYTHING",
      headline: "Plug in.\nAsk questions.",
      body: "AskBI connects to your existing data stack in minutes. One connector, zero ETL. Your data never moves — we query it in place, keeping your warehouse as the single source of truth.",
      bullets: [
        "Snowflake, BigQuery, Redshift, Postgres",
        "dbt-aware — respects your semantic layer",
        "Cross-source joins in a single question",
        "REST API for custom integrations",
      ],
      visual: (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          {[
            { name: "Snowflake",  color: "#29B5E8", icon: "❄️", status: "Connected" },
            { name: "BigQuery",   color: "#4285F4", icon: "◉",  status: "Connected" },
            { name: "Redshift",   color: "var(--accent)", icon: "⬡", status: "Connected" },
            { name: "PostgreSQL", color: "var(--electric)", icon: "🐘", status: "Connected" },
            { name: "Databricks", color: "var(--gold)", icon: "◈",  status: "Available" },
            { name: "dbt Core",   color: "rgba(244,241,235,0.3)", icon: "◻", status: "Available" },
          ].map(({ name, color, icon, status }) => (
            <div key={name} style={{
              background: "rgba(6,8,14,0.97)",
              border: "1px solid rgba(244,241,235,0.08)",
              padding: "20px 18px",
              display: "flex", alignItems: "center", gap: 14,
              transition: "border-color 0.25s, transform 0.2s",
              cursor: "default"
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(244,241,235,0.08)"; e.currentTarget.style.transform = "none"; }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
              <div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "rgba(244,241,235,0.85)", marginBottom: 4 }}>{name}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: 2, color: status === "Connected" ? "#4CAF50" : "rgba(244,241,235,0.25)" }}>
                  {status === "Connected" && "● "}{status.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      num: "04",
      tag: "ENTERPRISE-GRADE",
      headline: "Your data\nstays yours.",
      body: "AskBI was built with security-first architecture. Raw data never leaves your warehouse. Only schema metadata and query text touch our infrastructure — and neither is ever used for model training.",
      bullets: [
        "SOC 2 Type II certified",
        "Row-level security & RBAC",
        "SSO via SAML 2.0 & OIDC",
        "Zero data retention on our servers",
      ],
      visual: (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            { icon: "⬛", title: "Zero data leakage",   desc: "Raw warehouse data never passes through AskBI servers." },
            { icon: "◈",  title: "SOC 2 Type II",       desc: "Annually audited. Available under NDA." },
            { icon: "◉",  title: "Row-level security",  desc: "Enforces your warehouse permissions — no overrides." },
            { icon: "⬡",  title: "SSO / SAML 2.0",     desc: "Works with Okta, Azure AD, Google Workspace." },
            { icon: "◻",  title: "Full audit logs",     desc: "Every query, every user, every result — fully logged." },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{
              display: "flex", alignItems: "center", gap: 20,
              padding: "18px 20px",
              background: "rgba(6,8,14,0.97)",
              border: "1px solid rgba(244,241,235,0.08)",
              transition: "border-color 0.25s",
              cursor: "default"
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(76,175,80,0.4)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(244,241,235,0.08)"}>
              <span style={{ fontSize: 16, flexShrink: 0, color: "rgba(244,241,235,0.3)" }}>{icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "rgba(244,241,235,0.85)", marginBottom: 2 }}>{title}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(244,241,235,0.35)", fontWeight: 300 }}>{desc}</div>
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9, color: "#4CAF50", letterSpacing: 1
              }}>✓</div>
            </div>
          ))}
        </div>
      )
    },
  ];

  const allFeatures = [
    { num: "01", title: "Natural Language Queries",     desc: "Ask in plain English. No SQL, no training required.",              color: "var(--accent)",   tag: "NLQ" },
    { num: "02", title: "Sub-200ms Response",           desc: "Query, render, and deliver dashboards in under a second.",         color: "var(--gold)",     tag: "SPEED" },
    { num: "03", title: "Auto Chart Selection",         desc: "AI picks the right visualization based on data shape and intent.", color: "var(--electric)", tag: "VIZ" },
    { num: "04", title: "Multi-source Joins",           desc: "Combine Snowflake + Postgres in one question. No ETL.",            color: "#4CAF50",         tag: "CONNECT" },
    { num: "05", title: "Zero Data Leakage",            desc: "Raw data never leaves your warehouse. Ever.",                      color: "var(--accent)",   tag: "SECURITY" },
    { num: "06", title: "One-Click Share",              desc: "Shareable links, embeds, PDF — no login required to view.",        color: "var(--gold)",     tag: "SHARE" },
    { num: "07", title: "Auto-Retry & Self-Correction", desc: "Failed queries are re-generated and corrected automatically.",     color: "var(--electric)", tag: "RESILIENCE" },
    { num: "08", title: "Schema-Aware Engine",          desc: "Indexes your full schema on connect. Always query-safe.",          color: "#4CAF50",         tag: "SCHEMA" },
    { num: "09", title: "Fine-tuned LLM",               desc: "Trained on 2M+ business analytics pairs — not a prompt wrapper.", color: "var(--accent)",   tag: "AI" },
  ];

  const marqueeItems = [
    "Natural Language", "→", "Instant Insights", "→",
    "No SQL Required", "→", "Real-Time KPIs", "→",
    "AI-Powered BI", "→", "Zero ETL", "→",
    "Natural Language", "→", "Instant Insights", "→",
    "No SQL Required", "→", "Real-Time KPIs", "→",
    "AI-Powered BI", "→", "Zero ETL", "→",
  ];

  const active = tabContent[activeTab];

  return (
    <>
      <FontLink />
      <div style={{ minHeight: "100vh", background: "var(--ink)", color: "var(--paper)", fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>

        <Navbar onNavigate={onNavigate} active="features" />

        {/* ── HERO ── */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 60 }}>

          {/* Floating blobs */}
          <div className="float-a" style={{
            position: "absolute", top: "15%", right: "6%",
            width: 360, height: 360,
            background: "radial-gradient(circle at 40% 40%, rgba(200,64,42,0.14), transparent 70%)",
            borderRadius: "50%", pointerEvents: "none"
          }} />
          <div className="float-b" style={{
            position: "absolute", bottom: "12%", left: "3%",
            width: 260, height: 260,
            background: "radial-gradient(circle at 60% 60%, rgba(26,127,235,0.1), transparent 70%)",
            borderRadius: "50%", pointerEvents: "none"
          }} />

          {/* Fine grid */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: `
              linear-gradient(rgba(244,241,235,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(244,241,235,0.02) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px"
          }} />

          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", width: "100%", position: "relative", zIndex: 1 }}>

            {/* Eyebrow */}
            <div className="fade-in-up" style={{ animationDelay: "0.1s", display: "flex", alignItems: "center", gap: 16, marginBottom: 36 }}>
              <div style={{ width: 32, height: 1, background: "var(--accent)" }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: 3, color: "var(--accent)", textTransform: "uppercase" }}>
                Features
              </span>
            </div>

            {/* Headline */}
            <h1 className="fade-in-up" style={{
              animationDelay: "0.2s",
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(52px, 8vw, 108px)",
              fontWeight: 900, lineHeight: 0.95,
              letterSpacing: -3, marginBottom: 48
            }}>
              <span>Built for</span><br />
              <span style={{ fontStyle: "italic", color: "var(--accent)" }}>modern</span><br />
              <span>teams.</span>
            </h1>

            {/* Sub copy */}
            <div className="fade-in-up" style={{
              animationDelay: "0.35s",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48, maxWidth: 860
            }}>
              <p style={{ fontSize: 16, color: "rgba(244,241,235,0.5)", lineHeight: 1.85, fontWeight: 300 }}>
                Nine tightly integrated capabilities — from natural language parsing to enterprise security — that replace an entire BI stack.
              </p>
              <p style={{ fontSize: 16, color: "rgba(244,241,235,0.5)", lineHeight: 1.85, fontWeight: 300 }}>
                Everything you need. Nothing you don't. Built for the way analysts, executives, and operators actually work.
              </p>
            </div>


          </div>

          {/* Corner index label */}
          <div style={{
            position: "absolute", bottom: 40, right: 48,
            display: "flex", alignItems: "center", gap: 12
          }}>
            <div style={{ width: 24, height: 1, background: "rgba(244,241,235,0.15)" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: 3, color: "rgba(244,241,235,0.2)", textTransform: "uppercase" }}>Features / 01</span>
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

        {/* ── STATS — Orbital dial ── */}
        <StatsDial />

        {/* ── DEEP-DIVE TABS ── */}
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "120px 48px" }}>

          {/* Section heading */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 64 }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 52, fontWeight: 900, lineHeight: 1, letterSpacing: -2
            }}>
              Under the<br /><em style={{ color: "var(--accent)" }}>hood.</em>
            </h2>
            <p style={{ maxWidth: 320, fontSize: 14, color: "rgba(244,241,235,0.4)", lineHeight: 1.8, fontWeight: 300 }}>
              Four core systems that power every query, chart, and connection in AskBI.
            </p>
          </div>

          {/* Tab bar */}
          <div style={{
            display: "flex",
            borderBottom: "1px solid rgba(244,241,235,0.08)",
            marginBottom: 72, gap: 0
          }}>
            {tabs.map((t, i) => (
              <button key={t} onClick={() => setActiveTab(i)} className="tab-btn" style={{
                background: "transparent",
                color: activeTab === i ? "var(--paper)" : "rgba(244,241,235,0.3)",
                borderBottom: activeTab === i ? "2px solid var(--accent)" : "2px solid transparent",
                marginBottom: -1,
              }}>
                <span style={{ color: activeTab === i ? "var(--accent)" : "rgba(244,241,235,0.2)", marginRight: 8 }}>
                  0{i + 1}
                </span>
                {t}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div key={activeTab} style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "start",
            animation: "fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both"
          }}>
            {/* Left — text */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 3, color: "rgba(244,241,235,0.3)", textTransform: "uppercase" }}>
                  {active.num} / {active.tag}
                </span>
                <div style={{ flex: 1, height: 1, background: "rgba(244,241,235,0.08)" }} />
              </div>

              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(32px, 3.5vw, 50px)",
                fontWeight: 800, lineHeight: 1.1,
                letterSpacing: -1, marginBottom: 24
              }}>
                {active.headline.split("\n").map((line, i) => (
                  <span key={i}>{i === 1 ? <em style={{ color: "var(--accent)" }}>{line}</em> : line}{i < active.headline.split("\n").length - 1 && <br />}</span>
                ))}
              </h2>

              <p style={{ fontSize: 15, color: "rgba(244,241,235,0.5)", lineHeight: 1.9, fontWeight: 300, marginBottom: 36 }}>
                {active.body}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {active.bullets.map((b, i) => (
                  <div key={b} style={{
                    display: "flex", alignItems: "center", gap: 16,
                    padding: "14px 0",
                    borderBottom: i < active.bullets.length - 1 ? "1px solid rgba(244,241,235,0.06)" : "none"
                  }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--accent)", letterSpacing: 1, flexShrink: 0 }}>
                      0{i + 1}
                    </span>
                    <span style={{ fontSize: 14, color: "rgba(244,241,235,0.6)", fontWeight: 300 }}>{b}</span>
                  </div>
                ))}
              </div>


            </div>

            {/* Right — visual */}
            <div>{active.visual}</div>
          </div>
        </section>

        {/* ── ALL FEATURES GRID ── */}
        <section style={{
          borderTop: "1px solid rgba(244,241,235,0.06)",
          borderBottom: "1px solid rgba(244,241,235,0.06)",
          background: "rgba(244,241,235,0.015)",
          padding: "120px 48px"
        }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 64 }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 52, fontWeight: 900, lineHeight: 1, letterSpacing: -2
              }}>
                Nine features.<br /><em style={{ color: "var(--accent)" }}>One platform.</em>
              </h2>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 3, color: "rgba(244,241,235,0.3)", textTransform: "uppercase" }}>
                Full Capability List
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2 }}>
              {allFeatures.map(({ num, title, desc, color, tag }) => (
                <div key={title} className="feature-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--accent)", letterSpacing: 1 }}>{num}</span>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 9, letterSpacing: 2,
                      color: "rgba(244,241,235,0.2)",
                      border: "1px solid rgba(244,241,235,0.08)",
                      padding: "4px 8px"
                    }}>{tag}</span>
                  </div>
                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 20, fontWeight: 700,
                    letterSpacing: -0.5, marginBottom: 12,
                    color: "var(--paper)"
                  }}>{title}</h3>
                  <p style={{ fontSize: 13, color: "rgba(244,241,235,0.4)", lineHeight: 1.8, fontWeight: 300 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── COMPARISON TABLE ── */}
        <section style={{ maxWidth: 1000, margin: "0 auto", padding: "120px 48px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 56 }}>
            <div style={{ width: 32, height: 1, background: "var(--accent)" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: 3, color: "var(--accent)", textTransform: "uppercase" }}>
              AskBI vs Traditional BI
            </span>
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 52, fontWeight: 900, lineHeight: 1, letterSpacing: -2, marginBottom: 56
          }}>
            Why teams<br /><em style={{ color: "var(--accent)" }}>switch.</em>
          </h2>

          <div style={{ border: "1px solid rgba(244,241,235,0.08)" }}>
            {/* Header */}
            <div className="compare-row" style={{
              background: "rgba(244,241,235,0.03)",
              borderBottom: "1px solid rgba(244,241,235,0.08)"
            }}>
              <div style={{ padding: "16px 28px", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 2, color: "rgba(244,241,235,0.25)", textTransform: "uppercase" }}>Capability</div>
              <div style={{ padding: "16px 28px", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 2, color: "var(--accent)", textAlign: "center", textTransform: "uppercase" }}>AskBI</div>
              <div style={{ padding: "16px 28px", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 2, color: "rgba(244,241,235,0.25)", textAlign: "center", textTransform: "uppercase" }}>Traditional BI</div>
            </div>
            {[
              { cap: "Setup time",          askbi: "< 5 minutes",  trad: "Days to weeks" },
              { cap: "SQL required",        askbi: "Never",        trad: "Always" },
              { cap: "Time to first chart", askbi: "30 seconds",   trad: "Hours" },
              { cap: "Schema awareness",    askbi: "Automatic",    trad: "Manual config" },
              { cap: "Non-technical users", askbi: "First-class",  trad: "Not supported" },
              { cap: "Data stays in place", askbi: "Always",       trad: "Depends" },
            ].map(({ cap, askbi, trad }, i) => (
              <div key={cap} className="compare-row">
                <div style={{ padding: "18px 28px", fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(244,241,235,0.55)", fontWeight: 300 }}>{cap}</div>
                <div style={{ padding: "18px 28px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: "var(--accent)", textAlign: "center" }}>{askbi}</div>
                <div style={{ padding: "18px 28px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(244,241,235,0.2)", textAlign: "center" }}>{trad}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── MANIFESTO CTA ── */}
        <section style={{
          background: "var(--paper)",
          padding: "120px 48px",
          position: "relative",
          overflow: "hidden"
        }}>
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
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 3, color: "rgba(10,11,16,0.4)", textTransform: "uppercase" }}>
                See it Live
              </span>
            </div>

            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(28px, 4vw, 52px)",
              fontWeight: 700, lineHeight: 1.25,
              color: "var(--ink)", maxWidth: 900,
              letterSpacing: -1.5
            }}>
              "See every feature live in 30 seconds. No setup. No SQL.{" "}
              <em style={{ color: "var(--accent)" }}>No credit card.</em> Just your first question."
            </p>

            <div style={{ marginTop: 56, display: "flex", gap: 20 }}>
              <button className="cta-btn" style={{ background: "var(--ink)", color: "var(--paper)" }} onClick={onNavigate}>
                Get Started →
              </button>
              <button className="cta-btn" style={{ background: "transparent", color: "var(--ink)", border: "1.5px solid var(--ink)" }}>
                Book a Demo
              </button>
            </div>

            <p style={{ marginTop: 24, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 2, color: "rgba(10,11,16,0.3)" }}>
              NO CREDIT CARD REQUIRED · 2-MINUTE SETUP · CANCEL ANYTIME
            </p>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: "1px solid rgba(244,241,235,0.06)", padding: "40px 48px" }}>
          <div style={{
            maxWidth: 1280, margin: "0 auto",
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "var(--paper)" }}>
              AskBI
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(244,241,235,0.2)", letterSpacing: 2 }}>
              © 2025 ASKBI · CONVERSATIONAL BUSINESS INTELLIGENCE
            </div>
            <div style={{ display: "flex", gap: 32 }}>
              {["Privacy", "Terms", "GitHub"].map(l => (
                <span key={l} className="feat-nav-link" style={{ fontSize: 10 }}>{l}</span>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}