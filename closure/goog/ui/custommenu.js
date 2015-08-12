goog.provide('goog.ui.CustomMenu');

goog.require('goog.ui.Menu');



/**
 * A custom menu class.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @param {goog.ui.MenuRenderer=} opt_renderer Renderer used to render or
 *     decorate the container; defaults to {@link goog.ui.MenuRenderer}.
 * @constructor
 * @extends {goog.ui.Menu}
 */
goog.ui.CustomMenu = function(opt_domHelper, opt_renderer) {
  goog.ui.Menu.call(this, opt_domHelper, opt_renderer);
};
goog.inherits(goog.ui.CustomMenu, goog.ui.Menu);


goog.ui.CustomMenu.prototype.testFn = function() {
  this.testFn();
  this.testFn();
  this.testFn();
  this.setHighlightedIndex(blah);
  this.setHighlightedIndex();
  //hi there.
  console.log('hello');
  this.testFn();
};
