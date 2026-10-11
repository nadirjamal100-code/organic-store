import { useState } from 'react';

export default function AccountPage({ onBackToShop, onSignIn, onCreateAccount }) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    subscribe: true,
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.fullName,
          email: form.email,
          password: form.password,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Account creation failed.');
      onCreateAccount?.(result);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="account-page" aria-label="Create account page">
      <div className="container account-page__shell">
        <div className="account-page__card">
          <div className="account-page__content">
            <button type="button" className="account-page__back" onClick={onBackToShop}>
              ← Continue shopping
            </button>

            <div className="account-page__header">
              <span className="account-page__eyebrow">Create account</span>
              <h1>Join Organic</h1>
              <p>Create your account to save favorites, track orders, and enjoy member-only deals.</p>
            </div>

            <form className="account-page__form" onSubmit={handleSubmit}>
              <label className="field">
                <span>Full name</span>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  placeholder="Jane Smith"
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="field">
                <span>Email address</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  placeholder="name@example.com"
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="field">
                <span>Password</span>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  placeholder="Create a password"
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="field">
                <span>Confirm password</span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  placeholder="Re-enter your password"
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="checkbox account-page__checkbox">
                <input
                  type="checkbox"
                  name="subscribe"
                  checked={form.subscribe}
                  onChange={handleChange}
                />
                <span>Send me weekly discounts and fresh product updates</span>
              </label>

              <button type="submit" className="btn btn--green btn--pill account-page__submit" disabled={busy}>
                {busy ? 'Creating account…' : 'Create account'}
              </button>
              {error && <p className="account-page__error" role="alert">{error}</p>}
            </form>

            <div className="account-page__divider"><span>or sign up with</span></div>

            <div className="account-page__socials">
              <button type="button" className="social-btn">Google</button>
              <button type="button" className="social-btn">Apple</button>
            </div>

            <p className="account-page__signin">
              Already have an account? <a href="#" onClick={(event) => { event.preventDefault(); onSignIn?.(); }}>Sign in</a>
            </p>

          </div>

          <div className="account-page__visual" aria-hidden="true">
            <div className="account-page__badge">Member perks</div>
            <img src="/images/hero-banner.webp" alt="" />
            <div className="account-page__overlay">
              <p>Healthy essentials</p>
              <strong>Save up to 30% on seasonal bundles</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
