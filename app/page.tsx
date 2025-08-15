"use client";

import { motion } from "framer-motion";
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
      <div className="absolute inset-0 bg-shark-dark/70 z-0" />

      {/* single big card container */}
      <div className="relative z-10 py-12 flex items-start justify-center content-scroll">
        <Card className="w-[94%] sm:w-[86%] md:max-w-5xl lg:max-w-6xl mx-auto p-6 sm:p-8 min-h-[80vh] bg-shark-mid/30 backdrop-blur-sm border border-shark-light/30 rounded-2xl overflow-auto shadow-xl">
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
            {/* spacer to ensure bottom border remains visible when scrolled to end */}
            <div className="h-6" />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
