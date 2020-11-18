import { join } from "path";

import { transports, format, loggers } from "winston";
import type { Logger } from "winston"; // eslint-disable-line no-unused-vars
import * as Transport from "winston-transport";
import "winston-daily-rotate-file";

import filterNamespace from "./lib/filterNamespace";
import colorFormat from "./lib/colorFormat";
import enumerateErrorFormat from "./lib/enumerateErrorFormat";
import logFormat from "./lib/logFormat";

export interface OptionsInterface {
  consoleColor: boolean; // whether use color in console log output or not
  disableFile: boolean; // whether disable file log or nto
  level: "debug" | "info"; // combined log default log level
  errorLogFileName: string; // error log file name
  combinedLogFileName: string; // combined log file name
  dailyRotateFileOptions: {
    dirname: string; // log directory
    datePattern: string;
    zippedArchive: boolean;
    maxSize: string;
    maxFiles: string;
  };
}

const options: OptionsInterface = {
  consoleColor: true,
  disableFile: false,
  level: "debug",
  errorLogFileName: "error-%DATE%.log",
  combinedLogFileName: "combined-%DATE%.log",
  dailyRotateFileOptions: {
    dirname: join(process.cwd(), "logs"),
    datePattern: "YYYY-MM-DD-HH",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
  },
};

/**
 * @param {OptionsInterface} opts  new options to override
 */
export function setup(opts: OptionsInterface) {
  Object.assign(options, opts);

  if (options.disableFile) {
    getLogger("logger").info("file log disabled");
  } else {
    getLogger("logger").info(
      "log directory: %s",
      options.dailyRotateFileOptions
    );
  }
}

const silenceTransports = [
  new transports.Console({
    silent: true,
  }),
];

const createLoggerOptions = (label: string) => {
  if (!filterNamespace(label)) return { transports: silenceTransports };

  const consoleTransfortFormat = format.combine(
    enumerateErrorFormat(),
    options.consoleColor ? format.colorize() : format.uncolorize(),
    format.colorize(),
    format.splat(),
    format.timestamp(),
    format.label({ label }),
    colorFormat({ useColor: options.consoleColor }),
    logFormat
  );

  const fileTransportFormat = format.combine(
    format.uncolorize(),
    format.label({ label }),
    enumerateErrorFormat(),
    format.timestamp(),
    format.splat(),
    logFormat
  );

  const targetTransports: Transport[] = [
    new transports.Console({
      format: consoleTransfortFormat,
      stderrLevels: ["error"],
    }),
  ];

  if (!options.disableFile) {
    targetTransports.push(
      new transports.DailyRotateFile({
        level: "error",
        format: fileTransportFormat,
        filename: options.errorLogFileName,
        ...options.dailyRotateFileOptions,
      })
    );

    targetTransports.push(
      new transports.DailyRotateFile({
        filename: options.combinedLogFileName,
        format: fileTransportFormat,
        ...options.dailyRotateFileOptions,
      })
    );
  }

  return {
    level: options.level,

    transports: targetTransports,
  };
};

/**
 * @param {String} label label for the logger
 * @return {Logger}
 */
export default function getLogger(label = "") {
  if (!loggers.has(label)) loggers.add(label, createLoggerOptions(label));
  return loggers.get(label);
}
