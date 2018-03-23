'use strict';

const {resolve} = require('path');
const {readFileSync} = require('fs');
const Background = require(resolve('lib/ast/Background.js'));
const Element = require(resolve('lib/ast/Element.js'));

const backgroundAst = require('../data/background.json');
const backgroundFeature = readFileSync(resolve('test/data/background.txt'), 'utf8');

const expect = require('chai').expect;

describe('Ast.Background', () => {
    it('should represent an Ast Background instance', () => {
        const background = new Background('Background', 'this is a  background', 'this  is a good background\n  a');
        expect(background).to.be.instanceOf(Background);
        expect(background.keyword).to.equal('Background');
        expect(background.name).to.equal('this is a background');
        expect(background.description).to.equal('this is a good background\na');
        expect(background.steps).to.eql([]);
    });
    
    it('should extend common Element class', () => {
        const background = new Background('Background', 'this is a  background', 'this  is a good background\n  a');
        expect(background).to.be.instanceOf(Element);
    });
    
    it('should not parse regular objects', () => {
        expect(() => Background.parse()).to.throw(TypeError);
        expect(() => Background.parse({type: 'Type'})).to.throw(TypeError);
    });
    
    it('should parse Gherkin Ast Background type to Background', () => {
        const background = Background.parse(backgroundAst);
        expect(background).to.be.instanceOf(Background);
        expect(background.keyword).to.equal(backgroundAst.keyword);
        expect(background.name).to.equal(backgroundAst.name);
    });

    it('should have proper string representation', () => {
        const background = Background.parse(backgroundAst);
        expect(background.toString().split(/\r?\n/g)).to.eql(backgroundFeature.split(/\r?\n/g));
    });

    it('should have method to clone it', () => {
        const background = Background.parse(backgroundAst);
        const cloned = background.clone();
        expect(background).to.not.equal(cloned);
        expect(background).to.eql(cloned);
    });
});