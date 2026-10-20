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
          "Harvey Milk ran his camera store and his campaigns for office from 573–575 Castro Street, and lived in the flat upstairs. Supervisors gave final approval to making it city Landmark No. 227 on May 22, 2000, which would have been his 70th birthday. Along Castro Street on the way here, watch the sidewalk: the bronze Rainbow Honor Walk plaques honoring LGBTQ figures began going into these sidewalks in 2014.",
        place: "Castro Camera",
        where: "575 Castro St",
        at: [-122.43463, 37.75962],
        source: "https://www.sfbos.org/ftp/uploadedfiles/bdsupvrs/ordinances00/o0121-00.pdf",
      },
      {
        icon: "shop",
        title: "Where two shopping streets cross",
        text:
          "San Francisco's planning code describes the Castro's shopping district as a crossing at Castro and 18th streets, its arms lined with many small, intensely active businesses: Castro Street from Market to 19th, and 18th Street on either side of Castro, this block included. The Market Street Cable Railway's Castro Street line, opened in the late 1880s, made old Eureka Valley easy to reach, and the neighborhood had its own bakeries, butcher shops and poultry and fish markets. Today shops, restaurants, cafés and bars fill the storefronts.",
        place: "Castro and 18th Street shops",
        where: "18th St & Hartford St",
        at: [-122.43374, 37.76111],
        source: "https://www.sfbos.org/ftp/uploadedfiles/bdsupvrs/ordinances12/o0226-12.pdf",
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
        "A short loop for first-time visitors and would-be neighbors that starts and ends at Castro Station (Muni Metro K, L and M; the F streetcar ends a few steps away), taking in the shops of Castro and 18th streets and the quiet Victorian block of Hartford Street. Allow about 35 minutes; a weekday late morning is calmest, a weekend afternoon is liveliest.",
      miles: 0.6,
      minutes: 35,
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
        icon: "shop",
        title: "The valley's main street",
        text:
          "Noe Valley's shopping district runs along 24th Street from Chattanooga Street west to Diamond Street, with this corner near its middle; the city's planning code describes it as a daytime-oriented district serving a mostly local market. A 1926 photograph taken here, looking west toward Twin Peaks, shows a movie theater on one side of 24th Street and a market on the other, and photographs from the 1940s show 11-line streetcars running along the street out to Hoffman Avenue. Shops, services, cafés and restaurants fill the ground floors, with some offices on the second story and homes on the floors above.",
        place: "24th Street shops",
        where: "24th St & Noe St",
        at: [-122.43188, 37.75145],
        source: "https://www.sfbos.org/ftp/uploadedfiles/bdsupvrs/ordinances10/o0101-10.pdf",
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
        "A one-way walk of about 1.8 miles for visitors and would-be neighbors, from the J-Church stop at Church & 24th streets along the 24th Street shopping blocks, then south past the old cable car turnaround and the Lyon-Martin House to St. Paul's Church, where the J runs past on Church Street for the ride back. Allow about 85 minutes; on a Saturday morning the farmers' market is running at Town Square.",
      miles: 1.8,
      minutes: 85,
      tip:
        "Save your coffee stop for the cafés on 24th Street between Church and Castro, before the walk turns south. At the end, look a block south of St. Paul's: the wye track where J-Church streetcars turned back for about eight decades still sits on 30th Street.",
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
        icon: "shop",
        title: "The Marina's main street",
        text:
          "Chestnut Street became the Marina's main street as the district was built out in the 1920s and early 1930s; the city's planning code treats its six blocks from Webster Street to Broderick as a neighborhood shopping district and, to keep its mix of sales and services, requires special approval for new banks. The F streetcar, opened in December 1914 with the fairgrounds at the end of its line, ran out Chestnut from Van Ness Avenue, and the 30 Stockton trolley bus that replaced it in 1951 still runs along the street. Today restaurants, cocktail lounges and clothing boutiques line it, along with a bakery, a bookstore, a gift shop and a 1937 Streamline Moderne movie theater.",
        place: "Chestnut Street shops and restaurants",
        where: "Chestnut St & Pierce St",
        at: [-122.43949, 37.80041],
        source: "https://www.sfmta.com/node/13311",
      },
    ],
    walk: {
      intro:
        "A one-way walk of about 2.7 miles for visitors and would-be neighbors, from the Marina Branch Library at Chestnut and Webster streets, where the 30 Stockton bus stops, north to the Marina Green, out the jetty to the Wave Organ, then west to the Palace of Fine Arts and back to Chestnut Street, ending among its shops and restaurants at Pierce Street, three blocks west of the start. Allow about an hour and a half, and go on a clear morning timed to a high tide.",
      miles: 2.7,
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
        icon: "shop",
        title: "A shopping street revived",
        text:
          "Hayes Valley's commercial center is the stretch of Hayes Street from Franklin Street west to about Laguna Street, three blocks with this corner near the middle, plus storefronts around the corners on Gough and Laguna streets. The elevated Central Freeway blighted parts of the valley, and one urban expert recalled Hayes Street as “pretty much abandoned”; after the freeway came down and Octavia Boulevard took its place, liquor stores and auto repair shops gave way to restaurants and boutiques. Today art galleries and clothing and furniture shops fill its storefronts too.",
        place: "Hayes Street shops",
        where: "Hayes St & Octavia St",
        at: [-122.42474, 37.77682],
        source: "https://www.nbcbayarea.com/news/local/freeways-ghost-looms-over-hipster-hotspot/1881117/",
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
        icon: "road",
        title: "A living alley",
        text:
          "In 2010 neighbors and the Department of Public Works made this end of Linden a “living alley”: three parking spaces gave way to a wider, landscaped sidewalk on the sunny side, and street and sidewalk were brought to one level. By 2018 the living alley ran the full block to Octavia.",
        place: "Linden Living Alley",
        where: "315 Linden St",
        at: [-122.42320, 37.77633],
        source: "https://sfpublicworks.org/node/34729",
      },
    ],
    walk: {
      intro:
        "A loop of about 0.7 mile for visitors and would-be neighbors that starts and ends at the Muni bus stop at Hayes and Gough streets: west past the shops of Hayes Street to the playground, then back east along Fell Street through the old freeway corridor to Patricia's Green and Linden Street. Allow about 45 minutes; a weekday morning is calmest, a weekend afternoon is liveliest.",
      miles: 0.7,
      minutes: 45,
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
        icon: "shop",
        title: "Six blocks of Upper Fillmore",
        text:
          "City planners describe the Upper Fillmore shopping district as about six blocks of Fillmore Street, from Bush Street north to Jackson, with this corner at its midpoint; most of its two- to four-story buildings went up between 1900 and the 1930s. The first electric streetcar line on Fillmore Street opened along these blocks in 1895, running from 16th and Folsom streets to Fillmore and Broadway on part of today's 22 Fillmore route. Planning reports from the mid-2010s counted more than 130 ground-floor businesses, among them restaurants, bars and clothing stores, with offices or apartments on the floors above.",
        place: "Fillmore Street shops",
        where: "Fillmore St & Sacramento St",
        at: [-122.43407, 37.78987],
        source: "https://commissions.sfplanning.org/cpcpackets/2015-005741CUA.pdf",
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
        "A one-way walk of about 1.3 miles for visitors and would-be neighbors, from the Haas-Lilienthal House on Franklin St (the 1 California stops a block and a half south, at Clay & Franklin) past Lafayette Park, a run of mansions, a church built with Union Square bricks and three blocks of Fillmore Street shops to Alta Plaza Park, two blocks above the 1's stop at California & Pierce for the ride back. Allow a little over an hour, and pick a clear day for the views from the two hilltop parks.",
      miles: 1.3,
      minutes: 65,
      tip:
        "From Calvary, walk three blocks south on Fillmore St to Sacramento, then two blocks west on Sacramento and a block up Pierce St to Clay, where the wide stairway climbs into Alta Plaza: the same steps the cars came down in What's Up, Doc?",
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
        icon: "shop",
        title: "The Mission Miracle Mile",
        text:
          "Streetcars once ran down Mission Street, and in 1949 its merchants persuaded Mayor Elmer Robinson to proclaim the dozen blocks from 15th Street to Army Street, now Cesar Chavez Street, the “Mission Miracle Mile.” Clothing, furniture and hardware stores, smaller department stores and big movie theaters already lined it. City planners call Mission Street the district's strong retail and transit spine, with Valencia and 24th streets as secondary retail spines.",
        place: "Mission Street shops",
        where: "Mission St & 21st St",
        at: [-122.41891, 37.75706],
        source: "https://www.sanfranciscostory.com/mission-miracle-mile/",
      },
      {
        icon: "movie",
        title: "A movie palace named for Nolan",
        text:
          "This began as a nickelodeon, the Idle Hour; in 1915 its owners hired the Reid Brothers to design a large auditorium and lobby, which opened in 1916, and in 1932 Timothy Pflueger remade it in Art Deco style, with 2,012 seats, for the Nasser brothers' theater chain. It closed in 1993, and City College bought it in 1998 for a campus that would have meant demolishing most of it, until it became city Landmark No. 245 in 2004. Alamo Drafthouse reopened it in December 2015, and in 2026 renamed it the Christopher Nolan Cinema.",
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
      {
        icon: "shop",
        title: "Calle 24, Mission to Potrero",
        text:
          "From Mission Street east to Potrero Avenue, 24th Street is lined with specialty stores, taquerias, Mexican bakeries and produce grocers. Longtime residents, merchants, service providers and arts groups founded the Lower 24th Street Merchants and Neighbors Association, today's Calle 24, in 1999, and in 2014 the Board of Supervisors recognized the Calle 24 Latino Cultural District, which runs from 22nd Street to Cesar Chavez Street with this stretch at its center.",
        place: "Calle 24 shops",
        where: "Harrison St & 24th St",
        at: [-122.41189, 37.75264],
        source: "https://calle24sf.org/about",
      },
    ],
    walk: {
      intro:
        "A 1.7-mile line for visitors and would-be neighbors, from the Armory at Mission and 14th streets (two blocks north of 16th St Mission BART; the 14 and 49 buses run along Mission St) south along the shops of Mission Street past the Mission's labor hall, mural alleys, movie palace and library, then east along the shops of 24th Street past Balmy Alley to Harrison Street, about a seven-minute walk east of 24th St Mission BART for the ride back. Allow about 80 minutes, and go on a sunny afternoon, when the murals are in full light.",
      miles: 1.7,
      minutes: 80,
      tip:
        "Walk Clarion Alley all the way through to Valencia St, another of the Mission's shopping streets, and back before continuing south on Mission St. The shops of Calle 24 continue east of Harrison St to Potrero Ave. The library reopens with a ribbon-cutting on Saturday, November 14, 2026; check SFPL's hours before planning to go inside.",
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
          "Poet Lawrence Ferlinghetti and Peter D. Martin opened City Lights in June 1953, naming it for Martin's magazine City Lights, itself a nod to the Chaplin film, and it has been called the nation's first all-paperback bookstore. In June 1957 police arrested its manager, Shig Murao, for selling Allen Ginsberg's Howl, which City Lights had published, to an undercover officer, and charged Ferlinghetti too; on October 3, Judge Clayton W. Horn ruled the poem was not obscene. In 2001 the Board of Supervisors made City Lights San Francisco Landmark No. 228, citing its role in the literary and cultural development of San Francisco and the nation. Beside it runs Jack Kerouac Alley, renamed from Adler Alley in 1988 at Ferlinghetti's request and made pedestrian-only in 2007 with quotes from Kerouac, Maya Angelou, John Steinbeck and others set into it.",
        place: "City Lights Bookstore",
        where: "261 Columbus Ave",
        at: [-122.40658, 37.79763],
        source: "https://en.wikipedia.org/wiki/City_Lights_Bookstore",
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
        icon: "shop",
        title: "A diagonal main street",
        text:
          "Columbus Avenue was cut diagonally through the street grid in the 1870s as Montgomery Avenue and took its present name in 1909. The city's planning code centers the North Beach commercial district on Columbus north of Broadway and describes it as a neighborhood-serving marketplace, a citywide specialty shopping and dining district and a tourist attraction. Many Italian restaurants, cafés and bakeries still line it on the way to Washington Square.",
        place: "Columbus Avenue shops and restaurants",
        where: "Columbus Ave & Green St",
        at: [-122.40872, 37.79939],
        source: "https://www.sfbos.org/ftp/uploadedfiles/bdsupvrs/ordinances08/o0087-08.pdf",
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
        "A one-way walk of about a mile for visitors and would-be neighbors, from City Lights at Columbus Ave & Broadway, a few blocks from Muni's Chinatown–Rose Pak Station, past the church on Vallejo Street and up the shops and restaurants of Columbus Avenue to Washington Square, then around the square and on out Columbus to where the old beach was. Allow about an hour, and go by day, when the cafés are open.",
      miles: 1,
      minutes: 60,
      tip:
        "Have your espresso at one of the cafés on Columbus Avenue, and save the bench time for Washington Square. The last stop is a Powell–Mason cable car stop; the line turns around a block north at Bay & Taylor, where you can board for the ride back to Powell & Market.",
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
        icon: "shop",
        title: "A shopping street on the cable line",
        text:
          "Small businesses and restaurants cluster along the five blocks of Hyde Street from Union south to Jackson, under a canopy of ficus trees, and an ice cream parlor has held the southwest corner of Hyde and Union, where the commercial strip begins, since 1948. The cable cars passing these storefronts follow a route that opened on February 9, 1891, as the California Street Cable Railroad's O'Farrell, Jones & Hyde line. It and a Jones Street shuttle that opened the same day were San Francisco's last entirely new cable lines, and its Hyde Street stretch survives in today's Powell-Hyde line.",
        place: "Hyde Street shops",
        where: "Hyde St & Green St",
        at: [-122.41887, 37.79833],
        source: "https://www.thebolditalic.com/my-favorite-corner-of-sf-hyde-and-union-swensens-ice-cream/",
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
        "A one-way walk for visitors and would-be neighbors, from the Powell-Hyde cable car stop at Hyde & Green, north past Hyde Street's shops, down Lombard Street's crooked block and across the hill's lanes and stairways to Ina Coolbrith Park, a block above the Powell-Mason cable car stop at Mason & Vallejo. It runs about 1.4 miles with steep climbs; allow 80 minutes, go on a weekday morning to beat the Lombard Street crowds, and save it for a clear day for the views.",
      miles: 1.4,
      minutes: 80,
      tip:
        "Walking north on Hyde, look east at Filbert Street: its block down to Leavenworth, at a 31.5 percent grade, tied 22nd Street for steepest on the city Bureau of Engineering's old list, though a newer independent measurement ranks it lower. From the foot of the Macondray Lane stairs, walk south on Taylor and west on Green St to the octagon house, then south on Jones to Polk's ramps; from Ina Coolbrith Park it is downhill to Mason St and the Powell-Mason cable car, a few blocks above North Beach. For more shops and restaurants, Polk Street, two blocks west of Hyde, has a shopping strip that runs about a mile through the gulch between Nob and Russian Hills. Bring good shoes for Jones St and the lane's wooden stairs.",
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
          "Leland Stanford built a $2 million mansion on this corner in 1876. The fire after the 1906 earthquake destroyed it, but the ten-foot wall of basalt and granite around its two-acre grounds survived, and part of it, with a restored fence, still runs along the eastern side of the hotel that stands on the site today. Stanford's California Street line crosses the Powell Street tracks here, the one corner where all three of the city's cable car lines stop.",
        place: "California & Powell",
        where: "California St & Powell St",
        at: [-122.40930, 37.79213],
        source: "https://en.wikipedia.org/wiki/Stanford_Court_Hotel",
      },
      {
        icon: "star",
        title: "Mansion, art school, sky bar",
        text:
          "Mark Hopkins' widow, Mary, left the mansion on this corner to her second husband, Edward Searles, who in February 1893 donated it to the San Francisco Art Association; it ran the Mark Hopkins Institute of Art here until the fire after the 1906 earthquake destroyed the house. In 1939 George D. Smith, owner of the hotel that now stands here, city Landmark No. 184, turned its 11-room, 19th-floor penthouse into the glass-walled Top of the Mark. In World War II, wives and sweethearts of departing servicemen gathered in its northwest corner to watch the ships sail out through the Golden Gate, and it became known as Weepers' Corner.",
        place: "Mark Hopkins Hotel",
        where: "999 California St",
        at: [-122.41035, 37.79155],
        source: "https://en.wikipedia.org/wiki/Top_of_the_Mark",
      },
      {
        icon: "beer",
        title: "A tiki bar in the old pool",
        text:
          "Sisters Tessie Fair Oelrichs and Virginia Fair Vanderbilt began this hotel, now city Landmark No. 185, and it had not yet opened when the 1906 earthquake and fire damaged it. Julia Morgan, hired for her skill with reinforced concrete, repaired it, and it opened a year to the day after the quake. Downstairs, the Tonga Room replaced the hotel's 75-foot indoor pool of 1929, the Fairmont Plunge, in 1945, with a band on a barge in the old pool and staged tropical rainstorms, and the hotel's timeline says Tony Bennett first sang “I Left My Heart in San Francisco” here in December 1961.",
        place: "Fairmont San Francisco",
        where: "950 Mason St",
        at: [-122.41072, 37.79240],
        source: "https://fairmont-san-francisco.com/explore/history",
      },
      {
        icon: "park",
        title: "One mansion survived, one became a park",
        text:
          "Silver baron James C. Flood finished the brownstone beside the park in 1886, faced in stone shipped from Connecticut quarries. The 1906 fire left its shell standing while the mansions around it burned, and the Pacific-Union Club had architect Willis Polk remodel it as the club's home; now a National Historic Landmark and a city landmark, it is a private club, so admire it from the sidewalk. On the park's site stood railroad attorney David Colton's white Neoclassical house of 1872, which Collis Huntington bought in 1892; it burned in the fire, and in February 1915 Huntington's widow, Arabella, sent the mayor a deed to the land, asking that it be known from then on as Collis P. Huntington Park.",
        place: "Pacific-Union Club & Huntington Park",
        where: "California St & Taylor St",
        at: [-122.41205, 37.79220],
        source: "https://en.wikipedia.org/wiki/James_C._Flood_Mansion",
      },
      {
        icon: "art",
        title: "A window of glass and soil",
        text:
          "Designed by Albert Roller, the California Masonic Memorial Temple was dedicated on September 29, 1958. Its main foyer holds a 48-by-38-foot “endomosaic” window by Emile Norman, who developed the technique: more than 150 hues of crushed glass, with soil, plant matter and metals, pressed between two large panes of acrylic. Roller commissioned it after seeing one of Norman's endomosaic windows at a hotel in Monterey.",
        place: "Masonic Memorial Temple",
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
      {
        icon: "shop",
        title: "A small shopping street on a narrow one",
        text:
          "San Francisco's Planning Code describes Pacific Avenue from just east of Polk Street to the four corners at Jones, about four blocks on Nob Hill's north slope south of the Broadway Tunnel, as a small-scale, mixed-use neighborhood shopping district on a narrow street, offering limited convenience goods to the blocks around it. The city made the stretch a neighborhood commercial district of its own in 2007, with rules meant to keep it a small shopping street in a largely low-rise neighborhood and to let sun reach its narrow roadway, and since 2017 the code has required shops or other commercial uses on the ground floor along parts of the avenue.",
        place: "Pacific Avenue shops",
        where: "Pacific Ave & Hyde St",
        at: [-122.41829, 37.79542],
        source: "https://codelibrary.amlegal.com/codes/san_francisco/latest/sf_planning/0-0-0-65882",
      },
    ],
    walk: {
      intro:
        "A one-way walk for visitors and would-be neighbors across the crest of Nob Hill and down its north slope: start at California & Powell, where all three cable car lines stop, pass the grand hotels, the Flood mansion and Huntington Park, the Masonic Memorial Temple and Grace Cathedral, head down Taylor and Washington streets to the Cable Car Museum, then follow the Powell-Mason tracks north on Mason Street to Pacific Avenue and walk west to its shops at Hyde Street, about 1.2 miles and an hour and 20 minutes with stops. Leave time to step inside Grace Cathedral and the museum.",
      miles: 1.2,
      minutes: 80,
      tip:
        "Ride a cable car up to California & Powell, where all three lines stop. The Cable Car Museum is free, and the walk ends at Pacific & Hyde, where Powell-Hyde cars stop for the ride back past the museum and down Powell Street toward Union Square.",
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
        at: [-122.44920, 37.76615],
        source: "https://www.sfmta.com/blog/n-judah-turns-87",
      },
      {
        icon: "shop",
        title: "Shops at the streetcar stop",
        text:
          "Cole Valley grew up around the streetcar stop at this corner, at the entrance to the Sunset Tunnel, and the corner is still the center of its small business district: about three blocks along Cole Street and part of Carl Street, with more than a dozen restaurants and cafés among the shops. In 2025 the city made Cole Street from Frederick Street to Parnassus Avenue and Carl Street from Shrader to Clayton, a block each way from this corner, the Cole Valley Entertainment Zone, where people may drink outdoors during permitted street events. From 1966 to 1989 a storefront on the block south of Carl held a lesbian bar that at its closing was claimed to be the oldest in the United States.",
        place: "Cole Street shops",
        where: "Cole St & Carl St",
        at: [-122.44997, 37.76580],
        source: "https://en.wikipedia.org/wiki/Cole_Valley,_San_Francisco",
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
        "A short loop for visitors and would-be neighbors that starts and ends at the N Judah's Carl & Cole stop. See where the trains come out of the hill, stroll the shops and cafés on Cole Street down to Parnassus Avenue and back, then head west on Carl Street to follow Stanyan Street along the edge of Golden Gate Park and return by Waller and Cole streets: about a mile and 45 minutes with stops. A weekday morning is calmest; a clear afternoon is best for lingering at the park's edge.",
      miles: 1,
      minutes: 45,
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
        title: "Streetcar tracks down the middle",
        text:
          "Cortland Avenue is Bernal Heights' main shopping street, with bakeries, cafés, restaurants, bars, bookshops and small boutiques in the storefronts along the blocks east and west of the library. Streetcar tracks were laid down the middle of the avenue for United Railroads' line 24, which linked Cortland with Divisadero Street and the Richmond, and today the 24 Divisadero bus runs along it.",
        place: "Cortland Avenue shops",
        where: "Cortland Ave & Ellsworth St",
        at: [-122.41458, 37.73888],
        source: "https://bernalwood.com/2015/06/17/tonight-show-and-tell-about-the-history-of-cortland-avenue/",
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
        "A 1.7-mile line for visitors and would-be neighbors, from Precita Park (Folsom St & Precita Ave, where the 67 bus stops, about a 12-minute walk from 24th St Mission BART) up over Bernal Hill, down past the Esmeralda slides and along the shops of Cortland Avenue to the Alemany Farmers' Market, where the 23 and 67 buses stop at Crescent Ave & Putnam St for the ride back. Allow about 80 minutes, and go on a Saturday morning, when the market is running.",
      miles: 1.7,
      minutes: 80,
      tip:
        "The only real climb comes first, up Folsom St from Precita Park to the summit, so it is downhill from there; save your coffee stop for the cafés along Cortland Avenue.",
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
        icon: "shop",
        title: "Shops on the old streetcar line",
        text:
          "The hill's shops, cafés and restaurants cluster on 18th Street, chiefly along the two blocks between Texas and Connecticut streets, with this corner in the middle. Soon after the 1906 earthquake, the San Francisco Chronicle reported a new business center springing up at 18th and Texas and 18th and Connecticut, with some retail merchants moving there from other parts of the city, and photographs from 1941 show Market Street Railway 22-line streetcars running along 18th Street and turning at Connecticut. Today restaurants, cafés and small shops fill the storefronts.",
        place: "18th Street shops",
        where: "18th St & Missouri St",
        at: [-122.39638, 37.76249],
        source: "https://www.potreroview.net/18th-street-then-now/",
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
        "A one-way walk of about 2 miles for visitors and would-be neighbors, starting at Caltrain's 22nd Street station: north to two of the hill's 1860s houses, west along the 18th Street shops to St. Teresa's, on to Slovenian Hall on Mariposa Street, then up Vermont Street and down its crooked block, ending at Julia Morgan's Neighborhood House on De Haro Street. Allow about 90 minutes in daylight; on Easter Sunday the Big Wheel race takes over Vermont Street.",
      miles: 2,
      minutes: 90,
      tip:
        "The hill is steep, so wear good shoes, and stop for coffee or lunch early on, at the cafés and restaurants along 18th Street between Texas and Connecticut streets. At the end, the 19 Polk bus stops at De Haro Street and Southern Heights Avenue, and the 22nd Street station is about half a mile to the east.",
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
        icon: "shop",
        title: "The Village at the crossroads",
        text:
          "Glen Park's commercial core, a stretch of about two blocks known as the Village, centers on this crossing: electric streetcars ran along Chenery Street from 1892, and in the 1910s and 1920s businesses and homes clustered around what fast became the neighborhood's core. Two buildings in a photograph dated 1910, looking east on Chenery from Diamond, still stand: 654 and 677 Chenery. The city's Planning Department says this crossing gives the small district more depth than a typical linear commercial corridor, and that its streets are lined with shops and restaurants, many of them locally owned.",
        place: "Diamond and Chenery Street shops",
        where: "Diamond St & Chenery St",
        at: [-122.43390, 37.73447],
        source: "https://generalplan.sfplanning.org/Glen_Park.htm",
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
        "A loop of about 1.2 miles for visitors and would-be neighbors that starts and ends at Glen Park BART (Diamond St & Bosworth St, also served by the J Church and the 23, 35, 36, 44 and 52 buses), up Diamond St to the village shops at Chenery St, out Chenery to Glen Canyon Park and its creek, and back along Bosworth St. Allow about an hour, and go by day, when the canyon trail is easiest to follow.",
      miles: 1.2,
      minutes: 55,
      tip:
        "Save time at the end for the Village: its shops and restaurants line Diamond and Chenery streets, within a block of the BART station where the loop finishes.",
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
      "Frequently combined with the neighborhood Union Street, the old dairy valley's quieter western end — leafy Victorian and Edwardian blocks running from Steiner to the Presidio's edge, a short stroll from Union Street's boutiques and brunch.",
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
          "Lombard Street was planned as the main approach to the Golden Gate Bridge, which opened to pedestrians on May 27, 1937, and to cars the next day; it still carries U.S. 101 from Van Ness Avenue to Richardson Avenue. Right after the opening, KQED reports, officials widened it from two lanes to six by clearing the south side, and dozens of motor lodges then lined that side.",
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
        "Before heading west, walk one block along Union to Pierce Street and turn left: just past Green Street is the Casebolt House at 2727 Pierce St, built for blacksmith Henry Casebolt around 1865 and now city Landmark No. 51. It's a private home, so admire it from the sidewalk, then rejoin Union Street. For shops and restaurants, go the other way from the start: Union Street's shopping district runs about eight blocks east from Steiner Street to Van Ness Avenue.",
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
          "Mona Caron's first mural, unveiled on November 21, 1998, runs about 340 feet along the back wall of a Market Street supermarket beside the Duboce Bikeway, which her site calls the first stretch of San Francisco street converted from car use to bicycle and pedestrian use; city planner Peter Tannen wrote a mural into the bikeway's budget. The 6,000-square-foot painting follows a virtual ride from downtown to Ocean Beach, past the Wiggle and Golden Gate Park, and paints the Wiggle as a waterway, a nod to the creek that once ran down its canyon.",
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
        icon: "shop",
        title: "Upper Market's three blocks",
        text:
          "For three blocks from Church Street to Castro Street, the north side of Market Street is lined with bars, restaurants, shops and other small businesses, and more continue up Church Street to Duboce Avenue, all part of what the city zones as the Upper Market Street Neighborhood Commercial Transit District. The strip follows an old transit route: in the late 1880s the Market Street Cable Railway replaced the steam dummy that had served the area with a cable car line running out Market from the Ferry to Castro Street. Many Scandinavian immigrants settled around Upper Market in the 1870s and 1880s, and churches, clubs and businesses serving them followed.",
        place: "Market Street shops",
        where: "Market St & Noe St",
        at: [-122.43306, 37.76422],
        source: "https://www.streetcar.org/historic_transit_heartland/",
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
        "A loop of about 1.8 miles for visitors and would-be neighbors: from Castro Station (Muni Metro K, L and M; the F streetcar ends at 17th & Castro), walk north on Castro Street past 16th and 15th streets to Henry Street, cross Duboce Park past the N Judah's tunnel portal, then come back down Church Street and along the shops of Market Street to Noe Street and 15th Street. Allow about 80 minutes, in daylight so you can see the houses' details.",
      miles: 1.8,
      minutes: 80,
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
          "Look down along Ringold Alley: metal bootprints along the curb honor 28 people from leather history, a design that the Exiles' Ringold Alley project page says was based on Mike McNamee's motorcycle boots. A black granite marker reproduces Mike Caffee's “Leather David” statue and a mural by Chuck Arnett, with a narrative by Gayle Rubin. Paid for from the adjacent L7 development's public-benefit fee, the installation was unveiled on July 27, 2017, on the alley that hosted the first Up Your Alley fair in 1985.",
        place: "Ringold Alley",
        where: "Ringold St & 8th St",
        at: [-122.40915, 37.77433],
        source: "https://en.wikipedia.org/wiki/San_Francisco_South_of_Market_Leather_History_Alley",
      },
      {
        icon: "shop",
        title: "Western SoMa's main street",
        text:
          "San Francisco's planning code sets aside part of Folsom Street as a neighborhood commercial district and means Folsom to be the main street of Western SoMa, with businesses that serve the neighborhood. The street's first leather bar opened at 11th Street in 1966, and by the late 1970s Folsom was a leather “Miracle Mile” of more than 30 gay bars, shops and bathhouses. Today bars and nightclubs dot the four blocks of Folsom from Seventh to 11th Street, and 11th's block down to Harrison is packed with bars, restaurants, lounges and clubs.",
        place: "Folsom Street shops and bars",
        where: "Folsom St & 9th St",
        at: [-122.41132, 37.77389],
        source: "https://gocodebook.com/library/us/ca/san-francisco-planning/article-2.5-height-and-bulk-districts/sec.-261.-additional-height-limits-applicable-to-certain-rh-districts/sec.-261.2.-additional-height-limits-for-the-folsom-street-nct-district",
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
          "Completed in 1912, this building served as San Francisco's temporary city hall; OpenSFHistory dates that role from 1912 to 1915, and Densho's encyclopedia says it briefly held the city jail as well. In 1917 it reopened as a hotel.",
        place: "Old temporary City Hall",
        where: "1231 Market St",
        at: [-122.41506, 37.77807],
        source: "https://en.wikipedia.org/wiki/Hotel_Whitcomb",
      },
    ],
    walk: {
      intro:
        "A flat loop of about 2.4 miles for visitors and would-be neighbors, starting and ending at Civic Center Station (BART and Muni Metro) on Market Street at 7th and 8th: down Sixth Street, along Folsom and Ringold Alley, back up to the bars and shops of Folsom Street and down 11th Street to Harrison, through the SoMa Pilipinas and Leather and LGBTQ cultural districts, then back along Harrison and up 10th Street to Market. Allow about an hour and 45 minutes with stops, and go in daylight so you can read the markers set along Ringold Alley.",
      miles: 2.4,
      minutes: 105,
      tip:
        "The Ringold Alley bootprints run along the curb, so walk the alley end to end, from 8th Street to 9th, with your eyes down, then turn up 9th Street to Folsom. From the old temporary City Hall, Civic Center Station is a short walk back up Market Street.",
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
          "The U.S. Army put up this gate on the Presidio's southern edge in 1896. In the 1990s a truck knocked a capstone off one of its piers, and the stone sat in storage in the Marin Headlands until 2008, when the Presidio Trust had stone carvers repair the cracked piers, recarve lost details from old photographs and put the capstone back on the southwest pier. The roughly $100,000 job won a California Preservation Foundation award in 2009.",
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
      {
        icon: "shop",
        title: "Five blocks of shops",
        text:
          "The city's planning code calls Sacramento Street's five blocks from Lyon Street west to Spruce Street, with this corner near their middle, a small-scale linear shopping strip, its daytime-oriented stores interspersed among homes and garages and offering convenience goods to the immediate neighborhood. Cable cars once ran along it: the Sacramento-Clay cable line, whose western end was at Walnut Street, was extended in February 1894 along Lake Street and Sixth Avenue to the Midwinter Fair in Golden Gate Park, and in 1904 the stretch west of Walnut was turned over to electric trolleys. Today home-decor shops, fashion boutiques and restaurants share the street.",
        place: "Sacramento Street shops",
        where: "Sacramento St & Laurel St",
        at: [-122.45020, 37.78764],
        source: "https://sfbos.org/sites/default/files/o0023-17.pdf",
      },
    ],
    walk: {
      intro:
        "A walk of about 2.4 miles for visitors and would-be neighbors from the 1, 2 and 43 buses at California St & Presidio Ave: up to the Swedenborgian church, west along Jackson and Washington streets to the Arguello Gate, then back east inside the Presidio on West Pacific Avenue, a stretch closed to cars, leaving by the Presidio Avenue gate beside the shingled houses of Pacific Avenue. From there head down Presidio Avenue and west along the shops of Sacramento Street to Laurel Street, a block north of the 1's stop at California St & Laurel St. Allow about 95 minutes and pick a dry day for the stretch inside the wall; the 43 also stops at Presidio Ave & Jackson St, a block south of the gate.",
      miles: 2.4,
      minutes: 95,
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
        icon: "shop",
        title: "Where the Beats hung out",
        text:
          "The North Beach commercial district runs up Grant Avenue for four blocks, from Broadway to Filbert Street, and its last block, between Union and Filbert, lies on Telegraph Hill's edge; the street was Dupont Street until 1908, when the city extended the Grant Avenue name north of Bush Street. In the 1950s a bar on upper Grant hosted Beat poetry readings and jazz jam sessions, and a coffeehouse at Grant and Green was another Beat hangout. Today shops, cafés, bars and restaurants fill its small storefronts, with homes on the floors above.",
        place: "Upper Grant Avenue shops",
        where: "Grant Ave & Union St",
        at: [-122.40750, 37.80068],
        source: "https://www.sfchronicle.com/bayarea/article/The-life-and-times-of-North-Beach-s-renowned-11010424.php",
      },
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
        "A short stair-climbing line for visitors and would-be neighbors, starting a block east of Washington Square: walk down the shops of Grant Avenue from Filbert Street to the 39 Coit bus stop at Union Street (the 8, 30 and 45 stop at Columbus Ave and Union St, two blocks west), climb Union Street to Montgomery Street, then go down the Filbert Steps past Napier Lane to Sansome Street and back up the Greenwich Steps to Coit Tower and Pioneer Park. Allow about an hour, more to see the tower's murals, and pick a clear morning for the view from the top.",
      miles: 0.8,
      minutes: 60,
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
        "A construction project has limited parking and closed parts of China Beach, so check the Park Service's alerts before you go; from the lot, steep stairs or a gentler service road to the right lead down to the sand. The houses along El Camino del Mar are private, so enjoy them from the sidewalk. For coffee or a meal, the shops and restaurants of the Outer Clement Street commercial district are under half a mile south of the starting corner, down 25th Avenue.",
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
      "Lake Street runs west from Arguello Boulevard past Mountain Lake, where Juan Bautista de Anza's party camped on March 27–28, 1776, while choosing sites for the Presidio and the mission; this neighborhood is its stretch west of Park Presidio Boulevard. The Presidio next door was sandy dune country until the Army planted it: in 1883 Maj. William A. Jones proposed a forest that would make the post look far larger than it was, and the first trees, donated by Adolph Sutro, went in on Arbor Day 1886. By the late 1880s a steam train ran out California Street toward Land's End; in 1905 electric streetcars of the new 1 Sutter-California line replaced it.\n\nIn 1903 the city paid $360,000 for the strip that became Park Presidio Boulevard to extend Golden Gate Park, and after the 1906 earthquake and fire, the refugee cottages of Camp Richmond lined it. In 1932 a Colonial Revival campus centered on a new hospital replaced the U.S. Public Health Service's original buildings at the north end of 15th Avenue; the hospital closed in 1981 and reopened as apartments in 2010. In the late 1930s Park Presidio was widened as the Highway 1 approach to the new Golden Gate Bridge.\n\nA 2012 city evaluation found a 1905 house at 1650 Lake Street individually eligible for the California Register, and in March 2020 neighbors applied to create a Lake Street Landmark District, an application planners called incomplete that June. Lake Street became a pandemic Slow Street, and on December 6, 2022, it was among the 16 initial corridors of the city's ongoing program. Its average daily traffic fell from 5,310 vehicles beforehand to 820 in 2023.",
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
          "Walk a short block north to where 15th Avenue ends at the Presidio's old Public Health Service District: in 1932 a Colonial Revival campus designed by Treasury architect James Wetmore replaced the original buildings there, with a new hospital at its center. The hospital closed abruptly in 1981 and sat vacant for years; in 2009 the Presidio Trust removed the wings added in the 1950s, and the next year the main building, the Presidio's largest historic building, reopened as apartments.",
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
          "By the late 1880s, cable cars from the Ferry Building ran to Presidio Avenue and California Street, and from there a steam train of the Ferries and Cliff House Railway carried riders out California Street, past this corner, to 33rd Avenue, then turned north along the cliffs above the Golden Gate, ending steps from Sutro Heights and Sutro Baths. In 1905 the United Railroads replaced the steam train with electric streetcars, which began running on the new 1 Sutter-California line on May 27 of that year; Muni's 1 California still stops at this corner.",
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
        icon: "shop",
        title: "A cable car street of shops",
        text:
          "City zoning makes Divisadero a neighborhood commercial district for 12 blocks, from Haight Street north to O'Farrell Street, with this corner at the midpoint; the walk from Hayes Street covers two of them. Cable cars running along the street brought the traffic that made it a busy shopping strip as the blocks around it grew into a streetcar suburb from the 1870s on. Its restaurant scene took off in the mid-2000s, when the street was better known for its mechanics and corner stores, and today restaurants, bars, grocers and other shops line it.",
        place: "Divisadero Street shops",
        where: "Divisadero St & Fulton St",
        at: [-122.43803, 37.77670],
        source: "https://en.wikipedia.org/wiki/Divisadero_Street",
      },
      {
        icon: "house",
        title: "The house called the Russian Embassy",
        text:
          "Architect Henry Geilfuss designed this house, finished in 1889, for William Westerfeld, a German-born baker and confectioner who ran a confectionery on Market Street. From the late 1920s Czarist Russian émigrés ran a nightclub in its ground-floor ballroom and met in the rooms upstairs, making it an informal “Russian Embassy”; after it became apartments in 1948, jazz musicians playing the nearby clubs moved in, saxophonist John Handy among them. Experimental filmmaker Kenneth Anger later lived here and used the house as a movie set.",
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
        "A short one-way walk for visitors and would-be neighbors: from the Divisadero & Hayes stop for the 6 and 24 buses, head two blocks north past the shops and restaurants of Divisadero Street to Fulton Street, walk east on Fulton to the landmark houses at Scott and Steiner streets, come down Steiner Street past the Painted Ladies and finish on the hilltop, a short stroll from the 6 stop at Hayes & Pierce. Allow about 45 minutes for three-quarters of a mile; a clear afternoon is best.",
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
        icon: "shop",
        title: "From cable car saloons to vintage racks",
        text:
          "San Francisco's planning code sets the Haight Street commercial district along about half a mile of Haight, from Stanyan Street at the park east to Central Avenue, and this corner is near its middle. After the Haight Street cable railroad was finished in 1883, the street's early businesses, among them saloons, hotels and restaurants, clustered near the cable car turnaround at Stanyan. Today its storefronts are best known for vintage and secondhand clothing, with record stores, smoke shops, cafés and restaurants among them.",
        place: "Haight Street shops",
        where: "Haight St & Clayton St",
        at: [-122.44858, 37.76981],
        source: "https://www.sfbos.org/ftp/uploadedfiles/bdsupvrs/ordinances08/o0088-08.pdf",
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
        "A one-way stroll of about 0.7 mile for visitors and would-be neighbors: start at Ashbury & Frederick (6 and 33 buses), walk north past the Grateful Dead house to Haight Street and west past its shops to Clayton, then loop up Clayton and along Page Street, dropping back to Haight at Shrader and ending at Golden Gate Park at Stanyan. Allow about 45 minutes; a weekday morning is calmest, a weekend afternoon is liveliest.",
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
          "The Japanese Cultural and Trade Center, now Japan Center, opened in March 1968 on blocks cleared by redevelopment. Minoru Yamasaki, also the designer of New York's World Trade Center towers, planned it with the local firm Van Bourg-Nakamura Associates, combining shops and restaurants in an interior mall with a hotel and a theater, most of it over underground parking. Today it covers the blocks between Fillmore and Laguna streets, from Post Street to Geary, and its three mall buildings hold Japanese restaurants, bookstores, skincare and beauty shops, and shops selling ceramics, cast-iron ware, anime and manga.",
        place: "Japan Center malls",
        where: "Post St & Webster St",
        at: [-122.43144, 37.78535],
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
        "A short one-way walk for visitors and would-be neighbors: start at the 38 Geary and 38R stop at Geary & Webster, walk up Webster Street to Post and through Japan Center's malls to Peace Plaza, then follow the Buchanan Street mall north, Sutter Street west to Cottage Row and Bush Street back east to the old Bush Street Temple, a block from the 2 bus at Sutter & Laguna. Allow about 45 minutes for 0.7 mile; a weekday late morning is calmest.",
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
      "The name is literal. The Western Addition was the grid San Francisco added west of Larkin Street, its old western boundary: the Van Ness Ordinance of 1855 settled land titles there, reserved land for the city and approved a map of new blocks, and the name came to cover some 500 blocks out to Divisadero Street. Victorian houses and flats filled those blocks.\n\nIn 1942 Executive Order 9066 sent the district's Japanese American families to incarceration camps, and Black workers recruited for the Bay Area shipyards, many from Texas and Louisiana, moved into the emptied homes. The Fillmore became the “Harlem of the West,” where you could hear jazz, blues and R&B at dozens of clubs. Bop City, which grew out of Slim Gaillard's short-lived Vout City in 1949, soon became, as pianist Frank Jackson recalled, the after-hours spot, where touring players such as Charlie Parker and John Coltrane sat in at the jam sessions in Jimbo Edwards's back room.\n\nThen came “urban renewal,” touted as blight removal. The Redevelopment Agency's A-2 project alone covered nearly 60 square blocks and affected more than 13,000 Fillmore residents. In 2008, as the agency prepared to leave the Western Addition the next January after 40 years, city officials counted 883 businesses shuttered, 4,729 households forced out and roughly 2,500 Victorians demolished. A few houses were saved by trucking them to new lots, and in the mid-1990s the agency itself created the Fillmore Jazz Preservation District, a dining and entertainment destination meant to draw visitors back.",
    facts: [
      {
        icon: "house",
        title: "A street of rescued houses",
        text:
          "In the early 1970s San Francisco Heritage and the Redevelopment Agency picked 12 Victorians in the agency's clearance area to save if they could be sold and moved, and Heritage bought all 12 at public auction. Most were trucked here in November 1974, and the Chronicle counts ten homes in the Beideman Place historic district. The Italianate at 33–35 made the longest move, about 18 blocks from 736–738 Franklin Street, and 43–45 came from 848 Octavia Street.",
        place: "Beideman Place",
        where: "33 Beideman St",
        at: [-122.43860, 37.78203],
        source: "https://www.sfchronicle.com/totalsf/article/victorian-homes-tour-sf-19722418.php",
      },
      {
        icon: "pin",
        title: "A Masonic temple, then Peoples Temple",
        text:
          "The building that stood here began as the Albert Pike Memorial Temple of the Scottish Rite Masons. In the early 1970s Peoples Temple bought it for $125,000 as its San Francisco headquarters, and many of the more than 900 people who died at the group's Jonestown settlement in Guyana on November 18, 1978, were members from the Fillmore. The building was later torn down and a post office built in the 1990s now fills the lot; for the 40th anniversary in 2018, the Chronicle reported, San Francisco's first public ceremony for the victims was planned here.",
        place: "Peoples Temple site",
        where: "1859 Geary Blvd",
        at: [-122.43388, 37.78398],
        source: "https://theclio.com/entry/38287",
      },
      {
        icon: "shop",
        title: "Nine blocks of storefronts",
        text:
          "City zoning sets aside nine blocks of Fillmore Street, from Bush Street south to McAllister, as a neighborhood commercial district with housing over ground-floor shops; this walk follows the six blocks below Geary. After the 1906 earthquake the first streetcar line back in service ran on Fillmore, and City Hall and most of the big Market Street department stores moved to the street while downtown rebuilt. Today restaurants, bars and music venues cluster in the blocks just south of Geary, where sidewalk pavers are engraved with the names of jazz greats and the clubs of the Fillmore’s “Harlem of the West” years.",
        place: "Fillmore Street shops and restaurants",
        where: "Fillmore St & O'Farrell St",
        at: [-122.43267, 37.78310],
        source: "https://www.sfbos.org/ftp/uploadedfiles/bdsupvrs/ordinances15/o0126-15.pdf",
      },
      {
        icon: "music",
        title: "A jazz club's long intermission",
        text:
          "Opened in 2007 as one of the last projects of the Western Addition redevelopment program, this $80.5 million public-private complex has 80 condominiums and about 50,000 square feet of commercial space, once anchored by a 28,000-square-foot jazz club. The club closed in 2014 and the space has sat largely dark since; in 2026 the city reopened it, free to community groups, for short-term programming through December while it studies the building's future.",
        place: "Fillmore Heritage Center",
        where: "1330 Fillmore St",
        at: [-122.43205, 37.78192],
        source: "https://hoodline.com/2026/05/long-dark-fillmore-heritage-center-gets-brief-second-act/",
      },
      {
        icon: "mayor",
        title: "A first on the Board of Supervisors",
        text:
          "Ella Hill Hutch, a civil rights leader elected to the Board of Supervisors in 1977 and reelected in 1980, was the first African American woman to serve on it. She died on February 25, 1981, and on June 11, 1981, Mayor Dianne Feinstein dedicated this community center bearing her name. Through the summer and fall of 2026 the Recreation and Park Department is running it while the city gathers ideas for its future.",
        place: "Ella Hill Hutch Community Center",
        where: "1050 McAllister St",
        at: [-122.42949, 37.77915],
        source: "https://sfplanning.org/node/3740",
      },
      {
        icon: "art",
        title: "A city-owned home for Black arts",
        text:
          "Billed as the only city-owned cultural center devoted to preserving African American art and culture, this 34,000-square-foot complex holds the roughly 200-seat Buriel Clay Theater. Its resident organizations include the San Francisco African American Historical and Cultural Society and the African American Shakespeare Company, here since 2004. The building faces a closure for a major renovation expected to take several years.",
        place: "African American Art & Culture Complex",
        where: "762 Fulton St",
        at: [-122.42930, 37.77824],
        source: "https://savingplaces.org/places/african-american-art-and-culture-complex",
      },
      {
        icon: "church",
        title: "A congregation from the Gold Rush",
        text:
          "Bethel AME dates its San Francisco history to 1852 and has gone by several names, among them St. Cyprian's African M.E. Church, meeting in several places around the city before settling here on Laguna Street in 1945. KQED has called it the largest and oldest African American church in San Francisco, and it is counted among the earliest African American churches in the West.",
        place: "Bethel AME Church",
        where: "916 Laguna St",
        at: [-122.42688, 37.77942],
        source: "https://en.wikipedia.org/wiki/Bethel_African_Methodist_Episcopal_Church_(San_Francisco)",
      },
    ],
    walk: {
      intro:
        "A one-way walk of about 1.4 miles for visitors and would-be neighbors, from Beideman Place, a short walk from the 31 Balboa stop at Eddy & Scott, north to Geary Blvd and east to the Peoples Temple site, then south down the shops and old jazz blocks of Fillmore Street and on past the community and cultural centers to Bethel AME near Laguna & McAllister, where the 5 Fulton stops. Allow about 65 minutes; the grades are gentle, and a weekday afternoon is a good time.",
      miles: 1.4,
      minutes: 65,
      tip:
        "From the 31 Balboa stop at Eddy & Scott, walk a block north on Scott St and turn west on Ellis St for Beideman Place; afterward return to Scott St, follow it north to Geary Blvd and Geary east past the Peoples Temple site to Fillmore St, then walk south on Fillmore. Check what's open before you go: the Heritage Center's community programming is a city pilot through December 2026, and the Art & Culture Complex faces a multiyear renovation. At the end, the 5 and 5R at McAllister & Laguna run back downtown.",
    },
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
      "Long before Laurel Heights had houses, it had headstones. Lone Mountain Cemetery opened here in 1854 and was renamed Laurel Hill in 1867. It held, in the words of the state's landmark listing, “the builders of the West, civic and military leaders, jurists, inventors, artists, and eleven United States Senators.” The city halted new burials around 1900 and barred them by ordinance in 1902. Laurel Hill's defenders beat back several ballot measures to clear it, but in 1937 the Board of Supervisors ordered its burials removed; exhumations began in 1940, and some 35,000 remains went south to Cypress Lawn in Colma.\n\nWest of the graves, Jordan Park had been laid out in 1906 on what a photograph of that year calls race track property. Once the cemetery was cleared, Heyman Brothers, a city builder since the 1890s, planned some 600 houses, duplexes and small apartment buildings there, first conceived as Mayfair Terrace. World War II held them up; building began in 1947 and was about three-quarters done within two years. The new neighborhood was called Laurel Heights in a nod to the cemetery, and its California Street shopping strip became Laurel Village.\n\nThe school district bought a 12-acre corner of the old cemetery and then decided not to build. The land was rezoned, and Fireman's Fund Insurance opened a modernist headquarters there in 1957. The insurer stayed until 1983; UCSF bought the building in 1985 for pharmacy school laboratories, and neighbors sued over its environmental review. Laurel Heights Improvement Association v. Regents reached the California Supreme Court twice, in 1988 and 1993. UCSF closed the campus in 2023, and the site is now planned for 744 homes.",
    facts: [
      {
        icon: "church",
        title: "The landmark plaque that vanished",
        text:
          "The state registered the site of Laurel Hill Cemetery as California Historical Landmark No. 760 on April 28, 1961, and a bronze plaque went up on the campus wall here at California and Walnut; landmark hunters have reported it missing since at least 2013. Among the cemetery's dead was U.S. Senator David C. Broderick, killed in a duel. When the graves were cleared, his monument column was broken up where it stood, and with no family to claim him, he went to the Pioneer Mound at Cypress Lawn.",
        place: "Laurel Hill Cemetery site",
        where: "California St & Walnut St",
        at: [-122.44844, 37.78692],
        source: "https://ohp.parks.ca.gov/ListedResources/Detail/760",
      },
      {
        icon: "money",
        title: "A modernist office on old graves",
        text:
          "Fireman's Fund Insurance began work in its new headquarters here on June 17, 1957: a glass-walled, four-winged modernist building by architect Edward B. Page, with grounds by landscape architects Eckbo, Royston & Williams, the buildings and landscape designed to work as one. UCSF bought it in 1985 and closed its Laurel Heights campus here in 2023. Now called Presidio Highlands, the 10-acre site is planned for 744 homes, and permits for a first phase of 152 apartments in three buildings were filed in February 2026.",
        place: "Fireman's Fund headquarters",
        where: "3333 California St",
        at: [-122.44960, 37.78650],
        source: "https://pcad.lib.washington.edu/building/16191",
      },
      {
        icon: "shopping",
        title: "Named for the cemetery",
        text:
          "Laurel Village is the shopping center along two blocks of California Street, from Laurel Street west to Spruce, with this corner at its middle; when the cleared cemetery land was built up after World War II, the new neighborhood was called Laurel Heights in a nod to Laurel Hill, and this strip became Laurel Village. Its midcentury modern buildings date from 1948 through the 1950s, and a 1951 photograph shows the site still nearly vacant, with just one business. A supermarket, cafés and eateries, a hardware store, a pharmacy, boutiques and wellness studios fill its storefronts.",
        place: "Laurel Village shops",
        where: "California St & Locust St",
        at: [-122.45170, 37.78640],
        source: "https://couparconsulting.com/journal/weve-moved-coupar-on-sacramento-street",
      },
      {
        icon: "pin",
        title: "A headstone under the garage",
        text:
          "Heyman Brothers first conceived its roughly 600 postwar homes as Mayfair Terrace, and the name lives on in Mayfair Drive, by Laurel Village. The cemetery never entirely left: in 2017 a work crew beneath a garage at Iris Avenue and Mayfair Drive struck a marble headstone, about a ton by one account, whose oldest carved date was 1813. News reports noted that some of Laurel Hill's gravestones were left behind when the dead were moved.",
        place: "Mayfair Drive",
        where: "Iris Ave & Mayfair Dr",
        at: [-122.45240, 37.78600],
        source: "https://digital-release.kron4.com/news/video-century-old-tombstone-found-buried-underneath-san-francisco-garage/amp",
      },
      {
        icon: "house",
        title: "A 1906 residence park",
        text:
          "Jordan Park, between Geary Boulevard, California Street, Palm Avenue and Parker Avenue, dates from 1906; a photograph from that year in the California Historical Society's collection is titled “Race track property—now Jordan Park.” It is one of eight residence parks in the city's draft study “Gardens in the City: San Francisco Residence Parks, 1906–1940.” Its entrance pillars are gone, but a Western Neighborhoods Project photo caption places a sales office of the Suburban Home Building Society at this intersection's southwest corner.",
        place: "Jordan Park",
        where: "Jordan Ave & Euclid Ave",
        at: [-122.45690, 37.78385],
        source: "https://sfplanning.org/project/residence-parks-historic-context-statement",
      },
      {
        icon: "movie",
        title: "Where Star Wars lines circled the block",
        text:
          "Across Geary, at No. 3575, stood the Coronet, a Streamline Moderne movie house by Cantin & Cantin that opened on November 2, 1949. When Star Wars opened in 1977, the Coronet was its only San Francisco theater, and lines snaked around the block for weeks. It closed on March 17, 2005, about two months before Revenge of the Sith opened, and was torn down in July 2007; an Institute on Aging building now stands on the site.",
        place: "Coronet Theatre site",
        where: "3575 Geary Blvd",
        at: [-122.45750, 37.78111],
        source: "https://en.wikipedia.org/wiki/Coronet_Theatre_(San_Francisco)",
      },
    ],
    walk: {
      intro:
        "A one-way walk of about a mile for visitors and would-be neighbors, from the 1, 2 and 43 bus stops at California St & Presidio Ave west past the old Laurel Hill Cemetery grounds and the Laurel Village shops, then by Mayfair Drive and Iris Avenue to Euclid Avenue and Jordan Park, ending on Geary Blvd near Arguello Blvd, where the 38 Geary and 33 buses stop. Allow about 45 minutes; a weekday late morning is calmest.",
      miles: 1,
      minutes: 45,
      tip:
        "The cafés of Laurel Village, a third of the way along, make the walk's coffee and snack stop. At the end, the 38 and 38R Geary run east toward downtown and west toward the Outer Richmond.",
    },
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
      "Ashbury Heights takes its name from Ashbury Street, which honors Munroe Ashbury, a member of the Board of Supervisors from 1864 to 1870. The name once stretched much farther: an old newspaper item applied it to the whole district south of the Panhandle, from Baker Street west to First Avenue, where residents had formed the Ashbury Heights and Stanyan Street Improvement Club. Today it means the steep slope at the base of Tank Hill beside Cole Valley, which San Francisco State's Kirkeberg photo collection bounds by 17th Street, Stanyan Street, Clarendon Avenue and Twin Peaks Boulevard.\n\nIn 1880 Adolph Sutro bought 1,200 acres of Rancho San Miguel, including the hill to the west that he called Mount Parnassus, now Mount Sutro. In 1894 the Spring Valley Water Company built a 500,000-gallon tank on the 650-foot knob above the east end of Belgrave Avenue, giving Tank Hill its name. By 1910, when the appraiser A. S. Baldwin photographed Sutro's estate, his “Ashbury Heights” plates showed houses, streets, a boardwalk and Sutro's Triumph of Light statue on Mount Olympus. After the 1906 earthquake and fire, voters approved bonds in 1908 for a separate high-pressure firefighting water system, completed in 1913; in 1912 crews were photographed building its Ashbury Heights tank at Clayton and Carmel streets, and Engine Company No. 40, organized in 1909, had its quarters across the street.\n\nThe tank on Tank Hill came down in 1957, and the city sold the lot as surplus in 1960. Neighbors pushed the city to buy it back, and in 1977 it did, as part of a citywide effort to acquire the remaining knolls and ridges for parks.",
    facts: [
      {
        icon: "road",
        title: "Sutro's Mount Parnassus",
        text:
          "Parnassus Avenue runs west from this corner toward UCSF's Parnassus Heights campus, which began with 13 acres on Parnassus Avenue that Adolph Sutro donated to the University of California's Regents in 1895. Sutro called the hill above the campus Mount Parnassus; in 1886 he began planting it with imported and native trees to celebrate San Francisco's first Arbor Day, UCSF says, and it was later renamed Mount Sutro in his honor.",
        place: "Parnassus Avenue",
        where: "Cole St & Parnassus Ave",
        at: [-122.44985, 37.76477],
        source: "https://www.ucsf.edu/cgr/cgr-projects/mount-sutro-open-space-reserve",
      },
      {
        icon: "water",
        title: "The tank behind the red-top hydrants",
        text:
          "Across Clayton Street, opposite the end of Carmel Street, stands the Ashbury Heights tank of the high-pressure firefighting water system that voters funded in 1908, after the earthquake and fire, and that was completed in 1913, separate from the drinking-water system. The original 500,000-gallon tank, photographed under construction in 1912, fed the system's upper zone, and the SFPUC lists a new Ashbury Tank among its completed upgrades. Watch for hydrants with red tops: the SFPUC's 2026 fact sheet says they draw on the Ashbury tanks, while black tops draw on Twin Peaks and blue tops on the Jones Street tank. Engine Company No. 40, organized in October 1909, had its quarters across the street from the tank until 1956.",
        place: "Ashbury Tank",
        where: "Clayton St & Carmel St",
        at: [-122.44663, 37.76094],
        source: "https://www.sfpuc.gov/sites/default/files/documents/Firefighting-Water-System-Fact-Sheet-02.24.2026.pdf",
      },
      {
        icon: "star",
        title: "Named for a tank that's gone",
        text:
          "In 1894 the Spring Valley Water Company built the 500,000-gallon Clarendon Heights tank on this 650-foot hill, storing water pumped up from its reservoir at Laguna Honda, and the tank gave the hill its name; after Pearl Harbor, blue gum eucalyptus were planted around it to hide it. The city removed the tank in 1957, leaving its concrete platform, and sold the land as surplus in 1960. Neighbors pushed the city to buy it back, and in 1977 it did, as part of a citywide effort to acquire the remaining knolls and ridges for parks.",
        place: "Tank Hill",
        where: "Twin Peaks Blvd & Clarendon Ave",
        at: [-122.44769, 37.75995],
        source: "https://en.wikipedia.org/wiki/Tank_Hill",
      },
      {
        icon: "park",
        title: "A stair into Sutro's forest",
        text:
          "Near this corner, wooden stairs climb into the Interior Greenbelt, a city-owned part of Sutro Forest that the city bought in the 1950s. Recreation and Park says it holds the long-hidden Woodland Creek and a half mile of trail built in the 1880s that leads up to Mount Sutro, and that a newly restored historic trail now links it with the Mount Sutro trails, opening a total of 72 acres.",
        place: "Interior Greenbelt",
        where: "Stanyan St & 17th St",
        at: [-122.45186, 37.76131],
        source: "https://sfrecpark.org/1062/Interior-Greenbelt-Trail",
      },
    ],
    walk: {
      intro:
        "A one-way walk of about a mile for visitors and would-be neighbors, from Cole St & Parnassus Ave (6, 37 and 43 buses; the N Judah stops a block north at Carl & Cole) south on Cole Street and east on Carmel Street to the Ashbury tank, up Twin Peaks Boulevard and the wooden steps to Tank Hill, then down to Belgrave Avenue and west to Stanyan Street, ending at the Interior Greenbelt stair at Stanyan & 17th. Allow about an hour, and go on a clear day, when the view from Tank Hill reaches farthest.",
      miles: 1,
      minutes: 60,
      tip:
        "For coffee or a bite before you set out, Cole Valley's small business district, about three blocks of cafés, restaurants and shops on Cole Street and part of Carl Street, is centered a block north of the start at Carl & Cole. The wooden steps up Tank Hill leave Twin Peaks Boulevard near Clarendon Avenue, across from Crown Terrace, and another path drops from the top to the east end of Belgrave Avenue. At the end, the Greenbelt's 1880s trail climbs on toward Mount Sutro if you want more forest, and the 37 Corbett stops at 17th & Cole, a short walk east on 17th Street, for the ride back.",
    },
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
      "For most of its history this stretch between Fillmore Street and Presidio Avenue was part of the Western Addition. An 1861 street guide already listed Hamilton Square, spanning Geary between Steiner and Scott, and in 1863 Dominican friars paid $6,000 for the block at Bush and Steiner, where their first church was blessed in 1873. The California Street Cable Railroad opened to Fillmore in April 1878 and in May 1879 pushed west to Central Avenue, today's Presidio Avenue, along the neighborhood's northern edge. Victorians followed, among them an 1883 house on Broderick Street that television would make famous.\n\nWhen the 1906 fire burned out downtown, City Hall and most big department stores moved west to Fillmore, the closest thoroughfare left intact. Mayor Eugene Schmitz and the Committee of Fifty met at Franklin Hall, at Fillmore and Bush, to launch the relief effort, and refugees camped in Hamilton Square. Merchants from the burned district soon proposed electrically lit arches over the street. Mount Zion Hospital, founded by members of the city's Jewish community in 1887, came west too, with $100,000 from Isaias Hellman for a new hospital named for his late wife, Esther.\n\nDuring World War II, Black newcomers from the South moved into the Fillmore, replacing Japanese American families forced into incarceration camps. After the war Erich Mendelsohn, a leading Expressionist architect, designed the Maimonides Health Center on Sutter Street. The 1989 Loma Prieta earthquake destroyed the lantern atop St. Dominic's tower; by 1992 the tower was rebuilt and the walls braced by nine flying buttresses. In the 1980s and '90s the older name Upper Fillmore fell out of favor, and Lower Pacific Heights came into wider use.",
    facts: [
      {
        icon: "park",
        title: "The square that spanned Geary",
        text:
          "An 1861 street guide lists Hamilton Square as spanning Geary, bounded by Post, Steiner, O'Farrell and Scott streets: a full square rather than today's rectangle. After the 1906 earthquake it held a refugee camp. Today Hamilton Recreation Center, with its indoor swimming pool, and the Raymond Kimbell Playground and athletic fields lie on either side of Geary Boulevard.",
        place: "Hamilton Recreation Center",
        where: "Geary Blvd & Steiner St",
        at: [-122.43480, 37.78440],
        source: "https://hoodline.com/2016/02/how-2-western-addition-parks-separated-by-a-century-came-to-be/",
      },
      {
        icon: "pin",
        title: "Named for Esther Hellman",
        text:
          "In November 1887, 43 members of San Francisco's Jewish community met at the home of Frederick and Charlotte Castle and formed the Mount Zion Hospital Association. After his wife Esther died in 1908, Isaias Hellman gave $100,000 for a new hospital in the Western Addition, and this building is named for her; UCSF marked its centennial in 2011. Mount Zion joined UCSF in 1990 and remains a hub for outpatient clinics, surgery and cancer care.",
        place: "Mount Zion Hellman Building",
        where: "2200 Post St",
        at: [-122.43830, 37.78470],
        source: "https://www.ucsf.edu/news/2011/06/103813/mount-zion-anniversary-event-june-18-celebrates-past-present-and-future",
      },
      {
        icon: "art",
        title: "An expressionist's hidden hospital",
        text:
          "Erich Mendelsohn, a leading figure of German Expressionist architecture, designed the Maimonides Health Center for the Chronic Sick here; the Pacific Coast Architecture Database dates the project 1946 to 1950. The New Fillmore counts it as one of his two San Francisco commissions, the other a house for Leon and Madeline Russell. Altered since and tucked among later hospital and clinic buildings, its tall, round-balconied form is easy to miss.",
        place: "Maimonides Health Center",
        where: "2356 Sutter St",
        at: [-122.43908, 37.78547],
        source: "https://newfillmore.com/2019/04/01/he-scraped-the-gingerbread-off/",
      },
      {
        icon: "movie",
        title: "The house from the opening credits",
        text:
          "Built in 1883 and attributed to architect Charles Lewis Hinkel, this red-doored Victorian is the house in the opening credits of TV's Full House. Series creator Jeff Franklin bought it for $4 million in 2016, after Fuller House launched on Netflix, then gutted and remodeled the interior; it sold again in 2020 for $5.35 million. It is a private home, so enjoy it from the sidewalk.",
        place: "Full House house",
        where: "1709 Broderick St",
        at: [-122.44207, 37.78634],
        source: "https://socketsite.com/archives/2020/02/another-cut-for-the-fully-remodeled-full-house-home.html",
      },
      {
        icon: "church",
        title: "Flying buttresses from 1992",
        text:
          "Dominican friars paid $6,000 in 1863 for this block, bounded by Steiner, Bush, Pierce and Pine, and Archbishop Joseph Alemany blessed their first church here in 1873. A brick successor by Thomas J. Welsh, begun in 1883, was destroyed in 1906, and twin architects Louis and Michael Beezer designed the present church, completed in 1928. The 1989 Loma Prieta earthquake destroyed the octagonal lantern atop its tower; a project finished in 1992 rebuilt the tower and braced the walls with nine flying buttresses.",
        place: "St. Dominic's Church",
        where: "Bush St & Steiner St",
        at: [-122.43519, 37.78706],
        source: "https://en.wikipedia.org/wiki/St._Dominic%27s_Catholic_Church_(San_Francisco)",
      },
      {
        icon: "mayor",
        title: "City Hall on a street corner",
        text:
          "Franklin Hall, on the southwest corner of Fillmore and Bush, served as relief headquarters and San Francisco's temporary City Hall after the 1906 earthquake. Mayor Eugene Schmitz and the Committee of Fifty met there on the last day of the fire to start the relief effort. With downtown burned out, City Hall and most of the big department stores moved a mile or so west to Fillmore, the closest thoroughfare left intact.",
        place: "Franklin Hall site",
        where: "Fillmore St & Bush St",
        at: [-122.43360, 37.78690],
        source: "https://fillmorestreetsf.com/history/after-the-great-earthquake/",
      },
      {
        icon: "star",
        title: "Fourteen arches of light",
        text:
          "The week after the 1906 earthquake, merchants and businessmen transplanted from the burned zone formed the Fillmore Street Improvement Association. In April 1907 it asked the supervisors to let it raise decorative metal arches, fitted with electric lights, across 14 intersections of Fillmore Street from Sacramento to Fulton, this one among them. In 1943, when the lights could not be dimmed for a wartime dim-out, the merchants took the arches down and gave the iron for scrap.",
        place: "Fillmore Street",
        where: "Fillmore St & Sutter St",
        at: [-122.43312, 37.78603],
        source: "https://www.sanfranciscostory.com/fillmore-arches/",
      },
      {
        icon: "shop",
        title: "A zoning seam at Bush Street",
        text:
          "Bush Street is a seam in the city's zoning: Upper Fillmore's shopping district runs north from it, while these three blocks down to Geary Boulevard begin the Fillmore Street district that continues south to McAllister. City code describes a dense mix of apartments over ground-floor businesses, in buildings from one-story shops to high-rise towers, and in 2015 the supervisors, calling Fillmore and Geary important transit corridors, made it a transit district and lifted its caps on housing density. At this intersection, a corner building that was once a bank branch and later a thrift store now holds a restaurant.",
        place: "Fillmore Street shops below Bush",
        where: "Fillmore St & Post St",
        at: [-122.43327, 37.78521],
        source: "https://www.sfbos.org/ftp/uploadedfiles/bdsupvrs/ordinances15/o0126-15.pdf",
      },
    ],
    walk: {
      intro:
        "A loop of about 1.3 miles for visitors and would-be neighbors that starts and ends at Fillmore St & Geary Blvd, served by the 22 Fillmore and 38 Geary buses: west past Hamilton Recreation Center and Mount Zion, out Sutter and up Broderick to the Full House house, then east along Bush to St. Dominic's and back down three blocks of Fillmore Street shops. Allow a little over an hour; the blocks are mostly gentle, and a weekday morning is calmest.",
      miles: 1.3,
      minutes: 65,
      tip:
        "Save your coffee or lunch for the last blocks of Fillmore Street. Over the Fourth of July weekend the free Fillmore Jazz Festival, billed as the West Coast's largest, fills Fillmore from Jackson to Eddy; in 2026 its Sutter Street stage was named for Miles Davis.",
    },
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
      "Buena Vista, Spanish for “good view,” is the hill at the eastern edge of the old Outside Lands, the ground beyond the city's 1851 charter limits, roughly west of Divisadero Street, where squatters' claims clouded titles for years. In 1867 the city reserved its hilltop as Hill Park, often called San Francisco's oldest official park, and paid squatters $88,250 to give up their claims to it. It was dedicated as Buena Vista Park in 1894.\n\nTransit and money then climbed the slopes. Cable cars began running out Haight Street to Stanyan in late 1883. In 1887 Adolph Sutro's statue, the Triumph of Light, was dedicated on Mount Olympus to the south; St. Joseph's Hospital was founded on the hill's east side in 1889; and in 1897 Richard Spreckels, of the sugar-refining family, built a house across from the park on Buena Vista Avenue West. After the 1906 earthquake, crowds spent five days on the summit watching the city burn. Around 1910 neighbors formed an improvement club, and the staircases, paths and tennis courts it won were dedicated in 1913.\n\nIn 1928 St. Joseph's opened a Spanish Renaissance Revival building that would later play the sanatorium in Hitchcock's Vertigo. In the mid-1930s WPA crews rebuilt the park's walls and gutters with broken headstones from the city's emptied Victorian cemeteries, and in the 1960s the Spreckels house's top floor held a recording studio where the Grateful Dead made early recordings. The hospital closed in 1979 and was converted into the Park Hill condominiums, and in 2026 the Board of Supervisors voted to make the Spreckels house a city landmark.",
    facts: [
      {
        icon: "shop",
        title: "Where Divisadero's shops begin",
        text:
          "Divisadero's shopping strip starts at this end: city zoning makes the street a neighborhood commercial district for 12 blocks, from Haight Street north to O'Farrell Street, and this corner sits in the middle of its first two blocks, between Haight and Oak. Grocers, restaurants, bars and other shops line them, and the walk heads a block south past them to Haight Street.",
        place: "Divisadero shops near Haight",
        where: "Divisadero St & Page St",
        at: [-122.43751, 37.77233],
        source: "https://en.wikipedia.org/wiki/Divisadero_Street",
      },
      {
        icon: "park",
        title: "Bought back from squatters",
        text:
          "The city reserved this hilltop in 1867 as Hill Park, often called San Francisco's oldest official park, and paid squatters $88,250 to give up their claims to it; it was dedicated as Buena Vista Park in 1894 and covers about 36 acres today. Around 1910 neighbors formed an improvement club, and the new staircases, paths and tennis courts it won were dedicated in 1913.",
        place: "Buena Vista Park",
        where: "Haight St & Buena Vista Ave E",
        at: [-122.44055, 37.77075],
        source: "https://www.foundsf.org/Buena_Vista_History",
      },
      {
        icon: "music",
        title: "A sugar mansion's rock studio",
        text:
          "Richard Spreckels, of the sugar-refining family, built this Colonial Revival house across from the park in 1897 to designs by Edward Vogel. In the 1960s its top floor held a recording studio, Buena Vista Studios, where the Grateful Dead made some early recordings, and actor Danny Glover bought the house in 1990. In 2026 the Board of Supervisors voted to make it a city landmark, the Richard Spreckels Mansion / Buena Vista Studios.",
        place: "Richard Spreckels Mansion",
        where: "737 Buena Vista Ave W",
        at: [-122.44375, 37.76884],
        source: "https://media.api.sf.gov/documents/o0178-26.pdf",
      },
      {
        icon: "art",
        title: "Sutro's vanished Triumph of Light",
        text:
          "This wooded knob on Upper Terrace was once considered the geographic center of San Francisco. Adolph Sutro crowned it with a statue, the Triumph of Light, a copy of a work by the Belgian artist Antoine Wiertz, dedicated on Thanksgiving Day 1887. The statue was taken down in the 1950s, and all that remains is its base inside a raised, wooded circle where Upper Terrace dead-ends.",
        place: "Mount Olympus",
        where: "End of Upper Ter",
        at: [-122.44553, 37.76299],
        source: "https://en.wikipedia.org/wiki/Mount_Olympus_(San_Francisco)",
      },
      {
        icon: "book",
        title: "Headstones in the walls",
        text:
          "Follow the trail east into the park from this corner and the walls turn oddly speckled. WPA crews built the park's walls and gutters in the 1930s from broken granite and marble headstones, left behind when the city's Victorian-era cemeteries were moved to Colma. Workers were told to lay the stones writing side down, but a few face up, and fragments of names and words such as “Died” can still be read.",
        place: "Tombstone walls",
        where: "Buena Vista Ave W & Upper Ter",
        at: [-122.44280, 37.76582],
        source: "https://www.sfchronicle.com/totalsf/article/buena-vista-park-sf-19787788.php",
      },
      {
        icon: "quake",
        title: "Five days watching the city burn",
        text:
          "The top of the park is a small lawn about 575 feet above sea level, by the city parks department's figures. After the earthquake of April 1906, crowds gathered up here for five days to watch the fires burn across San Francisco.",
        place: "Buena Vista Park summit",
        where: "Top of Buena Vista Park",
        at: [-122.44060, 37.76890],
        source: "https://www.foundsf.org/Buena_Vista_History",
      },
      {
        icon: "movie",
        title: "Vertigo's sanatorium",
        text:
          "St. Joseph's Hospital was founded on this site in 1889 through a charitable gift to the Catholic Church, with Franciscan Sisters running it, and in 1928 it opened this Spanish Renaissance Revival building by the architects Bakewell & Brown. Alfred Hitchcock used its exterior as the sanatorium in Vertigo. The hospital closed in 1979, the building joined the National Register of Historic Places in 1985, and it was later converted into the Park Hill condominiums.",
        place: "Former St. Joseph's Hospital",
        where: "355 Buena Vista Ave E",
        at: [-122.44006, 37.76746],
        source: "https://en.wikipedia.org/wiki/St._Joseph%27s_Hospital_(San_Francisco)",
      },
    ],
    walk: {
      intro:
        "A one-way walk of about 1.8 miles and 95 minutes with stops, for visitors and would-be neighbors: start on Divisadero Street at Page Street, between the 24 bus stops at Oak and Haight, walk a block south past the shops and two blocks west on Haight Street to the park at Buena Vista Avenue East, follow Buena Vista Avenue West around the park past the Spreckels mansion and up Upper Terrace to Mount Olympus, then cut back through the park over the summit and down to Park Hill, beside a 37 Corbett stop. Go on a clear day, when the views from both hilltops are widest.",
      miles: 1.8,
      minutes: 95,
      tip:
        "The park's trails and stairs are steep and uneven, so wear shoes with grip; to get back to Haight Street, it is about a 10-minute walk from Park Hill along Buena Vista Avenue East. For more shops, cafés and restaurants, the Haight Street commercial district starts across Central Avenue from the park's northwest corner and runs west to Stanyan Street.",
    },
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
      "Dolores Heights rises a few blocks south of Mission Dolores, but its first neighborhood grew on the gentler ground at the hill's eastern foot. Liberty Hill, named not for a summit but for two of its streets, Liberty and Hill, was one of San Francisco's earliest residential “suburbs.” Coal dealer Marsden Kershaw built his house at Guerrero and Liberty in 1871, and in 1895 dairy farmer John Daly, who would later subdivide his ranch to begin what is now Daly City, finished a Queen Anne mansion at the crest of Guerrero at 21st.\n\nThe fire that followed the 1906 earthquake was stopped at 20th Street, so Liberty Hill still holds examples of every style of its building years. Public Works photographs show the steep hill to the west still rough, with 1906 earthquake shacks above a cliff on Cumberland Street in 1914 and Sanchez Street unpaved at 21st. The climb over it was the hardest grade on the J-Church line: at least fifteen routes were proposed, one a tunnel under Chattanooga Street, before the line opened in 1917 on its own right-of-way along Dolores Park. In 1930, by the SF Examiner's account, Mayor James Rolph, who lived on Sanchez Street, built a guesthouse next door.\n\nIn 1983, 51 houses on two blocks of Liberty Street joined the National Register, and in 1985 the city made Liberty Hill a landmark district. Today the Dolores Heights Special Use District holds new buildings to 35 feet above existing grade and requires deep rear yards, to protect views and light, and in 2003 the Dolores Heights Improvement Club and property owners along the Liberty Street stairs restored the stairway's garden.",
    facts: [
      {
        icon: "house",
        title: "A capsule of Victorian San Francisco",
        text:
          "Along two blocks of Liberty Street, Nos. 15 to 188, 51 houses make up the Liberty Street Historic District, listed on the National Register on September 15, 1983; its nomination calls the enclave a capsule history of middle-class housing in San Francisco between 1867 and 1911. The houses run from early and standard San Francisco Italianates through Stick and Queen Anne to Classical Revival, and the district also sits inside the city's Liberty Hill Historic District.",
        place: "Liberty Street Historic District",
        where: "Liberty St & Valencia St",
        at: [-122.42140, 37.75745],
        source: "https://npgallery.nps.gov/NRHP/GetAsset/NRHP/83001230_text",
      },
      {
        icon: "house",
        title: "Two landmarks at Liberty's corner",
        text:
          "Marsden Kershaw, a partner in the Kershaw and Twing coal yard, built the house on this corner in 1871, one of the earliest in what is now the Liberty Hill Historic District, and it is city Landmark No. 136. Just to the north, the John McMullen House at 827 Guerrero Street is city Landmark No. 123.",
        place: "Kershaw and McMullen houses",
        where: "845 Guerrero St",
        at: [-122.42297, 37.75762],
        source: "https://noehill.com/SF/LANDMARKS/sf136.asp",
      },
      {
        icon: "cow",
        title: "The dairyman behind Daly City",
        text:
          "Charles Havens designed this Queen Anne mansion, completed in 1895 at the crest of Guerrero Street at 21st, for John Daly, a dairy farmer who owned 250 acres just outside the county line. After the 1906 earthquake Daly subdivided his ranch, beginning what is now Daly City, and his house stands in the city's Liberty Hill landmark district.",
        place: "John Daly House",
        where: "900 Guerrero St",
        at: [-122.42338, 37.75662],
        source: "https://www.sfchronicle.com/bayarea/article/A-Mission-District-mansion-born-in-an-earlier-boom-5553087.php",
      },
      {
        icon: "tram",
        title: "The streetcar's back-door route",
        text:
          "The J-Church opened on August 11, 1917, paid for by a 1913 bond issue, and its climb over Dolores Heights was the line's most difficult grade; at least fifteen routes were proposed, including engineer Bion J. Arnold's 1912 plan for a tunnel under the line of Chattanooga Street. As built, the tracks cut through the western edge of Dolores Park between 18th and 20th streets on a private right-of-way at a 9% grade, the steepest on the Muni Metro, and stay off the street past this crossing until they rejoin Church Street at 22nd.",
        place: "J-Church right-of-way",
        where: "Right of Way & 21st St",
        at: [-122.42687, 37.75654],
        source: "https://en.wikipedia.org/wiki/J_Church",
      },
      {
        icon: "mayor",
        title: "Sunny Jim's house in the sky",
        text:
          "James “Sunny Jim” Rolph, mayor of San Francisco from 1912 until he resigned in 1931 to become governor, lived next door at 775 Sanchez Street, and the SF Examiner says he built this guesthouse, Casa Cielo, in 1930. When Rolph died in 1934, an eye surgeon bought the house and kept it for 10 years.",
        place: "Casa Cielo",
        where: "3690 21st St",
        at: [-122.43005, 37.75662],
        source: "https://www.sfexaminer.com/news/hot-property-a-residence-fit-for-a-mayor/article_7ea1f7d6-0879-5460-ba07-00b86a91454c.html",
      },
      {
        icon: "stairs",
        title: "A stairway garden on Liberty",
        text:
          "On the block of Liberty Street between Sanchez and Noe, a public stairway climbs through a planted garden. In 2003 the Dolores Heights Improvement Club and the property owners along the stairs restored it, supplying the labor and other funding, with a $2,400 grant from San Francisco Beautiful for new soil and a drip irrigation system.",
        place: "Liberty Street stairway",
        where: "Liberty St & Sanchez St",
        at: [-122.43133, 37.75711],
        source: "https://sfbeautiful.org/?p=95",
      },
      {
        icon: "road",
        title: "Tied for the city's steepest",
        text:
          "The city's Bureau of Engineering once ranked this block of 22nd Street, between Church and Vicksburg, as San Francisco's steepest, tied with Filbert Street between Leavenworth and Hyde at a 31.5% grade; cars may only drive it one way, downhill. A newer ranking that 7x7 built with Stephen Von Worley from federal elevation data and street maps puts it ninth, with Bradford Street above Tompkins first at 41%.",
        place: "22nd Street steep block",
        where: "22nd St & Vicksburg St",
        at: [-122.42856, 37.75486],
        source: "https://www.7x7.com/the-real-top-10-list-of-steepest-streets-in-san-francisco-1786501295.html",
      },
      {
        icon: "shop",
        title: "Where 24th Street's shops begin",
        text:
          "Noe Valley's shopping street starts a short block east of this corner: the city's 24th Street–Noe Valley Neighborhood Commercial District covers six blocks of 24th Street, from Chattanooga Street west to Diamond. The planning code describes a daytime-oriented district selling everyday and comparison goods and services to a mostly local market, with shops and personal services at street level, some offices on the second story and homes almost entirely on the third floor and up.",
        place: "24th and Church shops",
        where: "24th St & Church St",
        at: [-122.42734, 37.75169],
        source: "https://www.sfbos.org/ftp/uploadedfiles/bdsupvrs/ordinances10/o0101-10.pdf",
      },
    ],
    walk: {
      intro:
        "A one-way walk of about 1.4 miles for visitors and would-be neighbors, from the Victorian blocks of Liberty Hill up over Dolores Heights and down to 24th and Church streets, where the J-Church and the 48 bus stop for the ride back. Start at Liberty and Valencia streets, a five-minute walk from the 14 and 49 buses at Mission and 20th streets; allow about 75 minutes, and pick a clear day for the views from the hilltop.",
      miles: 1.4,
      minutes: 75,
      tip:
        "Wear shoes with grip: the walk climbs 21st Street from Church toward Sanchez, then, after the Liberty Street stairs, comes down the 31.5% block of 22nd Street below Vicksburg, so take that one slowly, and watch the J-Church from the 21st Street crossing, since walking on the tracks is illegal. For coffee, Valencia Street's cafés are steps from the start, and 24th Street's are at the finish.",
    },
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
      "Adolph Sutro owned the hill above Parnassus Avenue, then called Mount Parnassus, and first planned to build homes on it. Around 1886, the year of California's first Arbor Day, he began planting it with trees, and in July 1895, as mayor, he gave the University of California 13 acres overlooking Golden Gate Park for its Affiliated Colleges, then scattered around the city. The first cornerstone went in among the sand dunes in 1897, and the buildings opened in the fall of 1898. One was meant for Hastings College of the Law, whose faculty refused to move so far from the courts.\n\nSutro died in 1898, and settling his estate took nearly 20 years of litigation. In 1909 the estate struck a deal with the Consolidated Eucalyptus Company to log and process its trees, and in 1910 an appraiser photographed its “Sunset Heights” lots on Edgewood Avenue. The 1906 earthquake, meanwhile, turned the colleges into a hospital: a 75-bed teaching hospital opened in April 1907, and Lewis P. Hobart's UC Hall followed in 1917, standing until 2023. Logging ended in 1934, after a 10-acre fire turned neighbors against the lumber mill.\n\nAs the medical center grew up the hill, neighbors sued, and in 1976 the Regents settled with a cap of 3.55 million gross square feet of buildings on the campus, a limit called permanent. That year UCSF's part of the forest became permanent open space, today the 61-acre Mount Sutro Open Space Reserve. In 1996 UCSF said future growth would go to Mission Bay, but in 2021 the Regents approved a plan adding roughly two million square feet at Parnassus, including a 15-story hospital due in 2030.",
    facts: [
      {
        icon: "house",
        title: "Photographed for Sutro's estate",
        text:
          "Edgewood Avenue climbs south from here toward the forest. On January 1, 1910, while Sutro's estate was still being settled, A. S. Baldwin photographed it for an appraisal of the Sutro Estate: his view, labeled Sunset Heights No. 47 and now in the OpenSFHistory archive, looks south along the street's east side at the estate's lots in Block H, around today's No. 257. A 1926 photo in the same archive looks south up the 200 block toward Sutro Forest.",
        place: "Edgewood Avenue",
        where: "Edgewood Ave & Farnsworth Ln",
        at: [-122.45520, 37.76300],
        source: "https://test.opensfhistory.org/photo/wnp26.1072",
      },
      {
        icon: "bird",
        title: "A forest logged until 1934",
        text:
          "UCSF says Sutro began planting this hill around the 1886 Arbor Day celebration, and that after his death his estate's 1909 deal with the Consolidated Eucalyptus Company covered logging and processing on more than 1,500 acres. The logging ended in 1934, after a 10-acre fire turned neighbors against the lumber mill. From the end of Edgewood Avenue, the Edgewood Trail climbs into the forest.",
        place: "Edgewood Trailhead",
        where: "End of Edgewood Ave",
        at: [-122.45510, 37.76080],
        source: "https://ucsf.edu/about/locations/mount-sutro-open-space-reserve",
      },
      {
        icon: "park",
        title: "A Nike radar post turned meadow",
        text:
          "In the 1950s the top of Mount Sutro was cleared and flattened to hold radar equipment that controlled the launch of Nike missiles around the Bay Area; the Sutro Stewards identify the post as SF-89C, the radar control site, with a separate launch site in the Presidio. In 2004 the Rotary Club of San Francisco gave UCSF $100,000 to turn the old radar site into a native-plant meadow, now the Sutro Stewards' native plant garden at the 909-foot summit of the 61-acre Mount Sutro Open Space Reserve.",
        place: "Rotary Meadow",
        where: "Summit of Mount Sutro",
        at: [-122.45719, 37.75826],
        source: "https://www.sutrostewards.org/post/2016/09/22/sutro-stewards-10th-anniversary-reflections-from-our-beginning",
      },
      {
        icon: "tower",
        title: "A 15-story hospital takes shape",
        text:
          "UCSF began building the 15-story Helen Diller Hospital here in 2024, designed by Herzog & de Meuron with HDR as architect of record, and expects to open it in 2030. It rises on the site of the Langley Porter Psychiatric Hospital at 401 Parnassus, named for medical-school dean Langley Porter. Built on university land for the state's Department of Mental Hygiene, it had its cornerstone laid in 1941, began operating in 1943, passed to the university's administration in 1973 and was demolished to make way for the new hospital.",
        place: "Helen Diller Hospital",
        where: "Parnassus Ave & Hillway Ave",
        at: [-122.45685, 37.76376],
        source: "https://www.ucsf.edu/news/2024/05/427536/ucsf-health-starts-construction-massive-parnassus-campus-hospital",
      },
      {
        icon: "book",
        title: "Founded in rain and blowing sand",
        text:
          "Mayor Adolph Sutro gave the University of California these 13 acres overlooking Golden Gate Park in 1895, and the cornerstone of the Affiliated Colleges' first medical building was laid on March 27, 1897, in “rain and blowing sand.” After the 1906 earthquake the medical faculty moved its preclinical departments to Berkeley to make room for a teaching hospital, which opened in the refitted medical building with 75 beds in April 1907. That old medical building stood until 1967.",
        place: "UCSF Parnassus campus",
        where: "513 Parnassus Ave",
        at: [-122.45821, 37.76330],
        source: "https://ucsf.edu/news/2024/09/428516/how-ucsfs-historic-parnassus-heights-campus-rose-remote-sand-dunes",
      },
    ],
    walk: {
      intro:
        "A near-loop of about 1.4 miles for visitors and would-be neighbors, from the 6 and 43 bus stop at Parnassus Ave & Willard St (the N Judah stops nearby at Carl & Stanyan) up Edgewood Avenue into the eucalyptus forest, over the summit of Mount Sutro and back down to the UCSF campus on Parnassus Avenue, where the 6 and 43 stop again a few blocks west of the start. Allow about 75 minutes, and go in daylight, on a clear day if you can.",
      miles: 1.4,
      minutes: 75,
      tip:
        "The reserve is open from sunrise to sunset and closes when winds top 40 mph, and UCSF posts trail closures on its Mount Sutro page, so check it before you go and wear shoes with good grip for the forest trails. There are no shops on the hill itself; for coffee or a bite, Cole Street's cafés are three blocks east of the start, and Irving Street's restaurants in the Inner Sunset are about half a mile northwest of the campus.",
    },
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
      "Before the street grid, these blocks lay in the Sans Souci Valley, which carried storm runoff from Buena Vista Hill and Lone Mountain through today's Panhandle toward Duboce Park, and was once the easiest walking route between Mission Dolores and the Presidio. Which Haight the main street honors has never been settled; the banker Henry Haight, his nephew Governor Henry H. Haight and a banker's wife, Weltha Haight, all have champions. Transit built the neighborhood. In 1883 the Market Street Cable Railway replaced a horse-car line on Haight Street, linking downtown with the east end of Golden Gate Park; land prices rose, and by one local history nearly every lot here was built on by the end of the decade.\n\nThe area largely came through the 1906 earthquake and fire, which is why so many of its Victorians remain. After the Redevelopment Agency declared the Western Addition blighted in 1948, the first phase of urban renewal in the Fillmore to the north cut its population almost in half and shut more than 850 businesses, most of them Black-owned. These blocks, called Haight-Fillmore by the late 1960s, were the southern tip of the Fillmore district, and in the late 1970s still an almost entirely Black community, one account notes.\n\nThe name Lower Haight turns up in a 1921 grocers' trade journal but went mainstream only in the mid-to-late 1980s. In the 1990s the strip was a hub of the city's DJ, hip-hop and rave culture; one record shop, opened around 1990, did most of its early business with local rappers hunting for records to sample, and got a mention in the Beastie Boys' 1992 song “Professor Booty.”",
    facts: [
      {
        icon: "house",
        title: "The landmark that moved a house",
        text:
          "Henry Geilfuss, a Thuringia-born architect who came to San Francisco in 1876 and designed some 400 homes in the area, Alamo Square's Westerfeld House among them, drew this Stick-style house for Charles Dietle; the city made it Landmark No. 48 in 1972. By the Western Neighborhoods Project's account it went up in 1888, and the 1878 house it replaced was moved to 527–529 Oak Street rather than torn down. After the 1906 earthquake and fire, the story goes, Dietle sold this house to commission merchant John DeMartini for a bag of gold DeMartini had salvaged from his ruined business.",
        place: "Charles Dietle House",
        where: "294 Page St",
        at: [-122.42556, 37.77389],
        source: "https://en.wikipedia.org/wiki/Charles_Dietle_House",
      },
      {
        icon: "church",
        title: "A Julia Morgan club turned Zen temple",
        text:
          "Julia Morgan designed this building, completed in 1922 as the Emanu-El Residence Club, where the Emanu-El Sisterhood offered room and board to as many as 70 single Jewish women, working or studying, at a time. The club closed in 1969, and that year Shunryu Suzuki, who had arrived in 1959 to lead the Sokoji temple on Bush Street, founded the San Francisco Zen Center's City Center here. Also called Beginner's Mind Temple, or Hosshin-ji, it is one of the Zen Center's three practice communities, with Green Gulch Farm and Tassajara.",
        place: "San Francisco Zen Center",
        where: "300 Page St",
        at: [-122.42600, 37.77374],
        source: "https://sfzc.org/about-city-center",
      },
      {
        icon: "park",
        title: "A park from a burned lot",
        text:
          "An apartment building on this site burned down in 1973, and members of the Koshland family bought the land and gave it to the city as a park in tribute to their father, Daniel E. Koshland Sr.; the city counts it among the Trust for Public Land's first projects, established in 1976. The family gave $400,000 more for a renovation the city accepted in 1997, and in October 2025 the Recreation and Park Commission approved a redesign of the park's community garden, backed by the Trust for Public Land.",
        place: "Koshland Park",
        where: "Page St & Buchanan St",
        at: [-122.42742, 37.77358],
        source: "https://sfrecpark.org/1848/Koshland-Park-Community-Garden-Renovatio",
      },
      {
        icon: "shopping",
        title: "Four blocks of storefronts",
        text:
          "Commercially zoned lots line Haight Street for about four blocks, from Webster to Scott, and a 2016 city planning workshop treated the blocks either side of Fillmore as the strip's commercial core. Restaurants, cafés, bars, small nightclubs, galleries and hair salons fill the storefronts. The street built up after the cable line opened on Haight in 1883, and in the 1990s its record shops made these blocks a center of the city's DJ, hip-hop and rave culture.",
        place: "Lower Haight shops",
        where: "Haight St & Fillmore St",
        at: [-122.43052, 37.77210],
        source: "https://commissions.sfplanning.org/cpcpackets/2014-001722CUA.pdf",
      },
      {
        icon: "road",
        title: "A bike route down an old valley",
        text:
          "Here the Wiggle, the zig-zag bike route from Market Street toward Golden Gate Park, turns off Pierce onto Haight on its way to Scott and Fell streets. Over about a mile it rises some 120 feet at grades averaging about 3% and never over 6%, roughly following the paved-over watercourse of the Sans Souci Valley. Natural historian Joel Pomerantz gave the route its name in a 1994 article.",
        place: "The Wiggle",
        where: "Haight St & Pierce St",
        at: [-122.43379, 37.77168],
        source: "https://en.wikipedia.org/wiki/The_Wiggle",
      },
    ],
    walk: {
      intro:
        "A one-way walk of about 0.6 miles for visitors and would-be neighbors, starting at the 7 bus stop at Haight and Laguna: a block north to a landmark Victorian and a Julia Morgan-designed Zen temple on Page Street, west to Koshland Park, then down Webster to the Haight Street shops and on to the Wiggle at Pierce Street. Allow about 30 minutes; go by day, when the shops are open, and on a weekend afternoon for the busiest Haight Street.",
      miles: 0.6,
      minutes: 30,
      tip:
        "The blocks of Haight either side of Fillmore are the walk's coffee stop. At the end, you can follow the Wiggle a block west on Haight and north up Scott Street to Fell, or catch the 7 at Haight and Pierce back toward Market Street.",
    },
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
      "Monterey Heights climbs the south slope of Mount Davidson on land that once belonged to Adolph Sutro, who had willed his original 1,400 acres as an educational trust so his forest would be preserved for public recreation. Some of his heirs persuaded the California Supreme Court to invalidate the will. In 1911 the heirs' appraiser, A.S. Baldwin, bought the mountain's western slope and much of the land to its north and south, about 700 acres for $1.4 million, according to historian Jacquie Proctor, and began planning residence parks there: St. Francis Wood, Westwood Park, Westwood Highlands, Forest Hill, Sherwood Forest and Monterey Heights.\n\nMonterey Heights is a small pocket of single-family streets between Yerba Buena Avenue on the east and San Jacinto Way on the west, with interior drives named for woods, such as Maywood, Fernwood and Rosewood. Its first houses, two-story custom homes of the 1920s, were comparable in size and quality to those in neighboring St. Francis Wood, and architect Harold G. Stoner designed many of them, including a Tudor on Maywood in 1929. In 1927 the parish of St. Emydius built a Spanish-style bungalow on Brentwood, furnished it and raffled it off to help pay for its new church. Building stopped during the Depression; from 1938 through 1942, split-level houses with garages went up.\n\nThe boulevard along the southern edge carries a name won in a fight. It began as Sunnyside Avenue, and as St. Francis Wood, Westwood Park and Westwood Highlands were developed around 1920, their developers and early residents petitioned City Hall to rename it Monterey Boulevard. Sunnyside residents led by Ernest Van Beck fought to keep the old name, and lost.",
    facts: [
      {
        icon: "pin",
        title: "Sutro's land, Baldwin's plan",
        text:
          "Monterey Heights rose on land that had belonged to Adolph Sutro: in 1911 A.S. Baldwin, the appraiser for Sutro's heirs, bought Mount Davidson's western slope along with much of the land to its north and south, and began planning Monterey Heights there alongside St. Francis Wood, Westwood Park, Westwood Highlands, Forest Hill and Sherwood Forest. San Jacinto Way, which climbs north from this corner, marks the neighborhood's western edge.",
        place: "San Jacinto Way",
        where: "Monterey Blvd & San Jacinto Way",
        at: [-122.46396, 37.73203],
        source: "https://en.wikipedia.org/wiki/Mount_Davidson_(California)",
      },
      {
        icon: "house",
        title: "Harold Stoner's 1929 Tudor",
        text:
          "Architect Harold G. Stoner designed many of Monterey Heights' houses, among them this 1929 Tudor at 225 Maywood; it is a private home, so admire it from the sidewalk. Born in Brighton, England, in 1890, Stoner left for Regina, Canada, before making his name in San Francisco, where his work included the “Tropic Beach” facade of the Sutro Baths and the building for Sally Rand's Nude Ranch at the 1939 Golden Gate International Exposition.",
        place: "Maywood Drive Tudor",
        where: "225 Maywood Dr",
        at: [-122.46210, 37.73260],
        source: "https://mtdavidson.org/monterey-heights/",
      },
      {
        icon: "road",
        title: "Streets named for the woods",
        text:
          "Yerba Buena Avenue forms Monterey Heights' eastern edge, and the interior streets are named for woods, among them Maywood, Fernwood and Rosewood. The first houses, two-story custom homes of the 1920s, were comparable in size and quality to those in neighboring St. Francis Wood; building stalled during the Depression and resumed in 1938 with split-level houses with garages, which went up through 1942.",
        place: "Yerba Buena Avenue",
        where: "Yerba Buena Ave & Miraloma Dr",
        at: [-122.46080, 37.73551],
        source: "https://mtdavidson.org/monterey-heights/",
      },
      {
        icon: "park",
        title: "Blue Mountain's Easter cross",
        text:
          "Monterey Heights sits on the south slope of Mount Davidson, which was called Blue Mountain when Adolph Sutro bought it and was later named for George Davidson, a charter member of the Sierra Club. More than 5,000 people braved rain to hike up before dawn for an Easter sunrise service at a 40-foot cross on the summit in 1923; that cross burned in December 1925, and the present 103-foot concrete cross was dedicated in 1934, when President Franklin D. Roosevelt lit it by telegraph from the White House.",
        place: "Mount Davidson's south slope",
        where: "Yerba Buena Ave & Hazelwood Ave",
        at: [-122.45968, 37.73448],
        source: "https://en.wikipedia.org/wiki/Mount_Davidson_(California)",
      },
      {
        icon: "church",
        title: "A house raffled for a church",
        text:
          "In 1927 the parish of St. Emydius, which needed about $130,000 to build its present church, built a Spanish-style bungalow called Casa Emydio on a lot at 245 Brentwood, the street that meets Yerba Buena here, furnished it inside and raffled it off. Mayor James Rolph attended its dedication on September 18, and the drawing was held at a ball in the Civic Auditorium on December 15, 1927. The church, completed in 1928 on Ashton Avenue, is named for the patron saint of protection against earthquakes.",
        place: "Brentwood Avenue",
        where: "Yerba Buena Ave & Brentwood Ave",
        at: [-122.45908, 37.73365],
        source: "https://mtdavidson.org/monterey-heights/",
      },
      {
        icon: "road",
        title: "The boulevard that was Sunnyside",
        text:
          "Monterey Boulevard, the neighborhood's southern edge, began as Sunnyside Avenue. As St. Francis Wood, Westwood Park and Westwood Highlands were developed around 1920, their developers and early residents petitioned City Hall to rename the street running through their tracts, according to Sunnyside historian Thomas Malim. Sunnyside residents led by Ernest Van Beck, owner of the Sunnyside Conservatory, fought to keep the old name, and lost.",
        place: "Monterey Boulevard",
        where: "Monterey Blvd & Yerba Buena Ave",
        at: [-122.45882, 37.73098],
        source: "https://mtdavidson.org/monterey-boulevard/",
      },
    ],
    walk: {
      intro:
        "A one-way walk of a little under a mile for visitors and would-be neighbors: start at the 23 Monterey bus stop at Monterey Boulevard and San Jacinto Way, climb through the interior streets past Harold Stoner's Tudor on Maywood Drive to Yerba Buena Avenue, then follow Yerba Buena, where the 43 bus runs, back down to Monterey Boulevard. Allow about 40 minutes, and go in daylight, when the 1920s houses are easiest to see.",
      miles: 0.9,
      minutes: 40,
      tip:
        "Monterey Heights has no shops of its own, so for cafés and restaurants head to West Portal Avenue, less than a mile to the north; the 23 bus runs along Monterey Boulevard at both ends of the walk.",
    },
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
      "The blocks around the Panhandle began as sand hills just west of Divisadero Street, which was laid out in the 1850s as the western edge of the Western Addition. In 1866 Congress handed San Francisco the dunes from Divisadero to the ocean, and by 1868 surveyors had mapped them into a grid of rectangular blocks; two years later streets were laid out, lots graded and land grants offered to investors and settlers. An eight-block strip between Fell and Oak streets became the eastern arm of the new Golden Gate Park, and in 1871 William Hammond Hall, the park's first superintendent, began planting it. A road called the Avenue wound down its middle.\n\nQueen Anne houses went up around it in the 1890s, among them a towered house at Baker and Hayes streets in 1891 and the Clunie House on Lyon Street in 1897, and in 1893 a firehouse with a tall hose tower rose on Oak Street. In 1903 President Theodore Roosevelt broke ground for a monument to William McKinley at the strip's eastern tip. After the 1906 earthquake, refugees camped on the Panhandle in tents and makeshift shelters.\n\nIn the 1950s and '60s the state planned an eight-lane freeway down the center of the Panhandle. Neighbors fought it for years, and on March 21, 1966, the Board of Supervisors voted 6–5 to reject it. That October the strip became a stage for the Haight-Ashbury counterculture: the Love Pageant Rally gathered on its lawns, and the Diggers began serving free food there. References to the blocks “North of the Panhandle” go back to the early 1900s, and the shorthand NoPa spread in the 2000s.",
    facts: [
      {
        icon: "shop",
        title: "The street once spelled Devisadero",
        text:
          "Divisadero was laid out in the 1850s as the western edge of the Western Addition and was spelled Devisadero until 1909; from the 1870s on, the traffic its cable cars brought made it a busy commercial street. City zoning describes the Divisadero corridor, which runs from Haight Street to O'Farrell Street, as two- to four-story buildings with housing over a largely continuous row of storefronts serving nearby neighborhoods with everyday goods and services. This corner is the middle of the four blocks from Oak Street to Fulton Street, where restaurants, bars and shops fill the ground floors.",
        place: "Divisadero Street shops and restaurants",
        where: "Divisadero St & Hayes St",
        at: [-122.43786, 37.77497],
        source: "https://en.wikipedia.org/wiki/Divisadero_Street",
      },
      {
        icon: "tower",
        title: "A landmark firehouse from 1893",
        text:
          "Built in 1893 to a design by Henrikson & Mahoney, this Stick-Eastlake firehouse with its tall hose tower first housed Engine Company 21 and Truck Company 6; motorized apparatus arrived in 1915, and Engine 21 stayed until 1958, when it moved to Grove Street. After the 1906 earthquake, with the alarm system down, its crew went out to fight the Hayes Valley fires and stayed on duty for 54 hours. It is city Landmark No. 89, and in 2016 Hoodline called it the oldest firehouse still owned by the San Francisco Fire Department.",
        place: "Fire Station No. 21",
        where: "1152 Oak St",
        at: [-122.43830, 37.77318],
        source: "https://www.hoodline.com/2016/04/inside-old-station-21-landmark-firehouse/",
      },
      {
        icon: "star",
        title: "A president in a medallion",
        text:
          "An inscription on this memorial records that President Theodore Roosevelt broke ground for it on May 13, 1903, and more than 5,000 people came to its unveiling on November 24, 1904, though the sculptor, Robert Ingersoll Aitken, was not there. Aitken gave McKinley himself only a small bronze relief medallion on the granite pedestal and crowned the monument with a towering female figure representing the Republic.",
        place: "McKinley Monument",
        where: "Baker St & Oak St",
        at: [-122.44111, 37.77306],
        source: "https://en.wikipedia.org/wiki/William_McKinley_Memorial",
      },
      {
        icon: "house",
        title: "A congressman's corner house",
        text:
          "Architect William Curlett designed this Queen Anne house, finished in 1897 on a corner facing the Panhandle, for Thomas Jefferson Clunie, a lawyer, politician and real estate speculator who served as a state senator and a U.S. congressman. It has since been a private home, a nursing home, a bed and breakfast and student housing, and in the late 1960s it housed a hippie community; the city made it Landmark No. 128 in 1981.",
        place: "Clunie House",
        where: "301 Lyon St",
        at: [-122.44275, 37.77368],
        source: "https://www.sfexaminer.com/news/the-city/landmark-clunie-house-has-lived-at-forefront-of-sf-history/article_c62e3339-8606-45d2-9082-7050ead9c46e.html",
      },
      {
        icon: "park",
        title: "Where the park's planting began",
        text:
          "William Hammond Hall, Golden Gate Park's first superintendent, began planting this strip in 1871, and the trio of species he relied on, Monterey cypress, Monterey pine and blue gum eucalyptus, are still stalwarts throughout the park. A road known as the Avenue once wound down the middle of the Panhandle, carrying horses and carriages and, after 1913, cars, until it was removed in 1955 and its asphalt replaced with grass.",
        place: "Panhandle tree groves",
        where: "Fell St & Central Ave",
        at: [-122.44410, 37.77280],
        source: "https://goldengatepark.substack.com/p/the-panhandle-tree-museum",
      },
      {
        icon: "music",
        title: "A rally the day LSD was outlawed",
        text:
          "On October 6, 1966, the day LSD became illegal in California, the Love Pageant Rally gathered in the Panhandle; its organizers, Allen Cohen and artist Michael Bowen, creators of the San Francisco Oracle, billed it as a celebration rather than a protest. That same month a flyer on Haight Street offered free stew and fruit at 4 p.m. in the Panhandle near Ashbury Street, the start of the Diggers' free meals, which fed up to 200 people a day until they petered out after October 1967.",
        place: "Panhandle lawns at Ashbury Street",
        where: "Fell St & Ashbury St",
        at: [-122.44770, 37.77240],
        source: "https://en.wikipedia.org/wiki/Love_Pageant_Rally",
      },
      {
        icon: "road",
        title: "The vote that saved the Panhandle",
        text:
          "In the 1950s and '60s the state planned an eight-lane freeway down the center of the Panhandle, extending the Central Freeway along Oak and Fell streets and tunneling under the north edge of Golden Gate Park toward Park Presidio Boulevard and the Golden Gate Bridge. Sue Bierman formed a council in her Haight-Ashbury neighborhood in 1964 to fight it, and on March 21, 1966, the Board of Supervisors voted 6–5 to reject both the Panhandle and Golden Gate freeways. The Panhandle's Susan J. Bierman Grove honors her, later a city supervisor; its plaque, dedicated on September 5, 2001, salutes her for uniting neighborhoods in an eight-year struggle.",
        place: "Panhandle at Stanyan Street",
        where: "Oak St & Stanyan St",
        at: [-122.45350, 37.77160],
        source: "https://en.wikipedia.org/wiki/Sue_Bierman",
      },
    ],
    walk: {
      intro:
        "A one-way walk of about 1.1 miles for visitors and would-be neighbors: start at Divisadero & Hayes (6 and 24 buses), walk south past the shops of Divisadero Street to the 1893 firehouse on Oak Street, then follow the Panhandle from the McKinley Monument at Baker Street, past the 1897 Clunie House, west to Stanyan Street, where Golden Gate Park begins. Allow about 55 minutes; a clear afternoon is best, when sun filters through the old trees.",
      miles: 1.1,
      minutes: 55,
      tip:
        "Pick up something to eat on Divisadero before you start and picnic on the Panhandle's lawns along the way. At the end, Golden Gate Park continues across Stanyan Street; for the ride back, the 33 Stanyan stops at Stanyan & Oak, and the 5 Fulton stops four blocks north at Fulton & Stanyan.",
    },
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
      "West Portal was part of Rancho San Miguel, José de Jesús Noé's Mexican land grant, and later belonged to Adolph Sutro. After Sutro's heirs broke the trust on the land, tracts went to Mason-McDuffie, Newell-Murdoch and Fernando Nelson, who created St. Francis Wood, Forest Hill and West Portal. Before the tunnel the slope was largely barren, with no West Portal Avenue yet. On July 14, 1917, crowds watched Mayor James Rolph and City Engineer M.M. O'Shaughnessy drive a ceremonial spike at the future corner of West Portal Avenue and Ulloa Street to mark the Twin Peaks Tunnel's finished bore, and on February 3, 1918, the K Ingleside streetcar began running out of its western portal, which gave the neighborhood its name.\n\nNelson became its primary builder, and more streetcar lines followed: the L Taraval along Ulloa Street in 1919 and the M Ocean View in 1925. A business district grew up on the new avenue, which a Western Neighborhoods Project history says served as the commercial strip for the residence parks around it, keeping shops apart from homes in a way that became commonplace in Bay Area suburbs only after World War II. The Moorish-style Portal Theatre, credited to architect Irving Morrow, who later shaped the Golden Gate Bridge's towers and lighting, opened there on December 26, 1925.\n\nThe branch library opened in 1936 and three years later reopened in its WPA-built home beside the portal. For Muni Metro's light rail, the portal's curbside stop was rebuilt into today's station, which opened on April 2, 1979. The theater, renamed the Empire in 1936 and split into three screens in 1974, closed for good in January 2021, during the pandemic.",
    facts: [
      {
        icon: "tram",
        title: "A spike at an empty corner",
        text:
          "On July 14, 1917, crowds gathered at what would become this corner to watch Mayor James Rolph and City Engineer M.M. O'Shaughnessy drive a ceremonial spike marking the completion of the Twin Peaks Tunnel's bore; captions in the Western Neighborhoods Project's photo archive say Rolph drove a silver spike after walking through the tunnel. On February 3, 1918, Muni's K Ingleside streetcar began running through the tunnel's Beaux-Arts western portal, at first only as far as St. Francis Circle. What began as little more than a curbside stop was rebuilt for Muni Metro's light rail, and the new West Portal Station opened on April 2, 1979.",
        place: "Twin Peaks Tunnel west portal",
        where: "West Portal Ave & Ulloa St",
        at: [-122.46590, 37.74087],
        source: "https://www.sfmta.com/blog/twin-peaks-tunnel-portal-west",
      },
      {
        icon: "book",
        title: "The WPA's Mediterranean library",
        text:
          "The West Portal branch first opened on May 2, 1936, on land the Board of Education had transferred to the library that February. Just three years later, on May 8, 1939, it reopened in this building, designed by architect Frederick H. Meyer and built by the Works Progress Administration for $109,090, in a Mediterranean style with red ceramic roof tiles and painted ceiling beams. Its renovation, completed on February 10, 2007, was the second finished under the branch program funded by the city's 2000 library bond.",
        place: "West Portal Branch Library",
        where: "190 Lenox Way",
        at: [-122.46616, 37.74135],
        source: "https://sfpl.org/locations/west-portal/west-portal-library-history",
      },
      {
        icon: "house",
        title: "West Portal's primary builder",
        text:
          "Fernando Nelson, whom the Western Neighborhoods Project calls West Portal's primary builder, is best known for buying the land at the west end of the Twin Peaks Tunnel to establish the neighborhood. He built his first San Francisco house at 16 and, by one count, more than 4,000 homes in all, and his habit was to buy whole blocks, once even 50 acres, and fill them with similar houses. He built around West Portal before moving on to Mount Davidson Manor in 1923.",
        place: "Forest Side Avenue",
        where: "Ulloa St & Forest Side Ave",
        at: [-122.46864, 37.74149],
        source: "https://mtdavidson.org/mount_davidson_manor",
      },
      {
        icon: "tram",
        title: "When the L was a shuttle",
        text:
          "Muni's L Taraval, which runs along Ulloa Street here, opened on April 12, 1919, with a new connection from West Portal by way of Ulloa Street and 15th Avenue. Ridership was low at first, so small “dinky” streetcars bought for Muni's E-Union line across town shuttled between West Portal and Taraval Street at 33rd Avenue, and riders bound downtown changed to the K at the portal. The tracks reached 48th Avenue at Ocean Beach in January 1923, and larger streetcars later replaced the shuttle, running through to the Ferry Building.",
        place: "L Taraval on Ulloa Street",
        where: "Ulloa St & 14th Ave",
        at: [-122.47010, 37.74150],
        source: "https://www.sfmta.com/blog/dunes-destinations-100-years-l-taraval",
      },
      {
        icon: "church",
        title: "A parish that began in a house",
        text:
          "Archbishop Edward J. Hanna established St. Cecilia parish in 1917 and named the Rev. John P. Tobin its first pastor; a house at 1215 Taraval Street served as its first church and rectory, followed by an old converted schoolhouse on Taraval. By the parish's own count, 59 Catholic families lived within its boundaries on January 7, 1917, a territory that took in West Portal, Forest Hill, St. Francis Wood, Merritt Terrace, Sunset Terrace and the Parkside. Today the parish church stands here on 17th Avenue.",
        place: "St. Cecilia Church",
        where: "2555 17th Ave",
        at: [-122.47369, 37.73956],
        source: "https://stcecilia.com/parishhistory",
      },
      {
        icon: "shop",
        title: "Main street for the residence parks",
        text:
          "San Francisco's Planning Code describes the West Portal Avenue commercial district as three long blocks of West Portal Avenue, from Ulloa Street to 15th Avenue, plus one block of Ulloa. There was no West Portal Avenue before the tunnel; a business district grew up along it with the streetcars, and a Western Neighborhoods Project history says it served as the commercial strip for the residence parks around it. Today shops, cafés and restaurants fill its small-scale storefronts.",
        place: "West Portal Avenue shops",
        where: "West Portal Ave & 14th Ave",
        at: [-122.46905, 37.73796],
        source: "https://dev-codelibrary.amlegal.com/codes/san_francisco/latest/sf_planning/0-0-0-25735",
      },
    ],
    walk: {
      intro:
        "A loop of about 1.3 miles for visitors and would-be neighbors that starts and ends at West Portal Station, where K, L and M trains come out of the Twin Peaks Tunnel: past the library, west along Ulloa Street, where L Taraval trains run, to St. Cecilia Church, then back by Vicente Street and 15th Avenue to walk the shops of West Portal Avenue to the station. Allow about an hour, and go in the daytime, when the library is open and the avenue is busy.",
      miles: 1.3,
      minutes: 60,
      tip:
        "Save coffee or lunch for the end of the loop, on West Portal Avenue a few steps from the trains; near the start, step inside the library if it is open to see the painted ceiling beams of its 1939 interior.",
    },
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
      "Balboa Terrace fills a wedge between Junipero Serra Boulevard, Monterey Boulevard and Ocean Avenue, just south of St. Francis Wood. It was once part of Adolph Sutro's estate, whose largest piece was 1,200 acres of Rancho San Miguel, the Mexican land grant of 1845. Sutro willed those acres to a charitable trust, but after his death in 1898 his heirs broke it, and buyers including A.S. Baldwin and Duncan McDuffie took most of the land for residence parks. The homes association dates the first Balboa Terrace filing to 1912, by Baldwin & Howell.\n\nNewell-Murdoch, then developing Forest Hill, paid $100,000 for the property in May 1918, but the Western Neighborhoods Project says debts and World War I construction restrictions pushed it out of the housing business. In 1920 the John Rosenfeld's Sons Company, represented by Lang Realty, filed the official plat, designed by Punnett & Parez, and brothers Ernest C. and Oscar M. Hueter, self-described capitalists, bought the tract soon after. Hueter Homes built most of the houses in the 1920s; architect Harold G. Stoner designed as many as 60 percent of them, Walter Zweig supervised construction and Lang Realty sold them, and the Langs, Hueters and Zweigs were all related. The styles run from single-story English cottages to Spanish Colonial and Italian Renaissance Revival.\n\nDeed restrictions adopted in 1920 limited the tract to single-family detached houses, with setbacks and height limits. The 1924 covenants also barred selling or renting to anyone but white people, a restriction typical of residence parks of the era. In 1948, in Shelley v. Kraemer, the U.S. Supreme Court ruled that courts could not enforce such covenants.",
    facts: [
      {
        icon: "tram",
        title: "Where the K turned south",
        text:
          "Muni's K line opened on February 3, 1918, the first to run through the new Twin Peaks Tunnel, but it ended at St. Francis Circle rather than cross the private United Railroads' tracks. After a November 1918 agreement let city streetcars use that trackage, the K was extended south down Junipero Serra Boulevard and began serving this corner in 1919. The stop itself dates to around 1896, and United Railroads' 12 line served it before the K arrived.",
        place: "Junipero Serra and Ocean station",
        where: "Ocean Ave & Junipero Serra Blvd",
        at: [-122.47175, 37.73129],
        source: "https://en.wikipedia.org/wiki/Junipero_Serra_and_Ocean_station",
      },
      {
        icon: "house",
        title: "Stoner's houses for the Langs",
        text:
          "Harold G. Stoner, chief architect for Lang Realty, which promoted and sold Balboa Terrace, designed the R.D. Lang residence at 121 Junipero Serra in 1924 and the T.F. Lang residence at 141 in 1935, works the Mount Davidson history site says show his range in historical revival designs. Historian Jacquie Proctor writes that 121 was built as a family home at the entrance of the development. Both are private homes, so admire them from the sidewalk.",
        place: "Lang houses",
        where: "121 Junipero Serra Blvd",
        at: [-122.47105, 37.73295],
        source: "https://mtdavidson.org/harold-g-stoner/",
      },
      {
        icon: "road",
        title: "Built out one street at a time",
        text:
          "In October 1926 The Home Designer and Garden Beautiful named Ernest C. and Oscar Hueter as the land's owners and described their method: once an entire block or avenue was built up, activity moved on to the next street. Designs ran from Italian Renaissance villas to English cottage types, though most were Italian or Spanish by popular demand, among them the Kaplan home built that year on San Benito Way. Stoner's firm, which designed most of the houses, exercised architectural supervision over each one.",
        place: "San Benito Way",
        where: "San Benito Way & Monterey Blvd",
        at: [-122.46697, 37.73285],
        source: "https://mtdavidson.org/balboa-terrace/",
      },
      {
        icon: "house",
        title: "The Chronicle's Model Home No. 2",
        text:
          "Harold G. Stoner designed this mock Tudor house as San Francisco Chronicle Model Home No. 2, and OpenSFHistory holds a photograph of it whose old caption misidentified the neighborhood as Monterey Heights. Stoner designed as many as 60 percent of Balboa Terrace's houses, and the Western Neighborhoods Project says Walter Zweig supervised their construction. It is a private home, so admire it from the sidewalk.",
        place: "Chronicle Model Home",
        where: "540 Darien Way",
        at: [-122.46575, 37.73138],
        source: "https://test.opensfhistory.org/keyword/Copy%20Negative?page=388",
      },
      {
        icon: "pin",
        title: "Thirty-six more acres from Sutro",
        text:
          "In 1924 the Hueter brothers paid Charles W. Sutro $325,000 for 36 acres to the east and south of the original tract, taking Balboa Terrace to the east side of today's San Aleso Avenue. The K streetcar stops here at Aptos Avenue for the ride back through the Twin Peaks Tunnel.",
        place: "Ocean Avenue at Aptos",
        where: "Ocean Ave & Aptos Ave",
        at: [-122.46771, 37.72834],
        source: "https://www.outsidelands.org/balboa-terrace.php",
      },
    ],
    walk: {
      intro:
        "A one-way walk of just under a mile for visitors and would-be neighbors: start at the Junipero Serra and Ocean stop, served by the K streetcar and the 57 bus, head north up Junipero Serra Boulevard and east along Monterey Boulevard, then follow San Benito Way and Darien Way past the 1920s houses and finish at the K stop at Ocean and Aptos avenues. Allow about 35 minutes; a clear afternoon shows off the period-revival facades.",
      miles: 0.9,
      minutes: 35,
      tip:
        "Balboa Terrace's own streets have no shops; the nearest are just west across Junipero Serra Boulevard in the Lakeside Village commercial district on Ocean Avenue, or ride the K inbound past St. Francis Circle to the shops of West Portal Avenue.",
    },
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
      "The Inner Richmond began as part of the Outside Lands, the sand dunes west of the young city, whose title Congress settled in 1866. Australian-born art dealer George Turner Marsh, who built a house around 1876 near today's 12th Avenue and Clement Street, is credited with the name: he called it Richmond House, after the Richmond near Melbourne, and in 1890 the Board of Supervisors made the Richmond District official. The road west was Point Lobos Avenue, today's Geary Boulevard, and in a dance hall beside it the district's Catholic families held their first Mass, on Easter Sunday 1887.\n\nTransit filled in the dunes. In 1896 Adolph Sutro underwrote an electric trolley line the length of Clement Street, and after the 1906 earthquake and fire, refugees flooded west and building boomed, bringing Irish, Jewish and Russian newcomers. In 1909 the city traded the district's lettered streets for Spanish explorers' names; on December 28, 1912, Muni's first streetcars began running out Geary; and in 1914 San Francisco's first Carnegie-funded library opened on Ninth Avenue. In 1917, to avoid confusion with the city of Richmond across the bay, the city renamed the area the Park Presidio District. The name never caught on, and a 2009 ordinance formally gave the Richmond its name back.\n\nBy the 1950s, an SFMOMA neighborhood history notes, so many Chinese American families had bought houses along Clement Street that locals called it “New Chinatown,” and Chinese immigration to the Richmond accelerated after 1965.",
    facts: [
      {
        icon: "shop",
        title: "A trolley built a main street",
        text:
          "Adolph Sutro underwrote an electric trolley line the length of Clement Street in 1896, and it helped make the street a commercial corridor; a new wave of building followed the 1906 earthquake and fire. From Arguello Boulevard to Funston Avenue, about a dozen blocks, the city zones it the Inner Clement Neighborhood Commercial District, which the Planning Code credits with one of the greatest concentrations of restaurants of any commercial street in San Francisco, alongside specialty groceries, variety stores and salons. Yet the district barred new restaurants of any kind from its creation in 1987 until a 2007 ordinance made room for three new full-service restaurants.",
        place: "Clement Street shops",
        where: "Clement St & 6th Ave",
        at: [-122.46446, 37.78304],
        source: "https://www.tclf.org/clement-street",
      },
      {
        icon: "church",
        title: "First Mass in a dance hall",
        text:
          "In 1886, 41 Catholic families in the young Richmond felt ready to keep a church of their own, and their first Mass was celebrated on Easter Sunday 1887 upstairs in Farrell's Dance Hall, at Ninth Avenue and Point Lobos Avenue, as Geary was then called. Within a year they had built a 500-seat wooden church, and in 1894 the mission became a full parish under Father John P. Coyle, described as the first native San Franciscan ordained a Catholic priest; Star of the Sea marked 125 years as a parish in 2019.",
        place: "Star of the Sea Church",
        where: "4420 Geary Blvd",
        at: [-122.46669, 37.78106],
        source: "https://richmondsunsetnews.com/2019/11/03/star-of-the-sea-church-celebrates-its-quasquicentennial/",
      },
      {
        icon: "book",
        title: "The city's first Carnegie library",
        text:
          "Opened in 1914, this was the first library building in San Francisco built with Andrew Carnegie's grant money, the first of seven Carnegie branches in the city, designed by the Beaux-Arts firm Bliss & Faville. It replaced the Richmond's first branch, opened in 1892 at 809 Point Lobos Avenue, and became city Landmark No. 247 in 2005. A renovation finished in May 2009 added a pair of two-story wings on either side and rebuilt the historic reading room's ornamental ceiling.",
        place: "Richmond Branch Library",
        where: "351 9th Ave",
        at: [-122.46772, 37.78195],
        source: "https://sfpl.org/locations/richmond/library-history",
      },
      {
        icon: "star",
        title: "A concrete bowl on Clement Street",
        text:
          "Congregation Beth Sholom traces its unofficial founding to 1906, when the earthquake displaced Russian Jewish émigrés; 17 men formally founded it in October 1921, and in 1934 the cornerstone of its first synagogue was laid on this corner. In 2001 it chose architect Stanley Saitowitz to design a new home, and the congregation moved in in May 2008. Its two main volumes are a monumental concrete bowl set atop a one-story base and a near-cube sheathed in zinc-coated steel and glass; the architect lists a 2009 AIA San Francisco design honor award.",
        place: "Congregation Beth Sholom",
        where: "Clement St & 14th Ave",
        at: [-122.47348, 37.78252],
        source: "https://www.bethsholomsf.org/our-building",
      },
      {
        icon: "road",
        title: "Where the alphabet begins",
        text:
          "Until 1909 this was B Street. That year a city commission gave the Richmond's lettered streets the names of Spanish explorers, so A, B and C streets became Anza, Balboa and Cabrillo; D Street had already become Fulton because it ran out from downtown. Residents of the Richmond and Sunset protested, fearing their districts would be called San Francisco's “Spanish Town,” but the names stuck.",
        place: "Anza, Balboa and Cabrillo streets",
        where: "Balboa St & 12th Ave",
        at: [-122.47042, 37.77694],
        source: "https://www.kqed.org/news/12079532/from-anza-to-yorba-the-messy-history-behind-the-richmond-and-sunsets-street-names",
      },
      {
        icon: "tram",
        title: "Muni's first line ended here",
        text:
          "The city's Municipal Railway opened on December 28, 1912, and its first A-Geary schedule began at this corner: inbound cars left Tenth Avenue and Fulton Street, at the edge of Golden Gate Park, ran up to Geary and went on downtown to Kearny and Market streets in 28 minutes. SFMTA says service began in 1912 on the A and B lines, along Geary between downtown and 33rd Avenue. Today the 5 and 5R Fulton buses stop here.",
        place: "A-Geary line terminal",
        where: "Fulton St & 10th Ave",
        at: [-122.46839, 37.77335],
        source: "https://www.streetcar.org/munis_first_schedule_from_our_archives",
      },
    ],
    walk: {
      intro:
        "A one-way walk of about 2 miles for visitors and would-be neighbors: start at the Geary Blvd & Arguello Blvd stop (33, 38 and 38R), walk a block north to Clement Street and west along its shops, detour a block south to the church on Geary and the library on Ninth Avenue, follow Clement to 14th Avenue, then head south to Balboa Street and on to Golden Gate Park's edge at 10th Avenue and Fulton Street. Allow about 90 minutes; late morning or early afternoon, when the shops are open, is best.",
      miles: 2.1,
      minutes: 90,
      tip:
        "The route sticks to the avenue grid, with no stairways or steep climbs. Save a coffee or lunch stop for Clement Street; at the end, the 5 and 5R Fulton stop at 10th Avenue and Fulton Street for the ride back toward downtown, with Golden Gate Park across the street.",
    },
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
      "Franciscan missionaries founded Mission San Francisco de Asís in 1776, and its everyday name, which the neighborhood shares, came from a nearby creek, the Arroyo de los Dolores, or “Creek of Sorrows.” Native American laborers built its adobe church, the city's oldest intact building, between 1782 and 1791. In the 1850s two plank roads linked the mission to downtown; Col. Charles Wilson finished the Mission Plank Road, along today's Mission Street, on March 18, 1851, the last day his franchise allowed, and charged 50 cents for a horse and cart. The area became a resort and entertainment district, with saloons and gambling halls in some old mission properties, racetracks nearby and staged fights between bulls and bears.\n\nThe two Tanforan cottages on Dolores Street are said to date from the early 1850s. From 1861 the slope to the south held Jewish cemeteries, later moved to Colma, and in 1905 the city bought the land for a park. A year later the fire that followed the earthquake burned only to the east edge of Dolores Street, sparing the mission church, the cottages and the new park, where more than 1,600 homeless families camped until the summer of 1908. Levi Strauss & Co. replaced its burned plant south of Market with a factory on Valencia Street, and the burned blocks were rebuilt in the years through 1915.\n\nFrom the 1970s Valencia Street was a lesbian cultural corridor, with women's cafés, bars and a feminist bookstore, and in 1979 the Women's Building bought a 1910 hall on 18th Street. In 2026 the city made two pockets of early houses, around Chula Lane and Abbey Street and around Alert Alley, historic districts.",
    facts: [
      {
        icon: "church",
        title: "A mural hidden since 1796",
        text:
          "Native American laborers built this adobe church between 1782 and 1791; it is the oldest intact building in San Francisco, and its National Register nomination calls it the city's oldest essentially unaltered building. On the wall behind its altar, Ohlone painters made a mural in 1791 that an altarpiece, or reredos, has hidden since 1796; in 2004 artist Ben Wood and archaeologist Eric Blind lowered a camera through a trap door in the attic to photograph it, work that won a Governor's Historic Preservation Award. In the cemetery beside it, which the mission calls the only one left within city limits, lie Luis Antonio Argüello, the first governor of California under Mexican rule, and Francisco de Haro, San Francisco's first alcalde.",
        place: "Mission Dolores",
        where: "3321 16th St",
        at: [-122.42703, 37.76439],
        source: "https://en.wikipedia.org/wiki/Mission_Dolores_mural",
      },
      {
        icon: "house",
        title: "Among the city's oldest houses",
        text:
          "These two small cottages are city Landmarks No. 67 and No. 68: 214 Dolores is said to have been built a little before 1853 and 220 not long after, though the first firm date is 1866, when the owner of 214 had water piped in. The Tanforan family gave them to their daughters, and they stayed in the family until the mid-20th century; a small carriage house behind 220 still held one of the family's carriages as late as 1940. In 1906 the fire burned only to the east edge of Dolores Street, and city planners list the cottages, two of the oldest residences in the city, among what it spared.",
        place: "Tanforan Cottages",
        where: "214 Dolores St",
        at: [-122.42685, 37.76582],
        source: "https://noehill.com/SF/LANDMARKS/sf067.asp",
      },
      {
        icon: "shop",
        title: "Valencia Street's shopping corridor",
        text:
          "The city zones Valencia Street from 14th Street to Cesar Chavez Street as the Valencia Street Neighborhood Commercial Transit District, with an arm west along 16th Street toward Dolores; its blocks from 14th to 20th Street edge this neighborhood. From the 1970s these blocks were what KQED calls a lesbian cultural corridor, with women's cafés, bars, hairstylists and mechanics, and in 1976 a feminist bookstore opened at 532 Valencia, just south of this corner. Today restaurants, cafés, bars and shops fill the ground floors.",
        place: "Valencia Street shops",
        where: "Valencia St & 16th St",
        at: [-122.42191, 37.76492],
        source: "https://www.kqed.org/arts/13987669/bay-area-lesbian-archives-directory-of-dreams-glbt-historical-society-san-francisco",
      },
      {
        icon: "art",
        title: "Seven muralists, one building",
        text:
          "Architect August Reinhold Denke designed this hall, built in 1910, and on March 31, 1979, by its own timeline, the Women's Building bought it from the Sons of Norway; it was added to the National Register of Historic Places in 2018. Its MaestraPeace mural was completed in 1994 after 18 months of work by seven artists, Juana Alicia, Miranda Bergman, Edythe Boone, Susan Kelk Cervantes, Meera Desai, Yvonne Littleton and Irene Perez, with dozens of volunteers, and in 2012 the original muralists, joined by a new generation of artists, cleaned and restored it.",
        place: "The Women's Building",
        where: "3543 18th St",
        at: [-122.42262, 37.76142],
        source: "https://en.wikipedia.org/wiki/The_Women%27s_Building_(San_Francisco)",
      },
      {
        icon: "coffee",
        title: "A one-block food street",
        text:
          "The single block of 18th Street from here to Dolores is what a 2014 Star Tribune travel piece called a food block, with a bakery at this corner, an ice-cream shop at the Dolores end, and a pizzeria and a grocery in between. Long before the lines, this corner had a pastry shop known for its cakes, founded in 1950 by a husband and wife and closed by the late 1990s, when rising rents and competition from supermarket bakeries ended its run.",
        place: "18th and Guerrero shops",
        where: "18th St & Guerrero St",
        at: [-122.42380, 37.76157],
        source: "https://www.startribune.com/block-ee-for-excellent-eats/252727691/",
      },
      {
        icon: "park",
        title: "A park on old cemeteries",
        text:
          "From 1861 these slopes held Jewish cemeteries, among them Congregation Sherith Israel's; burials ended in the 1890s, and the remains were moved to Colma, where they lie in the Hills of Eternity and Home of Peace cemeteries. In 1903 more than 1,000 property owners formed the Mission Park Association, voters approved buying the land with 73.9 percent of the vote, and the city paid $291,350 for it in 1905; in 1906 and 1907 it sheltered more than 1,600 families left homeless by the earthquake and fire. At this entrance stands a replica of the bell Miguel Hidalgo rang in Dolores in 1810, unveiled on September 16, 1966, and presented by Mexican president Gustavo Díaz Ordaz; the park's bronze monument to Hidalgo by Juan F. Olaguibel was given by the city's Mexican community on September 16, 1962.",
        place: "Mission Dolores Park",
        where: "Dolores St & 19th St",
        at: [-122.42610, 37.76015],
        source: "https://en.wikipedia.org/wiki/Mission_Dolores_Park",
      },
      {
        icon: "water",
        title: "The hydrant that kept flowing",
        text:
          "When the fire that followed the 1906 earthquake swept through the Mission, this hydrant at the park's southwest corner is said to have been the only hydrant in the Mission still working, and it is credited with helping save the Mission. Dedicated on April 18, 1966, to Fire Chief Dennis Sullivan and the firefighters of the Great Fire, it gets a fresh coat of gold paint every April 18; in 2012 it came out silver, because silver paint had been bought by mistake and no one noticed until it was on.",
        place: "Golden Fire Hydrant",
        where: "Church St & 20th St",
        at: [-122.42785, 37.75825],
        source: "https://en.wikipedia.org/wiki/Golden_Fire_Hydrant",
      },
      {
        icon: "house",
        title: "Early houses the fire spared",
        text:
          "West of Dolores Street, beyond the reach of the 1906 fire, which burned only to the street's east edge, Chula Lane and Abbey Street hold a pocket of the neighborhood's early houses. In 2026 the city made the blocks along Chula Lane, Abbey Street, Dolores Street and 17th Street the Chula-Abbey Early Residential Historic District, which preservation staff counted at 52 buildings, 37 of them contributors, with a period of significance from 1865 to 1910; a second new district protects the early houses around Alert Alley.",
        place: "Chula Lane and Abbey Street",
        where: "Chula Ln & Abbey St",
        at: [-122.42741, 37.76380],
        source: "https://www.sfbos.org/sites/default/files/o0014-26.pdf",
      },
    ],
    walk: {
      intro:
        "A loop of about 1.7 miles for visitors and would-be neighbors that starts at Mission Dolores, at 16th and Dolores streets, where the 22 Fillmore stops (the J-Church stops a block west at Church and 16th, and 16th St Mission BART is three blocks east), and ends a block away on Chula Lane. Allow about 1 hour 30 minutes for the Tanforan cottages, Valencia and 18th streets, the Women's Building and Dolores Park, and go on a clear day for the view from the top of the park.",
      miles: 1.7,
      minutes: 90,
      tip:
        "Save your breath for the climb through the park from Dolores Street up to the golden hydrant at Church and 20th, where the J-Church stops; SFMTA's Routes With A View series singles out the park's panoramic city view. Early risers can see the hydrant repainted on April 18, when a procession from the 5:12 a.m. earthquake ceremony at Lotta's Fountain downtown arrives around 5:50 a.m.",
    },
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
      "Laguna Honda means roughly “deep lagoon,” and the city says a spring fed this one, on the sloping land behind Twin Peaks that was once the San Miguel Rancho of José de Jesús Noé, the last alcalde of San Francisco under Mexico. By the mid-1860s the Spring Valley Water Works was carrying water from Pilarcitos by flume and pipe to the lagoon, now Laguna Honda Reservoir. In 1866 the city opened a four-story wood-frame almshouse on the old rancho for Gold Rush pioneers who had gone bust; by 1870 its 87-acre farm supplied more than 500 men, women and children.\n\nAfter the 1906 earthquake the almshouse, renamed the Relief Home, gathered in refugees from camps across the city, and a pavilion for 1,000 people was dedicated in 1909. Mayor James “Sunny Jim” Rolph turned the first spade for the Spanish Revival-style buildings that opened in 1926, and in 1934 the Public Works of Art Project paid for Glen Wessels' five murals, four of the elements and The Professions, listed by the Living New Deal in the main lobby. It became an accredited hospital in 1963, yet the publisher of God's Hotel, physician Victoria Sweet's book about her more than twenty years there, bills it as the country's last almshouse.\n\nThe Twin Peaks Tunnel's 1918 station on Laguna Honda Boulevard was named Laguna Honda, lettering still carved on the headhouse of today's Forest Hill Station. To the south rises Edgehill Mountain, sold after Adolph Sutro's death in 1898 and subdivided as Claremont Court, with houses on its western and southern slopes. The hill belongs to a western greenbelt linking Mount Davidson, Twin Peaks and the land around Laguna Honda Reservoir.",
    facts: [
      {
        icon: "house",
        title: "From almshouse to hospital",
        text:
          "The almshouse that opened on this hillside in 1866 became, after the 1906 earthquake, the Relief Home, pressed into service for thousands of displaced San Franciscans. By 1910 the city had added Clarendon Hall, home to 250 people and the first building here meant for long-term medical care; it was demolished in 2008 to make room for today's hospital, which the city says can withstand an earthquake many times more powerful than the one that led to Clarendon being built.",
        place: "Laguna Honda Hospital",
        where: "375 Laguna Honda Blvd",
        at: [-122.45690, 37.74920],
        source: "https://sf.gov/laguna-honda-history-and-building",
      },
      {
        icon: "star",
        title: "A hilltop that won't sit still",
        text:
          "Edgehill Mountain's summit stands 734 feet high by Wikipedia's count, on land that was part of Adolph Sutro's San Miguel Ranch until it was sold after his death in 1898 and became Claremont Court, which Wikipedia calls one of the city's first subdivisions. Building here has never been easy: winter rains in 1952 and 1953 sent part of Edgehill Way, and one home on it, sliding down the mountainside. The Frisc counts the view from up here among the city's best.",
        place: "Edgehill Mountain",
        where: "Summit of Edgehill Mountain",
        at: [-122.45926, 37.74271],
        source: "https://en.wikipedia.org/wiki/Edgehill_Mountain",
      },
      {
        icon: "park",
        title: "A blue gum forest on the slope",
        text:
          "Edgehill Mountain Park dates from 1985, when the city bought about an acre of the mountain's undeveloped western slope. The Recreation and Park Department's 2006 natural areas plan describes 2.3 acres bordered by Kensington Way on the west and Edgehill Way on the north, about 1.87 of them blue gum eucalyptus, crossed by some 750 feet of trails with wooden steps on the steepest slopes; Shangrila Way and Knockash Hill both dead-end at its entrances.",
        place: "Edgehill Mountain natural area",
        where: "Kensington Way & Edgehill Way",
        at: [-122.46025, 37.74225],
        source: "https://sfrecpark.org/DocumentCenter/View/8543/625EdgehillMtn",
      },
      {
        icon: "road",
        title: "When the hillside gave way",
        text:
          "Knockash Hill, which The Frisc calls one of San Francisco's few private streets, climbs from Ulloa Street toward the natural area's southeast entrance. In January 1997, after a torrential rainstorm, the hillside above Knockash Hill Court gave way, and a San Francisco Examiner commentary recounts how 100 tons of boulders, mud and debris overran a 10-foot retaining wall and slammed into the new homes below.",
        place: "Knockash Hill",
        where: "Knockash Hill & Ulloa St",
        at: [-122.45800, 37.74170],
        source: "https://www.sfexaminer.com/archives/monster-houses-don-t-belong-on-sf-s-edgehill-mountain/article_280e93d1-6d78-5791-a72f-b0468941f539.html",
      },
      {
        icon: "factory",
        title: "The quarry and the stolen dynamite",
        text:
          "The Claremont Quarries once worked this corner of Edgehill, where Waithman Way and a church now stand, on land Alfred Meyerstein bought in 1912 for his Claremont Court subdivision. After the Preparedness Day parade bombing of July 1916 killed 10 people, Meyerstein told the Chronicle that a quantity of dynamite had been stolen about two months earlier, and historian Richard Brandi, writing for OpenSFHistory, raises the possibility that dynamite from the quarry went into the bomb.",
        place: "Claremont Quarries site",
        where: "Portola Dr & Waithman Way",
        at: [-122.45652, 37.74163],
        source: "https://test.opensfhistory.org/news/2019/08/03/the-view-from-edgehill-a-closer-look/",
      },
    ],
    walk: {
      intro:
        "A 1.4-mile line for visitors and would-be neighbors: start at Forest Hill Muni Metro station (K, L and M trains), across Laguna Honda Boulevard from the hospital grounds, then head south past Dewey Boulevard, climb Edgehill Way to the summit, come back down past the natural area to Kensington Way and Ulloa Street, and follow Ulloa east to Portola Drive at Waithman Way, where the 43 and 48 buses stop. Allow about 75 minutes, and go on a clear day, when the view from the top is open.",
      miles: 1.4,
      minutes: 75,
      tip:
        "This is a residential pocket with no shopping street, so bring water; the nearest cafés and shops are on West Portal Avenue, under 10 minutes' walk west along Ulloa Street from Kensington Way. Edgehill Way climbs steadily, so take it slowly; from the last stop, Forest Hill Station is 12 to 15 minutes' walk back up Laguna Honda Boulevard.",
    },
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
      "Upper Market, on this map, is the hillside where Market Street ends its long climb from downtown, curving around the eastern slope of Twin Peaks, whose two summits are also known as Eureka and Noe. The land was part of Rancho San Miguel, the 4,443-acre grant made in 1845 to José de Jesús Noé, which reached from Eureka Valley past Mount Davidson. Corbett Road, a dirt track across these slopes dating from the 1860s, began as a toll road built to collect nickels from day-trippers; by 1902 its franchise had expired, and it was free and open, if not well maintained.\n\nMarket Street arrived with the Twin Peaks Tunnel. While the tunnel was being built, between 1914 and 1917, Market Street, which had ended at Castro Street, was extended up and over the hill until it met Corbett, and from there the road became Portola Drive; a December 1915 photo caption calls it “Portola (then Corbett Road).” Downhill, in the 1930s and 1940s, the Market Street Railway’s 11-Line streetcars ended at 24th Street and Hoffman Avenue, and on September 29, 1944, the company handed its lines and more than 500 streetcars to the city’s Municipal Railway.\n\nThe road was rebuilt again in the 1960s. The 1964 straightening of Upper Market took out a 1928 retaining wall and ramp at 23rd Street, and a viaduct, built where houses had stood, bypassed an older stretch of the road that survives as Cuesta Court. Walkers cross Market on Romain Street’s spiraling overpass, and uphill, a rebuilt trail from Crestline Drive to the summit reopened in August 2025, the last piece of a trail renovation that began at Portola Drive.",
    facts: [
      {
        icon: "tram",
        title: "Where the 11-Line streetcars ended",
        text:
          "Streetcars once ended their run at this corner. An August 26, 1938, photo looks east down 24th Street to Market Street Railway 11-Line car No. 797 at the terminus here, out over Noe Valley to Potrero Hill, and photos from 1943 show other 11-Line cars at the same 24th and Hoffman terminal. On September 29, 1944, the private company turned over its lines and more than 500 streetcars to the city’s Municipal Railway; today the 35 Eureka bus stops at the corner.",
        place: "11-Line streetcar terminal",
        where: "24th St & Hoffman Ave",
        at: [-122.44050, 37.75098],
        source: "https://test.opensfhistory.org/photo/wnp67.0357",
      },
      {
        icon: "road",
        title: "A ramp lost to a straighter Market",
        text:
          "A May 3, 1928, Public Works photo, looking south from 23rd Street, shows a newly finished retaining wall and ramp leading up to Upper Market Street. Both were demolished in the 1964 straightening of Upper Market, and none of the nearby houses in that view remain. A 1921 photo of the same intersection, taken during the Market Street Extension work, shows it before the wall was built; every home in that view was later demolished or moved.",
        place: "Old 23rd Street ramp",
        where: "Grand View Ave & 23rd St",
        at: [-122.44197, 37.75263],
        source: "https://test.opensfhistory.org/photo/wnp36.03656",
      },
      {
        icon: "bridge",
        title: "A spiral bridge over Market",
        text:
          "Romain Street runs just three blocks from Douglass Street, and between its second and third blocks a spiraling pedestrian overpass carries it over Market Street; the walk crosses it to reach this corner. A 1921 Public Works photo records the corner of Market and Romain; today the site has a pedestrian overcrossing, and Romain has no automobile access from Market.",
        place: "Romain Street overpass",
        where: "Corbett Ave & Romain St",
        at: [-122.44281, 37.75541],
        source: "https://choisser.com/hiking/twinpeaks.html",
      },
      {
        icon: "road",
        title: "A stub of the old Market Street",
        text:
          "Cuesta Court was once part of Grand View Avenue and then of Market Street, which the original Market Street Extension work connected with Corbett at this spot. In the 1960s a widening project bypassed it with a viaduct built where houses had stood, and the houses were demolished. The old roadway survives as this short court off Corbett Avenue.",
        place: "Cuesta Court",
        where: "Corbett Ave & Cuesta Ct",
        at: [-122.44396, 37.75085],
        source: "https://test.opensfhistory.org/neighborhood/upper-market?page=3",
      },
      {
        icon: "money",
        title: "A toll road for day-trippers",
        text:
          "Portola Drive starts near here, where Market Street ends, and follows the old Corbett Road: a December 1915 photo caption calls it “Portola (then Corbett Road).” An April 27, 1902, photo taken from roughly this spot looks south along Corbett Road toward today’s Diamond Heights, and the cabin in it is reputedly the road’s old toll house. The road began as a toll road built to collect nickels from day-trippers, but by then its franchise had expired, and the dirt road was free and open, if not well maintained.",
        place: "Old Corbett Road",
        where: "6 Portola Dr",
        at: [-122.44348, 37.74995],
        source: "https://test.opensfhistory.org/news/2018/08/12/corbett-road-a-closer-look/",
      },
      {
        icon: "stairs",
        title: "A rebuilt trail to the summit",
        text:
          "Rec and Park rebuilt the trail from Crestline Drive to the summit of Twin Peaks, with new box steps, retaining walls and stringer stairs on its steeper sections, and on August 25, 2025, announced the Crestline Connector Trail complete and open, the final piece of a trail renovation that began at Portola Drive. Work on a new Twin Peaks Promenade at the top broke ground in April 2026 and is expected to finish in mid-2027, and a 2026 Secret San Francisco report says the footpath to Crestline Drive is closed in the meantime. Check Rec and Park’s Twin Peaks page before you climb.",
        place: "Crestline Connector Trail",
        where: "74 Crestline Dr",
        at: [-122.44620, 37.75176],
        source: "https://sfrecpark.org/634/Twin-Peaks-Trails-Improvement-Project",
      },
    ],
    walk: {
      intro:
        "A one-way walk of about 1.6 miles for visitors and would-be neighbors, from the 35 Eureka stop at 24th Street and Hoffman Avenue along Hoffman and Grand View avenues, over Market Street on the Romain Street overpass, along Corbett Avenue past Cuesta Court to the head of Portola Drive, then up Burnett Avenue to Crestline Drive, where the 37 bus stops. Allow about 75 minutes, and pick a clear day.",
      miles: 1.6,
      minutes: 75,
      tip:
        "Wear comfortable shoes: this is a hillside walk that ends with the climb up Burnett Avenue to Crestline Drive. There are no shops on the route; the shops and cafés of 24th Street in Noe Valley begin at Diamond Street, two blocks east of the start.",
    },
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
      "Forest Hill rose on land that had belonged to Adolph Sutro. The Newell-Murdoch Company bought the tract from his heirs, and development began in 1912, the year Mark Daniels surveyed it. Daniels soon worked on a national stage: on June 4, 1914, he was appointed general superintendent and landscape engineer of the national parks, with headquarters in San Francisco. That same year, Forest Hill's first house was finished.\n\nTransit arrived early. On February 3, 1918, the new Twin Peaks Tunnel opened with a station at the neighborhood's edge, first called Laguna Honda and later renamed Forest Hill. Bernard Maybeck, the Berkeley architect, left his mark here as well: a house the Pacific Coast Architecture Database dates to 1913, the Erlanger house of 1916 and, in 1919, a clubhouse for the homeowners' association. A second wave of building came in the 1920s, when the Lang Realty Company began further development.\n\nForest Hill is one of eight master-planned residence parks in San Francisco, and like the others it was bound by deed restrictions. The city Planning Department's history of the residence parks notes that these barred commercial activity, set minimum construction costs and, at first, included racial covenants. Public stairways climb between its curving streets, some of them photographed before the houses around them were built.",
    facts: [
      {
        icon: "subway",
        title: "Its first name is still carved",
        text:
          "Built from 1916 to 1918 as part of the Twin Peaks Tunnel, the station opened as Laguna Honda, and that name is still carved on its headhouse. It lies deeper underground than any other Muni Metro station, which is why most riders take its elevators. In 2004 the city made it San Francisco Landmark No. 231.",
        place: "Forest Hill Station",
        where: "Laguna Honda Blvd & Dewey Blvd",
        at: [-122.45919, 37.74817],
        source: "https://en.wikipedia.org/wiki/Forest_Hill_station_(Muni_Metro)",
      },
      {
        icon: "stairs",
        title: "135 steps up from Magellan",
        text:
          "A 1916 photograph of this corner shows the Forest Hill stairway beside the planted intersection of Pacheco Street and Magellan Avenue, when Magellan had no houses yet. A 1974 view shows vases and hedges along the staircase, and the San Francisco Outdoor Gazette's stairway list counts 135 steps on the Pacheco flight.",
        place: "Pacheco Street stairway",
        where: "Magellan Ave & Pacheco St",
        at: [-122.46278, 37.74643],
        source: "https://test.opensfhistory.org/neighborhood/forest-hill?page=4",
      },
      {
        icon: "house",
        title: "Maybeck's English manor",
        text:
          "Bernard Maybeck designed this three-story house, with engineer John White, in 1916 for S.H. Erlanger and his wife, who had chosen a medieval Lancashire manor, Samlesbury Hall, as its prototype. Maybeck called it an attempt to suggest an English character in California: a house that would never happen in England, yet has an English feeling. It is a private home, best admired from the sidewalk.",
        place: "Erlanger House",
        where: "270 Castenada Ave",
        at: [-122.46262, 37.74702],
        source: "https://socketsite.com/archives/2008/02/too_beautiful_to_describe_except_by_the_architect_270_c.html",
      },
      {
        icon: "road",
        title: "Up the steps, May 1921",
        text:
          "A photograph dated May 3, 1921, in the Western Neighborhoods Project's archive looks from Castenada Avenue up the Forest Hill Steps toward this corner of San Marcos and 9th avenues. Mark Daniels, who surveyed the tract in 1912, was known for plans that kept a site's existing natural features to preserve a sense of local character, and Forest Hill's streets wind along the contours of the hill.",
        place: "Forest Hill Steps",
        where: "San Marcos Ave & 9th Ave",
        at: [-122.46601, 37.74705],
        source: "https://test.opensfhistory.org/photo/wnp26.249",
      },
      {
        icon: "star",
        title: "A clubhouse styled as a pub",
        text:
          "Forest Hill's homeowners' association commissioned Berkeley architect Bernard Maybeck (1862–1957) to design its clubhouse, and the two-story building, completed in 1919, was styled after a quaint medieval English pub. It still stands on Magellan Avenue as the neighborhood's clubhouse.",
        place: "Forest Hill Clubhouse",
        where: "381 Magellan Ave",
        at: [-122.46410, 37.74548],
        source: "https://pcad.lib.washington.edu/building/20634",
      },
    ],
    walk: {
      intro:
        "A loop of about 1.3 miles for visitors and would-be neighbors, starting and ending at Forest Hill Station (Muni Metro K, L and M trains, plus the 36, 43, 44 and 52 buses): out Magellan Avenue to the Pacheco Street stairway, up to Castenada Avenue past Maybeck's Erlanger House, up a second flight toward San Marcos and 9th avenues, then down to his 1919 clubhouse and back along Magellan. Allow about an hour, and go in daylight, since the stairways are the heart of the route.",
      miles: 1.3,
      minutes: 60,
      tip:
        "Forest Hill has no shopping street of its own: for coffee or lunch afterward, ride one stop west to West Portal Station, or walk about 10 minutes downhill from the clubhouse, where cafés and restaurants line West Portal Avenue. Wear good shoes, since the route climbs two stairways.",
    },
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
      "Diamond Heights spreads over three hills just south of Twin Peaks: Red Rock Hill, at 690 feet the tallest; Gold Mine Hill, at 680; and Fairmount Hill, at 540. As late as the 1950s about three-fourths of the land lay undeveloped, and until the 1960s fewer than 400 people lived here, by one account outnumbered by cows. The Board of Supervisors designated the hills a redevelopment survey area on July 24, 1950, and in 1954 a state appeals court, in San Francisco Redevelopment Agency v. Hayes, upheld treating vacant land as blighted, clearing the way.\n\nSupervisors approved the plan on October 24, 1955. Architect Vernon DeMars's master plan broke from the city grid with curving streets that follow the contours of the hills, and it protected the views of downtown and the bay with height limits, aiming for a “suburb within a city.” The Redevelopment Agency began auctioning parcels in early 1961 and used a competition to attract talented architects. Joseph Eichler built about 100 homes on Red Rock Hill, and Bay Area modernists including Warren Callister, Campbell & Wong and Joseph Esherick designed custom houses and small tracts.\n\nA cluster of high-rise towers with more than 600 apartments was meant to crown Red Rock Hill, but slow sales of the townhouses along Diamond Heights Boulevard, and later financial trouble, brought low-rise units instead. When the project was completed in 1978, the hills held more than 7,000 people. In her 2017 master's thesis, Modern Diamond Heights, architectural historian Hannah Simonson called it one of the highest concentrations of modernist architecture in San Francisco.",
    facts: [
      {
        icon: "art",
        title: "A redwood wall against runaway cars",
        text:
          "When Eichler Homes built on the slope below, it deeded an uphill sliver of land here back to the Redevelopment Agency for a “safety wall” to keep runaway vehicles from careening down onto the new houses. Bay Area artist and architect Stefan Alexander Novak's abstract design was chosen in 1966, and the redwood wall, 32 feet high and 50 feet long, went up in 1968, worked with dragonfly and flower motifs that stood for his wife and two daughters. It became a city landmark in 2018.",
        place: "Diamond Heights Safety Wall",
        where: "Diamond Heights Blvd & Clipper St",
        at: [-122.44395, 37.74668],
        source: "https://commissions.sfplanning.org/hpcpackets/2017-011910DES122017.pdf",
      },
      {
        icon: "house",
        title: "Eichlers on the tallest hill",
        text:
          "Red Rock Hill, at 690 feet the tallest of Diamond Heights' three hills, is where Joseph Eichler built about 100 homes, roughly from 1962 to 1964, on Amethyst Way, Amber Drive, Cameo Way and Duncan Street. Claude Oakland & Associates designed them for these steep slopes, and none of the half-dozen or so models turns up in any other Eichler tract. Unusually for Eichler, they are attached row houses, from split-levels to two- and three-story homes, many with atriums.",
        place: "Red Rock Hill Eichlers",
        where: "Duncan St & Cameo Way",
        at: [-122.44304, 37.74519],
        source: "https://www.eichlernetwork.com/article/suburbia-sky",
      },
      {
        icon: "park",
        title: "Modernist play sculptures, kept",
        text:
          "Tucked between the shopping center and the northeastern rim of Glen Canyon, this 6.8-acre park is named for former mayor George Christopher, who came to its dedication on April 7, 1971, seven years after he left office. Planners took an interest in its original playground because its 1961 schematic design was by modernist landscape architect Robert Royston. A $5.2 million renovation reopened the park in 2021, with two historic modernist play sculptures and a replica set in a new play area beside the ballfield fence.",
        place: "George Christopher Playground",
        where: "Diamond Heights Blvd & Duncan St",
        at: [-122.44007, 37.74525],
        source: "https://www.glenparkassociation.org/christopher-park-playground-opens-after-remodel/",
      },
      {
        icon: "shop",
        title: "Shops planned with the hills",
        text:
          "Like the neighborhood's churches and parks, its shops came out of the redevelopment's community planning, unlike those of most of the city's older neighborhoods, and they cluster in this one center: 75,630 square feet at 5214–5290 Diamond Heights Boulevard. When it sold in a deal reported in early 2018, the broker said it was the first time in nearly 40 years the center had come on the investment market; its grocery store had operated here for more than half a century, alongside a drugstore, a bank and a post office.",
        place: "Diamond Heights Shopping Center",
        where: "Diamond Heights Blvd & Gold Mine Dr",
        at: [-122.43769, 37.74361],
        source: "https://www.nmrk.com/insights/press-releases/nkf-capital-markets-handles-sale-of-diamond-heights-shopping-center",
      },
      {
        icon: "church",
        title: "A church on the developers' land",
        text:
          "According to the parish's history, St. Aidan's congregation was founded in 1954 and first worshipped in an existing church in Cole Valley. In 1962 the Diamond Heights developers granted it this hilltop site at the corner of Diamond Heights Boulevard and Gold Mine Drive, and the church, which the Pacific Coast Architecture Database credits to Skidmore, Owings & Merrill, opened for worship in 1963.",
        place: "St. Aidan's Episcopal Church",
        where: "101 Gold Mine Dr",
        at: [-122.43812, 37.74319],
        source: "https://pcad.lib.washington.edu/building/16796/",
      },
      {
        icon: "road",
        title: "The street that named the hills",
        text:
          "Diamond Street climbs the eastern slopes of these hills from Noe Valley and runs on downhill into Glen Park, and it gave the neighborhood its name: the Redevelopment Agency proposed “Diamond Heights” because Diamond Street, when extended, would lead into the central part of the area as one of its principal arteries. Up the hill, the new curving streets took the names of precious minerals, among them Amber, Amethyst, Topaz and Turquoise, and even the public stairways got names, some for semiprecious stones and others for women.",
        place: "Diamond Street",
        where: "Diamond St & Diamond Heights Blvd",
        at: [-122.43557, 37.74177],
        source: "https://www.glenparkhistory.org/diamond-heights-c1l4v",
      },
    ],
    walk: {
      intro:
        "A 0.8-mile one-way walk for visitors and would-be neighbors, from Clipper St & Portola Dr, where the 37, 48 and 52 buses stop, past the redwood Safety Wall, down through the Eichler streets of Red Rock Hill and along Diamond Heights Blvd past the shopping center to Diamond St, where the 35 and 52 stop. Allow about 40 minutes, and go on a clear day, when the views from the hills open up.",
      miles: 0.8,
      minutes: 40,
      tip:
        "From the last stop, Diamond Street runs downhill a little over half a mile to Glen Park's village shops and its BART station, or catch the 35 or 52 back at the corner.",
    },
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
      "Ingleside Terraces is built on a racetrack. Ed Corrigan and others bought the land from Adolph Sutro for $165,000, and their Pacific Coast Jockey Club opened the Ingleside Racetrack on Thanksgiving Day, November 28, 1895. Six days later a streetcar spur out Ocean Avenue reached Victoria Street for the crowds. A ban on gambling closed the track in March 1899, but racing came back, and the track ran until December 31, 1905. The 1906 earthquake ended plans to reopen it: the track's owner, Thomas Williams, offered the grounds to the city as a refugee camp, which also took in patients from today's Laguna Honda Hospital and served 1,287 people before closing in January 1908.\n\nWilliams optioned the property for $400,000 to Joseph A. Leonard, who had built a neighborhood of Victorian homes in Alameda and laid out Jordan Park, and in March 1910 the Urban Realty Improvement Company, or Urico, which Leonard managed, bought it. The track and grandstand came down, but the clubhouse stayed on as the sales office. Urico laid out 613 parcels on 148 acres, with stone gateways and a loop road, Urbano Drive, paved on the old racecourse by 1912; one local history calls it the city's first tract with wide, smooth streets built for the automobile. On the night of October 10, 1913, about 1,500 people came to dedicate a giant sundial meant to draw buyers.\n\nToday the tract, one of nine master-planned residence parks in the city, holds about 750 detached homes. In 2021 San Francisco made the sundial and its little park a city landmark, calling it an excellent example of the public landscape features common to the residence parks of the period.",
    facts: [
      {
        icon: "star",
        title: "Twelve gateways, 67 columns",
        text:
          "The neighborhood's homes archive counts 12 gateways around Ingleside Terraces with a total of 67 imposing stone columns, and its record of them includes this entrance at Ocean and Cerritos avenues, with photographs from about 1912 held by the San Francisco Public Library's History Center. Through the pillars, Cerritos Avenue curves southwest toward the old racetrack grounds.",
        place: "Cerritos Avenue gateway",
        where: "Ocean Ave & Cerritos Ave",
        at: [-122.46678, 37.72722],
        source: "https://sfog.us/homes/Gateways.htm",
      },
      {
        icon: "house",
        title: "The clubhouse that sold the lots",
        text:
          "The racetrack's clubhouse stood at the southeast corner of Cerritos Avenue and Moncada Way, with its carriage entrance on Cerritos and its south side facing the track, today's Urbano Drive. Urico kept it as its sales office through the 1910s and '20s, at 85 Cerritos, while the track's old stables became the company's planing mill. The homes association met in the clubhouse until it gave way to houses, in 1930 by one account and 1938 by another; the homes here are private, so look from the sidewalk.",
        place: "Racetrack clubhouse site",
        where: "85 Cerritos Ave",
        at: [-122.46890, 37.72617],
        source: "https://sfog.us/homes/Clubhouse.htm",
      },
      {
        icon: "sun",
        title: "A sundial dedicated at night",
        text:
          "Urico built the giant dial as a marketing device and dedicated it on the night of October 10, 1913, the same day the Atlantic and Pacific waters first met at the Panama Canal; about 1,500 people came. Its gnomon stands 26 or 28 feet tall, depending on the source, and the four columns around the circle represent the Doric, Ionic, Corinthian and Tuscan orders, each topped by an urn whose friezes show the four ages of life, the four seasons and the four periods of the day. In 2021 the dial and its park became San Francisco Landmark No. 293.",
        place: "Ingleside Terraces Sundial",
        where: "West end of Entrada Ct",
        at: [-122.46876, 37.72469],
        source: "https://sundials.org/index.php/sundial-registry/onedial/82",
      },
      {
        icon: "road",
        title: "A street on a one-mile racetrack",
        text:
          "Urbano Drive follows the course of the old one-mile oval and was paved along the loop by 1912, so its long curves are the track's own. About 12,000 people braved heavy rain for the track's inaugural meeting in 1895, and after the 1906 earthquake the grounds became a refugee camp that also housed patients from today's Laguna Honda Hospital. The houses along the curve are private, so enjoy them from the sidewalk.",
        place: "Urbano Drive",
        where: "26 Urbano Dr",
        at: [-122.46319, 37.72482],
        source: "https://en.wikipedia.org/wiki/Ingleside_Terraces,_San_Francisco",
      },
      {
        icon: "shop",
        title: "Groceries, bakeries and a movie palace",
        text:
          "This block of Ocean Avenue, between Ashton Avenue and Victoria Street, is zoned as part of the city's Ocean Avenue Neighborhood Commercial Transit District, and the racetrack streetcar of 1895 ran along it, as the K Ingleside does today. The 1940 city directory listed three grocery stores, two bakeries, two hardware stores, a pharmacy and a drug store on the 1900 block. Across the street stands the El Rey Theatre, an Art Deco movie house designed by Timothy Pflueger and built in 1931, which became city Landmark No. 274 in 2017 and has been a church since 1978.",
        place: "Ocean Avenue shops",
        where: "Ocean Ave & Ashton Ave",
        at: [-122.46276, 37.72532],
        source: "https://sfog.us/homes/Ocean.htm",
      },
      {
        icon: "tram",
        title: "Where the racetrack streetcar ended",
        text:
          "On December 4, 1895, six days after the Ingleside Racetrack opened, the Market Street Railway opened a spur off its Mission Street line out Ocean Avenue to Victoria Street to serve it, and that terminus is today's Ocean and Victoria stop on the K Ingleside. A photograph of the Victoria gateway from about 1912 appears, according to the neighborhood's homes archive, to show Urico's manager, Joseph A. Leonard, and his son George, both architects who designed many Ingleside Terraces homes.",
        place: "Victoria Street gateway",
        where: "Ocean Ave & Victoria St",
        at: [-122.46435, 37.72601],
        source: "https://en.wikipedia.org/wiki/Ocean_and_Fairfield_/_Ocean_and_Victoria_stations",
      },
    ],
    walk: {
      intro:
        "A one-way walk of about 1.2 miles for visitors and would-be neighbors: ride the K Ingleside to Ocean and Cerritos avenues, pass through the stone gateway, follow Cerritos Avenue to the old clubhouse site, detour to the sundial at the west end of Entrada Court inside the oval, then follow Urbano Drive along the racetrack's curve and finish on Ocean Avenue at the K stop at Victoria Street. Allow about 50 minutes, and go on a clear afternoon.",
      miles: 1.2,
      minutes: 50,
      tip:
        "A sundial needs sun, and on a foggy day this one casts no shadow, so go when the fog has burned off; the walk ends on the commercial 1900 block of Ocean Avenue, beside the K stop.",
    },
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
      "Clarendon Heights climbs the northern shoulder of Twin Peaks, from Corbett Avenue up to the hilltop beneath Sutro Tower and west along Clarendon Avenue. The land was part of Adolph Sutro's largest purchase, 1,200 acres of Rancho San Miguel, and in 1886, the year he helped launch California's first Arbor Day, he planted neighboring Mount Sutro with blue gum eucalyptus, Monterey pine and Monterey cypress. The neighborhood's name was in use early: an August 1894 photo of the Spring Valley Water Company building a 500,000-gallon tank on the knob now called Tank Hill shows a Clarendon Heights sign.\n\nAfter Sutro's death his estate was in litigation for almost twenty years, and around 1930 much of the developable, eucalyptus-covered land began to be cleared, work that went on into the 1960s. That year his grandson, Adolph Gilbert Sutro, had architect Harold G. Stoner build La Avanzada, a medieval-style mansion of 15 rooms with stone lions at its entrance, on family land at the top. Houses filled the streets below, among them a mid-century house on Palo Alto Avenue custom built in 1953 for Mayor Elmer E. Robinson.\n\nIn August 1948 the younger Sutro sold La Avanzada to ABC, and its new station, KGO-TV, went on the air on May 5, 1949, producing its shows in the mansion. In the 1960s this site won out over Mount San Bruno, judged too close to the airport for a taller tower, and the city, calling the mansion a firetrap, required its demolition as part of the permit. The 977-foot Sutro Tower began transmitting on July 4, 1973, and was San Francisco's tallest structure until Salesforce Tower passed it in 2018.",
    facts: [
      {
        icon: "tower",
        title: "The restaurant that never was",
        text:
          "Initial designs envisioned a 1,200-foot tower with a restaurant and observation deck, and a December 1962 Chronicle story floated its tourist appeal, but the tower raised a decade later stops at 977 feet with no restaurant; its tip stands 1,811 feet above sea level. Albert C. Martin & Associates of Los Angeles designed the three-legged tower, and Kline Towers, a subsidiary of South Carolina's Kline Iron and Steel, fabricated and erected it in a $4 million project begun in 1971 after years of hearings and litigation. The Sutro mansion that held KGO-TV's studios was torn down to make way for it.",
        place: "Sutro Tower",
        where: "1 La Avanzada St",
        at: [-122.45284, 37.75523],
        source: "https://www.sutrotower.com/tower-history",
      },
      {
        icon: "mayor",
        title: "A mayor's house on the Ridge Trail",
        text:
          "The Bay Area Ridge Trail climbs through here: from the Clarendon trailhead of the Mount Sutro forest, its route crosses Clarendon Avenue to Dellbrook Avenue, curves onto La Avanzada Street and turns onto Palo Alto Avenue just before the Sutro Tower gate, then takes Marview Way and a trail by the Twin Peaks Reservoir up to Twin Peaks Boulevard. On Palo Alto, the mid-century house at No. 100 was custom built in 1953 for Mayor Elmer E. Robinson.",
        place: "Palo Alto Avenue",
        where: "Palo Alto Ave & Glenbrook Ave",
        at: [-122.45037, 37.75705],
        source: "https://ridgetrail.org/mount-sutro-twin-peaks/",
      },
      {
        icon: "park",
        title: "A road cut through Sutro's trees",
        text:
          "City Public Works photographers recorded Clarendon Avenue's construction on November 19, 1930: one view shows the new road running just inside Sutro Forest, past a house that still stands as 114–116 Clarendon, and another shows trees being cleared for it; on December 30 the forest slash was being burned. Logging by Sutro's heirs was halted in 1934 after a fire, and the forest was logged again during World War II.",
        place: "Clarendon Avenue",
        where: "Mountain Spring Ave & Clarendon Ave",
        at: [-122.44951, 37.75841],
        source: "https://test.opensfhistory.org/neighborhood/clarendon-heights?page=9",
      },
      {
        icon: "road",
        title: "A figure eight around two peaks",
        text:
          "From Clarendon Avenue, Twin Peaks Boulevard climbs south toward the two summits, Eureka to the north and Noe to the south, about 660 feet apart, and runs a figure eight around them. Each peak is just over 900 feet high, and Wikipedia ranks them the city's second- and third-highest natural points, after 928-foot Mount Davidson.",
        place: "Twin Peaks Boulevard",
        where: "Twin Peaks Blvd & Clarendon Ave",
        at: [-122.44790, 37.75888],
        source: "https://en.wikipedia.org/wiki/Twin_Peaks_(San_Francisco)",
      },
      {
        icon: "stairs",
        title: "Old stone above, pink cement below",
        text:
          "Just north of Clayton and Corbett, the Pemberton Place steps climb the hill toward Graystone and Crown terraces, crossing Villa Terrace, with benches and handrails along the way. An OpenSFHistory photo taken from Villa Terrace shows the original steps, which its caption says were replaced in the 1990s; in 2009 a Streetsblog writer found the top flight still old stone and the lower two flights redone in pink cement with a water fountain, and tied water seeping from the hillside at Clayton and Corbett to a historic spring.",
        place: "Pemberton Place steps",
        where: "Clayton St & Corbett Ave",
        at: [-122.44650, 37.75900],
        source: "https://sf.streetsblog.org/2009/07/07/water-wars-past-and-future",
      },
    ],
    walk: {
      intro:
        "A one-way, mostly downhill walk of about a mile for visitors and would-be neighbors: from the 36 bus stop at Panorama Drive and Dellbrook Avenue, climb Dellbrook and La Avanzada Street to the Sutro Tower gate, wind down Palo Alto Avenue and the side streets below it to Clarendon Avenue, follow Clarendon to Twin Peaks Boulevard, then take Crown Terrace to the Pemberton Place steps and descend to Clayton Street at Corbett Avenue, where the 33 and 37 buses stop. Allow about 50 minutes, and pick a clear day for the views east over the city.",
      miles: 1.1,
      minutes: 50,
      tip:
        "There are no shops on these residential streets; the nearest cafés and shops are in Cole Valley, on Cole Street around Carl Street, or along Castro and 18th streets, which the 33 bus reaches from the last stop. With energy to spare, Twin Peaks Boulevard climbs on from Clarendon Avenue to the summits; check Rec and Park for any closures before you go.",
    },
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
      "Chinatown’s main street is San Francisco’s first. In 1835 William A. Richardson pitched a tent near today’s Grant Avenue and Clay Street, the first home in Yerba Buena, and the lane mapped that year was named Calle de la Fundación, Foundation Street; it later became Dupont Street. On July 9, 1846, Marines from the USS Portsmouth raised the American flag over the plaza a block east, which took the ship’s name, and in 1847 the town became San Francisco. Chinese immigrants settled around Dupont Street, and their associations united as the Chinese Six Companies, which gave aid, settled disputes and fought anti-Chinese laws.\n\nHostility followed. In July 1877 a riot against Chinese residents left four dead, and the Chinese Exclusion Act of 1882, the first U.S. law to restrict immigration by ethnicity, stood until 1943. Within days of the 1906 earthquake and fire, which leveled the quarter, a city Committee on the Relocation of Chinatown adopted a plan to move it to Hunters Point. But the city stood to lose the taxes Chinese residents paid and the China trade, with Oakland, Los Angeles and Seattle offering their ports, and by May 10 the mayor had dissolved the committee.\n\nMerchants rebuilt on the same blocks. Look Tin Eli hired architect T. Paterson Ross and engineer A. W. Burgren, neither of whom had been to China, and their pagoda-topped buildings set the look of the street, which took the name Grant Avenue as the city rebuilt. The Dragon Gate followed in 1970, and on November 19, 2022, the Central Subway opened Chinatown–Rose Pak Station, named for the community leader who championed it but died before it opened.",
    facts: [
      {
        icon: "tower",
        title: "A gate born of a design contest",
        text:
          "The city sponsored a design competition for Chinatown’s ceremonial south entrance, with a $70,000 budget, open to architects of Chinese descent; architect Clayton Lee won it with landscape architects Melvin H. Lee and Joseph Yee. The Republic of China (Taiwan) donated much of the material, and the gate was dedicated on October 18, 1970. Its central plaque carries a motto of Sun Yat-sen, translated “All under heaven is for the good of the people,” and Sun himself stands two blocks north.",
        place: "Dragon Gate",
        where: "Grant Ave & Bush St",
        at: [-122.40566, 37.79069],
        source: "https://en.wikipedia.org/wiki/Dragon_Gate_(San_Francisco)",
      },
      {
        icon: "art",
        title: "A revolutionary in granite and steel",
        text:
          "Beniamino Bufano’s 14-foot statue of Sun Yat-sen, in red granite and stainless steel, went up in this square in 1937. Sun had come to San Francisco in political exile to rally support for overthrowing China’s Manchu rulers, and in 1912 he became the first president of the Chinese Republic he helped found. A second, privately funded statue, honoring the “comfort women,” was added in 2017.",
        place: "St. Mary's Square",
        where: "651 California St",
        at: [-122.40524, 37.79200],
        source: "https://en.wikipedia.org/wiki/Saint_Mary%27s_Square_(San_Francisco)",
      },
      {
        icon: "church",
        title: "A clock with a warning",
        text:
          "Archbishop Joseph Alemany dedicated St. Mary’s at Christmas midnight Mass in 1854, making it the first cathedral of the Archdiocese of San Francisco; its foundation granite was quarried and cut in China, and its bricks were made in New England and carried around Cape Horn as ships’ ballast. It came through the 1906 earthquake only to be gutted by fire a day later, a blaze hot enough to melt its bells and marble altar, and it was rededicated in 1909. Under the clock face, a line from Ecclesiasticus, “Son, observe the time and fly from evil,” was aimed at the men who frequented the brothels around it in the 1850s; the city lists the church as Landmark No. 2.",
        place: "Old St. Mary's Cathedral",
        where: "660 California St",
        at: [-122.40572, 37.79264],
        source: "https://en.wikipedia.org/wiki/Old_St._Mary%27s_Cathedral",
      },
      {
        icon: "shop",
        title: "Four blocks of bazaars",
        text:
          "San Francisco’s planning code sets aside Grant Avenue from California Street to Jackson Street, four blocks, as the Chinatown Visitor Retail District, noting its concentration of shopping bazaars, art goods stores and restaurants, and it bars chain stores there. The pagoda roofs and dragon motifs along the way date from the rebuilding after 1906, when architects often set them on otherwise American-style buildings.",
        place: "Grant Avenue shops",
        where: "Grant Ave & Clay St",
        at: [-122.40639, 37.79425],
        source: "https://dev-codelibrary.amlegal.com/codes/san_francisco/latest/sf_planning/0-0-0-26717",
      },
      {
        icon: "flag",
        title: "Where the American flag went up",
        text:
          "On July 9, 1846, Marines from the USS Portsmouth under Second Lieutenant Henry Bulls Watson rowed ashore, marched to the pueblo’s main plaza and raised the American flag here, and later that year the square took the ship’s name; a marker notes that the first public school building went up at its southwest corner in 1847. The park closed on June 10, 2026, for its first major renovation in nearly 50 years, a $73 million rebuild expected to take about two years that removes the 240-foot pedestrian bridge over Kearny Street and adds an 8,300-square-foot community clubhouse and a larger playground, so for now it is seen from the sidewalk.",
        place: "Portsmouth Square",
        where: "Kearny St & Clay St",
        at: [-122.40530, 37.79482],
        source: "https://en.wikipedia.org/wiki/Portsmouth_Square",
      },
      {
        icon: "church",
        title: "Three flights up to the sea goddess",
        text:
          "Waverly Place is sometimes called Tin How Temple Street in Chinese, after this temple to the sea goddess Mazu, known in Cantonese as Tin How, Empress of Heaven. By tradition it was founded around 1852 by Day Ju, one of the first Chinese people in San Francisco, and Wikipedia calls it the oldest extant Taoist temple in the city’s Chinatown. The 1906 fire destroyed the building, but the goddess’s image, the temple bell and part of the altar survived, and in 1910 the Sue Hing Benevolent Association reopened the temple on the top floor of a new four-story building, three flights up.",
        place: "Tin How Temple",
        where: "125 Waverly Pl",
        at: [-122.40701, 37.79456],
        source: "https://en.wikipedia.org/wiki/Tin_How_Temple",
      },
      {
        icon: "movie",
        title: "An alley Hollywood keeps casting",
        text:
          "Ross Alley was laid out in 1849 beside the house of pioneer merchant Charles L. Ross and was first called Stout’s Alley, after Dr. Arthur Breese Stout, who bought that house; many sources call it the city’s oldest alley, and it was also known as Spanish Lane. On September 28, 1912, police raided the Siberia Club, a gambling hall at 25–29 Ross Alley, and arrested 46 people, and a raid days later arrested 50 more. Indiana Jones and the Temple of Doom, Big Trouble in Little China and The Karate Kid Part II all filmed here.",
        place: "Ross Alley",
        where: "Ross Alley & Washington St",
        at: [-122.40726, 37.79535],
        source: "https://en.wikipedia.org/wiki/Ross_Alley",
      },
      {
        icon: "shopping",
        title: "Chinatown's own Main Street",
        text:
          "The planning code calls Stockton Street a major transit corridor that serves as “Main Street” for the Chinatown neighborhood, and zones it a neighborhood commercial district for five blocks, from Sacramento Street to Broadway. It describes a daytime-oriented district of local and regional specialty food stores selling fresh produce, poultry, fish and meat, busiest on weekends, and it limits tourist-oriented businesses there. At this corner, Chinatown–Rose Pak Station opened on November 19, 2022, about 100 feet below the street; it is named for Rose Pak, who built community support for the Central Subway but died in 2016, before it opened.",
        place: "Stockton Street shops",
        where: "Stockton St & Washington St",
        at: [-122.40801, 37.79486],
        source: "https://dev-codelibrary.amlegal.com/codes/san_francisco/latest/sf_planning/0-0-0-26729",
      },
    ],
    walk: {
      intro:
        "A one-way walk of about 0.8 mile for visitors and would-be neighbors, from the Dragon Gate at Grant Avenue and Bush Street, a few blocks north of Market Street’s Montgomery Station, up Grant past Old St. Mary’s to Portsmouth Square, then through Waverly Place and Ross Alley to Stockton Street, ending at Chinatown–Rose Pak Station on Muni’s T Third line. Allow about an hour, and go while Stockton Street’s food markets are open.",
      miles: 0.8,
      minutes: 60,
      tip:
        "Chinatown–Rose Pak Station sits about 100 feet underground, among what SFMTA calls its deepest Muni Metro stations, so allow a few minutes to get down to the platform; the next T Third stop south is Union Square/Market Street.",
    },
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
      "When gold seekers poured in through 1849, the shore of Yerba Buena Cove curved inland as far as today's Montgomery Street, and hundreds of ships crowded the anchorage, many left without crews. Some were beached as warehouses and even a hotel; the fire of May 1851 destroyed many more, and the cove was filled with sand, burying their hulls. By the early 1870s a seawall along today's Embarcadero had closed it off, and some 45 ships are known to lie beneath downtown.\n\nBanks followed the gold. The Bank of California opened in July 1864 with D.O. Mills as president and William Ralston as cashier, and Ralston became president in 1873. When news of failed mining investments set off a run, the bank closed its doors on August 26, 1875. The next day the board took Ralston's resignation, and hours later he was found dead after his usual swim in the bay; whether he drowned by accident or took his own life remains a mystery. A 1908 newspaper counted more than half the city's larger banks on or near Montgomery Street, later called the Wall Street of the West.\n\nWhen Transamerica showed a model of its pyramid in 1969, critics warned of the Manhattanization of San Francisco, the city's own planning department lined up against it, and Telegraph Hill residents protested at the site in dunce caps; the company answered with fortune cookies holding pro-pyramid messages. It was finished in 1972. The 1985 Downtown Plan set a temporary yearly limit on new office space, which voters made permanent with Proposition M in 1986; it still releases 950,000 square feet a year.",
    facts: [
      {
        icon: "tower",
        title: "A seaport tower freed from a freeway",
        text:
          "A. Page Brown designed this terminal, which opened on July 13, 1898, with a clock tower modeled on the 12th-century Giralda in Seville; the city made it Landmark No. 90 in 1977, and it is also on the National Register of Historic Places. From 1957 the double-deck Embarcadero Freeway left only its tower in view, until the freeway, damaged in the 1989 Loma Prieta earthquake, came down in 1991. A 10-year, $110 million renovation then reopened the building in 2003 as a public marketplace.",
        place: "Ferry Building",
        where: "The Embarcadero & Market St",
        at: [-122.39366, 37.79550],
        source: "https://en.wikipedia.org/wiki/San_Francisco_Ferry_Building",
      },
      {
        icon: "factory",
        title: "A foundry father's bronze salute",
        text:
          "Peter Donahue built his business into the Union Iron Works, which Wikipedia calls the first foundry on the Pacific Coast, and his son James Mervyn Donahue left a $25,000 bequest for a memorial fountain in his father's honor. Douglas Tilden's bronze of five men straining to punch a plate was completed on March 30, 1901. Its base carries symbols of Donahue's trades: an anvil for his foundries, a propeller for shipping, and a driving wheel and connecting rod for railroads.",
        place: "Mechanics Monument",
        where: "Market St & Battery St",
        at: [-122.39917, 37.79111],
        source: "https://en.wikipedia.org/wiki/Mechanics_Monument",
      },
      {
        icon: "money",
        title: "Granite giants and a Rivera fresco",
        text:
          "Built in 1915 as a U.S. sub-treasury to J. Milton Dyer's design, this building was gutted in 1930 when Miller & Pflueger remodeled it for the stock exchange, keeping only the front, with its ten Tuscan columns and granite stairs. Ralph Stackpole carved the massive Yosemite granite sculptures out front, which one account says show the polarity of agriculture and industry, and from December 1930 to March 1931 Diego Rivera painted his fresco Allegory of California in the exchange's lunch club in the tower next door at 155 Sansome. The exchange closed its San Francisco trading floor in 2002.",
        place: "Pacific Coast Stock Exchange",
        where: "301 Pine St",
        at: [-122.40127, 37.79182],
        source: "https://noehill.com/SF/LANDMARKS/poi_pacific_coast_stock_exchange.asp",
      },
      {
        icon: "shop",
        title: "A pioneer's alley of open-air tables",
        text:
          "This one-block alley between Bush and Pine is named for Josiah Belden, a California pioneer, San Jose's first mayor and a real estate man, who owned part of this block on the east side of Kearny Street, running through to the alley. A walking tour recounts that in 1990 a café began setting a few tables out at lunch, and within a decade about a dozen restaurants lined the lane. The surrounding blocks are sometimes called San Francisco's French Quarter for their historic ties to early French immigrants.",
        place: "Belden Place restaurants",
        where: "Belden Pl & Pine St",
        at: [-122.40355, 37.79145],
        source: "https://en.wikipedia.org/wiki/Belden_Place",
      },
      {
        icon: "art",
        title: "Ship paintings in a quake survivor",
        text:
          "D.H. Burnham and Company, with Willis Polk as lead architect, designed this office tower, finished in 1903 and one of the very few tall towers to withstand the 1906 earthquake. Polk and Julia Morgan managed repairs to the heavily damaged building, and Morgan, who kept her office here from 1907 for the rest of her career, designed its skylit lobby and great hall, where maritime artist William Coulter painted five nautical murals. Like the exchange's earlier home on Battery Street, it was built with an observation tower for watching ships, since removed.",
        place: "Merchants Exchange Building",
        where: "465 California St",
        at: [-122.40215, 37.79272],
        source: "https://en.wikipedia.org/wiki/Merchants_Exchange_Building_(San_Francisco)",
      },
      {
        icon: "money",
        title: "Columns of nearly 100 tons",
        text:
          "Walter Bliss and William Faville, who had worked at McKim, Mead & White in New York, modeled this banking temple on that city's Knickerbocker Trust Company building; the 1906 earthquake and fire interrupted the work, and it was finished in 1908. Granite Corinthian columns, each weighing nearly 100 tons by one account, line three sides, along California, Sansome and Halleck streets. The 22-story tower beside it was added in 1967, and a year later the city made the banking hall Landmark No. 3.",
        place: "Bank of California Building",
        where: "400 California St",
        at: [-122.40142, 37.79335],
        source: "https://noehill.com/SF/LANDMARKS/sf003.asp",
      },
      {
        icon: "water",
        title: "A hotel built on a beached ship",
        text:
          "The whaler Niantic was hauled in and beached on this corner in 1849 and served as a storeship until a fire in May 1851 burned all but its submerged hull, which then became the foundation of the Niantic Hotel, standing until 1872. Remains of the ship were partly excavated and removed in 1978 during construction here. A 1919 plaque placed by the Native Sons of the Golden West, now at the office building on the corner, marks California Historical Landmark No. 88.",
        place: "Site of the Niantic",
        where: "Clay St & Sansome St",
        at: [-122.40172, 37.79486],
        source: "https://noehill.com/SF/LANDMARKS/cal0088.asp",
      },
      {
        icon: "park",
        title: "Redwoods where the Monkey Block stood",
        text:
          "From 1853 to 1959 this site held the four-story Montgomery Block, built by Henry Wager Halleck on a raft of redwood logs and nicknamed the Monkey Block, where financiers, lawyers and artists kept offices and apartments for more than a century. It was torn down for a parking lot, and William Pereira's 853-foot pyramid rose on part of the site from 1969 to 1972, staying the city's tallest building until the rising Salesforce Tower passed it in 2017. Beside it, Thomas Galli's Transamerica Redwood Park was planted with 80 mature redwoods from the Santa Cruz Mountains, and the Cultural Landscape Foundation counts 50 of the originals still standing.",
        place: "Transamerica Pyramid & Redwood Park",
        where: "600 Montgomery St",
        at: [-122.40271, 37.79527],
        source: "https://tclf.org/landscapes/transamerica-redwood-park",
      },
    ],
    walk: {
      intro:
        "A one-way walk for visitors and would-be neighbors from the Ferry Building, a short walk from Embarcadero Station (BART and Muni Metro) with the F streetcar out front, up Market Street and through the old banking blocks to the Transamerica Pyramid, where the 1 California bus stops at Clay and Montgomery. Allow about an hour; a weekday late morning shows the district at work.",
      miles: 1.3,
      minutes: 60,
      tip:
        "Start on a Tuesday, Thursday or Saturday and you'll find a farmers market of about 70 farmers and 50 food makers outside the Ferry Building: 10 a.m. to 2 p.m. on Tuesdays and Thursdays, and 8 a.m. to 2 p.m. on Saturdays. Holidays and events change the hours, so check before you go.",
    },
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
      "Long before anyone put “the Tenderloin” on a map, two institutions anchored these blocks. In 1892 the Hibernia Savings and Loan Society opened Albert Pissis's Beaux-Arts bank at Jones and McAllister, and in 1900 St. Boniface, a German Catholic parish dating to 1860, laid the cornerstones of its church on Golden Gate Avenue. People called the district “the Tenderloin” by the 1890s, though maps labeled it “Downtown” until the 1930s; the name is usually traced to New York's Tenderloin, where, the story goes, a police captain's bribes bought him better cuts of meat.\n\nThe 1906 earthquake and the backfires set to contain the fire destroyed almost every building here, but rebuilding came fast, with some hotels open by 1907. The Cadillac Hotel's marker calls it the first structure built in the Uptown Tenderloin afterward, and block after block of hotels and apartment houses followed, many of them single-room-occupancy hotels for single workers. In 2009, 408 of those buildings were listed on the National Register as the Uptown Tenderloin Historic District. By the 1920s the streets were known for speakeasies, gambling, restaurants and theaters, and from 1949 to 1963 the Black Hawk at Turk and Hyde hosted Miles Davis, John Coltrane and Billie Holiday.\n\nGlide Memorial Church, where the Rev. Cecil Williams joined the leadership in 1964, became headquarters of the Council on Religion and the Homosexual and sponsored the early gay liberation group Vanguard. In August 1966, three years before Stonewall, patrons of Compton's Cafeteria at Turk and Taylor fought back against police harassment. After the fall of Saigon in 1975, Vietnamese refugees settled here, and in 2004 the city named two blocks of Larkin Street Little Saigon.",
    facts: [
      {
        icon: "church",
        title: "A cattleman's memorial church",
        text:
          "The Methodist philanthropist Lizzie Glide founded this church in 1929 in memory of her husband, a cattleman, and its Mediterranean Revival building, by architect James Plachek, was finished in 1931. After the Rev. Cecil Williams joined its leadership in 1964, Glide became headquarters of the Council on Religion and the Homosexual in 1965 and sponsored Vanguard, which the National Park Service calls one of the country's first gay liberation groups. In 2022 the church was listed on the National Register in its own right.",
        place: "Glide Memorial Church",
        where: "330 Ellis St",
        at: [-122.41139, 37.78528],
        source: "https://www.nps.gov/places/glide-memorial-church.htm",
      },
      {
        icon: "park",
        title: "A park named for a friar",
        text:
          "Father Alfred E. Boeddeker Park honors the Franciscan friar who served the Tenderloin for more than 40 years and founded the St. Anthony Dining Room. The park, which runs along Eddy, Jones and Ellis streets, first opened in 1985, and it reopened in December 2014 after a rebuilding of about $9 million backed by a Trust for Public Land grant.",
        place: "Boeddeker Park",
        where: "Eddy St & Jones St",
        at: [-122.41225, 37.78420],
        source: "https://en.wikipedia.org/wiki/Boeddeker_Park",
      },
      {
        icon: "house",
        title: "Where a young Ali trained",
        text:
          "A historical marker calls the Cadillac the first structure built in the Uptown Tenderloin after the 1906 earthquake and fire, and the city lists it as Landmark No. 176. In 1924 a boxing gym opened in its former dining room, later run as Newman's Gym, and the marker says Cassius Clay, the future Muhammad Ali, trained there in 1960 after winning Olympic gold, and that Jerry Garcia lived in the hotel in 1961. The Tenderloin Museum moved into its ground floor in 2015.",
        place: "Cadillac Hotel",
        where: "380 Eddy St",
        at: [-122.41400, 37.78395],
        source: "https://www.hmdb.org/m.asp?m=63863",
      },
      {
        icon: "shop",
        title: "Little Saigon's two blocks",
        text:
          "In 2004 the city named the two blocks of Larkin Street from Eddy to O'Farrell Little Saigon. The strip grew after the fall of Saigon in 1975, when Vietnamese refugees moved into the Tenderloin and opened restaurants, barbershops and other small businesses along it, and two marble pillars topped with lions mark its entrance at Larkin and Eddy.",
        place: "Larkin Street shops",
        where: "Larkin St & Ellis St",
        at: [-122.41762, 37.78420],
        source: "https://abc7news.com/archive/6267078",
      },
      {
        icon: "church",
        title: "The city's oldest German parish",
        text:
          "Founded in 1860 and run by Franciscans since 1887, St. Boniface is the oldest German Catholic church in San Francisco, its city landmark listing says, and was long a mainstay of the city's large early German community. A Bancroft Library photograph shows its cornerstones being laid on July 28, 1900; the Romanesque Revival church was rebuilt after the 1906 earthquake and fire and finished in 1908. The city made it Landmark No. 172.",
        place: "St. Boniface Church",
        where: "133 Golden Gate Ave",
        at: [-122.41282, 37.78190],
        source: "https://noehill.com/SF/LANDMARKS/sf172.asp",
      },
      {
        icon: "money",
        title: "A bank that reopened after 1906",
        text:
          "The Hibernia Savings and Loan Society, incorporated in 1859, held a design competition in 1891, and Albert Pissis's entry became this Beaux-Arts bank, completed in 1892 and enlarged to his design in 1908. It was one of the few downtown buildings to survive the 1906 earthquake and fire, and the bank reopened within weeks. After the bank left in the 1980s the San Francisco Police Department used the building, and after years empty it was restored in 2016; it is city Landmark No. 130.",
        place: "Hibernia Bank Building",
        where: "1 Jones St",
        at: [-122.41218, 37.78098],
        source: "https://en.wikipedia.org/wiki/Hibernia_Bank_Building_(San_Francisco)",
      },
      {
        icon: "flag",
        title: "Three years before Stonewall",
        text:
          "On a night in August 1966, its exact date unrecorded, police tried to evict transgender women from Compton's Cafeteria at 101 Taylor St, and patrons fought back; accounts describe thrown coffee, plates, cups, trays and silverware, overturned tables and smashed windows. A sidewalk plaque marked the 40th anniversary in 2006, the city later made this intersection and the building Landmark No. 307, and in January 2025 the building was listed on the National Register, described in local press as the first known property so recognized for its importance to the trans community.",
        place: "Compton's Cafeteria site",
        where: "Turk St & Taylor St",
        at: [-122.41091, 37.78320],
        source: "https://www.ebar.com/story/152825",
      },
    ],
    walk: {
      intro:
        "A 1.8-mile loop for visitors and would-be neighbors from Powell Street station (BART and Muni Metro): west along Ellis Street to Glide, through the historic district's early-1900s hotels and apartment houses to Little Saigon, south down Larkin Street from O'Farrell, then east along Golden Gate Avenue and Market Street to Turk and Taylor, two blocks from the station. Allow about 80 minutes; a weekday late morning puts you on Larkin Street at lunchtime.",
      miles: 1.8,
      minutes: 80,
      tip:
        "The Tenderloin Museum, on the Cadillac Hotel's ground floor at 398 Eddy St, leads walking tours of the neighborhood's history, usually Saturdays at 2 p.m.; the museum itself was temporarily closed in mid-2026 while tours still met at its door, so check its website before you go.",
    },
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
      "Before the domes and colonnades, this ground held the Yerba Buena Cemetery, spread across land around today's U.N. Plaza, Main Library and Asian Art Museum. As the city grew, the big, unloved parcel became the favored site for a new City Hall: a state act of 1869–70 abolished the cemetery, a court challenge failed, and from 1870 to 1876 remains were moved to the new City Cemetery. Not all of them: writers on the city's lost cemeteries estimate that thousands still lie under the library and museum. The City Hall begun there in the 1870s was destroyed in the 1906 earthquake and fire.\n\nDaniel Burnham's 1905 plan had proposed a civic center at Market Street and Van Ness Avenue, with grand boulevards radiating from it, but the disaster kept it from being carried out. Voters first turned down a bond for the project; then, in March 1912, with the city planning a world's fair, they approved $8.8 million by eleven to one. Mayor James Rolph Jr. named an advisory board of architects: John Galen Howard, Frederick H. Meyer and John Reid Jr. City Hall, by Arthur Brown Jr. and John Bakewell Jr., was finished in 1915, followed by the Main Library in 1917 and the War Memorial Opera House in 1932.\n\nIn 1945 the conference that drafted the United Nations Charter met in the Opera House and the Veterans Building beside it. Today the buildings form a National Historic Landmark District. After the 1989 Loma Prieta earthquake, a new Main Library opened in 1996, a retrofitted City Hall reopened in 1999, and the old library became the Asian Art Museum in 2003.",
    facts: [
      {
        icon: "flag",
        title: "A sit-in for disability rights",
        text:
          "United Nations Plaza, finished in 1975, was designed by a joint venture led by Lawrence Halprin, John Carl Warnecke and Mario Ciampi. On its north side stands Arthur Brown Jr.'s 1936 Federal Building, where in April 1977 disability-rights activists began a sit-in of nearly four weeks; on April 28, HEW Secretary Joseph Califano signed the rules enforcing Section 504 of the Rehabilitation Act. In October 1985 protesters chained themselves to its doors, starting the ten-year AIDS/ARC Vigil, and in 2017 the building was added to the National Register on its own.",
        place: "United Nations Plaza & Federal Building",
        where: "50 United Nations Plaza",
        at: [-122.41420, 37.78000],
        source: "https://en.wikipedia.org/wiki/50_United_Nations_Plaza_Federal_Office_Building_(San_Francisco)",
      },
      {
        icon: "book",
        title: "A monument moved for books",
        text:
          "Frank Happersberger's granite-and-bronze Pioneer Monument, paid for by James Lick's estate and dedicated in 1894, first stood outside the old City Hall at Hyde and Grove streets and survived the 1906 earthquake and fire. Plans for a new Main Library moved it here in the early 1990s, when American Indian groups wanted it gone altogether; after years more of controversy, its “Early Days” figure group came down in 2018. The library behind it, by James Ingo Freed of Pei Cobb Freed and Partners with Cathy Simon of Simon Martin-Vegue Winkelstein Moris, opened in 1996.",
        place: "Pioneer Monument & Main Library",
        where: "Fulton St & Hyde St",
        at: [-122.41595, 37.77970],
        source: "https://en.wikipedia.org/wiki/Pioneer_Monument_(San_Francisco)",
      },
      {
        icon: "art",
        title: "Bones beneath the museum",
        text:
          "George Kelham designed this Beaux-Arts building as the city's Main Library, which opened in 1917. Gae Aulenti, best known for turning a derelict Beaux-Arts building in Paris into the Musée d'Orsay, led its conversion into the Asian Art Museum, which opened here on March 20, 2003. In May 2001 crews working on the conversion found remains of people buried in the old Yerba Buena Cemetery, and a 2004 report said Cypress Lawn Memorial Park in Colma had offered to take the remains of 97 people from the dig.",
        place: "Asian Art Museum",
        where: "200 Larkin St",
        at: [-122.41685, 37.78008],
        source: "https://sfstandard.com/2023/09/26/san-francisco-city-hall-haunted-cemetery/",
      },
      {
        icon: "fair",
        title: "Built for a world's fair",
        text:
          "John Galen Howard, Frederick H. Meyer and John Reid Jr., the three architects on Mayor Rolph's Civic Center advisory board, designed this hall, which opened in 1915 as the Exposition Auditorium for the Panama-Pacific International Exposition and was the San Francisco Civic Auditorium from 1916 to 1992. In 1920 it hosted the Democratic National Convention. In 1992 it was renamed for rock promoter Bill Graham, who had died the year before.",
        place: "Bill Graham Civic Auditorium",
        where: "99 Grove St",
        at: [-122.41730, 37.77850],
        source: "https://en.wikipedia.org/wiki/Bill_Graham_Civic_Auditorium",
      },
      {
        icon: "tower",
        title: "Where DiMaggio wed Monroe",
        text:
          "Arthur Brown Jr. and his partner John Bakewell Jr. designed this Beaux-Arts City Hall, completed in 1915 in time for the Panama-Pacific International Exposition. On January 14, 1954, Joe DiMaggio and Marilyn Monroe were married here, in the chambers of Judge Charles S. Peery. After the 1989 Loma Prieta earthquake damaged the building, engineers set it on base isolators, in what the structural firm Forell/Elsesser calls the largest base-isolation retrofit of its time, and it reopened in January 1999.",
        place: "City Hall",
        where: "1 Dr Carlton B Goodlett Pl",
        at: [-122.41925, 37.77925],
        source: "https://forell.com/projects/san-francisco-city-hall-seismic-retrofit",
      },
      {
        icon: "music",
        title: "A charter and a peace treaty",
        text:
          "Arthur Brown Jr. also designed the War Memorial Opera House, which opened on October 15, 1932, with Puccini's Tosca, conducted by Gaetano Merola and broadcast nationally; it has been the San Francisco Opera's home ever since. Delegates to the 1945 conference that drafted the United Nations Charter met here and in the Veterans Building next door, and signed the charter on June 26, 1945. In 1951 the peace treaty with Japan, drawn up in the Veterans Building, was signed here in the Opera House.",
        place: "War Memorial Opera House",
        where: "301 Van Ness Ave",
        at: [-122.42040, 37.77860],
        source: "https://en.wikipedia.org/wiki/War_Memorial_Opera_House",
      },
      {
        icon: "music",
        title: "The symphony gets its own hall",
        text:
          "Louise M. Davies Symphony Hall, designed by Skidmore, Owings & Merrill with Pietro Belluschi, opened in September 1980, built for $28 million to give the San Francisco Symphony a permanent home. Outside, at the corner of Grove Street and Van Ness Avenue, sits Henry Moore's Large Four Piece Reclining Figure, made in 1972–73.",
        place: "Davies Symphony Hall",
        where: "Van Ness Ave & Grove St",
        at: [-122.42000, 37.77795],
        source: "https://en.wikipedia.org/wiki/Louise_M._Davies_Symphony_Hall",
      },
      {
        icon: "shop",
        title: "Dinner before the curtain",
        text:
          "This block of Hayes Street, between Franklin and Gough, is the east end of Hayes Valley's shopping street, its storefronts holding restaurants, cafés and shops a short walk from the opera house and symphony hall. A Chronicle dining guide recalled that decades earlier, Hayes Valley's restaurants depended heavily on feeding diners before or after the opera, symphony and ballet. The city's Legacy Business Registry credits one restaurant, opened in 1979 while Davies Symphony Hall was going up, with pioneering Hayes Valley's revival as a commercial corridor.",
        place: "Hayes Street restaurants",
        where: "350 Hayes St",
        at: [-122.42246, 37.77712],
        source: "https://www.sfchronicle.com/food/restaurants/article/Where-to-dine-near-the-Symphony-Ballet-and-Opera-12404301.php",
      },
    ],
    walk: {
      intro:
        "A one-way walk for visitors and would-be neighbors that starts at Civic Center Station (BART and Muni Metro) beneath U.N. Plaza, passes the library and museum on Fulton Street, crosses Civic Center Plaza to City Hall and the War Memorial, and ends on Hayes Street. Allow about 45 minutes for 0.8 mile; check opening hours if you want to step inside City Hall, the library or the museum.",
      miles: 0.8,
      minutes: 45,
      tip:
        "Step into the Main Library to see the wall that artists Ann Hamilton and Ann Chamberlain surfaced, across three levels, with nearly 50,000 cards from the old card catalogs, which nearly 200 writers annotated by hand in more than a dozen languages. To head home from Hayes Street, Van Ness Station, at Market Street and Van Ness Avenue, is about a quarter mile southeast.",
    },
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
      "Long before the fishing boats moved here, Henry Meiggs's ruinous lumber wharf of the early 1850s ran out from the foot of Powell Street. From the Gold Rush to the turn of the century, the city's fishermen sailed lateen-rigged feluccas, built like the boats Italian fishermen had known at home. In 1900 the state set aside the waterfront between the foot of Taylor and Leavenworth streets for commercial fishing boats, and Sicilian families began arriving in large numbers. Fishermen sold part of their catch to housewives straight from their boats, and some set up stalls on the piers.\n\nIn 1907–09 the California Fruit Canners Association, later renamed Del Monte, built a cannery complex here that the Wharf's own history calls the world's largest fruit and vegetable cannery. From 1922 automobile ferries ran from the Hyde Street Pier to Sausalito, and from 1927 to Berkeley, until the new bridges emptied them; the last one left in 1938.\n\nAs the canneries and ferries faded, visitors took their place. In 1963 developer Leonard Martin bought the old Del Monte cannery to save it from demolition and turned it into shops and restaurants, and in 1988 the canners' brick warehouse became part of the new San Francisco Maritime National Historical Park. Months after the 1989 Loma Prieta earthquake, sea lions took over a Pier 39 dock, and they have stayed. The fleet still works: when a four-alarm fire destroyed Pier 45's Shed C on May 23, 2020, more than 30 crabbers lost some 8,000 traps, by the Port's count, and each October the Blessing of the Fleet is held at the fishermen's memorial chapel.",
    facts: [
      {
        icon: "water",
        title: "The sea lions came after Loma Prieta",
        text:
          "By the pier's own account, a few California sea lions began hauling out on its K-Dock soon after the Loma Prieta earthquake of October 1989, and by January 1990 more than 500 had taken it over, to the exasperation of the marina's tenants. Experts from the Marine Mammal Center recommended letting them stay, and in May and June 2024 its count topped 2,100, the most it has ever recorded.",
        place: "Pier 39 sea lions",
        where: "Beach St & The Embarcadero",
        at: [-122.41029, 37.80835],
        source: "https://www.pier39.com/sealions/",
      },
      {
        icon: "money",
        title: "The wharf that ruined its builder",
        text:
          "In the early 1850s Henry Meiggs built a wharf reaching 1,600 feet or more into the bay from the foot of Powell Street, meant to draw the lumber trade to the North Beach land he was developing; part of its site is now covered by Fisherman's Wharf, Pier 39 and Pier 45. The venture ruined him: he paid his debts with a book of signed city street-work warrants, sailed off with his family in October 1854, and went on to build railroads in Chile and Peru.",
        place: "Meiggs Wharf site",
        where: "Jefferson St & Powell St",
        at: [-122.41336, 37.80859],
        source: "https://maritimeheritage.org/vips/meiggsHenry.html",
      },
      {
        icon: "tram",
        title: "A ferry arch for freight cars",
        text:
          "The decorated tower here, finished in 1914, is the headhouse of a rail-car ferry slip: a hoisting tower that loaded freight cars on and off ferries for the waterfront's Belt Railroad, letting it trade cars with the Northwestern Pacific, Western Pacific and Santa Fe railroads. Damaged by fire in 1998, it was rehabilitated in 2002–2003 to the Secretary of the Interior's Standards, and it contributes to the Port's Embarcadero Historic District, listed on the National Register in 2006.",
        place: "Pier 43 Ferry Arch",
        where: "Pier 43",
        at: [-122.41335, 37.80929],
        source: "https://noehill.com/SF/LANDMARKS/poi_pier_43.asp",
      },
      {
        icon: "shop",
        title: "Jefferson Street, rebuilt for walkers",
        text:
          "Jefferson Street runs five blocks from Powell to Hyde through the heart of the Wharf, where fishermen once sold their catch straight from their boats and then from stalls on the piers; seafood restaurants, crab stands, shops and attractions line it today. The city rebuilt its two western blocks, Hyde to Jones, in 2013, and a second phase, funded by the Board of Supervisors in 2019, carried widened sidewalks, new trees and patterned paving east to Powell, with two-way traffic the whole way.",
        place: "Jefferson Street shops and restaurants",
        where: "Jefferson St & Taylor St",
        at: [-122.41551, 37.80832],
        source: "https://www.fishermanswharf.org/fwcbd/district-projects-data/jefferson-street-development/",
      },
      {
        icon: "flag",
        title: "The submarine that rescued POWs",
        text:
          "Moored at Pier 45 is the USS Pampanito, a World War II submarine launched at Portsmouth Naval Shipyard in July 1943 and now a National Historic Landmark; the Park Service credits it with sinking five enemy ships on six war patrols. In September 1944 it sank the transport Kachidoki Maru, then returned to the area and picked up survivors: the convoy had carried Allied prisoners of war, and its crew rescued 73 of the 2,218 Australian and British POWs who had been aboard the Kachidoki Maru and the Rakuyo Maru.",
        place: "USS Pampanito",
        where: "Pier 45",
        at: [-122.41650, 37.80980],
        source: "https://www.nps.gov/parkhistory/online_books/butowsky1/pampanito.htm",
      },
      {
        icon: "wave",
        title: "Ferry slips turned ship museum",
        text:
          "This pier began as a single-slip landing for automobile ferries to Sausalito, and its first run left on May 28, 1922; in 1927 it was extended several hundred feet, with two more slips for ferries to Berkeley. The Bay Bridge and Golden Gate Bridge ended the service, and the last ferry left on July 25, 1938. Today the pier holds the Maritime park's historic fleet, among them the Balclutha, built in Scotland in 1886, which carried California grain around Cape Horn, and the 1890 ferryboat Eureka, two of the park's five vessels named National Historic Landmarks.",
        place: "Hyde Street Pier",
        where: "Hyde St & Jefferson St",
        at: [-122.42082, 37.80800],
        source: "https://www.nps.gov/safr/learn/historyculture/hyde-street-pier.htm",
      },
      {
        icon: "factory",
        title: "The canners' warehouse, now a landmark",
        text:
          "The California Fruit Canners Association, later renamed Del Monte, built this four-story timber and brick warehouse in 1907–1909 as part of its cannery complex. The city named it a landmark in 1974, it joined the National Register of Historic Places in 1975, and the National Park Service took it over in 1978. A 2002 fire gutted its interior during renovation; it reopened in 2003, and today it holds maritime park space, with the rest leased to a hotel.",
        place: "Haslett Warehouse",
        where: "680 Beach St",
        at: [-122.42035, 37.80705],
        source: "https://noehill.com/SF/LANDMARKS/nat1975000172.asp",
      },
    ],
    walk: {
      intro:
        "A one-way waterfront stroll for visitors and would-be neighbors, from the F-line streetcar stop at Pier 39 west along the Embarcadero and Jefferson Street to the historic ships of the Hyde Street Pier, ending at the Powell-Hyde cable car stop at Hyde & Beach. It runs about 1.4 miles with short detours out onto Pier 39, Pier 45 and the Hyde Street Pier; allow about 75 minutes, more if you board the ships, and go on a weekday morning, before the midday crowds.",
      miles: 1.4,
      minutes: 75,
      tip:
        "Across from Pier 45, look for the small Fishermen's and Seamen's Memorial Chapel, built in 1978–1981 on the site of a former Coast Guard building to remember those lost at sea. It opens only a couple of hours a week, on Saturdays from 11 a.m. to 1 p.m. at last report, so check before you go.",
    },
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
      "For most of the 19th century the land south of Golden Gate Park was sand dunes, part of what San Franciscans called the “Outside Lands.” In 1887 Aurelius E. Buckingham, a former city assessor and real estate developer, laid out a residential tract around today's 5th Avenue and Lincoln Way and called it the “Sunset district”; its first buyers lived alone among the dunes. Hoodline relays another origin story, in which a neighborhood group protesting the lack of streetcar service downtown picked the name in 1895, right after a spectacular sunset. The 1894 Midwinter Exposition in the park drew crowds west of the Haight for the first time, but in the early 1900s the district filled in slowly, often in islands of two or three houses reached by plank sidewalks.\n\nA citywide renaming in 1909 turned H Street into Lincoln Way; the streets south of it run in alphabetical order: Irving, Judah, Kirkham, Lawton. A block by the park that United Railroads meant for a carhouse as early as 1907 became a streetcar storage yard instead. The Sunset Branch Library opened in 1918, and on October 21, 1928, Mayor James “Sunny Jim” Rolph led a parade of streetcars through the new Sunset Tunnel to open the N-Judah, which still runs out Judah Street to Ocean Beach.\n\nThe biggest building wave came in the 1930s. Henry Doelger, the merchant builder who covered the Sunset's dunes with thousands of single-family houses, ran his operation from a 1932 Art Deco headquarters on Judah Street, and a few blocks west the domed church of St. Anne of the Sunset rose in the early 1930s.",
    facts: [
      {
        icon: "road",
        title: "The street that was H Street",
        text:
          "Lincoln Way, along the southern edge of Golden Gate Park, was H Street until a citywide renaming in 1909; several smaller streets already named for Lincoln were renamed once the more prominent H Street took the name. The Park and Ocean Railroad ran out H Street toward the Great Highway, and historian David Gallagher of the Western Neighborhoods Project calls the street and its railroad the first route that let ordinary San Franciscans get out to Ocean Beach.",
        place: "Lincoln Way",
        where: "9th Ave & Lincoln Way",
        at: [-122.46646, 37.76585],
        source: "https://hoodline.com/2015/09/then-and-now-lincoln-way-formerly-h-street",
      },
      {
        icon: "shop",
        title: "Shops where the streetcar turns",
        text:
          "The Inner Sunset's shopping streets run seven blocks along Irving Street, from 5th to 12th Avenue, and two blocks down 9th Avenue from Lincoln Way to Judah Street, with restaurants, bakeries, bookstores, coffee shops and clothing and shoe stores clustered thickest around this corner. The strip grew up with the streetcar: local merchants formed their association in 1928, the year the N-Judah opened. The N still comes in along Irving and turns down 9th Avenue for a single block before heading out Judah Street.",
        place: "9th Avenue and Irving Street shops",
        where: "Irving St & 9th Ave",
        at: [-122.46632, 37.76380],
        source: "https://en.wikipedia.org/wiki/Sunset_District,_San_Francisco",
      },
      {
        icon: "house",
        title: "Doelger's Art Deco headquarters",
        text:
          "Henry Doelger, the merchant builder who put thousands of single-family houses on the Sunset's sand dunes, ran his business from this building, a 1932 Art Deco design by Charles O. Clausen. Its roof was raised in 1936 for another mezzanine, and in 1940 a Streamline Moderne addition on the lot to the west doubled its street frontage, giving room for design workshops, sales and administrative offices, and storage for lumber and hardware. In 2013 the city made it Landmark No. 265.",
        place: "Doelger Building",
        where: "320 Judah St",
        at: [-122.46555, 37.76235],
        source: "https://default.sfplanning.org/Preservation/landmarks_designation/Approved_Doelger_Final_LM_Report.pdf",
      },
      {
        icon: "church",
        title: "A dome over Judah Street",
        text:
          "St. Anne's parish was founded in 1904, when the Sunset was still sand dunes, and its first church, a small wood-frame building seating up to 450, went up in 1905 and was destroyed by the 1906 earthquake. The present Romanesque Revival church by Shea & Lofquist, begun in 1930, is known for its massive dome, uneven twin towers, great rose windows and the frieze over the entrance by Sister Justina Niemierski of Mission San Jose. Out front, the N-Judah runs on a slightly raised right-of-way between 9th and 19th Avenues.",
        place: "St. Anne of the Sunset",
        where: "850 Judah St",
        at: [-122.47110, 37.76250],
        source: "https://en.wikipedia.org/wiki/St._Anne_of_the_Sunset_Church_in_San_Francisco",
      },
      {
        icon: "tram",
        title: "The streetcar boneyard",
        text:
          "As far back as 1907, United Railroads planned an “H Street Carhouse” for the block bounded by Lincoln Way, Irving Street, Funston Avenue and 14th Avenue, but it was never built and the land served only as a storage yard. After the Market Street Railway merged with Muni in 1944, Muni kept parking surplus cars there until neighbors complained about the run-down, vandalized cars; Muni scrapped them, and by the late 1950s the block had been redeveloped. Funston Avenue, on its east side, was 13th Avenue until 1923, when the allegedly unlucky number gave way to the name of Gen. Frederick Funston.",
        place: "Streetcar boneyard site",
        where: "Irving St & 14th Ave",
        at: [-122.47140, 37.76390],
        source: "https://www.sfmta.com/blog/inner-sunsets-streetcar-graveyard",
      },
      {
        icon: "book",
        title: "A library where a barn stood",
        text:
          "The Sunset Branch opened on March 25, 1918, as the eighth branch of the San Francisco Public Library, on the site of an old barn that had become a neighborhood nuisance because boys used it for gun practice. It is a Carnegie library, designed by architect G. Albert Lansburgh at a cost of $43,955, and the city has designated it Landmark No. 239.",
        place: "Sunset Branch Library",
        where: "1305 18th Ave",
        at: [-122.47630, 37.76330],
        source: "https://sfpl.org/locations/sunset/sunset-library-history",
      },
    ],
    walk: {
      intro:
        "A one-way walk of about a mile for visitors and would-be neighbors, from 9th Ave & Lincoln Way at the edge of Golden Gate Park (7 and 44 buses; the N-Judah stops a block south at 9th & Irving) along the shops of 9th Avenue and Irving Street, out Judah Street and back up to Irving at 18th Avenue, a block from the 28 bus on 19th Avenue and a short walk from the N at 19th Ave & Judah St. Allow about 45 minutes; weekday mornings are quietest, weekend late mornings the busiest.",
      miles: 1,
      minutes: 45,
      tip:
        "From the library, walk two blocks east and two blocks south, about 10 minutes, to the mosaic-tiled Hidden Garden Steps, which climb 16th Avenue from Kirkham Street to Lawton Street; artists Aileen Barr and Colette Crutcher designed them, and they opened in December 2013.",
    },
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
      "In the 19th century these dunes were part of the Outside Lands, the sandy western end of San Francisco, considered inaccessible and all but uninhabitable; in 1866 Congress settled title to it against squatters' claims. In January 1878 the clipper King Philip drifted onto Ocean Beach when her anchor failed to hold, and on December 1, 1883, the Park and Ocean Railroad began running trains out H Street, now Lincoln Way, to the beach.\n\nIn 1895 the Market Street Railway started selling retired horsecars for $20, and buyers turned them into homes, cafés, shops and clubhouses on the sand. By one estimate some 2,000 people lived in this colony, nicknamed Carville, in the early 1900s, but a neighborhood improvement club saw the cars as blight, and on Independence Day 1913 it ceremonially burned the clubhouse of the Falcons, a women's bicycle club. The N-Judah streetcar reached the beach in 1928, and in 1931 jobless workers in a city program helped build Sunset Boulevard across bare dunes.\n\nBuilders then covered the sand with stucco single-family houses. The city's landmark report credits Henry Doelger with pioneering assembly-line house building, his houses built to Federal Housing Administration specifications; by one account he was the country's most prolific homebuilder from 1934 to 1941, at his peak finishing as many as two houses a day, and in 1946 the Chronicle called him “the poor man's Frank Lloyd Wright.” A city survey later found 13 scattered tracts of Picturesque Period Revival homes, 253 buildings put up from 1931 to 1938, eligible for the National Register as a historic district. On April 12, 2025, the Upper Great Highway reopened as Sunset Dunes, a two-mile car-free park.",
    facts: [
      {
        icon: "shop",
        title: "Restaurants that draw the whole city",
        text:
          "Noriega Street is one of the Outer Sunset's shopping streets, and in 2012 the city made the commercial frontage on both sides of it, eight blocks from 19th to 27th Avenue and three more from 30th through 33rd Avenue, the Noriega Street Neighborhood Commercial District. The planning code describes the street as a source of convenience goods and services for Outer Sunset residents, with a high concentration of restaurants that draw customers from throughout the city and the region.",
        place: "Noriega Street shops",
        where: "Noriega St & 31st Ave",
        at: [-122.48933, 37.75367],
        source: "https://gocodebook.com/library/us/ca/san-francisco-planning/article-7-neighborhood-commercial-districts",
      },
      {
        icon: "road",
        title: "A parkway built on bare sand",
        text:
          "Sunset Boulevard was built in 1931, while this part of the district was still undeveloped dunes; a Public Works account says a city program of street and boulevard work, employing jobless workers and run by the Bureau of Engineering, helped build it. A photo from April 2, 1931, shows bare sand on both sides of the new roadway, and the trees planted since have turned it into a park-like thoroughfare.",
        place: "Sunset Boulevard",
        where: "Sunset Blvd & Noriega St",
        at: [-122.49520, 37.75344],
        source: "https://www.streetcar.org/?p=7867",
      },
      {
        icon: "water",
        title: "A clipper ship under the sand",
        text:
          "Buried in the beach near the foot of Noriega Street lie the remains of the King Philip, a wooden clipper built in 1856 in Alna, Maine. On January 25, 1878, bound without cargo for Port Gamble, she was being towed out when her tug was called away to help another vessel; her anchor failed to hold and she drifted onto Ocean Beach. The wreck is on the National Register of Historic Places together with that of the schooner Reporter, and when the sand shifts, her timbers can reappear at low tide, as they did in 2007.",
        place: "King Philip shipwreck",
        where: "Great Hwy & Noriega St",
        at: [-122.51050, 37.75300],
        source: "https://en.wikipedia.org/wiki/King_Philip_(clipper)",
      },
      {
        icon: "park",
        title: "A highway handed to walkers",
        text:
          "Until April 12, 2025, this was the Upper Great Highway; that day its two miles from Lincoln Way to Sloat Boulevard reopened as Sunset Dunes, a car-free park billed as the largest pedestrianization project in California history, and about 13,000 people came on the first day. Sculptures, murals, seating and a bike and skate play area now line the old roadway, and beneath the Great Highway runs the Westside Transport, a 2.5-mile box that stores up to 49.3 million gallons of combined sewage and storm runoff in wet weather. The park logged about 1.7 million visits in its first year, and Proposition G on the November 3, 2026, ballot asks voters whether to let cars back on weekdays.",
        place: "Sunset Dunes",
        where: "Great Hwy & Moraga St",
        at: [-122.50930, 37.75480],
        source: "https://abc7news.com/post/great-highway-san-franciscos-newest-park-sunset-dunes-attracts-thousands-day-1/16162559/",
      },
      {
        icon: "house",
        title: "Streetcars inside a beach house",
        text:
          "In 1895 the Market Street Railway began selling retired horsecars for $20, or $10 without seats, and buyers turned them into homes, cafés, shops and clubhouses on the dunes here, a colony nicknamed Carville; the Falcons, a women's bicycle club, kept their clubhouse in one until a neighborhood improvement club ceremonially burned it on Independence Day 1913. By the 1920s little of Carville remained, though some cars were built into newer houses. This one at 1632 Great Highway has two side-by-side cable cars as its second floor and a horsecar as a guest bedroom, and Carville historian Woody LaBounty knows of no other surviving structure; it is a private home, so view it from the sidewalk.",
        place: "Carville house",
        where: "1632 Great Hwy",
        at: [-122.50859, 37.75595],
        source: "https://www.atlasobscura.com/places/last-known-carville-house",
      },
      {
        icon: "shop",
        title: "Storefronts near the last stop",
        text:
          "Cafés, restaurants and small shops cluster along the last few blocks of Judah Street before the beach, from about 44th to 47th Avenue, on the line the N-Judah has run since 1928. Photographs from the 1950s show a drugstore, a variety store, a hardware store and a grocery on the block just west of 46th Avenue, then known as a shopping center of its own.",
        place: "Judah Street shops",
        where: "Judah St & 46th Ave",
        at: [-122.50595, 37.76045],
        source: "https://missionlocal.org/2026/07/sunset-buzz-sunset-village-is-almost-open-and-the-snowy-plovers-are-back/",
      },
      {
        icon: "tram",
        title: "Speeches and leaflets by the ocean",
        text:
          "When the N-Judah opened on October 21, 1928, Mayor James Rolph piloted a streetcar on an hour-and-a-half tour from Duboce Avenue to the Ferries and then all the way back out to the end of the line here at Judah and La Playa. The ride ended at a stage set up by the Pacific, where city officials gave speeches while an airplane overhead dropped congratulatory leaflets on the crowd. Nearly a century later the N still ends here, steps from Sunset Dunes and the beach.",
        place: "N-Judah terminus",
        where: "Judah St & La Playa St",
        at: [-122.50843, 37.76033],
        source: "https://www.sfmta.com/node/13351",
      },
    ],
    walk: {
      intro:
        "A one-way walk of about 2.3 miles for visitors and would-be neighbors, from the shops of Noriega Street at 31st Avenue, on the 7 Haight-Noriega bus line, west past Sunset Boulevard to Ocean Beach, north along the Sunset Dunes park, then east on Lawton Street and up 44th Avenue to walk the shops of Judah Street back west to the end of the N-Judah line at La Playa for the ride downtown. Allow about 90 minutes, and go near low tide, when the beach is widest and the King Philip's timbers have their best chance of showing.",
      miles: 2.3,
      minutes: 90,
      tip:
        "Noriega Street runs gently downhill all the way from 31st Avenue to the beach, so the walk is easy going; save your coffee stop for the cafés on Judah Street near the finish, and bring a windproof layer for the beach.",
    },
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
      "Before the avenues were laid out, getting from the built-up city to the sea meant a ride of some six miles through rolling sand dunes, and the Outer Richmond lay at the far end of those Outside Lands. In February 1863 the Point Lobos Road Company, formed by Senator James Buckley and James Phelan, began a toll road out to the Cliff House; the city bought it in 1878 for $26,587. Down by the beach, a squatters' settlement called Mooneysville-by-the-Sea, named for the Workingmen's Party orator Con Mooney, came first, and rides such as Shoot-the-Chutes and, in 1922, the Big Dipper roller coaster followed.\n\nStreetcars came next. Adolph Sutro's electric railroad opened on February 1, 1896, running out Clement Street and down 33rd Avenue on its way to his baths, and the city's B-Geary line started with Muni's first day of service, December 28, 1912; by June 1913 its cars ran all the way to Ocean Beach. The Great Highway was built along the beach in 1929, and under George Whitney, general manager from 1926, the seaside rides grew into Playland-at-the-Beach.\n\nRussian émigrés reached San Francisco in two big waves: after the Bolshevik victory ended the Russian Civil War, and again after World War II, when the émigré communities of Shanghai and Harbin fled China as a communist takeover loomed. Between 1961 and 1965 the Russian Orthodox Church Outside Russia raised Holy Virgin Cathedral on Geary Boulevard. Playland closed on Labor Day weekend in 1972, but the 38-Geary buses that replaced the B's streetcars in 1956 still run the length of Geary.",
    facts: [
      {
        icon: "shop",
        title: "A main street on Sutro's line",
        text:
          "Clement Street runs about three miles, from Arguello Boulevard to 45th Avenue, and in 1896 Adolph Sutro underwrote an electric trolley line along its whole length that helped make it a major commercial corridor. Out here, from about 19th to 26th Avenue, it is a little less busy than the inner blocks, with shops and restaurants along the way. The city zones this stretch the Outer Clement Street Neighborhood Commercial District, which barred full-service and self-service restaurants until a 2011 ordinance opened the door to them with a conditional use permit.",
        place: "Outer Clement Street shops",
        where: "Clement St & 23rd Ave",
        at: [-122.48255, 37.78216],
        source: "https://www.tclf.org/clement-street",
      },
      {
        icon: "church",
        title: "A saint's shrine on Geary",
        text:
          "Ground was broken on June 25, 1961, for this cathedral of the Russian Orthodox Church Outside Russia, also called Joy of All Who Sorrow, completed in 1965 and described as the largest of that church's six cathedrals. Archbishop John Maximovitch, who came to San Francisco in 1962 to help finish it, died suddenly while visiting Seattle in 1966, and the Board of Supervisors amended a city ordinance so he could be interred here; glorified as a saint in 1994, he now lies in a golden shrine in the nave. The crosses on the domes came down for restoration on July 24, 2026, and went back up after the work was finished on September 4, ahead of the parish's 100th anniversary in 2027.",
        place: "Holy Virgin Cathedral",
        where: "6210 Geary Blvd",
        at: [-122.48624, 37.78043],
        source: "https://richmondsunsetnews.com/2023/08/07/outer-richmonds-landmark-cathedral-is-home-to-saints-relics/",
      },
      {
        icon: "tram",
        title: "Where the B-Geary turned",
        text:
          "Muni's B-Geary line began with the city railway's first day of service in December 1912, and by June 1913 its cars ran from downtown to Ocean Beach, turning south at this corner onto 33rd Avenue and continuing by way of Balboa Street, 45th Avenue and Cabrillo Street. Adolph Sutro's electric railroad, opened on February 1, 1896, came down 33rd Avenue from Clement Street and turned west here toward his baths; its car barn stood a block north, at 33rd and Clement. The last B streetcars ran on December 29, 1956, and the next day 38-Geary buses took over.",
        place: "33rd Avenue streetcar corner",
        where: "Geary Blvd & 33rd Ave",
        at: [-122.49330, 37.77969],
        source: "https://www.streetcar.org/end-of-the-b-geary-60-years-ago/",
      },
      {
        icon: "book",
        title: "A library won at the ballot box",
        text:
          "Residents of the Park-Presidio area felt the Richmond branch on Ninth Avenue no longer served them, and in 1930 voters approved a charter amendment raising taxes to build this branch on the site of the old Lafayette School. Designed and landscaped by architect John Reid Jr., the two-story stucco building with a red tile roof opened on April 10, 1932, as the library system's 17th branch, with 11,823 books, at a cost of $57,117.29 with its furnishings. Look up in the main rooms for the hand-stenciled ceilings; the branch reopened on June 18, 2011, after a two-year renovation.",
        place: "Anza Branch Library",
        where: "550 37th Ave",
        at: [-122.49719, 37.77856],
        source: "https://sfpl.org/locations/anza/anza-library-history",
      },
      {
        icon: "shop",
        title: "Balboa Street's movie-house blocks",
        text:
          "Balboa Street's shops, cafés and restaurants gather around this corner, where, as a local paper puts it, specialty shops and cafés abound. The movie house on the north side of the next block west opened on February 27, 1926, designed by the Reid brothers, and was split into two screens after a 1978 fire. By June 1913 the B-Geary's streetcars ran along Balboa from 33rd to 45th Avenue on their way to the beach; the tracks are gone, but the 31 Balboa bus still runs the street.",
        place: "Balboa Street shops",
        where: "Balboa St & 37th Ave",
        at: [-122.49731, 37.77571],
        source: "https://richmondsunsetnews.com/tag/outer-balboa/",
      },
      {
        icon: "fair",
        title: "Where Playland stood",
        text:
          "Playland-at-the-Beach stood here beside the Great Highway from the early 1920s until 1972; under George Whitney, its general manager from 1926, it grew to more than ten acres of rides, among them the Big Dipper roller coaster, built in 1922 and torn down in 1955. The park closed on Labor Day weekend in 1972, and it is remembered as the birthplace of the It's-It ice cream sandwich. Two markers at this corner tell its story: one dedicated by Mayor Dianne Feinstein on May 19, 1981, and a 1996 plaque recalling the bumper cars, Ferris wheel, merry-go-round and Fun House.",
        place: "Playland at the Beach markers",
        where: "La Playa St & Cabrillo St",
        at: [-122.51002, 37.77321],
        source: "https://www.hmdb.org/m.asp?m=132043",
      },
    ],
    walk: {
      intro:
        "A one-way walk of about 2.2 miles for visitors and would-be neighbors: from the 38 and 38R stop at Geary Blvd & 23rd Ave, go a block north to the shops of Clement Street, back down 26th Avenue to the gold domes on Geary, out Geary past 33rd Avenue to the Anza library, then south to Balboa Street and along the old B-Geary route on Balboa, 45th Avenue and Cabrillo to the site of Playland by Ocean Beach. Allow about 1 hour 40 minutes; late morning or early afternoon, when the shops are open, is best.",
      miles: 2.2,
      minutes: 100,
      tip:
        "The Balboa Street blocks around 37th Avenue make the walk's coffee and snack stop. At the end, Ocean Beach is a block west across the Great Highway, and the 5, 5R, 18 and 31 buses stop at La Playa & Cabrillo for the ride back; bring a warm layer for the ocean end.",
    },
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
    history:
      "In the last quarter of the 19th century this flat below Potrero Hill was known as Dutchman's Flat, and its historic district dates its story from 1867, when the Long Bridge opened and building began. The shipyards, rope factories, canneries and other industries around Potrero Point needed cheap labor, and developers answered with rows of inexpensive cottages, some built to free plans that architect John Cotter Pelton Jr. published in a daily newspaper in the early 1880s. In 1900 a quarter of the neighborhood's heads of household worked at the shipyard.\n\nNext door, Irish Hill, settled by Irish immigrants in the 1860s, held about 60 small houses and 40 boarding houses and hotels, and many residents were single men who worked at the Union Iron Works or the Pacific Rolling Mills. Quarrying for fill in the 1880s, then dynamiting from 1897 to make room for the Union Iron Works and later Bethlehem Steel, cut the hill to a mound under 50 feet high by 1918. Dogpatch itself was not devastated by the 1906 earthquake and fire.\n\nBy the late 1960s the planning department was considering demolishing the neighborhood and rezoning it for industry, and Central Waterfront jobs fell from 16,304 in 1965 to 11,004 in 1980, mostly in manufacturing and ship repair. Nobody knows for sure where the name Dogpatch came from: theories point to the Li'l Abner comic strip, a native plant called dogfennel, and stray dogs scavenging scraps from slaughterhouses. On April 18, 2003, Mayor Willie Brown signed the ordinance making about nine blocks here the city's 11th landmark district, which its survey called the oldest and most intact concentration of industrial workers' housing in the city.",
    facts: [
      {
        icon: "star",
        title: "Built to quell the rowdy",
        text:
          "City Architect John Reid Jr. designed the Potrero Police Station, finished in 1912 on the southwest corner of 20th and what was then Kentucky Street, on a site that had been an ungraded outcrop of serpentine; it served as the neighborhood's police station until the 1990s. The neighborhood association says it and the Potrero Emergency Hospital beside it, which Reid designed in 1915, were built to quell the rowdy and save the injured among the laborers of Potrero Point, then one of the West Coast's largest concentrations of industry.",
        place: "Old Potrero Police Station",
        where: "2300 3rd St",
        at: [-122.38880, 37.76040],
        source: "https://sfplanninggis.org/docs/DPRForms/4108036.pdf",
      },
      {
        icon: "park",
        title: "A company lawn turned city park",
        text:
          "The clothing company Esprit built this lawn in 1982 as a private park for its employees, and when the company prepared to leave San Francisco, a neighborhood campaign saw it handed to the city's Recreation and Park Department in 2001. It reopened on February 5, 2025, after the first major makeover in its 43-year history, an $8.5 million renovation with about $5 million from UCSF that brought an off-leash dog meadow on the north side, a dog-free meadow on the south and an accessible path that rings and crosses both.",
        place: "Esprit Park",
        where: "19th St & Minnesota St",
        at: [-122.39100, 37.76120],
        source: "https://www.sfrecpark.org/1136/Esprit-Park-Renovation-Project",
      },
      {
        icon: "art",
        title: "A dead-end street became a stage",
        text:
          "This 8,000-square-foot plaza at 19th and Indiana streets was a dead-end street until it opened in the fall of 2017 as an arts-focused pedestrian space, with live-music events in 2017 and 2018. The developer of the apartments next door had brought in CMG Landscape Architecture and Place Lab, now part of the San Francisco Parks Alliance, in 2014 to create it, though the plaza's formal Public Works permit came only in February 2019.",
        place: "Dogpatch Arts Plaza",
        where: "19th St & Indiana St",
        at: [-122.39210, 37.76190],
        source: "https://sanfranciscoparksalliance.org/our-work/projects/dogpatch-arts-plaza/",
      },
      {
        icon: "tram",
        title: "Where Muni builds cable cars",
        text:
          "A 1974 aerial photo, taken to study this area before Muni built a bus facility here, centers on two plots at 22nd and Indiana streets, just east of the I-280 freeway; by the end of 1977 they had become Woods Division, replacing aging, undersized facilities, on the former Tubbs Cordage Company property, which had sat idle for about ten years. The division remains a key part of Muni's fleet maintenance, and the San Francisco Examiner has reported that cable car construction and restoration start in its carpentry shop, which keeps the original cable car blueprints.",
        place: "Woods Division",
        where: "22nd St & Indiana St",
        at: [-122.39123, 37.75777],
        source: "https://www.sfmta.com/blog/little-patch-dogpatch",
      },
      {
        icon: "book",
        title: "A schoolhouse named for a shipbuilder",
        text:
          "The San Francisco School Department built an eight-room schoolhouse here in 1877 to serve the nearby heavy industries. In 1895 architect Thomas J. Welsh added a freestanding Classical Revival building, and the school was renamed for Irving Murray Scott, the Union Iron Works superintendent who helped pay for it; the 1877 schoolhouse was torn down in the early 1920s. The 1895 building, city Landmark No. 138 and on the National Register since 1985, is what San Francisco Heritage calls the city's oldest surviving public school building.",
        place: "Irving M. Scott School",
        where: "1060 Tennessee St",
        at: [-122.38945, 37.75850],
        source: "https://www.sfheritage.org/news/irving-m-scott-school-city-landmark-138/",
      },
      {
        icon: "house",
        title: "Cottages from free newspaper plans",
        text:
          "Architect John Cotter Pelton Jr. published his “Cheap Dwellings,” plans and specifications for inexpensive workers' houses, in the San Francisco Evening Bulletin between 1880 and 1883; historian Christopher VerPlanck called it the first and only known case of a California architect publishing free plans for workers' dwellings in a daily newspaper. The cottages at 1002 through 1014 Tennessee Street, and seven more back to back with them at 903 through 915 Minnesota Street, form a cluster of thirteen identical Eastlake-style cottages built to his designs.",
        place: "Pelton cottages",
        where: "1010 Tennessee St",
        at: [-122.38952, 37.75920],
        source: "https://www.foundsf.org/Pelton's_Cheap_Dwellings",
      },
      {
        icon: "shop",
        title: "Horsecars on Kentucky Street",
        text:
          "Third Street is Dogpatch's main commercial artery, lined with retail and service businesses, and at this corner it meets 22nd Street, whose blocks to the west hold cafés, bakeries and restaurants. In the 19th century this stretch of Third was Kentucky Street: Potrero and Bay View Railroad horsecars began running on it on May 5, 1867, electric streetcars followed in January 1895, and buses replaced them in 1941. Rail returned in 2007 with the T Third.",
        place: "Third and 22nd Street shops",
        where: "3rd St & 22nd St",
        at: [-122.38824, 37.75807],
        source: "https://en.wikipedia.org/wiki/T_Third_Street",
      },
      {
        icon: "factory",
        title: "A can factory's second life",
        text:
          "The American Can Company bought a two-block tract here in 1915 and in June 1916 finished a concrete-frame plant with room for 1,200 workers; the complex, completed in stages through 1955, ran along Third Street from 20th to 23rd Street, and after World War II the company was the neighborhood's single largest employer. The plant shut down in 1969, and in 1975 Angelo Markoulis bought the vacant complex and filled it with warehousing and light-industrial tenants, more than 300 of them by 1985.",
        place: "American Can Company factory",
        where: "2565 3rd St",
        at: [-122.38785, 37.75640],
        source: "https://www.dogpatchna.org/american-can-building",
      },
    ],
    walk: {
      intro:
        "A walk of about a mile and a quarter for visitors and would-be neighbors, from the T Third light rail's 20th Street stop west to Esprit Park, south on Indiana Street to the Muni yard, east on 22nd and up Tennessee Street past the old schoolhouse and cottages, then down Third Street's shops to the old can factory near the 23rd Street stop. Allow about 50 minutes; a weekend late morning is a good time.",
      miles: 1.2,
      minutes: 50,
      tip:
        "Save your coffee stop for 22nd Street, which the walk follows east from the Muni yard. At the end, walk north on Illinois Street, a block east of Third: just south of 20th Street, a serpentinite outcrop about 30 feet high is all that is left of Irish Hill.",
    },
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
    history:
      "Mission Bay was once just that: a tidal lagoon of San Francisco Bay inside more than 500 acres of salt marsh. Mud and sand built up at its edges, and islands of cordgrass and pickleweed grew into a marsh laced with winding sloughs fed by freshwater springs. In the mid-1860s the Long Bridge, a private toll road on pilings some 3,500 feet long, was built across the open water: starting near today's Caltrain station, it carried Fourth Street a quarter mile into the marsh, then angled straight for Potrero Point, near today's Third and 16th streets.\n\nSouthern Pacific bought most of the Mission Bay property in 1868 and 1869 and filled the bay gradually through the late 1800s and early 1900s, refuse from building projects included. Rubble from the 1906 earthquake and fire was the last big wave of fill, and the made land became rail yards and industry. Mission Creek survived as a narrow channel, crossed by drawbridges at Fourth Street in 1917 and Third Street in 1933, and in the early 1960s a small houseboat community began to take shape on it.\n\nMuch of the old rail yard passed to Catellus Development Corporation, spun off in the aborted merger of the Southern Pacific and Santa Fe railroads. In the fall of 1998 the Board of Supervisors adopted redevelopment plans for Mission Bay North and South, about 303 acres in all, and in 1999 UCSF broke ground on a 43-acre research campus whose first building opened in 2003. Chase Center followed in 2019, and in 2024 two waterfront parks opened on the bay: China Basin Park in April and Bayfront Park in October.",
    facts: [
      {
        icon: "bridge",
        title: "The Long Bridge's last link",
        text:
          "SFMTA traces a crossing here to the Long Bridge, whose first span it says was completed in 1867, and notes that the drawbridge over Mission Creek is the part of that route still in place, though not in its original form. Today's 94-foot span went up in 1917 to a design by J.B. Strauss, and a Caltrans-based historic-bridge inventory calls it California's only Strauss overhead-counterweight bascule bridge. Formally the Peter R. Maloney Bridge, it was retrofitted in 2006 for earthquakes and to carry Muni's T Third light rail, whose trains still cross it.",
        place: "Fourth Street Bridge",
        where: "4th St & Channel St",
        at: [-122.39236, 37.77500],
        source: "https://www.sfmta.com/blog/bridge-nowhere",
      },
      {
        icon: "house",
        title: "A floating neighborhood",
        text:
          "About 20 floating homes line this dock on the south shore of Mission Creek, just under the I-280 freeway, in a community that began taking form in the early 1960s. The Port of San Francisco, which leases the berths, has capped the harbor at 55 slips, with boats in the other 35, and the leases run through 2055. The houseboats are private homes, so enjoy them from the creek path.",
        place: "Mission Creek houseboats",
        where: "300 Channel St",
        at: [-122.39570, 37.77200],
        source: "https://sfstandard.com/2023/11/04/san-francisco-floating-home-for-sale-rare-find/",
      },
      {
        icon: "shop",
        title: "A main street that took its time",
        text:
          "Fourth Street's 1100 block, running south from Channel Street toward this corner, became the new neighborhood's shopping block, but retail was slow to arrive as Mission Bay filled in. In 2017 the Chronicle reported dining and retail beginning to stir at last, as an apartment complex on the block leased its ground floor to five businesses, among them a café, a spa, a frame shop and two restaurants, and a 10,000-square-foot neighborhood grocery opened at the Channel Street corner at the end of 2018.",
        place: "Fourth Street shops",
        where: "4th St & Mission Bay Blvd North",
        at: [-122.39087, 37.77106],
        source: "https://www.sfchronicle.com/politics/article/Dining-and-retail-begin-to-stir-at-last-in-11292649.php",
      },
      {
        icon: "book",
        title: "A campus on donated land",
        text:
          "UCSF broke ground here in 1999 on 43 acres of donated land: Catellus agreed in 1997 to give 30 acres, and by October 1998 the Board of Supervisors had voted unanimously to donate the rest. The first building, the 434,000-square-foot Genentech Hall, opened in 2003, and the campus was dedicated on October 28 that year; UCSF billed it as the country's largest biomedical university expansion.",
        place: "UCSF Mission Bay campus",
        where: "4th St & 16th St",
        at: [-122.39081, 37.76682],
        source: "https://ucsf.edu/news/2013/01/129181/ucsf-milestones-mission-bay",
      },
      {
        icon: "star",
        title: "An arena with its own plazas",
        text:
          "The Golden State Warriors' privately financed arena opened in September 2019 with 18,064 seats. Around it, the Thrive City district was laid out with 3.2 acres of publicly accessible plazas and open space and 100,000 square feet of leasable restaurant and retail space. Muni's UCSF/Chase Center platform is on Third Street out front.",
        place: "Chase Center & Thrive City",
        where: "3rd St & Warriors Way",
        at: [-122.38931, 37.76888],
        source: "https://chasecenter.com/news/1MxI8XiKGf4YmFeGKeyecx",
      },
      {
        icon: "park",
        title: "A park built for a changing climate",
        text:
          "Nearly ten years in the making as part of the Mission Bay plan, this 5.4-acre park between Chase Center and the bay opened on October 22, 2024. The city says it was designed to be resilient to climate change, with bioretention gardens that manage stormwater runoff and coastal scrub plantings, and some of its structures are made from steel reclaimed from the old Bay Bridge. A section of the Bay Trail runs through it.",
        place: "Bayfront Park",
        where: "Terry A Francois Blvd & 16th St",
        at: [-122.38605, 37.76706],
        source: "https://www.sf.gov/news/mayor-london-breed-celebrates-grand-opening-bayfront-park-mission-bay",
      },
      {
        icon: "wave",
        title: "A park on 1906 rubble",
        text:
          "More than 15 years in the making, this five-acre park opened on April 25, 2024, just across from Oracle Park, anchoring Mission Rock, the district the Port and the Giants' and Tishman Speyer's Mission Rock Partners are building on old ballpark parking lots. Its builder, Webcor, says the lot stood on rubble pushed into the bay after the 1906 earthquake, so heavy dirt was swapped for foam and lightweight cellular concrete to limit sinking. The name Mission Rock first belonged to an island in the bay; Pier 50, a short way down the shore, was extended in the 1940s to surround it.",
        place: "China Basin Park",
        where: "Terry A Francois Blvd & Toni Stone Crossing",
        at: [-122.38810, 37.77620],
        source: "https://www.webcor.com/webcor-articles/webcor-delivers-state-of-the-art-china-basin-park-transforming-sf-waterfront",
      },
      {
        icon: "bridge",
        title: "A city landmark drawbridge",
        text:
          "This drawbridge on Third Street opened on May 12, 1933, at a ceremony attended by Mayor Angelo Rossi. It is a heel-trunnion steel truss bascule designed by the Strauss Engineering Company, the firm behind the Golden Gate Bridge: its span tips up on a pivot, one end weighted to counterbalance the other. It is San Francisco Landmark No. 194 and carries the name of baseball's Lefty O'Doul.",
        place: "Lefty O'Doul Bridge",
        where: "3rd St & Berry St",
        at: [-122.39025, 37.77667],
        source: "https://en.wikipedia.org/wiki/Lefty_O%27Doul_Bridge",
      },
    ],
    walk: {
      intro:
        "A one-way walk of about 2.5 miles for visitors and would-be neighbors, from the 4th & King Caltrain station (also served by Muni's N and T): over Mission Creek, out along the creek path to the houseboats and back, south down Fourth Street's shopping block to the UCSF campus and Chase Center, then north past the bayfront parks to the Lefty O'Doul Bridge, a short walk from the N at 2nd & King. Allow about 90 minutes; a weekday morning with no game or concert is calmest.",
      miles: 2.5,
      minutes: 90,
      tip:
        "Check the Chase Center and Giants schedules before you go: on game and concert days crowds fill Third Street and the T line. The Fourth Street shops, about a third of the way in, are the natural place for a break.",
    },
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
    history:
      "In the 1850s South Beach was a real shore. Along it and at Steamboat Point, a headland at the northeastern edge of Mission Bay named for its shipyards, the boatyards of John G. North, Domingo Marcucci and Patrick H. Tiernan built and repaired many of the steamboats and ferries that served the bay and its rivers; North opened his first yard at Steamboat Point in 1854. By the mid-1860s the yards had moved south across Mission Bay, and the shoreline was rapidly filled.\n\nWarehouses rose on the new land. In 1867 the Pacific Mail Steamship Company, which carried mail, passengers and trade between the U.S. and Asia, built the brick Oriental Warehouse for imports such as coffee, tea, rice and silk. A few buildings survive from before the 1906 earthquake, but most of the brick and concrete-frame lofts of today's South End Historic District went up between 1906 and 1929, tied to the ships and the railroads. Piers 38 and 40 belong to the Embarcadero Historic District, three miles of waterfront listed on the National Register in May 2006.\n\nBy 1980 the Redevelopment Agency's Rincon Point–South Beach plan was under review; the agency studied a small-boat harbor and park here in 1982 and built South Beach Harbor in 1986. The city designated the South End Historic District in 1990, and in 1996 the Oriental Warehouse, its brick walls left unsafe by the 1989 earthquake and its roof burned in 1995, was converted to lofts. The Giants' ballpark opened at Third and King on April 11, 2000, and in July 2013 the Brannan Street Wharf turned the sites of two old piers into a park.",
    facts: [
      {
        icon: "money",
        title: "A landmark from the China trade",
        text:
          "The Pacific Mail Steamship Company, which ran mail, passenger and trade service between the U.S. and Asia, built this brick warehouse in 1867 for imports such as coffee, tea, rice and silk, and the city made it Landmark No. 101 in 1977. The 1989 Loma Prieta earthquake left its brick walls unsafe and a 1995 fire burned the old roof; in a 1996 conversion a new structure built inside the brick shell became 66 lofts, so admire it from the sidewalk.",
        place: "Oriental Warehouse",
        where: "650 Delancey St",
        at: [-122.38969, 37.78278],
        source: "https://en.wikipedia.org/wiki/Oriental_Warehouse",
      },
      {
        icon: "factory",
        title: "Older than the 1906 earthquake",
        text:
          "A few of the South End Historic District's warehouses predate the 1906 earthquake, among them John Hooper's South End Grain Warehouse at 64–72 Townsend, built in 1874; most went up between 1906 and 1929, brick and concrete-frame lofts tied to the ships and railroads. The city designated the district, six blocks and 84 parcels, in 1990, and Planning counts 55 contributing buildings. On the same block, the 1882 California Warehouse at 88 Townsend was gutted in the early 2000s for more than a hundred homes.",
        place: "South End warehouses",
        where: "64 Townsend St",
        at: [-122.39035, 37.78139],
        source: "https://noehill.com/SF/LANDMARKS/sf_south_end.asp",
      },
      {
        icon: "shop",
        title: "Restaurants on the baseball calendar",
        text:
          "Restaurants and bars line Second Street in the blocks north of this corner, where Second ends at King Street across from the ballpark. A restaurant opened on this corner in 1998, two years before the park, and business follows the baseball calendar: as one season ended, the Chronicle reported, several nearby restaurants closed, among them two big sports bars facing the park.",
        place: "Second and King Street restaurants",
        where: "2nd St & King St",
        at: [-122.38979, 37.77969],
        source: "https://www.sfchronicle.com/food/restaurants/article/King-Street-blues-Restaurants-struggling-in-a-14510210.php",
      },
      {
        icon: "star",
        title: "Twenty-four palms for number 24",
        text:
          "William Behrends' bronze of Willie Mays, commissioned by Giants managing partner Peter Magowan when ground was broken in 1997, was unveiled at the ballpark's main entrance on March 31, 2000, ringed by 24 palm trees for the uniform number the Giants retired. The park, at 24 Willie Mays Plaza, opened on April 11, 2000, and is cited as the first privately financed major league ballpark since Dodger Stadium in 1962; its right-field wall is 24 feet high in Mays' honor.",
        place: "Willie Mays Plaza",
        where: "3rd St & King St",
        at: [-122.39149, 37.77817],
        source: "https://en.wikipedia.org/wiki/Statue_of_Willie_Mays",
      },
      {
        icon: "water",
        title: "A cove named by two sportswriters",
        text:
          "The water beyond the right-field wall is officially China Basin, the mouth of Mission Creek. Mark Purdy of the San Jose Mercury News proposed naming it for Willie McCovey, and fellow sportswriter Leonard Koppett suggested the more lyrical “McCovey Cove,” a name that has never become official. Barry Bonds hit the first splash hit, a Giants home run that lands in the cove on the fly, on May 1, 2000, and from the Portwalk between the wall and the water, passers-by can glimpse the game through openings in the wall.",
        place: "McCovey Cove & the Portwalk",
        where: "Portwalk along the right-field wall",
        at: [-122.38930, 37.77760],
        source: "https://en.wikipedia.org/wiki/McCovey_Cove",
      },
      {
        icon: "wave",
        title: "A harbor the city built",
        text:
          "The San Francisco Redevelopment Agency, which had studied a small-boat harbor and park here in 1982, built this 700-slip harbor in 1986 on land leased from the Port. When the agency was dissolved in July 2012, the Port took over the harbor, Pier 40 and its buildings, and the transfer, state boating loans included, was finalized in April 2019. Pier 40 and its neighbor Pier 38 are contributing piers of the Embarcadero Historic District.",
        place: "South Beach Harbor & Pier 40",
        where: "Pier 40",
        at: [-122.38778, 37.78150],
        source: "https://www.sfport.com/sites/default/files/Commission/Documents/Item%2012A%20%20South%20Beach%20Harbor%202.14.20%20v.2.pdf",
      },
      {
        icon: "park",
        title: "A park where two piers stood",
        text:
          "Opened in July 2013 on the former sites of Piers 34 and 36, between Pier 30-32 and Pier 38, this $26 million park adds about 57,000 square feet of public open space over the water. About 830 feet long, it has a neighborhood lawn in a raised planter ringed by a seat wall, a waterside walkway with seating and picnic tables, and a shade structure.",
        place: "Brannan Street Wharf",
        where: "The Embarcadero & Brannan St",
        at: [-122.38750, 37.78380],
        source: "https://www.baycrossings.com/?p=11690",
      },
    ],
    walk: {
      intro:
        "A loop of about 1.3 miles for visitors and would-be neighbors, starting and ending at the N Judah's Embarcadero & Brannan stop: past the old warehouses of the South End, along the restaurants of Second and King streets, around the ballpark by McCovey Cove and back up the Embarcadero past South Beach Harbor. Allow about an hour; a weekday morning with no game is calmest, a game day the liveliest.",
      miles: 1.3,
      minutes: 60,
      tip:
        "Check the Giants' schedule before you go: game days bring big crowds to King Street and the Portwalk. For a rest at the end, the lawn on the Brannan Street Wharf is a few steps from the Embarcadero & Brannan stop.",
    },
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
    history:
      "Rincón is Spanish for “corner.” Rincon Point, which ran roughly along today's Spear Street between Harrison and Folsom, marked the southern corner of Yerba Buena Cove, and the hill rising behind it took its name; landfill has since buried the point. After the Gold Rush the hill was built up as a fashionable residential neighborhood, and in the 1860s, as the state's landmark plaque recalls, it was home to William Tecumseh Sherman, William C. Ralston, William Gwin and H. H. Bancroft.\n\nIn 1869 the Second Street Cut sliced a canyon through the hill, split the neighborhood in two and marked the beginning of the end of its fashionable era. By the 1880s, the plaque says, the partly leveled hill was a working-class district. A report after the 1906 fire recommended removing the hill entirely; the idea, revived in 1913 and 1927, discouraged builders, and the area was slowly built up instead as an industrial and maritime district.\n\nOn July 5, 1934, the “Bloody Thursday” of the waterfront strike, strikers gathered on the hill, near the Bay Bridge's rising western anchorage, and charged down toward police and strikebreakers in what became known as the Battle of Rincon Hill. In 1935 the city lowered the summit by 10 feet and cleared several blocks, tenements, shacks and an elementary school among them, for the bridge's western approach. The city's 2005 Rincon Hill Plan rezoned the area for slender residential towers of 250 to 550 feet, the tallest at the top of the hill, and the local community benefit district, renamed in 2017, now calls the neighborhood The East Cut, after the Second Street Cut.",
    facts: [
      {
        icon: "coffee",
        title: "Roasting coffee on Rincon Point",
        text:
          "Rincon Point, the “corner” of Yerba Buena Cove that named the hill, ran roughly along Spear Street from Harrison to Folsom, the western edge of this block. Hills Bros. moved its coffee operations here in 1926, into a Romanesque Revival plant by architect George W. Kelham that is now San Francisco Landmark No. 157; a 1950s addition was razed in the late 1980s for the 21-story Hills Plaza tower. The company left in 1997, and the plant, still crowned by its big Hills Bros. Coffee sign, has since housed offices.",
        place: "Hills Bros. Coffee Plant",
        where: "2 Harrison St",
        at: [-122.38905, 37.78970],
        source: "https://pcad.lib.washington.edu/building/1355",
      },
      {
        icon: "water",
        title: "Fireboats at the foot of Harrison",
        text:
          "The pier's 1915 firehouse, San Francisco Landmark No. 225, was built at the edge of the Panama-Pacific International Exposition and moved here by barge after the fair, and the fireboat Phoenix, long based here, is credited with helping save the Marina District after the 1989 Loma Prieta earthquake by serving as a floating hydrant. The city's new two-story fireboat station at the same pier sits on a 173-by-96-foot steel float that rises and falls with the tides. It was built on Treasure Island and pushed across the bay overnight, and the Fire Department calls it the first floating firehouse in the Western Hemisphere.",
        place: "Fireboat Station 35",
        where: "The Embarcadero & Harrison St",
        at: [-122.38792, 37.78989],
        source: "https://en.wikipedia.org/wiki/Phoenix_(fireboat)",
      },
      {
        icon: "bridge",
        title: "The hill's story on one plaque",
        text:
          "California Historical Landmark No. 84 sums up the hill in three eras: a fashionable neighborhood in the 1860s, a working-class district by the 1880s, and today “nearly invisible beneath the Bay Bridge.” The plaque was first mounted in 1981 on the retaining wall of St. Mary's Hospital, built on the hill in 1861 and destroyed in the 1906 fire. When that wall was removed, a replacement plaque was installed here in October 2011, about 900 feet northeast of the original spot.",
        place: "Rincon Hill plaque",
        where: "Beale St & Bryant St",
        at: [-122.39010, 37.78632],
        source: "https://www.hmdb.org/m.asp?m=135535",
      },
      {
        icon: "shop",
        title: "The street planned for shops",
        text:
          "The 2005 Rincon Hill Plan put the neighborhood's shops and services along Folsom Street and required see-through storefronts there, and a city streetscape project from Second to Spear set out to make it a neighborhood “main street,” with widened sidewalks, rain gardens and protected bike lanes on part of it. Across the street, the Folsom side of the Transbay Block 8 towers is lined with retail shops and residential lobbies. The East Cut district's logo, an abstract E, gives its middle bar to Folsom Street, between bars for Rincon Hill and the Transbay district.",
        place: "Folsom Street shops",
        where: "Folsom St & Fremont St",
        at: [-122.39346, 37.78795],
        source: "https://sfplanning.org/project/rincon-hill-plan",
      },
      {
        icon: "factory",
        title: "A century at the forge",
        text:
          "Fred V. Wilbert opened a forge in this two-story wood-frame building in 1912; Edwin A. Klockars joined him in 1928 and owned the shop from 1938 to 1970, and his son-in-law Tony Rosellini kept it running until 2017. Klockars' tools reportedly went into building both the Bay Bridge and the Golden Gate Bridge. The little shop is San Francisco Landmark No. 149.",
        place: "Klockars Blacksmith Shop",
        where: "443 Folsom St",
        at: [-122.39411, 37.78747],
        source: "https://www.theclio.com/entry/88758",
      },
      {
        icon: "park",
        title: "A pocket park the towers paid for",
        text:
          "The Rincon Hill Community Improvements Fund, paid for by fees on new development, bought this lot in 2007, and the Recreation and Park Department opened the $4.5 million, 3,500-square-foot Guy Place Mini Park here on July 20, 2020. It is laid out as three outdoor “rooms,” with living columns of native California grapevines and eight river birch and dogwood trees, behind a water-cut steel gate and fence by a local artist chosen through the city's Arts Commission.",
        place: "Guy Place Mini Park",
        where: "4 Guy Pl",
        at: [-122.39422, 37.78668],
        source: "https://sf.streetsblog.org/2020/07/20/guy-place-mini-park-opens",
      },
      {
        icon: "tower",
        title: "A sailors' hall and a sloshing tower",
        text:
          "The Sailors' Union of the Pacific put up its nautical, Streamline Moderne office building at 450 Harrison in 1950, designed by William Gladstone Merchant, who also drew Pacific House, the theme building of San Francisco's 1939–40 world's fair; its Maritime Hall was a concert venue from 1995 to 2001, and city planners list the building as a proposed landmark. Just south, at 425 First Street, two water tanks at the top of the 2008 One Rincon Hill South Tower slosh to damp its sway in the wind, and a state strong-motion study calls it the first building in California with a liquid tuned mass damper.",
        place: "Sailors' Union hall and One Rincon Hill",
        where: "Harrison St & 1st St",
        at: [-122.39284, 37.78613],
        source: "https://pcad.lib.washington.edu/building/24070",
      },
      {
        icon: "road",
        title: "The cut that split the hill",
        text:
          "Second Street climbed straight over the hill, so wagons took the flatter but slower, costlier Third Street, bypassing the Second Street property of Assemblyman John Middleton, who pushed a state bill to cut the grade. The plan lowered Second Street for the three blocks between Howard and Bryant, deepest here, 87 feet at Harrison Street, where a bridge carried Harrison across the new canyon. The 1869 cut split the neighborhood in half and drove its wealthier residents away.",
        place: "Second Street Cut",
        where: "2nd St & Harrison St",
        at: [-122.39506, 37.78438],
        source: "https://geologywriter.com/?p=1575",
      },
    ],
    walk: {
      intro:
        "A one-way walk of about 1.2 miles for visitors and would-be neighbors, starting at the N Judah's Folsom Street stop on the Embarcadero: past the coffee plant and the fireboat pier, south under the Bay Bridge and in along Bryant Street to Beale, up Beale to the shops of Folsom Street, then up First Street toward the top of the hill at Harrison and along Harrison to Second Street, where Muni's 12 stops at the corner. Allow about an hour, in daylight so the plaques are easy to read.",
      miles: 1.2,
      minutes: 60,
      tip:
        "After dark, come back to the Embarcadero, where the Bay Bridge passes overhead: The Bay Lights, Leo Villareal's LED artwork along the western span, came back on March 20, 2026, after going dark in 2023, rebuilt to shine nightly from dusk to dawn.",
    },
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
    history:
      "Before it was a park, this neighborhood's hill was called Rocky Hill or Rock Hill. In 1899 George and Harry Gray, whom the Chronicle has called the city's most prolific and morally challenged quarrymen, began excavating it for a quarry and brick factory. Their works removed tons of rock and turned out tens of thousands of bricks; those laid in cable car track beds were later judged substandard and replaced. Neighbors were enraged when falling rocks injured adults and children and flying debris damaged homes, and the brothers faced repeated lawsuits.\n\nQuarrying here ended after George Gray was shot dead by a former worker demanding back wages at the brothers' quarry at 30th and Castro streets, and by the 1920s both quarry and brickworks had closed. By October 1925 the Vulcan Stairway climbed the slope from Ord Street. In 1928 Josephine Randall, a Stanford-trained zoologist and the city's first Superintendent of Recreation, proposed buying the hill's 16 acres for recreation. It took 13 years, but in 1941 the city paid $27,333 and named the land Corona Heights.\n\nRandall's Junior Museum, founded in 1937 in the city's old jail, moved up the hill in 1951 into a new building bearing her name, and the museum, tennis courts and playing fields all sit on former quarry ground. The quarrying also laid bare a polished fault face that climbers now scale. In 1986 the park's entrance meadow and a path were named for Bill Kraus, a gay-rights activist and political aide who died that year. Today much of the park is a city natural area, mostly grassland, that blooms with native wildflowers each spring.",
    facts: [
      {
        icon: "stairs",
        title: "A stairway finished in 1925",
        text:
          "This public stairway climbs west from Ord Street up to Levant Street, and a city Public Works photograph dated October 23, 1925 shows it finished, looking west up the steps from Ord. Some of the houses along it, such as 1 Vulcan, have no street frontage at all: their addresses are on the stairway, and the only way to the front door is on foot.",
        place: "Vulcan Stairway",
        where: "Ord St & Vulcan Stairway",
        at: [-122.44140, 37.76347],
        source: "https://test.opensfhistory.org/photo/wnp36.03288",
      },
      {
        icon: "factory",
        title: "The brickworks in a 1912 photo",
        text:
          "A photograph dated March 18, 1912 looks west along a still-unpaved States Street toward the Gray Brothers' brick factory on the hill's south side, with Mount Olympus behind it; by 2020 tennis courts stood on the factory's site, and a record from the same day places the quarry at 208 States. In a companion view looking east down the street, some of the houses on the right, starting with 155 States, still stand. Bricks from these works that went into cable car track beds were later judged substandard and had to be replaced.",
        place: "States Street",
        where: "208 States St",
        at: [-122.44013, 37.76411],
        source: "https://test.opensfhistory.org/photo/wnp36.00140",
      },
      {
        icon: "park",
        title: "A meadow named for Bill Kraus",
        text:
          "The triangular lawn at this park entrance is Bill Kraus Meadow, and Bill Kraus Pathway leads from it toward the park's off-leash dog area; both were dedicated in his honor in 1986. Kraus, a gay-rights activist, was a political aide to Congressman Phillip Burton and, after Burton's death in 1983, to his widow and successor, Sala Burton, and he died in 1986 at 38 while battling AIDS. A bench with a plaque in his honor stands at the end of the field.",
        place: "Bill Kraus Meadow",
        where: "Roosevelt Way & Museum Way",
        at: [-122.44102, 37.76536],
        source: "https://sfrecpark.org/450/Corona-Heights-Trail",
      },
      {
        icon: "art",
        title: "The jailhouse museum's hilltop home",
        text:
          "Josephine Randall founded the Junior Museum in 1937 in the city's old jail, and on September 23, 1951 it reopened here in a new building paid for by a 1947 bond; to name it for her, the Recreation and Park Commission suspended its rule against naming buildings after living people. In the basement, the Golden Gate Model Railroad Club built the Sierra Nevada and Pacific, a 2,100-square-foot layout with about 800 feet of track, and turned it over to the museum's nonprofit friends group in December 2015. A volunteer software engineer then added digital controls so the trains can run unattended whenever the museum is open.",
        place: "Randall Museum",
        where: "199 Museum Way",
        at: [-122.43813, 37.76439],
        source: "https://en.wikipedia.org/wiki/Randall_Museum",
      },
      {
        icon: "star",
        title: "Rock Hill, later called the Fist",
        text:
          "Before the city bought it in 1941 and named it Corona Heights, this hill was known as Rocky Hill or Rock Hill, and later as the Fist, for the chert boulders at its peak, more than 500 feet above sea level. In 1928 Josephine Randall coaxed James D. Phelan, Sigmund Stern and John McLaren up to this crest, and they took her side in her push to buy it. In spring, Rec and Park says, the grassland blooms with checkerbloom, California poppy, Douglas iris, mule's ears and Johnny jump-up, the only host plant of the callippe silverspot butterfly.",
        place: "Corona Heights summit",
        where: "Top of Corona Heights Park",
        at: [-122.43937, 37.76489],
        source: "https://en.wikipedia.org/wiki/Corona_Heights_Park",
      },
      {
        icon: "quake",
        title: "A polished fault you can climb",
        text:
          "The rock face overlooking Peixotto Playground is a slickenside, a surface of the hill's chert polished along a fault as the rocks rubbed against each other, and later uncovered by quarrying; KQED's Quest calls it one of the largest such exposures in the world. KQED describes the 60-foot slab as open to climbing, mostly on top ropes, and climbers know it as the Beaver Street Wall.",
        place: "Peixotto Playground & Beaver Street Wall",
        where: "Roosevelt Way & 15th St",
        at: [-122.43950, 37.76649],
        source: "https://www.kqed.org/news/12094577/the-san-francisco-rock-climbing-spot-known-for-its-shiny-surface",
      },
    ],
    walk: {
      intro:
        "A loop of about 1.6 miles and 80 minutes with stops, for visitors and would-be neighbors: from Castro Station (Muni Metro K, L and M; the F streetcar ends a few steps away), walk west on 17th Street to Ord Street, climb the Vulcan Stairway, take a short detour down States Street to the old brickworks site, follow Roosevelt Way to Museum Way and the Randall Museum, take the trail over the summit and down to 15th Street, then walk back down 15th and Castro streets. Go on a clear day, ideally in spring, when the hill's grassland is in bloom.",
      miles: 1.6,
      minutes: 80,
      tip:
        "Rec and Park's Corona Heights Trail page has reported the North and Peak trails closed after storm damage, so check it before you go; if they are still closed, skip the summit and follow Roosevelt Way from Museum Way down to 15th Street. The hill itself is residential: for shops, cafés and restaurants, head down Castro Street across Market Street toward 18th Street, or follow Market Street east from Castro.",
    },
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
    history:
      "Bayview's first big industry was meat. After an 1868 ordinance banned slaughtering in the city proper, a group of butchers set up a “Butchers' Reservation” on 81 acres of tidal marshland near Islais Creek, and by 1877 all 18 of San Francisco's slaughterhouses stood in the district, one of whose edges was Railroad Avenue, later folded into Third Street. Houses went up on the surrounding grid, two of them now city landmarks, and in 1888 a Masonic lodge's members built the South San Francisco Opera House, named before the city of South San Francisco incorporated.\n\nElectric streetcars arrived on Third Street in 1895. After the 1906 earthquake, the city dumped debris from fallen buildings around Islais Creek, and much of the creek was diverted into culverts and buried. The butchers' trade faded as the district grew more residential, though the last slaughterhouse held on until 1971.\n\nWorld War II remade the neighborhood. The Navy bought the Hunters Point drydocks in December 1939, and as war work drew Black workers west, San Francisco's Black population leapt from about 5,000 in 1940 to 32,000 in 1945. Restrictive covenants kept Black families out of most of the city, and when urban renewal razed homes in the Fillmore, many moved here; by 1960 Black residents were a majority in Bayview–Hunters Point. Third Street became its main street: Sam Jordan opened his tavern there in 1959 and in 1963 became the first African American to run for mayor of San Francisco, and the old opera house was renamed for producer, playwright and actress Ruth Williams. Rail returned to Third Street in 2007 with the T Third.",
    facts: [
      {
        icon: "cow",
        title: "Where the butchers were banished",
        text:
          "After an 1868 ordinance banned slaughtering in the city proper, a group of butchers set up a “Butchers' Reservation” on 81 acres of tidal marshland near Islais Creek, and by 1877 all 18 of San Francisco's slaughterhouses were there; Railroad Avenue, today's Third Street, was one of the district's edges. In 1888 city inspectors reported a foul smell, decaying animal parts and live pigs under the slaughterhouses. The trade declined after the 1906 earthquake, and the last slaughterhouse closed in 1971.",
        place: "Butchertown",
        where: "3rd St & Evans Ave",
        at: [-122.38797, 37.74261],
        source: "https://en.wikipedia.org/wiki/Islais_Creek",
      },
      {
        icon: "beer",
        title: "The Mayor of Butchertown's tavern",
        text:
          "Sam Jordan, a longshoreman who had boxed in the Golden Gloves, bought this building, renovated it and reopened it in 1959 as Sam Jordan's Tavern. In 1963 he became the first African American to run for mayor of San Francisco, and by his death in 2003 he was known as the “Mayor of Butchertown,” after the neighborhood's old trade. The city designated the building Landmark No. 263 in 2013; the bar closed in 2019 after 60 years, and the building was sold in 2023.",
        place: "Sam Jordan's Bar",
        where: "4004 3rd St",
        at: [-122.38886, 37.74108],
        source: "https://en.wikipedia.org/wiki/Sam_Jordan%27s_Bar",
      },
      {
        icon: "road",
        title: "An alphabet you can walk",
        text:
          "From this corner south, Third Street crosses Bayview's avenues in alphabetical order: Kirkwood, La Salle, McKinnon, Newcomb, Oakdale, Palou, Quesada, Revere. KALW's “Hey Area” tied the grid's names to the street renaming the Board of Supervisors took up after the 1906 earthquake, when names repeated or changed from block to block, and asked why one of Bayview's alphabetical runs has no O street; historian John Freeman concluded that “it was just left out, accidentally.”",
        place: "Bayview's alphabet avenues",
        where: "3rd St & Kirkwood Ave",
        at: [-122.38962, 37.73793],
        source: "https://www.kalw.org/post/hey-area-case-san-franciscos-missing-o-street",
      },
      {
        icon: "house",
        title: "Mrs. Quinn's house by 1875",
        text:
          "No one knows exactly when this house was built, but Mrs. Mary Quinn was living in it by 1875, and it is dated to between 1870 and 1875. The Quinn family kept it until 1958. The city made it Landmark No. 63 on July 6, 1974; it is a private home, so admire it from the sidewalk.",
        place: "Quinn House",
        where: "1562 McKinnon Ave",
        at: [-122.38850, 37.73595],
        source: "https://en.wikipedia.org/wiki/Quinn_House,_San_Francisco",
      },
      {
        icon: "house",
        title: "A landmark that moved in 1913",
        text:
          "Stephen L. Piper, a prominent carpenter and house builder in the southern part of San Francisco, built this Italianate house, dated to between 1865 and 1870. It first stood on the south side of Sumatra Street, later renamed Quesada, and was moved to this lot on Revere in 1913. The city made it Landmark No. 61 in 1974; like the Quinn House, it is a private home.",
        place: "Sylvester House",
        where: "1556 Revere Ave",
        at: [-122.38911, 37.73135],
        source: "https://sfplanninggis.org/docs/landmarks_and_districts/LM61.pdf",
      },
      {
        icon: "book",
        title: "A library renamed for its librarian",
        text:
          "Bayview's branch library opened in a storefront in 1927 as the city's 13th branch, and a bequest from Anna E. Waden paid for the red-brick building that opened at Third and Revere in 1969. Its replacement opened in February 2013 and earned LEED Gold certification. In 2014 the Library Commission voted unanimously to add the name of Linda Brooks-Burton, the branch's librarian from 1995 to 2011, who died in September 2013.",
        place: "Bayview/Linda Brooks-Burton Branch Library",
        where: "5075 3rd St",
        at: [-122.39117, 37.73256],
        source: "https://sfbayview.com/2014/10/unanimous-vote-renames-bayview-library-for-linda-brooks-burton/",
      },
      {
        icon: "shop",
        title: "Bayview's main street",
        text:
          "San Francisco's planning code calls Third Street the primary neighborhood commercial district for Bayview Hunters Point, and its storefronts around the Opera House hold shops, restaurants and cafés. This stretch was Railroad Avenue until it was folded into Third Street early in the 20th century. Electric streetcars began running on Third in 1895, buses replaced them in 1940, and rail returned in 2007 with the T Third.",
        place: "Third Street shops",
        where: "3rd St & Palou Ave",
        at: [-122.39087, 37.73399],
        source: "https://www.sfmta.com/node/13465",
      },
      {
        icon: "music",
        title: "The opera house the Masons built",
        text:
          "In 1888 members of the Masonic lodge next door had German-born architect Henry Geilfuss build this public hall and theater, and “South San Francisco Opera House” is still carved over the entrance, a name from before the city of South San Francisco incorporated. It survived the 1906 earthquake, became city Landmark No. 8 in 1968 and joined the National Register in 2011, and SFMTA calls it the city's oldest theatre. Renamed for producer, playwright and actress Ruth Williams, it was renovated from 2014 to 2016 for $5.7 million, gaining an outdoor stage with permanent seating on a plaza redesigned by landscape architect Walter Hood.",
        place: "Bayview Opera House",
        where: "4705 3rd St",
        at: [-122.39013, 37.73515],
        source: "https://en.wikipedia.org/wiki/Bayview_Opera_House",
      },
    ],
    walk: {
      intro:
        "A 1.3-mile walk for visitors and would-be neighbors, from the T Third's Evans Avenue stop south along Third Street, east into the avenues to two landmark houses from the 1860s and '70s, then back to Third past the library and shops to the Bayview Opera House, steps from the T's Oakdale/Palou stop. Allow about an hour, and check the Opera House's calendar for events on its plaza before you go.",
      miles: 1.3,
      minutes: 60,
      tip:
        "Between the library and the shops, detour a few steps west across Third onto the 1700 block of Quesada Avenue: in 2002 neighbors Annette Smith and Karl Paige began planting its bare median, under palms planted in the 1920s, and by 2006 neighbors had turned the whole median into a vegetable and flower garden.",
    },
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
    history:
      "The point was part of the 4,446-acre rancho granted to José Cornelio Bernal in 1839, and LocalWiki says it is named for three brothers, John, Phillip and Robert Hunter, his agents when he sold the land for development in 1849; they built homes and a dairy near today's Griffith Street and Oakdale Avenue and in 1850 began selling lots for a city they called South San Francisco. Dry docks opened here in the late 1860s, and Chinese shrimp fishermen lived along the north shore, with 12 camps in 1930, until the Navy took the land in 1939.\n\nThe Navy bought the shipyard on December 29, 1939, and at the height of World War II it provided about 18,500 jobs. In 1942 the government built 5,500 temporary homes for yard workers and their families, and by 1945 about a third of the area's roughly 20,000 residents were African American. On July 16, 1945, the cruiser USS Indianapolis sailed from the yard with components of the Little Boy atomic bomb. From 1946 to 1969 the Naval Radiological Defense Laboratory worked here, and ships contaminated in U.S. atomic tests were brought in.\n\nOn September 27, 1966, police officer Alvin Johnson shot and killed Matthew “Peanut” Johnson, an unarmed Black teenager who had run from a car the officer suspected was stolen. In the uprising that followed, through October 1, Governor Edmund G. Brown declared a state of emergency and sent in the National Guard. The Navy ended shipyard operations in 1974, the EPA named the yard a Superfund site in 1989, and the base closed on April 1, 1994; a Hilltop neighborhood of homes and parks has since opened there.",
    facts: [
      {
        icon: "cow",
        title: "A dairy that named a point",
        text:
          "San Francisco's LocalWiki says the point is named for three brothers, John, Phillip and Robert Hunter, who were José Cornelio Bernal's agents when he sold his land for development in 1849, and who built their homes and a dairy farm near this corner. In 1850, it says, they began trying to sell lots in an entirely new city on the point that they called South San Francisco, though accounts of the brothers' names and dates vary.",
        place: "Hunter brothers' dairy",
        where: "Oakdale Ave & Griffith St",
        at: [-122.37932, 37.72822],
        source: "https://localwiki.org/sf/Hunters_Point",
      },
      {
        icon: "house",
        title: "5,500 homes built for a war",
        text:
          "In 1942, BlackPast notes, the federal government built 5,500 temporary housing units in Hunters Point for Navy yard workers and their families, and because they were open to all of the yard's workers, the area became one of the city's most integrated. Two decades later the community's Joint Housing Committee started a renewal plan, Hunters Point Project Area A, mostly covering a residential area of those wartime units: supervisors designated the survey area on December 23, 1963, and approved the plan on January 20, 1969, aiming for low- to moderate-priced private housing.",
        place: "Hunters Point Hill",
        where: "Kiska Rd & Ingalls St",
        at: [-122.37953, 37.73109],
        source: "https://digitalsf.org/islandora/object/islandora%3A197544",
      },
      {
        icon: "factory",
        title: "The docks that went to war",
        text:
          "Dry docks opened on the point in the late 1860s, and the docks built here in 1916, more than 1,000 feet long, were thought to be the largest in the world. The Navy bought the yard on December 29, 1939, and at the peak of World War II it provided about 18,500 jobs. On July 16, 1945, within hours of the Trinity test, the cruiser USS Indianapolis left the yard carrying components of the Little Boy bomb, which it delivered to Tinian on July 26.",
        place: "Hunters Point Naval Shipyard",
        where: "Innes Ave & Donahue St",
        at: [-122.37003, 37.72895],
        source: "https://missionlocal.org/2025/10/sf-hunters-point-shipyard-superfund-timeline/",
      },
      {
        icon: "park",
        title: "A new hilltop on Navy land",
        text:
          "The Shipyard's Hilltop neighborhood is open to the public with over 500 new homes, 13 parks and 8 pieces of public art, and the city's Recreation and Park Department began taking over its parks on July 1, 2025. Hillpoint Park, across the street from Innes Court Playground and its crane-inspired play structure, is a promontory overlook with a large community lawn and reservable picnic tables. In it, Mildred Howard's Frame (2015), an enlarged 22-by-20-foot rococo bronze frame, frames Walter Hood's Refrain, a cluster of vertical steel rods downhill.",
        place: "Hillpoint Park",
        where: "Innes Ct & Hudson Ave",
        at: [-122.36787, 37.72816],
        source: "https://sfrecpark.org/1835/Hunters-Point-Shipyard-Parks",
      },
      {
        icon: "art",
        title: "Studios in a Navy yard",
        text:
          "After the Navy ended operations in 1974, most of the yard was leased to a ship-repair company, and artists began subleasing space from it. Today the Hunters Point Shipyard Artists, almost 300 artists in working studios, call themselves the largest artist community in the United States, and they open their studios to the public each spring and fall. For their 40th anniversary, on October 19, 2024, the yard's 450-foot gantry crane, which the SF Standard calls once the world's largest crane, was covered in video projections and searchlights set to music.",
        place: "Hunters Point Shipyard Artists",
        where: "Galvez Ave & Hill Ave",
        at: [-122.36703, 37.72880],
        source: "https://www.shipyardartists.com/about-hunters-point-shipyard-artists/",
      },
    ],
    walk: {
      intro:
        "A one-way walk of about 1.3 miles for visitors and would-be neighbors, from the 23 Monterey's stop at Oakdale Avenue and Griffith Street up over Hunters Point Hill and down Innes Avenue to the old Navy shipyard, ending at the last stop of the outbound 19 Polk, at Galvez and Hill avenues. Allow about an hour, and go on a spring or fall Open Studios weekend, when the Shipyard Artists open their doors.",
      miles: 1.3,
      minutes: 60,
      tip:
        "The one real climb comes first, roughly 150 feet up from Oakdale Avenue to Kiska Road near the top of the hill. The route passes no shopping street: for food and coffee, the nearest shops and restaurants line Third Street, where the T Third runs, about three-quarters of a mile west of the start.",
    },
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
    history:
      "The Excelsior was once part of Rancho Rincón de las Salinas y Potrero Viejo, José Cornelio Bernal's 1839 Mexican land grant. In the 1860s the valley's groundwater and access to Islais Creek drew immigrant farmers and dairymen, among them Ligurians, Tuscans, Swiss, Germans and Irish, who carted their produce downtown by wagon. On April 15, 1869, the Excelsior Homestead was filed at City Hall, and developer Emanuel Lewis and his daughter Jeannette are credited with giving it a street map like an atlas, naming avenues for countries and streets for capital cities. Three avenues first named China, Japan and India were later renamed amid anti-Asian feeling; today they are Excelsior, Avalon and Peru.\n\nTransit filled in the grid. On September 15, 1894, the first electric streetcars ran on Mission Street, and within a few years the line reached Daly's Hill, just over the county line. Farming lingered: one account counts some 1,200 Italian truck farmers still working about 8,000 acres of the city's south side in 1910. After the 1906 earthquake the Excelsior became a refuge for many displaced San Franciscans, and an early-1900s housing boom produced many of the Edwardian and Victorian houses still standing. In 1911 the city bought land here for a playground, and the new Epiphany parish dedicated its first wooden church.\n\nMission Street remains the main street, made a neighborhood commercial district in 2013. Jerry Garcia spent his first five years at 121 Amazon Avenue, and Mission Street plaques honor his childhood homes. In 2014 the Excelsior Action Group and the city opened a temporary plaza at the Persia Triangle, and in 2016 artists, students and volunteers made Kenny Alley a mosaic stairway garden.",
    facts: [
      {
        icon: "tram",
        title: "The shuttle that ended at China Avenue",
        text:
          "When the first electric streetcars ran on Mission Street on September 15, 1894, the line went from the Ferry Building to 29th and Noe streets, and a shuttle carried riders on down Mission to this corner, where Excelsior Avenue was then called China Avenue. It was one of three avenues, with Japan and India, renamed amid anti-Asian feeling; today they are Excelsior, Avalon and Peru. The rest of the 1869 Excelsior Homestead's atlas of names survives: avenues such as Brazil, Persia, Russia and France cross streets named for capitals such as London, Paris, Lisbon, Madrid and Vienna.",
        place: "Excelsior Avenue",
        where: "Mission St & Excelsior Ave",
        at: [-122.43355, 37.72626],
        source: "https://www.sfmta.com/blog/14-mission-yesterday-today-tomorrow",
      },
      {
        icon: "park",
        title: "The “Heart of the Excelsior”",
        text:
          "Where Ocean and Persia avenues meet Mission Street, this small triangle is fondly known as the “Heart of the Excelsior.” In September 2014 the city's Pavement to Parks program and the Excelsior Action Group opened a temporary plaza here, with parklets and a graphic crosswalk, and its ribbon-cutting on September 28 kicked off that year's Sunday Streets in the Excelsior. Public Works then planned permanent wider sidewalks, pedestrian lighting and a community kiosk to take its place.",
        place: "Persia Triangle",
        where: "Mission St & Persia Ave",
        at: [-122.43581, 37.72318],
        source: "https://default.sfplanning.org/Citywide/pavement2parks/pavement2parks_Transforming_Persia_Triangle.pdf",
      },
      {
        icon: "shop",
        title: "A main street to the county line",
        text:
          "In 2013 the city made Mission Street from Alemany Boulevard to the San Mateo County line the Excelsior Outer Mission Street Neighborhood Commercial District, a mixed-use, transit-oriented strip of ground-floor shops, restaurants and services with homes upstairs; the Excelsior's community benefit district alone covers about 17 whole or partial blocks of Mission between Silver and France avenues. The streetcar line that reached China Avenue in 1894 was extended within a few years to Daly's Hill, just over the county line, and the 14 Mission bus still runs the route.",
        place: "Excelsior Mission Street shops",
        where: "Mission St & Russia Ave",
        at: [-122.43712, 37.72147],
        source: "https://sfbos.org/ftp/uploadedfiles/bdsupvrs/ordinances13/o0261-13.pdf",
      },
      {
        icon: "park",
        title: "A playground bought in 1911",
        text:
          "A chronology of San Francisco's playgrounds records that in 1911 the Board of Supervisors bought land in the Excelsior for the city's Playground Commission. Photographs in the Western Neighborhoods Project's OpenSFHistory collection show Mayor Elmer Robinson at the dedication of Excelsior Playground, at Madrid Street and Russia Avenue, on October 29, 1951, an event organized by a citizens' committee. On the way here along Russia Avenue, the southwest corner of Paris Street is where the neighborhood's Catholic parish built its first church.",
        place: "Excelsior Playground",
        where: "579 Madrid St",
        at: [-122.43300, 37.72065],
        source: "https://test.opensfhistory.org/photo/wnp28.3593",
      },
      {
        icon: "church",
        title: "The church pushed up the hill",
        text:
          "Epiphany parish began as a mission of St. John the Evangelist, and its first church, a wood-frame building seating about 300 on the southwest corner of Russia Avenue and Paris Street, was dedicated on January 21, 1911. When it grew too small, the building was cut in two, and the halves were set on barrels and logs and pushed up the hill to a new lot filling the whole block bounded by Naples, Vienna, Amazon and Italy; the move took place in 1922. The present church on that block was completed in 1950.",
        place: "Church of the Epiphany",
        where: "827 Vienna St",
        at: [-122.43440, 37.71580],
        source: "https://20735.sites.ecatholic.com/history",
      },
      {
        icon: "stairs",
        title: "Forty-seven steps of “Waterfall”",
        text:
          "Between France and Italy avenues, this alley climbs 47 steps from Mission Street up to London Street. Local artists and students covered the steps in a tile mosaic called “Waterfall,” its water spilling onto the walls, and with new landscaping, lighting and a vertical cactus garden the alley held its grand opening on December 10, 2016. It is legally a city street, but Public Works has not accepted it, so volunteers from the Friends of Kenny Alley look after it.",
        place: "Kenny Alley",
        where: "4941 Mission St",
        at: [-122.43839, 37.71915],
        source: "https://www.awesomefoundation.org/en/projects/219459-dazzling-lights-over-water",
      },
      {
        icon: "music",
        title: "Where Jerry Garcia started out",
        text:
          "Jerry Garcia spent the first five years of his life at 121 Amazon Avenue, a short way east along this street, before he and his brother, Tiff, moved in with their maternal grandparents at 87 Harrington Street, just across Mission from where this walk began. The city chose to set his plaques on Mission Street where each of those streets meets it: the Harrington plaque went in in October 2016, and this one was unveiled in 2017, the year Garcia would have turned 75. In 2025 the city gave Harrington Street a second, commemorative name, Jerry Garcia Street, and unveiled the signs on August 1.",
        place: "Jerry Garcia plaque",
        where: "Mission St & Amazon Ave",
        at: [-122.44020, 37.71720],
        source: "https://www.sfexaminer.com/news/sf-to-install-second-jerry-garcia-commemorative-plaque/article_cd2580bb-404a-5cab-908e-73931c1a1398.html",
      },
    ],
    walk: {
      intro:
        "A one-way walk of about 1.6 miles for visitors and would-be neighbors: start at Mission St & Excelsior Ave (14, 14R, 49 and 52 buses), follow Mission past the Persia Triangle, turn onto Russia Avenue into the grid of country and capital street names for the playground and the Church of the Epiphany, then come back to Mission down the mosaic steps of Kenny Alley and finish at the Jerry Garcia plaque, a block from the Mission & Geneva bus stops and about half a mile from Balboa Park BART. Allow about 75 minutes, and go in daylight, when the alley's mosaic is easy to see.",
      miles: 1.6,
      minutes: 75,
      tip:
        "From the church, walk west on Italy Avenue to London Street and turn right; the top of Kenny Alley is partway along the block, and its 47 mosaic steps take you down to Mission Street. Save your meal or coffee stop for the end, when you are back among the restaurants and cafés of Mission Street.",
    },
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
    history:
      "When the Spanish arrived, this valley held two Yelamu settlements, Amuctac and Tubsinte, and the newcomers claimed it as pasture for their cattle. A local history gives July 2, 1777, as the date of its discovery, and tradition says friars and soldiers bound for the new Presidio were caught in fog and camped in its hills; the valley is named for the Feast of the Visitation, Mary's visit to Elizabeth in the Gospel of Luke. In 1841 Governor Juan Alvarado granted Jacob P. Leese the 6,416-acre Rancho Cañada de Guadalupe la Visitación y Rodeo Viejo, which took in parts of today's San Francisco and San Mateo counties.\n\nWindmills that pumped water to the valley's cattle farms, nurseries and vegetable gardens gave it a nickname: the Valley of the Windmills. One family history tells of Rossi relatives who came just after the Civil War and worked their farmland by hand into large vegetable gardens, and the Catholic parish's history says Peter H. Burnett, California's first American governor, built a home where the Church of the Visitacion now stands. The valley had a building boom after the 1906 earthquake and fire.\n\nIn 1926 the Schlage Lock Company dedicated its factory and office on Bayshore Boulevard; the plant ran until Schlage closed it in 1999. Joseph Eichler and architect Claude Oakland planned the 18-story twin Geneva Towers, which rose in the mid-1960s near Garrison Avenue and Schwerin Street; HUD closed them in 1995, and they were imploded on May 16, 1998. In 1995 neighbors began turning empty lots into the Visitacion Valley Greenway, and in 2022 Julia Morgan's St. James Presbyterian Church on Leland Avenue became the valley's first city landmark.",
    facts: [
      {
        icon: "factory",
        title: "The lock factory's surviving office",
        text:
          "Across Bayshore Boulevard, at 2201 Bayshore by Blanken Avenue, stands the original office of the Schlage Lock Company, dedicated along with the factory on June 25, 1926, at a ceremony with Mayor James Rolph. The plant closed in 1999 and all of its manufacturing buildings were demolished, but community advocates, among them the Visitacion Valley History Project, saved the office. Restored in 2021–2022, it now holds a community meeting space and the headquarters of the company redeveloping the old factory land.",
        place: "Schlage Lock office building",
        where: "Bayshore Blvd & Arleta Ave",
        at: [-122.40317, 37.71213],
        source: "https://specialcity.sfheritage.org/schlage-lock-and-8-400-tons-of-steel/",
      },
      {
        icon: "shop",
        title: "A main street since the 1900s",
        text:
          "Leland Avenue, the valley's main shopping street, runs about four blocks from Bayshore Boulevard to Cora Street, its storefronts filled with cafés, restaurants and small shops. Local histories recall a hotel at Leland and Bayshore in the early 1900s and the valley's first dry goods store at 7 and 9 Leland. A 2009–2010 Public Works makeover of the blocks from Bayshore to Rutland Street planted 63 trees and added 45 pedestrian lights, 15 corner bulb-outs and Street Life, a public artwork designed by Rebar for the San Francisco Arts Commission.",
        place: "Leland Avenue shops",
        where: "Leland Ave & Alpha St",
        at: [-122.40577, 37.71190],
        source: "https://sfpublicworks.org/node/34932",
      },
      {
        icon: "park",
        title: "Six parks from empty lots",
        text:
          "From Hans Schiller Plaza, its gateway on Leland Avenue, the Visitacion Valley Greenway climbs the hillside through formerly vacant lots as a long, narrow chain of six small parks, with a community garden, two greenhouses, a playground, a native plant garden, an agricultural lot and an herb garden. Neighbors began organizing in 1995 with a picnic on one of the empty lots, and the plaza, the first piece finished, was paid for by a $300,000 Columbia Foundation grant to the Trust for Public Land in memory of Hans J. Schiller. Since 2019 the greenway has been part of the 17-mile Crosstown Trail from Candlestick Point to Lands End.",
        place: "Visitacion Valley Greenway",
        where: "Campbell Ave & Rutland St",
        at: [-122.40619, 37.71534],
        source: "https://sanfranciscoparksalliance.org/inspiration/visitacion-valley-greenway/",
      },
      {
        icon: "book",
        title: "A library on the old hall's site",
        text:
          "Library service here began in 1934 with a deposit collection, making this the 18th branch established in the San Francisco Public Library system; it later moved into a leased storefront at 45 Leland Avenue. This building at the corner of Leland and Rutland opened on July 30, 2011, on the site of Bayshore Hall, where the Sunday school that grew into St. James Presbyterian Church began meeting in 1906.",
        place: "Visitacion Valley Branch Library",
        where: "201 Leland Ave",
        at: [-122.40739, 37.71245],
        source: "https://sfpl.org/locations/visitacion-valley/visitacion-valley-library-history",
      },
      {
        icon: "church",
        title: "The valley's first city landmark",
        text:
          "Put forward as one of three historic buildings vying to become Visitacion Valley's first designated landmark, this church became San Francisco Landmark No. 308 when supervisors approved it on December 13, 2022. Julia Morgan designed the building, finished in the early 1920s, for a congregation that began in 1906 as a Sunday school started by members of University Mound Presbyterian Church and organized on April 26, 1908, with 69 members.",
        place: "St. James Presbyterian Church",
        where: "240 Leland Ave",
        at: [-122.40827, 37.71303],
        source: "https://sfplanninggis.org/docs/landmarks_and_districts/LM308.pdf",
      },
      {
        icon: "church",
        title: "A governor's grove",
        text:
          "The parish history says Peter H. Burnett, California's first American governor, built a home on land that came to be known as Burnett Grove, where this Catholic church now stands. The parish dates from 1907 and its present church was dedicated in 1952; its history also says Franciscan friars arriving in 1777 said their first Mass in the valley on the Feast of the Visitation.",
        place: "Church of the Visitacion",
        where: "655 Sunnydale Ave",
        at: [-122.40881, 37.70969],
        source: "https://visitacionchurch.org/?p=150",
      },
    ],
    walk: {
      intro:
        "A 1.2-mile line from the T Third Street light-rail stop at Bayshore Blvd & Arleta Ave, along Leland Avenue's main street, up the Visitacion Valley Greenway to Campbell Ave, back down Rutland St to the library and two churches, and on to the T stop at Bayshore Blvd & Sunnydale Ave. Allow about an hour; late morning, when Leland Avenue's shops are open, is a good time to go.",
      miles: 1.2,
      minutes: 60,
      tip:
        "The greenway is the walk's only real climb, rising from Hans Schiller Plaza on Leland Ave to Campbell Ave; pick up a coffee at one of the cafés on Leland Avenue before you start up.",
    },
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
    history:
      "Sunnyside was carved from Rancho San Miguel: on January 5, 1891, Leland Stanford deeded the southernmost 200 acres of his part of the rancho to James P. McCarthy. That year the Sunnyside Land Company, with Behrend Joost as president, laid out 2,250 lots on 48 blocks, which local historians call the city's largest subdivision to that date, and named streets for wealthy associates: Flood, Spreckels, Mangels and Joost himself. Joost's real goal was transit. Powered from a plant on Sunnyside Avenue, today's Monterey Boulevard, his San Francisco & San Mateo Electric Railway, which those historians call the city's first electric railway, began running on April 27, 1892, from downtown through Sunnyside to the Baden stockyards in San Mateo County.\n\nLots sold slowly for decades. Poor management cost Joost the line to his creditors, and the slopes proved fragile: in January 1895, after heavy rain and a big street-grading job, several houses on the hillside above the avenue between Acadia and Detroit streets slid downhill. The Market Street Railway, which bought the line, later extended its No. 10 car into Sunnyside; photos show 10 cars on Monterey as late as 1942, before buses took over. Sunnyside Avenue itself became Monterey Boulevard in 1920.\n\nThe 1891 plan set aside no park; the city bought steep, empty lots for Sunnyside Playground only in the 1960s. At the neighborhood's southern edge, on land that had held the city's Industrial School and, until 1935, the sheriff's House of Correction Number Three, Mayor Angelo Rossi broke ground for San Francisco Junior College, today's City College, on April 15, 1937, and Timothy Pflueger's Science Hall was finished there in 1940.",
    facts: [
      {
        icon: "factory",
        title: "Powerhouse for the first electric line",
        text:
          "Behrend Joost's San Francisco & San Mateo Electric Railway, which Sunnyside's historians call the city's first electric railway, drew its power from a plant on this block of what was then Sunnyside Avenue when it opened in April 1892. The powerhouse fronted the street from today's 127 to 151 Monterey, and a photo archive dates its service to 1892 through 1902; the houses that line the block now were built in the 1940s.",
        place: "Sunnyside Powerhouse site",
        where: "127-151 Monterey Blvd",
        at: [-122.43845, 37.73145],
        source: "https://sunnysidehistory.org/category/streetcar",
      },
      {
        icon: "park",
        title: "A conservatory saved from the wreckers",
        text:
          "William Augustus Merralls, a British engineer who designed mining equipment, built this two-story octagonal redwood conservatory around 1902, and in 1975 it became San Francisco Landmark No. 78. At the end of 1978 an owner who planned apartments got a demolition permit and began tearing it down, until neighbors' repeated calls to City Hall halted the work, though part of the building was already gone. The city bought it in 1980 with Open Space Fund money, and a multimillion-dollar renovation was completed in December 2009.",
        place: "Sunnyside Conservatory",
        where: "236 Monterey Blvd",
        at: [-122.44073, 37.73181],
        source: "https://en.wikipedia.org/wiki/Sunnyside_Conservatory",
      },
      {
        icon: "stairs",
        title: "Steps where a street never went",
        text:
          "Detroit Street was planned to run up this hill, but the slope was too steep for a street, so its route became a two-block public stairway from Hearst Avenue up across Monterey Boulevard to Joost Avenue: 186 steps by the Glen Park Association's count, 185 in a 2025 city ordinance. A 1940 photo of Monterey at Detroit already shows the top of the lower flight. On November 3, 2018, the Sunnyside Neighborhood Association and neighbors launched a multi-year project to beautify the long-neglected stairway.",
        place: "Detroit Street steps",
        where: "Monterey Blvd & Detroit St",
        at: [-122.44429, 37.73157],
        source: "https://www.glenparkassociation.org/pandemic-or-no-the-detroit-street-steps-are-getting-the-love-they-deserve",
      },
      {
        icon: "park",
        title: "The park the plan forgot",
        text:
          "Sunnyside's 1891 plan set aside no park space at all. A Sunnyside Park up the hill, at about where Molimo meets Teresita Boulevard, existed mostly on paper: deeded to the city when the Sunnyside Addition, today's Miraloma Park, was laid out in 1892, it was never used for recreation. Only in the 1960s did the city buy up lots that had been too steep to build on and, folding in parts of unbuilt Edna Street and Melrose Avenue, create this playground.",
        place: "Sunnyside Playground",
        where: "Foerster St & Melrose Ave",
        at: [-122.44820, 37.73370],
        source: "https://sunnysidehistory.org/2016/03/10/a-park-for-sunnyside",
      },
      {
        icon: "shop",
        title: "Main street of a streetcar suburb",
        text:
          "Monterey Boulevard, called Sunnyside Avenue until 1920, is the neighborhood's main street, with storefronts along the 400 to 700 blocks from Edna Street west to Ridgewood Avenue. City assessor's photos from the 1950s to the 1970s show a barber shop, a delicatessen and other neighborhood businesses here; a gas station on this corner came down in 1966, and nearby a grocery chain bought up a strip of shops in the 1960s and razed it in the early 1970s. Today the blocks hold restaurants, cafés, bars and everyday services.",
        place: "Monterey Boulevard shops",
        where: "Monterey Blvd & Foerster St",
        at: [-122.44882, 37.73160],
        source: "https://sunnysidehistory.org/2020/10/29/monterey-boulevard-shops-some-midcentury-photos",
      },
      {
        icon: "road",
        title: "Streets named for the rich",
        text:
          "Sunnyside's streets were named for wealthy associates of the venture, including Flood, Spreckels and Mangels, with Joost Avenue for the company's president. Not every name lasted: Moulton Avenue became Hearst Avenue, for George Hearst, in 1895; Spreckels Avenue, the next street south of here, became Staples, for another rich family; and Weiland Avenue became Judson.",
        place: "Flood Avenue",
        where: "Gennessee St & Flood Ave",
        at: [-122.45120, 37.72995],
        source: "https://sunnysidehistory.org/2018/06/14/sunnyside-street-name-changes-new-and-old",
      },
      {
        icon: "book",
        title: "Pflueger's hall on Pneumonia Hill",
        text:
          "Timothy Pflueger designed Science Hall, finished in 1940, to be longer than City Hall; the college paper puts it at 489 feet, and inside are Frederick Olmsted's twin murals, Theory and Science. It sits atop the Ocean Campus's highest plateau, reached from Phelan Avenue, today's Frida Kahlo Way, by 87 stairs and 11 landings. Winds of up to 40 miles an hour, strong enough to make its heavy entrance doors hard to open, earned the approach the nickname Pneumonia Hill.",
        place: "Science Hall",
        where: "50 Frida Kahlo Way",
        at: [-122.45150, 37.72571],
        source: "https://www.theguardsman.com/2_science-building_pratt/",
      },
    ],
    walk: {
      intro:
        "A one-way walk of about 1.6 miles for visitors and would-be neighbors: start at the Monterey Boulevard and Acadia Street stop of the 23 and 36 buses, a short walk west of Glen Park BART, and head west past the conservatory, up the Detroit Street steps and around by the playground to the Monterey Boulevard shops, then down Gennessee Street to City College. Allow about 75 minutes, and go on a clear afternoon.",
      miles: 1.6,
      minutes: 75,
      tip:
        "Bring a windbreaker for the end: the climb to Science Hall was nicknamed Pneumonia Hill for its wind. The Detroit Street steps are the walk's big climb. From City College, the 43 stops on Frida Kahlo Way and the K Ingleside on Ocean Avenue at the campus's south edge, and Balboa Park BART is about half a mile southeast.",
    },
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
      "Frequently combined with the neighborhood Cow Hollow, eight sunny blocks of Victorian storefronts from Van Ness to Steiner — boutiques, brunch patios, and a buzzing Fillmore Street bar corner, on what was once dairy pasture.",
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
