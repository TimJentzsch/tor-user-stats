"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logStats = exports.analyzeType = exports.analyzeFormat = exports.analyzeSubreddits = exports.getTranscriptionAmount = exports.getSpecialTags = exports.getCountTag = exports.getTranscriptionAvg = exports.getTranscriptionPeak = exports.isComment = void 0;
var logger_1 = __importDefault(require("./logger"));
var reddit_api_1 = require("./reddit-api");
var tags_1 = require("./tags");
var transcription_1 = __importDefault(require("./transcription"));
var util_1 = require("./util");
var logger = new logger_1.default('Analizer');
/** Checks if a comment is an actual comment instead of a ToR bot interaction. */
function isComment(comment) {
    return !(comment.subreddit_name_prefixed === 'r/TranscribersOfReddit' &&
        // Has one of the bot keywords
        /\b(done|(un)?claim(ing)?)\b/.test(comment.body));
}
exports.isComment = isComment;
/**
 * Gets the peak transcription count during the given duration.
 * @param transcriptions The transcriptions to analyze.
 * @param duration The duration to determine the peak in, in seconds.
 */
function getTranscriptionPeak(transcriptions, duration) {
    var peak = 0;
    for (var anchorIndex = 0; anchorIndex < transcriptions.length; anchorIndex += 1) {
        // Take one transcription as anchor
        var anchor = transcriptions[anchorIndex];
        var anchorTime = anchor.createdUTC;
        var counter = 0;
        // Count all transcriptions that are within the given timeframe
        for (var index = anchorIndex; index < transcriptions.length; index += 1) {
            var cur = transcriptions[index];
            var curTime = cur.createdUTC;
            var timeDiff = anchorTime - curTime;
            // Check if the post is within the given timeframe
            if (timeDiff <= duration) {
                counter += 1;
            }
            else {
                break;
            }
        }
        // Update the maximum if necessary
        if (counter > peak) {
            peak = counter;
        }
    }
    return peak;
}
exports.getTranscriptionPeak = getTranscriptionPeak;
/**
 * Gets the average number of transcriptions made in the given timeframe.
 * @param transcriptions The transcriptions to analyze.
 * @param duration The duration to get the average for, in seconds.
 */
function getTranscriptionAvg(transcriptions, duration) {
    var count = transcriptions.length;
    // Check if transcriptions have been made
    if (count === 0) {
        return 0;
    }
    var transcriptionStart = transcriptions[transcriptions.length - 1].createdUTC;
    var transcriptionEnd = transcriptions[0].createdUTC;
    var transcriptionDur = transcriptionEnd - transcriptionStart;
    // If the timeframe is larger than the transcription frame, return the number of transcriptions
    if (transcriptionDur <= duration) {
        return count;
    }
    // Return the avg count of transcriptions in the given timeframe
    return (duration / transcriptionDur) * count;
}
exports.getTranscriptionAvg = getTranscriptionAvg;
/**
 * Gets the matching count tag for the transcriptions.
 * @param transcriptions The transcriptions to analize.
 */
function getCountTag(transcriptions) {
    var count = transcriptions.length;
    // From the highest tag downwards, search for the first match
    for (var i = tags_1.countTags.length - 1; i >= 0; i -= 1) {
        if (count >= tags_1.countTags[i].lowerBound) {
            return tags_1.countTags[i];
        }
    }
    throw new Error("No count tag found for count " + count);
}
exports.getCountTag = getCountTag;
/**
 * Returns all special tags for the given user.
 * @param userName The user to check the special tags for.
 * @param transcriptions The transcriptions of the user.
 */
function getSpecialTags(userName, transcriptions) {
    return __awaiter(this, void 0, void 0, function () {
        var spTags, isMod, dayPeak;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spTags = [];
                    return [4 /*yield*/, reddit_api_1.isToRMod(userName)];
                case 1:
                    isMod = _a.sent();
                    // Mod tag
                    if (isMod) {
                        spTags.push(tags_1.specialTags.mod);
                    }
                    dayPeak = getTranscriptionPeak(transcriptions, 24 * 60 * 60);
                    // 100/24h tag
                    if (dayPeak >= 100) {
                        spTags.push(tags_1.specialTags.twentyFour);
                    }
                    return [2 /*return*/, spTags];
            }
        });
    });
}
exports.getSpecialTags = getSpecialTags;
/**
 * Analyzes the character and word count of the transcriptions.
 * @param transcriptions The transcriptions to analize.
 */
