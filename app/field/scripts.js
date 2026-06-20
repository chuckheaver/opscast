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
"Presidio Heights": {
    aka: "Presidio Terrace area",
    runtime: "~10 min (8–10 target)",
    marketLink: "https://www.ur4cast.com/listings?nbhd=Presidio%20Heights&layer=nbhd",
    detailsLink: "https://www.ur4cast.com/fog (open the Neighborhoods card → Presidio Heights)",
    route: {
      // Route stays ENTIRELY within the Presidio Heights boundary (verified against the
      // neighborhood polygon). Coords approximate — snap to the sidewalk grid for the final cut.
      spots: [
        { n: 1, name: "Sacramento St boutique strip", note: "Start — the discreet, upscale shopping-and-dining spine, sun out", coord: [-122.4520, 37.7884] },
        { n: 2, name: "Spruce & Locust — mansion blocks", note: "The housing-stock segment: grand, tree-lined estate streets", coord: [-122.4540, 37.7895] },
        { n: 3, name: "Temple Emanu-El edge", note: "The red-tiled landmark dome anchoring the neighborhood's skyline", coord: [-122.4567, 37.7882] },
        { n: 4, name: "Presidio Gate / Julius Kahn playground edge", note: "Where the neighborhood steps almost directly into the Presidio greenbelt", coord: [-122.4556, 37.7898] },
        { n: 5, name: "Walnut & California — leafy residential", note: "Quiet north-side blocks, classic flats and single-family homes", coord: [-122.4505, 37.7878] },
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
          "RIGHT NOW I'M ON SACRAMENTO STREET, AND THE SUN IS OUT —\n" +
          "WHICH IS ALREADY THE FIRST THING WORTH KNOWING ABOUT THIS PLACE.\n" +
          "SO — ARE YOU READY TO SEE PRESIDIO HEIGHTS? LET'S GO.",
        broll: ["Two-shot idea: a foggy ridge in one frame, sunny Sacramento St in the next", "You moving up Sacramento St into frame", "A grand tree-lined mansion block to place us"],
      },
      {
        label: "1 · LOCATION & LAY OF THE LAND",
        words: 195,
        script:
          "FIRST — WHERE ARE WE? PRESIDIO HEIGHTS SITS ON THE CITY'S NORTH SIDE,\n" +
          "ON HIGH GROUND RIGHT BESIDE THE PRESIDIO,\n" +
          "WITH PACIFIC HEIGHTS TO THE EAST, LAUREL HEIGHTS JUST SOUTH,\n" +
          "AND THE RICHMOND OPENING UP TO THE WEST.\n" +
          "THE MAIN SPINE IS SACRAMENTO STREET, A DISCREET, UPSCALE\n" +
          "SHOPPING-AND-DINING STRIP RUNNING THROUGH A HUSHED, LEAFY ENCLAVE.\n" +
          "THE LAND HERE RUNS FROM ABOUT 180 FEET UP TO AROUND 370 FEET,\n" +
          "BUT IT SITS HIGH AND FAIRLY LEVEL — THE CORE IS FLAT AND EASY TO GET AROUND,\n" +
          "FRIENDLY WHETHER YOU'RE PUSHING A STROLLER OR ROLLING A WHEELCHAIR,\n" +
          "WELL WITHIN WHAT THE A-D-A CONSIDERS AN ACCESSIBLE GRADE — ABOUT FIVE PERCENT.\n" +
          "THIS IS ONE OF THE MORE STEP-FREE NEIGHBORHOODS YOU'LL FIND ON THE NORTH SIDE.\n" +
          "THAT SAID, THE HOMES THEMSELVES STILL VARY —\n" +
          "MANY OF THESE GRAND HOUSES SIT UP A FLIGHT OF STAIRS FROM THE SIDEWALK,\n" +
          "SO IF STEP-FREE ENTRY IS A MUST, IT'S WORTH CHECKING HOME BY HOME.\n" +
          "BUT AS A NEIGHBORHOOD TO MOVE THROUGH? HIGH, LEVEL, AND EASY.",
        broll: ["Slow pan up Sacramento St; street signs at Sacramento & Spruce", "Wide establishing shot showing the leafy blocks + the Presidio treeline", "A genuinely grand mansion frontage on a level street"],
      },
      {
        label: "2 · HISTORY",
        words: 200,
        script:
          "NOW THE STORY. PRESIDIO HEIGHTS TAKES ITS NAME FROM ITS PERCH\n" +
          "ON THE HIGH GROUND BESIDE THE PRESIDIO ARMY POST.\n" +
          "ALL OF THIS WAS THE ANCESTRAL LAND OF THE RAMAYTUSH OHLONE LONG BEFORE THAT.\n" +
          "THE DISTRICT FILLED IN DURING THE EARLY 1900s,\n" +
          "AND IT REALLY TOOK OFF AFTER THE 1906 EARTHQUAKE AND FIRE,\n" +
          "AS PROSPEROUS FAMILIES REBUILT WEST OF THE RUINED DOWNTOWN.\n" +
          "ITS CENTERPIECE IS PRESIDIO TERRACE — A MASTER-PLANNED COMMUNITY\n" +
          "BEGUN IN 1905 BY THE DEVELOPERS BALDWIN AND HOWELL,\n" +
          "THIRTY-SIX LOTS RINGING A SINGLE PRIVATE OVAL STREET.\n" +
          "IT WAS AMONG THE FIRST DEVELOPMENTS IN THE CITY WITH UNDERGROUND UTILITIES\n" +
          "AND ELECTRIC STREET LIGHTS — UNUSUAL LUXURIES FOR THE EARLY 1900s.\n" +
          "FOR OVER A CENTURY THIS HAS BEEN A PLACE WHERE OLD SAN FRANCISCO MONEY\n" +
          "LIVES QUIETLY, IN GRAND MANSIONS ON TREE-LINED STREETS,\n" +
          "JUST A STEP FROM THE PRESIDIO'S FORESTS.\n" +
          "SO WHEN YOU SPEND TIME ON THESE BLOCKS, REMEMBER —\n" +
          "YOU'RE EXPLORING ONE OF THE CITY'S MOST INTACT EARLY-1900s ENCLAVES,\n" +
          "A QUIET CORNER THAT WAS BUILT TO LAST AND LARGELY HAS.",
        broll: ["Grand mansion facades on Spruce and Locust", "The gated entrance to Presidio Terrace's private oval", "Wide shot of an unbroken row of estate homes"],
      },
      {
        label: "3 · HIDDEN FACTS",
        words: 160,
        script:
          "HERE'S WHAT MOST PEOPLE DON'T KNOW.\n" +
          "PRESIDIO TERRACE IS A SINGLE CIRCULAR PRIVATE STREET RINGED BY MANSIONS —\n" +
          "AND IN 2015 A SAN JOSE COUPLE ACTUALLY BOUGHT THAT STREET\n" +
          "AT A CITY TAX AUCTION FOR ABOUT NINETY THOUSAND DOLLARS,\n" +
          "AFTER THE HOMEOWNERS LEFT A SMALL ANNUAL TAX BILL UNPAID FOR YEARS.\n" +
          "THE CITY LATER VOTED TO REVERSE THE SALE.\n" +
          "THE NEIGHBORHOOD'S SKYLINE IS ANCHORED BY CONGREGATION EMANU-EL,\n" +
          "COMPLETED IN 1926 — ITS MASSIVE RED-TILED DOME WAS INSPIRED\n" +
          "BY ISTANBUL'S HAGIA SOPHIA, AND IT'S A CITY LANDMARK.\n" +
          "AND FOR SUCH A QUIET RESIDENTIAL DISTRICT, THE DINING IS SERIOUS —\n" +
          "A FEW LOW-KEY SACRAMENTO STREET BLOCKS HAVE DRAWN MICHELIN RECOGNITION,\n" +
          "PULLING DINERS FROM ACROSS THE CITY.\n" +
          "THIS IS A NEIGHBORHOOD THAT KEEPS ITS BIGGEST STORIES BEHIND A HEDGE.",
        broll: ["The Presidio Terrace gate / private oval", "Temple Emanu-El's red-tiled dome", "Sacramento St storefronts at a quiet hour"],
      },
      {
        label: "4 · MICROCLIMATE",
        words: 95,
        script:
          "QUICK WORD ON WEATHER — BECAUSE IN SAN FRANCISCO, MICROCLIMATE IS EVERYTHING.\n" +
          "PRESIDIO HEIGHTS IS A BRIGHT, LEAFY NORTH-SIDE POCKET\n" +
          "THAT CATCHES A GOOD DEAL OF SUN — PART OF WHY IT'S SO PRIZED.\n" +
          "BUT IT SITS RIGHT ALONG THE PRESIDIO, SO IT CAN RUN BREEZY AND A TOUCH COOLER\n" +
          "NEAR THAT GREEN EDGE WHEN THE OCEAN AIR DRIFTS THROUGH THE TREES.\n" +
          "BRING A LIGHT LAYER FOR THE NORTHERN BLOCKS, EVEN ON A SUNNY DAY.\n" +
          "I KEEP A LIVE FOG MAP THAT SHOWS THIS NEIGHBORHOOD'S EXACT SUMMER-FOG HOURS\n" +
          "VERSUS THE FOGGY WEST SIDE — IT'S LINKED ON MY PRESIDIO HEIGHTS PAGE BELOW.",
        broll: ["Blue sky over Sacramento St; you in shirtsleeves", "Breeze in the Presidio treeline at the neighborhood's edge", "Edit: screen-cap of the Ur4cast fog map"],
      },
      {
        label: "5 · GETTING AROUND — CAR-FREE",
        words: 290,
        script:
          "NOW THE PART THAT REALLY MATTERS IF YOU'RE BUYING HERE:\n" +
          "HOW YOU GET AROUND. THERE'S NO MUNI METRO IN PRESIDIO HEIGHTS —\n" +
          "IT'S A BUS NEIGHBORHOOD, AND A WELL-CONNECTED ONE.\n" +
          "THE 1 CALIFORNIA IS THE WORKHORSE, RUNNING ALONG SACRAMENTO AND CALIFORNIA\n" +
          "EAST STRAIGHT TO DOWNTOWN AND WEST TOWARD THE RICHMOND.\n" +
          "THE 33 ASHBURY AND 43 MASONIC ADD NORTH-SOUTH LINES VIA PRESIDIO AVENUE,\n" +
          "AND THE 3 JACKSON THREADS THROUGH TOWARD THE EAST.\n" +
          "THE NEAREST BART IS A TRANSFER DOWNTOWN, NOT A STATION YOU CAN SEE FROM HERE.\n" +
          "NOW LET'S LEAVE THE CITY — CAR-FREE.\n" +
          "THE FERRY BUILDING IS ABOUT THREE MILES EAST,\n" +
          "A 1 CALIFORNIA RIDE AWAY, AND THAT'S YOUR GATEWAY TO THE WATER.\n" +
          "GOING TO THE EAST BAY? FROM DOWNTOWN, HOP BART —\n" +
          "OAKLAND IS ABOUT THIRTY TO THIRTY-FIVE MINUTES,\n" +
          "OR BY CAR THE BAY BRIDGE GETS YOU THERE TOO.\n" +
          "HEADING NORTH TO MARIN? YOU'RE RIGHT BY THE PRESIDIO AND THE GOLDEN GATE BRIDGE —\n" +
          "IT'S ABOUT A TWENTY TO TWENTY-FIVE MINUTE DRIVE TO LARKSPUR,\n" +
          "OR TAKE THE LARKSPUR FERRY FROM THE FERRY BUILDING AND CROSS ON THE WATER\n" +
          "IN ABOUT THIRTY MINUTES.\n" +
          "HEADING SOUTH TO THE PENINSULA? TAKE MUNI TO THE CALTRAIN DEPOT\n" +
          "AT 4TH AND KING, AND CALTRAIN RUNS DOWN TO PALO ALTO IN ABOUT FIFTY MINUTES —\n" +
          "OR IT'S 280 OR 101 BY CAR.\n" +
          "BOTTOM LINE: BUSES TO DOWNTOWN, A FERRY ACROSS THE BAY,\n" +
          "AND THE GOLDEN GATE BRIDGE RIGHT THERE — ALL WITHOUT OWNING A CAR.",
        broll: [
          "A 1 California trolleybus on Sacramento St",
          "The Ferry Building / a departing ferry",
          "A BART train; the Bay Bridge; the Golden Gate Bridge; a Caltrain at 4th & King",
          "Simple motion-graphic map: Presidio Heights → Oakland / Larkspur / Palo Alto with the times",
        ],
      },
      {
        label: "6 · THE GROUND UNDER YOU (HAZARDS)",
        words: 110,
        script:
          "TWO QUICK, HONEST NOTES ON THE GROUND ITSELF.\n" +
          "GOOD NEWS FIRST: PRESIDIO HEIGHTS SITS HIGH AND INLAND, WELL ABOVE THE BAY,\n" +
          "SO IT IS NOT IN A TSUNAMI HAZARD ZONE — CROSS THAT WORRY OFF THE LIST.\n" +
          "AND HERE'S MORE GOOD NEWS: UNLIKE MUCH OF THE CITY,\n" +
          "THIS NEIGHBORHOOD IS NOT MAPPED WITHIN A STATE-DESIGNATED SEISMIC HAZARD ZONE,\n" +
          "WHICH IS PART OF WHAT'S MADE ITS GROUND SO STABLE OVER THE DECADES.\n" +
          "OF COURSE, THIS IS STILL CALIFORNIA, AND EVERY BUYER SHOULD\n" +
          "REVIEW THE REPORTS WITH THEIR INSPECTOR AND INSURER.\n" +
          "I PUT THE SEISMIC AND TSUNAMI STATUS RIGHT ON EACH NEIGHBORHOOD'S\n" +
          "DETAILS PAGE, SO YOU CAN CHECK ANY SPECIFIC BLOCK BEFORE YOU WRITE AN OFFER.",
        broll: ["You gesturing to the high, level ground", "Edit: the seismic + tsunami toggles on your fog map"],
      },
      {
        label: "7 · DINING, NIGHTLIFE & DAILY LIFE",
        words: 120,
        script:
          "LET'S TALK DAILY LIFE.\n" +
          "SACRAMENTO STREET IS THE QUIET HEART OF IT —\n" +
          "A DISCREET, UPSCALE STRIP OF BOUTIQUES, CAFES, AND A FEW SERIOUS KITCHENS,\n" +
          "INCLUDING SOME OF THE MOST CELEBRATED DINING ON THE NORTH SIDE.\n" +
          "AND THE PRESIDIO IS RIGHT THERE — FOREST, TRAILS, AND BAY OVERLOOKS\n" +
          "AS A VAST GREEN BACKYARD.\n" +
          "I'M NOT GOING TO NAME SPECIFIC PLACES ON CAMERA, BECAUSE THE LINEUP CHANGES —\n" +
          "AND I NEVER WANT TO SEND YOU SOMEWHERE THAT'S CLOSED.\n" +
          "INSTEAD, I KEEP A CURRENT, HAND-CHECKED LIST OF THE NEIGHBORHOOD'S BEST\n" +
          "RESTAURANTS AND BARS RIGHT ON MY PRESIDIO HEIGHTS DETAILS PAGE — ALWAYS UP TO DATE.\n" +
          "THE VIBE TO KNOW: THIS IS A QUIET, LEAVE-THE-CAR-HOME, GREEN-AT-YOUR-DOOR KIND OF PLACE.",
        broll: ["Sacramento St boutique windows; a calm cafe front", "The Presidio treeline / a trailhead at the edge", "A low-key upscale storefront (general, not a single endorsement)"],
      },
      {
        label: "8 · REAL ESTATE",
        words: 120,
        script:
          "ON HOUSING: PRESIDIO HEIGHTS IS CLASSIC NORTH-SIDE SAN FRANCISCO —\n" +
          "GRAND EARLY-1900s MANSIONS AND ESTATE HOMES, ELEGANT FLATS,\n" +
          "AND SINGLE-FAMILY HOUSES ON QUIET, TREE-LINED STREETS,\n" +
          "WITH SOME CONDOS NEARER THE SACRAMENTO STREET STRIP.\n" +
          "IT RUNS FROM A REFINED CONDO TO A FULLY RESTORED LANDMARK MANSION.\n" +
          "I'M NOT GOING TO QUOTE A MEDIAN PRICE ON CAMERA, BECAUSE THAT NUMBER MOVES.\n" +
          "INSTEAD, I KEEP A LIVE MARKET UPDATE FOR PRESIDIO HEIGHTS ON MY SITE —\n" +
          "CURRENT MEDIANS FOR SINGLE-FAMILY HOMES AND FOR CONDOS, RIGHT UP TO TODAY.\n" +
          "THE LINK IS BELOW. THAT'S YOUR SMARTEST FIRST STEP BEFORE YOU EVEN TOUR.",
        broll: ["A grand mansion, an elegant flats building, a refined condo entry", "A 'For Sale' sign", "Edit: lower-third + screen-record of your live market page"],
      },
      {
        label: "9 · WHO BELONGS HERE + SIGNATURE OUTRO",
        words: 120,
        script:
          "SO — WHO BELONGS IN PRESIDIO HEIGHTS?\n" +
          "SOMEONE WHO WANTS QUIET, LEAFY, LEVEL STREETS, A DISCREET MAIN STREET,\n" +
          "AND THE PRESIDIO AS A GREEN BACKYARD — WITH THE WHOLE BAY AREA\n" +
          "A BUS, A TRAIN, OR A FERRY AWAY, AND NEVER NEEDING A CAR.\n" +
          "BUT HERE'S THE THING I'VE LEARNED AFTER ALL THESE YEARS:\n" +
          "EVERY NEIGHBORHOOD IN THIS CITY HAS A STORY LIKE THIS ONE,\n" +
          "AND KNOWING THEM ALL IS THE WORK — THE MICROCLIMATES,\n" +
          "THE STREETS THAT HOLD THEIR VALUE, THE THINGS THAT NEVER SHOW UP IN A SEARCH.\n" +
          "ANYTHING THAT CHANGES — PRICES, THE NEWEST RESTAURANT, WHAT'S FOR SALE —\n" +
          "STAYS CURRENT ON MY PRESIDIO HEIGHTS NEIGHBORHOOD PAGE, SO THIS GUIDE NEVER GOES STALE.\n" +
          "SO IF YOU'RE THINKING ABOUT CALLING PRESIDIO HEIGHTS HOME,\n" +
          "I'D LOVE TO SHOW YOU AROUND AND HELP CREATE YOUR NEXT LIFE ADVENTURE.",
        broll: ["Golden-hour, unhurried pass down Sacramento St (you, relaxed, not pitching)", "A quiet look toward the Presidio treeline", "Soft end card: your name + how to reach you"],
      },
    ],
    schedule: [
      { step: "Scout & lock script", detail: "Take the route, mark the 6–8 B-roll stops, finalize edits to this script.", time: "~45 min (day before)" },
      { step: "Golden-hour B-roll", detail: "Shoot the Sacramento St strip, mansion blocks, Temple Emanu-El's dome, the Presidio edge, and housing variety in good light.", time: "30–45 min (early AM or ~1 hr before sunset)" },
      { step: "Talk-to-camera takes", detail: "Shoot each section as its own clip at the relevant spot; 2 takes each; teleprompter on your phone.", time: "60–90 min" },
      { step: "Pickups & cutaways", detail: "Signs, a 1 California bus, and a screen-record of your live market page (capture at home).", time: "~15 min" },
      { step: "Edit & caption", detail: "Assemble, add lower-thirds (market URL), burned-in captions, light music bed; export.", time: "2–3 hrs" },
      { step: "Publish & link", detail: "Upload to YouTube, paste the market link in the description — then I add the 'Watch the tour' button to the Presidio Heights page.", time: "~30 min" },
    ],
    batchTip: "Shoot adjacent hoods the same outing — e.g. Presidio Heights + Laurel Heights + Pacific Heights in one morning loop.",
  },
