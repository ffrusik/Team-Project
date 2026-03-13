import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function DashboardGuestsPage() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingGuest, setEditingGuest] = useState(null);
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
    Phone: "",
    Eircode: "",
  });

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/guests");

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to load guests");
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveGuest = async (e) => {
    e.preventDefault();

    try {
      const method = editingGuest?.GuestID ? "PUT" : "POST";
      const url = editingGuest?.GuestID
        ? `http://localhost:5000/api/guests/${editingGuest.GuestID}`
        : "http://localhost:5000/api/guests";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save guest");
      }

      await fetchGuests();

      setEditingGuest(null);
      setFormData({
        FirstName: "",
        LastName: "",
        Email: "",
        Password: "",
        Phone: "",
        Eircode: "",
      });

      alert(editingGuest?.GuestID ? "Guest updated!" : "Guest added!");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleEdit = (guest) => {
    setEditingGuest(guest);
    setFormData({
      FirstName: guest.FirstName || "",
      LastName: guest.LastName || "",
      Email: guest.Email || "",
      Password: guest.Password || "",
      Phone: guest.Phone || "",
      Eircode: guest.Eircode || "",
    });
  };

  const handleDelete = async (guestId) => {
    if (!window.confirm("Delete this guest? This cannot be undone.")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/guests/${guestId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete guest");
      }

      setGuests(guests.filter((g) => g.GuestID !== guestId));
      alert("Guest deleted");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (loading) return <div>Loading guests...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <h1>Guests Management</h1>

      {editingGuest !== null && (
        <form id="guestForm" onSubmit={handleSaveGuest}>
          <div className="form-group">
            <label htmlFor="FirstName">First Name</label>
            <input
              type="text"
              id="FirstName"
              name="FirstName"
              value={formData.FirstName}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="LastName">Last Name</label>
            <input
              type="text"
              id="LastName"
              name="LastName"
              value={formData.LastName}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="Email">Email</label>
            <input
              type="email"
              id="Email"
              name="Email"
              value={formData.Email}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="Password">Password</label>
            <input
              type="text"
              id="Password"
              name="Password"
              value={formData.Password}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="Phone">Phone</label>
            <input
              type="text"
              id="Phone"
              name="Phone"
              value={formData.Phone}
              onChange={handleFormChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="Eircode">Eircode</label>
            <input
              type="text"
              id="Eircode"
              name="Eircode"
              value={formData.Eircode}
              onChange={handleFormChange}
            />
          </div>

          <div className="form-group">
            <button type="submit">
              {editingGuest?.GuestID ? "Update Guest" : "Save Guest"}
            </button>
            <button
              type="button"
              onClick={() => setEditingGuest(null)}
              style={{ marginLeft: "10px", background: "#6c757d", color: "white" }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {editingGuest === null && (
        <button
          onClick={() => {
            setEditingGuest({});
            setFormData({
              FirstName: "",
              LastName: "",
              Email: "",
              Password: "",
              Phone: "",
              Eircode: "",
            });
          }}
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            marginBottom: "20px",
          }}
        >
          + Add New Guest
        </button>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Eircode</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {guests.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "40px" }}>
                No guests found
              </td>
            </tr>
          ) : (
            guests.map((guest) => (
              <tr key={guest.GuestID}>
                <td>{guest.GuestID}</td>
                <td>{guest.FirstName}</td>
                <td>{guest.LastName}</td>
                <td>{guest.Email}</td>
                <td>{guest.Phone || "-"}</td>
                <td>{guest.Eircode || "-"}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(guest)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(guest.GuestID)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="back-link">
        <Link to="/admin/dashboard/" className="btn">
          Back
        </Link>
      </div>
    </div>
  );
}

export default DashboardGuestsPage;