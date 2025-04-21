import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from 'next/router';
import fetchCurrentUser from '../../utils/fetchCurrentUser';



export default function Home({ currentUser }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const router = useRouter();
  const [user, setUser] = useState(currentUser);
  


  const pricingSectionRef = useRef(null);

  const scrollToPricing = () => {
    if (pricingSectionRef.current) {
      pricingSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (router.query.scrollToPricing === 'true' && pricingSectionRef.current) {
      pricingSectionRef.current.scrollIntoView({ behavior: 'smooth' });

      const { pathname } = router;
      router.replace(pathname, undefined, { shallow: true });
    }
  }, [router.query]);


    
  // useEffect(() => {
  //   if (!currentUser) {
  //     const fetchUser = async () => {
  //       try {
  //         const res = await fetch('/api/fetchCurrentUser');
  //         if (res.ok) {
  //           const data = await res.json();
  //           setUser(data);
  //         }
  //       } catch (err) {
  //         console.error("Client-side fetch user failed:", err);
  //       }
  //     };
  
  //     fetchUser();
  //   }
  // }, [currentUser]); // ✅ This avoids infinite re-renders


    
  useEffect(() => {
    if (!currentUser) {
      const fetchUser = async () => {
        try {
          const res = await fetch('/api/fetchCurrentUser', {
            method: 'GET',
            //credentials: 'include', // ✅ include cookies
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (res.ok) {
            const data = await res.json();
            setUser(data);
          }
        } catch (err) {
          console.error("Client-side fetch user failed:", err);
        }
      };
  
      fetchUser();
    }
  }, [currentUser]); // ✅ This avoids infinite re-renders
  



  const handleSignUpNavigation = () => {
    router.push('/signup');
  };

  const handleLogInNavigation = () => {
    router.push('/login');
  };

  const handlePlayGroundNavigation = () => {
    router.push('/PlayGround');
  };

  const handleWorkSpaceNavigation = (card) => {
    // router.push('/signup');
    router.push({
      pathname: '/workspace',
      query: {
        title: card.title,
        //note: note,
        time: convertToSeconds(card.time), // convert if needed
        tasks: JSON.stringify(card.tasks),
      }
    });

    console.log("Navigating to workspace with:", card);

  };


  const convertToSeconds = (timeString) => {
    if (typeof timeString === 'number') return timeString; // already in seconds
    if (typeof timeString === 'string' && timeString.includes(':')) {
      const [minutes, seconds] = timeString.split(':').map(Number);
      return (minutes * 60 + (seconds || 0)).toString();
    }
    return timeString; // fallback
  };

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  const [paths, setPaths] = useState({
    wave1: "",
    wave2: "",
    wave3: "",
  });

  useEffect(() => {
    const points = 120;
    const radius = 250;
    const centerX = 300;
    const centerY = 300;
    const waveAmplitude1 = 6;
    const waveAmplitude2 = 8;
    const waveAmplitude3 = 10;
    const waveFrequency = 6;

    function generateWavePath(amplitude, phaseShift = 0, time) {
      let path = "";
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const wave =
          Math.sin(angle * waveFrequency + time * 2 + phaseShift) * amplitude;
        const r = radius + wave;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        path += i === 0 ? `M ${x},${y}` : ` L ${x},${y}`;
      }
      path += " Z";
      return path;
    }

    function animate() {
      const time = Date.now() / 1000;
      setPaths({
        wave1: generateWavePath(waveAmplitude1, 0, time),
        wave2: generateWavePath(waveAmplitude2, Math.PI / 2, time),
        wave3: generateWavePath(waveAmplitude3, Math.PI, time),
      });
      requestAnimationFrame(animate);
    }

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

      {/* Navigation Bar */}


<motion.nav
  // initial={{ opacity: 0, y: -20 }}
  // animate={{ opacity: 1, y: 0 }}
  initial={{ opacity: 0, x: 100 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 1, duration: 1 }}
  className="fixed top-6 md:right-10 right-8 z-50"
>



  <div className="  flex items-center gap-8 px-8 py-4 bg-white/20 backdrop-blur-xl border border-white/20 rounded-full shadow-md shadow-purple-500/20">
  {/* Missions - Always visible */}
  <a
    href="#"
    onClick={scrollToPricing}
    className="text-base text-white/80 hover:text-amber-300 transition-all duration-200"
  >
    Missions
  </a>

  {user ? null : (
    <>
      {/* Show only if user not logged in */}
      <a
        href="#missions"
        onClick={handleSignUpNavigation}
        className="text-base text-white/80 hover:text-amber-300 transition-all duration-200"
      >
        SignUp
      </a>

      <a
        href="#about"
        onClick={handleLogInNavigation}
        className="text-base text-white/80 hover:text-amber-300 transition-all duration-200"
      >
        Login
      </a>
    </>
  )}

  {/* Start - Always visible */}
  <Link
    href="/PlayGround"
    className="text-base text-white/80 hover:text-amber-300 transition-all duration-200"
  >
    Start
  </Link>
</div>



  
</motion.nav>






      


      {/* Cursor Glow */}
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
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-0 overflow-hidden">
        {/* Background */}
        
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-br from-amber-200 via-black to-purple-700 opacity-30 animate-pulse"></div>
        </div>














        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, duration: 1 }}
          // className="relative w-[900px] h-[900px] flex items-center justify-center"
          className="relative w-[90vw] sm:w-[500px] md:w-[900px] aspect-square flex items-center justify-center mt-20 sm:mt-20 md:mt-0"
        >
          <svg
            width="700"
            height="700"
            viewBox="0 0 600 600"
            className="pulse-wave absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >

            <path d={paths.wave1} stroke="#a9686f" className="fill-transparent" />
            <path d={paths.wave2} stroke="#4e4d8f" className="fill-transparent" />
            <path d={paths.wave3} stroke="#b998a7" className="fill-transparent" />
          </svg>




          <div className="relative z-10 flex flex-col items-center text-center w-[80%] max-w-[600px] px-4 py-6">

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.4, duration: 1 }}
              className="text-2xl sm:text-2xl md:text-6xl font-extrabold"
            >
              The 15-Minute Revolution
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{delay: 2.8, duration: 1 }}
              className="mt-8 sm:mt-8 text-sm md:text-2xl max-w-3xl text-gray-300"
              // mt-4 sm:mt-6 text-sm sm:text-base md:text-lg lg:text-xl text-gray-300
            >
              Create time-bound sessions, add checklists, track your activities, and turn shallow hours into focused deep work.
              {/* Science meets simplicity. Boost your productivity, creativity, and discipline—15 minutes at a time. */}
            </motion.p>


          </div>


        </motion.div>









        <motion.button
          whileHover={{ scale: 1.1 }}
          className="mt-10 mb-2 px-8 py-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/80 hover:text-amber-300 transition-all duration-200 shadow-md shadow-purple-500/10 z-10 font-bold"
          onClick={handlePlayGroundNavigation}   
        >
         Get Started
        </motion.button>

      </section>

     







  <section ref={pricingSectionRef} className="relative z-10 px-6 md:px-20 py-24 bg-black text-white">
  <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white/90">
    Pick Your <span className="text-amber-200">15-Min Missions</span>
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
    {[
      {
        title: "Stretch & Move",
        img: "/exercise.png",
        objectPosition: "object-[50%_85%]",
        tasks: ["5-min stretch", "10 squats"],
      },
      {
        title: "Quick Meditation",
        img: "/meditate.png",
        objectPosition: "object-[50%_85%]",
        tasks: ["Find a quiet spot", "Focus on breathing"],
      },
      {
        title: "Deep Focus Study",
        img: "/walking.png",
        objectPosition: "object-[50%_50%]",
        tasks: ["Read 10 pages", "Summarize key points"],
      },
      {
        title: "Painting",
        img: "/Painting.png",
        objectPosition: "object-[50%_50%]",
        tasks: ["Try new style", "Complete first draft"],
      },
      {
        title: "Inbox Zero",
        img: "/studying.png",
        objectPosition: "object-[50%_85%]",
        tasks: ["Clear spam", "Reply to 3 emails"],
      },
      {
        title: "Goal Planning",
        img: "/planning.png",
        objectPosition: "object-[50%_60%]",
        tasks: ["List top 3 goals", "Outline steps"],
      },
    ].map((card, idx) => (
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.1 }}
        className="relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-5 overflow-hidden shadow-lg hover:shadow-amber-300 transition-all duration-300"
        onClick={() => handleWorkSpaceNavigation(card)}
      >
        <div className="me-3 mt-1 absolute top-5 right-3 bg-black/50 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
          15:00
        </div>

      
        
        <img
          src={card.img}
          alt={card.title}
          className={`w-full h-80 object-cover rounded-xl mb-4 border border-white/10 ${card.objectPosition}`}
          // className="w-full h-80 object-cover object-[50%_85%] rounded-xl mb-4 border border-white/10"
        />
        
        <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>



        {/* <ul className="text-sm text-gray-300 space-y-2">
          {card.tasks.map((task, i) => (
            <li key={i} className="flex items-start gap-2">
              <input type="checkbox" className="bg-amber-200 mt-1" />
              <span>{task}</span>
            </li>
          ))}
        </ul> */}

  <ul className="text-sm text-gray-300 space-y-2">
  {card.tasks.map((task, i) => (
    <li key={i} className="flex items-start gap-3">
      <label className="flex items-center gap-2 cursor-pointer group">
        <input
          type="checkbox"
          className="peer hidden"
        />
        <div className="w-4 h-4 rounded-md border border-gray-400 peer-checked:bg-amber-200 flex items-center justify-center transition">
          {/* Checkmark (✓) inside the box */}
          <svg
            className="w-2 h-2 text-black opacity-0 peer-checked:opacity-100 transition"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="select-none">{task}</span>
      </label>
    </li>
  ))}
</ul>

      </motion.div>
    ))}
  </div>




