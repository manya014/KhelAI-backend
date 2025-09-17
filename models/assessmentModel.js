import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: String,
  difficulty: String,
  created_at: { type: Date, default: Date.now }
});

export const Assessment = mongoose.model("Assessment", assessmentSchema);

const userAssessmentSchema = new mongoose.Schema({
  user_id: Number,       // PostgreSQL user id
  assessment_id: mongoose.Schema.Types.ObjectId,
  score: Number,
  status: String,
  date: { type: Date, default: Date.now }
});

export const UserAssessment = mongoose.model("UserAssessment", userAssessmentSchema);
