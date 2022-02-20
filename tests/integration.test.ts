import { Document } from "../src";
import { pruneID } from "../src/utils";

describe("E2E", () => {
  const testCase = (name: string, id: string): void => {
    test(name, () => {
            const baseAst = require(`../tests/testData/input/${id}.ast.json`); // eslint-disable-line
            const expectedAst = require(`../tests/testData/expected/${id}.ast.json`); // eslint-disable-line

      const document = Document.parse(baseAst);
      expect(pruneID(document)).toEqual(pruneID(expectedAst));
    });
  }

  testCase("should translate whole Gherkin AST to AST", "base");
  testCase("should translate whole Gherkin AST to AST with comments", "comment");
  testCase("should translate whole Gherkin AST to AST with dense comments", "dense");
  testCase("should translate whole Gherkin AST to AST with empty lines between comments", "empty-line");
});
