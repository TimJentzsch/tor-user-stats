import { fromTemplate } from '../../src/display/display-util';

describe('Display Utilities', () => {
  describe('fromTemplate', () => {
    test('should work for flat objects without overwrite', () => {
      const template = {
        a: 1,
        b: 2,
        c: 3,
      };
      const obj = {
        d: 4,
      };
      const expected = {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
      };
      const actual = fromTemplate(template, obj);

      expect(actual).toEqual(expected);
    });

    test('should work for flat objects with overwrite', () => {
      const template = {
        a: 1,
        b: 2,
        c: 3,
      };
      const obj = {
        b: 4,
      };
      const expected = {
        a: 1,
        b: 4,
        c: 3,
      };
      const actual = fromTemplate(template, obj);

      expect(actual).toEqual(expected);
    });

    test('should work for nested templates without overwrite', () => {
      const template = {
        a: 1,
        b: {
          x: 2,
          y: 3,
        },
        c: 3,
      };
      const obj = {
        d: 4,
      };
      const expected = {
        a: 1,
        b: {
          x: 2,
          y: 3,
        },
        c: 3,
        d: 4,
      };
      const actual = fromTemplate(template, obj);

      expect(actual).toEqual(expected);
    });

    test('should work for nested templates with overwrite', () => {
      const template = {
        a: 1,
        b: {
          x: 2,
          y: 3,
        },
        c: 3,
      };
      const obj = {
        b: 2,
      };
      const expected = {
        a: 1,
        b: 2,
        c: 3,
      };
      const actual = fromTemplate(template, obj);

      expect(actual).toEqual(expected);
    });

    test('should work for nested templates with nested entry no overwrite', () => {
      const template = {
        a: 1,
        b: {
          x: 2,
          y: 3,
        },
        c: 3,
      };
      const obj = {
        b: {
          z: 4,
        },
      };
      const expected = {
        a: 1,
        b: {
          x: 2,
          y: 3,
          z: 4,
        },
        c: 3,
      };
      const actual = fromTemplate(template, obj);

      expect(actual).toEqual(expected);
    });

    test('should work for nested templates with nested entry with overwrite', () => {
      const template = {
        a: 1,
        b: {
          x: 2,
          y: 3,
        },
        c: 3,
      };
      const obj = {
        b: {
          x: 4,
        },
      };
      const expected = {
        a: 1,
        b: {
          x: 4,
          y: 3,
        },
        c: 3,
      };
      const actual = fromTemplate(template, obj);

      expect(actual).toEqual(expected);
    });
  });
});
