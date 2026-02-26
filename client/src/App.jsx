import { Routes, Route, Link } from "react-router-dom";
import RoomsPage from "./pages/RoomsPage.jsx";
import BookRoomPage from "./pages/BookRoomPage.jsx";
import BookingsPage from "./pages/BookingsPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import DashhboardRoomsPage from "./pages/DashhboardRoomsPage.jsx";

function App() {
  return (
    <div>
      <nav>
        <Link to="/rooms">Rooms</Link> |{" "}
        <Link to="/bookings">Bookings</Link>
      </nav>

      <Routes>
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/book/:id" element={<BookRoomPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        <Route path="/admin/dashboard/rooms" element={<DashhboardRoomsPage />} />
      </Routes>
    </div>
  );
}

export default App;