export function updateElement(id: string, text: string | number): void {
  const element = document.getElementById(id) as HTMLElement;
  element.innerText = text.toString();
}

/**
 * Creates an object from a template.
 * @param template The template to create the object from.
 * @param obj The object to create from the template.
 */
export function fromTemplate(
  template: Record<string | number, unknown>,
  obj: Record<string | number, unknown>,
): Record<string | number, unknown> {
  const result = template;

  // Override the template values with the ones set in the object
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && obj[key] !== null && template[key] !== undefined) {
      // Rekursively apply the template
      result[key] = fromTemplate(
        template[key] as Record<string, unknown>,
        obj[key] as Record<string, unknown>,
      );
    } else {
      result[key] = obj[key];
    }
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

/**
 * Removes all child nodes of the given element.
 * @param element The elment to remove the children of.
 */
export function clearChildren(element: HTMLElement): HTMLElement {
  element.innerHTML = '';
  return element;
}
