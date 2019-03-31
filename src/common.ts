export const safeString = (s: string = ""): string => s.replace(/\s/g, "_");

export const normalizeString = (s: string = ""): string => {
    return s.split("\n")
        .map((line: string): string => line.trim())
        .join("\n");
};

export const replaceAll = (s: string, key: RegExp | string, value: string): string => {
    if (!(key instanceof RegExp)) {
        key = new RegExp(key, "g");
    }
    return s.replace(key, value);
};

interface Clonable<T> {
    clone(): T;
}
export const cloneArray = <T extends Clonable<T>>(array: T[]): T[] => {
    return array ? array.map((e: T): T => (e as Clonable<T>).clone()) : [];
}

interface Replacable {
    replace(key: RegExp | string, value: string): void;
}
export const replaceArray = <T extends Replacable>(array: T[], key: RegExp | string, value: string): void => {
    array && array.forEach((e: T): void => {
        e.replace(key, value);
    });
};
