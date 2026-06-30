import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Home         from './pages/Home'
import Events       from './pages/Events'
import EventDetail  from './pages/EventDetail'
import Login        from './pages/Login'
import Register     from './pages/Register'
import Dashboard    from './pages/Dashboard'
import CreateEvent  from './pages/CreateEvent'
import NotFound     from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />

          <main className="flex-1">
            <Routes>
              {/* Public */}
              <Route path="/"           element={<Home />} />
              <Route path="/events"     element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/login"      element={<Login />} />
              <Route path="/register"   element={<Register />} />

              {/* Protected — any logged in user */}
              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />

              {/* Protected — organizer/admin only */}
              <Route path="/events/new" element={
                <ProtectedRoute roles={['organizer', 'admin']}>
                  <CreateEvent />
                </ProtectedRoute>
              } />
              <Route path="/events/:id/edit" element={
                <ProtectedRoute roles={['organizer', 'admin']}>
                  <CreateEvent />
                </ProtectedRoute>
              } />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: { borderRadius: '10px', fontSize: '14px', fontWeight: '500' },
            success: { iconTheme: { primary: '#2563eb', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  )
}
