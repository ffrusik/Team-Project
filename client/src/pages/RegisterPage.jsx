import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom"
import { useAuth } from '../context/AuthContext'

function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [guestName, setGuestName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [town, setTown] = useState('')
  const [county, setCounty] = useState('')
  const [eirCode, setEirCode] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, guestName, phoneNumber, town, county, eirCode }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      login(data.token, data.user) // auto-login after registration

      navigate('/rooms')
    } catch (err) {
      setError(err.message)
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#f8e7ff' }}>
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={guestName}
          onChange={e => setGuestName(e.target.value)}
          style={{ width: '93%', padding: '10px', margin: '10px 0' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: '93%', padding: '10px', margin: '10px 0' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: '93%', padding: '10px', margin: '10px 0' }}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
          required
          style={{ width: '93%', padding: '10px', margin: '10px 0' }}
        />
        <input
          type="text"
          placeholder="Town"
          value={town}
          onChange={e => setTown(e.target.value)}
          style={{ width: '93%', padding: '10px', margin: '10px 0' }}
        />
        <input
          type="text"
          placeholder="County"
          value={county}
          onChange={e => setCounty(e.target.value)}
          style={{ width: '93%', padding: '10px', margin: '10px 0' }}
        />
        <input
          type="text"
          placeholder="EirCode"
          value={eirCode}
          onChange={e => setEirCode(e.target.value)}
          required
          style={{ width: '93%', padding: '10px', margin: '10px 0' }}
        />
        <button type="submit" style={{ width: '100%', padding: '12px' }}>
          Register
        </button>
      </form>

      Have an account? <Link to="/login" className="btn">Login here</Link>
    </div>
  );
}

export default RegisterPage