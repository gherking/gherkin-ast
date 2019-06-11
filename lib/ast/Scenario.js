'use strict';

const Tag = require('./Tag');
const Step = require('./Step');
const Element = require('./Element');
const {replaceAll, lines, config, indent} = require('../utils');

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
        const l = lines(options);
        if (this.tags.length > 0) {
            l.add(Tag.arrayToString(this.tags, options));
        }
        l.add(`${this.keyword}: ${this.name}`);
        if (this.description) {
            l.add(this.description, null);
        }
        if (this.steps.length > 0) {
            const addGroups = config(options).separateStepGroups;
            if (addGroups) {
                this.useReadableStepKeywords();
            }
            this.steps.forEach(step => {
                if (addGroups && step.keyword === 'When') {
                    l.add();
                }
                l.add(indent(step.toString(options)));
            });
        }
        return l.toString();
    }

    replace(key, value) {
        this.name = replaceAll(this.name, key, value);
        this.description = replaceAll(this.description, key, value);
        this.steps.forEach(step => {
            step.replace(key, value);
        });
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