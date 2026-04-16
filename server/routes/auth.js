import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const connectionString = process.env.DATABASE_URL

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

    /* 
    GuestID INTEGER PRIMARY KEY AUTOINCREMENT,
    FirstName TEXT,
    LastName TEXT,
    Email TEXT,
    Password TEXT,
    Phone TEXT,
    Eircode TEXT,
    Role TEXT
    */

    const user = await runQuery(
        `INSERT INTO Guest
         (FirstName, LastName, Email, Password, Phone, Eircode, Role)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [FirstName, LastName, Email, hashedPassword, Phone, Eircode, 'USER']
      );

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
    const user = await getQuery(
      "SELECT * FROM Guest WHERE Email = ?",
      [email]
    );

    if (!user || !user.Password) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const valid = await bcrypt.compare(password, user.Password)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      {
        userId: user.GuestID,
        email: user.Email,
        role: user.Role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user.GuestID,
        email: user.Email,
        role: user.Role,
        guestName: user.GuestName,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

export default router