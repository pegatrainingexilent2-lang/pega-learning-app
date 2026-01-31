import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { TopicBrowser } from "@/components/ui/topic-browser";

// Force dynamic rendering to ensure fresh content from DB is always shown
export const dynamic = 'force-dynamic';

export default async function Home() {
  const session = await auth();

  // Fetch topics from DB to sync with the sidebar and learning path
  const dbTopics = await prisma.topicSection.findMany({
    include: {
      subTopics: {
        orderBy: { order: 'asc' }
      }
    },
    orderBy: { order: 'asc' }
  });

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative h-[400px] -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden rounded-3xl">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: "url('/images/hero-bg.png')" }}
        />
        {/* Enhanced gradient overlay with multiple layers */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-purple-900/70 to-pink-900/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />

        {/* Animated accent blobs */}
        <div className="absolute top-10 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl pulse-glow" />
        <div className="absolute bottom-10 left-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pulse-glow" style={{ animationDelay: '1.5s' }} />

        <div className="relative h-full max-w-5xl mx-auto px-6 flex flex-col justify-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-strong text-xs font-bold uppercase tracking-widest mb-4 w-fit shadow-lg hover:scale-105 transition-transform duration-300">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50"></span>
            Pega 25.1 Infinity
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-2xl text-white animate-fade-in">
            {session?.user ? `Welcome back, ${session.user.name}` : "Master Pega 25.1"}
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mb-8 drop-shadow-lg leading-relaxed">
            {session?.user
              ? "Continue your journey to becoming a Pega architect with our comprehensive guide."
              : "A comprehensive guide to becoming a Pega architect, covering everything from fundamentals to Constellation and advanced integration."}
          </p>
          <div className="flex gap-4">
            {dbTopics.length > 0 && dbTopics[0].subTopics.length > 0 && (
              <Link
                href={`/learn/${dbTopics[0].id}/${dbTopics[0].subTopics[0].id}`}
                className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-2xl hover:shadow-indigo-500/30 active:scale-95 hover:scale-105 duration-300"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Topics Browser */}
      <TopicBrowser topics={dbTopics as any} />
    </div>
  );
}
