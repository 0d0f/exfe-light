define('staticmaps', function () {
  'use strict';

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


  function StaticMaps(map) {
    this.map = map;
    this.width = $(window).width();
    this.height = $(window).height();
    this.bounds = new LatLngBounds();
    this._cache = [];
  }

  proto = StaticMaps.prototype;

  proto.initEnd = false;

  proto.load = function () {
    this.zoom = this.getBoundsZoomLevel() - 1;
    var self = this
      , bounds = this.bounds
      , c = bounds.getCenter()
      , zoom = 'zoom=' + this.zoom
      , img = document.createElement('img')
      , size = 'size=' + this.width + 'x' + this.height
      , center = 'center=' + c[0] + ',' + c[1]
      // @todo: 适配语言
      , url = 'http://ditu.google.com/maps/api/staticmap?language=zh_CN&sensor=false&format=jpg&' + size + '&' + center + '&' + zoom;

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
    var point = this.fromLatlngToPixel(latlng);
    e.style.left = (point[0] - 9) + 'px';
    e.style.top = (point[1] - 9) + 'px';
    this.map.append(e);
  };

  proto.addPlace = function (d) {
    var tags = d.tags, tag, c;

    while ((tag = tags.shift())) {
      if (tag === 'xplace') {
        c = 'x-place'
      } else if (tag === 'destination') {
        c = 'd-place'
      }
    }

    var e = document.createElement('div');
    var point = this.fromLatlngToPixel([d.lat, d.lng]);
    if (c) {
      e.className = 'place ' + c;
    } else {
      e.style.backgroundImage = 'url(' + (d.icon || '/static/img/map_mark_diamond_blue@2x.png') + ')';
    }
    e.style.left = (point[0] - 6) + 'px';
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
        this.getScale();
        this.load();
      } else if (type === 'route' || type === 'location') {
        this._cache.push(result);
      }
    }
  };

  proto.getScale = function () {
    var bounds = this.bounds;
    //this.scaleX = ((bounds.maxLng - bounds.minLng) * 3600) / this.imgWidth;
    //this.scaleY = ((bounds.maxLat - bounds.minLat) * 3600) / this.imgHeight;
    var center = bounds.getCenter();
    this.scaleX = center[1] * 3600 / (this.width / 2);
    this.scaleY = center[0] * 3600 / (this.height / 2);
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

  proto.latLngToPoint = function (latlng, zoom) {
  };

  proto.pointToLatLng = function (point, zoom) {
  };

  proto.fromLatlngToPixel = function (latlng) {
    var bounds = this.bounds
      // , x = (latlng[1] - bounds.minLng) * 3600 / this.scaleX
      // , y = (bounds.maxLat - latlng[0]) * 3600 / this.scaleY;
      , center = bounds.getCenter()
      , x = (latlng[1] - center[1]) * 3600 / this.scaleX + this.width / 2
      , y = (center[0] - latlng[0]) * 3600 / this.scaleY + this.height / 2;
    return [x, y];
  };

  proto.fromPixelToLatlng = function (point) {
    var bounds = this.bounds
      //, lng = point[0] * this.scaleX / 3600 + bounds.minLng
      //, lat = bounds.maxLat - point[1] * this.scaleY / 3600;
      , center = bounds.getCenter()
      , lng = (point[0] - this.width / 2) * this.scaleX / 3600 + center[1]
      , lat = center[0] - (point[1] - this.height / 2) * this.scaleY / 3600;
    return [lat, lng];
  };

  return StaticMaps;
});