import { GherkinCommentHandler } from "..";
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
    public static parse(obj: GherkinScenario, comments?: GherkinCommentHandler): Scenario {
        if (!obj || !obj.scenario || obj.scenario?.examples?.length) {
            throw new TypeError("The given object is not a Scenario!");
        }
        const { description, keyword, name, steps, tags, location } = obj.scenario;
        const scenario: Scenario = new Scenario(keyword, name, description);

        scenario.precedingComment = comments?.parseComment(location);
        scenario.tagComment = comments?.parseTagComment(tags);

        scenario.steps = Step.parseAll(steps, comments);
        scenario.tags = Tag.parseAll(tags, comments);

        scenario.descriptionComment = comments?.parseCommentBetween(location, steps[0]?.location);

        return scenario;
    }

    /** CTags of the Scenario */
    public tags: Tag[];

    /** Comment of the tags */
    public tagComment: Comment;

    constructor(keyword: string, name: string, description: string) {
        super(keyword, name, description);

        this.tags = [];

        this.precedingComment = null;
        this.tagComment = null;
    }

    public replace(key: RegExp | string, value: string): void {
        super.replace(key, value);

        replaceArray<Tag>(this.tags, key, value);

        this.tagComment && this.tagComment.replace(key, value);
    }

    public clone(): Scenario {
        const scenario: Scenario = new Scenario(
            this.keyword, this.name, this.description,
        );

        scenario.steps = cloneArray<Step>(this.steps);
        scenario.tags = cloneArray<Tag>(this.tags);

        scenario.precedingComment = this.precedingComment ? this.precedingComment.clone() : null;
        scenario.tagComment = this.tagComment ? this.tagComment.clone() : null;
        scenario.descriptionComment = this.descriptionComment ? this.descriptionComment.clone() : null;

        return scenario;
    }
}
