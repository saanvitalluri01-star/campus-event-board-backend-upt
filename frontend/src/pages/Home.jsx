import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Calendar, Users, Zap, ArrowRight, MapPin } from 'lucide-react'
import { eventsAPI } from '../api'
import EventCard from '../components/EventCard'
import { PageSpinner } from '../components/Spinner'
import { categoryColors, CATEGORIES } from '../utils'
import toast from 'react-hot-toast'

const CATEGORY_ICONS = {
  tech: '💻', cultural: '🎭', sports: '🏆',
  academic: '📚', social: '🎉', other: '📌',
}

export default function Home() {
  const [upcoming, setUpcoming] = useState([])
  const [popular, setPopular] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([eventsAPI.getUpcoming(6), eventsAPI.getPopular(6)])
      .then(([u, p]) => {
        setUpcoming(u.data.data)
        setPopular(p.data.data)
      })
      .catch(() => toast.error('Failed to load events'))
      .finally(() => setLoading(false))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (activeCategory) params.set('category', activeCategory)
    navigate(`/events?${params.toString()}`)
  }

  const handleCategory = (cat) => {
    const next = cat === activeCategory ? '' : cat
    setActiveCategory(next)
    navigate(`/events${next ? `?category=${next}` : ''}`)
  }

  if (loading) return <PageSpinner />

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Zap className="h-4 w-4" /> Never miss a campus event again
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Your Campus,<br />
            <span className="text-primary-200">Your Events</span>
          </h1>
          <p className="text-primary-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Discover upcoming events, RSVP in one click, and never miss out on what's happening around campus.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events, venues, tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 shadow-lg"
              />
            </div>
            <button type="submit" className="bg-white text-primary-700 font-bold px-6 py-3.5 rounded-xl hover:bg-primary-50 transition-colors shadow-lg">
              Search
            </button>
          </form>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-12 text-sm">
            {[
              { icon: <Calendar className="h-4 w-4" />, label: `${upcoming.length}+ Upcoming Events` },
              { icon: <Users className="h-4 w-4" />, label: 'Hundreds of Students' },
              { icon: <MapPin className="h-4 w-4" />, label: 'All Campus Venues' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-primary-100">
                {icon} {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Tabs ── */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            <button
              onClick={() => handleCategory('')}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === '' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🌟 All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  activeCategory === cat ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {CATEGORY_ICONS[cat]} {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">

        {/* ── Upcoming Events ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">🗓️ Upcoming Events</h2>
              <p className="text-gray-500 text-sm mt-1">Don't miss these events happening soon</p>
            </div>
            <Link to="/events?status=upcoming" className="flex items-center gap-1 text-primary-600 text-sm font-semibold hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <EmptyState message="No upcoming events right now." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcoming.map((event) => <EventCard key={event._id} event={event} />)}
            </div>
          )}
        </section>

        {/* ── Popular Events ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">🔥 Popular Events</h2>
              <p className="text-gray-500 text-sm mt-1">Most RSVPed events on campus</p>
            </div>
            <Link to="/events?sortBy=rsvpCount&sortOrder=desc" className="flex items-center gap-1 text-primary-600 text-sm font-semibold hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {popular.length === 0 ? (
            <EmptyState message="No popular events yet." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {popular.map((event) => <EventCard key={event._id} event={event} />)}
            </div>
          )}
        </section>

        {/* ── CTA ── */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl text-white text-center p-10">
          <h2 className="text-2xl font-bold mb-2">Organising an event?</h2>
          <p className="text-primary-100 mb-6">Create your event and reach hundreds of students in seconds.</p>
          <Link to="/register" className="bg-white text-primary-700 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors inline-block">
            Get Started — It's Free
          </Link>
        </section>
      </div>
    </div>
  )
}

const EmptyState = ({ message }) => (
  <div className="text-center py-12 text-gray-400">
    <Calendar className="h-10 w-10 mx-auto mb-2 opacity-40" />
    <p>{message}</p>
  </div>
)
