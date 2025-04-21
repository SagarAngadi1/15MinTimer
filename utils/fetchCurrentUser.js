// //This file is responsible for retrieving the current authenticated user based on the JWT.
// //This function is used within server-side code, like in the getServerSideProps function in CreateAd.js, to fetch the current user's data before rendering the page.
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import User from '../models/User';
import connectToDatabase from './mongoose';
//import dbConnect from '../utils/dbConnect';

const JWT_SECRET = process.env.JWT_SECRET || 'Timer$$$project1setcretyeK795$$$';

const fetchCurrentUser = async (req) => {
  await connectToDatabase();

  if (!req || !req.headers || !req.headers.cookie) {
    console.warn('Missing request headers or cookies');
    return null;
  }

  //const token = req.cookies.token;
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.token;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
};

export default fetchCurrentUser;














// import jwt from 'jsonwebtoken';
// import cookie from 'cookie';
// import User from '../models/User';
// import connectToDatabase from './mongoose';

// const JWT_SECRET = process.env.JWT_SECRET || 'Timer$$$project1setcretyeK795$$$';

// const fetchCurrentUser = async (req) => {
//   await connectToDatabase();

//   // ✅ Safeguard against missing request or headers
//   if (!req || !req.headers || !req.headers.cookie) {
//     console.warn('Missing request headers or cookies');
//     return null;
//   }

//   let token = null;

//   try {
//     const cookies = cookie.parse(req.headers.cookie || '');
//     token = cookies.token;
//   } catch (err) {
//     console.error('Failed to parse cookies:', err);
//     return null;
//   }

//   if (!token) {
//     return null;
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     const user = await User.findById(decoded.userId).lean(); // Optional `.lean()` for perf

//     return user || null;
//   } catch (error) {
//     console.error('Error verifying token or fetching user:', error);
//     return null;
//   }
// };

// export default fetchCurrentUser;
