import jwt from 'jsonwebtoken';
import { store, findUserByEmail } from '../store/index.js';

// Initialize store if empty
if (!store.users?.length) {
  store.users = [
    {
      id: '1',
      name: 'Faculty Demo',
      email: 'faculty@school.edu',
      password: 'password',
      role: 'FACULTY'
    },
    {
      id: '2',
      name: 'Student Demo',
      email: 'student@school.edu',
      password: 'password',
      role: 'STUDENT'
    }
  ];
}

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '30d' }
  );
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email });

    // Find user
    const user = findUserByEmail(email);
    console.log('User found:', user ? { ...user, password: '[REDACTED]' } : null);
    
    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return res.status(401).json({
        message: 'Invalid email or password. Use faculty@school.edu or student@school.edu with password "password"'
      });
    }

    // Generate token
    const token = generateToken(user);
    console.log('Generated token:', token);

    // Return user data and token
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      token
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error logging in',
      error: error.message
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = store.users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error getting current user',
      error: error.message
    });
  }
};