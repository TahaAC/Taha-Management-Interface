import { useState, useEffect } from 'react'
import './App.css'
import projectDB from './database/ProjectDatabase'

function App() {
  const [projects, setProjects] = useState([])
  const [showAdmin, setShowAdmin] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    category: 'Management'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [categories, setCategories] = useState(['All'])

  // Load projects from database on mount
  useEffect(() => {
    loadProjects()
    loadCategories()
  }, [])

  const loadProjects = () => {
    const allProjects = projectDB.getAllProjects()
    setProjects(allProjects)
  }

  const loadCategories = () => {
    const allCategories = ['All', ...projectDB.getCategories()]
    setCategories(allCategories)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name && formData.description && formData.url) {
      const result = projectDB.addProject({
        name: formData.name,
        description: formData.description,
        url: formData.url,
        category: formData.category || 'Management'
      })
      
      if (result.success) {
        loadProjects()
        loadCategories()
        setFormData({ name: '', description: '', url: '', category: 'Management' })
        alert('Project added successfully!')
      } else {
        alert('Error adding project: ' + result.error)
      }
    }
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const result = projectDB.deleteProject(id)
      if (result.success) {
        loadProjects()
        loadCategories()
      } else {
        alert('Error deleting project: ' + result.error)
      }
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryFilter = (e) => {
    setSelectedCategory(e.target.value)
  }

  // Filter projects based on search and category
  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchTerm === '' || 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.url.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

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
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Management">Management</option>
                  <option value="Forms">Forms</option>
                  <option value="Education">Education</option>
                  <option value="Finance">Finance</option>
                  <option value="Communications">Communications</option>
                  <option value="Other">Other</option>
                </select>
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
                      <span className="project-category">{project.category}</span>
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
          <div className="dashboard-section">
            <div className="dashboard-controls">
              <div className="search-filter-container">
                <input
                  type="text"
                  placeholder="🔍 Search projects..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="search-input"
                />
                <select
                  value={selectedCategory}
                  onChange={handleCategoryFilter}
                  className="category-filter"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="project-stats">
                <span className="stat">Total: {projects.length}</span>
                <span className="stat">Showing: {filteredProjects.length}</span>
              </div>
            </div>
            
            <div className="projects-grid">
              {filteredProjects.map((project) => (
                <a 
                  key={project.id} 
                  href={project.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="project-card"
                >
                  <div className="project-header">
                    <h2 className="project-name">{project.name}</h2>
                    <span className="project-category-badge">{project.category}</span>
                  </div>
                  <p className="project-description">{project.description}</p>
                  <span className="view-link">View Project →</span>
                </a>
              ))}
            </div>
            
            {filteredProjects.length === 0 && (
              <div className="no-results">
                <p>No projects found matching your criteria.</p>
              </div>
            )}
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
