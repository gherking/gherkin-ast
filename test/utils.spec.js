'use strict';

const path = require('path');
const utils = require(path.resolve('lib/utils.js'));
const expect = require('chai').expect;

describe('Utils', () => {
    describe('.normalize()', () => {
        it('should replace multiple inline spaces', () => {
            expect(utils.normalize('some     text')).to.equal('some text');
        });

        it('should replace leading and trailing spaces', () => {
            expect(utils.normalize('  some text  ')).to.equal('some text');
        });

        it('should handle multi-line texts too', () => {
            expect(utils.normalize('  some\n  text  again  ')).to.equal('some\ntext again');
        });

        it('should handle if not argument is passed', () => {
            expect(utils.normalize()).to.equal('');
        })
    });

    describe('.indent()', () => {
        it('should indent one-line text', () => {
            expect(utils.indent('text to indent', 2)).to.equal('    text to indent');
        });

        it('should indent multi-line text', () => {
            expect(utils.indent('text to indent\nagain', 2)).to.equal('    text to indent\n    again');
        });

        it('should not indent empty lines', () => {
            expect(utils.indent('text to indent\n\nagain')).to.equal('  text to indent\n\n  again');
        });

        it('should indent with one level by default', () => {
            expect(utils.indent('text to indent')).to.equal('  text to indent');
        });

        it('should not indent if negative value is passed', () => {
            expect(utils.indent('text to indent', -20)).to.equal('text to indent');
        });

        it('should not indent if 0 is passed', () => {
            expect(utils.indent('text to indent', 0)).to.equal('text to indent');
        });
    });

    describe('.lines() / Lines', () => {
        let lines;

        beforeEach(() => {
            lines = utils.lines();
        });

        it('should be a Lines object', () => {
            expect(lines.constructor.name).to.equal('Lines');
            expect(lines._lines).to.eql([]);
        });

        describe('.add()', () => {
            it('should add the given text as new line', () => {
                lines.add('new line');
                expect(lines._lines).to.eql(['new line']);
            });

            it('should handle multiple lines too', () => {
                lines.add('new line\nother line');
                expect(lines._lines).to.eql(['new line', 'other line']);
            });

            it('should handle multiple arguments', () => {
                lines.add('new line', 'other line');
                expect(lines._lines).to.eql(['new line', 'other line']);
            });

            it('should add empty line if no argument passed', () => {
                lines.add();
                expect(lines._lines).to.eql(['']);
            });

            it('should handle empty lines in multiple arguments', () => {
                lines.add('new line', null, 'other line', undefined, 'another line');
                expect(lines._lines).to.eql(['new line', '', 'other line', '', 'another line']);
            });
        });

        describe('.toString()', () => {
            it('should handle simple line', () => {
                lines.add('new line');
                expect(lines.toString()).to.equal('new line');
            });

            it('should handle multiple lines too', () => {
                lines.add('new line\nother line');
                expect(lines.toString()).to.equal('new line\nother line');
            });

            it('should handle empty lines', () => {
                lines.add('new line', null, 'other line', undefined, 'another line');
                expect(lines.toString()).to.equal('new line\n\nother line\n\nanother line');
            });
        });
    });
});
