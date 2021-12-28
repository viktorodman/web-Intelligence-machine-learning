type Result = {
    attribute: string,
    mean: number;
    stdev: number
}

export type TrainingResults = {
    category: string,
    results: Result[]
}
