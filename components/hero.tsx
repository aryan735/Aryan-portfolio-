'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Plasma } from './ui/plasma'

export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
    hover: {
      scale: 1.05,
      boxShadow: '0 0 30px rgba(100, 200, 255, 0.6)',
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-96 h-96 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(100, 200, 255, 0.1) 0%, transparent 70%)`,
              filter: 'blur(40px)',
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: 'linear',
            }}
            initial={{ x: Math.random() * 500 - 250, y: Math.random() * 500 - 250 }}
          />
        ))}
      </div>

      {/* Cursor glow effect */}
      <motion.div
        className="pointer-events-none fixed w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(100, 200, 255, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          zIndex: 0,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 200, mass: 0.5 }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="inline-block glass px-4 py-2 rounded-full text-sm text-cyan-400 border border-cyan-500/30">
            <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse" />
            Backend Engineer
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-balance"
        >
          <span className="text-white">Hi, I'm Aryan Raj</span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
            Backend Engineer
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-gray-400 mb-8 max-w-3xl mx-auto font-light"
        >
          Building production-grade microservices with Java, Spring Boot, and cloud technologies. Specialized in event-driven architectures and scalable distributed systems.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.a
            href="#projects"
            variants={buttonVariants}
            whileHover="hover"
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold transition-all glow-cyan"
          >
            View Projects
          </motion.a>
          <motion.a
            href="#contact"
            variants={buttonVariants}
            whileHover="hover"
            className="px-8 py-3 glass text-cyan-400 rounded-lg font-semibold border border-cyan-500/50 transition-all hover:border-cyan-400"
          >
            Contact Me
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Plasma background */}
      <Plasma />
    </section>
  )
}
