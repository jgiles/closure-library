/**
 * This is a comment.
 * @param {number} first
 * @constructor
 */
var Ctor = function(first) {
  this.first = first;
  this.myProp = true;
}

Ctor.prototype.myMethod = function() {
  this.myMethod();
}
