/*
  CyberGlobe3D.jsx
  ----------------
  Interactive 3D Holographic Wireframe Intelligence Globe.
  Pure HTML5 Canvas 3D projection engine:
  - Rotating 3D longitude & latitude wireframe rings
  - Orbiting telemetry data satellite particles
  - Real-time global intelligence sensor nodes
  - Smooth interactive mouse drag & hover rotation
  - Zero external dependencies, pure 60fps hardware accelerated
*/

import React, { useRef, useEffect, useState } from 'react'

function CyberGlobe3D({ size = 260, showLabels = true }) {
  const canvasRef = useRef(null)
  const isDraggingRef = useRef(false)
  const mouseRef = useRef({ x: 0, y: 0, lastX: 0, lastY: 0 })
  const rotationRef = useRef({ x: 0.25, y: 0, vx: 0.002, vy: 0.005 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const RADIUS = size * 0.38
    const CENTER = size / 2

    // 6 Intelligence Core Nodes positioned at 3D spherical angles (lat, lon)
    const CORE_HUBS = [
      { name: 'X / Firehose', lat: 37, lon: -122, color: '#4cd7f6' },
      { name: 'Telegram MTProto', lat: 55, lon: 37, color: '#0088cc' },
      { name: 'Bengaluru Tech', lat: 12.9, lon: 77.5, color: '#4edea3' },
      { name: 'YouTube Stream', lat: 35.6, lon: 139.6, color: '#f43f5e' },
      { name: 'Reddit Swarm', lat: 51.5, lon: -0.12, color: '#f59e0b' },
      { name: 'Visual Media Hub', lat: 40.7, lon: -74, color: '#ddb7ff' },
    ]

    // Convert lat/lon to 3D Cartesian coordinates
    const hubPoints = CORE_HUBS.map(h => {
      const phi = (90 - h.lat) * (Math.PI / 180)
      const theta = (h.lon + 180) * (Math.PI / 180)
      return {
        ...h,
        x: -(RADIUS * Math.sin(phi) * Math.cos(theta)),
        y: RADIUS * Math.cos(phi),
        z: RADIUS * Math.sin(phi) * Math.sin(theta),
      }
    })

    // Orbiting telemetry particles
    const SATELLITES = Array.from({ length: 16 }, (_, i) => ({
      angle: (i / 16) * Math.PI * 2,
      speed: 0.015 + (i % 3) * 0.005,
      radius: RADIUS * (1.15 + (i % 3) * 0.08),
      tilt: 0.35 + (i % 4) * 0.2,
      color: i % 2 === 0 ? '#4cd7f6' : '#ddb7ff',
    }))

    // Generate latitude wireframe rings
    const latRings = []
    const LAT_STEPS = 6
    for (let i = 1; i < LAT_STEPS; i++) {
      const phi = (i / LAT_STEPS) * Math.PI
      const ringRadius = RADIUS * Math.sin(phi)
      const y = RADIUS * Math.cos(phi)
      const points = []
      const SEGMENTS = 32
      for (let j = 0; j <= SEGMENTS; j++) {
        const theta = (j / SEGMENTS) * Math.PI * 2
        points.push({
          x: ringRadius * Math.cos(theta),
          y: y,
          z: ringRadius * Math.sin(theta),
        })
      }
      latRings.push(points)
    }

    // Generate longitude wireframe meridians
    const lonRings = []
    const LON_STEPS = 8
    for (let i = 0; i < LON_STEPS; i++) {
      const theta = (i / LON_STEPS) * Math.PI
      const points = []
      const SEGMENTS = 36
      for (let j = 0; j <= SEGMENTS; j++) {
        const phi = (j / SEGMENTS) * Math.PI * 2
        points.push({
          x: RADIUS * Math.sin(phi) * Math.cos(theta),
          y: RADIUS * Math.cos(phi),
          z: RADIUS * Math.sin(phi) * Math.sin(theta),
        })
      }
      lonRings.push(points)
    }

    const project = (x, y, z, rotX, rotY) => {
      // Rotate around Y
      const cosY = Math.cos(rotY)
      const sinY = Math.sin(rotY)
      const x1 = x * cosY - z * sinY
      const z1 = z * cosY + x * sinY

      // Rotate around X
      const cosX = Math.cos(rotX)
      const sinX = Math.sin(rotX)
      const y2 = y * cosX - z1 * sinX
      const z2 = z1 * cosX + y * sinX

      const fov = 400
      const scale = fov / (fov + z2)
      return {
        x: CENTER + x1 * scale,
        y: CENTER + y2 * scale,
        z: z2,
        scale,
      }
    }

    let scanAngle = 0

    const render = () => {
      ctx.clearRect(0, 0, size, size)

      // Inertia & continuous planetary 3D rotation
      if (!isDraggingRef.current) {
        const idleVy = 0.0038
        rotationRef.current.vy = rotationRef.current.vy * 0.96 + idleVy * 0.04
        rotationRef.current.vx = rotationRef.current.vx * 0.96
        rotationRef.current.y += rotationRef.current.vy
        rotationRef.current.x += rotationRef.current.vx
      }

      const rotX = rotationRef.current.x
      const rotY = rotationRef.current.y
      scanAngle += 0.02

      // Draw outer ambient glow
      const outerGrad = ctx.createRadialGradient(CENTER, CENTER, RADIUS * 0.6, CENTER, CENTER, RADIUS * 1.35)
      outerGrad.addColorStop(0, 'rgba(76, 215, 246, 0.08)')
      outerGrad.addColorStop(0.7, 'rgba(221, 183, 255, 0.03)')
      outerGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = outerGrad
      ctx.beginPath()
      ctx.arc(CENTER, CENTER, RADIUS * 1.35, 0, Math.PI * 2)
      ctx.fill()

      // Draw outer boundary halo
      ctx.strokeStyle = 'rgba(76, 215, 246, 0.2)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2)
      ctx.stroke()

      // 1. Draw wireframe latitude rings
      latRings.forEach(ring => {
        ctx.beginPath()
        let started = false
        ring.forEach(pt => {
          const p = project(pt.x, pt.y, pt.z, rotX, rotY)
          const alpha = p.z > 0 ? 0.28 : 0.08
          ctx.strokeStyle = `rgba(76, 215, 246, ${alpha})`
          if (!started) {
            ctx.moveTo(p.x, p.y)
            started = true
          } else {
            ctx.lineTo(p.x, p.y)
          }
        })
        ctx.stroke()
      })

      // 2. Draw wireframe longitude meridians
      lonRings.forEach(ring => {
        ctx.beginPath()
        let started = false
        ring.forEach(pt => {
          const p = project(pt.x, pt.y, pt.z, rotX, rotY)
          const alpha = p.z > 0 ? 0.24 : 0.06
          ctx.strokeStyle = `rgba(221, 183, 255, ${alpha})`
          if (!started) {
            ctx.moveTo(p.x, p.y)
            started = true
          } else {
            ctx.lineTo(p.x, p.y)
          }
        })
        ctx.stroke()
      })

      // 3. Draw Orbiting Telemetry Satellites
      SATELLITES.forEach(sat => {
        sat.angle += sat.speed
        const satX = sat.radius * Math.cos(sat.angle)
        const satY = sat.radius * Math.sin(sat.angle) * Math.sin(sat.tilt)
        const satZ = sat.radius * Math.sin(sat.angle) * Math.cos(sat.tilt)

        const p = project(satX, satY, satZ, rotX, rotY)
        if (p.z > -20) {
          ctx.fillStyle = sat.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, 2 * p.scale, 0, Math.PI * 2)
          ctx.fill()

          // Satellite glow
          ctx.fillStyle = sat.color + '44'
          ctx.beginPath()
          ctx.arc(p.x, p.y, 5 * p.scale, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      // 4. Draw Sensor Hub Nodes
      const projectedHubs = hubPoints.map(h => ({
        ...h,
        proj: project(h.x, h.y, h.z, rotX, rotY),
      }))

      // Sort by Z so front hubs draw on top
      projectedHubs.sort((a, b) => b.proj.z - a.proj.z)

      projectedHubs.forEach(hub => {
        const p = hub.proj
        const isFront = p.z > 0

        if (isFront) {
          // Connecting ray to center
          ctx.strokeStyle = hub.color + '33'
          ctx.lineWidth = 0.8
          ctx.beginPath()
          ctx.moveTo(CENTER, CENTER)
          ctx.lineTo(p.x, p.y)
          ctx.stroke()

          // Pulse ring
          const pulseR = (4 + Math.sin(scanAngle * 3) * 2) * p.scale
          ctx.strokeStyle = hub.color
          ctx.lineWidth = 1.2
          ctx.beginPath()
          ctx.arc(p.x, p.y, pulseR, 0, Math.PI * 2)
          ctx.stroke()

          // Solid core
          ctx.fillStyle = hub.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, 3 * p.scale, 0, Math.PI * 2)
          ctx.fill()

          // Text label
          if (showLabels && p.z > 20) {
            ctx.font = '9px "JetBrains Mono", monospace'
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
            ctx.fillText(hub.name, p.x + 8, p.y + 3)
          }
        } else {
          // Dim back node
          ctx.fillStyle = hub.color + '33'
          ctx.beginPath()
          ctx.arc(p.x, p.y, 1.8 * p.scale, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      // 5. Radar Scanline Sweep Arc
      const scanX = CENTER + Math.cos(scanAngle) * RADIUS
      const scanY = CENTER + Math.sin(scanAngle) * RADIUS
      const scanGrad = ctx.createLinearGradient(CENTER, CENTER, scanX, scanY)
      scanGrad.addColorStop(0, 'rgba(76, 215, 246, 0.4)')
      scanGrad.addColorStop(1, 'rgba(76, 215, 246, 0)')
      ctx.strokeStyle = scanGrad
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(CENTER, CENTER)
      ctx.lineTo(scanX, scanY)
      ctx.stroke()

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    // Mouse interactive drag to rotate
    const onMouseDown = (e) => {
      isDraggingRef.current = true
      mouseRef.current.lastX = e.clientX
      mouseRef.current.lastY = e.clientY
    }

    const onMouseMove = (e) => {
      if (!isDraggingRef.current) return
      const dx = e.clientX - mouseRef.current.lastX
      const dy = e.clientY - mouseRef.current.lastY
      rotationRef.current.y += dx * 0.008
      rotationRef.current.x += dy * 0.008
      rotationRef.current.vy = dx * 0.003
      rotationRef.current.vx = dy * 0.003
      mouseRef.current.lastX = e.clientX
      mouseRef.current.lastY = e.clientY
    }

    const onMouseUp = () => {
      isDraggingRef.current = false
    }

    const el = canvas
    el.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    // Touch event listeners for mobile / touchscreen laptops
    const onTouchStart = (e) => {
      if (e.touches && e.touches.length === 1) {
        isDraggingRef.current = true
        mouseRef.current.lastX = e.touches[0].clientX
        mouseRef.current.lastY = e.touches[0].clientY
      }
    }

    const onTouchMove = (e) => {
      if (!isDraggingRef.current || !e.touches || e.touches.length !== 1) return
      const dx = e.touches[0].clientX - mouseRef.current.lastX
      const dy = e.touches[0].clientY - mouseRef.current.lastY
      rotationRef.current.y += dx * 0.008
      rotationRef.current.x += dy * 0.008
      rotationRef.current.vy = dx * 0.003
      rotationRef.current.vx = dy * 0.003
      mouseRef.current.lastX = e.touches[0].clientX
      mouseRef.current.lastY = e.touches[0].clientY
    }

    const onTouchEnd = () => {
      isDraggingRef.current = false
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)

    return () => {
      el.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      el.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      cancelAnimationFrame(animationFrameId)
    }
  }, [size, showLabels])

  return (
    <div className="relative inline-flex items-center justify-center cursor-grab active:cursor-grabbing group select-none">
      <canvas
        ref={canvasRef}
        style={{ width: `${size}px`, height: `${size}px` }}
        className="transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute -bottom-1 text-[9px] font-mono text-cyan-400/70 tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none">
        DRAG TO ORBIT 3D SENSORS
      </div>
    </div>
  )
}

export default CyberGlobe3D
