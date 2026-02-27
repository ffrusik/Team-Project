import { Link } from "react-router-dom";

function DashboardGuestsPage() {

  return (
    <div className="container">
        <h1>Guests Management</h1>

        <form id="guestForm">
            <input type="hidden" id="guestId" />
            <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" required />
            </div>
            <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" required />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" required />
            </div>
            <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input type="text" id="phone" required />
            </div>
            <div className="form-group">
                <button type="submit" id="submitGuestBtn">Save Guest</button>
            </div>
        </form>

        {/* Guests Table */}
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="guestTableBody">
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
            </tbody>
        </table>

        <div className="back-link">
            <Link to="/admin/dashboard/" className="btn">Back</Link>
        </div>
    </div>
    
  );
}

export default DashboardGuestsPage;