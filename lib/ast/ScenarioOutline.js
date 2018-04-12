'use strict';

const {lines} = require('../utils');
const Scenario = require('./Scenario');
const Examples = require('./Examples');
const Tag = require('./Tag');
const Step = require('./Step');

/**
 * Model of a Cucumber ScenarioOutline
 * @class
 */
class ScenarioOutline extends Scenario {
    /**
     * @constructor
     * @param {string} keyword The keyword of the scenario outline
     * @param {string} name The name of the scenario outline
     * @param {string} description The description of the scenario outline
     */
    constructor(keyword, name, description) {
        super(keyword, name, description);

        /** @member {Array<Examples>} */
        this.examples = [];
    }

    /**
     * Parses a Scenario Outline object, based on the passed AST object.
     * @param {Object} obj
     * @returns {ScenarioOutline}
     * @throws {TypeError} If the passed object is not a ScenarioOutline.
     */
    static parse(obj) {
        if (!obj || obj.type !== 'ScenarioOutline') {
            throw new TypeError('The given object is not a ScenarioOutline!');
        }
        const scenarioOutline = new ScenarioOutline(obj.keyword, obj.name, obj.description);
        if (Array.isArray(obj.tags)) {
            scenarioOutline.tags = obj.tags.map(tag => Tag.parse(tag));
        }
        if (Array.isArray(obj.steps)) {
            scenarioOutline.steps = obj.steps.map(step => Step.parse(step));
        }
        if (Array.isArray(obj.examples)) {
            scenarioOutline.examples = obj.examples.map(examples => Examples.parse(examples));
        }
        return scenarioOutline;
    }

    /**
     * Returns the Cucumber feature file
     * representative text of the Scenario Outline.
     * @param {FormatConfig} [options]
     * @returns {string}
     */
    toString(options) {
        const l = lines(options);
        l.add(super.toString(options));
        if (this.examples.length > 0) {
            this.examples.forEach(examples => {
                l.add(null, examples.toString(options));
            });
        }
        return l.toString();
    }

    toScenario(columnToAddAsTag = 0) {
        const scenarios = [];
        this.examples.forEach(examples => {
            const n = Math.max(0, Math.min(examples.header.cells.length  - 1, columnToAddAsTag));
            examples.body.forEach(row => {
                const scenario = new Scenario('Scenario', this.name, this.description);
                scenario.tags = [
                    ...this.tags,
                    ...examples.tags,
                    new Tag(`@${examples.header.cells[n].value}(${row.cells[n].value})`)
                ];
                scenario.steps = this.steps.map(step => step.clone());
                examples.header.cells.forEach((cell, i) => {
                    scenario.replace(`<${cell.value}>`, row.cells[i].value);
                });
                scenarios.push(scenario);
            });
        });
        return scenarios;
    }

    clone() {
        const scenario = new ScenarioOutline(this.keyword, this.name, this.description);
        scenario.tags = this.tags.map(tag => tag.clone());
        scenario.steps = this.steps.map(step => step.clone());
        scenario.examples = this.examples.map(examples => examples.clone());
        return scenario;
    }
}

module.exports = ScenarioOutline;