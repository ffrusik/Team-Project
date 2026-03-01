/* 
    Could try to implement the reservation without registering an account, but by sending the link sent to the email address for the user to follow and access the details about their booking if they want to
*/

import { useEffect, useState } from 'react';

function BookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch('/api/bookings')
      .then(res => res.json())
      .then(setBookings);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault()

    const form = e.target
    const formData = new FormData(form)

    const data = Object.fromEntries(formData.entries())

    try {
      const response = await fetch(`/api/bookings/${data.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      console.log(result)
      if (!response.ok) {
        alert(result.error) // show backend error
        return
      }
      
      alert("Deletion successful!")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <h1>Bookings</h1>

      {bookings.success && bookings.bookings.map(booking => (
        <div key={booking.id}>
            <h3>Room number: {booking.roomNumber}</h3>
            <p>Guest id: {booking.guestId}</p>
            <p>Start date: {new Date(booking.startDate).toLocaleDateString()}</p>
            <p>End date: {new Date(booking.endDate).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
    
  );
}

export default BookingsPage;
