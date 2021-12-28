import { MLData } from "../types/ml-data";
import { Result, TrainingResult } from "../types/training-types";

export const train = (mlData: MLData) => {
    const trainingResults: TrainingResult[] = [];

    for (const category of mlData.categories) {
        const categoryResults: Result[] = []

        for (let i = 0; i < mlData.attributeNames.length; i++) {
            let attributeSum = 0;
            const values: number[] = []

            for (let j = 0; j < category.values.length; j++) {
                attributeSum += category.values[j][i]
                values.push(category.values[j][i]);
            }

            const mean = attributeSum / values.length
            const standardDeviation = calcStandardDeviation(values, mean);

            categoryResults.push({
                attribute: mlData.attributeNames[i],
                mean: mean,
                stdev: standardDeviation
            })
        }

        trainingResults.push({
            category: category.name, 
            results: categoryResults
        })
    }

    return trainingResults
}

const calcStandardDeviation = (values: number[], mean: number) => {
    const squaredDiff: number[] = []
    let sqdDiffSum = 0

    for (const value of values) {
        const diff = Math.abs(value - mean);
        const diffSquared = Math.pow(diff, 2)

        squaredDiff.push(
            diffSquared
        );

        sqdDiffSum += diffSquared
    }

    return Math.sqrt((sqdDiffSum / squaredDiff.length))
}