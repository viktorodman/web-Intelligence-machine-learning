import { train } from "../utils/training";

export default class NaiveBayes {
    private summaries: Map<number, Array<Array<number>>> = new Map<number, Array<Array<number>>>();

    public fit(x: number[][], y: number[]): void {
        this.summaries = this.summarizeByClass(x, y);
    }

    public predict(x: number[][]): number[] {
        const predictions = []
        
        for (const row of x) {
            const probabilities: Map<number, number> = this.calculateClassProbabilities(this.summaries, row);
            let bestLabel = Number.MAX_SAFE_INTEGER;
            let bestProb = -1;

            for (const [classValue, probability] of probabilities) {
                if (bestLabel === Number.MAX_SAFE_INTEGER || probability > bestProb) {
                    bestProb = probability;
                    bestLabel = classValue;
                }
            }
            predictions.push(bestLabel)
        }

        return predictions;
    }

    public crossval_predict(x: number[][], y: number[], noFolds: number) {
        const folds = this.crossValidationSplit(x, noFolds);
        const scores = []

        for (let i = 0; i < folds.length; i++) {
            const fold = folds[i];
            let trainSet = [...folds];
            trainSet.splice(i, 1);
            const newTrainSet = this.mergeNested(trainSet);
            const testSet = [];

            for (const row of fold) {
                const rowCopy = [...row];
                testSet.push(rowCopy);
                rowCopy[rowCopy.length -1] = Number.MAX_SAFE_INTEGER;
            }
            const predicted = this.naiveBayes(newTrainSet, testSet, y);
            let actual = fold.map(f => f).map(g => g[g.length -1])
            const accuracy = this.accuracy_score(predicted, actual);
            scores.push(accuracy);
        }

        return scores;
    }

    public naiveBayes(trainSet: number[][], testSet: number[][], labels: number[]) {
        this.summaries = this.summarizeByClass(trainSet, labels)
        return this.predict(testSet)
        
    }

    

    public mergeNested(arr: number[][][]) {
        const sum = [];
        for (const outer of arr) {
            for (const inner of outer) {
                sum.push(inner)
            }
        }

        return sum;
    }

    public crossValidationSplit(dataset: number[][], noFolds: number) {
        const dataSetSplit = [];
        const dataSetCopy = [...dataset];
        const foldSize = Math.round((dataset.length / noFolds));

        for (let i = 0; i < noFolds; i++) {
            const fold = []
            while (fold.length < foldSize) {
                const index = Math.floor(Math.random() * (dataSetCopy.length));
                fold.push(dataSetCopy.splice(index, 1)[0])
            }
            dataSetSplit.push(fold);
        }

        return dataSetSplit;
    }

    public confusion_matrix(preds: number[], y:number[]): number[][] {
        const matrix: number[][] = [];

        const unique = new Set(y);

        for (const val of unique) {
            const row = [];
            for (const val2 of unique) {
                row.push(0)
            }
            matrix.push(row);
        }

        
        for (let i = 0; i < preds.length; i++) {
            const currentPred = preds[i];
            const actual = y[i];
            
            if (currentPred === actual) {
                matrix[currentPred][currentPred] += 1;
            } else {
                matrix[actual][currentPred] += 1;
            }
        }
       

        return matrix
    }

    public accuracy_score(preds: number[], y: number[]): number {
        let correct = 0;

        for (let i = 0; i < preds.length; i++) {
            if(preds[i] === y[i]) {
                correct++;
            }
        }

        return ((correct / preds.length) * 100)
    }


    public calculateClassProbabilities(summaries: Map<number, Array<Array<number>>>, row: number[]): Map<number, number> {
        const probabilities = new Map<number, number>();
        let totalRows = this.calcTotalRows(summaries); 
        
        for (const [classValue, classSummary] of summaries) {
            probabilities.set(classValue, (classSummary[0][2] / totalRows))

            for (let i = 0; i < classSummary.length; i++) {
                let currentVal = probabilities.get(classValue);
                const x = row[i];
                const [mean, stdev] = classSummary[i];

                if (currentVal !== undefined) {
                    currentVal *= this.calculateProbability(x, mean, stdev);
                    probabilities.set(classValue, currentVal);
                }
            }   
        }

        return probabilities
    }

    public calculateProbability(x: number, mean: number, stdev: number){
        const exponent = Math.exp((-((x-mean)**2 / (2 * stdev**2 ))))

        return (1 / (Math.sqrt(2 * Math.PI) * stdev)) * exponent
    }

    public calcTotalRows(summaries: Map<number, Array<Array<number>>>) {
        const tempRows = [];

        for (const [key, value] of summaries) {
            tempRows.push(value[0][2])
        }
        
        return this.sum(tempRows);
    }

    public summarizeByClass(dataset: Array<Array<number>>, labels: number[]) {
        const separated = this.separateByClass(dataset, labels);
        const summaries: Map<number, Array<Array<number>>> = new Map<number, Array<Array<number>>>();

        for (const [class_value, row] of separated) {
            summaries.set(class_value, this.summarizeDataSet(row))
        }

        return summaries
    }

    public stdev(numbers: Array<number>): number {
        const avg = this.mean(numbers);

        const squaredNumbers = []

        for (const number of numbers) {
            squaredNumbers.push(Math.pow((number - avg), 2));
        }

        const variance = this.sum(squaredNumbers) / (numbers.length - 1);

        return Math.sqrt(variance);
    }

    public mean(numbers: Array<number>): number {
        
        return this.sum(numbers) / numbers.length;
    }


    public sum(numbers: Array<number>): number {
        let sum = 0;

        for (const num of numbers) {
            sum += num;
        }

        return sum;
    }

    private summarizeDataSet(dataset: Array<Array<number>>): Array<Array<number>> {
        const columnResults: Array<Array<number>> = []

        for (let i = 0; i < dataset[0].length - 1; i++) {
            const columnValues = []
            for (let j = 0; j < dataset.length; j++) {
                columnValues.push(dataset[j][i])
            }

            columnResults.push([
                this.mean(columnValues),
                this.stdev(columnValues),
                columnValues.length
            ]);
        }

        return columnResults;
    }

    private separateByClass(values: Array<Array<number>>, labels: number[]): Map<number, Array<Array<number>>> {
        const separatedValues: Map<number, Array<Array<number>>> = new Map<number, Array<Array<number>>>();
        
        for (const label of labels) {
            separatedValues.set(label, []);
        }

        for (const value of values) {
            const currentLabel = separatedValues.get(value[value.length - 1]);
            currentLabel?.push(value);
        }
        
        return separatedValues;
    }
}