function getTranscriptionAmount(transcriptions) {
    var count = transcriptions.length;
    var charTotal = 0;
    var charPeak = 0;
    var wordTotal = 0;
    var wordPeak = 0;
    transcriptions.forEach(function (transcrition) {
        // Determine character and word count of this transcriptions
        var charCount = transcrition.contentMD.length;
        var wordCount = transcrition.contentMD.split(/\s+/).length;
        charTotal += charCount;
        charPeak = Math.max(charPeak, charCount);
        wordTotal += wordCount;
        wordPeak = Math.max(wordPeak, wordCount);
    });
    return {
        charTotal: charTotal,
        charAvg: charTotal / count,
        charPeak: charPeak,
        wordTotal: wordTotal,
        wordAvg: wordTotal / count,
        wordPeak: wordPeak,
    };
}
exports.getTranscriptionAmount = getTranscriptionAmount;
/**
 * Analyzes the subreddits of the transcriptions.
 * @param transcriptions The transcriptions to analyze.
 */
function analyzeSubreddits(transcriptions) {
    var subStats = [];
    transcriptions.forEach(function (transcription) {
        var sub = transcription.subredditNamePrefixed;
        var stats = subStats.find(function (stat) {
            return stat.sub === sub;
        });
        if (stats) {
            stats.count += 1;
        }
        else {
            subStats.push({
                sub: sub,
                count: 1,
            });
        }
    });
    // Sort by count descending
    return subStats.sort(function (a, b) {
        return b.count - a.count;
    });
}
exports.analyzeSubreddits = analyzeSubreddits;
/**
 * Analyzes the given transcriptions by the format, e.g. 'Image' or 'Video'.
 * @param transcriptions The transcriptions to analyze.
 */
function analyzeFormat(transcriptions) {
    var formatStats = [];
    transcriptions.forEach(function (transcription) {
        var format = transcription.format;
        if (format.includes('Image')) {
            format = 'Image';
        }
        else if (format.includes('Video')) {
            format = 'Video';
        }
        var stats = formatStats.find(function (stat) {
            return stat.format === format;
        });
        if (stats) {
            stats.count += 1;
        }
        else {
            formatStats.push({
                format: format,
                count: 1,
            });
        }
    });
    // Sort by count descending
    return formatStats.sort(function (a, b) {
        return b.count - a.count;
    });
}
exports.analyzeFormat = analyzeFormat;
/**
 * Analyzes the given transcriptions by the format, e.g. 'Image' or 'Video'.
 * @param transcriptions The transcriptions to analyze.
 */
