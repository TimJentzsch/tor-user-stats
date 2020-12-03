"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var analizer_1 = require("../src/analizer");
var transcription_1 = __importDefault(require("../src/transcription"));
var defaultTranscriptionMD = "*Image Transcription:*\n\n---\n\n[*Description of anything that you think may be worth describing about the image itself aside from what the text says. For example, an unusual text font, background images or color, etc.*]\n\nText. \n\nNOTE: if your post has text above an image, transcribe the text before describing the image. Templates show how to format things, not the order to follow.\n\n---\n\n^^I'm&#32;a&#32;human&#32;volunteer&#32;content&#32;transcriber&#32;for&#32;Reddit&#32;and&#32;you&#32;could&#32;be&#32;too!&#32;[If&#32;you'd&#32;like&#32;more&#32;information&#32;on&#32;what&#32;we&#32;do&#32;and&#32;why&#32;we&#32;do&#32;it,&#32;click&#32;here!](https://www.reddit.com/r/TranscribersOfReddit/wiki/index)";
describe('Analizer', function () {
    // Transcription peak
    describe('getTranscriptionPeak', function () {
        test('should return 0 for empty array', function () {
            var transcriptions = [];
            var duration = 24 * 60 * 60; // 24h
            var actual = analizer_1.getTranscriptionPeak(transcriptions, duration);
            expect(actual).toBe(0);
        });
        test('should return 1 for one element array', function () {
            var transcriptions = [
                new transcription_1.default('a', defaultTranscriptionMD, '', 1923019, 12, 'r/Old_Recipes'),
            ];
            var duration = 24 * 60 * 60; // 24h
            var actual = analizer_1.getTranscriptionPeak(transcriptions, duration);
            expect(actual).toBe(1);
        });
        test('should include other transcription in timeframe', function () {
            var duration = 24 * 60 * 60; // 24h
            var transcriptions = [
                new transcription_1.default('a', defaultTranscriptionMD, '', 1923019 + duration, 12, 'r/Old_Recipes'),
                new transcription_1.default('b', defaultTranscriptionMD, '', 1923019, 12, 'r/Old_Recipes'),
            ];
            var actual = analizer_1.getTranscriptionPeak(transcriptions, duration);
            expect(actual).toBe(2);
        });
        test('should exclude other transcription outside the timeframe', function () {
            var duration = 24 * 60 * 60; // 24h
            var transcriptions = [
                new transcription_1.default('a', defaultTranscriptionMD, '', 1923019 + duration + 1, 12, 'r/Old_Recipes'),
                new transcription_1.default('b', defaultTranscriptionMD, '', 1923019, 12, 'r/Old_Recipes'),
            ];
            var actual = analizer_1.getTranscriptionPeak(transcriptions, duration);
            expect(actual).toBe(1);
        });
    });
    // Transcription average
    describe('getTranscriptionAvg', function () {
        test('should return count for larger timeframe', function () {
            var duration = 60 * 60; // 1h
            var transcriptions = [
                new transcription_1.default('a', defaultTranscriptionMD, '', 1923019 + 20, 12, 'r/Old_Recipes'),
                new transcription_1.default('b', defaultTranscriptionMD, '', 1923019 + 10, 12, 'r/Old_Recipes'),
                new transcription_1.default('c', defaultTranscriptionMD, '', 1923019, 12, 'r/Old_Recipes'),
            ];
            var actual = analizer_1.getTranscriptionAvg(transcriptions, duration);
            expect(actual).toBe(3);
        });
        test('should return average for smaller timeframe', function () {
            var duration = 60 * 60; // 1h
            var transcriptions = [
                new transcription_1.default('a', defaultTranscriptionMD, '', 1923019 + duration * 3, 12, 'r/Old_Recipes'),
                new transcription_1.default('b', defaultTranscriptionMD, '', 1923019 + duration * 2, 12, 'r/Old_Recipes'),
                new transcription_1.default('c', defaultTranscriptionMD, '', 1923019, 12, 'r/Old_Recipes'),
            ];
            var actual = analizer_1.getTranscriptionAvg(transcriptions, duration);
            // 3 transcriptions in 3h => 1 transcription in 1h
            expect(actual).toBe(1);
        });
    });
});
