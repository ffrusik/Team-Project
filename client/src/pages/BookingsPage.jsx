/* 
    Could try to implement the reservation without registering an account, but by sending the link sent to the email address for the user to follow and access the details about their booking if they want to
*/

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function BookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch('/api/bookings')
      .then(res => res.json())
      .then(setBookings);
  }, []);

  return (
    <div>
      <h1>Bookings</h1>

      {bookings.map(booking => (
        <div key={booking.id}>
            <h3>Room number: {booking.roomNumber}</h3>
            <p>Guest id: {booking.guestId}</p>
            <p>Start date: {booking.startDate}</p>
            <p>End date: {booking.endDate}</p>
        </div>
      ))}
    </div>
    
  );
}

export default BookingsPage;
