import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function RoomsPage() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch('/api/rooms')
      .then(res => res.json())
      .then(setRooms);
  }, []);

  return (
    <div>
      <h1>Rooms</h1>

      {rooms.map(room => (
<<<<<<< HEAD
        <div key={room.RoomID}>
          <h3>Room ID: {room.RoomID}</h3>
          <p>Type: {room.Type}</p>
          <p>Price: €{room.PricePerNight}</p>
          <Link to={`/book/${room.RoomID}`}>Book</Link>
=======
        <div key={room.id} className="room-card">
          <h3>Room number: {room.roomNumber}</h3>
          <p>Description: {room.description}</p>
          <p>Price: €{room.price}</p>
          <Link className="book-btn" to={`/book/${room.roomNumber}`}>Book</Link>
>>>>>>> 2945bbbb05dcca2b0b0e0ec3d3d89215a94baa69
        </div>
      ))}
    </div>
    
  );
}

export default RoomsPage;
