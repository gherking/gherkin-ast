'use strict';

const path = require('path');
const DataTable = require(path.resolve('./lib/ast/DataTable.js'));
const TableRow = require(path.resolve('./lib/ast/TableRow.js'));
const TableCell = require(path.resolve('./lib/ast/TableCell.js'));

const expect = require('chai').expect;

describe('Ast.DataTable', () => {
    it('should represent an Ast DataTable instance', () => {
        const table = new DataTable();
        expect(table).to.be.instanceOf(DataTable);
        expect(table.rows).to.eql([]);
    });

    it('should not parse regular objects', () => {
        expect(() => DataTable.parse()).to.throw(TypeError);
        expect(() => DataTable.parse({type: 'Type'})).to.throw(TypeError);
    });

    it('should parse Gherkin Ast DataTable type to DataTable', () => {
        const table = DataTable.parse({type: 'DataTable'});
        expect(table).to.be.instanceOf(DataTable);
        expect(table.rows).to.eql([]);
    });

    it('should have proper string representation in case of empty row', () => {
        const table = new DataTable();
        expect(table.toString()).to.equal('');
    });

    it('should have proper string representation in case of non-empty row', () => {
        const table = new DataTable([
            new TableRow([
                new TableCell('A1'),
                new TableCell('B1')
            ]),
            new TableRow([
                new TableCell('A2'),
                new TableCell('B2')
            ])
        ]);
        expect(table.toString()).to.equal('| A1 | B1 |\n| A2 | B2 |');
    });

    it('should have method to clone it', () => {
        const table = new DataTable([
            new TableRow([
                new TableCell('A1'),
                new TableCell('B1')
            ]),
            new TableRow([
                new TableCell('A2'),
                new TableCell('B2')
            ])
        ]);
        const cloned = table.clone();
        expect(table).to.not.equal(cloned);
        expect(table).to.eql(cloned);
    });

    it('should have method to replace string', () => {
        const table = new DataTable([
            new TableRow([
                new TableCell('<type>1,1'),
                new TableCell('<type>1,2')
            ]),
            new TableRow([
                new TableCell('<type>2,1'),
                new TableCell('<type>2,2')
            ])
        ]);
        table.replace('<type>', 'cell')
        expect(table.toString()).to.equal('| cell1,1 | cell1,2 |\n| cell2,1 | cell2,2 |');
    });
});