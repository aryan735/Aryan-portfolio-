import React from 'react'

interface DotGridProps {
  dotSize?: number
  gap?: number
  color?: string
  opacity?: number
}

export function DotGrid({
  dotSize = 2,
  gap = 30,
  color = '#22d3ee',
  opacity = 0.15,
}: DotGridProps) {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        backgroundImage: `radial-gradient(circle, ${color} ${dotSize}px, transparent ${dotSize}px)`,
        backgroundSize: `${gap}px ${gap}px`,
        backgroundPosition: '0 0',
        opacity: opacity,
        zIndex: 1,
      }}
    />
  )
}
