// import Session from '../../../models/Session';
// import connectToDatabase from '../../../utils/mongoose';


// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   //const { sessionId, newTask, checked } = req.body;
//   const { sessionId, newTask } = req.body;


//   if (
//   !sessionId ||
//   !newTask ||
//   typeof newTask.text !== 'string' ||
//   typeof newTask.done !== 'boolean'
// ) {
//   return res.status(400).json({ message: 'Missing or invalid task format' });
// }


//   try {
//     await connectToDatabase();

//     const session = await Session.findById(sessionId);

//     if (!session) {
//       return res.status(404).json({ message: 'Session not found' });
//     }


//     session.tasks.push({
//     text: newTask.text,
//     done: newTask.done
//     });

//     await session.save();

//     //await session.save();


//     return res.status(200).json({ success: true, updatedSession: session });
//   } catch (err) {
//     console.error('Error updating session:', err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// }





































import Session from '../../../models/Session';
import connectToDatabase from '../../../utils/mongoose';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { sessionId, newTask } = req.body;

  if (
    !sessionId ||
    !newTask ||
    typeof newTask.text !== 'string' ||
    typeof newTask.done !== 'boolean'
  ) {
    return res.status(400).json({ message: 'Missing or invalid task format' });
  }

  try {
    await connectToDatabase();

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // 🔍 Find task with the same text and update its 'done' status
    const task = session.tasks.find(t => t.text === newTask.text);
    if (task) {
      task.done = newTask.done;
    } else {
      // ✅ Only add if it doesn't exist (like a new task being added)
      session.tasks.push(newTask);
    }

    await session.save();

    return res.status(200).json({ success: true, updatedSession: session });
  } catch (err) {
    console.error('Error updating session:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
