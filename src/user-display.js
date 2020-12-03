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
var reddit_api_1 = require("./reddit-api");
var analizer_1 = require("./analizer");
var transcription_1 = __importDefault(require("./transcription"));
var diagrams_1 = require("./display/diagrams");
function searchUserHeader() {
    var input = document.getElementById('header-user-input');
    var userName = input.value;
    window.location.href = "user.html?user=" + userName;
}
document.addEventListener('DOMContentLoaded', function () {
    var searchForm = document.getElementById('header-search-form');
    searchForm === null || searchForm === void 0 ? void 0 : searchForm.addEventListener('submit', function () {
        searchUserHeader();
        return false;
    });
});
function updateElement(id, text) {
    var element = document.getElementById(id);
    element.innerText = text.toString();
}
function displayUserName(userName) {
    var userNameElement = document.getElementById('username');
    userNameElement.innerText = "/u/" + userName;
}
function setProgress(progress) {
    var progressBar = document.getElementById('progress-bar');
    progressBar.value = progress;
}
function getTranscriptions(userName, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var allCount, commentCount, transcriptionCount, transcriptions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.debug("Starting analysis for /u/" + userName + ":");
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
                            console.debug("Fetched " + count + " comments, from " + endDate + " to " + startDate);
                            allCount += newComments.length;
                            var newValidComments = newComments.filter(function (comment) { return analizer_1.isComment(comment); });
                            commentCount += newValidComments.length;
                            var newTranscriptions = newValidComments
                                .filter(function (comment) { return transcription_1.default.isTranscription(comment); })
                                .map(function (comment) { return transcription_1.default.fromComment(comment); });
                            transcriptionCount += newTranscriptions.length;
                            transcriptions = transcriptions.concat(newTranscriptions);
                            callback(transcriptions, allCount);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, transcriptions];
            }
        });
    });
}
function displayGamma(transcriptions) {
    var gamma = transcriptions.length;
    var gammaElement = document.getElementById('scribe-count');
    gammaElement.innerHTML = "(" + gamma + " &#x393;)";
}
function getTagElement(tag) {
    var tagElement = document.createElement('div');
    tagElement.innerText = tag.toString();
    tagElement.classList.add('tag', tag.id);
    return tagElement;
}
function displayTags(userName, transcriptions) {
    return __awaiter(this, void 0, void 0, function () {
        var countTag, countTagElement, spTags, spTagElements, tagContainer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    countTag = analizer_1.getCountTag(transcriptions);
                    console.debug("Count tag: " + countTag.toString());
                    countTagElement = getTagElement(countTag);
                    return [4 /*yield*/, analizer_1.getSpecialTags(userName, transcriptions)];
                case 1:
                    spTags = _a.sent();
                    spTagElements = spTags.map(function (tag) { return getTagElement(tag); });
                    tagContainer = document.getElementById('tag-container');
                    tagContainer.innerHTML = '';
                    tagContainer.appendChild(countTagElement);
                    spTagElements.forEach(function (tag) { return tagContainer.appendChild(tag); });
                    return [2 /*return*/];
            }
        });
    });
}
function updatePeaks(transcriptions) {
    var hourPeak = analizer_1.getTranscriptionPeak(transcriptions, 60 * 60); // 1h
    var dayPeak = analizer_1.getTranscriptionPeak(transcriptions, 24 * 60 * 60); // 24h
    var weekPeak = analizer_1.getTranscriptionPeak(transcriptions, 7 * 24 * 60 * 60); // 7d
    var yearPeak = analizer_1.getTranscriptionPeak(transcriptions, 365 * 24 * 60 * 60); // 365d
    updateElement('peak-1h', hourPeak);
    updateElement('peak-24h', dayPeak);
    updateElement('peak-7d', weekPeak);
    updateElement('peak-365d', yearPeak);
}
function updateAvgs(transcriptions) {
    var accuracy = 2;
    var hourAvg = analizer_1.getTranscriptionAvg(transcriptions, 60 * 60).toFixed(accuracy); // 1h
    var dayAvg = analizer_1.getTranscriptionAvg(transcriptions, 24 * 60 * 60).toFixed(accuracy); // 24h
    var weekAvg = analizer_1.getTranscriptionAvg(transcriptions, 7 * 24 * 60 * 60).toFixed(accuracy); // 7d
    var yearAvg = analizer_1.getTranscriptionAvg(transcriptions, 365 * 24 * 60 * 60).toFixed(accuracy); // 365d
    updateElement('avg-1h', hourAvg);
    updateElement('avg-24h', dayAvg);
    updateElement('avg-7d', weekAvg);
    updateElement('avg-365d', yearAvg);
}
function updateCharWords(transcriptions) {
    var amounts = analizer_1.getTranscriptionAmount(transcriptions);
    updateElement('char-total', amounts.charTotal);
    updateElement('char-peak', amounts.charPeak);
    updateElement('char-avg', amounts.charAvg.toFixed(2));
    updateElement('word-total', amounts.wordTotal);
    updateElement('word-peak', amounts.wordPeak);
    updateElement('word-avg', amounts.wordAvg.toFixed(2));
}
function updateTables(transcriptions) {
    updatePeaks(transcriptions);
    updateAvgs(transcriptions);
    updateCharWords(transcriptions);
}
function updateDisplays(userName, transcriptions) {
    displayGamma(transcriptions);
    displayTags(userName, transcriptions);
    updateTables(transcriptions);
    diagrams_1.displayFormatDiagram(transcriptions);
    diagrams_1.displayTypeDiagram(transcriptions);
    diagrams_1.displaySubredditDiagram(transcriptions);
}
function displayUser() {
    return __awaiter(this, void 0, void 0, function () {
        var urlParams, userName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    urlParams = new URLSearchParams(window.location.search);
                    userName = urlParams.get('user');
                    if (!userName) {
                        return [2 /*return*/];
                    }
                    displayUserName(userName);
                    return [4 /*yield*/, getTranscriptions(userName, function (transcriptions, allCount) {
                            updateDisplays(userName, transcriptions);
                            setProgress(allCount / 1000);
                        })];
                case 1:
                    _a.sent();
                    setProgress(1);
                    return [2 /*return*/];
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', function () {
    displayUser();
});
