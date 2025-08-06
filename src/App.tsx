import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Layout from "./components/layout/Layout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import MandapsListPage from "./pages/mandap/MandapsListPage";
import MandapFormPage from "./pages/mandap/MandapFormPage";
import BookingsPage from "./pages/bookings/BookingsPage";
import CalendarPage from "./pages/calendar/CalendarPage";
import ReviewsPage from "./pages/reviews/ReviewsPage";
import ProfilePage from "./pages/profile/ProfilePage";
import NotificationsPage from "./pages/notifications/NotificationsPage";
import VendorsPage from "./pages/vendors/VendorsPage";
import CatererFormPage from "./pages/vendors/CatererFormPage";
import PhotographerFormPage from "./pages/vendors/PhotographerFormPage";
import RoomFormPage from "./pages/vendors/RoomFormPage";
import EditCatererFormPage from "./pages/vendors/EditCatererFormPage";
import EditPhotographerFormPage from "./pages/vendors/EditPhotographerFormPage";
import EditRoomFormPage from "./pages/vendors/EditRoomFormPage";
import EditMandapPage from "./pages/mandap/EditMandapPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/mandaps" element={<MandapsListPage />} />
            <Route path="/mandaps/new" element={<MandapFormPage />} />
            <Route path="/mandaps/edit/:id" element={<EditMandapPage />} />
            <Route path="/mandaps/:id/reviews" element={<ReviewsPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/vendors" element={<VendorsPage />} />
            <Route path="/vendors/caterers/new" element={<CatererFormPage />} />
            <Route
              path="/vendors/caterers/edit/:id"
              element={<EditCatererFormPage />}
            />
            <Route
              path="/vendors/photographers/new"
              element={<PhotographerFormPage />}
            />
            <Route
              path="/vendors/photographers/edit/:id"
              element={<EditPhotographerFormPage />}
            />
            <Route path="/vendors/rooms/new" element={<RoomFormPage />} />
            <Route
              path="/vendors/rooms/edit/:id"
              element={<EditRoomFormPage />}
            />
          </Route>
          <Route path="/logout" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
