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
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 text-slate-900 group/body`}>
        <SessionProvider>
          {/* Premium Gradient Mesh Background */}
          <div className="gradient-mesh" />

          {/* Dot Grid Pattern Overlay */}
          <div className="fixed inset-0 dot-grid opacity-40 pointer-events-none z-0" />

          <div className="flex h-screen overflow-hidden relative">
            {/* Enhanced Ambient Background Blobs with better animations */}
            <div className="absolute top-[-15%] left-[-15%] w-[50%] h-[50%] bg-gradient-to-br from-indigo-300/40 to-purple-300/30 rounded-full blur-[140px] pointer-events-none animate-pulse pulse-glow" />
            <div className="absolute bottom-[-15%] right-[-15%] w-[50%] h-[50%] bg-gradient-to-tl from-purple-300/40 to-pink-300/30 rounded-full blur-[140px] pointer-events-none pulse-glow" style={{ animationDelay: '2s' }} />
            <div className="absolute top-[30%] right-[15%] w-[35%] h-[35%] bg-gradient-to-br from-blue-300/30 to-cyan-300/20 rounded-full blur-[120px] pointer-events-none pulse-glow" style={{ animationDelay: '4s' }} />
            <div className="absolute bottom-[40%] left-[20%] w-[30%] h-[30%] bg-gradient-to-tr from-violet-300/25 to-fuchsia-300/20 rounded-full blur-[100px] pointer-events-none pulse-glow" style={{ animationDelay: '6s' }} />

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
