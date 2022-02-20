export interface GherkinComment {
    location: GherkinLocation;
    text: string;
}

export interface GherkinDocument {
    gherkinDocument: {
        uri: string;
        feature: GherkinFeature;
        comments?: GherkinComment[];
    };
}

export interface GherkinFeature {
    location: GherkinLocation;
    tags: GherkinTag[];
    language: string;
    keyword: string;
    name: string;
    description: string;
    children: (GherkinRule | GherkinBackground | GherkinScenario)[];
}

export interface GherkinRule {
    rule: {
        id?: string;
        location: GherkinLocation;
        tags: GherkinTag[];
        keyword: string;
        name: string;
        description: string;
        children: (GherkinBackground | GherkinScenario)[];
    };
}

export function isGherkinRule(obj: unknown): obj is GherkinRule {
  return !!(obj as GherkinRule).rule;
}

export interface GherkinBackground {
    background: {
        id?: string;
        location: GherkinLocation;
        keyword: string;
        name: string;
        description: string;
        steps: GherkinStep[];
    };
}

export function isGherkinBackground(obj: unknown): obj is GherkinBackground {
  return !!(obj as GherkinBackground).background;
}

export interface GherkinScenario {
    scenario: {
        id?: string;
        location: GherkinLocation;
        tags: GherkinTag[];
        keyword: string;
        name: string;
        description: string;
        steps: GherkinStep[];
        examples?: GherkinExamples[];
    };
}

export function isGherkinScenario(obj: unknown): obj is GherkinScenario {
  return !!(obj as GherkinScenario).scenario;
}

export interface GherkinLocation {
    line: number;
    column: number;
}

export interface GherkinTag {
    id?: string;
    location: GherkinLocation;
    name: string;
}

export interface GherkinStep {
    id?: string;
    location: GherkinLocation;
    keyword: string;
    text: string;
    dataTable?: GherkinDataTable;
    docString?: GherkinDocString;
}

export interface GherkinDataTable {
    location: GherkinLocation;
    rows: GherkinTableRow[];
}

export interface GherkinTableRow {
    id?: string;
    location: GherkinLocation;
    cells: GherkinTableCell[];
}

export interface GherkinTableCell {
    location: GherkinLocation;
    value: string;
}

export interface GherkinDocString {
    location: GherkinLocation;
    content: string;
    delimiter: string;
    mediaType: string;
}

export interface GherkinExamples {
    id?: string;
    location: GherkinLocation;
    tags: GherkinTag[];
    keyword: string;
    name: string;
    tableHeader: GherkinTableRow;
    tableBody: GherkinTableRow[];
}
