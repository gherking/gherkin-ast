import { cloneArray } from "../common";
import { GherkinBackground } from "../gherkinObject";
import { Element } from "./element";
import { Step } from "./step";

export class Background extends Element {
    public static parse(obj?: GherkinBackground): Background {
        if (!obj || !obj.background) {
            throw new TypeError("The given object is not a Background!");
        }
        const { keyword, name, description, steps } = obj.background;
        const background: Background = new Background(keyword, name, description);
        if (Array.isArray(steps)) {
            background.steps = steps.map(Step.parse);
        } else {
            background.steps = [];
        }
        return background;
    }

    public clone(): Background {
        const background: Background = new Background(this.keyword, this.name, this.description);
        background.steps = cloneArray<Step>(this.steps);
        return background;
    }
}
