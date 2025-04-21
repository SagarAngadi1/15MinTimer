//This file is responsible for retrieving the current authenticated user based on the JWT.
//This function is used within server-side code, like in the getServerSideProps function in CreateAd.js, to fetch the current user's data before rendering the page.
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import User from '../models/User';
import connectToDatabase from './mongoose';
//import dbConnect from '../utils/dbConnect';

const JWT_SECRET = process.env.JWT_SECRET || 'Timer$$$project1setcretyeK795$$$';

const fetchCurrentUser = async (req) => {
  await connectToDatabase();

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
    return null;
  }
};

export default fetchCurrentUser;
