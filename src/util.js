"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repeatEndWith = exports.repeat = exports.limitStart = exports.limitReduceEnd = exports.limitEnd = void 0;
/** Limits the array, returning the first elements. */
function limitEnd(array, limit) {
    if (limit !== undefined && array.length > limit) {
        return array.slice(0, limit);
    }
    return array;
}
exports.limitEnd = limitEnd;
/**
 * Limits the array to the given length and reduces the rest to the last element.
 * @param array The array to limit and reduce.
 * @param callbackfn The reduction function.
 * @param limit The limit of the array.
 */
function limitReduceEnd(array, callbackfn, limit) {
    if (limit !== undefined && array.length > limit) {
        var limitedArray = array.slice(0, limit);
        var end = array.slice(limit, array.length).reduce(callbackfn);
        return limitedArray.concat(end);
    }
    return array;
}
exports.limitReduceEnd = limitReduceEnd;
/** Limits the array, returning the last elements. */
function limitStart(array, limit) {
    if (limit !== undefined && array.length > limit) {
        return array.slice(array.length - limit, array.length);
    }
    return array;
}
exports.limitStart = limitStart;
/**
 * Repeats the given item by the given number of times.
 * @param item The item to repeat.
 * @param count The number of repitions.
 */
function repeat(item, count) {
    var repeatArray = [];
    while (repeatArray.length < count) {
        if (Array.isArray(item)) {
            repeatArray = repeatArray.concat(item.slice(0, count - repeatArray.length));
        }
        else {
            repeatArray.push(item);
        }
    }
    return repeatArray;
}
exports.repeat = repeat;
/**
 * Repeats the given item by the given number of times and append the other item.
 * @param repeatItem The item to repeat.
 * @param count The number of repetitions.
 * @param endItem The item to end with.
 */
function repeatEndWith(repeatItem, count, endItem) {
    var repeatArray = repeat(repeatItem, count);
    return repeatArray.concat(endItem);
}
exports.repeatEndWith = repeatEndWith;
