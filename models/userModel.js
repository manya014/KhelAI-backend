// models/userModel.js
import pool from "../config/db.js";

const User = {
  async create({ name, email, passwordHash, age, weight, height, goal, role = "user" }) {
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, age, weight, height, goal, role)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id, name, email, age, weight, height, goal, role, created_at`,
      [name, email, passwordHash, age, weight, height, goal, role]
    );
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    return result.rows[0];
  },

  async findById(id) {
    const result = await pool.query(
      "SELECT id, name, email, age, weight, height, goal, role, created_at, updated_at FROM users WHERE id=$1",
      [id]
    );
    return result.rows[0];
  },

  async updateProfile(id, { name, age, weight, height, goal }) {
    const result = await pool.query(
      `UPDATE users 
       SET name=$1, age=$2, weight=$3, height=$4, goal=$5
       WHERE id=$6 RETURNING id, name, email, age, weight, height, goal, role, created_at, updated_at`,
      [name, age, weight, height, goal, id]
    );
    return result.rows[0];
  },

  async updatePassword(email, passwordHash) {
    const result = await pool.query(
      "UPDATE users SET password_hash=$1 WHERE email=$2 RETURNING id, email",
      [passwordHash, email]
    );
    return result.rows[0];
  },

  async getAllUsers() {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
    );
    return result.rows;
  },

  async updateRole(id, role) {
    const result = await pool.query(
      "UPDATE users SET role=$1 WHERE id=$2 RETURNING id, name, email, role",
      [role, id]
    );
    return result.rows[0];
  },
};

export default User;
