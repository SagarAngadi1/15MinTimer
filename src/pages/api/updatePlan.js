// src/pages/api/updatePlan.js
import connectToDatabase from '../../../utils/mongoose';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId } = req.body;

  try {
    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.CurrentPlan = 'pro';
    await user.save();

    res.status(200).json({ success: true, message: 'Plan updated to Pro' });
  } catch (error) {
    console.error('Plan update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
