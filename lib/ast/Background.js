'use strict';

const Step = require('./Step');
const Element = require('./Element');
const {lines, config, indent} = require('../utils');

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
     * @param {FormatConfig} [options]
     * @returns {string}
     */
    toString(options) {
        const l = lines(options);
        l.add(`${this.keyword}:${this.name ? ' ' + this.name : ''}`);
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