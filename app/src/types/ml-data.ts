export type MLCategory = {
    name: string;
    values: Array<Array<number>>
}

export type MLData = {
    fileName: string;
    attributeNames: string[]
    categories: MLCategory[]
}

