import { Background, Step } from "../../src";
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
        expect(backgroundB).not.toBe(backgroundA);
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
            const obj: GherkinBackground = {
                background: {
                    keyword: "Bkeeyword",
                    name: "Bname",
                    description: "BDescription",
                    steps: [{} as GherkinStep],
                },
            } as GherkinBackground;
            // When
            jest.spyOn(Step, "parseAll").mockReturnValue([{} as Step]);
            const bg: Background = Background.parse(obj);
            // Then
            expect(Step.parseAll).toHaveBeenCalledWith([{}], undefined);
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
            jest.spyOn(Step, "parseAll").mockReturnValue([{} as Step]);
            const bg: Background = Background.parse(obj);
            // Then
            expect(Step.parseAll).toHaveBeenCalledWith([], undefined);
            expect(bg).toBeDefined();
            expect(bg._id).toBeDefined();
            expect(bg.keyword).toEqual("Bkeeyword");
            expect(bg.name).toEqual("Bname");
            expect(bg.steps).toEqual([]);
        });
    });
});
