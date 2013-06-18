/* jshint -W015 */
/* jshint -W030 */

/**
 * Exfe's MatePanel Widget.
 * 日期控件
 */
define('mappanel', function (require) {
  'use strict';

  var $ = require('jquery'),
      proxy = $.proxy,
      extend = $.extend,
      _ENV_ = window._ENV_,
      MAP_KEY = _ENV_.MAP_KEY,
      LOCATION = _ENV_.location,
      site_url = _ENV_.site_url,
      lead0 = require('humantime').lead0,
      R = require('rex'),
      SPLITTER = /[\r\n]+/g,
      CR = '\r',
      geolocation = window.navigator.geolocation,
      $win = $(window),
      isIE = $.browser.msie,
      isMapLoaded = false;

  var Panel = require('panel');

  var MapPanel = Panel.extend({

      options: {

          template: ''
          + '<div class="panel map-panel" tabindex="-1" data-widget="panel" id="map-panel">'
            //<div class="panel-header"></div>
            + '<div class="panel-body">'
              + '<div class="map-container">'
                + '<div class="gmap-wrap"><div class="map-box" id="gmap"></div></div>'
                + '<div class="map-mask"></div>'
                + '<div class="map-resize"><span class="expand">Expand</span><span class="compact">Compact</span><span class="rb"></span><span class="lt"></span></div>'
                + '<div class="map-place">'
                  + '<div class="place-editor">'
                    + '<i class="pointer icon-enter-blue place-submit"></i>'
                    + '<div class="place-filter"></div>'
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
        this.xmap.initMap(userGeo, placeGeo, hasLatLng);
      }

    , init: function () {
        var options = this.options,
            element;

        this.render();
        element = this.element;

        // save origin place data
        this.originPlace = options.place;
        this.place = extend({}, options.place);
        delete options.place;

        this.placeInput = new PlaceInput(this, '#place-text');
        this.placesList = new PlacesList(this, '.places-list');
        this.xmap = new XMap(this, '#gmap');
        this.listen();

        this.$resize = element.find('.map-resize');
        this.$mask = element.find('.map-mask');
      }

    , listen: function () {
        var self = this;

        // `this.update` init config
        this.on('update-place', this.update);

        this.on('change-place', this.change);

        this.on('geos', this.setGeos);

        this.on('search-completed', this.searchCompleted);

        this.on('placeinput-tab', this.placeInputTab);
        this.on('placeslist-tab', this.placesListTab);

        this.on('cleanup', function () {
          self.placesList.clear();
          self.xmap.clear();
        });

        // marker
        this.on('clear-marker', this.clearMarker);
        // select place-item --> marker
        this.on('enter-marker', this.enterMarker);

        // mouseenter marker --> place-item
        this.on('enter-placeitem', this.enterPlaceItem);
        // click marker --> place-item
        this.on('click-placeitem', this.clickPlaceItem);

        // zoom map
        this.on('zoom-map', this.zoomMap);

        this.element.on('click.mappanel', '.place-submit', function () {
          // NOTE: 先用老事件触发保存
          Cross.place = self.place;
          $('body').trigger('save-cross');
        });

        this.element.on('keydown.mappanel', proxy(this.keydown, this));

        this.element.on('click.mappanel', '.map-mask', function (e) {
          e.preventDefault();
          self.emit('zoom-map', false);
        });

        this.element.on('click.mappanel', '.map-resize', function (e) {
          e.preventDefault();
          var rc = $(this).hasClass('map-rc');
          self.emit('zoom-map', rc);
        });
      }

    , save: function () {
        this.$('.place-submit')
          .trigger('click.mappanel');
      }

    , keydown: function (e) {
        var self = this
          , altKey = e.altKey
          , ctrlKey = e.ctrlKey
          , shiftKey = e.shiftKey
          , metaKey = e.metaKey
          , kc = e.keyCode;
        //if (93 === kc || 224 === kc) { kc = 91; }
        // escape
        if (27 === kc) {
          self.revert();
        }
        // ctrl/command + enter
        else if (13 === kc && (!(altKey | shiftKey) & (ctrlKey | metaKey))) {
          self.emit('update-place', self.place);
          self.save();
        }
        // big map
        else if (187 === kc && ctrlKey) {
          self.emit('zoom-map', 0);
        }
        // small map
        else if (189 === kc && ctrlKey) {
          self.emit('zoom-map', 1);
        }
      }

    , zoomMap: function (n) {
        this.xmap.zoom(n);
      }

    , clickPlaceItem: function (place) {
        //this.emit('change-place', place, false);
        this.emit('change-place', place, 'map');
        this.element.focus();
      }

    , enterPlaceItem: function (i) {
        this.placesList.selectItem(i);
      }

    , enterMarker: function (i, hasPlace) {
        this.xmap.showMarker(i, hasPlace);
      }

    , clearMarker: function (i) {
        this.xmap.saveMarker(i || 0);
      }

    , searchCompleted: function (places, place) {
        this.placesList.update(places, place);
      }

    , placeInputTab: function () {
        var placesList = this.placesList
          , $placesList = placesList.$element
          , s = placesList.status
        if (s) {
          // firefox hack
          setTimeout(function () {
            $placesList.focus();
          }, 0);
        }
      }

    , placesListTab: function () {
        var $placeText = this.placeInput.$element;
        // firefox hack
        setTimeout(function () {
          $placeText.focusend();
        }, 0);
      }

    , resetPlace: function (p) {
        p.title = p.description
          = p.lat = p.lng
          = p.external_id
          = p.provider
          = '';
        return p;
      }

    , change: function (place, type) {
        var p = this.place,
            oTitle = p.title,
            oDesc = p.description,
            oLat = p.lat,
            oLng = p.lng,
            clearAll = !place.title,
            placeInput = this.placeInput,
            placesList = this.placesList,
            update = false,
            xmap = this.xmap;
        p.updated_at = printDate(new Date());
        if (clearAll) {
          p = this.resetPlace(p);
          placesList.clear();
          xmap.clear();
        } else {
          p.title = place.title;
          p.description = place.description;
          p.external_id = place.external_id || '';
          p.provider = place.provider || '';
          // editing Map or click list
          if (type === 'map' || type === 'list') {
            p.lat = place.lat;
            p.lng = place.lng;
            placeInput.change(printPlace(place.title, place.description));
            update = true;
          } else if (type === 'input') {
            if (oTitle !== place.title && !place.description) {
              placesList.clear();
              xmap.textSearch(place.title);
            }
          }
        }
        if (oTitle !== place.title
            || oDesc !== place.description
            || oLat !== place.lat
            || oLng !== place.lng
            || update) {
          this.emit('update-place', p);
        }
      }

    , revert: function () {
        this.emit('update-place', this.originPlace);
      }

    , showPlace: function () {
        var self = this,
            placeInput = this.placeInput,
            place = this.place,
            title = place.title,
            description = place.description,
            // 只要 `title` 和 `description` 都没有就显示 `Enter place here.`
            hasLatLng = place.lat && place.lng,
            userGeo, placeGeo;

        // first focus Container
        this.focus();

        placeInput.change(printPlace(title, description));
        placeInput.$element.focusend();

        if (hasLatLng) {
          placeGeo = { coords: { latitude: place.lat, longitude: place.lng, title: place.title } };
        }

        var error = function (/*perror*/) {
          userGeo = { coords: LOCATION };
          hasLatLng || (placeGeo = userGeo);
          self && self.emit && self.emit('geos', userGeo, placeGeo, hasLatLng);
        };

        if (this.isGeoSupported) {
          geolocation
            .getCurrentPosition(
              function (position) {
                userGeo = position;
                hasLatLng || (placeGeo = userGeo);
                self.emit('geos', userGeo, placeGeo, hasLatLng);
              },
              error,
              {
                enableHighAccuracy: true
              }
            );
        }
        else {
          error();
        }
      }

    , showBefore: function () {
        this.element.attr('editarea', 'map-panel');
      }

    , showAfter: function () {
        var self = this,
            srcNode = self.srcNode;
        if (srcNode) {
          var offset = srcNode.offset(),
              element = self.element,
              width = element.outerWidth();
          element
            .css({
              left: this.oleft = offset.left - width - 15,
              top: this.otop = offset.top
            });
        }

        if (isMapLoaded) {
          self.showPlace();
        } else {
          loadMap(function () {
            isMapLoaded = true;
            if (self && self.showPlace) {
              self.showPlace();
            }
          });
        }
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
    this.$element = component.$(selector);
    this.listen();
  };

  PlaceInput.prototype = {

      getPlace: function () {
        var value = this.$element.val();
        return parsePlace(value);
      }

    , change: function (s) {
        this.$element.val(s);
      }

    , listen: function () {
        var $container = this.$container
          , selector = this.selector;
        $container
          .on('blur.mappanel', selector, proxy(this.blur, this))
          .on('keypress.mappanel', selector, proxy(this.keypress, this))
          .on('keyup.mappanel', selector, proxy(this.keyup, this))
          .on('keydown.mappanel', selector, proxy(this.keydown, this))
          .on('focus.mappanel', selector, proxy(this.focus, this));
      }

    , lookup: function () {
        var place = this.trim();
        //this.component.emit('change-place', place, true);
        this.component.emit('change-place', place, 'input');
      }

    , trim: function () {
        var place = this.getPlace();
        if (!place.title && place.description) {
          this.change(place.description);
          place = this.getPlace();
        }
        return place;
      }

    //, click: function (e)  {}

    , blur: function () {
        this.$element.addClass('normal');
      }

    , focus: function () {
        this.$element.removeClass('normal');
      }

    // , mouseenter: function (e) {}

    , keyup: function (e) {
        switch (e.keyCode) {
        case 40: // down
        case 38: // up
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
        case  9: // tab
        case 27: // escape
          break;
        case 13: // enter
          this.component.emit('cleanup');
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
        case 40: // down
          // if the cursor in the last, tab to PlacesList
          var v = this.$element.val()
            , l = v.length
            , ele = this.$element[0]
            , end = selectionEnd(ele);
          if (l === end) {
            e.preventDefault();
            component.emit('placeinput-tab');
          }
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
        this.suppressKeyPressRepeat = !!~R.indexOf([9, 40], e.keyCode);
        this.keyHandler(e);
      }

  };


  /**
   *
   */
  var PlacesList = function (component, selector) {
    this.template = ''
              + '<li class="place-item{{css-class}}" data-lat="{{lat}}" data-lng="{{lng}}" data-external-id="{{external_id}}">'
                + '<address><div class="title">{{title}}</div><div class="description">{{address}}</div></address>'
              + '</li>'
    this.component = component
    this.$container = this.component.element;
    this.selector = selector;
    this.$element = component.$(selector);

    this.$items = null;
    this.len = 0;
    this.curr = 0;

    this.viewportRows = 12;
    this.viewportIndex = 0;
    this.scrollIndexs = [0, 11]
    this.scrollNum = 1;
    this.itemPX = 40;

    this.listen();
  };

  PlacesList.prototype = {

      listen: function () {
        var $container = this.$container
          , selector = this.selector;
        $container
          .on('blur.mappanel', selector, proxy(this.blur, this))
          .on('keypress.mappanel', selector, proxy(this.keypress, this))
          .on('keyup.mappanel', selector, proxy(this.keyup, this))
          .on('keydown.mappanel', selector, proxy(this.keydown, this))
          .on('focus.mappanel', selector, proxy(this.focus, this))
          .on('click.mappanel', selector + ' > li', proxy(this.click, this))
          .on('mouseenter.mappanel', selector + ' > li', proxy(this.mouseenter, this));
      }

    , update: function (places, place) {
        this.status = !!places.length || place;
        this.$element.empty();
        this.curr = 0;
        var html = '', li = this.template, location;
        this.hasPlace = false;
        if (this.status) {

          if (place) {
            html += li.replace('{{css-class}}', ' place-marker')
              .replace('{{title}}', place.title)
              .replace('{{address}}', place.description)
              .replace('{{lat}}', place.lat)
              .replace('{{lng}}', place.lng)
              .replace('{{external_id}}', place.external_id);
            this.hasPlace = true;
          }

          R.each(places, function (v) {
            location = v.geometry.location;
            html += li.replace('{{css-class}}', '')
              .replace('{{title}}', v.name)
              .replace('{{address}}', v.formatted_address)
              .replace('{{lat}}', location.lat())
              .replace('{{lng}}', location.lng())
              .replace('{{external_id}}', v.id);
          });

          this.$element.html(html);
        }
        this.$items = this.$element.find(' > li');
        this.len = this.$items.length;
        this.$element.parent().toggleClass('hide', !this.status);
      }

    , blur: function () {
        this.removeCurrStyle('hover');
      }

    , mouseenter: function (e) {
        var $item = $(e.currentTarget),
            i = $item.index();
        this.selectItem(i, true);
        this.component.emit('enter-marker', i, this.hasPlace);
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

    , focus: function () {
        this.$items = this.$element.find(' > li');
        this.len = this.$items.length;
        this.addCurrStyle('hover');
        this.component.emit('enter-marker', this.curr, this.hasPlace);
      }

    , addCurrStyle: function (c) {
        this.$items
          .eq(this.curr)
          .addClass(c)
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
        var component = this.component,
            $li = this.$items.eq(this.curr),
            place = {
              title: $li.find('div.title').text(),
              description: $li.find('div.description').text(),
              lat: String($li.data('lat')),
              lng: String($li.data('lng')),
              external_id: $li.data('external-id'),
              provider: 'google'
            };
        this.hasPlace = true;
        component.emit('clear-marker', this.curr);
        component.emit('change-place', place, 'list');
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
          , hasPlace = self.hasPlace
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
            component.emit('enter-marker', self.curr, hasPlace);
          }
          break;
        case 38: // up
          e.stopPropagation();
          e.preventDefault();
          self.scroll(-1);
          self.prev();
          component.emit('enter-marker', self.curr, hasPlace);
          break;
        case 40: // down
          e.stopPropagation();
          e.preventDefault();
          self.scroll(1);
          self.next();
          component.emit('enter-marker', self.curr, hasPlace);
          break;
        }
      }

    , keypress: function (e) {
        if (this.suppressKeyPressRepeat) {
          // must be return `false`, Mozila Firefox
          return false;
        }
        this.keyHandler(e);
      }

    , keydown: function (e) {
        this.suppressKeyPressRepeat = !!~R.indexOf([9, 13, 32, 38, 40], e.keyCode);
        this.keyHandler(e);
      }

    , click: function (e) {
        e.stopPropagation();
        e.preventDefault();
        this.curr = $(e.currentTarget).index();
        this.setPlace();
      }
  };


  /**
   * X Map.
   */
  var XMap = function (component, selector) {
    this.component = component;
    this.selector = selector;
    this.$element = component.$(selector);
    this.$wrap = this.$element.parent();

    // google.maps
    this.GMaps = null;

    // map size: false/true <--> big/small
    this.sizeStatus = true;
    // lat,lng is emtpy
    this.zoom2 = 2;
    this.zoom12 = 12;
    this.zoom16 = 16;
    this.zoomN = 16;

    // padding
    this.a = 0.05;

    this.owidth = this.$element.width();
    this.oheight = this.$element.height();

    // callback id
    this.cbid = 0;

    // red markers
    this.redMarkers = [];
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

    , initMap: function (userPosition, placePosition, hasLatLng) {
        var self = this,
            component = this.component,
            place = component.place,
            coords = placePosition.coords,
            ucoords = userPosition.coords,
            hasPlace = hasLatLng,
            GMaps, GCP;

        if (!coords) { placePosition.coords = coords = {}; }
        coords.latitude || (coords.latitude = '0');
        coords.longitude || (coords.longitude = '0');

        this.isGo = true;
        // has location
        this.hasLocation = !!ucoords;
        // has place
        this.hasPlace = hasPlace;

        try {
          GMaps = this.GMaps = window.google.maps;
          GCP = GMaps.ControlPosition;

          // center latlng
          this._center = new GMaps.LatLng(coords.latitude, coords.longitude);

          // location: ''
          this._request = {
            radius: 50000,
            location: this._center
          };

          this.enableOptions = {
            zoomControl: true,
            zoomControlOptions: { position: GCP.RIGHT_TOP },
            scaleControl: true,
            scaleControlOptions: { position: GCP.BOTTOM_LEFT }
          };

          this.zoomN = this.hasPlace ? this.zoom16 : (this.hasLocation ? this.zoom12 : this.zoom2);

          // map
          this._map = new GMaps.Map(
            this.$element[0],
            this.defaultOptions = {
              zoom: this.zoomN,
              center: this._center,
              disableDefaultUI: true,
              MapTypeId: GMaps.MapTypeId.ROADMAP,
              panControl: false,
              zoomControl: false,
              scaleControl: false
            }
          );

          // overlay
          this._overlay = new GMaps.OverlayView();
          this._overlay.draw = function () {};
          this._overlay.setMap(this._map);

          this.createIcons();

          if (this.hasLocation) {
            this._userMarker = new GMaps.Marker({
              map: this._map,
              position: new GMaps.LatLng(ucoords.latitude, ucoords.longitude),
              icon: this.sbicon,
              title: ucoords.title || ''
            });
          }

          this._service = new GMaps.places.PlacesService(this._map);

          if (this.hasPlace) {
            this._map.panBy(-100, 0);
            var marker = this.createBlueMarker(GMaps.Marker,
              {
                map: this._map,
                position: this._center,
                icon: this.bicon,
                draggable: true,
                title: coords.title || ''
              },
              place);
            this.GMaps.event.addListener(marker, 'dragend', function (dl) {
              var latLng = dl.latLng;
              this._place.lat = '' + latLng.lat();
              this._place.lng = '' + latLng.lng();
              this._place.provider = '';
              //component.emit('change-place', this._place, false, true);
              component.emit('change-place', this._place, 'map');
            });
            this.GMaps.event.addListener(marker, 'click', function () {
              self.clearMarkers();
              component.emit('change-place', this._place, 'map');
            }, false);
            this.GMaps.event.addListener(marker, 'mouseover', function () {
              self.selectMarker(this);
              component.emit('enter-placeitem', 0);
            });
          }

          //google.maps.event.addListener(this._map, 'bounds_changed', function () { console.dir(this.getBounds()); });

          var geocoder = new GMaps.Geocoder(), cb,
              mousedown_func = function (dl) {
                //clearTimeout(self._timer);
                self._timer = setTimeout(function () {
                  var place = component.placeInput.getPlace()
                    , latLng = dl.latLng, marker;
                  component.placesList.clear();
                  self.clearBlueMarker();
                  self.clearMarkers();
                  place.lat = '' + latLng.lat();
                  place.lng = '' + latLng.lng();
                  marker = self.createBlueMarker(
                  GMaps.Marker ,
                  {
                    map: self._map,
                    position: latLng,
                    icon: self.bicon,
                    draggable: true,
                    title: place.title || ''
                  }, place);
                  GMaps.event.addListener(marker, 'dragend', function (dl) {
                    var latLng = dl.latLng;
                    this._place.lat = '' + latLng.lat();
                    this._place.lng = '' + latLng.lng();
                    this._place.provider = '';
                    //component.emit('change-place', this._place, false, true);
                    component.emit('change-place', this._place, 'map');
                  });
                  GMaps.event.trigger(marker, 'mouseover');
                  //if ((!place.title && !place.description) || (place.title === 'Right there on map')) {
                    cb = function (results, status) {
                      if (self._timer
                          && cb.id === self.cbid
                          && status === window.google.maps.GeocoderStatus.OK
                          && results.length) {
                        clearTimeout(self._timer);
                        self.hasPlace = true;
                        self.cbid = 0;
                        place.title = 'Right there on map';
                        place.description = results[0].formatted_address;
                        place.provider = ''; // exfe
                        place.external_id = '';
                        //component.emit('change-place', marker._place = place, false);
                        component.emit('change-place', marker._place = place, 'map');
                      }
                    };
                    cb.id = ++self.cbid;
                    geocoder.geocode({latLng: new GMaps.LatLng(place.lat, place.lng)}, cb);
                  //} else {
                    //component.emit('change-place', place, false);
                  //}
                }, 610);
              },
              mouseup_func = function () { clearTimeout(self._timer); };

          if (ucoords) {
            GMaps.event.addListener(this._userMarker, 'mousedown', mousedown_func);
            GMaps.event.addListener(this._userMarker, 'mouseup', mousedown_func);
          }
          GMaps.event.addListener(this._map, 'mousedown', mousedown_func);
          GMaps.event.addListener(this._map, 'mouseup', mouseup_func);
          GMaps.event.addListener(this._map, 'dragstart', mouseup_func);
        } catch (e) {
          this.isGo = false;
        }
      }

    , createBlueMarker: function (GMarker, options, place) {
        this._placeMarker = this.createMarker(GMarker, options, place);
        this._placeMarker.isBlue = true;
        return this._placeMarker;
      }

    , clearBlueMarker: function () {
        this.removeMarker(this._placeMarker);
        this._placeMarker = null;
      }

    , textSearch: function (query) {
        var self = this,
            GMaps = self.GMaps,
            isGo = self.isGo,
            component = self.component,
            service = self._service,
            request = self._request,
            cb, pm;

        if (isGo) {
          self.clearMarkers();
          if (query && query !== request.query) {
            request.query = query;
            cb = function (results, status) {
              if (cb.id === self.cbid
                && status === GMaps.places.PlacesServiceStatus.OK) {
                self.cbid = 0;
                pm = self._placeMarker;
                self.createMarkers(results);
                component.emit('search-completed', results, pm ? pm._place : null);
              }
            };
            // 避免多异步回调问题
            cb.id = ++self.cbid;
            service.textSearch(request, cb);
          }
        }
      }

    , panToRight: function () {
        var GMaps = this.GMaps,
            map = this._map,
            overlay = this._overlay,
            projection = overlay.getProjection(),
            GPoint = GMaps.Point,
            point =  projection.fromLatLngToContainerPixel(map.getCenter()),
            center = projection.fromContainerPixelToLatLng(new GPoint(point.x - 100, point.y));
        map.setCenter(center);
      }

    , showMarker: function (i, hasPlace) {
        var marker, position;

        if (hasPlace && -1 === --i) {
          marker = this._placeMarker;
        } else {
          marker = this.redMarkers[i];
        }

        if (marker) {
          this.selectMarker(marker);
          position = marker.getPosition();
          //this._map.setCenter(position);
          this._map.panTo(position);
        }

        if (this.sizeStatus) {
          this._map.setZoom(this.zoomN = this.zoom16);
          this.panToRight();
        }
      }

    , selectMarker: function (marker) {
        var ricon = this.ricon,
            bicon = this.bicon,
            currMarker = this.currMarker;

        if (currMarker) {
          currMarker.setZIndex(null);
          if (!currMarker.isBlue) {
            currMarker.setIcon(ricon);
          }
        }

        if (marker) {
        marker.setZIndex(377);
          if (!marker.isBlue) {
            marker.setIcon(bicon);
          }

          this.currMarker = marker;
        }
      }

    , createIcons: function () {
        var GMaps = this.GMaps
          , url = site_url + '/static/img/icons.png'
          , GSize = GMaps.Size
          , GPoint = GMaps.Point
          , MarkerImage = GMaps.MarkerImage;
        // blue-icon 26 * 36
        this.bicon = new MarkerImage(url, new GSize(26, 36), new GPoint(0, 78));
        // red-icon 26 * 36
        this.ricon = new MarkerImage(url, new GSize(26, 36), new GPoint(26, 78));
        // small-blue-icon 12 * 14
        this.sbicon = new MarkerImage(url, new GSize(12, 14), new GPoint(52, 100));
      }

    , saveMarker: function (i) {
        var self = this,
            hasPlace = self.hasPlace;

        if (!(hasPlace && 0 === i)) {
          if (hasPlace) {
            this.clearBlueMarker();
            i -= 1;
          }

          var component = this.component,
              GEvent = this.GMaps.event,
              marker = this._placeMarker = this.redMarkers.splice(i, 1)[0];

          this.hasPlace = true;
          this.selectMarker(marker);
          this.defaultOptions.zoom = this.zoomN = this.zoom16;

          GEvent.clearListeners(marker);

          marker.isBlue = true;
          marker.setDraggable(true);

          GEvent.addListener(marker, 'click', function () {
            self.clearMarkers();
            component.emit('change-place', this._place, 'map');
          }, false);

          GEvent.addListener(marker, 'dragend', function (dl) {
            var latLng = dl.latLng;
            this._place.lat = '' + latLng.lat();
            this._place.lng = '' + latLng.lng();
            this._place.provider = '';
            component.emit('change-place', this._place, 'map');
          });

          GEvent.addListener(marker, 'mouseover', function () {
            self.selectMarker(this);
            component.emit('enter-placeitem', 0);
          });
        }
        this.clearMarkers();
      }

    , clear: function () {
        if (this._placeMarker) {
          this.clearBlueMarker();
        }
        this.clearMarkers();
        this.hasPlace = false;
        this.defaultOptions.zoom = this.zoomN = this.hasLocation ? this.zoom12 : this.zoom2;
      }

    , removeMarker: function (marker) {
        if (marker) {
          marker.setMap(null);
          marker = null;
        }
      }

    , clearMarkers: function () {
        var markers = this.redMarkers, removeMarker = this.removeMarker, marker;
        if (!markers) { return; }
        while ((marker = markers.shift())) {
          removeMarker(marker);
        }
        this.curr = 0;
      }

    , createMarkers: function (places, able) {
        var self = this,
            enable = !able,
            component = this.component,
            createMarker = this.createMarker,
            GMaps = this.GMaps,
            GEvent = GMaps.event,
            GLatLng = GMaps.LatLng,
            GMarker = GMaps.Marker,
            bounds = new GMaps.LatLngBounds(),
            markers = this.redMarkers,
            map = this._map,
            ricon = this.ricon,
            place,
            marker,
            location,
            i = 0,
            marker_click = function () {
              var i = self.indexOf(self.redMarkers, this);
              component.placesList.clear();
              component.emit('clear-marker', i);
              component.emit('click-placeitem', this._place);
            },
            marker_mouseover = function () {
              var i = self.indexOf(self.redMarkers, this);
              self.selectMarker(this);
              component.emit('enter-placeitem', i += !!self._placeMarker ? 1 : 0);
            };

        for (; place = places[i]; ++i) {
          location = place.lat ? new GLatLng(place.lat, place.lng) : place.geometry.location;

          marker = createMarker(GMarker,
            {
              map: map,
              icon: ricon,
              title: place.name,
              position: location,
              zIndex: 0
            },
            {
              title       : place.title || place.name,
              description : place.description || place.formatted_address,
              lat         : '' + location.lat(),
              lng         : '' + location.lng(),
              external_id : place.id || '',
              provider    : 'google'
            });

          // click
          GEvent.addListener(marker, 'click', marker_click, false);

          // mouseover
          GEvent.addListener(marker, 'mouseover', marker_mouseover);

          // mouseout
          //GMaps.event.addListener(marker, 'mouseout', function () { });

          markers.push(marker);
          if (enable) { bounds.extend(location); }
        }
        if (enable) { map.fitBounds(bounds); }
      }

    , createMarker: function (GMarker, options, place, marker) {
        marker = new GMarker(options);
        marker._place = place;
        return marker;
      }

    , zoom: function (n) {
        if (!this.isGo) { return; }
        this.sizeStatus = n;
        var self = this,
            component = self.component,
            element = component.element,
            GMaps = self.GMaps,
            map = self._map,
            markers = self.redMarkers;

        this.$wrap.toggleClass('gmap-big', !n);
        component.$resize.toggleClass('map-rc');
        component.$mask.toggleClass('hide', !n);

        if (n) {
          element.css({
            top: component.otop,
            left: component.oleft
          });
          self.$element
            .width(self.owidth)
            .height(self.oheight);

          setTimeout(function () {
            map.setOptions(self.defaultOptions);
            map.setCenter(self._placeMarker ? self._placeMarker.getPosition() : self._userMarker.getPosition());
            if (self.hasPlace) {
              self.panToRight();
            }
          }, 0);
        }
        else {
          var width = $win.width(),
              height = $win.height(),
              a = self.a,
              sT = $win.scrollTop(),
              sL = $win.scrollLeft();
          self.resize(width * (1 - a * 2), height * (1 - a ) - 56);
          element.css({
            top: 56 + sT,
            left: width * a + sL
          });
          setTimeout(function () {
            map.setOptions(self.enableOptions);
          }, 0);
        }
        GMaps.event.trigger(map, 'resize');
        // 返回到中心点
        (!self._placeMarker && markers.length) && (self._placeMarker = markers[0]);
        map.setCenter(!!self._placeMarker ? self._placeMarker.getPosition() : (self._userMarker ? self._userMarker.getPosition() : null));

        component.placeInput.$element.focusend();
      }

      // marker index
    , indexOf: function (markers, marker) {
        return R.indexOf(markers, marker);
      }

  };


  // Helpers:
  var parsePlace = function (placeString) {
    var ps = placeString.split(SPLITTER),
        title = ps.length ? $.trim(ps.shift()) : '',
        description = $.trim(ps.join(CR)).replace(SPLITTER, '');

    return {
      title: title,
      description: description//,
      //provider: '',
      //external_id: ''
    };
  };

  var printPlace = function (title, description) {
    return title + (description ? CR + description.replace(SPLITTER, CR) : '');
  };

  var printDate = function (d) {
    return d.getUTCFullYear()
      + '-' + lead0(d.getUTCMonth() + 1)
      + '-' + lead0(d.getUTCDate())
      + ' ' + lead0(d.getUTCHours())
      + ':' + lead0(d.getUTCMinutes())
      + ':' + lead0(d.getUTCSeconds())
      + ' +0000';
  };

  // get Textarea selectionEnd
  var selectionEnd = function (inputor) {
    return isIE ? getIESelectionEnd(inputor) : inputor.selectionEnd;
  };

  var getIESelectionEnd = function (inputor) {
    var r = document.selection.createRange(),
        re = inputor.createTextRange(),
        rc = re.duplicate();
    re.moveToBookmark(r.getBookmark());
    rc.setEndPoint('EndToStart', re);
    return rc.text.length + r.text.length;
  };

  var loadMap = function (cb) {
    if (window.google && window.google.maps) { return; }
    window._loadMaps = function () {};
    $('[src^="https://www.google.com"]').remove();
    var b = document.getElementsByTagName('body')[0], g = document.createElement('script');
    window._gmap = function () { delete window._gmap; };
    window._loadMaps = function () {
      window.google.load('maps', '3', { other_params: 'key=' + MAP_KEY + '&sensor=false&libraries=places', callback: function () {cb()} });
    }
    g.async = 'async';
    g.src = 'https://www.google.com/jsapi?callback=_loadMaps';
    b.appendChild(g);
  };

  return MapPanel;
});
