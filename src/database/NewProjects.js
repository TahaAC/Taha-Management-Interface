/**
 * Additional Projects to be added to the database
 * These are the new URLs provided by the user
 */

import firebaseProjectDB from './FirebaseProjectDatabase.js'

const newProjects = [
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
    category: 'Management'
  },
  {
    name: 'Membership',
    description: 'Membership management system',
    url: 'https://membership-plum.vercel.app/',
    category: 'Management'
  },
  {
    name: 'Smart Squad Pty Ltd',
    description: 'Smart Squad business management platform',
    url: 'https://smart-squad-m-build.vercel.app/',
    category: 'Business'
  },
  {
    name: 'Ibuilt Plastering Pty Ltd',
    description: 'Raza - Invoice and business management system',
    url: 'https://ibuilt-invoice.vercel.app/',
    category: 'Business'
  }
]

/**
 * Add the new projects to the database
 */
export const addNewProjects = async () => {
  console.log('🚀 Adding new projects to database...')
  
  try {
    const addedProjects = []
    
    for (const project of newProjects) {
      console.log(`📝 Adding: ${project.name}`)
      
      // Check if project already exists
      const existingProjects = await firebaseProjectDB.getAllProjects()
      const exists = existingProjects.some(existing => 
        existing.name === project.name || existing.url === project.url
      )
      
      if (!exists) {
        const newProject = await firebaseProjectDB.addProject(project)
        addedProjects.push(newProject)
        console.log(`✅ Added: ${project.name}`)
      } else {
        console.log(`⚠️ Skipped: ${project.name} (already exists)`)
      }
    }
    
    console.log(`🎉 Successfully added ${addedProjects.length} new projects!`)
    return addedProjects
    
  } catch (error) {
    console.error('❌ Error adding new projects:', error)
    throw error
  }
}

export { newProjects }
export default addNewProjects