define('staticmaps', function () {
  'use strict';

  var proto;


  function LatLngBounds() {}

  proto = LatLngBounds.prototype;

  //                       latlng = [lat, lng]
  proto.extend = function (latlng) {
    if (!this._southWest && !this._northEast) {
      this._southWest = latlng;
      this._northEast = latlng
    } else {
      this.minLat = this._southWest[0] = Math.min(latlng[0], this._southWest[0]);
      this.minLng = this._southWest[1] = Math.min(latlng[1], this._southWest[1]);
      this.maxLat = this._northEast[0] = Math.max(latlng[0], this._northEast[0]);
      this.maxLng = this._northEast[1] = Math.max(latlng[1], this._northEast[1]);
    }
  };

  proto.getCenter = function () {
    return [(this._southWest[0] + this._northEast[0]) / 2, (this._southWest[1] + this._northEast[1]) / 2];
  };

  proto.getNorthEast = function () { return this._northEast; };

  proto.getSouthWest = function () { return this._southWest; };

  proto.getNorthWest = function () { return [this._northEast[0], this._southWest[1]]; };

  proto.getSouthEast = function () { return [this._southWest[0], this._northEast[1]]; };


  function StaticMaps(map) {
    this.map = map;
    this.width = map.width();
    this.height = map.height();
    this.bounds = new LatLngBounds();
  }

  proto = StaticMaps.prototype;

  proto.initEnd = false;

  proto.load = function () {
    var self = this
      , bounds = this.bounds
      , c = bounds.getCenter()
      , zoom = 'zoom=' + this.getBoundsZoomLevel()
      , img = document.createElement('img')
      , size = 'size=' + this.width + 'x' + this.height
      , center = 'center=' + c[0] + ',' + c[1]
      , url = 'http://maps.googleapis.com/maps/api/staticmap?sensor=false&format=jpg&' + size + '&' + center + '&' + zoom;

    img.src = url;
    img.width = this.width;
    img.height = this.height;

    img.onload = img.onerror = function () {
      Debugger.alert('loaded');
    };

    this.map.append(img);
    this.map.removeClass();
  };

  proto._cache = [];

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

  proto.getScale = function () {
    var bounds = this.bounds;
    this.scaleX = ((bounds.maxLng - bounds.minLng) * 3600) / this.width;
    this.scaleY = ((bounds.maxLat - bounds.minLat) * 3600) / this.height;
  };

  proto.setBounds = function () {
    var bounds = this.bounds
      , cache = this._cache
      , d, p;

    for (var i = 0, len = cache.length; i < len; ++i) {
      d = cache[i];
      if (d.type === 'route') {
        p = d.positions[0].gps.slice(0, 2);
      } else if (d.type === 'location') {
        p = [d.lat, d.lng];
      }
      bounds.extend(p);
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

  proto.fromLatlngToPixel = function (latlng) {
    var bounds = this.bounds
      , x = (latlng[1] - bounds.minLng) * 3600 / this.scaleX
      , y = (bounds.maxLat - latlng[0]) * 3600 / this.scaleY;
    return [x, y];
  };

  proto.fromPixelToLatlng = function (point) {
    var bounds = this.bounds
      , lng = point[0] * this.scaleX / 3600 + bounds.minLng
      , lat = bounds.maxLat - point[1] * this.scaleY / 3600;
    return [lat, lng];
  };

  return StaticMaps;
});