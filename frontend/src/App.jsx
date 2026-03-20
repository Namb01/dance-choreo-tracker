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

// fetch and display choreography
function App() {
  const [choreography, setChoreography] = useState([])
  const [formData, setFormData] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [editFormData, setEditFormData] = useState(emptyForm)

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

  return (
    <div>
      <h1>Choreography</h1>

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

      <div className="choreo-container">
        {choreography.map((choreo) => (
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
    </div>
  )
}

export default App
