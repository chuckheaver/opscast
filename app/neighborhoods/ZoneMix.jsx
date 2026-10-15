// A neighborhood's mix of fog zones, shown beside its zone pill on the guide
// cards, the guide page and the fog map's neighborhood pop-up, so all three
// read the same way: a thin bar with one segment per zone it covers, sized by
// its share of the ground, in the pill's colours.
//
// `mix` is { Sun, Transition, Fog, "Persistent Fog" } as fractions of the
// ground (scripts/build-neighborhood-fog-zones.mjs). The text line appears
// only when the neighborhood really spans zones — two or more at 5%+ and none
// at 95%+ — so a card for a one-zone neighborhood keeps just the bar.

import { FOG_ZONES } from "../lib/fog-zones";
import { ZONE_COLOR } from "./lib";

// Zones in Sun → Persistent Fog order as whole percents. The file's shares are
// rounded to two places and can total 0.99 or 1.01, so they are normalised
// first, then rounded by largest remainder so the line always adds up to 100
// (plain rounding gives Panhandle 11 + 50 + 40); a zone that would read 0% is
// left out.
export function zoneMixParts(mix) {
  if (!mix) return [];
  const share = z => Number(mix[z]) || 0;
  const total = FOG_ZONES.reduce((a, z) => a + share(z.name), 0);
  if (!(total > 0)) return [];
  const exact = FOG_ZONES.map(z => (share(z.name) / total) * 100);
  const parts = FOG_ZONES.map((z, i) => ({ zone: z.name, pct: Math.floor(exact[i]) }));
  let left = 100 - parts.reduce((a, p) => a + p.pct, 0);
  exact.map((x, i) => i)
    .sort((a, b) => (exact[b] % 1) - (exact[a] % 1))
    .forEach(i => { if (left > 0) { parts[i].pct++; left--; } });
  return parts.filter(p => p.pct >= 1);
}

export default function ZoneMix({ mix, className = "" }) {
  const parts = zoneMixParts(mix);
  if (!parts.length) return null;
  const text = parts.map(p => `${p.zone} ${p.pct}%`).join(" · ");
  const showText = parts.filter(p => p.pct >= 5).length > 1
    && Math.max(...parts.map(p => p.pct)) < 95;
  // role="img" reads the whole thing as its label, so the visible text line
  // isn't announced twice; the title gives mouse users the mix when the text
  // line is hidden.
  return (
    <span
      className={"zmix" + (className ? " " + className : "")}
      role="img"
      aria-label={`Zone mix: ${parts.map(p => `${p.zone} ${p.pct}%`).join(", ")}`}
      title={text}
    >
      <span className="zmix-bar">
        {parts.map(p => (
          <span key={p.zone} className="zmix-seg" style={{ flexGrow: p.pct, background: ZONE_COLOR[p.zone] }} />
        ))}
      </span>
      {showText && <span className="zmix-txt">{text}</span>}
    </span>
  );
}
