import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

function BookRoomPage() {
  const { id } = useParams();

  const [room, setRoom] = useState([null]);

  useEffect(() => {
    fetch(`/api/rooms/${id}`)
      .then(res => res.json())
      .then(setRoom);
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault()

    const form = e.target
    const formData = new FormData(form)

    const data = Object.fromEntries(formData.entries())

    // Add room id
    data.roomNumber = id

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()
      console.log(result)
      alert("Booking successful!")
    } catch (err) {
      console.error(err)
    }
  }

  // In the future could implement payment and without storing card details as well
  return (
    <div>
      <h1>Book Room #{id}</h1>
      <form onSubmit={handleSubmit}>
        <p>New here?</p>
        <div className='userInputDiv'>
          <label htmlFor='guestNameInput'>Full name: </label>
          <input type='text' id='guestNameInput' name='guestName' ></input><br></br>
          <label htmlFor='emailInput'>Email: </label>
          <input type='text' id='emailInput' name='email'></input><br></br>
          <label htmlFor='emailInput'>Password: </label>
          <input type='password' id='passwordInput' name='password'></input><br></br>
          <label htmlFor='emailInput'>Repeat password: </label>
          <input type='password' id='repeatPasswordInput' name='repeatPassword'></input><br></br>
          <label htmlFor='phoneNumberInput'>Phone number: </label>
          <input type='text' id='phoneNumberInput' name='phoneNumber'></input><br></br>
          <label htmlFor='townInput'>Town: </label>
          <input type='text' id='townInput' name='town' ></input><br></br>
          <label htmlFor='countyInput'>County: </label>
          <input type='text' id='countyInput' name='county'></input><br></br>
          <label htmlFor='eircodeInput'>EirCode: </label>
          <input type='text' id='eircodeInput' name='eirCode'></input><br></br>
        </div>
          
        <p>Have an account?</p> 
        <div className='userInputDiv'>
          <label htmlFor='emailLoginInput'>Email: </label>
          <input type='text' id='emailLoginInput' name='emailLogin'></input><br></br>
          <label htmlFor='passwordLoginInput'>Password: </label>
          <input type='password' id='passwordLoginInput' name='passwordLogin'></input><br></br>
        </div>

        <div>
          <p>Booking details</p>
          <label htmlFor='numberOfGuestsInput'>Number of guests: </label>
          <input type='text' id='numberOfGuestsInput' name='numberOfGuests'></input><br></br>
          <label htmlFor='startDateInput'>Start date: </label>
          <input type='text' id='startDateInput' name='startDate'></input><br></br>
          <label htmlFor='endDateInput'>End date: </label>
          <input type='text' id='endDateInput' name='endDate'></input><br></br>
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

        <div id='roomDetailsDiv'>
          <p>Details of the room: </p>
          <p>Room number: {room.roomNumber}</p>
          <p>Description: {room.description}</p>
          <p>Price per night: {room.price} €</p>
        </div>
        
        <button type='submit'>Book</button>
      </form>
    </div>
  );
}

export default BookRoomPage;