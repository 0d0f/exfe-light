  define('routexmaps', function (require) {

  'use strict';

    var SITE_URL = window._ENV_.site_url

    , distance = function (lat1, lng1, lat2, lng2) {
        var R = 6371 // Radius of the Earth in km
          , dLat = (lat2 - lat1) * Math.PI / 180
          , dLon = (lng2 - lng1) * Math.PI / 180
          , a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
          , c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
          , d = R * c;
        return d;
      }
    , calRotate = function (lat1, lon1, lat2, lon2) {
        var dLon = lon2 - lon1
          , y = Math.sin(dLon) * Math.cos(lat2)
          , x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
        return Math.atan2(y, x);
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
      };


  function RoutexMaps(options) {
    options = this.options = options || {};
    this.svgLayer = this.options.svg;
    this.options.svg = null;

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

        var map = rm.map = new GMaps.Map(mapDiv, mapOptions);

        var initListener = GEvent.addListener(map, 'tilesloaded', function () {

          GEvent.addListener(map, 'bounds_changed', function () {
            console.log('bounds_end', rm.uid)
            GEvent.trigger(map, 'zoom_changed');
          });

          GEvent.addListener(map, 'zoom_changed', function () {
            console.log('zoom_end')
            rm.contains();
          });

          GEvent.addListener(map, 'drag', function () {
            console.log('drag')
          });

          GEvent.addDomListener(mapDiv, 'touchstart', function () {
            console.log('touchstart', rm.uid);
            GEvent.clearListeners(mapDiv, 'touchmove');
            GEvent.addDomListenerOnce(mapDiv, 'touchmove', function () {
              console.log('touchmove');
              rm.hideTiplines();
            });
          });

          GEvent.removeListener(initListener);

        });

        var overlay = rm.overlay = new GMaps.OverlayView();
        overlay.draw = function () {};
        // overlay.onAdd = overlay.onRemove = function () {};
        overlay.setMap(map);

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
    n.onload = n.onerror = n.onreadystatechange = function () {
      if (/^(?:loaded|complete|undefined)$/.test(n.readyState)) {
        n = n.onload = n.onerror = n.onreadystatechange = null;
        cb && cb();
      }
    };
    n.async = !0;
    n.src = this.options.url;
    document.body.appendChild(n);
  };

  proto.draw = function (type, data) {
    console.log('type', type, data);
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
    while ((item = rs.shift())) {
      this.addRoute(item);
    }
  };


  proto.addRoute = function (data) {
    var coords = [], uid = data.created_by, positions = data.positions.slice(0), p, route;

    route = this.routes[uid] = this.addPolyline(data);

    while ((p = positions.shift())) {
      coords.push(this.toLatLng(p.latitude, p.longitude));
    }

    route._data = data;
    route.setPath(coords);
  };

  proto.addPolyline = function (data) {
    var rgba = (data.color && data.color.split(',')) || []
      , color = rgba.length ? '#' + (+rgba[0]).toString(16) + (+rgba[1]).toString(16) + (+rgba[2]).toString(16) : '#00f'
      , alpha = rgba[3] || 1
      , p = new google.maps.Polyline({
            map: this.map
          , geodesic: true
          , strokeColor: data.color
          , strokeWeight: 1
          , strokeOpacity: alpha
        });
    return p;
  };

  proto.drawPlaces = function (ps) {
    console.log('draw places', ps.length, ps);
    // reset destination place
    this.destinationPlace = null;
    var places = this.places, p, k, item;
    for (k in places) {
      p = places[k];
      p.setMap(null);
      p = null;
      delete places[k];
    }
    while ((item = ps.shift())) {
      this.addPlace(item);
    }
  };

  proto.addPlace = function (data) {
    console.log('add a place', data);
    var id = data.id
      , latlng = this.toLatLng(data.latitude, data.longitude)
      , place, tags, tag;

    place = this.places[id] = this.addPoint(data);
    place._data = data;

    place.setPosition(latlng);
    place.setVisible(true);

    if (!this.destinationPlace) {
      tags = data.tags.slice(0);
      while ((tag = tags.shift())) {
        if ('destination' === tag) {
          var geoLocation = this.geoLocation;
          if (!geoLocation || (geoLocation && geoLocation._status == 0)) {
            this.panToDestination(latlng);
          }
          place.setZIndex(378);
          this.destinationPlace = place;
          break;
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
      , uid, d, now = Math.round((new Date()).getTime() / 1000), n;
    var gm, b, $e, tl;
    for (uid in u) {
      if (u.hasOwnProperty(uid)) {
        d = u[uid];
        n = Math.floor((now - d.timestamp) / 60);
        gm = gms[uid];
        b = bs[uid];
        tl = tiplines[uid];
        $e = $('#identities-overlay .identity[data-uid="' + uid + '"]').find('.icon');
        this.distanceMatrix(uid, gm ,dp);
        console.log(n)
        if (n <= 1) {

          if ($e.length) {
            if ($e.hasClass('icon-arrow-gray')) {
              $e.attr('class', 'icon icon-arrow-red');
            } else {
              $e.attr('class', 'icon icon-dot-red');
            }
          }

          tl && tl.setAttribute('stroke', '#FF7E98');
          gm && gm.setIcon(icons.dotRed);
          b && b.setOptions({
              strokeOpacity: 0
            , icons: [
                {
                    icon: {
                        path: 'M0,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0 z'
                      , fillColor: '#FF7E98'
                      , fillOpacity: .5
                      , strokeColor: '#fff'
                      , strokeOpacity: .5
                      , strokeWeight: 1
                      , scale: .5
                    }
                  , repeat: '30px'
                  , offset: '0'
                }
              ]
          });
        } else {
          if ($e.length) {
            if ($e.hasClass('icon-arrow-red')) {
              $e.attr('class', 'icon icon-arrow-grey');
            } else {
              $e.attr('class', 'icon icon-dot-grey');
            }
          }

          tl && tl.setAttribute('stroke', '#b2b2b2');
          gm && gm.setIcon(icons.dotGrey);
          b && b.setOptions({
              strokeOpacity: 0
            , icons: [
                {
                    icon: {
                        path: 'M0,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0 z'
                      , fillColor: '#b2b2b2'
                      , fillOpacity: .5
                      , strokeColor: '#fff'
                      , strokeOpacity: .5
                      , strokeWeight: 1
                      , scale: .5
                    }
                  , repeat: '30px'
                  , offset: '0'
                }
              ]
          });
        }
      }
    }
  };
  proto.toLatLng = function (latitude, longitude) {
    return new google.maps.LatLng(latitude * 1, longitude * 1);
  };

  proto.drawIdentityPaths = function (data) {
    var bs = this.breadcrumbs, dp = this.destinationPlace
      , uid, b, d, p, positions, coords, latlng, gm;
    for (uid in data) {
      d = data[uid];
      b = bs[uid];
      positions = d.slice(0);
      coords = [];
      if (!b) {
        b = bs[uid] = this.addBreadcrumbs();
      }

      while ((p = positions.shift())) {
        coords.push(this.toLatLng(p.latitude, p.longitude));
      }

      latlng = coords[0];
      b.setPath(coords);
      b._uid = uid;
      b._data = d;

      gm = this.drawGeoMarker(uid, d[0], latlng);

      this.distanceMatrix(uid, gm, dp);
    }
  };

  proto.drawGeoMarker = function (uid, data, latlng) {
    console.log('myuid === uid', this.myuid, uid, this.myuid === uid);
    if (this.myuid === uid) {
      return this.geoLocation;
    }
    var geoMarkers = this.geoMarkers, gm = geoMarkers[uid];
    if (!gm) {
      gm = geoMarkers[uid] = this.addGeoMarker();
    }
    gm.setPosition(latlng);
    gm._data = this.updated[uid] = data;
    console.log(uid, data)

    this.updateTipline(uid, latlng);
    return gm;
  };

  proto.addGeoMarker = function () {
    var gm = new google.maps.Marker({
        map: this.map
      , animation: 3
      , zIndex: 333
      , icon: this.icons.dotGrey
    });
    return gm;
  };

  proto.distanceMatrix = function (uid, gm, dp) {
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
        , r = Math.round(calRotate(lat2, lng2, lat1, lng1) * 180 / Math.PI)
        , result = distanceOutput(d);

      console.log(d, r, lat1, lng1, lat2, lng2);

      result.rotate = r;

      console.dir(result);
      $distance.html(result.text);
      if (!$icon.hasClass('icon-arrow-red') && !$icon.hasClass('icon-arrow-grey')) {
        $icon.attr('class', 'icon icon-arrow-grey');
      }
      $icon.css('-webkit-transform', 'rotate(' + r + 'deg)');
      $detial.css('visibility', 'visible');
    } else if (gm) {
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
        , projection = this.overlay.getProjection()
        , map = this.map;
      if (destinationPlace) {
        var dlatlng = destinationPlace.getPosition()
          , p = projection.fromLatLngToContainerPixel(dlatlng)
          , bounds;

        if (isme) {
          bounds = this.calculateBoundsByCenter(gmlatlng, [dlatlng]);
        } else {
          bounds = new google.maps.LatLngBounds()
          if (p.x < 50) {
            p = projection.fromContainerPixelToLatLng(new google.maps.Point(p.x - 50, p.y));
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
      , projection = this.overlay.getProjection()
      , points = [], point, coord, c;
    while ((coord = others.shift())) {
      point = projection.fromLatLngToContainerPixel(coord);
      points.push(point);
    }

    var c = projection.fromLatLngToContainerPixel(center), maxd = 0, d, p;
    while ((p = points.shift())) {
      d = Math.sqrt(Math.pow(p.x - c.x, 2) + Math.pow(p.y - c.y, 2));
      if (d > maxd) { maxd = d; }
    }

    var sw = projection.fromContainerPixelToLatLng(new google.maps.Point(c.x - maxd - 50, c.y - maxd - 50))
      , ne = projection.fromContainerPixelToLatLng(new google.maps.Point(c.x + maxd + 50, c.y + maxd + 50));

    bounds.extend(sw);
    bounds.extend(center);
    bounds.extend(ne);
    return bounds;
  };

  proto.addBreadcrumbs = function (uid, positions) {
    // var rgba = data.color.split(',')
      // , color = '#' + (+rgba[0]).toString(16) + (+rgba[1]).toString(16) + (+rgba[2]).toString(16)
      // , alpha = rgba[3]
    var color = '#FF325B'
      , alpha = 0.5
      , p = new google.maps.Polyline({
        map: this.map
      , visible: false
      , geodesic: true
      // , strokeColor: data.color
      // , strokeWeight: 1
      , strokeOpacity: 0
      , icons: [
          {
              icon: {
                  path: 'M0,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0 z'
                , fillColor: color
                , fillOpacity: alpha
                , strokeColor: '#fff'
                , strokeOpacity: .5
                , strokeWeight: 1
                , scale: .5
              }
            , repeat: '30px'
            , offset: '0'
          }
        ]
    });
    return p;
  };

  proto.showTextLabels = function (positions) {
  };

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

  proto.updatePoint = function (data) {
    var locations = this.locations, id = data.id, locate, latlng, tags, tag;

    locate = locations[id];
    if (!locate) {
      locate = locations[id] = this.addPoint(data);
    }

    locate.setPosition(latlng);
    locate.setVisible(true);

    tags = data.tags.slice(0);
    while ((tag = tags.shift())) {
      if ('destination' === tag) {
        locate._type = 'destination';
        this.destinationLocation = locate;
        break;
      }
    }

    console.log(id, latlng.lat(), latlng.lng(), locate)
    locate._data = data;
  };

  proto.addLastPoint = function (latlng) {
    var gm =new google.maps.Marker({
        map: this.map
      , animation: 3
      , zIndex: 366
      , icon: this.icons.dotGrey
    });
    return gm;
  };

  proto.addPoint = function (data) {
    console.log(data.icon);
    var self = this
      , GMaps = google.maps
      , m = new GMaps.Marker({
          map: this.map
        , animation: 2
        , visible: false
        , zIndex: 233
        , icon: new google.maps.MarkerImage(
              data.icon
            , new google.maps.Size(48, 68)
            , new google.maps.Point(0, 0)
            , new google.maps.Point(12, 34)
            , new google.maps.Size(24, 34)
          )
      })
    , GEvent = GMaps.event;

    GEvent.addListener(m, 'mousedown', function (e) {
      console.log('marker mousedown', e);
      e && e.stop();

      if (self.removeInfobox(this)) { return false; }

      var infobox = self.infobox = new GMaps.InfoBox({
          content: self.infoWindowTemplate.replace('{{title}}', data.title).replace('{{description}}', data.description)
        , maxWidth: 200
        , pixelOffset: new google.maps.Size(-80, -38)
        , boxClass: 'park'
        , closeBoxMargin: ""
        , closeBoxURL: ""
        , alignBottom: true
        , enableEventPropagation: false
        , leftBoundary: 60
        , zIndex: 610
      });
      infobox.open(self.map, this);
      infobox._marker = this;

      GEvent.addListenerOnce(this, 'mouseout', function (e) {
        console.log('mouseout', e);
        infobox.close();
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
      , projection = this.overlay.getProjection()
      , sw = mapBounds.getSouthWest()
      , ne = mapBounds.getNorthEast()
      , bounds = new google.maps.LatLngBounds()
      , geoMarkers = this.geoMarkers
      , ids = document.getElementById('identities')._ids || {}
      , uid, gm, latlng;
    console.log('contains', ids)

    sw = projection.fromLatLngToContainerPixel(sw);
    sw = projection.fromContainerPixelToLatLng(new google.maps.Point(sw.x + 50, sw.y));

    bounds.extend(sw);
    bounds.extend(ne);

    for (uid in geoMarkers) {
      gm = geoMarkers[uid];
      latlng = gm.getPosition();
      this.containsOne(uid, latlng, bounds, ids);
    }
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
      tl._lastlatlng = latlng;
      this.containsOne(uid, latlng);
    }
  };

  proto.addTipline = function (uid) {
    console.log('tipline', uid);
    var breadcrumbs = this.breadcrumbs[uid]
      , color = '#FF325B'
      , tl = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');

    tl.setAttribute('fill', 'none');
    // 更改用户状态：在线-粉红，离线-灰色
    tl.setAttribute('stroke', '#7F7F7F');
    tl.setAttribute('stroke-width', 1);
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
      , points = [f.join(','), s.join(',')].join(' ');
    p = this.overlay.getProjection().fromLatLngToContainerPixel(tl._lastlatlng);
    console.log('tipline', uid);
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
        , zIndex: 377
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
    console.log(uid, position)
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