#!/usr/bin/env node

/**
 * Leadership Launchpad Survey Data Fetching Script
 * 
 * This script fetches survey data from two Microsoft Forms sources,
 * combines the numeric responses, and updates surveyData.json.
 * 
 * Configuration via environment variables:
 * - DATA_SOURCE_TYPE: 'api' (Microsoft Forms/Graph API) or 'file' (local JSON files)
 * - SURVEY_1_URL: URL or file path for first survey data
 * - SURVEY_2_URL: URL or file path for second survey data
 * - MS_FORMS_API_KEY: API key for Microsoft Forms (if using API)
 * - OUTPUT_PATH: Path to output surveyData.json (default: ./surveyData.json)
 */

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

// Configuration
const CONFIG = {
  dataSourceType: process.env.DATA_SOURCE_TYPE || 'file',
  survey1Source: process.env.SURVEY_1_URL || path.join(__dirname, 'surveyData1.example.json'),
  survey2Source: process.env.SURVEY_2_URL || path.join(__dirname, 'surveyData2.example.json'),
  apiKey: process.env.MS_FORMS_API_KEY || '',
  outputPath: process.env.OUTPUT_PATH || path.join(__dirname, '..', 'surveyData.json'),
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
      decisionMaking: 0,
      teamBuilding: 0,
      conflictResolution: 0,
      strategicThinking: 0,
      other: 0
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
 * Combine two survey data objects by adding their numeric values
 */
function combineSurveyData(data1, data2) {
  console.log('Combining survey data from both sources...');
  const combined = initializeDataStructure();

  // Helper function to safely add values
  const safeAdd = (val1, val2) => {
    const num1 = typeof val1 === 'number' ? val1 : 0;
    const num2 = typeof val2 === 'number' ? val2 : 0;
    return num1 + num2;
  };

  // Combine trainingAttended
  for (const key in combined.trainingAttended) {
    combined.trainingAttended[key] = safeAdd(
      data1.trainingAttended?.[key],
      data2.trainingAttended?.[key]
    );
  }

  // Combine effectiveness
  for (const key in combined.effectiveness) {
    combined.effectiveness[key] = safeAdd(
      data1.effectiveness?.[key],
      data2.effectiveness?.[key]
    );
  }

  // Combine trainingNeeds
  for (const key in combined.trainingNeeds) {
    combined.trainingNeeds[key] = safeAdd(
      data1.trainingNeeds?.[key],
      data2.trainingNeeds?.[key]
    );
  }

  console.log('✓ Successfully combined survey data');
  return combined;
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
  console.log(`Survey 1 Source: ${CONFIG.survey1Source}`);
  console.log(`Survey 2 Source: ${CONFIG.survey2Source}`);
  console.log(`Output Path: ${CONFIG.outputPath}`);
  console.log(`Fallback on Error: ${CONFIG.fallbackOnError}`);
  console.log('='.repeat(60));

  try {
    // Fetch data from both sources
    console.log('\nFetching survey data...');
    const [surveyData1, surveyData2] = await Promise.all([
      fetchSurveyData(CONFIG.survey1Source),
      fetchSurveyData(CONFIG.survey2Source)
    ]);

    // Combine the data
    const combinedData = combineSurveyData(surveyData1, surveyData2);

    // Write to output file
    await writeOutputFile(combinedData);

    console.log('\n' + '='.repeat(60));
    console.log('✓ Survey data update completed successfully!');
    console.log('='.repeat(60));
    console.log('\nCombined Data Summary:');
    console.log(JSON.stringify(combinedData, null, 2));
    
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
  combineSurveyData,
  initializeDataStructure,
  validateSurveyData
};
