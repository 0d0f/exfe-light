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

  var lightsaber = require('lightsaber');

  // Create App   ***********************************
  var app = window.App = lightsaber();
  app.use(middleware.setHtmlHeight);
  app.use(middleware.cleanup);
  app.initRouter();
  app.use(middleware.errorHandler);

  app.request.enableFullUrlPath = true;

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
  app.get(/^\/+\?(?:(?:redirect)&)?t=([a-zA-Z0-9]{3,})$/, function (req, res) {
    var smsToken = window._ENV_._data_
      , action = smsToken.action;
    req.session.resolveToken = smsToken;
    if ('VERIFIED' === action) {
      routes.verify(req, res);
    } else if ('INPUT_NEW_PASSWORD' === action) {
      routes.setPassword(req, res);
    }
  });

  // resolve-token - `/#token=5c9a628f2b4f863435bc8d599a857c21`
  app.get(/^\/+(?:\?(?:redirect)?)?#token=([a-zA-Z0-9]{64})\/?$/, routes.resolveToken);

  // `cross`
  // phone-cross-token - `/#!233/8964`
  app.get(/^\/+(?:\?(?:redirect)?)?#!([1-9][0-9]*)\/([a-zA-Z0-9]{4})\/?$/, routes.crossPhoneToken);
  // cross-token - `/#!token=63435bc8d599a857c215c9a628f2b4f8`
  app.get(/^\/+(?:\?(?:redirect)?)?#!token=([a-zA-Z0-9]{32})\/?$/, routes.crossToken);

  app.get(/^\/+(?:\?(?:redirect)?)?#!token=([a-zA-Z0-9]{4,})\/routex\/?$/, routes.routex);
  app.get(/^\/+!token=([a-zA-Z0-9]{4,})\/routex\/?$/, routes.routex);
  app.get(/^\/+!\d+\/routex\/?.*$/, routes.routex);

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
