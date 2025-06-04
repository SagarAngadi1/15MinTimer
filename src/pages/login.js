// pages/login.js
import {useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { setCookie } from 'nookies';
import { motion } from "framer-motion";

import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false); // State to toggle forgot password UI
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
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

  const handleLogin = async (event) => {
    event.preventDefault();

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('Log in successful');
      router.push({
        pathname: '/',
      });
      // router.push('/CreateProductPhoto');

    } else {
      if (data.error === 'User does not exists') {
        alert('User does not exists');
      } else {
        alert('Failed to login the user.');
      }

    }
   
  };


  // Handle Forgot Password (Step 1: Verify Email)
  const handleForgotPassword = async () => {
    const res = await fetch('/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: resetEmail }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Verification successful. Enter new password.');
      setResetSuccess(true);
    } else {
      alert(data.error || 'User not found.');
    }
  };

  // Handle Reset Password (Step 2: Resetting the password)
  const handleResetPassword = async () => {
    const res = await fetch('/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: resetEmail, newPassword }),
    });

    if (res.ok) {
      alert('Password reset successful! You can now log in.');
      setIsForgotPassword(false); // Reset UI back to login
      setResetSuccess(false);
    } else {
      alert('Failed to reset password.');
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
              Log In
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.8, duration: 1 }}
              className="mt-6 w-full max-w-md bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
            >
              {!isForgotPassword && (
      <form onSubmit={handleLogin} className="flex flex-col space-y-4">
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

        <button type="submit" 
        className="bg-white hover:bg-amber-200 text-black font-bold py-2 px-4 rounded-2xl transition duration-300"


        >
          Log In
        </button>
      </form>
      )}

              


              {/* Forgot Password UI */}
      {isForgotPassword && !resetSuccess && (
        <div className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            className="p-3 rounded-lg border border-white/20 bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-black"

          />
          <button
            onClick={handleForgotPassword}
            className="bg-blue-500 text-white text-sm py-2 px-4 font-bold rounded-2xl hover:bg-blue-700 transition duration-300"
          >
            Verify Email
          </button>
        </div>
      )}




      {resetSuccess && (
        <div className="w-full p-2  flex flex-col">
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mb-4 p-2 border rounded"
          />
          <button
            onClick={handleResetPassword}
            className="bg-green-500 text-white text-sm py-2 px-4 font-bold rounded-2xl hover:bg-green-700 transition duration-300"
          >
            Reset Password
          </button>
        </div>
      )}

      <h1 className="text-md font-bold mt-8" style={{ lineHeight: '1' }}>
        New to Space? Just 
        <Link className="text-amber-200 hover:text-amber-300" href="/signup"> SignUp!</Link>
      </h1>

      {/* Forgot Password Link */}
      {!isForgotPassword && (
        <p className="mt-4 text-sm">
          <span
            onClick={() => setIsForgotPassword(true)}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Forgot Password?
          </span>
        </p>
      )}
            </motion.div>
          </div>
        </motion.div>
      </section>


    </div>


  );
};

export default Login;