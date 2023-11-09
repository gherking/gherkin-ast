# gherkin-ast

![Downloads](https://img.shields.io/npm/dw/gherkin-ast?style=flat-square)
![Version@npm](https://img.shields.io/npm/v/gherkin-ast?label=version%40npm&style=flat-square)
![Version@git](https://img.shields.io/github/package-json/v/gherking/gherkin-ast/master?label=version%40git&style=flat-square)
![CI](https://img.shields.io/github/actions/workflow/status/gherking/gherkin-ast/ci.yml?branch=master&label=ci&style=flat-square)
![Docs](https://img.shields.io/github/actions/workflow/status/gherking/gherkin-ast/docs.yml?branch=master&label=docs&style=flat-square)

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

### Components

The following components are available to work with the Gherkin feature files in code:

- [Document](src/ast/gherkinDocument.ts)
- [Feature](src/ast/feature.ts)
- [Rule](src/ast/rule.ts)
- [Background](src/ast/background.ts)
- [Scenario](src/ast/scenario.ts)
- [ScenarioOutline](src/ast/scenarioOutline.ts)
- [Examples](src/ast/examples.ts)
- [Step](src/ast/step.ts)
- [Tag](src/ast/tag.ts)
- [DataTable](src/ast/dataTable.ts)
- [DocString](src/ast/docString.ts)
- [TableRow](src/ast/tableRow.ts)
- [TableCell](src/ast/tableCell.ts)
- [Comment](src/ast/comment.ts)

### Comments

> Comments are only permitted at the start of a new line, anywhere in the feature file. They begin with zero or more spaces, followed by a hash sign (#) and some text.
> (https://cucumber.io/docs/gherkin/reference/)

Although comments can be written in basically any place in Gherkin, AST only supports **semantic comments** in the feature files because of technical limitations and integration in the whole **GherKing flow** *(parsing, AST, processing, formatting)*.

The following semantic comments are supported:

| Name                    | Description                                                                                                                                                               | Empty lines supported |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------- |
| **Before tags comment** | For objects with tags, the comment right before the tags.                                                                                                                 | No                    |
| **Preceding comment**   | For objects with a keyword, the comment right before the line of the keyword until the previous element.                                                                  | Yes                   |
| **Description comment** | For objects with a possible description, the comment between the description and the first element (not including before tag and preceding comment of the first element). | Yes                   |
| **Tag comment**         | For tags, the comment right above the tag; **note**, the first comment cannot have a tag, it is considered a **before tags comment**.                                     | No                    |
| **Row comment**         | For data table and example rows, the comment between the current and previous row (or element).                                                                           | Yes                   |
| **DocString comment**   | For docstrings, the comment between the docstring and the step.                                                                                                           | Yes                   |
| **Step comment**        | For steps, the comment between the current and the previous step (or its parameters).                                                                                     | Yes                   |
| **Start comment**       | All the comment, at the start of the feature file, before the tag or the tag comments for the feature.                                                                    | Yes                   |
| **End comment**         | All the comment, at the end of the feature file, after the last step or example row.                                                                                      | Yes                   |

**Note**, that for comments, where empty lines are not supported, one comment is fron the subject object, backwards until the first empty line.

The following example should explain the **semantic comments** better:

```gherkin
# Start comment(s) of the Document

# Before tags comment of the Feature
@tag1 @tag2
# Tag comment of @tag3 Tag
@tag3
# Preceding comment of the Feature
Feature: Name

  This is a multiline
  Feature description

  # Description comment of the Feature

  # Before tags comment of the Rule
  @tag1 @tag2
  # Preceding comment of the Rule
  Rule: Name

    This is a multiline
    Rule description

    # Description comment of the Rule

    # Preceding comment of the Background
    Background: Name

      This is a multiline
      Background description

      # Description comment of the Background

      # Comment of the given step
      Given step
      # Comment of the when step
      When step
      # Comment of the then step
      Then step

    # Before tags comment of the Scenario
    @tag1 @tag2
    # Preceding comment of the Scenario
    Scenario: Name

      This is a multiline
      Scenario description

      # Description comment of the Scenario

      # Comment of the given step
      Given step
        # Comment of the docstirng
        """
        docstring
        other docstring
        """
      # Comment of the when step
      When step
        # Comment of the data table row
        | data  | table |
        # Comment of the data table row
        | value | value |
        # Comment of the data table row
        | value | value |
      # Comment of the then step
      Then step
        """markdown
        title
        =====
        docstring with content type
        """
      And step
        ```markdown
        docstring with backtick and content type
        ```

    # Before tags comment of the ScenarioOutline
    @tag1 @tag2
    # Preceding comment of the ScenarioOutline
    Scenario Outline: Name

      This is a multiline
      ScenarioOutline description

      # Description comment of the ScenarioOutline

      Given step <v>
      When step <w>

      # Before tags comment of the Examples
      @tag1 @tag2
      # Preceding comment of the Examples
      Examples: Name
        # Comment of the examples table row
        | v | w |
        # Comment of the examples table row
        | 1 | 2 |
        # Comment of the examples table row
        | 2 | 3 |

# End comment(s) of the Document
```

### Meta information

All components support parsing them from a Gherkin Document. On top of that, certain of the components, also support parsing meta information, e.g. tags in Gherkin are simple strings, but during practical usage tags can be parametrized, thus `Tag` support having both name and value, and it is parsed.

The following components have meta information parsed:

#### Tags

As mentioned in the example, tags in Gherkin are simple strings. However, in practical usage, we often used parametrized tags, e.g., `@suite(sanity)` where the name of the tag is `suite` and the value is `sanity`.

Tag meta information parsing supports the following parametrized tag formats:

1. **Functional**: `@name(value)` (default), the name is `name`, the value is `value`
2. **Assignment**: `@name=value`, the name is `name`, the value is `value`
3. **Underscore**: `@name_value`, the name is `name`, the value is `value`
4. **Parameterless**: this basically means that no value will be parsed, the tag will be handled as a simple string, so in any case the name will be the whole tag, e.g., for `@name(value)` the name of the tag will be `name(value)`, the value is undefined

To set the which format should be used, use the `config(...)` function:

```javascript
const {config, TagFormat, Tag} = require('gherkin-ast');

config({
  tagFormat: TagFormat.ASSIGNMENT,
});
const tag = Tag.parseString("@name=value");
console.log(tag.name); // name
console.log(tag.value); // value
console.log(tag.toString()); // @name=value
```

## Other

This package uses [debug](https://www.npmjs.com/package/debug) for logging, use `gherkin-ast` :

```shell
DEBUG=gherkin-ast* gherking ...
```

For detailed documentation see the [TypeDocs documentation](https://gherking.github.io/gherkin-ast/).