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
exports.isToRMod = exports.getAllUserComments = exports.getUserComments = exports.requester = exports.userAgent = exports.redditConfig = void 0;
var snoowrap_1 = __importDefault(require("snoowrap"));
var uuid_1 = require("uuid");
var app_data_1 = __importDefault(require("./app-data"));
var logger_1 = __importDefault(require("./logger"));
var reddit_config_json_1 = __importDefault(require("../config/reddit.config.json"));
var logger = new logger_1.default('Reddit');
exports.redditConfig = reddit_config_json_1.default;
/** The user agent, so that reddit knows who we are. */
function userAgent() {
    return app_data_1.default.name + "/v" + app_data_1.default.version + " by /u/" + exports.redditConfig.userName;
}
exports.userAgent = userAgent;
// TODO: Save this per device
/** An ID identifying the current device. */
var deviceId = uuid_1.v4().substr(0, 30); // Reddit allows only 30 chars
/** A 'user-less' requester for the reddit API. */
function requester() {
    return snoowrap_1.default.fromApplicationOnlyAuth({
        userAgent: userAgent(),
        clientId: exports.redditConfig.clientId,
        deviceId: deviceId,
        grantType: 'https://oauth.reddit.com/grants/installed_client',
    });
}
exports.requester = requester;
/** Get comments of the given user. */
function getUserComments(userName, options) {
    return __awaiter(this, void 0, void 0, function () {
        var req;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, requester()];
                case 1:
                    req = _a.sent();
                    return [2 /*return*/, req.getUser(userName).getComments(options)];
            }
        });
    });
}
exports.getUserComments = getUserComments;
/**
 * Gets all comments of the given user.
 * @param userName The user to get the comments of.
 * @param callback The function to call whenever new comments are available.
 */
function getAllUserComments(userName, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var batchSize, comments;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    batchSize = 100;
                    return [4 /*yield*/, getUserComments(userName, {
                            sort: 'new',
                            limit: batchSize,
                        })];
                case 1:
                    comments = _a.sent();
                    callback(comments);
                    _a.label = 2;
                case 2:
                    if (!(comments.length === batchSize)) return [3 /*break*/, 4];
                    return [4 /*yield*/, comments.fetchMore({
                            amount: batchSize,
                            skipReplies: true,
                            append: false,
                        })];
                case 3:
                    // Note: The await IS necessary
                    // eslint-disable-next-line no-await-in-loop
                    comments = _a.sent();
                    callback(comments);
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getAllUserComments = getAllUserComments;
/**
 * Determines if the given user is a mod in /r/TranscribersOfReddit.
 * @param userName The user to check.
 */
function isToRMod(userName) {
    return __awaiter(this, void 0, void 0, function () {
        var req, tor, mods;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, requester()];
                case 1:
                    req = _a.sent();
                    tor = req.getSubreddit('TranscribersOfReddit');
                    return [4 /*yield*/, tor.getModerators()];
                case 2:
                    mods = _a.sent();
                    // Check if the user is one of the mods
                    return [2 /*return*/, mods.findIndex(function (mod) { return mod.name === userName; }) >= 0];
            }
        });
    });
}
exports.isToRMod = isToRMod;
