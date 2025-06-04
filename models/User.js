// C:\Users\User\VisualStudioProjects\AdVideo\advideo_nextjs\models\User.js

// models/User.js
//const mongoose = require('mongoose');
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({            //Defines a new schema for the User model. The schema defines the structure of the documents that will be stored in the MongoDB collection
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  CurrentPlan: { type: String, enum: ['basic', 'pro'], default: 'basic' },
  dailySessionCount: { type: Number, default: 0 }, // tracks usage per day
  lastSessionDate: { type: Date }, // resets count daily
});

//module.exports = mongoose.models.User || mongoose.model('User', UserSchema);  //Exports the User model. If the User model already exists in the mongoose.models cache, it reuses it; otherwise, it creates a new model.


const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;