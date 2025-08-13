"use client";

import { useEffect } from "react";
import fullpage from "fullpage.js";
import "fullpage.js/dist/fullpage.css";
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

const BG_URL = "/9581017_37132.svg"; // SVG in public/

export default function HomePage() {
  useEffect(() => {
    new fullpage("#fullpage", {
      autoScrolling: true,
      navigation: true,
      anchors: ["home", "projects", "experience", "contact"],
      scrollingSpeed: 800,
      easingcss3: "ease-in-out",
    });
  }, []);

  return (
    <main
      className="text-white font-body"
      style={{
        backgroundImage: `url(${BG_URL})`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
      }}
    >
      {/* overlay per contrasto */}
      <div className="absolute inset-0 bg-shark-dark/70 backdrop-blur-sm z-0" />

      <div id="fullpage" className="relative z-10">
        <div className="section"><Hero /></div>
        <div className="section"><Projects /></div>
        <div className="section"><Experience /></div>
        <div className="section"><Contact /></div>
        <div className="section"><Footer /></div>
      </div>
    </main>
  );
}

const Hero = () => (
  <div className="flex flex-col items-center justify-center h-full text-center px-4">
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="font-heading text-6xl font-extrabold mb-4 text-shark-light"
    >
      Benvenuto su <span className="text-shark-light">Squalo.dev</span>
    </motion.h1>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="text-lg max-w-xl mb-6 text-shark-sand"
    >
      Creo esperienze web immersive, con design curato e animazioni fluide.
    </motion.p>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="flex gap-4"
    >
      <Button asChild className="bg-shark-light hover:bg-shark-mid">
        <Link href="#projects">Progetti</Link>
      </Button>
      <Button
        variant="outline"
        asChild
        className="border-shark-light text-shark-light hover:bg-shark-light hover:text-white"
      >
        <Link href="#contact">Contattami</Link>
      </Button>
    </motion.div>
  </div>
);

const projects = [
  { title: "Progetto 1", description: "Descrizione breve", link: "#" },
  { title: "Progetto 2", description: "Descrizione breve", link: "#" },
  { title: "Progetto 3", description: "Descrizione breve", link: "#" },
];

const Projects = () => (
  <div className="h-full flex flex-col justify-center container mx-auto px-4">
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
  <div className="h-full flex flex-col justify-center container mx-auto px-4">
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

const Contact = () => (
  <div className="h-full flex flex-col justify-center items-center text-center px-4">
    <h2 className="font-heading text-4xl text-shark-light mb-4">Contattami</h2>
    <p className="mb-4 text-shark-sand">Scrivimi per collaborazioni o progetti!</p>
    <div className="flex gap-6">
      <Link href="mailto:tuo@email.com">
        <Mail className="w-7 h-7 text-shark-light hover:text-white transition" />
      </Link>
      <Link href="https://github.com/tuo-username" target="_blank">
        <Github className="w-7 h-7 text-shark-light hover:text-white transition" />
      </Link>
      <Link href="https://linkedin.com/in/tuo-username" target="_blank">
        <Linkedin className="w-7 h-7 text-shark-light hover:text-white transition" />
      </Link>
    </div>
  </div>
);

const Footer = () => (
  <div className="h-full flex flex-col justify-center items-center text-sm text-shark-sand">
    © {new Date().getFullYear()} Squalo.dev - Tutti i diritti riservati
  </div>
);
