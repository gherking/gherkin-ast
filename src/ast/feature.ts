import { cloneArray, normalizeString, replaceAll, replaceArray } from "../common";
import { GherkinBackground, GherkinFeature, GherkinScenario } from "../gherkinObject";
import { Background } from "./background";
import { Element } from "./element";
import { Scenario } from "./scenario";
import { ScenarioOutline } from "./scenarioOutline";
import { Tag } from "./tag";

/**
 * Model for Feature
 */
export class Feature {
    public static parse(obj?: GherkinFeature): Feature {
        if (!obj || !Array.isArray(obj.children)) {
            throw new TypeError("The given object is not a Feature!");
        }
        const { keyword, language, description, children, name, tags } = obj;
        const feature: Feature = new Feature(keyword, name, description, language);
        if (Array.isArray(tags)) {
            feature.tags = tags.map(Tag.parse);
        } else {
            feature.tags = [];
        }
        feature.elements = children.map((child: GherkinBackground | GherkinScenario): Element => {
            if ((child as GherkinBackground).background) {
                return Background.parse(child as GherkinBackground);
            }
            if ((child as GherkinScenario).scenario.examples) {
                return ScenarioOutline.parse(child as GherkinScenario);
            }
            return Scenario.parse(child as GherkinScenario);
        });
        return feature;
    }

    /** Language of the Feature */
    public language: string;
    /** Keyword of the Feature */
    public keyword: string;
    /** Name of the Feature */
    public name: string;
    /** Descrition of the Feature */
    public description: string;
    /** Elements of the Feature */
    public elements: Element[];
    /** Tags of the Feature */
    public tags: Tag[];

    constructor(keyword: string, name: string, description: string, language: string = "en") {
        this.keyword = normalizeString(keyword);
        this.name = normalizeString(name);
        this.description = normalizeString(description);
        this.language = language;
        this.elements = [];
        this.tags = [];
    }

    public clone(): Feature {
        const feature: Feature = new Feature(
            this.keyword, this.name,
            this.description, this.language,
        );
        feature.tags = cloneArray<Tag>(this.tags);
        feature.elements = cloneArray<Element>(this.elements);
        return feature;
    }

    public replace(key: RegExp | string, value: string): void {
        this.name = replaceAll(this.name, key, value);
        this.description = replaceAll(this.description, key, value);
        replaceArray<Tag>(this.tags, key, value);
        replaceArray<Element>(this.elements, key, value);
    }
}
