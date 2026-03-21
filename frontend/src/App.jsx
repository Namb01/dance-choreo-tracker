import { useState, useEffect } from 'react'
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

// fetch and display choreography
function App() {
  const [choreography, setChoreography] = useState([])
  const [formData, setFormData] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [editFormData, setEditFormData] = useState(emptyForm)
  const [filters, setFilters] = useState(defaultFilters)

  useEffect( () => {
    const fetchChoreography = async () => {
      try {
        const response = await fetch(API_URL)
        const data = await response.json()
        setChoreography(data)
      } 
      catch (error) {
        console.error('Error fetching choreography:', error)
      }
    }
    fetchChoreography()
  }, [])

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

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const newChoreo = await response.json()

      setChoreography([newChoreo, ...choreography])

      setFormData(emptyForm)
    }
    catch (error) {
      console.error('Error adding choreography:', error)
    }
  }

  const handleEditStart = (choreo) => {
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

  const handleEditCancel = () => {
    setEditingId(null)
    setEditFormData(emptyForm)
  }

  const handleEditSave = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      })

      const updatedChoreo = await response.json()

      setChoreography(choreography.map((choreo) => (
        choreo._id === id ? updatedChoreo : choreo
      )))
      handleEditCancel()
    }
    catch (error) {
      console.error('Error updating choreography:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })

      setChoreography(choreography.filter((choreo) => choreo._id !== id))
    }
    catch (error) {
      console.error('Error deleting choreography:', error)
    }
  }

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
    <div>
      <h1>Save Your Choreos!</h1>

      <form onSubmit={handleSubmit}>
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

        <button type="submit">Add Choreography</button>
      </form>

      <div className="toolbar">
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
          <p className="results-count">
            Showing {filteredChoreography.length} of {choreography.length} choreos
          </p>
          <button
            type="button"
            className="secondary-button"
            onClick={resetFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="choreo-container">
        {filteredChoreography.map((choreo) => (
          <div className="choreo-card" key={choreo._id}>
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
                <h3>{choreo.title}</h3>

                <p><strong>Style:</strong> {choreo.style}</p>
                <p><strong>Difficulty:</strong> {choreo.difficulty}</p>
                <p><strong>Status:</strong> {choreo.status}</p>

                {choreo.notes && (
                  <p><strong>Notes:</strong> {choreo.notes}</p>
                )}

                <a href={choreo.videoUrl} target="_blank" rel="noreferrer">
                  {choreo.title}
                </a>

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
          </div>
        ))}
      </div>

      {filteredChoreography.length === 0 && (
        <p className="empty-state">No choreos match the current filters yet.</p>
      )}
    </div>
  )
}

export default App