"Telegraph Hill": {
    aka: "Goat Hill",
    runtime: "~10 min (8–10 target)",
    marketLink: "https://www.ur4cast.com/listings?nbhd=Telegraph%20Hill&layer=nbhd",
    detailsLink: "https://www.ur4cast.com/fog (open the Neighborhoods card → Telegraph Hill)",
    route: {
      // Route stays ENTIRELY within the Telegraph Hill boundary (verified against the
      // neighborhood polygon). Coords approximate — snap to the sidewalk grid for the final cut.
      spots: [
        { n: 1, name: "Coit Tower & Pioneer Park", note: "Start — the hilltop crown, 360° views over the bay", coord: [-122.4058, 37.8024] },
        { n: 2, name: "Top of the Greenwich Steps", note: "Where the garden stairway begins its drop down the eastern cliff", coord: [-122.4047, 37.8021] },
        { n: 3, name: "Top of the Filbert Steps", note: "The signature garden stair street — Grace Marchant's gardens", coord: [-122.4046, 37.8015] },
        { n: 4, name: "Montgomery Street — leafy residential lane", note: "A quiet, tree-lined stretch of hillside homes", coord: [-122.4051, 37.8010] },
        { n: 5, name: "Pioneer Park bay overlook", note: "Viewpoint over the Embarcadero, the bay, and the bridges", coord: [-122.4061, 37.8027] },
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
          "RIGHT NOW I'M BELOW COIT TOWER, AND THE SUN IS OUT —\n" +
          "WHICH IS ALREADY THE FIRST THING WORTH KNOWING ABOUT THIS PLACE.\n" +
          "SO — ARE YOU READY TO SEE TELEGRAPH HILL? LET'S GO.",
        broll: ["Two-shot idea: a foggy ridge in one frame, sunny Coit Tower in the next", "You moving up toward Coit Tower into frame", "The bay / Coit Tower to place us"],
      },
      {
        label: "1 · LOCATION & LAY OF THE LAND",
        words: 195,
        script:
          "FIRST — WHERE ARE WE? TELEGRAPH HILL RISES ON THE CITY'S NORTHEAST EDGE,\n" +
          "JUST ABOVE NORTH BEACH, WITH THE EMBARCADERO AND THE BAY BELOW TO THE EAST\n" +
          "AND CHINATOWN AND THE FINANCIAL DISTRICT OFF TO THE SOUTH.\n" +
          "THE CROWN IS COIT TOWER, STANDING IN PIONEER PARK AT THE VERY TOP.\n" +
          "AND HERE'S THE HEADLINE: THIS IS A STEEP HILL.\n" +
          "THE LAND RUNS FROM ABOUT 10 FEET DOWN AT THE EASTERN BASE\n" +
          "UP TO AROUND 300 FEET AT THE SUMMIT BY THE TOWER.\n" +
          "THIS HILL IS FAMOUS FOR ITS GARDEN STAIR STREETS —\n" +
          "THE FILBERT STEPS AND THE GREENWICH STEPS THAT CLIMB THE EASTERN CLIFF.\n" +
          "SO LET'S BE HONEST ABOUT ACCESS: THE GRADES HERE RUN\n" +
          "FAR PAST WHAT THE A-D-A CONSIDERS AN ACCESSIBLE SLOPE — ABOUT FIVE PERCENT.\n" +
          "IF STEP-FREE, LOW-GRADE ACCESS MATTERS TO YOU,\n" +
          "A ROUTE THROUGH THIS HILL TAKES REAL PLANNING.\n" +
          "AND THE HOMES THEMSELVES MATTER TOO —\n" +
          "MANY OF THESE HILLSIDE HOUSES ARE REACHED ONLY BY STAIRS,\n" +
          "WITH NO STREET-LEVEL, STEP-FREE ENTRY AT ALL,\n" +
          "SO IF THAT'S A MUST, IT'S WORTH CHECKING HOME BY HOME.",
        broll: ["Slow pan up toward Coit Tower; the summit", "Wide establishing shot: the hill rising above North Beach and the bay", "The Filbert or Greenwich garden stairs climbing the cliff (show the grade)"],
      },
      {
        label: "2 · HISTORY",
        words: 200,
        script:
          "NOW THE STORY. TELEGRAPH HILL TAKES ITS NAME FROM A SEMAPHORE SIGNAL STATION\n" +
          "BUILT ON TOP IN 1849, WHICH FLAGGED ARRIVING SHIPS TO THE MERCHANTS BELOW.\n" +
          "THE SPANISH CALLED IT LOMA ALTA — THE HIGH HILL —\n" +
          "AND EARLY SETTLERS KNEW IT AS 'GOAT HILL.'\n" +
          "ALL OF THIS WAS THE ANCESTRAL LAND OF THE RAMAYTUSH OHLONE LONG BEFORE THAT.\n" +
          "IT GREW UP AS A WORKING-CLASS ENCLAVE OF IRISH AND ITALIAN IMMIGRANTS,\n" +
          "PACKED INTO COTTAGES CLINGING TO THE SLOPES.\n" +
          "THEN CAME THE QUARRIES. CREWS BLASTED AWAY THE HILL'S EASTERN FACE\n" +
          "FOR ROCK TO BALLAST SHIPS AND BUILD THE SEAWALL —\n" +
          "WHICH IS WHY THAT SIDE DROPS AWAY IN SHEER CLIFFS TODAY.\n" +
          "IN THE 1930s, THE HILL'S ARTISTS AND BOHEMIANS CEMENTED ITS REPUTATION,\n" +
          "AND IN 1933 COIT TOWER ROSE AT THE SUMMIT.\n" +
          "AND THERE'S A LEGEND WORTH TELLING: WHEN THE 1906 FIRE CAME,\n" +
          "RESIDENTS ARE SAID TO HAVE SAVED HOMES ON THE EASTERN SLOPE\n" +
          "BY DOUSING THEM WITH BARRELS OF RED WINE AFTER THE WATER MAINS FAILED.\n" +
          "SPEND TIME ON THESE STAIRS, AND YOU'RE EXPLORING A SAN FRANCISCO\n" +
          "THAT STILL WEARS A CENTURY AND A HALF OF HISTORY OUT LOUD.",
        broll: ["Cottages clinging to the slope", "The sheer quarried eastern cliff", "Coit Tower against the sky"],
      },
      {
        label: "3 · HIDDEN FACTS",
        words: 160,
        script:
          "HERE'S WHAT MOST PEOPLE DON'T KNOW.\n" +
          "COIT TOWER WAS FUNDED BY A BEQUEST FROM HEIRESS LILLIE HITCHCOCK COIT,\n" +
          "WHO ADORED THE CITY'S VOLUNTEER FIREFIGHTERS —\n" +
          "AND DESPITE THE RESEMBLANCE, IT WAS NOT DESIGNED TO LOOK LIKE A FIRE-HOSE NOZZLE.\n" +
          "STEP INSIDE AND THE LOBBY IS LINED WITH 1934 FRESCO MURALS,\n" +
          "PAINTED BY 25 ARTISTS UNDER A NEW DEAL PROGRAM —\n" +
          "THEIR SOCIAL-REALIST THEMES BRIEFLY STIRRED REAL POLITICAL CONTROVERSY.\n" +
          "THOSE FAMOUS GARDEN STAIRWAYS — THE FILBERT AND GREENWICH STEPS —\n" +
          "WERE LARGELY PLANTED AND TENDED FOR DECADES BY ONE RESIDENT, GRACE MARCHANT.\n" +
          "AND LISTEN FOR THE SCREECHING: A FLOCK OF WILD CHERRY-HEADED PARROTS\n" +
          "ROAMS THE HILL, DESCENDED FROM ESCAPED PETS,\n" +
          "MADE FAMOUS BY A 2003 DOCUMENTARY.\n" +
          "THIS IS A NEIGHBORHOOD FULL OF SECRETS YOU ONLY FIND AROUND-WORN STAIRS.",
        broll: ["Coit Tower exterior + the WPA murals inside", "The garden stairs through lush planting", "Wild parrots in the trees"],
      },
      {
        label: "4 · MICROCLIMATE",
        words: 95,
        script:
          "QUICK WORD ON WEATHER — BECAUSE IN SAN FRANCISCO, MICROCLIMATE IS EVERYTHING.\n" +
          "TELEGRAPH HILL SITS IN ONE OF THE CITY'S SUNNIER, NORTHEAST POCKETS,\n" +
          "WELL AWAY FROM THE FOG THAT SWALLOWS THE WEST SIDE.\n" +
          "BUT IT'S A BAYFRONT HILL, SO IT CAN BE BREEZY —\n" +
          "THAT WIND COMES STRAIGHT OFF THE WATER AND OVER THE SUMMIT.\n" +
          "BRING A LAYER IF YOU'RE HEADING UP TO THE TOWER.\n" +
          "I KEEP A LIVE FOG MAP THAT SHOWS THIS NEIGHBORHOOD'S EXACT SUMMER-FOG HOURS\n" +
          "VERSUS THE FOGGY WEST SIDE — IT'S LINKED ON MY TELEGRAPH HILL PAGE BELOW.",
        broll: ["Blue sky over Coit Tower; you in shirtsleeves", "Wind on the bay: whitecaps, flags snapping at the summit", "Edit: screen-cap of the Ur4cast fog map"],
      },
      {
        label: "5 · GETTING AROUND — CAR-FREE",
        words: 290,
        script:
          "NOW THE PART THAT REALLY MATTERS IF YOU'RE BUYING HERE:\n" +
          "HOW YOU GET AROUND. THERE'S NO MUNI METRO ON TELEGRAPH HILL —\n" +
          "IT'S A BUS-AND-CABLE-CAR NEIGHBORHOOD.\n" +
          "THE 39 COIT BUS CLIMBS THE HILL RIGHT UP TO COIT TOWER\n" +
          "AND CONNECTS DOWN TO WASHINGTON SQUARE.\n" +
          "THE POWELL-MASON CABLE CAR RUNS NEARBY THROUGH NORTH BEACH,\n" +
          "AND THE 8, 30, AND 12 BUSES THREAD ALONG COLUMBUS AND STOCKTON BELOW.\n" +
          "THE NEAREST BART IS EMBARCADERO, DOWN AT THE FOOT OF THE HILL.\n" +
          "NOW LET'S LEAVE THE CITY — CAR-FREE.\n" +
          "THE FERRY BUILDING IS VERY CLOSE — LESS THAN A MILE SOUTHEAST,\n" +
          "A SHORT RIDE DOWN THE HILL, AND THAT'S YOUR GATEWAY TO THE WATER.\n" +
          "GOING TO THE EAST BAY? FROM EMBARCADERO, HOP BART —\n" +
          "DOWNTOWN OAKLAND IS ABOUT THIRTY-FIVE MINUTES DOOR TO PLATFORM.\n" +
          "BY CAR, THE BAY BRIDGE PUTS YOU IN OAKLAND IN A SIMILAR STRETCH.\n" +
          "HEADING NORTH TO MARIN? THE LARKSPUR FERRY LEAVES FROM THE FERRY BUILDING\n" +
          "AND CROSSES IN ABOUT THIRTY MINUTES ON THE WATER —\n" +
          "OR DRIVE THE GOLDEN GATE BRIDGE.\n" +
          "HEADING SOUTH TO THE PENINSULA? TAKE MUNI TO THE CALTRAIN DEPOT\n" +
          "AT 4TH AND KING, AND CALTRAIN RUNS DOWN TO PALO ALTO IN ABOUT FIFTY MINUTES —\n" +
          "OR IT'S 280 OR 101 BY CAR.\n" +
          "BOTTOM LINE: WATER, RAIL, AND THREE BRIDGES — ALL WITHOUT OWNING A CAR.",
        broll: [
          "The 39 Coit bus climbing the hill; a Powell-Mason cable car in North Beach",
          "Embarcadero Station + the Ferry Building / a departing ferry",
          "A BART train; the Bay Bridge; the Golden Gate Bridge; a Caltrain at 4th & King",
          "Simple motion-graphic map: Telegraph Hill → Oakland / Larkspur / Palo Alto with the times",
        ],
      },
      {
        label: "6 · THE GROUND UNDER YOU (HAZARDS)",
        words: 110,
        script:
          "TWO QUICK, HONEST NOTES ON THE GROUND ITSELF.\n" +
          "FIRST, TSUNAMI: MOST OF TELEGRAPH HILL SITS HIGH AND SAFE ABOVE THE BAY,\n" +
          "BUT THE LOW EASTERN BASE — DOWN NEAR THE EMBARCADERO —\n" +
          "DOES FALL WITHIN A MAPPED TSUNAMI HAZARD ZONE,\n" +
          "SO WHERE A HOME SITS ON THE SLOPE GENUINELY MATTERS HERE.\n" +
          "SECOND, LIKE MUCH OF HILLY SAN FRANCISCO, PARTS OF THE NEIGHBORHOOD\n" +
          "DO FALL WITHIN A STATE-DESIGNATED SEISMIC HAZARD ZONE —\n" +
          "THAT'S STANDARD FOR THE CITY'S SLOPES, AND IT'S SOMETHING\n" +
          "EVERY CALIFORNIA BUYER REVIEWS WITH THEIR INSPECTOR AND INSURER.\n" +
          "I PUT THE SEISMIC AND TSUNAMI STATUS RIGHT ON EACH NEIGHBORHOOD'S\n" +
          "DETAILS PAGE, SO YOU CAN CHECK ANY SPECIFIC BLOCK BEFORE YOU WRITE AN OFFER.",
        broll: ["You gesturing from the summit down to the Embarcadero base", "Edit: the seismic + tsunami toggles on your fog map"],
      },
      {
        label: "7 · DINING, NIGHTLIFE & DAILY LIFE",
        words: 120,
        script:
          "LET'S TALK DAILY LIFE.\n" +
          "JUST DOWNHILL, NORTH BEACH IS ONE OF THE LIVELIEST QUARTERS IN THE CITY —\n" +
          "ITALIAN RESTAURANTS, CLASSIC CAFÉS, AND SOME OF THE OLDEST\n" +
          "LANDMARK BARS IN SAN FRANCISCO, A SHORT TRIP FROM YOUR DOOR.\n" +
          "I'M NOT GOING TO NAME SPECIFIC PLACES ON CAMERA, BECAUSE THE LINEUP CHANGES —\n" +
          "AND I NEVER WANT TO SEND YOU SOMEWHERE THAT'S CLOSED.\n" +
          "INSTEAD, I KEEP A CURRENT, HAND-CHECKED LIST OF THE NEIGHBORHOOD'S BEST\n" +
          "RESTAURANTS AND BARS RIGHT ON MY TELEGRAPH HILL DETAILS PAGE — ALWAYS UP TO DATE.\n" +
          "THE VIBE TO KNOW: A QUIET, LEAFY HILLTOP PERCH\n" +
          "WITH A WHOLE ITALIAN NEIGHBORHOOD WAITING AT THE BOTTOM OF THE STAIRS.",
        broll: ["Café tables in North Beach at dusk", "A historic landmark bar sign (general, not a single endorsement)", "Washington Square with the hill rising behind"],
      },
      {
        label: "8 · REAL ESTATE",
        words: 120,
        script:
          "ON HOUSING: TELEGRAPH HILL IS CLASSIC SAN FRANCISCO —\n" +
          "HILLSIDE COTTAGES AND PERIOD HOMES CLINGING TO THE SLOPE,\n" +
          "VINTAGE FLATS, AND CONDOS WITH SOME OF THE BEST BAY VIEWS IN THE CITY.\n" +
          "MANY OF THESE HOMES ARE REACHED BY STAIRS, AND VIEWS DRIVE VALUE HERE.\n" +
          "IT RUNS FROM A FIRST CONDO TO A FULLY RESTORED HILLSIDE SHOWPIECE.\n" +
          "I'M NOT GOING TO QUOTE A MEDIAN PRICE ON CAMERA, BECAUSE THAT NUMBER MOVES.\n" +
          "INSTEAD, I KEEP A LIVE MARKET UPDATE FOR TELEGRAPH HILL ON MY SITE —\n" +
          "CURRENT MEDIANS FOR SINGLE-FAMILY HOMES AND FOR CONDOS, RIGHT UP TO TODAY.\n" +
          "THE LINK IS BELOW. THAT'S YOUR SMARTEST FIRST STEP BEFORE YOU EVEN TOUR.",
        broll: ["A hillside cottage, a vintage flats building, a view condo entry", "A 'For Sale' sign", "Edit: lower-third + screen-record of your live market page"],
      },
      {
        label: "9 · WHO BELONGS HERE + SIGNATURE OUTRO",
        words: 120,
        script:
          "SO — WHO BELONGS ON TELEGRAPH HILL?\n" +
          "SOMEONE WHO WANTS VIEWS, QUIET, AND GARDEN STAIRS AT THE DOOR,\n" +
          "WITH NORTH BEACH AND THE WHOLE BAY AREA JUST DOWNHILL, AND NEVER NEEDS A CAR.\n" +
          "BUT HERE'S THE THING I'VE LEARNED AFTER ALL THESE YEARS:\n" +
          "EVERY NEIGHBORHOOD IN THIS CITY HAS A STORY LIKE THIS ONE,\n" +
          "AND KNOWING THEM ALL IS THE WORK — THE MICROCLIMATES,\n" +
          "THE STREETS THAT HOLD THEIR VALUE, THE THINGS THAT NEVER SHOW UP IN A SEARCH.\n" +
          "ANYTHING THAT CHANGES — PRICES, THE NEWEST RESTAURANT, WHAT'S FOR SALE —\n" +
          "STAYS CURRENT ON MY TELEGRAPH HILL NEIGHBORHOOD PAGE, SO THIS GUIDE NEVER GOES STALE.\n" +
          "SO IF YOU'RE THINKING ABOUT CALLING TELEGRAPH HILL HOME,\n" +
          "I'D LOVE TO SHOW YOU AROUND AND HELP CREATE YOUR NEXT LIFE ADVENTURE.",
        broll: ["Golden-hour, unhurried pass near Coit Tower (you, relaxed, not pitching)", "A quiet look down the garden stairs toward the bay", "Soft end card: your name + how to reach you"],
      },
    ],
    schedule: [
      { step: "Scout & lock script", detail: "Take the route, mark the 6–8 B-roll stops, finalize edits to this script.", time: "~45 min (day before)" },
      { step: "Golden-hour B-roll", detail: "Shoot Coit Tower, the garden stairs, the bay views, street life, and housing variety in good light.", time: "30–45 min (early AM or ~1 hr before sunset)" },
      { step: "Talk-to-camera takes", detail: "Shoot each section as its own clip at the relevant spot; 2 takes each; teleprompter on your phone.", time: "60–90 min" },
      { step: "Pickups & cutaways", detail: "Signs, the garden stairs, and a screen-record of your live market page (capture at home).", time: "~15 min" },
      { step: "Edit & caption", detail: "Assemble, add lower-thirds (market URL), burned-in captions, light music bed; export.", time: "2–3 hrs" },
      { step: "Publish & link", detail: "Upload to YouTube, paste the market link in the description — then I add the 'Watch the tour' button to the Telegraph Hill page.", time: "~30 min" },
    ],
    batchTip: "Shoot adjacent hoods the same outing — e.g. Telegraph Hill + North Beach + Chinatown in one morning loop.",
  },
"Seacliff": {
    aka: "Sea Cliff",
    runtime: "~10 min (8–10 target)",
    marketLink: "https://www.ur4cast.com/listings?nbhd=Seacliff&layer=nbhd",
    detailsLink: "https://www.ur4cast.com/fog (open the Neighborhoods card → Seacliff)",
    route: {
      // Route stays ENTIRELY within the Seacliff boundary (verified against the
      // neighborhood polygon). Coords approximate — snap to the sidewalk grid for the final cut.
      spots: [
        { n: 1, name: "China Beach overlook", note: "Start — the bluff above the sheltered cove, Golden Gate Bridge off to the right", coord: [-122.4905, 37.7878] },
        { n: 2, name: "Sea Cliff Avenue mansion blocks", note: "The grand period-revival homes on the curving bluff-top streets", coord: [-122.4895, 37.7888] },
        { n: 3, name: "El Camino del Mar — Golden Gate views", note: "The view street: Mediterranean homes oriented to the bridge and Marin Headlands", coord: [-122.4886, 37.789] },
        { n: 4, name: "25th Avenue North — bluff edge", note: "The northern edge above the water; stairs lead down to China Beach", coord: [-122.4875, 37.7891] },
        { n: 5, name: "Scenic Way — the western bluff", note: "South end; the quieter curving streets toward Lincoln Park", coord: [-122.4920, 37.7860] },
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
          "RIGHT NOW I'M ABOVE CHINA BEACH, AND THE FOG IS ROLLING IN —\n" +
          "WHICH IS ALREADY THE FIRST THING WORTH KNOWING ABOUT THIS PLACE.\n" +
          "SO — ARE YOU READY TO SEE SEACLIFF? LET'S GO.",
        broll: ["Two-shot idea: a foggy ridge in one frame, a sunny bluff-top street in the next", "You moving along the bluff into frame, the Pacific behind you", "China Beach / the Golden Gate Bridge through the fog to place us"],
      },
      {
        label: "1 · LOCATION & LAY OF THE LAND",
        words: 195,
        script:
          "FIRST — WHERE ARE WE? SEACLIFF SITS IN THE CITY'S NORTHWEST CORNER,\n" +
          "PERCHED ON THE BLUFFS ABOVE THE PACIFIC, JUST WEST OF THE PRESIDIO,\n" +
          "WITH LANDS END AND LINCOLN PARK WRAPPING ITS WESTERN EDGE\n" +
          "AND THE INNER RICHMOND JUST INLAND TO THE SOUTH.\n" +
          "THE SPINE IS SEA CLIFF AVENUE AND EL CAMINO DEL MAR,\n" +
          "CURVING ALONG THE CLIFFTOP ABOVE CHINA BEACH AND BAKER BEACH.\n" +
          "THE LAND RUNS FROM SEA LEVEL DOWN AT THE WATER\n" +
          "UP TO ABOUT 220 FEET ON THE BLUFF-TOP STREETS,\n" +
          "AND THE GRADE IS ROLLING — THE CURVING STREETS RISE AND DIP\n" +
          "AS THEY FOLLOW THE EDGE OF THE CLIFF.\n" +
          "SOME BLOCKS ARE GENTLE AND EASY TO GET AROUND,\n" +
          "FRIENDLY WHETHER YOU'RE PUSHING A STROLLER OR ROLLING A WHEELCHAIR,\n" +
          "BUT OTHER STRETCHES PASS WHAT THE A-D-A CONSIDERS\n" +
          "AN ACCESSIBLE SLOPE — ABOUT FIVE PERCENT.\n" +
          "AND HERE'S THE HONEST PART: GETTING DOWN TO THE BEACHES\n" +
          "MEANS STAIR-ACCESS PATHS DROPPING OFF THE BLUFF.\n" +
          "THE GRAND HOMES THEMSELVES OFTEN SIT UP A FLIGHT FROM THE STREET TOO,\n" +
          "SO IF STEP-FREE ENTRY IS A MUST, IT'S WORTH CHECKING HOME BY HOME.",
        broll: ["Slow pan along Sea Cliff Ave; the curving bluff-top streets", "Wide establishing shot: the bluffs, China Beach, the Golden Gate beyond", "The stair-access path dropping from the bluff toward the beach (show the grade)"],
      },
      {
        label: "2 · HISTORY",
        words: 200,
        script:
          "NOW THE STORY. SEACLIFF — OR SEA CLIFF — TAKES ITS NAME\n" +
          "FROM ITS DRAMATIC PERCH ON THE BLUFFS ABOVE THE PACIFIC.\n" +
          "ALL OF THIS WAS THE ANCESTRAL LAND OF THE RAMAYTUSH OHLONE LONG BEFORE THAT.\n" +
          "THE ALLEN REAL-ESTATE GROUP BEGAN DEVELOPING THE ENCLAVE AROUND 1912\n" +
          "AS ONE OF SAN FRANCISCO'S MASTER-PLANNED 'RESIDENCE PARKS' —\n" +
          "LAID OUT AFTER THE 1906 EARTHQUAKE TO FEEL LIKE A GARDEN SUBURB.\n" +
          "LANDSCAPE ARCHITECT MARK DANIELS DESIGNED THE CURVING STREETS,\n" +
          "THE ORNATE ENTRY GATES, THE FOUNTAINS AND THE LARGE LOTS,\n" +
          "ALL MEANT TO EVOKE GENTEEL, COUNTRY-STYLE LIVING ON THE COAST.\n" +
          "THROUGH THE 1920s AND 1930s, MEDITERRANEAN AND PERIOD-REVIVAL HOMES\n" +
          "FILLED IN THESE BLOCKS — STUCCO FACADES AND TILED ROOFS\n" +
          "ORIENTED EXPRESSLY TO CAPTURE THE GOLDEN GATE AND THE MARIN HEADLANDS.\n" +
          "AND IT HAS STAYED EXACTLY THAT WAY EVER SINCE:\n" +
          "A QUIET, PURELY RESIDENTIAL ADDRESS, ONE OF THE CITY'S MOST EXCLUSIVE.\n" +
          "SO WHEN YOU SPEND TIME ON THESE STREETS, REMEMBER —\n" +
          "YOU'RE EXPLORING A CENTURY-OLD VISION OF THE GOOD LIFE BY THE SEA,\n" +
          "BUILT ON A BLUFF AND BARELY CHANGED SINCE.",
        broll: ["Mediterranean and period-revival facades along Sea Cliff Ave", "An ornate original entry gate or fountain", "A wide shot of the curving residence-park streets above the water"],
      },
      {
        label: "3 · HIDDEN FACTS",
        words: 160,
        script:
          "HERE'S WHAT MOST PEOPLE DON'T KNOW.\n" +
          "TUCKED BELOW THE BLUFFS, SHELTERED CHINA BEACH\n" +
          "IS ONE OF THE CITY'S FEW GENUINELY SWIMMABLE COVES —\n" +
          "AND JUST NORTH, LARGER BAKER BEACH STRETCHES TOWARD THE GOLDEN GATE BRIDGE\n" +
          "WITH ONE OF THE BEST POSTCARD VIEWS IN SAN FRANCISCO.\n" +
          "THIS ENCLAVE'S PRIVACY AND VIEWS HAVE LONG DRAWN THE WEALTHY AND FAMOUS —\n" +
          "ROBIN WILLIAMS AND SHARON STONE BOTH OWNED HOMES HERE,\n" +
          "ALONGSIDE TECH FOUNDERS AND OLD SAN FRANCISCO FAMILIES.\n" +
          "BUT LIVING ON A BLUFF HAS ITS DRAMA: IN DECEMBER 1995,\n" +
          "A RUPTURED SEWER ON SEA CLIFF AVENUE TRIGGERED AGGRESSIVE EROSION\n" +
          "AND A SERIES OF SLOPE COLLAPSES ALONG EL CAMINO DEL MAR,\n" +
          "DAMAGING SEVERAL HOMES IN ONE OF THE NEIGHBORHOOD'S MOST DRAMATIC INCIDENTS.\n" +
          "THIS IS A PLACE WHERE THE VIEW AND THE GROUND IT SITS ON\n" +
          "ARE PART OF THE SAME STORY.",
        broll: ["China Beach cove from the bluff above", "Baker Beach stretching toward the Golden Gate Bridge", "El Camino del Mar along the bluff edge"],
      },
      {
        label: "4 · MICROCLIMATE",
        words: 95,
        script:
          "QUICK WORD ON WEATHER — BECAUSE IN SAN FRANCISCO, MICROCLIMATE IS EVERYTHING.\n" +
          "SEACLIFF SITS RIGHT ON THE OCEAN IN THE CITY'S NORTHWEST CORNER,\n" +
          "SO LET'S BE HONEST: IT IS FREQUENTLY FOGGY.\n" +
          "THE SUMMER FOG ROLLS IN OFF THE PACIFIC AND THROUGH THE GOLDEN GATE,\n" +
          "AND THIS BLUFF CATCHES IT FIRST.\n" +
          "BUT WHEN IT CLEARS — AND ON THOSE DRAMATIC CLEARING DAYS IT REALLY CLEARS —\n" +
          "THE LIGHT OFF THE WATER AND THE BRIDGE IS LIKE NOWHERE ELSE.\n" +
          "I KEEP A LIVE FOG MAP THAT SHOWS THIS NEIGHBORHOOD'S EXACT SUMMER-FOG HOURS\n" +
          "VERSUS THE SUNNIER EAST SIDE — IT'S LINKED ON MY SEACLIFF PAGE BELOW.",
        broll: ["Fog pouring through the Golden Gate over the bluff", "A dramatic clearing day: the bridge and Marin Headlands wide open", "Edit: screen-cap of the Ur4cast fog map"],
      },
      {
        label: "5 · GETTING AROUND — CAR-FREE",
        words: 290,
        script:
          "NOW THE PART THAT REALLY MATTERS IF YOU'RE BUYING HERE:\n" +
          "HOW YOU GET AROUND. AND I'LL BE STRAIGHT WITH YOU —\n" +
          "SEACLIFF IS A QUIETER, MORE CAR-RELIANT CORNER OF THE CITY.\n" +
          "THERE'S NO MUNI METRO AND NO BART NEARBY — THE NEAREST BART IS FAR,\n" +
          "A LONG RIDE EAST ACROSS TOWN.\n" +
          "BUT THE BUSES ARE HERE IF YOU WANT THEM:\n" +
          "THE 1 CALIFORNIA RUNS ALONG THE SOUTHERN EDGE STRAIGHT DOWNTOWN,\n" +
          "AND THE 18 46TH AVENUE AND THE 29 SUNSET SKIRT LINCOLN PARK TO THE WEST.\n" +
          "NOW LET'S LEAVE THE CITY.\n" +
          "THE FERRY BUILDING IS ABOUT FIVE MILES EAST,\n" +
          "AND THAT'S YOUR GATEWAY TO THE WATER.\n" +
          "GOING TO THE EAST BAY? TAKE THE 1 CALIFORNIA DOWNTOWN, HOP BART —\n" +
          "DOWNTOWN OAKLAND IS ABOUT THIRTY-FIVE MINUTES FROM THE DOWNTOWN PLATFORM.\n" +
          "BY CAR, THE BAY BRIDGE PUTS YOU IN OAKLAND IN A SIMILAR STRETCH.\n" +
          "HEADING NORTH TO MARIN? YOU'RE CLOSE TO THE GOLDEN GATE BRIDGE —\n" +
          "JUST EAST ALONG THE COAST — AND ACROSS IT YOU'RE IN THE MARIN HEADLANDS\n" +
          "AND SAUSALITO IN ABOUT TWENTY MINUTES BY CAR.\n" +
          "HEADING SOUTH TO THE PENINSULA? TAKE A BUS TO THE CALTRAIN DEPOT\n" +
          "AT 4TH AND KING, AND CALTRAIN RUNS DOWN TO PALO ALTO IN ABOUT FIFTY MINUTES —\n" +
          "OR IT'S 280 OR 101 BY CAR.\n" +
          "BOTTOM LINE: IT'S A CAR-FRIENDLY CORNER, BUT THE BUSES, THE WATER,\n" +
          "AND THE GOLDEN GATE BRIDGE ARE ALL CLOSER THAN YOU'D THINK.",
        broll: [
          "A 1 California bus on the southern edge; the 18 or 29 near Lincoln Park",
          "The Ferry Building / a departing ferry",
          "A BART train; the Bay Bridge; the Golden Gate Bridge close by; a Caltrain at 4th & King",
          "Simple motion-graphic map: Seacliff → Oakland / Marin / Palo Alto with the times",
        ],
      },
      {
        label: "6 · THE GROUND UNDER YOU (HAZARDS)",
        words: 110,
        script:
          "TWO QUICK, HONEST NOTES ON THE GROUND ITSELF.\n" +
          "SEACLIFF IS A COASTAL CLIFF NEIGHBORHOOD, SO THIS ONE MATTERS:\n" +
          "PARTS OF THE SHORELINE — CHINA BEACH AND THE BLUFF BASE —\n" +
          "DO FALL WITHIN A TSUNAMI EVACUATION ZONE.\n" +
          "THE GOOD NEWS IS THAT THE BLUFF-TOP HOMES SIT WELL ABOVE THE WATER,\n" +
          "HIGHER AND SAFER THAN THE BEACH BELOW —\n" +
          "BUT IT'S WORTH KNOWING EXACTLY WHERE THE LINE FALLS ON YOUR BLOCK.\n" +
          "AND LIKE MUCH OF THE COASTAL CITY, THE NEIGHBORHOOD\n" +
          "DOES FALL WITHIN A STATE-DESIGNATED SEISMIC HAZARD ZONE —\n" +
          "STANDARD HERE, AND SOMETHING EVERY CALIFORNIA BUYER\n" +
          "REVIEWS WITH THEIR INSPECTOR AND INSURER.\n" +
          "I PUT THE SEISMIC AND TSUNAMI STATUS RIGHT ON EACH NEIGHBORHOOD'S\n" +
          "DETAILS PAGE, SO YOU CAN CHECK ANY SPECIFIC BLOCK BEFORE YOU WRITE AN OFFER.",
        broll: ["You gesturing from the bluff down to the beach and the water", "The shoreline evacuation-zone edge vs. the higher bluff homes", "Edit: the seismic + tsunami toggles on your fog map"],
      },
      {
        label: "7 · DINING, NIGHTLIFE & DAILY LIFE",
        words: 120,
        script:
          "LET'S TALK DAILY LIFE.\n" +
          "HERE'S THE HONEST TRADE-OFF: SEACLIFF IS ALMOST PURELY RESIDENTIAL.\n" +
          "THERE'S NO COMMERCIAL STRIP INSIDE THE NEIGHBORHOOD ITSELF —\n" +
          "WHAT YOU GET INSTEAD IS QUIET, PRIVACY, AND THE BEACHES RIGHT BELOW YOU.\n" +
          "FOR COFFEE, DINNER, AND DAILY ERRANDS, THE NEAREST SHOPS\n" +
          "ARE JUST INLAND IN THE RICHMOND — CLEMENT STREET ESPECIALLY,\n" +
          "WHICH IS ONE OF THE BEST EATING STREETS IN THE WHOLE CITY.\n" +
          "I'M NOT GOING TO NAME SPECIFIC PLACES ON CAMERA, BECAUSE THE LINEUP CHANGES —\n" +
          "AND I NEVER WANT TO SEND YOU SOMEWHERE THAT'S CLOSED.\n" +
          "INSTEAD, I KEEP A CURRENT, HAND-CHECKED LIST OF THE BEST NEARBY\n" +
          "RESTAURANTS AND BARS RIGHT ON MY SEACLIFF DETAILS PAGE — ALWAYS UP TO DATE.\n" +
          "THE VIBE TO KNOW: COME HOME FOR THE CALM, DRIVE A FEW MINUTES FOR THE REST.",
        broll: ["Quiet residential blocks; no storefronts, just homes and gardens", "Clement Street in the nearby Richmond: cafés and restaurant windows", "China Beach below — the real amenity at your door"],
      },
      {
        label: "8 · REAL ESTATE",
        words: 120,
        script:
          "ON HOUSING: SEACLIFF IS ONE OF SAN FRANCISCO'S MOST EXCLUSIVE ADDRESSES —\n" +
          "GRAND MEDITERRANEAN AND PERIOD-REVIVAL MANSIONS ON LARGE LOTS,\n" +
          "MANY ORIENTED EXPRESSLY TO CAPTURE THE GOLDEN GATE AND THE HEADLANDS.\n" +
          "THIS IS A PURELY RESIDENTIAL, SINGLE-FAMILY ENCLAVE —\n" +
          "FEWER HOMES CHANGE HANDS HERE THAN ALMOST ANYWHERE IN THE CITY.\n" +
          "I'M NOT GOING TO QUOTE A MEDIAN PRICE ON CAMERA, BECAUSE THAT NUMBER MOVES —\n" +
          "AND IN A SMALL, HIGH-END MARKET LIKE THIS ONE, IT MOVES A LOT.\n" +
          "INSTEAD, I KEEP A LIVE MARKET UPDATE FOR SEACLIFF ON MY SITE,\n" +
          "RIGHT UP TO TODAY.\n" +
          "THE LINK IS BELOW. THAT'S YOUR SMARTEST FIRST STEP BEFORE YOU EVEN TOUR.",
        broll: ["A grand cliffside mansion with a bridge view", "A curving residence-park street of large lots", "Edit: lower-third + screen-record of your live market page"],
      },
      {
        label: "9 · WHO BELONGS HERE + SIGNATURE OUTRO",
        words: 120,
        script:
          "SO — WHO BELONGS IN SEACLIFF?\n" +
          "SOMEONE WHO WANTS PRIVACY, GRAND HOMES, AND THE PACIFIC\n" +
          "AND THE GOLDEN GATE RIGHT OUTSIDE THE WINDOW —\n" +
          "AND DOESN'T MIND DRIVING A FEW MINUTES FOR THE BUSTLE.\n" +
          "BUT HERE'S THE THING I'VE LEARNED AFTER ALL THESE YEARS:\n" +
          "EVERY NEIGHBORHOOD IN THIS CITY HAS A STORY LIKE THIS ONE,\n" +
          "AND KNOWING THEM ALL IS THE WORK — THE MICROCLIMATES,\n" +
          "THE STREETS THAT HOLD THEIR VALUE, THE THINGS THAT NEVER SHOW UP IN A SEARCH.\n" +
          "ANYTHING THAT CHANGES — PRICES, THE NEWEST RESTAURANT, WHAT'S FOR SALE —\n" +
          "STAYS CURRENT ON MY SEACLIFF NEIGHBORHOOD PAGE, SO THIS GUIDE NEVER GOES STALE.\n" +
          "SO IF YOU'RE THINKING ABOUT CALLING SEACLIFF HOME,\n" +
          "I'D LOVE TO SHOW YOU AROUND AND HELP CREATE YOUR NEXT LIFE ADVENTURE.",
        broll: ["Golden-hour, unhurried pass along the bluff (you, relaxed, not pitching)", "A quiet look out over China Beach toward the Golden Gate", "Soft end card: your name + how to reach you"],
      },
    ],
    schedule: [
      { step: "Scout & lock script", detail: "Take the route, mark the 6–8 B-roll stops, finalize edits to this script.", time: "~45 min (day before)" },
      { step: "Golden-hour B-roll", detail: "Shoot the bluff-top mansions, China Beach, El Camino del Mar views, and the Golden Gate in good light — and grab a clearing-day window if you can.", time: "30–45 min (early AM or ~1 hr before sunset)" },
      { step: "Talk-to-camera takes", detail: "Shoot each section as its own clip at the relevant spot; 2 takes each; teleprompter on your phone.", time: "60–90 min" },
      { step: "Pickups & cutaways", detail: "Street signs, the stair-access path to the beach, and a screen-record of your live market page (capture at home).", time: "~15 min" },
      { step: "Edit & caption", detail: "Assemble, add lower-thirds (market URL), burned-in captions, light music bed; export.", time: "2–3 hrs" },
      { step: "Publish & link", detail: "Upload to YouTube, paste the market link in the description — then I add the 'Watch the tour' button to the Seacliff page.", time: "~30 min" },
    ],
    batchTip: "Shoot adjacent hoods the same outing — e.g. Seacliff + Lake Street + the Inner Richmond in one morning loop.",
  },
