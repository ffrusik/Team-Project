import { Routes, Route, Link } from "react-router-dom";
import RoomsPage from "./RoomsPage";
import BookRoomPage from "./BookRoomPage";
import BookingsPage from "./BookingsPage";

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Rooms</Link> |{" "}
        <Link to="/bookings">Bookings</Link>
      </nav>

      <Routes>
        <Route path="/" element={<RoomsPage />} />
        <Route path="/book/:id" element={<BookRoomPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
      </Routes>
    </div>
  );
}

export default App;