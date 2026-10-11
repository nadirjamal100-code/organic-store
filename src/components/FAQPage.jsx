import { useState } from 'react';

const faqs = [
  {
    question: 'How do I place an order?',
    answer:
      'Browse the shop, add products to your cart, and proceed to checkout. Once you confirm your details and payment method, your order is placed instantly and you will receive a confirmation email.',
  },
  {
    question: 'What delivery options do you offer?',
    answer:
      'We offer standard delivery, express delivery, and scheduled local delivery depending on your postcode and the products in your basket. Delivery costs and timing are shown during checkout.',
  },
  {
    question: 'Can I return or exchange an item?',
    answer:
      'Yes. Most unopened items can be returned within 14 days of delivery. You can start a return from your order details or contact our support team for help with a damaged or incorrect item.',
  },
  {
    question: 'Do you offer organic and fresh produce?',
    answer:
      'Absolutely. We focus on fresh, organic, and responsibly sourced products across fruits, vegetables, pantry staples, dairy, and household essentials.',
  },
  {
    question: 'How do I track my order?',
    answer:
      'Once your order is dispatched, you will receive an email with a tracking link and delivery updates. You can also view your latest order status in your account dashboard.',
  },
  {
    question: 'Is there a minimum order value?',
    answer:
      'There is no minimum order value for regular delivery, though some promoted delivery offers and location-based services may vary by region and basket size.',
  },
  {
    question: 'Can I save products for later?',
    answer:
      'Yes. You can add favorites to your wishlist and revisit them any time from your account or by using the bookmark icon in the header.',
  },
  {
    question: 'Do you offer discounts for first-time shoppers?',
    answer:
      'We regularly run welcome offers and seasonal promotions. Check the home page and newsletter sign-up for current savings and limited-time bundles.',
  },
];

export default function FAQPage({ onBack }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="faq-page">
      <section className="faq-page__hero">
        <div className="container faq-page__hero-inner">
          <p className="faq-page__eyebrow">Support centre</p>
          <h1>Frequently asked questions</h1>
          <p>Everything you need to know about shopping, delivery, returns, and account support.</p>
        </div>
      </section>

      <div className="container faq-page__layout">
        <section className="faq-page__content" aria-labelledby="faq-heading">
          <div className="faq-page__intro">
            <p className="faq-page__eyebrow faq-page__eyebrow--dark">Popular answers</p>
            <h2 id="faq-heading">Need a quick answer?</h2>
          </div>

          <div className="faq-list" role="list">
            {faqs.map((item, index) => {
              const isOpen = index === openIndex;
              return (
                <div key={item.question} className={`faq-item ${isOpen ? 'is-open' : ''}`} role="listitem">
                  <button
                    type="button"
                    className="faq-item__button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  >
                    <span>{item.question}</span>
                    <span className="faq-item__icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="faq-item__answer">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <aside className="faq-page__sidebar" aria-label="Help and support">
          <div className="faq-card">
            <div className="faq-card__icon" aria-hidden="true">✦</div>
            <h3>Still need help?</h3>
            <p>Contact our support team and we will help with orders, delivery updates, and product questions.</p>
            <button type="button" className="btn btn--dark btn--square" onClick={onBack}>Back to shop</button>
          </div>

          <div className="faq-card faq-card--soft">
            <h3>Helpful links</h3>
            <ul className="faq-links">
              <li><a href="?contact=1">Contact us</a></li>
              <li><a href="?about=1">About Organic</a></li>
              <li><a href="#top">Home</a></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
