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
};

// Look up curated content for a neighborhood name (exact match on the fog
// geojson `name`). Returns null when we haven't authored that one yet.
export function getNeighborhood(name) {
  if (!name) return null;
  return NEIGHBORHOODS[name] || null;
}
