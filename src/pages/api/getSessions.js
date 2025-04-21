import connectToDatabase from "../../../utils/mongoose";
import Session from "../../../models/Session";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { userId } = req.body;

  try {
    await connectToDatabase();

    const userSessions = await Session.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, sessions: userSessions });
  } catch (err) {
    console.error("Error fetching sessions:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
