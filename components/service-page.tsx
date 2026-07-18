import Link from "next/link";
import { SiteFrame } from "@/components/site-frame";
import { localePath, type Locale, type ServiceSlug, getLocaleCopy, getServiceCopy } from "@/lib/site-data";

export function ServicePage({ locale, slug }: { locale: Locale; slug: ServiceSlug }) {
  const copy = getLocaleCopy(locale);
  const service = getServiceCopy(locale, slug);

  return (
    <SiteFrame locale={locale} path={`/services/${slug}`}>
      <main>
        <section className="hero hero--compact">
          <div className="hero__copy">
            <p className="eyebrow">{copy.services.title}</p>
            <h1>{service.title}</h1>
            <p className="lead">{service.intro}</p>
            <div className="hero-actions">
              <Link className="button button--primary" href={localePath(locale, "/clinic#request")}>
                {copy.nav.consultation}
              </Link>
              <Link className="button button--secondary" href={localePath(locale, "/clinic")}>
                {copy.nav.clinic}
              </Link>
            </div>
          </div>
          <div className="hero__visual hero__visual--stacked">
            <article className="mini-card">
              <h2>{service.indicationsTitle}</h2>
              <ul className="list">
                {service.indications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="panel">
          <div className="card-grid card-grid--2">
            <article className="card">
              <h2>{service.preparationTitle}</h2>
              <ul className="list">
                {service.preparation.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="card">
              <h2>{service.urgentTitle}</h2>
              <ul className="list">
                {service.urgent.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>
      </main>
    </SiteFrame>
  );
}
