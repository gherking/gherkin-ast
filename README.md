# gherkin-ast

![Downloads](https://img.shields.io/npm/dw/gpc-template?style=flat-square)
![Version@npm](https://img.shields.io/npm/v/gpc-template?label=version%40npm&style=flat-square)
![Version@git](https://img.shields.io/github/package-json/v/gherking/gpc-template/master?label=version%40git&style=flat-square)
![CI](https://img.shields.io/github/workflow/status/gherking/gpc-template/CI/master?label=ci&style=flat-square)
![Docs](https://img.shields.io/github/workflow/status/gherking/gpc-template/Docs/master?label=docs&style=flat-square)

Models for Gherkin feature files

## AST

The API provides types to be able to handle different parts of Gherkin feature files.

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

For detailed documentation see the [TypeDocs documentation](https://gherking.github.io/gherkin-ast/).

This package uses [debug](https://www.npmjs.com/package/debug) for logging.

**NOTE** `parse` functions only support AST provided by the parser of `gherkin@6`.