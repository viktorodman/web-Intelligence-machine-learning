import { Method } from "../enums/method";
import { UserArgs } from "../types/user-args";

export const readUserArgs = (args: string[]): UserArgs => {
    const methodEnum = args[3] as Method
    const filepathParts = args[2].split("/");
    return {
        filepath: args[2],
        filename: filepathParts[filepathParts.length - 1],
        method: methodEnum
    }
}