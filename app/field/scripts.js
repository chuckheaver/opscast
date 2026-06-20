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
          "AFTER YEARS OF EXPLORING THESE HILLS, I'VE LEARNED THAT THE BEST HOMES\n" +
          "AREN'T FOUND IN A LISTING — THEY'RE IN THE DETAILS YOU ONLY KNOW\n" +
          "ONCE YOU'VE STOOD ON THE CORNER AT DIFFERENT TIMES OF DAY.\n" +
          "RIGHT NOW I'M AT 18TH AND CASTRO, AND THE SUN IS OUT —\n" +
          "WHICH IS ALREADY THE FIRST THING WORTH KNOWING ABOUT THIS PLACE.\n" +
          "SO — ARE YOU READY TO SEE THE CASTRO? LET'S GO.",
        broll: ["Two-shot idea: a foggy ridge in one frame, sunny Castro St in the next", "You moving up Castro St into frame", "The Pride flag / rainbow crosswalk to place us"],
      },
      {
        label: "1 · LOCATION & LAY OF THE LAND",
        words: 195,
        script:
          "FIRST — WHERE ARE WE? THE CASTRO SITS DEAD-CENTER IN SAN FRANCISCO,\n" +
          "JUST WEST OF THE MISSION AND SOUTH OF DUBOCE TRIANGLE,\n" +
          "WITH NOE VALLEY OVER THE HILL AND THE HAIGHT TO THE NORTHWEST.\n" +
          "THE MAIN SPINE IS CASTRO STREET, RUNNING FROM MARKET\n" +
          "DOWN TO THE QUIET, TREE-LINED BLOCKS BELOW 19TH.\n" +
          "ITS OLD NAME — EUREKA VALLEY — TELLS YOU THE SHAPE OF THE LAND.\n" +
          "THE HEART OF THE NEIGHBORHOOD SITS IN A GENTLE VALLEY,\n" +
          "ROUGHLY 80 TO 180 FEET UP, AND THE CORE IS FLAT AND EASY TO GET AROUND —\n" +
          "FRIENDLY WHETHER YOU'RE PUSHING A STROLLER OR ROLLING A WHEELCHAIR.\n" +
          "BUT THIS IS SAN FRANCISCO, SO THE EDGES CLIMB FAST:\n" +
          "HEAD WEST TOWARD CORONA HEIGHTS AND TWIN PEAKS AND THE GRADE\n" +
          "QUICKLY PASSES WHAT THE A-D-A CONSIDERS AN ACCESSIBLE SLOPE — ABOUT FIVE PERCENT.\n" +
          "SO IF STEP-FREE, LOW-GRADE ACCESS MATTERS TO YOU,\n" +
          "THE VALLEY FLOOR IS YOUR FRIEND; THE UPPER BLOCKS ARE A CLIMB.\n" +
          "AND THE HOMES THEMSELVES MATTER TOO —\n" +
          "MANY OF THESE CLASSIC VICTORIANS SIT UP A FLIGHT OF STAIRS FROM THE SIDEWALK,\n" +
          "SO IF STEP-FREE ENTRY IS A MUST, IT'S WORTH CHECKING HOME BY HOME.",
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
          "SPEND TIME ON THESE BLOCKS, AND YOU'RE STANDING IN LIVING CIVIL-RIGHTS HISTORY.",
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
          "THE CASTRO'S COMMERCIAL STRIP IS ONE OF THE LIVELIEST IN THE CITY —\n" +
          "COFFEE, BRUNCH, CLASSIC DINNER SPOTS, AND A NIGHTLIFE SCENE WITH REAL HISTORY,\n" +
          "INCLUDING SOME OF THE OLDEST LANDMARK BARS IN SAN FRANCISCO.\n" +
          "I'M NOT GOING TO NAME SPECIFIC PLACES ON CAMERA, BECAUSE THE LINEUP CHANGES —\n" +
          "AND I NEVER WANT TO SEND YOU SOMEWHERE THAT'S CLOSED.\n" +
          "INSTEAD, I KEEP A CURRENT, HAND-CHECKED LIST OF THE NEIGHBORHOOD'S BEST\n" +
          "RESTAURANTS AND BARS RIGHT ON MY CASTRO DETAILS PAGE — ALWAYS UP TO DATE.\n" +
          "THE VIBE TO KNOW: THIS IS A RIGHT-OUTSIDE-YOUR-DOOR, LEAVE-THE-CAR-HOME KIND OF PLACE.",
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
        words: 120,
        script:
          "SO — WHO BELONGS IN THE CASTRO?\n" +
          "SOMEONE WHO WANTS LIGHT, EASE, AND THE WHOLE BAY AREA\n" +
          "A TRAIN OR A FERRY AWAY, WITHOUT EVER NEEDING A CAR.\n" +
          "BUT HERE'S THE THING I'VE LEARNED AFTER ALL THESE YEARS:\n" +
          "EVERY NEIGHBORHOOD IN THIS CITY HAS A STORY LIKE THIS ONE,\n" +
          "AND KNOWING THEM ALL IS THE WORK — THE MICROCLIMATES,\n" +
          "THE STREETS THAT HOLD THEIR VALUE, THE THINGS THAT NEVER SHOW UP IN A SEARCH.\n" +
          "ANYTHING THAT CHANGES — PRICES, THE NEWEST RESTAURANT, WHAT'S FOR SALE —\n" +
          "STAYS CURRENT ON MY CASTRO NEIGHBORHOOD PAGE, SO THIS GUIDE NEVER GOES STALE.\n" +
          "SO IF YOU'RE THINKING ABOUT CALLING THE CASTRO HOME,\n" +
          "I'D LOVE TO SHOW YOU AROUND AND HELP CREATE YOUR NEXT LIFE ADVENTURE.",
        broll: ["Golden-hour, unhurried pass down Castro St (you, relaxed, not pitching)", "A quiet look back up the hill toward Twin Peaks", "Soft end card: your name + how to reach you"],
      },
    ],
    schedule: [
      { step: "Scout & lock script", detail: "Take the route, mark the 6–8 B-roll stops, finalize edits to this script.", time: "~45 min (day before)" },
      { step: "Golden-hour B-roll", detail: "Shoot the hero flag, theatre marquee, crosswalks, street life, and housing variety in good light.", time: "30–45 min (early AM or ~1 hr before sunset)" },
      { step: "Talk-to-camera takes", detail: "Shoot each section as its own clip at the relevant spot; 2 takes each; teleprompter on your phone.", time: "60–90 min" },
      { step: "Pickups & cutaways", detail: "Signs, the station entrance, and a screen-record of your live market page (capture at home).", time: "~15 min" },
      { step: "Edit & caption", detail: "Assemble, add lower-thirds (market URL), burned-in captions, light music bed; export.", time: "2–3 hrs" },
      { step: "Publish & link", detail: "Upload to YouTube, paste the market link in the description — then I add the 'Watch the tour' button to the Castro page.", time: "~30 min" },
    ],
    batchTip: "Shoot adjacent hoods the same outing — e.g. Castro + Corona Heights + Duboce Triangle in one morning loop.",
  },
  "Noe Valley": {
    aka: "Stroller Valley",
    runtime: "~10 min (8–10 target)",
    marketLink: "https://www.ur4cast.com/listings?nbhd=Noe%20Valley&layer=nbhd",
    detailsLink: "https://www.ur4cast.com/fog (open the Neighborhoods card → Noe Valley)",
    route: {
      // Route stays ENTIRELY within the Noe Valley boundary (verified against the
      // neighborhood polygon). Coords approximate — snap to the sidewalk grid for the final cut.
      spots: [
        { n: 1, name: "24th & Castro", note: "Start — the heart of the 24th St strip, sun out", coord: [-122.4330, 37.7515] },
        { n: 2, name: "24th & Church — J-Church stop", note: "The Muni Metro line on the neighborhood's edge", coord: [-122.4275, 37.7513] },
        { n: 3, name: "Noe Courts", note: "The little corner park at 24th & Douglass", coord: [-122.4378, 37.7512] },
        { n: 4, name: "Sanchez & 23rd — Victorian blocks", note: "Pre-1906 Victorian and Edwardian residential streets", coord: [-122.4296, 37.7524] },
        { n: 5, name: "Upper Sanchez — Victorian blocks", note: "The steeper uphill blocks climbing west toward Twin Peaks", coord: [-122.4300, 37.7523] },
      ],
    },
    sections: [
      {
        label: "COLD OPEN / SIGNATURE INTRO",
        words: 85,
        script:
          "IN SAN FRANCISCO, THE WEATHER CAN CHANGE IN THE SPACE OF A SINGLE BLOCK —\n" +
          "ONE STREET BURIED IN FOG, THE NEXT ONE SITTING IN THE SUN.\n" +
          "AFTER YEARS OF EXPLORING THESE HILLS, I'VE LEARNED THAT THE BEST HOMES\n" +
          "AREN'T FOUND IN A LISTING — THEY'RE IN THE DETAILS YOU ONLY KNOW\n" +
          "ONCE YOU'VE STOOD ON THE CORNER AT DIFFERENT TIMES OF DAY.\n" +
          "RIGHT NOW I'M AT 24TH AND CASTRO, AND THE SUN IS OUT —\n" +
          "WHICH IS ALREADY THE FIRST THING WORTH KNOWING ABOUT THIS PLACE.\n" +
          "SO — ARE YOU READY TO SEE NOE VALLEY? LET'S GO.",
        broll: ["Two-shot idea: a foggy ridge in one frame, sunny 24th St in the next", "You moving down 24th St into frame", "A row of painted Victorians to place us"],
      },
      {
        label: "1 · LOCATION & LAY OF THE LAND",
        words: 195,
        script:
          "FIRST — WHERE ARE WE? NOE VALLEY SITS RIGHT IN THE MIDDLE OF SAN FRANCISCO,\n" +
          "TUCKED SOUTH OF THE CASTRO AND WEST OF THE MISSION,\n" +
          "WITH TWIN PEAKS RISING BEHIND IT AND GLEN PARK OVER THE HILL.\n" +
          "THE MAIN SPINE IS 24TH STREET, A VILLAGE-Y SHOPPING STRIP\n" +
          "RUNNING ACROSS THE FLOOR OF THE VALLEY.\n" +
          "AND IT REALLY IS A VALLEY — THE LAND RUNS FROM ABOUT 90 FEET DOWN HERE\n" +
          "UP TO AROUND 530 FEET ON THE WESTERN RIM.\n" +
          "ALONG 24TH STREET THE GRADE IS FAIRLY LEVEL AND EASY TO GET AROUND —\n" +
          "FRIENDLY WHETHER YOU'RE PUSHING A STROLLER OR ROLLING A WHEELCHAIR.\n" +
          "BUT THE BLOCKS THAT CLIMB WEST TOWARD TWIN PEAKS GET STEEP FAST,\n" +
          "QUICKLY PASSING WHAT THE A-D-A CONSIDERS AN ACCESSIBLE SLOPE — ABOUT FIVE PERCENT.\n" +
          "SO IF STEP-FREE, LOW-GRADE ACCESS MATTERS TO YOU,\n" +
          "THE VALLEY FLOOR IS YOUR FRIEND; THE UPPER BLOCKS ARE A CLIMB.\n" +
          "AND THE HOMES THEMSELVES MATTER TOO —\n" +
          "MANY OF THESE CLASSIC VICTORIANS SIT UP A FLIGHT OF STAIRS FROM THE SIDEWALK,\n" +
          "SO IF STEP-FREE ENTRY IS A MUST, IT'S WORTH CHECKING HOME BY HOME.",
        broll: ["Slow pan down 24th St; street signs at 24th & Castro", "Wide establishing shot showing the valley floor + the Twin Peaks ridge", "A genuinely steep cross-street climbing west (show the grade)"],
      },
      {
        label: "2 · HISTORY",
        words: 200,
        script:
          "NOW THE STORY. NOE VALLEY IS NAMED FOR JOSÉ DE JESÚS NOÉ —\n" +
          "THE LAST MEXICAN ALCALDE, OR MAYOR, OF YERBA BUENA\n" +
          "BEFORE IT BECAME SAN FRANCISCO.\n" +
          "HIS RANCHO SAN MIGUEL LAND GRANT COVERED THIS WHOLE AREA,\n" +
          "THE CASTRO, AND BEYOND.\n" +
          "ALL OF IT WAS THE ANCESTRAL LAND OF THE RAMAYTUSH OHLONE LONG BEFORE THAT.\n" +
          "THE NEIGHBORHOOD FILLED IN AFTER THE 1880s\n" +
          "AS A WORKING-CLASS STREETCAR SUBURB OF VICTORIANS.\n" +
          "THEN CAME THE MOMENT THAT SHAPED IT MOST:\n" +
          "WHEN THE 1906 EARTHQUAKE STRUCK, THE FIRES THAT LEVELED SO MUCH OF THE CITY\n" +
          "STOPPED SHORT OF NOE VALLEY AND NEVER REACHED IT.\n" +
          "SO BLOCK AFTER BLOCK OF ORIGINAL VICTORIAN AND EDWARDIAN HOMES\n" +
          "STILL STANDS TODAY — AN UNUSUALLY INTACT PRE-1906 STREETSCAPE.\n" +
          "FOR DECADES IT STAYED A QUIET, MIDDLE-CLASS PART OF TOWN,\n" +
          "AND IN RECENT YEARS IT HAS BECOME ONE OF THE CITY'S MOST SOUGHT-AFTER\n" +
          "FAMILY NEIGHBORHOODS.\n" +
          "SPEND TIME ON THESE STREETS, AND YOU'RE EXPLORING A SAN FRANCISCO\n" +
          "THAT THE 20TH CENTURY MOSTLY LEFT STANDING.",
        broll: ["Victorian and Edwardian facades", "A pre-1906 cornerstone or date plaque", "Wide shot of an unbroken row of original homes"],
      },
      {
        label: "3 · HIDDEN FACTS",
        words: 160,
        script:
          "HERE'S WHAT MOST PEOPLE DON'T KNOW.\n" +
          "THE FACT THAT THE 1906 FIRES NEVER ARRIVED IS WHY THESE BLOCKS\n" +
          "HOLD SOME OF THE BEST-PRESERVED VICTORIANS IN THE ENTIRE CITY.\n" +
          "THE WHOLE PLACE WAS BUILT AROUND A STREETCAR —\n" +
          "THE J-CHURCH LINE OPENED IN 1917, CLIMBED PAST DOLORES PARK,\n" +
          "AND TURNED NOE VALLEY INTO A COMMUTER-FRIENDLY SUBURB OVERNIGHT.\n" +
          "TODAY THE NEIGHBORHOOD IS SO FAMOUS FOR YOUNG FAMILIES\n" +
          "THAT LOCALS HALF-JOKINGLY CALL IT 'STROLLER VALLEY.'\n" +
          "A SATURDAY FARMERS' MARKET HAS RUN RIGHT ON 24TH STREET SINCE 2003.\n" +
          "AND 24TH STREET ITSELF IS A PROTECTED NEIGHBORHOOD COMMERCIAL DISTRICT —\n" +
          "RESIDENTS HAVE LONG RESISTED CHAIN STORES,\n" +
          "LEAVING A FIERCELY INDEPENDENT STRIP OF BAKERIES, BOOKSHOPS, AND CAFÉS.\n" +
          "THIS IS A NEIGHBORHOOD THAT GUARDS ITS SMALL-TOWN FEEL ON PURPOSE.",
        broll: ["The J-Church streetcar on Church St", "Saturday farmers' market stalls on 24th St", "An independent bakery or bookshop storefront"],
      },
      {
        label: "4 · MICROCLIMATE",
        words: 95,
        script:
          "QUICK WORD ON WEATHER — BECAUSE IN SAN FRANCISCO, MICROCLIMATE IS EVERYTHING.\n" +
          "NOE VALLEY SITS IN ONE OF THE CITY'S SUNNIER, CALMER POCKETS.\n" +
          "WHILE THE AVENUES OUT WEST DISAPPEAR INTO SUMMER FOG,\n" +
          "THIS VALLEY — SHELTERED BY TWIN PEAKS — CATCHES THE SUN\n" +
          "AND STAYS WARMER AND BRIGHTER. PEOPLE PAY FOR LIGHT.\n" +
          "I KEEP A LIVE FOG MAP THAT SHOWS THIS NEIGHBORHOOD'S EXACT SUMMER-FOG HOURS\n" +
          "VERSUS THE FOGGY WEST SIDE — IT'S LINKED ON MY NOE VALLEY PAGE BELOW.",
        broll: ["Blue sky over 24th St; you in shirtsleeves", "Contrast: fog pouring over the Twin Peaks ridge", "Edit: screen-cap of the Ur4cast fog map"],
      },
      {
        label: "5 · GETTING AROUND — CAR-FREE",
        words: 290,
        script:
          "NOW THE PART THAT REALLY MATTERS IF YOU'RE BUYING HERE:\n" +
          "HOW YOU GET AROUND. AND NOE VALLEY IS ONE OF THE EASIER PLACES\n" +
          "IN THE CITY TO LIVE WITHOUT A CAR.\n" +
          "ON THE NEIGHBORHOOD'S EDGE, THE J-CHURCH MUNI METRO RUNS UP CHURCH STREET,\n" +
          "PAST DOLORES PARK AND STRAIGHT DOWNTOWN —\n" +
          "STILL THE QUICKEST CAR-FREE RUN TO THE CENTER OF THE CITY.\n" +
          "ACROSS 24TH STREET YOU'VE GOT THE 48 QUINTARA AND THE 24 DIVISADERO BUSES\n" +
          "THREADING TO THE MISSION, THE CASTRO, AND BEYOND.\n" +
          "NOW LET'S LEAVE THE CITY — CAR-FREE.\n" +
          "THE FERRY BUILDING IS ABOUT FOUR MILES NORTHEAST, A MUNI RIDE AWAY,\n" +
          "AND THAT'S YOUR GATEWAY TO THE WATER.\n" +
          "GOING TO THE EAST BAY? TAKE MUNI TO THE NEAREST BART,\n" +
          "AND DOWNTOWN OAKLAND IS ABOUT THIRTY TO THIRTY-FIVE MINUTES —\n" +
          "OR BY CAR, THE BAY BRIDGE PUTS YOU THERE IN A SIMILAR STRETCH.\n" +
          "HEADING NORTH TO MARIN? THE LARKSPUR FERRY LEAVES FROM THE FERRY BUILDING\n" +
          "AND CROSSES IN ABOUT THIRTY MINUTES ON THE WATER —\n" +
          "OR DRIVE THE GOLDEN GATE BRIDGE.\n" +
          "HEADING SOUTH TO THE PENINSULA? TAKE MUNI TO THE CALTRAIN DEPOT\n" +
          "AT 4TH AND KING, AND CALTRAIN RUNS DOWN TO PALO ALTO IN ABOUT FIFTY MINUTES —\n" +
          "OR IT'S 280 OR 101 BY CAR.\n" +
          "BOTTOM LINE: WATER, RAIL, AND THREE BRIDGES — ALL WITHOUT OWNING A CAR.",
        broll: [
          "The J-Church streetcar on Church St; a 24 or 48 bus on 24th St",
          "The Ferry Building / a departing ferry",
          "A BART train; the Bay Bridge; the Golden Gate Bridge; a Caltrain at 4th & King",
          "Simple motion-graphic map: Noe Valley → Oakland / Larkspur / Palo Alto with the times",
        ],
      },
      {
        label: "6 · THE GROUND UNDER YOU (HAZARDS)",
        words: 110,
        script:
          "TWO QUICK, HONEST NOTES ON THE GROUND ITSELF.\n" +
          "GOOD NEWS FIRST: NOE VALLEY SITS UP ON THE HILLS, WELL ABOVE THE BAY,\n" +
          "SO IT IS NOT IN A TSUNAMI HAZARD ZONE — CROSS THAT WORRY OFF THE LIST.\n" +
          "LIKE MUCH OF HILLY SAN FRANCISCO, PARTS OF THE NEIGHBORHOOD\n" +
          "DO FALL WITHIN A STATE-DESIGNATED SEISMIC HAZARD ZONE —\n" +
          "THAT'S STANDARD FOR THE CITY'S SLOPES, AND IT'S SOMETHING\n" +
          "EVERY CALIFORNIA BUYER REVIEWS WITH THEIR INSPECTOR AND INSURER.\n" +
          "I PUT THE SEISMIC AND TSUNAMI STATUS RIGHT ON EACH NEIGHBORHOOD'S\n" +
          "DETAILS PAGE, SO YOU CAN CHECK ANY SPECIFIC BLOCK BEFORE YOU WRITE AN OFFER.",
        broll: ["You gesturing to the hillside climbing toward Twin Peaks", "Edit: the seismic + tsunami toggles on your fog map"],
      },
      {
        label: "7 · DINING, NIGHTLIFE & DAILY LIFE",
        words: 120,
        script:
          "LET'S TALK DAILY LIFE.\n" +
          "24TH STREET IS THE KIND OF MAIN STREET PEOPLE MOVE HERE FOR —\n" +
          "INDEPENDENT BAKERIES, COFFEE, BOOKSHOPS, BRUNCH SPOTS,\n" +
          "A SATURDAY FARMERS' MARKET, AND A HANDFUL OF EASYGOING NEIGHBORHOOD BARS.\n" +
          "I'M NOT GOING TO NAME SPECIFIC PLACES ON CAMERA, BECAUSE THE LINEUP CHANGES —\n" +
          "AND I NEVER WANT TO SEND YOU SOMEWHERE THAT'S CLOSED.\n" +
          "INSTEAD, I KEEP A CURRENT, HAND-CHECKED LIST OF THE NEIGHBORHOOD'S BEST\n" +
          "RESTAURANTS AND BARS RIGHT ON MY NOE VALLEY DETAILS PAGE — ALWAYS UP TO DATE.\n" +
          "THE VIBE TO KNOW: THIS IS A RIGHT-OUTSIDE-YOUR-DOOR, LEAVE-THE-CAR-HOME,\n" +
          "SMALL-TOWN-IN-THE-CITY KIND OF PLACE.",
        broll: ["Café tables on 24th St; a bakery window", "Farmers' market on a Saturday morning", "A relaxed neighborhood bar (general, not a single endorsement)"],
      },
      {
        label: "8 · REAL ESTATE",
        words: 120,
        script:
          "ON HOUSING: NOE VALLEY IS CLASSIC SAN FRANCISCO —\n" +
          "ROWS OF PRE-1906 VICTORIAN AND EDWARDIAN HOMES,\n" +
          "MANY DIVIDED INTO FLATS, ALONGSIDE SINGLE-FAMILY HOUSES\n" +
          "ON THE QUIETER UPHILL BLOCKS, PLUS SOME CONDOS AND T-I-C UNITS.\n" +
          "IT RUNS FROM A FIRST CONDO TO A FULLY RESTORED VICTORIAN SHOWPIECE.\n" +
          "I'M NOT GOING TO QUOTE A MEDIAN PRICE ON CAMERA, BECAUSE THAT NUMBER MOVES.\n" +
          "INSTEAD, I KEEP A LIVE MARKET UPDATE FOR NOE VALLEY ON MY SITE —\n" +
          "CURRENT MEDIANS FOR SINGLE-FAMILY HOMES AND FOR CONDOS, RIGHT UP TO TODAY.\n" +
          "THE LINK IS BELOW. THAT'S YOUR SMARTEST FIRST STEP BEFORE YOU EVEN TOUR.",
        broll: ["A painted Victorian, a flats building, a modern condo entry", "A 'For Sale' sign", "Edit: lower-third + screen-record of your live market page"],
      },
      {
        label: "9 · WHO BELONGS HERE + SIGNATURE OUTRO",
        words: 120,
        script:
          "SO — WHO BELONGS IN NOE VALLEY?\n" +
          "SOMEONE WHO WANTS SUN, CALM, AND A SMALL-TOWN MAIN STREET,\n" +
          "WITH THE WHOLE BAY AREA A TRAIN OR A FERRY AWAY, AND NEVER NEEDS A CAR.\n" +
          "BUT HERE'S THE THING I'VE LEARNED AFTER ALL THESE YEARS:\n" +
          "EVERY NEIGHBORHOOD IN THIS CITY HAS A STORY LIKE THIS ONE,\n" +
          "AND KNOWING THEM ALL IS THE WORK — THE MICROCLIMATES,\n" +
          "THE STREETS THAT HOLD THEIR VALUE, THE THINGS THAT NEVER SHOW UP IN A SEARCH.\n" +
          "ANYTHING THAT CHANGES — PRICES, THE NEWEST RESTAURANT, WHAT'S FOR SALE —\n" +
          "STAYS CURRENT ON MY NOE VALLEY NEIGHBORHOOD PAGE, SO THIS GUIDE NEVER GOES STALE.\n" +
          "SO IF YOU'RE THINKING ABOUT CALLING NOE VALLEY HOME,\n" +
          "I'D LOVE TO SHOW YOU AROUND AND HELP CREATE YOUR NEXT LIFE ADVENTURE.",
        broll: ["Golden-hour, unhurried pass down 24th St (you, relaxed, not pitching)", "A quiet look up the hill toward Twin Peaks", "Soft end card: your name + how to reach you"],
      },
    ],
    schedule: [
      { step: "Scout & lock script", detail: "Take the route, mark the 6–8 B-roll stops, finalize edits to this script.", time: "~45 min (day before)" },
      { step: "Golden-hour B-roll", detail: "Shoot the 24th St strip, Victorian rows, the J-Church streetcar, street life, and housing variety in good light.", time: "30–45 min (early AM or ~1 hr before sunset)" },
      { step: "Talk-to-camera takes", detail: "Shoot each section as its own clip at the relevant spot; 2 takes each; teleprompter on your phone.", time: "60–90 min" },
      { step: "Pickups & cutaways", detail: "Signs, a J-Church stop, and a screen-record of your live market page (capture at home).", time: "~15 min" },
      { step: "Edit & caption", detail: "Assemble, add lower-thirds (market URL), burned-in captions, light music bed; export.", time: "2–3 hrs" },
      { step: "Publish & link", detail: "Upload to YouTube, paste the market link in the description — then I add the 'Watch the tour' button to the Noe Valley page.", time: "~30 min" },
    ],
    batchTip: "Shoot adjacent hoods the same outing — e.g. Noe Valley + Castro + Glen Park in one morning loop.",
  },
  "Marina": {
    aka: "1915 Expo grounds",
    runtime: "~10 min (8–10 target)",
    marketLink: "https://www.ur4cast.com/listings?nbhd=Marina&layer=nbhd",
    detailsLink: "https://www.ur4cast.com/fog (open the Neighborhoods card → Marina)",
    route: {
      // Route stays ENTIRELY within the Marina boundary (verified against the
      // neighborhood polygon). Coords approximate — snap to the sidewalk grid for the final cut.
      spots: [
        { n: 1, name: "Chestnut Street strip", note: "Start — the main drag: cafés, fitness studios, shops", coord: [-122.4400, 37.8005] },
        { n: 2, name: "Mediterranean-style homes (Marina blocks)", note: "The housing-stock segment: 1920s stucco flats and bay-view homes", coord: [-122.4380, 37.8020] },
        { n: 3, name: "Palace of Fine Arts", note: "The Expo's lone survivor — the domed rotunda and lagoon", coord: [-122.4480, 37.8025] },
        { n: 4, name: "Marina Green & the waterfront promenade", note: "Open lawn, kites, joggers, and the bay right there", coord: [-122.4420, 37.8060] },
        { n: 5, name: "Marina Harbor", note: "The small-craft harbor and the jetty out toward the Wave Organ", coord: [-122.4400, 37.8070] },
      ],
    },
    sections: [
      {
        label: "COLD OPEN / SIGNATURE INTRO",
        words: 85,
        script:
          "IN SAN FRANCISCO, THE WEATHER CAN CHANGE IN THE SPACE OF A SINGLE BLOCK —\n" +
          "ONE STREET BURIED IN FOG, THE NEXT ONE SITTING IN THE SUN.\n" +
          "AFTER YEARS OF EXPLORING THESE HILLS, I'VE LEARNED THAT THE BEST HOMES\n" +
          "AREN'T FOUND IN A LISTING — THEY'RE IN THE DETAILS YOU ONLY KNOW\n" +
          "ONCE YOU'VE STOOD ON THE CORNER AT DIFFERENT TIMES OF DAY.\n" +
          "RIGHT NOW I'M ON CHESTNUT STREET, AND THE SUN IS OUT —\n" +
          "WHICH IS ALREADY THE FIRST THING WORTH KNOWING ABOUT THIS PLACE.\n" +
          "SO — ARE YOU READY TO SEE THE MARINA? LET'S GO.",
        broll: ["Two-shot idea: a foggy ridge in one frame, sunny Chestnut St in the next", "You moving up Chestnut St into frame", "The bay / Marina Green to place us"],
      },
      {
        label: "1 · LOCATION & LAY OF THE LAND",
        words: 195,
        script:
          "FIRST — WHERE ARE WE? THE MARINA SITS ON THE CITY'S NORTHERN EDGE,\n" +
          "RIGHT ALONG THE BAY, WITH THE GOLDEN GATE BRIDGE OFF TO THE WEST,\n" +
          "PACIFIC HEIGHTS UP THE SLOPE TO THE SOUTH, AND COW HOLLOW JUST INLAND.\n" +
          "THE MAIN SPINE IS CHESTNUT STREET, RUNNING PARALLEL TO THE WATER,\n" +
          "WITH THE MARINA GREEN AND THE PROMENADE STRETCHED ALONG THE BAYFRONT.\n" +
          "HERE'S THE HEADLINE: THIS PLACE IS FLAT.\n" +
          "ELEVATION RUNS FROM ZERO TO ABOUT NINETY FEET, AND THE CORE IS LEVEL,\n" +
          "RIGHT DOWN NEAR SEA LEVEL — ONE OF THE MOST ACCESSIBLE NEIGHBORHOODS IN THE CITY.\n" +
          "IT'S GENUINELY EASY TO GET AROUND — FRIENDLY WHETHER YOU'RE\n" +
          "PUSHING A STROLLER OR ROLLING A WHEELCHAIR,\n" +
          "WELL WITHIN WHAT THE A-D-A CONSIDERS AN ACCESSIBLE GRADE — ABOUT FIVE PERCENT.\n" +
          "THIS IS ONE OF THE MORE STEP-FREE NEIGHBORHOODS YOU'LL FIND IN SAN FRANCISCO.\n" +
          "THAT SAID, THE HOMES THEMSELVES STILL VARY —\n" +
          "SOME OF THESE 1920s FLATS SIT UP A FLIGHT FROM THE SIDEWALK,\n" +
          "SO IF STEP-FREE ENTRY IS A MUST, IT'S WORTH CHECKING HOME BY HOME.\n" +
          "BUT AS A NEIGHBORHOOD TO MOVE THROUGH? FLAT, LEVEL, AND EASY.",
        broll: ["Slow pan down Chestnut St; flat sidewalks", "Wide establishing shot: the bay, Marina Green, the bridge beyond", "Someone with a stroller or on a bike on the level promenade"],
      },
      {
        label: "2 · HISTORY",
        words: 200,
        script:
          "NOW THE STORY. THE MARINA WAS LITERALLY BUILT FOR A PARTY.\n" +
          "IN 1915, SAN FRANCISCO THREW THE PANAMA-PACIFIC INTERNATIONAL EXPOSITION —\n" +
          "A WORLD'S FAIR CELEBRATING THE CITY'S RECOVERY FROM THE 1906 EARTHQUAKE\n" +
          "AND THE OPENING OF THE PANAMA CANAL.\n" +
          "TO MAKE ROOM, THEY FILLED IN THIS STRETCH OF THE BAY —\n" +
          "MUCH OF IT BUILT ON BAY FILL AND RUBBLE FROM THE QUAKE.\n" +
          "NEARLY NINETEEN MILLION VISITORS CAME TO A TEMPORARY CITY OF PALACES RIGHT HERE.\n" +
          "WHEN THE FAIR CLOSED, THE GROUNDS BECAME THE MARINA,\n" +
          "AND THROUGH THE 1920s IT FILLED IN WITH MEDITERRANEAN-STYLE HOMES —\n" +
          "THOSE STUCCO FACADES AND TILED ROOFS YOU'LL SEE ALL OVER THESE BLOCKS.\n" +
          "ITS WATERFRONT FLATS AND BAY VIEWS HAVE MADE IT\n" +
          "ONE OF THE CITY'S MOST POPULAR YOUNG-PROFESSIONAL NEIGHBORHOODS EVER SINCE.\n" +
          "SO WHEN YOU SPEND TIME ON THESE STREETS, REMEMBER —\n" +
          "YOU'RE STANDING ON GROUND THAT DIDN'T EVEN EXIST A LITTLE OVER A CENTURY AGO,\n" +
          "RECLAIMED FROM THE BAY FOR ONE GLORIOUS SUMMER, AND NEVER GIVEN BACK.",
        broll: ["Mediterranean-style facades along the inner blocks", "The Palace of Fine Arts rotunda", "Archival-style still of the 1915 Expo if you can license one"],
      },
      {
        label: "3 · HIDDEN FACTS",
        words: 160,
        script:
          "HERE'S WHAT MOST PEOPLE DON'T KNOW.\n" +
          "THAT DOMED PALACE BY THE LAGOON — THE PALACE OF FINE ARTS —\n" +
          "IS THE ONLY STRUCTURE FROM THE 1915 FAIR STILL STANDING.\n" +
          "IT WAS TOO BELOVED TO DEMOLISH, SO IT WAS REBUILT\n" +
          "IN PERMANENT CONCRETE IN THE 1960s.\n" +
          "OUT AT THE TIP OF THE MARINA JETTY SITS THE WAVE ORGAN —\n" +
          "A SCULPTURE OF PIPES SET INTO THE BREAKWATER THAT THE TIDES ACTUALLY PLAY,\n" +
          "BUILT BY THE EXPLORATORIUM IN 1986. GO AT HIGH TIDE AND LISTEN.\n" +
          "AND CHESTNUT STREET? IT'S BEEN THE MARINA'S MAIN DRAG FOR A FULL CENTURY —\n" +
          "A TIGHT RUN OF CAFÉS, FITNESS STUDIOS, AND SHOPS\n" +
          "THAT'S DEFINED THIS NEIGHBORHOOD'S SOCIAL SCENE SINCE THE 1920s.\n" +
          "THIS IS A PLACE WHERE A WORLD'S FAIR NEVER QUITE PACKED UP AND LEFT.",
        broll: ["Palace of Fine Arts dome + reflection in the lagoon", "The Wave Organ pipes at the jetty", "Chestnut St café tables / studio fronts"],
      },
      {
        label: "4 · MICROCLIMATE",
        words: 95,
        script:
          "QUICK WORD ON WEATHER — BECAUSE IN SAN FRANCISCO, MICROCLIMATE IS EVERYTHING.\n" +
          "THE MARINA IS ONE OF THE BRIGHTER POCKETS OF THE CITY —\n" +
          "IT CATCHES A LOT OF SUN, AND THAT BAYFRONT LIGHT IS PART OF THE DRAW.\n" +
          "BUT IT SITS RIGHT ON THE WATER, SO IT CAN BE BREEZY AND COOL —\n" +
          "THAT WIND COMES STRAIGHT OFF THE BAY THROUGH THE GOLDEN GATE.\n" +
          "BRING A LAYER FOR THE PROMENADE, EVEN ON A SUNNY DAY.\n" +
          "I KEEP A LIVE FOG MAP THAT SHOWS THIS NEIGHBORHOOD'S EXACT SUMMER-FOG HOURS\n" +
          "VERSUS THE FOGGY WEST SIDE — IT'S LINKED ON MY MARINA PAGE BELOW.",
        broll: ["Blue sky over Chestnut St; you in shirtsleeves", "Wind on the bay: whitecaps, kites, flags snapping on the Green", "Edit: screen-cap of the Ur4cast fog map"],
      },
      {
        label: "5 · GETTING AROUND — CAR-FREE",
        words: 290,
        script:
          "NOW THE PART THAT REALLY MATTERS IF YOU'RE BUYING HERE:\n" +
          "HOW YOU GET AROUND. THERE'S NO MUNI METRO IN THE MARINA —\n" +
          "IT'S A BUS NEIGHBORHOOD, AND A GOOD ONE.\n" +
          "THE 30 STOCKTON RUNS DOWN CHESTNUT STREET STRAIGHT TO DOWNTOWN AND CHINATOWN,\n" +
          "WITH THE 43 MASONIC, THE 28 NINETEENTH AVENUE, AND THE 22 FILLMORE\n" +
          "LINKING YOU TO THE REST OF THE CITY.\n" +
          "THE NEAREST BART IS A TRANSFER DOWNTOWN, NOT A STATION YOU CAN SEE FROM HERE.\n" +
          "NOW LET'S LEAVE THE CITY — CAR-FREE.\n" +
          "THE FERRY BUILDING IS ABOUT TWO AND A HALF MILES EAST,\n" +
          "A SHORT MUNI RIDE, AND THAT'S YOUR GATEWAY TO THE WATER.\n" +
          "GOING TO THE EAST BAY? FROM DOWNTOWN, HOP BART —\n" +
          "OAKLAND IS ABOUT THIRTY TO THIRTY-FIVE MINUTES,\n" +
          "OR BY CAR THE BAY BRIDGE GETS YOU THERE TOO.\n" +
          "HEADING NORTH TO MARIN? YOU'RE RIGHT BY THE GOLDEN GATE BRIDGE —\n" +
          "IT'S ABOUT A TWENTY TO TWENTY-FIVE MINUTE DRIVE TO LARKSPUR,\n" +
          "OR TAKE THE LARKSPUR FERRY FROM THE FERRY BUILDING AND CROSS ON THE WATER.\n" +
          "HEADING SOUTH TO THE PENINSULA? TAKE MUNI TO THE CALTRAIN DEPOT\n" +
          "AT 4TH AND KING, AND CALTRAIN RUNS DOWN TO PALO ALTO IN ABOUT FIFTY MINUTES —\n" +
          "OR IT'S 280 OR 101 BY CAR.\n" +
          "BOTTOM LINE: BUSES TO DOWNTOWN, A FERRY ACROSS THE BAY,\n" +
          "AND THE GOLDEN GATE BRIDGE RIGHT THERE — ALL WITHOUT OWNING A CAR.",
        broll: [
          "A 30 Stockton bus on Chestnut St",
          "The Ferry Building / a departing ferry",
          "A BART train; the Bay Bridge; the Golden Gate Bridge; a Caltrain at 4th & King",
          "Simple motion-graphic map: Marina → Oakland / Larkspur / Palo Alto with the times",
        ],
      },
      {
        label: "6 · THE GROUND UNDER YOU (HAZARDS)",
        words: 110,
        script:
          "NOW TWO HONEST NOTES ON THE GROUND ITSELF — AND I MEAN HONEST.\n" +
          "THE MARINA IS LARGELY BUILT ON BAY FILL,\n" +
          "AND THAT MATTERS. IT IS IN A STATE-DESIGNATED SEISMIC HAZARD ZONE\n" +
          "FOR LIQUEFACTION — THIS IS THE NEIGHBORHOOD THAT WAS HARDEST HIT IN 1989.\n" +
          "AND BECAUSE IT SITS LOW ON THE BAYFRONT, IT'S ALSO IN A\n" +
          "TSUNAMI HAZARD AND EVACUATION ZONE.\n" +
          "NONE OF THAT IS A DEAL-BREAKER — IT'S A REASON TO GO IN INFORMED:\n" +
          "REVIEW THE SOILS, ASK ABOUT SEISMIC RETROFITS, AND PRICE IN INSURANCE.\n" +
          "I PUT THE SEISMIC AND TSUNAMI STATUS RIGHT ON EACH NEIGHBORHOOD'S DETAILS PAGE,\n" +
          "ALONGSIDE THE CITY'S OWN RESOURCES, SO YOU CAN CHECK ANY BLOCK BEFORE YOU WRITE AN OFFER.",
        broll: ["You gesturing to the flat bayfront ground", "Edit: the seismic + tsunami toggles on your fog map", "A retrofit / soft-story note card if you have one"],
      },
      {
        label: "7 · DINING, NIGHTLIFE & DAILY LIFE",
        words: 120,
        script:
          "LET'S TALK DAILY LIFE.\n" +
          "CHESTNUT STREET IS THE HEART OF IT — A TIGHT, LIVELY STRIP OF\n" +
          "COFFEE, BRUNCH, DINNER SPOTS, FITNESS STUDIOS, AND A YOUNG, SOCIAL NIGHTLIFE SCENE.\n" +
          "AND THE BAY IS LITERALLY A BLOCK AWAY — BRUNCH AND THE WATERFRONT,\n" +
          "RIGHT NEXT TO EACH OTHER.\n" +
          "I'M NOT GOING TO NAME SPECIFIC PLACES ON CAMERA, BECAUSE THE LINEUP CHANGES —\n" +
          "AND I NEVER WANT TO SEND YOU SOMEWHERE THAT'S CLOSED.\n" +
          "INSTEAD, I KEEP A CURRENT, HAND-CHECKED LIST OF THE NEIGHBORHOOD'S BEST\n" +
          "RESTAURANTS AND BARS RIGHT ON MY MARINA DETAILS PAGE — ALWAYS UP TO DATE.\n" +
          "THE VIBE TO KNOW: THIS IS A RIGHT-OUTSIDE-YOUR-DOOR, LEAVE-THE-CAR-HOME KIND OF PLACE.",
        broll: ["Chestnut St café tables; a busy restaurant window at dusk", "Joggers and the Green at golden hour", "A general nightlife sidewalk shot (no single endorsement)"],
      },
      {
        label: "8 · REAL ESTATE",
        words: 120,
        script:
          "ON HOUSING: THE MARINA IS CLASSIC NORTHSIDE SAN FRANCISCO —\n" +
          "MEDITERRANEAN-STYLE FLATS FROM THE 1920s, BAY-VIEW HOMES,\n" +
          "AND CONDOS, MANY WITH THAT STUCCO-AND-TILE LOOK THE WHOLE DISTRICT SHARES.\n" +
          "IT RUNS FROM A FIRST CONDO TO A FULL WATERFRONT-ADJACENT HOME WITH A BAY VIEW.\n" +
          "I'M NOT GOING TO QUOTE A MEDIAN PRICE ON CAMERA, BECAUSE THAT NUMBER MOVES.\n" +
          "INSTEAD, I KEEP A LIVE MARKET UPDATE FOR THE MARINA ON MY SITE —\n" +
          "CURRENT MEDIANS FOR SINGLE-FAMILY HOMES AND FOR CONDOS, RIGHT UP TO TODAY.\n" +
          "THE LINK IS BELOW. THAT'S YOUR SMARTEST FIRST STEP BEFORE YOU EVEN TOUR.",
        broll: ["A Mediterranean-style flats building, a bay-view home, a modern condo entry", "A 'For Sale' sign", "Edit: lower-third + screen-record of your live market page"],
      },
      {
        label: "9 · WHO BELONGS HERE + SIGNATURE OUTRO",
        words: 120,
        script:
          "SO — WHO BELONGS IN THE MARINA?\n" +
          "SOMEONE WHO WANTS LIGHT, LEVEL STREETS, AND THE BAY RIGHT OUTSIDE THEIR DOOR —\n" +
          "BRUNCH, A RUN ALONG THE PROMENADE, AND THE GOLDEN GATE BRIDGE FOR A BACKDROP,\n" +
          "WHO'S CLEAR-EYED ABOUT THE FILL UNDERFOOT AND GOES IN INFORMED.\n" +
          "BUT HERE'S THE THING I'VE LEARNED AFTER ALL THESE YEARS:\n" +
          "EVERY NEIGHBORHOOD IN THIS CITY HAS A STORY LIKE THIS ONE,\n" +
          "AND KNOWING THEM ALL IS THE WORK — THE MICROCLIMATES,\n" +
          "THE STREETS THAT HOLD THEIR VALUE, THE THINGS THAT NEVER SHOW UP IN A SEARCH.\n" +
          "ANYTHING THAT CHANGES — PRICES, THE NEWEST RESTAURANT, WHAT'S FOR SALE —\n" +
          "STAYS CURRENT ON MY MARINA NEIGHBORHOOD PAGE, SO THIS GUIDE NEVER GOES STALE.\n" +
          "SO IF YOU'RE THINKING ABOUT CALLING THE MARINA HOME,\n" +
          "I'D LOVE TO SHOW YOU AROUND AND HELP CREATE YOUR NEXT LIFE ADVENTURE.",
        broll: ["Golden-hour, unhurried pass along the promenade (you, relaxed, not pitching)", "A quiet look out across the bay toward the bridge", "Soft end card: your name + how to reach you"],
      },
    ],
    schedule: [
      { step: "Scout & lock script", detail: "Take the route, mark the 6–8 B-roll stops, finalize edits to this script.", time: "~45 min (day before)" },
      { step: "Golden-hour B-roll", detail: "Shoot the Palace dome, Marina Green, the harbor, Chestnut St life, and housing variety in good light.", time: "30–45 min (early AM or ~1 hr before sunset)" },
      { step: "Talk-to-camera takes", detail: "Shoot each section as its own clip at the relevant spot; 2 takes each; teleprompter on your phone.", time: "60–90 min" },
      { step: "Pickups & cutaways", detail: "Signs, a Chestnut St bus, and a screen-record of your live market page (capture at home).", time: "~15 min" },
      { step: "Edit & caption", detail: "Assemble, add lower-thirds (market URL), burned-in captions, light music bed; export.", time: "2–3 hrs" },
      { step: "Publish & link", detail: "Upload to YouTube, paste the market link in the description — then I add the 'Watch the tour' button to the Marina page.", time: "~30 min" },
    ],
    batchTip: "Shoot adjacent hoods the same outing — e.g. Marina + Cow Hollow + Pacific Heights in one morning loop.",
  },
  "Hayes Valley": {
    aka: "Reborn after 1989",
    runtime: "~10 min (8–10 target)",
    marketLink: "https://www.ur4cast.com/listings?nbhd=Hayes%20Valley&layer=nbhd",
    detailsLink: "https://www.ur4cast.com/fog (open the Neighborhoods card → Hayes Valley)",
    route: {
      // Route stays ENTIRELY within the Hayes Valley boundary (verified against
      // the neighborhood polygon). Coords approximate — snap to the sidewalk grid for the final cut.
      spots: [
        { n: 1, name: "Hayes & Octavia", note: "Start — top of the Hayes St strip, steps from Patricia's Green", coord: [-122.4263, 37.7765] },
        { n: 2, name: "Patricia's Green", note: "The central pocket park; rotating public art where the freeway once stood", coord: [-122.4258, 37.7761] },
        { n: 3, name: "Hayes St boutique & restaurant strip", note: "The design-and-dining spine — independent shops, kitchens, cocktail rooms", coord: [-122.4248, 37.7768] },
        { n: 4, name: "Octavia Blvd corridor", note: "The tree-lined surface boulevard that replaced the Central Freeway", coord: [-122.4267, 37.7755] },
        { n: 5, name: "SFJAZZ / Civic Center edge", note: "The performing-arts shoulder at the east end of the neighborhood", coord: [-122.4231, 37.7770] },
        { n: 6, name: "Linden & Octavia — Victorian block", note: "The housing-stock segment: classic flats and alley Victorians", coord: [-122.4255, 37.7748] },
      ],
    },
    sections: [
      {
        label: "COLD OPEN / SIGNATURE INTRO",
        words: 85,
        script:
          "IN SAN FRANCISCO, THE WEATHER CAN CHANGE IN THE SPACE OF A SINGLE BLOCK —\n" +
          "ONE STREET BURIED IN FOG, THE NEXT ONE SITTING IN THE SUN.\n" +
          "AFTER YEARS OF EXPLORING THESE HILLS, I'VE LEARNED THAT THE BEST HOMES\n" +
          "AREN'T FOUND IN A LISTING — THEY'RE IN THE DETAILS YOU ONLY KNOW\n" +
          "ONCE YOU'VE STOOD ON THE CORNER AT DIFFERENT TIMES OF DAY.\n" +
          "RIGHT NOW I'M AT HAYES AND OCTAVIA, AND THE SUN IS OUT —\n" +
          "WHICH IS ALREADY THE FIRST THING WORTH KNOWING ABOUT THIS PLACE.\n" +
          "SO — ARE YOU READY TO SEE HAYES VALLEY? LET'S GO.",
        broll: ["Two-shot idea: a foggy ridge in one frame, sunny Hayes St in the next", "You moving up Hayes St into frame", "Patricia's Green / the public-art piece to place us"],
      },
      {
        label: "1 · LOCATION & LAY OF THE LAND",
        words: 195,
        script:
          "FIRST — WHERE ARE WE? HAYES VALLEY SITS RIGHT IN THE MIDDLE OF SAN FRANCISCO,\n" +
          "JUST WEST OF CIVIC CENTER, NORTH OF THE MARKET STREET CORRIDOR,\n" +
          "WITH ALAMO SQUARE OVER TO THE WEST AND THE OPERA AND SYMPHONY NEARBY.\n" +
          "THE MAIN SPINE IS HAYES STREET, THE BOUTIQUE-AND-DINING STRIP,\n" +
          "WITH PATRICIA'S GREEN — THE LITTLE CENTRAL PARK — RIGHT AT ITS HEART.\n" +
          "HERE'S THE GOOD NEWS FOR EASY LIVING:\n" +
          "THE GROUND HERE IS ROUGHLY 60 TO 200 FEET UP,\n" +
          "AND THE CORE IS GENUINELY FLAT — LEVEL, AND EASY TO GET AROUND.\n" +
          "IT'S FRIENDLY WHETHER YOU'RE PUSHING A STROLLER OR ROLLING A WHEELCHAIR,\n" +
          "WELL WITHIN WHAT THE A-D-A CONSIDERS AN ACCESSIBLE GRADE — ABOUT FIVE PERCENT.\n" +
          "THAT MAKES THIS ONE OF THE MORE COMFORTABLE NEIGHBORHOODS IN THE CITY\n" +
          "TO SIMPLY GET AROUND ON THE LEVEL, DAY TO DAY.\n" +
          "ONE HONEST NOTE ON THE HOMES THEMSELVES:\n" +
          "SAN FRANCISCO FLATS OFTEN SIT UP A FEW STEPS FROM THE SIDEWALK,\n" +
          "SO EVEN ON FLAT GROUND, STEP-FREE ENTRY VARIES HOME TO HOME —\n" +
          "IF THAT MATTERS TO YOU, IT'S WORTH CHECKING PLACE BY PLACE.",
        broll: ["Slow pan up Hayes St; street signs at Hayes & Octavia", "Wide establishing shot showing the flat, level core", "A typical flat with a short flight of entry steps (show the step-up)"],
      },
      {
        label: "2 · HISTORY",
        words: 200,
        script:
          "NOW THE STORY. HAYES VALLEY IS NAMED FOR THOMAS HAYES,\n" +
          "A COUNTY OFFICIAL WHO RAN A PRIVATE STREETCAR OUT HAYES STREET IN THE 1860s —\n" +
          "AND THAT LINE IS WHAT FIRST OPENED THE VALLEY TO HOMES.\n" +
          "ALL OF THIS WAS THE ANCESTRAL LAND OF THE RAMAYTUSH OHLONE LONG BEFORE THAT.\n" +
          "FOR DECADES, THOUGH, THIS NEIGHBORHOOD SAT IN A LITERAL SHADOW —\n" +
          "THE ELEVATED CENTRAL FREEWAY LOOMED RIGHT OVERHEAD,\n" +
          "AND THE BLOCKS BENEATH IT WERE TREATED AS A PLACE TO PASS THROUGH.\n" +
          "THEN CAME THE TURN. IN 1989, THE LOMA PRIETA EARTHQUAKE\n" +
          "DAMAGED THAT FREEWAY — AND AFTER YEARS OF DEBATE, THE CITY TORE IT DOWN.\n" +
          "IN ITS PLACE CAME SURFACE BOULEVARDS, TREE-LINED OCTAVIA,\n" +
          "AND A NEW POCKET PARK WHERE THE OVERPASS USED TO STAND.\n" +
          "ALMOST OVERNIGHT, A BLIGHTED CORRIDOR BECAME\n" +
          "ONE OF THE CITY'S HOTTEST SHOPPING-AND-DINING DESTINATIONS.\n" +
          "SO WHEN YOU SPEND TIME ON THESE BLOCKS,\n" +
          "YOU'RE STANDING IN A NEIGHBORHOOD THAT QUITE LITERALLY REBUILT ITSELF —\n" +
          "AND CAME BACK BETTER THAN BEFORE.",
        broll: ["Victorian and flat facades along the side streets", "Patricia's Green where the freeway once stood", "Archival-style note: the old elevated freeway vs. today's boulevard"],
      },
      {
        label: "3 · HIDDEN FACTS",
        words: 160,
        script:
          "HERE'S WHAT MOST PEOPLE DON'T KNOW.\n" +
          "THAT LITTLE CENTRAL PARK IS PATRICIA'S GREEN,\n" +
          "AND IT ROTATES LARGE-SCALE PUBLIC ART —\n" +
          "EVERYTHING FROM BURNING MAN SCULPTURES TO TOWERING INSTALLATIONS.\n" +
          "ON A LEFTOVER FREEWAY PARCEL NEARBY, A PROJECT CALLED PROXY\n" +
          "TURNED SHIPPING CONTAINERS INTO A VILLAGE OF SHOPS, FOOD, AND A BEER GARDEN —\n" +
          "A MODEL OF TEMPORARY URBANISM THAT CITIES ALL OVER HAVE COPIED.\n" +
          "AND THE WHOLE REASON HAYES STREET BECAME A DESIGNER'S MAIN STREET\n" +
          "IS THAT FREEWAY COMING DOWN — WITH THE OVERPASS GONE,\n" +
          "INDEPENDENT FASHION AND DESIGN BOUTIQUES FILLED IN BLOCK BY BLOCK.\n" +
          "THIS IS A NEIGHBORHOOD WHERE A NATURAL DISASTER\n" +
          "ACCIDENTALLY HANDED THE CITY ONE OF ITS BEST STREETS.",
        broll: ["The current art piece on Patricia's Green", "The Proxy container shops / beer garden", "Boutique storefront windows along Hayes St"],
      },
      {
        label: "4 · MICROCLIMATE",
        words: 95,
        script:
          "QUICK WORD ON WEATHER — BECAUSE IN SAN FRANCISCO, MICROCLIMATE IS EVERYTHING.\n" +
          "HAYES VALLEY SITS IN ONE OF THE CITY'S MILDER, SUNNIER POCKETS.\n" +
          "TUCKED INTO THE CENTER OF TOWN, AWAY FROM THE OCEAN,\n" +
          "IT MISSES THE WORST OF THE SUMMER FOG THAT SWALLOWS THE WEST SIDE\n" +
          "AND TENDS TO STAY BRIGHTER AND A LITTLE WARMER. PEOPLE PAY FOR LIGHT.\n" +
          "I KEEP A LIVE FOG MAP THAT SHOWS THIS NEIGHBORHOOD'S EXACT SUMMER-FOG HOURS\n" +
          "VERSUS THE FOGGY WEST SIDE — IT'S LINKED ON MY HAYES VALLEY PAGE BELOW.",
        broll: ["Blue sky over Hayes St; you in shirtsleeves", "Contrast: fog pouring over the west-side ridge", "Edit: screen-cap of the Ur4cast fog map"],
      },
      {
        label: "5 · GETTING AROUND — CAR-FREE",
        words: 290,
        script:
          "NOW THE PART THAT REALLY MATTERS IF YOU'RE BUYING HERE:\n" +
          "HOW YOU GET AROUND. AND HAYES VALLEY IS ONE OF THE MOST\n" +
          "TRANSIT-RICH PLACES IN THE ENTIRE CITY.\n" +
          "VAN NESS AND CIVIC CENTER STATIONS ARE JUST AROUND THE CORNER —\n" +
          "THE FULL MUNI METRO, THE J, K, L, M, N, AND T, PLUS BART, RIGHT THERE.\n" +
          "THE 21-HAYES RUNS THE LENGTH OF THE NEIGHBORHOOD,\n" +
          "AND THE VAN NESS BUS RAPID TRANSIT LINE IS RIGHT ALONGSIDE.\n" +
          "NOW LET'S LEAVE THE CITY — CAR-FREE.\n" +
          "THE FERRY BUILDING IS ABOUT TWO MILES NORTHEAST —\n" +
          "JUST A SHORT MUNI METRO HOP TO EMBARCADERO,\n" +
          "AND THAT'S YOUR GATEWAY TO THE WATER.\n" +
          "GOING TO THE EAST BAY? THIS IS A STANDOUT HERE —\n" +
          "TAKE BART FROM CIVIC CENTER AND YOU'RE IN DOWNTOWN OAKLAND\n" +
          "IN ABOUT TWENTY TO TWENTY-FIVE MINUTES, NO TRANSFER, NO CAR.\n" +
          "HEADING NORTH TO MARIN? THE LARKSPUR FERRY LEAVES FROM THE FERRY BUILDING\n" +
          "AND CROSSES IN ABOUT THIRTY MINUTES ON THE WATER —\n" +
          "OR DRIVE THE GOLDEN GATE BRIDGE.\n" +
          "HEADING SOUTH TO THE PENINSULA? TAKE MUNI TO THE CALTRAIN DEPOT\n" +
          "AT 4TH AND KING, AND CALTRAIN RUNS DOWN TO PALO ALTO IN ABOUT FIFTY MINUTES —\n" +
          "OR IT'S 280 OR 101 BY CAR.\n" +
          "BOTTOM LINE: BART, MUNI METRO, AND THE FERRIES ARE ALL RIGHT OUTSIDE YOUR DOOR —\n" +
          "THIS IS ABOUT AS CAR-OPTIONAL AS SAN FRANCISCO GETS.",
        broll: [
          "Van Ness / Civic Center station entrance; a 21-Hayes bus; the Van Ness BRT lane",
          "Embarcadero Station + the Ferry Building / a departing ferry",
          "A BART train; the Golden Gate Bridge; a Caltrain at 4th & King",
          "Simple motion-graphic map: Hayes Valley → Oakland / Larkspur / Palo Alto with the times",
        ],
      },
      {
        label: "6 · THE GROUND UNDER YOU (HAZARDS)",
        words: 110,
        script:
          "TWO QUICK, HONEST NOTES ON THE GROUND ITSELF — AND BOTH ARE REASSURING.\n" +
          "FIRST: HAYES VALLEY IS NOT IN A TSUNAMI HAZARD ZONE.\n" +
          "IT SITS ON HIGHER, STABLE GROUND, WELL BACK FROM THE BAY —\n" +
          "SO YOU CAN CROSS THAT WORRY OFF THE LIST.\n" +
          "SECOND: IT IS ALSO NOT IN A STATE-DESIGNATED SEISMIC HAZARD ZONE —\n" +
          "AGAIN, HIGHER AND MORE STABLE THAN THE LOW-LYING, MADE-LAND PARTS OF TOWN.\n" +
          "STANDARD CALIFORNIA INSPECTIONS STILL APPLY — EVERY BUYER REVIEWS THOSE\n" +
          "WITH THEIR INSPECTOR AND INSURER — BUT THE FUNDAMENTALS HERE ARE GOOD.\n" +
          "I PUT THE SEISMIC AND TSUNAMI STATUS RIGHT ON EACH NEIGHBORHOOD'S\n" +
          "DETAILS PAGE, SO YOU CAN CHECK ANY SPECIFIC BLOCK BEFORE YOU WRITE AN OFFER.",
        broll: ["You gesturing to the level, central setting", "Edit: the seismic + tsunami toggles on your fog map"],
      },
      {
        label: "7 · DINING, NIGHTLIFE & DAILY LIFE",
        words: 120,
        script:
          "LET'S TALK DAILY LIFE.\n" +
          "THIS IS GENUINELY ONE OF THE BEST EATING-AND-DRINKING NEIGHBORHOODS IN THE CITY —\n" +
          "ACCLAIMED KITCHENS, SERIOUS COCKTAIL ROOMS, COFFEE, AND BRUNCH,\n" +
          "ALL PACKED INTO A FEW EASY BLOCKS AROUND HAYES STREET.\n" +
          "I'M NOT GOING TO NAME SPECIFIC PLACES ON CAMERA, BECAUSE THE LINEUP CHANGES —\n" +
          "AND I NEVER WANT TO SEND YOU SOMEWHERE THAT'S CLOSED.\n" +
          "INSTEAD, I KEEP A CURRENT, HAND-CHECKED LIST OF THE NEIGHBORHOOD'S BEST\n" +
          "RESTAURANTS AND BARS RIGHT ON MY HAYES VALLEY DETAILS PAGE — ALWAYS UP TO DATE.\n" +
          "THE VIBE TO KNOW: THIS IS A RIGHT-OUTSIDE-YOUR-DOOR, LEAVE-THE-CAR-HOME KIND OF PLACE.",
        broll: ["Café tables; a busy restaurant window at dusk", "The boutique strip with people on the sidewalk", "A general cocktail-room interior (not a single endorsement)"],
      },
      {
        label: "8 · REAL ESTATE",
        words: 120,
        script:
          "ON HOUSING: HAYES VALLEY MIXES CLASSIC AND BRAND-NEW.\n" +
          "THERE ARE VICTORIAN AND EDWARDIAN FLATS ON THE LEAFY SIDE STREETS,\n" +
          "AND A WAVE OF SLEEK NEW CONDOS THAT ROSE ON THE OLD FREEWAY PARCELS\n" +
          "AFTER THE OVERPASS CAME DOWN.\n" +
          "IT RUNS FROM A FIRST CONDO TO A FULLY RESTORED VICTORIAN FLAT.\n" +
          "I'M NOT GOING TO QUOTE A MEDIAN PRICE ON CAMERA, BECAUSE THAT NUMBER MOVES.\n" +
          "INSTEAD, I KEEP A LIVE MARKET UPDATE FOR HAYES VALLEY ON MY SITE —\n" +
          "CURRENT MEDIANS FOR SINGLE-FAMILY HOMES AND FOR CONDOS, RIGHT UP TO TODAY.\n" +
          "THE LINK IS BELOW. THAT'S YOUR SMARTEST FIRST STEP BEFORE YOU EVEN TOUR.",
        broll: ["A flats building, a Victorian, a modern condo entry on the old freeway blocks", "A 'For Sale' sign", "Edit: lower-third + screen-record of your live market page"],
      },
      {
        label: "9 · WHO BELONGS HERE + SIGNATURE OUTRO",
        words: 120,
        script:
          "SO — WHO BELONGS IN HAYES VALLEY?\n" +
          "SOMEONE WHO WANTS LIGHT, LEVEL STREETS, GREAT FOOD AT THE DOORSTEP,\n" +
          "AND THE WHOLE BAY AREA A TRAIN OR A FERRY AWAY — WITHOUT EVER NEEDING A CAR.\n" +
          "BUT HERE'S THE THING I'VE LEARNED AFTER ALL THESE YEARS:\n" +
          "EVERY NEIGHBORHOOD IN THIS CITY HAS A STORY LIKE THIS ONE,\n" +
          "AND KNOWING THEM ALL IS THE WORK — THE MICROCLIMATES,\n" +
          "THE STREETS THAT HOLD THEIR VALUE, THE THINGS THAT NEVER SHOW UP IN A SEARCH.\n" +
          "ANYTHING THAT CHANGES — PRICES, THE NEWEST RESTAURANT, WHAT'S FOR SALE —\n" +
          "STAYS CURRENT ON MY HAYES VALLEY NEIGHBORHOOD PAGE, SO THIS GUIDE NEVER GOES STALE.\n" +
          "SO IF YOU'RE THINKING ABOUT CALLING HAYES VALLEY HOME,\n" +
          "I'D LOVE TO SHOW YOU AROUND AND HELP CREATE YOUR NEXT LIFE ADVENTURE.",
        broll: ["Golden-hour, unhurried pass down Hayes St (you, relaxed, not pitching)", "A quiet look across Patricia's Green", "Soft end card: your name + how to reach you"],
      },
    ],
    schedule: [
      { step: "Scout & lock script", detail: "Take the route, mark the 6–8 B-roll stops, finalize edits to this script.", time: "~45 min (day before)" },
      { step: "Golden-hour B-roll", detail: "Shoot Patricia's Green art, the boutique strip, Octavia Blvd, street life, and housing variety in good light.", time: "30–45 min (early AM or ~1 hr before sunset)" },
      { step: "Talk-to-camera takes", detail: "Shoot each section as its own clip at the relevant spot; 2 takes each; teleprompter on your phone.", time: "60–90 min" },
      { step: "Pickups & cutaways", detail: "Signs, the station entrance, and a screen-record of your live market page (capture at home).", time: "~15 min" },
      { step: "Edit & caption", detail: "Assemble, add lower-thirds (market URL), burned-in captions, light music bed; export.", time: "2–3 hrs" },
      { step: "Publish & link", detail: "Upload to YouTube, paste the market link in the description — then I add the 'Watch the tour' button to the Hayes Valley page.", time: "~30 min" },
    ],
    batchTip: "Shoot adjacent hoods the same outing — e.g. Hayes Valley + Alamo Square + Civic Center in one flat, central loop.",
  },
  "Pacific Heights": {
    aka: "Pac Heights",
    runtime: "~10 min (8–10 target)",
    marketLink: "https://www.ur4cast.com/listings?nbhd=Pacific%20Heights&layer=nbhd",
    detailsLink: "https://www.ur4cast.com/fog (open the Neighborhoods card → Pacific Heights)",
    route: {
      // Route stays ENTIRELY within the Pacific Heights boundary (verified against
      // the neighborhood polygon). Coords approximate — snap to the sidewalk grid for the final cut.
      spots: [
        { n: 1, name: "Upper Fillmore (Fillmore & Sacramento)", note: "Start — the upscale shopping-and-dining spine, sun out", coord: [-122.4346, 37.7901] },
        { n: 2, name: "Alta Plaza Park", note: "Terraced hilltop green with bay views; the grand grades begin", coord: [-122.4365, 37.7918] },
        { n: 3, name: "Broadway mansion row", note: "'Billionaires' Row' — grand homes, Golden Gate & bay views north", coord: [-122.4411, 37.7949] },
        { n: 4, name: "Lafayette Park", note: "Hilltop park, panoramic city views, leafy edges", coord: [-122.4271, 37.7917] },
        { n: 5, name: "Franklin St Victorians (Haas-Lilienthal House)", note: "The housing-stock segment: grand Victorians & Edwardians", coord: [-122.4250, 37.7929] },
      ],
    },
    sections: [
      {
        label: "COLD OPEN / SIGNATURE INTRO",
        words: 85,
        script:
          "IN SAN FRANCISCO, THE WEATHER CAN CHANGE IN THE SPACE OF A SINGLE BLOCK —\n" +
          "ONE STREET BURIED IN FOG, THE NEXT ONE SITTING IN THE SUN.\n" +
          "AFTER YEARS OF EXPLORING THESE HILLS, I'VE LEARNED THAT THE BEST HOMES\n" +
          "AREN'T FOUND IN A LISTING — THEY'RE IN THE DETAILS YOU ONLY KNOW\n" +
          "ONCE YOU'VE STOOD ON THE CORNER AT DIFFERENT TIMES OF DAY.\n" +
          "RIGHT NOW I'M ON UPPER FILLMORE, AND THE SUN IS OUT —\n" +
          "WHICH IS ALREADY THE FIRST THING WORTH KNOWING ABOUT THIS PLACE.\n" +
          "SO — ARE YOU READY TO SEE PACIFIC HEIGHTS? LET'S GO.",
        broll: ["Two-shot idea: a foggy ridge in one frame, sunny Fillmore St in the next", "You moving up Fillmore St into frame", "A grand mansion facade to place us"],
      },
      {
        label: "1 · LOCATION & LAY OF THE LAND",
        words: 195,
        script:
          "FIRST — WHERE ARE WE? PACIFIC HEIGHTS SITS ON THE HIGH GROUND\n" +
          "OF NORTHERN SAN FRANCISCO, LOOKING OUT OVER THE BAY,\n" +
          "WITH JAPANTOWN AND THE FILLMORE BELOW TO THE SOUTH,\n" +
          "THE MARINA AND COW HOLLOW DROPPING AWAY NORTH TOWARD THE WATER.\n" +
          "THE NAME TELLS YOU THE TRUTH OF IT — THIS IS A TRUE HEIGHTS NEIGHBORHOOD,\n" +
          "RUNNING ROUGHLY 90 TO 380 FEET UP, WITH GRAND VIEWS AND REAL GRADES.\n" +
          "THE COMMERCIAL STRIPS — UPPER FILLMORE AND SACRAMENTO — ARE MANAGEABLE,\n" +
          "FRIENDLY WHETHER YOU'RE PUSHING A STROLLER OR ROLLING A WHEELCHAIR.\n" +
          "BUT THE NORTH–SOUTH CROSS STREETS, THE ONES DROPPING TOWARD THE BAY,\n" +
          "ARE REAL CLIMBS — THEY PASS WHAT THE A-D-A CONSIDERS AN ACCESSIBLE SLOPE,\n" +
          "ABOUT FIVE PERCENT, IN A HURRY.\n" +
          "SO IF STEP-FREE, LOW-GRADE ACCESS MATTERS TO YOU,\n" +
          "THE STRIPS AND THE LEVEL STRETCHES ARE YOUR FRIEND;\n" +
          "THE VIEW BLOCKS ARE A CLIMB, AND THE ROUTE YOU PICK MATTERS.\n" +
          "AND THE HOMES THEMSELVES MATTER TOO —\n" +
          "THESE GRAND VICTORIANS AND EDWARDIANS TYPICALLY SIT UP A FLIGHT OF STAIRS\n" +
          "FROM THE SIDEWALK, SO IF STEP-FREE ENTRY IS A MUST,\n" +
          "IT'S WORTH CHECKING HOME BY HOME.",
        broll: ["Slow pan up Fillmore St; street signs at Fillmore & Sacramento", "Wide establishing shot from a hilltop showing the bay below", "A genuinely steep cross-street dropping north toward the water (show the grade)"],
      },
      {
        label: "2 · HISTORY",
        words: 200,
        script:
          "NOW THE STORY. ALL OF THIS WAS THE ANCESTRAL LAND\n" +
          "OF THE RAMAYTUSH OHLONE LONG BEFORE THE MANSIONS.\n" +
          "PACIFIC HEIGHTS ROSE AS A WEALTHY ENCLAVE IN THE 1870s AND 80s,\n" +
          "ONCE CABLE CARS FINALLY MADE ITS STEEP HILLS REACHABLE.\n" +
          "THE WELL-TO-DO BUILT BLOCK AFTER BLOCK OF GRAND VICTORIAN\n" +
          "AND EDWARDIAN MANSIONS UP HERE ON THE HIGH GROUND.\n" +
          "THEN CAME 1906 — THE EARTHQUAKE AND THE FIRES\n" +
          "THAT LEVELED SO MUCH OF THE CITY BELOW.\n" +
          "BUT THE HILLTOP ESCAPED THE FLAMES,\n" +
          "AND THAT IS WHY, TO THIS DAY, PACIFIC HEIGHTS PRESERVES\n" +
          "ONE OF THE DENSEST COLLECTIONS OF PRE-1906 MANSIONS IN SAN FRANCISCO.\n" +
          "WHILE OTHER NEIGHBORHOODS WERE REBUILT FROM ASH,\n" +
          "THESE STREETS KEPT THEIR ORIGINAL GRANDEUR.\n" +
          "UPPER FILLMORE GREW UP ALONGSIDE THEM AS THE REFINED\n" +
          "SHOPPING-AND-DINING SPINE IT STILL IS TODAY.\n" +
          "AND THE NEIGHBORHOOD NEVER LOST ITS STATUS —\n" +
          "IT STILL HOLDS SOME OF THE MOST EXPENSIVE REAL ESTATE IN THE COUNTRY.\n" +
          "SPEND TIME ON THESE BLOCKS, AND YOU'RE STANDING IN\n" +
          "OLD-MONEY SAN FRANCISCO, REMARKABLY INTACT.",
        broll: ["Grand Victorian & Edwardian facades", "Haas-Lilienthal House on Franklin St", "A view down a cross-street toward the rebuilt city below"],
      },
      {
        label: "3 · HIDDEN FACTS",
        words: 160,
        script:
          "HERE'S WHAT MOST PEOPLE DON'T KNOW.\n" +
          "THAT STRETCH OF BROADWAY BETWEEN DIVISADERO AND LYON\n" +
          "IS NICKNAMED 'BILLIONAIRES' ROW' —\n" +
          "AMONG THE MOST EXPENSIVE RESIDENTIAL BLOCKS IN THE ENTIRE COUNTRY,\n" +
          "HOME TO TECH MOGULS AND OLD SAN FRANCISCO FORTUNES.\n" +
          "BUT YOU DON'T NEED A FORTUNE TO STEP INSIDE ONE —\n" +
          "THE HAAS-LILIENTHAL HOUSE ON FRANKLIN STREET, BUILT IN 1886,\n" +
          "IS THE ONLY INTACT QUEEN ANNE VICTORIAN MANSION IN THE CITY\n" +
          "RUN AS A PUBLIC MUSEUM — YOU CAN ACTUALLY GO IN.\n" +
          "AND THE LANDMARK SPRECKELS MANSION ON WASHINGTON STREET\n" +
          "HAS BEEN HOME TO NOVELIST DANIELLE STEEL FOR DECADES —\n" +
          "ONE OF SEVERAL GRAND HOMES THAT HAVE DRAWN FAMOUS RESIDENTS UP HERE.\n" +
          "THIS IS A NEIGHBORHOOD THAT WEARS ITS WEALTH QUIETLY,\n" +
          "BUT THE STORIES ARE EVERYWHERE ONCE YOU KNOW WHERE TO LOOK.",
        broll: ["The Broadway mansion row, tight on facades", "Haas-Lilienthal House exterior", "The Spreckels Mansion from the street"],
      },
      {
        label: "4 · MICROCLIMATE",
        words: 95,
        script:
          "QUICK WORD ON WEATHER — BECAUSE IN SAN FRANCISCO, MICROCLIMATE IS EVERYTHING.\n" +
          "PACIFIC HEIGHTS SITS IN ONE OF THE CITY'S BRIGHTER POCKETS.\n" +
          "WHILE THE AVENUES OUT WEST DISAPPEAR INTO SUMMER FOG,\n" +
          "THIS HIGH GROUND ON THE NORTH SIDE OF THE CITY\n" +
          "OFTEN CATCHES THE SUN AND STAYS BRIGHTER —\n" +
          "WITH THE BAY GLITTERING BELOW. PEOPLE PAY FOR LIGHT.\n" +
          "I KEEP A LIVE FOG MAP THAT SHOWS THIS NEIGHBORHOOD'S EXACT SUMMER-FOG HOURS\n" +
          "VERSUS THE FOGGY WEST SIDE — IT'S LINKED ON MY PACIFIC HEIGHTS PAGE BELOW.",
        broll: ["Blue sky over Fillmore St; you in shirtsleeves", "Contrast: fog pouring over the western ridge", "Edit: screen-cap of the Ur4cast fog map"],
      },
      {
        label: "5 · GETTING AROUND — CAR-FREE",
        words: 290,
        script:
          "NOW THE PART THAT REALLY MATTERS IF YOU'RE BUYING HERE:\n" +
          "HOW YOU GET AROUND. PACIFIC HEIGHTS IS A REAL TRANSIT NEIGHBORHOOD,\n" +
          "AND YOU CAN ABSOLUTELY LIVE HERE WITHOUT A CAR.\n" +
          "IT'S A BUS NEIGHBORHOOD AT HEART: THE 1-CALIFORNIA RUNS EAST–WEST\n" +
          "STRAIGHT DOWNTOWN, THE 3 AND THE 24-DIVISADERO CROSS THE HILLS,\n" +
          "AND THE 22-FILLMORE THREADS NORTH–SOUTH RIGHT THROUGH THE CENTER.\n" +
          "THERE'S NO BART STATION UP HERE — THE NEAREST IS A TRANSFER DOWNTOWN —\n" +
          "SO I PUT THE EXACT LINES ON THE DETAILS PAGE UNDER TRANSIT.\n" +
          "NOW LET'S LEAVE THE CITY — CAR-FREE.\n" +
          "THE FERRY BUILDING IS ABOUT TWO POINT TWO MILES NORTHEAST,\n" +
          "A MUNI RIDE DOWN CALIFORNIA STREET,\n" +
          "AND THAT'S YOUR GATEWAY TO THE WATER.\n" +
          "GOING TO THE EAST BAY? TAKE BART FROM DOWNTOWN —\n" +
          "OAKLAND IS ABOUT THIRTY TO THIRTY-FIVE MINUTES,\n" +
          "OR THE BAY BRIDGE BY CAR.\n" +
          "HEADING NORTH TO MARIN? DRIVE THE GOLDEN GATE BRIDGE TO LARKSPUR\n" +
          "IN ABOUT TWENTY TO TWENTY-FIVE MINUTES —\n" +
          "OR TAKE THE LARKSPUR FERRY FROM THE FERRY BUILDING,\n" +
          "ABOUT THIRTY MINUTES ON THE WATER.\n" +
          "HEADING SOUTH TO THE PENINSULA? TAKE CALTRAIN FROM 4TH AND KING\n" +
          "DOWN TO PALO ALTO IN ABOUT FIFTY MINUTES —\n" +
          "OR IT'S 280 OR 101 BY CAR.\n" +
          "BOTTOM LINE: WATER, RAIL, AND THREE BRIDGES — ALL WITHOUT OWNING A CAR.",
        broll: [
          "A 1-California bus on the strip; the Fillmore bus climbing the hill",
          "Embarcadero / the Ferry Building / a departing ferry",
          "A BART train; the Bay Bridge; the Golden Gate Bridge; a Caltrain at 4th & King",
          "Simple motion-graphic map: Pacific Heights → Oakland / Larkspur / Palo Alto with the times",
        ],
      },
      {
        label: "6 · THE GROUND UNDER YOU (HAZARDS)",
        words: 110,
        script:
          "TWO QUICK, HONEST NOTES ON THE GROUND ITSELF.\n" +
          "GOOD NEWS FIRST: PACIFIC HEIGHTS SITS UP HIGH, WELL ABOVE THE BAY,\n" +
          "SO IT IS NOT IN A TSUNAMI HAZARD ZONE — CROSS THAT WORRY OFF THE LIST.\n" +
          "LIKE MUCH OF HILLY SAN FRANCISCO, PARTS OF THE NEIGHBORHOOD\n" +
          "DO FALL WITHIN A STATE-DESIGNATED SEISMIC HAZARD ZONE —\n" +
          "THAT'S STANDARD FOR THE CITY'S SLOPES, AND IT'S SOMETHING\n" +
          "EVERY CALIFORNIA BUYER REVIEWS WITH THEIR INSPECTOR AND INSURER.\n" +
          "I PUT THE SEISMIC AND TSUNAMI STATUS RIGHT ON EACH NEIGHBORHOOD'S\n" +
          "DETAILS PAGE, SO YOU CAN CHECK ANY SPECIFIC BLOCK BEFORE YOU WRITE AN OFFER.",
        broll: ["You gesturing out over the bay from a hilltop", "Edit: the seismic + tsunami toggles on your fog map"],
      },
      {
        label: "7 · DINING, NIGHTLIFE & DAILY LIFE",
        words: 120,
        script:
          "LET'S TALK DAILY LIFE.\n" +
          "UPPER FILLMORE IS ONE OF THE MOST POLISHED COMMERCIAL STRIPS IN THE CITY —\n" +
          "BOUTIQUES, SIDEWALK CAFÉS, ACCLAIMED RESTAURANTS,\n" +
          "WINE BARS, AND A GENTEEL, UNHURRIED KIND OF EVENING SCENE.\n" +
          "I'M NOT GOING TO NAME SPECIFIC PLACES ON CAMERA, BECAUSE THE LINEUP CHANGES —\n" +
          "AND I NEVER WANT TO SEND YOU SOMEWHERE THAT'S CLOSED.\n" +
          "INSTEAD, I KEEP A CURRENT, HAND-CHECKED LIST OF THE NEIGHBORHOOD'S BEST\n" +
          "RESTAURANTS AND BARS RIGHT ON MY PACIFIC HEIGHTS DETAILS PAGE — ALWAYS UP TO DATE.\n" +
          "THE VIBE TO KNOW: THIS IS A RIGHT-OUTSIDE-YOUR-DOOR, LEAVE-THE-CAR-HOME KIND OF PLACE.",
        broll: ["Boutique windows and café tables on Fillmore", "A busy restaurant window at dusk", "People strolling the strip in good light (general, not a single endorsement)"],
      },
      {
        label: "8 · REAL ESTATE",
        words: 120,
        script:
          "ON HOUSING: PACIFIC HEIGHTS IS OLD-MONEY SAN FRANCISCO AT ITS GRANDEST —\n" +
          "STATELY VICTORIAN AND EDWARDIAN MANSIONS, ELEGANT FLATS,\n" +
          "AND CONDOS AND CO-OPS ALONG THE LEAFIER, QUIETER STREETS.\n" +
          "IT RUNS FROM A REFINED CONDO TO A LANDMARK MANSION ON A VIEW BLOCK.\n" +
          "I'M NOT GOING TO QUOTE A MEDIAN PRICE ON CAMERA, BECAUSE THAT NUMBER MOVES.\n" +
          "INSTEAD, I KEEP A LIVE MARKET UPDATE FOR PACIFIC HEIGHTS ON MY SITE —\n" +
          "CURRENT MEDIANS FOR SINGLE-FAMILY HOMES AND FOR CONDOS, RIGHT UP TO TODAY.\n" +
          "THE LINK IS BELOW. THAT'S YOUR SMARTEST FIRST STEP BEFORE YOU EVEN TOUR.",
        broll: ["A grand Victorian, an elegant flats building, a modern condo entry", "A 'For Sale' sign", "Edit: lower-third + screen-record of your live market page"],
      },
      {
        label: "9 · WHO BELONGS HERE + SIGNATURE OUTRO",
        words: 120,
        script:
          "SO — WHO BELONGS IN PACIFIC HEIGHTS?\n" +
          "SOMEONE WHO WANTS LIGHT, BAY VIEWS, AND OLD-WORLD ELEGANCE,\n" +
          "WITH A POLISHED FILLMORE STREET RIGHT OUTSIDE THEIR DOOR\n" +
          "AND THE WHOLE BAY AREA A BUS, A TRAIN, OR A FERRY AWAY.\n" +
          "BUT HERE'S THE THING I'VE LEARNED AFTER ALL THESE YEARS:\n" +
          "EVERY NEIGHBORHOOD IN THIS CITY HAS A STORY LIKE THIS ONE,\n" +
          "AND KNOWING THEM ALL IS THE WORK — THE MICROCLIMATES,\n" +
          "THE STREETS THAT HOLD THEIR VALUE, THE THINGS THAT NEVER SHOW UP IN A SEARCH.\n" +
          "ANYTHING THAT CHANGES — PRICES, THE NEWEST RESTAURANT, WHAT'S FOR SALE —\n" +
          "STAYS CURRENT ON MY PACIFIC HEIGHTS NEIGHBORHOOD PAGE, SO THIS GUIDE NEVER GOES STALE.\n" +
          "SO IF YOU'RE THINKING ABOUT CALLING PACIFIC HEIGHTS HOME,\n" +
          "I'D LOVE TO SHOW YOU AROUND AND HELP CREATE YOUR NEXT LIFE ADVENTURE.",
        broll: ["Golden-hour, unhurried pass down Fillmore St (you, relaxed, not pitching)", "A quiet look out over the bay from a hilltop park", "Soft end card: your name + how to reach you"],
      },
    ],
    schedule: [
      { step: "Scout & lock script", detail: "Take the route, mark the 6–8 B-roll stops, finalize edits to this script.", time: "~45 min (day before)" },
      { step: "Golden-hour B-roll", detail: "Shoot the mansion rows, Fillmore strip, the park views, and housing variety in good light.", time: "30–45 min (early AM or ~1 hr before sunset)" },
      { step: "Talk-to-camera takes", detail: "Shoot each section as its own clip at the relevant spot; 2 takes each; teleprompter on your phone.", time: "60–90 min" },
      { step: "Pickups & cutaways", detail: "Signs, the bus stops, and a screen-record of your live market page (capture at home).", time: "~15 min" },
      { step: "Edit & caption", detail: "Assemble, add lower-thirds (market URL), burned-in captions, light music bed; export.", time: "2–3 hrs" },
      { step: "Publish & link", detail: "Upload to YouTube, paste the market link in the description — then I add the 'Watch the tour' button to the Pacific Heights page.", time: "~30 min" },
    ],
    batchTip: "Shoot adjacent hoods the same outing — e.g. Pacific Heights + Japantown + Cow Hollow in one morning loop.",
  },
  "Mission": {
    aka: "La Misión",
    runtime: "~10 min (8–10 target)",
    marketLink: "https://www.ur4cast.com/listings?nbhd=Mission&layer=nbhd",
    detailsLink: "https://www.ur4cast.com/fog (open the Neighborhoods card → Mission)",
    route: {
      // Route stays ENTIRELY within the Mission boundary (verified against the
      // neighborhood polygon). Coords approximate — snap to the sidewalk grid for the final cut.
      spots: [
        { n: 1, name: "Valencia Street (at 18th)", note: "Start — the sunny, café-and-boutique spine of the Mission", coord: [-122.4214, 37.7615] },
        { n: 2, name: "16th Street Mission BART & plaza", note: "Transit-and-cultural hub — murals, taquerias, panaderias (Mission Dolores is two blocks west)", coord: [-122.4197, 37.7649] },
        { n: 3, name: "Clarion Alley murals", note: "Open-air gallery of Latino & political street art", coord: [-122.4197, 37.7634] },
        { n: 4, name: "24th Street / Calle 24 Latino Cultural District", note: "Taquerias, panaderias, the heart of Latino Mission", coord: [-122.4148, 37.7524] },
        { n: 5, name: "Balmy Alley murals", note: "The oldest, deepest concentration of murals in the city", coord: [-122.4121, 37.7522] },
        { n: 6, name: "24th St Mission BART", note: "End — the transit anchor; trains straight to the East Bay", coord: [-122.4185, 37.7524] },
      ],
    },
    sections: [
      {
        label: "COLD OPEN / SIGNATURE INTRO",
        words: 85,
        script:
          "IN SAN FRANCISCO, THE WEATHER CAN CHANGE IN THE SPACE OF A SINGLE BLOCK —\n" +
          "ONE STREET BURIED IN FOG, THE NEXT ONE SITTING IN THE SUN.\n" +
          "AFTER YEARS OF EXPLORING THESE HILLS, I'VE LEARNED THAT THE BEST HOMES\n" +
          "AREN'T FOUND IN A LISTING — THEY'RE IN THE DETAILS YOU ONLY KNOW\n" +
          "ONCE YOU'VE STOOD ON THE CORNER AT DIFFERENT TIMES OF DAY.\n" +
          "RIGHT NOW I'M ON VALENCIA STREET, AND THE SUN IS OUT —\n" +
          "WHICH IS ALREADY THE FIRST THING WORTH KNOWING ABOUT THIS PLACE.\n" +
          "SO — ARE YOU READY TO SEE THE MISSION? LET'S GO.",
        broll: ["Two-shot idea: a foggy ridge in one frame, sunny Valencia St in the next", "You moving up Valencia St into frame", "A bright mural wall to place us"],
      },
      {
        label: "1 · LOCATION & LAY OF THE LAND",
        words: 195,
        script:
          "FIRST — WHERE ARE WE? THE MISSION SITS IN THE EAST-CENTRAL FLATS OF SAN FRANCISCO,\n" +
          "EAST OF THE CASTRO AND NOE VALLEY, SOUTH OF THE LOWER HAIGHT,\n" +
          "WITH POTRERO HILL AND BERNAL HEIGHTS RISING JUST BEYOND ITS EDGES.\n" +
          "TWO MAIN SPINES RUN THROUGH IT — VALENCIA STREET AND MISSION STREET —\n" +
          "DOWN A WIDE, LEVEL VALLEY FLOOR.\n" +
          "AND THAT'S THE FIRST BIG THING: THIS NEIGHBORHOOD IS FLAT.\n" +
          "MOST OF THE MISSION SITS BETWEEN ABOUT TWENTY AND ONE HUNDRED TWENTY FEET UP,\n" +
          "ON LEVEL GROUND THAT IS GENUINELY EASY TO GET AROUND —\n" +
          "FRIENDLY WHETHER YOU'RE PUSHING A STROLLER OR ROLLING A WHEELCHAIR,\n" +
          "WELL WITHIN WHAT THE A-D-A CONSIDERS AN ACCESSIBLE GRADE — ABOUT FIVE PERCENT.\n" +
          "AFTER A CITY FULL OF HILLS, THE MISSION IS A RELIEF UNDERFOOT.\n" +
          "ONE HONEST NOTE ON THE HOMES THEMSELVES:\n" +
          "MANY OF THESE CLASSIC VICTORIAN FLATS SIT UP A FLIGHT OF STEPS FROM THE SIDEWALK,\n" +
          "SO EVEN ON THIS LEVEL GROUND, STEP-FREE ENTRY VARIES HOME BY HOME —\n" +
          "IT'S ALWAYS WORTH CHECKING THE SPECIFIC BUILDING.\n" +
          "BUT THE NEIGHBORHOOD ITSELF? ABOUT AS EASY TO MOVE THROUGH AS SAN FRANCISCO GETS.",
        broll: ["Slow pan down Valencia St; flat sidewalk stretching ahead", "Wide establishing shot showing the level valley floor with hills beyond", "A Victorian flat with a stoop of entry steps (to show step-free varies)"],
      },
      {
        label: "2 · HISTORY",
        words: 200,
        script:
          "NOW THE STORY. THE MISSION IS WHERE SAN FRANCISCO BEGAN.\n" +
          "ALL OF THIS WAS THE ANCESTRAL LAND OF THE RAMAYTUSH OHLONE\n" +
          "LONG BEFORE THE SPANISH ARRIVED.\n" +
          "IN 1776, THEY FOUNDED MISSION SAN FRANCISCO DE ASÍS — MISSION DOLORES —\n" +
          "AND IT GAVE BOTH THIS NEIGHBORHOOD AND THE WHOLE CITY THEIR NAMES.\n" +
          "THAT LITTLE ADOBE CHURCH, FINISHED IN 1791, STILL STANDS TODAY —\n" +
          "THE OLDEST INTACT BUILDING IN SAN FRANCISCO.\n" +
          "FOR GENERATIONS THE MISSION WAS A WORKING-CLASS, HEAVILY LATINO NEIGHBORHOOD —\n" +
          "IRISH AND GERMAN FAMILIES EARLY ON, THEN A DEEP, LASTING\n" +
          "MEXICAN AND CENTRAL AMERICAN COMMUNITY THAT SHAPED ITS SOUL.\n" +
          "THAT HERITAGE IS WRITTEN ON THE WALLS — IN MURALS —\n" +
          "AND TASTED IN THE TAQUERIAS THAT MADE THIS PLACE FAMOUS.\n" +
          "IN RECENT DECADES, A WAVE OF ACCLAIMED RESTAURANTS AND RISING RENTS\n" +
          "HAS RESHAPED THE MISSION YET AGAIN —\n" +
          "SO TODAY YOU FEEL BOTH LAYERS AT ONCE:\n" +
          "THE OLD LATINO HEART AND THE NEW DESTINATION-DINING ENERGY,\n" +
          "SHARING THE SAME SUNNY BLOCKS. SPEND TIME HERE, AND YOU'RE STANDING\n" +
          "IN THE OLDEST — AND ONE OF THE MOST ALIVE — CORNERS OF THE CITY.",
        broll: ["Mission Dolores facade", "A long mural wall on 24th St", "Valencia St street life, old and new side by side"],
      },
      {
        label: "3 · HIDDEN FACTS",
        words: 160,
        script:
          "HERE'S WHAT MOST PEOPLE DON'T KNOW.\n" +
          "THE MISSION-STYLE BURRITO — THAT OVERSIZED, FOIL-WRAPPED ONE\n" +
          "WITH THE RICE AND BEANS INSIDE — WAS BORN RIGHT HERE\n" +
          "IN THE NEIGHBORHOOD'S TAQUERIAS IN THE LATE 1960s,\n" +
          "AND FROM THESE BLOCKS IT WENT AROUND THE WORLD.\n" +
          "THE MISSION IS ALSO THE CITY'S MURAL CAPITAL —\n" +
          "BALMY ALLEY AND CLARION ALLEY ARE OPEN-AIR GALLERIES OF LATINO\n" +
          "AND POLITICAL STREET ART, RENEWED BY COMMUNITY ARTISTS SINCE THE 1970s.\n" +
          "AND 24TH STREET CARRIES AN OFFICIAL NAME — CALLE VEINTICUATRO —\n" +
          "A DESIGNATED LATINO CULTURAL DISTRICT THAT PROTECTS\n" +
          "THE PANADERIAS, MURALS, AND FAMILY SHOPS THAT GIVE IT ITS CHARACTER.\n" +
          "ONE NEIGHBORHOOD, AND IT GAVE THE WORLD A BURRITO, A MURAL TRADITION,\n" +
          "AND THE OLDEST BUILDING IN SAN FRANCISCO.",
        broll: ["Tight shots of Balmy Alley murals", "A foil-wrapped burrito (general, not a single shop)", "Calle 24 banners / street signs"],
      },
      {
        label: "4 · MICROCLIMATE",
        words: 95,
        script:
          "QUICK WORD ON WEATHER — BECAUSE IN SAN FRANCISCO, MICROCLIMATE IS EVERYTHING.\n" +
          "AND THIS IS THE HEADLINE FOR THE MISSION:\n" +
          "IT IS THE SUNNIEST, WARMEST POCKET IN THE ENTIRE CITY.\n" +
          "WHILE THE AVENUES OUT WEST DISAPPEAR INTO SUMMER FOG,\n" +
          "TWIN PEAKS ACTS LIKE A WALL — THE FOG STOPS SHORT OF THE MISSION,\n" +
          "AND THIS VALLEY FLOOR CAN RUN TEN DEGREES WARMER THAN THE WEST SIDE.\n" +
          "PEOPLE PAY FOR LIGHT, AND THIS IS WHERE THE LIGHT LIVES.\n" +
          "I KEEP A LIVE FOG MAP THAT SHOWS EXACTLY WHERE THE FOG STOPS —\n" +
          "IT'S LINKED ON MY MISSION PAGE BELOW.",
        broll: ["Blue sky over Valencia St; you in shirtsleeves", "Contrast: fog pouring over the Twin Peaks ridge but stopping short", "Edit: screen-cap of the Ur4cast fog map"],
      },
      {
        label: "5 · GETTING AROUND — CAR-FREE",
        words: 290,
        script:
          "NOW THE PART THAT REALLY MATTERS IF YOU'RE BUYING HERE:\n" +
          "HOW YOU GET AROUND. AND THE MISSION IS ONE OF THE BEST-CONNECTED\n" +
          "NEIGHBORHOODS IN THE WHOLE CITY — MAYBE THE BEST.\n" +
          "RIGHT HERE YOU HAVE TWO BART STATIONS — 16TH AND 24TH AND MISSION —\n" +
          "PLUS THE 14-MISSION AND THE 14R RAPID, THE 49 VAN NESS/MISSION,\n" +
          "AND THE J-CHURCH MUNI METRO SKIRTING THE WESTERN EDGE.\n" +
          "NOW LET'S LEAVE THE CITY — CAR-FREE.\n" +
          "THE FERRY BUILDING IS ABOUT TWO-POINT-EIGHT MILES NORTHEAST,\n" +
          "A QUICK BART OR MUNI HOP, AND THAT'S YOUR GATEWAY TO THE WATER.\n" +
          "GOING TO THE EAST BAY? THIS IS A REAL SELLING POINT —\n" +
          "TAKE BART STRAIGHT FROM 16TH OR 24TH STREET\n" +
          "AND YOU'RE IN DOWNTOWN OAKLAND IN ABOUT TWENTY TO TWENTY-FIVE MINUTES,\n" +
          "NO TRANSFERS, NO CAR, NO BRIDGE TRAFFIC.\n" +
          "HEADING NORTH TO MARIN? TAKE BART OR MUNI TO THE FERRY BUILDING,\n" +
          "AND THE LARKSPUR FERRY CROSSES IN ABOUT THIRTY MINUTES ON THE WATER —\n" +
          "OR DRIVE THE GOLDEN GATE BRIDGE IF YOU PREFER.\n" +
          "HEADING SOUTH TO THE PENINSULA? TAKE MUNI TO THE CALTRAIN DEPOT\n" +
          "AT 4TH AND KING, AND CALTRAIN RUNS DOWN TO PALO ALTO IN ABOUT FIFTY MINUTES —\n" +
          "OR DRIVE 280 OR 101; BART ALSO RUNS SOUTH TO MILLBRAE.\n" +
          "BOTTOM LINE: TWO BART STATIONS AT YOUR DOOR, THE FERRY, AND CALTRAIN —\n" +
          "THE WHOLE BAY AREA OPENS UP WITHOUT EVER OWNING A CAR.",
        broll: [
          "24th St Mission BART entrance; a 14R rolling up Mission St",
          "Embarcadero / the Ferry Building / a departing ferry",
          "A BART train; the Golden Gate Bridge; a Caltrain at 4th & King",
          "Simple motion-graphic map: Mission → Oakland / Larkspur / Palo Alto with the times",
        ],
      },
      {
        label: "6 · THE GROUND UNDER YOU (HAZARDS)",
        words: 110,
        script:
          "TWO QUICK, HONEST NOTES ON THE GROUND ITSELF.\n" +
          "GOOD NEWS FIRST: THE MISSION SITS INLAND, WELL BACK FROM THE BAY,\n" +
          "SO IT IS NOT IN A TSUNAMI HAZARD ZONE — CROSS THAT WORRY OFF THE LIST.\n" +
          "ON THE OTHER SIDE: PARTS OF THIS FLAT VALLEY FLOOR\n" +
          "DO FALL WITHIN A STATE-DESIGNATED SEISMIC AND LIQUEFACTION HAZARD ZONE —\n" +
          "THAT'S STANDARD FOR LOW, LEVEL GROUND LIKE THIS, AND IT'S SOMETHING\n" +
          "EVERY CALIFORNIA BUYER REVIEWS WITH THEIR INSPECTOR AND INSURER.\n" +
          "I PUT THE SEISMIC AND TSUNAMI STATUS RIGHT ON EACH NEIGHBORHOOD'S\n" +
          "DETAILS PAGE, SO YOU CAN CHECK ANY SPECIFIC BLOCK BEFORE YOU WRITE AN OFFER.",
        broll: ["You gesturing along the flat valley floor", "Edit: the seismic + tsunami toggles on your fog map"],
      },
      {
        label: "7 · DINING, NIGHTLIFE & DAILY LIFE",
        words: 120,
        script:
          "LET'S TALK DAILY LIFE.\n" +
          "THE MISSION IS, QUITE SIMPLY, ONE OF THE GREAT FOOD NEIGHBORHOODS\n" +
          "IN AMERICA — LEGENDARY TAQUERIAS AND PANADERIAS\n" +
          "ALONGSIDE SOME OF THE MOST ACCLAIMED, RESERVATION-ONLY RESTAURANTS IN THE CITY,\n" +
          "PLUS COFFEE, COCKTAIL BARS, AND LATE-NIGHT ENERGY ON VALENCIA AND MISSION.\n" +
          "I'M NOT GOING TO NAME SPECIFIC PLACES ON CAMERA, BECAUSE THE LINEUP CHANGES —\n" +
          "AND I NEVER WANT TO SEND YOU SOMEWHERE THAT'S CLOSED.\n" +
          "INSTEAD, I KEEP A CURRENT, HAND-CHECKED LIST OF THE NEIGHBORHOOD'S BEST\n" +
          "RESTAURANTS AND BARS RIGHT ON MY MISSION DETAILS PAGE — ALWAYS UP TO DATE.\n" +
          "THE VIBE TO KNOW: THIS IS A RIGHT-OUTSIDE-YOUR-DOOR, LEAVE-THE-CAR-HOME KIND OF PLACE.",
        broll: ["Café tables on Valencia; a busy restaurant window at dusk", "A taqueria counter (general, not a single endorsement)", "Valencia St at night, lit up and lively"],
      },
      {
        label: "8 · REAL ESTATE",
        words: 120,
        script:
          "ON HOUSING: THE MISSION IS CLASSIC, COLORFUL SAN FRANCISCO —\n" +
          "VICTORIAN AND EDWARDIAN FLATS, ELEGANT SINGLE-FAMILY HOMES\n" +
          "ON THE QUIETER SIDE STREETS, AND MODERN CONDOS AND T-I-C UNITS\n" +
          "ALONG THE BUSIER CORRIDORS NEAR BART.\n" +
          "IT RUNS FROM A FIRST CONDO TO A FULLY RESTORED VICTORIAN SHOWPIECE.\n" +
          "I'M NOT GOING TO QUOTE A MEDIAN PRICE ON CAMERA, BECAUSE THAT NUMBER MOVES.\n" +
          "INSTEAD, I KEEP A LIVE MARKET UPDATE FOR THE MISSION ON MY SITE —\n" +
          "CURRENT MEDIANS FOR SINGLE-FAMILY HOMES AND FOR CONDOS, RIGHT UP TO TODAY.\n" +
          "THE LINK IS BELOW. THAT'S YOUR SMARTEST FIRST STEP BEFORE YOU EVEN TOUR.",
        broll: ["A painted Victorian, a flats building, a modern condo entry", "A 'For Sale' sign", "Edit: lower-third + screen-record of your live market page"],
      },
      {
        label: "9 · WHO BELONGS HERE + SIGNATURE OUTRO",
        words: 120,
        script:
          "SO — WHO BELONGS IN THE MISSION?\n" +
          "SOMEONE WHO WANTS SUN, FLAVOR, AND ENERGY —\n" +
          "THE WARMEST WEATHER IN THE CITY, THE BEST FOOD WITHIN REACH,\n" +
          "AND THE WHOLE BAY AREA A BART RIDE AWAY, WITHOUT EVER NEEDING A CAR.\n" +
          "BUT HERE'S THE THING I'VE LEARNED AFTER ALL THESE YEARS:\n" +
          "EVERY NEIGHBORHOOD IN THIS CITY HAS A STORY LIKE THIS ONE,\n" +
          "AND KNOWING THEM ALL IS THE WORK — THE MICROCLIMATES,\n" +
          "THE STREETS THAT HOLD THEIR VALUE, THE THINGS THAT NEVER SHOW UP IN A SEARCH.\n" +
          "ANYTHING THAT CHANGES — PRICES, THE NEWEST RESTAURANT, WHAT'S FOR SALE —\n" +
          "STAYS CURRENT ON MY MISSION NEIGHBORHOOD PAGE, SO THIS GUIDE NEVER GOES STALE.\n" +
          "SO IF YOU'RE THINKING ABOUT CALLING THE MISSION HOME,\n" +
          "I'D LOVE TO SHOW YOU AROUND AND HELP CREATE YOUR NEXT LIFE ADVENTURE.",
        broll: ["Golden-hour, unhurried pass down Valencia St (you, relaxed, not pitching)", "A quiet look at a sunlit mural wall", "Soft end card: your name + how to reach you"],
      },
    ],
    schedule: [
      { step: "Scout & lock script", detail: "Take the route, mark the 6–8 B-roll stops, finalize edits to this script.", time: "~45 min (day before)" },
      { step: "Golden-hour B-roll", detail: "Shoot the murals, Mission Dolores, Valencia & 24th St life, and housing variety in good light.", time: "30–45 min (early AM or ~1 hr before sunset)" },
      { step: "Talk-to-camera takes", detail: "Shoot each section as its own clip at the relevant spot; 2 takes each; teleprompter on your phone.", time: "60–90 min" },
      { step: "Pickups & cutaways", detail: "Signs, the BART entrance, and a screen-record of your live market page (capture at home).", time: "~15 min" },
      { step: "Edit & caption", detail: "Assemble, add lower-thirds (market URL), burned-in captions, light music bed; export.", time: "2–3 hrs" },
      { step: "Publish & link", detail: "Upload to YouTube, paste the market link in the description — then I add the 'Watch the tour' button to the Mission page.", time: "~30 min" },
    ],
    batchTip: "Shoot adjacent hoods the same outing — e.g. Mission + Bernal Heights + Potrero Hill in one sunny loop.",
  },
  "North Beach": {
    aka: "Little Italy",
    runtime: "~10 min (8–10 target)",
    marketLink: "https://www.ur4cast.com/listings?nbhd=North%20Beach&layer=nbhd",
    detailsLink: "https://www.ur4cast.com/fog (open the Neighborhoods card → North Beach)",
    route: {
      // Route stays ENTIRELY within the North Beach boundary (verified against
      // the neighborhood polygon). Coords approximate — snap to the sidewalk grid for the final cut.
      spots: [
        { n: 1, name: "Washington Square", note: "Start — the green heart, with Saints Peter & Paul Church behind it", coord: [-122.4097, 37.8005] },
        { n: 2, name: "Saints Peter & Paul Church", note: "The twin-spire 'Italian Cathedral of the West' on the square's north edge", coord: [-122.4103, 37.8009] },
        { n: 3, name: "Columbus Ave café strip", note: "The diagonal spine — espresso bars and red-sauce institutions", coord: [-122.4082, 37.7998] },
        { n: 4, name: "Columbus & Broadway / Jack Kerouac Alley", note: "The Beat-era edge — City Lights, Vesuvio, the literary corner", coord: [-122.4068, 37.7982] },
        { n: 5, name: "Filbert St toward Telegraph Hill", note: "A residential block tilting up toward Coit Tower", coord: [-122.4081, 37.8010] },
      ],
    },
    sections: [
      {
        label: "COLD OPEN / SIGNATURE INTRO",
        words: 85,
        script:
          "IN SAN FRANCISCO, THE WEATHER CAN CHANGE IN THE SPACE OF A SINGLE BLOCK —\n" +
          "ONE STREET BURIED IN FOG, THE NEXT ONE SITTING IN THE SUN.\n" +
          "AFTER YEARS OF EXPLORING THESE HILLS, I'VE LEARNED THAT THE BEST HOMES\n" +
          "AREN'T FOUND IN A LISTING — THEY'RE IN THE DETAILS YOU ONLY KNOW\n" +
          "ONCE YOU'VE STOOD ON THE CORNER AT DIFFERENT TIMES OF DAY.\n" +
          "RIGHT NOW I'M AT WASHINGTON SQUARE, AND THE SUN IS OUT —\n" +
          "WHICH IS ALREADY THE FIRST THING WORTH KNOWING ABOUT THIS PLACE.\n" +
          "SO — ARE YOU READY TO SEE NORTH BEACH? LET'S GO.",
        broll: ["Two-shot idea: a foggy ridge in one frame, sunny Washington Square in the next", "You crossing into the square into frame", "Saints Peter & Paul's twin spires to place us"],
      },
      {
        label: "1 · LOCATION & LAY OF THE LAND",
        words: 195,
        script:
          "FIRST — WHERE ARE WE? NORTH BEACH SITS IN THE CITY'S NORTHEAST CORNER,\n" +
          "TUCKED BETWEEN CHINATOWN TO THE SOUTH, THE EMBARCADERO AND THE BAY TO THE EAST,\n" +
          "WITH RUSSIAN HILL OVER THE RISE TO THE WEST AND TELEGRAPH HILL ABOVE IT.\n" +
          "THE MAIN SPINE IS COLUMBUS AVENUE, CUTTING DIAGONALLY\n" +
          "THROUGH A FLAT CAFÉ-AND-RESTAURANT CORE AROUND WASHINGTON SQUARE.\n" +
          "THAT CORE SITS ONLY ABOUT TEN FEET UP, AND IT'S FAIRLY LEVEL AND EASY TO GET AROUND —\n" +
          "FRIENDLY WHETHER YOU'RE PUSHING A STROLLER OR ROLLING A WHEELCHAIR.\n" +
          "BUT THIS IS SAN FRANCISCO, SO THE EDGES CLIMB FAST:\n" +
          "HEAD UP TOWARD TELEGRAPH HILL AND COIT TOWER AND THE BLOCKS GET STEEP,\n" +
          "RISING TO ROUGHLY A HUNDRED AND SEVENTY FEET,\n" +
          "QUICKLY PASSING WHAT THE A-D-A CONSIDERS AN ACCESSIBLE SLOPE — ABOUT FIVE PERCENT.\n" +
          "SO IF STEP-FREE, LOW-GRADE ACCESS MATTERS TO YOU,\n" +
          "THE CAFÉ CORE IS YOUR FRIEND; THE UPPER BLOCKS ARE A CLIMB.\n" +
          "AND THE HOMES THEMSELVES MATTER TOO —\n" +
          "MANY OF THESE BUILDINGS SIT UP A FLIGHT OF STAIRS FROM THE SIDEWALK,\n" +
          "SO IF STEP-FREE ENTRY IS A MUST, IT'S WORTH CHECKING HOME BY HOME.",
        broll: ["Slow pan up Columbus Ave; the diagonal cut through the grid", "Wide establishing shot showing the flat core + Telegraph Hill rising", "A genuinely steep cross-street climbing toward Coit Tower (show the grade)"],
      },
      {
        label: "2 · HISTORY",
        words: 200,
        script:
          "NOW THE STORY. NORTH BEACH ACTUALLY HAD A BEACH ONCE —\n" +
          "THE BAY CAME RIGHT UP TO HERE BEFORE THE SHORELINE WAS FILLED IN.\n" +
          "ALL OF THIS WAS THE ANCESTRAL LAND OF THE RAMAYTUSH OHLONE LONG BEFORE THAT.\n" +
          "AROUND THE TURN OF THE TWENTIETH CENTURY, ITALIAN IMMIGRANTS\n" +
          "SETTLED THESE BLOCKS AND MADE NORTH BEACH SAN FRANCISCO'S LITTLE ITALY —\n" +
          "ESPRESSO BARS, RED-SAUCE INSTITUTIONS, AND FAMILY BAKERIES.\n" +
          "THEN CAME THE TURN THAT MADE IT FAMOUS.\n" +
          "IN THE 1950s, NORTH BEACH BECAME THE EPICENTER OF THE BEAT GENERATION —\n" +
          "CITY LIGHTS BOOKSTORE, OPENED BY POET LAWRENCE FERLINGHETTI IN 1953,\n" +
          "PUBLISHED GINSBERG'S 'HOWL,' AND POETS LIKE KEROUAC AND GINSBERG\n" +
          "HELD COURT IN THE SALOONS JUST UP THE STREET.\n" +
          "THROUGH ALL OF IT, THE NEIGHBORHOOD STAYED A DENSE, EASY-TO-EXPLORE WARREN\n" +
          "OF ITALIAN RESTAURANTS, CAFÉS, AND HISTORIC BARS\n" +
          "BENEATH TELEGRAPH HILL AND COIT TOWER.\n" +
          "SPEND TIME ON THESE BLOCKS, AND YOU'RE STANDING IN TWO LIVING HISTORIES AT ONCE —\n" +
          "THE OLD-WORLD ITALIAN ONE, AND THE LITERARY ONE THAT REWROTE AMERICAN POETRY.",
        broll: ["Italian café facades; an old bakery window", "City Lights storefront / the Beat corner", "Coit Tower atop Telegraph Hill from the square"],
      },
      {
        label: "3 · HIDDEN FACTS",
        words: 160,
        script:
          "HERE'S WHAT MOST PEOPLE DON'T KNOW.\n" +
          "WEST COAST ESPRESSO WAS ARGUABLY FIRST POURED RIGHT HERE —\n" +
          "CAFFE TRIESTE OPENED IN 1956 AND CLAIMS TO HAVE BROUGHT ESPRESSO WEST.\n" +
          "THE FIRST WOOD-FIRED BRICK PIZZA OVEN ON THE WEST COAST FIRED UP HERE IN 1935,\n" +
          "AT ONE OF A STRING OF RED-SAUCE INSTITUTIONS STILL FEEDING THE NEIGHBORHOOD.\n" +
          "THAT TOWER ON THE HILL IS COIT TOWER, FROM 1933 —\n" +
          "ITS LOBBY IS LINED WITH DEPRESSION-ERA W-P-A FRESCOES OF CALIFORNIA LIFE,\n" +
          "FREE TO VIEW.\n" +
          "AND LISTEN FOR SQUAWKING OVERHEAD —\n" +
          "A FLOCK OF WILD CHERRY-HEADED PARROTS ROOSTS IN THE TREES ABOVE NORTH BEACH,\n" +
          "FAMOUS ENOUGH TO STAR IN THEIR OWN DOCUMENTARY.\n" +
          "THIS IS A NEIGHBORHOOD THAT WEARS ITS HISTORY OUT LOUD.",
        broll: ["Espresso pull tight shot; a café interior", "Coit Tower exterior + a glimpse of the murals", "Parrots in the treetops; the square's palm trees"],
      },
      {
        label: "4 · MICROCLIMATE",
        words: 95,
        script:
          "QUICK WORD ON WEATHER — BECAUSE IN SAN FRANCISCO, MICROCLIMATE IS EVERYTHING.\n" +
          "NORTH BEACH SITS IN ONE OF THE CITY'S SUNNIER POCKETS.\n" +
          "WHILE THE AVENUES OUT WEST DISAPPEAR INTO SUMMER FOG,\n" +
          "THIS CORNER — TUCKED ON THE BAY SIDE BELOW TELEGRAPH HILL — OFTEN CATCHES THE SUN.\n" +
          "JUST KNOW IT CAN GET BREEZY HERE, WITH THE WIND FUNNELING IN OFF THE WATER.\n" +
          "I KEEP A LIVE FOG MAP THAT SHOWS THIS NEIGHBORHOOD'S EXACT SUMMER-FOG HOURS\n" +
          "VERSUS THE FOGGY WEST SIDE — IT'S LINKED ON MY NORTH BEACH PAGE BELOW.",
        broll: ["Blue sky over Washington Square; you in shirtsleeves", "Contrast: fog pouring over the western ridge", "Edit: screen-cap of the Ur4cast fog map"],
      },
      {
        label: "5 · GETTING AROUND — CAR-FREE",
        words: 290,
        script:
          "NOW THE PART THAT REALLY MATTERS IF YOU'RE BUYING HERE:\n" +
          "HOW YOU GET AROUND. AND NORTH BEACH IS ONE OF THE EASIEST PLACES\n" +
          "IN THE WHOLE CITY TO LIVE WITHOUT A CAR.\n" +
          "THE POWELL-MASON CABLE CAR CLIMBS RIGHT THROUGH HERE,\n" +
          "AND THE 8, 30, 39, AND 12 BUSES THREAD THE NEIGHBORHOOD AND THE HILLS.\n" +
          "THE NEAREST BART AND MUNI METRO IS EMBARCADERO OR MONTGOMERY,\n" +
          "JUST A FEW BLOCKS SOUTH.\n" +
          "NOW LET'S LEAVE THE CITY — CAR-FREE.\n" +
          "AND HERE'S NORTH BEACH'S SECRET WEAPON: THE FERRY BUILDING IS ONLY\n" +
          "ABOUT NINE-TENTHS OF A MILE AWAY — A SHORT HOP, THE CLOSEST OF ANY NEIGHBORHOOD,\n" +
          "AND THAT'S YOUR GATEWAY TO THE WATER.\n" +
          "GOING TO THE EAST BAY? FROM EMBARCADERO, HOP BART —\n" +
          "DOWNTOWN OAKLAND IS ABOUT TWENTY MINUTES.\n" +
          "OR TAKE THE BAY BRIDGE BY CAR.\n" +
          "HEADING NORTH TO MARIN? THE LARKSPUR FERRY LEAVES RIGHT FROM THAT NEARBY\n" +
          "FERRY BUILDING AND CROSSES IN ABOUT THIRTY MINUTES ON THE WATER —\n" +
          "OR DRIVE THE GOLDEN GATE BRIDGE.\n" +
          "HEADING SOUTH TO THE PENINSULA? TAKE TRANSIT TO THE CALTRAIN DEPOT\n" +
          "AT 4TH AND KING, AND CALTRAIN RUNS DOWN TO PALO ALTO IN ABOUT FIFTY MINUTES —\n" +
          "OR DRIVE 280 OR 101.\n" +
          "BOTTOM LINE: WATER, RAIL, AND THREE BRIDGES — ALL WITHOUT OWNING A CAR,\n" +
          "AND THE FERRY PRACTICALLY RIGHT OUTSIDE YOUR DOOR.",
        broll: [
          "The Powell-Mason cable car cresting a hill; a 30 Stockton bus",
          "The Ferry Building / a departing ferry (it's close — show how close)",
          "A BART train; the Bay Bridge; the Golden Gate Bridge; a Caltrain at 4th & King",
          "Simple motion-graphic map: North Beach → Ferry Building / Oakland / Larkspur / Palo Alto with the times",
        ],
      },
      {
        label: "6 · THE GROUND UNDER YOU (HAZARDS)",
        words: 110,
        script:
          "TWO QUICK, HONEST NOTES ON THE GROUND ITSELF —\n" +
          "AND WITH NORTH BEACH, I WANT TO BE STRAIGHT WITH YOU.\n" +
          "THIS IS LOW, PARTLY-FILLED GROUND NEAR THE BAY,\n" +
          "SO IT DOES FALL WITHIN A STATE-DESIGNATED SEISMIC HAZARD ZONE\n" +
          "FOR LIQUEFACTION, AND ALSO WITHIN A TSUNAMI HAZARD AND EVACUATION ZONE.\n" +
          "NOW — THAT IS NOT A REASON TO PANIC; IT'S A REASON TO DO YOUR HOMEWORK.\n" +
          "EVERY CALIFORNIA BUYER REVIEWS THE SOILS, THE BUILDING'S RETROFITS,\n" +
          "AND THEIR INSURANCE WITH AN INSPECTOR BEFORE THEY WRITE AN OFFER.\n" +
          "I PUT THE SEISMIC AND TSUNAMI STATUS RIGHT ON EACH NEIGHBORHOOD'S DETAILS PAGE,\n" +
          "ALONGSIDE THE CITY'S OWN RESOURCES, SO YOU CAN CHECK ANY BLOCK WITH CLEAR EYES.",
        broll: ["You gesturing toward the bay / the low flat core", "Edit: the seismic + tsunami toggles on your fog map", "Edit: a city evacuation-zone map reference"],
      },
      {
        label: "7 · DINING, NIGHTLIFE & DAILY LIFE",
        words: 120,
        script:
          "LET'S TALK DAILY LIFE.\n" +
          "NORTH BEACH IS HOME TO ONE OF THE OLDEST ITALIAN CAFÉ AND RESTAURANT CULTURES\n" +
          "IN THE COUNTRY — ESPRESSO BARS, RED-SAUCE INSTITUTIONS,\n" +
          "AND LITERARY SALOONS WITH REAL HISTORY BEHIND THE BAR.\n" +
          "I'M NOT GOING TO NAME SPECIFIC PLACES ON CAMERA, BECAUSE THE LINEUP CHANGES —\n" +
          "AND I NEVER WANT TO SEND YOU SOMEWHERE THAT'S CLOSED.\n" +
          "INSTEAD, I KEEP A CURRENT, HAND-CHECKED LIST OF THE NEIGHBORHOOD'S BEST\n" +
          "RESTAURANTS AND BARS RIGHT ON MY NORTH BEACH DETAILS PAGE — ALWAYS UP TO DATE.\n" +
          "THE VIBE TO KNOW: THIS IS A RIGHT-OUTSIDE-YOUR-DOOR, LEAVE-THE-CAR-HOME KIND OF PLACE,\n" +
          "WHERE YOU CAN SPEND A WHOLE EVENING WITHOUT EVER MOVING THE CAR.",
        broll: ["Café tables on Columbus; a busy trattoria window at dusk", "A historic saloon's neon at night (general, not a single endorsement)", "People lingering over espresso on the sidewalk"],
      },
      {
        label: "8 · REAL ESTATE",
        words: 120,
        script:
          "ON HOUSING: NORTH BEACH IS CLASSIC OLD SAN FRANCISCO —\n" +
          "DENSE EDWARDIAN AND VICTORIAN FLATS, VINTAGE STAIR-ACCESS APARTMENTS,\n" +
          "AND CONDOS, WITH SOME OF THE CITY'S MOST CHARACTERFUL OLDER BUILDINGS\n" +
          "STACKED RIGHT UP THE SIDE OF TELEGRAPH HILL.\n" +
          "IT RUNS FROM A FIRST PIED-À-TERRE CONDO TO A VIEW FLAT UP THE HILL.\n" +
          "I'M NOT GOING TO QUOTE A MEDIAN PRICE ON CAMERA, BECAUSE THAT NUMBER MOVES.\n" +
          "INSTEAD, I KEEP A LIVE MARKET UPDATE FOR NORTH BEACH ON MY SITE —\n" +
          "CURRENT MEDIANS FOR HOMES AND FOR CONDOS, RIGHT UP TO TODAY.\n" +
          "THE LINK IS BELOW. THAT'S YOUR SMARTEST FIRST STEP BEFORE YOU EVEN TOUR.",
        broll: ["An Italianate flat, a walk-up building, a modern condo entry", "A 'For Sale' sign", "Edit: lower-third + screen-record of your live market page"],
      },
      {
        label: "9 · WHO BELONGS HERE + SIGNATURE OUTRO",
        words: 120,
        script:
          "SO — WHO BELONGS IN NORTH BEACH?\n" +
          "SOMEONE WHO WANTS OLD-WORLD CHARACTER, A CAFÉ ON EVERY CORNER,\n" +
          "AND THE WHOLE BAY AREA — INCLUDING THE FERRY ALMOST AT YOUR DOORSTEP —\n" +
          "WITHIN REACH WITHOUT EVER NEEDING A CAR.\n" +
          "BUT HERE'S THE THING I'VE LEARNED AFTER ALL THESE YEARS:\n" +
          "EVERY NEIGHBORHOOD IN THIS CITY HAS A STORY LIKE THIS ONE,\n" +
          "AND KNOWING THEM ALL IS THE WORK — THE MICROCLIMATES,\n" +
          "THE GROUND UNDERFOOT, THE THINGS THAT NEVER SHOW UP IN A SEARCH.\n" +
          "ANYTHING THAT CHANGES — PRICES, THE NEWEST RESTAURANT, WHAT'S FOR SALE —\n" +
          "STAYS CURRENT ON MY NORTH BEACH NEIGHBORHOOD PAGE, SO THIS GUIDE NEVER GOES STALE.\n" +
          "SO IF YOU'RE THINKING ABOUT CALLING NORTH BEACH HOME,\n" +
          "I'D LOVE TO SHOW YOU AROUND AND HELP CREATE YOUR NEXT LIFE ADVENTURE.",
        broll: ["Golden-hour, unhurried pass through Washington Square (you, relaxed, not pitching)", "A quiet look up toward Coit Tower on the hill", "Soft end card: your name + how to reach you"],
      },
    ],
    schedule: [
      { step: "Scout & lock script", detail: "Take the route, mark the 6–8 B-roll stops, finalize edits to this script.", time: "~45 min (day before)" },
      { step: "Golden-hour B-roll", detail: "Shoot the square, the church spires, Columbus Ave café life, the Beat corner, and housing variety in good light.", time: "30–45 min (early AM or ~1 hr before sunset)" },
      { step: "Talk-to-camera takes", detail: "Shoot each section as its own clip at the relevant spot; 2 takes each; teleprompter on your phone.", time: "60–90 min" },
      { step: "Pickups & cutaways", detail: "Signs, the cable car, and a screen-record of your live market page (capture at home).", time: "~15 min" },
      { step: "Edit & caption", detail: "Assemble, add lower-thirds (market URL), burned-in captions, light music bed; export.", time: "2–3 hrs" },
      { step: "Publish & link", detail: "Upload to YouTube, paste the market link in the description — then I add the 'Watch the tour' button to the North Beach page.", time: "~30 min" },
    ],
    batchTip: "Shoot adjacent hoods the same outing — e.g. North Beach + Russian Hill + Telegraph Hill in one morning loop.",
  },
  "Russian Hill": {
    runtime: "~10 min (8–10 target)",
    marketLink: "https://www.ur4cast.com/listings?nbhd=Russian%20Hill&layer=nbhd",
    detailsLink: "https://www.ur4cast.com/fog (open the Neighborhoods card → Russian Hill)",
    route: {
      // Route stays ENTIRELY within the Russian Hill boundary (verified against
      // the neighborhood polygon). Coords approximate — snap to the sidewalk grid for the final cut.
      spots: [
        { n: 1, name: "Hyde & Union — the cable-car spine", note: "Start — the Powell-Hyde line; Polk St strip a block downhill", coord: [-122.4192, 37.7990] },
        { n: 2, name: "Lombard St — the crookedest block", note: "The eight switchbacks between Hyde & Leavenworth (1922)", coord: [-122.4187, 37.8021] },
        { n: 3, name: "Ina Coolbrith Park", note: "Vallejo St terrace — bay, Alcatraz, and both bridges", coord: [-122.4165, 37.7990] },
        { n: 4, name: "Macondray Lane", note: "Hidden garden stairway — the model for 'Barbary Lane'", coord: [-122.4170, 37.7997] },
        { n: 5, name: "Hyde St cable-car line + Polk St", note: "The leafy hilltop meeting the lively lower commercial strip", coord: [-122.4200, 37.7980] },
      ],
    },
    sections: [
      {
        label: "COLD OPEN / SIGNATURE INTRO",
        words: 85,
        script:
          "IN SAN FRANCISCO, THE WEATHER CAN CHANGE IN THE SPACE OF A SINGLE BLOCK —\n" +
          "ONE STREET BURIED IN FOG, THE NEXT ONE SITTING IN THE SUN.\n" +
          "AFTER YEARS OF EXPLORING THESE HILLS, I'VE LEARNED THAT THE BEST HOMES\n" +
          "AREN'T FOUND IN A LISTING — THEY'RE IN THE DETAILS YOU ONLY KNOW\n" +
          "ONCE YOU'VE STOOD ON THE CORNER AT DIFFERENT TIMES OF DAY.\n" +
          "RIGHT NOW I'M ON HYDE STREET, AND THE SUN IS OUT —\n" +
          "WHICH IS ALREADY THE FIRST THING WORTH KNOWING ABOUT THIS PLACE.\n" +
          "SO — ARE YOU READY TO SEE RUSSIAN HILL? LET'S GO.",
        broll: ["Two-shot idea: a foggy ridge in one frame, sunny Hyde St in the next", "You moving up Hyde St with a cable car climbing into frame", "The crest looking out toward the bay to place us"],
      },
      {
        label: "1 · LOCATION & LAY OF THE LAND",
        words: 200,
        script:
          "FIRST — WHERE ARE WE? RUSSIAN HILL IS ONE OF SAN FRANCISCO'S\n" +
          "ICONIC HILLTOPS, NORTH OF NOB HILL, WEST OF NORTH BEACH,\n" +
          "AND JUST UPHILL FROM THE WATER AT FISHERMAN'S WHARF.\n" +
          "THE SPINE IS HYDE STREET, WHERE THE CABLE CAR CLIMBS OVER THE CREST.\n" +
          "AND LET ME BE HONEST WITH YOU: THIS IS A STEEP HILL.\n" +
          "THE GROUND RUNS FROM ABOUT 30 FEET DOWN ALONG THE LOWER CONTOURS\n" +
          "UP TO ROUGHLY 360 FEET AT THE SUMMIT.\n" +
          "THE POLK AND HYDE COMMERCIAL STRIPS ALONG THE LOWER SLOPES ARE MANAGEABLE,\n" +
          "BUT MOST OF THE CROSS STREETS ARE REAL GRADES — SOME ARE LITERAL\n" +
          "STAIRWAY STREETS — THAT FAR EXCEED WHAT THE A-D-A CONSIDERS\n" +
          "AN ACCESSIBLE SLOPE, ABOUT FIVE PERCENT.\n" +
          "SO IF STEP-FREE, LOW-GRADE ACCESS MATTERS TO YOU,\n" +
          "A STEP-FREE ROUTE HERE TAKES SOME PLANNING.\n" +
          "AND THE HOMES THEMSELVES MATTER TOO — MANY SIT UP A FLIGHT OF STAIRS\n" +
          "FROM THE SIDEWALK, SO STEP-FREE ENTRY IS WORTH CHECKING HOME BY HOME.\n" +
          "BUT HERE'S THE UPSIDE: THOSE CLIMBS BUY YOU SOME OF THE BEST VIEWS\n" +
          "IN THE ENTIRE CITY — BAY, BRIDGES, AND ALL.",
        broll: ["Slow pan up Hyde St with the cable-car tracks", "Wide establishing shot from the crest showing the bay and bridges", "A genuinely steep cross-street / a stairway street climbing (show the grade)"],
      },
      {
        label: "2 · HISTORY",
        words: 195,
        script:
          "NOW THE STORY — AND IT STARTS WITH THE NAME.\n" +
          "WHEN EARLY SETTLERS REACHED THE SUMMIT IN THE 1850s,\n" +
          "THEY FOUND A SMALL RUSSIAN ORTHODOX CEMETERY —\n" +
          "GRAVES OF SAILORS AND FUR TRADERS FROM THE EARLY PACIFIC TRADE.\n" +
          "THE BODIES WERE EVENTUALLY MOVED, BUT THE NAME 'RUSSIAN HILL' STUCK.\n" +
          "ALL OF THIS WAS THE ANCESTRAL LAND OF THE RAMAYTUSH OHLONE LONG BEFORE THAT.\n" +
          "FOR DECADES THE GRADE WAS SIMPLY TOO STEEP —\n" +
          "THE HILL STAYED SEMI-RURAL WHILE THE CITY GREW UP AROUND IT.\n" +
          "THEN THE CABLE CARS ARRIVED, AND EVERYTHING CHANGED.\n" +
          "SUDDENLY YOU COULD LIVE AT THE TOP, AND IN THE EARLY 1900s\n" +
          "CHEAP RENTS AND ENORMOUS VIEWS DREW A COLONY OF WRITERS AND ARTISTS —\n" +
          "INCLUDING INA COOLBRITH, CALIFORNIA'S FIRST POET LAUREATE,\n" +
          "WHO LIVED RIGHT HERE ON THE HILL.\n" +
          "TODAY IT'S A QUIET, AFFLUENT SUMMIT — FAMOUS FOR LOMBARD STREET'S\n" +
          "SWITCHBACKS AND ITS HIDDEN GARDEN STAIRWAYS.\n" +
          "SPEND TIME ON THESE BLOCKS, AND YOU'RE STANDING IN A LITERARY,\n" +
          "BOHEMIAN PIECE OF OLD SAN FRANCISCO.",
        broll: ["The crest / summit where the cemetery once sat", "Period-feel building facades along Vallejo & Green", "Ina Coolbrith Park sign; the writer-colony blocks"],
      },
      {
        label: "3 · HIDDEN FACTS",
        words: 160,
        script:
          "HERE'S WHAT MOST PEOPLE DON'T KNOW.\n" +
          "THAT FAMOUS CROOKED BLOCK OF LOMBARD STREET — THE EIGHT TIGHT SWITCHBACKS —\n" +
          "WAS BUILT IN 1922 TO TAME A SLOPE THAT WAS SIMPLY TOO STEEP FOR CARS.\n" +
          "IT'S NOW ONE OF THE MOST-VISITED SIGHTS IN THE WHOLE CITY.\n" +
          "BUT THE REAL SECRET IS THE STAIRWAYS — CAR-FREE GARDEN STAIRS\n" +
          "LACE THE HILL: VALLEJO, FILBERT, AND MACONDRAY LANE,\n" +
          "WHICH IS SAID TO BE THE MODEL FOR ARMISTEAD MAUPIN'S FICTIONAL BARBARY LANE.\n" +
          "THE WILLIS POLK-DESIGNED VALLEJO STREET STAIRWAY GARDENS, FROM 1914,\n" +
          "FRAME ONE OF THE FINEST VANTAGE POINTS IN SAN FRANCISCO —\n" +
          "LOOKING OUT OVER THE BAY, ALCATRAZ, AND BOTH BRIDGES.\n" +
          "THIS IS A HILL THAT HIDES ITS BEST PARTS\n" +
          "AT THE TOP OF A FLIGHT OF STEPS.",
        broll: ["Lombard St switchbacks from above and below", "Macondray Lane stairway under the greenery", "The Vallejo St stairway-garden view of the bay and bridges"],
      },
      {
        label: "4 · MICROCLIMATE",
        words: 90,
        script:
          "QUICK WORD ON WEATHER — BECAUSE IN SAN FRANCISCO, MICROCLIMATE IS EVERYTHING.\n" +
          "RUSSIAN HILL IS A BRIGHT, SUNNY HILLTOP.\n" +
          "WHILE THE AVENUES OUT WEST DISAPPEAR INTO SUMMER FOG,\n" +
          "THIS CREST CATCHES THE LIGHT AND THE BAY VIEWS\n" +
          "AND STAYS WARMER AND BRIGHTER THAN THE FOGGY WEST SIDE.\n" +
          "PEOPLE PAY FOR LIGHT.\n" +
          "I KEEP A LIVE FOG MAP THAT SHOWS THIS NEIGHBORHOOD'S EXACT SUMMER-FOG HOURS\n" +
          "VERSUS THE FOGGY WEST SIDE — IT'S LINKED ON MY RUSSIAN HILL PAGE BELOW.",
        broll: ["Blue sky over the crest; you in shirtsleeves", "Contrast: fog sitting out over the west side / the avenues", "Edit: screen-cap of the Ur4cast fog map"],
      },
      {
        label: "5 · GETTING AROUND — CAR-FREE",
        words: 290,
        script:
          "NOW THE PART THAT REALLY MATTERS IF YOU'RE BUYING HERE:\n" +
          "HOW YOU GET AROUND. AND RUSSIAN HILL HAS REAL TRANSIT FOR A HILLTOP.\n" +
          "THE POWELL-HYDE CABLE CAR CLIMBS RIGHT OVER THE HILL PAST LOMBARD STREET,\n" +
          "AND THE POWELL-MASON LINE RUNS NEARBY.\n" +
          "BUSES: THE 19-POLK SERVES THE LOWER STRIP,\n" +
          "AND THE 41 AND 45 THREAD ACROSS THE SLOPES TOWARD DOWNTOWN.\n" +
          "THE NEAREST BART AND MUNI METRO ARE DOWNTOWN — CHECK THE TRANSIT NOTES\n" +
          "ON THE DETAILS PAGE FOR THE EXACT LINES.\n" +
          "NOW LET'S LEAVE THE CITY — CAR-FREE.\n" +
          "THE FERRY BUILDING IS ABOUT A MILE AND A HALF AWAY —\n" +
          "A SHORT RIDE, OR THE CABLE CAR PLUS A QUICK MUNI HOP —\n" +
          "AND THAT'S YOUR GATEWAY TO THE WATER.\n" +
          "GOING TO THE EAST BAY? TAKE BART FROM DOWNTOWN OR EMBARCADERO,\n" +
          "AND OAKLAND IS ABOUT TWENTY-FIVE TO THIRTY MINUTES —\n" +
          "OR BY CAR, THE BAY BRIDGE GETS YOU THERE.\n" +
          "HEADING NORTH TO MARIN? DRIVE THE GOLDEN GATE BRIDGE TO LARKSPUR\n" +
          "IN ABOUT TWENTY TO TWENTY-FIVE MINUTES,\n" +
          "OR TAKE THE LARKSPUR FERRY FROM THE FERRY BUILDING\n" +
          "AND CROSS IN ABOUT THIRTY MINUTES ON THE WATER.\n" +
          "HEADING SOUTH TO THE PENINSULA? TAKE CALTRAIN FROM 4TH AND KING\n" +
          "DOWN TO PALO ALTO IN ABOUT FIFTY MINUTES —\n" +
          "OR DRIVE 280 OR 101.\n" +
          "BOTTOM LINE: CABLE CARS, WATER, RAIL, AND THREE BRIDGES —\n" +
          "ALL WITHIN REACH WITHOUT OWNING A CAR.",
        broll: [
          "A Powell-Hyde cable car cresting the hill; the 19-Polk on the strip",
          "The Ferry Building / a departing ferry",
          "A BART train; the Bay Bridge; the Golden Gate Bridge; a Caltrain at 4th & King",
          "Simple motion-graphic map: Russian Hill → Oakland / Larkspur / Palo Alto with the times",
        ],
      },
      {
        label: "6 · THE GROUND UNDER YOU (HAZARDS)",
        words: 110,
        script:
          "TWO QUICK, HONEST NOTES ON THE GROUND ITSELF.\n" +
          "GOOD NEWS FIRST: RUSSIAN HILL SITS HIGH ABOVE THE BAY,\n" +
          "SO IT IS NOT IN A TSUNAMI HAZARD ZONE — CROSS THAT WORRY OFF THE LIST.\n" +
          "LIKE MUCH OF HILLY SAN FRANCISCO, THIS STEEP GROUND\n" +
          "DOES FALL WITHIN A STATE-DESIGNATED SEISMIC HAZARD ZONE —\n" +
          "THAT'S STANDARD FOR THE CITY'S SLOPES, AND IT'S SOMETHING\n" +
          "EVERY CALIFORNIA BUYER REVIEWS WITH THEIR INSPECTOR AND INSURER.\n" +
          "I PUT THE SEISMIC AND TSUNAMI STATUS RIGHT ON EACH NEIGHBORHOOD'S\n" +
          "DETAILS PAGE, SO YOU CAN CHECK ANY SPECIFIC BLOCK BEFORE YOU WRITE AN OFFER.",
        broll: ["You gesturing out over the bay from the crest", "Edit: the seismic + tsunami toggles on your fog map"],
      },
      {
        label: "7 · DINING, NIGHTLIFE & DAILY LIFE",
        words: 120,
        script:
          "LET'S TALK DAILY LIFE.\n" +
          "DOWN ALONG POLK STREET YOU'VE GOT ONE OF THE CITY'S BEST LOW-KEY\n" +
          "DINING STRIPS — COFFEE, NEIGHBORHOOD RESTAURANTS, AND WINE BARS,\n" +
          "ALL JUST DOWNHILL FROM THE QUIET, LEAFY BLOCKS UP TOP.\n" +
          "I'M NOT GOING TO NAME SPECIFIC PLACES ON CAMERA, BECAUSE THE LINEUP CHANGES —\n" +
          "AND I NEVER WANT TO SEND YOU SOMEWHERE THAT'S CLOSED.\n" +
          "INSTEAD, I KEEP A CURRENT, HAND-CHECKED LIST OF THE NEIGHBORHOOD'S BEST\n" +
          "RESTAURANTS AND BARS RIGHT ON MY RUSSIAN HILL DETAILS PAGE — ALWAYS UP TO DATE.\n" +
          "THE VIBE TO KNOW: LIVELY DOWN ON POLK, PEACEFUL UP ON THE HILL —\n" +
          "AND EASY TO GET AROUND FOR THE EVERYDAY ERRANDS.",
        broll: ["Café tables along Polk St; a busy restaurant window at dusk", "The quiet, tree-lined upper blocks at golden hour", "A general streetlife shot (not a single endorsement)"],
      },
      {
        label: "8 · REAL ESTATE",
        words: 120,
        script:
          "ON HOUSING: RUSSIAN HILL IS CLASSIC SAN FRANCISCO —\n" +
          "ELEGANT EDWARDIAN AND ART-DECO FLATS, VINTAGE CO-OPS AND CONDOS\n" +
          "WITH BAY VIEWS, AND SINGLE-FAMILY HOMES TUCKED ALONG THE STAIRWAY STREETS.\n" +
          "IT RUNS FROM A FIRST VIEW CONDO TO A RESTORED HILLTOP SHOWPIECE.\n" +
          "I'M NOT GOING TO QUOTE A MEDIAN PRICE ON CAMERA, BECAUSE THAT NUMBER MOVES.\n" +
          "INSTEAD, I KEEP A LIVE MARKET UPDATE FOR RUSSIAN HILL ON MY SITE —\n" +
          "CURRENT MEDIANS FOR SINGLE-FAMILY HOMES AND FOR CONDOS, RIGHT UP TO TODAY.\n" +
          "THE LINK IS BELOW. THAT'S YOUR SMARTEST FIRST STEP BEFORE YOU EVEN TOUR.",
        broll: ["An Edwardian flats building, a view co-op, a modern condo entry", "A 'For Sale' sign", "Edit: lower-third + screen-record of your live market page"],
      },
      {
        label: "9 · WHO BELONGS HERE + SIGNATURE OUTRO",
        words: 120,
        script:
          "SO — WHO BELONGS IN RUSSIAN HILL?\n" +
          "SOMEONE WHO WANTS LIGHT, BIG VIEWS, AND A QUIET, LEAFY PERCH\n" +
          "ABOVE THE CITY — WITH POLK STREET AND THE CABLE CAR JUST DOWNHILL.\n" +
          "BUT HERE'S THE THING I'VE LEARNED AFTER ALL THESE YEARS:\n" +
          "EVERY NEIGHBORHOOD IN THIS CITY HAS A STORY LIKE THIS ONE,\n" +
          "AND KNOWING THEM ALL IS THE WORK — THE MICROCLIMATES,\n" +
          "THE STREETS THAT HOLD THEIR VALUE, THE THINGS THAT NEVER SHOW UP IN A SEARCH.\n" +
          "ANYTHING THAT CHANGES — PRICES, THE NEWEST RESTAURANT, WHAT'S FOR SALE —\n" +
          "STAYS CURRENT ON MY RUSSIAN HILL NEIGHBORHOOD PAGE, SO THIS GUIDE NEVER GOES STALE.\n" +
          "SO IF YOU'RE THINKING ABOUT CALLING RUSSIAN HILL HOME,\n" +
          "I'D LOVE TO SHOW YOU AROUND AND HELP CREATE YOUR NEXT LIFE ADVENTURE.",
        broll: ["Golden-hour, unhurried pass along a leafy crest block (you, relaxed, not pitching)", "A quiet look out over the bay and bridges from the stairway gardens", "Soft end card: your name + how to reach you"],
      },
    ],
    schedule: [
      { step: "Scout & lock script", detail: "Take the route, mark the 6–8 B-roll stops, finalize edits to this script.", time: "~45 min (day before)" },
      { step: "Golden-hour B-roll", detail: "Shoot the Lombard switchbacks, stairway lanes, the bay-and-bridge views, Polk St life, and housing variety in good light.", time: "30–45 min (early AM or ~1 hr before sunset)" },
      { step: "Talk-to-camera takes", detail: "Shoot each section as its own clip at the relevant spot; 2 takes each; teleprompter on your phone.", time: "60–90 min" },
      { step: "Pickups & cutaways", detail: "Signs, a cable car cresting the hill, and a screen-record of your live market page (capture at home).", time: "~15 min" },
      { step: "Edit & caption", detail: "Assemble, add lower-thirds (market URL), burned-in captions, light music bed; export.", time: "2–3 hrs" },
      { step: "Publish & link", detail: "Upload to YouTube, paste the market link in the description — then I add the 'Watch the tour' button to the Russian Hill page.", time: "~30 min" },
    ],
    batchTip: "Shoot adjacent hoods the same outing — e.g. Russian Hill + Nob Hill + North Beach in one morning loop.",
  },
  "Nob Hill": {
    aka: "“Snob Hill”",
    runtime: "~10 min (8–10 target)",
    marketLink: "https://www.ur4cast.com/listings?nbhd=Nob%20Hill&layer=nbhd",
    detailsLink: "https://www.ur4cast.com/fog (open the Neighborhoods card → Nob Hill)",
    route: {
      // Route stays ENTIRELY within the Nob Hill boundary (verified against the
      // neighborhood polygon). Coords approximate — snap to the sidewalk grid for the final cut.
      spots: [
        { n: 1, name: "California & Powell", note: "Start — the cable-car crossing, with a car climbing past in the sun", coord: [-122.4089, 37.7917] },
        { n: 2, name: "Fairmont & Mark Hopkins corner (California & Mason)", note: "The historic hotels at the crest — Top of the Mark above you", coord: [-122.4103, 37.7921] },
        { n: 3, name: "Grace Cathedral & Huntington Park", note: "Gilded doors, the labyrinth, and the city's grandest little park", coord: [-122.4128, 37.7920] },
        { n: 4, name: "California St cable-car line", note: "Ride the summit line west — the grade the Big Four couldn't beat until 1873", coord: [-122.4145, 37.7915] },
        { n: 5, name: "Sacramento & Jones — grand apartment-house block", note: "Classic Nob Hill: tall brick-and-stone apartment houses, many with elevators", coord: [-122.4155, 37.7928] },
      ],
    },
    sections: [
      {
        label: "COLD OPEN / SIGNATURE INTRO",
        words: 90,
        script:
          "IN SAN FRANCISCO, THE WEATHER CAN CHANGE IN THE SPACE OF A SINGLE BLOCK —\n" +
          "ONE STREET BURIED IN FOG, THE NEXT ONE SITTING IN THE SUN.\n" +
          "AFTER YEARS OF EXPLORING THESE HILLS, I'VE LEARNED THAT THE BEST HOMES\n" +
          "AREN'T FOUND IN A LISTING — THEY'RE IN THE DETAILS YOU ONLY KNOW\n" +
          "ONCE YOU'VE STOOD ON THE CORNER AT DIFFERENT TIMES OF DAY.\n" +
          "RIGHT NOW I'M AT CALIFORNIA AND POWELL, WITH A CABLE CAR CLIMBING PAST\n" +
          "AND THE SUN OUT — WHICH IS ALREADY THE FIRST THING WORTH KNOWING ABOUT THIS PLACE.\n" +
          "SO — ARE YOU READY TO SEE NOB HILL? LET'S GO.",
        broll: ["Two-shot idea: a foggy ridge in one frame, sunny California St in the next", "A cable car climbing the grade past you into frame", "Grace Cathedral / the hotel facades to place us at the crest"],
      },
      {
        label: "1 · LOCATION & LAY OF THE LAND",
        words: 200,
        script:
          "FIRST — WHERE ARE WE? NOB HILL IS ONE OF SAN FRANCISCO'S GRAND HILLTOPS,\n" +
          "RISING RIGHT ABOVE DOWNTOWN, WITH UNION SQUARE AND THE FINANCIAL DISTRICT\n" +
          "JUST DOWN THE EAST SLOPE, CHINATOWN OFF THE NORTHEAST CORNER,\n" +
          "AND POLK STREET RUNNING ALONG THE WESTERN EDGE.\n" +
          "THE LAND HERE RUNS FROM ABOUT 130 UP TO 370 FEET —\n" +
          "AND THAT NUMBER TELLS THE WHOLE STORY.\n" +
          "THE CREST — AROUND THE HOTELS AND HUNTINGTON PARK — IS FAIRLY EVEN\n" +
          "AND PLEASANT TO GET AROUND.\n" +
          "BUT THE STREETS THAT DROP OFF THE HILL, ESPECIALLY TO THE NORTH AND EAST,\n" +
          "ARE REAL GRADES — WELL PAST WHAT THE A-D-A CONSIDERS\n" +
          "AN ACCESSIBLE SLOPE, ABOUT FIVE PERCENT.\n" +
          "SO STEP-FREE, LOW-GRADE ROUTES TAKE A LITTLE PLANNING UP HERE:\n" +
          "STAY ALONG THE TOP, AND IT'S MANAGEABLE; HEAD DOWNHILL, AND IT'S A CLIMB BACK.\n" +
          "THE GOOD NEWS ON THE HOMES — MANY ARE GRAND APARTMENT HOUSES,\n" +
          "AND PLENTY OF THEM HAVE ELEVATORS, WHICH IS A REAL PLUS.\n" +
          "BUT THE ENTRIES STILL VARY — A LOBBY UP A FEW STEPS, A SLOPED APPROACH —\n" +
          "SO IF STEP-FREE ACCESS IS A MUST, IT'S WORTH CONFIRMING BUILDING BY BUILDING.",
        broll: ["Slow pan up California St; street signs at California & Powell", "Wide establishing shot from the crest looking down toward downtown", "A genuinely steep cross-street dropping off the hill (show the grade)"],
      },
      {
        label: "2 · HISTORY",
        words: 200,
        script:
          "NOW THE STORY. NOB HILL BECAME SAN FRANCISCO'S MOST PRESTIGIOUS ADDRESS\n" +
          "IN THE 1870s, WHEN THE RAILROAD AND SILVER TYCOONS\n" +
          "KNOWN AS THE 'BIG FOUR' — STANFORD, CROCKER, HOPKINS, AND HUNTINGTON —\n" +
          "BUILT THEIR MANSIONS RIGHT ON TOP.\n" +
          "THE NAME ITSELF COMES FROM 'NABOB' — A WORD FOR THE FABULOUSLY RICH —\n" +
          "WHICH IS ALSO WHY LOCALS STILL CALL IT 'SNOB HILL.'\n" +
          "NONE OF IT WAS POSSIBLE UNTIL ANDREW HALLIDIE'S CABLE CAR\n" +
          "CONQUERED THIS BRUTAL GRADE IN 1873 — ONLY THEN COULD THE WEALTHY\n" +
          "BUILD AT THE SUMMIT, AND THREE CABLE-CAR LINES STILL CROSS THE HILL TODAY.\n" +
          "THEN CAME 1906. THE GREAT FIRE LEVELED THE WOODEN PALACES —\n" +
          "ONLY THE GRANITE FLOOD MANSION SURVIVED, NOW THE PACIFIC-UNION CLUB.\n" +
          "AND OUT OF THAT RUBBLE ROSE WHAT YOU SEE NOW:\n" +
          "THE GRAND HOTELS AND, BY 1964, GRACE CATHEDRAL.\n" +
          "SO WHEN YOU SPEND TIME ON THESE BLOCKS, YOU'RE STANDING\n" +
          "ON THE HILL THAT BUILT — AND REBUILT — SAN FRANCISCO'S IDEA OF LUXURY.",
        broll: ["The granite Flood Mansion / Pacific-Union Club facade", "Grace Cathedral's exterior", "A cable car cresting the hill on California St"],
      },
      {
        label: "3 · HIDDEN FACTS",
        words: 160,
        script:
          "HERE'S WHAT MOST PEOPLE DON'T KNOW.\n" +
          "THOSE BRONZE DOORS ON GRACE CATHEDRAL? THEY'RE GILDED CASTS\n" +
          "OF GHIBERTI'S 'GATES OF PARADISE' — TAKEN FROM THE FLORENCE BAPTISTERY ORIGINALS —\n" +
          "AND INSIDE AND OUT THERE ARE TWO LABYRINTHS OPEN FOR QUIET, MEDITATIVE REFLECTION.\n" +
          "UP AT THE TOP OF THE MARK SKY LOUNGE, OPENED IN 1939,\n" +
          "WORLD WAR TWO SERVICEMEN TOASTED FROM A NORTHWEST 'SQUADRON CORNER'\n" +
          "BEFORE SHIPPING OUT ACROSS THE PACIFIC — A FAREWELL RITUAL THAT BECAME LEGEND.\n" +
          "THE HILL'S NAME, AGAIN, COMES FROM 'NABOB' — OLD SLANG FOR THE SUPER-RICH.\n" +
          "AND THE WHOLE PLACE ONLY EXISTS BECAUSE OF A CABLE CAR:\n" +
          "BEFORE 1873, THIS GRADE WAS SIMPLY TOO STEEP FOR HORSES TO CLIMB.\n" +
          "THIS IS A NEIGHBORHOOD THAT WEARS ITS GRANDEUR QUIETLY — BUT IT'S EVERYWHERE.",
        broll: ["Grace Cathedral's gilded doors, tight", "Top of the Mark windows / the view out", "A cable car gripping the cable on the climb"],
      },
      {
        label: "4 · MICROCLIMATE",
        words: 95,
        script:
          "QUICK WORD ON WEATHER — BECAUSE IN SAN FRANCISCO, MICROCLIMATE IS EVERYTHING.\n" +
          "NOB HILL SITS HIGH AND BRIGHT, ONE OF THE CITY'S SUNNIER HILLTOPS.\n" +
          "WHILE THE AVENUES OUT WEST DISAPPEAR INTO SUMMER FOG,\n" +
          "THIS SUMMIT — UP ABOVE IT ALL — TENDS TO CATCH THE LIGHT\n" +
          "AND STAY BRIGHTER, EVEN AS THE FOG STREAMS PAST BELOW.\n" +
          "PEOPLE PAY FOR LIGHT — AND FOR THE VIEWS THAT COME WITH THE HEIGHT.\n" +
          "I KEEP A LIVE FOG MAP THAT SHOWS THIS NEIGHBORHOOD'S EXACT SUMMER-FOG HOURS\n" +
          "VERSUS THE FOGGY WEST SIDE — IT'S LINKED ON MY NOB HILL PAGE BELOW.",
        broll: ["Blue sky over the crest; you in shirtsleeves", "Contrast: fog streaming past below the hilltop", "Edit: screen-cap of the Ur4cast fog map"],
      },
      {
        label: "5 · GETTING AROUND — CAR-FREE",
        words: 290,
        script:
          "NOW THE PART THAT REALLY MATTERS IF YOU'RE BUYING HERE:\n" +
          "HOW YOU GET AROUND. AND NOB HILL IS ONE OF THE EASIEST PLACES\n" +
          "IN THE WHOLE CITY TO LIVE WITHOUT A CAR.\n" +
          "RIGHT HERE ON THE SUMMIT ARE THE CABLE CARS —\n" +
          "THE CALIFORNIA STREET LINE OVER THE TOP, AND THE POWELL LINES ON EITHER FLANK.\n" +
          "THE 1-CALIFORNIA AND THE 27 BUSES THREAD THROUGH TOO,\n" +
          "AND THE NEAREST BART AND MUNI METRO IS DOWNTOWN, JUST A FEW BLOCKS EAST.\n" +
          "NOW LET'S LEAVE THE CITY — CAR-FREE.\n" +
          "THE FERRY BUILDING IS ABOUT A MILE AWAY,\n" +
          "A SHORT RIDE DOWN TO EMBARCADERO,\n" +
          "AND THAT'S YOUR GATEWAY TO THE WATER.\n" +
          "GOING TO THE EAST BAY? TAKE BART FROM DOWNTOWN —\n" +
          "OAKLAND IS ABOUT TWENTY TO TWENTY-FIVE MINUTES,\n" +
          "OR THE BAY BRIDGE PUTS YOU THERE BY CAR IN ABOUT THE SAME.\n" +
          "HEADING NORTH TO MARIN? DRIVE THE GOLDEN GATE BRIDGE TO LARKSPUR\n" +
          "IN ABOUT TWENTY TO TWENTY-FIVE MINUTES —\n" +
          "OR TAKE THE LARKSPUR FERRY FROM THE FERRY BUILDING\n" +
          "AND CROSS IN ABOUT THIRTY MINUTES ON THE WATER.\n" +
          "HEADING SOUTH TO THE PENINSULA? TAKE THE TRAIN FROM 4TH AND KING —\n" +
          "CALTRAIN RUNS DOWN TO PALO ALTO IN ABOUT FIFTY MINUTES —\n" +
          "OR DRIVE 280 OR 101.\n" +
          "BOTTOM LINE: CABLE CARS AT THE DOOR, WATER, RAIL, AND THREE BRIDGES —\n" +
          "ALL WITHOUT OWNING A CAR.",
        broll: [
          "A California St cable car cresting the hill; the 1-California bus",
          "Embarcadero / the Ferry Building / a departing ferry",
          "A BART train; the Bay Bridge; the Golden Gate Bridge; a Caltrain at 4th & King",
          "Simple motion-graphic map: Nob Hill → Oakland / Larkspur / Palo Alto with the times",
        ],
      },
      {
        label: "6 · THE GROUND UNDER YOU (HAZARDS)",
        words: 110,
        script:
          "TWO QUICK, HONEST NOTES ON THE GROUND ITSELF.\n" +
          "GOOD NEWS FIRST: NOB HILL SITS HIGH ABOVE THE BAY,\n" +
          "SO IT IS NOT IN A TSUNAMI HAZARD ZONE — CROSS THAT WORRY OFF THE LIST.\n" +
          "LIKE MUCH OF HILLY SAN FRANCISCO, THE HILL GROUND HERE\n" +
          "DOES FALL WITHIN A STATE-DESIGNATED SEISMIC HAZARD ZONE —\n" +
          "THAT'S STANDARD FOR THE CITY'S SLOPES, AND IT'S SOMETHING\n" +
          "EVERY CALIFORNIA BUYER REVIEWS WITH THEIR INSPECTOR AND INSURER.\n" +
          "I PUT THE SEISMIC AND TSUNAMI STATUS RIGHT ON EACH NEIGHBORHOOD'S\n" +
          "DETAILS PAGE, SO YOU CAN CHECK ANY SPECIFIC BLOCK BEFORE YOU WRITE AN OFFER.",
        broll: ["You gesturing out over the hill toward the bay below", "Edit: the seismic + tsunami toggles on your fog map"],
      },
      {
        label: "7 · DINING, NIGHTLIFE & DAILY LIFE",
        words: 120,
        script:
          "LET'S TALK DAILY LIFE.\n" +
          "NOB HILL LEANS ELEGANT — FINE DINING IN THE HISTORIC HOTELS,\n" +
          "CLASSIC SKY LOUNGES WITH SOME OF THE BEST VIEWS IN THE CITY,\n" +
          "AND, JUST DOWN THE WESTERN EDGE ON POLK, A LIVELIER, MORE EVERYDAY STRIP\n" +
          "OF CAFÉS, MARKETS, AND NEIGHBORHOOD SPOTS.\n" +
          "I'M NOT GOING TO NAME SPECIFIC PLACES ON CAMERA, BECAUSE THE LINEUP CHANGES —\n" +
          "AND I NEVER WANT TO SEND YOU SOMEWHERE THAT'S CLOSED.\n" +
          "INSTEAD, I KEEP A CURRENT, HAND-CHECKED LIST OF THE NEIGHBORHOOD'S BEST\n" +
          "RESTAURANTS AND BARS RIGHT ON MY NOB HILL DETAILS PAGE — ALWAYS UP TO DATE.\n" +
          "THE VIBE TO KNOW: REFINED UP TOP, EASYGOING DOWN THE EDGES — AND LEAVE THE CAR HOME.",
        broll: ["A grand hotel dining room / lobby; a sky-lounge view at dusk", "The Polk St strip — cafés, market windows, sidewalk life", "A classic bar interior (general, not a single endorsement)"],
      },
      {
        label: "8 · REAL ESTATE",
        words: 120,
        script:
          "ON HOUSING: NOB HILL IS GRAND, VERTICAL SAN FRANCISCO —\n" +
          "STATELY 1920s APARTMENT HOUSES, MANY WITH DOORMEN AND ELEVATORS,\n" +
          "ELEGANT CO-OPS AND CONDOS, AND THE OCCASIONAL FULL-FLOOR VIEW UNIT.\n" +
          "IT RUNS FROM A FIRST PIED-À-TERRE TO A LANDMARK TOP-FLOOR SHOWPIECE.\n" +
          "I'M NOT GOING TO QUOTE A MEDIAN PRICE ON CAMERA, BECAUSE THAT NUMBER MOVES.\n" +
          "INSTEAD, I KEEP A LIVE MARKET UPDATE FOR NOB HILL ON MY SITE —\n" +
          "CURRENT MEDIANS FOR CONDOS AND FOR THE LARGER UNITS, RIGHT UP TO TODAY.\n" +
          "THE LINK IS BELOW. THAT'S YOUR SMARTEST FIRST STEP BEFORE YOU EVEN TOUR.",
        broll: ["A grand brick-and-stone apartment house; a lobby with an elevator", "A 'For Sale' sign on a stately building", "Edit: lower-third + screen-record of your live market page"],
      },
      {
        label: "9 · WHO BELONGS HERE + SIGNATURE OUTRO",
        words: 125,
        script:
          "SO — WHO BELONGS IN NOB HILL?\n" +
          "SOMEONE WHO WANTS HEIGHT, LIGHT, AND ELEGANCE —\n" +
          "VIEWS OUT THE WINDOW, A CABLE CAR AT THE DOOR,\n" +
          "AND THE WHOLE BAY AREA A TRAIN OR A FERRY AWAY, WITHOUT EVER NEEDING A CAR.\n" +
          "BUT HERE'S THE THING I'VE LEARNED AFTER ALL THESE YEARS:\n" +
          "EVERY NEIGHBORHOOD IN THIS CITY HAS A STORY LIKE THIS ONE,\n" +
          "AND KNOWING THEM ALL IS THE WORK — THE MICROCLIMATES,\n" +
          "THE STREETS THAT HOLD THEIR VALUE, THE THINGS THAT NEVER SHOW UP IN A SEARCH.\n" +
          "ANYTHING THAT CHANGES — PRICES, THE NEWEST RESTAURANT, WHAT'S FOR SALE —\n" +
          "STAYS CURRENT ON MY NOB HILL NEIGHBORHOOD PAGE, SO THIS GUIDE NEVER GOES STALE.\n" +
          "SO IF YOU'RE THINKING ABOUT CALLING NOB HILL HOME,\n" +
          "I'D LOVE TO SHOW YOU AROUND AND HELP CREATE YOUR NEXT LIFE ADVENTURE.",
        broll: ["Golden-hour, unhurried pass along the crest (you, relaxed, not pitching)", "A quiet look out over the city from the hilltop", "Soft end card: your name + how to reach you"],
      },
    ],
    schedule: [
      { step: "Scout & lock script", detail: "Take the route, mark the 6–8 B-roll stops, finalize edits to this script.", time: "~45 min (day before)" },
      { step: "Golden-hour B-roll", detail: "Shoot the cable cars, the hotel facades, Grace Cathedral, Huntington Park, and the apartment-house blocks in good light.", time: "30–45 min (early AM or ~1 hr before sunset)" },
      { step: "Talk-to-camera takes", detail: "Shoot each section as its own clip at the relevant spot; 2 takes each; teleprompter on your phone.", time: "60–90 min" },
      { step: "Pickups & cutaways", detail: "Signs, a cable car gripping the cable, and a screen-record of your live market page (capture at home).", time: "~15 min" },
      { step: "Edit & caption", detail: "Assemble, add lower-thirds (market URL), burned-in captions, light music bed; export.", time: "2–3 hrs" },
      { step: "Publish & link", detail: "Upload to YouTube, paste the market link in the description — then I add the 'Watch the tour' button to the Nob Hill page.", time: "~30 min" },
    ],
    batchTip: "Shoot adjacent hoods the same outing — e.g. Nob Hill + Russian Hill + Chinatown in one morning loop.",
  },
  "Cole Valley": {
    runtime: "~10 min (8–10 target)",
    marketLink: "https://www.ur4cast.com/listings?nbhd=Cole%20Valley&layer=nbhd",
    detailsLink: "https://www.ur4cast.com/fog (open the Neighborhoods card → Cole Valley)",
    route: {
      // Route stays ENTIRELY within the Cole Valley boundary (verified against the
      // neighborhood polygon; bbox [-122.4534, 37.7645, -122.4476, 37.7689]).
      // Coords approximate — snap to the sidewalk grid for the final cut.
      spots: [
        { n: 1, name: "Cole & Carl", note: "Start — the tiny commercial heart of the village", coord: [-122.4499, 37.7660] },
        { n: 2, name: "N-Judah Carl St stop (Carl & Cole)", note: "The Muni Metro portal at the Sunset Tunnel mouth — the line that built the village", coord: [-122.4503, 37.7659] },
        { n: 3, name: "Cole St strip — cafés & bistros", note: "The leafy commercial blocks: coffee, brunch, neighborhood dinner spots", coord: [-122.4498, 37.7666] },
        { n: 4, name: "Upper Cole St — Edwardian flats", note: "Quiet residential blocks of classic 1900s Edwardians", coord: [-122.4497, 37.7672] },
        { n: 5, name: "Belvedere & Carl — residential viewpoint", note: "The streets begin to rise toward Tank Hill / Mount Sutro; a green, sheltered look uphill", coord: [-122.4521, 37.7656] },
      ],
    },
    sections: [
      {
        label: "COLD OPEN / SIGNATURE INTRO",
        words: 90,
        script:
          "IN SAN FRANCISCO, THE WEATHER CAN CHANGE IN THE SPACE OF A SINGLE BLOCK —\n" +
          "ONE STREET BURIED IN FOG, THE NEXT ONE SITTING IN THE SUN.\n" +
          "AFTER YEARS OF EXPLORING THESE HILLS, I'VE LEARNED THAT THE BEST HOMES\n" +
          "AREN'T FOUND IN A LISTING — THEY'RE IN THE DETAILS YOU ONLY KNOW\n" +
          "ONCE YOU'VE STOOD ON THE CORNER AT DIFFERENT TIMES OF DAY.\n" +
          "RIGHT NOW I'M AT COLE AND CARL, AND THE FOG IS ROLLING IN OVER THE HILL —\n" +
          "WHICH IS ALREADY THE FIRST THING WORTH KNOWING ABOUT THIS PLACE.\n" +
          "SO — ARE YOU READY TO SEE COLE VALLEY? LET'S GO.",
        broll: ["Two-shot idea: fog spilling over Tank Hill in one frame, the sunny Cole St strip in the next", "You stepping into frame at Cole & Carl", "The little village core to place us — café awnings, the N-Judah portal"],
      },
      {
        label: "1 · LOCATION & LAY OF THE LAND",
        words: 195,
        script:
          "FIRST — WHERE ARE WE? COLE VALLEY IS A TINY VILLAGE TUCKED JUST SOUTH OF\n" +
          "THE HAIGHT, WITH GOLDEN GATE PARK A BLOCK NORTH,\n" +
          "UCSF AND MOUNT SUTRO RISING TO THE SOUTH, AND TANK HILL OVERHEAD.\n" +
          "THE WHOLE HEART OF IT IS JUST A FEW BLOCKS AROUND COLE AND CARL.\n" +
          "WE'RE PERCHED FAIRLY HIGH HERE — ROUGHLY 270 TO 350 FEET UP —\n" +
          "BUT HERE'S THE LOVELY PART: THE VILLAGE CORE ITSELF IS FLAT AND EVEN,\n" +
          "EASY TO GET AROUND, FRIENDLY WHETHER YOU'RE PUSHING A STROLLER\n" +
          "OR ROLLING A WHEELCHAIR — RIGHT IN THE RANGE THE A-D-A CONSIDERS\n" +
          "AN ACCESSIBLE SLOPE, ABOUT FIVE PERCENT.\n" +
          "BUT THIS IS SAN FRANCISCO, SO THE EDGES CLIMB FAST:\n" +
          "HEAD TOWARD TANK HILL OR MOUNT SUTRO AND THE GRADE\n" +
          "QUICKLY PASSES WHAT'S COMFORTABLY ACCESSIBLE.\n" +
          "SO IF STEP-FREE, LOW-GRADE ACCESS MATTERS TO YOU,\n" +
          "THE VILLAGE FLOOR IS YOUR FRIEND; THE UPPER BLOCKS ARE A CLIMB.\n" +
          "AND THE HOMES THEMSELVES MATTER TOO —\n" +
          "MANY OF THESE CLASSIC VICTORIANS AND EDWARDIANS SIT UP A FLIGHT OF STAIRS\n" +
          "FROM THE SIDEWALK, SO IF STEP-FREE ENTRY IS A MUST,\n" +
          "IT'S WORTH CHECKING HOME BY HOME.",
        broll: ["Slow pan along Cole St; the Cole & Carl street signs", "Wide establishing shot showing the flat village core with the hills behind", "A cross-street climbing toward Tank Hill / Mount Sutro (show the grade)"],
      },
      {
        label: "2 · HISTORY",
        words: 185,
        script:
          "NOW THE STORY. COLE VALLEY GREW UP AS A STREETCAR SUBURB\n" +
          "IN THE EARLY 1900s — MUCH OF IT BUILT JUST AFTER THE 1906 EARTHQUAKE,\n" +
          "WHEN FAMILIES NEEDED HOMES IN A HURRY.\n" +
          "ALL OF THIS WAS THE ANCESTRAL LAND OF THE RAMAYTUSH OHLONE LONG BEFORE THAT.\n" +
          "THE NEIGHBORHOOD AND COLE STREET ARE NAMED FOR DOCTOR R. BEVERLY COLE —\n" +
          "A LEADING 19TH-CENTURY SAN FRANCISCO PHYSICIAN\n" +
          "AND DEAN OF THE UNIVERSITY OF CALIFORNIA MEDICAL SCHOOL.\n" +
          "WHAT REALLY MADE THE VILLAGE WAS THE N-JUDAH STREETCAR,\n" +
          "WHICH ARRIVED IN 1928 — DIVING UNDER THE HILL THROUGH THE SUNSET TUNNEL\n" +
          "AND SURFACING RIGHT HERE AT THE CARL AND COLE PORTAL.\n" +
          "THAT LINE BUILT THIS PLACE, AND IT STILL SERVES IT.\n" +
          "AND HERE'S THE QUIET MIRACLE: WHILE THE HAIGHT NEXT DOOR BECAME\n" +
          "A 1960s COUNTERCULTURE EPICENTER, COLE VALLEY STAYED\n" +
          "TIDY, RESIDENTIAL, AND CALM — A LITTLE EDWARDIAN TIME CAPSULE\n" +
          "JUST OVER THE BLOCK FROM ALL THAT HISTORY.",
        broll: ["Rows of Edwardian flat facades", "The N-Judah surfacing at the Carl & Cole portal", "The Sunset Tunnel mouth; a passing N-Judah train"],
      },
      {
        label: "3 · HIDDEN FACTS",
        words: 150,
        script:
          "HERE'S WHAT MOST PEOPLE DON'T KNOW.\n" +
          "ABOVE THE VILLAGE SITS TANK HILL — A ROCKY OUTCROP\n" +
          "THAT ONCE HELD A GIANT WATER TANK, WHICH IS WHERE THE NAME COMES FROM.\n" +
          "TODAY IT'S ONE OF THE CITY'S BEST AND LEAST-CROWDED PANORAMAS,\n" +
          "FROM DOWNTOWN ALL THE WAY OUT TO THE GOLDEN GATE.\n" +
          "MOST TOURISTS NEVER FIND IT — IT'S A LOCALS' SECRET.\n" +
          "THE N-JUDAH PORTAL RIGHT HERE IS THE EASTERN MOUTH OF THE SUNSET TUNNEL,\n" +
          "BORED STRAIGHT THROUGH THE HILL IN THE 1920s.\n" +
          "AND THOUGH THE WHOLE VILLAGE IS ONLY A FEW BLOCKS,\n" +
          "IT PACKS IN MORE CAFÉS AND BISTROS PER BLOCK THAN ALMOST ANYWHERE IN THE CITY —\n" +
          "WHICH IS WHY PEOPLE WHO LIVE HERE RARELY FEEL THE NEED TO LEAVE.\n" +
          "THIS IS A NEIGHBORHOOD THAT KEEPS ITS BEST PARTS QUIET.",
        broll: ["The view from Tank Hill (downtown to the Golden Gate)", "The Sunset Tunnel portal", "Café awnings and bistro windows along Cole St"],
      },
      {
        label: "4 · MICROCLIMATE",
        words: 100,
        script:
          "QUICK WORD ON WEATHER — BECAUSE IN SAN FRANCISCO, MICROCLIMATE IS EVERYTHING.\n" +
          "AND I'LL BE HONEST WITH YOU: COLE VALLEY IS ON THE FOGGIER SIDE.\n" +
          "WE'RE RIGHT BY THE GAP WHERE THE MARINE LAYER POURS IN\n" +
          "OFF THE SUNSET, JUST OVER THE HILL — SO THE FOG OFTEN ROLLS\n" +
          "IN OVER THE RIDGE, THE WAY IT'S DOING RIGHT NOW.\n" +
          "THE UPSIDE? THAT KEEPS THE VILLAGE COOL, GREEN, AND FRESH —\n" +
          "AND IT'S STILL SUNNIER THAN THE FOG-BOUND AVENUES FARTHER WEST.\n" +
          "I KEEP A LIVE FOG MAP THAT SHOWS THIS NEIGHBORHOOD'S EXACT SUMMER-FOG HOURS —\n" +
          "IT'S LINKED ON MY COLE VALLEY PAGE BELOW, SO YOU CAN SEE IT FOR YOURSELF.",
        broll: ["Fog spilling over Tank Hill / the Sutro ridge into the village", "Green, leafy, slightly misty Cole St", "Edit: screen-cap of the Ur4cast fog map"],
      },
      {
        label: "5 · GETTING AROUND — CAR-FREE",
        words: 285,
        script:
          "NOW THE PART THAT REALLY MATTERS IF YOU'RE BUYING HERE:\n" +
          "HOW YOU GET AROUND. AND COLE VALLEY IS ONE OF THE EASIEST PLACES\n" +
          "IN THE WHOLE CITY TO LIVE WITHOUT A CAR.\n" +
          "RIGHT HERE AT CARL AND COLE IS THE STANDOUT — THE N-JUDAH MUNI METRO,\n" +
          "RUNNING STRAIGHT DOWNTOWN THROUGH THE SUNSET TUNNEL ONE WAY\n" +
          "AND OUT TO THE BEACH THE OTHER.\n" +
          "THE 6, 37, AND 43 BUSES FILL IN THE GAPS, AND GOLDEN GATE PARK IS A BLOCK NORTH.\n" +
          "NOW LET'S LEAVE THE CITY — CAR-FREE.\n" +
          "THE FERRY BUILDING IS ABOUT THREE-POINT-SEVEN MILES NORTHEAST,\n" +
          "AND THE N-JUDAH RUNS STRAIGHT DOWNTOWN TO EMBARCADERO\n" +
          "IN ABOUT TWENTY-FIVE MINUTES — THAT'S YOUR GATEWAY TO THE WATER.\n" +
          "GOING TO THE EAST BAY? TAKE THE N-JUDAH TO EMBARCADERO, TRANSFER TO BART,\n" +
          "AND DOWNTOWN OAKLAND IS ABOUT THIRTY-FIVE MINUTES —\n" +
          "OR DRIVE THE BAY BRIDGE.\n" +
          "HEADING NORTH TO MARIN? THE LARKSPUR FERRY LEAVES FROM THE FERRY BUILDING\n" +
          "AND CROSSES IN ABOUT THIRTY MINUTES ON THE WATER —\n" +
          "OR DRIVE THE GOLDEN GATE BRIDGE.\n" +
          "HEADING SOUTH TO THE PENINSULA? CALTRAIN FROM 4TH AND KING\n" +
          "RUNS DOWN TO PALO ALTO IN ABOUT FIFTY MINUTES —\n" +
          "AND THE N-JUDAH CONNECTS YOU NEAR THERE — OR IT'S 280 OR 101 BY CAR.\n" +
          "BOTTOM LINE: WATER, RAIL, AND THREE BRIDGES — ALL WITHOUT OWNING A CAR.",
        broll: [
          "The N-Judah stop at Carl & Cole; a train surfacing from the tunnel",
          "Embarcadero Station + the Ferry Building / a departing ferry",
          "A BART train; the Bay Bridge; the Golden Gate Bridge; a Caltrain at 4th & King",
          "Simple motion-graphic map: Cole Valley → Oakland / Larkspur / Palo Alto with the times",
        ],
      },
      {
        label: "6 · THE GROUND UNDER YOU (HAZARDS)",
        words: 105,
        script:
          "TWO QUICK, HONEST NOTES ON THE GROUND ITSELF — AND THIS IS GOOD NEWS.\n" +
          "COLE VALLEY SITS UP ON SOLID, HIGHER GROUND, WELL AWAY FROM THE BAY,\n" +
          "SO IT IS NOT IN A TSUNAMI HAZARD ZONE — CROSS THAT WORRY OFF THE LIST.\n" +
          "AND UNLIKE A LOT OF HILLY SAN FRANCISCO, THE VILLAGE\n" +
          "IS NOT IN A STATE-DESIGNATED SEISMIC HAZARD ZONE EITHER —\n" +
          "WHICH IS GENUINELY REASSURING.\n" +
          "OF COURSE, EVERY CALIFORNIA HOME STILL GETS THE STANDARD\n" +
          "INSPECTIONS WITH YOUR INSPECTOR AND INSURER — THAT NEVER CHANGES.\n" +
          "I PUT THE SEISMIC AND TSUNAMI STATUS RIGHT ON EACH NEIGHBORHOOD'S\n" +
          "DETAILS PAGE, SO YOU CAN CHECK ANY SPECIFIC BLOCK BEFORE YOU WRITE AN OFFER.",
        broll: ["You gesturing to the solid hillside under the village", "Edit: the seismic + tsunami toggles on your fog map (both clear)"],
      },
      {
        label: "7 · DINING, NIGHTLIFE & DAILY LIFE",
        words: 120,
        script:
          "LET'S TALK DAILY LIFE.\n" +
          "FOR A NEIGHBORHOOD THIS SMALL, COLE VALLEY EATS WAY ABOVE ITS WEIGHT —\n" +
          "THE FEW BLOCKS AROUND COLE AND CARL ARE PACKED WITH\n" +
          "BELOVED CAFÉS, BRUNCH SPOTS, COZY BISTROS, AND A COUPLE OF\n" +
          "GREAT NEIGHBORHOOD BARS AND WINE ROOMS.\n" +
          "I'M NOT GOING TO NAME SPECIFIC PLACES ON CAMERA, BECAUSE THE LINEUP CHANGES —\n" +
          "AND I NEVER WANT TO SEND YOU SOMEWHERE THAT'S CLOSED.\n" +
          "INSTEAD, I KEEP A CURRENT, HAND-CHECKED LIST OF THE NEIGHBORHOOD'S BEST\n" +
          "RESTAURANTS AND BARS RIGHT ON MY COLE VALLEY DETAILS PAGE — ALWAYS UP TO DATE.\n" +
          "THE VIBE TO KNOW: THIS IS A RIGHT-OUTSIDE-YOUR-DOOR, LEAVE-THE-CAR-HOME KIND OF PLACE,\n" +
          "WITH GOLDEN GATE PARK A BLOCK AWAY FOR THE MORNINGS.",
        broll: ["Café tables; a busy bistro window at dusk on Cole St", "People spending time on the sidewalk; a wine room glowing", "Golden Gate Park greenery a block north"],
      },
      {
        label: "8 · REAL ESTATE",
        words: 115,
        script:
          "ON HOUSING: COLE VALLEY IS CLASSIC EARLY-1900s SAN FRANCISCO —\n" +
          "TIDY BLOCKS OF EDWARDIAN AND VICTORIAN FLATS,\n" +
          "FAMILY-SIZED SINGLE-FAMILY HOMES ON THE QUIETER UPHILL STREETS,\n" +
          "AND CONDOS AND T-I-C UNITS MIXED IN NEAR THE VILLAGE CORE.\n" +
          "IT RUNS FROM A FIRST CONDO TO A FULLY RESTORED EDWARDIAN SHOWPIECE.\n" +
          "I'M NOT GOING TO QUOTE A MEDIAN PRICE ON CAMERA, BECAUSE THAT NUMBER MOVES.\n" +
          "INSTEAD, I KEEP A LIVE MARKET UPDATE FOR COLE VALLEY ON MY SITE —\n" +
          "CURRENT MEDIANS FOR SINGLE-FAMILY HOMES AND FOR CONDOS, RIGHT UP TO TODAY.\n" +
          "THE LINK IS BELOW. THAT'S YOUR SMARTEST FIRST STEP BEFORE YOU EVEN TOUR.",
        broll: ["An Edwardian flats building, a painted Victorian, a modern condo entry", "A 'For Sale' sign on a leafy Cole Valley block", "Edit: lower-third + screen-record of your live market page"],
      },
      {
        label: "9 · WHO BELONGS HERE + SIGNATURE OUTRO",
        words: 125,
        script:
          "SO — WHO BELONGS IN COLE VALLEY?\n" +
          "SOMEONE WHO WANTS A REAL VILLAGE — CAFÉS AND A PARK RIGHT OUTSIDE THE DOOR,\n" +
          "A STREETCAR STRAIGHT DOWNTOWN, AND THE WHOLE BAY AREA\n" +
          "A TRAIN OR A FERRY AWAY, WITHOUT EVER NEEDING A CAR —\n" +
          "AND WHO DOESN'T MIND TRADING A LITTLE SUN FOR A LOT OF GREEN, COOL CALM.\n" +
          "BUT HERE'S THE THING I'VE LEARNED AFTER ALL THESE YEARS:\n" +
          "EVERY NEIGHBORHOOD IN THIS CITY HAS A STORY LIKE THIS ONE,\n" +
          "AND KNOWING THEM ALL IS THE WORK — THE MICROCLIMATES,\n" +
          "THE STREETS THAT HOLD THEIR VALUE, THE THINGS THAT NEVER SHOW UP IN A SEARCH.\n" +
          "ANYTHING THAT CHANGES — PRICES, THE NEWEST RESTAURANT, WHAT'S FOR SALE —\n" +
          "STAYS CURRENT ON MY COLE VALLEY NEIGHBORHOOD PAGE, SO THIS GUIDE NEVER GOES STALE.\n" +
          "SO IF YOU'RE THINKING ABOUT CALLING COLE VALLEY HOME,\n" +
          "I'D LOVE TO SHOW YOU AROUND AND HELP CREATE YOUR NEXT LIFE ADVENTURE.",
        broll: ["Golden-hour, unhurried pass along Cole St (you, relaxed, not pitching)", "A quiet look up toward Tank Hill with fog easing over it", "Soft end card: your name + how to reach you"],
      },
    ],
    schedule: [
      { step: "Scout & lock script", detail: "Take the route, mark the 6–8 B-roll stops, finalize edits to this script.", time: "~45 min (day before)" },
      { step: "Golden-hour B-roll", detail: "Shoot the Cole & Carl strip, the N-Judah portal, café life, the Tank Hill view, and housing variety in good light.", time: "30–45 min (early AM or ~1 hr before sunset)" },
      { step: "Talk-to-camera takes", detail: "Shoot each section as its own clip at the relevant spot; 2 takes each; teleprompter on your phone.", time: "60–90 min" },
      { step: "Pickups & cutaways", detail: "Signs, the N-Judah stop, and a screen-record of your live market page (capture at home).", time: "~15 min" },
      { step: "Edit & caption", detail: "Assemble, add lower-thirds (market URL), burned-in captions, light music bed; export.", time: "2–3 hrs" },
      { step: "Publish & link", detail: "Upload to YouTube, paste the market link in the description — then I add the 'Watch the tour' button to the Cole Valley page.", time: "~30 min" },
    ],
    batchTip: "Shoot adjacent hoods the same outing — e.g. Cole Valley + the Haight + Parnassus Heights in one morning loop.",
  },
