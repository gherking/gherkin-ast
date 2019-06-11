# Changelog

## TODO

- Laci: Update README
- Sanyi: E2E test
- Juci: Doksi comments

## 2.0.0 - ???

### Breaking change

Refactored API
 - All formatting or additional logic is removed from models, only `replace` and `clone` remain, except `ScenarioOutline` where it can be still expanded to `Scenario`s
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
