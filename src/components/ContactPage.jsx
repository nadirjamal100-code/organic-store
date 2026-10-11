import { useState } from 'react';

const topics = [
  'General question',
  'Product information',
  'Order support',
  'Delivery question',
  'Website feedback',
];

export default function ContactPage() {
  const [status, setStatus] = useState('');

  const submit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setStatus('Thanks for your message. This demo form does not send or store messages.');
    form.reset();
  };

  return (
    <div className="contact-page">
      <section className="contact-page__hero">
        <div className="container">
          <p className="contact-page__eyebrow">We’re here to help</p>
          <h1>Contact us</h1>
          <p>Have a question about products, your basket, or shopping with us? Send us a note using the form below.</p>
        </div>
      </section>

      <div className="contact-page__layout container">
        <section className="contact-page__form-card" aria-labelledby="contact-form-title">
          <div className="contact-page__form-heading">
            <p className="contact-page__eyebrow">Drop us a line</p>
            <h2 id="contact-form-title">How can we help?</h2>
            <p>Fill in the details and tell us a little more about what you need.</p>
          </div>
          <form className="contact-form" onSubmit={submit}>
            <div className="contact-form__grid">
              <label>
                Your name
                <input type="text" name="name" autoComplete="name" placeholder="Full name" required />
              </label>
              <label>
                Email address
                <input type="email" name="email" autoComplete="email" placeholder="you@example.com" required />
              </label>
              <label className="contact-form__wide">
                What can we help with?
                <select name="topic" defaultValue="" required>
                  <option value="" disabled>Select a topic</option>
                  {topics.map((topic) => <option key={topic}>{topic}</option>)}
                </select>
              </label>
              <label className="contact-form__wide">
                Order number <span className="contact-form__optional">(optional)</span>
                <input type="text" name="orderNumber" placeholder="For questions about an order" />
              </label>
              <label className="contact-form__wide">
                Your message
                <textarea name="message" rows="6" placeholder="Write your message here..." required />
              </label>
            </div>
            <button type="submit" className="contact-form__submit">Send message</button>
            <p className="contact-form__notice" role="status" aria-live="polite">{status}</p>
            <p className="contact-form__demo-note">Demo only: this form does not transmit or save personal information.</p>
          </form>
        </section>

        <aside className="contact-page__aside" aria-label="Contact guidance">
          <article className="contact-page__info-card">
            <span className="contact-page__info-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M4 5h16v14H4zM4 7l8 6 8-6" /></svg>
            </span>
            <h2>General questions</h2>
            <p>Use the message form for product questions, feedback, or help finding your way around the store.</p>
          </article>
          <article className="contact-page__info-card">
            <span className="contact-page__info-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M5 4h14v16H5zM8 8h8m-8 4h8m-8 4h5" /></svg>
            </span>
            <h2>Order support</h2>
            <p>If your question is about an order, include its order number in the optional field to give us context.</p>
          </article>
          <div className="contact-page__help">
            <h2>Looking for something?</h2>
            <p>Browse product categories or visit our help centre links in the footer.</p>
            <a href="?faq=1">Explore help links <span aria-hidden="true">→</span></a>
          </div>
        </aside>
      </div>
    </div>
  );
}
