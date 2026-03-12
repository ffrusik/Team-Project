import { useEffect, useState } from "react";

function CheckoutPage(){

const [reservations,setReservations] = useState([]);
const [selectedReservation,setSelectedReservation] = useState(null);
const [bill,setBill] = useState(null);

useEffect(()=>{

fetch("http://localhost:5000/api/reservations/checkedin")
.then(res=>res.json())
.then(data=>setReservations(data));

},[]);

const loadBill = async (reservationId) => {

const res = await fetch(`http://localhost:5000/api/reservations/${reservationId}/bill`);
const data = await res.json();

setSelectedReservation(reservationId);
setBill(data);

};

const checkoutGuest = async () => {

await fetch(`http://localhost:5000/api/reservations/${selectedReservation}/checkout`,{
method:"PUT"
});

alert("Guest checked out");

setBill(null);

};

return(

<div>

<h2>Guest Checkout</h2>

<h3>Select Reservation</h3>

<select onChange={(e)=>loadBill(e.target.value)}>

<option value="">Select Guest</option>

{reservations.map((r)=>(
<option key={r.id} value={r.id}>
{r.guestName} - Room {r.roomId}
</option>
))}

</select>

{bill && (

<div style={{marginTop:"20px"}}>

<h3>Bill Summary</h3>

<p>Guest: {bill.guestName}</p>

<p>Room: {bill.roomNumber}</p>

<p>Nights: {bill.nights}</p>

<p>Room Cost: €{bill.roomCost}</p>

<h4>Extras</h4>

{bill.extras.length === 0 && <p>No extras</p>}

<ul>

{bill.extras.map((extra)=>(
<li key={extra.id}>
{extra.name} – €{extra.price}
</li>
))}

</ul>

<h3>Total: €{bill.total}</h3>

<button onClick={checkoutGuest}>
Complete Checkout
</button>

</div>

)}

</div>

);

}

export default CheckoutPage;