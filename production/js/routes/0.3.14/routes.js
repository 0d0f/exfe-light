/* jshint -W030 */

/**
 * Routes
 */
define('routes', function (require, exports, module) {
  'use strict';

  var R = require('rex'),
      Api = require('api'),
      Bus = require('bus'),
      Util = require('util'),
      Store = require('store');

  require('user');

  var routes = module.exports = {};


  // index
  routes.index = function (req, res) {
    // redirect to `profile`
    if (req.session.authorization) {
      redirectToProfile(req, res);
      return;
    }

    // is `home`
    Bus.emit('app:page:home', true);

    res.render('home.html', function (tpl) {
      $('#app-main').append(tpl);
      $.ajax({
        dataType: 'script',
        cache: true,
        url: '/static/js/newhome/0.0.1/newhome.min.js?t=' + req.app.set('timestamp')
      });
    });
  };


  // gather a x
  routes.gather = function (req, res) {
    var session = req.session;

    // is not `home` page
    Bus.emit('app:page:home', false);

    if (!session.initMenuBar) {

      var authorization = session.authorization,
          user = session.user;

      Bus.emit('app:page:usermenu', !!authorization);

      if (authorization) {
        session.initMenuBar = true;
        Bus.emit('app:usermenu:updatenormal', user);

        Bus.emit('app:usermenu:crosslist',
          authorization.token,
          authorization.user_id
        );
      }
    }

    res.render('x.html', function(tpl) {
      $('#app-main').append(tpl);
      Bus.emit('xapp:cross:main');
      Bus.emit('xapp:cross', 0);
    });
  };

  // resolve token
  routes.resolveToken = function (req, res, next) {
    req.origin = 'resolveToken';
    var originToken = req.params[0];

    Bus.emit('app:page:home', false);
    Bus.emit('app:page:usermenu', true);

    if (originToken) {
      next();
    }
    else {
      res.redirect('/#invalid/token=' + originToken);
    }
  };

  routes.inspectResolveToken = function (req, res, next, data, originToken) {
    var session = req.session,
        user = session.user,
        authorization = session.authorization;
    // token_type
    //  verify
    //  forgot password: SET_PASSWORD
    /*
     * data = {
     *   user_id
     * , user_name
     * , identity_id
     * , token
     * , token_type
     * , action
     * }
     */
    session.originToken = originToken;
    session.resolveData = data;
    var target_token = data.token
      , target_user_id = data.user_id
      , target_user_name = data.user_name
      // 是否还有可以合并的 `identities`
      //, mergeable_user = data.mergeable_user
      , mergeable_user = null
      , token_type = data.token_type
      , action = data.action
      , browsing_authorization;

    if (!mergeable_user
        && ((authorization && authorization.user_id === target_user_id)
          || (!authorization && token_type === 'VERIFY' && action === 'VERIFIED'))
       ) {
      authorization = {
        token: target_token,
        user_id: target_user_id
      };
      Store.set('authorization', session.authorization = authorization);
      session.auto_sign = action !== 'INPUT_NEW_PASSWORD';
    }
    else {
      session.browsing_authorization = browsing_authorization = data;
    }

    Bus.emit('app:api:getuser'
      , target_token
      , target_user_id
      , function done(data) {
        var new_user = data.user;
        session.resolveData.setup = action === 'INPUT_NEW_PASSWORD' && token_type === 'VERIFY' && new_user.password === false;
        if (browsing_authorization) {
          session.browsing_user = new_user;
          var eun = Util.printExtUserName(new_user.identities[0])
            , forwardUrl;
          if (authorization) {
            forwardUrl = '/#' + eun + '/token=' + originToken;
          }
          else {
            forwardUrl = '/#' + eun;
          }
          Bus.emit('app:usermenu:updatebrowsing',
            {   normal: user
              , browsing: new_user
              , action: action
              , setup: action === 'INPUT_NEW_PASSWORD' && token_type === 'VERIFY' && new_user.password === false
              , originToken: originToken
              , tokenType: 'user'
              , page: 'resolve'
              , readOnly: true
              , user_name: target_user_name || new_user.name
              , mergeable_user: mergeable_user
              , forward: forwardUrl
            }
            , 'browsing_identity');
        }
        else {
          Store.set('user', user = session.user = data.user);
          Bus.emit('app:usermenu:updatenormal', user);
          Bus.emit('app:usermenu:crosslist'
            , authorization.token
            , authorization.user_id
          );
        }
        next();
      }
    );
  };

  routes.resolveRequest = function (req, res, next) {
    var session = req.session
      , originToken = req.params[0];

    session.originToken = originToken;
    Api.request('resolveToken',
      { type: 'POST', data: { token: originToken } },
      function (data) {
        routes.inspectResolveToken(req, res, next, data, originToken);
      },
      function () {
        res.redirect('/#invalid/token=' + originToken);
      }
    );
  };

  routes.resolveShow = function (req, res) {
    var session = req.session
      , auto_sign = session.auto_sign
      , originToken = session.originToken
      , user = session.user
      , authorization = session.authorization
      , browsing_authorization = session.browsing_authorization
      , browsing_user = session.browsing_user
      , resolveData = session.resolveData
      , target_identity_id = resolveData.identity_id
      , token_type = resolveData.token_type
      //, mergeable_user = resolveData.mergeable_user
      , mergeable_user = null
      , action = resolveData.action
      , tplUrl = 'identity_verified.html';

    if (mergeable_user) {
      res.render(tplUrl, function (tpl) {
        var $main = $('#app-main');
        $main.append(tpl);
        var d = $('<div id="js-dialog-merge" data-destory="true" data-widget="dialog" data-dialog-type="mergeidentity">');
        d.data('source', {
          merged_identity: R.find(browsing_user.identities, function (v) {
            if (v.id === target_identity_id) { return true; }
          }),
          browsing_token: originToken,
          mergeable_user: mergeable_user
        });
        d.appendTo($('#app-tmp'));
        d.trigger('click.dialog.data-api');
        $('.modal-mi').css('top', 230);
      });
      return;
    }

    if (auto_sign && authorization && !browsing_authorization) {
      delete session.auto_sign;
      res.render(tplUrl, function (tpl) {
        var $main = $('#app-main');
        $main.append(tpl);
        $main.find('.tab01').removeClass('hide');
        $main.find('.tab01 > p').animate({opacity: 0}, 2333, function () {
          res.redirect('/');
        });
      });
      return;
    }

    if (!auto_sign && token_type === 'VERIFY' && action === 'VERIFIED') {
      res.render(tplUrl, function (tpl) {
        var $main = $('#app-main');
        $main.append(tpl);
        $('#app-browsing-identity').trigger('click.data-api');
        $('.modal-bi').css('top', 200);
      });
      return;
    }


    if (action === 'INPUT_NEW_PASSWORD') {
      var d;
      tplUrl = 'forgot_password.html';
      res.render(tplUrl, function (tpl) {
        $('#app-main').append(tpl);
        if (authorization && !browsing_authorization) {
          var identity = R.find(user.identities, function (v) {
            if (v.id === target_identity_id) {
              return true;
            }
          });
          if (token_type === 'VERIFY') {
            d = $('<div class="merge set-up" data-destory="true" data-user-action="setup" data-widget="dialog" data-dialog-type="setup_email">');
            d.data('source', {
              browsing_user: user,
              identity: identity,
              originToken: originToken,
              user_name: resolveData.user_name,
              tokenType: 'user'
            });
          }
          else if (token_type === 'SET_PASSWORD') {
            d = $('<div class="setpassword" data-destory="true" data-widget="dialog" data-dialog-type="setpassword">');
            d.data('source', {
              user: user,
              token: resolveData.setup ? authorization.token : originToken,
              setup: resolveData.setup
            });
          }
          d.appendTo($('#app-tmp'));
          d.trigger('click.dialog.data-api');
        }
        else {
          if (token_type === 'VERIFY') {
            Bus.once('app:user:signin:after', function () {
              var d2 = $('<div class="addidentity" data-destory="true" data-widget="dialog" data-dialog-type="addIdentityAfterSignIn">');
              d2.data('source', {
                identity: browsing_user.identities[0]
              });
              d2.appendTo($('#app-tmp'));
              d2.trigger('click.dialog.data-api');
            });
            $('#app-user-menu').find('.set-up').trigger('click.dialog.data-api');
          }
          else {
            d = $('<div class="setpassword" data-destory="true" data-widget="dialog" data-dialog-type="setpassword">');
            d.data('source', {
              user: browsing_user,
              token: resolveData.setup ? browsing_authorization.token : originToken,
              setup: resolveData.setup
            });
            d.appendTo($('#app-tmp'));
            d.trigger('click.dialog.data-api');
          }
        }
        $('.modal-su, .modal-sp, .modal-bi').css('top', 230);
      });
    }

    delete session.browsing_authorization;
    delete session.resolveData;
    delete session.originToken;
  };

  // cross
  routes.cross = function (req, res) {
    var session = req.session
      , authorization = session.authorization
      , user = session.user;

    if (!authorization) {
      //res.redirect('/');
      Bus.emit('app:page:home', false);
      Bus.emit('app:page:usermenu', false);
      Bus.emit('app:cross:forbidden', req.params[0], null);
      return;
    }

    Bus.emit('app:page:home', false);

    Bus.emit('app:page:usermenu', true);

    if (!session.initMenuBar) {
      //session.initMenuBar = true;
      Bus.emit('app:usermenu:updatenormal', user);

      Bus.emit('app:usermenu:crosslist'
        , authorization.token
        , authorization.user_id
      );
    }

    var cross_id = req.params[0];
    res.render('x.html', function (tpl) {
      $('#app-main').append(tpl);
      Bus.emit('xapp:cross:main');
      Bus.emit('xapp:cross', cross_id);
    });
  };

  // cross forbidden
  // TODO: 整合 cross 逻辑
  Bus.on('app:cross:forbidden', function (cross_id, data) {
    $('#app-main').load('/static/views/forbidden.html', function () {
      var authorization = Store.get('authorization');
      var settings = {
        options: {
          keyboard: false,
          backdrop: false,

          viewData: {
            // class
            cls: 'modal-id'
          }
        }
      };
      if (data) {
        $('.sign-in').data('source', data.external_username);
      }
      if (!authorization) {
        $('.sign-in').data('dialog-settings', settings);
        $('.sign-in').trigger('click.dialog.data-api');
        $('.sign-in').data('dialog-settings', null);
        $('.popmenu').addClass('hide');
        $('.please-signin').removeClass('hide');
        $('.modal-id').css('top', 260);
      }
      else {
        var user = Store.get('user');
        $('.details').removeClass('hide');
        $('.details .avatar img').attr('src', user.avatar_filename);
        $('.details .identity-name').text(user.name);
        $('.please-access').removeClass('hide');
        $('.modal-id').css({
          top: 380
        });
      }
    });
  });


  // Opening a private invitation X.
  routes.crossInvitation = function (req, res) {
    var session = req.session
      , authorization = session.authorization
      , user = session.user
      , user_id = user && user.id
      , cross_id = req.params[0]
      // invitation token
      , shortToken = req.params[1];

    Bus.emit('app:page:home', false);

    Bus.emit('app:page:usermenu', !!authorization);

    if (authorization) {
      //session.initMenuBar = true;
      Bus.emit('app:usermenu:updatenormal', user);

      Bus.emit('app:usermenu:crosslist'
        , authorization.token
        , authorization.user_id
      );
    }

    Api.request('getInvitationByToken',
      {
        type: 'POST',
        resources: { cross_id: cross_id },
        data: { token: shortToken }
      }
      , function (data) {
        var invitation = data.invitation
          , identity = invitation.identity
          , by_identity = invitation.by_identity
          , _identity;

        if (user_id) {
          _identity = R.find(user.identities, function (v) {
            if (v.connected_user_id === identity.connected_user_id
                && v.id === identity.id) {
              return true;
            }
          });

          if (_identity) {
            res.redirect('/#!' + cross_id);
            return;
          }
        }

        if (identity.provider === 'email') {
          Bus.emit('app:cross:forbidden', cross_id, identity);
          return;
        }

        res.render('invite.html', function (tpl) {
          $('#app-main').append(tpl);

          if (authorization) {
            $('.please-access').removeClass('hide');
            $('.form-horizontal').addClass('fh-left');
            $('.details').removeClass('hide');
            $('.details .avatar img').attr('src', user.avatar_filename);
            $('.details .identity-name').text(user.name);
          }
          else {
            $('.please-signin').removeClass('hide');
          }

          $('.invite-to')
            .find('img')
            .attr('src', identity.avatar_filename)
            .parent()
            .next()
            .text(Util.printExtUserName(identity));

          $('.invite-from')
            .find('img')
            .attr('src', by_identity.avatar_filename)
              .parent()
            .next()
            .text(Util.printExtUserName(by_identity));

          var $redirecting = $('.x-invite').find('.redirecting')
            , $fail = $redirecting.next();

          var clicked = false;
          $('.xbtn-authenticate').on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            if (clicked) {
              return;
            }
            var provider = $(this).data('oauth');
            $.ajax({
              url: '/OAuth/Authenticate?provider=' + provider,
              type: 'POST',
              dataType: 'JSON',
              data: {
                refere: window.location.href
              },
              beforeSend: function () {
                clicked = true;
                $fail.addClass('hide');
                $redirecting.removeClass('hide');
              },
              success: function (data) {
                clicked = false;
                var code = data.meta.code;
                if (code === 200) {
                  window.location.href = data.response.redirect;
                } else {
                  $redirecting.addClass('hide');
                  $fail.removeClass('hide');
                }
              }
            });
          });


          // v2 做
          /*
          if (authorization) {
            $('label[for="follow"]').removeClass('hide');
          }
          */
        });

      },

      function (data) {
        if (data.meta.code === 404) {
          res.location('/404');
        }
      }
    );
  };


  var _crosstoken = function (res, req, next, params, data, cats, cat, ctoken, rsvp) {
    var session = req.session
      , authorization = session.authorization
      , user = session.user
      , user_id = authorization && authorization.user_id || 0;

    Api.request(
        'getCrossByInvitationToken'
      , {
          type: 'POST'
          , params: params
          , data: data
        }
      , function (d) {
          console.dir(d);
          var auth = d.authorization
            , browsing_identity = d.browsing_identity
            , browsing_user_id = browsing_identity && browsing_identity.connected_user_id
            , cross_access_token = d.cross_access_token
            , read_only = d.read_only
            , action = d.action
            , cross = d.cross;

          Bus.emit('app:page:home', false);

          Bus.emit('app:page:usermenu', true);

          if (false === read_only && cross_access_token) {
            cats || (cats = {});
            cat = cats[ctoken] = cross_access_token;
            Store.set('cats', cats);
          }

          //
          var render = function () {
            res.render('x.html', function (tpl) {
              $('#app-main')
                .empty()
                .append(tpl);
              Bus.emit('xapp:cross:main');
              Bus.emit('xapp:cross', null, browsing_identity, cross, read_only, cat || ctoken, rsvp);
              if (rsvp === 'mute') {
                var d = $('<div id="js-dialog-unsubscribe" data-destory="true" data-widget="dialog" data-dialog-type="unsubscribe">');
                d.data('source', cross);
                d.appendTo($('#app-tmp'));
                d.trigger('click.dialog.data-api');
              }
            });
          }

          /**
           * browser-code
           *  0 -- 正常登录
           *  1 -- 只读浏览
           *  2 -- 浏览身份登录
           */

          /** 正常登录
           *  TRUE    (any)   正常登录      M50D3           正常操作
           *  FALSE   TRUE    正常登录      M50D3           正常操作
           */

          if (
            (((authorization && user_id === browsing_user_id)
              || (auth && (authorization = auth)))
            && browsing_user_id > 0
            || !action)) {
            //Store.set('authorization', session.authorization = authorization);
            Bus.once('app:user:signin:after', function () {
              res.redirect('/#!' + cross.id);
            });
            Bus.emit('app:user:signin', authorization.token, authorization.user_id);
            return;
          }

          /** 只读浏览
           *  (any)   FALSE   只读浏览      M50D5(SIGN_IN)  只读，拦截页面操作弹出M75D3 跳转后保持原有登录状态
           */

          else if (!auth && read_only) {
            Bus.emit('app:usermenu:updatebrowsing', {
              browsing: {
                identities: [browsing_identity],
                name: browsing_identity.name
              },
              action: action,
              readOnly: read_only,
              page: 'cross',
              code: 1
            });
          }

          /** 浏览身份登录
           *  (any)   TRUE    浏览身份登录   M50D4 （SET_UP）  跳转时弹出M75D1或D2，若已登录先弹M75D4
           *  TRUE    TRUE    浏览身份登录   M50D5 跳转时弹出M75D4
           */

          else if (!read_only && (cat || auth)) {
            var data = {
              browsing: {
                user_id: browsing_identity.connected_user_id,
                identities: [browsing_identity],
                name: browsing_identity.name
              },
              invitation_token: ctoken,
              action: action,
              readOnly: read_only,
              tokenType: 'invitation',
              setup: action === 'SETUP',
              page: 'cross',
              code: 2
            };
            if (cat) {
              data.tokenType = 'cross';
              data.cross_access_token = cat;
            }
            Bus.emit('app:usermenu:updatebrowsing', data);
          }

          render();
        }

      , function (d) {
          var status = data && data.meta && data.meta.code
            , hasAuth = !!authorization;
          if (403 === status) {
            Bus.emit('app:page:home', false);
            Bus.emit('app:page:usermenu', hasAuth);
            if (hasAuth) {
              Bus.emit('app:usermenu:updatenormal', user);
              Bus.emit('app:usermenu:crosslist'
                , authorization.token
                , authorization.user_id
              );
            }
            Bus.emit('app:cross:forbidden', null, null);
          } else if (404 === status) {
            res.location('/404');
          }
        }
      );
    };

  /*
  var _crosstoken = function (res, req, next, params, data, cats, cat, ctoken, rsvp) {
    var session = req.session,
        authorization = session.authorization,
        user = session.user;
    Api.request('getCrossByInvitationToken',
      {
        type: 'POST',
        params: params,
        data: data
      }
      , function (data) {
        var auth = data.authorization
          , browsing_identity = data.browsing_identity
          , action = data.action
          , cross = data.cross
          , cross_access_token = data.cross_access_token
          , read_only = data.read_only;

        if (false === read_only && cross_access_token) {
          cats || (cats = {});
          cats[ctoken] = cross_access_token;
          Store.set('cats', cats);
        }

        //
        function render() {
          res.render('x.html', function (tpl) {
            $('#app-main')
              .empty()
              .append(tpl);
            Bus.emit('xapp:cross:main');
            Bus.emit('xapp:cross', null, browsing_identity, cross, read_only, cat || ctoken, rsvp);
            if (rsvp === 'mute') {
              var d = $('<div id="js-dialog-unsubscribe" data-destory="true" data-widget="dialog" data-dialog-type="unsubscribe">');
              d.data('source', cross);
              d.appendTo($('#app-tmp'));
              d.trigger('click.dialog.data-api');
            }
          });
        }

        Bus.emit('app:page:home', false);

        Bus.emit('app:page:usermenu', true);

        if (auth || !browsing_identity) {

          if (!session.initMenuBar) {
            //session.initMenuBar = true;
            if (auth) {
              Bus.once('app:user:signin:after', function () {
                res.redirect('/#!' + cross.id);
                //render();
              });
              Bus.emit('app:user:signin', auth.token, auth.user_id);

              return;
            }
            else {
              // 没有 browsing-identity
              res.redirect('/#!' + cross.id);
            }

          }
        }
        else if (browsing_identity) {
          Bus.emit('app:usermenu:updatebrowsing',
            {   normal: user
              , browsing: { identities: [browsing_identity], name: browsing_identity.name }
              , action: action
              , setup: action === 'setup'
              , originToken: ctoken
              , tokenType: 'cross'
              , page: 'cross'
              , readOnly: read_only
            }
            , 'browsing_identity');
        }

        render();
      }
      , function (data) {
        var status = data && data.meta && data.meta.code
          , hasAuth = !!authorization;
        if (403 === status) {
          Bus.emit('app:page:home', false);
          Bus.emit('app:page:usermenu', hasAuth);
          if (hasAuth) {
            Bus.emit('app:usermenu:updatenormal', user);
            Bus.emit('app:usermenu:crosslist'
              , authorization.token
              , authorization.user_id
            );
          }
          Bus.emit('app:cross:forbidden', null, null);
        } else if (404 === status) {
          res.location('/404');
        }
      }
    );
  };
  */

  // cross-token
  routes.crossToken = function (req, res, next) {
    var session = req.session
      , authorization = session.authorization
      , authToken = authorization && authorization.token
      // ctoken = invitation_token
      , ctoken = req.params[0]
      , rsvp = req.params[1]
      , cats = Store.get('cats')
      , params = {}
      , cat, data;

    if (authToken) {
      params.token = authToken;
    }

    if (cats) {
      cat = cats[ctoken];
    }

    data = { invitation_token: ctoken };
    if (cat) {
      data.cross_access_token = cat;
    }

    _crosstoken(res, req, next, params, data, cats, cat, ctoken, rsvp);
  };

  routes.crossPhoneToken = function (req, res, next) {
    var session = req.session
      , authorization = session.authorization
      , authToken = authorization && authorization.token
      , cross_id = req.params[0]
      // ctoken = invitation_token
      , ctoken = req.params[1]
      , rsvp = req.params[2] || ''
      , cats = Store.get('cats')
      , params = {}
      , cat, data;

    if (authToken) {
      params.token = authToken;
    }

    if (cats) {
      cat = cats[ctoken];
    }

    data = {
      invitation_token: ctoken
    , cross_id: cross_id
    };

    if (cat) {
      data.cross_access_token = cat;
    }

    _crosstoken(res, req, next, params, data, cats, cat, ctoken, rsvp);
  };


  // profile
  routes.profile = function (req, res) {
    var session = req.session
      , authorization = session.authorization
      , user = session.user
      , browsing_authorization = session.browsing_authorization
      , browsing_user = session.browsing_user
      , action = session.action
      , oauth = session.oauth;

    Bus.emit('app:page:home', false);

    // 先检查 token
    var param = req.params[2]
      , match = param && param.match(Util.tokenRegExp)
      , token = match && match[1];

    // 跳转倒 `resolveToken`, 解析 `token`，解析成功跳回来
    if (token && !browsing_authorization) {
      res.redirect('/#token=' + token);
      return;
    }

    if (authorization || browsing_authorization) {

      document.title = 'EXFE - Profile';

      Bus.emit('app:page:usermenu', true);

      // 正常登录
      if (authorization && !browsing_authorization) {

        Bus.emit('app:usermenu:updatenormal', user);

        Bus.emit('app:usermenu:crosslist'
          , authorization.token
          , authorization.user_id
        );

        res.render('profile.html', function (tpl) {
          $('#app-main').data('event', session.event);
          delete session.event;

          $('#app-main').append(tpl);
          Bus.emit('app:profile:identities', user);
          var dfd = $.Deferred(),
              e = $.Event('click.dialog.data-api');
          dfd.resolve(authorization);
          Bus.emit('app:profile:show', dfd);

          // 弹出 OAuth Welcome
          // `identity_status`: connected | new | revoked
          if (oauth) {
            if (oauth.identity_status !== 'connected') {
              e.following = oauth.following;
              e.identity = oauth.identity;
              e.token = authorization.token;
              $('<div id="app-oauth-welcome" class="hide" data-widget="dialog" data-dialog-type="welcome" data-destory="true"></div>')
              .appendTo($('#app-tmp'))
                .trigger(e);
            }
            //else if (oauth.identity_status === 'revoked') {}

            Store.remove('oauth');
            delete session.oauth;
          } else if (session.verification_token) {
            $('<div id="app-oauth-resetpassword" class="hide" data-widget="dialog" data-dialog-type="setpassword" data-destory="true"></div>')
            .data('token', session.verification_token)
            .appendTo($('#app-tmp'))
              .trigger(e);
            delete session.verification_token;
          }
        });
      }

      // `browser identity` 浏览身份登录
      else if (browsing_authorization) {

        $(document.body).attr('data-browsing');

        Bus.emit('app:usermenu:updatebrowsing',
          {   normal: user
            , browsing: browsing_user
            , action: action
            , setup: action === 'INPUT_NEW_PASSWORD'
            , originToken: session.originToken
            , tokenType: 'user'
            , page: 'profile'
          }
          , 'browsing_identity');

        delete session.originToken;

        res.render('profile.html', function (tpl) {
          $('#app-main').append(tpl);
          Bus.emit('app:profile:identities', browsing_user);
          var dfd = $.Deferred();
          dfd.resolve(browsing_authorization);
          Bus.emit('app:profile:show', dfd);
        });
      }

      else {
        // 跳回首页
        res.redirect('/');
      }

    } else {
      // 跳回首页
      res.redirect('/');
    }
  };


  // invalid
  routes.invalid = function (req, res) {
    var session = req.session
      , authorization = session.authorization
      , user = session.user;

    document.title = 'EXFE - Invalid Link'

    Bus.emit('app:page:home', false);

    if (authorization) {
      Bus.emit('app:page:usermenu', true);
      Bus.emit('app:usermenu:updatenormal', user);
      Bus.emit('app:usermenu:crosslist'
        , authorization.token
        , authorization.user_id
      );
    }
    else {
      Bus.emit('app:page:usermenu', false);
    }

    res.render('invalid.html', function (tpl) {
      $('#app-main').append(tpl);
    });
  };


  // signout
  routes.signout = function () {
    Store.remove('cats');
    Store.remove('user');
    Store.remove('authorization');
    window.location.href = '/';
  };


  // Get User Data
  routes.refreshAuthUser = function (req, res, next) {
    var session = req.session
      , authorization = session.authorization;

    if (!authorization) {
      next();
      return;
    }

    // Get User
    Bus.emit('app:api:getuser'
      , authorization.token
      , authorization.user_id
      , function (data) {
          var user = data.user;
          Store.set('user', session.user = user);

          // 如果 `user` 没有身份，则登出
          if (0 === user.identities.length) {
            routes.signout();
            return;
          }

          next();
        }
        // 继续使用本地缓存
      , function (data) {
          var code = data && data.meta && data.meta.code;
          if (401 === code) {
            Store.remove('user');
            Store.remove('authorization');
            delete session.user;
            delete session.authorization;
          }
          next();
        }
    );
  };


  // Helpers:
  // ----------------------------
  function redirectToProfile(req, res) {
    var session = req.session;
    var user = Store.get('user');

    function done(user, res) {
      var external_username = Util.printExtUserName(user.identities[0]);
      res.redirect('/#' + external_username.replace(/ /g, ''));
    }

    if (user) {
      done(user, res);
      return;
    }

    var authorization = session.authorization;
    //Bus.once('app:user:signin:after', function (user) {
      //done(user, res);
    //});
    Bus.emit('app:user:signin', authorization.token, authorization.user_id, true);
  }

});
