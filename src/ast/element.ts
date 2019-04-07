import { normalizeString, replaceAll, replaceArray } from "../common";
import { Step } from "./step";

export const REPEAT_STEP_KEYWORDS: string[] = ["And", "But", "*"];

export class Element {
    public keyword: string;
    public name: string;
    public description: string;
    public steps: Step[];

    constructor(keyword: string, name: string, description: string) {
        this.keyword = normalizeString(keyword);
        this.name = normalizeString(name);
        this.description = normalizeString(description);
        this.steps = [];
    }

    public clone(): Element {
        throw new Error("Not implemented");
    }

    public replace(key: RegExp | string, value: string): void {
        this.name = replaceAll(this.name, key, value);
        this.description = replaceAll(this.description, key, value);
        replaceArray<Step>(this.steps, key, value);
    }

    public useNormalStepKeywords(): void {
        this.steps.forEach((step: Step, i: number): void => {
            if (i && REPEAT_STEP_KEYWORDS.indexOf(step.keyword) > -1) {
                step.keyword = this.steps[i - 1].keyword;
            }
        });
    }

    public useReadableStepKeywords(): void {
        this.useNormalStepKeywords();
        for (let i = this.steps.length - 1; i > 0; --i) {
            if (this.steps[i].keyword === this.steps[i - 1].keyword) {
                this.steps[i].keyword = "And";
            }
        }
    }
}
