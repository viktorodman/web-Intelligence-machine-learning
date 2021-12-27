import { readMLDataFromCSV } from "./utils/file-reader";

const main = async (args: string[]) => {
    console.log(args)
    const path = args[2]

    const data = await readMLDataFromCSV(path);
    console.log(data)
}

main(process.argv);