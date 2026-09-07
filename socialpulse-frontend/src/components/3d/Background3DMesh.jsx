/*
  Background3DMesh.jsx
  --------------------
  Interactive 60fps GPU-accelerated 3D Neural Constellation & Depth Mesh.
  Renders continuous rotating 3D coordinate nodes in perspective space with
  ambient connecting lines, mouse parallax interactivity, and zero external dependencies.
*/

import React, { useRef, useEffect } from 'react'

function Background3DMesh() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Mouse tracking for 3D parallax
    let targetRotX = 0
    let targetRotY = 0
    let rotX = 0
    let rotY = 0

    const handleMouseMove = (e) => {
      const normX = (e.clientX / width) * 2 - 1
      const normY = (e.clientY / height) * 2 - 1
      targetRotX = normY * 0.4
      targetRotY = normX * 0.5
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Generate 95 3D points in a sphere/cluster volume with depth
    const POINT_COUNT = 95
    const points = []
    const RADIUS = Math.min(width, height) * 0.48

    for (let i = 0; i < POINT_COUNT; i++) {
      // Golden spiral distribution on sphere
      const phi = Math.acos(1 - 2 * (i + 0.5) / POINT_COUNT)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const r = RADIUS * (0.35 + (i % 5) * 0.15)

      points.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        baseColor: i % 3 === 0 ? 'rgba(76, 215, 246,' : i % 3 === 1 ? 'rgba(221, 183, 255,' : 'rgba(78, 222, 163,',
        size: 1.8 + (i % 4) * 0.8,
        pulseSpeed: 0.02 + (i % 6) * 0.008,
      })
    }

    let angle = 0

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Smooth camera interpolation
      rotX += (targetRotX - rotX) * 0.04
      rotY += (targetRotY - rotY) * 0.04
      angle += 0.0028

      const cosY = Math.cos(angle + rotY)
      const sinY = Math.sin(angle + rotY)
      const cosX = Math.cos(rotX)
      const sinX = Math.sin(rotX)

      const fov = 650
      const centerX = width * 0.52
      const centerY = height * 0.48

      const projected = []

      // Project all 3D points to 2D
      for (let i = 0; i < points.length; i++) {
        const p = points[i]

        // Rotation around Y
        const x1 = p.x * cosY - p.z * sinY
        const z1 = p.z * cosY + p.x * sinY

        // Rotation around X
        const y2 = p.y * cosX - z1 * sinX
        const z2 = z1 * cosX + p.y * sinX

        // Depth perspective
        const distance = fov + z2
        if (distance > 60) {
          const scale = fov / distance
          const projX = centerX + x1 * scale
          const projY = centerY + y2 * scale
          const alpha = Math.max(0.18, Math.min(0.95, (z2 + RADIUS) / (1.8 * RADIUS)))

          projected.push({
            x: projX,
            y: projY,
            z: z2,
            scale,
            alpha,
            baseColor: p.baseColor,
            size: p.size * scale,
            pulseSpeed: p.pulseSpeed,
          })
        }
      }

      // Draw connection lines between nearby 3D points
      const maxDist = 145
      ctx.lineWidth = 1.0

      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i]
          const p2 = projected[j]

          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.32 * Math.min(p1.alpha, p2.alpha)
            ctx.strokeStyle = `rgba(76, 215, 246, ${lineAlpha})`
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      // Draw glowing 3D nodes
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i]
        const radius = Math.max(1.2, p.size)

        // Radial glow
        const glowRadius = radius * 3.5
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius)
        gradient.addColorStop(0, `${p.baseColor} ${p.alpha})`)
        gradient.addColorStop(0.4, `${p.baseColor} ${p.alpha * 0.45})`)
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2)
        ctx.fill()

        // Core luminous dot
        ctx.fillStyle = `${p.baseColor} ${Math.min(1, p.alpha * 1.5)})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-90 transition-opacity duration-1000"
    />
  )
}

export default Background3DMesh
