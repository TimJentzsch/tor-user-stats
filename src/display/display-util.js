"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVariable = exports.fromTemplate = void 0;
/**
 * Creates an object from a template.
 * @param template The template to create the object from.
 * @param obj The object to create from the template.
 */
function fromTemplate(template, obj) {
    var result = template;
    // Override the template values with the ones set in the object
    Object.keys(obj).forEach(function (key) {
        result[key] = obj[key];
    });
    return result;
}
exports.fromTemplate = fromTemplate;
/**
 * Gets the value of the given CSS variable.
 * @param varName The name of the CSS variable.
 */
function getVariable(varName) {
    return getComputedStyle(document.documentElement).getPropertyValue("--" + varName);
}
exports.getVariable = getVariable;
