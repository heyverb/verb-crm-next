import { Metadata } from "next";

export const generateMetadata = (
  title: string,
  description: string
): Metadata => {
  const metadata = {
    metadataBase: new URL("https://verbschool.com"),
    title: title || "VERB - Smart School CRM",
    description:
      description ||
      "A smart solution to manage school admissions, documents, and student records.",
    applicationName: "VERB",
    authors: [{ name: "VERB Team", url: "https://verbschool.com/about" }],
    generator: "Next.js",
    keywords: [
      "school CRM",
      "admissions",
      "student management",
      "smart school",
      "education software",
    ],
    referrer: "origin-when-cross-origin" as any,
    creator: "VERB Team",
    publisher: "VERB School Tech",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "standard" as "standard" | "none" | "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    alternates: {
      canonical: "https://verbschool.com",
      languages: {
        "en-US": "https://verbschool.com/en-US",
      },
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
      shortcut: "/favicon-32x32.png",
    },
    openGraph: {
      title: "VERB - Smart School CRM",
      description: "A smart, fast and reliable CRM system for schools.",
      url: "https://verbschool.com",
      siteName: "VERB",
      images: [
        {
          url: "https://verbschool.com/og-image.png",
          width: 1200,
          height: 630,
          alt: "VERB Dashboard Preview",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "VERB - Smart School CRM",
      description: "Streamline your school’s management with VERB.",
      creator: "@verbteam",
      images: ["https://verbschool.com/og-image.png"],
    },
    appleWebApp: {
      title: "VERB",
      statusBarStyle: "default" as "default" | "black" | "black-translucent" | undefined,
      startupImage: ["/launch.png"],
      capable: true,
    },
    verification: {
      google: "YOUR_GOOGLE_SITE_VERIFICATION",
      other: {
        bing: "YOUR_BING_VERIFICATION_CODE",
      },
    },
    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },
    abstract:
      "VERB is a smart CRM system built for schools to simplify administration.",
    category: "Education",
    classification: "School CRM",
    pagination: {
      previous: null,
      next: null,
    },
  };
  return metadata;
};
