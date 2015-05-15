const ScopeChain = require('../../').ScopeChain;
const fs = require('fs');
const path = require('path');

function scopeForFn(fn) {
  const src = Function.prototype.toString.call(fn);
  const prog_scope = ScopeChain.fromString(src);
  return prog_scope.children[0];
}
function range_str(range) {
  return `${range.line}:${range.column}`;
}
function loc_str(loc) {
  const start = loc.start;
  const end = loc.end;
  return `${range_str(start)} to ${range_str(end)}`;
}
function impure_assign() {
  x = 1;
  x = 2;
  x.y = 2;
  x();
  x.y();
}

const scope = scopeForFn(impure_assign);
function impurities(scope) {
  for (const name of Object.keys(scope.assignments)) {
    if (!scope.vars[name]) {
      for (const node of scope.assignments[name]) {
        const loc = node.loc;
        console.log(`impure assignment to ${name} at ${loc_str(loc)}`);
      }
    }
  }
  for (const name of Object.keys(scope.refs)) {
    if (!scope.vars[name]) {
      for (const node of scope.refs[name]) {
        const loc = node.loc;
        console.log(`impure reference of ${name} at ${loc_str(loc)}`);
      }
    }
  }
}
impurities(scope);
