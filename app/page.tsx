import Image from "next/image";

const primaryServices = [
  {
    number: "01",
    title: "Naglašena usluga",
    text: "Kratak opis najvažnije usluge i koristi koju klijent dobija.",
    tag: "PLACEHOLDER",
  },
  {
    number: "02",
    title: "Naglašena usluga",
    text: "Kratak opis najvažnije usluge i koristi koju klijent dobija.",
    tag: "PLACEHOLDER",
  },
  {
    number: "03",
    title: "Naglašena usluga",
    text: "Kratak opis najvažnije usluge i koristi koju klijent dobija.",
    tag: "PLACEHOLDER",
  },
];

const serviceGroups = [
  {
    title: "Jaka struja",
    items: [
      "Elektroinstalacije u novogradnji",
      "Razvodne table i osigurači",
      "Utičnice, prekidači i rasvjeta",
      "Održavanje elektroinstalacija",
    ],
  },
  {
    title: "Slaba struja",
    items: [
      "Video nadzor i alarmi",
      "Interfoni i video interfoni",
      "Mrežna infrastruktura (LAN)",
      "Smart home sistemi",
    ],
  },
  {
    title: "Adaptacije",
    items: [
      "Renoviranje stambenih prostora",
      "Montaža i zamjena opreme",
      "Podno grijanje",
      "Hitne intervencije",
    ],
  },
];

const projects = [
  { id: "01", label: "FOTOGRAFIJA PROJEKTA", type: "Rasvjeta" },
  { id: "02", label: "FOTOGRAFIJA PROJEKTA", type: "Razvodna tabla" },
  { id: "03", label: "FOTOGRAFIJA PROJEKTA", type: "Adaptacija" },
  { id: "04", label: "FOTOGRAFIJA PROJEKTA", type: "Instalacije" },
  { id: "05", label: "FOTOGRAFIJA PROJEKTA", type: "Slaba struja" },
  { id: "06", label: "FOTOGRAFIJA PROJEKTA", type: "Montaža" },
];

