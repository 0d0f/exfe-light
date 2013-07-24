define('mobilecontroller', function (require, exports, module) {
  'use strict';

  var Base = require('base'),
      Store = require('store'),
      TWEEN = require('tween'),
      _ENV_ = window._ENV_,
      api_url = _ENV_.api_url,
      app_scheme = _ENV_.app_scheme,
      app_prefix_url = app_scheme + '://crosses/',
      AMAP_KEY = _ENV_.AMAP_KEY,
      openExfe = window.openExfe,
      Handlebars = require('handlebars'),

      $ = require('zepto'),

      // animation {{{
      //AF = require('af'),
      //requestAnimationFrame = AF.request,
      // animation }}}

      util   = require('util'),
      trim = util.trim,
      parseId = util.parseId,

      iPad = navigator.userAgent.match(/iPad/),

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

    destory: function () {
      this.element.off();
      this._destory();
    },

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
  exports.FooterController = Controller.extend({

    element: $('#app-footer'),

    init: function () {
      this.listen();
    },

    enableTimer: true,

    listen: function () {
      var self = this,
          element = self.element;
      element
        .on('click.footer', '.web-version', function () {
          window.location.href = '/?ipad' + location.hash;
        })
        .on('click.footer', '.get-button button', function (e) {
          e.preventDefault();
          openExfe();
          return false;
        })

        .on('keydown.footer', '#email', function (e) {
          if (e.keyCode === 13) {
            var email = self.$('#email').val();
            self.addNotificationIdentity(email);
          }
        })
        .on('click.footer', '.subscribe .btn_mail', function () {
          var email = trim(self.$('#email').val());
          self.addNotificationIdentity(email);
        })

      this.on('show', function (screen, hasBanner, hasCross, hasError) {
        var top = screen.height - 96 - (hasBanner ? 60 : 0);
        this.element.removeClass('hide');
        this.element.css({
          position: 'relative',
          top:  top + 'px'
        });
        this.$('.action').addClass('hide');
        this.$('.get-button').removeClass('hide');
        if (iPad) {
          this.$('.web-version').removeClass('hide');
        }
        this.$('.error-info').toggleClass('hide', !hasError);
      });

      this.on('reset-position', function () {
        var top = App.screen.height - 96;
        this.element.removeClass('hide');
        this.element.css({
          position: 'absolute',
          top:  top + 'px'
        });
        this.$('.action').addClass('hide');
        this.$('.get-button').removeClass('hide');
        if (iPad) {
          this.$('.web-version').removeClass('hide');
        }
      });

      this.on('show-from-cross', function (exfee_id, token, read_only/*, args*/) {
        this.element.css({
          position: 'relative',
          top: 0
        });
        this.element.addClass('ft-bg');
        this.cross = {
          exfee_id: exfee_id,
          token: token
        };
        this.$('.actions').addClass('action-cross')
        this.$('.action').addClass('hide');
        if (!read_only) {
          this.$('.subscribe').removeClass('hide')
        }
        this.element.removeClass('hide');
        $('#app-footer').addClass('ft-bg');
        this.$('.get-button').removeClass('hide');
        if (iPad) {
          this.$('.web-version').removeClass('hide');
        }
      });

      this.on('redirect', function (args, cb) {
        window.launchApp(app_prefix_url + args, cb);
      });
    },

    addNotificationIdentity: function (email, exfee_id, token) {
      exfee_id = this.cross.exfee_id;
      token = this.cross.token;
      var identity = parseId(email);
      if (identity && identity.provider !== 'email') {
        $('#email.email').attr('placeholder', 'Bad email Address.');
        return;
      }
      $.ajax({
        type: 'POST',
        url: api_url + '/Exfee/'+ exfee_id + '/AddNotificationIdentity' + '?token=' + token,
        data: {
          provider: identity.provider,
          external_username: identity.external_username
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
      $('#app-verify').remove();
      this.element.appendTo($('#app-body'));
    },

    listen: function () {
      var self = this,
          resolveToken = this.resolveToken;
      this.on('show', function (req, res) {
        setTimeout(function () {
          window.scrollTo(0, 0);
        }, 14);
        var cb = function () {
          // error getting identity informations
          req.error = true;
          res.redirect('/');
        };

        this.element.removeClass('hide');
        $('#app-body').css('height', '100%');

        var user = Store.get('tmp-user');
        if (user) {
          var identities = user.identities;
          for (var i = 0, len = identities.length; i < len; ++i) {
            var identity = identities[i];
            if (identity.id === resolveToken.identity_id) {
              self.showIdentity(identity);
              self.$('.done-info').removeClass('hide');
              break;
            }
          }
          Store.remove('tmp-user');
          Store.remove('tmp-token');
          App.controllers.footer.emit('reset-position');
          return;
        }

        var done = function (args) {
          App.controllers.footer.emit('redirect', args, function () {
            var search = window.search.substr(1);
            if (search) {
              search = '&' + search;
            }
            window.location = '/?redirect' +search + window.location.hash;
          });
        };

        var user_id = resolveToken.user_id,
        token = resolveToken.token;
        $.ajax({
          type: 'POST',
          url: api_url + '/Users/' + user_id + '?token=' + token,
          data: { token : token },
          success: function (data) {
            var meta = data.meta;
            if (meta && meta.code === 200) {
              var user = data.response.user,
                  identities = user.identities;
              for (var i = 0, len = identities.length; i < len; ++i) {
                var identity = identities[i];
                if (identity.id === resolveToken.identity_id) {
                  self.showIdentity(identity);
                  self.$('.done-info').removeClass('hide');
                  Store.set('tmp-user', user);
                  App.controllers.footer.emit('reset-position');
                  if (user_id && token) {
                    var args = '?token=' + token + '&user_id=' + user_id + '&identity_id=' + identity.id;
                    done(args);
                  }
                  break;
                }
              }
              return;
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
      //$identity.find('.provider').attr('src', '/static/img/identity_' + identity.provider + '_18_grey@2x.png');
    }

  });


  // `set-password` controller
  exports.SetPasswordController = Controller.extend({
    init: function () {
      this.render();
      this.listen();
    },

    render: function () {
      $('#app-setpassword').remove();
      this.element.appendTo($('#app-body'));
    },

    submitPassword: function () {
      var self = this,
          token = this.token,
          $button = this.$('.set-button button'),
          $error = this.$('.error-info'),
          $name = this.$('#name'),
          $pass = this.$('#password'),
          name = trim($name.val()),
          password = $pass.val();
      if (/*name && */password.length >= 4) {
        $button
          .addClass('disabled')
          .prop('disabled', true);

        $.ajax({
          type: 'POST',
          url: api_url + '/Users/ResetPassword',
          data: {
            token: token,
            name: name,
            password: password
          },
          success: function (data) {
            var meta = data.meta;
            if (meta && meta.code === 200) {
              $name.blur();
              $pass.blur();
              self.$('.password').addClass('hide');
              self.$('.done-info').removeClass('hide');
              $error.html('').addClass('hide');
              $button.parent().addClass('hide');
              var authorization = data.response.authorization;
              if (authorization) {
                App.controllers.footer.emit('redirect', '?token=' + authorization.token + '&user_id=' + authorization.user_id, function () {
                  var search = window.location.search.substr(1);
                  if (search) {
                    search = '&' + search;
                  }
                  window.location = '/?redirect' +search + window.location.hash;
                });
              }
            } else {
              if (meta.code === 401) {
                $error.html('<span class="t">Token expired.</span> Please request to reset password again.').removeClass('hide');
                $pass.prop('disabled', true);
                $button.parent().addClass('hide')
              }
            }
            $button.prop('disabled', true);
          },
          error: function () {
            $error.html('Failed to set password. Please try later.').removeClass('hide');
            $button.prop('disabled', false);
          }
        });
      } else {
        $error.html('Password must be longer than four!').removeClass('hide');
      }
    },

    listen: function () {
      var self = this,
          element = this.element,
          resolveToken = this.resolveToken;

      var TST, TOUCH_TIMEOUT;
      element.on('touchstart.setpassword', '.pass', function () {
        if (TOUCH_TIMEOUT) {
          clearTimeout(TOUCH_TIMEOUT);
          TOUCH_TIMEOUT = void 0;
        }
        TST = now();
        var $input = $(this).prev();
        $input.prop('type', 'password');
      })
        .on('touchend.setpassword', '.pass', function (e) {
          // 0.3 minute
          if (now() - TST > 0.3 * 1000) {
            var $input = $(this).prev();
            $input.prop('type', 'text');
            // 0.5 minute
            TOUCH_TIMEOUT = setTimeout(function () {
              $input.prop('type', 'password');
            }, 500);
          }
          e.preventDefault();
          e.stopPropagation();
          return false;
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
        setTimeout(function () {
          window.scrollTo(0, 0);
        }, 0)
        var cb = function () {
          // error getting identity informations
          req.error = true;
          res.redirect('/');
        };
        element.removeClass('hide');
        $('#app-body').css('height', '100%');

        var user = Store.get('tmp-user');
        if (user) {
          $('.identity .avatar').attr('src', user.avatar_filename);
          $('.identity .name').html(user.name);
          if (window.noExfeApp) {
            $('.password').addClass('hide');
            $('.set-button').addClass('hide');
            $('.done-info').removeClass('hide');
          }
          App.controllers.footer.emit('reset-position');
          Store.remove('tmp-user');
          Store.remove('tmp-token');
          return;
        }

        $.ajax({
          type: 'POST',
          url: api_url + '/Users/' + resolveToken.user_id + '?token=' + resolveToken.token,
          data: { token : resolveToken.token },
          success: function (data) {
            var user = data.response.user;
            if (data && data.meta && data.meta.code === 200) {
              $('.identity .avatar').attr('src', user.avatar_filename);
              $('.identity .name').html(user.name);
              Store.set('tmp-user', user);
              App.controllers.footer.emit('reset-position');
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

        self.stopAnimate();

        // {{{
        self.emit('goto-live');
        // }}}
      })

      this.on('goto-live', function () {
        App.request.switchPageCallback = function () {
          element.addClass('hide');
        };
        App.response.redirect('/#live');
      });

      this.on('show', function (screen, error) {
        // set `logo` & `my-card` position
        var h = screen.height;
        this.$('.logo-box .inner').css('top', (h - 300) / 2 + 'px');
        element.removeClass('hide');
        MCP1[13] = (h - 64) / 2;
        this.setHomeCard(MCP1);

        error = !!(error && (error.code === 404));

        var $title = this.$('.title');
        /*
        $title.find('.normal').toggleClass('hide', error);
        $title.find('.invalid').toggleClass('hide', !error);
        */
        $title.find('.normal').removeClass('hide');
        if (error) {
          setTimeout(function () {
            alert('Sorry. Your link is invalid or expired. Requested page was not found.');
          }, 14)
        }

        // @note: 先隐藏掉 live 功能，等待功能完善
        this.$('#home-card').css('display', 'none');
        //this.startAnimate();
      });
    },

    setHomeCard: function (m4) {
      var liveCard = getLiveCard(), card = liveCard.card,
          name = card.name, avatar = card.avatar,
          $homeCard = this.$('#home-card');
      setCSSMatrix($homeCard[0], m4);
      if (card && (name || avatar)) {
        if (!avatar) {
          avatar = name ? (api_url + '/avatar/default?name=' + name) : '/static/img/portrait_default.png';
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
      $('#app-cross').remove();
      this.element.appendTo($('#app-body'));
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
              url: api_url + '/Identities/'+ cross.identity.id + '/Update' + '?token=' + token,
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
        url: api_url + '/Exfee/' + exfee_id + '/Rsvp?token=' + token,
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

        .on('touchend.live', '.live-form', function (e) {
          e.stopPropagation();
          if ($(e.target).hasClass('live-form')) {
            element.find('.input-item').blur();
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
        self.updateIdentityLi(this);
      })

      .on('touchstart.live', '.list .delete', function () {
        var input = $(this).prev()[0],
            v = trim(input.value),
            dp = input.getAttribute('data-provider'),
            isFacebook = dp === 'facebook',
            identity;

        if (isFacebook) {
          v += '@facebook';
        }

        identity = parseId(v);

        $(this).parent().remove();
        if (identity && identity.provider) {
          self.removeIdentity(identity);
        }

        if (isFacebook) {
          self.emit('show-add-facebook');
        }
      })

        .on('touchstart.live', '.btn-start', function () {
          var $inputs = $('.list .input-item');
          $inputs.each(function () {
            self.updateIdentityLi(this);
          });

          var cardName = document.getElementById('card-name');
          cardName.blur();
          var v = trim(cardName.value);
          if (v) {
            self.liveCard.card.name = v;
          } else {
            self.setCardName(cardName);
          }

          setTimeout(function () {
            if (self.inspectFields()) {
              self.emit('post-card');
              self.emit('live-gather');
            }
          }, 23)

          //}
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
              m[13] = y - 5;
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
        Live.startGeo();

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

        this.measurePositions(screen.width, screen.height - 10, 64 / 2,  64 / 2);
        this.MAPS = this._MAPS.slice(0);

        this.$('.identities .list').empty();
        this.liveCard = getLiveCard();
        this. updateMyCardForm();

        this.startAnimate();
      });

      this.on('post-card', function () {
        this.postMyCard();
      });

      this.on('disabled-live-btn', function (type) {
        this.$('.btn-start')
          .toggleClass('disabled', type);
          //.prop('disabled', type);
      });

      this.on('live-gather', function () {
        this.$('.live-form').addClass('hide');
        this.$('.live-gather').removeClass('hide');
        this.$('.wave').addClass('start');

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

    // 编辑 input, 后检查更新
    updateIdentityLi: function (elem) {
      var eun = elem.getAttribute('data-external-username'),
          p = elem.getAttribute('data-provider'),
          n = elem.getAttribute('data-name'),
          empty = '',
          v = trim(elem.value), delable = false, failed = false, addable = false, identity;

      if (v) {
        if (p === 'facebook') {
          v += '@facebook';
        }
        identity = parseId(v);
        if (identity && identity.provider) {
          var has = this.findIdentity(identity), isSelf = (identity.provider === p && identity.external_username === eun);
          if (has && !isSelf) {
            elem.value = empty;
          }
          if (!has && !isSelf) {
            addable = true;
            delable = true;
          }
        } else {
          failed = true;
          delable = true;
        }
      } else {
        failed = true;
        delable = true;
      }

      if (failed) {
        //elem.value = '';
        elem.setAttribute('data-name', empty);
        elem.setAttribute('data-external-username', empty);
        elem.setAttribute('data-provider', empty);
        setTimeout(function () {
          alert('Invalid contact.');
        }, 14);
      }

      if (addable) {
        elem.setAttribute('data-name', identity.name);
        elem.setAttribute('data-external-username', identity.external_username);
        elem.setAttribute('data-provider', identity.provider);
        elem.value = identity.external_username;
        $(elem).prev().text(this.aliasProvider(identity.provider));
        this.updateLiveCard(identity, '+');
      }

      if (delable) {
        this.updateLiveCard({
          name: n,
          external_username: eun,
          provider: p
        }, '-', true);
      }

      if (delable || addable) {
        this.emit('post-card');
      }
    },

    postContacts: function () {},

    inspectFields: function () {
      var card = this.liveCard.card;
      return card.name && card.identities.length;
    },

    updateCardName: function (card) {
      if (card.name) {
        this.liveCard.card.name = document.getElementById('card-name').value = card.name;
        Store.set('livecard', this.liveCard)
      }
    },

    updateMe: function (card) {
      var icard = document.getElementById('icard'), a0 = icard.getAttribute('data-url'), a1;
      if (a0 !== card.avatar) {
        a1 = card.avatar;
        if (!a1) {
          a1 = card.name ? (api_url + '/avatar/default?name=' + card.name) : '/static/img/portrait_default.png';
        }
        if (a0 !== a1) {
          icard.querySelector('.avatar').style.backgroundImage = 'url(' + a1 + ')';
          icard.setAttribute('data-url', a1);
        }
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
      if (card.name && card.identities.length) {
        Live.init(card, $.proxy(this.liveCallback, this));
      }
    },

    // 是否更新界面
    state: 1,

    liveCallback: function (result) {
      var liveCard = this.liveCard, myCard = result.me;
      // @todo: 检查时间 timestamp
      if (this.state === 1) {
        if (myCard
            && myCard.name
            && myCard.identities.length) {

          // 1 minute
          if (now() - myCard.timestamp > 60 * 1000) {
            this.updateCardName(myCard);
          }

          this.updateMe(liveCard.card = myCard);
          Store.set('livecard', liveCard);
        }
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
        this.updateCardName(card);
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
      this.emit('disabled-live-btn', true);
      Store.clear('livecard');
      this.liveCard = getLiveCard();
    },

    findIdentity: function (identity) {
      var card = this.liveCard.card,
          identities = card.identities,
          len = identities.length;
      if (len) {
        for (var i = 0; i < len; ++i) {
          var id = identities[i];
          if (id.provider === identity.provider
            && id.external_username === identity.external_username) {
            return true;
          }
        }
      }
      return false;
    },

    updateLiveCard: function (identity, operation, enable) {
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
        if (!enable && identities.length === 0) {
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

    aliasProvider: function (provider) {
      if (provider === 'email') {
        provider = 'Email';
      } else if (provider === 'phone') {
        provider = 'Mobile';
      } else if (provider === 'facebook') {
        provider = 'Facebook';
      }
      return provider;
    },

    genIdentity: function (identity) {
      var tmpl = Handlebars.compile($('#live-li-identity-tmpl').html()),
          provider = identity.provider;

      provider = this.aliasProvider(provider);

      var $li = $(
        tmpl({
          provider_alias: provider,
          identity: identity
        }
      ));
      return $li;
    },

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
    MAPS: ''.split(),
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

    genCard: function (card, pos, g, i, isMe, ios) {
      var tmpl = Handlebars.compile($('#live-card-tmpl').html()),
          m = M4.slice(0);
      m[12] = pos[0];
      m[13] = pos[1];

      var $card = $(
        tmpl({
          g: g,
          i: i,
          matrix: m.join(','),
          'class': (isMe ? 'card-me' : 'card-other hide') + (ios === 'iphone4' ? ' card-iphone4' : ''),
          card: card
        })
      );

      $card.data('card', card);
      return $card;
    },

    addCard: function (card) {
      var MAPS = this.MAPS;
      if (!MAPS || MAPS.length === 0) {
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
          elem.parentNode.removeChild(elem);
          TWEEN.remove(this);
        })
        .start();
    },

    updateCard: function (elem, card) {
      var a0 = elem.getAttribute('data-url'), a1 = '';
      if (!a0 || a0 !== card.avatar) {
        a1 = card.avatar;
        if (!a1) {
          a1 = card.name ? (api_url + '/avatar/default?name=' + card.name) : '/static/img/portrait_default.png';
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
        //.onComplete(function () {});
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

  var routexStream = require('routexstream')
    , geoService = routexStream.geoService;

  exports.RouteXController = Controller.extend({


      init: function () {
        this.render();
        this.listen();
      }

    , render: function () {
        $('#app-routex').remove();
        this.element.appendTo($('#app-container'));
        this.loadMaps();
      }

    , listen: function () {
        var self = this
          , element = self.element
          , $win = $(window)
          , $infoWins = self.$('#info-wins')
          , $openExfe = self.$('#open-exfe')
          , $locate = self.$('#locate')
          , isScroll = false;

        // 监听横竖屏切换
        $win.on('orientationchange', function () {
          var height = $win.height()
            , width = $win.width();

          $locate.css('-webkit-transform', 'translate3d(0, 0, 0)');
          $openExfe.css('-webkit-transform', 'translate3d(0, 0, 0)');
          $('#identities').css('max-height', Math.round(height / 60) * 60 - 60 - 100 + 5);
          //http://stackoverflow.com/questions/2740857/ipad-doesnt-trigger-resize-event-going-from-vertical-to-horizontal
          //https://gist.github.com/callmephilip/3626669
          //http://stackoverflow.com/questions/1207008/how-do-i-lock-the-orientation-to-portrait-mode-in-a-iphone-web-application
          // $locate.css('-webkit-transform', 'translate3d(-10px, ' + (height - (32 + 10)) + 'px, 0)');
        });

        var gotoGPS = function (e, showBreadcrumbs) {
          var status = self.checkGPSStyle();
          if (self.mapReadyStatus) {
            var uid = self.mapController.myuid;
            showBreadcrumbs && self.mapController.showBreadcrumbs(uid);
            self.mapController.fitBoundsWithDestination(uid);
          }
          if (2 === status) {
          } else if (1 === status) {
            self.startStream();
          }
        };
        element.on('tap.maps', function (e) {
          if (self.tapElement
            && e.target !== self.tapElement
            && !$.contains($infoWins[0], e.target)) {
              $infoWins.addClass('hide');
              self.tapElement = null;
          }
        });
        element.on('tap.maps', '#locate', gotoGPS);
        element.on('touchstart.maps', '#isme .avatar', function (e) {
          gotoGPS(e, true);

          if (self.tapElement === this) {
            $infoWins.addClass('hide');
            self.tapElement = null;
            return false;
          }

          if ($infoWins.hasClass('hide')) {
            $infoWins.removeClass('hide');
          }

          $infoWins.find('#other-info').addClass('hide');
          $infoWins.find('#my-info').removeClass('hide');
          $infoWins.css('-webkit-transform', 'translate3d(50px, 6px, 0)');
          self.tapElement = this;
        });

        element.on('tap.maps', '#identities .avatar', function (e) {
          if (isScroll) { return; }
          var $that = $(this)
            , $d = $that.parent().parent()
            , uid = $d.data('uid');

          if (self.mapReadyStatus) {
            self.mapController.showBreadcrumbs(uid);
            self.mapController.fitBoundsWithDestination(uid);
          }

          if (self.tapElement === this) {
            $infoWins.addClass('hide');
            self.tapElement = null;
            return false;
          }

          if ($infoWins.hasClass('hide')) {
            $infoWins.removeClass('hide');
          }
          $infoWins.find('#my-info').addClass('hide');
          $infoWins.find('#other-info').removeClass('hide');
          var bound = this.getBoundingClientRect();
          $infoWins.css('-webkit-transform', 'translate3d(50px,' + (bound.top + bound.height / 2 - 62.5)  + 'px, 0)');
          self.tapElement = this;
        });

        element.on('tap.maps', '#open-exfe', function (e) {
          console.log('remove cats...');
          Store.remove('cats');
          Store.remove('offset-latlng');
        });

        var tapDelay = 270, tapTimeout, now;
        element.on('touchstart.maps', '#free-identities .identities li', function (e) {
          var $that = $(this)
            , id = $that.data('identity-id')
            , uid = $that.data('uid')
            , free = $that.data('free')
            , touched = !!$that.hasClass('touched')
            , c = true;
          now = Date.now();
          tapTimeout = setTimeout(function () {
            $('#iavatar .avatar').css('background', 'url(' + $that.find('.avatar').attr('src') + ')');
          }, tapDelay);
        });

        element.on('touchmove.maps', '#free-identities .identities li', function (e) {
          clearTimeout(tapTimeout); tapTimeout = null;
        });

        element.on('touchend.maps', '#free-identities .identities li', function (e) {
          clearTimeout(tapTimeout); tapTimeout = null;
          if (Date.now() - now > 1000) {
            $(this).trigger('select:maps');
          } else {
            $('#iavatar .avatar').css('background', '');
          }
        });

        element.on('select:maps', '#free-identities .identities li', function (e) {
          var $that = $(this)
            , id = $that.data('identity-id')
            , uid = $that.data('uid')
            , free = $that.data('free')
            , touched = !!$that.hasClass('touched')
            , c = true;

          if (touched) { return; }

          if (free) {
            c = confirm('确认您的身份\n您刚拖入的头像已经被认领过， \n您确定没有拖错自己的头像？');
          }

          if (c) {

            $that.addClass('touched');
            $.ajax({
                type: 'get'
              , url: api_url + '/crosses/' + self.cross.id + '/freeidentities/' + id + '/itsme?token=' + self.token
              , beforeSend: function () {console.log('itsme before')}
              , complete: function () { $that.removeClass('touched'); }
              , success: function (data) {
                  var code = data.meta && data.meta.code;
                  if (200 === code) {
                    console.log('success')
                    console.dir(data)
                    var cats = Store.get('cats') || {};
                    cats[self.ctoken] = data.response.cross_access_token;
                    self.myIdentityId = id;
                    self.myuid = uid;
                    Store.set('cats', cats);

                    self.$('#free-identities').hide().empty();
                    self.createIdentitiesList();
                    self.streaming();
                  }
                }
              , error: function (data) {
                  console.log('fail')
                  console.dir(data)
                }
            });

          }

        });

        var $identities = element.find('#identities');

        $identities.on('scroll.maps', function (e) {
          if (!$infoWins.hasClass('hide')) {
            $infoWins.addClass('hide');
          }
          var $avatars = $(this).find('.avatar')
            , pb = this.getBoundingClientRect()
            , height = pb.height
            , scrollTop = this.scrollTop
            , minT = pb.top
            , maxT = height + minT
            , ids =  this._ids = {};

          $avatars.each(function (i) {
            var bound = this.getBoundingClientRect()
              , uid = $(this).parents('.identity').data('uid')
              // , l = bound.left + bound.width
              , t = bound.height / 2 + bound.top;
            if (minT <= t &&  t <= maxT) {
              ids[uid] = [i, 46, t];
            }
          });

          if (self.mapReadyStatus && self.mapController) {
            self.mapController.contains();
          }
          console.dir(ids);
        });

        element.on('touchmove.maps', '#identities-overlay', function (e) {
          e.stopPropagation();
          e.preventDefault();
        });

        element.on('touchmove', '.info-windown', function (e) {
          e.preventDefault();
        });

        var pageY = 0, scrollTop = 0, _t;
        $identities.on('touchstart.maps', function (e) {
          isScroll = false;
          pageY = e.pageY;
          scrollTop = this.scrollTop;
        });
        $identities.on('touchend.maps', function (e) {
          if (_t) clearTimeout(_t);
          _t = setTimeout(function () {
            isScroll = false;
          }, 233);
        });
        $identities.on('touchmove.maps', function (e) {
          isScroll = true;
          e.preventDefault();
          this.scrollTop = (pageY - e.pageY) + scrollTop;
        });

        self.on('show', function () {
          $('html, body').css({
              'min-height': $win.height()
            //, 'overflow': 'hidden'
          });

          console.log('This is Smith-Token.', self.isSmithToken);

          // 身份认领
          if (self.isSmithToken) {
            element.find('#free-identities').removeClass('hide');
            self.getFreeIdentities();
          } else {
            self.createIdentitiesList();
            self.streaming();
          }

          $win.trigger('orientationchange');
        });

      }

    , updateExfeeName: function () {
        this.element.find('#exfee-name').text(this.cross.exfee.name);
      }

    , createFreeIdentitiesList: function (identities) {
        var tmp ='<li data-identity-id="{{id}}" data-free="{{free}}" data-uid="{{external_username}}@{{provider}}"><img src="{{avatar_filename}}" alt="" class="avatar{{is_free}}" /><div class="name">{{external_username}}</div></li>'
          , $identities = this.element.find('#free-identities .identities')
          , identity;

        identities = identities.slice(0);
        while ((identity = identities.shift())) {
          $identities.append(
            tmp
              .replace('{{id}}', identity.id)
              .replace('{{avatar_filename}}', identity.avatar_filename)
              .replace(/\{\{external_username\}\}/g, identity.external_username)
              .replace('{{provider}}', identity.provider)
              .replace('{{is_free}}', (identity.free ? ' ': ' no-') + 'free')
              .replace('{{free}}', identity.free)
          );
        }
      }

    , getFreeIdentities: function () {
        this.updateExfeeName();
        this.createFreeIdentitiesList(this.freeIdentities);
      }

    , loadMaps: function (p) {
        var self = this
          , RoutexMaps = require('routexmaps')
          , mc = this.mapController = new RoutexMaps({
              // production use `key`
              //url: '//ditu.google.cn/maps/api/js?sensor=true&language=zh_CN&v=3&callback=_loadmaps_'
              url: '//maps.googleapis.com/maps/api/js?sensor=false&language=zh_CN&v=3&callback=_loadmaps_'
            , mapDiv: this.$('#map')[0]
            , mapOptions: {
                zoom: 5
              }
            , svg: this.$('#svg')[0]
            , callback: function (map) {
                self.mapReadyStatus = true;
                self.mapController.updateGeoLocation(null);
              }
        });
        mc.myuid = this.myuid;
        this.setLatLngOffset();
        // defaults to true
        mc.tracking = true
        mc.load();
      }

    , mapReadyStatus: false

    , setLatLngOffset: function () {
        var offset = Store.get('offset-latlng');
        if (offset) {
          this.mapController.latOffset = offset.earth_to_mars_latitude * 1;
          this.mapController.lngOffset = offset.earth_to_mars_longitude * 1;
        }
      }

    , streaming: function () {
        var self = this;
        this.initStream();
        this.startStream();
        console.log('start streaming');
        console.log('start monit')
        this.timer = setInterval(function () {
          if (self.mapReadyStatus) {
            console.log(new Date());
            self.mapController.monit();
          }
        }, 1000);
      }

    , initStream: function () {
        var self = this;
        routexStream.init(
            self.cross.id
          , self.token
          , function (type, result) {
              if (self.mapReadyStatus && self.mapController) {
                self.setLatLngOffset();
                self.mapController.myuid = self.myuid;
                self.mapController.draw(type, result);
              }
            }
          , function (e) {
              console.log(e);
            }
        );
      }

    , startStream: function () {
        var self = this;
        self.switchGPSStyle(0);
        routexStream.stopGeo();
        routexStream.startGeo(
            function (r) {
              self.position = r;
              Store.set('last-latlng', { lat: r.latitude + '',  lng: r.longitude + '', timestamp: r.timestamp });
              self.switchGPSStyle(2);
              self.trackGeoLocation();
              console.log('GPS', r.latitude, r.longitude);
            }
          , function (r) {
              self.switchGPSStyle(1);
              console.log(r.status, r);
              routexStream.stopGeo();

              if (self.mapController) {
                self.mapController.switchGEOStyle(0);
              }
            }
        );
      }

    , checkGPSStyle: function () {
        return ~~this.$('#locate').attr('data-status');
      }

      // status: 0 - load, 1 - fail-grey, 2 - succes - blue
    , switchGPSStyle: function (status, c) {
        if (0 === status) {
          c = 'load';
        } else if (1 === status) {
          c = 'grey';
        } else {
          status = 2;
          c = 'blue';
        }
        this.$('#locate').removeClass().addClass(c).attr('data-status', status);;
      }

    , trackGeoLocation: function () {
        var mapController = this.mapController
          , position = this.position
          , mapReadyStatus = this.mapReadyStatus;
        if (mapReadyStatus && mapController) {
          console.log('tracking');
          this.setLatLngOffset();
          mapController.updateGeoLocation(this.myuid, position);
        }
      }

    , updateMe: function (myIdentity) {
        this.myIdentity = myIdentity;
        var div = this.$('#isme');
        div.attr('data-uid', myIdentity.external_username + '@' + myIdentity.provider);
        div.find('img').attr('src', myIdentity.avatar_filename);
      }

    , createIdentitiesList: function () {
        var exfee = this.cross.exfee
          , $identities = this.$('#identities')
          , myIdentityId = this.myIdentityId
          , invitations = exfee.invitations.slice(0)
          , invitation
          , identity;

        console.dir(exfee);

        while ((invitation = invitations.shift())) {
          identity = invitation.identity;
          if (myIdentityId === identity.id) {
            this.myuid = identity.external_username + '@' + identity.provider;
            this.updateMe(identity);
            continue;
          }
          var div = $('<div class="identity"><div class="abg"><img src="" alt="" class="avatar"></div><div class="detial"><i class="icon icon-dot-grey"></i><span class="distance">方位？</span></div></div>')
          div.attr('data-uid', identity.external_username + '@' + identity.provider);
          div.find('img').attr('src', identity.avatar_filename);
          $identities.append(div);
        }
        window.getComputedStyle($identities[0]).webkitTransform;
        $identities.parent().css('-webkit-transform', 'translate3d(0, 0, 0)');

        console.log('trigger handler scroll.maps')
        $('#identities').triggerHandler('scroll');
      }

  });

});
