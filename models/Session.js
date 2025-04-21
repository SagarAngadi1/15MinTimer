//import mongoose from 'mongoose';
// const mongoose = require('mongoose');

// const SessionSchema = new mongoose.Schema({
//     inputDetails: { type: String, default: '',}, // Stores user input on how they want the photo
//     productPhoto: { type: String, default: '' }, // Path to the uploaded product photo
//     referencePhoto: { type: String, default: '' },  // Path to the uploaded reference photo (optional)
// },
// { timestamps: true });

// //export default mongoose.models.Photography || mongoose.model('Photography', PhotographySchema);
// module.exports = mongoose.models.Session || mongoose.model('Session', SessionSchema);


// models/Session.js

import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  //identity: { type: String, required: true, default: '', },

  title: { type: String, required: true, default: '', },
  note: { type: String, default: '', },
  time: { type: Number, required: true, default: '', }, // time in seconds
  tasks: [{ type: String, default: '',}],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Session || mongoose.model("Session", SessionSchema);
