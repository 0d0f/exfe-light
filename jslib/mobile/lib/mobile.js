define(function (require) {
  'use strict';

  var Base = require('base'),
      //Bus = require('bus'),
      Store = require('store'),
      Handlebars = require('handlebars'),
      humantime = require('humantime'),
      util   = require('util'),
      trim = util.trim,
      parseId = util.parseId,

      // animation {{{
      AF = require('af'),
      requestAnimationFrame = AF.request,
      cancelAnimationFrame = AF.cancel,
      TWEEN = require('tween'),
      // animation }}}

      config = require('config');

  /**----*/
  var log = function () {
    console.log.apply(console, arguments);
  };
  var dir = function (o) {
    console.dir(o);
  };
  /**----*/

  /**- Helpers -**/
  var now = Date.now || function () { return new Date().getTime(); };
  var hasWebkitTransform = 'webkitTransform' in document.body.style,
      setCSSMatrix;
  if (hasWebkitTransform) {
    setCSSMatrix = function (e, m) {
      var d = m.length === 6 ? '' : '3d';
      e.style.webkitTransform = 'matrix' + d + '(' + m.join(',') + ')';
    };
  } else {
    setCSSMatrix = function (e, m) {
      var d = m.length === 6 ? '' : '3d';
      e.style.transform = 'matrix' + d + '(' + m.join(',') + ')';
    };
  }
  var escape = function (html, encode) {
    return html
      .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };
  var renderCrossTime = function(crossTime) {
    var dspTime   = humantime.printEFTime(crossTime, 'X');
    return dspTime;
  };

  var tryRedirectAt = 0;
  var lastBreathe = now();

  var showAppInStore = function() {
    window.location = 'itms://itunes.apple.com/us/app/exfe/id514026604';
  };

  var launchApp = function (args) {
    tryRedirectAt = now();
    window.location = 'exfe://crosses/' + (args || '');
  };

  /**- _ -**/
  var MCP0 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 128, 28, 0, 1 ]; // `live-edit` my-card position
  var MCP1 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 128,  0, 0, 1 ]; // `home` home-card position
  /**- _ -**/

  var getSMSTokenFromHead = function () {
    var header = document.getElementsByTagName('head')[0]
      , meta = document.getElementsByName('sms-token')[0]
      , smsToken = null;

    if (meta) {
      smsToken = JSON.parse(meta.content);
      header.removeChild(meta);
    }

    return smsToken;
  };

  var middleware = {

    // hacked hide safari-nav-bar
    setHtmlHeight: function (req, res, next) {

      setTimeout(function() {
        window.scrollTo(0, 0);
      }, 0);

      // Status-bar: 20px
      // Nav-bar: 60px
      // Button-bar: 44px
      var html = document.documentElement,
          htmlStyle = html.style,
          height = window.innerHeight;
      // 1136 / 2 - (20 + 60 + 44)
      if (height >= 444) {
        height = 508;
      // 960 / 2 - (20 + 60 + 44)
      } else if (height <= 356) {
        height = 420;
      }

      req.app.screen = {
        width: 320,
        height: height
      };

      htmlStyle.minHeight = height + 'px';

      next();
    },

    checkStorageSupported: function () {
      try {
        var localStorage = window.localStorage;
        if (localStorage) {
          localStorage.setItem('storage', 0);
          localStorage.removeItem('storage');
        }
      } catch(err) {
        alert('EXFE cannot be used in private browsing mode.');
      }

      next();
    },

    // check `sms-token`
    checkSMSToken: function (req, res, next) {
      var smsToken = getSMSTokenFromHead();

      if (smsToken) {
        var action = smsToken.action;
        req.smsToken = smsToken;
        if ('VERIFIED' === action) {

          res.redirect('/#verify');

        } else if ('INPUT_NEW_PASSWORD' === action) {

          res.redirect('/#set_password');

        }
        return;
      }

      next();
    },

    // cleanup `Pages`
    cleanup: function (req, res, next) {
      delete req.smsToken;
      $('#app-header').addClass('hide');
      $('#app-footer').removeClass('ft-bg');

      // Todo: 切换页面, before -> done -> after
      var switchPageCallback = req.switchPageCallback;
      if (switchPageCallback) {
        switchPageCallback();
      } else {
        $('#app-body .page').addClass('hide');
        //.remove();
      }
      delete req.switchPageCallback;

      next();
    }

  };



  var routes = {

    // `index`
    index: function (req, res) {
      log('index `Home`');
      var error = req.error;
      var app = req.app, controllers = app.controllers,
          homeCont = controllers.home,
          footerCont = controllers.footer,
          screen = app.screen;
      if (!homeCont) {
        homeCont = app.controllers.home = new HomeController({
          options: {
            template: $('#home-tmpl').html()
          }
        });
      }
      homeCont.emit('show', screen);
      footerCont.emit('show', screen, false, false, error);
      delete req.error;
    },

    verify: function (req, res) {
      log('verify');
      var smsToken = req.smsToken;
      if (smsToken) {
        $('#app-header').removeClass('hide');
        var verifyCont = new VerifyController({
          options: {
            template: $('#verify-tmpl').html()
          },
          smsToken: smsToken
        });
        verifyCont.emit('show', req, res);
      } else {
        req.error = true;
        res.redirect('/');
      }
    },

    setPassword: function (req, res) {
      log('set-password');
      var smsToken = req.smsToken;
      if (smsToken) {
        $('#app-header').removeClass('hide');
        var setPasswordCont = new SetPasswordController({
          options: {
            template: $('#setpassword-tmpl').html()
          },
          smsToken: smsToken,
          token: smsToken.origin_token
        });
        setPasswordCont.emit('show', req, res);
      } else {
        req.error = true;
        res.redirect('/');
      }
    },

    // `resolve-token`
    resolveToken: function (req, res) {
      log('`resolve token`');
      var originToken = req.params[0];

      if (originToken) {

        $.ajax({
          type: 'POST',
          url: config.api_url + '/Users/ResolveToken',
          data: { token : originToken },
          success: function (data) {
            if (data && data.meta && data.meta.code === 200) {
              // todo: rename
              req.smsToken = response;
              var action = req.smsToken.action;
              if (action === 'VERIFIED') {
                res.redirect('/#verify');
              } else if (action === 'INPUT_NEW_PASSWORD') {
                re.smsToken.origin_token = originToken;
                res.redirect('/#set_password');
              }
            }
          },
          error: function () {
            req.error = true;
            res.redirect('/');
          }
        });

      } else {
        req.error = true;
        res.redirect('/');
      }
    },

    // `cross`

    // `phone-cross-token`
    crossPhoneToken: function (req, res) {
      log('cross `phone token`');
      var _params = req.params,
          cross_id = _params[0],
          ctoken = _params[1];
      log('cross', cross_id, ctoken);

      var cats = Store.get('cats'),
          params, data, token;

      data = {
        invitation_token: ctoken,
        cross_id: cross_id
      };

      if (cats && (token = cats[ctoken])) {
        data.cross_access_token = token;
      }

      showCross(req, res, data);
    },

    // `cross-token`
    crossToken: function (req, res) {
      log('cross `normal token`');
      var ctoken = req.params[0],
          cats = Store.get('cats'),
          data = { invitation_token: ctoken },
          token;

      if (cats && (token = cats[ctoken])) {
        data.cross_access_token = token;
      }

      showCross(req, res, data);
    },

    showCross: function showCross(req, res, data) {

      $.ajax({
        type: 'POST',
        url: config.api_url + '/Crosses/GetCrossByInvitationToken',
        data: data,
        success: function (data) {
          var meta = data.meta,
              code = meta && meta.code;

          if (code && code === 200) {
            var response = data.response;
            var originCross = response.cross;
            var cross = {
              id: originCross.id,
              title: escape(originCross.title),
              description: escape(originCross.description.replace(/\r\n|\r|\n/g, '<br />')),
              time: {
                title: 'Sometime',
                content: 'To be decided'
              },
              place: {
                title: 'Somewhere',
                description: 'To be decided'
              },
              background: 'default.jpg',
              read_only: !!response.read_only
            };

            // time
            var time = originCross.time;
            if (time
              && time.begin_at
              && time.begin_at.origin
              && time.begin_at.timezone) {
              cross.time = renderCrossTime(time);
            } else {
              cross.time.tobe = true;
            }

            // place
            var place = originCross.place;
            if (place && place.title) {
              cross.place = {
                title: place.title,
                description: place.description.replace(/\r\n|\r|\n/g, '<br />')
              };
            }
            var lat = place.lat, lng = place.lng;
            if (lat && lng) {
              var scale = window.devicePixelRatio >= 2 ? 2 : 1;
              cross.place.map = 'https://maps.googleapis.com/maps/api/staticmap?center='
                + lat + ',' + lng + '&markers=icon%3a'
                + encodeURIComponent('http://img.exfe.com/web/map_pin_blue.png')
                + '%7C'
                + lat + ',' + lng
                + '&zoom=13&size=290x100&maptype=road&sensor=false&scale='
                + scale;
              cross.place.href = 'http://maps.google.com/maps?daddr='
                + encodeURIComponent(cross.place.title) + '@'
                + lat  + ',' + lng;
            }

            // title background
            var widget = originCross.widget, wl;
            if (widget && (wl = widget.length)) {
              for (var wi = 0; wi < wl; ++wi) {
                if (widget[wi].type === 'Background') {
                  cross.background = widget[wi].image;
                  break;
                }
              }
            }

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

            if (response.cross_access_token) {
              token = cats[ctoken] = response.cross_access_token;
              Store.set('cats', cats);
            }

            var originInvitations = originCross.exfee.invitations;
            var invitations = [];
            //'ACCEPTED', 'INTERESTED', 'NORESPONSE', 'IGNORED', 'DECLINED'
            var orderRSVP = {
              ACCEPTED: [],
              INTERESTED: [],
              NORESPONSE: [],
              IGNORED: [],
              DECLINED: []
            };
            // current identity rsvp
            for (var i = 0, len = originInvitations.length; i < len; ++i) {
              var invitation = originInvitations[i];
              console.log(invitation)
              var style = 'pending', rsvp_status = invitation.rsvp_status;
              if (rsvp_status === 'ACCEPTED') {
                style = 'accepted';
              } else if (rsvp_status === 'DECLINED') {
                style = 'declined';
              }
              invitation.rsvp_style = style;
              if ((user_id && user_id === invitation.identity.connected_user_id)
                    || myIdId === invitation.identity.id) {
                invitation.is_me = true;
                myIdId = invitation.identity.id;
                if (myIdId !== invitation.invited_by.id) {
                  cross.inviter = invitation.invited_by;
                }
                //invitations.unshift(invitation);
                invitation.isphone = invitation.provider === 'phone';
                cross.identity = invitation;
                orderRSVP.ACCEPTED.unshift(invitation);
              } else {
                //invitations.push(invitation);
                orderRSVP[invitation.rsvp_status].push(invitation);
              }
            }

            invitations = [].concat(
              orderRSVP.ACCEPTED,
              orderRSVP.INTERESTED,
              orderRSVP.NORESPONSE,
              orderRSVP.IGNORED,
              orderRSVP.DECLINED
            );

            cross.invitations = [];
            var j = 0, len = invitations.length;
            while (j < len) {
              cross.invitations.push(invitations.splice(0, 5));
              j += 5;
            }
            var len = cross.invitations.length, invs = cross.invitations[len - 1], k = invs.length;
            if (k && k < 5) {
              while (5 - k++) {
                invs.push(void 0);
              }
            }

            var args = '';
            if (user_id) {
              if (authorization) {
                args = cross.id
                     + '?user_id='     + user_id
                     + '&token='       + authorization.token
                     + '&identity_id=' + myIdId;
                token = authorization.token;
                Store.set('authorization', authorization);
              } else {
                authorization = Store.get('authorization');
                if (authorization && authorization.user_id === user_id) {
                  args = cross.id
                       + '?user_id='     + user_id
                       + '&token='       + authorization.token
                       + '&identity_id=' + myIdId;
                  token = authorization.token;
                }
              }
            }

            dir(cross)

            // cross
            var app = req.app, controllers = app.controllers,
                crossCont = controllers.cross;

            if (crossCont) {
              crossCont.destory();
            }

            var tmpl = Handlebars.compile($('#cross-tmpl').html());
            crossCont = app.controllers.cross = new CrossController({
              options: {
                template: tmpl(cross)
              },
              cross: cross,
              exfee_id: originCross.exfee.id,
              token: token
            });

            crossCont.emit('show');

            app.controllers.footer.emit('show-from-cross', originCross.exfee.id, token, args);
          } else {
            req.error = true;
            res.redirect('/');
          }
        },
        error: function (data) {
          req.error = true;
          res.redirect('/');
        }
      });

    },

    // `live`
    live: function (req, res) {
      log('`live`');
      var app = req.app, controllers = app.controllers,
          liveCont = controllers.live;

      if (liveCont) {
        liveCont.destory();
      }

      liveCont = app.controllers.live = new LiveController({
        options: {
          template: $('#live-tmpl').html()
        }
      });

      liveCont.emit('show', app.screen);
    }

  };


  /***************************************************************************/
  var uuid = 0;
  function guid() {
    return 'Controller-' + uuid++;
  }

  // `Controllers`
  var Controller = Base.extend({

    initialize: function (options) {
      this.cid = guid();
      this.initOptions(options);
      this.parseElement();
      this.init();
      Controller.caches[this.cid] = this;
    },

    parseElement: function () {
      var element = this.element,
          template = this.options.template;

      if (element) {
        this.element = element instanceof $ ? element : $(element);
      } else if (template) {
        this.element = $(template);
      }

      if (!this.element) {
        throw 'element is invalid';
      }

      this.element.attr('data-page-id', this.cid);
    },

    initOptions: function (params) {
      this.setOptions(params);

      //delete params.options;

      for (var k in params) {
        if (k !== 'options') { this[k] = params[k]; }
      }
    },

    init: function () {},

    _destory: function () {
      delete Controller.caches[this.cid];
      Controller.superclass.destory.call(this);
    },

    $: function (selector) {
      return this.element.find(selector);
    }

  });

  Controller.caches = [];


  // `app-footer` controller
  var FooterController = Controller.extend();


  // `verify` controller
  var VerifyController = Controller.extend({

    init: function () {
      this.render();
      this.listen();
    },

    render: function () {
      if (!$('#app-verify').length) {
        this.element.appendTo($('#app-body'));
      }
    },

    listen: function () {
      var self = this,
          smsToken = this.smsToken;
      this.on('show', function (req, res) {
        var cb = function () {
          // error getting identity informations
          req.error = true;
          res.redirect('/');
        };
        this.element.removeClass('hide');
        $.ajax({
          type: 'POST',
          url: config.api_url + '/Users/' + smsToken.user_id + '?token=' + smsToken.token,
          data: { token : smsToken.token },
          success: function (data) {
            if (data && data.meta && data.meta.code === 200) {
              var user = data.response.user,
                  identities = user.identities;
              for (var i = 0, len = identities.length; i < len; ++i) {
                var identity = identities[i];
                if (identity.id === smsToken.identity_id) {
                  self.showIdentity(identity);
                  redirecting('?user_id=' + user.user_id + '&token=' + result.token);
                  return;
                }
              }
            }
            // error getting identity informations
            cb();
          },
          error: function () { cb(); }
        });
      });
    },

    showIdentity: function (identity) {
      var $identity = this.$('.identity');
      $identity.find('.name').text(identity.name);
      $identity.find('.avatar').attr('src', identity.avatar_filename);
      $identity.find('.provider').attr('src', '/static/img/identity_' + identity.provider + '_18_grey@2x.png');
      $identity.next().removClass('hide');
    }

  });


  // `set-password` controller
  var SetPasswordController = Controller.extend({
    init: function () {
      this.render();
      this.listen();
    },

    render: function () {
      if (!$('#app-setpassword').length) {
        this.element.appendTo($('#app-body'));
      }
    },

    submitPassword: function () {
      var self = this,
          token = this.token,
          $eye = this.$('.eye').addClass('hide'),
          $loading = this.$('.loading').removeClass('hide'),
          $button = this.$('.set-button button'),
          $error = this.$('.error-info'),
          name = trim(this.$('#name').val()),
          password = this.$('#password').val();
      if (password.length >= 4) {
        $button
          .addClass('disabled')
          .prop('disabled', true);

        $.ajax({
          type: 'POST',
          url: config.api_url + '/Users/ResetPassword',
          data: {
            token: token,
            name: name,
            password: password
          },
          success: function (data) {
            $loading.addClass('hide');
            $eye.removeClass('hide');
            $error.html('Failed to set password. Please try later.').removeClass('hide');
            // $('#password').prop('disabled', false);
            $button.removeClass('disabled').prop('disabled', false);
          },
          error: function (data) {
            $loading.addClass('hide');
            $eye.removeClass('hide');
            $error-info.html('Failed to set password. Please try later.').removeClass('hide');
            // $('#password').prop('disabled', false);
            $button.removeClass('disabled').prop('disabled', false);
          }
        });
      } else {
        $error.html('Password must be longer than four!').removeClass('hide');
        $loading.addClass('hide');
        $eye.removeClass('hide');
      }
    },

    listen: function () {
      var self = this,
          element = this.element,
          smsToken = this.smsToken,
          token = this.token;

      element.on('touchstart.setpassword', '.eye', function () {
        var $input = $(this).prev();
        $input.prop('type', function (i, val) {
          return val === 'password' ? 'text' : 'password';
        });
        $(this).toggleClass('icon16-pass-hide icon16-pass-show');
      })
        .on('keydown.setpassword', '#password', function (e) {
          if (e.keyCode === 13) {
            self.submitPassword();
          } else {
            self.$('.error-info').html('');
          }
        })
          .on('touchstart.setpassword', '.set-button button', function () {
            self.submitPassword();
          });

      this.on('show', function (req, res) {
        var cb = function () {
          // error getting identity informations
          req.error = true;
          res.redirect('/');
        };
        element.removeClass('hide');

        $.ajax({
          type: 'POST',
          url: config.api_url + '/Users/' + smsToken.user_id + '?token=' + smsToken.token,
          data: { token : smsToken.token },
          success: function (data) {
            var user = data.response.user;
            if (data && data.meta && data.meta.code === 200) {
              $('.identity .avatar').attr('src', user.avatar_filename);
              $('.identity .name').val(user.name);
              return;
            }
            cb();
          },
          error: function() {
            cb();
          }
        });
      });
    }
  });


  // `home` controller
  var HomeController = Controller.extend({
    //options: {template: '<div/>'},

    init: function () {
      this.render();
      this.listen();
    },

    render: function () {
      if (!$('#app-home').length) {
        this.element.appendTo($('#app-body'));
      }
    },

    listen: function () {
      var self = this,
          element = this.element;

      element.on('touchstart.home', '#home-card', function (e) {
        clearInterval(tryTimer);
        clearInterval(redirectTimer);
        tryTimer = redirectTimer = void 0;

        self.stopAnimate();

        app.request.switchPageCallback = function () {
          element.addClass('hide');
        };

        app.response.redirect('/#live');
      })

      this.on('show', function (screen) {
        log(this.$('#home-card')[0])

        // set `logo` & `my-card` position
        var h = screen.height;
        MCP1[13] = (h - 64) / 2;
        this.$('.logo-box .inner').css('top', (h - 300) / 2 + 'px');
        setCSSMatrix(this.$('#home-card')[0], MCP1);
        element.removeClass('hide');

        this.startAnimate();
      });
    },

    // animation options
    aopts: { o: 1 },

    createAnimate: function () {
      var aopts = this.aopts,
          logo = document.getElementById('big-logo'),
          card = document.getElementById('home-card'),
          update = function () {
            logo.style.opacity = aopts.o;
            card.style.opacity = 1 - aopts.o;
          };

      var a = this._a = new TWEEN.Tween(aopts)
            .delay(1377)
            .to({ o: 0 }, 1377)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(update);

      var b = this._b = new TWEEN.Tween(aopts)
            .delay(1377)
            .to({ o: 1 }, 1377)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(update);

      a.chain(b);
      b.chain(a);
    },

    startAnimate: function () {
      if (!this._a && !this._b) {
        this.createAnimate();
      }

      this._a.start();
    },

    stopAnimate: function () {
      var aopts = this.aopts,
          logo = document.getElementById('big-logo'),
          card = document.getElementById('home-card');

      this._a.stop();
      this._b.stop();

      aopts.o = logo.style.opacity = 1;
      card.style.opacity = 0;
    }

  });


  // `Cross` controller
  var CrossController = Controller.extend({

    init: function () {
      this.render();
      this.listen();
    },

    render: function () {
      if (!$('#app-cross').length) {
        this.element.appendTo($('#app-body'));
      }
    },

    listen: function () {
      var self = this,
          element = this.element,
          token = this.token,
          cross = this.cross;

      var $rsvp_toolbar = self.$('.rsvp_toolbar');
      element.on('touchstart.cross', '.portrait.me', function (e) {
        $rsvp_toolbar.toggleClass(
          'rsvp_toolbar_off',
          !$rsvp_toolbar.hasClass('rsvp_toolbar_off')
        );
      })
      // change name
        .on('touchstart.cross', '.changename', function (e) {
          var name = prompt('Change my display name:');
          if (name === null) {
          } else if (name === '') {
            alert('Display name cannot be empty.');
          } else {
            $.ajax({
              type: 'POST',
              url: config.api_url + '/Identities/'+ cross.identity.id + '/Update' + '?token=' + token,
              data: { name : name },
              success: function(data) {
                if (data && data.meta && data.meta.code === 200) {
                  self.$('.name_me').html(escape(data.response.identity.name));
                }
              },
              error: function() {
                alert('Failed, please retry later.');
              }
            });
          }
        })

      // rsvp
        .on('touchstart.cross', '.rsvp.accepted, .rsvp.unavailable', function () {
          var type = $(this).hasClass('accepted') ? 'ACCEPTED' : 'DECLINED';
          self.rsvp(type);
        })

      // description
        .on('touchstart.cross', '.inf_area .description', function () {
          var $t = $(this),
              clickable = $t.hasClass('clickable');
          if (clickable) {
            var limit = $t.hasClass('limit');
            $t.toggleClass('limit', !limit);
            $t.find('.xbtn-more .rb').toggleClass('hidden', limit);
            $t.find('.xbtn-more .lt').toggleClass('hidden', !limit);
          }
        })

      this.on('show', function () {
        element.removeClass('hide');

        var $desc = this.$('.inf_area .description');
        if ($desc.height() > 130) {
          $desc.addClass('limit clickable');
          $desc.find('.xbtn-more').removeClass('hide');
          $desc.find('.xbtn-more .rb').removeClass('hidden');
        }
      });

    },

    rsvp: function (status) {
      var id = this.cross.identity.id, exfee_id = this.exfee_id, token = this.token;
      var data = [{
        rsvp_status: status,
        identity_id: id,
        by_identity_id: id
      }];
      this.$('.rsvp_toolbar').addClass('rsvp_toolbar_off');
      var $rsvpMe = this.$('.portrait_rsvp_me').removeClass('accepted declined pending');
      switch (status) {
        case 'ACCEPTED':
          $rsvpMe.addClass('accepted');
          break;
        case 'DECLINED':
          $rsvpMe.addClass('declined');
          break;
        default:
          $rsvpMe.addClass('pending');
      }
      $.ajax({
        type: 'post',
        url: config.api_url + '/Exfee/' + exfee_id + '/Rsvp?token=' + token,
        data: { rsvp: JSON.stringify(data) },
        success : function(data) {},
        error   : function() {
          alert('RSVP failed!');
        }
      });
    }

  });


  // `live` controller
  var LiveController = Controller.extend({
    init: function () {
      this.render();
      this.listen();
    },

    render: function () {
      if (!$('#app-live').length) {
        this.element.appendTo($('#app-body'));
      } else {
        this.element = $('#app-live');
      }
    },

    listen: function () {
      var element = this.element;

      var xxx;
      $(document).scroll(function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (window.scrollY === 25) {
          console.log('232323')
          xxx = setInterval(function () {
            console.log(xxx)
            //clearInterval(xxx);
            window.scrollTo(0, 0);
          }, 0)
        }
        console.log(window.scrollY);
        return false;
      });

      element.on('touchstart.live', '#card-name', function (e) {
        e.stopPropagation();
        setTimeout(function () {
          window.scrollTo(0, 0);
        }, 0);

        this.focus();
        return false;
      })

      this.on('show', function (screen) {
        this.element.removeClass('hide');
        var h = screen.height;
        MCP1[13] = (h - 64) / 2;
        setCSSMatrix(this.$('#icard')[0], MCP1);
        this.$('.live-form, .live-gahter').css('min-height', h);

        this.$('#live-discover').css('opacity', 0);
        this.$('#card-form').css('opacity', 0);
        this.startAnimate();
      });
    },

    // animation from
    //afrom: { o: 0 },
    // animation to
    //ato: { o: 1 },
    createAnimate: function () {
      var afrom = this.afrom, ato = this.ato;
      var icard = this.$('#icard')[0];
      var cardForm = this.$('#card-form')[0];
      var discover = this.$('#live-discover')[0];
      var m1_13 = MCP1[13], m0_13 = MCP0[13];
      var m = MCP0.slice(0);
      var a = this.a = new TWEEN.Tween({ o: 0 })
            .to({ o: 1 }, 500)
            .easing(TWEEN.Easing.Cubic.In)
            .onStart(function () {
              //window.scrollTo(0, 0);
            })
            .onUpdate(function () {
              discover.style.opacity = this.o;
              m[13] = (m1_13 - m0_13) * (1 - this.o) + m0_13;
              setCSSMatrix(icard, m);
            });

      var b = this.b = new TWEEN.Tween({ o: 0 })
            .delay(250)
            .to({ o: 1 }, 500)
            .onUpdate(function () {
              cardForm.style.opacity  = this.o;
            });
    },

    startAnimate: function () {
      if (!this.a && !this.b) {
        this.createAnimate();
      }
      this.a.start();
      this.b.start();
    },

    stopAnimate: function () {
      this.a.stop();
      this.b.stop();
    }

  });

  /***************************************************************************/



  var lightsaber = require('lightsaber');

  // Create App   ***********************************
  var app = lightsaber();
  app.use(middleware.setHtmlHeight);
  app.use(middleware.checkSMSToken);
  app.use(middleware.cleanup);
  app.initRouter();

  app.controllers = {};

  var redirectTimer;
  app.controllers.footer = new FooterController({

    //countDown: 5,
    countDown: 500000,

    element: $('#app-footer'),

    init: function () {
      this.listen();
    },

    listen: function () {
      var self = this,
          element = self.element;
      element
        .on('click.footer', '.redirecting, .web-version', function () {
          window.location.href = '/?ipad' + location.hash;
        })
        .on('click.footer', '.get-button button', function () {
          showAppInStore();
        })

        .on('keydown.footer', '#email', function (e) {
          if (e.keyCode === 13) {
            var email = self.$('#email').val();
            self.addNotificationIdentity(email);
          }
        })
        .on('click.footer', '.subscribe .btn_mail', function (e) {
          var email = self.$('#email').val();
          self.addNotificationIdentity(email);
        })

      this.on('show', function (screen, hasBanner, hasCross, hasError) {
        var top = screen.height - 86 - (hasBanner ? 50 : 0);
        this.element.removeClass('hide');
        this.element.css('top',  top + 'px');
        this.$('.redirecting').removeClass('hide');
        //this.$('.web-version').removeClass('hide');
        this.emit('start-redirect');
        this.$('.error-info').toggleClass('hide', !hasError);
        log('show footer bar')
      });

      this.on('show-from-cross', function (exfee_id, token, args) {
        this.element.addClass('ft-bg');
        this.cross = {
          exfee_id: exfee_id,
          token: token
        };
        this.$('.actions').addClass('action-cross')
        this.$('.action').addClass('hide');
        if (token) {
         this.$('.subscribe').removeClass('hide')
        }
        this.$('.redirecting').removeClass('hide');
        this.element.removeClass('hide');
        $('#app-footer').addClass('ft-bg');
        if (args) {
          this.emit('start-redirect', args);
        } else {
          this.$('.get-button, .web-version').removeClass('hide');
          this.emit('stop-redirect');
        }
        //this.$('.get-button, .web-version').removeClass('hide');
      });

      this.on('start-redirect', function (args) {
        var $r = $('.redirecting'), $s = $r.find('.sec'), countDown = self.countDown, si;
        $s.text(si = countDown);
        redirectTimer = setInterval(function() {
          si -= 1;
          if (si >= 1) {
            $s.text(si);
          } else {
            clearInterval(redirectTimer);
            launchApp(args);
            //$('.actions .error-info').hide();
          }
        }, 1000);
      });

      this.on('stop-redirect', function () {
        $('.redirecting').addClass('hide');
        clearInterval(redirectTimer);
        redirectTimer = void 0;
      });
    },

    addNotificationIdentity: function (email, exfee_id, token) {
      exfee_id = this.cross.exfee_id;
      token = this.cross.token;
      if (!/^[a-zA-Z0-9!#$%&\'*+\\\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&\'*+\\\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(email)) {
        $('#email.email').attr('placeholder', 'Bad email Address.');
        return;
      }
      $.ajax({
        type: 'POST',
        url: config.api_url + '/Exfee/'+ exfee_id + '/AddNotificationIdentity' + '?token=' + token,
        data: {
          provider: 'email',
          external_username: email
        },
        success : function(data) {
          if (data && data.meta && data.meta.code === 200) {
            $('.subscribe').hide();
          }
        },
        error   : function() {
          alert('Failed, please retry later.');
        }
      });
    }
  });


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

  var tryTimer;
  app.on('launched', function () {
    log('app launched');
    // During tests on 3g/3gs this timeout fires immediately if less than 500ms.
    tryTimer = setInterval(function () {
      var n = now();
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

    function animate() {
      requestAnimationFrame(animate);
      TWEEN.update();
    }
    animate();
  });

  // app running
  app.run();

  console.dir(app)

  // global
  window.App = app;

});
