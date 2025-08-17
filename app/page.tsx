"use client";

import { motion } from "framer-motion";
import { Github, Mail, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import ParticleBackground from "@/components/ui/particle-background";
import Donations from "@/components/ui/donations";

const BG_URL = "/squalo_bg.svg";

export default function HomePage() {
  return (
    <main className="text-white font-body relative min-h-screen">
      {/* fixed background layer for consistent mobile behavior */}
      <div
        aria-hidden
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        /*style={{ /*backgroundImage: `url(${BG_URL})`, backgroundColor: '#2e59adff' }}*/
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 25%, #1e40af 50%, #2563eb 75%, #1d4ed8 100%)' }}
        /*style={{ background: 'linear-gradient(135deg, #212121 0%, #1a1a1a 25%, #303030 50%, #0a0a0a 75%, #2a2a2a 100%)' }}*/
        /*style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #121212 50%, #181818 75%, #0f0f0f 100%)' }}*/
        /*style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 25%, #5b21b6 50%, #6d28d9 75%, #4338ca 100%)' }}*/
      />
  <ParticleBackground />
  <div className="absolute inset-0 bg-shark-dark/80 z-10" />

      {/* single big card container */}
    <div className="relative z-20 py-12 flex items-start justify-center content-scroll">
  <Card className="relative w-[92%] sm:w-[82%] md:max-w-5xl lg:max-w-6xl mx-auto p-4 sm:p-8 min-h-[80vh] bg-shark-mid/40 backdrop-blur-md rounded-2xl mb-8">
          <CardHeader>
            <CardTitle>
              <h1 className="text-4xl md:text-5xl font-heading">Hey! I'm Squalo 🦈</h1>
            </CardTitle>
          </CardHeader>

          <CardContent className="pb-12">
            <section className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className="rounded-md bg-shark-light/5 px-3 py-4 sm:p-6">
                  {/*<h2 className="text-2xl font-semibold">About</h2>*/}
                  <div>
                    {/* full text on md+ */}
                    <div className="hidden md:block">
                      <p className="text-shark-sand mt-2">
                      I'm a <b>developer</b> who wears many hats, always eager to learn and build. While my main gig is <b>programming</b> — <span style={{ color: '#4066a3ff' }}>crafting code and developing applications</span> — I also have a keen eye for detail, which I exercise through image editing. And when I need to unwind, you can bet I'm listening to music of all kinds! Beyond just listening, I also love to play: I'm currently learning to play the guitar, and I have previous experience with 4 years of violin, plus some basic knowledge of piano and drums.
                      </p>
                    </div>

                    {/* collapsible preview on small screens */}
                    <div className="md:hidden">
                      <details className="group">
                      <summary className="list-none cursor-pointer">
                        <div
                          className="text-shark-sand mt-2 collapsed"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          I'm a developer who wears many hats, always eager to learn and build. While my main gig is programming — crafting code and developing applications — I also have a keen eye for detail, which I exercise through image editing. And when I need to unwind, you can bet I'm listening to music of all kinds! Beyond just listening, I also love to play: I'm currently learning to play the guitar, and I have previous experience with 4 years of violin, plus some basic knowledge of piano and drums.
                        </div>

                        <span className="text-sm text-sky-300 mt-1 inline-block collapsed">more . . .</span>
                      </summary>

                      <div className="mt-2 expanded">
                        <p className="text-shark-sand">
                          I'm a developer who wears many hats, always eager to learn and build. While my main gig is programming — crafting code and developing applications — I also have a keen eye for detail, which I exercise through image editing. And when I need to unwind, you can bet I'm listening to music of all kinds! Beyond just listening, I also love to play: I'm currently learning to play the guitar, and I have previous experience with 4 years of violin, plus some basic knowledge of piano and drums.
                        </p>

                        <button
                          type="button"
                          className="mt-2 text-sm text-sky-300"
                          onClick={(e) => {
                            const details = (e.currentTarget.closest("details") as HTMLDetailsElement | null);
                            if (details) details.open = false;
                          }}
                        >
                          less
                        </button>

                        <style>{`
                          /* make summary act like a block and remove default marker */
                          details summary { display: block; list-style: none; }
                          /* hide the truncated summary content when details is open */
                          details[open] .collapsed { display: none !important; }
                          /* show expanded only when details is open */
                          details:not([open]) .expanded { display: none !important; }
                        `}</style>
                      </div>
                      </details>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                <h3 className="text-xl font-semibold">Projects</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-36 rounded-lg bg-shark-light/6 flex items-center justify-center">
                      <span className="text-shark-sand/80">Project {i} (placeholder)</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h3 className="text-xl font-semibold">Skills</h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  {['Python','Java','JavaScript','NodeJS','Golang','Rust','PostgreSQL'].map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full bg-shark-light/8 text-sm">{s}</span>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h3 className="text-xl font-semibold">Learning</h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  {['React','Next.js','TypeScript','Tailwind','AI/ML'].map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full bg-shark-light/8 text-sm">{s}</span>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
                <h3 className="text-xl font-semibold">Contact Me</h3>
                {/* TODO: farlo diventare una chat */}
                <div className="mt-3">
                  <div className="h-10 w-full rounded bg-shark-light/6 flex items-center px-3">email@esempio.com (placeholder)</div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mt-4">
                <h3 className="text-xl font-semibold">Donations</h3>
                <Donations />
              </motion.div>
            </section>
            {/* icons: right-center on md+, bottom-center on mobile; icons only */}
            <div>
              {/* desktop vertical column (right-center) */}
              <div className="hidden md:flex md:flex-col md:absolute md:right-6 md:top-1/2 md:-translate-y-1/2 md:items-center md:gap-4 z-30">
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="Github" className="p-2 rounded-full bg-shark-light/10 flex items-center justify-center">
                  <Github className="w-7 h-7" />
                </a>

                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 rounded-full bg-shark-light/10 flex items-center justify-center">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                  </svg>
                </a>

                <a href="https://t.me/" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="p-2 rounded-full bg-shark-light/10 flex items-center justify-center">
                  <svg className="w-7 h-7" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M22.122 10.040c0.006-0 0.014-0 0.022-0 0.209 0 0.403 0.065 0.562 0.177l-0.003-0.002c0.116 0.101 0.194 0.243 0.213 0.403l0 0.003c0.020 0.122 0.031 0.262 0.031 0.405 0 0.065-0.002 0.129-0.007 0.193l0-0.009c-0.225 2.369-1.201 8.114-1.697 10.766-0.21 1.123-0.623 1.499-1.023 1.535-0.869 0.081-1.529-0.574-2.371-1.126-1.318-0.865-2.063-1.403-3.342-2.246-1.479-0.973-0.52-1.51 0.322-2.384 0.221-0.23 4.052-3.715 4.127-4.031 0.004-0.019 0.006-0.040 0.006-0.062 0-0.078-0.029-0.149-0.076-0.203l0 0c-0.052-0.034-0.117-0.053-0.185-0.053-0.045 0-0.088 0.009-0.128 0.024l0.002-0.001q0.198 0.045-6.316 4.174c-0.445 0.351-1.007 0.573-1.619 0.599l-0.006 0c-0.867-0.105-1.654-0.298-2.401-0.573l0.074 0.024c-0.938-0.306-1.683-0.467-1.619-0.985q0.051-0.404 1.114-0.827 6.548-2.853 8.733-3.761c1.607-0.853 3.47-1.555 5.429-2.010l0.157-0.031zM15.93 1.025c-8.302 0.020-15.025 6.755-15.025 15.060 0 8.317 6.742 15.060 15.060 15.060s15.060-6.742 15.060-15.060c0-8.305-6.723-15.040-15.023-15.060h-0.002q0.035-0-0.070 0z" />
                  </svg>
                </a>

                <a href="mailto:email@esempio.com" aria-label="Email" className="p-2 rounded-full bg-shark-light/10 flex items-center justify-center">
                  <Mail className="w-7 h-7" />
                </a>

                <a href="/" aria-label="Altro" className="mt-2 p-2 rounded-full bg-shark-light/10 flex items-center justify-center">
                  <MoreHorizontal className="w-7 h-7" />
                </a>
              </div>

              {/* mobile horizontal row (bottom-center) */}
              <div className="flex md:hidden w-full justify-center gap-6 mt-6">
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="Github" className="w-12 h-12 rounded-full bg-shark-light/10 flex items-center justify-center">
                  <Github className="w-7 h-7" />
                </a>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-12 h-12 rounded-full bg-shark-light/10 flex items-center justify-center">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                  </svg>
                </a>
                <a href="https://t.me/" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="w-12 h-12 rounded-full bg-shark-light/10 flex items-center justify-center">
                  <svg className="w-7 h-7" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M22.122 10.040c0.006-0 0.014-0 0.022-0 0.209 0 0.403 0.065 0.562 0.177l-0.003-0.002c0.116 0.101 0.194 0.243 0.213 0.403l0 0.003c0.020 0.122 0.031 0.262 0.031 0.405 0 0.065-0.002 0.129-0.007 0.193l0-0.009c-0.225 2.369-1.201 8.114-1.697 10.766-0.21 1.123-0.623 1.499-1.023 1.535-0.869 0.081-1.529-0.574-2.371-1.126-1.318-0.865-2.063-1.403-3.342-2.246-1.479-0.973-0.52-1.51 0.322-2.384 0.221-0.23 4.052-3.715 4.127-4.031 0.004-0.019 0.006-0.040 0.006-0.062 0-0.078-0.029-0.149-0.076-0.203l0 0c-0.052-0.034-0.117-0.053-0.185-0.053-0.045 0-0.088 0.009-0.128 0.024l0.002-0.001q0.198 0.045-6.316 4.174c-0.445 0.351-1.007 0.573-1.619 0.599l-0.006 0c-0.867-0.105-1.654-0.298-2.401-0.573l0.074 0.024c-0.938-0.306-1.683-0.467-1.619-0.985q0.051-0.404 1.114-0.827 6.548-2.853 8.733-3.761c1.607-0.853 3.47-1.555 5.429-2.010l0.157-0.031zM15.93 1.025c-8.302 0.020-15.025 6.755-15.025 15.060 0 8.317 6.742 15.060 15.060 15.060s15.060-6.742 15.060-15.060c0-8.305-6.723-15.040-15.023-15.060h-0.002q0.035-0-0.070 0z" />
                  </svg>
                </a>
                <a href="mailto:email@esempio.com" aria-label="Email" className="w-12 h-12 rounded-full bg-shark-light/10 flex items-center justify-center">
                  <Mail className="w-7 h-7" />
                </a>
              </div>
            </div>

            {/* subtle divider and spacer to mark card end without a bright border */}
            <div className="mt-6 border-t border-shark-dark/40" />
            <div className="h-6" />
            <div className="text-right">
              <p className="text-xs text-shark-sand/60">Made with ❤️ by squalo.dev</p> {/*♡*/}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
