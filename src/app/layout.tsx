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
      <body className={`${inter.className} min-h-screen bg-[#f8fafc] text-slate-900 group/body`}>
        <SessionProvider>
          <div className="flex h-screen overflow-hidden relative">
            {/* Ambient Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[120px] pointer-events-none" style={{ animationDelay: '2s' }} />
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-200/20 rounded-full blur-[100px] pointer-events-none" />

            <AppSidebar initialTopics={topicsData} />
            <div className="flex-1 overflow-auto p-8 relative z-10">
              <div className="max-w-6xl mx-auto">
                {children}
              </div>
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
