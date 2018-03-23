'use strict';

const {resolve} = require('path');
const Element = require(resolve('lib/ast/Element.js'));
const Step = require(resolve('lib/ast/Step.js'));
const expect = require('chai').expect;

describe('Ast.Element', () => {
    let element;

    beforeEach(() => {
        element = new Element();
        element.steps.push(
            new Step('Given', 'step 1'),
            new Step('And', 'step 2'),
            new Step('When', 'step 3'),
            new Step('And', 'step 4'),
            new Step('When', 'step 5'),
            new Step('But', 'step 6'),
            new Step('Then', 'step 7'),
            new Step('Then', 'step 8'),
            new Step('And', 'step 9'),
            new Step('When', 'step 10'),
            new Step('And', 'step 11'),
            new Step('Then', 'step 12'),
            new Step('And', 'step 13')
        );
    });

    it('should have method to set normal step keywords', () => {
        expect(element.useNormalStepKeywords).not.to.be.undefined;

        element.useNormalStepKeywords();

        expect(element.steps.map(step => step.keyword)).to.eql([
            'Given', 'Given',
            'When', 'When', 'When', 'When', 
            'Then', 'Then', 'Then', 
            'When', 'When', 
            'Then', 'Then'
        ]);
    });

    it('should have method to set readable step keywords', () => {
        expect(element.useReadableStepKeywords).not.to.be.undefined;

        element.useReadableStepKeywords();

        expect(element.steps.map(step => step.keyword)).to.eql([
            'Given', 'And',
            'When', 'And', 'And', 'And', 
            'Then', 'And', 'And', 
            'When', 'And', 
            'Then', 'And'
        ]);
    });
});