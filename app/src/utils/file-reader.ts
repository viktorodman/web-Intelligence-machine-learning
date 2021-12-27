import { readFile, readdir, writeFile } from 'fs/promises'
import { Iris } from '../types/iris';
import { MLData } from '../types/ml-data';

export const readMLDataFromCSV =  async (path: string): Promise<MLData> => {
    const linesFromFile = await readFile(path, 'utf8');
    const rows = linesFromFile.split('\n');
    const fileNamePaths = path.split("/");

    const mlData: MLData = {
        file_name: fileNamePaths[fileNamePaths.length -1],
        class_names: new Set<string>(),
        attributes: []
    };
    

    for (let i = 1; i < rows.length - 1; i++) {
        const data = rows[i].split(',')
        mlData.class_names.add(data.splice(-1, 1)[0]);
        const tempData = []

        for (const attribute of data) {
            tempData.push(Number(attribute))
        }

        mlData.attributes.push(tempData)
    }

    return mlData
}