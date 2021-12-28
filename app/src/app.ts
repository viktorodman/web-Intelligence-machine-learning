import { MLData } from "./types/ml-data";
import { readCSVRowsFromFile } from "./utils/file-reader";
import { createMLDataFromCSVRows } from "./utils/ml-data";

const main = async (args: string[]) => {
    console.log(args)
    const path = args[2]

    const csvRows: string[] = await readCSVRowsFromFile(path);
    const mlData: MLData = createMLDataFromCSVRows(csvRows, path);
    
    console.log(mlData)
}

main(process.argv);