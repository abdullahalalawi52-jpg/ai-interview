import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

import { getI18nMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const baseMeta = await getI18nMetadata(
    "AI Interview Prep | تحضير المقابلة الذكية",
    "AI Interview Prep",
    "تدرب على مقابلات العمل بتقنية الذكاء الاصطناعي مع تقييم فوري وتحليل للسيرة الذاتية واختبارات تقنية مخصصة.",
    "Practice job interviews using AI with instant feedback, resume analysis, and customized technical quizzes."
  );

  return {
    title: {
      template: typeof baseMeta.title === "string" ? `%s | ${baseMeta.title}` : "%s | AI Interview Prep",
      default: baseMeta.title as string,
    },
    description: baseMeta.description,
    keywords: ["AI", "Interview", "Preparation", "Resume Analysis", "ATS", "ذكاء اصطناعي", "مقابلات شخصية", "سيرة ذاتية", "توظيف"],
    openGraph: {
      title: baseMeta.title as string,
      description: baseMeta.description as string,
      url: "https://ai-interview-prep.vercel.app",
      siteName: "AI Interview Prep",
      locale: "ar_SA",
      type: "website",
      images: [
        {
          url: "https://ai-interview-prep.vercel.app/og-image.png",
          width: 1200,
          height: 630,
          alt: "AI Interview Prep",
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: baseMeta.title as string,
      description: baseMeta.description as string,
      images: ["https://ai-interview-prep.vercel.app/og-image.png"],
    }
  };
}
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider, Language } from "@/context/LanguageContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import SkipLink from "@/components/SkipLink";
import { cookies } from "next/headers";

import { Toaster } from "react-hot-toast";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialLang = (cookieStore.get("NEXT_LOCALE")?.value || "ar") as Language;
  const initialDir = initialLang === "ar" ? "rtl" : "ltr";

  return (
    <html lang={initialLang} dir={initialDir} className={`${cairo.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "AI Interview Prep",
                "applicationCategory": "EducationalApplication",
                "operatingSystem": "Any",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "كيف تعمل منصة تحضير المقابلة الذكية؟",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "تقوم المنصة بمحاكاة مقابلة حقيقية بالذكاء الاصطناعي الصوتي بناءً على تخصصك والشركة المستهدفة، وتقدم لك تقييماً فورياً بعد انتهاء المقابلة."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "هل يمكنني التدرب باللغة الإنجليزية والعربية؟",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "نعم، تدعم المنصة التدرب على المقابلات الشخصية باللغتين العربية والإنجليزية بالكامل."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "كيف يتم تقييم أدائي؟",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "يقوم الذكاء الاصطناعي بتحليل إجاباتك وتقديم تقرير مفصل يوضح نقاط القوة ونقاط الضعف والمواضيع المقترحة للتطوير."
                    }
                  }
                ]
              }
            ])
          }}
        />
      </head>
      <body className="min-h-screen bg-surface text-on-surface font-body-lg flex flex-col transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider initialLanguage={initialLang}>
            <SkipLink />
            <AuthProvider>
              {children}
              <Toaster position="bottom-center" />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
