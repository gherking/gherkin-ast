'use strict';

const Tag = require('./Tag');
const Step = require('./Step');
const Element = require('./Element');
const utils = require('../utils');

/**
 * Model of a Cucumber Scenario
 * @class
 */
class Scenario extends Element {
    /**
     * @constructor
     * @param {string} keyword The keyword of the scenario
     * @param {string} name The name of the scenario
     * @param {string} description The description of the scenario
     */
    constructor(keyword, name, description) {
        super(keyword, name, description);

        /** @member {Array<Tag>} */
        this.tags = [];
    }

    /**
     * Parses a Scenario object, based on the passed AST object.
     * @param {Object} obj
     * @returns {Scenario}
     * @throws {TypeError} If the passed object is not a Scenario.
     */
    static parse(obj) {
        if (!obj || obj.type !== 'Scenario') {
            throw new TypeError('The given object is not a Scenario!');
        }
        const scenario = new Scenario(obj.keyword, obj.name, obj.description);
        if (Array.isArray(obj.tags)) {
            scenario.tags = obj.tags.map(tag => Tag.parse(tag));
        }
        if (Array.isArray(obj.steps)) {
            scenario.steps = obj.steps.map(step => Step.parse(step));
        }
        return scenario;
    }

    /**
     * Returns the Cucumber feature file
     * representative text of the Scenario.
     * @param {FormatConfig} [options]
     * @returns {string}
     */
    toString(options) {
        const lines = utils.lines(options);
        if (this.tags.length > 0) {
            lines.add(Tag.arrayToString(this.tags, options));
        }
        lines.add(`${this.keyword}: ${this.name}`);
        if (this.description) {
            lines.add(this.description, null);
        }
        if (this.steps.length > 0) {
            const addGroups = utils.config(options).separateStepGroups;
            if (addGroups) {
                this.useReadableStepKeywords();
            }
            this.steps.forEach(step => {
                if (addGroups && step.keyword === 'When') {
                    lines.add();
                }
                lines.add(utils.indent(step.toString(options)));
            });
        }
        return lines.toString();
    }

    /**
     * Clones the Scenario.
     * @returns {Scenario}
     */
    clone() {
        const scenario = new Scenario(this.keyword, this.name, this.description);
        scenario.tags = this.tags.map(tag => tag.clone());
        scenario.steps = this.steps.map(step => step.clone());
        return scenario;
    }
}

module.exports = Scenario;