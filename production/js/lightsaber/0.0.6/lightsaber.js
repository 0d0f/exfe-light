/**
 *「May the force be with you. 愿原力与你同在.」
 *
 * Refer:
 *    - https://github.com/senchalabs/connect
 *    - https://github.com/visionmedia/page.js
 *    - https://github.com/visionmedia/express/tree/master/lib
 *    - https://github.com/maccman/spine/blob/master/lib/route.js
 */
define('lightsaber', function (require, exports, module) {
  'use strict';

  /**
   * Module dependencies
   */
  var Emitter = require('emitter'),
      isIE = /msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),
      $ = require('jquery') || require('zepto'),
      // proxy = $.proxy;
      proxy = function (f, c) {
        if (!f) { return; }
        return function cb(e) {
          return f.call(c, e);
        };
      };

  var location = window.location,
      history = window.history,
      historySupport,
      ROOT = '/';

  // http://cacheandquery.com/blog/category/technology/
  var _firstLoad = false;
  $(window).on('load', function () {
    _firstLoad = true;
    setTimeout(function () { _firstLoad = false; }, 0);
  });

  // Create Application
  function createApplication() {
    var app = new Application()
      , request = new Request()
      , response = new Response();
    merge(app, Emitter.prototype);
    request.app = response.app = app;
    app.init();
    return app;
  }

  // export module
  exports = module.exports = createApplication;

  var proto;

  // lightsaber version
  exports.version = '0.0.5';

  // Application
  function Application() {}

  proto = Application.prototype;

  // html5 history support
  proto.historySupport = historySupport = (history !== null ? history.pushState : void 0) !== null;

  // wtf? window.onpopstate v12?
  if ($.browser && $.browser.opera) {
    proto.historySupport = historySupport = false;
  }

  proto.init = function () {
    this.cache = {};
    this.settings = {};
    this.engines = {};

    this.route = ROOT;
    this.stack = [];
    this.viewCallbacks = [];
    this.defaultConfiguration();
  };

  proto.defaultConfiguration = function () {
    // default settings
    this.set('env', 'production');

    // perform initial dispatch
    this.enable('dispatch');

    // implict middleware
    this.use(lightsaberInit(this));

    // router
    this._router = new Router(this);
    this.routes = this._router.map;
    this._usedRouter = false;
    this._router.caseSensitive = this.enabled('case sensitive routing');
    this._router.strict = this.enabled('strict routing');

    // setup locals
    this.locals = locals(this);

    // default locals
    this.locals.settings = this.settings;

    this.configure('development', function () {
      this.set('env', 'development');
    });

    this.configure('production', function () {
      this.enable('view cache');
    });
  };

  proto.use = function (route, fn) {
    // default route to '/'
    if ('string' !== typeof route) {
      fn = route;
      route = ROOT;
    }

    // '/abcdefg/' => '/abcdefg'
    if (ROOT !== route && ROOT === route[route.length - 1]) {
      route = route.slice(0, -1);
    }

    this.stack.push({ route: route, handle: fn });

    return this;
  };

  /**
   * Register the given template engine callback `fn`
   */
  proto.engine = function (ext, fn) {
    if ('function' !== typeof fn) throw new Error('callback function required');
    if ('.' !== ext[0]) ext = '.' + ext;
    this.engines[ext] = fn;
    return this;
  };

  proto.set = function (setting, val) {
    if (1 === arguments.length) {
      if (this.settings.hasOwnProperty(setting)) {
        return this.settings[setting];
      }
    } else {
      this.settings[setting] = val;
      return this;
    }
  };

  proto.enabled = function (setting) {
    return !!this.set(setting);
  };

  proto.disabled = function (setting) {
    return !this.set(setting);
  };

  proto.enable = function (setting) {
    return this.set(setting, true);
  };

  proto.disable = function (setting) {
    return this.set(setting, false);
  };

  proto.configure = function (env, fn) {
    var envs = 'all'
      , args = [].slice.call(arguments);

    fn = args.pop();

    if (args.length) envs = args;

    //if ('all' === envs || ~envs.indexOf(this.settings.env)) fn.call(this);
    if ('all' === envs || ~indexOf(envs, this.settings.env)) fn.call(this);

    return this;
  };

  proto.render = function (name, options, fn) {
    var opts = {}
      , cache = this.cache
      , engine = this.engine
      , view;

    if ('function' === typeof options) {
      fn = options;
      options = {};
    }

    // merge app.locals
    merge(opts, this.locals);

    // merge options.locals
    if (options.locals) merge(opts, options.locals);

    // merge options
    merge(opts, options);

    // set .cache unless explicitly provided
    opts.cache = null === opts.cache
      ? this.enabled('view cache')
      : opts.cache;

      // primed
    if (opts.cache) view = cache[name];

    if (!view) {
      view = new View(name, {
          engine: this.set('view engine')
        , root: this.set('views')
      }, this.set('timestamp'));

      if (!view.path) {
        var err = new Error('Failed to lookup view "' + name + '"');
        err.view = view;
        return fn(err);
      }

      // prime the cache
      if (opts.cache) cache[name] = view;
    }

    // render
    try {
      view.render(opts, fn);
    } catch (err) {
      fn(err);
    }
  };

  proto.path = function () {
    return this.route;
  };

  proto.param = function (name, fn) {
    var fns = [].slice.call(arguments, 1)
      , i = 0
      , len;

    // array
    if (isArray(name)) {
      for (len = name.length; i < len; ++i) {
        for (var j = 0, fl = fns.length; j < fl; ++j) {
          this.param(name[i], fns[j]);
        }
      }
    }
    // param logic
    else if ('function' === typeof name) {
      this._router.param(name);
    // single
    } else {
      if (':' === name[0]) name = name.substr(1);
      for (len = fns.length; i < len; ++i) {
        this._router.param(name, fn);
      }
    }

    return this;
  };

  proto.initRouter = function () {
    if (this._usedRouter === false) {
      this._usedRouter = true;
      this.use(this._router.middleware);
    }
  };

  // get method request
  proto.get = function () {
    var args = [].slice.call(arguments);
    this.initRouter();
    return this._router.route.apply(this._router, args);
  };

  /*
   * Handle request
   *
   * @api private
   */
  proto.handle = function (req, res, out) {
    // Only match hash parts now.
    if (!req.enableFullUrlPath && req.fullpath !== req.path) {
      return;
    }

    var stack = this.stack
      , removed = ''
      , slashAdded = false
      , index = 0;

    function next(err) {
      // next callback
      var layer = stack[index++]
        , path;

      if (slashAdded) {
        req.url = req.url.substr(1);
        slashAdded = false;
      }

      req.url = removed + req.url;

      // all done
      if (!layer) {
        return;
      }

      try {

        path = req.url;

        if (0 !== path.indexOf(layer.route)) return next(err);

        // get handle function argumens length
        var arity = layer.handle.length;

        // debug
        //console.log(index, 'path', path, arity, layer.handle.toString());

        removed = layer.route;
        req.url = req.url.substr(removed.length);

        if ('/' !== req.url[0]) {
          req.url = '/' + req.url;
          slashAdded = true;
        }

        if (err) {
          if (4 === arity) {
            layer.handle(err, req, res, next);
          } else {
            next(err);
          }
        } else if (4 > arity) {
          layer.handle(req, res, next);
        } else {
          next();
        }

      } catch (e) {
        next(e);
      }

    }

    next()
  };

  // run app
  proto.run = function (options) {
    // onLaunch
    this.emit('launch');

    options = options || {};

    var req = this.request
      , res = this.response;

    if (this.running) return;
    this.running = true;

    if (false === options.dispatch) this.disable('dispatch');

    if (false !== options.popstate) {

      // 当前在 ie10， popstate 触发失效，暂时先用 hashchange
      if (this.historySupport && !isIE) {
        //$(window).on('popstate', { app: this }, this.change);
        $(window).on('popstate', proxy(this.change, this));
        //window.addEventListener('popstate', proxy(this.change, this), false);
      } else {
        //$(window).on('hashchange', { app: this }, this.change);
         $(window).on('hashchange', proxy(this.change, this));
        //window.addEventListener('hashchange', proxy(this.change, this), false);
      }

    }

    if (this.disabled('dispatch')) return;

    this.handle(req, res);

    // onLaunched
    this.emit('launched');
  };

  proto.change = function (e) {
    if (_firstLoad) return _firstLoad = false;

    var app = this
      , req = app.request
      , res = app.response
      , url = req.url;

    req.updateUrl();

    //if ('/' !== url && url === req.url) return;
    if (url === req.url) return;

    app.handle(req, res);

    if (e) { e.stopPropagation(); e.preventDefault(); }

    return false;
  };

  // Generate an `Error`
  proto.error = function (code, msg) {
    var err = new Error(msg);
    err.status = code;
    return err;
  };



  // Request
  function Request(enableFullUrlPath) {
    // listen full url path
    this.enableFullUrlPath = !!enableFullUrlPath;

    // session
    this.session = {};

    this.path = '/';
    this.method = 'GET';
    this.updateUrl();
  }

  // Request.prototype
  proto = Request.prototype;

  proto.updateUrl = function () {
    this.host = location.hostname;
    this.port = location.port || 80;
    this.fullpath = location.pathname;
    this.enableFullUrlPath && (this.path = this.fullpath);
    this.hash = decodeURIComponent(location.hash);
    this.querystring = decodeURIComponent(location.search);
    this.url = this.path + this.querystring + this.hash;
  };

  proto.param = function (name, defaultValue) {
    var params = this.params || {}
      , query = this.query || {};
    if (null != params[name] && params.hasOwnProperty(name)) return params[name];
    if (null != query[name]) return query[name];
    return defaultValue;
  };

  proto.getPath = function () {
    return this.path;
  };

  proto.getHost = function () {
    return this.host;
  };


  // Response
  function Response(path, state) {
    this.path = path;
    this.title = document.title;
    this.state = state || {};
  }

  // Response.prototype
  proto = Response.prototype;

  proto.location = function (url) {
    window.setTimeout(function () {
      location.href = url;
    }, 16);
  };

  // redirect('back')
  // redirect('/user', 'User Page', {id: 'user'});
  proto.redirect = function (url) {
    var argsLen = arguments.length
      , title
      , state;

    // `back` `forward`
    url = arguments[0];
    if (url === 'back' || url === 'forward') {
      history[url]();
      return;
    }

    if (!historySupport) {
      this.location(url);
      return;
    }

    title = arguments[1];
    state = arguments[2] || {};

    this.path = url;
    this.title = title || 'EXFE.COM';
    document.title = this.title;
    this.state = state;
    this.state.id = uuid();
    this.pushState();

    //$(window).triggerHandler('popstate');
    this.app.change();
  };

  // save state
  proto.save = function () {
    history.replaceState(this.state, this.title, this.path);
  };

  // push the state onto the history stack
  proto.pushState = function () {
    history.pushState(this.state, this.title, this.path);
  };

  proto.render = function (view, options, fn) {
    var self = this
      , options = options || {}
      , app = this.app;

    // support callback function as second arg
    if ('function' === typeof options) {
      fn = options, options = {};
    }

    // merge res.locals
    options.locals = self.locals;

    // render
    app.render(view, options, fn);
  };


  // Router
  function Router(options) {
    options = options || {};
    var self = this;
    this.map = [];
    this.params = {};
    this._params = [];
    this.caseSensitive = options.caseSensitive;
    this.strict = options.strict;
    this.middleware = function router(req, res, next) {
      self._dispatch(req, res, next);
    };
  }

  proto = Router.prototype;

  proto.param = function (name, fn) {
    // param logic
    if ('function' === typeof name) {
      this._params.push(name);
      return;
    }

    // apply param functions
    var params = this._params
      , len = params.length
      , ret
      , i;

    for (i = 0; i < len; ++i) {
      if (ret = params[i](name, fn)) {
        fn = ret;
      }
    }

    // ensure we end up with a
    // middleware function
    if ('function' !== typeof fn) {
      throw new Error('invalid param() call for ' + name + ', got ' + fn);
    }

    (this.params[name] = this.params[name] || []).push(fn);
    return this;
  };

  proto._dispatch = function (req, res, next) {
    var params = this.params
      , self = this;

    // route dispatch
    (function pass(i, err) {
      var paramCallbacks
        , paramIndex = 0
        , paramVal
        , route
        , keys
        , key;

      // match next route
      function nextRoute(err) {
        pass(req._route_index + 1, err);
      }

      // match route
      req.route = route = self.matchRequest(req, i);

      // no route
      if (!route) return next(err);

      // we have a route
      // start at param 0
      req.params = route.params;
      keys = route.keys;
      i = 0;

      // param callbacks
      function param(err) {
        paramIndex = 0;
        key = keys[i++];
        paramVal = key && req.params[key.name];
        paramCallbacks = key && params[key.name];

        // debug
        //console.log(paramVal, paramCallbacks);

        try {
          if ('route' === err) {
            nextRoute();
          } else if (err) {
            i = 0;
            callbacks(err);
          } else if (paramCallbacks && undefined !== paramVal) {
            paramCallback();
          } else if (key) {
            param();
          } else {
            i = 0;
            callbacks();
          }
        } catch (err) {
          param(err);
        }
      }

      param(err);

      // single param callbacks
      function paramCallback(err) {
        var fn = paramCallbacks[paramIndex++];
        if (err || !fn) return param(err);
        fn(req, res, paramCallback, paramVal, key.name);
      }

      // innvoke route callbacks
      function callbacks(err) {
        var fn = route.callbacks[i++];
        try {
          if ('route' === err) {
            nextRoute();
          } else if (err && fn) {
            if (4 > fn.length) return callbacks(err);
            fn(err, req, res, callbacks);
          } else if (fn) {
            fn(req, res, callbacks);
          } else {
            nextRoute(err);
          }
        } catch (err) {
          callbacks(err);
        }
      }

    })(0);

  };

  proto.matchRequest = function (req, i) {
    var path = req.url
      , routes = this.map
      , len = routes.length
      , route;

    i = i || 0
    // matching routes
    for (; i < len; ++i) {
      route = routes[i];
      if (route.match(path)) {
        req._route_index = i;
        return route;
      }
    }

  };

  proto.route = function (path) {
    if (!path) new Error('Router#get() requires a path');

    var callbacks = [].slice.call(arguments, 1)
      , route = new Route(path, callbacks, {
          sensitive: this.caseSensitive
        , strict: this.strict
      });

    (this.map = this.map || []).push(route);
    return this;
  };


  // Route
  function Route(path, callbacks, options) {
    options  = options || {};
    //this.method = 'GET';
    this.path = path;
    this.callbacks = callbacks;
    this.regexp = pathToRegexp(path
      , this.keys = []
      , options.sensitive
      , options.strict);
  }

  proto = Route.prototype;

  proto.match = function (path) {
    this.regexp.lastIndex = 0;

    var keys = this.keys
      , params = this.params = []
      , m = this.regexp.exec(path)
      , i, len
      , key, val;

    if (!m) return false;

    for (i = 1, len = m.length; i < len; ++i) {
      key = keys[i - 1];
      val = 'string' === typeof m[i]
        ? decodeURIComponent(m[i])
        : m[i];

      if (key) {
        params[key.name] = val;
      } else {
        params.push(val);
      }
    }

    return true;
  };


  // View
  function View(name, options, timestamp) {
    options = options || {};
    this.name = name;
    this.root = options.root;
    this.engine = options.engine;
    this.ext = extname(name);
    this.timestamp = timestamp || '';
    this.path = this.lookup(name);
  }

  proto = View.prototype;

  proto.lookup  = function (path) {
    return this.root + '/' + path + '?t=' + this.timestamp;
  };

  proto.render = function (options, fn) {
    //this.engine(this.path, options, fn);
    return read(this.engine, this.path, options, fn, this.ext);
  };



  // Middlewars
  // **************************************************

  // lightsaber init middleware:
  function lightsaberInit(app) {
    return function init(req, res, next) {
      req.res = res;
      res.req = req;

      req.next = next;

      res.locals = res.locals || locals(res);

      next();
    };
  }


  // Helper
  // **************************************************
  function uuid() {
    return ++uuid.id;
  }
  uuid.id = 0;

  // [].indexOf
  function indexOf(a, el, i) {
    var l = a.length;
    if (!l) return -1;
    i || (i = 0);
    if (i > l) return -1;
    (i < 0) && (i = Math.max(0, l + i));
    for (; i < l; ++i) {
      if (i in a && a[i] === el) return i;
    }
    return -1;
  }

  // ajax get template
  function read(engine, path, options, fn, ext) {
    return $.get(path, function (tpl) {
      var template, html = tpl;
      if (ext !== 'html') {
        template = engine.compile(tpl);
        html = template(options);
      }
      fn(html);
    });
  }

  // extname
  function extname(filename) {
    return filename.split('.')[1] || 'html';
  }

  // locals
  function locals(obj) {
    obj.viewCallbacks = obj.viewCallbacks || [];

    function _locals(obj) {
      for (var key in obj) _locals[key] = obj[key];
      return obj;
    }

    return _locals;
  }

  // merge
  function merge(t, s) {
    var k;
    if (t && s) {
      for (k in s) {
        t[k] = s[k];
      }
    }
    return t;
  }

  // isArray
  var isArray = Array.isArray;
  if (!isArray) {
    isArray = function (a) {
      return a instanceof Array;
    };
  }

  // pathToRegexp
  function pathToRegexp(path, keys, sensitive, strict) {
    if (path instanceof RegExp) return path;
    if (isArray(path)) path = '(' + path.join('|') + ')';
    path = path
      .concat(strict ? '' : '/?')
      .replace(/\/\(/g, '(?:/')
      .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function(_, slash, format, key, capture, optional, star) {
        keys.push({ name: key, optional: !! optional });
        slash = slash || '';
        return ''
          + (optional ? '' : slash)
          + '(?:'
          + (optional ? slash : '')
          + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
          + (optional || '')
          + (star ? '(/*)?' : '');
      })
    .replace(/([\/.])/g, '\\$1')
    .replace(/\*/g, '(.*)');
    return new RegExp('^' + path + '$', sensitive ? '' : 'i');
  }
});
