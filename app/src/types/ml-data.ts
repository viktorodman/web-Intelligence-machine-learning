export type MLCategory = {
    name: string;
    values: Array<Array<number>>
}

export type MLData = {
    fileName: string;
    attributeNames: string[]
    categories: MLCategory[]
}

export type CSVData = {
    examples: Array<Array<number>>;
    categoryLabels: Map<string, number>;
    attributes: Map<string, number>;
}

