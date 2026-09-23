import ThreeScene from "./three-scene";

const services = [
  {
    number: "01",
    title: "Jaka struja",
    text: "Kompletne elektroinstalacije, razvodne table, osigurači, utičnice, prekidači i rasvjeta.",
    items: ["Novogradnja", "Razvodne table", "Rasvjeta", "Održavanje"],
  },
  {
    number: "02",
    title: "Slaba struja",
    text: "Sistemi koji povezuju, nadziru i automatizuju prostor — uredno planirani i precizno izvedeni.",
    items: ["Video nadzor", "Alarmi", "Interfoni", "LAN / Smart home"],
  },
  {
    number: "03",
    title: "Adaptacije",
    text: "Sigurna zamjena i nadogradnja postojećih instalacija tokom renoviranja stambenih i poslovnih prostora.",
    items: ["Renoviranje", "Montaža opreme", "Podno grijanje", "Intervencije"],
  },
];

const process = [
  ["01", "Kontakt", "Opišite šta je potrebno i pošaljite osnovne informacije o prostoru ili objektu."],
  ["02", "Procjena", "Dogovaramo obilazak i precizno definišemo obim radova."],
  ["03", "Plan", "Dobijate jasan prijedlog izvedbe, materijala i termina."],
  ["04", "Izvođenje", "Instalaciju završavamo uredno, provjereno i prema dogovoru."],
];

function Arrow() {
  return (
    <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 19 19 5M9 5h10v10" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#sadrzaj">Preskoči na sadržaj</a>
      <ThreeScene />

      <header className="nav">
        <a className="logo" href="#top" aria-label="Titan Elektroinstalacije početna">
          <span className="logo-mark">T</span>
          <span><strong>TITAN</strong><small>ELEKTROINSTALACIJE</small></span>
        </a>

        <nav aria-label="Glavna navigacija">
          <a href="#usluge">Usluge</a>
          <a href="#proces">Proces</a>
          <a href="#kontakt">Kontakt</a>
        </nav>

        <a className="nav-call" href="tel:+38267152154">
          <span>067 152 154</span><Arrow />
        </a>
      </header>

      <main id="sadrzaj">
        <section className="hero section-screen" id="top">
          <div className="hero-copy">
            <p className="kicker"><span /> ELEKTROINSTALACIJE · CRNA GORA</p>
            <h1>
              Energija<br />
              <span>pod kontrolom.</span>
            </h1>
            <p className="hero-lead">
              Jaka i slaba struja, adaptacije i precizna montaža — jedan tim za
              instalacije koje moraju raditi sigurno, uredno i bez improvizacije.
            </p>
            <div className="hero-actions">
              <a className="cta" href="tel:+38267152154">Pozovite nas <Arrow /></a>
              <a className="ghost-link" href="#usluge">Istražite usluge <span>↓</span></a>
            </div>
          </div>

          <div className="hero-data" aria-label="Oblasti rada">
            <div><span>01</span><strong>JAKA STRUJA</strong></div>
            <div><span>02</span><strong>SLABA STRUJA</strong></div>
            <div><span>03</span><strong>ADAPTACIJE</strong></div>
          </div>

          <div className="scroll-cue" aria-hidden="true">
            <span>SCROLL TO ENERGIZE</span><i />
          </div>
        </section>

        <section className="services section-pad" id="usluge">
          <div className="section-intro">
            <p className="kicker"><span /> 01 / USLUGE</p>
            <h2>Od prve trase<br />do zadnjeg <em>spoja.</em></h2>
            <p>
              Projektujemo logiku instalacije, izvodimo radove i završavamo
              detalje tako da sistem ostane pregledan i servisabilan.
            </p>
          </div>

          <div className="service-stack">
            {services.map((service) => (
              <article className="service-card" key={service.number}>
                <div className="service-card__head">
                  <span>{service.number}</span>
                  <Arrow />
                </div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <div className="chips">
                  {service.items.map((item) => <span key={item}>{item}</span>)}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="manifesto section-screen" id="o-nama">
          <div className="manifesto-index" aria-hidden="true">230V</div>
          <div className="manifesto-copy">
            <p className="kicker"><span /> 02 / TITAN STANDARD</p>
            <h2>
              Nije dovoljno da radi.<br />
              <em>Mora biti urađeno kako treba.</em>
            </h2>
            <p>
              Titan Elektroinstalacije radi na stambenim, poslovnim i drugim
              objektima širom Crne Gore. Fokus je na jasnoj izvedbi, urednoj
              montaži i dogovoru koji se poštuje od prvog poziva do završetka.
            </p>
          </div>
          <div className="manifesto-facts">
            <div><span>DISCIPLINA</span><strong>Jaka + slaba struja</strong></div>
            <div><span>TEREN</span><strong>Crna Gora</strong></div>
            <div><span>PRISTUP</span><strong>Precizno i uredno</strong></div>
          </div>
        </section>

        <section className="process section-pad" id="proces">
          <div className="section-intro section-intro--sticky">
            <p className="kicker"><span /> 03 / PROCES</p>
            <h2>Četiri koraka.<br /><em>Jedan tok.</em></h2>
            <p>
              Bez nepotrebnog komplikovanja. Prvo razumijemo prostor i zahtjev,
              zatim definišemo rješenje i izvodimo ga.
            </p>
          </div>

          <div className="timeline">
            {process.map(([number, title, text]) => (
              <article key={number}>
                <span className="timeline-number">{number}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
                <span className="timeline-dot" aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>

        <section className="work section-pad">
          <div className="section-intro">
            <p className="kicker"><span /> 04 / POD NAPONOM</p>
            <h2>Sistem se vidi<br />u <em>detaljima.</em></h2>
          </div>

          <div className="work-grid">
            <article className="work-panel work-panel--large">
              <span>RAZVODNE TABLE</span>
              <strong>Kontrola počinje<br />od dobrog rasporeda.</strong>
              <i aria-hidden="true">01</i>
            </article>
            <article className="work-panel">
              <span>RASVJETA</span>
              <strong>Funkcija + atmosfera.</strong>
              <i aria-hidden="true">02</i>
            </article>
            <article className="work-panel">
              <span>MREŽA</span>
              <strong>Čista infrastruktura.</strong>
              <i aria-hidden="true">03</i>
            </article>
            <a
              className="work-panel work-panel--link"
              href="https://www.instagram.com/elektroinstalacije_titan/"
              target="_blank"
              rel="noreferrer"
            >
              <span>VIŠE RADOVA</span>
              <strong>Instagram</strong>
              <Arrow />
            </a>
          </div>
        </section>

        <section className="contact section-screen" id="kontakt">
          <div className="contact-copy">
            <p className="kicker"><span /> 05 / KONTAKT</p>
            <h2>Imate projekat?<br /><em>Uključimo ga.</em></h2>
            <p>
              Pozovite i recite šta planirate. Dogovorićemo sljedeći korak i
              procjenu radova.
            </p>
          </div>

          <a className="contact-phone" href="tel:+38267152154">
            <small>POZOVITE TITAN</small>
            <strong>067 152 154</strong>
            <Arrow />
          </a>

          <div className="contact-meta">
            <span>CRNA GORA</span>
            <a
              href="https://www.instagram.com/elektroinstalacije_titan/"
              target="_blank"
              rel="noreferrer"
            >
              @elektroinstalacije_titan ↗
            </a>
          </div>
        </section>
      </main>

      <footer>
        <span>© {new Date().getFullYear()} TITAN ELEKTROINSTALACIJE</span>
        <a href="#top">NAZAD NA VRH ↑</a>
      </footer>
    </>
  );
}
