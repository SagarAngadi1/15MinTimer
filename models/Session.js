// import mongoose from "mongoose";

// const SessionSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   createdDate: { type: String, default: '' },
//   title: { type: String, required: true, default: '', },
//   note: { type: String, default: '', },
//   time: { type: Number, required: true, default: '', }, // time in seconds
//   tasks: [{ type: String, default: '',}],
//   createdAt: { type: Date, default: Date.now },

// });

// export default mongoose.models.Session || mongoose.model("Session", SessionSchema);





import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  done: { type: Boolean, default: false },
}, { _id: false }); // _id false = don’t generate sub-ids for each task

const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdDate: { type: String, default: '' },
  title: { type: String, required: true, default: '', },
  note: { type: String, default: '', },
  time: { type: Number, required: true, default: '', }, // time in seconds
  tasks: [TaskSchema], // <- updated to accept { text, done } objects
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Session || mongoose.model("Session", SessionSchema);
