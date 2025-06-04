import Session from '../../../models/Session';
import connectToDatabase from '../../../utils/mongoose';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { sessionId, taskText, done } = req.body;

  if (!sessionId || typeof taskText !== 'string' || typeof done !== 'boolean') {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    await connectToDatabase();

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const task = session.tasks.find(t => t.text === taskText);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.done = done;
    await session.save();

    return res.status(200).json({ success: true, updatedSession: session });
  } catch (err) {
    console.error('Error updating task status:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
