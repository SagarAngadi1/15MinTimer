import React from "react";
import { motion } from "framer-motion";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  function generateWavyCirclePath(radius, amplitude, frequency, phase = 0) {
    const points = [];
    const resolution = 200; // Higher = smoother
    for (let i = 0; i <= resolution; i++) {
      const angle = (i / resolution) * 2 * Math.PI;
      const wave = amplitude * Math.sin(angle * frequency + phase);
      const r = radius + wave;
      const x = 150 + r * Math.cos(angle); // Centered at (150, 150)
      const y = 150 + r * Math.sin(angle);
      points.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
    }
    return points.join(" ") + " Z";
  }

  const [paths, setPaths] = useState({
    wave1: "",
    wave2: "",
    wave3: "",
  });

  const phase = useRef(0);

  useEffect(() => {
    const animate = () => {
      phase.current += 0.03;

      setPaths({
        wave1: generateWavyCirclePath(100, 8, 6, phase.current),
        wave2: generateWavyCirclePath(90, 6, 5, phase.current + 1),
        wave3: generateWavyCirclePath(110, 7, 7, phase.current + 2),
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Head>
        <title>15-Min Timer</title>
        <meta
          name="description"
          content="Unlock your focus with a powerful 15-minute timer philosophy."
        />
      </Head>

      {/* Cursor glow */}
      <div
        className="pointer-events-none fixed z-50 rounded-full blur-3xl mix-blend-screen"
        style={{
          top: mousePosition.y - 150,
          left: mousePosition.x - 150,
          width: 300,
          height: 300,
          background:
            "radial-gradient(circle, rgba(168,85,247,0.6), rgba(168,85,247,0.1), transparent 80%)",
        }}
      />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-32 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-br from-purple-900 via-black to-gray-900 opacity-30 animate-pulse"></div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-extrabold z-10"
        >
          The 15-Minute Focus Revolution
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-6 text-xl md:text-2xl max-w-3xl text-gray-300 z-10"
        >
          Science meets simplicity. Boost your productivity, creativity, and
          discipline—15 minutes at a time.
        </motion.p>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="relative w-64 h-64 mt-8 flex items-center justify-center"
        >
          <svg
            viewBox="0 0 300 300"
            className="absolute top-0 left-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={paths.wave1}
              fill="none"
              stroke="#a855f7" // purple-500
              strokeWidth="2"
              className="wave-path"
            />
            <path
              d={paths.wave2}
              fill="none"
              stroke="#22d3ee" // cyan-400
              strokeWidth="1.5"
              className="wave-path"
            />
            <path
              d={paths.wave3}
              fill="none"
              stroke="#f472b6" // pink-400
              strokeWidth="1.5"
              className="wave-path"
            />
          </svg>

          {/* Timer Text */}
          <div className="text-4xl text-white font-bold z-10">15:00</div>
        </motion.div>
      </section>
    </div>
  );
}
