import { v4 } from "uuid";

export class UniqueObject {
    // @ts-ignore
    public _id: string;

    constructor() {
        this._id = v4();
    }
}