"Bernal Heights": {
    aka: "“Maternal Heights”",
    runtime: "~10 min (8–10 target)",
    marketLink: "https://www.ur4cast.com/listings?nbhd=Bernal%20Heights&layer=nbhd",
    detailsLink: "https://www.ur4cast.com/fog (open the Neighborhoods card → Bernal Heights)",
    route: {
      // Route stays ENTIRELY within the Bernal Heights boundary (verified against
      // the neighborhood polygon). Coords approximate — snap to the sidewalk grid for the final cut.
      spots: [
        { n: 1, name: "Cortland & Bocana", note: "Start — the heart of the Cortland Ave village strip, sun out", coord: [-122.4146, 37.7388] },
        { n: 2, name: "Cortland Ave commercial strip", note: "The level main street: cafés, shops, the library, easy to get around", coord: [-122.4163, 37.7387] },
        { n: 3, name: "Esmeralda Stairway", note: "One of the hidden garden stairway streets that climb between blocks", coord: [-122.4178, 37.7412] },
        { n: 4, name: "Bernal Hill residential blocks", note: "The housing-stock segment: cottages and earthquake-shacks up the slope", coord: [-122.4156, 37.7425] },
        { n: 5, name: "Bernal Heights Park / Bernal Hill summit", note: "The grassy off-leash hilltop — the 360° view loop", coord: [-122.4146, 37.7434] },
      ],
    },
    sections: [
      {
        label: "COLD OPEN / SIGNATURE INTRO",
        words: 85,
        script:
          "IN SAN FRANCISCO, THE WEATHER CAN CHANGE IN THE SPACE OF A SINGLE BLOCK —\n" +
          "ONE STREET BURIED IN FOG, THE NEXT ONE SITTING IN THE SUN.\n" +
          "AFTER YEARS OF EXPLORING THESE HILLS, I'VE LEARNED THAT THE BEST HOMES\n" +
          "AREN'T FOUND IN A LISTING — THEY'RE IN THE DETAILS YOU ONLY KNOW\n" +
          "ONCE YOU'VE STOOD ON THE CORNER AT DIFFERENT TIMES OF DAY.\n" +
          "RIGHT NOW I'M AT CORTLAND AND BOCANA, AND THE SUN IS OUT —\n" +
          "WHICH IS ALREADY THE FIRST THING WORTH KNOWING ABOUT THIS PLACE.\n" +
          "SO — ARE YOU READY TO SEE BERNAL HEIGHTS? LET'S GO.",
        broll: ["Two-shot idea: a foggy ridge in one frame, sunny Cortland Ave in the next", "You moving up Cortland Ave into frame", "The grassy Bernal Hill summit to place us"],
      },
      {
        label: "1 · LOCATION & LAY OF THE LAND",
        words: 195,
        script:
          "FIRST — WHERE ARE WE? BERNAL HEIGHTS SITS JUST SOUTH OF THE MISSION,\n" +
          "A ROCKY HILL RISING ON ITS OWN BETWEEN THE MISSION, GLEN PARK,\n" +
          "AND THE FREEWAY OUT TO THE EAST.\n" +
          "THE MAIN SPINE IS CORTLAND AVENUE, THE VILLAGE-Y SHOPPING STRIP\n" +
          "THAT RUNS ACROSS THE SHOULDER OF THE HILL.\n" +
          "AND IT REALLY IS A HILL — THE LAND RUNS FROM ABOUT 20 FEET DOWN AT THE EDGES\n" +
          "UP TO AROUND 460 FEET AT THE SUMMIT.\n" +
          "ALONG CORTLAND THE GRADE IS FAIRLY LEVEL AND EASY TO GET AROUND —\n" +
          "FRIENDLY WHETHER YOU'RE PUSHING A STROLLER OR ROLLING A WHEELCHAIR.\n" +
          "BUT THE BLOCKS THAT CLIMB TOWARD THE TOP OF THE HILL GET STEEP FAST,\n" +
          "QUICKLY PASSING WHAT THE A-D-A CONSIDERS AN ACCESSIBLE SLOPE — ABOUT FIVE PERCENT.\n" +
          "SO IF STEP-FREE, LOW-GRADE ACCESS MATTERS TO YOU,\n" +
          "THE CORTLAND STRIP IS YOUR FRIEND; THE UPPER BLOCKS ARE A CLIMB.\n" +
          "AND THE HOMES THEMSELVES MATTER TOO —\n" +
          "MANY OF THESE HILLSIDE COTTAGES SIT UP A FLIGHT OF STAIRS FROM THE SIDEWALK,\n" +
          "SO IF STEP-FREE ENTRY IS A MUST, IT'S WORTH CHECKING HOME BY HOME.",
        broll: ["Slow pan along Cortland Ave; street signs at Cortland & Bocana", "Wide establishing shot showing the hill rising to the grassy summit", "A genuinely steep cross-street climbing toward the top (show the grade)"],
      },
      {
        label: "2 · HISTORY",
        words: 200,
        script:
          "NOW THE STORY. BERNAL HEIGHTS IS NAMED FOR JOSÉ CORNELIO BERNAL,\n" +
          "WHOSE 1839 MEXICAN LAND GRANT — RANCHO RINCÓN DE LAS SALINAS —\n" +
          "COVERED THIS HILL AND THE FLATS AROUND IT.\n" +
          "ALL OF IT WAS THE ANCESTRAL LAND OF THE RAMAYTUSH OHLONE LONG BEFORE THAT.\n" +
          "FOR DECADES IT GREW AS A WORKING-CLASS, ALMOST RURAL DISTRICT\n" +
          "ON THE EDGE OF THE CITY.\n" +
          "THEN CAME THE MOMENT THAT SHAPED IT MOST:\n" +
          "BERNAL SITS ON SOLID FRANCISCAN BEDROCK, AND WHEN THE 1906 EARTHQUAKE STRUCK,\n" +
          "THE HILL BARELY SHOOK WHILE SO MUCH OF THE CITY BURNED.\n" +
          "REFUGEES STREAMED UP HERE AND THREW UP EARTHQUAKE-SHACK COTTAGES —\n" +
          "AND SOME OF THEM ARE STILL TUCKED AMONG THE HOUSES TODAY.\n" +
          "FOR YEARS BERNAL STAYED BOHEMIAN AND DIVERSE —\n" +
          "A HAVEN FOR ARTISTS, LESBIAN FAMILIES, AND WORKING HOUSEHOLDS —\n" +
          "AND IT HELD ONTO THAT MELLOW, SMALL-TOWN CHARACTER AS THE CITY CHANGED.\n" +
          "TODAY IT'S A BELOVED FAMILY NEIGHBORHOOD KNOWN FOR ITS SUN,\n" +
          "ITS HILLTOP PARK, AND THE VILLAGE FEEL OF CORTLAND AVENUE.\n" +
          "SPEND TIME ON THESE STREETS, AND YOU'RE EXPLORING A SAN FRANCISCO\n" +
          "THAT THE 20TH CENTURY MOSTLY LEFT STANDING.",
        broll: ["Hillside cottage facades; a surviving earthquake-shack if you can spot one", "A view from the slope back across the Mission and downtown", "Wide shot of the rocky, grassy hill itself"],
      },
      {
        label: "3 · HIDDEN FACTS",
        words: 160,
        script:
          "HERE'S WHAT MOST PEOPLE DON'T KNOW.\n" +
          "THE FACT THAT BERNAL SITS ON SOLID ROCK IS WHY IT BARELY SHOOK IN 1906 —\n" +
          "AND WHY THOSE TINY REFUGEE COTTAGES ENDED UP HERE IN THE FIRST PLACE.\n" +
          "THE STEEP HILL IS LACED WITH PUBLIC STAIRWAY STREETS AND NARROW LANES —\n" +
          "ESMERALDA, COSO, AND THE BERNAL 'GOAT PATHS' —\n" +
          "THAT WANDER BETWEEN GARDENS INSTEAD OF FOLLOWING THE ROAD GRID.\n" +
          "GRASSY, TREELESS BERNAL HEIGHTS PARK CROWNS THE HILL —\n" +
          "ONE OF SAN FRANCISCO'S MOST-LOVED OFF-LEASH DOG RUNS,\n" +
          "WITH A 360-DEGREE VIEW LOOP THAT FILLS WITH LOCALS EVERY SUNSET.\n" +
          "AND THE AFFECTIONATE NICKNAME — 'MATERNAL HEIGHTS' —\n" +
          "CAME FROM ITS LONG HISTORY AS A WELCOMING HAVEN FOR FAMILIES OF EVERY KIND.\n" +
          "THIS IS A NEIGHBORHOOD THAT GUARDS ITS SMALL-TOWN FEEL ON PURPOSE.",
        broll: ["A hidden stairway street climbing between gardens", "Dogs and locals on the grassy summit at sunset", "The 360° view loop sweeping toward downtown and the bay"],
      },
      {
        label: "4 · MICROCLIMATE",
        words: 95,
        script:
          "QUICK WORD ON WEATHER — BECAUSE IN SAN FRANCISCO, MICROCLIMATE IS EVERYTHING.\n" +
          "BERNAL HEIGHTS SITS IN ONE OF THE CITY'S SUNNIEST, MOST SHELTERED POCKETS.\n" +
          "WHILE THE AVENUES OUT WEST DISAPPEAR INTO SUMMER FOG,\n" +
          "THIS HILL — TUCKED IN THE CITY'S WARM SOUTHEAST QUADRANT — CATCHES THE SUN\n" +
          "AND STAYS WARMER AND BRIGHTER. PEOPLE PAY FOR LIGHT.\n" +
          "I KEEP A LIVE FOG MAP THAT SHOWS THIS NEIGHBORHOOD'S EXACT SUMMER-FOG HOURS\n" +
          "VERSUS THE FOGGY WEST SIDE — IT'S LINKED ON MY BERNAL HEIGHTS PAGE BELOW.",
        broll: ["Blue sky over Cortland Ave; you in shirtsleeves", "Contrast: fog pouring over the western ridges in the distance", "Edit: screen-cap of the Ur4cast fog map"],
      },
      {
        label: "5 · GETTING AROUND — CAR-FREE",
        words: 290,
        script:
          "NOW THE PART THAT REALLY MATTERS IF YOU'RE BUYING HERE:\n" +
          "HOW YOU GET AROUND. AND BERNAL HEIGHTS LEANS ON BUSES — AND GOOD ONES.\n" +
          "THE 24 DIVISADERO RUNS RIGHT ALONG CORTLAND AVENUE,\n" +
          "AND THE LITTLE 67 BERNAL HEIGHTS BUS LOOPS UP AND OVER THE HILL.\n" +
          "DOWN ON MISSION STREET, THE 14 AND 49 RAPID BUSES RUN THE CORRIDOR,\n" +
          "AND THE 24TH STREET MISSION BART STATION IS RIGHT THERE —\n" +
          "WITH GLEN PARK BART JUST OVER TO THE WEST.\n" +
          "NOW LET'S LEAVE THE CITY — CAR-FREE.\n" +
          "THE FERRY BUILDING IS ABOUT FOUR MILES NORTHEAST,\n" +
          "A QUICK BUS-TO-BART RIDE, AND THAT'S YOUR GATEWAY TO THE WATER.\n" +
          "GOING TO THE EAST BAY? TAKE THE BUS TO 24TH STREET MISSION BART,\n" +
          "AND DOWNTOWN OAKLAND IS ABOUT THIRTY TO THIRTY-FIVE MINUTES —\n" +
          "OR BY CAR, THE BAY BRIDGE PUTS YOU THERE IN A SIMILAR STRETCH.\n" +
          "HEADING NORTH TO MARIN? THE LARKSPUR FERRY LEAVES FROM THE FERRY BUILDING\n" +
          "AND CROSSES IN ABOUT THIRTY MINUTES ON THE WATER —\n" +
          "OR DRIVE THE GOLDEN GATE BRIDGE.\n" +
          "HEADING SOUTH TO THE PENINSULA? TAKE THE BUS OR BART TO THE CALTRAIN DEPOT\n" +
          "AT 4TH AND KING, AND CALTRAIN RUNS DOWN TO PALO ALTO IN ABOUT FIFTY MINUTES —\n" +
          "OR IT'S ROUGHLY 280 OR 101 BY CAR.\n" +
          "BOTTOM LINE: BUSES TO BART, A FERRY ACROSS THE BAY,\n" +
          "AND THREE BRIDGES WITHIN REACH — ALL WITHOUT OWNING A CAR.",
        broll: [
          "A 24 Divisadero bus on Cortland Ave; the little 67 climbing the hill",
          "24th St Mission BART entrance; the Ferry Building / a departing ferry",
          "A BART train; the Bay Bridge; the Golden Gate Bridge; a Caltrain at 4th & King",
          "Simple motion-graphic map: Bernal Heights → Oakland / Larkspur / Palo Alto with the times",
        ],
      },
      {
        label: "6 · THE GROUND UNDER YOU (HAZARDS)",
        words: 110,
        script:
          "TWO QUICK, HONEST NOTES ON THE GROUND ITSELF.\n" +
          "GOOD NEWS FIRST: BERNAL HEIGHTS SITS UP ON A HILL, WELL ABOVE THE BAY,\n" +
          "SO IT IS NOT IN A TSUNAMI HAZARD ZONE — CROSS THAT WORRY OFF THE LIST.\n" +
          "LIKE MUCH OF HILLY SAN FRANCISCO, PARTS OF THE NEIGHBORHOOD\n" +
          "DO FALL WITHIN A STATE-DESIGNATED SEISMIC HAZARD ZONE —\n" +
          "THAT'S STANDARD FOR THE CITY'S SLOPES, AND IT'S SOMETHING\n" +
          "EVERY CALIFORNIA BUYER REVIEWS WITH THEIR INSPECTOR AND INSURER.\n" +
          "THE UPSIDE HERE IS THE SOLID BEDROCK THAT CARRIED THIS HILL THROUGH 1906.\n" +
          "I PUT THE SEISMIC AND TSUNAMI STATUS RIGHT ON EACH NEIGHBORHOOD'S\n" +
          "DETAILS PAGE, SO YOU CAN CHECK ANY SPECIFIC BLOCK BEFORE YOU WRITE AN OFFER.",
        broll: ["You gesturing to the rocky hillside rising to the summit", "Edit: the seismic + tsunami toggles on your fog map"],
      },
      {
        label: "7 · DINING, NIGHTLIFE & DAILY LIFE",
        words: 120,
        script:
          "LET'S TALK DAILY LIFE.\n" +
          "CORTLAND AVENUE IS THE KIND OF MAIN STREET PEOPLE MOVE HERE FOR —\n" +
          "INDEPENDENT CAFÉS, A WINE BAR OR TWO, NEIGHBORHOOD RESTAURANTS,\n" +
          "A LIBRARY, AND A FEW EASYGOING SPOTS THAT FEEL LIKE A SMALL TOWN.\n" +
          "I'M NOT GOING TO NAME SPECIFIC PLACES ON CAMERA, BECAUSE THE LINEUP CHANGES —\n" +
          "AND I NEVER WANT TO SEND YOU SOMEWHERE THAT'S CLOSED.\n" +
          "INSTEAD, I KEEP A CURRENT, HAND-CHECKED LIST OF THE NEIGHBORHOOD'S BEST\n" +
          "RESTAURANTS AND BARS RIGHT ON MY BERNAL HEIGHTS DETAILS PAGE — ALWAYS UP TO DATE.\n" +
          "THE VIBE TO KNOW: THIS IS A RIGHT-OUTSIDE-YOUR-DOOR, LEAVE-THE-CAR-HOME,\n" +
          "SMALL-TOWN-IN-THE-CITY KIND OF PLACE.",
        broll: ["Café tables on Cortland Ave; a relaxed storefront window", "The neighborhood library and sidewalk life", "An easygoing wine bar (general, not a single endorsement)"],
      },
      {
        label: "8 · REAL ESTATE",
        words: 120,
        script:
          "ON HOUSING: BERNAL HEIGHTS IS CLASSIC SAN FRANCISCO, JUST SMALLER-SCALED —\n" +
          "HILLSIDE COTTAGES, EARLY EARTHQUAKE-SHACK HOMES GROWN OVER TIME,\n" +
          "VICTORIAN AND EDWARDIAN FLATS, AND A SCATTER OF NEWER CONDOS.\n" +
          "IT RUNS FROM A FIRST COTTAGE TO A FULLY REMODELED HILLTOP HOME WITH A VIEW.\n" +
          "I'M NOT GOING TO QUOTE A MEDIAN PRICE ON CAMERA, BECAUSE THAT NUMBER MOVES.\n" +
          "INSTEAD, I KEEP A LIVE MARKET UPDATE FOR BERNAL HEIGHTS ON MY SITE —\n" +
          "CURRENT MEDIANS FOR SINGLE-FAMILY HOMES AND FOR CONDOS, RIGHT UP TO TODAY.\n" +
          "THE LINK IS BELOW. THAT'S YOUR SMARTEST FIRST STEP BEFORE YOU EVEN TOUR.",
        broll: ["A hillside cottage, a flats building, a modern condo entry", "A 'For Sale' sign", "Edit: lower-third + screen-record of your live market page"],
      },
      {
        label: "9 · WHO BELONGS HERE + SIGNATURE OUTRO",
        words: 120,
        script:
          "SO — WHO BELONGS IN BERNAL HEIGHTS?\n" +
          "SOMEONE WHO WANTS SUN, A GRASSY HILLTOP, AND A SMALL-TOWN MAIN STREET,\n" +
          "WITH THE WHOLE BAY AREA A TRAIN OR A FERRY AWAY, AND NEVER NEEDS A CAR.\n" +
          "BUT HERE'S THE THING I'VE LEARNED AFTER ALL THESE YEARS:\n" +
          "EVERY NEIGHBORHOOD IN THIS CITY HAS A STORY LIKE THIS ONE,\n" +
          "AND KNOWING THEM ALL IS THE WORK — THE MICROCLIMATES,\n" +
          "THE STREETS THAT HOLD THEIR VALUE, THE THINGS THAT NEVER SHOW UP IN A SEARCH.\n" +
          "ANYTHING THAT CHANGES — PRICES, THE NEWEST RESTAURANT, WHAT'S FOR SALE —\n" +
          "STAYS CURRENT ON MY BERNAL HEIGHTS NEIGHBORHOOD PAGE, SO THIS GUIDE NEVER GOES STALE.\n" +
          "SO IF YOU'RE THINKING ABOUT CALLING BERNAL HEIGHTS HOME,\n" +
          "I'D LOVE TO SHOW YOU AROUND AND HELP CREATE YOUR NEXT LIFE ADVENTURE.",
        broll: ["Golden-hour, unhurried pass along Cortland Ave (you, relaxed, not pitching)", "A quiet look out from the summit toward downtown", "Soft end card: your name + how to reach you"],
      },
    ],
    schedule: [
      { step: "Scout & lock script", detail: "Take the route, mark the 6–8 B-roll stops, finalize edits to this script.", time: "~45 min (day before)" },
      { step: "Golden-hour B-roll", detail: "Shoot the Cortland Ave strip, a hidden stairway, the hilltop view loop, dogs at sunset, and housing variety in good light.", time: "30–45 min (early AM or ~1 hr before sunset)" },
      { step: "Talk-to-camera takes", detail: "Shoot each section as its own clip at the relevant spot; 2 takes each; teleprompter on your phone.", time: "60–90 min" },
      { step: "Pickups & cutaways", detail: "Signs, a Cortland Ave bus, and a screen-record of your live market page (capture at home).", time: "~15 min" },
      { step: "Edit & caption", detail: "Assemble, add lower-thirds (market URL), burned-in captions, light music bed; export.", time: "2–3 hrs" },
      { step: "Publish & link", detail: "Upload to YouTube, paste the market link in the description — then I add the 'Watch the tour' button to the Bernal Heights page.", time: "~30 min" },
    ],
    batchTip: "Shoot adjacent hoods the same outing — e.g. Bernal Heights + the Mission + Glen Park in one sunny southeast loop.",
  },
