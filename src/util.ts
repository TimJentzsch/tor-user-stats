/** Limits the array, returning the first elements. */
export function limitEnd<T>(array: T[], limit?: number): T[] {
  if (limit !== undefined && array.length > limit) {
    return array.slice(0, limit);
  }
  return array;
}

/**
 * Limits the array to the given length and reduces the rest to the last element.
 * @param array The array to limit and reduce.
 * @param callbackfn The reduction function.
 * @param limit The limit of the array.
 */
export function limitReduceEnd<T>(
  array: T[],
  callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T,
  limit?: number,
): T[] {
  if (limit !== undefined && array.length > limit) {
    const limitedArray = array.slice(0, limit);
    const end = array.slice(limit, array.length).reduce(callbackfn);

    return limitedArray.concat(end);
  }
  return array;
}

/** Limits the array, returning the last elements. */
export function limitStart<T>(array: T[], limit?: number): T[] {
  if (limit !== undefined && array.length > limit) {
    return array.slice(array.length - limit, array.length);
  }
  return array;
}

/**
 * Repeats the given item by the given number of times.
 * @param item The item to repeat.
 * @param count The number of repitions.
 */
export function repeat<T>(item: T | T[], count: number): T[] {
  let repeatArray: T[] = [];

  while (repeatArray.length < count) {
    if (Array.isArray(item)) {
      repeatArray = repeatArray.concat(item.slice(0, count - repeatArray.length));
    } else {
      repeatArray.push(item);
    }
  }

  return repeatArray;
}

/**
 * Repeats the given item by the given number of times and append the other item.
 * @param repeatItem The item to repeat.
 * @param count The number of repetitions.
 * @param endItem The item to end with.
 */
export function repeatEndWith<T>(repeatItem: T | T[], count: number, endItem: T | T[]): T[] {
  const repeatArray = repeat(repeatItem, count);
  return repeatArray.concat(endItem);
}
