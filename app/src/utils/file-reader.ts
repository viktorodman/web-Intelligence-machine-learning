import { readFile, readdir, writeFile } from 'fs/promises'
import { Iris } from '../types/iris';
import { MLCategory, MLData } from '../types/ml-data';

export const readCSVRowsFromFile =  async (path: string): Promise<string[]> => {
    const linesFromFile = await readFile(path, 'utf8');
    const rows = linesFromFile.split('\n');

    return rows;
}