function analyzeType(transcriptions) {
    var typeStats = [];
    transcriptions.forEach(function (transcription) {
        var type = transcription.type;
        if (type) {
            // Simplify some common types
            if (type.includes('Twitter')) {
                type = 'Twitter';
            }
            else if (type.includes('Facebook')) {
                type = 'Facebook';
            }
            else if (type.includes('Tumblr')) {
                type = 'Tumblr';
            }
            else if (type.includes('Reddit')) {
                type = 'Reddit';
            }
            else if (type.includes('Text Message')) {
                type = 'Chat';
            }
            var stats = typeStats.find(function (stat) {
                return stat.type === type;
            });
            if (stats) {
                stats.count += 1;
            }
            else {
                typeStats.push({
                    type: type,
                    count: 1,
                });
            }
        }
    });
    // Sort by count descending
    return typeStats.sort(function (a, b) {
        return b.count - a.count;
    });
}
exports.analyzeType = analyzeType;
function logStats(label, stats) {
    var logLabel = label + ":";
    logger.info(logLabel.padEnd(14) + " " + stats);
}
exports.logStats = logStats;
/** Analizes the transcriptions of the given user. */
function analizeUser(userName) {
    return __awaiter(this, void 0, void 0, function () {
        var allCount, commentCount, transcriptionCount, transcriptions, accuracy, hourPeak, dayPeak, weekPeak, yearPeak, hourAvg, dayAvg, weekAvg, yearAvg, amounts, formatStats, typeStats, subStats, countTag, countText, spTags, spText, tagText;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger.debug("Starting analysis for /u/" + userName + ":");
                    allCount = 0;
                    commentCount = 0;
                    transcriptionCount = 0;
                    transcriptions = [];
                    return [4 /*yield*/, reddit_api_1.getAllUserComments(userName, function (newComments) {
                            if (newComments.length === 0) {
                                return;
                            }
                            var endDate = new Date(newComments[0].created_utc * 1000).toISOString();
                            var startDate = new Date(newComments[newComments.length - 1].created_utc * 1000).toISOString();
                            var count = ("" + newComments.length).padStart(3);
                            logger.debug("Fetched " + count + " comments, from " + endDate + " to " + startDate);
                            allCount += newComments.length;
                            var newValidComments = newComments.filter(function (comment) { return isComment(comment); });
                            commentCount += newValidComments.length;
                            var newTranscriptions = newValidComments
                                .filter(function (comment) { return transcription_1.default.isTranscription(comment); })
                                .map(function (comment) { return transcription_1.default.fromComment(comment); });
                            transcriptionCount += newTranscriptions.length;
                            transcriptions = transcriptions.concat(newTranscriptions);
                        })];
                case 1:
                    _a.sent();
                    logger.info("Analysis for /u/" + userName + ":");
                    logStats('Counts', "All: " + allCount + ", Comments: " + commentCount + ", Transcriptions: " + transcriptionCount);
                    accuracy = 2;
                    hourPeak = getTranscriptionPeak(transcriptions, 60 * 60);
                    dayPeak = getTranscriptionPeak(transcriptions, 24 * 60 * 60);
                    weekPeak = getTranscriptionPeak(transcriptions, 7 * 24 * 60 * 60);
                    yearPeak = getTranscriptionPeak(transcriptions, 365 * 24 * 60 * 60);
                    logStats('Peaks', "1h: " + hourPeak + " | 24h: " + dayPeak + " | 7d: " + weekPeak + " | 365d: " + yearPeak);
                    hourAvg = getTranscriptionAvg(transcriptions, 60 * 60).toFixed(accuracy);
                    dayAvg = getTranscriptionAvg(transcriptions, 24 * 60 * 60).toFixed(accuracy);
                    weekAvg = getTranscriptionAvg(transcriptions, 7 * 24 * 60 * 60).toFixed(accuracy);
                    yearAvg = getTranscriptionAvg(transcriptions, 365 * 24 * 60 * 60).toFixed(accuracy);
                    logStats('Avgs', "1h: " + hourAvg + " | 24h: " + dayAvg + " | 7d: " + weekAvg + " | 365d: " + yearAvg);
                    amounts = getTranscriptionAmount(transcriptions);
                    logStats('Chars', "Total: " + amounts.charTotal + " | Peak: " + amounts.charPeak + " | Average: " + amounts.charAvg.toFixed(2));
                    logStats('Words', "Total: " + amounts.wordTotal + " | Peak: " + amounts.wordPeak + " | Average: " + amounts.wordAvg.toFixed(2));
                    formatStats = util_1.limitEnd(analyzeFormat(transcriptions), 5).map(function (stats) {
                        return stats.format + ": " + stats.count;
                    });
                    logStats('Top 5 formats', "" + formatStats.join(' | '));
                    typeStats = util_1.limitEnd(analyzeType(transcriptions), 5).map(function (stats) {
                        return stats.type + ": " + stats.count;
                    });
                    logStats('Top 5 types', "" + typeStats.join(' | '));
                    subStats = util_1.limitEnd(analyzeSubreddits(transcriptions), 5).map(function (stats) {
                        return stats.sub + ": " + stats.count;
                    });
                    logStats('Top 5 subs', "" + subStats.join(' | '));
                    countTag = getCountTag(transcriptions);
                    countText = countTag.name + " (" + countTag.lowerBound + "-" + countTag.upperBound + ")";
                    return [4 /*yield*/, getSpecialTags(userName, transcriptions)];
                case 2:
                    spTags = _a.sent();
                    spText = spTags.map(function (tag) { return tag.name; });
                    tagText = [countText].concat(spText).join(' | ');
                    logStats('Tags', "" + tagText);
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = analizeUser;
