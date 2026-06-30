import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { eventsAPI } from '../api'
import EventCard from '../components/EventCard'
import { PageSpinner } from '../components/Spinner'
import { CATEGORIES, STATUSES } from '../utils'
import toast from 'react-hot-toast'

export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [events, setEvents] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    search:    searchParams.get('search')   || '',
    category:  searchParams.get('category') || '',
    status:    searchParams.get('status')   || '',
    sortBy:    searchParams.get('sortBy')   || 'date',
    sortOrder: searchParams.get('sortOrder')|| 'asc',
    page:      parseInt(searchParams.get('page')) || 1,
    limit:     9,
  })

  const fetchEvents = useCallback(async (f) => {
    setLoading(true)
    try {
      const params = {}
      if (f.search)    params.search    = f.search
      if (f.category)  params.category  = f.category
      if (f.status)    params.status    = f.status
      if (f.sortBy)    params.sortBy    = f.sortBy
      if (f.sortOrder) params.sortOrder = f.sortOrder
      params.page  = f.page
      params.limit = f.limit

      const { data } = await eventsAPI.getAll(params)
      setEvents(data.data)
      setPagination(data.pagination)

      // Sync URL
      const sp = new URLSearchParams()
      Object.entries(params).forEach(([k, v]) => sp.set(k, v))
      setSearchParams(sp, { replace: true })
    } catch {
      toast.error('Failed to load events')
    } finally {
      setLoading(false)
    }
  }, [setSearchParams])

  useEffect(() => { fetchEvents(filters) }, []) // eslint-disable-line

  const apply = (overrides = {}) => {
    const next = { ...filters, ...overrides, page: overrides.page ?? 1 }
    setFilters(next)
    fetchEvents(next)
  }

  const clearFilters = () => {
    const reset = { search: '', category: '', status: '', sortBy: 'date', sortOrder: 'asc', page: 1, limit: 9 }
    setFilters(reset)
    fetchEvents(reset)
  }

  const hasFilters = filters.search || filters.category || filters.status

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Browse Events</h1>
        <p className="text-gray-500 mt-1">Discover what's happening on campus</p>
      </div>

      {/* Search + Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search events, tags, venues..."
            value={filters.search}
            onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && apply({ search: filters.search })}
            className="input pl-10"
          />
        </div>
        <select
          value={`${filters.sortBy}:${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split(':')
            apply({ sortBy, sortOrder })
          }}
          className="input sm:w-48"
        >
          <option value="date:asc">Date: Earliest</option>
          <option value="date:desc">Date: Latest</option>
          <option value="rsvpCount:desc">Most Popular</option>
          <option value="rsvpCount:asc">Least Popular</option>
          <option value="title:asc">Title: A–Z</option>
        </select>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary flex items-center gap-2 ${showFilters ? 'bg-primary-50 border-primary-300 text-primary-700' : ''}`}
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
          {hasFilters && <span className="bg-primary-600 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">!</span>}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
            <select value={filters.category} onChange={(e) => apply({ category: e.target.value })} className="input">
              <option value="">All categories</option>
              {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <select value={filters.status} onChange={(e) => apply({ status: e.target.value })} className="input">
              <option value="">All statuses</option>
              {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
          </div>
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium">
              <X className="h-4 w-4" /> Clear all
            </button>
          )}
        </div>
      )}

      {/* Active filter chips */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.search && (
            <Chip label={`"${filters.search}"`} onRemove={() => apply({ search: '' })} />
          )}
          {filters.category && (
            <Chip label={filters.category} onRemove={() => apply({ category: '' })} />
          )}
          {filters.status && (
            <Chip label={filters.status} onRemove={() => apply({ status: '' })} />
          )}
        </div>
      )}

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-gray-500 mb-4">
          {pagination.totalEvents ?? 0} event{pagination.totalEvents !== 1 ? 's' : ''} found
          {filters.search ? ` for "${filters.search}"` : ''}
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-primary-600" /></div>
      ) : events.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">🔍</div>
          <h3 className="text-lg font-semibold text-gray-700">No events found</h3>
          <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or search terms</p>
          <button onClick={clearFilters} className="btn-primary mt-4 text-sm py-2 px-4">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map(event => <EventCard key={event._id} event={event} />)}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            disabled={!pagination.hasPrevPage}
            onClick={() => apply({ page: filters.page - 1 })}
            className="btn-secondary py-2 px-3 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => apply({ page: p })}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                p === pagination.currentPage ? 'bg-primary-600 text-white' : 'btn-secondary py-0 px-0'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            disabled={!pagination.hasNextPage}
            onClick={() => apply({ page: filters.page + 1 })}
            className="btn-secondary py-2 px-3 disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}

const Chip = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 text-xs font-medium px-3 py-1 rounded-full border border-primary-200">
    {label}
    <button onClick={onRemove}><X className="h-3 w-3" /></button>
  </span>
)
