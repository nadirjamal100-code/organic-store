import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { navLinks } from '../data/content.js';
import { menuCategories } from '../data/categories.js';

function MenuCategoryIcon({ name }) {
  const paths = {
    produce: <><path d="M12 8c-4-3-8-1-8 4 0 4 3 7 7 7h3c4 0 6-3 6-6 0-4-3-7-8-5Z" /><path d="M12 8c0-4 3-6 6-6-1 3-3 5-6 6ZM9 7C8 4 6 3 4 3c0 3 2 4 5 5" /><circle cx="17.5" cy="13" r="1.2" /><circle cx="19" cy="15" r="1.2" /><circle cx="17" cy="17" r="1.2" /></>,
    dairy: <><path d="M6 4h9l4 4v13H6z" /><path d="M6 8h9V4M10 11h6v7h-6z" /><circle cx="13" cy="14.5" r="1.5" /><path d="M8 3h5" /></>,
    meat: <><path d="M5 12c-1-3 1-5 4-5 2 0 3 1 4 0 2-2 4-1 5 1l2 3-2 5c-2 3-6 4-9 2-2-1-3-3-4-6Z" /><path d="M5 11 3 8l3 1m5-3-1-3 3 2m1 14 1 2m-5-1v2" /><circle cx="16" cy="10" r=".7" /></>,
    seafood: <><path d="M12 3S5 11 5 15a7 7 0 0 0 14 0c0-4-7-12-7-12Z" /><path d="M9 16a3 3 0 0 0 3 3" /></>,
    bakery: <><path d="M3 15c0-3 2-5 4-5s4 2 4 5v5H3zM10 15c0-4 2-7 5-7s5 3 5 7v5H10z" /><path d="M7 11v7m8-9v8m4-5v5" /></>,
    canned: <><path d="M7 4h10v16H7zM7 7h10" /><path d="M10 12c2-3 5-1 4 2-1 2-3 2-4 0" /></>,
    frozen: <><rect x="5" y="3" width="14" height="18" rx="3" /><path d="M5 10h14m-7-4v8m-3-5 6 4m0-4-6 4" /></>,
    pasta: <><path d="M3 13h18c-.5 5-4 8-9 8s-8.5-3-9-8Z" /><path d="M5 12c2-2 4-2 6 0m1 0c2-2 4-2 6 0M8 10 7 6m4 4V4m4 6 2-4" /></>,
    breakfast: <><path d="M7 9h10v11H7zM17 11h2a2 2 0 0 1 0 5h-2M9 6l2-3m2 4 2-4M3 18h4" /><path d="M2 18c0 2 2 2 5 2" /></>,
    snacks: <><path d="M6 5h12l-1 15H7zM5 5h14l-1-2H6z" /><path d="M8 7h8m-7 2v8m6-8v8" /></>,
    beverages: <><path d="M12 6c-3-3-8-1-8 4 0 5 3 9 8 9s8-4 8-9c0-5-5-7-8-4Z" /><path d="M12 6c0-3 2-4 4-4-1 3-2 4-4 4Zm-2 8a3 3 0 0 0 3 3" /></>,
    condiments: <><path d="M9 3h6v3l2 2v13H7V8l2-2zM9 8h6" /><path d="M10 12h4v6h-4zM11 3V1h2v2" /></>,
    spices: <><path d="m12 9 3 4H9l3-4Z" /><path d="m5 17 2-3 2 3m8 1 1.5-2 1.5 2M4 7l.5 1.5L6 9l-1.5.5L4 11l-.5-1.5L2 9l1.5-.5L4 7Zm15-4 .5 1.5L21 5l-1.5.5L19 7l-.5-1.5L17 5l1.5-.5L19 3Z" /><circle cx="8" cy="5" r=".7" /><circle cx="15" cy="7" r=".7" /></>,
    baking: <><path d="M4 16c3-5 7-8 14-9l2 3c-2 6-6 10-13 11l-4-5Z" /><path d="m8 14 3 1m1-5 3 1m-1-4 3 1" /></>,
    baby: <><circle cx="12" cy="13" r="8" /><path d="M9 12h.01M15 12h.01M9 16c2 2 4 2 6 0M12 5V2m-3 2 3-2 3 2" /></>,
    health: <><path d="m12 2 9 3v6c0 5-4 9-9 11-5-2-9-6-9-11V5z" /><path d="M12 7v9m-4-4h8" /></>,
    household: <><path d="M4 9h16l2 4-2 8H4l-2-8zM4 9l3-5h10l3 5" /><path d="m8 13 4 5 4-5m-4 5v3" /></>,
    personal: <><path d="M5 10h14l-1 11H6zM5 10l2-5h10l2 5" /><path d="M8 12v5m4-5v5m4-5v5" /></>,
    pets: <><ellipse cx="12" cy="15" rx="5" ry="4" /><circle cx="5.5" cy="9" r="1.5" /><circle cx="10" cy="6" r="1.5" /><circle cx="15" cy="6" r="1.5" /><circle cx="18.5" cy="9" r="1.5" /></>,
  };

  return (
    <svg className="site-menu__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export default function Header({
  cartCount,
  wishlistCount,
  query,
  onSearch,
  onSearchSubmit,
  onCartOpen,
  currentUser,
  onAccountOpen,
  onLogout,
  onSaleOpen,
  onAboutOpen,
  onContactOpen,
  onHomeOpen,
  activePage,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [draft, setDraft] = useState(query);
  const closeButtonRef = useRef(null);

  useEffect(() => setDraft(query), [query]);
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const submit = (e) => {
    e.preventDefault();
    onSearch(draft);
    onSearchSubmit?.();
    window.requestAnimationFrame(() => {
      const results = document.querySelector('.product-section, .no-results');
      results?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <header className="site-header">
      <div className="site-header__bar">
        <div className="site-header__brand">
          <a href="#top" className="logo" aria-label="Organic — home">
            <img src="/images/logo-leaf.svg" width="43" height="34" alt="" className="logo__leaf" />
            <img src="/images/logo-word.svg" width="108" height="37" alt="Organic" className="logo__word" />
          </a>
          <button
            type="button"
            className="icon-btn menu-toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Icon name="gg_menu" size={24} />
          </button>
        </div>

        <form className="search" role="search" onSubmit={submit}>
          <input
            type="search"
            className="search__input"
            placeholder="Search products"
            aria-label="Search products"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              onSearch(e.target.value);
            }}
          />
          <button type="submit" className="search__btn">Search</button>
        </form>

        <nav className="main-nav" aria-label="Primary">
          <ul>
            {navLinks.map((link, i) => (
              <li key={link.label}>
                <a
                  href={link.label === 'Sale' ? '?sale=1' : link.label === 'About' ? '?about=1' : link.href}
                  className={link.label === activePage ? 'is-active' : undefined}
                  aria-current={link.label === activePage ? 'page' : undefined}
                  onClick={link.label === 'Sale'
                    ? (event) => { event.preventDefault(); onSaleOpen?.(); }
                    : link.label === 'About'
                      ? (event) => { event.preventDefault(); onAboutOpen?.(); }
                      : link.label === 'Home'
                        ? (event) => { event.preventDefault(); onHomeOpen?.(); }
                          : link.label === 'Contact'
                            ? (event) => { event.preventDefault(); onContactOpen?.(); }
                          : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          {currentUser ? (
            <div className="header-user">
              <span className="header-user__name">Hi, {currentUser.name.split(' ')[0]}</span>
              <button
                type="button"
                className="header-user__logout"
                onClick={() => onLogout?.()}
              >
                Sign out
              </button>
            </div>
          ) : (
            <a
              href="?login=1"
              className="icon-btn"
              aria-label="Account — sign in"
              onClick={(event) => {
                event.preventDefault();
                onAccountOpen?.();
              }}
            >
              <Icon name="solar_user-circle-linear" size={24} />
            </a>
          )}
          <a href="#best-selling" className="icon-btn" aria-label={`Wishlist, ${wishlistCount} items`}>
            <Icon name="solar_bookmark-linear" size={24} />
            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
          </a>
          <a
            href="?cart=1"
            className="icon-btn"
            aria-label={`Cart, ${cartCount} items`}
            onClick={(event) => {
              event.preventDefault();
              onCartOpen();
            }}
          >
            <Icon name="solar_cart-3-linear" size={24} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </a>
        </div>
      </div>

      {menuOpen && (
        <div className="site-menu">
          <button type="button" className="site-menu__backdrop" aria-label="Close menu" onClick={() => setMenuOpen(false)} />
          <aside id="site-menu" className="site-menu__panel" role="dialog" aria-modal="true" aria-label="Grocery categories">
            <div className="site-menu__header">
              <span>Menu</span>
              <button ref={closeButtonRef} type="button" className="site-menu__close" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" /></svg>
              </button>
            </div>
            <ul className="site-menu__cats" aria-label="Categories">
              {menuCategories.map((category) => (
                <li key={category.id}>
                  <a href="#freshly-arrived" onClick={() => setMenuOpen(false)}>
                    {category.icon && <MenuCategoryIcon name={category.icon} />}
                    <span>{category.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}
    </header>
  );
}
