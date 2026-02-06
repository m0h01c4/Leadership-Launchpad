const fs = require('fs');
const path = require('path');

// Define file paths relative to repository root
const survey1Path = path.join(__dirname, '..', 'surveyData.json');
const survey2Path = path.join(__dirname, '..', 'surveyData1.json');
const outputPath = path.join(__dirname, '..', 'combinedSurveyData.json');

console.log('Starting survey data combination...');
console.log('Reading from:', survey1Path);
console.log('Reading from:', survey2Path);
console.log('Writing to:', outputPath);

try {
  // Read both survey data files
  const survey1Data = JSON.parse(fs.readFileSync(survey1Path, 'utf8'));
  const survey2Data = JSON.parse(fs.readFileSync(survey2Path, 'utf8'));

  console.log('Successfully read both survey files');

  // Helper function to safely get a value or return 0 if missing
  const getValue = (obj, path) => {
    const keys = path.split('.');
    let value = obj;
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) return 0;
    }
    return typeof value === 'number' ? value : 0;
  };

  // Combine the data by adding numeric values
  const combinedData = {
    trainingAttended: {
      newLeaders: getValue(survey1Data, 'trainingAttended.newLeaders') + getValue(survey2Data, 'trainingAttended.newLeaders'),
      leadingIndividualContributors: getValue(survey1Data, 'trainingAttended.leadingIndividualContributors') + getValue(survey2Data, 'trainingAttended.leadingIndividualContributors'),
      leadingLeaders: getValue(survey1Data, 'trainingAttended.leadingLeaders') + getValue(survey2Data, 'trainingAttended.leadingLeaders')
    },
    effectiveness: {
      veryEffective: getValue(survey1Data, 'effectiveness.veryEffective') + getValue(survey2Data, 'effectiveness.veryEffective'),
      somewhatEffective: getValue(survey1Data, 'effectiveness.somewhatEffective') + getValue(survey2Data, 'effectiveness.somewhatEffective'),
      neutral: getValue(survey1Data, 'effectiveness.neutral') + getValue(survey2Data, 'effectiveness.neutral'),
      somewhatIneffective: getValue(survey1Data, 'effectiveness.somewhatIneffective') + getValue(survey2Data, 'effectiveness.somewhatIneffective'),
      neitherEffectiveNorIneffective: getValue(survey1Data, 'effectiveness.neitherEffectiveNorIneffective') + getValue(survey2Data, 'effectiveness.neitherEffectiveNorIneffective')
    },
    trainingNeeds: {
      communication: getValue(survey1Data, 'trainingNeeds.communication') + getValue(survey2Data, 'trainingNeeds.communication'),
      decisionMaking: getValue(survey1Data, 'trainingNeeds.decisionMaking') + getValue(survey2Data, 'trainingNeeds.decisionMaking'),
      teamBuilding: getValue(survey1Data, 'trainingNeeds.teamBuilding') + getValue(survey2Data, 'trainingNeeds.teamBuilding'),
      conflictResolution: getValue(survey1Data, 'trainingNeeds.conflictResolution') + getValue(survey2Data, 'trainingNeeds.conflictResolution'),
      strategicThinking: getValue(survey1Data, 'trainingNeeds.strategicThinking') + getValue(survey2Data, 'trainingNeeds.strategicThinking'),
      other: getValue(survey1Data, 'trainingNeeds.other') + getValue(survey2Data, 'trainingNeeds.other')
    }
  };

  console.log('Successfully combined survey data');

  // Write combined data to output file
  fs.writeFileSync(outputPath, JSON.stringify(combinedData, null, 2), 'utf8');
  
  console.log('✅ Combined survey data written to:', outputPath);
  console.log('\nCombined Results:');
  console.log(JSON.stringify(combinedData, null, 2));
  
} catch (error) {
  console.error('❌ Error combining survey data:', error);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}
