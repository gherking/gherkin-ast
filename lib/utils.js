'use strict';

const split = require('split-lines');
const Table = require('cli-table');
const colors = require('colors/safe');

/**
 * @class
 * @extends Table
 */
class StrippedTable extends Table {
    constructor(config) {
        super(config);
    }

    toString() {
        return colors.strip(super.toString());
    }
}

/**
 * @typedef {Object} AssemblerConfig
 * @property {boolean} oneTagPerLine Should tags be rendered one per line?
 * @property {boolean} compact Should empty lines be added?
 * @property {boolean} separateStepGroups Should step groups (when-then) be separated?
 * @property {string} lineBreak The linebreak character(s)
 * @property {string} indentation The indentation character(s)
 */

/** @type {AssemblerConfig} */
const DEFAULT_OPTIONS = {
    oneTagPerLine: false,
    compact: false,
    separateStepGroups: false,
    lineBreak: '\n',
    indentation: '  '
};

const INDENTATION = '  ';

/**
 * Object to build a text file, from lines.
 * @class
 */
class Lines {
    /**
     * @constructor
     * @param {AssemblerConfig} [options]
     */
    constructor(options) {
        /** @member {boolean} */
        this.options = utils.config(options);
        /**
         * @type {Array<string>}
         * @private
         */
        this._lines = [];
    }

    /**
     * Adds a new line with the given text.
     * If the text is not passed,
     * it will be an empty line
     * @param {...string|*} [texts]
     */
    add(...texts) {
        if (!texts.length) {
            this._lines.push('');
        } else {
            texts.forEach(text => {
                this._lines.push.apply(this._lines, split(text || ''));
            });
        }
    }

    /**
     * Indents all non-empty lines with the given number of indentation.
     * @param {number} [indentation] Number of indentations, default: 1
     */
    indent(indentation = 1) {
        indentation = Math.max(indentation, 0);
        if (indentation) {
            this._lines = this._lines.map(line => {
                return line ? INDENTATION.repeat(indentation) + line : '';
            });
        }
    }

    /**
     * Normalizes the given text,
     * i.e. trims multiple trailing, leading
     * and inner spaces too.
     */
    normalize() {
        this._lines = this._lines.map(line => line.trim().replace(/\s+/g, ' '));
    }

    /**
     * Returns the whole text file content.
     * @returns {string}
     */
    toString() {
        let lines = this._lines;
        if (this.options.compact) {
            lines = lines.filter(Boolean);
        }
        return lines.join(this.options.lineBreak);
    }
}

const utils = {
    /**
     * Indents the given text with
     * given number of space pairs.
     * @param {string} text Text to indent
     * @param {number} [indentation] Number of indentations, default: 1
     * @returns {string}
     */
    indent(text, indentation = 1) {
        const lines = utils.lines();
        lines.add(text);
        lines.indent(indentation);
        return lines.toString();
    },

    /**
     * Normalizes the given text,
     * i.e. trims multiple trailing, leading
     * and inner spaces too.
     * @param {string} [text]
     * @returns {string}
     */
    normalize(text) {
        if (!text) {
            return '';
        }
        const lines = utils.lines();
        lines.add(text);
        lines.normalize();
        return lines.toString();
    },

    /**
     * Creates a new Lines object to build text file.
     * @param {AssemblerConfig} [options]
     * @returns {Lines}
     */
    lines(options) {
        return new Lines(options);
    },

    replaceAll(subject, key, value) {
        if (!(key instanceof RegExp)) {
            key = new RegExp(key, 'g');
        }
        return (subject || '').replace(key, value);
    },

    toSafeString(subject) {
        return (subject || '').replace(/\s/g, '_');
    },

    /**
     * Creates a new Table object to build tables.
     * @returns {StrippedTable}
     */
    table() {
        return new StrippedTable({
            chars: {
                'top': '',
                'top-mid': '',
                'top-left': '',
                'top-right': '',
                'bottom': '',
                'bottom-mid': '',
                'bottom-left': '',
                'bottom-right': '',
                'left': '|',
                'left-mid': '',
                'mid': '',
                'mid-mid': '',
                'right': '|',
                'right-mid': '',
                'middle': '|'
            },
            styles: {
                border: [],
                head: []
            }
        });
    },

    config(options) {
        return Object.assign({}, DEFAULT_OPTIONS, options || {});
    }
};

module.exports = utils;