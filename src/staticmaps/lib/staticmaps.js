// https://github.com/Leaflet/Leaflet
// https://code.google.com/p/google-ajax-examples/source/browse/trunk/nonjslocalsearch/localSearch.py
// http://stackoverflow.com/questions/12507274/how-to-get-bounds-of-a-google-static-map
// https://developers.google.com/maps/documentation/staticmaps/?hl=zh-cn#Imagesizes - Size Limit

define('staticmaps', function () {
  'use strict';

  var MERCATOR_RANGE = 256;
  var apiv3_url = window._ENV_.apiv3_url;
  var mapmark = apiv3_url + '/icons/mapmark';
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

  proto.contains = function (latlng) {
    var sw = this._southWest
      , ne = this._northEast
      , sw2 = latlng
      , ne2 = latlng;

    return (sw2[0] >= sw[0]) && (ne2[0] <= ne[0]) && (sw2[1] >= sw[1]) && (ne2[1] <= ne[1]);
  };


  function StaticMaps(map, myUserId, mode) {
    this.map = map;
    this.myUserId = myUserId;
    this.MODE = mode || 'free';
    this.bounds = new LatLngBounds();
    this.width = $(window).width();
    this.height = $(window).height();
    this._cache = [];
    this.latOffset = 0;
    this.lngOffset = 0;

    this.topOffset = 0;
    this.leftOffset = 0;

    this.lines = {};

    this.canvas = document.getElementById('static-map-canvas');
    this.canvas.width = this.width * 2;
    this.canvas.height = this.height * 2;
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
    this.ctx = this.canvas.getContext('2d');

    this.readyStatus = false;
    this.setImg();
  }

  proto = StaticMaps.prototype;

  proto.initEnd = false;

  proto.setImg = function () {
    this.imgWidth = this.width;
    this.imgHeight = this.height;
    if (this.MODE === 'free') {
      //
      var pw = this.width / 640
        , ph = this.height / 640;

      if (pw > 1 && pw > ph) {
        this.imgWidth = 640;
        this.imgHeight = this.height;
      } else if (pw > 1 && pw < ph) {
        this.imgWidth = this.imgHeight = 640;
      } else if (ph > 1 && ph > pw) {
        this.imgHeight = 640;
        this.imgWidth = this.width;
      }
      this.leftOffset = (this.width - this.imgWidth) / 2;
      this.topOffset = (this.height - this.imgHeight) / 2;
    }

  };

  proto.setOffset = function (offset) {
    this.latOffset = offset.earth_to_mars_latitude * 1;
    this.lngOffset = offset.earth_to_mars_longitude * 1;
  };

  proto.load = function () {
    var self = this
      , c = this.center
      , zoom = 'zoom=' + this.zoom
      , img = document.createElement('img')
      , size = 'size=' + this.imgWidth + 'x' + this.imgHeight
      , center = 'center=' + c[0] + ',' + c[1]
      // @todo: 适配语言
      , url = 'http://ditu.google.com/maps/api/staticmap?key=' + window._ENV_.MAP_KEY + '&language=zh_CN&sensor=false&format=jpg&' + size + '&' + center + '&' + zoom;

    img.className = 'static-map-img';
    img.src = url;
    img.width = this.imgWidth;
    img.height = this.imgHeight;
    img.style.top = this.topOffset + 'px';
    img.style.left = this.leftOffset + 'px';

    this.img = img;

    img.onload = function () {
      self.map.append(img);
      self.abortImage();
    };

    img.onerror = function () {
      self.map.find('#failed').removeClass('hide');
      self.abortImage();
    };
  };

  proto.abortImage = function () {
    var img = this.img;
    if (img) {
      img.onload = img.onerror = img = this.img = null;
    }
  };

  proto.hide = function () {
    this.map.remove();
    this.canvas.remove();
  };

  proto.show = function () {
    this.map.removeClass('hide');
    this.canvas.className = '';
  };

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
    var uid = d.id.split('.')[1];
    if (uid == this.myUserId) { return; }
    var c = 'grey';
    var position = d.positions[0];
    if (Math.floor(Date.now() / 1000 - position.t) < 60) { c = 'red'; }
    var e = document.createElement('div');
    e.className = 'dot ' + c + '-dot';
    var latlng = position.gps.slice(0, 2);
    var point = this.getOffsetPoint(latlng);
    e.style.left = (point[0] - 9) + 'px';
    e.style.top = (point[1] - 9) + 'px';
    e.setAttribute('data-uid', uid);
    e.setAttribute('data-lat', latlng[0]);
    e.setAttribute('data-lng', latlng[1]);
    e.setAttribute('data-color', c === 'grey' ? '#b2b2b2' : '#ff7e98');
    this.map.append(e);
  };

  proto.addPlace = function (d) {
    var uid = d.id.split('.')[1]
      , tags = d.tags, tag, c;

    if (uid === this.myUserId) {
      return;
    }

    var t = 0, zIndex = 0;
    if (tags) {
      while ((tag = tags.shift())) {
        if (tag === 'xplace') {
          t ^= 1;
        } else if (tag === 'destination') {
          t ^= 2;
        }
      }
    }

    var e = document.createElement('div');
    var latlng = [d.lat, d.lng];
    var point = this.getOffsetPoint(latlng);
    e.style.left = (point[0] - 12) + 'px';
    e.style.top = (point[1] - 34) + 'px';
    this.map.append(e);

    if (t === 1 || t === 3) {
      c = 'x-place';
      zIndex = 1;
    }

    if (t === 2 || t === 3) {
      c = 'd-place'
      zIndex = 2;
      var destPlace = this.destPlace;
      if (destPlace) {
        destPlace.style.backgroundImage = 'url(' + mapmark + ')';
        destPlace.style.zIndex = 0;
        this.destPlace = e;
      }
      if (t !== 3) {
        e.style.zIndex = 2;
      }
    }

    if (c) {
      e.className = 'place ' + c;
    } else {
      e.className = 'place';
      e.style.backgroundImage = 'url(' + (d.icon || mapmark) + ')';
    }
  };

  proto.contains = function () {
    var self = this
      , bounds = this.bounds
      , dots = this.map.find('.dot')
      , ids = document.getElementById('identities')._ids || {};

    dots.each(function () {
      var $t = $(this)
        , uid = $t.attr('data-uid')
        , lat = $t.attr('data-lat') * 1
        , lng = $t.attr('data-lng') * 1
        , color = $t.attr('data-color');
      self.containsOne(uid, [lat, lng], bounds, ids, color);
    });
  };

  proto.containsOne = function (uid, latlng, bounds, ids, color, b) {
    if (!bounds) {
      bounds = this.bounds;
    }
    if (!ids) {
      ids = document.getElementById('identities')._ids || {};
    }
    if (bounds.contains(latlng) && (b = ids[uid])) {
      var p = this.getOffsetPoint(latlng);
      var line = this.lines[uid];
      if (!line) { line =  []; }
      line[0] = [b[1], b[2]];
      line[1] = [b[1] + 13, b[2]];
      line[2] = [p[0], p[1]];
      line[3] = color;
      this.updateLine(uid, line);
    } else {
      this.removeLine(uid);
    }
  };

  proto.clearLines = function () {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
  proto.removeLine = function (uid) {
    delete this.lines[uid];
    this.updateLines();
  };
  proto.updateLines = function () {
    this.clearLines();
    var lines = this.lines;
    for (var k in lines) {
      this.addLine(k, lines[k]);
    }
  };
  proto.updateLine = function (uid, points) {
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

  proto.draw = function (result) {
    var type = result.type
      , action = result.action;

    if (!this.initEnd) {
      if (type === 'command' && action === 'init_end') {
        // load static map
        this.initEnd = true;
        this.setBounds();
        this.update();
        this.updateGeoLocation(this.myUserId, this.position);
        this.canvas.className = '';
        this.contains();
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
    this.zoom = this.getBoundsZoomLevel() - 1;
    this.center = this.bounds.getCenter();
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

    var latZoom = zoom(this.imgHeight, WORLD_DIM.height, latFraction);
    var lngZoom = zoom(this.imgWidth, WORLD_DIM.width, lngFraction);

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
    point[0] -= this.imgWidth / 2;
    point[1] -= this.imgHeight / 2;
    return point;
  };

  proto.latlngToLayerPoint = function (latlng) {
    var point = this.latLngToPoint(latlng, this.zoom);
    var leftTopPoint = this.leftTopPoint(this.center);
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

  proto.getOffsetPoint = function (latlng) {
    var point = this.latlngToLayerPoint(latlng);
    point[0] += this.leftOffset;
    point[1] += this.topOffset;
    return point;
  };

  proto.updateGeoPosition = function (position) {
    this.position = position;
    this.bounds.extend(position.gps.slice(0, 2));
  };

  proto.updateGeoLocation = function (uid, position) {
    if (!this.center) { return; }
    if (!position) { return; }
    this.myUserId = uid;
    var geo = this.map.find('.gps-marker');
    if (geo.length === 0) {
      geo = $('<div class="gps-marker">'
        + '<div class="gps-circle" style="display:none;"></div>'
        + '<div class="gps-dsnt" style="display:none;"></div>'
        + '<div class="gps-arrow"></div>'
      + '</div>');
      this.map.append(geo);
    }
    position = this.toMars(position, true);
    var point = this.getOffsetPoint(position.gps.slice(0, 2));
    geo.css({
        left: (point[0] - 11)
      , top: (point[1] - 11)
    });
    var status = Math.floor(Date.now() / 1000 - position.t) < 60;
    geo.find('.gps-arrow').attr('class', status ? 'gps-arrow online' : 'gps-arrow');
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