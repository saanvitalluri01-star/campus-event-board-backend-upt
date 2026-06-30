import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Calendar, MapPin, Users, Tag, Share2, ArrowLeft,
  CheckCircle, XCircle, Clock, UserCircle, Trash2, Edit
} from 'lucide-react'
import { eventsAPI } from '../api'
import { useAuth } from '../context/AuthContext'
import { formatDateTime, formatRelative, categoryColors, statusColors, getErrorMessage } from '../utils'
import { PageSpinner } from '../components/Spinner'
import toast from 'react-hot-toast'

export default function EventDetail() {
  const { id } = useParams()
  const { user, isOrganizer } = useAuth()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rsvpLoading, setRsvpLoading] = useState(false)

  useEffect(() => {
    eventsAPI.getById(id)
      .then(({ data }) => setEvent(data.data))
      .catch(() => toast.error('Event not found'))
      .finally(() => setLoading(false))
  }, [id])

  const hasRsvped = user && event?.rsvps?.some(r =>
    (typeof r === 'string' ? r : r._id) === user.id
  )
  const isFull = event?.rsvpCount >= event?.maxCapacity
  const fillPct = event ? Math.min(100, Math.round((event.rsvpCount / event.maxCapacity) * 100)) : 0
  const isOwner = user && event?.organizer?._id === user.id
  const canEdit = isOwner || user?.role === 'admin'

  const handleRsvp = async () => {
    if (!user) { navigate('/login'); return }
    setRsvpLoading(true)
    try {
      if (hasRsvped) {
        await eventsAPI.cancelRsvp(id)
        toast.success('RSVP cancelled')
      } else {
        await eventsAPI.rsvp(id)
        toast.success('🎉 RSVP confirmed!')
      }
      const { data } = await eventsAPI.getById(id)
      setEvent(data.data)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setRsvpLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return
    try {
      await eventsAPI.delete(id)
      toast.success('Event deleted')
      navigate('/dashboard')
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  if (loading) return <PageSpinner />
  if (!event) return (
    <div className="text-center py-20">
      <h2 className="text-xl font-bold text-gray-700">Event not found</h2>
      <Link to="/events" className="btn-primary mt-4 inline-block text-sm">Browse Events</Link>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          {event.imageURL && (
            <div className="rounded-2xl overflow-hidden h-64 md:h-80">
              <img src={event.imageURL} alt={event.title} className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
            </div>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`badge ${categoryColors[event.category] || categoryColors.other} text-sm px-3 py-1`}>
              {event.category}
            </span>
            <span className={`badge ${statusColors[event.status] || statusColors.upcoming} text-sm px-3 py-1`}>
              {event.status}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-extrabold text-gray-900">{event.title}</h1>

          {/* Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: Calendar, label: formatDateTime(event.date) },
              { icon: MapPin,   label: event.venue },
              { icon: Clock,    label: `Posted ${formatRelative(event.createdAt)}` },
              { icon: UserCircle, label: `By ${event.organizer?.name || 'Unknown'}` },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2.5">
                <Icon className="h-4 w-4 text-primary-500 shrink-0" />
                {label}
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">About this event</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{event.description}</p>
          </div>

          {/* Tags */}
          {event.tags?.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4" /> Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {event.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: RSVP card */}
        <div className="space-y-4">
          <div className="card p-5 sticky top-20">
            {/* Capacity */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-gray-700 flex items-center gap-1">
                  <Users className="h-4 w-4" /> Attendees
                </span>
                <span className="text-gray-500">{event.rsvpCount} / {event.maxCapacity}</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isFull ? 'bg-red-500' : fillPct > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${fillPct}%` }}
                />
              </div>
              <p className={`text-xs mt-1.5 font-medium ${isFull ? 'text-red-600' : 'text-emerald-700'}`}>
                {isFull ? '❌ Fully booked' : `✅ ${event.maxCapacity - event.rsvpCount} spots remaining`}
              </p>
            </div>

            {/* RSVP button */}
            {user?.role !== 'organizer' && user?.role !== 'admin' && event.status !== 'completed' && event.status !== 'cancelled' ? (
              <button
                onClick={handleRsvp}
                disabled={rsvpLoading || (isFull && !hasRsvped)}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  hasRsvped
                    ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                    : isFull
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {rsvpLoading ? (
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                ) : hasRsvped ? (
                  <><XCircle className="h-4 w-4" /> Cancel RSVP</>
                ) : isFull ? (
                  'Event Full'
                ) : (
                  <><CheckCircle className="h-4 w-4" /> RSVP Now</>
                )}
              </button>
            ) : !user ? (
              <Link to="/login" className="btn-primary w-full text-center block py-3 rounded-xl font-bold text-sm">
                Login to RSVP
              </Link>
            ) : null}

            {/* Share */}
            <button onClick={handleShare} className="btn-secondary w-full mt-2 flex items-center justify-center gap-2 text-sm">
              <Share2 className="h-4 w-4" /> Share Event
            </button>

            {/* Organizer actions */}
            {canEdit && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Organizer Actions</p>
                <Link
                  to={`/events/${id}/edit`}
                  className="btn-secondary w-full flex items-center justify-center gap-2 text-sm"
                >
                  <Edit className="h-4 w-4" /> Edit Event
                </Link>
                <button
                  onClick={handleDelete}
                  className="btn-danger w-full flex items-center justify-center gap-2 text-sm"
                >
                  <Trash2 className="h-4 w-4" /> Delete Event
                </button>
              </div>
            )}

            {/* Organizer info */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 font-medium mb-1">Organised by</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">
                  {event.organizer?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{event.organizer?.name}</p>
                  <p className="text-xs text-gray-500">{event.organizer?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
