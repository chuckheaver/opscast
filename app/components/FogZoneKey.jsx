// The key to the home page's fog map (public/brand/sf-fog-hero.svg), shown
// under the map: the four summer-fog zones, numbered sunniest to foggiest,
// in the map's own colours (scripts/build-fog-hero.mjs ZONES over the navy).
const ZONES = [
  ["1", "Sun", "#DCB04B"],
  ["2", "Transition", "#B89C7C"],
  ["3", "Fog", "#9AAEBF"],
  ["4", "Persistent Fog", "#7D91A5"],
];

export default function FogZoneKey() {
  return (
    <ul className="fog-zone-key" aria-label="Summer fog zones, sunniest to foggiest">
      {ZONES.map(([n, name, c]) => (
        <li key={n}><b style={{ background: c }}>{n}</b>{name}</li>
      ))}
    </ul>
  );
}
