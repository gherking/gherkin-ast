'use strict';

/**
 * Model of a Cucumber TableCell
 * @class
 */
class TableCell {
    /**
     * @constructor
     * @param {string} value The value of the TableCell
     */
    constructor(value) {
        /** @member {string} */
        this.value = value;
    }

    /**
     * Parses a TableCell object, based on the passed AST object.
     * @param {Object} obj
     * @returns {TableCell}
     * @throws {TypeError} If the passed object is not a TableCell.
     */
    static parse(obj) {
        if (!obj || obj.type !== 'TableCell') {
            throw new TypeError('The given object is not a TableCell!');
        }
        return new TableCell(obj.value);
    }

    /**
     * Returns the Cucumber feature file
     * representative text of the TableCell.
     * @returns {string}
     */
    toString() {
        return this.value;
    }

    /**
     * Clones the TableCell.
     * @returns {TableCell}
     */
    clone() {
        return new TableCell(this.value);
    }
}

module.exports = TableCell;