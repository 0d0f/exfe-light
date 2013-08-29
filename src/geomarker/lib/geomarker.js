/*global google */
define('geomarker', function () {
  'use strict';

  function GeoMarker(options) {
    this.options = options || {};
    this.div_ = null;
    this.setMap(this.map_ = this.options.map);
    delete this.options.map;

    var opts = this.options
      , div = document.createElement('div')
      , arrow = document.createElement('div');
    arrow.id = 'gpsarrow';
    div.id = opts.id;
    div.appendChild(arrow);
    this.arrow_ = arrow;
    this.div_ = div;

    this.needleAngle = 0;
    this.accuracy = 0;
    this.currentHeading = 0;
  }

  var proto = GeoMarker.prototype = new google.maps.OverlayView();

  proto.onAdd = function () {
    this.getPanes().overlayLayer.appendChild(this.div_);
    this.listen();
  };

  proto.onRemove = function () {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
    // remove events
  };

  proto.draw = function () {
    var projection = this.getProjection();
    if (projection) {
      var point = projection.fromLatLngToDivPixel(this.latlng)
        , opts = this.options
        , div = this.div_;

      div.style.top = (point.y - opts.height / 2) + 'px';
      div.style.left = (point.x - opts.width / 2) + 'px';
    }
  };

  proto.setArrowRotate = function (n) {
    var style = this.arrow_.style;
    style.webkitTransform = style.transform = 'rotate(' + n + 'deg)';
  };

  proto.rotateNeedle = function () {
    var multiplier = Math.floor(this.needleAngle / 360);
    var adjustedNeedleAngle = this.needleAngle - (360 * multiplier);
    var delta = this.currentHeading - adjustedNeedleAngle;
    if (Math.abs(delta) > 180) {
      if (delta < 0) {
        delta += 360;
      } else {
        delta -= 360;
      }
    }
    delta /= 5;
    this.needleAngle = this.needleAngle + delta;
    var updatedAngle = this.needleAngle - window.orientation;
    this.setArrowRotate(this.needleAngle - 180);
  };

  proto.orientationHandle = function () {
    var self = this;
    return function o(e) {
      // https://developers.arcgis.com/en/javascript/jssamples/mobile_compass.html
      if (e.webkitCompassHeading != undefined) {
        // Direction values are measured in degrees starting at due north and continuing clockwise around the compass.
        // Thus, north is 0 degrees, east is 90 degrees, south is 180 degrees, and so on. A negative value indicates an invalid direction.
        self.currentHeading = (360 - e.webkitCompassHeading);
        self.accuracy = e.webkitCompassAccuracy;
      } else if (e.alpha != null) {
        // alpha returns the rotation of the device around the Z axis; that is, the number of degrees by which the device is being twisted
        // around the center of the screen
        // (support for android)
        self.currentHeading = (270 - e.alpha) * -1;
        self.accuracy = e.webkitCompassAccuracy;
      }

      self.rotateNeedle();
    };
  };

  proto.listen = function () {
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', this.orientationHandle(), false);
    }
  };

  // s: 0 offline, 1 online
  proto.setStatus = function (i) {
    this.arrow_.className = i ? 'online' : '';
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