const process = [
  ["01", "Kontakt", "Pozivom ili porukom opišite šta vam je potrebno."],
  ["02", "Procjena", "Dogovaramo obilazak i definišemo obim radova."],
  ["03", "Ponuda", "Dobijate jasan prijedlog radova i termina."],
  ["04", "Izvođenje", "Radove završavamo prema dogovorenom planu."],
];

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`arrow-icon ${className}`.trim()}
      focusable="false"
      viewBox="0 0 24 24"
    >
      <path d="M6 18 18 6M9 6h9v9" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#glavni-sadrzaj">
        Preskoči na glavni sadržaj
      </a>

      <div className="announcement">
        <div className="announcement__track" aria-hidden="true">
          <span>ELEKTROINSTALACIJE</span>
          <span>•</span>
          <span>CRNA GORA</span>
          <span>•</span>
          <span>JAKA I SLABA STRUJA</span>
          <span>•</span>
          <span>ELEKTROINSTALACIJE</span>
          <span>•</span>
          <span>CRNA GORA</span>
          <span>•</span>
          <span>JAKA I SLABA STRUJA</span>
        </div>
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Titan početna">
          <span className="brand__mark">LOGO</span>
          <span className="brand__text">
            <strong>TITAN</strong>
            <small>ELEKTROINSTALACIJE</small>
          </span>
        </a>
        <nav aria-label="Glavna navigacija">
          <a href="#usluge">Usluge</a>
          <a href="#projekti">Projekti</a>
          <a href="#o-nama">O nama</a>
        </nav>
        <a className="button button--small" href="tel:+38267152154">
          Pozovite nas <ArrowIcon />
        </a>
      </header>

      <main id="glavni-sadrzaj" tabIndex={-1}>
      <section className="hero" id="top">
        <div className="hero__grid" aria-hidden="true" />
        <div className="hero__copy">
          <p className="eyebrow"><span /> TIM ELEKTRIČARA • CRNA GORA</p>
          <h1>
            Pouzdano.<br />
            Precizno.<br />
            <em>Pod naponom.</em>
          </h1>
          <p className="hero__lead">
            Kompletne električarske usluge za domove, poslovne prostore i
            objekte — od prve instalacije do posljednjeg prekidača.
          </p>
          <div className="hero__actions">
            <a className="button" href="tel:+38267152154">
              067 152 154 <ArrowIcon />
            </a>
            <a className="text-link" href="#projekti">
              Pogledajte projekte <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="hero__disciplines" aria-label="Oblasti rada">
            <span>JAKA STRUJA</span>
            <span>SLABA STRUJA</span>
            <span>ADAPTACIJE</span>
          </div>
        </div>

        <div className="hero__visual">
          <Image
            className="hero__image"
            src="/images/hero-electrician.webp"
            alt="Električar izvodi precizne radove na razvodnoj tabli"
            width={1536}
            height={1024}
            preload
            sizes="(max-width: 1180px) 100vw, 50vw"
          />
          <div className="hero__image-shade" aria-hidden="true" />
        </div>
      </section>

      <section className="services section" id="usluge">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> ŠTA RADIMO</p>
            <h2>Usluge koje drže<br />sve <em>povezanim.</em></h2>
          </div>
          <p>
            Od jednostavne montaže do kompletnih instalacija — jedan tim za
            sigurno i uredno izveden posao.
          </p>
        </div>

        <div className="featured-services">
          {primaryServices.map((service) => (
            <article className="featured-card" key={service.number}>
              <div className="featured-card__top">
                <span>{service.number}</span>
                <small>{service.tag}</small>
              </div>
              <div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </div>
              <ArrowIcon className="featured-card__arrow" />
            </article>
          ))}
        </div>

        <div className="service-groups">
          {serviceGroups.map((group, groupIndex) => (
            <article className="service-group" key={group.title}>
              <span className="service-group__number">0{groupIndex + 1}</span>
              <h3>{group.title}</h3>
              <ul>
                {group.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="about section" id="o-nama">
        <div className="about__visual" aria-label="Mjesto za fotografiju tima">
          <div className="about__placeholder">
            <span>FOTOGRAFIJA TIMA</span>
            <strong>TEAM<br />PHOTO</strong>
            <small>PLACEHOLDER • 02</small>
          </div>
          <div className="about__stamp">TITAN<br />CG</div>
        </div>
        <div className="about__copy">
          <p className="eyebrow"><span /> O NAMA</p>
          <h2>Struja je naš zanat.<br /><em>Povjerenje</em> je standard.</h2>
          <p className="about__intro">
            PRIVREMENI TEKST — Ovdje dolazi kratka priča o Titan timu,
            iskustvu i pristupu radu. Dva do tri konkretna pasusa biće dovoljna
            da klijent odmah zna ko dolazi na teren.
          </p>
          <div className="about__facts">
            <div><span>LOKACIJA</span><strong>Crna Gora</strong></div>
            <div><span>SERVISNA ZONA</span><strong>Placeholder</strong></div>
            <div><span>DOSTUPNOST</span><strong>Po dogovoru</strong></div>
          </div>
        </div>
      </section>

      <section className="projects section" id="projekti">
        <div className="section-heading section-heading--projects">
          <div>
            <p className="eyebrow"><span /> IZDVOJENI RADOVI</p>
            <h2>Rezultati govore<br /><em>najglasnije.</em></h2>
          </div>
          <a
            className="text-link"
            href="https://www.instagram.com/elektroinstalacije_titan/"
            target="_blank"
            rel="noreferrer"
          >
            Pogledajte Instagram <ArrowIcon />
          </a>
        </div>

        <div className="project-grid">
          {projects.map((project, index) => (
            <article className={`project-card project-card--${index + 1}`} key={project.id}>
              <div className="project-card__placeholder">
                <span>{project.label}</span>
                <strong>PROJECT<br />PHOTO</strong>
                <small>PLACEHOLDER • {project.id}</small>
              </div>
              <div className="project-card__meta">
                <span>{project.type}</span>
                <span>0{index + 1}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="process section">
        <div className="process__heading">
          <p className="eyebrow"><span /> KAKO RADIMO</p>
          <h2>Jednostavno od<br />poziva do <em>završetka.</em></h2>
        </div>
        <div className="process__steps">
          {process.map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact" id="kontakt">
        <div className="contact__bolt" aria-hidden="true">T</div>
        <div className="contact__content">
          <p className="eyebrow"><span /> KONTAKT</p>
          <h2>Imate projekat?<br /><em>Uključimo ga.</em></h2>
          <p>
            Opišite nam šta vam je potrebno. Javićemo se radi dogovora i
            procjene radova.
          </p>
          <a className="contact__phone" href="tel:+38267152154">
            <small>POZOVITE NAS</small>
            <strong>067 152 154</strong>
            <ArrowIcon />
          </a>
        </div>
        <div className="contact__details">
          <div>
            <span>E-MAIL</span>
            <a href="mailto:email@placeholder.me">email@placeholder.me</a>
          </div>
          <div>
            <span>INSTAGRAM</span>
            <a
              href="https://www.instagram.com/elektroinstalacije_titan/"
              target="_blank"
              rel="noreferrer"
            >
              @elektroinstalacije_titan
            </a>
          </div>
          <div>
            <span>SERVISNA ZONA</span>
            <strong>PLACEHOLDER, CRNA GORA</strong>
          </div>
        </div>
      </section>

      </main>

      <footer>
        <a className="brand brand--footer" href="#top" aria-label="Titan početna">
          <span className="brand__mark">LOGO</span>
          <span className="brand__text"><strong>TITAN</strong><small>ELEKTROINSTALACIJE</small></span>
        </a>
        <p>© {new Date().getFullYear()} Titan Elektroinstalacije</p>
        <a href="#top">Nazad na vrh ↑</a>
      </footer>
    </>
  );
}
