import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import BookingPage from './pages/BookingPage'
import TestimonialsPage from './pages/Testimonials'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* La page qui s'affiche au lancement */}
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Réservation d'événement */}
        <Route path="/booking/:id" element={<BookingPage />} />
        
        {/* Page de témoignages */}
        <Route path="/temoignages" element={<TestimonialsPage />} />

        {/* Si l'utilisateur tape n'importe quoi, on le ramène à l'accueil */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
