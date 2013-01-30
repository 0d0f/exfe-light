define('mnemosyne', function (require) {
  'use strict';

  var Emitter = require('emitter');
  var $ = require('jquery');
  var Handlebars = require('handlebars');
  var $proxy = $.proxy;
  var $WIN = $(window);
  var $DOC = $(document);

  var min = Math.min,
      mfloor = Math.floor,
      mrandom = Math.random;

  //---------------------------------------------------------------
  // grouping number
  var G_N = 0;
  var RECT_TEMPLATE = '<div class="photo photo-hover" data-id="{{id}}" data-thumbnail-width="{{image.thumbnail.width}}" data-thumbnail-height="{{image.thumbnail.height}}" data-fullsize="{{image.fullsize.url}}" data-fullsize-height="{{image.fullsize.height}}" data-fullsize-width="{{image.fullsize.width}}">'
        + '<div class="img-wrap">'
          + '<img src="{{image.thumbnail.url}}" />'
        + '</div>'

        + '<div class="photo-meta">'
          + '<div class="avatar"></div>'
          + '<div class="title">Why moving elements with translate() is better than pos:abs top/left</div>'
          + '<time class="date">2012.12.12 13:09</time>'
          + '<div class="place"></div>'
        + '</div>'
    + '</div>';
  var OPTIONS = {
    top: 0,
    left: 0,
    width: 1,
    height: 1
  };
  var LAYOUTS = [
    [ [ { type: 'Rect' } ] ],
    [
        [ { type: 'Rect', height: .5 }, { type: 'Rect', top: .5, height: .5 } ],
        [ { type: 'Rect', width: .5 }, { type: 'Rect', left: .5, width: .5 } ]
      ],
    [
        [ { type: 'Rect', height: .5 }, { type: 'Rect', top: .5, width: .5, height: .5 }, { type: 'Rect', top: .5, left: .5, width: .5, height: .5 } ],
        [ { type: 'Rect', width: .5 }, { type: 'Rect', left: .5, height: .5, width: .5 }, { type: 'Rect', top: .5, left: .5, width: .5, height: .5 } ],
        [ { type: 'Rect', height: .5, width: .5 }, { type: 'Rect', left: .5, height: .5, width: .5 }, { type: 'Rect', top: .5, height: .5 } ]
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
      w0 = h1 * r;
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

  var cellFactory = function (t, data, gid) {
    return new MNEMOSYNE[t](data, gid);
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
  var layoutCreator = function (cells) {
    return {
      id: G_N++,
      type: 'G',
      name: '',
      'aspect_ratio': 3 / 4,
      cells: cells
    };
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
        r, ai, as, al, n, la, lts;

    lts = this.layouts = [];

    while (pl) {
    //for (; pl;) {
      r = _random(l);
      (r > pl) && (r = _random(pl));
      pl -= r;

      ai = r - 1;
      as = layouts[ai];

      al = as.length;
      n = _random(al);
      la = as[n - 1];

      lts.push(layoutCreator(la));
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
    this.$plist = this.$gallery.find('.photos-list');
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

    this.slideshow = new SlideShow(this.$root, '.gallery .photos-list .photo');

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
    var $r = this.$plist,
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

  View.prototype.update = function () {
    var $r = this.$plist,
        $items = $r.find('.photo').slice(this.i, this.n),
        gvw = this.gvw,
        gvh = this.gvh,
        gid = this.gid,
        layouts = this.layouts.slice(gid),
        i = 0,
        index = 0,
        left, j, layout, cell, cells, aspect_ratio,
        st, sl, sw, sh, $item, $wrap, $img, iw, ih, r, rw, rh, wh, ar;

    while ((layout = layouts[i])) {
      gid = layout.id;
      cells = layout.cells;
      aspect_ratio = layout.aspect_ratio;
      ar = gvw / gvh;

      //i === 0 && console.log(vw, vh, gid);

      if (ar < aspect_ratio) {
        gvh = gvw / aspect_ratio;
      } else if (ar > aspect_ratio) {
        gvw = gvh * aspect_ratio;
      }

      //i === 0 && console.log(vw, vh, gid);

    //while ((layout = boxes.shift())) {

      //left = (i + gid) * vw;
      left = gid * gvw;
      j = 0;

      while ((cell = cells[j++])) {
        cell = _extend(cell, OPTIONS);
        st = cell.top * gvh;
        sl = left + cell.left * gvw;
        sw = cell.width * gvw;
        sh = cell.height * gvh;

        $item = $items.eq(index)
          .attr('data-gid', gid)
          .css({
            top: st,
            left: sl,
            width: sw
          });
        $wrap = $item.find('.img-wrap')
          .css({
            width: '100%',
            height: sh
          });
        $img = $wrap.find('img');
        iw = $item.data('thumbnail-width');
        ih = $item.data('thumbnail-height');
        wh = _autoScale(sw, sh, iw, ih);
        iw = wh.width;
        ih = wh.height;
        $img.css({
          'width': iw,
          'height': ih,
          'top': (sh - ih) / 2,
          'left': (sw - iw) / 2
        });
        index++;
      }
      i++;
    }
    $item = $items = layouts = null;
  };

  View.prototype.listen = function () {
    var _this = this,
        _$root = _this.$root,
        _slideshow = _this.slideshow;

    _this.on('resize', function (w, h) {
      _slideshow.resize(w, h);
    });

    //$(window).bind('debouncedresize', function () {
    $(window).on('throttledresize', function () {
      _this.getViewport();
      _this.getGallery();
      _this.emit('resize', _this.vw, _this.vh);
      _this.update();
    });
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

  var SlideShow = function ($elem, selector) {
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

  SlideShow.prototype.listen = function () {
    this.$root
      .on('click.mnemosyne', this.selector, $proxy(this.click, this));
  };

  SlideShow.prototype.update = function () {
  }

  SlideShow.prototype.click = function (e) {
    e.preventDefault();
    var _this = this,
        $elem = $(e.currentTarget),
        selectable = $elem.hasClass('selectable'),
        $root, $clone, $img, fullsize_url, tl, ow, oh;

    _this.status = true;

    if (selectable) {
      return false;
    }

    $root = _this.$root;

    $elem.addClass('selectable');
    $clone = $elem.clone().removeClass('photo-hover zoom-out');
    tl = $elem.offset();
    ow = $clone.data('thumbnail-width');
    oh = $clone.data('thumbnail-height');
    $clone.css({
      'top': tl.top - $root.scrollTop(),
      'left': tl.left - $root.scrollTop(),
      'width': ow
    });
    $img = $clone.find('img');
    fullsize_url = $clone.data('fullsize');
    _this.$root.addClass('photos-show');
    _this.$slideshow.removeClass('hide');
    _this.$list.append($clone);
    _this.$curr = $elem;
    setTimeout(function () { _this.update($clone, ow, oh) }, 0);
    var imgLoader = new LoadImage(fullsize_url, function (img) {
      console.log($img.attr('src'), fullsize_url, img.width, img.height);
      $img.prop('src', fullsize_url);
      _this.update($clone, img.width, img.height);
    });
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
        $img = $item.find('.img-wrap img');
    iw = wh.width;
    ih = wh.height;
    $item.css({
      'top': (sh -ih) / 2,
      'left': (sw -iw) / 2
    })
      .find('.img-wrap')
      .css({
        'width': iw,
        'height': ih
      });
    $img.css({
      'width': iw,
      'height': ih,
      'top': 0,
      'left': 0
    });
  };

  SlideShow.prototype.prev = function () {
    this.$list.children().remove();
    this.$curr.removeClass('selectable');
    var $prev = this.$curr.prev();
    if ($prev.size()) {
      this.$curr = $prev;
    } else {
      this.$curr = this.$curr.parent().children().last();
    }
    this.$curr.trigger('click.mnemosyne');
  };

  SlideShow.prototype.next = function () {
    this.$list.children().remove();
    this.$curr.removeClass('selectable');
    var $next = this.$curr.next();
    if ($next.size()) {
      this.$curr = $next;
    } else {
      this.$curr = this.$curr.parent().children().first();
    }
    this.$curr.trigger('click.mnemosyne');
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
    this.$root.removeClass('photos-show');
    this.$curr.removeClass('selectable');
    this.$slideshow.addClass('hide');
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