"Potrero Hill": {
    runtime: "~10 min (8–10 target)",
    marketLink: "https://www.ur4cast.com/listings?nbhd=Potrero%20Hill&layer=nbhd",
    detailsLink: "https://www.ur4cast.com/fog (open the Neighborhoods card → Potrero Hill)",
    route: {
      // Route stays ENTIRELY within the Potrero Hill boundary (verified against the
      // neighborhood polygon). Coords approximate — snap to the sidewalk grid for the final cut.
      spots: [
        { n: 1, name: "18th & Connecticut", note: "Start — the heart of the 18th St strip, sun out", coord: [-122.3978, 37.7618] },
        { n: 2, name: "18th Street strip", note: "The tucked-away run of neighborhood cafés and favorites", coord: [-122.3995, 37.7615] },
        { n: 3, name: "The hilltop — downtown & bay views", note: "The crest looking straight across at the skyline and the water", coord: [-122.3990, 37.7585] },
        { n: 4, name: "McKinley Square", note: "The little hillside park with a front-row downtown view", coord: [-122.4030, 37.7600] },
        { n: 5, name: "Vermont St crooked stretch", note: "The switchbacks even twistier than Lombard, minus the crowds", coord: [-122.4040, 37.7558] },
        { n: 6, name: "Residential blocks — sunny streets", note: "Quiet, low-key blocks above the old industrial flats", coord: [-122.3960, 37.7600] },
      ],
    },
    sections: [
      {
        label: "COLD OPEN / SIGNATURE INTRO",
        words: 85,
        script:
          "IN SAN FRANCISCO, THE WEATHER CAN CHANGE IN THE SPACE OF A SINGLE BLOCK —\n" +
          "ONE STREET BURIED IN FOG, THE NEXT ONE SITTING IN THE SUN.\n" +
          "AFTER YEARS OF EXPLORING THESE HILLS, I'VE LEARNED THAT THE BEST HOMES\n" +
          "AREN'T FOUND IN A LISTING — THEY'RE IN THE DETAILS YOU ONLY KNOW\n" +
          "ONCE YOU'VE STOOD ON THE CORNER AT DIFFERENT TIMES OF DAY.\n" +
          "RIGHT NOW I'M ON 18TH AND CONNECTICUT, AND THE SUN IS OUT — " +
          "WHICH IS ALREADY THE FIRST THING WORTH KNOWING ABOUT THIS PLACE.\n" +
          "SO — ARE YOU READY TO SEE POTRERO HILL? LET'S GO.",
        broll: ["Two-shot idea: a foggy ridge in one frame, sunny 18th St in the next", "You moving up 18th St into frame", "The downtown skyline / bay view to place us"],
      },
      {
        label: "1 · LOCATION & LAY OF THE LAND",
        words: 195,
        script:
          "FIRST — WHERE ARE WE? POTRERO HILL SITS ON THE CITY'S CENTRAL-EASTERN EDGE,\n" +
          "JUST SOUTH OF SOMA AND THE MISSION, WITH DOGPATCH AND THE BAY\n" +
          "DOWN THE SLOPE TO THE EAST AND THE DESIGN DISTRICT TO THE NORTHWEST.\n" +
          "THE MAIN SPINE IS THE 18TH STREET STRIP, A TUCKED-AWAY RUN OF\n" +
          "NEIGHBORHOOD FAVORITES ACROSS THE SHOULDER OF THE HILL.\n" +
          "AND IT REALLY IS A HILL — THE LAND RUNS FROM ABOUT 10 FEET\n" +
          "DOWN ON THE FLATS UP TO AROUND 320 FEET AT THE CREST.\n" +
          "ALONG THE 18TH STREET STRIP THE GRADE IS FAIRLY MANAGEABLE AND EASY TO GET AROUND —\n" +
          "FRIENDLY WHETHER YOU'RE PUSHING A STROLLER OR ROLLING A WHEELCHAIR.\n" +
          "BUT THE CROSS STREETS THAT CLIMB THE HILL GET STEEP FAST,\n" +
          "QUICKLY PASSING WHAT THE A-D-A CONSIDERS AN ACCESSIBLE SLOPE — ABOUT FIVE PERCENT.\n" +
          "SO IF STEP-FREE, LOW-GRADE ACCESS MATTERS TO YOU,\n" +
          "THE STRIP IS YOUR FRIEND; THE CROSS STREETS ARE A CLIMB.\n" +
          "AND THE HOMES THEMSELVES MATTER TOO —\n" +
          "MANY OF THESE HILLSIDE HOUSES SIT UP A FLIGHT OF STAIRS FROM THE SIDEWALK,\n" +
          "SO IF STEP-FREE ENTRY IS A MUST, IT'S WORTH CHECKING HOME BY HOME.",
        broll: ["Slow pan up 18th St; street signs at 18th & Connecticut", "Wide establishing shot: the hill, the flats, and the downtown skyline beyond", "A genuinely steep cross-street climbing the hill (show the grade)"],
      },
      {
        label: "2 · HISTORY",
        words: 200,
        script:
          "NOW THE STORY. POTRERO IS SPANISH FOR 'PASTURE' —\n" +
          "AND THAT'S EXACTLY WHAT THIS WAS: 19TH-CENTURY GRAZING LAND\n" +
          "ON THE EDGE OF THE GROWING CITY.\n" +
          "ALL OF IT WAS THE ANCESTRAL LAND OF THE RAMAYTUSH OHLONE LONG BEFORE THAT.\n" +
          "AS SAN FRANCISCO INDUSTRIALIZED, THE PASTURE GAVE WAY TO\n" +
          "A WORKING-CLASS HILL OF SHIPYARD AND FACTORY WORKERS,\n" +
          "WITH A TIGHT RUSSIAN AND SLOVENIAN COMMUNITY PUTTING DOWN ROOTS —\n" +
          "THE SLOVENIAN HALL ON MARIPOSA STREET STILL STANDS AS A REMINDER.\n" +
          "AND BECAUSE IT SITS SHELTERED IN THE LEE OF TWIN PEAKS,\n" +
          "IT QUIETLY BECAME ONE OF THE SUNNIEST PARTS OF THE WHOLE CITY.\n" +
          "FOR DECADES IT WAS OVERLOOKED — A LITTLE OUT OF THE WAY,\n" +
          "WORKING-CLASS, INDUSTRIAL AROUND THE EDGES.\n" +
          "THEN PEOPLE NOTICED WHAT IT HAD ALL ALONG:\n" +
          "THE SUN, THE BIG DOWNTOWN-AND-BAY VIEWS, AND THE QUIET STREETS\n" +
          "ABOVE THE OLD INDUSTRIAL FLATS.\n" +
          "TODAY IT'S ONE OF THE CITY'S MOST SOUGHT-AFTER HILLS.\n" +
          "SPEND TIME ON THESE BLOCKS, AND YOU'RE EXPLORING A WORKING SAN FRANCISCO\n" +
          "THAT FOUND THE SUN AND NEVER LOOKED BACK.",
        broll: ["The Slovenian Hall on Mariposa St", "Old industrial / warehouse edges down on the flats", "Wide shot of the sunny hilltop blocks"],
      },
      {
        label: "3 · HIDDEN FACTS",
        words: 160,
        script:
          "HERE'S WHAT MOST PEOPLE DON'T KNOW.\n" +
          "THIS WAS THE HOME OF ANCHOR STEAM — ANCHOR BREWING BREWED ITS\n" +
          "ICONIC BEER RIGHT HERE ON THE HILL FROM 1979 UNTIL THE BREWERY CLOSED IN 2023,\n" +
          "A NEIGHBORHOOD INSTITUTION FOR OVER FOUR DECADES.\n" +
          "AND FORGET LOMBARD FOR A SECOND —\n" +
          "VERMONT STREET'S TIGHT SWITCHBACKS RIGHT HERE ON POTRERO HILL\n" +
          "ARE OFTEN ARGUED TO BE EVEN MORE CROOKED THAN LOMBARD,\n" +
          "WITH A FRACTION OF THE TOURISTS.\n" +
          "THE HILL'S EASTERN SLOPES LOOK STRAIGHT ACROSS AT THE DOWNTOWN SKYLINE\n" +
          "AND THE BAY — A FRONT-ROW VIEW THAT'S A BIG REASON\n" +
          "THESE QUIET STREETS BECAME SO SOUGHT-AFTER.\n" +
          "AND THAT NAME — POTRERO, 'PASTURE' — TELLS YOU THE WHOLE ORIGIN STORY:\n" +
          "A SUNNY HILLTOP THAT STARTED OUT AS GRAZING LAND.\n" +
          "THIS IS A NEIGHBORHOOD THAT REWARDS THE PEOPLE WHO LOOK CLOSER.",
        broll: ["The old Anchor Brewing building", "Vermont St's crooked switchbacks from above", "The downtown skyline framed from an eastern slope"],
      },
      {
        label: "4 · MICROCLIMATE",
        words: 95,
        script:
          "QUICK WORD ON WEATHER — BECAUSE IN SAN FRANCISCO, MICROCLIMATE IS EVERYTHING.\n" +
          "POTRERO HILL IS ONE OF THE SUNNIEST, WARMEST POCKETS IN THE WHOLE CITY.\n" +
          "WHILE THE AVENUES OUT WEST DISAPPEAR INTO SUMMER FOG,\n" +
          "THIS HILL — SHELTERED IN THE LEE OF TWIN PEAKS — CATCHES THE SUN\n" +
          "AND STAYS WARMER AND BRIGHTER. PEOPLE PAY FOR LIGHT.\n" +
          "I KEEP A LIVE FOG MAP THAT SHOWS THIS NEIGHBORHOOD'S EXACT SUMMER-FOG HOURS\n" +
          "VERSUS THE FOGGY WEST SIDE — IT'S LINKED ON MY POTRERO HILL PAGE BELOW.",
        broll: ["Blue sky over 18th St; you in shirtsleeves", "Contrast: fog pouring over the Twin Peaks ridge to the west", "Edit: screen-cap of the Ur4cast fog map"],
      },
      {
        label: "5 · GETTING AROUND — CAR-FREE",
        words: 290,
        script:
          "NOW THE PART THAT REALLY MATTERS IF YOU'RE BUYING HERE:\n" +
          "HOW YOU GET AROUND. POTRERO HILL IS A BUS-AND-RAIL NEIGHBORHOOD,\n" +
          "AND A WELL-CONNECTED ONE.\n" +
          "THE 22 FILLMORE CROSSES THE HILL TOWARD THE MISSION AND MISSION BAY,\n" +
          "WITH THE 19 POLK AND THE 48 QUINTARA SERVING THE SLOPES.\n" +
          "AND HERE'S THE BIG ONE: THE 22ND STREET CALTRAIN STATION SITS\n" +
          "RIGHT AT THE EASTERN FOOT OF THE HILL, PLUS THE 280 FREEWAY IS CLOSE BY.\n" +
          "NOW LET'S LEAVE THE CITY — CAR-FREE.\n" +
          "THE FERRY BUILDING IS ABOUT TWO AND A HALF MILES NORTH,\n" +
          "A SHORT MUNI RIDE, AND THAT'S YOUR GATEWAY TO THE WATER.\n" +
          "GOING TO THE EAST BAY? TAKE MUNI TO THE NEAREST BART,\n" +
          "AND DOWNTOWN OAKLAND IS ABOUT THIRTY TO THIRTY-FIVE MINUTES —\n" +
          "OR BY CAR, THE BAY BRIDGE PUTS YOU THERE IN A SIMILAR STRETCH.\n" +
          "HEADING NORTH TO MARIN? THE LARKSPUR FERRY LEAVES FROM THE FERRY BUILDING\n" +
          "AND CROSSES IN ABOUT THIRTY MINUTES ON THE WATER —\n" +
          "OR DRIVE THE GOLDEN GATE BRIDGE TO LARKSPUR IN ABOUT THIRTY.\n" +
          "HEADING SOUTH TO THE PENINSULA? THIS IS WHERE POTRERO SHINES —\n" +
          "YOU'RE CLOSE TO CALTRAIN, SO TAKE IT FROM 4TH AND KING\n" +
          "AND YOU'RE DOWN TO PALO ALTO IN ABOUT FIFTY MINUTES,\n" +
          "OR IT'S 280 OR 101 BY CAR, BOTH RIGHT AT YOUR DOORSTEP.\n" +
          "BOTTOM LINE: WATER, RAIL, AND THREE BRIDGES — ALL WITHOUT OWNING A CAR.",
        broll: [
          "A 22 Fillmore on the hill; the 22nd Street Caltrain station at the foot",
          "The Ferry Building / a departing ferry",
          "A BART train; the Bay Bridge; the Golden Gate Bridge; a Caltrain at 4th & King",
          "Simple motion-graphic map: Potrero Hill → Oakland / Larkspur / Palo Alto with the times",
        ],
      },
      {
        label: "6 · THE GROUND UNDER YOU (HAZARDS)",
        words: 110,
        script:
          "TWO QUICK, HONEST NOTES ON THE GROUND ITSELF.\n" +
          "START WITH THE HILL ITSELF: THE CREST SITS HIGH ABOVE THE BAY,\n" +
          "SO UP ON TOP YOU'RE WELL CLEAR OF ANY TSUNAMI HAZARD ZONE.\n" +
          "BUT BE HONEST ABOUT THE EDGES — THE FLAT EASTERN FOOT,\n" +
          "DOWN TOWARD DOGPATCH AND THE OLD INDUSTRIAL FLATS BY THE BAY,\n" +
          "IS LOWER, FILLED GROUND, WHERE LIQUEFACTION AND TSUNAMI RISK COME INTO PLAY.\n" +
          "AND LIKE MUCH OF HILLY SAN FRANCISCO, PARTS OF THE NEIGHBORHOOD\n" +
          "FALL WITHIN A STATE-DESIGNATED SEISMIC HAZARD ZONE —\n" +
          "STANDARD FOR THE CITY'S SLOPES, AND SOMETHING EVERY CALIFORNIA BUYER\n" +
          "REVIEWS WITH THEIR INSPECTOR AND INSURER.\n" +
          "I PUT THE SEISMIC AND TSUNAMI STATUS RIGHT ON EACH NEIGHBORHOOD'S\n" +
          "DETAILS PAGE, SO YOU CAN CHECK ANY SPECIFIC BLOCK BEFORE YOU WRITE AN OFFER.",
        broll: ["You gesturing from the high crest down to the flats and the bay", "The lower industrial flats on the eastern edge", "Edit: the seismic + tsunami toggles on your fog map"],
      },
      {
        label: "7 · DINING, NIGHTLIFE & DAILY LIFE",
        words: 120,
        script:
          "LET'S TALK DAILY LIFE.\n" +
          "THE 18TH STREET STRIP IS POTRERO HILL'S TUCKED-AWAY MAIN STREET —\n" +
          "A LOW-KEY RUN OF NEIGHBORHOOD FAVORITES: BRUNCH SPOTS, COFFEE,\n" +
          "EASYGOING DINNER PLACES, AND A FEW BELOVED LOCAL BARS,\n" +
          "WITHOUT THE CROWDS OF THE BUSIER STRIPS.\n" +
          "I'M NOT GOING TO NAME SPECIFIC PLACES ON CAMERA, BECAUSE THE LINEUP CHANGES —\n" +
          "AND I NEVER WANT TO SEND YOU SOMEWHERE THAT'S CLOSED.\n" +
          "INSTEAD, I KEEP A CURRENT, HAND-CHECKED LIST OF THE NEIGHBORHOOD'S BEST\n" +
          "RESTAURANTS AND BARS RIGHT ON MY POTRERO HILL DETAILS PAGE — ALWAYS UP TO DATE.\n" +
          "THE VIBE TO KNOW: THIS IS A SUNNY, RIGHT-OUTSIDE-YOUR-DOOR,\n" +
          "LEAVE-THE-CAR-HOME KIND OF PLACE.",
        broll: ["Café tables on 18th St; a brunch window in the sun", "The quiet, low-key strip at golden hour", "A relaxed neighborhood bar (general, not a single endorsement)"],
      },
      {
        label: "8 · REAL ESTATE",
        words: 120,
        script:
          "ON HOUSING: POTRERO HILL IS CLASSIC SAN FRANCISCO WITH A TWIST —\n" +
          "VICTORIAN AND EDWARDIAN COTTAGES ON THE SUNNY UPPER BLOCKS,\n" +
          "HILLSIDE HOMES BUILT TO GRAB THE DOWNTOWN-AND-BAY VIEWS,\n" +
          "AND MODERN CONDOS AND LOFTS NEARER THE FLATS AND THE DESIGN DISTRICT.\n" +
          "IT RUNS FROM A FIRST CONDO TO A FULLY RESTORED VIEW HOME.\n" +
          "I'M NOT GOING TO QUOTE A MEDIAN PRICE ON CAMERA, BECAUSE THAT NUMBER MOVES.\n" +
          "INSTEAD, I KEEP A LIVE MARKET UPDATE FOR POTRERO HILL ON MY SITE —\n" +
          "CURRENT MEDIANS FOR SINGLE-FAMILY HOMES AND FOR CONDOS, RIGHT UP TO TODAY.\n" +
          "THE LINK IS BELOW. THAT'S YOUR SMARTEST FIRST STEP BEFORE YOU EVEN TOUR.",
        broll: ["A hillside cottage, a view home, a modern loft entry", "A 'For Sale' sign with the skyline behind it", "Edit: lower-third + screen-record of your live market page"],
      },
      {
        label: "9 · WHO BELONGS HERE + SIGNATURE OUTRO",
        words: 120,
        script:
          "SO — WHO BELONGS ON POTRERO HILL?\n" +
          "SOMEONE WHO WANTS SUN, BIG VIEWS, AND QUIET STREETS,\n" +
          "WITH RAIL AND FREEWAYS RIGHT THERE AND THE WHOLE BAY AREA\n" +
          "A TRAIN OR A FERRY AWAY, WITHOUT EVER NEEDING A CAR.\n" +
          "BUT HERE'S THE THING I'VE LEARNED AFTER ALL THESE YEARS:\n" +
          "EVERY NEIGHBORHOOD IN THIS CITY HAS A STORY LIKE THIS ONE,\n" +
          "AND KNOWING THEM ALL IS THE WORK — THE MICROCLIMATES,\n" +
          "THE STREETS THAT HOLD THEIR VALUE, THE THINGS THAT NEVER SHOW UP IN A SEARCH.\n" +
          "ANYTHING THAT CHANGES — PRICES, THE NEWEST RESTAURANT, WHAT'S FOR SALE —\n" +
          "STAYS CURRENT ON MY POTRERO HILL NEIGHBORHOOD PAGE, SO THIS GUIDE NEVER GOES STALE.\n" +
          "SO IF YOU'RE THINKING ABOUT CALLING POTRERO HILL HOME, I'D LOVE TO SHOW YOU AROUND AND HELP CREATE YOUR NEXT LIFE ADVENTURE.",
        broll: ["Golden-hour, unhurried pass down 18th St (you, relaxed, not pitching)", "A quiet look across at the downtown skyline from the crest", "Soft end card: your name + how to reach you"],
      },
    ],
    schedule: [
      { step: "Scout & lock script", detail: "Take the route, mark the 6–8 B-roll stops, finalize edits to this script.", time: "~45 min (day before)" },
      { step: "Golden-hour B-roll", detail: "Shoot the 18th St strip, the hilltop views, Vermont St's switchbacks, street life, and housing variety in good light.", time: "30–45 min (early AM or ~1 hr before sunset)" },
      { step: "Talk-to-camera takes", detail: "Shoot each section as its own clip at the relevant spot; 2 takes each; teleprompter on your phone.", time: "60–90 min" },
      { step: "Pickups & cutaways", detail: "Signs, the 22nd Street Caltrain station, and a screen-record of your live market page (capture at home).", time: "~15 min" },
      { step: "Edit & caption", detail: "Assemble, add lower-thirds (market URL), burned-in captions, light music bed; export.", time: "2–3 hrs" },
      { step: "Publish & link", detail: "Upload to YouTube, paste the market link in the description — then I add the 'Watch the tour' button to the Potrero Hill page.", time: "~30 min" },
    ],
    batchTip: "Shoot adjacent hoods the same outing — e.g. Potrero Hill + Dogpatch + Showplace Square in one morning loop.",
  },
