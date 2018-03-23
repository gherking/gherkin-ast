# gherkin-ast

[![Build Status](https://travis-ci.org/szikszail/gherkin-ast.svg?branch=master)](https://travis-ci.org/szikszail/gherkin-ast) [![dependency Status](https://david-dm.org/szikszail/gherkin-ast.svg)](https://david-dm.org/szikszail/gherkin-ast) [![devDependency Status](https://david-dm.org/szikszail/gherkin-ast/dev-status.svg)](https://david-dm.org/szikszail/gherkin-ast#info=devDependencies) [![Coverage Status](https://coveralls.io/repos/github/szikszail/gherkin-ast/badge.svg?branch=master)](https://coveralls.io/github/szikszail/gherkin-ast?branch=master)

JS model for Gherkin feature files

## AST

The API provides types to be able to handle different parts of Gherkin feature files.

```javascript
'use strict';
const AST = require('gherkin-ast');
console.log(Object.keys(AST));
// Background,...,Feature,GherkinDocument,...,Tag
```

```javascript
'use strict';
const {Feature, Scenario} = require('gherkin-ast');
const feature = new Feature('Feature', 'Displaying documents');
feature.elements.push(new Scenario('Scenario', 'Opening a document'));
// ...
```

### `GherkinDocument`

Model of a complete Gherkin document, i.e. feature file.

#### Fields

  * `{Feature} feature` - The feature which this document contains.
  
#### Methods

  * `new GherkinDocument() : GherkinDocument` - Creates a new instance.
  * `{GherkinDocument}.toString({AssemblerConfig} [options]) : string` - Converts the document to string, i.e. formats it.
  * `{GherkinDocument}.clone() : GherkinDocument` - Clones the document.
  * `GherkinDocumnet.parse({Object} object) : GherkinDocument` - Parses the given [GherkinDocument object](/test/data/base.ast.json#2) to a `GherkinDocument`.

### `Feature`

Model of a Gherkin feature.

```gherkin
Feature: Hello world
  As a smo
  I want to do smth
  So that I am smth
```

#### Fields

 * `{string} keyword` - The keyword of the feature, e.g. `"Feature"`.
 * `{string} name` - The name of the feature, e.g. `"Hello world"`.
 * `{string} description` - The description of the feature, e.g. `"As a smo\nI want to do smth\nSo that I am smth"`.
 * `{string} language` - Tne of the supported [Gherkin language](https://github.com/cucumber/cucumber/wiki/Spoken-languages), default: `"en"`.
 * `{Array<Tag>} tags` - Tags of the feature.
 * `{Array<Background|Scenario|ScenarioOutline>} elements` - The elements of the feature, i.e. scenario, background or scenario outline.

#### Methods

 * `new Feature(keyword, name, description, language) : Feature` - Creates a new `Feature` object, with the given values.
 * `{Feature}.toString({AssemblerConfig}) : string` - Converts the feature to string, i.e. formats it.
 * `{Feature}.clone() : Feature` - Clones the feature.
 * `Feature.parse({Object} object) : Feature` - Parses the given [Feature object](/test/data/base.ast.json#4) to a `Feature`.

### `Background`

Model of a Gherkin Background scenario.

```gherkin
Background: Some background steps
  Given this is a given step
  And this is a given step too
  When this is a when step
  And this is a when step too
  Then it should be a then step
  And it should be a then step too
```

#### Fields

 * `{string} keyword` - The keyword of the background, e.g. `"Background"`.
 * `{string} name` - The name of the background, e.g. `"Some background steps"`.
 * `{string} description` - The description of the background.
 * `{Array<Step>} steps` - The steps of the background.

#### Methods

 * `new Background(keyword, name, description) : Background` - Creates a new `Background` object, with the given values.
 * `{Background}.useNormalStepKeywords()` - Sets the keywords of all step to normal keywords, i.e. `Given`, `When`, `Then`.
 * `{Background}.useReadableStepKeywords()` - Sets the keywords of steps to more readable ones, if applicable, i.e. replaces multiple normal keywords with `And` keyword.
 * `{Background}.toString({AssemblerConfig}) : string` - Converts the background to string, i.e. formats it.
 * `{Background}.clone() : Background` - Clones the background.
 * `Background.parse({Object} object) : Background` - Parses the given [Background object](/test/data/base.ast.json#33) to a `Background`.

### `Scenario`

Model of a Gherkin scenario.

```gherkin
@tag2 @tag3
Scenario: Name of scenario
Description of the scenario

  Given this is a given step
  And this is a given step too
```

#### Fields

 * `{string} keyword` - The keyword of the scenario, e.g. `"Scenario"`.
 * `{string} name` - The name of the scenario, e.g. `"Name of scenario"`.
 * `{string} description` - The description of the scenario, e.g. `"Description of the scenario"`.
 * `{Array<Step>} steps` - The steps of the scenario.
 * `{Array<Tag>} tags` - Tags of the scenario.

#### Methods

 * `new Scenario(keyword, name, description) : Scenario` - Creates a new `Scenario` object, with the given values.
 * `{Scenario}.useNormalStepKeywords()` - Sets the keywords of all step to normal keywords, i.e. `Given`, `When`, `Then`.
 * `{Scenario}.useReadableStepKeywords()` - Sets the keywords of steps to more readable ones, if applicable, i.e. replaces multiple normal keywords with `And` keyword.
 * `{Scenario}.toString({AssemblerConfig}) : string` - Converts the scenario to string, i.e. formats it.
 * `{Scenario}.clone() : Scenario` - Clones the scenario.
 * `Scenario.parse({Object} object) : Scenario` - Parses the given [Scenario object](/test/data/base.ast.json#98) to a `Scenario`.

### `ScenarioOutline`

Model of a Gherkin Scenario outline.

```gherkin
@tag2 @tag(3)
Scenario Outline: Name of outline <key>
  Given this is a given step
  And this is a given step too
  When this is a when step <key>
  And this is a when step too
  Then it should be a then step
  And it should be a then step too

@tagE1
  Examples: First examples
    | key    |
    | value1 |
```

#### Fields

 * `{string} keyword` - The keyword of the scenario outline, e.g. `"Scenario Outline"`.
 * `{string} name` - The name of the scenario outline, e.g. `"Name of outline <key>"`.
 * `{string} description` - The description of the scenario outline.
 * `{Array<Step>} steps` - The steps of the scenario outline.
 * `{Array<Tag>} tags` - Tags of the scenario outline.
 * `{Array<Examples>} examples` - Examples of the scenario outline.

#### Methods

 * `new ScenarioOutline(keyword, name, description) : ScenarioOutline` - Creates a new `ScenarioOutline` object, with the given values.
 * `{ScenarioOutline}.useNormalStepKeywords()` - Sets the keywords of all step to normal keywords, i.e. `Given`, `When`, `Then`.
 * `{ScenarioOutline}.useReadableStepKeywords()` - Sets the keywords of steps to more readable ones, if applicable, i.e. replaces multiple normal keywords with `And` keyword.
 * `{ScenarioOutline}.toString({AssemblerConfig}) : string` - Converts the scenario outline to string, i.e. formats it.
 * `{ScenarioOutline}.clone() : ScenarioOutline` - Clones the scenario outline.
 * `ScenarioOutline.parse({Object} object) : ScenarioOutline` - Parses the given [ScenarioOutline object](/test/data/base.ast.json#343) to a `ScenarioOutline`.
 
### `Examples`

Model of a Gherkin Scenario outline Examples table.

```gherkin
@tagE1
  Examples: First examples
    | key    |
    | value1 |
```

#### Fields

 * `{string} keyword` - The keyword of the examples table, e.g. `"Examples"`.
 * `{string} name` - The name of the examples table, e.g. `"First examples"`.
 * `{Array<Tag>} tags` - Tags of the examples table.
 * `{TableRow} header` - The header row of the examples table, with column name(s).
 * `{Array<TableRow>} body` - The data rows of the examples table.

#### Methods

 * `new Examples(keyword, name, description) : Examples` - Creates a new `Examples` object, with the given values.
 * `{Examples}.toString({AssemblerConfig}) : string` - Converts the examples table to string, i.e. formats it.
 * `{Examples}.clone() : Examples` - Clones the examples table.
 * `Examples.parse({Object} object) : Examples` - Parses the given [Examples object](/test/data/base.ast.json#426) to an `Examples`.

### `Step`

Model of a Gherkin step.

```gherkin
Given this is a given step
And this is a given step too
```

#### Fields

 * `{string} keyword` - The keyword of the step, e.g. `"Given"`.
 * `{string} text` - The text of the step, e.g. `"this is a given step"`.
 * `{DocString|DataTable} argument` - The argument of the step if there is any. It could be a `DocString` or a `DataTable`.

#### Methods

 * `new Step(keyword, text) : Step` - Creates a new `Step` object, with the given values.
 * `{Step}.toString({AssemblerConfig}) : string` - Converts the step to string, i.e. formats it.
 * `{Step}.clone() : Step` - Clones the step.
 * `Step.parse({Object} object) : Step` - Parses the given [Step object](/test/data/base.ast.json#43) to a `Step`.

### `Tag`

Model of a Gherkin tag (annotation).

```gherkin
@tag(1)
```

#### Fields

 * `{string} value` - The tag itself, e.g. `"@tag(1)"`.

#### Methods

 * `new Tag(value) : Tag` - Creates a new `Tag` object, with the given values.
 * `{Tag}.toString() : string` - Converts the tag to string, i.e. formats it.
 * `{Tag}.clone() : Tag` - Clones the tag.
 * `Tag.parse({Object} object) : Tag` - Parses the given [Tag object](/test/data/base.ast.json#7) to a `Tag`.

### `DocString`

Model of a Gherkin DocString step argument.

```gherkin
And this is a when step with doc string
  """
  Hello world
  Hello World
  hello World
  hello world
  """
```

#### Fields

 * `{string} content` - The content of the docString, e.g. `"Hello world\nHello World..."`.

#### Methods

 * `new DocString(value) : DocString` - Creates a new `DocString` object, with the given values.
 * `{DocString}.toString({AssemblerConfig}) : string` - Converts the docString to string, i.e. formats it.
 * `{DocString}.clone() : DocString` - Clones the docString.
 * `DocString.parse({Object} object) : DocString` - Parses the given [DocString object](/test/data/base.ast.json#314) to a `DocString`.

### `DataTable`

Model of a Gherkin DocString step argument.

```gherkin
And this is a when step with data table too
  | col1 | col2 |
  | val1 | val2 |
  | val3 | val4 |
```

#### Fields

 * `{Array<TableRow>} rows` - The rows of the data table.

#### Methods

 * `new DataTable(rows) : DataTable` - Creates a new `DataTable` object, with the given values.
 * `{DataTable}.toString({AssemblerConfig}) : string` - Converts the data table to string, i.e. formats it.
 * `{DataTable}.clone() : DataTable` - Clones the data table.
 * `DataTable.parse({Object} object) : DataTable` - Parses the given [DataTable object](/test/data/base.ast.json#221) to a `DataTable`.

### `TableRow`

Model of a row in Gherkin DataTable or Examples.

```gherkin
And this is a when step with data table too
  | col1 | col2 |
  | val1 | val2 |
  | val3 | val4 |
```

#### Fields

 * `{Array<TableCell>} cells` - The cells of the table row.

#### Methods

 * `new TableRow(cells) : TableRow` - Creates a new `TableRow` object, with the given values.
 * `{TableRow}.toString({AssemblerConfig}) : string` - Converts the table row to string, i.e. formats it.
 * `{TableRow}.clone() : TableRow` - Clones the table row.
 * `TableRow.parse({Object} object) : TableRow` - Parses the given [TableRow object](/test/data/base.ast.json#228) to a `TableRow`.

### `TableCell`

Model of a cell in a Gherkin TableRow.

```gherkin
And this is a when step with data table too
  | col1 | col2 |
  | val1 | val2 |
  | val3 | val4 |
```

#### Fields

 * `{string} value` - The value of the cell, e.g. `"col1"`.

#### Methods

 * `new TableCell(value) : TableCell` - Creates a new `TableCell` object, with the given values.
 * `{TableCell}.toString() : string` - Converts the table cell to string, i.e. formats it.
 * `{TableCell}.clone() : TableCell` - Clones the table cell.
 * `TableCell.parse({Object} object) : TableCell` - Parses the given [TableCell object](/test/data/base.ast.json#235) to a `TableCell`.