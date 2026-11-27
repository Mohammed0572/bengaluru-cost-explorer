export interface PageSeoConfig {
  type: string;
  siteName: string;
  title: string;
  description: string;
  url: string;
  image: string;
  imageType: string;
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
  twitterCard: string;
}

export interface ResolvedPageSeo extends PageSeoConfig {
  imageSecureUrl: string;
}

export const SITE_ORIGIN = "https://costinbengaluru.netlify.app";
export const OG_IMAGE_ASSET_PATH = "assets/New-costoflivingbenagluru.png";

export const SEO_META_START = "<!-- SEO_META_START -->";
export const SEO_META_END = "<!-- SEO_META_END -->";

export const DEFAULT_SEO: PageSeoConfig = {
  type: "website",
  siteName: "Cost of Living in Bengaluru",
  title: "Cost of Living in Bengaluru — Neighborhood Prices & Budget Explorer",
  description:
    "Explore real-time Bengaluru cost of living data across neighborhoods—compare housing rents, food, dining, utilities, and monthly lifestyle budgets.",
  url: `${SITE_ORIGIN}/`,
  image: `${SITE_ORIGIN}/${OG_IMAGE_ASSET_PATH}`,
  imageType: "image/png",
  imageWidth: 1909,
  imageHeight: 919,
  imageAlt:
    "Cost of Living in Bengaluru interactive dashboard showing neighborhood expense trends and category breakdowns",
  twitterCard: "summary_large_image",
};

export const PAGE_SEO: Record<string, Partial<PageSeoConfig>> = {
  "/": {},
  "/analytics": {
    title: "Cost Analytics & Trends | Cost of Living in Bengaluru",
    description:
      "Analyze Bengaluru living expense trends across housing, food, transportation, and utilities with interactive category breakdowns.",
    url: `${SITE_ORIGIN}/analytics`,
  },
  "/area-battle": {
    title: "Area Battle — Compare Bengaluru Neighborhoods | Cost of Living in Bengaluru",
    description:
      "Compare two Bengaluru neighborhoods head-to-head across rent, food, transit, and lifestyle costs to find the best value.",
    url: `${SITE_ORIGIN}/area-battle`,
  },
  "/lifestyle": {
    title: "Monthly Lifestyle & Budget Calculator | Cost of Living in Bengaluru",
    description:
      "Estimate your monthly Bengaluru living expenses by customizing neighborhood, housing type, dining, commute, and lifestyle habits.",
    url: `${SITE_ORIGIN}/lifestyle`,
  },
  "/restaurants": {
    title: "Bengaluru Restaurants & Dining Costs | Cost of Living in Bengaluru",
    description:
      "Browse top Bengaluru restaurants by neighborhood with ratings, cuisines, and average dining costs for two.",
    url: `${SITE_ORIGIN}/restaurants`,
  },
  "/real-estate": {
    title: "Bengaluru Real Estate & Housing Market | Cost of Living in Bengaluru",
    description:
      "Explore Bengaluru residential property prices, BHK configurations, and neighborhood real estate trends.",
    url: `${SITE_ORIGIN}/real-estate`,
  },
  "/about": {
    title: "About the Project | Cost of Living in Bengaluru",
    description:
      "Learn about the Bengaluru Cost Explorer project, data methodology, and the student team behind the platform.",
    url: `${SITE_ORIGIN}/about`,
  },
  "/contact": {
    title: "Contact Us | Cost of Living in Bengaluru",
    description:
      "Get in touch with the Cost of Living in Bengaluru team to ask questions, share feedback, or report a data issue.",
    url: `${SITE_ORIGIN}/contact`,
  },
  "/privacy": {
    title: "Privacy Policy | Cost of Living in Bengaluru",
    description:
      "Read the privacy policy for Cost of Living in Bengaluru and how submitted data and local storage are handled.",
    url: `${SITE_ORIGIN}/privacy`,
  },
  "/terms": {
    title: "Terms and Conditions | Cost of Living in Bengaluru",
    description:
      "Review the terms and conditions for using the Cost of Living in Bengaluru explorer and datasets.",
    url: `${SITE_ORIGIN}/terms`,
  },
  "/cookies": {
    title: "Cookie Policy | Cost of Living in Bengaluru",
    description:
      "Understand how cookies and browser storage preferences are used on Cost of Living in Bengaluru.",
    url: `${SITE_ORIGIN}/cookies`,
  },
};

function normalizeRoutePath(routePath: string): string {
  const withoutQuery = routePath.split(/[?#]/)[0] || "/";
  const withLeadingSlash = withoutQuery.startsWith("/") ? withoutQuery : `/${withoutQuery}`;
  if (withLeadingSlash.length > 1 && withLeadingSlash.endsWith("/")) {
    return withLeadingSlash.slice(0, -1);
  }
  return withLeadingSlash;
}

function toHttpsUrl(value: string): string {
  const resolved = new URL(value, SITE_ORIGIN);
  resolved.protocol = "https:";
  return resolved.toString();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function resolvePageSeo(routePath: string): ResolvedPageSeo {
  const normalized = normalizeRoutePath(routePath);
  const overrides = PAGE_SEO[normalized] ?? {};
  const merged: PageSeoConfig = {
    ...DEFAULT_SEO,
    ...overrides,
  };

  const url = toHttpsUrl(overrides.url ?? (normalized === "/" ? DEFAULT_SEO.url : `${SITE_ORIGIN}${normalized}`));
  const image = toHttpsUrl(merged.image);

  return {
    ...merged,
    url,
    image,
    imageSecureUrl: image,
  };
}

export function renderHeadMetaTags(seo: ResolvedPageSeo, indent = "    "): string {
  const lines = [
    `<title>${escapeHtml(seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
    `<link rel="canonical" href="${escapeHtml(seo.url)}" />`,
    ``,
    `<!-- Open Graph -->`,
    `<meta property="og:type" content="${escapeHtml(seo.type)}" />`,
    `<meta property="og:site_name" content="${escapeHtml(seo.siteName)}" />`,
    `<meta property="og:title" content="${escapeHtml(seo.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(seo.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(seo.url)}" />`,
    `<meta property="og:image" content="${escapeHtml(seo.image)}" />`,
    `<meta property="og:image:secure_url" content="${escapeHtml(seo.imageSecureUrl)}" />`,
    `<meta property="og:image:type" content="${escapeHtml(seo.imageType)}" />`,
    `<meta property="og:image:width" content="${seo.imageWidth}" />`,
    `<meta property="og:image:height" content="${seo.imageHeight}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(seo.imageAlt)}" />`,
    ``,
    `<!-- Twitter Card -->`,
    `<meta name="twitter:card" content="${escapeHtml(seo.twitterCard)}" />`,
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(seo.image)}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(seo.imageAlt)}" />`,
  ];

  return lines.map((line) => (line ? `${indent}${line}` : "")).join("\n");
}

export function injectSeoMeta(html: string, routePath: string): string {
  const startIdx = html.indexOf(SEO_META_START);
  const endIdx = html.indexOf(SEO_META_END);
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    return html;
  }

  const seo = resolvePageSeo(routePath);
  const rendered = renderHeadMetaTags(seo);
  return `${html.slice(0, startIdx + SEO_META_START.length)}\n${rendered}\n    ${html.slice(endIdx)}`;
}
