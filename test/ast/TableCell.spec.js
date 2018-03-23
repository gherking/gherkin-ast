'use strict';

const path = require('path');
const TableCell = require(path.resolve('./lib/ast/TableCell.js'));

const expect = require('chai').expect;

describe('Ast.TableCell', () => {
    it('should represent an Ast TableCell instance', () => {
        const cell = new TableCell('value');
        expect(cell).to.be.instanceOf(TableCell);
        expect(cell.value).to.equal('value');
    });
    
    it('should not parse regular objects', () => {
        expect(() => TableCell.parse()).to.throw(TypeError);
        expect(() => TableCell.parse({type: 'Type'})).to.throw(TypeError);
    });
    
    it('should parse Gherkin Ast TableCell type to TableCell', () => {
        const cell = TableCell.parse({type: 'TableCell', value: 'value'});
        expect(cell).to.be.instanceOf(TableCell);
        expect(cell.value).to.equal('value');
    });

    it('should have proper string representation', () => {
        const cell = new TableCell('value');
        expect(cell.toString()).to.equal('value');
    });

    it('should have method to clone it', () => {
        const cell = new TableCell('value');
        const cloned = cell.clone();
        expect(cell).to.not.equal(cloned);
        expect(cell).to.eql(cloned);
    });
});