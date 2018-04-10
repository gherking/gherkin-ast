'use strict';

const {resolve} = require('path');
const {readFileSync} = require('fs');
const Element = require(resolve('lib/ast/Element.js'));
const Scenario = require(resolve('lib/ast/Scenario.js'));
const Step = require(resolve('lib/ast/Step.js'));
const Tag = require(resolve('lib/ast/Tag.js'));

const scenarioAst = require('../data/scenario.json');
const scenarioFeature = readFileSync(resolve('test/data/scenario.txt'), 'utf8');

const expect = require('chai').expect;

describe('Ast.Scenario', () => {
    it('should represent an Ast Scenario instance', () => {
        const scenario = new Scenario('Scenario', 'this is a   scenario', 'this  is a good scenario\n  a');
        expect(scenario).to.be.instanceOf(Scenario);
        expect(scenario.keyword).to.equal('Scenario');
        expect(scenario.name).to.equal('this is a scenario');
        expect(scenario.description).to.equal('this is a good scenario\na');
        expect(scenario.tags).to.eql([]);
        expect(scenario.steps).to.eql([]);
    });
    
    it('should extend common Element class', () => {
        const scenario = new Scenario('Scenario', 'this is a   scenario', 'this  is a good scenario\n  a');
        expect(scenario).to.be.instanceOf(Element);
    });
    
    it('should not parse regular objects', () => {
        expect(() => Scenario.parse()).to.throw(TypeError);
        expect(() => Scenario.parse({type: 'Type'})).to.throw(TypeError);
    });
    
    it('should parse Gherkin Ast Scenario type to Scenario', () => {
        const scenario = Scenario.parse(scenarioAst);
        expect(scenario).to.be.instanceOf(Scenario);
        expect(scenario.keyword).to.equal(scenarioAst.keyword);
        expect(scenario.name).to.equal(scenarioAst.name);
        expect(scenario.tags).to.have.lengthOf(scenarioAst.tags.length);
        scenario.tags.forEach((tag, i) => {
            expect(tag).to.be.instanceOf(Tag);
            expect(tag.name).to.equal(scenarioAst.tags[i].name);
        });
        expect(scenario.steps).to.have.lengthOf(scenarioAst.steps.length);
        scenario.steps.forEach((step, i) => {
            expect(step).to.be.instanceOf(Step);
            expect(step.text).to.equal(scenarioAst.steps[i].text);
        });
    });

    it('should have proper string representation', () => {
        const scenario = Scenario.parse(scenarioAst);
        expect(scenario.toString().split(/\r?\n/g)).to.eql(scenarioFeature.split(/\r?\n/g));
    });

    it('should have method to clone it', () => {
        const scenario = Scenario.parse(scenarioAst);
        const cloned = scenario.clone();
        expect(scenario).to.not.equal(cloned);
        expect(scenario).to.eql(cloned);
    });

    it('should have method to replace all key with value', () => {
        const scenario = new Scenario('Scenario', 'this is a <type> scenario', 'this is a really <type> scenario');
        scenario.steps.push(new Step('When', 'this is a <type> step and also <type>'));

        scenario.replace('<type>', 'good');

        expect(scenario.name).to.equal('this is a good scenario');
        expect(scenario.description).to.equal('this is a really good scenario');
        expect(scenario.steps[0].text).to.equal('this is a good step and also good');
    });
});