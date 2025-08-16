"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

type Entry = { key: string; label: string; address: string; href?: string; full?: string };

const DEFAULTS: Entry[] = [
  { key: "ton", label: "ton", address: "squalo.t.me", full: "squalo.t.me" },
  { key: "btc", label: "btc", address: "1boss4iu...un7k", full: "1boss4iuiQSmQjE7yLgqmTP2f5Mqkun7k" },
  { key: "eth", label: "eth", address: "0x00000000...9f39", full: "0x00000000ddca05d85b4dcffcea97567880989f39" },
  { key: "trx", label: "trx", address: "TRUEmbByAT...WP77", full: "TRUEmbByAT3Xv1eXhET6TtpQK2JzUvWP77" },
  { key: "sol", label: "sol", address: "god2M9qTYe...M5ci", full: "god2M9qTYeJerPk6ASTabqkQPQgjSrJ13PbtAD2M5ci" },
  { key: "cryptobot", label: "cryptobot", address: "click", href: "https://t.me/send?start=referral", full: "https://t.me/send?start=referral" },
];

export default function Donations({ entries = DEFAULTS }: { entries?: Entry[] }) {
  const [copied, setCopied] = useState<string | null>(null);

  async function handleCopy(address: string, key: string) {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(key);
      setTimeout(() => setCopied((s) => (s === key ? null : s)), 1500);
    } catch (e) {
      // ignore
    }
  }

  return (
    <div className="mt-6">
      <ul className="donations-list list-none m-0 p-0 space-y-3 text-sm text-shark-sand/90">
        {entries.map((e) => (
          <li key={e.key} className="flex items-center gap-3">
            <b className="w-16 lowercase text-xs text-shark-sand/80">{e.label}</b>

            {e.href ? (
              <a
                href={e.href}
                target="_blank"
                rel="noopener noreferrer"
                className="donation-address donation-clickable underline-offset-2 hover:underline"
              >
                {e.address}
                <svg className="inline-block ml-2 align-middle" width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </a>
            ) : (
              <motion.span
                role="button"
                tabIndex={0}
                onClick={() => handleCopy(e.full ?? e.address, e.key)}
                onKeyDown={(ev) => ev.key === "Enter" && handleCopy(e.full ?? e.address, e.key)}
                className="donation-address donation-copyable cursor-pointer select-none inline-flex items-center w-full justify-start text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.985 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                aria-label={`Copia indirizzo ${e.label}`}
                title={e.full ?? e.address}>
                <span className="transition-colors duration-150 peer">{e.address}</span>
                {/* container forces both svgs to occupy identical area */}
                <div className="ml-2 relative w-4 h-4 flex-shrink-0">
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                    initial={{ opacity: 1, scale: 1 }}
                    animate={copied === e.key ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
                    transition={{ duration: 0.12 }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <path fillRule="evenodd" clipRule="evenodd" d="M21 8C21 6.34315 19.6569 5 18 5H10C8.34315 5 7 6.34315 7 8V20C7 21.6569 8.34315 23 10 23H18C19.6569 23 21 21.6569 21 20V8ZM19 8C19 7.44772 18.5523 7 18 7H10C9.44772 7 9 7.44772 9 8V20C9 20.5523 9.44772 21 10 21H18C18.5523 21 19 20.5523 19 20V8Z" fill="currentColor"></path>
                    <path d="M6 3H16C16.5523 3 17 2.55228 17 2C17 1.44772 16.5523 1 16 1H6C4.34315 1 3 2.34315 3 4V18C3 18.5523 3.44772 19 4 19C4.55228 19 5 18.5523 5 18V4C5 3.44772 5.44772 3 6 3Z" fill="currentColor"></path>
                  </motion.svg>

                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={copied === e.key ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.12 }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <path d="M20 7L9.5 18.5L4 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                </div>
              </motion.span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
