import chalk from "chalk";
import { CrossValidationResults, TrainingResults } from "../types/results";

export const showTrainingResults = (trainingResults: TrainingResults) => {
    console.log(
`
File: ${chalk.yellow(trainingResults.fileInfo.filename)}
Number of examples: ${chalk.yellow(trainingResults.fileInfo.noExamples)}
Number of attributes: ${chalk.yellow(trainingResults.fileInfo.noAttributes)}
Number of classes: ${chalk.yellow(trainingResults.fileInfo.noClasses)}

Accuracy: ${chalk.yellow(trainingResults.accuracy)}%

Confusion Matrix: 
`)

console.table(trainingResults.confusion_matrix)
}

export const showCrossValidationResults = (crossValidationResults: CrossValidationResults) => {
    console.log(
`
File: ${chalk.yellow(crossValidationResults.fileInfo.filename)}
Number of examples: ${chalk.yellow(crossValidationResults.fileInfo.noExamples)}
Number of attributes: ${chalk.yellow(crossValidationResults.fileInfo.noAttributes)}
Number of classes: ${chalk.yellow(crossValidationResults.fileInfo.noClasses)}

Accuracy by fold: 
`)

console.table(crossValidationResults.accuracy)

console.log(`Total accuracy: ${calcTotalAccuracy(crossValidationResults.accuracy)}`)
}

const calcTotalAccuracy = (accuracy: number[]) => {
    let sum = 0
    
    for (const val of accuracy) {
        sum += val;
    }

    return sum / accuracy.length
}

