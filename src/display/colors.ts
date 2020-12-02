import { getVariable } from './display-util';

export default class Colors {
  /**
   * The primary color.
   */
  static primary(): string {
    return getVariable('primary');
  }

  /**
   * The primary font-color.
   */
  static onPrimary(): string {
    return getVariable('on-primary');
  }

  /**
   * The secondary color.
   */
  static secondary(): string {
    return getVariable('secondary');
  }

  /**
   * The secondary font-color.
   */
  static onSecondary(): string {
    return getVariable('on-secondary');
  }

  /**
   * The color representing success.
   */
  static success(): string {
    return getVariable('success');
  }

  /**
   * The color representing failure.
   */
  static failure(): string {
    return getVariable('failure');
  }

  /**
   * The background color.
   */
  static background(): string {
    return getVariable('background');
  }

  /**
   * The background font-color.
   */
  static onBackground(): string {
    return getVariable('on-background');
  }

  /**
   * The surface color.
   */
  static surface(): string {
    return getVariable('surface');
  }

  /**
   * The surface font-color.
   */
  static onSurface(): string {
    return getVariable('on-surface');
  }

  /**
   * The color representing an error.
   */
  static error(): string {
    return getVariable('error');
  }

  /**
   * The background color for elevated elements.
   */
  static elevationBackground(): string {
    return getVariable('elevation-background');
  }
}
