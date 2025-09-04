"use client";
"use client";

import React, { FC, useEffect, useRef, useState } from 'react';
import clsx from 'clsx'

type Lyric = { time: number; lyric: string }

type TrackData = {
  id: string
  album: { name: string; image: string }
  artists: string[]
  name: string
  url?: string
  playing?: boolean
  progress?: number // seconds
  total?: number // seconds
  lyrics?: Lyric[] | null
}

const getLyricByTime = (lyrics: Lyric[], time: number) => {
  for (let i = lyrics.length - 1; i >= 0; i--) {
    if (time >= lyrics[i].time) return { entry: lyrics[i], index: i }
  }
  return null
}

const API_URL = '' // same-origin

const TrackImage: FC<{ data: TrackData }> = ({ data }) => (
  <a className="track-image" href={data.url ?? '#'}>
    <img src={data.album.image} alt={data.album.name} />
    <div className="track-image-link" />
  </a>
)

const TrackInfo: FC<{ data: TrackData; progress: number }> = ({ data, progress }) => {
  const formatTime = (s: number | undefined) => {
    if (s === undefined || s === null) return '--:--'
    const total = Math.floor(s)
    const m = Math.floor(total / 60)
    const sec = total % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="track-info">
      <div className="track-data-container">
        <div className="track-text-info">
          <p className="track-name"><b>{data.name}</b></p>
          <p className="track-artists"><span className="text-half-visible">by</span> {data.artists.join(', ')}</p>
        </div>
        <div className="track-button">♪</div>
      </div>

      <div className="track-timer">
        <div className="track-time">
          <div className="track-time-elapsed">{formatTime(progress)}</div>
          <div>{data.playing ? '▶' : '▮▮'}</div>
          <div className="track-time-remaining">{formatTime(data.total)}</div>
        </div>

        <div className="track-progress">
          <div className="track-progress-completed" style={{ width: `${Math.min(progress / (data.total ?? 1) * 100, 100)}%` }} />
        </div>
      </div>
    </div>
  )
}

const TrackLyrics: FC<{ lyrics: Lyric[] | null; index: number }> = ({ lyrics, index }) => {
  const parentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!parentRef.current) return
    const children = [...parentRef.current.children] as HTMLElement[]
    if (children.length === 0) {
      parentRef.current.style.translate = `0 0px`
      return
    }
    const heights = children.map((c) => c.offsetTop)
    const neededOffset = heights[Math.max(0, Math.min(index, heights.length - 1))] || 0
    parentRef.current.style.translate = `0 -${neededOffset}px`
  }, [index])

  return (
    <div className="track-lyrics" ref={parentRef} data-has-lyrics={lyrics !== null && (lyrics?.length ?? 0) > 0}>
      {lyrics?.map(({ time, lyric }, i) => {
        const isPlaying = i === index
        const isAround = i === index + 1
        return (
          <div key={time} className={clsx('track-lyric', isPlaying && 'track-lyric-playing', isAround && 'track-lyric-around-playing')}>
            {lyric}
          </div>
        )
      })}
    </div>
  )
}

