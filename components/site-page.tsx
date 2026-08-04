import Image from "next/image";
import Link from "next/link";
import { SiteFrame } from "@/components/site-frame";
import { absoluteUrl, localePath, serviceSlugs, type Locale, getLocaleCopy } from "@/lib/site-data";

export function SitePage({ locale }: { locale: Locale }) {
  const copy = getLocaleCopy(locale);

  return (
    <SiteFrame locale={locale} path="/">
      <main>
        <section className="hero">
          <div className="hero__copy">
            <p className="eyebrow">{copy.hero.eyebrow}</p>
            <h1>{copy.hero.title}</h1>
            <p className="lead">{copy.hero.copy}</p>
            <div className="hero-actions">
              <Link className="button button--primary" href={localePath(locale, "/clinic#request")}>
                {copy.hero.primaryCta}
              </Link>
              <Link className="button button--secondary" href={localePath(locale, "/clinic")}>
                {copy.hero.secondaryCta}
              </Link>
              <Link
                className="button button--secondary button--patients"
                href={`${localePath(locale, "/diagnostika/rasshifrovka-gistologii")}?audience=patients`}
              >
                {copy.hero.histologyPatientsCta}
              </Link>
              <Link
                className="button button--secondary button--doctors"
                href={`${localePath(locale, "/diagnostika/rasshifrovka-gistologii")}?audience=doctors`}
              >
                {copy.hero.histologyDoctorsCta}
              </Link>
            </div>
            <ul className="chip-list">
              {copy.hero.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="hero__visual">
            <Image
              src="/professor-photo.jpg"
              alt="Prof. Sergiy Valentinovich Sushkov"
              width={853}
              height={1280}
              priority
              sizes="(min-width: 900px) 420px, 90vw"
              style={{ width: "100%", height: "auto", borderRadius: 24 }}
            />
          </div>
        </section>

        <section id="services" className="panel">
          <div className="section-heading">
            <div>
              <p className="section-kicker">{copy.services.title}</p>
              <h2>{copy.services.intro}</h2>
            </div>
          </div>
          <div className="card-grid card-grid--3">
            {serviceSlugs.map((slug) => {
              const service = copy.servicesDetail[slug];

              return (
                <article className="card" key={slug}>
                  <h3>{service.title}</h3>
                  <p>{service.summary}</p>
                  <Link className="text-link" href={localePath(locale, `/services/${slug}`)}>
                    {copy.services.cta}
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section className="panel panel--soft">
          <div className="card-grid card-grid--2">
            <article className="card">
              <p className="section-kicker">{copy.conditions.title}</p>
              <ul className="list">
                {copy.conditions.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="card">
              <p className="section-kicker">{copy.experience.title}</p>
              <p>{copy.experience.copy}</p>
              <div className="metrics">
                {copy.experience.metrics.map((metric) => (
                  <div className="metric" key={metric.label}>
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="panel">
          <div className="card-grid card-grid--2">
            <article className="card">
              <p className="section-kicker">{copy.consultation.title}</p>
              <p>{copy.consultation.copy}</p>
              <ol className="numbered-list">
                {copy.consultation.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </article>
            <article className="card">
              <p className="section-kicker">{copy.faq.title}</p>
              <div className="faq-list">
                {copy.faq.items.map((item) => (
                  <details key={item.question} className="faq-item">
                    <summary>{item.question}</summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>
            </article>
          </div>
        </section>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Person",
                "@id": "https://ssvnauka.com/#person",
                name: "Prof. Sergiy Valentinovich Sushkov",
                jobTitle: ["Surgeon", "Oncologist", "Professor", "Researcher"],
                url: "https://ssvnauka.com/",
                image: absoluteUrl("/professor-photo.jpg"),
                email: "ssvproff@gmail.com",
                medicalSpecialty: ["Surgical", "Oncologic"],
                worksFor: { "@id": "https://ssvnauka.com/#clinic" },
                sameAs: [
                  "https://orcid.org/0000-0002-6951-9789",
                  "https://www.scopus.com/authid/detail.uri?authorId=55360196800",
                  "https://scholar.google.com/citations?user=HcOG6WIAAAAJ"
                ]
              },
              {
                "@type": "MedicalBusiness",
                "@id": "https://ssvnauka.com/#clinic",
                name: "Medical Center MARIA",
                telephone: copy.contacts.phone,
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "вул. Сірохінська, 7-Б",
                  addressLocality: "Kharkiv",
                  addressCountry: "UA"
                },
                url: "https://ssvnauka.com/",
                employee: { "@id": "https://ssvnauka.com/#person" }
              },
              {
                "@type": "FAQPage",
                "@id": absoluteUrl(localePath(locale, "/#faq")),
                mainEntity: copy.faq.items.map((item) => ({
                  "@type": "Question",
                  name: item.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: item.answer
                  }
                }))
              },
              {
                "@type": "Review",
                "@id": absoluteUrl(localePath(locale, "/#review")),
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: "5",
                  bestRating: "5",
                  worstRating: "1"
                },
                author: {
                  "@type": "Person",
                  name: "Medical Center MARIA"
                },
                itemReviewed: {
                  "@type": "MedicalBusiness",
                  "@id": "https://ssvnauka.com/#clinic",
                  name: "Medical Center MARIA"
                },
                reviewBody: "Professional surgical and oncological medical services.",
                datePublished: "2026-07-03"
              }
            ]
          })
        }}
      />
    </SiteFrame>
  );
}
