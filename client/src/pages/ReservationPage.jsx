import React, { useEffect, useState } from 'react';

export default function ReservationPage() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [reservations, setReservations] = useState([]);

  const API = 'http://localhost:5000/api/reservations';

  // Fetch all reservations
  const fetchReservations = () => {
    fetch(API)
      .then(res => res.json())
      .then(data => setReservations(data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Check if date is in past
  const isPast = (date) => {
    return new Date(date) < new Date().setHours(0,0,0,0);
  };

  // Check if already booked
  const isBooked = (date) => {
    return reservations.some(r => r.date === date);
  };

  // Create reservation
  const createReservation = () => {
    if (!name || !date) return alert('Fill all fields');

    if (isPast(date)) return alert('Cannot book past dates');
    if (isBooked(date)) return alert('Date already booked');

    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, date })
    })
      .then(() => {
        setName('');
        setDate('');
        fetchReservation('');
      })
      .catch(console.error);
  };
   // Delete reservation
  const deleteReservation = (id) => {
    fetch(`${API}/${id}`, { method: 'DELETE' })
      .then(fetchReservations)
      .catch(console.error);
  };

  // Update reservation
  const updateReservation = (id) => {
    const newDate = prompt('Enter new date (Day-Month-Year)');
    if (!newDate) return;

    if (isPast(newDate)) return alert('Cannot book past dates');

    const conflict = reservations.some(r => r.date === newDate && r.id !== id);
    if (conflict) return alert('Date already booked');

    fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: newDate })
    })
      .then(fetchReservations)
      .catch(console.error);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Make a Reservation</h1>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button onClick={createReservation}>Book</button>

      <h2>Bookings</h2>

      {reservations.map(r => (
        <div key={r.id} style={{ marginTop: '10px' }}>
          {r.name} - {r.date}
          <button onClick={() => updateReservation(r.id)}>Edit</button>
          <button onClick={() => deleteReservation(r.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
 