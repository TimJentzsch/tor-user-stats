# tor-user-stats ![Version](https://img.shields.io/github/v/tag/TimJentzsch/tor-user-stats?label=version) ![License](https://img.shields.io/github/license/TimJentzsch/tor-user-stats) ![CI Status](https://img.shields.io/github/workflow/status/TimJentzsch/tor-user-stats/ci?label=ci) ![Test Coverage](https://img.shields.io/codecov/c/github/TimJentzsch/tor-user-stats)

> **DISCLAIMER**: This is a community-maintained project and is not officially endorsed by [/r/TranscribersOfReddit](https://www.reddit.com/r/TranscribersOfReddit/wiki/index) nor [Grafeas Group](https://www.grafeas.org/about); they are in no way involved with this tool and are not liable for any matters relating to it.

This is a tool to obtain user-related statistics to [/r/TranscribersOfReddit](https://www.reddit.com/r/TranscribersOfReddit/) related transcriptions.

Available on https://timjentzsch.github.io/tor-user-stats/.

![Screenshot of the diagrams for transcription history and top 5 subreddits](https://imgur.com/99WkzCV.png)

## Features

### Statistics

https://timjentzsch.github.io/tor-user-stats/user.html

- Current gamma (transcription count)
- Current rank (e.g. diamond for 1000-2499 transcriptions)
- Analysis of the most recent transcriptions:
  - Gamma/karma average/peak/recent by hour/day/week/year
  - Total/average/peak characters/words
  - Heatmap
  - Top 5 formats by gamma/karma (e.g. image or video)
  - Top 5 types by gamma/karma (e.g. Reddit, Twitter, Meme, etc.)
  - Top 5 subreddits by gamma/karma
  - History diagram by gamma/karma
  - Rate diagram by gamma/karma
  - Transcription Hall Of Fame (transcriptions with the most karma)
  - Recent transcription display

### Overlay Generator

https://timjentzsch.github.io/tor-user-stats/stream.html

- Streaming overlay to integrate in OBS
- Displays name, rank, gamma and session gamma/time
- Updates automatically

## Contributing

If you wish to contribute to this project or run it locally, please refer to the [contribution guidelines](CONTRIBUTING.md).
