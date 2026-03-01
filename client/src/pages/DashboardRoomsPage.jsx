import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function DashboardRoomsPage() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch('/api/rooms')
      .then(res => res.json())
      .then(setRooms);
  }, []);

  return (
    <div className="container">
        <h1>Rooms Management</h1>

        <form id="roomForm">
            <input type="hidden" id="roomId" />
            <div className="form-group">
                <label htmlFor="roomNumber">Room Number</label>
                <input type="text" id="roomNumber" required />
            </div>
            <div className="form-group">
                <label htmlFor="roomType">Room Type</label>
                <input type="text" id="roomType" required />
            </div>
            <div className="form-group">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" required />
            </div>
            <div className="form-group">
                <label htmlFor="availability">Availability</label>
                <select id="availability">
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                </select>
            </div>
            <div className="form-group">
                <button type="submit" id="submitRoomBtn">Save Room</button>
            </div>
        </form>

        {/* Rooms Table */}
        <table>
            <thead>
                <tr>
                    <th>Room Number</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Availability</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="roomTableBody">
                {rooms.map(room => (
                    <div key={room.id}>
                        <th>{room.roomNumber}</th>
                        <th>{room.roomType}</th>
                        <th>€{room.price}</th>
                        <th>{room.availability}</th>
                        <th>
                            <Link to={`/book/${room.roomNumber}`}>Book</Link>
                            <button className="edit-btn">Edit</button>
                            <button className="delete-btn">Delete</button>
                        </th>
                    </div>
                ))}
            </tbody>
        </table>

        <div className="back-link">
            <Link to="/admin/dashboard/" className="btn">Back</Link>
        </div>
    </div>
    
  );
}

export default DashboardRoomsPage;