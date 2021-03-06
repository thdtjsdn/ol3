goog.provide('ol.control.Logo');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.object');
goog.require('goog.style');
goog.require('ol.FrameState');
goog.require('ol.control.Control');
goog.require('ol.css');



/**
 * @constructor
 * @extends {ol.control.Control}
 * @param {ol.control.LogoOptions=} opt_options Logo options.
 */
ol.control.Logo = function(opt_options) {

  var options = goog.isDef(opt_options) ? opt_options : {};

  /**
   * @private
   * @type {Element}
   */
  this.ulElement_ = goog.dom.createElement(goog.dom.TagName.UL);

  var element = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': 'ol-logo ' + ol.css.CLASS_UNSELECTABLE
  }, this.ulElement_);

  goog.base(this, {
    element: element,
    map: options.map,
    target: options.target
  });

  /**
   * @private
   * @type {boolean}
   */
  this.renderedVisible_ = true;

  /**
   * @private
   * @type {Object.<string, Element>}
   */
  this.logoElements_ = {};

};
goog.inherits(ol.control.Logo, ol.control.Control);


/**
 * @param {ol.MapEvent} mapEvent Map event.
 */
ol.control.Logo.prototype.handleMapPostrender = function(mapEvent) {
  this.updateElement_(mapEvent.frameState);
};


/**
 * @param {?ol.FrameState} frameState Frame state.
 * @private
 */
ol.control.Logo.prototype.updateElement_ = function(frameState) {

  if (goog.isNull(frameState)) {
    if (this.renderedVisible_) {
      goog.style.showElement(this.element, false);
      this.renderedVisible_ = false;
    }
    return;
  }

  var logo;
  var logos = frameState.logos;
  var logoElements = this.logoElements_;

  for (logo in logoElements) {
    if (!(logo in logos)) {
      goog.dom.removeNode(logoElements[logo]);
      delete logoElements[logo];
    }
  }

  var image, logoElement;
  for (logo in logos) {
    if (!(logo in logoElements)) {
      image = new Image();
      image.src = logo;
      logoElement = goog.dom.createElement(goog.dom.TagName.LI);
      logoElement.appendChild(image);
      goog.dom.appendChild(this.ulElement_, logoElement);
      logoElements[logo] = logoElement;
    }
  }

  var renderVisible = !goog.object.isEmpty(logos);
  if (this.renderedVisible_ != renderVisible) {
    goog.style.showElement(this.element, renderVisible);
    this.renderedVisible_ = renderVisible;
  }

};
