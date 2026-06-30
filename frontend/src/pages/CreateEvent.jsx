import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PlusCircle, Save, Calendar, MapPin, Users, Tag, Image, AlignLeft, Layers } from 'lucide-react'
import { eventsAPI } from '../api'
import { CATEGORIES } from '../utils'
import { getErrorMessage } from '../utils'
import toast from 'react-hot-toast'

const EMPTY = {
  title: '', description: '', category: 'tech', date: '',
  venue: '', imageURL: '', maxCapacity: '', tags: '',
}

export default function CreateEvent() {
  const { id } = useParams()   // if id exists → edit mode
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  // Load event data in edit mode
  useEffect(() => {
    if (!isEdit) return
    eventsAPI.getById(id)
      .then(({ data }) => {
        const e = data.data
        setForm({
          title:       e.title,
          description: e.description,
          category:    e.category,
          date:        new Date(e.date).toISOString().slice(0, 16),
          venue:       e.venue,
          imageURL:    e.imageURL || '',
          maxCapacity: e.maxCapacity,
          tags:        e.tags?.join(', ') || '',
        })
      })
      .catch(() => toast.error('Could not load event'))
      .finally(() => setFetching(false))
  }, [id, isEdit])

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      ...form,
      maxCapacity: parseInt(form.maxCapacity),
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      imageURL: form.imageURL || undefined,
    }

    try {
      if (isEdit) {
        await eventsAPI.update(id, payload)
        toast.success('Event updated! ✅')
        navigate(`/events/${id}`)
      } else {
        const { data } = await eventsAPI.create(payload)
        toast.success('Event created! 🎉')
        navigate(`/events/${data.data._id}`)
      }
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-primary-600" />
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          {isEdit ? <Save className="h-7 w-7 text-primary-600" /> : <PlusCircle className="h-7 w-7 text-primary-600" />}
          {isEdit ? 'Edit Event' : 'Create New Event'}
        </h1>
        <p className="text-gray-500 mt-1">{isEdit ? 'Update event details below' : 'Fill in the details to publish your event'}</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">

        {/* Title */}
        <Field label="Event Title" icon={<Tag className="h-4 w-4" />}>
          <input type="text" name="title" value={form.title} onChange={onChange} required placeholder="e.g. Annual Hackathon 2025" className="input" />
        </Field>

        {/* Description */}
        <Field label="Description" icon={<AlignLeft className="h-4 w-4" />}>
          <textarea name="description" value={form.description} onChange={onChange} required rows={5} placeholder="Tell students what this event is about..." className="input resize-none" />
        </Field>

        {/* Category + Date row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Category" icon={<Layers className="h-4 w-4" />}>
            <select name="category" value={form.category} onChange={onChange} className="input">
              {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </Field>
          <Field label="Date & Time" icon={<Calendar className="h-4 w-4" />}>
            <input type="datetime-local" name="date" value={form.date} onChange={onChange} required className="input" min={new Date().toISOString().slice(0, 16)} />
          </Field>
        </div>

        {/* Venue + Capacity row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Venue" icon={<MapPin className="h-4 w-4" />}>
            <input type="text" name="venue" value={form.venue} onChange={onChange} required placeholder="e.g. Main Auditorium, Block A" className="input" />
          </Field>
          <Field label="Max Capacity" icon={<Users className="h-4 w-4" />}>
            <input type="number" name="maxCapacity" value={form.maxCapacity} onChange={onChange} required min="1" placeholder="e.g. 200" className="input" />
          </Field>
        </div>

        {/* Image URL */}
        <Field label="Cover Image URL (optional)" icon={<Image className="h-4 w-4" />}>
          <input type="url" name="imageURL" value={form.imageURL} onChange={onChange} placeholder="https://example.com/image.jpg" className="input" />
          {form.imageURL && (
            <div className="mt-2 rounded-lg overflow-hidden h-32">
              <img src={form.imageURL} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
            </div>
          )}
        </Field>

        {/* Tags */}
        <Field label="Tags (comma separated, optional)" icon={<Tag className="h-4 w-4" />}>
          <input type="text" name="tags" value={form.tags} onChange={onChange} placeholder="e.g. hackathon, coding, prizes, AI" className="input" />
        </Field>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-8">
            {loading
              ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              : isEdit ? <><Save className="h-4 w-4" /> Update Event</> : <><PlusCircle className="h-4 w-4" /> Publish Event</>
            }
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  )
}

const Field = ({ label, icon, children }) => (
  <div>
    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
      <span className="text-primary-500">{icon}</span> {label}
    </label>
    {children}
  </div>
)
