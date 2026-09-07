/*
  EarthVideoBackground.jsx
  ------------------------
  Cinematic Rotating Earth video background with dark readability overlay.
  Plays /assets/nexora-earth.mp4 silently on loop behind the NEXORA interface.
*/

import React, { useRef, useEffect, useState } from 'react'

function EarthVideoBackground() {
  const videoRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.defaultMuted = true

    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsLoaded(true))
        .catch(() => {
          const onUserInteraction = () => {
            if (video) {
              video.play().catch(() => {})
              setIsLoaded(true)
            }
            window.removeEventListener('click', onUserInteraction)
            window.removeEventListener('keydown', onUserInteraction)
          }
          window.addEventListener('click', onUserInteraction, { once: true })
          window.addEventListener('keydown', onUserInteraction, { once: true })
        })
    }
  }, [])

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0 select-none bg-[#020510]">
      {/* ── Rotating Earth Video ─────────────────────────────────── */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        onCanPlay={() => setIsLoaded(true)}
        style={{ transform: 'translateZ(0)', willChange: 'opacity' }}
        className={`
          absolute inset-0 w-full h-full object-cover object-center
          transition-opacity duration-700 ease-out
          ${isLoaded ? 'opacity-85' : 'opacity-0'}
        `}
      >
        <source src="/assets/nexora-earth.mp4" type="video/mp4" />
      </video>

      {/* ── Dark Cinematic Readability Overlays ─────────────────── */}
      {/* 1. Left-to-right gradient: deeper on left (sidebar/content) & open on center-right (Earth) */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#020510]/94 via-[#020510]/75 to-[#020510]/45 pointer-events-none" />

      {/* 2. Top and bottom edge darkening */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020510]/80 via-transparent to-[#020510]/85 pointer-events-none" />

      {/* 3. Soft atmospheric radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 72% 48%, transparent 20%, rgba(2, 5, 16, 0.4) 60%, rgba(2, 5, 16, 0.9) 95%)',
        }}
      />
    </div>
  )
}

export default EarthVideoBackground
