'use strict';

const Tag = require('./Tag');
const Step = require('./Step');
const utils = require('../utils');

/**
 * Model of a Cucumber Feature element
 * @class
 */
class Element {
    /**
     * @constructor
     * @param {string} keyword The keyword of the scenario
     * @param {string} name The name of the scenario
     * @param {string} description The description of the scenario
     */
    constructor(keyword, name, description) {
        /** @member {string} */
        this.keyword = utils.normalize(keyword);
        /** @member {string} */
        this.name = utils.normalize(name);
        /** @member {string} */
        this.description = utils.normalize(description);
        /** @member {Array<Step>} */
        this.steps = [];
    }

    /**
     * Sets the keywords of all step to normal keywords,
     * i.e. Given, When, Then.
     */
    useNormalStepKeywords() {
        this.steps.forEach((step, i) => {
            if (i && ['And', 'But'].indexOf(step.keyword) > -1) {
                step.keyword = this.steps[i - 1].keyword;
            }
        });
    }

    /**
     * Sets the keywords of steps to more readable ones,
     * if applicable, i.e. replaces multiple normal keywords
     * with And keyword.
     */
    useReadableStepKeywords() {
        this.useNormalStepKeywords();
        for (let i = this.steps.length - 1; i > 0; --i) {
            if (this.steps[i].keyword === this.steps[i - 1].keyword) {
                this.steps[i].keyword = 'And';
            }
        }
    }
}

module.exports = Element;