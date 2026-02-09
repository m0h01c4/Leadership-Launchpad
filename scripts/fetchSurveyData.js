#!/usr/bin/env node

/**
 * Leadership Launchpad Survey Data Fetching Script
 * 
 * This script fetches survey data from the Leader Academy feedback survey,
 * validates and processes the responses.
 * 
 * Configuration via environment variables:
 * - DATA_SOURCE_TYPE: 'api' (Microsoft Forms/Graph API) or 'file' (local JSON files)
 * - SURVEY_1_URL: URL or file path for Leader Academy survey data
 * - MS_FORMS_API_KEY: API key for Microsoft Forms (if using API)
 * - OUTPUT_PATH: Path to output combinedSurveyData.json (default: ./combinedSurveyData.json)
 */

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

// Configuration
const CONFIG = {
  dataSourceType: process.env.DATA_SOURCE_TYPE || 'file',
  survey1Source: process.env.SURVEY_1_URL || path.join(__dirname, 'surveyData1.example.json'),
  apiKey: process.env.MS_FORMS_API_KEY || '',
  outputPath: process.env.OUTPUT_PATH || path.join(__dirname, '..', 'combinedSurveyData.json'),
  fallbackOnError: process.env.FALLBACK_ON_ERROR !== 'false' // Default to true
};

/**
 * Initialize the data structure with zeros
 */
function initializeDataStructure() {
  return {
    trainingAttended: {
      newLeaders: 0,
      leadingIndividualContributors: 0,
      leadingLeaders: 0
    },
    effectiveness: {
      veryEffective: 0,
      somewhatEffective: 0,
      neutral: 0,
      somewhatIneffective: 0,
      neitherEffectiveNorIneffective: 0
    },
    trainingNeeds: {
      communication: 0,
      decisionMakingProblemSolving: 0,
      teamBuilding: 0,
      healthyConflict: 0,
      strategicThinking: 0,
      feedbackCoaching: 0,
      developmentOwnershipIDP: 0,
      careerConversations: 0,
      emotionalIntelligenceSelfAwareness: 0,
      personalBrandPresence: 0,
      navigatingChangeAmbiguity: 0,
      influencePersuasion: 0,
      negotiations: 0,
      restResilience: 0,
      careerNavigation: 0
    }
  };
}

/**
 * Validate survey data structure
 */
function validateSurveyData(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Survey data must be an object');
  }

  const requiredCategories = ['trainingAttended', 'effectiveness', 'trainingNeeds'];
  for (const category of requiredCategories) {
    if (!data[category] || typeof data[category] !== 'object') {
      throw new Error(`Missing or invalid category: ${category}`);
    }
  }

  return true;
}

/**
 * Fetch data from a local JSON file
 */
async function fetchFromFile(filePath) {
  console.log(`Fetching data from file: ${filePath}`);
  try {
    const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
    const fileContent = await fs.readFile(absolutePath, 'utf8');
    const data = JSON.parse(fileContent);
    validateSurveyData(data);
    console.log(`✓ Successfully loaded data from ${filePath}`);
    return data;
  } catch (error) {
    console.error(`✗ Error reading file ${filePath}:`, error.message);
    throw error;
  }
}

/**
 * Fetch data from Microsoft Forms API or Microsoft Graph API
 */
async function fetchFromAPI(url) {
  console.log(`Fetching data from API: ${url}`);
  try {
    const headers = {
      'Content-Type': 'application/json'
    };

    // Add authentication if API key is provided
    if (CONFIG.apiKey) {
      headers['Authorization'] = `Bearer ${CONFIG.apiKey}`;
    }

    const response = await axios.get(url, {
      headers,
      timeout: 30000 // 30 second timeout
    });

    if (!response.data) {
      throw new Error('No data received from API');
    }

    // The API might return data in different formats
    // This is a flexible approach that can handle both direct JSON
    // and wrapped responses
    let data = response.data;
    
    // If the response has a 'data' property, use that
    if (data.data && typeof data.data === 'object') {
      data = data.data;
    }
    
    // If the response has a 'value' property (Graph API style), use that
    if (data.value && typeof data.value === 'object') {
      data = data.value;
    }

    validateSurveyData(data);
    console.log(`✓ Successfully fetched data from API`);
    return data;
  } catch (error) {
    if (error.response) {
      console.error(`✗ API Error: ${error.response.status} - ${error.response.statusText}`);
    } else if (error.request) {
      console.error(`✗ Network Error: No response received from ${url}`);
    } else {
      console.error(`✗ Error fetching from API:`, error.message);
    }
    throw error;
  }
}

