import { useEffect, useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:8000/api/choreos'

const styleOptions = [
  'Hip-Hop',
  'Contemporary',
  'Ballet',
  'Jazz',
  'Urban',
  'K-Pop',
  'House',
  'Popping',
  'Locking',
  'Breaking',
  'Other'
]

const difficultyOptions = ['Beginner', 'Intermediate', 'Advanced']
const statusOptions = ['Want to Learn', 'Learning', 'Finished']

const emptyForm = {
  title: '',
  videoUrl: '',
  style: '',
  difficulty: '',
  status: '',
  notes: ''
}

const defaultFilters = {
  style: '',
  difficulty: '',
  status: '',
  sortBy: 'newest'
}

const getThumbnailUrl = (videoUrl) => {
  if (!videoUrl?.trim()) return ''
  
  try {
    const url = new URL(videoUrl)

    // youtube.com/watch?v=VIDEO_ID
    if (url.hostname.includes('youtube.com')) {
      const videoId = url.searchParams.get('v')
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      }
    }

    // youtu.be/VIDEO_ID
    if (url.hostname.includes('youtu.be')) {
      const videoId = url.pathname.slice(1)
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      }
    }

    return ''
  }
  catch {
    return ''
  }
}

function App() {
  const [choreography, setChoreography] = useState([])
  const [formData, setFormData] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [editFormData, setEditFormData] = useState(emptyForm)
  const [filters, setFilters] = useState(defaultFilters)
  const [errorMessage, setErrorMessage] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  // runs once page loads
  useEffect(() => {
    // calls backend, converts response to JSON, store in choreography
    const fetchChoreography = async () => {
      try {
        const response = await fetch(API_URL)
        if (!response.ok) {
          throw new Error('Unable to load choreography.')
        }

        const data = await response.json()
        setChoreography(data)
      } catch (error) {
        console.error('Error fetching choreography:', error)
        setErrorMessage(error.message)
      }
    }

    fetchChoreography()
  }, [])

  // Form Handlers
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    })
  }

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }

  const resetFilters = () => {
    setFilters(defaultFilters)
  }

  // Add new choreo function
  const handleSubmit = async (e) => {
    // this prevents page refresh
    e.preventDefault()
    try {
      setErrorMessage('')
      // sends a POST request, convert to JSON, adds item to top
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const newChoreo = await response.json()

      if (!response.ok) {
        throw new Error(newChoreo.message || 'Unable to add choreography.')
      }

      setChoreography([newChoreo, ...choreography])
      // reset form
      setFormData(emptyForm)
      // close form before adding
      setShowAddForm(false)
    } catch (error) {
      console.error('Error adding choreography:', error)
      setErrorMessage(error.message)
    }
  }

  // Edit choreo button function
  const handleEditStart = (choreo) => {
    // saves the id, fill edit form with any changes
    setEditingId(choreo._id)
    setEditFormData({
      title: choreo.title ?? '',
      videoUrl: choreo.videoUrl ?? '',
      style: choreo.style ?? '',
      difficulty: choreo.difficulty ?? '',
      status: choreo.status ?? '',
      notes: choreo.notes ?? ''
    })
  }

  // Cancel editing
  const handleEditCancel = () => {
    setEditingId(null)
    setEditFormData(emptyForm)
  }

  // Updates a choreo
  const handleEditSave = async (id) => {
    try {
      setErrorMessage('')
      // sends PUT request with current id, replace updated item
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      })

      const updatedChoreo = await response.json()

      if (!response.ok) {
        throw new Error(updatedChoreo.message || 'Unable to update choreography.')
      }

      setChoreography(choreography.map((choreo) => (
        choreo._id === id ? updatedChoreo : choreo
      )))
      handleEditCancel()
    } catch (error) {
      console.error('Error updating choreography:', error)
      setErrorMessage(error.message)
    }
  }

  // deletes a choreo
  const handleDelete = async (id) => {
    try {
      setErrorMessage('')
      // sends DELETE request, filters out the current id
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Unable to delete choreography.')
      }

      setChoreography(choreography.filter((choreo) => choreo._id !== id))
    } catch (error) {
      console.error('Error deleting choreography:', error)
      setErrorMessage(error.message)
    }
  }

  // filtering and sorting of choreos in db
  const filteredChoreography = choreography
    .filter((choreo) => {
      if (filters.style && choreo.style !== filters.style) {
        return false
      }

      if (filters.difficulty && choreo.difficulty !== filters.difficulty) {
        return false
      }

      if (filters.status && choreo.status !== filters.status) {
        return false
      }

      return true
    })
    .sort((firstChoreo, secondChoreo) => {
      switch (filters.sortBy) {
        case 'oldest':
          return new Date(firstChoreo.createdAt) - new Date(secondChoreo.createdAt)
        case 'title-asc':
          return firstChoreo.title.localeCompare(secondChoreo.title)
        case 'title-desc':
          return secondChoreo.title.localeCompare(firstChoreo.title)
        default:
          return new Date(secondChoreo.createdAt) - new Date(firstChoreo.createdAt)
      }
    })

  return (
    <div className="dashboard-shell">
      <section className="profile-hero">
        <div className="profile-card">
          <div className="profile-avatar">NB</div>

          <div className="profile-copy">
            <p className="eyebrow">Hello, Nam Bui</p>
            <h1>My Choreo Library</h1>
            <p className="profile-subtitle">
              A personal space for organizing dances, keeping practice notes,
              and building your next set list.
            </p>
          </div>

          <div className="hero-actions">
            <button
              type="button"
              className="primary-button hero-button"
              onClick={() => setShowAddForm((currentValue) => !currentValue)}
            >
              Add Dance
            </button>
          </div>
        </div>

      </section>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {showAddForm && (
        <div
          className="modal-overlay"
          onClick={() => {
            setFormData(emptyForm)
            setShowAddForm(false)
          }}
        >
          <section
            className="panel modal-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="section-heading modal-heading">
              <div>
                <p className="eyebrow">New Entry</p>
                <h2>Add a New Choreo</h2>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => {
                  setFormData(emptyForm)
                  setShowAddForm(false)
                }}
                aria-label="Close add dance form"
              >
                x
              </button>
            </div>

            <form className="choreo-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
              />

              <input
                type="text"
                name="videoUrl"
                placeholder="Video URL"
                value={formData.videoUrl}
                onChange={handleChange}
              />

              <select
                name="style"
                value={formData.style}
                onChange={handleChange}
              >
                <option value="">Select Style</option>
                {styleOptions.map((style) => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>

              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
              >
                <option value="">Select Difficulty</option>
                {difficultyOptions.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="">Select Status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <textarea
                name="notes"
                placeholder="Notes"
                value={formData.notes}
                onChange={handleChange}
              />

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setFormData(emptyForm)
                    setShowAddForm(false)
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">Save Choreo</button>
              </div>
            </form>
          </section>
        </div>
      )}

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Library</p>
            <h2>Your Choreos</h2>
            <p className="section-subtitle">
              Browse your saved routines and shape the collection with filters.
            </p>
          </div>
          <p className="results-count">
            Showing {filteredChoreography.length} of {choreography.length} choreos
          </p>
        </div>

        <div className="toolbar-surface">
          <div className="toolbar-grid">
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">By Status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              name="style"
              value={filters.style}
              onChange={handleFilterChange}
            >
              <option value="">By Style</option>
              {styleOptions.map((style) => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>

            <select
              name="difficulty"
              value={filters.difficulty}
              onChange={handleFilterChange}
            >
              <option value="">By Difficulty</option>
              {difficultyOptions.map((difficulty) => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>

            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>
          </div>

          <div className="toolbar-footer">
            <button
              type="button"
              className="secondary-button"
              onClick={resetFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
        
        {/* list of choreos within library */}
        <div className="choreo-container">
          {filteredChoreography.map((choreo) => (
            <article className="choreo-card" key={choreo._id}>
              {editingId === choreo._id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={editFormData.title}
                    onChange={handleEditChange}
                  />

                  <input
                    type="text"
                    name="videoUrl"
                    placeholder="Video URL"
                    value={editFormData.videoUrl}
                    onChange={handleEditChange}
                  />

                  <select
                    name="style"
                    value={editFormData.style}
                    onChange={handleEditChange}
                  >
                    <option value="">Select Style</option>
                    {styleOptions.map((style) => (
                      <option key={style} value={style}>{style}</option>
                    ))}
                  </select>

                  <select
                    name="difficulty"
                    value={editFormData.difficulty}
                    onChange={handleEditChange}
                  >
                    <option value="">Select Difficulty</option>
                    {difficultyOptions.map((difficulty) => (
                      <option key={difficulty} value={difficulty}>{difficulty}</option>
                    ))}
                  </select>

                  <select
                    name="status"
                    value={editFormData.status}
                    onChange={handleEditChange}
                  >
                    <option value="">Select Status</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>

                  <textarea
                    name="notes"
                    placeholder="Notes"
                    value={editFormData.notes}
                    onChange={handleEditChange}
                  />

                  <div className="card-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={handleEditCancel}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="primary-button"
                      onClick={() => handleEditSave(choreo._id)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {getThumbnailUrl(choreo.videoUrl) ? (
                    <div className="card-thumbnail-wrap">
                      <img
                        className="card-thumbnail"
                        src={getThumbnailUrl(choreo.videoUrl)}
                        alt={`${choreo.title} thumbnail`}
                      />
                    </div>
                  ) : (
                    <div className="card-thumbnail-placeholder">
                      {/* <span>Dance</span> */}
                    </div>
                  )}

                  <div className="card-topline">
                    <span className={`status-pill ${choreo.status?.toLowerCase().replaceAll(' ', '-') || 'unlisted'}`}>
                      {choreo.status || 'No Status'}
                    </span>
                    <span className="difficulty-pill">{choreo.difficulty || 'Open Level'}</span>
                  </div>

                  <h3>
                    {choreo.videoUrl?.trim() ? (
                      <a href={choreo.videoUrl} target="_blank" rel="noreferrer">
                        {choreo.title}
                      </a>
                    ) : (
                      choreo.title
                    )}
                  </h3>

                  <p className="card-style">{choreo.style || 'Uncategorized Style'}</p>

                  {choreo.notes ? (
                    <p className="card-notes">{choreo.notes}</p>
                  ) : (
                    <p className="card-notes muted-text">No notes yet.</p>
                  )}

                  <div className="card-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => handleEditStart(choreo)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => handleDelete(choreo._id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>

        {filteredChoreography.length === 0 && (
          <div className="empty-state">
            <p>No choreos match the current filters.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default App
