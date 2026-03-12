import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function RoomsPage() {
const [rooms, setRooms] = useState([]);

useEffect(() => {
fetch("http://localhost:5000/api/rooms")
.then((res) => res.json())
.then((data) => setRooms(data));
}, []);

return (
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
);
}