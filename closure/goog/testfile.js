goog.provide('goog.testfile');

/**
 * Returns the last element in an array without removing it.
 * Same as goog.array.last.
 * @param {Array.<number>|goog.array.ArrayLike} array The array.
 * @return {number?} Last item in array.
 */
goog.testfile.peek = function(array) {
  // What does this do?
  function declFun(a) {
    return a;
  }
  return array[array.length - 1];
};
