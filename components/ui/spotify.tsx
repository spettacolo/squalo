"use client";

import React, { useEffect, useState, useRef } from 'react';

type SpotifyItem = any;

export default function SpotifyNowPlaying() {
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // ms
  const intervalRef = useRef<number | null>(null);
  const progTickRef = useRef<number | null>(null);

  async function fetchNow() {
    try {
      const res = await fetch('/api/spotify/current');
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message || json?.error || 'error');
        setData(null);
        return;
      }
      setError(null);
      setData(json);
      setIsPlaying(!!json?.is_playing);
      setProgress(json?.progress_ms ?? 0);
    } catch (e: any) {
      setError(e?.message || 'fetch error');
      setData(null);
    }
  }

  // poll every 3s for authoritative state
  useEffect(() => {
    fetchNow();
    intervalRef.current = window.setInterval(fetchNow, 3000);
    return () => { if (intervalRef.current) window.clearInterval(intervalRef.current); };
  }, []);

  // when data changes start/stop per-second progress tick
  useEffect(() => {
    if (progTickRef.current) { window.clearInterval(progTickRef.current); progTickRef.current = null; }
    if (data && data.is_playing) {
      progTickRef.current = window.setInterval(() => {
        setProgress((p) => p + 1000);
      }, 1000) as unknown as number;
    }
    return () => { if (progTickRef.current) { window.clearInterval(progTickRef.current); progTickRef.current = null; } };
  }, [data?.is_playing]);

  if (error) {
    return (
      <div className="spotify-player opacity-80 text-sm text-muted">
        {/* <h4 className="text-lg font-bold">currently playing</h4> */}
        <p className="text-xs">{error}</p>
      </div>
    );
  }

  if (!data || !data.item) {
    return (
      <div className="spotify-player opacity-80 text-sm text-muted">
        {/* <h4 className="text-lg font-bold">currently playing</h4> */}
        <p className="text-xs">nothing playing right now.</p>
      </div>
    );
  }

  const item: SpotifyItem = data.item;
  const artists = (item.artists || []).map((a: any) => a.name).join(', ');
  const title = item.name || '';
  const albumArt = item.album?.images?.[0]?.url;
  const duration = item.duration_ms || 0;

  const pct = duration > 0 ? Math.min(1, progress / duration) : 0;

  return (
    <div className="spotify-player max-w-full rounded-lg overflow-hidden bg-gradient-to-r from-[#3b2a3b]/40 via-[#5b2a2a]/20 to-[#2a2a4b]/40 p-4 text-white">
      {/* <h4 className="text-lg font-bold mb-2">currently playing</h4> */}
      <div className="flex items-center gap-4">
        {albumArt ? (
          <img src={albumArt} alt={item.album?.name || 'album art'} className="w-20 h-20 rounded-md object-cover" />
        ) : (
          <div className="w-20 h-20 rounded-md bg-neutral-800" />
        )}

        <div className="flex-1 min-w-0">
          <div className="marquee text-xl font-semibold whitespace-nowrap overflow-hidden">
            <div className="marquee-inner inline-block">
              {title} — {artists}
            </div>
          </div>

          <div className="text-sm text-gray-300 mt-1">by {artists}</div>

          <div className="mt-3">
            <div className="w-full h-2 bg-white/12 rounded-full overflow-hidden">
              <div className="h-2 bg-white rounded-full" style={{ width: `${pct * 100}%`, transition: 'width 0.2s linear' }} />
            </div>
            <div className="flex justify-between text-xs text-gray-200 mt-1">
              <span>{msToTime(progress)}</span>
              <span>{msToTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .marquee { height: 1.4em; }
        .marquee-inner { padding-left: 100%; animation: marquee 12s linear infinite; }
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-100%); } }

        /* effetto in rilievo (emboss) applicato al container spotify - FORZA solo inset, sovrascrive eventuali ombre esterne */
        .spotify-player {
       /* solo ombre interne per effetto in rilievo (no shadow esterno)
         aumentiamo l'highlight interno per schiarire il centro */
       box-shadow: inset 0 10px 22px rgba(0,0,0,0.52),
               inset 0 -14px 34px rgba(255,255,255,0.08);
       -webkit-box-shadow: inset 0 10px 22px rgba(0,0,0,0.52),
                    inset 0 -14px 34px rgba(255,255,255,0.08);
          border-radius: 0.5rem;
          border: 1px solid rgba(255,255,255,0.04);
          backdrop-filter: blur(3px) saturate(120%);
          -webkit-backdrop-filter: blur(3px) saturate(120%);
          position: relative;
          z-index: 1; /* sopra il contenuto per pseudo-element highlight */
          background-clip: padding-box;
        }

        /* sottile specular highlight per dare più rilievo (non influisce su click) */
        .spotify-player::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          height: 36%;
          pointer-events: none;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.00));
          mix-blend-mode: overlay;
        }
        /* overlay interno chiaro per schiarire il centro (come lo shoutbox) */
        .spotify-player::after {
          content: '';
          position: absolute;
          inset: 8px; /* lascia l'effetto di bordo visibile */
          border-radius: calc(0.5rem - 8px);
          pointer-events: none;
          background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
          mix-blend-mode: overlay;
          opacity: 0.95;
        }
      `}</style>
    </div>
  );
}

function msToTime(ms: number) {
  if (!ms && ms !== 0) return '--:--';
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
