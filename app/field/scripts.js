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
    runtime: "~9 min (8–10 target)",
    marketLink: "https://www.ur4cast.com/listings?nbhd=Castro&layer=nbhd",
    sections: [
      {
        label: "COLD OPEN / HOOK",
        words: 60,
        script:
          "YOU'RE STANDING AT 18TH AND CASTRO — RAINBOW CROSSWALKS UNDER YOUR FEET,\n" +
          "THE GIANT PRIDE FLAG SNAPPING OVERHEAD, AND THE SUN ACTUALLY OUT.\n" +
          "THIS IS THE CASTRO: SAN FRANCISCO'S RAINBOW HEART —\n" +
          "A SUN-WARMED HILLTOP VILLAGE WHERE PRIDE FLIES YEAR-ROUND\n" +
          "AND HISTORY LIVES ON EVERY CORNER.\n" +
          "COME WALK IT WITH ME.",
        broll: [
          "Hero shot: the 20-ft Pride flag at Harvey Milk Plaza",
          "You walking up Castro St into frame",
          "Rainbow crosswalk close-up (overhead or step-over)",
        ],
      },
      {
        label: "1 · LOCATION & BOUNDARIES",
        words: 120,
        script:
          "FIRST — WHERE ARE WE? THE CASTRO SITS DEAD-CENTER IN SAN FRANCISCO,\n" +
          "JUST WEST OF THE MISSION AND SOUTH OF DUBOCE TRIANGLE.\n" +
          "PICTURE THE WEDGE BETWEEN MARKET STREET UP TOP,\n" +
          "NOE VALLEY OVER THE HILL TO THE SOUTH, AND THE HAIGHT TO THE NORTHWEST.\n" +
          "THE MAIN SPINE IS CASTRO STREET ITSELF, RUNNING FROM MARKET\n" +
          "DOWN TO THE QUIET, TREE-LINED BLOCKS BELOW 19TH.\n" +
          "ITS OLD NAME — EUREKA VALLEY — TELLS YOU THE SHAPE OF THE LAND:\n" +
          "A SUNNY VALLEY TUCKED BETWEEN TWIN PEAKS, CORONA HEIGHTS, AND THE NOE HILLS.\n" +
          "THAT BOWL OF HILLS IS EXACTLY WHY IT GETS SO MUCH SUN —\n" +
          "MORE ON THAT IN A MINUTE.",
        broll: [
          "Slow pan up Castro St",
          "Street signs: Castro & 18th, Castro & Market",
          "Wide hilltop establishing shot showing the valley + Twin Peaks",
        ],
      },
      {
        label: "2 · HISTORY",
        words: 220,
        script:
          "NOW THE STORY. CASTRO STREET IS NAMED FOR JOSÉ CASTRO —\n" +
          "A CALIFORNIO LEADER AND GOVERNOR OF MEXICAN ALTA CALIFORNIA IN THE 1800s.\n" +
          "ALL OF THIS WAS THE ANCESTRAL LAND OF THE RAMAYTUSH OHLONE LONG BEFORE THAT.\n" +
          "THE NEIGHBORHOOD GREW UP IN THE 1880s AND 90s AS 'EUREKA VALLEY' —\n" +
          "A WORKING-CLASS STREETCAR SUBURB THAT FILLED IN AFTER\n" +
          "THE MARKET STREET CABLE LINE ARRIVED.\n" +
          "BLOCK AFTER BLOCK OF VICTORIANS WENT UP FOR IRISH AND SCANDINAVIAN FAMILIES.\n" +
          "THEN CAME THE TURN. IN THE 1960s AND 70s, AS THOSE FAMILIES LEFT FOR THE SUBURBS,\n" +
          "LGBTQ RESIDENTS MOVED IN AND PUT DOWN ROOTS —\n" +
          "AND EUREKA VALLEY BECAME 'THE CASTRO,'\n" +
          "ONE OF THE FIRST AND MOST FAMOUS GAY NEIGHBORHOODS IN AMERICA.\n" +
          "THIS IS WHERE HARVEY MILK OPENED HIS CAMERA SHOP,\n" +
          "WHERE HE WON A SEAT ON THE BOARD OF SUPERVISORS IN 1977 —\n" +
          "ONE OF THE FIRST OPENLY GAY ELECTED OFFICIALS IN THE COUNTRY —\n" +
          "AND WHERE, AFTER HIS ASSASSINATION IN 1978,\n" +
          "A CANDLELIGHT MARCH DOWN MARKET STREET STILL MARKS THE DAY EACH YEAR.\n" +
          "WHEN YOU WALK THESE BLOCKS, YOU'RE WALKING THROUGH LIVING CIVIL-RIGHTS HISTORY.",
        broll: [
          "Victorian facades on the uphill blocks",
          "575 Castro St — the old Castro Camera storefront",
          "Harvey Milk Plaza sign / Milk mural",
          "Archival photo overlays (license/credit appropriately)",
        ],
      },
      {
        label: "3 · UNKNOWN / FUN FACTS",
        words: 190,
        script:
          "HERE'S WHAT MOST PEOPLE DON'T KNOW.\n" +
          "ONE — THE RAINBOW FLAG WAS BORN RIGHT HERE.\n" +
          "ARTIST GILBERT BAKER SEWED THE VERY FIRST ONE IN THE CASTRO IN 1978.\n" +
          "THE 20-BY-30-FOOT VERSION OVER HARVEY MILK PLAZA HAS FLOWN SINCE 1997.\n" +
          "TWO — THAT MARQUEE IS THE CASTRO THEATRE, A 1922 MOVIE PALACE\n" +
          "DESIGNED BY TIMOTHY PFLUEGER. A 'MIGHTY WURLITZER' ORGAN\n" +
          "STILL RISES OUT OF THE FLOOR AND PLAYS BEFORE SCREENINGS.\n" +
          "THREE — THE AIDS MEMORIAL QUILT WAS FIRST IMAGINED HERE\n" +
          "BY CLEVE JONES IN 1985, AND HARVEY MILK FOUNDED THE CASTRO STREET FAIR\n" +
          "BACK IN 1974 — IT STILL FILLS THESE STREETS EVERY OCTOBER.\n" +
          "AND FOUR — IT WASN'T ALWAYS 'THE CASTRO.'\n" +
          "THE NAME ONLY CAUGHT ON IN THE 1970s,\n" +
          "AND THOSE RAINBOW CROSSWALKS AT 18TH AND CASTRO WENT IN IN 2014.\n" +
          "THIS IS A NEIGHBORHOOD THAT WEARS ITS HISTORY OUT LOUD.",
        broll: [
          "Pride flag tight shot",
          "Castro Theatre marquee (+ Wurlitzer if you can get inside)",
          "Pink Triangle Park / a quilt panel",
          "Rainbow crosswalk overhead",
        ],
      },
      {
        label: "4 · MICROCLIMATE",
        words: 120,
        script:
          "LET'S TALK WEATHER — BECAUSE IN SAN FRANCISCO, MICROCLIMATE IS EVERYTHING.\n" +
          "THE CASTRO SITS IN ONE OF THE CITY'S SUNNIEST POCKETS.\n" +
          "WHILE THE AVENUES OUT WEST DISAPPEAR INTO SUMMER FOG,\n" +
          "THIS VALLEY — SHELTERED BY TWIN PEAKS TO THE WEST —\n" +
          "CATCHES THE SUN AND STAYS NOTICEABLY WARMER AND BRIGHTER.\n" +
          "THAT'S NOT JUST A NICE-TO-HAVE; IT'S A LIFESTYLE — AND A RESALE FACTOR.\n" +
          "PEOPLE PAY FOR LIGHT.\n" +
          "IF YOU WANT THE EXACT NUMBERS — HOW MANY HOURS OF SUMMER FOG\n" +
          "THIS NEIGHBORHOOD AVERAGES VERSUS THE FOGGY WEST SIDE —\n" +
          "I'VE GOT A LIVE FOG MAP FOR THAT, AND THE LINK IS BELOW.",
        broll: [
          "Blue sky over Castro St; you in shirtsleeves",
          "Contrast: fog pouring over the Twin Peaks ridge to the west",
          "Edit: screen-capture of the Ur4cast fog map for this neighborhood",
        ],
      },
      {
        label: "5 · TRANSIT ACCESS",
        words: 150,
        script:
          "GETTING AROUND FROM HERE IS ABOUT AS EASY AS IT GETS IN THIS CITY.\n" +
          "RIGHT UNDER MY FEET IS CASTRO STATION — THAT'S THE MUNI METRO,\n" +
          "WITH THE K, L, AND M LINES RUNNING UNDERGROUND\n" +
          "STRAIGHT INTO DOWNTOWN AND OUT TO THE WEST SIDE.\n" +
          "UP ON MARKET STREET, THE HISTORIC F-LINE STREETCAR RUMBLES PAST\n" +
          "ON ITS WAY TO THE FERRY BUILDING AND FISHERMAN'S WHARF.\n" +
          "AND IF YOU PREFER THE BUS, YOU'VE GOT THE 24-DIVISADERO,\n" +
          "THE 33, THE 35, AND THE 37 ALL THREADING THROUGH THESE HILLS.\n" +
          "BOTTOM LINE: YOU CAN LIVE HERE WITHOUT A CAR AND BARELY NOTICE.\n" +
          "FOR A BUYER, THAT TRANSIT ACCESS IS REAL, DURABLE VALUE —\n" +
          "IT WIDENS YOUR POOL OF FUTURE BUYERS, TOO.",
        broll: [
          "Castro Station entrance / escalator down",
          "An F-line streetcar passing on Market",
          "A Muni bus at the stop; commuter foot traffic",
        ],
      },
      {
        label: "6 · REAL ESTATE TYPES & STATS",
        words: 180,
        script:
          "SO WHAT DO YOU ACTUALLY BUY HERE?\n" +
          "THE CASTRO IS CLASSIC SAN FRANCISCO HOUSING STOCK:\n" +
          "GRAND VICTORIAN AND EDWARDIAN FLATS — MANY CARVED INTO TWO- AND THREE-UNIT BUILDINGS —\n" +
          "ALONGSIDE SINGLE-FAMILY HOMES ON THE QUIETER UPHILL BLOCKS,\n" +
          "AND A SCATTERING OF CONDOS AND TENANCY-IN-COMMON UNITS CLOSER TO MARKET STREET.\n" +
          "IT RUNS THE RANGE FROM A FIRST CONDO TO A FULLY RESTORED VICTORIAN SHOWPIECE.\n" +
          "NOW — I'M NOT GOING TO QUOTE YOU A MEDIAN PRICE ON CAMERA,\n" +
          "BECAUSE THAT NUMBER MOVES.\n" +
          "INSTEAD, I KEEP A LIVE MARKET UPDATE FOR THE CASTRO ON MY SITE —\n" +
          "CURRENT MEDIAN SALE PRICES FOR SINGLE-FAMILY HOMES AND FOR CONDOS,\n" +
          "RIGHT UP TO TODAY. THE LINK IS IN THE DESCRIPTION.\n" +
          "CLICK IT, AND YOU'LL SEE EXACTLY WHAT'S SELLING IN THIS NEIGHBORHOOD\n" +
          "AND FOR HOW MUCH. THAT'S THE SMARTEST FIRST STEP BEFORE YOU EVEN TOUR A HOME.",
        broll: [
          "Range of housing: a painted Victorian, a flats building, a modern condo entry",
          "A 'For Sale' sign in front of a Castro home",
          "Lower-third graphic with the market-update URL",
          "Screen-record of your live market page for the Castro",
        ],
      },
      {
        label: "7 · WHY LIVE HERE",
        words: 200,
        script:
          "SO WHO THRIVES IN THE CASTRO?\n" +
          "HONESTLY — ANYONE WHO WANTS TO FEEL LIKE THEY'RE PART OF SOMETHING.\n" +
          "THIS IS A WALKABLE, SUNNY, TRANSIT-RICH VILLAGE WHERE YOU CAN GET YOUR COFFEE,\n" +
          "CATCH A CLASSIC FILM AT THE CASTRO THEATRE,\n" +
          "GRAB DINNER AT A SPOT LIKE FRANCES OR ANCHOR OYSTER BAR,\n" +
          "AND END THE NIGHT AT TWIN PEAKS TAVERN —\n" +
          "THE FIRST GAY BAR IN THE COUNTRY WITH OPEN PLATE-GLASS WINDOWS —\n" +
          "ALL WITHOUT MOVING YOUR CAR.\n" +
          "IT'S A PLACE WITH FIERCE COMMUNITY PRIDE AND DEEP ROOTS,\n" +
          "BUT IT'S ALSO JUST A GORGEOUS, PRACTICAL PLACE TO OWN A HOME:\n" +
          "GREAT LIGHT, GREAT BONES, GREAT LOCATION DEAD-CENTER IN THE CITY.\n" +
          "WHETHER YOU'RE A FIRST-TIME BUYER LOOKING AT A CONDO NEAR MARKET,\n" +
          "OR YOU'RE READY FOR A VICTORIAN ON A QUIET UPHILL BLOCK,\n" +
          "THE CASTRO REWARDS YOU EVERY SINGLE DAY YOU LIVE HERE.\n" +
          "IT'S NOT JUST A NEIGHBORHOOD. IT'S SAN FRANCISCO'S RAINBOW HEART —\n" +
          "AND IT COULD BE HOME.",
        broll: [
          "Lifestyle montage: café tables, the theatre at dusk, people on stoops, a dog walk",
          "Golden-hour on Castro St",
          "You on camera for the close",
        ],
      },
      {
        label: "8 · OUTRO / CTA",
        words: 45,
        script:
          "IF THE CASTRO FEELS LIKE YOUR KIND OF PLACE, DO TWO THINGS:\n" +
          "CHECK THE LIVE MARKET UPDATE LINKED BELOW,\n" +
          "AND THEN SEND ME A MESSAGE. I'LL WALK YOU THROUGH WHAT'S FOR SALE\n" +
          "AND GET YOU INSIDE.\n" +
          "I'M CHUCK HEAVER — AND I'LL SEE YOU IN THE NEXT NEIGHBORHOOD.",
        broll: [
          "You on camera, Castro behind you",
          "End card: name, contact, subscribe button",
        ],
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
