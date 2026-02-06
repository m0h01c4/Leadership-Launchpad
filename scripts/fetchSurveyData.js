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

  // Combine the data by adding numeric values
  const combinedData = {
    trainingAttended: {
      newLeaders: survey1Data.trainingAttended.newLeaders + survey2Data.trainingAttended.newLeaders,
      leadingIndividualContributors: survey1Data.trainingAttended.leadingIndividualContributors + survey2Data.trainingAttended.leadingIndividualContributors,
      leadingLeaders: survey1Data.trainingAttended.leadingLeaders + survey2Data.trainingAttended.leadingLeaders
    },
    effectiveness: {
      veryEffective: survey1Data.effectiveness.veryEffective + survey2Data.effectiveness.veryEffective,
      somewhatEffective: survey1Data.effectiveness.somewhatEffective + survey2Data.effectiveness.somewhatEffective,
      neutral: survey1Data.effectiveness.neutral + survey2Data.effectiveness.neutral,
      somewhatIneffective: survey1Data.effectiveness.somewhatIneffective + survey2Data.effectiveness.somewhatIneffective,
      neitherEffectiveNorIneffective: survey1Data.effectiveness.neitherEffectiveNorIneffective + survey2Data.effectiveness.neitherEffectiveNorIneffective
    },
    trainingNeeds: {
      communication: survey1Data.trainingNeeds.communication + survey2Data.trainingNeeds.communication,
      decisionMaking: survey1Data.trainingNeeds.decisionMaking + survey2Data.trainingNeeds.decisionMaking,
      teamBuilding: survey1Data.trainingNeeds.teamBuilding + survey2Data.trainingNeeds.teamBuilding,
      conflictResolution: survey1Data.trainingNeeds.conflictResolution + survey2Data.trainingNeeds.conflictResolution,
      strategicThinking: survey1Data.trainingNeeds.strategicThinking + survey2Data.trainingNeeds.strategicThinking,
      other: survey1Data.trainingNeeds.other + survey2Data.trainingNeeds.other
    }
  };

  console.log('Successfully combined survey data');

  // Write combined data to output file
  fs.writeFileSync(outputPath, JSON.stringify(combinedData, null, 2), 'utf8');
  
  console.log('✅ Combined survey data written to:', outputPath);
  console.log('\nCombined Results:');
  console.log(JSON.stringify(combinedData, null, 2));
  
} catch (error) {
  console.error('❌ Error combining survey data:', error.message);
  process.exit(1);
}
