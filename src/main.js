"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var analizer_1 = __importDefault(require("./analizer"));
var app_data_1 = __importDefault(require("./app-data"));
var logger_1 = __importDefault(require("./logger"));
var reddit_api_1 = require("./reddit-api");
var logger = new logger_1.default('Main');
logger.info("Started " + app_data_1.default.name + "/v" + app_data_1.default.version);
var args = process.argv.slice(2);
var userName = reddit_api_1.redditConfig.userName;
if (args.length > 0) {
    userName = args[0];
}
analizer_1.default(userName);
