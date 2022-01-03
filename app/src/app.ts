import { Method } from "./enums/method";
import NaiveBayes from "./models/naive-bayes";
import { CSVData } from "./types/ml-data";
import { UserArgs } from "./types/user-args";
import { readCSVRowsFromFile } from "./utils/file-reader";
import { createDataFromCSVRows, createMLDataFromCSVRows, getLabels } from "./utils/ml-data";
import { showCrossValidationResults, showTrainingResults } from "./utils/result-output";
import { readUserArgs } from "./utils/user-input";
import inquirer from 'inquirer';

const main = async (args: string[]) => {
    const userArgs: UserArgs = readUserArgs(args); 
    const csvData: CSVData = await createDataFromCSVRows(userArgs.filepath);
    const labels = getLabels(csvData);
    const naiveBayes = new NaiveBayes();

    if (userArgs.method === Method.Training) {
        naiveBayes.fit(csvData.examples, labels);
        const predictions = naiveBayes.predict(csvData.examples);
        const actual = csvData.examples.map(d => d).map(d1 => d1[d1.length - 1])
        const accuracy = naiveBayes.accuracy_score(predictions, actual)
        const confusionMatrix = naiveBayes.confusion_matrix(predictions, actual);

        showTrainingResults({
            fileInfo: {
                filename: userArgs.filename,
                noAttributes: csvData.attributes.size,
                noClasses: csvData.categoryLabels.size,
                noExamples: csvData.examples.length
            },
            accuracy: accuracy,
            confusion_matrix: confusionMatrix
        })
    } else if(userArgs.method === Method.CrossValid) {
        const quetions = [{
            type: 'list',
            name: 'choice',
            message: 'Number of folds?',
            choices: [3, 5, 10]
        }]

        const answer = await inquirer.prompt(quetions)
        const noFolds = answer.choice

        const result = naiveBayes.crossval_predict(csvData.examples, labels, noFolds)
        
        showCrossValidationResults({
            fileInfo: {
                filename: userArgs.filename,
                noAttributes: csvData.attributes.size,
                noClasses: csvData.categoryLabels.size,
                noExamples: csvData.examples.length
            },
            accuracy: result
        })
    }
}

main(process.argv);