"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type Props = {
  title: string;
  description?: string;
  imgSrc?: string; // optional placeholder
  href?: string;
};

export default function ProjectCard({ title, description = "Coming soon", imgSrc, href }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="rounded-lg bg-shark-light/6 p-3 flex flex-col items-start gap-3">
      <div className="w-full h-28 md:h-36 bg-shark-mid/20 rounded-md overflow-hidden flex items-center justify-center">
        {imgSrc ? (
          <Image src={imgSrc} alt={title} width={640} height={360} className="w-full h-full object-cover" />
        ) : (
          <div className="w-48 h-20 bg-shark-light/10 rounded-sm flex items-center justify-center text-xs text-shark-sand/60">Image</div>
        )}
      </div>

      <div className="w-full">
        <div className="font-semibold">{title}</div>
        <div className="text-xs text-shark-sand/70 mt-1">{description}</div>
      </div>

      <div className="w-full flex justify-end">
        {href ? (
          <a href={href} target="_blank" rel="noreferrer" aria-label={`Open ${title}`} className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-shark-light/8">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-shark-sand/80">
              <path d="M14 3H21V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 14L21 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 21H3V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        ) : (
          <div className="w-9 h-9 rounded-md bg-shark-light/8 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-shark-sand/50">
              <path d="M12 5V19" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 12H19" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  );
}
