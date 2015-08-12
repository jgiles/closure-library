goog.provide('base.name.Ctor');
goog.provide('base.name.ChildCtor');

/**
 * This is a comment.
 * @param {number} first
 * @param {goog.array.ArrayLike} second
 */
base.name.Ctor = function(first, second) {
  this.first = first;
  this.myProp = true;
  this.arrLike = second;
  this.newField = 3;
}

base.name.Ctor.prototype.myMethod = function() {
  this.myMethod();
}

/**
 * This is a child class.
 * @param {string} myname
 * @extends {base.name.Ctor}
 */
base.name.ChildCtor = function(myname) {
  this.myname = myname;
}


base.name.ChildCtor.prototype.childMethod = function() {
  return true;
}
