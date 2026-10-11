import useEmailForm from './useEmailForm.js';

export default function Newsletter() {
  const { email, status, onChange, onSubmit } = useEmailForm();

  return (
    <section className="container section newsletter" id="newsletter" aria-labelledby="newsletter-title">
      <img src="/images/newsletter-bg.webp" alt="" loading="lazy" className="newsletter__bg" />
      <div className="newsletter__inner">
        <div className="newsletter__copy">
          <h2 id="newsletter-title">Get 20% discount on your first purchase</h2>
          <p>Just Sign Up &amp; Register it now to become member.</p>
        </div>
        <form className="newsletter__form" onSubmit={onSubmit} noValidate>
          <label className="newsletter__field">
            <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true">
              <path d="M1.6 0h12.8C15.3 0 16 .7 16 1.6v8.8c0 .9-.7 1.6-1.6 1.6H1.6C.7 12 0 11.3 0 10.4V1.6C0 .7.7 0 1.6 0zm0 1.6v.4L8 6.2l6.4-4.2v-.4H1.6zm12.8 2.3L8 8.1 1.6 3.9v6.5h12.8V3.9z" fill="#c8c8c8" />
            </svg>
            <span className="sr-only">Email address</span>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              autoComplete="email"
              value={email}
              onChange={onChange}
              aria-invalid={status.type === 'error'}
              aria-describedby="newsletter-status"
            />
          </label>
          <button type="submit" className="newsletter__submit">Subscribe now</button>
          <p id="newsletter-status" className={`form-status form-status--${status.type}`} role="status">{status.message}</p>
        </form>
      </div>
    </section>
  );
}
