import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import DashboardEvents from './pages/DashboardEvents'
import DashboardParticipants from './pages/DashboardParticipants'
import DashboardStats from './pages/DashboardStats'
import DashboardNotifications from './pages/DashboardNotifications'
import DashboardSettings from './pages/DashboardSettings'
import DashboardCreateEvent from './pages/DashboardCreateEvent'
import DashboardUsers from './pages/DashboardUsers'
import DashboardReviews from './pages/DashboardReviews'
import BookingPage from './pages/BookingPage'
import RegisterClient from './pages/RegisterClient'
import DashboardMyBookings from './pages/DashboardMyBookings'
import TestimonialsPage from './pages/Testimonials'
import WeatherPlannerPage from './pages/WeatherPlannerPage'
import NotFound from './pages/NotFound'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <div key={location.pathname} style={{ animation: 'pageEnter 0.35s ease both' }}>
      <Routes location={location}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-client" element={<RegisterClient />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/events" element={<DashboardEvents />} />
        <Route path="/dashboard/participants" element={<DashboardParticipants />} />
        <Route path="/dashboard/my-bookings" element={<DashboardMyBookings />} />
        <Route path="/dashboard/stats" element={<DashboardStats />} />
        <Route path="/dashboard/notifications" element={<DashboardNotifications />} />
        <Route path="/dashboard/settings" element={<DashboardSettings />} />
        <Route path="/dashboard/events/new" element={<DashboardCreateEvent />} />
        <Route path="/dashboard/users" element={<DashboardUsers />} />
        <Route path="/dashboard/reviews" element={<DashboardReviews />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/temoignages" element={<TestimonialsPage />} />
        <Route path="/weather-planner" element={<WeatherPlannerPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AnimatedRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
