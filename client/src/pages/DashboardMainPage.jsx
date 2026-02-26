import { Link } from "react-router-dom";

function DashboardPage() {

  return (
    <div className="container">
        <h1>Hotel Reservation System</h1>
        <p style={{textAlign:"center", marginBottom:"25px"}}>Version 1</p>

        <div style={{display:"flex", gap:"20px", justifyContent:"center", flexWrap:"wrap"}}>
            <Link to="/dashboard/rooms" className="btn">Manage Rooms</Link>
            <Link to="/dashboard/guests" className="btn">Manage Guests</Link>
        </div>
    </div>
    
  );
}

export default DashboardPage;