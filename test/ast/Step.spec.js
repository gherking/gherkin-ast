'use strict';

const path = require('path');
const Step = require(path.resolve('lib/ast/Step.js'));
const DocString = require(path.resolve('lib/ast/DocString.js'));
const DataTable = require(path.resolve('lib/ast/DataTable.js'));
const TableRow = require(path.resolve('lib/ast/TableRow.js'));
const TableCell = require(path.resolve('lib/ast/TableCell.js'));

const expect = require('chai').expect;

const stepAst = {
    type: 'Step', 
    keyword: 'When ', 
    text: 'this is a when step',
    argument: {
        type: 'DocString',
        content: 'Hello\nWorld'
    }
};
        

describe('Ast.Step', () => {
    it('should represent an Ast Step instance', () => {
        const step = new Step('When ', 'this is a when step');
        expect(step).to.be.instanceOf(Step);
        expect(step.keyword).to.equal('When');
        expect(step.text).to.equal('this is a when step');
    });
    
    it('should not parse regular objects', () => {
        expect(() => Step.parse()).to.throw(TypeError);
        expect(() => Step.parse({type: 'Type'})).to.throw(TypeError);
    });
    
    it('should parse Gherkin Ast Step type to Step', () => {
        const step = Step.parse(stepAst);
        expect(step).to.be.instanceOf(Step);
        expect(step.keyword).to.equal('When');
        expect(step.text).to.equal('this is a when step');
        expect(step.argument).to.be.instanceOf(DocString);
    });

    it('should have proper string representation in case of DocString argument', () => {
        const step = new Step('When ', 'this is a when step');
        step.argument = new DocString('Hello\nWorld');
        expect(step.toString()).to.equal('When this is a when step\n  """\n  Hello\n  World\n  """');
    });

    it('should have proper string representation in case of DataTable argument', () => {
        const step = new Step('When ', 'this is a when step');
        step.argument = new DataTable([
            new TableRow([
                new TableCell('A1'),
                new TableCell('B1')
            ]),
            new TableRow([
                new TableCell('A2'),
                new TableCell('B2')
            ])
        ]);

        expect(step.toString()).to.equal('When this is a when step\n  | A1 | B1 |\n  | A2 | B2 |');
    });

    it('should have method to clone it', () => {
        const step = new Step('When ', 'this is a when step');
        step.argument = new DataTable([
            new TableRow([
                new TableCell('A1'),
                new TableCell('B1')
            ]),
            new TableRow([
                new TableCell('A2'),
                new TableCell('B2')
            ])
        ]);
        const cloned = step.clone();
        expect(step).to.not.equal(cloned);
        expect(step).to.eql(cloned);
    });
});