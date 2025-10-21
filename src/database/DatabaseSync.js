import projectDB from './ProjectDatabase';

// Utility to sync localStorage data to database file
class DatabaseSync {
  
  // Get current data from localStorage
  static getCurrentData() {
    try {
      const data = localStorage.getItem('tahaProjectsDB');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return [];
    }
  }

  // Save current localStorage data to downloadable JSON file
  static exportCurrentData() {
    try {
      const currentProjects = this.getCurrentData();
      
      const exportData = {
        projects: currentProjects,
        metadata: {
          version: "1.0.0",
          exportDate: new Date().toISOString(),
          totalProjects: currentProjects.length,
          source: "localStorage_backup"
        }
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `taha-projects-database-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return { 
        success: true, 
        message: `Exported ${currentProjects.length} projects to database file`,
        projects: currentProjects
      };
    } catch (error) {
      console.error('Export error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update the projects.json file content (for manual replacement)
  static generateDatabaseFileContent() {
    const currentProjects = this.getCurrentData();
    
    const databaseContent = {
      projects: currentProjects,
      metadata: {
        version: "1.0.0",
        lastUpdated: new Date().toISOString(),
        totalProjects: currentProjects.length
      }
    };

    return JSON.stringify(databaseContent, null, 2);
  }

  // Get a summary of what needs to be saved
  static getDataSummary() {
    const projects = this.getCurrentData();
    const stats = {
      totalProjects: projects.length,
      categories: [...new Set(projects.map(p => p.category || 'Uncategorized'))],
      recentlyAdded: projects.filter(p => {
        const addedDate = new Date(p.dateAdded || 0);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return addedDate > weekAgo;
      }),
      projects: projects.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category || 'Uncategorized',
        dateAdded: p.dateAdded || 'Unknown'
      }))
    };

    return stats;
  }
}

export default DatabaseSync;