"use client";

import React, { useEffect, useState, useRef } from 'react';

type SpotifyItem = any;

export default function SpotifyNowPlaying() {
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // ms
  const [lyrics, setLyrics] = useState<any[] | null>(null);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const progTickRef = useRef<number | null>(null);
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);
  const currentLineRef = useRef<HTMLDivElement | null>(null);

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
  // support optional lyrics payload from the API: either array of strings or array of { start_ms, text }
  setLyrics(json?.lyrics ?? null);
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

  // derive current lyric index from progress
  useEffect(() => {
    if (!lyrics || lyrics.length === 0) { setCurrentLyricIndex(0); return; }
    // lyrics may be plain strings (no timings) or objects with start_ms
    const dur = (data && data.item && data.item.duration_ms) ? data.item.duration_ms : 0;
    if (typeof lyrics[0] === 'string') {
      // simple scrolling: pick line by proportion of progress/duration
      const pct = dur > 0 ? Math.min(1, progress / dur) : 0;
      const idx = Math.floor(pct * (lyrics.length - 1));
      setCurrentLyricIndex(idx);
      return;
    }
    // if timestamped lines
    let idx = 0;
    for (let i = 0; i < lyrics.length; i++) {
      const start = lyrics[i]?.start_ms ?? 0;
      const nextStart = lyrics[i + 1]?.start_ms ?? Number.MAX_SAFE_INTEGER;
      if (progress >= start && progress < nextStart) { idx = i; break; }
    }
    setCurrentLyricIndex(idx);
  }, [progress, lyrics]);

  // auto-scroll lyrics container to keep current line visible
  useEffect(() => {
    if (!lyricsContainerRef.current || !currentLineRef.current) return;
    const container = lyricsContainerRef.current;
    const line = currentLineRef.current;
    const offset = line.offsetTop - container.offsetTop - (container.clientHeight / 2) + (line.clientHeight / 2);
    container.scrollTo({ top: offset, behavior: 'smooth' });
  }, [currentLyricIndex]);

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
      <div className="flex items-start gap-4">
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
        {/* right-side lyrics panel */}
        <div className="w-64 ml-4 hidden md:block">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-300">Lyrics</div>
            <div className="w-6 h-6 opacity-90">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-400">
                <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm5.334 17.334c-.267.4-.8.533-1.2.267-3.467-2.133-7.8-2.133-10.8-1.067-.4.133-.867-.067-1-.467-.133-.4.067-.867.467-1 3.6-1.133 8.133-1.2 11.333 1.2.4.267.533.8.2 1.067zM17.2 13.2c-.2.333-.667.433-1 .267-2.733-1.6-6.2-1.733-8.967-.867-.333.133-.7-.067-.833-.4-.133-.333.067-.7.4-.833 2.933-.867 6.8-.733 9.467.933.333.2.433.667.133 1zM18.133 9.467c-3.133-1.867-8.6-2-11.333-1.067-.4.133-.833-.067-.967-.467-.133-.4.067-.833.467-.967 3.333-1.133 9.133-1 12.6 1.333.433.267.567.8.267 1.167-.267.333-.8.433-1.134.033z" />
              </svg>
            </div>
          </div>

          <div ref={lyricsContainerRef} className="lyrics-container h-40 overflow-y-auto pr-2 text-sm text-gray-200/60">
            {(!lyrics || lyrics.length === 0) ? (
              <div className="text-xs text-gray-400">No lyrics available.</div>
            ) : (
              lyrics.map((line: any, i: number) => {
                const text = typeof line === 'string' ? line : (line?.text ?? '');
                const isCurrent = i === currentLyricIndex;
                  return (
                    <div
                      key={i}
                      ref={(el) => { if (isCurrent) currentLineRef.current = el as HTMLDivElement; }}
                      className={`py-1 transition-colors duration-200 ${isCurrent ? 'text-white font-semibold' : 'text-white/40'}`}
                      style={{ opacity: isCurrent ? 1 : 0.45 }}
                    >
                      {text}
                    </div>
                  );
              })
            )}
          </div>
        </div>
      </div>

      <style>{`
        .marquee { height: 1.4em; }
        .marquee-inner { padding-left: 100%; animation: marquee 12s linear infinite; }
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-100%); } }
  .lyrics-container { background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.05)); padding: 0.5rem; border-radius: 0.5rem; }
  .lyrics-container::-webkit-scrollbar { width: 6px; }
  .lyrics-container::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 6px; }
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
