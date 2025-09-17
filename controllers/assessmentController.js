import { Assessment, UserAssessment } from "../models/assessmentModel.js";
import User from "../models/userModel.js";

// List all assessments
export const listAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find();
    res.json(assessments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Start an assessment session
export const startAssessment = async (req, res) => {
  try {
    const postgresUserId = req.user.id;

    // Validate that the user exists in PostgreSQL
    const user = await User.findById(postgresUserId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { assessmentId } = req.body;

    const session = await UserAssessment.create({
      user_id: postgresUserId,
      assessment_id: assessmentId,
      status: "in-progress"
    });

    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Submit assessment results
export const submitAssessment = async (req, res) => {
  try {
    const postgresUserId = req.user.id;

    // Validate user
    const user = await User.findById(postgresUserId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { assessmentId, score, status } = req.body;

    const updated = await UserAssessment.findOneAndUpdate(
      { user_id: postgresUserId, assessment_id: assessmentId, status: "in-progress" },
      { score, status, date: new Date() },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all assessments for a user
export const getUserAssessments = async (req, res) => {
  try {
    const postgresUserId = req.user.id;

    const user = await User.findById(postgresUserId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const userAssessments = await UserAssessment.find({ user_id: postgresUserId }).populate("assessment_id");
    res.json(userAssessments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
