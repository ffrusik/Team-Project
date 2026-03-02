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

  const handleSaveRoom = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const method = editingRoom.id ? 'PUT' : 'POST';
      const url = editingRoom.id 
        ? `/api/admin/rooms/${editingRoom.id}`
        : '/api/admin/rooms';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save room');
      }

      const savedRoom = await res.json();

      // Update local state
      if (editingRoom.id) {
        // Update existing
        setRooms(rooms.map(r => r.id === savedRoom.id ? savedRoom : r));
      } else {
        // Add new
        setRooms([...rooms, savedRoom]);
      }

      // Reset form
      setEditingRoom(null);
      setFormData({
        roomNumber: '',
        description: '',
        capacity: '',
        price: '',
        availability: true,
      });

      alert(editingRoom.id ? 'Room updated!' : 'Room added!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
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
    setEditingRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      description: room.description || '',
      capacity: room.capacity || '',
      price: room.price || '',
      availability: !!room.availability,
    });
  }

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading rooms...</div>
  if (error) return <div style={{ padding: '50px', color: 'red', textAlign: 'center' }}>Error: {error}</div>

  return (
    <div className="container">
      <h1>Rooms Management</h1>

      {editingRoom !== null && (
        <form id="roomForm" onSubmit={handleSaveRoom}>
          {/* Hidden ID – only needed for edit to store tha value for backend */}
          {editingRoom.id && (
            <input type="hidden" name="id" value={editingRoom.id} />
          )}

          <div className="form-group">
            <label htmlFor="roomNumber">Room number</label>
            <input 
              type="number" 
              id="roomNumber" 
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleFormChange}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input 
              type="text" 
              id="description" 
              name="description"
              value={formData.description}
              onChange={handleFormChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="capacity">Capacity</label>
            <input 
              type="number" 
              id="capacity" 
              name="capacity"
              value={formData.capacity}
              onChange={handleFormChange}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input 
              type="number" 
              id="price" 
              name="price"
              value={formData.price}
              onChange={handleFormChange}
              required 
              step="0.01"
            />
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
                style={{
                  width: '20px',
                  height: '20px',
                  accentColor: '#28a745',
                  cursor: 'pointer'
                }}
              />
            </label>
          </div>

          <div className="form-group">
            <button type="submit" id="submitRoomBtn">
              {editingRoom.id ? 'Update Room' : 'Save Room'}
            </button>
            <button 
              type="button" 
              onClick={() => setEditingRoom(null)}
              style={{ marginLeft: '10px', background: '#6c757d', color: 'white' }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Add New Room button – only shown when not editing */}
      {editingRoom === null && (
        <button 
          onClick={() => {
            setEditingRoom({}); // empty = new
            setFormData({
              roomNumber: '',
              description: '',
              capacity: '',
              price: '',
              availability: true,
            });
          }}
          style={{
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            marginBottom: '20px'
          }}
        >
          + Add New Room
        </button>
      )}

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
                <td>{room.availability ? 'Available' : 'Unavailable'}</td>
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