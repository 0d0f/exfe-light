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
    , xframe = document.getElementById('xframe')
    , app_url = app_scheme + '://crosses/'
    , routes = {
          home: /^\/+(?:\?)?#{0,}$/
        , smsToken: /^\/+\?(?:(redirect)?&)?t=([a-zA-Z0-9]{3,})$/
        , resolveToken: /^\/+(?:\?(redirect)?)?#token=([a-zA-Z0-9]{64})\/?$/
        , crossTokenForPhone: /^\/+(?:\?(redirect)?)?#!([1-9][0-9]*)\/([a-zA-Z0-9]{4})\/?$/
        , crossToken: /^\/+(?:\?(redirect)?)?#!token=([a-zA-Z0-9]{32})\/?$/
      }
    , itunes = 'itms-apps://itunes.apple.com/us/app/exfe/id514026604'
    , startTime, currentTime, failTimeout;

  window.launchApp = function (url, cb) {
    url = url || app_url;
    startTime = now();
    xframe.src = url;
    failBack(cb);
  };


  window.openExfe = function () {
    window.launchApp('', function () {
      xframe.src = itunes;
    });
  };

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
      }, 200);
    },

    getSMSTokenFromHead = function () {
      var header = document.getElementsByTagName('head')[0],
          meta = document.getElementsByName('sms-token')[0],
          smsToken;

      if (meta) {
        smsToken = JSON.parse(meta.content);
        header.removeChild(meta);
      }

      return smsToken;
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
      var url = Director.getPath();
      if ('/' !== url && url === Director.url) { return; }
      inject(function () {
        App.request.updateUrl();
        App.handle(App.request, App.response);
      });
      Director.url = url;
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

    getError = function () {
      return !!localStorage.getItem('error');
    },

    setError = function (error) {
      localStorage.setItem('error', JSON.stringify(error));
    },

    removeError = function () {
      localStorage.removeItem('error');
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
      // 手机暂时必需要有 token
      return [token, args];
    },

    redirectByError = function (errorMeta) {
      setError(errorMeta);
      window.location = '/';
    },

    crossFunc = function (data) {
      request({
          url: apiUrl + '/Crosses/GetCrossByInvitationToken'
        , type: 'POST'
        , data: data
        , done: function (data) {
            _ENV_._data_ = data;
            if (data.meta && data.meta.code === 200) {
              var c = crossCallback(data.response);
              if (c[0] && c[1]) {
                if (window.noExfeApp) {
                  handle();
                } else {
                  window.launchApp(app_url + c[1], function () {
                    setTimeout(function () {
                      window.location = '/?redirect' + location.hash;
                    }, 200)
                  });
                }
              } else {
                handle();
              }
            } else {
              redirectByError(data.meta);
            }
          }
        , fail: function (data) {
            redirectByError(data.meta);
          }
        });
    };

  var Director = function () {};

  Director.dispatch = function (url) {
    /* jshint -W004 */
    delete _ENV_._data_;
    var params;
    if (routes.home.test(url)) {
      handle();

    } else if (url.match(routes.smsToken)) {
      window.noExfeApp = !!params[1];

      var __t;
      if (window.noExfeApp) {
        __t = localStorage.getItem('tmp-token');
        if (__t) {
          __t = JSON.parse(__t);
        }
      } else {
        __t = getSMSTokenFromHead();
        localStorage.setItem('tmp-token', __t);
      }

      if (__t) {
        _ENV_._data_ = __t;
        handle();
      } else {
        redirectByError({ code: 400 });
      }

    } else if ((params = url.match(routes.resolveToken))) {
      window.noExfeApp = !!params[1];
      var __t;
      if (window.noExfeApp) {
        __t = localStorage.getItem('tmp-token');
        if (__t) {
          __t = JSON.parse(__t);
        }
      }

      if (__t) {
        _ENV_._data_ = __t;
        handle();
      } else {
        var token = params[2];
        request({
            url: apiUrl + '/Users/ResolveToken'
          , type: 'POST'
          , data: { token :  token }
          , done: function (data) {
              if (token && data.meta && data.meta.code === 200) {
                __t = _ENV_._data_ = data.response;
                localStorage.setItem('tmp-token', __t);
                handle();
              } else {
                redirectByError(data.meta);
              }
            }
          , fail: function (data) {
              redirectByError(data.meta);
            }
          });
      }
    } else if ((params = url.match(routes.crossTokenForPhone))) {
      window.noExfeApp = !!params[1];
      /* jshint -W003 */
      var cross_id = params[2]
        , ctoken = params[3]
        , cats = localStorage.cats
        , token;

      if (cats) {
        cats = JSON.parse(cats);
      }

      var data = {
        invitation_token: ctoken,
        cross_id: cross_id
      };

      if (cats && (token = cats[ctoken])) {
        data.cross_access_token = token;
      }

      crossFunc(data);

    } else if ((params = url.match(routes.crossToken))) {
      window.noExfeApp = !!params[1];
      var ctoken = params[2]
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

  Director.getPath = function () {
    return '/' + location.search + location.hash;
  };

  Director.handle = function (e) {
    if (getError()) {
      alert('Sorry. Your link is invalid or expired. Requested page was not found.');
      removeError();
    }
    var url = Director.getPath();
    Director.dispatch(url, e);
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
