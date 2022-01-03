import { readFile } from 'fs/promises'

export const readCSVRowsFromFile =  async (path: string): Promise<string[]> => {
    const linesFromFile = await readFile(path, 'utf8');
    const rows = linesFromFile.split('\n');

    return rows;
}

