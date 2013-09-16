//https://github.com/Leaflet/Leaflet

define('staticmaps', function () {
  'use strict';

  var MERCATOR_RANGE = 256;
  var proto;


  function LatLngBounds() {}

  proto = LatLngBounds.prototype;

  //                       latlng = [lat, lng]
  proto.extend = function (latlng) {
    if (!this._southWest && !this._northEast) {
      this._southWest = latlng.slice(0);
      this._northEast = latlng.slice(0);
    } else {
      this._southWest[0] = Math.min(latlng[0], this._southWest[0]);
      this._southWest[1] = Math.min(latlng[1], this._southWest[1]);
      this._northEast[0] = Math.max(latlng[0], this._northEast[0]);
      this._northEast[1] = Math.max(latlng[1], this._northEast[1]);
    }
    this.minLat = Math.min(latlng[0], this._southWest[0]);
    this.minLng = Math.min(latlng[1], this._southWest[1]);
    this.maxLat = Math.max(latlng[0], this._northEast[0]);
    this.maxLng = Math.max(latlng[1], this._northEast[1]);
  };

  proto.getCenter = function () {
    return [(this._southWest[0] + this._northEast[0]) / 2, (this._southWest[1] + this._northEast[1]) / 2];
  };

  proto.getNorthEast = function () { return this._northEast; };

  proto.getSouthWest = function () { return this._southWest; };

  proto.getNorthWest = function () { return [this._northEast[0], this._southWest[1]]; };

  proto.getSouthEast = function () { return [this._southWest[0], this._northEast[1]]; };

  // http://stackoverflow.com/questions/12507274/how-to-get-bounds-of-a-google-static-map
  /*
  function Projection() {
    this.pixelOrigin_ = [MERCATOR_RANGE / 2, MERCATOR_RANGE / 2];
    this.pixelsPerLonDegree_ = MERCATOR_RANGE / 360;
    this.pixelsPerLonRadian_ = MERCATOR_RANGE / (2 * Math.PI);
  }

  proto = Projection.prototype;

  proto.fromLatLngToPoint = function (latlng) {
    var origin = this.pixelOrigin_;
    var point = [];
    point[0] = origin[0] + latLng[1] * this.pixelsPerLonDegree_;
    // NOTE(appleton): Truncating to 0.9999 effectively limits latitude to
    // 89.189.  This is about a third of a tile past the edge of the world tile.
    var siny = this.bound(Math.sin(this.degreesToRadians(latLng[0])), -0.9999, 0.9999);
    point[1] = origin[1] + 0.5 * Math.log((1 + siny) / (1 - siny)) * -this.pixelsPerLonRadian_;
    return point;
  };

  proto.fromPointToLatLng = function (latlng) {
    var origin = this.pixelOrigin_;
    var lng = (point[0] - origin[0]) / this.pixelsPerLonDegree_;
    var latRadians = (point[1] - origin[1]) / -this.pixelsPerLonRadian_;
    var lat = this.radiansToDegrees(2 * Math.atan(Math.exp(latRadians)) - Math.PI / 2);
    return [lat, lng];
  }

  proto.degreesToRadians = function (deg) {
    return deg * (Math.PI / 180);
  };

  proto.radiansToDegrees = function (rad) {
    return rad / (Math.PI / 180);
  };

  proto.bound = function (val, min, max) {
    val = Math.max(val, min);
    val = Math.min(val, max);
    return value;
  };
  */


  function StaticMaps(map, myUserId) {
    this.map = map;
    this.myUserId = myUserId;
    this.width = $(window).width();
    this.height = $(window).height();
    this.bounds = new LatLngBounds();
    this._cache = [];
    this.latOffset = 0;
    this.lngOffset = 0;
  }

  proto = StaticMaps.prototype;

  proto.initEnd = false;

  proto.setOffset = function (offset) {
    this.latOffset = offset.earth_to_mars_latitude * 1;
    this.lngOffset = offset.earth_to_mars_longitude * 1;
  };

  proto.load = function () {
    this.zoom = this.getBoundsZoomLevel() - 1;
    this.center = this.bounds.getCenter();
    var self = this
      , c = this.center
      , zoom = 'zoom=' + this.zoom
      , img = document.createElement('img')
      , size = 'size=' + this.width + 'x' + this.height
      , center = 'center=' + c[0] + ',' + c[1]
      // @todo: 适配语言
      , url = 'http://ditu.google.com/maps/api/staticmap?key=' + window._ENV_.MAP_KEY + '&language=zh_CN&sensor=false&format=jpg&' + size + '&' + center + '&' + zoom;

    img.src = url;
    img.width = this.width;
    img.height = this.height;

    img.onload = img.onerror = function () {
      Debugger.alert('loaded');
      self.update();
    };

    this.map.append(img);
    this.map.removeClass();
  };

  proto.hide = function () { this.map.addClass('hide'); };

  proto.update = function () {
    var cache = this._cache
      , i = 0, len = cache.length, d, type;

    for (; i < len; ++i) {
      d = cache[i];
      type = d.type;
      if (type === 'route') {
        this.addDot(d);
      } else if (type === 'location') {
        this.addPlace(d);
      }
    }
  };

  proto.addDot = function (d) {
    var c = 'grey';
    var position = d.positions[0];
    if (Math.floor(Date.now() / 1000 - position.t) < 60) { c = 'red'; }
    var e = document.createElement('div');
    e.className = 'dot ' + c + '-dot';
    var latlng = position.gps.slice(0, 2);
    var point = this.latlngToLayerPoint(latlng);
    e.style.left = (point[0] - 9) + 'px';
    e.style.top = (point[1] - 9) + 'px';
    this.map.append(e);
  };

  proto.addPlace = function (d) {
    var uid = d.id.split('.')[1]
      , tags = d.tags, tag, c;

    if (uid === this.myUserId) {
      return;
    }

    while ((tag = tags.shift())) {
      if (tag === 'xplace') {
        c = 'x-place'
      } else if (tag === 'destination') {
        c = 'd-place'
      }
    }

    var e = document.createElement('div');
    var latlng = [d.lat, d.lng];
    var point = this.latlngToLayerPoint(latlng);
    if (c) {
      e.className = 'place ' + c;
    } else {
      e.style.backgroundImage = 'url(' + (d.icon || '/static/img/map_mark_diamond_blue@2x.png') + ')';
    }
    e.style.left = (point[0] - 12) + 'px';
    e.style.top = (point[1] - 34) + 'px';
    this.map.append(e);
  };

  proto.draw = function (result) {
    var type = result.type
      , action = result.action;

    if (!this.initEnd) {
      if (type === 'command' && action === 'init_end') {
        // load static map
        this.initEnd = true;
        this.setBounds();
        this.load();
      } else if (type === 'route' || type === 'location') {
        this._cache.push(result);
      }
    }
  };

  proto.setBounds = function () {
    var bounds = this.bounds
      , cache = this._cache
      , d, p;

    for (var i = 0, len = cache.length; i < len; ++i) {
      d = cache[i];
      p = null;
      if (d.type === 'route') {
        p = d.positions[0].gps.slice(0, 2);
      } else if (d.type === 'location') {
        p = [d.lat, d.lng];
      }
      if (p) {
        bounds.extend(p);
      }
    }
  };

  proto.getBoundsZoomLevel = function () {
    var WORLD_DIM = { height: 256, width: 256 };
    var ZOOM_MAX = 21;

    function latRad(lat) {
      var sin = Math.sin(lat * Math.PI / 180);
      var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
      return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    }

    function zoom(mapPx, worldPx, fraction) {
      return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
    }

    var ne = this.bounds.getNorthEast();
    var sw = this.bounds.getSouthWest();

    var latFraction = (latRad(ne[0]) - latRad(sw[0])) / Math.PI;

    var lngDiff = ne[1] - sw[1];
    var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

    var latZoom = zoom(this.height, WORLD_DIM.height, latFraction);
    var lngZoom = zoom(this.width, WORLD_DIM.width, lngFraction);

    return Math.min(latZoom, lngZoom, ZOOM_MAX);
  };

  proto.project = function (latlng) {
    var d = Math.PI / 180,
        max = 85.0511287798,
        lat = Math.max(Math.min(max, latlng[0]), -max),
        x = latlng[1] * d,
        y = lat * d;
    y = Math.log(Math.tan((Math.PI / 4) + (y / 2)));
    return [x, y];
  };

  proto.scale = function (zoom) {
    return 256 * Math.pow(2, zoom);
  };

  proto.latLngToPoint = function (latlng, zoom) {
    var point = this.project(latlng);
    var scale = this.scale(zoom);
    return this.transform(point, scale);
  };

  proto.leftTopPoint = function (center) {
    var point = this.latLngToPoint(center, this.zoom);
    point[0] -= this.width / 2;
    point[1] -= this.height / 2;
    return point;
  };

  proto.latlngToLayerPoint = function (latlng) {
    var point = this.latLngToPoint(latlng, this.zoom);
    var leftTopPoint = this.leftTopPoint(this.bounds.getCenter());
    point[0] -= leftTopPoint[0];
    point[1] -= leftTopPoint[1];
    return point;
  };

  proto.pointToLatLng = function (point, zoom) {};

  // 0.5 / Math.PI, 0.5, -0.5 / Math.PI, 0.5
  proto._a = 0.5 / Math.PI;
  proto._b = 0.5;
  proto._c = -0.5 / Math.PI;
  proto._d = 0.5;
  proto.transform = function (point, scale) {
    scale = scale || 1;
    point[0] = scale * (this._a * point[0] + this._b);
    point[1] = scale * (this._c * point[1] + this._d);
    return point;
  };

  proto.updateGeoLocation = function (uid, position) {
    this.myUserId = uid;
    var geo = this.map.find('#gps-marker');
    if (geo.length === 0) {
      geo = $('<div id="gps-marker">'
        + '<div id="gps-circle" style="display:none;"></div>'
        + '<div id="gps-dsnt" style="display:none;"></div>'
        + '<div id="gps-arrow"></div>'
      + '</div>');
      this.map.append(geo);
    }
    position = this.toMars(position);
    var point = this.latlngToLayerPoint(position.gps.slice(0, 2));
    geo.css({
        left: (point[0] - 11)
      , top: (point[1] - 11)
    });
    var status = Math.floor(Date.now() / 1000 - position.t) < 60;
    geo.find('#gps-arrow').attr('class', status ? 'online' : '');
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

  return StaticMaps;
});