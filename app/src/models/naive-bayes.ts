export default class NaiveBayes {
    private trainingResults: Map<number, Array<Array<number>>> = new Map<number, Array<Array<number>>>();

    public fit(x: number[][], y: number[]): void {
        const separatedValues: Map<number, Array<Array<number>>> = this.separateValues(x);

        for (const [key, value] of separatedValues) {
            const summarizedDataSet: Array<Array<number>> = this.summarizeDataSet(value);
            
            for (const dataSet of summarizedDataSet) {
                const pdf = this.calcPDF(dataSet[0], dataSet[1], dataSet[2]);
                dataSet.push(pdf)
            }
            this.trainingResults.set(key, summarizedDataSet);
        }
        console.log(this.trainingResults)
    }

    public predict(x: number[][]): number[] {
        return []
    }

    private calcPDF(mean: number, std: number, x: number): number {
        /* const exponent = Math.exp(-(Math.pow((x-mean), 2) / (2 * Math.pow(std, 2))))


        return (1 / (Math.sqrt(2 * Math.PI) * std)) * exponent */
        const test = -(Math.pow(x-mean, 2) / (2 * Math.pow(std, 2)))

        const exponent = 1.-Math.E^(-test)
        console.log(test)
        console.log(exponent)
        return (1 / (Math.sqrt(2 * Math.PI) * std)) * exponent
    }

    private summarizeDataSet(values: Array<Array<number>>): Array<Array<number>> {
        const result: Array<Array<number>> = [];        

        for (let i = 0; i < values[0].length - 1; i++) {
            let columnSum = 0;
            const columnValues: number[] = [];

            for (let j = 0; j < values.length; j++) {
                columnSum += values[j][i];
                columnValues.push(values[j][i])
            }

            const mean = columnSum / columnValues.length
            const standardDeviation = this.calcStandardDeviation(columnValues, mean)

            result.push([mean, standardDeviation, columnValues.length])
        }

        return result;
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

    private separateValues(values: Array<Array<number>>): Map<number, Array<Array<number>>> {
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