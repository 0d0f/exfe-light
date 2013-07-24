/*jshint -W030*/

define('mobileroutes', function (require, exports, module) {
  'use strict';

  var _ENV_ = window._ENV_,
      Store = require('store'),
      Handlebars = require('handlebars'),
      humantime = require('humantime'),

      renderCrossTime = function(crossTime) {
        var dspTime   = humantime.printEFTime(crossTime, 'X');
        return dspTime;
      };

  var Controllers = require('mobilecontroller'),
      HomeController = Controllers.HomeController,
      SetPasswordController = Controllers.SetPasswordController,
      VerifyController = Controllers.VerifyController,
      CrossController = Controllers.CrossController,
      LiveController = Controllers.LiveController,
      RouteXController = Controllers.RouteXController;

  var showCross = function (req, res, data, cats, ctoken, token) {
      cats || (cats = {});

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
        read_only: !!response.read_only,
        change_name: false
      };

      // time
      var time = originCross.time;
      if (time
        && time.begin_at
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

      var display_rsvp = false;
      // current identity rsvp
      for (var i = 0, len = originInvitations.length; i < len; ++i) {
        var invitation = originInvitations[i]
          , is_me = (user_id && user_id === invitation.identity.connected_user_id)
              || myIdId === invitation.identity.id
          , is_curr_id = (user_id && user_id === invitation.identity.connected_user_id)
              && myIdId === invitation.identity.id
          , style = 'pending'
          , rsvp_status = invitation.rsvp_status;

        if (!is_curr_id && rsvp_status === 'NOTIFICATION') { continue; }

        if (rsvp_status === 'ACCEPTED') {
          style = 'accepted';
        } else if (rsvp_status === 'DECLINED') {
          style = 'declined';
        }

        invitation.rsvp_style = style;
        if (is_me) {
          display_rsvp = style === 'pending';
          invitation.is_me = true;
          myIdId = invitation.identity.id;
          if (myIdId !== invitation.invited_by.id) {
            cross.inviter = invitation.invited_by;
          }
          if (myIdId !== invitation.by_identity.id) {
            display_rsvp = true;
          }
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

      cross.hide_rsvp = !display_rsvp;

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

      if (token && cross.identity.isphone) {
        cross.change_name = true;
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

      app.controllers.footer.emit('show-from-cross', originCross.exfee.id, token, cross.read_only, args);
    };

  var routes = module.exports = {

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
      document.title = 'EXFE - The group utility for gathering.';
      homeCont.emit('show', screen, error);
      footerCont.emit('show', screen, false, false, error === true);
      delete req.error;

      app.currPageName = 'HOME';
    },

    verify: function (req, res) {
      var session = req.session,
          resolveToken = session.resolveToken,
          app = req.app;

      $('#app-header').removeClass('hide');
      var verifyCont = new VerifyController({
        options: {
          template: $('#verify-tmpl').html()
        },
        resolveToken: resolveToken
      });
      verifyCont.emit('show', req, res);

      app.currPageName = 'VERIFY';
    },

    setPassword: function (req, res) {
      var session = req.session,
          resolveToken = session.resolveToken,
          app = req.app;

      $('#app-header').removeClass('hide');
      var setPasswordCont = new SetPasswordController({
        options: {
          template: $('#setpassword-tmpl').html()
        },
        resolveToken: resolveToken,
        token: resolveToken.origin_token
      });
      setPasswordCont.emit('show', req, res);

      app.currPageName = 'SET_PASSWORD';
    },

    // `resolve-token`
    resolveToken: function (req, res) {
      var app = req.app,
          originToken = req.params[0],
          data = req._data_ = _ENV_._data_;

      // todo: rename
      var session = req.session;
      session.resolveToken = data;
      var action = session.resolveToken.action;
      if (action === 'VERIFIED') {
        routes.verify(req, res);
      } else if (action === 'INPUT_NEW_PASSWORD') {
        session.resolveToken.origin_token = originToken;
        routes.setPassword(req, res);
      }

      app.currPageName = 'RESOLVE_TOKEN';
    },

    // `cross`

    // `phone-cross-token`
    crossPhoneToken: function (req, res) {
      var app = req.app,
          params = req.params,
          ctoken = params[2],
          cats = Store.get('cats'),
          token = cats && cats[ctoken],
          data = req._data_ = _ENV_._data_;

      showCross(req, res, data, cats, ctoken, token);

      app.currPageName = 'CROSS';
    },

    // `cross-token`
    crossToken: function (req, res) {
      var app = req.app,
          ctoken = req.params[1],
          cats = Store.get('cats'),
          data = req._data_ = _ENV_._data_,
          token = cats && cats[ctoken];

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
    },


    // `routex`
    routex: function (req, res) {
      // smith: identity_id = 916, user_id = 646
      // smith的wechat群: id = 100730

      document.title = '活点地图';

      var app = req.app
        , ctoken = req.params[0]
        , response = _ENV_._data_.response
        , tokenInfos = _ENV_._data_.tokenInfos
        , cross = response.cross
        , action = response.action
        , cross_access_token = response.cross_access_token
        // , authorization = response.authorization
        , browsing_identity = response.browsing_identity
        , free_identities = response.free_identities

        , cats = (Store.get('cats') || {})
        // , token = ((cats && cats[ctoken]) || (authorization && authorization.token));
        , token = cats && cats[ctoken];

      if (cross_access_token) {
        token = cats[ctoken] = cross_access_token;
        Store.set('cats', cats);
      }



      var routexCont = app.controllers.routex = new RouteXController({
          options: {
            template: $('#routex-tmpl').html()
          }
        , lastGPS: Store.get('last-latlng')
        , cross: cross
        , ctoken: ctoken
        , token: token || tokenInfos[0] || ctoken
        , myIdentityId: (browsing_identity && browsing_identity.id) || tokenInfos[1] || 0
        , isSmithToken: action === 'CLAIM_IDENTITY'
        , freeIdentities: free_identities
      });

      routexCont.emit('show');
    }

  };

});
