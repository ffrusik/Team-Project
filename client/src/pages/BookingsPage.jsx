import { useEffect, useState } from 'react';

function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/reservations', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });

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

  if (loading) return <div>Loading your bookings...</div>;

  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h1>My Bookings</h1>

      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
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
            <h3>Booking: {booking.ResID}</h3>
            <p><strong>Room:</strong>{booking.RoomID}</p>
            <p><strong>Check-in:</strong> {booking.StartDate}</p>
            <p><strong>Check-out:</strong> {booking.EndDate}</p>
            <p><strong>Guests:</strong> {booking.NumberOfGuests}</p>
            <p><strong>Status:</strong> {booking.Status}</p>

            <p><strong>Check-in time:</strong>{booking.CheckeinTime || 'N/A'}</p>
            <p><strong>Check-out time:</strong>{booking.CheckeoutTime || 'N/A'}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default BookingsPage;