define('mnemosyne', function (require) {
  "use strict";

  var Emitter = require('emitter'),
      Handlebars = require('handlebars'),
      $ = require('jquery'),
      $proxy = $.proxy,
      $WIN = $(window),
      $DOC = $(document),
      getComputedStyle = function (elem, property) { window.getComputedStyle(elem, null).getPropertyValue(property); },
      isTouch = 'ontouchstart' in document.documentElement,
      transitionEnds = 'webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd transitionend';

  var max = Math.max,
      min = Math.min,
      mfloor = Math.floor,
      mrandom = Math.random;

  //---------------------------------------------------------------
  // grouping number
  var G_N = 0;
  var RECT_TEMPLATE = ''
          + '<figure class="figure surface pe no-select" data-id="{{id}}" data-thumbnail="{{image.thumbnail.url}}" data-thumbnail-width="{{image.thumbnail.width}}" data-thumbnail-height="{{image.thumbnail.height}}" data-fullsize="{{image.fullsize.url}}" data-fullsize-height="{{image.fullsize.height}}" data-fullsize-width="{{image.fullsize.width}}">'
              //+ '<img class="pic" src="{{image.thumbnail.url}}" />'
            + '<div class="photo">'
              + '<div class="photo-mask"></div>'
            + '</div>'
            /*
            + '<div class="photo-like hide"></div>'
            + '<div class="photo-meta">'
              + '<div class="avatar"></div>'
              + '<div class="title">Why moving elements with translate() is better than pos:abs top/left</div>'
              + '<time class="date">2012.12.12 13:09</time>'
              + '<div class="place"></div>'
            + '</div>'
            */
          + '</figure>';

  var OPTIONS = {
    top: 0,
    left: 0,
    width: 1,
    height: 1
  };

  var LAYOUTS = [
    // 1 cell
    [
      {
        "type": "G",
        "name": "1",
        "aspect_ratio": 0,
        "cells":[
          { "type": "Rect", "x": 0, "y": 0, "width": 1, "height": 1, "margin": { "top": 6, "right": 6, "bottom": 6, "left": 6 } }
        ]
      }
    ],

    // 2 cells
    [
      {
        "type": "G",
        "name": "2A1",
        "aspect_ratio": 1 / 2,
        "cells": [
          { "type": "Rect", "x": 0, "y": 0, "width": 1, "height": .5, "margin": { "top": 6, "right": 6, "bottom": 6, "left": 6 } },
          { "type": "Rect", "x": 0, "y": .5, "width": 1, "height": .5, "margin": { "top": 6, "right": 6, "bottom": 6, "left": 6 } }
        ]
      },

      {
        "type": "G",
        "name": "2A2",
        "aspect_ratio": 3 / 4,
        "cells": [
          { "type": "Rect", "x": 0, "y": 0, "width": 1, "height": .5, "margin": { "top": 6, "right": 6, "bottom": 6, "left": 6 } },
          { "type": "Rect", "x": 0, "y": .5, "width": 1, "height": .5, "margin": { "top": 6, "right": 6, "bottom": 6, "left": 6 } }
        ]
      },

      {
        "type": "G",
        "name": "2B1",
        "aspect_ratio": 4 / 3,
        "cells": [
          { "type": "Rect", "x": 0, "y": 0, "width": .5, "height": 1, "margin": { "top": 6, "right": 6, "bottom": 6, "left": 6 } },
          { "type": "Rect", "x": .5, "y": 0, "width": .5, "height": 1, "margin": { "top": 6, "right": 6, "bottom": 6, "left": 6 } }
        ]
      }
    ],

    // 3 cells
    [
      {
        "type": "G",
        "name": "3A1",
        "aspect_ratio": 2 / 3,
        "cells": [
          { "type": "Rect", "x": 0, "y": 0, "width": 1, "height": .666666, "margin": { "top": 6, "right": 6, "bottom": 6, "left": 6 } },
          { "type": "Rect", "x": 0, "y": .666666, "width": .5, "height": .333333, "margin": { "top": 6, "right": 6, "bottom": 6, "left": 6 }} ,
          { "type": "Rect", "x": .5, "y": .666666, "width": .5, "height": .333333, "margin": { "top": 6, "right": 6, "bottom": 6, "left": 6 } }
        ]
      },

      {
        "type": "G",
        "name": "3B1",
        "aspect_ratio": 1 / 1,
        "cells": [
          { "type": "Rect", "x": 0, "y": 0, "width": .382, "height": .382, "margin": { "top": 6, "right": 6, "bottom": 6, "left": 6 } },
          { "type": "Rect", "x": .382, "y": 0, "width": .618, "height": .382, "margin": { "top": 6, "right": 6, "bottom": 6, "left": 6 } },
          { "type": "Rect", "x": 0, "y": .382, "width": 1, "height": .618, "margin": { "top": 6, "right": 6, "bottom": 6, "left": 6 } }
        ]
      }
    ]
  ];

  var _extend = function (t, s, k) {
    for (k in s) {
      if (!t.hasOwnProperty(k)) {
        t[k] = s[k];
      }
    }
    return t;
  };

  /**
   * @param n {Number}
   * @return 1 <= i <= n
   */
  var _random = function (n) {
    return parseInt(n * mrandom()) + 1;
  };

  /*
   * @return {Array} [width, height]
   */
  var _baseScale = function (h0, d) {
    return [h0 * d, h0];
  };

  var _autoScale = function (w0, h0, w1, h1) {
    var r = w1 / h1, rw = w1 / w0, rh = h1 / h0, w1 = w0, h1 = h0;
    if (rw < rh) {
      h1 = w1 / r;
    } else if (rw > rh) {
      w1 = h1 * r;
    }
    return [w1, h1];
  };

  var _largeScale = function (w0, h0, w1, h1) {
    var r = w1 / h1, rw = w1 / w0, rh = h1 / h0, w1 = min(w0, w1), h1 = min(h0, h1);
    if (rw < rh) {
      w1 = h1 * r;
    } else {
      h1 = w1 / r;
    }
    return [w1, h1];
  };

  var MNEMOSYNE = {};

  /**
   * Rect Class
   */
  var Rect = MNEMOSYNE.Rect = function (data) {
    var tmpl = Handlebars.compile(RECT_TEMPLATE);
    this.outerHTML = tmpl(data);
  };

  /**
   * Cell Factory
   */
  var cellFactory = function (t, data) {
    return new MNEMOSYNE[t](data);
  };

  /**
   *    {
   *      "id": int,
   *      "type": "G",
   *      "name": "xyz",
   *      "aspect_ratio": 3 / 4, // `width / height` = 9 / 16 or = .75
   *      "cells": [
   *        { "type": "Rect" ... },
   *        { "type": "Circle" ... }
   *        ...
   *       ]
   *       ...
   *    }
   */
  var layoutCreator = function (g) {
    return _extend({ "id": G_N++ }, g);
  };

  /**
   * Grouping Class
   */
  var G = MNEMOSYNE.G = function (photos, layout) {
    this.init(photos, layout);
  };

  G.prototype.init = function (photos, layout) {
    var i = 0,
        p, b, cell,
        tmpl;
    !this.html && (this.html = '');
    for (; p = photos[i]; i++) {
      b = layout[i];
      cell = cellFactory(b.type, p);
      this.html += cell.outerHTML;
    }
  };

  G.prototype.getContext = function () {
    return this.html;
  };

  /**
   * Typesetting
   * The Layout Engine.
   */
  var Typesetting = function () {};

  Typesetting.prototype.typeset = function (len) {
    var layouts = LAYOUTS.slice(0),
        l = layouts.length,
        r, lts, lt, gs, g;

    lts = this.layouts = [];

    while (len) {
      r = _random(len < l ? len : l);
      len -= r;

      gs = layouts[r - 1];
      g = gs[_random(gs.length) - 1]

      lts.push(layoutCreator(g));
    }

    return lts;
  };

  /**
   * View Class
   */
  var View = function ($elem, settings) {
    Emitter.call(this);

    this.$root = $elem;
    this.$mnemosyne = $elem.find('.mnemosyne');
    this.$galleryWrapper = this.$mnemosyne.find('.gallery-wrapper');
    this.$gallery = this.$mnemosyne.find('.gallery');

    this.settings = settings;

    // Viewport: width height
    this.getViewport();
    this.getGallery();

    // Typesetting
    this.typesetting = new Typesetting();

    // photos number
    this.n = 0;

    // prev added photos
    this.i = 0;

    // groupings number
    this.gid = 0;

    this.offsetTop = 0;
    this.offsetLeft = 0;

    this.paddingLeft = 24;
    this.paddingRight = 24;

    this.slideshow = new SlideShow(this, this.$root, '.gallery .figure');

    this.resizestatus = false;

    this.listen();
  };

  _extend(View.prototype, Emitter.prototype);

  View.prototype.getViewport = function () {
    var $r = this.$root;
    this.vw = $r.width();
    this.vh = $r.height();
  };

  View.prototype.getGallery = function () {
    var $g = this.$gallery;
    this.gvw = $g.width();
    this.gvh = $g.height();
  };

  View.prototype.reset = function () {};

  View.prototype.typeset = function (l) {
    return this.typesetting.typeset(l);
  };

  View.prototype.reTypeset = function () {
    this.gid = this.i = G_N = 0;
    this.layouts = this.typesetting.typeset(this.n);
  };

  View.prototype.addPhotos = function (photos) {
    var $g = this.$gallery,
        layouts = this.layouts,
        l = photos.length,
        newLayouts = this.typeset(l),
        i = 0, j = 0, layout, cells, g;

    this.gid = (layouts && layouts.length) || 0;

    while ((layout = newLayouts[i++])) {
      cells = layout.cells;
      g = new G(photos.slice(j, j += cells.length), cells);
      $g.append(g.getContext());
    }

    !layouts && (this.layouts = []);
    this.layouts = this.layouts.concat(newLayouts);
    this.i = this.n;
    this.n += l;
  };

  View.prototype.render = function (photos) {
    this.addPhotos(photos);
  };

  View.prototype.addPaddingRight = function (top, left) {
    var $g = this.$gallery, $pr = $g.find('.photos-padding-right');
    if (!$pr.size()) {
      $pr = $('<div class="photos-padding-right"></div>')
        .css({width: this.paddingRight});
    }
    $pr.css({
      '-webkit-transform': 'translate3d(' + left + 'px, ' + top  + 'px, 0)',
      '-moz-transform': 'translate3d(' + left + 'px, ' + top  + 'px, 0)',
      '-ms-transform': 'translate3d(' + left + 'px, ' + top  + 'px, 0)',
      '-o-transform': 'translate3d(' + left + 'px, ' + top  + 'px, 0)',
      'transform': 'translate3d(' + left + 'px, ' + top  + 'px, 0)'
    });
    $g.append($pr);
  };

  View.prototype.update = function () {
    //console.profile();
    var $gallery = this.$gallery,
        $fs = $gallery.find('.figure').slice(this.i, this.n),
        _gvw = this.gvw,
        _gvh = this.gvh,
        _gid = this.gid,
        offsetTop = this.offsetTop,
        offsetLeft = this.offsetLeft,
        layouts = this.layouts.slice(_gid),
        index = 0,
        layout, gid, aspect_ratio, cells, cl, cell, gvw, gvh, j,
        $f, sw, sh, st, sl, iw, ih, wh, margin, mt, mr, mb, ml;

    while ((layout = layouts.shift())) {
      gid = layout.id;
      aspect_ratio = layout.aspect_ratio;
      cells = layout.cells;
      cl = cells.length;

      if (aspect_ratio) {
        wh = _baseScale(_gvh, aspect_ratio);
        gvw = wh[0];
        gvh = wh[1];
      }

      for (j = 0; j < cl; j++) {
        cell = cells[j];
        $f = $fs.eq(index);
        iw = +$f.data('thumbnail-width');
        ih = +$f.data('thumbnail-height');

        if (1 === cl) {
          aspect_ratio = iw / ih;
          wh = _baseScale(_gvh, aspect_ratio);
          gvw = wh[0];
          gvh = wh[1];
        }

        margin = cell.margin;
        mt = margin.top;
        mr = margin.right;
        mb = margin.bottom;
        ml = margin.left;

        sh = cell.height * gvh - mt - mb;
        sw = cell.width * gvw - ml - mr;
        st = offsetTop + cell.y * gvh + mt;
        st += (_gvh - gvh) / 2;
        sl = offsetLeft + cell.x * gvw + ml;

        // figure div
        this.updateFigure($f, gid, sw, sh, sl, st);

        wh = _autoScale(sw, sh, iw, ih);
        iw = wh[0];
        ih = wh[1];

        // img
        this.updateImg($f, iw, ih, (sw - iw) / 2, (sh - ih) / 2);

        index++;
      } 

      offsetLeft += gvw;
    }
    //console.profileEnd();

    this.addPaddingRight(0, offsetLeft);
  };

  View.prototype.updateFigure = function ($f, gid, w, h, l, t) {
    $f
      .attr({
        'data-gid': gid
      })
      .css({
        width: w,
        height: h,
        '-webkit-transform': 'translate3d(' + l + 'px,' + t + 'px, 0px)',
        '-moz-transform': 'translate3d(' + l + 'px,' + t + 'px, 0px)',
        '-ms-transform': 'translate3d(' + l + 'px,' + t + 'px, 0px)',
        '-o-transform': 'translate3d(' + l + 'px,' + t + 'px, 0px)',
        'transform': 'translate3d(' + l + 'px,' + t + 'px, 0px)'
      });
  };

  View.prototype.updateImg = function ($f, w, h, l, t) {
    var $img = $f.find('img');
    if (0 === $img.length) {
      $f.attr('data-whlt', w + ',' + h + ',' + l + ',' + t);
    } else {
      $img
        .css({
          width: w,
          height: h,
          left: l,
          top:  t
        });
    }
  };

  View.prototype.listen = function () {
    var _this = this, _$root = this.$root, _slideshow = this.slideshow,
        //pw_selector = '.gallery .photos-list .photo-wrap';
        figure_selector = '.gallery .figure';

    _$root.on('keydown.mnemosyne', '.slideshow', function (e) {
      var k = e.keyCode;
      if ('38 39 40 37 27'.search(k) !== -1) {
        e.preventDefault();
        switch (k) {
          case 38:
          case 37:
            _slideshow.prev();
            break;
          case 40:
          case 39:
            _slideshow.next();
            break;
          case 27:
            _slideshow.exit();
        }
      }
    });

    // Gallery Photo clicked
    _$root.on('click.mnemosyne', figure_selector, function (e) {
      e.preventDefault();
      // if (isTouch) return;
      var $f = $(this);

      if (isTouch) {
        $f.data('offset', $f.offset());
      }

      if (!_this.resizestatus) {
        _this.resizestatus = true;
        $WIN.trigger('debouncedresize.mnemosyne');
      }
      $f.trigger('mouseleave.mnemosyne');
      //_this.$gallery.addClass('gsw');
      _this.emit('mm-hide');
      _this.emit('slideshow', $f);
    })
      .on('hover.mnemosyne', figure_selector, function (e) {
        e.preventDefault();
        var $f = $(this),
            isMouseEnter = e.type === 'mouseenter';
        $f.data('event', e.type);
        if (isMouseEnter) {
          $f.data('offset', $f.offset());
        }
        $f.toggleClass('figure-hover', isMouseEnter);
      });

    _$root.on('click.mnemosyne', '.slideshow .photos', function (e) {
      e.preventDefault();
      if ($(this).hasClass('photos')) {
        _slideshow.exit();
      }
      return false;
    });
    if (isTouch) {
      var touchStartFlag = false, startX = 0, touch,
          swipeThreshold = 50, swipeTimeThreshold = 377,
          touchStartTime, touchEndTime,
          tap_max_touchtime = 250, tap_max_distance = 10, tapE = null;

      _$root.on('touchstart.mnemosyne', figure_selector, function (e) {
        if (touchStartFlag) return true;
        touchStartFlag = true;
        touchStartTime = +new Date();
        touch = e.originalEvent;
        startX = touch.changedTouches[0].pageX;
        tapE = this;
      })
        .on('touchend.mnemosyne', figure_selector, function (e) {
          touchStartFlag = false;
          touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];

          touchEndTime = +new Date();

          if (tapE === this) {
            if (touchEndTime - touchStartTime <= tap_max_touchtime) {
              if (Math.abs(touch.pageX - startX) <= tap_max_distance) {
                e.preventDefault();
                $(this).trigger('click.mnemosyne');
                touchStartFlag = false;
                touch = null;
                startX = 0;
                return false;
              }
            }
          }
          touchStartFlag = false;
          touch = null;
          startX = 0;
        });
      _$root.on('touchstart.mnemosyne', '.slideshow .photo', function (e) {
        e.preventDefault();
        if (touchStartFlag) return true;
        touchStartFlag = true;
        touchStartTime = +new Date();
        touch = e.originalEvent;
        startX = touch.changedTouches[0].pageX;
        return false;
      })
        .on('touchmove.mnemosyne', '.slideshow .photo', function (e) {
          e.preventDefault();
          /*
          touchStartFlag = false;
          touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];

          touchEndTime = +new Date();

          if (touchEndTime - touchStartTime <= swipeTimeThreshold) {
            if (touch.pageX - startX > swipeThreshold) {
              _slideshow.prev();
            } else if (touch.pageX - startX < -swipeThreshold) {
              _slideshow.next();
            }
          }
          console.log('move', touch.pageX - startX);
          */
          return false;
        })
        .on('touchend.mnemosyne', '.slideshow .photo', function (e) {
          e.preventDefault();
          touchStartFlag = false;
          touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];

          touchEndTime = +new Date();

          if (touchEndTime - touchStartTime <= swipeTimeThreshold) {
            if (touch.pageX - startX >= swipeThreshold) {
              _slideshow.prev();
            } else if (touch.pageX - startX < -swipeThreshold) {
              _slideshow.next();
            }
          }
          touchStartFlag = false;
          touch = null;
          startX = 0;
          return false;
        })
    }

    _this.on('resize', function (w, h) {
      _slideshow.resize(w, h);
      if (_slideshow.$slideshow.hasClass('animate')) {
        $(window).scrollLeft(0);
      }
    });

    _this.on('slideshow', function ($f) {
      this.slideshow.show($f);
    });

    _this.on('scroll', function (w, l, t) {
      _this.scroll(w, l, t);
    });

    _this.on('mm-hide', function (w, l, t) {
      _this.$gallery.addClass('mm-hide');
    });

    $WIN.on('debouncedresize.mnemosyne', function () {
    // $(window).on('throttledresize.mnemosyne', function () {
      _this.getViewport();
      _this.getGallery();
      _this.emit('resize', _this.vw, _this.vh);
      //_this.$galleryWrapper.trigger('scroll.mnemosyne');
      $(window).trigger('scroll.mnemosyne');
      _this.update();
    });
  };

  View.prototype.scroll = function ($item, isNotFirst) {
    var a = isNotFirst ? 1800 / (1800 + 377) : 1,
        p = $item.position();
    this.$galleryWrapper.stop(true, true).animate({
      scrollLeft: (p.left + 24 - (this.vw - $item.find('.photo').width()) / 2 * a) / a
    }, 400);
  };

  var inViewport = function (top, right, bottom, left, vh, vw) {
    return (
        (top >= 0 && top <= vh)
        ||
        (bottom >= 0 && bottom <= vh)
      )
      && (
        (left >= 0 && left <= vw)
        ||
        (right >= 0 && right <= vw)
      );
  };

  var i = 0;
  var checkInViewport = function (e) {
    var r = e.getBoundingClientRect(),
        top = r.top, right = r.right, bottom = r.bottom, left = r.left,
        vh = window.innerHeight || document.documentElement.clientHeight,
        vw = window.innerWidth || document.documentElement.clientWidth;

    return inViewport(top, right, bottom, left, vh, vw);
  };

  View.prototype.doscroll = function () {
    this.$galleryWrapper.trigger('scroll.mnemosyne');
  };

  View.prototype.startShow = function () {
    this.$mnemosyne.addClass('animate').focus();
  };

  View.prototype.lazyLoad = function () {
    var _this = this, caches;
    (!this.caches) && (this.caches = []);
    caches = this.caches;
    this.$galleryWrapper.on('scroll.mnemosyne', function () {
      var $fs = _this.$gallery.find('.figure').not('.photo-lazy, .photo-loaded');
      if (0 === $fs.length) return;
      $fs.each(function () {
        var $f, lig, url, ds, $img;
        if (checkInViewport(this)) {
          $f = $(this);
          $f.addClass('photo-lazy');
          url = $f.data('thumbnail'); 
          lig = new LoadImage(url, function (img) {
            $f
              .removeClass('photo-lazy')
              .addClass('photo-loaded');

            ds = $f.data('whlt').split(',');
            $img = $(img).addClass('pic animate').css({
              width: +ds[0],
              height: +ds[1],
              left: +ds[2],
              top:  +ds[3]
            });
            $f.find('.photo').append($img);
            $fs.not($f);
          }, function () {
            $f.removeClass('photo-lazy');
          });
        }
      });
    });
  };

  View.prototype.destory = function () {};

  /**
   * Load Image
   */
  var LoadImage = function (url, loadcb, errorcb) {
    this.url = url;
    this.img = document.createElement('img');
    this.listen(loadcb, errorcb);
  };

  LoadImage.prototype.listen = function (lcb, ecb) {
    var _this = this,
        url = this.url,
        img = this.img;
    img.onload = function () {
      lcb(img);
      _this.abort();
    };
    img.onerror = function () {};
    img.src = url;
  }

  LoadImage.prototype.abort = function () {
    var img = this.img;
    img.onload = img.onerror = img = undefined;
  };

  var SlideShow = function (root, $elem, selector) {
    this._c = root;
    this.$root = $elem;
    this.selector = selector;
    this.$slideshow = this.$root.find('.slideshow');
    this.$list = this.$slideshow.find('.photos');

    this.max_limited = 3;
    this.n = 0;

    this.status = false;

    this.delay = 2333;
    this._timer = undefined;

    this.listen();
  };

  SlideShow.prototype.listen = function () {};

  var clone0 = function (self, $f, $root) {
    var vw = self.vw,
        vh = self.vh,
        $m = $('<img class="photo preserve3d no-select"/>').prop('src', $f.attr('data-thumbnail')),
        ow = $f.data('fullsize-width'),
        oh = $f.data('fullsize-height'),
        fs = $f.data('fullsize'),
        wh = _largeScale(vw, vh, ow, oh),
        iw = wh[0], ih = wh[1],
        sw = iw / ow, sh = ih / oh,
        l = (vw -iw) / 2, t = (vh - ih) / 2,
        imgload = new LoadImage(fs, function (img) {
          $m.prop('src', fs);
          fs = $m = undefined;
        });

    $m
      .data('img-load', imgload)
      .attr('data-ltwh', l + ',' + t + ',' + sw + ',' + sh)
      .css({
       'width': ow,
        'height': oh,
        '-webkit-transform': 'translate3d(' + l + 'px, ' + t + 'px, 0px) scale(' + sw + ', ' + sh + ')',
        '-moz-transform': 'translate3d(' + l + 'px, ' + t + 'px, 0px) scale(' + sw + ', ' + sh + ')',
        '-ms-transform': 'translate3d(' + l + 'px, ' + t + 'px, 0px) scale(' + sw + ', ' + sh + ')',
        '-o-transform': 'translate3d(' + l + 'px, ' + t + 'px, 0px) scale(' + sw + ', ' + sh + ')',
        'transform': 'translate3d(' + l + 'px, ' + t + 'px, 0px) scale(' + sw + ', ' + sh + ')'
      });
    $root.append($m);
    return $m;
  };

  var clone1 = function ($f, $root) {
    var whlt = $f.attr('data-whlt').split(','),
        w = +whlt[0], h = +whlt[1], l = +whlt[2], t = +whlt[3],
        offset = $f.data('offset'),
        ow = $f.data('fullsize-width'),
        oh = $f.data('fullsize-height'),
        fs = $f.data('fullsize'),
        $m = $('<img class="photo preserve3d no-select"/>').prop('src', $f.attr('data-thumbnail')),
        sw = w / ow, sh = h / oh,
        imgload = new LoadImage(fs, function (img) {
          $m.prop('src', fs);
          fs = $m = undefined;
        });

    $m
      .data('img-load', imgload)
      .css({
        'width': ow,
        'height': oh,
        'opacity': 0,
        '-webkit-transform': 'translate3d(' + (offset.left + l) + 'px, ' + (offset.top + t) + 'px, 0) scale(' + sw + ', ' + sh + ')',
        '-moz-transform': 'translate3d(' + (offset.left + l) + 'px, ' + (offset.top + t) + 'px, 0) scale(' + sw + ', ' + sh + ')',
        '-ms-transform': 'translate3d(' + (offset.left + l) + 'px, ' + (offset.top + t) + 'px, 0) scale(' + sw + ', ' + sh + ')',
        '-o-transform': 'translate3d(' + (offset.left + l) + 'px, ' + (offset.top + t) + 'px, 0) scale(' + sw + ', ' + sh + ')',
        'transform': 'translate3d(' + (offset.left + l) + 'px, ' + (offset.top + t) + 'px, 0) scale(' + sw + ', ' + sh + ')',
    });
    $root.append($m);
    return $m;
  };

  var update1 = function (self, $c, $f) {
    var vw = self.vw,
        vh = self.vh,
        whlt = $f.attr('data-whlt').split(','),
        ow = $f.data('fullsize-width'),
        oh = $f.data('fullsize-height'),
        wh = _largeScale(vw, vh, ow, oh),
        iw = wh[0], ih = wh[1],
        sw = iw / ow, sh = ih / oh,
        l = (vw - iw) / 2, t = (vh - ih) / 2;
    getComputedStyle($c[0], 'height');
    $c
      .attr('data-ltwh', l + ',' + t + ',' + sw + ',' + sh)
      .css({
        'opacity': 1,
        '-webkit-transform': 'translate3d(' + l + 'px, ' + t + 'px, 0px) scale(' + sw + ', ' + sh + ')',
        '-moz-transform': 'translate3d(' + l + 'px, ' + t + 'px, 0px) scale(' + sw + ', ' + sh + ')',
        '-ms-transform': 'translate3d(' + l + 'px, ' + t + 'px, 0px) scale(' + sw + ', ' + sh + ')',
        '-o-transform': 'translate3d(' + l + 'px, ' + t + 'px, 0px) scale(' + sw + ', ' + sh + ')',
        'transform': 'translate3d(' + l + 'px, ' + t + 'px, 0px) scale(' + sw + ', ' + sh + ')'
      });
  };
  
  SlideShow.prototype.clone = function ($f) {
    var isNotFirst = this.$curr && this.$curr.length, $c;

    if (isNotFirst) {
      $c = clone0(this, $f, this.$list);
    } else {
      $c = clone1($f, this.$list);
      update1(this, $c, $f);
    }
    //this._c.emit('scroll', $f, isNotFirst);
    this._c.emit('mm-hide');
    this.$c = $c;
    this.$curr = $f;
  };

  SlideShow.prototype.show = function ($f) {
    this.$slideshow.css('opacity', 1).addClass('animate').focus();
    this.clone($f);
  };

  SlideShow.prototype.getStatus = function () {
    return this.$slideshow.hasClass('animate');
  };

  SlideShow.prototype.effect = function (a) {
    var $ps = this.$list.children(),
        l = $ps.length,
        $prev = $ps.eq(l - 2),
        $curr = $ps.eq(l - 1),
        pwhlt = $prev.attr('data-ltwh').split(','),
        cwhlt = $curr.attr('data-ltwh').split(','),
        psl = pwhlt[0], csl, pel, pst =pwhlt[1], cel = cwhlt[0], cst = cwhlt[1], csw = cwhlt[2], csh = cwhlt[3], psw = pwhlt[2], psh = pwhlt[3];

    if (a === 0) {
      csl = +cel - 50;
      pel = +psl + 50;
    } else {
      csl = +cel + 50;
      pel = +psl - 50;
    }
    $prev.addClass('no-trans');
    $curr.addClass('no-trans');
    $curr.css({
        'opacity': 0,
        '-webkit-transform': 'translate3d(' + csl + 'px, ' + cst + 'px, 0px) scale(' + csw + ', ' + csh + ')',
        '-moz-transform': 'translate3d(' + csl + 'px, ' + cst + 'px, 0px) scale(' + csw + ', ' + csh + ')',
        '-ms-transform': 'translate3d(' + csl + 'px, ' + cst + 'px, 0px) scale(' + csw + ', ' + csh + ')',
        '-o-transform': 'translate3d(' + csl + 'px, ' + cst + 'px, 0px) scale(' + csw + ', ' + csh + ')',
        'transform': 'translate3d(' + csl + 'px, ' + cst + 'px, 0px) scale(' + csw + ', ' + csh + ')'
    });
    $prev.removeClass('no-trans');
    $curr.removeClass('no-trans');
    getComputedStyle($curr[0], 'height');
    $prev.on(transitionEnds, function () {
      var $s = $ps.slice(0, l - 2).hide();
      $s.each(function () {
        var imgload = $(this).data('img-load');
        imgload && imgload.abort();
        $(this).remove();
      });
    });
    $curr.css({
        'opacity': 1,
        '-webkit-transform': 'translate3d(' + cel + 'px, ' + cst + 'px, 0px) scale(' + csw + ', ' + csh + ')',
        '-moz-transform': 'translate3d(' + cel + 'px, ' + cst + 'px, 0px) scale(' + csw + ', ' + csh + ')',
        '-ms-transform': 'translate3d(' + cel + 'px, ' + cst + 'px, 0px) scale(' + csw + ', ' + csh + ')',
        '-o-transform': 'translate3d(' + cel + 'px, ' + cst + 'px, 0px) scale(' + csw + ', ' + csh + ')',
        'transform': 'translate3d(' + cel + 'px, ' + cst + 'px, 0px) scale(' + csw + ', ' + csh + ')'
    });
    getComputedStyle($prev[0], 'height');
    $prev.css({
        'opacity': 0,
        '-webkit-transform': 'translate3d(' + pel + 'px, ' + pst + 'px, 0px) scale(' + psw + ', ' + psh + ')',
        '-moz-transform': 'translate3d(' + pel + 'px, ' + pst + 'px, 0px) scale(' + psw + ', ' + psh + ')',
        '-ms-transform': 'translate3d(' + pel + 'px, ' + pst + 'px, 0px) scale(' + psw + ', ' + psh + ')',
        '-o-transform': 'translate3d(' + pel + 'px, ' + pst + 'px, 0px) scale(' + psw + ', ' + psh + ')',
        'transform': 'translate3d(' + pel + 'px, ' + pst + 'px, 0px) scale(' + psw + ', ' + psh + ')'
    });
  };

  SlideShow.prototype.move = function () {};

  SlideShow.prototype.resize = function (w, h) {
    this.vw = w;
    this.vh = h;

    if (this.getStatus()) {
      var $c = this.$c,
          ow = $c.width(),
          oh = $c.height();
      $c.addClass('no-trans');
      this.update($c, ow, oh);
    }
  };

  SlideShow.prototype.update = function ($c, ow, oh) {
    var vw = this.vw,
        vh = this.vh,
        wh = _largeScale(vw, vh, ow, oh),
        iw = wh[0], ih = wh[1],
        sw = iw / ow, sh = ih / oh,
        l = (vw - iw) / 2, t = (vh - ih) / 2;

    $c.css({
        '-webkit-transform': 'translate3d(' + l + 'px,' + t + 'px, 0) scale(' + sw + ', ' + sh + ')',
        '-moz-transform': 'translate3d(' + l + 'px,' + t + 'px, 0) scale(' + sw + ', ' + sh + ')',
        '-ms-transform': 'translate3d(' + l + 'px,' + t + 'px, 0) scale(' + sw + ', ' + sh + ')',
        '-o-transform': 'translate3d(' + l + 'px,' + t + 'px, 0) scale(' + sw + ', ' + sh + ')',
        'transform': 'translate3d(' + l + 'px,' + t + 'px, 0) scale(' + sw + ', ' + sh + ')',
      });
  };

  SlideShow.prototype.prev = function () {
    var $prev = this.$curr.prev('.figure');
    this.$curr = $prev.length ? $prev : this.$curr.parent().find('.figure').last();
    this.clone(this.$curr);
    this.effect(0);
  };

  SlideShow.prototype.next = function () {
    var $next = this.$curr.next('.figure');
    this.$curr = $next.length ? $next : this.$curr.parent().find('.figure').first();
    this.clone(this.$curr);
    this.effect(1);
  };

  SlideShow.prototype.animate = function () {
    var _this = this,
        delay = _this.delay,
        f = function () {
          _this.next();
          _this._timer = setTimeout(function () {f();}, delay);
        };

    _this._timer = setTimeout(function () {f();}, delay);
  };

  SlideShow.prototype.play = function () {
    if (this._timer) {
      clearTimeout(this._timer);
    }
    this.animate();
  };

  SlideShow.prototype.stop = function () {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = undefined;
    }
  };

  SlideShow.prototype.fullscreen = function () {};

  SlideShow.prototype.download = function () {};

  SlideShow.prototype.exit = function () {
    //this.$root.find('.gallery').removeClass('gsw');
    this.$root.find('.gallery').removeClass('mm-hide');
    this.$slideshow.css('opacity', 0).removeClass('animate');
    this.stop();
    this.$list.empty();
    this.$curr = this.$c = undefined;
    this.$root.focus();
  };

  return View;

  var Widget = require('widget');

  /**
   * Mnemosyne Class
   * Photos Sharing
   *
   * HTML
   *
   *    div.pi-wrap tabindex="-1"
   *      > div.pi role="main"
   *        > div.header role="header"
   *        > div.body
   *        > div.footer role="footer"
   */

  var Mnemosyne = Widget.extend({

      options: {

        backdrop: false,

        template: ''
          + '<div class="xphotos" tabindex="-1"><div class="mnemosyne" role="main">'
            + '<div class="header" role="header"></div>'
            + '<div class="body"></div>'
            + '<div class="footer" role="footer"></div>'
          + '</div></div>',

        parentNode: null,

        srcNode: null,

        events: null
      },

      init: function () {
        var options = this.options;
        this.parentNode = options.parentNode;
        this.srcNode = options.srcNode;
        delete options.parentNode;
        delete options.srcNode;

        this.render();
      },

      render: function () {
        this.element.appendTo(this.parentNode);
      },

      show: function () {},

      hide: function () {},

      destory: function () {
        this.element.off();
        this.element.remove();
        this._destory();
      }
    });

  return Mnemosyne;
});



