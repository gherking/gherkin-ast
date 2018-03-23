'use strict';

const Step = require('./Step');
const Element = require('./Element');
const utils = require('../utils');

/**
 * Model of a Cucumber Background scenario
 * @class
 */
class Background extends Element {
    /**
     * Parses a Background object, based on the passed AST object.
     * @param {Object} obj
     * @returns {Background}
     * @throws {TypeError} If the passed object is not a Background.
     */
    static parse(obj) {
        if (!obj || obj.type !== 'Background') {
            throw new TypeError('The given object is not a Scenario!');
        }
        const background = new Background(obj.keyword, obj.name, obj.description);
        if (Array.isArray(obj.steps)) {
            background.steps = obj.steps.map(step => Step.parse(step));
        }
        return background;
    }

    /**
     * Returns the Cucumber feature file
     * representative text of the Background.
     * @param {AssemblerConfig} [options]
     * @returns {string}
     */
    toString(options) {
        const lines = utils.lines(options);
        lines.add(`${this.keyword}:${this.name ? ' ' + this.name : ''}`);
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
     * Clones the Background.
     * @returns {Background}
     */
    clone() {
        const background = new Background(this.keyword, this.name, this.description);
        background.steps = this.steps.map(step => step.clone());
        return background;
    }
}

module.exports = Background;