"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface SectionProps {
  id: string;
  title: string;
  kicker?: string;
  children: React.ReactNode;
}

const BG_URL = "/squalo_bg.svg";

export default function HomePage() {
  return (
    <main
      className="relative min-h-screen text-white"
      style={{
        backgroundImage: `url(${BG_URL})`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
      }}
    >
      {/* overlay per contrasto */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />

      {/* contenuto */}
      <div className="relative z-10">
        <Hero />
        <Projects />
        <Experience />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}

const Section = ({ id, title, kicker, children }: SectionProps) => (
  <section id={id} className="py-20 container mx-auto px-4">
    {kicker && (
      <p className="text-sm uppercase tracking-wider text-teal-300 mb-2">
        {kicker}
      </p>
    )}
    <h2 className="text-4xl font-bold mb-8">{title}</h2>
    {children}
  </section>
);

const Hero = () => (
  <section className="h-screen flex flex-col items-center justify-center text-center px-4">
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-5xl font-extrabold mb-4"
    >
      Ciao, sono <span className="text-teal-400">Squalo</span>
    </motion.h1>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="text-lg max-w-xl mb-6 text-gray-300"
    >
      Sviluppatore web appassionato di design, animazioni e esperienze
      interattive. Benvenuto nel mio portfolio!
    </motion.p>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="flex gap-4"
    >
      <Button asChild>
        <Link href="#projects">Progetti</Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href="#contact">Contattami</Link>
      </Button>
    </motion.div>
  </section>
);

const projects = [
  {
    title: "Progetto 1",
    description: "Descrizione breve del progetto 1",
    link: "#",
  },
  {
    title: "Progetto 2",
    description: "Descrizione breve del progetto 2",
    link: "#",
  },
  {
    title: "Progetto 3",
    description: "Descrizione breve del progetto 3",
    link: "#",
  },
];

const Projects = () => (
  <Section id="projects" title="Progetti">
    <div className="grid md:grid-cols-3 gap-6">
      {projects.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{p.title}</CardTitle>
              <CardDescription>{p.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href={p.link}>Scopri di più</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </Section>
);

const experiences = [
  {
    role: "Frontend Developer",
    company: "Azienda X",
    period: "2022 - Presente",
  },
  {
    role: "Web Designer",
    company: "Azienda Y",
    period: "2020 - 2022",
  },
];

const Experience = () => (
  <Section id="experience" title="Esperienza">
    <div className="space-y-6">
      {experiences.map((exp, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{exp.role}</CardTitle>
              <CardDescription>{exp.company}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">{exp.period}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </Section>
);

const Contact = () => (
  <Section id="contact" title="Contattami">
    <div className="flex flex-col items-center">
      <p className="mb-4 text-gray-300">
        Scrivimi per collaborazioni o progetti!
      </p>
      <div className="flex gap-4">
        <Link href="mailto:tuo@email.com">
          <Mail className="w-6 h-6" />
        </Link>
        <Link href="https://github.com/tuo-username" target="_blank">
          <Github className="w-6 h-6" />
        </Link>
        <Link href="https://linkedin.com/in/tuo-username" target="_blank">
          <Linkedin className="w-6 h-6" />
        </Link>
      </div>
    </div>
  </Section>
);

const Footer = () => (
  <footer className="py-6 text-center text-gray-500 text-sm">
    © {new Date().getFullYear()} Squalo.dev - Tutti i diritti riservati
  </footer>
);
