import projectsData from './projects.json';

class ProjectDatabase {
  constructor() {
    this.storageKey = 'tahaProjectsDB';
    this.initializeDatabase();
  }

  // Initialize database with default data if not exists
  initializeDatabase() {
    const existingData = this.getAllProjects();
    if (!existingData || existingData.length === 0) {
      this.saveToLocalStorage(projectsData.projects);
    }
  }

  // Get all projects
  getAllProjects() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : projectsData.projects;
    } catch (error) {
      console.error('Error loading projects:', error);
      return projectsData.projects;
    }
  }

  // Get project by ID
  getProjectById(id) {
    const projects = this.getAllProjects();
    return projects.find(project => project.id === id);
  }

  // Add new project
  addProject(projectData) {
    try {
      const projects = this.getAllProjects();
      const newProject = {
        id: this.generateId(),
        ...projectData,
        dateAdded: new Date().toISOString(),
        isActive: true
      };
      
      projects.push(newProject);
      this.saveToLocalStorage(projects);
      return { success: true, project: newProject };
    } catch (error) {
      console.error('Error adding project:', error);
      return { success: false, error: error.message };
    }
  }

  // Update existing project
  updateProject(id, updatedData) {
    try {
      const projects = this.getAllProjects();
      const index = projects.findIndex(project => project.id === id);
      
      if (index === -1) {
        return { success: false, error: 'Project not found' };
      }

      projects[index] = {
        ...projects[index],
        ...updatedData,
        id: id // Ensure ID doesn't change
      };

      this.saveToLocalStorage(projects);
      return { success: true, project: projects[index] };
    } catch (error) {
      console.error('Error updating project:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete project
  deleteProject(id) {
    try {
      const projects = this.getAllProjects();
      const filteredProjects = projects.filter(project => project.id !== id);
      
      if (projects.length === filteredProjects.length) {
        return { success: false, error: 'Project not found' };
      }

      this.saveToLocalStorage(filteredProjects);
      return { success: true };
    } catch (error) {
      console.error('Error deleting project:', error);
      return { success: false, error: error.message };
    }
  }

  // Search projects
  searchProjects(searchTerm) {
    const projects = this.getAllProjects();
    const term = searchTerm.toLowerCase();
    
    return projects.filter(project => 
      project.name.toLowerCase().includes(term) ||
      project.description.toLowerCase().includes(term) ||
      project.category.toLowerCase().includes(term) ||
      project.url.toLowerCase().includes(term)
    );
  }

  // Get projects by category
  getProjectsByCategory(category) {
    const projects = this.getAllProjects();
    return projects.filter(project => 
      project.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Get all categories
  getCategories() {
    const projects = this.getAllProjects();
    const categories = [...new Set(projects.map(project => project.category))];
    return categories.sort();
  }

  // Export data (for backup)
  exportData() {
    const projects = this.getAllProjects();
    return {
      projects,
      metadata: {
        version: "1.0.0",
        exportDate: new Date().toISOString(),
        totalProjects: projects.length
      }
    };
  }

  // Import data (from backup)
  importData(data) {
    try {
      if (!data.projects || !Array.isArray(data.projects)) {
        return { success: false, error: 'Invalid data format' };
      }

      this.saveToLocalStorage(data.projects);
      return { success: true, imported: data.projects.length };
    } catch (error) {
      console.error('Error importing data:', error);
      return { success: false, error: error.message };
    }
  }

  // Helper methods
  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  saveToLocalStorage(projects) {
    localStorage.setItem(this.storageKey, JSON.stringify(projects));
  }

  // Get database statistics
  getStats() {
    const projects = this.getAllProjects();
    const categories = this.getCategories();
    
    return {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.isActive).length,
      totalCategories: categories.length,
      categories: categories,
      lastUpdated: new Date().toISOString()
    };
  }
}

// Create singleton instance
const projectDB = new ProjectDatabase();

export default projectDB;