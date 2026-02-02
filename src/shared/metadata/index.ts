import type { Metadata, Viewport } from "next";

const APP_NAME = "TTS Indonesia";
const APP_DESCRIPTION =
  "Aplikasi pembuat dan pemain Teka Teki Silang (TTS) Indonesia. Buat puzzle sendiri atau mainkan TTS yang sudah tersedia!";
const APP_URL = "https://my-tts.xfhreall.tech/";

export const siteConfig = {
  name: APP_NAME,
  description: APP_DESCRIPTION,
  url: APP_URL,
  ogImage: `${APP_URL}/og-image.png`,
  creator: "xfhreall",
  keywords: [
    "TTS",
    "Teka Teki Silang",
    "Crossword",
    "Puzzle",
    "Game",
    "Indonesia",
    "Word Game",
    "Brain Teaser",
  ],
};

export const baseMetadata: Metadata = {
  title: {
    default: `${siteConfig.name} - Buat & Main Teka Teki Silang`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.creator }],
  creator: siteConfig.creator,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: `@${siteConfig.creator}`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const baseViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export function createMetadata(options: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const { title, description, image, noIndex } = options;

  return {
    title,
    description: description || siteConfig.description,
    openGraph: {
      title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
      description: description || siteConfig.description,
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
      description: description || siteConfig.description,
      images: image ? [image] : undefined,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}

export const pageMetadata = {
  home: createMetadata({
    title: "Beranda",
    description:
      "Buat dan mainkan Teka Teki Silang Indonesia. Ratusan puzzle menanti untuk dipecahkan!",
  }),
  puzzles: createMetadata({
    title: "Daftar Puzzle",
    description:
      "Jelajahi koleksi puzzle TTS Indonesia. Pilih tingkat kesulitan sesuai kemampuanmu!",
  }),
  play: (puzzleTitle: string) =>
    createMetadata({
      title: `Mainkan: ${puzzleTitle}`,
      description: `Mainkan puzzle TTS "${puzzleTitle}" sekarang. Uji kemampuan kosakatamu!`,
    }),
  admin: createMetadata({
    title: "Dashboard Admin",
    description: "Kelola puzzle TTS Indonesia Anda",
    noIndex: true,
  }),
  adminCreate: createMetadata({
    title: "Buat Puzzle Baru",
    description: "Buat Teka Teki Silang baru dengan kata dan petunjuk Anda sendiri",
    noIndex: true,
  }),
  login: createMetadata({
    title: "Login Admin",
    description: "Masuk ke panel admin TTS Indonesia",
    noIndex: true,
  }),
};
