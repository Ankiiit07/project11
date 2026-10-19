// Building blocks for the long-form buying guides (/cold-brew-coffee and friends):
// an editorial layout in the site's type system, with the product call-out and the
// FAQ list that also feeds the page's FAQ structured data.
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from './icons';
import { KineticHeading } from './kinetic';
import { products } from '../data/products';

export const SITE = 'https://cafeatonce.com';

export const GuideHeader: React.FC<{ label: string; title: React.ReactNode; intro: React.ReactNode; updated: string }> = ({
  label,
  title,
  intro,
  updated,
}) => (
  <header className="border-b border-foreground pb-10 mb-12">
    <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.18em] text-foreground/60 mb-4">{label}</p>
    <KineticHeading as="h1" className="font-heading text-4xl sm:text-6xl font-extrabold uppercase leading-[0.95] text-foreground mb-6">
      {title}
    </KineticHeading>
    <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed max-w-3xl">{intro}</p>
    <p className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-foreground/60">Updated {updated}</p>
  </header>
);

export const GuideSection: React.FC<{ id?: string; title: string; children: React.ReactNode }> = ({ id, title, children }) => (
  <section id={id} className="mb-14 scroll-mt-24">
    <h2 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase leading-tight text-foreground mb-5">{title}</h2>
    <div className="space-y-4 text-base sm:text-lg text-foreground/80 leading-relaxed max-w-3xl">{children}</div>
  </section>
);

/** A plain comparison table; the first column names the row */
export const GuideTable: React.FC<{ head: string[]; rows: React.ReactNode[][]; caption?: string }> = ({ head, rows, caption }) => (
  <div className="overflow-x-auto -mx-4 px-4">
    <table className="w-full min-w-[34rem] text-left text-sm sm:text-base border-y border-foreground">
      {caption && <caption className="caption-bottom pt-3 text-left text-sm text-foreground/60">{caption}</caption>}
      <thead>
        <tr className="border-b border-foreground">
          {head.map((h) => (
            <th key={h} scope="col" className="py-3 pr-4 font-mono text-xs uppercase tracking-[0.12em] text-foreground/70 font-medium">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-foreground/20">
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) =>
              j === 0 ? (
                <th key={j} scope="row" className="py-3 pr-4 font-semibold text-foreground align-top">
                  {cell}
                </th>
              ) : (
                <td key={j} className="py-3 pr-4 text-foreground/80 align-top">
                  {cell}
                </td>
              )
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/** Numbered steps as stacked rows */
export const GuideSteps: React.FC<{ steps: string[] }> = ({ steps }) => (
  <ol className="border-y border-foreground divide-y divide-foreground/20 not-prose">
    {steps.map((step, i) => (
      <li key={step} className="grid grid-cols-[3rem_1fr] gap-2 py-4">
        <span className="font-mono text-sm text-foreground/60">{String(i + 1).padStart(2, '0')}</span>
        <span className="text-foreground">{step}</span>
      </li>
    ))}
  </ol>
);

const productById = (id: string) => {
  const product = products.find((p) => p.id === id);
  if (!product) throw new Error(`Unknown product ${id}`);
  return product;
};

/** Price and buy link for one product, read from the catalogue so it never goes stale */
export const ProductCallout: React.FC<{ id: string; pitch: string }> = ({ id, pitch }) => {
  const p = productById(id);
  return (
    <aside className="my-14 bg-foreground text-background p-6 sm:p-10 grid sm:grid-cols-[1fr_auto] gap-6 items-end">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-background/60 mb-3">Try it</p>
        <p className="font-heading text-3xl sm:text-4xl font-extrabold uppercase leading-none mb-3">{p.name}</p>
        <p className="text-background/80 max-w-xl">{pitch}</p>
      </div>
      <div className="sm:text-right">
        <p className="font-heading text-4xl font-extrabold">
          ₹{p.price}
          {p.originalPrice > p.price && <span className="ml-3 text-lg font-normal line-through text-background/50">₹{p.originalPrice}</span>}
        </p>
        <Link
          to={`/products/${encodeURIComponent(p.id)}`}
          className="mt-4 inline-flex items-center gap-3 px-6 py-3 bg-primary hover:bg-background hover:text-foreground text-white font-heading font-bold uppercase tracking-wide"
        >
          Buy now
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </aside>
  );
};

export interface FAQ {
  question: string;
  answer: string;
}

export const GuideFAQ: React.FC<{ faqs: FAQ[] }> = ({ faqs }) => (
  <section className="mb-14">
    <h2 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase leading-tight text-foreground mb-5">Questions people ask</h2>
    <dl className="border-y border-foreground divide-y divide-foreground/20">
      {faqs.map((f) => (
        <div key={f.question} className="py-5">
          <dt className="font-heading text-lg sm:text-xl font-bold text-foreground mb-2">{f.question}</dt>
          <dd className="text-foreground/80 leading-relaxed max-w-3xl">{f.answer}</dd>
        </div>
      ))}
    </dl>
  </section>
);

/** Links to the other guides, so readers (and crawlers) can move between them */
export const RelatedGuides: React.FC<{ current: string }> = ({ current }) => {
  const guides = [
    { to: '/cold-brew-coffee', label: 'Cold brew coffee: what it is and how to make it in 5 seconds' },
    { to: '/cold-brew-coffee-price', label: 'Cold brew coffee price in India: café vs bottle vs tube' },
    { to: '/ready-to-drink-coffee', label: 'Ready-to-drink coffee in India: bottle, can or press tube?' },
  ].filter((g) => g.to !== current);
  return (
    <nav aria-label="Related guides" className="border-t border-foreground pt-8">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-foreground/60 mb-4">Keep reading</p>
      <ul className="space-y-3">
        {guides.map((g) => (
          <li key={g.to}>
            <Link to={g.to} className="text-lg text-foreground underline underline-offset-4 hover:text-primary">
              {g.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export const productPrice = (id: string) => productById(id).price;
