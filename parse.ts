import { normalize, join } from "path";
import { fromPaths } from "gherkin";
import { writeFileSync } from "fs";

describe("Test", () => {
    /*test("Test", (cb) => {
        const featurePath: string = normalize(join(__dirname, "..", "test", "data", "base.feature"));
        //const buff: any = Buffer.from("");
        //const writeable: any = createWriteStream(buff);
        console.log(featurePath);
        const stream: any = fromPaths([featurePath]);
        console.log(stream);
        stream.on("data", (data: any): void => {
            if (data.gherkinDocument) {
                writeFileSync("./ast.json", JSON.stringify(data, null, 2), "utf8");
            }
        });
        stream.on("close", cb);
    });*/
});