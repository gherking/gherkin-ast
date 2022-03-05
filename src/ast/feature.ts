import { cloneArray, normalizeString, replaceAll, replaceArray, GherkinCommentHandler } from "../common";
import { GherkinBackground, GherkinFeature, GherkinRule, GherkinScenario, GherkinLocation, isGherkinBackground, isGherkinRule, isGherkinScenario } from "../gherkinObject";
import { Background } from "./background";
import { Comment } from "./comment";
import { Element } from "./element";
import { Rule } from "./rule";
import { Scenario } from "./scenario";
import { ScenarioOutline } from "./scenarioOutline";
import { Tag } from "./tag";
import { UniqueObject } from "./uniqueObject";
import { getDebugger } from "../debug";
const debug = getDebugger("Feature");

/**
 * Model for Feature
 */
export class Feature extends UniqueObject {
  public static parse(obj: GherkinFeature, comments?: GherkinCommentHandler): Feature {
    debug("parse(obj: %o, comments: %d)", obj, comments?.comments?.length);
    if (!obj || !Array.isArray(obj.children)) {
      throw new TypeError("The given object is not a Feature!");
    }
    const { keyword, language, description, children, name, tags, location } = obj;
    const feature: Feature = new Feature(keyword, name, description, language);

    feature.precedingComment = comments?.parseComment(location, tags?.[tags.length - 1]?.location);
    feature.tagComment = comments?.parseTagComment(tags);

    feature.tags = Tag.parseAll(tags, comments);

    let firstLocation: GherkinLocation = null;
    feature.elements = children.map((child: GherkinRule | GherkinBackground | GherkinScenario): Element | Rule => {
      if (isGherkinRule(child)) {
        if (!firstLocation) {
          firstLocation = child.rule.location;
        }
        return Rule.parse(child, comments);
      }
      if (isGherkinBackground(child)) {
        if (!firstLocation) {
          firstLocation = child.background?.location;
        }
        return Background.parse(child, comments);
      }
      if (isGherkinScenario(child)) {
        if (!firstLocation) {
          firstLocation = child.scenario?.location;
        }
        if (child.scenario?.examples?.length) {
          return ScenarioOutline.parse(child, comments);
        }
        return Scenario.parse(child, comments);
      }
    });

    feature.descriptionComment = comments?.parseCommentBetween(location, firstLocation);

    debug(
      "parse(this: {keyword: '%s', name: '%s', description: '%s', language: '%s', " +
      "precedingComment: '%s', tagComment: '%s', desctiptionComment: '%s', " +
      "tags: %d, elements: %d})",
      feature.keyword, feature.name, feature.description, feature.language,
      feature.precedingComment?.text, feature.tagComment?.text,
      feature.descriptionComment?.text, feature.tags?.length, feature.elements?.length,
    );
    return feature;
  }

  /** Language of the Feature */
  public language: string;
  /** Keyword of the Feature */
  public keyword: "Feature" | "Business Need" | "Ability" | string;
  /** Name of the Feature */
  public name: string;
  /** Descrition of the Feature */
  public description: string;

  /** Elements of the Feature */
  public elements: (Element | Rule)[];
  /** Tags of the Feature */
  public tags: Tag[];

  /** Comment before all tag */
  public tagComment: Comment;
  /** Comment before the Feature */
  public precedingComment: Comment;
  /** Comment below the description of the Feature */
  public descriptionComment: Comment;

  constructor(keyword: string, name: string, description: string, language = "en") {
    super();
    debug(
      "constructor(keyword: '%s', name: '%s', description: '%s', language: '%s')",
      keyword, name, description, language,
    );

    this.language = language;

    this.keyword = normalizeString(keyword);
    this.name = normalizeString(name);
    this.description = normalizeString(description);

    this.elements = [];
    this.tags = [];

    this.precedingComment = null;
    this.tagComment = null;
    this.descriptionComment = null;

    debug(
      "constructor(this: {keyword: '%s', name: '%s', description: '%s', language: '%s', " +
      "precedingComment: '%s', tagComment: '%s', desctiptionComment: '%s', " +
      "tags: %d, elements: %d})",
      this.keyword, this.name, this.description, this.language,
      this.precedingComment?.text, this.tagComment?.text,
      this.descriptionComment?.text, this.tags?.length, this.elements?.length,
    );
  }

  public clone(): Feature {
    debug(
      "clone(this: {keyword: '%s', name: '%s', description: '%s', language: '%s', " +
      "precedingComment: '%s', tagComment: '%s', desctiptionComment: '%s', " +
      "tags: %d, elements: %d})",
      this.keyword, this.name, this.description, this.language,
      this.precedingComment?.text, this.tagComment?.text,
      this.descriptionComment?.text, this.tags?.length, this.elements?.length,
    );
    const feature: Feature = new Feature(
      this.keyword, this.name,
      this.description, this.language,
    );

    feature.tags = cloneArray<Tag>(this.tags);
    feature.elements = cloneArray<Element | Rule>(this.elements);

    feature.precedingComment = this.precedingComment ? this.precedingComment.clone() : null;
    feature.tagComment = this.tagComment ? this.tagComment.clone() : null;
    feature.descriptionComment = this.descriptionComment ? this.descriptionComment.clone() : null;

    return feature;
  }

  public replace(key: RegExp | string, value: string): void {
    debug("replace(key: '%s', value: '%s')", key, value);
    this.name = replaceAll(this.name, key, value);
    this.description = replaceAll(this.description, key, value);

    replaceArray<Tag>(this.tags, key, value);
    replaceArray<Element | Rule>(this.elements, key, value);

    this.precedingComment && this.precedingComment.replace(key, value);
    this.tagComment && this.tagComment.replace(key, value);
    this.descriptionComment && this.descriptionComment.replace(key, value);
  }
}
