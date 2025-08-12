const { execSync } = require('child_process');

console.log('🚀 Deploying Firestore Security Rules...');

try {
  // Deploy Firestore rules
  execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' });
  console.log('✅ Firestore Security Rules deployed successfully!');
} catch (error) {
  console.error('❌ Error deploying Firestore rules:', error.message);
  process.exit(1);
} 