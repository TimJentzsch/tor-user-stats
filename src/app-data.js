"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var package_json_1 = __importDefault(require("../package.json"));
var appData = {
    name: package_json_1.default.name,
    description: package_json_1.default.description,
    version: package_json_1.default.version,
};
exports.default = appData;
