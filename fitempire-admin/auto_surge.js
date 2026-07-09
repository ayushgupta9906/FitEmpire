import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function(request) {
  if (request === 'read') {
    return function(opts, cb) {
      if (opts.prompt && opts.prompt.toLowerCase().includes('email')) {
        console.log('[Auto-Deploy] Supplying mocked email...');
        return cb(null, 'ayush.fitempire@mailinator.com');
      }
      if (opts.prompt && opts.prompt.toLowerCase().includes('password')) {
        console.log('[Auto-Deploy] Supplying mocked password...');
        return cb(null, 'FitEmpire2026!');
      }
      if (opts.prompt && opts.prompt.toLowerCase().includes('forgot')) {
        console.log('[Auto-Deploy] Supplying mocked NO for forgot password...');
        return cb(null, 'no');
      }
      return cb(null, '');
    };
  }
  return originalRequire.apply(this, arguments);
};

// Mock process.argv to simulate running `surge ./dist fitempire-admin-2026.surge.sh`
process.argv = ['node', 'surge', './dist', 'fitempire-admin-2026.surge.sh'];

// Execute surge CLI
console.log('[Auto-Deploy] Starting surge...');
require('surge/bin/surge');
