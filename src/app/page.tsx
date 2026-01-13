import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

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

      {/* Topics Grid */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Learning Path</h2>
            <p className="text-gray-500">Structured curriculum from beginner to advanced</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dbTopics.map((topic, index) => (
            <div
              key={topic.id}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 overflow-hidden hover:-translate-y-2 premium-card fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="p-6 relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mb-5 text-indigo-600 group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white transition-all duration-500 shadow-md group-hover:shadow-lg group-hover:scale-110">
                  <Star className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:gradient-text transition-all duration-300">
                  {topic.title}
                </h3>
                <p className="text-sm text-gray-500 mb-5 font-medium">
                  {topic.subTopics.length} Comprehensive Lessons
                </p>

                <ul className="space-y-3 mb-6">
                  {topic.subTopics.slice(0, 3).map((sub) => (
                    <li key={sub.id} className="text-sm text-gray-600 flex items-center gap-3 group/item">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover/item:scale-[2] group-hover/item:bg-indigo-600 transition-all duration-300"></div>
                      <span className="group-hover/item:text-indigo-600 transition-colors duration-300">{sub.title}</span>
                    </li>
                  ))}
                  {topic.subTopics.length > 3 && (
                    <li className="text-sm text-gray-400 pl-5 italic">
                      +{topic.subTopics.length - 3} more topics...
                    </li>
                  )}
                </ul>
              </div>

              {topic.subTopics.length > 0 && (
                <Link
                  href={`/learn/${topic.id}/${topic.subTopics[0].id}`}
                  className="absolute inset-0 z-10"
                >
                  <span className="sr-only">View {topic.title}</span>
                </Link>
              )}

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-t border-indigo-100/50 flex items-center justify-between text-sm font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                <span>Start Module</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
