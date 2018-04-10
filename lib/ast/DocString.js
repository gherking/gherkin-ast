'use strict';

const {lines, replaceAll} = require('../utils');

/**
 * Model of a Cucumber DocString step argument
 * @class
 */
class DocString {
    /**
     * @constructor
     * @param {string} content The content of the DocString
     */
    constructor(content) {
        /** @member {string} */
        this.content = content;
    }

    /**
     * Parses a DocString object, based on the passed AST object.
     * @param {Object} obj
     * @returns {DocString}
     * @throws {TypeError} If the passed object is not a DocString.
     */
    static parse(obj) {
        if (!obj || obj.type !== 'DocString') {
            throw new TypeError('The given object is not a DocString!');
        }
        return new DocString(obj.content);
    }

    /**
     * Returns the Cucumber feature file
     * representative text of the DocString.
     * @param {FormatConfig} [options]
     * @returns {string}
     */
    toString(options) {
        const l = lines(options);
        l.add('"""', this.content, '"""');
        return l.toString();
    }

    replace(key, value) {
        this.content = replaceAll(this.content, key, value);
    }

    /**
     * Clones the DocString.
     * @returns {DocString}
     */
    clone() {
        return new DocString(this.content);
    }
}

module.exports = DocString;