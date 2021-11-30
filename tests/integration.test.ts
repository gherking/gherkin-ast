import { Document } from "../src";
import { pruneID } from "../src/utils";

const baseAst = require("../tests/testData/base.ast.json"); // eslint-disable-line
const expectedAst = require("../tests/testData/expected.ast.json"); // eslint-disable-line

describe("E2E", () => {
    test("should translate whole Gherkin AST to AST", () => {
        const document = Document.parse(baseAst);
        expect(pruneID(document)).toEqual(expectedAst);
    });
});
