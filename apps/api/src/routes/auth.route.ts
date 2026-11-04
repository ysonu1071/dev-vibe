import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

const mockUsers = [
  {
    id: 'user-1',
    name: 'Ritika Sharma',
    email: 'admin@glowlane.com',
    password: 'admin123',
    role: 'owner',
    branchId: 'branch-1',
  },
];

router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required',
      status: 'error',
    });
  }

  const user = mockUsers.find(
    (item) => item.email.toLowerCase() === String(email).toLowerCase() && item.password === String(password)
  );

  if (!user) {
    return res.status(401).json({
      message: 'Invalid email or password',
      status: 'error',
    });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role, branchId: user.branchId },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    message: 'Login successful',
    status: 'success',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      branchId: user.branchId,
    },
    token,
  });
});

router.post('/auth/register', async (req, res) => {
  const { name, email, password, role = 'staff', branchId = 'branch-1' } = req.body ?? {};

  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'Name, email and password are required',
      status: 'error',
    });
  }

  const alreadyExists = mockUsers.some(
    (item) => item.email.toLowerCase() === String(email).toLowerCase()
  );

  if (alreadyExists) {
    return res.status(409).json({
      message: 'User already exists',
      status: 'error',
    });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name: String(name),
    email: String(email),
    password: String(password),
    role: String(role),
    branchId: String(branchId),
  };

  mockUsers.push(newUser);

  const token = jwt.sign(
    { userId: newUser.id, email: newUser.email, role: newUser.role, branchId: newUser.branchId },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.status(201).json({
    message: 'Registration successful',
    status: 'success',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      branchId: newUser.branchId,
    },
    token,
  });
});

export default router;
