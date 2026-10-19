// Per-neighborhood editorial content for the "neighborhood highlights"
// pop-up (opened from the Neighborhood name on the fog/neighborhoods card).
//
// Only the editorial/curated fields live here — the home-price figure and
// the microclimate line are computed live (from the listings data and the
// picked fog contour), so they're never stored stale.
//
// Schema per entry:
//   title       string?  header override when one entry covers two fog
//                        polygons that share a story (none do today);
//                        defaults to the clicked polygon name
//   spirit      string   one creative line capturing the neighborhood
//   reasons     string[] short "why live here" chips
//   aka         string?  alternate / historic name shown as a chip
//   history     string   section 1 — name origin + settlement history;
//                        paragraphs separated by a blank line ("\n\n")
//   facts       [{ icon, title, text, place?, where?, at?, source? }]
//                        section 2, "Did You Know?" — lesser-known facts.
//                        A fact with `at` ([lng, lat]) is a stop on the
//                        walking tour, numbered in the order listed, so list
//                        located facts in walking order. `place` names the
//                        spot, `where` its address or corner, `source` the
//                        page it was checked against (not shown).
//   walk        { intro, miles, minutes, tip }?   the walking tour's
//                        description; miles/minutes stand in until the
//                        street route is measured in the browser
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
    history:
      "Castro Street honors José Castro (1808–1860), the Californio general who was briefly acting governor of Mexican Alta California. The valley it crosses was part of Rancho San Miguel, granted in 1845 to José de Jesús Noé, Yerba Buena's last Mexican alcalde. Transit built the neighborhood: in the late 1880s a cable line ran out Market Street and over the hill on Castro to 26th Street (its Castro hill section ran until 1941), and Irish, German and Scandinavian families filled “Eureka Valley” with cottages and flats that came through the 1906 earthquake and fire largely intact. In 1918 the Twin Peaks Tunnel opened, its east portal at Market and Castro, beside today's Castro Station.\n\nBy the late 1960s families were leaving for the suburbs, and inexpensive Victorians drew gay men, many from Polk Street and the Tenderloin. They restored the houses and opened bars and shops, and the blocks around Castro and 18th took the street's name. When the old Eureka Valley merchants' group snubbed gay-owned businesses, camera-shop owner Harvey Milk became first president of the new Castro Village Association and, in 1974, started the Castro Street Fair; in 1977 he became the first openly gay man elected to office in California. After his assassination in 1978, the manslaughter verdict for his killer set off the White Night riots, and police struck back by raiding the Elephant Walk bar at 18th and Castro.\n\nWhen AIDS devastated the neighborhood in the 1980s, it built much of its own response: a parish support group and hospice, a Zen center that took in the dying, and the NAMES Project, which assembled the AIDS Memorial Quilt in a storefront at 2362 Market Street.",
    facts: [
      {
        icon: "flag",
        title: "The flag is a city landmark",
        text:
          "The 20-by-30-foot rainbow flag over Harvey Milk Plaza first went up on November 8, 1997, the 20th anniversary of Milk's election, and in 2024 the city made it a landmark; planners call it the only permanent Rainbow Flag installation by the flag's creator, Gilbert Baker. Across Market Street, Pink Triangle Park's 15 granite pylons, each topped with a pink triangle, form what its founders call the first permanent, free-standing U.S. memorial to LGBT people persecuted by the Nazis.",
        place: "Harvey Milk Plaza & Pink Triangle Park",
        where: "Castro St & Market St",
        at: [-122.43518, 37.76267],
        source: "https://sfplanning.org/sites/default/files/documents/preserv/landmarks_designation/LM319.pdf",
      },
      {
        icon: "movie",
        title: "A 1922 movie palace, reborn",
        text:
          "The Nasser family's 1922 movie palace was designed by Timothy Pflueger, later the architect of Oakland's Paramount Theatre, and became city Landmark No. 100 in 1977. It reopened on February 6, 2026, after a two-year, roughly $41 million renovation that traded the orchestra's fixed rows for tiered platforms with removable seats, while a section of cast-iron balcony seats the city deemed historic stays put.",
        place: "Castro Theatre",
        where: "429 Castro St",
        at: [-122.43483, 37.76192],
        source: "https://sfstandard.com/2026/02/05/castro-theatre-reopens-renovation/",
      },
      {
        icon: "shop",
        title: "Where Castro Halloween began",
        text:
          "Cliff's Variety, on Castro Street since 1936 and at this address since 1971, fills the building where the first Castro Theatre opened in 1910. In the late 1940s the founder's son, Ernie DeBaca, started a children's Halloween costume contest out front, the seed of Halloween in the Castro; the store ended the contest in 1979 as adult crowds took over.",
        place: "Cliff's Variety",
        where: "479 Castro St",
        at: [-122.43476, 37.76113],
        source: "https://en.wikipedia.org/wiki/Cliff%27s_Variety_Store",
      },
      {
        icon: "sun",
        title: "The corner called Hibernia Beach",
        text:
          "The sunny corner outside the old Hibernia Bank branch here picked up the nickname “Hibernia Beach” in the 1970s, and by the early 1980s it was packed with shirtless men on warm afternoons. As AIDS spread, its wall and railing became a folk memorial for the dead, and when the bank posted signs banning memorials in 2021, a backlash got them taken down within days. The rainbow crosswalks went in in 2014, their design picked in a vote of about 4,500 people.",
        place: "Hibernia Beach",
        where: "Castro St & 18th St",
        at: [-122.43499, 37.76088],
        source: "https://www.ebar.com/story/20838",
      },
      {
        icon: "mayor",
        title: "Landmarked on Milk's 70th birthday",
        text:
          "Harvey Milk ran his camera store and his campaigns for office from 573–575 Castro Street, and lived in the flat upstairs. Supervisors gave final approval to making it city Landmark No. 227 on May 22, 2000, which would have been his 70th birthday. On 19th Street just before it, look down: the bronze Rainbow Honor Walk plaques honoring LGBTQ figures began going into these sidewalks in 2014.",
        place: "Castro Camera",
        where: "575 Castro St",
        at: [-122.43463, 37.75962],
        source: "https://www.sfbos.org/ftp/uploadedfiles/bdsupvrs/ordinances00/o0121-00.pdf",
      },
      {
        icon: "house",
        title: "A Zen temple's AIDS hospice",
        text:
          "A Gay Buddhist Club met in the basement of this Victorian, which became the Hartford Street Zen Center in 1981. In 1987 its teacher, Issan Dorsey, took in a homeless student dying of AIDS, starting Maitri, described as the first Buddhist hospice of its kind in the U.S.; it outgrew the house and moved to Church and Duboce in 1997.",
        place: "Hartford Street Zen Center",
        where: "57 Hartford St",
        at: [-122.43365, 37.76165],
        source: "https://en.wikipedia.org/wiki/Hartford_Street_Zen_Center",
      },
      {
        icon: "beer",
        title: "Landmarked for its windows",
        text:
          "Twin Peaks Tavern opened in 1935 as a neighborhood bar. In the early 1970s new owners Mary Ellen Cunha and Peggy Forster made it a gay bar and uncovered its windows, which the city's landmark report says made it the first known gay bar with full-length, open plate-glass windows. In 2013 the city named it Landmark No. 264.",
        place: "Twin Peaks Tavern",
        where: "401 Castro St",
        at: [-122.43487, 37.76236],
        source: "https://default.sfplanning.org/Preservation/landmarks_designation/Adopted_TwinPeaksLM_Report.pdf",
      },
    ],
    walk: {
      intro:
        "A short loop for first-time visitors and would-be neighbors that starts and ends at Castro Station (Muni Metro K, L and M; the F streetcar ends a few steps away), taking in the Castro Street shopping blocks and the quiet Victorian blocks of 19th and Hartford streets. Allow about 40 minutes; a weekday late morning is calmest, a weekend afternoon is liveliest.",
      miles: 0.7,
      minutes: 40,
      tip:
        "Half a block west of 18th & Castro, stop into the GLBT Historical Society Museum at 4127 18th St, opened in January 2011 and billed as the nation's first stand-alone museum of LGBTQ history. The city has bought 2280 Market St as its larger future home, so check its location and hours before you go.",
    },
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
      "Noe Valley takes its name from José de Jesús Noé, Yerba Buena's last Mexican alcalde, who in 1845 received Rancho San Miguel: 4,443 acres that also took in today's Eureka Valley and reached west over what is now Mount Davidson. In the early 1850s Noé sold this valley to John M. Horner, a New Jersey native who had sailed into Yerba Buena in 1846 aboard the ship Brooklyn with Sam Brannan's company of Mormons. Horner cut the land into blocks and lots as Horner's Addition and named its streets, among them Elizabeth, for his wife, and Jersey, for his home state. He died in Hawaii in 1907, but the city assessor still calls the area Horner's Addition.\n\nIn 1887 the Market Street Cable Railway opened a branch up Castro Street, and through the 1880s and 1890s builders filled the slopes with Victorian cottages and flats for working-class San Franciscans. The fires that followed the 1906 earthquake never reached the valley, and much of the valley was built up just afterward. In August 1917 the city's Municipal Railway opened the J-Church streetcar line, with Mayor James Rolph at the controls of the first car; for about eight decades its cars turned back at Church and 30th streets.\n\nIn the spring of 1977, a group of friends who drank at Finnegan's Wake, a 24th Street bar, started the Noe Valley Voice; nine people chipped in to pay for the first issue, eight typewritten tabloid pages, that May. The paper is still published, and the valley's streets are still lined with the Victorian and Edwardian houses that went up around the turn of the 20th century.",
    facts: [
      {
        icon: "church",
        title: "A Carpenter Gothic church from 1888",
        text:
          "Charles Geddes designed this steep-gabled wooden church, built in 1888 for a congregation that had taken the name Lebanon Presbyterian Church in 1884. In 1891 the building was raised and a new ground floor, designed by William Curlett, went in beneath it; the Victorian Alliance counts it among the few wood-framed churches to come through 1906. Now the Noe Valley Ministry, it is in line to be a city landmark: in 2026 supervisors began the designation, calling it an early and rare example of Carpenter Gothic in San Francisco, with its pointed windows, tower and scroll-sawn trim.",
        place: "Noe Valley Ministry",
        where: "1021 Sanchez St",
        at: [-122.42958, 37.75281],
        source: "https://www.sfbos.org/sites/default/files/r0111-26.pdf",
      },
      {
        icon: "park",
        title: "The church parking lot that became a park",
        text:
          "This lot was a gas station, then the Noe Valley Ministry's parking lot, and it first came alive as a public space with a weekly farmers' market. Neighbors raised $470,000 toward buying it, the church sold it to the city's Recreation and Park Department in June 2013 for $4.2 million, and Noe Valley Town Square opened on October 27, 2016. The farmers' market still sets up here on Saturday mornings, year-round.",
        place: "Noe Valley Town Square",
        where: "3861 24th St",
        at: [-122.42874, 37.75141],
        source: "https://sfrecpark.org/1685/Noe-Valley-Town-Square",
      },
      {
        icon: "book",
        title: "The library a neighbor kept open",
        text:
          "Paid for with an Andrew Carnegie grant and designed by John Reid Jr., this two-story, Spanish-style branch of brick and terra cotta was finished in September 1916 at a cost of $45,499, furnishings included. Twice threatened with closure in the 1980s, it was saved by a campaign led by neighbor Sally Brunn, and after her death in 1991 it was renamed for her. A city landmark since 2008, it stands on the street Horner named for his home state, and its renovation, finished that March, won a Governor's Historic Preservation Award.",
        place: "Noe Valley/Sally Brunn Library",
        where: "451 Jersey St",
        at: [-122.43514, 37.75027],
        source: "https://sfpl.org/locations/noe-valley/noe-valley-library-history",
      },
      {
        icon: "tram",
        title: "Where the cable cars turned around",
        text:
          "Cable cars climbing Castro Street ended their run at this corner, where a turntable swung them around; a photo from about 1940 shows Castro car No. 4 on it. In its last years the line was a shuttle over the hill between 18th and 26th streets, and its final day was April 5, 1941. The next day the Market Street Railway replaced it, the Fillmore Street counterbalance and the 24-Divisadero streetcar with one new 24-Divisadero bus line, and Muni buses still stop at this corner.",
        place: "Castro cable car turntable",
        where: "Castro St & 26th St",
        at: [-122.43376, 37.74818],
        source: "https://www.streetcar.org/cable_car_to_castro/",
      },
      {
        icon: "house",
        title: "A landmark for two pioneers",
        text:
          "This two-story cottage was the longtime home of Phyllis Lyon and Del Martin, pioneering lesbian-rights and feminist activists who helped found the Daughters of Bilitis in 1955. They were the first same-sex couple married in San Francisco, twice: in 2004 and again in 2008. In 2021 supervisors voted unanimously to make the house, with the neighboring lot the couple tended as a garden, city Landmark No. 292, which the AP called the first lesbian landmark in the U.S. West; please view it from the sidewalk.",
        place: "Lyon-Martin House",
        where: "651 Duncan St",
        at: [-122.43459, 37.74539],
        source: "https://sfplanninggis.org/docs/landmarks_and_districts/LM292.pdf",
      },
      {
        icon: "church",
        title: "A Sister Act star, built debt-free",
        text:
          "St. Paul's parish began this 1,400-seat English Gothic church in 1897 and paid as it went, taking 14 years and finishing without construction debt; Archbishop Patrick Riordan dedicated it on May 29, 1911. Designed by Frank T. Shea, it played the outside of St. Katherine's in the 1992 film Sister Act, for which the storefronts across the street were dressed to look run-down. In 2025 supervisors began the process of making it a city landmark.",
        place: "St. Paul's Church",
        where: "1660 Church St",
        at: [-122.42700, 37.74420],
        source: "https://en.wikipedia.org/wiki/St._Paul%27s_Catholic_Church_(San_Francisco)",
      },
    ],
    walk: {
      intro:
        "A one-way walk of about 1.8 miles for visitors and would-be neighbors, from the J-Church stop at Church & 24th streets along the 24th Street shopping blocks, then south past the old cable car turnaround and the Lyon-Martin House to St. Paul's Church, where the J runs past on Church Street for the ride back. Allow about 80 minutes; on a Saturday morning the farmers' market is running at Town Square.",
      miles: 1.8,
      minutes: 80,
      tip:
        "Save your coffee stop for 24th Street between Church and Castro, before the walk turns south. At the end, look a block south of St. Paul's: the wye track where J-Church streetcars turned back for about eight decades still sits on 30th Street.",
    },
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
      "Before the 1915 world's fair, the shore between Black Point, today's Fort Mason, and the Presidio was a shallow cove edged with tidal marsh. It was generally called Harbor View, after a bayside resort that opened as baths in 1864 and whose seafood restaurant became known for clam chowder, cracked crab and steam beer. Fill had crept into the cove since the late 1860s, and in 1912 a dredge pumped in sand and mud from the bay floor to make ground for the Panama-Pacific International Exposition, which celebrated the new Panama Canal and the city's recovery from 1906.\n\nThe fair ran from February to December 1915. Then its palaces came down; only Bernard Maybeck's Palace of Fine Arts still stands on the old grounds, and a 1991 study concluded that the remains of thousands of piles driven for the fair very probably still lie underground. Landscape architect Mark Daniels's 1917 plan, adopted in part as Marina Gardens, laid out diagonal boulevards, triangular blocks and curving avenues that still shape the streets between Fillmore and Scott. In 1920 the first transcontinental air mail flight ended on the cleared ground, now the Marina Green. Once houses and apartment buildings began going up in the early 1920s, developers rechristened the district the Marina, and it was built out quickly through the early 1930s in Period Revival, Streamline Moderne and Art Deco styles, with Chestnut Street as its main street.\n\nThat new ground was tested on October 17, 1989, when the Loma Prieta earthquake shook the loose, sandy fill until it liquefied. Buildings collapsed, gas lines and water mains broke, and fire broke out at Beach and Divisadero streets.",
    facts: [
      {
        icon: "book",
        title: "A landmark library on a playground",
        text:
          "The city library's 23rd branch opened here in 1954, on the southwest corner of the WPA-era Funston Playground, now the George R. Moscone Recreation Center. Its architects, Appleton & Wolfard, drew on Scandinavian design, notably Finnish architect Alvar Aalto; between 1951 and 1966 they designed eight San Francisco branch libraries, which the city's landmark listing calls more than any other firm, and the building is now city Landmark No. 262.",
        place: "Marina Branch Library",
        where: "1890 Chestnut St",
        at: [-122.43435, 37.80118],
        source: "https://sfpl.org/locations/marina/marina-library-history",
      },
      {
        icon: "park",
        title: "Where coast-to-coast air mail landed",
        text:
          "After the fair, this lawn became an airfield, Marina Field. At 2:33 p.m. on September 11, 1920, air mail pilot E. E. “Monte” Mouton landed here, completing the first transcontinental air mail flight three days after the relay set out from New York. He had flown the last 250 miles, from Reno, in 1 hour and 58 minutes.",
        place: "Marina Green",
        where: "Marina Blvd & Fillmore St",
        at: [-122.43745, 37.80645],
        source: "https://www.thisdayinaviation.com/11-september-1920/",
      },
      {
        icon: "wave",
        title: "An organ the tides play",
        text:
          "At the tip of the jetty past the yacht harbor, Exploratorium artist-in-residence Peter Richards and stonemason George Gonzales completed the Wave Organ in 1986. More than 20 PVC and concrete pipes reach down into the bay among carved granite and marble salvaged from a demolished cemetery, so the water's surges rumble, gurgle and hiss through them; it sounds best at high tide.",
        place: "Wave Organ",
        where: "83 Marina Green Dr",
        at: [-122.44018, 37.80848],
        source: "https://en.wikipedia.org/wiki/Wave_Organ",
      },
      {
        icon: "fair",
        title: "The weeping women's missing vines",
        text:
          "Across the lagoon stands the only major structure from the 1915 fair still on its original site. Atop Bernard Maybeck's colonnade, Ulric Ellerhusen's “weeping women” turn their backs and lean on boxes meant to spill over with trailing vines that budget cuts kept from ever being planted. The hall held 18 lighted tennis courts until 1942 and an Army motor pool in World War II; after a campaign led by philanthropist Walter S. Johnson, the palace was rebuilt in permanent materials beginning in 1964, and Frank Oppenheimer's Exploratorium filled the hall from 1969 to 2013.",
        place: "Palace of Fine Arts",
        where: "Baker St & Beach St",
        at: [-122.44675, 37.80340],
        source: "https://www.kqed.org/news/11732261/whats-up-with-the-weeping-women-at-the-palace-of-fine-arts",
      },
      {
        icon: "quake",
        title: "The fire a fireboat fought",
        text:
          "When the Loma Prieta earthquake struck at 5:04 p.m. on October 17, 1989, the shaking snapped gas lines under the Marina, and fire broke out at this corner. The quake had also broken the water mains that fed the hydrants, so firefighters ran hose from the Phoenix, the city's only fireboat since 1955, which pumped bay water into portable hydrants while volunteers helped haul the lines toward the flames. Grateful Marina property owners later gave $50,000 toward buying and refitting a second fireboat, the Guardian, which served until 2022.",
        place: "Beach & Divisadero",
        where: "Beach St & Divisadero St",
        at: [-122.44370, 37.80377],
        source: "https://guardiansofthecity.org/sffd/fires/notable_fires/oct_17_1989.html",
      },
      {
        icon: "movie",
        title: "A Streamline Moderne movie house",
        text:
          "The El Presidio Theatre went up on Chestnut Street in 1937 in the Streamline Moderne style and shortened its name to the Presidio Theatre in 1951. It stayed a single-screen movie house until 2003, and in March 2026 the Board of Supervisors voted unanimously to begin making the building a city landmark.",
        place: "Presidio Theatre",
        where: "2340 Chestnut St",
        at: [-122.44185, 37.80030],
        source: "https://media.api.sf.gov/documents/r0172-26.pdf",
      },
    ],
    walk: {
      intro:
        "A one-way walk of about 2.2 miles for visitors and would-be neighbors, from the Marina Branch Library at Chestnut and Webster streets, where the 30 Stockton bus stops, north to the Marina Green, out the jetty to the Wave Organ, then west to the Palace of Fine Arts and back to Chestnut Street. Allow about an hour and a half, and go on a clear morning timed to a high tide.",
      miles: 2.2,
      minutes: 90,
      tip:
        "The Wave Organ is at its liveliest near high tide, so check a tide table before you set out. The jetty is exposed to the wind off the bay, so bring a layer even on a sunny day.",
    },
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
      "Hayes Valley takes its name from Hayes Street, named for Thomas Hayes, an Irish-born landowner who reached San Francisco in 1849, served as county clerk from 1853 to 1856 and came to own a large tract here, along with the land where the Civic Center now stands. By 1855 a committee of three aldermen was laying out and naming the streets of the Western Addition, west of Larkin Street; one of them, Charles Gough, had once sold milk on horseback, a can slung on either side of his saddle. In 1860 Hayes ran a horsecar line out Hayes Street to help sell his land.\n\nOn the morning of April 18, 1906, a breakfast cooked under a quake-damaged chimney at 395 Hayes Street, near Gough, started the “ham and eggs fire,” and with the water cut off it destroyed most of the neighborhood east of Gough Street. In 1959 the double-decked Central Freeway opened, cutting through the valley with a spur north to Franklin and Gough streets at Golden Gate Avenue.\n\nThe 1989 Loma Prieta earthquake damaged the freeway, and in 1992 the stretch north of Fell Street came down. The rest was fought over in a string of ballot measures until November 1999, when voters approved Proposition I, which paid for a boulevard by selling the freed-up land for housing. Octavia Boulevard opened in 2005, ending at a green later named for Patricia Walkup, founder of the Hayes Valley Neighborhood Association. While the leftover lots waited for housing, stopgap uses bloomed on them, from a volunteer-run farm to Proxy, Envelope A+D's cluster of shops, cafés and a beer garden in shipping containers.",
    facts: [
      {
        icon: "quake",
        title: "Where the ham and eggs fire began",
        text:
          "The 1906 “ham and eggs fire” started a few steps east of this corner, at 395 Hayes Street. After the earthquake's first shocks on the morning of April 18, the people living there got up to make breakfast, not knowing the shaking had badly damaged the chimney above their stove. Firefighters found that more quake damage had cut off the water supply, and most of the neighborhood east of Gough Street was lost.",
        place: "Ham and Eggs Fire Site",
        where: "Hayes St & Gough St",
        at: [-122.42333, 37.77689],
        source: "https://hoodline.com/2013/04/the-dangers-of-cooking-after-a-quake-the-ham-and-eggs-fire",
      },
      {
        icon: "tram",
        title: "A landowner's horsecar line",
        text:
          "Hayes Street, and the valley, are named for Thomas Hayes, who came to own a large tract here. In 1860 he built a horsecar line out this street to make his nearby land more appealing and valuable, and by 1883 it had been rebuilt as a cable car line running to the Ferry Building. For 160 years, from horsecar rails to trolley bus wires, transit on Hayes Street followed a fixed guideway, until the pandemic shutdown; the 21 Hayes came back in July 2022 as a motor coach.",
        place: "Hayes Street",
        where: "Hayes St & Laguna St",
        at: [-122.42621, 37.77664],
        source: "https://www.streetcar.org/hayes-street-transit-since-1860/",
      },
      {
        icon: "stroller",
        title: "A clubhouse with a living roof",
        text:
          "This playground dates to 1958. Its clubhouse had become outdated and rundown when the Trust for Public Land and the Recreation and Park Department took on a $3.9 million renovation, and the rebuilt playground reopened on June 11, 2011. WRNS Studio's new clubhouse was billed as the first Recreation and Park building in the city with a living roof and recycled denim insulation; the planted roof shelters the office, kitchen and restrooms and shades a porch-like space below.",
        place: "Hayes Valley Playground",
        where: "Hayes St & Buchanan St",
        at: [-122.42791, 37.77625],
        source: "https://www.americancityandcounty.com/?p=6553",
      },
      {
        icon: "house",
        title: "Farm rows on freeway ramps",
        text:
          "The block south and east of this corner, bounded by Fell, Oak, Octavia and Laguna streets, once held the Central Freeway's on- and off-ramps. Plans to build housing there stalled in the 2008 downturn, so in January 2010 the city let Hayes Valley Farm use the 2.2-acre lot under an interim-use agreement until development could go ahead. Thousands of volunteers worked the old ramps until June 2013, when the farm made way for a planned condo and retail project.",
        place: "Hayes Valley Farm Site",
        where: "Fell St & Laguna St",
        at: [-122.42594, 37.77540],
        source: "https://www.hayesvalleyfarm.org/?p=91",
      },
      {
        icon: "road",
        title: "A freeway voted down",
        text:
          "The double-decked Central Freeway ran overhead here from 1959, and the 1989 Loma Prieta earthquake damaged it. In November 1999 voters approved Proposition I, the last of several ballot measures on its fate, which paid for a boulevard by selling the freed-up land for housing; the last elevated section north of Market Street came down in 2003. The street's name is far older: Charles Gough, on the 1850s committee that named the Western Addition's streets, named Octavia for his sister, and Gough Street, a block east and pronounced “goff,” for himself.",
        place: "Octavia Boulevard",
        where: "Octavia Blvd & Fell St",
        at: [-122.42448, 37.77559],
        source: "https://en.wikipedia.org/wiki/Octavia_Boulevard",
      },
      {
        icon: "park",
        title: "The green a neighbor fought for",
        text:
          "Octavia Boulevard opened on September 9, 2005, and its north end, between Hayes and Fell streets, became a park called Hayes Green. In August 2006 the Recreation and Park Commission renamed it for Patricia Walkup, founder of the Hayes Valley Neighborhood Association, who had run three campaigns to replace the freeway with a surface boulevard. Burning Man temple builder David Best put up a temple here in 2005, backed by the city's Arts Commission and the Black Rock Arts Foundation, Burning Man's nonprofit arm, and came back with another in July 2015.",
        place: "Patricia's Green",
        where: "Octavia Blvd & Linden St",
        at: [-122.42458, 37.77620],
        source: "https://www.sfexaminer.com/news/hayes-valley-park-to-be-named-after-green-activist/article_ba1af560-f491-5348-b638-59d7527bd1e8.html",
      },
      {
        icon: "coffee",
        title: "A coffee kiosk and a living alley",
        text:
          "On January 23, 2005, Blue Bottle Coffee opened a kiosk in the garage of a Hayes Valley benefactor at 315 Linden Street, which the company calls its first brick-and-mortar location, three years before its first four-walled café, at Mint Plaza. In 2010 neighbors and the Department of Public Works made this end of Linden a “living alley”: three parking spaces gave way to a wider, landscaped sidewalk on the sunny side, and street and sidewalk were brought to one level. By 2018 the living alley ran the full block to Octavia.",
        place: "Linden Living Alley",
        where: "315 Linden St",
        at: [-122.42320, 37.77633],
        source: "https://sfpublicworks.org/node/34729",
      },
    ],
    walk: {
      intro:
        "A loop of about 0.7 mile for visitors and would-be neighbors that starts and ends at the Muni bus stop at Hayes and Gough streets: west on Hayes Street to the playground, then back east along Fell Street through the old freeway corridor to Patricia's Green and Linden Street. Allow about 40 minutes; a weekday morning is calmest, a weekend afternoon is liveliest.",
      miles: 0.7,
      minutes: 40,
      tip:
        "For a bonus view, detour three blocks west on Hayes Street from the playground to Alamo Square, where the Painted Ladies, seven Queen Anne houses that developer Matthew Kavanaugh built between 1892 and 1896, face the park from Steiner Street. They are private homes, so admire them from the park or the sidewalk.",
    },
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
      "Pacific Heights grew up around two hilltop squares that San Francisco's Van Ness Ordinances of 1855 reserved for parks, and both had to be pried loose from private claimants. At Lafayette Square, a former city attorney claimed the eastern half and built a house on the summit; the city got the last of his land only in 1935. Alta Square, long used as a quarry that left dangerous holes, was claimed by Milo Hoadley, who sued again and again until the courts turned him away in 1888.\n\nCable cars came early. Leland Stanford promoted a line on California Street because its grade was gentler than Clay Street's, and the California Street Cable Railroad began service on April 10, 1878, running about 1.7 miles from Kearny Street over Nob Hill to Fillmore Street. In the spring of 1879 it reached Central Avenue, today's Presidio Avenue, the first cable service into the Western Addition. Grand houses rose on the heights, from an 1886 Victorian on Franklin Street to Arizona sandstone and clinker brick in the 1890s.\n\nIn 1906 the fire that followed the earthquake was stopped along Van Ness Avenue, where crews dynamited rows of buildings, many of them mansions, and most of Pacific Heights was saved. Temple Sherith Israel, designed by Albert Pissis and consecrated in 1905 at California and Webster streets, came through with minor damage and served for a time as the Superior Court, where political boss Abe Ruef was tried, convicted and sentenced to San Quentin. In the 20th century a few of the grandest houses became a consulate, a school and a house museum.",
    facts: [
      {
        icon: "house",
        title: "One family's home for 86 years",
        text:
          "Bavarian architect Peter R. Schmidt designed this house in 1886 for William and Bertha Haas, and the family lived in it until 1972. After the death of Alice Haas Lilienthal, her three adult children entrusted it in 1973 to the new Foundation for San Francisco's Architectural Heritage, now SF Heritage, which keeps it as a house museum; it is city Landmark No. 69. The rooms above the garage are a 1928 addition by architect Gardner Dailey.",
        place: "Haas-Lilienthal House",
        where: "2007 Franklin St",
        at: [-122.42499, 37.79328],
        source: "https://haas-lilienthalhouse.org/",
      },
      {
        icon: "park",
        title: "The city attorney's hilltop house",
        text:
          "Samuel Holladay was city attorney from 1860 to 1863, when part of his job was ousting squatters from city-owned land, yet he claimed the eastern half of this square as his own and in the 1860s built a house at its summit. In 1902 he offered the city four of his six lots for $200,000, and no deal was made. The rest of his land was finally sold to the city in 1935, and in 1936 the house came down.",
        place: "Lafayette Park",
        where: "Gough St & Washington St",
        at: [-122.42778, 37.79185],
        source: "https://hoodline.com/2016/06/legendary-land-dispute-lafayette-park-today/",
      },
      {
        icon: "art",
        title: "Big Alma's French chateau",
        text:
          "Adolph B. Spreckels had George Applegarth, trained at the École des Beaux-Arts in Paris, and Kenneth MacDonald Jr. design this French Baroque mansion facing Lafayette Park for himself and his wife, Alma; finished around 1912–13, it is city Landmark No. 197. KQED reports that in 1901 sculptor Robert Aitken hired the six-foot-tall Alma de Bretteville, nicknamed “Big Alma,” as his model, and she is widely credited, though accounts differ, as the model for the Victory atop Union Square's Dewey Monument. Admire the house from the sidewalk.",
        place: "Spreckels Mansion",
        where: "2080 Washington St",
        at: [-122.42755, 37.79271],
        source: "https://en.wikipedia.org/wiki/Spreckels_Mansion_(San_Francisco)",
      },
      {
        icon: "flag",
        title: "Nazi Germany's consulate",
        text:
          "This Arizona sandstone house was built for William Franklin Whittier between 1894 and 1896. In 1941 the family sold it to the German Reich for its San Francisco consulate, where Fritz Wiedemann, Hitler's former commanding officer, served as consul, and during World War II the U.S. Alien Property Custodian seized it. After several more owners it passed to the California Historical Society in 1956, and it is city Landmark No. 75.",
        place: "Whittier Mansion",
        where: "2090 Jackson St",
        at: [-122.42945, 37.79337],
        source: "https://en.wikipedia.org/wiki/Whittier_Mansion",
      },
      {
        icon: "house",
        title: "Before Filoli, a town house",
        text:
          "Willis Polk designed this clinker-brick town house in the late 1890s for William Bowers Bourn II, head of the Spring Valley Water Company, whose family fortune came from the Empire Mine near Grass Valley, and his wife, Agnes Moody. It became city Landmark No. 38 in 1971. Polk later designed Filoli, the Woodside estate the Bourns built in 1915–17; the National Trust for Historic Preservation now owns it and opens it to the public.",
        place: "Bourn Mansion",
        where: "2550 Webster St",
        at: [-122.43307, 37.79412],
        source: "https://en.wikipedia.org/wiki/Bourn_Mansion",
      },
      {
        icon: "quake",
        title: "A marble house after the fire",
        text:
          "The fire after the 1906 earthquake destroyed Maud Flood's Nob Hill home, and her husband, James L. Flood, promised her a new one: this Italian Renaissance palazzo by Bliss & Faville, built around a welded steel frame, begun about 1912 and finished in 1915. Years after James died, Maud gave the marble house to the Religious of the Sacred Heart, a gift the Chronicle reported in June 1939, and it is part of the Schools of the Sacred Heart today.",
        place: "Flood Mansion",
        where: "2222 Broadway",
        at: [-122.43369, 37.79466],
        source: "https://theclio.com/entry/1288",
      },
      {
        icon: "church",
        title: "A million bricks from Union Square",
        text:
          "Calvary's congregation once worshiped on Union Square, at Powell and Geary streets. When it moved here, the old church was taken apart, and its pews, woodwork and more than a million bricks went into the new sanctuary, where the first service was held on Thanksgiving Day, November 27, 1902. The 1906 earthquake did it no structural damage, and afterward its basement served as a temporary courtroom for the Superior Court, while other congregations, Temple Emanu-El among them, held services here.",
        place: "Calvary Presbyterian Church",
        where: "Fillmore St & Jackson St",
        at: [-122.43462, 37.79256],
        source: "https://en.wikipedia.org/wiki/Calvary_Presbyterian_Church_(San_Francisco)",
      },
      {
        icon: "movie",
        title: "The stairs cars came down",
        text:
          "Long used as a quarry, the square was graded from 1891 to 1899 to a plan by a designer named R. Ulrich, with walks, archways and landings. In November 1971 Peter Bogdanovich came back to film the chase for What's Up, Doc?, sending four cars, among them a Volkswagen Bug, a 1969 Cadillac DeVille convertible and a 1969 Plymouth Belvedere taxi, down the stairway that rises from Clay and Pierce streets. The production had no city permission to drive on the steps, which were badly damaged and still show the scars.",
        place: "Alta Plaza Park",
        where: "Clay St & Pierce St",
        at: [-122.43752, 37.79050],
        source: "https://en.wikipedia.org/wiki/Alta_Plaza_Park",
      },
    ],
    walk: {
      intro:
        "A one-way walk of about 1.3 miles for visitors and would-be neighbors, from the Haas-Lilienthal House on Franklin St (the 1 California stops a block and a half south, at Clay & Franklin) past Lafayette Park, a run of mansions and a church built with Union Square bricks to Alta Plaza Park, two blocks above the 1's stop at California & Pierce for the ride back. Allow about an hour, and pick a clear day for the views from the two hilltop parks.",
      miles: 1.3,
      minutes: 60,
      tip:
        "From Calvary, walk a block west on Jackson St into Alta Plaza, cross the park to its south side and take the wide stairway down to Clay & Pierce: the same steps the cars came down in What's Up, Doc?",
    },
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
      "Ohlone-speaking Yelamu people lived in this valley for thousands of years before the Spanish founded Mission San Francisco de Asís in 1776 beside a lagoon, Laguna Dolores; the mission moved to its present site in 1783, and the district still carries its name. In 1866 R. B. Woodward opened Woodward's Gardens on land that had belonged to John C. Frémont, an amusement park with a zoo, aquarium, museum, art gallery and botanical gardens between Mission and Valencia streets from today's Duboce Avenue to 15th Street. A state plaque at 1700 Mission Street remembers it as the city's most popular resort until it closed in 1892.\n\nIrish and German immigrant workers settled the flat valley in the late 1800s. In April 1906 the fire that followed the earthquake swept into the Mission from Hayes Valley, but firefighters halted it at 20th Street, partly with water from a cistern at 19th and Shotwell streets. Displaced businesses and residents moved in, and the rebuilt Mission Street became the “Mission Miracle Mile,” which city planners call San Francisco's largest and most important shopping destination outside Union Square in the first half of the 20th century.\n\nAfter World War II many longtime families left for the suburbs on GI Bill and federal housing loans, and a Latino community grew up with its center along Mission Street. On November 5, 1973, BART opened its 16th Street and 24th Street stations beneath Mission Street. Murals began appearing in Balmy Alley in 1972, artists and activists founded the Mission Cultural Center for Latino Arts in 1977, Carnaval first paraded in 1979, and in 1992 six neighbors started the Clarion Alley Mural Project.",
    facts: [
      {
        icon: "tower",
        title: "The castle on Mission Street",
        text:
          "This National Guard armory and arsenal went up in 1912–14 to replace one destroyed in 1906, and it was designed to look like a medieval fortress, with octagonal corner towers, rough clinker-brick walls that curve outward toward the ground and long, narrow slit windows. From the 1920s through the 1940s it was the city's main sports venue, with at least two prizefights most weeks in its Drill Court, usually on Tuesday and Friday nights, earning it the nickname “the Madison Square Garden of the West.” It is city Landmark No. 108.",
        place: "The Armory",
        where: "1800 Mission St",
        at: [-122.42056, 37.76778],
        source: "https://en.wikipedia.org/wiki/San_Francisco_Armory",
      },
      {
        icon: "flag",
        title: "The 1934 general strike's meeting hall",
        text:
          "The San Francisco Labor Council built this Labor Temple in 1914 and held its grand opening on February 27, 1915. Its biggest moment came in 1934, when many of the meetings of the city's general strike were held in its main auditorium. The city made it Landmark No. 238 in 2004, and the Clarion Alley Mural Project, the next stop, has painted murals here too.",
        place: "Redstone Building",
        where: "2940 16th St",
        at: [-122.41830, 37.76525],
        source: "https://en.wikipedia.org/wiki/Redstone_Building",
      },
      {
        icon: "art",
        title: "Six neighbors, 700-plus murals",
        text:
          "In October 1992 six North Mission residents, Aaron Noble, Michael O'Connor, Sebastiana Pastor, Rigo 92, Mary Gail Snyder and Aracely Soriano, formed the Clarion Alley Mural Project, inspired by the murals of Balmy Alley. The volunteer collective has since put up more than 700 murals on and around this one-block alley between Mission and Valencia streets.",
        place: "Clarion Alley",
        where: "Clarion Alley & Mission St",
        at: [-122.41953, 37.76300],
        source: "https://en.wikipedia.org/wiki/Clarion_Alley_Mural_Project",
      },
      {
        icon: "movie",
        title: "A movie palace named for Nolan",
        text:
          "This began as a nickelodeon, the Idle Hour; in 1915 its owners hired the Reid Brothers to design a large auditorium and lobby, which opened in 1916, and in 1932 Timothy Pflueger remade it in Art Deco style, with 2,012 seats, for the Nasser brothers' theater chain. It closed in 1993, and City College bought it in 1998 for a campus that would have meant demolishing most of it, until it became a city landmark in 2004. Alamo Drafthouse reopened it in December 2015, and in 2026 renamed it the Christopher Nolan Cinema.",
        place: "New Mission Theater",
        where: "2550 Mission St",
        at: [-122.41902, 37.75631],
        source: "https://localnewsmatters.org/2026/06/12/sfs-historic-new-mission-movie-theater-to-be-renamed-after-director-christopher-nolan/",
      },
      {
        icon: "book",
        title: "The library's very first branch",
        text:
          "The Mission branch opened in 1888 in a storefront two blocks away, the first branch of the San Francisco Public Library. Its current home, paid for by Andrew Carnegie and designed by G. Albert Lansburgh, opened here in December 1915, four blocks south of where the 1906 fire stopped. After a renovation of about $37 million that restored its 24th Street staircase, removed in 1997, it reopens on Saturday, November 14, 2026.",
        place: "Mission Branch Library",
        where: "Bartlett St & 24th St",
        at: [-122.41972, 37.75228],
        source: "https://sfpl.org/locations/mission/mission-library-history",
      },
      {
        icon: "art",
        title: "Murals for Central America",
        text:
          "The alley's earliest murals date to 1972, when Mia Galaviz de Gonzalez painted with children from a local child-care center, and in 1973 Patricia Rodriguez and Graciela Carrillo, who rented an apartment here and soon formed Las Mujeres Muralistas, painted a jungle-underwater scene. In 1984 muralist Ray Patlán led PLACA, a group of artists who added some two dozen murals celebrating the Indigenous cultures of Central America and protesting U.S. intervention in the region.",
        place: "Balmy Alley",
        where: "Balmy St & 24th St",
        at: [-122.41245, 37.75250],
        source: "https://en.wikipedia.org/wiki/Balmy_Alley",
      },
    ],
    walk: {
      intro:
        "A 1.7-mile line for visitors and would-be neighbors, from the Armory at Mission and 14th streets (two blocks north of 16th St Mission BART; the 14 and 49 buses run along Mission St) south past the Mission's labor hall, mural alleys, movie palace and library to Balmy Alley, about a seven-minute walk east of 24th St Mission BART for the ride back. Allow about 75 minutes, and go on a sunny afternoon, when the murals are in full light.",
      miles: 1.7,
      minutes: 75,
      tip:
        "Walk Clarion Alley all the way through to Valencia St and back before continuing south on Mission St. The library reopens with a ribbon-cutting on Saturday, November 14, 2026; check SFPL's hours before planning to go inside.",
    },
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
      "North Beach was named for a real beach. Before landfill, a large beach marked San Francisco's northeast side, its shoreline reaching about what are now Taylor and Francisco streets, and on the ground that became Washington Square, Juana Briones, a pioneer settler of Yerba Buena, raised cattle and grew vegetables to sell to ships' crews. When Jasper O'Farrell laid out the city's streets in 1847 he set that block aside as a public square, and in June 1849, during the Gold Rush, St. Francis of Assisi parish dedicated a small wooden church on Vallejo Street.\n\nItalians began arriving in large numbers in the late 19th century, many from Piedmont and Liguria and especially the port of Genoa, and those who fished settled in cheap housing near the wharves at the end of Columbus Avenue. The 1906 earthquake and fire gutted St. Francis, destroyed the first Saints Peter and Paul church and left some 600 people living in Washington Square. St. Francis was rebuilt inside its surviving walls and rededicated in 1919, the new Saints Peter and Paul was completed in 1924, and as Italian immigration rose, North Beach was known by the 1920s as Little Italy.\n\nIn the 1950s its bars and bookstores became haunts of the Beat Generation. Vesuvio opened in 1948, City Lights in 1953 and Caffe Trieste in 1956, and that November City Lights published Allen Ginsberg's Howl. Police arrested the store's manager for selling it in June 1957, and that October a judge ruled the poem was not obscene. The city made the City Lights building a landmark in 2001; Washington Square is City Landmark No. 226.",
    facts: [
      {
        icon: "book",
        title: "Where Howl beat the censors",
        text:
          "Poet Lawrence Ferlinghetti and Peter D. Martin opened City Lights in June 1953, naming it for Martin's magazine City Lights, itself a nod to the Chaplin film, and it has been called the nation's first all-paperback bookstore. In June 1957 police arrested its manager, Shig Murao, for selling Allen Ginsberg's Howl, which City Lights had published, to an undercover officer, and charged Ferlinghetti too; on October 3, Judge Clayton W. Horn ruled the poem was not obscene. Beside the store, Jack Kerouac Alley, renamed from Adler Alley in 1988 at Ferlinghetti's request and made pedestrian-only in 2007 with quotes from Kerouac, Maya Angelou, John Steinbeck and others set into it, runs along Vesuvio, a bar since 1948.",
        place: "City Lights Bookstore",
        where: "261 Columbus Ave",
        at: [-122.40658, 37.79763],
        source: "https://en.wikipedia.org/wiki/City_Lights_Bookstore",
      },
      {
        icon: "coffee",
        title: "Seventy years of North Beach espresso",
        text:
          "Giovanni “Papa Gianni” Giotta, born in 1920 in Rovigno on the Istrian peninsula, in what is now Croatia, came to San Francisco in 1951 and opened this café at Vallejo and Grant on April 1, 1956. Some consider it the first espresso house on the West Coast. Giotta died in 2016 at 96, and the café marked its 70th anniversary on April 4, 2026, with 70-cent espresso and cappuccino and an afternoon of free music.",
        place: "Caffe Trieste",
        where: "601 Vallejo St",
        at: [-122.40730, 37.79867],
        source: "https://www.nbcbayarea.com/news/local/san-franciscos-iconic-caffe-trieste-turns-65-amid-pandemic-and-temporary-closure/2507168/",
      },
      {
        icon: "church",
        title: "Walls that outlasted 1906",
        text:
          "When this parish dedicated its first church, a small wooden building, on June 17, 1849, Gold Rush Catholics had no church nearer than Mission Dolores; in 1851 Bishop Joseph Alemany consecrated an adobe church here and used it as his cathedral for three years. Its replacement, built right over the old church so services need not stop, was dedicated on March 17, 1860. The 1906 fire gutted it, but the twin towers and walls stood, and a new church built inside them was rededicated on March 2, 1919. City Landmark No. 5 since 1968, it was named the National Shrine of Saint Francis of Assisi in 1999.",
        place: "National Shrine of St. Francis of Assisi",
        where: "610 Vallejo St",
        at: [-122.40752, 37.79900],
        source: "https://en.wikipedia.org/wiki/Saint_Francis_of_Assisi_Church_(San_Francisco)",
      },
      {
        icon: "park",
        title: "A time capsule under Ben Franklin",
        text:
          "When Jasper O'Farrell laid out the city's streets in 1847, he set aside three blocks as public squares, and this was one; in the early 1850s it became a haphazard cemetery and a goat pasture, and after the 1906 earthquake some 600 people lived here in wooden barracks and Army tents. The Benjamin Franklin statue went up on Market Street in 1879 as a water fountain given by temperance crusader Henry Cogswell and moved here in 1904. The time capsule under it, filled mostly with Cogswell's own things, was opened in 1979 and replaced with one to be opened in 2079.",
        place: "Washington Square",
        where: "Columbus Ave & Union St",
        at: [-122.41023, 37.80088],
        source: "https://en.wikipedia.org/wiki/Washington_Square_(San_Francisco)",
      },
      {
        icon: "cow",
        title: "A pioneer's farm under the park",
        text:
          "California Historical Landmark No. 1024, registered in July 1997, honors Juana Briones, a pioneer settler of Yerba Buena, and its plaque, dated October 6, 1997, stands at this corner of the square. It says that on the site of this park she raised cattle and grew vegetables for sale to ships' crews, gave sanctuary to refugees, and was revered as a healer and caregiver. The state parks department placed it with the city's Recreation and Park Department, the Women's Heritage Museum and the Bay Area Network of Latinas.",
        place: "Juana Briones plaque",
        where: "Stockton St & Filbert St",
        at: [-122.40946, 37.80142],
        source: "https://ohp.parks.ca.gov/ListedResources/Detail/1024",
      },
      {
        icon: "church",
        title: "DeMille filmed its construction",
        text:
          "Run by the Salesians of Don Bosco, the parish lost its first church, built in 1884 at Filbert and Grant, to the 1906 earthquake and fire. Scenes for Cecil B. DeMille's 1923 film The Ten Commandments were shot here while this one was under construction, and it was completed in 1924. Joe DiMaggio married Dorothy Arnold here on November 19, 1939; with no annulment of that marriage, his 1954 wedding to Marilyn Monroe was a civil one at City Hall, after which the couple came back for photos on these steps. His funeral was held here on March 11, 1999.",
        place: "Saints Peter and Paul Church",
        where: "666 Filbert St",
        at: [-122.41020, 37.80160],
        source: "https://en.wikipedia.org/wiki/Saints_Peter_and_Paul_Church,_San_Francisco",
      },
      {
        icon: "art",
        title: "Lillie Coit's other memorial",
        text:
          "Haig Patigian's group of three life-size firemen, one carrying a woman in his arms, was unveiled here near Columbus Avenue on December 3, 1933, honoring the city's volunteer fire department of 1849 to 1866. Lillie Hitchcock Coit's estate paid for it: her will made two bequests, one for a memorial to the city's volunteer firefighters and one to beautify the city, which built Coit Tower, often wrongly said to be a firemen's memorial itself.",
        place: "Volunteer Firemen Memorial",
        where: "Columbus Ave & Powell St",
        at: [-122.41075, 37.80098],
        source: "https://www.sfchronicle.com/chronicle_vault/article/They-strutted-brawled-and-threw-the-best-parties-16141727.php",
      },
      {
        icon: "wave",
        title: "Where the north beach was",
        text:
          "The neighborhood's name was literal: before landfill, a large beach marked San Francisco's northeast side, and a Frommer's walking tour puts its shoreline at what are now Taylor and Francisco streets. Landfill later moved the water's edge north; the history blog Burrito Justice, mapping the city's 1886 Sanborn fire-insurance maps, shows Bay Street, a block north of here, then running beside the bay, with the blocks at Beach Street still water lots.",
        place: "The old shoreline",
        where: "Francisco St & Taylor St",
        at: [-122.41495, 37.80438],
        source: "https://www.frommers.com/destinations/san-francisco/walking-tours/walking-tour-2/",
      },
    ],
    walk: {
      intro:
        "A one-way walk of about a mile for visitors and would-be neighbors, from City Lights at Columbus Ave & Broadway, a few blocks from Muni's Chinatown–Rose Pak Station, past the café and church at Grant and Vallejo, around Washington Square and out Columbus Avenue to where the old beach was. Allow about an hour, and go by day, when the cafés are open.",
      miles: 1,
      minutes: 60,
      tip:
        "Have your espresso at Caffe Trieste, the second stop, and save the bench time for Washington Square. The last stop is a Powell–Mason cable car stop; the line turns around a block north at Bay & Taylor, where you can board for the ride back to Powell & Market.",
    },
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
      "The name comes from graves. A plaque on the crest says Gold Rush-era miners found the graves, marked by wooden crosses, of Russian-American Company sailors who died here in the early 1840s, and added graves of their own; other accounts point to seal hunters from Count Rezanov's ship as early as 1806, or to a Russian warship's crew in 1848. The graves were removed or built over in the 1850s, the decade the eight-sided house on Green Street went up. In 1891 one of the city's last entirely new cable lines began running up Hyde Street.\n\nIn 1892 the architect Willis Polk built a double house on the Vallejo Street crest for his family and for Dora Williams, and the poet Ina Coolbrith's home on the hill became a salon for artists and writers. The fire after the 1906 earthquake destroyed Coolbrith's home, but the crest escaped, an island amid the flames. From 1912 H. P. Livermore's nine-unit building program there, including Pueblo-Mission Revival houses by Charles F. Whittlesey, earned him the title “Father of Russian Hill.”\n\nLombard Street's block between Hyde and Leavenworth got its eight hairpin turns in 1922, Diego Rivera painted a fresco at the Chestnut Street art school in 1931, and in 1957 Alfred Hitchcock filmed the exterior of Scottie's apartment for Vertigo at 900 Lombard. On May 24, 1976, the San Francisco Chronicle began running Armistead Maupin's Tales of the City, whose Barbary Lane was modeled on Macondray Lane. In 1988 the Vallejo Street crest was listed on the National Register as a historic district.",
    facts: [
      {
        icon: "tram",
        title: "The city's last new cable lines",
        text:
          "The cable cars climbing Hyde Street follow a route that opened on February 9, 1891, as the California Street Cable Railroad's O'Farrell, Jones & Hyde line; it and a Jones Street shuttle that opened the same day were San Francisco's last entirely new cable lines, and its Hyde Street stretch survives in today's Powell-Hyde line. Look east along Filbert Street: its block from here to Leavenworth, at a 31.5 percent grade, tied 22nd Street for steepest on the city Bureau of Engineering's old list, though a newer independent measurement ranks it lower.",
        place: "Hyde Street cable car",
        where: "Hyde St & Filbert St",
        at: [-122.41925, 37.80019],
        source: "https://streetcar.org/hyde-at-125-2",
      },
      {
        icon: "park",
        title: "A poet's park, a champion's courts",
        text:
          "The park honors George Sterling, whom the Chronicle has called San Francisco's unofficial poet laureate; a plaque near its steps at Lombard and Larkin carries a verse of his 1920 poem “The Cool, Grey City of Love,” which also gave Gary Kamiya's book Cool Gray City of Love its title. The tennis courts at this corner honor Alice Marble, winner of 18 Grand Slam titles, whose July 1950 editorial in American Lawn Tennis magazine argued that Althea Gibson should be welcomed into U.S. Lawn Tennis Association competition. It is widely credited with Gibson's invitation to that year's U.S. National Championships, where she became the first African-American player at a Grand Slam event.",
        place: "George Sterling Park",
        where: "Hyde St & Greenwich St",
        at: [-122.41940, 37.80100],
        source: "https://en.wikipedia.org/wiki/List_of_memorials_to_George_Sterling",
      },
      {
        icon: "road",
        title: "Eight turns for a 27% grade",
        text:
          "In 1922 this block was rebuilt with eight hairpin turns, an idea credited to Carl Henry, to tame its natural 27 percent grade; it is now paved in brick. Look back up from the bottom here, then walk a block east to 900 Lombard St, on the corner of Jones, whose exterior Alfred Hitchcock filmed in 1957 as Scottie's apartment in Vertigo; the interiors were shot on a soundstage in Hollywood.",
        place: "Lombard Street's crooked block",
        where: "Lombard St & Leavenworth St",
        at: [-122.41807, 37.80218],
        source: "https://en.wikipedia.org/wiki/Lombard_Street_(San_Francisco)",
      },
      {
        icon: "art",
        title: "Rivera painted himself in",
        text:
          "Bakewell & Brown's bell-towered 1926 art school is city Landmark No. 85, and Paffard Keatinge-Clay's addition followed in 1968. In May 1931 Diego Rivera and his assistants painted The Making of a Fresco Showing the Building of a City in what is now the Diego Rivera Gallery, with Rivera himself at the center, seen from behind, sitting on a scaffold. After the San Francisco Art Institute's bankruptcy, a nonprofit led by Laurene Powell Jobs bought the campus and its mural for about $30 million in 2024, and the California Academy of Studio Arts, the free studio program it announced for the site, has said it will restore public access to the fresco, closed to the public in 2023.",
        place: "San Francisco Art Institute",
        where: "800 Chestnut St",
        at: [-122.41669, 37.80350],
        source: "https://commissions.sfplanning.org/hpcpackets/2021-001721DES.pdf",
      },
      {
        icon: "book",
        title: "The real Barbary Lane",
        text:
          "Enter this lane, originally named Lincoln Lane, from Jones St and follow it east to the wooden stairway that drops to Taylor St; the Tales of the City TV series used those stairs. Armistead Maupin's Tales of the City began running in the San Francisco Chronicle on May 24, 1976, and in time put Mary Ann Singleton in an apartment at 28 Barbary Lane. In a 2017 documentary interview, Maupin confirmed that he based Barbary Lane on Macondray.",
        place: "Macondray Lane",
        where: "Macondray Ln & Taylor St",
        at: [-122.41402, 37.79935],
        source: "https://thefrontsteps.com/2021/10/13/barbary-lane-macondray-maupin/",
      },
      {
        icon: "house",
        title: "Eight sides since the 1850s",
        text:
          "George Kenny built this eight-sided house in 1857–58, though one account puts its start as early as 1852, and in 1870 sold it to Louis Feusier; the third story, mansard roof and cupola came later. It became a city landmark on October 1, 1970, and is one of two octagon houses left in San Francisco; the other, the Colonial Dames Octagon House, stands on Gough Street. It is a private home, so admire it from the sidewalk.",
        place: "Feusier Octagon House",
        where: "1067 Green St",
        at: [-122.41648, 37.79837],
        source: "https://en.wikipedia.org/wiki/Feusier_Octagon_House",
      },
      {
        icon: "stairs",
        title: "Polk's ramps and a Russian plaque",
        text:
          "Climb the balustraded double ramps from Jones St onto the crest: Willis Polk built these Vallejo Street improvements in 1914 for the adjoining property owners. In 1892 he built 1013–1017 Vallejo for his family and 1019 next door for Dora Williams. At Russian Hill Place, a plaque put up in 2005 by the United Humanitarian Mission, with support from the Russian government, credits the hill's name to Russian-American Company sailors who died here in the early 1840s.",
        place: "Vallejo Street Crest",
        where: "1013 Vallejo St",
        at: [-122.41418, 37.79788],
        source: "https://rhnsf.org/?p=691",
      },
      {
        icon: "book",
        title: "California's first poet laureate",
        text:
          "This park honors Ina Coolbrith, who with Bret Harte and Charles Warren Stoddard formed the “Golden Gate Trinity” and was Harte's editorial assistant at the Overland Monthly from 1868. As a librarian in Oakland from 1874 she encouraged the early reading of Jack London and Isadora Duncan, and on June 30, 1915, she was named California's first poet laureate. Her home nearby on the hill, a salon for artists and writers, burned in the 1906 fire with much of her manuscript work.",
        place: "Ina Coolbrith Park",
        where: "Taylor St & Vallejo St",
        at: [-122.41375, 37.79799],
        source: "https://en.wikipedia.org/wiki/Ina_Coolbrith",
      },
    ],
    walk: {
      intro:
        "A one-way walk for visitors and would-be neighbors, from the Powell-Hyde cable car stop at Hyde & Filbert, down Lombard Street's crooked block and across the hill's lanes and stairways to Ina Coolbrith Park, a block above the Powell-Mason cable car stop at Mason & Vallejo. It runs about 1.3 miles with steep climbs; allow 75 minutes, go on a weekday morning to beat the Lombard Street crowds, and save it for a clear day for the views.",
      miles: 1.3,
      minutes: 75,
      tip:
        "From the foot of the Macondray Lane stairs, walk south on Taylor and west on Green St to the octagon house, then south on Jones to Polk's ramps; from Ina Coolbrith Park it is downhill to Mason St and the Powell-Mason cable car, a few blocks above North Beach. Bring good shoes for Jones St and the lane's wooden stairs.",
    },
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
      "Early San Franciscans called it California Hill, after the street that climbs its steep eastern face. The way up came before dawn on August 2, 1873, when Andrew Hallidie, working the grip himself, test-ran his Clay Street Hill Railroad, the city's first cable car line, between Kearny and Jones streets. The railroad men followed. Leland Stanford built a mansion at California and Powell in 1876, and his California Street Cable Railroad opened on April 10, 1878; the Cable Car Museum says it carried more than 11,000 riders that day. His Central Pacific partners Mark Hopkins and Charles Crocker built nearby, Collis Huntington bought a neighbor's mansion in 1892, and in 1886 silver baron James C. Flood finished a brownstone. The Big Four and their wealthy neighbors were the nabobs, shortened to nobs, who gave the hill its name.\n\nThe mansions drew resentment as well as admiration. Crocker walled in the house of a neighbor who refused to sell, and on October 29, 1877, Denis Kearney led a Workingmen's Party crowd of more than a thousand to Crocker's door, giving him a month to take the fence down or see them do it.\n\nThe fire that followed the 1906 earthquake burned the mansions, leaving the stone shell of Flood's house and the damaged, unopened Fairmont. The families let the land go: the Crockers gave their block to the Episcopal diocese, which laid Grace Cathedral's cornerstone in 1910; Arabella Huntington deeded hers to the city as a park in 1915; and the Flood house became the Pacific-Union Club. The Fairmont opened in 1907 and the Stanford Court Apartments in 1912, and cable cars still climb California Street past them all.",
    facts: [
      {
        icon: "tram",
        title: "Where three cable lines meet",
        text:
          "Leland Stanford built a $2 million mansion on this corner in 1876. The fire after the 1906 earthquake destroyed it, but the ten-foot wall of basalt and granite around its two-acre grounds survived, and part of it, with a restored fence, still runs along the eastern side of the Stanford Court Hotel. Stanford's California Street line crosses the Powell Street tracks here, the one corner where all three of the city's cable car lines stop.",
        place: "California & Powell",
        where: "California St & Powell St",
        at: [-122.40930, 37.79213],
        source: "https://en.wikipedia.org/wiki/Stanford_Court_Hotel",
      },
      {
        icon: "star",
        title: "Mansion, art school, sky bar",
        text:
          "Mark Hopkins' widow, Mary, left the mansion on this corner to her second husband, Edward Searles, who in February 1893 donated it to the San Francisco Art Association; it ran the Mark Hopkins Institute of Art here until the fire after the 1906 earthquake destroyed the house. In 1939 George D. Smith, owner of the hotel that now stands here, turned its 11-room, 19th-floor penthouse into the glass-walled Top of the Mark. In World War II, wives and sweethearts of departing servicemen gathered in its northwest corner to watch the ships sail out through the Golden Gate, and it became known as Weepers' Corner.",
        place: "Mark Hopkins Hotel",
        where: "999 California St",
        at: [-122.41035, 37.79155],
        source: "https://en.wikipedia.org/wiki/Top_of_the_Mark",
      },
      {
        icon: "beer",
        title: "A tiki bar in the old pool",
        text:
          "Sisters Tessie Fair Oelrichs and Virginia Fair Vanderbilt began this hotel, and it had not yet opened when the 1906 earthquake and fire damaged it. Julia Morgan, hired for her skill with reinforced concrete, repaired it, and it opened a year to the day after the quake. Downstairs, the Tonga Room replaced the hotel's 75-foot indoor pool of 1929, the Fairmont Plunge, in 1945, with a band on a barge in the old pool and staged tropical rainstorms, and the hotel's timeline says Tony Bennett first sang “I Left My Heart in San Francisco” here in December 1961.",
        place: "Fairmont San Francisco",
        where: "950 Mason St",
        at: [-122.41072, 37.79240],
        source: "https://fairmont-san-francisco.com/explore/history",
      },
      {
        icon: "house",
        title: "The mansion that outlived the fire",
        text:
          "Silver baron James C. Flood finished this house in 1886, faced in brownstone shipped from Connecticut quarries. The 1906 fire left its stone shell standing while the mansions around it burned, and the Pacific-Union Club acquired it and had architect Willis Polk remodel it as the club's home. Now a National Historic Landmark, it is a private club, so admire it from the sidewalk.",
        place: "Pacific-Union Club",
        where: "1000 California St",
        at: [-122.41137, 37.79208],
        source: "https://en.wikipedia.org/wiki/James_C._Flood_Mansion",
      },
      {
        icon: "park",
        title: "A railroad widow's gift",
        text:
          "In 1872 railroad attorney David Colton built a white Neoclassical mansion here, with marble steps and tall Corinthian columns. Collis Huntington bought it in 1892, and it burned in the 1906 fire. In February 1915 Huntington's widow, Arabella, sent the mayor a deed to the land, asking that it be known from then on as Collis P. Huntington Park, a gift that came as the city celebrated its recovery with the Panama-Pacific International Exposition.",
        place: "Huntington Park",
        where: "California St & Taylor St",
        at: [-122.41205, 37.79220],
        source: "https://nobhillassociation.org/huntington-park/",
      },
      {
        icon: "art",
        title: "A window of glass and soil",
        text:
          "Designed by Albert Roller, the California Masonic Memorial Temple was dedicated on September 29, 1958. Its main foyer holds a 48-by-38-foot “endomosaic” window by Emile Norman, who developed the technique: more than 150 hues of crushed glass, with soil, plant matter and metals, pressed between two large panes of acrylic. Roller commissioned it after seeing one of Norman's endomosaic windows at the Casa Munras hotel in Monterey.",
        place: "The Masonic",
        where: "1111 California St",
        at: [-122.41289, 37.79129],
        source: "https://californiafreemason.org/?p=16645",
      },
      {
        icon: "church",
        title: "Built where a spite fence stood",
        text:
          "When undertaker Nicholas Yung refused to sell his lot on this block, Charles Crocker spent $3,000 on a towering fence around three sides of Yung's house. It stood for about 25 years, until Yung's daughters sold the lot to the Crockers in 1904, and after the 1906 fire the family gave the whole block to the Episcopal diocese. Grace Cathedral's cornerstone was laid in 1910 and it was consecrated in 1964; inside, Keith Haring's bronze altarpiece The Life of Christ, finished two weeks before his death from AIDS in 1990, stands in the AIDS Interfaith Chapel, and labyrinths lie both inside and out.",
        place: "Grace Cathedral",
        where: "1100 California St",
        at: [-122.41325, 37.79195],
        source: "https://en.wikipedia.org/wiki/Charles_Crocker",
      },
      {
        icon: "tram",
        title: "Where the cables are pulled",
        text:
          "The Ferries & Cliff House Railway built this powerhouse and car barn in 1887, before its Powell Street cable cars began running in March 1888, and it was rebuilt after the 1906 earthquake and fire. From the free museum's gallery you look down on the motors, gears and big sheaves that run the whole cable car system, whose cables loop out from here under the streets. The collection includes grip car No. 8, an original 1870s car from Hallidie's Clay Street Hill Railroad.",
        place: "Cable Car Museum",
        where: "1201 Mason St",
        at: [-122.41165, 37.79477],
        source: "https://www.hmdb.org/m.asp?m=259555",
      },
    ],
    walk: {
      intro:
        "A one-way walk for visitors and would-be neighbors across the crest of Nob Hill: start at California & Powell, where all three cable car lines stop, pass the grand hotels, the Flood mansion, Huntington Park, the Masonic and Grace Cathedral, then head down Taylor and Washington streets to the Cable Car Museum, about 0.7 miles and an hour with stops. Leave time to step inside Grace Cathedral and the museum.",
      miles: 0.7,
      minutes: 60,
      tip:
        "Ride a cable car up to California & Powell, where all three lines stop. The Cable Car Museum at the end is free, and Powell-Hyde and Powell-Mason cars stop right outside at Washington & Mason for the ride down Powell Street toward Union Square.",
    },
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
      "Cole Valley takes its name from Cole Street, but the name is far younger than the neighborhood. In 1883 the Haight Street cable line reached Stanyan Street at the edge of Golden Gate Park, and Henry Heagerty began running a saloon and small boarding house at Stanyan and Waller. Four years later the Haight Street Grounds ballpark opened on the land bounded by Stanyan, Waller, Shrader and Frederick streets. It drew California League baseball crowds and, in 1892, hosted the first Big Game between Stanford and California; it was torn down in 1895, and houses now stand where it was. In 1904–05 the architects Martens & Coffey built Heagerty the Park View Hotel, with his saloon keeping the corner, and Victorian houses from around 1900 still stand along Carl and Cole streets.\n\nOn October 21, 1928, the Sunset Tunnel opened under the hill beside Buena Vista Park, and the new N streetcar line came out of its west portal at Carl and Cole, still the heart of the neighborhood's shopping blocks. Cole Hardware, which the city's Legacy Business Registry dates to 1920, was already on Cole Street, and Kezar Stadium, across Stanyan, gave Heagerty's old hotel the name Stadium Hotel from the 1930s into the 1970s.\n\nFrom 1966 to 1989 Cole Street was home to Maud's, a lesbian bar that by its closing was billed as the oldest in the country. In 1975, when the area was still known as the Upper Haight, Jacob Malek-Zadeh bought Cole Street Liquor, a store in business since the 1930s, and that year it became Val de Cole; the city's Legacy Business record credits him with helping create the name Cole Valley.",
    facts: [
      {
        icon: "tram",
        title: "Where the N comes out of the hill",
        text:
          "N Judah trains surface here from the 4,232-foot Sunset Tunnel, first called the Duboce Tunnel, which was built from 1926 to 1928 under the hill beside Buena Vista Park. On Sunday, October 21, 1928, Mayor James Rolph took the controls of the first N car through it as crowds of thousands turned out for the opening. The small park the tracks cut through at the portal is Richard Gamble Memorial Park.",
        place: "Sunset Tunnel West Portal",
        where: "Carl St & Cole St",
        at: [-122.44997, 37.76580],
        source: "https://www.sfmta.com/blog/n-judah-turns-87",
      },
      {
        icon: "shop",
        title: "No strangers, just friends",
        text:
          "The city's Legacy Business Registry dates this hardware store's Cole Valley location to 1920 and says Dave Karp bought it in 1961. He hung his motto over the register: “There are no strangers here, just friends we haven't met.” His son Rick, who started out sweeping its floors as a young teen, grew it into a chain with stores in other neighborhoods, and this is still its flagship.",
        place: "Cole Hardware",
        where: "956 Cole St",
        at: [-122.44959, 37.76528],
        source: "https://www.legacybusiness.org/business/cole-hardware",
      },
      {
        icon: "beer",
        title: "Last call at Maud's",
        text:
          "From 1966 to 1989 this was Maud's, the lesbian bar Rikki Streicher opened, whose patrons included Janis Joplin and the activists Del Martin and Phyllis Lyon; at its closing it was claimed to be the oldest lesbian bar in the United States, and Paris Poirier's 1993 documentary Last Call at Maud's tells its story. Streicher went on to open Amelia's and co-found the Gay Games. In 1989 Finnegans Wake, a pub founded in Noe Valley in 1976, reopened in the space.",
        place: "Finnegans Wake",
        where: "937 Cole St",
        at: [-122.45005, 37.76530],
        source: "https://en.wikipedia.org/wiki/Maud%27s_(bar)",
      },
      {
        icon: "flag",
        title: "The first Big Game kicked off here",
        text:
          "Despite its name, the Haight Street Grounds stood on the land bounded by Stanyan, Waller, Shrader and Frederick streets, which Beulah Street now crosses. It opened for California League baseball on April 3, 1887, and on March 19, 1892, it hosted the first Big Game, won by Stanford 14–10 over California. Stanford's student manager was a young Herbert Hoover, and by the usual telling neither team had brought a ball, so the kickoff waited about an hour while one was fetched on horseback.",
        place: "Haight Street Grounds site",
        where: "Stanyan St & Beulah St",
        at: [-122.45280, 37.76760],
        source: "https://en.wikipedia.org/wiki/Haight_Street_Grounds",
      },
      {
        icon: "house",
        title: "A saloon keeper's 1904 hotel",
        text:
          "Henry Heagerty had run a saloon and small boarding house on this corner since 1883 when the architects Martens & Coffey built him the Park View Hotel in 1904–05, with the saloon keeping the corner. It later went by Hotel Golden Gate, Hotel Roamer and, from the 1930s into the 1970s, the Stadium Hotel, for Kezar Stadium across the street. A later remodel stripped its ornament and covered it in faux-brick siding; restored and renamed the Stanyan Park Hotel, it was listed on the National Register of Historic Places in 1983, and its nomination calls it the oldest surviving hotel on the border of Golden Gate Park.",
        place: "Stanyan Park Hotel",
        where: "750 Stanyan St",
        at: [-122.45285, 37.76815],
        source: "https://npgallery.nps.gov/AssetDetail/NRIS/83001235",
      },
    ],
    walk: {
      intro:
        "A short loop for visitors and would-be neighbors that starts and ends at the N Judah's Carl & Cole stop, takes in the shops on Cole Street, heads west on Carl Street to follow Stanyan Street along the edge of Golden Gate Park, and returns by Waller and Cole streets: about 0.8 mile and 40 minutes with stops. A weekday morning is calmest; a clear afternoon is best for lingering at the park's edge.",
      miles: 0.8,
      minutes: 40,
      tip:
        "Ride the N Judah in and you come out of the Sunset Tunnel right at the start. At the hotel corner, Golden Gate Park lies just across Stanyan Street if you want to stretch the walk; otherwise head east on Waller Street and back down Cole Street to close the loop at Carl & Cole.",
    },
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
      "Bernal Heights is named for José Cornelio Bernal, whose 1839 Mexican land grant, Rancho Rincón de las Salinas y Potrero Viejo — roughly “salt-marsh corner and old pasture” — took in about 4,446 acres around the hill. After California became part of the United States, the rancho was sold off and cut into small lots. Early settlers, many of them Irish, ran dairies and kept goats on the open slopes, and the goats gave the bare hill a nickname: Nanny Goat Hill.\n\nThe hill is a knob of hard Franciscan chert, and Bernal rode out the 1906 earthquake well; the fire that followed burned itself out at 20th Street in the Mission, well to the north. Afterward the neighborhood filled in, partly with the wooden relief cottages, or “earthquake shacks,” that families hauled out of the refugee camps, and a few still hide among the later houses. In 1940 Holly Courts opened near Holly Park, southwest of the hill, as San Francisco's first public housing project, designed by City Hall architect Arthur Brown Jr.; the same year a new WPA-built branch library opened on Cortland Avenue.\n\nCheap rents and a small-town feel drew newcomers in the 1960s and '70s: antiwar activists in shared houses and collectives, artists, and lesbian households. The radicals earned Bernal another nickname, Red Hill. In 1977 muralists founded Precita Eyes beside Precita Park, and the lesbian bar Wild Side West moved onto Cortland, still the hill's village-scale main street. The treeless crest above is a city park, with views in every direction and off-leash room for the neighborhood's dogs.",
    facts: [
      {
        icon: "art",
        title: "Where Precita Eyes got its name",
        text:
          "Muralists Susan and Luis Cervantes and fellow artists founded Precita Eyes Muralists in 1977 and named it for this park; the group's original studio faces it a short way east of Folsom, at 348 Precita Ave. Its center on 24th Street in the Mission now leads guided walks past Balmy Alley and the neighborhood's other murals.",
        place: "Precita Park & Precita Eyes",
        where: "Folsom St & Precita Ave",
        at: [-122.41349, 37.74710],
        source: "https://www.precitaeyes.org/about.html",
      },
      {
        icon: "park",
        title: "A hilltop made of plankton",
        text:
          "The rust-red, ribbon-layered rock poking through the grass near the top is radiolarian chert, built from the glassy silica skeletons of single-celled plankton that settled on the deep Pacific floor in the age of the dinosaurs. The ocean plate carried it toward North America, where it was scraped off onto the continent's edge, so the summit stands on rock that formed far out at sea.",
        place: "Bernal Heights Park",
        where: "Top of Folsom St",
        at: [-122.41357, 37.74379],
        source: "https://en.wikipedia.org/wiki/Franciscan_Assemblage",
      },
      {
        icon: "stairs",
        title: "Where the street turns into slides",
        text:
          "Where Bernal's slopes get too steep for cars, its streets turn into public stairways, and the Esmeralda Avenue stairway at Winfield Street comes with a pair of long concrete slides running down beside the steps, open to anyone willing to ride.",
        place: "Esmeralda Slide Park",
        where: "Esmeralda Ave steps at Winfield St",
        at: [-122.41811, 37.74353],
        source: "https://bernalwood.com/2014/03/06/remember-when-the-day-when-difi-laughed-her-way-down-the-esmeralda-slides",
      },
      {
        icon: "beer",
        title: "When women couldn't tend bar",
        text:
          "Pat Ramseyer and Nancy White opened Wild Side West in Oakland in 1962, naming it for that year's film Walk on the Wild Side. California law then barred bars from hiring women to tend bar, so women who owned one had to pour themselves or hire a man, until the state Supreme Court struck the law down in 1971. The bar moved here to Cortland Avenue in 1977.",
        place: "Wild Side West",
        where: "424 Cortland Ave",
        at: [-122.41672, 37.73919],
        source: "https://bernalwood.com/2017/08/25/1977-remember-when-wild-side-west-arrived-in-bernal-heights/",
      },
      {
        icon: "book",
        title: "A Civic Auditorium architect's library",
        text:
          "Frederick H. Meyer, one of the three architects of the 1915 Civic Auditorium, designed this branch library, a Works Progress Administration project that opened in 1940, the same year as Holly Courts, the city's first public housing.",
        place: "Bernal Heights Branch Library",
        where: "500 Cortland Ave",
        at: [-122.41601, 37.73921],
        source: "https://sfpl.org/locations/bernal-heights/bernal-heights-library-history",
      },
      {
        icon: "shop",
        title: "California's first farmers' market",
        text:
          "With wartime rationing and labor shortages squeezing them, growers began selling straight to shoppers from their trucks in 1943, in what the city calls California's first farmers' market. It moved to this lot on Alemany Boulevard in 1947 and still runs every Saturday.",
        place: "Alemany Farmers' Market",
        where: "100 Alemany Blvd",
        at: [-122.41096, 37.73478],
        source: "https://www.sfgov.org/ccsfgsa/realestate/alemany-farmers-market-new",
      },
    ],
    walk: {
      intro:
        "A 1.7-mile line for visitors and would-be neighbors, from Precita Park (Folsom St & Precita Ave, where the 67 bus stops, about a 12-minute walk from 24th St Mission BART) up over Bernal Hill, down past the Esmeralda slides and along Cortland Avenue to the Alemany Farmers' Market, where the 23 and 67 buses stop at Crescent Ave & Putnam St for the ride back. Allow about 80 minutes, and go on a Saturday morning, when the market is running.",
      miles: 1.7,
      minutes: 80,
      tip:
        "The only real climb comes first, up Folsom St from Precita Park to the summit, so it is downhill from there; save your coffee stop for Cortland Avenue, between the slides and the library.",
    },
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
      "In the late 1700s Spanish missionaries grazed cattle here and called the hill Potrero Nuevo, the “new pasture.” In 1844 Mexico granted it to Francisco and Ramón de Haro, 17-year-old twin sons of a onetime alcalde of Yerba Buena; in 1846 the twins were shot dead at San Rafael on John C. Frémont's orders. Their father, fearing the United States would take the land, agreed to his friend Dr. John Townsend's plan: in 1849 Townsend and Cornelius De Boom laid out a subdivision, naming north-south streets for American states and east-west ones for California counties, such as Mariposa. Hardly anyone bought the remote lots, and in 1866 the U.S. Supreme Court rejected the de Haro claim.\n\nIndustry took the shore below. Union Iron Works moved its shipyard to Potrero Point in the early 1880s, and by 1892 it employed 1,200 to 1,500 men, many living on the hill or in Irish Hill and Dogpatch. On August 7, 1906, 40 Molokans, members of a Russian Christian sect that had fled persecution, reached the foot of the hill after a failed stint on Hawaii's sugar plantations, and Slovenes who had lost their Fell Street church in the earthquake and fire that April regrouped on what they nicknamed “Carniolan Hill.” In 1922 the Molokans' English and sewing classes moved into a hall by Julia Morgan.\n\nPublic housing arrived in 1941 with Potrero Terrace, cut into the steep south slope and first housing mostly war-industry workers; Potrero Annex followed in 1955. Today US 101 runs along the hill's west side and I-280 along its eastern foot. In 1979 Fritz Maytag moved Anchor Brewing into a 1937 coffee roastery on Mariposa Street.",
    facts: [
      {
        icon: "subway",
        title: "Caltrain's only below-grade stop",
        text:
          "Southern Pacific opened this station in 1907, when it built the Bayshore Cutoff, and first called it 23rd Street. It is the only below-grade station on Caltrain, set in a cut beneath the I-280 viaduct between two tunnels that carry the tracks under the eastern slope of Potrero Hill.",
        place: "22nd Street Station",
        where: "22nd St & Pennsylvania Ave",
        at: [-122.39250, 37.75722],
        source: "https://en.wikipedia.org/wiki/22nd_Street_station_(Caltrain)",
      },
      {
        icon: "house",
        title: "Two of the hill's oldest houses",
        text:
          "The Italianate at 301 Pennsylvania, on the corner of 18th Street, was finished around 1865 on part of a 13-acre tract owned by Captain Charles Adams, who had come to the hill from New Bedford, Massachusetts, in the 1850s; in the late 1860s Adams built his own, larger house across the street. The Potrero View counts the pair among the hill's oldest mansions and among the first San Francisco houses with what became the city's signature bay windows.",
        place: "Richards House",
        where: "301 Pennsylvania Ave",
        at: [-122.39340, 37.76252],
        source: "https://www.potreroview.net/historic-buildings-and-their-stories/",
      },
      {
        icon: "church",
        title: "The church that was cut in two",
        text:
          "By the Dogpatch Neighborhood Association's account, Father Patrick O'Connell built St. Teresa's in 1892 at Tennessee and 19th streets, down by the shipyards in today's Dogpatch. After Irish Hill, the workers' enclave nearby, was demolished during World War I and industry crowded in, the parish moved the church uphill in 1924: movers cut it in two and hauled each half separately to this northeast corner of 19th and Connecticut.",
        place: "St. Teresa of Avila Church",
        where: "1490 19th St",
        at: [-122.39718, 37.76142],
        source: "https://www.dogpatchna.org/st-theresas-church",
      },
      {
        icon: "beer",
        title: "Steam beer in a coffee roastery",
        text:
          "Fritz Maytag, who had rescued an ailing Anchor in 1965, moved the brewery into this former coffee roastery, built in 1937, and brewed the first Anchor Steam here on August 13, 1979. After its owner, Sapporo, closed the brewery in 2023, Chobani founder Hamdi Ulukaya announced in 2024 that he had bought Anchor, and new approvals for its Anchor Steam and Old Foghorn labels have since pointed to a revival.",
        place: "Anchor Brewing",
        where: "1705 Mariposa St",
        at: [-122.40085, 37.76332],
        source: "https://en.wikipedia.org/wiki/Anchor_Brewing_Company",
      },
      {
        icon: "music",
        title: "A substation turned Slovenian hall",
        text:
          "Around 1900 a small Slovenian settlement grew up near Vermont, Rhode Island and Kansas streets, and after the 1906 earthquake and fire destroyed the community's Fell Street church, Slovenes gathered here on what they nicknamed “Carniolan Hill,” after Carniola, a historic region of Slovenia. In 1924, the Potrero View recounts, members raised $10,000 by selling shares, bought a PG&E substation and remodeled it themselves; the hall was established in 1927 as the Slovenian Progressive Home.",
        place: "Slovenian Hall",
        where: "Mariposa St & Vermont St",
        at: [-122.40440, 37.76322],
        source: "https://www.potreroview.net/historic-buildings-and-their-stories/",
      },
      {
        icon: "road",
        title: "Crookeder than Lombard",
        text:
          "The block of Vermont Street that winds down here from McKinley Square at 20th Street packs seven sharp turns, and when the Travel Channel's Fact or Fiction measured its sinuosity against Lombard Street's in 2014, Vermont came out more crooked, 1.56 to 1.2. On Easter Sunday it hosts the Bring Your Own Big Wheel race, which began on Lombard Street and moved here after neighbors there complained.",
        place: "Vermont Street's crooked block",
        where: "Vermont St & 22nd St",
        at: [-122.40380, 37.75700],
        source: "https://en.wikipedia.org/wiki/Vermont_Street_(San_Francisco)",
      },
      {
        icon: "house",
        title: "Julia Morgan's hall for the Molokans",
        text:
          "The Nabe, as this center is known, dates its founding to 1907 and began with English classes; when they outgrew a small rented space, Julia Morgan, the architect of Hearst Castle, designed this hall, finished in 1922, where the hill's Russian Molokans learned English, machine sewing and other skills. In 1924 the building was moved to make way for Southern Heights Avenue, and in 1977 it became city Landmark No. 86.",
        place: "Potrero Hill Neighborhood House",
        where: "953 De Haro St",
        at: [-122.40064, 37.75781],
        source: "https://en.wikipedia.org/wiki/Potrero_Hill_Neighborhood_House",
      },
    ],
    walk: {
      intro:
        "A one-way walk of about 2 miles for visitors and would-be neighbors, starting at Caltrain's 22nd Street station: north to two of the hill's 1860s houses, west along the 18th Street shops to St. Teresa's, past the Anchor brewery and Slovenian Hall on Mariposa Street, then up Vermont Street and down its crooked block, ending at Julia Morgan's Neighborhood House on De Haro Street. Allow about 90 minutes in daylight; on Easter Sunday the Big Wheel race takes over Vermont Street.",
      miles: 2,
      minutes: 90,
      tip:
        "The hill is steep, so wear good shoes, and stop for coffee or lunch early on, along 18th Street between Texas and Connecticut streets, the hill's shopping blocks. At the end, the 19 Polk bus stops at De Haro Street and Southern Heights Avenue, and the 22nd Street station is about half a mile to the east.",
    },
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
      "Glen Park grew up beside Glen Canyon, the rocky ravine at its western edge where Islais Creek rises. In 1868 the Giant Powder Company, licensed by Alfred Nobel, began making dynamite in the canyon, until an explosion destroyed the works in 1869. Amusements came next. In 1897 Archibald S. Baldwin, the developer who gave the district its name, announced a Glen Park Company to run a zoological garden, and in 1898 his Glen Park – Mission Zoo opened. Weekend crowds of 8,000 to 15,000 came for vaudeville, daring aeronautic displays, sporting events and animal acts.\n\nBut the home lots Baldwin offered from 1899 in his Glen Park Terrace, on Glen Avenue, today's Chenery Street, sold slowly, even though Behrend Joost's San Francisco & San Mateo Railway, which the SFMTA calls the city's first electric streetcar line, had run along Chenery since 1892. By 1903 Baldwin had sold out. The canyon became a picnic ground whose company and private parties were known for boisterous drinking, until the city bought it in 1922; in the late 1930s the Works Progress Administration built its recreation center.\n\nIn the 1960s freeway plans threatened both village and canyon. Three neighbors remembered as the Gum Tree Girls, Zoanne Nordstrom, Joan Seiwald and Geri Arkush, fought for Glen Canyon, where Seiwald feared a freeway would take out second base, and the Freeway Revolt stopped the Crosstown Freeway planned beside Bosworth Street. Interstate 280 did come, and cost the neighborhood its library building. Then, on November 5, 1973, BART opened Glen Park station, a block south of the village crossroads at Diamond and Chenery streets.",
    facts: [
      {
        icon: "subway",
        title: "BART's brutalist crown jewel",
        text:
          "Service began here on November 5, 1973. The firm Corlett & Spackman designed the station with architect Ernest Born, who also designed the graphics for the whole BART system; a Chronicle critic calls it Born's final building, a subterranean station lit by skylights, and a multicolored mural of several kinds of marble graces its light-filled concourse. Docomomo US says many consider it the architectural crown jewel of BART, and in 2019 it was listed on the National Register of Historic Places.",
        place: "Glen Park BART Station",
        where: "Diamond St & Bosworth St",
        at: [-122.43411, 37.73351],
        source: "https://www.docomomo-us.org/register/glen-park-bart-station",
      },
      {
        icon: "book",
        title: "The library that wandered 42 years",
        text:
          "Glen Park's library began in September 1908 as Delivery Station F, in a dry-goods store at 2975 Diamond Street, now the site of the BART station, after the Glen Park Outdoor Art League pushed for one. It became a full branch in January 1927 and settled at 700 Bosworth Street, at Lippard Avenue. After almost 38 years there, that building was demolished during construction of Interstate 280, and the branch spent 42 years in temporary quarters until it opened here, in a new mixed-use building, on October 13, 2007.",
        place: "Glen Park Branch Library",
        where: "2825 Diamond St",
        at: [-122.43347, 37.73404],
        source: "https://www.glenparkhistory.org/glen-park-s-roving-branch-library",
      },
      {
        icon: "music",
        title: "Jazz among the bookshelves",
        text:
          "This independent bookshop, founded in 1999 on the village's stretch of Chenery Street, doubles as a music room. In 2007 an allied nonprofit, the Bird & Beckett Cultural Legacy Project, was set up to take over the shop's ever-expanding slate of cultural programs, and its 2026 calendar lists live jazz among the shelves several times a week.",
        place: "Bird & Beckett Books and Records",
        where: "653 Chenery St",
        at: [-122.43316, 37.73444],
        source: "https://www.jazznearyou.com/world/events/rova-at-bird-and-beckett-books-and-records-on-june-13",
      },
      {
        icon: "factory",
        title: "Nobel's dynamite, made in this canyon",
        text:
          "A plaque at the Elk Street entrance to Glen Canyon Park marks California Historical Landmark No. 1002, the site of the first dynamite factory in the United States. Here the Giant Powder Company, under the personal license of inventor Alfred Nobel, began making dynamite on March 19, 1868, until an explosion on November 26, 1869, destroyed the works; the company moved on, settling at Point Pinole in 1892.",
        place: "First Dynamite Factory Site",
        where: "Elk St & Chenery St",
        at: [-122.43989, 37.73627],
        source: "https://noehill.com/SF/LANDMARKS/cal1002.asp",
      },
      {
        icon: "water",
        title: "A creek still in daylight",
        text:
          "Islais Creek rises in Glen Canyon, and its water still runs in the open along the canyon floor here. At the southern end of the canyon, behind the recreation center the Works Progress Administration built in the late 1930s, it enters a culvert; from its sources here, the whole creek once stretched about 3.5 miles to San Francisco Bay.",
        place: "Islais Creek",
        where: "70 Elk St",
        at: [-122.44086, 37.73750],
        source: "https://en.wikipedia.org/wiki/Islais_Creek",
      },
      {
        icon: "park",
        title: "A freeway route turned greenway",
        text:
          "The strip of land parallel to Bosworth Street between Brompton and Burnside is made of parcels left over from property acquired for the Crosstown Freeway, designed to carry 48,000 vehicles a day beside Bosworth until the Freeway Revolt of the 1960s stopped it. It runs along the former banks of Islais Creek. In 2012 the Glen Park Association proposed restoring it as the Glen Park Greenway, since designated a Street Park, and neighbors have planted it in work parties with the Public Works Green Team.",
        place: "Glen Park Greenway",
        where: "Bosworth St & Lippard Ave",
        at: [-122.43584, 37.73388],
        source: "https://glenparkassociation.org/greenway",
      },
    ],
    walk: {
      intro:
        "A loop of about 1.3 miles for visitors and would-be neighbors that starts and ends at Glen Park BART (Diamond St & Bosworth St, also served by the J Church and the 23, 35, 36, 44 and 52 buses), through the village on Diamond and Chenery streets, out Chenery to Glen Canyon Park and its creek, and back along Bosworth St. Allow about an hour, and go by day, when the canyon trail is easiest to follow.",
      miles: 1.3,
      minutes: 60,
      tip:
        "Bird & Beckett's nonprofit presents live music at least three times a week, so check its calendar before you go and time the walk to end with a show back in the village.",
    },
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
      "The old dairy valley's quieter western end — leafy Victorian and Edwardian blocks running from Steiner to the Presidio's edge, a short stroll from Union Street's boutiques and brunch.",
    reasons: [
      "Steps from Union St shops",
      "Flat & walkable",
      "Between Marina & Pac Heights",
      "Presidio at the western edge",
    ],
    history:
      "Cow Hollow is named for the dairy farms that once filled this valley below the Pacific Heights ridge; the city's Board of Health removed them in the 1880s. During the Gold Rush, Spanish and Indian women washed clothes in a spring-fed lake near today's Lombard, Filbert, Gough and Octavia streets, known as Washerwoman's Lagoon. Waste from the city's first slaughterhouses, set up in the 1850s near Pacific and Larkin, drained into the streams that fed it, and in the 1880s officials judged the lagoon a health hazard and filled it in.\n\nPierce Street was still a country road through the hollow when Henry Casebolt, a Virginia blacksmith who had brought his wife and eleven children to San Francisco in 1851, built his Italianate house on it around 1865; it survives as city Landmark No. 51. On October 23, 1880, the Presidio & Ferries Railroad opened a cable line along Union Street as far as Steiner, where a steam dummy carried riders on toward the Presidio, and in 1891 an Episcopal church rose at that corner on land given by the journalist Frank M. Pixley. In 1906 crews dynamited buildings along Van Ness Avenue to halt the fire's westward advance, well east of this end of the valley.\n\nThe Carnegie-funded branch library that opened in 1918 at Green and Octavia streets, designed by Ernest Coxhead, has always been known as the Golden Gate Valley Branch. When the Golden Gate Bridge opened in May 1937, Lombard Street, planned as its main approach, was widened from two lanes to six, and motor lodges soon lined it; it still carries U.S. 101 along the neighborhood's northern edge.",
    facts: [
      {
        icon: "church",
        title: "A church on Pixley's land",
        text:
          "The Episcopal Church of St. Mary the Virgin went up in 1891 at the southwest corner of Union and Steiner, on land given by Frank M. Pixley, the journalist and politician who owned much of the land around it. Around 1951 the church was turned around inside: the altar moved to the Steiner Street end, and the entrance moved to Union Street, facing a newly created courtyard.",
        place: "St. Mary the Virgin Episcopal Church",
        where: "2325 Union St",
        at: [-122.43735, 37.79662],
        source: "https://test.opensfhistory.org/photo/wnp58.070",
      },
      {
        icon: "road",
        title: "Where the city once ended",
        text:
          "In the early 1850s the Presidio reached all the way to this line, which was then also the city's western boundary; today the Presidio's edge is three blocks west, at Lyon Street. The Museum of the City of San Francisco traces Divisadero to a Spanish word for a hilltop spot with a long view, first applied to Lone Mountain, and says it became a street name on the 1856 map of the Western Addition; until 1909 it was spelled Devisadero.",
        place: "Divisadero Street",
        where: "Union St & Divisadero St",
        at: [-122.44208, 37.79624],
        source: "https://sfmuseum.org/street/stnames6.html",
      },
      {
        icon: "tram",
        title: "Where cable cars met steam",
        text:
          "The Presidio & Ferries Railroad's Union Street cable line was extended in 1892 over new tracks on Union and Baker streets, and from Greenwich Street a steam dummy ran on down Baker to the Harbor View resort, on the shore that later became the Marina. The 1906 earthquake damaged this line more than any other cable line in the city, and it was converted to electric power; Muni took it over in 1913, and its 45 Union–Stockton buses still stop at this corner.",
        place: "Baker & Greenwich",
        where: "Baker St & Greenwich St",
        at: [-122.44569, 37.79761],
        source: "https://cablecarmuseum.org/co-presidio-ferries.html",
      },
      {
        icon: "park",
        title: "A forest the Army planted",
        text:
          "An 1870s map already put the Presidio's eastern boundary on the western line of Lyon Street, and much of the forest beyond it was planted. In 1883 Maj. William A. Jones proposed trees to break the wind off the sand dunes and set the post apart from the city, and from about 1886 the Army set out eucalyptus, Monterey cypress and Monterey pine; since 2003 the Presidio Trust has been replacing the aging stands, planting 9,500 trees on 60 acres through 2024.",
        place: "Presidio boundary",
        where: "Lyon St & Greenwich St",
        at: [-122.44712, 37.79745],
        source: "https://www.nps.gov/goga/blogs/planting-with-a-purpose-eucalyptus-and-the-u-s-army.htm",
      },
      {
        icon: "flag",
        title: "The main gate to town",
        text:
          "The Lombard Gate's sandstone posts and the wall beside them date to about 1894–97; for much of the Presidio's history this was its main gate to town, and around 1898 the 51st Iowa Volunteer Infantry marched out through it, bound for the Philippines. Two cannons taken as Spanish-American War trophies flank it. Spain founded the post in 1776, Mexico took over in 1822 and the United States in 1846, and on October 1, 1994, the Army handed it to the National Park Service.",
        place: "Lombard Gate",
        where: "Lombard St & Lyon St",
        at: [-122.44734, 37.79847],
        source: "https://www.nps.gov/places/000/lombard-gate.htm",
      },
      {
        icon: "bridge",
        title: "Main street to the bridge",
        text:
          "Lombard Street was planned as the main approach to the Golden Gate Bridge, which opened to pedestrians on May 27, 1937, and to cars the next day; it still carries U.S. 101 from Van Ness Avenue to Richardson Avenue. Right after the opening, KQED reports, officials widened it from two lanes to six by clearing the south side, and dozens of motor lodges then lined that side; the first on the street, the Marina Motel on the north side, began taking guests in 1939.",
        place: "Lombard Street motels",
        where: "Lombard St & Divisadero St",
        at: [-122.44267, 37.79903],
        source: "https://www.kqed.org/news/12058829/why-are-there-so-many-motels-on-san-franciscos-lombard-street",
      },
    ],
    walk: {
      intro:
        "A walk of about a mile for visitors and would-be neighbors: start at Union and Steiner streets, served by the 22 Fillmore and 45 Union–Stockton buses, follow Union west and Baker north to Greenwich, meet the Presidio at Lyon Street, then come back east along Lombard to Divisadero, where the 28 and 43 buses stop. Allow about 45 minutes, in daylight; a weekday morning is quietest.",
      miles: 1,
      minutes: 45,
      tip:
        "Before heading west, walk one block along Union to Pierce Street and turn left: just past Green Street is the Casebolt House at 2727 Pierce St, built for blacksmith Henry Casebolt around 1865 and now city Landmark No. 51. It's a private home, so admire it from the sidewalk, then rejoin Union Street.",
    },
    nearby: ["Union Street"],
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
      "The 45 Union–Stockton bus runs the length of Union Street toward downtown, with the 22 Fillmore and 43 Masonic crossing toward the rest of the city. There's no rail nearby — it's a bus-and-walk neighborhood.",
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
      "This wedge was once part of Sans Souci Valley, which carried storm runoff from Buena Vista Hill and Lone Mountain toward today's Duboce Park, along the route cyclists now call the Wiggle. The Van Ness Ordinance set the future park aside as a public reservation, an 1861 engineer's map labeled it “hospital site,” and the area began to develop in the 1860s as a prestigious rural exurb. In 1878 the German General Benevolent Society opened its new hospital on the block bounded by 14th, Ridley, Noe and Castro streets, and when cable car lines pushed up Market Street in the 1880s, merchant builders followed with rows of nearly identical Victorians.\n\nNo hospital ever rose on the reservation. After a court awarded parts of it to two claimants in the late 1880s, houses and flats went up on those lots, many by builder Fernando Nelson and most between 1899 and about 1905. Victor Duboce, an officer of the First California Volunteer Infantry in the Philippines who won a seat on the Board of Supervisors after coming home, died in August 1900; the supervisors renamed Ridley Street for him and made the rest of the reservation Duboce Park, whose name the neighborhood now shares. After the 1906 earthquake and fire, several dozen flats and apartment buildings followed.\n\nBy the 1960s the area had been labeled “blighted” and was threatened with redevelopment, but in the 1970s residents began renovating its older houses. The park and nearly 90 houses beside it became the Duboce Park Landmark District in 2013, and in March 2026 supervisors began landmarking an 1875 Greek Revival house on 15th Street and an 1892 row on Henry Street.",
    facts: [
      {
        icon: "house",
        title: "A Stick-Eastlake row of 1892",
        text:
          "These rowhouses on the south side of Henry Street went up in 1892, as Duboce Triangle was turning from an exurb of large-lot Victorian villas into a middle-class neighborhood. On March 3, 2026, supervisors began making them a city landmark, and the designation ordinance calls them a rare Stick-Eastlake rowhouse with much of its original character intact: note the wooden ornament at the cornice and porches, the bay windows, the portico turret and the compound roof. They are private homes, so admire them from the sidewalk.",
        place: "Henry Street Rowhouses",
        where: "191-197 Henry St",
        at: [-122.43528, 37.76656],
        source: "https://media.api.sf.gov/documents/o0173-26.pdf",
      },
      {
        icon: "pin",
        title: "The German Hospital's block",
        text:
          "The German General Benevolent Society, formed in 1854 to serve German immigrants, lost its Brannan Street hospital to fire in 1876 and formally opened a new one on this block on February 22, 1878. A new hospital rose here between about 1905 and 1908, was renamed Franklin Hospital, for Benjamin Franklin, during World War I, became Ralph K. Davies Medical Center in 1968 and joined California Pacific Medical Center in 1998. Sutter Health credits the founder, Dr. Joseph N. Rausch, with proposing one of the country's first prepaid health plans.",
        place: "CPMC Davies Campus",
        where: "45 Castro St",
        at: [-122.43521, 37.76824],
        source: "https://www.sutterhealth.org/about/cpmc-history",
      },
      {
        icon: "tram",
        title: "Where the N dives into the hill",
        text:
          "N Judah trains run along Duboce Avenue on the park's southern edge, then dive into the east portal of the Sunset Tunnel, originally the Duboce Tunnel, which opened to large crowds on October 21, 1928, with Mayor James Rolph leading a streetcar parade. The Duboce and Noe stop opened the same day, its two side platforms lining the park's south edge; 4,232 feet later, the trains come back into daylight near Carl and Cole streets.",
        place: "Sunset Tunnel East Portal",
        where: "Duboce Ave & Noe St",
        at: [-122.43444, 37.76917],
        source: "https://en.wikipedia.org/wiki/Sunset_Tunnel",
      },
      {
        icon: "art",
        title: "Renamed for Harvey Milk in 1978",
        text:
          "Built in 1954 at the park's Scott Street end, this building, commonly called “Drama, Dance & Music,” was headquarters of the Recreation and Park Department's Performing Arts Division. In December 1978, weeks after Supervisor Harvey Milk was killed, the Recreation and Park Commission approved renaming it for him. On its lower level, the Harvey Milk Photo Center traces its start to the city's first camera room, created in 1949 at the Hayes Valley Recreation Center, and settled here in 1954.",
        place: "Harvey Milk Recreational Arts Center",
        where: "50 Scott St",
        at: [-122.43470, 37.76960],
        source: "https://www.harveymilkphotocenter.org/?p=31",
      },
      {
        icon: "park",
        title: "A hospital site that became a park",
        text:
          "The Van Ness Ordinance set this ground aside as a public reservation, an 1861 engineer's map labeled it “hospital site,” and in the 1880s and ’90s it was leased to the San Francisco Female Hospital for a building that was never built. In the late 1880s a district court awarded parts of it to two claimants, which gave the park its irregular shape and opened lots for the houses along its north side. The park and nearly 90 of those houses became the Duboce Park Landmark District in 2013.",
        place: "Duboce Park",
        where: "Duboce Ave & Steiner St",
        at: [-122.43230, 37.76955],
        source: "https://friendsofdubocepark.org/about-us/history-of-duboce-park/",
      },
      {
        icon: "road",
        title: "A 340-foot ride to the ocean",
        text:
          "Mona Caron's first mural, unveiled on November 21, 1998, runs about 340 feet along the back wall of the Market Street Safeway beside the Duboce Bikeway, which her site calls the first stretch of San Francisco street converted from car use to bicycle and pedestrian use; city planner Peter Tannen wrote a mural into the bikeway's budget. The 6,000-square-foot painting follows a virtual ride from downtown to Ocean Beach, past the Wiggle and Golden Gate Park, and paints the Wiggle as a waterway, a nod to the creek that once ran down its canyon.",
        place: "Duboce Bikeway Mural",
        where: "Duboce Ave & Church St",
        at: [-122.42880, 37.76932],
        source: "https://monacaron.com/murals/making-and-unveiling-duboce-bikeway-mural",
      },
      {
        icon: "music",
        title: "Odin and Freja on Market Street",
        text:
          "After the 1906 earthquake and fire destroyed Scandia Hall, its earlier meeting place, the Swedish Society of San Francisco bought this lot in July 1906, and Swedish-born architect August Nordin designed the combined social hall and commercial building it finished in 1907. Its lodge rooms take their names from Norse mythology, among them Odin, Freja, Balder and Valhalla, and Café du Nord opened in its basement in 1908. The city made it Landmark No. 267 in 2015 and unveiled the first of its new landmark plaques here on May 11, 2017.",
        place: "Swedish American Hall",
        where: "2168-2174 Market St",
        at: [-122.43049, 37.76672],
        source: "https://npgallery.nps.gov/GetAsset/c1fbd798-b200-4766-816d-60cecbbf4934",
      },
      {
        icon: "house",
        title: "Greek Revival, from 1875",
        text:
          "Built in 1875, before cable cars brought the neighborhood its rows of Victorians in the 1880s, this house is in the Greek Revival style, a pre-Victorian form that supervisors' March 2026 landmark resolution calls rare in San Francisco. The city's Duboce Triangle historic context statement had already found it eligible to be a city landmark. It is a private home, so view it from the sidewalk.",
        place: "Duboce Triangle Greek Revival Home",
        where: "2173 15th St",
        at: [-122.43263, 37.76570],
        source: "https://www.sfbos.org/sites/default/files/r0097-26.pdf",
      },
    ],
    walk: {
      intro:
        "A loop of about 1.6 miles for visitors and would-be neighbors: from Castro Station (Muni Metro K, L and M; the F streetcar ends at 17th & Castro), walk north on Castro Street past 16th and 15th streets to Henry Street, cross Duboce Park past the N Judah's tunnel portal, then come back along Market and 15th streets. Allow about 70 minutes, in daylight so you can see the houses' details.",
      miles: 1.6,
      minutes: 70,
      tip:
        "Halfway around, the Duboce & Church stop (N and J trains, 22 Fillmore) and Church St Station, a block south, let you cut the loop short. Otherwise finish on 15th Street, a short block from the F streetcar's Market & Noe stop and about a quarter mile from Castro Station.",
    },
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
      "South of Market grew up as the city's workshop. Near today's Transbay Transit Center the ground was once under the bay; as it was filled, shipbuilders moved in, followed by foundries and boiler works, and an archaeology report found that in the second half of the 1800s most residents of alleys there, like Natoma and Minna, came from Ireland. Market Street's iron cable-car slot gave the district its old nickname, “South of the Slot.” Jack London's 1909 story of that name put the theaters, hotels and banks north of the Slot, and south of it “the factories, slums, laundries, machine-shops, boiler works, and the abodes of the working class.”\n\nIn 1906 filled land gave way under Sixth and Howard, where big lodging houses collapsed, killing hundreds, and the GSA says only two structures south of Market survived the quake and fires: the 1874 Mint and the new post office at Seventh and Mission. While a new City Hall was built, city government worked from a Market Street building that later became the Hotel Whitcomb.\n\nLater, urban renewal pushed Filipino San Franciscans out of Manilatown on Kearny Street, the Fillmore and the Yerba Buena blocks, and SoMa's Mint Mall and Hall became a center of organizing; in 2016 the city recognized the SoMa Pilipinas cultural heritage district. In 1966 Fe-Be's opened at Folsom and 11th as Folsom Street's first leather bar, beginning what became the “Miracle Mile” of more than 30 gay bars, shops and bathhouses by the late 1970s. In 1984 Kathleen Connell and Michael Valerio started the Folsom Street Fair to show the neighborhood didn't need “revitalizing,” and in 2018 supervisors created the Leather and LGBTQ Cultural District.",
    facts: [
      {
        icon: "star",
        title: "The post office that's a palace",
        text:
          "Ground was broken here in 1897, and the post office and courthouse opened in 1905 to acclaim as “a post office that's a palace,” its interior finished so finely that officials brought in skilled artisans from Italy, the GSA says. By the GSA's account, it and the 1874 Mint were the only structures south of Market to survive the 1906 earthquake and fires. Named the U.S. Court of Appeals Building for the Ninth Circuit in 1996, it has carried Judge James R. Browning's name since 2005.",
        place: "James R. Browning U.S. Courthouse",
        where: "95 7th St",
        at: [-122.41155, 37.77934],
        source: "https://origin-www.gsa.gov/node/161218",
      },
      {
        icon: "quake",
        title: "The corner where hundreds died",
        text:
          "The Chronicle titled its history of this corner “Sixth and Howard, where hundreds died”: in 1906 the Brunswick House rooming house stood on its northwest corner, and the Nob Hill Gazette counts at least 300 dead when four large boardinghouses near here collapsed as the filled ground under them liquefied. Sixth Street was rebuilt with 33 low-budget residential hotels from 1906 through 1913, which the Board of Supervisors calls the last surviving sizable group of low-budget residential hotels built after the earthquake.",
        place: "Sixth & Howard",
        where: "6th St & Howard St",
        at: [-122.40699, 37.77975],
        source: "https://www.sfchronicle.com/bayarea/article/sixth-and-howard-where-hundreds-died-4588225.php",
      },
      {
        icon: "park",
        title: "Two golds for a SoMa kid",
        text:
          "Vicki Manalo Draves, born in San Francisco in 1924 to a Filipino father and an English mother, grew up in South of Market, and at the 1948 London Olympics she became the first woman to win both the springboard and platform diving titles at the same Games. After SoMa's Filipino community pushed the city to honor her from 1999 to 2006, this two-acre park, an acre for each gold medal, was named for her in October 2006.",
        place: "Victoria Manalo Draves Park",
        where: "Folsom St & Sherman St",
        at: [-122.40638, 37.77765],
        source: "https://en.wikipedia.org/wiki/Vicki_Draves",
      },
      {
        icon: "road",
        title: "Bootprints in the alley",
        text:
          "Look down along Ringold Alley: metal bootprints along the curb honor 28 people from leather history, a design that the Exiles' Ringold Alley project page says was based on Stompers founder Mike McNamee's Dehner motorcycle boots. A black granite marker reproduces Mike Caffee's “Leather David” statue, made for Fe-Be's, and Chuck Arnett's Tool Box mural, with a narrative by Gayle Rubin. Paid for from the adjacent L7 development's public-benefit fee, the installation was unveiled on July 27, 2017, on the alley that hosted the first Up Your Alley fair in 1985.",
        place: "Ringold Alley",
        where: "Ringold St & 8th St",
        at: [-122.40915, 37.77433],
        source: "https://en.wikipedia.org/wiki/San_Francisco_South_of_Market_Leather_History_Alley",
      },
      {
        icon: "flag",
        title: "A landmark leather bar",
        text:
          "Opened in 1981 at 12th and Harrison, the SF Eagle became city Landmark No. 295 on October 29, 2021, which the Bay Area Reporter called the city's first leather-related landmark. Outside it, about 12,500 square feet of 12th Street between Harrison and Bernice became Eagle Plaza, which broke ground in June 2019 and which the bar calls the world's first public space centering queer history and the leather community. At the plaza's Harrison Street entrance, a flagpole flying an oversized Leather Pride flag was dedicated in September 2019, at the start of Leather Week.",
        place: "SF Eagle & Eagle Plaza",
        where: "398 12th St",
        at: [-122.41345, 37.77008],
        source: "https://en.wikipedia.org/wiki/San_Francisco_Eagle",
      },
      {
        icon: "church",
        title: "An Irish parish turned Filipino",
        text:
          "Designed by John J. Foley and built in 1913–14 in the Romanesque Revival style, St. Joseph's became a city landmark in 1980 and joined the National Register in 1982. Its parish began predominantly Irish and was mainly Filipino when it closed after the 1989 Loma Prieta earthquake damaged the church; the city red-tagged it, and it stood vacant until 2018. Its conversion created about 22,000 square feet of creative office space and about 10,000 square feet of outdoor community space.",
        place: "St. Joseph's Church",
        where: "1401 Howard St",
        at: [-122.41437, 37.77370],
        source: "https://en.wikipedia.org/wiki/St._Joseph%27s_Church_and_Complex",
      },
      {
        icon: "mayor",
        title: "City Hall's stand-in",
        text:
          "Completed in 1912, this building served as San Francisco's temporary city hall; OpenSFHistory dates that role from 1912 to 1915, and Densho's encyclopedia says it briefly held the city jail as well. In 1917 it reopened as the Hotel Whitcomb.",
        place: "Hotel Whitcomb",
        where: "1231 Market St",
        at: [-122.41506, 37.77807],
        source: "https://en.wikipedia.org/wiki/Hotel_Whitcomb",
      },
    ],
    walk: {
      intro:
        "A flat loop of about 2.3 miles for visitors and would-be neighbors, starting and ending at Civic Center Station (BART and Muni Metro) on Market Street at 7th and 8th: down Sixth Street, along Folsom, Ringold and Harrison through the SoMa Pilipinas and Leather and LGBTQ cultural districts, and back up 10th Street to Market. Allow about an hour and 40 minutes with stops, and go in daylight so you can read the markers set along Ringold Alley.",
      miles: 2.3,
      minutes: 100,
      tip:
        "The Ringold Alley bootprints run along the curb, so walk the alley end to end, from 8th Street to 9th, with your eyes down. From the Whitcomb, Civic Center Station is a short walk back up Market Street.",
    },
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
      "Presidio Heights grew up along the low stone wall that marks the Presidio's southern edge, and the cable cars arrived early: on May 30, 1879, the California Street line opened its extension west from Fillmore Street to Central Avenue, today's Presidio Avenue. In 1895 the Rev. Joseph Worcester's Swedenborgian congregation opened a small church at Lyon and Washington streets that the National Park Service calls one of the West Coast's earliest expressions of the Arts and Crafts movement. In 1901 Ernest Coxhead designed a Shingle Style house for Julian Waybur on the wedge of Pacific Avenue that the wall pinches to a point at Walnut Street.\n\nGrander houses followed. From 1902 to 1904 Marcus and Corinne Koshland built a copy of Versailles' Petit Trianon at Washington and Maple streets and opened it with a Marie Antoinette costume ball. In 1909 Morris Meyerfeld, president of the Orpheum theater circuit, gave his daughter Elizabeth and her husband, Leon Roos, a Tudor Revival house by Bernard Maybeck on Jackson Street. On Sacramento Street a movie house called the Elite opened around 1910; it has been the Vogue since the late 1930s.\n\nIn the 1950s the cable cars were cut back to Van Ness Avenue, and preservation became the next chapter: the Roos House became city Landmark No. 56 in 1973, the Koshland house No. 95 in 1977, and the Swedenborgian church a National Historic Landmark in 2004. In 2019 the city renamed the playground it runs just inside the wall, dropping congressman Julius Kahn's name, and today a stretch of West Pacific Avenue, the road inside the wall, is closed to cars.",
    facts: [
      {
        icon: "movie",
        title: "A movie house since about 1910",
        text:
          "This single-screen theater opened around 1910 as the Elite, though the city's landmark resolution dates its construction to about 1912. It became the Rex in 1919 and the Plaza by 1932, then reopened as the Vogue in the late 1930s. In 2007 the nonprofit San Francisco Neighborhood Theater Foundation bought it to keep it running; its marquee and neon signs were restored in 2025, and in 2026 the Board of Supervisors began the process of making it a city landmark, calling it one of San Francisco's oldest surviving cinemas.",
        place: "Vogue Theatre",
        where: "3290 Sacramento St",
        at: [-122.44680, 37.78845],
        source: "https://media.api.sf.gov/documents/r0176-26.pdf",
      },
      {
        icon: "church",
        title: "Madrone logs hold up the roof",
        text:
          "The Rev. Joseph Worcester, who came to San Francisco from Boston in 1867, bought the land and worked with A. Page Brown, A. C. Schweinfurth and Bernard Maybeck on this small church, which opened for worship on March 17, 1895. Bark-covered madrone logs hold up its heavy tile roof, and William Keith's paintings of California landscapes through the four seasons hang inside. The National Park Service calls it one of the West Coast's earliest expressions of the Arts and Crafts movement, and in 2004 it was named a National Historic Landmark.",
        place: "Swedenborgian Church",
        where: "2107 Lyon St",
        at: [-122.44625, 37.79035],
        source: "https://en.wikipedia.org/wiki/Swedenborgian_Church_(San_Francisco)",
      },
      {
        icon: "house",
        title: "A Maybeck wedding present",
        text:
          "Morris Meyerfeld, president of the Orpheum theater circuit, commissioned Bernard Maybeck to design this house as a wedding present for his daughter, Elizabeth, and her husband, Leon Roos, and it was built while the couple was in Europe. Maybeck's 1909 design is Tudor Revival with Gothic ornament, and he also designed its light fixtures and some of its furniture. It became city Landmark No. 56 in 1973 and joined the National Register in 2009, and in 2017 it went on the market for the first time.",
        place: "Roos House",
        where: "3500 Jackson St",
        at: [-122.45270, 37.79040],
        source: "https://noehill.com/SF/LANDMARKS/sf056.asp",
      },
      {
        icon: "house",
        title: "Versailles on Washington Street",
        text:
          "Marcus and Corinne Koshland built this copy of the Petit Trianon at Versailles from 1902 to 1904, on a corner lot that was a gift from her father, after Corinne fell for the original on a trip to Europe in 1900. Architect Franklin S. Van Trees modeled its Washington Street facade on the original's west, or garden, facade, and the Koshlands opened it with a Marie Antoinette costume ball. The 1906 earthquake damaged the facade, which was quickly restored, and the private home became city Landmark No. 95 in 1977.",
        place: "Koshland House",
        where: "3800 Washington St",
        at: [-122.45590, 37.78915],
        source: "https://noehill.com/SF/LANDMARKS/nat1984001186.asp",
      },
      {
        icon: "road",
        title: "The gate's missing capstone",
        text:
          "The U.S. Army put up this gate on the Presidio's southern edge in 1896. In the 1990s a truck knocked a capstone off one of its piers, and the stone sat in storage in the Marin Headlands until 2008, when the Presidio Trust had the stone carvers of Stonesculpt repair the cracked piers, recarve lost details from old photographs and put the capstone back on the southwest pier. The roughly $100,000 job won a California Preservation Foundation award in 2009.",
        place: "Arguello Gate",
        where: "Arguello Blvd & Jackson St",
        at: [-122.45930, 37.78945],
        source: "https://presidio.gov/about/press/presidios-historic-arguello-gate-gets-facelift",
      },
      {
        icon: "park",
        title: "A playground renamed in 2019",
        text:
          "Until 2019 this city playground just inside the Presidio was named for Julius Kahn, a local congressman who introduced a bill to make the Chinese Exclusion Act permanent; it was made permanent in 1902 and stood until Congress repealed it in 1943. After a push by Chinese for Affirmative Action and the Chinese Historical Society, the Recreation and Park Commission voted unanimously on September 19, 2019, to rename it, and Presidio Wall beat names such as West Pacific Playground in public outreach.",
        place: "Presidio Wall Playground",
        where: "Spruce St & W Pacific Ave",
        at: [-122.45415, 37.79048],
        source: "https://www.nichibei.org/2019/09/s-f-rec-and-park-commission-approves-renaming-julius-kahn-playground/",
      },
      {
        icon: "house",
        title: "Shingled houses on a wedge",
        text:
          "NoeHill lists Bernard Maybeck, Willis Polk, Julia Morgan, Ernest Coxhead, Albert Farr and William Knowles among the architects of the 3200 and 3300 blocks of Pacific Avenue. On the north side of the 3200 block, the houses step down the hill as the Presidio wall narrows the block, until it pinches out to a sharp point at Walnut Street. Coxhead's Julian Waybur House of 1901 here joined the National Register in 2011 as an outstanding example of how he combined the American Shingle Style with European Revival styles.",
        place: "Julian Waybur House",
        where: "3232 Pacific Ave",
        at: [-122.44807, 37.79178],
        source: "https://noehill.com/SF/LANDMARKS/poi_presidio_wall.asp",
      },
    ],
    walk: {
      intro:
        "A loop of about 2.2 miles for visitors and would-be neighbors from the 1, 2 and 43 buses at California St & Presidio Ave: past the Vogue and the Swedenborgian church, west along Jackson and Washington streets to the Arguello Gate, then back east inside the Presidio on West Pacific Avenue, a stretch closed to cars, leaving by the Presidio Avenue gate beside the shingled houses of Pacific Avenue. Allow about 90 minutes and pick a dry day for the stretch inside the wall; the 43 stops a block south at Presidio Ave & Jackson St.",
      miles: 2.2,
      minutes: 90,
      tip:
        "Near the east end of West Pacific Avenue, where it meets Presidio Boulevard just before the gate, look for Andy Goldsworthy's Wood Line (2011), eucalyptus branches laid in a long, sinuous curve through a grove just off Lovers' Lane; it is free and open to the public. The houses on this walk are private, so enjoy them from the sidewalk.",
    },
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
      "The Spanish reportedly called it Loma Alta, the high hill, and early San Franciscans knew it by other names, Goat Hill among them. The name that stuck came in September 1849, when a semaphore station went up on the summit, its arms signaling to the merchants, wholesalers and speculators below what kind of ship was entering the Golden Gate.\n\nSailing ships that brought cargo to San Francisco needed ballast to leave, and rock for it was quarried from the hill's bay side. From their quarry at Green and Sansome streets, the Gray brothers kept blasting into the eastern face: in January 1894 one explosion set off a rockslide that crushed a duplex on Vallejo Street, and in 1895 a judge permanently barred them from blasting on the hill, yet they carried on. Around 1900 George Gray argued that cutting Telegraph Hill down would give the east side of Russian Hill a magnificent marine view. The digging ended only in 1914, when a worker who could not collect his back wages shot and killed him.\n\nBy 1906 the slopes were a working-class quarter of Irish and Italian immigrants. In that year's fire, residents fought the flames with water they had saved and with wine fermenting in Italian families' basements, and some of their simple cottages were among the few buildings the fire spared. For decades afterward the hill remained an isolated neighborhood of working-class immigrants and artists, and in 1933 Coit Tower rose on its summit. In 2003 Judy Irving's documentary The Wild Parrots of Telegraph Hill made famous the flock of cherry-headed conures, descended from escaped or abandoned pets, that roams the hill.",
    facts: [
      {
        icon: "quake",
        title: "Saved with wine-soaked burlap",
        text:
          "Built around 1865, this Italianate house stands on land believed to be the site of Hudson's Windmill, which probably burned in the July 4, 1861, fire that destroyed many of the hill's buildings. In 1906 the fire was contained at Montgomery Street, and the house's National Register nomination says a tenant, his oldest son and neighbors cooled its walls with burlap sacks soaked in wine from casks in the basement. One of a handful of buildings on the hill to survive the fire, it joined the National Register in 1979.",
        place: "Montgomery Street Italianate",
        where: "1254 Montgomery St",
        at: [-122.40420, 37.80060],
        source: "https://noehill.com/SF/LANDMARKS/nat1979000532.asp",
      },
      {
        icon: "movie",
        title: "Lauren Bacall's movie apartment",
        text:
          "Jack Malloch and his son John Rolph Malloch built this Streamline Moderne apartment house, nicknamed the Ocean-Liner House, in 1937; its design is credited to architect Irvin Goldstine. Artist Alfred Du Pont gave its walls figures of a Spanish explorer, a worker with a globe and a woman representing the spirit of California. In the 1947 film noir Dark Passage it is the apartment of Lauren Bacall's character, where Humphrey Bogart's character hides out.",
        place: "Malloch Building",
        where: "1360 Montgomery St",
        at: [-122.40433, 37.80179],
        source: "https://en.wikipedia.org/wiki/Malloch_Building",
      },
      {
        icon: "park",
        title: "A garden grown on a dump",
        text:
          "When Grace Marchant began gardening here in 1949, this stretch of the Filbert Steps was strewn with the debris of a dump. She cleared away rubbish, abandoned furniture and stoves, planted roses, delphiniums, banana plants and Japanese maples, and tended them for more than 30 years. In the mid-1980s, when a proposed house threatened to split the garden, the Trust for Public Land raised the money to protect it as public open space. Napier Lane, the wooden-plank walkway off the steps here, has been called the city's only wooden street.",
        place: "Grace Marchant Garden",
        where: "Filbert St & Napier Ln",
        at: [-122.40392, 37.80193],
        source: "https://tpl.org/our-work/grace-marchant-garden",
      },
      {
        icon: "stairs",
        title: "A castle restaurant on the steps",
        text:
          "Restaurateur Julius Roz built this castle-style restaurant in 1922–23, hiring architect Luigi Mastropasqua to design it as a tribute to Layman's wooden castle, which stood on the summit from 1882 to 1903. Roz ran it until his death in 1943, the city named it Landmark No. 121 in 1980, and it closed in 2007. Paul Scott bought it in 2012, and in October 2026 he said he planned to open its doors as a restaurant again in the coming weeks.",
        place: "Julius' Castle",
        where: "1541 Montgomery St",
        at: [-122.40472, 37.80289],
        source: "https://www.ktvu.com/news/historic-bay-area-castle-designed-landmark-is-reopening-operate-again-restaurant",
      },
      {
        icon: "tower",
        title: "Murals behind a padlock",
        text:
          "Lillie Hitchcock Coit's will set aside a third of her fortune to beautify the city, and the tower it paid for, designed by Arthur Brown Jr. and Henry Howard, was completed in 1933. Inside, 25 artists and their assistants spent about six months of 1934 painting frescoes under the federal Public Works of Art Project. As that year's waterfront strike stoked fears of Communist agitation, a hammer and sickle in a Clifford Wight fresco and a Western Worker banner in John Langley Howard's mural set off a controversy, and the tower was padlocked, its windows painted over, for more than three months.",
        place: "Coit Tower",
        where: "1 Telegraph Hill Blvd",
        at: [-122.40583, 37.80250],
        source: "https://en.wikipedia.org/wiki/Coit_Tower",
      },
      {
        icon: "tram",
        title: "A castle with its own railway",
        text:
          "On April 14, 1876, the nation's centennial year, a group of 22 prominent men, George Hearst among them, gave the city the deed to four 50-vara lots on the summit, bought for $12,000, and the land became Pioneer Park. On July 4, 1882, a castle-style observatory known as Layman's Folly opened here, and a short-lived cable railway was built up the west side of the hill on Greenwich Street to reach it. Fire destroyed the castle in 1903; its site is now Coit Tower's north parking lot.",
        place: "Pioneer Park",
        where: "Telegraph Hill Blvd & Greenwich St",
        at: [-122.40654, 37.80267],
        source: "https://opensfhistory.org/news/2019/02/15/laymans-folly-a-closer-look/",
      },
    ],
    walk: {
      intro:
        "A short stair-climbing line for visitors and would-be neighbors, from the 39 Coit bus stop at Union St & Montgomery St (the 8, 30 and 45 run along Columbus Ave a few blocks west), down the Filbert Steps past Napier Lane to Sansome Street and back up the Greenwich Steps to Coit Tower and Pioneer Park. Allow about 45 minutes, more to see the tower's murals, and pick a clear morning for the view from the top.",
      miles: 0.6,
      minutes: 45,
      tip:
        "Save your legs for the end: from Sansome Street the Greenwich Steps climb to Montgomery Street beside Julius' Castle, then resume in brick up to Pioneer Park and Coit Tower. From the stops on Telegraph Hill Blvd at Greenwich St, the 39 Coit runs back down to Washington Square.",
    },
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
      "The cove below these bluffs had its name before the houses came. Some accounts say Chinese fishermen anchored and camped there, and the Chow Chong family recalled using it from 1868 into the 1890s as an anchorage for returning exhumed remains from the nearby City Cemetery to their home village; the Park Service notes that oral history is largely all that exists on how China Beach got its name. At the neighborhood's western edge, the Lands End trail sets out from Eagle's Point along the 1880s roadbed of the Ferries and Cliff House Railroad.\n\nSea Cliff itself was established in 1913 for the John Brickell Company, one of the master-planned residence parks, or garden suburbs, that came into vogue in San Francisco after the 1906 earthquake, with large lots and extensive landscaping. Landscape architect Mark Daniels drew its plan, and in 1914 he briefly became general superintendent and landscape engineer of the national parks, just before the National Park Service was formed. Carl Bertz designed most of the first houses; Willis Polk designed three on Scenic Way, and Julia Morgan designed one there in 1921.\n\nThe state bought the beach in 1933 and named it for former mayor James D. Phelan, an advocate of Asian exclusion; in 1974 the National Park Service declared that the name China Beach would be restored. In December 1995, during torrential rain, a 100-year-old brick sewer ruptured, and the rushing water carved out a pit more than 250 feet wide that swallowed an unoccupied house on El Camino del Mar. In 2015 the old stairs at the end of California Street, the way up into Lincoln Park, reopened clad in hand-made tile.",
    facts: [
      {
        icon: "water",
        title: "The year a house vanished",
        text:
          "In December 1995, after torrential rain, a 100-year-old brick sewer ruptured on the block just east of this corner, and the rushing water eroded a pit more than 250 feet wide and 40 feet deep. It swallowed an unoccupied Tudor-style house on El Camino del Mar and forced the evacuation of 23 other buildings. A forensic study later found that an overflow structure 1,400 feet downstream had constricted the storm flow and pressurized the sewer.",
        place: "The 1995 sinkhole",
        where: "25th Ave & El Camino del Mar",
        at: [-122.48525, 37.78746],
        source: "https://scholarsmine.mst.edu/icchge/4icchge/4icchge-session06/9",
      },
      {
        icon: "house",
        title: "A garden suburb on the bluffs",
        text:
          "Sea Cliff was established in 1913 for the John Brickell Company as one of San Francisco's master-planned residence parks, from a plan by landscape architect Mark Daniels. Carl Bertz designed most of the first houses. On Scenic Way, Willis Polk designed Nos. 9, 25 and 45, and Julia Morgan designed No. 50, built in 1921 for Maude Strowbridge.",
        place: "El Camino del Mar",
        where: "El Camino del Mar & 26th Ave",
        at: [-122.48636, 37.78756],
        source: "https://en.wikipedia.org/wiki/Sea_Cliff,_San_Francisco",
      },
      {
        icon: "wave",
        title: "A beach that got its name back",
        text:
          "Some accounts say Chinese fishermen anchored and camped in this cove, and the Chow Chong family recalled using it from 1868 into the 1890s as an anchorage for returning exhumed remains from the nearby City Cemetery to their home village. The state bought the beach in 1933 and named it for former mayor James D. Phelan, an advocate of Asian exclusion. In 1974 the National Park Service declared the old name would be restored, and a seven-foot granite marker donated by the Chung family was dedicated on June 5, 1982.",
        place: "China Beach",
        where: "Sea Cliff Ave & El Camino del Mar",
        at: [-122.49090, 37.78792],
        source: "https://www.nps.gov/goga/learn/historyculture/the-history-of-china-beach.htm",
      },
      {
        icon: "road",
        title: "A trail on an old railbed",
        text:
          "Just west of 32nd Avenue, El Camino del Mar meets the eastern trailhead of the Lands End Coastal Trail at Eagle's Point; the Park Service puts the trail at 1.7 miles one way. From here it follows the 1880s roadbed of the Ferries and Cliff House Railroad. In 2014 the old wooden overlook and its ramp gave way to a subtler viewpoint set back along the trail and level with it, a semicircle with three benches.",
        place: "Eagle's Point",
        where: "El Camino del Mar & 32nd Ave",
        at: [-122.49300, 37.78661],
        source: "https://www.nps.gov/goga/learn/historyculture/vestiges-lands-end-trail.htm",
      },
      {
        icon: "stairs",
        title: "Steps tiled by hand",
        text:
          "At the end of California Street beyond 32nd Avenue, these concrete stairs climb into Lincoln Park, the gateway to its golf course and playground, the Legion of Honor and the Lands End trail. Decades of neglect left their landings, pillars and benches badly damaged until Friends of Lincoln Park took on a restoration that, with the structural repairs, cost about half a million dollars. Artist Aileen Barr designed the mosaic and made its tiles by hand, and the steps were dedicated on May 28, 2015.",
        place: "Lincoln Park Steps",
        where: "California St & 32nd Ave",
        at: [-122.49330, 37.78358],
        source: "https://tileheritage.org/pdfs/E-News-Summer-2015.pdf",
      },
    ],
    walk: {
      intro:
        "A one-way walk of about 1.1 miles for visitors and would-be neighbors: start at the 29 Sunset stop at 25th Ave & El Camino del Mar, follow El Camino del Mar west through the residence park, detour down Sea Cliff Avenue to China Beach, continue to the Lands End trailhead at Eagle's Point, then walk 32nd Avenue south to the Lincoln Park Steps, steps from the 1 California stops at California St & 32nd Ave. Allow about an hour with the climb down to the beach, and go on a clear day, when the Golden Gate is in view.",
      miles: 1.1,
      minutes: 60,
      tip:
        "A construction project has limited parking and closed parts of China Beach, so check the Park Service's alerts before you go; from the lot, steep stairs or a gentler service road to the right lead down to the sand. The houses along El Camino del Mar are private, so enjoy them from the sidewalk.",
    },
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
      "Lake Street runs west from Arguello Boulevard past Mountain Lake, where Juan Bautista de Anza's party camped on March 27–28, 1776, while choosing sites for the Presidio and the mission; this neighborhood is its stretch west of Park Presidio Boulevard. The Presidio next door was sandy dune country until the Army planted it: in 1883 Maj. William A. Jones proposed a forest that would make the post look far larger than it was, and the first trees, donated by Adolph Sutro, went in on Arbor Day 1886. By the late 1880s a steam train ran out California Street toward Land's End; in 1905 electric streetcars of the new 1 Sutter-California line replaced it.\n\nIn 1903 the city paid $360,000 for the strip that became Park Presidio Boulevard to extend Golden Gate Park, and after the 1906 earthquake and fire, the refugee cottages of Camp Richmond lined it. In 1932 a Colonial Revival campus centered on a six-story hospital replaced the U.S. Public Health Service's original buildings at the north end of 15th Avenue; the hospital closed in 1981 and reopened as apartments in 2010. In the late 1930s Park Presidio was widened as the Highway 1 approach to the new Golden Gate Bridge.\n\nA 2012 city evaluation found a 1905 house at 1650 Lake Street individually eligible for the California Register, and in March 2020 neighbors applied to create a Lake Street Landmark District, an application planners called incomplete that June. Lake Street became a pandemic Slow Street, and on December 6, 2022, it was among the 16 initial corridors of the city's ongoing program. Its average daily traffic fell from 5,310 vehicles beforehand to 820 in 2023.",
    facts: [
      {
        icon: "road",
        title: "A refugee camp became a highway",
        text:
          "The city paid $360,000 in 1903 for this strip as an extension of Golden Gate Park, and after the 1906 earthquake and fire, rows of refugee cottages lined it at a camp called Camp Richmond. In the late 1930s it was widened and re-landscaped as the Highway 1 approach to the new Golden Gate Bridge; until the state finished the connector through the Presidio in 1940, the boulevard stopped at Lake Street, and bridge traffic went by way of 25th Avenue. Caltrans and the city's Recreation and Park Department maintain it today.",
        place: "Park Presidio Boulevard",
        where: "California St & Park Presidio Blvd",
        at: [-122.47285, 37.78444],
        source: "https://en.wikipedia.org/wiki/Park_Presidio_Boulevard",
      },
      {
        icon: "house",
        title: "A hospital turned apartments",
        text:
          "Walk a short block north to where 15th Avenue ends at the Presidio's old Public Health Service District: in 1932 a Colonial Revival campus designed by Treasury architect James Wetmore replaced the original buildings there, with a six-story hospital at its center. The hospital closed abruptly in 1981 and sat vacant for years; in 2009 the Presidio Trust removed the wings added in the 1950s, and the next year the main building, the Presidio's largest historic building, reopened as the Presidio Landmark apartments.",
        place: "Public Health Service Hospital",
        where: "15th Ave & Lake St",
        at: [-122.47441, 37.78625],
        source: "https://www.nps.gov/places/000/public-health-service-district.htm",
      },
      {
        icon: "house",
        title: "Older than the earthquake",
        text:
          "A 2012 city evaluation found this 1905 house individually eligible for the California Register of Historical Resources, for its architecture and its link to master architect Alexander Aimwell Cantin, best known for the Pacific Telephone building at 140 New Montgomery Street, done with Miller and Pflueger. In March 2020 neighbors applied to make a Lake Street Landmark District with this house as a contributor; their nomination describes Mediterranean Revival, Italian Renaissance Revival, Beaux Arts and Spanish Colonial Revival houses alongside Bay Region Craftsman and Shingle styles, though that June planners called the application incomplete.",
        place: "Proposed Lake Street Landmark District",
        where: "1650 Lake St",
        at: [-122.47743, 37.78634],
        source: "https://commissions.sfplanning.org/hpcpackets/2019-017767DES.pdf",
      },
      {
        icon: "park",
        title: "A forest planted to look bigger",
        text:
          "The Presidio's boundary lies a short block north of Lake Street here, and its forest is an Army creation. In 1883 Maj. William A. Jones proposed planting trees that would “border the boundary fences” and make the post “appear immensely larger than it really is.” They were also meant as windbreaks in the Presidio's sandy dunes, and the first, donated by Adolph Sutro, were planted on Arbor Day 1886.",
        place: "Presidio forest edge",
        where: "Lake St & 21st Ave",
        at: [-122.48085, 37.78595],
        source: "https://baynature.org/article/presidios-forest-resists-the-sands-of-time/",
      },
      {
        icon: "road",
        title: "A Slow Street that stayed",
        text:
          "Lake Street joined the city's pandemic Slow Streets program, which began in April 2020; the SFMTA Board voted on August 3, 2021, to keep it, and a design approved in August 2022 slows cars with speed humps, raised crosswalks and new stop signs. On December 6, 2022, it was among the 16 initial corridors of the ongoing Slow Streets Program, which aims for 1,000 or fewer cars a day and median speeds of 15 mph or less. Lake's average daily traffic fell from 5,310 vehicles before the program to 820 in 2023.",
        place: "Lake Slow Street",
        where: "Lake St & 23rd Ave",
        at: [-122.48299, 37.78585],
        source: "https://www.sfmta.com/projects/lake-slow-street",
      },
      {
        icon: "tram",
        title: "Steam trains to Land's End",
        text:
          "By the late 1880s, cable cars from the Ferry Building ran to Presidio Avenue and California Street, and from there a steam train of the Ferries and Cliff House Railway carried riders out California Street, past this corner, to 33rd Avenue, then turned north along the cliffs above the Golden Gate, ending steps from Sutro Heights, Sutro Baths and the Cliff House. In 1905 the United Railroads replaced the steam train with electric streetcars, which began running on the new 1 Sutter-California line on May 27 of that year; Muni's 1 California still stops at this corner.",
        place: "California Street line",
        where: "California St & 25th Ave",
        at: [-122.48503, 37.78384],
        source: "https://www.sfmta.com/blog/line-lands-end-san-franciscos-lost-scenic-railway",
      },
    ],
    walk: {
      intro:
        "A one-way walk of about a mile for visitors and would-be neighbors: start at the California St & Park Presidio Blvd stop (1 California, 28 and 28R), walk up 15th Avenue to Lake Street, follow Lake west along the Presidio's edge to 25th Avenue, and turn south to the 1 California stop at California St & 25th Ave. Allow about 45 minutes; a clear day shows off the Presidio's trees.",
      miles: 1,
      minutes: 45,
      tip:
        "The houses along the way are private, so enjoy them from the sidewalk. For coffee or a meal afterward, Clement Street is a block south of the last stop, and the 1 California runs from there back toward downtown.",
    },
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
      "Alamo Square takes its name from the álamo, Spanish for poplar: a lone cottonwood on the hill marked a watering hole on the horseback trail between Mission Dolores and the Presidio. After the Van Ness Ordinance of 1855 laid out the Western Addition west to Divisadero Street, then the city's western edge, Mayor James Van Ness set aside 12.7 acres on the hill in 1856 for a public square. Taking possession took longer: Charles “Dutch Charley” Duane, a onetime fire chief twice banished by the city's vigilance committees, squatted on the hilltop until the city ousted him in 1868. Grading began in 1892, and by 1896 the park had curving paths, stairways and a masonry wall.\n\nThe blocks around it filled between 1870 and 1929 with Italianate, Queen Anne and Classical Revival houses, many of them designed by architects for owners who were mostly moderately successful businessmen. Confectioner William Westerfeld's mansion went up in 1889, developer Matthew Kavanaugh's row on Steiner Street between 1892 and 1896, and Archbishop Patrick Riordan's residence in 1904. In April 1906 the fires stopped at Laguna Street, a few blocks east, and the neighborhood was spared.\n\nLater, as owners moved away, entrepreneurs carved many of the big houses into rooming houses, and redevelopment in the nearby Fillmore planned the demolition of some 2,500 Victorians. Neighbors who fought a 1963 city plan to level the hilltop for playing fields formed the Alamo Square Neighborhood Association, which also fought a freeway planned through the Panhandle. In July 1984 the city made the blocks from Golden Gate Avenue to Fell Street, between Divisadero and Webster, a historic district.",
    facts: [
      {
        icon: "music",
        title: "The Dead played this movie house",
        text:
          "The Harding Theater opened on April 8, 1926, with Colleen Moore in Irene, in a building by the Reid Brothers, the firm behind the Fairmont Hotel and the 1909 Cliff House. It staged everything from vaudeville and silent films to concerts by Curtis Mayfield, and in the late 1960s and early 1970s the Grateful Dead and Big Brother and the Holding Company played here. It became a church in the 1970s, stood empty after the congregation moved out in 2004, and reopened in late 2017 as a four-level arcade bar whose balcony looks down on the original stage.",
        place: "Harding Theater",
        where: "616 Divisadero St",
        at: [-122.43758, 37.77522],
        source: "https://en.wikipedia.org/wiki/Harding_Theater",
      },
      {
        icon: "house",
        title: "The house called the Russian Embassy",
        text:
          "Architect Henry Geilfuss designed this house, finished in 1889, for William Westerfeld, a German-born baker and confectioner who ran a confectionery on Market Street. From the late 1920s Czarist Russian émigrés ran a nightclub called Dark Eyes in its ground-floor ballroom and met in the rooms upstairs, making it an informal “Russian Embassy”; after it became apartments in 1948, jazz musicians playing the nearby clubs moved in, saxophonist John Handy among them. Experimental filmmaker Kenneth Anger later lived here and used the house as a movie set.",
        place: "Westerfeld House",
        where: "1198 Fulton St",
        at: [-122.43639, 37.77722],
        source: "https://en.wikipedia.org/wiki/William_Westerfeld_House",
      },
      {
        icon: "church",
        title: "Built on bedrock for an archbishop",
        text:
          "Architect Frank Shea finished this mansion in 1904 for Patrick William Riordan, San Francisco's second Roman Catholic archbishop, setting its wood frame on a steel-beam substructure over bedrock, uncommon locally at the time. The church later made it a boys' home and school, and in 1974 sold it to Presbyterian Hospital, which used it for offices and an outpatient clinic. It became city Landmark No. 151 in 1982, and in 1983 new owners won approval to open it as a bed-and-breakfast.",
        place: "Archbishop's Mansion",
        where: "1000 Fulton St",
        at: [-122.43330, 37.77785],
        source: "https://en.wikipedia.org/wiki/Archbishop%27s_Mansion",
      },
      {
        icon: "art",
        title: "Postcard Row's builder lived next door",
        text:
          "Developer Matthew Kavanaugh built this row of Queen Anne houses between 1892 and 1896 and lived next door at 722 Steiner. The bright paint came much later: San Francisco's colorist movement is traced to 1963, when Butch Kardum painted his Italianate Victorian in intense blues and greens, and a 1978 book by Elizabeth Pomada and Michael Larsen popularized the name “Painted Ladies.” By one estimate the row has appeared in some 70 films, TV shows and ads, including the opening credits of Full House.",
        place: "Painted Ladies",
        where: "710–720 Steiner St",
        at: [-122.43262, 37.77615],
        source: "https://en.wikipedia.org/wiki/Painted_ladies",
      },
      {
        icon: "water",
        title: "A lawn rebuilt to drink less",
        text:
          "The lawn facing the Painted Ladies was part of a park-wide makeover: Alamo Square closed on May 10, 2016, for a $5.3 million renovation built around a new irrigation system, replacing three-decade-old pipes that were corroded and prone to leaks. Rec and Park estimated the new system would cut the park's water use by 2.5 million gallons, or 33 percent, and the park reopened on May 24, 2017, with drought-resistant turf.",
        place: "Alamo Square east lawn",
        where: "Steiner St & Hayes St",
        at: [-122.43320, 37.77612],
        source: "https://www.hoodline.com/2017/05/behind-the-scenes-of-alamo-square-park-s-5-3-million-dollar-renovation",
      },
      {
        icon: "park",
        title: "The hilltop they planned to flatten",
        text:
          "After the fires of April 1906, Alamo Square became a major refuge for the homeless, with about 1,000 tents but no permanent “earthquake cottages.” In 1963 the city drew up plans to slice off the crest of this hill, level it for playing fields and build a large field house at Fulton and Steiner; the plan was dropped after neighbors appealed to Mayor Joseph Alioto.",
        place: "Alamo Square Park",
        where: "Hayes St & Pierce St",
        at: [-122.43460, 37.77645],
        source: "https://diva.sfsu.edu/collections/kirkeberg/bundles/223921",
      },
    ],
    walk: {
      intro:
        "A short one-way walk for visitors and would-be neighbors: start at the Divisadero & Hayes stop for the 6 and 24 buses beside the Harding Theater, climb Scott Street along the park to the landmark houses on Fulton Street, come down Steiner Street past the Painted Ladies and finish on the hilltop, a short stroll from the 6 stop at Hayes & Pierce. Allow about 45 minutes for three-quarters of a mile; a clear afternoon is best.",
      miles: 0.75,
      minutes: 45,
      tip:
        "The Painted Ladies face west across Steiner Street toward the park, so in the morning they are backlit by the sun rising behind them and downtown; on a clear afternoon the sun is at your back and lights their fronts. They are private homes, so take photos from the east lawn or the sidewalk.",
    },
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
      "St. Francis Wood rose on 175 acres of the former Sutro estate on the western slope of Mount Davidson; Adolph Sutro had bought the old Rancho San Miguel lands in 1880 and planted thousands of trees there. Duncan McDuffie and his partner Joseph Mason bought the tract, and their Mason-McDuffie Company opened lot sales in its “residence park” on October 12, 1912. McDuffie, later a two-term Sierra Club president who helped establish California's state park system, hired the Olmsted Brothers in 1913, and at his insistence the electric and telephone wires went underground. John Galen Howard, the first supervising architect, designed the gates, lampposts, brick-diamond sidewalks and first fountain; Henry Gutterson took over in 1914.\n\nThe hill was the easy part. Lot sales were nearly nonexistent from 1914 to 1919, and McDuffie lobbied hard for the Twin Peaks Tunnel, which opened on February 3, 1918. Building took off in the 1920s, when 347 houses went up, more than 60 percent of the eventual total. Gutterson (75 houses) and the firm Masten & Hurd (77) designed 152 of the subdivision's 509 between them, and Julia Morgan was among the other architects who built here.\n\nThe founding documents of 1912 also carried a clause barring certain ethnic groups from owning or leasing property here; shortly after the 1968 Fair Housing Act, the neighborhood recorded an extension of its restrictions declaring that clause invalid, illegal and against public policy. The association McDuffie formed in 1912 took over the parks and boulevards about a decade later, and on June 30, 2022, after a campaign by residents, the district was listed on the National Register of Historic Places.",
    facts: [
      {
        icon: "star",
        title: "Beaux-Arts gates at the circle",
        text:
          "John Galen Howard, the residence park's first supervising architect, designed these Beaux-Arts entrance portals, with their loggias and gardens, where St. Francis Boulevard leaves St. Francis Circle. He also drew the neighborhood's elaborate lampposts, entry pillars and brick-diamond sidewalks. When the Twin Peaks Tunnel opened in 1918, Muni's new K line began right here, running from the circle through the tunnel and down Market Street.",
        place: "St. Francis Wood Gates",
        where: "St Francis Blvd & Junipero Serra Blvd",
        at: [-122.47115, 37.73472],
        source: "https://tclf.org/landscapes/st-francis-wood",
      },
      {
        icon: "road",
        title: "Streets that follow the hill",
        text:
          "In 1913 Duncan McDuffie hired the Olmsted Brothers, and the firm, led by James Frederick Dawson, laid out curving streets that follow the site's natural topography rather than a grid, along with the neighborhood's walks and parks. St. Francis Boulevard is the main artery. At McDuffie's insistence, all the electric and telephone wires were placed underground.",
        place: "St. Francis Boulevard",
        where: "St Francis Blvd & San Fernando Way",
        at: [-122.46969, 37.73479],
        source: "https://en.wikipedia.org/wiki/Duncan_McDuffie",
      },
      {
        icon: "water",
        title: "A fountain at the halfway mark",
        text:
          "Howard's monumental fountain, which the neighborhood's archive calls the Circle fountain, marks the boulevard's center point where Santa Ana Avenue crosses. Unlike many developments, St. Francis Wood's developers encouraged houses designed by prominent architects for specific clients, and period revivals of traditional English, French and Italian idioms dominate the streets around it.",
        place: "The Circle Fountain",
        where: "St Francis Blvd & Santa Ana Ave",
        at: [-122.46796, 37.73486],
        source: "https://oac.cdlib.org/findaid/ark:/13030/c85h7q2g",
      },
      {
        icon: "water",
        title: "A fountain aimed at the Pacific",
        text:
          "At the top of the boulevard, Henry Gutterson, Howard's successor as supervising architect, designed this terraced plaza and fountain after extensive consultation with the Olmsted firm, placing it to take in a sweeping vista of the Pacific. An OpenSFHistory photograph from 1920 shows its steps and fountain, labeled “The Terminal.” On a clear day, look west from the steps for the ocean view it was built around.",
        place: "Terminal Fountain",
        where: "St Francis Blvd & San Anselmo Ave",
        at: [-122.46480, 37.73500],
        source: "https://tclf.org/landscapes/st-francis-wood",
      },
      {
        icon: "tram",
        title: "The tunnel that rescued sales",
        text:
          "From 1914 to 1919 lot sales in St. Francis Wood were nearly nonexistent, and it was faster to reach downtown by ferry from the East Bay than by streetcar from here. McDuffie and other developers with land west of Twin Peaks lobbied fiercely for a streetcar tunnel; once it opened in 1918, its west portal a short walk north of this corner, lots sold briskly.",
        place: "Portola Drive",
        where: "Portola Dr & Claremont Blvd",
        at: [-122.46508, 37.73977],
        source: "https://oac.cdlib.org/findaid/ark:/13030/kt787023c0",
      },
    ],
    walk: {
      intro:
        "A one-way walk of about a mile for visitors and would-be neighbors: start at St. Francis Circle, where the K and M streetcars and the 23 and 57 buses stop, climb St. Francis Boulevard past both fountains, then double back a block to Santa Clara Avenue and follow it north to Portola Drive, ending a short walk from West Portal Station. Allow about 45 minutes, and go on a clear day, when the view from the top fountain reaches the ocean.",
      miles: 1,
      minutes: 45,
      tip:
        "The boulevard climbs steadily from the circle to the top fountain, so take it slowly; at the end, West Portal Avenue's cafes and restaurants start just past the station.",
    },
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
      "Haight Street honors the banker Henry Haight, and Ashbury Street honors Munroe Ashbury, a San Francisco supervisor. Until 1883 their crossing lay among isolated farms and acres of sand dunes. That year the Haight Street cable railroad was finished, linking the east end of Golden Gate Park with the Market Street line and downtown, and many of the cable lines out to the park ended near its main pedestrian entrance at Haight and Stanyan. From 1895 to 1902 the Chutes, an amusement park franchised by Coney Island's Captain Paul Boyton, drew crowds to Haight Street between Clayton and Cole. In 1906 the district was one of the few spared by the fires that followed the earthquake.\n\nDecades later, Beats who couldn't find rooms in North Beach turned to the Haight's quaint, relatively cheap blocks. On January 3, 1966, the brothers Ron and Jay Thelin opened the Psychedelic Shop at 1535 Haight Street, and some of its revenue went to start the newspaper that became the San Francisco Oracle. On January 14, 1967, the Human Be-In drew an estimated 20,000 to 30,000 people to Golden Gate Park, the prelude to a Summer of Love in which as many as 100,000 young people converged on the neighborhood and the park.\n\nThat October, Ron Thelin and the Diggers staged the Death of Hippie. The Psychedelic Shop gave away everything it had and closed, its sign was laid in a casket, and on October 6, 1967, a mock funeral, announced to begin at sunrise in Buena Vista Park, carried it through the Haight, a send-off meant to rid the word “hippie” of what it had come to mean.",
    facts: [
      {
        icon: "house",
        title: "Front-page news on Ashbury Street",
        text:
          "The Grateful Dead lived in this Victorian until 1968, and the Haight-Ashbury Legal Organization kept an office in the house. On October 2, 1967, narcotics agents raided it and arrested Pigpen, Bob Weir and others, and the next day's Chronicle ran “ROCK BAND BUSTED” across its front page. It is a private home, so take it in from the sidewalk.",
        place: "Grateful Dead House",
        where: "710 Ashbury St",
        at: [-122.44664, 37.76890],
        source: "https://www.sfchronicle.com/oursf/article/Grateful-Dead-drug-bust-at-50-Nothing-left-10992821.php",
      },
      {
        icon: "flag",
        title: "The 100th National Treasure",
        text:
          "Richard P. Doolan built this Colonial Revival house on the corner in 1903, and after the 1906 earthquake it was raised to add storefronts on the ground floor; from April 1965 to 1968 one of them, 1510 Haight, held Peggy Caserta's Mnasidika, one of the first hippie shops in San Francisco. Its longtime owner, Norman Larson, bequeathed the building to San Francisco Heritage, and here, on May 15, 2019, the National Trust for Historic Preservation named the corner of Haight and Ashbury a National Treasure, its 100th. It has been city Landmark No. 253 since 2006.",
        place: "Doolan-Larson Building",
        where: "Haight St & Ashbury St",
        at: [-122.44685, 37.76994],
        source: "https://savingplaces.org/press-center/media-resources/leading-national-historic-preservation-organization-names-the-corner-of-haight-and-ashbury-in-san-francisco-a-national-treasure",
      },
      {
        icon: "star",
        title: "A free clinic in an upstairs flat",
        text:
          "Dr. David E. Smith opened the Haight Ashbury Free Clinic on June 7, 1967, in an old upstairs flat in this building, which had once held a suite of dentists' offices; private donations paid the rent. By Wikipedia's count it was the first of more than 600 free clinics opened across the United States over the next decade. It later became part of HealthRIGHT 360, which paused primary care here in July 2019 and moved it to its Mission Street center.",
        place: "Haight Ashbury Free Clinic",
        where: "558 Clayton St",
        at: [-122.44853, 37.77015],
        source: "https://en.wikipedia.org/wiki/Haight_Ashbury_Free_Clinic",
      },
      {
        icon: "book",
        title: "The city's oldest library building",
        text:
          "Opened on October 29, 1909, the Park Branch is, by the library's own account, the oldest existing San Francisco Public Library building, and it was the first branch in the city built with public funds, paid for with city money before any agreement with Andrew Carnegie was settled. The McDougall Brothers designed the two-story neoclassical building in brick and terra cotta and set it 30 feet back from the street to complement the houses around it.",
        place: "Park Branch Library",
        where: "1833 Page St",
        at: [-122.45100, 37.77032],
        source: "https://sfpl.org/locations/park/park-library-history",
      },
      {
        icon: "music",
        title: "Records where the pins once fell",
        text:
          "Marc Weinstein and Dave Prinz opened their first Amoeba on Telegraph Avenue in Berkeley in 1990. In 1997 they opened this one in a 24,000-square-foot former bowling alley at the eastern edge of Golden Gate Park.",
        place: "Amoeba Music",
        where: "1855 Haight St",
        at: [-122.45264, 37.76894],
        source: "https://localwiki.org/sf/Amoeba_Records",
      },
      {
        icon: "bridge",
        title: "A concrete first, with stalactites",
        text:
          "Just inside the park from this corner, where many of the old cable lines ended, stands the Alvord Lake Bridge, built by Ernest L. Ransome in 1889 and described by the American Society of Civil Engineers as the first reinforced concrete bridge built in the United States. Ransome reinforced it with his own cold-twisted square steel bars, scored its face to look like sandstone and hung its cave-like underpass with sculpted concrete stalactites; it came through the 1906 earthquake undamaged, and the ASCE made it a civil engineering landmark in 1969.",
        place: "Golden Gate Park entrance",
        where: "Haight St & Stanyan St",
        at: [-122.45296, 37.76925],
        source: "https://www.asce.org/about-civil-engineering/history-and-heritage/historic-landmarks/alvord-lake-bridge",
      },
    ],
    walk: {
      intro:
        "A one-way stroll of about 0.7 mile for visitors and would-be neighbors: start at Ashbury & Frederick (6 and 33 buses), walk north past the Grateful Dead house to Haight Street, then loop up Clayton and along Page Street, dropping back to Haight at Shrader and ending at Golden Gate Park at Stanyan. Allow about 45 minutes; a weekday morning is calmest, a weekend afternoon is liveliest.",
      miles: 0.7,
      minutes: 45,
      tip:
        "At Stanyan, step into the park to see the stalactite-hung underpass of the Alvord Lake Bridge; for the ride back, the 7 and 33 buses stop at Haight & Stanyan.",
    },
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
      "Before 1906, San Francisco's Japanese immigrants lived in enclaves around Chinatown, South of Market and South Park. After the 1906 earthquake and fire, some went back to South Park, but most moved west to the Western Addition. The heart of the new Nihonmachi was the area bounded by Geary, Webster, Bush and Laguna streets, and by 1940 it held more than 200 Japanese American–owned businesses. Barred by the 1913 Alien Land Law from owning land, the women of the Japanese YWCA had the city's YWCA hold their Sutter Street lot in trust.\n\nIn the spring of 1942, San Francisco's 5,280 Japanese and Japanese Americans were forced from their homes into incarceration camps, and thousands of newly arrived war workers, most of them African American, moved into the empty houses. After the war, officials labeled the district blighted, and in 1948, 27 blocks of the Western Addition, including much of Japantown, were selected for the A-1 redevelopment project. Many Black and Japanese American leaders vigorously opposed redevelopment. In 1956, after wholesale evictions, A-1 began flattening entire blocks south of Post Street, and by 1960 at least 1,500 Japanese American residents and more than 60 small businesses had been displaced.\n\nIn their place rose the Japanese Cultural and Trade Center, designed by Minoru Yamasaki and dedicated by Mayor Joseph Alioto in 1968, with a Peace Pagoda paid for largely by donations from Osaka, San Francisco's sister city. In 2006, its centennial year, a Board of Supervisors resolution called it the oldest Japantown in the United States and one of only three remaining. Its prewar language school, YWCA and temple still stand on Bush and Sutter streets.",
    facts: [
      {
        icon: "shopping",
        title: "Designed by the Twin Towers' architect",
        text:
          "The Japanese Cultural and Trade Center, now Japan Center, opened in March 1968. Minoru Yamasaki, also the designer of New York's World Trade Center towers, planned it with the local firm Van Bourg-Nakamura Associates, combining shops and restaurants in an interior mall with a hotel and a theater, most of it over underground parking. Across its bridge over Webster Street, Kinokuniya's bookstore, opened in 1969, was the chain's first in the United States.",
        place: "Japan Center",
        where: "1581 Webster St",
        at: [-122.43135, 37.78500],
        source: "https://en.wikipedia.org/wiki/Japan_Center_(San_Francisco)",
      },
      {
        icon: "tower",
        title: "Osaka's gift, getting a copper roof",
        text:
          "Designed by Japanese architect Yoshiro Taniguchi and paid for largely by donations from Osaka, San Francisco's sister city since 1957, the five-tiered concrete pagoda, about 100 feet tall, was dedicated in 1968; it was first surrounded by two reflecting pools, later removed because of drainage problems. In a Peace Plaza renovation that broke ground in April 2024, crews added and tensioned steel rods to reinforce it and began work on a new copper roof, which the city says will look bright copper until it weathers to a patina matching its historic color.",
        place: "Peace Pagoda",
        where: "Post St & Buchanan St",
        at: [-122.42970, 37.78510],
        source: "https://default.sfplanning.org/Preservation/peacepagoda/PeacePagodaDraftLandmarkDesignationReport_4-13-15.pdf",
      },
      {
        icon: "water",
        title: "Ruth Asawa's origami fountains",
        text:
          "In 1975 and 1976 this block of Buchanan Street was turned into a pedestrian mall set with origami fountains by sculptor Ruth Asawa. Her original Corten steel fountains corroded and were removed after a long drought, and public outcry brought back bronze replicas, cast under Asawa's supervision, in 1999. Renamed Osaka Way in 2007, the mall has had its fountains' water shut off for more than a decade; the city's planned rebuild of the mall lists rehabilitating them among its goals.",
        place: "Buchanan Mall",
        where: "Buchanan St & Sutter St",
        at: [-122.42993, 37.78615],
        source: "https://newfillmore.com/2025/06/09/will-ruth-asawas-fountains-flow-again/",
      },
      {
        icon: "house",
        title: "Built in trust by Issei women",
        text:
          "Because the 1913 Alien Land Law barred Issei women from owning property, the San Francisco YWCA agreed in 1921, after a fund drive in the Japanese community, to hold this lot in trust for the Japanese YWCA. Despite the Depression, the women raised enough for a new building, designed by Julia Morgan without a fee and completed in 1932. When the San Francisco YWCA tried to sell it in 1996, researchers recovered the trust documents and a lawsuit followed; tenant Nihonmachi Little Friends became the owner in a 2002 settlement. It joined the National Register in 2020 and became a city landmark in 2021.",
        place: "Japanese YWCA Building",
        where: "1830 Sutter St",
        at: [-122.43050, 37.78664],
        source: "https://en.wikipedia.org/wiki/Japanese_YWCA_Building",
      },
      {
        icon: "park",
        title: "The row once called Japan Street",
        text:
          "Cottage Row anchors the Bush Street–Cottage Row Historic District, listed on the National Register in 1982 and a city landmark district since 1991; Rec and Park credits William Hollis, president of the developer Real Estate Associates, with building most of its 22 buildings. Before World War II the district was home to Japanese American families, and the walkway was popularly called Japan Street. The mini park's Sutter Street end has been remade, with the Japanese Cultural and Community Center of Northern California, as a garden honoring the Issei.",
        place: "Cottage Row",
        where: "Sutter St & Cottage Row",
        at: [-122.43226, 37.78648],
        source: "https://sfrecpark.org/facilities/facility/details/cottagerowminipark-162",
      },
      {
        icon: "book",
        title: "Ordered to report here, 1942",
        text:
          "This building of the Japanese-language school Kinmon Gakuen, designed by William C. Hays, was completed in April 1926. On April 24, 1942, many of San Francisco's Japanese Americans were ordered to report here to register for removal, and it was the gathering place for one of the main contingents sent to the Tanforan Assembly Center. Closed through the war, the school resumed classes in the late 1940s; in 2024 it received $5 million from the city and $4.5 million from the state to rehabilitate the school and its auditorium.",
        place: "Kinmon Gakuen",
        where: "2031 Bush St",
        at: [-122.43070, 37.78720],
        source: "https://www.californiajapantowns.org/sf/kinmongakuen.html",
      },
      {
        icon: "church",
        title: "From synagogue to Zen temple",
        text:
          "Congregation Ohabai Shalome completed this temple in 1895, and the city made it a landmark in 1976. In the 1930s it became home to Sokoji, a Soto Zen temple; a Christian congregation used it during World War II, and it went back to the temple afterward. Shunryu Suzuki came in May 1959 to be Sokoji's head priest and stayed until November 1969. The temple moved out in the early 1970s, and the building is now part of Kokoro Assisted Living.",
        place: "Bush Street Temple",
        where: "1881 Bush St",
        at: [-122.42826, 37.78751],
        source: "https://en.wikipedia.org/wiki/Bush_Street_Temple",
      },
    ],
    walk: {
      intro:
        "A short one-way walk for visitors and would-be neighbors: start at the 38 Geary and 38R stop at Geary & Webster, cut through Japan Center to Peace Plaza, then follow the Buchanan Street mall north, Sutter Street west to Cottage Row and Bush Street back east to the old Bush Street Temple, a block from the 2 bus at Sutter & Laguna. Allow about 45 minutes for 0.7 mile; a weekday late morning is calmest.",
      miles: 0.7,
      minutes: 45,
      tip:
        "Japan Center's malls are indoors and linked by the Webster Street bridge, a good fallback on a foggy or wet afternoon. Peace Plaza's renovation, begun in April 2024, ran into 2026, and the Buchanan Street mall is due for a rebuild of its own, so check the city's project updates before you go; if either is fenced, Webster or Laguna Street links Post and Sutter, and the 100-foot pagoda is easy to see from Post Street.",
    },
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

  "Merced Heights": {
    spirit: "A quiet hilltop village in the city's southwest corner — modest mid-century homes along a ridgeline, big Pacific views from Brooks Park, and the deep-rooted, neighborly spirit of the historic OMI.",
    reasons: ["Peaceful, residential hilltop streets", "Hilltop views at Brooks Park", "Steps from City College's Ocean campus", "Historic, diverse OMI community"],
    history: "Merced Heights sits at the center of the OMI — Ocean View, Merced Heights, and Ingleside — on a ridge running between San Jose Avenue and Junipero Serra Boulevard. The name dates only to the years after World War II, when open hillside on the western slopes was subdivided into new housing. Beginning at midcentury, an influx of African-American families settled here, and Merced Heights emerged as an island of Black home ownership uphill from earlier residential parks that had barred minority buyers, making the OMI one of San Francisco's early integrated neighborhoods. City College of San Francisco's Ocean campus anchors the area's northern edge. Atop the neighborhood's peak, Brooks Park preserves rocky outcrops with native plants and a large community garden, on land once used by Ohlone families summering near Lake Merced.",
    facts: [
      { icon: "house", title: "Island of ownership", text: "After WWII, Merced Heights became a rare hilltop enclave of African-American home ownership, helping make the OMI one of the city's early integrated neighborhoods." },
      { icon: "park", title: "Brooks Park", text: "A hilltop park at 400 Shields St with native-plant gardens, a large community garden, and sweeping Pacific views." },
      { icon: "book", title: "City College", text: "CCSF's Ocean campus at 50 Frida Kahlo Way, the college's largest, borders the neighborhood." },
      { icon: "burrito", title: "Beep's since 1962", text: "Beep's Burgers has flipped patties at its original Ocean Avenue drive-in since 1962." },
    ],
    nearby: ["Ingleside", "the Ocean Avenue strip"],
    restaurants: [
      { name: "Beep's Burgers", address: "1051 Ocean Ave", phone: "(415) 584-2650", url: "https://www.beepsburgers.com" },
      { name: "Sakesan Sushi & Robata", address: "1400 Ocean Ave", phone: "(415) 347-7898" },
      { name: "That's Amore SF", address: "1901 Ocean Ave" },
    ],
    bars: [
      { name: "Ocean Ale House", address: "1314 Ocean Ave", phone: "(415) 988-7521", url: "https://oceanalehouse.com" },
    ],
    hospital: { name: "CPMC Mission Bernal Campus", address: "3555 Cesar Chavez St", phone: "(415) 641-6625", url: "https://www.sutterhealth.org/cpmc" },
    transit: "Muni 29-Sunset and 54-Felton serve Merced Heights directly. Muni Metro K-Ingleside and M-Ocean View run nearby along Ocean Avenue; the 49 Van Ness/Mission is close. Balboa Park BART and Muni station is the area's major transit hub.",
  },

  "Parkside": {
    spirit: "The outer Sunset's foggy, family-anchored southern half — mile after mile of pastel 1930s row houses, a working Main Street on Taraval, and big green breathing room at Stern Grove and the city's western edge.",
    reasons: ["L-Taraval streetcar down Main Street", "Stern Grove's free summer concerts", "A real neighborhood dining strip", "Steps from the Zoo, Stern Grove and Ocean Beach"],
    aka: "the Outer Sunset",
    history: "Parkside began in 1905 when a syndicate quietly bought former Outside Lands dunes from the Adolph Sutro estate and others to launch a new residential subdivision centered on Taraval Street. Early pioneers built on bare sand far from city services and organized the Parkside District Improvement Club in 1908 to demand them. Muni's L-Taraval streetcar opened along Taraval in 1919, opening the area to wider settlement. In the 1920s through 1940s builders like Henry Doelger, the Gellerts and the Stoneson brothers used new FHA loans to fill the dunes with rows of affordable stucco single-family homes. Though planned as its own neighborhood, Parkside is today generally considered part of the larger Sunset District.",
    facts: [
      { icon: "tram", title: "A century on the L", text: "Muni's L-Taraval streetcar opened along Taraval Street in 1919 and still runs down the neighborhood's spine today." },
      { icon: "music", title: "Free concerts at Stern Grove", text: "Sigmund Stern Grove, gifted to the city by Rosalie Stern, has hosted the nation's oldest free summer concert series since 1938." },
      { icon: "house", title: "Doelger's dunes", text: "Builder Henry Doelger's company produced roughly 26,000 Bay Area homes, helping turn Parkside's sand dunes into rows of stucco houses." },
      { icon: "park", title: "Zoo at the edge", text: "The San Francisco Zoo has sat at Sloat Boulevard and the Great Highway, just southwest of Parkside, since 1929." },
      { icon: "flag", title: "Born from the dunes", text: "A 1905 syndicate bought former Outside Lands dunes from the Adolph Sutro estate to create the Parkside subdivision around Taraval Street." },
    ],
    restaurants: [
      { name: "Dumpling Kitchen", address: "1935 Taraval St", phone: "(415) 682-8938", url: "https://www.dumplingkitchenca.com" },
      { name: "Kingdom of Dumpling", address: "1713 Taraval St", phone: "(415) 566-6143" },
      { name: "Taraval Okazu Ya", address: "1735 Taraval St", phone: "(415) 759-6850" },
      { name: "Lou's Cafe", address: "1508 Taraval St", phone: "(415) 682-4083", url: "http://www.louscafesf.com" },
      { name: "Shin Toe Bul Yi", address: "2001 Taraval St", phone: "(415) 566-9221" },
    ],
    bars: [
      { name: "O'Brien's Irish Pub", address: "1940 Taraval St", phone: "(415) 463-6712", url: "https://obriensirishpubsf.com" },
      { name: "White Cap", address: "3608 Taraval St", phone: "(415) 682-4215", url: "https://whitecapsf.com" },
    ],
    hospital: { name: "UCSF Medical Center at Parnassus", address: "505 Parnassus Ave", dist: "about 4 mi", phone: "(415) 353-1008", url: "https://www.ucsfhealth.org/locations/emergency-department-er-parnassus" },
    transit: "The L-Taraval Muni Metro line runs along Taraval Street through the heart of Parkside. Buses include the 28-19th Avenue, 29-Sunset, 18-46th Avenue and 23-Monterey.",
  },

  "Parkmerced": {
    spirit: "A planned garden-and-towers community on San Francisco's far southwest edge, where mid-century apartment living meets Lake Merced air and the bustle of SF State next door.",
    reasons: ["Master-planned green space", "Steps from SF State and Stonestown", "Beside Lake Merced and Stern Grove", "M-line and 19th Avenue transit at the door"],
    history: "In 1941 the Metropolitan Life Insurance Company assembled nearly 200 acres of former Spring Valley Water Company land to build a 'city within a city' of rental housing. The garden apartments and townhouses went up between 1941 and 1951, joined in the 1950s by a ring of high-rise towers, with landscape architect Thomas Church shaping the radiating street plan and lawns. The community totals roughly 3,200 units and was designed for the post-war middle-class housing boom. In May 2011 the SF Board of Supervisors approved a long-term redevelopment plan that would phase out most low-rise garden units in favor of denser mid-rise housing over several decades.",
    facts: [
      { icon: "house", title: "A planned community", text: "MetLife began building Parkmerced in 1941 as a 'city within a city,' with about 3,200 rental units." },
      { icon: "tower", title: "Ring of towers", text: "Thirteen-story residential towers added in the 1950s rise above the original two-story garden apartments and courtyards." },
      { icon: "water", title: "Lake Merced at the edge", text: "The neighborhood sits between 19th Avenue and Lake Merced, near Harding Park and Stern Grove." },
      { icon: "book", title: "Next to SF State", text: "Parkmerced lies just south of San Francisco State University and is popular with students and faculty." },
      { icon: "tram", title: "M-line through the door", text: "The M Ocean View Muni Metro runs the 19th Avenue median past the neighborhood and SF State." },
    ],
    nearby: ["Stonestown", "SF State"],
    restaurants: [
      { name: "Le Soleil", address: "3251 20th Ave, Ste 221", phone: "(415) 877-8899", url: "https://www.lesoleilsf.com/stonestown" },
      { name: "Marugame Udon", address: "3251 20th Ave", phone: "(415) 680-1280", url: "https://www.marugameudon.com/locations/stonestown/" },
    ],
    bars: [
      { name: "Kizuki Ramen & Izakaya", address: "3251 20th Ave, Ste 172", url: "https://www.kizuki.com/locations/" },
    ],
    hospital: { name: "UCSF Health Hyde Hospital", address: "900 Hyde St", phone: "(415) 353-6000", url: "https://www.ucsfhealth.org/locations/hyde-hospital" },
    transit: "M Ocean View Muni Metro runs the 19th Avenue median past Parkmerced and SF State. Buses 28 and 28R (19th Avenue), 18 (46th Avenue) and 57 (Parkmerced) serve the area; Daly City BART is nearby with a 28 bus connection.",
  },

  "Stonestown": {
    spirit: "San Francisco's southwest crossroads, where a mid-century mall reborn as a dining-and-shopping hub meets a university campus and the open green of Lake Merced.",
    reasons: ["Anchored by the Stonestown Galleria", "Next to San Francisco State University", "Steps from Lake Merced parkland", "Muni Metro and major bus lines on 19th Avenue"],
    history: "Stonestown was developed by brothers Henry and Ellis Stoneson beginning in the late 1940s on former farmland southwest of downtown. The Stonestown Shopping Center opened in 1952, with The Emporium department store as its anchor, and was one of the West's first large regional shopping centers paired with adjacent apartments housing several thousand residents. The neighborhood grew up alongside San Francisco State University, whose campus sits just across 19th Avenue. A 1980s renovation enclosed the center and rebranded it the Stonestown Galleria, and in 2024 the city approved a major redevelopment to add roughly 3,500 new homes, parks, and a new retail main street on the surrounding parking lots.",
    facts: [
      { icon: "shopping", title: "Opened in 1952", text: "The original Stonestown Shopping Center opened in 1952, anchored by The Emporium, and was among the first large regional shopping centers in the western U.S." },
      { icon: "house", title: "Built by the Stoneson brothers", text: "Brothers Henry and Ellis Stoneson developed Stonestown's mall and apartments in the late 1940s and early 1950s." },
      { icon: "book", title: "Next to SF State", text: "San Francisco State University sits directly across 19th Avenue, bringing tens of thousands of students to the area." },
      { icon: "house", title: "3,500 homes coming", text: "In 2024 San Francisco approved a Brookfield-led redevelopment to build about 3,500 homes, parks, and a new retail main street around the Galleria." },
      { icon: "tram", title: "M-line on 19th Ave", text: "The Muni Metro M Ocean View light rail runs in the median of 19th Avenue with a stop adjacent to the Galleria." },
    ],
    restaurants: [
      { name: "Le Soleil", address: "3251 20th Ave, Ste 221", phone: "(415) 877-8899", url: "https://www.lesoleilsf.com/stonestown" },
      { name: "Marugame Udon", address: "3251 20th Ave", phone: "(415) 680-1280", url: "https://www.marugameudon.com/locations/stonestown/" },
      { name: "Rooster & Rice", address: "3251 20th Ave", phone: "(415) 573-0610", url: "https://www.roosterandrice.com/location/rooster-and-rice-stonestown-galleria/" },
      { name: "Shake Shack", address: "3251 20th Ave", phone: "(415) 382-7271", url: "https://shakeshack.com/location/stonestown-galleria-ca" },
      { name: "Supreme Dumplings", address: "3251 20th Ave, Ste 219A", url: "https://www.supreme-dumplings.com/locations" },
    ],
    hospital: { name: "UCSF Medical Center at Parnassus", address: "505 Parnassus Ave", phone: "(415) 353-1008", url: "https://www.ucsfhealth.org/locations/emergency-department-er-parnassus" },
    transit: "The Muni Metro M Ocean View light rail stops at Stonestown Galleria station in the 19th Avenue median, serving SF State and the mall. Bus lines on 19th Avenue and nearby include the 28-19th Avenue, 17, 18, 29, and 57.",
  },

  "Lakeshore": {
    spirit: "San Francisco's quiet southwest corner, where streets curve around Lake Merced and the city trades fog-bound bustle for a near-suburban calm of golf greens, lakeside trails, and Pacific air.",
    reasons: ["Lake Merced's 4-mile loop at your doorstep", "Steps from Harding Park golf", "Quiet, family-friendly streets", "Minutes to Ocean Beach and Stonestown"],
    history: "Lake Merced is one of San Francisco's few natural freshwater lakes and supplied the city's drinking water from the late 1860s until 1934, when Hetch Hetchy took over. The city-run Harding Park golf course opened along its shores on July 18, 1925, designed by Willie Watson and Sam Whiting. The surrounding Lakeshore tracts were developed mid-century as planned residential subdivisions, including the Gellert brothers' Lakeshore Park, marketed from 1939 as a deluxe subdivision south of Sloat Boulevard. Lakeshore Plaza, the neighborhood's main shopping center at Sloat and Lake Merced boulevards, anchors the area's everyday commerce today.",
    facts: [
      { icon: "water", title: "A rare natural lake", text: "Lake Merced is one of the largest freshwater lakes in San Francisco and once served as the city's water source until 1934." },
      { icon: "park", title: "The four-mile loop", text: "A flat, paved multi-use path circles Lake Merced, drawing walkers, runners, cyclists, and birders past golf courses and eucalyptus groves." },
      { icon: "flag", title: "Championship golf", text: "Harding Park opened in 1925 and, as TPC Harding Park, has hosted PGA Tour and major championship events along the lakeshore." },
      { icon: "bird", title: "Pine Lake Park", text: "Just north, Pine Lake is one of the city's few remaining natural lakes, ringed by a birding trail into Stern Grove." },
      { icon: "wave", title: "Boathouse on the water", text: "The Lake Merced Boathouse at 1 Harding Road offers picnic areas, a fishing pier, and a boat launch on the lake's edge." },
    ],
    nearby: ["Stonestown", "West Portal"],
    restaurants: [
      { name: "Chipotle Mexican Grill", address: "1523 Sloat Blvd", phone: "(415) 592-2187", url: "https://locations.chipotle.com/ca/san-francisco/1523-sloat-blvd" },
      { name: "Le Soleil", address: "3251 20th Ave, Ste 221", phone: "(415) 877-8899", url: "https://www.lesoleilsf.com/stonestown" },
      { name: "Crumbl", address: "1567 Sloat Blvd", phone: "(628) 358-9689", url: "https://crumblcookies.com/calakeshore" },
    ],
    bars: [
      { name: "The Dubliner", address: "328 W Portal Ave", phone: "(415) 566-9444", url: "https://dublinerwp.com" },
    ],
    hospital: { name: "AHMC Seton Medical Center", address: "1900 Sullivan Ave, Daly City", dist: "about 2.5 mi", phone: "(650) 992-4000", url: "https://www.ahmchealth.com/smc/" },
    transit: "M-Ocean View Muni Metro serves nearby SF State and Stonestown along 19th Avenue. Buses include the 18-46th Avenue, 23-Monterey, 28-19th Avenue, and 57-Parkmerced. Daly City BART is a short ride south.",
  },

  "Cayuga": {
    spirit: "A hushed pocket of single-family homes tucked between Alemany, Geneva and I-280 in the city's deep south, trading nightlife for front gardens, quiet streets, and one of San Francisco's most surprising public treasures: a playground filled with hundreds of hand-carved wooden folk-art sculptures.",
    reasons: ["Calm, walkable residential streets", "Steps from Cayuga Playground's folk-art garden", "Minutes to the Balboa Park BART/Muni hub", "Close to the Outer Mission's food corridor"],
    aka: "Cayuga Terrace",
    history: "Cayuga Terrace took shape in the early 20th century as homestead-association land in the city's southern reaches was subdivided for housing. Many of its streets carry Native-American names, mostly of peoples and languages of the northeastern United States, a naming theme shared with neighboring Mission Terrace and the Outer Mission. Before 1918 a body of water known as Lake Geneva sat near what is now Cayuga Avenue, the street that gives the neighborhood its name. Through the first half of the century the area filled in with the detached single-family homes that still define it, served by nearby rail and streetcar lines and, later, the Balboa Park transit hub.",
    facts: [
      { icon: "art", title: "A sculpture garden made on lunch breaks", text: "Gardener Demetrio Braceros, assigned to Cayuga Park in 1986, hand-carved over 375 wooden totems, figurines and statues on his breaks; the San Francisco Arts Commission later inventoried 376 of them." },
      { icon: "park", title: "Cayuga Playground reborn", text: "The roughly four-acre playground at 301 Naglee Avenue closed in 2011 for an $8.4 million renovation and reopened in August 2013, with many of Braceros's sculptures restored." },
      { icon: "subway", title: "A transit powerhouse next door", text: "The nearby Balboa Park Station, opened in 1973, is one of BART's busiest stops outside downtown San Francisco and a major Muni transfer point." },
      { icon: "pin", title: "Streets named for Native peoples", text: "Cayuga Avenue and many surrounding streets are named for Native-American peoples and languages, a deliberate theme set when the area was subdivided." },
    ],
    nearby: ["the Outer Mission", "Balboa Park"],
    restaurants: [
      { name: "Taqueria Guadalajara", address: "4798 Mission St", phone: "(415) 469-5480" },
      { name: "JJamPPong", address: "5249 Mission St", phone: "(415) 347-7412" },
    ],
    bars: [
      { name: "Ocean Ale House", address: "1314 Ocean Ave", phone: "(415) 988-7521", url: "https://oceanalehouse.com" },
      { name: "Machu Picchu Cafe", address: "402 Geneva Ave", phone: "(415) 568-1887", url: "https://www.cafemp.com" },
    ],
    hospital: { name: "CPMC Mission Bernal Campus", address: "3555 Cesar Chavez St (ER entrance on 27th St)", phone: "(415) 641-6625", url: "https://www.sutterhealth.org/cpmc" },
    transit: "Balboa Park Station nearby serves BART and Muni Metro J, K and M lines, plus many bus routes; the 29-Sunset, 49, 14-Mission and 8-Bayshore run along the Mission Street corridor to the east.",
  },

  "Sunnydale": {
    spirit: "A close-knit, working-class community at San Francisco's far southeastern edge, wrapped by the green hills of McLaren Park — long anchored by one of the city's largest public housing developments, and now in the middle of a generational rebuild into a mixed-income neighborhood.",
    reasons: ["Borders sprawling McLaren Park", "A major HOPE SF rebuild underway", "T-Third light rail right at the door", "Tight-knit, diverse community"],
    history: "Built during World War II, the Sunnydale (later Sunnydale-Velasco) development became one of San Francisco's largest public housing complexes. After decades of disinvestment and isolation at the city's edge, it was selected for HOPE SF, the city's effort to rebuild its most distressed public housing without displacing residents. Demolition and phased construction are transforming the roughly 50-acre site into a mixed-income community of around 1,770 homes, with new streets, parks, retail, and a community hub. The arrival of the T-Third light rail line in 2007, with its terminus at nearby Sunnydale Station, finally connected the neighborhood to downtown by rail.",
    facts: [
      { icon: "park", title: "McLaren Park at the doorstep", text: "John McLaren Park covers more than 300 acres on Sunnydale's northern edge, making it one of the largest parks in San Francisco." },
      { icon: "house", title: "A generational rebuild", text: "Through HOPE SF, the WWII-era Sunnydale-Velasco development is being rebuilt as a mixed-income community of about 1,770 homes, with new parks and neighborhood retail." },
      { icon: "tram", title: "Light rail terminus nearby", text: "The T-Third line's southern end, Sunnydale Station, opened in 2007 in the median of Bayshore Boulevard, linking the area to downtown." },
      { icon: "music", title: "Cow Palace next door", text: "The historic Cow Palace arena, just over the line in Daly City, has hosted everyone from The Beatles to the Grand National Rodeo since 1941." },
    ],
    nearby: ["Visitacion Valley"],
    restaurants: [
      { name: "Pho Luen Fat", address: "110 Leland Ave", phone: "(415) 585-1167" },
      { name: "7 Mile House", address: "2800 Bayshore Blvd, Brisbane", phone: "(415) 467-2343", url: "https://7milehouse.com" },
    ],
    bars: [
      { name: "Mission Blue", address: "144 Leland Ave", phone: "(415) 508-7416", url: "https://missionbluesf.com" },
      { name: "7 Mile House", address: "2800 Bayshore Blvd, Brisbane", phone: "(415) 467-2343", url: "https://7milehouse.com" },
    ],
    hospital: { name: "Zuckerberg San Francisco General Hospital and Trauma Center", address: "1001 Potrero Ave", dist: "about 5 mi", phone: "(628) 206-8000", url: "https://www.zuckerbergsanfranciscogeneral.org" },
    transit: "T-Third light rail terminates nearby at Sunnydale Station, in the median of Bayshore Boulevard at Sunnydale Avenue. Muni buses include the 8-Bayshore, 9/9R-San Bruno, 29-Sunset, and 56-Rutland serving the surrounding Visitacion Valley area.",
  },

  "Little Hollywood": {
    spirit: "A hidden pocket of red-tile-roofed bungalows tucked between Bayshore Boulevard and Highway 101 — one of San Francisco's quietest, most surprising residential enclaves.",
    reasons: ["Quiet, tight-knit residential pocket", "Distinctive 1920s–30s Spanish-style bungalows", "Steps from Bayshore Caltrain", "Easy freeway and transit access to the Peninsula"],
    aka: "Bayshore Tract",
    history: "The area was developed by the Crocker Estate Company in the early 1920s as part of the 'Bayshore Tract.' In the late 1920s and early 1930s, builder William H. Grahn put up rows of Spanish- and Mediterranean-style homes, many designed by architect Charles Strothoff. Their stucco walls and red tile roofs evoked the houses of the Hollywood Hills, earning the enclave its 'Little Hollywood' nickname. Hemmed in by Bayshore Boulevard, U.S. 101, and the rail corridor, the small neighborhood remains an isolated, working-class pocket of about 1,165 residents on the city's far southeastern edge.",
    facts: [
      { icon: "movie", title: "How it got its name", text: "The 1920s–30s stucco-and-tile bungalows resembled homes in the Hollywood Hills, giving the neighborhood its 'Little Hollywood' nickname." },
      { icon: "tram", title: "Bayshore Caltrain", text: "The Bayshore station at 400 Tunnel Ave sits right beside the neighborhood, with commuter rail service down the Peninsula." },
      { icon: "house", title: "A pocket-sized enclave", text: "Spanning only about a quarter square kilometer, Little Hollywood is home to roughly 1,165 residents." },
      { icon: "music", title: "Cow Palace nearby", text: "The historic Cow Palace arena (2600 Geneva Ave) sits just to the southwest, hosting concerts and events for generations." },
      { icon: "road", title: "Wedged by the freeway", text: "Tucked between Bayshore Boulevard and U.S. Highway 101 near the San Mateo county line, it is one of the city's most tucked-away neighborhoods." },
    ],
    nearby: ["Visitacion Valley"],
    restaurants: [
      { name: "La Joya Mexican Cafe", address: "28 Leland Ave", phone: "(415) 508-9192", url: "https://la-joya-cafe.com" },
      { name: "Creative Ideas Cafe", address: "58 Leland Ave", phone: "(415) 988-7165", url: "https://creativeideascateringcafe.com" },
    ],
    bars: [
      { name: "1945 Restaurant Bar Lounge", address: "5 Leland Ave", phone: "(415) 347-7052", url: "https://1945rbl.com" },
    ],
    hospital: { name: "Zuckerberg San Francisco General Hospital and Trauma Center", address: "1001 Potrero Ave", dist: "about 4 mi", phone: "(628) 206-8000", url: "https://www.zuckerbergsanfranciscogeneral.org" },
    transit: "Bayshore Caltrain station (400 Tunnel Ave) is adjacent. Muni buses 9-San Bruno, 8-Bayshore and 56-Rutland serve the area, with the T-Third Muni Metro line nearby in Visitacion Valley.",
  },

  "Lone Mountain": {
    spirit: "A quiet hilltop crown above the city's north-central neighborhoods, where steep streets of Edwardian flats climb toward the University of San Francisco's dramatic Gothic campus and the views open up in every direction.",
    reasons: ["Among the city's best skyline and Golden Gate views", "Calm streets of historic Edwardian homes", "Steps from USF's landmark hilltop campus", "Walkable to Clement Street and Divisadero"],
    history: "Lone Mountain takes its name from a prominent hill that, beginning in the 1850s, anchored a cluster of grand Victorian-era cemeteries — Laurel Hill (1854), Calvary (1860), and the Masonic and Odd Fellows grounds. After the city banned burials, the dead were removed to Colma and the land was redeveloped through the early 1940s. The Religious of the Sacred Heart built a Spanish-Gothic main building atop the hill in 1932 for the San Francisco College for Women, reached by a grand garden staircase. The college went co-ed as Lone Mountain College in 1969 and was acquired by the University of San Francisco in 1978, which still operates it as the Lone Mountain campus next to St. Ignatius Church.",
    facts: [
      { icon: "church", title: "Cemetery hill", text: "The neighborhood sits atop the former Laurel Hill, Calvary, Masonic, and Odd Fellows cemeteries; burials were relocated to Colma by the early 1940s." },
      { icon: "book", title: "College for women", text: "The 1932 Spanish-Gothic building atop the hill housed the San Francisco College for Women until it became co-ed Lone Mountain College in 1969." },
      { icon: "tower", title: "USF's hilltop campus", text: "The University of San Francisco acquired the site in 1978 and runs it today as its Lone Mountain campus." },
      { icon: "stairs", title: "The grand staircase", text: "A garden stairway nicknamed the Spanish Steps climbs the hillside to the landmark Gothic main building." },
      { icon: "bridge", title: "Big views", text: "The hilltop offers panoramic vistas across the city, out to the Golden Gate Bridge and the ocean." },
    ],
    nearby: ["Inner Richmond", "NoPa", "Laurel Heights"],
    restaurants: [
      { name: "Chapeau!", address: "126 Clement St", phone: "(415) 750-9787", url: "https://www.chapeausf.com" },
      { name: "Nopa", address: "560 Divisadero St", phone: "(415) 864-8643", url: "https://www.nopasf.com" },
    ],
    bars: [
      { name: "Madrone Art Bar", address: "500 Divisadero St", url: "https://madroneartbar.com" },
    ],
    hospital: { name: "UCSF Health Stanyan Hospital (formerly St. Mary's)", address: "450 Stanyan St", dist: "about 0.8 mi", phone: "(415) 668-1000", url: "https://sfcommunityhospitals.ucsfhealth.org/st-marys" },
    transit: "Muni buses 31-Balboa, 33-Ashbury/18th St, 38-Geary, 43-Masonic and 5-Fulton serve the neighborhood's edges.",
  },

  "Anza Vista": {
    spirit: "A quiet mid-century pocket on the hill where San Francisco once buried its dead and then built its postwar future — tidy 1940s–50s homes and apartments climbing the slope between Geary and the Western Addition, with Kaiser's big medical campus and the Divisadero corridor a short walk away.",
    reasons: ["Calm, residential, and central", "Steps from Kaiser's main SF hospital", "Easy reach to NoPa and Divisadero dining", "38-Geary puts downtown within one ride"],
    history: "The neighborhood sits atop the former Calvary Cemetery, one of the large Catholic burying grounds near Lone Mountain. After San Francisco banned new burials in 1902, the graves here were disinterred and moved to Colma through the 1930s and 1940s. The cleared land was redeveloped in the late 1940s and 1950s into the mid-century homes and apartments that define Anza Vista today. The neighborhood and its central avenue are named for Juan Bautista de Anza, who led the 1775–1776 Spanish expedition that reached San Francisco Bay and chose the sites of the Presidio and Mission. Kaiser Permanente's San Francisco Medical Center anchors the neighborhood's northern edge along Geary Boulevard.",
    facts: [
      { icon: "quake", title: "Built on a former cemetery", text: "Anza Vista rose on the site of Calvary Cemetery; the graves were moved to Colma in the 1930s–40s before homes went up." },
      { icon: "house", title: "A postwar neighborhood", text: "Most of the homes and apartments date to a late-1940s and 1950s building boom on the cleared cemetery land." },
      { icon: "flag", title: "Named for an explorer", text: "Anza Vista honors Juan Bautista de Anza, who led 240-plus colonists overland to San Francisco Bay in 1775–1776." },
      { icon: "pin", title: "Kaiser's SF home base", text: "Kaiser Permanente's San Francisco Medical Center sits right along Geary Boulevard at the neighborhood's edge." },
      { icon: "shopping", title: "City Center retail", text: "The Target-anchored City Center shopping center stands at Geary and Masonic in the neighborhood's northwest corner." },
    ],
    nearby: ["NoPa", "Laurel Heights", "Western Addition"],
    restaurants: [
      { name: "Nopa", address: "560 Divisadero St", phone: "(415) 864-8643", url: "https://nopasf.com" },
    ],
    bars: [
      { name: "Madrone Art Bar", address: "500 Divisadero St", phone: "(415) 241-0202", url: "https://www.madroneartbar.com" },
      { name: "The Page", address: "298 Divisadero St", phone: "(415) 255-6101" },
      { name: "The Mill", address: "736 Divisadero St", phone: "(415) 345-1953", url: "https://www.themillsf.com" },
    ],
    hospital: { name: "Kaiser Permanente San Francisco Medical Center", address: "2425 Geary Blvd", dist: "about 0.5 mi", phone: "(415) 833-2000", url: "https://healthy.kaiserpermanente.org" },
    transit: "Served by the 38-Geary and 38R-Geary Rapid along the north edge, plus the 31-Balboa, 43-Masonic, and 24-Divisadero buses.",
  },

  "Cathedral Hill": {
    spirit: "A mid-rise corridor of apartment towers and big institutions strung along Van Ness and Geary, anchored by the soaring white sails of St. Mary's Cathedral — north-central San Francisco at its most modern and practical, tucked between Japantown, Pacific Heights, and Polk Gulch.",
    reasons: ["Transit-rich, with Van Ness BRT and 38-Geary at the door", "Major hospital care right in the neighborhood", "Walkable to Japantown and Polk Street", "Striking modern architecture and apartment living"],
    history: "The district takes its name from the Cathedral of Saint Mary of the Assumption, dedicated in 1971 at Gough and Geary, designed by Pietro Belluschi and engineer Pier Luigi Nervi with local architects John Michael Lee, Paul A. Ryan, and Angus McSweeney. Its hyperbolic-paraboloid roof rises 190 feet and reads as a great white cupola over the corridor, earning the nickname the 'washing-machine' cathedral. Through the mid-20th century the Van Ness and Geary corridor filled with apartment buildings and hotels, including the modernist Jack Tar Hotel of 1960, later the Cathedral Hill Hotel, which occupied the full block at Geary and Van Ness until it closed in 2009 and was demolished in 2013. On that site, California Pacific Medical Center opened its new Van Ness Campus hospital in 2019, and the long-awaited Van Ness Bus Rapid Transit busway opened in 2022.",
    facts: [
      { icon: "church", title: "The 'washing-machine' cathedral", text: "St. Mary's Cathedral (1971), at 1111 Gough St, rises 190 feet under a roof of eight hyperbolic-paraboloid segments, topped by a 55-foot golden cross." },
      { icon: "house", title: "CPMC Van Ness, opened 2019", text: "California Pacific Medical Center's Van Ness Campus hospital opened in 2019 on the block once occupied by the old Jack Tar / Cathedral Hill Hotel." },
      { icon: "tram", title: "Van Ness Bus Rapid Transit", text: "The Van Ness BRT busway opened in 2022, giving the 49 and 47 lines dedicated center-running lanes down the avenue." },
      { icon: "star", title: "A hofbrau since 1947", text: "Tommy's Joynt, the corner carvery at Geary and Van Ness, has been slicing pastrami and turkey at 1101 Geary Blvd since 1947." },
    ],
    nearby: ["Japantown", "Polk Gulch", "Pacific Heights"],
    restaurants: [
      { name: "Tommy's Joynt", address: "1101 Geary Blvd", phone: "(415) 949-0399", url: "http://tommysjoynt.com" },
      { name: "Grubstake Diner", address: "1525 Pine St", phone: "(415) 228-8420", url: "https://www.grubstakesf.com" },
    ],
    bars: [
      { name: "Saint Frank Coffee", address: "2340 Polk St", phone: "(415) 881-8062", url: "https://www.saintfrankcoffee.com" },
    ],
    hospital: { name: "CPMC Van Ness Campus", address: "1101 Van Ness Ave", dist: "in the neighborhood", phone: "(415) 600-6000", url: "https://www.sutterhealth.org/cpmc" },
    transit: "Van Ness Bus Rapid Transit (49 Van Ness/Mission and 47 Van Ness) runs the corridor; the 38-Geary and 38R Geary Rapid cross at Geary. Also the 2 Sutter, 3 Jackson, and 19 Polk.",
  },

  "Polk Gulch": {
    spirit: "A low valley that became a high-energy strip — restaurants, dive bars, cocktail dens, and corner shops packed into a walkable stretch between Nob Hill and Russian Hill, with a queer history that predates the Castro.",
    reasons: ["Dense, walkable restaurant-and-bar corridor", "Transit-rich on Polk and Van Ness", "Layered LGBTQ history", "Apartments and Victorians side by side"],
    aka: "the Polk Strip",
    history: "Polk Street was named for U.S. President James K. Polk, but the 'Gulch' comes from the low valley between Nob Hill and Russian Hill that once carried a creek. After the 1906 earthquake, the corridor grew into a busy commercial strip of shops, restaurants, and small storefronts. From the 1950s into the early 1980s, Polk Gulch was the center of San Francisco's gay life, home to dozens of gay-owned bars and businesses, and it hosted the city's first Pride march in 1970 before the scene's center shifted to the Castro.",
    facts: [
      { icon: "flag", title: "The original gayborhood", text: "Before the Castro, the Polk Strip was San Francisco's main gay neighborhood, with dozens of gay bars and businesses by the late 1960s." },
      { icon: "confetti", title: "First Pride march", text: "San Francisco's earliest Pride march stepped off along Polk Street in June 1970." },
      { icon: "water", title: "A creek under the street", text: "The 'Gulch' name reflects the low valley and old watercourse that once ran through the area between two hills." },
      { icon: "shop", title: "A true commercial strip", text: "Polk Street remains a dense, independent corridor of restaurants, bars, and shops rather than a residential pocket." },
      { icon: "star", title: "Swan Oyster Depot", text: "The family-run seafood counter at 1517 Polk has been a San Francisco institution since 1912." },
    ],
    restaurants: [
      { name: "Swan Oyster Depot", address: "1517 Polk St", phone: "(415) 673-1101" },
      { name: "Dunya Bistro", address: "1609 Polk St", phone: "(415) 400-5770", url: "https://dunyabistrosf.com" },
      { name: "Karam", address: "1725 Polk St", phone: "(415) 374-7142" },
      { name: "Bob's Donuts & Pastry Shop", address: "1720 Polk St", phone: "(415) 776-3141", url: "https://www.bobsdonutssf.com" },
    ],
    bars: [
      { name: "The Cinch Saloon", address: "1723 Polk St", phone: "(415) 776-4162" },
      { name: "Lush Lounge", address: "1221 Polk St", phone: "(415) 771-2022", url: "http://lushloungesf.com" },
      { name: "McTeague's Saloon", address: "1237 Polk St", phone: "(415) 776-1237", url: "https://www.sfmcteagues.com" },
      { name: "Amelie", address: "1754 Polk St", phone: "(415) 292-6916" },
      { name: "Bar Iris", address: "2316 Polk St", url: "https://www.bar-iris.com" },
    ],
    hospital: { name: "CPMC Van Ness Campus", address: "1101 Van Ness Ave", dist: "about 0.4 mi", phone: "(415) 600-6000", url: "https://www.sutterhealth.org/cpmc" },
    transit: "Served by the 19-Polk and 1-California Muni buses, plus the 47 and 49 Van Ness routes (49 Van Ness BRT) and the 2 and 3 lines a block over. Van Ness Avenue carries north-south bus rapid transit.",
  },

  "Lower Nob Hill": {
    spirit: "The dense apartment-house district on Nob Hill's lower southern slope, where 1910s–1920s brick high-rises and old residential hotels stack up just steps from downtown, the cable cars climbing the hill above and a lively run of restaurants and bars at street level.",
    reasons: ["Walkable to Union Square and the Financial District", "Cable cars on the hill above", "Historic apartment-house architecture", "Dense, affordable nightlife and dining"],
    aka: "the Tendernob",
    history: "After the 1906 earthquake and the three-day fire that leveled the area, this lower slope of Nob Hill was rebuilt almost entirely between 1906 and 1925 with fireproof brick and reinforced-concrete apartment buildings and residential hotels. Rising three to seven stories, they housed workers and middle-class residents within walking distance of downtown, below the grand mansions and hotels crowning Nob Hill above. The blocks around Bush, Sutter and Post are now recognized as the Lower Nob Hill Apartment Hotel District, listed on the National Register of Historic Places in 1991 with 296 contributing buildings. Sitting between Nob Hill proper and the Tenderloin, the neighborhood picked up the nickname the Tendernob.",
    facts: [
      { icon: "house", title: "An apartment-house district", text: "The Lower Nob Hill Apartment Hotel District holds 296 contributing buildings, mostly three- to seven-story brick apartment houses and residential hotels rebuilt after the 1906 fire." },
      { icon: "quake", title: "Rebuilt after 1906", text: "The 1906 quake and fire destroyed everything here; the district was rebuilt almost entirely between 1906 and 1925 using fireproof materials the city newly required." },
      { icon: "book", title: "On the National Register", text: "The district was listed on the National Register of Historic Places on July 31, 1991, and designated a California Historical Landmark the same day." },
      { icon: "tram", title: "Cable cars overhead", text: "The Powell-Hyde, Powell-Mason and California Street cable car lines run along the crest of Nob Hill just above the neighborhood." },
      { icon: "pin", title: "The Tendernob", text: "Wedged between Nob Hill and the Tenderloin, the area earned the blended nickname the Tendernob." },
    ],
    restaurants: [
      { name: "Liholiho Yacht Club", address: "871 Sutter St", phone: "(415) 440-5446", url: "https://lycsf.com" },
      { name: "Cocobang", address: "550 Taylor St", phone: "(415) 292-5144", url: "https://cocobang.org" },
      { name: "620 Jones", address: "620 Jones St", phone: "(415) 845-2257", url: "https://620-jones.com" },
    ],
    bars: [
      { name: "Bourbon & Branch", address: "501 Jones St", phone: "(415) 346-1735", url: "https://www.bourbonandbranch.com" },
      { name: "Rye", address: "688 Geary St", url: "https://www.ryesf.com" },
    ],
    hospital: { name: "UCSF Health Hyde Hospital", address: "900 Hyde St", dist: "about 0.4 mi", phone: "(415) 353-6000", url: "https://www.ucsfhealth.org/locations/hyde-hospital" },
    transit: "Cable cars run along the hill above: Powell-Hyde and Powell-Mason on Powell Street and the California Street line. Muni buses 2, 3, 19, 27, 38 and 1 serve the surrounding streets.",
  },

  "Downtown / Union Square": {
    spirit: "San Francisco's grand front parlor of department stores, theater marquees, and cable-car bells, where the whole city converges around one historic plaza.",
    reasons: ["The city's retail and luxury-shopping core", "Heart of the Theater District", "Transit hub for the entire Bay Area", "Walk-everywhere hotel and dining density"],
    history: "Union Square takes its name from the pro-Union rallies held here on the eve of the Civil War. At its center stands the Dewey Monument, a 97-foot column topped by the bronze figure 'Victory,' dedicated by President Theodore Roosevelt on May 14, 1903, to commemorate Admiral George Dewey's win at Manila Bay. The neighborhood rebuilt rapidly after the 1906 earthquake and fire, anchored by the Westin St. Francis hotel, which had opened on Powell Street in 1904. For more than a century it has remained the city's central district of flagship stores, grand hotels, and theaters.",
    facts: [
      { icon: "art", title: "The Victory statue", text: "The Dewey Monument's bronze 'Victory' was modeled by Alma de Bretteville Spreckels and sculpted by Robert Ingersoll Aitken, dedicated in 1903." },
      { icon: "house", title: "The Westin St. Francis", text: "Opened in 1904, the St. Francis is the only hotel directly on Union Square and survived the 1906 disaster." },
      { icon: "tram", title: "Powell cable-car turnaround", text: "At Powell and Market, the Powell-Hyde and Powell-Mason cars are spun by hand on the city's most-photographed turntable." },
      { icon: "movie", title: "The Theater District", text: "The Curran, Orpheum, and American Conservatory Theater anchor the live-stage blocks just west of the square." },
      { icon: "quake", title: "Rebuilt after 1906", text: "Much of the district was leveled by the 1906 earthquake and fire, then rebuilt within a few years as the city's retail core." },
    ],
    restaurants: [
      { name: "John's Grill", address: "63 Ellis St", phone: "(415) 986-0069", url: "https://www.johnsgrill.com" },
      { name: "Kin Khao", address: "55 Cyril Magnin St", phone: "(415) 362-7456", url: "https://www.kinkhao.com" },
      { name: "Bourbon Steak", address: "335 Powell St", phone: "(415) 770-0291", url: "https://www.bourbonsteak.com/location/san-francisco/" },
      { name: "Sears Fine Food", address: "439 Powell St", phone: "(415) 986-0700", url: "https://www.searsfinefood.com" },
      { name: "Cafe de la Presse", address: "352 Grant Ave", phone: "(415) 398-2680", url: "https://www.cafedelapresse.com" },
    ],
    bars: [
      { name: "Pacific Cocktail Haven", address: "550 Sutter St", url: "https://www.pacificcocktailsf.com" },
      { name: "Local Edition", address: "691 Market St", phone: "(415) 795-1375", url: "https://www.localeditionsf.com" },
    ],
    hospital: { name: "UCSF Health Hyde Hospital (formerly Saint Francis Memorial)", address: "900 Hyde St", dist: "about 0.7 mi", phone: "(415) 353-6000", url: "https://www.ucsfhealth.org/locations/hyde-hospital" },
    transit: "Powell St Station serves BART and Muni Metro (J, K, L, M, N lines); the underground Union Square/Market St Station serves Muni Metro as well. Powell-Hyde and Powell-Mason cable cars turn around at Powell and Market, alongside the F-Market streetcar and many bus lines.",
  },

  "Yerba Buena": {
    spirit: "San Francisco's cultural living room — a walkable cluster of world-class museums, public gardens, and convention halls wrapped in glassy high-rise condos and hotels, where the city quite literally began.",
    reasons: ["The city's densest concentration of museums", "Built around a downtown park with a memorial waterfall", "Transit-rich: BART, Muni Metro, Central Subway, F-line", "Walk-everywhere dining, shopping, and nightlife"],
    aka: "SoMa cultural district",
    history: "The neighborhood takes its name from Yerba Buena, the Mexican-era pueblo founded around 1835 whose name (Spanish for 'good herb') came from a fragrant mint that grew nearby; on January 30, 1847 the settlement was renamed San Francisco. The blocks south of Market were cleared in a long, contested mid-20th-century redevelopment effort that displaced many existing residents and businesses. The first phase of Yerba Buena Gardens opened in 1993 atop the underground halls of the Moscone Convention Center, anchored by the Yerba Buena Center for the Arts. Over the following decades a dense museum cluster took shape around the gardens, and the district filled in with residential towers and hotels.",
    facts: [
      { icon: "art", title: "SFMOMA", text: "The San Francisco Museum of Modern Art at 151 Third Street reopened in May 2016 after a Snohetta-designed expansion that roughly tripled its gallery space." },
      { icon: "water", title: "MLK Memorial Waterfall", text: "Yerba Buena Gardens opened in 1993; behind its memorial waterfall, glass panels honor Dr. Martin Luther King Jr. with his words from the civil rights movement." },
      { icon: "fair", title: "Moscone Center", text: "The George R. Moscone Convention Center — named for the San Francisco mayor assassinated in 1978 — tucks much of its exhibition hall underground, beneath Yerba Buena Gardens." },
      { icon: "flag", title: "Where San Francisco began", text: "The district recalls the original Yerba Buena settlement, the small Mexican-era pueblo that grew into San Francisco." },
      { icon: "subway", title: "Central Subway", text: "The Yerba Buena/Moscone Station on Muni's T Third Street line opened in November 2022, its glass roof drawing daylight three stories down to the platform." },
    ],
    restaurants: [
      { name: "Tropisueno", address: "75 Yerba Buena Ln", phone: "(415) 985-2264", url: "https://www.tropisueno.com" },
      { name: "Dirty Habit", address: "12 4th St", phone: "(415) 348-1555", url: "https://www.zhotelssf.com/hotels/dirty-habit" },
      { name: "B Restaurant & Bar", address: "720 Howard St", phone: "(415) 495-9800" },
      { name: "Joyride Pizza", address: "730 Howard St", phone: "(415) 295-2914", url: "https://www.joyridepizza.com" },
    ],
    bars: [
      { name: "The View Lounge", address: "780 Mission St", phone: "(415) 896-1600", url: "https://www.theviewlounge-sf.com" },
      { name: "Press Club", address: "20 Yerba Buena Ln", phone: "(415) 744-5000", url: "https://www.pressclubsf.com" },
    ],
    hospital: { name: "Zuckerberg San Francisco General Hospital and Trauma Center", address: "1001 Potrero Ave", dist: "about 2 mi", phone: "(628) 206-8000", url: "https://www.zuckerbergsanfranciscogeneral.org" },
    transit: "Powell St and Montgomery St stations (BART and Muni Metro) sit two blocks north; the Yerba Buena/Moscone Station serves the Muni Metro T Third line. The F-Market streetcar runs along Market Street, with many bus lines nearby.",
  },

  "Presidio Terrace": {
    spirit: "San Francisco's hidden oval of grandeur — a single private street where about three dozen century-old mansions sit behind a gate just south of the Presidio.",
    reasons: ["One of SF's first private residence parks (1905)", "Gated, ultra-exclusive single oval street", "Steps from the Presidio and Clement Street", "Quiet, leafy, and storied"],
    history: "Presidio Terrace was laid out beginning in 1905 by the real-estate firm Baldwin & Howell as one of San Francisco's first private 'residence parks,' built just south of the Presidio. About 35 to 36 grand mansions, in Beaux-Arts, Mission Revival and Tudor Revival styles, line a single privately owned oval street entered through a gate off Arguello Boulevard. It was historically and explicitly exclusionary: a 1906 brochure boasted it was a place where 'only Caucasians' could buy, a racial covenant of the sort the U.S. Supreme Court struck down in 1948. In 2015 a San Jose couple bought the private street and its common areas at a city tax auction for about $90,000 after the homeowners' association failed to pay roughly $14-a-year property taxes for decades; in November 2017 the Board of Supervisors voted to reverse the sale and return the street to the homeowners. Notable residents have included Senator Dianne Feinstein and former House Speaker Nancy Pelosi.",
    facts: [
      { icon: "house", title: "One private oval", text: "About 35 mansions ring a single privately owned oval street, entered through a gate off Arguello Boulevard." },
      { icon: "money", title: "The $90,000 street", text: "In 2015 a couple bought the private street at a city tax auction for about $90,000 after the HOA missed roughly $14-a-year taxes for decades." },
      { icon: "mayor", title: "Sale reversed", text: "In November 2017 the Board of Supervisors voted 7-4 to reverse the sale and return the street to the homeowners." },
      { icon: "star", title: "Notable residents", text: "Past residents include Senator Dianne Feinstein and former House Speaker Nancy Pelosi." },
      { icon: "flag", title: "An early residence park", text: "Begun in 1905 by Baldwin & Howell, it was among San Francisco's first private 'residence parks,' with underground utilities and electric street lights." },
    ],
    nearby: ["Inner Richmond", "Laurel Heights", "Presidio Heights"],
    restaurants: [
      { name: "Spruce", address: "3640 Sacramento St", phone: "(415) 931-5100", url: "https://www.sprucesf.com" },
      { name: "Burma Superstar", address: "309 Clement St", phone: "(415) 387-2147", url: "https://www.burmasuperstar.com" },
    ],
    bars: [
      { name: "The Bitter End", address: "441 Clement St", phone: "(415) 221-9538", url: "https://www.thebitterendsf.com" },
      { name: "Toy Boat by Jane", address: "401 Clement St", phone: "(415) 751-7505", url: "https://www.itsjane.com/location/toy-boat-by-jane" },
    ],
    hospital: { name: "UCSF Health Stanyan Hospital (formerly St. Mary's)", address: "450 Stanyan St", dist: "about 1.6 mi", phone: "(415) 668-1000", url: "https://sfcommunityhospitals.ucsfhealth.org/st-marys" },
    transit: "The gated entrance is off Arguello Blvd. Muni 33-Ashbury stops at Arguello and California, one block south; the 1-California runs along California St; the 2-Sutter and 43-Masonic serve nearby Presidio Heights; the 38-Geary runs along Geary Blvd to the south.",
  },

  "Holly Park": {
    spirit: "Bernal's quiet green crown — a ring of homes wrapped around a round hilltop park, where a single loop path delivers a 360-degree sweep of the city and the streets below stay residential and calm.",
    reasons: ["360-degree views from one of SF's oldest parks", "Quiet, walkable residential streets", "Cortland Ave's shops minutes away", "Hilltop loop path and playground at the center"],
    history: "Holly Park sits on land carved from the old Bernal land grant and set aside as one of San Francisco's earliest park reservations in the 1860s, donated to the city in 1862. For decades the surrounding Bernal Heights slopes were sparsely built, leaving the new public land hard to reach; the park was improved in the 1920s and again with city funding from the 1950s onward. Today its 7.5-acre hilltop oval, crowned by Holly Hill, is ringed by Victorian and cottage-style homes along Holly Park Circle. The name likely traces to the hollyleaf (Islais) cherry that once grew near Islais Creek just south of the hill.",
    facts: [
      { icon: "park", title: "One of SF's oldest parks", text: "Holly Park was set aside as a public reservation in the 1860s and donated to the city in 1862, making it among San Francisco's oldest municipal parks." },
      { icon: "tower", title: "360-degree views", text: "A loop path around the summit of Holly Hill opens up panoramic views of downtown, the Salesforce Tower, the Bay, and Sutro Tower." },
      { icon: "house", title: "A round park ringed by homes", text: "Holly Park Circle wraps the 7.5-acre oval, with homes facing the green on all sides along Bocana, Highland, Appleton, and Murray streets." },
      { icon: "art", title: "Public art on the hill", text: "A kinetic sculpture, 'Odonatoa' by Joyce Hsu, stands near the children's playground." },
    ],
    nearby: ["Bernal Heights", "the Mission"],
    restaurants: [
      { name: "Moki's Sushi & Pacific Grill", address: "615 Cortland Ave", phone: "(415) 970-9336", url: "https://mokisf.com" },
      { name: "Emmy's Spaghetti Shack", address: "3230 Mission St", phone: "(415) 206-2086", url: "https://emmysspaghettishack.com" },
    ],
    bars: [
      { name: "Wild Side West", address: "424 Cortland Ave", phone: "(415) 647-3099", url: "https://www.wildsidewest.com" },
      { name: "Holy Water", address: "309 Cortland Ave", phone: "(415) 570-8916", url: "https://holywatersf.com" },
      { name: "Progressive Grounds", address: "400 Cortland Ave", phone: "(415) 282-6233" },
    ],
    hospital: { name: "CPMC Mission Bernal Campus", address: "3555 Cesar Chavez St", dist: "about 1 mi", phone: "(415) 641-6625", url: "https://www.sutterhealth.org/cpmc" },
    transit: "The 67-Bernal Heights climbs the hill nearby (Ellsworth and Crescent), and the 24-Divisadero runs along Cortland Ave; the 14-Mission and 49 run down Mission St. Glen Park and 24th St Mission BART are a short ride away.",
  },

  "Fairmount": {
    spirit: "A hushed hillside of Victorians on the western slope of Bernal Heights, tucked between Glen Park, the Mission, and Bernal — one of San Francisco's oldest homestead tracts, prized for quiet streets, sun, and a short walk to Glen Park BART.",
    reasons: ["One of the city's earliest homestead tracts", "Quiet, walkable Victorian streets", "Steps from Glen Park BART and the J Church", "Tucked between Glen Park, the Mission, and Bernal"],
    aka: "Fairmount Heights",
    history: "The Fairmount Tract was platted in 1861, one of San Francisco's earliest suburban subdivisions west of the Mission, when the area was still rural hinterland beyond the Valencia Street horse railroad. The Fairmount School opened to students of the new tract in September 1864, making it one of the oldest schools in the city. Build-out came in waves: a burst in the 1880s, especially after the electric streetcar line reached Chenery Street in 1892, another after the 1906 earthquake, and a third following World War I. The original large lots were subdivided over time, filling the hillside with the modest Victorians and Edwardians that still line its streets. Today the neighborhood is often folded into Glen Park on maps, but its name survives in Fairmount Street and the surrounding tract.",
    facts: [
      { icon: "book", title: "Fairmount School, 1864", text: "The Fairmount School opened to students of the newly platted tract in September 1864, one of the oldest schools in San Francisco." },
      { icon: "house", title: "An early homestead tract", text: "Platted in 1861, the Fairmount Tract predates Glen Park and Sunnyside by roughly 30 years and is among the oldest residential districts on the city's west side." },
      { icon: "tram", title: "The streetcar era", text: "An electric streetcar line reached nearby Chenery Street in 1892, spurring a wave of home-building on the hillside." },
      { icon: "subway", title: "BART at the bottom of the hill", text: "Glen Park BART, at Diamond and Bosworth, sits just downhill, putting downtown and the airport line within easy reach." },
      { icon: "stairs", title: "A hillside of Victorians", text: "The neighborhood climbs the southeastern slope above College Hill, its streets lined with Victorian and Edwardian homes." },
    ],
    nearby: ["Glen Park", "the Mission", "Bernal Heights"],
    restaurants: [
      { name: "Manzoni", address: "2788 Diamond St", phone: "(415) 334-2251", url: "https://www.manzonisf.com" },
      { name: "Gialina Pizzeria", address: "2842 Diamond St", phone: "(415) 239-8500", url: "https://www.gialina.com" },
      { name: "La Corneta Taqueria", address: "2834 Diamond St", phone: "(415) 469-8757", url: "https://lacorneta.com" },
      { name: "La Taqueria", address: "2889 Mission St", phone: "(415) 285-7117" },
    ],
    bars: [
      { name: "Holy Water", address: "309 Cortland Ave", phone: "(415) 570-8916", url: "https://holywatersf.com" },
      { name: "Wild Side West", address: "424 Cortland Ave", phone: "(415) 225-4918" },
    ],
    hospital: { name: "CPMC Mission Bernal Campus", address: "3555 Cesar Chavez St", dist: "about 1.5 mi", phone: "(415) 600-6000", url: "https://www.sutterhealth.org/cpmc" },
    transit: "Glen Park BART sits just downhill at Diamond and Bosworth, served by Muni buses 23, 35, 36, 44 and 52. The J Church Muni Metro stops nearby at San Jose/Glen Park in the San Jose Avenue median.",
  },

  "Peralta Heights": {
    spirit: "A hidden pocket on Bernal Heights' northeast slope, where steep streets, secret stairways, and tucked-away gardens climb toward sweeping views of downtown and the bay.",
    reasons: ["Quiet, tucked-away residential streets", "Hidden stairways and hillside gardens", "Big views toward downtown and the bay", "Steps from Bernal's Cortland Avenue"],
    history: "The enclave sits on the northeast flank of Bernal Heights, built on land that was once part of Rancho Rincon de las Salinas y Potrero Viejo, a Mexican land grant. Peralta Avenue and the neighborhood take their name from the prominent Peralta family of Spanish-era California land-grant holders. Like much of Bernal, the area's slopes proved too steep for a full street grid, so paths and public stairways were threaded between the hillside lots. Modest early homes and gardens filled in along these winding streets, giving the pocket its quiet, hidden-away character.",
    facts: [
      { icon: "house", title: "A Peralta namesake", text: "Peralta Avenue, the spine of the enclave, honors the Peralta family of Spanish and Mexican California land-grant fame." },
      { icon: "stairs", title: "Stairway streets", text: "Bernal's slopes were too steep for a full grid, so public stairways link the hillside streets, a hallmark of the neighborhood." },
      { icon: "tower", title: "Downtown views", text: "The northeast-facing slope opens up big views toward downtown San Francisco and the bay." },
      { icon: "park", title: "Gardens on the hill", text: "Hidden gardens tucked along the steep lots and stairways give the pocket its green, tucked-away feel." },
    ],
    nearby: ["Bernal Heights", "the Mission", "Precita Park"],
    restaurants: [
      { name: "Emmy's Spaghetti Shack", address: "3230 Mission St", phone: "(415) 206-2086", url: "https://sfspaghettishack.com" },
      { name: "Precita Social", address: "300 Precita Ave", phone: "(415) 729-3197", url: "https://www.precitasocial.com" },
      { name: "Precita Park Cafe", address: "500 Precita Ave", phone: "(415) 647-7702" },
    ],
    bars: [
      { name: "Wild Side West", address: "424 Cortland Ave", phone: "(415) 647-3099", url: "https://www.wildsidewest.com" },
    ],
    hospital: { name: "CPMC Mission Bernal Campus", address: "3555 Cesar Chavez St", dist: "about 1 mi", phone: "(415) 600-6000", url: "https://www.sutterhealth.org/cpmc" },
    transit: "Muni 67-Bernal Heights connects the hill to 24th St Mission BART; the 27, 24 and 14-Mission run nearby along the Mission Street corridor.",
  },

  "St. Marys Park": {
    spirit: "A hushed, leafy pocket of curving streets tucked on the south slope below Bernal Heights, where mid-century and earlier homes line streets famously laid out in the shape of a bell — a nod to the old St. Mary's College that once crowned this hill.",
    reasons: ["Quiet streets with little through traffic", "A small neighborhood park at its heart", "Minutes from Cortland Ave and Mission St dining", "14-Mission and BART put downtown within reach"],
    aka: "College Hill",
    history: "The hill takes its name from St. Mary's College, founded by Roman Catholic archbishop Joseph Alemany, who bought 60 acres from Jesus Bernal for $1,600 and laid the college cornerstone on August 3, 1862. The college operated here until 1889, when it moved to Oakland and later to Moraga, leaving the area known for decades as College Hill. In 1924 the land was surveyed and opened as a residential subdivision, its streets famously platted in the shape of a bell to honor the school; Justin, Genebern, and Agnon streets were named for teaching brothers of the college. The St. Mary's Park Improvement Club, founded in 1941, has worked to preserve the neighborhood's character ever since.",
    facts: [
      { icon: "church", title: "A college on the hill", text: "Archbishop Alemany laid the cornerstone of St. Mary's College here on August 3, 1862; it stayed until 1889 before moving to Oakland and eventually Moraga." },
      { icon: "book", title: "College Hill", text: "Because of that early college, the area was long known as College Hill, and several streets carry the names of the teaching brothers." },
      { icon: "house", title: "Streets shaped like a bell", text: "When the subdivision opened in 1924, the curving streets were laid out in the shape of a bell as a tribute to St. Mary's College." },
      { icon: "park", title: "A park at its center", text: "The neighborhood is organized around St. Mary's Recreation Center and park just to the east, set aside by the city in the 1920s." },
      { icon: "flag", title: "An improvement club since 1941", text: "The St. Mary's Park Improvement Club, founded in 1941, has championed the neighborhood for more than eight decades." },
    ],
    nearby: ["Bernal Heights", "the Mission St corridor"],
    restaurants: [
      { name: "Emmy's Spaghetti Shack", address: "3230 Mission St", phone: "(415) 206-2086", url: "https://www.sfspaghettishack.com" },
      { name: "Black Jet Baking Co.", address: "833 Cortland Ave", phone: "(415) 829-3905", url: "https://www.blackjetbakery.com" },
    ],
    bars: [
      { name: "Wild Side West", address: "424 Cortland Ave", phone: "(415) 647-3099", url: "https://www.wildsidewest.com" },
      { name: "Holy Water", address: "309 Cortland Ave", phone: "(415) 570-8916", url: "https://holywatersf.com" },
    ],
    hospital: { name: "CPMC Mission Bernal Campus", address: "3555 Cesar Chavez St", dist: "about 1 mi", phone: "(415) 600-6000", url: "https://www.sutterhealth.org/cpmc" },
    transit: "14-Mission and 14R-Mission Rapid run along nearby Mission St; the 67-Bernal Heights and 24-Divisadero connect up the hill and to Cortland Ave. Balboa Park and 24th St Mission BART stations are a short ride away.",
  },

  "University Mound": {
    spirit: "A quiet, sun-touched hillside in the city's southeast where single-family homes climb toward a giant reservoir, and the diverse, working-class Portola flatlands hum just downhill on San Bruno Avenue.",
    reasons: ["Calm, residential streets of single-family homes", "Steps from the Portola's diverse San Bruno Ave eats", "Minutes from sprawling McLaren Park", "Deep, layered local history"],
    history: "The name dates to 1859, when Rev. George Burrowes founded University College (also called City College) and acquired hilltop land here by 1862, intending a grand campus that was never built; the surrounding streets were laid out and named for schools and educators. Crowning the hill is the University Mound Reservoir, an SFPUC facility holding about 140 million gallons that supplies roughly a quarter of San Francisco's tap water, second in size only to the Sunset Reservoir. Just downhill, the adjacent Portola earned the nickname the 'Garden District,' its slopes once dense with commercial greenhouses and nurseries that grew much of the city's flower crop. The University Mound Ladies Home, founded in 1884 with money from philanthropist James Lick, gave single women of modest means a place to live for 130 years before closing in 2014. The area filled in with modest single-family homes through the 20th century into the diverse, working-class neighborhood it is today.",
    facts: [
      { icon: "water", title: "140 million gallons", text: "The University Mound Reservoir atop the hill holds about 140 million gallons and supplies roughly a quarter of San Francisco's tap water, second only to the Sunset Reservoir." },
      { icon: "book", title: "The university that never was", text: "The neighborhood is named for University College, founded in 1859, which acquired land here by 1862 for a campus that was ultimately never built." },
      { icon: "park", title: "McLaren Park next door", text: "John McLaren Park, one of the largest parks in San Francisco, spreads out just to the west." },
      { icon: "flag", title: "The Garden District", text: "The neighboring Portola was long called the Garden District for the greenhouses and flower nurseries that once blanketed its hillsides." },
      { icon: "house", title: "130 years of refuge", text: "The University Mound Ladies Home, endowed by James Lick and opened in 1884, housed women of modest means until it closed in 2014." },
    ],
    nearby: ["the Portola"],
    restaurants: [
      { name: "Breakfast at Tiffany's", address: "2499 San Bruno Ave", phone: "(415) 468-8805", url: "https://www.breakfastattiffanyssf.com" },
      { name: "Banh Mi House", address: "2701 San Bruno Ave", phone: "(415) 769-5556" },
    ],
    bars: [
      { name: "El Toro Night Club", address: "2470 San Bruno Ave", phone: "(415) 468-0670" },
    ],
    hospital: { name: "Zuckerberg San Francisco General Hospital and Trauma Center", address: "1001 Potrero Ave", dist: "about 3 mi", phone: "(628) 206-8000", url: "https://www.zuckerbergsanfranciscogeneral.org" },
    transit: "Muni buses serve the area via the 9 San Bruno and 9R San Bruno Rapid along San Bruno Avenue, plus the 8 Bayshore, 29 Sunset, and 54 Felton. Bayshore Caltrain is a short ride east.",
  },

  "Silver Terrace": {
    spirit: "A sunny, working-class pocket tucked in the crook where the 280 and 101 freeways meet — hillside homes above, the auto-and-industrial flats below, with quiet streets and big southeast-facing views.",
    reasons: ["Some of the city's oldest houses on quiet streets", "Sunny southeast corner with bay views", "Walk to the Portola and the Bayview's Third St", "Minutes from McLaren Park"],
    history: "Silver Terrace takes its name from Joseph S. Silver, who in the 1850s claimed and fenced a tract running from the old San Bruno turnpike (now San Bruno Avenue) east toward what is today Third Street; despite the name, there was never any silver ore here. In 1870 the land agents Duncan & Co. launched a homestead association on hundreds of lots from the Haley & O'Neill tract, and Eadweard Muybridge had been hired in 1869 to photograph the still-rural fields and marsh for promotional images. Most homes went up in the 20th century, but hidden in the streets are some of the oldest houses in San Francisco, survivors of that first tract. The hillside filled in with single-family homes while the flats along Bayshore Boulevard became an auto row of dealerships and light industry. The result is the neighborhood's enduring split character: residential slopes above, working blocks below.",
    facts: [
      { icon: "money", title: "Not actually silver", text: "The name honors landowner Joseph S. Silver, not any mine; no silver was ever dug here." },
      { icon: "road", title: "Bayshore auto row", text: "The flat blocks along Bayshore Boulevard grew into a strip of car dealerships and light industry." },
      { icon: "house", title: "Some of SF's oldest homes", text: "A few Haley & O'Neill tract houses tucked in the streets are among the oldest in the city." },
      { icon: "park", title: "McLaren Park next door", text: "John McLaren Park, one of San Francisco's largest at over 300 acres, sits just west." },
      { icon: "sun", title: "Sunny southeast corner", text: "Sitting in the elbow of the 280 and 101, the hillside catches sun and wide bay-facing views." },
    ],
    nearby: ["the Portola", "the Bayview"],
    restaurants: [
      { name: "Breakfast at Tiffany's", address: "2499 San Bruno Ave", phone: "(415) 468-8805" },
      { name: "Smoke Soul Kitchen", address: "4618 Third St", phone: "(415) 900-6093", url: "https://www.smokesoulkitchen.com" },
    ],
    bars: [
      { name: "Old Skool Cafe", address: "1429 Mendell St", phone: "(415) 822-8531", url: "https://www.oldskoolcafe.org" },
    ],
    hospital: { name: "Zuckerberg San Francisco General Hospital and Trauma Center", address: "1001 Potrero Ave", dist: "about 2.5 mi", phone: "(628) 206-8000", url: "https://www.zuckerbergsanfranciscogeneral.org" },
    transit: "Muni buses 9-San Bruno, 8-Bayshore, 23-Monterey, 44-O'Shaughnessy and 54-Felton serve the area; the T-Third light rail runs along Third St in the Bayview, a ride east.",
  },

  "India Basin": {
    spirit: "A working bayshore reborn as parkland, where 19th-century shipwrights once launched scow schooners and a brand-new 64-acre waterfront park now opens the Bay to the Bayview.",
    reasons: ["Brand-new India Basin Waterfront Park", "Rich shipbuilding heritage", "Bay Trail access and Heron's Head birdwatching", "Emerging new bayfront housing"],
    history: "India Basin began as a shallow tidal cove on the Hunters Point shoreline and became a hub of 19th-century boatbuilding, where shipwrights launched scow schooners that hauled cargo around San Francisco Bay. Carpenter and shipwright John Dirks built the c. 1875 Shipwright's Cottage at 900 Innes Avenue, and boatbuilding families ran the adjacent yard for decades. The cove's industry surged during the World War II shipyard era at neighboring Hunters Point, then entered a long postwar decline that left the shoreline largely industrial. Today the city's new India Basin Waterfront Park is transforming the basin back into public space along the water.",
    facts: [
      { icon: "park", title: "A new 64-acre shoreline park", text: "India Basin Waterfront Park is being built across the basin's shoreline; its 900 Innes section opened in October 2024, with the larger shoreline portion under construction through the late 2020s." },
      { icon: "factory", title: "Shipwright's Cottage", text: "The c. 1875 cottage at 900 Innes Avenue, a San Francisco Designated Landmark since 2008, once housed boatbuilders who crafted scow schooners and now anchors the new park." },
      { icon: "bird", title: "Heron's Head Park", text: "Just north along the shore, this reclaimed salt marsh is one of the city's best birdwatching spots and home to the off-grid, LEED Platinum EcoCenter." },
      { icon: "water", title: "Built on a boatbuilding cove", text: "The basin was a center of San Francisco Bay scow-schooner construction; the historic schooner Alma, built nearby in 1891, survives at the Maritime National Historical Park." },
    ],
    nearby: ["the Bayview"],
    restaurants: [
      { name: "Gumbo Social", address: "5176 3rd St", phone: "(415) 655-9195", url: "https://www.gumbosocial.com" },
      { name: "Old Skool Cafe", address: "1429 Mendell St", phone: "(415) 822-8531", url: "https://www.oldskoolcafe.org" },
    ],
    bars: [
      { name: "Laughing Monk Brewing", address: "1439 Egbert Ave", phone: "(415) 678-5157", url: "https://taproom.laughingmonk.com" },
    ],
    hospital: { name: "Zuckerberg San Francisco General Hospital and Trauma Center", address: "1001 Potrero Ave", dist: "about 3 mi", phone: "(628) 206-8000", url: "https://www.zuckerbergsanfranciscogeneral.org" },
    transit: "The 19-Polk bus runs into India Basin along Innes Avenue toward Hunters Point. The T-Third Muni Metro line stops at the Hudson/Innes platform on Third Street, with the 44-O'Shaughnessy and 54-Felton buses connecting there; the 23-Monterey serves the wider Bayview.",
  },

  "Central Waterfront": {
    spirit: "San Francisco's working bayshore, where 170 years of shipbuilding meet a new waterfront of parks, lofts, and a beer hall under crane shadows.",
    reasons: ["Historic Pier 70 shipyard setting", "New Crane Cove Park on the bay", "Emerging Pier 70 mixed-use district", "T-Third light rail to downtown"],
    history: "This stretch of the central-eastern waterfront grew up around the Union Iron Works, the shipyard Peter Donahue's firm established at Potrero Point in the 19th century and which built the battleship USS Oregon and early U.S. Navy submarines. Charles Schwab's Bethlehem Steel bought the yard in the early 1900s, and during World War II Pier 70 built and repaired thousands of naval vessels. Commercial ship repair continued in the two floating dry docks until the operator walked away in 2017, leaving them idle. The Port of San Francisco opened the seven-acre Crane Cove Park here in 2020, and Brookfield's Pier 70 redevelopment is restoring historic structures like the WWII-era Building 12 while adding housing, parks, and arts and maker space.",
    facts: [
      { icon: "factory", title: "Union Iron Works", text: "The Pier 70 shipyard traces to the 19th-century Union Iron Works at Potrero Point, later Bethlehem Steel, which built the battleship USS Oregon and some of the Navy's first submarines." },
      { icon: "water", title: "Idle dry docks", text: "Pier 70's two floating dry docks repaired ships for decades but have sat deserted since the operator left in 2017; the Port has budgeted to demolish the aging structures." },
      { icon: "park", title: "Crane Cove Park", text: "Opened in 2020, this seven-acre Port park off Illinois Street has a sandy beach, lawns, a dog run, and two preserved shipyard cranes on the bay." },
      { icon: "factory", title: "Building 12 reborn", text: "Brookfield's Pier 70 project rehabilitated the WWII-era steel warehouse Building 12 into a market hall of makers, artists, food, and a taproom, the heart of the new district." },
      { icon: "house", title: "Pier 70 redevelopment", text: "The Pier 70 plan adds roughly 3.6 million square feet of housing, commercial, arts, and light-industrial space plus new waterfront parks to the historic district." },
    ],
    nearby: ["Dogpatch"],
    restaurants: [
      { name: "Piccino", address: "1001 Minnesota St", phone: "(415) 824-4224", url: "https://www.piccino.com" },
      { name: "Long Bridge Pizza Co.", address: "2347 3rd St", phone: "(415) 829-8999", url: "https://www.longbridgepizza.com" },
    ],
    bars: [
      { name: "Standard Deviant Brewing (Pier 70, Building 12)", address: "1070 Maryland St", phone: "(415) 690-2337", url: "https://www.standarddeviantbrewing.com" },
      { name: "Dogpatch Saloon", address: "2496 3rd St" },
    ],
    hospital: { name: "Zuckerberg San Francisco General Hospital and Trauma Center", address: "1001 Potrero Ave", dist: "about 1.5 mi", phone: "(628) 206-8000", url: "https://zuckerbergsanfranciscogeneral.org" },
    transit: "T-Third light rail runs on Third Street with the 20th Street (Dogpatch) and 23rd Street stops; Muni buses 22-Fillmore and 48 serve the area.",
  },

  "Showplace Square": {
    spirit: "San Francisco's design district in the flats northwest of Potrero Hill, where brick warehouses turned interior-design showrooms, tech offices, and breweries — home of the San Francisco Design Center, trading in furniture, fabric, and light.",
    reasons: ["Heart of SF's design and showroom trade", "Handsome early-1900s brick warehouse architecture", "Walkable to Potrero Hill and the Mission", "Brewery taprooms and design-district dining"],
    aka: "Design District",
    history: "The district grew up in the early 20th century as a flatland of brick-and-timber warehouses and light industry serving the rail and port economy. In the 1970s developer Henry Adams assembled several adjacent brick buildings (one wing had been cold storage) into the San Francisco Design Center, adding the dramatic glass-roofed Galleria atrium and bringing in the first interior-design showrooms as tenants. The cluster of showrooms gave the area its name, Showplace Square, after the Showplace building. Today the Design Center still houses more than 100 showrooms representing thousands of manufacturers, while the surrounding warehouse blocks have filled with tech offices, breweries, and new live/work lofts.",
    facts: [
      { icon: "art", title: "San Francisco Design Center", text: "The SF Design Center spans two buildings, the Showplace and the Galleria, with over 100 showrooms representing more than 2,000 manufacturers of furniture, fabric, lighting, and more." },
      { icon: "star", title: "The Galleria atrium", text: "Henry Adams joined four brick buildings around a dramatic skylit atrium in the 1970s; the Galleria at 101 Henry Adams St is now a landmark event hall." },
      { icon: "factory", title: "Brick warehouse roots", text: "The Showplace building at 2 Henry Adams St dates to about 1915, typical of the district's early-1900s brick-and-timber warehouse stock." },
      { icon: "beer", title: "Brewery scene", text: "Ballast Point's San Francisco tasting room and kitchen anchors the 16th Street edge of the district." },
    ],
    nearby: ["Potrero Hill", "SoMa"],
    restaurants: [
      { name: "Niku Steakhouse", address: "61 Division St", phone: "(415) 829-7817", url: "https://www.nikusteakhouse.com" },
      { name: "Dumpling Time", address: "11 Division St", phone: "(415) 525-4797", url: "https://www.dumplingtime.com" },
    ],
    bars: [
      { name: "Ballast Point", address: "705 16th St", phone: "(628) 400-5763", url: "https://ballastpoint.com/location/san-francisco/" },
    ],
    hospital: { name: "Zuckerberg San Francisco General Hospital and Trauma Center", address: "1001 Potrero Ave", dist: "about 1 mi", phone: "(628) 206-8000", url: "https://zuckerbergsanfranciscogeneral.org" },
    transit: "Muni buses 22-Fillmore (to Mission Bay), 19-Polk, 10-Townsend, and 55-Dogpatch serve the district; the 16th St corridor and Mission Bay are nearby.",
  },

  "Mint Hill": {
    spirit: "A tiny, history-soaked wedge at the seam of SoMa, the Mission, and Mid-Market, anchored by the granite hulk of the Old U.S. Mint and the buzzing pedestrian world of Mint Plaza — central, dense, and transit-rich.",
    reasons: ["One of the most transit-connected spots in the city", "Walk to Mint Plaza dining and 5th Street shopping", "Built around a true 1906 survivor landmark", "Central to SoMa, Union Square, and the Mission"],
    history: "The Old United States Mint at 5th and Mission, completed in 1874, is a neoclassical fortress nicknamed the 'Granite Lady.' When the 1906 earthquake and fire leveled the surrounding South of Market, Superintendent Frank Leach and his crew fought back the flames, and the building survived as one of the few structures left standing for blocks. At the time it held roughly a third of the nation's gold reserves and briefly served as the city's only working financial institution during the recovery. The Mint operated until 1937; a century later, in 2007, the once-neglected alley behind it was reborn as Mint Plaza, a privately funded pedestrian square that now hosts dining, markets, and events at the heart of this small, central district.",
    facts: [
      { icon: "quake", title: "Survived 1906", text: "The Old Mint was one of the few buildings left standing for blocks after the 1906 earthquake and fire, saved by its superintendent and staff." },
      { icon: "money", title: "A third of the gold", text: "At the time of the 1906 fire the Mint held about $300 million, roughly one-third of the entire nation's gold reserves." },
      { icon: "factory", title: "The Granite Lady", text: "Built 1869 to 1874 in neoclassical style, the Old U.S. Mint earned its nickname and coined gold and silver until 1937." },
      { icon: "fair", title: "Mint Plaza", text: "In 2007 the alley behind the Mint became Mint Plaza, San Francisco's first privately funded conversion of a city street into a public pedestrian plaza." },
    ],
    nearby: ["SoMa", "Union Square"],
    restaurants: [
      { name: "54 Mint Cucina Romana", address: "16 Mint Plaza", phone: "(415) 543-5100", url: "https://www.54mint.com" },
    ],
    bars: [
      { name: "SOMA Restaurant & Bar", address: "85 5th St", phone: "(415) 778-8500", url: "https://somarestaurantandbar.com" },
    ],
    hospital: { name: "CPMC Van Ness Campus", address: "1101 Van Ness Ave", dist: "about 1 mi", phone: "(415) 600-6000", url: "https://www.sutterhealth.org/cpmc" },
    transit: "Powell Street BART/Muni Metro station is a block away, serving BART (Red, Yellow, Green, Blue) and Muni Metro lines J, K, L, M, N. The F-Market streetcar and Powell-Hyde and Powell-Mason cable cars run nearby on Market Street.",
  },

  "Bret Harte": {
    spirit: "A tiny, easy-to-miss residential pocket in San Francisco's far southeast, tucked between the freeways near the Bayview and Portola edges.",
    reasons: ["Quiet, modest, residential southeast SF", "Near McLaren Park green space", "Close to Caltrain and Muni lines", "Bayview and Portola dining a short ride away"],
    history: "The neighborhood takes its name from Bret Harte (1836–1902), the Gold Rush-era writer whose 1868 story 'The Luck of Roaring Camp' made him one of the first California authors to win an international following. The pocket itself is one of the city's smallest neighborhoods, a cluster of modest homes wedged among the freeway corridors near the U.S. 101 and Interstate 280 interchange. It sits along the Bayview's industrial southeastern edge, bordered by Silver Terrace, the Portola, and the Bayshore corridor. Largely residential and ringed by industrial blocks, it remains obscure even to many lifelong San Franciscans.",
    facts: [
      { icon: "book", title: "Named for a Gold Rush writer", text: "Bret Harte (1836–1902) wrote 'The Luck of Roaring Camp' and was among the first California authors to gain international fame." },
      { icon: "road", title: "Wedged among freeways", text: "The small residential pocket sits near the U.S. 101 / Interstate 280 interchange in the city's far southeast." },
      { icon: "park", title: "McLaren Park nearby", text: "John McLaren Park, San Francisco's second-largest park at roughly 313 acres, sits just to the west above the Portola." },
      { icon: "tram", title: "Bayshore Caltrain close by", text: "The Bayshore Caltrain station at 400 Tunnel Ave is a short hop south, linking the area down the Peninsula." },
    ],
    nearby: ["the Bayview", "the Portola"],
    restaurants: [
      { name: "The Old Clam House", address: "299 Bayshore Blvd", phone: "(415) 695-2866", url: "https://theoldclamhouse.com" },
      { name: "Breakfast at Tiffany's", address: "2499 San Bruno Ave", phone: "(415) 468-8805", url: "https://www.breakfastattiffanyssf.com" },
      { name: "Old Skool Cafe", address: "1429 Mendell St", phone: "(415) 822-8531", url: "https://www.oldskoolcafe.org" },
    ],
    hospital: { name: "Zuckerberg San Francisco General Hospital and Trauma Center", address: "1001 Potrero Ave", dist: "about 4 mi", phone: "(628) 206-8000", url: "https://www.zuckerbergsanfranciscogeneral.org" },
    transit: "Muni 9-San Bruno and 8-Bayshore buses serve the nearby San Bruno Ave and Bayshore corridors; the T-Third light rail runs along Third St in the Bayview. Bayshore Caltrain station at 400 Tunnel Ave is just south.",
  },

  "Ingleside": {
    spirit: "A diverse, down-to-earth southwest village strung along Ocean Avenue — where a 1962 burger drive-in, family taquerias, and an all-ages brewery sit in the shadow of City College, all an easy hop from the K-line and Balboa Park BART.",
    reasons: ["Real working commercial strip on Ocean Ave", "Transit-rich: K-Ingleside Metro plus Balboa Park BART", "Next door to City College's Ocean campus", "One of the city's most diverse, neighborly districts"],
    aka: "OMI (Ocean View-Merced Heights-Ingleside)",
    history: "The neighborhood traces to the Ingleside Racetrack, which the Pacific Coast Jockey Club opened just off Ocean Road (now Ocean Avenue) on November 28, 1895, drawing thousands by special rail line and becoming the first American track with a real starting gate. Streetcar service reached Ocean Avenue the same year to serve the track, and after the racetrack era ended the area filled in with single-family homes along the new lines, accelerated when the K-Ingleside opened through the Twin Peaks Tunnel on February 3, 1918. City College of San Francisco opened its permanent Ocean campus at Ocean and Phelan avenues on August 27, 1940, anchoring the district. The old racetrack oval survives as the curving loop of Urbano Drive in the adjacent Ingleside Terraces residence park, home to a giant 1913 sundial. Today Ingleside is a middle- and working-class community known for its diversity, with the Ocean Avenue corridor as its commercial heart.",
    facts: [
      { icon: "book", title: "City College's flagship", text: "CCSF's Ocean campus opened at Ocean and Phelan in 1940, its Timothy Pflueger-designed Science Hall a showpiece of monumental architecture." },
      { icon: "tram", title: "Streetcar since 1918", text: "The K-Ingleside began running through the Twin Peaks Tunnel on February 3, 1918, and still rolls down the middle of Ocean Avenue today." },
      { icon: "book", title: "Ingleside Branch Library", text: "The neighborhood's public library sits right on the strip at 1298 Ocean Ave, a modern branch rebuilt for the community." },
      { icon: "road", title: "A racetrack in the street grid", text: "The 1895 Ingleside Racetrack's oval lives on as the curving loop of Urbano Drive in neighboring Ingleside Terraces." },
      { icon: "subway", title: "Two rail systems at the door", text: "Balboa Park BART and the K and M Muni Metro lines all meet at the neighborhood's eastern edge." },
    ],
    restaurants: [
      { name: "Beep's Burgers", address: "1051 Ocean Ave", phone: "(415) 584-2650", url: "https://www.beepsburgers.com" },
      { name: "Sakesan Sushi & Robata", address: "1400 Ocean Ave", phone: "(415) 347-7898" },
      { name: "Pakwan", address: "1140 Ocean Ave", phone: "(415) 841-8400", url: "https://pakwanrestaurant.com" },
      { name: "Champa Garden", address: "613 Faxon Ave", phone: "(415) 349-4186" },
    ],
    bars: [
      { name: "Ocean Ale House", address: "1314 Ocean Ave", phone: "(415) 988-7521", url: "https://oceanalehouse.com" },
      { name: "Philz Coffee", address: "1110 Ocean Ave", phone: "(415) 841-1178", url: "https://philzcoffee.com/locations/ocean-ave" },
    ],
    hospital: { name: "CPMC Mission Bernal Campus", address: "3555 Cesar Chavez St", dist: "about 2.5 mi", phone: "(415) 641-6625", url: "https://www.sutterhealth.org/cpmc" },
    transit: "K-Ingleside Muni Metro runs along Ocean Avenue; M-Ocean View and Balboa Park BART meet at the neighborhood's eastern edge. Buses 29-Sunset, 49 Van Ness-Mission, 8-Bayshore and 54-Felton serve the area.",
  },

  "Treasure Island": {
    spirit: "A man-made island built for a 1939 World's Fair, now a fast-rising waterfront neighborhood with the most jaw-dropping head-on views of the San Francisco skyline in the city.",
    reasons: ["Unmatched SF skyline views", "Brand-new waterfront homes", "8-minute ferry to the Ferry Building", "Bay-front parks & trails"],
    aka: "TI",
    history: "Treasure Island was built in 1936-37 atop the Yerba Buena Shoals to host the 1939-40 Golden Gate International Exposition, a World's Fair celebrating the new Bay and Golden Gate bridges. It was meant to become San Francisco's airport, but the U.S. Navy took it over during World War II as Naval Station Treasure Island, which it operated until the base closed in 1997. Since the Navy's departure it has been a modest residential community, and is now the site of one of the largest redevelopment projects in the country, adding thousands of new homes, high-rises, parks, and ferry service. The Art Deco Building One, the former Administration Building, remains a city landmark.",
    facts: [
      { icon: "fair", title: "Born from a World's Fair", text: "The island was created in 1936-37 to host the 1939-40 Golden Gate International Exposition." },
      { icon: "flag", title: "A Navy base for 50 years", text: "Naval Station Treasure Island operated here from World War II until it closed in 1997." },
      { icon: "star", title: "Head-on skyline views", text: "The island is famous for its straight-on panoramas of the downtown San Francisco skyline." },
      { icon: "house", title: "A new waterfront district", text: "One of the country's largest redevelopment projects is building thousands of new homes, towers, and parks." },
      { icon: "bridge", title: "On the Bay Bridge", text: "Treasure Island connects to SF and the East Bay via the Yerba Buena Island tunnel on the Bay Bridge." },
    ],
    restaurants: [
      { name: "Mersea Restaurant & Bar", address: "699 Avenue of the Palms", phone: "(415) 999-9836", url: "https://www.mersea.restaurant" },
      { name: "Aracely Cafe", address: "401 13th St", phone: "(415) 366-5091", url: "https://www.aracelysf.com" },
    ],
    bars: [
      { name: "Gold Bar Distillery", address: "1 Avenue of the Palms", url: "https://goldbarwhiskey.com" },
      { name: "Treasure Island Wines", address: "995 9th St", phone: "(415) 394-9463", url: "https://tiwines.net" },
    ],
    hospital: { name: "CPMC Van Ness Campus", address: "1101 Van Ness Ave (ER at 1260 Franklin St)", dist: "about 6 mi via the Bay Bridge", phone: "(415) 600-6000", url: "https://www.sutterhealth.org/cpmc" },
    transit: "The 25-Treasure Island Muni bus runs every 20 minutes, 7 days a week, between the island and the Salesforce Transit Center in downtown SF. The Treasure Island Ferry connects the island to the SF Ferry Building in about 8 minutes, 7 days a week.",
  },

  "Eureka Valley": {
    spirit:
      "The Castro's quieter uphill neighbor — Victorian-lined streets climbing toward Twin Peaks, with hidden concrete slides, grassy Kite Hill and the skyline spread out below.",
    reasons: [
      "Walk to the Castro",
      "Quiet residential hills",
      "Victorian-lined streets",
      "Kite Hill views",
    ],
    history:
      "Before anyone said “the Castro,” this bowl beneath Twin Peaks was Eureka Valley, part of Rancho San Miguel, the land granted in 1845 to José de Jesús Noé, Yerba Buena's last Mexican alcalde. Transit turned it into a neighborhood. In 1887 the Market Street Cable Railway decided to convert its steam-dummy line out Market Street to cable and push it over the Castro hill to 26th Street; by 1888 its cable cars ran from the Ferry Building to Noe Valley. Irish, German and Scandinavian families filled the slopes with cottages and flats, and in 1891 Alfred “Nobby” Clarke announced a castle at the foot of Twin Peaks that was quickly dubbed his folly.\n\nThe valley came through the 1906 earthquake and fire largely intact. When the line went electric after the quake, the Castro hill proved too steep for streetcars, so a cable shuttle kept climbing it until 1941. In 1918 the Twin Peaks Tunnel opened under Market Street with a stop of its own, Eureka Valley station; it closed in 1972, during construction of the Market Street subway.\n\nBy the late 1960s families were leaving for the suburbs, and inexpensive Victorians drew gay men who restored the houses and opened bars and shops. When the old Eureka Valley merchants' group snubbed gay-owned businesses, camera-shop owner Harvey Milk became first president of the new Castro Village Association, and the shopping blocks took the street's name. Uphill, neighbors fought for a decade, sit-in included, to save a Seward Street lot that opened as a mini-park in 1973. When AIDS struck, Most Holy Redeemer's former convent became a hospice in 1987. The quieter slopes above the shops still carry the old name.",
    facts: [
      {
        icon: "subway",
        title: "Muni's only ghost station",
        text:
          "Under Market Street a few steps south of this corner, between Diamond and Eureka streets, lies Eureka Valley station, which opened with the Twin Peaks Tunnel in 1918 and closed in 1972 during construction of the Market Street subway. Its street entrances were demolished, but K, L and M trains still run past its low platforms without stopping, and SFMTA calls it Muni's only ghost station.",
        place: "Eureka Valley ghost station",
        where: "Diamond St & 17th St",
        at: [-122.43749, 37.76241],
        source: "https://en.wikipedia.org/wiki/Eureka_Valley_station",
      },
      {
        icon: "church",
        title: "A convent turned AIDS hospice",
        text:
          "Most Holy Redeemer was founded in 1900 for Eureka Valley's Irish, German and Italian families, and its church was dedicated on Christmas Day 1901. As AIDS swept the neighborhood, the parish started an AIDS Support Group in 1985, and its former convent across Diamond Street opened as Coming Home Hospice in 1987.",
        place: "Most Holy Redeemer Church",
        where: "100 Diamond St",
        at: [-122.43737, 37.76064],
        source: "https://www.sfbos.org/sites/default/files/r0495-25.pdf",
      },
      {
        icon: "house",
        title: "Nobby Clarke's Folly",
        text:
          "When Alfred “Nobby” Clarke announced in 1891 that he would build a great castle at the foot of Twin Peaks, it was quickly dubbed “Nobby Clarke's Folly,” and by 1896 he had gone bankrupt and sold it to the faculty of the California Medical College. The four-story Baroque Queen Anne by architects Gould & Colley came through the 1906 earthquake and fires, later served as a hospital and then as 15 rental apartments, and became city Landmark No. 80 in 1975.",
        place: "Alfred E. “Nobby” Clarke Mansion",
        where: "250 Douglass St",
        at: [-122.43946, 37.75973],
        source: "https://en.wikipedia.org/wiki/Alfred_E._Clarke_Mansion",
      },
      {
        icon: "park",
        title: "Slides won by a decade-long fight",
        text:
          "In 1963 this steep lot was slated for development, and neighbors fought for a decade to save it, staging a bulldozer-defying sit-in in 1966; their campaign also helped change city law to require a minimum of open space in new developments. The mini-park opened in 1973 with a pair of concrete slides designed by a local teenager, and riders still bring a square of cardboard to sit on.",
        place: "Seward Street Slides",
        where: "30 Seward St",
        at: [-122.44039, 37.75818],
        source: "https://www.atlasobscura.com/places/seward-street-slides",
      },
      {
        icon: "star",
        title: "The view from Kite Hill",
        text:
          "A short walk from the slides, the grassy open space of Kite Hill rises over the valley at 19th and Yukon streets. From the top, the view runs east over the Castro toward downtown and the bay.",
        place: "Kite Hill Open Space",
        where: "170 Corwin St",
        at: [-122.44064, 37.75808],
        source: "https://sfrecpark.org/",
      },
      {
        icon: "tram",
        title: "The cable car that outlived 1906",
        text:
          "The line began in 1880 as a steam dummy running out Market Street to Castro; in 1887 its owners decided to convert it to cable and extend it over this hill to 26th Street, with Castro cars painted ivory with dark red trim. When the route went electric after the 1906 earthquake, this hill was too steep for streetcars, so a cable shuttle kept climbing it between 18th and 26th streets until April 5, 1941, when the 24 bus line took over; the 24 still climbs Castro Street today.",
        place: "Castro Street cable hill",
        where: "Castro St & 19th St",
        at: [-122.43481, 37.75924],
        source: "https://www.streetcar.org/cable_car_to_castro/",
      },
    ],
    walk: {
      intro:
        "A loop for visitors and would-be neighbors who want the Castro's quieter, hillier side: start at Castro Muni station (K, L and M trains, plus the F streetcar at 17th & Castro), climb past the Clarke mansion to the Seward Street slides and Kite Hill, then come back down 19th Street, about 1.5 miles and 80 minutes with stops. Go in daylight on a clear day, when the view from Kite Hill reaches downtown.",
      miles: 1.5,
      minutes: 80,
      tip:
        "Bring a flattened cardboard box for the concrete Seward Street slides, and pace yourself on the climb from Douglass Street up to Kite Hill, which gains about 150 feet; after that it's downhill along 19th Street, ending a block from the cafes and bars at 18th & Castro.",
    },
    nearby: ["the Castro"],
    restaurants: [
      { name: "Mama Ji's", address: "4416 18th St", phone: "(415) 626-4416" },
      { name: "Anchor Oyster Bar", address: "579 Castro St", phone: "(415) 431-3990", url: "https://anchoroysterbar.com" },
      { name: "Poesia Osteria Italiana", address: "4072 18th St", phone: "(415) 252-9325", url: "https://poesiasf.com" },
      { name: "Kasa Indian Eatery", address: "4001 18th St", phone: "(415) 621-6940", url: "https://kasaindian.com" },
    ],
    bars: [
      { name: "The Mix", address: "4086 18th St", phone: "(415) 431-8616", url: "https://www.themixbarsf.com" },
      { name: "Midnight Sun", address: "4067 18th St", phone: "(415) 861-4186", url: "https://midnightsunsf.com" },
      { name: "440 Castro", address: "440 Castro St", phone: "(415) 621-8732", url: "https://440castro.com" },
      { name: "Twin Peaks Tavern", address: "401 Castro St", phone: "(415) 864-9470", url: "https://twinpeakstavern.com" },
    ],
    hospital: {
      name: "CPMC Davies Campus",
      address: "45 Castro St at Duboce Ave",
      dist: "about 1 mi",
      phone: "(415) 600-6000",
      url: "https://www.sutterhealth.org/cpmc",
    },
    transit:
      "Buses do the climbing: the 24 Divisadero runs along Castro St, the 33 Ashbury–18th along 18th St, the 35 Eureka along Eureka St and the 37 Corbett along Corbett Ave. Castro Station (Muni Metro K, L and M) and the historic F-Market streetcar are just downhill at Market & Castro.",
  },
  "Union Street": {
    spirit:
      "Eight sunny blocks of Victorian storefronts from Van Ness to Steiner — boutiques, brunch patios, and a buzzing Fillmore Street bar corner, on what was once dairy pasture.",
    reasons: [
      "Union St boutiques & brunch",
      "Lively bar scene",
      "Sunny & walkable",
      "Condos & classic flats",
    ],
    history:
      "Named for the shopping street at its heart, this is the eastern end of greater Cow Hollow — the marshy valley where dozens of dairies supplied the young city's milk in the mid-1800s. Here lay Washerwoman's Lagoon, the freshwater pond where Gold Rush–era laundries washed the city's clothes, until dairies and tanneries fouled it; late in the century the dairies were pushed out and the pond was filled. Victorian and Edwardian homes and storefronts rose on the new lots, and in the 1950s–60s Union Street's blocks between Van Ness and Steiner reinvented themselves as a boutique-and-dining strip.",
    facts: [
      {
        icon: "house",
        title: "An eight-sided survivor",
        text:
          "The Octagon House on Gough St at Union dates to 1861, when eight-sided homes were a national fad. One of only two left in the city, it is now a small museum run by the National Society of the Colonial Dames of America.",
      },
      {
        icon: "church",
        title: "A temple of many towers",
        text:
          "The Vedanta Society's Old Temple at Webster and Filbert, built in 1905, is often called the first Hindu temple in the Western world. Its rooftop mixes domes and towers from several traditions — a nod to the Vedanta teaching that all religions lead to the same truth.",
      },
      {
        icon: "shopping",
        title: "An early boutique row",
        text:
          "In the 1950s–60s, shopkeepers converted Union Street's old Victorians into shops and cafés, making it one of San Francisco's first boutique shopping strips.",
      },
      {
        icon: "star",
        title: "A 1913 power saloon",
        text:
          "The Balboa Cafe (1913), at Fillmore and Greenwich, is one of the city's oldest saloons and a longtime see-and-be-seen hangout for San Francisco's political set.",
      },
    ],
    restaurants: [
      { name: "Flores", address: "2030 Union St", phone: "(415) 796-2926", url: "https://www.floressf.com" },
      { name: "Roaming Goat", address: "1830 Union St", phone: "(415) 769-7281", url: "https://www.roaminggoatsf.com" },
      { name: "Atelier Crenn", address: "3127 Fillmore St", phone: "(415) 440-0460", url: "https://www.ateliercrenn.com" },
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
      "The 45 Union–Stockton bus runs the length of Union Street toward downtown, with the 22 Fillmore crossing at Fillmore St, the 49 Van Ness along the eastern edge, and the 28 and 43 on Lombard St at the northern edge. There's no Muni Metro or BART nearby — it's a bus-and-walk neighborhood.",
  },
  "Sutro Heights": {
    spirit:
      "Where Geary runs out of city — a fog-draped bluff of Adolph Sutro's old gardens, the Cliff House perched on the rocks below, and nothing to the west but the Pacific.",
    reasons: ["Clifftop park at the door", "Ocean Beach starts here", "Lands End trails next door", "Quiet end-of-the-line blocks"],
    history:
      "Sutro Heights is named for Adolph Sutro (1830–1898), the Prussian-born engineer who made his fortune on the Sutro Tunnel, which drained the silver mines of Nevada's Comstock Lode, and who later served as mayor of San Francisco. In 1881 he bought a cottage on this windswept bluff above the Cliff House and made it his home and showpiece garden. He rebuilt the Cliff House below after the first one burned in 1894, and built the giant Sutro Baths in the cove just to the north. His family later deeded the Heights to the city; the house is long gone, but its foundations and the old parapet survive in Sutro Heights Park, now part of the Golden Gate National Recreation Area. Around the park, the western ends of Geary Boulevard and Point Lobos Avenue, Seal Rock Drive and the avenues from 42nd to 48th filled in as a quiet residential corner at the Richmond District's far western edge.",
    facts: [
      { icon: "park", title: "A millionaire's garden, open to all", text: "Sutro planted his clifftop estate with gardens and trees, lined its paths with dozens of statues, many of them copies of classical works, and opened it to the public. The grounds are now Sutro Heights Park, run by the National Park Service." },
      { icon: "pin", title: "The parapet lookout", text: "The parapet from Sutro's estate still stands at the bluff's edge, looking out over Seal Rocks and the long sweep of Ocean Beach." },
      { icon: "house", title: "Three Cliff Houses", text: "The first Cliff House went up on the rocks below the Heights in 1863. Sutro's turreted château replaced it in 1896, rode out the 1906 earthquake, then burned in 1907; the neoclassical building of 1909 still stands." },
      { icon: "wave", title: "Where Ocean Beach begins", text: "Ocean Beach, about 3.5 miles of sand, starts at the foot of the Cliff House and runs south to Fort Funston, with the Great Highway setting off beside it from Point Lobos Avenue." },
      { icon: "mayor", title: "The mayor who owned a twelfth of SF", text: "Sutro served as mayor from 1895 to 1897 and at one point owned roughly a twelfth of San Francisco's land, from these bluffs to the forested hill now called Mount Sutro." },
    ],
    nearby: ["the Outer Richmond"],
    restaurants: [
      { name: "Pacific Cafe", address: "7000 Geary Blvd", phone: "(415) 387-7091", url: "https://pacificcafesf.com" },
      { name: "Violet's Tavern", address: "2301 Clement St", phone: "(415) 682-4861", url: "https://www.violets-sf.com" },
      { name: "Pearl 6101", address: "6101 California St", phone: "(415) 592-9777", url: "https://www.pearl6101.com" },
    ],
    bars: [
      { name: "Simple Pleasures Cafe", address: "3434 Balboa St", phone: "(415) 387-4022" },
      { name: "Trad'r Sam", address: "6150 Geary Blvd", phone: "(415) 221-0773", url: "https://tradrsam.net" },
      { name: "The Blarney Stone", address: "5625 Geary Blvd", phone: "(415) 386-9914" },
    ],
    hospital: { name: "UCSF Health Stanyan Hospital (formerly St. Mary's)", address: "450 Stanyan St", dist: "about 3 mi", phone: "(415) 668-1000", url: "https://sfcommunityhospitals.ucsfhealth.org/st-marys" },
    transit:
      "The 38-Geary runs out to 48th Ave & Point Lobos at the park gate and, with the 38R-Geary Rapid, runs the length of Geary Blvd to downtown; the 31-Balboa runs along Balboa St at the southern edge, and the 5-Fulton and 5R-Fulton Rapid run along Fulton, two blocks south.",
  },
  "Northern Waterfront": {
    spirit:
      "The sunny, bay-facing foot of Telegraph Hill — old cargo piers reborn as a science museum and a cruise terminal, with the F-line streetcar rolling down the Embarcadero out front.",
    reasons: ["Sunny bayfront blocks", "Embarcadero promenade", "Walk to the Financial District", "F-line streetcar at the door"],
    aka: "Northeast Waterfront",
    history:
      "The name is plain geography: this is the northern stretch of San Francisco's port waterfront — the flat, bay-facing strip along the Embarcadero from Washington Street, past the foot of Telegraph Hill, to the edge of Fisherman's Wharf. Most of it is made land. In Gold Rush days the bay reached the foot of Telegraph Hill, and wharves, rubble and rock quarried from the hill pushed the shoreline east. From the late 1870s a state-built seawall, and later finger piers and the State Belt Railroad, made it a working port of warehouses and cargo sheds, with the city's wholesale produce market crowded around Washington and Davis streets. When shipping moved to Oakland's container terminals in the 1960s and '70s the piers emptied; the Golden Gateway redevelopment replaced the produce district, and the 1991 demolition of the Embarcadero Freeway reopened the shoreline. Today old brick warehouses hold offices, newer condos and apartments fill the blocks below the hill, and the piers host a science museum and a cruise terminal.",
    facts: [
      { icon: "road", title: "The freeway that came down", text: "The double-deck Embarcadero Freeway ended at Broadway, where the city's freeway revolt stopped its planned run toward the Golden Gate Bridge. Damaged in the 1989 Loma Prieta earthquake, it was torn down in 1991." },
      { icon: "star", title: "A museum on the piers", text: "The Exploratorium, founded in 1969 by physicist Frank Oppenheimer at the Palace of Fine Arts, moved to Pier 15 at the foot of Green Street in 2013." },
      { icon: "factory", title: "Blue-jeans headquarters", text: "Levi's Plaza was built in the early 1980s at the foot of Telegraph Hill as Levi Strauss & Co.'s headquarters; its plaza and park were designed by landscape architect Lawrence Halprin." },
      { icon: "house", title: "Once the produce market", text: "Into the early 1960s the blocks around Washington, Front and Davis streets were the city's wholesale produce market. After it moved to its present site on Jerrold Avenue in 1963, the Golden Gateway apartments, townhouses and Sydney G. Walton Square took its place." },
      { icon: "water", title: "Cruise ships at the door", text: "The James R. Herman Cruise Terminal opened at Pier 27 in 2014, named for longtime longshore union leader Jimmy Herman." },
    ],
    nearby: ["the Financial District", "North Beach", "Fisherman's Wharf"],
    restaurants: [
      { name: "Kokkari Estiatorio", address: "200 Jackson St", phone: "(415) 981-0983", url: "https://kokkari.com" },
      { name: "Schroeder's", address: "240 Front St", phone: "(415) 421-4778", url: "https://www.schroederssf.com" },
      { name: "Tadich Grill", address: "240 California St", phone: "(415) 391-1849", url: "https://tadichgrillsf.com" },
      { name: "Fog Harbor Fish House", address: "PIER 39, Suite A202", phone: "(415) 421-2442", url: "https://fogharbor.com" },
      { name: "Sotto Mare Oysteria & Seafood", address: "552 Green St", phone: "(415) 398-3181", url: "https://www.sottomaresf.com" },
    ],
    bars: [
      { name: "Comstock Saloon", address: "155 Columbus Ave", phone: "(415) 617-0071", url: "https://www.comstocksaloon.com" },
      { name: "Vesuvio Cafe", address: "255 Columbus Ave", url: "https://vesuvio.com" },
      { name: "Specs' Twelve Adler Museum Cafe", address: "12 William Saroyan Pl", phone: "(415) 421-4112", url: "https://www.specsbarsf.com" },
    ],
    hospital: { name: "Chinese Hospital", address: "845 Jackson St", dist: "about 0.6 mi", phone: "(415) 982-2400", url: "https://chinesehospital-sf.org" },
    transit:
      "The F-Market & Wharves historic streetcar runs the length of the neighborhood on the Embarcadero, with stops from Washington St up to Sansome St on its way to Fisherman's Wharf. The 1 California and the 12 stop a block south on Clay St, and the 12 also runs on Sansome St and Broadway just to the west. Embarcadero BART and Muni Metro station and the Ferry Building's ferry terminal are just to the south.",
  },
};

