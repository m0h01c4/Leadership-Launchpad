# Survey Data Setup Guide

This document explains how the automated survey data fetching system works for the Leadership Launchpad People Partner Portal.

## Overview

The Leadership Launchpad uses an automated system to fetch survey data from two Microsoft Forms sources, combine the results, and update the `surveyData.json` file that powers the charts on the People Partner Portal.

## System Components

### 1. Survey Data Fetching Script (`scripts/fetchSurveyData.js`)

The main Node.js script that:
- Fetches data from two separate survey sources
- Validates the data structure
- Combines numeric responses by adding values from both surveys
- Writes the combined data to `surveyData.json`
- Includes error handling and fallback mechanisms
- Supports both API and file-based data sources

### 2. GitHub Actions Workflow (`.github/workflows/update-survey-data.yml`)

Automated workflow that:
- Runs daily at midnight UTC (configurable)
- Can be manually triggered
- Sets up Node.js environment
- Installs dependencies
- Runs the fetch script
- Commits and pushes changes if data has been updated
- Uses GitHub Actions bot for commits

### 3. Example Data Files

- `scripts/surveyData1.example.json` - Example format for first survey
- `scripts/surveyData2.example.json` - Example format for second survey

## Data Structure

The survey data follows this structure with three main categories:

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

## Configuration

### Environment Variables

The script uses the following environment variables:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATA_SOURCE_TYPE` | Data source type: `api` or `file` | `file` | No |
| `SURVEY_1_URL` | URL or file path for first survey | `scripts/surveyData1.example.json` | No |
| `SURVEY_2_URL` | URL or file path for second survey | `scripts/surveyData2.example.json` | No |
| `MS_FORMS_API_KEY` | API key/token for Microsoft Forms/Graph API | None | Only if using API |
| `OUTPUT_PATH` | Output path for surveyData.json | `./surveyData.json` | No |
| `FALLBACK_ON_ERROR` | Keep existing data on error | `true` | No |

### GitHub Secrets

To use the automated workflow with real survey data, configure these secrets in your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add the following secrets:

#### Required Secrets (for API mode)

- **`MS_FORMS_API_KEY`**
  - Description: Authentication token for Microsoft Forms or Microsoft Graph API
  - How to get: See [Microsoft Forms API Credentials](#microsoft-forms-api-credentials) section below

#### Optional Secrets (Override defaults)

- **`SURVEY_1_URL`**
  - Description: URL or path to first survey data source
  - Example (API): `https://graph.microsoft.com/v1.0/forms/{form-id}/responses`
  - Example (File): `scripts/surveyData1.json`

- **`SURVEY_2_URL`**
  - Description: URL or path to second survey data source
  - Example (API): `https://graph.microsoft.com/v1.0/forms/{form-id}/responses`
  - Example (File): `scripts/surveyData2.json`

## Microsoft Forms API Credentials

### Option 1: Microsoft Graph API (Recommended)

To access Microsoft Forms data via the Microsoft Graph API:

