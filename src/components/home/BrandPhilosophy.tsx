import { philosophy } from "@/data/site";

export function BrandPhilosophy() {
  return <section className="section-philosophy" aria-labelledby="philosophy-heading"><div className="container"><div className="philosophy-top"><p className="eyebrow">06 / A name. A way of thinking.</p><span>SIX IDEAS. ONE SHARED DIRECTION.</span></div><div className="philosophy-letters">{philosophy.map((item, index) => <div key={index} className="philosophy-letter"><span aria-hidden="true">{item.letter}</span><h3><span className="sr-only">{item.letter} for </span>{item.word}</h3><p>{item.detail}</p></div>)}</div><div className="philosophy-bottom"><h2 id="philosophy-heading">A philosophy centred around engineering,<br />innovation and purposeful execution.</h2><span className="mono">THE SANORA PHILOSOPHY ↗</span></div></div></section>;
}