"Lake Street": {
    aka: "Lake District",
    runtime: "~10 min (8–10 target)",
    marketLink: "https://www.ur4cast.com/listings?nbhd=Lake%20Street&layer=nbhd",
    detailsLink: "https://www.ur4cast.com/fog (open the Neighborhoods card → Lake Street)",
    route: {
      // Route stays ENTIRELY within the Lake Street boundary (verified against the
      // neighborhood polygon). Coords approximate — snap to the sidewalk grid for the final cut.
      spots: [
        { n: 1, name: "Lake St & 25th Ave", note: "Start — the leafy residential corridor along the Presidio wall, sun out", coord: [-122.484, 37.7857] },
        { n: 2, name: "Lake St Edwardian blocks (24th Ave)", note: "The housing-stock segment: grand Mediterranean, Tudor, and period-revival homes", coord: [-122.4845, 37.7857] },
        { n: 3, name: "Lake St & 21st Ave — Presidio edge", note: "The street running right along the Presidio's southern boundary", coord: [-122.4810, 37.7856] },
        { n: 4, name: "Presidio gate at Lake St", note: "A walk-in gate into the national park's forested trails", coord: [-122.4775, 37.7861] },
        { n: 5, name: "Mountain Lake Park edge", note: "The green park, playgrounds, and the trail into the Presidio", coord: [-122.4732, 37.7850] },
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
          "RIGHT NOW I'M ON LAKE STREET, AND THE FOG IS ROLLING IN —\n" +
          "WHICH IS ALREADY THE FIRST THING WORTH KNOWING ABOUT THIS PLACE.\n" +
          "SO — ARE YOU READY TO SEE LAKE STREET? LET'S GO.",
        broll: ["Two-shot idea: a foggy ridge in one frame, a brighter block in the next", "You moving along Lake St into frame", "The leafy Presidio-edge corridor to place us"],
      },
      {
        label: "1 · LOCATION & LAY OF THE LAND",
        words: 195,
        script:
          "FIRST — WHERE ARE WE? LAKE STREET RUNS ALONG THE NORTHERN EDGE OF THE RICHMOND,\n" +
          "A LEAFY CORRIDOR TUCKED RIGHT UP AGAINST THE PRESIDIO'S SOUTHERN WALL,\n" +
          "WITH MOUNTAIN LAKE PARK AT ITS EASTERN END\n" +
          "AND THE AVENUES OF THE RICHMOND STRETCHING SOUTH.\n" +
          "THE MAIN SPINE IS LAKE STREET ITSELF, A QUIET RESIDENTIAL RUN\n" +
          "LINED WITH GRAND PERIOD HOMES UNDER MATURE STREET TREES.\n" +
          "HERE'S THE HEADLINE ON THE LAND: IT'S MOSTLY LEVEL.\n" +
          "ELEVATION RUNS FROM ABOUT 60 FEET UP TO AROUND 160,\n" +
          "AND THIS IS THE FLAT RICHMOND GRID — GENUINELY EASY TO GET AROUND,\n" +
          "FRIENDLY WHETHER YOU'RE PUSHING A STROLLER OR ROLLING A WHEELCHAIR,\n" +
          "WELL WITHIN WHAT THE A-D-A CONSIDERS AN ACCESSIBLE GRADE — ABOUT FIVE PERCENT.\n" +
          "THE BLOCKS ARE ORDERLY AND THE SIDEWALKS ARE WIDE.\n" +
          "THAT SAID, THE HOMES THEMSELVES STILL VARY —\n" +
          "MANY OF THESE STATELY HOUSES SIT UP A FLIGHT OF STAIRS FROM THE SIDEWALK,\n" +
          "SO IF STEP-FREE ENTRY IS A MUST, IT'S WORTH CHECKING HOME BY HOME.\n" +
          "BUT AS A NEIGHBORHOOD TO MOVE THROUGH? LEVEL, ORDERLY, AND EASY.",
        broll: ["Slow pan down Lake St; mature street trees and wide sidewalks", "Wide establishing shot: the Presidio wall on one side, homes on the other", "Someone with a stroller on the level Richmond grid"],
      },
      {
        label: "2 · HISTORY",
        words: 200,
        script:
          "NOW THE STORY. LAKE STREET TAKES ITS NAME FROM MOUNTAIN LAKE —\n" +
          "ONE OF THE LAST NATURAL LAKES LEFT IN SAN FRANCISCO,\n" +
          "FED BY A CHAIN OF DUNES AND SPRINGS ALONG THE PRESIDIO'S SOUTHERN BOUNDARY.\n" +
          "ALL OF THIS WAS THE ANCESTRAL LAND OF THE RAMAYTUSH OHLONE LONG BEFORE THAT.\n" +
          "IN MARCH OF 1776, THE SPANISH EXPLORER JUAN BAUTISTA DE ANZA\n" +
          "MADE CAMP RIGHT HERE AT MOUNTAIN LAKE\n" +
          "WHILE SCOUTING THE SITES FOR THE PRESIDIO AND MISSION DOLORES —\n" +
          "SO IN A REAL SENSE, THE CITY WAS CHOSEN FROM THIS SPOT.\n" +
          "FOR MORE THAN A CENTURY AFTER, THIS WAS OPEN SAND DUNES\n" +
          "ON THE RICHMOND'S NORTHERN EDGE.\n" +
          "THEN, IN THE EARLY 20TH CENTURY, THOSE DUNES WERE SUBDIVIDED AND DEVELOPED,\n" +
          "AND BUILDERS RAISED THE LARGE, ARCHITECTURALLY RICH SINGLE-FAMILY HOMES\n" +
          "THAT STILL DEFINE THIS PROSPEROUS CORRIDOR TODAY —\n" +
          "MEDITERRANEAN, TUDOR, AND PERIOD-REVIVAL HOUSES, BLOCK AFTER BLOCK.\n" +
          "SO WHEN YOU SPEND TIME ON THESE STREETS, REMEMBER —\n" +
          "YOU'RE STANDING WHERE A SPANISH EXPEDITION ONCE CAMPED\n" +
          "AND DECIDED WHERE SAN FRANCISCO WOULD BEGIN.",
        broll: ["Mountain Lake and its restored shoreline", "Grand period-revival facades along Lake St", "The Anza Trail marker near the lake if you can find one"],
      },
      {
        label: "3 · HIDDEN FACTS",
        words: 160,
        script:
          "HERE'S WHAT MOST PEOPLE DON'T KNOW.\n" +
          "MOUNTAIN LAKE IS A GENUINELY RARE THING —\n" +
          "ONE OF THE FEW REMAINING NATURAL LAKES IN ALL OF SAN FRANCISCO.\n" +
          "IT WAS BADLY DEGRADED BY RUNOFF FOR DECADES,\n" +
          "THEN UNDERWENT A MAJOR RESTORATION IN THE 2010s\n" +
          "THAT BROUGHT NATIVE PLANTS AND WILDLIFE BACK TO ITS SHORES.\n" +
          "THE LAKE ANCHORS MOUNTAIN LAKE PARK — PLAYGROUNDS, TENNIS COURTS,\n" +
          "AND TRAILS THAT CONNECT STRAIGHT INTO THE PRESIDIO\n" +
          "AND THE JUAN BAUTISTA DE ANZA NATIONAL HISTORIC TRAIL.\n" +
          "AND LAKE STREET HAS A FRONT-DOOR RELATIONSHIP WITH THE PRESIDIO ITSELF —\n" +
          "THE STREET RUNS RIGHT ALONG THE PARK'S SOUTHERN EDGE,\n" +
          "SO RESIDENTS STEP STRAIGHT INTO FORESTED TRAILS AND SCENIC OVERLOOKS.\n" +
          "THIS IS A NEIGHBORHOOD THAT SITS ON THE DOORSTEP OF A NATIONAL PARK.",
        broll: ["Mountain Lake with birds / native plantings", "Mountain Lake Park playground and tennis courts", "A Presidio trailhead just off Lake St"],
      },
      {
        label: "4 · MICROCLIMATE",
        words: 95,
        script:
          "QUICK WORD ON WEATHER — BECAUSE IN SAN FRANCISCO, MICROCLIMATE IS EVERYTHING.\n" +
          "LAKE STREET SITS ON THE NORTHERN RICHMOND, NEAR THE COAST,\n" +
          "SO IT OFTEN CATCHES THE MARINE LAYER —\n" +
          "THAT SUMMER FOG THAT ROLLS IN OFF THE PACIFIC AND THROUGH THE GOLDEN GATE.\n" +
          "SOME DAYS ARE BRIGHT AND CLEAR; PLENTY OF MORNINGS AND EVENINGS ARE GREY AND COOL.\n" +
          "IT'S A MIXED, FOG-LEANING POCKET — BRING A LAYER.\n" +
          "I KEEP A LIVE FOG MAP THAT SHOWS THIS NEIGHBORHOOD'S EXACT SUMMER-FOG HOURS\n" +
          "VERSUS THE SUNNIER EAST SIDE — IT'S LINKED ON MY LAKE STREET PAGE BELOW.",
        broll: ["Fog drifting over the Presidio treeline", "A grey, cool morning on Lake St; you in a layer", "Edit: screen-cap of the Ur4cast fog map"],
      },
      {
        label: "5 · GETTING AROUND — CAR-FREE",
        words: 290,
        script:
          "NOW THE PART THAT REALLY MATTERS IF YOU'RE BUYING HERE:\n" +
          "HOW YOU GET AROUND. THERE'S NO MUNI METRO ON LAKE STREET —\n" +
          "IT'S A BUS NEIGHBORHOOD, AND A WELL-SERVED ONE.\n" +
          "THE 1 CALIFORNIA RUNS A FEW BLOCKS SOUTH AND HEADS STRAIGHT DOWNTOWN,\n" +
          "WITH THE 2 CLEMENT AND THE 33 ASHBURY-18TH CLOSE BY,\n" +
          "AND THE 28 NINETEENTH AVENUE LINKING YOU NORTH TO THE BRIDGE AND SOUTH ACROSS THE CITY.\n" +
          "THE NEAREST BART IS A TRANSFER DOWNTOWN, NOT A STATION YOU CAN SEE FROM HERE.\n" +
          "NOW LET'S LEAVE THE CITY — CAR-FREE.\n" +
          "THE FERRY BUILDING IS ABOUT FIVE MILES EAST,\n" +
          "A MUNI RIDE AWAY, AND THAT'S YOUR GATEWAY TO THE WATER.\n" +
          "GOING TO THE EAST BAY? TAKE MUNI TO THE NEAREST BART,\n" +
          "AND DOWNTOWN OAKLAND IS ABOUT THIRTY-FIVE TO FORTY MINUTES —\n" +
          "OR BY CAR, THE BAY BRIDGE GETS YOU THERE TOO.\n" +
          "HEADING NORTH TO MARIN? YOU'RE CLOSE TO THE GOLDEN GATE BRIDGE —\n" +
          "DRIVE OVER TO LARKSPUR IN ABOUT THIRTY MINUTES,\n" +
          "OR TAKE THE LARKSPUR FERRY FROM THE FERRY BUILDING IN ABOUT THIRTY ON THE WATER.\n" +
          "HEADING SOUTH TO THE PENINSULA? TAKE MUNI TO THE CALTRAIN DEPOT\n" +
          "AT 4TH AND KING, AND CALTRAIN RUNS DOWN TO PALO ALTO IN ABOUT FIFTY MINUTES —\n" +
          "OR IT'S 280 OR 101 BY CAR.\n" +
          "BOTTOM LINE: WATER, RAIL, AND THREE BRIDGES — ALL WITHOUT OWNING A CAR.",
        broll: [
          "A 1 California or 2 Clement bus near Lake St",
          "The Ferry Building / a departing ferry",
          "A BART train; the Golden Gate Bridge; the Bay Bridge; a Caltrain at 4th & King",
          "Simple motion-graphic map: Lake Street → Oakland / Larkspur / Palo Alto with the times",
        ],
      },
      {
        label: "6 · THE GROUND UNDER YOU (HAZARDS)",
        words: 110,
        script:
          "TWO QUICK, HONEST NOTES ON THE GROUND ITSELF.\n" +
          "GOOD NEWS FIRST: LAKE STREET SITS INLAND OF THE PRESIDIO BLUFF,\n" +
          "UP ABOVE THE SHORELINE, SO IT IS TYPICALLY NOT IN A TSUNAMI HAZARD ZONE —\n" +
          "STILL, ALWAYS FOLLOW THE OFFICIAL HAZARD FLAGS FOR ANY SPECIFIC ADDRESS.\n" +
          "LIKE MUCH OF SAN FRANCISCO, PARTS OF THE NEIGHBORHOOD\n" +
          "DO FALL WITHIN A STATE-DESIGNATED SEISMIC HAZARD ZONE —\n" +
          "THAT'S STANDARD FOR THE CITY, AND IT'S SOMETHING\n" +
          "EVERY CALIFORNIA BUYER REVIEWS WITH THEIR INSPECTOR AND INSURER.\n" +
          "I PUT THE SEISMIC AND TSUNAMI STATUS RIGHT ON EACH NEIGHBORHOOD'S\n" +
          "DETAILS PAGE, SO YOU CAN CHECK ANY SPECIFIC BLOCK BEFORE YOU WRITE AN OFFER.",
        broll: ["You gesturing toward the Presidio bluff and the shoreline beyond", "Edit: the seismic + tsunami toggles on your fog map"],
      },
      {
        label: "7 · DINING, NIGHTLIFE & DAILY LIFE",
        words: 120,
        script:
          "LET'S TALK DAILY LIFE.\n" +
          "LAKE STREET ITSELF IS QUIET AND RESIDENTIAL — THAT'S THE WHOLE APPEAL —\n" +
          "BUT THE SHOPS, CAFÉS, AND RESTAURANTS ARE JUST A FEW BLOCKS SOUTH,\n" +
          "OVER ON CLEMENT STREET AND CALIFORNIA STREET IN THE RICHMOND,\n" +
          "ONE OF THE CITY'S BEST AND MOST DIVERSE DINING STRIPS.\n" +
          "I'M NOT GOING TO NAME SPECIFIC PLACES ON CAMERA, BECAUSE THE LINEUP CHANGES —\n" +
          "AND I NEVER WANT TO SEND YOU SOMEWHERE THAT'S CLOSED.\n" +
          "INSTEAD, I KEEP A CURRENT, HAND-CHECKED LIST OF THE AREA'S BEST\n" +
          "RESTAURANTS AND BARS RIGHT ON MY LAKE STREET DETAILS PAGE — ALWAYS UP TO DATE.\n" +
          "THE VIBE TO KNOW: A CALM, ELEGANT STREET WITH A LIVELY COMMERCIAL STRIP CLOSE BY.",
        broll: ["A quiet, leafy Lake St block", "The Clement St shopping strip a few blocks south", "Café tables and storefronts (general, not a single endorsement)"],
      },
      {
        label: "8 · REAL ESTATE",
        words: 120,
        script:
          "ON HOUSING: LAKE STREET IS CLASSIC, AFFLUENT RICHMOND —\n" +
          "LARGE, WELL-KEPT EARLY-20TH-CENTURY SINGLE-FAMILY HOMES\n" +
          "IN MEDITERRANEAN, TUDOR, AND PERIOD-REVIVAL STYLES,\n" +
          "WITH SOME FLATS AND CONDOS MIXED IN ON THE EDGES.\n" +
          "IT'S ONE OF THE RICHMOND'S MOST DISTINGUISHED RESIDENTIAL STREETS.\n" +
          "I'M NOT GOING TO QUOTE A MEDIAN PRICE ON CAMERA, BECAUSE THAT NUMBER MOVES.\n" +
          "INSTEAD, I KEEP A LIVE MARKET UPDATE FOR LAKE STREET ON MY SITE —\n" +
          "CURRENT MEDIANS FOR SINGLE-FAMILY HOMES AND FOR CONDOS, RIGHT UP TO TODAY.\n" +
          "THE LINK IS BELOW. THAT'S YOUR SMARTEST FIRST STEP BEFORE YOU EVEN TOUR.",
        broll: ["A grand period-revival home, a Tudor facade, a flats building", "A 'For Sale' sign", "Edit: lower-third + screen-record of your live market page"],
      },
      {
        label: "9 · WHO BELONGS HERE + SIGNATURE OUTRO",
        words: 120,
        script:
          "SO — WHO BELONGS ON LAKE STREET?\n" +
          "SOMEONE WHO WANTS CALM, GREEN, AND ARCHITECTURAL ELEGANCE,\n" +
          "WITH A NATIONAL PARK AT THE DOORSTEP AND THE WHOLE BAY AREA WITHIN REACH.\n" +
          "BUT HERE'S THE THING I'VE LEARNED AFTER ALL THESE YEARS:\n" +
          "EVERY NEIGHBORHOOD IN THIS CITY HAS A STORY LIKE THIS ONE,\n" +
          "AND KNOWING THEM ALL IS THE WORK — THE MICROCLIMATES,\n" +
          "THE STREETS THAT HOLD THEIR VALUE, THE THINGS THAT NEVER SHOW UP IN A SEARCH.\n" +
          "ANYTHING THAT CHANGES — PRICES, THE NEWEST RESTAURANT, WHAT'S FOR SALE —\n" +
          "STAYS CURRENT ON MY LAKE STREET NEIGHBORHOOD PAGE, SO THIS GUIDE NEVER GOES STALE.\n" +
          "SO IF YOU'RE THINKING ABOUT CALLING LAKE STREET HOME,\n" +
          "I'D LOVE TO SHOW YOU AROUND AND HELP CREATE YOUR NEXT LIFE ADVENTURE.",
        broll: ["Golden-hour, unhurried pass down Lake St (you, relaxed, not pitching)", "A quiet look toward the Presidio treeline", "Soft end card: your name + how to reach you"],
      },
    ],
    schedule: [
      { step: "Scout & lock script", detail: "Take the route, mark the 6–8 B-roll stops, finalize edits to this script.", time: "~45 min (day before)" },
      { step: "Golden-hour B-roll", detail: "Shoot the period homes, the Presidio edge, Mountain Lake Park, street life, and housing variety in good light.", time: "30–45 min (early AM or ~1 hr before sunset)" },
      { step: "Talk-to-camera takes", detail: "Shoot each section as its own clip at the relevant spot; 2 takes each; teleprompter on your phone.", time: "60–90 min" },
      { step: "Pickups & cutaways", detail: "Signs, a Presidio trailhead, and a screen-record of your live market page (capture at home).", time: "~15 min" },
      { step: "Edit & caption", detail: "Assemble, add lower-thirds (market URL), burned-in captions, light music bed; export.", time: "2–3 hrs" },
      { step: "Publish & link", detail: "Upload to YouTube, paste the market link in the description — then I add the 'Watch the tour' button to the Lake Street page.", time: "~30 min" },
    ],
    batchTip: "Shoot adjacent hoods the same outing — e.g. Lake Street + Inner Richmond + Presidio Heights in one morning loop.",
  },
