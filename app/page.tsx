"use client";

import React from "react";
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
import ProjectCard from "@/components/ui/project-card";
import SpotifyNowPlaying from "@/components/ui/spotify";

const BG_URL = "/squalo_bg.svg";

function Shoutbox() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchMessages() {
    setLoading(true);
    try {
      const res = await fetch('/api/shoutbox');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setMessages(data);
    } catch (e: any) {
      setError(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchMessages();
  }, []);

  async function send() {
    const trimmed = text.trim();
    if (!trimmed) return;
    try {
      const res = await fetch('/api/shoutbox', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: trimmed }) });
      if (!res.ok) throw new Error('Failed to send');
      const msg = await res.json();
      setMessages((m) => [msg, ...m].slice(0, 200));
      setText('');
    } catch (e: any) {
      setError(e.message || 'Send failed');
    }
  }

  async function remove(id: string) {
    try {
      const res = await fetch('/api/shoutbox?id=' + encodeURIComponent(id), { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      const json = await res.json();
      if (json.success) setMessages((m) => m.filter((x) => x.id !== id));
    } catch (e: any) {
      setError(e.message || 'Delete failed');
    }
  }

  function formatLog(m: any) {
    try {
      // Accept either created_at (Postgres) or createdAt (JS) naming
      const raw = m.created_at ?? m.createdAt ?? m.createdAtUtc ?? m.created_at_utc ?? null;
      if (!raw) return m.text;
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) {
        // If the date is invalid, attempt to parse ISO-like strings more leniently
        const parsed = Date.parse(String(raw));
        if (Number.isNaN(parsed)) return m.text;
        const d2 = new Date(parsed);
        return `[${d2.toLocaleDateString()} - ${d2.toLocaleTimeString()}] ${m.text}`;
      }
      return `[${d.toLocaleDateString()} - ${d.toLocaleTimeString()}] ${m.text}`;
    } catch (e) {
      return m.text;
    }
  }

  return (
    <div className="mt-3">
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="flex-1 w-full rounded-lg bg-transparent ring-1 ring-shark-light/10 p-2" style={{ boxShadow: 'inset 0 6px 20px rgba(0,0,0,0.65), inset 0 -3px 8px rgba(255,255,255,0.02)' }}>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} className="w-full resize-none bg-transparent outline-none text-shark-sand placeholder-shark-sand/60 px-2 py-1" placeholder="Send a message..." />
        </div>

        <div className="flex-shrink-0 self-center sm:self-auto">
          <button type="button" onClick={send} aria-label="Invia" className="shout-send flex items-center justify-center w-12 h-12 rounded-lg text-white">
            <img src="/send.svg" alt="Invia" className="w-6 h-6" draggable={false} onDragStart={(e: React.DragEvent<HTMLImageElement>) => e.preventDefault()} />
          </button>
        </div>
      </div>

      <div className="mt-3 max-h-48 overflow-auto space-y-2">
        {loading ? (
          <div className="text-sm text-shark-sand/60">Loading...</div>
        ) : error ? (
          <div className="text-sm text-red-400">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-sm text-shark-sand/60">No messages yet.</div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="text-sm rounded-md bg-shark-light/5 px-3 py-3 text-shark-sand">
              <div className="whitespace-pre-wrap">
                {m.text}
                <span className="notes ml-2 text-[11px] text-[#c1c2c4] whitespace-nowrap select-none">{
                  (() => {
                    try {
                      const raw = m.created_at ?? m.createdAt ?? m.createdAtUtc ?? m.created_at_utc ?? null;
                      if (!raw) return '';
                      const d = new Date(raw);
                      if (Number.isNaN(d.getTime())) {
                        const parsed = Date.parse(String(raw));
                        if (Number.isNaN(parsed)) return '';
                        const d2 = new Date(parsed);
                        return ` ${d2.toLocaleDateString()} - ${d2.toLocaleTimeString()}`;
                      }
                      return ` ${d.toLocaleDateString()} - ${d.toLocaleTimeString()}`;
                    } catch (e) {
                      return '';
                    }
                  })()
                }</span>
              </div>
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
        style={{ background: 'linear-gradient(135deg, #0a192f 0%, #1e3a8a 25%, #1e40af 50%, #2563eb 75%, #1e293b 100%)' }}
        /*style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 25%, #1e40af 50%, #2563eb 75%, #1d4ed8 100%)' }} OLD PALETTE*/
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

              {/*<a href="https://www.instagram.com/squalo.dev" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 rounded-full bg-shark-light/10 flex items-center justify-center">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
              </a> */}

              <a href="https://t.me/handclaim" target="_blank" rel="noopener noreferrer" aria-label="Telegram Channel" className="w-12 h-12 rounded-full bg-shark-light/10 flex items-center justify-center">
                <svg className="w-7 h-7" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path fill="currentColor" d="M255.994,0.006C114.607,0.013,0.012,114.612,0,256c0.012,141.387,114.607,255.986,255.994,255.994 C397.393,511.986,511.992,397.387,512,256C511.992,114.612,397.393,0.013,255.994,0.006z M97.607,97.612 c23.34-23.328,51.761-41.475,83.455-52.725c-15.183,18.375-27.84,41.906-37.757,69.116H82.772 C87.452,108.308,92.396,102.824,97.607,97.612z M65.612,138.003h69.986c-9.008,31.929-14.41,67.834-15.363,105.997H32.327 C34.374,205.196,46.3,169.088,65.612,138.003z M65.612,373.997C46.3,342.912,34.374,306.804,32.327,268h87.991 c0.961,38.124,6.21,74.092,15.206,105.998H65.612z M97.607,414.386c-5.211-5.211-10.156-10.695-14.836-16.39h60.573 c4.28,11.774,9.019,22.944,14.312,33.21c6.954,13.438,14.758,25.468,23.348,35.89C149.332,455.846,120.931,437.699,97.607,414.386z M243.998,479.667c-3.746-0.196-7.469-0.477-11.164-0.86c-5.89-2.64-11.722-6.25-17.5-10.961 c-17.632-14.359-33.976-38.671-46.398-69.85h75.061V479.667z M243.998,373.997h-83.436c-9.477-31.171-15.316-67.311-16.328-105.998 h99.763V373.997z M243.998,244H144.31c1.008-38.71,6.875-74.819,16.359-105.997h83.33V244z M243.998,114.003h-74.951 c3.109-7.79,6.367-15.312,9.934-22.195c10.64-20.625,23.17-36.89,36.354-47.656c5.777-4.71,11.609-8.32,17.5-10.96 c3.695-0.382,7.417-0.664,11.164-0.859V114.003z M446.392,138.003c19.312,31.085,31.234,67.194,33.281,105.997h-87.991 c-0.961-38.124-6.21-74.092-15.21-105.997H446.392z M414.393,97.612c5.211,5.211,10.156,10.696,14.836,16.391h-60.577 c-4.281-11.773-9.023-22.945-14.312-33.21c-6.953-13.437-14.758-25.468-23.347-35.89C362.668,56.16,391.065,74.301,414.393,97.612z M267.998,32.333c3.746,0.195,7.469,0.484,11.16,0.859c5.89,2.649,11.723,6.25,17.504,10.96 c17.636,14.359,33.976,38.671,46.397,69.85h-75.061V32.333z M267.998,138.003h83.436c9.476,31.171,15.32,67.31,16.328,105.997 h-99.764V138.003z M267.998,268h99.685c-1.007,38.71-6.874,74.818-16.359,105.998h-83.326V268z M296.661,467.846 c-5.781,4.711-11.614,8.313-17.504,10.961c-3.691,0.375-7.414,0.664-11.16,0.86v-81.67h74.951 c-3.109,7.789-6.367,15.312-9.933,22.195C322.376,440.816,309.845,457.081,296.661,467.846z M414.393,414.386 c-23.336,23.328-51.764,41.476-83.459,52.725c15.187-18.375,27.835-41.905,37.757-69.115h60.538 C424.548,403.692,419.604,409.176,414.393,414.386z M446.392,373.997h-69.998c9.008-31.929,14.414-67.842,15.367-105.998h87.912 C477.626,306.804,465.704,342.912,446.392,373.997z"></path>
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

              <a href="mailto:contact@squalo.dev" aria-label="Email" className="p-2 rounded-full bg-shark-light/10 flex items-center justify-center">
                <Mail className="w-7 h-7" />
              </a>
            </div>
          </CardHeader>

          <CardContent className="pt-0 pb-12">
            <section className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className="rounded-md bg-shark-light/5 px-3 py-2 sm:p-6 md:pr-20">
                  {/*<h2 className="text-2xl font-semibold">About</h2>*/}
                  <div className="hidden md:block">
                    <p className="text-shark-sand mt-2">
                      I'm a <span className="keys"><b>developer</b></span> who wears many hats, always eager to learn and build. <br />While my main gig is <span className="keys"><b>programming</b></span> — <span className="notes"><i>crafting code and developing applications</i></span> — I'm most drawn to <span className="keys"><b>backend development</b></span>, even though I'm always strengthening my skills to become a <span className="keys"><b>full-stack developer</b></span>. <br />I also have a keen eye for detail, which I exercise through <span className="keys"><b>image editing</b></span>. <br />And when I need to unwind, you can bet I'm listening to music of all kinds! Beyond just listening, I also love to play: I'm currently learning to play the <span className="keys"><b>guitar</b></span>, and I have previous experience with other instruments as well.
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
                          I'm a <span className="keys"><b>developer</b></span> who wears many hats, always eager to learn and build. <br /><br />While my main gig is <span className="keys"><b>programming</b></span> — <span className="notes"><i>crafting code and developing applications</i></span> — I'm most drawn to <span className="keys"><b>backend development</b></span>, even though I'm always strengthening my skills to become a <span className="keys"><b>full-stack developer</b></span>. <br />I also have a keen eye for detail, which I exercise through <span className="keys"><b>image editing</b></span>. <br /><br />And when I need to unwind, you can bet I'm listening to music of all kinds! Beyond just listening, I also love to play: I'm currently learning to play the <span className="keys"><b>guitar</b></span>, and I have previous experience with other instruments as well.
                        </div>

                        <span className="text-sm text-sky-300 mt-1 inline-block collapsed">more . . .</span>
                      </summary>

                      <div className="mt-2 expanded">
                        <p className="text-shark-sand">
                          I'm a <span className="keys"><b>developer</b></span> who wears many hats, always eager to learn and build. <br /><br />While my main gig is <span className="keys"><b>programming</b></span> — <span className="notes"><i>crafting code and developing applications</i></span> — I'm most drawn to <span className="keys"><b>backend development</b></span>, even though I'm always strengthening my skills to become a <span className="keys"><b>full-stack developer</b></span>. <br />I also have a keen eye for detail, which I exercise through <span className="keys"><b>image editing</b></span>. <br /><br />And when I need to unwind, you can bet I'm listening to music of all kinds! Beyond just listening, I also love to play: I'm currently learning to play the <span className="keys"><b>guitar</b></span>, and I have previous experience with other instruments as well.
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
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                <h3 className="text-xl font-semibold">Projects</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 items-stretch auto-rows-fr">
                  {[
                    { title: "UsernameItalia", description: "It's not a real project, but I think it could be one since it's a solid business idea. I'm not the only one working on it — I started it together with my friend Jack (@cancro). You can check out @UsernameItalia on Telegram to see some of the handles, although I haven't posted all of my claims there.", imgSrc: "/usernameitalia.png", href: "https://t.me/usernameitalia" },
                    { title: "Legendary QR", description: "This is a bot that generates fully custom QR codes, designed to be simple, fast, and versatile. It’s not released yet, but very soon you’ll be able to try it directly on Telegram, where you can create personalized codes for links, text, or contacts in just a few taps.", imgSrc: "/legendaryqr.png", href: "https://t.me/legendaryqr" },
                  ].map((p, idx) => (
                    <ProjectCard key={idx} title={p.title} description={p.description} imgSrc={p.imgSrc} href={p.href} />
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h3 className="text-xl font-semibold">Skills</h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  {['Python','Java','JavaScript','NodeJS','Golang','Rust','C/C++','PostgreSQL', 'Big Data'].map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full bg-shark-light/8 text-sm">{s}</span>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h3 className="text-xl font-semibold">Learning</h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  {['React','Next.js','TypeScript','Tailwind', 'AI/ML', 'Solidity', 'Web3', 'Blockchain', 'NoSQL'].map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full bg-shark-light/8 text-sm">{s}</span>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
                <h3 className="text-xl font-semibold" style={{ marginBottom: '10px' }}>Currently Playing</h3>
                <SpotifyNowPlaying />
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
                <h3 className="text-xl font-semibold">Shoutbox</h3>
                {/* shoutbox: local state only, glass inset style */}
                {/* TODO: implement shoutbox */}
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
                <a href="https://github.com/squalodev" target="_blank" rel="noopener noreferrer" aria-label="Github" className="w-12 h-12 rounded-full bg-shark-light/10 flex items-center justify-center">
                  <Github className="w-7 h-7" />
                </a>
                {/*<a href="https://www.instagram.com/squalo.dev" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-12 h-12 rounded-full bg-shark-light/10 flex items-center justify-center">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                  </svg>
                </a>*/}
                <a href="https://t.me/handclaim" target="_blank" rel="noopener noreferrer" aria-label="Telegram Channel" className="w-12 h-12 rounded-full bg-shark-light/10 flex items-center justify-center">
                  <svg className="w-7 h-7" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path fill="currentColor" d="M255.994,0.006C114.607,0.013,0.012,114.612,0,256c0.012,141.387,114.607,255.986,255.994,255.994 C397.393,511.986,511.992,397.387,512,256C511.992,114.612,397.393,0.013,255.994,0.006z M97.607,97.612 c23.34-23.328,51.761-41.475,83.455-52.725c-15.183,18.375-27.84,41.906-37.757,69.116H82.772 C87.452,108.308,92.396,102.824,97.607,97.612z M65.612,138.003h69.986c-9.008,31.929-14.41,67.834-15.363,105.997H32.327 C34.374,205.196,46.3,169.088,65.612,138.003z M65.612,373.997C46.3,342.912,34.374,306.804,32.327,268h87.991 c0.961,38.124,6.21,74.092,15.206,105.998H65.612z M97.607,414.386c-5.211-5.211-10.156-10.695-14.836-16.39h60.573 c4.28,11.774,9.019,22.944,14.312,33.21c6.954,13.438,14.758,25.468,23.348,35.89C149.332,455.846,120.931,437.699,97.607,414.386z M243.998,479.667c-3.746-0.196-7.469-0.477-11.164-0.86c-5.89-2.64-11.722-6.25-17.5-10.961 c-17.632-14.359-33.976-38.671-46.398-69.85h75.061V479.667z M243.998,373.997h-83.436c-9.477-31.171-15.316-67.311-16.328-105.998 h99.763V373.997z M243.998,244H144.31c1.008-38.71,6.875-74.819,16.359-105.997h83.33V244z M243.998,114.003h-74.951 c3.109-7.79,6.367-15.312,9.934-22.195c10.64-20.625,23.17-36.89,36.354-47.656c5.777-4.71,11.609-8.32,17.5-10.96 c3.695-0.382,7.417-0.664,11.164-0.859V114.003z M446.392,138.003c19.312,31.085,31.234,67.194,33.281,105.997h-87.991 c-0.961-38.124-6.21-74.092-15.21-105.997H446.392z M414.393,97.612c5.211,5.211,10.156,10.696,14.836,16.391h-60.577 c-4.281-11.773-9.023-22.945-14.312-33.21c-6.953-13.437-14.758-25.468-23.347-35.89C362.668,56.16,391.065,74.301,414.393,97.612z M267.998,32.333c3.746,0.195,7.469,0.484,11.16,0.859c5.89,2.649,11.723,6.25,17.504,10.96 c17.636,14.359,33.976,38.671,46.397,69.85h-75.061V32.333z M267.998,138.003h83.436c9.476,31.171,15.32,67.31,16.328,105.997 h-99.764V138.003z M267.998,268h99.685c-1.007,38.71-6.874,74.818-16.359,105.998h-83.326V268z M296.661,467.846 c-5.781,4.711-11.614,8.313-17.504,10.961c-3.691,0.375-7.414,0.664-11.16,0.86v-81.67h74.951 c-3.109,7.789-6.367,15.312-9.933,22.195C322.376,440.816,309.845,457.081,296.661,467.846z M414.393,414.386 c-23.336,23.328-51.764,41.476-83.459,52.725c15.187-18.375,27.835-41.905,37.757-69.115h60.538 C424.548,403.692,419.604,409.176,414.393,414.386z M446.392,373.997h-69.998c9.008-31.929,14.414-67.842,15.367-105.998h87.912 C477.626,306.804,465.704,342.912,446.392,373.997z"></path>
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
                <a href="mailto:contact@squalo.dev" aria-label="Email" className="w-12 h-12 rounded-full bg-shark-light/10 flex items-center justify-center">
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
