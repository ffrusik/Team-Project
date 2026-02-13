import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function RoomsPage() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch("/api/rooms")
      .then(res => res.json())
      .then(setRooms);
  }, []);

  return (
    <div>
      <h1>Rooms</h1>

      {rooms.map(room => (
        <div key={room.id}>
          <h3>Room number: {room.roomNumber}</h3>
          <p>Description: {room.description}</p>
          <p>Price: €{room.price}</p>
          <Link to={`/book/${room.roomNumber}`}>Book</Link>
        </div>
      ))}
    </div>
  );
}

export default RoomsPage;
