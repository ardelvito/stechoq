// models/userModel.js
const pool = require('../config/db');

class UserModel {
  // Find user by email function
  static async findByEmail(email) {
    const conn = await pool.getConnection();
    const result = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
    conn.release();
    return result[0];
  }

  // Create new user function
  static async createUser(name, email, password) {
    const conn = await pool.getConnection();
    const result = await conn.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
      [name, email, password]
    );
    conn.release();
    console.log(Number(result.insertId));
  
  }

  static async findById(id) {
    const conn = await pool.getConnection();
    const result = await conn.query('SELECT * FROM users WHERE id = ?', [id]);
    conn.release();
    return result[0];
  }
}

module.exports = UserModel;
