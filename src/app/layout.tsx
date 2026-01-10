import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { prisma } from "@/lib/prisma";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pega 25.1 Learning App",
  description: "Master Pega 25.1 from Basic to Advanced",
  manifest: "/manifest.json",
  themeColor: "#4f46e5",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Pega App",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch topics from DB to sync with sidebar
  const dbTopics = await prisma.topicSection.findMany({
    include: {
      subTopics: {
        orderBy: { order: 'asc' }
      }
    },
    orderBy: { order: 'asc' }
  });

  // Transform to match TopicSection interface if needed (Prisma returns it mostly correctly)
  const topicsData = dbTopics.map(section => ({
    ...section,
    subTopics: section.subTopics.map(sub => ({
      ...sub,
      content: {
        introduction: sub.introduction,
        explanation: sub.explanation,
        implementation: sub.implementation,
        example: sub.example,
        pptUrl: sub.pptUrl || undefined
      }
    }))
  }));

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-white`}>
        <SessionProvider>
          <div className="flex h-screen overflow-hidden">
            <AppSidebar initialTopics={topicsData} />
            <div className="flex-1 overflow-auto bg-gray-50 p-8">
              {children}
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
