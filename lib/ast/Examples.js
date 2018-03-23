'use strict';

const utils = require('../utils');
const Tag = require('./Tag');
const TableRow = require('./TableRow');

/**
 * Model of a Cucumber Examples table
 * @class
 */
class Examples {
    /**
     * @constructor
     * @param {string} keyword The keyword of the examples
     * @param {string} name The name of the examples
     */
    constructor(keyword, name) {
        /** @member {string} */
        this.keyword = utils.normalize(keyword);
        /** @member {string} */
        this.name = utils.normalize(name);
        /** @member {Array<Tag>} */
        this.tags = [];
        /** @member {TableRow} */
        this.header = null;
        /** @member {Array<TableRow>} */
        this.body = [];
    }

    /**
     * Parses a Examples object, based on the passed AST object.
     * @param {Object} obj
     * @returns {Examples}
     * @throws {TypeError} If the passed object is not a Examples.
     */
    static parse(obj) {
        if (!obj || obj.type !== 'Examples') {
            throw new TypeError('The given object is not an Examples!');
        }
        const examples = new Examples(obj.keyword, obj.name);
        if (obj.tableHeader) {
            examples.header = TableRow.parse(obj.tableHeader);
        }
        if (Array.isArray(obj.tags)) {
            examples.tags = obj.tags.map(tag => Tag.parse(tag));
        }
        if (Array.isArray(obj.tableBody)) {
            examples.body = obj.tableBody.map(row => TableRow.parse(row));
        }
        return examples;
    }

    /**
     * Returns the Cucumber feature file
     * representative text of the Examples.
     * @param {AssemblerConfig} [options]
     * @returns {string}
     */
    toString(options) {
        const lines = utils.lines(options);

        if (this.tags.length > 0) {
            lines.add(Tag.arrayToString(this.tags, options));
        }
        lines.add(utils.indent(`${this.keyword}: ${this.name}`));

        const table = utils.table();
        table.push(this.header.toArray());
        this.body.forEach(row => {
            table.push(row.toArray());
        });
        lines.add(utils.indent(table.toString(), 2));

        return lines.toString();
    }

    /**
     * Clones the Examples.
     * @returns {Examples}
     */
    clone() {
        const examples = new Examples(this.keyword, this.name);
        examples.header = this.header ? this.header.clone() : null;
        examples.tags = this.tags.map(tag => tag.clone());
        examples.body = this.body.map(row => row.clone());
        return examples;
    }
}

module.exports = Examples;