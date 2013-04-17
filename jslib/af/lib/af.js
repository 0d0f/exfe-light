/**
 * `Animation Frame`
 */

define('af', function () {
  'use strict';

  /** Thanks to:
   *      http://paulirish.com/2011/requestanimationframe-for-smart-animating/
   *      http://creativejs.com/resources/requestanimationframe/
   *      https://github.com/component/raf/blob/master/index.js
   *      https://gist.github.com/paulirish/1579671
   *      https://gist.github.com/joelambert/1002116
   *      https://gist.github.com/KrofDrakula/5318048
   */

   /**
    * `requestAnimationFram(time)`
    */

  var r = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.oRequestAnimationFrame
    || window.msRequestAnimationFrame;

   /**
    * `cancelAnimationFram`
    */

  var c = window.cancelAnimationFrame
    || window.webkitCancelAnimationFrame
    || window.mozCancelAnimationFrame
    || window.oCancelAnimationFrame
    || window.msCancelAnimationFrame;

  if (!r) {
    var prev = 0;
    r = function (callback/*, element*/) {
      var curr = new Date().getTime(),
          ms = Math.max(0, 16 - (curr - prev)),
          id = setTimeout(function () {
            callback(curr + ms);
          }, ms);
      prev = curr + ms;
      return id;
    };
  }

  if (!c) {
    c = function (id) {
      clearTimeout(id);
    };
  }

  return {
    request: r,
    cancel: c
  };
});
