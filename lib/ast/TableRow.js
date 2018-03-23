'use strict';

const TableCell = require('./TableCell');
const utils = require('../utils');

/**
 * Model of a Cucumber TableRow
 * @class
 */
class TableRow {
    /**
     * @constructor
     * @param {Array<TableRow>} [cells] The cells of the row.
     */
    constructor(cells) {
        /** @member {Array<TableCell>} */
        this.cells = Array.isArray(cells) ? cells : [];
    }

    /**
     * Parses a TableRow object, based on the passed AST object.
     * @param {Object} obj
     * @returns {TableRow}
     * @throws {TypeError} If the passed object is not a TableRow.
     */
    static parse(obj) {
        if (!obj || obj.type !== 'TableRow') {
            throw new TypeError('The given object is not a TableRow!');
        }
        const row = new TableRow();
        if (Array.isArray(obj.cells)) {
            row.cells = obj.cells.map(cell => TableCell.parse(cell));
        }
        return row;
    }

    /**
     * Returns the row as the array of its cells.
     * @returns {Array<string>}
     */
    toArray() {
        return this.cells.map(cell => cell.toString());
    }

    /**
     * Returns the Cucumber feature file
     * representative text of the TableRow.
     * @returns {string}
     */
    toString() {
        const table = utils.table();
        table.push(this.toArray());
        return table.toString();
    }

    /**
     * Clones the TableRow.
     * @returns {TableRow}
     */
    clone() {
        return new TableRow(this.cells.map(cell => cell.clone()));
    }
}

module.exports = TableRow;