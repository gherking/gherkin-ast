'use strict';

const Feature = require('./Feature');

/**
 * Model of a complete Gherkin Document
 * @class
 */
class GherkinDocument {
    /**
     * @constructor
     */
    constructor() {
        /** @member {Feature} */
        this.feature = null;
    }

    /**
     * Parses a GherkinDocument object, based on the passed AST object.
     * @param {Object} obj
     * @returns {GherkinDocument}
     * @throws {TypeError} If the passed object is not a GherkinDocument.
     */
    static parse(obj) {
        if (!obj || obj.type !== 'GherkinDocument') {
            throw new TypeError('The given object is not a GherkinDocument!');
        }
        const document = new GherkinDocument();
        document.feature = obj.feature ? Feature.parse(obj.feature) : null;
        return document;
    }

    /**
     * Returns the Cucumber feature file
     * representative text of the Document.
     * @param {AssemblerConfig} options
     * @returns {string}
     */
    toString(options) {
        return this.feature.toString(options);
    }

    /**
     * Clones the GherkinDocument.
     * @returns {GherkinDocument}
     */
    clone() {
        const document = new GherkinDocument();
        document.feature = this.feature ? this.feature.clone() : null;
        return document;
    }
}

module.exports = GherkinDocument;