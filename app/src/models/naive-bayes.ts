export default class NaiveBayes {
    private summaries: Map<number, Array<Array<number>>> = new Map<number, Array<Array<number>>>();

    public fit(x: number[][], y: number[]): void {
        this.summaries = this.summarizeByClass(x);
        console.log(summaries)
        this.calculateClassProbabilities(summaries, x[0]);
    }

    public predict(x: number[][]): number[] {
        return []
    }

    public evaluate_algorithm(dataset: number[][], n_folds:number) {
        const folds = 
    }

    public crossValidationSplit()

    public calculateClassProbabilities(summaries: Map<number, Array<Array<number>>>, row: number[]) {
        const tempRows = [];
        
        for (const [key, value] of summaries) {
            tempRows.push(value[0][2])
        }
        
        let totalRows = this.sum(tempRows); 

        const probabilities = new Map<number, number>();
        
        for (const [classValue, classSummary] of summaries) {
            probabilities.set(
                classValue,
                (classSummary[0][2] / totalRows)
            )
            for (let i = 0; i < classSummary.length; i++) {
                const tempValue = probabilities.get(classValue);
                probabilities.set(
                    classValue,
                    ((tempValue || 0) * this.calculateProbability(
                        classSummary[i].length, 
                        classSummary[i][0],
                        classSummary[i][1]
                    ))
                )
                
            }   
        }

        console.log(probabilities)
    }

    public calculateProbability(x: number, mean: number, stdev: number){
        const exponent = Math.exp(-(Math.pow((x-mean), 2) / (2 * Math.pow(stdev, 2))))
        return (1 / (Math.sqrt(2 * Math.PI) * stdev)) * exponent;
    }

    public summarizeByClass(dataset: Array<Array<number>>) {
        const separated = this.separateByClass(dataset);
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

        const variance = this.sum(squaredNumbers) / numbers.length;

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

    private calcPDF(mean: number, std: number, x: number): number {
        /* const exponent = Math.exp(-(Math.pow((x-mean), 2) / (2 * Math.pow(std, 2))))


        return (1 / (Math.sqrt(2 * Math.PI) * std)) * exponent */
        const test = (Math.pow(x-mean, 2) / (2 * Math.pow(std, 2)))

        const exponent = Math.exp(-test)
        console.log(test)
        console.log(exponent)
        return (1 / (Math.sqrt(2 * Math.PI) * std)) * exponent
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

    private calcStandardDeviation(values: number[], mean: number) {
        const squaredDiff: number[] = []
        let sqdDiffSum = 0

        for (const value of values) {
            const diff = Math.abs(value - mean);
            const diffSquared = Math.pow(diff, 2)

            squaredDiff.push(
                diffSquared
            );

            sqdDiffSum += diffSquared
        }

        return Math.sqrt((sqdDiffSum / squaredDiff.length))
    }

    private separateByClass(values: Array<Array<number>>): Map<number, Array<Array<number>>> {
        const separatedValues: Map<number, Array<Array<number>>> = new Map<number, Array<Array<number>>>();
        
        for (const value of values) {
            const currentCategory = value[value.length - 1]

            if (separatedValues.has(currentCategory)) {
                const category = separatedValues.get(currentCategory)
                category?.push(value)
            } else {
                separatedValues.set(currentCategory, [ value ])
            }
        }

        return separatedValues;
    }
}