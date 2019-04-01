import { resolve, join } from "path";
import { fromPaths } from "gherkin";
import { writeFileSync } from "fs";

const featurePath: string = resolve(join("test", "data", "base.feature"));
const stream: any = fromPaths([featurePath]);
stream.on("data", (data: any): void => {
    if (data.gherkinDocument) {
        writeFileSync("./ast.json", JSON.stringify(data, null, 2), "utf8");
    }
});