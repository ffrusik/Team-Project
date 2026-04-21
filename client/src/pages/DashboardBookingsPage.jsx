import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function DashboardBookingsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    GuestID: "",
    RoomID: "",
    StartDate: "",
    EndDate: "",
    CheckInTime: "",
    CheckOutTime: "",
    NumberOfGuests: "",
    Status: "",
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/admin/reservations", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to load reservations");
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
      const method = editingRoom && editingRoom.ResID ? "PUT" : "POST";
      const token = localStorage.getItem("token");
      const url =
        editingRoom && editingRoom.ResID
          ? `http://localhost:5000/api/admin/reservations/${editingRoom.ResID}`
          : "http://localhost:5000/api/admin/reservations";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          GuestID: formData.GuestID,
          RoomID: formData.RoomID,
          Status: formData.Status,
          StartDate: formData.StartDate,
          EndDate: formData.EndDate,
          CheckInTime: formData.CheckInTime,
          CheckOutTime: formData.CheckOutTime,
          NumberOfGuests: Number(formData.NumberOfGuests),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save reservation");
      }

      await fetchRooms();
      setEditingRoom(null);
      setFormData({
        GuestID: "",
        RoomID: "",
        StartDate: "",
        EndDate: "",
        CheckInTime: "",
        CheckOutTime: "",
        NumberOfGuests: "",
        Status: "",
      });

      alert(
        editingRoom && editingRoom.ResID
          ? "Reservation updated!"
          : "Reservation added!"
      );
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleDelete = async (resId) => {
    if (!window.confirm("Are you sure you want to delete this reservation?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/reservations/${resId}`,
        {
          method: "DELETE",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete reservation");
      }

      setRooms(rooms.filter((room) => room.ResID !== resId));
      alert("Reservation deleted successfully");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      GuestID: room.GuestID || "",
      RoomID: room.RoomID || "",
      StartDate: room.StartDate || "",
      EndDate: room.EndDate || "",
      CheckInTime: room.CheckInTime || "",
      CheckOutTime: room.CheckOutTime || "",
      NumberOfGuests: room.NumberOfGuests || "",
      Status: room.Status || "",
    });
  };

  const handleCheckIn = async (resId) => {
    try {
      const currentRoom = rooms.find((room) => room.ResID === resId);

      if (!currentRoom) {
        alert("Reservation not found");
        return;
      }

      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/admin/reservations/${resId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            GuestID: currentRoom.GuestID,
            RoomID: currentRoom.RoomID,
            StartDate: currentRoom.StartDate,
            EndDate: currentRoom.EndDate,
            CheckInTime: new Date().toLocaleTimeString(),
            CheckOutTime: currentRoom.CheckOutTime || "",
            NumberOfGuests: Number(currentRoom.NumberOfGuests),
            Status: "Checked In",
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to check in guest");
      }

      await fetchRooms();
      alert("Guest checked in successfully");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleCheckOut = async (resId) => {
    try {
      const currentRoom = rooms.find((room) => room.ResID === resId);

      if (!currentRoom) {
        alert("Reservation not found");
        return;
      }

      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/admin/reservations/${resId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            GuestID: currentRoom.GuestID,
            RoomID: currentRoom.RoomID,
            StartDate: currentRoom.StartDate,
            EndDate: currentRoom.EndDate,
            CheckInTime: currentRoom.CheckInTime || "",
            CheckOutTime: new Date().toLocaleTimeString(),
            NumberOfGuests: Number(currentRoom.NumberOfGuests),
            Status: "Checked Out",
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to check out guest");
      }

      await fetchRooms();
      alert("Guest checked out successfully");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };
  if (loading) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        Loading reservations...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "50px", color: "red", textAlign: "center" }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Reservations Management</h1>

      {editingRoom !== null && (
        <form id="roomForm" onSubmit={handleSaveRoom}>

          <div className="form-group">
            <label htmlFor="GuestID">Guest ID</label>
            <input
              type="text"
              id="GuestID"
              name="GuestID"
              value={formData.GuestID}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="RoomID">Room ID</label>
            <input
              type="text"
              id="RoomID"
              name="RoomID"
              value={formData.RoomID}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="StartDate">Start Date</label>
            <input
              type="date"
              id="StartDate"
              name="StartDate"
              value={formData.StartDate}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="EndDate">End Date</label>
            <input
              type="date"
              id="EndDate"
              name="EndDate"
              value={formData.EndDate}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="CheckInTime">Check In Time</label>
            <input
              type="text"
              id="CheckInTime"
              name="CheckInTime"
              value={formData.CheckInTime}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="CheckOutTime">Check Out Time</label>
            <input
              type="text"
              id="CheckOutTime"
              name="CheckOutTime"
              value={formData.CheckOutTime}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="NumberOfGuests">Number Of Guests</label>
            <input
              type="text"
              id="NumberOfGuests"
              name="NumberOfGuests"
              value={formData.NumberOfGuests}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="Status">Status</label>
            <input
              type="text"
              id="Status"
              name="Status"
              value={formData.Status}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="form-group">
            <button type="submit">
              {editingRoom && editingRoom.GuestID ? "Update Reservation" : "Save Reservation"}
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
          + Add New Reservation
        </button>
      )}

      <table>
        <thead>
          <tr>
            <th>GuestID</th>
            <th>RoomID</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {rooms.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "40px" }}>
                No reservations found
              </td>
            </tr>
          ) : (
            rooms.map((room) => (
              <tr key={room.ResID}>
                <td>{room.GuestID}</td>
                <td>{room.RoomID}</td>
                <td>{room.StartDate}</td>
                <td>{room.EndDate}</td>
                <td>{room.CheckInTime || "N/A"} </td>
                <td>{room.CheckOutTime || "N/A"}</td>
                <td>{room.Status}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(room)}>
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(room.ResID)}
                  >
                    Delete
                  </button>

                  {room.Status !== "Checked In" && room.Status !== "Checked Out" && (
                    <button onClick={() => handleCheckIn(room.ResID)}
                    style={{ marginLeft: "10px"}}> Chcek In</button>
                  )}

                  {room.Status === "Checked In" && ( 
                    <button onClick={() => handleCheckOut(room.ResID)}
                    style={{marginleft: "10px"}}>Check Out</button> 
                  )}
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

export default DashboardBookingsPage;