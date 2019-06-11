'use strict';

const {normalize, indent, lines, table} = require('../utils');
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
        this.keyword = normalize(keyword);
        /** @member {string} */
        this.name = normalize(name);
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
     * @param {FormatConfig} [options]
     * @returns {string}
     */
    toString(options) {
        const l = lines(options);

        if (this.tags.length > 0) {
            l.add(Tag.arrayToString(this.tags, options));
        }
        l.add(indent(`${this.keyword}: ${this.name}`));

        const t = table();
        t.push(this.header.toArray());
        this.body.forEach(row => {
            t.push(row.toArray());
        });
        l.add(indent(t.toString(), 2));

        return l.toString();
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