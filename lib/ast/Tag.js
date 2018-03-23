'use strict';

const utils = require('../utils');

/**
 * Model of a Cucumber Tag (annotation)
 * @class
 */
class Tag {
    /**
     * @constructor
     * @param {string} name Name of the tag, e.g. @current
     */
    constructor(name) {
        /** @member {string} */
        this.name = name;
    }

    /**
     * Parses a Tag object, based on the passed AST object.
     * @static
     * @param {Object} obj
     * @returns {Tag}
     * @throws {TypeError} If the passed object is not a Tag.
     */
    static parse(obj) {
        if (!obj || obj.type !== 'Tag') {
            throw new TypeError('The given object is not a Tag!');
        }
        return new Tag(obj.name);
    }

    /**
     * Returns the Cucumber feature file
     * representative text of the Tag.
     * @returns {string}
     */
    toString() {
        return this.name;
    }

    /**
     * Clones the Tag.
     * @returns {Tag}
     */
    clone() {
        return new Tag(this.name);
    }

    /**
     * Returns the Cucumber feature file
     * representative text of a Tag set.
     * @param {Array<Tag>} tags
     * @param {AssemblerConfig} [options]
     * @returns {string}
     */
    static arrayToString(tags, options) {
        options = utils.config(options);
        if (!options.oneTagPerLine) {
            return tags.join(' ');
        }
        const lines = utils.lines(options);
        tags.forEach(tag => {
            lines.add(tag.toString());
        });
        return lines.toString();
    }
}

module.exports = Tag;