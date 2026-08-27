import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkeyforodstgroup123', {
    expiresIn: '30d',
  });
};

// @desc    Register a new admin user
// @route   POST /api/auth/register
// @access  Public (Can be restricted/seeded in production)
export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400);
      throw new Error('Please fill in all fields');
    }

    // Check if user email or username already exists in MySQL
    const userExists = await User.findOne({
      where: {
        [Op.or]: [{ email: email.toLowerCase() }, { username }]
      }
    });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Create user in MySQL (beforeCreate hook hashes password)
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password,
    });

    if (user) {
      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please enter email and password');
    }

    // Find user by email (or username) in MySQL
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: email.toLowerCase() },
          { username: email }
        ]
      }
    });

    if (user && (await user.matchPassword(password))) {
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (user) {
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};
