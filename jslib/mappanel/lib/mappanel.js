/**
 * Exfe's MatePanel Widget.
 * 日期控件
 */
define('mappanel', function (require, exports, module) {

  var $ = require('jquery')
    , R = require('rex')
    , Config = require('config')
    , $proxy = $.proxy
    , SPLITTER = /[\r\n]+/g
    , CR = '\r'
    , geolocation = window.navigator.geolocation
    , $win = $(window);

  var Panel = require('panel');

  var MapPanel = Panel.extend({

      options: {

          template: ''
          + '<div class="panel map-panel" tabindex="-1" data-widget="panel" id="map-panel">'
            //<div class="panel-header"></div>
            + '<div class="panel-body">'
              + '<div class="map-container">'
                + '<div class="map-box" id="gmap"></div>'
                + '<div class="map-place">'
                  + '<div class="place-editor">'
                    + '<i class="pointer icon24-enter place-submit"></i>'
                    + '<textarea class="normal" name="place-text" id="place-text" placeholder="Enter place here."></textarea>'
                  + '</div>'
                  + '<div class="map-places hide">'
                    + '<ul class="unstyled places-list" tabindex="-1"></ul>'
                  + '</div>'
                + '</div>'
              + '</div>'
            + '</div>'
            //<div class="panel-footer"></div>
          + '</div>'

        , parentNode: null

        , srcNode: null

        // place object
        , place: null

      }

    , isGeoSupported: !!geolocation

    , setGeos: function (userGeo, placeGeo, hasLatLng) {
        this.userPosition = userGeo;
        this.placePosition = placeGeo;
        this.hasLatLng = hasLatLng;
        this.xmap.initMap();
      }

    , init: function () {
        var options = this.options;

        this.render();

        // save origin place data
        this.originPlace = options.place;
        this.place = $.extend({}, options.place);
        delete options.place;

        this.placeInput = new PlaceInput(this, '#place-text');
        this.placesList = new PlacesList(this, '.places-list');
        this.xmap = new XMap(this, '#gmap');
        this.listen();
      }

    , listen: function () {
        var self = this
          , place = this.place;

        // `this.update` init config
        this.on('update-place', this.update);

        this.on('change-place', this.change);

        this.on('geos', this.setGeos);

        this.on('search-completed', this.searchCompleted);

        this.on('placeinput-tab', this.placeInputTab);
        this.on('placeslist-tab', this.placesListTab);

        // marker
        this.on('clear-marker', this.clearMarker);
        // select place-item --> marker
        this.on('enter-marker', this.enterMarker);

        // mouseenter marker --> place-item
        this.on('enter-placeitem', this.enterPlaceItem);
        // click marker --> place-item
        this.on('click-placeitem', this.clickPlaceItem);

        // zoom map
        this.on('zoomup-map', this.zoomUpMap);
        this.on('zoomdown-map', this.zoomDownMap);

        this.element.on('click.mappanel', '.place-submit', function (e) {
          // NOTE: 先用老事件触发保存
          $('body').click();
        });

        this.element.on('keydown.mappanel', $proxy(this.keydown, this));
      }

    , save: function () {
        this.$('.place-submit')
          .trigger('click.mappanel');
      }

    , keydown: function (e) {
        var self = this;
        // escape
        if (27 === e.keyCode) {
          self.revert();
        }
        else if (e.ctrlKey && 13 === e.keyCode) {
          self.emit('update-place', self.place);
          self.save();
        }
        // big map
        else if (e.ctrlKey && 187 === e.keyCode) {
          self.emit('zoomup-map', 0);
        }
        // small map
        else if (e.ctrlKey && 189 === e.keyCode) {
          //self.emit('zoomdown-map', 1);
        }
      }

    , zoomUpMap: function (n) {
        this.xmap.zoom(n);
      }

    , zoomDownMap: function (n) {
        this.xmap.zoom(n);
      }

    , clickPlaceItem: function (i) {
        this.placesList.setPlace();
      }

    , enterPlaceItem: function (i) {
        this.placesList.selectItem(i);
      }

    , enterMarker: function (i) {
        this.xmap.showMarker(i);
      }

    , clearMarker: function (i) {
        this.xmap.saveMarker(i);
      }

    , searchCompleted: function (places) {
        this.placesList.update(places);
      }

    , placeInputTab: function () {
        var placesList = this.placesList
          , $placesList = placesList.$element
          , placeInput = this.placeInput
          , s = placesList.status
          , t;
        if (s) {
          // firefox hack
          t = setTimeout(function () {
            clearTimeout(t);
            $placesList.focus();
          }, 0);
        //} else {
          //this.element.focus();
        }
      }

    , placesListTab: function () {
        var $placeText = this.placeInput.$element
        // firefox hack
        , t = setTimeout(function () {
          clearTimeout(t);
          $placeText.focusend();
        }, 0);
      }

    , change: function (place, searchable) {
        searchable = !!searchable
        var placeData = this.place
          , oldTitle = placeData.title;
        placeData.title = place.title;
        placeData.description = place.description;
        placeData.lat = place.lat || '';
        placeData.lng = place.lng || '';
        if (searchable) {
          if (oldTitle !== place.title) {
            this.xmap.textSearch(place.title);
          }
        } else {
          this.placeInput.change(printPlace(place.title, place.description));
        }
        this.emit('update-place', placeData);
      }

    , revert: function (e) {
        this.emit('update-place', this.originPlace);
      }

    , showPlace: function () {
        var self = this
          , place = this.place
          , title = place.title
          , description = place.description
          // 只要 `title` 和 `description` 都没有就显示 `Enter place here.`
          , sc = !title && !description
          , hasLatLng = place.lat && place.lng
          , userGeo, placeGeo;

        this.placeInput.change(printPlace(title, description));

        // first focus Container
        this.element.focus();

        if (sc) {
          this.placeInput.$element.focusend();
        }

        if (hasLatLng) {
          placeGeo = { coords: { latitude: place.lat, longitude: place.lng, title: place.title } };
        }

        if (this.isGeoSupported) {
          geolocation
            .getCurrentPosition(
                function (position) {
                  userGeo = position;
                  hasLatLng || (placeGeo = userGeo);
                  self.setGeos(userGeo, placeGeo, hasLatLng);
                }
              , function (msg) {
                  userGeo = { coords: Config.location };
                  hasLatLng || (placeGeo = userGeo);
                  self.setGeos(userGeo, placeGeo, hasLatLng);
                }
            );
        }
        else {
          userGeo = { coords: Config.location };
          hasLatLng || (placeGeo = userGeo);
          self.setGeos(userGeo, placeGeo, hasLatLng);
        }
      }

    , showBefore: function () {
        this.element.attr('editarea', 'map-panel');
      }

    , showAfter: function () {
        var srcNode = this.srcNode;
        if (srcNode) {
          var offset = srcNode.offset()
            , width = this.element.outerWidth();
          this.element
            .css({ left: offset.left - width - 15 , top: offset.top });
        }
        this.showPlace();
      }

    , destory: function () {
        this.element.off();
        this.element.remove();
        this._destory();
      }
  });


  /**
   * PlaceInput
   */
  var PlaceInput = function (component, selector) {
    this.component = component
    this.$container = this.component.element;
    this.selector = selector;
    this.$element = this.component.$(selector);
    this.listen();
  };

  PlaceInput.prototype = {

      change: function (s) {
        this.$element.val(s);
      }

    , listen: function () {
        var $container = this.$container
          , selector = this.selector;
        $container
          .on('blur.mappanel', selector, $proxy(this.blur, this))
          .on('keypress.mappanel', selector, $proxy(this.keypress, this))
          .on('keyup.mappanel', selector, $proxy(this.keyup, this))
          .on('keydown.mappanel', selector, $proxy(this.keydown, this))
          .on('focus.mappanel', selector, $proxy(this.focus, this));
      }

    , lookup: function () {
        var value = this.$element.val()
          , place = parsePlace(value);

        this.component.emit('change-place', place, true);
      }

    //, click: function (e)  {}

    , blur: function (e) {
        this.$element.addClass('normal');
      }

    , focus: function (e) {
        this.$element.removeClass('normal');
      }

    // , mouseenter: function (e) {}

    , keyup: function (e) {
        switch (e.keyCode) {
          case 40: // down arrow
          case 38: // up arrow
          case 16: // shift
          case 17: // ctrl
          case 18: // alt
          case  9: // tab
          case 13: // enter
          case 27: // escape
            break;

          default:
            this.lookup();
        }
        e.stopPropagation();
        e.preventDefault();
      }

    , keyHandler: function (e) {
        var component = this.component
          , kc = e.keyCode;
        switch (kc) {
          case 9: // tab
            // 监听 tab, 自定义事件
            e.preventDefault();
            component.emit('placeinput-tab');
            break;
        }
      }

    , keypress: function (e) {
        if (this.suppressKeyPressRepeat) {
          return;
        }
        this.keyHandler(e);
      }

    , keydown: function (e) {
        this.suppressKeyPressRepeat = !!~R.indexOf([9], e.keyCode);
        this.keyHandler(e);
      }

  };


  /**
   *
   */
  var PlacesList = function (component, selector) {
    this.template = ''
              + '<li class="place-item" data-latitude="{{lat}}" data-longitude="{{lng}}">'
                + '<div class="rank">{{i}}</div>'
                + '<address><div class="title">{{title}}</div><div class="description">{{address}}</div></address>'
              + '</li>'
    this.component = component
    this.$container = this.component.element;
    this.selector = selector;
    this.$element = this.component.$(selector);

    this.$items = null;
    this.len = 0;
    this.curr = 0;

    this.viewportRows = 12;
    this.viewportIndex = 0;
    this.scrollIndexs = [0, 11]
    this.scrollNum = 1;
    this.itemPX = 36;

    this.listen();
  };

  PlacesList.prototype = {

      listen: function () {
        var $container = this.$container
          , selector = this.selector;
        $container
          .on('blur.mappanel', selector, $proxy(this.blur, this))
          .on('keypress.mappanel', selector, $proxy(this.keypress, this))
          .on('keyup.mappanel', selector, $proxy(this.keyup, this))
          .on('keydown.mappanel', selector, $proxy(this.keydown, this))
          .on('focus.mappanel', selector, $proxy(this.focus, this))
          .on('click.mappanel', selector + ' > li', $proxy(this.click, this))
          .on('mouseenter.mappanel', selector + ' > li', $proxy(this.mouseenter, this));
      }

    , update: function (places) {
        this.status = !!places.length;
        this.$element.empty();
        this.curr = 0;
        var html = '', li, template = this.template;
        if (this.status) {
          R.each(places, function (v, i) {
            li = template;
            html += li.replace('{{i}}', i + 1)
              .replace('{{title}}', v.name)
              .replace('{{address}}', v.formatted_address)
              .replace('{{lat}}', v.geometry.location.Ya)
              .replace('{{lng}}', v.geometry.location.Za);
          });

          this.$element.html(html);
        }
        this.$element.parent().toggleClass('hide', !this.status);
      }

    , blur: function () {
        this.removeCurrStyle('hover');
      }

    , mouseenter: function (e) {
        var $item = $(e.currentTarget)
          , i = $item.index();
        this.selectItem(i, true);
        this.component.emit('enter-marker', i);
      }

    , selectItem: function (i, scrollable) {
        if (0 === this.len) {
          this.$items = this.$element.find(' > li');
          this.len = this.$items.length;
        }
        this.removeCurrStyle('hover');
        this.curr = i;
        !scrollable && this.$element.scrollTop(Math.floor(i / this.viewportRows) * this.itemPX * this.viewportRows);
        this.addCurrStyle('hover');
      }

    , focus: function (e) {
        this.$items = this.$element.find(' > li');
        this.len = this.$items.length;
        this.addCurrStyle('hover');
        this.component.emit('enter-marker', this.curr);
      }

    , addCurrStyle: function (c) {
        this.$items
          .eq(this.curr)
          .addClass(c);
      }

    , removeCurrStyle: function (c) {
        this.len
          && this.$items
            .eq(this.curr)
            .removeClass(c);
      }

    , clear: function () {
        this.curr = 0;
        this.len = 0;
        this.viewportIndex = 0;
        this.$items = null;
        this.$element.empty()
          .parent().addClass('hide');
      }

    , setPlace: function () {
        if (0 === this.len) { return; }
        var component = this.component
          , $li = this.$items.eq(this.curr)
          , place = {
              title: $li.find('div.title').text()
            , description: $li.find('div.description').text()
            , lat: String($li.data('latitude'))
            , lng: String($li.data('longitude'))
          };
        component.emit('clear-marker', this.curr);
        component.emit('change-place', place, false);
        this.clear();
      }

    , scroll: function (arrow) {
        var si = this.scrollIndexs
          , l = this.viewportRows
          , len = this.len
          , n = this.scrollNum
          , h = this.itemPX
          , i = this.curr
          , row = this.viewportIndex += arrow;

        if (row === si[1] + 1 && i === len - 1) {
          this.$element.scrollTop(0);
          this.viewportIndex = 0;
        }

        else if (row === si[0] - 1 && i === 0) {
          this.$element.scrollTop((len - l) * h);
          this.viewportIndex = 11;
        }

        else if ((row === si[0] - 1 && i > si[0]) ||
            (i < len - (l - si[1]) && row === si[1] + 1)) {
          var t = this.$element.scrollTop();
          this.$element.scrollTop(t += arrow * h * n);
          this.viewportIndex = si[(arrow + 1) / 2];
        }
      }

    , prev: function () {
        this.removeCurrStyle('hover');
        if (0 === this.curr) {
          this.curr = this.len;
        }
        this.curr--;
        this.addCurrStyle('hover');
      }

    , next: function () {
        this.removeCurrStyle('hover');
        this.curr++;
        if (this.len === this.curr) {
          this.curr = 0;
        }
        this.addCurrStyle('hover');
      }

    , keyup: function (e) {
        e.stopPropagation();
        e.preventDefault();
      }

    , keyHandler: function (e) {
        var self = this
          , component = self.component
          , ctrlKey = e.ctrlKey
          , kc = e.keyCode;
        switch (kc) {
          case 9: // tab
            e.preventDefault();
            // 监听 tab, 自定义事件
            component.emit('placeslist-tab');
            break;
          case 13: // enter
          case 32: // spacing
            if (!ctrlKey) {
              e.preventDefault();
              self.setPlace();
              component.emit('enter-marker', self.curr);
            }
            break;
          case 38: // up
            e.preventDefault();
            self.scroll(-1);
            self.prev();
            component.emit('enter-marker', self.curr);
            break;
          case 40: // down
            e.preventDefault();
            self.scroll(1);
            self.next();
            component.emit('enter-marker', self.curr);
            break;
        }
      }

    , keypress: function (e) {
        if (this.suppressKeyPressRepeat) {
          return;
        }
        this.keyHandler(e);
      }

    , keydown: function (e) {
        this.suppressKeyPressRepeat = !!~R.indexOf([9, 13, 32, 38, 40], e.keyCode);
        this.keyHandler(e);
      }

    , click: function (e) {
        this.curr = $(e.currentTarget).index();
        this.setPlace();
        this.component.save();
      }
  };


  /**
   * X Map.
   */
  var XMap = function (component, selector) {
    this.component = component;
    this.selector = selector;
    this.$element = this.component.$(selector);

    // google.maps
    this.GMaps = null;

    // map size: 0/1 <--> big/small
    this.sizeStatus = 1;
    this.zoomNum = 16;

    // 地图放大，窗口可视区域的 80%
    this.a = .8;

    // callback id
    this.cbid = 0;

    // markers
    this.markers = [];
    this.curr = 0;
  };

  XMap.prototype = {

      resize: function (w, h) {
        w < 880 && (w = 880);
        h < 500 && (h = 500);
        this.$element
          .width(w)
          .height(h);
      }

    , initMap: function () {
        var component = this.component;
        this.userPosition = component.userPosition;
        this.placePosition = component.placePosition;
        this.hasLatLng = component.hasLatLng;
        var coords = this.placePosition.coords;
        coords || (this.placePosition.coords = coords = {});
        coords.latitude || (coords.latitude = '');
        coords.longitude || (coords.longitude = '');
        this.isGo = true;

        this._request = {
          radius: 50000
        };

        try {
          var GMaps = this.GMaps = google.maps;
          this._center = new GMaps.LatLng(coords.latitude, coords.longitude);
          // location: ''
          this._request.location = this._center;

          this.createIcons();

          this.disableOptions = {
              panControl: false
            , zoomControl: false
            , scaleControl: false
            , mapTypeControl: false
            , overviewMapControl: false
          };

          this.enableOptions = {
              panControl: true
            , panControlOptions: {
                position: GMaps.ControlPosition.RIGHT_TOP
              }
            , zoomControl: true
            , zoomControlOptions: {
                position: GMaps.ControlPosition.RIGHT_TOP
              }
            , scaleControl: true
            , scaleControlOptions: {
                position: GMaps.ControlPosition.RIGHT_TOP
              }
          };

          this._map = new GMaps.Map(this.$element[0]
            , {
                zoom: this.zoomNum
              , center: this._center
              , MapTypeId: GMaps.MapTypeId.ROADMAP
            }
          );

          this._map.setOptions(this.disableOptions);

          this._overlay = new GMaps.OverlayView();
          this._overlay.draw = function () {};
          this._overlay.setMap(this._map);

          if (this.hasLatLng) {
            this._placeMarker = new GMaps.Marker({
                position: new GMaps.LatLng(this.placePosition.coords.latitude, this.placePosition.coords.longitude)
              , map: this._map
              , icon: this.bicon
              , title: this.placePosition.coords.title || ''
            });
            this.markers.push(this._placeMarker);
            // 中心点偏右上
            this._map.panBy(-100, 0);
          }

          this._userMarker = new GMaps.Marker({
              position: new GMaps.LatLng(this.userPosition.coords.latitude, this.userPosition.coords.longitude)
            , map: this._map
            , icon: this.sbicon
            , title: this.userPosition.coords.title || ''
          });

          this._service = new GMaps.places.PlacesService(this._map);

          //google.maps.event.addListener(this._map, 'bounds_changed', function () { console.dir(this.getBounds()); });

          var self = this;
          google.maps.event.addListener(this._map, 'click', function () {
            if (self.sizeStatus) {
              self.zoom(0);
            }
          });
        } catch (e) {
          this.isGo = false;
        }
      }

    , updateCenter: function (place) {
        if (this.isGo) {
          var GMaps = this.GMaps;
          this._center = new GMaps.LatLng(place.lat, place.lng);
          this._map.setCenter(this._center);
          //this._marker.setPosition(this._center);
        }
      }

    , textSearch: function (query) {
        var self = this
          , GMaps = this.GMaps
          , isGo = self.isGo
          , component = self.component
          , service = self._service
          , request = self._request
          , cb;

        if (isGo && query && query !== request.query) {
          request.query = query;
          cb = function (results, status) {
            if (cb.id === self.cbid
              && status === GMaps.places.PlacesServiceStatus.OK) {
              self.cbid = 0;
              self.clearMarkers();
              self.createMarkers(results);
              component.emit('search-completed', results);
            }
          };
          // 避免多异步回调问题
          cb.id = ++self.cbid;
          service.textSearch(request, cb);
        } else {
          component.emit('search-completed', []);
        }
      }

    , panToRight: function () {
        var GMaps = this.GMaps
          , map = this._map
          , overlay = this._overlay
          , projection = overlay.getProjection()
          , GPoint = GMaps.Point
          , point =  projection.fromLatLngToContainerPixel(map.getCenter())
          , center = projection.fromContainerPixelToLatLng(new GPoint(point.x - 100, point.y));
        map.setCenter(center);
      }

    , showMarker: function (i) {
        // small size
        if (this.sizeStatus) {
          if (this.zoomNum !== this._map.getZoom()) {
            this._map.setZoom(this.zoomNum);
          }
        }
        this.selectMarker(i, this.sizeStatus);
        if (this.sizeStatus) {
          var marker = this.markers[this.curr];
          this._map.setCenter(marker.getPosition());
          this.panToRight();
        }
      }

    , selectMarker: function (i, isMouseEnter) {
        var map = this._map
          , oldMarker = this.markers[this.curr]
          , marker = this.markers[this.curr = i]
          , ricon = this.ricon
          , bicon = this.bicon;
        if (oldMarker) {
          oldMarker.setZIndex(null);
          oldMarker.setIcon(ricon);
        }
        marker.setIcon(bicon);
        marker.setZIndex(377);
        this._placeMarker = marker;
        !isMouseEnter && map.panTo(marker.getPosition());
      }

    , createIcons: function () {
        var GMaps = this.GMaps
          , url = Config.site_url + '/static/img/icons.png'
          , gSize = GMaps.Size
          , gPoint = GMaps.Point;
        // blue-icon 26 * 36
        this.bicon = new GMaps.MarkerImage(url, new gSize(26, 36), new gPoint(0, 78));
        // red-icon 26 * 36
        this.ricon = new GMaps.MarkerImage(url, new gSize(26, 36), new gPoint(26, 78));
        // small-blue-icon 12 * 14
        this.sbicon = new GMaps.MarkerImage(url, new gSize(12, 14), new gPoint(52, 100));
      }

    , saveMarker: function (i, isMouseEnter) {
        this.selectMarker(i, isMouseEnter);
        var oldMarker = this.markers.splice(i, 1)[0];
        this.clearMarkers();
        this.markers.push(oldMarker);
      }

    , clearMarkers: function () {
        var markers = this.markers
          , marker;
        while (marker = markers.shift()) {
          marker.setMap(null);
          marker = null;
        }
        this.curr = 0;
      }

    , createMarkers: function (places) {
        var self = this
          , component = this.component
          , GMaps = this.GMaps
          , bounds = new GMaps.LatLngBounds()
          , markers = this.markers
          , map = this._map
          , ricon = this.ricon
          , place
          , marker
          , location
          , i = 0;
        for (; place = places[i]; ++i) {
          location = place.geometry.location;
          marker = new GMaps.Marker({
              map: map
            , icon: ricon
            , title: place.name
            , position: location
            , zIndex: 0
          });

          // events
          // click
          GMaps.event.addListener(marker, 'click', function () {
            var i = self.indexOf(markers, this);
            component.emit('click-placeitem', i);
          }, false);

          // mouseover
          GMaps.event.addListener(marker, 'mouseover', function () {
            var i = self.indexOf(markers, this);
            self.selectMarker(i, true);
            component.emit('enter-placeitem', i);
          });

          // mouseout
          //GMaps.event.addListener(marker, 'mouseout', function () { });

          markers.push(marker);
          bounds.extend(location);
        }
        map.fitBounds(bounds);
      }

    , zoom: function (n) {
        this.sizeStatus = n;
        var width = $win.width()
          , height = $win.height()
          , GMaps = this.GMaps
          , a = this.a
          , component = this.component
          , self = this
          , sT = $win.scrollTop()
          , sL = $win.scrollLeft();
        width *= a;
        height *= a;
        self.resize(width, height);
        component.element.css({
            top: height * (1 - a) / 2 + sT
          , left: width * (1 - a) / 2 + sL
        });
        self._map.setOptions(this.enableOptions);
        GMaps.event.trigger(self._map, 'resize');
        // 返回到中心点
        //self._map.panTo(self.hasLatLng ? self._placeMarker.getPosition() : self._userMarker.getPosition());
        self._map.setCenter(self.hasLatLng ? self._placeMarker.getPosition() : self._userMarker.getPosition());
      }

      // marker index
    , indexOf: function (markers, marker) {
        return R.indexOf(markers, marker);
      }

  };


  // Helpers:
  var parsePlace = function (placeString) {
    placeString || (placeString = '');
    var ps = placeString.split(SPLITTER)
      , title = ps.length ? $.trim(ps.shift()) : ''
      , description = $.trim(ps.join(CR));

    return {
        title: title
      , description: description
    };
  };

  var printPlace = function (title, description) {
    return title + (description ? CR + description.replace(SPLITTER, CR) : '');
  };

  return MapPanel;
});
