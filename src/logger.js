"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = __importDefault(require("winston"));
var MAX_LABEL_LENGTH = 12;
var winstonFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp(), winston_1.default.format.printf(function (info) {
    var timestamp = info.timestamp, label = info.label, level = info.level, message = info.message, args = __rest(info, ["timestamp", "label", "level", "message"]);
    var ts = timestamp.slice(0, 19).replace('T', ' ');
    var obj = Object.keys(args).length ? JSON.stringify(args, null, 2) : '';
    var printLabel = (label ? " [" + label.substring(0, MAX_LABEL_LENGTH - 3) + "]" : '').padEnd(MAX_LABEL_LENGTH);
    var printLevel = (level + ":").padEnd(17);
    return "" + ts + printLabel + " " + printLevel + " " + message + " " + obj;
}));
var winstonLogger = winston_1.default.createLogger({
    format: winstonFormat,
    level: process.env.LOG_LEVEL || 'debug',
    transports: [new winston_1.default.transports.Console()],
});
// winstonLogger.info(`[Logger] Started logger with loglevel: ${winstonLogger.level}`, 'Logger');
var Logger = /** @class */ (function () {
    function Logger(customLabel) {
        this.customLabel = customLabel;
    }
    /** Logs a debug message.
     *
     * @param  {string} message - The message to debug-log.
     * @returns void
     */
    Logger.prototype.debug = function (message, label) {
        if (label === void 0) { label = this.customLabel; }
        winstonLogger.debug({ message: message, label: label });
    };
    /** Logs an info message.
     *
     * @param  {string} message - The message to info-log.
     * @returns void
     */
    Logger.prototype.info = function (message, label) {
        if (label === void 0) { label = this.customLabel; }
        winstonLogger.info({ message: message, label: label });
    };
    /** Logs a warning message.
     *
     * @param  {string} message - The message to warn-log.
     * @returns void
     */
    Logger.prototype.warn = function (message, label) {
        if (label === void 0) { label = this.customLabel; }
        winstonLogger.warn({ message: message, label: label });
    };
    /** Logs an error message.
     *
     * @param  {string} message - The message to error-log.
     * @returns void
     */
    Logger.prototype.error = function (message, label) {
        if (label === void 0) { label = this.customLabel; }
        winstonLogger.error({ message: message, label: label });
    };
    return Logger;
}());
exports.default = Logger;
