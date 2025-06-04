import { useEffect, useState } from 'react'; // Imports the useState hook from React. This hook allows you to add state to your functional components
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from "framer-motion";

export default function SignUp() { //Exports the SignUp function as the default export of the module
  const [email, setEmail] = useState(''); // Declares a state variable 'email' with an initial value of an empty string. setEmail is the function used to update email.
  const [password, setPassword] = useState(''); //'useState' allows us to set states to functional components(here for variable).
  const router = useRouter();

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


  
  const handleSubmit = async (e) => { // Declares an asynchronous function named handleSubmit to handle form submission.
    e.preventDefault(); //Prevents the default behavior of the form submission (which is to reload the page).

    const res = await fetch('/api/signup', {   //Uses the Fetch API to send a POST request to the '/api/signup' endpoint.
      method: 'POST',                         // Specifies the HTTP method as POST.
      headers: {                             
        'Content-Type': 'application/json',     //Sets the Content-Type header to application/json, indicating that the request body contains JSON data.
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('User created successfully!');
      router.push({
        pathname: '/',
      });
    } else {
      if (data.error === 'User already exists') {
        alert('User already exists.');
      } else {
        alert('Failed to create user.');
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white">

      <section className="relative flex flex-col items-center justify-center text-center px-6 py-0 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-br from-amber-200 via-black to-purple-700 opacity-30 animate-pulse"></div>
        </div>

        {/* Animated Wave with Text Inside */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="relative w-[900px] h-[900px] flex items-center justify-center"
        >
          {/* SVG Wave Animation */}
          <svg
            width="700"
            height="700"
            viewBox="0 0 600 600"
            className="pulse-wave absolute inset-0 w-full h-full"
          >
            <path d={paths.wave1} stroke="#a9686f" className="fill-transparent" />
            <path d={paths.wave2} stroke="#4e4d8f" className="fill-transparent" />
            <path d={paths.wave3} stroke="#b998a7" className="fill-transparent" />
          </svg>

          {/* Text Content Inside Wave */}
          <div className="relative z-10 flex flex-col items-center text-center w-[80%] max-w-[600px] px-4 py-6">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.4, duration: 1 }}
              className="text-5xl md:text-6xl font-extrabold"
            >
              Sign Up
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.8, duration: 1 }}
              className="mt-6 w-full max-w-md bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
            >
              <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-3 rounded-lg border border-white/20 bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-3 rounded-lg border border-white/20 bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
                <button
                  type="submit"
                  className="bg-white hover:bg-amber-200 text-black font-bold py-2 px-4 rounded-2xl transition duration-300"
                >
                  Sign Up
                </button>
              </form>

              <p className="text-white text-sm mt-6 text-center">
                Already a user?{' '}
                <Link href="/login" className="text-amber-200 hover:underline">
                  Login here
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
