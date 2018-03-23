'use strict';

const path = require('path');
const fs = require('fs');

const Feature = require(path.resolve('lib/ast/Feature.js'));
const GherkinDocument = require(path.resolve('lib/ast/GherkinDocument.js'));

const featureAst = require('../data/base.ast.json');
const featureFile = fs.readFileSync(path.resolve('test/data/base.feature'), 'utf8');

const expect = require('chai').expect;

describe('Ast.GherkinDocument', () => {
    it('should represent an Ast GherkinDocument instance', () => {
        const document = new GherkinDocument();
        expect(document).to.be.instanceOf(GherkinDocument);
        expect(document.feature).to.equal(null);
    });
    
    it('should not parse regular objects', () => {
        expect(() => GherkinDocument.parse()).to.throw(TypeError);
        expect(() => GherkinDocument.parse({type: 'Type'})).to.throw(TypeError);
    });
    
    it('should parse Gherkin Ast GherkinDocument type to GherkinDocument', () => {
        const document = GherkinDocument.parse(featureAst);
        expect(document).to.be.instanceOf(GherkinDocument);
        expect(document.feature).to.be.instanceOf(Feature);
    });

    it('should have proper string representation', () => {
        const document = GherkinDocument.parse(featureAst);
        expect(document.toString().split(/\r?\n/g)).to.eql(featureFile.split(/\r?\n/g));
    });

    it('should have method to clone it', () => {
        const document = GherkinDocument.parse(featureAst);
        const cloned = document.clone();
        expect(document).to.not.equal(cloned);
        expect(document).to.eql(cloned);
    });
});