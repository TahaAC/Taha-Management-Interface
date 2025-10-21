# How to Save Your URLs to Database Permanently

## 🚨 Current Situation
Your new URLs are saved in **browser cache (localStorage)** but not in the permanent database file. This means:
- ✅ URLs show up on your website
- ❌ URLs are lost if you clear browser data
- ❌ URLs won't sync to Vercel automatically

## 💾 Solution: Export & Replace Database

### Step 1: Export Your Current Data
1. Go to your website admin panel (⚙️ Add New URL button)
2. Click **"💾 Export Database File"** button
3. A file named `taha-projects-database-YYYY-MM-DD.json` will download

### Step 2: Replace the Database File
1. Open your project folder: `src/database/`
2. **Backup** the current `projects.json` file (rename it to `projects-backup.json`)
3. **Replace** `projects.json` with your downloaded file
4. **Rename** the downloaded file to exactly `projects.json`

### Step 3: Commit & Push to GitHub
```bash
git add .
git commit -m "Update database with new URLs"
git push
```

### Step 4: Verify on Vercel
- Vercel will automatically deploy the updated database
- Your URLs are now permanently saved!

## 🎯 Alternative: Manual Update

If you prefer to manually edit the database:

1. Click **"📊 View Data Summary"** to see all your projects
2. Copy the project details
3. Open `src/database/projects.json`
4. Add your new projects to the `projects` array
5. Update the `metadata.totalProjects` count
6. Save, commit, and push

## 🔄 Future URLs

Once you complete this process:
- New URLs will automatically be saved to localStorage
- Use the export feature whenever you want to make them permanent
- Or set up automatic sync (advanced feature)

## ⚠️ Important Notes

- **Always backup** before replacing files
- The export file contains all your current URLs
- Make sure file is named exactly `projects.json`
- Don't forget to commit and push to GitHub

## 🆘 Need Help?

If you get stuck:
1. Use "📊 View Data Summary" to see what needs to be saved
2. The export feature creates a properly formatted database file
3. Just replace the old `projects.json` with the exported one