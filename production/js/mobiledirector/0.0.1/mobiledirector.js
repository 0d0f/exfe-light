/* jshint -W015 */
(function () {
  'use strict';

  var now = Date.now || function () { return new Date().getTime(); }
    , _ENV_ = window._ENV_
    , apiUrl = _ENV_.api_url
    , app_scheme = _ENV_.app_scheme
    , JSFILE = _ENV_.JSFILE
    , CSSFILE = _ENV_.CSSFILE
    , supportHistory = window.history
    , localStorage = window.localStorage
    , eventType = supportHistory ? 'popstate' : 'hashchange'
    , location = window.location
    , empty = function () {}
    //, xframe = document.getElementById('xframe')
    , app_url = app_scheme + '://crosses/'
    , routes = {
          home: /^\/+(?:\?)?#{0,}$/
        , smsToken: /^\/+\?(?:(redirect)?&)?t=([a-zA-Z0-9]{3,})$/
        , resolveToken: /^\/+(?:\?(redirect)?)?#token=([a-zA-Z0-9]{64})\/?$/
        , crossTokenForPhone: /^\/+(?:\?(redirect)?)?#!([1-9][0-9]*)\/([a-zA-Z0-9]{4})\/?$/
        , crossToken: /^\/+(?:\?(redirect)?)?#!token=([a-zA-Z0-9]{32})\/?$/
        , routex: /^\/+(?:\?(redirect)?)?#!token=([a-zA-Z0-9]{4,})\/routex\/?$/
      }
    , itunes = 'itms-apps://itunes.apple.com/us/app/exfe/id514026604'
    , startTime, currentTime, failTimeout;

  window.launchApp = function (url, cb, ttl) {
    url = url || app_url;
    startTime = now();
    failBack(cb, ttl);
    //xframe.src = url;
    redirectIframe(url);
  };

  window.openExfe = function () {
    startTime = now();
    window.launchApp('', function () {
      redirectIframe(itunes);
    }, 1000);
  };

  var redirectIframe = function (url, id) {
      !id && (id = 'app-redirect');
      var i = document.getElementById(id);
      if (i) { document.body.removeChild(i); }
      i = document.createElement('iframe')
      document.body.appendChild(i);
      i.id = id;
      i.src = url;
      i.setAttribute('frameborder', 0);
      i.className = 'hide';
      i.style.display = 'none';
      return i;
    },

    failBack = function (cb, ttl) {
      failTimeout = setTimeout(function () {
        currentTime = now();
        // 时间摄长点，避免两次弹窗
        if (currentTime - startTime < 1000) {
          if (cb) {
            cb();
          } else {
            window.location.href = '/';
          }
        }
        clearTimeout(failTimeout);
      }, ttl || 200);
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
        injectCss('/static/css/' + CSSFILE, css);
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
        localStorage.setItem('authorization', JSON.stringify(authorization));
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
            token = authorization.token;
            args += '?user_id='     + user_id
                  + '&token='       + token
                  + '&identity_id=' + myIdId;
          }
        }
      }
      // 手机暂时必需要有 token
      return [token, args];
    },

    checkSmithToken = function (d) {
      var authorization = d.authorization
        //, action = d.action
        , user_id
        // my identity id
        , myIdentityId
        , t
        , token;

      /*
      if (action !== 'CLAIM_IDENTITY') {
        return token;
      }
      */

      if (authorization) {
        t = authorization.token;
        user_id = authorization.user_id;
        localStorage.setItem('authorization', JSON.stringify(authorization));
      } else if ((authorization = JSON.parse(localStorage.getItem('authorization')))) {
        t = authorization.token;
        user_id = authorization.user_id;
      }

      if (t) {
        var invitations = d.cross.exfee.invitations, invitation;
        for (var i = 0, len = invitations.length; i < len; ++i) {
          invitation = invitations[i];
          if (user_id === invitation.identity.connected_user_id) {
            token = t;
            myIdentityId = invitation.identity.id;
            break;
          }
        }
      }

      return [token, myIdentityId];
    },

    redirectByError = function (errorMeta) {
      setError(errorMeta);
      window.location = '/';
    },

    crossFunc = function (data, noCheckApp) {
      request({
          url: apiUrl + '/Crosses/GetCrossByInvitationToken'
        , type: 'POST'
        , data: data
        , done: function (data) {
            _ENV_._data_ = data;
            if (data.meta && data.meta.code === 200) {
              var c = crossCallback(data.response);
              _ENV_._data_.tokenInfos = checkSmithToken(data.response);
              if (c[0] && c[1]) {
                if (noCheckApp || window.noExfeApp) {
                  handle();
                } else {
                  window.launchApp(app_url + c[1], function () {
                    window.location = '/?redirect' + location.hash;
                  }, 500);
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
    window.noExfeApp = !!url.match(/\?redirect/);
    var params;
    if (routes.home.test(url)) {
      handle();

    } else if (url.match(routes.smsToken)) {

      var __t;
      if (window.noExfeApp) {
        __t = localStorage.getItem('tmp-token');
        if (__t) {
          __t = JSON.parse(__t);
        }
      } else {
        __t = getSMSTokenFromHead();
        localStorage.setItem('tmp-token', JSON.stringify(__t));
      }

      if (__t) {
        _ENV_._data_ = __t;
        handle();
      } else {
        redirectByError({ code: 400 });
      }

    } else if ((params = url.match(routes.resolveToken))) {
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
                localStorage.setItem('tmp-token', JSON.stringify(__t));
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
      /* jshint -W003 */
      var cross_id = params[2]
        , ctoken = params[3]
        , cats = localStorage.getItem('cats')
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
      var ctoken = params[2]
        , cats = localStorage.getItem('cats')
        , data = { invitation_token: ctoken }
        , token;

      if (cats) {
        cats = JSON.parse(cats);
      }

      if (cats && (token = cats[ctoken])) {
        data.cross_access_token = token;
      }

      crossFunc(data);

    } else if ((params = url.match(routes.routex))) {
      var ctoken = params[2]
        , cats = localStorage.getItem('cats')
        , data = { invitation_token: ctoken }
        , token;

      if (cats) {
        cats = JSON.parse(cats);
      }

      if (cats && (token = cats[ctoken])) {
        data.cross_access_token = token;
      }

      crossFunc(data, true);

      // dev
      /*
      var cross_id = 100718;
      var token = 'f12988492a46c2cf05be0ceff43abb643d13d37d549e95c7a1c8776f371df649';
      request({
        url: apiUrl + '/crosses/' + cross_id + '?token=' + token;
      , type: 'POST'
      , done: function (data) {
          if (data.meta && data.meta.code === 200) {
            _ENV_._data_ = data;
            handle();
          } else {
          }
        }
      , fail: function (data) {
        }
      });
    */

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

  /**
   * 跳 App 逻辑
   * 由于当前 App 还不支持 read-only 跳转, 此时不跳
   */
})();