</section>

<footer className="w-full mt-24 px-6 md:px-20 py-12 border-t border-white/10 bg-black text-white/70">
  <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-4">
    {/* Connect / Email */}
    <div>
      <h4 className="text-lg font-semibold text-white mb-2">Connect</h4>
      <p className="text-sm text-gray-400">
        Email: <a href="mailto:ianassagar@gmail.com" className="hover:text-amber-300">ianassagar@gmail.com</a>
      </p>
    </div>

    {/* Bottom */}
    <div className="border-t border-white/10 pt-6 text-xs text-gray-500 w-full text-center">
      © {new Date().getFullYear()} 15-Min Timer. All rights reserved.
    </div>
  </div>
</footer>



    </div>
  );
}

export async function getServerSideProps(context) {
  const currentUser = await fetchCurrentUser(context.req);

  return {
    props: {
      currentUser: currentUser ? JSON.parse(JSON.stringify(currentUser)) : null,
    },
  };
}






















































// import React from "react";
// import { motion } from "framer-motion";
// import Head from "next/head";
// import { useEffect, useRef, useState } from "react";

// export default function Home() {
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

//   useEffect(() => {
//     const updateMousePosition = (e) => {
//       setMousePosition({ x: e.clientX, y: e.clientY });
//     };

//     window.addEventListener("mousemove", updateMousePosition);
//     return () => {
//       window.removeEventListener("mousemove", updateMousePosition);
//     };
//   }, []);

