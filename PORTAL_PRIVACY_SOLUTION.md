# Making the People Partner Portal Private

## Current Situation
This repository hosts two applications:
- **Leadership Launchpad** (index.html) - Public facing
- **People Partner Portal** (people-partners-portal.html) - Needs to be private

## The Challenge
GitHub Pages serves all files from public repositories as publicly accessible web content. Even with client-side authentication, the HTML files remain accessible to anyone who knows the URL.

## Recommended Solution: Separate Repository

To achieve true privacy, the People Partner Portal should be moved to a separate private repository:

### Steps to Implement:

1. **Create a new private repository** (e.g., `Leadership-Launchpad-Portal`)
   - Go to GitHub and create a new private repository
   - Initialize it without README

2. **Move portal files to the new repository:**
   ```bash
   # Files to move:
   - people-partners-portal.html
   - surveyData.json
   - Any portal-specific assets
   ```

3. **Update the Leadership Launchpad** (this public repo):
   - Remove people-partners-portal.html
   - Update the "People Partner Portal" button to link to the private site
   - Or keep the authentication modal but redirect to the private repo after verification

4. **Set up GitHub Pages for the private repository:**
   - Go to Settings > Pages in the private repo
   - Enable GitHub Pages (requires GitHub Pro, Team, or Enterprise)
   - The site will only be accessible to people with repository access

5. **Alternative: Use Netlify or Vercel with password protection:**
   - Both platforms offer free password-protected sites
   - Deploy the portal there instead of GitHub Pages

### What This Achieves:
- ✅ Leadership Launchpad remains fully public
- ✅ People Partner Portal is truly private (requires GitHub authentication)
- ✅ Clean separation of concerns
- ✅ Proper access control

### Current State:
The authentication in this repository provides user experience flow but not true security. Anyone can:
- View the source code
- Access people-partners-portal.html directly
- See the valid User IDs in the JavaScript

This is acceptable for internal tools where the URL is not shared publicly, but not for truly sensitive data.
