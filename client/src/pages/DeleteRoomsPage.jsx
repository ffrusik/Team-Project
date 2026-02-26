import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

function DeleteRoomsPage() {
    const [room, setroom] = useState(null);
    const [rooms, setRooms] = useState([]);
    useEffect(() => {
        fetch('/api/rooms')
            .then(res => res.json())
            .then(data => setRooms(data));
    }, [])
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            return;
        }
        fetch(`/api/rooms/${id}`, {
            method: 'DELETE',
        })
            .then(res => {
                if (res.ok) {
                    setRooms(rooms.filter(room => room.id !== id));
                } else {
                    alert('Failed to delete room');
                }
            });

            return (
                <div>
                    <h1>Delete Rooms</h1>

                    {rooms.map(room => (
                        <div key={room.id}>
                            <h3>Room number: {room.roomNumber}</h3>
                            <p>Description: {room.description}</p>
                            <p>Price: €{room.price}</p>
                            <button onClick={() => handleDelete(room.id)}>Delete</button>
                        </div>
                    ))}
                </div>
            );
        }

export default DeleteRoomsPage;