import { cloneArray, GherkinCommentHandler } from "../common";
import { GherkinBackground } from "../gherkinObject";
import { Element } from "./element";
import { Step } from "./step";

/**
 * Model for Background
 */
export class Background extends Element {
  public static parse(obj: GherkinBackground, comments?: GherkinCommentHandler): Background {
    if (!obj || !obj.background) {
      throw new TypeError("The given object is not a Background!");
    }
    const { keyword, name, description, steps, location } = obj.background;
    const background: Background = new Background(keyword, name, description);

    background.preceedingComment = comments?.parseComment(location);

    background.steps = Step.parseAll(steps, comments);

    background.descriptionComment = comments?.parseCommentBetween(location, steps[0]?.location);

    return background;
  }

  public clone(): Background {
    const background: Background = new Background(this.keyword, this.name, this.description);

    background.steps = cloneArray<Step>(this.steps);

    background.preceedingComment = this.preceedingComment ? this.preceedingComment.clone() : null;
    background.descriptionComment = this.descriptionComment ? this.descriptionComment.clone() : null;

    return background;
  }
}
