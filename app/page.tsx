import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ExternalLink, Code2, Briefcase, Rocket, Phone, MapPin, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// SVG background as a fixed, full-viewport layer (embedded so it works everywhere)
// const BG_URL = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPC0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMjcuNS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCAtLT4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDUwMCA1MDAiIHZpZXdCb3g9IjAgMCA1MDAgNTAwIj48IS0tIFNWRyB0b28gbG9uZyB0byBpbmxpbmUgaGVyZS4gVXNlIGJhc2U2NCBkYXRhIFVSTCBpbnN0ZWFkLiAtLT48ZyBpZD0iTGF5ZXJfMSI+PHJlY3Qgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiIGZpbGw9IiNmMGY0ZjYiLz48ZyBpZD0iZGVjb3IiPjxwYXRoIGQ9Ik0wIDBoNTAwdjUwMEgweiIgZmlsbD0ibm9uZSIvPjwvZz48L2c+PC9zdmc+"}]}
const BG_URL = "/squalo_bg.svg"

// Small helper for staggered fade/slide
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay } },
});

const Section = ({ id, title, kicker, children }: { id: string; title: string; kicker?: string; children: React.ReactNode }) => (
  <section id={id} className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
      {kicker && (
        <motion.p variants={fadeUp(0)} className="mb-2 text-xs uppercase tracking-[0.2em] text-foreground/60">
          {kicker}
        </motion.p>
      )}
      <motion.h2 variants={fadeUp(0.05)} className="text-3xl sm:text-4xl font-semibold tracking-tight">
        {title}
      </motion.h2>
      <motion.div variants={fadeUp(0.1)} className="mt-8">
        {children}
      </motion.div>
    </motion.div>
  </section>
);

