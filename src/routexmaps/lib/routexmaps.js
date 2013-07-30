  define('routexmaps', function (require) {

  'use strict';

  var SITE_URL = window._ENV_.site_url
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
    , distanceOutput = function (n, s, t, r) {
        t = '<span class="unit">{{u}}</span>';
        n = Math.floor(n);
        r = {
            text: ''
          , status: 0
          , distance: n
        };
        if (n < 30) {
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

    // tags
    , DESTINATION = 'destination'
    , ROUTE = 'route'
    , PARK = 'park';


  function RoutexMaps(options) {
    options = this.options = options || {};
    this.svgLayer = this.options.svg;
    delete this.options.svg;

    this.latOffset = 0;
    this.lngOffset = 0;

    this.routes = {};
    this.places = {};
    this.locations = {};
    this.tiplines = {};
    this.breadcrumbs = {};
    this.geoMarkers = {};
    this.icons = {};

    this.updated = {};

    this.boundsOffset = {
        left: 50
      , top: 0
    };

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
              SITE_URL + '/static/img/map_arrow_blue@2x.png'
            , new GMaps.Size(40, 40)
            , new GMaps.Point(0, 0)
            , new GMaps.Point(10, 10)
            , new GMaps.Size(20, 20)
          );
        icons.arrowGrey = new GMaps.MarkerImage(
              SITE_URL + '/static/img/map_arrow_g5@2x.png'
            , new GMaps.Size(40, 40)
            , new GMaps.Point(0, 0)
            , new GMaps.Point(10, 10)
            , new GMaps.Size(20, 20)
          );

        // hdpi
        GMaps.visualRefresh = true;
        // defaults to China
        mapOptions.center = rm.toLatLng(35.86166, 104.195397);
        mapOptions.mapTypeId = GMaps.MapTypeId.ROADMAP;
        mapOptions.disableDefaultUI = true;
        mapOptions.minZoom = 2;

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

          GEvent.addDomListener(mapDiv, 'touchstart', function () {
            GEvent.clearListeners(mapDiv, 'touchmove');
            GEvent.addDomListenerOnce(mapDiv, 'touchmove', function () {
              rm.hideTiplines();
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

  proto.draw = function (type, data) {
    console.log(type, data);
    if (type === 'geomarks') {
      var rs = [], ps = [], item, st, k;
      data = data.slice(0);
      while ((item = data.shift())) {
        st = item.type;
        if (st === 'route') {
          rs.push(item);
        } else if (st === 'location') {
          ps.push(item);
        }
      }

      // draw route
      this.drawRoutes(rs);

      // draw place
      this.drawPlaces(ps);

    } else if (type === 'breadcrumbs') {
      // draw identity path
      this.drawIdentityPaths(data);
    }
  };

  proto.drawRoutes = function (rs) {
    var routes = this.routes, r, k, item;
    for (k in routes) {
      r = routes[k];
      r.setMap(null);
      r = null;
      delete routes[k];
    }
    if (rs.length) {
      while ((item = rs.shift())) {
        this.addRoute(item);
      }
    }
  };

  proto.addRoute = function (data) {
    var coords = [], uid = data.created_by, positions = data.positions.slice(0), p, route;

    route = this.routes[uid] = this.addPolyline(data);

    while ((p = positions.shift())) {
      coords.push(this.toLatLng(p.latitude, p.longitude));
    }

    route.setPath(coords);
  };

  proto.addPolyline = function (data) {
    var rgba = (data.color && data.color.split(',')) || []
      , color = '#' + (rgba.length ? pad0(toHex(rgba[0])) + pad0(toHex(rgba[1])) + pad0(toHex(rgba[2])) : '007BFF')
      , alpha = rgba[3] || 1
      , p = new google.maps.Polyline({
            map: this.map
          , index: MAX_INDEX - 4
          , geodesic: true
          , strokeColor: color
          , strokeWeight: 4
          , strokeOpacity: alpha
        });
    return p;
  };

  proto.drawPlaces = function (ps) {
    var places = this.places, p, k, item;
    // reset destination place
    this.destinationPlace = null;
    for (k in places) {
      p = places[k];
      p.setMap(null);
      p = null;
      delete places[k];
    }
    if (ps.length) {
      while ((item = ps.shift())) {
        this.addPlace(item);
      }
    }
  };

  proto.addPlace = function (data) {
    var id = data.id
      , latlng = this.toLatLng(data.latitude, data.longitude)
      , place, tags, tag;

    place = this.places[id] = this.addPoint(data);
    place.setPosition(latlng);

    if (!this.destinationPlace) {
      tags = data.tags.slice(0);
      while ((tag = tags.shift())) {
        if (DESTINATION === tag) {
          // 如果还没 GPS 自动定位到 destination
          var geoLocation = this.geoLocation;
          if (!geoLocation || (geoLocation && geoLocation._status == 0)) {
            this.panToDestination(latlng);
          }
          place.setZIndex(MAX_INDEX);
          this.destinationPlace = place;
          return;
        }
      }
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
      , myuid = this.myuid
      , uid, isme, d, now = Math.round((new Date()).getTime() / 1000), n;
    var gm, b, $e, tl;
    for (uid in u) {
      if (u.hasOwnProperty(uid)) {
        d = u[uid];
        isme = myuid === uid;
        n = Math.floor((now - d.timestamp) / 60);
        gm = isme ? geo : gms[uid];
        this.distanceMatrix(uid, gm ,dp, n);

        b = bs[uid];
        tl = tiplines[uid];
        $e = $('#identities-overlay .identity[data-uid="' + uid + '"]').find('.icon');
        console.log(n)
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

  proto.toLatLng = function (latitude, longitude) {
    return new google.maps.LatLng(latitude * 1, longitude * 1);
  };

  proto.drawIdentityPaths = function (data) {
    var bs = this.breadcrumbs, dp = this.destinationPlace
      , uid, b, d, p, positions, coords, gm;
    for (uid in data) {
      d = data[uid];
      b = bs[uid];
      positions = d.slice(0);

      coords = [];
      while ((p = positions.shift())) {
        coords.push(this.toLatLng(p.latitude, p.longitude));
      }

      if (!b) {
        b = bs[uid] = this.addBreadcrumbs();
      }

      b.setPath(coords);

      gm = this.drawGeoMarker(uid, d[0], coords[0]);

      this.distanceMatrix(uid, gm, dp);
    }
  };

  proto.drawGeoMarker = function (uid, data, latlng) {
    var gm;
    this.updated[uid] = data;
    if (this.myuid === uid) {
      return this.geoLocation;
    }
    gm = this.geoMarkers[uid];
    if (!gm) {
      gm = this.geoMarkers[uid] = this.addGeoMarker();
    }
    gm.setPosition(latlng);

    this.updateTipline(uid, latlng);
    return gm;
  };

  proto.addGeoMarker = function () {
    var gm = new google.maps.Marker({
        map: this.map
      , animation: 3
      , zIndex: MAX_INDEX - 2
      , icon: this.icons.dotGrey
    });
    return gm;
  };

  proto.distanceMatrix = function (uid, gm, dp, time) {
    time = time || 0;
    console.log(uid, 'destination', dp, gm);
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

      console.log(d, r, lat1, lng1, lat2, lng2);

      result.rotate = r;

      $distance.html(result.text);
      $icon.css('-webkit-transform', 'rotate(' + r + 'deg)');
      $icon.attr('class', 'icon icon-arrow-' + (time <= 1 ? 'red' : 'grey'));
      $detial.css('visibility', 'visible');
    } else if (gm) {
      if (!$icon.hasClass('icon-dot-red') && !$icon.hasClass('icon-dot-red')) {
        $icon.attr('class', 'icon icon-dot' + (time <= 1 ? 'red' : 'grey'));
      }
      $distance.html((time >= 9 ? '9+' : time) + '<span class="unit">分钟前</span>');
      $detial.css('visibility', 'visible');
    } else {
      $detial.css('visibility', 'hidden');
    }
  };

  proto.fitBoundsWithDestination = function (uid) {
    console.log('fit bounds with destination');
    var destinationPlace = this.destinationPlace
      , isme = this.myuid === uid
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
          bounds = new google.maps.LatLngBounds()
          if (p.x < 50) {
            p = this.fromContainerPixelToLatLng(new google.maps.Point(p.x - 50, p.y));
            bounds.extend(p);
          }

          bounds.extend(gmlatlng);
          bounds.extend(dlatlng);
        }

        map.fitBounds(bounds);
      } else {
        if (!map.getBounds().contains(gmlatlng)) {
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

  proto.addBreadcrumbs = function (uid, positions) {
    var color = '#b2b2b2'
      , alpha = 0.8
      , p = new google.maps.Polyline({
        map: this.map
      , visible: false
      , index: MAX_INDEX - 3
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

  proto.showTextLabels = function (positions) {};

  proto.showBreadcrumbs = function (uid) {
    var bds = this.breadcrumbs
      , puid = this.uid
      , b = bds[uid]
      , pb;
    if (uid !== puid) {
      pb = bds[puid];
      if (pb) {
        pb.setVisible(false);
      }
      if (b) {
        b.setVisible(true);
      }
    } else {
      if (b) {
        b.setVisible(!b.getVisible());
      }
    }
    this.uid = uid;
    console.log('showBreadcrumbs', puid, uid);
  };

  proto.addPoint = function (data) {
    var self = this
      , GMaps = google.maps
      , map = this.map
      , m = new GMaps.Marker({
          map: map
        , animation: 2
        //, visible: false
        , zIndex: MAX_INDEX - 4
        , icon: new GMaps.MarkerImage(
              data.icon
            , new GMaps.Size(48, 68)
            , new GMaps.Point(0, 0)
            , new GMaps.Point(12, 34)
            , new GMaps.Size(24, 34)
          )
      })
    , GEvent = GMaps.event;

    GEvent.addListener(m, 'mousedown', function mousedown(e) {
      e && e.stop();

      if (self.removeInfobox(this)) { return false; }

      var infobox = self.infobox = new GMaps.InfoBox({
          content: self.infoWindowTemplate.replace('{{title}}', data.title).replace('{{description}}', data.description)
        , maxWidth: 200
        , pixelOffset: new GMaps.Size(-80, -38)
        , boxClass: 'park'
        , closeBoxMargin: ''
        , closeBoxURL: ''
        , alignBottom: true
        , enableEventPropagation: false
        , leftBoundary: 60
        , zIndex: 610
      });
      infobox._marker = this;
      infobox.open(map, this);

      GEvent.addListenerOnce(this, 'mouseout', function mouseout() {
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

  proto.getPointsBounds = function () {
    var locations = this.locations, k, bounds = new google.maps.LatLngBounds();
    for (k in locations) {
      bounds.union(locations[k]._bounds);
    }
    return bounds;
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
    var breadcrumbs = this.breadcrumbs[uid]
      , tl = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');

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
    var geoLocation = this.geoLocation, latlng;
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
      });
      geoLocation._status = 0;
      var lastlatlng = JSON.parse(window.localStorage.getItem('last-latlng'));
      if (lastlatlng) {
        geoLocation._status = 1;
        latlng = this.toLatLng(lastlatlng.lat * 1 + this.latOffset, lastlatlng.lng * 1 + this.lngOffset);
        geoLocation.setPosition(latlng);
        this.map.setZoom(15);
        this.map.panTo(latlng);
        console.log('init position', lastlatlng);
      }
    }
    if (position) {
      latlng = this.toLatLng(position.latitude * 1 + this.latOffset, position.longitude * 1 + this.lngOffset)
      geoLocation.setIcon(this.icons.arrowBlue);
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