//   function generateWavyCirclePath(radius, amplitude, frequency, phase = 0) {
//     const points = [];
//     const resolution = 200; // Higher = smoother
//     for (let i = 0; i <= resolution; i++) {
//       const angle = (i / resolution) * 2 * Math.PI;
//       const wave = amplitude * Math.sin(angle * frequency + phase);
//       const r = radius + wave;
//       const x = 150 + r * Math.cos(angle); // Centered at (150, 150)
//       const y = 150 + r * Math.sin(angle);
//       points.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
//     }
//     return points.join(" ") + " Z";
//   }

//   const [paths, setPaths] = useState({
//     wave1: "",
//     wave2: "",
//     wave3: "",
//   });

//   const phase = useRef(0);

//   useEffect(() => {
//     const animate = () => {
//       phase.current += 0.03;

//       setPaths({
//         wave1: generateWavyCirclePath(100, 10, 6, phase.current),
//         wave2: generateWavyCirclePath(90, 8, 5.5, phase.current + 1),
//         wave3: generateWavyCirclePath(110, 12, 7, phase.current + 2),
//       });

//       requestAnimationFrame(animate);
//     };

//     animate();
//   }, []);

//   return (
//     <div className="min-h-screen bg-black text-white font-sans">
//       <Head>
//         <title>Pulse of Energy</title>
//         <meta
//           name="description"
//           content="Experience the pulse of energy with intertwined waves."
//         />
//       </Head>

//       {/* Cursor glow */}
//       <div
//         className="pointer-events-none fixed z-50 rounded-full blur-3xl mix-blend-screen"
//         style={{
//           top: mousePosition.y - 150,
//           left: mousePosition.x - 150,
//           width: 300,
//           height: 300,
//           background:
//             "radial-gradient(circle, rgba(168,85,247,0.6), rgba(168,85,247,0.1), transparent 80%)",
//         }}
//       />

//       {/* Hero Section */}
//       <section className="relative flex flex-col items-center justify-center text-center px-6 py-32 overflow-hidden">
//         <div className="absolute inset-0 z-0 pointer-events-none">
//           <div className="w-full h-full bg-gradient-to-br from-purple-900 via-black to-gray-900 opacity-30 animate-pulse"></div>
//         </div>

//         <motion.h1
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1 }}
//           className="text-5xl md:text-6xl font-extrabold z-10"
//         >
//           The Pulse of Energy
//         </motion.h1>

//         <motion.p
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4, duration: 1 }}
//           className="mt-6 text-xl md:text-2xl max-w-3xl text-gray-300 z-10"
//         >
//           Intertwining waves that pulse with energy—Feel the rhythm.
//         </motion.p>

//         <motion.div
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{ delay: 1.2, duration: 1 }}
//           className="relative w-64 h-64 mt-8 flex items-center justify-center"
//         >
//           <svg
//             viewBox="0 0 300 300"
//             className="absolute top-0 left-0 w-full h-full"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d={paths.wave1}
//               fill="none"
//               stroke="#a855f7" // purple-500
//               strokeWidth="2"
//               className="wave-path"
//             />
//             <path
//               d={paths.wave2}
//               fill="none"
//               stroke="#22d3ee" // cyan-400
//               strokeWidth="1.5"
//               className="wave-path"
//             />
//             <path
//               d={paths.wave3}
//               fill="none"
//               stroke="#f472b6" // pink-400
//               strokeWidth="1.5"
//               className="wave-path"
//             />
//           </svg>

//           {/* Timer Text */}
//           <div className="text-4xl text-white font-bold z-10">15:00</div>
//         </motion.div>
//       </section>
//     </div>
//   );
// }


