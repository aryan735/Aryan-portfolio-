'use client'

import React, { useEffect, useRef } from 'react'

interface PlasmaProps {
  className?: string
}

export function Plasma({ className = '' }: PlasmaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const drawPlasma = () => {
      time += 0.005
      const width = canvas.width
      const height = canvas.height

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, '#0a0a0a')
      gradient.addColorStop(0.5, '#1a0033')
      gradient.addColorStop(1, '#0f0f2e')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Draw plasma effect using multiple sine waves
      ctx.globalAlpha = 0.8

      for (let i = 0; i < 3; i++) {
        const hue = (time * 50 + i * 120) % 360
        ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.2)`

        for (let x = 0; x < width; x += 4) {
          const y1 =
            Math.sin((x * 0.01 + time * 2) * Math.PI) * 50 +
            Math.sin((x * 0.005 + time) * Math.PI) * 30 +
            height * 0.3 +
            i * 80

          const y2 =
            Math.sin((x * 0.01 + time * 2.5) * Math.PI) * 50 +
            Math.sin((x * 0.005 + time * 1.5) * Math.PI) * 30 +
            height * 0.3 +
            i * 80 +
            100

          ctx.beginPath()
          ctx.moveTo(x, y1)
          ctx.lineTo(x + 4, y1)
          ctx.lineTo(x + 4, y2)
          ctx.lineTo(x, y2)
          ctx.fill()
        }
      }

      // Add radial gradient glow at center
      const radialGradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height)
      )
      radialGradient.addColorStop(0, `hsla(${(time * 50) % 360}, 100%, 50%, 0.1)`)
      radialGradient.addColorStop(1, 'transparent')

      ctx.globalAlpha = 1
      ctx.fillStyle = radialGradient
      ctx.fillRect(0, 0, width, height)

      animationFrameId = requestAnimationFrame(drawPlasma)
    }

    drawPlasma()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
    />
  )
}
