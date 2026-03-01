import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
})

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  console.error('JWT_SECRET not set in environment variables')
  process.exit(1)
}

// Register
router.post('/register', async (req, res) => {
  const { 
    guestName, 
    email, 
    password, 
    phoneNumber, 
    town, 
    county, 
    eirCode 
  } = req.body

  // Required fields validation
  if (!email || !password || !phoneNumber || !eirCode) {
    return res.status(400).json({ 
      error: 'Email, password, phoneNumber, and eirCode are required' 
    })
  }

  try {
    const existing = await prisma.guest.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ error: 'Email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.guest.create({
      data: {
        guestName: guestName || email.split('@')[0],
        email,
        password: hashedPassword,
        phoneNumber,
        town: town || null,     // optional
        county: county || null, // optional
        eirCode,
        role: 'USER',           // Prisma maps this to Role.USER
      },
    })

    const token = jwt.sign(
      { userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        guestName: user.guestName,
      },
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Failed to register user' })
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' })
  }

  try {
    const user = await prisma.guest.findUnique({ where: { email } })
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        guestName: user.guestName,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

export default router