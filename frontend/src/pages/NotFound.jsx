import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="text-center">
        <div className="text-8xl font-extrabold text-primary-100 select-none">404</div>
        <div className="text-6xl mb-4">🎓</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-sm">
          Looks like this page took a gap year. Let's get you back on campus.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn-primary">Go Home</Link>
          <Link to="/events" className="btn-secondary">Browse Events</Link>
        </div>
      </div>
    </div>
  )
}