"Alamo Square": {
    aka: "Postcard Row",
    runtime: "~10 min (8–10 target)",
    marketLink: "https://www.ur4cast.com/listings?nbhd=Alamo%20Square&layer=nbhd",
    detailsLink: "https://www.ur4cast.com/fog (open the Neighborhoods card → Alamo Square)",
    route: {
      // Route stays ENTIRELY within the Alamo Square boundary (verified against the
      // neighborhood polygon). Coords approximate — snap to the sidewalk grid for the final cut.
      spots: [
        { n: 1, name: "Alamo Square Park crown", note: "Start — the hilltop lawn looking across the Painted Ladies to the downtown skyline", coord: [-122.4350, 37.7765] },
        { n: 2, name: "Postcard Row — 710–720 Steiner St", note: "The six matching 1890s 'Painted Ladies' Victorians", coord: [-122.4329, 37.7761] },
        { n: 3, name: "Mansion row — Fulton St edge", note: "The grand Queen Anne homes anchoring the park's north edge", coord: [-122.4345, 37.7780] },
        { n: 4, name: "Scott St — west park edge", note: "Stately Victorians and Edwardians lining the western slope", coord: [-122.4376, 37.7768] },
        { n: 5, name: "Residential blocks — Pierce & Hayes", note: "Quieter residential streets on the park's south side", coord: [-122.4360, 37.7748] },
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
          "RIGHT NOW I'M AT ALAMO SQUARE, LOOKING AT THE PAINTED LADIES, AND THE SUN IS OUT —\n" +
          "WHICH IS ALREADY THE FIRST THING WORTH KNOWING ABOUT THIS PLACE.\n" +
          "SO — ARE YOU READY TO SEE ALAMO SQUARE? LET'S GO.",
        broll: ["Two-shot idea: a foggy ridge in one frame, sunny Alamo Square in the next", "You moving up onto the park crown into frame", "The Painted Ladies row against the skyline to place us"],
      },
      {
        label: "1 · LOCATION & LAY OF THE LAND",
        words: 195,
        script:
          "FIRST — WHERE ARE WE? ALAMO SQUARE SITS RIGHT IN THE CENTER OF SAN FRANCISCO,\n" +
          "IN THE WESTERN ADDITION, JUST NORTH OF THE DINING CORRIDOR LOCALS CALL NOPA,\n" +
          "WITH THE PANHANDLE BELOW AND HAYES VALLEY OFF TO THE EAST.\n" +
          "THE HEART OF IT IS THE FOUR-ACRE PARK ITSELF, A GRASSY HILLTOP\n" +
          "RINGED BY GRAND VICTORIANS ON EVERY SIDE.\n" +
          "AND IT REALLY IS A HILL — THE LAND RUNS FROM ABOUT 120 FEET\n" +
          "UP TO AROUND 270 FEET AT THE CROWN OF THE SQUARE.\n" +
          "THE PARK'S SLOPES CARRY REAL GRADE, AND THE BLOCKS AROUND IT VARY —\n" +
          "SOME OF THE SURROUNDING FLATS ARE FAIRLY EASY TO GET AROUND,\n" +
          "FRIENDLY WHETHER YOU'RE PUSHING A STROLLER OR ROLLING A WHEELCHAIR,\n" +
          "WHILE THE CLIMB UP TO THE PARK CROWN GETS STEEP FAST,\n" +
          "QUICKLY PASSING WHAT THE A-D-A CONSIDERS AN ACCESSIBLE SLOPE — ABOUT FIVE PERCENT.\n" +
          "AND THE PARK ITSELF HAS STAIRS IN PLACES AS THE PATHS RISE TO THE TOP.\n" +
          "SO IF STEP-FREE, LOW-GRADE ACCESS MATTERS TO YOU, THE SURROUNDING FLATS ARE YOUR FRIEND;\n" +
          "AND BECAUSE MANY OF THESE CLASSIC VICTORIANS SIT UP A FLIGHT OF STAIRS FROM THE SIDEWALK,\n" +
          "IF STEP-FREE ENTRY IS A MUST, IT'S WORTH CHECKING HOME BY HOME.",
        broll: ["Slow pan across the park crown; the lawn rising to the top", "Wide establishing shot: Painted Ladies in the foreground, downtown towers beyond", "A genuinely steep park path or cross-street (show the grade) and the park stairs"],
      },
      {
        label: "2 · HISTORY",
        words: 200,
        script:
          "NOW THE STORY. THE SQUARE WAS NAMED FOR A LONE COTTONWOOD TREE —\n" +
          "'ÁLAMO' IN SPANISH — THAT MARKED A WATERING STOP\n" +
          "ON THE OLD ROAD FROM MISSION DOLORES TO THE PRESIDIO.\n" +
          "ALL OF THIS WAS THE ANCESTRAL LAND OF THE RAMAYTUSH OHLONE LONG BEFORE THAT.\n" +
          "THE FOUR-ACRE PARK WAS RESERVED IN AN 1856 CITY SURVEY UNDER MAYOR JAMES VAN NESS,\n" +
          "AS SAN FRANCISCO PLATTED THE WESTERN ADDITION.\n" +
          "THROUGH THE 1890s THE SURROUNDING BLOCKS FILLED IN\n" +
          "WITH GRAND VICTORIAN AND EDWARDIAN HOMES —\n" +
          "AND HERE'S THE KEY: MANY OF THEM SURVIVED THE 1906 EARTHQUAKE AND FIRES\n" +
          "THAT LEVELED SO MUCH OF THE CITY TO THE EAST.\n" +
          "DEVELOPER MATTHEW KAVANAUGH BUILT THE SIX MATCHING VICTORIANS\n" +
          "AT 710 TO 720 STEINER STREET BETWEEN 1892 AND 1896 —\n" +
          "THE ROW THE WORLD NOW KNOWS AS THE 'PAINTED LADIES.'\n" +
          "WITH THE DOWNTOWN SKYLINE RISING BEHIND THEM, THAT BLOCK BECAME\n" +
          "ONE OF THE MOST PHOTOGRAPHED SIGHTS IN ALL OF SAN FRANCISCO.\n" +
          "SO WHEN YOU SPEND TIME ON THESE STREETS, YOU'RE STANDING IN THE POSTCARD\n" +
          "THAT EVERYONE PICTURES WHEN THEY PICTURE THIS CITY.",
        broll: ["Victorian and Edwardian facades around the square", "The Steiner Street row with the towers beyond", "Wide shot of an unbroken row of original homes"],
      },
      {
        label: "3 · HIDDEN FACTS",
        words: 160,
        script:
          "HERE'S WHAT MOST PEOPLE DON'T KNOW.\n" +
          "THOSE SIX MATCHING VICTORIANS ON STEINER STREET — POSTCARD ROW —\n" +
          "ARE FRAMED SO PERFECTLY AGAINST THE DOWNTOWN TOWERS BECAUSE THE PARK\n" +
          "CLIMBS A RISE RIGHT BEHIND THEM, OPENING A SWEEPING SKYLINE VIEW.\n" +
          "STAND ON THAT CROWN AND YOU GET THE EXACT SHOT YOU'VE SEEN A THOUSAND TIMES.\n" +
          "THE STEINER STREET ROW APPEARS IN THE OPENING CREDITS OF THE SITCOM 'FULL HOUSE' —\n" +
          "THOUGH THE HOUSE USED FOR THE EXTERIOR SHOTS ACTUALLY SITS ACROSS TOWN.\n" +
          "ON THE SQUARE'S NORTHWEST CORNER STANDS THE WESTERFELD HOUSE,\n" +
          "A TOWERING 1889 QUEEN ANNE AT 1198 FULTON STREET\n" +
          "THAT HAS HOUSED RUSSIAN ÉMIGRÉS, A JAZZ CLUB, AND A COMMUNE OF ARTISTS AND FILMMAKERS.\n" +
          "AND BECAUSE THE 1906 FIRES NEVER REACHED HERE,\n" +
          "MANY OF THESE WOODEN HOMES PREDATE THE QUAKE.\n" +
          "THIS IS A NEIGHBORHOOD THAT WEARS ITS POSTCARD FACE OUT LOUD.",
        broll: ["The Painted Ladies framed against the skyline from the park crown", "The Westerfeld House on the northwest corner", "A pre-1906 Victorian detail or date plaque"],
      },
      {
        label: "4 · MICROCLIMATE",
        words: 95,
        script:
          "QUICK WORD ON WEATHER — BECAUSE IN SAN FRANCISCO, MICROCLIMATE IS EVERYTHING.\n" +
          "ALAMO SQUARE SITS IN ONE OF THE CITY'S CENTRAL, GENERALLY SUNNIER POCKETS.\n" +
          "WHILE THE AVENUES OUT WEST DISAPPEAR INTO SUMMER FOG,\n" +
          "THIS HILLTOP — WELL INLAND OF THE COAST — CATCHES THE SUN\n" +
          "AND STAYS WARMER AND BRIGHTER. PEOPLE PAY FOR LIGHT.\n" +
          "I KEEP A LIVE FOG MAP THAT SHOWS THIS NEIGHBORHOOD'S EXACT SUMMER-FOG HOURS\n" +
          "VERSUS THE FOGGY WEST SIDE — IT'S LINKED ON MY ALAMO SQUARE PAGE BELOW.",
        broll: ["Blue sky over the park crown; you in shirtsleeves", "Contrast: fog pouring over the western ridges", "Edit: screen-cap of the Ur4cast fog map"],
      },
      {
        label: "5 · GETTING AROUND — CAR-FREE",
        words: 290,
        script:
          "NOW THE PART THAT REALLY MATTERS IF YOU'RE BUYING HERE:\n" +
          "HOW YOU GET AROUND. ALAMO SQUARE IS A BUS NEIGHBORHOOD, AND A WELL-CONNECTED ONE.\n" +
          "THE 5-FULTON RUNS ALONG THE PARK'S NORTH EDGE STRAIGHT DOWNTOWN,\n" +
          "WITH THE 21-HAYES, THE 22-FILLMORE, AND THE 24\n" +
          "THREADING YOU TO HAYES VALLEY, THE MISSION, AND BEYOND.\n" +
          "THE NEAREST BART AND MUNI METRO ARE AT CIVIC CENTER, JUST A FEW BLOCKS EAST.\n" +
          "NOW LET'S LEAVE THE CITY — CAR-FREE.\n" +
          "THE FERRY BUILDING IS ABOUT TWO AND A HALF MILES NORTHEAST, A SHORT TRANSIT RIDE,\n" +
          "AND THAT'S YOUR GATEWAY TO THE WATER.\n" +
          "GOING TO THE EAST BAY? TAKE A BUS THE FEW BLOCKS TO CIVIC CENTER,\n" +
          "HOP BART, AND DOWNTOWN OAKLAND IS ABOUT THIRTY TO THIRTY-FIVE MINUTES —\n" +
          "OR BY CAR, THE BAY BRIDGE PUTS YOU THERE IN A SIMILAR STRETCH.\n" +
          "HEADING NORTH TO MARIN? THE LARKSPUR FERRY LEAVES FROM THE FERRY BUILDING\n" +
          "AND CROSSES IN ABOUT THIRTY MINUTES ON THE WATER —\n" +
          "OR DRIVE THE GOLDEN GATE BRIDGE.\n" +
          "HEADING SOUTH TO THE PENINSULA? TAKE TRANSIT TO THE CALTRAIN DEPOT\n" +
          "AT 4TH AND KING, AND CALTRAIN RUNS DOWN TO PALO ALTO IN ABOUT FIFTY MINUTES —\n" +
          "OR IT'S ROUGHLY THE SAME BY CAR ON 280 OR 101.\n" +
          "BOTTOM LINE: WATER, RAIL, AND THREE BRIDGES — ALL WITHOUT OWNING A CAR.",
        broll: [
          "A 5-Fulton or 21-Hayes bus along the park edge",
          "The Civic Center BART/Muni Metro entrance a few blocks east; the Ferry Building / a departing ferry",
          "A BART train; the Bay Bridge; the Golden Gate Bridge; a Caltrain at 4th & King",
          "Simple motion-graphic map: Alamo Square → Oakland / Larkspur / Palo Alto with the times",
        ],
      },
      {
        label: "6 · THE GROUND UNDER YOU (HAZARDS)",
        words: 110,
        script:
          "TWO QUICK, HONEST NOTES ON THE GROUND ITSELF.\n" +
          "GOOD NEWS FIRST: ALAMO SQUARE SITS UP ON A HILLTOP, WELL INLAND AND ABOVE THE BAY,\n" +
          "SO IT IS NOT IN A TSUNAMI HAZARD ZONE — CROSS THAT WORRY OFF THE LIST.\n" +
          "LIKE MUCH OF HILLY SAN FRANCISCO, PARTS OF THE NEIGHBORHOOD\n" +
          "DO FALL WITHIN A STATE-DESIGNATED SEISMIC HAZARD ZONE —\n" +
          "THAT'S STANDARD FOR THE CITY'S SLOPES, AND IT'S SOMETHING\n" +
          "EVERY CALIFORNIA BUYER REVIEWS WITH THEIR INSPECTOR AND INSURER.\n" +
          "I PUT THE SEISMIC AND TSUNAMI STATUS RIGHT ON EACH NEIGHBORHOOD'S\n" +
          "DETAILS PAGE, SO YOU CAN CHECK ANY SPECIFIC BLOCK BEFORE YOU WRITE AN OFFER.",
        broll: ["You gesturing across the hilltop and the city below", "Edit: the seismic + tsunami toggles on your fog map"],
      },
      {
        label: "7 · DINING, NIGHTLIFE & DAILY LIFE",
        words: 120,
        script:
          "LET'S TALK DAILY LIFE.\n" +
          "JUST DOWN THE HILL IS THE DINING CORRIDOR LOCALS CALL NOPA —\n" +
          "FOR 'NORTH OF THE PANHANDLE' — ONE OF THE LIVELIEST FOOD SCENES IN THE CITY,\n" +
          "WITH COFFEE, BRUNCH, RESTAURANTS, AND EASYGOING NEIGHBORHOOD BARS.\n" +
          "I'M NOT GOING TO NAME SPECIFIC PLACES ON CAMERA, BECAUSE THE LINEUP CHANGES —\n" +
          "AND I NEVER WANT TO SEND YOU SOMEWHERE THAT'S CLOSED.\n" +
          "INSTEAD, I KEEP A CURRENT, HAND-CHECKED LIST OF THE NEIGHBORHOOD'S BEST\n" +
          "RESTAURANTS AND BARS RIGHT ON MY ALAMO SQUARE DETAILS PAGE — ALWAYS UP TO DATE.\n" +
          "THE VIBE TO KNOW: THIS IS A POSTCARD-VIEW HILLTOP\n" +
          "WITH A LIVELY DINING STRIP RIGHT AT ITS FOOT.",
        broll: ["Café tables along Divisadero at dusk", "A busy restaurant window; people out on the strip", "A relaxed neighborhood bar (general, not a single endorsement)"],
      },
      {
        label: "8 · REAL ESTATE",
        words: 120,
        script:
          "ON HOUSING: ALAMO SQUARE IS CLASSIC SAN FRANCISCO —\n" +
          "GRAND VICTORIAN AND EDWARDIAN HOMES RINGING THE PARK,\n" +
          "MANY DIVIDED INTO FLATS, ALONGSIDE SINGLE-FAMILY SHOWPIECES\n" +
          "AND SOME CONDOS AND T-I-C UNITS ON THE SURROUNDING BLOCKS.\n" +
          "IT RUNS FROM A FIRST CONDO TO A FULLY RESTORED VICTORIAN SHOWPIECE.\n" +
          "I'M NOT GOING TO QUOTE A MEDIAN PRICE ON CAMERA, BECAUSE THAT NUMBER MOVES.\n" +
          "INSTEAD, I KEEP A LIVE MARKET UPDATE FOR ALAMO SQUARE ON MY SITE —\n" +
          "CURRENT MEDIANS FOR SINGLE-FAMILY HOMES AND FOR CONDOS, RIGHT UP TO TODAY.\n" +
          "THE LINK IS BELOW. THAT'S YOUR SMARTEST FIRST STEP BEFORE YOU EVEN TOUR.",
        broll: ["A painted Victorian, a flats building, a modern condo entry", "A 'For Sale' sign", "Edit: lower-third + screen-record of your live market page"],
      },
      {
        label: "9 · WHO BELONGS HERE + SIGNATURE OUTRO",
        words: 120,
        script:
          "SO — WHO BELONGS IN ALAMO SQUARE?\n" +
          "SOMEONE WHO WANTS THE POSTCARD — LIGHT, A HILLTOP VIEW, AND GRAND VICTORIANS —\n" +
          "WITH THE WHOLE BAY AREA A TRAIN OR A FERRY AWAY, AND NEVER NEEDS A CAR.\n" +
          "BUT HERE'S THE THING I'VE LEARNED AFTER ALL THESE YEARS:\n" +
          "EVERY NEIGHBORHOOD IN THIS CITY HAS A STORY LIKE THIS ONE,\n" +
          "AND KNOWING THEM ALL IS THE WORK — THE MICROCLIMATES,\n" +
          "THE STREETS THAT HOLD THEIR VALUE, THE THINGS THAT NEVER SHOW UP IN A SEARCH.\n" +
          "ANYTHING THAT CHANGES — PRICES, THE NEWEST RESTAURANT, WHAT'S FOR SALE —\n" +
          "STAYS CURRENT ON MY ALAMO SQUARE NEIGHBORHOOD PAGE, SO THIS GUIDE NEVER GOES STALE.\n" +
          "SO IF YOU'RE THINKING ABOUT CALLING ALAMO SQUARE HOME, I'D LOVE TO SHOW YOU AROUND AND HELP CREATE YOUR NEXT LIFE ADVENTURE.",
        broll: ["Golden-hour, unhurried pass across the park crown (you, relaxed, not pitching)", "A quiet look out over the Painted Ladies and the skyline", "Soft end card: your name + how to reach you"],
      },
    ],
    schedule: [
      { step: "Scout & lock script", detail: "Take the route, mark the 6–8 B-roll stops, finalize edits to this script.", time: "~45 min (day before)" },
      { step: "Golden-hour B-roll", detail: "Shoot the Painted Ladies + skyline, the park crown, the mansion rows, and housing variety in good light.", time: "30–45 min (early AM or ~1 hr before sunset)" },
      { step: "Talk-to-camera takes", detail: "Shoot each section as its own clip at the relevant spot; 2 takes each; teleprompter on your phone.", time: "60–90 min" },
      { step: "Pickups & cutaways", detail: "Signs, a bus along the park edge, and a screen-record of your live market page (capture at home).", time: "~15 min" },
      { step: "Edit & caption", detail: "Assemble, add lower-thirds (market URL), burned-in captions, light music bed; export.", time: "2–3 hrs" },
      { step: "Publish & link", detail: "Upload to YouTube, paste the market link in the description — then I add the 'Watch the tour' button to the Alamo Square page.", time: "~30 min" },
    ],
    batchTip: "Shoot adjacent hoods the same outing — e.g. Alamo Square + Panhandle + Western Addition in one morning loop.",
  },
"St. Francis Wood": {
    runtime: "~10 min (8–10 target)",
    marketLink: "https://www.ur4cast.com/listings?nbhd=St.%20Francis%20Wood&layer=nbhd",
    detailsLink: "https://www.ur4cast.com/fog (open the Neighborhoods card → St. Francis Wood)",
    route: {
      // Route stays ENTIRELY within the St. Francis Wood boundary (verified against the
      // neighborhood polygon). Coords approximate — snap to the sidewalk grid for the final cut.
      spots: [
        { n: 1, name: "St. Francis Wood fountain on San Anselmo Avenue", note: "Start — the lower Renaissance fountain on the central median", coord: [-122.4660, 37.7363] },
        { n: 2, name: "The upper fountain & cascade, St. Francis Boulevard", note: "The monumental Gutterson fountain terracing up the green slope", coord: [-122.4665, 37.7345] },
        { n: 3, name: "Grand terraced homes on Santa Ana Avenue", note: "Period-revival showpieces set up steps and terraces", coord: [-122.4680, 37.7350] },
        { n: 4, name: "A curving garden-suburb street (Yerba Buena Ave)", note: "The Olmsted curvilinear plan following the hillside", coord: [-122.4684, 37.7368] },
        { n: 5, name: "The West Portal-side entry gates", note: "John Galen Howard's gates at the downhill edge toward West Portal", coord: [-122.4635, 37.7390] },
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
          "RIGHT NOW I'M AT THE ST. FRANCIS WOOD FOUNTAIN ON SAN ANSELMO AVENUE, AND THE FOG IS ROLLING IN —\n" +
          "WHICH IS ALREADY THE FIRST THING WORTH KNOWING ABOUT THIS PLACE.\n" +
          "SO — ARE YOU READY TO SEE ST. FRANCIS WOOD? LET'S GO.",
        broll: ["Two-shot idea: a sunny ridge in one frame, fog drifting over St. Francis Wood in the next", "You walking up to the lower fountain into frame", "The fountain / curving boulevard to place us"],
      },
      {
        label: "1 · LOCATION & LAY OF THE LAND",
        words: 195,
        script:
          "FIRST — WHERE ARE WE? ST. FRANCIS WOOD SITS WEST OF TWIN PEAKS,\n" +
          "ON THE GREEN SLOPE BELOW MOUNT DAVIDSON,\n" +
          "WITH WEST PORTAL JUST DOWNHILL AND FOREST HILL OVER THE RIDGE.\n" +
          "THIS IS A PLANNED GARDEN SUBURB FROM 1912 — A 'RESIDENCE PARK' —\n" +
          "WITH CURVING, TREE-LINED STREETS LAID OUT TO FOLLOW THE HILLSIDE\n" +
          "AND TWO FORMAL FOUNTAINS TERRACING UP THE CENTRAL BOULEVARD.\n" +
          "THE LAND RUNS FROM ABOUT 270 FEET DOWN HERE\n" +
          "UP TO AROUND 520 FEET AT THE TOP BY MOUNT DAVIDSON.\n" +
          "THE GRADE IS A GENTLE, ROLLING ONE — EASIER THAN MOST WEST-SIDE HILLS —\n" +
          "BUT THESE CURVING STREETS STILL CLIMB,\n" +
          "AND IN PLACES THEY PASS WHAT THE A-D-A CONSIDERS AN ACCESSIBLE SLOPE — ABOUT FIVE PERCENT.\n" +
          "SO IF STEP-FREE, LOW-GRADE ACCESS MATTERS TO YOU,\n" +
          "THE LOWER BOULEVARD IS YOUR FRIEND; THE UPPER BLOCKS ARE MORE OF A CLIMB.\n" +
          "AND THE HOMES THEMSELVES MATTER TOO —\n" +
          "MANY OF THESE GRAND HOUSES SIT UP A FLIGHT OF STEPS AND TERRACES FROM THE SIDEWALK,\n" +
          "SO IF STEP-FREE ENTRY IS A MUST, IT'S WORTH CHECKING HOME BY HOME.",
        broll: ["Slow pan up St. Francis Boulevard; the curving median", "Wide establishing shot showing the slope up toward Mount Davidson", "A grand home set up steps and terraces (show the grade)"],
      },
      {
        label: "2 · HISTORY",
        words: 200,
        script:
          "NOW THE STORY. ST. FRANCIS WOOD IS A FAMOUS GARDEN ENCLAVE —\n" +
          "ONE OF CALIFORNIA'S FIRST PLANNED 'RESIDENCE PARKS,'\n" +
          "LAUNCHED IN 1912 BY THE MASON-MCDUFFIE COMPANY\n" +
          "ON FORMER SUTRO LAND.\n" +
          "ALL OF THIS WAS THE ANCESTRAL LAND OF THE RAMAYTUSH OHLONE LONG BEFORE THAT.\n" +
          "DUNCAN MCDUFFIE HIRED THE FAMED OLMSTED BROTHERS FIRM\n" +
          "TO LAY CURVING STREETS ALONG THE NATURAL TOPOGRAPHY,\n" +
          "RATHER THAN FORCE A RIGID GRID ONTO THE HILLSIDE.\n" +
          "ARCHITECT JOHN GALEN HOWARD DESIGNED THE ENTRY GATES, THE LAMPPOSTS,\n" +
          "AND THE LOWER FOUNTAIN; HENRY GUTTERSON SUCCEEDED HIM\n" +
          "AND SHAPED THE MONUMENTAL UPPER FOUNTAIN AND CASCADE\n" +
          "ON THE CENTRAL MEDIAN — EVOKING ITALIAN RENAISSANCE GARDENS.\n" +
          "MOST OF THE GRAND HOMES ROSE IN THE 1920s,\n" +
          "MANY OF THEM DESIGNED BY GUTTERSON HIMSELF\n" +
          "ACROSS THREE DECADES AS SUPERVISING ARCHITECT.\n" +
          "IN 2022, AFTER A RESIDENT-LED CAMPAIGN,\n" +
          "THE WHOLE DISTRICT JOINED THE NATIONAL REGISTER OF HISTORIC PLACES.\n" +
          "SO WHEN YOU SPEND TIME ON THESE BLOCKS,\n" +
          "YOU'RE EXPLORING A CENTURY-OLD PIECE OF CITY PLANNING THAT STILL WORKS.",
        broll: ["The lower fountain and entry gates", "The upper fountain / cascade on the boulevard median", "A row of period-revival homes along Santa Ana Ave"],
      },
      {
        label: "3 · HIDDEN FACTS",
        words: 160,
        script:
          "HERE'S WHAT MOST PEOPLE DON'T KNOW.\n" +
          "THE WHOLE PLACE WAS MARKETED AS A 'RESIDENCE PARK,'\n" +
          "WITH LOTS ROUGHLY TWICE THE SIZE OF AN ORDINARY CITY LOT,\n" +
          "AND DEED RESTRICTIONS MEANT TO KEEP IT PARKLIKE IN PERPETUITY.\n" +
          "THOSE TWO FORMAL FOUNTAINS ON THE BOULEVARD WEREN'T AN AFTERTHOUGHT —\n" +
          "THEY WERE THE CENTERPIECE, EVOKING ITALIAN RENAISSANCE GARDENS,\n" +
          "ONE BY JOHN GALEN HOWARD AND THE MONUMENTAL UPPER ONE BY HENRY GUTTERSON.\n" +
          "EVEN THE SIDEWALKS WERE PART OF THE DESIGN —\n" +
          "BRICK-DIAMOND PATTERNS AND LANDSCAPED MEDIANS THROUGHOUT.\n" +
          "AND THOSE CURVING STREETS? THEY FOLLOW THE OLMSTED BROTHERS' PLAN\n" +
          "TO TRACE THE HILLSIDE'S NATURAL CONTOURS, NOT A GRID.\n" +
          "THIS IS A NEIGHBORHOOD THAT WAS DESIGNED, DOWN TO THE LAMPPOSTS,\n" +
          "TO FEEL LIKE A PARK YOU GET TO LIVE INSIDE.",
        broll: ["Brick-diamond sidewalk detail", "The Renaissance fountains tight shot", "A curving, tree-lined street following the slope"],
      },
      {
        label: "4 · MICROCLIMATE",
        words: 95,
        script:
          "QUICK WORD ON WEATHER — BECAUSE IN SAN FRANCISCO, MICROCLIMATE IS EVERYTHING.\n" +
          "ST. FRANCIS WOOD SITS ON THE WEST SIDE OF TWIN PEAKS,\n" +
          "SO IT OFTEN CATCHES THE FOG THAT ROLLS IN OFF THE PACIFIC —\n" +
          "SOME MORNINGS AND EVENINGS ARE GRAY AND COOL,\n" +
          "AND OTHER POCKETS OF THE DAY OPEN UP BRIGHT.\n" +
          "IT'S A MIXED, FOG-LEANING SPOT — AND THAT GREEN, LEAFY FEEL\n" +
          "IS PART OF WHAT THE COOLER, DAMPER AIR GIVES YOU.\n" +
          "I KEEP A LIVE FOG MAP THAT SHOWS THIS NEIGHBORHOOD'S EXACT SUMMER-FOG HOURS\n" +
          "VERSUS THE SUNNIER EAST SIDE — IT'S LINKED ON MY ST. FRANCIS WOOD PAGE BELOW.",
        broll: ["Fog drifting over the slope toward Mount Davidson", "The green, leafy streets under gray light", "Edit: screen-cap of the Ur4cast fog map"],
      },
      {
        label: "5 · GETTING AROUND — CAR-FREE",
        words: 290,
        script:
          "NOW THE PART THAT REALLY MATTERS IF YOU'RE BUYING HERE:\n" +
          "HOW YOU GET AROUND. ST. FRANCIS WOOD LEANS ON WEST PORTAL,\n" +
          "JUST DOWNHILL, FOR ITS TRANSIT — AND IT'S A GOOD HUB.\n" +
          "AT WEST PORTAL STATION YOU'VE GOT THE K-INGLESIDE AND M-OCEAN VIEW MUNI METRO LINES\n" +
          "RUNNING THROUGH THE TWIN PEAKS TUNNEL STRAIGHT DOWNTOWN,\n" +
          "PLUS THE 44 O'SHAUGHNESSY AND THE 17 PARKMERCED BUSES\n" +
          "LINKING YOU ACROSS THE SOUTH AND WEST OF THE CITY.\n" +
          "NOW LET'S LEAVE THE CITY — CAR-FREE.\n" +
          "THE FERRY BUILDING IS ABOUT FIVE AND A HALF MILES NORTHEAST,\n" +
          "A MUNI METRO RIDE AWAY THROUGH THE TUNNEL,\n" +
          "AND THAT'S YOUR GATEWAY TO THE WATER.\n" +
          "GOING TO THE EAST BAY? TAKE MUNI DOWNTOWN AND HOP BART —\n" +
          "DOWNTOWN OAKLAND IS ABOUT FORTY-FIVE MINUTES ALL TOLD,\n" +
          "OR BY CAR THE BAY BRIDGE GETS YOU THERE.\n" +
          "HEADING NORTH TO MARIN? TAKE MUNI TO THE FERRY BUILDING,\n" +
          "AND THE LARKSPUR FERRY CROSSES IN ABOUT THIRTY MINUTES ON THE WATER —\n" +
          "OR DRIVE THE GOLDEN GATE BRIDGE.\n" +
          "HEADING SOUTH TO THE PENINSULA? TAKE MUNI TO THE CALTRAIN DEPOT\n" +
          "AT 4TH AND KING, AND CALTRAIN RUNS DOWN TO PALO ALTO IN ABOUT FIFTY MINUTES —\n" +
          "OR IT'S 280 OR 101 BY CAR.\n" +
          "BOTTOM LINE: WATER, RAIL, AND THREE BRIDGES — ALL FROM A QUIET GARDEN SUBURB,\n" +
          "WITHOUT OWNING A CAR.",
        broll: [
          "West Portal Station entrance; a Muni Metro train into the tunnel",
          "The Ferry Building / a departing ferry",
          "A BART train; the Bay Bridge; the Golden Gate Bridge; a Caltrain at 4th & King",
          "Simple motion-graphic map: St. Francis Wood → Oakland / Larkspur / Palo Alto with the times",
        ],
      },
      {
        label: "6 · THE GROUND UNDER YOU (HAZARDS)",
        words: 110,
        script:
          "TWO QUICK, HONEST NOTES ON THE GROUND ITSELF.\n" +
          "GOOD NEWS FIRST: ST. FRANCIS WOOD SITS HIGH ON THE INLAND SLOPE,\n" +
          "WELL ABOVE THE BAY AND THE OCEAN,\n" +
          "SO IT IS NOT IN A TSUNAMI HAZARD ZONE — CROSS THAT WORRY OFF THE LIST.\n" +
          "LIKE MUCH OF HILLY SAN FRANCISCO, PARTS OF THE NEIGHBORHOOD\n" +
          "DO FALL WITHIN A STATE-DESIGNATED SEISMIC HAZARD ZONE —\n" +
          "THAT'S STANDARD FOR THE CITY'S SLOPES, AND IT'S SOMETHING\n" +
          "EVERY CALIFORNIA BUYER REVIEWS WITH THEIR INSPECTOR AND INSURER.\n" +
          "I PUT THE SEISMIC AND TSUNAMI STATUS RIGHT ON EACH NEIGHBORHOOD'S\n" +
          "DETAILS PAGE, SO YOU CAN CHECK ANY SPECIFIC BLOCK BEFORE YOU WRITE AN OFFER.",
        broll: ["You gesturing up the slope toward Mount Davidson", "Edit: the seismic + tsunami toggles on your fog map"],
      },
      {
        label: "7 · DINING, NIGHTLIFE & DAILY LIFE",
        words: 120,
        script:
          "LET'S TALK DAILY LIFE.\n" +
          "ST. FRANCIS WOOD ITSELF IS PURELY RESIDENTIAL BY DESIGN —\n" +
          "NO SHOPS, NO RESTAURANTS, JUST GREEN STREETS AND GRAND HOMES.\n" +
          "BUT THE SHOPS ARE RIGHT DOWNHILL IN WEST PORTAL,\n" +
          "A VILLAGE-Y AVENUE OF CAFÉS, RESTAURANTS, AND EVERYDAY ERRANDS.\n" +
          "I'M NOT GOING TO NAME SPECIFIC PLACES ON CAMERA, BECAUSE THE LINEUP CHANGES —\n" +
          "AND I NEVER WANT TO SEND YOU SOMEWHERE THAT'S CLOSED.\n" +
          "INSTEAD, I KEEP A CURRENT, HAND-CHECKED LIST OF THE BEST NEARBY\n" +
          "RESTAURANTS AND BARS RIGHT ON MY ST. FRANCIS WOOD DETAILS PAGE — ALWAYS UP TO DATE.\n" +
          "THE VIBE TO KNOW: THIS IS A QUIET, LEAFY RETREAT WITH A REAL MAIN STREET A FEW MINUTES DOWNHILL.",
        broll: ["The quiet, green residential streets", "West Portal Avenue storefronts down the hill", "A café table on the avenue (general, not a single endorsement)"],
      },
      {
        label: "8 · REAL ESTATE",
        words: 120,
        script:
          "ON HOUSING: ST. FRANCIS WOOD IS A PLANNED ENCLAVE OF GRAND SINGLE-FAMILY HOMES —\n" +
          "PERIOD-REVIVAL HOUSES FROM THE 1920s, MANY BY NOTABLE ARCHITECTS,\n" +
          "ON LOTS ROUGHLY TWICE THE SIZE OF AN ORDINARY CITY LOT.\n" +
          "IT'S ONE OF THE CITY'S MOST ARCHITECTURALLY DISTINCT NEIGHBORHOODS,\n" +
          "AND THE HOMES RANGE FROM HANDSOME TO LANDMARK SHOWPIECE.\n" +
          "I'M NOT GOING TO QUOTE A MEDIAN PRICE ON CAMERA, BECAUSE THAT NUMBER MOVES.\n" +
          "INSTEAD, I KEEP A LIVE MARKET UPDATE FOR ST. FRANCIS WOOD ON MY SITE —\n" +
          "CURRENT MEDIANS, RIGHT UP TO TODAY.\n" +
          "THE LINK IS BELOW. THAT'S YOUR SMARTEST FIRST STEP BEFORE YOU EVEN TOUR.",
        broll: ["A grand period-revival home; a terraced garden entry", "A 'For Sale' sign", "Edit: lower-third + screen-record of your live market page"],
      },
      {
        label: "9 · WHO BELONGS HERE + SIGNATURE OUTRO",
        words: 120,
        script:
          "SO — WHO BELONGS IN ST. FRANCIS WOOD?\n" +
          "SOMEONE WHO WANTS SPACE, QUIET, AND A GRAND ARCHITECT-DESIGNED HOME\n" +
          "ON A GREEN, PARKLIKE STREET, WITH A MAIN STREET AND THE METRO A FEW MINUTES DOWNHILL.\n" +
          "BUT HERE'S THE THING I'VE LEARNED AFTER ALL THESE YEARS:\n" +
          "EVERY NEIGHBORHOOD IN THIS CITY HAS A STORY LIKE THIS ONE,\n" +
          "AND KNOWING THEM ALL IS THE WORK — THE MICROCLIMATES,\n" +
          "THE STREETS THAT HOLD THEIR VALUE, THE THINGS THAT NEVER SHOW UP IN A SEARCH.\n" +
          "ANYTHING THAT CHANGES — PRICES, THE NEWEST RESTAURANT, WHAT'S FOR SALE —\n" +
          "STAYS CURRENT ON MY ST. FRANCIS WOOD NEIGHBORHOOD PAGE, SO THIS GUIDE NEVER GOES STALE.\n" +
          "SO IF YOU'RE THINKING ABOUT CALLING ST. FRANCIS WOOD HOME,\n" +
          "I'D LOVE TO SHOW YOU AROUND AND HELP CREATE YOUR NEXT LIFE ADVENTURE.",
        broll: ["Golden-hour, unhurried pass along the boulevard (you, relaxed, not pitching)", "A quiet look up the slope toward Mount Davidson", "Soft end card: your name + how to reach you"],
      },
    ],
    schedule: [
      { step: "Scout & lock script", detail: "Take the route, mark the 6–8 B-roll stops, finalize edits to this script.", time: "~45 min (day before)" },
      { step: "Golden-hour B-roll", detail: "Shoot the two fountains, the curving streets, the grand terraced homes, and the brick-diamond sidewalks in good light.", time: "30–45 min (early AM or ~1 hr before sunset)" },
      { step: "Talk-to-camera takes", detail: "Shoot each section as its own clip at the relevant spot; 2 takes each; teleprompter on your phone.", time: "60–90 min" },
      { step: "Pickups & cutaways", detail: "The entry gates, West Portal Station, and a screen-record of your live market page (capture at home).", time: "~15 min" },
      { step: "Edit & caption", detail: "Assemble, add lower-thirds (market URL), burned-in captions, light music bed; export.", time: "2–3 hrs" },
      { step: "Publish & link", detail: "Upload to YouTube, paste the market link in the description — then I add the 'Watch the tour' button to the St. Francis Wood page.", time: "~30 min" },
    ],
    batchTip: "Shoot adjacent hoods the same outing — e.g. St. Francis Wood + West Portal + Forest Hill in one morning loop.",
  },
