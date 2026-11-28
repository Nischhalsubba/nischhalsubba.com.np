![Original project artwork](https://media.contra.com/image/upload/w_1000/gypg4kwjcbm9f5vmbwzb.webp)

## Overview

Cartify is a mobile shopping concept created for a Uxcel checkout design brief. I explored the full journey rather than designing an isolated payment screen.

## Flow and design rationale

- Entry: branded splash screen, account access, registration and recovery options.

- Discovery: promotional home, familiar bottom navigation, search history, filters and consistently structured product cards.

- Evaluation: product detail information supports an informed purchase.

- Checkout: a progress indicator, recognizable payment options, promo code entry and visible total clarify the transaction.

- Payment and recovery: clear card-field labels and validation communicate input requirements.

- Post-purchase: order details, confirmation and a delivery timeline support reassurance and tracking.

## Feedback and next iteration

Uxcel peer feedback identified improvements to stepper alignment, payment-method coverage, promo-code discoverability and card-security messaging. These are documented iteration opportunities, not verified fixes.

## Deliverable

A multi-screen Figma design demonstrating transaction clarity and consistent interaction patterns. Reduced abandonment is a design hypothesis, not a measured result.

## Source

[Original Uxcel showcase and full project](https://app.uxcel.com/showcase/cartify-decision-making-process-and-rationale-479)

## UX strategy extension

Primary jobs: find a suitable product, compare price and availability, complete a trustworthy payment, then know when an order will arrive. Hypothesized segments include goal-directed shoppers and exploratory browsers. Research prompts: where do shoppers lose confidence, what information is needed before adding to cart, and how do they recover from a failed payment?

## Journey and decision map

Discover → search/filter → product detail → cart → payment → confirmation → tracking. At each stage define the next action, required information, possible failure and recovery route. Proposed edge cases include empty search, unavailable size, invalid promo code, changed price, network loss, declined payment, duplicate submission and delayed delivery. Prevent duplicate charges through engineering-side idempotency; show status and retry guidance rather than implying success prematurely.

## Validation plan and visualization

Moderated tasks: find a product with a filter; compare the final price including delivery; apply a promo code; recover from a payment decline; locate tracking. Record task success, first critical error, time and post-task ease. Use a funnel chart of actual unique users progressing through product view, cart, checkout and order confirmation; use a separate failure-reason chart for observed checkout errors. Analyze by device and new/returning customer where consent and data quality permit. No conversion or abandonment results are available.

## Iteration and handoff

Prioritize payment errors and clarity of totals before visual polish. Define loading, disabled, empty, error and success states; specify input semantics, focus and accessible payment validation. Peer feedback described in the original project provides formative critique; implementation and impact are not verified.

## Supporting research visuals

![Proposed shopping journey and validation priorities](https://media.contra.com/image/upload/w_1000/aflluvsfr9w4ieflcg4d.webp)

## Original screens: the shopping journey

### Discovery: home
![Original Cartify home screen](https://raw.githubusercontent.com/Nischhalsubba/nischhalsubba.com.np/contra-research-assets/contra-media/cartify-home-original-screen.svg)

A search field, filter entry point, promotional hero and product cards provide multiple discovery routes. Cards present product images, pricing and favorites without requiring the shopper to open each detail page. The bottom navigation maintains access to the shopping bag and account.

### Comparison: product grid
![Original sportswear product grid](https://raw.githubusercontent.com/Nischhalsubba/nischhalsubba.com.np/contra-research-assets/contra-media/cartify-product-grid-original-screen.svg)

The category screen uses a repeated two-column layout with comparable product metadata, search and sort controls. For implementation, retain query and filter state when users return from a product detail, and communicate no-results and unavailable-product states.

### Product evaluation: details
![Original product detail screen](https://raw.githubusercontent.com/Nischhalsubba/nischhalsubba.com.np/contra-research-assets/contra-media/cartify-product-detail-original-screen.svg)

The product detail prioritizes photography, product identity, ratings, price, description and size selection. The purchase action and total price stay close together. The historical mockup highlights two sizes at once; for a single-variant purchase, define one selected size and distinguish availability from selection. Example reviews, prices and discounts are mock data.

### Checkout: payment decision and cost review
![Original checkout screen](https://raw.githubusercontent.com/Nischhalsubba/nischhalsubba.com.np/contra-research-assets/contra-media/cartify-checkout-original-screen.svg)

The stage indicator separates checkout, payment and confirmation. Payment choices and the promo-code entry precede the cost breakdown and checkout action. This keeps item cost and shipping visible before commitment. In a production specification, use consistent currency precision, explain discount calculation, and prevent duplicate payment submission. External payment methods require supported integrations and recovery flows.

### After purchase: delivery information
![Original delivery timeline](https://raw.githubusercontent.com/Nischhalsubba/nischhalsubba.com.np/contra-research-assets/contra-media/cartify-delivery-information-original-screen.svg)

The original overlay groups status entries around an order identifier. The mock dates are not chronologically consistent; a production version should derive status order from verified event timestamps, distinguish current and completed steps, and accommodate delays and failed delivery.

## Proposed validation and handoff

Ask users to find a sportswear product, choose a size, explain the total cost, choose a payment option and locate delivery progress. Measure task completion, errors, first-click accuracy and confidence. Include tests for screen-reader labels, touch targets, discount clarity, empty cart, declined payment, retry, price changes and unavailable variants. These are proposed tests and implementation considerations, not completed research or live product results.

[Open the original Figma shopping flow](https://www.figma.com/design/8NYbC3D0e3VZqWjiwdZd8m/Uxcel?node-id=237-312)