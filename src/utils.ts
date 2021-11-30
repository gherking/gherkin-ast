// @ts-ignore
import objectScan = require("object-scan");
import { UniqueObject } from "./ast/uniqueObject";

export const pruneID = <T extends UniqueObject>(input: T | T[]): T | T[] => {
    if (Array.isArray(input)) {
        return input.map(pruneID) as T[];
    }
    objectScan(['**._id'], {
        rtn: 'count',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        filterFn: ({ parent, property }: { parent: any; property: string; }): void => {
            delete parent[property];
        }
    })(input);
    return input;
};