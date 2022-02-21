# gherkin-ast

![Downloads](https://img.shields.io/npm/dw/gherkin-ast?style=flat-square)
![Version@npm](https://img.shields.io/npm/v/gherkin-ast?label=version%40npm&style=flat-square)
![Version@git](https://img.shields.io/github/package-json/v/gherking/gherkin-ast/master?label=version%40git&style=flat-square)
![CI](https://img.shields.io/github/workflow/status/gherking/gherkin-ast/CI/master?label=ci&style=flat-square)
![Docs](https://img.shields.io/github/workflow/status/gherking/gherkin-ast/Docs/master?label=docs&style=flat-square)

Models for Gherkin feature files

## AST (Abstract Syntax Tree)

The API provides types to handle different parts of Gherkin feature files.

In TypeScript:
```typescript
import {Feature, Scenario /*, Background, ... */} from "gherkin-ast";
```

OR in JavaScript:
```javascript
const {Feature, Scenario /*, Background, ... */} = require("gherkin-ast");
const feature = new Feature("Feature", "Displaying documents");
feature.elements.push(new Scenario("Scenario", "Opening a document"));
// ...
```

## Other

This package uses [debug](https://www.npmjs.com/package/debug) for logging, use `gherkin-ast` :

```shell
DEBUG=gherkin-ast* gherking ...
```

For detailed documentation see the [TypeDocs documentation](https://gherking.github.io/gpc-for-loop/).