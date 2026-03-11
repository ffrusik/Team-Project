import { useState } from "react";

function BookRoomPage() {

  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [roomId, setRoomId] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [message, setMessage] = useState("");

  const checkAvailability = async () => {

    const res = await fetch(
      `http://localhost:5000/api/check-availability?room=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}`
    );

    const data = await res.json();

    if(data.available){
      setMessage("Room Available ✅");
    } else {
      setMessage("Room Not Available ❌");
    }

  };

  const createReservation = async (e) => {

    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/reservations", {

      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        guestName,
        email,
        roomId,
        checkIn,
        checkOut
      })

    });

    if(res.ok){
      setMessage("Booking Confirmed 🎉");
    } else {
      setMessage("Booking Failed");
    }

  };

  return (

    <div>

      <h2>Book a Room</h2>

      <form onSubmit={createReservation}>

        <input
          placeholder="Guest Name"
          value={guestName}
          onChange={(e)=>setGuestName(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          placeholder="Room ID"
          value={roomId}
          onChange={(e)=>setRoomId(e.target.value)}
        />

        <label>Check In</label>
        <input
          type="date"
          value={checkIn}
          onChange={(e)=>setCheckIn(e.target.value)}
        />

        <label>Check Out</label>
        <input
          type="date"
          value={checkOut}
          onChange={(e)=>setCheckOut(e.target.value)}
        />

        <button type="button" onClick={checkAvailability}>
          Check Availability
        </button>

        <button type="submit">
          Confirm Booking
        </button>

      </form>

      <p>{message}</p>

    </div>

  );
}

export default BookRoomPage;