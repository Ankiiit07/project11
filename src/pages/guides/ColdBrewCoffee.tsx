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
  productPrice,
  type FAQ,
} from '../../components/GuidePage';

const URL = `${SITE}/cold-brew-coffee`;

const FAQS: FAQ[] = [
  {
    question: 'What is cold brew coffee?',
    answer:
      'Cold brew is coffee made by steeping ground coffee in cold or room-temperature water for 12 to 24 hours instead of brewing it with hot water. The slow, cool extraction gives a smooth, rounder cup that tastes less bitter and less sharp than hot coffee.',
  },
  {
    question: 'Is cold brew the same as iced coffee?',
    answer:
      'No. Iced coffee is regular hot-brewed coffee poured over ice, so it keeps the bitterness and sharpness of hot coffee and gets watered down as the ice melts. Cold brew is brewed cold from the start, which is why it tastes smoother.',
  },
  {
    question: 'Is cold brew stronger than regular coffee?',
    answer:
      'It depends on how much you dilute it. Cold brew is usually made as a concentrate and then mixed with water, milk or ice. With Cafe at Once you choose the strength: one tube in about 150 ml makes a bold cup, in about 300 ml a lighter one.',
  },
  {
    question: 'How do I make cold brew without waiting 24 hours?',
    answer:
      'Use a cold brew concentrate that has already been brewed. A Cafe at Once Cold Brew tube is real brewed 100% Arabica cold brew sealed with nitrogen: squeeze it into 150 to 300 ml of cold water with ice, stir, and it is ready in about 5 seconds.',
  },
  {
    question: 'Does cold brew need to be kept in the fridge?',
    answer:
      'Home-made cold brew does, and it only keeps for about a week or two. Cafe at Once tubes are nitrogen-sealed, so they need no refrigeration and keep for 12 months unopened. Use a tube once you open it.',
  },
  {
    question: 'Can I drink cold brew hot?',
    answer:
      'Yes. A cold brew concentrate can be mixed with hot water or hot milk. It stays smooth, though most people prefer it over ice.',
  },
];

