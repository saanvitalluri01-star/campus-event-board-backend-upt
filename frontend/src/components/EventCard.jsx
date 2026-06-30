import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users, Tag } from 'lucide-react'
import { formatDateTime, truncate, categoryColors, statusColors } from '../utils'

export default function EventCard({ event }) {
  const spotsLeft = event.maxCapacity - event.rsvpCount
  const isFull = spotsLeft <= 0
  const fillPct = Math.min(100, Math.round((event.rsvpCount / event.maxCapacity) * 100))

  return (
    <Link to={`/events/${event._id}`} className="card group hover:shadow-md transition-shadow duration-200 flex flex-col">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gray-100">
        {event.imageURL ? (
          <img
            src={event.imageURL}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
            <Tag className="h-10 w-10 text-primary-400" />
          </div>
        )}
        <div className="absolute top-2 left-2 flex gap-1.5">
          <span className={`badge ${categoryColors[event.category] || categoryColors.other}`}>
            {event.category}
          </span>
          <span className={`badge ${statusColors[event.status] || statusColors.upcoming}`}>
            {event.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {event.title}
        </h3>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{truncate(event.description, 100)}</p>

        <div className="space-y-1.5 mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar className="h-3.5 w-3.5 text-primary-500 shrink-0" />
            <span className="truncate">{formatDateTime(event.date)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="h-3.5 w-3.5 text-primary-500 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Users className="h-3.5 w-3.5 text-primary-500 shrink-0" />
            <span>{event.rsvpCount} / {event.maxCapacity} RSVPs</span>
          </div>
        </div>

        {/* Capacity bar */}
        <div className="mt-3">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${isFull ? 'bg-red-500' : fillPct > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${fillPct}%` }}
            />
          </div>
          <p className={`text-xs mt-1 font-medium ${isFull ? 'text-red-600' : 'text-gray-500'}`}>
            {isFull ? 'Fully booked' : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
          </p>
        </div>
      </div>
    </Link>
  )
}
