import { Element } from "./element";
import { GherkinBackground, GherkinStep } from "../gherkinObject";
import { Step } from "./step";
import { cloneArray } from '../common';
//TODO:Sandor
export class Background extends Element {
    public clone(): Background {
        const background: Background = new Background(this.keyword, this.name, this.description);
        background.steps = cloneArray<Step>(this.steps);
        return background;
    }

    public static parse(obj?: GherkinBackground): Background {
        if (!obj || !obj.background) {
            throw new TypeError("The given object is not a Background!");
        }
        const { keyword, name, description, steps } = obj.background;
        const background: Background = new Background(keyword, name, description);
        if (Array.isArray(steps)) {
            background.steps = steps.map((step: GherkinStep): Step => Step.parse(step));
        }
        return background;
    }
}
