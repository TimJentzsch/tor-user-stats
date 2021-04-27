import TranscriptionGenerator from './transcription-generator';

describe('Transcription Generator', () => {
  describe('addTranscriptions', () => {
    test('should distribute 1 transcription equally', () => {
      const start = 1000;
      const transcriptions = new TranscriptionGenerator(new Date(start * 1000))
        .addTranscriptions(1, 200)
        .generate();

      expect(transcriptions).toHaveLength(1);
      expect(transcriptions[0].createdUTC).toBe(start + 100);
    });
    test('should distribute 2 transcriptions equally', () => {
      const start = 1000;
      const generator = new TranscriptionGenerator(new Date(start * 1000)).addTranscriptions(
        2,
        300,
      );
      const transcriptions = generator.generate();

      expect(generator.curTime).toBe(start + 300);
      expect(transcriptions).toHaveLength(2);
      expect(transcriptions[0].createdUTC).toBe(start + 200);
      expect(transcriptions[1].createdUTC).toBe(start + 100);
    });
  });
});
