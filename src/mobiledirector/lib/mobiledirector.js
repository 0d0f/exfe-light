/* jshint -W015 */
(function () {
  'use strict';

  var now = Date.now || function () { return new Date().getTime(); }
    , _ENV_ = window._ENV_
    , apiUrl = _ENV_.api_url
    , app_scheme = _ENV_.app_scheme
    //, JSFILE = _ENV_.JSFILE
    //, CSSFILE = _ENV_.CSSFILE
    , supportHistory = window.history
    , localStorage = window.localStorage
    , eventType = supportHistory ? 'popstate' : 'hashchange'
    , location = window.location
    , empty = function () {}
    , app_url = app_scheme + '://crosses/'
    , routes = {
          home: /^\/+(?:\?)?#{0,}$/
        , smsToken: /^\/+\?(?:(redirect)?&)?t=([a-zA-Z0-9]{3,})$/
        , resolveToken: /^\/+(?:\?(redirect)?)?#token=([a-zA-Z0-9]{64})\/?$/
        , crossTokenForPhone: /^\/+(?:\?(redirect)?)?#!([1-9][0-9]*)\/([a-zA-Z0-9]{4})\/?$/
        , crossToken: /^\/+(?:\?(redirect)?)?#!token=([a-zA-Z0-9]{32})\/?$/
        , routex0: /^\/+(?:\?(redirect)?)?#!token=([a-zA-Z0-9]{4,})\/routex\/?$/
//        , routex1: /^\/+!token=([a-zA-Z0-9]{4,})\/routex\/?(?:\?(redirect)?)?$/
        , routex1: /^\/+!(\d+)\/routex\/?.*$/
      }
    , itunes = 'itms-apps://itunes.apple.com/us/app/exfe/id514026604'
    , startTime, currentTime, failTimeout;

  //window.isWeixin = !!(window.WeixinJSBridge && /MicroMessenger/.test(navigator.userAgent));
  window.isWeixin = !!(/MicroMessenger/i.test(navigator.userAgent));

  window.launchApp = function (url, cb) {
    url = url || app_url;
    startTime = now();
    failBack(cb, 200);
    redirectIframe(url);
  };

  window.openExfe = function (url) {
    url = url || '';
    startTime = now();
    window.launchApp(url, function () {
      redirectIframe(itunes);
    });
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
        clearTimeout(failTimeout);
        currentTime = now();
        if (currentTime - startTime < 500) {
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
      /*
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
      */
      cb();
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

  var getBrowsingIdentity = function (exfee, user_id, identity_id) {
      var invitations = exfee.invitations;
      for (var i = 0, len = invitations.length; i < len; ++i) {
        var invitation = invitations[i];
        if ((user_id && user_id === invitation.identity.connected_user_id)
              || identity_id === invitation.identity.id) {
          return invitation.identity;
          break;
        }
      }
    };

  var getCrossByUserToken = function (user_token, cross_id, done, error) {
    request({
        url: apiUrl + '/Crosses/' + cross_id + '?token=' + user_token
      , type: 'GET'
      , done: function (d) {
          var code = d.meta.code;
          if (code === 200) {
            done(d);
          } else {
            error(d);
          }
        }
      , error: function (d) {
          error(d);
        }
    });
  };

  var getCrossByXCode = function (xcode, done, error) {
    var formData = { invitation_token: xcode }, cat;

    var cats = JSON.parse(localStorage.getItem('cats'));
    if (cats && (cat = cats[xcode])) {
      formData.cross_access_token = cat;
    }

    request({
        url: apiUrl + '/Crosses/GetCrossByInvitationToken'
      , type: 'POST'
      , data: formData
      , done: function (d) {
          var code = d.meta.code;
          if (code === 200) {
            done(d);
          } else {
            error(d);
          }
        }
      , error: function (d) {
          error(d);
        }
    });
  };

  var doOAuth = function (provider, data, done, error) {
    request({
        url: '/oauth/authenticate?provider=' + provider
      , type: 'POST'
      , data: data
      , done: function (d) {
          var code = d.meta.code;
          if (code === 200) {
            done(d);
          } else {
            error(d);
          }
        }
      , error: function (data) {
          error(data);
        }
    });
  };

  var addUserToExfee = function (exfee_id, formData, done, error) {
    request({
        url: apiUrl + '/exfee/' + exfee_id + '/invite'
      , type: 'POST'
      , data: formData
      , done: function (d) {
          var code = d.meta.code;
          if (code === 200) {
            done(d);
          } else {
            error(d);
          }
        }
      , error: function (d) {
          error(d)
        }
    });
  };

  var getAuthFromHeader = function () {
    var header = document.getElementsByTagName('head')[0]
      , meta = document.getElementsByName('authorization')[0]
      , authMeta = null;
    if (meta) {
      authMeta = JSON.parse(meta.content);
      header.removeChild(meta);
    }
    return authMeta;
  };

  var Director = function () {};

  Director.dispatch = function (url) {
    /* jshint -W004 */
    delete _ENV_._data_;
    var params;
    if (routes.home.test(url)) {
      handle();

    } else if ((params = url.match(routes.smsToken))) {
      window.noExfeApp = !!params[1];

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

    } else if ((params = url.match(routes.routex0))) {
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
    } else if ((params = url.match(routes.routex1))) {
      var querystring = location.search.substr(1);
      var items = querystring.split('&'), item, datas = {}, key, val;
      while ((item = items.shift())) {
        item = item.split('=');
        key = item[0];
        val = item[1] || '';
        datas[decodeURIComponent(key.replace(/\+/g, ' '))] = decodeURIComponent(val.replace(/\+/g, ' '));
      }

      var cross_id = params[1]
        , xcode = datas.xcode
        , via = datas.via;

      /*

      var ctoken = datas.xcode
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
      */

      var authorization = JSON.parse(localStorage.getItem('authorization'))
        , user_id = authorization && authorization.user_id
        , user_token = authorization && authorization.token
        , username = (authorization && authorization.name) || ''
        , auth = getAuthFromHeader();

      // 是否跟本地的 user-token 进行合并？
      if (auth && auth.authorization) {
        authorization = auth.authorization;
        user_id = authorization.user_id;
        user_token = authorization.token;
        username = authorization.name;
        localStorage.setItem('authorization', JSON.stringify({
            user_id: user_id
          , token: user_token
          , name: username || ''
        }));
      }

      if (window.isWeixin) {
        // has user-token
        if (user_id && user_token) {
          if (window._ENV_.smith_id && window._ENV_.exfee_id) {
            var formData = {
                xcode: xcode
              , user_token: user_token
              , widget_type: 'routex'
            };
            if (via) {
              formData.via = via;
            }
            addUserToExfee(
                window._ENV_.exfee_id
              , formData
              , function (d) {
                  _ENV_._data_ = d;
                  var browsing_identity = getBrowsingIdentity(d.response.cross.exfee, user_id);
                  _ENV_._data_.response.browsing_identity = browsing_identity;
                  _ENV_._data_.tokenInfos = [user_token, browsing_identity.id];
                  _ENV_._data_.smith_id = window._ENV_.smith_id;
                  _ENV_._data_.username = username || '';
                  handle();
                }
              , function (d) {
                  var code = d.meta.code
                    , errorType = d.meta.errorType;
                  if (code === 400) {
                    doOAuth(
                        'wechat'
                      , { refere: window.location.href }
                      , function (d) {
                          window.location.href = d.response.redirect;
                        }
                        // 提示用户 OAuth
                      , function (d) {}
                    );
                  }

                  /*
                  // -------------------------- get cross by user-token
                  getCrossByUserToken(
                      user_token
                    , cross_id
                    , function (d) {
                        // go to routex
                        _ENV_._data_ = d;
                        var browsing_identity = getBrowsingIdentity(d.response.cross.exfee, user_id);
                        _ENV_._data_.response.browsing_identity = browsing_identity;
                        _ENV_._data_.tokenInfos = [user_token, browsing_identity.id];
                        _ENV_._data_.smith_id = window._ENV_.smith_id;
                        handle();
                      }
                    , function (d) {
                        // wechat OAuth

                        if (!auth) {
                          doOAuth(
                              'wechat'
                            , { refere: window.location.href }
                            , function (d) {
                                window.location.href = d.response.redirect;
                              }
                              // 提示用户 OAuth
                            , function (d) {}
                          );
                        } else {
                          getCrossByXCode(
                              xcode
                            , function (d) {
                                var response = d.response;
                                var _auth = response.authorization;
                                // 进行合并
                                if (_auth) {
                                  localStorage.setItem('authorization', JSON.stringify({
                                      user_id: _auth.user_id
                                    , token: _auth.token
                                  }));
                                }
                                var cross_access_token = response.cross_access_token;
                                if (cross_access_token) {
                                  var cats = JSON.parse(localStorage.getItem('cats'));
                                  if (!cats) { cats = {}; }
                                  cats[xcode] = cross_access_token;
                                }
                                _ENV_._data_ = d;
                                var browsing_identity = getBrowsingIdentity(d.response.cross.exfee, user_id);
                                _ENV_._data_.response.browsing_identity = browsing_identity;
                                _ENV_._data_.tokenInfos = [_auth ? _auth.token : null, browsing_identity.id];
                                _ENV_._data_.smith_id = window._ENV_.smith_id;
                                handle();
                              }
                            , function (d) {
                                // invalid link
                                redirectByError(d.meta);
                              }
                          );

                        }

                      }
                  );
                  // --------------------------------------------------
                  */

                }
            );
          } else {
            getCrossByUserToken(
                user_token
              , cross_id
              , function (d) {
                  // go to routex
                  _ENV_._data_ = d;
                  var browsing_identity = getBrowsingIdentity(d.response.cross.exfee, user_id);
                  _ENV_._data_.response.browsing_identity = browsing_identity;
                  _ENV_._data_.tokenInfos = [user_token, browsing_identity.id];
                  _ENV_._data_.smith_id = window._ENV_.smith_id;
                  _ENV_._data_.username = username || '';
                  handle();
                }
              , function (d) {
                  // wechat OAuth

                  if (!auth) {
                    doOAuth(
                        'wechat'
                      , { refere: window.location.href }
                      , function (d) {
                          window.location.href = d.response.redirect;
                        }
                      , function (d) {
                          // 提示用户 OAuth
                          alert('Wechat OAuth fail.')
                        }
                    );
                  } else {
                    getCrossByXCode(
                        xcode
                      , function (d) {
                          var response = d.response;
                          var _auth = response.authorization;
                          // 进行合并 ?
                          if (_auth) {
                            localStorage.setItem('authorization', JSON.stringify({
                                user_id: _auth.user_id
                              , token: _auth.token
                              , name: _auth.name
                            }));
                          }
                          var cross_access_token = response.cross_access_token;
                          if (cross_access_token) {
                            var cats = JSON.parse(localStorage.getItem('cats'));
                            if (!cats) { cats = {}; }
                            cats[xcode] = cross_access_token;
                          }
                          _ENV_._data_ = d;
                          var browsing_identity = getBrowsingIdentity(d.response.cross.exfee, user_id);
                          _ENV_._data_.response.browsing_identity = browsing_identity;
                          _ENV_._data_.tokenInfos = [_auth ? _auth.token : null, browsing_identity.id];
                          _ENV_._data_.smith_id = window._ENV_.smith_id;
                          _ENV_._data_.username = (_auth && _auth.name) || '';
                          handle();
                        }
                      , function (d) {
                          // invalid link
                          redirectByError(d.meta);
                        }
                    );

                  }

                }
            );
          }

        // wechat OAuth
        } else {
          doOAuth(
              'wechat'
            , { refere: window.location.href }
            , function (d) {
                window.location.href = d.response.redirect;
              }
            , function (d) {
                alert('Wechat OAuth fail.')
                // 提醒用户 OAuth
              }
          );
        }
      }

    } else {
      window.location = '/';
    }
  };

  Director.getPath = function () {
    return location.pathname + location.search + location.hash;
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
