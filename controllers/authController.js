// controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config();

const AuthController = {
  async register(req, res) {
    try {
      const { name, email, password, age, weight, height, goal, role } = req.body;
      const existing = await User.findByEmail(email);
      if (existing) return res.status(400).json({ message: "Email already registered" });

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, passwordHash, age, weight, height, goal, role });

      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findByEmail(email);
      if (!user) return res.status(400).json({ message: "Invalid email or password" });

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "secretkey",
        { expiresIn: "1h" }
      );

      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Add this method to AuthController
async logout(req, res) {
  try {
    // In stateless JWT, server cannot really invalidate token unless using a blacklist
    // For now, just tell client to delete token
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
},


  async profile(req, res) {
    try {
      const user = await User.findById(req.user.id);
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async updateProfile(req, res) {
    try {
      const { name, age, weight, height, goal } = req.body;
      const updatedUser = await User.updateProfile(req.user.id, { name, age, weight, height, goal });
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async resetPassword(req, res) {
    try {
      const { email, newPassword } = req.body;
      const passwordHash = await bcrypt.hash(newPassword, 10);
      const updated = await User.updatePassword(email, passwordHash);
      if (!updated) return res.status(400).json({ message: "Email not found" });

      res.json({ message: "Password updated successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ADMIN features
  async listUsers(req, res) {
    try {
      const users = await User.getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async changeRole(req, res) {
    try {
      const { userId, role } = req.body;
      const updatedUser = await User.updateRole(userId, role);
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

export default AuthController;
