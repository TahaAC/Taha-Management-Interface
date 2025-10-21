import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [projects, setProjects] = useState([])
  const [showAdmin, setShowAdmin] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: ''
  })

  // Load projects from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('tahaProjects')
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    } else {
      // Initialize with default projects
      const defaultProjects = [
        {
          id: Date.now() + 1,
          name: 'Bookings',
          description: 'Booking management system',
          url: 'https://bookings-rust-rho.vercel.app/'
        },
        {
          id: Date.now() + 2,
          name: 'Funeral Form',
          description: 'Funeral service form management',
          url: 'https://funeral-form.vercel.app/'
        },
        {
          id: Date.now() + 3,
          name: 'Membership',
          description: 'Membership management system',
          url: 'https://membership-plum.vercel.app/'
        },
        {
          id: Date.now() + 4,
          name: 'Taha School System',
          description: 'School management system',
          url: 'https://taha-school-system.vercel.app/'
        }
      ]
      setProjects(defaultProjects)
      localStorage.setItem('tahaProjects', JSON.stringify(defaultProjects))
    }
  }, [])

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('tahaProjects', JSON.stringify(projects))
    }
  }, [projects])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name && formData.description && formData.url) {
      const newProject = {
        id: Date.now(),
        ...formData
      }
      setProjects([...projects, newProject])
      setFormData({ name: '', description: '', url: '' })
      alert('Project added successfully!')
    }
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(project => project.id !== id))
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo-container">
          <img src="/logo.png" alt="Taha Association Center Logo" className="logo" />
          <div>
            <h1>Taha Association Center</h1>
            <p className="subtitle">Management Interface Dashboard</p>
          </div>
        </div>
        <button 
          className="admin-toggle"
          onClick={() => setShowAdmin(!showAdmin)}
        >
          {showAdmin ? '👁️ View Dashboard' : '⚙️ Add New URL'}
        </button>
      </header>

      <main className="main-content">
        {showAdmin ? (
          <div className="admin-panel">
            <h2 className="admin-title">Add New Project</h2>
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Project Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter project name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter project description"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="url">URL</label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  placeholder="https://your-project.vercel.app/"
                  required
                />
              </div>
              <button type="submit" className="submit-btn">
                ✓ Add Project
              </button>
            </form>

            <div className="manage-projects">
              <h3>Manage Existing Projects</h3>
              <div className="project-list">
                {projects.map((project) => (
                  <div key={project.id} className="project-item">
                    <div className="project-info">
                      <strong>{project.name}</strong>
                      <span>{project.description}</span>
                      <a href={project.url} target="_blank" rel="noopener noreferrer">
                        {project.url}
                      </a>
                    </div>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(project.id)}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <a 
                key={project.id} 
                href={project.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="project-card"
              >
                <h2 className="project-name">{project.name}</h2>
                <p className="project-description">{project.description}</p>
                <span className="view-link">View Project →</span>
              </a>
            ))}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>© 2025 Taha Association Center. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
