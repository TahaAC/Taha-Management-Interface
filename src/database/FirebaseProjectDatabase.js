import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy
} from "firebase/firestore";
import { db } from '../config/firebase';

class FirebaseProjectDatabase {
  constructor() {
    this.collectionName = 'tahaProjects';
    this.projectsRef = collection(db, this.collectionName);
  }

  // Get all projects
  async getAllProjects() {
    try {
      const querySnapshot = await getDocs(this.projectsRef);
      const projects = [];
      
      querySnapshot.forEach((doc) => {
        projects.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Sort by dateAdded (newest first)
      return projects.sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0));
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Fallback to localStorage if Firebase fails
      return this.getLocalStorageData();
    }
  }

  // Add new project
  async addProject(projectData) {
    try {
      const newProject = {
        ...projectData,
        dateAdded: new Date().toISOString(),
        isActive: true
      };
      
      const docRef = await addDoc(this.projectsRef, newProject);
      
      return { 
        success: true, 
        project: { id: docRef.id, ...newProject }
      };
    } catch (error) {
      console.error('Error adding project:', error);
      // Fallback to localStorage
      return this.addToLocalStorage(projectData);
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

  // Get categories
  async getCategories() {
    try {
      const projects = await this.getAllProjects();
      const categories = [...new Set(projects.map(project => project.category || 'Management'))];
      return categories.sort();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return ['Management', 'Forms', 'Education'];
    }
  }

  // Fallback methods for localStorage
  getLocalStorageData() {
    try {
      const data = localStorage.getItem('tahaProjectsDB');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return [];
    }
  }

  addToLocalStorage(projectData) {
    try {
      const projects = this.getLocalStorageData();
      const newProject = {
        id: Date.now().toString(),
        ...projectData,
        dateAdded: new Date().toISOString(),
        isActive: true
      };
      
      projects.push(newProject);
      localStorage.setItem('tahaProjectsDB', JSON.stringify(projects));
      
      return { success: true, project: newProject };
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create singleton instance
const firebaseProjectDB = new FirebaseProjectDatabase();

export default firebaseProjectDB;