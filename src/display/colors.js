"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var display_util_1 = require("./display-util");
var Colors = /** @class */ (function () {
    function Colors() {
    }
    /**
     * Transparent color.
     */
    Colors.transparent = function () {
        return 'transparent';
    };
    /**
     * The primary color.
     */
    Colors.primary = function () {
        return display_util_1.getVariable('primary');
    };
    /**
     * A variant of the primary color.
     */
    Colors.primaryVariant = function () {
        return display_util_1.getVariable('primary-variant');
    };
    /**
     * The primary font-color.
     */
    Colors.onPrimary = function () {
        return display_util_1.getVariable('on-primary');
    };
    /**
     * The background color.
     */
    Colors.background = function () {
        return display_util_1.getVariable('background');
    };
    /**
     * The background font-color.
     */
    Colors.onBackground = function () {
        return display_util_1.getVariable('on-background');
    };
    /**
     * The surface color.
     */
    Colors.surface = function () {
        return display_util_1.getVariable('surface');
    };
    /**
     * The surface font-color.
     */
    Colors.onSurface = function () {
        return display_util_1.getVariable('on-surface');
    };
    /**
     * The color representing an error.
     */
    Colors.error = function () {
        return display_util_1.getVariable('error');
    };
    return Colors;
}());
exports.default = Colors;
