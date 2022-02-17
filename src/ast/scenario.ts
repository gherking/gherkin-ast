import { cloneArray, replaceArray } from "../common";
import { GherkinScenario } from "../gherkinObject";
import { Comment } from "./comment";
import { Element } from "./element";
import { Step } from "./step";
import { Tag } from "./tag";

/**
 * Model for Scenario
 */
export class Scenario extends Element {
    public static parse(obj?: GherkinScenario): Scenario {
        if (!obj || !obj.scenario || obj.scenario?.examples?.length) {
            throw new TypeError("The given object is not a Scenario!");
        }
        const { description, keyword, name, steps, tags } = obj.scenario;
        const scenario: Scenario = new Scenario(keyword, name, description);
        if (Array.isArray(steps)) {
            scenario.steps = steps.map(Step.parse);
        } else {
            scenario.steps = [];
        }
        if (Array.isArray(tags)) {
            scenario.tags = tags.map(Tag.parse);
        } else {
            scenario.tags = [];
        }
        return scenario;
    }

    /** CTags of the Scenario */
    public tags: Tag[];

    // TODO
    public tagComments: Comment[];
    
    constructor(keyword: string, name: string, description: string) {
        super(keyword, name, description);
        this.tags = [];
    }

    public replace(key: RegExp | string, value: string): void {
        super.replace(key, value);
        replaceArray<Tag>(this.tags, key, value);
    }

    public clone(): Scenario {
        const scenario: Scenario = new Scenario(
            this.keyword, this.name, this.description,
        );
        scenario.steps = cloneArray<Step>(this.steps);
        scenario.tags = cloneArray<Tag>(this.tags);
        return scenario;
    }
}
