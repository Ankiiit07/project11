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

const URL = `${SITE}/blog/how-to-make-coffee-without-machine`;

const FAQS: FAQ[] = [
  {
    question: 'How do I make coffee without a coffee maker?',
    answer:
      'Steep ground coffee in hot water and strain it. A French press, a pour-over cone, a saucepan (cowboy coffee) or even a tea strainer all work. Use about 1 tablespoon of ground coffee per 100 ml of water just off the boil, and steep for about 4 minutes.',
  },
  {
    question: 'How much coffee should I use per cup?',
    answer:
      'A good starting point is 1 g of coffee for every 15 to 16 ml of water: about 15 g, or two level tablespoons, for a 250 ml mug. Use more for stronger coffee, less for lighter.',
  },
  {
    question: 'What water temperature is best for coffee?',
    answer:
      'Just off the boil, around 90 to 96 °C. Let boiling water rest for about 30 seconds before pouring; fully boiling water can taste harsh on the coffee.',
  },
  {
    question: 'What is the fastest way to make real coffee without a machine?',
    answer:
      'A brewed coffee concentrate. A Cafe at Once tube is coffee that has already been brewed: squeeze it into 150 to 300 ml of water or milk, hot or cold, stir, and it is ready in about 5 seconds.',
  },
];

const HowToMakeCoffeeWithoutMachine: React.FC = () => (
  <div className="min-h-screen bg-background pt-28 pb-20">
    <SEO
      title="How to Make Coffee Without a Machine (5 Easy Methods) | Cafe at Once"
      description="No coffee machine? Five ways to make good coffee at home or on the road: French press, pour-over, cowboy coffee, cold brew and a 5-second press tube, with ratios and steps."
      keywords="how to make coffee without machine, coffee without coffee maker, french press, pour over coffee, cowboy coffee, cold brew at home"
      url={URL}
      type="article"
      breadcrumbs={[
        { name: 'Home', url: SITE },
        { name: 'Blog', url: `${SITE}/insights` },
        { name: 'How to Make Coffee Without a Machine', url: URL },
      ]}
      faq={FAQS}
      howTo={{
        name: 'How to make coffee without a machine',
        description: 'Five ways to make good coffee without an espresso machine or coffee maker.',
        totalTime: 'PT5M',
        steps: [
          { name: 'French press', text: 'Add 15 g coarse coffee per 250 ml water just off the boil, steep 4 minutes, press and pour.' },
          { name: 'Pour-over', text: 'Pour 250 ml of hot water slowly over 15 g medium-fine coffee in a paper filter, over about 3 minutes.' },
          { name: 'Cowboy coffee', text: 'Stir coarse coffee into just-boiled water in a pan, steep 4 minutes, settle the grounds with a splash of cold water and pour.' },
          { name: 'Cold brew', text: 'Steep coarse coffee in cold water (1:8) for 12 to 18 hours in the fridge, strain, and dilute 1:1.' },
          { name: 'Press tube', text: 'Squeeze a Cafe at Once tube into 150 to 300 ml of water or milk, hot or cold, and stir.' },
        ],
      }}
    />

    <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <GuideHeader
        label="Brewing guide"
        title={
          <>
            How to make coffee <span className="text-primary">without a machine</span>
          </>
        }
        intro="You do not need an espresso machine for good coffee. Here are five ways to make it with a kettle, a pan, a jar, or nothing at all, with the ratios and steps for each."
        updated="October 2026"
      />

      <GuideSection title="The five methods at a glance">
        <GuideTable
          head={['Method', 'Time', 'You need', 'Taste']}
          rows={[
            ['French press', '4 minutes', 'French press, coarse coffee, hot water', 'Full-bodied, rich'],
            ['Pour-over', '3 to 4 minutes', 'Cone, paper filter, medium-fine coffee, hot water', 'Clean, bright'],
            ['Cowboy coffee', '5 minutes', 'Saucepan, coarse coffee', 'Strong, rustic'],
            ['Cold brew', '12 to 18 hours', 'Jar, coarse coffee, strainer, fridge', 'Smooth, mellow'],
            ['Press tube', '5 seconds', 'Any water or milk, hot or cold', 'Brewed Arabica, ready to drink'],
          ]}
        />
        <p>
          Two rules apply to every brewed method: use about 1 g of coffee for every 15 to 16 ml of water (two level
          tablespoons for a 250 ml mug), and use water just off the boil, around 90 to 96 °C.
        </p>
      </GuideSection>

      <GuideSection title="1. French press (4 minutes)">
        <GuideSteps
          steps={[
            'Add 15 g of coarsely ground coffee to the press for every 250 ml of water.',
            'Pour in water just off the boil and stir gently.',
            'Put the lid on and steep for 4 minutes.',
            'Press the plunger down slowly and pour straight away, so it does not keep brewing.',
          ]}
        />
      </GuideSection>

      <GuideSection title="2. Pour-over (3 to 4 minutes)">
        <GuideSteps
          steps={[
            'Put a paper filter in the cone and rinse it with hot water (pour that water away).',
            'Add 15 g of medium-fine coffee for 250 ml of water.',
            'Pour a little water to wet the grounds and wait 30 seconds while they bloom.',
            'Pour the rest slowly in circles, finishing in about 3 minutes.',
          ]}
        />
        <p>No cone? Coffee drip bags work the same way: hang one over your mug and pour.</p>
      </GuideSection>

      <GuideSection title="3. Cowboy coffee (5 minutes)">
        <GuideSteps
          steps={[
            'Bring water to the boil in a saucepan, take it off the heat and let it rest 30 seconds.',
            'Stir in coarse coffee: about two tablespoons per 250 ml.',
            'Steep for 4 minutes.',
            'Add a small splash of cold water to sink the grounds, then pour slowly, or through a tea strainer.',
          ]}
        />
      </GuideSection>

      <GuideSection title="4. Cold brew (12 to 18 hours)">
        <GuideSteps
          steps={[
            'Mix coarse coffee with cold water in a jar, about 1 part coffee to 8 parts water.',
            'Cover and leave in the fridge for 12 to 18 hours.',
            'Strain through a fine sieve or a cloth.',
            'Dilute about 1:1 with water or milk and pour over ice. Keeps about a week in the fridge.',
          ]}
        />
        <p>
          Want the same smooth cup without the wait? See our guide to{' '}
          <Link to="/cold-brew-coffee" className="text-primary underline underline-offset-4">cold brew coffee in 5 seconds</Link>.
        </p>
      </GuideSection>

      <GuideSection title="5. Press tube (5 seconds)">
        <p>
          The fastest way, and the only one that needs no grinding, steeping or hot water. A{' '}
          <Link to="/products" className="text-primary underline underline-offset-4">Cafe at Once</Link> tube holds real
          coffee that has already been brewed from 100% Arabica and sealed with nitrogen, so it keeps for 12 months
          without a fridge.
        </p>
        <GuideSteps
          steps={[
            'Peel the tube open.',
            'Squeeze it into 150 ml of water or milk for a bold cup, or 300 ml for a lighter one, hot or cold.',
            'Stir and drink.',
          ]}
        />
      </GuideSection>

      <ProductCallout
        id="americano-concentrate"
        pitch="Brewed 100% Arabica in a press tube. No machine, no kettle, no fridge. Real coffee in 5 seconds."
      />

      <GuideFAQ faqs={FAQS} />
      <RelatedGuides current="" />
    </article>
  </div>
);

export default HowToMakeCoffeeWithoutMachine;
