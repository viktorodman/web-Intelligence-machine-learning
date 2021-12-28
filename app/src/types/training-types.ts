export type Result = {
    attribute: string,
    mean: number;
    stdev: number
}

export type TrainingResult = {
    category: string,
    results: Result[]
}
