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




      // let rawTasks = fields.tasks || [];
      // if (!Array.isArray(rawTasks)) rawTasks = [rawTasks];

      // const tasks = rawTasks.map(task => ({
      //    text: String(task),
      //    done: false,
      // }));


      let rawTasks = fields.tasks || [];
      if (!Array.isArray(rawTasks)) rawTasks = [rawTasks];

     const cleanedTasks = rawTasks
    .map(task => String(task).trim())
    .filter(task => task.length > 0)
    .map(task => ({ text: task, done: false }));


      


    const createdDate = new Date().toISOString();




    const newSessionData = {
       title: sessionTitle,
         note: sessionNote,
        time: Number(sessionTime),
        userId: userId,
        createdDate: createdDate,
    };

    if (cleanedTasks.length > 0) {
      newSessionData.tasks = cleanedTasks;
    }

    const newSession = new Session(newSessionData);
    await newSession.save();





      // const newSession = new Session({
      //   title: sessionTitle,
      //   note: sessionNote,
      //   time: Number(sessionTime),
      //   tasks,
      //   userId: userId,
      //   createdDate: createdDate,

      // });
      // await newSession.save();

      

      return res.status(201).json({

        success: true,
        data: newSession, 
        createdDate: createdDate,

     }); 
    } catch (error) {
      console.error("Error creating session:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
}

export default handler;
