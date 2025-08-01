"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // Use any icon set or swap this

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-black font-bold text-hlavendar shadow-md px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="text-xl font-bold text-lavender tracking-wide">
          &lt;SkillSyncer /&gt;
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-lavender focus:outline-none"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 text-base">
          <Link href="/" className="hover:text-lavender transition hover:drop-shadow-[0_0_10px_#E6E6FA]">
            Home
          </Link>
           <Link href="/skill-generator" className="hover:text-lavender transition hover:drop-shadow-[0_0_10px_#E6E6FA]">
            Skill Generator
          </Link>
          <Link href="/ats-checker" className="hover:text-lavender transition hover:drop-shadow-[0_0_10px_#E6E6FA]">
            ATS Score Checker
          </Link>
          <Link href="/career-identity" className="hover:text-lavender transition hover:drop-shadow-[0_0_10px_#E6E6FA]">
            Career Identity
          </Link>
           <Link href="/career-paths" className="hover:text-lavender transition hover:drop-shadow-[0_0_10px_#E6E6FA]">
            Career Path Explorer
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 mt-4 text-base text-lavender">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href="/skill-generator" onClick={() => setMenuOpen(false)}>
             Skill Generator
          </Link>
          <Link href="/ats-checker" onClick={() => setMenuOpen(false)}>
            ATS Score Checker
          </Link>
          <Link href="/career-paths" onClick={() => setMenuOpen(false)}>
            Career Path Explorer
          </Link>
          <Link href="/career-identity" onClick={() => setMenuOpen(false)}>
            Career Identity
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      )}
    </nav>
  );
}
