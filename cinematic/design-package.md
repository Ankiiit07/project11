# Cafe at Once: The Pour. Design package

Tier 1, the single journey: one 6 second shot, scrubbed by scroll. Every line of copy below ships verbatim.

## 1. Brand premise

**The press.** Cafe at Once is real brewed Arabica, nitrogen-sealed in a tube you can press anywhere. The whole site teaches one idea: one press is the whole recipe. The hero shows the press as a pour, the one interactive moment lets the visitor press and hold to pour, and the page ends on the press that matters: the buy button.

Buyer language from research (travel forums, taste tests, reviews):
- Pains: hotel sachets that taste "bitter", "burnt", "scorched"; travellers "detest generic hotel sachets"; "should have packed my Aeropress"; hotel rooms with no kettle and no machine.
- Desire: coffee that "tastes like actual brewed coffee".
- Objections: concentrates that are "weak, bitter or chemical-tasting" with "little aroma"; sugar and additives; needing a fridge; flying with liquids.

The one call to action: **Shop the Latte Sale** (links to the live shop's Latte packs).

## 2. Palette (direction now; final values sampled from the approved footage)

Deliberate deviation, said out loud: dark green-black with a mint accent sits close to a look AI sites overuse. Here it is the brand's real packaging (bottle-green boxes, mint caps), so it stays, warmed by crema and roast so it reads as coffee.

```css
:root{
  --canvas:#0C110F;        /* green-black ink, never pure black */
  --panel:#13201B;         /* cards, raised surfaces */
  --bottle:#1F5C4A;        /* packaging green: borders, glows, section washes */
  --accent:#6FD3A8;        /* mint cap: CTA, focus, rare emphasis only */
  --accent-hover:#8FE3BE;
  --accent-muted:rgba(111,211,168,.18);
  --crema:#E9D9C0;         /* primary text on dark */
  --text-secondary:#B9B2A4;/* secondary text, 4.5:1+ on canvas */
  --roast:#8B7355;         /* small warm details, the shop's brand brown */
}
```

## 3. Type trio

- Display: **Bricolage Grotesque**, condensed width (wdth 75), weights 600 and 800. Echoes the tall condensed lettering on the box.
- Body: **Outfit** 400 and 500. Same body face as the shop, for continuity.
- Mono: **DM Mono** 400 for labels, prices per tube, step numbers.

## 4. Band map (hero is 480vh; ranges are starting points for the flick test)

Composition: the tube and pour live in the right-centre lane of the frame. Captions sit in the left third; the action lane stays clear.

| Band | Range | Footage moment | Copy (verbatim) | Entrance |
|---|---|---|---|---|
| 1 | 0.00 to 0.24 | The green tube hangs above a glass of cold milk; the first drop forms | **Real coffee.** / **In your pocket.** | Word rise, settled on load |
| 2 | 0.28 to 0.52 | A dark ribbon of coffee pours straight down into the milk | **One press.** / **That's the whole recipe.** | Drift-down, echoing the pour |
| 3 | 0.56 to 0.78 | Coffee blooms and swirls through the milk | **100% Arabica.** / **Sealed with nitrogen.** / **Nothing added.** | Scatter-assemble, echoing the swirl |
| 4 | 0.82 to 1.00 | Settles: a finished iced latte beside the tube on a deep green surface | **Better than the hotel sachet.** / Sub: **Barista-style latte in 5 seconds. No machine, no fridge.** / CTA: **Shop the Latte Sale** | Word rise into a staged settle |

## 5. Static hero (phones, reduced motion)

Over the ending frame: headline **Real coffee. In your pocket.**, subline **Press the tube into milk or water. A barista-style latte in 5 seconds, no machine.**, CTA **Shop the Latte Sale**.

## 6. Below the hero (in order, each funnels to the CTA)

1. **The problem**: kicker `THE HOTEL ROOM PROBLEM`. Headline **Sachets taste burnt. Your Aeropress stayed home.** Body: **Most travel coffee is bitter powder or a kit you have to carry. We brewed the coffee first, sealed it in a tube, and left the gear behind.**
2. **How it works** (three equal steps, each with a generated still in the hero's world): `01` **Peel** Open the tube. `02` **Press** Squeeze it into 150 to 300 ml of milk or water, hot or cold. `03` **Stir** That's it. Your latte is ready.
3. **The interactive moment: press to pour.** Headline **Try it. Press and hold.** A drawn tube above a glass; holding the button pours, the glass fills, milk and coffee swirl. Release early and it eases back. Complete: **Five seconds. That's your latte.** Reduced motion shows the full glass.
4. **Why it tastes real** (counters): **100%** Arabica · **0 g** sugar · **12** months on the shelf, no fridge · **16 g** tube, 1 to 2 cups · Carry-on friendly.
5. **The Latte Sale**: **Pack of 2, ₹298** (₹149 per tube, save ₹100) and **Pack of 6, ₹600** (₹100 per tube, save ₹594, Best value). Buttons go straight to the shop's product pages.
6. **Testimonials**: real customer quotes only. Source to be confirmed with the owner; the section ships hidden until real quotes exist.
7. **FAQ** (buyers' objections, their words):
   - **Does it taste like real coffee?** Yes. It's brewed Arabica, not powder. Press it into milk and it tastes like a café latte.
   - **Is there sugar in it?** No. Zero sugar and no additives. Sweeten it yourself if you like.
   - **Do I need a fridge?** No. Each tube is nitrogen-sealed and keeps for 12 months at room temperature.
   - **Can I take it on a flight?** Yes. A 16 g tube sits well under carry-on liquid limits.
   - **How many cups is one tube?** One to two, depending on how strong you like it.
8. **Final CTA**: **Your next good coffee fits in your bag.** Button **Shop the Latte Sale**.
9. **Footer**: Cafe at Once, cafeatonce@gmail.com, +91 7979837079, Mumbai. Links to the shop, shipping and return policies.

No form on this site: the call to action links to the existing shop checkout.

## 7. Vector layer

- **Signature element, the pour line**: a thin mint line that continues the hero's pour down the left margin of the page, drawing itself as you scroll, and ends as a single drop landing on the final CTA button.
- Self-drawing steam curls above the step stills.
- Whisper-level drifting coffee dust in the fixed background, and a slow bottle-green glow cycling over 60+ seconds.
- Reduced motion: lines fully drawn, particles still, counters at their final values.

## 8. Engineering list

Blob fetch with loading ring, dt-normalised lerp, gated seeks, delta-gated DOM writes, band pacing with the flick test, the four-layer legibility system with the worst-frame audit, the five static-hero gates kept live with change listeners, complete without video, the full quality floor, and the whole-site-animated standard.

## 9. Copy gate

Every line above ships verbatim. The built page must pass the grep gate (zero em dashes, zero stock words) and the body-copy sweep before anyone sees it.

## Generation plan and cost

| Item | Model | Credits |
|---|---|---|
| Starting frame (your Latte photo as reference, 16:9, 2k) | Nano Banana Pro | 2 |
| Hero video, 6 s, no sound | Kling 3.0 Pro **or** Veo 3.1 | 10.5 **or** 60 |
| Three step stills (Peel, Press, Stir) | Nano Banana Pro | 6 |
| **Total** | | **18.5** with Kling, **68** with Veo |
