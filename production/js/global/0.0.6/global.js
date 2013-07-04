/*jshint -W116*/

define(function (require) {
  'use strict';
  var $ = require('jquery')
    , Bus = require('bus')
    , Api = require('api')
    , Store = require('store')
    , Dialog = require('dialog')
    , dialogs = require('xdialog').dialogs
    , Identification = require('xdialog').Identification
    , IdentityPop = require('xidentity')
    , $BODY = $(document.body);

  //$(function () {
  function _docddEventhandler(e) {
    e.stopPropagation();
    e.preventDefault();
    return false;
  }

  $BODY
    .on('drop', _docddEventhandler)
    //.on('dragenter', _docddEventhandler)
    //.on('dragleave', _docddEventhandler)
    .on('dragover', _docddEventhandler);

  var toggle = '[data-toggle="dropdown"]';
  function clearMenus() {
    $(toggle).removeClass('open');
  }
  $BODY
    .on('click.dropdown.data-api', clearMenus);


  /*
    * User-Panel 下拉菜单动画效果
    */
  // 初始化高度
  var _i_ = false;
  function hover(e) {
    var self = $(this)
      , timer = self.data('timer')
      , clicked = self.data('clicked')
      , $userPanel = self.find('div.user-panel').addClass('show')
      , h = -$userPanel.outerHeight();

    e.preventDefault();

    if (e.type === 'mouseleave' && !clicked) {
      timer = setTimeout(function () {
        _i_ = false;
        $userPanel
          .stop()
          .animate({top: h}, 200, function () {
            self.prev().addClass('hide');
            self.parent().removeClass('user');
          });
        clearTimeout(timer);
        self.data('timer', timer = null);
      }, 500);

      self.data('timer', timer);
      return false;
    }

    if (clicked) {
      self.data('clicked', false);
      return;
    }

    if (timer) {
      clearTimeout(timer);
      self.data('timer', timer = null);
      return false;
    }

    if (!_i_) {
      $userPanel.css('top', h);
      self.find('.user-panel').addClass('show');
      _i_ = true;
    }

    self.prev().removeClass('hide');
    self.parent().addClass('user');
    $userPanel
      .stop()
      .animate({top: 56}, 100);
  }

  $BODY.on('mouseenter.dropdown mouseleave.dropdown', '#app-user-menu .dropdown-wrapper', hover);

  $BODY.on('click.usermenu', '#app-user-menu .dropdown-wrapper a[href^="/#"]', function () {
    var self = $('#app-user-menu .dropdown-wrapper')
      , $userPanel = self.find('div.user-panel').addClass('show')
      , h = -$userPanel.outerHeight();

    $userPanel.css('top', h);

    self
      .prev()
      .addClass('hide')
      .end()
      .parent()
      .removeClass('user');

    self.data('clicked', true);
  });

  $BODY.on('click.usermenu', '#app-signout', function () {
    Bus.emit('xapp:cross:end');
    $('.navbar .dropdown-wrapper').find('.user-panel').remove();
    $('#app-signin')
      .show()
      .next().hide()
      .removeClass('user')
      .find('.fill-left').addClass('hide')
      .end()
      .find('#user-name span').text('');
    Store.remove('cats');
    Store.remove('user');
    Store.remove('authorization');
    window.location.href = '/';
  });

  var checkInvitationToken = function (token, invitation_token, cb) {
    Api.request('checkinvitationtoken'
      , {
          type: 'POST',
          params: { token: token },
          data: { invitation_token: invitation_token }
        }
      , function (data) {
          if (data.valid) {
            cb();
          }
        }
      );
  };

  var __globlEvent = function (e) {
    var $t = $(this)
      // 已登录 user 信息
      , auth = Store.get('authorization')
      , auth_user_id = auth && auth.user_id
      , auth_token = auth && auth.token
      , auth_user = Store.get('user')

      , actionType = $t.data('link')
      , eventIgnore = $t.data('event-ignore')
      , $db = $('#app-browsing-identity')
      , status = $db.length;

    if (status) {
      var data = $db.data()
        , settings = data.settings
        , action = settings.action
        , code = settings.code
        , invitation_token = settings.originToken
        , tokenType = settings.tokenType
        , readOnly = settings.readOnly
        , browsing = settings.browsing;

      if (code === 1) {
        if (actionType) {
          e.stopImmediatePropagation();
          e.stopPropagation();
          e.preventDefault();

          var $d = $('<div id="read-only-browsing" data-destory="true" data-widget="dialog" data-dialog-type="read_only"></div>');
          $d.data('settings', browsing);
          $('#app-tmp').append($d);
          $d.trigger('click');

          return false;
        }
      } else if (code === 2) {
        var buser_id = browsing.user_id;

        if ((action === 'SIGNIN')
            && auth_user_id
            && (auth_user_id !== buser_id)) {

          if (!actionType) {

            // 非 x-token 需 check invitation_token 状态，弹窗
            //if (tokenType !== 'cross') {
              e.stopImmediatePropagation();
              e.stopPropagation();
              e.preventDefault();

              checkInvitationToken(auth_token, invitation_token, function () {
                var $d = $('<div id="merge-identity" data-destory="true" data-widget="dialog" data-dialog-type="browsing_identity"></div>');
                $d.data('settings', {
                  browsing: browsing,
                  user: auth_user,
                  token: auth_token,
                  action: action,
                  invitation_token: invitation_token
                });
                $('#app-tmp').append($d);
                $d.trigger('click');
              });

              return false;
            //}

          }
        } else if (action === 'SETUP' && !readOnly) {

            if (!actionType) {
              e.stopImmediatePropagation();
              e.stopPropagation();
              e.preventDefault();
              if (auth_user_id && auth_user_id !== buser_id) {
                checkInvitationToken(auth_token, invitation_token, function () {
                  var $d = $('<div id="merge-identity" data-destory="true" data-widget="dialog" data-dialog-type="browsing_identity"></div>');
                  $d.data('settings', {
                    browsing: browsing,
                    user: auth_user,
                    token: auth_token,
                    action: action,
                    invitation_token: invitation_token
                  });
                  $('#app-tmp').append($d);
                  $d.trigger('click');
                });
              } else {
                $('[data-user-action="SETUP"]').trigger('click');
              }

            return false;
          }

        }

      }

    }
  };

  $BODY.on('click.data-link', 'a[data-link], div[data-link], span[data-link]', __globlEvent);
  $BODY.on('mousedown.data-link', 'button[data-link], input[data-link], textarea[data-link]', __globlEvent);

  // TODO:后面再优化
  // $BODY.on('click.data-link dblclick.data-link', '[data-link]', function (e) {
  //   var actionType = $(this).data('link');
  //   var event_ignore = $(this).data('event-ignore');

  //   if (e.type !== event_ignore) {

  //     // 判断权限
  //     //var authorization = Store.get('authorization');
  //         //token = authorization && authorization.token;


  //     var $db = $('#app-browsing-identity')
  //       , readOnly = $db.data('readOnly')
  //       , settings = $db.data('settings')
  //       , $readOnly = $('#app-read-only')
  //       , tokenType = $db.data('token-type');
  //       //, btoken = $db.data('token')
  //       //, action = $db.data('action');

  //     // read only
  //     if ($db.size() && readOnly && actionType === 'nota') {
  //       e.stopImmediatePropagation();
  //       e.stopPropagation();
  //       e.preventDefault();

  //       if (!$readOnly.size()) {
  //         $('#app-main').append(
  //           $readOnly = $('<div id="app-read-only" data-widget="dialog" data-dialog-type="read_only"></div>')
  //             .data('settings', settings.browsing)
  //         );
  //       }

  //       $readOnly.trigger('click');
  //       return false;
  //     }

  //     if ($db.size()) {
  //       // profile 操作, 后端暂不支持browsing-identity 修改身份内容,弹 D4 窗口
  //       //if (actionType === 'nota' && tokenType === 'user') {
  //         //e.stopImmediatePropagation();
  //         //e.stopPropagation();
  //         //e.preventDefault();
  //         //$('[data-user-action="' + action + '"]').trigger('click');
  //         //return false;
  //       //}
  //       //else if (actionType === '') {
  //       if (actionType === '' || (actionType === 'nota' && tokenType === 'user')) {
  //         e.stopImmediatePropagation();
  //         e.stopPropagation();
  //         e.preventDefault();
  //         $db.trigger('click');
  //         return false;
  //       }
  //     /*
  //     } else if (!token) {
  //       e.stopImmediatePropagation();
  //       e.stopPropagation();
  //       e.preventDefault();
  //       if (!$readOnly.size()) {
  //         $('#app-main').append(
  //           $readOnly = $('<div id="app-read-only" data-widget="dialog" data-dialog-type="read_only"></div>')
  //             .data('settings', Store.get('user'))
  //         );
  //       }
  //       $readOnly.trigger('click');
  //       return false;
  //     */
  //     }

  //   }
  // });

  Bus.on('app:cross:edited', function (data) {
    var $db = $('#app-browsing-identity')
      , settings = $db.data('settings')
      , $readOnly = $('#app-read-only');

    // read-only
    // data = {error : 'no_permission'}
    if (data && data.error === 'no_permission') {
      if (!$readOnly.size()) {
        $('#app-main').append(
          $readOnly = $('<div id="app-read-only" data-widget="dialog" data-dialog-type="read_only"></div>')
            .data('settings', (settings && settings.browsing) || Store.get('user'))
        );
      }
      $readOnly.trigger('click');
    }
  });

  $BODY.on('click.dialog.data-api', '[data-widget="dialog"]', function (e) {
    var $this = $(this)
      , data = $this.data('dialog')
      , settings
      , dialogType = $this.data('dialog-type')
      , dialogTab = $this.data('dialog-tab')
      , dialogFrom = $this.data('dialog-from')
      , dialogSettings = $this.data('dialog-settings');

    e.preventDefault();

    if (!data)  {

      if (dialogType) {
        settings = dialogs[dialogType];
        if (dialogSettings) {
          settings = $.extend(true, {}, settings, dialogSettings);
        }
        /*jshint -W056*/
        data = new (dialogType === 'identification' ? Identification : Dialog)(settings);
        data.options.srcNode = $this;
        if (dialogFrom) data.dialog_from = dialogFrom;
        data.render();
        $this.data('dialog', data);
        // 检索页面包含此 `dialog` 类型的元素，并设置引用
        $BODY
          .find('[data-dialog-type="' + dialogType + '"]')
          .not($this)
          .data('dialog', data);
      }

    }

    if (dialogTab) data.switchTab(dialogTab);
    data.show(e);

  });

  var identities = Store.get('identities');
  if (!identities) { identities = []; }

  $BODY.on('focus.typeahead.data-api', '[data-typeahead-type="identity"]', function (e) {
    var $this = $(this);

    if ($this.data('typeahead')) return;
    e.preventDefault();
    $this.data('typeahead', new IdentityPop({

      options: {
        source: identities,
        useCache: true,
        target: $this,
        // 当输入框没有值时，触发
        onNothing: function () {
          this.target.parent().removeClass('identity-avatar');
          Bus.emit('widget-dialog-identification-nothing');
        },

        //'onAutocomplete:beforesend': function (identity) {},
        'onAutocomplete:finish': function (data) {
          var identity;
          if (data && (identity = data.identity)) {
            this.target
              .prev()
              .attr('src', identity.avatar_filename)
              .parent()
              .addClass('identity-avatar');
          } else {
            this.target.parent().removeClass('identity-avatar');
          }
          Bus.emit('widget-dialog-identification-auto', data);
        }
      }
    }));

  });
});
