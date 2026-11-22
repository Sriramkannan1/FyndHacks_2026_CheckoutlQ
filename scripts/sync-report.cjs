const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, '../evidence/test-reports/test-results.json');
const destDir = path.resolve(__dirname, '../frontend/public/evidence/test-reports');
const dest = path.resolve(destDir, 'test-results.json');

try {
  if (fs.existsSync(src)) {
    fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(src, dest);
    console.log('✓ Successfully synchronized test-results.json to frontend/public/evidence/test-reports');
  } else {
    console.warn('Notice: evidence/test-reports/test-results.json not found yet.');
  }
} catch (err) {
  console.error('Error synchronizing test report:', err.message);
}
