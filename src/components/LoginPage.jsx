import { useState } from 'react';

export default function LoginPage({ onBackToShop, onCreateAccount, onLogin }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: true,
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
    setError('');
    setBusy(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Sign in failed.');
      onLogin?.(result);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="login-page" aria-label="Login page">
      <div className="container login-page__shell">
        <div className="login-page__card">
          <div className="login-page__visual" aria-hidden="true">
            <div className="login-page__badge">Fresh picks daily</div>
            <img src="/images/hero-banner.webp" alt="" />
            <div className="login-page__overlay">
              <p>Healthy living</p>
              <strong>Get 20% off your first order</strong>
            </div>
          </div>

          <div className="login-page__content">
            <button type="button" className="login-page__back" onClick={onBackToShop}>
              ← Continue shopping
            </button>

            <div className="login-page__header">
              <span className="login-page__eyebrow">Welcome back</span>
              <h1>Sign in to Organic</h1>
              <p>Access your account and keep track of your healthy essentials.</p>
            </div>

            <form className="login-page__form" onSubmit={handleSubmit}>
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
                  placeholder="Enter your password"
                  onChange={handleChange}
                  required
                />
              </label>

              <div className="login-page__options">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={handleChange}
                  />
                  <span>Keep me signed in</span>
                </label>
                <a href="#" onClick={(event) => event.preventDefault()}>Forgot password?</a>
              </div>

              <button type="submit" className="btn btn--green btn--pill login-page__submit" disabled={busy}>
                {busy ? 'Signing in…' : 'Sign in'}
              </button>
              {error && <p className="login-page__error" role="alert">{error}</p>}
            </form>

            <div className="login-page__divider"><span>or continue with</span></div>

            <div className="login-page__socials">
              <button type="button" className="social-btn">Google</button>
              <button type="button" className="social-btn">Apple</button>
            </div>

            <p className="login-page__signup">
              New to Organic? <a href="#" onClick={(event) => { event.preventDefault(); onCreateAccount?.(); }}>Create account</a>
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}
