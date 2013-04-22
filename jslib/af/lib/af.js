/**
 * `Animation Frame`
 */

define('af', function () {
  'use strict';

  var performanceNow = window.performance && window.performance.now,
      now = performanceNow ?
        function () {
          return window.performance.now();
        }
          : Date.now || function () {
              return new Date().getTime();
            };

  /** Thanks to:
   *      http://paulirish.com/2011/requestanimationframe-for-smart-animating/
   *      http://creativejs.com/resources/requestanimationframe/
   *      http://www.makeitgo.ws/articles/animationframe/
   *      https://github.com/component/raf/blob/master/index.js
   *      https://gist.github.com/paulirish/1579671
   *      https://gist.github.com/joelambert/1002116
   *      https://gist.github.com/KrofDrakula/5318048
   */

   /**
    * `requestAnimationFrame(time)`
    */

  var r = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.oRequestAnimationFrame
    || window.msRequestAnimationFrame;

   /**
    * `cancelAnimationFrame`
    */

  var c = window.cancelAnimationFrame
    || window.webkitCancelAnimationFrame
    || window.mozCancelAnimationFrame
    || window.oCancelAnimationFrame
    || window.msCancelAnimationFrame;

  if (!r) {
    var prev = 0;
    r = function (callback/*, element*/) {
      var curr = now(),
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
