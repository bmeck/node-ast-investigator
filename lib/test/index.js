const ScopeChain = require('../../').ScopeChain;
const fs = require('fs');
const path = require('path');
const assert = require('assert');

{
  const prog_scope = scopeForSrc('if');
  const if_scope = prog_scope.children[0];
  const if_block_scope = if_scope.children[0];
  assert.equal(if_block_scope.children.length, 2);
  const if_fnd_scope = if_block_scope.children[0];
  const if_fne_scope = if_block_scope.children[1];
  const else_block_scope = if_scope.children[1];
  const else_fnd_scope = else_block_scope.children[0];
  assert.equal(prog_scope.type, ScopeChain.SCOPE_TYPE.GLOBAL);
  assert.equal(if_scope.type, ScopeChain.SCOPE_TYPE.BLOCK);
  assert.equal(if_block_scope.type, ScopeChain.SCOPE_TYPE.BLOCK);
  assert.equal(if_fnd_scope.type, ScopeChain.SCOPE_TYPE.FUNCTION);
  assert.equal(if_fne_scope.type, ScopeChain.SCOPE_TYPE.FUNCTION);
  assert.equal(else_block_scope.type, ScopeChain.SCOPE_TYPE.BLOCK);
  assert.equal(prog_scope.vars.in_if[0], if_fnd_scope.node);
  assert.equal(prog_scope.vars.in_if[1].init, if_fne_scope.node);
  assert.equal(prog_scope.vars.in_if[2], else_fnd_scope.node);
  assert.equal(prog_scope.vars.in_if[3].init, undefined);
}

{
  const prog_scope = scopeForSrc('expr');
  assert.equal(prog_scope.children.length, 0);
  assert(prog_scope.assignments.global_assign[0]);
  assert(prog_scope.vars.local_declare[0].init);
}

{
  const prog_scope = scopeForSrc('for-in');
  assert.equal(prog_scope.children.length, 1);
  const forin_block_scope = prog_scope.children[0];
  assert.equal(forin_block_scope.children.length, 0);
}

{
  const prog_scope = scopeForSrc('for-of');
  assert.equal(prog_scope.children.length, 1);
  const forof_block_scope = prog_scope.children[0];
  assert.equal(forof_block_scope.children.length, 0);
}

{
  const prog_scope = scopeForSrc('block-scope');
  assert.equal(prog_scope.children.length, 2);
  const for_scope = prog_scope.children[0];
  assert(for_scope.vars.x);
  assert.equal(for_scope.assignments.x.length, 1);
  assert.equal(for_scope.refs.x.length, 2);
}

{
  const prog_scope = scopeForSrc('arrow-fn');
  assert.equal(prog_scope.children.length, 2);
  const short_body_scope = prog_scope.children[0];
  const block_body_scope = prog_scope.children[1];
  assert.equal(Object.keys(short_body_scope.assignments).length, 0);
  assert.equal(Object.keys(block_body_scope.assignments).length, 0);
}

{
  const prog_scope = scopeForSrc('concise-method');
  assert.equal(prog_scope.children.length, 1);
  const method_scope = prog_scope.children[0];
  assert.equal(Object.keys(method_scope.vars).length, 2);
  assert.equal(method_scope.vars.a, undefined);
}

{
  const prog_scope = scopeForSrc('generator-fn');
  assert.equal(prog_scope.children.length, 2);
  const concise_gn_scope = prog_scope.children[0];
  const gn_scope = prog_scope.children[1];
  // concise methods do not allow self references
  assert.equal(Object.keys(concise_gn_scope.vars).length, 2);
  assert.equal(Object.keys(gn_scope.vars).length, 3);
}

function scopeForSrc(name) {
  const file = path.join(__dirname, 'fixtures', `${name}.src`);
  const src = fs.readFileSync(file);
  const prog_scope = ScopeChain.fromString(src);
  return prog_scope;
}

