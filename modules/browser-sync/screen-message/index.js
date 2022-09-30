const { readFileSync } = require('fs');
const { join } = require('path');

module.exports = {
  plugin() {},
  hooks: {
    'client:js': readFileSync(join(__dirname, 'client.js'), 'utf-8'),
  },
};
