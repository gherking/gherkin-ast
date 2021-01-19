# Changelog

## 3.0.0 - 2021-01-19

### Breaking changed

Added support for normal and parametirized tags:

- Normal tag, e.g. `@tag` same as `new Tag("tag")`
- Parametirized tag, e.g. `@suite(smoke)` same as `new Tag("suite", "smoke")`

All methods of a tag work with both type of tags. Also added `Tag.parseString(string)` to be able to parse a tag string to any of the above type of tags.

## 2.1.0 - 2019-09-10

### Added

- Added `Rule`
- Added keywords for certain types

## 2.0.0 - 2019-06-26

### BREAKING CHANGES

Refactored API and models:
 - All formatting of the model is removed and moved to `gherkin-formatter`
 - Most additional logic is removed from models, only `replace` and `clone` remain, and `ScenarioOutline`'s function to expand it to `Scenario`s
 - All model available through the root of the package, e.g. `import {Feature} from "gherkin-ast"` or `const {Feature} = require("gherkin-ast")`

### Added

- Added TS documentation to GitHub Pages.

### Changed

- Using TypeScript, so that `.d.ts` is available for better IDE and TypeScript support.

## 1.1.0 - 2018-04-12

### Added

- Added `replace` method to `Step`, `Scenario`, `TableCell`, `TableRow`, `DocString` and `DataTable`.
- Added `toScenario` method to `ScenarioOutline`.

## 1.0.1 - 2018-03-23

### Fixed

- Fixed documentation

## 1.0.0 - 2018-03-23

### Added

- Moved AST from gherkin-assembler to gherkin-ast
