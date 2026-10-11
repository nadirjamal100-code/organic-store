export default function AppDownload() {
  return (
    <section className="container section app-download" id="download-app" aria-labelledby="app-title">
      <div className="app-download__inner">
        <div className="app-download__copy">
          <h2 id="app-title" className="section-title">Download Organic App</h2>
          <p>Online Orders made easy, fast and reliable</p>
          <div className="app-download__badges">
            <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" aria-label="Get it on Google Play">
              <img src="/images/badge-google-play.svg" width="206" height="61" alt="" loading="lazy" />
            </a>
            <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer" aria-label="Download on the App Store">
              <img src="/images/badge-app-store.svg" width="183" height="61" alt="" loading="lazy" />
            </a>
          </div>
        </div>
        <img
          src="/images/app-showcase.svg"
          width="601"
          height="476"
          alt="The Organic app on a phone held in a hand, next to fresh fruit in a basket"
          loading="lazy"
          className="app-download__art"
        />
      </div>
    </section>
  );
}
