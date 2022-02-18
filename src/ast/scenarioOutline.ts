import { GherkinCommentHandler } from "..";
import { cloneArray, replaceArray } from "../common";
import { GherkinScenario } from "../gherkinObject";
import { Comment } from "./comment";
import { Element } from "./element";
import { Examples } from "./examples";
import { Scenario } from "./scenario";
import { Step } from "./step";
import { TableCell } from "./tableCell";
import { TableRow } from "./tableRow";
import { removeDuplicateTags, Tag, tag } from "./tag";

/**
 * Model for ScenarioOutline
 */
export class ScenarioOutline extends Element {
    public static parse(obj: GherkinScenario, comments?: GherkinCommentHandler): ScenarioOutline {
        if (!obj || !obj.scenario || !Array.isArray(obj.scenario.examples)) {
            throw new TypeError("The given object is not a Scenario Outline!");
        }
        const { description, examples, keyword, name, steps, tags, location } = obj.scenario;
        const scenarioOutline: ScenarioOutline = new ScenarioOutline(
            keyword, name, description,
        );

        scenarioOutline.precedingComment = comments?.parseComment(location);
        scenarioOutline.tagComment = comments?.parseTagComment(tags);

        scenarioOutline.steps = Step.parseAll(steps, comments);
        scenarioOutline.tags = Tag.parseAll(tags, comments);

        scenarioOutline.descriptionComment = comments?.parseCommentBetween(location, steps[0]?.location);

        scenarioOutline.examples = examples.map(e => Examples.parse(e, comments));

        return scenarioOutline;
    }

    /** Zags of the ScenarioOutline */
    public tags: Tag[];
    /** Examples of the ScenarioOutline */
    public examples: Examples[];

    /** Comment of all the tags */
    public tagComment: Comment;

    constructor(keyword: string, name: string, description: string) {
        super(keyword, name, description);

        this.tags = [];
        this.examples = [];

        this.tagComment = null;
    }

    public replace(key: RegExp | string, value: string): void {
        super.replace(key, value);

        replaceArray<Tag>(this.tags, key, value);
        replaceArray<Examples>(this.examples, key, value);

        this.tagComment && this.tagComment.replace(key, value);
    }

    public clone(): ScenarioOutline {
        const scenarioOutline: ScenarioOutline = new ScenarioOutline(
            this.keyword, this.name, this.description,
        );

        scenarioOutline.precedingComment = this.precedingComment ? this.precedingComment.clone() : null;
        scenarioOutline.tagComment = this.tagComment ? this.tagComment.clone() : null;
        scenarioOutline.descriptionComment = this.descriptionComment ? this.descriptionComment.clone() : null;

        scenarioOutline.tags = cloneArray<Tag>(this.tags);
        scenarioOutline.steps = cloneArray<Step>(this.steps);
        scenarioOutline.examples = cloneArray<Examples>(this.examples);

        return scenarioOutline;
    }

    public toScenario(columnToAddAsTag = 0): Scenario[] {
        const scenarios: Scenario[] = [];
        this.examples.forEach((examples: Examples): void => {
            const n: number = Math.max(0, Math.min(examples.header.cells.length - 1, columnToAddAsTag));
            examples.body.forEach((row: TableRow): void => {
                const scenario: Scenario = new Scenario("Scenario", this.name, this.description);

                scenario.tags = removeDuplicateTags([
                    ...cloneArray<Tag>(this.tags),
                    ...cloneArray<Tag>(examples.tags),
                    tag(examples.header.cells[n].value, row.cells[n].value),
                ]);

                scenario.precedingComment = this.precedingComment ? this.precedingComment.clone() : null;
                scenario.tagComment = this.tagComment ? this.tagComment.clone() : null;
                scenario.descriptionComment = this.descriptionComment ? this.descriptionComment.clone() : null;

                scenario.steps = cloneArray<Step>(this.steps);
                examples.header.cells.forEach((cell: TableCell, i: number): void => {
                    scenario.replace(`<${cell.value}>`, row.cells[i].value);
                });

                scenarios.push(scenario);
            });
        });
        return scenarios;
    }
}
