const assert = require('assert');
const app = require('./app');

assert.strictEqual(typeof app, 'function', 'app should be an Express app');
console.log('Test passed');
