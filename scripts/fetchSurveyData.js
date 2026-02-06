#!/usr/bin/env node

/**
 * Survey Data Combiner Script
 * 
 * This script combines survey data from two source files:
 * - sureyData1.json (Post Academy Training Survey)
 * - sureyData2.json (Listening Session Survey)
 * 
 * The combined data is written to surveyData.json
 * 
 * If sureyData2.json doesn't exist, only sureyData1.json data is used.
 */

const fs = require('fs');
const path = require('path');

// File paths (relative to repository root)
const survey1Path = path.join(__dirname, '..', 'sureyData1.json');
const survey2Path = path.join(__dirname, '..', 'sureyData2.json');
const outputPath = path.join(__dirname, '..', 'surveyData.json');

/**
 * Reads and parses a JSON file
 * @param {string} filePath - Path to the JSON file
 * @returns {Object|null} Parsed JSON object or null if file doesn't exist
 */
function readJSONFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Combines two survey data objects by summing their values
 * @param {Object} data1 - First survey data object
 * @param {Object} data2 - Second survey data object
 * @returns {Object} Combined survey data object
 */
function combineSurveyData(data1, data2) {
  const combined = {
    trainingAttended: {},
    effectiveness: {},
    trainingNeeds: {}
  };

  // Combine trainingAttended
  const categories = ['trainingAttended', 'effectiveness', 'trainingNeeds'];
  
  categories.forEach(category => {
    const keys1 = data1[category] ? Object.keys(data1[category]) : [];
    const keys2 = data2[category] ? Object.keys(data2[category]) : [];
    const allKeys = [...new Set([...keys1, ...keys2])];
    
    allKeys.forEach(key => {
      const value1 = (data1[category] && data1[category][key]) || 0;
      const value2 = (data2[category] && data2[category][key]) || 0;
      combined[category][key] = value1 + value2;
    });
  });

  return combined;
}

/**
 * Main function to combine survey data and write to output file
 */
function main() {
  console.log('Starting survey data combination...\n');

  // Read first survey file
  console.log(`Reading ${survey1Path}...`);
  const survey1Data = readJSONFile(survey1Path);
  
  if (!survey1Data) {
    console.error('Error: sureyData1.json not found or could not be read.');
    console.error('Please ensure the file exists in the repository root.');
    process.exit(1);
  }
  console.log('✓ sureyData1.json loaded successfully');

  // Read second survey file (optional)
  console.log(`\nReading ${survey2Path}...`);
  const survey2Data = readJSONFile(survey2Path);
  
  if (!survey2Data) {
    console.warn('⚠ sureyData2.json not found. Using only sureyData1.json data.');
    console.warn('To include Listening Session survey data, create/update sureyData2.json');
  } else {
    console.log('✓ sureyData2.json loaded successfully');
  }

  // Combine the data
  console.log('\nCombining survey data...');
  const combinedData = survey2Data 
    ? combineSurveyData(survey1Data, survey2Data)
    : survey1Data;

  // Write to output file
  console.log(`Writing combined data to ${outputPath}...`);
  try {
    fs.writeFileSync(outputPath, JSON.stringify(combinedData, null, 2), 'utf8');
    console.log('✓ Combined survey data written successfully');
    
    // Display summary
    console.log('\n--- Summary ---');
    console.log('Data sources combined:');
    console.log(`  - sureyData1.json: ✓`);
    console.log(`  - sureyData2.json: ${survey2Data ? '✓' : '✗ (not found)'}`);
    console.log(`Output file: ${outputPath}`);
    console.log('\nDone!');
  } catch (error) {
    console.error('Error writing output file:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { combineSurveyData, readJSONFile };
