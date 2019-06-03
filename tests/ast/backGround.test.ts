import { Background, Step } from "../../src";
import { GherkinBackground, GherkinStep } from "../../src/gherkinObject";

describe("Background", () => {
    test("should create model of a Background", () => {
        // Given
        // When
        const backGround: Background = new Background("Bkeeyword", "Bname", "Bdesc");
        // Then
        expect(backGround).toBeDefined();
        expect(backGround.keyword).toEqual("Bkeeyword");
    });

    test("should have a method to clone it", () => {
        // Given
        const backGroundA: Background = new Background("Bkeeyword", "Bname", "Bdesc");
        // When
        const backGroundB: Background = backGroundA.clone();
        // Then
        expect(backGroundB.keyword).toEqual(backGroundA.keyword);
        expect(backGroundB.name).toEqual(backGroundA.name);
        expect(backGroundB.description).toEqual(backGroundA.description);
        expect(backGroundB).not.toBe(backGroundA);
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
            jest.spyOn(Step, "parse").mockReturnValue({} as Step);
            const bg: Background = Background.parse(obj);
            // Then
            expect(Step.parse).toHaveBeenCalledWith({}, 0, [{}]);
            expect(bg).toBeDefined();
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
            const bg: Background = Background.parse(obj);
            // Then
            expect(bg).toBeDefined();
            expect(bg.keyword).toEqual("Bkeeyword");
            expect(bg.name).toEqual("Bname");
            expect(bg.steps).toEqual([]);
        });
    });
});
