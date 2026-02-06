# Survey Data Setup Guide

This guide explains how to set up survey data integration for the Leadership Launchpad portal using a simplified JSON URL approach. **No Microsoft API credentials or Azure AD setup required!**

## Table of Contents
- [Quick Start (5 minutes)](#quick-start-5-minutes)
- [Overview](#overview)
- [JSON Structure Requirements](#json-structure-requirements)
- [Method 1: GitHub Gist (Recommended)](#method-1-github-gist-recommended)
- [Method 2: Export to Excel + GitHub Repository](#method-2-export-to-excel--github-repository)
- [Method 3: Power Automate Integration](#method-3-power-automate-integration)
- [Method 4: Manual JSON Files](#method-4-manual-json-files)
- [Setting Up GitHub Secrets](#setting-up-github-secrets)
- [Testing the Setup](#testing-the-setup)
- [Troubleshooting](#troubleshooting)

---

## Quick Start (5 minutes)

**The fastest way to get started:**

1. **Create two GitHub Gists** (one for each survey):
   - Go to https://gist.github.com/
   - Click "New gist"
   - Name it `surveyData1.json`
   - Paste the [JSON structure](#json-structure-requirements) with your data
   - Create as Public gist
   - Click "Create public gist"
   - Repeat for `surveyData2.json`

2. **Get the raw URLs**:
   - On each gist page, click the "Raw" button
   - Copy the URL (should look like: `https://gist.githubusercontent.com/username/abc123.../raw/xyz.../surveyData1.json`)

3. **Add URLs to GitHub Secrets**:
   - Go to your repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `SURVEY1_URL`, Value: [paste raw URL from step 2]
   - Click "Add secret"
   - Repeat for `SURVEY2_URL`

4. **Test it**:
   - Go to Actions tab → "Update Survey Data" workflow
   - Click "Run workflow" → "Run workflow"
   - Wait ~30 seconds and verify surveyData.json is updated

**Done!** Your surveys will now update automatically every 6 hours.

---

## Overview

This setup allows you to:
- Fetch survey data from two separate JSON sources
- Automatically combine the numeric values
- Update your portal without manual intervention
- No complex Microsoft API setup required

### How It Works

1. You maintain two JSON files in accessible locations (GitHub Gist, GitHub repo, OneDrive, etc.)
2. The GitHub Actions workflow runs every 6 hours (or on-demand)
3. The script fetches both JSON files, validates them, and combines the numeric values
4. The combined result is written to `surveyData.json` in your repository
5. Your portal displays the updated data

---

## JSON Structure Requirements

Each survey JSON file must follow this exact structure:

```json
{
  "trainingAttended": {
    "newLeaders": 0,
    "leadingIndividualContributors": 0,
    "leadingLeaders": 0
  },
  "effectiveness": {
    "veryEffective": 0,
    "somewhatEffective": 0,
    "neutral": 0,
    "somewhatIneffective": 0,
    "neitherEffectiveNorIneffective": 0
  },
  "trainingNeeds": {
    "communication": 0,
    "decisionMaking": 0,
    "teamBuilding": 0,
    "conflictResolution": 0,
    "strategicThinking": 0,
    "other": 0
  }
}
```

### Field Descriptions

**trainingAttended**: Count of attendees by leadership level
- `newLeaders`: New to leadership roles
- `leadingIndividualContributors`: Leading teams without managers
- `leadingLeaders`: Leading other leaders

**effectiveness**: Ratings of training effectiveness
- `veryEffective`: Highly satisfied
- `somewhatEffective`: Moderately satisfied
- `neutral`: No strong opinion
- `somewhatIneffective`: Somewhat dissatisfied
- `neitherEffectiveNorIneffective`: Alternative neutral response

**trainingNeeds**: Count of requests by topic
- `communication`: Communication skills
- `decisionMaking`: Decision-making skills
- `teamBuilding`: Team building
- `conflictResolution`: Conflict resolution
- `strategicThinking`: Strategic thinking
- `other`: Other topics

---

## Method 1: GitHub Gist (Recommended)

**Best for**: Quick setup, easy updates, free hosting

### Step-by-Step

1. **Create your first Gist**:
   - Visit https://gist.github.com/
   - Sign in with your GitHub account
   - Create new gist

2. **Set up the Gist**:
   - Filename: `surveyData1.json`
   - Content: Copy the [JSON structure](#json-structure-requirements) and update with your data
   - Description (optional): "Leadership Survey 1 Data"
   - Select "Create public gist" (required for direct access)

3. **Get the raw URL**:
   - After creating, click the "Raw" button in the top-right
   - Copy the full URL from your browser
   - Example: `https://gist.githubusercontent.com/username/abc123def456/raw/xyz789/surveyData1.json`

4. **Repeat for second survey**:
   - Create another gist named `surveyData2.json`
   - Get its raw URL

5. **Update your Gists anytime**:
   - Go to https://gist.github.com/ and find your gist
   - Click "Edit"
   - Update the numbers
   - Click "Update gist"
   - The URL stays the same!

### Mapping Microsoft Forms to JSON

If you're collecting data from Microsoft Forms:

**Question 1**: "Which leadership training did you attend?"
- Map responses to `trainingAttended` fields

**Question 2**: "How effective was the training?"
- Map responses to `effectiveness` fields

**Question 3**: "Which topics would you like more training on?"
- Map responses to `trainingNeeds` fields

**Converting Form Responses**:
1. Export your Microsoft Forms responses to Excel
2. Count responses for each option
3. Update the numbers in your JSON file
4. Save/update your Gist

---

## Method 2: Export to Excel + GitHub Repository

**Best for**: Version control, team collaboration

### Step 1: Export Microsoft Forms to Excel

1. Open your Microsoft Form
2. Go to the "Responses" tab
3. Click "Open in Excel"
4. The file will download with all responses

### Step 2: Convert Excel to JSON

**Option A: Manual Conversion**

1. Count the responses for each category:
   ```
   Training Attended:
   - New Leaders: [count responses]
   - Leading Individual Contributors: [count responses]
   - Leading Leaders: [count responses]
   ```

2. Create your JSON file with these counts

**Option B: Using Excel Formula**

1. In Excel, use `COUNTIF` to count responses:
   ```excel
   =COUNTIF(B:B,"New Leaders")
   ```

2. Create a summary sheet with all counts

3. Manually transfer to JSON format

**Example Excel Structure**:

| Question | Response | Count |
|----------|----------|-------|
| Training Attended | New Leaders | 5 |
| Training Attended | Leading Individual Contributors | 3 |
| Effectiveness | Very Effective | 7 |

### Step 3: Host on GitHub

**Option A: Create a Separate Repository**

1. Create a new GitHub repository (e.g., `leadership-survey-data`)
2. Add your JSON files:
   ```
   surveyData1.json
   surveyData2.json
   ```
3. Commit and push
4. Get raw URLs:
   - Navigate to each file on GitHub
   - Click "Raw" button
   - Copy URL (e.g., `https://raw.githubusercontent.com/username/leadership-survey-data/main/surveyData1.json`)

**Option B: Use This Repository**

1. Create a `survey-sources` folder in this repo:
   ```bash
   mkdir survey-sources
   ```
2. Add your files:
   ```
   survey-sources/surveyData1.json
   survey-sources/surveyData2.json
   ```
3. Get raw URLs from GitHub

**Important**: When using the same repository, the workflow will need read access to these files. Use relative URLs or ensure the files are committed before the workflow runs.

---

## Method 3: Power Automate Integration

**Best for**: Automated updates directly from Microsoft Forms

### Overview

Set up a Power Automate flow that:
1. Triggers when a new form response is submitted
2. Aggregates all responses
3. Updates a JSON file in a public location

### Step-by-Step

1. **Create a new Flow in Power Automate**:
   - Go to https://flow.microsoft.com/
   - Create new automated flow
   - Trigger: "When a new response is submitted" (Microsoft Forms)

2. **Add action to get responses**:
   - Action: "Get response details"
   - Select your form
   - Response Id: From the trigger

3. **Add action to format data**:
   - Action: "Compose"
   - Create JSON structure with aggregated data
   - Use expressions to count responses

4. **Save to accessible location**:

   **Option A: OneDrive with Public Link**
   - Action: "Create file" (OneDrive)
   - File name: `surveyData1.json`
   - File content: Output from Compose step
   - Create a public sharing link
   - Use the direct download URL

   **Option B: SharePoint with Public Link**
   - Similar to OneDrive
   - Ensure public access is enabled

   **Option C: HTTP endpoint**
   - Use "HTTP" action to POST to a webhook
   - Host a simple service that serves the JSON

5. **Schedule the flow**:
   - Add a recurrence trigger
   - Run every hour or daily

### Power Automate Expression Examples

To count responses in Power Automate:

```
length(body('Filter_array'))
```

To create JSON:
```json
{
  "trainingAttended": {
    "newLeaders": @{variables('newLeadersCount')},
    "leadingIndividualContributors": @{variables('licCount')},
    "leadingLeaders": @{variables('leadingLeadersCount')}
  }
}
```

---

## Method 4: Manual JSON Files

**Best for**: Small-scale testing, demonstrations, or when you don't need automated updates

### Setup

1. **Create JSON files in your repository**:
   ```bash
   mkdir survey-sources
   ```

2. **Create `survey-sources/surveyData1.json`**:
   ```json
   {
     "trainingAttended": {
       "newLeaders": 5,
       "leadingIndividualContributors": 3,
       "leadingLeaders": 2
     },
     "effectiveness": {
       "veryEffective": 7,
       "somewhatEffective": 2,
       "neutral": 1,
       "somewhatIneffective": 0,
       "neitherEffectiveNorIneffective": 0
     },
     "trainingNeeds": {
       "communication": 4,
       "decisionMaking": 3,
       "teamBuilding": 3,
       "conflictResolution": 2,
       "strategicThinking": 2,
       "other": 1
     }
   }
   ```

3. **Create `survey-sources/surveyData2.json`** with similar structure

4. **Update the workflow** to use local files OR set GitHub secrets to raw URLs

5. **Update manually**:
   - Edit the files directly in GitHub or locally
   - Commit changes
   - The workflow will process them

---

## Setting Up GitHub Secrets

After choosing your method and getting your JSON URLs:

1. **Navigate to Repository Settings**:
   - Go to your repository on GitHub
   - Click "Settings" tab
   - Click "Secrets and variables" → "Actions"

2. **Add SURVEY1_URL**:
   - Click "New repository secret"
   - Name: `SURVEY1_URL`
   - Secret: [paste your first survey JSON URL]
   - Click "Add secret"

3. **Add SURVEY2_URL**:
   - Click "New repository secret"
   - Name: `SURVEY2_URL`
   - Secret: [paste your second survey JSON URL]
   - Click "Add secret"

### URL Examples

**GitHub Gist**:
```
https://gist.githubusercontent.com/username/abc123/raw/xyz/surveyData1.json
```

**GitHub Repository**:
```
https://raw.githubusercontent.com/username/repo-name/main/surveyData1.json
```

**OneDrive** (get download link):
```
https://onedrive.live.com/download?cid=ABC&resid=XYZ&authkey=123
```

---

## Testing the Setup

### Local Testing

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set environment variables**:
   ```bash
   export SURVEY1_URL="your_url_here"
   export SURVEY2_URL="your_url_here"
   ```

   Windows (Command Prompt):
   ```cmd
   set SURVEY1_URL=your_url_here
   set SURVEY2_URL=your_url_here
   ```

   Windows (PowerShell):
   ```powershell
   $env:SURVEY1_URL="your_url_here"
   $env:SURVEY2_URL="your_url_here"
   ```

3. **Run the script**:
   ```bash
   npm run fetch-survey
   ```

4. **Check the output**:
   - Look for success messages
   - Verify `surveyData.json` was updated
   - Check that numbers match your expectations

### GitHub Actions Testing

1. **Go to Actions tab** in your repository

2. **Find "Update Survey Data" workflow**

3. **Click "Run workflow"**:
   - Branch: main (or your default branch)
   - Click "Run workflow" button

4. **Monitor the execution**:
   - Click on the running workflow
   - Watch each step complete
   - Check for any errors

5. **Verify the results**:
   - Check if `surveyData.json` was updated
   - Look at the commit history
   - Review the combined data

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: "SURVEY1_URL is not set"

**Cause**: Environment variable not configured

**Solution**:
- For local testing: Set environment variables (see [Testing](#local-testing))
- For GitHub Actions: Add secrets in repository settings (see [Setting Up GitHub Secrets](#setting-up-github-secrets))

#### Issue: "Network error - unable to reach URL"

**Causes**:
- URL is incorrect
- URL requires authentication
- Network connectivity issue

**Solutions**:
1. Verify the URL in your browser
2. Ensure the URL points to "raw" content (not HTML page)
3. Check that the content is publicly accessible
4. For GitHub: Use `raw.githubusercontent.com` URLs, not `github.com`
5. For Gist: Click "Raw" button to get the correct URL

#### Issue: "Invalid JSON format"

**Causes**:
- URL returns HTML instead of JSON
- JSON syntax errors (missing comma, quote, bracket)

**Solutions**:
1. Visit the URL in your browser and verify it returns JSON
2. Validate JSON at https://jsonlint.com/
3. Check for common syntax errors:
   - Missing commas between fields
   - Trailing commas (not allowed in JSON)
   - Unquoted keys
   - Single quotes instead of double quotes

#### Issue: "Missing or invalid category"

**Cause**: JSON structure doesn't match expected format

**Solution**:
1. Compare your JSON to the [required structure](#json-structure-requirements)
2. Ensure all categories exist: `trainingAttended`, `effectiveness`, `trainingNeeds`
3. Ensure all fields within each category exist
4. Ensure all values are numbers (not strings like "5")

#### Issue: "HTTP 404: Not Found"

**Causes**:
- URL is incorrect
- File was deleted
- File is private

**Solutions**:
1. Verify the URL in your browser
2. Check that the file exists
3. For GitHub Gist: Ensure it's a public gist
4. For GitHub repo: Ensure the repository is public or the URL includes authentication

#### Issue: "CORS error" (when testing locally)

**Note**: This shouldn't occur with the Node.js script, but might happen if you try to fetch from a browser

**Solution**:
- The Node.js script doesn't have CORS restrictions
- If you need browser access, ensure the server sends appropriate CORS headers

#### Issue: "Workflow doesn't run automatically"

**Causes**:
- Workflow is disabled
- Repository has no recent activity

**Solutions**:
1. Check Actions tab → Enable workflows if needed
2. Trigger manually to test
3. Verify the cron schedule is correct
4. Check if there are any failed runs blocking future runs

#### Issue: "Combined data seems wrong"

**Solutions**:
1. Check individual survey URLs manually
2. Verify both surveys have the expected data
3. Remember: values are **added** together, not averaged
4. Check for any parsing errors in the workflow logs

### Getting Help

If you're still experiencing issues:

1. **Check the workflow logs**:
   - Go to Actions tab
   - Click on the failed workflow run
   - Expand each step to see detailed logs

2. **Validate your JSON**:
   - Visit your URLs in a browser
   - Copy the JSON output
   - Validate at https://jsonlint.com/

3. **Test locally first**:
   - Follow the [Local Testing](#local-testing) steps
   - This helps identify if the issue is with the URLs or the GitHub Actions setup

4. **Common checklist**:
   - [ ] URLs are public and accessible
   - [ ] URLs point to raw JSON (not HTML pages)
   - [ ] JSON structure matches requirements exactly
   - [ ] GitHub secrets are set correctly
   - [ ] All values in JSON are numbers (not strings)

---

## Best Practices

1. **Use descriptive Gist filenames**: `leadership-survey-1-2024.json`

2. **Add comments in Gist description**: Document what each survey represents

3. **Test after updates**: Run the workflow manually after updating your JSON files

4. **Keep a backup**: Save a copy of your JSON files locally

5. **Monitor the workflow**: Check Actions tab weekly to ensure it's running

6. **Version your data**: If using Git, you'll have automatic version history

7. **Document your process**: Keep notes on how you update the surveys

---

## Example: Complete Workflow

Here's a complete example using GitHub Gist:

1. **Monday morning**: New survey responses come in via Microsoft Forms

2. **Export data**:
   - Open Microsoft Forms → Responses → Open in Excel
   - Count responses for each category

3. **Update Gist**:
   - Go to https://gist.github.com/
   - Find your `surveyData1.json` gist
   - Click "Edit"
   - Update the numbers based on your Excel counts:
     ```json
     {
       "trainingAttended": {
         "newLeaders": 12,    // Updated from 10
         "leadingIndividualContributors": 8,
         "leadingLeaders": 5
       },
       ...
     }
     ```
   - Click "Update gist"

4. **Trigger workflow** (or wait for scheduled run):
   - Go to your repository → Actions
   - Click "Update Survey Data" → "Run workflow"

5. **Verify**:
   - Wait ~30 seconds
   - Check that `surveyData.json` was updated
   - Visit your portal to see the updated charts

6. **Done!** Your portal now shows current data

---

## Additional Resources

- [GitHub Gist Documentation](https://docs.github.com/en/get-started/writing-on-github/editing-and-sharing-content-with-gists)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [JSON Validator](https://jsonlint.com/)
- [Microsoft Forms Documentation](https://support.microsoft.com/en-us/forms)
- [Power Automate Documentation](https://docs.microsoft.com/en-us/power-automate/)

---

## Summary

This setup provides a simple, reliable way to update your portal with survey data:

✅ No Microsoft API setup required  
✅ No Azure AD configuration  
✅ Easy to understand for non-developers  
✅ Multiple flexible options  
✅ Automated updates  
✅ Easy troubleshooting  

Choose the method that works best for your needs and follow the step-by-step instructions. Start with the [Quick Start](#quick-start-5-minutes) for the fastest setup!