export default function SpotifyNowPlaying() {
  const [loading, setLoading] = useState(true)
  const [trackData, setTrackData] = useState<TrackData | null>(null)
  const progressRef = useRef<number>(0)
  const [progressSeconds, setProgressSeconds] = useState(0)
  const [lyricIndex, setLyricIndex] = useState(0)
  const pollingRef = useRef<number | null>(null)

  // Try SSE first; if the endpoint doesn't exist (404) EventSource will error
  // and we fallback to simple polling of /api/spotify/current.
  useEffect(() => {
    let sse: EventSource | null = null
    let didFallback = false

    const fetchNow = async () => {
      try {
        const res = await fetch('/api/spotify/current')
        const json = await res.json()
        if (res.ok) {
          setLoading(false)
          setTrackData(json)
          progressRef.current = (json.progress ?? json.progress_ms ?? 0)
          setProgressSeconds(Math.floor((json.progress ?? json.progress_ms ?? 0) / 1000))
        }
      } catch (e) {
        // ignore fetch errors during polling
      }
    }

    try {
      sse = new EventSource(`${API_URL}/api/spotify`)

      const handle = (ev: MessageEvent<string>) => {
        try {
          const parsed = JSON.parse(ev.data) as any
          setLoading(false)
          setTrackData(parsed)
          progressRef.current = parsed.progress ?? parsed.progress_ms ?? 0
          setProgressSeconds(Math.floor((parsed.progress ?? parsed.progress_ms ?? 0) / 1000))
        } catch (e) {
          // ignore parse errors
        }
      }

      sse.addEventListener('track:current', handle)
      sse.addEventListener('track:play', handle)
      sse.addEventListener('track:pause', handle)
      sse.addEventListener('track:resume', handle)

      sse.onerror = () => {
        // connection failed (likely 404) — close SSE and start polling
        if (sse) {
          try { sse.close() } catch (e) {}
          sse = null
        }
        if (!didFallback) {
          didFallback = true
          fetchNow()
          pollingRef.current = window.setInterval(fetchNow, 3000)
        }
      }
    } catch (e) {
      // EventSource construction failed — fallback to polling
      fetchNow()
      pollingRef.current = window.setInterval(fetchNow, 3000)
    }

    return () => {
      if (sse) {
        try { sse.close() } catch (e) {}
      }
      if (pollingRef.current) {
        window.clearInterval(pollingRef.current)
        pollingRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    let lastSecond = 0
    let lastLyricIndex = 0
    let lastUpdateTime = Date.now()
    let animationFrameID: number | null = null

    const tick = () => {
      if (trackData?.playing) {
        const delta = Date.now() - lastUpdateTime
        progressRef.current = Math.min(progressRef.current + delta, (trackData.total ?? 0) * 1000)
        const seconds = Math.floor(progressRef.current / 1000)
        if (seconds !== lastSecond) {
          lastSecond = seconds
          setProgressSeconds(seconds)
        }
      }

      if (trackData?.lyrics) {
        const found = getLyricByTime(trackData.lyrics as Lyric[], progressRef.current / 1000)
        if (found === null) {
          lastLyricIndex = -1
          setLyricIndex(-1)
        } else if (lastLyricIndex !== found.index) {
          lastLyricIndex = found.index
          setLyricIndex(found.index)
        }
      }

      lastUpdateTime = Date.now()
      animationFrameID = requestAnimationFrame(tick)
    }

    animationFrameID = requestAnimationFrame(tick)
    return () => { if (animationFrameID !== null) cancelAnimationFrame(animationFrameID) }
  }, [trackData])

  const renderInnerContent = () => {
    if (loading) return <p>loading track data...</p>
    if (trackData === null) return (
      <div className="no-track-playing">
        <p>no track is playing...</p>
        <p className="text-small text-half-visible">perhaps try checking out later?</p>
      </div>
    )

    return (
      <>
        <img className="track-background" src={trackData.album.image} alt={trackData.album.name} />
        <TrackLyrics lyrics={trackData.lyrics ?? null} index={lyricIndex} />
        <TrackImage data={trackData} />
        <TrackInfo data={trackData} progress={progressSeconds} />
      </>
    )
  }

  return (
    <div className={clsx('spotify-track', loading && 'loading')}>
      {renderInnerContent()}

      <style>{`
        /* marquee */
        .marquee { height: 1.4em; }
        .marquee-inner { padding-left: 100%; animation: marquee 12s linear infinite; }
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-100%); } }

        /* track image */
        .track-image { height: 100px; width: 100px; position: relative; }
        .track-image img { height: 100px; width: 100px; border-radius: 8px; display:block }
        .track-image-link { position: absolute; inset: 0; opacity: 0; background-color: rgba(0,0,0,0.5); border-radius: 8px; display:flex; align-items:center; justify-content:center; transition: opacity 0.12s linear }
        .track-image:hover > .track-image-link { opacity: 1 }

        /* lyrics */
        .track-lyrics { position: absolute; right: calc(0.8em * 2 + 24px); top: 0.8em; text-align: right; user-select: none; display:flex; flex-direction:column; gap:0.2rem; max-width:40%; word-wrap:break-word; transition: translate 0.2s ease-in-out, opacity 1s ease-in-out }
        @media (max-width: 640px) { .track-lyrics { display: none } }
        .track-lyric { opacity: 0.2; line-height: 1.2rem; text-transform: lowercase; font-style: italic; filter: blur(2px); transition: opacity 0.2s ease-in-out, font-size 0.2s ease-in-out, filter 0.2s ease-in-out }
        .track-lyric-playing { opacity: 1; filter: blur(0) }
        .track-lyric-around-playing { filter: blur(1px) }
        .track-lyrics[data-has-lyrics="true"] { opacity: 1 }
        .track-lyrics[data-has-lyrics="false"] { opacity: 0 }

        /* progress / info */
        .track-info { display:flex; flex-direction:column; justify-content:space-between; width:100%; padding:2px }
        .track-data-container { display:flex; flex-direction:row; justify-content:space-between }
        .spotify-track .track-name { font-size:120% }
        .track-artists { font-size:80% }
        .track-timer { display:flex; flex-direction:column; gap:0.2em }
        .track-time { display:flex; flex-direction:row; justify-content:space-between; font-size:80% }
        .track-progress { border-radius:100px; background-color: #323232 }
        .track-progress .track-progress-completed { height:4px; border-radius:100px; background-color:white; transition: width 0.5s ease-in-out }

        /* subtle blurred background */
        .track-background { position:absolute; left:0; top:0; width:100%; height:100%; object-fit:cover; opacity:0.06; filter: blur(8px); pointer-events:none }

        /* container emboss (same as your shoutbox) */
        .spotify-track { box-shadow: inset 0 6px 20px rgba(0,0,0,0.65), inset 0 -3px 8px rgba(255,255,255,0.02); border-radius: 8px; padding: 0.5rem; }
      `}</style>
    </div>
  )
}
