// ─────────────────────────────────────────────────────────────────────────────
// CILDRO PLYWOOD — approved copy inventory.
// Source: https://b2b.cildroplywood.ro (the only permitted source).
// Structured for i18n (en now; de / ro slots ready). Never edit a number
// or claim here without a matching change on the source site.
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
    headline: 'Denser, harder — 100% beech plywood made in EU.',
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
    callouts: [
      '100% BEECH CORE',
      'PRESSED AT OUR OWN EU MILL',
      'BONDING CLASS 3 (EN-314-2)',
      'E1 (EN-717-1)',
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
    eyebrow: 'Cildro Shield',
    title: 'Then we armor it.',
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
    title: 'The strongest panel in the room.',
    sub: 'Same test, three materials. Softwood dents, birch holds, beech shrugs.',
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
    title: 'One beech. Built three ways.',
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
        name: 'Cildro Shield',
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
    title: 'See exactly what arrives on your truck.',
    sub: 'Choose a grade — the panel changes in front of you. No surprises at delivery.',
    hint: '(select a grade)',
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
    hint: '(move to inspect the fiber)',
    labels: ['FAGUS SYLVATICA', 'EUROPEAN BEECH', 'FINELY SANDED FACE'],
  },

  applications: {
    title: 'Where Cildro beech goes to work',
    also: 'Also: trailer flooring & vehicle bodies — see Cildro Shield.',
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
    title: 'No middlemen. One accountable partner.',
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
    title: 'Three steps. Zero friction.',
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
    title: 'Technical specifications.',
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
    title: 'Questions buyers actually ask.',
    items: [
      {
        q: 'Can beech really replace birch in my product?',
        a: 'Yes — and it usually performs better. Denser (750 vs ~650 kg/m³) and harder than Baltic birch; free samples let your team prove it on their own machines.',
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
    title: 'Get a trade quote in 4 business hours.',
    note: 'A real production engineer replies within 4 business hours. No spam, ever.',
    fields: {
      email: 'Work email',
      product: {
        label: 'Product',
        options: ['Cildro Natural', 'Cildro Shield', 'Cildro Core', 'Not sure'],
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
    { n: '04', id: 'shield', title: 'Cildro Shield' },
    { n: '05', id: 'impact', title: 'The Impact Test' },
    { n: '06', id: 'grain', title: 'Grain Inspector' },
    { n: '07', id: 'work', title: 'Where It Works' },
    { n: '08', id: 'process', title: 'Process & Specs' },
    { n: '09', id: 'quote', title: 'Get a Price' },
  ],
}

// i18n-ready: add `de` / `ro` objects with the same shape when translations land.
const locales = { en }
export default locales.en
