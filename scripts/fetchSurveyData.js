const fs = require('fs');
const path = require('path');

/**
 * Fetch and combine survey data from multiple JSON files
 * This script reads survey data files and combines them by summing numeric values
 */

// Define the paths to the survey data files (input files to combine)
// Note: surveyData.json is the output file, so we only read from surveyData1.json, surveyData2.json, etc.
const surveyDataFiles = [
    path.join(__dirname, '../surveyData1.json')
];

// Automatically find additional survey data files (surveyData2.json, surveyData3.json, etc.)
const baseDir = path.join(__dirname, '..');
for (let i = 2; i <= 10; i++) {
    const filePath = path.join(baseDir, `surveyData${i}.json`);
    if (fs.existsSync(filePath)) {
        surveyDataFiles.push(filePath);
    }
}

// Output file path
const outputFile = path.join(__dirname, '../surveyData.json');

/**
 * Deep merge function that sums numeric values
 * @param {Object} target - Target object to merge into
 * @param {Object} source - Source object to merge from
 * @returns {Object} Merged object with summed values
 */
function deepMergeSum(target, source) {
    const result = { ...target };
    
    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
                // Recursively merge nested objects
                result[key] = deepMergeSum(result[key] || {}, source[key]);
            } else if (typeof source[key] === 'number') {
                // Sum numeric values
                result[key] = (result[key] || 0) + source[key];
            } else {
                // For non-numeric, non-object values, take the source value
                result[key] = source[key];
            }
        }
    }
    
    return result;
}

/**
 * Main function to combine survey data
 */
function combineSurveyData() {
    console.log('Starting survey data combination...\n');
    
    let combinedData = {};
    let filesProcessed = 0;
    
    // Read and combine each survey data file
    for (const filePath of surveyDataFiles) {
        try {
            // Check if file exists
            if (!fs.existsSync(filePath)) {
                console.log(`⚠️  File not found: ${filePath}`);
                continue;
            }
            
            // Read the file
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(fileContent);
            
            console.log(`✓ Read: ${path.basename(filePath)}`);
            
            // Combine data
            combinedData = deepMergeSum(combinedData, data);
            filesProcessed++;
            
        } catch (error) {
            console.error(`✗ Error reading ${filePath}:`, error.message);
        }
    }
    
    if (filesProcessed === 0) {
        console.error('\n✗ No survey data files were processed successfully.');
        process.exit(1);
    }
    
    // Write combined data to output file
    try {
        fs.writeFileSync(outputFile, JSON.stringify(combinedData, null, 2));
        console.log(`\n✓ Combined data written to: ${path.basename(outputFile)}`);
        console.log(`\nFiles processed: ${filesProcessed}`);
        console.log('\nCombined data:');
        console.log(JSON.stringify(combinedData, null, 2));
    } catch (error) {
        console.error('\n✗ Error writing output file:', error.message);
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    combineSurveyData();
}

module.exports = { combineSurveyData, deepMergeSum };
