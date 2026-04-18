import { Routes, Route, Link, Navigate } from "react-router-dom";

// pages
import RoomsPage from "./pages/RoomsPage.jsx";
import BookRoomPage from "./pages/BookRoomPage.jsx";
import BookingsPage from "./pages/BookingsPage.jsx";
import AdminBookingsPage from "./pages/AdminBookingsPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import DashboardRoomsPage from "./pages/DashboardRoomsPage.jsx";
import DashboardGuestsPage from "./pages/DashboardGuestsPage";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AddExtra from "./pages/AddExtra.jsx";
//import DashboardReservationsPage from "./pages/DashboardReseravtionsPage.jsx";
import "./App.css"

//import ProtectedAdminRoute from "./components/ProtectedAdminRoute"
//import ProtectedRoute from "./components/ProtectedRoute.jsx"

import { useAuth } from "./context/AuthContext.jsx"

function App() {
  const { user, logout } = useAuth()

  return (
    <>  
  
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/rooms" className="logo">
            Le Hotel
          </Link>

          <Link to="/rooms">Rooms</Link>
          <Link to="/bookings">Bookings</Link>
          <Link to="/admin/dashboard">Admin</Link>
        </div>

        <div className="nav-right">
          {user ? (
            <>
              <span className="user-email">
                {user.email}
              </span>

              <button onClick={logout}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Sign In</Link>
              <Link to="/register">Sign Up</Link>
            </>
          )}
        </div>
    </nav>
  

      <Routes>
        {/* Public routes */}
        <Route path="/rooms" element={<RoomsPage />} />

        {/* <Route element={<ProtectedRoute />}> Temporarily disabiing logging to test booking page*/}
          <Route path="/book/:id" element={<BookRoomPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          
        


        {/* </Route> */}

        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* <Route element={<ProtectedAdminRoute />}> */}
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/dashboard/rooms" element={<DashboardRoomsPage />} />
          <Route path="/admin/dashboard/guests" element={<DashboardGuestsPage />} />
          <Route path="/admin/dashboard/extras" element={<AddExtra />} />
          <Route path="/admin/dashboard/bookings" element={<AdminBookingsPage />} />

        {/* </Route> */}

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/rooms" replace />} />
      </Routes>
    </> 
  );
}

export default App;