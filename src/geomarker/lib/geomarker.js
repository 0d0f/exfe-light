/*global google */
define('geomarker', function () {
  'use strict';

  function GeoMarker(options) {
    this.options = options || {};
    this.div_ = null;
    this.setMap(this.map_ = this.options.map);
    delete this.options.map;
  }

  var proto = GeoMarker.prototype = new google.maps.OverlayView();

  proto.onAdd = function () {
    var opts = this.options
      , div = document.createElement('div');
    div.id = opts.id;
    div.innerHTML = '<div id="gpsarrow"></div>';
    this.div_ = div;
    this.getPanes().overlayLayer.appendChild(div);
  };

  proto.onRemove = function () {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
    // remove events
  };

  proto.draw = function () {
    var point = this.getProjection().fromLatLngToDivPixel(this.latlng)
      , opts = this.options
      , div = this.div_;

    div.style.top = (point.y - opts.height / 2) + 'px';
    div.style.left = (point.x - opts.width / 2) + 'px';
  };

  // s: 0 offline, 1 online
  proto.setStatus = function (i) {
    var img = this.div_.getElementById('gpsarrow');
    img.className = i ? 'online' : '';
  };

  proto.getPosition = function () {
    return this.latlng;
  };

  proto.setPosition = function (latlng) {
    this.latlng = latlng;
    this.draw();
  };

  return GeoMarker;
});