// Every fog-map polygon is its own neighborhood with its own entry. (Four
// polygons used to be folded into a neighbor's entry here — Eureka Valley,
// Union Street, Sutro Heights and Northern Waterfront; they now have their
// own.) Kept as the hook for a future alias, should one be needed.
const ALIASES = {};

// Fog polygons intentionally left WITHOUT a highlights entry because they are
// parks, military reservations, or pure industrial/maritime zones — not places
// to "live," so the residential-style pop-up doesn't fit: Apparel City,
// Aquatic Park / Ft. Mason, Candlestick Point SRA, Golden Gate Park,
// Lincoln Park / Ft. Miley, McLaren Park, Presidio National Park, Produce Market.
// Yerba Buena Island is residential but mid-redevelopment and was deferred;
// it could be added later. (Treasure Island, its flat neighbor, is authored.)

// Look up curated content for a neighborhood name (exact match on the fog
// geojson `name`, then aliases). Returns null when we haven't authored it.
export function getNeighborhood(name) {
  if (!name) return null;
  return NEIGHBORHOODS[name] || NEIGHBORHOODS[ALIASES[name]] || null;
}

// The authored entry's key for a fog-map polygon name (its own name, or the
// entry an alias polygon points at). Null when there is no entry.
export function entryKeyFor(name) {
  if (!name) return null;
  return NEIGHBORHOODS[name] ? name : (NEIGHBORHOODS[ALIASES[name]] ? ALIASES[name] : null);
}

// Every fog-map polygon that opens this entry: its own name plus any alias
// polygons that point at it (none today).
export function polygonNamesFor(key) {
  return [key, ...Object.keys(ALIASES).filter(a => ALIASES[a] === key)];
}

// Alphabetical index of authored neighborhoods for the A–Z list on the page.
// `key` is the fog geojson `name` (what the map/lookup uses); `label` is the
// display name (the `title` override when present; no entry sets one today).
export function listNeighborhoods() {
  return Object.entries(NEIGHBORHOODS)
    .map(([key, v]) => ({ key, label: v.title || key }))
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }));
}
