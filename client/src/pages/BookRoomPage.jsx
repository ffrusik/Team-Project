import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

function BookRoomPage() {
  const { id } = useParams();

  const [room, setRoom] = useState(null);
  const today = new Date().toISOString().split("T")[0];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/rooms/${id}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Room not found');
        }

        const data = await res.json();
        setRoom(data);  // single object, not array
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  // form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to book a room');
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    const startDate = e.target.startDate.value;
    const endDate = e.target.endDate.value;

    if (startDate < today) {
      alert("Cannot book in the past");
      return;
  }

  if (endDate <= startDate) {
    alert("End date must be after start date");
    return;
  }
    
    const formDataObj = {
    RoomID: Number(id),
    StartDate: e.target.startDate.value,
    EndDate: e.target.endDate.value,
    NumberOfGuests: Number(e.target.numberOfGuests.value),
  };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formDataObj)
      })

      const result = await response.json()

      if (!response.ok) {
        alert(result.error) // show backend error
        return
      }
      
      alert("Booking successful!")
    } catch (err) {
      console.error(err)
      alert('Error: ' + err.message)
    }
  }

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading room details...</div>
  if (error) return <div style={{ padding: '50px', color: 'red', textAlign: 'center' }}>Error: {error}</div>

  return (
    <main className ="page-container">
    <div className ="form-wrapper">
      <h1>Book Room </h1>
      <form onSubmit={handleSubmit}>
      <div>
        {/* <label htmlFor='guestIdInput'>Guest ID: </label>
        <input
          type='number'
          id='guestIdInput'
          name='guestId'
          min='1'
          required
        /><br/> */}
        <label htmlFor='numberOfGuestsInput'>Number of guests: </label>
        <input 
          type='number' 
          id='numberOfGuestsInput' 
          name='numberOfGuests'
          min="1"
          required
        /><br/>

        <label htmlFor='startDateInput'>Start date: </label>
        <input 
          type='date' 
          id='startDateInput' 
          name='startDate'
          min = {today}
          required
        /><br/>

        <label htmlFor='endDateInput'>End date: </label>
        <input 
          type='date' 
          id='endDateInput' 
          name='endDate'
          min ={today}
          required
        /><br/>
      </div>

      <div>
        <p>Card details</p>
        <label htmlFor='cardNumberInput'>Card number: </label>
        <input type='text' id='cardNumberInput' name='cardNumber'></input><br></br>
        <label htmlFor='dateOfExpiryInput'>Date of expiry: </label>
        <input type='text' id='dateOfExpiryInput' name='dateOfExpiry'></input><br></br>
        <label htmlFor='cvcInput'>CVC: </label>
        <input type='password' id='cvcInput' name='cvc'></input><br></br>
      </div>


      <button type='submit'>Book</button>
      </form>
    </div>
    </main>
  );
}

export default BookRoomPage;