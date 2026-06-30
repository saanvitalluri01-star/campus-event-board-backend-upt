import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { GraduationCap, Menu, X, LogOut, User, LayoutDashboard, PlusCircle } from 'lucide-react'

export default function Navbar() {
  const { user, logout, isOrganizer } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setDropdownOpen(false)
    setMenuOpen(false)
  }

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'}`

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary-600">
            <GraduationCap className="h-7 w-7" />
            <span className="hidden sm:block">CampusEvents</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/events" className={navLinkClass}>Events</NavLink>
            {isOrganizer && (
              <NavLink to="/events/new" className={navLinkClass}>Create Event</NavLink>
            )}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1.5 transition-colors"
                >
                  <div className="w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">{user.name}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold truncate">{user.email}</p>
                      <span className="badge bg-primary-100 text-primary-700 mt-1">{user.role}</span>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    {isOrganizer && (
                      <Link
                        to="/events/new"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <PlusCircle className="h-4 w-4" /> Create Event
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-2">
          <NavLink to="/" end className={navLinkClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
          <br />
          <NavLink to="/events" className={navLinkClass} onClick={() => setMenuOpen(false)}>Events</NavLink>
          {user ? (
            <>
              <br />
              <NavLink to="/dashboard" className={navLinkClass} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
              {isOrganizer && (
                <>
                  <br />
                  <NavLink to="/events/new" className={navLinkClass} onClick={() => setMenuOpen(false)}>Create Event</NavLink>
                </>
              )}
              <br />
              <button onClick={handleLogout} className="text-sm font-medium text-red-600">Logout</button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" className="btn-secondary text-sm py-1.5 px-3" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn-primary text-sm py-1.5 px-3" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      )}

      {/* Close dropdown on outside click */}
      {dropdownOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
      )}
    </nav>
  )
}