"Glen Park": {
    aka: "“The Village in the City”",
    runtime: "~10 min (8–10 target)",
    marketLink: "https://www.ur4cast.com/listings?nbhd=Glen%20Park&layer=nbhd",
    detailsLink: "https://www.ur4cast.com/fog (open the Neighborhoods card → Glen Park)",
    route: {
      // Route stays ENTIRELY within the Glen Park boundary (verified against the
      // neighborhood polygon). Coords approximate — snap to the sidewalk grid for the final cut.
      spots: [
        { n: 1, name: "Glen Park BART village — Diamond & Bosworth", note: "Start — the BART station and the heart of the little downtown, sun out", coord: [-122.4338, 37.7332] },
        { n: 2, name: "Diamond St strip — Diamond & Chenery", note: "The village core: the compact, level downtown of shops and cafés", coord: [-122.4335, 37.7340] },
        { n: 3, name: "Edge of Glen Canyon Park", note: "Where the village meets the wild canyon and Islais Creek", coord: [-122.4420, 37.7395] },
        { n: 4, name: "Leafy residential blocks — upper Chenery", note: "Quiet, tree-lined streets climbing away from the village", coord: [-122.4375, 37.7370] },
        { n: 5, name: "Residential viewpoint — eastern slope", note: "The greener, sheltered uphill blocks with a look back over the valley", coord: [-122.4320, 37.7355] },
      ],
    },
    sections: [
      {
        label: "COLD OPEN / SIGNATURE INTRO",
        words: 85,
        script:
          "IN SAN FRANCISCO, THE WEATHER CAN CHANGE IN THE SPACE OF A SINGLE BLOCK —\n" +
          "ONE STREET BURIED IN FOG, THE NEXT ONE SITTING IN THE SUN.\n" +
          "AFTER YEARS OF EXPLORING THESE HILLS, I'VE LEARNED THAT THE BEST HOMES\n" +
          "AREN'T FOUND IN A LISTING — THEY'RE IN THE DETAILS YOU ONLY KNOW\n" +
          "ONCE YOU'VE STOOD ON THE CORNER AT DIFFERENT TIMES OF DAY.\n" +
          "RIGHT NOW I'M AT THE GLEN PARK BART VILLAGE AT DIAMOND AND BOSWORTH, AND THE SUN IS OUT —\n" +
          "WHICH IS ALREADY THE FIRST THING WORTH KNOWING ABOUT THIS PLACE.\n" +
          "SO — ARE YOU READY TO SEE GLEN PARK? LET'S GO.",
        broll: ["Two-shot idea: a foggy ridge in one frame, sunny Diamond St in the next", "You moving up Diamond St into frame", "The BART station entrance / the village sign to place us"],
      },
      {
        label: "1 · LOCATION & LAY OF THE LAND",
        words: 195,
        script:
          "FIRST — WHERE ARE WE? GLEN PARK SITS IN THE GEOGRAPHIC HEART OF SAN FRANCISCO,\n" +
          "TUCKED INTO A VALLEY EAST OF TWIN PEAKS,\n" +
          "WITH NOE VALLEY OVER THE HILL TO THE NORTH AND THE MISSION OFF TO THE NORTHEAST.\n" +
          "THE HEART OF IT IS A COMPACT LITTLE DOWNTOWN WHERE DIAMOND AND CHENERY MEET,\n" +
          "WRAPPED AROUND THE WILD RAVINE OF GLEN CANYON PARK AT ITS BACK DOOR.\n" +
          "THE LAND RUNS FROM ABOUT 160 FEET DOWN IN THE VILLAGE\n" +
          "UP TO AROUND 590 FEET ON THE SURROUNDING SLOPES.\n" +
          "THE VILLAGE CORE AROUND BART IS FAIRLY LEVEL AND EASY TO GET AROUND —\n" +
          "FRIENDLY WHETHER YOU'RE PUSHING A STROLLER OR ROLLING A WHEELCHAIR.\n" +
          "BUT THE STREETS THAT CLIMB AWAY FROM THE VILLAGE GET STEEP FAST,\n" +
          "QUICKLY PASSING WHAT THE A-D-A CONSIDERS AN ACCESSIBLE SLOPE — ABOUT FIVE PERCENT,\n" +
          "AND THE BLOCKS ALONG THE GLEN CANYON EDGE CLIMB HARDEST OF ALL.\n" +
          "SO IF STEP-FREE, LOW-GRADE ACCESS MATTERS TO YOU,\n" +
          "THE VALLEY FLOOR IS YOUR FRIEND; THE UPPER BLOCKS ARE A CLIMB.\n" +
          "AND THE HOMES THEMSELVES MATTER TOO —\n" +
          "MANY SIT UP A FLIGHT OF STAIRS FROM THE SIDEWALK,\n" +
          "SO IF STEP-FREE ENTRY IS A MUST, IT'S WORTH CHECKING HOME BY HOME.",
        broll: ["Slow pan up Diamond St; street signs at Diamond & Chenery", "Wide establishing shot showing the valley + Glen Canyon and the Twin Peaks ridge", "A genuinely steep cross-street climbing toward the canyon (show the grade)"],
      },
      {
        label: "2 · HISTORY",
        words: 200,
        script:
          "NOW THE STORY. GLEN PARK GREW UP AROUND GLEN CANYON —\n" +
          "A RUGGED RAVINE THAT, BACK IN THE 1880s, HELD A POPULAR AMUSEMENT PARK\n" +
          "AND A SMALL ZOO THAT DREW CROWDS OUT FROM THE CITY.\n" +
          "ALL OF THIS WAS THE ANCESTRAL LAND OF THE RAMAYTUSH OHLONE LONG BEFORE THAT.\n" +
          "AND HERE'S THE LESS CHARMING PART — THE CANYON ALSO HELD A DYNAMITE WORKS,\n" +
          "WHICH OCCASIONALLY BLEW UP AND RATTLED THE WHOLE EARLY NEIGHBORHOOD.\n" +
          "STREETCARS REACHED THE VILLAGE, AND LITTLE BY LITTLE\n" +
          "GLEN PARK FILLED IN AS A QUIET, LEAFY ENCLAVE\n" +
          "AROUND ITS COMPACT DOWNTOWN WHERE DIAMOND AND CHENERY MEET.\n" +
          "THEN CAME THE MOMENT THAT SHAPED IT MOST:\n" +
          "WHEN BART OPENED ITS GLEN PARK STATION IN 1973,\n" +
          "THIS TINY VILLAGE BECAME ONE OF THE MOST COMMUTER-FRIENDLY SPOTS IN THE CITY,\n" +
          "WITH DOWNTOWN, THE EAST BAY, AND THE AIRPORT ALL A SHORT RIDE AWAY.\n" +
          "IT HAS STAYED SMALL AND GREEN EVER SINCE —\n" +
          "A REAL NEIGHBORHOOD WRAPPED AROUND A WILD CANYON.\n" +
          "SPEND TIME ON THESE STREETS, AND YOU'RE EXPLORING A SAN FRANCISCO\n" +
          "THAT STILL FEELS LIKE A VILLAGE IN THE MIDDLE OF THE CITY.",
        broll: ["Glen Canyon's rocky outcrops and creek bed", "The compact Diamond & Chenery village core", "The BART station entrance / a passing train"],
      },
      {
        label: "3 · HIDDEN FACTS",
        words: 160,
        script:
          "HERE'S WHAT MOST PEOPLE DON'T KNOW.\n" +
          "GLEN CANYON PARK HIDES ISLAIS CREEK —\n" +
          "ONE OF THE LAST FREE-FLOWING CREEKS LEFT IN ALL OF SAN FRANCISCO,\n" +
          "WINDING THROUGH A RAVINE WITH ROCK-CLIMBING OUTCROPS\n" +
          "THAT LOOKS LIKE THE LAND DID BEFORE THE CITY EVER ARRIVED.\n" +
          "THE VILLAGE'S ANCHOR IS BIRD AND BECKETT BOOKS —\n" +
          "A BELOVED INDEPENDENT BOOKSTORE THAT DOUBLES\n" +
          "AS ONE OF THE CITY'S MOST DEDICATED LIVE-JAZZ VENUES.\n" +
          "AND THAT QUIET CANYON HAS A WILD PAST —\n" +
          "IN THE 1880s IT HELD AN AMUSEMENT PARK, A ZOO,\n" +
          "AND A DYNAMITE FACTORY THAT KEPT BLOWING UP.\n" +
          "FOR SUCH A TINY NEIGHBORHOOD, GLEN PARK PUNCHES FAR ABOVE ITS WEIGHT —\n" +
          "ITS OWN BART STATION, ITS OWN CREEK, AND ITS OWN JAZZ.",
        broll: ["Islais Creek / the canyon trail", "Bird & Beckett storefront (general exterior)", "Rock outcrops with climbers in Glen Canyon"],
      },
      {
        label: "4 · MICROCLIMATE",
        words: 95,
        script:
          "QUICK WORD ON WEATHER — BECAUSE IN SAN FRANCISCO, MICROCLIMATE IS EVERYTHING.\n" +
          "GLEN PARK SITS IN ONE OF THE CITY'S SHELTERED, SUNNIER POCKETS.\n" +
          "WHILE THE AVENUES OUT WEST DISAPPEAR INTO SUMMER FOG,\n" +
          "THIS VALLEY — TUCKED EAST OF TWIN PEAKS — CATCHES MORE SUN AND LESS WIND.\n" +
          "IT RUNS A TOUCH COOLER AND GREENER THAN THE MISSION JUST DOWNHILL,\n" +
          "BUT IT STAYS BRIGHT WHEN THE WEST SIDE IS GREY. PEOPLE PAY FOR LIGHT.\n" +
          "I KEEP A LIVE FOG MAP THAT SHOWS THIS NEIGHBORHOOD'S EXACT SUMMER-FOG HOURS\n" +
          "VERSUS THE FOGGY WEST SIDE — IT'S LINKED ON MY GLEN PARK PAGE BELOW.",
        broll: ["Blue sky over Diamond St; you in shirtsleeves", "Contrast: fog pouring over the Twin Peaks ridge to the west", "Edit: screen-cap of the Ur4cast fog map"],
      },
      {
        label: "5 · GETTING AROUND — CAR-FREE",
        words: 290,
        script:
          "NOW THE PART THAT REALLY MATTERS IF YOU'RE BUYING HERE:\n" +
          "HOW YOU GET AROUND. AND THIS IS GLEN PARK'S SECRET WEAPON.\n" +
          "RIGHT HERE IN THE VILLAGE IS GLEN PARK BART —\n" +
          "AND HAVING BART RIGHT IN YOUR OWN TINY DOWNTOWN\n" +
          "MAKES THIS ONE OF THE EASIEST PLACES IN THE CITY TO LIVE WITHOUT A CAR.\n" +
          "THE J-CHURCH MUNI METRO STOPS NEARBY ON THE SAN JOSE AVENUE EDGE,\n" +
          "AND THE 23, 26, AND 44 BUSES CLIMB THE SURROUNDING HILLS.\n" +
          "NOW LET'S LEAVE THE CITY — CAR-FREE.\n" +
          "THE FERRY BUILDING IS ABOUT FOUR AND A HALF MILES NORTHEAST,\n" +
          "A QUICK BART RIDE AWAY, AND THAT'S YOUR GATEWAY TO THE WATER.\n" +
          "GOING TO THE EAST BAY? THIS IS THE REAL PLUS —\n" +
          "YOU TAKE BART STRAIGHT FROM GLEN PARK, NO TRANSFER NEEDED,\n" +
          "AND DOWNTOWN OAKLAND IS ABOUT THIRTY MINUTES DOOR TO PLATFORM.\n" +
          "HEADING NORTH TO MARIN? TAKE BART DOWNTOWN TO THE FERRY BUILDING,\n" +
          "AND THE LARKSPUR FERRY CROSSES IN ABOUT THIRTY MINUTES ON THE WATER —\n" +
          "OR DRIVE THE GOLDEN GATE BRIDGE.\n" +
          "HEADING SOUTH TO THE PENINSULA? TAKE BART OR MUNI TO THE CALTRAIN DEPOT\n" +
          "AT 4TH AND KING, AND CALTRAIN RUNS DOWN TO PALO ALTO IN ABOUT FIFTY MINUTES —\n" +
          "OR IT'S ROUGHLY THE SAME BY CAR ON 280 OR 101.\n" +
          "AND DON'T FORGET — BART RUNS STRAIGHT TO SFO FROM HERE TOO.\n" +
          "BOTTOM LINE: WATER, RAIL, THE AIRPORT, AND THREE BRIDGES — ALL WITHOUT OWNING A CAR.",
        broll: [
          "Glen Park BART entrance; a J-Church streetcar; a 23, 26, or 44 bus on the hill",
          "The Ferry Building / a departing ferry",
          "A BART train; the Bay Bridge; the Golden Gate Bridge; a Caltrain at 4th & King",
          "Simple motion-graphic map: Glen Park → Oakland / Larkspur / Palo Alto / SFO with the times",
        ],
      },
      {
        label: "6 · THE GROUND UNDER YOU (HAZARDS)",
        words: 110,
        script:
          "TWO QUICK, HONEST NOTES ON THE GROUND ITSELF.\n" +
          "GOOD NEWS FIRST: GLEN PARK SITS INLAND AND UP HIGH, WELL ABOVE THE BAY,\n" +
          "SO IT IS NOT IN A TSUNAMI HAZARD ZONE — CROSS THAT WORRY OFF THE LIST.\n" +
          "LIKE MUCH OF HILLY SAN FRANCISCO, PARTS OF THE NEIGHBORHOOD\n" +
          "DO FALL WITHIN A STATE-DESIGNATED SEISMIC HAZARD ZONE —\n" +
          "THAT'S STANDARD FOR THE CITY'S SLOPES, AND IT'S SOMETHING\n" +
          "EVERY CALIFORNIA BUYER REVIEWS WITH THEIR INSPECTOR AND INSURER.\n" +
          "I PUT THE SEISMIC AND TSUNAMI STATUS RIGHT ON EACH NEIGHBORHOOD'S\n" +
          "DETAILS PAGE, SO YOU CAN CHECK ANY SPECIFIC BLOCK BEFORE YOU WRITE AN OFFER.",
        broll: ["You gesturing to the canyon slopes climbing away from the village", "Edit: the seismic + tsunami toggles on your fog map"],
      },
      {
        label: "7 · DINING, NIGHTLIFE & DAILY LIFE",
        words: 120,
        script:
          "LET'S TALK DAILY LIFE.\n" +
          "FOR SUCH A SMALL VILLAGE, THE DIAMOND STREET STRIP DELIVERS —\n" +
          "A PIZZERIA, A TAQUERIA, EASYGOING CAFÉS, A NEIGHBORHOOD BAR,\n" +
          "AND THAT BELOVED BOOKSTORE WITH LIVE JAZZ A FEW NIGHTS A WEEK.\n" +
          "I'M NOT GOING TO NAME SPECIFIC PLACES ON CAMERA, BECAUSE THE LINEUP CHANGES —\n" +
          "AND I NEVER WANT TO SEND YOU SOMEWHERE THAT'S CLOSED.\n" +
          "INSTEAD, I KEEP A CURRENT, HAND-CHECKED LIST OF THE NEIGHBORHOOD'S BEST\n" +
          "RESTAURANTS AND BARS RIGHT ON MY GLEN PARK DETAILS PAGE — ALWAYS UP TO DATE.\n" +
          "THE VIBE TO KNOW: THIS IS A RIGHT-OUTSIDE-YOUR-DOOR, LEAVE-THE-CAR-HOME,\n" +
          "SMALL-VILLAGE-IN-THE-CITY KIND OF PLACE.",
        broll: ["Café tables on Diamond St; a busy storefront window", "The little village core at dusk", "A relaxed neighborhood bar or bookstore-jazz night (general, not a single endorsement)"],
      },
      {
        label: "8 · REAL ESTATE",
        words: 120,
        script:
          "ON HOUSING: GLEN PARK IS CLASSIC SAN FRANCISCO —\n" +
          "LEAFY STREETS OF VICTORIAN AND EDWARDIAN HOMES,\n" +
          "MID-CENTURY SINGLE-FAMILY HOUSES ON THE QUIETER UPHILL BLOCKS,\n" +
          "AND A HANDFUL OF CONDOS AND T-I-C UNITS NEARER THE VILLAGE.\n" +
          "IT RUNS FROM A FIRST CONDO TO A FULLY RESTORED SINGLE-FAMILY SHOWPIECE.\n" +
          "I'M NOT GOING TO QUOTE A MEDIAN PRICE ON CAMERA, BECAUSE THAT NUMBER MOVES.\n" +
          "INSTEAD, I KEEP A LIVE MARKET UPDATE FOR GLEN PARK ON MY SITE —\n" +
          "CURRENT MEDIANS FOR SINGLE-FAMILY HOMES AND FOR CONDOS, RIGHT UP TO TODAY.\n" +
          "THE LINK IS BELOW. THAT'S YOUR SMARTEST FIRST STEP BEFORE YOU EVEN TOUR.",
        broll: ["A painted Victorian, a mid-century home, a modern condo entry", "A 'For Sale' sign", "Edit: lower-third + screen-record of your live market page"],
      },
      {
        label: "9 · WHO BELONGS HERE + SIGNATURE OUTRO",
        words: 120,
        script:
          "SO — WHO BELONGS IN GLEN PARK?\n" +
          "SOMEONE WHO WANTS SUN, CALM, A WILD CANYON AT THE BACK DOOR,\n" +
          "AND BART RIGHT IN THE VILLAGE — THE WHOLE BAY AREA A TRAIN AWAY, AND NEVER NEEDS A CAR.\n" +
          "BUT HERE'S THE THING I'VE LEARNED AFTER ALL THESE YEARS:\n" +
          "EVERY NEIGHBORHOOD IN THIS CITY HAS A STORY LIKE THIS ONE,\n" +
          "AND KNOWING THEM ALL IS THE WORK — THE MICROCLIMATES,\n" +
          "THE STREETS THAT HOLD THEIR VALUE, THE THINGS THAT NEVER SHOW UP IN A SEARCH.\n" +
          "ANYTHING THAT CHANGES — PRICES, THE NEWEST RESTAURANT, WHAT'S FOR SALE —\n" +
          "STAYS CURRENT ON MY GLEN PARK NEIGHBORHOOD PAGE, SO THIS GUIDE NEVER GOES STALE.\n" +
          "SO IF YOU'RE THINKING ABOUT CALLING GLEN PARK HOME,\n" +
          "I'D LOVE TO SHOW YOU AROUND AND HELP CREATE YOUR NEXT LIFE ADVENTURE.",
        broll: ["Golden-hour, unhurried pass up Diamond St (you, relaxed, not pitching)", "A quiet look toward Glen Canyon and the Twin Peaks ridge", "Soft end card: your name + how to reach you"],
      },
    ],
    schedule: [
      { step: "Scout & lock script", detail: "Take the route, mark the 6–8 B-roll stops, finalize edits to this script.", time: "~45 min (day before)" },
      { step: "Golden-hour B-roll", detail: "Shoot the BART village, the Diamond St strip, the Glen Canyon edge, leafy residential blocks, and housing variety in good light.", time: "30–45 min (early AM or ~1 hr before sunset)" },
      { step: "Talk-to-camera takes", detail: "Shoot each section as its own clip at the relevant spot; 2 takes each; teleprompter on your phone.", time: "60–90 min" },
      { step: "Pickups & cutaways", detail: "Signs, the BART entrance, and a screen-record of your live market page (capture at home).", time: "~15 min" },
      { step: "Edit & caption", detail: "Assemble, add lower-thirds (market URL), burned-in captions, light music bed; export.", time: "2–3 hrs" },
      { step: "Publish & link", detail: "Upload to YouTube, paste the market link in the description — then I add the 'Watch the tour' button to the Glen Park page.", time: "~30 min" },
    ],
    batchTip: "Shoot adjacent hoods the same outing — e.g. Glen Park + Noe Valley + Diamond Heights in one morning loop.",
  },
