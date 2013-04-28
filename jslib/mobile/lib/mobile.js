define(function (require) {
  'use strict';

  var $ = require('zepto'),
      TWEEN = require('tween'),

      // animation {{{
      AF = require('af'),
      requestAnimationFrame = AF.request,
      // animation }}}

      middleware = require('mobilemiddleware'),
      FooterController = require('mobilecontroller').FooterController,
      routes = require('mobileroutes');

  /**- Helpers -**/
  var now = Date.now || function () { return new Date().getTime(); },

      lastBreathe = now(),

      launchApp = function (args) {
        App.set('tryRedirectAt', now());
        window.location = 'exfe://crosses/' + (args || '');
      };

  var lightsaber = require('lightsaber');

  // Create App   ***********************************
  var app = lightsaber();
  app.use(middleware.setHtmlHeight);
  app.use(middleware.checkSMSToken);
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

  // redirect time
  app.set('tryRedirectAt', 0);

  app.on('launched', function () {
    var self = this;
    // During tests on 3g/3gs this timeout fires immediately if less than 500ms.
    var tryTimer = setInterval(function () {
      var n = now(), tryRedirectAt = self.set('tryRedirectAt');
      if (tryRedirectAt) {
        if (n - lastBreathe > 1500 && Math.abs(tryRedirectAt - lastBreathe) < 1500) {
          clearInterval(tryTimer);
          $('.get-button button').html('Open <span class="exfe">EXFE</span> app').removeClass('hide');
          $('#app-footer')
            .off('click.footer', '.get-button button')
            .on('click.footer', '.get-button button', function () {
              launchApp();
            });
        // To avoid failing on return to MobileSafari, ensure freshness!
        } else if (n - tryRedirectAt < 2000) {
          $('.get-button').removeClass('hide');
          $('.redirecting').addClass('hide');
        }
      }
      lastBreathe = n;
    }, 500);

    app.set('tryTimer', tryTimer);

    function animate() {
      requestAnimationFrame(animate);
      TWEEN.update();
    }
    animate();
  });

  // app running
  app.run();

  //window.pageshow = function () {};

  // global
  window.App = app;

});
