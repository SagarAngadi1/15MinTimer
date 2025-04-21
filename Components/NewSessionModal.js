// Components/NewSessionModal.js

import { motion } from "framer-motion";
import { useState } from "react";

export default function NewSessionModal({ onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [tasks, setTasks] = useState([""]);
  const [time, setTime] = useState("900");


  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };



  const handleCreate = () => {
    const sessionData = {
      title,
      note,
      tasks,
      time,
    };
    onCreate(sessionData);  // ⬅️ Trigger parent with data
    onClose();   // ⬅️ Close modal 
    

    console.log("🧪 Create button clicked");
console.log("Session Data:", {
  title,
  note,
  tasks,
  time,
});
console.log("Triggering onCreate with session data...");

  };




  const handleTaskChange = (index, value) => {
    const updated = [...tasks];
    updated[index] = value;
    setTasks(updated);
  };

  const addTask = () => {
    setTasks([...tasks, ""]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="w-full max-w-2xl bg-white/10 text-white p-8 rounded-3xl shadow-xl backdrop-blur-md relative">

        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-red-400 text-xl font-bold">×</button>

        {/* Title */}
        <h2 className="text-center text-2xl font-bold mb-6">Create New Session</h2>

        {/* Editable Title */}
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
    className="w-60 h-60 rounded-full bg-gradient-to-br from-white/10 to-white/5 
               shadow-[inset_0_0_10px_rgba(255,255,255,0.1),_0_10px_20px_rgba(0,0,0,0.3)] 
               border border-white/20 flex items-center justify-center relative
               hover:shadow-amber-200 transition-all duration-300"
  >
    {/* Inner glow ring */}
    <div className="absolute w-56 h-56 rounded-full border border-white/10" />

    {/* Time digits */}
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

  {/* Buttons */}
  <div className="flex space-x-4">
    <button
      onClick={() => setTime(prev => `${Math.max(0, Number(prev) + 60)}`)}
      className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md text-white text-sm"
    >
      +1 min
    </button>
    <button
      onClick={() => setTime(prev => `${Math.max(0, Number(prev) - 60)}`)}
      className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md text-white text-sm"
    >
      -1 min
    </button>
  </div>
</div>




        {/* Editable Note */}
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

  {/* Add Task Button */}
  <button
    onClick={addTask}
    className="text-white/60 text-sm hover:text-white transition"
  >
    + Add Task
  </button>
</div>

        {/* Create Button */}
        <div className="flex justify-center mt-8 bg-amber-100">
          <button
            className="px-6 py-3 rounded-full bg-white hover:bg-amber-200 text-black text-sm font-semibold shadow-md"
            onClick={handleCreate}
          >
            Create Session
          </button>
        </div>
      </div>
    </motion.div>
  );
}














































// import { motion } from "framer-motion";
// import { useState } from "react";

// export default function NewSessionModal({ onClose, onCreate }) {
//   const [title, setTitle] = useState("");
//   const [time, setTime] = useState(15);
//   const [note, setNote] = useState("");
//   const [checklist, setChecklist] = useState([]);
//   const [taskInput, setTaskInput] = useState("");

//   const addTask = () => {
//     if (taskInput.trim() !== "") {
//       setChecklist([...checklist, taskInput]);
//       setTaskInput("");
//     }
//   };

//   const removeTask = (index) => {
//     setChecklist(checklist.filter((_, i) => i !== index));
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -50 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
//     >
//       <div className="bg-white/10 text-white rounded-2xl p-6 w-[500px] shadow-xl border border-white/10 backdrop-blur-lg relative">

//         <h2 className="text-xl font-semibold mb-4">Create New Session</h2>

//         <div className="space-y-4">
//           <div>
//             <label className="block mb-1 text-sm">Title</label>
//             <input
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none"
//               placeholder="e.g. Study Session"
//             />
//           </div>

//           <div>
//             <label className="block mb-1 text-sm">Time (minutes)</label>
//             <input
//               type="number"
//               value={time}
//               onChange={(e) => setTime(e.target.value)}
//               className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none"
//               min={1}
//             />
//           </div>

//           <div>
//             <label className="block mb-1 text-sm">Note</label>
//             <textarea
//               value={note}
//               onChange={(e) => setNote(e.target.value)}
//               className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none"
//               placeholder="Write a short note for this session..."
//               rows={3}
//             />
//           </div>

//           <div>
//             <label className="block mb-1 text-sm">Checklist</label>
//             <div className="flex gap-2 mb-2">
//               <input
//                 value={taskInput}
//                 onChange={(e) => setTaskInput(e.target.value)}
//                 className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none"
//                 placeholder="Add a task"
//               />
//               <button
//                 onClick={addTask}
//                 className="px-4 py-2 bg-amber-200 text-black rounded-lg text-sm"
//               >
//                 Add
//               </button>
//             </div>

//             <ul className="list-disc pl-5 space-y-1 text-sm">
//               {checklist.map((task, idx) => (
//                 <li key={idx} className="flex justify-between items-center">
//                   {task}
//                   <button
//                     onClick={() => removeTask(idx)}
//                     className="text-red-400 text-xs ml-2 hover:underline"
//                   >
//                     Remove
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         <div className="flex justify-end mt-6 gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-sm"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() =>
//               onCreate({
//                 title,
//                 time,
//                 note,
//                 tasks: checklist,
//               })
//             }
//             className="px-4 py-2 bg-amber-200 text-black rounded-lg text-sm"
//           >
//             Create
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   );
// }
