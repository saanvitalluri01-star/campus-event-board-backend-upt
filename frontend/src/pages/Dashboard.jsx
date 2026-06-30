import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  PlusCircle, Calendar, Users, Trash2, Edit,
  CheckCircle, XCircle, LayoutDashboard, Clock
} from 'lucide-react'
import { usersAPI, eventsAPI } from '../api'
import { useAuth } from '../context/AuthContext'
import { formatDateTime, categoryColors, statusColors, getErrorMessage } from '../utils'
import { PageSpinner } from '../components/Spinner'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { user, isOrganizer } = useAuth()
  const [events, setEvents] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const fetchEvents = async (p = 1) => {
    setLoading(true)
    try {
      const fetcher = isOrganizer ? usersAPI.getMyEvents : usersAPI.getMyRsvps
      const { data } = await fetcher({ page: p, limit: 8 })
      setEvents(data.data)
      setPagination(data.pagination)
      setPage(p)
    } catch {
      toast.error('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEvents() }, [isOrganizer]) // eslint-disable-line

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return
    try {
      await eventsAPI.delete(id)
      toast.success('Event deleted')
      fetchEvents(page)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleCancelRsvp = async (id, title) => {
    if (!window.confirm(`Cancel RSVP for "${title}"?`)) return
    try {
      await eventsAPI.cancelRsvp(id)
      toast.success('RSVP cancelled')
      fetchEvents(page)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="h-8 w-8 text-primary-600" />
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back, <span className="font-semibold text-gray-700">{user?.name}</span>
            <span className={`badge ml-2 ${user?.role === 'organizer' ? 'bg-purple-100 text-purple-700' : user?.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
              {user?.role}
            </span>
          </p>
        </div>
        {isOrganizer && (
          <Link to="/events/new" className="btn-primary flex items-center gap-2">
            <PlusCircle className="h-4 w-4" /> Create Event
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={<Calendar className="h-6 w-6 text-primary-600" />}
          label={isOrganizer ? 'Events Created' : 'Events RSVPed'}
          value={pagination.totalEvents ?? 0}
          bg="bg-primary-50"
        />
        <StatCard
          icon={<CheckCircle className="h-6 w-6 text-emerald-600" />}
          label="Upcoming"
          value={events.filter(e => e.status === 'upcoming').length}
          bg="bg-emerald-50"
        />
        <StatCard
          icon={<Clock className="h-6 w-6 text-amber-600" />}
          label="Completed"
          value={events.filter(e => e.status === 'completed').length}
          bg="bg-amber-50"
        />
      </div>

      {/* Events */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">
            {isOrganizer ? '🎤 My Created Events' : '🎓 My RSVPs'}
          </h2>
          <span className="text-sm text-gray-500">{pagination.totalEvents ?? 0} total</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-primary-600" /></div>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">{isOrganizer ? '🎤' : '🎓'}</div>
            <h3 className="font-semibold text-gray-700">
              {isOrganizer ? "You haven't created any events yet" : "You haven't RSVPed to any events yet"}
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              {isOrganizer ? 'Click "Create Event" to get started' : 'Browse events and RSVP to see them here'}
            </p>
            <Link to={isOrganizer ? '/events/new' : '/events'} className="btn-primary mt-4 inline-block text-sm">
              {isOrganizer ? 'Create First Event' : 'Browse Events'}
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {events.map(event => (
              <div key={event._id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-gray-50 transition-colors">
                {/* Image */}
                <div className="w-full sm:w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {event.imageURL
                    ? <img src={event.imageURL} alt="" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                    : <div className="w-full h-full flex items-center justify-center text-2xl">🎓</div>
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Link to={`/events/${event._id}`} className="font-semibold text-gray-900 hover:text-primary-600 truncate">
                      {event.title}
                    </Link>
                    <span className={`badge ${categoryColors[event.category]}`}>{event.category}</span>
                    <span className={`badge ${statusColors[event.status]}`}>{event.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDateTime(event.date)}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{event.rsvpCount} / {event.maxCapacity}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {isOrganizer ? (
                    <>
                      <Link to={`/events/${event._id}/edit`} className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Edit">
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button onClick={() => handleDelete(event._id, event.title)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => handleCancelRsvp(event._id, event.title)} className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border border-red-200">
                      <XCircle className="h-3.5 w-3.5" /> Cancel RSVP
                    </button>
                  )}
                  <Link to={`/events/${event._id}`} className="text-xs font-medium text-primary-600 hover:underline px-2">
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex justify-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => fetchEvents(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium ${p === page ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const StatCard = ({ icon, label, value, bg }) => (
  <div className={`${bg} rounded-xl p-4 flex items-center gap-3`}>
    <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  </div>
)
