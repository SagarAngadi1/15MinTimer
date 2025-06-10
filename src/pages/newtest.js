// import { useScroll, useTransform, motion } from 'framer-motion';
// import { useRef } from 'react';

// export default function HeroSection() {
//   const ref = useRef(null);
//   const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

//   // Transform the scale and Y position of the person
//   const scale = useTransform(scrollYProgress, [0, 1], [1.2, 0.6]);
//   const y = useTransform(scrollYProgress, [0, 1], [150, 0]);
//   const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

//   return (
//     <section ref={ref} className="relative h-[400vh] overflow-hidden">
//       {/* Background */}
//       <img
//         src="background.png"
//         className="fixed top-0 left-0 w-full h-full object-cover z-0 object-[50%_50%]"
//         alt="Background Scene"
//       />

//       {/* Person */}
//       <motion.img
//         src="personback.png"
//         className="fixed top-1/2 left-1/2 w-48 md:w-72 z-10 -translate-x-1/2 -translate-y-1/2"
//         style={{ scale, y, opacity }}
//         alt="Person"
//       />

//       {/* Scroll-triggered Elements */}
//       <motion.div
//         style={{ y: useTransform(scrollYProgress, [0.2, 0.4], [300, 0]), opacity }}
//         className="absolute top-[120vh] w-full text-center z-20"
//       >
//         <h1 className="text-white text-4xl md:text-6xl font-bold">Step into the Portal</h1>
//         <p className="text-white mt-4 text-lg max-w-xl mx-auto">
//           Where thoughts and reality blur.
//         </p>
//         <button className="mt-6 px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-opacity-80 transition">
//           Enter Now
//         </button>
//       </motion.div>
//     </section>
//   );
// }












import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

export default function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  // Person animation: scale down + move up as if walking into ocean
  const scale = useTransform(scrollYProgress, [0, 1], [1.2, 0.6]);
  const y = useTransform(scrollYProgress, [0, 1], [150, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  // Text milestone transforms
  const milestone1Scale = useTransform(scrollYProgress, [0.1, 0.2], [0.6, 1.2]);
  const milestone1Y = useTransform(scrollYProgress, [0.1, 0.2], [0, 0]);
  const milestone1Opacity = useTransform(scrollYProgress, [0.1, 0.15], [0, 1]);

  const milestone2Scale = useTransform(scrollYProgress, [0.25, 0.35], [0.4, 1]);
  const milestone2Y = useTransform(scrollYProgress, [0.25, 0.35], [600, 0]);
  const milestone2Opacity = useTransform(scrollYProgress, [0.25, 0.3], [0, 1]);

  const milestone3Scale = useTransform(scrollYProgress, [0.4, 0.5], [0.4, 1]);
  const milestone3Y = useTransform(scrollYProgress, [0.4, 0.5], [600, 0]);
  const milestone3Opacity = useTransform(scrollYProgress, [0.4, 0.45], [0, 1]);

  const milestone4Scale = useTransform(scrollYProgress, [0.55, 0.65], [0.4, 1]);
  const milestone4Y = useTransform(scrollYProgress, [0.55, 0.65], [600, 0]);
  const milestone4Opacity = useTransform(scrollYProgress, [0.55, 0.6], [0, 1]);

  return (
    <section ref={ref} className="relative h-[500vh] overflow-hidden">
      {/* Background */}
      <img
        src="background.png"
        className="fixed top-0 left-0 w-full h-full object-cover z-0 object-[50%_50%]"
        alt="Background Scene"
      />

      {/* Person */}
      <motion.img
        src="personback.png"
        className="fixed top-1/2 left-1/2 w-48 md:w-72 z-10 -translate-x-1/2 -translate-y-1/2"
        style={{ scale, y, opacity }}
        alt="Person"
      />

      {/* Milestone 1 - Right */}
      <motion.div
        className="fixed top-1/2 left-[70%] transform -translate-y-1/2 text-white z-20 text-right w-[300px]"
        style={{ scale: milestone1Scale, y: milestone1Y, opacity: milestone1Opacity }}
      >
        <h2 className="text-2xl md:text-4xl font-bold">The Beginning</h2>
        <p className="mt-2 text-sm md:text-base">It starts with a single step into the unknown.</p>
      </motion.div>

      {/* Milestone 2 - Left */}
      <motion.div
        className="fixed top-1/2 left-[10%] transform -translate-y-1/2 text-white z-20 text-left w-[300px]"
        style={{ scale: milestone2Scale, y: milestone2Y, opacity: milestone2Opacity }}
      >
        <h2 className="text-2xl md:text-4xl font-bold">The Realization</h2>
        <p className="mt-2 text-sm md:text-base">Where your thoughts begin to shape the world.</p>
      </motion.div>

      {/* Milestone 3 - Right */}
      <motion.div
        className="fixed top-1/2 left-[70%] transform -translate-y-1/2 text-white z-20 text-right w-[300px]"
        style={{ scale: milestone3Scale, y: milestone3Y, opacity: milestone3Opacity }}
      >
        <h2 className="text-2xl md:text-4xl font-bold">The Shift</h2>
        <p className="mt-2 text-sm md:text-base">You are no longer just a visitor—you become a part of it.</p>
      </motion.div>

      {/* Milestone 4 - Left */}
      <motion.div
        className="fixed top-1/2 left-[10%] transform -translate-y-1/2 text-white z-20 text-left w-[300px]"
        style={{ scale: milestone4Scale, y: milestone4Y, opacity: milestone4Opacity }}
      >
        <h2 className="text-2xl md:text-4xl font-bold">The Merge</h2>
        <p className="mt-2 text-sm md:text-base">Reality and imagination blur into one seamless flow.</p>
      </motion.div>
    </section>
  );
}
