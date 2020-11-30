/** Limits the array, returning the first elements. */
export function limitStart<T>(array: T[], limit?: number): T[] {
  if (limit !== undefined && array.length > limit) {
    return array.slice(0, limit);
  }
  return array;
}

/** Limits the array, returning the last elements. */
export function limitEnd<T>(array: T[], limit?: number): T[] {
  if (limit !== undefined && array.length > limit) {
    return array.slice(array.length - limit, array.length);
  }
  return array;
}
