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
}

main(process.argv);