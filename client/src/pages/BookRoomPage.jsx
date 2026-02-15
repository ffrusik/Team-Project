import { useParams } from "react-router-dom";

function BookRoomPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Book Room #{id}</h1>
      <form action="/api/bookings" method="POST">
        <p>New here?</p>
        <label for="guestNameInput">Full name: </label>
        <input type="text" id="guestNameInput" ></input>
        <label for="emailInput">Email: </label>
        <input type="text" id="emailInput" ></input>
        <label for="phoneNumberInput">Phone number: </label>
        <input type="text" id="phoneNumberInput" ></input>
        <label for="townInput">Town: </label>
        <input type="text" id="townInput" ></input>
        <label for="countyInput">County: </label>
        <input type="text" id="countyInput" ></input>
        <label for="eircodeInput">EirCode: </label>
        <input type="text" id="eircodeInput" ></input>
      </form>
    </div>
  );
}

export default BookRoomPage;