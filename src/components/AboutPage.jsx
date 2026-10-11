function AboutValueIcon({ name }) {
  const icons = {
    freshness: <><path d="M20 7v5h-5" /><path d="M4.5 16a8 8 0 0 0 13.7 2.2L20 16" /><path d="M4 17v-5h5" /><path d="M19.5 8A8 8 0 0 0 5.8 5.8L4 8" /></>,
    leaf: <><path d="M20 4c-8 0-13 2.8-13 9a6 6 0 0 0 6 6c6.2 0 7-7 7-15Z" /><path d="M4 21c3-6 7-9 13-13" /></>,
    delivery: <><path d="M3 6h11v12H3z" /><path d="M14 10h4l3 3v5h-7z" /><circle cx="7.5" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
    basket: <><path d="M4 10h16l-1.3 10H5.3L4 10Z" /><path d="m8 10 4-6 4 6" /><path d="M9 13v4m6-4v4" /></>,
    star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />,
    heart: <path d="M20.8 8.8c0 4.1-8.8 11.2-8.8 11.2S3.2 12.9 3.2 8.8A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.6Z" />,
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

const values = [
  {
    icon: 'freshness',
    title: 'Fresh every day',
    text: 'We make it easy to find fresh ingredients and everyday favorites for meals at home.',
  },
  {
    icon: 'leaf',
    title: 'Thoughtful choices',
    text: 'Our store brings produce, pantry essentials, and treats together in one simple place.',
  },
  {
    icon: 'delivery',
    title: 'Convenient delivery',
    text: 'Shop from wherever you are and have your grocery order brought to your doorstep.',
  },
  {
    icon: 'basket',
    title: 'Easy to explore',
    text: 'Clear categories and product details help you browse the range and find what fits your list.',
  },
  {
    icon: 'star',
    title: 'Room for favorites',
    text: 'From everyday pantry staples to snacks and sweet treats, there is something for different moments.',
  },
  {
    icon: 'heart',
    title: 'Made for real routines',
    text: 'Build a basket for quick weekday meals, a relaxed weekend breakfast, or anything in between.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Browse what you need',
    text: 'Explore our departments, use search to find a product, or browse current offers for a little inspiration.',
  },
  {
    number: '02',
    title: 'Build your basket',
    text: 'Open product details, choose quantities, and add items to your cart. Your basket stays available as you shop.',
  },
  {
    number: '03',
    title: 'Choose how to pay',
    text: 'At checkout, enter your delivery details and select an available payment option to place your order.',
  },
];

export default function AboutPage({ onShop, onCategoryOpen, onArticleOpen }) {
  return (
    <div className="about-page">
      <section className="about-page__hero">
        <div className="about-page__hero-inner container">
          <p className="about-page__eyebrow">A little more about us</p>
          <h1>Good food brings us together</h1>
          <p>
            Organic is your friendly neighborhood grocery store online: a simple place to discover fresh produce,
            pantry staples, and the everyday ingredients that make a meal feel like home.
          </p>
          <button type="button" className="about-page__primary" onClick={onShop}>Explore our products</button>
        </div>
      </section>

      <section className="about-page__story container" aria-labelledby="about-story-title">
        <div className="about-page__story-image">
          <img src="/images/hero-banner.webp" alt="Fresh ingredients ready to enjoy at home" />
        </div>
        <div className="about-page__story-copy">
          <p className="about-page__eyebrow">Our story</p>
          <h2 id="about-story-title">Everyday groceries, made a little easier</h2>
          <p>
            We believe shopping for food should feel welcoming and straightforward. Browse the things you love,
            discover something new, and bring together ingredients for the people around your table.
          </p>
          <p>
            From colorful fruits and vegetables to bakery favorites and pantry staples, our goal is to make
            everyday grocery shopping convenient, inspiring, and easy to enjoy.
          </p>
          <button type="button" className="about-page__text-link" onClick={() => onCategoryOpen('all')}>
            Browse our categories <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      <section className="about-page__mission">
        <div className="container about-page__mission-inner">
          <p className="about-page__eyebrow">Our purpose</p>
          <h2>Make the everyday shop feel simple, useful, and welcoming.</h2>
          <p>
            A grocery list is part of everyday life. We bring a varied selection of produce, drinks, bakery,
            pantry goods, and more into one online shop, so you can spend less time figuring out where to start
            and more time planning what to make.
          </p>
        </div>
      </section>

      <section className="about-page__values" aria-labelledby="about-values-title">
        <div className="container">
          <div className="about-page__section-heading">
            <p className="about-page__eyebrow">What matters to us</p>
            <h2 id="about-values-title">A shop shaped around everyday needs</h2>
            <p>Thoughtful details that make browsing and ordering feel more straightforward.</p>
          </div>
          <div className="about-page__value-grid">
            {values.map((value) => (
              <article className="about-page__value-card" key={value.title}>
                <span className="about-page__value-icon"><AboutValueIcon name={value.icon} /></span>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-page__shopping container" aria-labelledby="about-shopping-title">
        <div className="about-page__shopping-copy">
          <p className="about-page__eyebrow">A simpler way to shop</p>
          <h2 id="about-shopping-title">From first browse to full basket</h2>
          <p>
            Whether you arrive with a list or an idea for dinner, the store is designed to help you move at your
            own pace. Explore categories, compare product details, and adjust your quantities before heading to
            checkout.
          </p>
          <button type="button" className="about-page__text-link" onClick={onShop}>
            Start shopping <span aria-hidden="true">→</span>
          </button>
        </div>
        <div className="about-page__shopping-image">
          <img src="/images/category-01.webp" alt="Colorful fresh produce" loading="lazy" />
          <div>
            <strong>Good ingredients</strong>
            <span>for everyday moments</span>
          </div>
        </div>
      </section>

      <section className="about-page__steps" aria-labelledby="about-steps-title">
        <div className="container">
          <div className="about-page__section-heading">
            <p className="about-page__eyebrow">How it works</p>
            <h2 id="about-steps-title">Three simple steps</h2>
            <p>Everything you need to go from browsing to placing an order.</p>
          </div>
          <div className="about-page__steps-grid">
            {steps.map((step) => (
              <article className="about-page__step" key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-page__categories container" aria-labelledby="about-categories-title">
        <div className="about-page__section-heading">
          <p className="about-page__eyebrow">Explore the store</p>
          <h2 id="about-categories-title">Something for your shopping list</h2>
          <p>Browse a few of the departments waiting to be explored.</p>
        </div>
        <div className="about-page__category-links">
          {[
            ['Fruits & Veges', 'fruits-veges'],
            ['Breads & Sweets', 'breads-sweets'],
            ['Wine & Drinks', 'wine-drinks'],
            ['Bakery', 'bakery'],
          ].map(([label, slug]) => (
            <button type="button" key={slug} onClick={() => onCategoryOpen(slug)}>
              <span>{label}</span><span aria-hidden="true">→</span>
            </button>
          ))}
        </div>
      </section>

      <section className="about-page__journal container" aria-labelledby="about-journal-title">
        <div>
          <p className="about-page__eyebrow">From our journal</p>
          <h2 id="about-journal-title">Ideas and inspiration for your kitchen</h2>
          <p>Find simple tips for cooking, storing produce, and making the most of the ingredients you bring home.</p>
        </div>
        <button type="button" className="about-page__text-link" onClick={() => onArticleOpen(1)}>
          Read our latest article <span aria-hidden="true">→</span>
        </button>
      </section>
    </div>
  );
}
