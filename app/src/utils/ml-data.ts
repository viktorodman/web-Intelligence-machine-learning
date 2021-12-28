import { MLCategory, MLData } from "../types/ml-data";

export const createMLDataFromCSVRows = (csvRows: string[], filePath: string) => {
    const attributes = csvRows[0].split(',')
    const filePathParts = filePath.split("/")

    const mlData: MLData = {
        fileName: filePathParts[filePathParts.length - 1],
        attributeNames: attributes.slice(0, -1),
        categories: []
    }

    for (let i = 1; i < csvRows.length - 1; i++) {
        let categoryFound = false;
        const rowData = csvRows[i].split(',')
        const dataCategory = rowData.splice(-1, 1)[0].trim()    

        for (const category of mlData.categories) {
            if (category.name === dataCategory) {
                category.values.push(convertStringArrayToNumberArray(rowData))
                categoryFound = true
            }
        };

        if (!categoryFound) {
            mlData.categories.push({
                name: dataCategory,
                values: [convertStringArrayToNumberArray(rowData)]
            })
        }
    }

    return mlData
}

const convertStringArrayToNumberArray = (stringArray: string[]): number[] => {
    const numberArray: number[] = [];

    for (const str of stringArray) {
        numberArray.push(Number(str));
    }

    return numberArray;
}