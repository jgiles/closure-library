goog.provide('Child');

goog.require('Parent');
goog.require('name.space.Sibling');

/**
 * The child class.
 * @extends {Parent}
 * @constructor
 * @struct
 */
Child = function() {
  /** @protected {Property} The child property. */
  this.childProperty = childProp;
};
goog.inherits(Child, Parent);

/** @override */
Child.prototype.overrideMethod = function(param) {
  param;
  param;
  return retVal;
}
