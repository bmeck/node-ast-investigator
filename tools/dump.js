#!/usr/bin/env node
var ScopeChain = require('../').ScopeChain;
var src = (require('fs').readFileSync(process.argv[2]));
var scope = ScopeChain.fromString(src);
console.log(require('util').inspect(scope, {depth: null, colors: true}))
