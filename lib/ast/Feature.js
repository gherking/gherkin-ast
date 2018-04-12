'use strict';

const Scenario = require('./Scenario');
const ScenarioOutline = require('./ScenarioOutline');
const Background = require('./Background');
const Tag = require('./Tag');
const {normalize, indent, lines} = require('../utils');

/**
 * Model of a Cucumber Feature
 * @class
 */
class Feature {
    /**
     * @constructor
     * @param {string} keyword The keyword of the feature
     * @param {string} name The name of the feature
     * @param {string} description The description of the feature
     * @param {string} language The language of the feature
     */
    constructor(keyword, name, description, language) {
        /** @member {string} */
        this.keyword = normalize(keyword);
        /** @member {string} */
        this.name = normalize(name);
        /** @member {string} */
        this.description = normalize(description);
        /** @member {string} */
        this.language = language || 'en';
        /** @member {Array<Tag>} */
        this.tags = [];
        /** @member {Array<Scenario|ScenarioOutline|Background>} */
        this.elements = [];
    }

    /**
     * Parses a Feature object, based on the passed AST object.
     * @param {Object} obj
     * @returns {Feature}
     * @throws {TypeError} If the passed object is not a Feature.
     */
    static parse(obj) {
        if (!obj || obj.type !== 'Feature') {
            throw new TypeError('The given object is not a Feature!');
        }
        const feature = new Feature(obj.keyword, obj.name, obj.description, obj.language);
        if (Array.isArray(obj.tags)) {
            feature.tags = obj.tags.map(tag => Tag.parse(tag));
        }
        if (Array.isArray(obj.children)) {
            feature.elements = obj.children.map(child => {
                switch (child.type) {
                    case 'Scenario':
                        return Scenario.parse(child);
                    case 'ScenarioOutline':
                        return ScenarioOutline.parse(child);
                    case 'Background':
                        return Background.parse(child);
                    default:
                        throw new TypeError(`Not supported type: ${child.type}!`);
                }
            });
        }
        return feature;
    }

    /**
     * Returns the Cucumber feature file
     * representative text of the Feature.
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
            l.add(indent(this.description));
        }
        if (this.elements.length > 0) {
            this.elements.forEach(item => {
                l.add(null, indent(item.toString(options)));
            });
        }
        return l.toString();
    }

    /**
     * Clones the Feature.
     * @returns {Feature}
     */
    clone() {
        const feature = new Feature(this.keyword, this.name, this.description, this.language);
        feature.tags = this.tags.map(tag => tag.clone());
        feature.elements = this.elements.map(element => element.clone());
        return feature;
    }
}

module.exports = Feature;