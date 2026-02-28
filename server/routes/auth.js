const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  console.error('JWT_SECRET not set in environment variables')
  process.exit(1)
}

// Register
router.post('/register', async (req, res) => {
  const { guestName, email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' })
  }

  const existing = await prisma.guest.findUnique({ where: { email } })
  if (existing) {
    return res.status(400).json({ error: 'Email already exists' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.guest.create({
    data: {
      guestName: guestName || email.split('@')[0],
      email,
      password: hashedPassword,
      role: 'USER', // default
    },
  })

  res.status(201).json({ message: 'User created', userId: user.id })
})

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.guest.findUnique({ where: { email } });
  if (!user || !user.password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  })
})

module.exports = router