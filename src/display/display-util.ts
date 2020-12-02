/**
 * Creates an object from a template.
 * @param template The template to create the object from.
 * @param obj The object to create from the template.
 */
export function fromTemplate(
  template: Record<string, unknown>,
  obj: Record<string, unknown>,
): Record<string, unknown> {
  const result = template;

  // Override the template values with the ones set in the object
  Object.keys(obj).forEach((key) => {
    result[key] = obj[key];
  });

  return result;
}

/**
 * Gets the value of the given CSS variable.
 * @param varName The name of the CSS variable.
 */
export function getVariable(varName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(`--${varName}`);
}
