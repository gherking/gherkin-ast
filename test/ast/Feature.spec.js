'use strict';

const path = require('path');
const fs = require('fs');

const Feature = require(path.resolve('lib/ast/Feature.js'));
const Tag = require(path.resolve('lib/ast/Tag.js'));

const featureAst = require('../data/base.ast.json').feature;
const featureFile = fs.readFileSync(path.resolve('test/data/base.feature'), 'utf8');

const expect = require('chai').expect;
const dc = require('deep-copy');

describe('Ast.Feature', () => {
    it('should represent an Ast Feature instance', () => {
        const feature = new Feature('Feature', 'this is a   feature', 'this  is a good feature\n  a');
        expect(feature).to.be.instanceOf(Feature);
        expect(feature.keyword).to.equal('Feature');
        expect(feature.name).to.equal('this is a feature');
        expect(feature.description).to.equal('this is a good feature\na');
        expect(feature.tags).to.eql([]);
        expect(feature.elements).to.eql([]);
    });
    
    it('should not parse regular objects', () => {
        expect(() => Feature.parse()).to.throw(TypeError);
        expect(() => Feature.parse({type: 'Type'})).to.throw(TypeError);
    });
    
    it('should parse Gherkin Ast Feature type to Feature', () => {
        const feature = Feature.parse(featureAst);
        expect(feature).to.be.instanceOf(Feature);
        expect(feature.keyword).to.equal(featureAst.keyword);
        expect(feature.name).to.equal(featureAst.name);
        expect(feature.tags).to.have.lengthOf(featureAst.tags.length);
        feature.tags.forEach((tag, i) => {
            expect(tag).to.be.instanceOf(Tag);
            expect(tag.name).to.equal(featureAst.tags[i].name);
        });
        expect(feature.elements).to.have.lengthOf(featureAst.children.length);
        feature.elements.forEach((scenario, i) => {
            expect(scenario.constructor.name).to.equal(featureAst.children[i].type);
            expect(scenario.name).to.equal(featureAst.children[i].name);
        });
    });

    it('should not parse Gherkin Ast Feature if it has unsupported children', () => {
        const wrongAst = dc(featureAst);
        wrongAst.children.push({
            type: 'ThereIsNoTypeLikeThis'
        });
        expect(() => Feature.parse(wrongAst)).to.throw(TypeError);
    });

    it('should have proper string representation', () => {
        const feature = Feature.parse(featureAst);
        expect(feature.toString().split(/\r?\n/g)).to.eql(featureFile.split(/\r?\n/g));
    });

    it('should have method to clone it', () => {
        const feature = Feature.parse(featureAst);
        const cloned = feature.clone();
        expect(feature).to.not.equal(cloned);
        expect(feature).to.eql(cloned);
    });
});