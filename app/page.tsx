import ElectricalScene from "./electrical-scene";

const serviceGroups = [
  {
    title: "Jaka struja",
    description: "Kompletna infrastruktura koja mora raditi sigurno, uredno i bez improvizacije.",
    items: [
      "Elektroinstalacije u novogradnji",
      "Razvodne table i osigurači",
      "Utičnice, prekidači i rasvjeta",
      "Održavanje elektroinstalacija",
    ],
  },
  {
    title: "Slaba struja",
    description: "Sistemi koji povezuju objekat, bezbjednost i svakodnevnu automatizaciju.",
    items: [
      "Video nadzor i alarmi",
      "Interfoni i video interfoni",
      "Mrežna infrastruktura (LAN)",
      "Smart home sistemi",
    ],
  },
  {
    title: "Adaptacije",
    description: "Precizna zamjena, dogradnja i rekonstrukcija instalacija u postojećem prostoru.",
    items: [
      "Renoviranje stambenih prostora",
      "Montaža i zamjena opreme",
      "Podno grijanje",
      "Hitne intervencije",
    ],
  },
];

const process = [
  ["Kontakt", "Pozivom ili porukom opišite šta vam je potrebno."],
  ["Procjena", "Dogovaramo obilazak i definišemo obim radova."],
  ["Ponuda", "Dobijate jasan prijedlog radova i termina."],
  ["Izvođenje", "Radove završavamo prema dogovorenom planu."],
];

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={["arrow-icon", className].filter(Boolean).join(" ")} viewBox="0 0 24 24">
      <path d="M6 18 18 6M9 6h9v9" />
    </svg>
  );
}

