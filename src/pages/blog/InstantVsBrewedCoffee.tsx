import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import {
  GuideFAQ,
  GuideHeader,
  GuideSection,
  GuideSteps,
  GuideTable,
  ProductCallout,
  RelatedGuides,
  SITE,
  type FAQ,
} from '../../components/GuidePage';

const URL = `${SITE}/blog/instant-vs-brewed-coffee-difference`;

const FAQS: FAQ[] = [
  {
    question: 'Is instant coffee real coffee?',
    answer:
      'Yes, it is made from coffee: coffee is brewed very strong, then dried into powder or granules. But drying removes much of the aroma, and instant coffee is often made from cheaper beans, so it tastes flatter and more bitter than freshly brewed coffee.',
  },
  {
    question: 'What is the difference between spray-dried and freeze-dried instant coffee?',
    answer:
      'Spray-dried coffee is sprayed as a mist into hot air, which dries it into fine powder quickly and cheaply. Freeze-dried coffee is frozen and dried under vacuum, which is gentler and keeps more flavour, so it usually costs more. Both lose aroma compared with brewed coffee.',
  },
  {
    question: 'Is brewed coffee healthier than instant?',
    answer:
      'Black coffee of either kind has almost no calories. The bigger difference is usually what goes in with it: many instant mixes add sugar, milk powder or creamer. Check the label. Cafe at Once tubes are only brewed Arabica coffee, with no sugar.',
  },
  {
    question: 'Is there something as quick as instant but brewed?',
    answer:
      'Yes: a brewed coffee concentrate. Cafe at Once is real brewed Arabica coffee, sealed with nitrogen in a press tube. Squeeze it into water or milk and it is ready in about 5 seconds, as fast as a jar of instant.',
  },
];

const InstantVsBrewedCoffee: React.FC = () => (
  <div className="min-h-screen bg-background pt-28 pb-20">
    <SEO
      title="Instant Coffee vs Brewed Coffee: What's Really in Your Cup? | Cafe at Once"
      description="How instant coffee is made, what spray-drying and freeze-drying do to flavour, and how to get brewed coffee as fast as instant. A plain-English comparison."
      keywords="instant vs brewed coffee, instant coffee vs filter coffee, how is instant coffee made, freeze dried vs spray dried coffee, brewed coffee concentrate"
      url={URL}
      type="article"
      breadcrumbs={[
        { name: 'Home', url: SITE },
        { name: 'Blog', url: `${SITE}/insights` },
        { name: 'Instant vs Brewed Coffee', url: URL },
      ]}
      faq={FAQS}
    />

    <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <GuideHeader
        label="Coffee basics"
        title={
          <>
            Instant vs brewed coffee: <span className="text-primary">what's really in your cup?</span>
          </>
        }
        intro="Instant coffee is fast and cheap, and India drinks a lot of it. Here is how it is made, why it tastes the way it does, and how to get brewed coffee just as quickly."
        updated="October 2026"
      />

      <GuideSection title="How instant coffee is made">
        <p>
          Instant coffee starts as brewed coffee. Roasted coffee is brewed in large batches into a very strong
          extract, which is then dried until only soluble coffee solids are left. There are two ways to dry it:
        </p>
        <GuideTable
          head={['Method', 'How', 'Result']}
          rows={[
            ['Spray-dried', 'The extract is sprayed as a mist into hot air', 'Fine powder; cheapest, loses the most aroma'],
            ['Freeze-dried', 'The extract is frozen, then dried under vacuum', 'Granules; gentler, keeps more flavour, costs more'],
          ]}
        />
        <p>
          Either way, the drying drives off many of the volatile aroma compounds that make fresh coffee smell and taste
          the way it does. Instant coffee is also often made with cheaper beans, frequently Robusta, which taste
          harsher and more bitter than Arabica. Some makers spray aroma back onto the granules to make up for it.
        </p>
      </GuideSection>

      <GuideSection title="What brewing keeps">
        <p>
          When you brew coffee, whether in a filter, a French press or an espresso machine, hot water pulls oils,
          acids, sugars and aromatics out of the grounds and straight into your cup. Nothing is dried or reconstituted
          in between. That is where the body, the aroma and the layered taste come from: the chocolate, nutty or fruity
          notes that instant coffee mostly lacks.
        </p>
        <p>
          The catch has always been time and equipment: a grinder, a brewer, hot water, and the minutes it takes. Our
          guide to{' '}
          <Link to="/blog/how-to-make-coffee-without-machine" className="text-primary underline underline-offset-4">
            making coffee without a machine
          </Link>{' '}
          covers the simplest ways to brew at home.
        </p>
      </GuideSection>

      <GuideSection title="Side by side">
        <GuideTable
          head={['', 'Instant', 'Freshly brewed', 'Brewed concentrate (press tube)']}
          rows={[
            ['Time', 'About 30 seconds', '4 to 10 minutes', 'About 5 seconds'],
            ['Equipment', 'Hot water', 'Grinder, brewer, kettle', 'None; hot or cold water'],
            ['Taste', 'Flat, often bitter', 'Full aroma and body', 'Brewed taste, kept by nitrogen'],
            ['Typical beans', 'Often Robusta or blends', 'Your choice', '100% Arabica (Cafe at Once)'],
            ['Keeps', 'Months once opened', 'Best within the hour', '12 months sealed, no fridge'],
          ]}
        />
      </GuideSection>

      <GuideSection title="The middle ground: brewed coffee, sealed">
        <p>
          A brewed coffee concentrate skips the drying step altogether. Cafe at Once coffee is brewed from 100% Arabica
          and sealed in a press tube with nitrogen in place of air, so it keeps its brewed taste for 12 months without a
          fridge or preservatives. Read how{' '}
          <Link to="/blog/what-is-nitrogen-preserved-coffee" className="text-primary underline underline-offset-4">
            nitrogen preservation
          </Link>{' '}
          works.
        </p>
      </GuideSection>

      <ProductCallout
        id="americano-concentrate"
        pitch="Brewed 100% Arabica Americano in a press tube. As fast as instant, with the taste of a brewed cup. No sugar, no additives."
      />

      <GuideSection title="Taste the difference yourself">
        <p>You do not need to take our word for it. A side-by-side tasting at home takes five minutes:</p>
        <GuideSteps
          steps={[
            'Make two cups the same size with the same water: one with a spoon of instant, one with a Cafe at Once tube.',
            'Smell each before tasting. Aroma is the first thing drying takes away.',
            'Taste them black first, then with the same splash of milk.',
            'Notice the finish: how bitter or flat each one tastes a few seconds after you swallow.',
          ]}
        />
      </GuideSection>

      <GuideFAQ faqs={FAQS} />
      <RelatedGuides current="" />
    </article>
  </div>
);

export default InstantVsBrewedCoffee;
