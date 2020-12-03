"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.countTags = exports.specialTags = exports.CountTag = exports.Tag = void 0;
var Tag = /** @class */ (function () {
    function Tag(
    /** The id of the tag. */
    id, 
    /** The name of the tag. */
    name) {
        this.id = id;
        this.name = name;
    }
    Tag.prototype.toString = function () {
        return this.name;
    };
    return Tag;
}());
exports.Tag = Tag;
var CountTag = /** @class */ (function (_super) {
    __extends(CountTag, _super);
    function CountTag(
    /** The name of the tag. */
    name, 
    /** The lower bound for the transcription count. */
    lowerBound, 
    /** The upper bound for the transcription count. */
    upperBound) {
        var _this = _super.call(this, name.toLocaleLowerCase(), name) || this;
        _this.lowerBound = lowerBound;
        _this.upperBound = upperBound;
        return _this;
    }
    CountTag.prototype.toString = function () {
        if (this.lowerBound === this.upperBound) {
            return this.name + " (" + this.lowerBound + ")";
        }
        if (this.upperBound === Infinity) {
            return this.name + " (" + this.lowerBound + "+)";
        }
        return this.name + " (" + this.lowerBound + "-" + this.upperBound + ")";
    };
    return CountTag;
}(Tag));
exports.CountTag = CountTag;
// - SPECIAL TAGS -----------------------------------------
/** 100 transcriptions in 24h. */
var twentyFour = new Tag('twentyFour', '100/24h Club');
/** Mod on r/TranscribersOfReddit. */
var mod = new Tag('mod', 'Mod');
exports.specialTags = {
    twentyFour: twentyFour,
    mod: mod,
};
// - COUNT TAGS -------------------------------------------
/** Visitor, 0. */
var visitor = new CountTag('Visitor', 0, 0);
/** Initiate, 1-49. */
var initiate = new CountTag('Initiate', 1, 49);
/** Green, 50-99. */
var green = new CountTag('Green', 50, 99);
/** Teal, 100-249. */
var teal = new CountTag('Teal', 100, 249);
/** Purple, 250-499. */
var purple = new CountTag('Purple', 250, 499);
/** Gold, 500-999. */
var gold = new CountTag('Gold', 500, 999);
/** Diamond, 1000-2499. */
var diamond = new CountTag('Diamond', 1000, 2499);
/** Ruby, 2500-4999. */
var ruby = new CountTag('Ruby', 2500, 4999);
/** Topaz, 5000-9999. */
var topaz = new CountTag('Topaz', 5000, 9999);
/** Jade, 10000+. */
var jade = new CountTag('Jade', 10000, Infinity);
/** Tags for the transcription count. */
exports.countTags = [visitor, initiate, green, teal, purple, gold, diamond, ruby, topaz, jade];
/** All available tags. */
var tags = {
    specialTags: exports.specialTags,
    countTags: exports.countTags,
};
exports.default = tags;
