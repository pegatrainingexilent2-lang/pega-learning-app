import { auth } from "@/auth";
import { topics } from "@/data/topics";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

export default async function Home() {
  const session = await auth();

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative h-[400px] -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: "url('/images/hero-bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-purple-900/40 backdrop-blur-[2px]" />

        <div className="relative h-full max-w-5xl mx-auto px-6 flex flex-col justify-center text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest mb-4 w-fit">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Pega 25.1 Infinity
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-lg">
            {session?.user ? `Welcome back, ${session.user.name}` : "Master Pega 25.1"}
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mb-8 drop-shadow-md">
            {session?.user
              ? "Continue your journey to becoming a Pega architect with our comprehensive guide."
              : "A comprehensive guide to becoming a Pega architect, covering everything from fundamentals to Constellation and advanced integration."}
          </p>
          <div className="flex gap-4">
            <Link
              href={`/learn/${topics[0].id}/${topics[0].subTopics[0].id}`}
              className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-xl hover:shadow-indigo-500/20 active:scale-95"
            >
              Get Started
            </Link>
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
          {topics.map((topic) => (
            <div key={topic.id} className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden hover:-translate-y-1">
              <div className="p-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-5 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  <Star className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {topic.title}
                </h3>
                <p className="text-sm text-gray-500 mb-5">
                  {topic.subTopics.length} Comprehensive Lessons
                </p>

                <ul className="space-y-3 mb-6">
                  {topic.subTopics.slice(0, 3).map((sub) => (
                    <li key={sub.id} className="text-sm text-gray-600 flex items-center gap-3">
                      <div className="w-1 h-1 rounded-full bg-indigo-300 group-hover:scale-150 group-hover:bg-indigo-500 transition-all"></div>
                      {sub.title}
                    </li>
                  ))}
                  {topic.subTopics.length > 3 && (
                    <li className="text-sm text-gray-400 pl-4 italic">
                      +{topic.subTopics.length - 3} more topics...
                    </li>
                  )}
                </ul>
              </div>

              <Link
                href={`/learn/${topic.id}/${topic.subTopics[0].id}`}
                className="absolute inset-0 z-10"
              >
                <span className="sr-only">View {topic.title}</span>
              </Link>

              <div className="bg-indigo-50 px-6 py-4 border-t border-indigo-100 flex items-center justify-between text-sm font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <span>Start Module</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
