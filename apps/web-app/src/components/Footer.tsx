import Link from "next/link";
import { footerColumns } from "@/data/footer-links";
import { socialLinks } from "@/data/social-links";

export default function Footer() {
  return (
    <footer className="w-full bg-(--color-page-bg) border-t border-(--color-border)">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 pb-12">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <span className="text-h2 text-heading">Aurik</span>
            <p className="text-body text-body-color max-w-xs">
              The simple identity platform. Add secure sign-in, OAuth 2.0, and
              user management to any application with ease.
            </p>
            <div className="flex items-center gap-4 mt-2">
              {socialLinks.map(({ href, label, icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-color no-underline transition-colors duration-150 hover:text-(--color-link-hover)"
                >
                  {icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {footerColumns.map(({ heading, links }) => (
            <div key={heading} className="flex flex-col gap-4">
              <span className="text-eyebrow text-lime underline underline-offset-4">
                {heading}
              </span>
              <nav className="flex flex-col gap-3">
                {links.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className="text-body text-body-color no-underline transition-colors duration-150 hover:text-(--color-link-hover)"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Divider */}
        <hr className="divider" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-6">
          <span className="text-sm text-body-color">
            © {new Date().getFullYear()} Aurik. All rights reserved.
          </span>
          <span className="text-sm text-body-color">aurik.bikashshaw.in</span>
        </div>
      </div>
    </footer>
  );
}
