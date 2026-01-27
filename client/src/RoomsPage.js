import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function RoomsPage() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch("/rooms")
      .then(res => res.json())
      .then(setRooms);
  }, []);

  return (
    <div>
      <h1>Rooms</h1>

      {rooms.map(room => (
        <div key={room.id}>
          <h3>{room.name}</h3>
          <p>€{room.price}</p>
          <Link to={`/book/${room.id}`}>Book</Link>
        </div>
      ))}
    </div>
  );
}

export default RoomsPage;
