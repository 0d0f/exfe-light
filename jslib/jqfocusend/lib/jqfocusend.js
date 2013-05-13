define(function () {
  'use strict';

  var $ = require('jquery');

  $.fn.focusend = function () {
      if (!this[0]) {
        return;
      }

      var target = this[0]
        , l = target.value.length;
      target.focus();

      try {
        target.setSelectionRange(l, l);
      } catch (e) {}

    };

});
