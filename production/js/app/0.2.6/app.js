/**
 * X webapp Bootstrap!
 */
define(function (require) {
  "use strict";

  var Config = require('config')
    , Handlebars = require('handlebars');

  var middleware = require('middleware')
    , routes = require('routes');

  var lightsaber = require('lightsaber');

  // Create App   ***********************************
  var app = lightsaber();

  var Widget = require('widget');
  app.widgetCaches = Widget.caches;

  app.use(middleware.fixedFaceBookURL);
  app.use(middleware.basicAuth);
  app.use(middleware.cleanupAppTmp);
  app.initRouter();
  // *注: 要使 `errorHandler` 生效，`app.initRouter` 必须先初始化。
  app.use(middleware.errorHandler);

  app.set('timestamp', Config.timestamp);
  app.set('view cache', true);
  app.set('view engine', Handlebars);
  app.set('views', '/static/views');

  // Routes       ***********************************

  // index - `/#?`
  // /^\/+#?\/?$/i
  app.get(/^\/+(?:\?)?(?:ipad)?#{0,}$/, routes.index);


  // gather a x - `/#gather`
  app.get(/^\/+(?:\?)?(?:ipad)?#gather$/, routes.refreshAuthUser, routes.gather);


  // resolve-token - `/#token=5c9a628f2b4f863435bc8d599a857c21`
  app.get(/^\/+(?:\?)?(?:ipad)?#token=([a-zA-Z0-9]{64})$/, routes.resolveToken, routes.resolveRequest, routes.resolveShow);


  // cross - `/#!233`
  app.get(/^\/+(?:\?)?(?:ipad)?#!([1-9][0-9]*)$/, routes.refreshAuthUser, routes.cross);


  // opening a private invitation X.
  // cross - `/#!233/mk7`
  app.get(/^\/+(?:\?)?(?:ipad)?#!([1-9][0-9]*)\/([a-zA-Z0-9]{3})$/, routes.refreshAuthUser, routes.crossInvitation);


  // phone-cross-token - `/#!233/8964`
  app.get(/^\/+(?:\?)?(?:ipad)?#!([1-9][0-9]*)\/([a-zA-Z0-9]{4})(?:\/(accept|mute))?\/?$/, routes.refreshAuthUser, routes.crossPhoneToken);
  // cross-token - `/#!token=63435bc8d599a857c215c9a628f2b4f8`
  app.get(/^\/+(?:\?)?(?:ipad)?#!token=([a-zA-Z0-9]{32})$/, routes.refreshAuthUser, routes.crossToken);
  // email-cross-token - `/#!token=63435bc8d599a857c215c9a628f2b4f8/accept`
  app.get(/^\/+(?:\?)?(?:ipad)?#!token=([a-zA-Z0-9]{32})\/(accept|mute)\/?$/, routes.refreshAuthUser, routes.crossToken);

  // profile
  //        email:    cfd@exfe.com        - `/#cfd@exfe.com`
  //      twitter:    @cfddream           - `/#@cfddream`
  //     facebook:    cfddream@facebook   - `/#cfddream@facebook`
  app.get(/^\/+(?:\?)?(?:ipad)?#([^@\/\s\!=]+)?@([^@\/\s]+)(?:\/?(.*))$/, routes.refreshAuthUser, routes.profile);

  // invalid link
  app.get(/^\/+(?:\?)?(?:ipad)?#invalid\/token=([a-zA-Z0-9]{64})$/, routes.invalid);

  // signout
  app.get(/^\/+(?:\?)?(?:ipad)?#signout$/, routes.signout);


  // app running
  app.run();

  // global
  window.App = app;
});
