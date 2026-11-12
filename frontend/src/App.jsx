
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import HotelsPage from "./pages/HotelsPage";
import HotelDetailsPage from "./pages/HotelDetailsPage";
import BookingPage from "./pages/BookingPage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import BookingLookupPage from "./pages/BookingLookupPage";

import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";

import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/hotels/:id" element={<HotelDetailsPage />} />
        <Route path="/booking/:roomTypeId" element={<BookingPage />} />
        <Route
          path="/booking-confirmation"
          element={<BookingConfirmationPage />}
        />
        <Route path="/my-booking" element={<BookingLookupPage />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedAdminRoute />}>
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
