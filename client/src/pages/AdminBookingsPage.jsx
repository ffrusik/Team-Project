import { useEffect, useState } from 'react';

function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch('http://localhost:5000/api/admin/reservations',{
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
      

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load bookings");
        }

        setBookings(data || []);
      } catch (err) {
        setError(err.message);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
      fetchBookings();
  }, []);

  const handleCheckIn = async(reservationId) =>{
    try{
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/${reservationId}/checkin`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if(!res.ok){
        throw new Error(data.error || "Failed to check in guest");
      }
      alert("Checked in successfully")
      fetchBookings();
    } catch(err){
      alert(err.message);
    }
  };
  const handleCheckOut = async(reservationId) => {
    try{
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/${reservationId}/checkout`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      const data = await res.json();

      if(!res.ok){
        throw new Error(data.error || "Failed to check out guest");
      }
      fetchBookings();
    }catch(err){
      alert(err.message);
    }
  };
  const handleConfirm = async (reservationId) =>{
    try{
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/${reservationId}/confirm`,
        {
          method: "PUT",
          headers: {
            Authorization: `Beare ${token}`,
          },
        }
      );
      const data = await res.json();
      if(!res.ok){
        throw new Error(data.error || "Failed to confirm reservation");
      }
      alert("Reservation confirmed");
      fetchBookings();
    } catch(err){
      alert(err.message);
    }
  };
  const handleReject = async (reservationId) =>{
    try{
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/${reservationId}/reject`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if(!res.ok){
        throw new Error(data.error || "Failed to reject reservation");
      }
      alert("Reservation rejected");
      fetchBookings();
    } catch(err){
      alert(err.message);
    }
  };


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

            <div style ={{marginTop: "10px"}}>
              <button onClick={() => handleConfirm(booking.ResID)} disabled ={booking.Status !== "Pending"}>
                Confirm
              </button>
               <button onClick={() => handleReject(booking.ResID)} disbaled={booking.Status !== "Pending"} style={{marginLeft:"10px"}}>
                Reject
              </button>
               <button onClick={() => handleCheckIn(booking.ResID)} disbaled={booking.Status !== "Confirmed"} style={{marginLeft:"10px"}}>
                Check In
              </button>
              <button onClick={() => handleCheckOut(booking.ResID)} disbaled={booking.Status !== "Checked In"} style={{marginLeft:"10px"}}>
                Check Out
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminBookingsPage;