"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Regular expression to recognize transcriptions. Groups:
 * - header: The header of the transcription.
 * - format: The format of the transcription, e.g. 'Image' or 'Video'.
 * - type: The type of the transcription, e.g. 'Twitter Post'.
 */
var headerRegex = /^\s*(\*?(.+?)\s+Transcription:?\*?\s*(.*?)\*?\s*-{3,})\s*/;
/**
 * Regular expression to recognize transcriptions. Groups:
 * - content: The transcription content.
 */
var contentRegex = /(.*)/;
/**
 * Regular expression to recognize transcription footers. Groups:
 * - footer: The footer of the transcription.
 */
// Note: There are two types of footers, one has an extra '&#32;'. Both have to be recognized.
var footerRegex = /\s*(\^\^I'm&#32;a&#32;human&#32;volunteer&#32;content&#32;transcriber&#32;for&#32;Reddit&#32;and&#32;you&#32;could&#32;be&#32;too!&#32;\[If&#32;(&#32;)?you'd&#32;like&#32;more&#32;information&#32;on&#32;what&#32;we&#32;do&#32;and&#32;why&#32;we&#32;do&#32;it,&#32;click&#32;here!\]\(https:\/\/www\.reddit\.com\/r\/TranscribersOfReddit\/wiki\/index\))\s*$/;
/**
 * Regular expression to recognize transcriptions. Groups:
 * - header: The header of the transcription.
 * - format: The format of the transcription, e.g. 'Image' or 'Video'.
 * - type: The type of the transcription, e.g. 'Twitter Post'.
 * - content: The transcription content.
 * - footer: The footer of the transcription.
 */
var transcriptionRegex = new RegExp(headerRegex.source + contentRegex.source + footerRegex.source, 
// Multiline, allow '.' to match newline characters and be case-insensitive
'msi');
var Transcription = /** @class */ (function () {
    function Transcription(
    /** The ID of the comment. */
    id, 
    /** The full body of the transcription, formatted in reddit markdown. */
    bodyMD, 
    /** The full body of the transcription, formatted in HTML. */
    bodyHTML, 
    /** The creation time of the transcription, in seconds since midnight 1970-01-01 UTC. */
    createdUTC, 
    /** The score of the transcription. */
    score, 
    /** The name of the subreddit, in the format 'r/subreddit'. */
    subredditNamePrefixed) {
        this.id = id;
        this.bodyMD = bodyMD;
        this.bodyHTML = bodyHTML;
        this.createdUTC = createdUTC;
        this.score = score;
        this.subredditNamePrefixed = subredditNamePrefixed;
        // Extract transcription-specific attributes
        var match = transcriptionRegex.exec(bodyMD);
        if (match === null) {
            if (!footerRegex.test(bodyMD)) {
                throw new Error("Failed to convert comment to transcription, footer not found:\n<<<" + bodyMD + ">>>");
            }
            if (!headerRegex.test(bodyMD)) {
                throw new Error("Failed to convert comment to transcription, header not found:\n<<<" + bodyMD + ">>>");
            }
            throw new Error("Failed to convert comment to transcription:\n<<<" + bodyMD + ">>>");
        }
        this.headerMD = match[1];
        this.format = match[2];
        this.type = match[3];
        this.contentMD = match[4];
        this.footerMD = match[5];
    }
    /**
     * Creates a new transcription from a comment.
     * @param comment The comment to create the transcription from.
     */
    Transcription.fromComment = function (comment) {
        return new Transcription(comment.id, comment.body, comment.body_html, comment.created_utc, comment.score, comment.subreddit_name_prefixed);
    };
    /**
     * Checks if a comment is a transcription.
     * @param comment The comment to check.
     */
    Transcription.isTranscription = function (comment) {
        return transcriptionRegex.test(comment.body);
    };
    return Transcription;
}());
exports.default = Transcription;
