import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data));
  }, []);

 /*  return (
    <div>
      <h1>Rooms</h1>

      {rooms.map((room) => (
        <div key={room.RoomID}>
          <h3>Room ID: {room.RoomID}</h3>
          <p>Type: {room.Type}</p>
          <p>Price: €{room.PricePerNight}</p>
          <Link to={`/book/${room.RoomID}`}>Book</Link>
        </div>
      ))}
    </div>
  ); */
  return (
  <>
    <section className="hero">
      <div className="hero-content">
        <h1>Luxury Hotel</h1>
        <p>Elegant rooms and seamless booking.</p>
      </div>
    </section>

    <main className="page-container">
      <h2 className="section-title">Available Rooms</h2>

      <div className="room-grid">
        {rooms.map((room) => (
          <div className="room-card" key={room.RoomID}>
            <div className="room-image"></div>

            <div className="room-content">
              <h3>{room.Type} Room</h3>
              <p><strong>Capacity:</strong> {room.Capacity || "N/A"} guests</p>
              <p>{room.Description || "No description available."}</p>
              <p><strong>Facilities:</strong> {room.Facilities || "No facilities listed."}</p>
              <p className="price">€{room.PricePerNight} / night</p>

              <Link className="book-btn" to={`/book/${room.RoomID}`}>
                Book Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  </>
);
}