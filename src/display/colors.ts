import { getVariable } from './display-util';

export default class Colors {
  /** Transparent color. */
  static transparent(): string {
    return 'transparent';
  }

  /** The primary color. */
  static primary(): string {
    return getVariable('primary');
  }

  /** A variant of the primary color. */
  static primaryVariant(): string {
    return getVariable('primary-variant');
  }

  /** The primary font-color. */
  static onPrimary(): string {
    return getVariable('on-primary');
  }

  /** The background color. */
  static background(): string {
    return getVariable('background');
  }

  /** The background font-color. */
  static onBackground(): string {
    return getVariable('on-background');
  }

  /** The surface color. */
  static surface(): string {
    return getVariable('surface');
  }

  /** The surface font-color. */
  static onSurface(): string {
    return getVariable('on-surface');
  }

  /** The color representing an error. */
  static error(): string {
    return getVariable('error');
  }

  /** The color of the grid lines. */
  static grid(): string {
    return getVariable('grid');
  }

  /** The colors for the heatmap. */
  static heatmap(): string[] {
    return [1, 2, 3, 4, 5, 6].map((num) => {
      return getVariable(`heatmap-${num}`);
    });
  }
}
