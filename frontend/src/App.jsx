import { useState, useEffect } from 'react'
import './App.css'

// fetch and display choreography
function App() {
  const [choreography, setChoreography] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    videoUrl: '',
    style: '',
    difficulty: '',
    status: '',
    notes: ''
  })

  useEffect( () => {
    const fetchChoreography = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/choreos')
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('http://localhost:8000/api/choreos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const newChoreo = await response.json()

      setChoreography([newChoreo, ...choreography])

      setFormData({
        title: '',
        videoUrl: '',
        style: '',
        difficulty: '',
        status: '',
        notes: ''
      })
    }
    catch (error) {
      console.error('Error adding choreography:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/choreos/${id}`, {
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
          <option value="Hip-Hop">Hip-Hop</option>
          <option value="Contemporary">Contemporary</option>
          <option value="Ballet">Ballet</option>
          <option value="Jazz">Jazz</option>
          <option value="Urban">Urban</option>
          <option value="K-Pop">K-Pop</option>
          <option value="House">House</option>
          <option value="Popping">Popping</option>
          <option value="Locking">Locking</option>
          <option value="Breaking">Breaking</option>
          <option value="Other">Other</option>
        </select>

        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
        >
          <option value="">Select Difficulty</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="">Select Status</option>
          <option value="Want to Learn">Want to Learn</option>
          <option value="Learning">Learning</option>
          <option value="Finished">Finished</option>
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
            <h3>{choreo.title}</h3>

            <p><strong>Style:</strong> {choreo.style}</p>
            <p><strong>Difficulty:</strong> {choreo.difficulty}</p>
            <p><strong>Status:</strong> {choreo.status}</p>

            {choreo.notes && (
              <p><strong>Notes:</strong> {choreo.notes}</p>
            )}

            <a href={choreo.videoUrl} target="_blank">
              Watch Video
            </a>

            <button onClick={() => handleDelete(choreo._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
