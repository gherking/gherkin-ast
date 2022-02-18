import { GherkinCommentHandler, GherkinLocation, isGherkinBackground, isGherkinScenario } from "..";
import { cloneArray, normalizeString, replaceAll, replaceArray } from "../common";
import { GherkinBackground, GherkinRule, GherkinScenario } from "../gherkinObject";
import { Background } from "./background";
import { Comment } from "./comment";
import { Element } from "./element";
import { Scenario } from "./scenario";
import { ScenarioOutline } from "./scenarioOutline";
import { Tag } from "./tag";
import { UniqueObject } from "./uniqueObject";

/**
 * Model for Rule
 */
export class Rule extends UniqueObject {
    public static parse(obj: GherkinRule, comments?: GherkinCommentHandler): Rule {
        if (!obj || !obj.rule || !Array.isArray(obj.rule.children)) {
            throw new TypeError("The given object is not a Rule!");
        }
        const { keyword, description, children, name, tags, location } = obj.rule;
        const rule: Rule = new Rule(keyword, name, description);

        rule.precedingComment = comments?.parseComment(location);
        rule.tagComment = comments?.parseTagComment(tags);

        rule.tags = Tag.parseAll(tags, comments);

        let firstLocation: GherkinLocation = null;
        rule.elements = children.map((child: GherkinBackground | GherkinScenario): Element => {
            if (isGherkinBackground(child)) {
                if (!firstLocation) {
                    firstLocation = child.background.location;
                }
                return Background.parse(child, comments);
            }
            if (isGherkinScenario(child)) {
                if (!firstLocation) {
                    firstLocation = child.scenario.location;
                }
                if (child.scenario?.examples?.length) {
                    return ScenarioOutline.parse(child, comments);
                }
                return Scenario.parse(child, comments);
            }
        });

        rule.descriptionComment = comments?.parseCommentBetween(location, firstLocation);

        return rule;
    }

    /** Keyword of the Rule */
    public keyword: "Rule" | string;
    /** Name of the Rule */
    public name: string;
    /** Descrition of the Rule */
    public description: string;
    
    /** Elements of the Rule */
    public elements: Element[];
    /** Tags of the Rule */
    public tags: Tag[];

    /** Comment before the tags */
    public tagComment: Comment;
    /** Comment before the Rule */
    public precedingComment: Comment;
    /** Comment after the description of the Rul */
    public descriptionComment: Comment;

    constructor(keyword: string, name: string, description: string) {
        super();

        this.keyword = normalizeString(keyword);
        this.name = normalizeString(name);
        this.description = normalizeString(description);

        this.elements = [];
        this.tags = [];

        this.precedingComment = null;
        this.tagComment = null;
        this.descriptionComment = null;
    }

    public clone(): Rule {
        const rule: Rule = new Rule(
            this.keyword, this.name,
            this.description,
        );

        rule.precedingComment = this.precedingComment ? this.precedingComment.clone() : null;
        rule.tagComment = this.tagComment ? this.tagComment.clone() : null;
        rule.descriptionComment = this.descriptionComment ? this.descriptionComment.clone() : null;

        rule.tags = cloneArray<Tag>(this.tags);
        rule.elements = cloneArray<Element>(this.elements);

        return rule;
    }

    public replace(key: RegExp | string, value: string): void {
        this.name = replaceAll(this.name, key, value);
        this.description = replaceAll(this.description, key, value);

        replaceArray<Tag>(this.tags, key, value);
        replaceArray<Element>(this.elements, key, value);

        this.precedingComment && this.precedingComment.replace(key, value);
        this.tagComment && this.tagComment.replace(key, value);
        this.descriptionComment && this.descriptionComment.replace(key, value);
    }
}
