import { useState, useEffect } from 'react'
import './App.css'
import firebaseProjectDB from './database/FirebaseProjectDatabase'
import DatabaseSync from './database/DatabaseSync'

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
  const [dataSummary, setDataSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  // Load projects from Firebase database on mount
  useEffect(() => {
    loadProjects()
    loadCategories()
    
    // Set up real-time listener
    const unsubscribe = firebaseProjectDB.onProjectsChange((projects) => {
      setProjects(projects)
      setLoading(false)
    })

    // Cleanup listener on unmount
    return () => unsubscribe()
  }, [])

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const loadProjects = async () => {
    setLoading(true)
    const allProjects = await firebaseProjectDB.getAllProjects()
    setProjects(allProjects)
    setLoading(false)
  }

  const loadCategories = async () => {
    const dbCategories = await firebaseProjectDB.getCategories()
    const allCategories = ['All', ...dbCategories]
    setCategories(allCategories)
  }

  const handleExportDatabase = async () => {
    setLoading(true)
    const exportData = await firebaseProjectDB.exportData()
    
    try {
      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      
      const link = document.createElement('a')
      link.href = URL.createObjectURL(dataBlob)
      link.download = `firebase-projects-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      alert(`✅ Firebase data exported successfully!\n\n📁 File: firebase-projects-backup-${new Date().toISOString().split('T')[0]}.json\n🔥 Total Projects: ${exportData.projects.length}`)
    } catch (error) {
      alert(`❌ Export failed: ${error.message}`)
    }
    setLoading(false)
  }

  const handleShowDataSummary = async () => {
    setLoading(true)
    const stats = await firebaseProjectDB.getStats()
    const summaryText = `
� Firebase Database Summary:
• Total Projects: ${stats.totalProjects}
• Active Projects: ${stats.activeProjects}
• Categories: ${stats.categories.join(', ')}
• Last Updated: ${new Date(stats.lastUpdated).toLocaleString()}

🌐 Connection: ${isOnline ? '✅ Online' : '❌ Offline'}
📊 Real-time sync: ${isOnline ? 'Active' : 'Disabled'}
    `
    alert(summaryText)
    setLoading(false)
  }

  const handleMigrateFromLocalStorage = async () => {
    if (confirm('� Migrate localStorage data to Firebase?\n\nThis will copy all your cached URLs to Firebase database.')) {
      setLoading(true)
      const result = await firebaseProjectDB.migrateFromLocalStorage()
      
      if (result.success) {
        alert(`✅ Migration completed!\n\n📊 Results:\n• Successful: ${result.successful}\n• Failed: ${result.failed}\n\nYour URLs are now saved in Firebase!`)
        loadCategories()
      } else {
        alert(`❌ Migration failed: ${result.error || result.message}`)
      }
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.name && formData.description && formData.url) {
      setLoading(true)
      const result = await firebaseProjectDB.addProject({
        name: formData.name,
        description: formData.description,
        url: formData.url,
        category: formData.category || 'Management'
      })
      
      if (result.success) {
        loadCategories() // Reload categories in case new one was added
        setFormData({ name: '', description: '', url: '', category: 'Management' })
        alert('✅ Project added successfully to Firebase!')
      } else {
        alert('❌ Error adding project: ' + result.error)
      }
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setLoading(true)
      const result = await firebaseProjectDB.deleteProject(id)
      if (result.success) {
        loadCategories() // Reload categories
        alert('✅ Project deleted successfully!')
      } else {
        alert('❌ Error deleting project: ' + result.error)
      }
      setLoading(false)
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

            <div className="database-actions">
              <h3>🔥 Firebase Database Management</h3>
              <div className="connection-status">
                <span className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
                  {isOnline ? '🟢 Connected' : '🔴 Offline'}
                </span>
                <span className="sync-status">
                  {loading ? '🔄 Syncing...' : '✅ Synchronized'}
                </span>
              </div>
              <div className="action-buttons">
                <button className="export-btn" onClick={handleExportDatabase} disabled={loading}>
                  💾 Export Firebase Data
                </button>
                <button className="summary-btn" onClick={handleShowDataSummary} disabled={loading}>
                  📊 View Database Stats
                </button>
                <button className="migrate-btn" onClick={handleMigrateFromLocalStorage} disabled={loading}>
                  🔄 Migrate Cache to Firebase
                </button>
              </div>
              <div className="data-info">
                <p><strong>🔥 Database:</strong> Firebase Firestore</p>
                <p><strong>📊 Total Projects:</strong> {projects.length}</p>
                <p><strong>📂 Categories:</strong> {categories.length - 1}</p>
                <p><strong>🔄 Real-time:</strong> {isOnline ? 'Active' : 'Disabled'}</p>
              </div>
            </div>

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
        ) : loading ? (
          <div className="loading-screen">
            <div className="loading-spinner"></div>
            <h2>🔥 Connecting to Firebase...</h2>
            <p>Loading your projects from the cloud database</p>
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