1. **Register an Application in Azure AD**
   - Go to [Azure Portal](https://portal.azure.com)
   - Navigate to **Azure Active Directory** → **App registrations**
   - Click **New registration**
   - Name: "Leadership Launchpad Survey Fetcher"
   - Set appropriate redirect URIs (if needed)
   - Click **Register**

2. **Configure API Permissions**
   - In your app registration, go to **API permissions**
   - Click **Add a permission** → **Microsoft Graph**
   - Select **Application permissions**
   - Add: `Forms.Read.All` or `Forms.ReadWrite.All`
   - Click **Grant admin consent**

3. **Create a Client Secret**
   - Go to **Certificates & secrets**
   - Click **New client secret**
   - Add a description and expiration period
   - Copy the secret value (you won't be able to see it again!)

4. **Get Your Tenant ID and Client ID**
   - Find these in the **Overview** section of your app registration
   - Tenant ID: Your organization's Azure AD tenant ID
   - Client ID (Application ID): Your app's unique identifier

5. **Generate an Access Token**
   ```bash
   curl -X POST "https://login.microsoftonline.com/{tenant-id}/oauth2/v2.0/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "client_id={client-id}" \
     -d "client_secret={client-secret}" \
     -d "scope=https://graph.microsoft.com/.default" \
     -d "grant_type=client_credentials"
   ```

6. **Get Your Form IDs**
   - Open your Microsoft Forms
   - The Form ID is in the URL: `https://forms.office.com/Pages/DesignPage.aspx?...&id={FORM-ID}`

7. **Construct API URLs**
   - Survey 1 URL: `https://graph.microsoft.com/v1.0/forms/{form-id-1}/responses`
   - Survey 2 URL: `https://graph.microsoft.com/v1.0/forms/{form-id-2}/responses`

### Option 2: Export JSON Files (Simpler Alternative)

If API access is complex, you can use exported JSON files:

1. **Export Form Responses**
   - Open your Microsoft Form
   - Click **Responses** tab
   - Click **Open in Excel** to download responses
   - Convert Excel data to JSON format matching the expected structure

2. **Place JSON Files**
   - Save as `scripts/surveyData1.json` and `scripts/surveyData2.json`
   - Ensure the files match the structure in the example files
   - The script will read from these files instead of APIs

3. **Update Configuration**
   - Set `DATA_SOURCE_TYPE=file` (default)
   - Set file paths in GitHub secrets if using custom paths

### Option 3: Microsoft Forms API Direct Access

If you have direct Microsoft Forms API access:

1. Obtain API credentials from Microsoft Forms
2. Get form IDs for both surveys
3. Use endpoints: `https://forms.office.com/formapi/api/{form-id}/...`
4. Store API key in `MS_FORMS_API_KEY` secret

## Usage

### Manual Trigger via GitHub Actions

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select **Update Survey Data** workflow
4. Click **Run workflow** button
5. (Optional) Select data source type
6. Click **Run workflow**

The workflow will:
- Fetch data from both survey sources
- Combine the data
- Update `surveyData.json`
- Commit and push changes if any

### Scheduled Automatic Updates

The workflow runs automatically every day at midnight UTC (00:00).

To change the schedule:
1. Edit `.github/workflows/update-survey-data.yml`
2. Modify the cron expression:
   ```yaml
   schedule:
     - cron: '0 0 * * *'  # Daily at midnight UTC
     # Examples:
     # - cron: '0 */6 * * *'  # Every 6 hours
     # - cron: '0 9 * * 1'    # Every Monday at 9 AM UTC
   ```

### Local Testing

To test the script locally:

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Test with example files (default)**
   ```bash
   npm run fetch-survey-data
   ```

3. **Test with custom file paths**
   ```bash
   DATA_SOURCE_TYPE=file \
   SURVEY_1_URL=./path/to/survey1.json \
   SURVEY_2_URL=./path/to/survey2.json \
   npm run fetch-survey-data
   ```

4. **Test with API (requires credentials)**
   ```bash
   DATA_SOURCE_TYPE=api \
   SURVEY_1_URL=https://api.example.com/survey1 \
   SURVEY_2_URL=https://api.example.com/survey2 \
   MS_FORMS_API_KEY=your_api_key_here \
   npm run fetch-survey-data
   ```

5. **Test with custom output path**
   ```bash
   OUTPUT_PATH=/tmp/testOutput.json npm run fetch-survey-data
   ```

## Data Combination Logic

The script combines data from both surveys by:

1. **Adding numeric values**: Each field value from Survey 1 is added to the corresponding field value from Survey 2
2. **Safe addition**: Non-numeric or missing values are treated as 0
3. **Structure preservation**: The output maintains the same JSON structure

**Example:**
```
Survey 1: { "trainingAttended": { "newLeaders": 2 } }
Survey 2: { "trainingAttended": { "newLeaders": 1 } }
Combined: { "trainingAttended": { "newLeaders": 3 } }
```

## Error Handling

The script includes robust error handling:

1. **Validation**: Checks data structure before processing
2. **Fallback**: Preserves existing data if fetch fails (controlled by `FALLBACK_ON_ERROR`)
3. **Logging**: Detailed console output for debugging
4. **Timeout**: 30-second timeout for API requests
5. **Network errors**: Graceful handling of connection issues

## Troubleshooting

### Workflow Not Running

- Check if the workflow file is in `.github/workflows/`
- Verify YAML syntax is correct
- Ensure Actions are enabled in repository settings

### Authentication Errors

- Verify `MS_FORMS_API_KEY` secret is set correctly
- Check token hasn't expired
- Confirm API permissions are granted

### Data Not Updating

- Check workflow run logs in Actions tab
- Verify survey data sources are accessible
- Ensure data format matches expected structure
- Check if there are actual changes to commit

### File Not Found Errors

- Verify file paths in environment variables
- Check that example JSON files exist in `scripts/` directory
- Ensure working directory is correct

### API Timeout

- Increase timeout value in `fetchSurveyData.js` if needed
- Check network connectivity to Microsoft services
- Verify API endpoints are correct

## Chart Integration

The `surveyData.json` file is automatically loaded by the People Partner Portal (`people-partners-portal.html`):

```javascript
fetch('./surveyData.json?cache=' + Date.now())
  .then(response => response.json())
  .then(data => {
    createTrainingChart(data);
    createEffectivenessChart(data);
    createTrainingNeedsChart(data);
  });
```

The charts automatically update when `surveyData.json` changes.

## Security Considerations

- **Never commit API keys or tokens** to the repository
- Use GitHub Secrets for sensitive credentials
- Restrict API permissions to read-only where possible
- Review and rotate API keys regularly
- Use HTTPS for all API calls
- Consider IP restrictions for API access if available

## Maintenance

### Regular Tasks

- Review and update API credentials before expiration
- Monitor workflow execution in Actions tab
- Verify data accuracy periodically
- Update dependencies: `npm update`

### Updating Dependencies

```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Update package.json and test
npm install
```

## Support

For issues or questions:
- Check workflow logs in GitHub Actions tab
- Review console output from local testing
- Verify environment variables and secrets
- Check Microsoft Forms API documentation
- Review data format in example JSON files

## Additional Resources

- [Microsoft Graph API Documentation](https://docs.microsoft.com/en-us/graph/)
- [Microsoft Forms API](https://docs.microsoft.com/en-us/graph/api/resources/forms-api-overview)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Chart.js Documentation](https://www.chartjs.org/)

## Version History

- **v1.0.0** - Initial release with file and API support
