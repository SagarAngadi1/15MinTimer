// // api/checkSessionLimit.js
// import connectToDatabase from "../../../utils/mongoose";
// import User from '../../../models/User';              // Importing the User model



// //export default async function checkSessionLimit(userId) {


// export default async function handler(req, res) {    

// if (req.method !== 'POST') return res.status(405).end();

// const { userId } = req.body;
  

// await connectToDatabase();

//   const user = await User.findById(userId);
//   if (!user) throw new Error('User not found');

//   const today = new Date().toDateString();
//   const lastSessionDate = user.lastSessionDate ? user.lastSessionDate.toDateString() : null;

//   if (user.CurrentPlan === 'pro') {
//     return { allowed: true };
//   }

//   if (today !== lastSessionDate) {
//     // Reset the session count for a new day
//     user.dailySessionCount = 0;
//     user.lastSessionDate = new Date();
//     await user.save();
//   }

//   if (user.dailySessionCount >= 4) {
//     return { allowed: false, message: 'Daily session limit reached for free plan.' };
//   }

//   user.dailySessionCount += 1;
//   await user.save();

//   return { allowed: true };
// }





import connectToDatabase from "../../../utils/mongoose";
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.body;

  try {
    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ allowed: false, message: 'User not found' });
    }

    const today = new Date().toDateString();
    const lastSessionDate = user.lastSessionDate ? user.lastSessionDate.toDateString() : null;

    if (user.CurrentPlan === 'pro') {
      return res.status(200).json({ allowed: true });
    }

    if (today !== lastSessionDate) {
      // Reset the session count for a new day
      user.dailySessionCount = 0;
      user.lastSessionDate = new Date();
    }

    if (user.dailySessionCount >= 4) {
      return res.status(403).json({ allowed: false, message: 'Daily session limit reached for free plan. Please Subscribe To Pro For Unlimited Sessions' });
    }

    user.dailySessionCount += 1;
    await user.save();

    return res.status(200).json({ allowed: true });
  } catch (err) {
    console.error('❌ checkSessionLimit error:', err);
    return res.status(500).json({ allowed: false, message: 'Internal Server Error' });
  }
}

