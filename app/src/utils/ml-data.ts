import { CSVData,  MLData } from "../types/ml-data";
import { readCSVRowsFromFile } from "./file-reader";

export const createDataFromCSVRows = async (path: string): Promise<CSVData> => {
    const csvRows: string[] = await readCSVRowsFromFile(path);

    const attributeColumns = csvRows[0].split(',').slice(0, -1);
    const attributesMap: Map<string, number> = createAttributesMap(attributeColumns);
    const labelsMap: Map<string, number> = new Map<string, number>();
    const data: Array<Array<number>> = []

    let labelsCounter = 0

    for (let i = 1; i < csvRows.length; i++) {
        const rowData = csvRows[i].split(',')
        const dataLabel = rowData.splice(-1, 1)[0].trim()

        if (dataLabel.length > 0) {
            if (!labelsMap.has(dataLabel)) {
                labelsMap.set(dataLabel, labelsCounter);
                labelsCounter++;
            }
    
            const labelData = labelsMap.get(dataLabel)
    
            if (labelData !== undefined) {
                data.push(createRowData(rowData, labelData));
            }
        }

       

    }

    return {
        attributes: attributesMap,
        categoryLabels: labelsMap,
        examples: data
    }
}

export const getLabels = (csvData: CSVData) => {
    const labels = []

    for (const l of csvData.categoryLabels.values()) {
        labels.push(l)
    }

    return labels;
}

const createRowData = (row: string[], labelNumber: number): number[] => {
    const rowDataToNumber: number[] = []

    for (const data of row) {
        rowDataToNumber.push(Number(data))
    }

    rowDataToNumber.push(labelNumber)

    return rowDataToNumber
}

const createAttributesMap = (attributes: string[]): Map<string, number> => {
    const attributesMap: Map<string, number> = new Map<string, number>();

    for (let i = 0; i < attributes.length; i++) {
        attributesMap.set(attributes[i], i)
    }

    return attributesMap
}

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