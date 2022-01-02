import NaiveBayes from "./models/naive-bayes";
import { CSVData, MLData } from "./types/ml-data";
import { readCSVRowsFromFile } from "./utils/file-reader";
import { createDataFromCSVRows, createMLDataFromCSVRows } from "./utils/ml-data";
import { train } from "./utils/training";

const main = async (args: string[]) => {
    console.log(args)
    const path = args[2]
    const csvRows: string[] = await readCSVRowsFromFile(path);
    const csvData: CSVData = createDataFromCSVRows(csvRows);

    const naiveBayes = new NaiveBayes()
    const labels = []

    for (const l of csvData.categoryLabels.values()) {
        labels.push(l)
    }

    naiveBayes.fit(csvData.examples, labels)

    const actual = csvData.examples.map(d => d).map(d2 => d2[d2.length -1])

    console.log(actual)
    const predictions = naiveBayes.predict(csvData.examples);

    const accurracy = naiveBayes.accuracy_score(predictions, actual);

    console.log(accurracy)
}

main(process.argv);