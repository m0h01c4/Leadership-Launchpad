# Survey Data - Quick Start Guide

## Quick Commands

### Process Survey Data
```bash
npm run fetch-survey-data
```

### Files Location
- Input file: `surveyData1.json` (in root directory or configured location)
- Output file: `combinedSurveyData.json` (automatically updated)

## How It Works

1. **Update survey data**: Modify `surveyData1.json` with Leader Academy survey responses
2. **Run script**: Execute `npm run fetch-survey-data` or let GitHub Actions run automatically
3. **Result**: `combinedSurveyData.json` updated with processed data

## Automatic Updates

GitHub Actions will automatically run the processing script:
- Daily at midnight UTC
- Can be triggered manually from the Actions tab

## Need More Info?

See `SURVEY_DATA_SETUP.md` for complete documentation.
