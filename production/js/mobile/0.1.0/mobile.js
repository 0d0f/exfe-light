define(function (require) {
  'use strict';

  var TWEEN = require('tween'),

      // animation {{{
      AF = require('af'),
      requestAnimationFrame = AF.request,
      // animation }}}

      middleware = require('mobilemiddleware'),
      FooterController = require('mobilecontroller').FooterController,
      routes = require('mobileroutes');

  /**- Helpers -**/
      /*
  var now = Date.now || function () { return new Date().getTime(); },

      launchApp = function (args) {
        window.location = 'exfe://crosses/' + (args || '');
      };
      */

  var lightsaber = require('lightsaber');

  // Create App   ***********************************
  var app = window.App = lightsaber();
  app.use(middleware.setHtmlHeight);
  //app.use(middleware.checkSMSToken);
  app.use(middleware.cleanup);
  app.initRouter();
  app.use(middleware.errorHandler);

  app.controllers = {};

  // @todo: 优化这种引用 或者 改掉
  app.controllers.footer = new FooterController({ App: app });

  // `index`
  // index - `/#?`
  // /^\/+#?\/?$/i
  app.get(/^\/+(?:\?)?#{0,}$/, routes.index);

  // `live`
  app.get(/^\/+(?:\?)?#live\/?$/, routes.live);

  // `verify`
  // sms token
  // ?t=2345
  app.get(/^\/+\?t=([a-zA-Z0-9]{3,})$/, function (req, res) {
    var getSMSTokenFromHead = function () {
      var header = document.getElementsByTagName('head')[0],
          meta = document.getElementsByName('sms-token')[0],
          smsToken;

      if (meta) {
        smsToken = JSON.parse(meta.content);
        header.removeChild(meta);
      }

      return smsToken;
    };
    var smsToken = getSMSTokenFromHead();

    if (smsToken) {
      var action = smsToken.action;
      req.session.resolveToken = smsToken;
      if ('VERIFIED' === action) {

        res.redirect('/#verify');

      } else if ('INPUT_NEW_PASSWORD' === action) {

        res.redirect('/#set_password');

      }
    } else {
      req.error = { code: 404 };
      req.redirect('/');
    }
  });
  app.get(/^\/+(?:\?)?#verify\/?$/, routes.verify);

  // `set-password`
  app.get(/^\/+(?:\?)?#set_password\/?$/, routes.setPassword);

  // resolve-token - `/#token=5c9a628f2b4f863435bc8d599a857c21`
  app.get(/^\/+(?:\?)?#token=([a-zA-Z0-9]{64})\/?$/, routes.resolveToken);

  // `cross`
  // phone-cross-token - `/#!233/8964`
  app.get(/^\/+(?:\?)?#!([1-9][0-9]*)\/([a-zA-Z0-9]{4})\/?$/, routes.crossPhoneToken);
  // cross-token - `/#!token=63435bc8d599a857c215c9a628f2b4f8`
  app.get(/^\/+(?:\?)?#!token=([a-zA-Z0-9]{32})\/?$/, routes.crossToken);

  app.on('launched', function () {
    function animate() {
      requestAnimationFrame(animate);
      TWEEN.update();
    }
    animate();
  });

  // app running
  //app.run();

  //window.pageshow = function () {};
});
