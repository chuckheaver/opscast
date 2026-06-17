// Ur4cast home — a clean hub of facet tiles. The location bar sits at the
// top; tapping a tile jumps to its feature (Weather forecast, Micro-Climate,
// Market, the /fog map layers, Wine AVAs). The forecast + ideal-weather
// setup that used to live here moved to its own page at /weather.

import HomeHub from "./components/HomeHub";

export default function Page() {
  return (
    <div className="app">
      <div className="topbar">
        <div>
          <div className="brand-name">Ur<em>4cast</em></div>
          <div className="brand-tag">Weather Intelligence For You</div>
        </div>
      </div>
      <HomeHub />
    </div>
  );
}
