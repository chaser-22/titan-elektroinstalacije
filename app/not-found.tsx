export default function NotFound() {
  return (
    <main className="not-found">
      <div className="not-found__content">
        <p className="not-found__code" aria-hidden="true">
          404
        </p>
        <h1>Stranica nije pronađena.</h1>
        <p>
          Adresa možda nije ispravna ili je stranica premještena. Vratite se na
          početnu stranicu i nastavite pregled Titan usluga i projekata.
        </p>
        {/* A plain anchor keeps the static error page free of a client bundle. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className="button" href="/">
          Nazad na početnu <span aria-hidden="true">←</span>
        </a>
      </div>
    </main>
  );
}
