import { useState } from 'react'
import copy from '../../content/copy.js'

export default function S09Quote() {
  const [sent, setSent] = useState(false)
  const wa = `https://wa.me/${copy.contact.phoneRaw}`

  const onSubmit = (e) => {
    e.preventDefault()
    const data = new FormData(e.target)
    const body = [
      `Work email: ${data.get('email')}`,
      `Product: ${data.get('product')}`,
      `Volume: ${data.get('volume')}`,
    ].join('\n')
    window.location.href = `mailto:${copy.contact.email}?subject=${encodeURIComponent(
      'Trade quote request — Cildro Plywood'
    )}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <section id="quote" data-section="quote" className="section-light bg-bone2 text-ink rule-t">
      <div className="px-5 md:px-8 py-24 md:py-32">
        <div className="flex items-baseline justify-between mb-4">
          <p className="mlabel text-accent">09 / Get a price — purchase order</p>
          <span className="mlabel opacity-40 hidden md:block">FIG. 09</span>
        </div>
        <h2 className="h-display text-[10.5vw] md:text-8xl max-w-[13ch]" data-reveal>
          Get a trade quote in <span className="outline-text">4 business hours.</span>
        </h2>

        <div className="grid lg:grid-cols-[1fr_minmax(0,360px)] gap-10 mt-14 items-start">
          {/* purchase-order document */}
          <form
            onSubmit={onSubmit}
            className="border border-ink/30 bg-bone relative"
            aria-label="Trade quote request"
          >
            <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-ink/15">
              <span className="mlabel opacity-60">PURCHASE ORDER — REQUEST FOR QUOTE</span>
              <span className="font-mono text-[11px] text-accent">RFQ / B750</span>
            </div>

            <div className="px-6 md:px-10 py-8 grid gap-8">
              <label className="block">
                <span className="mlabel opacity-60 block mb-2">{copy.quote.fields.email} *</span>
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  className="w-full bg-transparent border-b-2 border-ink/25 focus:border-accent font-body text-lg py-3 outline-none placeholder:text-ink/30"
                />
              </label>

              <fieldset>
                <legend className="mlabel opacity-60 mb-3">{copy.quote.fields.product.label}</legend>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-ink/20 border border-ink/20">
                  {copy.quote.fields.product.options.map((o, i) => (
                    <label key={o} className="relative bg-bone" data-cursor="view">
                      <input
                        type="radio"
                        name="product"
                        value={o}
                        defaultChecked={i === 0}
                        className="peer sr-only"
                      />
                      <span className="block text-center font-mono text-[11px] uppercase tracking-micro py-4 px-2 peer-checked:bg-ink peer-checked:text-bone hover:bg-bone2 transition-colors">
                        {o}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="mlabel opacity-60 mb-3">{copy.quote.fields.volume.label}</legend>
                <div className="grid grid-cols-3 gap-px bg-ink/20 border border-ink/20">
                  {copy.quote.fields.volume.options.map((o, i) => (
                    <label key={o} className="relative bg-bone" data-cursor="view">
                      <input
                        type="radio"
                        name="volume"
                        value={o}
                        defaultChecked={i === 0}
                        className="peer sr-only"
                      />
                      <span className="block text-center font-mono text-[11px] uppercase tracking-micro py-4 px-2 peer-checked:bg-ink peer-checked:text-bone hover:bg-bone2 transition-colors">
                        {o}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="flex flex-wrap gap-3">
                <button type="submit" className="btn btn-accent" data-cursor="view">
                  Send request →
                </button>
                <a href={wa} target="_blank" rel="noreferrer" className="btn btn-wa" data-cursor="link">
                  {copy.hero.ctas.whatsapp}
                </a>
              </div>
              {sent && (
                <p className="font-mono text-[11px] text-accent">
                  Your email client should open with the pre-filled request — hit send and the clock starts.
                </p>
              )}
              <p className="font-mono text-[11px] opacity-50 max-w-[52ch]">{copy.quote.note}</p>
            </div>
          </form>

          {/* certification checklist */}
          <aside className="border border-ink/30 bg-ink text-bone">
            <div className="px-6 py-5 border-b border-bone/15">
              <h3 className="font-display uppercase text-2xl">{copy.quote.side.title}</h3>
            </div>
            <ul className="px-6 py-4">
              {copy.quote.side.items.map((c) => (
                <li key={c} className="flex items-center gap-4 py-3 border-b border-bone/10 last:border-b-0 font-mono text-xs uppercase tracking-micro">
                  <span className="w-4 h-4 border border-accent grid place-items-center text-accent text-[10px]" aria-hidden="true">
                    ✓
                  </span>
                  {c}
                </li>
              ))}
            </ul>
            <div className="px-6 pb-6 pt-2">
              <a
                href={`mailto:${copy.contact.email}?subject=${encodeURIComponent('Free sample box request')}`}
                className="btn btn-ghost w-full"
                data-cursor="link"
              >
                {copy.quote.side.samples}
              </a>
              <p className="font-mono text-[10px] text-bone/45 mt-3">{copy.hero.ctas.samplesNote}</p>
            </div>
          </aside>
        </div>
      </div>

      {/* footer */}
      <footer className="bg-ink text-bone">
        <div className="px-5 md:px-8 py-14 grid md:grid-cols-3 gap-8">
          <div>
            <img src="/images/cildro-logo.webp" alt="Cildro Plywood" className="h-10 w-auto" loading="lazy" />
            <p className="mlabel text-bone/50 mt-4">{copy.brand.claim}</p>
            <p className="font-body text-sm text-bone/60 mt-2 max-w-[36ch]">{copy.brand.origin}</p>
          </div>
          <div className="mlabel text-bone/60 flex flex-col gap-3">
            <a href={`mailto:${copy.contact.email}`} className="hover:text-accent" data-cursor="link">
              {copy.contact.email}
            </a>
            <a href={`tel:+${copy.contact.phoneRaw}`} className="hover:text-accent" data-cursor="link">
              {copy.contact.phone}
            </a>
            <span>{copy.contact.made}</span>
          </div>
          <div className="mlabel text-bone/60 md:text-right flex flex-col gap-3">
            <span className="text-bone/40">{copy.brand.tagline}</span>
            <span>{copy.contact.copyright}</span>
          </div>
        </div>
        <div className="border-t border-bone/10 px-5 md:px-8 py-4 flex flex-wrap justify-between gap-3">
          <span className="mlabel text-bone/40">{copy.contact.strip}</span>
          <span className="mlabel text-bone/40">DOSSIER END — 09/09</span>
        </div>
      </footer>
    </section>
  )
}
