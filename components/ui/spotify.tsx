"use client";

import React, { useEffect, useRef, useState } from 'react';

type SpotifyItem = any;

interface Lyric {
  time: number; // seconds
  lyric: string;
}

export default function SpotifyNowPlaying() {
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [progress, setProgress] = useState(0); // ms
  const progressRef = useRef<number>(0);

  const [lyricIndex, setLyricIndex] = useState<number>(-1);

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
      setProgress(json?.progress_ms ?? 0);
      progressRef.current = json?.progress_ms ?? 0;
    } catch (e: any) {
      setError(e?.message || 'fetch error');
      setData(null);
    }
  }

  useEffect(() => {
    fetchNow();
    const iv = window.setInterval(fetchNow, 3000);
    return () => window.clearInterval(iv);
  }, []);

  // RAF based tick to keep smooth progress and compute lyric index
  useEffect(() => {
    let lastUpdate = Date.now();
    let lastSecond = -1;
    let lastLyric = -1;

    const tick = () => {
      const now = Date.now();
      const delta = now - lastUpdate;
      lastUpdate = now;

      if (data && data.is_playing) {
        progressRef.current = Math.min(progressRef.current + delta, data.item?.duration_ms ?? Infinity);
        const seconds = Math.floor(progressRef.current / 1000);
        if (seconds !== lastSecond) {
          lastSecond = seconds;
          setProgress(progressRef.current);
        }
      }

      // lyrics handling
      const lyrics: Lyric[] | null = data?.lyrics ?? null;
      if (lyrics && lyrics.length > 0) {
        const found = getLyricByTime(lyrics, progressRef.current / 1000);
        const idx = found ? found.index : -1;
        if (idx !== lastLyric) {
          lastLyric = idx;
          setLyricIndex(idx);
        }
      }

      requestAnimationFrame(tick);
    };

    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [data]);

  if (error) {
    return (
      <div className="spotify-player opacity-80 text-sm text-muted">
        <p className="text-xs">{error}</p>
      </div>
    );
  }

  if (!data || !data.item) {
    return (
      <div className="spotify-player opacity-80 text-sm text-muted">
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
    <div
      className="spotify-player relative max-w-full rounded-lg overflow-hidden bg-shark-mid/30 backdrop-blur-sm ring-1 ring-shark-light/10 p-2 text-white"
      style={{ boxShadow: 'inset 0 6px 20px rgba(0,0,0,0.65), inset 0 -3px 8px rgba(255,255,255,0.02)' }}
    >
      <div className="flex items-center gap-4">
        <a className="track-image" href={item.external_urls?.spotify ?? '#'}>
          {albumArt ? (
            <img src={albumArt} alt={item.album?.name || 'album art'} className="w-20 h-20 rounded-md object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-md bg-neutral-800" />
          )}
          <div className="track-image-link" aria-hidden>
            {/* simple overlay icon placeholder */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 3v2a1 1 0 0 0 1 1h4v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7V3h2z" fill="white" fillOpacity="0.9" />
            </svg>
          </div>
        </a>

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

      {/* lyrics pane (absolute, on the right) */}
      <div className="track-lyrics" data-has-lyrics={Array.isArray(data?.lyrics) && data.lyrics.length > 0}>
        {
          Array.isArray(data?.lyrics) && data.lyrics.map((l: Lyric, i: number) => {
            const isPlaying = i === lyricIndex;
            const isAround = i === lyricIndex + 1;
            return (
              <div key={l.time} className={['track-lyric', isPlaying ? 'track-lyric-playing' : '', isAround ? 'track-lyric-around-playing' : ''].join(' ')}>
                {l.lyric}
              </div>
            );
          })
        }
      </div>

      <style>{`
        .marquee { height: 1.4em; }
        .marquee-inner { padding-left: 100%; animation: marquee 12s linear infinite; }
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-100%); } }

        /* track image overlay */
        .track-image { height: 80px; width: 80px; position: relative; display: inline-block; }
        .track-image img { height: 80px; width: 80px; display: block; border-radius: 8px; }
        .track-image-link { width: 100%; height: 100%; position: absolute; left: 0; top: 0; opacity: 0; background-color: rgba(0,0,0,0.5); border-radius: 8px; transition: opacity 0.1s linear; display: flex; justify-content: center; align-items: center; }
        .track-image:hover > .track-image-link { opacity: 1; }

        /* lyrics */
        .track-lyrics { position: absolute; right: calc(0.8em * 2 + 24px); top: 0.8em; text-align: right; user-select: none; display: flex; flex-direction: column; gap: 0.2rem; max-width: 40%; word-wrap: break-word; transition: translate 0.2s ease-in-out, opacity 1s ease-in-out; }
        @media (max-width: 640px) { .track-lyrics { display: none; } }

        .track-lyric { opacity: 0.2; line-height: 1.2rem; text-transform: lowercase; font-style: italic; filter: blur(2px); transition: opacity 0.2s ease-in-out, font-size 0.2s ease-in-out, filter 0.2s ease-in-out; }
        .track-lyric-playing { opacity: 1; line-height: 1.2rem; filter: blur(0px); }
        .track-lyric-around-playing { filter: blur(1px); }

        .track-progress { border-radius: 100px; background-color: #323232; }
        .track-progress .track-progress-completed { height: 4px; border-radius: 100px; background-color: white; transition: width 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}

function msToTime(ms: number) {
  if (ms === null || ms === undefined) return '--:--';
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function getLyricByTime(lyrics: Lyric[], time: number) {
  for (let i = lyrics.length - 1; i >= 0; i--) {
    if (time >= lyrics[i].time) {
      return { entry: lyrics[i], index: i };
    }
  }
  return null;
}
