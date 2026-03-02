import { useEffect, useState } from 'react';

function BookingsPage() {
  const [bookings, setBookings] = useState([]); // always array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Please log in to view bookings');
        }

        const res = await fetch('/api/bookings', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to load bookings');
        }

        setBookings(data.bookings || []);
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
        bookings.map(booking => (
          <div key={booking.id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            background: '#f9f9f9'
          }}>
            <h3>Room number: {booking.roomNumber}</h3>
            <p>Start date: {new Date(booking.startDate).toLocaleDateString()}</p>
            <p>End date: {new Date(booking.endDate).toLocaleDateString()}</p>
            <p>Number of guests: {booking.numberOfGuests}</p>
            <p>Price: €{booking.price}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default BookingsPage;