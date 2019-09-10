import { cloneArray, normalizeString, replaceAll, replaceArray } from "../common";
import { GherkinBackground, GherkinRule, GherkinScenario } from "../gherkinObject";
import { Background } from "./background";
import { Element } from "./element";
import { Scenario } from "./scenario";
import { ScenarioOutline } from "./scenarioOutline";

/**
 * Model for Rule
 */
export class Rule {
    public static parse(obj?: GherkinRule): Rule {
        if (!obj || !obj.rule || !Array.isArray(obj.rule.children)) {
            throw new TypeError("The given object is not a Rule!");
        }
        const { keyword, description, children, name } = obj.rule;
        const rule: Rule = new Rule(keyword, name, description);
        rule.elements = children.map((child: GherkinBackground | GherkinScenario): Element => {
            if ((child as GherkinBackground).background) {
                return Background.parse(child as GherkinBackground);
            }
            if ((child as GherkinScenario).scenario.examples) {
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

    constructor(keyword: string, name: string, description: string) {
        this.keyword = normalizeString(keyword);
        this.name = normalizeString(name);
        this.description = normalizeString(description);
        this.elements = [];
    }

    public clone(): Rule {
        const rule: Rule = new Rule(
            this.keyword, this.name,
            this.description,
        );
        rule.elements = cloneArray<Element>(this.elements);
        return rule;
    }

    public replace(key: RegExp | string, value: string): void {
        this.name = replaceAll(this.name, key, value);
        this.description = replaceAll(this.description, key, value);
        replaceArray<Element>(this.elements, key, value);
    }
}
