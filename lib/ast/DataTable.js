'use strict';

const {table, lines} = require('../utils');
const TableRow = require('./TableRow');

/**
 * Model of a Cucumber DataTable step argument
 * @class
 */
class DataTable {
    /**
     * @constructor
     * @param {Array<TableRow>} [rows] The rows of the table.
     */
    constructor(rows) {
        /** @member {Array<TableRow>} */
        this.rows = Array.isArray(rows) ? rows : [];
    }

    /**
     * Parses a DataTable object, based on the passed AST object.
     * @param {Object} obj
     * @returns {DataTable}
     * @throws {TypeError} If the passed object is not a DataTable.
     */
    static parse(obj) {
        if (!obj || obj.type !== 'DataTable') {
            throw new TypeError('The given object is not a DocString!');
        }
        const table = new DataTable();
        if (Array.isArray(obj.rows)) {
            table.rows = obj.rows.map(row => TableRow.parse(row));
        }
        return table;
    }

    /**
     * Returns the Cucumber feature file
     * representative text of the DataTable.
     * @param {FormatConfig} [options]
     * @returns {string}
     */
    toString(options) {
        const t = table();
        this.rows.forEach(row => {
            t.push(row.toArray());
        });
        const l = lines(options);
        l.add(t.toString());
        return l.toString();
    }

    replace(key, value) {
        this.rows.forEach(row => {
            row.replace(key, value);
        });
    }

    /**
     * Clones the DataTable.
     * @returns {DataTable}
     */
    clone() {
        return new DataTable(this.rows.map(row => row.clone()));
    }
}

module.exports = DataTable;