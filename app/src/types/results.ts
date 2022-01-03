export type FileInfo = {
    filename: string,
    noExamples: number,
    noAttributes: number,
    noClasses: number,
}

export type TrainingResults = {
    fileInfo: FileInfo
    accuracy: number,
    confusion_matrix: number[][]
}

export type CrossValidationResults = {
    fileInfo: FileInfo,
    accuracy: number[]
}