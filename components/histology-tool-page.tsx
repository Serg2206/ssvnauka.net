import Link from "next/link";
import { HistologyDbLookup } from "@/components/histology-db-lookup";
import { SiteFrame } from "@/components/site-frame";
import { getHistologyToolCopy, histologyToolPath } from "@/lib/histology-tool-copy";
import { getLocaleCopy, localePath, type Locale } from "@/lib/site-data";

export function HistologyToolPage({ locale }: { locale: Locale }) {
  const copy = getHistologyToolCopy(locale);
  const commonCopy = getLocaleCopy(locale);

  return (
    <SiteFrame locale={locale} path={histologyToolPath}>
      <main>
        <section className="hero hero--compact">
          <div className="hero__copy">
            <p className="eyebrow">{copy.kicker}</p>
            <h1>{copy.title}</h1>
            <p className="lead">{copy.description}</p>
            <div className="hero-actions">
              <a
                className="button button--primary"
                href="https://t.me/SSVproff_bot"
                target="_blank"
                rel="noreferrer"
              >
                {copy.ctaButton}
              </a>
              <Link className="button button--secondary" href={localePath(locale, "/clinic#request")}>
                {commonCopy.nav.consultation}
              </Link>
            </div>
          </div>
          <div className="hero__visual hero__visual--stacked">
            <article className="mini-card">
              <h2>{copy.discussTitle}</h2>
              <ul className="list">
                {copy.discussItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="panel">
          <div className="card-grid card-grid--2">
            <article className="card">
              <h2>{copy.receiveTitle}</h2>
              <ul className="list">
                {copy.receiveItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="card">
              <h2>{copy.howTitle}</h2>
              <ol className="numbered-list">
                {copy.howSteps.map((step) => (
                  <li key={step.title}>
                    <strong>{step.title}</strong>
                    <p>{step.description}</p>
                  </li>
                ))}
              </ol>
            </article>
          </div>
        </section>

        <section className="panel panel--soft">
          <article className="card">
            <p>
              <strong>{copy.whyImportantLabel}</strong> {copy.whyImportantText}
            </p>
          </article>
          <div className="card-grid card-grid--2">
            {copy.examples.map((example) => (
              <article className="card" key={example.term}>
                <h3>{example.term}</h3>
                <p>{example.explanation}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <HistologyDbLookup locale={locale} />
        </section>

        <section className="panel">
          <div className="card-grid card-grid--2">
            <article className="card">
              <h2>{copy.usefulTitle}</h2>
              <ul className="list">
                {copy.usefulItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="card card--accent">
              <h2>{copy.ctaTitle}</h2>
              <p>{copy.ctaText}</p>
              <p>{copy.contactsLine}</p>
              <a href="https://t.me/SSVproff_bot" target="_blank" rel="noreferrer" className="text-link">
                {copy.ctaButton}
              </a>
            </article>
          </div>
        </section>

        <section className="panel">
          <div className="card-grid card-grid--2">
            <article className="card">
              <h2>{copy.relatedTitle}</h2>
              <ul className="list">
                {copy.relatedItems.map((item) => (
                  <li key={item.href}>
                    <Link href={localePath(locale, item.href)}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </article>
            <article className="card">
              <p>
                <strong>{copy.disclaimerTitle}</strong> {copy.disclaimerText}
              </p>
            </article>
          </div>
        </section>
      </main>
    </SiteFrame>
  );
}
