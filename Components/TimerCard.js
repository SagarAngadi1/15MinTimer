// import { motion } from "framer-motion";
// import { FaStopwatch } from "react-icons/fa";

// export default function TimerCard({ title, time, checklist = [] }) {
//   return (
//     <motion.div
//       whileHover={{ scale: 1.02 }}
//       className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-md shadow-purple-500/10 flex flex-col gap-3"
//     >
//       <div className="flex items-center justify-between">
//         <h3 className="text-lg text-white font-semibold">{title}</h3>
//         <motion.div
//           animate={{ rotate: [0, 360] }}
//           transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
//         >
//           <FaStopwatch className="text-cyan-400 text-xl" />
//         </motion.div>
//       </div>

//       <ul className="text-sm text-white/70 list-disc list-inside space-y-1">
//         {checklist.map((item, idx) => (
//           <li key={idx}>{item}</li>
//         ))}
//       </ul>

//       <div className="text-right text-xs text-white/50 italic">{time}</div>
//     </motion.div>
//   );
// }












import { motion } from "framer-motion";
import { FaStopwatch } from "react-icons/fa";

export default function TimerCard({ title, time, tasks = [], img, objectPosition = "object-center", onClick  }) {
  return (
    
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onClick={onClick}
      className="relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-5 overflow-hidden shadow-lg hover:shadow-purple-400 transition-all duration-300"
    >
      <div className="me-3 mt-1 absolute top-5 right-3 bg-black/50 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
        {time}
      </div>

      <img
        src={img}
        alt={title}
        className={`w-full h-72 object-cover rounded-xl mb-4 border border-white/10 ${objectPosition}`}
      />

      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>

      {/* <ul className="text-sm text-gray-300 space-y-2">
        {tasks.map((task, i) => (
          <li key={i} className="flex items-start gap-2">
            <input type="checkbox" className="accent-amber-200 mt-1" />
            <span>{task}</span>
          </li>
        ))}
      </ul> */}

      <ul className="text-sm text-gray-300 space-y-2">
  {tasks.map((task, i) => (
    <li key={i} className="flex items-start gap-3">
      <label className="flex items-center gap-2 cursor-pointer group">
        <input
          type="checkbox"
          className="peer hidden"
        />
        <div className="w-4 h-4 rounded-md border border-gray-400 peer-checked:bg-amber-200 flex items-center justify-center transition">
          {/* Checkmark (✓) inside the box */}
          <svg
            className="w-3 h-3 text-black opacity-0 peer-checked:opacity-100 transition"
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
  );
}
