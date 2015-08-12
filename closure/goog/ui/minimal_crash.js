goog.require('goog.ui.Control');


/**
 * Base class for containers.  Extends {@link goog.ui.Component} by adding
 * the following:
 *  <ul>
 *    <li>a {@link goog.events.KeyHandler}, to simplify keyboard handling,
 *    <li>a pluggable <em>renderer</em> framework, to simplify the creation of
 *        containers without the need to subclass this class,
 *    <li>methods to manage child controls hosted in the container,
 *    <li>default mouse and keyboard event handling methods.
 *  </ul>
 * @param {?goog.ui.Container.Orientation=} opt_orientation Container
 *     orientation; defaults to {@code VERTICAL}.
 * @param {goog.ui.ContainerRenderer=} opt_renderer Renderer used to render or
 *     decorate the container; defaults to {@link goog.ui.ContainerRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document
 *     interaction.
 * @extends {goog.ui.Component}
 * @constructor
 */
goog.ui.Container = function(opt_orientation, opt_renderer, opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);
  this.renderer_ = opt_renderer || goog.ui.ContainerRenderer.getInstance();
  this.orientation_ = opt_orientation || this.renderer_.getDefaultOrientation();
};
goog.inherits(goog.ui.Container, goog.ui.Component);


/**
 * Container-specific events.
 * @enum {string}
 */
goog.ui.Container.EventType = {
  /**
   * Dispatched after a goog.ui.Container becomes visible. Non-cancellable.
   * NOTE(user): This event really shouldn't exist, because the
   * goog.ui.Component.EventType.SHOW event should behave like this one. But the
   * SHOW event for containers has been behaving as other components'
   * BEFORE_SHOW event for a long time, and too much code relies on that old
   * behavior to fix it now.
   */
  AFTER_SHOW: 'aftershow',

  /**
   * Dispatched after a goog.ui.Container becomes invisible. Non-cancellable.
   */
  AFTER_HIDE: 'afterhide'
};


/**
 * Container orientation constants.
 * @enum {string}
 */
goog.ui.Container.Orientation = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical'
};


/**
 * Allows an alternative element to be set to receive key events, otherwise
 * defers to the renderer's element choice.
 * @type {Element|undefined}
 * @private
 */
goog.ui.Container.prototype.keyEventTarget_ = null;


/**
 * Keyboard event handler.
 * @type {goog.events.KeyHandler?}
 * @private
 */
goog.ui.Container.prototype.keyHandler_ = null;


/**
 * Renderer for the container.  Defaults to {@link goog.ui.ContainerRenderer}.
 * @type {goog.ui.ContainerRenderer?}
 * @private
 */
goog.ui.Container.prototype.renderer_ = null;


/**
 * Container orientation; determines layout and default keyboard navigation.
 * @type {?goog.ui.Container.Orientation}
 * @private
 */
goog.ui.Container.prototype.orientation_ = null;


/**
 * Whether the container is set to be visible.  Defaults to true.
 * @type {boolean}
 * @private
 */
goog.ui.Container.prototype.visible_ = true;


/**
 * Whether the container is enabled and reacting to keyboard and mouse events.
 * Defaults to true.
 * @type {boolean}
 * @private
 */
goog.ui.Container.prototype.enabled_ = true;


/**
 * Whether the container supports keyboard focus.  Defaults to true.  Focusable
 * containers have a {@code tabIndex} and can be navigated to via the keyboard.
 * @type {boolean}
 * @private
 */
goog.ui.Container.prototype.focusable_ = true;


/**
 * The 0-based index of the currently highlighted control in the container
 * (-1 if none).
 * @type {number}
 * @private
 */
goog.ui.Container.prototype.highlightedIndex_ = -1;


/**
 * The currently open (expanded) control in the container (null if none).
 * @type {goog.ui.Control?}
 * @private
 */
goog.ui.Container.prototype.openItem_ = null;


/**
 * Whether the mouse button is held down.  Defaults to false.  This flag is set
 * when the user mouses down over the container, and remains set until they
 * release the mouse button.
 * @type {boolean}
 * @private
 */
goog.ui.Container.prototype.mouseButtonPressed_ = false;


