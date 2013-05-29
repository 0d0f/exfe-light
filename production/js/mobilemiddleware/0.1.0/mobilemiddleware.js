define('mobilemiddleware', function (require, exports, module) {
  'use strict';

  var iPhone = navigator.userAgent.match(/iPhone/);

  module.exports = {

    // hacked hide safari-nav-bar
    setHtmlHeight: function (req, res, next) {

      setTimeout(function() {
        window.scrollTo(0, 0);
      }, 0);

      if (!iPhone) {
        $('#app-main').addClass('app-box');
      }

      // Status-bar: 20px
      // Nav-bar: 60px
      // Button-bar: 44px
      var html = document.documentElement,
          height = window.innerHeight,
          app = req.app;

      // 1136 / 2 - (20 + 60 + 44)
      if (height >= 444) {
        height = 508;
      // 960 / 2 - (20 + 60 + 44)
      } else if (height <= 356) {
        height = 420;
      }

      app.screen = {
        width: 320,
        height: height,
        ios: (height <= 420 ? 'iphone4': '')
      };

      html.style.minHeight = height + 'px';

      next();
    },

    checkStorageSupported: function (req, res, next) {
      try {
        var localStorage = window.localStorage;
        if (localStorage) {
          localStorage.setItem('storage', 0);
          localStorage.removeItem('storage');
        }
      } catch(err) {
        alert('EXFE cannot be used in private browsing mode.');
      }

      next();
    },

    // cleanup `Pages`
    cleanup: function (req, res, next) {
      delete req._data_;
      delete req.smsToken;
      $('#app-body').css('height', 'auto');
      $('#app-header').addClass('hide');
      $('#app-footer').removeClass('ft-bg');

      // Todo: 切换页面, before -> done -> after
      var switchPageCallback = req.switchPageCallback;
      if (switchPageCallback) {
        switchPageCallback();
      } else {
        $('#app-body .page').addClass('hide');
        //.remove();
      }
      delete req.switchPageCallback;

      next();
    },

    errorHandler: function (req, res) {
      req.error = {
        code: 404
      };
      res.redirect('/');
    }

  };

});
