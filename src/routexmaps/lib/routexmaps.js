define('routexmaps', function (require) {

  'use strict';

  var SITE_URL = window._ENV_.site_url
    , apiv3_url = window._ENV_.apiv3_url
    //htt://www.geocodezip.com/scripts/v3_epoly_proj.js
    //http://www.geocodezip.com/

    // meters
    , EarthRadiusMeters = 6378137.0

    , distance = function (lat1, lng1, lat2, lng2) {
        //var R = 6371 // Radius of the Earth in km
        var R = EarthRadiusMeters // meters
          , dLat = (lat2 - lat1) * Math.PI / 180
          , dLon = (lng2 - lng1) * Math.PI / 180
          , a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
          , c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
          , d = R * c;
        return d;
      }
    , toRad = function (l) {
        return l * Math.PI / 180;
      }
    , toDeg = function (angle) {
        return angle * 180 / Math.PI;
      }
    , bearing = function (lat1, lon1, lat2, lon2) {
        lat1 = toRad(lat1);
        lon1 = toRad(lon1);
        lat2 = toRad(lat2);
        lon2 = toRad(lon2);
        var dLon = lon2 - lon1
          , y = Math.sin(dLon) * Math.cos(lat2)
          , x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon)
          , angle = Math.atan2(y, x);

        if (angle < 0.0) angle += Math.PI * 2.0;

        return toDeg(angle);
     }
    , distanceOutput = function (n, m, s, t, r) {
        t = '<span class="unit">{{u}}</span>';
        n = Math.floor(n);
        r = {
            text: ''
          , status: 0
          , distance: n
        };
        if (n < 30 && !m) {
          r.status = 4;
          r.text = '抵达';
        } else if (n < 1000) {
          r.text = n + t.replace('{{u}}', '米');
        } else if (n < 99 * 1000) {
          r.text = Math.floor(n / 1000) + t.replace('{{u}}', '公里');
        } else {
          r.text = 99 + '+' + t.replace('{{u}}', '公里');
        }

        return r;
      }

    , toHex = function (n) {
        return (n * 1).toString(16);
      }

    , pad0 = function (n) {
        n += '';
        return n + (n.length > 1 ?  '' : '0');
      }

    , MAX_INDEX = 610

    // type
    , ROUTE = 'route'
    , LOCATION = 'location'

    // tags
    , XPLACE      = 'xplace'
    , DESTINATION = 'destination'
    , BREADCRUMBS = 'breadcrumbs'
    , PARK = 'park'
    , TIME_STEPS = [0, 1, 3, 5, 10, 15];


  function MapPanel(div, noremove) {
    this.div = div;
    this.status = !noremove;
  }

  MapPanel.prototype = {
    hide: function () {
      var div = this.div;
      this.hideBefore && this.hideBefore();
      div.off();
      if (this.status) {
        div.remove();
      } else {
        div.addClass('hide');
      }
      this.hideAfter && this.hideAfter();
    }
  };

  function RoutexMaps(options) {
    options = this.options = options || {};
    /*
    this.svgLayer = this.options.svg;
    delete this.options.svg;
    */
    this.canvas = this.options.canvas;
    var w = $(window).width(), h = $(window).height();
    this.canvas.width = w * 2;
    this.canvas.height = h * 2;
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.ctx = this.canvas.getContext('2d');
    this.DRAW_STATUS = true;
    delete this.options.cavnas;

    this.latOffset = 0;
    this.lngOffset = 0;

    this.routes = {};
    this.places = {};
    this.tiplines = {};
    this.lines = {};
    this.breadcrumbs = {};
    this.geoMarkers = {};
    this.icons = {};

    this.updated = {};

    this._breadcrumbs = {};

    this.boundsOffset = {
        left: 50
      , top: 0
    };

    this.labels = [];

    this.currPanel = null;

    window._loadmaps_ = function (rm, mapDiv, mapOptions, callback) {

      return function cb() {
        var GMaps = google.maps
          , GEvent = GMaps.event;

        GMaps.TextLabel = require('maplabel');
        GMaps.GeoMarker = require('geomarker');

        var icons = rm.icons;

        icons.dotGrey = new GMaps.MarkerImage(
              SITE_URL + '/static/img/map_dot_grey@2x.png'
            , new GMaps.Size(36, 36)
            , new GMaps.Point(0, 0)
            , new GMaps.Point(9, 9)
            , new GMaps.Size(18, 18)
          );
        icons.dotRed = new GMaps.MarkerImage(
              SITE_URL + '/static/img/map_dot_red@2x.png'
            , new GMaps.Size(36, 36)
            , new GMaps.Point(0, 0)
            , new GMaps.Point(9, 9)
            , new GMaps.Size(18, 18)
          );
        icons.placeMarker = new GMaps.MarkerImage(
              apiv3_url + '/icons/mapmark'
            , new GMaps.Size(48, 68)
            , new GMaps.Point(0, 0)
            , new GMaps.Point(12, 34)
            , new GMaps.Size(24, 34)
          );
        icons.xplaceMarker = new GMaps.MarkerImage(
              SITE_URL + '/static/img/map_mark_diamond_blue@2x.png'
            , new GMaps.Size(48, 68)
            , new GMaps.Point(0, 0)
            , new GMaps.Point(12, 34)
            , new GMaps.Size(24, 34)
          );
        icons.destinationMarker = new GMaps.MarkerImage(
              SITE_URL + '/static/img/map_mark_ring_blue@2x.png'
            , new GMaps.Size(48, 68)
            , new GMaps.Point(0, 0)
            , new GMaps.Point(12, 34)
            , new GMaps.Size(24, 34)
          );

        // hdpi
        GMaps.visualRefresh = true;
        // defaults to China
        mapOptions.center = rm.toLatLng(35.86166, 104.195397);
        mapOptions.mapTypeId = GMaps.MapTypeId.ROADMAP;
        mapOptions.disableDefaultUI = true;
        mapOptions.minZoom = 1;

        var map = rm.map = new GMaps.Map(mapDiv, mapOptions);

        var overlay = rm.overlay = new GMaps.OverlayView();
        overlay.draw = function () {};
        // overlay.onAdd = overlay.onRemove = function () {};
        overlay.setMap(map);

        var initListener = GEvent.addListener(map, 'tilesloaded', function () {

          GEvent.addListener(map, 'bounds_changed', function () {
            GEvent.trigger(map, 'zoom_changed');
          });
          GEvent.addListener(map, 'zoom_changed', function () {
            rm.contains();
            rm.DRAW_STATUS = true;
          });
          GEvent.addListener(map, 'mousedown', function (e) {
            e.stop();
            rm.hideMyPanel();
            rm.hideMapPanel();
            //rm.hideIdentityPanel();
          });

          var px, py;
          $(mapDiv)
            .on('touchstart.maps', function (e) {
              rm.hideMyPanel();
              rm.hideMapPanel();
              //rm.hideNearBy();
              //rm.hideIdentityPanel();
              var touch = e.touches[0];
              px = touch.pageX;
              py = touch.pageY;
            })
            .on('tap.maps', function (e) {
              //if (rm.infobox) { return; }
              e.stopPropagation();
              rm.showNearBy({ x: px, y: py });
            });

          GEvent.addDomListener(mapDiv, 'touchstart', function (e) {
            rm.DRAW_STATUS = false;
            GEvent.clearListeners(mapDiv, 'touchmove');
            GEvent.clearListeners(mapDiv, 'touchend');
            GEvent.addDomListenerOnce(mapDiv, 'touchmove', function () {
              //rm.hideTiplines();
              rm.clearLines();
            });
            GEvent.addDomListenerOnce(mapDiv, 'touchend', function () {
              rm.DRAW_STATUS = true;
            });
          });

          GEvent.removeListener(initListener);

        });

        callback(map);

        cb = null;
      };

      window._loadmaps_ = null;
    }(this, options.mapDiv, options.mapOptions, options.callback);

  }

  var proto = RoutexMaps.prototype;

  proto.load = function (cb) {
    var head = document.getElementsByTagName('head')[0],
      , dns = ['ditu.google.cn', 'maps.gstatic.com', 'mts0.google.com', 'mts1.google.com', 'maps.googleapis.com', 'mts0.googleapis.com', 'mts1.googleapis.com']
      , protocol = this.options.protocol
      , d;
    while ((d = dns.shif())) {
      var link = document.createElement('link');
      link.rel='dns-prefetch';
      link.href = protocol + d;
      head.appendChild(link);
    }

    var n = document.createElement('script')
    n.type = 'text/javascript';
    n.async = !0;
    n.onload = n.onerror = n.onreadystatechange = function () {
      if (/^(?:loaded|complete|undefined)$/.test(n.readyState)) {
        n = n.onload = n.onerror = n.onreadystatechange = null;
        cb && cb();
      }
    };
    n.src = this.options.url;
    document.body.appendChild(n);
  };

  proto.fromContainerPixelToLatLng = function (point) {
    return this.overlay.getProjection().fromContainerPixelToLatLng(point);
  };

  proto.fromLatLngToContainerPixel = function (latlng) {
    return this.overlay.getProjection().fromLatLngToContainerPixel(latlng);
  };

  proto.infoWindowTemplate = '<div id="place-editor" class="info-windown park"><h2 class="title">{{title}}</h2><div class="description">{{description}}</div></div>';

  proto.showPlacePanel = function (id) {
    this.hideMapPanel();

    var self = this;

    var place = this.places[id];

    if (place) {
      var latlng = place.getPosition()
        , p = this.fromLatLngToContainerPixel(latlng)
        , data = place.data;

      var $place = $(self.infoWindowTemplate.replace('{{title}}', data.title).replace('{{description}}', data.description || ''));

      $place.editing = false;

      $place.on('touchstart', '.title, .description', function (e) {
        $place.editing = true;
        var $t = $place.find('.title')
          , $d = $place.find('.description')
          , title = $t.text()
          , description = $d.text();
        var ct = document.createElement('input');
        ct.type = 'text';
        ct.value = title;
        var c0 = document.createElement('div');
        c0.className = 'splitline';
        c0.appendChild(ct);
        var cd = document.createElement('textarea');
        cd.value = description;
        var c1 = document.createElement('div');
        c1.className = 'splitline';
        c1.appendChild(cd);
        $place.prepend(c1);
        $place.prepend(c0);
        $t.addClass('hide');
        $d.addClass('hide');

        var left = 0, top = 0
          , w = $(window).width()
          , h = $(window).height()
          , ow = 200
          , oh = $place.height();

        left = p.x - ow / 2;
        top = p.y - 64 - oh / 2;

        if (left < 10) { left = 10; }
        if (left + ow > w - 10) { left = w - ow - 10; }
        if (top < 10) { top = 10; }
        if (top + oh > h - 10) { top = h - oh - 10; }

        $place.css({
            //'transform': 'translate3d(' + left + 'px,' + top + 'px, 0px)'
          //, '-webkit-transform': 'translate3d(' + left + 'px,' + top + 'px, 0px)'
            left: left
          , top: top
          , width: 200
        });
      });

      $('#routex').append($place);

      var left = 0, top = 0
        , w = $(window).width()
        , h = $(window).height()
        , ow = $place.width()
        , oh = $place.height();

      left = p.x - ow / 2;
      top = p.y - 64 - oh / 2;

      if (left < 10) { left = 10; }
      if (left + ow > w - 10) { left = w - ow - 10; }
      if (top < 10) { top = 10; }
      if (top + oh > h - 10) { top = h - oh - 10; }

      $place.css({
          //'transform': 'translate3d(' + left + 'px,' + top + 'px, 0px)'
        //, '-webkit-transform': 'translate3d(' + left + 'px,' + top + 'px, 0px)'
          left: left
        , top: top
        , visibility: 'visible'
      });

      this.currPanel = new MapPanel($place);
      this.currPanel.hideBefore = function () {
        var myIdentity = self.myIdentity;
        var div = this.div;
        if (div.editing) {
          var title = div.find('input').val().trim();
          var description = div.find('textarea').val().trim();
          if (title !== data.title || description !== data.description) {
            data.title = title;
            data.description = description;
            data.updated_at = Math.round(Date.now() / 1000);
            data.updated_by = myIdentity.external_username + '@' + myIdentity.provider;
            self.controller.editPlace(data);
          }
          div.find('input, .splitline').remove();
          div.find('.title').text(title).removeClass('hide');
          div.find('.description').text(description).removeClass('hide');
        }
      };
    }
  };

  proto.showIdentityPanel = function (uid, bound) {
    this.hideMapPanel();

    var gm = this.geoMarkers[uid]
      , geoLocation = this.geoLocation
      , destinationPlace = this.destinationPlace
      , identity = $('#identities-overlay .identity[data-uid="' + uid + '"]').data('identity')
      , $otherInfo = $('#other-info')
      , now = Math.round(Date.now() / 1000)
      , p, t;

    $otherInfo.find('.name').text(identity.name);
    if (gm) {
      p = gm.getPosition();
      t = Math.floor((now - gm.data.positions[0].t) / 60);
    } else {
      t = 2;
    }

    if (t > 1) {
      if (gm) {
        $otherInfo.find('.update')
          .removeClass('hide')
          .find('.time')
          .html(t < 60 ? (t + '分钟') : (Math.floor(t / 60) + '小时'));
      } else {
        $otherInfo.find('.update').addClass('hide')
      }
      $otherInfo.find('.please-update')
        //.attr('data-external-username', identity.external_username)
        //.attr('data-provider', identity.provider)
        // external_username@provider
        .attr('data-enu', identity.external_username + '@' + identity.provider)
        .attr('data-name', identity.name)
        .attr('data-notification-identities', identity.notification_identities.join(' '))
        .removeClass('hide');
    } else {
      $otherInfo.find('.update').addClass('hide');
      $otherInfo.find('.please-update').addClass('hide');
    }
    if (gm && destinationPlace) {
      var p2 = destinationPlace.getPosition();
      var d = distance(p.lat(), p.lng(), p2.lat(), p2.lng())
        , r = bearing(p.lat(), p.lng(), p2.lat(), p2.lng())
        , result = distanceOutput(d, true);
      $otherInfo.find('.dest').removeClass('hide')
        .find('.m').html(result.text + '<i class="icon icon-arrow-' + (t > 1 ? 'grey' : 'red') + '" style="-webkit-transform: rotate(' + r + 'deg)"></i>');
    } else {
      $otherInfo.find('.dest').addClass('hide');
    }
    if (gm && geoLocation) {
      var p2 = geoLocation.getPosition();
      var d = distance(p.lat(), p.lng(), p2.lat(), p2.lng())
        , r = bearing(p.lat(), p.lng(), p2.lat(), p2.lng())
        , result = distanceOutput(d, true);
      $otherInfo.find('.dest-me').removeClass('hide')
        .find('.m').html(result.text + '<i class="icon icon-arrow-' + (t > 1 ? 'grey' : 'red') + '" style="-webkit-transform: rotate(' + r + 'deg)"></i>');
    } else {
      $otherInfo.find('.dest-me').addClass('hide');
    }

    $otherInfo.removeClass('hide');

    var w = $(window).width()
      , h = $(window).height()
      , oh = $otherInfo.height()
      , ow = $otherInfo.width()
      , left, top;

    if (gm) {
      var point = this.fromLatLngToContainerPixel(p);
      left = point.x - ow / 2;
      top = point.y - oh / 2;
    } else {
      left = (w - ow) / 2;
      top = (h - oh) / 2;
    }

    if (bound) {
      left = 50;
      top = bound.top;
    } else {
      if (left < 0) { left = 10; }
      if (left + ow > w) { left = w - ow - 10; }
      if (top < 0) { top = 10; }
      if (top + oh > h) { top = h - oh - 10; }
    }

    $otherInfo.css({
          // 'transform': 'translate3d(' + left + 'px,' + top + 'px, 0px)'
        // , '-webkit-transform': 'translate3d(' + left + 'px,' + top + 'px, 0px)'
          left: left
        , top: top
        , visibility: 'visible'
      });

    this.currPanel = new MapPanel($otherInfo, true);
    this.currPanel.hideAfter = function () {
      this.div.css({ visibility: 'hidden' });
    };
  };

  proto.setOffset = function (offset) {
    this.latOffset = offset.earth_to_mars_latitude * 1;
    this.lngOffset = offset.earth_to_mars_longitude * 1;
  };

  proto.hideMyPanel = function () {
    $('#my-info').addClass('hide');
  };

  proto.hideIdentityPanel = function () {
    $('#other-info').addClass('hide');
  };

  var NEARBY_TMP = '<div id="nearby" class="info-windown"></div>';
  var PLACE_TMP = '<div class="place-marker"><h4 class="title"></h4><div class="description"></div></div>';
  var IDENTITY_TMP = '<div class="geo-marker clearfix"><img width="30" height="30" src="" alt="" /><div class="detial"><div class="name"></div><div class="status"></div></div></div>';
  proto.hideNearBy = function () {
    $('#nearby').remove();
  };
  // 24pt = 48px
  proto.distance48px = function (p0, b) {
    var a = this.fromLatLngToContainerPixel(p0)
      , d = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    return d <= 48;
  };
  proto.showNearBy = function (point) {
    /*
    if ($('#nearby').length) {
      this.hideNearBy();
      return;
    }
    */
    if (this.currPanel) {
      this.currPanel.hide();
      this.currPanel = null;
      return;
    }
    if (point) {
      var center = point
        , status = false
        , myUserId = this.myUserId
        , places = this.places
        , geoMarkers = this.geoMarkers
        , geoLocation = this.geoLocation
        , geoPosition = geoLocation && geoLocation.getPosition()
        , destinationPlace = this.destinationPlace
        , destinationPosition = destinationPlace && destinationPlace.getPosition()
        //, list = { places: [], geomarkers: [] }
        , now = Date.now() / 1000
        , latlng
        , pn = 0, gn = 0
        , pk, gk
        , uid, p;
      Debugger.log('-----------------------', geoPosition, destinationPosition);

      var nbDiv = $(NEARBY_TMP);

      for (var k in places) {
        p = places[k];
        latlng = p.getPosition()
        if (this.distance48px(latlng, center)) {
          if (!status) { status = true; }
          pn++;
          pk = k;
          var tmp = $(PLACE_TMP);
          tmp.attr('data-id', p.data.id);
          tmp.find('.title').text(p.data.title);
          tmp.find('.description').text(p.data.description || '');
          nbDiv.append($('<div class="splitline"></div>').append(tmp));
        }
      }

      for (var k in geoMarkers) {
        p = geoMarkers[k];
        latlng = p.getPosition();
        if (this.distance48px(latlng, center)) {
          var identity = $('#identities-overlay .identity[data-uid="' + k + '"]').data('identity');
          if (!identity) { continue; }
          if (!status) { status = true; }
          gn++;
          gk = k;
          var id = p.data.id.split('.')[1];
          var tmp = $(IDENTITY_TMP);
          tmp.find('img').attr('src', identity.avatar_filename);
          tmp.find('.name').text(identity.name);
          tmp.attr('data-uid', k);
          var position = p.data.positions[0];
          var n = Math.floor((now - position.t) / 60);
          var dm = '', dd = '', str = '';

          if (geoPosition) {
            var s = distanceOutput(distance(latlng.lat(), latlng.lng(), geoPosition.lat(), geoPosition.lng()), true)
            dm = s.text;
          }

          if (destinationPosition) {
            var s = distanceOutput(distance(latlng.lat(), latlng.lng(), destinationPosition.lat(), destinationPosition.lng()), true)
            dd = s.text;
          }

          if (n <= 1) {
            if (dd) {
              str += '<span>至目的地' + dd + '</span>';
            }
            if (dm) {
              str += '<span>与您相距' + dm + '</span>'
            }
          } else {
            if (n < 60) {
              str += '<span>' + n + '分钟前</span>'
            } else {
              str += '<span>' + Math.floor(n / 60) + '小时前</span>'
            }
            if (dd) {
              str += '<span>至目的地' + dd + '</span>';
            }
          }
          if (str) {
            tmp.find('.status').html(str);
          }

          nbDiv.append($('<div class="splitline"></div>').append(tmp));
        }
      }

      if (status) {
        if (pn === 1 && gn === 0) {
          this.showPlacePanel(pk);
        } else if (pn === 0 && gn === 1) {
          this.showIdentityPanel(gk);
        } else {
          var width = $(window).width()
            , height = $(window).height();
          nbDiv.css({
              'transform': 'translate3d(' + (width - 200 + 50) / 2 + 'px,' + (height - 132) / 2 + 'px, 0)'
            , '-webkit-transform': 'translate3d(' + (width - 200 + 50) / 2 + 'px,' + (height - 132) / 2 + 'px, 0)'
          });
          $('#routex').append(nbDiv);
          this.currPanel = new MapPanel(nbDiv);
        }
      }
    }
  };

  proto.draw = function (data) {
    var type = data.type
      , action = data.action
      , isDelete = action && action === 'delete'
      , hasTags = data.tags
      , tags = hasTags && data.tags.slice(0)
      , tag, dest;

    Debugger.log(type, action, isDelete, tags, data);
    switch (type) {
      case LOCATION:
        var t = 0;

        if (hasTags) {
          while ((tag = tags.shift())) {
            if (tag === XPLACE) {
              t ^= 1; // t = 1
            } else if (tag === DESTINATION) {
              t ^= 2; // t = 2
              dest = tag;
            }
            // has xplace and destination t = 3
          }
        }

        isDelete ? this.removePlace(data, dest === DESTINATION) : this.drawPlace(data, t);
        break;

      case ROUTE:
        var isBreadcrumbs;

        if (hasTags) {
          while ((tag = tags.shift())) {
            if (tag === BREADCRUMBS) {
              isBreadcrumbs = true;
              break;
            }
          }
        }

        if (isBreadcrumbs) {
          this.drawGeoMarker(data);
        } else {
          isDelete ? this.removeRoute(data) : this.drawRoute(data);
        }
        break;
    }
  };

  proto.clearup = function () {
    var k;
    var places = this.places;
    for (k in places) {
      places[k].setMap(null);
      places[k] = null;
      delete places[k];
    }

    var breadcrumbs = this.breadcrumbs;
    for (k in breadcrumbs) {
      breadcrumbs[k].setMap(null);
      breadcrumbs[k] = null;
      delete breadcrumbs[k];
    }

    var geoMarkers = this.geoMarkers;
    for (k in geoMarkers) {
      geoMarkers[k].setMap(null);
      geoMarkers[k] = null;
      delete geoMarkers[k];
    }

    var routes = this.routes;
    for (k in routes) {
      routes[k].setMap(null);
      routes[k] = null;
      delete routes[k];
    }

    this.destinationPlace = null;

    this.removeTextLabels();

    /*
    var tiplines = this.tiplines;
    for (k in tiplines) {
      this.svgLayer.removeChild(tiplines[k]);
      tiplines[k] = null;
      delete tiplines[k];
    }
    */
    var lines = this.lines;
    for (k in lines) {
      delete lines[k];
    }
    this.clearLines();

    this.uid = null;

    //this.updated = {};
    //this._breadcrumbs = {};
  };

  proto.removePlace = function (data, isDestination) {
    var places = this.places, id = data.id, p = places[id];
    if (p) {
      p.setMap(null);
      p = null;
      delete places[id];
      if (isDestination) {
        this.destinationPlace = null;
        var geoLocation = this.geoLocation;
        if (geoLocation) {
          geoLocation.toggleDsntCircle(false);
        }
      }
    }
  };

  proto.drawRoute = function (data) {
    var routes = this.routes
      , id = data.id
      , positions = data.positions.slice(0)
      , coords = []
      , r, d, p, gps;
    if (routes.hasOwnProperty(id)) {
      r = routes[id];
      d = r.data;
      // no update
      if (d.updated_at === data.updated_at) {
        return;
      }
    }

    if (!r) {
      r = routes[id] = this.addPolyline(data);
    }

    while ((p = positions.shift())) {
      gps = p.gps;
      coords.push(this.toLatLng(gps[0], gps[1]));
    }

    r.setPath(coords);
    r.data = data;
  };

  proto.removeRoute = function (data) {
    var routes = this.routes, id = data.id, r = routes[id];
    if (r) {
      r.setMap(null);
      r = null;
      delete routes[id];
    }
  };

  proto.addPolyline = function (data) {
    var rgba = (data.color && data.color.split(',')) || []
      , color = '#' + (rgba.length ? pad0(toHex(rgba[0])) + pad0(toHex(rgba[1])) + pad0(toHex(rgba[2])) : '007BFF')
      , alpha = rgba[3] || 1
      , p = new google.maps.Polyline({
            map: this.map
          , index: MAX_INDEX - 5
          , geodesic: true
          , strokeColor: color
          , strokeWeight: 4
          , strokeOpacity: alpha
        });
    return p;
  };

  proto.drawPlace = function (data, t) {
    var places = this.places
      , id = data.id, p, d, latlng;
    if (places.hasOwnProperty(id)) {
      p = places[id];
    }

    if (!p) {
      p = places[id] = this.addPoint(data);
    }

    latlng = this.toLatLng(data.lat, data.lng);

    p.setPosition(latlng);
    p.data = data;

    if (t === 1 || t === 3) {
      p.setIcon(this.icons.xplaceMarker);
      p.setZIndex(MAX_INDEX - 1);
    }

    if (t === 2 || t === 3) {
      // 如果还没 GPS 自动定位到 destination
      var geoLocation = this.geoLocation;
      var zIndex = MAX_INDEX;
      var icon = this.icons.destinationMarker;
      if (!geoLocation || (geoLocation && geoLocation._status == 0)) {
        this.panToDestination(latlng);
      }
      var destinationPlace = this.destinationPlace;
      if (destinationPlace && destinationPlace !== p) {
        var cd = destinationPlace.data;
        if (data.id != cd.id) {
          destinationPlace.setIcon(this.icons.placeMarker);
          destinationPlace.setZIndex(zIndex - 5);
          this.destinationPlace = p;
        } else {
          zIndex = MAX_INDEX - 5;
          icon = this.icons.placeMarker;
        }
      } else {
        this.destinationPlace = p;
      }
      if (t !== 3) {
        p.setIcon(icon);
        p.setZIndex(zIndex);
      }
    }

    if (1 <= t && t <= 3) {
      return;
    }

    var GMaps = google.maps;
    if (data.icon) {
      p.setIcon(new GMaps.MarkerImage(
          data.icon
        , new GMaps.Size(48, 68)
        , new GMaps.Point(0, 0)
        , new GMaps.Point(12, 34)
        , new GMaps.Size(24, 34)
      ));
    } else {
      p.setIcon(this.icons.placeMarker);
    }
  };

  proto.monit = function () {
    var u = this.updated
      , bs = this.breadcrumbs
      , icons = this.icons
      , gms = this.geoMarkers
      , lines = this.lines
      //, tiplines = this.tiplines
      , dp = this.destinationPlace
      , geo = this.geoLocation
      , myUserId = this.myUserId
      , curr_uid = this.uid
      , uid, isme, d, now = Math.round(Date.now() / 1000)
      , gm, b, $e, line, n;

    for (uid in u) {
      if (u.hasOwnProperty(uid)) {
        d = u[uid];
        isme = myUserId == uid;
        n = Math.floor((now - d.t) / 60);
        gm = isme ? geo : gms[uid];

        if (!gm) {
          gm = this.drawGeoMarker(this._breadcrumbs[uid]);
        }

        this.distanceMatrix(uid, gm ,dp, n);

        b = bs[uid];
        //tl = tiplines[uid];
        line = lines[uid];
        $e = $('#identities-overlay .identity[data-uid="' + uid + '"]').find('.icon');

        if (curr_uid && (curr_uid == uid) && this._breadcrumbs[uid]) {
          this.updateBreadcrumbs(uid);
          this.showTextLabels(uid, this._breadcrumbs[uid].positions.slice(0), n <= 1);
        }

        if (n <= 1) {

          if ($e.length) {
            $e.parent().removeClass('unknown');
            if ($e.hasClass('icon-arrow-grey') || $e.hasClass('icon-arrow-red')) {
              $e.attr('class', 'icon icon-arrow-red');
            } else {
              $e.attr('class', 'icon icon-dot-red');
            }
          }

          b && b.setOptions({
              strokeOpacity: 0
            , icons: [
                {
                    icon: {
                        path: 'M0,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 z'
                      , fillColor: '#ff325b'
                      , fillOpacity: .5
                      , strokeColor: '#fff'
                      , strokeOpacity: .66
                      , strokeWeight: 1
                      , scale: .5
                    }
                  , repeat: '16px'
                  , offset: '0'
                }
              ]
          });
          if (isme) { continue; }
          line && (line[3] = '#ff7e98');
          //tl && tl.setAttribute('stroke', '#FF7E98');
          if (gm) {
            gm.setIcon(icons.dotRed);
            var label = gm.label;
            if (label) {
              label.setMap(null);
              delete label.marker;
              delete gm.label;
            }
          }
        } else {
          if ($e.length) {
            $e.parent().removeClass('unknown');
            if ($e.hasClass('icon-arrow-grey') || $e.hasClass('icon-arrow-red')) {
              $e.attr('class', 'icon icon-arrow-grey');
            } else {
              $e.attr('class', 'icon icon-dot-grey');
            }
          }

          b && b.setOptions({
              strokeOpacity: 0
            , icons: [
                {
                    icon: {
                        path: 'M0,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 z'
                      , fillColor: '#7f7f7f'
                      , fillOpacity: .5
                      , strokeColor: '#fff'
                      , strokeOpacity: .66
                      , strokeWeight: 1
                      , scale: .5
                    }
                  , repeat: '16px'
                  , offset: '0'
                }
              ]
          });
          if (isme) { continue; }
          //tl && tl.setAttribute('stroke', '#b2b2b2');
          line && (line[3] = '#b2b2b2');
          if (gm) {
            gm.setIcon(icons.dotGrey);
            var label = gm.label;
            if (!label) {
              gm.label = label = new google.maps.TextLabel({
                  map: this.map
                , zIndex: MAX_INDEX - 3
              });
              label.marker = gm;
              label.noRemoveMarker = true;
            }
            if (n < 60) {
              label.set('text', n + '分钟前');
            } else {
              label.set('text', Math.floor(n / 60) + '小时前');
            }
          }
        }
      }
    }
    this.updateLines();
  };

  proto.toLatLng = function (lat, lng) {
    return new google.maps.LatLng(lat * 1, lng * 1);
  };

  proto.freshExfee = function () {
    if (this.controller) {
      this.controller.getExfee();
    }
  };

  proto.drawGeoMarker = function (data) {
    var gms = this.geoMarkers
      , uid = data.id.split('.')[1]
      , action = data.action
      , g, d, latlng, gps;

    if (action === 'save_to_history') {
      this.updatePositions(data);
    }

    this.updated[uid] = data.positions[0];

    if (uid != this.myUserId) {
      if (gms.hasOwnProperty(uid)) {
        g = gms[uid];
        d = g.data;
        // no update
        if (d.positions[0].gps.join(',') === data.positions[0].gps.join(',')) {
          g.data = data;
          return;
        }
      } else if (!$('#identities .identity[data-uid="' + uid + '"]').length) {
        this.freshExfee();
      }
      if (!g) {
        g = gms[uid] = this.addGeoMarker();
      }
      gps = data.positions[0].gps;
      latlng = this.toLatLng(gps[0], gps[1]);
      g.setPosition(latlng);
      g.uid = uid;
      g.data = data;

      //this.updateTipline(uid, latlng);
      this.containsOne(uid, latlng);
    }
  };

  proto.updatePositions = function (data) {
    // e.g. breadcrumbs.user_id
    var id = data.id.split('.')[1]
    if (!this._breadcrumbs[id]) {
      this._breadcrumbs[id] = data;
    } else {
      this._breadcrumbs[id].positions.unshift(data.positions[0])
    }

    // 只保留最新100个点
    if (this._breadcrumbs[id].length > 100) {
      this._breadcrumbs[id].splice(100, this._breadcrumbs[id].length - 100);
    }
  };

  proto.addGeoMarker = function () {
    var self = this
      , gm = new google.maps.Marker({
            map: this.map
          //, animation: 2
          , zIndex: MAX_INDEX - 2
          , icon: this.icons.dotGrey
          , shape: {
                type: 'circle'
              , circle: [9, 9, 9]
            }
          , optimized: false
        });
    return gm;
  };

  proto.distanceMatrix = function (uid, gm, dp, time) {
    time = time || 0;
    var $identity = $('#identities-overlay .identity[data-uid="' + uid + '"]')
      , $detial = $identity.find('.detial')
      , $icon = $detial.find('.icon')
      , $distance = $detial.find('.distance');
    if (gm && dp) {
      var p0 = gm.getPosition()
        , p1 = dp.getPosition()
        , lat1 = p0.lat(), lng1 = p0.lng()
        , lat2 = p1.lat(), lng2 = p1.lng()
        , d = distance(lat2, lng2, lat1, lng1)
        , r = bearing(lat1, lng1, lat2, lng2)
        , result = distanceOutput(d);

      result.rotate = r;

      $distance.html(result.text);
      $icon.css('-webkit-transform', 'rotate(' + r + 'deg)');
      $icon.attr('class', 'icon icon-arrow-' + (time <= 1 ? 'red' : 'grey'));
      $detial.css('visibility', 'visible');
    } else if (gm) {
      if (!$icon.hasClass('icon-dot-red') && !$icon.hasClass('icon-dot-red')) {
        $icon.attr('class', 'icon icon-dot' + (time <= 1 ? 'red' : 'grey'));
      }
      $distance.html(time <= 1 ? '在线' : (time < 60 ? (time + '<span class="unit">分钟</span>') : (Math.floor(time / 60) + '<span class="unit">小时</span>')));
      $detial.css('visibility', 'visible');
    } else if (this.updated[uid]) {
      time = Math.floor((Date.now() / 1000 - this.updated[uid].t) / 60);
      $distance.html(time <= 1 ? '在线' : (time < 60 ? (time + '<span class="unit">分钟</span>') : (Math.floor(time / 60) + '<span class="unit">小时</span>')));
      $detial.css('visibility', 'visible');
    } else {
      $detial.css('visibility', 'hidden');
    }
  };

  proto.fitBoundsWithDestination = function (uid) {
    var destinationPlace = this.destinationPlace
      , isme = this.myUserId == uid
      , gm = isme ? this.geoLocation : this.geoMarkers[uid];
    if (gm) {
      var gmlatlng = gm.getPosition()
        , map = this.map;
      if (destinationPlace) {
        var dlatlng = destinationPlace.getPosition()
          , p = this.fromLatLngToContainerPixel(dlatlng)
          , bounds;

        if (isme) {
          bounds = this.calculateBoundsByCenter(gmlatlng, [dlatlng]);
        } else {
          bounds = new google.maps.LatLngBounds();
          if (p.x < 50) {
            p = this.fromContainerPixelToLatLng(new google.maps.Point(p.x - 50, p.y));
            bounds.extend(p);
          }

          bounds.extend(gmlatlng);
          bounds.extend(dlatlng);
        }

        map.fitBounds(bounds);
      } else {
        if (isme || !map.getBounds().contains(gmlatlng)) {
          if (map.getZoom() < 7) {
            map.setZoom(15);
          }
          map.panTo(gmlatlng);
        }
      }
    }
  };

  proto.panToDestination = function (position) {
    var map = this.map;
    if (map.getZoom() < 7) {
      map.setZoom(15);
    }
    map.panTo(position || this.destinationPlace.getPosition());
  };

  proto.calculateBoundsByCenter = function (center, others) {
    var bounds = new google.maps.LatLngBounds()
      , points = [], point, coord, c;
    while ((coord = others.shift())) {
      point = this.fromLatLngToContainerPixel(coord);
      points.push(point);
    }

    var c = this.fromLatLngToContainerPixel(center), maxd = 0, d, p;
    while ((p = points.shift())) {
      d = Math.sqrt(Math.pow(p.x - c.x, 2) + Math.pow(p.y - c.y, 2));
      if (d > maxd) { maxd = d; }
    }

    var sw = this.fromContainerPixelToLatLng(new google.maps.Point(c.x - maxd - 50, c.y - maxd - 50))
      , ne = this.fromContainerPixelToLatLng(new google.maps.Point(c.x + maxd + 50, c.y + maxd + 50));

    bounds.extend(sw);
    bounds.extend(center);
    bounds.extend(ne);
    return bounds;
  };

  proto.addBreadcrumbs = function () {
    var color = '#7f7f7f'
      , alpha = 0.5
      , p = new google.maps.Polyline({
        map: this.map
      , visible: false
      , index: MAX_INDEX - 5
      //, geodesic: true
      // , strokeColor: data.color
      // , strokeWeight: 1
      , strokeOpacity: 0
      , icons: [
          {
              icon: {
                  path: 'M0,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 z'
                , fillColor: color
                , fillOpacity: alpha
                , strokeColor: '#fff'
                , strokeOpacity: .66
                , strokeWeight: 1
                , scale: .5
              }
            , fixedRotation: true
            , repeat: '16px'
            , offset: '0'
          }
        ]
    });
    return p;
  };

  proto.MIN_PIXL = 50;

  proto.distanceMatrixPixl = function (p0, p1, n) {
    n = n || 50;
    var a = this.fromLatLngToContainerPixel(new google.maps.LatLng(p0[0], p0[1]))
      , b = this.fromLatLngToContainerPixel(new google.maps.LatLng(p1[0], p1[1]))
      , d = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

    return d >= n;
  };

  proto.showTextLabels = function (uid, positions, bool) {
    if (uid) {
      var now = Math.round(Date.now() / 1000)
        , labels = this.labels
        , map = this.map
        , ps = positions.slice(0)
        , b = true
        , start = 0
        //, end = 2 * 60
        , i = 0
        , ignore = 0
        , label
        , marker
        , j = 0
        , p, t, n, prev;

      while ((p = ps.shift())) {
        t = Math.floor((now - p.t) / 600) * 10;

        if (ignore === t) { continue; }

        ignore = t;

        //if (t > end) { break; }

        if (prev) {
          b = this.distanceMatrixPixl(p.gps, prev.gps);
        }

        if (t > start && b && (TIME_STEPS.indexOf(t) != -1 || t > 15)) {

          if (j === 0) { j = 1; continue; }

          start = t;
          label = labels[i];
          if (!label) {
            marker = new google.maps.Marker({
                map: map
                // http://jsfiddle.net/BNWYq/36/
              , zIndex: MAX_INDEX - 4
              , optimized: false
            });
            label = labels[i] = new google.maps.TextLabel({
                map: map
              , zIndex: MAX_INDEX - 3
            });
            label.marker = marker;
          } else {
            marker = label.marker;
          }
          if (marker) {
            marker.setPosition(this.toLatLng(p.gps[0], p.gps[1]));
            marker.setIcon({
                path: 'M0,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 z'
              , fillColor: bool ? '#ff325b' : '#7f7f7f'
              , fillOpacity: .5
              , strokeColor: '#fff'
              , strokeOpacity: .66
              , strokeWeight: 1
              , scale: .5
            });
          }
          if (t < 60) {
            label.set('text', t + '分钟前');
          } else {
            label.set('text', Math.floor(t / 60) + '小时前');
          }
          prev = p;
          i++;
        }
      }

      for (var len = labels.length - 1; len > i; len--) {
        label = labels[len];
        if (label) {
          label.marker.setMap(null);
          label.setMap(null);
        }
        labels.splice(len, 1);
      }
    }
  };

  proto.removeTextLabels = function () {
    var labels = this.labels, label;
    while ((label = labels.shift())) {
      label.marker.setMap(null);
      label.setMap(null);
    }
    labels.length = 0;
  };

  proto.updateBreadcrumbs = function (uid) {
    var data, b, p, gps, coords = [];
    if (!(data = this._breadcrumbs[uid])) { return; }
    var positions0 = data.positions.slice(0);
    var positions1 = positions0.slice(0);
    //var t = Math.floor((Date.now() / 1000 - positions0[0].t) / 60);
    //this.showTextLabels(uid, positions0, t <= 1);

    if ((b = this.breadcrumbs[uid])) {
      while ((p = positions1.pop())) {
        gps = p.gps;
        coords.push(this.toLatLng(gps[0], gps[1]));
      }
      b.setPath(coords);
    }
  };

  proto.hideMapPanel = function () {
    if (this.currPanel) {
      this.currPanel.hide();
      this.currPanel = null;
    }
  };

  proto.showBreadcrumbs = function (uid) {
    this.hideMyPanel();
    this.hideMapPanel();

    this.removeTextLabels();
    if (!this._breadcrumbs[uid]) { return; }
    var bds = this.breadcrumbs
      , puid = this.uid
      , b = bds[uid]
      , pb;

    delete this.uid;
    if (!b) {
      b = bds[uid] = this.addBreadcrumbs();
    }

    if (b) {
      this.updateBreadcrumbs(uid);
    }

    if (uid !== puid) {
      pb = bds[puid];
      if (pb) {
        pb.setMap(null);
        delete bds[puid];
        pb = null;
        //pb.setVisible(false);
      }
      if (b) {
        b.setVisible(true);
        this.uid = uid;
      }
    } else {
      if (b) {
        var v = !b.getVisible();
        b.setVisible(v);
        if (v) { this.uid = uid; }
        else {
          b.setMap(null);
          delete bds[uid];
          b = null;
        }
      }
    }
    Debugger.log('current breadcrumbs', uid);
  };

  proto.addPoint = function (data) {
    var self = this
      , GMaps = google.maps
      , map = this.map
      , myIdentity = this.myIdentity
      , m = new GMaps.Marker({
          map: map
        , zIndex: MAX_INDEX - 5
        , icon: new GMaps.MarkerImage(
              data.icon || (apiv3_url + '/icons/mapmark')
            , new GMaps.Size(48, 68)
            , new GMaps.Point(0, 0)
            , new GMaps.Point(12, 34)
            , new GMaps.Size(24, 34)
          )
      });

    return m;
  };

  proto.contains = function () {
    var mapBounds = this.map.getBounds()
      , GMaps = google.maps
      , sw = mapBounds.getSouthWest()
      , ne = mapBounds.getNorthEast()
      , bounds = new GMaps.LatLngBounds()
      , geoMarkers = this.geoMarkers
      , ids = document.getElementById('identities')._ids || {}
      , uid, gm, latlng;

    sw = this.fromLatLngToContainerPixel(sw);
    sw = this.fromContainerPixelToLatLng(new GMaps.Point(sw.x + 50, sw.y));

    bounds.extend(sw);
    bounds.extend(ne);

    for (uid in geoMarkers) {
      gm = geoMarkers[uid];
      latlng = gm.getPosition();
      this.containsOne(uid, latlng, bounds, ids);
    }

    Debugger.log('map zoom', this.map.getZoom());
  };

  proto.containsOne = function (uid, latlng, bounds, ids, b) {
    if (!bounds) {
      bounds = this.map.getBounds();
    }
    if (!ids) {
      ids = document.getElementById('identities')._ids || {};
    }
    if (bounds.contains(latlng) && (b = ids[uid])) {
      //this.showTipline(uid, b);
      var p = this.fromLatLngToContainerPixel(latlng);
      var line = this.lines[uid];
      if (!line) { line =  []; }
      line[0] = [b[1], b[2]];
      line[1] = [b[1] + 13, b[2]];
      line[2] = [p.x, p.y];
      this.updateLine(uid, line);
    } else {
      //this.hideTipline(uid);
      this.removeLine(uid);
    }
  };

  /*
  proto.hideTiplines = function () {
    var tls = this.tiplines, uid;
    for (uid in tls) {
      this.hideTipline(uid);
    }
  };

  proto.updateTipline = function (uid, latlng) {
    var tl = this.tiplines[uid];
    if (!tl) {
      tl = this.tiplines[uid] = this.addTipline(uid);
    }
    if (latlng) {
      this.containsOne(uid, tl._lastlatlng = latlng);
    }
  };

  proto.addTipline = function (uid) {
    var tl = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');

    tl.setAttribute('fill', 'none');
    // 更改用户状态：在线-粉红，离线-灰色
    tl.setAttribute('stroke', '#b2b2b2');
    tl.setAttribute('stroke-width', 1);
    tl.setAttribute('stroke-linecap', 'round');
    tl.setAttribute('stroke-linejoin', 'round');
    tl.setAttribute('style', '-webkit-filter: drop-shadow(12px 12px 7px rgba(0,0,0,0.5));');
    tl.setAttributeNS(null, 'display', 'none');
    this.svgLayer.appendChild(tl);
    return tl;
  };

  proto.showTipline = function (uid, bound) {
    var tl = this.tiplines[uid], p, startPoints;
    if (!tl) { return; }
    var f = [bound[1], bound[2]]
      , s = [f[0] + 13, f[1]]
      , points = [f.join(','), s.join(',')].join(' ')
      , p = this.fromLatLngToContainerPixel(tl._lastlatlng);
    tl.setAttribute('points', points  + ' ' + p.x + ',' + p.y);
    tl.setAttributeNS(null, 'display', 'block');
  };

  proto.hideTipline = function (uid) {
    var tl = this.tiplines[uid];
    if (!tl) { return; }
    tl.setAttributeNS(null, 'display', 'none');
  };
  */
  proto.clearLines = function () {
    //this.canvas.width = this.canvas.width;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
  proto.removeLine = function (uid) {
    delete this.lines[uid];
    this.updateLines();
  };
  proto.updateLines = function () {
    if (!this.DRAW_STATUS) { return; }
    this.clearLines();
    var lines = this.lines;
    for (var k in lines) {
      this.addLine(k, lines[k]);
    }
  };
  proto.updateLine = function (uid, points) {
    Debugger.dir('update line', points);
    this.lines[uid] = points;
    this.updateLines();
  };
  proto.addLine = function (uid, points) {
    var ctx = this.ctx;
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.moveTo(points[0][0] * 2, points[0][1] * 2);
    ctx.lineTo(points[1][0] * 2, points[1][1] * 2);
    ctx.lineTo(points[2][0] * 2, points[2][1] * 2);
    ctx.strokeStyle = points[3] || '#b2b2b2';
    ctx.stroke();
  };

  proto.updateGeoLocation = function (uid, position) {
    var geoLocation = this.geoLocation, latlng, gps;
    if (!geoLocation) {
      // status: 0-init, 1-last-latlng, 2: new-latlng
      geoLocation = this.geoLocation = new google.maps.GeoMarker({
          id: 'gp-smarker'
        , width: 22
        , height: 22
        , map: this.map
      });
      geoLocation._status = 0;
      var lastlatlng = JSON.parse(window.localStorage.getItem('position'));
      if (lastlatlng) {
        lastlatlng = this.toMars(lastlatlng, true);
        gps = lastlatlng.gps;
        geoLocation._status = 1;
        latlng = this.toLatLng(gps[0], gps[1]);
        geoLocation.setPosition(latlng);
        this.map.setZoom(15);
        this.map.panTo(latlng);
      }
    }
    if (position) {
      position = this.toMars(position, true);
      gps = position.gps;
      latlng = this.toLatLng(gps[0], gps[1])
      geoLocation.setStatus(true);
      geoLocation.setPosition(latlng);
      if (2 !== geoLocation._status) {
        this.map.setZoom(15);
        this.map.panTo(latlng);
      }
      geoLocation._status = 2;
    }
    if (uid) {
      this.updated[uid] = position || lastlatlng;
    }
    var dsnt = this.destinationPlace;
    geoLocation.toggleDsntCircle(!!dsnt);
    if (dsnt) {
      var d = dsnt.getPosition()
        , r = bearing(latlng.lat(), latlng.lng(), d.lat(), d.lng());
      geoLocation.setDsntRotate(r);
    }
    geoLocation._uid = uid;
  };

  proto.toMars = function (position, fresh) {
    var gps = position.gps;
    var p = {
          t: fresh ? Math.floor(Date.now() / 1000) : position.t
        , gps: [
              gps[0] * 1 + this.latOffset
            , gps[1] * 1 + this.lngOffset
            , gps[2]
          ]
      };
    return p;
  };

  // status: 0-grey, 1-blue
  proto.switchGEOStyle = function (status) {
    var geoLocation = this.geoLocation;
    if (geoLocation) {
      geoLocation.setStatus(status);
    }
  };

  return RoutexMaps;

});
