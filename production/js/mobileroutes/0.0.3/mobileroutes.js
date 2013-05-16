/*jshint -W030*/
define('mobileroutes', function (require, exports, module) {
  'use strict';

  var Store = require('store'),
      Handlebars = require('handlebars'),
      humantime = require('humantime'),

      _ENV_ = window._ENV_,

      renderCrossTime = function(crossTime) {
        var dspTime   = humantime.printEFTime(crossTime, 'X');
        return dspTime;
      };

  var Controllers = require('mobilecontroller'),
      HomeController = Controllers.HomeController,
      SetPasswordController = Controllers.SetPasswordController,
      VerifyController = Controllers.VerifyController,
      CrossController = Controllers.CrossController,
      LiveController = Controllers.LiveController;

  var showCross = function (req, res, data, cats, ctoken, token) {
      cats || (cats = {});
      $.ajax({
        type: 'POST',
        url: _ENV_.api_url + '/Crosses/GetCrossByInvitationToken',
        data: data,
        success: function (data) {
          var meta = data.meta,
              code = meta && meta.code;

          if (code && code === 200) {
            var response = data.response;
            var originCross = response.cross;
            var cross = {
              id: originCross.id,
              title: originCross.title,
              description: originCross.description.replace(/\r\n|\r|\n/g, '<br />'),
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
              cross.time.tobe = 'tobe';
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
            } else {
              cross.place.tobe = 'tobe';
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
                invitation.identity.isphone = invitation.identity.provider === 'phone';
                cross.identity = invitation.identity;
                orderRSVP.ACCEPTED.unshift(invitation);
              } else {
                //invitations.push(invitation);
                if (invitation.rsvp_status in orderRSVP) {
                  orderRSVP[invitation.rsvp_status].push(invitation);
                }
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
            len = invitations.length;
            var j = 0;
            while (j < len) {
              cross.invitations.push(invitations.splice(0, 5));
              j += 5;
            }
            len = cross.invitations.length;
            var invs = cross.invitations[len - 1], k = invs.length;
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

            app.controllers.footer.emit('show-from-cross', originCross.exfee.id, token, cross.identity.isphone, args);
          } else {
            req.error = { code: 404 };
            res.redirect('/');
          }
        },
        error: function () {
          req.error = { code: 404 };
          res.redirect('/');
        }
      });

    };

  module.exports = {

    // `index`
    index: function (req) {
      var error = req.error,
          app = req.app, controllers = app.controllers,
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
      document.title = 'EXFE - A utility for gathering with friends.';
      homeCont.emit('show', screen, error);
      footerCont.emit('show', screen, false, false, error === true);
      delete req.error;

      app.currPageName = 'HOME';
    },

    verify: function (req, res) {
      var session = req.session,
          resolveToken = session.resolveToken,
          app = req.app;
      if (resolveToken) {
        $('#app-header').removeClass('hide');
        var verifyCont = new VerifyController({
          options: {
            template: $('#verify-tmpl').html()
          },
          resolveToken: resolveToken
        });
        verifyCont.emit('show', req, res);
      } else {
        req.error = true;
        res.redirect('/');
      }

      app.currPageName = 'VERIFY';
    },

    setPassword: function (req, res) {
      var session = req.session,
          resolveToken = session.resolveToken,
          app = req.app;
      if (resolveToken) {
        $('#app-header').removeClass('hide');
        var setPasswordCont = new SetPasswordController({
          options: {
            template: $('#setpassword-tmpl').html()
          },
          resolveToken: resolveToken,
          token: resolveToken.origin_token
        });
        setPasswordCont.emit('show', req, res);
      } else {
        req.error = true;
        res.redirect('/');
      }

      app.currPageName = 'SET_PASSWORD';
    },

    // `resolve-token`
    resolveToken: function (req, res) {
      var app = req.app,
          originToken = req.params[0],
          cb = function (req, res) {
            req.error = {
              code: 404
            };
            res.redirect('/');
          };


      if (originToken) {

        $.ajax({
          type: 'POST',
          url: _ENV_.api_url + '/Users/ResolveToken',
          data: { token : originToken },
          success: function (data) {
            if (data && data.meta && data.meta.code === 200) {
              // todo: rename
              var session = req.session;
              session.resolveToken = data.response;
              var action = session.resolveToken.action;
              if (action === 'VERIFIED') {
                res.redirect('/#verify');
              } else if (action === 'INPUT_NEW_PASSWORD') {
                session.resolveToken.origin_token = originToken;
                res.redirect('/#set_password');
              }
            } else {
              cb(req, res);
            }
          },
          error: function () {
            cb(req, res);
          }
        });

      } else {
        cb(req, res);
      }

      app.currPageName = 'RESOLVE_TOKEN';
    },

    // `cross`

    // `phone-cross-token`
    crossPhoneToken: function (req, res) {
      var app = req.app;
      var params = req.params,
          cross_id = params[0],
          ctoken = params[1];

      var cats = Store.get('cats'),
          data, token;

      data = {
        invitation_token: ctoken,
        cross_id: cross_id
      };

      if (cats && (token = cats[ctoken])) {
        data.cross_access_token = token;
      }

      showCross(req, res, data, cats, ctoken, token);

      app.currPageName = 'CROSS';
    },

    // `cross-token`
    crossToken: function (req, res) {
      var app = req.app;
      var ctoken = req.params[0],
          cats = Store.get('cats'),
          data = { invitation_token: ctoken },
          token;

      if (cats && (token = cats[ctoken])) {
        data.cross_access_token = token;
      }

      showCross(req, res, data, cats, ctoken, token);

      app.currPageName = 'CROSS';
    },


    // `live`
    live: function (req) {
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

      liveCont.emit('show', app.screen, app.ios);

      app.currPageName = 'LIVE' ;
    }

  };

});
