import useEmailForm from './useEmailForm.js';
import { footerColumns, socials } from '../data/content.js';

// List widths from the Figma text boxes (they make "Contact us" wrap exactly as designed).
const LIST_WIDTHS = [79, undefined, undefined];

export default function Footer() {
  const { email, status, onChange, onSubmit } = useEmailForm();

  return (
    <footer className="site-footer container" id="contact">
      <div className="site-footer__top">
        <div className="site-footer__brand">
          <a href="#top" aria-label="Organic — back to top">
            <img src="/images/logo-organic.svg" width="348" height="70" alt="Organic" loading="lazy" />
          </a>
          <ul className="socials">
            {socials.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name}>
                  <img src={s.icon} width="18" height="18" alt="" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {footerColumns.map((col, i) => (
          <nav key={col.title} className="footer-col" aria-label={col.title}>
            <h2>{col.title}</h2>
            <ul style={{ maxWidth: LIST_WIDTHS[i] }}>
              {col.links.map(([label, href]) => (
                <li key={label}><a href={href}>{label}</a></li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="footer-col footer-col--newsletter">
          <h2>Our newsletter</h2>
          <p>Subscribe to our newsletter to get updates about our grand offers.</p>
          <form className="footer-form" onSubmit={onSubmit} noValidate>
            <input
              type="email"
              placeholder="Enter your email-address"
              aria-label="Email address"
              value={email}
              onChange={onChange}
              aria-invalid={status.type === 'error'}
              aria-describedby="footer-status"
            />
            <button type="submit">Send</button>
          </form>
          <p id="footer-status" className={`form-status form-status--${status.type}`} role="status">{status.message}</p>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>© 2026 Organic. All rights reserved.</p>
        <p>Designed by Templates Jungle</p>
      </div>
    </footer>
  );
}
