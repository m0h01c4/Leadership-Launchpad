import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Fetches survey data from two JSON URLs and combines them
 * This is a simplified approach that doesn't require Microsoft Forms API
 */

// Get URLs from environment variables
const SURVEY1_URL = process.env.SURVEY1_URL;
const SURVEY2_URL = process.env.SURVEY2_URL;

// Expected JSON structure for validation
const expectedStructure = {
  trainingAttended: ['newLeaders', 'leadingIndividualContributors', 'leadingLeaders'],
  effectiveness: ['veryEffective', 'somewhatEffective', 'neutral', 'somewhatIneffective', 'neitherEffectiveNorIneffective'],
  trainingNeeds: ['communication', 'decisionMaking', 'teamBuilding', 'conflictResolution', 'strategicThinking', 'other']
};

/**
 * Validates that JSON has the expected structure
 */
function validateJSON(data, source) {
  if (!data || typeof data !== 'object') {
    throw new Error(`${source}: Invalid JSON - expected object`);
  }

  for (const [category, fields] of Object.entries(expectedStructure)) {
    if (!data[category] || typeof data[category] !== 'object') {
      throw new Error(`${source}: Missing or invalid category: ${category}`);
    }

    for (const field of fields) {
      if (typeof data[category][field] !== 'number') {
        throw new Error(`${source}: Missing or invalid numeric field: ${category}.${field}`);
      }
    }
  }

  return true;
}

/**
 * Fetches JSON data from a URL using https/http module as fallback
 */
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    client.get(url, (res) => {
      let data = '';
      
      // Handle redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        return httpsGet(res.headers.location).then(resolve).catch(reject);
      }
      
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        return;
      }
      
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(new Error('Invalid JSON format'));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Fetches JSON data from a URL with error handling
 */
async function fetchJSON(url, source) {
  if (!url) {
    throw new Error(`${source} URL is not set. Please set the environment variable.`);
  }

  console.log(`Fetching ${source} from: ${url}`);

  try {
    // Try using native fetch first, fall back to https module
    let data;
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      data = await response.json();
    } catch (fetchError) {
      // Fallback to https/http module if fetch fails
      if (fetchError.message.includes('fetch failed') || 
          (fetchError.cause && (fetchError.cause.code === 'ENOTFOUND' || 
                                fetchError.cause.code === 'ECONNREFUSED' ||
                                fetchError.cause.code === 'ETIMEDOUT'))) {
        console.log(`  Falling back to https module...`);
        data = await httpsGet(url);
      } else {
        throw fetchError;
      }
    }
    
    validateJSON(data, source);
    
    console.log(`✓ ${source} fetched and validated successfully`);
    return data;
  } catch (error) {
    // Log the actual error for debugging
    console.error(`Error details: ${error.message}`);
    
    if (error.message.includes('fetch failed') || error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      throw new Error(`${source}: Network error - unable to reach URL. Check your internet connection and URL.`);
    }
    if (error.message.includes('Invalid JSON format') || error.message.toLowerCase().includes('invalid json')) {
      throw new Error(`${source}: Invalid JSON format. Ensure the URL returns valid JSON data.`);
    }
    throw new Error(`${source}: ${error.message}`);
  }
}

/**
 * Combines two survey datasets by adding numeric values
 */
function combineSurveyData(data1, data2) {
  const combined = {
    trainingAttended: {},
    effectiveness: {},
    trainingNeeds: {}
  };

  // Combine trainingAttended
  for (const field of expectedStructure.trainingAttended) {
    combined.trainingAttended[field] = 
      (data1.trainingAttended[field] || 0) + (data2.trainingAttended[field] || 0);
  }

  // Combine effectiveness
  for (const field of expectedStructure.effectiveness) {
    combined.effectiveness[field] = 
      (data1.effectiveness[field] || 0) + (data2.effectiveness[field] || 0);
  }

  // Combine trainingNeeds
  for (const field of expectedStructure.trainingNeeds) {
    combined.trainingNeeds[field] = 
      (data1.trainingNeeds[field] || 0) + (data2.trainingNeeds[field] || 0);
  }

  return combined;
}

/**
 * Main function to fetch and combine survey data
 */
async function main() {
  try {
    console.log('=== Survey Data Fetching Started ===\n');

    // Fetch both surveys
    const [survey1Data, survey2Data] = await Promise.all([
      fetchJSON(SURVEY1_URL, 'SURVEY1'),
      fetchJSON(SURVEY2_URL, 'SURVEY2')
    ]);

    // Combine the data
    console.log('\nCombining survey data...');
    const combinedData = combineSurveyData(survey1Data, survey2Data);

    // Write to file
    const outputPath = path.join(__dirname, '..', 'surveyData.json');
    await fs.writeFile(outputPath, JSON.stringify(combinedData, null, 2) + '\n');
    
    console.log(`✓ Combined data written to: ${outputPath}`);
    console.log('\n=== Survey Data Fetching Completed Successfully ===');
    
    // Display summary
    console.log('\nSummary:');
    console.log(`  Total training attendees: ${
      combinedData.trainingAttended.newLeaders + 
      combinedData.trainingAttended.leadingIndividualContributors + 
      combinedData.trainingAttended.leadingLeaders
    }`);
    console.log(`  Effectiveness responses: ${
      combinedData.effectiveness.veryEffective + 
      combinedData.effectiveness.somewhatEffective + 
      combinedData.effectiveness.neutral + 
      combinedData.effectiveness.somewhatIneffective + 
      combinedData.effectiveness.neitherEffectiveNorIneffective
    }`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nTroubleshooting tips:');
    console.error('  1. Ensure SURVEY1_URL and SURVEY2_URL environment variables are set');
    console.error('  2. Verify the URLs are accessible and return valid JSON');
    console.error('  3. Check that the JSON structure matches the expected format');
    console.error('  4. If using GitHub, ensure URLs point to "raw" content');
    process.exit(1);
  }
}

main();
