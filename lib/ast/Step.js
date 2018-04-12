'use strict';

const {indent, lines, normalize, replaceAll} = require('../utils');
const DocString = require('./DocString');
const DataTable = require('./DataTable');

/**
 * Model of a Cucumber Step
 * @class
 */
class Step {
    /**
     * @constructor
     * @param {string} keyword Keyword of the step
     * @param {string} text Text of the step
     */
    constructor(keyword, text) {
        /** @member {string} */
        this.keyword = normalize(keyword);
        /** @member {string} */
        this.text = text;
        /** @member {DocString|DataTable} */
        this.argument = null;
    }

    /**
     * Parses a Step object, based on the passed AST object.
     * @param {Object} obj
     * @returns {Step}
     * @throws {TypeError} If the passed object is not a Step.
     */
    static parse(obj) {
        if (!obj || obj.type !== 'Step') {
            throw new TypeError('The given object is not a Step!');
        }
        const step = new Step(obj.keyword, obj.text);
        if (obj.argument) {
            switch (obj.argument.type) {
                case 'DocString':
                    step.argument = DocString.parse(obj.argument);
                    break;
                case 'DataTable':
                    step.argument = DataTable.parse(obj.argument);
                    break;
            }
        }
        return step;
    }

    /**
     * Returns the Cucumber feature file
     * representative text of the Step.
     * @param {FormatConfig} [options]
     * @returns {string}
     */
    toString(options) {
        const l = lines(options);
        l.add(`${this.keyword} ${this.text}`);
        if (this.argument) {
            l.add(indent(this.argument.toString(options)));
        }
        return l.toString();
    }

    replace(key, value) {
        this.text = replaceAll(this.text, key, value);
        if (this.argument) {
            this.argument.replace(key, value);
        }
    }

    /**
     * Clones the Step.
     * @returns {Step}
     */
    clone() {
        const step = new Step(this.keyword, this.text);
        step.argument = this.argument ? this.argument.clone() : null;
        return step;
    }
}

module.exports = Step;