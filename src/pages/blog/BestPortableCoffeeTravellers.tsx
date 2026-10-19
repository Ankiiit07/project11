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

const URL = `${SITE}/blog/best-portable-coffee-travellers-india`;

const FAQS: FAQ[] = [
  {
    question: 'Can I carry coffee in my cabin bag on Indian flights?',
    answer:
      'Ground coffee, instant sachets and drip bags are fine. Liquids in cabin bags are generally limited to 100 ml per container, so a bottle of cold coffee usually is not. A Cafe at Once tube holds 16 g of concentrate, well under that limit.',
  },
  {
    question: 'What is the best coffee for a hotel room?',
    answer:
      'Anything that only needs water. Most hotel rooms have a kettle, so drip bags and press tubes both work. If the kettle is missing or doubtful, a press tube works with cold or room-temperature water too.',
  },
  {
    question: 'What coffee can I take trekking or camping?',
    answer:
      'Something light, sealed and spill-proof that needs no fridge. Press tubes work with cold stream or bottled water, so you do not have to boil water at altitude. Carry your empty tubes back out.',
  },
  {
    question: 'How long does Cafe at Once last in a bag?',
    answer:
      'Twelve months from manufacture, unopened, with no refrigeration. Keep tubes out of direct sun, for example inside your bag rather than on a car dashboard.',
  },
];

const BestPortableCoffeeTravellers: React.FC = () => (
  <div className="min-h-screen bg-background pt-28 pb-20">
    <SEO
      title="Best Portable Coffee for Travellers in India (2026 Guide) | Cafe at Once"
      description="Flights, trains, hotel rooms and treks: the best portable coffee options for Indian travellers compared, from instant sachets and drip bags to press tubes, plus practical tips."
      keywords="portable coffee India, travel coffee, coffee for travel, best coffee for flights, coffee for trekking, hotel room coffee"
      url={URL}
      type="article"
      breadcrumbs={[
        { name: 'Home', url: SITE },
        { name: 'Blog', url: `${SITE}/insights` },
        { name: 'Best Portable Coffee for Travellers', url: URL },
      ]}
      faq={FAQS}
    />

    <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <GuideHeader
        label="Travel guide"
        title={
          <>
            The best portable coffee <span className="text-primary">for travellers in India</span>
          </>
        }
        intro="A 6 am flight, an overnight train, a budget hotel or a trek in Himachal: good coffee on the road is hard to find. Here is every way to carry your own, compared honestly."
        updated="October 2026"
      />

      <GuideSection title="What makes coffee good for travel">
        <p>Before comparing options, here is what actually matters when you are away from your kitchen:</p>
        <GuideTable
          head={['Need', 'Why it matters']}
          rows={[
            ['Small and light', 'Bag space and baggage weight are limited'],
            ['Sealed and spill-proof', 'Nothing leaks over your clothes'],
            ['Cabin-friendly', 'Liquids in cabin bags are generally capped at 100 ml per container'],
            ['No fridge needed', 'Hotel rooms, trains and tents rarely have one'],
            ['Works with any water', 'Hot water is not always available, or safe'],
            ['Tastes like real coffee', 'The reason you are carrying it at all'],
          ]}
        />
      </GuideSection>

      <GuideSection title="Your options, compared">
        <GuideTable
          head={['Option', 'Needs', 'Taste', 'Good for', 'Watch out for']}
          rows={[
            ['Instant sachets', 'Hot water', 'Flat, often bitter', 'Anywhere with a kettle', 'Many are pre-mixed with sugar and creamer'],
            ['Drip bags (pour-over bags)', 'Hot water, a mug, 3 to 4 minutes', 'Good', 'Hotel rooms', 'Need properly hot water; bags go stale once opened'],
            ['Travel French press or AeroPress', 'Ground coffee, hot water, washing up', 'Very good', 'Road trips, long stays', 'Bulky, and you carry the grounds out'],
            ['Bottled or canned cold coffee', 'Nothing', 'Varies; often sweet', 'Train and road journeys', 'Heavy, best chilled, not allowed through cabin security'],
            [
              <Link key="t" to="/products" className="text-primary underline underline-offset-4">
                Nitrogen-preserved press tube
              </Link>,
              'Any water or milk, hot or cold',
              'Brewed taste',
              'Flights, hotels, treks, office',
              'Use a tube once it is opened',
            ],
          ]}
        />
      </GuideSection>

      <GuideSection title="Why press tubes win on the road">
        <p>
          A Cafe at Once tube is real brewed 100% Arabica coffee, sealed with nitrogen so it keeps for 12 months without a
          fridge. It holds 16 g of concentrate, so it fits in a pocket and stays well under cabin liquid limits. Squeeze
          it into 150 to 300 ml of water or milk, hot or cold, stir, and it is ready in about 5 seconds. There is nothing
          to wash up and nothing to boil. Read{' '}
          <Link to="/blog/what-is-nitrogen-preserved-coffee" className="text-primary underline underline-offset-4">
            how nitrogen keeps it fresh
          </Link>
          .
        </p>
      </GuideSection>

      <ProductCallout
        id="latte-pack-6"
        pitch="Six Latte tubes for the trip: real brewed Arabica, no fridge, cabin-bag friendly. Our best price per cup."
      />

      <GuideSection title="Practical tips, trip by trip">
        <GuideTable
          head={['Where', 'Tip']}
          rows={[
            ['Flights', 'Keep a tube in your pocket and ask the crew for hot water; a bottle of cold water works too.'],
            ['Trains', 'Pantry cars and station stalls can usually give you hot water; a bottle of water at room temperature works just as well.'],
            ['Hotel rooms', 'Rinse the kettle first. No kettle? Mix with the room\'s bottled water and some ice from the bar.'],
            ['Treks and camping', 'Skip the stove: mix with cold water at camp. Pack empty tubes out with your rubbish.'],
            ['Road trips', 'Keep tubes in your bag, not on the dashboard in direct sun.'],
            ['Office and meetings', 'Keep a few in a drawer for the afternoon slump; no queue at the machine.'],
          ]}
        />
        <p>
          Prefer it iced? Our guide to{' '}
          <Link to="/cold-brew-coffee" className="text-primary underline underline-offset-4">cold brew coffee</Link> shows how to
          make a glass in 5 seconds.
        </p>
      </GuideSection>

      <GuideFAQ faqs={FAQS} />
      <RelatedGuides current="" />
    </article>
  </div>
);

export default BestPortableCoffeeTravellers;
