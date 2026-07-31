// ─────────────────────────────────────────────────────────────────────────────
// CILDRO PLYWOOD — approved copy inventory.
// Source: https://b2b.cildroplywood.ro + owner-supplied edits (the only
// permitted sources). Never edit a number or claim here without a matching
// change approved by the owner.
// i18n: `en` and `ro` share one shape; the active locale is chosen from
// <html lang> (ro/index.html sets lang="ro"; served at /ro/).
// Product naming: "Fagotex" (owner rename of the former "Cildro Shield").
// ─────────────────────────────────────────────────────────────────────────────

const en = {
  brand: {
    name: 'Cildro Plywood',
    claim: 'Experts in beech plywood since 2013',
    tagline: 'The European beech specialists.',
    origin:
      '100% European beech, pressed at our own mill in Romania and made to your exact spec.',
  },

  hero: {
    banner:
      'Buying birch plywood? The panel you actually want is 100% European beech.',
    headline: 'European Beech Plywood — Denser and Harder, Made in EU.',
    sub: '100% European beech, pressed at our own EU mill to your exact spec — 750 kg/m³ and ≥25 N/mm² Brinell hard, denser and harder than any birch panel. Built for furniture, joinery, shopfitting and worktop manufacturers.',
    stats: [
      { value: '750', unit: 'kg/m³', label: 'density', note: '~15% over birch' },
      { value: '25+', unit: 'N/mm²', label: 'Brinell surface hardness', note: 'surface hardness' },
      { value: '4–60', unit: 'mm', label: 'thickness', note: 'made to order' },
    ],
    ctas: {
      primary: 'Get a Factory Price',
      whatsapp: 'Chat on WhatsApp',
      samples: 'Send Me Free Samples',
      samplesNote:
        'Feel the panel first — raw & phenolic, multiple grades, full sample box ships in 48h',
    },
    badges: ['100% FSC', 'E1', 'EUDR-compliant', 'Mill since 2013'],
    ticker: [
      { city: 'DROBETA-TURNU SEVERIN, RO', tz: 'Europe/Bucharest' },
      { city: 'LONDON, UK', tz: 'Europe/London' },
      { city: 'BERLIN, DE', tz: 'Europe/Berlin' },
    ],
  },

  material: {
    eyebrow: 'The material',
    titleA: 'One species.',
    titleB: 'Every single ply.',
    callouts: [
      '100% BEECH CORE',
      'PRESSED AT OUR OWN EU MILL',
      'BONDING CLASS 2 (EN-314-2)',
      'E0.5 (EN-717-1)',
    ],
    // veneer + glue specs supplied directly by the owner (Andrei Olaru) in brief
    veneerNote: 'Peeled beech veneer — ~2.6 mm per ply, long grain / cross grain alternating',
    glue: {
      label: 'Glue line',
      options: [
        { id: 'phenolic', label: 'Phenolic', note: 'dark glue line' },
        { id: 'melamine', label: 'Melamine', note: 'light glue line' },
      ],
    },
  },

  shield: {
    eyebrow: 'Fagotex',
    titleA: 'Then we',
    titleB: 'armor it.',
    desc: 'Phenolic film-faced, anti-slip. For trailer floors, van linings and vehicle bodies.',
    // film options supplied directly by the owner in brief
    films: {
      label: 'Film color',
      options: [
        { id: 'dark', label: 'Dark brown' },
        { id: 'chestnut', label: 'Chestnut brown' },
      ],
    },
    weights: {
      label: 'Film weight',
      options: [
        { id: '120', label: '120 g/m²' },
        { id: '240', label: '240 g/m²' },
      ],
    },
    hint: '(select film & weight)',
  },

  impact: {
    titleA: 'The strongest',
    titleB: 'panel',
    titleC: 'in the room.',
    sub: 'Same test, three materials. Beech barely dents, birch holds, softwood shrugs.',
    rows: [
      {
        id: 'beech',
        name: 'Cildro Beech',
        density: 750,
        densityLabel: '750 kg/m³',
        hardness: '≥25 N/mm² Brinell',
        hardnessPct: 100,
        bending: '75 N/mm² bending',
        bendingPct: 100,
        verdict: 'Densest, hardest, in stock.',
        img: 'beech-impact-test.webp',
        caption: 'same impact test on a beech panel — barely a mark',
      },
      {
        id: 'birch',
        name: 'Baltic birch',
        density: 650,
        densityLabel: '~650 kg/m³',
        hardness: 'medium hardness',
        hardnessPct: 62,
        bending: 'medium bending',
        bendingPct: 68,
        verdict: 'Solid, but supply-restricted.',
        img: 'birch-impact-test.webp',
        caption: 'same impact test on a birch panel — visible dent',
      },
      {
        id: 'softwood',
        name: 'Softwood ply',
        density: 450,
        densityLabel: '~450 kg/m³',
        hardness: 'low hardness',
        hardnessPct: 30,
        bending: 'low bending',
        bendingPct: 34,
        verdict: 'Soft, dents easily.',
        img: 'softwood-impact-test.webp',
        caption: 'impact / dent test on a softwood panel — deep dent',
      },
    ],
  },

  products: {
    titleA: 'One beech.',
    titleB: 'Built three ways.',
    items: [
      {
        id: 'natural',
        name: 'Cildro Natural',
        flag: 'OUR FLAGSHIP',
        desc: 'Raw, finely sanded natural beech. For furniture, joinery, shopfitting and worktops.',
        img: 'cildro-natural.webp',
        visual: 'face',
      },
      {
        id: 'shield',
        name: 'Fagotex',
        flag: null,
        desc: 'Phenolic film-faced, anti-slip. For trailer floors, van linings and vehicle bodies.',
        img: 'cildro-shield.webp',
        visual: 'phenolic',
      },
      {
        id: 'core',
        name: 'Cildro Core',
        flag: null,
        desc: 'Structural-grade beech for load-bearing, heavy-duty work.',
        img: 'cildro-core.webp',
        visual: 'edge',
      },
    ],
  },

  showroom: {
    titleA: 'See exactly what arrives',
    titleB: 'on your truck.',
    sub: 'Choose a grade — the panel changes in front of you. No surprises at delivery.',
    hint: '(select a grade)',
    gradeWord: 'Grade',
    rawBeech: 'raw beech',
    gradeFallbackDesc: 'Real mill-floor face — request the full grade catalogue with your quote.',
    qualityGrade: 'Quality grade',
    types: [
      { id: 'raw', label: 'Raw Beech' },
      { id: 'phenolic', label: 'Phenolic Film' },
    ],
    grades: [
      {
        id: 'i',
        label: 'I',
        desc: 'Uniform color, minimal to no difference in coloration, no defects.',
        tex: '/images/grades/grade-i.jpg',
        photo: '/images/grades/grade-i-full.jpg',
      },
      { id: 'ii', label: 'II', desc: null, tex: '/images/grades/grade-ii.jpg', photo: '/images/grades/grade-ii-full.jpg' },
      { id: 'iii', label: 'III', desc: null, tex: '/images/grades/grade-iii.jpg', photo: '/images/grades/grade-iii-full.jpg' },
      { id: 'iv', label: 'IV', desc: null, tex: '/images/grades/grade-iv.jpg', photo: '/images/grades/grade-iv-full.jpg' },
    ],
  },

  grain: {
    titleA: 'Read the',
    titleB: 'fiber.',
    hint: '(move to inspect the fiber)',
    labels: ['FAGUS SYLVATICA', 'EUROPEAN BEECH', 'FINELY SANDED FACE'],
  },

  applications: {
    titleA: 'Where Cildro beech',
    titleB: 'goes to work',
    also: 'Also: trailer flooring & vehicle bodies — see Fagotex.',
    items: [
      { label: 'Furniture & cabinetry', img: 'furniture-cabinetry.webp' },
      { label: 'Worktops', img: 'worktops.webp' },
      { label: 'Shopfitting & interiors', img: 'shopfitting.webp' },
      { label: 'Structural decking', img: 'structural-decking.webp' },
      { label: 'Heavy-duty packaging', img: 'packaging.webp' },
      { label: 'Trailer floors', img: 'trailer-floors.webp' },
    ],
  },

  network: {
    title: 'We have supplied:',
    clients: [
      'Slovenijales',
      'Sklejka Trade',
      'Bayou',
      'Broszeit',
      'Suer',
      'Arabesque',
      'Holver',
      'James Latham',
      'Fliegl Trailer',
      'MS Schuhbauer',
    ],
  },

  factory: {
    title: 'Your beech plywood supplier — no middlemen.',
    eyebrow: 'Factory-direct',
    points: [
      'Factory-direct pricing',
      'Made in Romania, EU',
      '20+ years pressing beech',
      'FSC · E1 · EUDR certified',
    ],
    signImg: 'cildro-sign.webp',
  },

  process: {
    titleA: 'Three steps.',
    titleB: 'Zero friction.',
    steps: [
      {
        n: '01',
        title: 'Send your spec or order free samples',
        desc: 'Tell us thickness, grade and volume — or feel the panels in person first.',
      },
      {
        n: '02',
        title: 'Get a real quote in 4 business hours',
        desc: 'A real manufacturing engineer replies with pricing, lead time and documentation.',
      },
      {
        n: '03',
        title: 'Full-truck delivery across the EU in ~2 weeks',
        desc: 'Volume buyers, full trucks and pallet programs across the UK & EU.',
      },
    ],
  },

  specs: {
    title: 'Beech plywood specifications.',
    sub: 'Open it if you need it — everyone else can keep scrolling.',
    rows: [
      { k: 'Density', v: '750 kg/m³', std: 'EN-323' },
      { k: 'Moisture', v: 'max 8%', std: 'EN-322' },
      { k: 'Bonding class', v: '3', std: 'EN-314-2' },
      { k: 'Emission class', v: 'E1', std: 'EN-717-1' },
      { k: 'Bending strength', v: '75 N/mm² longitudinal / 68 transverse', std: 'EN-310' },
      { k: 'Modulus of elasticity', v: '8300 / 7100 N/mm²', std: 'EN-310' },
      { k: 'Surface hardness', v: '≥25 N/mm² Brinell', std: '—' },
      { k: 'Thickness range', v: '4–60 mm', std: 'EN-315' },
      { k: 'Panel sizes', v: '2500×1500 / 2500×1250 + custom', std: '—' },
    ],
  },

  faq: {
    titleA: 'Questions buyers',
    titleB: 'actually ask.',
    items: [
      {
        q: 'What is beech plywood?',
        a: 'A hardwood panel pressed from European beech (Fagus sylvatica) veneers. Cildro beech plywood is 100% beech core — no filler species — 750 kg/m³ dense, ≥25 N/mm² Brinell hard, available 4–60 mm thick.',
      },
      {
        q: 'How does beech plywood compare to birch plywood?',
        a: 'Beech plywood is denser (750 vs ~650 kg/m³) and harder than Baltic birch, so it holds screws tighter and dents less. Anywhere birch worked, beech works at least as well — free samples let your team prove it on their own machines.',
      },
      {
        q: "What's the minimum order?",
        a: 'One pallet for pick-up, or a full truck delivered. Pallet programs and full-truck schedules across the UK and EU.',
      },
      {
        q: 'How fast can you deliver?',
        a: 'Roughly two weeks from confirmed order to dispatch; firm lead time quoted with every offer.',
      },
      {
        q: 'Is it certified?',
        a: 'FSC, E1, EUDR-compliant, tested to EN standards (EN-310, EN-314-2, EN-323, EN-717-1). Full traceability and documentation ship with every order.',
      },
      {
        q: 'How does the price compare?',
        a: 'Once you add EU duties on the remaining birch routes — bans, the 86.8% Chinese duty, Kazakh/Turkish anti-dumping — EU beech lands competitively, often below the true delivered cost of birch.',
      },
    ],
  },

  quote: {
    titleA: 'Get a trade quote in',
    titleB: '4 business hours.',
    note: 'A real production engineer replies within 4 business hours. No spam, ever.',
    fields: {
      email: 'Work email',
      product: {
        label: 'Product',
        options: ['Cildro Natural', 'Fagotex', 'Cildro Core', 'Not sure'],
      },
      volume: {
        label: 'Volume',
        options: ['Full truck', 'Pallets', 'Not sure'],
      },
    },
    side: {
      title: 'Certified, traceable, EU-origin.',
      items: ['FSC certified', 'E1 emission class', 'EUDR-compliant', 'REX registered', 'EU origin'],
      samples: 'Order free samples',
    },
  },

  contact: {
    email: 'andrei.olaru@cildro.ro',
    phone: '+40 758 109 297',
    phoneRaw: '40758109297',
    made: 'Made in Romania, EU',
    copyright: '© Cildro Plywood',
    strip: 'FSC certified · E1 · EUDR-compliant · REX · EU-origin',
  },

  directory: [
    { n: '01', id: 'hero', title: 'Hero' },
    { n: '02', id: 'surface', title: 'The Surface' },
    { n: '03', id: 'material', title: 'The Material' },
    { n: '04', id: 'shield', title: 'Fagotex' },
    { n: '05', id: 'impact', title: 'The Impact Test' },
    { n: '06', id: 'grain', title: 'Grain Inspector' },
    { n: '07', id: 'work', title: 'Where It Works' },
    { n: '08', id: 'process', title: 'Process & Specs' },
    { n: '09', id: 'quote', title: 'Get a Price' },
  ],

  /* chrome / micro-labels that used to be hardcoded in components */
  ui: {
    scrollDown: '(scroll down)',
    fig01: 'FIG. 01 — product: 100% beech multiply',
    eyebrow02: '02 / The surface — virtual showroom',
    fig02: 'FIG. 02 — face inspection',
    eyebrow03suffix: 'assembly protocol',
    fig03: 'FIG. 03 — exploded view',
    scrollToExplode: '(scroll to explode)',
    eyebrow04suffix: 'film application',
    fig04: 'FIG. 04 — anti-slip film',
    eyebrow05: '05 / How beech stacks up — lab report',
    fig05a: 'FIG. 05 — ball-impact test',
    fig05b: '(illustrative 3D renders)',
    swipeCards: '(swipe cards)',
    verdict: 'VERDICT:',
    density: 'density',
    hardness: 'hardness',
    bending: 'bending',
    eyebrow06: '06 / Grain inspector — the vault',
    fig06: 'FIG. 06 — macro, real panel',
    eyebrow07: '07 / Applications + the network',
    fig07: 'FIG. 07',
    ourNetwork: 'Our network',
    millStamp: 'Mill — Drobeta-Turnu Severin, RO',
    eyebrow08: '08 / How it works',
    fig08: 'FIG. 08',
    step: 'step',
    eyebrow08b: '08.B / Mill datasheet — EN test series',
    doc: 'DOC. CP-EN/750',
    stampApproved: 'Cildro — graded & approved',
    eyebrow09: '09 / Get a price — purchase order',
    fig09: 'FIG. 09',
    po: 'PURCHASE ORDER — REQUEST FOR QUOTE',
    rfq: 'RFQ / B750',
    emailPlaceholder: 'name@company.com',
    send: 'Send request →',
    sentNote: 'Your email client should open with the pre-filled request — hit send and the clock starts.',
    dossierEnd: 'DOSSIER END — 09/09',
    headerTag: 'Plywood — est. 2013',
    getPrice: 'Get a price ↗',
    directory: 'Directory',
    dirTitle: 'Directory — dossier index',
    close: 'Close [×]',
    preloaderTop: 'CILDRO PLYWOOD — MILL FILE 2013—2026',
    stamped: 'Graded & Approved',
    mailQuoteSubject: 'Trade quote request — Cildro Plywood',
    mailSamplesSubject: 'Free sample box request',
    mailBody: { email: 'Work email', product: 'Product', volume: 'Volume' },
    langLink: { href: '/ro/', label: 'RO' },
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// ROMANIAN — same shape; identical numbers/claims, brand names untranslated.
// ─────────────────────────────────────────────────────────────────────────────

const ro = {
  brand: {
    name: 'Cildro Plywood',
    claim: 'Experți în placaj de fag din 2013',
    tagline: 'Specialiștii în fag european.',
    origin:
      '100% fag european, presat în propria noastră fabrică din România și produs exact după specificația ta.',
  },

  hero: {
    banner:
      'Cumperi placaj de mesteacăn? Panoul de care ai nevoie de fapt este 100% fag european.',
    headline: 'Placaj din Fag European — Mai Dens și Mai Dur, Fabricat în UE.',
    sub: '100% fag european, presat în propria noastră fabrică din UE, exact după specificația ta — 750 kg/m³ și duritate Brinell ≥25 N/mm², mai dens și mai dur decât orice panou de mesteacăn. Creat pentru producătorii de mobilier, tâmplărie, amenajări comerciale și blaturi.',
    stats: [
      { value: '750', unit: 'kg/m³', label: 'densitate', note: '~15% peste mesteacăn' },
      { value: '25+', unit: 'N/mm²', label: 'duritate Brinell', note: 'duritate de suprafață' },
      { value: '4–60', unit: 'mm', label: 'grosime', note: 'la comandă' },
    ],
    ctas: {
      primary: 'Cere Preț de Fabrică',
      whatsapp: 'Scrie-ne pe WhatsApp',
      samples: 'Trimite-mi Mostre Gratuite',
      samplesNote:
        'Simte panoul întâi — brut & fenolic, mai multe clase, cutia completă de mostre pleacă în 48h',
    },
    badges: ['100% FSC', 'E1', 'Conform EUDR', 'Fabrică din 2013'],
    ticker: [
      { city: 'DROBETA-TURNU SEVERIN, RO', tz: 'Europe/Bucharest' },
      { city: 'LONDON, UK', tz: 'Europe/London' },
      { city: 'BERLIN, DE', tz: 'Europe/Berlin' },
    ],
  },

  material: {
    eyebrow: 'Materialul',
    titleA: 'O singură specie.',
    titleB: 'Fiecare strat.',
    callouts: [
      'MIEZ 100% FAG',
      'PRESAT ÎN FABRICA NOASTRĂ DIN UE',
      'CLASA DE ÎNCLEIERE 2 (EN-314-2)',
      'E0.5 (EN-717-1)',
    ],
    veneerNote: 'Furnir de fag derulat — ~2,6 mm pe strat, fibră lungă / fibră transversală alternate',
    glue: {
      label: 'Linia de adeziv',
      options: [
        { id: 'phenolic', label: 'Fenolic', note: 'linie de adeziv închisă' },
        { id: 'melamine', label: 'Melamină', note: 'linie de adeziv deschisă' },
      ],
    },
  },

  shield: {
    eyebrow: 'Fagotex',
    titleA: 'Apoi îl',
    titleB: 'blindăm.',
    desc: 'Film fenolic antiderapant. Pentru podele de remorci, căptușeli de dube și caroserii.',
    films: {
      label: 'Culoarea filmului',
      options: [
        { id: 'dark', label: 'Maro închis' },
        { id: 'chestnut', label: 'Maro castaniu' },
      ],
    },
    weights: {
      label: 'Gramajul filmului',
      options: [
        { id: '120', label: '120 g/m²' },
        { id: '240', label: '240 g/m²' },
      ],
    },
    hint: '(alege filmul și gramajul)',
  },

  impact: {
    titleA: 'Cel mai puternic',
    titleB: 'panou',
    titleC: 'din încăpere.',
    sub: 'Același test, trei materiale. Fagul abia se marchează, mesteacănul rezistă, rășinosul cedează.',
    rows: [
      {
        id: 'beech',
        name: 'Fag Cildro',
        density: 750,
        densityLabel: '750 kg/m³',
        hardness: '≥25 N/mm² Brinell',
        hardnessPct: 100,
        bending: '75 N/mm² încovoiere',
        bendingPct: 100,
        verdict: 'Cel mai dens, cel mai dur, pe stoc.',
        img: 'beech-impact-test.webp',
        caption: 'același test de impact pe un panou de fag — abia se vede urma',
      },
      {
        id: 'birch',
        name: 'Mesteacăn baltic',
        density: 650,
        densityLabel: '~650 kg/m³',
        hardness: 'duritate medie',
        hardnessPct: 62,
        bending: 'încovoiere medie',
        bendingPct: 68,
        verdict: 'Solid, dar cu ofertă restricționată.',
        img: 'birch-impact-test.webp',
        caption: 'același test de impact pe un panou de mesteacăn — urmă vizibilă',
      },
      {
        id: 'softwood',
        name: 'Placaj rășinos',
        density: 450,
        densityLabel: '~450 kg/m³',
        hardness: 'duritate mică',
        hardnessPct: 30,
        bending: 'încovoiere mică',
        bendingPct: 34,
        verdict: 'Moale, se amprentează ușor.',
        img: 'softwood-impact-test.webp',
        caption: 'test de impact / amprentare pe un panou rășinos — urmă adâncă',
      },
    ],
  },

  products: {
    titleA: 'Un singur fag.',
    titleB: 'Construit în trei feluri.',
    items: [
      {
        id: 'natural',
        name: 'Cildro Natural',
        flag: 'PRODUSUL NOSTRU FANION',
        desc: 'Fag natural brut, șlefuit fin. Pentru mobilier, tâmplărie, amenajări comerciale și blaturi.',
        img: 'cildro-natural.webp',
        visual: 'face',
      },
      {
        id: 'shield',
        name: 'Fagotex',
        flag: null,
        desc: 'Film fenolic antiderapant. Pentru podele de remorci, căptușeli de dube și caroserii.',
        img: 'cildro-shield.webp',
        visual: 'phenolic',
      },
      {
        id: 'core',
        name: 'Cildro Core',
        flag: null,
        desc: 'Fag de clasă structurală pentru lucrări portante, de uz intensiv.',
        img: 'cildro-core.webp',
        visual: 'edge',
      },
    ],
  },

  showroom: {
    titleA: 'Vezi exact ce ajunge',
    titleB: 'în camionul tău.',
    sub: 'Alege o clasă — panoul se schimbă în fața ta. Fără surprize la livrare.',
    hint: '(alege o clasă)',
    gradeWord: 'Clasa',
    rawBeech: 'fag brut',
    gradeFallbackDesc: 'Față reală din fabrică — cere catalogul complet de clase odată cu oferta.',
    qualityGrade: 'Clasa de calitate',
    types: [
      { id: 'raw', label: 'Fag Brut' },
      { id: 'phenolic', label: 'Film Fenolic' },
    ],
    grades: [
      {
        id: 'i',
        label: 'I',
        desc: 'Culoare uniformă, diferențe minime sau inexistente de nuanță, fără defecte.',
        tex: '/images/grades/grade-i.jpg',
        photo: '/images/grades/grade-i-full.jpg',
      },
      { id: 'ii', label: 'II', desc: null, tex: '/images/grades/grade-ii.jpg', photo: '/images/grades/grade-ii-full.jpg' },
      { id: 'iii', label: 'III', desc: null, tex: '/images/grades/grade-iii.jpg', photo: '/images/grades/grade-iii-full.jpg' },
      { id: 'iv', label: 'IV', desc: null, tex: '/images/grades/grade-iv.jpg', photo: '/images/grades/grade-iv-full.jpg' },
    ],
  },

  grain: {
    titleA: 'Citește',
    titleB: 'fibra.',
    hint: '(mișcă pentru a inspecta fibra)',
    labels: ['FAGUS SYLVATICA', 'FAG EUROPEAN', 'FAȚĂ ȘLEFUITĂ FIN'],
  },

  applications: {
    titleA: 'Unde intră la lucru',
    titleB: 'fagul Cildro',
    also: 'De asemenea: podele de remorci și caroserii — vezi Fagotex.',
    items: [
      { label: 'Mobilier și corpuri', img: 'furniture-cabinetry.webp' },
      { label: 'Blaturi', img: 'worktops.webp' },
      { label: 'Amenajări comerciale și interioare', img: 'shopfitting.webp' },
      { label: 'Platforme structurale', img: 'structural-decking.webp' },
      { label: 'Ambalaje de uz intensiv', img: 'packaging.webp' },
      { label: 'Podele de remorci', img: 'trailer-floors.webp' },
    ],
  },

  network: {
    title: 'Am livrat către:',
    clients: [
      'Slovenijales',
      'Sklejka Trade',
      'Bayou',
      'Broszeit',
      'Suer',
      'Arabesque',
      'Holver',
      'James Latham',
      'Fliegl Trailer',
      'MS Schuhbauer',
    ],
  },

  factory: {
    title: 'Furnizorul tău de placaj de fag — fără intermediari.',
    eyebrow: 'Direct din fabrică',
    points: [
      'Prețuri direct din fabrică',
      'Fabricat în România, UE',
      'Peste 20 de ani presăm fag',
      'Certificat FSC · E1 · EUDR',
    ],
    signImg: 'cildro-sign.webp',
  },

  process: {
    titleA: 'Trei pași.',
    titleB: 'Zero fricțiune.',
    steps: [
      {
        n: '01',
        title: 'Trimite specificația sau comandă mostre gratuite',
        desc: 'Spune-ne grosimea, clasa și volumul — sau simte întâi panourile.',
      },
      {
        n: '02',
        title: 'Primești o ofertă reală în 4 ore lucrătoare',
        desc: 'Un inginer de producție îți răspunde cu preț, termen de livrare și documentație.',
      },
      {
        n: '03',
        title: 'Livrare cu camion complet în UE în ~2 săptămâni',
        desc: 'Cumpărători de volum, camioane complete și programe de paleți în UK și UE.',
      },
    ],
  },

  specs: {
    title: 'Specificațiile placajului de fag.',
    sub: 'Deschide dacă ai nevoie — ceilalți pot derula mai departe.',
    rows: [
      { k: 'Densitate', v: '750 kg/m³', std: 'EN-323' },
      { k: 'Umiditate', v: 'max 8%', std: 'EN-322' },
      { k: 'Clasa de încleiere', v: '3', std: 'EN-314-2' },
      { k: 'Clasa de emisii', v: 'E1', std: 'EN-717-1' },
      { k: 'Rezistență la încovoiere', v: '75 N/mm² longitudinal / 68 transversal', std: 'EN-310' },
      { k: 'Modul de elasticitate', v: '8300 / 7100 N/mm²', std: 'EN-310' },
      { k: 'Duritate de suprafață', v: '≥25 N/mm² Brinell', std: '—' },
      { k: 'Grosimi', v: '4–60 mm', std: 'EN-315' },
      { k: 'Formate', v: '2500×1500 / 2500×1250 + la comandă', std: '—' },
    ],
  },

  faq: {
    titleA: 'Întrebările pe care chiar',
    titleB: 'le pun cumpărătorii.',
    items: [
      {
        q: 'Ce este placajul de fag?',
        a: 'Un panou din lemn de esență tare, presat din furnire de fag european (Fagus sylvatica). Placajul de fag Cildro are miez 100% fag — fără specii de umplutură — densitate 750 kg/m³, duritate Brinell ≥25 N/mm², disponibil în grosimi de 4–60 mm.',
      },
      {
        q: 'Cum se compară placajul de fag cu cel de mesteacăn?',
        a: 'Placajul de fag este mai dens (750 față de ~650 kg/m³) și mai dur decât mesteacănul baltic, deci ține șuruburile mai strâns și se amprentează mai greu. Oriunde a funcționat mesteacănul, fagul funcționează cel puțin la fel de bine — mostrele gratuite îi lasă pe colegii tăi să o demonstreze pe propriile utilaje.',
      },
      {
        q: 'Care este comanda minimă?',
        a: 'Un palet cu ridicare de la fabrică, sau un camion complet livrat. Programe de paleți și grafice de camioane complete în UK și UE.',
      },
      {
        q: 'Cât de repede livrați?',
        a: 'Aproximativ două săptămâni de la confirmarea comenzii până la expediere; termen ferm comunicat cu fiecare ofertă.',
      },
      {
        q: 'Este certificat?',
        a: 'FSC, E1, conform EUDR, testat după standarde EN (EN-310, EN-314-2, EN-323, EN-717-1). Trasabilitate completă și documentație la fiecare comandă.',
      },
      {
        q: 'Cum se compară prețul?',
        a: 'Odată adăugate taxele UE pe rutele rămase de mesteacăn — interdicții, taxa chineză de 86,8%, antidumping pentru Kazahstan/Turcia — fagul din UE ajunge competitiv, adesea sub costul real de livrare al mesteacănului.',
      },
    ],
  },

  quote: {
    titleA: 'Primești ofertă comercială în',
    titleB: '4 ore lucrătoare.',
    note: 'Un inginer de producție real răspunde în 4 ore lucrătoare. Fără spam, niciodată.',
    fields: {
      email: 'Email de serviciu',
      product: {
        label: 'Produs',
        options: ['Cildro Natural', 'Fagotex', 'Cildro Core', 'Nu sunt sigur'],
      },
      volume: {
        label: 'Volum',
        options: ['Camion complet', 'Paleți', 'Nu sunt sigur'],
      },
    },
    side: {
      title: 'Certificat, trasabil, origine UE.',
      items: ['Certificat FSC', 'Clasa de emisii E1', 'Conform EUDR', 'Înregistrat REX', 'Origine UE'],
      samples: 'Comandă mostre gratuite',
    },
  },

  contact: {
    email: 'andrei.olaru@cildro.ro',
    phone: '+40 758 109 297',
    phoneRaw: '40758109297',
    made: 'Fabricat în România, UE',
    copyright: '© Cildro Plywood',
    strip: 'Certificat FSC · E1 · Conform EUDR · REX · Origine UE',
  },

  directory: [
    { n: '01', id: 'hero', title: 'Deschidere' },
    { n: '02', id: 'surface', title: 'Suprafața' },
    { n: '03', id: 'material', title: 'Materialul' },
    { n: '04', id: 'shield', title: 'Fagotex' },
    { n: '05', id: 'impact', title: 'Testul de Impact' },
    { n: '06', id: 'grain', title: 'Inspectorul de Fibră' },
    { n: '07', id: 'work', title: 'Unde Funcționează' },
    { n: '08', id: 'process', title: 'Proces & Specificații' },
    { n: '09', id: 'quote', title: 'Cere Preț' },
  ],

  ui: {
    scrollDown: '(derulează)',
    fig01: 'FIG. 01 — produs: multistrat 100% fag',
    eyebrow02: '02 / Suprafața — showroom virtual',
    fig02: 'FIG. 02 — inspecția feței',
    eyebrow03suffix: 'protocol de asamblare',
    fig03: 'FIG. 03 — vedere explodată',
    scrollToExplode: '(derulează pentru explodare)',
    eyebrow04suffix: 'aplicarea filmului',
    fig04: 'FIG. 04 — film antiderapant',
    eyebrow05: '05 / Cum se compară fagul — raport de laborator',
    fig05a: 'FIG. 05 — test de impact cu bilă',
    fig05b: '(randări 3D ilustrative)',
    swipeCards: '(glisează cardurile)',
    verdict: 'VERDICT:',
    density: 'densitate',
    hardness: 'duritate',
    bending: 'încovoiere',
    eyebrow06: '06 / Inspectorul de fibră — seiful',
    fig06: 'FIG. 06 — macro, panou real',
    eyebrow07: '07 / Aplicații + rețeaua',
    fig07: 'FIG. 07',
    ourNetwork: 'Rețeaua noastră',
    millStamp: 'Fabrica — Drobeta-Turnu Severin, RO',
    eyebrow08: '08 / Cum funcționează',
    fig08: 'FIG. 08',
    step: 'pasul',
    eyebrow08b: '08.B / Fișă tehnică de fabrică — serie de teste EN',
    doc: 'DOC. CP-EN/750',
    stampApproved: 'Cildro — clasat & aprobat',
    eyebrow09: '09 / Cere preț — comandă de achiziție',
    fig09: 'FIG. 09',
    po: 'COMANDĂ DE ACHIZIȚIE — CERERE DE OFERTĂ',
    rfq: 'RFQ / B750',
    emailPlaceholder: 'nume@firma.ro',
    send: 'Trimite cererea →',
    sentNote: 'Clientul tău de email ar trebui să se deschidă cu cererea precompletată — apasă trimite și cronometrul pornește.',
    dossierEnd: 'FINAL DE DOSAR — 09/09',
    headerTag: 'Placaj — din 2013',
    getPrice: 'Cere preț ↗',
    directory: 'Cuprins',
    dirTitle: 'Cuprins — indexul dosarului',
    close: 'Închide [×]',
    preloaderTop: 'CILDRO PLYWOOD — DOSAR DE FABRICĂ 2013—2026',
    stamped: 'Clasat & Aprobat',
    mailQuoteSubject: 'Cerere de ofertă comercială — Cildro Plywood',
    mailSamplesSubject: 'Cerere cutie de mostre gratuite',
    mailBody: { email: 'Email de serviciu', product: 'Produs', volume: 'Volum' },
    langLink: { href: '/', label: 'EN' },
  },
}

const locales = { en, ro }
export const LANG =
  typeof document !== 'undefined' && document.documentElement.lang === 'ro' ? 'ro' : 'en'
export default locales[LANG]
