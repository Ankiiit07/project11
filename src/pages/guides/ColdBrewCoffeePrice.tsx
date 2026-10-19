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
  productPrice,
  type FAQ,
} from '../../components/GuidePage';

const URL = `${SITE}/cold-brew-coffee-price`;

const ColdBrewCoffeePrice: React.FC = () => {
  const tube = productPrice('cold-brew-concentrate');
  const perGlassLow = Math.round(tube / 2);
  const sixPack = productPrice('latte-pack-6');

  const faqs: FAQ[] = [
    {
      question: 'How much does cold brew coffee cost in India?',
      answer: `At a café chain, a cold brew typically costs ₹280 to ₹460 a cup depending on size and city. Bottled cold coffee made with cold brew costs about ₹85 to ₹150 for 200 to 250 ml. A Cafe at Once Cold Brew tube costs ₹${tube} and makes one or two glasses, so about ₹${perGlassLow} to ₹${tube} a glass.`,
    },
    {
      question: 'Why is cold brew more expensive than regular coffee?',
      answer:
        'Cold brew uses more coffee per cup than hot brewing, takes 12 to 24 hours to steep, and has to be strained and kept cold. In cafés you also pay for the space and service. That time and coffee are what you are paying for.',
    },
    {
      question: 'What is the cheapest way to drink cold brew?',
      answer:
        'Making it yourself from ground coffee is the cheapest per glass, if you have the time, a jar, a filter and fridge space, and drink the batch within a week or two. If you want cold brew without the wait or the fridge, a concentrate tube is the cheapest ready-made option per glass.',
    },
    {
      question: 'Is bottled cold coffee the same as cold brew?',
      answer:
        'Not always. Many bottled cold coffees are ready-mixed drinks with milk and sugar, sometimes made with cold brew as one ingredient. Check the label for the ingredients and the sugar content if you want plain cold brew.',
    },
    {
      question: 'Does Cafe at Once deliver cold brew across India?',
      answer:
        'Yes. Cafe at Once ships across India, with free shipping on orders above ₹1000 and same-day delivery in Bengaluru. The tubes need no refrigeration, so they travel well.',
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-28 pb-20">
      <SEO
        title="Cold Brew Coffee Price in India (2026): Café vs Bottle vs Tube | Cafe at Once"
        description={`What a glass of cold brew really costs in India: café cold brew ₹280 to ₹460, bottled cold coffee ₹85 to ₹150, and Cafe at Once Cold Brew at ₹${tube} a tube. Compare price per glass.`}
        keywords="cold brew coffee price, cold brew coffee price in India, cold brew price per cup, cheapest cold brew India, cold brew concentrate price"
        url={URL}
        type="article"
        breadcrumbs={[
          { name: 'Home', url: SITE },
          { name: 'Cold brew coffee', url: `${SITE}/cold-brew-coffee` },
          { name: 'Cold brew coffee price', url: URL },
        ]}
        faq={faqs}
      />

      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <GuideHeader
          label="Price guide"
          title={
            <>
              Cold brew coffee price in India: <span className="text-primary">what a glass really costs</span>
            </>
          }
          intro="Cold brew ranges from under ₹100 to over ₹450 a glass, depending on where it comes from. Here is the honest comparison, per glass, so you can pick what fits your day."
          updated="October 2026"
        />

        <GuideSection title="Price per glass, compared">
          <GuideTable
            head={['Option', 'Typical price', 'Per glass', 'Wait', 'Fridge']}
            rows={[
              ['Café cold brew (coffee chains)', '₹280 to ₹460 a cup', '₹280 to ₹460', 'Queue', 'No'],
              ['Bottled cold coffee, 200 to 250 ml', '₹85 to ₹150 a bottle', '₹85 to ₹150', 'None', 'Best chilled'],
              ['Home-made from ground coffee', 'Cost of beans', 'Lowest', '12 to 24 hours', 'Yes, about 1 to 2 weeks'],
              [
                <Link key="t" to="/products/cold-brew-concentrate" className="text-primary underline underline-offset-4">
                  Cafe at Once Cold Brew tube
                </Link>,
                `₹${tube} a tube`,
                `₹${perGlassLow} to ₹${tube}`,
                '5 seconds',
                'No, 12 months sealed',
              ],
            ]}
            caption="Café and bottle prices are typical ranges seen on café menus and quick-commerce apps in October 2026. They vary by city, size and store."
          />
        </GuideSection>

        <GuideSection title="What you are paying for">
          <p>
            <strong className="text-foreground">At a café</strong>, you pay for the brewing, the ice, the cup, the seat
            and the service. It is a treat, not a daily habit for most budgets.
          </p>
          <p>
            <strong className="text-foreground">Bottled cold coffee</strong> is convenient, but it is usually a
            ready-mixed drink: milk and sugar are often in it, and it tastes best chilled. Check the label if you want
            plain cold brew.
          </p>
          <p>
            <strong className="text-foreground">Home-made cold brew</strong> is the cheapest per glass, if you have a day
            to wait, a jar, a filter and room in the fridge, and you finish the batch before it goes flat.
          </p>
          <p>
            <strong className="text-foreground">A cold brew tube</strong> sits in between: real 100% Arabica cold brew,
            already brewed and sealed with nitrogen, at a fraction of the café price, with no wait and no fridge. You
            decide how strong it is and what goes in it.
          </p>
        </GuideSection>

        <ProductCallout
          id="cold-brew-concentrate"
          pitch={`One tube makes one or two glasses, about ₹${perGlassLow} to ₹${tube} each. No sugar, no fridge, ready in 5 seconds.`}
        />

        <GuideSection title="The lowest price per tube">
          <p>
            Buying more brings the price down. Our{' '}
            <Link to="/products/latte-pack-6" className="text-primary underline underline-offset-4">Latte pack of 6</Link> works
            out to ₹{Math.round(sixPack / 6)} a tube, the best price per cup in the shop. Orders above ₹1000 ship free, and
            Bengaluru gets same-day delivery.
          </p>
          <p>
            New to cold brew? Start with our guide to{' '}
            <Link to="/cold-brew-coffee" className="text-primary underline underline-offset-4">what cold brew is and how to drink it</Link>.
          </p>
        </GuideSection>

        <GuideFAQ faqs={faqs} />
        <RelatedGuides current="/cold-brew-coffee-price" />
      </article>
    </div>
  );
};

export default ColdBrewCoffeePrice;
