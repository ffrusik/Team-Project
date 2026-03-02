import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function DashboardGuestsPage() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For edit/add form
  const [editingGuest, setEditingGuest] = useState(null);
  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    password: '',
    phoneNumber: '',
    town: '',
    county: '',
    eirCode: '',
    role: 'USER',
  });

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/guests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to load guests');
      }

      const data = await res.json();
      setGuests(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveGuest = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const method = editingGuest?.id ? 'PUT' : 'POST';
      const url = editingGuest?.id 
        ? `/api/admin/guests/${editingGuest.id}`
        : '/api/admin/guests';

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
        throw new Error(err.error || 'Failed to save guest');
      }

      const savedGuest = await res.json();

      // Update table
      if (editingGuest?.id) {
        setGuests(guests.map(g => g.id === savedGuest.id ? savedGuest : g));
      } else {
        setGuests([...guests, savedGuest]);
      }

      // Reset form
      setEditingGuest(null);
      setFormData({
        guestName: '',
        email: '',
        password: '',
        phoneNumber: '',
        town: '',
        county: '',
        eirCode: '',
        role: 'USER',
      });

      alert(editingGuest?.id ? 'Guest updated!' : 'Guest added!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleEdit = (guest) => {
    setEditingGuest(guest);
    setFormData({
      guestName: guest.guestName || '',
      email: guest.email || '',
      password: '',
      phoneNumber: guest.phoneNumber || '',
      town: guest.town || '',
      county: guest.county || '',
      eirCode: guest.eirCode || '',
      role: guest.role || 'USER',
    });
  };

  const handleDelete = async (guestId) => {
    if (!window.confirm('Delete this guest? This cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/guests/${guestId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to delete guest');

      setGuests(guests.filter(g => g.id !== guestId));
      alert('Guest deleted');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  if (loading) return <div>Loading guests...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <h1>Guests Management</h1>

      {/* Form – only shown when editing or adding */}
      {editingGuest !== null && (
        <form id="guestForm" onSubmit={handleSaveGuest}>
          {/* Hidden ID – only needed for edit */}
          {editingGuest.id && (
            <input type="hidden" name="id" value={editingGuest.id} />
          )}

          <div className="form-group">
            <label htmlFor="guestName">Guest Name</label>
            <input 
              type="text" 
              id="guestName" 
              name="guestName"
              value={formData.guestName}
              onChange={handleFormChange}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password {editingGuest.id ? '(leave blank to keep current)' : ''}</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              value={formData.password}
              onChange={handleFormChange}
              required={!editingGuest.id} // only required for new
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input 
              type="text" 
              id="phoneNumber" 
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleFormChange}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="town">Town</label>
            <input 
              type="text" 
              id="town" 
              name="town"
              value={formData.town}
              onChange={handleFormChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="county">County</label>
            <input 
              type="text" 
              id="county" 
              name="county"
              value={formData.county}
              onChange={handleFormChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="eirCode">Eircode</label>
            <input 
              type="text" 
              id="eirCode" 
              name="eirCode"
              value={formData.eirCode}
              onChange={handleFormChange}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select 
              id="role" 
              name="role"
              value={formData.role}
              onChange={handleFormChange}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <button type="submit" id="submitGuestBtn">
              {editingGuest.id ? 'Update Guest' : 'Save Guest'}
            </button>
            <button 
              type="button" 
              onClick={() => setEditingGuest(null)}
              style={{ marginLeft: '10px', background: '#6c757d', color: 'white' }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Add New Guest button */}
      {editingGuest === null && (
        <button 
          onClick={() => {
            setEditingGuest({});
            setFormData({
              guestName: '',
              email: '',
              password: '',
              phoneNumber: '',
              town: '',
              county: '',
              eirCode: '',
              role: 'USER',
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
          + Add New Guest
        </button>
      )}

      {/* Guests Table */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Town</th>
            <th>County</th>
            <th>Eircode</th>
            <th>Role</th>
            <th>Created at</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {guests.length === 0 ? (
            <tr>
              <td colSpan="10" style={{ textAlign: 'center', padding: '40px' }}>
                No guests found
              </td>
            </tr>
          ) : (
            guests.map(guest => (
              <tr key={guest.id}>
                <td>{guest.id}</td>
                <td>{guest.guestName || '-'}</td>
                <td>{guest.email}</td>
                <td>{guest.phoneNumber || '-'}</td>
                <td>{guest.town || '-'}</td>
                <td>{guest.county || '-'}</td>
                <td>{guest.eirCode || '-'}</td>
                <td>{guest.role}</td>
                <td>{new Date(guest.createdAt).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="edit-btn" 
                    onClick={() => handleEdit(guest)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn" 
                    onClick={() => handleDelete(guest.id)}
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
  );
}

export default DashboardGuestsPage;