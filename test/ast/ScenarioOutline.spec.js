'use strict';

const {resolve} = require('path');
const {readFileSync} = require('fs');
const Element = require(resolve('lib/ast/Element.js'));
const ScenarioOutline = require(resolve('lib/ast/ScenarioOutline.js'));
const Step = require(resolve('lib/ast/Step.js'));
const Tag = require(resolve('lib/ast/Tag.js'));
const Examples = require(resolve('lib/ast/Examples.js'));
const DocString = require(resolve('lib/ast/DocString.js'));
const DataTable = require(resolve('lib/ast/DataTable.js'));
const TableCell = require(resolve('lib/ast/TableCell.js'));
const TableRow = require(resolve('lib/ast/TableRow.js'));

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

    describe('Converting ScenarioOutline to Scenario(s)', () => {
        let scenarios;

        beforeEach(() => {
            const scenario = new ScenarioOutline(
                'Scenario Outline', 
                'this is a <type> scenario outline', 
                'this is a really <other> scenario outline'
            );
            scenario.tags = [
                {name: 'scTag1'}
            ];

            const step1 = new Step('When', 'this is a <type> step and also <other>');
            step1.argument = new DocString('<type>');
            scenario.steps.push(step1);

            const step2 = new Step('Then', 'this should be a <type>/<other>');
            step2.argument = new DataTable([
                new TableRow([
                    new TableCell('<type>')
                ]),
                new TableRow([
                    new TableCell('<other>')
                ])
            ]);
            scenario.steps.push(step2);
            
            scenario.examples.push({
                header: {
                    cells: [
                        {value: 'type'},
                        {value: 'other'}
                    ]
                },
                body: [
                    {
                        cells: [
                            {value: 'really good'},
                            {value: 'bad'}
                        ]
                    },
                    {
                        cells: [
                            {value: 'really bad'},
                            {value: 'good'}
                        ]
                    }
                ],
                tags: [
                    {name: 'exTag1'}
                ]
            }, {
                header: {
                    cells: [
                        {value: 'type'},
                        {value: 'other'}
                    ]
                },
                body: [
                    {
                        cells: [
                            {value: 'ehhh'},
                            {value: 'pfff'}
                        ]
                    },
                    {
                        cells: [
                            {value: 'pfff'},
                            {value: 'ehhh'}
                        ]
                    }
                ],
                tags: [
                    {name: 'exTag2'}
                ]
            });
            scenarios = scenario.toScenario();
        });

        it('should create as many scenario as many example row it has', () => {
            expect(scenarios).to.have.lengthOf(4);
        });

        it('should combine tags of ScenarioOutline and Examples', () => {
            expect(scenarios[0].tags.map(tag => tag.name)).to.eql(['scTag1', 'exTag1', '@type(really_good)']);
            expect(scenarios[1].tags.map(tag => tag.name)).to.eql(['scTag1', 'exTag1', '@type(really_bad)']);
            expect(scenarios[2].tags.map(tag => tag.name)).to.eql(['scTag1', 'exTag2', '@type(ehhh)']);
            expect(scenarios[3].tags.map(tag => tag.name)).to.eql(['scTag1', 'exTag2', '@type(pfff)']);
        });

        it('should set name of Scenarios properly', () => {
            expect(scenarios[0].name).to.equal('this is a really good scenario outline');
            expect(scenarios[1].name).to.equal('this is a really bad scenario outline');
            expect(scenarios[2].name).to.equal('this is a ehhh scenario outline');
            expect(scenarios[3].name).to.equal('this is a pfff scenario outline');
        });

        it('should set description of Scenarios properly', () => {
            expect(scenarios[0].description).to.equal('this is a really bad scenario outline');
            expect(scenarios[1].description).to.equal('this is a really good scenario outline');
            expect(scenarios[2].description).to.equal('this is a really pfff scenario outline');
            expect(scenarios[3].description).to.equal('this is a really ehhh scenario outline');
        });

        it('should replace values in Steps too', () => {
            expect(scenarios[0].steps[0].text).to.equal('this is a really good step and also bad');
            expect(scenarios[1].steps[0].text).to.equal('this is a really bad step and also good');
            expect(scenarios[2].steps[0].text).to.equal('this is a ehhh step and also pfff');
            expect(scenarios[3].steps[0].text).to.equal('this is a pfff step and also ehhh');
        });

        it('should replace values in DocString too', () => {
            expect(scenarios[0].steps[0].argument.content).to.equal('really good');
            expect(scenarios[1].steps[0].argument.content).to.equal('really bad');
            expect(scenarios[2].steps[0].argument.content).to.equal('ehhh');
            expect(scenarios[3].steps[0].argument.content).to.equal('pfff');
        });

        it('should replace values in DataTable too', () => {
            expect(scenarios[0].steps[1].argument.toString()).to.equal('| really good |\n| bad         |');
            expect(scenarios[1].steps[1].argument.toString()).to.equal('| really bad |\n| good       |');
            expect(scenarios[2].steps[1].argument.toString()).to.equal('| ehhh |\n| pfff |');
            expect(scenarios[3].steps[1].argument.toString()).to.equal('| pfff |\n| ehhh |');
        });
    });

});