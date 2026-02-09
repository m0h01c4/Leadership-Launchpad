# Leadership Launchpad

A leadership training portal with automated survey data integration.

## Features

- **Survey Data Integration**: Automatically fetch survey data from Leader Academy feedback survey
- **No Complex Setup**: No Microsoft API credentials or Azure AD configuration needed
- **Multiple Integration Methods**: Choose from GitHub Gist, Excel exports, Power Automate, or manual updates
- **Automated Updates**: GitHub Actions workflow runs daily to keep data current

## Quick Start

See [SURVEY_DATA_SETUP.md](SURVEY_DATA_SETUP.md) for detailed setup instructions. The fastest way to get started (5 minutes):

1. Create a public GitHub Gist with your Leader Academy survey data in JSON format
2. Get the raw URL from the Gist
3. Add the URL as a GitHub Secret (`SURVEY_1_URL`)
4. Run the workflow manually or wait for automatic updates

## Survey Data Structure

Each survey JSON file should follow this structure:

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
    "decisionMakingProblemSolving": 0,
    "teamBuilding": 0,
    "healthyConflict": 0,
    "strategicThinking": 0,
    "feedbackCoaching": 0,
    "developmentOwnershipIDP": 0,
    "careerConversations": 0,
    "emotionalIntelligenceSelfAwareness": 0,
    "personalBrandPresence": 0,
    "navigatingChangeAmbiguity": 0,
    "influencePersuasion": 0,
    "negotiations": 0,
    "restResilience": 0,
    "careerNavigation": 0
  }
}
```

## Documentation

- [Complete Survey Data Setup Guide](SURVEY_DATA_SETUP.md) - Detailed instructions for all integration methods
- [Troubleshooting](SURVEY_DATA_SETUP.md#troubleshooting) - Common issues and solutions

## How It Works

1. You maintain a JSON file with Leader Academy survey data in an accessible location (GitHub Gist, GitHub repo, OneDrive, etc.)
2. The GitHub Actions workflow runs automatically daily (or manually on-demand)
3. The script fetches the JSON file, validates it, and processes the data
4. The result is written to `combinedSurveyData.json` in the repository
5. Your portal displays the updated data

## Local Development

To test the survey data fetching locally:

```bash
# Set environment variables
export SURVEY_1_URL="https://gist.githubusercontent.com/.../surveyData1.json"

# Run the script
npm run fetch-survey-data
```

## GitHub Actions

The workflow is triggered:
- Automatically daily at midnight UTC
- Manually via the Actions tab → "Update Survey Data" → "Run workflow"

## Requirements

- Node.js 18+ (for native fetch support)
- One publicly accessible JSON URL with Leader Academy survey data

## License

MIT