"Haight Ashbury": {
    aka: "The Haight",
    runtime: "~10 min (8–10 target)",
    marketLink: "https://www.ur4cast.com/listings?nbhd=Haight%20Ashbury&layer=nbhd",
    detailsLink: "https://www.ur4cast.com/fog (open the Neighborhoods card → Haight Ashbury)",
    route: {
      // Route stays ENTIRELY within the Haight Ashbury boundary (verified against the
      // neighborhood polygon). Coords approximate — snap to the sidewalk grid for the final cut.
      spots: [
        { n: 1, name: "Haight & Ashbury", note: "Start — the famous corner, the clock stuck at 4:20", coord: [-122.4466, 37.7700] },
        { n: 2, name: "Haight Street strip", note: "The level commercial spine — record shops, vintage, cafés", coord: [-122.4490, 37.7699] },
        { n: 3, name: "710 Ashbury — the hippie houses", note: "The Grateful Dead house and the Victorian counterculture blocks", coord: [-122.4464, 37.7708] },
        { n: 4, name: "Lyon & the Panhandle edge", note: "Janis Joplin's old block; green strip toward Golden Gate Park", coord: [-122.4452, 37.7718] },
        { n: 5, name: "Upper Haight near Stanyan", note: "West end of the strip, the Golden Gate Park gateway", coord: [-122.4533, 37.7697] },
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
          "RIGHT NOW I'M AT HAIGHT AND ASHBURY, AND THE FOG IS ROLLING IN —\n" +
          "WHICH IS ALREADY THE FIRST THING WORTH KNOWING ABOUT THIS PLACE.\n" +
          "SO — ARE YOU READY TO SEE THE HAIGHT? LET'S GO.",
        broll: ["Two-shot idea: a foggy ridge in one frame, the Haight & Ashbury corner in the next", "You moving up Haight St into frame", "The famous corner street sign / the stuck clock to place us"],
      },
      {
        label: "1 · LOCATION & LAY OF THE LAND",
        words: 195,
        script:
          "FIRST — WHERE ARE WE? THE HAIGHT SITS RIGHT IN THE MIDDLE OF SAN FRANCISCO,\n" +
          "NORTHWEST OF THE CASTRO AND WEST OF THE WESTERN ADDITION,\n" +
          "WITH BUENA VISTA PARK RISING TO THE EAST\n" +
          "AND GOLDEN GATE PARK SPREADING OUT JUST PAST ITS WESTERN EDGE.\n" +
          "THE MAIN SPINE IS HAIGHT STREET, A LIVELY SHOPPING STRIP\n" +
          "RUNNING WEST TOWARD STANYAN AND THE PARK.\n" +
          "THE LAND HERE RUNS FROM ABOUT 230 FEET UP TO AROUND 370 FEET.\n" +
          "ALONG THE HAIGHT STREET STRIP THE GRADE IS FAIRLY LEVEL AND EASY TO GET AROUND —\n" +
          "FRIENDLY WHETHER YOU'RE PUSHING A STROLLER OR ROLLING A WHEELCHAIR.\n" +
          "BUT THE BLOCKS THAT CLIMB TOWARD BUENA VISTA AND ASHBURY HEIGHTS RISE FAST,\n" +
          "QUICKLY PASSING WHAT THE A-D-A CONSIDERS AN ACCESSIBLE SLOPE — ABOUT FIVE PERCENT.\n" +
          "SO IF STEP-FREE, LOW-GRADE ACCESS MATTERS TO YOU,\n" +
          "THE STRIP ITSELF IS YOUR FRIEND; THE UPPER BLOCKS ARE A CLIMB.\n" +
          "AND THE HOMES THEMSELVES MATTER TOO —\n" +
          "MANY OF THESE CLASSIC VICTORIANS SIT UP A FLIGHT OF STAIRS FROM THE SIDEWALK,\n" +
          "SO IF STEP-FREE ENTRY IS A MUST, IT'S WORTH CHECKING HOME BY HOME.",
        broll: ["Slow pan up Haight St; street signs at Haight & Ashbury", "Wide establishing shot showing the strip + the Buena Vista rise", "A genuinely steep cross-street climbing toward Ashbury Heights (show the grade)"],
      },
      {
        label: "2 · HISTORY",
        words: 200,
        script:
          "NOW THE STORY. THE HAIGHT TAKES ITS NAME FROM HENRY HAIGHT,\n" +
          "A PIONEER BANKER, AND FROM MONROE ASHBURY,\n" +
          "AN EARLY SAN FRANCISCO SUPERVISOR WHO HELPED SHAPE THE ADJACENT PARK LAND.\n" +
          "ALL OF THIS WAS THE ANCESTRAL LAND OF THE RAMAYTUSH OHLONE LONG BEFORE THAT.\n" +
          "THE DISTRICT FILLED WITH VICTORIAN FLATS AFTER THE 1880s\n" +
          "AS A STREETCAR SUBURB ON THE EDGE OF THE NEW GOLDEN GATE PARK.\n" +
          "THEN CAME THE TURN THAT MADE IT FAMOUS.\n" +
          "BY THE 1960s, CHEAP RENTS IN THOSE BIG SUBDIVIDED VICTORIANS\n" +
          "DREW ARTISTS, STUDENTS, AND MUSICIANS —\n" +
          "AND IN 1967 THE CORNER OF HAIGHT AND ASHBURY BECAME\n" +
          "THE EPICENTER OF THE HIPPIE MOVEMENT.\n" +
          "DURING THE SUMMER OF LOVE, AN ESTIMATED HUNDRED THOUSAND YOUNG PEOPLE\n" +
          "CONVERGED ON THESE BLOCKS, AND THE NEIGHBORHOOD BIRTHED A WHOLE COUNTERCULTURE\n" +
          "OF MUSIC, PROTEST, AND PSYCHEDELIA.\n" +
          "THE GRATEFUL DEAD AND JANIS JOPLIN BOTH LIVED RIGHT HERE.\n" +
          "AND THROUGH ALL OF IT, BLOCK AFTER BLOCK OF ORIGINAL VICTORIANS STILL STANDS.\n" +
          "SPEND TIME ON THESE STREETS, AND YOU'RE STANDING IN LIVING CULTURAL HISTORY.",
        broll: ["Victorian facades along the residential blocks", "710 Ashbury St — the Grateful Dead house", "Wide shot of an unbroken row of original Victorians"],
      },
      {
        label: "3 · HIDDEN FACTS",
        words: 160,
        script:
          "HERE'S WHAT MOST PEOPLE DON'T KNOW.\n" +
          "THE GRATEFUL DEAD LIVED COMMUNALLY AT 710 ASHBURY STREET\n" +
          "FROM 1966 TO 1968 — A VICTORIAN THAT BECAME A COUNTERCULTURE LANDMARK.\n" +
          "JANIS JOPLIN LIVED JUST UP AT 122 LYON STREET, NEAR THE PANHANDLE,\n" +
          "DURING HER RISE TO FAME IN THE LATE SIXTIES.\n" +
          "THAT CLOCK ON THE CORNER BUILDING AT HAIGHT AND ASHBURY?\n" +
          "IT'S FAMOUSLY STUCK AT 4:20 — AND THAT STREET SIGN IS\n" +
          "AMONG THE MOST PHOTOGRAPHED IN THE WHOLE CITY.\n" +
          "JUST INSIDE GOLDEN GATE PARK, BY THE HAIGHT STREET ENTRANCE,\n" +
          "SITS HIPPIE HILL — A GRASSY GATHERING SPOT FOR DRUM CIRCLES SINCE THE 1960s,\n" +
          "AND THE SITE OF AN ENORMOUS UNOFFICIAL 4/20 CELEBRATION EVERY YEAR.\n" +
          "THIS IS A NEIGHBORHOOD THAT WEARS ITS HISTORY OUT LOUD.",
        broll: ["The stuck 4:20 clock on the corner building", "710 Ashbury St plaque / facade", "Hippie Hill / the Golden Gate Park entrance at Haight St"],
      },
      {
        label: "4 · MICROCLIMATE",
        words: 95,
        script:
          "QUICK WORD ON WEATHER — BECAUSE IN SAN FRANCISCO, MICROCLIMATE IS EVERYTHING.\n" +
          "THE UPPER HAIGHT SITS RIGHT BY THE GAP THAT OPENS TOWARD GOLDEN GATE PARK\n" +
          "AND THE SUTRO RIDGE, SO IT CATCHES THE AFTERNOON FOG\n" +
          "THAT ROLLS IN OFF THE OCEAN ON SUMMER DAYS.\n" +
          "MORNINGS CAN BREAK BRIGHT AND CLEAR, THEN GREY OVER BY MID-AFTERNOON.\n" +
          "IT'S A MIXED, HONEST READ — NOT THE SUNNIEST POCKET IN TOWN.\n" +
          "I KEEP A LIVE FOG MAP THAT SHOWS THIS NEIGHBORHOOD'S EXACT SUMMER-FOG HOURS\n" +
          "VERSUS THE SUNNIER EAST SIDE — IT'S LINKED ON MY HAIGHT PAGE BELOW.",
        broll: ["Fog spilling over the Sutro ridge toward the strip", "Bright morning light on Haight St vs. grey afternoon", "Edit: screen-cap of the Ur4cast fog map"],
      },
      {
        label: "5 · GETTING AROUND — CAR-FREE",
        words: 290,
        script:
          "NOW THE PART THAT REALLY MATTERS IF YOU'RE BUYING HERE:\n" +
          "HOW YOU GET AROUND. AND THE HAIGHT IS ONE OF THE EASIEST PLACES\n" +
          "IN THE WHOLE CITY TO LIVE WITHOUT A CAR.\n" +
          "RIGHT ALONG THE STRIP IS THE 7-HAIGHT BUS, RUNNING STRAIGHT DOWNTOWN,\n" +
          "AND THE 33, 43, 6, AND 71 LINES THREAD THROUGH THE HILLS AND ACROSS TOWN.\n" +
          "THE N-JUDAH METRO RUNS JUST A FEW BLOCKS SOUTH ALONG THE PARK.\n" +
          "NEAREST BART IS DOWNTOWN, AND THE MUNI LINES GET YOU THERE.\n" +
          "NOW LET'S LEAVE THE CITY — CAR-FREE.\n" +
          "THE FERRY BUILDING IS ABOUT THREE AND A HALF MILES NORTHEAST,\n" +
          "ROUGHLY TWENTY-FIVE MINUTES ON THE 7 OR THE N TO THE EMBARCADERO,\n" +
          "AND THAT'S YOUR GATEWAY TO THE WATER.\n" +
          "GOING TO THE EAST BAY? FROM DOWNTOWN, HOP BART —\n" +
          "DOWNTOWN OAKLAND IS ABOUT THIRTY-FIVE MINUTES DOOR TO PLATFORM.\n" +
          "HEADING NORTH TO MARIN? THE LARKSPUR FERRY LEAVES FROM THE FERRY BUILDING\n" +
          "AND CROSSES IN ABOUT THIRTY MINUTES ON THE WATER —\n" +
          "OR DRIVE THE GOLDEN GATE BRIDGE TO LARKSPUR IN ABOUT THIRTY.\n" +
          "HEADING SOUTH TO THE PENINSULA? TAKE MUNI TO THE CALTRAIN DEPOT\n" +
          "AT 4TH AND KING, AND CALTRAIN RUNS DOWN TO PALO ALTO IN ABOUT FIFTY MINUTES —\n" +
          "OR IT'S ROUGHLY FORTY-FIVE BY CAR ON 280 OR 101.\n" +
          "BOTTOM LINE: WATER, RAIL, AND THREE BRIDGES — ALL WITHOUT OWNING A CAR.",
        broll: [
          "A 7-Haight bus on the strip; the N-Judah a few blocks south",
          "Embarcadero Station + the Ferry Building / a departing ferry",
          "A BART train; the Bay Bridge; the Golden Gate Bridge; a Caltrain at 4th & King",
          "Simple motion-graphic map: the Haight → Oakland / Larkspur / Palo Alto with the times",
        ],
      },
      {
        label: "6 · THE GROUND UNDER YOU (HAZARDS)",
        words: 110,
        script:
          "TWO QUICK, HONEST NOTES ON THE GROUND ITSELF.\n" +
          "GOOD NEWS FIRST: THE HAIGHT SITS INLAND AND ELEVATED, WELL ABOVE THE BAY,\n" +
          "SO IT IS NOT IN A TSUNAMI HAZARD ZONE — CROSS THAT WORRY OFF THE LIST.\n" +
          "AND ON THE SEISMIC SIDE, THE CORE OF THE NEIGHBORHOOD\n" +
          "DOES NOT FALL WITHIN A STATE-DESIGNATED SEISMIC HAZARD ZONE —\n" +
          "THOUGH, LIKE ANYWHERE IN CALIFORNIA, EARTHQUAKE READINESS STILL MATTERS,\n" +
          "AND IT'S SOMETHING EVERY BUYER REVIEWS WITH THEIR INSPECTOR AND INSURER.\n" +
          "I PUT THE SEISMIC AND TSUNAMI STATUS RIGHT ON EACH NEIGHBORHOOD'S\n" +
          "DETAILS PAGE, SO YOU CAN CHECK ANY SPECIFIC BLOCK BEFORE YOU WRITE AN OFFER.",
        broll: ["You gesturing to the elevated streets / the inland setting", "Edit: the seismic + tsunami toggles on your fog map"],
      },
      {
        label: "7 · DINING, NIGHTLIFE & DAILY LIFE",
        words: 120,
        script:
          "LET'S TALK DAILY LIFE.\n" +
          "THE HAIGHT'S COMMERCIAL STRIP IS ONE OF THE MOST CHARACTERFUL IN THE CITY —\n" +
          "COFFEE, BRUNCH, RECORD SHOPS, VINTAGE STORES, AND A NIGHTLIFE SCENE\n" +
          "WITH REAL HISTORY, INCLUDING SOME BELOVED OLD LANDMARK BARS.\n" +
          "I'M NOT GOING TO NAME SPECIFIC PLACES ON CAMERA, BECAUSE THE LINEUP CHANGES —\n" +
          "AND I NEVER WANT TO SEND YOU SOMEWHERE THAT'S CLOSED.\n" +
          "INSTEAD, I KEEP A CURRENT, HAND-CHECKED LIST OF THE NEIGHBORHOOD'S BEST\n" +
          "RESTAURANTS AND BARS RIGHT ON MY HAIGHT DETAILS PAGE — ALWAYS UP TO DATE.\n" +
          "THE VIBE TO KNOW: THIS IS A RIGHT-OUTSIDE-YOUR-DOOR, LEAVE-THE-CAR-HOME KIND OF PLACE.",
        broll: ["Café tables; a record-shop window; a vintage storefront", "The strip lit up at dusk; people on the sidewalk", "A classic neon bar sign (general, not a single endorsement)"],
      },
      {
        label: "8 · REAL ESTATE",
        words: 120,
        script:
          "ON HOUSING: THE HAIGHT IS CLASSIC SAN FRANCISCO —\n" +
          "GRAND VICTORIAN AND EDWARDIAN FLATS, SINGLE-FAMILY HOMES\n" +
          "ON THE QUIETER UPHILL BLOCKS, AND CONDOS AND T-I-C UNITS NEARER THE STRIP.\n" +
          "IT RUNS FROM A FIRST CONDO TO A FULLY RESTORED VICTORIAN SHOWPIECE.\n" +
          "I'M NOT GOING TO QUOTE A MEDIAN PRICE ON CAMERA, BECAUSE THAT NUMBER MOVES.\n" +
          "INSTEAD, I KEEP A LIVE MARKET UPDATE FOR THE HAIGHT ON MY SITE —\n" +
          "CURRENT MEDIANS FOR SINGLE-FAMILY HOMES AND FOR CONDOS, RIGHT UP TO TODAY.\n" +
          "THE LINK IS BELOW. THAT'S YOUR SMARTEST FIRST STEP BEFORE YOU EVEN TOUR.",
        broll: ["A painted Victorian, a flats building, a modern condo entry", "A 'For Sale' sign", "Edit: lower-third + screen-record of your live market page"],
      },
      {
        label: "9 · WHO BELONGS HERE + SIGNATURE OUTRO",
        words: 120,
        script:
          "SO — WHO BELONGS IN THE HAIGHT?\n" +
          "SOMEONE WHO WANTS CHARACTER, HISTORY, AND GOLDEN GATE PARK\n" +
          "RIGHT AT THE END OF THE BLOCK, WITHOUT EVER NEEDING A CAR.\n" +
          "BUT HERE'S THE THING I'VE LEARNED AFTER ALL THESE YEARS:\n" +
          "EVERY NEIGHBORHOOD IN THIS CITY HAS A STORY LIKE THIS ONE,\n" +
          "AND KNOWING THEM ALL IS THE WORK — THE MICROCLIMATES,\n" +
          "THE STREETS THAT HOLD THEIR VALUE, THE THINGS THAT NEVER SHOW UP IN A SEARCH.\n" +
          "ANYTHING THAT CHANGES — PRICES, THE NEWEST RESTAURANT, WHAT'S FOR SALE —\n" +
          "STAYS CURRENT ON MY HAIGHT ASHBURY NEIGHBORHOOD PAGE, SO THIS GUIDE NEVER GOES STALE.\n" +
          "SO IF YOU'RE THINKING ABOUT CALLING THE HAIGHT HOME,\n" +
          "I'D LOVE TO SHOW YOU AROUND AND HELP CREATE YOUR NEXT LIFE ADVENTURE.",
        broll: ["Golden-hour, unhurried pass down Haight St (you, relaxed, not pitching)", "A quiet look toward Golden Gate Park", "Soft end card: your name + how to reach you"],
      },
    ],
    schedule: [
      { step: "Scout & lock script", detail: "Take the route, mark the 6–8 B-roll stops, finalize edits to this script.", time: "~45 min (day before)" },
      { step: "Golden-hour B-roll", detail: "Shoot the famous corner, the Victorian hippie houses, the strip, street life, and housing variety in good light.", time: "30–45 min (early AM or ~1 hr before sunset)" },
      { step: "Talk-to-camera takes", detail: "Shoot each section as its own clip at the relevant spot; 2 takes each; teleprompter on your phone.", time: "60–90 min" },
      { step: "Pickups & cutaways", detail: "Signs, the stuck clock, and a screen-record of your live market page (capture at home).", time: "~15 min" },
      { step: "Edit & caption", detail: "Assemble, add lower-thirds (market URL), burned-in captions, light music bed; export.", time: "2–3 hrs" },
      { step: "Publish & link", detail: "Upload to YouTube, paste the market link in the description — then I add the 'Watch the tour' button to the Haight page.", time: "~30 min" },
    ],
    batchTip: "Shoot adjacent hoods the same outing — e.g. Haight Ashbury + the Panhandle + Buena Vista in one morning loop.",
  },
