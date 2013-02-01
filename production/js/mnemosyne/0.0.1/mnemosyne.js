define('mnemosyne', function (require) {
  'use strict';

  var Widget = require('widget');

  /**
   * Mnemosyne Class
   * Photos Sharing
   *
   * HTML
   *
   *    div.pi-wrap tabindex="-1"
   *      > div.pi role="main"
   *        > div.header role="header"
   *        > div.body
   *        > div.footer role="footer"
   */

  var Mnemosyne = Widget.extend({

      options: {

        backdrop: false,

        template: ''
          + '<div class="xphotos" tabindex="-1"><div class="mnemosyne" role="main">'
            + '<div class="header" role="header"></div>'
            + '<div class="body"></div>'
            + '<div class="footer" role="footer"></div>'
          + '</div></div>',

        parentNode: null,

        srcNode: null,

        events: null
      },

      init: function () {
        var options = this.options;
        this.parentNode = options.parentNode;
        this.srcNode = options.srcNode;
        delete options.parentNode;
        delete options.srcNode;

        this.render();
      },

      render: function () {
        console.log(this.element, this.parentNode);
        this.element.appendTo(this.parentNode);
      },

      show: function () {},

      hide: function () {},

      destory: function () {
        this.element.off();
        this.element.remove();
        this._destory();
      }
    });

  return Mnemosyne;
});
