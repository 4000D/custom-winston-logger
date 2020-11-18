import type { Logger } from "winston";
import "winston-daily-rotate-file";
export interface OptionsInterface {
    consoleColor: boolean;
    disableFile: boolean;
    level: "debug" | "info";
    errorLogFileName: string;
    combinedLogFileName: string;
    dailyRotateFileOptions: {
        dirname: string;
        datePattern: string;
        zippedArchive: boolean;
        maxSize: string;
        maxFiles: string;
    };
}
/**
 * @param {OptionsInterface} opts  new options to override
 */
export declare function setup(opts: OptionsInterface): void;
/**
 * @param {String} label label for the logger
 * @return {Logger}
 */
export default function getLogger(label?: string): Logger;
//# sourceMappingURL=index.d.ts.map