"Japantown": {
    aka: "Nihonmachi",
    runtime: "~10 min (8–10 target)",
    marketLink: "https://www.ur4cast.com/listings?nbhd=Japantown&layer=nbhd",
    detailsLink: "https://www.ur4cast.com/fog (open the Neighborhoods card → Japantown)",
    route: {
      // Route stays ENTIRELY within the Japantown boundary (verified against the
      // neighborhood polygon). Coords approximate — I'll snap to the sidewalk
      // grid for the final cut.
      spots: [
        { n: 1, name: "Peace Plaza & the Peace Pagoda", note: "Start — the five-tiered pagoda over the open plaza", coord: [-122.4300, 37.7853] },
        { n: 2, name: "Japan Center — East & West malls", note: "The covered mall arcades under one roof", coord: [-122.4296, 37.7857] },
        { n: 3, name: "Buchanan St mall (Nihonmachi)", note: "The cobblestone pedestrian lane with the origami fountains", coord: [-122.4312, 37.7859] },
        { n: 4, name: "Post St shops", note: "The neighborhood's shopping spine; shops and tea houses", coord: [-122.4285, 37.7861] },
        { n: 5, name: "Residential blocks toward Sutter", note: "The housing-stock segment: flats and condos rising toward Pacific Heights", coord: [-122.4290, 37.7868] },
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
          "RIGHT NOW I'M AT THE PEACE PLAZA, BY THE PAGODA, AND THE SUN IS OUT —\n" +
          "WHICH IS ALREADY THE FIRST THING WORTH KNOWING ABOUT THIS PLACE.\n" +
          "SO — ARE YOU READY TO SEE JAPANTOWN? LET'S GO.",
        broll: ["Two-shot idea: a foggy ridge in one frame, sunny Peace Plaza in the next", "You moving into frame by the Peace Pagoda", "The pagoda / plaza to place us"],
      },
      {
        label: "1 · LOCATION & LAY OF THE LAND",
        words: 195,
        script:
          "FIRST — WHERE ARE WE? JAPANTOWN SITS IN NORTH-CENTRAL SAN FRANCISCO,\n" +
          "JUST WEST OF CATHEDRAL HILL AND THE TENDERLOIN,\n" +
          "WITH PACIFIC HEIGHTS RISING TO THE NORTH AND THE FILLMORE NEXT DOOR.\n" +
          "THE HEART OF IT IS THE JAPAN CENTER AND PEACE PLAZA,\n" +
          "WRAPPED BY POST, GEARY, AND THE BUCHANAN STREET MALL.\n" +
          "ITS OTHER NAME — NIHONMACHI — MEANS, SIMPLY, 'JAPANTOWN.'\n" +
          "THE CORE SITS ROUGHLY 120 TO 250 FEET UP,\n" +
          "AND AROUND THE JAPAN CENTER IT'S COMPACT AND FAIRLY LEVEL —\n" +
          "FRIENDLY WHETHER YOU'RE PUSHING A STROLLER OR ROLLING A WHEELCHAIR.\n" +
          "BUT THIS IS SAN FRANCISCO, SO THE EDGES CLIMB:\n" +
          "HEAD NORTH TOWARD PACIFIC HEIGHTS AND THE GRADE PICKS UP QUICKLY,\n" +
          "PASSING WHAT THE A-D-A CONSIDERS AN ACCESSIBLE SLOPE — ABOUT FIVE PERCENT.\n" +
          "SO IF STEP-FREE, LOW-GRADE ACCESS MATTERS TO YOU,\n" +
          "THE BLOCKS AROUND THE PLAZA ARE YOUR FRIEND; THE UPHILL EDGES ARE A CLIMB.\n" +
          "AND THE HOMES THEMSELVES MATTER TOO —\n" +
          "MANY OF THE OLDER FLATS SIT UP A FLIGHT OF STAIRS FROM THE SIDEWALK,\n" +
          "SO IF STEP-FREE ENTRY IS A MUST, IT'S WORTH CHECKING HOME BY HOME.",
        broll: ["Slow pan across Peace Plaza; street signs at Post & Buchanan", "Wide establishing shot showing the Japan Center + the rise toward Pacific Heights", "A cross-street climbing north (show the grade)"],
      },
      {
        label: "2 · HISTORY",
        words: 200,
        script:
          "NOW THE STORY. THIS IS ONE OF ONLY A FEW JAPANTOWNS LEFT IN THE UNITED STATES —\n" +
          "ONE OF JUST THREE THAT SURVIVE TODAY.\n" +
          "NIHONMACHI TOOK ROOT AFTER THE 1906 EARTHQUAKE AND FIRE\n" +
          "PUSHED JAPANESE IMMIGRANTS INTO THE WESTERN ADDITION,\n" +
          "WHERE THE COMMUNITY FLOURISHED FOR DECADES.\n" +
          "THEN CAME THE DARKEST CHAPTER. DURING WORLD WAR TWO,\n" +
          "EXECUTIVE ORDER 9066 FORCED THE INCARCERATION OF JAPANESE AMERICANS,\n" +
          "EMPTYING THIS DISTRICT ALMOST OVERNIGHT.\n" +
          "AFTER THE WAR, RETURNING FAMILIES CAME BACK AND REBUILT —\n" +
          "BUT 1960s REDEVELOPMENT RAZED VICTORIAN BLOCKS AND DISPLACED MANY RESIDENTS,\n" +
          "RESHAPING THE AREA INTO TODAY'S JAPAN CENTER MALLS AND PEACE PLAZA.\n" +
          "THE JAPAN CENTER OPENED IN 1968, AND THAT SAME YEAR\n" +
          "THE PEACE PAGODA ROSE OVER THE PLAZA —\n" +
          "A FIVE-TIERED GIFT FROM SAN FRANCISCO'S SISTER CITY, OSAKA.\n" +
          "SPEND TIME ON THESE BLOCKS, AND YOU'RE STANDING IN A COMMUNITY\n" +
          "THAT ENDURED, RETURNED, AND REBUILT — AND IS STILL HERE.",
        broll: ["The Peace Pagoda; the Japan Center malls", "Historic-photo cutaways of pre-war Nihonmachi (licensed/archival)", "Peace Plaza wide shot"],
      },
      {
        label: "3 · HIDDEN FACTS",
        words: 160,
        script:
          "HERE'S WHAT MOST PEOPLE DON'T KNOW.\n" +
          "THAT FIVE-TIERED CONCRETE PAGODA RISES ABOUT 100 FEET OVER THE PLAZA,\n" +
          "A 1968 GIFT FROM SISTER CITY OSAKA, DESIGNED BY ARCHITECT YOSHIRO TANIGUCHI.\n" +
          "EACH APRIL SINCE 1968, THE NORTHERN CALIFORNIA CHERRY BLOSSOM FESTIVAL\n" +
          "FILLS THESE STREETS — ONE OF THE LARGEST OF ITS KIND IN THE COUNTRY.\n" +
          "AND THE HISTORY RUNS DEEP: SOME 120,000 JAPANESE AMERICANS\n" +
          "WERE INCARCERATED DURING THE WAR UNDER EXECUTIVE ORDER 9066 —\n" +
          "AND THE 1988 CIVIL LIBERTIES ACT LATER ISSUED A FORMAL APOLOGY AND REDRESS.\n" +
          "ONE MORE: THIS DISTRICT ONCE SPANNED SOME THIRTY BLOCKS BEFORE THE WAR,\n" +
          "AND TODAY COVERS ONLY ABOUT SIX.\n" +
          "THIS IS A NEIGHBORHOOD THAT CARRIES ITS HISTORY WITH QUIET PRIDE.",
        broll: ["Peace Pagoda tight shot", "Cherry blossoms / festival crowd (archival or in season)", "Buchanan St mall details — origami fountains, cobblestones"],
      },
      {
        label: "4 · MICROCLIMATE",
        words: 95,
        script:
          "QUICK WORD ON WEATHER — BECAUSE IN SAN FRANCISCO, MICROCLIMATE IS EVERYTHING.\n" +
          "JAPANTOWN SITS IN THE CENTRAL PART OF THE CITY,\n" +
          "WELL BACK FROM THE COAST — SO IT'S GENERALLY SUNNY AND MILD.\n" +
          "WHILE THE AVENUES OUT WEST DISAPPEAR INTO SUMMER FOG,\n" +
          "THESE CENTRAL BLOCKS CATCH MORE SUN AND STAY BRIGHTER AND WARMER.\n" +
          "PEOPLE PAY FOR LIGHT.\n" +
          "I KEEP A LIVE FOG MAP THAT SHOWS THIS NEIGHBORHOOD'S EXACT SUMMER-FOG HOURS\n" +
          "VERSUS THE FOGGY WEST SIDE — IT'S LINKED ON MY JAPANTOWN PAGE BELOW.",
        broll: ["Blue sky over Peace Plaza; you in shirtsleeves", "Contrast: fog pouring over the west-side ridge", "Edit: screen-cap of the Ur4cast fog map"],
      },
      {
        label: "5 · GETTING AROUND — CAR-FREE",
        words: 290,
        script:
          "NOW THE PART THAT REALLY MATTERS IF YOU'RE BUYING HERE:\n" +
          "HOW YOU GET AROUND. AND JAPANTOWN IS ONE OF THE EASIEST PLACES\n" +
          "IN THE WHOLE CITY TO LIVE WITHOUT A CAR.\n" +
          "RIGHT ON GEARY, THE 38 GEARY AND THE 38R GEARY RAPID\n" +
          "RUN STRAIGHT DOWNTOWN AND OUT TO THE OCEAN.\n" +
          "THE 2 SUTTER-CLEMENT, THE 3 JACKSON, AND THE 22 FILLMORE\n" +
          "THREAD THROUGH THE SURROUNDING BLOCKS —\n" +
          "AND THE 22 CONNECTS NORTH TO THE MARINA AND SOUTH TOWARD THE MISSION.\n" +
          "NEAREST BART IS DOWNTOWN, A SHORT RIDE EAST ON GEARY.\n" +
          "NOW LET'S LEAVE THE CITY — CAR-FREE.\n" +
          "THE FERRY BUILDING IS ABOUT TWO MILES NORTHEAST,\n" +
          "AND THAT'S YOUR GATEWAY TO THE WATER.\n" +
          "GOING TO THE EAST BAY? FROM DOWNTOWN, TAKE BART —\n" +
          "DOWNTOWN OAKLAND IS ABOUT TWENTY MINUTES ONCE YOU'RE ON THE PLATFORM.\n" +
          "HEADING NORTH TO MARIN? THE LARKSPUR FERRY LEAVES FROM THE FERRY BUILDING\n" +
          "AND CROSSES IN ABOUT THIRTY MINUTES ON THE WATER —\n" +
          "OR DRIVE THE GOLDEN GATE BRIDGE TO LARKSPUR IN ABOUT THIRTY.\n" +
          "HEADING SOUTH TO THE PENINSULA? TAKE MUNI TO THE CALTRAIN DEPOT\n" +
          "AT 4TH AND KING, AND CALTRAIN RUNS DOWN TO PALO ALTO IN ABOUT FIFTY MINUTES —\n" +
          "OR IT'S ROUGHLY THE SAME BY CAR ON 280 OR 101.\n" +
          "BOTTOM LINE: WATER, RAIL, AND THE BRIDGES — ALL WITHOUT OWNING A CAR.",
        broll: [
          "A 38-Geary bus on Geary Blvd; the Buchanan mall",
          "The Ferry Building / a departing ferry",
          "A BART train; the Golden Gate Bridge; a Caltrain at 4th & King",
          "Simple motion-graphic map: Japantown → Oakland / Larkspur / Palo Alto with the times",
        ],
      },
      {
        label: "6 · THE GROUND UNDER YOU (HAZARDS)",
        words: 110,
        script:
          "TWO QUICK, HONEST NOTES ON THE GROUND ITSELF.\n" +
          "GOOD NEWS FIRST: JAPANTOWN SITS WELL INLAND AND UP OFF THE BAY,\n" +
          "SO IT IS NOT IN A TSUNAMI HAZARD ZONE — CROSS THAT WORRY OFF THE LIST.\n" +
          "AND ON SEISMIC: THIS PARTICULAR DISTRICT IS NOT FLAGGED\n" +
          "WITHIN A STATE-DESIGNATED SEISMIC HAZARD ZONE —\n" +
          "BUT THIS IS STILL EARTHQUAKE COUNTRY, AND SOIL AND CONSTRUCTION VARY\n" +
          "BLOCK BY BLOCK, SO IT'S SOMETHING EVERY CALIFORNIA BUYER\n" +
          "REVIEWS WITH THEIR INSPECTOR AND INSURER.\n" +
          "I PUT THE SEISMIC AND TSUNAMI STATUS RIGHT ON EACH NEIGHBORHOOD'S\n" +
          "DETAILS PAGE, SO YOU CAN CHECK ANY SPECIFIC BLOCK BEFORE YOU WRITE AN OFFER.",
        broll: ["You gesturing to the level plaza / the rise toward Pacific Heights", "Edit: the seismic + tsunami toggles on your fog map"],
      },
      {
        label: "7 · DINING, NIGHTLIFE & DAILY LIFE",
        words: 120,
        script:
          "LET'S TALK DAILY LIFE.\n" +
          "JAPANTOWN HAS ONE OF THE MOST DISTINCTIVE FOOD SCENES IN THE CITY —\n" +
          "RAMEN AND IZAKAYA, SUSHI, TEA HOUSES AND BAKERIES,\n" +
          "AND A JAPANESE GROCERY MARKET RIGHT IN THE JAPAN CENTER.\n" +
          "I'M NOT GOING TO NAME SPECIFIC PLACES ON CAMERA, BECAUSE THE LINEUP CHANGES —\n" +
          "AND I NEVER WANT TO SEND YOU SOMEWHERE THAT'S CLOSED.\n" +
          "INSTEAD, I KEEP A CURRENT, HAND-CHECKED LIST OF THE NEIGHBORHOOD'S BEST\n" +
          "RESTAURANTS AND BARS RIGHT ON MY JAPANTOWN DETAILS PAGE — ALWAYS UP TO DATE.\n" +
          "THE VIBE TO KNOW: THIS IS A RIGHT-OUTSIDE-YOUR-DOOR, LEAVE-THE-CAR-HOME KIND OF PLACE.",
        broll: ["A steaming bowl of ramen; the market aisles", "The mall arcades at dusk; people in the plaza", "A general storefront / lantern detail (not a single endorsement)"],
      },
      {
        label: "8 · REAL ESTATE",
        words: 120,
        script:
          "ON HOUSING: JAPANTOWN IS COMPACT AND CENTRAL —\n" +
          "VICTORIAN AND EDWARDIAN FLATS ON THE SURROUNDING BLOCKS,\n" +
          "MID-RISE APARTMENTS AND CONDOS NEARER THE JAPAN CENTER,\n" +
          "AND SINGLE-FAMILY HOMES AS YOU RISE TOWARD PACIFIC HEIGHTS.\n" +
          "IT RUNS FROM A FIRST CONDO TO A FULLY RESTORED FLAT WITH CHARACTER.\n" +
          "I'M NOT GOING TO QUOTE A MEDIAN PRICE ON CAMERA, BECAUSE THAT NUMBER MOVES.\n" +
          "INSTEAD, I KEEP A LIVE MARKET UPDATE FOR JAPANTOWN ON MY SITE —\n" +
          "CURRENT MEDIANS FOR SINGLE-FAMILY HOMES AND FOR CONDOS, RIGHT UP TO TODAY.\n" +
          "THE LINK IS BELOW. THAT'S YOUR SMARTEST FIRST STEP BEFORE YOU EVEN TOUR.",
        broll: ["A painted Victorian, a flats building, a modern condo entry", "A 'For Sale' sign", "Edit: lower-third + screen-record of your live market page"],
      },
      {
        label: "9 · WHO BELONGS HERE + SIGNATURE OUTRO",
        words: 120,
        script:
          "SO — WHO BELONGS IN JAPANTOWN?\n" +
          "SOMEONE WHO WANTS LIGHT, CULTURE, AND THE WHOLE BAY AREA\n" +
          "A TRAIN OR A FERRY AWAY, WITHOUT EVER NEEDING A CAR.\n" +
          "BUT HERE'S THE THING I'VE LEARNED AFTER ALL THESE YEARS:\n" +
          "EVERY NEIGHBORHOOD IN THIS CITY HAS A STORY LIKE THIS ONE,\n" +
          "AND KNOWING THEM ALL IS THE WORK — THE MICROCLIMATES,\n" +
          "THE STREETS THAT HOLD THEIR VALUE, THE THINGS THAT NEVER SHOW UP IN A SEARCH.\n" +
          "ANYTHING THAT CHANGES — PRICES, THE NEWEST RESTAURANT, WHAT'S FOR SALE —\n" +
          "STAYS CURRENT ON MY JAPANTOWN NEIGHBORHOOD PAGE, SO THIS GUIDE NEVER GOES STALE.\n" +
          "SO IF YOU'RE THINKING ABOUT CALLING JAPANTOWN HOME,\n" +
          "I'D LOVE TO SHOW YOU AROUND AND HELP CREATE YOUR NEXT LIFE ADVENTURE.",
        broll: ["Golden-hour, unhurried pass through Peace Plaza (you, relaxed, not pitching)", "A quiet look up toward Pacific Heights", "Soft end card: your name + how to reach you"],
      },
    ],
    schedule: [
      { step: "Scout & lock script", detail: "Take the route, mark the 6–8 B-roll stops, finalize edits to this script.", time: "~45 min (day before)" },
      { step: "Golden-hour B-roll", detail: "Shoot the pagoda, the plaza, the mall arcades, the Buchanan mall, street life, and housing variety in good light.", time: "30–45 min (early AM or ~1 hr before sunset)" },
      { step: "Talk-to-camera takes", detail: "Shoot each section as its own clip at the relevant spot; 2 takes each; teleprompter on your phone.", time: "60–90 min" },
      { step: "Pickups & cutaways", detail: "Signs, the plaza, and a screen-record of your live market page (capture at home).", time: "~15 min" },
      { step: "Edit & caption", detail: "Assemble, add lower-thirds (market URL), burned-in captions, light music bed; export.", time: "2–3 hrs" },
      { step: "Publish & link", detail: "Upload to YouTube, paste the market link in the description — then I add the 'Watch the tour' button to the Japantown page.", time: "~30 min" },
    ],
    batchTip: "Shoot adjacent hoods the same outing — e.g. Japantown + Western Addition + Lower Pacific Heights in one morning loop.",
  },
"Western Addition": {
    aka: "The Fillmore",
    runtime: "~10 min (8–10 target)",
    marketLink: "https://www.ur4cast.com/listings?nbhd=Western%20Addition&layer=nbhd",
    detailsLink: "https://www.ur4cast.com/fog (open the Neighborhoods card → Western Addition)",
    route: {
      // Route stays ENTIRELY within the Western Addition boundary (verified against the
      // neighborhood polygon). Coords approximate — snap to the sidewalk grid for the final cut.
      spots: [
        { n: 1, name: "Fillmore & Geary — The Fillmore Auditorium", note: "Start — the 1912 music hall at the heart of the Fillmore", coord: [-122.4330, 37.7820] },
        { n: 2, name: "Fillmore Jazz District — heritage walk", note: "The sidewalk markers honoring the Harlem of the West", coord: [-122.4329, 37.7805] },
        { n: 3, name: "Fillmore & Eddy", note: "The historic jazz-corridor blocks south of Geary", coord: [-122.4327, 37.7795] },
        { n: 4, name: "Jefferson Square", note: "The small hilltop park with downtown views", coord: [-122.4283, 37.7804] },
        { n: 5, name: "Webster & McAllister — Victorian blocks", note: "Ornate Victorian and Edwardian flats that survived 1906", coord: [-122.4296, 37.7790] },
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
          "RIGHT NOW I'M ON FILLMORE STREET, AND THE SUN IS OUT —\n" +
          "WHICH IS ALREADY THE FIRST THING WORTH KNOWING ABOUT THIS PLACE.\n" +
          "SO — ARE YOU READY TO SEE THE WESTERN ADDITION? LET'S GO.",
        broll: ["Two-shot idea: a foggy ridge in one frame, sunny Fillmore St in the next", "You moving up Fillmore St into frame", "The Fillmore Auditorium marquee to place us"],
      },
      {
        label: "1 · LOCATION & LAY OF THE LAND",
        words: 195,
        script:
          "FIRST — WHERE ARE WE? THE WESTERN ADDITION SITS RIGHT IN THE CENTER\n" +
          "OF SAN FRANCISCO, JUST WEST OF THE CIVIC CENTER AND VAN NESS,\n" +
          "WITH JAPANTOWN AND PACIFIC HEIGHTS TO THE NORTH\n" +
          "AND ALAMO SQUARE AND NOPA TO THE SOUTH AND WEST.\n" +
          "THE MAIN SPINE IS FILLMORE STREET, RUNNING THROUGH THE OLD JAZZ CORRIDOR\n" +
          "AND ON UP TOWARD THE SHOPS NEAR PACIFIC HEIGHTS.\n" +
          "THE LAND HERE ROLLS RATHER THAN SOARS —\n" +
          "ROUGHLY 80 TO 310 FEET UP, WITH MOSTLY MODERATE GRADES\n" +
          "AND SOME GENUINELY LEVEL STRETCHES ALONG THE FLATTER BLOCKS,\n" +
          "FRIENDLY WHETHER YOU'RE PUSHING A STROLLER OR ROLLING A WHEELCHAIR.\n" +
          "STILL, THIS IS SAN FRANCISCO, SO A FEW CROSS-STREETS TILT UP\n" +
          "PAST WHAT THE A-D-A CONSIDERS AN ACCESSIBLE SLOPE — ABOUT FIVE PERCENT —\n" +
          "SO IF STEP-FREE, LOW-GRADE ACCESS MATTERS TO YOU,\n" +
          "THE LEVEL BLOCKS ARE YOUR FRIEND AND A FEW CORNERS ARE A CLIMB.\n" +
          "AND THE HOMES THEMSELVES MATTER TOO —\n" +
          "MANY OF THESE CLASSIC VICTORIANS SIT UP A FLIGHT OF STAIRS FROM THE SIDEWALK,\n" +
          "SO IF STEP-FREE ENTRY IS A MUST, IT'S WORTH CHECKING HOME BY HOME.",
        broll: ["Slow pan up Fillmore St; street signs at Fillmore & Geary", "Wide establishing shot showing the rolling blocks", "A steeper cross-street to show the grade"],
      },
      {
        label: "2 · HISTORY",
        words: 200,
        script:
          "NOW THE STORY — AND IT'S A DEEP ONE.\n" +
          "THE NAME IS LITERAL: THE WESTERN ADDITION WAS THE LAND APPENDED\n" +
          "TO THE ORIGINAL 1850s STREET SURVEY AS THE YOUNG CITY PUSHED WEST OF VAN NESS.\n" +
          "BECAUSE IT SAT WEST OF THE FIRE LINE, MANY OF ITS WOODEN VICTORIANS\n" +
          "SURVIVED THE 1906 EARTHQUAKE THAT LEVELED MUCH OF THE CITY TO THE EAST —\n" +
          "SO THESE BLOCKS HOLD SOME OF SAN FRANCISCO'S OLDEST HOMES.\n" +
          "AFTER WORLD WAR TWO, THE FILLMORE CORRIDOR BECAME\n" +
          "THE 'HARLEM OF THE WEST' — PACKED WITH BLACK-OWNED JAZZ AND BLUES CLUBS\n" +
          "THAT DREW GREATS LIKE BILLIE HOLIDAY AND JOHN COLTRANE.\n" +
          "THIS WAS THE BEATING HEART OF AFRICAN-AMERICAN CULTURAL LIFE IN THE CITY.\n" +
          "THEN CAME A HARDER CHAPTER. IN THE 1960s AND 70s,\n" +
          "THE A-2 REDEVELOPMENT PROJECT BULLDOZED DOZENS OF BLOCKS,\n" +
          "DISPLACING THOUSANDS OF MOSTLY AFRICAN-AMERICAN RESIDENTS AND BUSINESSES —\n" +
          "A WOUND THE DISTRICT STILL FEELS, AND ONE WORTH NAMING HONESTLY.\n" +
          "SURVIVING VICTORIANS, HISTORIC BLACK CHURCHES, AND A REVIVED JAZZ DISTRICT\n" +
          "CARRY THAT LAYERED LEGACY FORWARD.\n" +
          "SPEND TIME ON THESE BLOCKS, AND YOU'RE STANDING IN LIVING AMERICAN HISTORY.",
        broll: ["Surviving Victorian facades", "The Fillmore Auditorium / jazz-district sidewalk markers", "A historic Black church along the corridor"],
      },
      {
        label: "3 · HIDDEN FACTS",
        words: 160,
        script:
          "HERE'S WHAT MOST PEOPLE DON'T KNOW.\n" +
          "THE FILLMORE AUDITORIUM, AT GEARY AND FILLMORE, IS A 1912 HALL\n" +
          "THAT BILL GRAHAM TURNED INTO A PSYCHEDELIC-ROCK MECCA IN THE 1960s —\n" +
          "LAUNCHING THE GRATEFUL DEAD, JANIS JOPLIN, AND JIMI HENDRIX,\n" +
          "AND IT STILL HOSTS SHOWS TODAY.\n" +
          "DURING REDEVELOPMENT, SOME PRIZED VICTORIANS WERE ACTUALLY LIFTED\n" +
          "ONTO TRUCKS AND RELOCATED TO NEW LOTS TO SAVE THEM FROM THE WRECKING BALL.\n" +
          "CONGREGATIONS LIKE THIRD BAPTIST AND THE ST. JOHN COLTRANE CHURCH\n" +
          "ANCHORED THE COMMUNITY THROUGH DISPLACEMENT AND REMAIN CULTURAL PILLARS TODAY.\n" +
          "AND THE 'HARLEM OF THE WEST' NICKNAME WASN'T MARKETING —\n" +
          "IT WAS EARNED, BLOCK BY BLOCK, IN THE CLUBS THAT ONCE LINED FILLMORE STREET.\n" +
          "THIS IS A NEIGHBORHOOD THAT WEARS ITS HISTORY OUT LOUD.",
        broll: ["The Fillmore Auditorium marquee", "A relocated Victorian / ornate flats", "A historic church facade"],
      },
      {
        label: "4 · MICROCLIMATE",
        words: 95,
        script:
          "QUICK WORD ON WEATHER — BECAUSE IN SAN FRANCISCO, MICROCLIMATE IS EVERYTHING.\n" +
          "THE WESTERN ADDITION SITS CENTRAL IN THE CITY,\n" +
          "AWAY FROM THE COLD COAST, SO IT'S GENERALLY SUNNIER AND MILDER\n" +
          "THAN THE AVENUES OUT WEST THAT DISAPPEAR INTO SUMMER FOG.\n" +
          "IT'S NOT THE WARMEST POCKET IN TOWN, BUT IT CATCHES PLENTY OF LIGHT —\n" +
          "AND PEOPLE PAY FOR LIGHT.\n" +
          "I KEEP A LIVE FOG MAP THAT SHOWS THIS NEIGHBORHOOD'S EXACT SUMMER-FOG HOURS\n" +
          "VERSUS THE FOGGY WEST SIDE — IT'S LINKED ON MY WESTERN ADDITION PAGE BELOW.",
        broll: ["Blue sky over Fillmore St; you in shirtsleeves", "Contrast: fog pouring over the west-side ridge", "Edit: screen-cap of the Ur4cast fog map"],
      },
      {
        label: "5 · GETTING AROUND — CAR-FREE",
        words: 290,
        script:
          "NOW THE PART THAT REALLY MATTERS IF YOU'RE BUYING HERE:\n" +
          "HOW YOU GET AROUND. AND THE WESTERN ADDITION IS ONE OF THE EASIEST PLACES\n" +
          "IN THE WHOLE CITY TO LIVE WITHOUT A CAR.\n" +
          "THIS IS A BUS-RICH DISTRICT: THE 22-FILLMORE RUNS NORTH–SOUTH\n" +
          "THROUGH ITS HEART, THE 5-FULTON AND 31-BALBOA CROSS EAST–WEST,\n" +
          "AND THE 38-GEARY AND 38R RAPID SKIRT THE SOUTHERN EDGE STRAIGHT DOWNTOWN.\n" +
          "NEAREST BART AND MUNI METRO IS AT CIVIC CENTER, JUST EAST OF HERE.\n" +
          "NOW LET'S LEAVE THE CITY — CAR-FREE.\n" +
          "THE FERRY BUILDING IS ABOUT TWO AND A HALF MILES NORTHEAST,\n" +
          "AND THAT'S YOUR GATEWAY TO THE WATER.\n" +
          "GOING TO THE EAST BAY? TAKE THE BUS TO CIVIC CENTER AND HOP BART —\n" +
          "DOWNTOWN OAKLAND IS ABOUT TWENTY MINUTES DOOR TO PLATFORM.\n" +
          "HEADING NORTH TO MARIN? THE LARKSPUR FERRY LEAVES FROM THE FERRY BUILDING\n" +
          "AND CROSSES IN ABOUT THIRTY MINUTES ON THE WATER —\n" +
          "OR DRIVE THE GOLDEN GATE BRIDGE TO LARKSPUR IN ABOUT THIRTY.\n" +
          "HEADING SOUTH TO THE PENINSULA? TAKE MUNI TO THE CALTRAIN DEPOT\n" +
          "AT 4TH AND KING, AND CALTRAIN RUNS DOWN TO PALO ALTO IN ABOUT FIFTY MINUTES —\n" +
          "OR IT'S ROUGHLY FIFTY BY CAR ON 280 OR 101.\n" +
          "BOTTOM LINE: WATER, RAIL, AND THREE BRIDGES — ALL WITHOUT OWNING A CAR.",
        broll: [
          "A 22-Fillmore bus on Fillmore St; the 38-Geary on Geary Blvd",
          "Civic Center BART/Muni entrance; the Ferry Building / a departing ferry",
          "A BART train; the Golden Gate Bridge; a Caltrain at 4th & King",
          "Simple motion-graphic map: Western Addition → Oakland / Larkspur / Palo Alto with the times",
        ],
      },
      {
        label: "6 · THE GROUND UNDER YOU (HAZARDS)",
        words: 110,
        script:
          "TWO QUICK, HONEST NOTES ON THE GROUND ITSELF.\n" +
          "GOOD NEWS FIRST: THE WESTERN ADDITION SITS CENTRAL AND ELEVATED,\n" +
          "WELL AWAY FROM THE BAY, SO IT IS NOT IN A TSUNAMI HAZARD ZONE —\n" +
          "CROSS THAT WORRY OFF THE LIST.\n" +
          "AND ON SEISMIC: THIS DISTRICT FALLS OUTSIDE THE STATE'S\n" +
          "DESIGNATED LIQUEFACTION AND LANDSLIDE HAZARD ZONES —\n" +
          "WHICH IS PART OF WHY SO MANY OF ITS VICTORIANS RODE OUT 1906.\n" +
          "THAT SAID, EVERY CALIFORNIA BUYER STILL REVIEWS A HOME'S\n" +
          "EARTHQUAKE READINESS WITH THEIR INSPECTOR AND INSURER.\n" +
          "I PUT THE SEISMIC AND TSUNAMI STATUS RIGHT ON EACH NEIGHBORHOOD'S\n" +
          "DETAILS PAGE, SO YOU CAN CHECK ANY SPECIFIC BLOCK BEFORE YOU WRITE AN OFFER.",
        broll: ["You gesturing to the level central blocks", "Edit: the seismic + tsunami toggles on your fog map"],
      },
      {
        label: "7 · DINING, NIGHTLIFE & DAILY LIFE",
        words: 120,
        script:
          "LET'S TALK DAILY LIFE.\n" +
          "THE WESTERN ADDITION'S COMMERCIAL STRIPS ARE SOME OF THE MOST SOULFUL IN THE CITY —\n" +
          "COFFEE, BRUNCH, ACCLAIMED DINNER SPOTS, AND A LIVE-MUSIC SCENE WITH REAL HISTORY,\n" +
          "INCLUDING LANDMARK JAZZ AND BLUES ROOMS ALONG FILLMORE STREET.\n" +
          "I'M NOT GOING TO NAME SPECIFIC PLACES ON CAMERA, BECAUSE THE LINEUP CHANGES —\n" +
          "AND I NEVER WANT TO SEND YOU SOMEWHERE THAT'S CLOSED.\n" +
          "INSTEAD, I KEEP A CURRENT, HAND-CHECKED LIST OF THE NEIGHBORHOOD'S BEST\n" +
          "RESTAURANTS AND BARS RIGHT ON MY WESTERN ADDITION DETAILS PAGE — ALWAYS UP TO DATE.\n" +
          "THE VIBE TO KNOW: THIS IS A RIGHT-OUTSIDE-YOUR-DOOR, LEAVE-THE-CAR-HOME KIND OF PLACE.",
        broll: ["Café tables; a busy restaurant window at dusk", "The Fillmore marquee lit up; people on the sidewalk", "A classic neon music-club sign (general, not a single endorsement)"],
      },
      {
        label: "8 · REAL ESTATE",
        words: 120,
        script:
          "ON HOUSING: THE WESTERN ADDITION IS CLASSIC SAN FRANCISCO —\n" +
          "ORNATE VICTORIAN AND EDWARDIAN FLATS, SINGLE-FAMILY HOMES\n" +
          "ON THE QUIETER BLOCKS, AND CONDOS AND T-I-C UNITS THROUGHOUT.\n" +
          "IT RUNS FROM A FIRST CONDO TO A FULLY RESTORED VICTORIAN SHOWPIECE.\n" +
          "I'M NOT GOING TO QUOTE A MEDIAN PRICE ON CAMERA, BECAUSE THAT NUMBER MOVES.\n" +
          "INSTEAD, I KEEP A LIVE MARKET UPDATE FOR THE WESTERN ADDITION ON MY SITE —\n" +
          "CURRENT MEDIANS FOR SINGLE-FAMILY HOMES AND FOR CONDOS, RIGHT UP TO TODAY.\n" +
          "THE LINK IS BELOW. THAT'S YOUR SMARTEST FIRST STEP BEFORE YOU EVEN TOUR.",
        broll: ["A painted Victorian, a flats building, a modern condo entry", "A 'For Sale' sign", "Edit: lower-third + screen-record of your live market page"],
      },
      {
        label: "9 · WHO BELONGS HERE + SIGNATURE OUTRO",
        words: 120,
        script:
          "SO — WHO BELONGS IN THE WESTERN ADDITION?\n" +
          "SOMEONE WHO WANTS SOUL, HISTORY, AND THE WHOLE BAY AREA\n" +
          "A TRAIN OR A FERRY AWAY, WITHOUT EVER NEEDING A CAR.\n" +
          "BUT HERE'S THE THING I'VE LEARNED AFTER ALL THESE YEARS:\n" +
          "EVERY NEIGHBORHOOD IN THIS CITY HAS A STORY LIKE THIS ONE,\n" +
          "AND KNOWING THEM ALL IS THE WORK — THE MICROCLIMATES,\n" +
          "THE STREETS THAT HOLD THEIR VALUE, THE THINGS THAT NEVER SHOW UP IN A SEARCH.\n" +
          "ANYTHING THAT CHANGES — PRICES, THE NEWEST RESTAURANT, WHAT'S FOR SALE —\n" +
          "STAYS CURRENT ON MY WESTERN ADDITION NEIGHBORHOOD PAGE, SO THIS GUIDE NEVER GOES STALE.\n" +
          "SO IF YOU'RE THINKING ABOUT CALLING THE WESTERN ADDITION HOME,\n" +
          "I'D LOVE TO SHOW YOU AROUND AND HELP CREATE YOUR NEXT LIFE ADVENTURE.",
        broll: ["Golden-hour, unhurried pass down Fillmore St (you, relaxed, not pitching)", "A quiet look up the jazz-district blocks", "Soft end card: your name + how to reach you"],
      },
    ],
    schedule: [
      { step: "Scout & lock script", detail: "Take the route, mark the 6–8 B-roll stops, finalize edits to this script.", time: "~45 min (day before)" },
      { step: "Golden-hour B-roll", detail: "Shoot the Fillmore Auditorium, jazz-district markers, surviving Victorians, street life, and housing variety in good light.", time: "30–45 min (early AM or ~1 hr before sunset)" },
      { step: "Talk-to-camera takes", detail: "Shoot each section as its own clip at the relevant spot; 2 takes each; teleprompter on your phone.", time: "60–90 min" },
      { step: "Pickups & cutaways", detail: "Signs, the auditorium marquee, and a screen-record of your live market page (capture at home).", time: "~15 min" },
      { step: "Edit & caption", detail: "Assemble, add lower-thirds (market URL), burned-in captions, light music bed; export.", time: "2–3 hrs" },
      { step: "Publish & link", detail: "Upload to YouTube, paste the market link in the description — then I add the 'Watch the tour' button to the Western Addition page.", time: "~30 min" },
    ],
    batchTip: "Shoot adjacent hoods the same outing — e.g. Western Addition + Japantown + Alamo Square in one morning loop.",
  },
