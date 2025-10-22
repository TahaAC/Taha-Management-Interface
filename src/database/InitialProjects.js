// Script to add initial projects to Firebase/localStorage
import firebaseProjectDB from './FirebaseProjectDatabase';

const initialProjects = [
  {
    name: 'Bookings',
    description: 'Booking management system',
    url: 'https://bookings-rust-rho.vercel.app/',
    category: 'Management'
  },
  {
    name: 'Funeral Form',
    description: 'Funeral service form management',
    url: 'https://funeral-form.vercel.app/',
    category: 'Forms'
  },
  {
    name: 'Membership',
    description: 'Membership management system',
    url: 'https://membership-plum.vercel.app/',
    category: 'Management'
  },
  {
    name: 'Taha School System',
    description: 'School management system',
    url: 'https://taha-school-system.vercel.app/',
    category: 'Education'
  },
  {
    name: 'Smart Squad Pty Ltd',
    description: 'Business management platform',
    url: 'https://smart-squad-m-build.vercel.app/',
    category: 'Business'
  },
  {
    name: 'Ibuilt Plastering Pty Ltd',
    description: 'Invoice management system for Raza',
    url: 'https://ibuilt-invoice.vercel.app/',
    category: 'Finance'
  }
];

// Function to add all projects
export const addInitialProjects = async () => {
  console.log('🚀 Adding initial projects...');
  
  for (const project of initialProjects) {
    try {
      const result = await firebaseProjectDB.addProject(project);
      if (result.success) {
        console.log(`✅ Added: ${project.name}`);
      } else {
        console.log(`❌ Failed to add ${project.name}: ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ Error adding ${project.name}: ${error.message}`);
    }
  }
  
  console.log('🎉 Finished adding projects!');
};

export default initialProjects;