"Cow Hollow": {
    runtime: "~10 min (8–10 target)",
    marketLink: "https://www.ur4cast.com/listings?nbhd=Cow%20Hollow&layer=nbhd",
    detailsLink: "https://www.ur4cast.com/fog (open the Neighborhoods card → Cow Hollow)",
    route: {
      // Route stays ENTIRELY within the Cow Hollow boundary (verified against the
      // neighborhood polygon). Coords approximate — snap to the sidewalk grid for the final cut.
      spots: [
        { n: 1, name: "Union Street strip", note: "Start — the boutique-and-brunch spine, sun out", coord: [-122.4400, 37.7975] },
        { n: 2, name: "Octagon House / Allyne Park", note: "The 1861 octagonal landmark and its little corner park", coord: [-122.4378, 37.7970] },
        { n: 3, name: "Vallejo St boutiques", note: "The quieter shopfront blocks just off the main strip", coord: [-122.4420, 37.7965] },
        { n: 4, name: "Union & Steiner — residential blocks", note: "The housing-stock segment: Victorian and Edwardian flats", coord: [-122.4385, 37.7958] },
        { n: 5, name: "Upper Cow Hollow blocks", note: "Where the streets begin to climb south toward Pacific Heights", coord: [-122.4407, 37.7958] },
      ],
    },
    sections: [
      {
        label: "COLD OPEN / SIGNATURE INTRO",
        words: 85,
        script:
          "IN SAN FRANCISCO, THE WEATHER CAN CHANGE IN THE SPACE OF A SINGLE BLOCK —\n" +
          "ONE STREET BURIED IN FOG, THE NEXT ONE SITTING IN THE SUN.\n" +
          "AFTER YEARS OF EXPLORING THESE HILLS, I'VE LEARNED THAT THE BEST HOMES\n" +
          "AREN'T FOUND IN A LISTING — THEY'RE IN THE DETAILS YOU ONLY KNOW\n" +
          "ONCE YOU'VE STOOD ON THE CORNER AT DIFFERENT TIMES OF DAY.\n" +
          "RIGHT NOW I'M ON UNION STREET, AND THE SUN IS OUT —\n" +
          "WHICH IS ALREADY THE FIRST THING WORTH KNOWING ABOUT THIS PLACE.\n" +
          "SO — ARE YOU READY TO SEE COW HOLLOW? LET'S GO.",
        broll: ["Two-shot idea: a foggy ridge in one frame, sunny Union St in the next", "You moving up Union St into frame", "A boutique row / the Octagon House to place us"],
      },
      {
        label: "1 · LOCATION & LAY OF THE LAND",
        words: 195,
        script:
          "FIRST — WHERE ARE WE? COW HOLLOW SITS ON THE CITY'S NORTHERN SIDE,\n" +
          "TUCKED IN A VALLEY BETWEEN PACIFIC HEIGHTS UP THE SLOPE TO THE SOUTH\n" +
          "AND THE MARINA DOWN BY THE BAY TO THE NORTH.\n" +
          "THE MAIN SPINE IS UNION STREET, THE BOUTIQUE-AND-DINING STRIP\n" +
          "RUNNING ACROSS THE FLOOR OF THE OLD DAIRY VALLEY.\n" +
          "THE LAND RUNS FROM ABOUT 20 FEET DOWN HERE\n" +
          "UP TO AROUND 220 FEET ON THE SOUTHERN RIM.\n" +
          "ALONG UNION STREET THE GRADE IS FAIRLY LEVEL AND EASY TO GET AROUND —\n" +
          "FRIENDLY WHETHER YOU'RE PUSHING A STROLLER OR ROLLING A WHEELCHAIR.\n" +
          "BUT THE BLOCKS THAT CLIMB SOUTH TOWARD PACIFIC HEIGHTS GET STEEP FAST,\n" +
          "QUICKLY PASSING WHAT THE A-D-A CONSIDERS AN ACCESSIBLE SLOPE — ABOUT FIVE PERCENT.\n" +
          "SO IF STEP-FREE, LOW-GRADE ACCESS MATTERS TO YOU,\n" +
          "THE VALLEY FLOOR IS YOUR FRIEND; THE UPPER BLOCKS ARE A CLIMB.\n" +
          "AND THE HOMES THEMSELVES MATTER TOO —\n" +
          "MANY OF THESE CLASSIC VICTORIANS SIT UP A FLIGHT OF STAIRS FROM THE SIDEWALK,\n" +
          "SO IF STEP-FREE ENTRY IS A MUST, IT'S WORTH CHECKING HOME BY HOME.",
        broll: ["Slow pan up Union St; street signs at Union & Steiner", "Wide establishing shot showing the valley floor + the Pacific Heights slope", "A genuinely steep cross-street climbing south (show the grade)"],
      },
      {
        label: "2 · HISTORY",
        words: 200,
        script:
          "NOW THE STORY. COW HOLLOW EARNED ITS NAME THE LITERAL WAY.\n" +
          "IN THE MID-1800s THIS WAS A MARSHY GREEN VALLEY OF DAIRY FARMS —\n" +
          "DOZENS OF DAIRIES GRAZED THE COWS THAT SUPPLIED THE GROWING CITY'S MILK.\n" +
          "ALL OF THIS WAS THE ANCESTRAL LAND OF THE RAMAYTUSH OHLONE LONG BEFORE THAT.\n" +
          "AT THE HEART OF THE VALLEY SAT WASHERWOMAN'S LAGOON,\n" +
          "A FRESHWATER POND THE CITY ONCE USED FOR ITS LAUNDRY.\n" +
          "BUT THE DAIRIES AND TANNERIES FOULED THE WATER,\n" +
          "AND IN 1891 THE CITY SHUT THEM DOWN AND FILLED THE LAGOON IN.\n" +
          "THAT CLEARED THE WAY FOR HOMES, AND THROUGH THE 1890s AND EARLY 1900s\n" +
          "THE VALLEY BUILT OUT WITH THE VICTORIAN AND EDWARDIAN HOUSES YOU STILL SEE.\n" +
          "THEN CAME THE REINVENTION: IN THE 1950s AND 60s,\n" +
          "SHOPKEEPERS CONVERTED UNION STREET'S OLD VICTORIANS\n" +
          "INTO ONE OF SAN FRANCISCO'S FIRST BOUTIQUE SHOPPING STRIPS —\n" +
          "A TEMPLATE THE CITY'S COMMERCIAL STREETS STILL FOLLOW.\n" +
          "SO WHEN YOU SPEND TIME ON THESE BLOCKS, REMEMBER —\n" +
          "YOU'RE STANDING IN A VALLEY THAT WENT FROM PASTURE TO POND TO\n" +
          "ONE OF THE CITY'S MOST POLISHED LITTLE MAIN STREETS.",
        broll: ["Victorian and Edwardian facades along the side streets", "The Octagon House / a date plaque", "An old boutique storefront converted from a Victorian"],
      },
      {
        label: "3 · HIDDEN FACTS",
        words: 160,
        script:
          "HERE'S WHAT MOST PEOPLE DON'T KNOW.\n" +
          "THE 1854 FARMHOUSE THAT GAVE COW HOLLOW ITS NAME IS STILL HERE ON UNION STREET —\n" +
          "TODAY IT HOUSES A BAR AND RESTAURANT, BEHIND ONE OF THE CITY'S OLDEST PALM TREES.\n" +
          "THAT FRESHWATER POND I MENTIONED — WASHERWOMAN'S LAGOON —\n" +
          "VANISHED COMPLETELY WHEN THE CITY FILLED IT IN, BUT IT'S WHY THE GROUND\n" +
          "DIPS THE WAY IT DOES ALONG THE LOWER NORTHERN EDGE.\n" +
          "AND UNION STREET WAS A PIONEER: THOSE 1950s AND 60s BOUTIQUES\n" +
          "MADE IT ONE OF THE FIRST CONVERTED-VICTORIAN SHOPPING STRIPS IN THE CITY.\n" +
          "THERE'S ALSO A 1913 SALOON ON THE EDGE OF THE NEIGHBORHOOD\n" +
          "THAT'S BEEN POURING DRINKS CONTINUOUSLY FOR OVER A CENTURY —\n" +
          "A LONGTIME SEE-AND-BE-SEEN HANGOUT FOR THE CITY'S POLITICAL CROWD.\n" +
          "THIS IS A NEIGHBORHOOD THAT KEEPS ITS HISTORY HIDING IN PLAIN SIGHT.",
        broll: ["The historic farmhouse / palm tree on Union St", "The Octagon House at Union & Gough", "A century-old saloon facade (general, not a single endorsement)"],
      },
      {
        label: "4 · MICROCLIMATE",
        words: 95,
        script:
          "QUICK WORD ON WEATHER — BECAUSE IN SAN FRANCISCO, MICROCLIMATE IS EVERYTHING.\n" +
          "COW HOLLOW IS ONE OF THE BRIGHTER POCKETS ON THE CITY'S NORTH SIDE —\n" +
          "IT CATCHES A LOT OF SUN, AND THAT LIGHT IS PART OF THE DRAW.\n" +
          "BUT IT SITS JUST INLAND FROM THE BAY, SO IT CAN BE BREEZY —\n" +
          "THAT WIND COMES STRAIGHT OFF THE WATER THROUGH THE GOLDEN GATE.\n" +
          "BRING A LIGHT LAYER, EVEN ON A SUNNY DAY.\n" +
          "I KEEP A LIVE FOG MAP THAT SHOWS THIS NEIGHBORHOOD'S EXACT SUMMER-FOG HOURS\n" +
          "VERSUS THE FOGGY WEST SIDE — IT'S LINKED ON MY COW HOLLOW PAGE BELOW.",
        broll: ["Blue sky over Union St; you in shirtsleeves", "Wind off the bay: flags snapping, leaves moving on the side streets", "Edit: screen-cap of the Ur4cast fog map"],
      },
      {
        label: "5 · GETTING AROUND — CAR-FREE",
        words: 290,
        script:
          "NOW THE PART THAT REALLY MATTERS IF YOU'RE BUYING HERE:\n" +
          "HOW YOU GET AROUND. THERE'S NO MUNI METRO IN COW HOLLOW —\n" +
          "IT'S A BUS NEIGHBORHOOD, AND A WELL-CONNECTED ONE.\n" +
          "THE 45 UNION-STOCKTON RUNS RIGHT ALONG UNION STREET TO DOWNTOWN,\n" +
          "WITH THE 41 UNION, THE 22 FILLMORE, AND THE 30 STOCKTON\n" +
          "LINKING YOU TO THE MARINA, PACIFIC HEIGHTS, AND THE REST OF THE CITY.\n" +
          "THE NEAREST BART IS A TRANSFER DOWNTOWN, NOT A STATION YOU CAN SEE FROM HERE.\n" +
          "NOW LET'S LEAVE THE CITY — CAR-FREE.\n" +
          "THE FERRY BUILDING IS ABOUT TWO AND THREE-QUARTER MILES EAST,\n" +
          "A SHORT MUNI RIDE, AND THAT'S YOUR GATEWAY TO THE WATER.\n" +
          "GOING TO THE EAST BAY? FROM DOWNTOWN, HOP BART —\n" +
          "OAKLAND IS ABOUT THIRTY TO THIRTY-FIVE MINUTES,\n" +
          "OR BY CAR THE BAY BRIDGE GETS YOU THERE TOO.\n" +
          "HEADING NORTH TO MARIN? YOU'RE CLOSE TO THE GOLDEN GATE BRIDGE —\n" +
          "IT'S ABOUT A TWENTY TO TWENTY-FIVE MINUTE DRIVE TO LARKSPUR,\n" +
          "OR TAKE THE LARKSPUR FERRY FROM THE FERRY BUILDING AND CROSS\n" +
          "ON THE WATER IN ABOUT THIRTY MINUTES.\n" +
          "HEADING SOUTH TO THE PENINSULA? TAKE MUNI TO THE CALTRAIN DEPOT\n" +
          "AT 4TH AND KING, AND CALTRAIN RUNS DOWN TO PALO ALTO IN ABOUT FIFTY MINUTES —\n" +
          "OR IT'S 280 OR 101 BY CAR.\n" +
          "BOTTOM LINE: BUSES TO DOWNTOWN, A FERRY ACROSS THE BAY,\n" +
          "AND THE GOLDEN GATE BRIDGE RIGHT THERE — ALL WITHOUT OWNING A CAR.",
        broll: [
          "A 45 or 41 bus on Union St",
          "The Ferry Building / a departing ferry",
          "A BART train; the Bay Bridge; the Golden Gate Bridge; a Caltrain at 4th & King",
          "Simple motion-graphic map: Cow Hollow → Oakland / Larkspur / Palo Alto with the times",
        ],
      },
      {
        label: "6 · THE GROUND UNDER YOU (HAZARDS)",
        words: 110,
        script:
          "NOW TWO HONEST NOTES ON THE GROUND ITSELF — AND I MEAN HONEST.\n" +
          "COW HOLLOW IS AN OLD FILLED-IN VALLEY — REMEMBER THAT LAGOON —\n" +
          "AND THAT MATTERS. PARTS OF THE NEIGHBORHOOD FALL WITHIN A\n" +
          "STATE-DESIGNATED SEISMIC HAZARD ZONE, ESPECIALLY THE LOWER NORTHERN EDGE\n" +
          "NEAR THE OLD CREEK AND THE MARINA FILL.\n" +
          "AND BECAUSE THAT LOWER EDGE SITS CLOSE TO THE BAYFRONT, IT ALSO TOUCHES A\n" +
          "TSUNAMI HAZARD AND EVACUATION ZONE.\n" +
          "NONE OF THAT IS A DEAL-BREAKER — IT'S A REASON TO GO IN INFORMED:\n" +
          "REVIEW THE SOILS, ASK ABOUT SEISMIC RETROFITS, AND PRICE IN INSURANCE.\n" +
          "I PUT THE SEISMIC AND TSUNAMI STATUS RIGHT ON EACH NEIGHBORHOOD'S DETAILS PAGE,\n" +
          "ALONGSIDE THE CITY'S OWN RESOURCES, SO YOU CAN CHECK ANY BLOCK BEFORE YOU WRITE AN OFFER.",
        broll: ["You gesturing to the low northern blocks toward the Marina", "Edit: the seismic + tsunami toggles on your fog map", "A retrofit / soft-story note card if you have one"],
      },
      {
        label: "7 · DINING, NIGHTLIFE & DAILY LIFE",
        words: 120,
        script:
          "LET'S TALK DAILY LIFE.\n" +
          "UNION STREET IS THE HEART OF IT — A POLISHED STRIP OF\n" +
          "BOUTIQUES, COFFEE, BRUNCH SPOTS, DINNER ROOMS, AND A LIVELY BAR SCENE.\n" +
          "IT'S A SEE-AND-BE-SEEN KIND OF MAIN STREET,\n" +
          "WITH PACIFIC HEIGHTS AND THE MARINA BOTH A FEW BLOCKS AWAY.\n" +
          "I'M NOT GOING TO NAME SPECIFIC PLACES ON CAMERA, BECAUSE THE LINEUP CHANGES —\n" +
          "AND I NEVER WANT TO SEND YOU SOMEWHERE THAT'S CLOSED.\n" +
          "INSTEAD, I KEEP A CURRENT, HAND-CHECKED LIST OF THE NEIGHBORHOOD'S BEST\n" +
          "RESTAURANTS AND BARS RIGHT ON MY COW HOLLOW DETAILS PAGE — ALWAYS UP TO DATE.\n" +
          "THE VIBE TO KNOW: THIS IS A RIGHT-OUTSIDE-YOUR-DOOR, LEAVE-THE-CAR-HOME KIND OF PLACE.",
        broll: ["Union St boutique windows; café tables at brunch", "A busy restaurant window at dusk", "A general nightlife sidewalk shot (no single endorsement)"],
      },
      {
        label: "8 · REAL ESTATE",
        words: 120,
        script:
          "ON HOUSING: COW HOLLOW IS CLASSIC NORTHSIDE SAN FRANCISCO —\n" +
          "VICTORIAN AND EDWARDIAN FLATS, SINGLE-FAMILY HOMES ON THE QUIETER BLOCKS,\n" +
          "AND CONDOS, MANY OF THEM CONVERTED FROM THOSE OLDER HOUSES.\n" +
          "IT RUNS FROM A FIRST CONDO TO A FULLY RESTORED VICTORIAN SHOWPIECE.\n" +
          "I'M NOT GOING TO QUOTE A MEDIAN PRICE ON CAMERA, BECAUSE THAT NUMBER MOVES.\n" +
          "INSTEAD, I KEEP A LIVE MARKET UPDATE FOR COW HOLLOW ON MY SITE —\n" +
          "CURRENT MEDIANS FOR SINGLE-FAMILY HOMES AND FOR CONDOS, RIGHT UP TO TODAY.\n" +
          "THE LINK IS BELOW. THAT'S YOUR SMARTEST FIRST STEP BEFORE YOU EVEN TOUR.",
        broll: ["A painted Victorian, a flats building, a modern condo entry", "A 'For Sale' sign", "Edit: lower-third + screen-record of your live market page"],
      },
      {
        label: "9 · WHO BELONGS HERE + SIGNATURE OUTRO",
        words: 120,
        script:
          "SO — WHO BELONGS IN COW HOLLOW?\n" +
          "SOMEONE WHO WANTS A POLISHED LITTLE MAIN STREET, SUN, AND A LIVELY SCENE,\n" +
          "WITH PACIFIC HEIGHTS AND THE BAY BOTH A FEW BLOCKS AWAY, AND NEVER NEEDS A CAR.\n" +
          "BUT HERE'S THE THING I'VE LEARNED AFTER ALL THESE YEARS:\n" +
          "EVERY NEIGHBORHOOD IN THIS CITY HAS A STORY LIKE THIS ONE,\n" +
          "AND KNOWING THEM ALL IS THE WORK — THE MICROCLIMATES,\n" +
          "THE STREETS THAT HOLD THEIR VALUE, THE THINGS THAT NEVER SHOW UP IN A SEARCH.\n" +
          "ANYTHING THAT CHANGES — PRICES, THE NEWEST RESTAURANT, WHAT'S FOR SALE —\n" +
          "STAYS CURRENT ON MY COW HOLLOW NEIGHBORHOOD PAGE, SO THIS GUIDE NEVER GOES STALE.\n" +
          "SO IF YOU'RE THINKING ABOUT CALLING COW HOLLOW HOME,\n" +
          "I'D LOVE TO SHOW YOU AROUND AND HELP CREATE YOUR NEXT LIFE ADVENTURE.",
        broll: ["Golden-hour, unhurried pass up Union St (you, relaxed, not pitching)", "A quiet look up the hill toward Pacific Heights", "Soft end card: your name + how to reach you"],
      },
    ],
    schedule: [
      { step: "Scout & lock script", detail: "Take the route, mark the 6–8 B-roll stops, finalize edits to this script.", time: "~45 min (day before)" },
      { step: "Golden-hour B-roll", detail: "Shoot the Union St strip, the Octagon House, boutique windows, street life, and housing variety in good light.", time: "30–45 min (early AM or ~1 hr before sunset)" },
      { step: "Talk-to-camera takes", detail: "Shoot each section as its own clip at the relevant spot; 2 takes each; teleprompter on your phone.", time: "60–90 min" },
      { step: "Pickups & cutaways", detail: "Signs, a Union St bus, and a screen-record of your live market page (capture at home).", time: "~15 min" },
      { step: "Edit & caption", detail: "Assemble, add lower-thirds (market URL), burned-in captions, light music bed; export.", time: "2–3 hrs" },
      { step: "Publish & link", detail: "Upload to YouTube, paste the market link in the description — then I add the 'Watch the tour' button to the Cow Hollow page.", time: "~30 min" },
    ],
    batchTip: "Shoot adjacent hoods the same outing — e.g. Cow Hollow + Marina + Pacific Heights in one morning loop.",
  },
