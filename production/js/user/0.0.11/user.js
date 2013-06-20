/* jshint -W003 */

define('user', function (require) {
  'use strict';

  var $ = require('jquery'),
      R = require('rex'),
      Api = require('api'),
      Bus = require('bus'),
      Util = require('util'),
      Store = require('store'),
      Handlebars = require('handlebars');

  // `status` 可以跳转到 profile
  var signIn = function (token, user_id, redirect, block_redirect) {
    getUser(token, user_id
      , function (data) {
          var last_external_username = Store.get('last_external_username')
            , identity
            , user = data.user;

          if (last_external_username) {
            identity = R.find(user.identities, function (v) {
              var external_username = Util.printExtUserName(v);

              if (last_external_username === external_username) {
                return true;
              }
            });
          }

          if (!identity) {
            identity = user.identities[0];
            Store.set('last_external_username', Util.printExtUserName(identity));
          }

          Store.set('authorization', { token: token, user_id: user_id });
          Store.set('user', user);
          Store.set('lastIdentity', identity);

          // 刷新登录列表
          refreshIdentities(user.identities);

          block_redirect = !$('.modal-su').size();
          if (block_redirect) {
            // fobidden or invite 页面，登录后刷新
            var $fobidden = $('#forbidden')
              , $invite = $('#invite');
            if ($fobidden.size() || $invite.size()) {
              window.location.reload();
              return;
            }

            // cleanup `browsing identity` DOM
            var $browsing = $('#app-browsing-identity');
            if ($browsing.size() && $browsing.attr('data-page') === 'profile') {
              $browsing.remove();
              window.location.href = '/';
              return;
            }

            var hash = decodeURIComponent(window.location.hash);
            if (redirect || (('' === hash
                            || /^#?(invalid)?/.test(hash))
                          && !/^#gather/.test(hash)
                          && !/^#!/.test(hash)
                            )
              ) {
              setTimeout(function () {
                window.location.hash = Util.printExtUserName(user.identities[0]);
              }, 89 / 2);
              return;
            }
          }

          Bus.emit('app:page:usermenu', true);

          Bus.emit('app:usermenu:updatenormal', user);

          Bus.emit('app:usermenu:crosslist'
            , token
            , user_id
          );

          Bus.emit('app:user:signin:after', user);
        }

      , function () {
          Store.remove('cats');
          Store.remove('user');
          Store.remove('authorization');
          window.location.href = '/';
        }
    );
  }

  // --------------------------------------------------------------------------
  // User Sign In
  Bus.on('app:user:signin', signIn);

  var getUser = function (token, user_id, done, fail) {
    // return `Deferred Object`
    Api.request('getUser',
      {
        params: { token: token },
        resources: { user_id: user_id }
      }
      , done || function () {}
      , fail || function () {}
    );
  }

  // --------------------------------------------------------------------------
  // Get User
  Bus.on('app:api:getuser', getUser);

  // --------------------------------------------------------------------------
  // update user menu
  Bus.on('app:usermenu:updatenormal', updateNormalUserMenu);
  Bus.on('app:usermenu:updatebrowsing', updateBrowsingUserMenu);


  // Update User-Menu
  var userMenuTpls = {
      normal: ''
        + '<div class="dropdown-menu user-panel">'
          + '<div class="header">'
            + '<div class="meta">'
              + '<a class="pull-right avatar" href="{{profileLink}}" data-link>'
                + '<img width="40" height="40" alt="" src="{{avatar_filename}}" />'
              + '</a>'
              + '<a class="attended" href="{{profileLink}}" data-link>'
                + '<span class="attended-nums">{{cross_quantity}}</span>'
                + '<span class="attended-x"><em class="x">·X·</em> attended</span>'
              + '</a>'
            + '</div>'
          + '</div>'
          + '<div class="body">'
            + '{{#unless password}}'
            + '<div class="merge setup" data-widget="dialog" data-dialog-type="setpassword">'
              + 'Set <span class="x-sign">EXFE</span> password'
            + '</div>'
            + '{{/unless}}'
            + '{{#if verifying}}'
            + '<div class="merge verify" data-dialog-type="verification_{{identities.[0].provider}}" data-widget="dialog" data-identity-id="{{identities.[0].id}}">'
              + '<strong>Verify</strong> identity'
            + '</div>'
            + '{{/if}}'
            + '<div class="list"></div>'
          + '</div>'
          + '<div class="footer">'
            + '<a href="/#gather" class="xbtn xbtn-gather" id="js-gatherax" data-link>Gather a <span class="x">·X·</span></a>'
            + '<div class="spliterline"></div>'
            + '<div class="actions">'
              + '<a href="#" class="pull-right" id="app-signout">Sign out</a>'
              //+ '<a href="#">Settings</a>'
            + '</div>'
          + '</div>'
        + '</div>'

    , browsing_identity: ''
        + '<div class="dropdown-menu user-panel">'
          + '<div class="header">'
            + '<h2>Browsing Identity</h2>'
          + '</div>'
          + '<div class="body">'
            + '{{#with browsing}}'
            + '<div>You are browsing this page as {{capitalize identities.[0].provider}} identity:</div>'
            + '<div class="identity">'
              + '<span class="pull-right avatar alt40">'
                + '<img src="{{identities.[0].avatar_filename}}" width="20" height="20" alt="" />'
              + '</span>'
              + '<i class="icon16-identity-{{identities.[0].provider}}"></i>'
              + '<span class="oblique">{{identities.[0].external_username}}</span>'
            + '</div>'
            + '{{#if ../setup}}'
            //+ '<div class="merge setup" data-source="{{identities.[0].external_username}}" data-widget="dialog" data-dialog-type="identification" data-dialog-tab="d02">'
            + '<div class="merge setup" data-user-action="SETUP" data-widget="dialog">'
              + '<h5>Start</h5>'
              + 'new account with this identity'
            + '</div>'
            + '{{/if}}'
            + '{{/with}}'
            //+ '{{#if normal}}'
            //+ '<div class="spliterline"></div>'
            //+ '<div class="merge">'
              //+ '<a href="#">Merge</a> with existing identities in your current account:'
            //+ '</div>'
              //+ '{{#each normal.identities}}'
              //+ '{{#ifConnected status}}'
              //+ '<div class="identity">'
                //+ '<span class="pull-right avatar alt40">'
                  //+ '<img src="{{avatar_filename}}" width="20" height="20" alt="" />'
                //+ '</span>'
                //+ '<i class="icon16-identity-{{provider}}"></i>'
                //+ '<span>{{external_username}}</span>'
              //+ '</div>'
              //+ '{{/ifConnected}}'
              //+ '{{/each}}'
            //+ '{{/if}}'
            + '{{#unless setup}}'
            + '<div class="orspliter hide">or</div>'
            + '<div class="merge signin" data-user-action="SIGNIN" data-source="{{browsing.identities.[0].external_username}}" data-widget="dialog" data-dialog-type="identification" data-dialog-tab="d00">'
              + '<h5>Authenticate</h5>'
              + 'to continue with this identity'
            + '</div>'
            + '{{/unless}}'
          + '</div>'
          + '<div class="footer">'
          + '</div>'
        + '</div>'
    };

  /**
   *
   * @param: type 'normal' / 'browsing_identity'
   */

  // 添加 `ifVerifying` 判断
  Handlebars.registerHelper('ifConnected', function (status, options) {
    return Handlebars.helpers['if'].call(this, 'CONNECTED' === status, options);
  });

  function updateNormalUserMenu(user) {
    var $appUserMenu = $('#app-user-menu')
      , $appUserName = $('#app-user-name')
      , $nameSpan = $appUserName.find('span')
      , $dropdownWrapper = $appUserMenu.find('.dropdown-wrapper')
      , $userPanel = $dropdownWrapper.find('.user-panel')
      , identity = user.identities[0]
      , profileLink = '/#' + Util.printExtUserName(identity)
      , tplFun;

    $('#app-browsing-identity').remove();

    $appUserName.attr('href', profileLink);

    $nameSpan
      .text(user.name || user.nickname)
      .removeClass('browsing-identity');

    tplFun = Handlebars.compile(userMenuTpls.normal);

    if ($userPanel.length) { $userPanel.remove(); }

    user.profileLink = profileLink;

    // 新身份未验证时，显示提示信息
    user.verifying = 1 === user.identities.length && 'VERIFYING' === identity.status;

    $dropdownWrapper.append(tplFun(user));

    delete user.profileLink;
    delete user.verifying;
  }

  // `sign in` or `set up` 只显示其一
  function updateBrowsingUserMenu(data) {
    var $appUserMenu = $('#app-user-menu')
      , $appUserName = $('#app-user-name')
      , $nameSpan = $appUserName.find('span')
      , $dropdownWrapper = $appUserMenu.find('.dropdown-wrapper')
      , $userPanel = $dropdownWrapper.find('.user-panel')
      , browsing = data.browsing
      , identity = browsing.identities[0]
      , tplFun;

    browsing.isBrowsing = true;

    $('#app-browsing-identity').remove();
    $('#app-tmp').append(
      $('<div id="app-browsing-identity">')
        .data('settings', data)
        .attr('data-widget', 'dialog')
        .attr('data-dialog-type', 'browsing_identity')
    );

    var setupType = 'setup_authenticate';

    if (identity.provider === 'email' || identity.provider === 'phone') {
      setupType = 'setup_verification';
    }

    $appUserName.attr('href', location.href);

    $nameSpan
      .html('Browsing as: <span>' + (browsing.name || browsing.nickname) + '</span>')
      .addClass('browsing-identity');

    tplFun = Handlebars.compile(userMenuTpls.browsing_identity);

    if ($userPanel.length) {
      $userPanel.remove();
    }

    $dropdownWrapper.append(tplFun(data));

    $('#app-user-menu')
      .find('.setup')
      .attr('data-dialog-type', setupType)
      .data('source', {
        browsing: browsing,
        originToken: data.originToken,
        tokenType: data.tokenType,
        forward: data.forward,
        page: data.page
      }
    );
  }

  Bus.on('app:page:home', switchPage);
  function switchPage(isHome, nocleanup) {
    isHome = !!isHome;
    var $BODY = $(document.body)
      , $appMenubar = $('#app-menubar')
      , $appMain = $('#app-main');

    // nocleanup === false, no clean up
    if (!nocleanup) {
      $appMain.empty();
    }

    $BODY.toggleClass('hbg', isHome);
    $appMenubar.toggleClass('hide', isHome);
  }

  Bus.on('app:page:usermenu', switchUserMenu);
  function switchUserMenu(signed) {
    signed = !!signed;

    var $appUserMenu = $('#app-user-menu')
      , $appSignin = $('#app-signin');

    $appUserMenu.toggleClass('hide', !signed);
    $appSignin.toggleClass('hide', signed);
  }

  // update `usermenu` user-anme
  Bus.on('app:page:changeusername', function (value) {
    $('#app-user-name').find('span').text(value);
  });

  function refreshIdentities(identities) {
    var ids = Store.get('identities') || []
      , cis = identities.slice(0)
      , status, i, sid, id;

    while ((id = ids.shift())) {
      status = false;
      for (i = 0; sid = identities[i++];) {
        status = (id.external_username === sid.external_username);
        if (status) { break; }
      }
      if (!status) {
        cis.push(id);
      }
    }

    // 身份搜索
    Store.set('identities', cis);
  }

});
