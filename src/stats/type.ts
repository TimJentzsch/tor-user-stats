import Transcription from '../transcription';

type FormatStats = {
  /** The name of the format. */
  format: string;
  /** The number of transcriptions for the format. */
  count: number;
};

/**
 * Analyzes the given transcriptions by the format, e.g. 'Image' or 'Video'.
 * @param transcriptions The transcriptions to analyze.
 */
export function analyzeFormat(transcriptions: Transcription[]): FormatStats[] {
  const formatStats: FormatStats[] = [];

  transcriptions.forEach((transcription) => {
    let format = transcription.format;

    if (format.includes('Image')) {
      format = 'Image';
    } else if (format.includes('Video')) {
      format = 'Video';
    }

    const stats = formatStats.find((stat) => {
      return stat.format === format;
    });

    if (stats) {
      stats.count += 1;
    } else {
      formatStats.push({
        format,
        count: 1,
      });
    }
  });

  // Sort by count descending
  return formatStats.sort((a, b) => {
    return b.count - a.count;
  });
}

type TypeStats = {
  /** The name of the type. */
  type: string;
  /** The number of transcriptions for the format. */
  count: number;
};

/**
 * Analyzes the given transcriptions by the format, e.g. 'Image' or 'Video'.
 * @param transcriptions The transcriptions to analyze.
 */
export function analyzeType(transcriptions: Transcription[]): TypeStats[] {
  const typeStats: TypeStats[] = [];

  transcriptions.forEach((transcription) => {
    let type = transcription.type;

    if (type) {
      // Simplify some common types
      if (type.includes('Twitter')) {
        type = 'Twitter';
      } else if (type.includes('Facebook')) {
        type = 'Facebook';
      } else if (type.includes('Tumblr')) {
        type = 'Tumblr';
      } else if (type.includes('Reddit')) {
        type = 'Reddit';
      } else if (type.includes('Text Message')) {
        type = 'Chat';
      }

      const stats = typeStats.find((stat) => {
        return stat.type === type;
      });

      if (stats) {
        stats.count += 1;
      } else {
        typeStats.push({
          type,
          count: 1,
        });
      }
    }
  });

  // Sort by count descending
  return typeStats.sort((a, b) => {
    return b.count - a.count;
  });
}
