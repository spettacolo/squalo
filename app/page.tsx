"use client";

import { motion } from "framer-motion";
import { Github, Mail, MoreHorizontal } from "lucide-react";
import { useState } from "react";
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
import SpotifyNowPlaying from "@/components/ui/spotify";

const BG_URL = "/squalo_bg.svg";

function Shoutbox() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  function send() {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((m) => [trimmed, ...m].slice(0, 20)); // keep last 20
    setText("");
  }

  return (
    <div className="mt-3">
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div
          className="flex-1 rounded-lg bg-shark-mid/30 backdrop-blur-sm ring-1 ring-shark-light/10 p-2"
          style={{ boxShadow: 'inset 0 6px 20px rgba(0,0,0,0.65), inset 0 -3px 8px rgba(255,255,255,0.02)' }}
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full resize-none bg-transparent outline-none text-shark-sand placeholder-shark-sand/60 px-2 py-1"
            placeholder="Send a message..."
          />
        </div>

        <div className="flex-shrink-0">
          <button
            type="button"
            onClick={send}
            aria-label="Invia"
            className="shout-send flex items-center justify-center w-12 h-12 rounded-lg text-white"
          >
            <img src="/send.svg" alt="Invia" className="w-6 h-6" draggable={false} onDragStart={(e: React.DragEvent<HTMLImageElement>) => e.preventDefault()} />
          </button>
        </div>
      </div>

      <div className="mt-3 max-h-48 overflow-auto space-y-2">
        {messages.length === 0 ? (
          <div className="text-sm text-shark-sand/60">Nessun messaggio ancora.</div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className="text-sm rounded-md bg-shark-light/5 px-3 py-2 text-shark-sand">
              {m}
            </div>
          ))
        )}
      </div>
      <style>{`
        .shout-send {
          background: rgba(56,189,248,0.08); /* soft sky tint */
          border: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          /* subtle outer shadow + small inner highlight to look 'attached' */
          box-shadow: 0 2px 6px rgba(2,6,23,0.45), inset 0 1px 0 rgba(255,255,255,0.03);
          transform: translateY(0);
          transition: box-shadow .12s ease, background .12s ease, transform .08s ease;
          z-index: 20;
        }

        /* on press invert the bevel to give pressed effect */
        .shout-send:active {
          box-shadow: inset 0 2px 8px rgba(2,6,23,0.65), inset 0 -1px 4px rgba(255,255,255,0.02);
          background: rgba(56,189,248,0.10);
        }

        .shout-send img { filter: drop-shadow(0 1px 1px rgba(0,0,0,0.35)); }
      `}</style>
    </div>
  );
}

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
  <Card className="relative w-[92%] sm:w-[82%] md:max-w-5xl lg:max-w-6xl mx-auto p-4 sm:p-6 md:pr-6 min-h-[80vh] bg-shark-mid/40 backdrop-blur-md rounded-2xl mb-8">
          <CardHeader className="relative flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle>
                <h1 className="text-4xl md:text-5xl font-heading">Hey! I'm Squalo 🦈</h1>
              </CardTitle>
            </div>

            {/* desktop icons: positioned at the top-right beside the title */}
            <div className="hidden md:flex md:flex-col md:items-center md:gap-4 md:absolute md:right-3 md:top-4 z-30">
              <a href="https://github.com/squalodev" target="_blank" rel="noopener noreferrer" aria-label="Github" className="p-2 rounded-full bg-shark-light/10 flex items-center justify-center">
                <Github className="w-7 h-7" />
              </a>

              <a href="https://www.instagram.com/squalo.dev" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 rounded-full bg-shark-light/10 flex items-center justify-center">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
              </a>

              <a href="https://t.me/squalo" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="p-2 rounded-full bg-shark-light/10 flex items-center justify-center">
                <svg className="w-7 h-7 text-white" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden>
                  <path
                    d="M23.073 88.132s65.458-26.782 88.16-36.212c8.702-3.772 38.215-15.843 38.215-15.843s13.621-5.28 12.486 7.544c-.379 5.281-3.406 23.764-6.433 43.756-4.54 28.291-9.459 59.221-9.459 59.221s-.756 8.676-7.188 10.185c-6.433 1.509-17.027-5.281-18.919-6.79-1.513-1.132-28.377-18.106-38.214-26.404-2.649-2.263-5.676-6.79.378-12.071 13.621-12.447 29.891-27.913 39.728-37.72 4.54-4.527 9.081-15.089-9.837-2.264-26.864 18.483-53.35 35.835-53.35 35.835s-6.053 3.772-17.404.377c-11.351-3.395-24.594-7.921-24.594-7.921s-9.08-5.659 6.433-11.693Z"
                    stroke="currentColor"
                    strokeWidth={12}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </a>

              <a href="mailto:email@esempio.com" aria-label="Email" className="p-2 rounded-full bg-shark-light/10 flex items-center justify-center">
                <Mail className="w-7 h-7" />
              </a>
            </div>
          </CardHeader>

          <CardContent className="pt-0 pb-12">
            <section className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className="rounded-md bg-shark-light/5 px-3 py-2 sm:p-6 md:pr-20">
                  {/*<h2 className="text-2xl font-semibold">About</h2>*/}
                  <div>
                    {/* full text on md+ */}
                    <div className="hidden md:block">
                      <p className="text-shark-sand mt-2">
                      I'm a <span className="keys"><b>developer</b></span> who wears many hats, always eager to learn and build. <br />While my main gig is <span className="keys"><b>programming</b></span> — <span className="notes"><i>crafting code and developing applications</i></span> — I also have a keen eye for detail, which I exercise through <span className="keys"><b>image editing</b></span>. <br />And when I need to unwind, you can bet I'm listening to music   of all kinds! Beyond just listening, I also love to play: I'm currently learning to play the <span className="keys"><b>guitar</b></span>, and I have previous experience with 4 years of <span className="keys"><b>violin</b></span>, plus some basic knowledge of <span className="notes"><i>piano</i></span> and <span className="notes"><i>drums</i></span>.
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
                          I'm a <span className="keys"><b>developer</b></span> who wears many hats, always eager to learn and build. <br /><br />While my main gig is <span className="keys"><b>programming</b></span> — <span className="notes"><i>crafting code and developing applications</i></span> — I also have a keen eye for detail, which I exercise through <span className="keys"><b>image editing</b></span>. <br /><br />And when I need to unwind, you can bet I'm listening to music   of all kinds! Beyond just listening, I also love to play: I'm currently learning to play the <span className="keys"><b>guitar</b></span>, and I have previous experience with 4 years of <span className="keys"><b>violin</b></span>, plus some basic knowledge of <span className="notes"><i>piano</i></span> and <span className="notes"><i>drums</i></span>.
                        </div>

                        <span className="text-sm text-sky-300 mt-1 inline-block collapsed">more . . .</span>
                      </summary>

                      <div className="mt-2 expanded">
                        <p className="text-shark-sand">
                          I'm a <span className="keys"><b>developer</b></span> who wears many hats, always eager to learn and build. <br /><br />While my main gig is <span className="keys"><b>programming</b></span> — <span className="notes"><i>crafting code and developing applications</i></span> — I also have a keen eye for detail, which I exercise through <span className="keys"><b>image editing</b></span>. <br /><br />And when I need to unwind, you can bet I'm listening to music   of all kinds! Beyond just listening, I also love to play: I'm currently learning to play the <span className="keys"><b>guitar</b></span>, and I have previous experience with 4 years of <span className="keys"><b>violin</b></span>, plus some basic knowledge of <span className="notes"><i>piano</i></span> and <span className="notes"><i>drums</i></span>.
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
                <h3 className="text-xl font-semibold" style={{ marginBottom: '10px' }}>Currently Playing</h3>
                <SpotifyNowPlaying />
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
                <h3 className="text-xl font-semibold">Contact Me</h3>
                {/* shoutbox: local state only, glass inset style */}
                <Shoutbox />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mt-4">
                <h3 className="text-xl font-semibold">Donations</h3>
                <Donations />
              </motion.div>
            </section>
            {/* icons: mobile row remains; desktop column moved into CardHeader */}
            <div>
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
