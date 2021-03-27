import Transcription from '../transcription';

type FormatGammaStats = {
  /** The name of the format. */
  format: string;
  /** The number of transcriptions for the format. */
  count: number;
};

/**
 * Analyzes the given transcriptions by the format, e.g. 'Image' or 'Video'.
 * @param transcriptions The transcriptions to analyze.
 */
export function formatGamma(transcriptions: Transcription[]): FormatGammaStats[] {
  const formatStats: FormatGammaStats[] = [];

  transcriptions.forEach((transcription) => {
    const format = transcription.format;

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

type TypeGammaStats = {
  /** The name of the type. */
  type: string;
  /** The transcription gamma for the type. */
  count: number;
};

/**
 * Analyzes the given transcriptions by the format, e.g. 'Image' or 'Video'.
 * @param transcriptions The transcriptions to analyze.
 */
export function typeGamma(transcriptions: Transcription[]): TypeGammaStats[] {
  const typeStats: TypeGammaStats[] = [];

  transcriptions.forEach((transcription) => {
    const type = transcription.type;

    if (type) {
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

type FormatKarmaStats = {
  /** The name of the format. */
  format: string;
  /** The transcription karma for the format. */
  karma: number;
};

/**
 * Analyzes the given transcriptions by the format, e.g. 'Image' or 'Video'.
 * @param transcriptions The transcriptions to analyze.
 */
export function formatKarma(transcriptions: Transcription[]): FormatKarmaStats[] {
  const formatStats: FormatKarmaStats[] = [];

  transcriptions.forEach((transcription) => {
    const format = transcription.format;

    const stats = formatStats.find((stat) => {
      return stat.format === format;
    });

    if (stats) {
      stats.karma += transcription.score;
    } else {
      formatStats.push({
        format,
        karma: transcription.score,
      });
    }
  });

  // Sort by karma descending
  return formatStats.sort((a, b) => {
    return b.karma - a.karma;
  });
}

type TypeKarmaStats = {
  /** The name of the type. */
  type: string;
  /** The transcriptions by karma for the type. */
  karma: number;
};

/**
 * Analyzes the given transcriptions by the format, e.g. 'Image' or 'Video'.
 * @param transcriptions The transcriptions to analyze.
 */
export function typeKarma(transcriptions: Transcription[]): TypeKarmaStats[] {
  const typeStats: TypeKarmaStats[] = [];

  transcriptions.forEach((transcription) => {
    const type = transcription.type;

    if (type) {
      const stats = typeStats.find((stat) => {
        return stat.type === type;
      });

      if (stats) {
        stats.karma += transcription.score;
      } else {
        typeStats.push({
          type,
          karma: transcription.score,
        });
      }
    }
  });

  // Sort by karma descending
  return typeStats.sort((a, b) => {
    return b.karma - a.karma;
  });
}
