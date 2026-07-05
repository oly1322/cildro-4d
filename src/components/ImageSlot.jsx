/**
 * Placeholder for a production photo that exists in the approved inventory
 * but is not fetchable from the current b2b.cildroplywood.ro deployment.
 * Drop the real file into /public/images and swap this slot for an <img>.
 */
export default function ImageSlot({ name, caption, ratio = '4/3', className = '' }) {
  return (
    <figure
      className={`img-slot flex flex-col items-center justify-center text-center p-6 ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <span className="slot-tick tl" aria-hidden="true" />
      <span className="slot-tick tr" aria-hidden="true" />
      <span className="slot-tick bl" aria-hidden="true" />
      <span className="slot-tick br" aria-hidden="true" />
      <span className="regmark opacity-40 mb-4" aria-hidden="true" />
      <figcaption className="mlabel opacity-60">ASSET SLOT — {name}</figcaption>
      {caption && <p className="font-mono text-[10px] lowercase mt-2 opacity-40 max-w-[24ch]">{caption}</p>}
    </figure>
  )
}
