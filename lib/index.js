'use strict';

const ast = {};

ast.GherkinDocument = require('./ast/GherkinDocument');
ast.Feature = require('./ast/Feature');
ast.Tag = require('./ast/Tag');
ast.Background = require('./ast/Background');
ast.Scenario = require('./ast/Scenario');
ast.ScenarioOutline = require('./ast/ScenarioOutline');
ast.Step = require('./ast/Step');
ast.DocString = require('./ast/DocString');
ast.DataTable = require('./ast/DataTable');
ast.Examples = require('./ast/Examples');
ast.TableRow = require('./ast/TableRow');
ast.TableCell = require('./ast/TableCell');

module.exports = ast;