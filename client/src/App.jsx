import { Routes, Route, Link, Navigate } from "react-router-dom";

// pages
import RoomsPage from "./pages/RoomsPage.jsx";
import BookRoomPage from "./pages/BookRoomPage.jsx";
import BookingsPage from "./pages/BookingsPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import DashboardRoomsPage from "./pages/DashboardRoomsPage.jsx";
import DashboardGuestsPage from "./pages/DashboardGuestsPage";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
//import DashboardReservationsPage from "./pages/DashboardReseravtionsPage.jsx";
import "./App.css"

import ProtectedAdminRoute from "./components/ProtectedAdminRoute"
import ProtectedRoute from "./components/ProtectedRoute.jsx"

import { useAuth } from "./context/AuthContext.jsx"

function App() {
  const { user, logout } = useAuth()

  return (
    <div>
      <nav style={{
        padding: '16px 32px',
        background: '#f8f9fa',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}>
        {/* Left: Links */}
        <div style={{ display: 'flex', gap: '24px' }}>
          <Link to="/rooms" style={{ textDecoration: 'none', color: '#333', fontWeight: '500' }}>
            Rooms
          </Link>
          <Link to="/bookings" style={{ textDecoration: 'none', color: '#333', fontWeight: '500' }}>
            Bookings
          </Link>
        </div>

        {/* Right: Auth controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user ? (
            <>
              {user.role === 'ADMIN' && (
                <Link to="/admin/dashboard" style={{ color: '#007bff', textDecoration: 'none', fontWeight: '500' }}>
                  Admin Dashboard
                </Link>
              )}
              <span style={{ fontWeight: '500' }}>
                Signed in as {user.email}
              </span>
              <button
                onClick={logout}
                style={{
                  padding: '8px 16px',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#007bff', textDecoration: 'none', fontWeight: '500' }}>
                Sign In
              </Link>
              <Link to="/register" style={{ color: '#007bff', textDecoration: 'none', fontWeight: '500' }}>
                Sign Up
              </Link>
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
        
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/dashboard/rooms" element={<DashboardRoomsPage />} />
          <Route path="/admin/dashboard/guests" element={<DashboardGuestsPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/rooms" replace />} />
      </Routes>
    </div>
  );
}

export default App;