"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-lavender mb-4">
          &lt;SkillSyncer /&gt;
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Launch your dream career with the perfect blend of skill, clarity, and confidence.
        </p>
      </section>

      {/* Feature Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        
        {/* Skill Generator */}
        <div className="flex items-center justify-between bg-black rounded-2xl p-6 border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:shadow-none transition duration-300">
          <div className="flex-1 pr-6">
            <h2 className="text-xl font-bold text-lavender mb-2">
              Skill Generator
            </h2>
            <p className="text-gray-400 text-sm">
              Not sure what skills to list? Discover powerful, job-relevant skills that align
              perfectly with your profile.
            </p>
          </div>
          <Link
            href="/skill-generator"
            className="bg-lavender text-black font-semibold py-2 px-4 rounded-lg hover:scale-105 transition"
          >
            Explore
          </Link>
        </div>
        
        {/* ATS Score Checker */}
       <div className="flex items-center justify-between bg-black rounded-2xl p-6 border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:shadow-none transition duration-300">
          <div className="flex-1 pr-6">
            <h2 className="text-xl font-bold text-lavender mb-2">
              Check Your ATS Score
            </h2>
            <p className="text-gray-400 text-sm">
              Find out how your resume performs against automated screening tools.
              Know where you stand and how to improve.
            </p>
          </div>
          <Link
            href="/ats-checker"
            className="bg-lavender text-black font-semibold py-2 px-4 rounded-lg hover:scale-105 transition"
          >
            Check
          </Link>
        </div>

        {/* career path explorer */}
        <div className="flex items-center justify-between bg-black rounded-2xl p-6 border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:shadow-none transition duration-300">
          <div className="flex-1 pr-6">
            <h2 className="text-xl font-bold text-lavender mb-2">
              Explore Your Ideal Career Path
            </h2>
            <p className="text-gray-400 text-sm">
              Discover roles that match your skills and interests. Get personalized career insights to shape your future with confidence.
            </p>
          </div>
          <Link
            href="/career-paths"
            className="bg-lavender text-black font-semibold py-2 px-4 rounded-lg hover:scale-105 transition"
          >
            Start
          </Link>
        </div>


        {/* Career Identity */}
       <div className="flex items-center justify-between bg-black rounded-2xl p-6 border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:shadow-none transition duration-300">
          <div className="flex-1 pr-6">
            <h2 className="text-xl font-bold text-lavender mb-2">
              Discover Your Career Identity
            </h2>
            <p className="text-gray-400 text-sm">
              Not sure what suits you? Use our intelligent matcher to discover roles aligned with
              your passions and strengths.
            </p>
          </div>
          <Link
            href="/career-identity"
            className="bg-lavender text-black font-semibold py-2 px-4 rounded-lg hover:scale-105 transition"
          >
            Discover
          </Link>
        </div>
      </div>
    </div>
  );
}
