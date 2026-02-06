# Survey Data Setup Guide

This guide explains how to manage survey data for the Leadership Launchpad project.

## Overview

The Leadership Launchpad uses survey data from two sources:
- **Post Academy Training Survey** (`sureyData1.json`)
- **Listening Session Survey** (`sureyData2.json`)

These source files are manually updated by you. The system automatically combines them into a single output file (`surveyData.json`) that is used by the website.

## File Structure

```
/
├── sureyData1.json      ← INPUT: Post Academy Training Survey data (manually updated)
├── sureyData2.json      ← INPUT: Listening Session Survey data (manually updated)
├── surveyData.json      ← OUTPUT: Combined data (automatically generated)
└── scripts/
    └── fetchSurveyData.js  ← Script that combines the surveys
```

## Data Format

All survey files use the same JSON structure:

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

## How to Update Survey Data

### Step 1: Export Survey Data from Microsoft Forms

1. Open your Microsoft Forms survey
2. Go to the "Responses" tab
3. Click "Open in Excel" to export responses
4. Save the Excel file

### Step 2: Convert Excel to JSON

You have several options to convert Excel data to JSON:

**Option A: Use an online converter**
- Visit a trusted Excel-to-JSON converter (e.g., `convertcsv.com/excel-to-json.htm`)
- Upload your Excel file
- Download the JSON output

**Option B: Use Python script**
```python
import pandas as pd
import json

# Read Excel file
df = pd.read_excel('survey_responses.xlsx')

# Process and convert to required format
# (You'll need to map your columns to the structure above)
data = {
    "trainingAttended": {
        "newLeaders": df['column_name'].value_counts().get('New Leaders', 0),
        # ... map other values
    }
}

# Write to JSON
with open('sureyData1.json', 'w') as f:
    json.dump(data, f, indent=2)
```

**Option C: Manually create/edit JSON**
- Use a text editor to create or update the JSON file
- Follow the format shown above
- Ensure proper JSON syntax (commas, brackets, quotes)

### Step 3: Update the Repository

1. **For Post Academy Training Survey:**
   - Update `sureyData1.json` with your new data
   
2. **For Listening Session Survey:**
   - Update `sureyData2.json` with your new data

3. **Commit and push changes:**
   ```bash
   git add sureyData1.json sureyData2.json
   git commit -m "Update survey data"
   git push
   ```

### Step 4: Automatic Combination

The system will automatically combine the surveys in these scenarios:

1. **Automatically on push:** When you push changes to `sureyData1.json` or `sureyData2.json`
2. **Daily schedule:** Runs automatically at midnight UTC every day
3. **Manual trigger:** You can manually run the workflow from GitHub Actions

Alternatively, you can run the combination script locally:

```bash
npm run combine-surveys
```

## Manual Script Execution

If you want to combine surveys locally before committing:

```bash
# Run the combination script
npm run combine-surveys

# Review the updated surveyData.json
cat surveyData.json

# If satisfied, commit all changes
git add sureyData1.json sureyData2.json surveyData.json
git commit -m "Update survey data"
git push
```

## Important Notes

### File Names
- The filename `sureyData1.json` contains a typo (`surey` instead of `survey`) - this is intentional and should be kept as-is
- Do not rename these files as the script depends on these exact names

### Source Files vs Output File
- **NEVER edit `surveyData.json` directly** - it will be overwritten
- Only edit `sureyData1.json` and `sureyData2.json`
- The script automatically generates `surveyData.json`

### Handling Missing Survey Files
- If `sureyData2.json` doesn't exist, the script will only use data from `sureyData1.json`
- The script will show a warning but continue to work
- A template `sureyData2.json` with zeros is provided - update it when you have data

### Data Combination Logic
The script combines surveys by **summing** the values from both sources:
```
surveyData.json = sureyData1.json + sureyData2.json
```

For example:
- `sureyData1.json` has 3 responses for "New Leaders"
- `sureyData2.json` has 5 responses for "New Leaders"
- `surveyData.json` will show 8 total responses for "New Leaders"

## Troubleshooting

### Script fails with "file not found"
- Ensure `sureyData1.json` exists in the repository root
- Check that file names match exactly (including case)

### Combined data looks wrong
- Verify JSON syntax in source files (use a JSON validator)
- Check that all required fields are present
- Run `npm run combine-surveys` locally to see detailed error messages

### Workflow doesn't run automatically
- Check GitHub Actions tab for error messages
- Verify the workflow file is in `.github/workflows/`
- Ensure repository has Actions enabled

### Changes not appearing on website
- Wait a few moments for GitHub Pages to rebuild
- Hard refresh your browser (Ctrl+F5 or Cmd+Shift+R)
- Check that `surveyData.json` was updated in the repository

## Getting Help

If you encounter issues:
1. Check the GitHub Actions logs for error messages
2. Run `npm run combine-surveys` locally to test
3. Verify your JSON files are valid using a JSON validator
4. Review this documentation for common issues

## Advanced Usage

### Testing Without Committing

```bash
# Make changes to sureyData1.json or sureyData2.json
# Run the script
npm run combine-surveys

# Review the output
cat surveyData.json

# If not satisfied, edit source files and run again
# Only commit when ready
```

### Viewing Script Output

The script provides detailed output showing:
- Which files were successfully loaded
- Any warnings or errors
- Summary of what was combined
- Location of output file

Example output:
```
Starting survey data combination...

Reading /path/to/sureyData1.json...
✓ sureyData1.json loaded successfully

Reading /path/to/sureyData2.json...
✓ sureyData2.json loaded successfully

Combining survey data...
Writing combined data to /path/to/surveyData.json...
✓ Combined survey data written successfully

--- Summary ---
Data sources combined:
  - sureyData1.json: ✓
  - sureyData2.json: ✓
Output file: /path/to/surveyData.json

Done!
```
