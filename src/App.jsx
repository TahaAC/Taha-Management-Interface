import { useState, useEffect } from 'react'
import './App.css'
import firebaseProjectDB from './database/FirebaseProjectDatabase'
import BiometricAuth from './services/BiometricAuth'
import AuthScreen from './components/AuthScreen'

function App() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState('')
  const [biometricAuth] = useState(new BiometricAuth())
  const [deviceInfo, setDeviceInfo] = useState(null)
  
  // App states
  const [projects, setProjects] = useState([])
  const [showAdmin, setShowAdmin] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    category: 'Management'
  })
  const [loading, setLoading] = useState(false)

  // Initialize authentication and load projects
  useEffect(() => {
    initializeAuth()
  }, [])

  // Load projects after authentication
  useEffect(() => {
    if (isAuthenticated) {
      loadProjects()
    }
  }, [isAuthenticated])

  const initializeAuth = async () => {
    setAuthLoading(true)
    
    try {
      // Get device information
      const info = await biometricAuth.getDeviceInfo()
      setDeviceInfo(info)

      // Check if already authenticated
      const isAlreadyAuth = biometricAuth.isAuthenticated()
      
      if (info.isMobile && !isAlreadyAuth) {
        // Mobile device needs authentication
        setAuthLoading(false)
        return
      }
      
      // Desktop or already authenticated
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Auth initialization error:', error)
      // On error, proceed without authentication for desktop
      if (!deviceInfo?.isMobile) {
        setIsAuthenticated(true)
      }
    }
    
    setAuthLoading(false)
  }

  const handleAuthenticate = async () => {
    setAuthLoading(true)
    setAuthError('')

    try {
      const result = await biometricAuth.authenticate()
      
      if (result.success) {
        setIsAuthenticated(true)
      } else {
        setAuthError(result.error || 'Authentication failed. Please try again.')
      }
    } catch (error) {
      console.error('Authentication error:', error)
      setAuthError('Authentication failed. Please try again.')
    }
    
    setAuthLoading(false)
  }

  const handleSkipAuth = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    biometricAuth.logout()
    setIsAuthenticated(false)
    setAuthError('')
  }

  const loadProjects = async () => {
    setLoading(true)
    const allProjects = await firebaseProjectDB.getAllProjects()
    setProjects(allProjects)
    setLoading(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await firebaseProjectDB.addProject(formData)
      setFormData({
        name: '',
        description: '',
        url: '',
        category: 'Management'
      })
      await loadProjects()
      alert('✅ Project added successfully!')
    } catch (error) {
      alert('❌ Error adding project: ' + error.message)
    }

    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setLoading(true)
      try {
        await firebaseProjectDB.deleteProject(id)
        await loadProjects()
        alert('✅ Project deleted successfully!')
      } catch (error) {
        alert('❌ Error deleting project: ' + error.message)
      }
      setLoading(false)
    }
  }

  return (
    <>
      {/* Show authentication screen if not authenticated or loading */}
      {(!isAuthenticated || authLoading) && (
        <AuthScreen
          onAuthenticate={handleAuthenticate}
          onSkip={handleSkipAuth}
          error={authError}
          loading={authLoading}
          deviceInfo={deviceInfo}
        />
      )}
      
      {/* Main application content */}
      {isAuthenticated && (
        <div className="app">
          <header className="header">
            <div className="logo-container">
              <img src="/logo.png" alt="Taha Association Center Logo" className="logo" />
              <div>
                <h1>Taha Association Center</h1>
                <p className="subtitle">Management Interface Dashboard</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button 
                className="admin-toggle"
                onClick={() => setShowAdmin(!showAdmin)}
              >
                {showAdmin ? '👁️ View Projects' : '➕ Add Project'}
              </button>
              {deviceInfo?.isMobile && (
                <button 
                  className="admin-toggle"
                  onClick={handleLogout}
                  style={{ background: 'rgba(239, 68, 68, 0.8)' }}
                >
                  🔒 Logout
                </button>
              )}
            </div>
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
                      <option value="Business">Business</option>
                      <option value="Education">Education</option>
                      <option value="Forms">Forms</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? '⏳ Adding...' : '✓ Add Project'}
                  </button>
                </form>

                {projects.length > 0 && (
                  <div className="manage-projects">
                    <h3>Your Projects ({projects.length})</h3>
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
                            disabled={loading}
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : loading ? (
              <div className="loading-screen">
                <div className="loading-spinner"></div>
                <h2>Loading your projects...</h2>
                <p>Please wait while we fetch your data</p>
              </div>
            ) : (
              <div className="dashboard-section">
                {projects.length === 0 ? (
                  <div className="no-results">
                    <h2>No projects yet</h2>
                    <p>Click "➕ Add Project" to get started!</p>
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
                        <div className="project-header">
                          <div className="project-category-badge">
                            {project.category}
                          </div>
                        </div>
                        <h3 className="project-name">{project.name}</h3>
                        <p className="project-description">{project.description}</p>
                        <span className="view-link">View Project →</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>

          <footer className="footer">
            <p>© 2025 Taha Association Center. All rights reserved.</p>
          </footer>
        </div>
      )}
    </>
  )
}

export default App