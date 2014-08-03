node-ast-investigator
=====================

Tools for JS AST analysis

## ScopeChain

The main bread and butter of this library

```javascript
require('ast-investigator').ScopeChain.fromString('x + y')
```

All of the properties are the operations within a specific scope not its children or parents.
In order to determine if a reference/assignment is used outside / in children walk the chain.

```
String[] .init - names of parameters 
ASTNode? .node
ScopeChain? .parent
ScopeChain[] .children
<String, ASTNode[]> .assignments - Map of variable name to node that causes an assignmet
<String, ASTNode[]> .refs - Map of variable name to node that causes a reference **NOTE: this and assignments are separated**
<String, ASTNode[]> .vars - Map of variable name to declaration point(s)
ASTNode[] .calls 
ASTNode[] .throws
ASTNode[] .returns
ASTNode[] .breaks
ASTNode[] .evals
ASTNode[] .type - ScopeChain.SCOPE_TYPE {GLOBAL, WITH, FUNCTION, BLOCK, CATCH}
```
