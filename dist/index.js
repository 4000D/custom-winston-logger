"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
var path_1 = require("path");
var winston_1 = require("winston");
require("winston-daily-rotate-file");
var filterNamespace_1 = __importDefault(require("./lib/filterNamespace"));
var colorFormat_1 = __importDefault(require("./lib/colorFormat"));
var enumerateErrorFormat_1 = __importDefault(require("./lib/enumerateErrorFormat"));
var logFormat_1 = __importDefault(require("./lib/logFormat"));
var options = {
    consoleColor: true,
    disableFile: false,
    level: "debug",
    errorLogFileName: "error-%DATE%.log",
    combinedLogFileName: "combined-%DATE%.log",
    dailyRotateFileOptions: {
        dirname: path_1.join(process.cwd(), "logs"),
        datePattern: "YYYY-MM-DD-HH",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
    },
};
/**
 * @param {OptionsInterface} opts  new options to override
 */
function setup(opts) {
    Object.assign(options, opts);
    if (options.disableFile) {
        getLogger("logger").info("file log disabled");
    }
    else {
        getLogger("logger").info("log directory: %s", options.dailyRotateFileOptions);
    }
}
exports.setup = setup;
var silenceTransports = [
    new winston_1.transports.Console({
        silent: true,
    }),
];
var createLoggerOptions = function (label) {
    if (!filterNamespace_1.default(label))
        return { transports: silenceTransports };
    var consoleTransfortFormat = winston_1.format.combine(enumerateErrorFormat_1.default(), options.consoleColor ? winston_1.format.colorize() : winston_1.format.uncolorize(), winston_1.format.colorize(), winston_1.format.splat(), winston_1.format.timestamp(), winston_1.format.label({ label: label }), colorFormat_1.default({ useColor: options.consoleColor }), logFormat_1.default);
    var fileTransportFormat = winston_1.format.combine(winston_1.format.uncolorize(), winston_1.format.label({ label: label }), enumerateErrorFormat_1.default(), winston_1.format.timestamp(), winston_1.format.splat(), logFormat_1.default);
    var targetTransports = [
        new winston_1.transports.Console({
            format: consoleTransfortFormat,
            stderrLevels: ["error"],
        }),
    ];
    if (!options.disableFile) {
        targetTransports.push(new winston_1.transports.DailyRotateFile(__assign({ level: "error", format: fileTransportFormat, filename: options.errorLogFileName }, options.dailyRotateFileOptions)));
        targetTransports.push(new winston_1.transports.DailyRotateFile(__assign({ filename: options.combinedLogFileName, format: fileTransportFormat }, options.dailyRotateFileOptions)));
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
function getLogger(label) {
    if (label === void 0) { label = ""; }
    if (!winston_1.loggers.has(label))
        winston_1.loggers.add(label, createLoggerOptions(label));
    return winston_1.loggers.get(label);
}
exports.default = getLogger;
