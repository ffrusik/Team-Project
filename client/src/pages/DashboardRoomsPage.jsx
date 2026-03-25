import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function DashboardRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    Type: "",
    PricePerNight: "",
    Description: "",
    Capacity: "",
    Facilities: "",
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/rooms");

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to load rooms");
      }

      const data = await res.json();
      setRooms(data);
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

  const handleSaveRoom = async (e) => {
    e.preventDefault();

    try {
      const method = editingRoom && editingRoom.RoomID ? "PUT" : "POST";
      const url =
        editingRoom && editingRoom.RoomID
          ? `http://localhost:5000/api/rooms/${editingRoom.RoomID}`
          : "http://localhost:5000/api/rooms";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Type: formData.Type,
          PricePerNight: Number(formData.PricePerNight),
          Description: formData.Description,
          Capacity: Number(formData.Capacity),
          Facilities: formData.Facilities,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save room");
      }

      await fetchRooms();
      setEditingRoom(null);
      setFormData({
        Type: "",
        PricePerNight: "",
        Description: "",
        Capacity: "",
        Facilities: "",
      });

      alert(editingRoom && editingRoom.RoomID ? "Room updated!" : "Room added!");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/rooms/${roomId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete room");
      }

      setRooms(rooms.filter((room) => room.RoomID !== roomId));
      alert("Room deleted successfully");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      Type: room.Type || "",
      PricePerNight: room.PricePerNight || "",
      Description: room.Description || "",
      Capacity: room.Capacity || "",
      Facilities: room.Facilities || "",
    });
  };

  if (loading) {
    return <div style={{ padding: "50px", textAlign: "center" }}>Loading rooms...</div>;
  }

  if (error) {
    return <div style={{ padding: "50px", color: "red", textAlign: "center" }}>Error: {error}</div>;
  }

  return (
    <div className="container">
      <h1>Rooms Management</h1>

      {editingRoom !== null && (
        <form id="roomForm" onSubmit={handleSaveRoom}>
          <div className="form-group">
            <label htmlFor="Type">Room Type</label>
            <input
              type="text"
              id="Type"
              name="Type"
              value={formData.Type}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="PricePerNight">Price Per Night</label>
            <input
              type="number"
              id="PricePerNight"
              name="PricePerNight"
              value={formData.PricePerNight}
              onChange={handleFormChange}
              required
              step="0.01"
            />
          </div>
          <div className="form-group">
          <label htmlFor="Description">Description</label>
          <input
            type="text"
            id="Description"
            name="Description"
            value={formData.Description}
            onChange={handleFormChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="Capacity">Capacity</label>
          <input
            type="number"
            id="Capacity"
            name="Capacity"
            value={formData.Capacity}
            onChange={handleFormChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="Facilities">Facilities</label>
          <input
            type="text"
            id="Facilities"
            name="Facilities"
            value={formData.Facilities}
            onChange={handleFormChange}
            placeholder="Free Wi-Fi, TV, Ensuite Bathroom"
            required
          />
        </div>

          <div className="form-group">
            <button type="submit">
              {editingRoom && editingRoom.RoomID ? "Update Room" : "Save Room"}
            </button>
            <button
              type="button"
              onClick={() => setEditingRoom(null)}
              style={{ marginLeft: "10px", background: "#6c757d", color: "white" }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {editingRoom === null && (
        <button
          onClick={() => {
            setEditingRoom({});
            setFormData({
              Type: "",
              PricePerNight: "",
              Description: "",
              Capacity: "",
              Facilities: "",
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
          + Add New Room
        </button>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Price Per Night</th>
            <th>Description</th>
            <th>Capacity</th>
            <th>Facilities</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "40px" }}>
                No rooms found
              </td>
            </tr>
          ) : (
            rooms.map((room) => (
              <tr key={room.RoomID}>
                <td>{room.RoomID}</td>
                <td>{room.Type}</td>
                <td>€{room.PricePerNight}</td>
                <td>{room.Description || "-"}</td>
                <td>{room.Capacity || "-"}</td>
                <td>{room.Facilities || "-"}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(room)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(room.RoomID)}>
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

export default DashboardRoomsPage;