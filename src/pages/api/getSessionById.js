import connectToDatabase from '../../../utils/mongoose';
import Session from '../../../models/Session';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { sessionId } = req.body;

  if (!sessionId) return res.status(400).json({ message: 'Missing sessionId' });

  try {
    await connectToDatabase();

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    return res.status(200).json({ success: true, session });
  } catch (err) {
    console.error('❌ Error fetching session by ID:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
}