/**
 * Whether focus of child components should be allowed.  Only effective if
 * focusable_ is set to false.
 * @type {boolean}
 * @private
 */
goog.ui.Container.prototype.allowFocusableChildren_ = false;


/**
 * Whether highlighting a child component should also open it.
 * @type {boolean}
 * @private
 */
goog.ui.Container.prototype.openFollowsHighlight_ = true;


/**
 * Map of DOM IDs to child controls.  Each key is the DOM ID of a child
 * control's root element; each value is a reference to the child control
 * itself.  Used for looking up the child control corresponding to a DOM
 * node in O(1) time.
 * @type {Object}
 * @private
 */
goog.ui.Container.prototype.childElementIdMap_ = null;


// Event handler and renderer management.


/**
 * Returns the DOM element on which the container is listening for keyboard
 * events (null if none).
 * @return {Element} Element on which the container is listening for key
 *     events.
 */
goog.ui.Container.prototype.getKeyEventTarget = function() {
  // Delegate to renderer, unless we've set an explicit target.
  return this.keyEventTarget_ || this.renderer_.getKeyEventTarget(this);
};


/**
 * Attaches an element on which to listen for key events.
 * @param {Element|undefined} element The element to attach, or null/undefined
 *     to attach to the default element.
 */
goog.ui.Container.prototype.setKeyEventTarget = function(element) {
  if (this.focusable_) {
    var oldTarget = this.getKeyEventTarget();
    var inDocument = this.isInDocument();

    this.keyEventTarget_ = element;
    var newTarget = this.getKeyEventTarget();

    if (inDocument) {
      // Unlisten for events on the old key target.  Requires us to reset
      // key target state temporarily.
      this.keyEventTarget_ = oldTarget;
      this.enableFocusHandling_(false);
      this.keyEventTarget_ = element;

      // Listen for events on the new key target.
      this.getKeyHandler().attach(newTarget);
      this.enableFocusHandling_(true);
    }
  } else {
    throw Error('Can\'t set key event target for container ' +
        'that doesn\'t support keyboard focus!');
  }
};


/**
 * Returns the keyboard event handler for this container, lazily created the
 * first time this method is called.  The keyboard event handler listens for
 * keyboard events on the container's key event target, as determined by its
 * renderer.
 * @return {!goog.events.KeyHandler} Keyboard event handler for this container.
 */
goog.ui.Container.prototype.getKeyHandler = function() {
  return this.keyHandler_ ||
      (this.keyHandler_ = new goog.events.KeyHandler(this.getKeyEventTarget()));
};


/**
 * Returns the renderer used by this container to render itself or to decorate
 * an existing element.
 * @return {goog.ui.ContainerRenderer} Renderer used by the container.
 */
goog.ui.Container.prototype.getRenderer = function() {
  return this.renderer_;
};


/**
 * Registers the given renderer with the container.  Changing renderers after
 * the container has already been rendered or decorated is an error.
 * @param {goog.ui.ContainerRenderer} renderer Renderer used by the container.
 */
goog.ui.Container.prototype.setRenderer = function(renderer) {
  if (this.getElement()) {
    // Too late.
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }

  this.renderer_ = renderer;
};


// Standard goog.ui.Component implementation.


/**
 * Creates the container's DOM.
 * @override
 */
goog.ui.Container.prototype.createDom = function() {
  // Delegate to renderer.
  this.setElementInternal(this.renderer_.createDom(this));
};


/**
 * Returns the DOM element into which child components are to be rendered,
 * or null if the container itself hasn't been rendered yet.  Overrides
 * {@link goog.ui.Component#getContentElement} by delegating to the renderer.
 * @return {Element} Element to contain child elements (null if none).
 * @override
 */
goog.ui.Container.prototype.getContentElement = function() {
  // Delegate to renderer.
  return this.renderer_.getContentElement(this.getElement());
};


/**
 * Returns true if the given element can be decorated by this container.
 * Overrides {@link goog.ui.Component#canDecorate}.
 * @param {Element} element Element to decorate.
 * @return {boolean} True iff the element can be decorated.
 * @override
 */
goog.ui.Container.prototype.canDecorate = function(element) {
  // Delegate to renderer.
  return this.renderer_.canDecorate(element);
};
