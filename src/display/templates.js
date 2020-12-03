"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.layoutTemplate = void 0;
var colors_1 = __importDefault(require("./colors"));
/** The layout template for the diagrams. */
// eslint-disable-next-line import/prefer-default-export
exports.layoutTemplate = {
    showlegend: false,
    paper_bgcolor: colors_1.default.transparent(),
    plot_bgcolor: colors_1.default.transparent(),
    modebar: {
        bgcolor: colors_1.default.transparent(),
        color: colors_1.default.surface(),
        activecolor: colors_1.default.onSurface(),
    },
    font: {
        color: colors_1.default.onSurface(),
    },
    width: 500,
};
