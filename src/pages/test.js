import { motion } from "framer-motion";
import Image from "next/image";
//import bgImage from "@/public/1a2dce85-1756-4d75-b3ba-2335d3045429.png";

const strips = Array.from({ length: 6 });

const stripVariants = {
  animate: (i) => ({
    y: [0, -10, 10, 0],
    transition: {
      duration: 4,
      ease: "easeInOut",
      repeat: Infinity,
      delay: i * 0.3,
    },
  }),
};

export default function Home() {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <Image
        src="/strips.jpeg"
        alt="Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="opacity-0"
      />
      <div className="absolute inset-0 flex justify-center items-center gap-1">
        {strips.map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={stripVariants}
            animate="animate"
            className="w-24 h-full bg-gradient-to-b from-red-500 via-pink-500 to-blue-900 mix-blend-lighten blur-md rounded-lg"
            style={{
              //backgroundImage: `url(/1a2dce85-1756-4d75-b3ba-2335d3045429.png)`,
              backgroundImage: `public/strips.jpeg`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))'
            }}
          ></motion.div>
        ))}
      </div>
    </div>
  );
}
