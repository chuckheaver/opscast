// Per-neighborhood editorial content for the "neighborhood highlights"
// pop-up (opened from the Neighborhood name on the fog/neighborhoods card).
//
// Only the editorial/curated fields live here — the home-price figure and
// the microclimate line are computed live (from the listings data and the
// picked fog contour), so they're never stored stale.
//
// Schema per entry:
//   spirit      string   one creative line capturing the neighborhood
//   reasons     string[] short "why live here" chips
//   aka         string?  alternate / historic name shown as a chip
//   history     string   section 1 — name origin + settlement history
//   facts       [{ icon, title, text }]   section 2 — lesser-known facts
//   restaurants [{ name, address, phone, url }]   section 3 (top 5)
//   bars        [{ name, address, phone, url }]   section 4 (top 5)
//   nearby      string[]?  for residential-only areas with no/few venues of
//                          their own: the adjacent areas the listed spots
//                          actually sit in (e.g. ["Cole Valley", "the Haight"]).
//                          When set, sections 3 & 4 are titled "Nearby …" and
//                          carry a "primarily residential" note.
//   hospital    { name, address, dist, phone, url }   section 5
//   transit     string   section 6 — main lines that serve the area
//
// `icon` values are Material-style names mapped to inline SVGs in the modal.
// Add a new key (matching the fog geojson `name`) to light up its pop-up.

