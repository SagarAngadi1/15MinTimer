import { useRouter } from 'next/router';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

export default function WorkSpace() {
  const router = useRouter();

  const { createdAt, sessionId, title, note, time, tasks: rawTasks } = router.query;

 

  const tasks = JSON.parse(rawTasks || "[]");
  const parsedTime = parseInt(time || "900"); // default 15 mins

   const [session, setSession] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [key, setKey] = useState(0); // reset timer logic
  const [isPlaying, setIsPlaying] = useState(true);

  const [initialTime, setInitialTime] = useState(null);


   const latestRemainingTimeRef = useRef(null);

  console.log("✅ CreatedAt Time:", createdAt);
  console.log("✅ sessionId:", sessionId);





 // ⚡ Try to load persisted state
   useEffect(() => {
    const stored = localStorage.getItem(`session-${sessionId}`);
    if (stored) {
      const { timeLeft: savedTime, isPlaying: savedPlaying } = JSON.parse(stored);
      setTimeLeft(savedTime);
      setInitialTime(savedTime);
      setIsPlaying(savedPlaying);
      latestRemainingTimeRef.current = savedTime;
      console.log('⏳ Loaded from localStorage:', savedTime, savedPlaying);
      return;
    }

    // Initial calculation based on createdAt if no saved state
    if (!createdAt || !time) return;

    const createdDate = new Date(createdAt);
    const now = new Date();
    const elapsed = Math.floor((now - createdDate) / 1000);
    const remaining = Math.max(parseInt(time) - elapsed, 0);

    setTimeLeft(remaining);
    setInitialTime(remaining);
    latestRemainingTimeRef.current = remaining;
  }, [createdAt, time, sessionId]);






  // 💾 Save on unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (latestRemainingTimeRef.current !== null && sessionId) {
        localStorage.setItem(`session-${sessionId}`, JSON.stringify({
          timeLeft: latestRemainingTimeRef.current,
          isPlaying
        }));
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isPlaying, sessionId]);







  const initialTasks = Array.isArray(tasks)
  ? tasks.map(t => ({ text: t, done: false }))
  : typeof tasks === "string"
  ? [{ text: tasks, done: false }]
  : [];

const [noteText, setNoteText] = useState(note || "");
//const [editableTasks, setEditableTasks] = useState(initialTasks);





// Sync note from query on reload
useEffect(() => {
  setNoteText(note || "");
}, [note]);









const [editableTasks, setEditableTasks] = useState(() => {
  try {
    const parsed = JSON.parse(rawTasks || "[]");
    return Array.isArray(parsed)
      ? parsed.map(t => ({
          text: t.text || t,
          done: typeof t.done === "boolean" ? t.done : false,
          saved: true,
        }))
      : typeof parsed === "string"
      ? [{ text: parsed, done: false, saved: true }]
      : [];
  } catch {
    return [];
  }
});




  useEffect(() => {
  async function fetchSessionData() {
    if (!sessionId) return;

    try {
      const res = await fetch('/api/getSessionById', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await res.json();

      if (data.success) {
        const session = data.session;
        setSession(session);

        // ✅ Update editableTasks from DB
        const dbTasks = session.tasks.map(t => ({
          text: t.text,
          done: t.done,
          saved: true,
        }));
        setEditableTasks(dbTasks);
      }
    } catch (err) {
      console.error("❌ Error fetching session data:", err.message);
    }
  }

  fetchSessionData();
}, [sessionId]);


















  //REMOVE THIS AND CHECK
//   useEffect(() => {
//   try {
//     const newTasks = JSON.parse(router.query.tasks || "[]");
//     const formattedTasks = Array.isArray(newTasks)
//       ? newTasks.map(t => ({
//           text: t.text || t,
//           done: typeof t.done === "boolean" ? t.done : false,
//           saved: true,
//         }))
//       : typeof newTasks === "string"
//       ? [{ text: newTasks, done: false, saved: true }]
//       : [];
//     setEditableTasks(formattedTasks);
//   } catch {
//     setEditableTasks([]);
//   }
// }, [router.query.tasks]);







  const updateTaskText = (index, newText) => {
    const updated = [...editableTasks];
    updated[index].text = newText;
    setEditableTasks(updated);
  };



  const toggleTaskDone = async (index) => {
  const updated = [...editableTasks];
  updated[index].done = !updated[index].done;
  setEditableTasks(updated);

  // Sync the updated task with backend
  const taskToUpdate = updated[index];

  if (sessionId) {
    await updateTaskDoneStatus(sessionId, taskToUpdate.text, taskToUpdate.done);

    //await persistTaskToBackend(sessionId, taskToUpdate);
  }
};



//   const addTask = async () => {
//   const newTask = { text: "", done: false };
//   setEditableTasks(prev => [...prev, newTask]);

//   // Immediately persist empty task (or you can wait for user to type, optional)
//   if (sessionId) {
//     const saved = await persistTaskToBackend(sessionId, newTask);
//     if (saved) {
//       console.log("✅ Task saved to DB.");
//     }
//   }
// };


const addTask = () => {
  const newTask = { text: "", done: false, saved: false };
  setEditableTasks(prev => [...prev, newTask]);
};



const saveTask = async (index) => {
  const task = editableTasks[index];
  if (!task.text.trim()) return;

  const updatedSession = await persistTaskToBackend(sessionId, task);

  if (updatedSession) {
    const updated = [...editableTasks];
    updated[index].saved = true;
    setEditableTasks(updated);
  }
};






  async function persistTaskToBackend(sessionId, task) {
  try {
    const response = await fetch("/api/updateTask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        newTask: {
          text: task.text,
          done: task.done,
        },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to persist task");
    }

    return result.updatedSession;
  } catch (err) {
    console.error("❌ Error saving task:", err.message);
    return null;
  }
}