"Duboce Triangle": {
    runtime: "~10 min (8–10 target)",
    marketLink: "https://www.ur4cast.com/listings?nbhd=Duboce%20Triangle&layer=nbhd",
    detailsLink: "https://www.ur4cast.com/fog (open the Neighborhoods card → Duboce Triangle)",
    route: {
      // Route stays ENTIRELY within the Duboce Triangle boundary (verified against the
      // neighborhood polygon). Coords approximate — snap to the sidewalk grid for the final cut.
      spots: [
        { n: 1, name: "Duboce Park", note: "Start — the off-leash meadow and the dog run, sun out", coord: [-122.4313, 37.7693] },
        { n: 2, name: "Church & Duboce — N-Judah portal", note: "The Muni Metro hub where the N dives into the Sunset Tunnel", coord: [-122.4292, 37.7694] },
        { n: 3, name: "Harvey Milk Photo Center", note: "The park's edge — America's oldest public darkroom", coord: [-122.4305, 37.7697] },
        { n: 4, name: "Henry & Sanchez — Victorian blocks", note: "The housing-stock segment: quiet, leafy pre-1906 Victorians", coord: [-122.4310, 37.7665] },
        { n: 5, name: "Castro & Duboce — the Castro-adjacent corner", note: "The western edge, where the land starts to rise toward Buena Vista", coord: [-122.4356, 37.7693] },
      ],
    },
    sections: [
      {
        label: "COLD OPEN / SIGNATURE INTRO",
        words: 85,
        script:
          "IN SAN FRANCISCO, THE WEATHER CAN CHANGE IN THE SPACE OF A SINGLE BLOCK —\n" +
          "ONE STREET BURIED IN FOG, THE NEXT ONE SITTING IN THE SUN.\n" +
          "AFTER YEARS OF EXPLORING THESE HILLS, I'VE LEARNED THAT THE BEST HOMES\n" +
          "AREN'T FOUND IN A LISTING — THEY'RE IN THE DETAILS YOU ONLY KNOW\n" +
          "ONCE YOU'VE STOOD ON THE CORNER AT DIFFERENT TIMES OF DAY.\n" +
          "RIGHT NOW I'M AT DUBOCE PARK, AND THE SUN IS OUT —\n" +
          "WHICH IS ALREADY THE FIRST THING WORTH KNOWING ABOUT THIS PLACE.\n" +
          "SO — ARE YOU READY TO SEE DUBOCE TRIANGLE? LET'S GO.",
        broll: ["Two-shot idea: a foggy ridge in one frame, sunny Duboce Park in the next", "You moving into frame at the dog meadow", "The N-Judah portal / a streetcar to place us"],
      },
      {
        label: "1 · LOCATION & LAY OF THE LAND",
        words: 195,
        script:
          "FIRST — WHERE ARE WE? DUBOCE TRIANGLE IS A SMALL WEDGE\n" +
          "RIGHT IN THE MIDDLE OF SAN FRANCISCO, WHERE THE CASTRO, THE MISSION,\n" +
          "AND THE LOWER HAIGHT ALL MEET, JUST A BLOCK OFF THE MARKET STREET ACTION.\n" +
          "THE HEART OF IT IS DUBOCE PARK, WITH QUIET, LEAFY VICTORIAN BLOCKS AROUND IT.\n" +
          "THIS IS A SMALL, MOSTLY LEVEL TRIANGLE — THE LAND RUNS\n" +
          "FROM ABOUT 100 FEET UP TO AROUND 240 FEET, AND THE CORE\n" +
          "AROUND THE PARK IS GENTLE AND EASY TO GET AROUND —\n" +
          "FRIENDLY WHETHER YOU'RE PUSHING A STROLLER OR ROLLING A WHEELCHAIR.\n" +
          "BUT THIS IS SAN FRANCISCO, SO THE EDGES CLIMB:\n" +
          "HEAD WEST TOWARD THE CASTRO AND BUENA VISTA AND THE GRADE PICKS UP,\n" +
          "AND ON THE STEEPEST STRETCHES IT PASSES WHAT THE A-D-A CONSIDERS\n" +
          "AN ACCESSIBLE SLOPE — ABOUT FIVE PERCENT.\n" +
          "SO IF STEP-FREE, LOW-GRADE ACCESS MATTERS TO YOU,\n" +
          "THE BLOCKS AROUND THE PARK ARE YOUR FRIEND; THE WESTERN EDGE IS A CLIMB.\n" +
          "AND THE HOMES THEMSELVES MATTER TOO —\n" +
          "MANY OF THESE CLASSIC VICTORIANS SIT UP A FLIGHT OF STAIRS FROM THE SIDEWALK,\n" +
          "SO IF STEP-FREE ENTRY IS A MUST, IT'S WORTH CHECKING HOME BY HOME.",
        broll: ["Slow pan across Duboce Park; street signs at Duboce & Noe", "Wide establishing shot showing the triangle + the rise toward Buena Vista", "A cross-street climbing west toward the Castro (show the grade)"],
      },
      {
        label: "2 · HISTORY",
        words: 200,
        script:
          "NOW THE STORY. THE NEIGHBORHOOD — AND DUBOCE AVENUE ITSELF —\n" +
          "IS NAMED FOR VICTOR DUBOCE, A SAN FRANCISCO SUPERVISOR\n" +
          "WHO COMMANDED THE CITY'S VOLUNTEER REGIMENT\n" +
          "IN THE SPANISH-AMERICAN WAR.\n" +
          "ALL OF THIS WAS THE ANCESTRAL LAND OF THE RAMAYTUSH OHLONE LONG BEFORE THAT.\n" +
          "THE TRIANGLE FILLED IN AFTER 1900 AS A STREETCAR NEIGHBORHOOD\n" +
          "OF VICTORIAN AND EDWARDIAN HOMES,\n" +
          "WEDGED BETWEEN THE CASTRO, THE MISSION, AND THE LOWER HAIGHT.\n" +
          "THEN CAME THE MOMENT THAT SHAPED IT MOST:\n" +
          "WHEN THE 1906 EARTHQUAKE STRUCK, THE FIRES THAT LEVELED SO MUCH OF THE CITY\n" +
          "LARGELY SPARED THESE BLOCKS.\n" +
          "SO A DENSE, INTACT STOCK OF PRE-EARTHQUAKE VICTORIANS\n" +
          "STILL STANDS TODAY ON THESE QUIET, LEAFY STREETS.\n" +
          "AT ITS CENTER IS DUBOCE PARK AND THE STREETCAR PORTAL\n" +
          "WHERE THE N-JUDAH DIVES UNDERGROUND INTO THE 1928 SUNSET TUNNEL.\n" +
          "FOR DECADES IT'S STAYED A CALM, GREEN POCKET\n" +
          "JUST OFF THE MARKET STREET BUSTLE.\n" +
          "SPEND TIME ON THESE BLOCKS, AND YOU'RE EXPLORING A SAN FRANCISCO\n" +
          "THAT THE 20TH CENTURY MOSTLY LEFT STANDING.",
        broll: ["Victorian and Edwardian facades around the park", "The Duboce Portal as the N-Judah dives under", "Wide shot of an unbroken row of original homes"],
      },
      {
        label: "3 · HIDDEN FACTS",
        words: 160,
        script:
          "HERE'S WHAT MOST PEOPLE DON'T KNOW.\n" +
          "RIGHT ON THE PARK'S EDGE SITS THE HARVEY MILK PHOTO CENTER —\n" +
          "FOUNDED IN 1937, IT'S THE OLDEST AND LARGEST PUBLIC\n" +
          "PHOTOGRAPHY CENTER AND DARKROOM IN THE ENTIRE UNITED STATES.\n" +
          "AT DUBOCE PARK, THE N-JUDAH MUNI METRO PLUNGES INTO\n" +
          "THE 1928 SUNSET TUNNEL THROUGH THE DUBOCE PORTAL —\n" +
          "A FAVORITE TRAINSPOTTING AND DOG-LOVERS' SPOT.\n" +
          "AND THAT DOG PARK IS THE REAL HEADLINE:\n" +
          "DUBOCE PARK'S OFF-LEASH MEADOW, RINGED BY VICTORIAN FLATS\n" +
          "AND A COMMUNITY GARDEN, IS AMONG THE MOST BELOVED DOG RUNS IN THE CITY.\n" +
          "AND THE NAME? IT HONORS VICTOR DUBOCE,\n" +
          "A CITY SUPERVISOR AND WAR HERO — NOT THE FIRST PERSON\n" +
          "YOU'D GUESS A NEIGHBORHOOD THIS PEACEFUL WAS NAMED FOR.\n" +
          "THIS IS A LITTLE WEDGE WITH AN OUTSIZED STORY.",
        broll: ["Harvey Milk Photo Center sign / facade", "The N-Judah entering the Duboce Portal", "Dogs on the off-leash meadow; the community garden"],
      },
      {
        label: "4 · MICROCLIMATE",
        words: 95,
        script:
          "QUICK WORD ON WEATHER — BECAUSE IN SAN FRANCISCO, MICROCLIMATE IS EVERYTHING.\n" +
          "DUBOCE TRIANGLE SITS IN ONE OF THE CITY'S SUNNIER, MORE SHELTERED POCKETS.\n" +
          "WHILE THE AVENUES OUT WEST DISAPPEAR INTO SUMMER FOG,\n" +
          "THIS WEDGE — TUCKED IN THE LEE OF THE HILLS — CATCHES THE SUN\n" +
          "AND STAYS WARMER AND BRIGHTER. PEOPLE PAY FOR LIGHT.\n" +
          "I KEEP A LIVE FOG MAP THAT SHOWS THIS NEIGHBORHOOD'S EXACT SUMMER-FOG HOURS\n" +
          "VERSUS THE FOGGY WEST SIDE — IT'S LINKED ON MY DUBOCE TRIANGLE PAGE BELOW.",
        broll: ["Blue sky over Duboce Park; you in shirtsleeves", "Contrast: fog pouring over the Twin Peaks ridge to the west", "Edit: screen-cap of the Ur4cast fog map"],
      },
      {
        label: "5 · GETTING AROUND — CAR-FREE",
        words: 290,
        script:
          "NOW THE PART THAT REALLY MATTERS IF YOU'RE BUYING HERE:\n" +
          "HOW YOU GET AROUND. AND DUBOCE TRIANGLE IS A GENUINE TRANSIT JEWEL —\n" +
          "ONE OF THE EASIEST PLACES IN THE WHOLE CITY TO LIVE WITHOUT A CAR.\n" +
          "RIGHT ON THE EDGE IS CHURCH STREET STATION — MUNI METRO,\n" +
          "WITH THE J, K, L, M, AND T LINES, AND THE N-JUDAH SURFACES\n" +
          "RIGHT HERE AT DUBOCE PARK BEFORE IT DIVES UNDER.\n" +
          "THE HISTORIC F-LINE STREETCAR RUNS UP MARKET TO THE FERRY BUILDING,\n" +
          "AND THE 22 FILLMORE CROSSES ON CHURCH STREET.\n" +
          "NOW LET'S LEAVE THE CITY — CAR-FREE.\n" +
          "THE FERRY BUILDING IS ABOUT THREE MILES NORTHEAST,\n" +
          "A QUICK MUNI METRO RIDE TO EMBARCADERO,\n" +
          "AND THAT'S YOUR GATEWAY TO THE WATER.\n" +
          "GOING TO THE EAST BAY? FROM EMBARCADERO, HOP BART —\n" +
          "DOWNTOWN OAKLAND IS ABOUT THIRTY-FIVE MINUTES DOOR TO PLATFORM.\n" +
          "BY CAR, THE BAY BRIDGE PUTS YOU IN OAKLAND IN TWENTY TO TWENTY-FIVE.\n" +
          "HEADING NORTH TO MARIN? THE LARKSPUR FERRY LEAVES FROM THE FERRY BUILDING\n" +
          "AND CROSSES IN ABOUT THIRTY MINUTES ON THE WATER —\n" +
          "OR DRIVE THE GOLDEN GATE BRIDGE TO LARKSPUR IN ABOUT THIRTY.\n" +
          "HEADING SOUTH TO THE PENINSULA? TAKE MUNI TO THE CALTRAIN DEPOT\n" +
          "AT 4TH AND KING, AND CALTRAIN RUNS DOWN TO PALO ALTO IN ABOUT FIFTY MINUTES —\n" +
          "OR IT'S ROUGHLY FIFTY BY CAR ON 280 OR 101.\n" +
          "BOTTOM LINE: WATER, RAIL, AND THREE BRIDGES — ALL WITHOUT OWNING A CAR.",
        broll: [
          "Church St Station entrance; the N-Judah at the Duboce Portal; an F-line streetcar on Market",
          "Embarcadero Station + the Ferry Building / a departing ferry",
          "A BART train; the Bay Bridge; the Golden Gate Bridge; a Caltrain at 4th & King",
          "Simple motion-graphic map: Duboce Triangle → Oakland / Larkspur / Palo Alto with the times",
        ],
      },
      {
        label: "6 · THE GROUND UNDER YOU (HAZARDS)",
        words: 110,
        script:
          "TWO QUICK, HONEST NOTES ON THE GROUND ITSELF.\n" +
          "GOOD NEWS FIRST: DUBOCE TRIANGLE SITS INLAND AND ELEVATED, WELL ABOVE THE BAY,\n" +
          "SO IT IS NOT IN A TSUNAMI HAZARD ZONE — CROSS THAT WORRY OFF THE LIST.\n" +
          "LIKE MUCH OF CENTRAL SAN FRANCISCO, PARTS OF THE NEIGHBORHOOD\n" +
          "DO FALL WITHIN A STATE-DESIGNATED SEISMIC HAZARD ZONE —\n" +
          "THAT'S STANDARD FOR THIS PART OF THE CITY, AND IT'S SOMETHING\n" +
          "EVERY CALIFORNIA BUYER REVIEWS WITH THEIR INSPECTOR AND INSURER.\n" +
          "I PUT THE SEISMIC AND TSUNAMI STATUS RIGHT ON EACH NEIGHBORHOOD'S\n" +
          "DETAILS PAGE, SO YOU CAN CHECK ANY SPECIFIC BLOCK BEFORE YOU WRITE AN OFFER.",
        broll: ["You gesturing to the leafy triangle and the rise to the west", "Edit: the seismic + tsunami toggles on your fog map"],
      },
      {
        label: "7 · DINING, NIGHTLIFE & DAILY LIFE",
        words: 120,
        script:
          "LET'S TALK DAILY LIFE.\n" +
          "DUBOCE TRIANGLE PUTS YOU A BLOCK OFF MARKET STREET\n" +
          "AND STEPS FROM BOTH THE CASTRO AND THE MISSION —\n" +
          "SO YOU'VE GOT CAFÉS, BRUNCH, EASYGOING BARS, AND THE CHURCH STREET CORRIDOR\n" +
          "RIGHT THERE, PLUS THE WHOLE PARK AT YOUR DOORSTEP.\n" +
          "I'M NOT GOING TO NAME SPECIFIC PLACES ON CAMERA, BECAUSE THE LINEUP CHANGES —\n" +
          "AND I NEVER WANT TO SEND YOU SOMEWHERE THAT'S CLOSED.\n" +
          "INSTEAD, I KEEP A CURRENT, HAND-CHECKED LIST OF THE NEIGHBORHOOD'S BEST\n" +
          "RESTAURANTS AND BARS RIGHT ON MY DUBOCE TRIANGLE DETAILS PAGE — ALWAYS UP TO DATE.\n" +
          "THE VIBE TO KNOW: THIS IS A RIGHT-OUTSIDE-YOUR-DOOR, LEAVE-THE-CAR-HOME KIND OF PLACE.",
        broll: ["Café tables along Church St; a restaurant window at dusk", "The park ringed by flats; people relaxing on the meadow", "A relaxed neighborhood bar (general, not a single endorsement)"],
      },
      {
        label: "8 · REAL ESTATE",
        words: 120,
        script:
          "ON HOUSING: DUBOCE TRIANGLE IS CLASSIC SAN FRANCISCO —\n" +
          "A DENSE, INTACT STOCK OF PRE-1906 VICTORIAN AND EDWARDIAN HOMES,\n" +
          "MANY DIVIDED INTO ELEGANT FLATS, PLUS SOME CONDOS AND T-I-C UNITS\n" +
          "NEARER MARKET AND CHURCH.\n" +
          "IT RUNS FROM A FIRST CONDO TO A FULLY RESTORED VICTORIAN SHOWPIECE.\n" +
          "I'M NOT GOING TO QUOTE A MEDIAN PRICE ON CAMERA, BECAUSE THAT NUMBER MOVES.\n" +
          "INSTEAD, I KEEP A LIVE MARKET UPDATE FOR DUBOCE TRIANGLE ON MY SITE —\n" +
          "CURRENT MEDIANS FOR SINGLE-FAMILY HOMES AND FOR CONDOS, RIGHT UP TO TODAY.\n" +
          "THE LINK IS BELOW. THAT'S YOUR SMARTEST FIRST STEP BEFORE YOU EVEN TOUR.",
        broll: ["A painted Victorian, a flats building, a modern condo entry", "A 'For Sale' sign", "Edit: lower-third + screen-record of your live market page"],
      },
      {
        label: "9 · WHO BELONGS HERE + SIGNATURE OUTRO",
        words: 120,
        script:
          "SO — WHO BELONGS IN DUBOCE TRIANGLE?\n" +
          "SOMEONE WHO WANTS A LEAFY, CALM POCKET WITH A PARK AT THE DOOR,\n" +
          "THE CASTRO AND THE MISSION STEPS AWAY, AND THE WHOLE BAY AREA\n" +
          "A TRAIN OR A FERRY AWAY, WITHOUT EVER NEEDING A CAR.\n" +
          "BUT HERE'S THE THING I'VE LEARNED AFTER ALL THESE YEARS:\n" +
          "EVERY NEIGHBORHOOD IN THIS CITY HAS A STORY LIKE THIS ONE,\n" +
          "AND KNOWING THEM ALL IS THE WORK — THE MICROCLIMATES,\n" +
          "THE STREETS THAT HOLD THEIR VALUE, THE THINGS THAT NEVER SHOW UP IN A SEARCH.\n" +
          "ANYTHING THAT CHANGES — PRICES, THE NEWEST RESTAURANT, WHAT'S FOR SALE —\n" +
          "STAYS CURRENT ON MY DUBOCE TRIANGLE NEIGHBORHOOD PAGE, SO THIS GUIDE NEVER GOES STALE.\n" +
          "SO IF YOU'RE THINKING ABOUT CALLING DUBOCE TRIANGLE HOME,\n" +
          "I'D LOVE TO SHOW YOU AROUND AND HELP CREATE YOUR NEXT LIFE ADVENTURE.",
        broll: ["Golden-hour, unhurried pass across Duboce Park (you, relaxed, not pitching)", "A quiet look down a leafy Victorian block", "Soft end card: your name + how to reach you"],
      },
    ],
    schedule: [
      { step: "Scout & lock script", detail: "Take the route, mark the 6–8 B-roll stops, finalize edits to this script.", time: "~45 min (day before)" },
      { step: "Golden-hour B-roll", detail: "Shoot Duboce Park, the dog run, the N-Judah portal, Victorian rows, and housing variety in good light.", time: "30–45 min (early AM or ~1 hr before sunset)" },
      { step: "Talk-to-camera takes", detail: "Shoot each section as its own clip at the relevant spot; 2 takes each; teleprompter on your phone.", time: "60–90 min" },
      { step: "Pickups & cutaways", detail: "Signs, the Duboce Portal, and a screen-record of your live market page (capture at home).", time: "~15 min" },
      { step: "Edit & caption", detail: "Assemble, add lower-thirds (market URL), burned-in captions, light music bed; export.", time: "2–3 hrs" },
      { step: "Publish & link", detail: "Upload to YouTube, paste the market link in the description — then I add the 'Watch the tour' button to the Duboce Triangle page.", time: "~30 min" },
    ],
    batchTip: "Shoot adjacent hoods the same outing — e.g. Duboce Triangle + Castro + Lower Haight in one morning loop.",
  },
