define('routexmaps', function (require) {

  'use strict';

  function RoutexMaps(options) {
    options = this.options = options || {};
    this.svgLayer = this.options.svg;
    this.options.svg = null;

    this.routes = {};
    this.locations = {};
    this.tiplines = {};

    window._loadmaps_ = function (rm, mapDiv, mapOptions, callback) {

      return function cb() {

        google.maps.InfoBox = require('infobox');

        function Overlay(svg, map) {
          this.map_ = map;
          this.svg_ = svg;

          this.div_ = null;
          this.setMap(map);
        }
        Overlay.prototype = new google.maps.OverlayView();
        Overlay.prototype.onAdd = function () {
          this.div_ = this.svg_;
          this.div_.style.zIndex = 144;
          var panes = this.getPanes();
          panes.overlayLayer.appendChild(this.div_);
        };
        Overlay.prototype.draw = function () {};
        // hdpi
        google.maps.visualRefresh = true;
        // default China
        mapOptions.center = new google.maps.LatLng(35.86166, 104.195397);
        mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
        mapOptions.disableDefaultUI = true;

        var map = rm.map = new google.maps.Map(mapDiv, mapOptions)
          , GEvent = google.maps.event;

        var initListener = GEvent.addListener(map, 'tilesloaded', function () {

          GEvent.addListener(map, 'bounds_changed', function () {
            console.log('bounds_end', rm.uid)
            GEvent.trigger(map, 'zoom_changed');
          });

          GEvent.addListener(map, 'zoom_changed', function () {
            console.log('zoom_end')
            rm.showTipline(rm.uid);
            rm.showPolyline(rm.uid);
          });

          GEvent.addDomListener(mapDiv, 'touchstart', function () {
          // GEvent.addDomListener(mapDiv, 'touchmove', function () {
            console.log('touchstart', rm.uid);
            GEvent.clearListeners(mapDiv, 'touchmove');
            GEvent.addDomListenerOnce(mapDiv, 'touchmove', function () {
              console.log('touchmove');
              rm.hideTipline(rm.uid);
              rm.hidePolyline(rm.uid);
            });
          });

          GEvent.removeListener(initListener);

        });

        var overlay = rm.overlay = new google.maps.OverlayView();
        overlay.onAdd = function () {
          this.div_ = self.svgLayer;
        };
        overlay.draw = function () {};
        //overlay.onAdd = function () {};
        //overlay.onRemove = function () {};
        overlay.setMap(map);
        // rm.overlay = new Overlay(rm.svgLayer, map);

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

  proto.draw = function (type, data, st) {
    if (type === 'geomarks') {
      // sub-type
      st = data.type;
      if (st === 'route') {
        this.updatePolyline(data);
      } else if (st === 'location') {
        this.updatePoint(data);
      }
    }
  };

  proto.fitBounds = function (positions) {
    var route = this.routes[this.uid], bounds = new google.maps.LatLngBounds(), positions = positions && positions.slice(0), i = 0, p, latlng;

    if (positions) {
      while ((p = positions.shift())) {
        bounds.extend(latlng = new google.maps.LatLng(p.latitude, p.longitude));
        i++;
      }
    }

    if (route) {
      bounds.union(route._bounds);
      bounds.union(this.getPointsBounds());
      i = 2;
    }

    if (1 < i) {
      this.map.panToBounds(bounds);
      this.map.fitBounds(bounds);
    } else {
      if (!latlng) { latlng = this.map.getCenter(); }
      //https://developers.google.com/maps/documentation/javascript/maxzoom?hl=en
      this.map.panTo(latlng);
    }
  };

  function distance(p1, p0) {
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
    for (uid in locations) {
      location = locations[uid];
      if ('destination' === location._type) {
        // bounds.extend(location.getPosition());
        coords.push(location.getPosition());
        i++;
      }
    }
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
      this.map.setZoom(18);
      this.map.panTo(latlng);
    }
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
    var p = new google.maps.Polyline({
        map: this.map
      , visible: false
      , geodesic: true
      , strokeColor: data.color
      // , strokeWeight: 1
      , strokeOpacity: 0
      , icons: [
          {
              icon: {
                  path: 'M 0,-1 0,1'
                , fillOpacity: 1
                , strokeOpacity: 1
                , strokeWeight: 2
                , scale: 1
              }
            , repeat: '20px'
            , offset: '0'
          }
        ]
    });
    return p;
  };

  proto.hidePolyline = function (uid) {
    var route = this.routes[uid];
    route && route.setVisible(false);
  };

  proto.showPolyline = function (uid) {
    var route = this.routes[uid];
    route && route.setVisible(true);
    this.uid = uid;
  };

  proto.updatePoint = function (data) {
    var locations = this.locations, id = data.id, bounds, location, latlng, tags, tag;

    location = locations[id];
    if (!location) {
      location = locations[id] = this.addPoint(data);
    }

    bounds = new google.maps.LatLngBounds();
    latlng = new google.maps.LatLng(data.latitude, data.longitude);
    bounds.extend(latlng);

    tags = data.tags.slice(0);
    while ((tag = tags.shift())) {
      if ('destination' === tag) {
        location._type = 'destination';
        break;
      }
    }

    location._data = data;
    location._bounds = bounds;
    location.setPosition(latlng);
    location.setVisible(true);
  };

  proto.addPoint = function (data) {
    var self = this
      , m = new google.maps.Marker({
          map: this.map
        , animation: google.maps.Animation.DROP
        // , position: new google.maps.LatLng(data.latitude, data.longitude)
        , icon: new google.maps.MarkerImage(
              data.icon
            , new google.maps.Size(48, 68)
            , new google.maps.Point(0, 0)
            , new google.maps.Point(12, 17)
            , new google.maps.Size(24, 34)
          )
        , visible: false
        , zIndex: 233
      })
    , GEvent = google.maps.event;

    GEvent.addListener(m, 'mousedown', function (e) {
      console.log('marker mousedown', e);
      e && e.stop();

      if (self.removeInfobox(this)) { return false; }

      var infobox = self.infobox = new google.maps.InfoBox({
          content: self.infoWindowTemplate.replace('{{title}}', data.title).replace('{{description}}', data.description)
        , pixelOffset: new google.maps.Size(-80, -20)
        , boxClass: 'park'
        , closeBoxMargin: ""
        , closeBoxURL: ""
        , alignBottom: true
        , enableEventPropagation: false
      });
      infobox.open(self.map, this);
      infobox._marker = this;

      GEvent.addListenerOnce(this, 'mouseout', function () {
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

  proto.updateTipline = function (uid, latlng) {
    var tl = this.tiplines[uid], startPoints;
    if (!tl) {
      tl = this.tiplines[uid] = this.addTipline(uid);
    }
    tl._lastlatlng = latlng;
  };

  proto.addTipline = function (uid) {
    var route = this.routes[uid]
      , color = route._data.color
      , bound = $('#identities > .identity[data-uid="' + uid +  '"]')[0].getBoundingClientRect()
      , tl = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')
      // , f = [bound.left + bound.width, bound.top + bound.height / 2]
      , f = [50, bound.top + bound.height / 2]
      , s = [f[0] + 13, f[1]]
      , points = [f.join(','), s.join(',')];

    tl.setAttribute('fill', 'none');
    tl.setAttribute('stroke', color);
    tl.setAttribute('stroke-width', 1);
    tl.setAttribute('start-points', points.join(' '));
    tl.setAttributeNS(null, 'display', 'none');
    this.svgLayer.appendChild(tl);
    return tl;
  };

  proto.showTipline = function (uid) {
    var tl = this.tiplines[uid], p, startPoints;
    if (!tl) { return; }
    p = this.overlay.getProjection().fromLatLngToContainerPixel(tl._lastlatlng);
    startPoints = tl.getAttribute('start-points');
    tl.setAttribute('points', startPoints + ' ' + p.x + ',' + (p.y - 3));
    tl.setAttributeNS(null, 'display', 'block');
  };

  proto.hideTipline = function (uid) {
    var tl = this.tiplines[uid];
    if (!tl) { return; }
    tl.setAttributeNS(null, 'display', 'none');
  };

  proto.showGeoLocation = function (position) {
    var geoLocation = this.geoLocation;
    if (!geoLocation) {
      geoLocation = this.geoLocation = new google.maps.Marker({
          map: this.map
        , zIndex: 377
        , visible: false
        , animation: google.maps.Animation.DROP
        , icon: new google.maps.MarkerImage(
              '/static/img/map_arrow_blue@2x.png'
            , new google.maps.Size(40, 40)
            , new google.maps.Point(0, 0)
            , new google.maps.Point(10, 10)
            , new google.maps.Size(20, 20)
          )
      });
    }
    geoLocation.setPosition(new google.maps.LatLng(position.latitude, position.longitude));
    geoLocation.setVisible(true);
  };

  proto.hideGeoLocation = function () {
    var geoLocation = this.geoLocation;
    if (geoLocation) {
      geoLocation.setVisible(false);
    }
  };

  return RoutexMaps;

});
