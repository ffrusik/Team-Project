import {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';

function UpdateRoomPage() {
    const { id } = useParams();
    const [room, setRoom] = useState(null);

    useEffect(() => {
        fetch(`/api/rooms/${id}`)
            .then(res => res.json())
            .then(setRoom);
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        fetch(`/api/rooms/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(room)
        })
            .then(res => {
                if (res.ok) {
                    alert('Room updated successfully');
                } else {
                    alert('Failed to update room');
                }
            });
    };

    if (!room) {
        return <div>Loading...</div>;
    }
   
    return (
        <div>
            <h2>Update Room</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={room.name}
                    onChange={(e) => setRoom({...room, name: e.target.value})}
                />
                <input
                    type="number"
                    value={room.capacity}
                    onChange={(e) => setRoom({...room, capacity: parseInt(e.target.value)})}
                />
                <button type="submit">Update Room</button>
            </form>
        </div>
    );

}

export default UpdateRoomPage;