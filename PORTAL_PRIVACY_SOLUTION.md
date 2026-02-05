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

## What Has Been Implemented

To improve privacy within the constraints of GitHub Pages, the following measures have been added:

1. **Search Engine Blocking Meta Tags:**
   - Added `noindex, nofollow` meta tags to prevent search engines from indexing the portal
   - Includes specific directives for Google and Bing crawlers
   - This prevents the portal from appearing in search results

2. **Access Notice Banner:**
   - Added a prominent warning banner indicating "AUTHORIZED ACCESS ONLY"
   - Makes it clear the portal contains confidential information
   - Serves as a visual deterrent for unauthorized access

3. **Existing Authentication:**
   - Client-side authentication with User ID verification
   - Session-based access control
   - Automatic redirect if accessed without proper authentication

### What This Provides:
- ✅ Portal won't appear in search engine results
- ✅ Clear warning for anyone who accesses the page
- ✅ Basic access control for regular users
- ⚠️ **NOT secure against determined actors** - Anyone with the direct URL can still bypass client-side checks

### For True Privacy:
Follow the "Recommended Solution" above to move the portal to a separate private repository or password-protected hosting platform.