"Laurel Heights / Jordan Park": {
    runtime: "~10 min (8–10 target)",
    marketLink: "https://www.ur4cast.com/listings?nbhd=Laurel%20Heights%20%2F%20Jordan%20Park&layer=nbhd",
    detailsLink: "https://www.ur4cast.com/fog (open the Neighborhoods card → Laurel Heights / Jordan Park)",
    route: {
      // Route stays ENTIRELY within the Laurel Heights / Jordan Park boundary (verified against the
      // neighborhood polygon). Coords approximate — snap to the sidewalk grid for the final cut.
      spots: [
        { n: 1, name: "Laurel Village on California St", note: "Start — the tidy 3500-block shopping strip, level and convenient, sun out", coord: [-122.4540, 37.7843] },
        { n: 2, name: "3333 California — former UCSF Laurel Heights / Fireman's Fund campus", note: "The big mixed-use redevelopment that anchors the eastern edge", coord: [-122.4510, 37.7858] },
        { n: 3, name: "Commonwealth & Jordan Ave — Jordan Park blocks", note: "The housing-stock segment: wide, elegant planned-tract streets", coord: [-122.4565, 37.7838] },
        { n: 4, name: "Jordan Ave & Euclid — leafy residential", note: "Quiet south-side blocks of stately homes under mature trees", coord: [-122.4555, 37.7822] },
        { n: 5, name: "Spruce & California — gentle approach", note: "Easy grade back toward Laurel Village; classic flats and single-family homes", coord: [-122.4525, 37.7830] },
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
          "RIGHT NOW I'M ON CALIFORNIA STREET BY LAUREL VILLAGE, AND THE SUN IS OUT —\n" +
          "WHICH IS ALREADY THE FIRST THING WORTH KNOWING ABOUT THIS PLACE.\n" +
          "SO — ARE YOU READY TO SEE LAUREL HEIGHTS AND JORDAN PARK? LET'S GO.",
        broll: ["Two-shot idea: a foggy ridge in one frame, sunny California St in the next", "You moving along the Laurel Village strip into frame", "An elegant tree-lined Jordan Park block to place us"],
      },
      {
        label: "1 · LOCATION & LAY OF THE LAND",
        words: 195,
        script:
          "FIRST — WHERE ARE WE? LAUREL HEIGHTS AND JORDAN PARK SIT ON THE CITY'S\n" +
          "NORTH-CENTRAL HIGH GROUND, JUST SOUTH OF PRESIDIO HEIGHTS,\n" +
          "WITH PACIFIC HEIGHTS TO THE EAST AND THE RICHMOND OPENING UP TO THE WEST.\n" +
          "THE MAIN SPINE IS CALIFORNIA STREET, AND THE LAUREL VILLAGE SHOPPING STRIP\n" +
          "ALONG THE 3500 BLOCK IS THE CONVENIENT, FAIRLY LEVEL HEART OF DAILY ERRANDS.\n" +
          "THE LAND HERE RUNS FROM ABOUT 200 FEET UP TO AROUND 340 FEET,\n" +
          "ON GENTLE, ROLLING GRADES RATHER THAN ANYTHING DRAMATIC —\n" +
          "THE CALIFORNIA STREET STRIP IS CONVENIENT AND FAIRLY LEVEL,\n" +
          "FRIENDLY WHETHER YOU'RE PUSHING A STROLLER OR ROLLING A WHEELCHAIR.\n" +
          "SOUTH OF THERE, JORDAN PARK'S ELEGANT BLOCKS RISE ON EASY SLOPES,\n" +
          "MOST OF THEM WELL WITHIN WHAT THE A-D-A CONSIDERS AN ACCESSIBLE GRADE — ABOUT FIVE PERCENT.\n" +
          "THAT SAID, THE HOMES THEMSELVES STILL VARY —\n" +
          "MANY OF THESE STATELY HOUSES SIT UP A FLIGHT OF STAIRS FROM THE SIDEWALK,\n" +
          "SO IF STEP-FREE ENTRY IS A MUST, IT'S WORTH CHECKING HOME BY HOME.\n" +
          "BUT AS A NEIGHBORHOOD TO MOVE THROUGH? HIGH, GENTLE, AND EASY.",
        broll: ["Slow pan along the Laurel Village strip; street signs at California & Spruce", "Wide establishing shot showing the high, leafy blocks", "A gentle Jordan Park slope under mature trees (show the easy grade)"],
      },
      {
        label: "2 · HISTORY",
        words: 200,
        script:
          "NOW THE STORY — AND IT'S AN UNUSUAL ONE.\n" +
          "ALL OF THIS WAS THE ANCESTRAL LAND OF THE RAMAYTUSH OHLONE LONG BEFORE THE CITY GREW OUT HERE.\n" +
          "BENEATH THESE QUIET STREETS ONCE LAY LAUREL HILL CEMETERY,\n" +
          "ONE OF SAN FRANCISCO'S 'BIG FOUR' BURIAL GROUNDS,\n" +
          "WHICH INTERRED THE CITY'S ELITE STARTING IN THE 1850s.\n" +
          "AS THE GROWING CITY RAN OUT OF ROOM, VOTERS BANNED NEW BURIALS IN 1900,\n" +
          "AND BY THE 1940s THE REMAINING GRAVES WERE EXHUMED\n" +
          "AND THE DEAD RELOCATED SOUTH TO COLMA — FREEING THE LAND FOR HOUSING.\n" +
          "MEANWHILE, DEVELOPER JAMES CLARK JORDAN HAD LAID OUT JORDAN PARK AROUND 1906\n" +
          "AS AN UPSCALE PLANNED TRACT, LINING ITS WIDE BLOCKS WITH THE GRAND HOMES\n" +
          "THAT STILL DEFINE THE NEIGHBORHOOD TODAY.\n" +
          "AND ALONG CALIFORNIA STREET, THE LAUREL VILLAGE SHOPPING CENTER\n" +
          "HAS ANCHORED NEIGHBORHOOD ERRANDS SINCE THE 1940s.\n" +
          "SO WHEN YOU SPEND TIME ON THESE BLOCKS, REMEMBER —\n" +
          "YOU'RE EXPLORING A HUSHED ENCLAVE OF OLD MONEY AND STATELY HOMES\n" +
          "BUILT, QUITE LITERALLY, ON TOP OF A LAYER OF THE CITY'S DEEP HISTORY.",
        broll: ["Stately Jordan Park facades on Commonwealth and Jordan Ave", "The Laurel Village strip along California St", "Wide shot of an unbroken row of elegant tract homes"],
      },
      {
        label: "3 · HIDDEN FACTS",
        words: 160,
        script:
          "HERE'S WHAT MOST PEOPLE DON'T KNOW.\n" +
          "THIS WHOLE NEIGHBORHOOD SITS WHERE LAUREL HILL CEMETERY ONCE HELD\n" +
          "TENS OF THOUSANDS OF SAN FRANCISCANS — ONE OF FOUR BIG CEMETERIES\n" +
          "CLUSTERED NEAR LONE MOUNTAIN BEFORE THE CITY CLEARED THEM.\n" +
          "JORDAN PARK ITSELF WAS AN EXCLUSIVE PLANNED TRACT FROM AROUND 1906,\n" +
          "AND ITS WIDE, WELL-KEPT BLOCKS OF STATELY HOMES\n" +
          "REMAIN AMONG THE MOST PRIZED IN THE CITY.\n" +
          "THE LAUREL VILLAGE CENTER ALONG THE 3500 BLOCK OF CALIFORNIA\n" +
          "HAS DRAWN SHOPPERS FROM THE SURROUNDING HILLS SINCE THE 1940s.\n" +
          "AND THAT BIG COMPLEX AT 3333 CALIFORNIA? IT BEGAN AS FIREMAN'S FUND HEADQUARTERS,\n" +
          "LATER HOUSED UCSF'S LAUREL HEIGHTS CAMPUS,\n" +
          "AND HAS SINCE BEEN REDEVELOPED INTO A MIXED-USE RESIDENTIAL AND ACADEMIC SITE.\n" +
          "THIS IS A NEIGHBORHOOD THAT KEEPS ITS BIGGEST STORIES JUST BELOW THE SURFACE.",
        broll: ["A wide Jordan Park block of stately homes", "The Laurel Village storefronts at a quiet hour", "The 3333 California campus frontage"],
      },
      {
        label: "4 · MICROCLIMATE",
        words: 95,
        script:
          "QUICK WORD ON WEATHER — BECAUSE IN SAN FRANCISCO, MICROCLIMATE IS EVERYTHING.\n" +
          "LAUREL HEIGHTS AND JORDAN PARK MAKE UP A BRIGHT, LEAFY NORTH-CENTRAL POCKET\n" +
          "THAT CATCHES A GOOD DEAL OF SUN — PART OF WHY IT'S SO PRIZED.\n" +
          "BUT IT SITS ON HIGH GROUND OPEN TOWARD THE RICHMOND AND THE OCEAN,\n" +
          "SO IT CAN RUN BREEZY AND A TOUCH COOLER WHEN THE WEST-SIDE AIR DRIFTS THROUGH.\n" +
          "BRING A LIGHT LAYER FOR A BREEZY AFTERNOON, EVEN ON A SUNNY DAY.\n" +
          "I KEEP A LIVE FOG MAP THAT SHOWS THIS NEIGHBORHOOD'S EXACT SUMMER-FOG HOURS\n" +
          "VERSUS THE FOGGY WEST SIDE — IT'S LINKED ON MY LAUREL HEIGHTS / JORDAN PARK PAGE BELOW.",
        broll: ["Blue sky over California St; you in shirtsleeves", "A breeze moving the trees on a Jordan Park block", "Edit: screen-cap of the Ur4cast fog map"],
      },
      {
        label: "5 · GETTING AROUND — CAR-FREE",
        words: 290,
        script:
          "NOW THE PART THAT REALLY MATTERS IF YOU'RE BUYING HERE:\n" +
          "HOW YOU GET AROUND. THERE'S NO MUNI METRO IN LAUREL HEIGHTS OR JORDAN PARK —\n" +
          "IT'S A BUS NEIGHBORHOOD, AND A WELL-CONNECTED ONE.\n" +
          "THE 1 CALIFORNIA IS THE WORKHORSE, RUNNING ALONG CALIFORNIA STREET\n" +
          "EAST STRAIGHT TO DOWNTOWN AND WEST TOWARD THE RICHMOND.\n" +
          "THE 33 ASHBURY AND 43 MASONIC ADD NORTH-SOUTH LINES NEARBY,\n" +
          "AND THE 2 CLEMENT GIVES YOU ANOTHER CROSSTOWN OPTION.\n" +
          "THE NEAREST BART IS A TRANSFER DOWNTOWN, NOT A STATION YOU CAN SEE FROM HERE.\n" +
          "NOW LET'S LEAVE THE CITY — CAR-FREE.\n" +
          "THE FERRY BUILDING IS ABOUT THREE MILES EAST,\n" +
          "A 1 CALIFORNIA RIDE AWAY, AND THAT'S YOUR GATEWAY TO THE WATER.\n" +
          "GOING TO THE EAST BAY? FROM DOWNTOWN, HOP BART —\n" +
          "OAKLAND IS ABOUT THIRTY TO THIRTY-FIVE MINUTES,\n" +
          "OR BY CAR THE BAY BRIDGE GETS YOU THERE TOO.\n" +
          "HEADING NORTH TO MARIN? TAKE THE LARKSPUR FERRY FROM THE FERRY BUILDING\n" +
          "AND CROSS ON THE WATER IN ABOUT THIRTY MINUTES,\n" +
          "OR DRIVE THE GOLDEN GATE BRIDGE, WHICH IS A SHORT HOP NORTH FROM HERE.\n" +
          "HEADING SOUTH TO THE PENINSULA? TAKE MUNI TO THE CALTRAIN DEPOT\n" +
          "AT 4TH AND KING, AND CALTRAIN RUNS DOWN TO PALO ALTO IN ABOUT FIFTY MINUTES —\n" +
          "OR IT'S 280 OR 101 BY CAR.\n" +
          "BOTTOM LINE: BUSES TO DOWNTOWN, A FERRY ACROSS THE BAY,\n" +
          "AND THE GOLDEN GATE BRIDGE CLOSE BY — ALL WITHOUT OWNING A CAR.",
        broll: [
          "A 1 California trolleybus on California St",
          "The Ferry Building / a departing ferry",
          "A BART train; the Bay Bridge; the Golden Gate Bridge; a Caltrain at 4th & King",
          "Simple motion-graphic map: Laurel Heights / Jordan Park → Oakland / Larkspur / Palo Alto with the times",
        ],
      },
      {
        label: "6 · THE GROUND UNDER YOU (HAZARDS)",
        words: 110,
        script:
          "TWO QUICK, HONEST NOTES ON THE GROUND ITSELF.\n" +
          "GOOD NEWS FIRST: LAUREL HEIGHTS AND JORDAN PARK SIT HIGH AND INLAND, WELL ABOVE THE BAY,\n" +
          "SO THEY ARE NOT IN A TSUNAMI HAZARD ZONE — CROSS THAT WORRY OFF THE LIST.\n" +
          "AND HERE'S MORE GOOD NEWS: UNLIKE MUCH OF THE CITY,\n" +
          "THIS NEIGHBORHOOD IS NOT MAPPED WITHIN A STATE-DESIGNATED SEISMIC HAZARD ZONE,\n" +
          "WHICH IS PART OF WHAT'S MADE ITS GROUND SO STABLE OVER THE DECADES.\n" +
          "OF COURSE, THIS IS STILL CALIFORNIA, AND EVERY BUYER SHOULD\n" +
          "REVIEW THE REPORTS WITH THEIR INSPECTOR AND INSURER.\n" +
          "I PUT THE SEISMIC AND TSUNAMI STATUS RIGHT ON EACH NEIGHBORHOOD'S\n" +
          "DETAILS PAGE, SO YOU CAN CHECK ANY SPECIFIC BLOCK BEFORE YOU WRITE AN OFFER.",
        broll: ["You gesturing to the high, level ground", "Edit: the seismic + tsunami toggles on your fog map"],
      },
      {
        label: "7 · DINING, NIGHTLIFE & DAILY LIFE",
        words: 120,
        script:
          "LET'S TALK DAILY LIFE.\n" +
          "LAUREL VILLAGE IS THE PRACTICAL HEART OF IT —\n" +
          "A TIDY CALIFORNIA STREET STRIP OF GROCERS, CAFES, AND EVERYDAY SHOPS\n" +
          "THAT'S ANCHORED NEIGHBORHOOD ERRANDS FOR DECADES.\n" +
          "AND JUST AROUND THE CORNER ON SACRAMENTO STREET, THE DINING GETS SERIOUS —\n" +
          "SOME OF THE MOST CELEBRATED KITCHENS ON THE NORTH SIDE ARE A SHORT HOP AWAY.\n" +
          "I'M NOT GOING TO NAME SPECIFIC PLACES ON CAMERA, BECAUSE THE LINEUP CHANGES —\n" +
          "AND I NEVER WANT TO SEND YOU SOMEWHERE THAT'S CLOSED.\n" +
          "INSTEAD, I KEEP A CURRENT, HAND-CHECKED LIST OF THE NEIGHBORHOOD'S BEST\n" +
          "RESTAURANTS AND BARS RIGHT ON MY LAUREL HEIGHTS / JORDAN PARK DETAILS PAGE — ALWAYS UP TO DATE.\n" +
          "THE VIBE TO KNOW: THIS IS A QUIET, CONVENIENT, ERRANDS-AT-YOUR-DOOR KIND OF PLACE.",
        broll: ["Laurel Village storefronts; a calm cafe front", "A quiet Sacramento St dining block nearby", "A low-key upscale storefront (general, not a single endorsement)"],
      },
      {
        label: "8 · REAL ESTATE",
        words: 120,
        script:
          "ON HOUSING: LAUREL HEIGHTS AND JORDAN PARK ARE CLASSIC NORTH-SIDE SAN FRANCISCO —\n" +
          "GRAND PLANNED-TRACT HOMES AND STATELY HOUSES ON WIDE, TREE-LINED STREETS,\n" +
          "ELEGANT FLATS, AND SOME CONDOS NEARER THE CALIFORNIA STREET STRIP\n" +
          "AND THE REDEVELOPED 3333 CALIFORNIA SITE.\n" +
          "IT RUNS FROM A REFINED CONDO TO A FULLY RESTORED JORDAN PARK SHOWPIECE.\n" +
          "I'M NOT GOING TO QUOTE A MEDIAN PRICE ON CAMERA, BECAUSE THAT NUMBER MOVES.\n" +
          "INSTEAD, I KEEP A LIVE MARKET UPDATE FOR LAUREL HEIGHTS / JORDAN PARK ON MY SITE —\n" +
          "CURRENT MEDIANS FOR SINGLE-FAMILY HOMES AND FOR CONDOS, RIGHT UP TO TODAY.\n" +
          "THE LINK IS BELOW. THAT'S YOUR SMARTEST FIRST STEP BEFORE YOU EVEN TOUR.",
        broll: ["A stately tract home, an elegant flats building, a refined condo entry", "A 'For Sale' sign", "Edit: lower-third + screen-record of your live market page"],
      },
      {
        label: "9 · WHO BELONGS HERE + SIGNATURE OUTRO",
        words: 120,
        script:
          "SO — WHO BELONGS IN LAUREL HEIGHTS AND JORDAN PARK?\n" +
          "SOMEONE WHO WANTS QUIET, LEAFY, GENTLE STREETS, A CONVENIENT SHOPPING VILLAGE,\n" +
          "AND SERIOUS DINING AROUND THE CORNER — WITH THE WHOLE BAY AREA\n" +
          "A BUS, A TRAIN, OR A FERRY AWAY, AND NEVER NEEDING A CAR.\n" +
          "BUT HERE'S THE THING I'VE LEARNED AFTER ALL THESE YEARS:\n" +
          "EVERY NEIGHBORHOOD IN THIS CITY HAS A STORY LIKE THIS ONE,\n" +
          "AND KNOWING THEM ALL IS THE WORK — THE MICROCLIMATES,\n" +
          "THE STREETS THAT HOLD THEIR VALUE, THE THINGS THAT NEVER SHOW UP IN A SEARCH.\n" +
          "ANYTHING THAT CHANGES — PRICES, THE NEWEST RESTAURANT, WHAT'S FOR SALE —\n" +
          "STAYS CURRENT ON MY LAUREL HEIGHTS / JORDAN PARK NEIGHBORHOOD PAGE, SO THIS GUIDE NEVER GOES STALE.\n" +
          "SO IF YOU'RE THINKING ABOUT CALLING LAUREL HEIGHTS AND JORDAN PARK HOME,\n" +
          "I'D LOVE TO SHOW YOU AROUND AND HELP CREATE YOUR NEXT LIFE ADVENTURE.",
        broll: ["Golden-hour, unhurried pass along California St (you, relaxed, not pitching)", "A quiet look down an elegant Jordan Park block", "Soft end card: your name + how to reach you"],
      },
    ],
    schedule: [
      { step: "Scout & lock script", detail: "Take the route, mark the 6–8 B-roll stops, finalize edits to this script.", time: "~45 min (day before)" },
      { step: "Golden-hour B-roll", detail: "Shoot the Laurel Village strip, the Jordan Park blocks, the 3333 California campus, and housing variety in good light.", time: "30–45 min (early AM or ~1 hr before sunset)" },
      { step: "Talk-to-camera takes", detail: "Shoot each section as its own clip at the relevant spot; 2 takes each; teleprompter on your phone.", time: "60–90 min" },
      { step: "Pickups & cutaways", detail: "Signs, a 1 California bus, and a screen-record of your live market page (capture at home).", time: "~15 min" },
      { step: "Edit & caption", detail: "Assemble, add lower-thirds (market URL), burned-in captions, light music bed; export.", time: "2–3 hrs" },
      { step: "Publish & link", detail: "Upload to YouTube, paste the market link in the description — then I add the 'Watch the tour' button to the Laurel Heights / Jordan Park page.", time: "~30 min" },
    ],
    batchTip: "Shoot adjacent hoods the same outing — e.g. Laurel Heights / Jordan Park + Presidio Heights + Lone Mountain in one morning loop.",
  },
