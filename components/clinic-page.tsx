import Link from "next/link";
import { SiteFrame } from "@/components/site-frame";
import { IntakeForm } from "@/components/intake-form";
import { localePath, type Locale, getLocaleCopy, serviceSlugs } from "@/lib/site-data";

export function ClinicPage({ locale }: { locale: Locale }) {
  const copy = getLocaleCopy(locale);

  return (
    <SiteFrame locale={locale} path="/clinic">
      <main>
        <section className="hero hero--compact">
          <div className="hero__copy">
            <p className="eyebrow">{copy.clinic.eyebrow}</p>
            <h1>{copy.clinic.title}</h1>
            <p className="lead">{copy.clinic.copy}</p>
            <p className="notice">{copy.clinic.emergencyNotice}</p>
            <div className="contact-pills">
              <span>{copy.clinic.locationLabel}: {copy.contacts.city}</span>
              <span>{copy.clinic.emailLabel}: <a href={`mailto:${copy.contacts.email}`}>{copy.contacts.email}</a></span>
              <span>{copy.clinic.telegramLabel}: <a href="https://t.me/SSVproff" target="_blank" rel="noreferrer">{copy.contacts.telegram}</a></span>
              <span>{copy.clinic.phoneLabel}: <a href={`tel:${copy.contacts.phone}`}>{copy.contacts.phone}</a></span>
            </div>
          </div>
          <div className="hero__visual hero__visual--map">
            <iframe
              src="https://www.google.com/maps?q=Kharkiv%2C%20Ukraine&z=12&output=embed"
              title="Kharkiv map"
              loading="lazy"
            />
          </div>
        </section>

        <section className="panel panel--soft">
          <div className="card-grid card-grid--2">
            <article className="card">
              <h2>{copy.clinic.formTitle}</h2>
              <p>{copy.clinic.formCopy}</p>
              <p className="disclaimer">{copy.clinic.disclaimer}</p>
            </article>
            <article className="card">
              <h2>{copy.consultation.title}</h2>
              <ol className="numbered-list">
                {copy.consultation.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </article>
          </div>
        </section>

        <section id="request" className="panel">
          <div className="card-grid card-grid--2">
            <article className="card card--accent">
              <h2>{copy.clinic.formTitle}</h2>
              <p>{copy.clinic.formCopy}</p>
              <IntakeForm locale={locale} />
            </article>
            <article className="card">
              <h2>{copy.clinic.title}</h2>
              <ul className="list">
                <li>{copy.clinic.emergencyNotice}</li>
                <li>{copy.clinic.privacyCopy}</li>
                <li>
                  {serviceSlugs.map((slug, index) => (
                    <span key={slug}>
                      <Link href={localePath(locale, `/services/${slug}`)}>
                        {getLocaleCopy(locale).servicesDetail[slug].title}
                      </Link>
                      {index < serviceSlugs.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </li>
              </ul>
            </article>
          </div>
        </section>
      </main>
    </SiteFrame>
  );
}
