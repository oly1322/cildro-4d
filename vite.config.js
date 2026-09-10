import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { locales } from './src/content/copy.js'

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * Build-time SEO prerender: bakes the full approved copy (copy.js, the single
 * source of truth) into each entry's HTML inside #root, so crawlers' FIRST
 * fetch carries the whole pitch instead of an empty shell (~29 words). React
 * replaces the block on mount (createRoot().render wipes #root children); the
 * preloader curtain covers the brief static frame on slow connections.
 */
function seoBlock(c, ro) {
  const guide = ro ? '/ro/placaj-fag/' : '/beech-plywood/'
  const vs = ro ? '/ro/placaj-fag-vs-mesteacan/' : '/beech-vs-birch-plywood/'
  const fago = ro ? '/ro/fagotex/' : '/fagotex/'
  const li = (a) => a.map((x) => `<li>${esc(x)}</li>`).join('')
  return `
<div style="position:fixed;inset:0;z-index:120;background:#17120D;display:flex;align-items:center;justify-content:center" aria-hidden="true">
  <span style="font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:11px;letter-spacing:0.14em;color:rgba(237,228,211,0.5);text-transform:uppercase">${esc(c.ui.preloaderTop)}</span>
</div>
<div class="seo-static" style="background:#17120D;color:#EDE4D3;font-family:Archivo,Arial,sans-serif;max-width:880px;margin:0 auto;padding:32px 20px;line-height:1.6">
  <h1>${esc(c.hero.headline)}</h1>
  <p>${esc(c.hero.banner)}</p>
  <p>${esc(c.hero.sub)}</p>
  <ul>${c.hero.stats.map((s) => `<li>${esc(s.value)} ${esc(s.unit)} — ${esc(s.label)} (${esc(s.note)})</li>`).join('')}</ul>
  <p>${c.hero.badges.map(esc).join(' · ')}</p>
  <h2>${esc(c.showroom.titleA)} ${esc(c.showroom.titleB)}</h2>
  <p>${esc(c.showroom.sub)} ${esc(c.showroom.gradeFallbackDesc)}</p>
  <h2>${esc(c.material.titleA)} ${esc(c.material.titleB)}</h2>
  <p>${esc(c.material.veneerNote)}. ${c.material.callouts.map(esc).join(' · ')}</p>
  <h2>Fagotex — ${esc(c.shield.titleA)} ${esc(c.shield.titleB)}</h2>
  <p>${esc(c.shield.desc)}</p>
  <h2>${esc(c.impact.titleA)} ${esc(c.impact.titleB)} ${esc(c.impact.titleC)}</h2>
  <p>${esc(c.impact.sub)}</p>
  <ul>${c.impact.rows.map((r) => `<li>${esc(r.name)}: ${esc(r.densityLabel)}, ${esc(r.hardness)}, ${esc(r.bending)} — ${esc(r.verdict)}</li>`).join('')}</ul>
  <h2>${esc(c.products.titleA)} ${esc(c.products.titleB)}</h2>
  <ul>${c.products.items.map((p) => `<li>${esc(p.name)}${p.flag ? ` (${esc(p.flag)})` : ''} — ${esc(p.desc)}</li>`).join('')}</ul>
  <h2>${esc(c.applications.titleA)} ${esc(c.applications.titleB)}</h2>
  <ul>${li(c.applications.items.map((i) => i.label))}</ul>
  <p>${esc(c.applications.also)}</p>
  <p>${esc(c.network.title)} ${c.network.clients.map(esc).join(', ')}.</p>
  <h2>${esc(c.factory.title)}</h2>
  <ul>${li(c.factory.points)}</ul>
  <h2>${esc(c.process.titleA)} ${esc(c.process.titleB)}</h2>
  <ol>${c.process.steps.map((s) => `<li>${esc(s.title)} — ${esc(s.desc)}</li>`).join('')}</ol>
  <h2>${esc(c.specs.title)}</h2>
  <table><tbody>${c.specs.rows.map((r) => `<tr><td>${esc(r.k)}</td><td>${esc(r.v)}</td><td>${esc(r.std)}</td></tr>`).join('')}</tbody></table>
  <h2>${esc(c.faq.titleA)} ${esc(c.faq.titleB)}</h2>
  ${c.faq.items.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('')}
  <h2>${esc(c.quote.titleA)} ${esc(c.quote.titleB)}</h2>
  <p>${esc(c.quote.note)} ${esc(c.quote.side.title)} ${c.quote.side.items.map(esc).join(' · ')}</p>
  <p><a href="mailto:${esc(c.contact.email)}">${esc(c.contact.email)}</a> · ${esc(c.contact.phone)} · ${esc(c.contact.made)}</p>
  <p>
    <a href="${guide}">${esc(c.ui.guides[0].label)}</a> ·
    <a href="${vs}">${esc(c.ui.guides[1].label)}</a> ·
    <a href="${fago}">${esc(c.ui.guides[2].label)}</a> ·
    <a href="${ro ? '/' : '/ro/'}">${ro ? 'English version' : 'Versiunea în română'}</a>
  </p>
</div>`
}

function seoPrerender() {
  return {
    name: 'cildro-seo-prerender',
    transformIndexHtml(html, ctx) {
      const ro = /[\\/]ro[\\/]index\.html$/.test(ctx.filename)
      return html.replace(
        '<div id="root"></div>',
        `<div id="root">${seoBlock(locales[ro ? 'ro' : 'en'], ro)}</div>`
      )
    },
  }
}

export default defineConfig({
  plugins: [react(), seoPrerender()],
  build: {
    target: 'es2019',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      // two entry pages, one app: /ro/ ships its own <head> (lang="ro",
      // Romanian SEO) and copy.js picks the locale from <html lang>
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        ro: fileURLToPath(new URL('./ro/index.html', import.meta.url)),
      },
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          gsap: ['gsap', 'lenis'],
        },
      },
    },
  },
})