function BoltMark() {
  return (
    <svg aria-hidden="true" className="bolt-mark" viewBox="0 0 48 48">
      <path d="M28.5 2 10 28h12l-2.5 18L38 19H26l2.5-17Z" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#glavni-sadrzaj">Preskoči na glavni sadržaj</a>
      <ElectricalScene />

      <div className="announcement">
        <div className="announcement__track" aria-hidden="true">
          <span>ELEKTROINSTALACIJE</span><span>•</span><span>CRNA GORA</span><span>•</span>
          <span>JAKA I SLABA STRUJA</span><span>•</span><span>TITAN</span><span>•</span>
          <span>ELEKTROINSTALACIJE</span><span>•</span><span>CRNA GORA</span><span>•</span>
          <span>JAKA I SLABA STRUJA</span><span>•</span><span>TITAN</span>
        </div>
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Titan početna">
          <span className="brand__mark"><BoltMark /></span>
          <span className="brand__text"><strong>TITAN</strong><small>ELEKTROINSTALACIJE</small></span>
        </a>
        <nav aria-label="Glavna navigacija">
          <a href="#usluge">Usluge</a>
          <a href="#sistem">Sistem</a>
          <a href="#proces">Proces</a>
          <a href="#kontakt">Kontakt</a>
        </nav>
        <a className="button button--small" href="tel:+38267152154">
          067 152 154 <ArrowIcon />
        </a>
      </header>

      <main id="glavni-sadrzaj" tabIndex={-1}>
        <section className="hero" id="top">
          <div className="hero__grid" aria-hidden="true" />
          <div className="hero__copy">
            <p className="eyebrow"><span /> ELEKTROINSTALACIJE • CRNA GORA</p>
            <h1>Snaga koja<br />ostaje <em>pod kontrolom.</em></h1>
            <p className="hero__lead">
              Kompletne električarske usluge za domove, poslovne prostore i objekte — od prve instalacije do posljednjeg prekidača.
            </p>
            <div className="hero__actions">
              <a className="button" href="tel:+38267152154">Pozovite Titan <ArrowIcon /></a>
              <a className="text-link" href="#usluge">Istražite sistem <span aria-hidden="true">↓</span></a>
            </div>
            <div className="hero__disciplines" aria-label="Oblasti rada">
              <span>JAKA STRUJA</span><span>SLABA STRUJA</span><span>AUTOMATIKA</span>
            </div>
          </div>

          <aside className="hero__hud" aria-label="Vizuelni prikaz Titan sistema">
            <div className="hud-card hud-card--top">
              <span className="hud-label">PLC / RAZVOD AKTIVAN</span>
              <strong>220<span>V</span></strong>
              <small>SKROLUJ / POVEŽI SISTEM</small>
            </div>
            <div className="hud-card hud-card--bottom">
              <span>JAKA STRUJA</span><i />
              <span>SLABA STRUJA</span><i />
              <span>ADAPTACIJE</span>
            </div>
          </aside>

          <div className="hero__scroll-cue" aria-hidden="true"><span>SKROLUJ</span><i /></div>
        </section>

        <section className="services section section--glass" id="usluge">
          <div className="section-kicker"><p>USLUGE / DISTRIBUCIJA</p></div>
          <div className="section-heading">
            <h2>Jedan tim.<br /><em>Cijeli sistem.</em></h2>
            <p>Od grubih instalacija do pametnih sistema i završne montaže — sve vodimo kao jednu povezanu cjelinu.</p>
          </div>

          <div className="service-grid">
            {serviceGroups.map((group) => (
              <article className="service-card" key={group.title}>
                <div className="service-card__head"><ArrowIcon /></div>
                <div>
                  <h3>{group.title}</h3>
                  <p>{group.description}</p>
                </div>
                <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

        <section className="system section" id="sistem">
          <div className="system__copy">
            <div className="section-kicker"><p>TITAN / PRINCIP</p></div>
            <h2>Instalacija nije<br />samo kabl.<br /><em>To je sistem.</em></h2>
            <p>
              Dobar posao mora biti logičan od početka: uredna trasa, pravilna zaštita, jasna raspodjela i završna obrada koja izgleda kao da je tu oduvijek trebalo da bude.
            </p>
            <a className="text-link" href="#proces">Kako radimo <ArrowIcon /></a>
          </div>

          <div className="system__matrix" aria-label="Tri principa rada">
            <article><span>PLAN</span><strong>Jasna trasa</strong><p>Prvo definišemo šta ide gdje i zašto.</p></article>
            <article><span>ZAŠTITA</span><strong>Siguran razvod</strong><p>Svaka linija dobija svoje mjesto i odgovarajuću zaštitu.</p></article>
            <article><span>FINIŠ</span><strong>Čista izvedba</strong><p>Završni detalji moraju biti precizni koliko i instalacija iza zida.</p></article>
          </div>
        </section>

        <section className="work section section--glass" id="radovi">
          <div className="section-kicker"><p>RADOVI / SIGNAL</p></div>
          <div className="section-heading">
            <h2>Rezultat se vidi.<br /><em>Standard ostaje.</em></h2>
            <a className="text-link" href="https://www.instagram.com/elektroinstalacije_titan/" target="_blank" rel="noreferrer">
              Instagram <ArrowIcon />
            </a>
          </div>

          <div className="work-strip">
            <article className="work-panel work-panel--wide"><strong>RAZVOD</strong><p>Precizno organizovana tabla i jasna logika instalacije.</p></article>
            <article className="work-panel"><strong>RASVJETA</strong><p>Funkcija, atmosfera i čista završna montaža.</p></article>
            <article className="work-panel"><strong>SMART</strong><p>Kontrola sistema bez nepotrebne komplikacije.</p></article>
            <article className="work-panel work-panel--wide"><strong>ADAPTACIJA</strong><p>Nova instalacija unutar postojećeg prostora, bez haosa.</p></article>
          </div>
        </section>

        <section className="process section" id="proces">
          <div className="process__heading">
            <div className="section-kicker"><p>PROCES / TOK</p></div>
            <h2>Od poziva do<br /><em>uključenja.</em></h2>
            <p>Bez komplikovanog procesa. Jasno definišemo posao, termin i sljedeći korak.</p>
          </div>
          <div className="process__steps">
            {process.map(([title, text]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
                <i aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>

        <section className="contact" id="kontakt">
          <div className="contact__noise" aria-hidden="true" />
          <div className="contact__content">
            <div className="section-kicker section-kicker--dark"><p>KONTAKT / START</p></div>
            <h2>Imate projekat?<br /><em>Uključimo ga.</em></h2>
            <p>Opišite nam šta vam je potrebno. Javićemo se radi dogovora i procjene radova.</p>
            <a className="contact__phone" href="tel:+38267152154">
              <small>POZOVITE NAS</small><strong>067 152 154</strong><ArrowIcon />
            </a>
          </div>
          <div className="contact__details">
            <div><span>INSTAGRAM</span><a href="https://www.instagram.com/elektroinstalacije_titan/" target="_blank" rel="noreferrer">@elektroinstalacije_titan</a></div>
            <div><span>SERVISNA ZONA</span><strong>CRNA GORA</strong></div>
            <div><span>DISCIPLINE</span><strong>JAKA • SLABA • ADAPTACIJE</strong></div>
          </div>
          <div className="contact__giant" aria-hidden="true"><BoltMark /></div>
        </section>
      </main>

      <footer>
        <a className="brand brand--footer" href="#top" aria-label="Titan početna">
          <span className="brand__mark"><BoltMark /></span>
          <span className="brand__text"><strong>TITAN</strong><small>ELEKTROINSTALACIJE</small></span>
        </a>
        <p>© {new Date().getFullYear()} Titan Elektroinstalacije</p>
        <a href="#top">Nazad na vrh ↑</a>
      </footer>
    </>
  );
}
