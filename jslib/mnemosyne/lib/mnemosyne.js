define('mnemosyne', function (require) {
  'use strict';

  /* requestAnimationFrame */
  //(function() {
  var lastTime = 0, vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                  || window[vendors[x]+'CancelRequestAnimationFrame'];
  }
 
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
  //}());

  /**********************************************/
  var VOID = void 0;
  var VW, VH;
  // top, right, bottom, left, viewport-height, viewport-width
  var inViewport = function (t, r, b, l, h, w) {
    return ((t >= 0 && t <= h)
        ||
        (b >= 0 && b <= h))
      && ((l >= 0 && l <= w)
        ||
        (r >= 0 && r <= w));
  };

  var checkInViewport = function (e) {
    var r = e.getBoundingClientRect();
    return inViewport(r.top, r.right, r.bottom, r.left, VH, VW);
  };

  var slice = function (a, n) {
    var l = a.length, r = [];
    for (; n < l; ++n) {
      r.push(a[n]);
    }
    return n;
  };

  var cos = Math.cos,
      sin = Math.sin,
      tan = Math.tan,
      abs = Math.abs,
      asin = Math.asin,
      sqrt = Math.sqrt,
      atan = Math.atan,
      atan2 = Math.atan2,
      min = Math.min,
      PI = Math.PI,
      PRECISION = 1E-6;

  var Matrix = {
    precision: PRECISION,

    identity: function () {
      return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ];
    },

    multiply: function multiply (b, d) {
      var h = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
      h[0]  = b[0]  * d[0] + b[1]  * d[4] + b[2]  * d[8];
      h[1]  = b[0]  * d[1] + b[1]  * d[5] + b[2]  * d[9];
      h[2]  = b[0]  * d[2] + b[1]  * d[6] + b[2]  * d[10];
      h[4]  = b[4]  * d[0] + b[5]  * d[4] + b[6]  * d[8];
      h[5]  = b[4]  * d[1] + b[5]  * d[5] + b[6]  * d[9];
      h[6]  = b[4]  * d[2] + b[5]  * d[6] + b[6]  * d[10];
      h[8]  = b[8]  * d[0] + b[9]  * d[4] + b[10] * d[8];
      h[9]  = b[8]  * d[1] + b[9]  * d[5] + b[10] * d[9];
      h[10] = b[8]  * d[2] + b[9]  * d[6] + b[10] * d[10];
      h[12] = b[12] * d[0] + b[13] * d[4] + b[14] * d[8]  + d[12];
      h[13] = b[12] * d[1] + b[13] * d[5] + b[14] * d[9]  + d[13];
      h[14] = b[12] * d[2] + b[13] * d[6] + b[14] * d[10] + d[14];
      return 2 >= arguments.length ? h : multiply([h].concat(slice(arguments, 2)));
    },

    move: function (a, b) {
      b[2] || (b[2] = 0);
      return [
        a[0], a[1], a[2], 0,
        a[4], a[5], a[6], 0,
        a[8], a[9], a[10], 0,
        a[12] + b[0], a[13] + b[1], a[14] + b[2], 1
      ];
    },

    translate: function (a, b, d) {
      "number" != typeof d && (d = 0);
      return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        a, b, d, 1
      ];
    },

    scale: function (a, b, d) {
      "number" != typeof d && (d = 1);
      return [
        a, 0, 0, 0,
        0, b, 0, 0,
        0, 0, d, 0,
        0, 0, 0, 1
      ];
    },

    rotateX: function (a,/**/ b) {
      b = cos(a); a = sin(a);
      return [
        1, 0, 0, 0,
        0, b, a, 0,
        0, -a, b, 0,
        0, 0, 0, 1
      ];
    },

    rotateY: function (a,/**/ b) {
      b = cos(a); a = sin(a);
      return [
        b, 0, -a, 0, 
        0, 1, 0, 0,
        a, 0, b, 0,
        0, 0, 0, 1
      ];
    },

    rotateZ: function (a,/**/ b) {
      b = cos(a); a = sin(a);
      return [
        b, a, 0, 0,
        -a, b, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ];
    },

    rotate: function (a, b, d,/**/ h, s, e, g) {
      h = cos(a); a = sin(a);
      s = cos(b); b = sin(b);
      e = cos(d); d = sin(d);
      g = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];

      g[0] = s * e;
      g[1] = h * d + a * b * e;
      g[2] = a * d - h * b * e;
      g[4] = -s * d;
      g[5] = h * e - a * b * d;
      g[6] = a * e + h * b * d;
      g[8] = b;
      g[9] = -a * s;
      g[10] = h * s;
      return g
    },

    skew: function (a, b, d) {
      return [
        1, 0, 0, 0,
        tan(d), 1, 0, 0,
        tan(b), tan(a), 1, 0,
        0, 0, 0, 1
      ];
    },

    equal: function (a, b) {
      if (!a || !b)
        return false;
      if (a == b)
        return true;
      for (var d = 0, l = a.length; d < l; ++d)
        if (abs(a[d] - b[d]) >= PRECISION)
          return false;
      return true;
    },

    random: function (a) {
      a = a.slice(0);
      if (a[0] == PI / 2 || a[0] == -PI / 2)
        a[0] = -a[0], a[1] = PI - a[1], a[2] -= PI;
      a[0] > PI / 2 && (a[0] -= PI, a[1] = PI - a[1], a[2] -= PI);
      a[0] < -PI / 2 && (a[0] += PI, a[1] = -PI - a[1], a[2] -= PI);
      for (; a[1] < -PI; )
        a[1] += 2 * PI;
      for (; a[1] >= PI; )
        a[1] -= 2 * PI;
      for (; a[2] < -PI; )
        a[2] += 2 * PI;
      for (; a[2] >= PI; )
        a[2] -= 2 * PI;
      return a
    },

    inverse: function (a,/**/ b, d, h, s, e, g, j, k, m, w, r) {
      b = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
      d = a[5] * a[10] - a[6] * a[9];
      h = a[4] * a[10] - a[6] * a[8];
      s = a[4] * a[9]  - a[5] * a[8];
      e = a[1] * a[10] - a[2] * a[9];
      g = a[0] * a[10] - a[2] * a[8];
      j = a[0] * a[9]  - a[1] * a[8];
      k = a[1] * a[6]  - a[2] * a[5];
      m = a[0] * a[6]  - a[2] * a[4];
      w = a[0] * a[5]  - a[1] * a[4];
      r = 1 / (a[0] * d - a[1] * h + a[2] * s);
      b[0]  =  r * d;
      b[1]  = -r * e;
      b[2]  =  r * k;
      b[4]  = -r * h;
      b[5]  =  r * g;
      b[6]  = -r * m;
      b[8]  =  r * s;
      b[9]  = -r * j;
      b[10] =  r * w;
      b[12] = -a[12] * b[0] - a[13] * b[4] - a[14] * b[8];
      b[13] = -a[12] * b[1] - a[13] * b[5] - a[14] * b[9];
      b[14] = -a[12] * b[2] - a[13] * b[6] - a[14] * b[10];
      return b
    },

    translateValues: function (a) {
      return [a[12], a[13], a[14]];
    },

    create: function (a) {
      var distance = function (x, y, z) {
        d || (d = 0);
        return sqrt(x * x + y * y + z * z);
      };

      var d = a[0] + distance(a[0], a[1], a[2]),
          h = 2 / (d * d + a[1] * a[1] + a[2] * a[2]),
          s = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
      s[0] = 1 - h * d * d;
      s[1] = -h * d * a[1];
      s[2] = -h * d * a[2];
      s[5] = 1 - h * a[1] * a[1];
      s[6] = -h * a[1] * a[2];
      s[10] = 1 - h * a[2] * a[2];
      s[4] = s[1];
      s[8] = s[2];
      s[9] = s[6];
      d = Matrix.multiply(a, s);
      h = distance(d[5], d[6]);
      0 < d[5] && d[5] != h && (h *= -1);
      h = d[5] + h;
      var e = 2 / (h * h + d[6] * d[6]), j = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
      j[5] = 1 - e * h * h;
      j[6] = -e * h * d[6];
      j[9] = j[6];
      j[10] = 1 - e * d[6] * d[6];
      s = Matrix.multiply(s, j);
      d = Matrix.multiply(a, s);
      h = Matrix.scale(0 > d[0] ? -1 : 1, 0 > d[5] ? -1 : 1, 0 > d[10] ? -1 : 1);
      d = Matrix.multiply(h, d);
      s = Matrix.multiply(s, h);
      h = {};
      h.translate = Matrix.translateValues(a);
      h.rotate = [atan2(-s[6], s[10]), asin(s[2]), atan2(-s[1], s[0])];
      h.rotate[0] || (h.rotate[0] = 0, h.rotate[2] = atan2(s[4], s[5]));
      h.scale = [d[0], d[5], d[10]];
      h.skew = [atan(d[9] / h.scale[2]), atan(d[8] / h.scale[2]), atan(d[4] / h.scale[0])];
      return h;
    },

    translateTo: function (a) {
      var b = Matrix.scale(a.scale[0], a.scale[1], a.scale[2]),
          d = Matrix.skew(a.skew[0], a.skew[1], a.skew[2]),
          h = Matrix.rotate(a.rotate[0], a.rotate[1], a.rotate[2]);
      return Matrix.move(Matrix.multiply(b, d, h), a.translate)
    },

    //toString: function (a,/**/ i, l) {
    toCSSMatrix3d: function (a,/**/ i, l) {
      a = a.slice(0); i = 0; l = a.length;
      for (; i < l; ++i) {
        abs(a[i]) < PRECISION && (a[i] = 0);
      }
      return 'matrix3d(' + a.join() + ')';
    }
  };

  //console.log(Matrix.toCSSMatrix3d(Matrix.multiply(Matrix.identity(), Matrix.scale(1.01, 1.01))));

  /**********************************************/

  var $ = require('jquery'),
      TWEEN = require('tween'),
      Handlebars = require('handlebars'),
      Panel = require('panel'),
      request = require('api').request,
      getPhotoX = function (photox_id, before, done, fail) {
        return request(
          'photox_getPhotoX',
          {
            resources : { photox_id : photox_id },
            beforeSend: before
          },
          // {"photox" : [object:photox]}
          done,
          fail
        );
      },
      mrandom = Math.random,
      proto;

  /**
   * Help functions.
   */

  /**
   * Load Image
   * todo: 后面有单独的图片加载模块。
   */
  var loadImage = function (f, url, cb, ecb) {
    // https://github.com/Modernizr/Modernizr/pull/377
    //var img = document.createElement('img'),
    var img = new Image(),
        abort = function (img) {
          img.onload = img.onerror = img = f = undefined;
        };
    img.onload = function () {
      cb && cb(img, f);
      abort(img);
    };
    img.onerror = function () {
      ecb && ecb(img, f);
      abort(img);
    };
    img.src = url;
  };

  var G_N = 0;

  var extend = function (t, s, k) {
    for (k in s) {
      if (!t.hasOwnProperty(k)) {
        t[k] = s[k];
      }
    }
    return t;
  };

  var random = function (n) {
    return parseInt(n * mrandom()) + 1;
  };

  var scaleWidthByHeight = function (h, d) {
    return h * d;
  };

  var scalForLarge = function (w0, h0, w1, h1) {
    var r = w1 / h1,
        rw = w1 / w0,
        rh = h1 / h0,
        w1 = min(w0, w1),
        h1 = min(h0, h1);
    if (rw < rh) {
      w1 = h1 * r;
    } else {
      h1 = w1 / r;
    }
    return [w1, h1];
  };

  var layoutCreator = function (g) {
    return extend({ id: G_N++ }, g);
  };

  // $f     - figure element
  // gid    - group id
  // ph, pw - preview.height & preview.width
  // rh, rw - calculate height, width
  // rt, rl - calculate top, left
  var updateFigure = function (f, gid, ph, pw, rh, rw, rt, rl) {
    f.setAttribute('data-gid', gid);
    f.style.opacity = 1;
    f.style.width = rw + 'px';
    f.style.height = rh + 'px';
    var m4 = Matrix.translate(rl, rt, PRECISION);
    f.style.webkitTransform = Matrix.toCSSMatrix3d(m4);
    f.style.transform = Matrix.toCSSMatrix3d(m4);
    f._m4 = m4;
    if (f.getAttribute('data-lazy') === '-1') {
      f.setAttribute('data-whlt', [pw, ph, (rw - pw) / 2, (rh - ph) / 2].join(','));
    } else {
      var style = f.querySelector('img').style;
      style.width = pw + 'px';
      style.height = ph + 'px';
      style.top = (rh - ph) / 2 + 'px';
      style.left = (rw - pw) / 2 + 'px';
    }
  };


  /**
   * layouts
   */

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
          { "type": "Rect", "x": 0, "y": 0,   "width": 1, "height": 0.5, "margin": { "top": 6, "right": 6, "bottom": 6, "left": 6 } },
          { "type": "Rect", "x": 0, "y": 0.5, "width": 1, "height": 0.5, "margin": { "top": 6, "right": 6, "bottom": 6, "left": 6 } }
        ]
      },

      {
        "type": "G",
        "name": "2A2",
        "aspect_ratio": 3 / 4,
        "cells": [
          { "type": "Rect", "x": 0, "y": 0,   "width": 1, "height": 0.5, "margin": { "top": 6, "right": 6, "bottom": 6, "left": 6 } },
          { "type": "Rect", "x": 0, "y": 0.5, "width": 1, "height": 0.5, "margin": { "top": 6, "right": 6, "bottom": 6, "left": 6 } }
        ]
      },

      {
        "type": "G",
        "name": "2B1",
        "aspect_ratio": 4 / 3,
        "cells": [
          { "type": "Rect", "x": 0,   "y": 0, "width": 0.5, "height": 1, "margin": { "top": 6, "right": 6, "bottom": 6, "left": 6 } },
          { "type": "Rect", "x": 0.5, "y": 0, "width": 0.5, "height": 1, "margin": { "top": 6, "right": 6, "bottom": 6, "left": 6 } }
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
          { "type": "Rect", "x": 0,   "y": 0,        "width": 1,   "height": 0.666666, "margin": { "top": 6, "right": 6, "bottom": 6, "left": 6 } },
          { "type": "Rect", "x": 0,   "y": 0.666666, "width": 0.5, "height": 0.333333, "margin": { "top": 6, "right": 6, "bottom": 6, "left": 6 }} ,
          { "type": "Rect", "x": 0.5, "y": 0.666666, "width": 0.5, "height": 0.333333, "margin": { "top": 6, "right": 6, "bottom": 6, "left": 6 } }
        ]
      },

      {
        "type": "G",
        "name": "3B1",
        "aspect_ratio": 1 / 1,
        "cells": [
          { "type": "Rect", "x": 0,     "y": 0,     "width": 0.382, "height": 0.382, "margin": { "top": 6, "right": 6, "bottom": 6, "left": 6 } },
          { "type": "Rect", "x": 0.382, "y": 0,     "width": 0.618, "height": 0.382, "margin": { "top": 6, "right": 6, "bottom": 6, "left": 6 } },
          { "type": "Rect", "x": 0,     "y": 0.382, "width": 1,     "height": 0.618, "margin": { "top": 6, "right": 6, "bottom": 6, "left": 6 } }
        ]
      }
    ]
  ];

  var MNEMOSYNE = {};

  /**
   * Rect
   */

  var RECT_TEMPLATE = ''
        + '<figure class="surface" data-lazy="-1" data-id="{{id}}" '
            + 'data-preview-url="{{images.preview.url}}" '
            + 'data-preview-height="{{images.preview.height}}" '
            + 'data-preview-width="{{images.preview.width}}" '
            + 'data-fullsize-url="{{images.fullsize.url}}" '
            + 'data-fullsize-height="{{images.fullsize.height}}" '
            + 'data-fullsize-width="{{images.fullsize.width}}" '
            + '>'
          + '<div class="photo perspective">'
          + '</div>'
          + '<div class="mask"></div>'
          + '<div class="btn-like">Like</div>'
          + '<div class="meta">'
            + '<div class="avatar"><img width="24" height="24" src="{{by_identity.avatar_filename}}" alt="" /></div>'
            + '<div class="title">{{caption}}</div>'
            + '<time>{{updated_at}}</time>'
            + '<div class="place"></div>'
          + '</div>'
        + '</figure>';

  var Rect = MNEMOSYNE.Rect = function (data) {
    this.html = Handlebars.compile(RECT_TEMPLATE)(data);
  };

  Rect.prototype.toString = function () {
    return this.html;
  };


  /**
   * Cell Factory
   */

  var cellFactory = function (t, data) {
    return new MNEMOSYNE[t](data);
  };


  /**
   * Grouping
   */

  var G = function (photos, layout) {
    var i = 0,
        html = '',
        p, b, cell;

    for (; p = photos[i]; i++) {
      b = layout[i];
      cell = cellFactory(b.type, p);
      html += cell.toString();
    }
    return html;
  }


  /**
   * The Layout Engine
   */

    var Typesetting = function () {};

    proto = Typesetting.prototype;

    proto.defaultLayouts = LAYOUTS;

    /**
     * Generate layouts
     */

    proto.genLayouts = function (len) {
      var layouts = LAYOUTS.slice(0),
          l = layouts.length,
          list = [],
          r, gs, g;

      while (len) {
        r = random(len < l ? len : l);
        len -= r;

        // groups layouts
        gs = layouts[r - 1];
        // group
        g = gs[random(gs.length) - 1];

        list.push(layoutCreator(g));
      }

      return list;
    };


    /**
     *
     */
    var SlideShow = function (component, $element) {
      this.component = component;
      this.$element = $element;
      this.animate = true;
    };

    SlideShow.prototype.show = function (figure) {
      var $e = this.$element,
          s = $e[0].style;
      s.webkitTransform = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + $('#app-tmp').scrollLeft() + ', 0, 1, 1)';
      s.transform = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + $('#app-tmp').scrollLeft() + ', 0, 1, 1)';
      this.$element.attr('tabindex', '-1').focus();
      this.clone(figure);
    };

    SlideShow.prototype.exit = function () {
      var $e = this.$element, es = $e[0].style;
      $e.attr('tabindex', 'none')
      new TWEEN.Tween({ o: 1 })
            .to({ o: 0 }, 400)
            .interpolation(TWEEN.Interpolation.Bezier)
            .easing(TWEEN.Easing.Exponential.Out)
            .onUpdate(function () {
              es.opacity = this.o;
            })
            .onComplete(function () {
              $e.empty();
            })
            .start();
      this.img = this.curr = VOID;
      this.lockup = false;
    };

    SlideShow.prototype._clone_0 = function (f) {
      this.$element.empty();
      this.lockup = true;
      var self = this,
          r = f.getBoundingClientRect(),
          w = f.clientWidth,
          h = f.clientHeight,
          l = r.left,
          t = r.top,
          es = this.$element[0].style,
          pu = f.getAttribute('data-preview-url'),
          fu = f.getAttribute('data-fullsize-url'),
          fw = +f.getAttribute('data-fullsize-width'),
          fh = +f.getAttribute('data-fullsize-height'),
          sw = w / fw, sh = h / fh;
      var _img = new Image();
      _img.setAttribute('class', 'pic');
      _img.src = pu;
      _img.width = fw;
      _img.height = fh;
      //_img.style.opacity = 0;
      var m0 = Matrix.move(Matrix.multiply(Matrix.scale(sw, sh), Matrix.identity()), [l, t, 1]);
      _img.style.webkitTransform = m0;
      _img.style.transform = m0;

      loadImage(
        null,
        fu,
        function (img) { img.src = fu; }
        // error
      );
      this.$element.append(_img);

      this.curr = f;
      var m1 = this.cal(fw, fh),
          style = _img.style;

      _img._m4 = m1;
      new TWEEN.Tween(m0)
        .to(m1, 400)
        .interpolation(TWEEN.Interpolation.Bezier)
        .easing(TWEEN.Easing.Exponential.Out)
        .onUpdate(function (time) {
          var t = Matrix.toCSSMatrix3d(this);
          style.webkitTransform = t;
          style.transform = t;
          //style.opacity = time;
          es.opacity = time;
        })
        .onComplete(function () {
          self.lockup = false;
          TWEEN.remove(this);
        })
        .start();
      return _img;
    };

    SlideShow.prototype.prev = function () {
      if (this.lockup) return;
      var img = this.img,
          $curr = $(this.curr),
          $prev = $curr.prev('.surface'),
          prev;
      this.curr = ($prev.length ? $prev : $curr.parent().find('.surface').last())[0];
      prev = this.clone(this.curr);
      this.effect(img, prev, -1);
    };

    SlideShow.prototype.next = function () {
      if (this.lockup) return;
      var img = this.img,
          $curr = $(this.curr),
          $next = $curr.next('.surface'),
          next;
      this.curr = ($next.length ? $next : $curr.parent().find('.surface').first())[0];
      next = this.clone(this.curr);
      this.effect(img, next, 1);
    };

    SlideShow.prototype.effect = function (curr, next, a) {
      this.lookup = true;
      var self = this,
          cm = curr._m4,
          nm = next._m4,
          cs = curr.style,
          ns = next.style,
          cl = 50 * a;

      nm = Matrix.move(nm, [-cl, 0, 0]);
      ns.webkitTransform = ns.transform = Matrix.toCSSMatrix3d(nm);
      new TWEEN.Tween({ x: 0 })
        .to({ x: cl }, 400)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onStart(function () {
          self.lockup = true;
          $(curr).prevAll().remove();
        })
        .onUpdate(function (t) {
          cs.opacity = 1 - t;
          cs.webkitTransform = cs.transform = Matrix.toCSSMatrix3d(Matrix.move(cm, [this.x, 0, 1 - t]));
          ns.opacity = t;
          ns.webkitTransform = ns.transform = Matrix.toCSSMatrix3d(Matrix.move(nm, [this.x, 0, t]));
        })
        .onComplete(function () {
          ns.opacity = 1;
          self.lockup = false;
          TWEEN.remove(this);
        })
        .start();
    };

    SlideShow.prototype.update = function () {
      var img = this.img,
          imgs = img.style,
          m4 = img._m4,
          f = this.curr,
          fw = +f.getAttribute('data-fullsize-width'),
          fh = +f.getAttribute('data-fullsize-height'),
          m = this.cal(fw, fh),
          slice = [].slice,
          toCSSMatrix3d = Matrix.toCSSMatrix3d;
      new TWEEN.Tween(m4)
        .to(m, 233)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(function () {
          imgs.webkitTransform = imgs.transform = toCSSMatrix3d(slice.call(this));
        })
        .onComplete(function () {
          TWEEN.remove(this);
        })
        .start();
    };

    SlideShow.prototype.cal = function (fw, fh) {
      var vw = this.vw,
          vh = this.vh,
          wh = scalForLarge(vw, vh, fw, fh),
          rw = wh[0], rh = wh[1],
          sw = rw / fw, sh = rh / fh,
          l = (vw - rw ) / 2, t = (vh - rh ) / 2;
      return Matrix.move(Matrix.multiply(Matrix.scale(sw, sh), Matrix.identity()), [l, t, 1]);
    };

    SlideShow.prototype._clone_1 = function (f) {
      var pu = f.getAttribute('data-preview-url'),
          fu = f.getAttribute('data-fullsize-url'),
          fw = +f.getAttribute('data-fullsize-width'),
          fh = +f.getAttribute('data-fullsize-height'),
          m = this.cal(fw, fh);

      var _img = new Image();
      _img.setAttribute('class', 'pic');
      _img.src = pu;
      _img.width = fw;
      _img.height = fh;
      _img._m4 = m;
      m = Matrix.toCSSMatrix3d(m);
      _img.style.webkitTransform = m;
      _img.style.transform = m;
      _img.style.opacity = 0;

      loadImage(
        null,
        fu,
        function (img) {
          img.src = fu;
          img = VOID;
        }
        //error
      );
      this.$element.append(_img);
      return _img;
    };

    SlideShow.prototype.resize = function (w, h) {
      this.vw = w;
      this.vh = h;
      if (this.img) {
        this.update();
      }
    };

    SlideShow.prototype.clone = function (figure) {
      var isNotFirst = !!this.curr;
      this.curr = figure;
      return this.img = this['_clone_' + (isNotFirst ? 1 : 0)](figure);
    };


    /**
     * Mnemosyne Panel
     */

    var Mnemosyne = Panel.extend({

      options: {

        template: ''
          + '<div class="panel mnemosyne-panel perspective" tabindex="-1">'
            // header
            //+ '<div class="panel-header"></div>'

            // body
            + '<div class="panel-body perspective">'

              // gallery
              + '<div class="gallery perspective group"></div>'

            + '</div>'

            // footer
            //+ '<div class="panel-footer"></div>'
          + '</div>'
          + '<div class="slideshow-panel perspective group"></div>'
          + '<div class="mnemosyne-exit">Exit</div>'

      },

      init: function () {
        var opts = this.options, element;

        // crossId = photoxId
        this.crossId = opts.crossId;
        delete opts.crossId;

        this.render();
        element = this.element;

        this.$appTmp = $('#app-tmp');
        this.$mnemosyne = element.eq(0);
        this.$gallery = this.$mnemosyne.find('.gallery');
        this.$slideshow = element.eq(1);
        this.$exit = element.eq(2);
        this.typesetting = new Typesetting();
        this.slideshow = new SlideShow(this, this.$slideshow);

        // previouse added photos
        this.i = 0;

        // total photos
        this.n = 0;

        this.offsetTop = 0;
        this.offsetLeft = 24;

        this.paddingRight = 30;

        this.listen();
      },

      listen: function () {
        var self = this,
            //element = self.element,
            typesetting = self.typesetting,
            slideshow = self.slideshow,
            $exit = self.$exit,
            $m = self.$mnemosyne,
            $g = self.$gallery,
            $s = self.$slideshow,
            $at = self.$appTmp,
            $WIN = $(window);

        function animate() {
          self.frame = requestAnimationFrame(animate);
          TWEEN.update();
        }
        animate();

        $m.on('click.mnemosyne', '.gallery .surface', function (e) {
          e.preventDefault();
          e.stopPropagation();
        });

        $m.on('mouseenter.mnemosyne mouseleave.mnemosyne', '.gallery .surface', function (e) {
          e.preventDefault();
          var t = this,
              ts = t.style,
              $t = $(t),
              _m4 = this._m4,
              isMouseEnter = e.type === 'mouseenter',
              tween = $t.data('tween'),
              masks = t.querySelector('.mask').style,
              likes = t.querySelector('.btn-like').style,
              metas = t.querySelector('.meta').style,
              multiply = Matrix.multiply,
              scale = Matrix.scale,
              toCSSMatrix3d = Matrix.toCSSMatrix3d;

          if (!tween) {
            tween = new TWEEN.Tween({v: 1})
                      .easing(TWEEN.Easing.Cubic.InOut);
            $t.data('tween', tween);
          }

          tween.stop();

          if (isMouseEnter) {
            tween
              .delay(144)
              .to({ v: 1.01 }, 150)
              .onUpdate(function () {
                masks.opacity = (this.v - 1) * 4;
                likes.opacity = metas.opacity = this.v * 0.99; // 1 / 1.01
                ts.transform = ts.webkitTransform = toCSSMatrix3d(multiply(scale(this.v, this.v), _m4));
              });
          } else {
            tween.delay(0)
              .to({ v: 1 }, 150)
              .onUpdate(function () {
                masks.opacity = (this.v - 1) * 4;
                likes.opacity = metas.opacity = (this.v - 1) * 0.99;
                t.style.transform = ts.webkitTransform= toCSSMatrix3d(multiply(scale(this.v, this.v), _m4));
              })
              .onComplete(function () {
                $t.data('tween', null);
                TWEEN.remove(this);
              });
          }
          tween.start();
        })
          .on('click.mnemosyne', '.gallery .surface', function (e) {
            e.preventDefault();
            //$(this).trigger('mouseleave.mnemosyne');
            $at.addClass('show-slideshow');
            self.emit('launch-slideshow', this);
          })
            .on('click.mnemosyne', '.surface .btn-like', function (e) {
              e.preventDefault();
              e.stopPropagation();
            });
        $exit.on('click.mnemosyne', function (e) {
          e.preventDefault();
          e.stopPropagation();
          self.hide();
        });

          $s.on('keydown.mnemosyne', function (e) {
              e.preventDefault();
              var keyCode = e.keyCode;
              switch (keyCode) {
                case 39: // right
                case 40: // bottom
                  slideshow.next();
                  break;
                case 38:  // up
                case 37: // left
                  slideshow.prev();
                  break;
                case 27: // esc
                  e.stopPropagation();
                  self.emit('exit-slideshow');
                  break;
              }
            });

        var _exits = $exit[0].style;
        $at.on('scroll.mnemosyne', function (e) {
          e.preventDefault();
          e.stopPropagation();


          var _x = _exits._x, tx = this.scrollLeft;
          new TWEEN.Tween({ x: _x })
            .to({ x: tx }, 144)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(function () {
              _exits.transform = _exits.webkitTransform
                = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + this.x  + ', ' + '0, 2.3333333, 1)';
            })
            .onComplete(function () {
              _exits._x = tx;
            })
            .start();

          var $fs = $g.find('[data-lazy="-1"]'), f;

          if (0 === $fs.length) { return; }

          var cb = function (img, f) {
            if (f) {
              var whlt = f.getAttribute('data-whlt').split(','),
                  style = img.style;
              f.setAttribute('data-lazy', '1');
              img.setAttribute('class', 'pic perspective');
              style.width = whlt[0] + 'px';
              style.height = whlt[1] + 'px';
              style.left = whlt[2] + 'px';
              style.top = whlt[3] + 'px';
              style.opacity = 0;
              f.querySelector('.photo').appendChild(img);
              new TWEEN.Tween({v: 0})
                .to({ v: 1 })
                .easing(TWEEN.Easing.Cubic.InOut)
                .onUpdate(function () {
                  style.opacity = this.v;
                })
                .onComplete(function () { TWEEN.remove(this); })
                .start();
            }
          },
          ecb = function (img, f) {
            f && f.setAttribute('data-lazy', '-1');
          };

          while ((f = $fs.splice(0, 1)[0])) {
            if (checkInViewport(f)) {
              f.setAttribute('data-lazy', '0');
              loadImage(
                f,
                f.getAttribute('data-fullsize-url'),
                cb,
                ecb
              );
            } else { break; }
          }
        });

        $WIN.on('throttledresize.mnemosyne', function () {
          self.getViewport();
          self.getGallery();
          self.updateViewport();
          self.update();
          $at.trigger('scroll.mnemosyne');
        });

        self.on('load-photos', function (data) {
          var photos = data.photox.photos,
              len = photos.length;

          if (len) {
            this.emit('draw', photos, len);
          }

        });

        self.on('launch-slideshow', function (figure) {
          var ms = $m[0].style;
          new TWEEN.Tween({ z: 1 })
            .to({ z: -144 }, 400)
            //.interpolation(TWEEN.Interpolation.Bezier)
            .easing(TWEEN.Easing.Exponential.Out)
            .onUpdate(function (t) {
              ms.transform =
                ms.webkitTransform = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, ' + this.z + ', 1)';
              ms.opacity = 0.5 * t;
            })
            .onComplete(function () {TWEEN.remove(this);})
            .start()
          self.slideshow.show(figure);
        });

        self.on('exit-slideshow', function () {
          self.slideshow.exit();
          var ms = $m[0].style;
          new TWEEN.Tween({ z: -144 })
            .to({ z: 1.0000099999999748 }, 400)
            .interpolation(TWEEN.Interpolation.Bezier)
            .easing(TWEEN.Easing.Exponential.Out)
            .onUpdate(function (t) {
              ms.transform =
                ms.webkitTransform = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, ' + this.z + ', 1)';
              ms.opacity = 0.5 * (t + 1);
            })
            .onComplete(function () {
              $at.removeClass('show-slideshow');
              $m.focus();
              TWEEN.remove(this);
            })
            .start()
        });

        // Generate layouts & draw
        self.on('draw', function (photos, len) {
          /* test */
          //len *= 5;
          //photos = [].concat(photos, photos, photos, photos, photos);
          /* */

          var layouts = typesetting.genLayouts(len);
          this.drawPhotos(photos, layouts, len);
          $WIN.trigger('throttledresize.mnemosyne');
        });

      },

      updateViewport: function () {
        var x = window.scrollX, y = window.scrollY;
        var matrix3d0 = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + x + ', ' + y + ', 0.000001, 1)';
        var matrix3d1 = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + x + ', ' + y + ', 0.010000, 1)';
        var matrix3d2 = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + x + ', ' + '0, 2.3333333, 1)';
        var ms = $('.mnemosyne-bg')[0].style;
        ms.transform = ms.webkitTransform = matrix3d0;
        var as = this.$appTmp[0].style;
        as.transform = as.webkitTransform = matrix3d1;
        var es = this.$exit[0].style;
        es.transform = es.webkitTransform = matrix3d2;
        es._x = x;
      },

      addMBG: function () {
        var matrix3d = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + window.scrollX + ', ' + window.scrollY + ', 0.000001, 1)';
        $('<div class="mnemosyne-bg perspective" style="-webkit-transform: ' + matrix3d + '; transform: ' + matrix3d + ';"><div class="mnemosyne-bg-in"></div></div>').prependTo($('body'));
      },

      delMBG: function () {
        $('.mnemosyne-bg').remove();
      },

      drawPhotos: function (photos, layouts, len) {
        var $g = this.$gallery,
            i = 0, j = 0,
            layout, cells, figure;

        if (!this.layouts) {
          this.layouts = [];
        }

        this.gid = this.layouts.length;

        while ((layout =layouts[i++])) {
          cells = layout.cells;
          figure = G(photos.slice(j, j += cells.length), cells);
          $g.append(figure);
        }

        this.layouts = this.layouts.concat(layouts);
        this.i = this.n;
        this.n += len;
      },

      update: function () {
        var $g = this.$gallery,
            $fs = $g.find('figure').slice(this.i, this.n),
            gvw = this.gvw,
            gvh = this.gvh,
            gid = this.gid,
            layouts = this.layouts.slice(gid),
            offsetTop = this.offsetTop,
            offsetLeft = this.offsetLeft,
            index = 0, vh = gvh, vw = gvw,
            layout, cells, cl, cell, aspect_ratio,
            $f, pw, ph, margin, rw, rh, rl, rt;

        while ((layout = layouts.shift())) {
          gid = layout.id;
          aspect_ratio = layout.aspect_ratio;
          cells = layout.cells.slice();
          cl = cells.length;

          if (aspect_ratio) {
            vw = scaleWidthByHeight(gvh, aspect_ratio);
          }

          while((cell = cells.shift())) {
            $f = $fs.eq(index);
            ph = +$f.data('preview-height');
            pw = +$f.data('preview-width');

            if (1 === cl) {
              vw = scaleWidthByHeight(gvh, pw / ph);
            }

            margin = cell.margin;
            rh = cell.height * vh - margin.top - margin.bottom;
            rw = cell.width * vw - margin.left - margin.right;
            rt = offsetTop + cell.y * vh + margin.top + (gvh - vh) / 2;
            rl = offsetLeft + cell.x * vw + margin.left;

            updateFigure($f[0], gid, ph, pw, rh, rw, rt, rl);

            index++;
          }

          offsetLeft += vw;
        }

        this.addPaddingRight(0, offsetLeft);
      },

      addPaddingRight: function (top, left) {
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
      },

      getPhotos: function () {
        var self = this;
        getPhotoX(self.crossId,
          function () {
            //console.log(233);
          },
          function (data) {
            self.emit('load-photos', data);
          }
        );
      },

      getViewport: function () {
        var $r = this.element;
        this.vw = VW = $r.width();
        this.vh = VH = $r.height();
        this.slideshow.resize(this.vw, this.vh);
      },

      getGallery: function () {
        this.gvw = this.vw;
        this.gvh = this.vh - 80 - 40;
      },

      showBefore: function () {
        $('body').addClass('mnemosyne-start');
        $('#app-tmp').css('-webkit-transform', 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + window.scrollX + ', ' + window.scrollY + ', 1.000001, 1)');
        $('#app-tmp').css('transform', 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + window.scrollX + ', ' + window.scrollY + ', 1.000001, 1)');
        this.getPhotos();
      },

      showAfter: function () {
        var $mbg = $('.mnemosyne-bg'),
            mbgStyle = $mbg[0].style,
            mbgInStyle = $mbg.find('.mnemosyne-bg-in')[0].style,
            $at = this.$appTmp,
            ms = this.$mnemosyne[0].style;

        ms.webkitTransform = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1024, 1)';
        ms.transform = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1024, 1)';
        ms.opacity = 1;

        var step0 = new TWEEN.Tween({v: 0})
              .to({ v: 1}, 1600)
              .delay(200)
              .interpolation(TWEEN.Interpolation.Bezier)
              .easing(TWEEN.Easing.Back.InOut)
              .onUpdate(function () {
                mbgStyle.opacity = this.v;
              })
              .onComplete(function () {
                TWEEN.remove(this);
              });
        var step1 = new TWEEN.Tween({v: 0})
              .to({ v: 1}, 1400)
              .interpolation(TWEEN.Interpolation.Bezier)
              .easing(TWEEN.Easing.Linear.None)
              .onUpdate(function () {
                mbgInStyle.opacity = this.v;
              })
              .onComplete(function () {
                TWEEN.remove(this);
              });
        var step2 = new TWEEN.Tween({v: 1024})
              .to({ v: 1.00001}, 1100)
              .interpolation(TWEEN.Interpolation.Bezier)
              .easing(TWEEN.Easing.Linear.None)
              .onUpdate(function () {
                ms.webkitTransform = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, ' + this.v + ', 1)'
                ms.transform = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, ' + this.v + ', 1)'
              })
              .onComplete(function () {
                $at.trigger('scroll.mnemosyne');
                TWEEN.remove(this);
              });
        step0.chain(step1);
        step1.chain(step2);
        step0.start();
      },

      show: function () {
        this.emit('showBefore');
        this.escapable();
        this.element.prependTo(this.parentNode);
        this.addMBG();
        this.emit('showAfter');
        return this;
      },

      hide: function () {
        TWEEN.removeAll();
        var self = this,
            mbgs = $('.mnemosyne-bg')[0].style,
            ms = self.$mnemosyne[0].style,
            ss = self.$slideshow[0].style;

        $(document).off('keydown.panel');
        this.element.off();

        new TWEEN.Tween({ o: 1 })
          .to({ o: 0 }, 610)
          .easing(TWEEN.Easing.Cubic.In)
          .onUpdate(function () {
            mbgs.opacity
              = ms.opacity
              = ss.opacity
              = this.o;
          })
          .onComplete(function () {
            self.destory();
            TWEEN.removeAll();
          })
          .start();
      },

      destory: function () {
        this.delMBG();
        $('body').removeClass('mnemosyne-start');
        this.$appTmp
          .removeClass('.show-mnemosyne')
          .off('.mnemosyne')
          .css({
            '-webkit-transform': 'none',
            'transform': 'none'
          });
        $(window).off('throttledresize.mnemosyne');
        cancelAnimationFrame(this.frame);
        this.element.off();
        this.element.remove();
        this._destory();
      }
    });

    return Mnemosyne;

});
