# How to Add More URLs

Adding new project links is super easy! Just follow these steps:

## Step 1: Open the Configuration File

Navigate to: `src/config/projects.js`

## Step 2: Add Your New Project

Add a new object to the `projects` array:

```javascript
{
  name: 'Your Project Name',
  description: 'Brief description of your project',
  url: 'https://your-project-url.vercel.app/',
  icon: '🎯'  // Choose any emoji icon
}
```

## Example:

```javascript
export const projects = [
  {
    name: 'Bookings',
    description: 'Booking management system',
    url: 'https://bookings-rust-rho.vercel.app/',
    icon: '📅'
  },
  // Add your new project here:
  {
    name: 'Invoice System',
    description: 'Invoice and billing management',
    url: 'https://invoice-system.vercel.app/',
    icon: '💰'
  }
]
```

## Step 3: Save and Refresh

- Save the file
- The changes will automatically appear in your browser
- No need to restart the server!

## Popular Emoji Icons:

- 📅 Calendar/Bookings
- 📝 Forms/Documents
- 👥 Users/Membership
- 🏫 Education/School
- 💰 Finance/Money
- 📊 Analytics/Reports
- 🛒 Shopping/Ecommerce
- 🏥 Healthcare
- 🚗 Transportation
- 🏠 Real Estate
- 📧 Email/Messages
- 🔔 Notifications
- ⚙️ Settings
- 📦 Inventory
- 🎯 Tasks/Goals

## That's It!

Your new project will automatically appear on the dashboard with the same beautiful iOS liquid glass design! 🎨✨
