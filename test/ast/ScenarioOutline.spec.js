'use strict';

const {resolve} = require('path');
const {readFileSync} = require('fs');
const Element = require(resolve('lib/ast/Element.js'));
const ScenarioOutline = require(resolve('lib/ast/ScenarioOutline.js'));
const Step = require(resolve('lib/ast/Step.js'));
const Tag = require(resolve('lib/ast/Tag.js'));
const Examples = require(resolve('lib/ast/Examples.js'));

const scenarioAst = require('../data/scenarioOutline.json');
const scenarioFeature = readFileSync(resolve('test/data/scenarioOutline.txt'), 'utf8');

const expect = require('chai').expect;

describe('Ast.ScenarioOutline', () => {
    it('should represent an Ast ScenarioOutline instance', () => {
        const scenario = new ScenarioOutline('Scenario Outline', 'this is a   scenario', 'this  is a good scenario\n  a');
        expect(scenario).to.be.instanceOf(ScenarioOutline);
        expect(scenario.keyword).to.equal('Scenario Outline');
        expect(scenario.name).to.equal('this is a scenario');
        expect(scenario.description).to.equal('this is a good scenario\na');
        expect(scenario.tags).to.eql([]);
        expect(scenario.steps).to.eql([]);
        expect(scenario.examples).to.eql([]);
    });
    
    it('should extend common Element class', () => {
        const scenario = new ScenarioOutline('Scenario Outline', 'this is a   scenario', 'this  is a good scenario\n  a');
        expect(scenario).to.be.instanceOf(Element);
    });
    
    it('should not parse regular objects', () => {
        expect(() => ScenarioOutline.parse()).to.throw(TypeError);
        expect(() => ScenarioOutline.parse({type: 'Type'})).to.throw(TypeError);
    });
    
    it('should parse Gherkin Ast ScenarioOutline type to ScenarioOutline', () => {
        const scenario = ScenarioOutline.parse(scenarioAst);
        expect(scenario).to.be.instanceOf(ScenarioOutline);
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
        expect(scenario.examples).to.have.lengthOf(scenarioAst.examples.length);
        scenario.examples.forEach((examples, i) => {
            expect(examples).to.be.instanceOf(Examples);
            expect(examples.header.cells[0].value).to.equal(scenarioAst.examples[i].tableHeader.cells[0].value);
        });
    });

    it('should have proper string representation', () => {
        const scenario = ScenarioOutline.parse(scenarioAst);
        expect(scenario.toString().split(/\r?\n/g)).to.eql(scenarioFeature.split(/\r?\n/g));
    });

    it('should have method to clone it', () => {
        const scenario = ScenarioOutline.parse(scenarioAst);
        const cloned = scenario.clone();
        expect(scenario).to.not.equal(cloned);
        expect(scenario).to.eql(cloned);
    });
});