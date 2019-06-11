'use strict';

const path = require('path');
const Tag = require(path.resolve('./lib/ast/Tag.js'));

const expect = require('chai').expect;

describe('Ast.Tag', () => {
    it('should represent an Ast Tag instance', () => {
        const tag = new Tag('tagName');
        expect(tag).to.be.instanceOf(Tag);
        expect(tag.name).to.equal('tagName');
    });
    
    it('should not parse regular objects', () => {
        expect(() => Tag.parse()).to.throw(TypeError);
        expect(() => Tag.parse({type: 'Type'})).to.throw(TypeError);
    });
    
    it('should parse Gherkin Ast Tag type to Tag', () => {
        const tag = Tag.parse({type: 'Tag', name: 'tagName'});
        expect(tag).to.be.instanceOf(Tag);
        expect(tag.name).to.equal('tagName');
    });

    it('should have proper string representation', () => {
        const tag = new Tag('tagName');
        expect(tag.toString()).to.equal('tagName');
    });

    it('should have method to clone it', () => {
        const tag = new Tag('tagName');
        const cloned = tag.clone();
        expect(tag).to.not.equal(cloned);
        expect(tag).to.eql(cloned);
    });
});