export const NEIGHBORHOODS = {
  Castro: {
    spirit:
      "San Francisco's rainbow heart — a sun-warmed hilltop village where pride flies year-round and history lives on every corner.",
    reasons: [
      "Among the city's sunniest",
      "Walkable nightlife",
      "Transit-rich",
      "Living LGBTQ history",
    ],
    aka: "Eureka Valley",
    history:
      "Castro Street honors José Castro (1808–1860), a Californio leader and governor of Mexican Alta California. The area grew as Eureka Valley, a working-class streetcar suburb built out in the 1880s–90s after the Market Street cable line arrived. As families left for the suburbs in the 1960s–70s, LGBTQ residents moved in, making it one of America's first and most famous gay neighborhoods.",
    facts: [
      {
        icon: "flag",
        title: "Birthplace of the Pride flag",
        text:
          "Artist Gilbert Baker sewed the first rainbow flag here in 1978. A 20-by-30-foot version has flown over Harvey Milk Plaza, above the Castro Muni station, since 1997.",
      },
      {
        icon: "shop",
        title: "Harvey Milk's camera shop",
        text:
          "Milk ran Castro Camera at 575 Castro St and in 1977 won a seat on the Board of Supervisors — among the first openly gay elected officials in the U.S. After his 1978 assassination, a candlelight march down Market St marks the day each year.",
      },
      {
        icon: "movie",
        title: "A 1922 movie palace",
        text:
          "The Castro Theatre, designed by Timothy Pflueger, is a city landmark — a “Mighty Wurlitzer” organ still rises from the floor and plays before screenings.",
      },
      {
        icon: "confetti",
        title: "Street fair & the AIDS quilt",
        text:
          "Harvey Milk founded the Castro Street Fair in 1974; it still fills the streets each October. Cleve Jones first conceived the AIDS Memorial Quilt here in 1985.",
      },
      {
        icon: "pin",
        title: "Hidden in plain sight",
        text:
          "It was plain “Eureka Valley” until the name “the Castro” caught on in the 1970s. Rainbow-striped crosswalks mark 18th & Castro (2014), all on the ancestral land of the Ramaytush Ohlone.",
      },
    ],
    restaurants: [
      { name: "Frances", address: "3870 17th St", phone: "(415) 621-3870", url: "https://frances-sf.com" },
      { name: "Anchor Oyster Bar", address: "579 Castro St", phone: "(415) 431-3990", url: "https://anchoroysterbar.com" },
      { name: "Starbelly", address: "3583 16th St", phone: "(415) 252-7500", url: "https://starbellysf.com" },
      { name: "L'Ardoise Bistro", address: "151 Noe St", phone: "(415) 437-2600", url: "https://ardoisesf.com" },
      { name: "Kasa Indian Eatery", address: "4001 18th St", phone: "(415) 621-6940", url: "https://kasaindian.com" },
    ],
    bars: [
      { name: "Twin Peaks Tavern", address: "401 Castro St", phone: "(415) 864-9470", url: "https://twinpeakstavern.com" },
      { name: "The Mix", address: "4086 18th St", phone: "(415) 431-8616", url: "https://www.themixbarsf.com" },
      { name: "440 Castro", address: "440 Castro St", phone: "(415) 621-8732", url: "https://440castro.com" },
      { name: "Beaux", address: "2344 Market St", phone: "(415) 660-2989", url: "https://beauxsf.com" },
      { name: "Midnight Sun", address: "4067 18th St", phone: "(415) 861-4186", url: "https://midnightsunsf.com" },
    ],
    hospital: {
      name: "CPMC Davies Campus",
      address: "45 Castro St at Duboce Ave",
      dist: "about 0.6 mi",
      phone: "(415) 600-6000",
      url: "https://www.sutterhealth.org/cpmc",
    },
    transit:
      "Castro Station serves Muni Metro K, L and M lines underground; the historic F-Market streetcar runs along Market St. Buses: 24 Divisadero, 33 Ashbury–18th, 35 Eureka and 37 Corbett.",
  },

  "Noe Valley": {
    spirit:
      "A sunny, hilly pocket of Victorian flats and stroller-friendly sidewalks — small-town calm right in the middle of the city.",
    reasons: [
      "Among the sunniest, calmest pockets",
      "Village-y 24th St shopping",
      "Family-friendly",
      "Pre-1906 Victorians",
    ],
    aka: "“Stroller Valley”",
    history:
      "Noe Valley takes its name from José de Jesús Noé, the last Mexican alcalde (mayor) of Yerba Buena, whose Rancho San Miguel once covered the area. It filled in as a working-class streetcar suburb after the 1880s, and because the 1906 earthquake fires never reached it, block after block of original Victorian and Edwardian homes still stand. In recent decades it has become one of the city's most sought-after family neighborhoods.",
    facts: [
      {
        icon: "mayor",
        title: "Named for the last Mexican mayor",
        text:
          "José de Jesús Noé was the final alcalde of Yerba Buena before it became San Francisco. His Rancho San Miguel land grant covered today's Noe Valley, the Castro, and beyond.",
      },
      {
        icon: "quake",
        title: "The fire that never came",
        text:
          "The 1906 earthquake's fires stopped short of Noe Valley, so an unusually intact stock of pre-1906 Victorian and Edwardian homes survives — a big reason the streets feel so historic.",
      },
      {
        icon: "stroller",
        title: "“Stroller Valley”",
        text:
          "The neighborhood is famous for its density of young families. A Saturday farmers' market has run on 24th St since 2003, and the sidewalks are a well-known obstacle course of strollers.",
      },
      {
        icon: "tram",
        title: "Built by the streetcar",
        text:
          "The J-Church line (opened 1917) climbs past Dolores Park and turned Noe Valley into a commuter-friendly suburb — still the quickest car-free run downtown.",
      },
      {
        icon: "shopping",
        title: "A fiercely independent main street",
        text:
          "24th Street is a protected neighborhood commercial district; residents have long resisted chain stores, leaving a strip of independent bakeries, bookshops, and cafés.",
      },
    ],
    restaurants: [
      { name: "Firefly", address: "4288 24th St", phone: "(415) 821-7652", url: "https://www.fireflysf.com" },
      { name: "La Ciccia", address: "291 30th St", phone: "(415) 550-8114", url: "https://laciccia.com" },
      { name: "Saru Sushi Bar", address: "3856 24th St", phone: "(415) 400-4510", url: "https://sarusushisf.com" },
      { name: "Billingsgate", address: "3859 24th St", phone: "(415) 590-3001", url: "https://www.billingsgatesf.com" },
      { name: "Falasteen", address: "4018 24th St", phone: "(415) 347-7796", url: "https://falasteen-sf.com" },
    ],
    bars: [
      { name: "Valley Tavern", address: "4054 24th St", phone: "(415) 285-0674", url: "https://www.valleytavern.com" },
      { name: "The Dubliner", address: "3838 24th St", phone: "(415) 826-2279", url: "https://www.dublinerbarsf.com" },
      { name: "Noeteca Wine Bar", address: "1551 Dolores St", phone: "(415) 377-3487", url: "https://noetecawinebar.com" },
      { name: "The Peak's Bar", address: "1316 Castro St", phone: "(415) 826-0100", url: "https://www.facebook.com/thepeaksbar" },
    ],
    hospital: {
      name: "CPMC Mission Bernal Campus",
      address: "3555 Cesar Chavez St",
      dist: "about 1 mi",
      phone: "(415) 600-6000",
      url: "https://www.sutterhealth.org/cpmc",
    },
    transit:
      "The J-Church Muni Metro line runs up Church St on the neighborhood's edge, reaching downtown via Dolores Park. Buses 24 Divisadero, 48 Quintara–24th St, and 35 Eureka cross 24th St and Church.",
  },

  Marina: {
    spirit:
      "Postcard San Francisco at sea level — bayfront promenades, the Palace of Fine Arts, and a buzzy Chestnut Street where brunch and the bay sit a block apart.",
    reasons: [
      "Flat & walkable",
      "Bayfront parks & views",
      "Chestnut St dining",
      "Marina Green recreation",
    ],
    aka: "1915 Expo grounds",
    history:
      "The Marina was created for the 1915 Panama-Pacific International Exposition — a World's Fair celebrating the city's recovery from the 1906 earthquake and the opening of the Panama Canal — much of it built on bay fill and quake rubble. After the fair, the district filled in with Mediterranean-style homes through the 1920s. Its waterfront flats and bay views have made it one of the city's most popular young-professional neighborhoods.",
    facts: [
      {
        icon: "fair",
        title: "Built for a World's Fair",
        text:
          "The 1915 Panama-Pacific International Exposition drew nearly 19 million visitors to a temporary city of palaces here. When it closed, the grounds became the Marina.",
      },
      {
        icon: "mayor",
        title: "The Palace of Fine Arts survived",
        text:
          "The domed Palace of Fine Arts is the Expo's only structure left standing. Too beloved to demolish, it was rebuilt in permanent concrete in the 1960s.",
      },
      {
        icon: "quake",
        title: "Hardest hit in 1989",
        text:
          "Because much of the Marina sits on loose bay fill, the soil liquefied in the 1989 Loma Prieta earthquake — making it the city's most damaged neighborhood and a key reason it shows up on seismic maps today.",
      },
      {
        icon: "wave",
        title: "A musical seawall",
        text:
          "At the tip of the Marina jetty sits the Wave Organ — a sculpture of pipes set into the breakwater that the tides play, built by the Exploratorium in 1986.",
      },
      {
        icon: "shopping",
        title: "Chestnut Street, since the '20s",
        text:
          "Chestnut Street has been the Marina's main drag for a century — today a tight run of cafés, fitness studios, and shops that defines the neighborhood's social scene.",
      },
    ],
    restaurants: [
      { name: "A16", address: "2355 Chestnut St", phone: "(415) 598-2252", url: "https://www.a16pizza.com" },
      { name: "Delarosa", address: "2175 Chestnut St", phone: "(415) 673-7100", url: "https://www.delarosasf.com" },
      { name: "Causwells", address: "2346 Chestnut St", phone: "(415) 447-6081", url: "https://www.causwells.com" },
      { name: "Norcina", address: "3251 Pierce St", phone: "(415) 654-2542", url: "https://www.norcina.com" },
      { name: "Morella", address: "2001 Chestnut St", phone: "(628) 286-9698", url: "https://www.morellasf.com" },
    ],
    bars: [
      { name: "Horseshoe Tavern", address: "2024 Chestnut St", phone: "(415) 346-1430" },
      { name: "Sully's Marina Lounge", address: "2138 Chestnut St", phone: "(415) 922-1475" },
      { name: "Bar Darling", address: "2263 Chestnut St", url: "https://www.bardarlingsf.com" },
      { name: "The Patio", address: "3232 Scott St", phone: "(415) 580-7080", url: "https://www.patiosf.com" },
    ],
    hospital: {
      name: "CPMC Van Ness Campus",
      address: "1101 Van Ness Ave",
      dist: "about 2 mi",
      phone: "(415) 600-6000",
      url: "https://www.sutterhealth.org/cpmc",
    },
    transit:
      "No Muni Metro here — it's a bus neighborhood. The 30 Stockton runs down Chestnut St to downtown and Chinatown, with the 22 Fillmore, 28 19th Ave, and 43 Masonic linking the rest of the city. Lombard St carries Golden Gate Transit toward Marin.",
  },

  "Hayes Valley": {
    spirit:
      "An ex-freeway corridor reborn as the city's most stylish stroll — design boutiques, a pocket park rotating public art, and a dense cluster of acclaimed kitchens and cocktail rooms.",
    reasons: [
      "Boutique & design shopping",
      "Top-tier dining & cocktails",
      "Patricia's Green park",
      "Central & walkable",
    ],
    aka: "Reborn after 1989",
    history:
      "Hayes Valley is named for Thomas Hayes, a county official who ran a private streetcar out Hayes Street in the 1860s and opened the area to development. For decades it sat in the shadow of the elevated Central Freeway. The 1989 Loma Prieta earthquake damaged that freeway; after years of debate it was torn down and replaced with surface boulevards and a park — sparking the neighborhood's reinvention into one of the city's top shopping-and-dining destinations.",
    facts: [
      {
        icon: "tram",
        title: "Named for a streetcar man",
        text:
          "Thomas Hayes, a mid-1800s county clerk and entrepreneur, ran a private steam railroad out Hayes Street — the line that first opened the valley to homes.",
      },
      {
        icon: "quake",
        title: "The freeway that fell",
        text:
          "The elevated Central Freeway loomed over Hayes Valley until the 1989 quake. Its demolition, finished in 2003, turned a blighted corridor into some of the city's hottest real estate.",
      },
      {
        icon: "park",
        title: "Patricia's Green",
        text:
          "The park where the freeway once stood rotates large-scale public art — it has hosted everything from Burning Man sculptures to towering installations, anchoring the neighborhood's life.",
      },
      {
        icon: "art",
        title: "Proxy: a city built from containers",
        text:
          "On a leftover freeway parcel, Proxy turned shipping containers into a rotating village of shops, food, and a beer garden — a widely copied model of temporary urbanism.",
      },
      {
        icon: "shopping",
        title: "A designer's main street",
        text:
          "With the freeway gone, Hayes Street filled with independent fashion and design boutiques, making it one of San Francisco's premier walkable shopping strips.",
      },
    ],
    restaurants: [
      { name: "Rich Table", address: "199 Gough St", phone: "(415) 355-9085", url: "https://richtablesf.com" },
      { name: "Nightbird", address: "330 Gough St", phone: "(415) 829-7565", url: "https://www.nightbirdrestaurant.com" },
      { name: "Hayes Street Grill", address: "320 Hayes St", phone: "(415) 863-5545", url: "https://www.hayesstreetgrill.com" },
      { name: "Absinthe Brasserie & Bar", address: "398 Hayes St", phone: "(415) 551-1590", url: "https://www.absinthe.com" },
    ],
    bars: [
      { name: "Smuggler's Cove", address: "650 Gough St", phone: "(415) 869-1900", url: "https://www.smugglerscovesf.com" },
      { name: "Brass Tacks", address: "488 Hayes St", phone: "(415) 993-5560", url: "https://www.brasstackssf.com" },
      { name: "Anina", address: "482 Hayes St", phone: "(415) 594-0660", url: "https://www.aninasf.com" },
      { name: "Linden Room", address: "292 Linden St", phone: "(415) 829-7565", url: "https://www.nightbirdrestaurant.com/linden-room" },
    ],
    hospital: {
      name: "CPMC Van Ness Campus",
      address: "1101 Van Ness Ave",
      dist: "about 0.7 mi",
      phone: "(415) 600-6000",
      url: "https://www.sutterhealth.org/cpmc",
    },
    transit:
      "A short walk to Van Ness and Civic Center stations puts the full Muni Metro (J, K, L, M, N, T) and BART within reach. The 21 Hayes runs the length of the neighborhood, with the 5 Fulton, 7 Haight, and 49 Van Ness close by.",
  },

  "Pacific Heights": {
    spirit:
      "Mansion-lined hills with knockout bay views and a polished Fillmore Street — old-money San Francisco at its most genteel.",
    reasons: [
      "Grand Victorian & Edwardian mansions",
      "Upscale Fillmore St shopping",
      "Bay & Golden Gate views",
      "Quiet, leafy streets",
    ],
    aka: "Pac Heights",
    history:
      "Pacific Heights rose as a wealthy enclave once cable cars made its steep hills reachable in the 1870s–80s. The high ground escaped the 1906 fire, so block after block of grand Victorian and Edwardian mansions survive. Today it holds some of the city's priciest real estate, with upper Fillmore Street as its refined shopping-and-dining spine.",
    facts: [
      {
        icon: "money",
        title: "Billionaires' Row",
        text:
          "The stretch of Broadway between Divisadero and Lyon is among the most expensive residential blocks in the U.S., home to tech moguls and old San Francisco fortunes.",
      },
      {
        icon: "house",
        title: "A Victorian open to all",
        text:
          "The Haas-Lilienthal House (1886) on Franklin St is the only intact Queen Anne Victorian mansion in the city operated as a public museum.",
      },
      {
        icon: "quake",
        title: "Above the 1906 fire",
        text:
          "Because the hilltop escaped the post-earthquake fires, Pacific Heights preserves one of the densest collections of pre-1906 mansions in San Francisco.",
      },
      {
        icon: "star",
        title: "Author of the Spreckels Mansion",
        text:
          "Novelist Danielle Steel owns the landmark Spreckels Mansion on Washington St — one of several grand homes that have drawn famous residents to the neighborhood.",
      },
      {
        icon: "shopping",
        title: "Upper Fillmore's rise",
        text:
          "What began as a post-1906 commercial strip is now one of the city's most upscale shopping streets, lined with boutiques and sidewalk cafés.",
      },
    ],
    restaurants: [
      { name: "SPQR", address: "1911 Fillmore St", phone: "(415) 771-7779", url: "https://www.spqrsf.com" },
      { name: "The Snug", address: "2301 Fillmore St", phone: "(415) 562-5092", url: "https://www.thesnugsf.com" },
      { name: "Jackson Fillmore Trattoria", address: "2506 Fillmore St", phone: "(415) 346-5288", url: "https://www.jacksonfillmoresf.com" },
      { name: "Pizzeria Delfina", address: "2406 California St", phone: "(415) 440-1189", url: "https://www.pizzeriadelfina.com" },
    ],
    bars: [
      { name: "Harry's Bar", address: "2020 Fillmore St", phone: "(415) 921-1000", url: "https://www.harrysbarsf.com" },
      { name: "Scopo Divino", address: "2800 California St", phone: "(415) 928-3728", url: "https://www.scopodivino.com" },
      { name: "Vic's Winehouse", address: "1870 Fillmore St", phone: "(619) 381-2576", url: "https://vicswinehouse.com" },
      { name: "Verve Wine", address: "2358 Fillmore St", phone: "(415) 896-4935", url: "https://sf.vervewine.com" },
    ],
    hospital: {
      name: "CPMC Van Ness Campus",
      address: "1101 Van Ness Ave",
      dist: "about 1.2 mi",
      phone: "(415) 600-6000",
      url: "https://www.sutterhealth.org/cpmc",
    },
    transit:
      "A bus neighborhood: the 1 California and 2 Clement run east–west to downtown, while the 22 Fillmore and 24 Divisadero cross north–south. The nearest rail is the Van Ness Muni Metro station, a ride downhill.",
  },

  Mission: {
    spirit:
      "Sun-soaked and street-art-splashed — the city's warmest, most flavorful neighborhood, where taquerias, galleries, and destination restaurants share every block.",
    reasons: [
      "The city's sunniest microclimate",
      "Legendary taquerias & dining",
      "Murals & Valencia St culture",
      "Two BART stations",
    ],
    aka: "La Misión",
    history:
      "The Mission grew up around Mission San Francisco de Asís (Mission Dolores), founded in 1776 — the city's oldest building and its namesake. For generations a working-class, heavily Latino neighborhood, it's famous for its murals, its taquerias, and the sunniest weather in San Francisco. A wave of acclaimed restaurants and rising rents has reshaped it in recent decades.",
    facts: [
      {
        icon: "church",
        title: "The city's oldest building",
        text:
          "Mission Dolores, completed in 1791, is the oldest intact structure in San Francisco and gave both the neighborhood and the city their names.",
      },
      {
        icon: "art",
        title: "San Francisco's mural capital",
        text:
          "Balmy Alley and Clarion Alley are open-air galleries of Latino and political street art, maintained and renewed by community artists since the 1970s.",
      },
      {
        icon: "burrito",
        title: "Home of the Mission burrito",
        text:
          "The oversized, foil-wrapped “Mission-style” burrito — rice and beans included — was born in the neighborhood's taquerias in the late 1960s and exported worldwide.",
      },
      {
        icon: "sun",
        title: "The sunny side of the fog",
        text:
          "Sheltered by Twin Peaks from the ocean fog, the Mission is reliably the warmest, sunniest neighborhood in the city — often 10°F above the foggy west side.",
      },
      {
        icon: "subway",
        title: "A transit crossroads",
        text:
          "Two BART stations at 16th and 24th & Mission, plus the busiest bus lines in the city, make it one of San Francisco's most connected neighborhoods.",
      },
    ],
    restaurants: [
      { name: "Foreign Cinema", address: "2534 Mission St", phone: "(415) 648-7600", url: "https://foreigncinema.com" },
      { name: "Flour + Water", address: "2401 Harrison St", phone: "(415) 826-7000", url: "https://www.flourandwater.com" },
      { name: "La Taqueria", address: "2889 Mission St", phone: "(415) 285-7117", url: "https://lataqueriasf.net" },
      { name: "Delfina", address: "3621 18th St", phone: "(415) 552-4055", url: "https://www.delfinasf.com" },
      { name: "Beretta", address: "1199 Valencia St", phone: "(415) 695-1199", url: "https://www.berettasf.com" },
    ],
    bars: [
      { name: "Trick Dog", address: "3010 20th St", phone: "(415) 471-2999", url: "https://www.trickdogbar.com" },
      { name: "Zeitgeist", address: "199 Valencia St", phone: "(415) 255-7505", url: "https://www.zeitgeistsf.com" },
      { name: "True Laurel", address: "753 Alabama St", phone: "(415) 341-0020", url: "https://truelaurelsf.com" },
      { name: "ABV", address: "3174 16th St", phone: "(415) 400-4748", url: "https://www.abvsf.com" },
    ],
    hospital: {
      name: "Zuckerberg San Francisco General",
      address: "1001 Potrero Ave",
      dist: "about 1 mi",
      url: "https://zuckerbergsanfranciscogeneral.org",
    },
    transit:
      "Two BART stations — 16th St and 24th St Mission — plus the 14 Mission and 49 Van Ness/Mission rapid buses make this one of the city's best-connected neighborhoods. The J-Church Muni Metro skirts the western edge.",
  },

  "North Beach": {
    spirit:
      "San Francisco's Little Italy and Beat heartland — espresso bars, red-sauce institutions, and literary saloons under the Coit Tower hill.",
    reasons: [
      "Historic Little Italy dining",
      "Beat-era cafés & bars",
      "Walk to Coit Tower & the bay",
      "Lively, walkable Columbus Ave",
    ],
    aka: "Little Italy",
    history:
      "Settled by Italian immigrants around the turn of the 20th century, North Beach became San Francisco's Little Italy. In the 1950s it was the epicenter of the Beat Generation — City Lights Bookstore, Vesuvio, and poets Kerouac and Ginsberg. It remains a dense, walkable warren of Italian restaurants, cafés, and historic bars beneath Telegraph Hill and Coit Tower.",
    facts: [
      {
        icon: "book",
        title: "Where the Beats began",
        text:
          "City Lights Bookstore, founded by poet Lawrence Ferlinghetti in 1953, published Ginsberg's “Howl” and anchored the Beat movement — still a fiercely independent landmark.",
      },
      {
        icon: "coffee",
        title: "West Coast espresso, first poured here",
        text:
          "Caffe Trieste (1956) claims to have introduced espresso to the West Coast, and North Beach's Italian café culture is among the oldest in the country.",
      },
      {
        icon: "tower",
        title: "Coit Tower's murals",
        text:
          "The 1933 tower crowning Telegraph Hill is lined inside with Depression-era WPA frescoes depicting California life — free to view in the lobby.",
      },
      {
        icon: "pizza",
        title: "The West's first pizza oven",
        text:
          "Tommaso's brought the first wood-fired brick pizza oven to the West Coast in 1935 — one of a string of red-sauce institutions still feeding the neighborhood.",
      },
      {
        icon: "bird",
        title: "The wild parrots",
        text:
          "A flock of feral cherry-headed conures — the famous wild parrots of Telegraph Hill — roosts in the trees above North Beach, subject of a hit documentary.",
      },
    ],
    restaurants: [
      { name: "Tommaso's", address: "1042 Kearny St", phone: "(415) 398-9696", url: "https://tommasos.com" },
      { name: "Sotto Mare", address: "552 Green St", phone: "(415) 398-3181", url: "https://www.sottomaresf.com" },
      { name: "Tony's Pizza Napoletana", address: "1570 Stockton St", phone: "(415) 835-9888", url: "https://tonyspizzanapoletana.com" },
      { name: "Original Joe's", address: "601 Union St", phone: "(415) 775-4877", url: "https://www.originaljoes.com/north-beach" },
    ],
    bars: [
      { name: "Vesuvio Cafe", address: "255 Columbus Ave", url: "https://vesuvio.com" },
      { name: "Specs' Twelve Adler Museum Cafe", address: "12 William Saroyan Pl", phone: "(415) 421-4112", url: "https://www.specsbarsf.com" },
      { name: "Comstock Saloon", address: "155 Columbus Ave", phone: "(415) 617-0071", url: "https://www.comstocksaloon.com" },
    ],
    hospital: {
      name: "Chinese Hospital",
      address: "845 Jackson St",
      dist: "about 0.7 mi",
      url: "https://www.chinesehospital-sf.org",
    },
    transit:
      "The Powell-Mason cable car and the 30 Stockton, 8 Market, and 39 Coit buses serve the neighborhood; the T-Third Central Subway stops just south at Chinatown–Rose Pak station. Compact North Beach is best explored on foot.",
  },

  "Russian Hill": {
    spirit:
      "Steep, secret-stairway hills crowned by the crookedest street in the world — leafy and quiet above the buzz of Polk Street.",
    reasons: [
      "Iconic Lombard St & stair-walks",
      "Polk St dining & bars",
      "Bay & bridge views",
      "Quiet, leafy hilltop living",
    ],
    history:
      "Russian Hill is named for a small Russian Orthodox cemetery early settlers found at its summit — graves of sailors and fur traders, later removed. Its steep grade kept it semi-rural until cable cars arrived, after which it became an early-1900s colony of writers and artists. It remains a quiet, affluent hill famous for Lombard Street's switchbacks and its hidden pedestrian stairways.",
    facts: [
      {
        icon: "pin",
        title: "Named for a lost cemetery",
        text:
          "Settlers found a small plot of Russian graves atop the hill in the 1850s. The bodies were eventually moved, but the name “Russian Hill” stuck.",
      },
      {
        icon: "road",
        title: "The crookedest street",
        text:
          "Lombard Street's one block of eight tight switchbacks was built in 1922 to tame a slope too steep for cars — now one of the most-visited sights in the city.",
      },
      {
        icon: "stairs",
        title: "Secret stairway streets",
        text:
          "Car-free garden stairways lace the hill — Vallejo, Filbert, and Macondray Lane, the last said to be the model for Armistead Maupin's fictional Barbary Lane.",
      },
      {
        icon: "art",
        title: "A bohemian summit",
        text:
          "In the early 1900s cheap rents and big views drew a colony of writers and artists, including California's first poet laureate, Ina Coolbrith, who lived on the hill.",
      },
      {
        icon: "bridge",
        title: "Some of the best views in the city",
        text:
          "The crest looks out over the bay, Alcatraz, and both bridges — the Willis Polk-designed Vallejo Street stairway gardens (1914) frame one of the finest vantage points.",
      },
    ],
    restaurants: [
      { name: "Nisei", address: "2316 Polk St", phone: "(415) 827-6898", url: "https://www.restaurantnisei.com" },
      { name: "Sorella", address: "1760 Polk St", phone: "(415) 359-1212", url: "https://sorellasf.com" },
      { name: "Frascati", address: "1901 Hyde St", phone: "(415) 928-1406", url: "https://www.frascatisf.com" },
      { name: "Leopold's", address: "2400 Polk St", phone: "(415) 874-9829", url: "https://www.gasthausleopolds.com" },
    ],
    bars: [
      { name: "Bar Iris", address: "2310 Polk St", phone: "(415) 827-6898", url: "https://www.bar-iris.com" },
      { name: "Macondray", address: "2209 Polk St", phone: "(415) 829-3464", url: "https://www.macondraysf.com" },
      { name: "Amélie", address: "1754 Polk St", phone: "(415) 292-6916", url: "https://www.ameliewinebar.com" },
    ],
    hospital: {
      name: "CPMC Van Ness Campus",
      address: "1101 Van Ness Ave",
      dist: "about 0.9 mi",
      phone: "(415) 600-6000",
      url: "https://www.sutterhealth.org/cpmc",
    },
    transit:
      "The Powell-Hyde cable car climbs right over the hill past Lombard Street. Buses: the 19 Polk and 41/45 Union serve the slopes, with the 49 Van Ness rapid a short walk east toward downtown.",
  },

  "Nob Hill": {
    spirit:
      "The city's loftiest old-money summit — grand hotels, Grace Cathedral, and cable cars clanging past the ghosts of the railroad barons.",
    reasons: [
      "Historic luxury hotels",
      "Grace Cathedral",
      "Cable cars at the door",
      "Sweeping city views",
    ],
    aka: "“Snob Hill”",
    history:
      "Nob Hill became San Francisco's most prestigious address in the 1870s, when the railroad and silver tycoons known as the “Big Four” built mansions atop it — made reachable by Andrew Hallidie's new cable cars. The 1906 fire destroyed the wooden palaces; in their place rose the grand hotels and Grace Cathedral that define the hill today.",
    facts: [
      {
        icon: "money",
        title: "Built by the Big Four",
        text:
          "Railroad barons Stanford, Crocker, Hopkins, and Huntington built their mansions here in the 1870s — the source of the hill's name (from “nabob”) and its airs.",
      },
      {
        icon: "tram",
        title: "The cable car made it possible",
        text:
          "Only after Hallidie's 1873 cable car conquered the brutal grade could the wealthy build at the top. Three cable car lines still cross Nob Hill.",
      },
      {
        icon: "quake",
        title: "Stone survived, wood didn't",
        text:
          "The 1906 fire leveled the wooden mansions; only the granite Flood Mansion endured — now the Pacific-Union Club — while the rubble cleared the way for the grand hotels.",
      },
      {
        icon: "church",
        title: "Grace Cathedral's golden doors",
        text:
          "Completed in 1964, Grace Cathedral has gilded “Ghiberti” doors cast from the Florence Baptistery originals and two labyrinths open for walking meditation.",
      },
      {
        icon: "star",
        title: "A wartime farewell",
        text:
          "At the Top of the Mark sky lounge (1939), WWII servicemen toasted from the northwest “Squadron Corner” before shipping out across the Pacific — a ritual that became legend.",
      },
    ],
    restaurants: [
      { name: "Acquerello", address: "1722 Sacramento St", phone: "(415) 567-5432", url: "https://www.acquerellosf.com" },
      { name: "Sons & Daughters", address: "708 Bush St", phone: "(415) 994-7933", url: "https://www.sonsanddaughterssf.com" },
      { name: "Swan Oyster Depot", address: "1517 Polk St", phone: "(415) 673-1101" },
      { name: "The Big Four", address: "1075 California St", phone: "(415) 212-6569", url: "https://www.thehuntingtonhotel.com/the-big-four" },
    ],
    bars: [
      { name: "Top of the Mark", address: "999 California St", phone: "(415) 392-3434", url: "https://www.topofthemark.com" },
      { name: "Tonga Room & Hurricane Bar", address: "950 Mason St", phone: "(415) 772-5278", url: "https://www.fairmont-san-francisco.com/dine/tonga-room-hurricane-bar/" },
      { name: "Harper & Rye", address: "1695 Polk St", phone: "(415) 562-7493", url: "https://www.harperandrye.com" },
    ],
    hospital: {
      name: "Saint Francis Memorial Hospital",
      address: "900 Hyde St",
      dist: "about 0.5 mi",
      url: "https://www.dignityhealth.org/bayarea/locations/saint-francis",
    },
    transit:
      "All three cable car lines cross Nob Hill — the California St line runs right over the summit, with the Powell-Hyde and Powell-Mason lines on either flank. The 1 California bus and a walk down to Powell St BART/Muni round it out.",
  },

  "Cole Valley": {
    spirit:
      "A tucked-away village at the foot of Tank Hill — a few sunny blocks of cafés and bistros wrapped in Edwardian flats, minutes from Golden Gate Park.",
    reasons: [
      "Village-y, walkable Cole St",
      "Steps from Golden Gate Park",
      "Sunny pocket below the hills",
      "Family-friendly Edwardians",
    ],
    history:
      "Cole Valley is a small, affluent enclave just south of Haight-Ashbury, built out as a streetcar suburb in the early 1900s — much of it just after the 1906 earthquake. It's named for Cole Street, which honors Dr. R. Beverly Cole, a prominent 19th-century physician and UC medical dean. Sitting below Tank Hill and Mount Sutro, beside UCSF and Golden Gate Park, it's prized for its quiet, village feel.",
    facts: [
      {
        icon: "mayor",
        title: "Named for a doctor",
        text:
          "Cole Street and the neighborhood honor Dr. R. Beverly Cole, a leading 19th-century San Francisco physician and dean of the University of California medical school.",
      },
      {
        icon: "tram",
        title: "Built by the N-Judah",
        text:
          "The N-Judah streetcar (1928) dives under the hill through the Sunset Tunnel, surfacing at Cole Valley's Carl & Cole portal — the line that built and still serves the village.",
      },
      {
        icon: "bridge",
        title: "Tank Hill's hidden view",
        text:
          "The rocky outcrop above Cole Valley — once home to a giant water tank — offers one of the city's best and least-crowded panoramas, from downtown to the Golden Gate.",
      },
      {
        icon: "house",
        title: "An Edwardian time capsule",
        text:
          "Built largely just after 1906, Cole Valley's tidy blocks of Edwardian flats stayed quietly residential even as the Haight next door became a 1960s counterculture epicenter.",
      },
      {
        icon: "sun",
        title: "On the sunny side",
        text:
          "Sheltered just east of Twin Peaks and Mount Sutro, Cole Valley catches noticeably more sun than the fog-bound Sunset neighborhoods immediately to the west.",
      },
    ],
    restaurants: [
      { name: "Zazie", address: "941 Cole St", phone: "(415) 564-5332", url: "https://www.zaziesf.com" },
      { name: "Beit Rima", address: "86 Carl St", phone: "(415) 566-1274", url: "https://beitrimasf.com" },
      { name: "Bambino's Ristorante", address: "945 Cole St", phone: "(415) 731-1343", url: "https://www.bambinosristorante.com" },
    ],
    bars: [
      { name: "Cole Valley Tavern", address: "900 Cole St", phone: "(415) 681-6768", url: "https://www.colevalleytavern.com" },
      { name: "Finnegans Wake", address: "937 Cole St", phone: "(415) 731-6119", url: "http://www.finneganssf.com" },
      { name: "InoVino", address: "108B Carl St", phone: "(415) 681-3770", url: "https://inovinosanfrancisco.com" },
    ],
    hospital: {
      name: "UCSF Medical Center at Parnassus",
      address: "505 Parnassus Ave",
      dist: "about 0.4 mi",
      phone: "(415) 476-1000",
      url: "https://www.ucsfhealth.org",
    },
    transit:
      "The N-Judah Muni Metro stops at Carl & Cole on its way downtown through the Sunset Tunnel. The 6 Haight–Parnassus, 37 Corbett, and 43 Masonic buses fill in, and Golden Gate Park is a block north.",
  },

  "Bernal Heights": {
    spirit:
      "A sunny village on a grassy hill — off-leash dog heaven, knockout views, and a low-key Cortland Avenue that still feels like a small town.",
    reasons: [
      "Sunny, village-y Cortland Ave",
      "Bernal Hill off-leash park & views",
      "Family-friendly & laid-back",
      "Quiet hillside streets",
    ],
    aka: "“Maternal Heights”",
    history:
      "Bernal Heights sits on a rocky hill that was the heart of Rancho Rincón de las Salinas, granted to José Cornelio Bernal in 1839. It grew as a working-class, almost rural district; because it sits on solid bedrock, it largely escaped the 1906 quake, and refugees built cottages here. Long bohemian and diverse, it's now a beloved family neighborhood known for its sun, its hilltop park, and the small-town feel of Cortland Avenue.",
    facts: [
      {
        icon: "pin",
        title: "Named for a land-grant family",
        text:
          "José Cornelio Bernal's 1839 Mexican land grant — Rancho Rincón de las Salinas y Potrero Viejo — covered the hill and the flats around it, and gave the neighborhood its name.",
      },
      {
        icon: "quake",
        title: "Saved by bedrock",
        text:
          "Bernal sits on solid Franciscan rock and barely shook in 1906. Refugees from the burning city threw up earthquake-shack cottages on the hill — some still tucked among the houses today.",
      },
      {
        icon: "dog",
        title: "The city's dog park",
        text:
          "Grassy, treeless Bernal Heights Park crowns the hill — one of San Francisco's most-loved off-leash dog runs, with a 360° view loop that fills with locals at sunset.",
      },
      {
        icon: "stairs",
        title: "Stairways and hidden lanes",
        text:
          "The steep hill is laced with public stairway streets and narrow lanes — Esmeralda, Coso, and the Bernal “goat paths” — that wander between gardens instead of along the road grid.",
      },
      {
        icon: "star",
        title: "“Maternal Heights”",
        text:
          "Long a haven for artists, lesbian families, and working households, Bernal kept its mellow, small-town character as the city changed — earning its affectionate nickname.",
      },
    ],
    restaurants: [
      { name: "3rd Cousin", address: "919 Cortland Ave", phone: "(415) 814-3709", url: "https://www.3rdcousinsf.com" },
      { name: "Precita Social", address: "300 Precita Ave", phone: "(415) 729-9029", url: "https://www.precitasocial.com" },
      { name: "Emmy's Spaghetti Shack", address: "3230 Mission St", phone: "(415) 206-2086", url: "https://sfspaghettishack.com" },
      { name: "Moki's Sushi & Pacific Grill", address: "615 Cortland Ave", phone: "(415) 970-9336", url: "https://mokisf.com" },
    ],
    bars: [
      { name: "VinoRosso", address: "629 Cortland Ave", phone: "(415) 647-1268", url: "https://www.vinorosso-sf.com" },
      { name: "Mothership", address: "3152 Mission St", url: "https://www.mothershipbar.com" },
      { name: "The Royal Cuckoo", address: "3202 Mission St" },
    ],
    hospital: {
      name: "CPMC Mission Bernal Campus",
      address: "3555 Cesar Chavez St",
      dist: "about 0.7 mi",
      phone: "(415) 600-6000",
      url: "https://www.sutterhealth.org/cpmc",
    },
    transit:
      "The 24 Divisadero runs along Cortland Ave, and the little 67 Bernal Heights bus loops up the hill. Down on Mission St, the 14 and 49 rapid buses and the 24th St Mission BART station connect to the rest of the city.",
  },

  "Potrero Hill": {
    spirit:
      "The city's sunniest hill — sweeping downtown-and-bay views, sleepy residential streets, and a tucked-away 18th Street strip of neighborhood favorites.",
    reasons: [
      "One of SF's sunniest, warmest spots",
      "Downtown & bay views",
      "Quiet, low-key 18th St",
      "Central & freeway-close",
    ],
    history:
      "Potrero — Spanish for “pasture” — was 19th-century grazing land that grew into a working-class, industrial neighborhood of shipyard workers and a tight Russian and Slovenian community. Sheltered from the fog by the hills to its west, it's among the sunniest parts of the city. Long overlooked, it's now prized for its sun, its big views, and its quiet streets above the old industrial flats.",
    facts: [
      {
        icon: "sun",
        title: "The sunny pasture",
        text:
          "“Potrero” means pasture in Spanish — and tucked in the lee of Twin Peaks, the hill is one of the sunniest, warmest, least foggy neighborhoods in San Francisco.",
      },
      {
        icon: "beer",
        title: "Home of Anchor Steam",
        text:
          "Anchor Brewing brewed its iconic Anchor Steam on Potrero Hill from 1979 until the brewery's closure in 2023 — a neighborhood institution for over four decades.",
      },
      {
        icon: "factory",
        title: "A working-class, immigrant hill",
        text:
          "Shipyard and industrial jobs drew Russian, Slovenian, and other immigrant families; the Slovenian Hall on Mariposa St still stands as a reminder of that heritage.",
      },
      {
        icon: "road",
        title: "The other crookedest street",
        text:
          "Vermont Street's tight switchbacks on Potrero Hill are often argued to be even more crooked than Lombard — with a fraction of the tourists.",
      },
      {
        icon: "bridge",
        title: "Front-row downtown views",
        text:
          "The hill's eastern slopes look straight across at the downtown skyline and the bay — a big reason its quiet streets have become so sought-after.",
      },
    ],
    restaurants: [
      { name: "Plow", address: "1299 18th St", phone: "(415) 821-7569", url: "https://www.eatatplow.com" },
      { name: "Chez Maman", address: "1401 18th St", phone: "(415) 655-9542", url: "https://www.chezmamanrestos.com" },
      { name: "Goat Hill Pizza", address: "300 Connecticut St", phone: "(415) 641-1440", url: "https://www.goathillpizza.com" },
      { name: "Umi", address: "1328 18th St", phone: "(415) 355-1328", url: "http://umisf.com" },
    ],
    bars: [
      { name: "Bloom's Saloon", address: "1318 18th St", phone: "(415) 552-6707" },
      { name: "Thee Parkside", address: "1600 17th St", phone: "(415) 252-1330", url: "https://www.theeparkside.com" },
      { name: "Ruby Wine", address: "1419 18th St", phone: "(415) 401-7708", url: "https://rubywinesf.com" },
    ],
    hospital: {
      name: "Zuckerberg San Francisco General",
      address: "1001 Potrero Ave",
      dist: "about 0.7 mi",
      url: "https://zuckerbergsanfranciscogeneral.org",
    },
    transit:
      "The 22 Fillmore crosses the hill toward the Mission and Mission Bay, with the 19 Polk and 10 Townsend serving the slopes. The 22nd Street Caltrain station sits at the eastern foot for quick trips down the Peninsula.",
  },

  "Glen Park": {
    spirit:
      "A leafy “village in the city” wrapped around a wild canyon — a tiny Diamond Street downtown, a BART stop, and a creek-fed park at the back door.",
    reasons: [
      "Village downtown + BART",
      "Glen Canyon Park & trails",
      "Quiet & family-friendly",
      "Sheltered, sunny valley",
    ],
    aka: "“The Village in the City”",
    history:
      "Glen Park grew around Glen Canyon, a rugged ravine that in the 1880s held an amusement park, a small zoo, and — less charmingly — a dynamite works that occasionally blew up. Streetcars and later BART (1973) turned it into a commuter-friendly enclave. It remains a small, leafy neighborhood with a compact “village” downtown where Diamond and Chenery meet.",
    facts: [
      {
        icon: "park",
        title: "A wild canyon in the city",
        text:
          "Glen Canyon Park is a rugged ravine with rock-climbing outcrops and Islais Creek — one of the last free-flowing creeks in San Francisco — a pocket of the landscape as it was before the city.",
      },
      {
        icon: "fair",
        title: "Amusement park & dynamite",
        text:
          "In the 1880s the canyon held a popular amusement park and zoo. It also hosted a dynamite-manufacturing works whose periodic explosions rattled the early neighborhood.",
      },
      {
        icon: "subway",
        title: "Small neighborhood, big transit",
        text:
          "Glen Park BART (opened 1973) makes this tiny village one of the most transit-convenient spots in the city — a quick ride to downtown, the East Bay, or SFO.",
      },
      {
        icon: "book",
        title: "A bookstore with a beat",
        text:
          "The village's anchor is Bird & Beckett Books — a beloved independent bookstore that doubles as one of the city's most dedicated live-jazz venues.",
      },
      {
        icon: "sun",
        title: "A sheltered sunny pocket",
        text:
          "Tucked into a valley east of Twin Peaks, Glen Park catches more sun and less wind than the foggy neighborhoods just over the hill to the west.",
      },
    ],
    restaurants: [
      { name: "Gialina Pizzeria", address: "2842 Diamond St", phone: "(415) 239-8500", url: "https://www.gialina.com" },
      { name: "La Corneta Taqueria", address: "2834 Diamond St", phone: "(415) 469-8757", url: "https://lacorneta.com" },
      { name: "One Waan Thai", address: "2922 Diamond St", url: "https://onewaansf.com" },
    ],
    bars: [
      { name: "Glen Park Station", address: "2816 Diamond St", phone: "(415) 333-4633" },
    ],
    hospital: {
      name: "CPMC Mission Bernal Campus",
      address: "3555 Cesar Chavez St",
      dist: "about 1.3 mi",
      phone: "(415) 600-6000",
      url: "https://www.sutterhealth.org/cpmc",
    },
    transit:
      "Glen Park BART puts downtown, the East Bay, and SFO all within a short ride — the neighborhood's biggest draw. Muni buses 23 Monterey, 35 Eureka, 36 Teresita, and 44 O'Shaughnessy climb the surrounding hills.",
  },

  "Cow Hollow": {
    spirit:
      "Boutique-lined Union Street between the Marina and Pac Heights — brunch, blowouts, and bars on a flat, walkable stretch that was once a literal dairy pasture.",
    reasons: [
      "Union St shopping & brunch",
      "Flat & walkable",
      "Between Marina & Pac Heights",
      "Lively bar scene",
    ],
    history:
      "Cow Hollow was a marshy valley of dairy farms in the mid-1800s — dozens of dairies grazed cows here, which is exactly how it got its name. The city shut the dairies in 1891 over pollution of Washerwoman's Lagoon, filled the pond, and the area built out with Victorian and Edwardian homes. Union Street reinvented itself as a chic boutique-and-dining strip in the 1950s–60s.",
    facts: [
      {
        icon: "cow",
        title: "Once an actual cow hollow",
        text:
          "In the 1860s this green valley held dozens of dairy farms grazing the cows that supplied the growing city's milk — hence the name.",
      },
      {
        icon: "water",
        title: "The lagoon that vanished",
        text:
          "The dairies and tanneries fouled Washerwoman's Lagoon, a freshwater pond once used for laundry. The city closed them in 1891 and filled the lagoon, clearing the way for homes.",
      },
      {
        icon: "house",
        title: "A dairy farmhouse still stands",
        text:
          "The 1854 farmhouse that gave Cow Hollow its name survives on Union St — today it houses the Palm House bar and restaurant, behind one of the city's oldest palm trees.",
      },
      {
        icon: "shopping",
        title: "An early boutique row",
        text:
          "In the 1950s–60s, shopkeepers converted Union Street's old Victorians into one of San Francisco's first boutique shopping strips — a template the city's commercial streets still follow.",
      },
      {
        icon: "star",
        title: "A 1913 power saloon",
        text:
          "The Balboa Cafe (1913) is one of the city's oldest continuously operating saloons and a longtime see-and-be-seen hangout for San Francisco's political set.",
      },
    ],
    restaurants: [
      { name: "Atelier Crenn", address: "3127 Fillmore St", phone: "(415) 440-0460", url: "https://www.ateliercrenn.com" },
      { name: "Flores", address: "2030 Union St", phone: "(415) 796-2926", url: "https://www.floressf.com" },
      { name: "Roaming Goat", address: "1830 Union St", phone: "(415) 769-7281", url: "https://www.roaminggoatsf.com" },
      { name: "Rooster & Rice", address: "2211 Filbert St", phone: "(415) 776-3647", url: "https://www.roosterandrice.com" },
    ],
    bars: [
      { name: "Balboa Cafe", address: "3199 Fillmore St", phone: "(415) 921-3944", url: "https://www.balboacafesf.com" },
      { name: "Palm House", address: "2032 Union St", phone: "(415) 400-4355", url: "https://www.palmhousesf.com" },
      { name: "Bar Crenn", address: "3131 Fillmore St", phone: "(415) 440-0460", url: "https://www.barcrenn.com" },
    ],
    hospital: {
      name: "CPMC Van Ness Campus",
      address: "1101 Van Ness Ave",
      dist: "about 1.4 mi",
      phone: "(415) 600-6000",
      url: "https://www.sutterhealth.org/cpmc",
    },
    transit:
      "The 41 Union and 45 Union–Stockton buses run the length of Union Street toward downtown, with the 22 Fillmore and 43 Masonic crossing toward the rest of the city. There's no rail nearby — it's a bus-and-walk neighborhood.",
  },

  "Duboce Triangle": {
    spirit:
      "A leafy wedge where the Castro, the Mission, and the Lower Haight meet — a dog park, a streetcar portal, and Victorian calm a block off the Market Street action.",
    reasons: [
      "Central & transit-rich",
      "Duboce Park & dog run",
      "Quiet Victorian streets",
      "Steps from the Castro & Mission",
    ],
    history:
      "Duboce Triangle is a small wedge of Victorian and Edwardian homes between the Castro, the Mission, and the Lower Haight, named for Duboce Avenue — itself honoring Victor Duboce, a San Francisco supervisor and Spanish-American War officer. Built up after 1900 and largely spared by the 1906 fire, it centers on Duboce Park and the streetcar portal where the N-Judah dives underground.",
    facts: [
      {
        icon: "mayor",
        title: "Named for a war hero",
        text:
          "Duboce Avenue and the neighborhood honor Victor Duboce, a city supervisor who commanded San Francisco's volunteer regiment in the Spanish-American War.",
      },
      {
        icon: "tram",
        title: "Where the N-Judah dives under",
        text:
          "At Duboce Park, the N-Judah Muni Metro plunges into the 1928 Sunset Tunnel through the Duboce Portal — a favorite trainspotting and dog-walking spot.",
      },
      {
        icon: "dog",
        title: "One of the city's best dog parks",
        text:
          "Duboce Park's off-leash meadow, ringed by Victorian flats and a community garden, is among the most beloved dog runs in San Francisco.",
      },
      {
        icon: "art",
        title: "America's oldest public darkroom",
        text:
          "The Harvey Milk Photo Center on the park's edge — founded in 1937 — is the oldest and largest public photography center and darkroom in the United States.",
      },
      {
        icon: "house",
        title: "Pre-quake Victorians intact",
        text:
          "Spared major 1906 fire damage, the triangle keeps a dense, intact stock of pre-earthquake Victorian and Edwardian homes on its quiet, leafy blocks.",
      },
    ],
    restaurants: [
      { name: "Aquitaine", address: "216 Church St", phone: "(415) 658-7863", url: "https://aquitainesf.com" },
      { name: "Wooden Spoon", address: "2172 Market St", url: "https://www.woodenspoonsf.com" },
    ],
    bars: [
      { name: "Last Rites", address: "718 14th St", phone: "(415) 295-2965", url: "https://www.lastritesbar.com" },
      { name: "Blackbird", address: "2124 Market St", phone: "(415) 872-5310", url: "https://www.blackbirdbar.com" },
      { name: "Churchill", address: "198 Church St", phone: "(415) 570-9198", url: "https://www.churchillsf.com" },
    ],
    hospital: {
      name: "CPMC Davies Campus",
      address: "45 Castro St at Duboce Ave",
      dist: "about 0.3 mi",
      phone: "(415) 600-6000",
      url: "https://www.sutterhealth.org/cpmc",
    },
    transit:
      "Church St station puts the entire Muni Metro (J, K, L, M, N, T) and the F-line streetcar at your feet, and the N-Judah surfaces right at Duboce Park. The 22 Fillmore crosses on Church St.",
  },

  "South of Market": {
    spirit:
      "The city's flat, fast-changing engine room — tech towers, world-class museums, ballpark roar, and warehouse nightlife sprawled across the blocks south of Market.",
    reasons: [
      "Museums, Moscone & the ballpark",
      "Tech-job epicenter",
      "Nightlife & clubs",
      "Transit & freeway hub",
    ],
    aka: "SoMa",
    history:
      "South of Market — “SoMa” — was the city's industrial and working-class heart from the Gold Rush on: rail yards, factories, and laborers' rooming houses in the area once called “South of the Slot.” Hit hard by the 1906 quake and fire, it was reborn in stages — Moscone Center, Yerba Buena, SFMOMA, and the ballpark — then transformed again by the 2000s–2010s tech boom and its high-rises.",
    facts: [
      {
        icon: "factory",
        title: "“South of the Slot”",
        text:
          "SoMa was long called “South of the Slot,” for the cable-car slot down Market St that divided the working-class, industrial south side from the white-collar north.",
      },
      {
        icon: "art",
        title: "A museum district",
        text:
          "Yerba Buena Gardens and SFMOMA anchor a dense cultural quarter; SFMOMA — founded 1935 and rebuilt in 2016 — is one of the largest modern-art museums in the country.",
      },
      {
        icon: "money",
        title: "The tech boom's home base",
        text:
          "The 2010s planted tech headquarters across SoMa, capped by Salesforce Tower (2018) — at 1,070 feet, the tallest building in San Francisco.",
      },
      {
        icon: "subway",
        title: "The city's transit spine",
        text:
          "Multiple Muni Metro and BART stations line Market St, the T-Third Central Subway runs under 4th, Caltrain terminates at 4th & King, and the Salesforce Transit Center tops it off.",
      },
      {
        icon: "quake",
        title: "Built on filled marsh",
        text:
          "Much of SoMa sits on filled creek beds and bay mud — soft ground that shook hard and burned in both 1906 and 1989, and still shapes the city's seismic maps today.",
      },
    ],
    restaurants: [
      { name: "Yank Sing", address: "101 Spear St (Rincon Center)", phone: "(415) 781-1111", url: "https://yanksing.com" },
      { name: "Deli Board", address: "1058 Folsom St", phone: "(415) 552-7687", url: "https://www.deliboardsf.com" },
      { name: "Square Pie Guys", address: "1077 Mission St", phone: "(415) 872-9290", url: "https://www.squarepieguys.com" },
      { name: "Montesacro Pinseria", address: "510 Stevenson St", phone: "(415) 795-3040", url: "https://www.montesacrosf.com" },
    ],
    bars: [
      { name: "The Pawn Shop", address: "993 Mission St", phone: "(415) 874-8041", url: "https://www.thepawnshopsf.com" },
      { name: "House of Shields", address: "39 New Montgomery St", phone: "(415) 769-8109", url: "https://www.thehouseofshields.com" },
      { name: "Local Edition", address: "691 Market St", phone: "(415) 795-1375", url: "https://www.localeditionsf.com" },
    ],
    hospital: {
      name: "Zuckerberg San Francisco General",
      address: "1001 Potrero Ave",
      dist: "about 1.5 mi",
      url: "https://zuckerbergsanfranciscogeneral.org",
    },
    transit:
      "SoMa is the city's transit hub: Powell, Montgomery, and Civic Center stations connect Muni Metro and BART, the T-Third Central Subway runs under 4th St, and Caltrain to the Peninsula terminates at 4th & King.",
  },

  "Presidio Heights": {
    spirit:
      "A hushed, tree-lined enclave of grand mansions and a discreet, upscale Sacramento Street, where old San Francisco money lives quietly at the edge of the Presidio.",
    reasons: [
      "Stately mansions, leafy streets",
      "Boutique Sacramento St shopping",
      "Steps from the Presidio",
      "Quiet, safe, and central",
    ],
    aka: "Presidio Terrace area",
    history:
      "Presidio Heights takes its name from its perch on the high ground beside the Presidio army post. The district filled in during the early 1900s, accelerating after the 1906 earthquake and fire as prosperous families rebuilt west of the ruined downtown. Its centerpiece, Presidio Terrace, was a master-planned community begun in 1905 by developers Baldwin & Howell, with thirty-six lots on a single private oval street.",
    facts: [
      {
        icon: "money",
        title: "The $90,000 street",
        text:
          "In 2015 a San Jose couple bought Presidio Terrace's private street at a city tax auction for about $90,100 after the homeowners association left a small annual tax bill unpaid for years. The city later voted to reverse the sale.",
      },
      {
        icon: "house",
        title: "A gated private oval",
        text:
          "Presidio Terrace is a single circular private street ringed by mansions. It was among the first San Francisco developments with underground utilities and electric street lights, unusual luxuries for the early 1900s.",
      },
      {
        icon: "church",
        title: "Temple Emanu-El's dome",
        text:
          "The neighborhood's skyline is anchored by Congregation Emanu-El, completed in 1926. Its massive red-tiled dome was inspired by Istanbul's Hagia Sophia and remains one of the city's landmark houses of worship.",
      },
      {
        icon: "star",
        title: "Michelin on Sacramento St",
        text:
          "For a quiet residential district, the dining is serious. Spruce and Sorrel have both earned Michelin recognition, drawing diners from across the city to a few low-key blocks.",
      },
      {
        icon: "park",
        title: "The Presidio at the doorstep",
        text:
          "Residents step almost directly into the Presidio, a former military base turned national park. Its forests, trails, and bay overlooks form a vast green backyard along the neighborhood's northern edge.",
      },
    ],
    restaurants: [
      { name: "Spruce", address: "3640 Sacramento St", phone: "(415) 931-5100", url: "https://www.sprucesf.com" },
      { name: "Sorrel", address: "3228 Sacramento St", phone: "(415) 525-3765", url: "https://www.sorrelrestaurant.com" },
      { name: "Sociale", address: "3665 Sacramento St", phone: "(415) 921-3200", url: "https://sfsociale.com" },
    ],
    bars: [
      { name: "Spruce Bar", address: "3640 Sacramento St", phone: "(415) 931-5100", url: "https://www.sprucesf.com" },
      { name: "Scopo Divino", address: "2800 California St", phone: "(415) 928-3728", url: "https://www.scopodivino.com" },
    ],
    hospital: {
      name: "UCSF Medical Center at Parnassus",
      address: "505 Parnassus Ave",
      dist: "about 1.6 mi",
      phone: "(415) 353-1008",
      url: "https://www.ucsfhealth.org/locations/parnassus-campus",
    },
    transit:
      "The 1 California trolleybus is the workhorse, running along Sacramento and California streets east to downtown and west toward the Richmond. The 33 Ashbury/18th and 43 Masonic add north–south connections via Presidio Avenue.",
  },

  "Telegraph Hill": {
    spirit:
      "A steep, leafy enclave crowned by Coit Tower, threaded with hidden garden stairways and screeching wild parrots, perched dramatically above North Beach and the bay.",
    reasons: [
      "Coit Tower at your door",
      "Iconic garden staircases",
      "Wild parrot neighbors",
      "Walk to North Beach",
    ],
    aka: "Goat Hill",
    history:
      "Telegraph Hill takes its name from the semaphore signal station built atop it in 1849, which flagged arriving ships to merchants below. Earlier called Loma Alta by the Spanish and \"Goat Hill\" by settlers, it became a working-class enclave of Irish and Italian immigrants. Quarrying blasted away its eastern face for ballast and seawall fill, creating today's sheer cliffs. In the 1930s the hill's artists and bohemians cemented its reputation, and Coit Tower rose in 1933.",
    facts: [
      {
        icon: "tower",
        title: "A firefighter's gift",
        text:
          "Coit Tower was funded by a bequest from heiress Lillie Hitchcock Coit, who adored the city's volunteer firefighters. Despite the resemblance, it was not designed to look like a fire hose nozzle.",
      },
      {
        icon: "bird",
        title: "The wild parrots",
        text:
          "A flock of feral cherry-headed conures roams the hill, descended from escaped or released pets. They were made famous by the 2003 documentary The Wild Parrots of Telegraph Hill.",
      },
      {
        icon: "stairs",
        title: "Secret garden stairs",
        text:
          "The Filbert and Greenwich Steps descend the hill's steep eastern cliff through lush private gardens. They were largely planted and tended for decades by resident Grace Marchant.",
      },
      {
        icon: "art",
        title: "Depression-era murals",
        text:
          "The interior of Coit Tower is lined with 1934 fresco murals painted by 25 artists under the New Deal's Public Works of Art Project. Their social-realist themes briefly stirred political controversy.",
      },
      {
        icon: "quake",
        title: "Saved by wine",
        text:
          "Residents are said to have saved homes on the hill's eastern slope from the 1906 fire by dousing them with barrels of red wine when the water mains failed.",
      },
    ],
    nearby: ["North Beach"],
    restaurants: [
      { name: "Sotto Mare Oysteria & Seafood", address: "552 Green St", phone: "(415) 398-3181", url: "https://www.sottomaresf.com" },
      { name: "Tony's Pizza Napoletana", address: "1570 Stockton St", phone: "(415) 835-9888", url: "https://tonyspizzanapoletana.com" },
      { name: "Mama's on Washington Square", address: "1701 Stockton St", phone: "(415) 362-6421", url: "https://www.mamas-sf.com" },
      { name: "Original Joe's North Beach", address: "601 Union St", phone: "(415) 775-4877", url: "https://www.originaljoes.com/north-beach" },
      { name: "Caffe Trieste", address: "601 Vallejo St", phone: "(415) 392-6739", url: "https://caffetrieste.com" },
    ],
    bars: [
      { name: "Vesuvio Cafe", address: "255 Columbus Ave", phone: "(415) 595-9313", url: "https://vesuvio.com" },
      { name: "Specs' Twelve Adler Museum Cafe", address: "12 William Saroyan Pl", phone: "(415) 421-4112", url: "https://www.specsbarsf.com" },
    ],
    hospital: {
      name: "Chinese Hospital",
      address: "845 Jackson St",
      dist: "about 0.6 mi",
      phone: "(415) 982-2400",
      url: "https://chinesehospital-sf.org",
    },
    transit:
      "Muni bus 39 (Coit) climbs the hill to Coit Tower and connects to Washington Square. Nearby, the 8, 30, and 45 lines run along Columbus and Stockton through North Beach, with the F Market streetcar down on the Embarcadero.",
  },

  Seacliff: {
    spirit:
      "San Francisco's most exclusive enclave, where grand mansions perch on the bluffs above China Beach and Baker Beach, framing sweeping Golden Gate views.",
    reasons: [
      "Grand cliffside mansions",
      "Sweeping Golden Gate views",
      "Secluded China Beach",
      "Old-money exclusivity",
    ],
    aka: "Sea Cliff",
    history:
      "Sea Cliff takes its name from its dramatic perch on the bluffs above the Pacific. The Allen real-estate group began developing the enclave around 1912 as one of San Francisco's master-planned \"residence parks,\" with landscape architect Mark Daniels laying out the curving streets, ornate entry gates, fountains and large lots to evoke genteel country living. Mediterranean and period-revival homes filled in through the 1920s and 1930s, and the neighborhood has remained a quiet, purely residential address ever since.",
    facts: [
      {
        icon: "house",
        title: "A planned residence park",
        text:
          "Sea Cliff was one of San Francisco's master-planned residence parks laid out after the 1906 quake. Landscape architect Mark Daniels designed it with gated entries, sculptures and fountains to feel like a garden suburb.",
      },
      {
        icon: "money",
        title: "Celebrity enclave",
        text:
          "The neighborhood's privacy and views have long drawn the wealthy and famous. Robin Williams and Sharon Stone both owned homes here, alongside tech founders and old San Francisco families.",
      },
      {
        icon: "wave",
        title: "China Beach and Baker Beach",
        text:
          "Tucked below the bluffs, sheltered China Beach is one of the city's few swimmable coves. Just north, larger Baker Beach stretches toward the Golden Gate Bridge with postcard views.",
      },
      {
        icon: "water",
        title: "The 1995 sewer collapse",
        text:
          "In December 1995 a ruptured sewer on Sea Cliff Avenue triggered aggressive erosion and a series of slope collapses along El Camino del Mar. Several homes were damaged in one of the neighborhood's most dramatic incidents.",
      },
      {
        icon: "bridge",
        title: "Golden Gate panoramas",
        text:
          "Built on bluffs west of the Presidio, Sea Cliff offers some of the city's finest views of the Golden Gate Bridge and the Marin Headlands. Many homes were oriented expressly to capture them.",
      },
    ],
    nearby: ["the Inner Richmond"],
    restaurants: [
      { name: "Burma Superstar", address: "309 Clement St", phone: "(415) 387-2147", url: "https://www.burmasuperstar.com" },
      { name: "Mamahuhu", address: "517 Clement St", phone: "(415) 742-4958", url: "https://eatmamahuhu.com" },
      { name: "Chapeau!", address: "126 Clement St", phone: "(415) 387-0408", url: "https://www.chapeausf.com" },
      { name: "Le Soleil", address: "133 Clement St", phone: "(415) 668-4848" },
    ],
    bars: [
      { name: "The Plough and the Stars", address: "116 Clement St", phone: "(415) 751-1122" },
      { name: "540 Club", address: "540 Clement St", phone: "(415) 752-7276" },
      { name: "Richmond Republic Draught House", address: "642 Clement St", phone: "(415) 379-9000" },
    ],
    hospital: {
      name: "Kaiser Permanente San Francisco Medical Center",
      address: "2425 Geary Blvd",
      dist: "about 2.5 mi",
      phone: "(415) 833-2000",
      url: "https://healthy.kaiserpermanente.org",
    },
    transit:
      "Seacliff is a quiet, car-oriented enclave; the nearest lines are the 1 California along the southern edge, with the 18 46th Avenue and 29 Sunset skirting Lincoln Park to the west.",
  },

  "Lake Street": {
    spirit:
      "A serene enclave of stately period homes lining a leafy street between the Presidio and Mountain Lake Park, prosperous and quiet on the Richmond's northern edge.",
    reasons: [
      "Grand period homes",
      "Steps from the Presidio",
      "Mountain Lake Park nearby",
      "Quiet residential elegance",
    ],
    aka: "Lake District",
    history:
      "Lake Street takes its name from Mountain Lake, one of the last natural lakes in San Francisco, fed by a chain of dunes and springs along the Presidio's southern boundary. Spanish explorer Juan Bautista de Anza camped at the lake in March 1776 while scouting sites for the Presidio and Mission. The surrounding Richmond District sand dunes were subdivided and developed in the early 20th century, when builders erected the large, architecturally rich single-family homes that still define this prosperous corridor today.",
    facts: [
      {
        icon: "water",
        title: "A real natural lake",
        text:
          "Mountain Lake is one of San Francisco's few remaining natural lakes. Long degraded by runoff, it underwent a major restoration in the 2010s that returned native plants and wildlife to its shores.",
      },
      {
        icon: "flag",
        title: "Anza camped here in 1776",
        text:
          "Juan Bautista de Anza's expedition made camp at Mountain Lake in late March 1776. From here he set out to choose the sites for the Presidio and Mission Dolores, founding the city.",
      },
      {
        icon: "park",
        title: "Mountain Lake Park",
        text:
          "The lake anchors a beloved green park with playgrounds, tennis courts, and trails. A path connects directly into the Presidio and the Juan Bautista de Anza National Historic Trail.",
      },
      {
        icon: "house",
        title: "Grand period homes",
        text:
          "Lake Street is known for its large, well-kept early-20th-century houses in Mediterranean, Tudor, and period-revival styles. It is one of the Richmond's most affluent and architecturally distinguished residential streets.",
      },
      {
        icon: "park",
        title: "On the Presidio's doorstep",
        text:
          "The street runs along the Presidio's southern edge, giving residents quick access to forested trails, scenic overlooks, and the national park's vast open space.",
      },
    ],
    nearby: ["the Richmond District"],
    restaurants: [
      { name: "Burma Superstar", address: "309 Clement St", phone: "(415) 387-2147", url: "https://www.burmasuperstar.com" },
      { name: "Good Luck Dim Sum", address: "736 Clement St", phone: "(415) 386-3388" },
      { name: "Hard Knox Cafe", address: "2526 Clement St", phone: "(415) 752-3770", url: "https://www.hardknoxcafe.com" },
    ],
    bars: [
      { name: "The Plough and the Stars", address: "116 Clement St", phone: "(415) 751-1122" },
      { name: "Trad'r Sam", address: "6150 Geary Blvd", phone: "(415) 221-0773" },
      { name: "Blue Danube Coffee House", address: "306 Clement St", phone: "(415) 221-9041" },
    ],
    hospital: {
      name: "Kaiser Permanente San Francisco Medical Center",
      address: "2425 Geary Blvd",
      dist: "about 2 mi",
      phone: "(415) 833-2000",
      url: "https://healthy.kaiserpermanente.org",
    },
    transit:
      "The 1 California and 2 Clement run a few blocks south toward downtown, while the 33 Ashbury/18th, 38 Geary, and 38R Geary Rapid carry crosstown trips along the Richmond's main corridors.",
  },

  "Alamo Square": {
    spirit:
      "A grassy hilltop crowned with Victorians, where the candy-colored Painted Ladies pose against the downtown skyline like the postcard San Francisco everyone pictures.",
    reasons: [
      "Iconic Painted Ladies row",
      "Hilltop downtown skyline view",
      "Full House filming spot",
      "NoPa dining at the foot",
    ],
    aka: "Postcard Row",
    history:
      "The square was named for a lone cottonwood tree — álamo in Spanish — that marked a watering stop on the road from Mission Dolores to the Presidio. The four-acre park was reserved in an 1856 city survey under Mayor James Van Ness, as San Francisco platted the Western Addition. The surrounding blocks filled with grand Victorian and Edwardian homes through the 1890s, many surviving the 1906 quake, and the eastern \"Painted Ladies\" became one of the city's most photographed sights.",
    facts: [
      {
        icon: "house",
        title: "Postcard Row",
        text:
          "The six matching Victorians at 710–720 Steiner Street, built by developer Matthew Kavanaugh between 1892 and 1896, are the famed \"Painted Ladies.\" Their colorful facades framed by the skyline make this one of the most photographed blocks in San Francisco.",
      },
      {
        icon: "movie",
        title: "Full House opening",
        text:
          "The Steiner Street row appears in the opening credits of the sitcom Full House. The actual house used for exterior establishing shots, however, sits across town in Lower Pacific Heights, not on the square.",
      },
      {
        icon: "star",
        title: "The Westerfeld House",
        text:
          "The towering 1889 Queen Anne at 1198 Fulton Street, known as the Westerfeld House, anchors the square's northwest corner. Over the decades it has housed Russian émigrés, a jazz club, and a commune of artists and filmmakers.",
      },
      {
        icon: "park",
        title: "Hilltop park",
        text:
          "Alamo Square Park climbs a steep rise to roughly 100 feet, opening a sweeping view across the Painted Ladies to the downtown towers. The grassy slopes draw picnickers, dog walkers, and tourists year-round.",
      },
      {
        icon: "pin",
        title: "Western Addition roots",
        text:
          "The neighborhood sits within the Western Addition, just north of the dining corridor locals call NoPa, for \"North of the Panhandle.\" Many of its wooden homes predate the 1906 earthquake that leveled much of the city to the east.",
      },
    ],
    restaurants: [
      { name: "Nopa", address: "560 Divisadero St", phone: "(415) 864-8643", url: "https://www.nopasf.com" },
      { name: "Bar Crudo", address: "655 Divisadero St", phone: "(415) 409-0679", url: "https://www.barcrudo.com" },
      { name: "The Mill", address: "736 Divisadero St", phone: "(415) 345-1953", url: "https://www.themillsf.com" },
    ],
    bars: [
      { name: "Madrone Art Bar", address: "500 Divisadero St", phone: "(415) 241-0202" },
      { name: "The Page", address: "298 Divisadero St", phone: "(415) 255-6101" },
    ],
    hospital: {
      name: "CPMC Van Ness Campus",
      address: "1101 Van Ness Ave",
      dist: "about 1.3 mi",
      phone: "(415) 600-6000",
      url: "https://www.sutterhealth.org/cpmc",
    },
    transit:
      "A bus neighborhood: the 5 Fulton and 21 Hayes run east–west toward downtown, while the 22 Fillmore and 24 Divisadero cross north–south past the foot of the park.",
  },

  "St. Francis Wood": {
    spirit:
      "A hushed 1910s residence park of grand homes, brick-diamond sidewalks, and Italian Renaissance fountains terracing up the green western slope below Mount Davidson.",
    reasons: [
      "Olmsted-planned residence park",
      "Twin Renaissance fountains",
      "Architecturally landmark homes",
      "Steps from West Portal",
    ],
    history:
      "Named for St. Francis of Assisi, the neighborhood was launched in 1912 when the Mason-McDuffie Company bought former Sutro land to build one of California's first \"residence parks.\" Duncan McDuffie hired the Olmsted Brothers to lay curving streets along the natural topography. Architect John Galen Howard designed the entry gates, lampposts, and lower fountain; Henry Gutterson succeeded him, shaping the upper fountain and scores of homes. Most houses rose in the 1920s, and the district joined the National Register in 2022.",
    facts: [
      {
        icon: "park",
        title: "A pioneering residence park",
        text:
          "Mason-McDuffie marketed St. Francis Wood as a planned \"residence park\" with lots roughly twice the size of an ordinary city lot. Landscaped medians, boulevards, and deed restrictions were meant to keep it parklike in perpetuity.",
      },
      {
        icon: "road",
        title: "Designed by the Olmsted Brothers",
        text:
          "In 1913 Duncan McDuffie hired the famed Olmsted Brothers firm, led by James Frederick Dawson, to design the curvilinear street plan. The streets were laid out to follow the site's natural hillside contours rather than a rigid grid.",
      },
      {
        icon: "water",
        title: "Two formal fountains",
        text:
          "St. Francis Boulevard is anchored by two ornamental fountains evoking Italian Renaissance gardens. John Galen Howard designed the lower fountain and entry gates, and his successor Henry Gutterson designed the monumental upper fountain.",
      },
      {
        icon: "house",
        title: "Architect-designed homes",
        text:
          "Henry Gutterson served as supervising architect for three decades and personally designed many of the houses. The collection of period-revival homes by notable architects is central to the neighborhood's character.",
      },
      {
        icon: "star",
        title: "On the National Register",
        text:
          "After a resident-led campaign, St. Francis Wood was added to the National Register of Historic Places in 2022, recognized as an early-20th-century residence park and an intact collection of architecturally significant homes.",
      },
    ],
    nearby: ["West Portal"],
    restaurants: [
      { name: "Trattoria da Vittorio", address: "150 W Portal Ave", phone: "(415) 742-0300", url: "https://www.trattoriadavittorio.com" },
      { name: "Little Original Joe's", address: "393 W Portal Ave", phone: "(415) 759-1155", url: "https://www.littleoriginaljoes.com" },
      { name: "Elena's Mexican Restaurant", address: "255 W Portal Ave", phone: "(415) 622-4440", url: "https://www.elenasmexican.com" },
      { name: "Mozzarella di Bufala", address: "69 W Portal Ave", phone: "(415) 661-8900", url: "https://dibufala.com" },
    ],
    bars: [
      { name: "The Dubliner", address: "328 W Portal Ave", phone: "(415) 566-9444", url: "https://dublinerwp.com" },
      { name: "Philosopher's Club", address: "824 Ulloa St", phone: "(415) 753-0599" },
      { name: "Bullshead Restaurant", address: "840 Ulloa St", phone: "(415) 665-4350" },
    ],
    hospital: {
      name: "UCSF Medical Center at Parnassus",
      address: "505 Parnassus Ave",
      dist: "about 2.5 mi",
      phone: "(415) 476-1000",
      url: "https://www.ucsfhealth.org/locations/parnassus-campus",
    },
    transit:
      "West Portal Station, a short walk downhill, is a Muni Metro hub for the K Ingleside, L Taraval, and M Ocean View lines into downtown; the 48 Quintara/24th St bus links across the south of the city.",
  },

  "Haight Ashbury": {
    spirit:
      "Tie-dyed and timeless, the Haight still hums with the ghost of 1967 — Victorian flats, record shops, and incense drifting toward Golden Gate Park.",
    reasons: [
      "Birthplace of Summer of Love",
      "Grateful Dead history",
      "Vintage shops & Victorians",
      "Steps from Golden Gate Park",
    ],
    aka: "The Haight",
    history:
      "Named for pioneer banker Henry Haight and Monroe Ashbury, an early San Francisco supervisor who shaped the adjacent park land, the district filled with Victorian flats after the 1880s. Cheap rents in those subdivided homes drew artists and students in the 1960s, and by 1967 the corner of Haight and Ashbury became the epicenter of the hippie movement, drawing tens of thousands of young people during the Summer of Love and birthing a counterculture of music, protest, and psychedelia.",
    facts: [
      {
        icon: "confetti",
        title: "The Summer of Love",
        text:
          "In 1967, an estimated 100,000 young people converged on the Haight during the Summer of Love. The neighborhood became the global heart of hippie counterculture, music, and the psychedelic movement.",
      },
      {
        icon: "house",
        title: "The Grateful Dead house",
        text:
          "The Grateful Dead lived communally at 710 Ashbury Street from 1966 to 1968. The Victorian became a counterculture landmark and was the site of a famous 1967 drug bust that the band protested publicly.",
      },
      {
        icon: "star",
        title: "Janis Joplin lived here",
        text:
          "Singer Janis Joplin lived at 122 Lyon Street, near the Panhandle, during her rise to fame in the late 1960s. Many leading musicians of the era called the surrounding blocks home.",
      },
      {
        icon: "park",
        title: "Hippie Hill",
        text:
          "Just inside Golden Gate Park near the Haight Street entrance lies Hippie Hill, a grassy gathering spot for drum circles since the 1960s. It remains the site of an enormous unofficial 4/20 celebration each year.",
      },
      {
        icon: "flag",
        title: "The famous corner",
        text:
          "The intersection of Haight and Ashbury streets is the symbolic center of the neighborhood. A clock on the corner building is famously stuck at 4:20, and the street sign is among the most photographed in the city.",
      },
    ],
    restaurants: [
      { name: "Cha Cha Cha", address: "1801 Haight St", phone: "(415) 386-7670", url: "https://www.chachachasf.com" },
      { name: "Parada 22", address: "1805 Haight St", phone: "(415) 750-1111", url: "https://www.parada22.com" },
      { name: "Pork Store Cafe", address: "1451 Haight St", phone: "(415) 864-6981", url: "https://www.porkstorecafe.com" },
      { name: "Magnolia Brewing", address: "1398 Haight St", phone: "(415) 864-7468", url: "https://magnoliabrewing.com" },
    ],
    bars: [
      { name: "Aub Zam Zam", address: "1633 Haight St", phone: "(415) 861-2545" },
      { name: "Toronado", address: "547 Haight St", phone: "(415) 863-2276", url: "https://www.toronado.com" },
      { name: "The Alembic", address: "1725 Haight St", phone: "(415) 666-0822", url: "https://alembicsf.com" },
    ],
    hospital: {
      name: "UCSF Medical Center at Parnassus",
      address: "505 Parnassus Ave",
      dist: "about 0.7 mi",
      phone: "(415) 353-1008",
      url: "https://www.ucsfhealth.org/locations/parnassus-campus",
    },
    transit:
      "Muni bus lines 6, 7, 33, 43, and 71 serve the Haight; the N Judah Metro line runs a few blocks south on Carl Street and along the park.",
  },

  Japantown: {
    spirit:
      "A compact, vibrant pocket of Japanese-American culture where the Peace Pagoda presides over mall arcades, taiko drums, and cherry blossoms — one of America's last three Japantowns.",
    reasons: [
      "One of three U.S. Japantowns",
      "Japan Center under one roof",
      "Cherry Blossom Festival yearly",
      "Walkable Buchanan mall charm",
    ],
    aka: "Nihonmachi",
    history:
      "Nihonmachi, meaning \"Japantown,\" took root after the 1906 earthquake and fire pushed Japanese immigrants into the Western Addition, where the community flourished for decades. Executive Order 9066 forced their incarceration during World War II, emptying the district almost overnight; African-American war workers filled the vacated homes. Postwar, returning families rebuilt, but 1960s redevelopment razed Victorian blocks and displaced many residents, reshaping the area into today's Japan Center malls and Peace Plaza.",
    facts: [
      {
        icon: "tower",
        title: "Peace Pagoda",
        text:
          "The five-tiered concrete Peace Pagoda was a 1968 gift from sister city Osaka, designed by Japanese architect Yoshiro Taniguchi. It rises about 100 feet over Peace Plaza.",
      },
      {
        icon: "confetti",
        title: "Cherry Blossom Festival",
        text:
          "Held each April since 1968, the Northern California Cherry Blossom Festival is among the largest of its kind in the country. It draws hundreds of thousands over two weekends.",
      },
      {
        icon: "flag",
        title: "Incarceration and Redress",
        text:
          "Some 120,000 Japanese Americans were incarcerated during WWII under Executive Order 9066. The 1988 Civil Liberties Act later issued a formal apology and reparations to survivors.",
      },
      {
        icon: "movie",
        title: "The Kabuki cinema",
        text:
          "The neighborhood's landmark movie house opened in 1986 as the AMC Kabuki. It became known for reserved seating and a 21-and-over dine-in concept.",
      },
      {
        icon: "house",
        title: "Shrinking footprint",
        text:
          "Once spanning some 30 blocks before the war, Japantown today covers only about six. Redevelopment-era demolitions permanently shrank the historic district.",
      },
    ],
    restaurants: [
      { name: "Benihana", address: "1737 Post St", phone: "(415) 563-4844", url: "https://www.benihana.com" },
      { name: "Suzu Noodle House", address: "1825 Post St", phone: "(415) 346-5083" },
      { name: "On the Bridge", address: "1581 Webster St", phone: "(415) 922-7765", url: "https://onthebridgesf.com" },
      { name: "Kui Shin Bo", address: "1737 Post St", phone: "(415) 931-2002", url: "https://kuishinborestaurant.com" },
      { name: "Yakitori Edomasa", address: "1581 Webster St", phone: "(415) 872-7646", url: "https://www.edomasa-us.com" },
    ],
    bars: [
      { name: "Pa'ina Lounge & Restaurant", address: "1865 Post St", phone: "(415) 829-2642" },
      { name: "Boom Boom Room", address: "1601 Fillmore St", phone: "(415) 673-8067", url: "https://www.boomboomroom.com" },
      { name: "Kimpton Buchanan Hotel bar", address: "1800 Sutter St", phone: "(415) 921-4000" },
    ],
    hospital: {
      name: "Kaiser Permanente San Francisco Medical Center",
      address: "2425 Geary Blvd",
      dist: "about 0.6 mi",
      phone: "(415) 833-2000",
      url: "https://healthy.kaiserpermanente.org",
    },
    transit:
      "The 38 Geary and 38R Geary Rapid run just south along Geary Boulevard, while the 2 Sutter/Clement, 3 Jackson, and 22 Fillmore buses serve the surrounding blocks. The 22 Fillmore connects north to the Marina and south toward the Mission.",
  },

  "Western Addition": {
    spirit:
      "Once the West Coast's jazz capital, this resilient district pairs Victorian flats and historic Black churches with the Fillmore's neon marquees and a still-swinging live-music heartbeat.",
    reasons: [
      "Harlem of the West",
      "Historic jazz district",
      "Iconic Fillmore Auditorium",
      "Stately Victorian flats",
    ],
    aka: "The Fillmore",
    history:
      "The neighborhood is literally the \"Western Addition\" appended to the original 1850s street survey as the young city pushed west of Van Ness. After WWII its Fillmore corridor became the \"Harlem of the West,\" packed with Black-owned jazz clubs. Then 1960s–70s redevelopment (the A-2 project) bulldozed dozens of blocks, displacing thousands of mostly African-American residents and businesses — a wound the district still feels. Surviving Victorians, churches, and a revived jazz district carry that layered legacy forward.",
    facts: [
      {
        icon: "music",
        title: "Harlem of the West",
        text:
          "In the 1940s and '50s, Fillmore Street brimmed with jazz and blues clubs drawing greats like Billie Holiday and John Coltrane. The scene earned the neighborhood its \"Harlem of the West\" nickname.",
      },
      {
        icon: "confetti",
        title: "The Fillmore Auditorium",
        text:
          "At Geary and Fillmore, this 1912 hall became Bill Graham's psychedelic-rock mecca in the 1960s, launching the Grateful Dead, Janis Joplin, and Jimi Hendrix. It still hosts shows today.",
      },
      {
        icon: "road",
        title: "Urban renewal scars",
        text:
          "The 1960s–70s A-2 redevelopment project demolished some 60 blocks of the Western Addition. Thousands of mostly Black residents and hundreds of businesses were displaced, and many were never able to return.",
      },
      {
        icon: "house",
        title: "Surviving Victorians",
        text:
          "The district retains rows of ornate Victorian and Edwardian flats that escaped demolition. During redevelopment, some prized homes were even lifted onto trucks and relocated to new lots.",
      },
      {
        icon: "church",
        title: "Historic Black churches",
        text:
          "Congregations like Third Baptist and St. John Coltrane African Orthodox Church anchored the community through displacement. They remain cultural pillars of African-American life in San Francisco.",
      },
    ],
    restaurants: [
      { name: "State Bird Provisions", address: "1529 Fillmore St", phone: "(415) 795-1272", url: "https://www.statebirdsf.com" },
      { name: "Woodhouse Fish Co.", address: "1914 Fillmore St", phone: "(415) 437-2722", url: "https://www.woodhousefish.com" },
      { name: "La Méditerranée", address: "2210 Fillmore St", phone: "(415) 921-2956" },
    ],
    bars: [
      { name: "The Fillmore", address: "1805 Geary Blvd", phone: "(415) 346-3000", url: "https://www.thefillmore.com" },
      { name: "Boom Boom Room", address: "1601 Fillmore St", phone: "(415) 673-8067", url: "https://www.boomboomroom.com" },
      { name: "Sheba Piano Lounge", address: "1419 Fillmore St", phone: "(415) 440-7414", url: "https://www.shebapianolounge.com" },
      { name: "The Social Study", address: "1795 Geary Blvd", phone: "(415) 292-7417", url: "https://www.thesocialstudysf.com" },
    ],
    hospital: {
      name: "CPMC Van Ness Campus",
      address: "1101 Van Ness Ave",
      dist: "about 1 mi",
      phone: "(415) 600-6000",
      url: "https://www.sutterhealth.org/cpmc",
    },
    transit:
      "A bus-rich district: the 22 Fillmore runs north–south through its heart, the 5 Fulton and 31 Balboa cross east–west, and the 38 Geary rapid lines skirt the southern edge toward downtown.",
  },

  "Laurel Heights / Jordan Park": {
    spirit:
      "A hushed, leafy enclave of grand homes and old money south of California Street, where stately mansions, a tidy shopping village, and a buried cemetery past coexist quietly.",
    reasons: [
      "Grand planned-tract homes",
      "Quiet, affluent streets",
      "Laurel Village shopping",
      "Michelin dining nearby",
    ],
    history:
      "Beneath these quiet streets lies the former Laurel Hill Cemetery, one of San Francisco's \"Big Four\" burial grounds, which interred the city's elite from the 1850s. As the growing city ran out of room, voters banned new burials in 1900, and by the 1940s the remaining graves were exhumed and the dead relocated to Colma. Meanwhile, developer James Clark Jordan had laid out Jordan Park around 1906 as an upscale planned tract, lining its blocks with the grand homes that still define the neighborhood today.",
    facts: [
      {
        icon: "church",
        title: "A neighborhood atop a cemetery",
        text:
          "Laurel Hill Cemetery once covered much of this area, holding tens of thousands of San Franciscans. It was one of the city's \"Big Four\" cemeteries clustered near Lone Mountain.",
      },
      {
        icon: "quake",
        title: "The great removal to Colma",
        text:
          "After San Francisco banned new burials in 1900, the city eventually ordered the cemeteries cleared. By the 1940s Laurel Hill's remains were disinterred and moved south to Colma, freeing the land for housing.",
      },
      {
        icon: "house",
        title: "Jordan Park's grand tract",
        text:
          "Developer James Clark Jordan began laying out Jordan Park around 1906 as an exclusive residential tract. Its wide, well-kept blocks of stately homes remain among the city's most prized.",
      },
      {
        icon: "shopping",
        title: "Laurel Village shopping",
        text:
          "The Laurel Village center along the 3500 block of California Street has anchored neighborhood errands since the 1940s. Its grocers, cafés, and shops draw residents from across the surrounding hills.",
      },
      {
        icon: "book",
        title: "The 3333 California campus",
        text:
          "The large complex at 3333 California St began as Fireman's Fund headquarters and later housed UCSF's Laurel Heights campus. It has since been redeveloped into a mixed-use residential and academic site.",
      },
    ],
    restaurants: [
      { name: "Spruce", address: "3640 Sacramento St", phone: "(415) 931-5100", url: "https://www.sprucesf.com" },
      { name: "Sociale", address: "3665 Sacramento St", phone: "(415) 921-3200", url: "https://sfsociale.com" },
      { name: "Sorrel", address: "3228 Sacramento St", phone: "(415) 525-3765", url: "https://www.sorrelrestaurant.com" },
      { name: "Boichik Bagels", address: "3665 Sacramento St", phone: "(628) 867-7485", url: "https://boichikbagels.com" },
      { name: "Bryan's Grocery", address: "3445 California St", phone: "(415) 752-0179" },
    ],
    bars: [
      { name: "Scopo Divino", address: "2800 California St", phone: "(415) 928-3728", url: "https://www.scopodivino.com" },
      { name: "Spruce Bar", address: "3640 Sacramento St", phone: "(415) 931-5100", url: "https://www.sprucesf.com" },
    ],
    hospital: {
      name: "CPMC Van Ness Campus",
      address: "1101 Van Ness Ave",
      dist: "about 1.5 mi",
      phone: "(415) 600-6000",
      url: "https://www.sutterhealth.org/cpmc",
    },
    transit:
      "The 1 California trolleybus runs along the southern edge toward downtown and the Richmond, with the 2 Clement, 33 Ashbury/18th, and 43 Masonic adding crosstown connections nearby.",
  },

  "Ashbury Heights": {
    spirit:
      "A hushed, fog-kissed hilltop of grand Victorians and Edwardians stacked on streets so steep they break into stairways, perched serenely above the busy Haight below.",
    reasons: [
      "Grand hillside Victorians",
      "Sweeping city views",
      "Quiet leafy streets",
      "Tank Hill at the edge",
    ],
    history:
      "Ashbury Heights climbs the slope above Haight-Ashbury, sharing its name with Monroe Ashbury, a San Francisco supervisor of the 1860s who helped plan nearby Golden Gate Park. As streetcar and cable lines pushed west in the late 1800s, developers terraced these hills with grand Victorian and Edwardian homes, creating an affluent residential enclave perched above the commercial Haight. Its steep, leafy streets, hillside stairways, and panoramic views have kept it quieter and pricier than the neighborhood below ever since.",
    facts: [
      {
        icon: "park",
        title: "Buena Vista Park",
        text:
          "Bordering the neighborhood, Buena Vista Park is San Francisco's oldest official park, dedicated in 1867. Its wooded summit offers sweeping views across the city and bay.",
      },
      {
        icon: "house",
        title: "Hillside Victorians",
        text:
          "The Heights is prized for its grand Victorian and Edwardian houses lining steep blocks. Built during the streetcar-era expansion of the late 1800s, many survived the 1906 disaster intact.",
      },
      {
        icon: "star",
        title: "Tank Hill views",
        text:
          "At the neighborhood's edge sits Tank Hill, named for a water tank installed by the Spring Valley Water Company in 1894. The tank came down in 1957, leaving one of the city's best panoramic viewpoints.",
      },
      {
        icon: "stairs",
        title: "Streets that become stairs",
        text:
          "Some slopes here are too steep for cars, so the streets give way to public stairways. These hidden walkways connect blocks and reward climbers with quiet garden views.",
      },
      {
        icon: "mayor",
        title: "Named for a supervisor",
        text:
          "Monroe Ashbury served on the Board of Supervisors in the 1860s. He had a hand in planning both the surrounding neighborhood and Golden Gate Park, and the area took his name.",
      },
    ],
    nearby: ["Cole Valley", "the Haight"],
    restaurants: [
      { name: "Zazie", address: "941 Cole St", phone: "(415) 564-5332", url: "https://www.zaziesf.com" },
      { name: "Crepes on Cole", address: "100 Carl St", phone: "(415) 664-1800", url: "https://www.crepesoncole.com" },
      { name: "InoVino", address: "108B Carl St", phone: "(415) 681-3770", url: "https://inovinosanfrancisco.com" },
      { name: "Cole Valley Tavern", address: "900 Cole St", phone: "(415) 681-7678", url: "https://www.colevalleytavern.com" },
    ],
    bars: [
      { name: "The Alembic", address: "1725 Haight St", phone: "(415) 666-0822", url: "https://alembicsf.com" },
      { name: "Aub Zam Zam", address: "1633 Haight St", phone: "(415) 861-2545" },
    ],
    hospital: {
      name: "UCSF Medical Center at Parnassus",
      address: "505 Parnassus Ave",
      dist: "about 0.6 mi",
      phone: "(415) 353-1008",
      url: "https://www.ucsfhealth.org/locations/parnassus-campus",
    },
    transit:
      "The 37 Corbett climbs through the neighborhood; the 6, 7, and 43 run nearby, and the N Judah Metro line is a short walk downhill in Cole Valley.",
  },

  "Lower Pacific Heights": {
    spirit:
      "The flat, walkable shelf below grand Pacific Heights, where Victorian flats meet the lower Fillmore's restaurants, jazz heritage, and a buzzing Japantown edge.",
    reasons: [
      "Fillmore Street dining strip",
      "Historic jazz heritage",
      "Walk to Japantown",
      "Victorian & Edwardian flats",
    ],
    aka: "Lower Pac Heights",
    history:
      "Lower Pacific Heights is the flatter southern apron of Pacific Heights, blending into the Fillmore and Western Addition. Streetcar lines along Fillmore and Geary spurred dense Victorian and Edwardian flats in the late 1800s and early 1900s. The Fillmore corridor became the heart of a thriving Black community and jazz scene mid-century, much of it razed during 1960s redevelopment. Today the strip mixes longtime shops, restaurants, and music venues just north of Japantown.",
    facts: [
      {
        icon: "music",
        title: "Harlem of the West",
        text:
          "The lower Fillmore was a renowned jazz hub in the 1940s and '50s, nicknamed the \"Harlem of the West.\" Ella Fitzgerald, Duke Ellington, and Billie Holiday all played its clubs.",
      },
      {
        icon: "art",
        title: "Fillmore Jazz Festival",
        text:
          "Each July 4th weekend the street hosts the largest free jazz festival on the West Coast. It spans about twelve blocks and draws well over 100,000 visitors.",
      },
      {
        icon: "movie",
        title: "The \"Full House\" house",
        text:
          "The Victorian used for exterior shots in TV's Full House sits nearby at 1709 Broderick Street. Built in 1883, it remains a private residence and a popular photo stop.",
      },
      {
        icon: "house",
        title: "Streetcar-era flats",
        text:
          "Much of the area is lined with Victorian and Edwardian flats from the late 1800s and early 1900s. Frequent transit along Fillmore and Geary made it an early streetcar suburb.",
      },
      {
        icon: "shopping",
        title: "The Fillmore strip",
        text:
          "The street is one of the city's premier shopping and dining corridors. Its southern end blends boutiques and restaurants with the neighboring Japantown commercial district.",
      },
    ],
    restaurants: [
      { name: "State Bird Provisions", address: "1529 Fillmore St", phone: "(415) 795-1272", url: "https://www.statebirdsf.com" },
      { name: "Copra", address: "1700 Fillmore St", phone: "(415) 873-0795", url: "https://www.coprarestaurant.com" },
      { name: "Woodhouse Fish Co.", address: "1914 Fillmore St", phone: "(415) 437-2722", url: "https://www.woodhousefish.com" },
    ],
    bars: [
      { name: "Harry's Bar", address: "2020 Fillmore St", phone: "(415) 921-1000", url: "https://www.harrysbarsf.com" },
      { name: "The Page", address: "298 Divisadero St", phone: "(415) 255-6101" },
      { name: "Fly Bar & Restaurant", address: "762 Divisadero St", phone: "(415) 780-1630", url: "https://www.flybardivis.com" },
    ],
    hospital: {
      name: "CPMC Van Ness Campus",
      address: "1101 Van Ness Ave",
      dist: "about 1 mi",
      phone: "(415) 600-6000",
      url: "https://www.sutterhealth.org/cpmc",
    },
    transit:
      "The 1 California, 2 Clement, 3 Jackson, and 22 Fillmore buses all serve the area, with the 38 Geary rapid lines a block south on Geary Boulevard.",
  },

  "Buena Vista": {
    spirit:
      "A hushed hilltop of grand Victorians wrapped around a forested park, ringed by the Haight, the Castro, and Corona Heights, with sweeping bay-to-ocean views.",
    reasons: [
      "SF's oldest park",
      "Sweeping bay views",
      "Grand hillside Victorians",
      "Forested hilltop trails",
    ],
    aka: "Buena Vista Park",
    history:
      "The name is Spanish for \"good view\" — fitting for a hill that looks from the bay to the Pacific. Buena Vista Park was set aside in 1867, making it San Francisco's oldest official park, originally called Hill Park. As cable and streetcar lines reached the area in the late 1800s, developers lined the steep surrounding streets with ornate Victorian and Edwardian homes, many of which survived the 1906 earthquake and still stand today.",
    facts: [
      {
        icon: "park",
        title: "The city's oldest park",
        text:
          "Buena Vista Park was established in 1867, making it the oldest official park in San Francisco. Its forested slopes climb to one of the highest points in the central city.",
      },
      {
        icon: "book",
        title: "Headstones in the gutters",
        text:
          "The park's drainage gutters are lined with marble fragments from old headstones. They came from city cemeteries cleared in the early 20th century, and carved names and dates are still visible.",
      },
      {
        icon: "star",
        title: "Bay-to-ocean views",
        text:
          "From the summit you can see the Golden Gate Bridge, the bay, downtown, and out to the Pacific. The vista is the reason for the Spanish name \"buena vista,\" meaning good view.",
      },
      {
        icon: "house",
        title: "A showcase of Victorians",
        text:
          "The steep streets ringing the park are famous for grand Victorian and Edwardian houses. Many were built during the late-1800s streetcar boom and survived the 1906 earthquake and fire.",
      },
      {
        icon: "bird",
        title: "A forested refuge",
        text:
          "Once a windswept hill, the park was planted with eucalyptus, pine, and cypress starting in the 1890s. Today its dense canopy shelters owls, hawks, and migrating songbirds in the heart of the city.",
      },
    ],
    nearby: ["the Haight", "Cole Valley", "the Castro"],
    restaurants: [
      { name: "Zazie", address: "941 Cole St", phone: "(415) 564-5332", url: "https://www.zaziesf.com" },
      { name: "Cha Cha Cha", address: "1801 Haight St", phone: "(415) 386-7670", url: "https://www.chachachasf.com" },
      { name: "Frances", address: "3870 17th St", phone: "(415) 621-3870", url: "https://www.frances-sf.com" },
      { name: "Pork Store Cafe", address: "1451 Haight St", phone: "(415) 864-6981", url: "https://www.porkstorecafe.com" },
    ],
    bars: [
      { name: "Aub Zam Zam", address: "1633 Haight St", phone: "(415) 861-2545" },
      { name: "The Alembic", address: "1725 Haight St", phone: "(415) 666-0822", url: "https://alembicsf.com" },
      { name: "Kezar Pub", address: "770 Stanyan St", phone: "(415) 386-9292", url: "https://www.kezarpub.com" },
    ],
    hospital: {
      name: "UCSF Medical Center at Parnassus",
      address: "505 Parnassus Ave",
      dist: "about 0.8 mi",
      phone: "(415) 353-1008",
      url: "https://www.ucsfhealth.org/locations/parnassus-campus",
    },
    transit:
      "The 6 Haight/Parnassus and 7 Haight/Noriega run along the northern foot of the hill, with the 37 Corbett, 24 Divisadero, and 43 Masonic crossing nearby.",
  },

  "Dolores Heights": {
    spirit:
      "A sun-drenched hilltop enclave of steep streets and hidden stairways, where landscaped mini-parks and modernist homes frame sweeping views above Dolores Park.",
    reasons: [
      "Famous hidden stairways",
      "Sunny microclimate",
      "Panoramic hilltop views",
      "Above Dolores Park",
    ],
    history:
      "The name traces to Mission San Francisco de Asís, founded in 1776 and long known as Mission Dolores after the nearby Laguna de los Dolores, the \"Lagoon of Sorrows.\" As San Francisco grew, this steep hill above the mission lands developed into an affluent residential enclave. Builders carved homes, public stairways, and landscaped mini-parks into the precipitous terrain, creating a quiet, leafy neighborhood prized for its period and modernist houses and commanding city views.",
    facts: [
      {
        icon: "stairs",
        title: "Hidden stairways",
        text:
          "The neighborhood is laced with public stairways that climb its steepest blocks. The landscaped Cumberland and Vista stairways are local landmarks, linking streets too steep for cars and offering pocket gardens and views along the way.",
      },
      {
        icon: "church",
        title: "Mission Dolores roots",
        text:
          "The Dolores name comes from Mission San Francisco de Asís, founded in 1776 and nicknamed Mission Dolores for the nearby Laguna de los Dolores. The original adobe mission is the oldest surviving building in San Francisco.",
      },
      {
        icon: "sun",
        title: "One of the sunny pockets",
        text:
          "Tucked east of Twin Peaks, Dolores Heights sits in one of the city's sunnier microclimates. The hills often catch sun while fog blankets neighborhoods just to the west.",
      },
      {
        icon: "park",
        title: "Mini-parks on the slopes",
        text:
          "Beyond the stairways, small landscaped open spaces are built into the hillside. These mini-parks soften the steep grades and give the residential streets a quiet, garden-like character distinct from the busier Mission below.",
      },
      {
        icon: "house",
        title: "Architectural mix",
        text:
          "The enclave is known for its blend of housing styles, from Edwardian and period homes to striking mid-century modernist residences. The hilltop lots command panoramic views, making it one of the city's more coveted addresses.",
      },
    ],
    nearby: ["Noe Valley"],
    restaurants: [
      { name: "Firefly", address: "4288 24th St", phone: "(415) 821-7652", url: "https://www.fireflysf.com" },
      { name: "Saru Sushi Bar", address: "3856 24th St", phone: "(415) 400-4510", url: "https://sarusushisf.com" },
      { name: "Noe Indian Cuisine", address: "4116 24th St", url: "https://www.noeindiancuisine.com" },
      { name: "Lovejoy's Tea Room", address: "1351 Church St", phone: "(415) 648-5895", url: "https://www.lovejoystearoom.com" },
    ],
    bars: [
      { name: "Valley Tavern", address: "4054 24th St", phone: "(415) 285-0674", url: "https://www.valleytavern.com" },
      { name: "The Dubliner", address: "3838 24th St", phone: "(415) 826-2279", url: "https://www.dublinerbarsf.com" },
    ],
    hospital: {
      name: "CPMC Mission Bernal Campus",
      address: "3555 Cesar Chavez St",
      dist: "about 1 mi",
      phone: "(415) 600-6000",
      url: "https://www.sutterhealth.org/cpmc",
    },
    transit:
      "The J Church Muni Metro skirts the eastern foot of the hill by Dolores Park, with the 33, 35 Eureka, and 48 Quintara/24th St buses linking to the Mission, Castro, and Noe Valley.",
  },
};

// Some fog polygons split one colloquial neighborhood into two names —
// map those aliases onto the authored entry so a click anywhere in the
// area opens the right highlights.
const ALIASES = {
  "Union Street": "Cow Hollow", // the commercial strip within greater Cow Hollow
};

// Look up curated content for a neighborhood name (exact match on the fog
// geojson `name`, then aliases). Returns null when we haven't authored it.
export function getNeighborhood(name) {
  if (!name) return null;
  return NEIGHBORHOODS[name] || NEIGHBORHOODS[ALIASES[name]] || null;
}
