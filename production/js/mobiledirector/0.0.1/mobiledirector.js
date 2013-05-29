/* jshint -W015 */
(function () {
  'use strict';

  var now = Date.now || function () { return new Date().getTime(); }
    , _ENV_ = window._ENV_
    , apiUrl = _ENV_.api_url
    , app_scheme = _ENV_.app_scheme
    , JSFILE = _ENV_.JSFILE
    , supportHistory = window.history
    , localStorage = window.localStorage
    , eventType = supportHistory ? 'popstate' : 'hashchange'
    , location = window.location
    , empty = function () {}
    , mframe = document.getElementById('mframe')
    , xframe = document.getElementById('xframe')
    , app_url = app_scheme + '://crosses/'
    , routes = {
          home: /^\/+(?:\?)?#{0,}$/
        , resolveToken: /^\/+(?:\?)?#token=([a-zA-Z0-9]{64})\/?$/
        , crossTokenForPhone: /^\/+(?:\?)?#!([1-9][0-9]*)\/([a-zA-Z0-9]{4})\/?$/
        , crossToken: /^\/+(?:\?)?#!token=([a-zA-Z0-9]{32})\/?$/
      }
    , startTime, currentTime, failTimeout;

  var failBack = function (cb) {
      failTimeout = setTimeout(function () {
        clearTimeout(failTimeout);
        currentTime = now();
        if (currentTime - startTime < 500) {
          if (cb) {
            cb();
          } else {
            window.location = '/';
          }
        }
      }, 400);
    },

    launchApp = function (url, cb) {
      startTime = now();
      xframe.src = url || app_url;
      failBack(cb);
    },

    checkNodeExsits = function (id) {
      var n = document.getElementById(id);
      return !!n;
    },

    injectScript = function (src, id, done, fail) {
      var n = document.createElement('script');
      n.src = src;
      n.id = id;
      n.async = true;
      n.onload = done || empty;
      n.onerror = fail || empty;
      document.body.appendChild(n);
    },

    injectCss = function (href, id) {
      var n = document.createElement('link');
      n.id = id;
      n.rel = 'stylesheet';
      n.media = 'screen';
      n.type = 'text/css';
      n.href = href;
      document.getElementsByTagName('head')[0].appendChild(n);
    },

    inject = function (cb) {
      var css = 'mobile-css';
      if (!checkNodeExsits(css)) {
        injectCss('/static/css/exfe_mobile.min.css', css);
      }
      var js = 'mobile-js';
      if (!checkNodeExsits(js)) {
        injectScript('/static/js/' + JSFILE, js, cb);
      } else {
        cb();
      }
    },

    handle = function () {
      inject(function () {
        mframe.className = 'hide';
        App.request.updateUrl();
        App.handle(App.request, App.response);
      });
    },

    serialize = function (data) {
      var d = [], k;
      for (k in data) {
        d.push(encodeURIComponent(k) + '=' + encodeURIComponent(data[k]));
      }
      return d.join('&').replace(/%20/g, '+');
    },

    request = function (opts) {
      var xhr = new XMLHttpRequest()
        , done = opts.done || empty
        , fail = opts.fail || empty
        , abortTimeout;

      xhr.open(opts.type || 'GET', opts.url, true);
      xhr.overrideMimeType('application/json');
      if ('GET' !== opts.type && opts.data) {
        xhr.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01')
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      }
      xhr.withCredentials = true;
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          xhr.onreadystatechange = void 0;
          clearTimeout(abortTimeout);
          var result, error = false
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
            try {
              result = JSON.parse(xhr.responseText);
            } catch (e) { error = e; }
            if (error) {
              fail(result, 'parsererror', xhr, opts);
            } else {
              done(result, xhr, opts);
            }
          } else {
            fail(result, xhr.status ? 'error' : 'abort', xhr, opts);
          }
        }
      };

      abortTimeout = setTimeout(function(){
        xhr.onreadystatechange = void 0;
        xhr.abort();
        xhr = void 0;
      }, 5000);

      xhr.send(opts.data ? serialize(opts.data) : null);

      return xhr;
    },

    crossCallback = function (response) {
      var cross = response.cross;
      // user_id
      var user_id = 0;
      // identity_id
      var myIdId = 0;
      var authorization = response.authorization;
      if (authorization) {
        user_id = authorization.user_id;
        if (response.browsing_identity) {
          myIdId = response.browsing_identity.id;
        }
      } else if (response.browsing_identity
        && response.browsing_identity.connected_user_id) {
        user_id = response.browsing_identity.connected_user_id;
        myIdId = response.browsing_identity.id;
      }
      var invitations = cross.exfee.invitations;
      for (var i = 0, len = invitations.length; i < len; ++i) {
        var invitation = invitations[i];
        if ((user_id && user_id === invitation.identity.connected_user_id)
              || myIdId === invitation.identity.id) {
          myIdId = invitation.identity.id;
        }
      }

      var args = cross.id || '', token = '';
      if (user_id) {
        if (authorization) {
          args += '?user_id='     + user_id
                + '&token='       + authorization.token
                + '&identity_id=' + myIdId;
          token = authorization.token;
        } else if (authorization = localStorage.getItem('authorization')) {
          authorization = JSON.parse(authorization);
          if (authorization.user_id === user_id) {
            args += '?user_id='     + user_id
                  + '&token='       + authorization.token
                  + '&identity_id=' + myIdId;
            token = authorization.token;
          }
        }
      }
      return args;
    },

    crossFunc = function (data) {
      request({
          url: apiUrl + '/Crosses/GetCrossByInvitationToken'
        , type: 'POST'
        , data: data
        , done: function (data) {
            _ENV_._data_ = data;
            if (data.meta && data.meta.code === 200) {
              launchApp(app_url + crossCallback(data.response), function () {
                handle();
              });
            } else {
              window.location = '/';
            }
          }
        , fail: function (data) {
            _ENV_._data_ = data;
            window.location = '/';
          }
        });
    };

  var Director = function () {};

  Director.dispatch = function (url) {
    /* jshint -W004 */
    mframe.className = '';
    delete _ENV_._data_;
    var params;
    if (routes.home.test(url)) {
      handle();
    } else if ((params = url.match(routes.resolveToken))) {
      request({
          url: apiUrl + '/Users/ResolveToken'
        , type: 'POST'
        , data: { token :  params[1] }
        , done: function (data) {
            _ENV_._data_ = data;
            if (data.meta && data.meta.code === 200) {
              handle();
            } else {
              window.location = '/';
            }
          }
        , fail: function (data) {
            _ENV_._data_ = data;
            handle();
          }
        });
    } else if ((params = url.match(routes.crossTokenForPhone))) {
      var cross_id = params[1]
        , ctoken = params[2]
        , cats = localStorage.cats
        , token
        , data = {};

      if (cats) {
        cats = JSON.parse(cats);
      }

      data = {
        invitation_token: ctoken,
        cross_id: cross_id
      };

      if (cats && (token = cats[ctoken])) {
        data.cross_access_token = token;
      }

      crossFunc(data);

    } else if ((params = url.match(routes.crossToken))) {
      var ctoken = params[1]
        , cats = localStorage.cats
        , data = { invitation_token: ctoken }
        , token;

      if (cats && (token = cats[ctoken])) {
        data.cross_access_token = token;
      }

      crossFunc(data);

    } else {
      window.location = '/';
    }
  };

  Director.handle = function (e) {
    var url = location.hash;
    Director.dispatch('/' + url, e);
  };

  Director.start = function () {
    // mobile
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) {
        handle();
      }
    });

    document.addEventListener('webkitvisibilitychange', function() {
      if (document.webkitVisibilityState === 'visible') {
        handle();
      }
    });

    window.addEventListener(eventType, function (e) {
      Director.handle(e);
      e.stopPropagation()
      e.preventDefault()
      return false;
    });
  };

  Director.start();
})();
