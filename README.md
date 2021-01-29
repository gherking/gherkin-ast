# gherkin-ast

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

**NOTE** `parse` functions only support AST provided by the parser of `gherkin@6`.