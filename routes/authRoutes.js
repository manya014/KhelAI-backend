// routes/authRoutes.js
import express from "express";
import AuthController from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Public
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/reset-password", AuthController.resetPassword);
// Protected route (token required)
router.post("/auth/logout", authMiddleware, AuthController.logout);


// Protected
router.get("/profile", authMiddleware, AuthController.profile);
router.put("/profile", authMiddleware, AuthController.updateProfile);

// Admin-only
router.get("/admin/users", authMiddleware, roleMiddleware(["admin"]), AuthController.listUsers);
router.put("/admin/change-role", authMiddleware, roleMiddleware(["admin"]), AuthController.changeRole);

export default router;
