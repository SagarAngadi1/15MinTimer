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
        <div 
        //className="w-4 h-4 rounded-md border border-gray-400 peer-checked:bg-amber-200 flex items-center justify-center transition">
          

          className={`w-4 h-4 rounded-md border border-gray-400 peer-checked:bg-amber-200 flex items-center justify-center transition
            ${
              task.done
                ? "bg-amber-400 border-amber-400"
                : "border-white/30 hover:border-amber-300"
            }`
          }
        >  
        
        
        {/* className={`w-5 h-5 min-w-[20px] min-h-[20px] border-2 rounded-md flex items-center justify-center cursor-pointer transition-all duration-200
            ${
              task.done
                ? "bg-amber-400 border-amber-400"
                : "border-white/30 hover:border-amber-300"
            }`
          }
        >   */}





        {/* Checkmark (✓) inside the box */}


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



          {/* <svg
            className="w-3 h-3 text-black opacity-0 peer-checked:opacity-100 transition"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg> */}
        </div>
        <span className="select-none">{task.text}</span>
      </label>
    </li>
  ))}
</ul>

    </motion.div>
  );
}
