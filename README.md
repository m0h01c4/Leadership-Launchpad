# Leadership Launchpad

Leadership development resources and training survey data management system.

## Survey Data Management

This repository includes an automated system for managing and combining survey data from multiple sources.

### Quick Start

1. **Update survey data:**
   - Edit `sureyData1.json` (Post Academy Training Survey)
   - Edit `sureyData2.json` (Listening Session Survey)

2. **Combine surveys:**
   ```bash
   npm run combine-surveys
   ```

3. **Commit and push:**
   ```bash
   git add sureyData1.json sureyData2.json surveyData.json
   git commit -m "Update survey data"
   git push
   ```

### Automated Workflow

The system automatically combines survey data:
- ✅ When you push changes to `sureyData1.json` or `sureyData2.json`
- ✅ Daily at midnight UTC
- ✅ Manual trigger from GitHub Actions

For detailed instructions, see [SURVEY_DATA_SETUP.md](SURVEY_DATA_SETUP.md).

## Files

- `sureyData1.json` - Post Academy Training Survey data (INPUT)
- `sureyData2.json` - Listening Session Survey data (INPUT)
- `surveyData.json` - Combined survey data (OUTPUT - auto-generated)
- `scripts/fetchSurveyData.js` - Survey combination script
- `SURVEY_DATA_SETUP.md` - Detailed setup and usage guide

## Project Structure

```
/
├── index.html                    # Main website
├── script.js                     # Website JavaScript
├── styles.css                    # Website styles
├── sureyData1.json              # Survey source 1 (INPUT)
├── sureyData2.json              # Survey source 2 (INPUT)
├── surveyData.json              # Combined output (OUTPUT)
├── scripts/
│   └── fetchSurveyData.js       # Combination script
├── .github/
│   └── workflows/
│       └── update-survey-data.yml  # Automated workflow
└── SURVEY_DATA_SETUP.md         # Documentation
```

## Contributing

When updating survey data, please follow the workflow documented in [SURVEY_DATA_SETUP.md](SURVEY_DATA_SETUP.md).
