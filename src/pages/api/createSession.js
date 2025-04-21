// pages/api/createSession.js
import connectToDatabase from "../../../utils/mongoose";
import Session from "../../../models/Session";
import formidable from "formidable";
import fs from 'fs';
import path from 'path';
import User from '../../../models/User';              // Importing the User model
import axios from 'axios'; // Import axios for making the request to FastAPI

export const config = {
  api: {
    bodyParser: false, // ⬅️ Important because you're using FormData
  },
};




const handler = async (req, res) =>{
  console.log("🚀 Hit /api/createSession endpoint");  // ⬅️
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const form = formidable({
    uploadDir: path.join(process.cwd(), '/public/uploads'), // Directory where files will be uploaded
    keepExtensions: true, // Keep file extensions
    multiples: true, // Allow multiple file uploads (productPhoto, referencePhoto)
  });


 // const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form:", err);
      return res.status(500).json({ error: "Error parsing form" });
    }



    try {

     await connectToDatabase();

     const userId = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId;
     const user = await User.findById(userId);

     console.log('Current UserID:', userId);
     console.log('Current User:', user);

     if (!user) {
        console.log('Error: User not found ');
        return res.status(404).json({ message: 'User not found' });

      }

      const sessionTitle = Array.isArray(fields.title) ? fields.title[0] : fields.title;
      const sessionNote = Array.isArray(fields.note) ? fields.note[0] : fields.note;
      const sessionTime = Array.isArray(fields.time) ? fields.time[0] : fields.time;


      console.log('Session Title:', sessionTitle);
      console.log('Session Note:', sessionNote);
      console.log('Session Time:', sessionTime);



      //const { title, note, time } = fields;
      const tasks = [];

      for (const key in fields) {
        if (key.startsWith("tasks[")) {
          const value = fields[key];
          if (Array.isArray(value)) {
            tasks.push(...value.map(String)); // Flatten inner array and cast to string
          } else {
            tasks.push(String(value));
          }
        }
      }
      



      const newSession = new Session({
        //identity: userId,
        title: sessionTitle,
        note: sessionNote,
        //time: Number(time),
        time: sessionTime,
        tasks,
        userId: userId,
      });

      await newSession.save();

      //return res.status(201).json(newSession);

      return res.status(201).json({
        success: true,
        data: newSession, 
     }); 
    } catch (error) {
      console.error("Error creating session:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
}

export default handler;
