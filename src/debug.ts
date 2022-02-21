import debug = require("debug");

export const getDebugger = (m: string):debug.Debugger => debug(`gherkin-ast:${m}`);