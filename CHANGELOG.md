# Changelog

## 3.3.1 - 2022-10-15

### Fixed

* Fixed comments with missing `#`

## 3.3.0 - 2022-03-04

### Added

* Added support for Gherkin Comments
* Added support for Media Type in DocStrings
* Added support for filename/location in Gherkin Document (for further use in GherKing)
* Added `debug`

## 3.2.1 - 2021-11-30

### Added

* Published `pruneID` utility

## 3.2.0 - 2021-11-13

### Added

* Added unique ID to all AST objects (`_id`)

## 3.1.0 - 2021-09-20

### Added

* Added support for tags in Rules ([#22](https://github.com/gherking/gherkin-ast/issues/22))

## 3.0.3 - 2021-09-17

### Fixed

* Fixed empty cell issue ([#29](https://github.com/gherking/gherkin-ast/issues/29))

## 3.0.2 - 2021-02-10

### Fixed

* Fixed Scenario parsing issue ([#19](https://github.com/gherking/gherkin-ast/issues/19))

## 3.0.1 - 2021-01-29

### Added

* Integration with Github Actions

## 3.0.0 - 2021-01-19

### Breaking changed

Added support for normal and parametirized tags:

* Normal tag, e.g. `@tag` same as `new Tag("tag")`
* Parametirized tag, e.g. `@suite(smoke)` same as `new Tag("suite", "smoke")`

All methods of a tag work with both type of tags. Also added `Tag.parseString(string)` to be able to parse a tag string to any of the above type of tags.

## 2.1.0 - 2019-09-10

### Added

* Added `Rule`
* Added keywords for certain types

## 2.0.0 - 2019-06-26

### BREAKING CHANGES

Refactored API and models:
 - All formatting of the model is removed and moved to `gherkin-formatter`

 - Most additional logic is removed from models, only `replace` and `clone` remain, and `ScenarioOutline` 's function to expand it to `Scenario` s
 - All model available through the root of the package, e.g. `import {Feature} from "gherkin-ast"` or `const {Feature} = require("gherkin-ast")`

### Added

* Added TS documentation to GitHub Pages.

### Changed

* Using TypeScript, so that `.d.ts` is available for better IDE and TypeScript support.

## 1.1.0 - 2018-04-12

### Added

* Added `replace` method to `Step`,  `Scenario`,  `TableCell`,  `TableRow`,  `DocString` and `DataTable`.
* Added `toScenario` method to `ScenarioOutline`.

## 1.0.1 - 2018-03-23

### Fixed

* Fixed documentation

## 1.0.0 - 2018-03-23

### Added

* Moved AST from gherkin-assembler to gherkin-ast
