import { useEffect, useState } from "react";

function DashboardReservations(){

  const [reservations, setReservations] = useState([]);

  const loadReservations = async () => {

    const res = await fetch("http://localhost:5000/api/reservations");
    const data = await res.json();

    setReservations(data);

  };

  useEffect(() => {
    loadReservations();
  }, []);

  const deleteReservation = async (id) => {

    await fetch(`http://localhost:5000/api/reservations/${id}`, {
      method: "DELETE"
    });

    loadReservations();

  };

  return (

    <div>

      <h2>Reservation Manager</h2>

      <table border="1">

        <thead>
          <tr>
            <th>Guest</th>
            <th>Room</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {reservations.map((r)=>(
            <tr key={r.id}>

              <td>{r.guestName}</td>
              <td>{r.roomId}</td>
              <td>{r.checkIn}</td>
              <td>{r.checkOut}</td>

              <td>
                <button onClick={()=>deleteReservation(r.id)}>
                  Cancel
                </button>
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>

  );
}

export default DashboardReservations;