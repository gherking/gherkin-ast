export interface GherkinDocument {
    gherkinDocument: {
        uri: string;
        feature: GherkinFeature;
    };
}

export interface GherkinFeature {
    location: GherkinLocation;
    tags: GherkinTag[];
    language: string;
    keyword: string;
    name: string;
    description: string;
    children: Array<GherkinBackground | GherkinScenario>;
}

export interface GherkinBackground {
    background: {
        location: GherkinLocation;
        keyword: string;
        name: string;
        description: string;
        steps: GherkinStep[];
    };
}

export interface GherkinScenario {
    scenario: {
        location: GherkinLocation;
        tags: GherkinTag[];
        keyword: string;
        name: string;
        description: string;
        steps: GherkinStep[];
        examples?: GherkinExamples[];
    };
}

export interface GherkinLocation {
    line: number;
    column: number;
}

export interface GherkinTag {
    location: GherkinLocation;
    name: string;
}

export interface GherkinStep {
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
}

export interface GherkinExamples {
    location: GherkinLocation;
    tags: GherkinTag[];
    keyword: string;
    name: string;
    tableHeader: GherkinTableRow;
    tableBody: GherkinTableRow[];
}
