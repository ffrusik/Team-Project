import { useEffect, useState } from "react";

function DashboardCheckInPage(){

const [reservations,setReservations] = useState([]);
const [extras,setExtras] = useState([]);
const [selectedReservation,setSelectedReservation] = useState(null);
const [selectedExtra,setSelectedExtra] = useState("");

const loadReservations = async () => {

const res = await fetch("http://localhost:5000/api/reservations");
const data = await res.json();

setReservations(data);

};

const loadExtras = async () => {

const res = await fetch("http://localhost:5000/api/extras");
const data = await res.json();

setExtras(data);

};

useEffect(()=>{

loadReservations();
loadExtras();

},[]);

const checkInGuest = async (id) => {

await fetch(`http://localhost:5000/api/reservations/${id}/checkin`,{
method:"PUT"
});

loadReservations();

};

const checkOutGuest = async (id) => {

await fetch(`http://localhost:5000/api/reservations/${id}/checkout`,{
method:"PUT"
});

loadReservations();

};

const addExtra = async () => {

await fetch("http://localhost:5000/api/reservation-extras",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
reservationId:selectedReservation,
extraId:selectedExtra
})

});

alert("Extra added to booking");

};

return(

<div>

<h2>Receptionist Check-In Dashboard</h2>

<table border="1">

<thead>
<tr>
<th>Guest</th>
<th>Room</th>
<th>Check In</th>
<th>Check Out</th>
<th>Status</th>
<th>Actions</th>
</tr>
</thead>

<tbody>

{reservations.map((r)=>(
<tr key={r.id}>

<td>{r.guestName}</td>
<td>{r.roomId}</td>
<td>{r.checkIn}</td>
<td>{r.checkOut}</td>
<td>{r.status}</td>

<td>

{r.status !== "checked_in" && (
<button onClick={()=>checkInGuest(r.id)}>
Check In
</button>
)}

{r.status === "checked_in" && (
<>
<button onClick={()=>setSelectedReservation(r.id)}>
Add Extra
</button>

<button onClick={()=>checkOutGuest(r.id)}>
Check Out
</button>
</>
)}

</td>

</tr>
))}

</tbody>

</table>

{/* Extras section */}

{selectedReservation && (

<div style={{marginTop:"20px"}}>

<h3>Add Extra</h3>

<select
value={selectedExtra}
onChange={(e)=>setSelectedExtra(e.target.value)}
>

<option value="">Select Extra</option>

{extras.map((extra)=>(
<option key={extra.id} value={extra.id}>
{extra.name} (€{extra.price})
</option>
))}

</select>

<button onClick={addExtra}>
Add Extra
</button>

</div>

)}

</div>

);

}

export default DashboardCheckInPage;