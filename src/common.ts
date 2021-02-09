export const safeString = (s = ""): string => s.replace(/\s/g, "_");

export const normalizeString = (s = ""): string => {
    return s.split("\n")
        .map((line: string): string => line.trim())
        .join("\n");
};

export const replaceAll = (s: string, key: RegExp | string, value: string): string => {
    if (!(key instanceof RegExp)) {
        key = new RegExp(key, "g");
    }
    if (!s || typeof s !== "string") {
        return s;
    }
    return s.replace(key, value);
};

interface Clonable<T> {
    clone(): T;
}
export const cloneArray = <T extends Clonable<T>>(array: T[]): T[] => {
    return Array.isArray(array) ? array.map((e: T): T => (e as Clonable<T>).clone()) : [];
};

interface Replacable {
    replace(key: RegExp | string, value: string): void;
}
export const replaceArray = <T extends Replacable>(array: T[], key: RegExp | string, value: string): void => {
    Array.isArray(array) && array.forEach((e: T): void => {
        e.replace(key, value);
    });
};
