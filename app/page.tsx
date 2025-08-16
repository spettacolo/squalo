"use client";

import { motion } from "framer-motion";
import { Github, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const BG_URL = "/squalo_bg.svg";

export default function HomePage() {
  return (
    <main
      className="text-white font-body relative min-h-screen"
      style={{
        backgroundImage: `url(${BG_URL})`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
      }}
    >
  <div className="absolute inset-0 bg-shark-dark/80 z-0" />

      {/* single big card container */}
      <div className="relative z-10 py-12 flex items-start justify-center content-scroll">
  <Card className="w-[92%] sm:w-[82%] md:max-w-5xl lg:max-w-6xl mx-auto p-6 sm:p-8 min-h-[80vh] bg-shark-mid/40 backdrop-blur-md rounded-2xl overflow-auto">
          <CardHeader>
            <CardTitle>
              <h1 className="text-4xl md:text-5xl font-heading">Nome Cognome — Portfolio</h1>
            </CardTitle>
          </CardHeader>

          <CardContent className="pb-12">
            <section className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className="rounded-md bg-shark-light/5 p-6">
                  <h2 className="text-2xl font-semibold">Hero / Intro</h2>
                  <p className="text-shark-sand mt-2">Breve descrizione professionale, ruolo e obiettivi. (placeholder)</p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                <h3 className="text-xl font-semibold">Progetti principali</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-36 rounded-lg bg-shark-light/6 flex items-center justify-center">
                      <span className="text-shark-sand/80">Project {i} (placeholder)</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h3 className="text-xl font-semibold">Competenze</h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  {['React','Next.js','TypeScript','Tailwind','Framer Motion','Testing'].map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full bg-shark-light/8 text-sm">{s}</span>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
                <h3 className="text-xl font-semibold">Contatti</h3>
                <div className="mt-3">
                  <div className="h-10 w-full rounded bg-shark-light/6 flex items-center px-3">email@esempio.com (placeholder)</div>
                </div>
              </motion.div>
            </section>
            {/* responsive footer with social/contact buttons */}
            <div className="mt-8 w-full flex flex-wrap items-center gap-3">
              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-shark-light/10 px-3 py-2 text-sm">
                  <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    <span>Github</span>
                  </a>
                </Button>

                <Button asChild className="bg-shark-light/10 px-3 py-2 text-sm">
                  <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    {/* Official Instagram outline-style SVG, uses currentColor */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                    </svg>
                    <span>Instagram</span>
                  </a>
                </Button>

                <Button asChild className="bg-shark-light/10 px-3 py-2 text-sm">
                  <a href="https://t.me/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    {/* Official Telegram paper-plane outline SVG, uses currentColor */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M22 2L11 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Telegram</span>
                  </a>
                </Button>

                <Button asChild className="bg-shark-light/10 px-3 py-2 text-sm">
                  <a href="mailto:email@esempio.com" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </a>
                </Button>
              </div>

              <Link href="/" className="ml-auto w-full md:w-auto text-right text-sm text-shark-sand/80">Altro</Link>
            </div>

            {/* subtle divider and spacer to mark card end without a bright border */}
            <div className="mt-6 border-t border-shark-dark/40" />
            <div className="h-6" />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
