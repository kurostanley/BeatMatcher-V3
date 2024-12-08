const User = require('../models/User'); // Assuming you have a User model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const constants = require('../utils/constants'); // Import constants


class AuthController {
  static async login(req, res) {
    console.log('login');
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    try {
      const user = await User.findOne({ where: { user_email: email } });
      if (!user) {
        console.log('user not found');
        return res.status(401).json({ message: "Invalid credentials." });
      }

      const isMatch = await bcrypt.compare(password, user.user_password);
      if (!isMatch) {
        console.log('password not match');
        return res.status(401).json({ message: "Invalid credentials." });
      }

      const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
      return res.status(200).json({ token, user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "An error occurred during login." });
    }
  }
}

module.exports = AuthController;