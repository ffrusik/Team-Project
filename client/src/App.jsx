import { Routes, Route, Link } from "react-router-dom";
import RoomsPage from "./pages/RoomsPage.jsx";
import BookRoomPage from "./pages/BookRoomPage.jsx";
import BookingsPage from "./pages/BookingsPage.jsx";

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
      </Routes>
    </div>
  );
}

export default App;