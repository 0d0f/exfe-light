define('mobilemiddleware', function (require, exports, module) {
  'use strict';

  var getSMSTokenFromHead = function () {
    var header = document.getElementsByTagName('head')[0],
        meta = document.getElementsByName('sms-token')[0],
        smsToken = null;

    if (meta) {
      smsToken = JSON.parse(meta.content);
      header.removeChild(meta);
    }

    return smsToken;
  };


  module.exports = {

    // hacked hide safari-nav-bar
    setHtmlHeight: function (req, res, next) {

      setTimeout(function() {
        window.scrollTo(0, 0);
      }, 0);

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

    // check `sms-token`
    checkSMSToken: function (req, res, next) {
      var smsToken = getSMSTokenFromHead();

      if (smsToken) {
        var action = smsToken.action;
        req.smsToken = smsToken;
        if ('VERIFIED' === action) {

          res.redirect('/#verify');

        } else if ('INPUT_NEW_PASSWORD' === action) {

          res.redirect('/#set_password');

        }
        return;
      }

      next();
    },

    // cleanup `Pages`
    cleanup: function (req, res, next) {
      delete req.smsToken;
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
      res.redirect('/');
    }

  };

});
