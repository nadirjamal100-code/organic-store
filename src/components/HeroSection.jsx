import { heroFeatures, heroStats } from '../data/content.js';

export default function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <img
        className="hero__bg"
        src="/images/hero-banner.webp"
        width="1800"
        height="813"
        alt=""
        fetchPriority="high"
      />
      <div className="hero__inner">
        <h1 id="hero-title" className="hero__title">
          <strong className="hero__accent">Organic</strong> Foods
          <br />
          at your <strong>Doorsteps</strong>
        </h1>
        <div className="hero__cta">
          <a href="#freshly-arrived" className="btn btn--green btn--pill">Start Shopping</a>
          <a href="#newsletter" className="btn btn--dark btn--pill">Join us</a>
        </div>
        <ul className="hero__stats">
          {heroStats.map((s) => (
            <li key={s.value}>
              <span className="hero__stat-value">{s.value}</span>
              <span className="hero__stat-label">
                {s.label[0]}
                <br />
                {s.label[1]}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <ul className="hero__features">
        {heroFeatures.map((f) => (
          <li key={f.id} style={{ background: f.color }}>
            <img src={f.icon} width={f.size} height={f.size} alt="" className="hero__feature-icon" />
            <div>
              <h2>{f.title}</h2>
              <p>consectetur adipiscing elit Sagittis sed ptibus</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
