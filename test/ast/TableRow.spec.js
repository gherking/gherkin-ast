'use strict';

const path = require('path');
const TableRow = require(path.resolve('./lib/ast/TableRow.js'));
const TableCell = require(path.resolve('./lib/ast/TableCell.js'));

const expect = require('chai').expect;

describe('Ast.TableRow', () => {
    it('should represent an Ast TableRow instance', () => {
        const row = new TableRow();
        expect(row).to.be.instanceOf(TableRow);
        expect(row.cells).to.eql([]);
    });
    
    it('should not parse regular objects', () => {
        expect(() => TableRow.parse()).to.throw(TypeError);
        expect(() => TableRow.parse({type: 'Type'})).to.throw(TypeError);
    });
    
    it('should parse Gherkin Ast TableRow type to TableRow', () => {
        const row = TableRow.parse({type: 'TableRow'});
        expect(row).to.be.instanceOf(TableRow);
        expect(row.cells).to.eql([]);
    });

    it('should have proper array representation in case of empty row', () => {
        const row = new TableRow();
        expect(row.toArray()).to.eql([]);
    });

    it('should have proper array representation in case of non-empty row', () => {
        const row = new TableRow([
            new TableCell('A1'),
            new TableCell('B1')
        ]);
        expect(row.toArray()).to.eql(['A1', 'B1']);
    });

    it('should have proper string representation in case of empty row', () => {
        const row = new TableRow();
        expect(row.toString()).to.equal('');
    });

    it('should have proper string representation in case of non-empty row', () => {
        const row = new TableRow([
            new TableCell('A1'),
            new TableCell('B1')
        ]);
        expect(row.toString()).to.equal('| A1 | B1 |');
    });

    it('should have method to clone it', () => {
        const row = new TableRow([
            new TableCell('A1'),
            new TableCell('B1')
        ]);
        const cloned = row.clone();
        expect(row).to.not.equal(cloned);
        expect(row).to.eql(cloned);
    });
});