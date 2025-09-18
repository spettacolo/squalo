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
            {/* <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M6.534 18a4.507 4.507 0 01-3.208-1.329 4.54 4.54 0 010-6.414l1.966-1.964a.999.999 0 111.414 1.414L4.74 11.671a2.54 2.54 0 000 3.586c.961.959 2.631.958 3.587 0l1.966-1.964a1 1 0 111.415 1.414l-1.966 1.964A4.503 4.503 0 016.534 18zm7.467-6a.999.999 0 01-.707-1.707l1.966-1.964a2.54 2.54 0 000-3.586c-.961-.959-2.631-.957-3.587 0L9.707 6.707a1 1 0 11-1.415-1.414l1.966-1.964A4.503 4.503 0 0113.466 2c1.211 0 2.351.472 3.208 1.329a4.541 4.541 0 010 6.414l-1.966 1.964a.997.997 0 01-.707.293zm-6.002 1a.999.999 0 01-.707-1.707l4.001-4a1 1 0 111.415 1.414l-4.001 4a1 1 0 01-.708.293z" fill="#ffffff"></path></g></svg> */}
            <svg width="25" height="25" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className="text-shark-sand/50"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M11 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 11-2 0V6.414l-5.293 5.293a1 1 0 01-1.414-1.414L13.586 5H12a1 1 0 01-1-1zM3 6.5A1.5 1.5 0 014.5 5H8a1 1 0 010 2H5v8h8v-3a1 1 0 112 0v3.5a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 013 15.5v-9z" fill="currentColor"></path></g></svg>
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