"South of Market": {
    aka: "SoMa",
    runtime: "~10 min (8–10 target)",
    marketLink: "https://www.ur4cast.com/listings?nbhd=South%20of%20Market&layer=nbhd",
    detailsLink: "https://www.ur4cast.com/fog (open the Neighborhoods card → South of Market)",
    route: {
      // Route stays ENTIRELY within the South of Market boundary (verified against the
      // neighborhood polygon). Coords approximate — snap to the sidewalk grid for the final cut.
      spots: [
        { n: 1, name: "Yerba Buena Gardens & SFMOMA", note: "Start — the cultural heart: gardens, museums, Moscone right there", coord: [-122.4015, 37.7855] },
        { n: 2, name: "South Park oval", note: "The leafy historic oval — SoMa's little green center", coord: [-122.3958, 37.7807] },
        { n: 3, name: "Folsom & Langton — warehouse-conversion block", note: "The housing-stock segment: brick warehouse and loft conversions", coord: [-122.4080, 37.7760] },
        { n: 4, name: "Caltrain depot — 4th & King", note: "The Peninsula rail terminus, right inside the district", coord: [-122.3969, 37.7769] },
      ],
    },
    sections: [
      {
        label: "COLD OPEN / SIGNATURE INTRO",
        words: 85,
        script:
          "IN SAN FRANCISCO, THE WEATHER CAN CHANGE IN THE SPACE OF A SINGLE BLOCK —\n" +
          "ONE STREET BURIED IN FOG, THE NEXT ONE SITTING IN THE SUN.\n" +
          "AFTER YEARS OF EXPLORING THESE HILLS, I'VE LEARNED THAT THE BEST HOMES\n" +
          "AREN'T FOUND IN A LISTING — THEY'RE IN THE DETAILS YOU ONLY KNOW\n" +
          "ONCE YOU'VE STOOD ON THE CORNER AT DIFFERENT TIMES OF DAY.\n" +
          "RIGHT NOW I'M IN SOMA, AT YERBA BUENA GARDENS, AND THE SUN IS OUT —\n" +
          "WHICH IS ALREADY THE FIRST THING WORTH KNOWING ABOUT THIS PLACE.\n" +
          "SO — ARE YOU READY TO SEE SOMA? LET'S GO.",
        broll: ["Two-shot idea: a foggy ridge in one frame, sunny Yerba Buena Gardens in the next", "You moving through the gardens into frame", "Salesforce Tower / SFMOMA to place us"],
      },
      {
        label: "1 · LOCATION & LAY OF THE LAND",
        words: 195,
        script:
          "FIRST — WHERE ARE WE? SOMA — SOUTH OF MARKET — SPREADS ACROSS THE FLATLANDS\n" +
          "JUST SOUTH OF MARKET STREET, DOWNTOWN-ADJACENT AND RIGHT IN THE THICK OF IT,\n" +
          "WITH THE FINANCIAL DISTRICT TO THE NORTH AND THE BALLPARK AND BAY TO THE EAST.\n" +
          "THIS IS THE CITY'S ENGINE ROOM — MUSEUMS, MOSCONE, TECH TOWERS, AND NIGHTLIFE\n" +
          "SPREAD ACROSS A BROAD GRID OF FORMER WAREHOUSE BLOCKS.\n" +
          "HERE'S THE HEADLINE: THIS PLACE IS FLAT.\n" +
          "ELEVATION RUNS FROM ABOUT ZERO TO SIXTY FEET, AND THE CORE IS LEVEL,\n" +
          "RIGHT DOWN NEAR SEA LEVEL — ONE OF THE MOST STEP-FREE DISTRICTS IN THE CITY.\n" +
          "IT'S GENUINELY EASY TO GET AROUND — FRIENDLY WHETHER YOU'RE\n" +
          "PUSHING A STROLLER OR ROLLING A WHEELCHAIR,\n" +
          "WELL WITHIN WHAT THE A-D-A CONSIDERS AN ACCESSIBLE GRADE — ABOUT FIVE PERCENT.\n" +
          "THIS IS ONE OF THE MOST LEVEL, MOST STEP-FREE NEIGHBORHOODS YOU'LL FIND IN SAN FRANCISCO.\n" +
          "THAT SAID, THE HOMES THEMSELVES STILL VARY —\n" +
          "SOME LOFT AND CONDO ENTRIES SIT UP A FLIGHT OR BEHIND A SECURED LOBBY,\n" +
          "SO IF STEP-FREE ENTRY IS A MUST, IT'S WORTH CHECKING HOME BY HOME.\n" +
          "BUT AS A NEIGHBORHOOD TO MOVE THROUGH? FLAT, LEVEL, AND EASY.",
        broll: ["Slow pan down a flat SoMa block; level sidewalks", "Wide establishing shot: the grid, the towers, Market St beyond", "Someone with a stroller or on a bike on the level grid"],
      },
      {
        label: "2 · HISTORY",
        words: 200,
        script:
          "NOW THE STORY. SOMA WAS THE CITY'S INDUSTRIAL AND WORKING-CLASS HEART\n" +
          "FROM THE GOLD RUSH ON — RAIL YARDS, FACTORIES,\n" +
          "AND LABORERS' ROOMING HOUSES IN THE AREA ONCE CALLED 'SOUTH OF THE SLOT.'\n" +
          "ALL OF THIS WAS THE ANCESTRAL LAND OF THE RAMAYTUSH OHLONE LONG BEFORE THAT.\n" +
          "THAT NICKNAME CAME FROM THE CABLE-CAR SLOT DOWN MARKET STREET,\n" +
          "WHICH DIVIDED THE WORKING-CLASS, INDUSTRIAL SOUTH SIDE\n" +
          "FROM THE WHITE-COLLAR NORTH.\n" +
          "THEN CAME THE BREAKS. THE 1906 EARTHQUAKE AND FIRE HIT SOMA HARD,\n" +
          "AND IT WAS REBORN IN STAGES OVER THE DECADES THAT FOLLOWED —\n" +
          "MOSCONE CENTER, YERBA BUENA GARDENS, SFMOMA, AND THE BALLPARK\n" +
          "EACH REMADE A PIECE OF THESE BLOCKS.\n" +
          "THEN CAME THE BIGGEST TURN OF ALL:\n" +
          "THE 2000s AND 2010s TECH BOOM PLANTED HEADQUARTERS ACROSS SOMA\n" +
          "AND RAISED A SKYLINE OF HIGH-RISES WHERE WAREHOUSES ONCE STOOD.\n" +
          "SO WHEN YOU SPEND TIME ON THESE STREETS, REMEMBER —\n" +
          "YOU'RE STANDING IN THE PART OF SAN FRANCISCO THAT KEEPS REINVENTING ITSELF,\n" +
          "WORKING WATERFRONT TO MUSEUM DISTRICT TO TECH CAPITAL, ALL ON THE SAME GRID.",
        broll: ["Brick warehouse facades on the inner blocks", "Moscone / Yerba Buena / SFMOMA exteriors", "Salesforce Tower against the skyline"],
      },
      {
        label: "3 · HIDDEN FACTS",
        words: 160,
        script:
          "HERE'S WHAT MOST PEOPLE DON'T KNOW.\n" +
          "THE NEIGHBORHOOD'S OLD NICKNAME — 'SOUTH OF THE SLOT' —\n" +
          "WASN'T ABOUT A PLACE, IT WAS ABOUT A LINE: THE CABLE-CAR SLOT IN MARKET STREET\n" +
          "THAT SPLIT THE WORKING CITY FROM THE WHITE-COLLAR ONE.\n" +
          "TODAY YERBA BUENA GARDENS AND SFMOMA ANCHOR A DENSE CULTURAL QUARTER —\n" +
          "AND SFMOMA, FOUNDED IN 1935 AND REBUILT IN 2016,\n" +
          "IS ONE OF THE LARGEST MODERN-ART MUSEUMS IN THE WHOLE COUNTRY.\n" +
          "LOOK UP AND YOU'LL SEE SALESFORCE TOWER —\n" +
          "FINISHED IN 2018 AT ONE THOUSAND SEVENTY FEET,\n" +
          "THE TALLEST BUILDING IN SAN FRANCISCO.\n" +
          "AND TUCKED INTO THE MIDDLE OF IT ALL IS SOUTH PARK,\n" +
          "A LEAFY OVAL LAID OUT IN THE 1850s — ONE OF THE OLDEST PARKS IN THE CITY.\n" +
          "THIS IS A NEIGHBORHOOD WHERE A MUSEUM, A SKYSCRAPER, AND A GOLD-RUSH PARK\n" +
          "ALL SHARE THE SAME FEW BLOCKS.",
        broll: ["SFMOMA exterior / a gallery interior", "Salesforce Tower from street level", "The South Park oval and its benches"],
      },
      {
        label: "4 · MICROCLIMATE",
        words: 95,
        script:
          "QUICK WORD ON WEATHER — BECAUSE IN SAN FRANCISCO, MICROCLIMATE IS EVERYTHING.\n" +
          "SOMA IS ONE OF THE BRIGHTER, SUNNIER POCKETS OF THE CITY —\n" +
          "DOWN ON THE FLATLANDS, IT CATCHES A LOT OF SUN.\n" +
          "BUT IT SITS LOW AND OPEN NEAR THE BAY, SO IT CAN BE BREEZY,\n" +
          "AND THE AFTERNOON WIND FUNNELS RIGHT DOWN THESE WIDE STREETS.\n" +
          "BRING A LAYER FOR A LATE-DAY STROLL, EVEN ON A SUNNY ONE.\n" +
          "I KEEP A LIVE FOG MAP THAT SHOWS THIS NEIGHBORHOOD'S EXACT SUMMER-FOG HOURS\n" +
          "VERSUS THE FOGGY WEST SIDE — IT'S LINKED ON MY SOMA PAGE BELOW.",
        broll: ["Blue sky over a SoMa block; you in shirtsleeves", "Afternoon wind down a wide street: flags, awnings", "Edit: screen-cap of the Ur4cast fog map"],
      },
      {
        label: "5 · GETTING AROUND — CAR-FREE",
        words: 290,
        script:
          "NOW THE PART THAT REALLY MATTERS IF YOU'RE BUYING HERE:\n" +
          "HOW YOU GET AROUND. AND SOMA IS THE TRANSIT HUB OF THE ENTIRE CITY —\n" +
          "IT'S ABOUT AS EASY AS IT GETS TO LIVE HERE WITHOUT A CAR.\n" +
          "POWELL AND MONTGOMERY STATIONS PUT BART AND MUNI METRO RIGHT UNDER MARKET STREET,\n" +
          "THE NEW CENTRAL SUBWAY RUNS THE T-LINE UNDER 4TH STREET TO CHINATOWN,\n" +
          "AND CALTRAIN TO THE PENINSULA TERMINATES AT 4TH AND KING — RIGHT HERE IN THE DISTRICT.\n" +
          "ON TOP OF THAT, A WHOLE WEB OF BUS LINES THREADS THE GRID.\n" +
          "NOW LET'S LEAVE THE CITY — CAR-FREE.\n" +
          "THE FERRY BUILDING IS ONLY ABOUT A MILE AND A HALF NORTHEAST —\n" +
          "VERY CLOSE, A SHORT MUNI RIDE OR AN EASY ROLL — AND THAT'S YOUR GATEWAY TO THE WATER.\n" +
          "GOING TO THE EAST BAY? HOP BART RIGHT HERE —\n" +
          "DOWNTOWN OAKLAND IS ABOUT FIFTEEN TO TWENTY MINUTES,\n" +
          "OR BY CAR THE BAY BRIDGE IS LITERALLY OVERHEAD.\n" +
          "HEADING NORTH TO MARIN? TAKE THE LARKSPUR FERRY FROM THE FERRY BUILDING\n" +
          "AND CROSS IN ABOUT THIRTY MINUTES ON THE WATER —\n" +
          "OR DRIVE THE GOLDEN GATE BRIDGE.\n" +
          "HEADING SOUTH TO THE PENINSULA? HERE'S THE STANDOUT:\n" +
          "CALTRAIN LEAVES FROM 4TH AND KING IN THE DISTRICT ITSELF\n" +
          "AND RUNS DOWN TO PALO ALTO IN ABOUT FIFTY MINUTES —\n" +
          "OR IT'S 280 OR 101 BY CAR.\n" +
          "BOTTOM LINE: BART, MUNI METRO, THE CENTRAL SUBWAY, CALTRAIN, AND A FERRY —\n" +
          "ALL RIGHT HERE, ALL WITHOUT OWNING A CAR.",
        broll: [
          "Powell or Montgomery Station entrance; a Central Subway T-line train",
          "The Ferry Building / a departing ferry",
          "A BART train; the Bay Bridge; the Golden Gate Bridge; the Caltrain depot at 4th & King",
          "Simple motion-graphic map: SoMa → Oakland / Larkspur / Palo Alto with the times",
        ],
      },
      {
        label: "6 · THE GROUND UNDER YOU (HAZARDS)",
        words: 110,
        script:
          "NOW TWO HONEST NOTES ON THE GROUND ITSELF — AND I MEAN HONEST.\n" +
          "MUCH OF SOMA IS BUILT ON BAY FILL AND MADE GROUND —\n" +
          "FILLED CREEK BEDS AND OLD MARSH — AND THAT MATTERS.\n" +
          "IT FALLS WITHIN A STATE-DESIGNATED SEISMIC HAZARD ZONE FOR LIQUEFACTION,\n" +
          "THE SAME SOFT GROUND THAT SHOOK HARD IN BOTH 1906 AND 1989.\n" +
          "AND BECAUSE THE BAYWARD EDGE SITS LOW BY THE WATER, IT'S ALSO IN A\n" +
          "TSUNAMI HAZARD AND EVACUATION ZONE.\n" +
          "NONE OF THAT IS A DEAL-BREAKER — IT'S A REASON TO GO IN INFORMED:\n" +
          "REVIEW THE SOILS, ASK ABOUT SEISMIC RETROFITS, AND PRICE IN INSURANCE.\n" +
          "I PUT THE SEISMIC AND TSUNAMI STATUS RIGHT ON EACH NEIGHBORHOOD'S DETAILS PAGE,\n" +
          "ALONGSIDE THE CITY'S OWN RESOURCES, SO YOU CAN CHECK ANY BLOCK BEFORE YOU WRITE AN OFFER.",
        broll: ["You gesturing to the flat, low ground", "Edit: the seismic + tsunami toggles on your fog map", "A retrofit / soft-story note card if you have one"],
      },
      {
        label: "7 · DINING, NIGHTLIFE & DAILY LIFE",
        words: 120,
        script:
          "LET'S TALK DAILY LIFE.\n" +
          "SOMA RUNS THE FULL RANGE — DIM SUM AND DELIS, PIZZA AND COCKTAIL ROOMS,\n" +
          "PLUS SOME OF THE CITY'S BEST-KNOWN NIGHTLIFE AND WAREHOUSE CLUBS.\n" +
          "AND THE MUSEUMS, MOSCONE, AND THE BALLPARK ARE ALL RIGHT IN THE MIX.\n" +
          "I'M NOT GOING TO NAME SPECIFIC PLACES ON CAMERA, BECAUSE THE LINEUP CHANGES —\n" +
          "AND I NEVER WANT TO SEND YOU SOMEWHERE THAT'S CLOSED.\n" +
          "INSTEAD, I KEEP A CURRENT, HAND-CHECKED LIST OF THE NEIGHBORHOOD'S BEST\n" +
          "RESTAURANTS AND BARS RIGHT ON MY SOMA DETAILS PAGE — ALWAYS UP TO DATE.\n" +
          "THE VIBE TO KNOW: THIS IS A RIGHT-OUTSIDE-YOUR-DOOR, LEAVE-THE-CAR-HOME KIND OF PLACE.",
        broll: ["Café tables; a busy restaurant window at dusk", "Yerba Buena Gardens / the ballpark crowd", "A general nightlife sidewalk shot (no single endorsement)"],
      },
      {
        label: "8 · REAL ESTATE",
        words: 120,
        script:
          "ON HOUSING: SOMA IS THE CITY'S LOFT-AND-TOWER DISTRICT —\n" +
          "BRICK WAREHOUSE AND LIVE-WORK CONVERSIONS, MID-RISE CONDOS,\n" +
          "AND GLASSY HIGH-RISE TOWERS WITH SKYLINE AND BAY VIEWS.\n" +
          "IT RUNS FROM A FIRST CONDO TO A FULL HIGH-FLOOR TOWER UNIT WITH A VIEW.\n" +
          "I'M NOT GOING TO QUOTE A MEDIAN PRICE ON CAMERA, BECAUSE THAT NUMBER MOVES.\n" +
          "INSTEAD, I KEEP A LIVE MARKET UPDATE FOR SOMA ON MY SITE —\n" +
          "CURRENT MEDIANS FOR SINGLE-FAMILY HOMES AND FOR CONDOS, RIGHT UP TO TODAY.\n" +
          "THE LINK IS BELOW. THAT'S YOUR SMARTEST FIRST STEP BEFORE YOU EVEN TOUR.",
        broll: ["A brick loft conversion, a mid-rise condo, a glass high-rise entry", "A 'For Sale' sign", "Edit: lower-third + screen-record of your live market page"],
      },
      {
        label: "9 · WHO BELONGS HERE + SIGNATURE OUTRO",
        words: 120,
        script:
          "SO — WHO BELONGS IN SOMA?\n" +
          "SOMEONE WHO WANTS LEVEL STREETS, MUSEUMS AND THE BALLPARK AT THE DOORSTEP,\n" +
          "AND THE WHOLE BAY AREA A TRAIN OR A FERRY AWAY, WITHOUT EVER NEEDING A CAR,\n" +
          "WHO'S CLEAR-EYED ABOUT THE FILL UNDERFOOT AND GOES IN INFORMED.\n" +
          "BUT HERE'S THE THING I'VE LEARNED AFTER ALL THESE YEARS:\n" +
          "EVERY NEIGHBORHOOD IN THIS CITY HAS A STORY LIKE THIS ONE,\n" +
          "AND KNOWING THEM ALL IS THE WORK — THE MICROCLIMATES,\n" +
          "THE STREETS THAT HOLD THEIR VALUE, THE THINGS THAT NEVER SHOW UP IN A SEARCH.\n" +
          "ANYTHING THAT CHANGES — PRICES, THE NEWEST RESTAURANT, WHAT'S FOR SALE —\n" +
          "STAYS CURRENT ON MY SOUTH OF MARKET NEIGHBORHOOD PAGE, SO THIS GUIDE NEVER GOES STALE.\n" +
          "SO IF YOU'RE THINKING ABOUT CALLING SOMA HOME,\n" +
          "I'D LOVE TO SHOW YOU AROUND AND HELP CREATE YOUR NEXT LIFE ADVENTURE.",
        broll: ["Golden-hour, unhurried pass through Yerba Buena Gardens (you, relaxed, not pitching)", "A quiet look up at the towers against the sky", "Soft end card: your name + how to reach you"],
      },
    ],
    schedule: [
      { step: "Scout & lock script", detail: "Take the route, mark the 6–8 B-roll stops, finalize edits to this script.", time: "~45 min (day before)" },
      { step: "Golden-hour B-roll", detail: "Shoot Yerba Buena Gardens, SFMOMA, South Park, the Caltrain depot, street life, and housing variety in good light.", time: "30–45 min (early AM or ~1 hr before sunset)" },
      { step: "Talk-to-camera takes", detail: "Shoot each section as its own clip at the relevant spot; 2 takes each; teleprompter on your phone.", time: "60–90 min" },
      { step: "Pickups & cutaways", detail: "Signs, a station entrance, and a screen-record of your live market page (capture at home).", time: "~15 min" },
      { step: "Edit & caption", detail: "Assemble, add lower-thirds (market URL), burned-in captions, light music bed; export.", time: "2–3 hrs" },
      { step: "Publish & link", detail: "Upload to YouTube, paste the market link in the description — then I add the 'Watch the tour' button to the South of Market page.", time: "~30 min" },
    ],
    batchTip: "Shoot adjacent hoods the same outing — e.g. South of Market + Rincon Hill + South Beach in one morning loop.",
  },
};