/**
 * Fetch survey data based on source type
 */
async function fetchSurveyData(source) {
  if (CONFIG.dataSourceType === 'api') {
    return await fetchFromAPI(source);
  } else {
    return await fetchFromFile(source);
  }
}

/**
 * Process single survey data - just return it as is
 */
function processSurveyData(data1) {
  console.log('Processing Leader Academy survey data...');
  const processed = initializeDataStructure();

  // Helper function to safely get values
  const safeGet = (val) => {
    return typeof val === 'number' ? val : 0;
  };

  // Copy trainingAttended
  for (const key in processed.trainingAttended) {
    processed.trainingAttended[key] = safeGet(data1.trainingAttended?.[key]);
  }

  // Copy effectiveness
  for (const key in processed.effectiveness) {
    processed.effectiveness[key] = safeGet(data1.effectiveness?.[key]);
  }

  // Copy trainingNeeds
  for (const key in processed.trainingNeeds) {
    processed.trainingNeeds[key] = safeGet(data1.trainingNeeds?.[key]);
  }

  console.log('✓ Successfully processed Leader Academy survey data');
  return processed;
}

/**
 * Read existing survey data for fallback
 */
async function readExistingData() {
  try {
    const existingData = await fs.readFile(CONFIG.outputPath, 'utf8');
    return JSON.parse(existingData);
  } catch (error) {
    console.log('No existing survey data found or error reading file');
    return null;
  }
}

/**
 * Write combined data to output file
 */
async function writeOutputFile(data) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(CONFIG.outputPath, jsonString + '\n', 'utf8');
    console.log(`✓ Successfully wrote data to ${CONFIG.outputPath}`);
    return true;
  } catch (error) {
    console.error(`✗ Error writing to ${CONFIG.outputPath}:`, error.message);
    throw error;
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Leadership Launchpad Survey Data Fetch');
  console.log('='.repeat(60));
  console.log(`Data Source Type: ${CONFIG.dataSourceType}`);
  console.log(`Survey Source: ${CONFIG.survey1Source}`);
  console.log(`Output Path: ${CONFIG.outputPath}`);
  console.log(`Fallback on Error: ${CONFIG.fallbackOnError}`);
  console.log('='.repeat(60));

  try {
    // Fetch data from Leader Academy survey only
    console.log('\nFetching Leader Academy survey data...');
    const surveyData1 = await fetchSurveyData(CONFIG.survey1Source);

    // Process the data
    const processedData = processSurveyData(surveyData1);

    // Write to output file
    await writeOutputFile(processedData);

    console.log('\n' + '='.repeat(60));
    console.log('✓ Survey data update completed successfully!');
    console.log('='.repeat(60));
    console.log('\nProcessed Data Summary:');
    console.log(JSON.stringify(processedData, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('\n' + '='.repeat(60));
    console.error('✗ Error during survey data fetch:');
    console.error('='.repeat(60));
    console.error(error.message);
    
    if (CONFIG.fallbackOnError) {
      console.log('\nAttempting to preserve existing data...');
      const existingData = await readExistingData();
      
      if (existingData) {
        console.log('✓ Existing data preserved - no changes made');
        console.log('Current data:');
        console.log(JSON.stringify(existingData, null, 2));
        process.exit(0);
      } else {
        console.error('✗ No existing data to fall back to');
        process.exit(1);
      }
    } else {
      console.error('\nFallback disabled - exiting with error');
      process.exit(1);
    }
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  fetchSurveyData,
  processSurveyData,
  initializeDataStructure,
  validateSurveyData
};
