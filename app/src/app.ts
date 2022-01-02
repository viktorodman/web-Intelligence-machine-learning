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

    const dataset = [[3.393533211,2.331273381,0],
	[3.110073483,1.781539638,0],
	[1.343808831,3.368360954,0],
	[3.582294042,4.67917911,0],
	[2.280362439,2.866990263,0],
	[7.423436942,4.696522875,1],
	[5.745051997,3.533989803,1],
	[9.172168622,2.511101045,1],
	[7.792783481,3.424088941,1],
	[7.939820817,0.791637231,1]]

    /* console.log("training") */
    naiveBayes.fit(dataset, labels)

    /* console.log("Predicting...") */
    const predictions = naiveBayes.predict([[5.7, 2.9, 4.2, 1.3]]);

    /* console.log(predictions) */

   /*  for (const pr of predictions) {
        console.log(pr)
    } */
}

main(process.argv);