// Alternate script STRUCTURES for A/B-ing the format, keyed by neighborhood name.
//
// Same facts as the base entry in scripts.js — only the shape changes. The route
// map, production schedule, links, and geo strip all still come from scripts.js;
// a variant only supplies `sections`. The /field/<hood> page shows a toggle when
// a variant exists for that neighborhood.
//
// Castro "Viral cut" shape:
//   1 hook from something the viewer has already experienced
//   2-4 the cause-and-effect chain (why the place is the way it is)
//   5 the click (the chain snaps together into one idea)
//   6 what that chain means for you day to day (the practical payoff)
//   7 a small landing + a joke tip — deliberately no forced inspiration

export const VARIANTS = {
  "Castro": {
    label: "Viral cut",
    note: "Experience hook → cause-and-effect chain → the click → small landing + joke tip. Same facts as the original; different shape.",
    sections: [
      {
        label: "1 · COLD OPEN — THE THING YOU'VE ALREADY FELT",
        words: 85,
        script:
          "YOU'VE PROBABLY ALREADY HAD THIS HAPPEN.\n" +
          "YOU'RE SOMEWHERE ELSE IN THIS CITY — GREY, WIND CUTTING RIGHT THROUGH YOUR JACKET.\n" +
          "YOU COME OVER ONE HILL, AND IT'S SUDDENLY SUNNY.\n" +
          "PEOPLE ARE SITTING OUTSIDE IN T-SHIRTS LIKE IT'S A COMPLETELY DIFFERENT CITY.\n" +
          "YOU TOOK YOUR JACKET OFF, AND YOU PROBABLY THOUGHT: HUH. WEIRD.\n" +
          "IT'S NOT WEIRD. IT'S GEOGRAPHY.\n" +
          "AND THAT GEOGRAPHY IS THE REASON ONE OF THE MOST FAMOUS FLAGS ON EARTH\n" +
          "WAS SEWN BY HAND A FEW BLOCKS FROM WHERE I'M STANDING.\n" +
          "SO — ARE YOU READY TO SEE THE CASTRO? LET'S GO.",
        broll: [
          "Two-shot: you shivering in fog elsewhere, then jacket off in Castro sun",
          "You cresting the hill into frame",
          "Sunny sidewalk life — people outside in t-shirts",
        ],
      },
      {
        label: "2 · THE CAUSE",
        words: 110,
        script:
          "START WITH THE HILL.\n" +
          "EVERY SUMMER AFTERNOON THE FOG COMES IN OFF THE PACIFIC\n" +
          "AND PILES INTO THE WEST SIDE OF SAN FRANCISCO.\n" +
          "TWIN PEAKS IS IN THE WAY.\n" +
          "THE FOG HITS THAT RIDGE AND SPILLS AROUND IT —\n" +
          "AND THE VALLEY ON THE OTHER SIDE STAYS IN THE SUN.\n" +
          "THAT'S THE WHOLE TRICK. THAT'S IT.\n" +
          "THE OLD NAME FOR THIS PLACE WAS EUREKA VALLEY,\n" +
          "AND THAT NAME TELLS YOU THE SHAPE OF THE LAND: A SHELTERED BOWL,\n" +
          "ROUGHLY 80 TO 180 FEET UP, TUCKED IN BEHIND A RIDGE.\n" +
          "HERE IS A SUMMER FOG MAP BASED ON SATELLITE HISTORY THAT SHOWS THIS NEIGHBORHOOD'S\n" +
          "AVERAGE DAILY SUMMER-FOG HOURS VERSUS THE FOGGY WEST SIDE —\n" +
          "IT'S LINKED ON MY CASTRO PAGE BELOW.",
        broll: [
          "Wide: fog piling on the Twin Peaks ridge and spilling around it",
          "The valley sitting in sun with the ridge behind",
          "Edit: screen-cap of the Ur4cast fog map",
        ],
      },
      {
        label: "3 · WHAT THE SUN BUILT",
        words: 200,
        script:
          "NOW WATCH WHAT THE SUN DID.\n" +
          "ALL OF THIS WAS THE ANCESTRAL LAND OF THE RAMAYTUSH OHLONE.\n" +
          "THE STREET IS NAMED FOR JOSÉ CASTRO — A CALIFORNIO LEADER\n" +
          "AND GOVERNOR OF MEXICAN ALTA CALIFORNIA.\n" +
          "IN THE 1880s AND 90s, A STREETCAR CAME OVER THE HILL,\n" +
          "AND BECAUSE THIS VALLEY WAS SUNNY AND CHEAP AND CLOSE ENOUGH TO DOWNTOWN,\n" +
          "IT FILLED UP FAST — A WORKING-CLASS SUBURB OF WOODEN VICTORIANS\n" +
          "BUILT FOR IRISH AND SCANDINAVIAN FAMILIES.\n" +
          "NOT MANSIONS. NOT SHOWPIECES. HOUSES FOR PEOPLE WITH JOBS.\n" +
          "AND THAT ONE DETAIL — CHEAP, MODEST, WOODEN —\n" +
          "IS THE HINGE THIS WHOLE STORY SWINGS ON.\n" +
          "BECAUSE IN THE 1960s AND 70s, THOSE FAMILIES LEFT.\n" +
          "THEY WENT WHERE EVERYBODY WENT: OUT.\n" +
          "AND WHAT THEY LEFT BEHIND WAS BLOCK AFTER BLOCK\n" +
          "OF SUNNY, CHEAP, SLIGHTLY WORN-OUT VICTORIANS\n" +
          "SITTING THERE, AVAILABLE, IN THE MIDDLE OF A MAJOR AMERICAN CITY.",
        broll: [
          "Rows of modest wooden Victorians — not mansions",
          "An F-line streetcar on Market",
          "A quiet residential block that still looks like the 1890s",
        ],
      },
      {
        label: "4 · WHAT CHEAP VICTORIANS BOUGHT",
        words: 215,
        script:
          "HERE'S WHERE IT TURNS.\n" +
          "IN THOSE SAME YEARS, LGBTQ PEOPLE WERE BEING PUSHED OUT\n" +
          "OF JUST ABOUT EVERYWHERE ELSE.\n" +
          "AND THEY FOUND THIS VALLEY — WHERE YOU COULD ACTUALLY AFFORD TO STAY.\n" +
          "NOT VISIT. STAY.\n" +
          "THEY MOVED IN AND THEY PUT DOWN ROOTS, AND EUREKA VALLEY BECAME 'THE CASTRO' —\n" +
          "A NAME THAT ONLY REALLY CAUGHT ON IN THE 1970s.\n" +
          "NOW THINK ABOUT WHAT STAYING ACTUALLY DOES.\n" +
          "WHEN A COMMUNITY IS SCATTERED ACROSS A CITY, IT'S A POPULATION.\n" +
          "WHEN IT'S CONCENTRATED ON THE SAME FEW BLOCKS, IT'S A CONSTITUENCY.\n" +
          "IT HAS AN ADDRESS. IT HAS A PRECINCT. IT CAN VOTE TOGETHER.\n" +
          "WHICH IS HOW A MAN WHO RAN A CAMERA SHOP RIGHT ON THIS STREET\n" +
          "WON A SEAT ON THE BOARD OF SUPERVISORS IN 1977 —\n" +
          "ONE OF THE FIRST OPENLY GAY ELECTED OFFICIALS IN THE COUNTRY.\n" +
          "HARVEY MILK.\n" +
          "HE FOUNDED THE CASTRO STREET FAIR IN 1974 — IT STILL FILLS THESE STREETS EVERY OCTOBER.\n" +
          "HE WAS ASSASSINATED IN 1978.\n" +
          "AND A CANDLELIGHT MARCH DOWN MARKET STREET STILL MARKS THE DAY, EVERY YEAR.",
        broll: [
          "575 Castro St — the old Castro Camera storefront",
          "Harvey Milk Plaza sign / mural",
          "The Castro Theatre marquee; Street Fair crowd if you have it",
        ],
      },
      {
        label: "5 · THE CLICK",
        words: 130,
        script:
          "SO HERE'S THE PART THAT GETS ME.\n" +
          "A RIDGE OF ROCK GOT IN THE WAY OF THE FOG.\n" +
          "THE SUN MADE THIS A DESIRABLE LITTLE STREETCAR SUBURB.\n" +
          "THE SUBURB FILLED WITH CHEAP WOODEN HOUSES.\n" +
          "THE FAMILIES LEFT, AND THOSE HOUSES SAT THERE, WAITING.\n" +
          "A COMMUNITY WITH NOWHERE ELSE TO GO COULD FINALLY AFFORD TO STAY PUT —\n" +
          "AND STAYING PUT IS WHAT TURNED THEM INTO POWER.\n" +
          "THAT'S HOW A CAMERA SHOP BECAME A SEAT AT CITY HALL.\n" +
          "THAT'S HOW A FLAG GILBERT BAKER SEWED BY HAND HERE IN 1978\n" +
          "ENDED UP ON EVERY CONTINENT ON EARTH.\n" +
          "THAT'S HOW THE AIDS MEMORIAL QUILT GOT IMAGINED HERE BY CLEVE JONES IN 1985.\n" +
          "THE WEATHER DIDN'T JUST MAKE THIS NEIGHBORHOOD PLEASANT.\n" +
          "THE WEATHER IS WHY IT COULD EXIST AT ALL.\n" +
          "EVERY NEIGHBORHOOD IN THIS CITY IS A CHAIN LIKE THAT. MOST PEOPLE NEVER SEE IT.",
        broll: [
          "Slow push-in on the Pride flag at Harvey Milk Plaza",
          "Cut back to back: the fogged ridge, then the flag",
          "Rainbow crosswalk overhead",
        ],
      },
      {
        label: "6 · SO WHAT DOES THAT MEAN IF YOU LIVE HERE",
        words: 340,
        script:
          "NOW THE PRACTICAL SIDE — BECAUSE THAT SAME CHAIN STILL SHAPES YOUR DAILY LIFE.\n" +
          "THOSE CHEAP VICTORIANS? THEY'RE THE HOUSING STOCK.\n" +
          "GRAND VICTORIAN AND EDWARDIAN FLATS, SINGLE-FAMILY HOMES ON THE QUIETER UPHILL BLOCKS,\n" +
          "AND CONDOS AND T-I-C UNITS NEARER MARKET.\n" +
          "AND CLASSIC VICTORIANS COME WITH A CLASSIC CATCH:\n" +
          "MOST OF THEM SIT UP A FLIGHT OF STAIRS FROM THE SIDEWALK.\n" +
          "IF STEP-FREE ENTRY MATTERS TO YOU, THAT'S A HOME-BY-HOME QUESTION — ALWAYS ASK.\n" +
          "THE VALLEY FLOOR ITSELF IS FLAT AND EASY TO GET AROUND —\n" +
          "FRIENDLY WHETHER YOU'RE PUSHING A STROLLER OR ROLLING A WHEELCHAIR.\n" +
          "BUT HEAD WEST TOWARD CORONA HEIGHTS AND TWIN PEAKS\n" +
          "AND THE GRADE PASSES WHAT THE A-D-A CONSIDERS AN ACCESSIBLE SLOPE —\n" +
          "ABOUT FIVE PERCENT — IN A HURRY.\n" +
          "THE SAME HILL THAT GAVE YOU THE SUN WILL MAKE YOU EARN IT.\n" +
          "GETTING AROUND: RIGHT UNDER MY FEET IS CASTRO STATION —\n" +
          "MUNI METRO, THE K, L, AND M, UNDERGROUND STRAIGHT DOWNTOWN.\n" +
          "UP ON MARKET, THE HISTORIC F-LINE HEADS TO THE FERRY BUILDING.\n" +
          "THE 24, 33, 35, AND 37 THREAD THE HILLS.\n" +
          "NEAREST BART IS 16TH AND MISSION, ABOUT A MILE EAST.\n" +
          "LEAVING THE CITY WITHOUT A CAR: THE FERRY BUILDING IS ABOUT THREE MILES NORTHEAST,\n" +
          "ROUGHLY TWENTY MINUTES ON THE MUNI METRO.\n" +
          "FROM THERE THE LARKSPUR FERRY CROSSES TO MARIN IN ABOUT THIRTY MINUTES.\n" +
          "EAST BAY — TAKE BART FROM EMBARCADERO, DOWNTOWN OAKLAND IN ABOUT THIRTY-FIVE.\n" +
          "SOUTH — CALTRAIN FROM 4TH AND KING, PALO ALTO IN ABOUT FIFTY.\n" +
          "TWO QUICK NOTES ON THE GROUND: THE CASTRO SITS UP ON A HILLSIDE, WELL ABOVE THE BAY,\n" +
          "SO IT IS NOT IN A TSUNAMI HAZARD ZONE — CROSS THAT OFF.\n" +
          "PARTS OF IT DO FALL IN A STATE-DESIGNATED SEISMIC HAZARD ZONE —\n" +
          "STANDARD FOR THE CITY'S SLOPES, AND SOMETHING EVERY CALIFORNIA BUYER\n" +
          "REVIEWS WITH THEIR INSPECTOR AND INSURER.\n" +
          "THE STRIP IS ONE OF THE LIVELIEST IN THE CITY — COFFEE, BRUNCH,\n" +
          "AND SOME OF THE OLDEST LANDMARK BARS IN SAN FRANCISCO.\n" +
          "I WON'T NAME NAMES ON CAMERA; THAT LINEUP CHANGES.\n" +
          "THE CURRENT LIST — AND THE CURRENT MEDIANS — LIVE ON MY CASTRO PAGE. LINK BELOW.",
        broll: [
          "A Victorian with its flight of entry stairs (show the step-up)",
          "Castro Station escalator down; an F-line streetcar on Market",
          "A genuinely steep cross-street climbing west (show the grade)",
          "Edit: lower-third + screen-record of your live market page",
        ],
      },
      {
        label: "7 · THE LANDING + THE TIP",
        words: 105,
        script:
          "THAT'S THE CASTRO.\n" +
          "I'M NOT GOING TO TELL YOU IT'LL CHANGE YOUR LIFE. IT'S A NEIGHBORHOOD, NOT A RELIGION.\n" +
          "IF YOU WANT THE REAL TEST, COME STAND AT 18TH AND CASTRO\n" +
          "ON A TUESDAY AT TWO IN THE AFTERNOON.\n" +
          "NOT DURING PRIDE. NOT DURING THE STREET FAIR. A TUESDAY.\n" +
          "THAT'S THE VERSION YOU'D ACTUALLY BE LIVING IN.\n" +
          "AND ONE LAST TIP, FROM SOMEONE WHO HAS LEARNED IT THE HARD WAY:\n" +
          "DO NOT DRIVE HERE.\n" +
          "I'M NOT BEING POETIC. THERE IS NO PARKING.\n" +
          "THERE HAS NEVER BEEN PARKING. THERE WILL NEVER BE PARKING.\n" +
          "TAKE THE K, THE L, OR THE M — AND THANK ME LATER.",
        broll: [
          "A quiet Tuesday-afternoon 18th & Castro — the real version",
          "Comedic beat: you circling for parking; a solid block of parked cars",
          "A K/L/M train pulling in — end on that",
        ],
      },
    ],
  },
};
