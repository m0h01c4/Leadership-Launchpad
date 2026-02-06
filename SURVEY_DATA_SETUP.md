# Survey Data Setup

This document explains how to manage and combine survey data for the Leadership Launchpad People Partner Portal.

## Overview

The People Partner Portal displays survey data in charts. When multiple survey responses are collected, they need to be combined into a single `surveyData.json` file that the portal reads.

## File Structure

### Input Files
- **`surveyData1.json`** - First survey data file (uploaded from Microsoft Forms)
- **`surveyData2.json`** - Second survey data file (optional)
- **`surveyDataN.json`** - Additional survey data files (optional, numbered sequentially)

### Output File
- **`surveyData.json`** - Combined survey data used by the portal

### Script
- **`scripts/fetchSurveyData.js`** - Node.js script that combines survey data files

## Survey Data Format

Each survey data file should follow this JSON structure:

```json
{
  "trainingAttended": {
    "newLeaders": 3,
    "leadingIndividualContributors": 2,
    "leadingLeaders": 1
  },
  "effectiveness": {
    "veryEffective": 4,
    "somewhatEffective": 1,
    "neutral": 0,
    "somewhatIneffective": 0,
    "neitherEffectiveNorIneffective": 1
  },
  "trainingNeeds": {
    "communication": 3,
    "decisionMaking": 2,
    "teamBuilding": 2,
    "conflictResolution": 1,
    "strategicThinking": 2,
    "other": 0
  }
}
```

## How to Add New Survey Data

### Step 1: Export Survey Data from Microsoft Forms

1. Go to your Microsoft Forms survey
2. Export the responses
3. Process the responses to match the JSON format above
4. Save as `surveyDataN.json` (where N is the next sequential number)

### Step 2: Upload the File

1. Upload the new survey data file to the repository root directory
2. Name it following the pattern: `surveyData1.json`, `surveyData2.json`, etc.
3. The script will automatically detect files numbered 1 through 10

### Step 3: Run the Combination Script

#### Manual Execution

Run the script manually using Node.js:

```bash
node scripts/fetchSurveyData.js
```

The script will:
- Automatically find all `surveyDataN.json` files (N = 1 to 10)
- Read each file
- Combine the data by summing all numeric values
- Write the combined result to `surveyData.json`

#### Via GitHub Actions (if configured)

If you have a GitHub Actions workflow set up, it can automatically run the script when new survey data files are pushed to the repository.

## How the Combination Works

The script combines survey data by:

1. **Reading all input files**: Finds and reads `surveyData1.json`, `surveyData2.json`, etc.
2. **Summing numeric values**: For each field, adds up the numbers across all files
3. **Maintaining structure**: Keeps the same JSON structure
4. **Writing output**: Saves the combined data to `surveyData.json`

### Example

If you have two files:

**surveyData1.json:**
```json
{
  "trainingAttended": {
    "newLeaders": 3
  }
}
```

**surveyData2.json:**
```json
{
  "trainingAttended": {
    "newLeaders": 2
  }
}
```

The combined **surveyData.json** will be:
```json
{
  "trainingAttended": {
    "newLeaders": 5
  }
}
```

## Updating the Portal

After running the combination script:

1. The portal will automatically load the updated `surveyData.json` file
2. No code changes to the portal are needed
3. The charts will reflect the combined data from all surveys
4. The portal adds a cache buster (`?cache=` timestamp) to ensure fresh data is loaded

## Troubleshooting

### Script doesn't find survey files

- Make sure files are named exactly: `surveyData1.json`, `surveyData2.json`, etc.
- Files must be in the repository root directory
- Files must be valid JSON format

### Charts not updating

- Clear browser cache and reload the page
- Check browser console for errors
- Verify `surveyData.json` contains the expected data

### Numbers don't add up correctly

- Verify each input file has valid numeric values
- Check for typos in field names (must match exactly)
- Ensure all files follow the same JSON structure

## File Locations

```
Leadership-Launchpad/
├── surveyData.json          # Combined output (auto-generated)
├── surveyData1.json         # Input file 1
├── surveyData2.json         # Input file 2 (optional)
├── surveyDataN.json         # Additional input files (optional)
├── scripts/
│   └── fetchSurveyData.js  # Combination script
└── people-partners-portal.html  # Portal that displays the data
```

## Notes

- The script supports up to 10 input files (surveyData1.json through surveyData10.json)
- Input files are never modified, only read
- The output file (`surveyData.json`) is overwritten each time the script runs
- All numeric fields are summed; non-numeric fields use the value from the last file processed
