import Link from "next/link";
import { histologyToolPath } from "@/lib/histology-tool-copy";
import { localePath, locales, type Locale, getLocaleCopy } from "@/lib/site-data";

type Props = {
  locale: Locale;
  path?: string;
  children: React.ReactNode;
};

export function SiteFrame({ locale, path = "/", children }: Props) {
  const copy = getLocaleCopy(locale);

  return (
    <div className="site-shell">
      <header className="site-topbar">
        <div className="site-topbar__inner">
          <Link className="brand" href={localePath(locale, "/")}>
            <span className="brand__mark">SV</span>
            <span className="brand__text">ssvnauka.net</span>
          </Link>
          <nav className="site-nav" aria-label="Primary navigation">
            <Link href={localePath(locale, "/")}>{copy.nav.home}</Link>
            <Link href={localePath(locale, "/clinic")}>{copy.nav.clinic}</Link>
            <Link href={localePath(locale, histologyToolPath)}>{copy.nav.diagnostics}</Link>
            <Link href={localePath(locale, "/clinic#request")}>{copy.nav.consultation}</Link>
          </nav>
          <div className="lang-switch" aria-label="Language switcher">
            {locales.map((item) => (
              <Link key={item} href={localePath(item, path)} className={item === locale ? "is-active" : undefined}>
                {item.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </header>
      {children}
      <footer className="site-footer">
        <p>Prof. Sergiy Valentinovich Sushkov · ssvnauka.net</p>
      </footer>
    </div>
  );
}
