# Survey Data - Quick Start Guide

## Quick Commands

### Combine Survey Data
```bash
npm run combine-surveys
```

### Files Location
- Input files: `surveyData1.json`, `surveyData2.json`, etc. (in root directory)
- Output file: `surveyData.json` (automatically updated)

## How It Works

1. **Add new survey data**: Upload `surveyDataN.json` to repository root
2. **Run script**: Execute `npm run combine-surveys` or let GitHub Actions run automatically
3. **Result**: `surveyData.json` updated with combined data

## Automatic Updates

GitHub Actions will automatically run the combination script when you:
- Push a new `surveyDataN.json` file to the repository
- The workflow can also be triggered manually from the Actions tab

## Need More Info?

See `SURVEY_DATA_SETUP.md` for complete documentation.
