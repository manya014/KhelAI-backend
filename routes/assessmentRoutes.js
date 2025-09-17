import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { startAssessment, submitAssessment, listAssessments, getUserAssessments } from "../controllers/assessmentController.js";

const router = express.Router();

// Public: list all assessments (optional, could be protected)
router.get("/", authMiddleware, listAssessments);

// Protected: start a workout/assessment session
router.post("/start", authMiddleware, startAssessment);

// Protected: submit assessment results
router.post("/submit", authMiddleware, submitAssessment);

// Optional: fetch all assessments for a user
router.get("/user", authMiddleware, getUserAssessments);

export default router;
