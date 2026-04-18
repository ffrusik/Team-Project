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
       
          const res = await fetch(`http://localhost:5000/api/rooms/${id}`);
      

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Room not found');
        }

        const data = await res.json();
        setRoom(data);  
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
  const expiry = e.target.expiryDate.value;
  const match = expiry.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/);
  if(!match){
    alert("Invalid expiry date format (MM/YY)");
    return
  }
  const month = parseInt(match[1]);
  const year = parseInt("20" + match[2]);
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  
  if(year < currentYear || (year === currentYear && month < currentMonth)){
    alert("Card has expired");
    return;
  }
    const cardholderName = e.target.cardholderName.value;
    const cardNumber = e.target.cardNumber.value;
    const expiryDate = e.target.expiryDate.value;
    const cardLast4Digits = cardNumber.slice(-4);

    const formDataObj = {
    GuestID: Number(e.target.guestId.value),
    RoomID: Number(id),
    StartDate: e.target.startDate.value,
    EndDate: e.target.endDate.value,
    NumberOfGuests: Number(e.target.numberOfGuests.value),
    CardholderName: cardholderName,
    CardLast4Digits : cardLast4Digits,
    ExpiryDate: expiryDate

  };

    try {
      const response = await fetch('http://localhost:5000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          
        },
        body: JSON.stringify(formDataObj)
      })

      const result = await response.json()

      if (!response.ok) {
        alert(result.error) 
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
        <p>Booking details</p>
        <label htmlFor='guestIdInput'>Guest ID: </label>
        <input
          type='number'
          id='guestIdInput'
          name='guestId'
          min='1'
          required
        /><br/>
        <label htmlFor='numberOfGuestsInput'>Number of guests: </label>
        <input 
          type='number' 
          id='numberOfGuestsInput' 
          name='numberOfGuests'
          min="1"
          max={room?.Capacity || 1}
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
        <label htmlFor='cardholderNameInput'>Cardholder name: </label>
        <input
          type='text'
          id='cardholderNameInput'
          name='cardholderName'
          required
        /><br />

        <label htmlFor='cardNumberInput'>Card number: </label>
        <input
          type='text'
          id='cardNumberInput'
          name='cardNumber'
          inputMode='numeric'
          pattern='[0-9]{16}'
          maxLength='16'
          required
        /><br />

        <label htmlFor='expiryDateInput'>Expiry date: </label>
        <input
          type='text'
          id='expiryDateInput'
          name='expiryDate'
          placeholder = 'MM/YY'
          pattern = '^(0[1-9]|1[0-2])\/[0-9]{2})$'
          maxLength = '5'
          required
        /><br />

        <label htmlFor='cvcInput'>CVC: </label>
        <input
          type='password'
          id='cvcInput'
          name='cvc'
          inputMode='numeric'
          pattern='[0-9]{3}'
          maxLength='3'
          required
        /><br />
      </div>


      <button type='submit'>Book</button>
      </form>
    </div>
    </main>
  );
}

export default BookRoomPage;