"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.displaySubredditDiagram = exports.displayTypeDiagram = exports.displayFormatDiagram = void 0;
var plotly_js_dist_1 = __importDefault(require("plotly.js-dist"));
var analizer_1 = require("../analizer");
var util_1 = require("../util");
var colors_1 = __importDefault(require("./colors"));
var display_util_1 = require("./display-util");
var templates_1 = require("./templates");
function displayFormatDiagram(transcriptions) {
    var formatStats = util_1.limitReduceEnd(analizer_1.analyzeFormat(transcriptions), function (a, b) {
        return {
            format: 'Other',
            count: a.count + b.count,
        };
    }, 5);
    var data = [
        {
            values: formatStats.map(function (stats) { return stats.count; }),
            labels: formatStats.map(function (stats) { return stats.format; }),
            type: 'pie',
            textinfo: 'label+percent',
            textposition: 'outside',
            automargin: true,
            marker: {
                colors: util_1.repeat([colors_1.default.primary(), colors_1.default.primaryVariant()], formatStats.length),
            },
        },
    ];
    var layout = display_util_1.fromTemplate(templates_1.layoutTemplate, {
        title: 'Top 5 Formats',
    });
    plotly_js_dist_1.default.newPlot('format-diagram', data, layout);
}
exports.displayFormatDiagram = displayFormatDiagram;
function displayTypeDiagram(transcriptions) {
    var typeStats = util_1.limitReduceEnd(analizer_1.analyzeType(transcriptions), function (a, b) {
        return {
            type: 'Other',
            count: a.count + b.count,
        };
    }, 5);
    var data = [
        {
            y: typeStats.map(function (stats) { return stats.count; }),
            x: typeStats.map(function (stats) { return stats.type; }),
            text: typeStats.map(function (stats) { return stats.count.toString(); }),
            textposition: 'auto',
            type: 'bar',
            marker: {
                color: util_1.repeatEndWith(colors_1.default.primary(), typeStats.length - 1, colors_1.default.primaryVariant()),
            },
            hoverinfo: 'none',
        },
    ];
    var layout = display_util_1.fromTemplate(templates_1.layoutTemplate, {
        title: 'Top 5 Types',
        yaxis: {
            title: 'Transcription Count',
        },
    });
    plotly_js_dist_1.default.newPlot('type-diagram', data, layout);
}
exports.displayTypeDiagram = displayTypeDiagram;
function displaySubredditDiagram(transcriptions) {
    var subStats = util_1.limitReduceEnd(analizer_1.analyzeSubreddits(transcriptions), function (a, b) {
        return {
            sub: 'Other',
            count: a.count + b.count,
        };
    }, 5);
    var data = [
        {
            y: subStats.map(function (stats) { return stats.count; }),
            x: subStats.map(function (stats) { return stats.sub; }),
            text: subStats.map(function (stats) { return stats.count.toString(); }),
            textposition: 'auto',
            type: 'bar',
            marker: {
                color: util_1.repeatEndWith(colors_1.default.primary(), subStats.length - 1, colors_1.default.primaryVariant()),
            },
            hoverinfo: 'none',
        },
    ];
    var layout = display_util_1.fromTemplate(templates_1.layoutTemplate, {
        title: 'Top 5 Subreddits',
        yaxis: {
            title: 'Transcription Count',
        },
    });
    plotly_js_dist_1.default.newPlot('subreddit-diagram', data, layout);
}
exports.displaySubredditDiagram = displaySubredditDiagram;
