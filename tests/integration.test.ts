import { Document } from "../src";

const baseAst = require("../tests/testData/base.ast.json");
const expectedAst = require("../tests/testData/expected.ast.json");

describe("E2E", () => {

    test("should translate whole Gherkin AST to AST", () => {
        const document = Document.parse(baseAst);
        expect(document).toEqual(expectedAst);
    });
});