"Ashbury Heights": {
    runtime: "~10 min (8–10 target)",
    marketLink: "https://www.ur4cast.com/listings?nbhd=Ashbury%20Heights&layer=nbhd",
    detailsLink: "https://www.ur4cast.com/fog (open the Neighborhoods card → Ashbury Heights)",
    route: {
      // Route stays ENTIRELY within the Ashbury Heights boundary (verified against the
      // neighborhood polygon). Coords approximate — snap to the sidewalk grid for the final cut.
      spots: [
        { n: 1, name: "Tank Hill viewpoint", note: "Start — the ridge-top panoramic lookout at the neighborhood's edge", coord: [-122.4477, 37.7596] },
        { n: 2, name: "Clifford Terrace — grand Victorians", note: "A curving block of grand hillside Victorians and Edwardians", coord: [-122.4481, 37.7624] },
        { n: 3, name: "Ashbury Terrace", note: "More terraced grand homes climbing the slope", coord: [-122.4489, 37.7636] },
        { n: 4, name: "Hidden public stairway", note: "One of the stair streets where the grade gets too steep for cars", coord: [-122.4473, 37.7613] },
        { n: 5, name: "Buena Vista Park edge", note: "The wooded park boundary on the neighborhood's east side", coord: [-122.4463, 37.7651] },
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
          "RIGHT NOW I'M UP ON THE RIDGE ABOVE THE HAIGHT, AND THE SUN IS OUT —\n" +
          "WHICH IS ALREADY THE FIRST THING WORTH KNOWING ABOUT THIS PLACE.\n" +
          "SO — ARE YOU READY TO SEE ASHBURY HEIGHTS? LET'S GO.",
        broll: ["Two-shot idea: fog over the Haight in one frame, sunny ridge-top blocks in the next", "You climbing up into frame on a steep block", "Tank Hill panorama to place us above the city"],
      },
      {
        label: "1 · LOCATION & LAY OF THE LAND",
        words: 205,
        script:
          "FIRST — WHERE ARE WE? ASHBURY HEIGHTS IS AN ELEVATED RIDGE\n" +
          "TUCKED BETWEEN HAIGHT-ASHBURY BELOW AND COLE VALLEY TO THE SOUTH,\n" +
          "WITH BUENA VISTA PARK ON ITS EASTERN EDGE.\n" +
          "THIS IS A GENUINELY STEEP HILLSIDE — IT CLIMBS FROM ABOUT\n" +
          "THREE HUNDRED AND TEN FEET UP TO AROUND SIX HUNDRED AND TEN.\n" +
          "THE PAYOFF IS BIG: SOME OF THE BEST CITY-AND-BAY VIEWS YOU'LL FIND ANYWHERE.\n" +
          "BUT BE HONEST WITH YOURSELF ABOUT THE GRADE.\n" +
          "THESE ARE BLOCKS OF GRAND VICTORIANS AND EDWARDIANS\n" +
          "STACKED ON STREETS SO STEEP THAT SOME OF THEM BREAK INTO STAIRWAYS —\n" +
          "AND MUCH OF THE HILL PASSES WHAT THE A-D-A CONSIDERS\n" +
          "AN ACCESSIBLE SLOPE — ABOUT FIVE PERCENT.\n" +
          "SO IF STEP-FREE, LOW-GRADE ACCESS MATTERS TO YOU,\n" +
          "A STEP-FREE ROUTE THROUGH THE HEIGHTS TAKES PLANNING.\n" +
          "AND THE HOMES THEMSELVES MATTER TOO —\n" +
          "MANY OF THESE GRAND HOUSES SIT UP A FLIGHT OF STAIRS FROM THE SIDEWALK,\n" +
          "SO IF STEP-FREE ENTRY IS A MUST, IT'S WORTH CHECKING HOME BY HOME.\n" +
          "THE UPSIDE OF ALL THAT ELEVATION, THOUGH, IS THE VIEW —\n" +
          "AND ON THIS RIDGE, THE VIEW IS THE WHOLE POINT.",
        broll: ["Slow pan up a steep block; street signs on Clifford or Ashbury Terrace", "Wide establishing shot from Tank Hill showing the city below", "A genuinely steep stair street climbing the hill (show the grade)"],
      },
      {
        label: "2 · HISTORY",
        words: 195,
        script:
          "NOW THE STORY. ASHBURY HEIGHTS CLIMBS THE SLOPE\n" +
          "ABOVE HAIGHT-ASHBURY, AND IT SHARES THAT NAME WITH MONROE ASHBURY —\n" +
          "A SAN FRANCISCO SUPERVISOR IN THE 1860s\n" +
          "WHO HELPED PLAN BOTH THIS AREA AND NEARBY GOLDEN GATE PARK.\n" +
          "ALL OF THIS WAS THE ANCESTRAL LAND OF THE RAMAYTUSH OHLONE LONG BEFORE THAT.\n" +
          "AS STREETCAR AND CABLE LINES PUSHED WEST IN THE LATE 1800s,\n" +
          "DEVELOPERS TERRACED THESE HILLS WITH GRAND VICTORIAN AND EDWARDIAN HOMES,\n" +
          "CREATING AN AFFLUENT RESIDENTIAL ENCLAVE\n" +
          "PERCHED ABOVE THE COMMERCIAL HAIGHT BELOW.\n" +
          "MANY OF THESE HOUSES WERE BUILT IN THAT STREETCAR-ERA EXPANSION —\n" +
          "AND A REMARKABLE NUMBER OF THEM CAME THROUGH\n" +
          "THE 1906 DISASTER INTACT.\n" +
          "ITS STEEP, LEAFY STREETS, HILLSIDE STAIRWAYS, AND PANORAMIC VIEWS\n" +
          "HAVE KEPT IT QUIETER — AND PRICIER —\n" +
          "THAN THE BUSY NEIGHBORHOOD DOWN THE HILL EVER SINCE.\n" +
          "SPEND TIME ON THESE BLOCKS, AND YOU'RE STANDING IN\n" +
          "MORE THAN A CENTURY OF SAN FRANCISCO'S RESIDENTIAL HISTORY,\n" +
          "STREET BY TERRACED STREET.",
        broll: ["Victorian and Edwardian facades on the terraces", "A streetcar-era home with original detailing", "Wide look up the hill from the edge of the Haight"],
      },
      {
        label: "3 · HIDDEN FACTS",
        words: 165,
        script:
          "HERE'S WHAT MOST PEOPLE DON'T KNOW.\n" +
          "RIGHT AT THE NEIGHBORHOOD'S EDGE SITS TANK HILL —\n" +
          "NAMED FOR A WATER TANK THE SPRING VALLEY WATER COMPANY\n" +
          "INSTALLED UP HERE IN 1894.\n" +
          "THE TANK CAME DOWN IN 1957, AND WHAT IT LEFT BEHIND\n" +
          "IS ONE OF THE BEST PANORAMIC VIEWPOINTS IN THE ENTIRE CITY.\n" +
          "ON THE EASTERN EDGE IS BUENA VISTA PARK —\n" +
          "SAN FRANCISCO'S OLDEST OFFICIAL PARK, DEDICATED IN 1867,\n" +
          "ITS WOODED SUMMIT OPENING UP SWEEPING VIEWS ACROSS THE CITY AND BAY.\n" +
          "AND THEN THERE ARE THE STAIRWAYS.\n" +
          "SOME SLOPES UP HERE ARE SIMPLY TOO STEEP FOR CARS,\n" +
          "SO THE STREETS GIVE WAY TO PUBLIC STAIRWAYS —\n" +
          "HIDDEN STEPS AND LANES THAT CONNECT THE BLOCKS\n" +
          "AND REWARD ANYONE WILLING TO CLIMB THEM\n" +
          "WITH QUIET GARDEN VIEWS YOU'D NEVER SEE FROM A CAR.\n" +
          "THIS IS A NEIGHBORHOOD THAT HIDES ITS BEST PARTS UP A FLIGHT OF STEPS.",
        broll: ["Tank Hill panorama tight shot", "Buena Vista Park's wooded paths", "A hidden public stairway climbing between blocks"],
      },
      {
        label: "4 · MICROCLIMATE",
        words: 100,
        script:
          "QUICK WORD ON WEATHER — BECAUSE IN SAN FRANCISCO, MICROCLIMATE IS EVERYTHING.\n" +
          "ASHBURY HEIGHTS SITS HIGH ON A RIDGE, AND THAT ELEVATION CUTS BOTH WAYS.\n" +
          "A LOT OF THE TIME, YOU'RE UP IN THE SUN\n" +
          "WHILE THE FOG SITS LOWER, OUT TOWARD THE OCEAN AND THE AVENUES.\n" +
          "BUT SOMETIMES THAT SAME RIDGE IS EXACTLY WHERE THE FOG ROLLS IN FIRST —\n" +
          "SO IT'S GENUINELY VARIABLE UP HERE, AND THAT'S WORTH KNOWING HONESTLY.\n" +
          "I KEEP A LIVE FOG MAP THAT SHOWS THIS NEIGHBORHOOD'S EXACT SUMMER-FOG HOURS\n" +
          "VERSUS THE FOGGY WEST SIDE — IT'S LINKED ON MY ASHBURY HEIGHTS PAGE BELOW.",
        broll: ["You above the fog line, sun on the ridge", "Contrast: fog rolling up over the hill toward you", "Edit: screen-cap of the Ur4cast fog map"],
      },
      {
        label: "5 · GETTING AROUND — CAR-FREE",
        words: 285,
        script:
          "NOW THE PART THAT REALLY MATTERS IF YOU'RE BUYING HERE:\n" +
          "HOW YOU GET AROUND.\n" +
          "UP ON THE RIDGE, BUSES THREAD THE HILLS —\n" +
          "THE 37-CORBETT WINDS THROUGH THE HEIGHTS THEMSELVES,\n" +
          "AND THE 33, THE 43, AND THE 6 AND 7 ARE ALL CLOSE BY.\n" +
          "DOWN THE HILL IN COLE VALLEY, THE N-JUDAH MUNI METRO\n" +
          "RUNS STRAIGHT DOWNTOWN AND OUT TO THE BEACH.\n" +
          "NEAREST BART IS DOWNTOWN, SO YOU'D TAKE MUNI TO MEET IT.\n" +
          "NOW LET'S LEAVE THE CITY — CAR-FREE.\n" +
          "THE FERRY BUILDING IS ABOUT FOUR MILES NORTHEAST,\n" +
          "ROUGHLY TWENTY-FIVE MINUTES BY MUNI TO EMBARCADERO,\n" +
          "AND THAT'S YOUR GATEWAY TO THE WATER.\n" +
          "GOING TO THE EAST BAY? FROM EMBARCADERO, TAKE BART —\n" +
          "DOWNTOWN OAKLAND IS ABOUT THIRTY-FIVE MINUTES DOOR TO PLATFORM.\n" +
          "HEADING NORTH TO MARIN? THE LARKSPUR FERRY LEAVES FROM THE FERRY BUILDING\n" +
          "AND CROSSES IN ABOUT THIRTY MINUTES ON THE WATER —\n" +
          "OR DRIVE THE GOLDEN GATE BRIDGE TO LARKSPUR IN ABOUT THIRTY.\n" +
          "HEADING SOUTH TO THE PENINSULA? TAKE MUNI TO THE CALTRAIN DEPOT\n" +
          "AT 4TH AND KING, AND CALTRAIN RUNS DOWN TO PALO ALTO IN ABOUT FIFTY MINUTES —\n" +
          "OR IT'S ROUGHLY THE SAME BY CAR ON 280 OR 101.\n" +
          "BOTTOM LINE: ONCE YOU'RE DOWN OFF THE RIDGE,\n" +
          "WATER, RAIL, AND THREE BRIDGES ARE ALL WITHIN REACH — NO CAR REQUIRED.",
        broll: [
          "A 37-Corbett bus climbing a steep block; the N-Judah down in Cole Valley",
          "Embarcadero Station + the Ferry Building / a departing ferry",
          "A BART train; the Golden Gate Bridge; a Caltrain at 4th & King",
          "Simple motion-graphic map: Ashbury Heights → Oakland / Larkspur / Palo Alto with the times",
        ],
      },
      {
        label: "6 · THE GROUND UNDER YOU (HAZARDS)",
        words: 110,
        script:
          "TWO QUICK, HONEST NOTES ON THE GROUND ITSELF.\n" +
          "GOOD NEWS FIRST: ASHBURY HEIGHTS SITS HIGH ON A RIDGE, WELL ABOVE THE BAY,\n" +
          "SO IT IS NOT IN A TSUNAMI HAZARD ZONE — CROSS THAT WORRY OFF THE LIST.\n" +
          "LIKE MUCH OF HILLY SAN FRANCISCO, PARTS OF THE NEIGHBORHOOD\n" +
          "DO FALL WITHIN A STATE-DESIGNATED SEISMIC HAZARD ZONE —\n" +
          "THAT'S STANDARD FOR THE CITY'S SLOPES, AND IT'S SOMETHING\n" +
          "EVERY CALIFORNIA BUYER REVIEWS WITH THEIR INSPECTOR AND INSURER.\n" +
          "I PUT THE SEISMIC AND TSUNAMI STATUS RIGHT ON EACH NEIGHBORHOOD'S\n" +
          "DETAILS PAGE, SO YOU CAN CHECK ANY SPECIFIC BLOCK BEFORE YOU WRITE AN OFFER.",
        broll: ["You gesturing out from the ridge to the city below", "Edit: the seismic + tsunami toggles on your fog map"],
      },
      {
        label: "7 · DINING, NIGHTLIFE & DAILY LIFE",
        words: 120,
        script:
          "LET'S TALK DAILY LIFE.\n" +
          "ASHBURY HEIGHTS ITSELF IS QUIET AND RESIDENTIAL —\n" +
          "THE SHOPS, CAFÉS, AND RESTAURANTS ARE JUST DOWN THE HILL\n" +
          "IN COLE VALLEY AND ALONG THE HAIGHT, ALL EASY TO REACH.\n" +
          "DOWN THERE YOU'LL FIND COFFEE, BRUNCH, NEIGHBORHOOD DINNER SPOTS,\n" +
          "AND A COUPLE OF CLASSIC HAIGHT STREET BARS WITH REAL HISTORY.\n" +
          "I'M NOT GOING TO NAME SPECIFIC PLACES ON CAMERA, BECAUSE THE LINEUP CHANGES —\n" +
          "AND I NEVER WANT TO SEND YOU SOMEWHERE THAT'S CLOSED.\n" +
          "INSTEAD, I KEEP A CURRENT, HAND-CHECKED LIST OF THE BEST NEARBY\n" +
          "RESTAURANTS AND BARS RIGHT ON MY ASHBURY HEIGHTS DETAILS PAGE — ALWAYS UP TO DATE.\n" +
          "THE VIBE TO KNOW: PEACE AND VIEWS UP TOP, GOOD FOOD A SHORT TRIP DOWNHILL.",
        broll: ["Café tables down in Cole Valley", "Haight Street life at dusk", "A classic neon bar sign (general, not a single endorsement)"],
      },
      {
        label: "8 · REAL ESTATE",
        words: 120,
        script:
          "ON HOUSING: ASHBURY HEIGHTS IS CLASSIC SAN FRANCISCO —\n" +
          "GRAND VICTORIAN AND EDWARDIAN HOMES TERRACED INTO THE HILLSIDE,\n" +
          "MANY OF THEM RESTORED, MANY WITH VIEWS THAT COME WITH THE ELEVATION.\n" +
          "IT RUNS FROM A CHARACTERFUL FLAT TO A FULLY RESTORED HILLSIDE SHOWPIECE.\n" +
          "I'M NOT GOING TO QUOTE A MEDIAN PRICE ON CAMERA, BECAUSE THAT NUMBER MOVES.\n" +
          "INSTEAD, I KEEP A LIVE MARKET UPDATE FOR ASHBURY HEIGHTS ON MY SITE —\n" +
          "CURRENT MEDIANS FOR SINGLE-FAMILY HOMES AND FOR CONDOS, RIGHT UP TO TODAY.\n" +
          "THE LINK IS BELOW. THAT'S YOUR SMARTEST FIRST STEP BEFORE YOU EVEN TOUR.",
        broll: ["A grand hillside Victorian; a terraced Edwardian", "A 'For Sale' sign on a steep block", "Edit: lower-third + screen-record of your live market page"],
      },
      {
        label: "9 · WHO BELONGS HERE + SIGNATURE OUTRO",
        words: 125,
        script:
          "SO — WHO BELONGS IN ASHBURY HEIGHTS?\n" +
          "SOMEONE WHO WANTS QUIET, GRAND OLD HOMES, AND BIG VIEWS,\n" +
          "AND DOESN'T MIND A CLIMB TO EARN THEM.\n" +
          "BUT HERE'S THE THING I'VE LEARNED AFTER ALL THESE YEARS:\n" +
          "EVERY NEIGHBORHOOD IN THIS CITY HAS A STORY LIKE THIS ONE,\n" +
          "AND KNOWING THEM ALL IS THE WORK — THE MICROCLIMATES,\n" +
          "THE STREETS THAT HOLD THEIR VALUE, THE THINGS THAT NEVER SHOW UP IN A SEARCH.\n" +
          "ANYTHING THAT CHANGES — PRICES, THE NEWEST RESTAURANT, WHAT'S FOR SALE —\n" +
          "STAYS CURRENT ON MY ASHBURY HEIGHTS NEIGHBORHOOD PAGE, SO THIS GUIDE NEVER GOES STALE.\n" +
          "SO IF YOU'RE THINKING ABOUT CALLING ASHBURY HEIGHTS HOME,\n" +
          "I'D LOVE TO SHOW YOU AROUND AND HELP CREATE YOUR NEXT LIFE ADVENTURE.",
        broll: ["Golden-hour, unhurried pass along a ridge block (you, relaxed, not pitching)", "A quiet look out over the city from Tank Hill", "Soft end card: your name + how to reach you"],
      },
    ],
    schedule: [
      { step: "Scout & lock script", detail: "Take the route, mark the 6–8 B-roll stops, finalize edits to this script.", time: "~45 min (day before)" },
      { step: "Golden-hour B-roll", detail: "Shoot Tank Hill, the terraced Victorians, a stair street, and the views in good light.", time: "30–45 min (early AM or ~1 hr before sunset)" },
      { step: "Talk-to-camera takes", detail: "Shoot each section as its own clip at the relevant spot; 2 takes each; teleprompter on your phone.", time: "60–90 min" },
      { step: "Pickups & cutaways", detail: "Street signs, a stairway, and a screen-record of your live market page (capture at home).", time: "~15 min" },
      { step: "Edit & caption", detail: "Assemble, add lower-thirds (market URL), burned-in captions, light music bed; export.", time: "2–3 hrs" },
      { step: "Publish & link", detail: "Upload to YouTube, paste the market link in the description — then I add the 'Watch the tour' button to the Ashbury Heights page.", time: "~30 min" },
    ],
    batchTip: "Shoot adjacent hoods the same outing — e.g. Ashbury Heights + Buena Vista + Corona Heights in one morning loop.",
  },
"Lower Pacific Heights": {
    aka: "Lower Pac Heights",
    runtime: "~10 min (8–10 target)",
    marketLink: "https://www.ur4cast.com/listings?nbhd=Lower%20Pacific%20Heights&layer=nbhd",
    detailsLink: "https://www.ur4cast.com/fog (open the Neighborhoods card → Lower Pacific Heights)",
    route: {
      // Route stays ENTIRELY within the Lower Pacific Heights boundary (verified against the
      // neighborhood polygon). Coords approximate — snap to the sidewalk grid for the final cut.
      spots: [
        { n: 1, name: "Fillmore & California — the California St strip", note: "Start — the upper shops and cafés, sun out", coord: [-122.4348, 37.7881] },
        { n: 2, name: "Fillmore & Sutter — lower Fillmore restaurants", note: "The dining strip: restaurants, boutiques, music heritage", coord: [-122.4337, 37.7868] },
        { n: 3, name: "Webster & Bush — Victorian/Edwardian flats", note: "The classic flat residential blocks of streetcar-era flats", coord: [-122.4360, 37.7858] },
        { n: 4, name: "Fillmore & Geary — the Fillmore–Japantown edge", note: "South end; the lower Fillmore meets the Japantown edge", coord: [-122.4337, 37.7847] },
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
          "RIGHT NOW I'M ON FILLMORE STREET, AND THE SUN IS OUT —\n" +
          "WHICH IS ALREADY THE FIRST THING WORTH KNOWING ABOUT THIS PLACE.\n" +
          "SO — ARE YOU READY TO SEE LOWER PACIFIC HEIGHTS? LET'S GO.",
        broll: ["Two-shot idea: a foggy ridge in one frame, sunny Fillmore St in the next", "You moving down Fillmore St into frame", "The lower Fillmore strip to place us"],
      },
      {
        label: "1 · LOCATION & LAY OF THE LAND",
        words: 195,
        script:
          "FIRST — WHERE ARE WE? LOWER PACIFIC HEIGHTS SITS IN THE CENTRAL-NORTH OF SAN FRANCISCO,\n" +
          "THE FLATTER SHOULDER JUST BELOW GRAND PACIFIC HEIGHTS,\n" +
          "WITH JAPANTOWN AND THE WESTERN ADDITION TO THE SOUTH AND FILLMORE AS ITS SPINE.\n" +
          "THE MAIN STREETS ARE FILLMORE AND CALIFORNIA,\n" +
          "LINED WITH SHOPS, RESTAURANTS, AND STREETCAR-ERA FLATS.\n" +
          "THE NAME TELLS YOU THE SHAPE OF THE LAND —\n" +
          "THIS IS THE 'LOWER' APRON, MORE LEVEL AND EASY THAN THE HEIGHTS ABOVE.\n" +
          "MOST OF THE NEIGHBORHOOD RUNS ROUGHLY 130 TO 270 FEET UP,\n" +
          "AND THE CORE IS FLAT AND EASY TO GET AROUND —\n" +
          "FRIENDLY WHETHER YOU'RE PUSHING A STROLLER OR ROLLING A WHEELCHAIR.\n" +
          "THE FILLMORE AND CALIFORNIA STRIPS ARE PARTICULARLY CONVENIENT,\n" +
          "WITH DAILY ERRANDS RIGHT AT STREET LEVEL.\n" +
          "BUT THIS IS SAN FRANCISCO, SO THE EDGES TILT UP:\n" +
          "HEAD NORTH TOWARD PACIFIC HEIGHTS PROPER AND THE GRADE\n" +
          "CLIMBS PAST WHAT THE A-D-A CONSIDERS AN ACCESSIBLE SLOPE — ABOUT FIVE PERCENT.\n" +
          "SO IF STEP-FREE, LOW-GRADE ACCESS MATTERS TO YOU,\n" +
          "THE LOWER BLOCKS ARE YOUR FRIEND; THE CLIMB STARTS AS YOU GO UPHILL.\n" +
          "AND THE HOMES THEMSELVES MATTER TOO —\n" +
          "MANY OF THESE CLASSIC FLATS SIT UP A FLIGHT OF STAIRS FROM THE SIDEWALK,\n" +
          "SO IF STEP-FREE ENTRY IS A MUST, IT'S WORTH CHECKING HOME BY HOME.",
        broll: ["Slow pan along Fillmore St; street signs at Fillmore & California", "Wide establishing shot showing the level apron below the heights", "A cross-street climbing north toward Pacific Heights (show the grade)"],
      },
      {
        label: "2 · HISTORY",
        words: 200,
        script:
          "NOW THE STORY. LOWER PACIFIC HEIGHTS IS THE FLATTER SOUTHERN APRON\n" +
          "OF PACIFIC HEIGHTS, BLENDING INTO THE FILLMORE AND THE WESTERN ADDITION.\n" +
          "ALL OF THIS WAS THE ANCESTRAL LAND OF THE RAMAYTUSH OHLONE LONG BEFORE THAT.\n" +
          "STREETCAR LINES ALONG FILLMORE AND GEARY SPURRED DENSE\n" +
          "VICTORIAN AND EDWARDIAN FLATS IN THE LATE 1800s AND EARLY 1900s.\n" +
          "THEN CAME THE TURN THAT DEFINES THIS PLACE.\n" +
          "THE FILLMORE CORRIDOR BECAME THE HEART OF A THRIVING BLACK COMMUNITY\n" +
          "AND ONE OF THE GREAT JAZZ SCENES IN AMERICA — MID-CENTURY,\n" +
          "THE LOWER FILLMORE WAS KNOWN AS 'THE HARLEM OF THE WEST.'\n" +
          "ELLA FITZGERALD, DUKE ELLINGTON, AND BILLIE HOLIDAY ALL PLAYED ITS CLUBS.\n" +
          "MUCH OF THAT FABRIC WAS RAZED DURING 1960s REDEVELOPMENT —\n" +
          "A LOSS THE NEIGHBORHOOD STILL CARRIES AND REMEMBERS.\n" +
          "TODAY THE STRIP MIXES LONGTIME SHOPS, RESTAURANTS,\n" +
          "AND MUSIC VENUES JUST NORTH OF JAPANTOWN.\n" +
          "SPEND TIME ON THESE BLOCKS, AND YOU'RE STANDING IN LIVING CULTURAL HISTORY.",
        broll: ["Victorian and Edwardian flat facades", "The lower Fillmore strip and its music venues", "Archival-style nods to the jazz era (general, not a single venue)"],
      },
      {
        label: "3 · HIDDEN FACTS",
        words: 160,
        script:
          "HERE'S WHAT MOST PEOPLE DON'T KNOW.\n" +
          "THE LOWER FILLMORE WAS A RENOWNED JAZZ HUB IN THE 1940s AND '50s,\n" +
          "NICKNAMED 'THE HARLEM OF THE WEST.'\n" +
          "EACH JULY 4TH WEEKEND THE STREET HOSTS THE FILLMORE JAZZ FESTIVAL —\n" +
          "THE LARGEST FREE JAZZ FESTIVAL ON THE WEST COAST.\n" +
          "IT SPANS ABOUT TWELVE BLOCKS AND DRAWS WELL OVER A HUNDRED THOUSAND VISITORS.\n" +
          "AND HERE'S ONE FOR THE TV FANS:\n" +
          "THE VICTORIAN USED FOR EXTERIOR SHOTS IN 'FULL HOUSE'\n" +
          "SITS NEARBY AT 1709 BRODERICK STREET — BUILT IN 1883,\n" +
          "STILL A PRIVATE RESIDENCE AND A POPULAR PHOTO STOP.\n" +
          "MUCH OF THE AREA IS LINED WITH VICTORIAN AND EDWARDIAN FLATS,\n" +
          "AND FREQUENT TRANSIT ALONG FILLMORE AND GEARY MADE IT AN EARLY STREETCAR SUBURB.\n" +
          "THIS IS A NEIGHBORHOOD THAT WEARS ITS HISTORY OUT LOUD.",
        broll: ["The lower Fillmore strip in motion", "A Victorian flat facade tight shot", "Festival-style crowd B-roll if you have it (general)"],
      },
      {
        label: "4 · MICROCLIMATE",
        words: 95,
        script:
          "QUICK WORD ON WEATHER — BECAUSE IN SAN FRANCISCO, MICROCLIMATE IS EVERYTHING.\n" +
          "LOWER PACIFIC HEIGHTS SITS IN ONE OF THE CITY'S MILDER, CENTRAL POCKETS.\n" +
          "WHILE THE AVENUES OUT WEST DISAPPEAR INTO SUMMER FOG,\n" +
          "THIS CENTRAL SHELF — DOWN OFF THE HIGH RIDGE — CATCHES THE SUN\n" +
          "AND STAYS GENERALLY SUNNIER AND MILDER. PEOPLE PAY FOR LIGHT.\n" +
          "I KEEP A LIVE FOG MAP THAT SHOWS THIS NEIGHBORHOOD'S EXACT SUMMER-FOG HOURS\n" +
          "VERSUS THE FOGGY WEST SIDE — IT'S LINKED ON MY LOWER PACIFIC HEIGHTS PAGE BELOW.",
        broll: ["Blue sky over Fillmore St; you in shirtsleeves", "Contrast: fog pouring over the western ridge", "Edit: screen-cap of the Ur4cast fog map"],
      },
      {
        label: "5 · GETTING AROUND — CAR-FREE",
        words: 290,
        script:
          "NOW THE PART THAT REALLY MATTERS IF YOU'RE BUYING HERE:\n" +
          "HOW YOU GET AROUND. AND LOWER PACIFIC HEIGHTS IS ONE OF THE EASIEST PLACES\n" +
          "IN THE WHOLE CITY TO LIVE WITHOUT A CAR.\n" +
          "THE 1-CALIFORNIA AND THE 22-FILLMORE CROSS RIGHT HERE,\n" +
          "WITH THE 2, THE 3, AND THE 38-GEARY ALL CLOSE BY —\n" +
          "FREQUENT BUS LINES THAT THREAD STRAIGHT DOWNTOWN AND ACROSS THE CITY.\n" +
          "NEAREST BART IS DOWNTOWN, A QUICK RIDE EAST.\n" +
          "NOW LET'S LEAVE THE CITY — CAR-FREE.\n" +
          "THE FERRY BUILDING IS ABOUT TWO-AND-A-HALF MILES NORTHEAST,\n" +
          "ROUGHLY TWENTY-FIVE MINUTES BY BUS,\n" +
          "AND THAT'S YOUR GATEWAY TO THE WATER.\n" +
          "GOING TO THE EAST BAY? FROM DOWNTOWN, TAKE BART —\n" +
          "DOWNTOWN OAKLAND IS ABOUT THIRTY-FIVE MINUTES DOOR TO PLATFORM.\n" +
          "HEADING NORTH TO MARIN? THE LARKSPUR FERRY LEAVES FROM THE FERRY BUILDING\n" +
          "AND CROSSES IN ABOUT THIRTY MINUTES ON THE WATER —\n" +
          "OR DRIVE THE GOLDEN GATE BRIDGE TO LARKSPUR IN ABOUT THIRTY.\n" +
          "HEADING SOUTH TO THE PENINSULA? TAKE A BUS TO THE CALTRAIN DEPOT\n" +
          "AT 4TH AND KING, AND CALTRAIN RUNS DOWN TO PALO ALTO IN ABOUT FIFTY MINUTES —\n" +
          "OR IT'S ROUGHLY FORTY-FIVE BY CAR ON 280 OR 101.\n" +
          "BOTTOM LINE: WATER, RAIL, AND THREE BRIDGES — ALL WITHOUT OWNING A CAR.",
        broll: [
          "A 1-California or 22-Fillmore bus pulling up on Fillmore",
          "Embarcadero / the Ferry Building / a departing ferry",
          "A BART train; the Golden Gate Bridge; a Caltrain at 4th & King",
          "Simple motion-graphic map: Lower Pacific Heights → Oakland / Larkspur / Palo Alto with the times",
        ],
      },
      {
        label: "6 · THE GROUND UNDER YOU (HAZARDS)",
        words: 110,
        script:
          "TWO QUICK, HONEST NOTES ON THE GROUND ITSELF.\n" +
          "GOOD NEWS FIRST: LOWER PACIFIC HEIGHTS SITS ON CENTRAL, ELEVATED GROUND,\n" +
          "WELL BACK FROM THE BAY,\n" +
          "SO IT IS NOT IN A TSUNAMI HAZARD ZONE — CROSS THAT WORRY OFF THE LIST.\n" +
          "AND ON SEISMIC HAZARD: THIS NEIGHBORHOOD IS NOT MAPPED\n" +
          "WITHIN A STATE-DESIGNATED SEISMIC HAZARD ZONE,\n" +
          "WHICH ISN'T SOMETHING EVERY SAN FRANCISCO NEIGHBORHOOD CAN SAY.\n" +
          "OF COURSE, EVERY CALIFORNIA BUYER STILL REVIEWS\n" +
          "THE STRUCTURE AND SOIL WITH THEIR INSPECTOR AND INSURER.\n" +
          "I PUT THE SEISMIC AND TSUNAMI STATUS RIGHT ON EACH NEIGHBORHOOD'S\n" +
          "DETAILS PAGE, SO YOU CAN CHECK ANY SPECIFIC BLOCK BEFORE YOU WRITE AN OFFER.",
        broll: ["You gesturing along the level streets", "Edit: the seismic + tsunami toggles on your fog map"],
      },
      {
        label: "7 · DINING, NIGHTLIFE & DAILY LIFE",
        words: 120,
        script:
          "LET'S TALK DAILY LIFE.\n" +
          "THE FILLMORE STRIP IS ONE OF THE LIVELIEST IN THE CITY —\n" +
          "COFFEE, BRUNCH, CLASSIC DINNER SPOTS, AND A MUSIC SCENE WITH REAL HISTORY,\n" +
          "INCLUDING LANDMARK JAZZ AND LIVE-MUSIC VENUES.\n" +
          "I'M NOT GOING TO NAME SPECIFIC PLACES ON CAMERA, BECAUSE THE LINEUP CHANGES —\n" +
          "AND I NEVER WANT TO SEND YOU SOMEWHERE THAT'S CLOSED.\n" +
          "INSTEAD, I KEEP A CURRENT, HAND-CHECKED LIST OF THE NEIGHBORHOOD'S BEST\n" +
          "RESTAURANTS AND BARS RIGHT ON MY LOWER PACIFIC HEIGHTS DETAILS PAGE — ALWAYS UP TO DATE.\n" +
          "THE VIBE TO KNOW: THIS IS A RIGHT-OUTSIDE-YOUR-DOOR, LEAVE-THE-CAR-HOME KIND OF PLACE.",
        broll: ["Café tables; a busy restaurant window at dusk", "The Fillmore strip lit up; people on the sidewalk", "A classic music-venue marquee (general, not a single endorsement)"],
      },
      {
        label: "8 · REAL ESTATE",
        words: 120,
        script:
          "ON HOUSING: LOWER PACIFIC HEIGHTS IS CLASSIC SAN FRANCISCO —\n" +
          "GRAND VICTORIAN AND EDWARDIAN FLATS, SINGLE-FAMILY HOMES\n" +
          "ON THE QUIETER BLOCKS, AND CONDOS AND T-I-C UNITS NEARER THE STRIPS.\n" +
          "IT RUNS FROM A FIRST CONDO TO A FULLY RESTORED VICTORIAN SHOWPIECE.\n" +
          "I'M NOT GOING TO QUOTE A MEDIAN PRICE ON CAMERA, BECAUSE THAT NUMBER MOVES.\n" +
          "INSTEAD, I KEEP A LIVE MARKET UPDATE FOR LOWER PACIFIC HEIGHTS ON MY SITE —\n" +
          "CURRENT MEDIANS FOR SINGLE-FAMILY HOMES AND FOR CONDOS, RIGHT UP TO TODAY.\n" +
          "THE LINK IS BELOW. THAT'S YOUR SMARTEST FIRST STEP BEFORE YOU EVEN TOUR.",
        broll: ["A painted Victorian, a flats building, a modern condo entry", "A 'For Sale' sign", "Edit: lower-third + screen-record of your live market page"],
      },
      {
        label: "9 · WHO BELONGS HERE + SIGNATURE OUTRO",
        words: 120,
        script:
          "SO — WHO BELONGS IN LOWER PACIFIC HEIGHTS?\n" +
          "SOMEONE WHO WANTS LIGHT, EASE, AND THE WHOLE BAY AREA\n" +
          "A TRAIN OR A FERRY AWAY, WITHOUT EVER NEEDING A CAR.\n" +
          "BUT HERE'S THE THING I'VE LEARNED AFTER ALL THESE YEARS:\n" +
          "EVERY NEIGHBORHOOD IN THIS CITY HAS A STORY LIKE THIS ONE,\n" +
          "AND KNOWING THEM ALL IS THE WORK — THE MICROCLIMATES,\n" +
          "THE STREETS THAT HOLD THEIR VALUE, THE THINGS THAT NEVER SHOW UP IN A SEARCH.\n" +
          "ANYTHING THAT CHANGES — PRICES, THE NEWEST RESTAURANT, WHAT'S FOR SALE —\n" +
          "STAYS CURRENT ON MY LOWER PACIFIC HEIGHTS NEIGHBORHOOD PAGE, SO THIS GUIDE NEVER GOES STALE.\n" +
          "SO IF YOU'RE THINKING ABOUT CALLING LOWER PACIFIC HEIGHTS HOME,\n" +
          "I'D LOVE TO SHOW YOU AROUND AND HELP CREATE YOUR NEXT LIFE ADVENTURE.",
        broll: ["Golden-hour, unhurried pass down Fillmore St (you, relaxed, not pitching)", "A quiet look up toward the heights above", "Soft end card: your name + how to reach you"],
      },
    ],
    schedule: [
      { step: "Scout & lock script", detail: "Take the route, mark the 6–8 B-roll stops, finalize edits to this script.", time: "~45 min (day before)" },
      { step: "Golden-hour B-roll", detail: "Shoot the Fillmore strip, California St, the flats, street life, and housing variety in good light.", time: "30–45 min (early AM or ~1 hr before sunset)" },
      { step: "Talk-to-camera takes", detail: "Shoot each section as its own clip at the relevant spot; 2 takes each; teleprompter on your phone.", time: "60–90 min" },
      { step: "Pickups & cutaways", detail: "Signs, the strip, and a screen-record of your live market page (capture at home).", time: "~15 min" },
      { step: "Edit & caption", detail: "Assemble, add lower-thirds (market URL), burned-in captions, light music bed; export.", time: "2–3 hrs" },
      { step: "Publish & link", detail: "Upload to YouTube, paste the market link in the description — then I add the 'Watch the tour' button to the Lower Pacific Heights page.", time: "~30 min" },
    ],
    batchTip: "Shoot adjacent hoods the same outing — e.g. Lower Pacific Heights + Japantown + Pacific Heights in one morning loop.",
  },
};
