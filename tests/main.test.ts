import helloWorld from '../src/main';

describe('Main tests', () => {
  test('should return hello world', () => {
    const expected = 'Hello World!';
    const actual = helloWorld();

    expect(actual).toEqual(expected);
  });
});
