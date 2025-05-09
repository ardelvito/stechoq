const UserModel = require('../models/usermodel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Input validation
  if (!name || !email || !password) {
    return res.status(400).json(
        { 
            message: "Please provide all required fields" ,
            data: null
        }
    );
  }

  try {
    // Check if user email alr exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json(
            { 
                message: "Email is already taken" ,
                data: null
            }
        );
    }

    // Password hash
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Save new user
    await UserModel.createUser(name, email, hashedPassword);

    return res.status(201).json({
      message: "User registered successfully",
      data: null
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

      // Input validation
  if ( !email || !password) {
    return res.status(400).json(
        { 
            message: "Please provide all required fields" ,
            data: null
        }
    );
  }

    try {
    // Cek if user exist
    const existingUser = await UserModel.findByEmail(email);
    console.log(existingUser);
    if (!existingUser) {
    return res.status(404).json(
            { 
                message: "User not found" ,
                data: null
            }
        );
    }

    const user = existingUser[0];
    // console.log(user);

    // Cek password
    const valid = await bcrypt.compare(password, existingUser.password);
    if (!valid) {
    return res.status(401).json(
        { 
            message: 'Wrong password',
            data: null
        }
        );
    }
    // console.log(valid);

    // Generate JWT token with 12 hrs expired
    const token = jwt.sign(
        { id: existingUser.id, email: existingUser.email, role: existingUser.role },
        JWT_SECRET,
        { expiresIn: '12h' }
    );

    return res.status(200).json(
        { 
            message: 'Login success', 
            data: {token} 
        });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: "Server error" });
  }
}
