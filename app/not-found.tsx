import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ padding: "4rem 1.25rem", maxWidth: 840, margin: "0 auto" }}>
      <p className="eyebrow">404</p>
      <h1 style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: "clamp(2.5rem, 6vw, 4rem)", lineHeight: 1.1 }}>
        The requested page was not found.
      </h1>
      <p style={{ color: "var(--muted)", maxWidth: "60ch" }}>
        Go back to the homepage or open the clinic page to continue.
      </p>
      <p style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link className="button button--primary" href="/">
          Home
        </Link>
        <Link className="button button--secondary" href="/clinic">
          Clinic
        </Link>
      </p>
    </main>
  );
}
