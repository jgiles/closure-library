goog.provide('Parent');

/**
 * The parent class.
 * @constructor
 * @struct
 */
Parent = function() {
  /** @protected {Property} The parent property. */
  this.parentProp = parentProp;
};


/**
 * The parent method.
 * @param {ParamType} param The param type.
 * @return {ReturnType} The return type.
 */
Parent.prototype.parentMethod = function(param) {
  return retVal;
}

/**
 * A method to override.
 * @param {ParamType} param The param type.
 * @return {ReturnType} The return type.
 */
Parent.prototype.overrideMethod = function(param) {
  return retVal;
  this.overrideMethod();
}
