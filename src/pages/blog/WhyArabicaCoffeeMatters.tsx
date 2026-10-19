import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import {
  GuideFAQ,
  GuideHeader,
  GuideSection,
  GuideTable,
  ProductCallout,
  RelatedGuides,
  SITE,
  type FAQ,
} from '../../components/GuidePage';

const URL = `${SITE}/blog/why-arabica-coffee-matters`;

const FAQS: FAQ[] = [
  {
    question: 'Is Arabica better than Robusta?',
    answer:
      'For flavour, most people prefer Arabica: it is sweeter, softer and more aromatic. Robusta is stronger, more bitter and has more caffeine, which is why it is used in many instant coffees and in some espresso blends for crema. Better depends on what you want from the cup.',
  },
  {
    question: 'Does Arabica have less caffeine than Robusta?',
    answer:
      'Yes. Arabica beans typically contain a little over 1% caffeine and Robusta about twice that. That is one reason Robusta tastes more bitter.',
  },
  {
    question: 'Is coffee grown in India Arabica?',
    answer:
      'India grows both. Arabica is grown at higher altitudes, mainly in the hills of Karnataka (Chikmagalur and Coorg), Kerala, Tamil Nadu (the Nilgiris) and Andhra Pradesh (Araku). Robusta is grown more widely at lower altitudes.',
  },
  {
    question: 'Is Cafe at Once 100% Arabica?',
    answer:
      'Yes. Every Cafe at Once coffee is brewed from 100% Arabica coffee, with no sugar, preservatives or flavourings added.',
  },
];

const WhyArabicaCoffeeMatters: React.FC = () => (
  <div className="min-h-screen bg-background pt-28 pb-20">
    <SEO
      title="Arabica vs Robusta: Why Arabica Coffee Matters | Cafe at Once"
      description="Arabica vs Robusta explained: taste, caffeine, where they grow, including India, and how to tell good Arabica coffee from the label."
      keywords="arabica vs robusta, why arabica coffee, arabica coffee India, 100% arabica coffee, arabica caffeine"
      url={URL}
      type="article"
      breadcrumbs={[
        { name: 'Home', url: SITE },
        { name: 'Blog', url: `${SITE}/insights` },
        { name: 'Why Arabica Coffee Matters', url: URL },
      ]}
      faq={FAQS}
    />

    <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <GuideHeader
        label="Coffee basics"
        title={
          <>
            Why <span className="text-primary">Arabica</span> coffee matters
          </>
        }
        intro="Almost all the coffee in the world comes from two species: Arabica and Robusta. They taste very different. Here is what sets them apart, where India fits in, and what to look for on a label."
        updated="October 2026"
      />

      <GuideSection title="Arabica vs Robusta at a glance">
        <GuideTable
          head={['', 'Arabica', 'Robusta']}
          rows={[
            ['Taste', 'Sweeter, softer, aromatic; fruity, floral or chocolatey notes', 'Stronger, harsher, more bitter; earthy, woody notes'],
            ['Caffeine', 'A little over 1% of the bean', 'About twice as much'],
            ['Where it grows', 'Higher altitudes, cooler climates', 'Lower altitudes, hotter climates'],
            ['Growing', 'More delicate, more prone to pests and disease', 'Hardier, higher yields'],
            ['Share of world coffee', 'Around 60%', 'Most of the rest'],
            ['Common uses', 'Specialty coffee, filter, cafés', 'Instant coffee, some espresso blends'],
          ]}
        />
      </GuideSection>

      <GuideSection title="Why Arabica tastes better">
        <p>
          Arabica beans carry more natural sugars and oils and less caffeine than Robusta. Caffeine itself is bitter, so
          having less of it, plus more sugars to caramelise during roasting, is a big part of why Arabica tastes sweeter
          and smoother. The aromatic oils are where the fruity, floral and chocolatey notes come from.
        </p>
        <p>
          Robusta has its place: it is hardy, cheap to grow and adds punch and crema to some espresso blends. But for a
          cup you drink black, or a cold brew you want smooth, Arabica is the one to choose.
        </p>
      </GuideSection>

      <GuideSection title="Why it costs more">
        <p>
          Arabica needs altitude, steady temperatures and careful growing. It yields less per plant and is more easily
          hit by pests, disease and bad weather. Good Arabica is also often picked by hand, so only ripe cherries go in.
          All of that costs more, and it is why cheaper coffees, especially many instant coffees, lean on Robusta.
        </p>
      </GuideSection>

      <GuideSection title="Arabica in India">
        <p>
          India grows both species. Its Arabica comes from the hills: Chikmagalur and Coorg in Karnataka, Wayanad in
          Kerala, the Nilgiris in Tamil Nadu and the Araku valley in Andhra Pradesh, usually grown in the shade of
          taller trees alongside pepper and spices.
        </p>
      </GuideSection>

      <GuideSection title="How to read a coffee label">
        <p>A few things on a pack tell you most of what you need to know:</p>
        <GuideTable
          head={['Look for', 'Why']}
          rows={[
            ['"100% Arabica"', 'Without the "100%", it may be a blend with Robusta.'],
            ['Origin or estate', 'A named region or estate means the roaster knows where it came from.'],
            ['Roast or brew date', 'Coffee loses aroma with time; a recent date, or a sealed pack, matters.'],
            ['Ingredients', 'For ready-made coffee, the shorter the list the better: ideally just coffee.'],
          ]}
        />
        <p>
          Freshness matters as much as the bean. Read how{' '}
          <Link to="/blog/what-is-nitrogen-preserved-coffee" className="text-primary underline underline-offset-4">
            nitrogen keeps brewed coffee fresh
          </Link>
          .
        </p>
      </GuideSection>

      <ProductCallout
        id="americano-concentrate"
        pitch="100% Arabica, brewed and sealed with nitrogen. One ingredient, no sugar, ready in 5 seconds."
      />

      <GuideFAQ faqs={FAQS} />
      <RelatedGuides current="" />
    </article>
  </div>
);

export default WhyArabicaCoffeeMatters;
