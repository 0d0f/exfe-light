define('mobilecontroller', function (require, exports, module) {
  'use strict';

  var Base = require('base'),
      Store = require('store'),
      TWEEN = require('tween'),
      _ENV_ = window._ENV_,
      api_url = _ENV_.api_url,
      apiv3_url = _ENV_.apiv3_url,
      app_scheme = _ENV_.app_scheme,
      app_prefix_url = app_scheme + ':///',
      AMAP_KEY = _ENV_.AMAP_KEY,
      openExfe = window.openExfe,
      Handlebars = require('handlebars'),

      $ = require('zepto'),

      Chrome = navigator.userAgent.match(/Chrome\/([\d.]+)/),

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

        var user_id = resolveToken.user_id
          , token = resolveToken.token
          , username = resolveToken.name || '';
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
                    var args = '?token=' + token + '&user_id=' + user_id + '&username=' + username + '&identity_id=' + identity.id;
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
          $name = this.$('.identity .name'),
          $pass = this.$('#password'),
          name = trim($name.text()),
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
              var auth = data.response.authorization;
              if (auth) {
                App.controllers.footer.emit('redirect', '?token=' + auth.token + '&user_id=' + auth.user_id + '&username=' + (auth.name || ''), function () {
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
          , $myInfo = self.$('#my-info')
          , $openExfe = self.$('#open-exfe')
          , $locate = self.$('#locate')
          , isScroll = false
          , isScroll0 = false;

        // 监听横竖屏切换
        $win.on('orientationchange', function () {
          var height = $win.height()
            , width = $win.width();

          $locate.css('-webkit-transform', 'translate3d(0, 0, 0)');
          $openExfe.css('-webkit-transform', 'translate3d(0, 0, 0)');
          $('#identities').css('max-height', Math.floor(height / 60) * 60 - 95);
          //http://stackoverflow.com/questions/2740857/ipad-doesnt-trigger-resize-event-going-from-vertical-to-horizontal
          //https://gist.github.com/callmephilip/3626669
          //http://stackoverflow.com/questions/1207008/how-do-i-lock-the-orientation-to-portrait-mode-in-a-iphone-web-application

          $('#identities').triggerHandler('scroll');
        });

        element.on('touchstart.maps', '#turn-on', function (e) {
          self.streaming();
          $('#privacy-dialog').addClass('hide');
        });

        var gotoGPS = function (e, showBreadcrumbs) {
          var status = self.checkGPSStyle();
          if (self.mapReadyStatus) {
            var uid = self.mapController.myUserId;
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
            && !$.contains($myInfo[0], e.target)) {
              $myInfo.addClass('hide');
              self.tapElement = null;
          }
        });
        element.on('tap.maps', '#locate', gotoGPS);
        element.on('touchstart.maps', '#isme .avatar', function (e) {
          gotoGPS(e, true);

          /*
          if (self.tapElement === this) {
            $myInfo.addClass('hide');
            self.tapElement = null;
            return false;
          }

          if ($myInfo.hasClass('hide')) {
            $myInfo.removeClass('hide');
          }

          $myInfo.css('-webkit-transform', 'translate3d(50px, 6px, 233px)');
          */
          //$('#wechat-guide').removeClass('hide');
          self.checkFollowing();
          self.tapElement = this;
        });

        element.on('touchstart.maps', '#wechat-guide', function (e) {
          $(this).addClass('hide');
        });

        element.on('touchstart.maps', '#wechat-share', function (e) {
          var $t = $(this)
            , ele = e.target;
          if (!$.contains($t.find('.ibox')[0], ele)) {
            //$t.find('.share-input')[0].removeAttribute('contentEditable');
            $t.find('.share-input').blur();
            $t.addClass('hide');
          }
        });

        element.on('tap.maps', '#nearby .place-marker', function (e) {
          if (isScroll0) { return; }
          e.preventDefault();
          if (self.mapReadyStatus) {
            var id = $(this).data('id'), marker;
            self.mapController.showPlacePanel(id);
          }
        });

        element.on('tap.maps', '#nearby .geo-marker', function (e) {
          if (isScroll0) { return; }
          e.preventDefault();
          if (self.mapReadyStatus) {
            var uid = $(this).data('uid');
            self.mapController.showIdentityPanel(uid);
          }
        });

        element.on('touchstart.maps', '.open-app', function () {
          self.openEXFE();
        });

        element.on('touchstart.maps', '#other-info .please-update', function (e) {
          var $t = $(this)
            , status = $t.hasClass('disable');
          if (status) { return; }
          //var external_username = $t.attr('data-external-username')
          // , provider = $t.attr('data-provider')
          var enu = $t.attr('data-enu')
            , name = $t.attr('data-name')
            , enus = ($t.attr('data-notification-identities') || '').split(' ')
            , $loading = $t.find('.loading')
            , isWechat;
          $t.addClass('disable');
          $loading.css('display', 'block');
          $.ajax({
              type: 'POST'
            , url: apiv3_url + '/routex/notification/crosses/' + self.cross_id + '?id=' + enu + '&token=' + self.token
            , success : function () {}
            , error   : function (xhr) {
                var code = xhr.status;
                switch (code) {
                case 406:
                  enus.unshift(enu);

                  while ((enu = enus.shift())) {
                    if ((isWechat = /\@wechat$/.test(enu))) {
                      break;
                    }
                  }

                  if (isWechat) {
                    var $ws = $('#wechat-share')
                      , $input = $ws.find('.share-input')
                      , input = $input[0]
                      , text = '@' + name + ' 你在哪？打开这个网页就能在“活点地图”里互相看到方位。';

                    $ws.removeClass('hide');
                    input.value = text;
                    window.setTimeout(function () {
                      input.focus();
                      /*
                      var sel = window.getSelection()
                        , range = document.createRange();
                      range.setStart(input.firstChild, 0);
                      range.setEnd(input.firstChild, text.length);
                      sel.removeAllRanges();
                      sel.addRange(range);
                      */
                      input.selectionStart = 0;
                      input.selectionEnd = text.length;
                      //i.setSelectionRange(0, text.length);
                    }, 500);
                  } else {
                    alert("通知失败\n无法立刻通知对方更新方位。\n请尝试用其它方式联系对方。");
                  }
                  break;
                case 401:
                case 403:
                }
              }
            , complete: function () { $t.removeClass('disable'); $loading.css('display', 'none'); }
          });
          //$t.parent().addClass('hide');
        });

        element.on('touchstart.maps', '#my-info .discover', function (e) {
          $myInfo.addClass('hide');
          self.tapElement = null;
        });

        element.on('tap.maps', '#identities .abg', function (e) {
          if (isScroll) { return; }
          var $that = $(this)
            , $d = $that.parent()
            , $n = $that.next()
            , uid = $d.data('uid');

          if ($n.hasClass('unknown')) {
            self.mapController.showIdentityPanel(uid, $d[0].getBoundingClientRect());
            return;
          }

          if (self.mapReadyStatus) {
            self.mapController.showBreadcrumbs(uid);
            self.mapController.fitBoundsWithDestination(uid);
          }
        });

        element.on('tap.maps', '#open-exfe', function (e) {
          var aboutCont = new WechatAboutRoutexController({
              options: {
                template: $('#wechat-about-tmpl').html()
              }
            , cross_id: self.cross_id
            , token: self.token
          });
          aboutCont.emit('show');
        });

        var pageY0 = 0, scrollTop0 = 0, _t0;
        element.on('touchstart.maps', '#nearby', function (e) {
          isScroll0 = false;
          pageY0 = e.originalEvent.touches[0].pageY;
          scrollTop0 = this.scrollTop;
        });
        element.on('touchend.maps', '#nearby', function (e) {
          if (_t0) clearTimeout(_t0);
          _t = setTimeout(function () {
            isScroll0 = false;
          }, 233);
        });
        element.on('touchmove.maps', '#nearby', function (e) {
          isScroll0 = true;
          e.preventDefault();
          this.scrollTop = (pageY0 - e.originalEvent.touches[0].pageY) + scrollTop0;
        });

        var $identities = element.find('#identities');

        $identities.on('scroll.maps', function (e) {
          if (!$myInfo.hasClass('hide')) {
            $myInfo.addClass('hide');
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
          Debugger.log(pb, ids);
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
          if (self.mapReadyStatus) {
            self.mapController.hideMapPanel();
          }
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

          Debugger.log('This is Smith-Token.', self.isSmithToken);

          $win.trigger('orientationchange');

          self.createIdentitiesList();
          //self.streaming();
          self.checkRouteXStatus();
        });

      }

    , openEXFE: function () {
        var cross_id = this.cross_id;
        window.location.href = '/toapp?authenticate' + (cross_id ? ('&cross_id=' + cross_id) : '');
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

    , loadMaps: function (p) {
        var protocol = !Chrome ? 'http://' : 'https://';
        var self = this
          , RoutexMaps = require('routexmaps')
          , mc = this.mapController = new RoutexMaps({
              protocol: protocol
            // In Chrome, block http while the site is https.
            , url: protocol + 'ditu.google.cn/maps/api/js?key=' + window._ENV_.MAP_KEY + '&sensor=false&language=zh_CN&v=3&callback=_loadmaps_'
              //url: '//maps.googleapis.com/maps/api/js?sensor=false&language=zh_CN&v=3&callback=_loadmaps_'
            , mapDiv: document.getElementById('map')
            , mapOptions: {
                zoom: 5
              }
            , canvas: document.getElementById('canvas')
            , callback: function (map) {
                self.mapReadyStatus = true;
                self.mapController.updateGeoLocation(mc.myUserId, self.position);
              }
        });
        mc.myUserId = this.myUserId;
        mc.myIdentity = this.myIdentity;
        this.setLatLngOffset();
        // defaults to true
        mc.tracking = true;
        this.START_TIME = now();
        mc.load();
        mc.controller = self;

        if (this.token && this.cross_id) {
          $.ajax({
              url: apiv3_url + '/routex/breadcrumbs/crosses/' + this.cross_id + '?coordinate=mars&token=' + this.token
            , type: 'GET'
            , dataType: 'json'
            , success: function (data) {
                var len = data && data.length;
                if (len) {
                  var d, id, i;
                  for (i = 0; i < len; ++i) {
                    d = data[i];
                    id = d.id.split('.')[1];
                    if (mc._breadcrumbs[id]) {
                      var arr = [];
                      mc._breadcrumbs[id].positions = arr.contact(mc._breadcrumbs[id].positions, d.positions);
                    } else {
                      mc._breadcrumbs[id] = d;
                    }
                    mc.updated[id] = mc._breadcrumbs[id].positions[0];
                  }
                }
              }
            //, error: function () { }
          });
        }

      }

    , mapReadyStatus: false

    , editPlace: function (place) {
        // 等待 google 修复
        if (place) {
          $.ajax({
              type: 'POST'
            , url: apiv3_url + '/routex/geomarks/crosses/' + this.cross_id + '/location/' + place.id + '?coordinate=mars&token=' + this.token + '&_method=PUT'
            , data: JSON.stringify(place)
            , success: function () {}
            , error: function () {}
          });
        }
      }

    , setLatLngOffset: function () {
        var offset = Store.get('offset-latlng');
        if (offset) {
          this.mapController.setOffset(offset);
        }
      }

    , stopStream: function () {
        routexStream.stop();
      }

    , turnOnTrack: function () {
        // 开启跟踪
        if (this.cross_id && this.token) {
          var data = {
              save_breadcrumbs: true
            , after_in_seconds: 3600
          };
          $.ajax({
              type: 'POST'
            , url: apiv3_url + '/routex/users/crosses/' + this.cross_id + '?token=' + this.token
            , data: JSON.stringify(data)
            , success: function () {}
            , error: function () {}
          });
        }
      }

    , checkFollowing: function () {
        if (this.checkFollowingStatus) { return; }
        var self = this;
        var enu = '';

        if (this.myIdentity.provider === 'wechat') {
          enu = this.myIdentity.external_username + '@wechat';
        } else if (this.notification_identities.length) {
          var identities = this.notification_identities.slice(0)
            , i, identity;
          while ((identity = identities.shift())) {
            i = parseId(identity);
            if (i.provider === 'wechat') {
              enu = i.external_username + '@wechat';
              break;
            }
          }
        }

        if (enu) {
          this.checkFollowingStatus = 1;
          $.ajax({
              url: api_url + '/identities/checkfollowing?token=' + this.token + '&identity_id=' + enu
            , timeout: 5000
            , success: function (data) {
                if (data.meta.code === 200) {
                  var following = data.response.following;
                  if (!following) {
                    $('#wechat-guide').removeClass('hide');
                  }
                }
              }
            , complete: function () { self.checkFollowingStatus = 0; }
            //, error: function (data) {}
          });
        }
      }

    , checkRouteXStatus: function () {
        var c = true, routexWidget;
        for (var i = 0, len = this.cross.widget.length; i < len; ++i) {
          var w = this.cross.widget[i];
          if (w.type === 'routex') {
            routexWidget = w;
            break;
          }
        }
        if (!routexWidget || (routexWidget && routexWidget.my_status === null)) {
          c = confirm('开启这张活点地图\n这张“活点地图”将会展现您\n未来1小时内的方位。')
        }

        if (c) {
          this.checkFollowing();
          this.streaming();
        // 显示提醒文字
        } else {
          $('#privacy-dialog').removeClass('hide');
        }
      }

    , streaming: function () {
        var self = this;
        this.initStream();
        this.startStream();
        Debugger.log('start streaming');
        Debugger.log('start monit')
        this.timer = setInterval(function () {
          if (self.mapReadyStatus) {
            Debugger.log(new Date());
            self.mapController.monit();
          }
        }, 1000);

        this.readystatuschange = setInterval(function () {
          var t = 1000 * 2;
          if (Debugger) { t = 250 * 2; }
          if (now() - self.START_TIME > t && !self.mapReadyStatus) {
            clearInterval(self.timer);
            // kill maps

            self.initStaticMap();
            clearInterval(this.readystatuschange);
            return;
          }
          if (self.mapReadyStatus) {
            clearInterval(this.readystatuschange);
          }
        }, 233);
      }

    , initStaticMap: function () {
        this.isStaticMap = true;
        var map = document.getElementById('static-map');
        var img = document.createElement('img');
        var site = 'site=' + $(window).width() + 'x' + $(window).height();
        var url = 'http://maps.googleapis.com/maps/api/staticmap?' + site;
        if (this.position) {
          var center = 'center=' + this.position.latitude + ',' + this.position.longitude;
          url += '&' + center;
        }
        img.src = url;
        map.appendChild(img);
      }

    , _cache: []
    , streamingInitEnd: false

    , initStream: function () {
        var self = this
          , _cache = this._cache;
        routexStream.init(
            self.cross.id
          , self.token
          , function (result) {

              if (self.mapController) {
                if (!self.mapController.myUserId) {
                  self.mapController.myUserId = self.myUserId;
                }
                if (!self.mapController.myIdentity) {
                  self.mapController.myIdentity = self.myIdentity;
                }
              }
              if (self.mapReadyStatus && !self.isStaticMap) {
                if (_cache.length) {
                  var c;
                  while((c = _cache.shift())) {
                    self.mapController.draw(c);
                  }
                }
                self.mapController.draw(result);
              } else if (self.isStaticMap) {
                if (result.type === 'command' && result.action === 'init_end') {
                  self.streamingInitEnd = true;
                }
              } else {
                _cache.push(result);
              }
            }
          , function (e) {
              Debugger.log(e);
            }
          // updateGPS
          , function () {
              self.trackGeoLocation();
            }
          , function () {
              /*
              if (self.mapReadyStatus) {
                self.mapController.clearup();
              }
              */
            }
        );
      }

    , startStream: function () {
        var self = this;
        self.switchGPSStyle(0);
        routexStream.stopGeo();
        routexStream.startGeo(
            function (r) {
              //self.position = { lat: r.latitude + '',  lng: r.longitude + '', ts: r.timestamp, acc: r.accuracy };
              self.position = { gps: [ r.latitude + '',  r.longitude + '', r.accuracy], t: r.timestamp };
              Store.set('position', self.position);
              self.switchGPSStyle(2);
              self.trackGeoLocation();
            }
          , function (r) {
              if (1 === r.code) {
                $('#privacy-dialog').removeClass('hide');
                return;
              }

              self.switchGPSStyle(1);
              Debugger.log(r.status, r);
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
          Debugger.log('tracking');
          this.setLatLngOffset();
          mapController.updateGeoLocation(this.myUserId, position);
        }
      }

    , getExfee: function () {
        var self = this
          , cross = this.cross;
        $.ajax({
            type: 'GET'
          , url: api_url +  '/exfee/' + this.cross.exfee.id + '?token=' + this.token
          , success: function (data) {
              if (data && data.meta && data.meta.code === 200) {
                cross.exfee = data.response.exfee;
                self.createIdentitiesList();
              }
            }
          , error: function () {}
        })
      }

    , updateMe: function (myIdentity) {
        this.myIdentity = myIdentity;
        Debugger.log('my identity', this.myIdentity);
        var div = this.$('#isme');
        div.attr('data-uid', myIdentity.connected_user_id);
        div.attr('data-name', myIdentity.name);
        div.find('img').attr('src', myIdentity.avatar_filename);
        div.data('identity', myIdentity);
      }

    , updateNotifyProvider: function (euns) {
        if (euns.length) {
          var eun, identity;
          while ((eun = euns.shift())) {
            identity = parseId(eun);
            if (identity && (identity.provider === 'phone' || identity.provider === 'email')) {
              $('#notify-provider').val(identity.external_username);
              break;
            }
          }
        }
      }

    , createIdentitiesList: function () {
        var exfee = this.cross.exfee
          , $identities = this.$('#identities')
          , myUserId = this.myUserId
          , myIdentityId = this.myIdentityId
          , smith_id = this.smith_id
          , invitations = exfee.invitations.slice(0)
          , invitation
          , identity;

        $identities.empty();

        while ((invitation = invitations.shift())) {
          identity = invitation.identity;
          identity.notification_identities = invitation.notification_identities.slice(0);
          if (smith_id === identity.id) { continue; }
          if (myUserId === identity.connected_user_id) {
            this.myUserId = identity.connected_user_id;
            this.myIdentityId = identity.id;
            this.updateMe(identity);
            this.notification_identities = invitation.notification_identities.slice(0);
            this.updateNotifyProvider(this.notification_identities);
            continue;
          }
          var div = $('<div class="identity"><div class="abg"><img src="" alt="" class="avatar"/><div class="avatar-wrapper"></div></div><div class="detial unknown"><i class="icon icon-dot-grey"></i><span class="distance">方位未知</span></div></div>')
          div.attr('data-uid', identity.connected_user_id);
          div.attr('data-name', identity.name);
          div.find('img').attr('src', identity.avatar_filename);
          $identities.append(div);
          div.data('identity', identity);
        }
        window.getComputedStyle($identities[0]).webkitTransform;
        $identities.parent().css('-webkit-transform', 'translate3d(0, 0, 0)');

        Debugger.log('trigger handler scroll.maps');
        $('#identities').triggerHandler('scroll');
      }

  });

  // `Wechat About Routex` controller
  var WechatAboutRoutexController = exports.WechatAboutRoutexController = Controller.extend({

      init: function () {
        this.render();
        this.listen();
      }

    , render: function () {
        $('#shuidi-dialog').remove();
        this.element.appendTo($('#app-container'));

        if (!this.cross_id) {
          this.element.addClass('nobg');
        }
      }

    , listen: function () {
        var self = this
          , element = this.element
          , cross_id = this.cross_id;

        if (cross_id) {
          element.on('tap.maps', function (e) {
            if (e.target.id === 'shuidi-dialog') {
              e.stopPropagation();
              self.destory();
              element.remove();
            }
          });

          element.on('scroll.maps', function (e) {
            if (this.scrollTop <= 0) {
              self.destory();
              element.remove();
            }
          });
        }

        element.on('touchstart.maps', '.app-btn', function (e) {
          e.preventDefault();
          self.openEXFE();
          return false;
        });

        element.on('touchstart.maps', '.notify-frame .email', function (e) {
          e.stopPropagation();
        });

        element.on('touchstart.maps', '.notify-ok', function (e) {
          e.stopPropagation();
          self.addIdentity(element.find('#notify-provider').val());
          if (cross_id) {
            self.destory();
            element.remove();
          }
          return false;
        });

        element.on('touchstart.maps', '#cleanup-cache', function (e) {
          e.stopPropagation();
          Store.clear();
          window.location.href = window.location.href;
          return false;
        });

        self.on('show', function () {
          if (cross_id) {
            var h = $(window).height()
              , top;
            top = h - 380;
            if (top > 100) { top = 100; }
            else if (top < 0) { top = 5; }
            element
              .find('.main')
              .css('top', (top + 50) + 'px');
            element.prop('scrollTop', top);
          }
        });
      }

    , openEXFE: function () {
        var cross_id = this.cross_id;
        window.location.href = '/toapp?authenticate' + (cross_id ? ('&cross_id=' + cross_id) : '');
      }

    , addIdentity: function (email, token) {
        token = this.token;
        var identity = parseId(email);
        if (identity && identity.provider !== 'email' && identity.provider !== 'phone') {
          $('#notify-provider.email').attr('placeholder', '请输入正确的手机号或电子邮件。');
          return;
        }
        $.ajax({
          type: 'POST',
          url: api_url + '/users/addIdentity' + '?token=' + token,
          data: {
            provider: identity.provider,
            external_username: identity.external_username
          },
          success : function(data) {
            /*
            if (data && data.meta && data.meta.code === 200) {
            }
            */
          },
          error   : function() {
            alert('Failed, please retry later.');
          }
        });
      }

  });

});
