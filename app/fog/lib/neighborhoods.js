// Per-neighborhood editorial content for the "neighborhood highlights"
// pop-up (opened from the Neighborhood name on the fog/neighborhoods card).
//
// Only the editorial/curated fields live here — the home-price figure and
// the microclimate line are computed live (from the listings data and the
// picked fog contour), so they're never stored stale.
//
// Schema per entry:
//   title       string?  header override when one entry covers two fog
//                        polygons that share a story (e.g. "Cow Hollow /
//                        Union Street"); defaults to the clicked polygon name
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
    title: "Cow Hollow / Union Street",
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

  "Parnassus Heights": {
    spirit:
      "A foggy hillside where med students, eucalyptus forest, and big-sky views crowd around UCSF, wedged quietly between Cole Valley, the Haight, and the Inner Sunset.",
    reasons: [
      "UCSF medical campus",
      "Mount Sutro forest trails",
      "Sweeping city views",
      "Steep, quiet streets",
    ],
    history:
      "Parnassus Avenue takes its name from Mount Parnassus of Greek myth, echoing the classical street names nearby. In 1895 Mayor Adolph Sutro donated land overlooking Golden Gate Park, and the Affiliated Colleges opened here in 1898 — the seed of today's UCSF. The medical center grew steadily up the hillside through the 20th century, while modest homes filled the steep blocks below the forested crown of Mount Sutro.",
    facts: [
      {
        icon: "book",
        title: "Birthplace of UCSF",
        text:
          "The Affiliated Colleges opened on this hill in 1898 on land donated by Adolph Sutro. They became the University of California's San Francisco campus, now a world-renowned medical school and hospital.",
      },
      {
        icon: "bird",
        title: "Mount Sutro forest",
        text:
          "The Interior Greenbelt cloaks Mount Sutro in a dense eucalyptus forest planted under Adolph Sutro in the 1880s. UCSF maintains the roughly 60-acre Mount Sutro Open Space Reserve, laced with hiking trails.",
      },
      {
        icon: "star",
        title: "Views above the fog",
        text:
          "Perched high between Golden Gate Park and Twin Peaks, the upper streets deliver sweeping vistas. On clear days the outlook stretches across the city, the bay, and the Pacific.",
      },
      {
        icon: "house",
        title: "Steep, quiet hillside",
        text:
          "Narrow, sharply graded streets climb the slopes between the campus and the forest. The residential blocks are calm and tucked away, with shopping and dining concentrated in adjacent Cole Valley and the Inner Sunset.",
      },
      {
        icon: "subway",
        title: "The Sunset Tunnel",
        text:
          "The N Judah Muni Metro line dives under the hill through the Sunset Tunnel, linking the area to downtown and the beach. Its eastern portal sits in Cole Valley at Carl and Cole.",
      },
    ],
    nearby: ["Cole Valley", "the Inner Sunset"],
    restaurants: [
      { name: "Zazie", address: "941 Cole St", phone: "(415) 564-5332", url: "https://www.zaziesf.com" },
      { name: "San Tung", address: "1031 Irving St", phone: "(415) 242-0828", url: "https://www.santungsf.com" },
      { name: "Manna", address: "845 Irving St", phone: "(415) 665-5969" },
    ],
    bars: [
      { name: "Finnegans Wake", address: "937 Cole St", phone: "(415) 731-6119", url: "https://www.finneganssf.com" },
      { name: "The Little Shamrock", address: "807 Lincoln Way", phone: "(415) 661-0060" },
      { name: "The Red Tail", address: "545 Irving St", phone: "(415) 571-8066", url: "https://www.redtailsf.com" },
    ],
    hospital: {
      name: "UCSF Medical Center at Parnassus",
      address: "505 Parnassus Ave",
      dist: "right here",
      phone: "(415) 476-1000",
      url: "https://www.ucsfhealth.org/locations/parnassus-campus",
    },
    transit:
      "The N Judah Muni Metro runs through the Sunset Tunnel below the hill; the 6 Haight/Parnassus, 43 Masonic, and 66 Quintara buses serve the slopes.",
  },

  "Lower Haight": {
    spirit:
      "A gritty-creative pocket of Victorian flats where DJ history, dive bars, and record shops collide along a few blocks of low-key cool.",
    reasons: [
      "Legendary beer bars",
      "DJ & record-shop roots",
      "Victorian flats",
      "Gritty-creative vibe",
    ],
    aka: "Haight-Fillmore",
    history:
      "Just east of Haight-Ashbury and folded into the historic Western Addition, the Lower Haight filled with streetcar-era Victorian flats in the late 1800s, many surviving the 1906 quake. Long tied to the neighborhood's Black community, it became a 1990s hub of DJ and house-music culture, and its dive bars, cafés, and record and skate shops still define a scrappy, creative character.",
    facts: [
      {
        icon: "beer",
        title: "A beer-bar legend",
        text:
          "Toronado opened at 547 Haight in 1987 and earned national fame for its deep, ever-rotating craft and Belgian draft list — a cash-only temple for beer pilgrims.",
      },
      {
        icon: "music",
        title: "DJ and house-music roots",
        text:
          "In the 1990s the Lower Haight was a hub of San Francisco's underground DJ and house-music scene, anchored by its record shops.",
      },
      {
        icon: "house",
        title: "Victorians that survived 1906",
        text:
          "The strip is lined with streetcar-era Victorian and Edwardian flats, many of which came through the 1906 earthquake intact.",
      },
      {
        icon: "art",
        title: "Western Addition heritage",
        text:
          "Part of the historic Western Addition, the area is long tied to San Francisco's Black community and its cultural legacy.",
      },
      {
        icon: "shop",
        title: "Records, skate, and vintage",
        text:
          "Record stores, skate shops, and vintage spots give the few blocks a creative, independent retail character.",
      },
    ],
    restaurants: [
      { name: "Kate's Kitchen", address: "471 Haight St", phone: "(415) 626-3984", url: "https://orderkateskitchen.com" },
      { name: "The Grind Cafe", address: "783 Haight St", phone: "(415) 864-0955", url: "https://thegrindcafe.com" },
      { name: "Song Wat", address: "312 Divisadero St", phone: "(415) 552-6881" },
      { name: "Jules", address: "237 Fillmore St", phone: "(415) 839-9642", url: "https://www.julespizza.co" },
    ],
    bars: [
      { name: "Toronado", address: "547 Haight St", phone: "(415) 863-2276", url: "https://www.toronado.com" },
      { name: "Noc Noc", address: "557 Haight St", phone: "(415) 861-5811" },
      { name: "Molotov's", address: "582 Haight St", phone: "(415) 558-8019" },
    ],
    hospital: {
      name: "CPMC Davies Campus",
      address: "601 Duboce Ave",
      dist: "about 1 mi",
      phone: "(415) 600-6000",
      url: "https://www.sutterhealth.org/cpmc",
    },
    transit:
      "Muni 6, 7, and 22 Fillmore serve the area, with the N Judah Metro a few blocks south at Duboce.",
  },

  "Monterey Heights": {
    spirit:
      "A hushed 1920s residence park of grand period-revival homes curving up Mount Davidson's wooded slopes, where mature trees, hilltop views, and quiet prevail.",
    reasons: [
      "1920s residence-park elegance",
      "Grand period-revival homes",
      "Mount Davidson views",
      "Quiet, leafy, residential",
    ],
    history:
      "Monterey Heights was laid out in the 1920s by the Baldwin & Howell real-estate firm as one of San Francisco's planned residence parks on the slopes near Mount Davidson, west of Glen Park and beside St. Francis Wood and Westwood Highlands. The developers platted gently curving, tree-lined streets and filled them with large single-family period-revival homes — Spanish, Mediterranean, and Tudor styles. Purely residential by design, it remains an affluent, view-rich enclave a century later.",
    facts: [
      {
        icon: "house",
        title: "A planned residence park",
        text:
          "Developed in the 1920s by Baldwin & Howell as a single-family residence park with large period-revival homes and no commercial lots.",
      },
      {
        icon: "star",
        title: "Mount Davidson next door",
        text:
          "At 938 feet, adjacent Mount Davidson is the highest natural point in San Francisco, crowned by a 103-foot concrete cross.",
      },
      {
        icon: "road",
        title: "Curving by design",
        text:
          "Streets were deliberately laid out to curve with the hillside contours, giving the neighborhood its leafy, parklike feel.",
      },
      {
        icon: "park",
        title: "Trees and trails",
        text:
          "Mature street trees and the eucalyptus groves of Mount Davidson Park, planted in Adolph Sutro's era, frame the slopes.",
      },
      {
        icon: "tram",
        title: "West Portal nearby",
        text:
          "The closest shops, restaurants, and Muni Metro station sit a short distance away along West Portal Avenue.",
      },
    ],
    nearby: ["West Portal"],
    restaurants: [
      { name: "Trattoria da Vittorio", address: "150 W Portal Ave", phone: "(415) 742-0300", url: "https://www.trattoriadavittorio.com" },
      { name: "Bursa", address: "60 W Portal Ave", phone: "(415) 564-4006", url: "https://bursasf.com" },
      { name: "Elena's Mexican Restaurant", address: "255 W Portal Ave", phone: "(415) 622-4440", url: "https://www.elenasmexican.com" },
      { name: "Spiazzo Ristorante", address: "33 W Portal Ave", phone: "(415) 664-9511", url: "https://www.spiazzoristorante.com" },
    ],
    bars: [
      { name: "Philosopher's Club", address: "824 Ulloa St", phone: "(415) 753-0599" },
      { name: "Bullshead Restaurant", address: "840 Ulloa St", url: "https://www.bullsheadsf.com" },
    ],
    hospital: {
      name: "UCSF Medical Center at Parnassus",
      address: "505 Parnassus Ave",
      dist: "about 3 mi",
      phone: "(415) 476-1000",
      url: "https://www.ucsfhealth.org/locations/parnassus-campus",
    },
    transit:
      "West Portal Station (K Ingleside, L Taraval, M Ocean View) is the nearest Metro; the 36 Teresita and 48 buses wind through the hills.",
  },

  Panhandle: {
    spirit:
      "A leafy half-mile green arm reaching east from Golden Gate Park, flanked by grand painted Victorians and a buzzing Divisadero dining strip locals call NoPa.",
    reasons: [
      "Half-mile green park strip",
      "Grand Victorian rowhouses",
      "Buzzing Divisadero dining",
      "Bike & jog path",
    ],
    aka: "NoPa",
    history:
      "The Panhandle was laid out in the 1870s as the original eastern entrance to Golden Gate Park, shaped under engineer William Hammond Hall as a tree-lined carriage approach. Its elegant Victorians survived the 1906 earthquake, and the strip became a refugee campground for thousands left homeless. The blocks north of the park stayed quietly residential for decades until the restaurant Nopa opened in 2006, sparking a dining revival and christening the NoPa neighborhood.",
    facts: [
      {
        icon: "park",
        title: "The park's original arm",
        text:
          "The one-block-wide, three-quarter-mile strip was designed in the 1870s as Golden Gate Park's eastern entrance — a green spine still lined with mature trees.",
      },
      {
        icon: "quake",
        title: "1906 refuge",
        text:
          "After the earthquake and fires, thousands of displaced San Franciscans camped along the Panhandle's lawns in tents and shacks.",
      },
      {
        icon: "house",
        title: "Grand Victorians",
        text:
          "Stately Victorian and Edwardian rowhouses line the surrounding streets, many spared by the 1906 disaster.",
      },
      {
        icon: "road",
        title: "Bike & jog path",
        text:
          "A paved multi-use path runs the length of the green strip — a key cross-town commuter and recreation route.",
      },
      {
        icon: "star",
        title: "NoPa was born here",
        text:
          "The restaurant Nopa opened in 2006 and gave the North-of-Panhandle area its now-ubiquitous nickname.",
      },
    ],
    restaurants: [
      { name: "Nopa", address: "560 Divisadero St", phone: "(415) 864-8643", url: "https://www.nopasf.com" },
      { name: "Bar Crudo", address: "655 Divisadero St", phone: "(415) 409-0679", url: "https://www.barcrudo.com" },
      { name: "Brenda's Meat & Three", address: "919 Divisadero St", phone: "(415) 926-8657", url: "https://brendasmeatandthree.com" },
      { name: "The Mill", address: "736 Divisadero St", phone: "(415) 345-1953", url: "https://www.themillsf.com" },
    ],
    bars: [
      { name: "Madrone Art Bar", address: "500 Divisadero St", phone: "(415) 241-0202", url: "https://madroneartbar.com" },
      { name: "The Page", address: "298 Divisadero St", phone: "(415) 255-6101" },
    ],
    hospital: {
      name: "CPMC Davies Campus",
      address: "601 Duboce Ave",
      dist: "about 1.5 mi",
      phone: "(415) 600-6000",
      url: "https://www.sutterhealth.org/cpmc",
    },
    transit:
      "Muni 5 Fulton, 7 Haight, and 21 Hayes run along the green strip; the 24 Divisadero and 43 Masonic cross it north–south.",
  },

  "West Portal": {
    spirit:
      "A village within the city: streetcars surface from the tunnel onto a walkable main street of family-owned trattorias, old-school pubs, and stroller-friendly sidewalks.",
    reasons: [
      "Walkable main-street shops",
      "Streetcars from the tunnel",
      "Family-friendly village feel",
      "Beloved Italian restaurants",
    ],
    history:
      "West Portal takes its name from the western mouth of the Twin Peaks Tunnel, which opened in February 1918 and finally let Muni streetcars reach the area. Trains emerging from the portal turned a stretch of sand-dune outskirts into a thriving streetcar suburb, and West Portal Avenue grew into its commercial spine. Today the avenue keeps its small-town, family-friendly character beside St. Francis Wood and Forest Hill.",
    facts: [
      {
        icon: "tram",
        title: "Out of the tunnel",
        text:
          "The neighborhood is named for the west portal of the Twin Peaks Tunnel, where Muni streetcars emerge into daylight at the foot of the avenue.",
      },
      {
        icon: "subway",
        title: "Opened 1918",
        text:
          "The Twin Peaks Tunnel opened in February 1918, connecting the area to downtown and sparking its build-out as a streetcar suburb.",
      },
      {
        icon: "shopping",
        title: "The avenue",
        text:
          "West Portal Avenue is the commercial spine — a low-rise strip of locally owned shops, cafés, and restaurants.",
      },
      {
        icon: "stroller",
        title: "Village by design",
        text:
          "Walkable and quiet, West Portal is known as one of the city's most family-friendly, village-like neighborhoods.",
      },
      {
        icon: "movie",
        title: "The old Empire",
        text:
          "The 1925 Portal Theatre, later the CineArts Empire, lit up the avenue for decades before closing in 2021.",
      },
    ],
    restaurants: [
      { name: "Trattoria da Vittorio", address: "150 W Portal Ave", phone: "(415) 742-0300", url: "https://www.trattoriadavittorio.com" },
      { name: "Little Original Joe's", address: "393 W Portal Ave", phone: "(415) 759-1155", url: "https://www.littleoriginaljoes.com" },
      { name: "Mozzarella di Bufala", address: "69 W Portal Ave", phone: "(415) 661-8900", url: "https://dibufala.com" },
      { name: "Elena's Mexican Restaurant", address: "255 W Portal Ave", phone: "(415) 622-4440", url: "https://www.elenasmexican.com" },
    ],
    bars: [
      { name: "The Dubliner", address: "328 W Portal Ave", phone: "(415) 566-9444", url: "https://dublinerwp.com" },
      { name: "Philosopher's Club", address: "824 Ulloa St", phone: "(415) 753-0599" },
      { name: "Bullshead Restaurant", address: "840 Ulloa St", url: "https://www.bullsheadsf.com" },
    ],
    hospital: {
      name: "UCSF Medical Center at Parnassus",
      address: "505 Parnassus Ave",
      dist: "about 2 mi",
      phone: "(415) 476-1000",
      url: "https://www.ucsfhealth.org/locations/parnassus-campus",
    },
    transit:
      "West Portal Station is the hub — the K Ingleside, L Taraval, and M Ocean View lines run through the Twin Peaks Tunnel to downtown; the 48 bus crosses the south of the city.",
  },

  "Balboa Terrace": {
    spirit:
      "A hushed crescent of 1920s period-revival homes behind brick gateposts, where curving streets and mature gardens make this tiny residence park feel quietly grand.",
    reasons: [
      "Storybook 1920s residence park",
      "Brick entry gateposts",
      "Curving, leafy streets",
      "Affluent & residential",
    ],
    history:
      "Balboa Terrace was laid out in the early 1920s as one of San Francisco's planned \"residence parks\" west of Twin Peaks, in the Mason-McDuffie / Baldwin & Howell era of bespoke garden suburbs. Architects gave the enclave a cohesive look of Mediterranean, Tudor, and Spanish Colonial Revival homes on winding streets. Distinctive brick gateposts mark the entrances, and planted medians and mature landscaping reinforce the park-like feel that still defines the neighborhood a century later.",
    facts: [
      {
        icon: "road",
        title: "Planned residence park",
        text:
          "One of a cluster of 1920s residence parks west of Twin Peaks, designed as a unified garden suburb rather than a standard grid.",
      },
      {
        icon: "house",
        title: "Period-revival cohesion",
        text:
          "Single-family homes in coordinated Mediterranean, Tudor, and Spanish Colonial Revival styles give the small enclave unusual architectural unity.",
      },
      {
        icon: "park",
        title: "Gateposts and medians",
        text:
          "Brick entry gateposts and planted street medians signal the neighborhood's boundaries and lend it a private, park-like character.",
      },
      {
        icon: "money",
        title: "Quietly affluent",
        text:
          "A small, well-kept district of owner-occupied homes, consistently among the city's pricier and most stable residential pockets.",
      },
      {
        icon: "tram",
        title: "Streetcar-era suburb",
        text:
          "Developed alongside the Twin Peaks Tunnel and West Portal streetcar lines that opened the western neighborhoods to commuters.",
      },
    ],
    nearby: ["West Portal", "Ocean Avenue"],
    restaurants: [
      { name: "Elena's Mexican Restaurant", address: "255 W Portal Ave", phone: "(415) 622-4440", url: "https://www.elenasmexican.com" },
      { name: "Bursa", address: "60 W Portal Ave", phone: "(415) 564-4006", url: "https://bursasf.com" },
      { name: "Beep's Burgers", address: "1051 Ocean Ave", phone: "(415) 584-2650", url: "https://www.beepsburgers.com" },
    ],
    bars: [
      { name: "Binu Bonu", address: "230 W Portal Ave", phone: "(415) 742-4322", url: "https://www.binubonu.com" },
      { name: "Philosopher's Club", address: "824 Ulloa St", phone: "(415) 753-0599" },
      { name: "Ocean Ale House", address: "1314 Ocean Ave", phone: "(415) 988-7521", url: "https://oceanalehouse.com" },
    ],
    hospital: {
      name: "UCSF Medical Center at Parnassus",
      address: "505 Parnassus Ave",
      dist: "about 3.5 mi",
      phone: "(415) 476-1000",
      url: "https://www.ucsfhealth.org/locations/parnassus-campus",
    },
    transit:
      "The K Ingleside runs along Ocean Avenue at the southern edge, and West Portal Station is a short hop away; the 48 bus connects across the city's south side.",
  },

  "Inner Richmond": {
    spirit:
      "Foggy, food-obsessed and gloriously diverse: Edwardian flats above Clement Street's Burmese, Chinese, and Russian kitchens, with Golden Gate Park and the Presidio on its doorstep.",
    reasons: [
      "\"New Chinatown\" food scene",
      "Iconic Clement Street strip",
      "Diverse immigrant heritage",
      "Between park & Presidio",
    ],
    aka: "New Chinatown",
    history:
      "The Richmond rose from the windswept \"Outside Lands\" sand dunes the city annexed in the late 1800s. Local lore credits an Australian settler with naming the district for Richmond, Victoria. Streetcars opened the dunes to development, and successive waves of immigrants gave it character: a large Russian community fleeing revolution, then Chinese, Burmese, and other Asian families whose markets and restaurants made Clement Street the bustling corridor known today as the \"New Chinatown.\"",
    facts: [
      {
        icon: "shop",
        title: "New Chinatown",
        text:
          "Clement Street and Geary Boulevard pack in Chinese, Burmese, Russian, and pan-Asian restaurants and markets, earning the area its \"New Chinatown\" nickname.",
      },
      {
        icon: "church",
        title: "Gold-domed landmark",
        text:
          "Holy Virgin Cathedral (\"Joy of All Who Sorrow\"), the gold-domed Russian Orthodox cathedral on Geary, was completed in 1965 and holds the relics of St. John of Shanghai and San Francisco.",
      },
      {
        icon: "book",
        title: "Green Apple Books",
        text:
          "Open on Clement Street since 1967, Green Apple is one of the city's most beloved independent bookstores, famous for its creaky floors and labyrinth of new and used titles.",
      },
      {
        icon: "sun",
        title: "Fog factory",
        text:
          "Wedged between the Pacific and downtown, the Inner Richmond catches the marine layer that rolls through the Golden Gate, keeping summer days cool and gray.",
      },
      {
        icon: "park",
        title: "Green on both sides",
        text:
          "The neighborhood is framed by Golden Gate Park to the south and the Presidio to the north, putting thousands of acres of trails and trees within a short walk.",
      },
    ],
    restaurants: [
      { name: "Burma Superstar", address: "309 Clement St", phone: "(415) 387-2147", url: "https://www.burmasuperstar.com" },
      { name: "B Star", address: "127 Clement St", phone: "(415) 933-9900", url: "https://www.bstarbar.com" },
      { name: "Good Luck Dim Sum", address: "736 Clement St", phone: "(415) 386-3388" },
    ],
    bars: [
      { name: "The Plough and the Stars", address: "116 Clement St", phone: "(415) 751-1122", url: "https://theploughandstars.com" },
      { name: "540 Club", address: "540 Clement St", phone: "(415) 752-7276" },
      { name: "Trad'r Sam", address: "6150 Geary Blvd", phone: "(415) 221-0773" },
    ],
    hospital: {
      name: "UCSF Medical Center at Parnassus",
      address: "505 Parnassus Ave",
      dist: "about 1.5 mi",
      phone: "(415) 476-1000",
      url: "https://www.ucsfhealth.org/locations/parnassus-campus",
    },
    transit:
      "Muni 1 California, 2 Clement, and the 38 Geary / 38R Geary Rapid carry the Richmond to downtown; the 44 O'Shaughnessy links to Golden Gate Park.",
  },

  "Mission Dolores": {
    spirit:
      "Sunny, palm-dotted heart of the city where San Francisco was born — anchored by its 1776 adobe mission and the picnic-blanket sprawl of Dolores Park.",
    reasons: [
      "Sunniest microclimate in SF",
      "City's oldest standing building",
      "Dolores Park people-watching",
      "Victorian flats & bakeries",
    ],
    history:
      "Mission San Francisco de Asís was founded in 1776 and nicknamed Mission Dolores for the nearby Laguna de los Dolores. Its adobe chapel, completed in 1791, is the oldest intact building in San Francisco and survived the 1906 quake; the grand Mission Dolores Basilica beside it dates to 1918. The surrounding neighborhood of Victorian and Edwardian flats grew up around the church, and today Mission Dolores Park draws sun-seekers to its sloping lawns and skyline views.",
    facts: [
      {
        icon: "church",
        title: "Oldest building in SF",
        text:
          "The Mission Dolores adobe chapel, completed in 1791, is the oldest intact structure in San Francisco and came through the 1906 earthquake undamaged.",
      },
      {
        icon: "flag",
        title: "Founded 1776",
        text:
          "Mission San Francisco de Asís was founded in 1776, the sixth of California's 21 Spanish missions and the namesake of the entire Mission District.",
      },
      {
        icon: "park",
        title: "Dolores Park",
        text:
          "Mission Dolores Park opened in 1905 on former cemetery land and served as a refugee camp after the 1906 quake; today its lawns are the city's favorite sunny gathering spot.",
      },
      {
        icon: "sun",
        title: "Sunny microclimate",
        text:
          "Sheltered from the coastal fog that blankets the western neighborhoods, Mission Dolores enjoys some of the warmest, sunniest weather in the city.",
      },
      {
        icon: "house",
        title: "Victorian flats",
        text:
          "The streets around Dolores and Church are lined with ornate Victorian and Edwardian flats, many predating the 1906 earthquake.",
      },
    ],
    restaurants: [
      { name: "Tartine Bakery", address: "600 Guerrero St", phone: "(415) 487-2600", url: "https://tartinebakery.com" },
      { name: "Delfina", address: "3621 18th St", phone: "(415) 552-4055", url: "https://www.delfinasf.com" },
      { name: "Pizzeria Delfina", address: "3611 18th St", url: "https://www.pizzeriadelfina.com" },
      { name: "Foreign Cinema", address: "2534 Mission St", phone: "(415) 648-7600", url: "https://foreigncinema.com" },
      { name: "Bi-Rite Creamery", address: "3692 18th St", phone: "(415) 626-5600", url: "https://biritemarket.com" },
    ],
    bars: [
      { name: "Zeitgeist", address: "199 Valencia St", phone: "(415) 255-7505", url: "https://www.zeitgeistsf.com" },
      { name: "El Rio", address: "3158 Mission St", phone: "(415) 282-3325", url: "https://www.elriosf.com" },
      { name: "Blackbird", address: "2124 Market St", phone: "(415) 872-5310", url: "https://www.blackbirdbar.com" },
      { name: "Beauty Bar", address: "2299 Mission St", phone: "(415) 769-0117", url: "https://www.beautybarsf.com" },
    ],
    hospital: {
      name: "CPMC Davies Campus",
      address: "601 Duboce Ave",
      dist: "about 0.7 mi",
      phone: "(415) 600-6000",
      url: "https://www.sutterhealth.org/cpmc",
    },
    transit:
      "The J Church Muni Metro runs up Church St past Dolores Park; the 22 Fillmore and 33 cross through, and the 16th St BART/Muni station is a few blocks east.",
  },

  "Laguna Honda": {
    spirit:
      "Tucked into the wooded hills above the city's deepest lagoon, where fog drifts through eucalyptus and the only traffic is the Muni gliding into the tunnel.",
    reasons: [
      "Wooded hillside calm",
      "Reservoir & open space",
      "Forest Hill Station close",
      "Pure single-family quiet",
    ],
    history:
      "Named for Laguna Honda, Spanish for \"deep lagoon\" — a natural lake along the old wagon road over the hills, later tapped as a city reservoir. Laguna Honda Hospital opened nearby in the 1860s as the city's almshouse, growing into one of the largest public skilled-nursing facilities in the United States. The surrounding slopes filled in through the early-to-mid 20th century with single-family homes, climbing the grades between Forest Hill, Midtown Terrace, and Twin Peaks.",
    facts: [
      {
        icon: "water",
        title: "A real deep lagoon",
        text:
          "Laguna Honda is one of San Francisco's few natural lakes, fed by hillside springs and later pressed into service as a city reservoir.",
      },
      {
        icon: "house",
        title: "Pure residential",
        text:
          "There's no commercial strip here — just curving streets of single-family homes set into the wooded grades.",
      },
      {
        icon: "bird",
        title: "Wild green edges",
        text:
          "Mount Sutro's cloud forest and the Twin Peaks open space wrap the neighborhood in eucalyptus, coyote brush, and birdsong.",
      },
      {
        icon: "tram",
        title: "Through the tunnel",
        text:
          "Forest Hill Station feeds the K, L, and M lines straight into the Twin Peaks Tunnel and downtown, minutes away.",
      },
      {
        icon: "star",
        title: "A landmark institution",
        text:
          "Laguna Honda Hospital, dating to the 1860s, is among the largest skilled-nursing and rehabilitation facilities in the country.",
      },
    ],
    nearby: ["West Portal", "the Inner Sunset"],
    restaurants: [
      { name: "Elena's Mexican Restaurant", address: "255 W Portal Ave" },
      { name: "Trattoria da Vittorio", address: "150 W Portal Ave" },
      { name: "Fiorella Sunset", address: "1240 9th Ave" },
      { name: "Art's Cafe", address: "747 Irving St" },
      { name: "Arizmendi Bakery", address: "1331 9th Ave" },
    ],
    bars: [
      { name: "Philosopher's Club", address: "824 Ulloa St" },
      { name: "The Little Shamrock", address: "807 Lincoln Way" },
      { name: "Yancy's Saloon", address: "734 Irving St" },
    ],
    hospital: {
      name: "UCSF Medical Center at Parnassus",
      address: "505 Parnassus Ave",
      dist: "about 1.5 mi",
      phone: "(415) 476-1000",
      url: "https://www.ucsfhealth.org/locations/parnassus-campus",
    },
    transit:
      "Forest Hill Station (K, L, M) sits at the neighborhood's edge, feeding the Twin Peaks Tunnel to downtown; the 36 Teresita, 43, 44, and 52 buses wind the hills.",
  },

  "Upper Market": {
    spirit:
      "A transit-humming sliver of upper Market where rainbow-flag history, Victorian flats, and glassy new condos share one streetcar-rattled spine.",
    reasons: [
      "Castro Muni Metro hub",
      "Vintage F-line streetcars",
      "Walkable restaurant row",
      "Bridges Castro & Duboce",
    ],
    history:
      "Upper Market Street grew up as a transit spine, carrying cable cars and then electric streetcars up from downtown toward Eureka Valley. The 1980 opening of the Castro Street Muni Metro station cemented it as a transfer hub, while the historic F-line streetcars still rumble past. In recent decades the corridor between the Castro and Church Street filled in with mixed-use development, new condos rising beside Victorian flats and linking the Castro, Duboce Triangle, and Mission Dolores into one walkable, transit-rich strip.",
    facts: [
      {
        icon: "subway",
        title: "Castro Station hub",
        text:
          "Castro Muni Metro station opened in 1980, putting the K, L, M, S, and F lines underfoot at Market and Castro.",
      },
      {
        icon: "tram",
        title: "Historic streetcars",
        text:
          "The F-line runs restored vintage streetcars from cities around the world up Market Street past the corridor.",
      },
      {
        icon: "flag",
        title: "Castro at the west end",
        text:
          "The corridor's western edge opens into the historic LGBTQ Castro and Harvey Milk Plaza.",
      },
      {
        icon: "house",
        title: "New flats meet old",
        text:
          "Recent mixed-use buildings rose alongside classic Victorian flats, reshaping the upper Market streetscape.",
      },
      {
        icon: "shopping",
        title: "Walkable strip",
        text:
          "Restaurants, bars, and shops line the corridor, stitching the Castro to Duboce Triangle and Mission Dolores.",
      },
    ],
    restaurants: [
      { name: "Catch French Bistro", address: "2362 Market St", phone: "(415) 431-5000", url: "https://catchfrenchbistro.com" },
      { name: "La Méditerranée", address: "288 Noe St", phone: "(415) 431-7210", url: "https://lamednoe.com" },
      { name: "Mama Ji's", address: "4416 18th St", phone: "(415) 626-4416" },
      { name: "Poesia Osteria Italiana", address: "4072 18th St", phone: "(415) 252-9325", url: "https://poesiasf.com" },
    ],
    bars: [
      { name: "Blackbird", address: "2124 Market St", url: "https://www.blackbirdbar.com" },
      { name: "Hi Tops", address: "2247 Market St", phone: "(415) 551-2500", url: "https://hitopsbar.com" },
      { name: "The Cafe", address: "2369 Market St", phone: "(415) 779-3171", url: "https://cafesf.com" },
      { name: "Lookout", address: "3600 16th St" },
    ],
    hospital: {
      name: "CPMC Davies Campus",
      address: "601 Duboce Ave",
      dist: "about 0.5 mi",
      phone: "(415) 600-6000",
      url: "https://www.sutterhealth.org/cpmc",
    },
    transit:
      "Castro Station puts the F, K, L, M, and S lines underfoot; the J Church runs nearby, with the 24 Divisadero and 37 buses crossing the corridor.",
  },

  "Forest Hill": {
    spirit:
      "A hushed, leafy enclave of architect-designed homes on winding wooded streets, where the city feels a world away just above the Twin Peaks Tunnel.",
    reasons: [
      "Architect-designed homes",
      "Winding wooded streets",
      "Maybeck clubhouse",
      "Historic Muni station",
    ],
    history:
      "Forest Hill was laid out from 1912–1913 by the Newell-Murdoch Company as one of San Francisco's first planned residence parks. Engineers carved curving, tree-lined streets into the slopes below Mount Sutro and filled them with large architect-designed homes in Tudor, Spanish, and Mediterranean styles. The neighborhood's social heart is the Forest Hill Clubhouse, designed by Bernard Maybeck in 1919 and now a city landmark. Purely residential, it remains one of the city's most serene addresses.",
    facts: [
      {
        icon: "house",
        title: "Architect-designed homes",
        text:
          "Built as a residence park, Forest Hill is full of large custom homes in Tudor, Spanish, and Mediterranean revival styles set on winding wooded streets.",
      },
      {
        icon: "star",
        title: "A Maybeck masterpiece",
        text:
          "The Forest Hill Clubhouse was designed by legendary Bay Area architect Bernard Maybeck in 1919 and is a designated San Francisco landmark.",
      },
      {
        icon: "subway",
        title: "One of America's oldest subway stops",
        text:
          "Forest Hill Station opened in 1918 as Laguna Honda Station, among the first municipal underground rail stations built in the United States.",
      },
      {
        icon: "road",
        title: "A planned residence park",
        text:
          "Developed from 1912–1913 by the Newell-Murdoch Company, its curving streets and stone gateways were designed to follow the natural hillside.",
      },
      {
        icon: "park",
        title: "Under Mount Sutro",
        text:
          "Tucked below the forested slopes of Mount Sutro and near Laguna Honda, the area stays leafy, quiet, and almost entirely residential.",
      },
    ],
    nearby: ["West Portal"],
    restaurants: [
      { name: "Elena's Mexican Restaurant", address: "255 W Portal Ave", phone: "(415) 622-4440", url: "https://www.elenasmexican.com" },
      { name: "Trattoria da Vittorio", address: "150 W Portal Ave", phone: "(415) 742-0300", url: "https://www.trattoriadavittorio.com" },
      { name: "Little Original Joe's", address: "393 W Portal Ave", phone: "(415) 759-1155", url: "https://www.littleoriginaljoes.com" },
      { name: "Khao Tiew", address: "272 Claremont Blvd", phone: "(415) 996-1919" },
    ],
    bars: [
      { name: "The Dubliner", address: "328 W Portal Ave", phone: "(415) 566-9444", url: "https://dublinerwp.com" },
      { name: "Philosopher's Club", address: "824 Ulloa St", phone: "(415) 753-0599" },
    ],
    hospital: {
      name: "UCSF Medical Center at Parnassus",
      address: "505 Parnassus Ave",
      dist: "about 1.5 mi",
      phone: "(415) 476-1000",
      url: "https://www.ucsfhealth.org/locations/parnassus-campus",
    },
    transit:
      "Forest Hill Station (K, L, M) runs through the Twin Peaks Tunnel to downtown; the 36 Teresita and 44 O'Shaughnessy buses serve the surrounding hills.",
  },

  "Diamond Heights": {
    spirit:
      "Hilltop calm with knockout views — a planned mid-century enclave wrapped in open space, where curving streets and modern homes look out over the whole city.",
    reasons: [
      "Sweeping skyline views",
      "Glen Canyon Park next door",
      "Mid-century modern homes",
      "Quiet, planned streets",
    ],
    aka: "Red Rock Hill",
    history:
      "One of San Francisco's redevelopment-era projects. The steep, rocky \"Red Rock\" hills above Glen Canyon sat largely undeveloped for decades, too rugged to build on cheaply. In the late 1950s and 1960s the SF Redevelopment Agency carved curving streets into the slopes and built Diamond Heights as a planned mid-century community of homes, condos, and townhouses, anchored by a new shopping center. It takes its name from nearby Diamond Street below.",
    facts: [
      {
        icon: "road",
        title: "A planned community",
        text:
          "Diamond Heights was master-planned by the SF Redevelopment Agency in the late 1950s–60s — one of the few city neighborhoods designed largely from scratch, with curving streets that follow the hillside contours.",
      },
      {
        icon: "star",
        title: "Views in every direction",
        text:
          "Built high on the slopes near Twin Peaks, homes here capture sweeping panoramas of downtown, the bay, and the surrounding hills.",
      },
      {
        icon: "park",
        title: "Glen Canyon Park",
        text:
          "On the western edge, this rugged park preserves Islais Creek, dramatic rock outcrops, and trails through one of the city's last natural canyons.",
      },
      {
        icon: "house",
        title: "Mid-century by design",
        text:
          "The housing stock skews modern — 1960s-era homes, townhouses, and condos reflecting the redevelopment era rather than the Victorians common elsewhere in SF.",
      },
      {
        icon: "bird",
        title: "Wildlife in the canyon",
        text:
          "Glen Canyon's wild slopes draw red-tailed hawks, great horned owls, and coyotes — a pocket of nature minutes from the shopping center.",
      },
    ],
    nearby: ["Glen Park", "Noe Valley"],
    restaurants: [
      { name: "Fiorella Noe", address: "4042 24th St" },
      { name: "Novy", address: "4000 24th St", url: "https://www.novysf.com" },
      { name: "Fresca", address: "3945 24th St", url: "https://www.frescasf.com" },
      { name: "Noe Indian Cuisine", address: "4116 24th St", url: "https://www.noeindiancuisine.com" },
    ],
    bars: [
      { name: "Glen Park Station", address: "2816 Diamond St" },
      { name: "The Valley Tavern", address: "4054 24th St", url: "https://www.valleytavern.com" },
    ],
    hospital: {
      name: "CPMC Mission Bernal Campus",
      address: "3555 Cesar Chavez St",
      dist: "about 2 mi",
      phone: "(415) 600-6000",
      url: "https://www.sutterhealth.org/cpmc",
    },
    transit:
      "Muni 35 Eureka, 36 Teresita, and 52 Excelsior serve the hilltop; Glen Park BART/Muni station is a short ride downhill.",
  },

  "Ingleside Terraces": {
    spirit:
      "A foggy 1910s residence park built on a vanished racetrack, where curving streets and a giant marble sundial keep time over blocks of stately homes.",
    reasons: [
      "Giant outdoor Sundial",
      "Oval racetrack street",
      "1910s residence park",
      "Pure residential calm",
    ],
    history:
      "Built around 1910–1911 by Joseph A. Leonard's Urban Realty Improvement Company on the site of the former Ingleside Racetrack (1895–1905), once the last horse-racing venue in San Francisco. Leonard reimagined the land as a planned residence park of single-family homes with curving, landscaped streets. The oval Urbano Drive traces the exact loop of the old track, and a massive sundial, dedicated in 1913 as a marketing stunt, became the neighborhood's lasting landmark.",
    facts: [
      {
        icon: "sun",
        title: "One of the world's largest sundials",
        text:
          "The Ingleside Terraces Sundial, dedicated October 10, 1913, stands about 28 feet tall in marble and concrete on Entrada Court. Promoted as the largest in the world at the time, some 1,500 people attended its unveiling.",
      },
      {
        icon: "road",
        title: "Streets shaped like a racetrack",
        text:
          "The oval Urbano Drive is laid out exactly along the loop of the old Ingleside Racetrack, so residents today live around the curve of a vanished horse-racing course.",
      },
      {
        icon: "star",
        title: "A planned residence park",
        text:
          "Laid out as a self-contained residence park, the neighborhood was given curving streets, generous lots, gates, and entry monuments to attract upper-income buyers in the early 1910s.",
      },
      {
        icon: "house",
        title: "Purely residential",
        text:
          "There are no shops or restaurants inside Ingleside Terraces itself — it is almost entirely single-family homes; daily errands happen a few blocks north on Ocean Avenue.",
      },
      {
        icon: "tram",
        title: "The tunnel sealed the deal",
        text:
          "The development was timed to benefit from the Twin Peaks Tunnel streetcar line, which promised fast, clean transit to downtown for buyers settling these outer blocks.",
      },
    ],
    nearby: ["Ocean Avenue"],
    restaurants: [
      { name: "Beep's Burgers", address: "1051 Ocean Ave", phone: "(415) 584-2650" },
      { name: "Sakesan Sushi & Robata", address: "1400 Ocean Ave", phone: "(415) 347-7898" },
      { name: "Pakwan Restaurant", address: "1140 Ocean Ave", phone: "(415) 841-8400" },
    ],
    bars: [
      { name: "Ocean Ale House", address: "1314 Ocean Ave", phone: "(415) 988-7521", url: "https://oceanalehouse.com" },
    ],
    hospital: {
      name: "UCSF Medical Center at Parnassus",
      address: "505 Parnassus Ave",
      dist: "about 4 mi",
      phone: "(415) 476-1000",
      url: "https://www.ucsfhealth.org/locations/parnassus-campus",
    },
    transit:
      "The K Ingleside runs along Ocean Avenue at the northern edge; the 49 and 29 buses connect nearby, and Balboa Park BART is a short hop east.",
  },

  "Clarendon Heights": {
    spirit:
      "A hushed hilltop of big homes and bigger views, tucked right under the red-and-white legs of Sutro Tower.",
    reasons: [
      "Sweeping bay-to-ocean views",
      "Steps from Mount Sutro forest",
      "Right below Sutro Tower",
      "Quiet, leafy, residential",
    ],
    history:
      "Clarendon Heights took shape as a mid-20th-century residential area climbing the north slopes below Mount Sutro and Twin Peaks, named for Clarendon Avenue, which threads up the hill. Single-family homes filled the steep lots through the 1940s and 1950s. The 977-foot Sutro Tower, completed in 1973, rose directly above the enclave, and the wooded Interior Greenbelt and Mount Sutro forest at its back have long defined its quiet, view-rich character.",
    facts: [
      {
        icon: "tower",
        title: "Sutro Tower looms overhead",
        text:
          "The 977-foot red-and-white TV and radio tower, completed in 1973, sits directly above the neighborhood and is visible across much of the city.",
      },
      {
        icon: "star",
        title: "Views in every direction",
        text:
          "Hillside homes here capture sweeping panoramas, from the bay and downtown to the Pacific and the western avenues.",
      },
      {
        icon: "bird",
        title: "Backed by a hidden forest",
        text:
          "The Interior Greenbelt and the eucalyptus woods of Mount Sutro climb right behind the homes, with trails just steps away.",
      },
      {
        icon: "house",
        title: "Purely residential enclave",
        text:
          "There are no shops or restaurants within Clarendon Heights itself — it's a small, affluent pocket of large single-family homes.",
      },
      {
        icon: "road",
        title: "Named for Clarendon Avenue",
        text:
          "The neighborhood takes its name from the winding avenue that climbs the hill, connecting it toward Twin Peaks and Laguna Honda.",
      },
    ],
    nearby: ["Cole Valley", "the Haight"],
    restaurants: [
      { name: "Zazie", address: "941 Cole St", phone: "(415) 564-5332", url: "https://www.zaziesf.com" },
      { name: "Beit Rima", address: "86 Carl St", phone: "(415) 566-1274", url: "https://beitrimasf.com" },
      { name: "InoVino", address: "108B Carl St", phone: "(415) 681-3770", url: "https://inovinosanfrancisco.com" },
    ],
    bars: [
      { name: "Cole Valley Tavern", address: "900 Cole St", phone: "(415) 681-7678", url: "https://www.colevalleytavern.com" },
      { name: "Toronado", address: "547 Haight St", phone: "(415) 863-2276", url: "https://www.toronado.com" },
      { name: "Aub Zam Zam", address: "1633 Haight St", phone: "(415) 861-2545" },
    ],
    hospital: {
      name: "UCSF Medical Center at Parnassus",
      address: "505 Parnassus Ave",
      dist: "about 1 mi",
      phone: "(415) 476-1000",
      url: "https://www.ucsfhealth.org/locations/parnassus-campus",
    },
    transit:
      "The 37 Corbett climbs through the neighborhood; the 33 and 43 run nearby, and Forest Hill Station is a short ride away.",
  },

  "Chinatown": {
    spirit:
      "The oldest Chinatown in North America — a dense, lantern-strung hillside of temples, dim sum parlors and dragon-topped alleys where over a century of Chinese-American life still hums.",
    reasons: ["Oldest Chinatown in North America", "Incredibly walkable", "Transit-rich", "World-class dim sum"],
    history:
      "Chinatown grew up around Portsmouth Square and old Dupont Street (now Grant Avenue) after the 1848 Gold Rush, when San Francisco became the port of entry for Chinese miners and merchants bound for “Gold Mountain.” Grant Avenue is the city’s oldest street, and the quarter became the cultural anchor for Chinese immigrants across North America. Leveled by the 1906 earthquake and fire, the community rebuilt on the same blocks in a deliberately ornate style to draw tourism and resist relocation. Today its roughly 30 blocks remain one of the most densely populated neighborhoods in San Francisco.",
    facts: [
      { icon: "tower", title: "A gift from across the Pacific", text: "The Dragon Gate at Grant Ave and Bush St was built in 1970 as a gift from the Republic of China (Taiwan); its inscription reads “All under heaven is for the good of the people.”" },
      { icon: "church", title: "One of the oldest Taoist temples in the U.S.", text: "Tin How Temple on Waverly Place, dedicated to the sea goddess Mazu, traces its roots to the 1850s and still operates several flights up a narrow stairway." },
      { icon: "factory", title: "Fortune cookies folded by hand", text: "The Golden Gate Fortune Cookie Factory has hand-folded cookies in tiny Ross Alley since 1962 — you can watch them come off the press." },
      { icon: "quake", title: "Rebuilt after 1906", text: "After the earthquake and fire destroyed it, the community rebuilt Chinatown on its original site with the flamboyant pagoda rooflines that define Grant Avenue today." },
    ],
    restaurants: [
      { name: "Mister Jiu's", address: "28 Waverly Pl", phone: "(415) 857-9688", url: "https://misterjius.com" },
      { name: "R&G Lounge", address: "631 Kearny St", phone: "(415) 982-7877", url: "https://www.rnglounge.com" },
      { name: "Z & Y Restaurant", address: "655 Jackson St", phone: "(415) 981-8988", url: "https://www.zandyrestaurant.com" },
      { name: "Great Eastern Restaurant", address: "649 Jackson St", phone: "(415) 986-2500", url: "https://www.greateasternsf.com" },
      { name: "Good Mong Kok Bakery", address: "1039 Stockton St", phone: "(415) 397-2688" },
    ],
    bars: [
      { name: "Li Po Cocktail Lounge", address: "916 Grant Ave", phone: "(415) 982-0072" },
      { name: "Comstock Saloon", address: "155 Columbus Ave", phone: "(415) 617-0071", url: "https://www.comstocksaloon.com" },
    ],
    hospital: { name: "Chinese Hospital", address: "845 Jackson St", dist: "in the neighborhood", phone: "(415) 982-2400", url: "https://chinesehospital-sf.org" },
    transit:
      "The Central Subway's Chinatown–Rose Pak Station (Stockton at Washington) serves Muni Metro's T Third line. The California Street cable car runs through the heart of the neighborhood, and the Powell-Mason and Powell-Hyde cable cars run along its western edge. Buses: 1, 8, 30, 45.",
  },

  "Financial District": {
    spirit:
      "San Francisco's glass-and-granite canyon — where Gold Rush fortunes built the West's oldest banking center and steel towers still catch the morning fog.",
    reasons: ["Walk to work downtown", "BART + Muni hub", "Historic dining institutions", "Steps from the waterfront"],
    aka: "Barbary Coast",
    history:
      "The Financial District grew out of the 1849 Gold Rush as San Francisco's first commercial center, rising on land that was once shoreline and buried ships near the old Long Wharf. Its northern edge overlaps the Barbary Coast, a notorious 19th-century district of saloons, dance halls and brothels named after the pirate-plagued coast of North Africa. As banks and trading houses replaced the vice trade, the area became one of the largest and oldest financial districts in the western United States. Montgomery Street, its main spine, earned the nickname 'the Wall Street of the West.'",
    facts: [
      { icon: "tower", title: "An 853-foot landmark", text: "The Transamerica Pyramid, completed in 1972, was the city's tallest building until Salesforce Tower surpassed it in 2018." },
      { icon: "park", title: "A redwood grove downtown", text: "Transamerica Redwood Park, planted in 1974, holds nearly 50 mature redwoods transplanted from the Santa Cruz area, now towering over 100 feet." },
      { icon: "road", title: "Pony Express headquarters", text: "601 Montgomery St was the western business headquarters of the company that ran the 1860–61 Pony Express; a historic marker still stands there." },
      { icon: "money", title: "Bank of America's old HQ", text: "555 California St, finished in 1969, was the tallest building west of the Mississippi until 1972 and served as Bank of America's world headquarters." },
      { icon: "money", title: "California's oldest restaurant", text: "Tadich Grill traces its roots to an 1849 coffee stand on Long Wharf, making it the oldest continuously run restaurant in the state." },
    ],
    restaurants: [
      { name: "Tadich Grill", address: "240 California St", phone: "(415) 391-1849", url: "https://tadichgrillsf.com" },
      { name: "Kokkari Estiatorio", address: "200 Jackson St", phone: "(415) 981-0983", url: "https://kokkari.com" },
      { name: "Wayfare Tavern", address: "201 Pine St", phone: "(415) 772-9060", url: "https://www.wayfaretavern.com" },
      { name: "Schroeder's", address: "240 Front St", phone: "(415) 421-4778", url: "https://www.schroederssf.com" },
    ],
    bars: [
      { name: "Comstock Saloon", address: "155 Columbus Ave", phone: "(415) 617-0071", url: "https://www.comstocksaloon.com" },
      { name: "Blue Bottle Coffee", address: "115 Sansome St", url: "https://bluebottlecoffee.com/cafes/sansome" },
    ],
    hospital: { name: "Chinese Hospital", address: "845 Jackson St", dist: "about 0.6 mi", phone: "(415) 982-2400", url: "https://chinesehospital-sf.org" },
    transit:
      "Montgomery St and Embarcadero stations both serve BART (Blue, Green, Red and Yellow lines) and Muni Metro (J, K, L, M, N and T lines) beneath Market St. The historic F-Market streetcar and the California Street cable car also run through the district.",
  },

  "Tenderloin": {
    spirit:
      "San Francisco's gritty, big-hearted downtown core — a dense grid of historic SRO hotels, Vietnamese kitchens and speakeasy cocktail dens, raw and real in equal measure.",
    reasons: ["Best cheap eats in SF", "Historic speakeasy bars", "Steps from BART & Muni", "Little Saigon"],
    aka: "The TL",
    history:
      "The 'Tenderloin' nickname is widely traced to a vice-era police culture in which officers working this lucrative beat could afford the finest cut of meat — the tenderloin — borrowing the name from a similar district in New York. After the 1906 earthquake the area filled with single-room-occupancy (SRO) hotels for transient workers, and by the 1920s it was the city's nightlife and speakeasy quarter. The fall of Saigon in 1975 brought waves of Vietnamese, Cambodian and Laotian refugees, who built the businesses that became 'Little Saigon' along Larkin Street. Today the Uptown Tenderloin Historic District protects the world's largest collection of historic SRO hotels.",
    facts: [
      { icon: "house", title: "World's largest SRO collection", text: "The Uptown Tenderloin Historic District, listed on the National Register in 2009, has over 400 contributing buildings and the world's largest concentration of historic single-room-occupancy hotels." },
      { icon: "burrito", title: "Little Saigon", text: "In 2004 the city designated the Larkin Street corridor between Eddy and O'Farrell as 'Little Saigon,' honoring the Vietnamese community rooted here since the 1970s." },
      { icon: "beer", title: "Prohibition-era speakeasy", text: "Bourbon & Branch at 501 Jones operated as a real speakeasy from 1921–1933, hidden behind a sign reading 'Anti-Saloon League.'" },
      { icon: "subway", title: "Transit-rich downtown", text: "Powell and Civic Center stations — both BART and Muni Metro — sit within a five-minute walk, plus the historic F-Market streetcar." },
    ],
    restaurants: [
      { name: "Saigon Sandwich", address: "560 Larkin St", phone: "(415) 474-5698" },
      { name: "Pho 2000", address: "637 Larkin St", phone: "(415) 474-1188" },
      { name: "Lers Ros Thai", address: "730 Larkin St", phone: "(415) 931-6917", url: "https://lersros.com" },
      { name: "Bodega SF", address: "138 Mason St", phone: "(415) 655-9341" },
    ],
    bars: [
      { name: "Bourbon & Branch", address: "501 Jones St", phone: "(415) 346-1735", url: "https://www.bourbonandbranch.com" },
      { name: "Aunt Charlie's Lounge", address: "133 Turk St", phone: "(415) 441-2922", url: "https://auntcharlieslounge.com" },
      { name: "Emperor Norton's BoozeLand", address: "510 Larkin St" },
      { name: "Ha-Ra Club", address: "875 Geary St", phone: "(415) 673-3148", url: "https://www.harasf.com" },
      { name: "Geary Club", address: "768 Geary St", phone: "(415) 928-4516" },
    ],
    hospital: { name: "UCSF Health Hyde Hospital", address: "900 Hyde St", dist: "about 0.5 mi", phone: "(415) 353-6000", url: "https://www.ucsfhealth.org/locations/hyde-hospital" },
    transit:
      "Civic Center and Powell Street stations (BART and Muni Metro J, K, L, M, N, T) are a short walk along Market St, as is the F-Market historic streetcar. Muni buses: 19, 27, 31, 38, 49.",
  },

  "Civic Center": {
    spirit:
      "San Francisco's grand Beaux-Arts heart — a monumental plaza ringed by the gilded-dome City Hall, world-class opera and symphony, and the city's great library.",
    reasons: ["Beaux-Arts grandeur", "Arts and culture hub", "Major BART/Muni hub", "Walk to City Hall"],
    history:
      "After the 1906 earthquake and fire leveled the area, San Francisco rebuilt it as a 'City Beautiful' showpiece — a unified Beaux-Arts civic complex of monumental buildings framing a formal plaza. The centerpiece, City Hall, opened in 1915 with a gilded dome rising about 301 feet, taller than the U.S. Capitol's. Over following decades the surrounding Performing Arts district took shape, anchored by the War Memorial Opera House (1932) and, later, Davies Symphony Hall. In 1945 delegates of fifty nations met here, adopting the United Nations Charter at the Opera House and signing it next door at the War Memorial's Herbst Theatre.",
    facts: [
      { icon: "tower", title: "A dome taller than the Capitol", text: "City Hall's gilded Beaux-Arts dome rises about 301 feet, higher than the U.S. Capitol in Washington." },
      { icon: "flag", title: "Birthplace of the U.N.", text: "The United Nations Charter was adopted at the War Memorial Opera House and signed at the adjacent Herbst Theatre in June 1945." },
      { icon: "book", title: "A grand main library", text: "The San Francisco Main Library at 100 Larkin St opened in 1996 with over 376,000 square feet across seven floors." },
      { icon: "art", title: "Asian art treasure house", text: "The Asian Art Museum holds one of the world's most comprehensive collections of Asian art, in the former Main Library building." },
      { icon: "music", title: "Opera, symphony and ballet", text: "The War Memorial Opera House and Davies Symphony Hall make Civic Center the city's performing-arts district." },
    ],
    nearby: ["Hayes Valley", "Tenderloin"],
    restaurants: [
      { name: "Zuni Café", address: "1658 Market St", phone: "(415) 552-2522", url: "https://zunicafe.com" },
      { name: "Rich Table", address: "199 Gough St", phone: "(415) 355-9085", url: "https://www.richtablesf.com" },
      { name: "Absinthe Brasserie & Bar", address: "398 Hayes St", phone: "(415) 551-1590", url: "https://www.absinthe.com" },
      { name: "Brenda's French Soul Food", address: "652 Polk St", phone: "(415) 345-8100", url: "https://frenchsoulfood.com" },
    ],
    bars: [
      { name: "Smuggler's Cove", address: "650 Gough St", phone: "(415) 869-1900", url: "https://www.smugglerscovesf.com" },
      { name: "Birba", address: "458 Grove St", phone: "(415) 549-7612", url: "https://www.birbawine.com" },
    ],
    hospital: { name: "UCSF Health Saint Francis Hospital", address: "900 Hyde St", dist: "about 0.8 mi", phone: "(415) 353-6000", url: "https://www.ucsfhealth.org/locations/saint-francis-hospital" },
    transit:
      "Civic Center/UN Plaza Station serves BART (all lines through downtown) and Muni Metro lines J, K, L, M and N at Market and 8th Streets. Many Muni bus and trolley lines run on Market, Van Ness and Polk.",
  },

  "Fishermans Wharf": {
    spirit:
      "A working crab fleet turned world-famous waterfront — barking sea lions at PIER 39, steaming Dungeness pots, and the cable car clanging to a stop at the bay's edge.",
    reasons: ["Iconic SF waterfront", "Sea lions at PIER 39", "Dungeness crab heritage", "Cable cars & streetcars"],
    history:
      "The Wharf grew in the late 1800s as Italian immigrant fishermen — many from Genoa — launched lateen-rigged feluccas and Monterey clippers to chase herring and Dungeness crab, selling their catch from stalls along the pier. It was here that Genoese fishermen created cioppino, the communal seafood stew. After the 1906 earthquake the area was rebuilt over the rubble of the old Meiggs Wharf, and through the 20th century the shrinking fishing fleet gave way to a tourism economy of crab stands, restaurants, and shops. In October 1989, following the Loma Prieta earthquake, California sea lions began hauling out on PIER 39's K-Dock; by 1990 hundreds had taken over, and they have lived there ever since. Today a small commercial fishing fleet still works alongside one of America's most-visited waterfronts.",
    facts: [
      { icon: "bird", title: "Sea lions since 1990", text: "Hundreds of California sea lions haul out on PIER 39's K-Dock; a record 2,000-plus crowded the docks in April 2024." },
      { icon: "factory", title: "Ghirardelli Square", text: "The former Ghirardelli chocolate factory, with roots to 1852, became one of the first major U.S. adaptive-reuse projects in the 1960s." },
      { icon: "water", title: "Birthplace of cioppino", text: "Genoese fishermen invented the Dungeness-crab stew cioppino here in the late 1800s." },
      { icon: "tram", title: "Cable-car turnarounds", text: "The Powell-Hyde and Powell-Mason cable car lines both terminate at the Wharf, at Hyde & Beach and Taylor & Bay." },
      { icon: "coffee", title: "Irish coffee's U.S. debut", text: "The Buena Vista, near the Hyde Street turnaround, is credited with introducing Irish coffee to America in 1952." },
    ],
    restaurants: [
      { name: "Scoma's", address: "1965 Al Scoma Way (Pier 47)", phone: "(415) 771-4383", url: "https://scomas.com" },
      { name: "Fog Harbor Fish House", address: "PIER 39, Suite A202", phone: "(415) 421-2442", url: "https://fogharbor.com" },
      { name: "The Franciscan Crab Restaurant", address: "Pier 43 1/2", phone: "(415) 362-7733", url: "https://www.franciscancrabrestaurant.com" },
      { name: "Bistro Boudin", address: "160 Jefferson St", phone: "(415) 351-5561", url: "https://bistroboudin.com" },
    ],
    bars: [
      { name: "The Buena Vista", address: "2765 Hyde St", phone: "(415) 474-5044", url: "https://www.thebuenavista.com" },
    ],
    hospital: { name: "CPMC Van Ness Campus", address: "1101 Van Ness Ave", dist: "about 1.5 mi", phone: "(415) 600-6000", url: "https://www.sutterhealth.org/cpmc" },
    transit:
      "F-Market & Wharves historic streetcar serves the Embarcadero and Jefferson St. Powell-Hyde and Powell-Mason cable cars terminate at the Wharf (Hyde & Beach, Taylor & Bay). E-Embarcadero streetcar and buses 8, 30, 39 and 47 also serve the area.",
  },

  "Inner Sunset": {
    spirit:
      "A foggy, leafy district pressed between Golden Gate Park and UCSF, where the buzzing 9th Avenue and Irving Street strip anchors one of the city's best global-food corners.",
    reasons: ["Steps from Golden Gate Park", "Strong restaurant row on 9th & Irving", "N-Judah straight downtown", "Next to UCSF Parnassus"],
    history:
      "Through the 1860s–1880s the Inner Sunset was open sand dunes dotted with dairies, roadhouses, and dynamite works on the city's western edge. Development took hold after entrepreneur Aurelius Buckingham began building near 5th Avenue and Lincoln Way in 1887, and accelerated with the 1894 California Midwinter Exposition staged in adjacent Golden Gate Park. UCSF planted its medical campus uphill on Parnassus Heights in 1897, a presence that still shapes the neighborhood. Streetcar service through the new Sunset Tunnel and the N-Judah line (Mayor 'Sunny Jim' Rolph drove the first car in 1928) finally tied the once-remote 'outside lands' to downtown, filling the blocks with homes.",
    facts: [
      { icon: "park", title: "Park at the doorstep", text: "Golden Gate Park borders the neighborhood to the north, putting the de Young Museum, Academy of Sciences, and Botanical Garden within a short walk." },
      { icon: "subway", title: "N-Judah lifeline", text: "The N-Judah Muni Metro line runs through Inner Sunset along Irving and 9th, connecting the neighborhood to downtown and the ballpark." },
      { icon: "house", title: "UCSF on the hill", text: "UCSF established its medical center on Parnassus Heights, just uphill, in 1897 — still a major employer and presence." },
      { icon: "beer", title: "SF's oldest bar", text: "The Little Shamrock on Lincoln Way has poured drinks since 1893, making it one of San Francisco's oldest continuously operating bars." },
      { icon: "fair", title: "Born of a world's fair", text: "Growth surged after the 1894 California Midwinter International Exposition drew crowds to neighboring Golden Gate Park." },
    ],
    restaurants: [
      { name: "Marnee Thai", address: "1243 9th Ave", phone: "(415) 731-9999", url: "https://www.marneethaisf.com" },
      { name: "San Tung", address: "1031 Irving St", phone: "(415) 242-0828", url: "https://www.santungsf.com" },
      { name: "Fiorella Sunset", address: "1240 9th Ave", phone: "(415) 404-6997", url: "https://fiorella-sf.com" },
      { name: "Arizmendi Bakery", address: "1331 9th Ave", phone: "(415) 566-3117", url: "https://www.arizmendibakery.com" },
    ],
    bars: [
      { name: "The Little Shamrock", address: "807 Lincoln Way", phone: "(415) 661-0060" },
      { name: "Yancy's Saloon", address: "734 Irving St", phone: "(415) 665-6551" },
    ],
    hospital: { name: "UCSF Medical Center at Parnassus", address: "505 Parnassus Ave", dist: "about 0.5 mi", phone: "(415) 476-1000", url: "https://www.ucsfhealth.org/locations/parnassus-campus" },
    transit:
      "The N-Judah Muni Metro line runs through the neighborhood along Irving Street and 9th Avenue to downtown. Buses 6, 7, 28, 43, 44, and 66 serve the 9th Ave & Irving area.",
  },

  "Outer Sunset": {
    spirit:
      "A foggy, laid-back surf-and-sand district at the edge of the city, where the N-Judah ends at Ocean Beach and life moves at a mellow pace.",
    reasons: ["Steps from Ocean Beach", "Surf culture", "Quieter, more space for the money", "Beloved café scene"],
    aka: "the Outside Lands",
    history:
      "Now-residential streets here were once the windswept sand dunes of the 'Outside Lands' on San Francisco's far west side, long considered too remote to settle. The Park and Ocean Railroad began bringing weekend crowds to Ocean Beach in 1883, but the dunes remained mostly empty until the 1920s and 1930s. Developers including Henry Doelger took advantage of new FHA loans to build row upon row of affordable stucco single-family homes. From 1934 to 1941 Doelger was the largest homebuilder in the country, putting up roughly two houses a day, and by just after World War II the dunes had been filled with a sea of these row houses.",
    facts: [
      { icon: "wave", title: "Ocean Beach surf", text: "The neighborhood fronts Ocean Beach, one of the most powerful and challenging surf breaks on the West Coast." },
      { icon: "house", title: "Doelger row houses", text: "Builder Henry Doelger raised much of the Sunset in the 1930s, at his peak the nation's largest homebuilder, completing about two stucco houses a day." },
      { icon: "park", title: "Sunset Dunes park", text: "The 77-acre car-free Sunset Dunes park opened along the former Upper Great Highway on April 12, 2025 — California's largest pedestrianization project." },
      { icon: "sun", title: "Sunset Reservoir solar", text: "The 5-megawatt Sunset Reservoir solar array, completed in 2009 with nearly 24,000 panels, was one of the largest municipal solar projects in the country at the time." },
      { icon: "coffee", title: "Café and surf culture", text: "Spots like Trouble Coffee, Andytown and Outerlands helped define a low-key beachside café culture that draws visitors from across the city." },
    ],
    restaurants: [
      { name: "Outerlands", address: "4001 Judah St", phone: "(415) 661-6140", url: "https://www.outerlandssf.com" },
      { name: "Thanh Long", address: "4101 Judah St", phone: "(415) 665-1146", url: "https://www.thanhlongsf.com" },
      { name: "Hook Fish Co.", address: "4542 Irving St", phone: "(415) 569-4984", url: "https://www.hookfishco.com" },
      { name: "Devil's Teeth Baking Company", address: "3876 Noriega St", phone: "(415) 683-5533", url: "https://www.devilsteethbakingcompany.com" },
    ],
    bars: [
      { name: "White Cap", address: "3608 Taraval St", url: "https://whitecapsf.com" },
      { name: "Woods Outbound", address: "4045 Judah St", phone: "(415) 571-8025", url: "https://www.woodsbeer.com/outbound" },
      { name: "Andytown Coffee Roasters", address: "3655 Lawton St", phone: "(415) 753-9775", url: "https://andytownsf.com" },
      { name: "Java Beach Cafe", address: "1396 La Playa St", phone: "(415) 665-5282", url: "https://javabeachcafe.com" },
    ],
    hospital: { name: "UCSF Medical Center at Parnassus", address: "505 Parnassus Ave", dist: "about 2.5 mi", phone: "(415) 476-1000", url: "https://www.ucsfhealth.org/locations/parnassus-campus" },
    transit:
      "N-Judah Muni Metro runs to Ocean Beach at La Playa; L-Taraval serves the southern Outer Sunset. Buses include 7-Haight/Noriega, 18-46th Avenue, 29-Sunset and 48-Quintara/24th St.",
  },

  "Outer Richmond": {
    spirit:
      "San Francisco's foggy edge of the continent — a calm, residential grid of avenues running west to Ocean Beach, Lands End, and the ruins of Sutro Baths.",
    reasons: ["Near Lands End & Ocean Beach", "Clement St food scene", "Calm, residential", "38-Geary buses downtown"],
    aka: "The Avenues",
    history:
      "At the turn of the 20th century the area west of Arguello was windswept sand dunes and potato fields, lumped with the rest of the western city as the “Outside Lands.” New cable and electric streetcar lines opened it to the public, carrying San Franciscans out to Golden Gate Park, Ocean Beach, and Adolph Sutro's Cliff House and Sutro Baths. After the 1906 earthquake and fire, displaced residents settled the avenues in large numbers. Waves of Russian refugees arrived after the Russian Revolution, and from the 1950s onward — especially after 1965 — Chinese immigrants made the district home, giving Geary Boulevard and Clement Street their distinctive Russian and Cantonese character.",
    facts: [
      { icon: "wave", title: "Sutro Baths ruins", text: "The 1894 Sutro Baths, once the world's largest indoor saltwater swimming complex, survive as dramatic oceanfront ruins at Lands End." },
      { icon: "art", title: "Legion of Honor", text: "The Legion of Honor fine-arts museum, a replica of Paris's Palais de la Légion d'Honneur, sits on a bluff above Lands End." },
      { icon: "church", title: "Holy Virgin Cathedral", text: "The gold-domed Holy Virgin Cathedral (6210 Geary), completed in 1965, is the largest cathedral of the Russian Orthodox Church Outside Russia." },
      { icon: "park", title: "Lands End", text: "Lands End offers cliffside coastal trails with Golden Gate Bridge views, plus Mile Rock Beach and the old Fort Miley." },
      { icon: "beer", title: "Oldest U.S. tiki bar", text: "Trad'r Sam on Geary, opened in 1937, bills itself as the oldest continuously operating tiki bar in the United States." },
    ],
    restaurants: [
      { name: "Pearl 6101", address: "6101 California St", phone: "(415) 592-9777", url: "https://www.pearl6101.com" },
      { name: "Violet's Tavern", address: "2301 Clement St", phone: "(415) 682-4861", url: "https://www.violets-sf.com" },
      { name: "Pacific Cafe", address: "7000 Geary Blvd", phone: "(415) 387-7091", url: "https://pacificcafesf.com" },
      { name: "Hong Kong Lounge", address: "5322 Geary Blvd", phone: "(415) 668-8836", url: "https://www.newhongkonglounge.com" },
    ],
    bars: [
      { name: "Trad'r Sam", address: "6150 Geary Blvd", phone: "(415) 221-0773", url: "https://tradrsam.net" },
      { name: "The Blarney Stone", address: "5625 Geary Blvd", phone: "(415) 386-9914" },
      { name: "Ireland's 32", address: "3920 Geary Blvd", phone: "(415) 386-6173" },
      { name: "Simple Pleasures Cafe", address: "3434 Balboa St", phone: "(415) 387-4022" },
    ],
    hospital: { name: "UCSF Health Stanyan Hospital (formerly St. Mary's)", address: "450 Stanyan St", dist: "about 3 mi", phone: "(415) 668-1000", url: "https://sfcommunityhospitals.ucsfhealth.org/st-marys" },
    transit:
      "38-Geary and 38R-Geary Rapid run the length of Geary Blvd to downtown; 1-California to the north; 5-Fulton and 5R-Fulton Rapid along Fulton; 31-Balboa and 29-Sunset also serve the avenues.",
  },

  "Dogpatch": {
    spirit: "A sun-warmed slice of the central waterfront where 19th-century shipyards and workers' cottages have been reborn as breweries, art galleries and some of the city's most beloved restaurants.",
    reasons: ["Historic maker district", "Galleries & breweries", "Sunny waterfront pocket", "T-Third light rail"],
    aka: "Central Waterfront",
    history: "Dogpatch grew up in the 1870s as an informal company town for the ironworks, refineries and shipyards along the bay's edge. Three-quarters of its households worked for big employers like the Union Iron Works (later Bethlehem Steel) at Pier 70, and developers threw up rows of cheap Victorian and Edwardian cottages, including a cluster of identical Eastlake-style homes built to plans by architect John Cotter Pelton, Jr. Spared by the 1906 earthquake and fire, much of that worker housing survives, making Dogpatch one of the city's most intact pre-1910 neighborhoods. Shipbuilding faded after World War II, and in recent decades the old industrial blocks have been reborn as an arts, maker and dining district anchored by the Minnesota Street Project galleries.",
    facts: [
      { icon: "factory", title: "Birthplace of warships", text: "The Union Iron Works, founded 1883, built vessels like the battleship USS Oregon along this waterfront." },
      { icon: "quake", title: "Survived 1906", text: "Much of Dogpatch escaped the earthquake and fire, leaving a rare intact district of 1870s–1910 workers' cottages." },
      { icon: "house", title: "Pelton cottages", text: "Clusters of identical Eastlake-style cottages were built to plans by architect John Cotter Pelton, Jr." },
      { icon: "art", title: "An arts hub", text: "The Minnesota Street Project at 1275 Minnesota St houses more than a dozen independent fine-art galleries." },
      { icon: "dog", title: "A name nobody agrees on", text: "Theories trace 'Dogpatch' to dogfennel weed, packs of stray dogs, or the Li'l Abner comic strip." },
    ],
    restaurants: [
      { name: "Piccino", address: "1001 Minnesota St", phone: "(415) 824-4224", url: "https://www.piccino.com" },
      { name: "Long Bridge Pizza Co.", address: "2347 3rd St", phone: "(415) 829-8999", url: "https://www.longbridgepizza.com" },
      { name: "Wolfsbane", address: "2495 3rd St", phone: "(415) 961-4017", url: "https://wolfsbanesf.com" },
    ],
    bars: [
      { name: "The Sea Star", address: "2289 3rd St", phone: "(415) 552-5330", url: "https://www.theseastarsf.com" },
      { name: "Third Rail", address: "628 20th St", url: "https://www.thirdrailbarsf.com" },
      { name: "Dogpatch Saloon", address: "2496 3rd St" },
    ],
    hospital: { name: "Zuckerberg San Francisco General Hospital and Trauma Center", address: "1001 Potrero Ave", dist: "about 1.3 mi", phone: "(628) 206-8000", url: "https://www.zuckerbergsanfranciscogeneral.org" },
    transit: "T-Third Muni Metro light rail runs the length of Third St with stops at 20th St and 23rd St. Buses 22 Fillmore, 48 Quintara/24th St and 55 Dogpatch also serve the neighborhood.",
  },

  "Mission Bay": {
    spirit: "San Francisco's newest neighborhood from the ground up — a master-planned waterfront district of biotech labs, modern mid-rises and arena lights rising where rail yards once stood.",
    reasons: ["New construction", "UCSF & biotech jobs", "Chase Center events", "Waterfront parks"],
    history: "Mission Bay began as tidal marsh, filled in over the late 1800s to become wharves and Southern Pacific railroad yards. After the rail yards shut down, the land sat largely vacant for decades until a roughly 300-acre redevelopment — the city's largest since Golden Gate Park — broke ground in the late 1990s. UCSF opened its Mission Bay research campus in 2003 with Genentech Hall, anchoring what became one of the nation's largest biomedical university expansions and seeding a cluster of biotech companies. The Warriors' Chase Center arena followed in 2019, and new waterfront parks have continued to open into the 2020s.",
    facts: [
      { icon: "factory", title: "Built on old rail yards", text: "The neighborhood rose on former Southern Pacific railroad yards, redeveloped from the late 1990s in a roughly 300-acre plan." },
      { icon: "money", title: "A biotech hub", text: "UCSF's Mission Bay campus opened in 2003 and helped grow the city's biotech sector from one company to more than 100 within a decade." },
      { icon: "star", title: "Home of the Warriors", text: "Chase Center opened in 2019 as a privately financed arena seating about 18,000 for Golden State Warriors basketball and concerts." },
      { icon: "water", title: "New waterfront parks", text: "Bayfront Park sits between Chase Center and the Bay, and China Basin Park opened in 2024 at the mouth of Mission Creek." },
      { icon: "tram", title: "A streetcar district", text: "The T Third Muni Metro line runs up Third Street with a stop right at UCSF/Chase Center." },
    ],
    restaurants: [
      { name: "Che Fico Pizzeria", address: "1 Warriors Way, Ste 300", phone: "(415) 655-9675", url: "https://www.chefico.com" },
      { name: "Dumpling Time", address: "191 Warriors Way", url: "https://www.dumplingtime.com/thrive-city" },
      { name: "Burma Love", address: "151 Warriors Way, Ste 105", phone: "(415) 881-1800", url: "https://www.burmalove.co/burma-love-thrive-city" },
      { name: "Gott's Roadside", address: "151 Warriors Way, Ste 102", phone: "(415) 815-2992", url: "https://www.gotts.com/location/sfmissionbay/" },
    ],
    bars: [
      { name: "Golden Rule", address: "720 Terry Francois Blvd", url: "https://www.goldenrulebar.com" },
      { name: "Spark Social SF", address: "601 Mission Bay Blvd North", url: "https://sparksocialsf.com" },
    ],
    hospital: { name: "UCSF Medical Center at Mission Bay", address: "1825 4th St", dist: "right in the neighborhood", phone: "(415) 353-3000", url: "https://www.ucsfhealth.org/locations/mission-bay-campus" },
    transit: "The T-Third Muni Metro line runs up Third Street with a stop at UCSF/Chase Center; the N-Judah also serves the area. Caltrain's terminus at 4th & King is just to the north.",
  },

  "South Beach": {
    spirit: "San Francisco's waterfront ballpark village — Bay Bridge views, a yacht-filled harbor, and Giants energy wrapped around Oracle Park.",
    reasons: ["Steps from Oracle Park", "Waterfront promenade", "Bay Bridge views", "Ferry & Muni access"],
    history: "Once a working stretch of industrial piers, rail yards, and warehouses along China Basin, South Beach spent more than a century as a blue-collar waterfront. Redevelopment began in the 1980s, anchored by the South Beach Harbor marina, which opened in 1986 on Port of San Francisco land. The neighborhood's transformation accelerated when the Giants broke ground for a new ballpark at Third and King in 1997. Pacific Bell Park opened on April 11, 2000 (later SBC Park, AT&T Park, and now Oracle Park), turning the sleepy district into a dense neighborhood of condos, restaurants, and bars. Today it blends marina living, waterfront parks, and game-day crowds.",
    facts: [
      { icon: "star", title: "A privately financed ballpark", text: "Oracle Park opened April 11, 2000 at Third and King as Pacific Bell Park — the first privately financed Major League ballpark since Dodger Stadium in 1962." },
      { icon: "water", title: "McCovey Cove", text: "The slice of San Francisco Bay beyond Oracle Park's right-field wall is nicknamed McCovey Cove, where kayakers wait to fish out home-run 'splash hits.'" },
      { icon: "wave", title: "A 700-slip harbor", text: "South Beach Harbor, built in 1986 between Pier 40 and the ballpark, holds about 700 slips on concrete docks just half a mile south of the Bay Bridge." },
      { icon: "bridge", title: "Cupid's Span", text: "The 60-foot bow-and-arrow sculpture by Claes Oldenburg and Coosje van Bruggen was installed in 2002 at Rincon Park on the Embarcadero, framing the waterfront's Bay Bridge views." },
    ],
    restaurants: [
      { name: "MoMo's", address: "760 2nd St", phone: "(415) 227-8660", url: "https://www.sfmomos.com" },
      { name: "Marlowe", address: "500 Brannan St", phone: "(415) 777-1413", url: "https://www.marlowesf.com" },
      { name: "Town's End Brunch", address: "2 Townsend St", phone: "(415) 875-9984", url: "https://townsendbrunch.com" },
      { name: "Red's Java House", address: "Pier 30, The Embarcadero", phone: "(415) 777-5626", url: "https://www.redsjavahouse.com" },
    ],
    bars: [
      { name: "Candlestick Park Sports Bar", address: "747 3rd St", phone: "(415) 655-9982", url: "https://www.candlestickbarsf.com" },
      { name: "Hi Dive", address: "Pier 28 1/2, The Embarcadero", phone: "(415) 977-0170", url: "https://www.hidivesf.com" },
    ],
    hospital: { name: "Zuckerberg San Francisco General Hospital and Trauma Center", address: "1001 Potrero Ave", dist: "about 2 mi", phone: "(628) 206-8000", url: "https://www.zuckerbergsanfranciscogeneral.org" },
    transit: "Muni Metro N-Judah stops at 2nd & King beside Oracle Park; the T-Third/Central Subway stops at 4th & King. The F-Market historic streetcar runs the Embarcadero, and Caltrain terminates at 4th & King.",
  },

  "Rincon Hill": {
    spirit: "A vertical neighborhood of glass residential towers rising at the foot of the Bay Bridge's western anchorage — one of San Francisco's densest, newest skylines.",
    reasons: ["High-rise living", "At the Bay Bridge", "Salesforce Transit Center nearby", "Walk to FiDi & SoMa"],
    aka: "The East Cut",
    history: "In the 1850s and 1860s Rincon Hill was San Francisco's first fashionable address, a pre-Nob Hill enclave of garden mansions where figures like Leland Stanford and William T. Sherman lived. The controversial Second Street Cut of 1869 carved a deep chasm through the hill to ease access to the waterfront wharves, and the neighborhood lost its cachet. Through the 20th century it became an industrial district of warehouses, residential hotels, and the bridge's western approach. Rezoned for high density in 1985 and again in 2005, it has since filled with luxury condominium towers and was branded part of 'The East Cut' community-benefit district in 2015.",
    facts: [
      { icon: "bridge", title: "Bridge anchorage", text: "Rincon Hill is the western land anchorage of the San Francisco–Oakland Bay Bridge, whose suspension span lands here." },
      { icon: "road", title: "The Second Street Cut", text: "In 1869 crews dug a roughly 100-foot-deep cut through the hill along Second Street from Folsom to Bryant to reach the wharves — a project that ended its mansion era." },
      { icon: "tower", title: "One Rincon Hill", text: "The One Rincon Hill South Tower, completed in 2008, rises 60 stories and about 641 feet at the hill's apex." },
      { icon: "house", title: "Built for density", text: "The 2005 rezoning planned for thousands of new residents, making Rincon Hill one of the city's densest residential districts." },
      { icon: "star", title: "The East Cut", text: "Formed in 2015 (originally the Greater Rincon Hill CBD), 'The East Cut' unites Rincon Hill, Folsom Street, and the Transbay area under one community-benefit district." },
    ],
    nearby: ["The East Cut", "Embarcadero", "SoMa"],
    restaurants: [
      { name: "EPIC Steak", address: "369 The Embarcadero", phone: "(415) 369-9955", url: "https://www.epicsteak.com" },
      { name: "Waterbar", address: "399 The Embarcadero", phone: "(415) 284-9922", url: "https://www.waterbarsf.com" },
      { name: "Yank Sing (Rincon Center)", address: "101 Spear St", phone: "(415) 781-1111", url: "https://yanksing.com" },
    ],
    bars: [
      { name: "Hi Dive", address: "Pier 28 1/2, The Embarcadero", phone: "(415) 977-0170", url: "https://www.hidivesf.com" },
    ],
    hospital: { name: "CPMC Van Ness Campus", address: "1101 Van Ness Ave", dist: "about 2.5 mi", phone: "(415) 600-6000", url: "https://www.sutterhealth.org/cpmc" },
    transit: "The Salesforce Transit Center (bus hub for AC Transit transbay, Muni, Golden Gate Transit and SamTrans) sits a few blocks north. Embarcadero BART and Muni Metro station and the F-Market historic streetcar along the Embarcadero are within walking distance; the Bay Bridge bus approach runs overhead.",
  },

  "Corona Heights": {
    spirit: "A quiet residential hill between the Castro and the Haight, crowned by the rocky, chert-red Corona Heights Park with some of the city's best skyline views and home to the family-favorite Randall Museum.",
    reasons: ["Knockout city views", "Quiet & residential", "Corona Heights Park", "Walk to the Castro"],
    aka: "Museum Hill",
    history: "The hill was once Rock Hill, site of the Gray Brothers' quarry and brick factory, which began blasting into the slope around 1899 and exposed the deep-red Franciscan chert that still defines the summit. The Gray brothers, George and Harry, ran several quarries across the city, but their substandard bricks and rough operations drew lasting complaints. In 1941, San Francisco's first Superintendent of Recreation, Josephine D. Randall, persuaded the city to buy the land for public recreation, and the renamed Corona Heights opened as a park. The Josephine D. Randall Junior Museum opened on the site in 1951 in a building by architect William Merchant, carrying forward Randall's vision of a hands-on museum for children.",
    facts: [
      { icon: "factory", title: "Born from a brickyard", text: "The park's jagged red summit is exposed Franciscan chert, blasted bare by the Gray Brothers' quarry and brick factory beginning around 1899." },
      { icon: "art", title: "Randall Museum", text: "The free Josephine D. Randall Museum at 199 Museum Way has offered hands-on science, art and nature programs for kids since opening here in 1951." },
      { icon: "star", title: "Big-city panorama", text: "The rocky peak rises to about 520 feet, opening up sweeping views of downtown, the bay and beyond." },
      { icon: "dog", title: "Off-leash hill", text: "Corona Heights Park includes a dedicated dog play area, a playground and tennis courts alongside its trails." },
      { icon: "park", title: "A hilltop preserved", text: "Recreation Superintendent Josephine Randall convinced the city to buy the old quarry in 1941 and turn its roughly 16 acres into public parkland." },
    ],
    nearby: ["the Castro", "Cole Valley"],
    restaurants: [
      { name: "Frances", address: "3870 17th St", phone: "(415) 621-3870", url: "https://frances-sf.com" },
      { name: "Starbelly", address: "3583 16th St", phone: "(415) 252-7500", url: "https://www.starbellysf.com" },
      { name: "Zazie", address: "941 Cole St", phone: "(415) 564-5332", url: "https://www.zaziesf.com" },
    ],
    bars: [
      { name: "Twin Peaks Tavern", address: "401 Castro St", phone: "(415) 864-9470", url: "https://twinpeakstavern.com" },
      { name: "InoVino", address: "108B Carl St", phone: "(415) 681-3770", url: "https://inovinosanfrancisco.com" },
    ],
    hospital: { name: "CPMC Davies Campus", address: "601 Duboce Ave", dist: "about 0.7 mi", phone: "(415) 600-6000", url: "https://www.sutterhealth.org/cpmc" },
    transit: "Muni 37-Corbett runs along Roosevelt Way past the park; the 24-Divisadero stops along Castro Street. Castro Station (Muni Metro K, L, M) and the F-Market streetcar are a short walk downhill in the Castro.",
  },

  "Bayview": {
    spirit: "San Francisco's sun-warmed southeast corner — a hilly, historically African-American neighborhood where the Third Street corridor still beats with deep community roots.",
    reasons: ["Among the city's sunniest", "Rich cultural history", "T-Third light rail", "More space for the money"],
    aka: "Bayview–Hunters Point",
    history: "Bayview grew up around Butchertown, the slaughterhouse district where cattle were once driven down Third Street, and the heavy industry of the city's southeastern flats. During World War II, thousands of African-American workers came to labor at the Hunters Point Naval Shipyard, and the neighborhood became the heart of Black San Francisco. For decades the area was underserved by transit until the Third Street Light Rail Project brought the Muni Metro T line to the corridor in 2007. Today the Third Street corridor holds the largest concentration of Black-owned businesses in the city, anchored by the 1888 Bayview Opera House.",
    facts: [
      { icon: "factory", title: "Shipyard heritage", text: "The WWII-era Hunters Point Naval Shipyard drew thousands of African-American workers, shaping Bayview into the heart of Black San Francisco." },
      { icon: "music", title: "City's oldest theatre", text: "The Bayview Opera House at 4705 Third St, built in 1888, is reputed to be the oldest surviving theatre in San Francisco — a City Landmark and on the National Register of Historic Places." },
      { icon: "tram", title: "T-Third light rail", text: "The Third Street Light Rail brought Muni Metro's T line to the long-underserved corridor in 2007, with stations the length of Third Street." },
      { icon: "cow", title: "Butchertown roots", text: "Bayview grew up around Butchertown, the city's old slaughterhouse district, where cowboys once drove cattle down Third Street." },
      { icon: "shop", title: "Black-owned business hub", text: "The Third Street corridor is home to the largest concentration of Black-owned businesses in San Francisco." },
    ],
    restaurants: [
      { name: "Gumbo Social", address: "5176 3rd St", phone: "(415) 655-9195", url: "https://www.gumbosocial.com" },
      { name: "Smoke Soul Kitchen", address: "4618 3rd St", phone: "(415) 900-6093", url: "https://www.smokesoulkitchen.com" },
      { name: "Old Skool Cafe", address: "1429 Mendell St", phone: "(415) 822-8531", url: "https://www.oldskoolcafe.org" },
      { name: "All Good Pizza", address: "1605 Jerrold Ave", phone: "(415) 933-9384", url: "https://www.allgoodpizza.com" },
      { name: "Tallio's Coffee", address: "4732 3rd St", phone: "(415) 610-8031", url: "https://tallioscoffee.com" },
    ],
    bars: [
      { name: "Laughing Monk Brewing", address: "1439 Egbert Ave", phone: "(415) 678-5157", url: "https://taproom.laughingmonk.com" },
      { name: "D10 Taproom at Hunters Point Brewery", address: "1195 Evans Ave" },
    ],
    hospital: { name: "Zuckerberg San Francisco General Hospital and Trauma Center", address: "1001 Potrero Ave", dist: "about 3 mi", phone: "(628) 206-8000", url: "https://zuckerbergsanfranciscogeneral.org" },
    transit: "The T-Third Muni Metro line runs the length of Third Street with stations including Evans, Williams, Revere/Shafter and Carroll. Connecting buses include the 19, 24, 29, 44 and 54.",
  },

  "Hunters Point": {
    spirit: "A sun-warmed hill jutting into the bay on the city's southeastern edge — a proud, historically Black community where a former naval shipyard now holds one of the largest artist colonies in the country.",
    reasons: ["Sunniest corner of SF", "Sweeping bay views", "Shipyard artist studios", "Major waterfront redevelopment"],
    aka: "The Point",
    history: "The Hunters Point drydocks date to the 1860s and were billed as one of the world's great shipyards by the early 1900s. The U.S. Navy took over the site in 1940, and during World War II the Hunters Point Naval Shipyard employed roughly 18,500 people, drawing a large Black workforce in the wartime Great Migration that put down lasting roots here. After the Navy established a Naval Radiological Defense Laboratory in 1946, decades of military and industrial use left soil and groundwater badly contaminated; the yard closed in 1974 and was named a federal Superfund site in 1989. Today the old shipyard hosts the Hunters Point Shipyard Artists — one of the nation's largest artist communities, with hundreds of studios — while the surrounding land undergoes a long, contested environmental cleanup and a multi-thousand-home redevelopment.",
    facts: [
      { icon: "water", title: "World-class drydocks", text: "The Hunters Point drydocks opened in the 1860s and were promoted as one of the greatest shipyards on earth by the early 1900s." },
      { icon: "factory", title: "WWII shipyard", text: "The Navy acquired the yard in 1940; at its WWII peak the Hunters Point Naval Shipyard employed about 18,500 workers." },
      { icon: "art", title: "Huge artist colony", text: "The Hunters Point Shipyard Artists run hundreds of working studios at 451 Galvez Ave and hold free Open Studios each spring and fall." },
      { icon: "house", title: "Shipyard redevelopment", text: "The former Navy land is being rebuilt as The San Francisco Shipyard, a master-planned community slated for thousands of new homes plus parks and commercial space." },
      { icon: "park", title: "New waterfront parks", text: "The India Basin Waterfront Park project is knitting together more than 60 acres of shoreline, connecting Heron's Head Park and its EcoCenter to future Northside Park." },
    ],
    nearby: ["Bayview"],
    restaurants: [
      { name: "Old Skool Cafe", address: "1429 Mendell St", phone: "(415) 822-8531", url: "https://www.oldskoolcafe.org" },
      { name: "Smoke Soul Kitchen", address: "4618 3rd St", phone: "(415) 900-6093", url: "https://www.smokesoulkitchen.com" },
      { name: "All Good Pizza", address: "1605 Jerrold Ave", phone: "(415) 933-9384", url: "https://www.allgoodpizza.com" },
    ],
    bars: [
      { name: "Laughing Monk Brewing", address: "1439 Egbert Ave", phone: "(415) 678-5157", url: "https://taproom.laughingmonk.com" },
    ],
    hospital: { name: "Zuckerberg San Francisco General Hospital and Trauma Center", address: "1001 Potrero Ave", dist: "about 4 mi", phone: "(628) 206-8000", url: "https://www.zuckerbergsanfranciscogeneral.org" },
    transit: "The 15 Bayview Hunters Point Express and 19 Polk buses serve Hunters Point directly. The T-Third Muni Metro line runs nearby up Third Street, with the 29 Sunset, 44 O'Shaughnessy and 54 Felton buses crossing the area.",
  },

  "Excelsior": {
    spirit: "A sunny, working-class hilltop on the city's southern edge — single-family homes lining streets named for European nations, with Mission Street's commercial spine packed with family-run immigrant kitchens.",
    reasons: ["One of SF's most diverse districts", "Family-run eats on Mission St", "Single-family homes", "Balboa Park BART nearby"],
    history: "The Excelsior was laid out in the late 1860s as an out-of-town subdivision: in 1869 the Excelsior Homestead Association filed a plat defining its distinctive 'around-the-world' grid, with streets named for capitals and avenues for countries (Paris, Lisbon, Madrid, Naples, London, Munich, and more). Developer plans aimed to lure working families out of the crowded inner city, and the 1906 earthquake spurred a wave of new home-buyers. Early residents were largely Irish, German, and Italian farm and dairy workers; some street names such as China and Japan were later changed to Avalon and Excelsior amid anti-Asian sentiment of the era. Through the 20th century the district drew successive immigrant communities, and today it is one of San Francisco's most ethnically diverse neighborhoods, with large Asian and Latino populations.",
    facts: [
      { icon: "road", title: "An atlas in street signs", text: "Streets are named for European capitals and avenues for countries — Paris, Madrid, Naples, London, Munich, Lisbon — a naming scheme set by the Excelsior Homestead Association in 1869." },
      { icon: "house", title: "Out-of-town subdivision", text: "Platted in the late 1860s as a homestead tract of modest single-family cottages well beyond the built-up city; the 1906 earthquake drove a surge of buyers seeking new homes." },
      { icon: "flag", title: "Among SF's most diverse", text: "Roughly half of residents were born abroad, with Spanish, Mandarin, and Tagalog among the most common languages spoken at home." },
      { icon: "subway", title: "Balboa Park transit hub", text: "Balboa Park BART at 401 Geneva Ave is one of the busiest BART stations outside downtown and a terminus for three Muni Metro light-rail lines." },
      { icon: "burrito", title: "Immigrant restaurant row", text: "Mission Street through the Excelsior is lined with family-run Salvadoran pupuserías, Filipino diners, Vietnamese bánh mì shops, Italian delis, and taquerías." },
    ],
    restaurants: [
      { name: "Taqueria El Farolito", address: "4817 Mission St", phone: "(415) 337-5500", url: "https://elfarolitosf.com" },
      { name: "Calabria Bros Deli", address: "4763 Mission St", phone: "(415) 239-2555", url: "https://calabriabrosdeli.com" },
      { name: "Pupuseria Metapan", address: "4769 Mission St", phone: "(415) 587-8599" },
      { name: "Restaurante Familiar", address: "4499 Mission St", phone: "(415) 334-6100" },
      { name: "Super Star Restaurant", address: "4919 Mission St", phone: "(415) 585-4360" },
    ],
    bars: [
      { name: "The Halfway Club", address: "1166 Geneva Ave", url: "https://www.halfwayclub.com" },
      { name: "Tala Wine", address: "4625 Mission St", phone: "(415) 740-8494", url: "https://www.tala.wine" },
      { name: "Excelsior Coffee", address: "4495 Mission St", phone: "(415) 347-7333", url: "https://www.xlcrsf.com" },
    ],
    hospital: { name: "Zuckerberg San Francisco General Hospital and Trauma Center", address: "1001 Potrero Ave", dist: "about 3.5 mi", phone: "(628) 206-8000", url: "https://www.zuckerbergsanfranciscogeneral.org" },
    transit: "Balboa Park BART (401 Geneva Ave) sits just southwest and is a terminus for Muni Metro J, K, and M light rail. Muni buses include the 14-Mission and 14R Rapid, 49 Van Ness/Mission, 29 Sunset, 8 Bayshore, 52 Excelsior, and 54 Felton.",
  },

  "Portola": {
    spirit: "A sunny, working-class corner of southeast San Francisco once carpeted with flower greenhouses, where the multicultural San Bruno Avenue strip still hums with bakeries, taquerias and pho.",
    reasons: ["Sunny southeast pocket", "Diverse San Bruno Ave eats", "Historic Garden District", "Near McLaren Park"],
    aka: "the Garden District",
    history: "In the early 1900s, Italian, Maltese and Jewish immigrants settled the Portola and built greenhouses to grow cut flowers for the city. By the 1920s dozens of family nurseries blanketed the neighborhood, supplying most of the flowers sold at the San Francisco Flower Mart and earning Portola its nickname as the city's Garden District. After World War II most growers moved south and greenhouses gave way to single-family homes, though the Garibaldi family's University Mound Nursery on Woolsey Street kept growing roses until 1990. San Bruno Avenue grew into the neighborhood's Main Street, and today the area is among the city's most Asian-majority, with a deeply multicultural commercial strip.",
    facts: [
      { icon: "sun", title: "San Francisco's Garden District", text: "A 2016 city resolution officially recognized the Portola as San Francisco's Garden District, honoring its flower-growing past." },
      { icon: "factory", title: "The last greenhouses", text: "The Garibaldi family's University Mound Nursery at 770 Woolsey St grew roses for the SF Flower Mart until 1990; its redwood-and-glass greenhouses are the last of their kind in the district." },
      { icon: "movie", title: "The Avenue Theatre", text: "This 1927 San Bruno Ave movie house was famed for its Wurlitzer organ before closing in 1984; the building still stands." },
      { icon: "park", title: "Next to McLaren Park", text: "John McLaren Park, the city's second-largest park at over 300 acres, borders the neighborhood." },
      { icon: "house", title: "A family neighborhood", text: "Portola is a quiet district of low-slung single-family homes that replaced the old nurseries after World War II." },
    ],
    restaurants: [
      { name: "Pho Nation", address: "2428 San Bruno Ave", phone: "(415) 347-7115" },
      { name: "Ming Hing Restaurant", address: "2550 San Bruno Ave", phone: "(415) 468-5309" },
      { name: "Restaurant Pupuseria Ilobasco", address: "2680 San Bruno Ave", phone: "(415) 468-3300" },
      { name: "The Old Clam House", address: "299 Bayshore Blvd", phone: "(415) 695-2866", url: "https://theoldclamhouse.com" },
      { name: "Round Table Pizza", address: "2660 San Bruno Ave", phone: "(415) 481-4705" },
    ],
    hospital: { name: "Zuckerberg San Francisco General Hospital and Trauma Center", address: "1001 Potrero Ave", dist: "about 2.5 mi", phone: "(628) 206-8000", url: "https://zuckerbergsanfranciscogeneral.org" },
    transit: "Muni 9-San Bruno and 9R-San Bruno Rapid run the length of San Bruno Ave; the 8-Bayshore, 23-Monterey and 54-Felton also serve the neighborhood. Bayshore Caltrain station is just east.",
  },

  "Visitacion Valley": {
    spirit: "A quiet, working-class corner of San Francisco's far southeast, where a multicultural community gathers along the little Leland Avenue main street between the Cow Palace and the green slopes of McLaren Park.",
    reasons: ["Leland Avenue main street", "Steps from McLaren Park", "Deeply multicultural", "T-Third light rail at the door"],
    aka: "Viz Valley",
    history: "Spanish friars and soldiers bound for the new Presidio camped in this bayside valley in 1777 on the Catholic Feast of the Visitation, giving the area its name. Through the 19th century it was a landscape of farms and dairies on the old Rancho Cañada de Guadalupe la Visitacion y Rodeo Viejo. In 1926 the Schlage Lock Company opened a factory here that made locks and anchored the local economy for more than seventy years, drawing a working-class immigrant community. Schlage closed in 1999, and the former plant is now being redeveloped as the mixed-use Baylands North community, approved in 2014 with roughly 1,670 new homes. Today Visitacion Valley is one of the city's most diverse neighborhoods, with Asian residents making up over half the population.",
    facts: [
      { icon: "church", title: "Named for a feast day", text: "A 1777 expedition camped here on the Catholic Feast of the Visitation, and the valley has carried the name 'Visitacion' ever since." },
      { icon: "factory", title: "Schlage Lock town", text: "The Schlage Lock factory opened in 1926 and made locks here for over 70 years until it closed in 1999." },
      { icon: "house", title: "Baylands North rising", text: "The former Schlage Lock site, approved for redevelopment in 2014, is being rebuilt as a mixed-use community with around 1,670 homes." },
      { icon: "park", title: "The Greenway", text: "The Visitacion Valley Greenway, begun in 2000, links six one-block parks and community gardens from Leland Avenue toward McLaren Park." },
      { icon: "tram", title: "T-Third terminus", text: "The neighborhood's Sunnydale Station anchors the south end of Muni's T-Third light rail line, which since 2023 runs through to Chinatown." },
    ],
    restaurants: [
      { name: "Pho Luen Fat", address: "110 Leland Ave", phone: "(415) 585-1167" },
    ],
    bars: [
      { name: "Mission Blue", address: "144 Leland Ave", phone: "(415) 508-7416", url: "https://missionbluesf.com" },
    ],
    hospital: { name: "Zuckerberg San Francisco General Hospital and Trauma Center", address: "1001 Potrero Ave", dist: "about 5 mi", phone: "(628) 206-8000", url: "https://www.zuckerbergsanfranciscogeneral.org" },
    transit: "Sunnydale Station anchors the south end of Muni Metro's T-Third line (extended through downtown to Chinatown in 2023). Bus lines 8-Bayshore, 9-San Bruno and 56 serve the area, and Bayshore Caltrain is just to the east.",
  },

  "Sunnyside": {
    spirit: "A small, sunny, low-key residential village on the south slope below Mount Davidson, where rows of early-1900s cottages line quiet streets above an unhurried Monterey Boulevard.",
    reasons: ["Quiet residential streets", "Among the city's more affordable single-family homes", "Glen Park BART close by", "Hidden Victorian conservatory"],
    history: "Sunnyside was laid out in 1891 by the Sunnyside Land Company, whose president, Behrend Joost, had bought the farmland from Leland Stanford. Joost's real ambition was transit: in 1892 he built the Sunnyside Powerhouse on what was then Sunnyside Avenue (today's Monterey Boulevard) to power the San Francisco and San Mateo Electric Railway, the city's first electric streetcar line, which opened April 27, 1892, running from Steuart and Market out past Glen Park to the Colma cemeteries. The streetcar drew buyers to the new subdivision, and through the early 1900s the tract filled in with modest cottages and single-family homes. Around 1901, British mining engineer W.A. Merralls built the octagonal redwood Sunnyside Conservatory, which still stands amid its palms as a city landmark.",
    facts: [
      { icon: "tram", title: "City's first electric streetcar", text: "The San Francisco and San Mateo Electric Railway, powered from the Sunnyside Powerhouse on Monterey Blvd, opened April 27, 1892." },
      { icon: "house", title: "Planned in 1891", text: "The Sunnyside Land Company, led by Behrend Joost, subdivided the tract from former Leland Stanford farmland in 1891." },
      { icon: "park", title: "Sunnyside Conservatory", text: "An octagonal redwood Victorian conservatory built around 1901 by engineer W.A. Merralls, now a city landmark surrounded by mature palms at 236 Monterey Blvd." },
      { icon: "road", title: "Monterey Boulevard was 'Sunnyside Avenue'", text: "The neighborhood's main commercial street was originally named Sunnyside Avenue before becoming Monterey Boulevard." },
      { icon: "sun", title: "Named for its sunshine", text: "The 'Sunnyside' name reflects the open, sunny south-facing slope the subdivision was marketed on." },
    ],
    restaurants: [
      { name: "Big Joe's", address: "717 Monterey Blvd", phone: "(415) 333-2878" },
      { name: "Won Kok Restaurant", address: "700 Monterey Blvd", phone: "(415) 587-1826", url: "https://won-kok.com" },
      { name: "Shanghai Dumpling King", address: "696 Monterey Blvd", phone: "(415) 585-1300" },
    ],
    bars: [
      { name: "Friends Bar", address: "558 Monterey Blvd", phone: "(415) 999-1338" },
      { name: "Railroad Expresso", address: "705 Monterey Blvd", phone: "(415) 333-4009" },
    ],
    hospital: { name: "CPMC Mission Bernal Campus", address: "3555 Cesar Chavez St", dist: "about 2 mi", phone: "(415) 641-6625", url: "https://www.sutterhealth.org/cpmc" },
    transit: "Glen Park BART (Daly City/Millbrae and SFO lines) sits just east of the neighborhood. Muni buses 36-Teresita and 43-Masonic serve Sunnyside directly; the 44-O'Shaughnessy and 52-Excelsior connect at Glen Park station, and the K-Ingleside Muni Metro runs nearby along Ocean Avenue.",
  },

  "Oceanview": {
    spirit: "A quiet, diverse, working-class residential corner in San Francisco's far southwest, anchored by City College and the Ocean Avenue corridor as the historic heart of the OMI district.",
    reasons: ["Part of historic OMI", "Quiet residential streets", "Near City College", "Transit to downtown via Ocean Ave"],
    aka: "Part of OMI",
    history: "Ocean View grew up around a stop on the San Francisco and San Jose Railroad, which began service in 1860, and was successfully subdivided in 1883 into a self-contained village with its own school, post office, and churches along Broad Street. The nearby Ingleside Racetrack opened in 1895 off the old Ocean Road, drawing roadhouses and gambling before an 1899 anti-betting ordinance shut the track down. After World War II, Ocean View became one of the few places in San Francisco where African-American families could buy homes, and during Western Addition redevelopment in the 1960s and 1970s many more families moved in. Residents coined the name 'OMI' — Ocean View, Merced Heights, Ingleside — in the 1960s to lobby together for city services, and the area became one of the city's earliest racially integrated communities.",
    facts: [
      { icon: "flag", title: "An early integrated community", text: "Post-WWII Ocean View was one of the few SF neighborhoods where Black families could buy property, making the OMI one of the city's earliest racially integrated areas." },
      { icon: "book", title: "City College's Ocean Campus", text: "City College of San Francisco opened in 1935 and built its 56-acre Ocean Campus just north of the neighborhood at 50 Frida Kahlo Way." },
      { icon: "road", title: "A racetrack frozen in the street grid", text: "Just west in Ingleside Terraces, Urbano Drive forms an oval traced on the loop of the 1895 Ingleside Racetrack, paved over when the residence park opened in 1912." },
      { icon: "church", title: "A 19th-century village core", text: "Ocean View functioned as its own village, with St. Michael's Church established on Broad Street in 1899 and a Congregational church there since 1895." },
      { icon: "tram", title: "Streetcars named for the area", text: "The M Ocean View streetcar line, built in 1927, and the K Ingleside both still run, terminating at Balboa Park Station." },
    ],
    nearby: ["Ingleside", "Ocean Avenue"],
    restaurants: [
      { name: "Beep's Burgers", address: "1051 Ocean Ave", phone: "(415) 584-2650", url: "https://www.beepsburgers.com" },
      { name: "Megan's Table", address: "1422 Ocean Ave", phone: "(415) 347-7044", url: "https://meganstablesf.com" },
    ],
    bars: [
      { name: "Ocean Ale House", address: "1314 Ocean Ave", phone: "(415) 988-7521", url: "https://oceanalehouse.com" },
    ],
    hospital: { name: "AHMC Seton Medical Center", address: "1900 Sullivan Ave, Daly City", dist: "about 2 mi", phone: "(650) 992-4000", url: "https://www.ahmchealth.com/smc/" },
    transit: "Muni Metro K-Ingleside runs in the median of Ocean Avenue; the M-Ocean View line runs nearby; both terminate at Balboa Park Station with BART. Buses include the 29-Sunset, 54-Felton, 8-Bayshore, and 49 Van Ness/Mission.",
  },

  "Outer Mission": {
    spirit: "A sunny, working-class stretch at the southern tip of Mission Street, where modest single-family homes back up to a lively Latino, Filipino, and Asian commercial corridor running toward the Daly City line.",
    reasons: ["Latino & Asian food corridor", "Family-friendly single-family homes", "Transit hub at Balboa Park BART", "Tucked-away Cayuga Park"],
    aka: "Cayuga Terrace",
    history: "The Outer Mission grew up in the 1910s as a southern extension of the Mission District, along the old road out of town that became Mission Street. The neighborhood's southern blocks of Mission Street follow the route of El Camino Real, the historic road linking San Francisco down the Peninsula. Once farmland that supplied the city with produce, it filled in during the early 20th century with modest single-family homes served by streetcar and Southern Pacific rail lines. Early residents were largely Irish and Italian American; by the late 20th century the area became a working-class enclave home to many Latino and Filipino/Asian families. Many of its streets carry Native American tribe names — Cayuga, Onondaga, Seneca — drawn from 1860s 'West End Homestead' maps.",
    facts: [
      { icon: "road", title: "On El Camino Real", text: "The southern blocks of Mission Street trace the historic El Camino Real, the road that once linked San Francisco's mission down the Peninsula." },
      { icon: "art", title: "Cayuga Park's carved wonderland", text: "Gardener Demetrio Braceros, a Filipino immigrant, spent 1986–2008 transforming Cayuga Playground, carving hundreds of wooden statues — the Arts Commission later counted 376." },
      { icon: "subway", title: "One of BART's busiest stops", text: "Balboa Park Station at the neighborhood's edge is the busiest BART station outside downtown San Francisco, an intermodal hub for BART, Muni Metro, and many bus lines." },
      { icon: "house", title: "A single-family enclave", text: "The district is overwhelmingly attached single-family homes, long one of the city's few remaining low-rent and middle-class residential pockets." },
      { icon: "burrito", title: "Salvadoran & Peruvian corridor", text: "The Mission Street strip is lined with pupuserias, panaderias, and Peruvian and Guatemalan kitchens rather than national chains." },
    ],
    restaurants: [
      { name: "El Porteno", address: "5173 Mission St", phone: "(415) 586-1206" },
      { name: "Reina's Restaurant", address: "5479 Mission St", phone: "(415) 585-7694", url: "https://www.reinasrestaurant.com" },
      { name: "Tikal Restaurante y Panaderia", address: "5099 Mission St", phone: "(415) 347-7125" },
    ],
    hospital: { name: "CPMC Mission Bernal Campus", address: "3555 Cesar Chavez St", dist: "about 2 mi", phone: "(415) 641-6625", url: "https://www.sutterhealth.org/cpmc" },
    transit: "Balboa Park BART and Daly City BART both sit at the neighborhood's edges. The 14-Mission and 14R-Rapid run the full length of Mission Street to Daly City BART; the 49-Van Ness/Mission serves the corridor toward City College and downtown.",
  },

  "Mission Terrace": {
    spirit: "A quiet, sunny pocket of 1920s bungalows tucked between the Excelsior and Balboa Park, in the shadow of City College.",
    reasons: ["Single-family bungalow streets", "Steps from Balboa Park BART", "City College next door", "Easy Mission St dining"],
    history: "The land was surveyed for residential development by the Baldwin & Howell Company in 1911, on former farmland once worked by Italian and French truck gardeners. Most of the homes went up in the 1920s and 1930s, when streetcar lines along the Mission corridor let working families commute without a car. The neighborhood sits just east of Balboa Park, and City College of San Francisco opened its permanent Ocean Campus on adjacent parkland on August 27, 1940. Decades later, the construction of Interstate 280 and BART's Balboa Park station reshaped the neighborhood's southern and western edges. Many of the original 1920s bungalows still stand today, largely unchanged.",
    facts: [
      { icon: "house", title: "Bungalow subdivision", text: "Surveyed by Baldwin & Howell in 1911 and built out mostly in the 1920s–30s as modest single-family bungalows." },
      { icon: "book", title: "City College next door", text: "CCSF's Ocean Campus opened on adjacent land on August 27, 1940, after a land swap with Balboa Park." },
      { icon: "subway", title: "Balboa Park BART", text: "The Balboa Park hub at 401 Geneva Ave sits at the neighborhood's edge, served by four BART lines and three Muni Metro lines." },
      { icon: "cow", title: "Truck-garden farmland", text: "Before development, the area was truck-garden farmland; early streetcars literally ran through the fields." },
      { icon: "road", title: "Reshaped by I-280", text: "Interstate 280 and BART construction in the 1960s–70s redrew the neighborhood's southern and western edges." },
    ],
    nearby: ["the Excelsior", "Balboa Park"],
    restaurants: [
      { name: "El Farolito", address: "4817 Mission St", phone: "(415) 337-5500", url: "https://elfarolitosf.com" },
      { name: "Pho Golden", address: "4683 Mission St" },
      { name: "Ocean Subs", address: "18 Ocean Ave" },
    ],
    bars: [
      { name: "The Halfway Club", address: "1166 Geneva Ave", url: "https://www.halfwayclub.com" },
      { name: "Tala Wine", address: "4625 Mission St", phone: "(415) 740-8494", url: "https://www.tala.wine" },
    ],
    hospital: { name: "CPMC Mission Bernal Campus", address: "3555 Cesar Chavez St", dist: "about 2.5 mi", phone: "(415) 600-6000", url: "https://www.sutterhealth.org/cpmc" },
    transit: "Balboa Park BART station (401 Geneva Ave) sits in the neighborhood, served by BART plus Muni Metro J, K and M lines. Muni buses include the 8, 29, 43 and 49; the 14-Mission and 14R run nearby along Mission Street in the Excelsior.",
  },

  "Crocker Amazon": {
    spirit: "A sunny, quiet pocket of single-family homes tucked into San Francisco's far southeast corner, hard against the Daly City line and the green edge of McLaren Park.",
    reasons: ["Quiet family residential", "Big playground and parks", "Among the city's sunnier corners", "Borders McLaren Park"],
    aka: "Crocker-Amazon",
    history: "The neighborhood sits on land once part of the holdings associated with railroad magnate Charles Crocker, and it takes the second half of its name from Amazon Avenue in the adjacent Excelsior. Subdivided in the early 20th century, it was built out largely with modest single-family homes through the mid-century, in a mix of Marina, Arts and Crafts, Victorian, Edwardian, and Mid-Century Modern styles. It remains slightly more affluent than the neighboring Excelsior while sharing much of that district's diversity, including a large Filipino community. The large Crocker Amazon Playground borders the neighborhood to the north, and John McLaren Park, the city's third-largest park, sits just to the east.",
    facts: [
      { icon: "park", title: "Crocker Amazon Playground", text: "A sprawling sports complex at Moscow St and Geneva Ave with five full-size lighted soccer fields, plus baseball, tennis, basketball, and bocce courts." },
      { icon: "money", title: "Named for a railroad baron", text: "The 'Crocker' honors land once tied to Central Pacific Railroad magnate Charles Crocker; 'Amazon' comes from nearby Amazon Avenue." },
      { icon: "house", title: "Homes with elbow room", text: "Unusually for San Francisco, many houses here sit on lots with roughly ten feet of space on either side rather than wall-to-wall." },
      { icon: "sun", title: "A sunnier corner", text: "Set in the city's southeast, the neighborhood tends to escape the heaviest coastal fog." },
      { icon: "park", title: "Next to McLaren Park", text: "John McLaren Park, the city's third-largest park after Golden Gate and the Presidio, sits just east with trails, lakes, and the Jerry Garcia Amphitheater." },
    ],
    nearby: ["the Excelsior"],
    restaurants: [
      { name: "El Farolito", address: "4817 Mission St", phone: "(415) 337-5500", url: "https://elfarolitosf.com" },
      { name: "Calabria Brothers", address: "4763 Mission St", phone: "(415) 239-2555", url: "https://calabriabrosdeli.com" },
      { name: "Restaurante Familiar", address: "4499 Mission St", phone: "(415) 334-6100" },
    ],
    hospital: { name: "AHMC Seton Medical Center", address: "1900 Sullivan Ave, Daly City", dist: "about 1.5 mi", phone: "(650) 992-4000", url: "https://www.ahmchealth.com/smc/" },
    transit: "Muni buses 8-Bayshore, 14-Mission/14R, 52-Excelsior, and 54-Felton serve the area along Mission St and Geneva Ave; Balboa Park BART and the Muni Metro are a short ride northwest.",
  },

  "Miraloma Park": {
    spirit: "A quiet, leafy hillside enclave on the southern slopes of Mount Davidson, where curving streets, mid-century homes, woodsy calm, and sweeping views meet one of the city's most active neighborhood associations.",
    reasons: ["Woodsy hillside calm", "Big ridge-top views", "Strong neighborhood club", "Steps from Mount Davidson"],
    history: "Miraloma Park was laid out from 1926 through the 1950s, developed largely by the Meyer Brothers, who assembled land from the Sutro estate, Wells Fargo & Company, and other owners. They marketed it as a 'City in Itself,' a suburban home center of mostly one-story-over-garage houses on curving streets that follow the hill's contours in the City Beautiful tradition. Roughly 2,400 single-family homes were built, many on the lower slopes of Mount Davidson, whose summit had been preserved as a public park in 1929. Residents organized the Miraloma Park Improvement Club, whose first meeting was held in 1930 and which incorporated in 1936. The developer built and donated a clubhouse on Del Vale Avenue, dedicated November 10, 1940, and the club remains vigorous today.",
    facts: [
      { icon: "park", title: "San Francisco's highest peak", text: "Mount Davidson rises 928 feet, the highest natural point in the city, and its summit and slopes form Mount Davidson Park." },
      { icon: "church", title: "The summit cross", text: "A 103-foot concrete cross, dedicated in 1934, stands atop Mount Davidson and has been a landmark of the city's skyline for generations." },
      { icon: "house", title: "A planned hillside subdivision", text: "Roughly 2,400 mostly single-family homes were built from the late 1920s on, on curving streets that follow the hill's contours in the City Beautiful style." },
      { icon: "flag", title: "An old, active improvement club", text: "The Miraloma Park Improvement Club traces its first meeting to 1930 and meets in a clubhouse donated by the developer and dedicated in 1940." },
      { icon: "tram", title: "Residents won their bus line", text: "Early club efforts brought transit to the hill; Mayor Rossi piloted the first 36 bus from Forest Hill Station on July 23, 1939." },
    ],
    nearby: ["Glen Park", "West Portal"],
    restaurants: [
      { name: "Gialina Pizzeria", address: "2842 Diamond St (Glen Park)", phone: "(415) 239-8500", url: "https://www.gialina.com" },
      { name: "La Corneta Taqueria", address: "2834 Diamond St (Glen Park)", phone: "(415) 469-8757", url: "https://lacorneta.com" },
      { name: "Bursa Mediterranean Cuisine", address: "60 West Portal Ave (West Portal)", phone: "(415) 564-4006", url: "https://bursasf.com" },
      { name: "Goat Hill Pizza - West Portal", address: "170 W Portal Ave (West Portal)", phone: "(415) 242-4628", url: "https://www.goathillpizza.com" },
    ],
    bars: [
      { name: "Glen Park Station", address: "2816 Diamond St (Glen Park)", phone: "(415) 333-4633" },
    ],
    hospital: { name: "CPMC Mission Bernal Campus", address: "3555 Cesar Chavez St", dist: "about 2.5 mi", phone: "(415) 600-6000", url: "https://www.sutterhealth.org/cpmc" },
    transit: "Muni 36-Teresita winds through the neighborhood; the 44-O'Shaughnessy runs along O'Shaughnessy Boulevard nearby, and the 43-Masonic serves the western edge. Glen Park BART and the Forest Hill Muni Metro station are each a short ride away.",
  },

  "Golden Gate Heights": {
    spirit: "A hushed, hilltop maze of winding streets and artful stairways crowned by some of the city's most sweeping ocean-to-bay views.",
    reasons: ["Hilltop park panoramas", "Famous tiled staircases", "Quiet residential streets", "Steps from the Inner Sunset"],
    history: "Once part of the windswept Outside Lands dunes west of downtown, the hills here were graded and laced with stairways around 1927 and built out as a residential district through the 1910s to 1950s. The neighborhood wraps around a chain of rocky peaks, including Grand View Park atop 'Turtle Hill,' which looks out over the Pacific, Golden Gate Park, the Marin Headlands and the Financial District. In 2003, residents Jessie Audette and Alice Yee Xavier launched a community project to beautify the 16th Avenue stairway; artists Aileen Barr and Colette Crutcher designed 163 mosaic panels, and the now-famous Tiled Steps opened on August 27, 2005. The nearby Hidden Garden Steps on 16th Avenue followed as a second community mosaic stairway.",
    facts: [
      { icon: "stairs", title: "The 16th Avenue Tiled Steps", text: "163 mosaic panels climb sea-to-stars to the base of Grandview Park; opened in 2005." },
      { icon: "park", title: "Grand View Park", text: "Atop 'Turtle Hill,' it offers panoramas of the ocean, Golden Gate Park and the bay." },
      { icon: "art", title: "A second mosaic stairway", text: "The Hidden Garden Steps add another community-built tiled climb nearby." },
      { icon: "house", title: "Built on the old dunes", text: "Streets were graded and stairways built around 1927 on the former Outside Lands sand hills." },
    ],
    nearby: ["the Inner Sunset"],
    restaurants: [
      { name: "San Tung", address: "1031 Irving St", phone: "(415) 242-0828", url: "https://www.santungsf.com" },
      { name: "Ebisu", address: "1283 9th Ave", phone: "(415) 566-1770", url: "https://ebisusushi.com" },
      { name: "Marnee Thai", address: "2225 Irving St", phone: "(415) 665-9500" },
    ],
    bars: [
      { name: "The Little Shamrock", address: "807 Lincoln Way", phone: "(415) 661-0060" },
      { name: "Tartine Inner Sunset", address: "1226 9th Ave", phone: "(415) 742-5005", url: "https://tartinebakery.com" },
    ],
    hospital: { name: "UCSF Medical Center at Parnassus", address: "505 Parnassus Ave", dist: "about 1 mi", phone: "(415) 476-1000", url: "https://www.ucsfhealth.org/locations/parnassus-campus" },
    transit: "N-Judah Muni Metro a walk downhill along Irving/Judah; buses 6, 7, 43, 44 and 66 serve the surrounding slopes.",
  },

  "Midtown Terrace": {
    spirit: "A quiet 1950s hilltop tract of near-identical view homes spread across the western slope of Twin Peaks, directly beneath the soaring Sutro Tower.",
    reasons: ["Sweeping westside and ocean views", "Peaceful residential streets", "Under the iconic Sutro Tower", "Minutes from Twin Peaks and Forest Hill Station"],
    history: "The neighborhood rose on 150 acres of the old Rancho San Miguel land that Adolph Sutro later planted with eucalyptus. Beginning in 1953, the Standard Building Company, owned by brothers Carl and Fred Gellert, developed roughly 1,000 modest two- and three-bedroom single-family homes across seven terraced streets engineered to capture the view. By February 1959 about 900 of the planned homes were complete, with a covered Sutro Reservoir and a playground built into the tract. Since 1973 the 977-foot Sutro Tower has loomed directly over the rooftops, becoming the neighborhood's defining landmark.",
    facts: [
      { icon: "tower", title: "Sutro Tower overhead", text: "The 977-foot Sutro Tower, completed in 1973 with first transmissions on July 4 of that year, rises on the ridge directly above the neighborhood." },
      { icon: "house", title: "A mid-century tract", text: "Beginning in 1953 the Gellert brothers' Standard Building Company built roughly 1,000 near-uniform single-family homes terraced across the hillside for their views." },
      { icon: "water", title: "Built atop a reservoir", text: "A covered Sutro Reservoir was incorporated into the tract, with the Midtown Terrace Playground built nearby." },
      { icon: "park", title: "Beneath Twin Peaks", text: "The homes climb the western slope just below Twin Peaks, one of the highest points in San Francisco." },
    ],
    nearby: ["West Portal"],
    restaurants: [
      { name: "Trattoria da Vittorio", address: "150 West Portal Ave", phone: "(415) 742-0300", url: "https://www.trattoriadavittorio.com" },
      { name: "Spiazzo Ristorante", address: "33 West Portal Ave", url: "https://www.spiazzoristorante.com" },
    ],
    bars: [
      { name: "The Dubliner", address: "328 West Portal Ave", phone: "(415) 566-9444", url: "https://dublinerwp.com" },
    ],
    hospital: { name: "UCSF Medical Center at Parnassus", address: "505 Parnassus Ave", dist: "about 2 mi", phone: "(415) 353-1008", url: "https://www.ucsfhealth.org/locations/emergency-department-er-parnassus" },
    transit: "Forest Hill Station, on the Twin Peaks Tunnel, serves Muni Metro K, L, M and S lines. The 36-Teresita bus climbs into Midtown Terrace itself via Panorama Drive and Olympia Way; the 37-Corbett serves the Twin Peaks side of the hill.",
  },

  "Mt. Davidson Manor": {
    spirit: "A quiet 1920s tract of tile-roofed single-family homes tucked below Mount Davidson, San Francisco's highest peak.",
    reasons: ["Calm, well-kept residential streets", "Steps from Mount Davidson Park's trails", "Walkable to West Portal's shops", "Muni Metro and bus lines close by"],
    history: "Mt. Davidson Manor was developed beginning in 1923 by Fernando Nelson, one of San Francisco's most prolific homebuilders, who bought roughly 50 acres and filled the blocks with affordable single-family homes in a Spanish-Mediterranean style with tile roofs. It is one of the residence-park-adjacent tracts west of Twin Peaks, sitting between Westwood Park and Balboa Terrace near St. Francis Wood. The neighborhood takes its name from Mount Davidson, which rises just to the northeast and, at 928 feet, is the highest natural point in the city. In 1929 the city acquired about 20 acres at the summit for a public park. A 103-foot concrete cross was erected at the peak in 1934 and remains a landmark visible across the southern city.",
    facts: [
      { icon: "tower", title: "City's highest peak", text: "Mount Davidson rises 928 feet, the highest natural point in San Francisco." },
      { icon: "church", title: "Summit cross", text: "A 103-foot concrete cross was built atop Mount Davidson in 1934." },
      { icon: "park", title: "Park since 1929", text: "About 20 acres at the summit were set aside as city parkland in 1929." },
      { icon: "house", title: "Fernando Nelson homes", text: "The tract was built from 1923 by Fernando Nelson, who constructed thousands of SF homes." },
      { icon: "movie", title: "Big-screen cameo", text: "The summit cross appears in the climactic scene of the 1971 film Dirty Harry." },
    ],
    nearby: ["West Portal", "Ingleside"],
    restaurants: [
      { name: "Spiazzo Ristorante", address: "33 W Portal Ave", phone: "(415) 664-9511", url: "https://www.spiazzoristorante.com" },
      { name: "Trattoria da Vittorio", address: "150 W Portal Ave", phone: "(415) 742-0300", url: "https://www.trattoriadavittorio.com" },
      { name: "Beep's Burgers", address: "1051 Ocean Ave", phone: "(415) 584-2650", url: "https://www.beepsburgers.com" },
    ],
    bars: [
      { name: "The Dubliner", address: "328 W Portal Ave", phone: "(415) 566-9444", url: "https://dublinerwp.com" },
    ],
    hospital: { name: "UCSF Medical Center at Parnassus", address: "505 Parnassus Ave", dist: "about 3 mi", phone: "(415) 476-1000", url: "https://www.ucsfhealth.org/locations/parnassus-campus" },
    transit: "K-Ingleside and M-Ocean View Muni Metro lines run nearby along Ocean Ave and Junipero Serra; buses 23-Monterey, 36-Teresita, 43-Masonic and 44-O'Shaughnessy serve the area. West Portal Station is a short ride away.",
  },

  "Sherwood Forest": {
    spirit: "A tiny, leafy enclave of custom homes on Mount Davidson's southern slope, named for Robin Hood and prized for its hush and its big-sky views.",
    reasons: ["One of the city's quietest pockets", "Big westside and bay views", "Steps from Mount Davidson Park", "A short ride to West Portal"],
    history: "Sherwood Forest is a mid-20th-century subdivision laid out across the wooded southern and western slopes of Mount Davidson, San Francisco's highest natural hill. Its developers gave the winding streets a Robin Hood theme, with names like Robinhood Drive, Sherwood Court, Dalewood Way, Lansdale Avenue and Idora Avenue. The homes are large single-family residences, some dating to the 1930s, set among the eucalyptus that Adolph Sutro planted decades earlier. The neighborhood sits just below Mount Davidson Park, whose 20 hilltop acres the city acquired as parkland in 1929. Robinhood Drive is often cited as the highest residential street in San Francisco.",
    facts: [
      { icon: "house", title: "Robin Hood streets", text: "Streets carry a Sherwood theme, including Robinhood Drive, Sherwood Court, Dalewood Way, Lansdale Avenue and Idora Avenue." },
      { icon: "tower", title: "City's highest hill", text: "Mount Davidson rises 928 feet, the highest natural point in San Francisco, crowned by a 103-foot concrete cross." },
      { icon: "park", title: "Mount Davidson Park", text: "The city bought 20 acres atop the hill for parkland in 1929; its trails wind just above the neighborhood." },
      { icon: "stairs", title: "Highest homes in the city", text: "Robinhood Drive is frequently described as the highest residential street in San Francisco." },
      { icon: "tram", title: "Highest bus stop in town", text: "The 36-Teresita climbs through the neighborhood to Myra at Dalewood, the highest Muni bus stop in San Francisco." },
    ],
    nearby: ["West Portal"],
    restaurants: [
      { name: "Trattoria da Vittorio", address: "150 W Portal Ave", phone: "(415) 742-0300", url: "https://www.trattoriadavittorio.com" },
      { name: "Bursa", address: "60 W Portal Ave", phone: "(415) 564-4006", url: "https://bursasf.com" },
    ],
    bars: [
      { name: "Philosopher's Club", address: "824 Ulloa St", phone: "(415) 753-0599" },
    ],
    hospital: { name: "UCSF Medical Center at Parnassus", address: "505 Parnassus Ave", dist: "about 3 mi", phone: "(415) 476-1000", url: "https://www.ucsfhealth.org/locations/parnassus-campus" },
    transit: "The 36-Teresita runs through the neighborhood (including the Myra at Dalewood stop near Mount Davidson); the 44-O'Shaughnessy passes nearby. West Portal Station, a ride away, serves Muni Metro K, L and M.",
  },

  "Forest Knolls": {
    spirit: "A quiet, woodsy 1960s hillside enclave of mid-century modern homes wrapped in the eucalyptus of Mount Sutro's cloud-like fog.",
    reasons: ["Tucked into the Mount Sutro forest", "Winding, low-traffic streets", "Mid-century modern architecture", "Steps from UCSF and Cole Valley"],
    history: "Forest Knolls sits on the western slopes of Mount Sutro and was built out between roughly 1959 and 1963 as a subdivision of single-family homes, many in the mid-century modern style with the living areas upstairs over a ground-floor garage. The hillside above it is the Mount Sutro Open Space Reserve, a forest that traces back to Adolph Sutro, who bought hundreds of acres west of Twin Peaks in 1880. Beginning around San Francisco's first Arbor Day in 1886, Sutro planted the slopes with blue gum eucalyptus, Monterey pine and Monterey cypress, creating the woods that still shade the neighborhood. The reserve is now owned and managed by UC San Francisco, whose Parnassus campus sits just over the hill.",
    facts: [
      { icon: "park", title: "Mount Sutro forest", text: "The neighborhood wraps around the Mount Sutro Open Space Reserve, a roughly 61-acre eucalyptus forest crisscrossed with trails." },
      { icon: "park", title: "Sutro's trees", text: "Adolph Sutro planted the hillside with blue gum eucalyptus, Monterey pine and Monterey cypress starting around 1886." },
      { icon: "house", title: "Mid-century modern", text: "Most homes were built between about 1959 and 1963, many with sleek mid-century facades and living space stacked over a garage." },
      { icon: "sun", title: "Foggy and green", text: "Fog drifting through the dense canopy gives the slopes a cloud-forest feel even in summer." },
    ],
    nearby: ["the Inner Sunset", "Cole Valley"],
    restaurants: [
      { name: "Marnee Thai", address: "1243 9th Ave", phone: "(415) 731-9999", url: "https://www.marneethaisf.com" },
      { name: "San Tung", address: "1031 Irving St", phone: "(415) 242-0828", url: "https://www.santungsf.com" },
      { name: "Zazie", address: "941 Cole St", phone: "(415) 564-5332", url: "https://www.zaziesf.com" },
    ],
    bars: [
      { name: "InoVino", address: "108B Carl St", phone: "(415) 681-3770", url: "https://inovinosanfrancisco.com" },
      { name: "Cole Valley Tavern", address: "900 Cole St", url: "https://www.colevalleytavern.com" },
    ],
    hospital: { name: "UCSF Medical Center at Parnassus", address: "400 Parnassus Ave", dist: "about 0.7 mi", phone: "(415) 476-1000", url: "https://www.ucsfhealth.org/locations/parnassus-campus" },
    transit: "The 36-Teresita bus climbs the hill and connects to Forest Hill Station; the 43-Masonic runs nearby. Downhill, the N-Judah Muni Metro and Forest Hill Station reach downtown.",
  },

  "Westwood Park": {
    spirit: "A serene 1916 residence park of craftsman bungalows curling along oval streets just south of City College.",
    reasons: ["Historic 1916 residence-park planning", "Distinctive curving oval streets", "Quiet single-family bungalow blocks", "Transit-rich edge on Ocean Avenue"],
    history: "Westwood Park was developed in 1916 by the prominent San Francisco real estate firm Baldwin & Howell on roughly ninety acres of former Sutro land near the old Ingleside Racetrack area, marketed as a 'residence park' for families of average means. The firm laid out a signature plan of curving, concentric oval streets, bisected by Miramar Avenue, with nearly every street avoiding a straight line. More than 650 craftsman- and Mediterranean-style bungalows were built, the majority in the 1920s, many designed by architects Charles F. Strothoff and Ida F. McCain. Residents formed the Westwood Park Association on March 22, 1917, and the neighborhood remains governed by single-family deed restrictions. Architect Louis Christian Mullgardt designed the brick entrance gateways and pillars, now City Landmark No. 314.",
    facts: [
      { icon: "house", title: "650+ bungalows", text: "More than 650 craftsman and Mediterranean bungalows, most built in the 1920s." },
      { icon: "road", title: "Oval street plan", text: "Curving, concentric oval streets bisected by Miramar Avenue, with almost no straight street." },
      { icon: "star", title: "City Landmark No. 314", text: "The 1916 Mullgardt-designed gateway pillars were designated a San Francisco landmark in 2024." },
      { icon: "flag", title: "Born 1916", text: "Opened by Baldwin & Howell in 1916 as a planned 'residence park' near the old Ingleside Racetrack land." },
      { icon: "house", title: "Westwood Park Association", text: "Residents organized the Westwood Park Association on March 22, 1917, still active today." },
    ],
    nearby: ["the Ocean Avenue strip"],
    restaurants: [
      { name: "Beep's Burgers", address: "1051 Ocean Ave", phone: "(415) 584-2650", url: "https://www.beepsburgers.com" },
      { name: "Sakesan Sushi & Robata", address: "1400 Ocean Ave" },
    ],
    bars: [
      { name: "Ocean Ale House", address: "1314 Ocean Ave", phone: "(415) 988-7521", url: "https://oceanalehouse.com" },
    ],
    hospital: { name: "UCSF Health Stanyan Hospital (formerly St. Mary's)", address: "450 Stanyan St", dist: "about 3 mi", phone: "(415) 668-1000", url: "https://sfcommunityhospitals.ucsfhealth.org/st-marys" },
    transit: "K-Ingleside Muni Metro runs along Ocean Avenue to Balboa Park Station; Balboa Park BART is nearby. Muni buses include the 29, 43 and 49.",
  },

  "Westwood Highlands": {
    spirit: "A hushed, hilly tract of period-revival homes curving along the southern slopes of Mount Davidson, the city's highest peak.",
    reasons: ["Quiet single-family streets", "Steps from Mount Davidson Park", "Minutes to West Portal and Ocean Ave", "Curving hillside street plan"],
    history: "Westwood Highlands was laid out in the 1920s as one of San Francisco's early 'residence parks' on the southern slope of Mount Davidson, the city's highest natural point. The 283 custom-built homes of the original tract were constructed from 1924 to 1929 under the realtors Baldwin and Howell. Rather than follow the city's grid, the developers used curvilinear streets that fit the steep terrain, with detached single-family houses, rear garages, and utility poles set behind the homes. Each house was given a different architectural design from its neighbor, ranging from English cottages to Spanish-influenced stuccoed homes. It was among the first residential communities in the United States to adopt a shared set of covenants and restrictions.",
    facts: [
      { icon: "tower", title: "Below the city's high point", text: "The neighborhood climbs the southern slope of Mount Davidson, at 928 feet the highest natural point in San Francisco, crowned by a 103-foot concrete cross." },
      { icon: "park", title: "Mount Davidson Park", text: "Roughly 40 acres of wooded open space and trails sit at the top of the hill, just northeast of the neighborhood." },
      { icon: "house", title: "283 custom homes", text: "The original tract was built out from 1924 to 1929, each home given a different architectural design from its neighbor." },
      { icon: "road", title: "Curving by design", text: "Streets were laid out as curvilinear routes to fit the steep terrain, a deliberate break from San Francisco's grid." },
      { icon: "star", title: "Active neighborhood association", text: "The Westwood Highlands Association represents homeowners and is a member of the West of Twin Peaks Central Council." },
    ],
    nearby: ["West Portal", "Ingleside", "Sunnyside"],
    restaurants: [
      { name: "Elena's Mexican Restaurant", address: "255 West Portal Ave", phone: "(415) 622-4440", url: "https://www.elenasmexican.com" },
      { name: "Sakesan Sushi & Robata", address: "1400 Ocean Ave", phone: "(415) 347-7898" },
    ],
    bars: [
      { name: "The Dubliner", address: "328 West Portal Ave", phone: "(415) 566-9444", url: "https://dublinerwp.com" },
      { name: "Friends Bar", address: "558 Monterey Blvd", phone: "(415) 999-1338" },
    ],
    hospital: { name: "UCSF Health Stanyan Hospital (formerly St. Mary's)", address: "450 Stanyan St", dist: "about 3 mi", phone: "(415) 668-1000", url: "https://sfcommunityhospitals.ucsfhealth.org/st-marys" },
    transit: "Muni buses 36-Teresita and 43-Masonic serve the hillside; the K-Ingleside Muni Metro line runs along nearby Ocean Avenue (Ocean & Lee stop). Glen Park and Balboa Park BART stations are a short ride away.",
  },

  "Merced Manor": {
    spirit: "A hushed pocket of 1930s storybook homes tucked between Stern Grove and Lake Merced in San Francisco's quiet southwest.",
    reasons: ["Quiet, tree-lined streets", "Steps from Stern Grove's free summer concerts", "Walkable to West Portal", "Easy Muni Metro and 19th Ave access"],
    history: "Merced Manor was laid out as a residential subdivision in the 1930s on former Rancho Laguna de la Merced lands near Lake Merced, on terrain that had once been windswept coastal sand dunes. The tract filled in with the Spanish- and Mediterranean-influenced single-family homes that still define it today. Its signature landmark is the Merced Manor Reservoir, a covered 9.6-million-gallon SFPUC facility along Sloat Boulevard, fronted by a classical valve house. Just to the north lies Sigmund Stern Grove, the eucalyptus-and-redwood canyon that has hosted the free Stern Grove Festival concerts since 1938.",
    facts: [
      { icon: "music", title: "Free summer concerts", text: "Sigmund Stern Grove, just north of the neighborhood, has hosted the free Stern Grove Festival concert series since 1938." },
      { icon: "water", title: "The reservoir at the edge", text: "The Merced Manor Reservoir, a covered 9.6-million-gallon SFPUC facility with a classical valve house, sits along Sloat Boulevard at the neighborhood's northern edge." },
      { icon: "house", title: "1930s storybook tract", text: "The neighborhood was subdivided in the 1930s and is filled with Spanish- and Mediterranean-style single-family homes from that era." },
      { icon: "wave", title: "Beside Lake Merced", text: "Built on former Rancho Laguna de la Merced lands, the tract sits just east of Lake Merced and its surrounding parkland and trails." },
    ],
    nearby: ["West Portal"],
    restaurants: [
      { name: "Trattoria da Vittorio", address: "150 West Portal Ave", phone: "(415) 742-0300", url: "https://www.trattoriadavittorio.com" },
      { name: "Little Original Joe's", address: "393 West Portal Ave", phone: "(415) 759-1155", url: "https://www.littleoriginaljoes.com" },
    ],
    bars: [
      { name: "The Dubliner", address: "328 West Portal Ave", phone: "(415) 566-9444", url: "https://dublinerwp.com" },
    ],
    hospital: { name: "UCSF Medical Center at Parnassus", address: "505 Parnassus Ave", dist: "about 3.5 mi", phone: "(415) 353-1008", url: "https://www.ucsfhealth.org/locations/emergency-department-er-parnassus" },
    transit: "Muni Metro K-Ingleside and M-Ocean View run nearby along 19th Avenue and St. Francis Circle, with West Portal Station a short ride away. Buses include the 28-19th Avenue, 17, 23 and 57.",
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

// Alphabetical index of authored neighborhoods for the A–Z list on the page.
// `key` is the fog geojson `name` (what the map/lookup uses); `label` is the
// display name (the `title` override when present, e.g. "Cow Hollow / Union
// Street").
export function listNeighborhoods() {
  return Object.entries(NEIGHBORHOODS)
    .map(([key, v]) => ({ key, label: v.title || key }))
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }));
}
