import config from '../src/parseConfig';

// using jest, generate tests for config
describe('config', () => {
  // test that the default config is correct
  test('default config', () => {
    expect(config.get()).toEqual({
      tagFormat: 1,
    });
  });

  // test that the config can be set
  test('set config', () => {
    config.set({
      tagFormat: 2,
    });
    expect(config.get()).toEqual({
      tagFormat: 2,
    });
  });

  // test that the config can be reset
  test('reset config', () => {
    config.set({
      tagFormat: 1,
    });
    expect(config.get()).toEqual({
      tagFormat: 1,
    });
  });

  test('set config to undefined', () => {
    config.set({
      tagFormat: undefined,
    });
    expect(config.get()).toEqual({
      tagFormat: 1,
    });
  });

  test('set config to null', () => {
    config.set({
      tagFormat: null,
    });
    expect(config.get()).toEqual({
      tagFormat: 1,
    });
  });

});