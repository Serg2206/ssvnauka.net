import Link from "next/link";
import { histologyToolPath } from "@/lib/histology-tool-copy";
import { localePath, type Locale, getLocaleCopy } from "@/lib/site-data";

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
            <span className="brand__text">Prof. Sergiy Sushkov</span>
          </Link>
          <nav className="site-nav" aria-label="Primary navigation">
            <Link href={localePath(locale, "/")}>{copy.nav.home}</Link>
            <Link href={localePath(locale, "/clinic")}>{copy.nav.clinic}</Link>
            <Link href={localePath(locale, histologyToolPath)}>{copy.nav.diagnostics}</Link>
            <Link href={localePath(locale, "/clinic#request")}>{copy.nav.consultation}</Link>
          </nav>
          <div className="lang-switch" aria-label="Language switcher">
            <Link href={localePath("en", path)} className={locale === "en" ? "is-active" : undefined}>
              EN
            </Link>
            {/* RU/UK-версии обслуживаются на клиническом сайте ssvnauka.com */}
            <a href="https://ssvnauka.com/">RU</a>
            <a href="https://ssvnauka.com/">UK</a>
          </div>
        </div>
      </header>
      {children}
      <footer className="site-footer">
        <p>
          Prof. Sergiy Valentinovich Sushkov · <a href="https://ssvnauka.com/">MARIA Medical Center — ssvnauka.com</a>
        </p>
      </footer>
    </div>
  );
}
