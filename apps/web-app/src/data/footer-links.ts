export type FooterColumn = {
  heading: string;
  links: { label: string; href: string }[];
};

export const footerColumns: FooterColumn[] = [
  {
    heading: "Product",
    links: [
      { label: "Features",    href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Pricing",     href: "#pricing" },
      { label: "Changelog",   href: "/changelog" },
      { label: "Roadmap",     href: "/roadmap" },
    ],
  },
  {
    heading: "Developers",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "API Reference", href: "/docs/api" },
      { label: "SDK",           href: "/docs/sdk" },
      { label: "Quickstart",    href: "/docs/quickstart" },
      { label: "Status",        href: "https://status.aurik.dev" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About",            href: "/about" },
      { label: "Contact",          href: "/contact" },
      { label: "Privacy Policy",   href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "hello@aurik.dev",  href: "mailto:hello@aurik.dev" },
    ],
  },
];
