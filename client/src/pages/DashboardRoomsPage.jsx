import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

function DashboardRoomsPage() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: '',
    description: '',
    capacity: '',
    price: '',
    availability: true,
  });

  useEffect(() => {
    fetchRooms()
  }, [])

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
  };

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Not logged in')

      const res = await fetch('/api/admin/rooms', {  // <- use admin endpoint if protected
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to load rooms')
      }

      const data = await res.json()
      setRooms(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room? This cannot be undone.')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Not logged in')

      const res = await fetch(`/api/admin/rooms/${roomId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to delete room')
      }

      // Remove from UI immediately
      setRooms(rooms.filter(room => room.id !== roomId))
      alert('Room deleted successfully')
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  const handleEdit = (room) => {
    // TODO: open edit form/modal
    alert(`Edit room ${room.roomNumber} (not implemented yet)`)
  }

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading rooms...</div>
  if (error) return <div style={{ padding: '50px', color: 'red', textAlign: 'center' }}>Error: {error}</div>

  return (
    <div className="container">
      <h1>Rooms Management</h1>

    <form id="roomForm">
        <input type="hidden" id="roomNumber" />
        <div className="form-group">
            <label htmlFor="roomNumber">Room number</label>
            <input type="number" id="roomNumber" required />
        </div>
        <div className="form-group">
            <label htmlFor="description">Description</label>
            <input type="text" id="description" />
        </div>
        <div className="form-group">
            <label htmlFor="capacity">Capacity</label>
            <input type="number" id="capacity" required />
        </div>
        <div className="form-group">
            <label htmlFor="price">Price</label>
            <input type="number" id="price" required />
        </div>
        <div className="form-group">
            <label htmlFor="availability" className="checkbox-label">
                <span>Available</span>
                <input 
                    type="checkbox" 
                    id="availability" 
                    name="availability" 
                    checked={formData.availability}
                    onChange={handleFormChange}
                    required 
                    style={{
                        width: '20px',
                        height: '20px',
                        accentColor: '#28a745',
                        cursor: 'pointer'
                    }}/>
            </label>
        </div>
        <div className="form-group">
            <button type="submit" id="submitRoomBtn">Save Room</button>
        </div>
    </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Room Number</th>
            <th>Description</th>
            <th>Capacity</th>
            <th>Price</th>
            <th>Availability</th>
            <th>Updated at</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                No rooms found
              </td>
            </tr>
          ) : (
            rooms.map(room => (
              <tr key={room.id}>
                <td>{room.id}</td>
                <td>{room.roomNumber}</td>
                <td>{room.description || '-'}</td>
                <td>{room.capacity || '-'}</td>
                <td>€{room.price || '0'}</td>
                <td>{room.availability ? '✓ Available' : '✗ Unavailable'}</td>
                <td>{room.updatedAt ? new Date(room.updatedAt).toLocaleString() : '-'}</td>
                <td>
                  <button 
                    className="edit-btn" 
                    onClick={() => handleEdit(room)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn" 
                    onClick={() => handleDelete(room.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="back-link">
        <Link to="/admin/dashboard/" className="btn">Back</Link>
      </div>
    </div>
  )
}

export default DashboardRoomsPage