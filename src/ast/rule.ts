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
    public static parse(obj?: GherkinRule): Rule {
        if (!obj || !obj.rule || !Array.isArray(obj.rule.children)) {
            throw new TypeError("The given object is not a Rule!");
        }
        const { keyword, description, children, name, tags } = obj.rule;
        const rule: Rule = new Rule(keyword, name, description);
        if (Array.isArray(tags)) {
            rule.tags = tags.map(Tag.parse);
        } else {
            rule.tags = [];
        }
        rule.elements = children.map((child: GherkinBackground | GherkinScenario): Element => {
            if ((child as GherkinBackground).background) {
                return Background.parse(child as GherkinBackground);
            }
            if ((child as GherkinScenario).scenario?.examples?.length) {
                return ScenarioOutline.parse(child as GherkinScenario);
            }
            return Scenario.parse(child as GherkinScenario);
        });
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

    // TODO
    public tagComments: Comment[];
    // TODO
    public precedingComments: Comment[];
    // TODO
    public intermediateComments: Comment[];

    constructor(keyword: string, name: string, description: string) {
        super();
        this.keyword = normalizeString(keyword);
        this.name = normalizeString(name);
        this.description = normalizeString(description);
        this.elements = [];
        this.tags = [];
    }

    public clone(): Rule {
        const rule: Rule = new Rule(
            this.keyword, this.name,
            this.description,
        );
        rule.tags = cloneArray<Tag>(this.tags);
        rule.elements = cloneArray<Element>(this.elements);
        return rule;
    }

    public replace(key: RegExp | string, value: string): void {
        this.name = replaceAll(this.name, key, value);
        this.description = replaceAll(this.description, key, value);
        replaceArray<Tag>(this.tags, key, value);
        replaceArray<Element>(this.elements, key, value);
    }
}
