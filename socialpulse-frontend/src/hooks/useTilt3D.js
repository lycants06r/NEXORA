/*
  useTilt3D.js
  ------------
  Interactive 3D Perspective Tilt & Dynamic Specular Sheen Hook.
  - Smooth 3D tilt responding in real-time to cursor coordinates.
  - Dynamic liquid-glass light reflection / sheen that glides across the card surface.
  - Fixes touch screen detection so Windows laptops with touch support still tilt on mouse.
  - Fully GPU accelerated via CSS 3D matrix transforms and direct style updates.
*/

import { useRef, useEffect } from 'react'

export function useTilt3D({ maxTilt = 8, scale = 1.02, glare = true } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Only disable on touch-only mobile screens (NOT laptops with touchscreen)
    const isTouchOnly = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (isTouchOnly) return

    // Ensure parent has 3D perspective setup
    el.style.transformStyle = 'preserve-3d'
    el.style.willChange = 'transform'

    // Create glare sheen overlay if enabled
    let glareEl = null
    if (glare && !el.querySelector('.card-3d-glare')) {
      glareEl = document.createElement('div')
      glareEl.className = 'card-3d-glare'
      glareEl.style.position = 'absolute'
      glareEl.style.top = '0'
      glareEl.style.left = '0'
      glareEl.style.right = '0'
      glareEl.style.bottom = '0'
      glareEl.style.pointerEvents = 'none'
      glareEl.style.borderRadius = 'inherit'
      glareEl.style.opacity = '0'
      glareEl.style.transition = 'opacity 0.25s ease-out'
      glareEl.style.zIndex = '5'
      glareEl.style.mixBlendMode = 'overlay'
      el.appendChild(glareEl)
    } else {
      glareEl = el.querySelector('.card-3d-glare')
    }

    let isHovered = false

    const onMouseEnter = () => {
      isHovered = true
      el.style.transition = 'transform 0.12s ease-out, box-shadow 0.2s ease-out'
      if (glareEl) glareEl.style.opacity = '1'
    }

    const onMouseMove = (e) => {
      if (!isHovered) return
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      // Calculate normalized delta (-1 to 1)
      const deltaX = (x - centerX) / centerX
      const deltaY = (y - centerY) / centerY

      // Calculate 3D tilt rotation
      const rotateX = (-deltaY * maxTilt).toFixed(2)
      const rotateY = (deltaX * maxTilt).toFixed(2)

      el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, 1)`

      // Move specular sheen reflection
      if (glareEl) {
        const glareX = (x / rect.width) * 100
        const glareY = (y / rect.height) * 100
        glareEl.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.25) 0%, rgba(76, 215, 246, 0.15) 30%, rgba(0, 0, 0, 0) 70%)`
      }
    }

    const onMouseLeave = () => {
      isHovered = false
      el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
      if (glareEl) glareEl.style.opacity = '0'
    }

    el.addEventListener('mouseenter', onMouseEnter)
    el.addEventListener('mousemove', onMouseMove)
    el.addEventListener('mouseleave', onMouseLeave)

    return () => {
      el.removeEventListener('mouseenter', onMouseEnter)
      el.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('mouseleave', onMouseLeave)
      if (glareEl && glareEl.parentNode === el) {
        el.removeChild(glareEl)
      }
    }
  }, [maxTilt, scale, glare])

  return ref
}

export default useTilt3D
