define('mnemosyne', function (require) {
  'use strict';

  var Emitter = require('emitter');
  var $ = require('jquery');
  var Handlebars = require('handlebars');
  var $proxy = $.proxy;
  var $WIN = $(window);
  var $DOC = $(document);

  var max = Math.max,
      min = Math.min,
      mfloor = Math.floor,
      mrandom = Math.random;

  //---------------------------------------------------------------
  // grouping number
  var G_N = 0;
  var RECT_TEMPLATE = '<div class="photo photo-trans" data-id="{{id}}" data-thumbnail="{{image.thumbnail.url}}" data-thumbnail-width="{{image.thumbnail.width}}" data-thumbnail-height="{{image.thumbnail.height}}" data-fullsize="{{image.fullsize.url}}" data-fullsize-height="{{image.fullsize.height}}" data-fullsize-width="{{image.fullsize.width}}">'
        + '<div class="photo-scale">'
          + '<figure class="figure">'
            + '<img src="{{image.thumbnail.url}}" />'
          + '</figure>'

          + '<div class="photo-meta">'
            + '<div class="avatar"></div>'
            + '<div class="title">Why moving elements with translate() is better than pos:abs top/left</div>'
            + '<time class="date">2012.12.12 13:09</time>'
            + '<div class="place"></div>'
          + '</div>'
        + '</div>'
    + '</div>';
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
        "name": 1,
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

  var _extend = function (t, s) {
    var k;
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
    return mfloor(n * mrandom()) + 1;
  };

  var _baseScale = function (h0, d) {
    return {
      height: h0,
      width: h0 * d
    };
  };

  /*
  var _baseScale = function (w0, h0, d0, d1, w1, h1) {
    if (d0 < d1) {
      w1 = w0;
      h1 = w1 / d1;
    } else if (d0 > d1) {
      h1 = h0;
      w1 = h1 * d1;
    } else {
      w1 = w0;
      h1 = h0;
      //w1 = h1 = max(w0, h0);
    }
    return {
      width: w1,
      height: h1
    };
  };
  */

  var _autoScale = function (w0, h0, w1, h1) {
    var r = w1 / h1,
        rw = w1 / w0,
        rh = h1 / h0;
    if (rw < rh) {
      w1 = w0;
      h1 = w1 / r;
    } else if (rw > rh) {
      h1 = h0;
      w1 = h1 * r;
    } else {
      w1 = w0;
      h1 = h0;
    }
    return {
      width: w1,
      height: h1
    };
  };

  var _largeScale = function (w0, h0, w1, h1) {
    var r = w1 / h1,
        rw = w1 / w0,
        rh = h1 / h0;
    if (rw < rh) {
      h1 = min(h1, h0);
      w1 = h1 * r;
    } else {
      w1 = min(w1, w0);
      h1 = w1 / r;
    }
    return {
      width: w1,
      height: h1
    };
  };

  var MNEMOSYNE = {};

  /**
   * Rect Class
   */
  var Rect = MNEMOSYNE.Rect = function (data) {
    var tmpl = Handlebars.compile(RECT_TEMPLATE);
    this.outerHTML = tmpl(data);
  };

  var cellFactory = function (t, data) {
    return new MNEMOSYNE[t](data);
  };

  /**
   *
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
    this.photos = photos;
    this.layout = layout;

    this.init();
  };

  G.prototype.init = function () {
    var ps = this.photos,
        layout = this.layout,
        i = 0,
        p, b, cell,
        tmpl;
    !this.html && (this.html = '');
    for (; p = ps[i]; i++) {
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

  Typesetting.prototype.boxes = undefined;

  Typesetting.prototype.typeset = function (length) {
    var pl = length,
        layouts = LAYOUTS.slice(0),
        l = layouts.length,
        r, lts, lt, gs, g;

    lts = this.layouts = [];

    while (pl) {
      r = _random(l);
      (r > pl) && (r = _random(pl));
      pl -= r;

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
    this.$gallery = $elem.find('.gallery');
    this.$gwrap = this.$gallery.find('.photos-wrap');
    this.$glist = this.$gallery.find('.photos-list');
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

    this.slideshow = new SlideShow(this, this.$root, '.gallery .photos-list .photo');

    this.resizestatus = false;

    this.addPaddingLeft();
    this.listen();
  };

  _extend(View.prototype, Emitter.prototype);

  View.prototype.getViewport = function () {
    var $r = this.$root;
    this.vw = $r.width();
    this.vh = $r.height();
  };

  View.prototype.getGallery = function () {
    var $g = this.$gwrap;
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
    var $r = this.$glist,
        layouts = this.layouts,
        l = photos.length,
        newLayouts = this.typeset(l),
        i = 0, j = 0, layout, cells, g;

    this.gid = (layouts && layouts.length) || 0;

    while ((layout = newLayouts[i++])) {
      cells = layout.cells;
      g = new G(photos.slice(j, j += cells.length), cells);
      $r.append(g.getContext());
    }

    !layouts && (this.layouts = []);
    this.layouts = this.layouts.concat(newLayouts);
    this.i = this.n;
    this.n += l;
  };

  View.prototype.render = function (photos) {
    this.addPhotos(photos);
  };

  View.prototype.addPaddingLeft = function () {
    this.$gwrap.css('padding-left', this.paddingLeft);
  };

  View.prototype.addPaddingRight = function (top, left) {
    var $gl = this.$glist, $pr = this.$glist.find('.photos-padding-right');
    if (!$pr.size()) {
      $pr = $('<div class="photos-padding-right"></div>')
        .css({width: this.paddingRight});
    }
    $pr.css({
      top: top,
      left: left
    });
    $gl.append($pr);
  };

  View.prototype.update = function () {
    var $glist = this.$glist,
        $ps = $glist.find('.photo').slice(this.i, this.n),
        _gvw = this.gvw,
        _gvh = this.gvh,
        _gid = this.gid,
        _gr = _gvw / _gvh,
        offsetTop = this.offsetTop,
        offsetLeft = this.offsetLeft,
        layouts = this.layouts.slice(gid),
        index = 0,
        layout, gid, aspect_ratio, cells, cl, cell, gvw, gvh, j,
        $p, $fg, $img, sw, sh, st, sl, iw, ih, wh, margin, mt, mr, mb, ml;
    while ((layout = layouts.shift())) {
      gid = layout.id;
      cells = layout.cells;
      cl = cells.length;
      aspect_ratio = layout.aspect_ratio;

      if (aspect_ratio) {
        wh = _baseScale(_gvh, aspect_ratio);
        gvw = wh.width;
        gvh = wh.height;
      }

      for (j = 0; j < cl; j++) {
        cell = cells[j];
        $p = $ps.eq(index);
        iw = +$p.data('thumbnail-width');
        ih = +$p.data('thumbnail-height');

        if (1 === cl) {
          aspect_ratio = iw / ih;
          wh = _baseScale(_gvh, aspect_ratio);
          gvw = wh.width;
          gvh = wh.height;
        }

        margin = cell.margin;
        mt = margin.top;
        mr = margin.right;
        mb = margin.bottom;
        ml = margin.left;

        sh = cell.height * gvh - mt - mb;
        sw = cell.width * gvw - ml - mr;
        st = offsetTop + cell.y * gvh + mt;
        sl = offsetLeft + cell.x * gvw + ml;

        $p
          .attr('data-gid', gid)
          .css({
            width: sw,
            // height: sh,
            // top: (_gvh - gvh) / 2 + st,
            //top: aspect_ratio > 1 ? (_gvh - gvh) / 2 + st : st,
            // left: sl
            '-webkit-transform': 'translate3d(' + sl + 'px,' + ((_gvh - gvh) / 2 + st) + 'px, 0px)',
            '-moz-transform': 'translate3d(' + sl + 'px,' + ((_gvh - gvh) / 2 + st) + 'px, 0px)'
            //'-webkit-transform': 'translate(' + sl + 'px,' + st + 'px)'
          });
        $fg = $p
          .find('.figure')
          .css({
            width: '100%',
            height: sh
          });
        wh = _autoScale(sw, sh, iw, ih);
        iw = wh.width;
        ih = wh.height;
        $img = $fg
          .find('img')
          .css({
            width: iw,
            height: ih,
            top: (sh - ih) / 2,
            left: (sw - iw) / 2
          });

        index++;
      } 

      offsetLeft += gvw;
    }

    this.addPaddingRight(0, offsetLeft);
  };

  View.prototype.listen = function () {
    var _this = this,
        _$root = _this.$root,
        _slideshow = _this.slideshow;

    _$root.on('click.mnemosyne', '.gallery .photos-list .photo', $proxy(function (e) {
      e.preventDefault();
      var _this = this,
          $photo = $(e.currentTarget);

      if (!_this.resizestatus) {
        this.resizestatus = true;
        $(window).trigger('debouncedresize.mnemosyne');
      }
      _this.$gwrap.addClass('photos-show');
      _this.emit('photo-show', $photo);
    }, _this))
      .on('hover.mnemosyne', '.gallery .photos-list .photo', function (e) {
        e.preventDefault();
        var $this = $(this),
            transform = '';
        $(this).toggleClass('photo-hover', e.type === 'mouseenter');
      });

    _$root.on('scroll.mnemosyne', '.gallery', function () {

    });

    _this.on('resize.mnemosyne', function (w, h) {
      _slideshow.resize(w, h);
    });

    _this.on('photo-show', function ($photo) {
      this.slideshow.show($photo);
    });

    _this.on('scroll.mnemosyne', function (w, l, t) {
      _this.scroll(w, l, t);
    });kkkk

    $(window).on('debouncedresize.mnemosyne', function () {
    // $(window).on('throttledresize', function () {
      _this.getViewport();
      _this.getGallery();
      _this.emit('resize.mnemosyne', _this.vw, _this.vh);
      _this.update();
    });
  };

  View.prototype.scroll = function ($item, isNotFirst) {
    var a = isNotFirst ? 1800 / (1800 + 377) : 1,
        p = $item.position();
    this.$gallery.stop(true, true).animate({
      scrollLeft: (p.left + 24 - (this.vw - $item.width()) / 2 * a) / a
    }, 233);
    //this.$gallery.scrollLeft((p.left + 24 - (this.vw - $item.width()) / 2 * a) / a);
    //this.$gallery.scrollLeft((p.left + 24) * a - (this.vw - $item.width()) / 2);
  };

  View.prototype.destory = function () {};

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
    //img.onerror = function () {};
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
    this.$list = this.$slideshow.find('.photos-list');

    this.max_limited = 3;
    this.n = 0;

    this.status = false;

    this.delay = 2333;
    this._timer = undefined;

    this.listen();
  };

  SlideShow.prototype.listen = function () {};

  SlideShow.prototype.update = function () {}

  SlideShow.prototype.clone = function ($photo) {
    var _this = this,
        isNotFirst = _this.$curr && this.$curr.length,
        $gallery = this.$root.find('.gallery'),
        $clone = $photo.clone().removeClass('photo-trans'),
        //offset = $photo.offset(),
        offset = $photo.offset(),
        ow = $photo.data('thumbnail-width'),
        oh = $photo.data('thumbnail-height');

    _this.$list.append($clone);
    _this.$curr = $photo;

    //http://timtaubert.de/blog/2012/09/css-transitions-for-dynamically-created-dom-elements/
    $clone.css({
      '-webkit-transition': isNotFirst ? '' : 'all .5s ease-in-out',
      '-webkit-transform': 'translate3d(' + offset.left + 'px, ' + offset.top + 'px, 0px)',
      '-moz-transition': isNotFirst ? '' : 'all .5s ease-in-out',
      '-moz-transform': 'translate3d(' + offset.left + 'px, ' + offset.top + 'px, 0px)'
    });
    _this.update($clone, ow, oh);
    _this._c.emit('scroll.mnemosyne', $photo, isNotFirst);
  };

SlideShow.prototype.show = function ($photo) {
  $photo.trigger('mouseleave.mnemosyne');
  this.$slideshow.addClass('slideshow-show');
  this.clone($photo);
};

SlideShow.prototype.effect = function () {
  var $ps = this.$list.children(),
      l = $ps.length;

  $ps.eq(l - 2).fadeOut(233, function () {
    $ps.slice(0, l - 1).remove();
  });
  $ps.eq(l - 1).fadeIn(233);
};

  SlideShow.prototype.move = function () {};

  SlideShow.prototype.resize = function (w, h, sl, st) {
    this.vw = w;
    this.vh = h;
    this.sl = sl;
    this.st = st;
  };

  SlideShow.prototype.update = function ($item, iw, ih) {
    var sw = this.vw,
        sh = this.vh,
        wh = _largeScale(this.vw, this.vh, iw, ih),
        $img = $item.find('.figure img');
    iw = wh.width;
    ih = wh.height;

    window.getComputedStyle($item[0]).height;
    $item
      .css({
      width: iw,
      height: ih,
      '-webkit-transform': 'translate3d(' + (this.vw - iw) / 2 + 'px,' + (this.vh - ih) / 2 + 'px, 0px)',
      '-moz-transform': 'translate3d(' + (this.vw - iw) / 2 + 'px,' + (this.vh - ih) / 2 + 'px, 0px)'
    });
    var $fg = $item.find('.figure')
    window.getComputedStyle($fg[0]).width;
      $fg.css({
        'height': ih
      });
    $img.css({
      '-webkit-transition': 'all .5s ease-in-out',
      '-moz-transition': 'all .5s ease-in-out',
      top: 0,
      left: 0
    });
    window.getComputedStyle($img[0]).height;
    $img.css({
      '-webkit-transition': 'all .5s ease-in-out',
      '-moz-transition': 'all .5s ease-in-out',
      'width': iw,
      'height': ih
    });
  };

  SlideShow.prototype.prev = function () {
    var $prev = this.$curr.prev();
    if ($prev.length) {
      this.$curr = $prev;
    } else {
      this.$curr = this.$curr.parent().children().last();
    }
    this.clone(this.$curr);
    this.effect();
  };

  SlideShow.prototype.next = function () {
    var $next = this.$curr.next();
    if ($next.length) {
      this.$curr = $next;
    } else {
      this.$curr = this.$curr.parent().children().first();
    }
    this.clone(this.$curr);
    this.effect();
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
    this.stop();
    this.$root.find('.photos-wrap').removeClass('photos-show');
    this.$slideshow.removeClass('slideshow-show');
    this.$list.empty();
    this.$curr = undefined;
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
