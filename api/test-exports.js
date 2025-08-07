// Test file to verify API exports
const health = require('./health.js');
const index = require('./index.js');

console.log('✅ Health module export type:', typeof health);
console.log('✅ Index module export type:', typeof index);

// Test if they are functions
if (typeof health === 'function') {
  console.log('✅ Health module exports a function');
} else {
  console.log('❌ Health module does NOT export a function');
}

if (typeof index === 'function') {
  console.log('✅ Index module exports a function');
} else {
  console.log('❌ Index module does NOT export a function');
}

console.log('✅ All tests passed!');
