"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
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

      {/* content-scroll keeps the viewport background fixed and moves scrolling to this container only */}
      <div className="relative z-10 py-20 content-scroll">
        <Projects />
        <Experience />
      </div>
    </main>
  );
}

const projects = [
  { title: "Progetto 1", description: "Descrizione breve", link: "#" },
  { title: "Progetto 2", description: "Descrizione breve", link: "#" },
  { title: "Progetto 3", description: "Descrizione breve", link: "#" },
];

const Projects = () => (
  <div className="container mx-auto px-4 mb-20">
    <h2 className="font-heading text-4xl text-shark-light mb-8">Progetti</h2>
    <div className="grid md:grid-cols-3 gap-6">
      {projects.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="bg-shark-mid/30 backdrop-blur-sm border-shark-light/20">
            <CardHeader>
              <CardTitle>{p.title}</CardTitle>
              <CardDescription>{p.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="bg-shark-light hover:bg-shark-mid">
                <Link href={p.link}>Scopri di più</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </div>
);

const experiences = [
  { role: "Frontend Developer", company: "Azienda X", period: "2022 - Presente" },
  { role: "Web Designer", company: "Azienda Y", period: "2020 - 2022" },
];

const Experience = () => (
  <div className="container mx-auto px-4">
    <h2 className="font-heading text-4xl text-shark-light mb-8">Esperienza</h2>
    <div className="space-y-6">
      {experiences.map((exp, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="bg-shark-mid/30 backdrop-blur-sm border-shark-light/20">
            <CardHeader>
              <CardTitle>{exp.role}</CardTitle>
              <CardDescription>{exp.company}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-shark-sand">{exp.period}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </div>
);
