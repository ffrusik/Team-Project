import { Link } from "react-router-dom";

function DashboardPage() {

  return (
    <>
    <section className="hero">
      <div className="hero-content">
        <h1>Le Hotel</h1>
        <p>Reception and administration dashboard.</p>
      </div>
    </section>

    <main className="page-container">
      <h2 className="section-title">Admin Dashboard</h2>

      <div className="dashboard-actions">
        <Link to="/admin/dashboard/rooms" className="dashboard-action-card">
          Manage Rooms
        </Link>

        <Link to="/admin/dashboard/guests" className="dashboard-action-card">
          Manage Guests
        </Link>

        <Link to="/admin/dashboard/bookings/manage" className="dashboard-action-card">
          Manage Bookings
        </Link>
        <Link to="/admin/dashboard/bookings" className="dashboard-action-card">
          View Bookings
        </Link>
        

        <Link to="/admin/dashboard/extras" className="dashboard-action-card">
          Manage Extras
        </Link>
      </div>
    </main>
  </>   
  );

}

export default DashboardPage;