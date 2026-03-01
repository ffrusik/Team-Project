import { Routes, Route, Link } from "react-router-dom";
import RoomsPage from "./pages/RoomsPage.jsx";
import BookRoomPage from "./pages/BookRoomPage.jsx";
import BookingsPage from "./pages/BookingsPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import DashboardRoomsPage from "./pages/DashboardRoomsPage.jsx";
import DashboardGuestsPage from "./pages/DashboardGuestsPage";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import { Navigate } from "react-router-dom";
import "./App.css"

function App() {
  return (
    <div>
      <nav>
        <Link to="/rooms">Rooms</Link> |{" "}
        <Link to="/bookings">Bookings</Link>
      </nav>

      <Routes>
        {/* Public routes */}
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/book/:id" element={<BookRoomPage />} />
        <Route path="/bookings" element={<BookingsPage />} />

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