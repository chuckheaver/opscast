// Private "Field Kit" index: every neighborhood, linking to its tour-script
// page. Not linked from anywhere public and no-indexed — reachable only by
// knowing the URL (/field).

import Link from "next/link";
import { NAMES, slugify } from "./lib";
import { SCRIPTS } from "./scripts";

export const metadata = {
  title: "Field Kit",
  robots: { index: false, follow: false },
};

export default function Page() {
  const ready = NAMES.filter(n => SCRIPTS[n]);
  return (
    <main style={{ maxWidth: 760, minHeight: "100vh", margin: "0 auto", padding: "24px 18px 120px", background: "#fff", color: "#1c1917", fontFamily: "system-ui, -apple-system, sans-serif", boxShadow: "0 0 40px rgba(0,0,0,0.25)" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1c1917", margin: "0 0 4px", letterSpacing: "-0.5px" }}>Field Kit</h1>
      <p style={{ fontSize: 14, color: "#78716c", margin: "0 0 4px" }}>Neighborhood-tour scripts, B-roll, and shoot schedules — private, just for you.</p>
      <p style={{ fontSize: 13, color: "#a8a29e", margin: "0 0 20px" }}>{ready.length} of {NAMES.length} scripts ready.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
        {NAMES.map(n => {
          const done = !!SCRIPTS[n];
          return (
            <Link
              key={n}
              href={`/field/${slugify(n)}`}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8,
                padding: "9px 12px", borderRadius: 8, textDecoration: "none",
                border: "1px solid " + (done ? "#bfdbfe" : "#ece8df"),
                background: done ? "#eff6ff" : "#fff",
                color: "#1c1917", fontSize: 14, fontWeight: 600,
              }}
            >
              <span>{n}</span>
              <span style={{ fontSize: 11, color: done ? "#2563eb" : "#a8a29e", fontWeight: 600 }}>{done ? "✓ ready" : "pending"}</span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
