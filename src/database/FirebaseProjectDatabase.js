import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  onSnapshot 
} from "firebase/firestore";
import { db } from '../config/firebase';

class FirebaseProjectDatabase {
  constructor() {
    this.collectionName = 'projects';
    this.projectsRef = collection(db, this.collectionName);
  }

  // Get all projects
  async getAllProjects() {
    try {
      const q = query(this.projectsRef, orderBy('dateAdded', 'desc'));
      const querySnapshot = await getDocs(q);
      const projects = [];
      
      querySnapshot.forEach((doc) => {
        projects.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return projects;
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }

  // Add new project
  async addProject(projectData) {
    try {
      const newProject = {
        ...projectData,
        dateAdded: new Date().toISOString(),
        isActive: true,
        createdAt: new Date()
      };
      
      const docRef = await addDoc(this.projectsRef, newProject);
      
      return { 
        success: true, 
        project: { id: docRef.id, ...newProject }
      };
    } catch (error) {
      console.error('Error adding project:', error);
      return { success: false, error: error.message };
    }
  }

  // Update existing project
  async updateProject(id, updatedData) {
    try {
      const projectRef = doc(db, this.collectionName, id);
      await updateDoc(projectRef, {
        ...updatedData,
        updatedAt: new Date()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating project:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete project
  async deleteProject(id) {
    try {
      const projectRef = doc(db, this.collectionName, id);
      await deleteDoc(projectRef);
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting project:', error);
      return { success: false, error: error.message };
    }
  }

  // Search projects
  async searchProjects(searchTerm) {
    try {
      const projects = await this.getAllProjects();
      const term = searchTerm.toLowerCase();
      
      return projects.filter(project => 
        project.name.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        (project.category && project.category.toLowerCase().includes(term)) ||
        project.url.toLowerCase().includes(term)
      );
    } catch (error) {
      console.error('Error searching projects:', error);
      return [];
    }
  }

  // Get projects by category
  async getProjectsByCategory(category) {
    try {
      const q = query(
        this.projectsRef, 
        where('category', '==', category),
        orderBy('dateAdded', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const projects = [];
      
      querySnapshot.forEach((doc) => {
        projects.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return projects;
    } catch (error) {
      console.error('Error fetching projects by category:', error);
      return [];
    }
  }

  // Get all categories
  async getCategories() {
    try {
      const projects = await this.getAllProjects();
      const categories = [...new Set(projects.map(project => project.category || 'Uncategorized'))];
      return categories.sort();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  // Listen to real-time updates
  onProjectsChange(callback) {
    const q = query(this.projectsRef, orderBy('dateAdded', 'desc'));
    
    return onSnapshot(q, (querySnapshot) => {
      const projects = [];
      querySnapshot.forEach((doc) => {
        projects.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(projects);
    }, (error) => {
      console.error('Error listening to projects:', error);
      callback([]);
    });
  }

  // Migrate localStorage data to Firebase
  async migrateFromLocalStorage() {
    try {
      const localData = localStorage.getItem('tahaProjectsDB');
      if (!localData) return { success: false, message: 'No local data found' };
      
      const projects = JSON.parse(localData);
      const migrationResults = [];
      
      for (const project of projects) {
        // Remove the old id to let Firebase generate a new one
        const { id, ...projectData } = project;
        const result = await this.addProject(projectData);
        migrationResults.push(result);
      }
      
      const successful = migrationResults.filter(r => r.success).length;
      const failed = migrationResults.filter(r => !r.success).length;
      
      return { 
        success: true, 
        message: `Migrated ${successful} projects successfully. ${failed} failed.`,
        successful,
        failed 
      };
    } catch (error) {
      console.error('Error migrating data:', error);
      return { success: false, error: error.message };
    }
  }

  // Get database statistics
  async getStats() {
    try {
      const projects = await this.getAllProjects();
      const categories = await this.getCategories();
      
      return {
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.isActive !== false).length,
        totalCategories: categories.length,
        categories: categories,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        totalProjects: 0,
        activeProjects: 0,
        totalCategories: 0,
        categories: [],
        lastUpdated: new Date().toISOString()
      };
    }
  }

  // Export Firebase data
  async exportData() {
    try {
      const projects = await this.getAllProjects();
      return {
        projects,
        metadata: {
          version: "1.0.0",
          exportDate: new Date().toISOString(),
          totalProjects: projects.length,
          source: "firebase"
        }
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      return {
        projects: [],
        metadata: {
          version: "1.0.0",
          exportDate: new Date().toISOString(),
          totalProjects: 0,
          source: "firebase",
          error: error.message
        }
      };
    }
  }
}

// Create singleton instance
const firebaseProjectDB = new FirebaseProjectDatabase();

export default firebaseProjectDB;