import { useMotion } from '../../lib/motion.jsx'
import ImageSlot from '../ImageSlot.jsx'
import copy from '../../content/copy.js'

function ClientMarquee() {
  const row = copy.network.clients.map((c, i) => (
    <span key={c} className="flex items-center gap-10 px-5 whitespace-nowrap">
      <span className={`font-display uppercase text-3xl md:text-5xl ${i % 2 ? 'outline-text text-ink' : 'text-ink'}`}>
        {c}
      </span>
      <span className="regmark text-ink/30" aria-hidden="true" />
    </span>
  ))
  return (
    <div className="marquee py-8 border-y border-ink/15" role="list" aria-label="Clients supplied">
      <div className="marquee-track">{row}</div>
      <div className="marquee-track" aria-hidden="true">{row}</div>
    </div>
  )
}

export default function S07Work() {
  return (
    <section id="work" data-section="work" className="section-light bg-bone text-ink rule-t py-24 md:py-36">
      <div className="px-5 md:px-8">
        <div className="flex items-baseline justify-between mb-4">
          <p className="mlabel text-accent">07 / Applications + the network</p>
          <span className="mlabel opacity-40 hidden md:block">FIG. 07</span>
        </div>
        <h2 className="h-display text-[10.5vw] md:text-8xl max-w-[14ch]" data-reveal>
          Where Cildro beech <span className="outline-text">goes to work</span>
        </h2>

        {/* applications grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/15 border border-ink/15 mt-14">
          {copy.applications.items.map((a, i) => (
            <article key={a.label} className="bg-bone p-6 group">
              <header className="flex items-baseline justify-between mb-5">
                <span className="font-display text-2xl text-accent">{String(i + 1).padStart(2, '0')}</span>
                <span className="mlabel opacity-40">APP/{a.img.split('.')[0].slice(0, 10)}</span>
              </header>
              <div className="text-ink/45 group-hover:text-accent transition-colors">
                <ImageSlot name={a.img} ratio="16/10" />
              </div>
              <h3 className="font-body font-semibold text-lg mt-5">{a.label}</h3>
            </article>
          ))}
        </div>
        <p className="mlabel opacity-60 mt-5">{copy.applications.also}</p>
      </div>

      {/* network marquee */}
      <div className="mt-24">
        <p className="mlabel text-accent px-5 md:px-8 mb-6">Our network — {copy.network.title}</p>
        <ClientMarquee />
      </div>

      {/* factory-direct */}
      <div className="px-5 md:px-8 mt-24 grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <p className="mlabel text-accent mb-4">{copy.factory.eyebrow}</p>
          <h3 className="h-display text-4xl md:text-6xl max-w-[14ch]" data-reveal>
            {copy.factory.title}
          </h3>
          <ul className="mt-8 border-t border-ink/15">
            {copy.factory.points.map((p, i) => (
              <li key={p} className="flex items-center gap-5 py-4 border-b border-ink/15 font-mono text-xs uppercase tracking-micro">
                <span className="text-accent">{String(i + 1).padStart(2, '0')}</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative text-ink/50">
          <ImageSlot
            name={copy.factory.signImg}
            caption="the CILDRO wooden sign on the brick wall"
            ratio="4/3"
          />
          <span className="stamp text-accent text-xs absolute -bottom-4 right-6 bg-bone">
            Mill — Drobeta-Turnu Severin, RO
          </span>
        </div>
      </div>
    </section>
  )
}
