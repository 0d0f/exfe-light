define('routexmaps', function (require) {

  'use strict';

  var Store = require('store');

  function RoutexMaps(options) {
    options = this.options = options || {};
    this.svgLayer = this.options.svg;
    this.options.svg = null;

    this.routes = {};
    this.locations = {};
    this.tiplines = {};
    this.breadcrumbs = {};
    this.geoMarkers = {};
    this.icons = {};

    window._loadmaps_ = function (rm, mapDiv, mapOptions, callback) {

      return function cb() {
        var GMaps = google.maps
          , GEvent = GMaps.event;

        GMaps.InfoBox = require('infobox');

        var icons = rm.icons;

        icons.dotGrey = new GMaps.MarkerImage(
              '/static/img/map_dot_grey@2x.png'
            , new GMaps.Size(36, 36)
            , new GMaps.Point(0, 0)
            , new GMaps.Point(9, 9)
            , new GMaps.Size(18, 18)
          );
        icons.dotRed = new GMaps.MarkerImage(
              '/static/img/map_dot_red@2x.png'
            , new GMaps.Size(36, 36)
            , new GMaps.Point(0, 0)
            , new GMaps.Point(9, 9)
            , new GMaps.Size(18, 18)
          );
        icons.arrowBlue = new GMaps.MarkerImage(
              '/static/img/map_arrow_blue@2x.png'
            , new GMaps.Size(40, 40)
            , new GMaps.Point(0, 0)
            , new GMaps.Point(10, 10)
            , new GMaps.Size(20, 20)
          );
        icons.arrowGrey = new GMaps.MarkerImage(
              '/static/img/map_arrow_g5@2x.png'
            , new GMaps.Size(40, 40)
            , new GMaps.Point(0, 0)
            , new GMaps.Point(10, 10)
            , new GMaps.Size(20, 20)
          );

        // hdpi
        GMaps.visualRefresh = true;
        // default China
        mapOptions.center = new GMaps.LatLng(35.86166, 104.195397);
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
            // rm.showTipline(rm.uid);
            // rm.showBreadcrumbs(rm.uid);
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
              // rm.hideTipline(rm.uid);
              // rm.hideBreadcrumbs(rm.uid);
            });
          });

          GEvent.removeListener(initListener);

        });

        var overlay = rm.overlay = new GMaps.OverlayView();
        overlay.draw = function () {};
        // overlay.onAdd = function () {};
        // overlay.onRemove = function () {};
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
    n.async = 1;
    n.src = this.options.url;
    document.body.appendChild(n);
  };

  proto.draw = function (type, data) {
    console.log('type', type, data);
    if (type === 'geomarks') {

      var item, st;
      data = data.slice(0);
      while ((item = data.shift())) {
        st = item.type;
        if (st === 'route') {
          // this.updatePolyline(item);
        } else if (st === 'location') {
          this.updatePoint(item);
        }
      }

    } else if (type === 'breadcrumbs') {
      for (var uid in data) {
        this.updateBreadcrumbs(uid, data[uid]);
      }
    }
  };

  proto.fitBounds = function (uids) {
    console.log('fit bounds', uids);
    if (uids && uids.length) {
      var gms = this.geoMarkers, latlngs = [], gm, uid;
      while ((uid = uids.shift())) {
        if ((gm = gms[uid])) {
          latlngs.push(gm.getPosition());
        }
      }
      this.calBounds(latlngs, this.geoLocation.getPosition());
    }
  };

  proto.calBounds = function (latlngs, center) {
    var projection = this.overlay.getProjection()
      , c = projection.fromLatLngToContainerPixel(center)
      , destinationLatlng = this.destinationLatlng
      , bounds = new google.maps.LatLngBounds(), maxd = 0, latlng, d, sw, ne;

    if (destinationLatlng) {
      latlngs.push(destinationLatlng);
    }

    while ((latlng = latlngs.shift())) {
      d = distance(latlng, center);
      console.log(d);
      if (d > maxd) { maxd = d; }
      bounds.extend(latlng);
    }
    sw = projection.fromContainerPixelToLatLng(new google.maps.Point(c.x - maxd, c.y - maxd));
    ne = projection.fromContainerPixelToLatLng(new google.maps.Point(c.x + maxd, c.y + maxd));
    bounds.extend(sw);
    bounds.extend(center);
    bounds.extend(ne);
    this.map.fitBounds(bounds);
  };

  function distance(p2, p1) {
    var R = 6371; // Radius of the Earth in km
    var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
    var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  proto.fitCenter = function (position) {
    var locations = this.locations, bounds = new google.maps.LatLngBounds(), i = 0, coords = [], location, uid, latlng;
    /*
    for (uid in locations) {
      location = locations[uid];
      if ('destination' === location._type) {
        // bounds.extend(location.getPosition());
        console.log('destination')
        coords.push(location.getPosition());
        i = 2;
      }
    }
    */
    if (position) {
      // bounds.extend(latlng = new google.maps.LatLng(position.latitude, position.longitude));
      // coords.push(latlng = new google.maps.LatLng(position.latitude, position.longitude));
      latlng = new google.maps.LatLng(position.latitude, position.longitude);
      i++;
    } else {
      latlng = this.map.getCenter();
    }

    var overlay = this.overlay;

    if (1 < i) {
    // this.map.fitBounds(bounds);
      var points = [], point, coord;
      while ((coord = coords.shift())) {
        point = overlay.getProjection().fromLatLngToContainerPixel(coord);
        points.push(point);
      }

      var c = overlay.getProjection().fromLatLngToContainerPixel(latlng), maxd = 0, d, p;
      while ((p = points.shift())) {
        d = Math.sqrt(Math.pow(p.x - c.x, 2) + Math.pow(p.y - c.y, 2));
        console.log(d, p.x, c.x, p.y, c.y);
        if (d > maxd) { maxd = d; }
      }

      var sw = overlay.getProjection().fromContainerPixelToLatLng(new google.maps.Point(c.x - maxd, c.y - maxd));
      var ne = overlay.getProjection().fromContainerPixelToLatLng(new google.maps.Point(c.x + maxd, c.y + maxd));

      bounds.extend(sw);
      bounds.extend(latlng);
      bounds.extend(ne);
      this.map.fitBounds(bounds);

    } else {
      // this.map.setZoom(15);
      this.map.panTo(latlng);
    }
  };

  proto.updateBreadcrumbs = function (uid, positions) {
    console.log('update breadcrumbs', uid);
    if (this.myuid === uid) {
      !this.geoLocation && this.updateGeoLocation(uid, latlng);
      return;
    }

    var breadcrumbs = this.breadcrumbs, coords = [],  p, b, latlng, locate;
    positions = positions.slice(0);
    locate = positions[0];

    while ((p = positions.shift())) {
      latlng = new google.maps.LatLng(p.latitude, p.longitude);
      coords.push(latlng);
    }

    b = breadcrumbs[uid];
    if (!b) {
      b = breadcrumbs[uid] = this.addBreadcrumbs(uid, positions);
    }

    latlng = coords[0];
    b.setPath(coords);
    b._uid = uid;
    b._position = positions;

    this.updateIdentityGeoLocation(uid, locate, latlng);

    this.updateTipline(uid, latlng);
  };

  proto.updateIdentityGeoLocation = function (uid, locate, latlng) {
    var geoMarkers = this.geoMarkers, gm = geoMarkers[uid];
    if (!latlng) {
      latlng = new google.maps.LatLng(locate.latitude, locate.longitude);
    }
    if (!gm) {
      gm = geoMarkers[uid] = this.addLastPoint();
    }
    gm._location = locate;
    gm.setPosition(latlng);
    console.log(uid, latlng.lat(), latlng.lng(), this.geoLocation);
    this.distancematrix(uid);
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

  var distanceOutput = function (n, s, t, r) {
    t = '<span class="unit">{{u}}</span>';
    n = Math.floor(n);
    r = {
        text: ''
      , status: 0
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

  proto.distancematrix = function (uid) {
    var b = this.geoMarkers[uid]
      , g = this.geoLocation;

    if (b && g) {
      var start = b.getPosition()
        , end = g.getPosition()
        , r = distanceOutput(distance(start, end));
      console.log('DistanceMatrixService', r, !!b, !!a);
      if (4 === r.status) {
        $('#identities-overlay .identity[data-uid="' + uid + '"]').find('.distance').text(r.text);
      } else {
        $('#identities-overlay .identity[data-uid="' + uid + '"]').find('.distance').html(r.text);
      }
      /*
      var service = new google.maps.DistanceMatrixService()
        , OK = google.maps.DistanceMatrixStatus.OK;
      service.getDistanceMatrix(
          {
              origins: [start]
            , destinations: [end]
            , travelMode: google.maps.TravelMode.DRIVING
            , unitSystem: google.maps.UnitSystem.METRIC
            , avoidHighways: false
            , avoidTolls: false
          }
        , function (d, s) {
            console.log('distancematrix', s);
            if (s === OK) {
              var e = d.rows[0].elements[0]
                , v = e.distance.value
                , r = distanceOutput(v);

              console.log(distance(start, end) * 1000, v);

              if (4 === r.status) {
                $('.identity[data-uid="' + uid + '"]').find('.distance').text(r.text);
              } else {
                $('.identity[data-uid="' + uid + '"]').find('.distance').html(r.text);
              }
            }
          }
      );
      */
    } else if (b) {

    } else {

    }
  };

  proto.hideBreadcrumbs = function (uid) {
    var b = this.breadcrumbs[uid];
    if (b) {
      b.setVisible(false);
      // b.lastMarker.setVisible(false);
    }
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

  proto.showGeoMarker = function (uid) {

  };

  proto.updatePolyline = function (data) {
    var routes = this.routes, coords = [], uid = data.created_by, positions = data.positions.slice(0), p, route, bounds, latlng;

    route = routes[uid];
    if (!route) {
      route = routes[uid] = this.addPolyline(data);
    }

    bounds = new google.maps.LatLngBounds();

    while ((p = positions.shift())) {
      latlng = new google.maps.LatLng(p.latitude, p.longitude);
      bounds.extend(latlng);
      coords.push(latlng);
    }

    route._data = data;
    route._bounds = bounds;
    route.setPath(coords);
    // route.setVisible(true);
    // update tipline
    this.updateTipline(uid, latlng);
  };

  proto.addPolyline = function (data) {
    var rgba = data.color.split(',')
      , color = '#' + (+rgba[0]).toString(16) + (+rgba[1]).toString(16) + (+rgba[2]).toString(16)
      , alpha = rgba[3]
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

  proto.hasDestination = false;
  proto.updatePoint = function (data) {
    var locations = this.locations, id = data.id, bounds, locate, latlng, tags, tag;

    locate = locations[id];
    if (!locate) {
      locate = locations[id] = this.addPoint(data);
    }

    bounds = new google.maps.LatLngBounds();
    latlng = new google.maps.LatLng(data.latitude, data.longitude);
    bounds.extend(latlng);

    locate.setPosition(latlng);
    locate.setVisible(true);

    if (!this.hasDestination) {
      tags = data.tags.slice(0);
      while ((tag = tags.shift())) {
        if ('destination' === tag) {
          locate._type = 'destination';
          this.destinationLatlng = latlng;
          this.hasDestination = true;
          //this.fitCenter();
          break;
        }
      }
    }

    console.log(id, latlng.lat(), latlng.lng(), locate)
    locate._data = data;
    locate._bounds = bounds;
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
    var self = this
      , GMaps = google.maps
      , m = new GMaps.Marker({
          map: this.map
        , animation: 2
        // , position: new google.maps.LatLng(data.latitude, data.longitude)
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
    var bounds = this.map.getBounds()
      , ids = document.getElementById('identities')._ids || []
      , geoMarkers = this.geoMarkers
      , uid, gm, latlng;
    console.log('contains', ids)
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
      ids = document.getElementById('identities')._ids || [];
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
    tl.setAttribute('stroke', '#FF7E98');
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
    tl.setAttribute('points', points  + ' ' + p.x + ',' + p.y);
    tl.setAttributeNS(null, 'display', 'block');
  };

  proto.hideTipline = function (uid) {
    var tl = this.tiplines[uid];
    if (!tl) { return; }
    tl.setAttributeNS(null, 'display', 'none');
  };

  proto.updateGeoLocation = function (uid, position) {
    var geoLocation = this.geoLocation;
    if (!geoLocation) {
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
      geoLocation._uid = uid;
      var lastlatlng = Store.get('last-latlng');
      if (lastlatlng) {
        geoLocation.setPosition(new google.maps.LatLng(lastlatlng.lat, lastlatlng.lng));
      }
    }
    if (position) {
      geoLocation.setIcon(this.icons.arrowBlue);
      geoLocation.setPosition(new google.maps.LatLng(position.latitude, position.longitude));
    }
  };

  return RoutexMaps;

});