const ColdBrewCoffee: React.FC = () => (
  <div className="min-h-screen bg-background pt-28 pb-20">
    <SEO
      title="Cold Brew Coffee in India: Real Cold Brew in 5 Seconds | Cafe at Once"
      description={`What cold brew coffee is, how it differs from iced coffee, and how to make real cold brew in 5 seconds with no steeping. 100% Arabica cold brew concentrate from ₹${productPrice('cold-brew-concentrate')}, delivered across India.`}
      keywords="cold brew coffee, cold brew coffee India, cold brew concentrate, how to make cold brew, cold brew vs iced coffee, buy cold brew online"
      url={URL}
      type="article"
      breadcrumbs={[
        { name: 'Home', url: SITE },
        { name: 'Cold brew coffee', url: URL },
      ]}
      faq={FAQS}
      howTo={{
        name: 'How to make cold brew coffee in 5 seconds',
        description: 'Make a glass of real cold brew from a Cafe at Once Cold Brew tube, with no steeping or straining.',
        totalTime: 'PT1M',
        steps: [
          { name: 'Fill a glass', text: 'Fill a glass with ice and 150 to 300 ml of cold water.' },
          { name: 'Press', text: 'Peel the tube open and squeeze the cold brew concentrate into the glass.' },
          { name: 'Stir', text: 'Stir once and drink. Add milk if you like.' },
        ],
      }}
    />

    <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <GuideHeader
        label="Cold brew guide"
        title={
          <>
            Cold brew coffee, <span className="text-primary">without the 18-hour wait</span>
          </>
        }
        intro="Cold brew is the smoothest way to drink coffee cold, and the slowest to make. Here is what it is, how it differs from iced coffee, and how to get a real glass of it in 5 seconds."
        updated="October 2026"
      />

      <GuideSection title="What is cold brew coffee?">
        <p>
          Cold brew is coffee that is never heated. Ground coffee steeps in cold or room-temperature water for 12 to 24
          hours, then the grounds are strained out. Hot water pulls bitter, sharp-tasting compounds out of coffee in
          minutes; cold water works slowly and gently, so the cup that comes out is smooth, rounded and naturally a
          little sweet, even with no sugar.
        </p>
        <p>
          It is usually brewed strong, as a concentrate, and then diluted with water, milk or ice. That is why cold
          brew holds up in a glass of ice instead of tasting watery.
        </p>
      </GuideSection>

      <GuideSection title="Cold brew vs iced coffee">
        <p>They look the same in the glass. They are not the same drink.</p>
        <GuideTable
          head={['', 'Cold brew', 'Iced coffee']}
          rows={[
            ['How it is made', 'Steeped cold for 12 to 24 hours', 'Brewed hot, then poured over ice'],
            ['Taste', 'Smooth, mellow, less bitter', 'Sharper and more bitter, like hot coffee'],
            ['Over ice', 'Brewed strong, so it stays full-flavoured', 'Gets diluted as the ice melts'],
            ['Time to make at home', 'A day, plus straining', 'About 5 minutes'],
          ]}
        />
      </GuideSection>

      <GuideSection title="Why most people don't make it at home">
        <p>
          Cold brew is simple but slow. You need coarse-ground coffee, a jar, a day of waiting, a filter, and room in
          the fridge, and the batch only keeps for about a week or two before it tastes flat. If you want one glass on
          a hot afternoon, at the gym or on a trip, home brewing is no help.
        </p>
      </GuideSection>

      <GuideSection title="Real cold brew in 5 seconds">
        <p>
          A <Link to="/products/cold-brew-concentrate" className="text-primary underline underline-offset-4">Cafe at Once Cold Brew</Link>{' '}
          tube is the brewing already done. It is real cold brew made from 100% Arabica coffee, sealed in a 16 g press
          tube with nitrogen instead of air, so it keeps for 12 months without a fridge and with nothing added: no sugar,
          no preservatives.
        </p>
        <GuideSteps
          steps={[
            'Fill a glass with ice and 150 to 300 ml of cold water (less water for a bolder cup).',
            'Peel the tube open and squeeze the cold brew in.',
            'Stir once. That is it: no steeping, no straining, no machine.',
          ]}
        />
        <p>
          The tube is small and sealed, so it goes in a gym bag, a desk drawer or a cabin bag. Read more on{' '}
          <Link to="/blog/what-is-nitrogen-preserved-coffee" className="text-primary underline underline-offset-4">how nitrogen keeps coffee fresh</Link>.
        </p>
      </GuideSection>

      <ProductCallout
        id="cold-brew-concentrate"
        pitch="Real 100% Arabica cold brew concentrate, nitrogen-sealed. One tube makes one or two glasses. No sugar, no fridge needed."
      />

      <GuideSection title="Ways to drink it">
        <GuideTable
          head={['Drink', 'How']}
          rows={[
            ['Black over ice', 'One tube, 150 to 300 ml cold water, a full glass of ice.'],
            ['Cold brew with milk', 'One tube over ice, topped with cold milk or oat milk.'],
            ['Cold brew tonic', 'One tube over ice, topped with tonic water. Bright and fizzy.'],
            ['Hot', 'One tube in a mug of hot water or hot milk, when the weather turns.'],
          ]}
        />
      </GuideSection>

      <GuideSection title="What does cold brew cost?">
        <p>
          A café cold brew in India typically costs ₹280 to ₹460 a cup, and bottled cold coffee ₹85 to ₹150 for 200 to
          250 ml. A Cafe at Once Cold Brew tube is ₹{productPrice('cold-brew-concentrate')} and makes one or two glasses.
          See the full comparison in our{' '}
          <Link to="/cold-brew-coffee-price" className="text-primary underline underline-offset-4">cold brew coffee price guide</Link>.
        </p>
      </GuideSection>

      <GuideFAQ faqs={FAQS} />
      <RelatedGuides current="/cold-brew-coffee" />
    </article>
  </div>
);

export default ColdBrewCoffee;
