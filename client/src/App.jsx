import { Routes, Route, Link, Navigate } from "react-router-dom";
import { 
  SignedIn, 
  SignedOut, 
  SignInButton, 
  SignUpButton, 
  UserButton 
} from '@clerk/clerk-react'

// pages
import RoomsPage from "./pages/RoomsPage.jsx";
import BookRoomPage from "./pages/BookRoomPage.jsx";
import BookingsPage from "./pages/BookingsPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import DashboardRoomsPage from "./pages/DashboardRoomsPage.jsx";
import DashboardGuestsPage from "./pages/DashboardGuestsPage";
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'

// protection wrapper
import ProtectedAdminRoute from './components/ProtectedAdminRoute'

// css
import "./App.css"

function App() {
  return (
    <div>
      <nav style={{ padding: '16px', background: '#f8f9fa' }}>
        <Link to="/rooms">Rooms</Link> |{' '}
        <Link to="/bookings">Bookings</Link> |{' '}
        <SignedIn>
          <UserButton fallbackRedirectUrl="/rooms" />
        </SignedIn>
        <SignedOut>
          <Link to="/sign-in">Sign In</Link>
        </SignedOut>
      </nav>

      <Routes>
        {/* Public Routes */}
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/book/:id" element={<BookRoomPage />} />
        <Route path="/bookings" element={<BookingsPage />} />

        {/* Authentication Routes */}
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/dashboard/rooms" element={<DashboardRoomsPage />} />
          <Route path="/admin/dashboard/guests" element={<DashboardGuestsPage />} />
        </Route>

        {/* Redirect Unknown Routes */}
        {/* <Route path="*" element={<Navigate to="/rooms" replace />} /> */}
      </Routes>
    </div>
  );
}

export default App;