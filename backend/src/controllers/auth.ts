import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Register user
const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    user = new User({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    return res.status(201).json({ token });
  } catch (err) {
    return res.status(500).send('Server error');
    
  }
};

// Login user
const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    console.log(password, user); // Debugging line

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
};

// Get current user
const getMe = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Logout user (for JWT, this is usually handled on client, but you can implement token blacklist if needed)
const logout = async (_req: Request, res: Response) => {
  // For stateless JWT, just instruct client to delete token
  res.json({ msg: 'Logged out successfully' });
};

export default { register, login, getMe, logout };