import { useEffect, useState } from 'react';

function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/reservations');

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to load bookings');
        }

        setBookings(data || []);
      } catch (err) {
        setError(err.message);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div>Loading all bookings...</div>;

  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h1>All Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking.ResID}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px',
              background: '#f9f9f9'
            }}
          >
            <h3>Reservation ID: {booking.ResID}</h3>
            <p>Guest ID: {booking.GuestID}</p>
            <p>Room ID: {booking.RoomID}</p>
            <p>Start date: {booking.StartDate}</p>
            <p>End date: {booking.EndDate}</p>
            <p>Check-in time: {booking.CheckInTime || 'N/A'}</p>
            <p>Check-out time: {booking.CheckOutTime || 'N/A'}</p>
            <p>Number of guests: {booking.NumberOfGuests}</p>
            <p>Status: {booking.Status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminBookingsPage;