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
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);
  const currentLineRef = useRef<HTMLDivElement | null>(null);
  const [lastData, setLastData] = useState<any | null>(null);
  const lastSeenRef = useRef<number>(0);
  const intervalRef = useRef<number | null>(null);
  const progTickRef = useRef<number | null>(null);

  // dev-only sample lyrics to preview effect on localhost when backend has none
  const sampleLyrics = [
    { start_ms: 0, text: "First light, breaking through the dark" },
    { start_ms: 12000, text: "I hear the echo of the heart" },
    { start_ms: 24000, text: "Falling, learning how to fly" },
    { start_ms: 36000, text: "Hold me close until the night" },
    { start_ms: 48000, text: "We're believers, keep the fire alive" },
  ];

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
      // accept optional lyrics payload: either array of strings or [{start_ms, text}, ...]
      setLyrics(json?.lyrics ?? null);
      // dev helper: if no lyrics from API, inject sample lines on localhost for preview
      if (!json?.lyrics && typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        setLyrics(sampleLyrics);
      }
      // if the response contains an item, update lastData/lastSeen — otherwise keep lastData for a grace period
      if (json?.item) {
        setLastData(json);
        lastSeenRef.current = Date.now();
      }
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
    // compute effective playing state (consider lastData within a grace window)
    const KEEP_ALIVE_MS = 8000;
    const now = Date.now();
    const effectiveIsPlaying = (data && data.is_playing) || (lastData && (now - lastSeenRef.current) < KEEP_ALIVE_MS && lastData.is_playing);
    if (effectiveIsPlaying) {
      progTickRef.current = window.setInterval(() => {
        setProgress((p) => p + 1000);
      }, 1000) as unknown as number;
    }
    return () => { if (progTickRef.current) { window.clearInterval(progTickRef.current); progTickRef.current = null; } };
  }, [data?.is_playing]);

  // compute which lyric line is current based on progress
  useEffect(() => {
    if (!lyrics || lyrics.length === 0) { setCurrentLyricIndex(0); return; }
    const dur = (data && data.item && data.item.duration_ms) ? data.item.duration_ms : 0;
    if (typeof lyrics[0] === 'string') {
      const pct = dur > 0 ? Math.min(1, progress / dur) : 0;
      setCurrentLyricIndex(Math.floor(pct * (lyrics.length - 1)));
      return;
    }
    // timestamped lyrics
    let idx = 0;
    for (let i = 0; i < lyrics.length; i++) {
      const start = lyrics[i]?.start_ms ?? 0;
      const next = lyrics[i + 1]?.start_ms ?? Number.MAX_SAFE_INTEGER;
      if (progress >= start && progress < next) { idx = i; break; }
    }
    setCurrentLyricIndex(idx);
  }, [progress, lyrics, data]);

  // auto-scroll to current lyric
  useEffect(() => {
    const c = lyricsContainerRef.current;
    const line = currentLineRef.current;
    if (!c || !line) return;
    const top = line.offsetTop - c.offsetTop - (c.clientHeight / 2) + (line.clientHeight / 2);
    c.scrollTo({ top, behavior: 'smooth' });
  }, [currentLyricIndex]);

  if (error) {
    return (
      <div className="spotify-player opacity-80 text-sm text-muted">
        {/* <h4 className="text-lg font-bold">currently playing</h4> */}
        <p className="text-xs">{error}</p>
      </div>
    );
  }

  // allow showing last known data for a short grace period so UI doesn't disappear on transient 204/no-item
  const KEEP_ALIVE_MS = 8000;
  const now = Date.now();
  const effectiveData = (data && data.item) ? data : ((lastData && (now - lastSeenRef.current) < KEEP_ALIVE_MS) ? lastData : data);

  if (!effectiveData || !effectiveData.item) {
    return (
      <div className="spotify-player opacity-80 text-sm text-muted">
        {/* <h4 className="text-lg font-bold">currently playing</h4> */}
        <p className="text-xs">nothing playing right now.</p>
      </div>
    );
  }

  const item: SpotifyItem = effectiveData.item;
  const artists = (item.artists || []).map((a: any) => a.name).join(', ');
  const title = item.name || '';
  const albumArt = item.album?.images?.[0]?.url;
  const duration = item.duration_ms || 0;

  const pct = duration > 0 ? Math.min(1, progress / duration) : 0;

  return (
    <div className="spotify-player max-w-full rounded-2xl overflow-hidden p-6 text-white" style={{ background: 'linear-gradient(90deg, rgba(80,130,220,0.12), rgba(70,80,140,0.12))', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.03)' }}>
      {/* <h4 className="text-lg font-bold mb-2">currently playing</h4> */}
  <div className="flex items-start gap-6">
        {albumArt ? (
          <img src={albumArt} alt={item.album?.name || 'album art'} className="w-24 h-24 rounded-lg object-cover shadow-lg" />
        ) : (
          <div className="w-24 h-24 rounded-lg bg-neutral-800" />
        )}

  <div className="flex-1 min-w-0">
          <div className="marquee text-2xl font-extrabold tracking-wider whitespace-nowrap overflow-hidden" style={{ fontFamily: 'ui-monospace, monospace' }}>
            <div className="marquee-inner inline-block">
              {title} — {artists}
            </div>
          </div>

          <div className="text-sm text-gray-300 mt-1">by {artists}</div>

          <div className="mt-4 relative">
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden relative" style={{ boxShadow: 'inset 0 0 12px rgba(0,0,0,0.25)' }}>
              <div className="h-3 bg-white rounded-full" style={{ width: `${pct * 100}%`, transition: 'width 0.2s linear' }} />
              {/* centered pause/play icon placeholder */}
              <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                <div className="w-6 h-6 bg-white/6 rounded-full flex items-center justify-center">
                  <div className="w-2 h-3 bg-white rounded-sm" style={{ marginRight: 4 }} />
                  <div className="w-2 h-3 bg-white rounded-sm" />
                </div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-200 mt-2">
              <span>{msToTime(progress)}</span>
              <span>{msToTime(duration)}</span>
            </div>
          </div>
        </div>
        {/* right-side lyrics panel (desktop) */}
        <div className="hidden md:block w-72 ml-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-300">Lyrics</div>
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.06)' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#1DB954" aria-hidden>
                <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm4.73 17.334c-.267.4-.8.533-1.2.267-3.467-2.133-7.8-2.133-10.8-1.067-.4.133-.867-.067-1-.467-.133-.4.067-.867.467-1 3.6-1.133 8.133-1.2 11.333 1.2.4.267.533.8.2 1.067zM17.2 13.2c-.2.333-.667.433-1 .267-2.733-1.6-6.2-1.733-8.967-.867-.333.133-.7-.067-.833-.4-.133-.333.067-.7.4-.833 2.933-.867 6.8-.733 9.467.933.333.2.433.667.133 1zM18.133 9.467c-3.133-1.867-8.6-2-11.333-1.067-.4.133-.833-.067-.967-.467-.133-.4.067-.833.467-.967 3.333-1.133 9.133-1 12.6 1.333.433.267.567.8.267 1.167-.267.333-.8.433-1.134.033z" />
              </svg>
            </div>
          </div>

          <div
            ref={lyricsContainerRef}
            className="overflow-y-auto h-40 rounded-lg lyrics-container"
            style={{ padding: '0.6rem', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.02)' }}>
            {(!lyrics || lyrics.length === 0) ? (
              <div className="text-xs text-white/40">No lyrics available.</div>
            ) : (
              lyrics.map((ln: any, i: number) => {
                const text = typeof ln === 'string' ? ln : (ln?.text ?? '');
                const isCurrent = i === currentLyricIndex;
                // if timestamped lyrics (objects with start_ms) try progressive word reveal for current line
                if (isCurrent && typeof ln !== 'string' && typeof ln.start_ms === 'number') {
                  const start = ln.start_ms;
                  const nextStart = (lyrics[i + 1]?.start_ms) ?? (duration || 180000);
                  const lineDuration = Math.max(300, nextStart - start);
                  const elapsed = Math.max(0, progress - start);
                  const frac = Math.min(1, elapsed / lineDuration);
                  const words = text.split(/\s+/).filter(Boolean);
                  const visibleCount = Math.floor(frac * words.length);
                  return (
                    <div
                      key={i}
                      ref={(el) => { if (isCurrent) currentLineRef.current = el as HTMLDivElement; }}
                      className={`py-1 text-sm transition-colors duration-150 text-white font-semibold`}
                      style={{ opacity: 1 }}>
                      {words.map((w: string, wi: number) => (
                        <span key={wi} className={`inline-block mr-1 ${wi <= visibleCount - 1 ? 'text-white' : 'text-white/30'}`} style={{ transition: 'color 160ms linear' }}>{w}</span>
                      ))}
                    </div>
                  );
                }

                return (
                  <div
                    key={i}
                    ref={(el) => { if (isCurrent) currentLineRef.current = el as HTMLDivElement; }}
                    className={`py-1 text-sm transition-colors duration-150 ${isCurrent ? 'text-white font-semibold' : 'text-white/40'}`}
                    style={{ opacity: isCurrent ? 1 : 0.35 }}>
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
  .lyrics-container::-webkit-scrollbar { width: 8px; }
  .lyrics-container::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.04); border-radius: 6px; }
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
