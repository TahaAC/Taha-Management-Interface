import projectDB from './ProjectDatabase';

class DataManager {
  // Export all data as JSON file
  static exportData() {
    try {
      const data = projectDB.exportData();
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `taha-projects-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      return { success: true, message: 'Data exported successfully' };
    } catch (error) {
      console.error('Export error:', error);
      return { success: false, error: error.message };
    }
  }

  // Import data from JSON file
  static importData(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          const result = projectDB.importData(data);
          resolve(result);
        } catch (error) {
          resolve({ success: false, error: 'Invalid JSON file' });
        }
      };
      
      reader.onerror = () => {
        resolve({ success: false, error: 'Failed to read file' });
      };
      
      reader.readAsText(file);
    });
  }

  // Clear all data (with confirmation)
  static clearAllData() {
    if (confirm('⚠️ This will delete ALL projects. Are you sure?')) {
      if (confirm('This action cannot be undone. Continue?')) {
        localStorage.removeItem('tahaProjectsDB');
        return { success: true, message: 'All data cleared' };
      }
    }
    return { success: false, message: 'Operation cancelled' };
  }

  // Get database statistics
  static getStats() {
    return projectDB.getStats();
  }

  // Reset to default data
  static resetToDefault() {
    if (confirm('Reset to default projects? Current data will be lost.')) {
      localStorage.removeItem('tahaProjectsDB');
      projectDB.initializeDatabase();
      return { success: true, message: 'Reset to default data' };
    }
    return { success: false, message: 'Operation cancelled' };
  }
}

export default DataManager;