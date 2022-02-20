import { Background, Comment, GherkinCommentHandler, Step } from "../../src";
import { GherkinBackground, GherkinStep } from "../../src/gherkinObject";

describe("Background", () => {
  test("should create model of a Background", () => {
    // Given
    // When
    const background: Background = new Background("Bkeeyword", "Bname", "Bdesc");
    // Then
    expect(background).toBeDefined();
    expect(background._id).toBeDefined();
    expect(background.keyword).toEqual("Bkeeyword");
  });

  test("should have a method to clone it", () => {
    // Given
    const backgroundA: Background = new Background("Bkeeyword", "Bname", "Bdesc");
    // When
    const backgroundB: Background = backgroundA.clone();
    // Then
    expect(backgroundB._id).toBeDefined();
    expect(backgroundB._id).not.toEqual(backgroundA._id);
    expect(backgroundB.keyword).toEqual(backgroundA.keyword);
    expect(backgroundB.name).toEqual(backgroundA.name);
    expect(backgroundB.description).toEqual(backgroundA.description);
    expect(backgroundB.descriptionComment).toBeNull();
    expect(backgroundB.preceedingComment).toBeNull();
    expect(backgroundB).not.toBe(backgroundA);
  });

  test("should also clone comments", () => {
    // Given
    const backgroundA: Background = new Background("Bkeeyword", "Bname", "Bdesc");
    backgroundA.descriptionComment = new Comment("description");
    backgroundA.preceedingComment = new Comment("preceeding");
    // When
    const backgroundB: Background = backgroundA.clone();
    // Then
    expect(backgroundB.descriptionComment.text).toEqual(backgroundA.descriptionComment.text);
    expect(backgroundB.descriptionComment).not.toBe(backgroundA.descriptionComment);
    expect(backgroundB.preceedingComment.text).toEqual(backgroundA.preceedingComment.text);
    expect(backgroundB.preceedingComment).not.toBe(backgroundA.preceedingComment);
  });

  describe("parse", () => {
    test("should throw error if not GherkinBackground is passed", () => {
      // Given
      const obj: GherkinBackground = {} as GherkinBackground;
      // When
      // Then
      expect(() => Background.parse(obj)).toThrow();
    });

    test("should parse GherkinBackground", () => {
      // Given
      const step: GherkinStep = {
        location: { line: 41, column: 41 },
      } as GherkinStep;
      const obj: GherkinBackground = {
        background: {
          keyword: "Bkeeyword",
          location: { line: 42, column: 42 },
          name: "Bname",
          description: "BDescription",
          steps: [step],
        },
      } as GherkinBackground;
      const comments: GherkinCommentHandler = new GherkinCommentHandler([]);
      jest.spyOn(comments, "parseCommentBetween").mockReturnValue(null);
      jest.spyOn(Step, "parseAll").mockReturnValue([{} as Step]);
      // When
      const bg: Background = Background.parse(obj, comments);
      // Then
      expect(Step.parseAll).toHaveBeenCalledWith([step], comments);
      expect(comments.parseCommentBetween).toHaveBeenCalledWith(obj.background.location, step.location);
      expect(bg).toBeDefined();
      expect(bg._id).toBeDefined();
      expect(bg.keyword).toEqual("Bkeeyword");
      expect(bg.name).toEqual("Bname");
    });

    test("should parse GherkinBackground without steps", () => {
      // Given
      const obj: GherkinBackground = {
        background: {
          keyword: "Bkeeyword",
          name: "Bname",
          description: "BDescription",
        },
      } as GherkinBackground;
      // When
      jest.spyOn(Step, "parseAll").mockReturnValue([]);
      const bg: Background = Background.parse(obj);
      // Then
      expect(Step.parseAll).toHaveBeenCalledWith(undefined, undefined);
      expect(bg).toBeDefined();
      expect(bg._id).toBeDefined();
      expect(bg.keyword).toEqual("Bkeeyword");
      expect(bg.name).toEqual("Bname");
      expect(bg.steps).toEqual([]);
    });
  });
});