const ProjectCard = ({ title, desc, tags, link }: { title: string; desc: string; tags: string[]; link?: string }) => (
  <motion.div variants={fadeUp(0)}>
    <Card className="group h-full overflow-hidden border-foreground/10 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40 transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Code2 className="size-5" /> {title}
        </CardTitle>
        <CardDescription className="text-foreground/70">
          {desc}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="rounded-full border border-foreground/15 px-3 py-1 text-xs text-foreground/70">
              {t}
            </span>
          ))}
        </div>
        {link && (
          <div className="mt-4">
            <Button asChild variant="secondary" className="group/button">
              <a href={link} target="_blank" rel="noreferrer">
                Apri progetto <ExternalLink className="ml-2 inline size-4 transition-transform group-hover/button:-translate-y-0.5" />
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

export default function SqualoDevPortfolio() {
  // Dummy content you can replace quickly
  const projects = [
    { title: "Squalo UI Kit", desc: "Libreria di componenti React accessibili e tipizzati.", tags: ["React", "TypeScript", "Design System"], link: "#" },
    { title: "Shark API", desc: "API ad alte prestazioni per analytics real-time.", tags: ["Node", "tRPC", "PostgreSQL"], link: "#" },
    { title: "Squalo.dev v1", desc: "Sito personale con stack moderno e animazioni.", tags: ["Next.js", "Tailwind", "Framer Motion"], link: "#" },
    { title: "Ocean ML", desc: "Modelli ML per classificazione immagini marine.", tags: ["Python", "PyTorch", "MLOps"], link: "#" },
  ];

  const experiences = [
    { role: "Senior Frontend Engineer", company: "Acme", period: "2023 → Oggi", bullets: ["Guidato il design system", "Performance +45%", "A/B testing su funnel" ] },
    { role: "Full‑Stack Developer", company: "Wave Ltd.", period: "2021 → 2023", bullets: ["Microservizi Node", "CI/CD su Vercel", "Monitoring con OpenTelemetry" ] },
  ];

  return (
    <div className="relative min-h-screen text-foreground">
      {/* Fixed SVG background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,rgba(0,0,0,0.2)_30%,transparent_85%)]"
          style={{ backgroundImage: `url(${BG_URL})`, backgroundSize: "cover", backgroundAttachment: "fixed", backgroundPosition: "center" }}
        />
        {/* subtle overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/20 to-background/80" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-foreground/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
          <a href="#home" className="font-semibold tracking-tight">squalo.dev</a>
          <nav className="hidden gap-6 sm:flex text-sm">
            <a href="#progetti" className="transition-opacity hover:opacity-70">Progetti</a>
            <a href="#esperienza" className="transition-opacity hover:opacity-70">Esperienza</a>
            <a href="#contatti" className="transition-opacity hover:opacity-70">Contatti</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="ghost">
              <a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub"><Github className="size-5" /></a>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <a href="https://linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin className="size-5" /></a>
            </Button>
            <Button asChild size="sm">
              <a href="#contatti"><Mail className="mr-2 size-4"/> Contattami</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-foreground/60">Portfolio</p>
            <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.1]">
              Ciao, sono <span className="underline decoration-wavy decoration-foreground/40">Squalo</span> —
              costruisco esperienze web veloci, accessibili e belle da usare.
            </h1>
            <p className="mt-5 max-w-2xl text-foreground/70">
              Full‑stack con focus sul front‑end. Amo performance, DX e micro‑animazioni.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href="#progetti"><Rocket className="mr-2 size-4"/> Guarda i progetti</a>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <a href="#contatti"><Phone className="mr-2 size-4"/> Parliamo</a>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <a href="/cv.pdf" target="_blank" rel="noreferrer"><Download className="mr-2 size-4"/> Scarica CV</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Progetti */}
      <Section id="progetti" title="Progetti in evidenza" kicker="Selezione">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <motion.div key={p.title} custom={i} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}>
              <ProjectCard {...p} />
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* Esperienza */}
      <Section id="esperienza" title="Esperienza" kicker="Timeline">
        <div className="grid gap-6 md:grid-cols-2">
          {experiences.map((e, idx) => (
            <motion.div key={idx} variants={fadeUp(idx * 0.05)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
              <Card className="border-foreground/10 bg-background/60 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Briefcase className="size-5"/> {e.role}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-foreground/70">
                    <span>{e.company}</span>
                    <span className="h-1 w-1 rounded-full bg-foreground/30"/>
                    <span>{e.period}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 text-sm text-foreground/80 space-y-1">
                    {e.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Contatti */}
      <Section id="contatti" title="Contattami" kicker="Disponibile per nuove collaborazioni">
        <motion.div variants={fadeUp(0)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid gap-8 md:grid-cols-2">
          <Card className="border-foreground/10 bg-background/60 backdrop-blur">
            <CardHeader>
              <CardTitle>Parliamo del tuo progetto</CardTitle>
              <CardDescription>Scrivimi due righe: rispondo in 24h.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm">Nome</label>
                    <input required className="w-full rounded-xl border border-foreground/15 bg-background/80 px-3 py-2 outline-none ring-0 focus:border-foreground/30" placeholder="Il tuo nome" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm">Email</label>
                    <input type="email" required className="w-full rounded-xl border border-foreground/15 bg-background/80 px-3 py-2 outline-none ring-0 focus:border-foreground/30" placeholder="tu@email.com" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm">Messaggio</label>
                  <textarea required rows={5} className="w-full rounded-xl border border-foreground/15 bg-background/80 px-3 py-2 outline-none ring-0 focus:border-foreground/30" placeholder="Raccontami l'idea…" />
                </div>
                <Button type="submit" className="w-full sm:w-auto">
                  Invia
                </Button>
              </form>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-foreground/70">
                <span className="flex items-center gap-2"><Mail className="size-4"/> hello@squalo.dev</span>
                <span className="flex items-center gap-2"><MapPin className="size-4"/> Italia • Remote</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-foreground/10 bg-background/60 backdrop-blur">
            <CardHeader>
              <CardTitle>Stack & Skill</CardTitle>
              <CardDescription>Gli strumenti che uso ogni giorno.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["TypeScript","React","Next.js","TailwindCSS","Node.js","tRPC","PostgreSQL","Prisma","Vercel","Framer Motion","Vitest"].map(t => (
                  <span key={t} className="rounded-full border border-foreground/15 px-3 py-1 text-xs text-foreground/70">
                    {t}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-foreground/10 py-10 text-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-foreground/60">© {new Date().getFullYear()} squalo.dev — Tutti i diritti riservati.</p>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm"><a href="#">Privacy</a></Button>
            <Button asChild variant="ghost" size="sm"><a href="#">Cookie</a></Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
