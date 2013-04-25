define('mobilecontroller', function (require, exports, module) {
  'use strict';

  var Base = require('base'),
      Store = require('store'),
      TWEEN = require('tween'),
      config = require('config'),

      util   = require('util'),
      trim = util.trim,
      parseId = util.parseId,

      Live   = require('live'),

      escape = function (html, encode) {
        return html
          .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      },

      now = Date.now || function () { return new Date().getTime(); },

      showAppInStore = function() {
        window.location = 'itms://itunes.apple.com/us/app/exfe/id514026604';
      },

      launchApp = function (args) {
        App.set('tryRedirectAt', now());
        window.location = 'exfe://crosses/' + (args || '');
      },

      hasWebkitTransform = ('webkitTransform' in document.body.style),
      setCSSMatrix = function (e, m) {
        var d = m.length === 6 ? '' : '3d';
        e.style[hasWebkitTransform ? 'webkitTransform' : 'transform'] = 'matrix' + d + '(' + m.join(',') + ')';
      },

      getLiveCard = function () {
        var liveCard = Store.get('livecard');
        if (!liveCard) {
          var card = {
            id         : '',
            name       : '',
            avatar     : '',
            bio        : '',
            identities : []
          };
          liveCard = {
            // Note: 是否清空原来 user.id
            card: card,
            latitude  : '',
            longitude : '',
            accuracy  : '',
            traits    : []
          };
          var user = Store.get('user');
          if (user) {
            card.name = user.name;
            card.avatar = user.avatar_filename;
            card.bio = user.bio;
            card.identities = user.identities;
          }
          Store.set('livecard', liveCard);
        }
        liveCard.card.id = '';
        return liveCard;
      },


      /**- _ -**/
      M4    = [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0,   0,  0, 0, 1 ],
      MCP0  = [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 128, 28, 0, 1 ], // `live-edit` my-card position
      MCP1  = [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 128,  0, 0, 1 ], // `home` home-card position
      /**- _ -**/

      uuid = 0,
      guid = function () {
        return 'Controller-' + uuid++;
      };

  exports = module.exports = {};

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
      this.element.off();
      delete Controller.caches[this.cid];
      Controller.superclass.destory.call(this);
    },

    $: function (selector) {
      return this.element.find(selector);
    }

  });

  Controller.caches = [];


  // `app-footer` controller
  exports.FooterController = Controller.extend({

    countDown: 5,
    //countDown: 500000,

    element: $('#app-footer'),

    init: function () {
      this.listen();
    },

    enableTimer: true,

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
        .on('click.footer', '.subscribe .btn_mail', function () {
          var email = self.$('#email').val();
          self.addNotificationIdentity(email);
        })

      this.on('show', function (screen, hasBanner, hasCross, hasError) {
        var top = screen.height - 96 - (hasBanner ? 60 : 0);
        this.element.removeClass('hide');
        this.element.css('top',  top + 'px');
        if (this.enableTimer) {
          this.$('.redirecting').removeClass('hide');
          //this.$('.web-version').removeClass('hide');
          this.emit('start-redirect');
        }
        this.$('.error-info').toggleClass('hide', !hasError);
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
        var redirectTimer = setInterval(function() {
          si -= 1;
          if (si >= 1) {
            $s.text(si);
          } else {
            clearInterval(App.set('redirectTimer'));
            launchApp(args);
            //$('.actions .error-info').hide();
          }
        }, 1000);
        App.set('redirectTimer', redirectTimer);
      });

      this.on('stop-redirect', function () {
        this.enableTimer = false;
        this.$('.get-button').removeClass('hide');
        $('.redirecting').addClass('hide');
        var redirectTimer = App.set('redirectTimer');
        clearInterval(redirectTimer);
        App.set('redirectTimer', redirectTimer = void 0);
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
          provider: 'emailuu',
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


  // `verify` controller
  exports.VerifyController = Controller.extend({

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
                  App.controllers.footer.emit('start-redirect', '?user_id=' + user.user_id + '&token=' + smsToken.token);
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
  exports.SetPasswordController = Controller.extend({
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
      var token = this.token,
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
          success: function () {
            $loading.addClass('hide');
            $eye.removeClass('hide');
            $error.html('Failed to set password. Please try later.').removeClass('hide');
            // $('#password').prop('disabled', false);
            $button.removeClass('disabled').prop('disabled', false);
          },
          error: function () {
            $loading.addClass('hide');
            $eye.removeClass('hide');
            $error.html('Failed to set password. Please try later.').removeClass('hide');
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
          smsToken = this.smsToken;

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
  exports.HomeController = Controller.extend({
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

      element.on('touchstart.home', '#home-card', function () {
        clearInterval(App.set('tryTimer'));
        clearInterval(App.set('redirectTimer'));
        App.set('tryTimer', void 0);
        App.set('redirectTimer', void 0);

        self.stopAnimate();

        // {{{
        self.emit('goto-live');
        // }}}
      })

      this.on('goto-live', function () {
        App.controllers.footer.emit('stop-redirect');

        App.request.switchPageCallback = function () {
          element.addClass('hide');
        };
        App.response.redirect('/#live');
      });

      this.on('show', function (screen) {
        // set `logo` & `my-card` position
        var h = screen.height;
        this.$('.logo-box .inner').css('top', (h - 300) / 2 + 'px');
        element.removeClass('hide');
        MCP1[13] = (h - 64) / 2;
        this.setHomeCard(MCP1);
        this.startAnimate();
      });
    },

    setHomeCard: function (m4) {
      var liveCard = getLiveCard(), card = liveCard.card,
          name = card.name, avatar = card.avatar,
          $homeCard = this.$('#home-card');
      setCSSMatrix($homeCard[0], m4);
      if (card && (name || avatar)) {
        if (!avatar) {
          avatar = name ? (config.api_url + '/avatar/default?name=' + name) : '/static/img/portrait_default.png';
        }
        avatar = 'url(' + avatar + ')';
      } else {
        avatar = '';
      }
      $homeCard.find('.avatar').css('background-image', avatar);
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

      this._a = new TWEEN.Tween(aopts)
        .delay(1377)
        .to({ o: 0 }, 1377)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate(update);

      this._b = new TWEEN.Tween(aopts)
        .delay(1377)
        .to({ o: 1 }, 1377)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate(update);
    },

    startAnimate: function () {
      if (!this._a && !this._b) {
        this.createAnimate();
      }

      this._a.chain(this._b);
      this._b.chain(this._a);

      this._a.start();
    },

    stopAnimate: function () {
      var aopts = this.aopts,
          logo = document.getElementById('big-logo'),
          card = document.getElementById('home-card');

      this._a.chain();
      this._b.chain();
      this._b.stop();
      this._a.stop();

      aopts.o = logo.style.opacity = 1;
      card.style.opacity = 0;
    }

  });


  // `Cross` controller
  exports.CrossController = Controller.extend({

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
      element.on('touchstart.cross', '.portrait.me', function () {
        $rsvp_toolbar.toggleClass(
          'rsvp_toolbar_off',
          !$rsvp_toolbar.hasClass('rsvp_toolbar_off')
        );
      })
      // change name
        .on('touchstart.cross', '.changename', function () {
          var name = prompt('Change my display name:');
          if (!name) {
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
        success : function() {},
        error   : function() {
          alert('RSVP failed!');
        }
      });
    }

  });


  // `live` controller
  exports.LiveController = Controller.extend({
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
      var self = this,
          element = this.element;

      var TOUCH_TIMEOUT, TOUCH_TIME;

      element.on('touchstart.live', '#card-name', function (e) {
        e.stopPropagation();
        setTimeout(function () {
          window.scrollTo(0, 0);
        }, 0);
        this.focus();
      })

        .on('touchstart.live', '.live-form', function (e) {
          e.stopPropagation();
          if ($(e.target).hasClass('live-form')) {
            App.response.redirect('/');
          }
        })

        .on('keydown.live', '#card-name', function (e) {
          var k = e.keyCode, v = trim(this.value);
          if (v && k === 13) {
            self.addEmailOrPhone(this, v);
          }
        })
        .on('blur.live', '#card-name', function () {
          var v = trim(this.value);
          if (v) {
            self.addEmailOrPhone(this, v);
          } else {
            self.setCardName(this);
          }
        })

        .on('keydown.live blur.live', '#add-identity', function (e) {
          var k = e.keyCode, v = trim(this.value);
          if ((v && k === 13) || e.type === 'blur') {
            self.addEmailOrPhone(this, v, true);
            this.value = '';
          }
        })

        .on('keydown.live blur.live', '#facebook-identity', function (e) {
          var k = e.keyCode, v = trim(this.value);
          if ((v && k === 13) || e.type === 'blur') {
            v += '@facebook';
            if (self.addFacebook(this, v)) {
              $('#add-identity-facebook').addClass('hide');
            }
            this.value = '';
          }
        })

      .on('touchstart.live', '.list .input-item', function () {
        $(this).next().removeClass('hidden')
      })
      .on('blur.live', '.list .input-item', function () {
        $(this).next().addClass('hidden')
      })

      .on('touchstart.live', '.list .delete', function () {
        var input = $(this).prev()[0],
            v = trim(input.value),
            dp = input.getAttribute('data-provider'),
            identity;

        if (dp === 'facebook') {
          v += '@facebook';
        }

        identity = parseId(v);

        if (identity && identity.provider) {
          $(this).parent().remove();
          self.removeIdentity(identity);
        }
      })

        .on('touchstart.live', '.btn-start', function () {
          var disabled = this.disabled;
          if (!disabled) {
            setTimeout(function () {
              $('.input-item').blur();
            }, 0)

            if (self.inspectFields()) {
              self.emit('post-card');
              self.emit('live-gather');
            }

          }
        })
        .on('hold:live', '.live-gather .card .avatar', function () {
            var t = this, pe = t.parentNode;
            var card = $(pe).data('card')
            var matrix = pe.style.transform || pe.style.webkitTransform;
            var m = matrix.match(/([\-\d\.]+)/g).slice(1);
            var tip = document.getElementById('card-tip');
            var html = '';
            if (card && card.identities) {
              for (var i = 0, l = card.identities.length; i < l; ++i) {
                var identity = card.identities[i], p = identity.provider, eu = identity.external_username;
                var ps = '';
                if (p !== 'email' && p !== 'phone') {
                  p = p.substr(0, 1).toUpperCase() + p.substr(1);
                  ps = '<span class="provider">'+p+'</span>'
                }
                html += '<li><span class="external-username'+(ps ? '' : ' normal')+'">'+eu+'</span>'+ps+'</li>'
              }
              tip.querySelector('ul').innerHTML = html;
              var h = tip.clientHeight;
              var x = ~~m[12] - (200 - 64) / 2, y = ~~m[13] - (6 + h), ax = 93;
              if (x < 0) {
                x = 10;
              } else if (x + 200 >= 320) {
                x = 320 - 200 - 10;
              }
              if (x === 10 || x === 110 ) {
                ax = ~~m[12] + 32 - 7 - x;
              }
              m[12] = x;
              m[13] = y;
              m[14] = 7;
              setCSSMatrix(tip, m);
              tip.querySelector('.ang').style.left = ax + 'px';
              tip.querySelector('.bio').innerText = card.bio;
              tip.className = 'card-tip';
            }
          })

          .on('touchstart.live', '.live-gather .card .avatar', function (e) {
              var $t = $(this), delta = 250, fingers = e.touches.length;
              TOUCH_TIME = now();
              if (TOUCH_TIMEOUT) {
                clearTimeout(TOUCH_TIMEOUT);
                TOUCH_TIMEOUT = void 0;
              }
              if (fingers === 1) {
                if (fingers >= 1) {
                  TOUCH_TIMEOUT = setTimeout(function () {
                    $t.trigger('hold:live');
                  }, delta);
                }
              }
            })

          .on('touchend.live', '.live-gather .card .avatar', function () {
              if (TOUCH_TIMEOUT) {
                clearTimeout(TOUCH_TIMEOUT);
                TOUCH_TIMEOUT = void 0;
              }
              if (now() - TOUCH_TIME < 250) {
                var $p = $(this).parent();
                if (!$p.hasClass('card-me')) {
                  $p.toggleClass('selected');
                }
              }
              document.getElementById('card-tip').className = 'card-tip hidden';
            })

          .on('touchstart.live', '.back', function () {
            self.$('.live-gather').addClass('hide');
            App.response.redirect('/');
          })

          .on('touchstart.live', '.live-gather', function (e) {
            var t = e.target,
                $h2 = $('.live-title h2'),
                h2 = $h2[0],
                has = $h2.hasClass('clicked');
            if (has) {
              $('.wave').css('opacity', 1);
              $h2.data('clicked', t === h2 || $.contains(h2, t))
                  .removeClass('clicked');
              $('.live-tip').addClass('live-tip-close');
            }
          })

          .on('touchstart.live', '.live-title h2', function () {
            var $t = $(this);
            var has = $t.hasClass('clicked'), clicked = $t.data('clicked');
            if (!has && !clicked) {
              $(this).addClass('clicked');
              $('.wave').css('opacity', 0);
              $('.live-tip').removeClass('live-tip-close');
            }
            $t.data('clicked', false);
          })

          .on('touchstart.live', '.btn-confirm', function () {
            // todo: 提交联系人
            self.postContacts();
          });

      this.on('show-add-email', function () {
        this.$('#add-identity').removeClass('hide');
      });

      this.on('show-add-facebook', function () {
        if (this.$('.list input[data-provider="facebook"]').length) {
          return;
        }
        this.$('#add-identity-facebook').removeClass('hide');
      });

      this.on('show', function (screen) {

        this.screen = screen;

        $('#app-footer').addClass('hide');

        this.element.removeClass('hide');
        var h = screen.height;
        MCP1[13] = (h - 64) / 2;
        setCSSMatrix(this.$('#icard')[0], MCP1);
        this.$('.live-form, .live-gahter').css('min-height', h);

        this.$('.live-form').removeClass('hide');
        //this.$('.card-form').removeClass('hide');
        this.$('#live-discover').css('opacity', 0);
        this.$('#card-form').css({
          'opacity': 0,
          'min-height': ((h - 100) / h) * 100 + '%'
        });

        this.$('.identities .list').empty();
        this.liveCard = getLiveCard();
        this.updateMyCardForm();

        this.startAnimate();
      });

      this.on('post-card', function () {
        this.postMyCard();
      });

      this.on('disabled-live-btn', function (type) {
        this.$('.btn-start')
          .toggleClass('disabled', type)
          .prop('disabled', type);
      });

      this.on('live-gather', function () {
        this.$('.live-form').addClass('hide');
        this.$('.live-gather').removeClass('hide');
        this.$('.wave').addClass('start');

        this.measurePositions(this.screen.width, this.screen.height - 10, 64 / 2,  64 / 2);

        this.MAPS = this._MAPS.slice(0);

        this.$('.live-gather').find('.card').remove();
        var card = this.liveCard.card;
        var $me = this.genCard(card, this.coords[0][0], 0, 0, true, this.screen.ios)
          .appendTo(this.$('.live-gather'));
        this.updateCard($me[0], card);

        if (this._others) {
          this.updateOthers();
        }
      });
    },

    postContacts: function () {},

    inspectFields: function () {
      var card = this.liveCard.card;
      return card.name && card.identities.length;
    },

    updateMe: function (card) {
      var icard = document.getElementById('icard'), a0 = icard.getAttribute('data-url'), a1;
      if (a0 !== card.avatar) {
        a1 = card.avatar;
        if (!a1) {
          a1 = card.name ? (config.api_url + '/avatar/default?name=' + card.name) : '/static/img/portrait_default.png';
        }
        if (a0 !== a1) {
          icard.querySelector('.avatar').style.backgroundImage = 'url(' + a1 + ')';
          icard.setAttribute('data-url', a1);
        }
      }
      if (card.name) {
        document.getElementById('card-name').value = card.name;
      }
      var bioDiv = document.getElementById('card-bio');
      if (card.bio) {
        bioDiv.innerText = card.bio;
      }
      bioDiv.className = card.bio ? '' : 'hide';
    },

    postMyCard: function () {
      Store.set('livecard', this.liveCard);
      var card = this.liveCard.card;
      if (card.identities.length) {
        card._time = (new Date()).getTime()
        Live.init(card, $.proxy(this.liveCallback, this));
      }
    },

    // 是否更新界面
    state: 0,

    liveCallback: function (result) {
      if (this.state === 1) {
        this.updateMe(this.liveCard.card = result.me);
        Store.set('livecard', this.liveCard);
      }
      this._others = result.others;
      this.updateOthers();
    },

    updateMyCardForm: function () {
      var liveCard = this.liveCard,
          card = liveCard.card,
          identities = card.identities,
          len;
      if (identities && (len = identities.length)) {
        this.updateMe(card);

        this.postMyCard();

        identities = identities.slice(0);

        var identity, provider;
        while ((identity = identities.shift())) {
          provider = identity.provider;
          if (provider === 'email'
            || provider === 'phone'
            || provider === 'facebook') {

            this.addIdentity(identity, true);
          }
        }

        this.emit('show-add-email');
        this.emit('show-add-facebook');
      } else {
        this.emit('disabled-live-btn', true);
      }
    },

    resetLiveCard: function () {
      Store.clear('livecard');
      this.liveCard = getLiveCard();
    },

    updateLiveCard: function (identity, operation) {
      var card = this.liveCard.card, identities = card.identities;
      // add
      if (operation === '+') {
        identities.push(identity);
      // remove
      } else {
        for (var i = 0, len = identities.length; i < len; ++i) {
          var id = identities[i];
          if (id.provider === identity.provider
            && id.external_username === identity.external_username) {

            identities.splice(i, 1);
            break;
          }
        }
        if (identities.length === 0) {
          this.resetLiveCard();
        }
      }
      Store.set('livecard', this.liveCard);
    },

    setCardName: function (elem) {
      var identities = this.packedIdentities();
      if (identities.length) {
        var identity = identities[0],
            name = '',
            eun = identity.external_username,
            provider = identity.provider;
        if (provider === 'phone') {
          name = 'Anonym_' + eun.slice(eun.length - 4);
        } else {
          name = eun.split('@')[0];
        }

        this.liveCard.card.name = elem.value = name;

        elem.setAttribute('placeholder', 'Name');
        $(elem).addClass('normal');
      }
    },

    addFacebook: function (elem, v) {
      var identity = parseId(v), provider = identity.provider;
      if (provider
        && (provider === 'facebook')
        && !this.existsByIdentity(identity)) {

        this.addIdentity(identity);
        return true;
      }
      return false;
    },

    addEmailOrPhone: function (elem, v, status) {
      status = !status;
      var identity = parseId(v), provider = identity.provider;
      if (provider
        && (provider === 'email' || provider === 'phone')
        && !this.existsByIdentity(identity)) {

        this.addIdentity(identity);
        if (status) {
          this.setCardName(elem);
        }
      }

      if (status) {
        this.emit('show-add-email');
        this.emit('show-add-facebook');
      }

      this.emit('post-card');
    },

    genIdentity: (function () {
      var LI_TMP = '<li class="identity">'
        + '<span class="provider">{{provider_alias}}</span>'
        + '<input data-provider="{{provider}}" style="" autocapitalize="none" class="external_username input-item normal" value="{{external_username}}" type="email"/>'
        + '<div class="delete hidden"><div class="delete-x">x</div></div>'
        + '</li>';

      return function gen(identity) {
        var provider = identity.provider;
        if (provider === 'email') {
          provider = 'Email';
        } else if (provider === 'phone') {
          provider = 'Mobile';
        } else if (provider === 'facebook') {
          provider = 'Facebook';
        }

        var $li = $(LI_TMP.replace(/\{\{provider\}\}/g, identity.provider)
          .replace(/\{\{provider_alias\}\}/g, provider)
          .replace(/\{\{external_username\}\}/g, identity.external_username));
        return $li;
      };

    })(),

    resetCard: function () {
      this.state = 0;

      this.$('#icard')
        .removeAttr('data-url')
        .find('.avatar')
          .css('background', '');

      this.$('#card-name')
        .attr('placeholder', 'Your email or mobile no.')
        .removeClass('normal')
        .val('');

      this.$('#add-identity').addClass('hide');
      this.$('#add-identity-facebook').addClass('hide');
    },

    removeIdentity: function (identity) {
      var lis = this.$('.identities .list li');
      if (0 === lis.length) {
        this.resetCard();
        this.emit('disabled-live-btn', true);
      } else {
        if(identity.provider === 'facebook') {
          this.emit('show-add-facebook');
        }
      }

      this.updateLiveCard(identity, '-');
      this.emit('post-card');
    },

    addIdentity: function (identity, status) {
      status = !status;

      this.state = 1;

      // 刷新 storge
      var list = this.$('.identities .list'),
          li = this.genIdentity(identity);
      list.append(li);

      this.emit('disabled-live-btn', false);

      if (status) {
        this.updateLiveCard(identity, '+');
        this.emit('post-card');
      }
    },

    packedIdentities: function () {
      var inputs = this.$('.identities .list').find('input'),
          i = 0, len = inputs.length,
          identities = [], input, dp,
          v, identity, provider;
      for (; i < len; ++i) {
        input = inputs.eq(i);
        dp = input.attr('data-provider');
        v = trim(inputs.eq(i).val());
        if (!v) {
          continue;
        }
        if (dp === 'facebook') {
          v += '@facebook';
        }
        identity = parseId(v);
        provider = identity.provider;
        if (provider
          && (
            provider === 'email'
            || provider === 'phone'
            || provider === 'facebook'
          )
        ) {
          identities.push(identity);
        }
      }
      return identities;
    },

    existsByIdentity: function (identity) {
      var identities = this.packedIdentities(),
          eun = identity.external_username, p = identity.provider, id;

      if (0 === identities.length) {
        return false;
      }

      while ((id = identities.shift())) {
        if (id.external_username === eun && id.provider === p) {
          return true;
        }
      }

      return false;
    },

    coords: ''.split(),
    _MAPS: [ [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2], [2, 3], [3, 0], [3, 1], [3, 2], [3, 3] ],
    measurePositions: function (w, h, l, t) {
      var coords = this.coords;

      coords[0] = [ [w * 0.5 - l, h * 0.88 - t] ];

      coords[1] = new Array(3);
      coords[1][0] = [ w * 0.25 - 5  - l, h * 0.66 + 30 - t ];
      coords[1][1] = [ w * 0.5 - l      , h * 0.66 - t ];
      coords[1][2] = [ w * 0.75 + 5  - l, h * 0.66 + 30 - t ];

      coords[2] = new Array(4);
      coords[2][0] = [ w * 0.125 + 5 - l, h * 0.44 + 40 - t ];
      coords[2][1] = [ w * 0.375 - l    , h * 0.44 - t ];
      coords[2][2] = [ w * 0.625 - l    , h * 0.44 - t ];
      coords[2][3] = [ w * 0.875 - 5 - l, h * 0.44 + 40 - t ];

      coords[3] = new Array(4);
      coords[3][0] = [ w * 0.125 - l, h * 0.22 + 40 - t ];
      coords[3][1] = [ w * 0.375 - l, h * 0.22 - t ];
      coords[3][2] = [ w * 0.625 - l, h * 0.22 - t ];
      coords[3][3] = [ w * 0.875 - l, h * 0.22 + 40 - t ];
    },

    genCard: (function () {
      var CARD_TMP = '<div data-url="{{avatar}}" id="{{id}}" data-g="{{g}}" data-i="{{i}}" class="card {{class}}" style="-webkit-transform: matrix3d({{matrix}});">'
          + '<div class="avatar" style="background-image: url({{avatar}})"></div>'
          + '<div class="name">{{name}}</div>'
        + '</div>';

      return function (card, pos, g, i, isMe, ios) {
        var m = M4.slice(0);
        m[12] = pos[0];
        m[13] = pos[1];
        var $card = $(CARD_TMP.replace(/\{\{avatar\}\}/g, card.avatar)
          .replace('{{id}}', card.id)
          .replace('{{class}}', (isMe ? 'card-me' : 'card-other hide') + (ios === 'iphone4' ? ' card-iphone4' : ''))
          .replace('{{g}}', g)
          .replace('{{i}}', i)
          .replace('{{name}}', card.name)
          .replace('{{matrix}}', m.join(',')));
        $card.data('card', card);
        return $card;
      };
    })(),

    addCard: function (card) {
      var MAPS = this.MAPS;
      if (MAPS.length === 0) {
        return false;
      }
      var gi = MAPS.shift(), g = gi[0], i = gi[1], pos = this.coords[g][i],
          $card = this.genCard(card, pos, g, i, false, this.screen.ios), elem = $card[0], s = elem.style,
          m = M4.slice(0);

      m[0] = m[5] = 0;
      m[12] = pos[0];
      m[13] = pos[1];
      $card.data('card', card);
      this.$('.live-gather').append($card);
      new TWEEN.Tween({ o: 0 })
        .to({ o: 1 }, 250)
        .easing(TWEEN.Easing.Bounce.In)
        .onStart(function () {
          setCSSMatrix(elem, m);
          $card.removeClass('hide')
        })
        .onUpdate(function () {
          s.opacity = this.o;
          m[0] = m[5] = this.o;
          setCSSMatrix(elem, m);
        })
        .onComplete(function () {
          TWEEN.remove(this);
        })
        .start();
    },

    delCard: function (elem) {
      var MAPS = this.MAPS,
          g = elem.getAttribute('data-g'), i = elem.getAttribute('data-i'),
          m = M4.slice(0), pos = this.coords[g][i], s = elem.style;
      m[12] = pos[0]
      m[13] = pos[1];
      new TWEEN.Tween({ o: 1 })
        .to({ o: 0 }, 250)
        .easing(TWEEN.Easing.Bounce.Out)
        .onUpdate(function () {
          s.opacity = this.o;
          setCSSMatrix(elem, m);
        })
        .onComplete(function () {
          MAPS.unshift([g, i]);
          elem.remove();
          TWEEN.remove(this);
        })
        .start();
    },

    updateCard: function (elem, card) {
      var a0 = elem.getAttribute('data-url'), a1 = '';
      if (!a0 || a0 !== card.avatar) {
        a1 = card.avatar;
        if (!a1) {
          a1 = card.name ? (config.api_url + '/avatar/default?name=' + card.name) : '/static/img/portrait_default.png';
        }
        if (a0 !== a1) {
          elem.querySelector('.avatar').style.backgroundImage = 'url(' + a1 + ')';
          elem.setAttribute('data-url', a1);
        }
      }
      elem.querySelector('.name').innerText = card.name;
      $(elem).data('card', card);
    },

    updateOthers: function () {
      var cards = this._others;
      var elems = document.querySelectorAll('.card-other'), len = elems.length, i = 0, elem, id, k, card;
      // 删除 old-card
      for (; i < len; ++i) {
        elem = elems[i];
        id = elem.getAttribute('id');
        if (!(id in cards)) {
          this.delCard(elem);
        }
      }

      // 添加 更新卡片
      for (k in cards) {
        card = cards[k];
        elem = document.getElementById(card.id);
        if (elem) {
          this.updateCard(elem, card);
        } else {
          this.addCard(card);
        }
      }
    },

    createAnimate: function () {
      var icard = this.$('#icard')[0];
      var cardForm = this.$('#card-form')[0];
      var discover = this.$('#live-discover')[0];
      var m1_13 = MCP1[13], m0_13 = MCP0[13];
      var m = MCP1.slice(0);
      this.a = new TWEEN.Tween({ o: 0 })
        .to({ o: 1 }, 500)
        .easing(TWEEN.Easing.Cubic.In)
        //.onStart(function () {//window.scrollTo(0, 0); })
        .onUpdate(function () {
          discover.style.opacity = this.o;
          m[13] = (m1_13 - m0_13) * (1 - this.o) + m0_13;
          setCSSMatrix(icard, m);
        });

      this.b = new TWEEN.Tween({ o: 0 })
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

});
