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
        } else if (n < 9000) {
          r.text = (n / 1000 + '').slice(0, 3) + t.replace('{{u}}', '公里');
        } else {
          r.text = 9 + '+' + t.replace('{{u}}', '公里');
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
    , DESTINATION = 'destination'
    , BREADCRUMBS = 'breadcrumbs'
    , PARK = 'park'
    , TIME_STEPS = [0, 1, 3, 5, 10, 15];


  function RoutexMaps(options) {
    options = this.options = options || {};
    this.svgLayer = this.options.svg;
    delete this.options.svg;

    this.latOffset = 0;
    this.lngOffset = 0;

    this.routes = {};
    this.places = {};
    this.tiplines = {};
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

    window._loadmaps_ = function (rm, mapDiv, mapOptions, callback) {

      return function cb() {
        var GMaps = google.maps
          , GEvent = GMaps.event;

        GMaps.InfoBox = require('infobox');
        GMaps.TextLabel = require('maplabel');

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
        icons.arrowBlue = new GMaps.MarkerImage(
              SITE_URL + '/static/img/map_arrow_22blue@2x.png'
            , new GMaps.Size(44, 44)
            , new GMaps.Point(0, 0)
            , new GMaps.Point(11, 11)
            , new GMaps.Size(22, 22)
          );
        icons.arrowGrey = new GMaps.MarkerImage(
              SITE_URL + '/static/img/map_arrow_22g5@2x.png'
            , new GMaps.Size(44, 44)
            , new GMaps.Point(0, 0)
            , new GMaps.Point(11, 11)
            , new GMaps.Size(22, 22)
          );
        icons.placeMarker = new GMaps.MarkerImage(
              apiv3_url + '/icons/mapmark'
            , new GMaps.Size(44, 44)
            , new GMaps.Point(0, 0)
            , new GMaps.Point(11, 11)
            , new GMaps.Size(22, 22)
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
          });

          GEvent.addListener(map, 'mousedown', function (e) {
            e.stop();
            rm.hideIdentityPanel();
          });

          function clear(t) {
            clearTimeout(t);
            t = null;
          }

          /*
          GEvent.addDomListener(mapDiv, 'mousedown', function (e) {
            MD_TIME = Date.now();
            clear(t);
            t = setTimeout(function () {
              e.stop();
              rm.showNearBy(e);
            }, time);
          });
          */

          var time = 377, t, MD_TIME;
          GEvent.addDomListener(mapDiv, 'touchstart', function (e) {
            console.dir(e)
            rm.hideMyPanel();
            rm.hideNearBy();

            MD_TIME = Date.now();
            clear(t);
            t = setTimeout(function () {
              e.preventDefault();
              var touch = e.touches[0]
                , point = { x: touch.pageX, y: touch.pageY };
              rm.showNearBy(point);
            }, time);

            GEvent.clearListeners(mapDiv, 'touchmove');
            GEvent.addDomListenerOnce(mapDiv, 'touchmove', function () {
              clear(t);
              rm.hideTiplines();
            });
          });
          GEvent.addDomListener(mapDiv, 'touchend', function () {
            if (Date.now() - MD_TIME < 377) {
              clear(t);
            }
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

  proto.showIdentityPanel = function (uid) {
    this.hideNearBy();
    var gm = this.geoMarkers[uid]
      , geoLocation = this.geoLocation
      , destinationPlace = this.destinationPlace
      , identity = $('#identities-overlay .identity[data-uid="' + uid + '"]').data('identity')
      , $otherInfo = $('#other-info')
      , now = Math.round(Date.now() / 1000)
      , p, t;
    if (gm) {
      p = gm.getPosition();
      t = Math.floor((now - gm.data.positions[0].t) / 60);
      $otherInfo.find('.name').text(identity.name);
      if (t > 1) {
        $otherInfo.find('.update')
          .removeClass('hide')
          .find('.time')
          .text(t);
        $otherInfo.find('.please-update')
          .attr('data-external-username', identity.external_username)
          .attr('data-provider', identity.provider)
          .removeClass('hide');
      } else {
        $otherInfo.find('.update').addClass('hide');
        $otherInfo.find('.please-update').addClass('hide');
      }
      if (destinationPlace) {
        var p2 = destinationPlace.getPosition();
        var d = distance(p2.lat(), p2.lng(), p.lat(), p.lng())
          //, r = bearing(lat2, lng2, lat1, lng1)
          , result = distanceOutput(d, true);
        $otherInfo.find('.dest').removeClass('hide')
          .find('.m').html(result.text);
      } else {
        $otherInfo.find('.dest').addClass('hide');
      }
      if (geoLocation) {
        var p2 = geoLocation.getPosition();
        var d = distance(p2.lat(), p2.lng(), p.lat(), p.lng())
          //, r = bearing(lat2, lng2, lat1, lng1)
          , result = distanceOutput(d, true);
        $otherInfo.find('.dest-me').removeClass('hide')
          .find('.m').html(result.text);
      } else {
        $otherInfo.find('.dest-me').removeClass('hide');
      }

      $otherInfo.removeClass('hide');

      var w = $(window).width();
      var h = $(window).height();
      var oh = $otherInfo.height();
      var ow = $otherInfo.width();
      var point = this.fromLatLngToContainerPixel(p);
      var left = point.x - ow / 2;
      var top = point.y - oh / 2;

      if (left < 0) { left = 50; }
      if (left + ow > w) { left = w - ow; }
      if (top < 0) { top = 20; }
      if (top + oh > h) { top = h - oh; }

      $otherInfo.css({ left: left, top: top });
    }
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
  proto.distance100px = function (p0, b) {
    var a = this.fromLatLngToContainerPixel(p0)
      , d = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    return d <= 100;
  };
  proto.showNearBy = function (point) {
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
        , list = []
        , now = Date.now() / 1000
        , latlng
        , uid, p;
      console.log('-----------------------', geoPosition, destinationPosition);

      var nbDiv = $(NEARBY_TMP);

      for (var k in places) {
        p = places[k];
        latlng = p.getPosition()
        if (this.distance100px(latlng, center)) {
          if (!status) { status = true; }
          var tmp = $(PLACE_TMP);
          tmp.find('.title').text(p.data.title);
          tmp.find('.description').text(p.data.description);
          nbDiv.append($('<div></div>').append(tmp));
        }
      }

      for (var k in geoMarkers) {
        p = geoMarkers[k];
        latlng = p.getPosition();
        if (this.distance100px(latlng, center)) {
          if (!status) { status = true; }
          var id = p.data.id.split('@')[0];
          var identity = $('#identities-overlay .identity[data-uid="' + k + '"]').data('identity');
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
              str += '<span>距离目的地' + dd + '</span>';
            }
            if (dm) {
              str += '<span>与您相距' + dm + '</span>'
            }
          } else {
            str += '<span>' + n + '分钟前所处位置</span>'
            if (dd) {
              str += '<span>距离目的地' + dd + '</span>';
            }
          }
          if (str) {
            tmp.find('.status').html(str);
          }

          nbDiv.append($('<div></div>').append(tmp));
        }
      }

      if (status) {
        var width = $(window).width()
          , height = $(window).height();
        nbDiv.css({
            left: (width - 200 + 50) / 2
          , top: (height - 132) / 2
        });
        $('#routex').append(nbDiv);
      }
    }
  };

  proto.draw = function (data) {
    var type = data.type
      , action = data.action
      , isDelete = action && action === 'delete'
      , hasTags = data.tags
      , tags = hasTags && data.tags.slice(0)
      , tag;

    console.log(type, action, isDelete, tags, data);
    switch (type) {
      case LOCATION:
        var isDestination;

        if (hasTags) {
          while ((tag = tags.shift())) {
            if (tag === DESTINATION) {
              isDestination = true;
              /*
              var i = data.tags.indexOf('cross_place');
              if (i > 0) {
                data.tags.splice(i, 1);
              }
              */
              break;
            }
          }
        }

        isDelete ? this.removePlace(data, isDestination) : this.drawPlace(data, isDestination);
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

  proto.removePlace = function (data, isDestination) {
    var places = this.places, id = data.id, p = places[id];
    if (p) {
      p.setMap(null);
      p = null;
      delete places[id];
      if (isDestination) {
        this.destinationPlace = null;
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

  proto.drawPlace = function (data, isDestination) {
    var places = this.places
      , id = data.id, p, d, latlng;
    if (places.hasOwnProperty(id)) {
      p = places[id];
    }

    if (!p) {
      p = places[id] = this.addPoint(data, isDestination);
    }

    latlng = this.toLatLng(data.lat, data.lng);

    p.setPosition(latlng);
    p.data = data;

    if (isDestination) {
      // 如果还没 GPS 自动定位到 destination
      var geoLocation = this.geoLocation;
      if (!geoLocation || (geoLocation && geoLocation._status == 0)) {
        this.panToDestination(latlng);
      }
      if (this.destinationPlace && this.destinationPlace !== p) {
        delete this.destinationPlace.isDestination;
        this.destinationPlace.setIcon(this.icons.placeMarker);
        this.destinationPlace = p;
      }
      p.setZIndex(MAX_INDEX);
    }
  };

  proto.monit = function () {
    var u = this.updated
      , bs = this.breadcrumbs
      , icons = this.icons
      , gms = this.geoMarkers
      , tiplines = this.tiplines
      , dp = this.destinationPlace
      , geo = this.geoLocation
      , myUserId = this.myUserId
      , curr_uid = this.uid
      , uid, isme, d, now = Math.round(Date.now() / 1000)
      , gm, b, $e, tl, n;

    for (uid in u) {
      if (u.hasOwnProperty(uid)) {
        d = u[uid];
        isme = myUserId == uid;
        n = Math.floor((now - d.t) / 60);
        gm = isme ? geo : gms[uid];
        this.distanceMatrix(uid, gm ,dp, n);

        b = bs[uid];
        tl = tiplines[uid];
        $e = $('#identities-overlay .identity[data-uid="' + uid + '"]').find('.icon');

        if (curr_uid && (curr_uid == uid) && this._breadcrumbs[curr_uid]) {
          this.showTextLabels(curr_uid, this._breadcrumbs[curr_uid].positions.slice(0), n <= 1);
        }

        if (n <= 1) {

          if ($e.length) {
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
                      , fillColor: '#FF7E98'
                      , fillOpacity: .8
                      , strokeColor: '#fff'
                      , strokeOpacity: .8
                      , strokeWeight: 1
                      , scale: .5
                    }
                  , repeat: '50px'
                  , offset: '0'
                }
              ]
          });
          if (isme) { continue; }
          tl && tl.setAttribute('stroke', '#FF7E98');
          gm && gm.setIcon(icons.dotRed);
        } else {
          if ($e.length) {
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
                      , fillColor: '#b2b2b2'
                      , fillOpacity: .8
                      , strokeColor: '#fff'
                      , strokeOpacity: .8
                      , strokeWeight: 1
                      , scale: .5
                    }
                  , repeat: '50px'
                  , offset: '0'
                }
              ]
          });
          if (isme) { continue; }
          tl && tl.setAttribute('stroke', '#b2b2b2');
          gm && gm.setIcon(icons.dotGrey);
        }
      }
    }
  };

  proto.toLatLng = function (lat, lng) {
    return new google.maps.LatLng(lat * 1, lng * 1);
  };

  proto.drawBreadcrumbs = function (data) {
    var bs = this.breadcrumbs, uid = data.uid;
  };

  proto.drawGeoMarker = function (data) {
    var gms = this.geoMarkers
      , uid = data.id.split('@')[0]
      , g, d, latlng, gps;

    this.updatePositions(data);
    if (uid != this.myUserId) {
      if (gms.hasOwnProperty(uid)) {
        g = gms[uid];
        d = g.data;
        // no update
        if (d.updated_at === data.updated_at) {
          return;
        }
      }
      if (!g) {
        g = gms[uid] = this.addGeoMarker();
      }
      gps = data.positions[0].gps;
      latlng = this.toLatLng(gps[0], gps[1]);
      g.setPosition(latlng);
      g.uid = uid;
      g.data = data;

      this.updateTipline(uid, latlng);
    }
  };

  proto.updatePositions = function (data) {
    // user_id@provider
    var id = data.id.split('@')[0]
    if (!this._breadcrumbs[id]) {
      this._breadcrumbs[id] = data;
    } else {
      this._breadcrumbs[id].positions.unshift(data.positions[0])
    }
    this.updated[id] = this._breadcrumbs[id].positions[0];
  };

  proto.addGeoMarker = function () {
    var self = this
      , gm = new google.maps.Marker({
            map: this.map
          , animation: 2
          , zIndex: MAX_INDEX - 2
          , icon: this.icons.dotGrey
          , shape: {
                type: 'circle'
              , circle: [9, 9, 9]
            }
          , optimized: false
        });

    google.maps.event.addListener(gm, 'mousedown', function () {
      self.showIdentityPanel(this.uid);
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
        , r = bearing(lat2, lng2, lat1, lng1)
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
      $distance.html(
        time <= 1 ? '在线' :
          ((time >= 9 ? '9+' : time) + '<span class="unit">分钟前</span>')
      );
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
    var color = '#b2b2b2'
      , alpha = 0.8
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
                , strokeOpacity: .8
                , strokeWeight: 1
                , scale: .5
              }
            , fixedRotation: true
            , repeat: '50px'
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
        , end = 2 * 60
        , i = 0
        , ignore = 0
        , label
        , marker
        , p, t, n, prev;

      while ((p = ps.shift())) {
        t = Math.floor((now - p.t) / 600) * 10;

        if (ignore === t) { continue; }

        ignore = t;

        if (t > end) { break; }

        if (prev) {
          b = this.distanceMatrixPixl(p.gps, prev.gps);
        }

        if (t > start && b && (TIME_STEPS.indexOf(t) != -1 || t > 15)) {
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
              , fillColor: bool ? '#FF7E98' : '#b2b2b2'
              , fillOpacity: .8
              , strokeColor: '#fff'
              , strokeOpacity: .8
              , strokeWeight: 1
              , scale: .5
            });
          }
          label.set('text', t + '分钟前');
          prev = p;
          i++;
        }
      }

      for (var len = labels.length - 1; len > i; len--) {
        label = labels[len];
        if (label) {
          label.setMap(null);
        }
        labels.splice(len, 1);
      }
    }
  };

  proto.removeTextLabels = function () {
    var labels = this.labels, label;
    while ((label = labels.shift())) {
      label.setMap(null);
    }
    labels.length = 0;
  };

  proto.updateBreadcrumbs = function (uid) {
    var data, b, p, gps, coords = [];
    if (!(data = this._breadcrumbs[uid])) { return; }
    var positions0 = data.positions.slice(0);
    var positions1 = positions0.slice(0);
    this.showTextLabels(uid, positions0);

    if ((b = this.breadcrumbs[uid])) {
      while ((p = positions1.pop())) {
        gps = p.gps;
        coords.push(this.toLatLng(gps[0], gps[1]));
      }
      b.setPath(coords);
    }
  };

  proto.showBreadcrumbs = function (uid) {
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
        pb.setMap(null)
        delete bds[puid];
        pb = null;
        this.removeTextLabels();
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
          this.removeTextLabels();
        }
      }
    }
    console.log('current breadcrumbs', uid);
  };

  proto.addPoint = function (data, isDestination) {
    var self = this
      , GMaps = google.maps
      , map = this.map
      , myIdentity = this.myIdentity
      , m = new GMaps.Marker({
          map: map
        , animation: 2
        //, visible: false
        , zIndex: MAX_INDEX - 5
        , icon: new GMaps.MarkerImage(
              data.icon || (apiv3_url + '/icons/mapmark')
            , new GMaps.Size(48, 68)
            , new GMaps.Point(0, 0)
            , new GMaps.Point(12, 34)
            , new GMaps.Size(24, 34)
          )
        //, optimized: false
      })
    , GEvent = GMaps.event;

    m.isDestination = isDestination;

    GEvent.addListener(m, 'mousedown', function mousedown(e) {
      e && e.stop();

      if (self.removeInfobox(this)) { return false; }

      var infobox = self.infobox = new GMaps.InfoBox({
          content: self.infoWindowTemplate.replace('{{title}}', this.data.title).replace('{{description}}', this.data.description)
        , maxWidth: 200
        , pixelOffset: new GMaps.Size(-100, -38)
        , boxClass: 'park'
        , closeBoxMargin: ''
        , closeBoxURL: ''
        , alignBottom: true
        , enableEventPropagation: false
        , leftBoundary: 60
        , zIndex: 610
        , boxId: 'place-editor'
        , events: function () {
            //if (isDestination) {
              var ib = this;
              ib.editing = false;
              GEvent.addDomListener(this.div_, 'touchstart', function () {
                if (ib.editing) { return; }
                var infoWindown = this.querySelector('.info-windown');
                var title = this.querySelector('.title').innerHTML;
                var description = this.querySelector('.description').innerHTML;
                var ct = document.createElement('input');
                ct.type = 'text';
                ct.value = title;
                var cd = document.createElement('textarea');
                cd.value = description;
                infoWindown.appendChild(ct)
                infoWindown.appendChild(cd)
                this.querySelector('.title').className = 'title hide';
                this.querySelector('.description').className = 'description hide';
                ib.editing = true;
              });
            //}
          }
      });
      infobox._marker = this;
      infobox.open(map, this);

      GEvent.addListenerOnce(this, 'mouseout', function mouseout() {
        if (infobox.editing) {
          var data = infobox._marker.data;
          var title = $('#place-editor input').val().trim();
          var description = $('#place-editor textarea').val().trim();
          data.title = title;
          data.description = description;
          data.updated_at = Math.round(Date.now() / 1000);
          data.updated_by = myIdentity.external_username + '@' + myIdentity.provider;
          $('#place-editor input, #place-editor textarea').remove();
          $('#place-editor .title').text(title).removeClass('hide');
          $('#place-editor .description').text(description).removeClass('hide');
          self.controller.editPlace(data);
        }
        infobox.close();
        delete infobox._marker;
        infobox = self.infobox = null;
      });
    });

    return m;
  };

  proto.removeInfobox = function (marker) {
    var infobox = this.infobox, m;
    if (infobox) {
      m = infobox._marker;
      infobox.close();
      delete infobox._marker;
      infobox = this.infobox = null;
      if (m === marker) { return true; }
    }
  };

  proto.infoWindowTemplate = '<div class="info-windown"><h2 class="title">{{title}}</h2><div class="description">{{description}}</div></div>';

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

    /*
    if (this.uid) {
      this.updateBreadcrumbs(this.uid);
    }
    */
    console.log('map zoom', this.map.getZoom());
  };

  proto.containsOne = function (uid, latlng, bounds, ids, b) {
    if (!bounds) {
      bounds = this.map.getBounds();
    }
    if (!ids) {
      ids = document.getElementById('identities')._ids || {};
    }
    if (bounds.contains(latlng) && (b = ids[uid])) {
      this.showTipline(uid, b);
    } else {
      this.hideTipline(uid);
    }
  };

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

  proto.updateGeoLocation = function (uid, position) {
    var geoLocation = this.geoLocation, latlng, gps;
    if (!geoLocation) {
      // status: 0-init, 1-last-latlng, 2: new-latlng
      geoLocation = this.geoLocation = new google.maps.Marker({
          map: this.map
        , zIndex: MAX_INDEX - 1
        , visible: true
        /**
         * google.maps.Animation
         *  BOUNCE: 1
         *  DROP: 2
         *  b: 4
         *  d: 3
         */
        , animation: 2
        , icon: this.icons.arrowGrey
        , shape: {
              type: 'rect'
            , rect: [0, 0, 22, 22]
          }
        , optimized: false
      });
      geoLocation._status = 0;
      var lastlatlng = JSON.parse(window.localStorage.getItem('position'));
      if (lastlatlng) {
        gps = lastlatlng.gps;
        geoLocation._status = 1;
        latlng = this.toLatLng(gps[0] * 1 + this.latOffset, gps[1] * 1 + this.lngOffset);
        geoLocation.setPosition(latlng);
        this.map.setZoom(15);
        this.map.panTo(latlng);
      }
    }
    if (position) {
      gps = position.gps;
      latlng = this.toLatLng(gps[0] * 1 + this.latOffset, gps[1] * 1 + this.lngOffset)
      geoLocation.setIcon(this.icons.arrowBlue);
      geoLocation.setPosition(latlng);
      if (2 !== geoLocation._status) {
        this.map.setZoom(15);
        this.map.panTo(latlng);
      }
      geoLocation._status = 2;

      if (uid && position) {
        this.updatePositions({ id: String(uid), positions: [position] });
      }
    }
    if (uid) {
      this.updated[uid] = position || lastlatlng;
    }
    geoLocation._uid = uid;
  };

  // status: 0-grey, 1-blue
  proto.switchGEOStyle = function (status) {
    var geoLocation = this.geoLocation;
    if (geoLocation) {
      geoLocation.setIcon(this.icons['arrow' + (status ? 'Blue' : 'Grey')]);
    }
  };

  return RoutexMaps;

});
