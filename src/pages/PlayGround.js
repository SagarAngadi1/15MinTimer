import { motion } from "framer-motion";
import TimerCard from "../components/TimerCard";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'; // Correct import
import fetchCurrentUser from '../../utils/fetchCurrentUser';
import { parseCookies } from 'nookies';





export default function Playground({ currentUser }) {
    const [user, setUser] = useState(currentUser);
    const [showModal, setShowModal] = useState(false);
    const [sessions, setSessions] = useState([]);

    const [title, setTitle] = useState("");
    const [note, setNote] = useState("");
    const [time, setTime] = useState("900"); // in seconds, default 15 min
    const [tasks, setTasks] = useState([""]);
    const router = useRouter();

    // Temporary Note & Tasks for right column (not saved)
const [tempNote, setTempNote] = useState("");
const [tempTasks, setTempTasks] = useState([""]);




const handleTempTaskChange = (idx, value) => {
  const updated = [...tempTasks];
  updated[idx] = value;
  setTempTasks(updated);
};

const addTempTask = () => {
  setTempTasks([...tempTasks, ""]);
};

const toggleTempTaskDone = (index) => {
  const updated = [...tempTasks];
  updated[index] = updated[index].startsWith("✓ ") 
    ? updated[index].replace("✓ ", "")
    : "✓ " + updated[index];
  setTempTasks(updated);
};






    const handleWorkSpaceNavigation = (card) => {
      // router.push('/signup');
      router.push({
        pathname: '/workspace',
        query: {
          title: card.title,
          note: note,
          time: convertToSeconds(card.time), // convert if needed
          tasks: JSON.stringify(card.tasks),
        }
      });

      console.log("Navigating to workspace with:", card);

    };
    
    // const convertToSeconds = (timeString) => {
    //   const [minutes, seconds] = timeString.split(":").map(Number);
    //   return (minutes * 60 + (seconds || 0)).toString();
    // };
    
    const convertToSeconds = (timeString) => {
      if (typeof timeString === 'number') return timeString; // already in seconds
      if (typeof timeString === 'string' && timeString.includes(':')) {
        const [minutes, seconds] = timeString.split(':').map(Number);
        return (minutes * 60 + (seconds || 0)).toString();
      }
      return timeString; // fallback
    };
    




    


    useEffect(() => {
      if (!currentUser) {
        const fetchUser = async () => {
          const res = await fetch('/api/fetchCurrentUser', {
            headers: {
              'Authorization': `Bearer ${parseCookies().token}`,
            },
          });
  
          if (res.ok) {
            const data = await res.json();
            setUser(data);
          }
        };
  
        fetchUser();
      }
    }, [currentUser]);





    useEffect(() => {
      const fetchSessions = async () => {
        try {
          //const userId = localStorage.getItem("userId"); // or get from auth/session
          const userId = user._id;
          if (!userId) return;

    
          const res = await fetch("/api/getSessions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          });
    
          const data = await res.json();
    
          if (data.success && data.sessions.length > 0) {
            setSessions(data.sessions);
          } else {
            // Optional: Leave as empty to fall back to default placeholders
            setSessions([]);
          }
        } catch (err) {
          console.error("Failed to fetch sessions", err);
        }
      };
    
      fetchSessions();
    }, []);


  const addTask = () => setTasks([...tasks, ""]);
  const handleTaskChange = (idx, value) => {
    const updated = [...tasks];
    updated[idx] = value;
    setTasks(updated);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };


    const handleCreateSession = async () => {


      console.log("📦 Sending session data to backend:", {
        title,
        note,
        time,
        tasks
      });

      const formData = new FormData();
      formData.append("title", title);
      formData.append("note", note);
      formData.append("time", time);
      formData.append("userId", user._id); 

  
     

      // Append each task
      tasks.forEach((task, index) => {
       formData.append(`tasks[]`, task);  // Use `tasks[]` to send as an array
      });
  
      try {
        const res = await fetch("/api/createSession", {
          method: "POST",
          body: formData,
        });

        console.log("📨 Response status:", res.status);

        
  
        if (!res.ok) throw new Error("Failed to create session");
  
        const newSession = await res.json();
        console.log("✅ Session created successfully:", newSession);
        setSessions(prev => [...prev, newSession]);  // optionally update list
        setShowModal(false);

        // Reset form
       setTitle("");
       setNote("");
       setTime("900");
       setTasks([""]);

  
      } catch (err) {
        console.error("Error creating session:", err);
      }

      router.push({
        pathname: '/workspace',
        query: {
          title: title,
          note: note,
          time: convertToSeconds(time), // convert if needed
          tasks: JSON.stringify(tasks),
        }
      });



    };


    const sessionImages = [
      { img: "/exercise.png", objectPosition: "object-[50%_80%]" },
      { img: "/meditate.png", objectPosition: "object-[50%_85%]" },
      { img: "/walking.png", objectPosition: "object-[50%_50%]" },
      { img: "/Painting.png", objectPosition: "object-[50%_60%]" },
      { img: "/studying.png", objectPosition: "object-[50%_70%]" },
      { img: "/planning.png", objectPosition: "object-[50%_65%]" },
    ];
    
  




  return (
    <div className="min-h-screen w-full bg-black text-white flex">

        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-br from-amber-200/100 via-black to-purple-300 opacity-30 "></div>
        </div>
      
      {/* Column 1: Side Menu */}
  
      {/* Right Column: Temporary Notes & Tasks */}
<motion.aside
  initial={{ x: 100, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.8 }}
  className="w-[25%] min-h-screen p-4 border-l border-white/10 bg-white/5 backdrop-blur-md"

>

<h2 className="text-xl font-semibold mb-8 mt-4">Menu</h2>

  <h2 className="text-xl font-semibold mb-4">Temporary Notes</h2>
  
  {/* Note Area */}
  <textarea
    className="w-full p-2 bg-white/10 text-white/90 rounded-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
    rows={4}
    placeholder="Write a quick note..."
    value={tempNote}
    onChange={(e) => setTempNote(e.target.value)}
  />

  {/* Tasks Area */}
  <div className="mt-6">
    <h3 className="text-lg font-semibold mb-2">Quick Tasks</h3>
    <ul className="space-y-2">
      {tempTasks.map((task, idx) => (
        <li key={idx} className="flex items-center gap-3">
          <input
            type="text"
            value={task.replace(/^✓\s/, "")}
            onChange={(e) => handleTempTaskChange(idx, e.target.value)}
            className="flex-1 bg-white/10 p-2 rounded-md text-white border border-white/10 focus:outline-none"
          />
          <button
            onClick={() => toggleTempTaskDone(idx)}
            className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${
              task.startsWith("✓ ") ? "bg-green-500" : "bg-gray-500"
            }`}
            title="Mark Done"
          >
            ✓
          </button>
        </li>
      ))}
    </ul>
    <button
      onClick={addTempTask}
      className="mt-3 px-3 py-1 bg-purple-500 hover:bg-purple-600 rounded-md text-sm text-white"
    >
      + Add Task
    </button>
  </div>
</motion.aside>


      {/* Column 2: Main Playground */}
      <main className="w-[50%] min-h-screen p-6">
       

        {/* Header */}
<div className="mb-6">
  <div className="flex justify-between items-center">
    <h1 className="text-2xl font-bold">Sessions</h1>
    
    {/* User Info */}
    <div className="flex items-center space-x-3">
      <div className="text-sm text-white/60 bg-white/10 px-3 py-1 rounded-full shadow-inner">
        {user?.email ?? "user@example.com"}
      </div>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-white hover:bg-amber-200 rounded-full text-black text-sm shadow-md"
      >
        + New Session
      </motion.button>
    </div>
  </div>
</div>


    


 {/* Session Cards */}
 <div className="grid grid-cols-2 gap-10">
        {[...sessions, 
          {
            title: "Study Session",
            tasks: ["Read notes", "Summarize", "Highlight"],
            time: "15:00",
          },
          {
            title: "Workout",
            tasks: ["Pushups", "Squats", "Planks"],
            time: "15:00",
          },
          {
            title: "Creative Writing",
            tasks: ["Write 1 paragraph", "Edit last draft"],
            time: "15:00",
          },
        ].map((card, idx) => {
          const image = sessionImages[idx % sessionImages.length];
         // 🧠 Properly format time if it's in seconds
          const displayTime =
          typeof card.time === "number"
          ? formatTime(card.time)
          : card.time.includes(":")
          ? card.time
          : formatTime(Number(card.time));          
          
          return (
            <TimerCard
              key={idx}
              title={card.title}
              time={displayTime}
              //time={typeof card.time === "number" ? `${card.time}:00` : card.time}
              img={image.img}
              objectPosition={image.objectPosition}
              tasks={card.tasks}
              onClick={() => handleWorkSpaceNavigation(card)}
             // onClick={handleWorkSpaceNavigation}
            />
          );
        })}
      </div>


{showModal && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="w-full max-w-2xl bg-white/10 text-white p-8 rounded-3xl shadow-xl backdrop-blur-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white hover:text-red-400 text-xl font-bold"
            >
              ×
            </button>

            <h2 className="text-center text-2xl font-bold mb-6">Create New Session</h2>

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-3xl font-semibold bg-transparent border-none outline-none placeholder-white/50 mb-14"
            />

            <div className="flex flex-col items-center mb-10 space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-60 h-60 rounded-full bg-gradient-to-br from-white/10 to-white/5 shadow-[inset_0_0_10px_rgba(255,255,255,0.1),_0_10px_20px_rgba(0,0,0,0.3)] border border-white/20 flex items-center justify-center relative hover:shadow-amber-200 transition-all duration-300"
              >
                <div className="absolute w-56 h-56 rounded-full border border-white/10" />
                <div className="flex items-center space-x-1 text-2xl font-bold tracking-widest z-10">
                  {formatTime(Number(time)).split("").map((char, idx) =>
                    char === ":" ? (
                      <span key={idx} className="text-white">
                        {char}
                      </span>
                    ) : (
                      <span
                        key={idx}
                        className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-md shadow-inner text-white"
                      >
                        {char}
                      </span>
                    )
                  )}
                </div>
              </motion.div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setTime((prev) => `${Math.max(0, Number(prev) + 60)}`)}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md text-white text-sm"
                >
                  +1 min
                </button>
                <button
                  onClick={() => setTime((prev) => `${Math.max(0, Number(prev) - 60)}`)}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md text-white text-sm"
                >
                  -1 min
                </button>
              </div>
            </div>

            <textarea
              placeholder="Add a note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full text-xl bg-transparent border-none outline-none placeholder-white/50 mb-8 resize-none"
              rows={2}
            />

            <div className="mb-4">
              {tasks.map((task, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder={`To-do list item ${idx + 1}`}
                    value={task}
                    onChange={(e) => handleTaskChange(idx, e.target.value)}
                    className="flex-grow text-lg bg-transparent border-none outline-none placeholder-white/30"
                  />
                  {tasks.length > 1 && (
                    <button
                      onClick={() => {
                        const updated = [...tasks];
                        updated.splice(idx, 1);
                        setTasks(updated);
                      }}
                      className="text-white/50 hover:text-red-400 text-lg"
                      title="Remove task"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={addTask}
                className="text-white/60 text-sm hover:text-white transition"
              >
                + Add Task
              </button>
            </div>

            <div className="flex justify-center mt-8">
              <button
                className="px-6 py-3 rounded-full bg-white hover:bg-amber-200 text-black text-sm font-semibold shadow-md"
                onClick={handleCreateSession}
              >
                Create Session
              </button>
            </div>
          </div>
        </motion.div>
      )}


     </main>

      {/* Column 3: Stats */}
      <motion.aside
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-[25%] min-h-screen p-6 border-l border-white/10 bg-white/5 backdrop-blur-md"
      >
        <h2 className="text-xl font-semibold mb-4">Your Streak</h2>
        {/* Future: Streak bar, Graphs, Suggestions */}
        <div className="bg-white/10 p-4 rounded-xl mb-6 shadow-inner">
          🔥 5-Day Streak
        </div>
        <div className="bg-white/10 p-4 rounded-xl shadow-inner">
          📊 Graph & Suggestions coming soon
        </div>
      </motion.aside>



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






























// import { motion } from "framer-motion";
// import { useState } from "react";
// import TimerCard from "../../Components/TimerCard";

// export default function Playground() {
//   const [showModal, setShowModal] = useState(false);
//   const [sessions, setSessions] = useState([]);
//   const [title, setTitle] = useState("");
//   const [note, setNote] = useState("");
//   const [time, setTime] = useState("900"); // in seconds, default 15 min
//   const [tasks, setTasks] = useState([""]);

//   const addTask = () => setTasks([...tasks, ""]);
//   const handleTaskChange = (idx, value) => {
//     const updated = [...tasks];
//     updated[idx] = value;
//     setTasks(updated);
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60)
//       .toString()
//       .padStart(2, "0");
//     const secs = (seconds % 60).toString().padStart(2, "0");
//     return `${mins}:${secs}`;
//   };

//   const handleCreateSession = () => {
//     const newSession = {
//       title,
//       note,
//       time: formatTime(Number(time)),
//       tasks,
//       img: "/default.png",
//       objectPosition: "object-center",
//     };

//     setSessions((prev) => [...prev, newSession]);
//     setShowModal(false);

//     // Reset form
//     setTitle("");
//     setNote("");
//     setTime("900");
//     setTasks([""]);
//   };

//   return (
//     <div className="min-h-screen w-full bg-black text-white flex relative">
//       {/* Background Gradient */}
//       <div className="absolute inset-0 z-0 pointer-events-none">
//         <div className="w-full h-full bg-gradient-to-br from-amber-200/100 via-black to-purple-300 opacity-30" />
//       </div>

//       {/* Sidebar */}
//       <aside className="w-[25%] min-h-screen p-4 border-r border-white/10 bg-white/5 backdrop-blur-md z-10">
//         <h2 className="text-xl font-semibold mb-4">Menu</h2>
//       </aside>

//       {/* Main Content */}
//       <main className="w-[50%] min-h-screen p-6 z-10">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">Sessions</h1>
//           <motion.button
//             whileTap={{ scale: 0.9 }}
//             onClick={() => setShowModal(true)}
//             className="px-4 py-2 bg-white hover:bg-amber-200 rounded-full text-black text-sm shadow-md"
//           >
//             + New Session
//           </motion.button>
//         </div>

//         {/* Timer Cards */}
//         <div className="grid grid-cols-2 gap-10">
//           {[...sessions].map((card, idx) => (
//             <TimerCard
//               key={idx}
//               title={card.title}
//               time={card.time}
//               img={card.img}
//               objectPosition={card.objectPosition}
//               tasks={card.tasks}
//             />
//           ))}
//         </div>
//       </main>

//       {/* Modal */}
//       {showModal && (
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: 50 }}
//           className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
//         >
//           <div className="w-full max-w-2xl bg-white/10 text-white p-8 rounded-3xl shadow-xl backdrop-blur-md relative">
//             {/* Close Button */}
//             <button
//               onClick={() => setShowModal(false)}
//               className="absolute top-4 right-4 text-white hover:text-red-400 text-xl font-bold"
//             >
//               ×
//             </button>

//             <h2 className="text-center text-2xl font-bold mb-6">Create New Session</h2>

//             {/* Title Input */}
//             <input
//               type="text"
//               placeholder="Title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full text-3xl font-semibold bg-transparent border-none outline-none placeholder-white/50 mb-14"
//             />

//             {/* Time Picker */}
//             <div className="flex flex-col items-center mb-10 space-y-4">
//               <div className="w-60 h-60 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center relative">
//                 <div className="absolute w-56 h-56 rounded-full border border-white/10" />
//                 <div className="flex items-center space-x-1 text-2xl font-bold tracking-widest z-10">
//                   {formatTime(Number(time)).split("").map((char, idx) =>
//                     char === ":" ? (
//                       <span key={idx} className="text-white">
//                         {char}
//                       </span>
//                     ) : (
//                       <span
//                         key={idx}
//                         className="bg-white/20 px-3 py-2 rounded-md text-white"
//                       >
//                         {char}
//                       </span>
//                     )
//                   )}
//                 </div>
//               </div>

//               <div className="flex space-x-4">
//                 <button
//                   onClick={() => setTime((prev) => `${Math.max(0, Number(prev) + 60)}`)}
//                   className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md text-white text-sm"
//                 >
//                   +1 min
//                 </button>
//                 <button
//                   onClick={() => setTime((prev) => `${Math.max(0, Number(prev) - 60)}`)}
//                   className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md text-white text-sm"
//                 >
//                   -1 min
//                 </button>
//               </div>
//             </div>

//             {/* Note */}
//             <textarea
//               placeholder="Add a note..."
//               value={note}
//               onChange={(e) => setNote(e.target.value)}
//               className="w-full text-xl bg-transparent border-none outline-none placeholder-white/50 mb-8 resize-none"
//               rows={2}
//             />

//             {/* Tasks */}
//             <div className="mb-4">
//               {tasks.map((task, idx) => (
//                 <div key={idx} className="flex items-center gap-2 mb-2">
//                   <input
//                     type="text"
//                     placeholder={`To-do list item ${idx + 1}`}
//                     value={task}
//                     onChange={(e) => handleTaskChange(idx, e.target.value)}
//                     className="flex-grow text-lg bg-transparent border-none outline-none placeholder-white/30"
//                   />
//                   {tasks.length > 1 && (
//                     <button
//                       onClick={() => {
//                         const updated = [...tasks];
//                         updated.splice(idx, 1);
//                         setTasks(updated);
//                       }}
//                       className="text-white/50 hover:text-red-400 text-lg"
//                     >
//                       Remove
//                     </button>
//                   )}
//                 </div>
//               ))}
//               <button
//                 onClick={addTask}
//                 className="text-sm mt-2 text-white/60 hover:text-white"
//               >
//                 + Add Task
//               </button>
//             </div>

//             {/* Create Button */}
//             <button
//               onClick={handleCreateSession}
//               className="mt-6 w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-amber-300 transition"
//             >
//               Create Session
//             </button>
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// }













































// import { motion } from "framer-motion";
// import TimerCard from "../../Components/TimerCard";
// import { useState } from "react";
// import { useRouter } from 'next/router';

// export default function Playground() {
//   const [showModal, setShowModal] = useState(false);
//   const [sessions, setSessions] = useState([]);

//   // Modal form states
//   const [title, setTitle] = useState("");
//   const [note, setNote] = useState("");
//   const [tasks, setTasks] = useState([""]);
//   const [time, setTime] = useState("900");

//   const handleCreateSession = async (sessionData) => {
//     console.log("📦 Sending session data to backend:", sessionData);

//     const formData = new FormData();
//     formData.append("title", sessionData.title);
//     formData.append("note", sessionData.note);
//     formData.append("time", sessionData.time);

//     sessionData.tasks.forEach((task, index) => {
//       formData.append(`tasks[${index}]`, task);
//     });

//     try {
//       const res = await fetch("/api/createSession", {
//         method: "POST",
//         body: formData,
//       });

//       console.log("📨 Response status:", res.status);

//       if (!res.ok) throw new Error("Failed to create session");

//       const newSession = await res.json();
//       console.log("✅ Session created successfully:", newSession);
//       setSessions((prev) => [...prev, newSession]);
//     } catch (err) {
//       console.error("Error creating session:", err);
//     }
//   };

//   const handleTaskChange = (index, value) => {
//     const updated = [...tasks];
//     updated[index] = value;
//     setTasks(updated);
//   };

//   const addTask = () => {
//     setTasks([...tasks, ""]);
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
//     const secs = (seconds % 60).toString().padStart(2, "0");
//     return `${mins}:${secs}`;
//   };

//   const handleCreate = () => {
//     const sessionData = { title, note, tasks, time };
//     handleCreateSession(sessionData);
//     setShowModal(false);
//     console.log("🧪 Create button clicked", sessionData);
//   };

//   return (
//     <div className="min-h-screen w-full bg-black text-white flex relative">
//       <div className="absolute inset-0 z-0 pointer-events-none">
//         <div className="w-full h-full bg-gradient-to-br from-amber-200/100 via-black to-purple-300 opacity-30 "></div>
//       </div>

//       {/*1st Coloumn Side Menu */}
//       <motion.aside
//         initial={{ x: -100, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         transition={{ duration: 0.8 }}
//         className="w-[25%] min-h-screen p-4 border-r border-white/10 bg-white/5 backdrop-blur-md"
//       >
//         <h2 className="text-xl font-semibold mb-4">Menu</h2>

//       </motion.aside>







//       {/* Column 2: Main Playground */}
//       <main className="w-[50%] min-h-screen p-6">

//         {/* Heading */}
//         <div className="flex justify-between items-center mb-6s">
//           <h1 className="text-2xl font-bold">Sessions</h1>
        
//           <motion.button
//             whileTap={{ scale: 0.9 }}
//             onClick={() => setShowModal(true)}
//             className="px-4 py-2 bg-white hover:bg-amber-200 rounded-full text-black text-sm shadow-md"
//           >
//            + New Session
//            </motion.button>
//         </div>



//         {showModal && (
//           <NewSessionModal
//             onClose={() => setShowModal(false)}
//             onCreate={handleCreateSession}
//           />
//         )}

// <div className="grid grid-cols-2 gap-10">
//   {[...sessions, 
//     {
//       title: "Study Session",
//       img: "/studying.png",
//       objectPosition: "object-[50%_80%]",
//       tasks: ["Read notes", "Summarize", "Highlight"],
//       time: "15:00",
//     },
//     {
//       title: "Workout",
//       img: "/exercise.png",
//       objectPosition: "object-[50%_85%]",
//       tasks: ["Pushups", "Squats", "Planks"],
//       time: "15:00",
//     },
//     {
//       title: "Creative Writing",
//       img: "/Painting.png",
//       objectPosition: "object-[50%_50%]",
//       tasks: ["Write 1 paragraph", "Edit last draft"],
//       time: "15:00",
//     },
//   ].map((card, idx) => (
//     <TimerCard
//       key={idx}
//       title={card.title}
//       time={typeof card.time === "number" ? `${card.time}:00` : card.time}
//       img={card.img}
//       objectPosition={card.objectPosition}
//       tasks={card.tasks}
//     />
//   ))}
// </div>
// </main>





     

//       {/* Main content area */}
//       <main className="flex-grow p-6 z-10">
//         <h1 className="text-3xl font-bold mb-6">Playground</h1>
//         {/* Render sessions if needed */}
//       </main>

//       {/* Modal THE MAIN SESSION CREATION CARD*/}
//       {showModal && (
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: 50 }}
//           className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
//         >
//           <div className="w-full max-w-2xl bg-white/10 text-white p-8 rounded-3xl shadow-xl backdrop-blur-md relative">
//             <button
//               onClick={() => setShowModal(false)}
//               className="absolute top-4 right-4 text-white hover:text-red-400 text-xl font-bold"
//             >
//               ×
//             </button>

//             <h2 className="text-center text-2xl font-bold mb-6">Create New Session</h2>

//             <input
//               type="text"
//               placeholder="Title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full text-3xl font-semibold bg-transparent border-none outline-none placeholder-white/50 mb-14"
//             />

//             <div className="flex flex-col items-center mb-10 space-y-4">
//               <motion.div
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4 }}
//                 className="w-60 h-60 rounded-full bg-gradient-to-br from-white/10 to-white/5 shadow-[inset_0_0_10px_rgba(255,255,255,0.1),_0_10px_20px_rgba(0,0,0,0.3)] border border-white/20 flex items-center justify-center relative hover:shadow-amber-200 transition-all duration-300"
//               >
//                 <div className="absolute w-56 h-56 rounded-full border border-white/10" />
//                 <div className="flex items-center space-x-1 text-2xl font-bold tracking-widest z-10">
//                   {formatTime(Number(time)).split("").map((char, idx) =>
//                     char === ":" ? (
//                       <span key={idx} className="text-white">
//                         {char}
//                       </span>
//                     ) : (
//                       <span
//                         key={idx}
//                         className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-md shadow-inner text-white"
//                       >
//                         {char}
//                       </span>
//                     )
//                   )}
//                 </div>
//               </motion.div>

//               <div className="flex space-x-4">
//                 <button
//                   onClick={() => setTime((prev) => `${Math.max(0, Number(prev) + 60)}`)}
//                   className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md text-white text-sm"
//                 >
//                   +1 min
//                 </button>
//                 <button
//                   onClick={() => setTime((prev) => `${Math.max(0, Number(prev) - 60)}`)}
//                   className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md text-white text-sm"
//                 >
//                   -1 min
//                 </button>
//               </div>
//             </div>

//             <textarea
//               placeholder="Add a note..."
//               value={note}
//               onChange={(e) => setNote(e.target.value)}
//               className="w-full text-xl bg-transparent border-none outline-none placeholder-white/50 mb-8 resize-none"
//               rows={2}
//             />

//             <div className="mb-4">
//               {tasks.map((task, idx) => (
//                 <div key={idx} className="flex items-center gap-2 mb-2">
//                   <input
//                     type="text"
//                     placeholder={`To-do list item ${idx + 1}`}
//                     value={task}
//                     onChange={(e) => handleTaskChange(idx, e.target.value)}
//                     className="flex-grow text-lg bg-transparent border-none outline-none placeholder-white/30"
//                   />
//                   {tasks.length > 1 && (
//                     <button
//                       onClick={() => {
//                         const updated = [...tasks];
//                         updated.splice(idx, 1);
//                         setTasks(updated);
//                       }}
//                       className="text-white/50 hover:text-red-400 text-lg"
//                       title="Remove task"
//                     >
//                       Remove
//                     </button>
//                   )}
//                 </div>
//               ))}

//               <button
//                 onClick={addTask}
//                 className="text-white/60 text-sm hover:text-white transition"
//               >
//                 + Add Task
//               </button>
//             </div>

//             <div className="flex justify-center mt-8 bg-amber-100">
//               <button
//                 className="px-6 py-3 rounded-full bg-white hover:bg-amber-200 text-black text-sm font-semibold shadow-md"
//                 onClick={handleCreate}
//               >
//                 Create Session
//               </button>
//             </div>
//           </div>
//         </motion.div>
//       )}
//       {/* TILL HERE */}
//     </div>
//   );
// }

































































// import { motion } from "framer-motion";
// import TimerCard from "../../Components/TimerCard";
// import { useState } from "react";

// export default function Playground() {
//   const [showModal, setShowModal] = useState(false);
//   const [sessions, setSessions] = useState([]);

//   const [title, setTitle] = useState("");
//   const [note, setNote] = useState("");
//   const [tasks, setTasks] = useState([""]);
//   const [time, setTime] = useState("900");

//   const handleCreateSession = async (sessionData) => {
//     console.log("📦 Sending session data to backend:", sessionData);

//     const formData = new FormData();
//     formData.append("title", sessionData.title);
//     formData.append("note", sessionData.note);
//     formData.append("time", sessionData.time);

//     sessionData.tasks.forEach((task, index) => {
//       formData.append(`tasks[${index}]`, task);
//     });

//     try {
//       const res = await fetch("/api/createSession", {
//         method: "POST",
//         body: formData,
//       });

//       console.log("📨 Response status:", res.status);

//       if (!res.ok) throw new Error("Failed to create session");

//       const newSession = await res.json();
//       console.log("✅ Session created successfully:", newSession);
//       setSessions((prev) => [...prev, newSession]);
//     } catch (err) {
//       console.error("Error creating session:", err);
//     }
//   };

//   const handleTaskChange = (index, value) => {
//     const updated = [...tasks];
//     updated[index] = value;
//     setTasks(updated);
//   };

//   const addTask = () => {
//     setTasks([...tasks, ""]);
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
//     const secs = (seconds % 60).toString().padStart(2, "0");
//     return `${mins}:${secs}`;
//   };

//   const handleCreate = () => {
//     const sessionData = { title, note, tasks, time };
//     handleCreateSession(sessionData);
//     setShowModal(false);
//     // Reset form
//     setTitle("");
//     setNote("");
//     setTasks([""]);
//     setTime("900");
//   };

//   return (
//     <div className="min-h-screen w-full bg-black text-white flex relative">
//       {/* Background Blur */}
//       <div className="absolute inset-0 z-0 pointer-events-none">
//         <div className="w-full h-full bg-gradient-to-br from-amber-200/100 via-black to-purple-300 opacity-30" />
//       </div>

//       {/* Sidebar */}
//       <motion.aside
//         initial={{ x: -100, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         transition={{ duration: 0.8 }}
//         className="w-[25%] min-h-screen p-4 border-r border-white/10 bg-white/5 backdrop-blur-md"
//       >
//         <h2 className="text-xl font-semibold mb-4">Menu</h2>
//       </motion.aside>

//       {/* Main Content */}
//       <main className="w-[75%] min-h-screen p-6 z-10">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">Sessions</h1>
//           <motion.button
//             whileTap={{ scale: 0.9 }}
//             onClick={() => setShowModal(true)}
//             className="px-4 py-2 bg-white hover:bg-amber-200 rounded-full text-black text-sm shadow-md"
//           >
//             + New Session
//           </motion.button>
//         </div>

//         {/* Session Cards */}
//         <div className="grid grid-cols-2 gap-10">
//           {[...sessions,
//             {
//               title: "Study Session",
//               img: "/studying.png",
//               objectPosition: "object-[50%_80%]",
//               tasks: ["Read notes", "Summarize", "Highlight"],
//               time: "15:00",
//             },
//             {
//               title: "Workout",
//               img: "/exercise.png",
//               objectPosition: "object-[50%_85%]",
//               tasks: ["Pushups", "Squats", "Planks"],
//               time: "15:00",
//             },
//             {
//               title: "Creative Writing",
//               img: "/Painting.png",
//               objectPosition: "object-[50%_50%]",
//               tasks: ["Write 1 paragraph", "Edit last draft"],
//               time: "15:00",
//             },
//           ].map((card, idx) => (
//             <TimerCard
//               key={idx}
//               title={card.title}
//               time={typeof card.time === "number" ? `${card.time}:00` : card.time}
//               img={card.img}
//               objectPosition={card.objectPosition}
//               tasks={card.tasks}
//             />
//           ))}
//         </div>
//       </main>

//       {/* Modal */}
//       {showModal && (
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: 50 }}
//           className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
//         >
//           <div className="w-full max-w-2xl bg-white/10 text-white p-8 rounded-3xl shadow-xl backdrop-blur-md relative">
//             <button
//               onClick={() => setShowModal(false)}
//               className="absolute top-4 right-4 text-white hover:text-red-400 text-xl font-bold"
//             >
//               ×
//             </button>

//             <h2 className="text-center text-2xl font-bold mb-6">Create New Session</h2>

//             {/* Title Input */}
//             <input
//               type="text"
//               placeholder="Title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full text-3xl font-semibold bg-transparent border-none outline-none placeholder-white/50 mb-14"
//             />

//             {/* Time Selector */}
//             <div className="flex flex-col items-center mb-10 space-y-4">
//               <motion.div
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4 }}
//                 className="w-60 h-60 rounded-full bg-gradient-to-br from-white/10 to-white/5 shadow-[inset_0_0_10px_rgba(255,255,255,0.1),_0_10px_20px_rgba(0,0,0,0.3)] border border-white/20 flex items-center justify-center relative hover:shadow-amber-200 transition-all duration-300"
//               >
//                 <div className="absolute w-56 h-56 rounded-full border border-white/10" />
//                 <div className="flex items-center space-x-1 text-2xl font-bold tracking-widest z-10">
//                   {formatTime(Number(time)).split("").map((char, idx) =>
//                     char === ":" ? (
//                       <span key={idx} className="text-white">{char}</span>
//                     ) : (
//                       <span key={idx} className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-md shadow-inner text-white">{char}</span>
//                     )
//                   )}
//                 </div>
//               </motion.div>

//               <div className="flex space-x-4">
//                 <button
//                   onClick={() => setTime((prev) => `${Math.max(0, Number(prev) + 60)}`)}
//                   className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md text-white text-sm"
//                 >
//                   +1 min
//                 </button>
//                 <button
//                   onClick={() => setTime((prev) => `${Math.max(60, Number(prev) - 60)}`)}
//                   className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md text-white text-sm"
//                 >
//                   -1 min
//                 </button>
//               </div>
//             </div>

//             {/* Note Input */}
//             <textarea
//               placeholder="Add a note..."
//               value={note}
//               onChange={(e) => setNote(e.target.value)}
//               className="w-full text-xl bg-transparent border-none outline-none placeholder-white/50 mb-8 resize-none"
//               rows={2}
//             />

//             {/* Tasks */}
//             <div className="mb-6 space-y-3">
//               {tasks.map((task, index) => (
//                 <input
//                   key={index}
//                   type="text"
//                   value={task}
//                   onChange={(e) => handleTaskChange(index, e.target.value)}
//                   placeholder={`Task ${index + 1}`}
//                   className="w-full bg-white/10 placeholder-white/50 p-2 rounded-md"
//                 />
//               ))}
//               <button
//                 onClick={addTask}
//                 className="text-sm text-amber-300 hover:text-amber-400"
//               >
//                 + Add Task
//               </button>
//             </div>

//             <button
//               onClick={handleCreate}
//               className="w-full bg-amber-200 hover:bg-amber-300 text-black font-semibold py-3 rounded-xl transition"
//             >
//               Create Session
//             </button>
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// }













