// Private field-kit scripts for the walking-tour videos, keyed by the exact
// neighborhood name (the same key used in fog/lib/neighborhoods.js).
//
// Each entry:
//   aka?        string   alternate name (shown as a chip)
//   runtime     string   target spoken length
//   marketLink  string   deep-link to the live market update for this hood
//   sections    [{ label, words, script, broll[] }]   script in CAPS for the
//               teleprompter; `script` uses real line breaks for readability.
//   schedule    [{ step, detail, time }]   production schedule
//
// Only neighborhoods with an entry here have a finished script; the rest show
// "script pending" until generated. Castro is the pilot/format reference.

export const SCRIPTS = {
  "Castro": {
    aka: "Eureka Valley",
    runtime: "~10 min (8–10 target)",
    marketLink: "https://www.ur4cast.com/listings?nbhd=Castro&layer=nbhd",
    detailsLink: "https://www.ur4cast.com/fog (open the Neighborhoods card → Castro)",
    route: {
      // Route stays ENTIRELY within the Castro boundary (verified against the
      // neighborhood polygon). Coords approximate — I'll snap to the sidewalk
      // grid for the final cut.
      path: [[-122.4351, 37.7627], [-122.4348, 37.7620], [-122.4350, 37.7609], [-122.4350, 37.7596], [-122.4329, 37.7607]],
      spots: [
        { n: 1, name: "Harvey Milk Plaza & Castro Station", note: "Start — the giant Pride flag + the Muni Metro hub", coord: [-122.4351, 37.7627] },
        { n: 2, name: "Castro Theatre", note: "1922 movie palace, the neon marquee", coord: [-122.4348, 37.7620] },
        { n: 3, name: "18th & Castro", note: "Rainbow crosswalks — the heart of the neighborhood", coord: [-122.4350, 37.7609] },
        { n: 4, name: "19th & Castro", note: "South end of the strip; the quieter, leafier blocks begin", coord: [-122.4350, 37.7596] },
        { n: 5, name: "Collingwood & 18th — Victorian blocks", note: "The housing-stock segment: classic Castro Victorians", coord: [-122.4329, 37.7607] },
      ],
    },
    sections: [
      {
        label: "COLD OPEN / SIGNATURE INTRO",
        words: 85,
        script:
          "IN SAN FRANCISCO, THE WEATHER CAN CHANGE IN THE SPACE OF A SINGLE BLOCK —\n" +
          "ONE STREET BURIED IN FOG, THE NEXT ONE SITTING IN THE SUN.\n" +
          "AFTER YEARS OF WALKING THESE HILLS, I'VE LEARNED THAT THE BEST HOMES\n" +
          "AREN'T FOUND IN A LISTING — THEY'RE IN THE DETAILS YOU ONLY KNOW\n" +
          "ONCE YOU'VE STOOD ON THE CORNER AT DIFFERENT TIMES OF DAY.\n" +
          "RIGHT NOW I'M AT 18TH AND CASTRO, AND THE SUN IS OUT —\n" +
          "WHICH IS ALREADY THE FIRST THING WORTH KNOWING ABOUT THIS PLACE.\n" +
          "SO — ARE YOU READY TO SEE THE CASTRO? LET'S GO.",
        broll: ["Two-shot idea: a foggy ridge in one frame, sunny Castro St in the next", "You walking up Castro St into frame", "The Pride flag / rainbow crosswalk to place us"],
      },
      {
        label: "1 · LOCATION & LAY OF THE LAND",
        words: 165,
        script:
          "FIRST — WHERE ARE WE? THE CASTRO SITS DEAD-CENTER IN SAN FRANCISCO,\n" +
          "JUST WEST OF THE MISSION AND SOUTH OF DUBOCE TRIANGLE,\n" +
          "WITH NOE VALLEY OVER THE HILL AND THE HAIGHT TO THE NORTHWEST.\n" +
          "THE MAIN SPINE IS CASTRO STREET, RUNNING FROM MARKET\n" +
          "DOWN TO THE QUIET, TREE-LINED BLOCKS BELOW 19TH.\n" +
          "ITS OLD NAME — EUREKA VALLEY — TELLS YOU THE SHAPE OF THE LAND.\n" +
          "THE HEART OF THE NEIGHBORHOOD SITS IN A GENTLE VALLEY,\n" +
          "ROUGHLY 80 TO 180 FEET UP, AND IT'S GENUINELY WALKABLE —\n" +
          "FLAT ENOUGH TO STROLL WITH A COFFEE OR PUSH A STROLLER.\n" +
          "BUT THIS IS SAN FRANCISCO, SO THE EDGES CLIMB FAST:\n" +
          "HEAD WEST TOWARD CORONA HEIGHTS AND TWIN PEAKS AND THE GRADE\n" +
          "QUICKLY PASSES WHAT THE A-D-A CONSIDERS AN ACCESSIBLE SLOPE — ABOUT FIVE PERCENT.\n" +
          "SO IF STEP-FREE, LOW-GRADE ACCESS MATTERS TO YOU,\n" +
          "THE VALLEY FLOOR IS YOUR FRIEND; THE UPPER BLOCKS ARE A WORKOUT.",
        broll: ["Slow pan up Castro St; street signs at 18th & Castro", "Wide establishing shot showing the valley + Twin Peaks ridge", "A genuinely steep cross-street climbing west (show the grade)"],
      },
      {
        label: "2 · HISTORY",
        words: 200,
        script:
          "NOW THE STORY. CASTRO STREET IS NAMED FOR JOSÉ CASTRO —\n" +
          "A CALIFORNIO LEADER AND GOVERNOR OF MEXICAN ALTA CALIFORNIA.\n" +
          "ALL OF THIS WAS THE ANCESTRAL LAND OF THE RAMAYTUSH OHLONE LONG BEFORE THAT.\n" +
          "THE NEIGHBORHOOD GREW UP IN THE 1880s AND 90s AS 'EUREKA VALLEY' —\n" +
          "A WORKING-CLASS STREETCAR SUBURB OF VICTORIANS\n" +
          "BUILT FOR IRISH AND SCANDINAVIAN FAMILIES.\n" +
          "THEN CAME THE TURN. IN THE 1960s AND 70s, AS THOSE FAMILIES LEFT,\n" +
          "LGBTQ RESIDENTS MOVED IN AND PUT DOWN ROOTS —\n" +
          "AND EUREKA VALLEY BECAME 'THE CASTRO,'\n" +
          "ONE OF THE FIRST AND MOST FAMOUS GAY NEIGHBORHOODS IN AMERICA.\n" +
          "THIS IS WHERE HARVEY MILK OPENED HIS CAMERA SHOP,\n" +
          "WON A SEAT ON THE BOARD OF SUPERVISORS IN 1977 —\n" +
          "ONE OF THE FIRST OPENLY GAY ELECTED OFFICIALS IN THE COUNTRY —\n" +
          "AND WHERE, AFTER HIS ASSASSINATION IN 1978,\n" +
          "A CANDLELIGHT MARCH DOWN MARKET STREET STILL MARKS THE DAY EACH YEAR.\n" +
          "WHEN YOU WALK THESE BLOCKS, YOU'RE WALKING THROUGH LIVING CIVIL-RIGHTS HISTORY.",
        broll: ["Victorian facades", "575 Castro St — the old Castro Camera storefront", "Harvey Milk Plaza sign / mural"],
      },
      {
        label: "3 · HIDDEN FACTS",
        words: 160,
        script:
          "HERE'S WHAT MOST PEOPLE DON'T KNOW.\n" +
          "THE RAINBOW FLAG WAS BORN RIGHT HERE — ARTIST GILBERT BAKER\n" +
          "SEWED THE VERY FIRST ONE IN THE CASTRO IN 1978.\n" +
          "THAT MARQUEE IS THE CASTRO THEATRE, A 1922 MOVIE PALACE;\n" +
          "A 'MIGHTY WURLITZER' ORGAN STILL RISES FROM THE FLOOR BEFORE SCREENINGS.\n" +
          "THE AIDS MEMORIAL QUILT WAS FIRST IMAGINED HERE BY CLEVE JONES IN 1985,\n" +
          "AND HARVEY MILK FOUNDED THE CASTRO STREET FAIR IN 1974 —\n" +
          "IT STILL FILLS THESE STREETS EVERY OCTOBER.\n" +
          "AND IT WASN'T ALWAYS 'THE CASTRO' — THE NAME ONLY CAUGHT ON IN THE 1970s,\n" +
          "AND THOSE RAINBOW CROSSWALKS WENT IN IN 2014.\n" +
          "THIS IS A NEIGHBORHOOD THAT WEARS ITS HISTORY OUT LOUD.",
        broll: ["Pride flag tight shot", "Castro Theatre marquee", "Rainbow crosswalk overhead"],
      },
      {
        label: "4 · MICROCLIMATE",
        words: 95,
        script:
          "QUICK WORD ON WEATHER — BECAUSE IN SAN FRANCISCO, MICROCLIMATE IS EVERYTHING.\n" +
          "THE CASTRO SITS IN ONE OF THE CITY'S SUNNIEST POCKETS.\n" +
          "WHILE THE AVENUES OUT WEST DISAPPEAR INTO SUMMER FOG,\n" +
          "THIS VALLEY — SHELTERED BY TWIN PEAKS — CATCHES THE SUN\n" +
          "AND STAYS WARMER AND BRIGHTER. PEOPLE PAY FOR LIGHT.\n" +
          "I KEEP A LIVE FOG MAP THAT SHOWS THIS NEIGHBORHOOD'S EXACT SUMMER-FOG HOURS\n" +
          "VERSUS THE FOGGY WEST SIDE — IT'S LINKED ON MY CASTRO PAGE BELOW.",
        broll: ["Blue sky over Castro St; you in shirtsleeves", "Contrast: fog pouring over the Twin Peaks ridge", "Edit: screen-cap of the Ur4cast fog map"],
      },
      {
        label: "5 · GETTING AROUND — CAR-FREE",
        words: 290,
        script:
          "NOW THE PART THAT REALLY MATTERS IF YOU'RE BUYING HERE:\n" +
          "HOW YOU GET AROUND. AND THE CASTRO IS ONE OF THE EASIEST PLACES\n" +
          "IN THE WHOLE CITY TO LIVE WITHOUT A CAR.\n" +
          "RIGHT UNDER MY FEET IS CASTRO STATION — MUNI METRO,\n" +
          "WITH THE K, L, AND M LINES RUNNING UNDERGROUND STRAIGHT DOWNTOWN.\n" +
          "UP ON MARKET, THE HISTORIC F-LINE STREETCAR HEADS TO THE FERRY BUILDING,\n" +
          "AND THE 24, 33, 35, AND 37 BUSES THREAD THROUGH THE HILLS.\n" +
          "NEAREST BART IS 16TH AND MISSION, ABOUT A MILE EAST.\n" +
          "NOW LET'S LEAVE THE CITY — CAR-FREE.\n" +
          "THE FERRY BUILDING IS ABOUT THREE MILES NORTHEAST,\n" +
          "ROUGHLY TWENTY MINUTES ON THE MUNI METRO TO EMBARCADERO,\n" +
          "AND THAT'S YOUR GATEWAY TO THE WATER.\n" +
          "GOING TO THE EAST BAY? FROM EMBARCADERO, HOP BART —\n" +
          "DOWNTOWN OAKLAND IS ABOUT THIRTY-FIVE MINUTES DOOR TO PLATFORM.\n" +
          "BY CAR, THE BAY BRIDGE PUTS YOU IN OAKLAND IN TWENTY TO TWENTY-FIVE.\n" +
          "HEADING NORTH TO MARIN? THE LARKSPUR FERRY LEAVES FROM THE FERRY BUILDING\n" +
          "AND CROSSES IN ABOUT THIRTY MINUTES ON THE WATER —\n" +
          "OR DRIVE THE GOLDEN GATE BRIDGE TO LARKSPUR IN ABOUT THIRTY.\n" +
          "HEADING SOUTH TO THE PENINSULA? TAKE MUNI TO THE CALTRAIN DEPOT\n" +
          "AT 4TH AND KING, AND CALTRAIN RUNS DOWN TO PALO ALTO IN ABOUT FIFTY MINUTES —\n" +
          "OR IT'S ROUGHLY FORTY-FIVE BY CAR ON 280 OR 101.\n" +
          "BOTTOM LINE: WATER, RAIL, AND THREE BRIDGES — ALL WITHOUT OWNING A CAR.",
        broll: [
          "Castro Station entrance / escalator down; an F-line streetcar on Market",
          "Embarcadero Station + the Ferry Building / a departing ferry",
          "A BART train; the Bay Bridge; the Golden Gate Bridge; a Caltrain at 4th & King",
          "Simple motion-graphic map: Castro → Oakland / Larkspur / Palo Alto with the times",
        ],
      },
      {
        label: "6 · THE GROUND UNDER YOU (HAZARDS)",
        words: 110,
        script:
          "TWO QUICK, HONEST NOTES ON THE GROUND ITSELF.\n" +
          "GOOD NEWS FIRST: THE CASTRO SITS UP ON A HILLSIDE, WELL ABOVE THE BAY,\n" +
          "SO IT IS NOT IN A TSUNAMI HAZARD ZONE — CROSS THAT WORRY OFF THE LIST.\n" +
          "LIKE MUCH OF HILLY SAN FRANCISCO, PARTS OF THE NEIGHBORHOOD\n" +
          "DO FALL WITHIN A STATE-DESIGNATED SEISMIC HAZARD ZONE —\n" +
          "THAT'S STANDARD FOR THE CITY'S SLOPES, AND IT'S SOMETHING\n" +
          "EVERY CALIFORNIA BUYER REVIEWS WITH THEIR INSPECTOR AND INSURER.\n" +
          "I PUT THE SEISMIC AND TSUNAMI STATUS RIGHT ON EACH NEIGHBORHOOD'S\n" +
          "DETAILS PAGE, SO YOU CAN CHECK ANY SPECIFIC BLOCK BEFORE YOU WRITE AN OFFER.",
        broll: ["You gesturing to the hillside / the valley below", "Edit: the seismic + tsunami toggles on your fog map"],
      },
      {
        label: "7 · DINING, NIGHTLIFE & DAILY LIFE",
        words: 120,
        script:
          "LET'S TALK DAILY LIFE.\n" +
          "THE CASTRO'S COMMERCIAL STRIP IS ONE OF THE MOST WALKABLE IN THE CITY —\n" +
          "COFFEE, BRUNCH, CLASSIC DINNER SPOTS, AND A NIGHTLIFE SCENE WITH REAL HISTORY,\n" +
          "INCLUDING SOME OF THE OLDEST LANDMARK BARS IN SAN FRANCISCO.\n" +
          "I'M NOT GOING TO NAME SPECIFIC PLACES ON CAMERA, BECAUSE THE LINEUP CHANGES —\n" +
          "AND I NEVER WANT TO SEND YOU SOMEWHERE THAT'S CLOSED.\n" +
          "INSTEAD, I KEEP A CURRENT, HAND-CHECKED LIST OF THE NEIGHBORHOOD'S BEST\n" +
          "RESTAURANTS AND BARS RIGHT ON MY CASTRO DETAILS PAGE — ALWAYS UP TO DATE.\n" +
          "THE VIBE TO KNOW: THIS IS A WALK-OUT-YOUR-DOOR, LEAVE-THE-CAR-HOME KIND OF PLACE.",
        broll: ["Café tables; a busy restaurant window at dusk", "Castro Theatre lit up; people on the sidewalk", "A classic neon bar sign (general, not a single endorsement)"],
      },
      {
        label: "8 · REAL ESTATE",
        words: 120,
        script:
          "ON HOUSING: THE CASTRO IS CLASSIC SAN FRANCISCO —\n" +
          "GRAND VICTORIAN AND EDWARDIAN FLATS, SINGLE-FAMILY HOMES\n" +
          "ON THE QUIETER UPHILL BLOCKS, AND CONDOS AND T-I-C UNITS NEARER MARKET.\n" +
          "IT RUNS FROM A FIRST CONDO TO A FULLY RESTORED VICTORIAN SHOWPIECE.\n" +
          "I'M NOT GOING TO QUOTE A MEDIAN PRICE ON CAMERA, BECAUSE THAT NUMBER MOVES.\n" +
          "INSTEAD, I KEEP A LIVE MARKET UPDATE FOR THE CASTRO ON MY SITE —\n" +
          "CURRENT MEDIANS FOR SINGLE-FAMILY HOMES AND FOR CONDOS, RIGHT UP TO TODAY.\n" +
          "THE LINK IS BELOW. THAT'S YOUR SMARTEST FIRST STEP BEFORE YOU EVEN TOUR.",
        broll: ["A painted Victorian, a flats building, a modern condo entry", "A 'For Sale' sign", "Edit: lower-third + screen-record of your live market page"],
      },
      {
        label: "9 · WHO BELONGS HERE + SIGNATURE OUTRO",
        words: 135,
        script:
          "SO — WHO BELONGS IN THE CASTRO?\n" +
          "SOMEONE WHO WANTS LIGHT, WALKABILITY, AND THE WHOLE BAY AREA\n" +
          "A TRAIN OR A FERRY AWAY, WITHOUT EVER NEEDING A CAR.\n" +
          "BUT HERE'S THE THING I'VE LEARNED AFTER ALL THESE YEARS:\n" +
          "EVERY NEIGHBORHOOD IN THIS CITY HAS A STORY LIKE THIS ONE,\n" +
          "AND KNOWING THEM ALL IS THE WORK — THE MICROCLIMATES,\n" +
          "THE STREETS THAT HOLD THEIR VALUE, THE THINGS THAT NEVER SHOW UP IN A SEARCH.\n" +
          "ANYTHING THAT CHANGES — PRICES, THE NEWEST RESTAURANT, WHAT'S FOR SALE —\n" +
          "STAYS CURRENT ON MY CASTRO NEIGHBORHOOD PAGE, SO THIS GUIDE NEVER GOES STALE.\n" +
          "AND IF YOU'RE EVEN THINKING ABOUT CALLING THIS CITY HOME,\n" +
          "I'D GENUINELY LOVE TO HELP YOU FIND THE CORNER THAT FITS YOU.\n" +
          "I'M CHUCK HEAVER. I'LL SEE YOU IN THE NEXT NEIGHBORHOOD.",
        broll: ["Golden-hour, unhurried walk down Castro St (you, relaxed, not pitching)", "A quiet look back up the hill toward Twin Peaks", "Soft end card: your name + how to reach you"],
      },
    ],
    schedule: [
      { step: "Scout & lock script", detail: "Walk the route, mark the 6–8 B-roll stops, finalize edits to this script.", time: "~45 min (day before)" },
      { step: "Golden-hour B-roll", detail: "Shoot the hero flag, theatre marquee, crosswalks, street life, and housing variety in good light.", time: "30–45 min (early AM or ~1 hr before sunset)" },
      { step: "Walk-and-talk takes", detail: "Shoot each section as its own clip at the relevant spot; 2 takes each; teleprompter on your phone.", time: "60–90 min" },
      { step: "Pickups & cutaways", detail: "Signs, the station entrance, and a screen-record of your live market page (capture at home).", time: "~15 min" },
      { step: "Edit & caption", detail: "Assemble, add lower-thirds (market URL), burned-in captions, light music bed; export.", time: "2–3 hrs" },
      { step: "Publish & link", detail: "Upload to YouTube, paste the market link in the description — then I add the 'Watch the tour' button to the Castro page.", time: "~30 min" },
    ],
    batchTip: "Shoot adjacent hoods the same outing — e.g. Castro + Corona Heights + Duboce Triangle in one morning loop.",
  },
};
