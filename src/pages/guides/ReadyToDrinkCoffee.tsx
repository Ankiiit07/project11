import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import { GuideFAQ, GuideHeader, GuideSection, GuideTable, RelatedGuides, SITE, type FAQ } from '../../components/GuidePage';
import { products } from '../../data/products';

const URL = `${SITE}/ready-to-drink-coffee`;

const FAQS: FAQ[] = [
  {
    question: 'What is ready-to-drink coffee?',
    answer:
      'Ready-to-drink (RTD) coffee is coffee you can drink without brewing anything: bottled or canned cold coffee, and coffee concentrates you only mix with water or milk. Cafe at Once is a ready-to-drink coffee in a press tube: real brewed coffee you squeeze into water or milk.',
  },
  {
    question: 'Is a press tube really ready to drink?',
    answer:
      'Almost. You squeeze it into 150 to 300 ml of water or milk, hot or cold, and stir. It takes about 5 seconds, needs no machine, kettle or fridge, and you choose the strength.',
  },
  {
    question: 'Which is healthier, bottled cold coffee or a coffee concentrate?',
    answer:
      'It depends on what is in it. Many bottled cold coffees are pre-mixed with milk and sugar. Cafe at Once tubes are 100% Arabica coffee with no sugar or preservatives, so you add only what you want.',
  },
  {
    question: 'Can I carry ready-to-drink coffee when I travel?',
    answer:
      'Bottles and cans are heavy and count as liquids at airport security. A Cafe at Once tube holds 16 g of concentrate, well under cabin liquid limits, and needs no fridge, so it fits in a pocket or a cabin bag.',
  },
  {
    question: 'How long does ready-to-drink coffee last?',
    answer:
      'Bottled cold coffee should be kept cool and drunk soon after opening. Cafe at Once tubes are sealed with nitrogen and keep for 12 months unopened, with no refrigeration.',
  },
];

const ReadyToDrinkCoffee: React.FC = () => {
  const range = products.filter((p) => p.inStock && !p.isPreOrder);
  return (
    <div className="min-h-screen bg-background pt-28 pb-20">
      <SEO
        title="Ready to Drink Coffee in India: Bottle, Can or Press Tube? | Cafe at Once"
        description="Ready-to-drink coffee compared: bottles and cans vs a press tube of real brewed Arabica. No machine, no fridge, no added sugar, ready in 5 seconds. Delivered across India."
        keywords="ready to drink coffee, ready to drink coffee India, RTD coffee, instant cold coffee, coffee concentrate, travel coffee"
        url={URL}
        type="article"
        breadcrumbs={[
          { name: 'Home', url: SITE },
          { name: 'Ready to drink coffee', url: URL },
        ]}
        faq={FAQS}
      />

      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <GuideHeader
          label="Ready-to-drink coffee"
          title={
            <>
              Ready-to-drink coffee, <span className="text-primary">minus the bottle</span>
            </>
          }
          intro="Ready-to-drink coffee means no brewing, no machine and no waiting. Bottles and cans are one way to get it. A press tube of real brewed coffee is another, and it fits in your pocket."
          updated="October 2026"
        />

        <GuideSection title="Bottle, can or press tube?">
          <GuideTable
            head={['', 'Bottle or can', 'Cafe at Once press tube']}
            rows={[
              ['What is inside', 'Usually a ready-mixed drink, often with milk and sugar', '100% Arabica brewed coffee, nothing added'],
              ['Size to carry', '200 to 250 ml of liquid', '16 g tube'],
              ['Fridge', 'Best chilled, keep cold once open', 'Not needed; 12 months sealed'],
              ['Hot or cold', 'Cold only', 'Hot or cold, with water or milk'],
              ['Strength', 'Fixed', 'You choose: 150 ml bold, 300 ml lighter'],
              ['Flights', 'Counts as a liquid', 'Well under cabin liquid limits'],
            ]}
          />
        </GuideSection>

        <GuideSection title="How a press tube works">
          <p>
            Each tube holds real coffee that has already been brewed, then sealed with nitrogen instead of air so it
            stays fresh for 12 months with no fridge and no preservatives. Squeeze it into 150 to 300 ml of water or milk,
            stir, and it is ready in about 5 seconds. See{' '}
            <Link to="/blog/what-is-nitrogen-preserved-coffee" className="text-primary underline underline-offset-4">how nitrogen preservation works</Link>.
          </p>
        </GuideSection>

        <GuideSection title="The range">
          <ul className="border-y border-foreground divide-y divide-foreground/20">
            {range.map((p) => (
              <li key={p.id} className="grid grid-cols-[1fr_auto] gap-4 py-4 items-baseline">
                <Link to={`/products/${encodeURIComponent(p.id)}`} className="font-heading text-lg sm:text-xl font-bold text-foreground hover:text-primary">
                  {p.name}
                </Link>
                <span className="font-heading text-lg font-extrabold text-foreground">₹{p.price}</span>
              </li>
            ))}
          </ul>
          <p>
            Prefer it cold? Read our guide to{' '}
            <Link to="/cold-brew-coffee" className="text-primary underline underline-offset-4">cold brew coffee</Link>, or{' '}
            <Link to="/products" className="text-primary underline underline-offset-4">shop the full range</Link>.
          </p>
        </GuideSection>

        <GuideFAQ faqs={FAQS} />
        <RelatedGuides current="/ready-to-drink-coffee" />
      </article>
    </div>
  );
};

export default ReadyToDrinkCoffee;