async function updateTaskDoneStatus(sessionId, taskText, done) {
  try {
    const response = await fetch("/api/toggleTaskStatus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        taskText,
        done,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update task status");
    }

    return result.updatedSession;
  } catch (err) {
    console.error("❌ Error toggling task status:", err.message);
    return null;
  }
}








  const formatTime = (remainingSeconds) => {
    const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
    const seconds = String(remainingSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };
  

    // ⏯ Pause/Resume button logic
  const togglePlay = () => {
    const current = latestRemainingTimeRef.current;
    setIsPlaying((prev) => {
      const newIsPlaying = !prev;
      if (current !== null && sessionId) {
        localStorage.setItem(`session-${sessionId}`, JSON.stringify({
          timeLeft: current,
          isPlaying: newIsPlaying
        }));
      }
      return newIsPlaying;
    });
  };


   const handleReset = () => {
    setIsPlaying(false);
    setKey(prev => prev + 1);
    setTimeLeft(initialTime);
    latestRemainingTimeRef.current = initialTime;

    if (sessionId) {
      localStorage.setItem(`session-${sessionId}`, JSON.stringify({
        timeLeft: initialTime,
        isPlaying: false
      }));
    }
  };













  return (
    <div className="min-h-screen w-full bg-black text-white flex relative">

      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-amber-200/100 via-black to-purple-300 opacity-30"></div>
      </div>

      {/* Side Menu */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-[25%] min-h-screen p-4 border-r border-white/10 bg-white/5 backdrop-blur-md z-10"
      >
        <h2 className="text-xl font-semibold mb-4">Work Space</h2>
        <button onClick={() => router.back()} className="text-sm text-amber-300 hover:underline">← Back to Sessions</button>

        


{/* Editable Note */}
<div className="mt-10">
          <h2 className="text-xl font-semibold mb-2">Note</h2>
          <textarea
            className="w-full p-2 bg-white/10 text-white/90 rounded-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            rows={5}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write your note here..."
          />
        </div>






{/* Editable Tasks */}
<div className="mt-8">
  <h2 className="text-xl font-semibold mb-2">Tasks</h2>
  <ul className="space-y-3">
    {editableTasks.map((task, idx) => (
      <li
        key={idx}
        className="flex items-center justify-between gap-3 p-3 bg-white/5 rounded-lg border border-white/10 shadow-sm hover:shadow-md transition"
      >
        {/* Custom Checkbox */}
        <div
          onClick={() => toggleTaskDone(idx)}
          className={`w-5 h-5 min-w-[20px] min-h-[20px] border-2 rounded-md flex items-center justify-center cursor-pointer transition-all duration-200
            ${
              task.done
                ? "bg-amber-400 border-amber-400"
                : "border-white/30 hover:border-amber-300"
            }`}
        >
          {task.done && (
            <svg
              className="w-3 h-3 text-black"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        {/* Task Text Input */}
        <input
          className="bg-transparent text-white/90 border-b border-white/20 focus:outline-none focus:border-amber-400 w-full ml-3"
          value={task.text}
          onChange={(e) => updateTaskText(idx, e.target.value)}
        />



      {/* Save Button */}
  {!task.saved && task.text.trim() !== "" &&
   (
    <button
      onClick={() => saveTask(idx)}
      className="ml-2 px-2 py-1 text-xs text-black bg-amber-400 rounded hover:bg-amber-300"
    >
      Save
    </button>
  )}
      </li>
    ))}
  </ul>


  <button
    onClick={addTask}
    className="mt-4 text-sm text-amber-300 hover:underline"
  >
    + Add Task
  </button>

  
</div>







      </motion.aside>

      {/* Main Content */}
      <main className="w-[75%] min-h-screen flex flex-col items-center justify-center p-10 z-10 relative">

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 p-10 rounded-3xl shadow-2xl backdrop-blur-xl w-full max-w-4xl flex flex-col items-center"
        >
          {/* Title */}
          <h1 className="text-3xl font-bold mb-8 text-center">{title || "Untitled Session"}</h1>

          

          {/* Circular Timer */}
          <div className="mb-8">

            <CountdownCircleTimer
              isPlaying={isPlaying}
              //duration={parsedTime}
              duration={timeLeft}
              key={key}
              colors={['#FACC15', '#F97316', '#EF4444']}
              colorsTime={[parsedTime, parsedTime * 0.5, 0]}
              size={300}
              strokeWidth={16}
              trailColor="#ffffff20"

              // onUpdate={(remaining) => {
              //  setTimeLeft(remaining); // 🧠 Track latest time left
              // }}


              onComplete={() => {
                setIsPlaying(false);
                return { shouldRepeat: false };
              }}


            >
            

                {({ remainingTime }) => {
              latestRemainingTimeRef.current = remainingTime;
              return (
                <div className="text-4xl font-bold">
                  {formatTime(remainingTime)}
                </div>
              );
            }}
            </CountdownCircleTimer>
          </div>



          

          {/* Timer Control Buttons */}
          





           {/* Timer Control Buttons */}
      <div className="mt-10 space-x-4">
        <button
          className="px-5 py-2 bg-white text-black rounded-full hover:bg-amber-200 shadow"
          onClick={togglePlay}
        >
          {isPlaying ? "Pause" : "Resume"}
        </button>

        <button
          className="px-5 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>





        </motion.div>
      </main>
    </div>
  );
}
