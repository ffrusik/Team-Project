import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data));
  }, []);

  const navigate = useNavigate();
  const[startDate,setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const[guests, setGuests] = useState(1);
  const handleSearch = () => {
    navigate(`/rooms?StartDate=${startDate}&EndDate=${endDate}&guets=${guests}`);
  };
  return (
  <>
    <section className="hero">
      <div className="hero-content">
        <h1>Le Hotel</h1>
        <p>Elegant rooms and seamless booking.</p>
      </div>
    </section>
    {/* <div style = {{ margin: "20px 0"}}> */}
      
    <div
      
      style ={{
        display: "flex",
        flexDirection: "column",
        background: "white",
        padding:"15px",
        borderRadius: "10px",
        gap:"15px",
        alignItems: "center",
        boxShadow:"0 4px 10px rgba(0,0,0,0,1)",
        maxWidth: "800px",
        margin: "-40px auto 30px auto",
        position:"relative",
        zIndex: 2
      }}
    >
      <h3>Search rooms</h3>
      <div
        style={{
          display: "flex",
          gap: "15px",
          alignItems: "flex-end"
        }}
      >
      <div>
        <label>Arrival</label><br />
        <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        style={{padding:"8px", borderRadius: "5px", border: "1px solid #acc"}}
        />
      </div>
      <div>
        <label>Departure</label><br />
        <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        style={{padding:"8px", borderRadius: "5px", border: "1px solid #acc"}}
       // style={{ marginLeft: "10px"}}
        />
      </div>
      <div>
        <label>Guests</label><br />
      <input
        type="number"
        min="1"
        value={guests}
        onChange={(e) => setGuests(e.target.value)}
        //style={{ marginLeft: "10px", width: "70px"}}
        style={{
          width: "70px",
          padding: "8px",
          borderRadius: "5px",
          border: "1px solid #acc"
        }}
        />
      </div>
      
      
      <button onClick={handleSearch} style={{
        background: "#c9a66b",
        color:"white",
        border:"none",
        padding:"10px 15px",
        borderRadius: "5px",
        cursor: "pointer",
        marginTop: "20px"
      }}>
        Search
      </button>
    </div>
    </div>

    <main className="page-container">
      <h2 className="section-title">Available Rooms</h2>

      <div className="room-grid">
        {rooms.map((room) => (
          <div className="room-card" key={room.RoomID}>
            <div className="room-image"></div>

            <div className="room-content">
              <h3>{room.Type} Room</h3>
              <p><strong>Capacity:</strong> {room.Capacity || "N/A"} guests</p>
              <p>{room.Description || "No description available."}</p>
              <p><strong>Facilities:</strong> {room.Facilities || "No facilities listed."}</p>
              <p className="price">€{room.PricePerNight} / night</p>

              <Link className="book-btn" to={`/book/${room.RoomID}`}>
                Book Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  </>
);
}