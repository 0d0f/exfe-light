/*! EXFE.COM QXdlc29tZSEgV2UncmUgaHVudGluZyB0YWxlbnRzIGxpa2UgeW91LiBQbGVhc2UgZHJvcCB1cyB5b3VyIENWIHRvIHdvcmtAZXhmZS5jb20uCg== */
/*! desktop@2a.12 2013-06-24 07:06:45 */
(function(e) {
  "use strict";
  function t(e, t, n) {
    var s = arguments.length;
    1 === s ? (n = e, e = void 0) : 2 === s && (n = t, t = void 0);
    var o = new r(e, t, n);
    e ? a[e] = o : n.call(o, i, o.exports, o);
  }
  function i(e) {
    var t = a[e];
    return t ? (t.exports || n(t), t.exports) : null;
  }
  function n(e) {
    var t, n = e.factory;
    delete e.factory, t = n(i, e.exports = {}, e), t && (e.exports = t);
  }
  function r(e, t, i) {
    this.id = e, this.uri = void 0, this.deps = t, "string" == typeof i && (i = Function("require", "exports", "module", i)), 
    this.factory = i, this.exports = void 0, this.filename = null, this.parent = void 0, 
    this.loaded = !1;
  }
  t.amd = {
    jQuery: !0
  }, e.define = t, r.prototype.constructor = r;
  var a = r.__cache = {};
})(this), define("class", function() {
  "use strict";
  function e(i) {
    return this instanceof e || !s(i) ? void 0 : t(i);
  }
  function t(t) {
    return t.extend = e.extend, t.implement = r, t;
  }
  function i(i, n, r, s, l) {
    function c() {
      i.apply(this, arguments), this.constructor === c && this.initialize && (this.initialize.apply(this, arguments), 
      this.initialized = !0);
    }
    return s = i.prototype, i !== e && a(c, i), c.Extends = i, l = o(s), n && a(l, n), 
    c.prototype = l, r && a(c, r), c.superclass = s, c.prototype.constructor = c, t(c);
  }
  function n() {}
  function r(e) {
    var t, i = this.prototype;
    for (t in e) i[t] = e[t];
  }
  function a(e, t) {
    var i;
    for (i in t) e[i] = t[i];
  }
  function s(e) {
    return "[object Function]" === l.call(e);
  }
  e.create = function(t, n) {
    return s(t) || (n = t, t = null), n || (n = {}), t || (t = n.Extends || e), i(t, n);
  }, e.extend = function(e, t) {
    return i(this, e, t);
  };
  var o = Object.__proto__ ? function(e) {
    return {
      __proto__: e
    };
  } : function(e) {
    return n.prototype = e, new n();
  }, l = Object.prototype.toString;
  return e;
}), define("emitter", function() {
  "use strict";
  function e() {}
  var t = /\s+/, i = Object.keys;
  return i || (i = function(e) {
    var t, i = [];
    for (t in e) e.hasOwnProperty(t) && (i[i.length] = t);
    return i;
  }), e.prototype.on = function(e, i, n) {
    var r, a, s;
    if (!i) return this;
    for (e = e.split(t), r = this.__callbacks || (this.__callbacks = {}); a = e.shift(); ) s = r[a] || (r[a] = []), 
    i.__context = n, s[s.length] = i;
    return this;
  }, e.prototype.once = function(e, i, n) {
    var r, a, s;
    if (!i) return this;
    for (e = e.split(t), r = this.__callbacks || (this.__callbacks = {}); a = e.shift(); ) s = r[a] || (r[a] = []), 
    i.__once = !0, i.__context = n, s[s.length] = i;
    return this;
  }, e.prototype.off = function(e, n, r) {
    var a, s, o, l, c;
    if (!(a = this.__callbacks)) return this;
    if (!(e || n || r)) return delete this.__callbacks, this;
    for (e = e.split(t) || i(a); s = e.shift(); ) if (o = a[s]) if (n || r) for (l = o.length - 1; l; --l) c = o[l], 
    n && c !== n || r && c.__context !== r || o.splice(l, 1); else delete a[s];
    return this;
  }, e.prototype.emit = function(e) {
    var i, n, r, a, s, o, l, c, d = [];
    if (!(i = this.__callbacks)) return this;
    for (e = e.split(t), s = arguments.length - 1; s; --s) d[s - 1] = arguments[s];
    for ((r = i.call) && (l = [ 0 ].concat(d)); n = e.shift(); ) {
      if (a = i[n]) for (s = 0, o = a.length; o > s; ++s) c = a[s], c.apply(c.__context || this, d), 
      c.__once && (a.splice(s--, 1), o--);
      if (a && r) for (l[0] = n, s = 0, o = r.length; o > s; ++s) c = r[s], c.apply(c.__context || this, l);
    }
    return this;
  }, e;
}), define("base", function(e) {
  "use strict";
  function t(e) {
    return "[object Function]" === o.call(e);
  }
  function i(e) {
    return e && "[object Object]" === o.call(e) && "isPrototypeOf" in e;
  }
  function n(e, t) {
    var r, a;
    for (r in t) a = t[r], l(a) ? a = a.slice() : i(a) && (a = n(e[r] || {}, a)), e[r] = a;
    return e;
  }
  function r(e) {
    return e[2].toLowerCase() + e.substring(3);
  }
  var a = /^on[A-Z]/, s = Object.__proto__, o = Object.prototype.toString, l = Array.isArray;
  l || (l = function(e) {
    return "[object Array]" === o.call(e);
  });
  var c = e("class"), d = e("emitter");
  return c.create(d, {
    setOptions: function(e) {
      var i, s, o;
      if (this.hasOwnProperty("options") || (this.options = {}), o = this.options, this.constructor.superclass.options && n(o, this.constructor.superclass.options), 
      this.constructor.prototype.options && n(o, this.constructor.prototype.options), 
      e && e.options && n(o, e.options), this.on) for (i in o) s = o[i], t(s) && a.test(i) && (this.on(r(i), s), 
      delete o[i]);
    },
    destory: function() {
      var e;
      for (e in this) this.hasOwnProperty(e) && delete this[e];
      s && (this.__proto__ = s);
    }
  });
}), define("bus", function(e) {
  "use strict";
  var t = e("emitter");
  return new t();
}), define("rex", function() {
  "use strict";
  function e(e, i) {
    return new t(e, i);
  }
  function t(e, t) {
    this._value = e, this._context = t || i, this._chained = !1;
  }
  var i = null, n = Array.prototype, r = Object.prototype, a = r.hasOwnProperty, s = r.toString, o = n.slice, l = n.indexof, c = n.lastIndexOf, d = n.reduce, u = n.reduceRight, h = {};
  h.each = function(e, t, i) {
    var n, r = e.length;
    if (r === +r) for (n = 0; r > n; ++n) n in e && t.call(i, e[n], n, e); else for (n in e) h.has(e, n) && t.call(i, n, e[n], e);
  }, h.map = function(e, t, i) {
    var n, r, a = [], s = e.length;
    if (s === +s) for (n = 0; s > n; ++n) n in e && (a[n] = t.call(i, e[n], n, e)); else {
      r = 0;
      for (n in e) h.has(e, n) && (a[r++] = t.call(i, n, e[n], e));
    }
    return a;
  }, h.some = function(e, t, i) {
    for (var n = 0, r = e.length; r > n; ++n) if (n in e && t.call(i, e[n], n, e)) return !0;
    return !1;
  }, h.every = function(e, t, i) {
    for (var n = 0, r = e.length; r > n; ++n) if (n in e && !t.call(i, e[n], n, e)) return !1;
    return !0;
  }, h.filter = h.select = function(e, t, i) {
    for (var n = [], r = 0, a = 0, s = e.length; s > r; ++r) if (r in e) {
      if (!t.call(i, e[r], r, e)) continue;
      n[a++] = e[r];
    }
    return n;
  }, h.indexOf = l ? function(e, t, i) {
    return e.indexOf(t, isFinite(i) ? i : 0);
  } : function(e, t, i) {
    var n = e.length;
    if (!n) return -1;
    if (i || (i = 0), i > n) return -1;
    for (0 > i && (i = Math.max(0, n + i)); n > i; ++i) if (i in e && e[i] === t) return i;
    return -1;
  }, h.lastIndexOf = c ? function(e, t, i) {
    return e.lastIndexOf(t, isFinite(i) ? i : e.length);
  } : function(e, t, i) {
    var n = e.length;
    if (i = n - 1, !n) return -1;
    for (arguments.length > 1 && (i = Math.min(i, arguments[1])), 0 > i && (i += n); i >= 0; --i) if (i in e && e[i] === t) return i;
    return -1;
  }, h.reduce = d ? function(e, t, i, n) {
    return e.reduce(t, i, n);
  } : function(e, t, i, n) {
    e || (e = []);
    var r = 0, a = e.length;
    if (3 > arguments.length) for (;;) {
      if (r in e) {
        i = e[r++];
        break;
      }
      if (++r >= a) throw new TypeError("Empty array");
    }
    for (;a > r; r++) r in e && (i = t.call(n, i, e[r], r, e));
    return i;
  }, h.reduceRight = u ? function(e, t, i, n) {
    return e.reduce(t, i, n);
  } : function(e, t, i, n) {
    e || (e = []);
    var r = e.length - 1;
    if (3 > arguments.length) for (;;) {
      if (r in e) {
        i = e[r--];
        break;
      }
      if (0 > --r) throw new TypeError("Empty array");
    }
    for (;r >= 0; --r) r in e && (i = t.call(n, i, e[r], r, e));
    return i;
  }, h.find = function(e, t, i) {
    for (var n, r = 0, a = e.length; a > r; ++r) if (r in e && t.call(i, e[r], r, e)) {
      n = e[r];
      break;
    }
    return n;
  }, h.reject = function(e, t, i) {
    for (var n = [], r = 0, a = e.length; a > r; ++r) if (r in e) {
      if (t.call(i, e[r], r, e)) continue;
      n[r++] = e[r];
    }
    return n;
  }, h.toArray = function(e) {
    if (!e) return [];
    if (h.isArray(e)) return e;
    if (e.toArray) return e.toArray();
    if (h.isArgs(e)) return o.call(e);
    var t, i = [], n = 0;
    for (t in e) h.has(e, t) && (i[n++] = e[t]);
    return i;
  }, h.first = function(e) {
    return e[0];
  }, h.last = function(e) {
    return e[e.length - 1];
  }, h.size = function(e) {
    return h.toArray(e).length;
  }, h.compact = function(e) {
    return h.filter(e, function(e) {
      return !!e;
    });
  }, h.flatten = function(e) {
    return h.reduce(e, function(e, t) {
      return h.isArray(t) ? e.concat(h.flatten(t)) : (e[e.length] = t, e);
    }, []);
  }, h.unique = function(e) {
    var t = [], i = e.length - 1, n = 0;
    e: for (;i >= 0; --i) {
      for (;t.length > n; ++n) if (t[n] === e[i]) continue e;
      t[t.length] = e[i];
    }
    return t;
  }, h.merge = function(e, t) {
    var i, n = e.length, r = 0;
    if (isFinite(t.length)) for (i = t.length; i > r; r++) e[n++] = t[r]; else for (;void 0 !== t[r]; ) e[n++] = t[r++];
    return e.length = n, e;
  }, h.inArray = function(e, t) {
    return !!~h.indexOf(e, t);
  }, h.compose = function() {
    function e() {
      for (t = arguments; n >= 0; --n) t = [ i[n].apply(this, t) ];
      return t[0];
    }
    var t, i = arguments, n = i.length;
    return e;
  }, h.has = function(e, t) {
    return a.call(e, t);
  }, h.keys = Object.keys || function(e) {
    var t, i = [], n = 0;
    for (t in e) h.has(e, t) && (i[n++] = t);
    return i;
  }, h.values = function(e) {
    var t, i = [], n = 0;
    for (t in e) h.has(e, t) && (i[n++] = e[t]);
    return i;
  }, h.extend = function() {}, h.mixin = function(e, t) {
    var i;
    for (i in t) e[i] = t[i];
  }, h.tap = function(e, t) {
    var i;
    return t && (i = t(e)), i ? i : e;
  }, h.nextTick = function(e) {
    setTimeout(e, 0);
  }, h.countDown = function(e, t) {
    function i() {
      0 === --e && t();
    }
    return i;
  }, h.isFunction = function(e) {
    return "function" == typeof e;
  }, h.isString = function(e) {
    return "[object String]" === s.call(e);
  }, h.isElement = function(e) {
    return !(!e || !e.nodeType || 1 != e.nodeType);
  }, h.isArray = Array.isArray || function(e) {
    return e instanceof Array;
  }, h.isArrayLike = function(e) {
    return e && e.length && isFinite(e.length);
  }, h.isObject = function(e) {
    return e instanceof Object && !h.isFunction(e) && !h.isArray(e);
  }, h.isDate = function(e) {
    return !!(e && e.getTimezoneOffset && e.setUTCFullYear);
  }, h.isRegex = function(e) {
    return !(!(e && e.test && e.exec) || !e.ignoreCase && e.ignoreCase !== !1);
  }, h.isUndefined = function(e) {
    return e === void 0;
  }, h.isDefined = function(e) {
    return e !== void 0;
  }, h.isNaN = function(e) {
    return e !== e;
  }, h.isNull = function(e) {
    return null === e;
  }, h.isNumber = function(e) {
    return "[object Number]" === s.call(e);
  }, h.isBoolean = function(e) {
    return e === !0 || e === !1;
  }, h.isArgs = function(e) {
    return !(!e || !h.has(e, "callee"));
  }, h.isEmpty = function(e) {
    return h.isArray(e) ? 0 === e.length : h.isObject(e) ? function() {
      for (var t in e) {
        t = 1;
        break;
      }
      return !!t;
    }() : "" === e;
  }, e.chain = function(e, i) {
    return new t(e, i).chain();
  }, h.mixin(e, h);
  var p = t.prototype;
  return p.constructor = t, p.chain = function() {
    return this._chained = !0, this;
  }, p.value = function() {
    return this._value;
  }, e.each(h.keys(h), function(t, i) {
    i = e[t], p[t] = function() {
      for (var e = 0, t = this._value, n = arguments.length, r = [ t ]; n > e; ++e) r[e + 1] = arguments[e];
      return t = i.apply(this._context, r), this._value = t, this._chained ? this : t;
    };
  }), e;
}), function(e, t) {
  function i(e) {
    var t = ft[e] = {};
    return Z.each(e.split(tt), function(e, i) {
      t[i] = !0;
    }), t;
  }
  function n(e, i, n) {
    if (n === t && 1 === e.nodeType) {
      var r = "data-" + i.replace(gt, "-$1").toLowerCase();
      if (n = e.getAttribute(r), "string" == typeof n) {
        try {
          n = "true" === n ? !0 : "false" === n ? !1 : "null" === n ? null : +n + "" === n ? +n : mt.test(n) ? Z.parseJSON(n) : n;
        } catch (a) {}
        Z.data(e, i, n);
      } else n = t;
    }
    return n;
  }
  function r(e) {
    var t;
    for (t in e) if (("data" !== t || !Z.isEmptyObject(e[t])) && "toJSON" !== t) return !1;
    return !0;
  }
  function a() {
    return !1;
  }
  function s() {
    return !0;
  }
  function o(e) {
    return !e || !e.parentNode || 11 === e.parentNode.nodeType;
  }
  function l(e, t) {
    do e = e[t]; while (e && 1 !== e.nodeType);
    return e;
  }
  function c(e, t, i) {
    if (t = t || 0, Z.isFunction(t)) return Z.grep(e, function(e, n) {
      var r = !!t.call(e, n, e);
      return r === i;
    });
    if (t.nodeType) return Z.grep(e, function(e) {
      return e === t === i;
    });
    if ("string" == typeof t) {
      var n = Z.grep(e, function(e) {
        return 1 === e.nodeType;
      });
      if (Lt.test(t)) return Z.filter(t, n, !i);
      t = Z.filter(t, n);
    }
    return Z.grep(e, function(e) {
      return Z.inArray(e, t) >= 0 === i;
    });
  }
  function d(e) {
    var t = Rt.split("|"), i = e.createDocumentFragment();
    if (i.createElement) for (;t.length; ) i.createElement(t.pop());
    return i;
  }
  function u(e, t) {
    return e.getElementsByTagName(t)[0] || e.appendChild(e.ownerDocument.createElement(t));
  }
  function h(e, t) {
    if (1 === t.nodeType && Z.hasData(e)) {
      var i, n, r, a = Z._data(e), s = Z._data(t, a), o = a.events;
      if (o) {
        delete s.handle, s.events = {};
        for (i in o) for (n = 0, r = o[i].length; r > n; n++) Z.event.add(t, i, o[i][n]);
      }
      s.data && (s.data = Z.extend({}, s.data));
    }
  }
  function p(e, t) {
    var i;
    1 === t.nodeType && (t.clearAttributes && t.clearAttributes(), t.mergeAttributes && t.mergeAttributes(e), 
    i = t.nodeName.toLowerCase(), "object" === i ? (t.parentNode && (t.outerHTML = e.outerHTML), 
    Z.support.html5Clone && e.innerHTML && !Z.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : "input" === i && Gt.test(e.type) ? (t.defaultChecked = t.checked = e.checked, 
    t.value !== e.value && (t.value = e.value)) : "option" === i ? t.selected = e.defaultSelected : "input" === i || "textarea" === i ? t.defaultValue = e.defaultValue : "script" === i && t.text !== e.text && (t.text = e.text), 
    t.removeAttribute(Z.expando));
  }
  function f(e) {
    return e.getElementsByTagName !== t ? e.getElementsByTagName("*") : e.querySelectorAll !== t ? e.querySelectorAll("*") : [];
  }
  function m(e) {
    Gt.test(e.type) && (e.defaultChecked = e.checked);
  }
  function g(e, t) {
    if (t in e) return t;
    for (var i = t.charAt(0).toUpperCase() + t.slice(1), n = t, r = vi.length; r--; ) if (t = vi[r] + i, 
    t in e) return t;
    return n;
  }
  function v(e, t) {
    return e = t || e, "none" === Z.css(e, "display") || !Z.contains(e.ownerDocument, e);
  }
  function y(e, t) {
    for (var i, n, r = [], a = 0, s = e.length; s > a; a++) i = e[a], i.style && (r[a] = Z._data(i, "olddisplay"), 
    t ? (r[a] || "none" !== i.style.display || (i.style.display = ""), "" === i.style.display && v(i) && (r[a] = Z._data(i, "olddisplay", w(i.nodeName)))) : (n = ii(i, "display"), 
    r[a] || "none" === n || Z._data(i, "olddisplay", n)));
    for (a = 0; s > a; a++) i = e[a], i.style && (t && "none" !== i.style.display && "" !== i.style.display || (i.style.display = t ? r[a] || "" : "none"));
    return e;
  }
  function _(e, t, i) {
    var n = di.exec(t);
    return n ? Math.max(0, n[1] - (i || 0)) + (n[2] || "px") : t;
  }
  function b(e, t, i, n) {
    for (var r = i === (n ? "border" : "content") ? 4 : "width" === t ? 1 : 0, a = 0; 4 > r; r += 2) "margin" === i && (a += Z.css(e, i + gi[r], !0)), 
    n ? ("content" === i && (a -= parseFloat(ii(e, "padding" + gi[r])) || 0), "margin" !== i && (a -= parseFloat(ii(e, "border" + gi[r] + "Width")) || 0)) : (a += parseFloat(ii(e, "padding" + gi[r])) || 0, 
    "padding" !== i && (a += parseFloat(ii(e, "border" + gi[r] + "Width")) || 0));
    return a;
  }
  function x(e, t, i) {
    var n = "width" === t ? e.offsetWidth : e.offsetHeight, r = !0, a = Z.support.boxSizing && "border-box" === Z.css(e, "boxSizing");
    if (0 >= n || null == n) {
      if (n = ii(e, t), (0 > n || null == n) && (n = e.style[t]), ui.test(n)) return n;
      r = a && (Z.support.boxSizingReliable || n === e.style[t]), n = parseFloat(n) || 0;
    }
    return n + b(e, t, i || (a ? "border" : "content"), r) + "px";
  }
  function w(e) {
    if (pi[e]) return pi[e];
    var t = Z("<" + e + ">").appendTo(j.body), i = t.css("display");
    return t.remove(), ("none" === i || "" === i) && (ni = j.body.appendChild(ni || Z.extend(j.createElement("iframe"), {
      frameBorder: 0,
      width: 0,
      height: 0
    })), ri && ni.createElement || (ri = (ni.contentWindow || ni.contentDocument).document, 
    ri.write("<!doctype html><html><body>"), ri.close()), t = ri.body.appendChild(ri.createElement(e)), 
    i = ii(t, "display"), j.body.removeChild(ni)), pi[e] = i, i;
  }
  function k(e, t, i, n) {
    var r;
    if (Z.isArray(t)) Z.each(t, function(t, r) {
      i || bi.test(e) ? n(e, r) : k(e + "[" + ("object" == typeof r ? t : "") + "]", r, i, n);
    }); else if (i || "object" !== Z.type(t)) n(e, t); else for (r in t) k(e + "[" + r + "]", t[r], i, n);
  }
  function C(e) {
    return function(t, i) {
      "string" != typeof t && (i = t, t = "*");
      var n, r, a, s = t.toLowerCase().split(tt), o = 0, l = s.length;
      if (Z.isFunction(i)) for (;l > o; o++) n = s[o], a = /^\+/.test(n), a && (n = n.substr(1) || "*"), 
      r = e[n] = e[n] || [], r[a ? "unshift" : "push"](i);
    };
  }
  function E(e, i, n, r, a, s) {
    a = a || i.dataTypes[0], s = s || {}, s[a] = !0;
    for (var o, l = e[a], c = 0, d = l ? l.length : 0, u = e === Li; d > c && (u || !o); c++) o = l[c](i, n, r), 
    "string" == typeof o && (!u || s[o] ? o = t : (i.dataTypes.unshift(o), o = E(e, i, n, r, o, s)));
    return !u && o || s["*"] || (o = E(e, i, n, r, "*", s)), o;
  }
  function T(e, i) {
    var n, r, a = Z.ajaxSettings.flatOptions || {};
    for (n in i) i[n] !== t && ((a[n] ? e : r || (r = {}))[n] = i[n]);
    r && Z.extend(!0, e, r);
  }
  function $(e, i, n) {
    var r, a, s, o, l = e.contents, c = e.dataTypes, d = e.responseFields;
    for (a in d) a in n && (i[d[a]] = n[a]);
    for (;"*" === c[0]; ) c.shift(), r === t && (r = e.mimeType || i.getResponseHeader("content-type"));
    if (r) for (a in l) if (l[a] && l[a].test(r)) {
      c.unshift(a);
      break;
    }
    if (c[0] in n) s = c[0]; else {
      for (a in n) {
        if (!c[0] || e.converters[a + " " + c[0]]) {
          s = a;
          break;
        }
        o || (o = a);
      }
      s = s || o;
    }
    return s ? (s !== c[0] && c.unshift(s), n[s]) : t;
  }
  function M(e, t) {
    var i, n, r, a, s = e.dataTypes.slice(), o = s[0], l = {}, c = 0;
    if (e.dataFilter && (t = e.dataFilter(t, e.dataType)), s[1]) for (i in e.converters) l[i.toLowerCase()] = e.converters[i];
    for (;r = s[++c]; ) if ("*" !== r) {
      if ("*" !== o && o !== r) {
        if (i = l[o + " " + r] || l["* " + r], !i) for (n in l) if (a = n.split(" "), a[1] === r && (i = l[o + " " + a[0]] || l["* " + a[0]])) {
          i === !0 ? i = l[n] : l[n] !== !0 && (r = a[0], s.splice(c--, 0, r));
          break;
        }
        if (i !== !0) if (i && e["throws"]) t = i(t); else try {
          t = i(t);
        } catch (d) {
          return {
            state: "parsererror",
            error: i ? d : "No conversion from " + o + " to " + r
          };
        }
      }
      o = r;
    }
    return {
      state: "success",
      data: t
    };
  }
  function S() {
    try {
      return new e.XMLHttpRequest();
    } catch (t) {}
  }
  function I() {
    try {
      return new e.ActiveXObject("Microsoft.XMLHTTP");
    } catch (t) {}
  }
  function N() {
    return setTimeout(function() {
      Yi = t;
    }, 0), Yi = Z.now();
  }
  function D(e, t) {
    Z.each(t, function(t, i) {
      for (var n = (Qi[t] || []).concat(Qi["*"]), r = 0, a = n.length; a > r; r++) if (n[r].call(e, t, i)) return;
    });
  }
  function A(e, t, i) {
    var n, r = 0, a = Zi.length, s = Z.Deferred().always(function() {
      delete o.elem;
    }), o = function() {
      for (var t = Yi || N(), i = Math.max(0, l.startTime + l.duration - t), n = 1 - (i / l.duration || 0), r = 0, a = l.tweens.length; a > r; r++) l.tweens[r].run(n);
      return s.notifyWith(e, [ l, n, i ]), 1 > n && a ? i : (s.resolveWith(e, [ l ]), 
      !1);
    }, l = s.promise({
      elem: e,
      props: Z.extend({}, t),
      opts: Z.extend(!0, {
        specialEasing: {}
      }, i),
      originalProperties: t,
      originalOptions: i,
      startTime: Yi || N(),
      duration: i.duration,
      tweens: [],
      createTween: function(t, i) {
        var n = Z.Tween(e, l.opts, t, i, l.opts.specialEasing[t] || l.opts.easing);
        return l.tweens.push(n), n;
      },
      stop: function(t) {
        for (var i = 0, n = t ? l.tweens.length : 0; n > i; i++) l.tweens[i].run(1);
        return t ? s.resolveWith(e, [ l, t ]) : s.rejectWith(e, [ l, t ]), this;
      }
    }), c = l.props;
    for (P(c, l.opts.specialEasing); a > r; r++) if (n = Zi[r].call(l, e, c, l.opts)) return n;
    return D(l, c), Z.isFunction(l.opts.start) && l.opts.start.call(e, l), Z.fx.timer(Z.extend(o, {
      anim: l,
      queue: l.opts.queue,
      elem: e
    })), l.progress(l.opts.progress).done(l.opts.done, l.opts.complete).fail(l.opts.fail).always(l.opts.always);
  }
  function P(e, t) {
    var i, n, r, a, s;
    for (i in e) if (n = Z.camelCase(i), r = t[n], a = e[i], Z.isArray(a) && (r = a[1], 
    a = e[i] = a[0]), i !== n && (e[n] = a, delete e[i]), s = Z.cssHooks[n], s && "expand" in s) {
      a = s.expand(a), delete e[n];
      for (i in a) i in e || (e[i] = a[i], t[i] = r);
    } else t[n] = r;
  }
  function O(e, t, i) {
    var n, r, a, s, o, l, c, d, u = this, h = e.style, p = {}, f = [], m = e.nodeType && v(e);
    i.queue || (c = Z._queueHooks(e, "fx"), null == c.unqueued && (c.unqueued = 0, d = c.empty.fire, 
    c.empty.fire = function() {
      c.unqueued || d();
    }), c.unqueued++, u.always(function() {
      u.always(function() {
        c.unqueued--, Z.queue(e, "fx").length || c.empty.fire();
      });
    })), 1 === e.nodeType && ("height" in t || "width" in t) && (i.overflow = [ h.overflow, h.overflowX, h.overflowY ], 
    "inline" === Z.css(e, "display") && "none" === Z.css(e, "float") && (Z.support.inlineBlockNeedsLayout && "inline" !== w(e.nodeName) ? h.zoom = 1 : h.display = "inline-block")), 
    i.overflow && (h.overflow = "hidden", Z.support.shrinkWrapBlocks || u.done(function() {
      h.overflow = i.overflow[0], h.overflowX = i.overflow[1], h.overflowY = i.overflow[2];
    }));
    for (n in t) if (a = t[n], Gi.exec(a)) {
      if (delete t[n], a === (m ? "hide" : "show")) continue;
      f.push(n);
    }
    if (s = f.length) for (o = Z._data(e, "fxshow") || Z._data(e, "fxshow", {}), m ? Z(e).show() : u.done(function() {
      Z(e).hide();
    }), u.done(function() {
      var t;
      Z.removeData(e, "fxshow", !0);
      for (t in p) Z.style(e, t, p[t]);
    }), n = 0; s > n; n++) r = f[n], l = u.createTween(r, m ? o[r] : 0), p[r] = o[r] || Z.style(e, r), 
    r in o || (o[r] = l.start, m && (l.end = l.start, l.start = "width" === r || "height" === r ? 1 : 0));
  }
  function L(e, t, i, n, r) {
    return new L.prototype.init(e, t, i, n, r);
  }
  function z(e, t) {
    var i, n = {
      height: e
    }, r = 0;
    for (t = t ? 1 : 0; 4 > r; r += 2 - t) i = gi[r], n["margin" + i] = n["padding" + i] = e;
    return t && (n.opacity = n.width = e), n;
  }
  function H(e) {
    return Z.isWindow(e) ? e : 9 === e.nodeType ? e.defaultView || e.parentWindow : !1;
  }
  var R, F, j = e.document, q = e.location, U = e.navigator, B = e.jQuery, W = e.$, X = Array.prototype.push, Y = Array.prototype.slice, V = Array.prototype.indexOf, G = Object.prototype.toString, K = Object.prototype.hasOwnProperty, J = String.prototype.trim, Z = function(e, t) {
    return new Z.fn.init(e, t, R);
  }, Q = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source, et = /\S/, tt = /\s+/, it = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, nt = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/, rt = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, at = /^[\],:{}\s]*$/, st = /(?:^|:|,)(?:\s*\[)+/g, ot = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, lt = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g, ct = /^-ms-/, dt = /-([\da-z])/gi, ut = function(e, t) {
    return (t + "").toUpperCase();
  }, ht = function() {
    j.addEventListener ? (j.removeEventListener("DOMContentLoaded", ht, !1), Z.ready()) : "complete" === j.readyState && (j.detachEvent("onreadystatechange", ht), 
    Z.ready());
  }, pt = {};
  Z.fn = Z.prototype = {
    constructor: Z,
    init: function(e, i, n) {
      var r, a, s;
      if (!e) return this;
      if (e.nodeType) return this.context = this[0] = e, this.length = 1, this;
      if ("string" == typeof e) {
        if (r = "<" === e.charAt(0) && ">" === e.charAt(e.length - 1) && e.length >= 3 ? [ null, e, null ] : nt.exec(e), 
        !r || !r[1] && i) return !i || i.jquery ? (i || n).find(e) : this.constructor(i).find(e);
        if (r[1]) return i = i instanceof Z ? i[0] : i, s = i && i.nodeType ? i.ownerDocument || i : j, 
        e = Z.parseHTML(r[1], s, !0), rt.test(r[1]) && Z.isPlainObject(i) && this.attr.call(e, i, !0), 
        Z.merge(this, e);
        if (a = j.getElementById(r[2]), a && a.parentNode) {
          if (a.id !== r[2]) return n.find(e);
          this.length = 1, this[0] = a;
        }
        return this.context = j, this.selector = e, this;
      }
      return Z.isFunction(e) ? n.ready(e) : (e.selector !== t && (this.selector = e.selector, 
      this.context = e.context), Z.makeArray(e, this));
    },
    selector: "",
    jquery: "1.8.2",
    length: 0,
    size: function() {
      return this.length;
    },
    toArray: function() {
      return Y.call(this);
    },
    get: function(e) {
      return null == e ? this.toArray() : 0 > e ? this[this.length + e] : this[e];
    },
    pushStack: function(e, t, i) {
      var n = Z.merge(this.constructor(), e);
      return n.prevObject = this, n.context = this.context, "find" === t ? n.selector = this.selector + (this.selector ? " " : "") + i : t && (n.selector = this.selector + "." + t + "(" + i + ")"), 
      n;
    },
    each: function(e, t) {
      return Z.each(this, e, t);
    },
    ready: function(e) {
      return Z.ready.promise().done(e), this;
    },
    eq: function(e) {
      return e = +e, -1 === e ? this.slice(e) : this.slice(e, e + 1);
    },
    first: function() {
      return this.eq(0);
    },
    last: function() {
      return this.eq(-1);
    },
    slice: function() {
      return this.pushStack(Y.apply(this, arguments), "slice", Y.call(arguments).join(","));
    },
    map: function(e) {
      return this.pushStack(Z.map(this, function(t, i) {
        return e.call(t, i, t);
      }));
    },
    end: function() {
      return this.prevObject || this.constructor(null);
    },
    push: X,
    sort: [].sort,
    splice: [].splice
  }, Z.fn.init.prototype = Z.fn, Z.extend = Z.fn.extend = function() {
    var e, i, n, r, a, s, o = arguments[0] || {}, l = 1, c = arguments.length, d = !1;
    for ("boolean" == typeof o && (d = o, o = arguments[1] || {}, l = 2), "object" == typeof o || Z.isFunction(o) || (o = {}), 
    c === l && (o = this, --l); c > l; l++) if (null != (e = arguments[l])) for (i in e) n = o[i], 
    r = e[i], o !== r && (d && r && (Z.isPlainObject(r) || (a = Z.isArray(r))) ? (a ? (a = !1, 
    s = n && Z.isArray(n) ? n : []) : s = n && Z.isPlainObject(n) ? n : {}, o[i] = Z.extend(d, s, r)) : r !== t && (o[i] = r));
    return o;
  }, Z.extend({
    noConflict: function(t) {
      return e.$ === Z && (e.$ = W), t && e.jQuery === Z && (e.jQuery = B), Z;
    },
    isReady: !1,
    readyWait: 1,
    holdReady: function(e) {
      e ? Z.readyWait++ : Z.ready(!0);
    },
    ready: function(e) {
      if (e === !0 ? !--Z.readyWait : !Z.isReady) {
        if (!j.body) return setTimeout(Z.ready, 1);
        Z.isReady = !0, e !== !0 && --Z.readyWait > 0 || (F.resolveWith(j, [ Z ]), Z.fn.trigger && Z(j).trigger("ready").off("ready"));
      }
    },
    isFunction: function(e) {
      return "function" === Z.type(e);
    },
    isArray: Array.isArray || function(e) {
      return "array" === Z.type(e);
    },
    isWindow: function(e) {
      return null != e && e == e.window;
    },
    isNumeric: function(e) {
      return !isNaN(parseFloat(e)) && isFinite(e);
    },
    type: function(e) {
      return null == e ? e + "" : pt[G.call(e)] || "object";
    },
    isPlainObject: function(e) {
      if (!e || "object" !== Z.type(e) || e.nodeType || Z.isWindow(e)) return !1;
      try {
        if (e.constructor && !K.call(e, "constructor") && !K.call(e.constructor.prototype, "isPrototypeOf")) return !1;
      } catch (i) {
        return !1;
      }
      var n;
      for (n in e) ;
      return n === t || K.call(e, n);
    },
    isEmptyObject: function(e) {
      var t;
      for (t in e) return !1;
      return !0;
    },
    error: function(e) {
      throw Error(e);
    },
    parseHTML: function(e, t, i) {
      var n;
      return e && "string" == typeof e ? ("boolean" == typeof t && (i = t, t = 0), t = t || j, 
      (n = rt.exec(e)) ? [ t.createElement(n[1]) ] : (n = Z.buildFragment([ e ], t, i ? null : []), 
      Z.merge([], (n.cacheable ? Z.clone(n.fragment) : n.fragment).childNodes))) : null;
    },
    parseJSON: function(i) {
      return i && "string" == typeof i ? (i = Z.trim(i), e.JSON && e.JSON.parse ? e.JSON.parse(i) : at.test(i.replace(ot, "@").replace(lt, "]").replace(st, "")) ? Function("return " + i)() : (Z.error("Invalid JSON: " + i), 
      t)) : null;
    },
    parseXML: function(i) {
      var n, r;
      if (!i || "string" != typeof i) return null;
      try {
        e.DOMParser ? (r = new DOMParser(), n = r.parseFromString(i, "text/xml")) : (n = new ActiveXObject("Microsoft.XMLDOM"), 
        n.async = "false", n.loadXML(i));
      } catch (a) {
        n = t;
      }
      return n && n.documentElement && !n.getElementsByTagName("parsererror").length || Z.error("Invalid XML: " + i), 
      n;
    },
    noop: function() {},
    globalEval: function(t) {
      t && et.test(t) && (e.execScript || function(t) {
        e.eval.call(e, t);
      })(t);
    },
    camelCase: function(e) {
      return e.replace(ct, "ms-").replace(dt, ut);
    },
    nodeName: function(e, t) {
      return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase();
    },
    each: function(e, i, n) {
      var r, a = 0, s = e.length, o = s === t || Z.isFunction(e);
      if (n) if (o) {
        for (r in e) if (i.apply(e[r], n) === !1) break;
      } else for (;s > a && i.apply(e[a++], n) !== !1; ) ; else if (o) {
        for (r in e) if (i.call(e[r], r, e[r]) === !1) break;
      } else for (;s > a && i.call(e[a], a, e[a++]) !== !1; ) ;
      return e;
    },
    trim: J && !J.call("﻿ ") ? function(e) {
      return null == e ? "" : J.call(e);
    } : function(e) {
      return null == e ? "" : (e + "").replace(it, "");
    },
    makeArray: function(e, t) {
      var i, n = t || [];
      return null != e && (i = Z.type(e), null == e.length || "string" === i || "function" === i || "regexp" === i || Z.isWindow(e) ? X.call(n, e) : Z.merge(n, e)), 
      n;
    },
    inArray: function(e, t, i) {
      var n;
      if (t) {
        if (V) return V.call(t, e, i);
        for (n = t.length, i = i ? 0 > i ? Math.max(0, n + i) : i : 0; n > i; i++) if (i in t && t[i] === e) return i;
      }
      return -1;
    },
    merge: function(e, i) {
      var n = i.length, r = e.length, a = 0;
      if ("number" == typeof n) for (;n > a; a++) e[r++] = i[a]; else for (;i[a] !== t; ) e[r++] = i[a++];
      return e.length = r, e;
    },
    grep: function(e, t, i) {
      var n, r = [], a = 0, s = e.length;
      for (i = !!i; s > a; a++) n = !!t(e[a], a), i !== n && r.push(e[a]);
      return r;
    },
    map: function(e, i, n) {
      var r, a, s = [], o = 0, l = e.length, c = e instanceof Z || l !== t && "number" == typeof l && (l > 0 && e[0] && e[l - 1] || 0 === l || Z.isArray(e));
      if (c) for (;l > o; o++) r = i(e[o], o, n), null != r && (s[s.length] = r); else for (a in e) r = i(e[a], a, n), 
      null != r && (s[s.length] = r);
      return s.concat.apply([], s);
    },
    guid: 1,
    proxy: function(e, i) {
      var n, r, a;
      return "string" == typeof i && (n = e[i], i = e, e = n), Z.isFunction(e) ? (r = Y.call(arguments, 2), 
      a = function() {
        return e.apply(i, r.concat(Y.call(arguments)));
      }, a.guid = e.guid = e.guid || Z.guid++, a) : t;
    },
    access: function(e, i, n, r, a, s, o) {
      var l, c = null == n, d = 0, u = e.length;
      if (n && "object" == typeof n) {
        for (d in n) Z.access(e, i, d, n[d], 1, s, r);
        a = 1;
      } else if (r !== t) {
        if (l = o === t && Z.isFunction(r), c && (l ? (l = i, i = function(e, t, i) {
          return l.call(Z(e), i);
        }) : (i.call(e, r), i = null)), i) for (;u > d; d++) i(e[d], n, l ? r.call(e[d], d, i(e[d], n)) : r, o);
        a = 1;
      }
      return a ? e : c ? i.call(e) : u ? i(e[0], n) : s;
    },
    now: function() {
      return new Date().getTime();
    }
  }), Z.ready.promise = function(t) {
    if (!F) if (F = Z.Deferred(), "complete" === j.readyState) setTimeout(Z.ready, 1); else if (j.addEventListener) j.addEventListener("DOMContentLoaded", ht, !1), 
    e.addEventListener("load", Z.ready, !1); else {
      j.attachEvent("onreadystatechange", ht), e.attachEvent("onload", Z.ready);
      var i = !1;
      try {
        i = null == e.frameElement && j.documentElement;
      } catch (n) {}
      i && i.doScroll && function r() {
        if (!Z.isReady) {
          try {
            i.doScroll("left");
          } catch (e) {
            return setTimeout(r, 50);
          }
          Z.ready();
        }
      }();
    }
    return F.promise(t);
  }, Z.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(e, t) {
    pt["[object " + t + "]"] = t.toLowerCase();
  }), R = Z(j);
  var ft = {};
  Z.Callbacks = function(e) {
    e = "string" == typeof e ? ft[e] || i(e) : Z.extend({}, e);
    var n, r, a, s, o, l, c = [], d = !e.once && [], u = function(t) {
      for (n = e.memory && t, r = !0, l = s || 0, s = 0, o = c.length, a = !0; c && o > l; l++) if (c[l].apply(t[0], t[1]) === !1 && e.stopOnFalse) {
        n = !1;
        break;
      }
      a = !1, c && (d ? d.length && u(d.shift()) : n ? c = [] : h.disable());
    }, h = {
      add: function() {
        if (c) {
          var t = c.length;
          (function i(t) {
            Z.each(t, function(t, n) {
              var r = Z.type(n);
              "function" !== r || e.unique && h.has(n) ? n && n.length && "string" !== r && i(n) : c.push(n);
            });
          })(arguments), a ? o = c.length : n && (s = t, u(n));
        }
        return this;
      },
      remove: function() {
        return c && Z.each(arguments, function(e, t) {
          for (var i; (i = Z.inArray(t, c, i)) > -1; ) c.splice(i, 1), a && (o >= i && o--, 
          l >= i && l--);
        }), this;
      },
      has: function(e) {
        return Z.inArray(e, c) > -1;
      },
      empty: function() {
        return c = [], this;
      },
      disable: function() {
        return c = d = n = t, this;
      },
      disabled: function() {
        return !c;
      },
      lock: function() {
        return d = t, n || h.disable(), this;
      },
      locked: function() {
        return !d;
      },
      fireWith: function(e, t) {
        return t = t || [], t = [ e, t.slice ? t.slice() : t ], !c || r && !d || (a ? d.push(t) : u(t)), 
        this;
      },
      fire: function() {
        return h.fireWith(this, arguments), this;
      },
      fired: function() {
        return !!r;
      }
    };
    return h;
  }, Z.extend({
    Deferred: function(e) {
      var t = [ [ "resolve", "done", Z.Callbacks("once memory"), "resolved" ], [ "reject", "fail", Z.Callbacks("once memory"), "rejected" ], [ "notify", "progress", Z.Callbacks("memory") ] ], i = "pending", n = {
        state: function() {
          return i;
        },
        always: function() {
          return r.done(arguments).fail(arguments), this;
        },
        then: function() {
          var e = arguments;
          return Z.Deferred(function(i) {
            Z.each(t, function(t, n) {
              var a = n[0], s = e[t];
              r[n[1]](Z.isFunction(s) ? function() {
                var e = s.apply(this, arguments);
                e && Z.isFunction(e.promise) ? e.promise().done(i.resolve).fail(i.reject).progress(i.notify) : i[a + "With"](this === r ? i : this, [ e ]);
              } : i[a]);
            }), e = null;
          }).promise();
        },
        promise: function(e) {
          return null != e ? Z.extend(e, n) : n;
        }
      }, r = {};
      return n.pipe = n.then, Z.each(t, function(e, a) {
        var s = a[2], o = a[3];
        n[a[1]] = s.add, o && s.add(function() {
          i = o;
        }, t[1 ^ e][2].disable, t[2][2].lock), r[a[0]] = s.fire, r[a[0] + "With"] = s.fireWith;
      }), n.promise(r), e && e.call(r, r), r;
    },
    when: function(e) {
      var t, i, n, r = 0, a = Y.call(arguments), s = a.length, o = 1 !== s || e && Z.isFunction(e.promise) ? s : 0, l = 1 === o ? e : Z.Deferred(), c = function(e, i, n) {
        return function(r) {
          i[e] = this, n[e] = arguments.length > 1 ? Y.call(arguments) : r, n === t ? l.notifyWith(i, n) : --o || l.resolveWith(i, n);
        };
      };
      if (s > 1) for (t = Array(s), i = Array(s), n = Array(s); s > r; r++) a[r] && Z.isFunction(a[r].promise) ? a[r].promise().done(c(r, n, a)).fail(l.reject).progress(c(r, i, t)) : --o;
      return o || l.resolveWith(n, a), l.promise();
    }
  }), Z.support = function() {
    var i, n, r, a, s, o, l, c, d, u, h, p = j.createElement("div");
    if (p.setAttribute("className", "t"), p.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", 
    n = p.getElementsByTagName("*"), r = p.getElementsByTagName("a")[0], r.style.cssText = "top:1px;float:left;opacity:.5", 
    !n || !n.length) return {};
    a = j.createElement("select"), s = a.appendChild(j.createElement("option")), o = p.getElementsByTagName("input")[0], 
    i = {
      leadingWhitespace: 3 === p.firstChild.nodeType,
      tbody: !p.getElementsByTagName("tbody").length,
      htmlSerialize: !!p.getElementsByTagName("link").length,
      style: /top/.test(r.getAttribute("style")),
      hrefNormalized: "/a" === r.getAttribute("href"),
      opacity: /^0.5/.test(r.style.opacity),
      cssFloat: !!r.style.cssFloat,
      checkOn: "on" === o.value,
      optSelected: s.selected,
      getSetAttribute: "t" !== p.className,
      enctype: !!j.createElement("form").enctype,
      html5Clone: "<:nav></:nav>" !== j.createElement("nav").cloneNode(!0).outerHTML,
      boxModel: "CSS1Compat" === j.compatMode,
      submitBubbles: !0,
      changeBubbles: !0,
      focusinBubbles: !1,
      deleteExpando: !0,
      noCloneEvent: !0,
      inlineBlockNeedsLayout: !1,
      shrinkWrapBlocks: !1,
      reliableMarginRight: !0,
      boxSizingReliable: !0,
      pixelPosition: !1
    }, o.checked = !0, i.noCloneChecked = o.cloneNode(!0).checked, a.disabled = !0, 
    i.optDisabled = !s.disabled;
    try {
      delete p.test;
    } catch (f) {
      i.deleteExpando = !1;
    }
    if (!p.addEventListener && p.attachEvent && p.fireEvent && (p.attachEvent("onclick", h = function() {
      i.noCloneEvent = !1;
    }), p.cloneNode(!0).fireEvent("onclick"), p.detachEvent("onclick", h)), o = j.createElement("input"), 
    o.value = "t", o.setAttribute("type", "radio"), i.radioValue = "t" === o.value, 
    o.setAttribute("checked", "checked"), o.setAttribute("name", "t"), p.appendChild(o), 
    l = j.createDocumentFragment(), l.appendChild(p.lastChild), i.checkClone = l.cloneNode(!0).cloneNode(!0).lastChild.checked, 
    i.appendChecked = o.checked, l.removeChild(o), l.appendChild(p), p.attachEvent) for (d in {
      submit: !0,
      change: !0,
      focusin: !0
    }) c = "on" + d, u = c in p, u || (p.setAttribute(c, "return;"), u = "function" == typeof p[c]), 
    i[d + "Bubbles"] = u;
    return Z(function() {
      var n, r, a, s, o = "padding:0;margin:0;border:0;display:block;overflow:hidden;", l = j.getElementsByTagName("body")[0];
      l && (n = j.createElement("div"), n.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px", 
      l.insertBefore(n, l.firstChild), r = j.createElement("div"), n.appendChild(r), r.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", 
      a = r.getElementsByTagName("td"), a[0].style.cssText = "padding:0;margin:0;border:0;display:none", 
      u = 0 === a[0].offsetHeight, a[0].style.display = "", a[1].style.display = "none", 
      i.reliableHiddenOffsets = u && 0 === a[0].offsetHeight, r.innerHTML = "", r.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", 
      i.boxSizing = 4 === r.offsetWidth, i.doesNotIncludeMarginInBodyOffset = 1 !== l.offsetTop, 
      e.getComputedStyle && (i.pixelPosition = "1%" !== (e.getComputedStyle(r, null) || {}).top, 
      i.boxSizingReliable = "4px" === (e.getComputedStyle(r, null) || {
        width: "4px"
      }).width, s = j.createElement("div"), s.style.cssText = r.style.cssText = o, s.style.marginRight = s.style.width = "0", 
      r.style.width = "1px", r.appendChild(s), i.reliableMarginRight = !parseFloat((e.getComputedStyle(s, null) || {}).marginRight)), 
      r.style.zoom !== t && (r.innerHTML = "", r.style.cssText = o + "width:1px;padding:1px;display:inline;zoom:1", 
      i.inlineBlockNeedsLayout = 3 === r.offsetWidth, r.style.display = "block", r.style.overflow = "visible", 
      r.innerHTML = "<div></div>", r.firstChild.style.width = "5px", i.shrinkWrapBlocks = 3 !== r.offsetWidth, 
      n.style.zoom = 1), l.removeChild(n), n = r = a = s = null);
    }), l.removeChild(p), n = r = a = s = o = l = p = null, i;
  }();
  var mt = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, gt = /([A-Z])/g;
  Z.extend({
    cache: {},
    deletedIds: [],
    uuid: 0,
    expando: "jQuery" + (Z.fn.jquery + Math.random()).replace(/\D/g, ""),
    noData: {
      embed: !0,
      object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
      applet: !0
    },
    hasData: function(e) {
      return e = e.nodeType ? Z.cache[e[Z.expando]] : e[Z.expando], !!e && !r(e);
    },
    data: function(e, i, n, r) {
      if (Z.acceptData(e)) {
        var a, s, o = Z.expando, l = "string" == typeof i, c = e.nodeType, d = c ? Z.cache : e, u = c ? e[o] : e[o] && o;
        if (u && d[u] && (r || d[u].data) || !l || n !== t) return u || (c ? e[o] = u = Z.deletedIds.pop() || Z.guid++ : u = o), 
        d[u] || (d[u] = {}, c || (d[u].toJSON = Z.noop)), ("object" == typeof i || "function" == typeof i) && (r ? d[u] = Z.extend(d[u], i) : d[u].data = Z.extend(d[u].data, i)), 
        a = d[u], r || (a.data || (a.data = {}), a = a.data), n !== t && (a[Z.camelCase(i)] = n), 
        l ? (s = a[i], null == s && (s = a[Z.camelCase(i)])) : s = a, s;
      }
    },
    removeData: function(e, t, i) {
      if (Z.acceptData(e)) {
        var n, a, s, o = e.nodeType, l = o ? Z.cache : e, c = o ? e[Z.expando] : Z.expando;
        if (l[c]) {
          if (t && (n = i ? l[c] : l[c].data)) {
            Z.isArray(t) || (t in n ? t = [ t ] : (t = Z.camelCase(t), t = t in n ? [ t ] : t.split(" ")));
            for (a = 0, s = t.length; s > a; a++) delete n[t[a]];
            if (!(i ? r : Z.isEmptyObject)(n)) return;
          }
          (i || (delete l[c].data, r(l[c]))) && (o ? Z.cleanData([ e ], !0) : Z.support.deleteExpando || l != l.window ? delete l[c] : l[c] = null);
        }
      }
    },
    _data: function(e, t, i) {
      return Z.data(e, t, i, !0);
    },
    acceptData: function(e) {
      var t = e.nodeName && Z.noData[e.nodeName.toLowerCase()];
      return !t || t !== !0 && e.getAttribute("classid") === t;
    }
  }), Z.fn.extend({
    data: function(e, i) {
      var r, a, s, o, l, c = this[0], d = 0, u = null;
      if (e === t) {
        if (this.length && (u = Z.data(c), 1 === c.nodeType && !Z._data(c, "parsedAttrs"))) {
          for (s = c.attributes, l = s.length; l > d; d++) o = s[d].name, o.indexOf("data-") || (o = Z.camelCase(o.substring(5)), 
          n(c, o, u[o]));
          Z._data(c, "parsedAttrs", !0);
        }
        return u;
      }
      return "object" == typeof e ? this.each(function() {
        Z.data(this, e);
      }) : (r = e.split(".", 2), r[1] = r[1] ? "." + r[1] : "", a = r[1] + "!", Z.access(this, function(i) {
        return i === t ? (u = this.triggerHandler("getData" + a, [ r[0] ]), u === t && c && (u = Z.data(c, e), 
        u = n(c, e, u)), u === t && r[1] ? this.data(r[0]) : u) : (r[1] = i, this.each(function() {
          var t = Z(this);
          t.triggerHandler("setData" + a, r), Z.data(this, e, i), t.triggerHandler("changeData" + a, r);
        }), t);
      }, null, i, arguments.length > 1, null, !1));
    },
    removeData: function(e) {
      return this.each(function() {
        Z.removeData(this, e);
      });
    }
  }), Z.extend({
    queue: function(e, i, n) {
      var r;
      return e ? (i = (i || "fx") + "queue", r = Z._data(e, i), n && (!r || Z.isArray(n) ? r = Z._data(e, i, Z.makeArray(n)) : r.push(n)), 
      r || []) : t;
    },
    dequeue: function(e, t) {
      t = t || "fx";
      var i = Z.queue(e, t), n = i.length, r = i.shift(), a = Z._queueHooks(e, t), s = function() {
        Z.dequeue(e, t);
      };
      "inprogress" === r && (r = i.shift(), n--), r && ("fx" === t && i.unshift("inprogress"), 
      delete a.stop, r.call(e, s, a)), !n && a && a.empty.fire();
    },
    _queueHooks: function(e, t) {
      var i = t + "queueHooks";
      return Z._data(e, i) || Z._data(e, i, {
        empty: Z.Callbacks("once memory").add(function() {
          Z.removeData(e, t + "queue", !0), Z.removeData(e, i, !0);
        })
      });
    }
  }), Z.fn.extend({
    queue: function(e, i) {
      var n = 2;
      return "string" != typeof e && (i = e, e = "fx", n--), n > arguments.length ? Z.queue(this[0], e) : i === t ? this : this.each(function() {
        var t = Z.queue(this, e, i);
        Z._queueHooks(this, e), "fx" === e && "inprogress" !== t[0] && Z.dequeue(this, e);
      });
    },
    dequeue: function(e) {
      return this.each(function() {
        Z.dequeue(this, e);
      });
    },
    delay: function(e, t) {
      return e = Z.fx ? Z.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, function(t, i) {
        var n = setTimeout(t, e);
        i.stop = function() {
          clearTimeout(n);
        };
      });
    },
    clearQueue: function(e) {
      return this.queue(e || "fx", []);
    },
    promise: function(e, i) {
      var n, r = 1, a = Z.Deferred(), s = this, o = this.length, l = function() {
        --r || a.resolveWith(s, [ s ]);
      };
      for ("string" != typeof e && (i = e, e = t), e = e || "fx"; o--; ) n = Z._data(s[o], e + "queueHooks"), 
      n && n.empty && (r++, n.empty.add(l));
      return l(), a.promise(i);
    }
  });
  var vt, yt, _t, bt = /[\t\r\n]/g, xt = /\r/g, wt = /^(?:button|input)$/i, kt = /^(?:button|input|object|select|textarea)$/i, Ct = /^a(?:rea|)$/i, Et = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i, Tt = Z.support.getSetAttribute;
  Z.fn.extend({
    attr: function(e, t) {
      return Z.access(this, Z.attr, e, t, arguments.length > 1);
    },
    removeAttr: function(e) {
      return this.each(function() {
        Z.removeAttr(this, e);
      });
    },
    prop: function(e, t) {
      return Z.access(this, Z.prop, e, t, arguments.length > 1);
    },
    removeProp: function(e) {
      return e = Z.propFix[e] || e, this.each(function() {
        try {
          this[e] = t, delete this[e];
        } catch (i) {}
      });
    },
    addClass: function(e) {
      var t, i, n, r, a, s, o;
      if (Z.isFunction(e)) return this.each(function(t) {
        Z(this).addClass(e.call(this, t, this.className));
      });
      if (e && "string" == typeof e) for (t = e.split(tt), i = 0, n = this.length; n > i; i++) if (r = this[i], 
      1 === r.nodeType) if (r.className || 1 !== t.length) {
        for (a = " " + r.className + " ", s = 0, o = t.length; o > s; s++) 0 > a.indexOf(" " + t[s] + " ") && (a += t[s] + " ");
        r.className = Z.trim(a);
      } else r.className = e;
      return this;
    },
    removeClass: function(e) {
      var i, n, r, a, s, o, l;
      if (Z.isFunction(e)) return this.each(function(t) {
        Z(this).removeClass(e.call(this, t, this.className));
      });
      if (e && "string" == typeof e || e === t) for (i = (e || "").split(tt), o = 0, l = this.length; l > o; o++) if (r = this[o], 
      1 === r.nodeType && r.className) {
        for (n = (" " + r.className + " ").replace(bt, " "), a = 0, s = i.length; s > a; a++) for (;n.indexOf(" " + i[a] + " ") >= 0; ) n = n.replace(" " + i[a] + " ", " ");
        r.className = e ? Z.trim(n) : "";
      }
      return this;
    },
    toggleClass: function(e, t) {
      var i = typeof e, n = "boolean" == typeof t;
      return Z.isFunction(e) ? this.each(function(i) {
        Z(this).toggleClass(e.call(this, i, this.className, t), t);
      }) : this.each(function() {
        if ("string" === i) for (var r, a = 0, s = Z(this), o = t, l = e.split(tt); r = l[a++]; ) o = n ? o : !s.hasClass(r), 
        s[o ? "addClass" : "removeClass"](r); else ("undefined" === i || "boolean" === i) && (this.className && Z._data(this, "__className__", this.className), 
        this.className = this.className || e === !1 ? "" : Z._data(this, "__className__") || "");
      });
    },
    hasClass: function(e) {
      for (var t = " " + e + " ", i = 0, n = this.length; n > i; i++) if (1 === this[i].nodeType && (" " + this[i].className + " ").replace(bt, " ").indexOf(t) >= 0) return !0;
      return !1;
    },
    val: function(e) {
      var i, n, r, a = this[0];
      {
        if (arguments.length) return r = Z.isFunction(e), this.each(function(n) {
          var a, s = Z(this);
          1 === this.nodeType && (a = r ? e.call(this, n, s.val()) : e, null == a ? a = "" : "number" == typeof a ? a += "" : Z.isArray(a) && (a = Z.map(a, function(e) {
            return null == e ? "" : e + "";
          })), i = Z.valHooks[this.type] || Z.valHooks[this.nodeName.toLowerCase()], i && "set" in i && i.set(this, a, "value") !== t || (this.value = a));
        });
        if (a) return i = Z.valHooks[a.type] || Z.valHooks[a.nodeName.toLowerCase()], i && "get" in i && (n = i.get(a, "value")) !== t ? n : (n = a.value, 
        "string" == typeof n ? n.replace(xt, "") : null == n ? "" : n);
      }
    }
  }), Z.extend({
    valHooks: {
      option: {
        get: function(e) {
          var t = e.attributes.value;
          return !t || t.specified ? e.value : e.text;
        }
      },
      select: {
        get: function(e) {
          var t, i, n, r, a = e.selectedIndex, s = [], o = e.options, l = "select-one" === e.type;
          if (0 > a) return null;
          for (i = l ? a : 0, n = l ? a + 1 : o.length; n > i; i++) if (r = o[i], !(!r.selected || (Z.support.optDisabled ? r.disabled : null !== r.getAttribute("disabled")) || r.parentNode.disabled && Z.nodeName(r.parentNode, "optgroup"))) {
            if (t = Z(r).val(), l) return t;
            s.push(t);
          }
          return l && !s.length && o.length ? Z(o[a]).val() : s;
        },
        set: function(e, t) {
          var i = Z.makeArray(t);
          return Z(e).find("option").each(function() {
            this.selected = Z.inArray(Z(this).val(), i) >= 0;
          }), i.length || (e.selectedIndex = -1), i;
        }
      }
    },
    attrFn: {},
    attr: function(e, i, n, r) {
      var a, s, o, l = e.nodeType;
      if (e && 3 !== l && 8 !== l && 2 !== l) return r && Z.isFunction(Z.fn[i]) ? Z(e)[i](n) : e.getAttribute === t ? Z.prop(e, i, n) : (o = 1 !== l || !Z.isXMLDoc(e), 
      o && (i = i.toLowerCase(), s = Z.attrHooks[i] || (Et.test(i) ? yt : vt)), n !== t ? null === n ? (Z.removeAttr(e, i), 
      t) : s && "set" in s && o && (a = s.set(e, n, i)) !== t ? a : (e.setAttribute(i, n + ""), 
      n) : s && "get" in s && o && null !== (a = s.get(e, i)) ? a : (a = e.getAttribute(i), 
      null === a ? t : a));
    },
    removeAttr: function(e, t) {
      var i, n, r, a, s = 0;
      if (t && 1 === e.nodeType) for (n = t.split(tt); n.length > s; s++) r = n[s], r && (i = Z.propFix[r] || r, 
      a = Et.test(r), a || Z.attr(e, r, ""), e.removeAttribute(Tt ? r : i), a && i in e && (e[i] = !1));
    },
    attrHooks: {
      type: {
        set: function(e, t) {
          if (wt.test(e.nodeName) && e.parentNode) Z.error("type property can't be changed"); else if (!Z.support.radioValue && "radio" === t && Z.nodeName(e, "input")) {
            var i = e.value;
            return e.setAttribute("type", t), i && (e.value = i), t;
          }
        }
      },
      value: {
        get: function(e, t) {
          return vt && Z.nodeName(e, "button") ? vt.get(e, t) : t in e ? e.value : null;
        },
        set: function(e, i, n) {
          return vt && Z.nodeName(e, "button") ? vt.set(e, i, n) : (e.value = i, t);
        }
      }
    },
    propFix: {
      tabindex: "tabIndex",
      readonly: "readOnly",
      "for": "htmlFor",
      "class": "className",
      maxlength: "maxLength",
      cellspacing: "cellSpacing",
      cellpadding: "cellPadding",
      rowspan: "rowSpan",
      colspan: "colSpan",
      usemap: "useMap",
      frameborder: "frameBorder",
      contenteditable: "contentEditable"
    },
    prop: function(e, i, n) {
      var r, a, s, o = e.nodeType;
      if (e && 3 !== o && 8 !== o && 2 !== o) return s = 1 !== o || !Z.isXMLDoc(e), s && (i = Z.propFix[i] || i, 
      a = Z.propHooks[i]), n !== t ? a && "set" in a && (r = a.set(e, n, i)) !== t ? r : e[i] = n : a && "get" in a && null !== (r = a.get(e, i)) ? r : e[i];
    },
    propHooks: {
      tabIndex: {
        get: function(e) {
          var i = e.getAttributeNode("tabindex");
          return i && i.specified ? parseInt(i.value, 10) : kt.test(e.nodeName) || Ct.test(e.nodeName) && e.href ? 0 : t;
        }
      }
    }
  }), yt = {
    get: function(e, i) {
      var n, r = Z.prop(e, i);
      return r === !0 || "boolean" != typeof r && (n = e.getAttributeNode(i)) && n.nodeValue !== !1 ? i.toLowerCase() : t;
    },
    set: function(e, t, i) {
      var n;
      return t === !1 ? Z.removeAttr(e, i) : (n = Z.propFix[i] || i, n in e && (e[n] = !0), 
      e.setAttribute(i, i.toLowerCase())), i;
    }
  }, Tt || (_t = {
    name: !0,
    id: !0,
    coords: !0
  }, vt = Z.valHooks.button = {
    get: function(e, i) {
      var n;
      return n = e.getAttributeNode(i), n && (_t[i] ? "" !== n.value : n.specified) ? n.value : t;
    },
    set: function(e, t, i) {
      var n = e.getAttributeNode(i);
      return n || (n = j.createAttribute(i), e.setAttributeNode(n)), n.value = t + "";
    }
  }, Z.each([ "width", "height" ], function(e, i) {
    Z.attrHooks[i] = Z.extend(Z.attrHooks[i], {
      set: function(e, n) {
        return "" === n ? (e.setAttribute(i, "auto"), n) : t;
      }
    });
  }), Z.attrHooks.contenteditable = {
    get: vt.get,
    set: function(e, t, i) {
      "" === t && (t = "false"), vt.set(e, t, i);
    }
  }), Z.support.hrefNormalized || Z.each([ "href", "src", "width", "height" ], function(e, i) {
    Z.attrHooks[i] = Z.extend(Z.attrHooks[i], {
      get: function(e) {
        var n = e.getAttribute(i, 2);
        return null === n ? t : n;
      }
    });
  }), Z.support.style || (Z.attrHooks.style = {
    get: function(e) {
      return e.style.cssText.toLowerCase() || t;
    },
    set: function(e, t) {
      return e.style.cssText = t + "";
    }
  }), Z.support.optSelected || (Z.propHooks.selected = Z.extend(Z.propHooks.selected, {
    get: function(e) {
      var t = e.parentNode;
      return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null;
    }
  })), Z.support.enctype || (Z.propFix.enctype = "encoding"), Z.support.checkOn || Z.each([ "radio", "checkbox" ], function() {
    Z.valHooks[this] = {
      get: function(e) {
        return null === e.getAttribute("value") ? "on" : e.value;
      }
    };
  }), Z.each([ "radio", "checkbox" ], function() {
    Z.valHooks[this] = Z.extend(Z.valHooks[this], {
      set: function(e, i) {
        return Z.isArray(i) ? e.checked = Z.inArray(Z(e).val(), i) >= 0 : t;
      }
    });
  });
  var $t = /^(?:textarea|input|select)$/i, Mt = /^([^\.]*|)(?:\.(.+)|)$/, St = /(?:^|\s)hover(\.\S+|)\b/, It = /^key/, Nt = /^(?:mouse|contextmenu)|click/, Dt = /^(?:focusinfocus|focusoutblur)$/, At = function(e) {
    return Z.event.special.hover ? e : e.replace(St, "mouseenter$1 mouseleave$1");
  };
  Z.event = {
    add: function(e, i, n, r, a) {
      var s, o, l, c, d, u, h, p, f, m, g;
      if (3 !== e.nodeType && 8 !== e.nodeType && i && n && (s = Z._data(e))) {
        for (n.handler && (f = n, n = f.handler, a = f.selector), n.guid || (n.guid = Z.guid++), 
        l = s.events, l || (s.events = l = {}), o = s.handle, o || (s.handle = o = function(e) {
          return Z === t || e && Z.event.triggered === e.type ? t : Z.event.dispatch.apply(o.elem, arguments);
        }, o.elem = e), i = Z.trim(At(i)).split(" "), c = 0; i.length > c; c++) d = Mt.exec(i[c]) || [], 
        u = d[1], h = (d[2] || "").split(".").sort(), g = Z.event.special[u] || {}, u = (a ? g.delegateType : g.bindType) || u, 
        g = Z.event.special[u] || {}, p = Z.extend({
          type: u,
          origType: d[1],
          data: r,
          handler: n,
          guid: n.guid,
          selector: a,
          needsContext: a && Z.expr.match.needsContext.test(a),
          namespace: h.join(".")
        }, f), m = l[u], m || (m = l[u] = [], m.delegateCount = 0, g.setup && g.setup.call(e, r, h, o) !== !1 || (e.addEventListener ? e.addEventListener(u, o, !1) : e.attachEvent && e.attachEvent("on" + u, o))), 
        g.add && (g.add.call(e, p), p.handler.guid || (p.handler.guid = n.guid)), a ? m.splice(m.delegateCount++, 0, p) : m.push(p), 
        Z.event.global[u] = !0;
        e = null;
      }
    },
    global: {},
    remove: function(e, t, i, n, r) {
      var a, s, o, l, c, d, u, h, p, f, m, g = Z.hasData(e) && Z._data(e);
      if (g && (h = g.events)) {
        for (t = Z.trim(At(t || "")).split(" "), a = 0; t.length > a; a++) if (s = Mt.exec(t[a]) || [], 
        o = l = s[1], c = s[2], o) {
          for (p = Z.event.special[o] || {}, o = (n ? p.delegateType : p.bindType) || o, f = h[o] || [], 
          d = f.length, c = c ? RegExp("(^|\\.)" + c.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null, 
          u = 0; f.length > u; u++) m = f[u], !r && l !== m.origType || i && i.guid !== m.guid || c && !c.test(m.namespace) || n && n !== m.selector && ("**" !== n || !m.selector) || (f.splice(u--, 1), 
          m.selector && f.delegateCount--, p.remove && p.remove.call(e, m));
          0 === f.length && d !== f.length && (p.teardown && p.teardown.call(e, c, g.handle) !== !1 || Z.removeEvent(e, o, g.handle), 
          delete h[o]);
        } else for (o in h) Z.event.remove(e, o + t[a], i, n, !0);
        Z.isEmptyObject(h) && (delete g.handle, Z.removeData(e, "events", !0));
      }
    },
    customEvent: {
      getData: !0,
      setData: !0,
      changeData: !0
    },
    trigger: function(i, n, r, a) {
      if (!r || 3 !== r.nodeType && 8 !== r.nodeType) {
        var s, o, l, c, d, u, h, p, f, m, g = i.type || i, v = [];
        if (!Dt.test(g + Z.event.triggered) && (g.indexOf("!") >= 0 && (g = g.slice(0, -1), 
        o = !0), g.indexOf(".") >= 0 && (v = g.split("."), g = v.shift(), v.sort()), r && !Z.event.customEvent[g] || Z.event.global[g])) if (i = "object" == typeof i ? i[Z.expando] ? i : new Z.Event(g, i) : new Z.Event(g), 
        i.type = g, i.isTrigger = !0, i.exclusive = o, i.namespace = v.join("."), i.namespace_re = i.namespace ? RegExp("(^|\\.)" + v.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, 
        u = 0 > g.indexOf(":") ? "on" + g : "", r) {
          if (i.result = t, i.target || (i.target = r), n = null != n ? Z.makeArray(n) : [], 
          n.unshift(i), h = Z.event.special[g] || {}, !h.trigger || h.trigger.apply(r, n) !== !1) {
            if (f = [ [ r, h.bindType || g ] ], !a && !h.noBubble && !Z.isWindow(r)) {
              for (m = h.delegateType || g, c = Dt.test(m + g) ? r : r.parentNode, d = r; c; c = c.parentNode) f.push([ c, m ]), 
              d = c;
              d === (r.ownerDocument || j) && f.push([ d.defaultView || d.parentWindow || e, m ]);
            }
            for (l = 0; f.length > l && !i.isPropagationStopped(); l++) c = f[l][0], i.type = f[l][1], 
            p = (Z._data(c, "events") || {})[i.type] && Z._data(c, "handle"), p && p.apply(c, n), 
            p = u && c[u], p && Z.acceptData(c) && p.apply && p.apply(c, n) === !1 && i.preventDefault();
            return i.type = g, a || i.isDefaultPrevented() || h._default && h._default.apply(r.ownerDocument, n) !== !1 || "click" === g && Z.nodeName(r, "a") || !Z.acceptData(r) || u && r[g] && ("focus" !== g && "blur" !== g || 0 !== i.target.offsetWidth) && !Z.isWindow(r) && (d = r[u], 
            d && (r[u] = null), Z.event.triggered = g, r[g](), Z.event.triggered = t, d && (r[u] = d)), 
            i.result;
          }
        } else {
          s = Z.cache;
          for (l in s) s[l].events && s[l].events[g] && Z.event.trigger(i, n, s[l].handle.elem, !0);
        }
      }
    },
    dispatch: function(i) {
      i = Z.event.fix(i || e.event);
      var n, r, a, s, o, l, c, d, u, h = (Z._data(this, "events") || {})[i.type] || [], p = h.delegateCount, f = Y.call(arguments), m = !i.exclusive && !i.namespace, g = Z.event.special[i.type] || {}, v = [];
      if (f[0] = i, i.delegateTarget = this, !g.preDispatch || g.preDispatch.call(this, i) !== !1) {
        if (p && (!i.button || "click" !== i.type)) for (a = i.target; a != this; a = a.parentNode || this) if (a.disabled !== !0 || "click" !== i.type) {
          for (o = {}, c = [], n = 0; p > n; n++) d = h[n], u = d.selector, o[u] === t && (o[u] = d.needsContext ? Z(u, this).index(a) >= 0 : Z.find(u, this, null, [ a ]).length), 
          o[u] && c.push(d);
          c.length && v.push({
            elem: a,
            matches: c
          });
        }
        for (h.length > p && v.push({
          elem: this,
          matches: h.slice(p)
        }), n = 0; v.length > n && !i.isPropagationStopped(); n++) for (l = v[n], i.currentTarget = l.elem, 
        r = 0; l.matches.length > r && !i.isImmediatePropagationStopped(); r++) d = l.matches[r], 
        (m || !i.namespace && !d.namespace || i.namespace_re && i.namespace_re.test(d.namespace)) && (i.data = d.data, 
        i.handleObj = d, s = ((Z.event.special[d.origType] || {}).handle || d.handler).apply(l.elem, f), 
        s !== t && (i.result = s, s === !1 && (i.preventDefault(), i.stopPropagation())));
        return g.postDispatch && g.postDispatch.call(this, i), i.result;
      }
    },
    props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
    fixHooks: {},
    keyHooks: {
      props: "char charCode key keyCode".split(" "),
      filter: function(e, t) {
        return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), 
        e;
      }
    },
    mouseHooks: {
      props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
      filter: function(e, i) {
        var n, r, a, s = i.button, o = i.fromElement;
        return null == e.pageX && null != i.clientX && (n = e.target.ownerDocument || j, 
        r = n.documentElement, a = n.body, e.pageX = i.clientX + (r && r.scrollLeft || a && a.scrollLeft || 0) - (r && r.clientLeft || a && a.clientLeft || 0), 
        e.pageY = i.clientY + (r && r.scrollTop || a && a.scrollTop || 0) - (r && r.clientTop || a && a.clientTop || 0)), 
        !e.relatedTarget && o && (e.relatedTarget = o === e.target ? i.toElement : o), e.which || s === t || (e.which = 1 & s ? 1 : 2 & s ? 3 : 4 & s ? 2 : 0), 
        e;
      }
    },
    fix: function(e) {
      if (e[Z.expando]) return e;
      var t, i, n = e, r = Z.event.fixHooks[e.type] || {}, a = r.props ? this.props.concat(r.props) : this.props;
      for (e = Z.Event(n), t = a.length; t; ) i = a[--t], e[i] = n[i];
      return e.target || (e.target = n.srcElement || j), 3 === e.target.nodeType && (e.target = e.target.parentNode), 
      e.metaKey = !!e.metaKey, r.filter ? r.filter(e, n) : e;
    },
    special: {
      load: {
        noBubble: !0
      },
      focus: {
        delegateType: "focusin"
      },
      blur: {
        delegateType: "focusout"
      },
      beforeunload: {
        setup: function(e, t, i) {
          Z.isWindow(this) && (this.onbeforeunload = i);
        },
        teardown: function(e, t) {
          this.onbeforeunload === t && (this.onbeforeunload = null);
        }
      }
    },
    simulate: function(e, t, i, n) {
      var r = Z.extend(new Z.Event(), i, {
        type: e,
        isSimulated: !0,
        originalEvent: {}
      });
      n ? Z.event.trigger(r, null, t) : Z.event.dispatch.call(t, r), r.isDefaultPrevented() && i.preventDefault();
    }
  }, Z.event.handle = Z.event.dispatch, Z.removeEvent = j.removeEventListener ? function(e, t, i) {
    e.removeEventListener && e.removeEventListener(t, i, !1);
  } : function(e, i, n) {
    var r = "on" + i;
    e.detachEvent && (e[r] === t && (e[r] = null), e.detachEvent(r, n));
  }, Z.Event = function(e, i) {
    return this instanceof Z.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, 
    this.isDefaultPrevented = e.defaultPrevented || e.returnValue === !1 || e.getPreventDefault && e.getPreventDefault() ? s : a) : this.type = e, 
    i && Z.extend(this, i), this.timeStamp = e && e.timeStamp || Z.now(), this[Z.expando] = !0, 
    t) : new Z.Event(e, i);
  }, Z.Event.prototype = {
    preventDefault: function() {
      this.isDefaultPrevented = s;
      var e = this.originalEvent;
      e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1);
    },
    stopPropagation: function() {
      this.isPropagationStopped = s;
      var e = this.originalEvent;
      e && (e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0);
    },
    stopImmediatePropagation: function() {
      this.isImmediatePropagationStopped = s, this.stopPropagation();
    },
    isDefaultPrevented: a,
    isPropagationStopped: a,
    isImmediatePropagationStopped: a
  }, Z.each({
    mouseenter: "mouseover",
    mouseleave: "mouseout"
  }, function(e, t) {
    Z.event.special[e] = {
      delegateType: t,
      bindType: t,
      handle: function(e) {
        var i, n = this, r = e.relatedTarget, a = e.handleObj;
        return a.selector, (!r || r !== n && !Z.contains(n, r)) && (e.type = a.origType, 
        i = a.handler.apply(this, arguments), e.type = t), i;
      }
    };
  }), Z.support.submitBubbles || (Z.event.special.submit = {
    setup: function() {
      return Z.nodeName(this, "form") ? !1 : (Z.event.add(this, "click._submit keypress._submit", function(e) {
        var i = e.target, n = Z.nodeName(i, "input") || Z.nodeName(i, "button") ? i.form : t;
        n && !Z._data(n, "_submit_attached") && (Z.event.add(n, "submit._submit", function(e) {
          e._submit_bubble = !0;
        }), Z._data(n, "_submit_attached", !0));
      }), t);
    },
    postDispatch: function(e) {
      e._submit_bubble && (delete e._submit_bubble, this.parentNode && !e.isTrigger && Z.event.simulate("submit", this.parentNode, e, !0));
    },
    teardown: function() {
      return Z.nodeName(this, "form") ? !1 : (Z.event.remove(this, "._submit"), t);
    }
  }), Z.support.changeBubbles || (Z.event.special.change = {
    setup: function() {
      return $t.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (Z.event.add(this, "propertychange._change", function(e) {
        "checked" === e.originalEvent.propertyName && (this._just_changed = !0);
      }), Z.event.add(this, "click._change", function(e) {
        this._just_changed && !e.isTrigger && (this._just_changed = !1), Z.event.simulate("change", this, e, !0);
      })), !1) : (Z.event.add(this, "beforeactivate._change", function(e) {
        var t = e.target;
        $t.test(t.nodeName) && !Z._data(t, "_change_attached") && (Z.event.add(t, "change._change", function(e) {
          !this.parentNode || e.isSimulated || e.isTrigger || Z.event.simulate("change", this.parentNode, e, !0);
        }), Z._data(t, "_change_attached", !0));
      }), t);
    },
    handle: function(e) {
      var i = e.target;
      return this !== i || e.isSimulated || e.isTrigger || "radio" !== i.type && "checkbox" !== i.type ? e.handleObj.handler.apply(this, arguments) : t;
    },
    teardown: function() {
      return Z.event.remove(this, "._change"), !$t.test(this.nodeName);
    }
  }), Z.support.focusinBubbles || Z.each({
    focus: "focusin",
    blur: "focusout"
  }, function(e, t) {
    var i = 0, n = function(e) {
      Z.event.simulate(t, e.target, Z.event.fix(e), !0);
    };
    Z.event.special[t] = {
      setup: function() {
        0 === i++ && j.addEventListener(e, n, !0);
      },
      teardown: function() {
        0 === --i && j.removeEventListener(e, n, !0);
      }
    };
  }), Z.fn.extend({
    on: function(e, i, n, r, s) {
      var o, l;
      if ("object" == typeof e) {
        "string" != typeof i && (n = n || i, i = t);
        for (l in e) this.on(l, i, n, e[l], s);
        return this;
      }
      if (null == n && null == r ? (r = i, n = i = t) : null == r && ("string" == typeof i ? (r = n, 
      n = t) : (r = n, n = i, i = t)), r === !1) r = a; else if (!r) return this;
      return 1 === s && (o = r, r = function(e) {
        return Z().off(e), o.apply(this, arguments);
      }, r.guid = o.guid || (o.guid = Z.guid++)), this.each(function() {
        Z.event.add(this, e, r, n, i);
      });
    },
    one: function(e, t, i, n) {
      return this.on(e, t, i, n, 1);
    },
    off: function(e, i, n) {
      var r, s;
      if (e && e.preventDefault && e.handleObj) return r = e.handleObj, Z(e.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler), 
      this;
      if ("object" == typeof e) {
        for (s in e) this.off(s, i, e[s]);
        return this;
      }
      return (i === !1 || "function" == typeof i) && (n = i, i = t), n === !1 && (n = a), 
      this.each(function() {
        Z.event.remove(this, e, n, i);
      });
    },
    bind: function(e, t, i) {
      return this.on(e, null, t, i);
    },
    unbind: function(e, t) {
      return this.off(e, null, t);
    },
    live: function(e, t, i) {
      return Z(this.context).on(e, this.selector, t, i), this;
    },
    die: function(e, t) {
      return Z(this.context).off(e, this.selector || "**", t), this;
    },
    delegate: function(e, t, i, n) {
      return this.on(t, e, i, n);
    },
    undelegate: function(e, t, i) {
      return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", i);
    },
    trigger: function(e, t) {
      return this.each(function() {
        Z.event.trigger(e, t, this);
      });
    },
    triggerHandler: function(e, i) {
      return this[0] ? Z.event.trigger(e, i, this[0], !0) : t;
    },
    toggle: function(e) {
      var t = arguments, i = e.guid || Z.guid++, n = 0, r = function(i) {
        var r = (Z._data(this, "lastToggle" + e.guid) || 0) % n;
        return Z._data(this, "lastToggle" + e.guid, r + 1), i.preventDefault(), t[r].apply(this, arguments) || !1;
      };
      for (r.guid = i; t.length > n; ) t[n++].guid = i;
      return this.click(r);
    },
    hover: function(e, t) {
      return this.mouseenter(e).mouseleave(t || e);
    }
  }), Z.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
    Z.fn[t] = function(e, i) {
      return null == i && (i = e, e = null), arguments.length > 0 ? this.on(t, null, e, i) : this.trigger(t);
    }, It.test(t) && (Z.event.fixHooks[t] = Z.event.keyHooks), Nt.test(t) && (Z.event.fixHooks[t] = Z.event.mouseHooks);
  }), function(e, t) {
    function i(e, t, i, n) {
      i = i || [], t = t || N;
      var r, a, s, o, l = t.nodeType;
      if (!e || "string" != typeof e) return i;
      if (1 !== l && 9 !== l) return [];
      if (s = x(t), !s && !n && (r = it.exec(e))) if (o = r[1]) {
        if (9 === l) {
          if (a = t.getElementById(o), !a || !a.parentNode) return i;
          if (a.id === o) return i.push(a), i;
        } else if (t.ownerDocument && (a = t.ownerDocument.getElementById(o)) && w(t, a) && a.id === o) return i.push(a), 
        i;
      } else {
        if (r[2]) return L.apply(i, z.call(t.getElementsByTagName(e), 0)), i;
        if ((o = r[3]) && ht && t.getElementsByClassName) return L.apply(i, z.call(t.getElementsByClassName(o), 0)), 
        i;
      }
      return m(e.replace(J, "$1"), t, i, n, s);
    }
    function n(e) {
      return function(t) {
        var i = t.nodeName.toLowerCase();
        return "input" === i && t.type === e;
      };
    }
    function r(e) {
      return function(t) {
        var i = t.nodeName.toLowerCase();
        return ("input" === i || "button" === i) && t.type === e;
      };
    }
    function a(e) {
      return R(function(t) {
        return t = +t, R(function(i, n) {
          for (var r, a = e([], i.length, t), s = a.length; s--; ) i[r = a[s]] && (i[r] = !(n[r] = i[r]));
        });
      });
    }
    function s(e, t, i) {
      if (e === t) return i;
      for (var n = e.nextSibling; n; ) {
        if (n === t) return -1;
        n = n.nextSibling;
      }
      return 1;
    }
    function o(e, t) {
      var n, r, a, s, o, l, c, d = q[S][e];
      if (d) return t ? 0 : d.slice(0);
      for (o = e, l = [], c = _.preFilter; o; ) {
        (!n || (r = Q.exec(o))) && (r && (o = o.slice(r[0].length)), l.push(a = [])), n = !1, 
        (r = et.exec(o)) && (a.push(n = new I(r.shift())), o = o.slice(n.length), n.type = r[0].replace(J, " "));
        for (s in _.filter) !(r = ot[s].exec(o)) || c[s] && !(r = c[s](r, N, !0)) || (a.push(n = new I(r.shift())), 
        o = o.slice(n.length), n.type = s, n.matches = r);
        if (!n) break;
      }
      return t ? o.length : o ? i.error(e) : q(e, l).slice(0);
    }
    function l(e, t, i) {
      var n = t.dir, r = i && "parentNode" === t.dir, a = P++;
      return t.first ? function(t, i, a) {
        for (;t = t[n]; ) if (r || 1 === t.nodeType) return e(t, i, a);
      } : function(t, i, s) {
        if (s) {
          for (;t = t[n]; ) if ((r || 1 === t.nodeType) && e(t, i, s)) return t;
        } else for (var o, l = A + " " + a + " ", c = l + v; t = t[n]; ) if (r || 1 === t.nodeType) {
          if ((o = t[S]) === c) return t.sizset;
          if ("string" == typeof o && 0 === o.indexOf(l)) {
            if (t.sizset) return t;
          } else {
            if (t[S] = c, e(t, i, s)) return t.sizset = !0, t;
            t.sizset = !1;
          }
        }
      };
    }
    function c(e) {
      return e.length > 1 ? function(t, i, n) {
        for (var r = e.length; r--; ) if (!e[r](t, i, n)) return !1;
        return !0;
      } : e[0];
    }
    function d(e, t, i, n, r) {
      for (var a, s = [], o = 0, l = e.length, c = null != t; l > o; o++) (a = e[o]) && (!i || i(a, n, r)) && (s.push(a), 
      c && t.push(o));
      return s;
    }
    function u(e, t, i, n, r, a) {
      return n && !n[S] && (n = u(n)), r && !r[S] && (r = u(r, a)), R(function(a, s, o, l) {
        if (!a || !r) {
          var c, u, h, p = [], m = [], g = s.length, v = a || f(t || "*", o.nodeType ? [ o ] : o, [], a), y = !e || !a && t ? v : d(v, p, e, o, l), _ = i ? r || (a ? e : g || n) ? [] : s : y;
          if (i && i(y, _, o, l), n) for (h = d(_, m), n(h, [], o, l), c = h.length; c--; ) (u = h[c]) && (_[m[c]] = !(y[m[c]] = u));
          if (a) for (c = e && _.length; c--; ) (u = _[c]) && (a[p[c]] = !(s[p[c]] = u)); else _ = d(_ === s ? _.splice(g, _.length) : _), 
          r ? r(null, s, _, l) : L.apply(s, _);
        }
      });
    }
    function h(e) {
      for (var t, i, n, r = e.length, a = _.relative[e[0].type], s = a || _.relative[" "], o = a ? 1 : 0, d = l(function(e) {
        return e === t;
      }, s, !0), p = l(function(e) {
        return H.call(t, e) > -1;
      }, s, !0), f = [ function(e, i, n) {
        return !a && (n || i !== T) || ((t = i).nodeType ? d(e, i, n) : p(e, i, n));
      } ]; r > o; o++) if (i = _.relative[e[o].type]) f = [ l(c(f), i) ]; else {
        if (i = _.filter[e[o].type].apply(null, e[o].matches), i[S]) {
          for (n = ++o; r > n && !_.relative[e[n].type]; n++) ;
          return u(o > 1 && c(f), o > 1 && e.slice(0, o - 1).join("").replace(J, "$1"), i, n > o && h(e.slice(o, n)), r > n && h(e = e.slice(n)), r > n && e.join(""));
        }
        f.push(i);
      }
      return c(f);
    }
    function p(e, t) {
      var n = t.length > 0, r = e.length > 0, a = function(s, o, l, c, u) {
        var h, p, f, m = [], g = 0, y = "0", b = s && [], x = null != u, w = T, k = s || r && _.find.TAG("*", u && o.parentNode || o), C = A += null == w ? 1 : Math.E;
        for (x && (T = o !== N && o, v = a.el); null != (h = k[y]); y++) {
          if (r && h) {
            for (p = 0; f = e[p]; p++) if (f(h, o, l)) {
              c.push(h);
              break;
            }
            x && (A = C, v = ++a.el);
          }
          n && ((h = !f && h) && g--, s && b.push(h));
        }
        if (g += y, n && y !== g) {
          for (p = 0; f = t[p]; p++) f(b, m, o, l);
          if (s) {
            if (g > 0) for (;y--; ) b[y] || m[y] || (m[y] = O.call(c));
            m = d(m);
          }
          L.apply(c, m), x && !s && m.length > 0 && g + t.length > 1 && i.uniqueSort(c);
        }
        return x && (A = C, T = w), b;
      };
      return a.el = 0, n ? R(a) : a;
    }
    function f(e, t, n, r) {
      for (var a = 0, s = t.length; s > a; a++) i(e, t[a], n, r);
      return n;
    }
    function m(e, t, i, n, r) {
      var a, s, l, c, d, u = o(e);
      if (u.length, !n && 1 === u.length) {
        if (s = u[0] = u[0].slice(0), s.length > 2 && "ID" === (l = s[0]).type && 9 === t.nodeType && !r && _.relative[s[1].type]) {
          if (t = _.find.ID(l.matches[0].replace(st, ""), t, r)[0], !t) return i;
          e = e.slice(s.shift().length);
        }
        for (a = ot.POS.test(e) ? -1 : s.length - 1; a >= 0 && (l = s[a], !_.relative[c = l.type]); a--) if ((d = _.find[c]) && (n = d(l.matches[0].replace(st, ""), nt.test(s[0].type) && t.parentNode || t, r))) {
          if (s.splice(a, 1), e = n.length && s.join(""), !e) return L.apply(i, z.call(n, 0)), 
          i;
          break;
        }
      }
      return k(e, u)(n, t, r, i, nt.test(e)), i;
    }
    function g() {}
    var v, y, _, b, x, w, k, C, E, T, $ = !0, M = "undefined", S = ("sizcache" + Math.random()).replace(".", ""), I = String, N = e.document, D = N.documentElement, A = 0, P = 0, O = [].pop, L = [].push, z = [].slice, H = [].indexOf || function(e) {
      for (var t = 0, i = this.length; i > t; t++) if (this[t] === e) return t;
      return -1;
    }, R = function(e, t) {
      return e[S] = null == t || t, e;
    }, F = function() {
      var e = {}, t = [];
      return R(function(i, n) {
        return t.push(i) > _.cacheLength && delete e[t.shift()], e[i] = n;
      }, e);
    }, j = F(), q = F(), U = F(), B = "[\\x20\\t\\r\\n\\f]", W = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+", X = W.replace("w", "w#"), Y = "([*^$|!~]?=)", V = "\\[" + B + "*(" + W + ")" + B + "*(?:" + Y + B + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + X + ")|)|)" + B + "*\\]", G = ":(" + W + ")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:" + V + ")|[^:]|\\\\.)*|.*))\\)|)", K = ":(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + B + "*((?:-\\d)?\\d*)" + B + "*\\)|)(?=[^-]|$)", J = RegExp("^" + B + "+|((?:^|[^\\\\])(?:\\\\.)*)" + B + "+$", "g"), Q = RegExp("^" + B + "*," + B + "*"), et = RegExp("^" + B + "*([\\x20\\t\\r\\n\\f>+~])" + B + "*"), tt = RegExp(G), it = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/, nt = /[\x20\t\r\n\f]*[+~]/, rt = /h\d/i, at = /input|select|textarea|button/i, st = /\\(?!\\)/g, ot = {
      ID: RegExp("^#(" + W + ")"),
      CLASS: RegExp("^\\.(" + W + ")"),
      NAME: RegExp("^\\[name=['\"]?(" + W + ")['\"]?\\]"),
      TAG: RegExp("^(" + W.replace("w", "w*") + ")"),
      ATTR: RegExp("^" + V),
      PSEUDO: RegExp("^" + G),
      POS: RegExp(K, "i"),
      CHILD: RegExp("^:(only|nth|first|last)-child(?:\\(" + B + "*(even|odd|(([+-]|)(\\d*)n|)" + B + "*(?:([+-]|)" + B + "*(\\d+)|))" + B + "*\\)|)", "i"),
      needsContext: RegExp("^" + B + "*[>+~]|" + K, "i")
    }, lt = function(e) {
      var t = N.createElement("div");
      try {
        return e(t);
      } catch (i) {
        return !1;
      } finally {
        t = null;
      }
    }, ct = lt(function(e) {
      return e.appendChild(N.createComment("")), !e.getElementsByTagName("*").length;
    }), dt = lt(function(e) {
      return e.innerHTML = "<a href='#'></a>", e.firstChild && typeof e.firstChild.getAttribute !== M && "#" === e.firstChild.getAttribute("href");
    }), ut = lt(function(e) {
      e.innerHTML = "<select></select>";
      var t = typeof e.lastChild.getAttribute("multiple");
      return "boolean" !== t && "string" !== t;
    }), ht = lt(function(e) {
      return e.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>", e.getElementsByClassName && e.getElementsByClassName("e").length ? (e.lastChild.className = "e", 
      2 === e.getElementsByClassName("e").length) : !1;
    }), pt = lt(function(e) {
      e.id = S + 0, e.innerHTML = "<a name='" + S + "'></a><div name='" + S + "'></div>", 
      D.insertBefore(e, D.firstChild);
      var t = N.getElementsByName && N.getElementsByName(S).length === 2 + N.getElementsByName(S + 0).length;
      return y = !N.getElementById(S), D.removeChild(e), t;
    });
    try {
      z.call(D.childNodes, 0)[0].nodeType;
    } catch (ft) {
      z = function(e) {
        for (var t, i = []; t = this[e]; e++) i.push(t);
        return i;
      };
    }
    i.matches = function(e, t) {
      return i(e, null, null, t);
    }, i.matchesSelector = function(e, t) {
      return i(t, null, null, [ e ]).length > 0;
    }, b = i.getText = function(e) {
      var t, i = "", n = 0, r = e.nodeType;
      if (r) {
        if (1 === r || 9 === r || 11 === r) {
          if ("string" == typeof e.textContent) return e.textContent;
          for (e = e.firstChild; e; e = e.nextSibling) i += b(e);
        } else if (3 === r || 4 === r) return e.nodeValue;
      } else for (;t = e[n]; n++) i += b(t);
      return i;
    }, x = i.isXML = function(e) {
      var t = e && (e.ownerDocument || e).documentElement;
      return t ? "HTML" !== t.nodeName : !1;
    }, w = i.contains = D.contains ? function(e, t) {
      var i = 9 === e.nodeType ? e.documentElement : e, n = t && t.parentNode;
      return e === n || !!(n && 1 === n.nodeType && i.contains && i.contains(n));
    } : D.compareDocumentPosition ? function(e, t) {
      return t && !!(16 & e.compareDocumentPosition(t));
    } : function(e, t) {
      for (;t = t.parentNode; ) if (t === e) return !0;
      return !1;
    }, i.attr = function(e, t) {
      var i, n = x(e);
      return n || (t = t.toLowerCase()), (i = _.attrHandle[t]) ? i(e) : n || ut ? e.getAttribute(t) : (i = e.getAttributeNode(t), 
      i ? "boolean" == typeof e[t] ? e[t] ? t : null : i.specified ? i.value : null : null);
    }, _ = i.selectors = {
      cacheLength: 50,
      createPseudo: R,
      match: ot,
      attrHandle: dt ? {} : {
        href: function(e) {
          return e.getAttribute("href", 2);
        },
        type: function(e) {
          return e.getAttribute("type");
        }
      },
      find: {
        ID: y ? function(e, t, i) {
          if (typeof t.getElementById !== M && !i) {
            var n = t.getElementById(e);
            return n && n.parentNode ? [ n ] : [];
          }
        } : function(e, i, n) {
          if (typeof i.getElementById !== M && !n) {
            var r = i.getElementById(e);
            return r ? r.id === e || typeof r.getAttributeNode !== M && r.getAttributeNode("id").value === e ? [ r ] : t : [];
          }
        },
        TAG: ct ? function(e, i) {
          return typeof i.getElementsByTagName !== M ? i.getElementsByTagName(e) : t;
        } : function(e, t) {
          var i = t.getElementsByTagName(e);
          if ("*" === e) {
            for (var n, r = [], a = 0; n = i[a]; a++) 1 === n.nodeType && r.push(n);
            return r;
          }
          return i;
        },
        NAME: pt && function(e, i) {
          return typeof i.getElementsByName !== M ? i.getElementsByName(name) : t;
        },
        CLASS: ht && function(e, i, n) {
          return typeof i.getElementsByClassName === M || n ? t : i.getElementsByClassName(e);
        }
      },
      relative: {
        ">": {
          dir: "parentNode",
          first: !0
        },
        " ": {
          dir: "parentNode"
        },
        "+": {
          dir: "previousSibling",
          first: !0
        },
        "~": {
          dir: "previousSibling"
        }
      },
      preFilter: {
        ATTR: function(e) {
          return e[1] = e[1].replace(st, ""), e[3] = (e[4] || e[5] || "").replace(st, ""), 
          "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4);
        },
        CHILD: function(e) {
          return e[1] = e[1].toLowerCase(), "nth" === e[1] ? (e[2] || i.error(e[0]), e[3] = +(e[3] ? e[4] + (e[5] || 1) : 2 * ("even" === e[2] || "odd" === e[2])), 
          e[4] = +(e[6] + e[7] || "odd" === e[2])) : e[2] && i.error(e[0]), e;
        },
        PSEUDO: function(e) {
          var t, i;
          return ot.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[3] : (t = e[4]) && (tt.test(t) && (i = o(t, !0)) && (i = t.indexOf(")", t.length - i) - t.length) && (t = t.slice(0, i), 
          e[0] = e[0].slice(0, i)), e[2] = t), e.slice(0, 3));
        }
      },
      filter: {
        ID: y ? function(e) {
          return e = e.replace(st, ""), function(t) {
            return t.getAttribute("id") === e;
          };
        } : function(e) {
          return e = e.replace(st, ""), function(t) {
            var i = typeof t.getAttributeNode !== M && t.getAttributeNode("id");
            return i && i.value === e;
          };
        },
        TAG: function(e) {
          return "*" === e ? function() {
            return !0;
          } : (e = e.replace(st, "").toLowerCase(), function(t) {
            return t.nodeName && t.nodeName.toLowerCase() === e;
          });
        },
        CLASS: function(e) {
          var t = j[S][e];
          return t || (t = j(e, RegExp("(^|" + B + ")" + e + "(" + B + "|$)"))), function(e) {
            return t.test(e.className || typeof e.getAttribute !== M && e.getAttribute("class") || "");
          };
        },
        ATTR: function(e, t, n) {
          return function(r) {
            var a = i.attr(r, e);
            return null == a ? "!=" === t : t ? (a += "", "=" === t ? a === n : "!=" === t ? a !== n : "^=" === t ? n && 0 === a.indexOf(n) : "*=" === t ? n && a.indexOf(n) > -1 : "$=" === t ? n && a.substr(a.length - n.length) === n : "~=" === t ? (" " + a + " ").indexOf(n) > -1 : "|=" === t ? a === n || a.substr(0, n.length + 1) === n + "-" : !1) : !0;
          };
        },
        CHILD: function(e, t, i, n) {
          return "nth" === e ? function(e) {
            var t, r, a = e.parentNode;
            if (1 === i && 0 === n) return !0;
            if (a) for (r = 0, t = a.firstChild; t && (1 !== t.nodeType || (r++, e !== t)); t = t.nextSibling) ;
            return r -= n, r === i || 0 === r % i && r / i >= 0;
          } : function(t) {
            var i = t;
            switch (e) {
             case "only":
             case "first":
              for (;i = i.previousSibling; ) if (1 === i.nodeType) return !1;
              if ("first" === e) return !0;
              i = t;

             case "last":
              for (;i = i.nextSibling; ) if (1 === i.nodeType) return !1;
              return !0;
            }
          };
        },
        PSEUDO: function(e, t) {
          var n, r = _.pseudos[e] || _.setFilters[e.toLowerCase()] || i.error("unsupported pseudo: " + e);
          return r[S] ? r(t) : r.length > 1 ? (n = [ e, e, "", t ], _.setFilters.hasOwnProperty(e.toLowerCase()) ? R(function(e, i) {
            for (var n, a = r(e, t), s = a.length; s--; ) n = H.call(e, a[s]), e[n] = !(i[n] = a[s]);
          }) : function(e) {
            return r(e, 0, n);
          }) : r;
        }
      },
      pseudos: {
        not: R(function(e) {
          var t = [], i = [], n = k(e.replace(J, "$1"));
          return n[S] ? R(function(e, t, i, r) {
            for (var a, s = n(e, null, r, []), o = e.length; o--; ) (a = s[o]) && (e[o] = !(t[o] = a));
          }) : function(e, r, a) {
            return t[0] = e, n(t, null, a, i), !i.pop();
          };
        }),
        has: R(function(e) {
          return function(t) {
            return i(e, t).length > 0;
          };
        }),
        contains: R(function(e) {
          return function(t) {
            return (t.textContent || t.innerText || b(t)).indexOf(e) > -1;
          };
        }),
        enabled: function(e) {
          return e.disabled === !1;
        },
        disabled: function(e) {
          return e.disabled === !0;
        },
        checked: function(e) {
          var t = e.nodeName.toLowerCase();
          return "input" === t && !!e.checked || "option" === t && !!e.selected;
        },
        selected: function(e) {
          return e.parentNode && e.parentNode.selectedIndex, e.selected === !0;
        },
        parent: function(e) {
          return !_.pseudos.empty(e);
        },
        empty: function(e) {
          var t;
          for (e = e.firstChild; e; ) {
            if (e.nodeName > "@" || 3 === (t = e.nodeType) || 4 === t) return !1;
            e = e.nextSibling;
          }
          return !0;
        },
        header: function(e) {
          return rt.test(e.nodeName);
        },
        text: function(e) {
          var t, i;
          return "input" === e.nodeName.toLowerCase() && "text" === (t = e.type) && (null == (i = e.getAttribute("type")) || i.toLowerCase() === t);
        },
        radio: n("radio"),
        checkbox: n("checkbox"),
        file: n("file"),
        password: n("password"),
        image: n("image"),
        submit: r("submit"),
        reset: r("reset"),
        button: function(e) {
          var t = e.nodeName.toLowerCase();
          return "input" === t && "button" === e.type || "button" === t;
        },
        input: function(e) {
          return at.test(e.nodeName);
        },
        focus: function(e) {
          var t = e.ownerDocument;
          return !(e !== t.activeElement || t.hasFocus && !t.hasFocus() || !e.type && !e.href);
        },
        active: function(e) {
          return e === e.ownerDocument.activeElement;
        },
        first: a(function() {
          return [ 0 ];
        }),
        last: a(function(e, t) {
          return [ t - 1 ];
        }),
        eq: a(function(e, t, i) {
          return [ 0 > i ? i + t : i ];
        }),
        even: a(function(e, t) {
          for (var i = 0; t > i; i += 2) e.push(i);
          return e;
        }),
        odd: a(function(e, t) {
          for (var i = 1; t > i; i += 2) e.push(i);
          return e;
        }),
        lt: a(function(e, t, i) {
          for (var n = 0 > i ? i + t : i; --n >= 0; ) e.push(n);
          return e;
        }),
        gt: a(function(e, t, i) {
          for (var n = 0 > i ? i + t : i; t > ++n; ) e.push(n);
          return e;
        })
      }
    }, C = D.compareDocumentPosition ? function(e, t) {
      return e === t ? (E = !0, 0) : (e.compareDocumentPosition && t.compareDocumentPosition ? 4 & e.compareDocumentPosition(t) : e.compareDocumentPosition) ? -1 : 1;
    } : function(e, t) {
      if (e === t) return E = !0, 0;
      if (e.sourceIndex && t.sourceIndex) return e.sourceIndex - t.sourceIndex;
      var i, n, r = [], a = [], o = e.parentNode, l = t.parentNode, c = o;
      if (o === l) return s(e, t);
      if (!o) return -1;
      if (!l) return 1;
      for (;c; ) r.unshift(c), c = c.parentNode;
      for (c = l; c; ) a.unshift(c), c = c.parentNode;
      i = r.length, n = a.length;
      for (var d = 0; i > d && n > d; d++) if (r[d] !== a[d]) return s(r[d], a[d]);
      return d === i ? s(e, a[d], -1) : s(r[d], t, 1);
    }, [ 0, 0 ].sort(C), $ = !E, i.uniqueSort = function(e) {
      var t, i = 1;
      if (E = $, e.sort(C), E) for (;t = e[i]; i++) t === e[i - 1] && e.splice(i--, 1);
      return e;
    }, i.error = function(e) {
      throw Error("Syntax error, unrecognized expression: " + e);
    }, k = i.compile = function(e, t) {
      var i, n = [], r = [], a = U[S][e];
      if (!a) {
        for (t || (t = o(e)), i = t.length; i--; ) a = h(t[i]), a[S] ? n.push(a) : r.push(a);
        a = U(e, p(r, n));
      }
      return a;
    }, N.querySelectorAll && function() {
      var e, t = m, n = /'|\\/g, r = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g, a = [ ":focus" ], s = [ ":active", ":focus" ], l = D.matchesSelector || D.mozMatchesSelector || D.webkitMatchesSelector || D.oMatchesSelector || D.msMatchesSelector;
      lt(function(e) {
        e.innerHTML = "<select><option selected=''></option></select>", e.querySelectorAll("[selected]").length || a.push("\\[" + B + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)"), 
        e.querySelectorAll(":checked").length || a.push(":checked");
      }), lt(function(e) {
        e.innerHTML = "<p test=''></p>", e.querySelectorAll("[test^='']").length && a.push("[*^$]=" + B + "*(?:\"\"|'')"), 
        e.innerHTML = "<input type='hidden'/>", e.querySelectorAll(":enabled").length || a.push(":enabled", ":disabled");
      }), a = RegExp(a.join("|")), m = function(e, i, r, s, l) {
        if (!(s || l || a && a.test(e))) {
          var c, d, u = !0, h = S, p = i, f = 9 === i.nodeType && e;
          if (1 === i.nodeType && "object" !== i.nodeName.toLowerCase()) {
            for (c = o(e), (u = i.getAttribute("id")) ? h = u.replace(n, "\\$&") : i.setAttribute("id", h), 
            h = "[id='" + h + "'] ", d = c.length; d--; ) c[d] = h + c[d].join("");
            p = nt.test(e) && i.parentNode || i, f = c.join(",");
          }
          if (f) try {
            return L.apply(r, z.call(p.querySelectorAll(f), 0)), r;
          } catch (m) {} finally {
            u || i.removeAttribute("id");
          }
        }
        return t(e, i, r, s, l);
      }, l && (lt(function(t) {
        e = l.call(t, "div");
        try {
          l.call(t, "[test!='']:sizzle"), s.push("!=", G);
        } catch (i) {}
      }), s = RegExp(s.join("|")), i.matchesSelector = function(t, n) {
        if (n = n.replace(r, "='$1']"), !(x(t) || s.test(n) || a && a.test(n))) try {
          var o = l.call(t, n);
          if (o || e || t.document && 11 !== t.document.nodeType) return o;
        } catch (c) {}
        return i(n, null, null, [ t ]).length > 0;
      });
    }(), _.pseudos.nth = _.pseudos.eq, _.filters = g.prototype = _.pseudos, _.setFilters = new g(), 
    i.attr = Z.attr, Z.find = i, Z.expr = i.selectors, Z.expr[":"] = Z.expr.pseudos, 
    Z.unique = i.uniqueSort, Z.text = i.getText, Z.isXMLDoc = i.isXML, Z.contains = i.contains;
  }(e);
  var Pt = /Until$/, Ot = /^(?:parents|prev(?:Until|All))/, Lt = /^.[^:#\[\.,]*$/, zt = Z.expr.match.needsContext, Ht = {
    children: !0,
    contents: !0,
    next: !0,
    prev: !0
  };
  Z.fn.extend({
    find: function(e) {
      var t, i, n, r, a, s, o = this;
      if ("string" != typeof e) return Z(e).filter(function() {
        for (t = 0, i = o.length; i > t; t++) if (Z.contains(o[t], this)) return !0;
      });
      for (s = this.pushStack("", "find", e), t = 0, i = this.length; i > t; t++) if (n = s.length, 
      Z.find(e, this[t], s), t > 0) for (r = n; s.length > r; r++) for (a = 0; n > a; a++) if (s[a] === s[r]) {
        s.splice(r--, 1);
        break;
      }
      return s;
    },
    has: function(e) {
      var t, i = Z(e, this), n = i.length;
      return this.filter(function() {
        for (t = 0; n > t; t++) if (Z.contains(this, i[t])) return !0;
      });
    },
    not: function(e) {
      return this.pushStack(c(this, e, !1), "not", e);
    },
    filter: function(e) {
      return this.pushStack(c(this, e, !0), "filter", e);
    },
    is: function(e) {
      return !!e && ("string" == typeof e ? zt.test(e) ? Z(e, this.context).index(this[0]) >= 0 : Z.filter(e, this).length > 0 : this.filter(e).length > 0);
    },
    closest: function(e, t) {
      for (var i, n = 0, r = this.length, a = [], s = zt.test(e) || "string" != typeof e ? Z(e, t || this.context) : 0; r > n; n++) for (i = this[n]; i && i.ownerDocument && i !== t && 11 !== i.nodeType; ) {
        if (s ? s.index(i) > -1 : Z.find.matchesSelector(i, e)) {
          a.push(i);
          break;
        }
        i = i.parentNode;
      }
      return a = a.length > 1 ? Z.unique(a) : a, this.pushStack(a, "closest", e);
    },
    index: function(e) {
      return e ? "string" == typeof e ? Z.inArray(this[0], Z(e)) : Z.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.prevAll().length : -1;
    },
    add: function(e, t) {
      var i = "string" == typeof e ? Z(e, t) : Z.makeArray(e && e.nodeType ? [ e ] : e), n = Z.merge(this.get(), i);
      return this.pushStack(o(i[0]) || o(n[0]) ? n : Z.unique(n));
    },
    addBack: function(e) {
      return this.add(null == e ? this.prevObject : this.prevObject.filter(e));
    }
  }), Z.fn.andSelf = Z.fn.addBack, Z.each({
    parent: function(e) {
      var t = e.parentNode;
      return t && 11 !== t.nodeType ? t : null;
    },
    parents: function(e) {
      return Z.dir(e, "parentNode");
    },
    parentsUntil: function(e, t, i) {
      return Z.dir(e, "parentNode", i);
    },
    next: function(e) {
      return l(e, "nextSibling");
    },
    prev: function(e) {
      return l(e, "previousSibling");
    },
    nextAll: function(e) {
      return Z.dir(e, "nextSibling");
    },
    prevAll: function(e) {
      return Z.dir(e, "previousSibling");
    },
    nextUntil: function(e, t, i) {
      return Z.dir(e, "nextSibling", i);
    },
    prevUntil: function(e, t, i) {
      return Z.dir(e, "previousSibling", i);
    },
    siblings: function(e) {
      return Z.sibling((e.parentNode || {}).firstChild, e);
    },
    children: function(e) {
      return Z.sibling(e.firstChild);
    },
    contents: function(e) {
      return Z.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : Z.merge([], e.childNodes);
    }
  }, function(e, t) {
    Z.fn[e] = function(i, n) {
      var r = Z.map(this, t, i);
      return Pt.test(e) || (n = i), n && "string" == typeof n && (r = Z.filter(n, r)), 
      r = this.length > 1 && !Ht[e] ? Z.unique(r) : r, this.length > 1 && Ot.test(e) && (r = r.reverse()), 
      this.pushStack(r, e, Y.call(arguments).join(","));
    };
  }), Z.extend({
    filter: function(e, t, i) {
      return i && (e = ":not(" + e + ")"), 1 === t.length ? Z.find.matchesSelector(t[0], e) ? [ t[0] ] : [] : Z.find.matches(e, t);
    },
    dir: function(e, i, n) {
      for (var r = [], a = e[i]; a && 9 !== a.nodeType && (n === t || 1 !== a.nodeType || !Z(a).is(n)); ) 1 === a.nodeType && r.push(a), 
      a = a[i];
      return r;
    },
    sibling: function(e, t) {
      for (var i = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && i.push(e);
      return i;
    }
  });
  var Rt = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", Ft = / jQuery\d+="(?:null|\d+)"/g, jt = /^\s+/, qt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, Ut = /<([\w:]+)/, Bt = /<tbody/i, Wt = /<|&#?\w+;/, Xt = /<(?:script|style|link)/i, Yt = /<(?:script|object|embed|option|style)/i, Vt = RegExp("<(?:" + Rt + ")[\\s/>]", "i"), Gt = /^(?:checkbox|radio)$/, Kt = /checked\s*(?:[^=]|=\s*.checked.)/i, Jt = /\/(java|ecma)script/i, Zt = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g, Qt = {
    option: [ 1, "<select multiple='multiple'>", "</select>" ],
    legend: [ 1, "<fieldset>", "</fieldset>" ],
    thead: [ 1, "<table>", "</table>" ],
    tr: [ 2, "<table><tbody>", "</tbody></table>" ],
    td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
    col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
    area: [ 1, "<map>", "</map>" ],
    _default: [ 0, "", "" ]
  }, ei = d(j), ti = ei.appendChild(j.createElement("div"));
  Qt.optgroup = Qt.option, Qt.tbody = Qt.tfoot = Qt.colgroup = Qt.caption = Qt.thead, 
  Qt.th = Qt.td, Z.support.htmlSerialize || (Qt._default = [ 1, "X<div>", "</div>" ]), 
  Z.fn.extend({
    text: function(e) {
      return Z.access(this, function(e) {
        return e === t ? Z.text(this) : this.empty().append((this[0] && this[0].ownerDocument || j).createTextNode(e));
      }, null, e, arguments.length);
    },
    wrapAll: function(e) {
      if (Z.isFunction(e)) return this.each(function(t) {
        Z(this).wrapAll(e.call(this, t));
      });
      if (this[0]) {
        var t = Z(e, this[0].ownerDocument).eq(0).clone(!0);
        this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
          for (var e = this; e.firstChild && 1 === e.firstChild.nodeType; ) e = e.firstChild;
          return e;
        }).append(this);
      }
      return this;
    },
    wrapInner: function(e) {
      return Z.isFunction(e) ? this.each(function(t) {
        Z(this).wrapInner(e.call(this, t));
      }) : this.each(function() {
        var t = Z(this), i = t.contents();
        i.length ? i.wrapAll(e) : t.append(e);
      });
    },
    wrap: function(e) {
      var t = Z.isFunction(e);
      return this.each(function(i) {
        Z(this).wrapAll(t ? e.call(this, i) : e);
      });
    },
    unwrap: function() {
      return this.parent().each(function() {
        Z.nodeName(this, "body") || Z(this).replaceWith(this.childNodes);
      }).end();
    },
    append: function() {
      return this.domManip(arguments, !0, function(e) {
        (1 === this.nodeType || 11 === this.nodeType) && this.appendChild(e);
      });
    },
    prepend: function() {
      return this.domManip(arguments, !0, function(e) {
        (1 === this.nodeType || 11 === this.nodeType) && this.insertBefore(e, this.firstChild);
      });
    },
    before: function() {
      if (!o(this[0])) return this.domManip(arguments, !1, function(e) {
        this.parentNode.insertBefore(e, this);
      });
      if (arguments.length) {
        var e = Z.clean(arguments);
        return this.pushStack(Z.merge(e, this), "before", this.selector);
      }
    },
    after: function() {
      if (!o(this[0])) return this.domManip(arguments, !1, function(e) {
        this.parentNode.insertBefore(e, this.nextSibling);
      });
      if (arguments.length) {
        var e = Z.clean(arguments);
        return this.pushStack(Z.merge(this, e), "after", this.selector);
      }
    },
    remove: function(e, t) {
      for (var i, n = 0; null != (i = this[n]); n++) (!e || Z.filter(e, [ i ]).length) && (t || 1 !== i.nodeType || (Z.cleanData(i.getElementsByTagName("*")), 
      Z.cleanData([ i ])), i.parentNode && i.parentNode.removeChild(i));
      return this;
    },
    empty: function() {
      for (var e, t = 0; null != (e = this[t]); t++) for (1 === e.nodeType && Z.cleanData(e.getElementsByTagName("*")); e.firstChild; ) e.removeChild(e.firstChild);
      return this;
    },
    clone: function(e, t) {
      return e = null == e ? !1 : e, t = null == t ? e : t, this.map(function() {
        return Z.clone(this, e, t);
      });
    },
    html: function(e) {
      return Z.access(this, function(e) {
        var i = this[0] || {}, n = 0, r = this.length;
        if (e === t) return 1 === i.nodeType ? i.innerHTML.replace(Ft, "") : t;
        if (!("string" != typeof e || Xt.test(e) || !Z.support.htmlSerialize && Vt.test(e) || !Z.support.leadingWhitespace && jt.test(e) || Qt[(Ut.exec(e) || [ "", "" ])[1].toLowerCase()])) {
          e = e.replace(qt, "<$1></$2>");
          try {
            for (;r > n; n++) i = this[n] || {}, 1 === i.nodeType && (Z.cleanData(i.getElementsByTagName("*")), 
            i.innerHTML = e);
            i = 0;
          } catch (a) {}
        }
        i && this.empty().append(e);
      }, null, e, arguments.length);
    },
    replaceWith: function(e) {
      return o(this[0]) ? this.length ? this.pushStack(Z(Z.isFunction(e) ? e() : e), "replaceWith", e) : this : Z.isFunction(e) ? this.each(function(t) {
        var i = Z(this), n = i.html();
        i.replaceWith(e.call(this, t, n));
      }) : ("string" != typeof e && (e = Z(e).detach()), this.each(function() {
        var t = this.nextSibling, i = this.parentNode;
        Z(this).remove(), t ? Z(t).before(e) : Z(i).append(e);
      }));
    },
    detach: function(e) {
      return this.remove(e, !0);
    },
    domManip: function(e, i, n) {
      e = [].concat.apply([], e);
      var r, a, s, o, l = 0, c = e[0], d = [], h = this.length;
      if (!Z.support.checkClone && h > 1 && "string" == typeof c && Kt.test(c)) return this.each(function() {
        Z(this).domManip(e, i, n);
      });
      if (Z.isFunction(c)) return this.each(function(r) {
        var a = Z(this);
        e[0] = c.call(this, r, i ? a.html() : t), a.domManip(e, i, n);
      });
      if (this[0]) {
        if (r = Z.buildFragment(e, this, d), s = r.fragment, a = s.firstChild, 1 === s.childNodes.length && (s = a), 
        a) for (i = i && Z.nodeName(a, "tr"), o = r.cacheable || h - 1; h > l; l++) n.call(i && Z.nodeName(this[l], "table") ? u(this[l], "tbody") : this[l], l === o ? s : Z.clone(s, !0, !0));
        s = a = null, d.length && Z.each(d, function(e, t) {
          t.src ? Z.ajax ? Z.ajax({
            url: t.src,
            type: "GET",
            dataType: "script",
            async: !1,
            global: !1,
            "throws": !0
          }) : Z.error("no ajax") : Z.globalEval((t.text || t.textContent || t.innerHTML || "").replace(Zt, "")), 
          t.parentNode && t.parentNode.removeChild(t);
        });
      }
      return this;
    }
  }), Z.buildFragment = function(e, i, n) {
    var r, a, s, o = e[0];
    return i = i || j, i = !i.nodeType && i[0] || i, i = i.ownerDocument || i, !(1 === e.length && "string" == typeof o && 512 > o.length && i === j && "<" === o.charAt(0)) || Yt.test(o) || !Z.support.checkClone && Kt.test(o) || !Z.support.html5Clone && Vt.test(o) || (a = !0, 
    r = Z.fragments[o], s = r !== t), r || (r = i.createDocumentFragment(), Z.clean(e, i, r, n), 
    a && (Z.fragments[o] = s && r)), {
      fragment: r,
      cacheable: a
    };
  }, Z.fragments = {}, Z.each({
    appendTo: "append",
    prependTo: "prepend",
    insertBefore: "before",
    insertAfter: "after",
    replaceAll: "replaceWith"
  }, function(e, t) {
    Z.fn[e] = function(i) {
      var n, r = 0, a = [], s = Z(i), o = s.length, l = 1 === this.length && this[0].parentNode;
      if ((null == l || l && 11 === l.nodeType && 1 === l.childNodes.length) && 1 === o) return s[t](this[0]), 
      this;
      for (;o > r; r++) n = (r > 0 ? this.clone(!0) : this).get(), Z(s[r])[t](n), a = a.concat(n);
      return this.pushStack(a, e, s.selector);
    };
  }), Z.extend({
    clone: function(e, t, i) {
      var n, r, a, s;
      if (Z.support.html5Clone || Z.isXMLDoc(e) || !Vt.test("<" + e.nodeName + ">") ? s = e.cloneNode(!0) : (ti.innerHTML = e.outerHTML, 
      ti.removeChild(s = ti.firstChild)), !(Z.support.noCloneEvent && Z.support.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || Z.isXMLDoc(e))) for (p(e, s), 
      n = f(e), r = f(s), a = 0; n[a]; ++a) r[a] && p(n[a], r[a]);
      if (t && (h(e, s), i)) for (n = f(e), r = f(s), a = 0; n[a]; ++a) h(n[a], r[a]);
      return n = r = null, s;
    },
    clean: function(e, i, n, r) {
      var a, s, o, l, c, u, h, p, f, g, v, y = i === j && ei, _ = [];
      for (i && i.createDocumentFragment !== t || (i = j), a = 0; null != (o = e[a]); a++) if ("number" == typeof o && (o += ""), 
      o) {
        if ("string" == typeof o) if (Wt.test(o)) {
          for (y = y || d(i), h = i.createElement("div"), y.appendChild(h), o = o.replace(qt, "<$1></$2>"), 
          l = (Ut.exec(o) || [ "", "" ])[1].toLowerCase(), c = Qt[l] || Qt._default, u = c[0], 
          h.innerHTML = c[1] + o + c[2]; u--; ) h = h.lastChild;
          if (!Z.support.tbody) for (p = Bt.test(o), f = "table" !== l || p ? "<table>" !== c[1] || p ? [] : h.childNodes : h.firstChild && h.firstChild.childNodes, 
          s = f.length - 1; s >= 0; --s) Z.nodeName(f[s], "tbody") && !f[s].childNodes.length && f[s].parentNode.removeChild(f[s]);
          !Z.support.leadingWhitespace && jt.test(o) && h.insertBefore(i.createTextNode(jt.exec(o)[0]), h.firstChild), 
          o = h.childNodes, h.parentNode.removeChild(h);
        } else o = i.createTextNode(o);
        o.nodeType ? _.push(o) : Z.merge(_, o);
      }
      if (h && (o = h = y = null), !Z.support.appendChecked) for (a = 0; null != (o = _[a]); a++) Z.nodeName(o, "input") ? m(o) : o.getElementsByTagName !== t && Z.grep(o.getElementsByTagName("input"), m);
      if (n) for (g = function(e) {
        return !e.type || Jt.test(e.type) ? r ? r.push(e.parentNode ? e.parentNode.removeChild(e) : e) : n.appendChild(e) : t;
      }, a = 0; null != (o = _[a]); a++) Z.nodeName(o, "script") && g(o) || (n.appendChild(o), 
      o.getElementsByTagName !== t && (v = Z.grep(Z.merge([], o.getElementsByTagName("script")), g), 
      _.splice.apply(_, [ a + 1, 0 ].concat(v)), a += v.length));
      return _;
    },
    cleanData: function(e, t) {
      for (var i, n, r, a, s = 0, o = Z.expando, l = Z.cache, c = Z.support.deleteExpando, d = Z.event.special; null != (r = e[s]); s++) if ((t || Z.acceptData(r)) && (n = r[o], 
      i = n && l[n])) {
        if (i.events) for (a in i.events) d[a] ? Z.event.remove(r, a) : Z.removeEvent(r, a, i.handle);
        l[n] && (delete l[n], c ? delete r[o] : r.removeAttribute ? r.removeAttribute(o) : r[o] = null, 
        Z.deletedIds.push(n));
      }
    }
  }), function() {
    var e, t;
    Z.uaMatch = function(e) {
      e = e.toLowerCase();
      var t = /(chrome)[ \/]([\w.]+)/.exec(e) || /(webkit)[ \/]([\w.]+)/.exec(e) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e) || /(msie) ([\w.]+)/.exec(e) || 0 > e.indexOf("compatible") && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e) || [];
      return {
        browser: t[1] || "",
        version: t[2] || "0"
      };
    }, e = Z.uaMatch(U.userAgent), t = {}, e.browser && (t[e.browser] = !0, t.version = e.version), 
    t.chrome ? t.webkit = !0 : t.webkit && (t.safari = !0), Z.browser = t, Z.sub = function() {
      function e(t, i) {
        return new e.fn.init(t, i);
      }
      Z.extend(!0, e, this), e.superclass = this, e.fn = e.prototype = this(), e.fn.constructor = e, 
      e.sub = this.sub, e.fn.init = function(i, n) {
        return n && n instanceof Z && !(n instanceof e) && (n = e(n)), Z.fn.init.call(this, i, n, t);
      }, e.fn.init.prototype = e.fn;
      var t = e(j);
      return e;
    };
  }();
  var ii, ni, ri, ai = /alpha\([^)]*\)/i, si = /opacity=([^)]*)/, oi = /^(top|right|bottom|left)$/, li = /^(none|table(?!-c[ea]).+)/, ci = /^margin/, di = RegExp("^(" + Q + ")(.*)$", "i"), ui = RegExp("^(" + Q + ")(?!px)[a-z%]+$", "i"), hi = RegExp("^([-+])=(" + Q + ")", "i"), pi = {}, fi = {
    position: "absolute",
    visibility: "hidden",
    display: "block"
  }, mi = {
    letterSpacing: 0,
    fontWeight: 400
  }, gi = [ "Top", "Right", "Bottom", "Left" ], vi = [ "Webkit", "O", "Moz", "ms" ], yi = Z.fn.toggle;
  Z.fn.extend({
    css: function(e, i) {
      return Z.access(this, function(e, i, n) {
        return n !== t ? Z.style(e, i, n) : Z.css(e, i);
      }, e, i, arguments.length > 1);
    },
    show: function() {
      return y(this, !0);
    },
    hide: function() {
      return y(this);
    },
    toggle: function(e, t) {
      var i = "boolean" == typeof e;
      return Z.isFunction(e) && Z.isFunction(t) ? yi.apply(this, arguments) : this.each(function() {
        (i ? e : v(this)) ? Z(this).show() : Z(this).hide();
      });
    }
  }), Z.extend({
    cssHooks: {
      opacity: {
        get: function(e, t) {
          if (t) {
            var i = ii(e, "opacity");
            return "" === i ? "1" : i;
          }
        }
      }
    },
    cssNumber: {
      fillOpacity: !0,
      fontWeight: !0,
      lineHeight: !0,
      opacity: !0,
      orphans: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0
    },
    cssProps: {
      "float": Z.support.cssFloat ? "cssFloat" : "styleFloat"
    },
    style: function(e, i, n, r) {
      if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
        var a, s, o, l = Z.camelCase(i), c = e.style;
        if (i = Z.cssProps[l] || (Z.cssProps[l] = g(c, l)), o = Z.cssHooks[i] || Z.cssHooks[l], 
        n === t) return o && "get" in o && (a = o.get(e, !1, r)) !== t ? a : c[i];
        if (s = typeof n, "string" === s && (a = hi.exec(n)) && (n = (a[1] + 1) * a[2] + parseFloat(Z.css(e, i)), 
        s = "number"), !(null == n || "number" === s && isNaN(n) || ("number" !== s || Z.cssNumber[l] || (n += "px"), 
        o && "set" in o && (n = o.set(e, n, r)) === t))) try {
          c[i] = n;
        } catch (d) {}
      }
    },
    css: function(e, i, n, r) {
      var a, s, o, l = Z.camelCase(i);
      return i = Z.cssProps[l] || (Z.cssProps[l] = g(e.style, l)), o = Z.cssHooks[i] || Z.cssHooks[l], 
      o && "get" in o && (a = o.get(e, !0, r)), a === t && (a = ii(e, i)), "normal" === a && i in mi && (a = mi[i]), 
      n || r !== t ? (s = parseFloat(a), n || Z.isNumeric(s) ? s || 0 : a) : a;
    },
    swap: function(e, t, i) {
      var n, r, a = {};
      for (r in t) a[r] = e.style[r], e.style[r] = t[r];
      n = i.call(e);
      for (r in t) e.style[r] = a[r];
      return n;
    }
  }), e.getComputedStyle ? ii = function(t, i) {
    var n, r, a, s, o = e.getComputedStyle(t, null), l = t.style;
    return o && (n = o[i], "" !== n || Z.contains(t.ownerDocument, t) || (n = Z.style(t, i)), 
    ui.test(n) && ci.test(i) && (r = l.width, a = l.minWidth, s = l.maxWidth, l.minWidth = l.maxWidth = l.width = n, 
    n = o.width, l.width = r, l.minWidth = a, l.maxWidth = s)), n;
  } : j.documentElement.currentStyle && (ii = function(e, t) {
    var i, n, r = e.currentStyle && e.currentStyle[t], a = e.style;
    return null == r && a && a[t] && (r = a[t]), ui.test(r) && !oi.test(t) && (i = a.left, 
    n = e.runtimeStyle && e.runtimeStyle.left, n && (e.runtimeStyle.left = e.currentStyle.left), 
    a.left = "fontSize" === t ? "1em" : r, r = a.pixelLeft + "px", a.left = i, n && (e.runtimeStyle.left = n)), 
    "" === r ? "auto" : r;
  }), Z.each([ "height", "width" ], function(e, i) {
    Z.cssHooks[i] = {
      get: function(e, n, r) {
        return n ? 0 === e.offsetWidth && li.test(ii(e, "display")) ? Z.swap(e, fi, function() {
          return x(e, i, r);
        }) : x(e, i, r) : t;
      },
      set: function(e, t, n) {
        return _(e, t, n ? b(e, i, n, Z.support.boxSizing && "border-box" === Z.css(e, "boxSizing")) : 0);
      }
    };
  }), Z.support.opacity || (Z.cssHooks.opacity = {
    get: function(e, t) {
      return si.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : "";
    },
    set: function(e, t) {
      var i = e.style, n = e.currentStyle, r = Z.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : "", a = n && n.filter || i.filter || "";
      i.zoom = 1, t >= 1 && "" === Z.trim(a.replace(ai, "")) && i.removeAttribute && (i.removeAttribute("filter"), 
      n && !n.filter) || (i.filter = ai.test(a) ? a.replace(ai, r) : a + " " + r);
    }
  }), Z(function() {
    Z.support.reliableMarginRight || (Z.cssHooks.marginRight = {
      get: function(e, i) {
        return Z.swap(e, {
          display: "inline-block"
        }, function() {
          return i ? ii(e, "marginRight") : t;
        });
      }
    }), !Z.support.pixelPosition && Z.fn.position && Z.each([ "top", "left" ], function(e, t) {
      Z.cssHooks[t] = {
        get: function(e, i) {
          if (i) {
            var n = ii(e, t);
            return ui.test(n) ? Z(e).position()[t] + "px" : n;
          }
        }
      };
    });
  }), Z.expr && Z.expr.filters && (Z.expr.filters.hidden = function(e) {
    return 0 === e.offsetWidth && 0 === e.offsetHeight || !Z.support.reliableHiddenOffsets && "none" === (e.style && e.style.display || ii(e, "display"));
  }, Z.expr.filters.visible = function(e) {
    return !Z.expr.filters.hidden(e);
  }), Z.each({
    margin: "",
    padding: "",
    border: "Width"
  }, function(e, t) {
    Z.cssHooks[e + t] = {
      expand: function(i) {
        var n, r = "string" == typeof i ? i.split(" ") : [ i ], a = {};
        for (n = 0; 4 > n; n++) a[e + gi[n] + t] = r[n] || r[n - 2] || r[0];
        return a;
      }
    }, ci.test(e) || (Z.cssHooks[e + t].set = _);
  });
  var _i = /%20/g, bi = /\[\]$/, xi = /\r?\n/g, wi = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i, ki = /^(?:select|textarea)/i;
  Z.fn.extend({
    serialize: function() {
      return Z.param(this.serializeArray());
    },
    serializeArray: function() {
      return this.map(function() {
        return this.elements ? Z.makeArray(this.elements) : this;
      }).filter(function() {
        return this.name && !this.disabled && (this.checked || ki.test(this.nodeName) || wi.test(this.type));
      }).map(function(e, t) {
        var i = Z(this).val();
        return null == i ? null : Z.isArray(i) ? Z.map(i, function(e) {
          return {
            name: t.name,
            value: e.replace(xi, "\r\n")
          };
        }) : {
          name: t.name,
          value: i.replace(xi, "\r\n")
        };
      }).get();
    }
  }), Z.param = function(e, i) {
    var n, r = [], a = function(e, t) {
      t = Z.isFunction(t) ? t() : null == t ? "" : t, r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t);
    };
    if (i === t && (i = Z.ajaxSettings && Z.ajaxSettings.traditional), Z.isArray(e) || e.jquery && !Z.isPlainObject(e)) Z.each(e, function() {
      a(this.name, this.value);
    }); else for (n in e) k(n, e[n], i, a);
    return r.join("&").replace(_i, "+");
  };
  var Ci, Ei, Ti = /#.*$/, $i = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, Mi = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/, Si = /^(?:GET|HEAD)$/, Ii = /^\/\//, Ni = /\?/, Di = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, Ai = /([?&])_=[^&]*/, Pi = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/, Oi = Z.fn.load, Li = {}, zi = {}, Hi = [ "*/" ] + [ "*" ];
  try {
    Ei = q.href;
  } catch (Ri) {
    Ei = j.createElement("a"), Ei.href = "", Ei = Ei.href;
  }
  Ci = Pi.exec(Ei.toLowerCase()) || [], Z.fn.load = function(e, i, n) {
    if ("string" != typeof e && Oi) return Oi.apply(this, arguments);
    if (!this.length) return this;
    var r, a, s, o = this, l = e.indexOf(" ");
    return l >= 0 && (r = e.slice(l, e.length), e = e.slice(0, l)), Z.isFunction(i) ? (n = i, 
    i = t) : i && "object" == typeof i && (a = "POST"), Z.ajax({
      url: e,
      type: a,
      dataType: "html",
      data: i,
      complete: function(e, t) {
        n && o.each(n, s || [ e.responseText, t, e ]);
      }
    }).done(function(e) {
      s = arguments, o.html(r ? Z("<div>").append(e.replace(Di, "")).find(r) : e);
    }), this;
  }, Z.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(e, t) {
    Z.fn[t] = function(e) {
      return this.on(t, e);
    };
  }), Z.each([ "get", "post" ], function(e, i) {
    Z[i] = function(e, n, r, a) {
      return Z.isFunction(n) && (a = a || r, r = n, n = t), Z.ajax({
        type: i,
        url: e,
        data: n,
        success: r,
        dataType: a
      });
    };
  }), Z.extend({
    getScript: function(e, i) {
      return Z.get(e, t, i, "script");
    },
    getJSON: function(e, t, i) {
      return Z.get(e, t, i, "json");
    },
    ajaxSetup: function(e, t) {
      return t ? T(e, Z.ajaxSettings) : (t = e, e = Z.ajaxSettings), T(e, t), e;
    },
    ajaxSettings: {
      url: Ei,
      isLocal: Mi.test(Ci[1]),
      global: !0,
      type: "GET",
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      processData: !0,
      async: !0,
      accepts: {
        xml: "application/xml, text/xml",
        html: "text/html",
        text: "text/plain",
        json: "application/json, text/javascript",
        "*": Hi
      },
      contents: {
        xml: /xml/,
        html: /html/,
        json: /json/
      },
      responseFields: {
        xml: "responseXML",
        text: "responseText"
      },
      converters: {
        "* text": e.String,
        "text html": !0,
        "text json": Z.parseJSON,
        "text xml": Z.parseXML
      },
      flatOptions: {
        context: !0,
        url: !0
      }
    },
    ajaxPrefilter: C(Li),
    ajaxTransport: C(zi),
    ajax: function(e, i) {
      function n(e, i, n, s) {
        var c, u, y, _, x, k = i;
        2 !== b && (b = 2, l && clearTimeout(l), o = t, a = s || "", w.readyState = e > 0 ? 4 : 0, 
        n && (_ = $(h, w, n)), e >= 200 && 300 > e || 304 === e ? (h.ifModified && (x = w.getResponseHeader("Last-Modified"), 
        x && (Z.lastModified[r] = x), x = w.getResponseHeader("Etag"), x && (Z.etag[r] = x)), 
        304 === e ? (k = "notmodified", c = !0) : (c = M(h, _), k = c.state, u = c.data, 
        y = c.error, c = !y)) : (y = k, (!k || e) && (k = "error", 0 > e && (e = 0))), w.status = e, 
        w.statusText = (i || k) + "", c ? m.resolveWith(p, [ u, k, w ]) : m.rejectWith(p, [ w, k, y ]), 
        w.statusCode(v), v = t, d && f.trigger("ajax" + (c ? "Success" : "Error"), [ w, h, c ? u : y ]), 
        g.fireWith(p, [ w, k ]), d && (f.trigger("ajaxComplete", [ w, h ]), --Z.active || Z.event.trigger("ajaxStop")));
      }
      "object" == typeof e && (i = e, e = t), i = i || {};
      var r, a, s, o, l, c, d, u, h = Z.ajaxSetup({}, i), p = h.context || h, f = p !== h && (p.nodeType || p instanceof Z) ? Z(p) : Z.event, m = Z.Deferred(), g = Z.Callbacks("once memory"), v = h.statusCode || {}, y = {}, _ = {}, b = 0, x = "canceled", w = {
        readyState: 0,
        setRequestHeader: function(e, t) {
          if (!b) {
            var i = e.toLowerCase();
            e = _[i] = _[i] || e, y[e] = t;
          }
          return this;
        },
        getAllResponseHeaders: function() {
          return 2 === b ? a : null;
        },
        getResponseHeader: function(e) {
          var i;
          if (2 === b) {
            if (!s) for (s = {}; i = $i.exec(a); ) s[i[1].toLowerCase()] = i[2];
            i = s[e.toLowerCase()];
          }
          return i === t ? null : i;
        },
        overrideMimeType: function(e) {
          return b || (h.mimeType = e), this;
        },
        abort: function(e) {
          return e = e || x, o && o.abort(e), n(0, e), this;
        }
      };
      if (m.promise(w), w.success = w.done, w.error = w.fail, w.complete = g.add, w.statusCode = function(e) {
        if (e) {
          var t;
          if (2 > b) for (t in e) v[t] = [ v[t], e[t] ]; else t = e[w.status], w.always(t);
        }
        return this;
      }, h.url = ((e || h.url) + "").replace(Ti, "").replace(Ii, Ci[1] + "//"), h.dataTypes = Z.trim(h.dataType || "*").toLowerCase().split(tt), 
      null == h.crossDomain && (c = Pi.exec(h.url.toLowerCase()) || !1, h.crossDomain = c && c.join(":") + (c[3] ? "" : "http:" === c[1] ? 80 : 443) !== Ci.join(":") + (Ci[3] ? "" : "http:" === Ci[1] ? 80 : 443)), 
      h.data && h.processData && "string" != typeof h.data && (h.data = Z.param(h.data, h.traditional)), 
      E(Li, h, i, w), 2 === b) return w;
      if (d = h.global, h.type = h.type.toUpperCase(), h.hasContent = !Si.test(h.type), 
      d && 0 === Z.active++ && Z.event.trigger("ajaxStart"), !h.hasContent && (h.data && (h.url += (Ni.test(h.url) ? "&" : "?") + h.data, 
      delete h.data), r = h.url, h.cache === !1)) {
        var k = Z.now(), C = h.url.replace(Ai, "$1_=" + k);
        h.url = C + (C === h.url ? (Ni.test(h.url) ? "&" : "?") + "_=" + k : "");
      }
      (h.data && h.hasContent && h.contentType !== !1 || i.contentType) && w.setRequestHeader("Content-Type", h.contentType), 
      h.ifModified && (r = r || h.url, Z.lastModified[r] && w.setRequestHeader("If-Modified-Since", Z.lastModified[r]), 
      Z.etag[r] && w.setRequestHeader("If-None-Match", Z.etag[r])), w.setRequestHeader("Accept", h.dataTypes[0] && h.accepts[h.dataTypes[0]] ? h.accepts[h.dataTypes[0]] + ("*" !== h.dataTypes[0] ? ", " + Hi + "; q=0.01" : "") : h.accepts["*"]);
      for (u in h.headers) w.setRequestHeader(u, h.headers[u]);
      if (h.beforeSend && (h.beforeSend.call(p, w, h) === !1 || 2 === b)) return w.abort();
      x = "abort";
      for (u in {
        success: 1,
        error: 1,
        complete: 1
      }) w[u](h[u]);
      if (o = E(zi, h, i, w)) {
        w.readyState = 1, d && f.trigger("ajaxSend", [ w, h ]), h.async && h.timeout > 0 && (l = setTimeout(function() {
          w.abort("timeout");
        }, h.timeout));
        try {
          b = 1, o.send(y, n);
        } catch (T) {
          if (!(2 > b)) throw T;
          n(-1, T);
        }
      } else n(-1, "No Transport");
      return w;
    },
    active: 0,
    lastModified: {},
    etag: {}
  });
  var Fi = [], ji = /\?/, qi = /(=)\?(?=&|$)|\?\?/, Ui = Z.now();
  Z.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function() {
      var e = Fi.pop() || Z.expando + "_" + Ui++;
      return this[e] = !0, e;
    }
  }), Z.ajaxPrefilter("json jsonp", function(i, n, r) {
    var a, s, o, l = i.data, c = i.url, d = i.jsonp !== !1, u = d && qi.test(c), h = d && !u && "string" == typeof l && !(i.contentType || "").indexOf("application/x-www-form-urlencoded") && qi.test(l);
    return "jsonp" === i.dataTypes[0] || u || h ? (a = i.jsonpCallback = Z.isFunction(i.jsonpCallback) ? i.jsonpCallback() : i.jsonpCallback, 
    s = e[a], u ? i.url = c.replace(qi, "$1" + a) : h ? i.data = l.replace(qi, "$1" + a) : d && (i.url += (ji.test(c) ? "&" : "?") + i.jsonp + "=" + a), 
    i.converters["script json"] = function() {
      return o || Z.error(a + " was not called"), o[0];
    }, i.dataTypes[0] = "json", e[a] = function() {
      o = arguments;
    }, r.always(function() {
      e[a] = s, i[a] && (i.jsonpCallback = n.jsonpCallback, Fi.push(a)), o && Z.isFunction(s) && s(o[0]), 
      o = s = t;
    }), "script") : t;
  }), Z.ajaxSetup({
    accepts: {
      script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
    },
    contents: {
      script: /javascript|ecmascript/
    },
    converters: {
      "text script": function(e) {
        return Z.globalEval(e), e;
      }
    }
  }), Z.ajaxPrefilter("script", function(e) {
    e.cache === t && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1);
  }), Z.ajaxTransport("script", function(e) {
    if (e.crossDomain) {
      var i, n = j.head || j.getElementsByTagName("head")[0] || j.documentElement;
      return {
        send: function(r, a) {
          i = j.createElement("script"), i.async = "async", e.scriptCharset && (i.charset = e.scriptCharset), 
          i.src = e.url, i.onload = i.onreadystatechange = function(e, r) {
            (r || !i.readyState || /loaded|complete/.test(i.readyState)) && (i.onload = i.onreadystatechange = null, 
            n && i.parentNode && n.removeChild(i), i = t, r || a(200, "success"));
          }, n.insertBefore(i, n.firstChild);
        },
        abort: function() {
          i && i.onload(0, 1);
        }
      };
    }
  });
  var Bi, Wi = e.ActiveXObject ? function() {
    for (var e in Bi) Bi[e](0, 1);
  } : !1, Xi = 0;
  Z.ajaxSettings.xhr = e.ActiveXObject ? function() {
    return !this.isLocal && S() || I();
  } : S, function(e) {
    Z.extend(Z.support, {
      ajax: !!e,
      cors: !!e && "withCredentials" in e
    });
  }(Z.ajaxSettings.xhr()), Z.support.ajax && Z.ajaxTransport(function(i) {
    if (!i.crossDomain || Z.support.cors) {
      var n;
      return {
        send: function(r, a) {
          var s, o, l = i.xhr();
          if (i.username ? l.open(i.type, i.url, i.async, i.username, i.password) : l.open(i.type, i.url, i.async), 
          i.xhrFields) for (o in i.xhrFields) l[o] = i.xhrFields[o];
          i.mimeType && l.overrideMimeType && l.overrideMimeType(i.mimeType), i.crossDomain || r["X-Requested-With"] || (r["X-Requested-With"] = "XMLHttpRequest");
          try {
            for (o in r) l.setRequestHeader(o, r[o]);
          } catch (c) {}
          l.send(i.hasContent && i.data || null), n = function(e, r) {
            var o, c, d, u, h;
            try {
              if (n && (r || 4 === l.readyState)) if (n = t, s && (l.onreadystatechange = Z.noop, 
              Wi && delete Bi[s]), r) 4 !== l.readyState && l.abort(); else {
                o = l.status, d = l.getAllResponseHeaders(), u = {}, h = l.responseXML, h && h.documentElement && (u.xml = h);
                try {
                  u.text = l.responseText;
                } catch (e) {}
                try {
                  c = l.statusText;
                } catch (p) {
                  c = "";
                }
                o || !i.isLocal || i.crossDomain ? 1223 === o && (o = 204) : o = u.text ? 200 : 404;
              }
            } catch (f) {
              r || a(-1, f);
            }
            u && a(o, c, u, d);
          }, i.async ? 4 === l.readyState ? setTimeout(n, 0) : (s = ++Xi, Wi && (Bi || (Bi = {}, 
          Z(e).unload(Wi)), Bi[s] = n), l.onreadystatechange = n) : n();
        },
        abort: function() {
          n && n(0, 1);
        }
      };
    }
  });
  var Yi, Vi, Gi = /^(?:toggle|show|hide)$/, Ki = RegExp("^(?:([-+])=|)(" + Q + ")([a-z%]*)$", "i"), Ji = /queueHooks$/, Zi = [ O ], Qi = {
    "*": [ function(e, t) {
      var i, n, r = this.createTween(e, t), a = Ki.exec(t), s = r.cur(), o = +s || 0, l = 1, c = 20;
      if (a) {
        if (i = +a[2], n = a[3] || (Z.cssNumber[e] ? "" : "px"), "px" !== n && o) {
          o = Z.css(r.elem, e, !0) || i || 1;
          do l = l || ".5", o /= l, Z.style(r.elem, e, o + n); while (l !== (l = r.cur() / s) && 1 !== l && --c);
        }
        r.unit = n, r.start = o, r.end = a[1] ? o + (a[1] + 1) * i : i;
      }
      return r;
    } ]
  };
  Z.Animation = Z.extend(A, {
    tweener: function(e, t) {
      Z.isFunction(e) ? (t = e, e = [ "*" ]) : e = e.split(" ");
      for (var i, n = 0, r = e.length; r > n; n++) i = e[n], Qi[i] = Qi[i] || [], Qi[i].unshift(t);
    },
    prefilter: function(e, t) {
      t ? Zi.unshift(e) : Zi.push(e);
    }
  }), Z.Tween = L, L.prototype = {
    constructor: L,
    init: function(e, t, i, n, r, a) {
      this.elem = e, this.prop = i, this.easing = r || "swing", this.options = t, this.start = this.now = this.cur(), 
      this.end = n, this.unit = a || (Z.cssNumber[i] ? "" : "px");
    },
    cur: function() {
      var e = L.propHooks[this.prop];
      return e && e.get ? e.get(this) : L.propHooks._default.get(this);
    },
    run: function(e) {
      var t, i = L.propHooks[this.prop];
      return this.pos = t = this.options.duration ? Z.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : e, 
      this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), 
      i && i.set ? i.set(this) : L.propHooks._default.set(this), this;
    }
  }, L.prototype.init.prototype = L.prototype, L.propHooks = {
    _default: {
      get: function(e) {
        var t;
        return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = Z.css(e.elem, e.prop, !1, ""), 
        t && "auto" !== t ? t : 0) : e.elem[e.prop];
      },
      set: function(e) {
        Z.fx.step[e.prop] ? Z.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[Z.cssProps[e.prop]] || Z.cssHooks[e.prop]) ? Z.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now;
      }
    }
  }, L.propHooks.scrollTop = L.propHooks.scrollLeft = {
    set: function(e) {
      e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now);
    }
  }, Z.each([ "toggle", "show", "hide" ], function(e, t) {
    var i = Z.fn[t];
    Z.fn[t] = function(n, r, a) {
      return null == n || "boolean" == typeof n || !e && Z.isFunction(n) && Z.isFunction(r) ? i.apply(this, arguments) : this.animate(z(t, !0), n, r, a);
    };
  }), Z.fn.extend({
    fadeTo: function(e, t, i, n) {
      return this.filter(v).css("opacity", 0).show().end().animate({
        opacity: t
      }, e, i, n);
    },
    animate: function(e, t, i, n) {
      var r = Z.isEmptyObject(e), a = Z.speed(t, i, n), s = function() {
        var t = A(this, Z.extend({}, e), a);
        r && t.stop(!0);
      };
      return r || a.queue === !1 ? this.each(s) : this.queue(a.queue, s);
    },
    stop: function(e, i, n) {
      var r = function(e) {
        var t = e.stop;
        delete e.stop, t(n);
      };
      return "string" != typeof e && (n = i, i = e, e = t), i && e !== !1 && this.queue(e || "fx", []), 
      this.each(function() {
        var t = !0, i = null != e && e + "queueHooks", a = Z.timers, s = Z._data(this);
        if (i) s[i] && s[i].stop && r(s[i]); else for (i in s) s[i] && s[i].stop && Ji.test(i) && r(s[i]);
        for (i = a.length; i--; ) a[i].elem !== this || null != e && a[i].queue !== e || (a[i].anim.stop(n), 
        t = !1, a.splice(i, 1));
        (t || !n) && Z.dequeue(this, e);
      });
    }
  }), Z.each({
    slideDown: z("show"),
    slideUp: z("hide"),
    slideToggle: z("toggle"),
    fadeIn: {
      opacity: "show"
    },
    fadeOut: {
      opacity: "hide"
    },
    fadeToggle: {
      opacity: "toggle"
    }
  }, function(e, t) {
    Z.fn[e] = function(e, i, n) {
      return this.animate(t, e, i, n);
    };
  }), Z.speed = function(e, t, i) {
    var n = e && "object" == typeof e ? Z.extend({}, e) : {
      complete: i || !i && t || Z.isFunction(e) && e,
      duration: e,
      easing: i && t || t && !Z.isFunction(t) && t
    };
    return n.duration = Z.fx.off ? 0 : "number" == typeof n.duration ? n.duration : n.duration in Z.fx.speeds ? Z.fx.speeds[n.duration] : Z.fx.speeds._default, 
    (null == n.queue || n.queue === !0) && (n.queue = "fx"), n.old = n.complete, n.complete = function() {
      Z.isFunction(n.old) && n.old.call(this), n.queue && Z.dequeue(this, n.queue);
    }, n;
  }, Z.easing = {
    linear: function(e) {
      return e;
    },
    swing: function(e) {
      return .5 - Math.cos(e * Math.PI) / 2;
    }
  }, Z.timers = [], Z.fx = L.prototype.init, Z.fx.tick = function() {
    for (var e, t = Z.timers, i = 0; t.length > i; i++) e = t[i], e() || t[i] !== e || t.splice(i--, 1);
    t.length || Z.fx.stop();
  }, Z.fx.timer = function(e) {
    e() && Z.timers.push(e) && !Vi && (Vi = setInterval(Z.fx.tick, Z.fx.interval));
  }, Z.fx.interval = 13, Z.fx.stop = function() {
    clearInterval(Vi), Vi = null;
  }, Z.fx.speeds = {
    slow: 600,
    fast: 200,
    _default: 400
  }, Z.fx.step = {}, Z.expr && Z.expr.filters && (Z.expr.filters.animated = function(e) {
    return Z.grep(Z.timers, function(t) {
      return e === t.elem;
    }).length;
  });
  var en = /^(?:body|html)$/i;
  Z.fn.offset = function(e) {
    if (arguments.length) return e === t ? this : this.each(function(t) {
      Z.offset.setOffset(this, e, t);
    });
    var i, n, r, a, s, o, l, c = {
      top: 0,
      left: 0
    }, d = this[0], u = d && d.ownerDocument;
    if (u) return (n = u.body) === d ? Z.offset.bodyOffset(d) : (i = u.documentElement, 
    Z.contains(i, d) ? (d.getBoundingClientRect !== t && (c = d.getBoundingClientRect()), 
    r = H(u), a = i.clientTop || n.clientTop || 0, s = i.clientLeft || n.clientLeft || 0, 
    o = r.pageYOffset || i.scrollTop, l = r.pageXOffset || i.scrollLeft, {
      top: c.top + o - a,
      left: c.left + l - s
    }) : c);
  }, Z.offset = {
    bodyOffset: function(e) {
      var t = e.offsetTop, i = e.offsetLeft;
      return Z.support.doesNotIncludeMarginInBodyOffset && (t += parseFloat(Z.css(e, "marginTop")) || 0, 
      i += parseFloat(Z.css(e, "marginLeft")) || 0), {
        top: t,
        left: i
      };
    },
    setOffset: function(e, t, i) {
      var n = Z.css(e, "position");
      "static" === n && (e.style.position = "relative");
      var r, a, s = Z(e), o = s.offset(), l = Z.css(e, "top"), c = Z.css(e, "left"), d = ("absolute" === n || "fixed" === n) && Z.inArray("auto", [ l, c ]) > -1, u = {}, h = {};
      d ? (h = s.position(), r = h.top, a = h.left) : (r = parseFloat(l) || 0, a = parseFloat(c) || 0), 
      Z.isFunction(t) && (t = t.call(e, i, o)), null != t.top && (u.top = t.top - o.top + r), 
      null != t.left && (u.left = t.left - o.left + a), "using" in t ? t.using.call(e, u) : s.css(u);
    }
  }, Z.fn.extend({
    position: function() {
      if (this[0]) {
        var e = this[0], t = this.offsetParent(), i = this.offset(), n = en.test(t[0].nodeName) ? {
          top: 0,
          left: 0
        } : t.offset();
        return i.top -= parseFloat(Z.css(e, "marginTop")) || 0, i.left -= parseFloat(Z.css(e, "marginLeft")) || 0, 
        n.top += parseFloat(Z.css(t[0], "borderTopWidth")) || 0, n.left += parseFloat(Z.css(t[0], "borderLeftWidth")) || 0, 
        {
          top: i.top - n.top,
          left: i.left - n.left
        };
      }
    },
    offsetParent: function() {
      return this.map(function() {
        for (var e = this.offsetParent || j.body; e && !en.test(e.nodeName) && "static" === Z.css(e, "position"); ) e = e.offsetParent;
        return e || j.body;
      });
    }
  }), Z.each({
    scrollLeft: "pageXOffset",
    scrollTop: "pageYOffset"
  }, function(e, i) {
    var n = /Y/.test(i);
    Z.fn[e] = function(r) {
      return Z.access(this, function(e, r, a) {
        var s = H(e);
        return a === t ? s ? i in s ? s[i] : s.document.documentElement[r] : e[r] : (s ? s.scrollTo(n ? Z(s).scrollLeft() : a, n ? a : Z(s).scrollTop()) : e[r] = a, 
        t);
      }, e, r, arguments.length, null);
    };
  }), Z.each({
    Height: "height",
    Width: "width"
  }, function(e, i) {
    Z.each({
      padding: "inner" + e,
      content: i,
      "": "outer" + e
    }, function(n, r) {
      Z.fn[r] = function(r, a) {
        var s = arguments.length && (n || "boolean" != typeof r), o = n || (r === !0 || a === !0 ? "margin" : "border");
        return Z.access(this, function(i, n, r) {
          var a;
          return Z.isWindow(i) ? i.document.documentElement["client" + e] : 9 === i.nodeType ? (a = i.documentElement, 
          Math.max(i.body["scroll" + e], a["scroll" + e], i.body["offset" + e], a["offset" + e], a["client" + e])) : r === t ? Z.css(i, n, r, o) : Z.style(i, n, r, o);
        }, i, s ? r : t, s, null);
      };
    });
  }), e.jQuery = e.$ = Z, "function" == typeof define && define.amd && define.amd.jQuery && define("jquery", [], function() {
    return Z;
  });
}(window), define(function(e) {
  "use strict";
  var t = e("jquery");
  t.fn.focusend = function() {
    if (this[0]) {
      var e = this[0], t = e.value.length;
      e.focus();
      try {
        e.setSelectionRange(t, t);
      } catch (i) {}
    }
  };
}), define(function(e) {
  "use strict";
  var t = e("jquery");
  if (t.browser.mozilla) {
    var i = t.event.mouseHooks.filter;
    t.event.mouseHooks.filter = function(e, n) {
      if (e = i(e, n), void 0 === e.offsetX) {
        var r = t(e.target).offset();
        e.offsetY = e.pageY - r.top, e.offsetX = e.pageX - r.left;
      }
      return e;
    };
  }
}), define(function(e) {
  "use strict";
  function t(e) {
    var t, a = e || window.event, s = [].slice.call(arguments, 1), o = 0, l = 0, c = 0, d = 0, u = 0;
    return e = r.event.fix(a), e.type = "mousewheel", a.wheelDelta && (o = a.wheelDelta), 
    a.detail && (o = -1 * a.detail), a.deltaY && (c = -1 * a.deltaY, o = c), a.deltaX && (l = a.deltaX, 
    o = -1 * l), void 0 !== a.wheelDeltaY && (c = a.wheelDeltaY), void 0 !== a.wheelDeltaX && (l = -1 * a.wheelDeltaX), 
    d = Math.abs(o), (!i || i > d) && (i = d), u = Math.max(Math.abs(c), Math.abs(l)), 
    (!n || n > u) && (n = u), t = o > 0 ? "floor" : "ceil", o = Math[t](o / i), l = Math[t](l / n), 
    c = Math[t](c / n), s.unshift(e, o, l, c), (r.event.dispatch || r.event.handle).apply(this, s);
  }
  var i, n, r = e("jquery"), a = [ "wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll" ], s = "onwheel" in document || document.documentMode >= 9 ? [ "wheel" ] : [ "mousewheel", "DomMouseScroll", "MozMousePixelScroll" ];
  if (r.event.fixHooks) for (var o = a.length; o; ) r.event.fixHooks[a[--o]] = r.event.mouseHooks;
  r.event.special.mousewheel = {
    setup: function() {
      if (this.addEventListener) for (var e = s.length; e; ) this.addEventListener(s[--e], t, !1); else this.onmousewheel = t;
    },
    teardown: function() {
      if (this.removeEventListener) for (var e = s.length; e; ) this.removeEventListener(s[--e], t, !1); else this.onmousewheel = null;
    }
  }, r.fn.extend({
    mousewheel: function(e) {
      return e ? this.bind("mousewheel", e) : this.trigger("mousewheel");
    },
    unmousewheel: function(e) {
      return this.unbind("mousewheel", e);
    }
  });
}), define(function(e) {
  "use strict";
  function t(e, t, i) {
    return e = r(e), i = r.fn.dndsortable.defaults.dragenterData, 1 === arguments.length ? e.data(i) || 0 : (t ? e.data(i, Math.max(0, t)) : e.data(i, null), 
    void 0);
  }
  function i(e, t) {
    var i = r(e).next();
    i[0] === t ? r(e).before(t) : (r(t).before(e), i.before(t));
  }
  function n(e, t, i, n, r) {
    if (n) {
      var a = e.data("drag-timer");
      a && (clearTimeout(a), a = null, e.removeData("drag-timer")), a = setTimeout(function() {
        r(t, i);
      }, n), e.data("drag-timer", a);
    } else r(t, i);
  }
  var r = e("jquery");
  r.fn.dndsortable = function(e) {
    return e = r.extend({}, r.fn.dndsortable.defaults, e), this.each(function() {
      var a, s, o = r(this), l = e.list + e.items, c = o.find(e.items);
      c.addClass(e.childClass).prop("draggable", e.draggable), o.on("dragstart.ui", l, function(t) {
        return t.stopPropagation(), t.originalEvent.dataTransfer && (t.originalEvent.dataTransfer.effectAllowed = "moving", 
        t.originalEvent.dataTransfer.setData("Text", e.setData(this))), a = r(s = this).addClass(e.draggingClass).index(), 
        e.start && e.start.call(this, a), !0;
      }).on("dragend.ui", l, function(i) {
        return i.stopPropagation(), r(this).removeClass(e.draggingClass), e.end && e.end.call(this, a), 
        a = void 0, s = null, t(this, !1), !1;
      }).on("dragenter.ui", l, function() {
        if (!s || s === this) return !0;
        var i = this, a = r(i), l = t(this);
        return t(this, l + 1), 0 === l && (a.addClass(e.overClass), e.wrap || n(o, s, this, e.delay, function(t, i) {
          e.enter && e.enter.call(i), a[r(t).index() < a.index() ? "after" : "before"](t);
        })), !1;
      }).on("dragleave.ui", l, function() {
        var i = t(this);
        return t(this, i - 1), t(this) || (r(this).removeClass(e.overClass), t(this, !1), 
        e.leave && e.leave.call(this)), !1;
      }).on("drop.ui", l, function(t) {
        return t.stopPropagation(), t.preventDefault(), this !== s ? (e.wrap && n(o, s, this, e.delay, function(n, r) {
          e.sort ? e.sort.call(o, n, r) : i.call(o, n, r);
          var a;
          t.originalEvent.dataTransfer && (a = t.originalEvent.dataTransfer.getData("Text")), 
          e.change && e.change.call(r, a);
        }), !1) : void 0;
      }).on("dragover.ui", l, function(e) {
        return s ? (e.stopPropagation(), e.preventDefault(), !1) : !0;
      });
    });
  }, r.fn.dndsortable.defaults = {
    delay: 0,
    wrap: !1,
    list: "ul",
    items: "> li",
    overClass: "sortable-over",
    placeholderClass: "sortable-placeholder",
    draggingClass: "sortable-dragging",
    childClass: "sortable-child",
    dragenterData: "child-dragenter",
    setData: function() {}
  };
}), define(function(e) {
  "use strict";
  var t = e("jquery");
  t.event.special.throttledresize = {
    setup: function() {
      t(this).bind("resize", s);
    },
    teardown: function() {
      t(this).unbind("resize", s);
    }
  };
  var i, n, r, a = 250, s = function() {
    n = new Date().getTime(), r = n - o, r >= a ? (o = n, t(this).trigger("throttledresize")) : (i && clearTimeout(i), 
    i = setTimeout(s, a - r));
  }, o = 0;
});

var TWEEN = TWEEN || function() {
  var e = [];
  return {
    REVISION: "10",
    getAll: function() {
      return e;
    },
    removeAll: function() {
      e = [];
    },
    add: function(t) {
      e.push(t);
    },
    remove: function(t) {
      var i = e.indexOf(t);
      -1 !== i && e.splice(i, 1);
    },
    update: function(t) {
      var i = e.length;
      if (0 === i) return !1;
      var n, r = 0;
      for (t = void 0 !== t ? t : void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now(); i > r; ) n = e[r], 
      n && n.update(t) ? r++ : (e.splice(r, 1), i--);
      return !0;
    }
  };
}();

TWEEN.Tween = function(e) {
  var t = e, i = {}, n = {}, r = {}, a = 1e3, s = 0, o = 0, l = null, c = TWEEN.Easing.Linear.None, d = TWEEN.Interpolation.Linear, u = [], h = null, p = !1, f = null, m = null;
  for (var g in e) i[g] = parseFloat(e[g], 10);
  this.to = function(e, t) {
    return void 0 !== t && (a = t), n = e, this;
  }, this.start = function(e) {
    TWEEN.add(this), p = !1, l = void 0 !== e ? e : void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now(), 
    l += o;
    for (var a in n) {
      if (n[a] instanceof Array) {
        if (0 === n[a].length) continue;
        n[a] = [ t[a] ].concat(n[a]);
      }
      i[a] = t[a], i[a] instanceof Array == !1 && (i[a] *= 1), r[a] = i[a] || 0;
    }
    return this;
  }, this.stop = function() {
    return TWEEN.remove(this), this;
  }, this.delay = function(e) {
    return o = e, this;
  }, this.repeat = function(e) {
    return s = e, this;
  }, this.easing = function(e) {
    return c = e, this;
  }, this.interpolation = function(e) {
    return d = e, this;
  }, this.chain = function() {
    return u = arguments, this;
  }, this.onStart = function(e) {
    return h = e, this;
  }, this.onUpdate = function(e) {
    return f = e, this;
  }, this.onComplete = function(e) {
    return m = e, this;
  }, this.update = function(e) {
    if (l > e) return !0;
    p === !1 && (null !== h && h.call(t), p = !0);
    var g = (e - l) / a;
    g = g > 1 ? 1 : g;
    var v = c(g);
    for (var y in n) {
      var _ = i[y] || 0, b = n[y];
      b instanceof Array ? t[y] = d(b, v) : ("string" == typeof b && (b = _ + parseFloat(b, 10)), 
      t[y] = _ + (b - _) * v);
    }
    if (null !== f && f.call(t, v), 1 == g) {
      if (s > 0) {
        isFinite(s) && s--;
        for (var y in r) "string" == typeof n[y] && (r[y] = r[y] + parseFloat(n[y], 10)), 
        i[y] = r[y];
        return l = e + o, !0;
      }
      null !== m && m.call(t);
      for (var x = 0, w = u.length; w > x; x++) u[x].start(e);
      return !1;
    }
    return !0;
  };
}, TWEEN.Easing = {
  Linear: {
    None: function(e) {
      return e;
    }
  },
  Quadratic: {
    In: function(e) {
      return e * e;
    },
    Out: function(e) {
      return e * (2 - e);
    },
    InOut: function(e) {
      return 1 > (e *= 2) ? .5 * e * e : -.5 * (--e * (e - 2) - 1);
    }
  },
  Cubic: {
    In: function(e) {
      return e * e * e;
    },
    Out: function(e) {
      return --e * e * e + 1;
    },
    InOut: function(e) {
      return 1 > (e *= 2) ? .5 * e * e * e : .5 * ((e -= 2) * e * e + 2);
    }
  },
  Quartic: {
    In: function(e) {
      return e * e * e * e;
    },
    Out: function(e) {
      return 1 - --e * e * e * e;
    },
    InOut: function(e) {
      return 1 > (e *= 2) ? .5 * e * e * e * e : -.5 * ((e -= 2) * e * e * e - 2);
    }
  },
  Quintic: {
    In: function(e) {
      return e * e * e * e * e;
    },
    Out: function(e) {
      return --e * e * e * e * e + 1;
    },
    InOut: function(e) {
      return 1 > (e *= 2) ? .5 * e * e * e * e * e : .5 * ((e -= 2) * e * e * e * e + 2);
    }
  },
  Sinusoidal: {
    In: function(e) {
      return 1 - Math.cos(e * Math.PI / 2);
    },
    Out: function(e) {
      return Math.sin(e * Math.PI / 2);
    },
    InOut: function(e) {
      return .5 * (1 - Math.cos(Math.PI * e));
    }
  },
  Exponential: {
    In: function(e) {
      return 0 === e ? 0 : Math.pow(1024, e - 1);
    },
    Out: function(e) {
      return 1 === e ? 1 : 1 - Math.pow(2, -10 * e);
    },
    InOut: function(e) {
      return 0 === e ? 0 : 1 === e ? 1 : 1 > (e *= 2) ? .5 * Math.pow(1024, e - 1) : .5 * (-Math.pow(2, -10 * (e - 1)) + 2);
    }
  },
  Circular: {
    In: function(e) {
      return 1 - Math.sqrt(1 - e * e);
    },
    Out: function(e) {
      return Math.sqrt(1 - --e * e);
    },
    InOut: function(e) {
      return 1 > (e *= 2) ? -.5 * (Math.sqrt(1 - e * e) - 1) : .5 * (Math.sqrt(1 - (e -= 2) * e) + 1);
    }
  },
  Elastic: {
    In: function(e) {
      var t, i = .1, n = .4;
      return 0 === e ? 0 : 1 === e ? 1 : (!i || 1 > i ? (i = 1, t = n / 4) : t = n * Math.asin(1 / i) / (2 * Math.PI), 
      -(i * Math.pow(2, 10 * (e -= 1)) * Math.sin((e - t) * 2 * Math.PI / n)));
    },
    Out: function(e) {
      var t, i = .1, n = .4;
      return 0 === e ? 0 : 1 === e ? 1 : (!i || 1 > i ? (i = 1, t = n / 4) : t = n * Math.asin(1 / i) / (2 * Math.PI), 
      i * Math.pow(2, -10 * e) * Math.sin((e - t) * 2 * Math.PI / n) + 1);
    },
    InOut: function(e) {
      var t, i = .1, n = .4;
      return 0 === e ? 0 : 1 === e ? 1 : (!i || 1 > i ? (i = 1, t = n / 4) : t = n * Math.asin(1 / i) / (2 * Math.PI), 
      1 > (e *= 2) ? -.5 * i * Math.pow(2, 10 * (e -= 1)) * Math.sin((e - t) * 2 * Math.PI / n) : .5 * i * Math.pow(2, -10 * (e -= 1)) * Math.sin((e - t) * 2 * Math.PI / n) + 1);
    }
  },
  Back: {
    In: function(e) {
      var t = 1.70158;
      return e * e * ((t + 1) * e - t);
    },
    Out: function(e) {
      var t = 1.70158;
      return --e * e * ((t + 1) * e + t) + 1;
    },
    InOut: function(e) {
      var t = 2.5949095;
      return 1 > (e *= 2) ? .5 * e * e * ((t + 1) * e - t) : .5 * ((e -= 2) * e * ((t + 1) * e + t) + 2);
    }
  },
  Bounce: {
    In: function(e) {
      return 1 - TWEEN.Easing.Bounce.Out(1 - e);
    },
    Out: function(e) {
      return 1 / 2.75 > e ? 7.5625 * e * e : 2 / 2.75 > e ? 7.5625 * (e -= 1.5 / 2.75) * e + .75 : 2.5 / 2.75 > e ? 7.5625 * (e -= 2.25 / 2.75) * e + .9375 : 7.5625 * (e -= 2.625 / 2.75) * e + .984375;
    },
    InOut: function(e) {
      return .5 > e ? .5 * TWEEN.Easing.Bounce.In(2 * e) : .5 * TWEEN.Easing.Bounce.Out(2 * e - 1) + .5;
    }
  }
}, TWEEN.Interpolation = {
  Linear: function(e, t) {
    var i = e.length - 1, n = i * t, r = Math.floor(n), a = TWEEN.Interpolation.Utils.Linear;
    return 0 > t ? a(e[0], e[1], n) : t > 1 ? a(e[i], e[i - 1], i - n) : a(e[r], e[r + 1 > i ? i : r + 1], n - r);
  },
  Bezier: function(e, t) {
    var i, n = 0, r = e.length - 1, a = Math.pow, s = TWEEN.Interpolation.Utils.Bernstein;
    for (i = 0; r >= i; i++) n += a(1 - t, r - i) * a(t, i) * e[i] * s(r, i);
    return n;
  },
  CatmullRom: function(e, t) {
    var i = e.length - 1, n = i * t, r = Math.floor(n), a = TWEEN.Interpolation.Utils.CatmullRom;
    return e[0] === e[i] ? (0 > t && (r = Math.floor(n = i * (1 + t))), a(e[(r - 1 + i) % i], e[r], e[(r + 1) % i], e[(r + 2) % i], n - r)) : 0 > t ? e[0] - (a(e[0], e[0], e[1], e[1], -n) - e[0]) : t > 1 ? e[i] - (a(e[i], e[i], e[i - 1], e[i - 1], n - i) - e[i]) : a(e[r ? r - 1 : 0], e[r], e[r + 1 > i ? i : r + 1], e[r + 2 > i ? i : r + 2], n - r);
  },
  Utils: {
    Linear: function(e, t, i) {
      return (t - e) * i + e;
    },
    Bernstein: function(e, t) {
      var i = TWEEN.Interpolation.Utils.Factorial;
      return i(e) / i(t) / i(e - t);
    },
    Factorial: function() {
      var e = [ 1 ];
      return function(t) {
        var i, n = 1;
        if (e[t]) return e[t];
        for (i = t; i > 1; i--) n *= i;
        return e[t] = n;
      };
    }(),
    CatmullRom: function(e, t, i, n, r) {
      var a = .5 * (i - e), s = .5 * (n - t), o = r * r, l = r * o;
      return (2 * t - 2 * i + a + s) * l + (-3 * t + 3 * i - 2 * a - s) * o + a * r + t;
    }
  }
}, "function" == typeof define && define("tween", function() {
  return TWEEN;
}), define("af", function() {
  "use strict";
  var e = window.performance && window.performance.now, t = e ? function() {
    return window.performance.now();
  } : Date.now || function() {
    return new Date().getTime();
  }, i = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame, n = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame;
  if (!i) {
    var r = 0;
    i = function(e) {
      var i = t(), n = Math.max(0, 16 - (i - r)), a = setTimeout(function() {
        e(i + n);
      }, n);
      return r = i + n, a;
    };
  }
  return n || (n = function(e) {
    clearTimeout(e);
  }), {
    request: i,
    cancel: n
  };
}), define("store", function(e, t, i) {
  (function() {
    function e() {
      try {
        return c in o && o[c];
      } catch (e) {
        return !1;
      }
    }
    function t() {
      try {
        return d in o && o[d] && o[d][o.location.hostname];
      } catch (e) {
        return !1;
      }
    }
    function n(e) {
      return function() {
        var t = Array.prototype.slice.call(arguments, 0);
        t.unshift(a), h.appendChild(a), a.addBehavior("#default#userData"), a.load(c);
        var i = e.apply(s, t);
        return h.removeChild(a), i;
      };
    }
    function r(e) {
      return e.replace(m, "___");
    }
    var a, s = {}, o = window, l = o.document, c = "localStorage", d = "globalStorage", u = "__storejs__";
    if (s.disabled = !1, s.set = function() {}, s.get = function() {}, s.remove = function() {}, 
    s.clear = function() {}, s.transact = function(e, t, i) {
      var n = s.get(e);
      null == i && (i = t, t = null), n === void 0 && (n = t || {}), i(n), s.set(e, n);
    }, s.getAll = function() {}, s.serialize = function(e) {
      return JSON.stringify(e);
    }, s.deserialize = function(e) {
      if ("string" != typeof e) return void 0;
      try {
        return JSON.parse(e);
      } catch (t) {
        return e || void 0;
      }
    }, e()) a = o[c], s.set = function(e, t) {
      return void 0 === t ? s.remove(e) : (a.setItem(e, s.serialize(t)), t);
    }, s.get = function(e) {
      return s.deserialize(a.getItem(e));
    }, s.remove = function(e) {
      a.removeItem(e);
    }, s.clear = function() {
      a.clear();
    }, s.getAll = function() {
      for (var e = {}, t = 0; a.length > t; ++t) {
        var i = a.key(t);
        e[i] = s.get(i);
      }
      return e;
    }; else if (t()) a = o[d][o.location.hostname], s.set = function(e, t) {
      return void 0 === t ? s.remove(e) : (a[e] = s.serialize(t), t);
    }, s.get = function(e) {
      return s.deserialize(a[e] && a[e].value);
    }, s.remove = function(e) {
      delete a[e];
    }, s.clear = function() {
      for (var e in a) delete a[e];
    }, s.getAll = function() {
      for (var e = {}, t = 0; a.length > t; ++t) {
        var i = a.key(t);
        e[i] = s.get(i);
      }
      return e;
    }; else if (l.documentElement.addBehavior) {
      var h, p;
      try {
        p = new ActiveXObject("htmlfile"), p.open(), p.write('<script>document.w=window</script><iframe src="/favicon.ico"></frame>'), 
        p.close(), h = p.w.frames[0].document, a = h.createElement("div");
      } catch (f) {
        a = l.createElement("div"), h = l.body;
      }
      var m = RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g");
      s.set = n(function(e, t, i) {
        return t = r(t), void 0 === i ? s.remove(t) : (e.setAttribute(t, s.serialize(i)), 
        e.save(c), i);
      }), s.get = n(function(e, t) {
        return t = r(t), s.deserialize(e.getAttribute(t));
      }), s.remove = n(function(e, t) {
        t = r(t), e.removeAttribute(t), e.save(c);
      }), s.clear = n(function(e) {
        var t = e.XMLDocument.documentElement.attributes;
        e.load(c);
        for (var i, n = 0; i = t[n]; n++) e.removeAttribute(i.name);
        e.save(c);
      }), s.getAll = n(function(e) {
        var t = e.XMLDocument.documentElement.attributes;
        e.load(c);
        for (var i, n = {}, r = 0; i = t[r]; ++r) n[i] = s.get(i);
        return n;
      });
    }
    try {
      s.set(u, u), s.get(u) != u && (s.disabled = !0), s.remove(u);
    } catch (f) {
      s.disabled = !0;
    }
    s.enabled = !s.disabled, i !== void 0 && "function" != typeof i ? i.exports = s : "function" == typeof define && define.amd ? define(s) : this.store = s;
  })();
}), define("marked", function(e, t, i) {
  "use strict";
  (function() {
    function e(e, t) {
      return "!" !== e[0][0] ? '<a href="' + s(t.href) + '"' + (t.title ? ' title="' + s(t.title) + '"' : "") + ">" + f.lexer(e[1]) + "</a>" : '<img src="' + s(t.href) + '" alt="' + s(e[1]) + '"' + (t.title ? ' title="' + s(t.title) + '"' : "") + ">";
    }
    function t() {
      return g = m.pop();
    }
    function n() {
      switch (g.type) {
       case "space":
        return "";

       case "hr":
        return "<hr>\n";

       case "heading":
        return "<h" + g.depth + ">" + f.lexer(g.text) + "</h" + g.depth + ">\n";

       case "code":
        return v.highlight && (g.code = v.highlight(g.text, g.lang), null != g.code && g.code !== g.text && (g.escaped = !0, 
        g.text = g.code)), g.escaped || (g.text = s(g.text, !0)), "<pre><code" + (g.lang ? ' class="lang-' + g.lang + '"' : "") + ">" + g.text + "</code></pre>\n";

       case "blockquote_start":
        for (var e = ""; "blockquote_end" !== t().type; ) e += n();
        return "<blockquote>\n" + e + "</blockquote>\n";

       case "list_start":
        for (var i = g.ordered ? "ol" : "ul", e = ""; "list_end" !== t().type; ) e += n();
        return "<" + i + ">\n" + e + "</" + i + ">\n";

       case "list_item_start":
        for (var e = ""; "list_item_end" !== t().type; ) e += "text" === g.type ? r() : n();
        return "<li>" + e + "</li>\n";

       case "loose_item_start":
        for (var e = ""; "list_item_end" !== t().type; ) e += n();
        return "<li>" + e + "</li>\n";

       case "html":
        return v.sanitize ? f.lexer(g.text) : g.pre || v.pedantic ? g.text : f.lexer(g.text);

       case "paragraph":
        return "<p>" + f.lexer(g.text) + "</p>\n";

       case "text":
        return "<p>" + r() + "</p>\n";
      }
    }
    function r() {
      for (var e, i = g.text; (e = m[m.length - 1]) && "text" === e.type; ) i += "\n" + t().text;
      return f.lexer(i);
    }
    function a(e) {
      m = e.reverse();
      for (var i = ""; t(); ) i += n();
      return m = null, g = null, i;
    }
    function s(e, t) {
      return e.replace(t ? /&/g : /&(?!#?\w+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }
    function o(e) {
      for (var t, i = "", n = e.length, r = 0; n > r; r++) t = e.charCodeAt(r), Math.random() > .5 && (t = "x" + t.toString(16)), 
      i += "&#" + t + ";";
      return i;
    }
    function l() {
      var e = "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+";
      return e;
    }
    function c(e, t) {
      return e = e.source, t = t || "", function i(n, r) {
        return n ? (e = e.replace(n, r.source || r), i) : RegExp(e, t);
      };
    }
    function d() {}
    function u(e, t) {
      return h(t), a(p.lexer(e));
    }
    function h(e) {
      e || (e = y), v !== e && (v = e, v.gfm ? (p.fences = p.gfm.fences, p.paragraph = p.gfm.paragraph, 
      f.text = f.gfm.text, f.url = f.gfm.url) : (p.fences = p.normal.fences, p.paragraph = p.normal.paragraph, 
      f.text = f.normal.text, f.url = f.normal.url), v.pedantic ? (f.em = f.pedantic.em, 
      f.strong = f.pedantic.strong) : (f.em = f.normal.em, f.strong = f.normal.strong));
    }
    var p = {
      newline: /^\n+/,
      code: /^( {4}[^\n]+\n*)+/,
      fences: d,
      hr: /^( *[-*_]){3,} *(?:\n+|$)/,
      heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
      lheading: /^([^\n]+)\n *(=|-){3,} *\n*/,
      blockquote: /^( *>[^\n]+(\n[^\n]+)*\n*)+/,
      list: /^( *)(bull) [^\0]+?(?:hr|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
      html: /^ *(?:comment|closed|closing) *(?:\n{2,}|\s*$)/,
      def: /^ *\[([^\]]+)\]: *([^\s]+)(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
      paragraph: /^([^\n]+\n?(?!body))+\n*/,
      text: /^[^\n]+/
    };
    p.bullet = /(?:[*+-]|\d+\.)/, p.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/, 
    p.item = c(p.item, "gm")(/bull/g, p.bullet)(), p.list = c(p.list)(/bull/g, p.bullet)("hr", /\n+(?=(?: *[-*_]){3,} *(?:\n+|$))/)(), 
    p.html = c(p.html)("comment", /<!--[^\0]*?-->/)("closed", /<(tag)[^\0]+?<\/\1>/)("closing", /<tag(?!:\/|@)\b(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g, l())(), 
    p.paragraph = function() {
      var e = p.paragraph.source, t = [];
      return function i(e) {
        return e = p[e] ? p[e].source : e, t.push(e.replace(/(^|[^\[])\^/g, "$1")), i;
      }("hr")("heading")("lheading")("blockquote")("<" + l())("def"), RegExp(e.replace("body", t.join("|")));
    }(), p.normal = {
      fences: p.fences,
      paragraph: p.paragraph
    }, p.gfm = {
      fences: /^ *``` *(\w+)? *\n([^\0]+?)\s*``` *(?:\n+|$)/,
      paragraph: /^/
    }, p.gfm.paragraph = c(p.paragraph)("(?!", "(?!" + p.gfm.fences.source.replace(/(^|[^\[])\^/g, "$1") + "|")(), 
    p.lexer = function(e) {
      var t = [];
      return t.links = {}, e = e.replace(/\r\n|\r/g, "\n").replace(/\t/g, "    "), p.token(e, t, !0);
    }, p.token = function(e, t, i) {
      for (var n, r, a, s, o, l, c, e = e.replace(/^ +$/gm, ""); e; ) if ((a = p.newline.exec(e)) && (e = e.substring(a[0].length), 
      a[0].length > 1 && t.push({
        type: "space"
      })), a = p.code.exec(e)) e = e.substring(a[0].length), a = a[0].replace(/^ {4}/gm, ""), 
      t.push({
        type: "code",
        text: v.pedantic ? a : a.replace(/\n+$/, "")
      }); else if (a = p.fences.exec(e)) e = e.substring(a[0].length), t.push({
        type: "code",
        lang: a[1],
        text: a[2]
      }); else if (a = p.heading.exec(e)) e = e.substring(a[0].length), t.push({
        type: "heading",
        depth: a[1].length,
        text: a[2]
      }); else if (a = p.lheading.exec(e)) e = e.substring(a[0].length), t.push({
        type: "heading",
        depth: "=" === a[2] ? 1 : 2,
        text: a[1]
      }); else if (a = p.hr.exec(e)) e = e.substring(a[0].length), t.push({
        type: "hr"
      }); else if (a = p.blockquote.exec(e)) e = e.substring(a[0].length), t.push({
        type: "blockquote_start"
      }), a = a[0].replace(/^ *> ?/gm, ""), p.token(a, t, i), t.push({
        type: "blockquote_end"
      }); else if (a = p.list.exec(e)) {
        for (e = e.substring(a[0].length), t.push({
          type: "list_start",
          ordered: isFinite(a[2])
        }), a = a[0].match(p.item), n = !1, c = a.length, l = 0; c > l; l++) s = a[l], o = s.length, 
        s = s.replace(/^ *([*+-]|\d+\.) +/, ""), ~s.indexOf("\n ") && (o -= s.length, s = v.pedantic ? s.replace(/^ {1,4}/gm, "") : s.replace(RegExp("^ {1," + o + "}", "gm"), "")), 
        r = n || /\n\n(?!\s*$)/.test(s), l !== c - 1 && (n = "\n" === s[s.length - 1], r || (r = n)), 
        t.push({
          type: r ? "loose_item_start" : "list_item_start"
        }), p.token(s, t), t.push({
          type: "list_item_end"
        });
        t.push({
          type: "list_end"
        });
      } else (a = p.html.exec(e)) ? (e = e.substring(a[0].length), t.push({
        type: "html",
        pre: "pre" === a[1],
        text: a[0]
      })) : i && (a = p.def.exec(e)) ? (e = e.substring(a[0].length), t.links[a[1].toLowerCase()] = {
        href: a[2],
        title: a[3]
      }) : i && (a = p.paragraph.exec(e)) ? (e = e.substring(a[0].length), t.push({
        type: "paragraph",
        text: a[0]
      })) : (a = p.text.exec(e)) && (e = e.substring(a[0].length), t.push({
        type: "text",
        text: a[0]
      }));
      return t;
    };
    var f = {
      escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
      autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
      url: d,
      tag: /^<!--[^\0]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
      link: /^!?\[(inside)\]\(href\)/,
      reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
      nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
      strong: /^__([^\0]+?)__(?!_)|^\*\*([^\0]+?)\*\*(?!\*)/,
      em: /^\b_((?:__|[^\0])+?)_\b|^\*((?:\*\*|[^\0])+?)\*(?!\*)/,
      code: /^(`+)([^\0]*?[^`])\1(?!`)/,
      br: /^ {2,}\n(?!\s*$)/,
      text: /^[^\0]+?(?=[\\<!\[_*`]| {2,}\n|$)/
    };
    f._linkInside = /(?:\[[^\]]*\]|[^\]]|\](?=[^\[]*\]))*/, f._linkHref = /\s*<?([^\s]*?)>?(?:\s+['"]([^\0]*?)['"])?\s*/, 
    f.link = c(f.link)("inside", f._linkInside)("href", f._linkHref)(), f.reflink = c(f.reflink)("inside", f._linkInside)(), 
    f.normal = {
      url: f.url,
      strong: f.strong,
      em: f.em,
      text: f.text
    }, f.pedantic = {
      strong: /^__(?=\S)([^\0]*?\S)__(?!_)|^\*\*(?=\S)([^\0]*?\S)\*\*(?!\*)/,
      em: /^_(?=\S)([^\0]*?\S)_(?!_)|^\*(?=\S)([^\0]*?\S)\*(?!\*)/
    }, f.gfm = {
      url: /^(https?:\/\/[^\s]+[^.,:;"')\]\s])/,
      text: /^[^\0]+?(?=[\\<!\[_*`]|https?:\/\/| {2,}\n|$)/
    }, f.lexer = function(t) {
      for (var i, n, r, a, l = "", c = m.links; t; ) if (a = f.escape.exec(t)) t = t.substring(a[0].length), 
      l += a[1]; else if (a = f.autolink.exec(t)) t = t.substring(a[0].length), "@" === a[2] ? (n = ":" === a[1][6] ? o(a[1].substring(7)) : o(a[1]), 
      r = o("mailto:") + n) : (n = s(a[1]), r = n), l += '<a href="' + r + '">' + n + "</a>"; else if (a = f.url.exec(t)) t = t.substring(a[0].length), 
      n = s(a[1]), r = n, l += '<a href="' + r + '">' + n + "</a>"; else if (a = f.tag.exec(t)) t = t.substring(a[0].length), 
      l += v.sanitize ? s(a[0]) : a[0]; else if (a = f.link.exec(t)) t = t.substring(a[0].length), 
      l += e(a, {
        href: a[2],
        title: a[3]
      }); else if ((a = f.reflink.exec(t)) || (a = f.nolink.exec(t))) {
        if (t = t.substring(a[0].length), i = (a[2] || a[1]).replace(/\s+/g, " "), i = c[i.toLowerCase()], 
        !i || !i.href) {
          l += a[0][0], t = a[0].substring(1) + t;
          continue;
        }
        l += e(a, i);
      } else (a = f.strong.exec(t)) ? (t = t.substring(a[0].length), l += "<strong>" + f.lexer(a[2] || a[1]) + "</strong>") : (a = f.em.exec(t)) ? (t = t.substring(a[0].length), 
      l += "<em>" + f.lexer(a[2] || a[1]) + "</em>") : (a = f.code.exec(t)) ? (t = t.substring(a[0].length), 
      l += "<code>" + s(a[2], !0) + "</code>") : (a = f.br.exec(t)) ? (t = t.substring(a[0].length), 
      l += "<br>") : (a = f.text.exec(t)) && (t = t.substring(a[0].length), l += s(a[0]));
      return l;
    };
    var m, g;
    d.exec = d;
    var v, y;
    u.options = u.setOptions = function(e) {
      return y = e, h(e), u;
    }, u.setOptions({
      gfm: !0,
      pedantic: !1,
      sanitize: !1,
      highlight: null
    }), u.parser = function(e, t) {
      return h(t), a(e);
    }, u.lexer = function(e, t) {
      return h(t), p.lexer(e);
    }, u.parse = u, i !== void 0 ? i.exports = u : this.marked = u;
  }).call(function() {
    return this || ("undefined" != typeof window ? window : global);
  }());
}), define("handlebars", function(e, t, i) {
  this.Handlebars = {}, function(e) {
    e.VERSION = "1.0.rc.1", e.helpers = {}, e.partials = {}, e.registerHelper = function(e, t, i) {
      i && (t.not = i), this.helpers[e] = t;
    }, e.registerPartial = function(e, t) {
      this.partials[e] = t;
    }, e.registerHelper("helperMissing", function(e) {
      if (2 === arguments.length) return void 0;
      throw Error("Could not find property '" + e + "'");
    });
    var t = Object.prototype.toString, i = "[object Function]";
    e.registerHelper("blockHelperMissing", function(n, r) {
      var a = r.inverse || function() {}, s = r.fn, o = t.call(n);
      return o === i && (n = n.call(this)), n === !0 ? s(this) : n === !1 || null == n ? a(this) : "[object Array]" === o ? n.length > 0 ? e.helpers.each(n, r) : a(this) : s(n);
    }), e.K = function() {}, e.createFrame = Object.create || function(t) {
      e.K.prototype = t;
      var i = new e.K();
      return e.K.prototype = null, i;
    }, e.registerHelper("each", function(t, i) {
      var n, r = i.fn, a = i.inverse, s = "";
      if (i.data && (n = e.createFrame(i.data)), t && t.length > 0) for (var o = 0, l = t.length; l > o; o++) n && (n.index = o), 
      s += r(t[o], {
        data: n
      }); else s = a(this);
      return s;
    }), e.registerHelper("if", function(n, r) {
      var a = t.call(n);
      return a === i && (n = n.call(this)), !n || e.Utils.isEmpty(n) ? r.inverse(this) : r.fn(this);
    }), e.registerHelper("unless", function(t, i) {
      var n = i.fn, r = i.inverse;
      return i.fn = r, i.inverse = n, e.helpers["if"].call(this, t, i);
    }), e.registerHelper("with", function(e, t) {
      return t.fn(e);
    }), e.registerHelper("log", function(t) {
      e.log(t);
    });
  }(this.Handlebars);
  var n = function() {
    function e() {
      this.yy = {};
    }
    var t = {
      trace: function() {},
      yy: {},
      symbols_: {
        error: 2,
        root: 3,
        program: 4,
        EOF: 5,
        statements: 6,
        simpleInverse: 7,
        statement: 8,
        openInverse: 9,
        closeBlock: 10,
        openBlock: 11,
        mustache: 12,
        partial: 13,
        CONTENT: 14,
        COMMENT: 15,
        OPEN_BLOCK: 16,
        inMustache: 17,
        CLOSE: 18,
        OPEN_INVERSE: 19,
        OPEN_ENDBLOCK: 20,
        path: 21,
        OPEN: 22,
        OPEN_UNESCAPED: 23,
        OPEN_PARTIAL: 24,
        params: 25,
        hash: 26,
        DATA: 27,
        param: 28,
        STRING: 29,
        INTEGER: 30,
        BOOLEAN: 31,
        hashSegments: 32,
        hashSegment: 33,
        ID: 34,
        EQUALS: 35,
        pathSegments: 36,
        SEP: 37,
        $accept: 0,
        $end: 1
      },
      terminals_: {
        2: "error",
        5: "EOF",
        14: "CONTENT",
        15: "COMMENT",
        16: "OPEN_BLOCK",
        18: "CLOSE",
        19: "OPEN_INVERSE",
        20: "OPEN_ENDBLOCK",
        22: "OPEN",
        23: "OPEN_UNESCAPED",
        24: "OPEN_PARTIAL",
        27: "DATA",
        29: "STRING",
        30: "INTEGER",
        31: "BOOLEAN",
        34: "ID",
        35: "EQUALS",
        37: "SEP"
      },
      productions_: [ 0, [ 3, 2 ], [ 4, 3 ], [ 4, 1 ], [ 4, 0 ], [ 6, 1 ], [ 6, 2 ], [ 8, 3 ], [ 8, 3 ], [ 8, 1 ], [ 8, 1 ], [ 8, 1 ], [ 8, 1 ], [ 11, 3 ], [ 9, 3 ], [ 10, 3 ], [ 12, 3 ], [ 12, 3 ], [ 13, 3 ], [ 13, 4 ], [ 7, 2 ], [ 17, 3 ], [ 17, 2 ], [ 17, 2 ], [ 17, 1 ], [ 17, 1 ], [ 25, 2 ], [ 25, 1 ], [ 28, 1 ], [ 28, 1 ], [ 28, 1 ], [ 28, 1 ], [ 28, 1 ], [ 26, 1 ], [ 32, 2 ], [ 32, 1 ], [ 33, 3 ], [ 33, 3 ], [ 33, 3 ], [ 33, 3 ], [ 33, 3 ], [ 21, 1 ], [ 36, 3 ], [ 36, 1 ] ],
      performAction: function(e, t, i, n, r, a) {
        var s = a.length - 1;
        switch (r) {
         case 1:
          return a[s - 1];

         case 2:
          this.$ = new n.ProgramNode(a[s - 2], a[s]);
          break;

         case 3:
          this.$ = new n.ProgramNode(a[s]);
          break;

         case 4:
          this.$ = new n.ProgramNode([]);
          break;

         case 5:
          this.$ = [ a[s] ];
          break;

         case 6:
          a[s - 1].push(a[s]), this.$ = a[s - 1];
          break;

         case 7:
          this.$ = new n.BlockNode(a[s - 2], a[s - 1].inverse, a[s - 1], a[s]);
          break;

         case 8:
          this.$ = new n.BlockNode(a[s - 2], a[s - 1], a[s - 1].inverse, a[s]);
          break;

         case 9:
          this.$ = a[s];
          break;

         case 10:
          this.$ = a[s];
          break;

         case 11:
          this.$ = new n.ContentNode(a[s]);
          break;

         case 12:
          this.$ = new n.CommentNode(a[s]);
          break;

         case 13:
          this.$ = new n.MustacheNode(a[s - 1][0], a[s - 1][1]);
          break;

         case 14:
          this.$ = new n.MustacheNode(a[s - 1][0], a[s - 1][1]);
          break;

         case 15:
          this.$ = a[s - 1];
          break;

         case 16:
          this.$ = new n.MustacheNode(a[s - 1][0], a[s - 1][1]);
          break;

         case 17:
          this.$ = new n.MustacheNode(a[s - 1][0], a[s - 1][1], !0);
          break;

         case 18:
          this.$ = new n.PartialNode(a[s - 1]);
          break;

         case 19:
          this.$ = new n.PartialNode(a[s - 2], a[s - 1]);
          break;

         case 20:
          break;

         case 21:
          this.$ = [ [ a[s - 2] ].concat(a[s - 1]), a[s] ];
          break;

         case 22:
          this.$ = [ [ a[s - 1] ].concat(a[s]), null ];
          break;

         case 23:
          this.$ = [ [ a[s - 1] ], a[s] ];
          break;

         case 24:
          this.$ = [ [ a[s] ], null ];
          break;

         case 25:
          this.$ = [ [ new n.DataNode(a[s]) ], null ];
          break;

         case 26:
          a[s - 1].push(a[s]), this.$ = a[s - 1];
          break;

         case 27:
          this.$ = [ a[s] ];
          break;

         case 28:
          this.$ = a[s];
          break;

         case 29:
          this.$ = new n.StringNode(a[s]);
          break;

         case 30:
          this.$ = new n.IntegerNode(a[s]);
          break;

         case 31:
          this.$ = new n.BooleanNode(a[s]);
          break;

         case 32:
          this.$ = new n.DataNode(a[s]);
          break;

         case 33:
          this.$ = new n.HashNode(a[s]);
          break;

         case 34:
          a[s - 1].push(a[s]), this.$ = a[s - 1];
          break;

         case 35:
          this.$ = [ a[s] ];
          break;

         case 36:
          this.$ = [ a[s - 2], a[s] ];
          break;

         case 37:
          this.$ = [ a[s - 2], new n.StringNode(a[s]) ];
          break;

         case 38:
          this.$ = [ a[s - 2], new n.IntegerNode(a[s]) ];
          break;

         case 39:
          this.$ = [ a[s - 2], new n.BooleanNode(a[s]) ];
          break;

         case 40:
          this.$ = [ a[s - 2], new n.DataNode(a[s]) ];
          break;

         case 41:
          this.$ = new n.IdNode(a[s]);
          break;

         case 42:
          a[s - 2].push(a[s]), this.$ = a[s - 2];
          break;

         case 43:
          this.$ = [ a[s] ];
        }
      },
      table: [ {
        3: 1,
        4: 2,
        5: [ 2, 4 ],
        6: 3,
        8: 4,
        9: 5,
        11: 6,
        12: 7,
        13: 8,
        14: [ 1, 9 ],
        15: [ 1, 10 ],
        16: [ 1, 12 ],
        19: [ 1, 11 ],
        22: [ 1, 13 ],
        23: [ 1, 14 ],
        24: [ 1, 15 ]
      }, {
        1: [ 3 ]
      }, {
        5: [ 1, 16 ]
      }, {
        5: [ 2, 3 ],
        7: 17,
        8: 18,
        9: 5,
        11: 6,
        12: 7,
        13: 8,
        14: [ 1, 9 ],
        15: [ 1, 10 ],
        16: [ 1, 12 ],
        19: [ 1, 19 ],
        20: [ 2, 3 ],
        22: [ 1, 13 ],
        23: [ 1, 14 ],
        24: [ 1, 15 ]
      }, {
        5: [ 2, 5 ],
        14: [ 2, 5 ],
        15: [ 2, 5 ],
        16: [ 2, 5 ],
        19: [ 2, 5 ],
        20: [ 2, 5 ],
        22: [ 2, 5 ],
        23: [ 2, 5 ],
        24: [ 2, 5 ]
      }, {
        4: 20,
        6: 3,
        8: 4,
        9: 5,
        11: 6,
        12: 7,
        13: 8,
        14: [ 1, 9 ],
        15: [ 1, 10 ],
        16: [ 1, 12 ],
        19: [ 1, 11 ],
        20: [ 2, 4 ],
        22: [ 1, 13 ],
        23: [ 1, 14 ],
        24: [ 1, 15 ]
      }, {
        4: 21,
        6: 3,
        8: 4,
        9: 5,
        11: 6,
        12: 7,
        13: 8,
        14: [ 1, 9 ],
        15: [ 1, 10 ],
        16: [ 1, 12 ],
        19: [ 1, 11 ],
        20: [ 2, 4 ],
        22: [ 1, 13 ],
        23: [ 1, 14 ],
        24: [ 1, 15 ]
      }, {
        5: [ 2, 9 ],
        14: [ 2, 9 ],
        15: [ 2, 9 ],
        16: [ 2, 9 ],
        19: [ 2, 9 ],
        20: [ 2, 9 ],
        22: [ 2, 9 ],
        23: [ 2, 9 ],
        24: [ 2, 9 ]
      }, {
        5: [ 2, 10 ],
        14: [ 2, 10 ],
        15: [ 2, 10 ],
        16: [ 2, 10 ],
        19: [ 2, 10 ],
        20: [ 2, 10 ],
        22: [ 2, 10 ],
        23: [ 2, 10 ],
        24: [ 2, 10 ]
      }, {
        5: [ 2, 11 ],
        14: [ 2, 11 ],
        15: [ 2, 11 ],
        16: [ 2, 11 ],
        19: [ 2, 11 ],
        20: [ 2, 11 ],
        22: [ 2, 11 ],
        23: [ 2, 11 ],
        24: [ 2, 11 ]
      }, {
        5: [ 2, 12 ],
        14: [ 2, 12 ],
        15: [ 2, 12 ],
        16: [ 2, 12 ],
        19: [ 2, 12 ],
        20: [ 2, 12 ],
        22: [ 2, 12 ],
        23: [ 2, 12 ],
        24: [ 2, 12 ]
      }, {
        17: 22,
        21: 23,
        27: [ 1, 24 ],
        34: [ 1, 26 ],
        36: 25
      }, {
        17: 27,
        21: 23,
        27: [ 1, 24 ],
        34: [ 1, 26 ],
        36: 25
      }, {
        17: 28,
        21: 23,
        27: [ 1, 24 ],
        34: [ 1, 26 ],
        36: 25
      }, {
        17: 29,
        21: 23,
        27: [ 1, 24 ],
        34: [ 1, 26 ],
        36: 25
      }, {
        21: 30,
        34: [ 1, 26 ],
        36: 25
      }, {
        1: [ 2, 1 ]
      }, {
        6: 31,
        8: 4,
        9: 5,
        11: 6,
        12: 7,
        13: 8,
        14: [ 1, 9 ],
        15: [ 1, 10 ],
        16: [ 1, 12 ],
        19: [ 1, 11 ],
        22: [ 1, 13 ],
        23: [ 1, 14 ],
        24: [ 1, 15 ]
      }, {
        5: [ 2, 6 ],
        14: [ 2, 6 ],
        15: [ 2, 6 ],
        16: [ 2, 6 ],
        19: [ 2, 6 ],
        20: [ 2, 6 ],
        22: [ 2, 6 ],
        23: [ 2, 6 ],
        24: [ 2, 6 ]
      }, {
        17: 22,
        18: [ 1, 32 ],
        21: 23,
        27: [ 1, 24 ],
        34: [ 1, 26 ],
        36: 25
      }, {
        10: 33,
        20: [ 1, 34 ]
      }, {
        10: 35,
        20: [ 1, 34 ]
      }, {
        18: [ 1, 36 ]
      }, {
        18: [ 2, 24 ],
        21: 41,
        25: 37,
        26: 38,
        27: [ 1, 45 ],
        28: 39,
        29: [ 1, 42 ],
        30: [ 1, 43 ],
        31: [ 1, 44 ],
        32: 40,
        33: 46,
        34: [ 1, 47 ],
        36: 25
      }, {
        18: [ 2, 25 ]
      }, {
        18: [ 2, 41 ],
        27: [ 2, 41 ],
        29: [ 2, 41 ],
        30: [ 2, 41 ],
        31: [ 2, 41 ],
        34: [ 2, 41 ],
        37: [ 1, 48 ]
      }, {
        18: [ 2, 43 ],
        27: [ 2, 43 ],
        29: [ 2, 43 ],
        30: [ 2, 43 ],
        31: [ 2, 43 ],
        34: [ 2, 43 ],
        37: [ 2, 43 ]
      }, {
        18: [ 1, 49 ]
      }, {
        18: [ 1, 50 ]
      }, {
        18: [ 1, 51 ]
      }, {
        18: [ 1, 52 ],
        21: 53,
        34: [ 1, 26 ],
        36: 25
      }, {
        5: [ 2, 2 ],
        8: 18,
        9: 5,
        11: 6,
        12: 7,
        13: 8,
        14: [ 1, 9 ],
        15: [ 1, 10 ],
        16: [ 1, 12 ],
        19: [ 1, 11 ],
        20: [ 2, 2 ],
        22: [ 1, 13 ],
        23: [ 1, 14 ],
        24: [ 1, 15 ]
      }, {
        14: [ 2, 20 ],
        15: [ 2, 20 ],
        16: [ 2, 20 ],
        19: [ 2, 20 ],
        22: [ 2, 20 ],
        23: [ 2, 20 ],
        24: [ 2, 20 ]
      }, {
        5: [ 2, 7 ],
        14: [ 2, 7 ],
        15: [ 2, 7 ],
        16: [ 2, 7 ],
        19: [ 2, 7 ],
        20: [ 2, 7 ],
        22: [ 2, 7 ],
        23: [ 2, 7 ],
        24: [ 2, 7 ]
      }, {
        21: 54,
        34: [ 1, 26 ],
        36: 25
      }, {
        5: [ 2, 8 ],
        14: [ 2, 8 ],
        15: [ 2, 8 ],
        16: [ 2, 8 ],
        19: [ 2, 8 ],
        20: [ 2, 8 ],
        22: [ 2, 8 ],
        23: [ 2, 8 ],
        24: [ 2, 8 ]
      }, {
        14: [ 2, 14 ],
        15: [ 2, 14 ],
        16: [ 2, 14 ],
        19: [ 2, 14 ],
        20: [ 2, 14 ],
        22: [ 2, 14 ],
        23: [ 2, 14 ],
        24: [ 2, 14 ]
      }, {
        18: [ 2, 22 ],
        21: 41,
        26: 55,
        27: [ 1, 45 ],
        28: 56,
        29: [ 1, 42 ],
        30: [ 1, 43 ],
        31: [ 1, 44 ],
        32: 40,
        33: 46,
        34: [ 1, 47 ],
        36: 25
      }, {
        18: [ 2, 23 ]
      }, {
        18: [ 2, 27 ],
        27: [ 2, 27 ],
        29: [ 2, 27 ],
        30: [ 2, 27 ],
        31: [ 2, 27 ],
        34: [ 2, 27 ]
      }, {
        18: [ 2, 33 ],
        33: 57,
        34: [ 1, 58 ]
      }, {
        18: [ 2, 28 ],
        27: [ 2, 28 ],
        29: [ 2, 28 ],
        30: [ 2, 28 ],
        31: [ 2, 28 ],
        34: [ 2, 28 ]
      }, {
        18: [ 2, 29 ],
        27: [ 2, 29 ],
        29: [ 2, 29 ],
        30: [ 2, 29 ],
        31: [ 2, 29 ],
        34: [ 2, 29 ]
      }, {
        18: [ 2, 30 ],
        27: [ 2, 30 ],
        29: [ 2, 30 ],
        30: [ 2, 30 ],
        31: [ 2, 30 ],
        34: [ 2, 30 ]
      }, {
        18: [ 2, 31 ],
        27: [ 2, 31 ],
        29: [ 2, 31 ],
        30: [ 2, 31 ],
        31: [ 2, 31 ],
        34: [ 2, 31 ]
      }, {
        18: [ 2, 32 ],
        27: [ 2, 32 ],
        29: [ 2, 32 ],
        30: [ 2, 32 ],
        31: [ 2, 32 ],
        34: [ 2, 32 ]
      }, {
        18: [ 2, 35 ],
        34: [ 2, 35 ]
      }, {
        18: [ 2, 43 ],
        27: [ 2, 43 ],
        29: [ 2, 43 ],
        30: [ 2, 43 ],
        31: [ 2, 43 ],
        34: [ 2, 43 ],
        35: [ 1, 59 ],
        37: [ 2, 43 ]
      }, {
        34: [ 1, 60 ]
      }, {
        14: [ 2, 13 ],
        15: [ 2, 13 ],
        16: [ 2, 13 ],
        19: [ 2, 13 ],
        20: [ 2, 13 ],
        22: [ 2, 13 ],
        23: [ 2, 13 ],
        24: [ 2, 13 ]
      }, {
        5: [ 2, 16 ],
        14: [ 2, 16 ],
        15: [ 2, 16 ],
        16: [ 2, 16 ],
        19: [ 2, 16 ],
        20: [ 2, 16 ],
        22: [ 2, 16 ],
        23: [ 2, 16 ],
        24: [ 2, 16 ]
      }, {
        5: [ 2, 17 ],
        14: [ 2, 17 ],
        15: [ 2, 17 ],
        16: [ 2, 17 ],
        19: [ 2, 17 ],
        20: [ 2, 17 ],
        22: [ 2, 17 ],
        23: [ 2, 17 ],
        24: [ 2, 17 ]
      }, {
        5: [ 2, 18 ],
        14: [ 2, 18 ],
        15: [ 2, 18 ],
        16: [ 2, 18 ],
        19: [ 2, 18 ],
        20: [ 2, 18 ],
        22: [ 2, 18 ],
        23: [ 2, 18 ],
        24: [ 2, 18 ]
      }, {
        18: [ 1, 61 ]
      }, {
        18: [ 1, 62 ]
      }, {
        18: [ 2, 21 ]
      }, {
        18: [ 2, 26 ],
        27: [ 2, 26 ],
        29: [ 2, 26 ],
        30: [ 2, 26 ],
        31: [ 2, 26 ],
        34: [ 2, 26 ]
      }, {
        18: [ 2, 34 ],
        34: [ 2, 34 ]
      }, {
        35: [ 1, 59 ]
      }, {
        21: 63,
        27: [ 1, 67 ],
        29: [ 1, 64 ],
        30: [ 1, 65 ],
        31: [ 1, 66 ],
        34: [ 1, 26 ],
        36: 25
      }, {
        18: [ 2, 42 ],
        27: [ 2, 42 ],
        29: [ 2, 42 ],
        30: [ 2, 42 ],
        31: [ 2, 42 ],
        34: [ 2, 42 ],
        37: [ 2, 42 ]
      }, {
        5: [ 2, 19 ],
        14: [ 2, 19 ],
        15: [ 2, 19 ],
        16: [ 2, 19 ],
        19: [ 2, 19 ],
        20: [ 2, 19 ],
        22: [ 2, 19 ],
        23: [ 2, 19 ],
        24: [ 2, 19 ]
      }, {
        5: [ 2, 15 ],
        14: [ 2, 15 ],
        15: [ 2, 15 ],
        16: [ 2, 15 ],
        19: [ 2, 15 ],
        20: [ 2, 15 ],
        22: [ 2, 15 ],
        23: [ 2, 15 ],
        24: [ 2, 15 ]
      }, {
        18: [ 2, 36 ],
        34: [ 2, 36 ]
      }, {
        18: [ 2, 37 ],
        34: [ 2, 37 ]
      }, {
        18: [ 2, 38 ],
        34: [ 2, 38 ]
      }, {
        18: [ 2, 39 ],
        34: [ 2, 39 ]
      }, {
        18: [ 2, 40 ],
        34: [ 2, 40 ]
      } ],
      defaultActions: {
        16: [ 2, 1 ],
        24: [ 2, 25 ],
        38: [ 2, 23 ],
        55: [ 2, 21 ]
      },
      parseError: function(e) {
        throw Error(e);
      },
      parse: function(e) {
        function t() {
          var e;
          return e = i.lexer.lex() || 1, "number" != typeof e && (e = i.symbols_[e] || e), 
          e;
        }
        var i = this, n = [ 0 ], r = [ null ], a = [], s = this.table, o = "", l = 0, c = 0, d = 0;
        this.lexer.setInput(e), this.lexer.yy = this.yy, this.yy.lexer = this.lexer, this.yy.parser = this, 
        this.lexer.yylloc === void 0 && (this.lexer.yylloc = {});
        var u = this.lexer.yylloc;
        a.push(u);
        var h = this.lexer.options && this.lexer.options.ranges;
        "function" == typeof this.yy.parseError && (this.parseError = this.yy.parseError);
        for (var p, f, m, g, v, y, _, b, x, w = {}; ;) {
          if (m = n[n.length - 1], this.defaultActions[m] ? g = this.defaultActions[m] : ((null === p || p === void 0) && (p = t()), 
          g = s[m] && s[m][p]), g === void 0 || !g.length || !g[0]) {
            var k = "";
            if (!d) {
              x = [];
              for (y in s[m]) this.terminals_[y] && y > 2 && x.push("'" + this.terminals_[y] + "'");
              k = this.lexer.showPosition ? "Parse error on line " + (l + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + x.join(", ") + ", got '" + (this.terminals_[p] || p) + "'" : "Parse error on line " + (l + 1) + ": Unexpected " + (1 == p ? "end of input" : "'" + (this.terminals_[p] || p) + "'"), 
              this.parseError(k, {
                text: this.lexer.match,
                token: this.terminals_[p] || p,
                line: this.lexer.yylineno,
                loc: u,
                expected: x
              });
            }
          }
          if (g[0] instanceof Array && g.length > 1) throw Error("Parse Error: multiple actions possible at state: " + m + ", token: " + p);
          switch (g[0]) {
           case 1:
            n.push(p), r.push(this.lexer.yytext), a.push(this.lexer.yylloc), n.push(g[1]), p = null, 
            f ? (p = f, f = null) : (c = this.lexer.yyleng, o = this.lexer.yytext, l = this.lexer.yylineno, 
            u = this.lexer.yylloc, d > 0 && d--);
            break;

           case 2:
            if (_ = this.productions_[g[1]][1], w.$ = r[r.length - _], w._$ = {
              first_line: a[a.length - (_ || 1)].first_line,
              last_line: a[a.length - 1].last_line,
              first_column: a[a.length - (_ || 1)].first_column,
              last_column: a[a.length - 1].last_column
            }, h && (w._$.range = [ a[a.length - (_ || 1)].range[0], a[a.length - 1].range[1] ]), 
            v = this.performAction.call(w, o, c, l, this.yy, g[1], r, a), v !== void 0) return v;
            _ && (n = n.slice(0, 2 * -1 * _), r = r.slice(0, -1 * _), a = a.slice(0, -1 * _)), 
            n.push(this.productions_[g[1]][0]), r.push(w.$), a.push(w._$), b = s[n[n.length - 2]][n[n.length - 1]], 
            n.push(b);
            break;

           case 3:
            return !0;
          }
        }
        return !0;
      }
    }, i = function() {
      var e = {
        EOF: 1,
        parseError: function(e, t) {
          if (!this.yy.parser) throw Error(e);
          this.yy.parser.parseError(e, t);
        },
        setInput: function(e) {
          return this._input = e, this._more = this._less = this.done = !1, this.yylineno = this.yyleng = 0, 
          this.yytext = this.matched = this.match = "", this.conditionStack = [ "INITIAL" ], 
          this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
          }, this.options.ranges && (this.yylloc.range = [ 0, 0 ]), this.offset = 0, this;
        },
        input: function() {
          var e = this._input[0];
          this.yytext += e, this.yyleng++, this.offset++, this.match += e, this.matched += e;
          var t = e.match(/(?:\r\n?|\n).*/g);
          return t ? (this.yylineno++, this.yylloc.last_line++) : this.yylloc.last_column++, 
          this.options.ranges && this.yylloc.range[1]++, this._input = this._input.slice(1), 
          e;
        },
        unput: function(e) {
          var t = e.length, i = e.split(/(?:\r\n?|\n)/g);
          this._input = e + this._input, this.yytext = this.yytext.substr(0, this.yytext.length - t - 1), 
          this.offset -= t;
          var n = this.match.split(/(?:\r\n?|\n)/g);
          this.match = this.match.substr(0, this.match.length - 1), this.matched = this.matched.substr(0, this.matched.length - 1), 
          i.length - 1 && (this.yylineno -= i.length - 1);
          var r = this.yylloc.range;
          return this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: i ? (i.length === n.length ? this.yylloc.first_column : 0) + n[n.length - i.length].length - i[0].length : this.yylloc.first_column - t
          }, this.options.ranges && (this.yylloc.range = [ r[0], r[0] + this.yyleng - t ]), 
          this;
        },
        more: function() {
          return this._more = !0, this;
        },
        less: function(e) {
          this.unput(this.match.slice(e));
        },
        pastInput: function() {
          var e = this.matched.substr(0, this.matched.length - this.match.length);
          return (e.length > 20 ? "..." : "") + e.substr(-20).replace(/\n/g, "");
        },
        upcomingInput: function() {
          var e = this.match;
          return 20 > e.length && (e += this._input.substr(0, 20 - e.length)), (e.substr(0, 20) + (e.length > 20 ? "..." : "")).replace(/\n/g, "");
        },
        showPosition: function() {
          var e = this.pastInput(), t = Array(e.length + 1).join("-");
          return e + this.upcomingInput() + "\n" + t + "^";
        },
        next: function() {
          if (this.done) return this.EOF;
          this._input || (this.done = !0);
          var e, t, i, n, r;
          this._more || (this.yytext = "", this.match = "");
          for (var a = this._currentRules(), s = 0; a.length > s && (i = this._input.match(this.rules[a[s]]), 
          !i || t && !(i[0].length > t[0].length) || (t = i, n = s, this.options.flex)); s++) ;
          return t ? (r = t[0].match(/(?:\r\n?|\n).*/g), r && (this.yylineno += r.length), 
          this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: r ? r[r.length - 1].length - r[r.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + t[0].length
          }, this.yytext += t[0], this.match += t[0], this.matches = t, this.yyleng = this.yytext.length, 
          this.options.ranges && (this.yylloc.range = [ this.offset, this.offset += this.yyleng ]), 
          this._more = !1, this._input = this._input.slice(t[0].length), this.matched += t[0], 
          e = this.performAction.call(this, this.yy, this, a[n], this.conditionStack[this.conditionStack.length - 1]), 
          this.done && this._input && (this.done = !1), e ? e : void 0) : "" === this._input ? this.EOF : this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
            text: "",
            token: null,
            line: this.yylineno
          });
        },
        lex: function() {
          var e = this.next();
          return e !== void 0 ? e : this.lex();
        },
        begin: function(e) {
          this.conditionStack.push(e);
        },
        popState: function() {
          return this.conditionStack.pop();
        },
        _currentRules: function() {
          return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        },
        topState: function() {
          return this.conditionStack[this.conditionStack.length - 2];
        },
        pushState: function(e) {
          this.begin(e);
        }
      };
      return e.options = {}, e.performAction = function(e, t, i, n) {
        switch (i) {
         case 0:
          if ("\\" !== t.yytext.slice(-1) && this.begin("mu"), "\\" === t.yytext.slice(-1) && (t.yytext = t.yytext.substr(0, t.yyleng - 1), 
          this.begin("emu")), t.yytext) return 14;
          break;

         case 1:
          return 14;

         case 2:
          return "\\" !== t.yytext.slice(-1) && this.popState(), "\\" === t.yytext.slice(-1) && (t.yytext = t.yytext.substr(0, t.yyleng - 1)), 
          14;

         case 3:
          return 24;

         case 4:
          return 16;

         case 5:
          return 20;

         case 6:
          return 19;

         case 7:
          return 19;

         case 8:
          return 23;

         case 9:
          return 23;

         case 10:
          return t.yytext = t.yytext.substr(3, t.yyleng - 5), this.popState(), 15;

         case 11:
          return 22;

         case 12:
          return 35;

         case 13:
          return 34;

         case 14:
          return 34;

         case 15:
          return 37;

         case 16:
          break;

         case 17:
          return this.popState(), 18;

         case 18:
          return this.popState(), 18;

         case 19:
          return t.yytext = t.yytext.substr(1, t.yyleng - 2).replace(/\\"/g, '"'), 29;

         case 20:
          return t.yytext = t.yytext.substr(1, t.yyleng - 2).replace(/\\"/g, '"'), 29;

         case 21:
          return t.yytext = t.yytext.substr(1), 27;

         case 22:
          return 31;

         case 23:
          return 31;

         case 24:
          return 30;

         case 25:
          return 34;

         case 26:
          return t.yytext = t.yytext.substr(1, t.yyleng - 2), 34;

         case 27:
          return "INVALID";

         case 28:
          return 5;
        }
      }, e.rules = [ /^(?:[^\x00]*?(?=(\{\{)))/, /^(?:[^\x00]+)/, /^(?:[^\x00]{2,}?(?=(\{\{|$)))/, /^(?:\{\{>)/, /^(?:\{\{#)/, /^(?:\{\{\/)/, /^(?:\{\{\^)/, /^(?:\{\{\s*else\b)/, /^(?:\{\{\{)/, /^(?:\{\{&)/, /^(?:\{\{![\s\S]*?\}\})/, /^(?:\{\{)/, /^(?:=)/, /^(?:\.(?=[} ]))/, /^(?:\.\.)/, /^(?:[\/.])/, /^(?:\s+)/, /^(?:\}\}\})/, /^(?:\}\})/, /^(?:"(\\["]|[^"])*")/, /^(?:'(\\[']|[^'])*')/, /^(?:@[a-zA-Z]+)/, /^(?:true(?=[}\s]))/, /^(?:false(?=[}\s]))/, /^(?:[0-9]+(?=[}\s]))/, /^(?:[a-zA-Z0-9_$-]+(?=[=}\s\/.]))/, /^(?:\[[^\]]*\])/, /^(?:.)/, /^(?:$)/ ], 
      e.conditions = {
        mu: {
          rules: [ 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28 ],
          inclusive: !1
        },
        emu: {
          rules: [ 2 ],
          inclusive: !1
        },
        INITIAL: {
          rules: [ 0, 1, 28 ],
          inclusive: !0
        }
      }, e;
    }();
    return t.lexer = i, e.prototype = t, t.Parser = e, new e();
  }();
  return e !== void 0 && t !== void 0 && (t.parser = n, t.Parser = n.Parser, t.parse = function() {
    return n.parse.apply(n, arguments);
  }, t.main = function(i) {
    if (!i[1]) throw Error("Usage: " + i[0] + " FILE");
    var n;
    return n = "undefined" != typeof process ? e("fs").readFileSync(e("path").resolve(i[1]), "utf8") : e("file").path(e("file").cwd()).join(i[1]).read({
      charset: "utf-8"
    }), t.parser.parse(n);
  }, i !== void 0 && e.main === i && t.main("undefined" != typeof process ? process.argv.slice(1) : e("system").args)), 
  Handlebars.Parser = n, Handlebars.parse = function(e) {
    return Handlebars.Parser.yy = Handlebars.AST, Handlebars.Parser.parse(e);
  }, Handlebars.print = function(e) {
    return new Handlebars.PrintVisitor().accept(e);
  }, Handlebars.logger = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    level: 3,
    log: function() {}
  }, Handlebars.log = function(e, t) {
    Handlebars.logger.log(e, t);
  }, function() {
    Handlebars.AST = {}, Handlebars.AST.ProgramNode = function(e, t) {
      this.type = "program", this.statements = e, t && (this.inverse = new Handlebars.AST.ProgramNode(t));
    }, Handlebars.AST.MustacheNode = function(e, t, i) {
      this.type = "mustache", this.escaped = !i, this.hash = t;
      var n = this.id = e[0], r = this.params = e.slice(1), a = this.eligibleHelper = n.isSimple;
      this.isHelper = a && (r.length || t);
    }, Handlebars.AST.PartialNode = function(e, t) {
      this.type = "partial", this.id = e, this.context = t;
    };
    var e = function(e, t) {
      if (e.original !== t.original) throw new Handlebars.Exception(e.original + " doesn't match " + t.original);
    };
    Handlebars.AST.BlockNode = function(t, i, n, r) {
      e(t.id, r), this.type = "block", this.mustache = t, this.program = i, this.inverse = n, 
      this.inverse && !this.program && (this.isInverse = !0);
    }, Handlebars.AST.ContentNode = function(e) {
      this.type = "content", this.string = e;
    }, Handlebars.AST.HashNode = function(e) {
      this.type = "hash", this.pairs = e;
    }, Handlebars.AST.IdNode = function(e) {
      this.type = "ID", this.original = e.join(".");
      for (var t = [], i = 0, n = 0, r = e.length; r > n; n++) {
        var a = e[n];
        ".." === a ? i++ : "." === a || "this" === a ? this.isScoped = !0 : t.push(a);
      }
      this.parts = t, this.string = t.join("."), this.depth = i, this.isSimple = 1 === e.length && !this.isScoped && 0 === i;
    }, Handlebars.AST.DataNode = function(e) {
      this.type = "DATA", this.id = e;
    }, Handlebars.AST.StringNode = function(e) {
      this.type = "STRING", this.string = e;
    }, Handlebars.AST.IntegerNode = function(e) {
      this.type = "INTEGER", this.integer = e;
    }, Handlebars.AST.BooleanNode = function(e) {
      this.type = "BOOLEAN", this.bool = e;
    }, Handlebars.AST.CommentNode = function(e) {
      this.type = "comment", this.comment = e;
    };
  }(), Handlebars.Exception = function() {
    var e = Error.prototype.constructor.apply(this, arguments);
    for (var t in e) e.hasOwnProperty(t) && (this[t] = e[t]);
    this.message = e.message;
  }, Handlebars.Exception.prototype = Error(), Handlebars.SafeString = function(e) {
    this.string = e;
  }, Handlebars.SafeString.prototype.toString = function() {
    return "" + this.string;
  }, function() {
    var e = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "`": "&#x60;"
    }, t = /[&<>"'`]/g, i = /[&<>"'`]/, n = function(t) {
      return e[t] || "&amp;";
    };
    Handlebars.Utils = {
      escapeExpression: function(e) {
        return e instanceof Handlebars.SafeString ? "" + e : null == e || e === !1 ? "" : i.test(e) ? e.replace(t, n) : e;
      },
      isEmpty: function(e) {
        return e === void 0 ? !0 : null === e ? !0 : e === !1 ? !0 : "[object Array]" === Object.prototype.toString.call(e) && 0 === e.length ? !0 : !1;
      }
    };
  }(), Handlebars.Compiler = function() {}, Handlebars.JavaScriptCompiler = function() {}, 
  function(e, t) {
    e.prototype = {
      compiler: e,
      disassemble: function() {
        for (var e, t, i, n = this.opcodes, r = [], a = 0, s = n.length; s > a; a++) if (e = n[a], 
        "DECLARE" === e.opcode) r.push("DECLARE " + e.name + "=" + e.value); else {
          t = [];
          for (var o = 0; e.args.length > o; o++) i = e.args[o], "string" == typeof i && (i = '"' + i.replace("\n", "\\n") + '"'), 
          t.push(i);
          r.push(e.opcode + " " + t.join(" "));
        }
        return r.join("\n");
      },
      guid: 0,
      compile: function(e, t) {
        this.children = [], this.depths = {
          list: []
        }, this.options = t;
        var i = this.options.knownHelpers;
        if (this.options.knownHelpers = {
          helperMissing: !0,
          blockHelperMissing: !0,
          each: !0,
          "if": !0,
          unless: !0,
          "with": !0,
          log: !0
        }, i) for (var n in i) this.options.knownHelpers[n] = i[n];
        return this.program(e);
      },
      accept: function(e) {
        return this[e.type](e);
      },
      program: function(e) {
        var t, i = e.statements;
        this.opcodes = [];
        for (var n = 0, r = i.length; r > n; n++) t = i[n], this[t.type](t);
        return this.isSimple = 1 === r, this.depths.list = this.depths.list.sort(function(e, t) {
          return e - t;
        }), this;
      },
      compileProgram: function(e) {
        var t, i = new this.compiler().compile(e, this.options), n = this.guid++;
        this.usePartial = this.usePartial || i.usePartial, this.children[n] = i;
        for (var r = 0, a = i.depths.list.length; a > r; r++) t = i.depths.list[r], 2 > t || this.addDepth(t - 1);
        return n;
      },
      block: function(e) {
        var t = e.mustache, i = e.program, n = e.inverse;
        i && (i = this.compileProgram(i)), n && (n = this.compileProgram(n));
        var r = this.classifyMustache(t);
        "helper" === r ? this.helperMustache(t, i, n) : "simple" === r ? (this.simpleMustache(t), 
        this.opcode("pushProgram", i), this.opcode("pushProgram", n), this.opcode("pushLiteral", "{}"), 
        this.opcode("blockValue")) : (this.ambiguousMustache(t, i, n), this.opcode("pushProgram", i), 
        this.opcode("pushProgram", n), this.opcode("pushLiteral", "{}"), this.opcode("ambiguousBlockValue")), 
        this.opcode("append");
      },
      hash: function(e) {
        var t, i, n = e.pairs;
        this.opcode("push", "{}");
        for (var r = 0, a = n.length; a > r; r++) t = n[r], i = t[1], this.accept(i), this.opcode("assignToHash", t[0]);
      },
      partial: function(e) {
        var t = e.id;
        this.usePartial = !0, e.context ? this.ID(e.context) : this.opcode("push", "depth0"), 
        this.opcode("invokePartial", t.original), this.opcode("append");
      },
      content: function(e) {
        this.opcode("appendContent", e.string);
      },
      mustache: function(e) {
        var t = this.options, i = this.classifyMustache(e);
        "simple" === i ? this.simpleMustache(e) : "helper" === i ? this.helperMustache(e) : this.ambiguousMustache(e), 
        e.escaped && !t.noEscape ? this.opcode("appendEscaped") : this.opcode("append");
      },
      ambiguousMustache: function(e, t, i) {
        var n = e.id, r = n.parts[0];
        this.opcode("getContext", n.depth), this.opcode("pushProgram", t), this.opcode("pushProgram", i), 
        this.opcode("invokeAmbiguous", r);
      },
      simpleMustache: function(e) {
        var t = e.id;
        "DATA" === t.type ? this.DATA(t) : t.parts.length ? this.ID(t) : (this.addDepth(t.depth), 
        this.opcode("getContext", t.depth), this.opcode("pushContext")), this.opcode("resolvePossibleLambda");
      },
      helperMustache: function(e, t, i) {
        var n = this.setupFullMustacheParams(e, t, i), r = e.id.parts[0];
        if (this.options.knownHelpers[r]) this.opcode("invokeKnownHelper", n.length, r); else {
          if (this.knownHelpersOnly) throw Error("You specified knownHelpersOnly, but used the unknown helper " + r);
          this.opcode("invokeHelper", n.length, r);
        }
      },
      ID: function(e) {
        this.addDepth(e.depth), this.opcode("getContext", e.depth);
        var t = e.parts[0];
        t ? this.opcode("lookupOnContext", e.parts[0]) : this.opcode("pushContext");
        for (var i = 1, n = e.parts.length; n > i; i++) this.opcode("lookup", e.parts[i]);
      },
      DATA: function(e) {
        this.options.data = !0, this.opcode("lookupData", e.id);
      },
      STRING: function(e) {
        this.opcode("pushString", e.string);
      },
      INTEGER: function(e) {
        this.opcode("pushLiteral", e.integer);
      },
      BOOLEAN: function(e) {
        this.opcode("pushLiteral", e.bool);
      },
      comment: function() {},
      opcode: function(e) {
        this.opcodes.push({
          opcode: e,
          args: [].slice.call(arguments, 1)
        });
      },
      declare: function(e, t) {
        this.opcodes.push({
          opcode: "DECLARE",
          name: e,
          value: t
        });
      },
      addDepth: function(e) {
        if (isNaN(e)) throw Error("EWOT");
        0 !== e && (this.depths[e] || (this.depths[e] = !0, this.depths.list.push(e)));
      },
      classifyMustache: function(e) {
        var t = e.isHelper, i = e.eligibleHelper, n = this.options;
        if (i && !t) {
          var r = e.id.parts[0];
          n.knownHelpers[r] ? t = !0 : n.knownHelpersOnly && (i = !1);
        }
        return t ? "helper" : i ? "ambiguous" : "simple";
      },
      pushParams: function(e) {
        for (var t, i = e.length; i--; ) t = e[i], this.options.stringParams ? (t.depth && this.addDepth(t.depth), 
        this.opcode("getContext", t.depth || 0), this.opcode("pushStringParam", t.string)) : this[t.type](t);
      },
      setupMustacheParams: function(e) {
        var t = e.params;
        return this.pushParams(t), e.hash ? this.hash(e.hash) : this.opcode("pushLiteral", "{}"), 
        t;
      },
      setupFullMustacheParams: function(e, t, i) {
        var n = e.params;
        return this.pushParams(n), this.opcode("pushProgram", t), this.opcode("pushProgram", i), 
        e.hash ? this.hash(e.hash) : this.opcode("pushLiteral", "{}"), n;
      }
    };
    var i = function(e) {
      this.value = e;
    };
    t.prototype = {
      nameLookup: function(e, i) {
        return /^[0-9]+$/.test(i) ? e + "[" + i + "]" : t.isValidJavaScriptVariableName(i) ? e + "." + i : e + "['" + i + "']";
      },
      appendToBuffer: function(e) {
        return this.environment.isSimple ? "return " + e + ";" : "buffer += " + e + ";";
      },
      initializeBuffer: function() {
        return this.quotedString("");
      },
      namespace: "Handlebars",
      compile: function(e, t, i, n) {
        this.environment = e, this.options = t || {}, Handlebars.log(Handlebars.logger.DEBUG, this.environment.disassemble() + "\n\n"), 
        this.name = this.environment.name, this.isChild = !!i, this.context = i || {
          programs: [],
          aliases: {}
        }, this.preamble(), this.stackSlot = 0, this.stackVars = [], this.registers = {
          list: []
        }, this.compileStack = [], this.compileChildren(e, t);
        var r, a = e.opcodes;
        for (this.i = 0, s = a.length; s > this.i; this.i++) r = a[this.i], "DECLARE" === r.opcode ? this[r.name] = r.value : this[r.opcode].apply(this, r.args);
        return this.createFunctionContext(n);
      },
      nextOpcode: function() {
        var e = this.environment.opcodes;
        return e[this.i + 1], e[this.i + 1];
      },
      eat: function() {
        this.i = this.i + 1;
      },
      preamble: function() {
        var e = [];
        if (this.isChild) e.push(""); else {
          var t = this.namespace, i = "helpers = helpers || " + t + ".helpers;";
          this.environment.usePartial && (i = i + " partials = partials || " + t + ".partials;"), 
          this.options.data && (i += " data = data || {};"), e.push(i);
        }
        this.environment.isSimple ? e.push("") : e.push(", buffer = " + this.initializeBuffer()), 
        this.lastContext = 0, this.source = e;
      },
      createFunctionContext: function(e) {
        var t = this.stackVars.concat(this.registers.list);
        if (t.length > 0 && (this.source[1] = this.source[1] + ", " + t.join(", ")), !this.isChild) for (var i in this.context.aliases) this.source[1] = this.source[1] + ", " + i + "=" + this.context.aliases[i];
        this.source[1] && (this.source[1] = "var " + this.source[1].substring(2) + ";"), 
        this.isChild || (this.source[1] += "\n" + this.context.programs.join("\n") + "\n"), 
        this.environment.isSimple || this.source.push("return buffer;");
        for (var n = this.isChild ? [ "depth0", "data" ] : [ "Handlebars", "depth0", "helpers", "partials", "data" ], r = 0, a = this.environment.depths.list.length; a > r; r++) n.push("depth" + this.environment.depths.list[r]);
        if (e) return n.push(this.source.join("\n  ")), Function.apply(this, n);
        var s = "function " + (this.name || "") + "(" + n.join(",") + ") {\n  " + this.source.join("\n  ") + "}";
        return Handlebars.log(Handlebars.logger.DEBUG, s + "\n\n"), s;
      },
      blockValue: function() {
        this.context.aliases.blockHelperMissing = "helpers.blockHelperMissing";
        var e = [ "depth0" ];
        this.setupParams(0, e), this.replaceStack(function(t) {
          return e.splice(1, 0, t), t + " = blockHelperMissing.call(" + e.join(", ") + ")";
        });
      },
      ambiguousBlockValue: function() {
        this.context.aliases.blockHelperMissing = "helpers.blockHelperMissing";
        var e = [ "depth0" ];
        this.setupParams(0, e);
        var t = this.topStack();
        e.splice(1, 0, t), this.source.push("if (!" + this.lastHelper + ") { " + t + " = blockHelperMissing.call(" + e.join(", ") + "); }");
      },
      appendContent: function(e) {
        this.source.push(this.appendToBuffer(this.quotedString(e)));
      },
      append: function() {
        var e = this.popStack();
        this.source.push("if(" + e + " || " + e + " === 0) { " + this.appendToBuffer(e) + " }"), 
        this.environment.isSimple && this.source.push("else { " + this.appendToBuffer("''") + " }");
      },
      appendEscaped: function() {
        var e = this.nextOpcode(), t = "";
        this.context.aliases.escapeExpression = "this.escapeExpression", e && "appendContent" === e.opcode && (t = " + " + this.quotedString(e.args[0]), 
        this.eat(e)), this.source.push(this.appendToBuffer("escapeExpression(" + this.popStack() + ")" + t));
      },
      getContext: function(e) {
        this.lastContext !== e && (this.lastContext = e);
      },
      lookupOnContext: function(e) {
        this.pushStack(this.nameLookup("depth" + this.lastContext, e, "context"));
      },
      pushContext: function() {
        this.pushStackLiteral("depth" + this.lastContext);
      },
      resolvePossibleLambda: function() {
        this.context.aliases.functionType = '"function"', this.replaceStack(function(e) {
          return "typeof " + e + " === functionType ? " + e + "() : " + e;
        });
      },
      lookup: function(e) {
        this.replaceStack(function(t) {
          return t + " == null || " + t + " === false ? " + t + " : " + this.nameLookup(t, e, "context");
        });
      },
      lookupData: function(e) {
        this.pushStack(this.nameLookup("data", e, "data"));
      },
      pushStringParam: function(e) {
        this.pushStackLiteral("depth" + this.lastContext), this.pushString(e);
      },
      pushString: function(e) {
        this.pushStackLiteral(this.quotedString(e));
      },
      push: function(e) {
        this.pushStack(e);
      },
      pushLiteral: function(e) {
        this.pushStackLiteral(e);
      },
      pushProgram: function(e) {
        null != e ? this.pushStackLiteral(this.programExpression(e)) : this.pushStackLiteral(null);
      },
      invokeHelper: function(e, t) {
        this.context.aliases.helperMissing = "helpers.helperMissing";
        var i = this.lastHelper = this.setupHelper(e, t);
        this.register("foundHelper", i.name), this.pushStack("foundHelper ? foundHelper.call(" + i.callParams + ") " + ": helperMissing.call(" + i.helperMissingParams + ")");
      },
      invokeKnownHelper: function(e, t) {
        var i = this.setupHelper(e, t);
        this.pushStack(i.name + ".call(" + i.callParams + ")");
      },
      invokeAmbiguous: function(e) {
        this.context.aliases.functionType = '"function"', this.pushStackLiteral("{}");
        var t = this.setupHelper(0, e), i = this.lastHelper = this.nameLookup("helpers", e, "helper");
        this.register("foundHelper", i);
        var n = this.nameLookup("depth" + this.lastContext, e, "context"), r = this.nextStack();
        this.source.push("if (foundHelper) { " + r + " = foundHelper.call(" + t.callParams + "); }"), 
        this.source.push("else { " + r + " = " + n + "; " + r + " = typeof " + r + " === functionType ? " + r + "() : " + r + "; }");
      },
      invokePartial: function(e) {
        var t = [ this.nameLookup("partials", e, "partial"), "'" + e + "'", this.popStack(), "helpers", "partials" ];
        this.options.data && t.push("data"), this.context.aliases.self = "this", this.pushStack("self.invokePartial(" + t.join(", ") + ");");
      },
      assignToHash: function(e) {
        var t = this.popStack(), i = this.topStack();
        this.source.push(i + "['" + e + "'] = " + t + ";");
      },
      compiler: t,
      compileChildren: function(e, t) {
        for (var i, n, r = e.children, a = 0, s = r.length; s > a; a++) {
          i = r[a], n = new this.compiler(), this.context.programs.push("");
          var o = this.context.programs.length;
          i.index = o, i.name = "program" + o, this.context.programs[o] = n.compile(i, t, this.context);
        }
      },
      programExpression: function(e) {
        if (this.context.aliases.self = "this", null == e) return "self.noop";
        for (var t, i = this.environment.children[e], n = i.depths.list, r = [ i.index, i.name, "data" ], a = 0, s = n.length; s > a; a++) t = n[a], 
        1 === t ? r.push("depth0") : r.push("depth" + (t - 1));
        return 0 === n.length ? "self.program(" + r.join(", ") + ")" : (r.shift(), "self.programWithDepth(" + r.join(", ") + ")");
      },
      register: function(e, t) {
        this.useRegister(e), this.source.push(e + " = " + t + ";");
      },
      useRegister: function(e) {
        this.registers[e] || (this.registers[e] = !0, this.registers.list.push(e));
      },
      pushStackLiteral: function(e) {
        return this.compileStack.push(new i(e)), e;
      },
      pushStack: function(e) {
        return this.source.push(this.incrStack() + " = " + e + ";"), this.compileStack.push("stack" + this.stackSlot), 
        "stack" + this.stackSlot;
      },
      replaceStack: function(e) {
        var t = e.call(this, this.topStack());
        return this.source.push(this.topStack() + " = " + t + ";"), "stack" + this.stackSlot;
      },
      nextStack: function() {
        var e = this.incrStack();
        return this.compileStack.push("stack" + this.stackSlot), e;
      },
      incrStack: function() {
        return this.stackSlot++, this.stackSlot > this.stackVars.length && this.stackVars.push("stack" + this.stackSlot), 
        "stack" + this.stackSlot;
      },
      popStack: function() {
        var e = this.compileStack.pop();
        return e instanceof i ? e.value : (this.stackSlot--, e);
      },
      topStack: function() {
        var e = this.compileStack[this.compileStack.length - 1];
        return e instanceof i ? e.value : e;
      },
      quotedString: function(e) {
        return '"' + e.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r") + '"';
      },
      setupHelper: function(e, t) {
        var i = [];
        this.setupParams(e, i);
        var n = this.nameLookup("helpers", t, "helper");
        return {
          params: i,
          name: n,
          callParams: [ "depth0" ].concat(i).join(", "),
          helperMissingParams: [ "depth0", this.quotedString(t) ].concat(i).join(", ")
        };
      },
      setupParams: function(e, t) {
        var i, n, r, a = [], s = [];
        a.push("hash:" + this.popStack()), n = this.popStack(), r = this.popStack(), (r || n) && (r || (this.context.aliases.self = "this", 
        r = "self.noop"), n || (this.context.aliases.self = "this", n = "self.noop"), a.push("inverse:" + n), 
        a.push("fn:" + r));
        for (var o = 0; e > o; o++) i = this.popStack(), t.push(i), this.options.stringParams && s.push(this.popStack());
        return this.options.stringParams && a.push("contexts:[" + s.join(",") + "]"), this.options.data && a.push("data:data"), 
        t.push("{" + a.join(",") + "}"), t.join(", ");
      }
    };
    for (var n = "break else new var case finally return void catch for switch while continue function this with default if throw delete in try do instanceof typeof abstract enum int short boolean export interface static byte extends long super char final native synchronized class float package throws const goto private transient debugger implements protected volatile double import public let yield".split(" "), r = t.RESERVED_WORDS = {}, a = 0, s = n.length; s > a; a++) r[n[a]] = !0;
    t.isValidJavaScriptVariableName = function(e) {
      return !t.RESERVED_WORDS[e] && /^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(e) ? !0 : !1;
    };
  }(Handlebars.Compiler, Handlebars.JavaScriptCompiler), Handlebars.precompile = function(e, t) {
    t = t || {};
    var i = Handlebars.parse(e), n = new Handlebars.Compiler().compile(i, t);
    return new Handlebars.JavaScriptCompiler().compile(n, t);
  }, Handlebars.compile = function(e, t) {
    function i() {
      var i = Handlebars.parse(e), n = new Handlebars.Compiler().compile(i, t), r = new Handlebars.JavaScriptCompiler().compile(n, t, void 0, !0);
      return Handlebars.template(r);
    }
    t = t || {};
    var n;
    return function(e, t) {
      return n || (n = i()), n.call(this, e, t);
    };
  }, Handlebars.VM = {
    template: function(e) {
      var t = {
        escapeExpression: Handlebars.Utils.escapeExpression,
        invokePartial: Handlebars.VM.invokePartial,
        programs: [],
        program: function(e, t, i) {
          var n = this.programs[e];
          return i ? Handlebars.VM.program(t, i) : n ? n : n = this.programs[e] = Handlebars.VM.program(t);
        },
        programWithDepth: Handlebars.VM.programWithDepth,
        noop: Handlebars.VM.noop
      };
      return function(i, n) {
        return n = n || {}, e.call(t, Handlebars, i, n.helpers, n.partials, n.data);
      };
    },
    programWithDepth: function(e, t) {
      var i = Array.prototype.slice.call(arguments, 2);
      return function(n, r) {
        return r = r || {}, e.apply(this, [ n, r.data || t ].concat(i));
      };
    },
    program: function(e, t) {
      return function(i, n) {
        return n = n || {}, e(i, n.data || t);
      };
    },
    noop: function() {
      return "";
    },
    invokePartial: function(e, t, i, n, r, a) {
      var s = {
        helpers: n,
        partials: r,
        data: a
      };
      if (void 0 === e) throw new Handlebars.Exception("The partial " + t + " could not be found");
      if (e instanceof Function) return e(i, s);
      if (Handlebars.compile) return r[t] = Handlebars.compile(e, {
        data: void 0 !== a
      }), r[t](i, s);
      throw new Handlebars.Exception("The partial " + t + " could not be compiled when running in runtime-only mode");
    }
  }, Handlebars.template = Handlebars.VM.template, Handlebars;
}), define(function(e) {
  "use strict";
  function t(e, t) {
    return n.find(t, function(t) {
      return t.identity.id === e ? !0 : void 0;
    });
  }
  function i(e) {
    return e.charAt(0).toUpperCase() + e.slice(1).toLowerCase();
  }
  var n = e("rex"), r = e("handlebars");
  r.registerHelper("capitalize", function(e) {
    return i(e);
  }), r.registerHelper("printIdentityNameFromInvitations", function(e, i) {
    var n = t(e, i), r = "";
    return n && (r = n.identity.name), r;
  }), r.registerHelper("isOAuthIdentity", function(e, t) {
    var i = -1 !== "twitter facebook google flickr instagram dropbox".indexOf(e);
    return r.helpers["if"].call(this, i, t);
  });
}), define("util", function() {
  "use strict";
  var e = /^\s+/, t = /\s+$/, i = /[^0-9a-zA-Z_\u4e00-\u9fa5\ \'\.]+/g, n = String.prototype.trim, r = {
    zh_CN: i,
    cut30length: function(e, t) {
      if (!e) return "";
      for (e = e.replace(i, " "), t || (t = 30); r.utf8length(e) > t; ) e = e.substring(0, e.length - 1);
      return e;
    },
    utf8length: function(e) {
      for (var t, i = e.length, n = 0, r = 0; i > r; r++) if (t = e.charCodeAt(r), 127 > t) n++; else if (2047 >= t) n += 2; else if (55295 >= t || t >= 57344) n += 3; else {
        if (!(56319 >= t)) throw "Error: Invalid UTF-16 sequence. Missing high-surrogate code.";
        if (t = e.charCodeAt(++r), 56320 > t || t > 57343) throw "Error: Invalid UTF-16 sequence. Missing low-surrogate code.";
        n += 4;
      }
      return n;
    },
    trim: n ? function(e) {
      return null == e ? "" : n.call(e);
    } : function(i) {
      return null == i ? "" : ("" + i).replace(e, "").replace(t, "");
    },
    parseId: function() {
      var e = /^([a-z0-9_\.]{1,})@facebook$/i, t = /^@([a-z0-9_]{1,15})$|^@?([a-z0-9_]{1,15})@twitter$/i, i = /^([a-z0-9_\.]{1,})@instagram$/i, n = /^(.*)@dropbox$/i, a = /^(.*)@flickr$/i, s = /^[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i, o = /^[^@]*<[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?>$/i, l = /^(\+)?((?:(86)?(1(?:3\d|4[57]|5\d|8\d)\d{8}))|(?:(1)?(\d{5,15})))$/;
      return function(c) {
        var d, u = {};
        if (c = r.trim(c), (d = c.match(n)) && s.test(d[1])) u.name = d[1], u.external_username = d[1], 
        u.provider = "dropbox"; else if (d = c.match(a)) u.name = d[1], u.external_username = d[1], 
        u.provider = "flickr"; else if (d = c.match(i)) u.name = d[1], u.external_username = d[1], 
        u.provider = "instagram"; else if (d = c.match(e)) u.name = d[1], u.external_username = d[1], 
        u.provider = "facebook"; else if (d = c.match(t)) u.name = d[1] || d[2], u.external_username = u.name, 
        u.provider = "twitter"; else if (s.test(c)) u.name = r.cut30length(c.split("@")[0]), 
        u.external_username = c, u.provider = "email"; else if (o.test(c)) {
          var h = c.indexOf("<");
          u.name = r.cut30length(c.substring(0, h).replace(/^"|^'|"$|'$/g, "")), u.external_username = u.name, 
          u.provider = "email";
        } else if (d = c.replace(/[\s\-\(\)\_]/g, "").match(l)) {
          var p, f, m = d[1];
          u.provider = "phone", m ? d[3] && d[4] ? (p = d[3], f = d[4], u.name = u.external_username = m + p + f) : d[5] && d[6] ? (p = d[5], 
          f = d[6], u.name = u.external_username = m + p + f) : (u.name = c, u.provider = null) : (m = "+", 
          d[4] ? (p = "86", f = d[4]) : (p = "1", f = d[2]), u.name = u.external_username = m + p + f);
        } else u.name = c, u.provider = null;
        return u;
      };
    }(),
    tokenRegExp: /token=([a-zA-Z0-9]{32})/,
    printExtUserName: function(e, t) {
      var i = e.external_username, n = e.provider;
      switch (n) {
       case "twitter":
        i = "@" + i + "@" + n;
        break;

       case "facebook":
       case "instagram":
       case "flickr":
       case "dropbox":
        i += "@" + n;
        break;

       case "phone":
        t && (/^\+1\d{10}$/.test(i) ? i = i.replace(/^(\+1)(\d{3})(\d{3})(\d{4})$/, "$1 ($2) $3-$4") : /^\+86\d{11}$/.test(i) && (i = i.replace(/^(\+86)(\d{3})(\d{4})(\d{4})$/, "$1 $2 $3 $4")));
      }
      return i;
    }
  };
  return r;
}), function() {
  "use strict";
  var e = /(?:\{\{|%\{)(\w*?)(?:\}\}?)/gm, t = /^\d{4}-\d{2}-\d{2}$/, i = /^\d{2}:\d{2}:\d{2}$/, n = .2, r = 6e4, a = 864e5, s = {
    monthsShort: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
    months: "January February March April May June July August September October November December".split(" "),
    weekdaysShort: "Sun Mon Tue Wed Thu Fri Sat".split(" "),
    weekdays: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
    "-1": function() {
      return "Today";
    },
    "0": function(e) {
      var t = "", i = e.years, n = e.months;
      return i && (t = "{{years}} year" + (1 === i ? "" : "s")), n && (t += (t ? " " : "") + "{{months}} month" + (1 === n ? "" : "s")), 
      t + " ago";
    },
    "1": function(e) {
      var t = "", i = e.days;
      return t = 1 === i ? "Yesterday" : 2 === i ? "Two days ago" : "{{days}} days ago";
    },
    "2": function(e) {
      var t = "", i = e.isToday, n = e.hours;
      return t = !i && n >= 12 ? "Yesterday" : "{{hours}} hours ago";
    },
    "3": function() {
      return "1.5 hours ago";
    },
    "4": function() {
      return "An hour ago";
    },
    "5": function(e, t) {
      return "X" === t ? "Just now" : "{{minutes}} minutes ago";
    },
    "6": function(e, t) {
      return "X" === t ? "Now" : "{{minutes}} minutes ago";
    },
    "7": function(e, t) {
      return "X" === t ? "Now" : "Seconds ago";
    },
    "8": function() {
      return "In {{minutes}} minutes";
    },
    "9": function() {
      return "In one hour";
    },
    "10": function() {
      return "In 1.5 hours";
    },
    "11": function(e) {
      var t = "", i = e.isToday, n = e.hours;
      return t = !i && n >= 12 ? "Tomorrow" : "In {{hours}} hours";
    },
    "12": function(e) {
      var t = "", i = e.days, n = e.day;
      return t = 1 === i ? "Tomorrow" : 2 === i ? "In two days" : s.weekdaysShort[n] + ". in {{days}} days";
    },
    "13": function(e) {
      var t = "", i = e.years, n = e.months;
      return i && (t = "{{years}} year" + (1 === i ? "" : "s")), n && (t += (t ? " " : "") + "{{months}} month" + (1 === n ? "" : "s")), 
      "In " + t;
    }
  }, o = function(e, t, i, n) {
    var r, a = o.locales[o.locale], s = o.distanceOfTime(e, t), l = o.diff(s);
    return l.type = i, r = o.inWords(l, a), "function" == typeof n && (r = n(r.data)), 
    r;
  }, l = o.parseISO = function(e) {
    return new Date(Date.parse(e));
  }, c = o.toISO = function(e) {
    return e.replace(/\s/, "T").replace(/\s/, "").replace(/([+\-]\d\d)(?::?)(\d\d)/, "$1:$2");
  };
  o.locale = "en", o.locales = {
    en: s
  }, o.inWords = function(e, t) {
    var i, n = t[e.token], r = e.type, a = e.date;
    return i = "function" == typeof n ? n(a, r) : n, g(i, a);
  }, o.diff = function(e) {
    var t, i, a, s, o, l, c = e.target, d = e.distance, u = v(d / r), h = {
      date: {}
    }, p = h.date, f = e.days;
    return p.isToday = e.isToday, c._isToday ? h.token = -1 : -43199 > u ? (h.token = 0, 
    a = v(-u / 525949), i = v(-u % 525949 / 43829 + n)) : -1439 > u ? (h.token = 1, 
    t = 3 > -f ? -f : v((-u + 1439) / 1440)) : -107 > u ? (h.token = 2, s = v(-u / 60 + n)) : -81 > u ? h.token = 3 : -59 > u ? h.token = 4 : -29 > u ? (h.token = 5, 
    o = -u) : 0 > u ? (h.token = 6, o = -u) : 0 === u ? h.token = 7 : 60 > u ? (h.token = 8, 
    o = u) : 82 > u ? h.token = 9 : 108 > u ? h.token = 10 : 1440 > u ? (h.token = 11, 
    s = v(u / 60 + n)) : 43200 > u ? (h.token = 12, t = 3 > f ? f : v((u + 1439) / 1440), 
    l = c.getDay()) : (h.token = 13, a = v(u / 525949), i = v(u % 525949 / 43829 + n), 
    12 === i && (i = 0, a++)), a && (p.years = a), i && (p.months = i), t && (p.days = t), 
    s && (p.hours = s), o && (p.minutes = o), l !== void 0 && (p.day = l), h;
  }, o.distanceOfTime = function(e, t) {
    e ? "number" == typeof e ? e = new Date(e) : "string" == typeof e && (e = l(c(e))) : e = new Date(), 
    t ? "number" == typeof t ? t = new Date(t) : "string" == typeof t && (t = l(c(t))) : t = new Date(), 
    e._reTime && (t.setHours(0), t.setMinutes(0), t.setSeconds(0), t.setMilliseconds(0));
    var i = e.getFullYear(), n = e.getMonth(), r = e.getDate(), s = t.getFullYear(), o = t.getMonth(), d = t.getDate();
    return {
      target: e,
      source: t,
      distance: +e - +t,
      days: (+new Date(i, n, r) - +new Date(s, o, d)) / a,
      isToday: i === s && n === o && r === d
    };
  }, o.toLocaleDate = function(e) {
    var t, i, n, r = e.outputformat, a = new Date(), s = a.getFullYear() + "-" + p(a.getMonth() + 1) + "-" + p(a.getDate()), o = !1, c = !1;
    if (r) t = a, n = s, o = !0; else {
      var d = e.begin_at, u = d.date, h = d.time, g = d.timezone, v = "";
      u ? (v = f(u), h ? v += "T" + m(h) : (c = !0, o = v === s)) : (v = s, h && (v += "T" + m(h))), 
      u && h && g && (v += "Z"), t = l(v), c && (t.setHours(0), t.setMinutes(0), t.setSeconds(0), 
      t.setMilliseconds(0)), i = n = t.getFullYear() + "-" + p(t.getMonth() + 1) + "-" + p(t.getDate()), 
      n += h ? " " + p(t.getHours()) + ":" + p(t.getMinutes()) + ":" + p(t.getSeconds()) : "";
    }
    return t._isToday = o, t._reTime = c, {
      date: t,
      text: n
    };
  };
  var d = {
    date: function(e, t, i, n) {
      var r = o.locales[o.locale];
      return r.weekdaysShort[n] + ", " + r.monthsShort[t] + " " + i;
    },
    time: function(e, t) {
      var i = e > 12 ? e - 12 : e, n = i + ":" + p(t);
      return n += e >= 12 ? "PM" : "AM";
    }
  };
  o.printEFTime = function(e, t, i) {
    var n, r, a, s, l, c = e.outputformat, p = e.begin_at, f = "X" === t, m = {
      title: "",
      content: ""
    }, g = new Date();
    if (c) n = e.origin.replace(/^['"‘’“”“”‚„]+/, "").replace(/['"‘’“”“”‚„]+$/, ""), 
    m.title = n, f || (m.content = n, p.date && (e.outputformat = 0, r = o.toLocaleDate(e), 
    m.content = o(r.date, g), e.outputformat = 1)); else if (i || (i = d), p && (p.date || p.time ? (r = o.toLocaleDate(e), 
    a = r.date, p.date ? (m.title = o(r.date, g, "X"), m.content = p.time_word + (p.time_word && p.time ? " " : "") + (p.time ? i.time(a.getHours(), a.getMinutes()) : "") + (p.time || p.time_word ? p.time ? " " : ", " : "") + i.date(a.getFullYear(), a.getMonth(), a.getDate(), a.getDay()) + (p.date_word ? " " : "") + p.date_word) : p.time && (m.content = m.title = p.time_word + (p.time_word ? " " : "") + i.time(a.getHours(), a.getMinutes()) + (p.date_word ? ", " : "") + p.date_word), 
    a.getFullYear() !== g.getFullYear() && (m.content += " " + a.getFullYear())) : (p.date_word || p.time_word) && (m.content = m.title = p.time_word + (p.time_word ? ", " : "") + p.date_word), 
    p.timezone && (s = p.timezone.replace(/^([+\-]\d\d:\d\d)[\w\W]*$/, "$1"), l = u(g), 
    s !== l))) {
      var v = h(g);
      m.content += " (" + l + (v && " " + v) + ")";
    }
    return m;
  }, o.printTime = function(e, t) {
    e || (e = new Date()), t || (t = d);
    var i = new Date(), n = "";
    return n += t.date(e.getFullYear(), e.getMonth(), e.getDate(), e.getDay()) + " " + t.time(e.getHours(), e.getMinutes()), 
    e.getFullYear() !== i.getFullYear() && (n += " " + e.getFullYear()), n;
  };
  var u = o.getTimezone = function(e) {
    var t, i, n, r;
    return e || (e = new Date()), t = e.getTimezoneOffset(), r = 0 >= t ? "+" : "-", 
    t = Math.abs(t), i = v(t / 60), n = t - 60 * i, r + p(i) + ":" + p(n);
  }, h = function(e) {
    var t;
    return e || (e = new Date()), t = ("" + e).replace(/^.*:\d\d( GMT[+-]\d+)? \(?([A-Za-z ]+)\)?\d*$/, "$2").replace(/[a-z ]/g, ""), 
    3 === t.length ? t : "";
  };
  o.createEFTime = function() {
    return {
      begin_at: {
        date_word: "",
        date: "",
        time_word: "",
        time: "",
        timezone: "",
        id: 0,
        type: "EFTime"
      },
      origin: "",
      outputformat: 1,
      id: 0,
      type: "CrossTime"
    };
  };
  var p = o.lead0 = function(e, t) {
    for (e = "" + e, t || (t = 2); t > e.length; ) e = "0" + e;
    return e;
  }, f = o.formatDate = function(e) {
    var i;
    return t.test(e) ? i = e : (i = e.split("-"), i[1] = p(i[1]), i[2] = p(i[2]), i = i.join("-")), 
    i;
  }, m = o.formatTime = function(e) {
    var t;
    return i.test(e) ? t = e : (t = e.split(":"), t[0] = p(t[0]), t[1] = p(t[1]), t[2] = p(t[2]), 
    t = t.join(":")), t;
  }, g = function(t, i) {
    var n, r, a, s, o = t.match(e), l = 0;
    if (o) for (;s = o[l]; ++l) r = s.replace(e, "$1"), a = i[r], n = RegExp(s.replace(/\{/gm, "\\{").replace(/\}/gm, "\\}")), 
    t = t.replace(n, a);
    return t;
  }, v = function(e) {
    return e - e % 1;
  };
  "function" == typeof define && define("humantime", function() {
    return o;
  });
}(), define("api", function(e) {
  "use strict";
  function t(e, t) {
    var i;
    for (i in t) t.hasOwnProperty(i) && (e[i] = t[i]);
    return e;
  }
  function i(e, i, n) {
    var s, o, l, c = {};
    return t(c, d), t(c, e), s = r(), o = s.promise(), l = a(c).done(function(e, t, i) {
      var n = e && e.meta && e.meta.code;
      200 === n ? s.resolve(e.response, t, i) : s.reject(e, n, t, i);
    }).fail(function(e, t, i) {
      var n = e && e.meta && e.meta.code;
      s.reject(e, n, t, i);
    }), o.jqXHR = l, o.abort = function(e) {
      l && (l.abort(e), l = s = o = void 0);
    }, o.done(i).fail(n).always(function() {
      l = s = o = void 0;
    }), o;
  }
  var n = e("jquery"), r = n.Deferred, a = n.ajax, s = n.param, o = window._ENV_, l = {
    base_url: o.api_url,
    signin: "/Users/signin",
    getRegistrationFlag: "/Users/getRegistrationFlag",
    getUser: "/Users/:user_id",
    signout: "/Users/signout/:user_id",
    updateUser: "/Users/update",
    setPassword: "/Users/:user_id/setPassword",
    crosses: "/Users/:user_id/crosses",
    crosslist: "/Users/:user_id/crosslist",
    addIdentity: "/Users/addIdentity",
    deleteIdentity: "/Users/deleteIdentity",
    setDefaultIdentity: "/Users/setDefaultIdentity",
    mergeIdentities: "/Users/mergeIdentities",
    setup: "/users/setup",
    getIdentityById: "/Identities/:identity_id",
    complete: "/Identities/complete",
    getIdentity: "/Identities/get",
    updateIdentity: "/Identities/:identity_id/update",
    getCross: "/Crosses/:cross_id",
    gather: "/Crosses/gather",
    editCross: "/Crosses/:cross_id/edit",
    rsvp: "/Exfee/:exfee_id/rsvp",
    editExfee: "/Exfee/:exfee_id/edit",
    conversation: "/Conversation/:exfee_id",
    addConversation: "/Conversation/:exfee_id/add",
    verifyIdentity: "/Users/verifyIdentity",
    verifyUserIdentity: "/Users/verifyUserIdentity",
    forgotPassword: "/Users/forgotPassword",
    avatarUpdate: "/Avatar/update",
    getCrossByInvitationToken: "/Crosses/getCrossByInvitationToken",
    resolveToken: "/Users/resolveToken",
    resetPassword: "/Users/resetPassword",
    setupUserByInvitationToken: "/Users/setupUserByInvitationToken",
    getInvitationByToken: "/Crosses/:cross_id/getInvitationByToken",
    recognize: "/time/recognize",
    sortIdentities: "/Users/:user_id/sortIdentities",
    checkinvitationtoken: "/crosses/checkinvitationtoken",
    photox_getPhotoX: "/photox/:photox_id",
    photox_borwseSource: "/photox/browseSource",
    photox_getPhoto: "/photox/GetPhoto",
    photox_add: "/photox/:photox_id/Add",
    photox_getLikes: "/photox/:photox_id/GetLikes",
    photox_like: "/photox/Like",
    photox_del: "/photox/:photox_id/Delete"
  }, c = {
    _token: null,
    setToken: function(e) {
      this._token = e;
    },
    getToken: function() {
      return this._token;
    },
    request: function(e, t, n, r) {
      var a, o = l[e], d = t.params, u = t.resources;
      if (o) {
        if (d || (d = {}), d && (c._token && !d.token && (d.token = c._token), d = s(d), 
        o += d ? "?" + d : ""), u) for (a in u) o = o.replace(":" + a, encodeURIComponent(u[a]));
        return t.url = l.base_url + o, delete t.params, delete t.resources, i(t, n, r);
      }
    }
  }, d = {
    type: "GET",
    dataType: "JSON",
    timeout: 1e4,
    cache: !1,
    xhrFields: {
      withCredentials: !0
    }
  };
  return c;
}), define("widget", function(e) {
  "use strict";
  function t() {
    return "widget-" + d++;
  }
  function i(e) {
    return "function" == typeof e;
  }
  function n(e, t) {
    var n = e[t];
    return e && n ? i(n) ? e[t]() : n : void 0;
  }
  function r(e, t) {
    var i;
    for (i in t) "options" !== i && (e[i] = t[i]);
  }
  function a(e, t) {
    return e ? function(i) {
      return e.call(t, i);
    } : void 0;
  }
  var s = e("jquery"), o = e("base"), l = o.extend({
    options: {
      template: "<div />",
      events: null
    },
    initialize: function(e) {
      this.cid = t(), this.initOptions(e), this.parseElement(), this.delegateEvents(), 
      this.init(), l.caches[this.cid] = this;
    },
    initOptions: function(e) {
      this.setOptions(e), r(this, e);
    },
    parseElement: function() {
      var e = this.element, t = this.options.template;
      if (e ? this.element = e instanceof s ? e : s(e) : t && (this.element = s(t)), !this.element) throw "element is invalid";
      this.element.attr("data-widget-id", this.cid);
    },
    init: function() {},
    render: function() {
      return this;
    },
    delegateEvents: function(e) {
      if (e || (e = n(this.options, "events")), e) {
        this.undelegateEvents();
        var t, i, r, s, o;
        for (t in e) {
          if (i = e[t] || this[t], !i) throw 'Method "' + e[t] + '" does not exist';
          r = t.match(c), s = r[1], o = r[2] || null, s += ".delegateEvents" + this.cid, this.element.on(s, o, a(i, this));
        }
      }
    },
    undelegateEvents: function() {
      this.element.off(".delegateEvents" + this.cid);
    },
    $: function(e) {
      return this.element.find(e);
    },
    focus: function() {
      this.element.focus();
    },
    _destory: function() {
      delete l.caches[this.cid], this.undelegateEvents(), l.superclass.destory.call(this);
    }
  });
  l.caches = {};
  var c = /^(\S+)\s*(.*)$/, d = 0;
  return l;
}), define("dialog", function(e) {
  "use strict";
  function t() {
    this.isShown && this.options.backdrop ? (this.$backdrop = r(c).appendTo(this.parentNode), 
    this.$backdrop.click(r.proxy(this.hide, this)), this.$backdrop.addClass("in")) : !this.isShown && this.$backdrop && (this.$backdrop.removeClass("in"), 
    i.call(this));
  }
  function i() {
    this.$backdrop.remove(), this.$backdrop = null;
  }
  function n() {
    var e = this;
    this.isShown && this.options.keyboard ? s.on("keyup.dismiss.modal", function(t) {
      return 27 === t.which ? (t.stopPropagation(), t.preventDefault(), e && e.hide(), 
      !1) : void 0;
    }) : this.isShown || s.off("keyup.dismiss.modal");
  }
  var r = e("jquery"), a = e("widget"), s = r(document.body), o = r("#app-tmp"), l = a.extend({
    options: {
      keyboard: !0,
      backdrop: !1,
      template: '<div class="modal" tabindex="-1"><div class="modal-header"><button class="close" data-dismiss="dialog">×</button><h3></h3></div><div class="modal-main"><div class="modal-body"></div><div class="modal-footer"></div></div></div>',
      parentNode: o,
      srcNode: "",
      viewData: null,
      lifecycle: !0
    },
    init: function() {},
    render: function() {
      var e, t = this.options;
      if (this.parentNode = t.parentNode, this.srcNode = t.srcNode, delete t.parentNode, 
      delete t.srcNode, e = t.viewData) {
        var i = e.title, n = e.body, a = e.footer, s = e.others, o = e.cls;
        o && this.element.addClass(o), i && this.element.find("h3").eq(0).html(i), n && this.element.find("div.modal-body").html(n), 
        a && this.element.find("div.modal-footer").html(a), s && this.element.find("div.modal-main").append(s);
      }
      return this.element.appendTo(this.parentNode), this.element.on("click.dismiss.dialog", '[data-dismiss="dialog"]', r.proxy(this.hide, this)), 
      this.element.on("destory.widget", r.proxy(this.destory, this)), this.sync(), this;
    },
    sync: function() {
      return this.emit("sync"), this;
    },
    show: function(e) {
      return o.find(".modal").addClass("hide"), this.emit("showBefore", e), this.element.removeClass("hide"), 
      this.isShown = !0, n.call(this), t.call(this), this.element.addClass("in"), this.emit("showAfter", e), 
      this;
    },
    hide: function(e) {
      return this.emit("hideBefore", e), this.element.addClass("hide"), this.isShown = !1, 
      n.call(this), t.call(this), this.element.removeClass("in"), this.emit("hideAfter", e), 
      e && "stopPropagation" in e && (e.stopPropagation(), e.preventDefault()), this;
    },
    offSrcNode: function() {
      var e = this.srcNode;
      e && (e.data("dialog", null), e.data("destory") && e.remove());
    },
    destory: function() {
      var e = this.element;
      if (this.srcNode) {
        var t = this.srcNode.data("dialog-type");
        this.offSrcNode(), s.find('[data-dialog-type="' + t + '"]').not(e).removeData("dialog");
      }
      this._destory(), e.remove();
    }
  }), c = '<div id="js-modal-backdrop" class="modal-backdrop" />';
  return l;
}), define("typeahead", function(e) {
  "use strict";
  function t(e, t) {
    return e ? function(i) {
      return e.call(t, i);
    } : void 0;
  }
  var i = e("jquery"), n = e("widget"), r = i("#app-tmp"), a = n.extend({
    options: {
      source: [],
      template: '<div class="popmenu hide"></div>',
      target: null,
      parentNode: r,
      viewData: {
        menu: '<ul class="typeahead"></ul>',
        item: "<li></li>"
      }
    },
    isShown: !1,
    init: function() {
      this.parentNode = this.options.parentNode, this.source = this.options.source, this.element.appendTo(this.parentNode), 
      this.listen();
    },
    listen: function() {
      this.target = this.target || this.options.target, this.target.on("blur.typeahead", t(this.blur, this)).on("keypress.typeahead", t(this.keypress, this)).on("keyup.typeahead", t(this.keyup, this)).on("focus.typeahead", t(this.focus, this)), 
      i.browser.webkit | i.browser.msie | i.browser.mozilla && this.target.on("keydown.typeahead", t(this.keypress, this)), 
      this.element.on("click.typeahead", t(this.click, this)).on("mouseenter.typeahead", "li", t(this.mouseenter, this));
    },
    select: function() {
      var e = this.$(".active"), t = e.data("value");
      return this.target.val(this.updater(t)).change(), this.emit("select", t), this.hide();
    },
    updater: function(e) {
      return e;
    },
    itemRender: function(e) {
      return i(this.options.viewData.item).data("value", e).html(e);
    },
    render: function(e) {
      var t = this;
      e = i(e).map(function(e, i) {
        return t.itemRender(i, e)[0];
      });
      var n = i(this.options.viewData.menu).html(e);
      return this.element.html(n), this;
    },
    show: function() {
      var e = i.extend({}, this.target.offset(), {
        height: this.target.outerHeight()
      });
      return this.element.css({
        top: e.top + e.height,
        left: e.left
      }), this.element.removeClass("hide"), this.isShown = !0, this;
    },
    hide: function() {
      return this.element.addClass("hide"), this.isShown = !1, this;
    },
    lookup: function() {
      return this.query = i.trim(this.target.val()), this.query ? (this.emit("search", this.query), 
      void 0) : (this.emit("nothing"), this.isShown ? this.hide() : this);
    },
    next: function() {
      var e = this.element.find(".active"), t = e.next();
      t.length || (t = this.element.find("li").first()), e.removeClass("active"), t.addClass("active");
    },
    prev: function() {
      var e = this.element.find(".active"), t = e.prev();
      t.length || (t = this.element.find("li").last()), e.removeClass("active"), t.addClass("active");
    },
    focus: function() {},
    keyup: function(e, t) {
      switch (t = e.keyCode) {
       case 40:
       case 38:
        break;

       case 9:
       case 13:
        if (!this.isShown) return;
        this.select();
        break;

       case 27:
        if (!this.isShown) return;
        this.hide();
        break;

       default:
        this.lookup();
      }
      e.stopPropagation(), e.preventDefault();
    },
    keypress: function(e, t) {
      if (this.isShown) {
        switch (t = e.keyCode) {
         case 13:
         case 27:
          e.preventDefault();
          break;

         case 38:
          if ("keydown" !== e.type) return;
          e.preventDefault(), this.prev();
          break;

         case 40:
          if ("keydown" !== e.type) return;
          e.preventDefault(), this.next();
        }
        e.stopPropagation();
      }
    },
    blur: function() {
      var e = this;
      setTimeout(function() {
        e.hide();
      }, 150);
    },
    click: function(e) {
      e.stopPropagation(), e.preventDefault(), this.select();
    },
    mouseenter: function(e) {
      this.element.find(".active").removeClass("active"), i(e.currentTarget).addClass("active");
    }
  });
  return a;
}), define("panel", function(e) {
  "use strict";
  var t = e("jquery"), i = e("widget"), n = t.proxy, r = i.extend({
    options: {
      keyboard: !0,
      backdrop: !1,
      template: '<div class="panel" tabindex="-1" role="panel"><div class="panel-header"></div><div class="panel-body"></div><div class="panel-footer"></div></div>',
      parentNode: null,
      srcNode: null,
      events: null
    },
    init: function() {
      this.render();
    },
    render: function() {
      var e = this.options;
      return this.parentNode = e.parentNode, this.srcNode = e.srcNode, delete e.parentNode, 
      delete e.srcNode, this.on("escape", n(this.hide, this)), this.on("showBefore", n(this.showBefore, this)), 
      this.on("showAfter", n(this.showAfter, this)), this.element.on("destory.widget", n(this.destory, this)), 
      this;
    },
    escapable: function() {
      var e = this;
      t(document).on("keydown.panel", function(t) {
        27 === t.which && e.emit("escape");
      });
    },
    show: function() {
      return this.emit("showBefore"), this.escapable(), this.element.appendTo(this.parentNode), 
      this.emit("showAfter"), this;
    },
    hide: function(e) {
      var i = this;
      return t(document).off("keydown.panel"), i.hiding = !0, e && setTimeout(function() {
        i.hide();
      }, e), i.element.addClass("hide"), i._effect ? setTimeout(function() {
        i.destory();
      }, 500) : i.destory(), this;
    },
    effect: function(e) {
      return this._effect = e, this.element.addClass(e), this;
    },
    _destory: function() {
      this.undelegateEvents(), i.superclass.destory.call(this);
    }
  });
  return r;
}), define("xidentity", function(e) {
  "use strict";
  var t = e("jquery"), i = e("util"), n = e("api"), r = e("typeahead"), a = e("handlebars");
  return r.extend({
    itemRender: function(e) {
      this.itemTemplate || (this.template = a.compile(this.options.viewData.item)), e.external_provider = i.printExtUserName(e);
      var n = t(this.template(e));
      return delete e.external_provider, n;
    },
    matcher: function(e) {
      var t = e.external_username;
      return ~t.toLowerCase().indexOf(this.query.toLowerCase());
    },
    focus: function() {
      var e = this.query = i.trim(this.target.val());
      e ? this.emit("search", e) : this.emit("nothing", e);
    },
    select: function() {
      var e = this.$(".active"), t = e.data("value");
      return t ? (this.target.val(this.updater(t)).change(), this.emit("select", t), this.selecting = !1, 
      1 === this.element.find("li").length && this.hide(), void 0) : !1;
    },
    mouseenter: function(e) {
      return this.selecting = !0, e.stopPropagation(), e.preventDefault(), this.$(".active").removeClass("active"), 
      t(e.currentTarget).addClass("active"), this.select(), !1;
    },
    tab: function() {
      return this.hide();
    },
    keypress: function(e, t) {
      if (this.isShown) {
        switch (t = e.keyCode) {
         case 9:
          this.tab();
          break;

         case 38:
          if ("keydown" !== e.type) break;
          e.preventDefault(), this.selecting = !0, this.prev(), this.select();
          break;

         case 40:
          if ("keydown" !== e.type) break;
          e.preventDefault(), this.selecting = !0, this.next(), this.select();
        }
        e.stopPropagation();
      }
    },
    options: {
      url: null,
      useCache: !1,
      delay: 200,
      extraParams: {},
      autoClearResults: !1,
      dataType: "JSON",
      minLength: 1,
      viewData: {
        item: '<li data-value="{{external_provider}}"><i class="icon16-identity-{{provider}}"></i><span class="pull-left eun">{{external_username}}</span>{{#isOAuthIdentity provider}}<span class="pull-left provider">@{{capitalize provider}}</span>{{/isOAuthIdentity}}</li>'
      },
      onSelect: function(e) {
        this.emit("search", e);
      },
      onClearCache: function() {
        delete this.cache;
      },
      onSearch: function(e) {
        var r, a, s = this, o = s.options;
        if (s.cache || (s.cache = {}), !s.selecting && s.source && s.source.length && (a = t.grep(s.source, function(e) {
          return s.matcher(e);
        }), 0 === a.length ? s.isShown ? s.hide() : s : (a.length > 1 || e !== a[0].external_id) && s.render(a.slice(0)).show()), 
        s.timer && (clearTimeout(s.timer), s.target.next().addClass("hide")), (r = i.parseId(e)).provider) {
          var l = {
            provider: r.provider,
            external_username: r.external_username
          };
          s.timer = setTimeout(function() {
            clearTimeout(s.timer), d(e);
          }, o.delay);
          var c = function(e) {
            s.ajaxDefer && 4 > s.ajaxDefer.readyState && s.ajaxDefer.abort(), s.emit("autocomplete:beforesend", l), 
            o.useCache && s.cache[e] ? s.emit("autocomplete:finish", s.cache[e]) : s.ajaxDefer = n.request("getRegistrationFlag", {
              data: l,
              beforesend: function() {
                s.target.next().removeClass("hide");
              },
              complete: function() {
                s.target.next().addClass("hide");
              }
            }, function(t) {
              e === s.target.val() && (o.useCache && (s.cache[e] = t), t.identity || (t.identity = l), 
              s.emit("autocomplete:finish", t));
            });
          }, d = function(e) {
            e.length >= s.options.minLength ? (c(e), s.searchValue = e) : s.emit("autocomplete:clear");
          };
        } else s.emit("autocomplete:finish", null);
      }
    }
  });
}), define("xdialog", function(e, t) {
  "use strict";
  var i = e("jquery"), n = e("rex"), r = e("bus"), a = e("api"), s = e("util"), o = e("store"), l = e("handlebars"), c = e("dialog"), d = {};
  t.dialogs = d, d.identification = {
    options: {
      errors: {
        "400": "Username incorrect.",
        "403": "Password incorrect.",
        "500": "Set up this new identity."
      },
      onCheckUser: function() {
        var e = o.get("lastIdentity"), t = o.get("last_external_username");
        e && (this.availability = !0, this.$("#identity").val(t), this.$(".x-signin").removeClass("disabled loading"), 
        this.$(".user-identity").removeClass("hide").find("img").attr("src", e.avatar_filename).next().attr("class", "provider icon16-identity-" + e.provider), 
        this.$(".xbtn-forgotpwd").data("source", [ e ]), this.switchTab("d01")), this.$(".help-subject").toggleClass("icon14-question", !this.availability);
      },
      onShowBefore: function(e) {
        var t = i(e.currentTarget).data("source");
        "string" == typeof t ? this.$("#identity").val(t) : this.emit("checkUser");
      },
      onShowAfter: function() {
        ("d00" === this.switchTabType || "d01" === this.switchTabType || "d02" === this.switchTabType) && this.$("#identity").focusend();
      },
      onHideAfter: function() {
        this.$(".modal-body").eq(0).css("opacity", 1), this.switchTabType = "d00", this._oauth_ && (this._oauth_.abort(), 
        this._oauth_ = null), this.destory(), i(".popmenu").remove();
      },
      events: {
        "keypress .modal-main": function(e) {
          var t = this.switchTabType, i = e.keyCode;
          !this.availability || "d01" !== t && "d02" !== t || 13 !== i || this.$(".x-signin").click();
        },
        "click .oauth > a": function(e) {
          e.stopPropagation(), e.preventDefault();
          var t = this, n = i(e.currentTarget), r = n.data("oauth");
          t.$(".authentication").find(".oauth-provider").text(r), t._oauth_ = i.ajax({
            url: "/OAuth/Authenticate?provider=" + r,
            type: "POST",
            dataType: "JSON",
            data: {
              refere: window.location.href
            },
            beforeSend: function() {
              t.$(".modal-body").eq(0).css("opacity", 0), t.switchTab("d05"), t.$(".authentication").find("img").removeClass("hide"), 
              t.$(".authentication").find(".redirecting").removeClass("hide"), t.$(".authentication").find(".xalert-fail").addClass("hide"), 
              t.$(".xbtn-oauth").addClass("hide");
            },
            success: function(e) {
              var i = e.meta.code;
              200 === i ? window.location.href = e.response.redirect : (t.$(".authentication").find("img").addClass("hide"), 
              t.$(".authentication").find(".redirecting").addClass("hide"), t.$(".authentication").find(".xalert-fail").removeClass("hide"), 
              t.$(".xbtn-oauth").removeClass("hide"));
            }
          });
        },
        "click .xbtn-oauth": function() {
          return this.$(".modal-body").eq(0).css("opacity", 1), this.switchTab("d00"), !1;
        },
        "click .xbtn-verify": function(e) {
          var t = this, n = i(e.currentTarget);
          if (n.hasClass("xbtn-success")) return t.$(".verify-after").addClass("hide"), n.removeClass("xbtn-success").text("Verify"), 
          t.hide(), !1;
          var r = t._identity.provider, s = t._identity.external_id;
          a.request("verifyIdentity", {
            type: "POST",
            data: {
              provider: r,
              external_username: s
            }
          }, function(e) {
            t.$(".verify-before").addClass("hide"), "VERIFYING" === e.action ? (t.$(".verify-after").removeClass("hide"), 
            n.addClass("xbtn-success").text("Done")) : n.addClass("verify-error").removeClass("hide");
          });
        },
        "blur #identity": function(e) {
          var t = s.trim(i(e.currentTarget).val()), n = this.$('[for="identity"]'), r = n.find("span");
          t.length && !s.parseId(t).provider ? (n.addClass("label-error"), r.text("Invalid identity.")) : (n.removeClass("label-error"), 
          r.text(""));
        },
        "blur #name": function(e) {
          var t = s.trim(i(e.currentTarget).val()), n = this.$('[for="name"]'), r = n.find("span");
          t ? s.utf8length(t) > 30 ? (r.text("Too long."), n.addClass("label-error")) : s.zh_CN.test(t) ? (n.addClass("label-error"), 
          r.text("Invalid character.")) : (n.removeClass("label-error"), r.text("")) : (n.addClass("label-error"), 
          r.text(""));
        },
        "blur #password": function(e) {
          var t = s.trim(i(e.currentTarget).val()), n = this.$('[for="password"]'), r = n.find("span");
          t ? (n.removeClass("label-error"), r.text("")) : (n.addClass("label-error"), r.text("Password incorrect."));
        },
        "click .help-subject": function(e) {
          var t, n = i(e.currentTarget);
          n.hasClass("icon14-question") ? (t = 'Identity is your online representative, such as email, <span class="strike">mobile no.</span>, and your account username on other websites like Twitter, Facebook, etc.', 
          n.parent().find(".xalert-error:eq(0)").html(t).removeClass("hide")) : (n.toggleClass("icon14-question icon14-clear"), 
          this.resetInputs(), this.$(".phone-tip").addClass("hide"), this.$(".user-identity").addClass("hide"), 
          o.remove("lastIdentity"), o.remove("last_external_username"), o.remove("authorization"), 
          o.remove("user"), o.remove("identities"), this.$('[data-typeahead-type="identity"]').data("typeahead").source = null, 
          this.switchTab("d00"));
        },
        "click #password-eye": function(e) {
          var t = i(e.currentTarget), n = t.prev();
          n.prop("type", function(e, t) {
            return "password" === t ? "text" : "password";
          }), t.toggleClass("icon16-pass-hide icon16-pass-show");
        },
        "click .xbtn-forgotpwd": function(e) {
          e.preventDefault(), this.element.addClass("hide"), i("#js-modal-backdrop").addClass("hide");
        },
        "click .xbtn-setup": function(e) {
          e.preventDefault(), this.$(".modal-body").eq(0).css("opacity", .05), this.switchTab("d03");
        },
        "click .xbtn-isee": function(e) {
          e.preventDefault(), this.$(".modal-body").eq(0).css("opacity", 1), this.$("#identity").val(""), 
          this.switchTab("d02");
        },
        "click .xbtn-startover": function(e) {
          e.preventDefault(), this.$("#identity").val(""), this.resetInputs(), this.switchTab("d00", !0);
        },
        "click .x-signin": function(e) {
          var t = i(e.currentTarget);
          if (!t.hasClass("disabled")) {
            var n = this, r = this.switchTabType, l = this.getFormData(r);
            n.$("#password").trigger("blur"), "d02" === r && n.$("#name").trigger("blur"), l.password && ("d02" !== r || l.name) && ("d01" === r || "d02" === r) && a.request("signin", {
              type: "POST",
              data: {
                external_username: l.external_username,
                provider: l.provider,
                password: l.password,
                name: l.name || "",
                auto_signin: !!l.auto_signin
              },
              beforeSend: function() {
                t.addClass("disabled loading");
              },
              complete: function() {
                t.removeClass("disabled loading");
              }
            }, function(e) {
              if (delete App.request.session.browsing_authorization, delete App.request.session.browsing_user, 
              o.set("authorization", e), o.set("last_external_username", s.printExtUserName(l)), 
              n.hide(), "d01" === r || "d02" === r) window.location.reload(); else {
                var t = new c(d.welcome);
                t.render(), t.show({
                  identity: {
                    name: l.name,
                    provider: l.provider
                  }
                });
              }
            }, function(e) {
              var t = e.meta && e.meta.code || 400;
              n.$('[for="password"]').addClass("label-error").find("span").text(n.options.errors[t]);
            });
          }
        }
      },
      backdrop: !0,
      viewData: {
        cls: "modal-id",
        title: "Start",
        body: '<div class="shadow title">Welcome to <span class="x-sign">EXFE</span></div><div class="clearfix"><div class="pull-left authorize">Authenticate with:</div><div class="pull-left oauth"><a href="#" class="oauth-twitter" data-oauth="twitter">twitter</a><a href="#" class="oauth-facebook" data-oauth="facebook">facebook</a></div></div><div class="orspliter">or</div><form class="modal-form"><fieldset><legend>Use your online identity:</legend><div class="clearfix control-group"><label class="control-label" for="identity">Identity: <span class="xalert-message"></span></label><div class="pull-right user-identity hide"><div class="avatar"><img src="" alt="" width="40" height="40" /><i class="provider"></i></div></div><div class="controls"><input type="text" class="input-large identity" id="identity" autocomplete="off" data-widget="typeahead" data-typeahead-type="identity" placeholder="Enter your email or phone" /><i class="help-subject"></i><i class="help-inline small-loading hide"></i><div class="xalert xalert-error hide" style="margin-top: 5px;"></div><div class="xalert xalert-error authenticate hide" style="margin-top: 5px;"><span class="xalert-fail">Please directly authenticate identity above.</span><br />To enable password sign-in for this identity, set an <span class="x-sign">EXFE</span> password first in your profile page.</div><div class="xalert phone-tip hide" style="padding: 5px;">Please format phone number with country<br /> code prefix, e.g.: +1 555 450 0303</div></div></div><div class="form-title d d02 hide">Welcome! Please set up your new account.<span class="pull-right form-title-bd"></span></div><div class="control-group d d02 hide"><label class="control-label" for="name">Full name: <span></span></label><div class="controls"><input type="text" class="input-large" id="name" autocomplete="off" placeholder="Desired recognizable name" /></div></div><div class="control-group d d01 d02 hide"><label class="control-label" for="password">Password: <span></span></label><div class="controls"><input type="password" class="input-large" id="password" autocomplete="off" /><i class="help-inline icon16-pass-hide pointer" id="password-eye"></i></div></div><div class="control-group d d01 hide"><div class="control-label"><label class="checkbox pointer"><input type="checkbox" id="auto-signin" value="1" checked />Sign in automatically</label></div></div><div class="verify-before d d04 hide"><span class="xalert-fail">This identity requires verification before using.</span><br />Confirm sending verification to your mailbox?</div><div class="verify-after hide">Verification sent, it should arrive in minutes. Please check your mailbox and follow the instruction.</div><div class="verify-error hide"><span class="xalert-fail">Requested too much, hold on awhile.</span><br />Receive no verification email? It might be mistakenly filtered as spam, please check and un-spam. Alternatively, use ‘Manual Verification’.</div></fieldset></form>',
        footer: '<button class="xbtn-white d d01 xbtn-forgotpwd hide" data-dialog-from="identification" data-widget="dialog" data-dialog-type="forgotpassword">Forgot Password...</button><button class="xbtn-white d d02 d04 xbtn-startover hide">Start Over</button><button class="pull-right d d04 xbtn-blue xbtn-verify hide">Verify</button><a href="#" class="pull-right xbtn-setup d d00 hide">Looking for sign-up?</a><button class="pull-right xbtn-blue d d01 d02 x-signin disabled hide">Start</button><button class="pull-right xbtn-white d d03 xbtn-isee hide">I See</button><button class="pull-right xbtn-white d hide">OK</button><button class="pull-right xbtn-white d xbtn-oauth hide">Back</button>',
        others: '<div class="isee d d03 hide"><div class="modal-body"><div class="shadow title">“Sign-Up-Free”</div><p>Tired of signing up all around? Just authorize through your existing accounts from other websites, such as Twitter, <span class="strike">Facebook, Google, etc.</span> (soon to support)</p><p>We hate spam, will NEVER disappoint your trust.</p><p>Alternatively, traditional registration process with email and password is also available.</p></div></div><div class="authentication d d05 hide"><div class="modal-body"><div class="shadow title">Authentication</div><div class="content"><img class="hide" src="/static/img/loading.gif" width="32" height="32" /><p class="redirecting hide">Redirecting to <span class="oauth-provider"></span>…</p><p class="xalert-fail hide">Failed to connect with <span class="oauth-provider"></span> server.</p></div></div></div>'
      }
    }
  }, d.sandbox = {
    options: {
      onHideAfter: function() {
        this.destory();
      },
      backdrop: !1,
      viewData: {
        cls: "mblack modal-sandbox",
        title: "Rome",
        body: '<div class="shadow title">“Rome wasn\'t built in a day.”</div><p><span class="x-sign">EXFE</span> [’ɛksfi] is still in <span class="pilot">pilot</span> period (with <span class="sandbox">Rome</span> tag). We’re building up blocks, consequently something buggy or awkward may happen. Our apologies for any trouble you may encounter. Any feedback, please email <span class="feedback">feedback@exfe.com</span>. Much appreciated.</p>'
      }
    }
  }, d.welcome = {
    options: {
      events: {
        "click .xbtn-go": function() {
          var e = this;
          if ("email" === this._provider) {
            if (/^\/![a-zA-z0-9]+$/.test(window.location.pathname)) return window.location = window.location.pathname, 
            void 0;
          } else this.$("#follow").prop("checked") && this._token && i.ajax({
            url: "/OAuth/followExfe?token=" + this._token,
            type: "POST",
            data: {
              identity_id: this._identity_id
            },
            success: function() {
              o.remove("oauth");
            }
          });
          e.hide();
        },
        "click .why": function() {
          this.$(".answer").toggleClass("hidden");
        }
      },
      onShowBefore: function(e) {
        var t = e.identity, i = this.$(".title").eq(0);
        this._provider = t.provider, this._identity_id = t.id, this._token = e.token, this._following = e.following, 
        i.text("Hi, " + t.name + "."), "email" === t.provider ? this.$(".provider-email").removeClass("hide") : "twitter" === t.provider && (this.$(".provider-other").removeClass("hide"), 
        this.$("#follow").prop("checked", this._following));
      },
      onHideAfter: function() {
        this.destory();
      },
      backdrop: !1,
      viewData: {
        cls: "mblack modal-large modal-wc",
        title: "Welcome",
        body: '<div class="shadow title"></div><div class="center shadow title" style="margin-bottom: 0;">Thanks for using <span class="x-sign">EXFE</span>.</div><p class="center">The group utility for gathering.</p><div class="modal-content"><p>Save yourself from calling every one RSVP repeatedly, losing in endless emails messages off-the-point.</p><p><span class="x">·X·</span> (cross) is a gathering, for things to do together. <span class="x-sign">EXFE</span> friends for meetings, parties, sports, trips, etc. Anything you want to gather friends to do.</p><p><span class="x-sign">EXFE</span> your friends, Gather a <span class="x">·X·</span>.</p><p class="provider-email hide" style="color: #191919;">*A welcome email has been sent to your email. Please check to verify your address.*</p><div class="provider-other hide">&nbsp;&nbsp;<span class="underline why">why?</span><label class="pull-left checkbox pointer"><input type="checkbox" id="follow" value="1" checked />Follow @<span class="x-sign">EXFE</span> on Twitter.</label><p class="pull-left answer hidden">So we could send you invitation PRIVATELY through Direct Message. We hate spam, will NEVER disappoint your trust.</p></div></div>',
        footer: '<button class="pull-right xbtn-white xbtn-go">GO</button>'
      }
    }
  }, d.forgotpassword = {
    tab: "",
    updateIdentity: function(e) {
      var t = e.provider, i = this.$(".context-identity");
      this.$(".tab").addClass("hide"), this.$(".xbtn-done").addClass("hide"), "email" === t ? (this.tab = "tab0", 
      this.$(".tab0").eq(0).removeClass("hide"), this.$(".xbtn-send").removeClass("hide").data("identity", e)) : "phone" === t ? (this.tab = "tab1", 
      this.$(".tab1").eq(0).removeClass("hide"), this.$(".xbtn-send").removeClass("hide").data("identity", e)) : (this.tab = "tab2", 
      this.$(".tab2").eq(0).removeClass("hide"), this.$(".authenticate").removeClass("hide").data("identity", e), 
      this.$(".provider-text").text(t.substr(0, 1).toUpperCase() + t.substr(1))), i.find(".avatar img").attr("src", e.avatar_filename), 
      i.find(".provider").attr("class", "provider icon16-identity-" + t), i.find(".identity").text(e.eun);
    },
    options: {
      onHideAfter: function(e) {
        if (this.befer && (this.befer.abort(), this.befer = null), e) {
          var t = this.dialog_from;
          t && i('[data-dialog-type="' + t + '"]').data("dialog").hide();
        }
        this.destory();
      },
      events: {
        "click .authenticate": function(e) {
          var t = this, n = i(e.currentTarget), r = n.data("identity");
          r && (t.befer = a.request("forgotPassword", {
            type: "POST",
            data: {
              provider: r.provider,
              external_username: r.external_username
            },
            beforeSend: function() {
              t.$(".authenticate-before.tab2").removeClass("hide"), n.addClass("disabled");
            },
            complete: function() {
              n.removeClass("disabled");
            }
          }, function(e) {
            "REDIRECT" === e.action && (window.location.href = e.url);
          }));
        },
        "click .caret-outer": function(e) {
          this.$(".dropdown-toggle").addClass("open"), e.stopPropagation();
        },
        "hover .dropdown-menu > li": function(e) {
          var t = e.type, n = i(e.currentTarget);
          n[("mouseenter" === t ? "add" : "remove") + "Class"]("active");
        },
        "click .dropdown-menu > li": function(e) {
          var t = this.$(".dropdown-menu").data("identities"), n = i(e.currentTarget).data("index");
          this.updateIdentity(t[n]);
        },
        "click .xbtn-cancel": function() {
          var e = this.dialog_from;
          this.hide(), e && (i('[data-dialog-type="' + e + '"]').data("dialog").element.removeClass("hide"), 
          i("#js-modal-backdrop").removeClass("hide"));
        },
        "click .xbtn-done": function(e) {
          this.hide(e);
        },
        "click .xbtn-send": function(e) {
          var t = this, n = t.tab, r = i(e.currentTarget);
          if (!r.hasClass("disabled")) {
            var s = r.data("identity");
            s && (t.befer = a.request("forgotPassword", {
              type: "POST",
              data: {
                provider: s.provider,
                external_username: s.external_username
              },
              beforeSend: function() {
                t.$(".send-before." + n).removeClass("hide"), t.$(".send-after." + n).addClass("hide"), 
                r.addClass("disabled");
              },
              complete: function() {
                t.$(".send-before." + n).addClass("hide"), t.$(".send-after." + n).removeClass("hide"), 
                r.removeClass("disabled");
              }
            }, function(e) {
              "VERIFYING" === e.action && (t.$(".identity").next().removeClass("hide"), r.addClass("hide"), 
              t.$(".xbtn-done").removeClass("hide"), t.$(".send-before." + n).addClass("hide"), 
              t.$(".send-after." + n).removeClass("hide"));
            }));
          }
        }
      },
      onShowBefore: function(e) {
        var t, n, r, a = this, s = i(e.currentTarget).data("source"), o = "email phone facebook twitter";
        if (s && (t = s.length)) {
          if (n = s[0], r = n.external_username, "twitter" === n.provider && (r = "@" + n.external_username), 
          n.eun = r, t > 1) {
            a.$(".context-identity").addClass("switcher");
            for (var l = "", c = 0; t > c; c++) {
              var d = s[c].provider;
              0 > o.search(d) || (r = s[c].external_username, l += '<li data-index="' + c + '"><i class="pull-right icon16-identity-' + d + '"></i>', 
              "twitter" === s[c].provider && (r = "@" + s[c].external_username), s[c].eun = r, 
              l += "<span>" + r + "</span>", l += "</li>");
            }
            a.$(".dropdown-menu").html(l).data("identities", s);
          }
          this.updateIdentity(n);
        }
      },
      backdrop: !1,
      viewData: {
        cls: "mblack modal-fp",
        title: "Forgot Password",
        body: '<div class="shadow title">Forgot Password</div><div>You can reset your <span class="x-sign">EXFE</span> password through identity:</div><div class="context-identity"><div class="pull-right avatar"><img src="" alt="" width="40" height="40" /><i class="provider"></i></div><div class="clearfix dropdown-toggle" data-toggle="dropdown"><div class="pull-left box identity"></div><ul class="dropdown-menu"></ul><div class="pull-left caret-outer hide"><b class="caret"></b></div></div></div><div class="alert-label"><div class="send-before tab tab0 hide">Confirm sending reset token to your mailbox?</div><div class="send-after tab tab0 hide">Verification sent, it should arrive in minutes. Please check your mailbox and follow the instruction.</div><div class="send-before tab tab1 hide">Confirm sending reset token to your phone?</div><div class="send-after tab tab1 hide">Verification sent, it should arrive in minutes.</div><div class="xalert-error tab hide"><p>Requested too much, hold on awhile.</p><p>Receive no verification email? It might be mistakenly filtered as spam, please check and un-spam. Alternatively, use ‘Manual Verification’.</p></div><div class="authenticate-before tab tab2 hide">You will be directed to <span class="provider-text"></span> website to authenticate identity above, you can reset password then.</div></div>',
        footer: '<button class="pull-right xbtn-white xbtn-done hide">Done</button><button class="pull-right xbtn-blue xbtn-send tab tab0 tab1 hide">Send</button><button class="pull-right xbtn-blue authenticate tab tab2 hide">Authenticate</button><a class="pull-right xbtn-cancel">Cancel</a>'
      }
    }
  }, d.changepassword = {
    options: {
      onHideAfter: function() {
        this.befer && (this.befer.abort(), this.befer = null), this.destory();
      },
      events: {
        "click .xbtn-resetpwd": function(e) {
          var t = o.get("user"), r = t.identities, a = n.filter(r, function(e) {
            return "CONNECTED" === e.status ? !0 : void 0;
          });
          if (1 === a.length) {
            e.stopPropagation(), this.hide();
            var s = new c(d.forgotpassword);
            s.dialog_from = "changepassword", s.render(), i(e.currentTarget).data("identity-id", a[0].id), 
            s.show(e);
          }
        },
        "click .password-eye": function(e) {
          var t = i(e.currentTarget), n = t.prev();
          n.prop("type", function(e, t) {
            return "password" === t ? "text" : "password";
          }), t.toggleClass("icon16-pass-hide icon16-pass-show");
        },
        "click .xbtn-forgotpwd": function(e) {
          var t = o.get("user"), r = t.identities, a = r.length, s = [];
          1 === a ? s.push(r[0]) : n.each(r, function(e) {
            var t = e.status;
            ("CONNECTED" === t || "REVOKED" === t) && s.push(e);
          }), i(e.currentTarget).data("source", s);
        },
        "click .xbtn-success": function(e) {
          var t = this, n = t.$("#cppwd").val(), r = t.$("#cp-npwd").val();
          if (!n || !r) return n ? alert("Please input new password.") : alert("Please input current password."), 
          void 0;
          e.preventDefault();
          var s = i(e.currentTarget), l = o.get("authorization"), c = l.user_id, d = l.token;
          t.befer = a.request("setPassword", {
            type: "POST",
            params: {
              token: d
            },
            resources: {
              user_id: c
            },
            data: {
              current_password: n,
              new_password: r
            },
            beforeSend: function() {
              s && s.addClass("disabled loading");
            },
            complete: function() {
              s && s.removeClass("disabled loading");
            }
          }, function(e) {
            o.set("authorization", e), t && t.destory();
          }, function(e) {
            var i = e && e.meta;
            if (i) if (403 === i.code) {
              var n = e.meta.errorType;
              "invalid_current_password" === n && alert("Invalid current password.");
            } else 401 === i.code && "authenticate_timeout" === i.errorType && t && t.destory();
          });
        }
      },
      onShowBefore: function() {
        var e = o.get("user");
        this.$(".avatar > img").attr("src", e.avatar_filename), this.$(".username").text(e.name);
      },
      backdrop: !1,
      viewData: {
        cls: "modal-cp mblack modal-large",
        title: "Change Password",
        body: '<div class="shadow title">Change Password</div><form class="modal-form"><fieldset><legend>Enter your current <span class="x-sign">EXFE</span> password, and set new one. All your identities share the same password for sign-in and account management.</legend><div class="clearfix context-user"><div class="pull-left avatar"><img src="" width="40" height="40" /></div><div class="pull-left username"></div></div><div class="control-group"><label class="control-label" for="cppwd">Password:</label><div class="controls"><input class="input-large" id="cppwd" placeholder="Current password" type="password" autocomplete="off" /><i class="help-inline password-eye icon16-pass-hide pointer"></i></div></div><div class="control-group"><label class="control-label" for="cp-npwd">New Password:</label><div class="controls"><input class="input-large" id="cp-npwd" placeholder="Set new EXFE password" type="password" autocomplete="off" /><i class="help-inline password-eye icon16-pass-hide pointer"></i></div></div></fieldset></form>',
        footer: '<button class="xbtn-white xbtn-forgotpwd" data-dialog-from="changepassword" data-widget="dialog" data-dialog-type="forgotpassword">Forgot Password...</button><button class="pull-right xbtn-blue xbtn-success">Change</button><a class="pull-right xbtn-discard" data-dismiss="dialog">Discard</a>'
      }
    }
  }, d.addidentity = {
    options: {
      errors: {
        failed: "Password incorrect.",
        no_password: "Password incorrect.",
        no_external_id: "Set up this new identity."
      },
      backdrop: !1,
      submitStatus: !0,
      events: {
        "submit .modal-form": function() {
          return this.submitStatus && (this.$(".xbtn-add").trigger("click"), this.submitStatus = !1), 
          !1;
        },
        "click .xbtn-cancel": function() {
          this.destory();
        },
        "click .xbtn-add": function(e) {
          e.preventDefault();
          var t = this, r = t.result;
          if (!r) return !1;
          var a = r.registration_flag, s = r.identity, c = s.provider, d = s.external_username, u = o.get("user"), h = u.identities;
          if ("AUTHENTICATE" !== a) {
            if (n.find(h, function(e) {
              return e.provider === c && e.external_username === d ? !0 : void 0;
            })) return t.destory(), void 0;
            var p = t.addIdentity;
            p({
              external_username: d,
              provider: c
            }, t, null, function(e) {
              var t = e.identity;
              h.push(t), o.set("user", u);
              var n = l.compile(i("#jst-identity-item").html()), r = n(e.identity);
              i(".identity-list").append(r);
              var a = i(".modal-ai");
              a.find("#identity").prop("disabled", !0), a.find(".xbtn-add").addClass("hide"), 
              a.find(".help-subject").addClass("im-hide"), a.find(".phone-tip").addClass("hide"), 
              a.find(".success-tip").removeClass("hide"), a.find(".xbtn-done").removeClass("hide").focus();
            });
          } else t.$('.oauth > a[data-oauth="' + c + '"]').trigger("click");
        },
        "click .xbtn-done": function() {
          this.hide();
        },
        "click .help-subject": function(e) {
          e.preventDefault(), this.$(".user-identity").addClass("hide"), this.$(".help-subject").addClass("im-hide"), 
          this.reset(), this.$("#identity").val("").focus();
        },
        "click .oauth > a": function(e) {
          e.preventDefault();
          var t, n = this.result, r = "", a = this;
          if (n) {
            var s = n.identity;
            t = s.provider, r = s.external_username;
          } else t = i(e.target).data("oauth");
          a.$(".authentication").find(".oauth-provider").text(t);
          var o = a.addIdentity;
          return o({
            refere: window.location.href,
            external_username: r,
            provider: t
          }, a, function() {
            a.$(".modal-body").eq(0).css("opacity", 0), a.switchTab("d1"), a.$(".authentication").find("img").removeClass("hide"), 
            a.$(".authentication").find(".redirecting").removeClass("hide"), a.$(".authentication").find(".xalert-fail").addClass("hide");
          }, function(e) {
            window.location.href = e.url, a && a.destory();
          }), !1;
        }
      },
      onShowBefore: function() {
        this.element.removeClass("hide"), this.$("#identity").focusend();
      },
      onHideAfter: function() {
        this.befer && (this.befer.abort(), this.befer = null), this.destory();
      },
      viewData: {
        cls: "mblack modal-id modal-ai",
        title: "Add Identity",
        body: '<div class="shadow title">Add Identity</div><div class="clearfix"><div class="pull-left authorize">Authenticate with:</div><div class="pull-left oauth"><a href="#" class="oauth-twitter" data-oauth="twitter">twitter</a><a href="#" class="oauth-facebook" data-oauth="facebook">facebook</a><a href="#" class="oauth-dropbox hide" data-oauth="dropbox">dropbox</a><a href="#" class="oauth-flickr hide" data-oauth="flickr">flickr</a><a href="#" class="oauth-instagram hide" data-oauth="instagram">instagram</a></div></div><div class="orspliter">or</div><form class="modal-form"><fieldset><legend>Enter identity manually:</legend><div class="clearfix control-group"><label class="control-label" for="identity">Identity: <span class="xalert-message"></span></label><div class="pull-right user-identity hide"><div class="avatar"><img src="" alt="" width="40" height="40" /><i class="provider"></i></div></div><div class="controls"><input type="text" class="input-large identity" id="identity" autocomplete="off" data-widget="typeahead" data-typeahead-type="identity" placeholder="Enter your email or phone" /><i class="help-subject icon14-clear im-hide"></i><i class="help-inline small-loading hide"></i><div class="xalert xalert-error hide" style="margin-top: 5px;"></div><div class="xalert xalert-error authenticate hide" style="margin-top: 5px;"><span class="xalert-fail">Please directly authenticate identity above.</span><br />To enable password sign-in for this identity, set an <span class="x-sign">EXFE</span> password first in your profile page.</div><div class="xalert phone-tip hide" style="padding: 5px;">Please format phone number with country<br /> code prefix, e.g.: +1 555 450 0303</div><div class="xalert success-tip hide" style="padding: 5px;">Add identity request is sent, it should arrive in minutes. Please check your email for instructions.</div></div></div></fieldset></form>',
        footer: '<button class="pull-right xbtn-blue xbtn-add d d0">Add</button><button class="pull-right xbtn-white xbtn-done d d0 hide">Done</button><a class="pull-right xbtn-cancel d d0">Cancel</a>',
        others: '<div class="authentication d d1 hide"><div class="modal-body"><div class="shadow title">Authentication</div><div class="content"><img class="hide" src="/static/img/loading.gif" width="32" height="32" /><p class="redirecting hide">Redirecting to <span class="oauth-provider"></span>…</p><p class="xalert-fail hide">Failed to connect with <span class="oauth-provider"></span> server.</p></div></div></div>'
      }
    },
    addIdentity: function u(e, t, n, r) {
      var s = o.get("authorization"), l = s.token, c = a.request("addIdentity", {
        type: "POST",
        params: {
          token: l
        },
        data: e,
        beforeSend: function() {
          n && n();
        }
      }, function(e) {
        r && r(e);
      }, function(n) {
        var r = n && n.meta;
        if (r && 401 === r.code && "authenticate_timeout" === r.errorType) {
          var a = i('<div data-widget="dialog" data-dialog-type="authentication" data-destory="true" class="hide"></div>');
          i("#app-tmp").append(a);
          var s = i.Event("click.dialog.data-api");
          s._data = {
            callback: function() {
              u({
                external_username: e.external_username,
                provider: e.provider
              });
            }
          }, t && t.destory(), a.trigger(s);
        }
      });
      t && (t.defer = c);
    },
    switchTab: function(e) {
      this.$(".d").not(".hide").addClass("hide").end().filter("." + e).removeClass("hide"), 
      this.switchTabType = e;
    },
    reset: function() {
      this.result = null;
    },
    init: function() {
      var e = this;
      r.off("widget-dialog-identification-auto"), r.on("widget-dialog-identification-auto", function(t) {
        var i = e.result = t;
        if (e && e.$(".help-subject")[(i ? "remove" : "add") + "Class"]("im-hide"), i) {
          var n = i.identity;
          n && n.avatar_filename && e.$(".user-identity").removeClass("hide").find("img").attr("src", n.avatar_filename).next().attr("class", "provider icon16-identity-" + n.provider), 
          n || e.reset(), e.$(".phone-tip").toggleClass("hide", "phone" !== n.provider);
        }
      }), r.off("widget-dialog-identification-nothing"), r.on("widget-dialog-identification-nothing", function() {
        e.$(".phone-tip").addClass("hide");
      });
    }
  }, d.addIdentityAfterSignIn = {
    options: {
      events: {
        "click .xbtn-cancel": function() {
          this.destory();
        },
        "click .xbtn-add": function() {
          var e = this, t = o.get("authorization"), n = t.token, r = this._identity.external_username, s = this._identity.provider;
          a.request("addIdentity", {
            type: "POST",
            params: {
              token: n
            },
            data: {
              external_username: r,
              provider: s
            }
          }, function(t) {
            var i = t.identity, n = o.get("user"), r = n.identities;
            r.push(i), o.set("user", n), e.destory(), window.location.href = "/";
          }, function(t) {
            var n = t && t.meta;
            if (n && 401 === n.code && "authenticate_timeout" === n.errorType) {
              e.destory();
              var r = i('<div data-widget="dialog" data-dialog-type="authentication" data-destory="true" class="hide"></div>');
              i("#app-tmp").append(r), r.trigger("click.dialog.data-api");
            }
          });
        }
      },
      backdrop: !1,
      viewData: {
        cls: "mblack modal-aifsi",
        title: "Set Up Account",
        body: '<div class="shadow title">Add Identity</div><div class="clearfix context-user"><div class="pull-left avatar"><img width="40" height="40" alt="" src="" /></div><div class="pull-left username"></div></div><div>Please authorize identity underneath through Twitter to add into your account above.</div><div class="context-identity"><div class="pull-right avatar"><img width="40" height="40" alt="" src="" /><i class="provider"></i></div><div class="clearfix"><div class="pull-left box identity"></div></div></div>',
        footer: '<button class="pull-right xbtn-blue xbtn-add">Add</button><a class="pull-right xbtn-cancel">Cancel</a>'
      },
      onShowBefore: function(e) {
        var t = i(e.currentTarget).data("source"), n = t.identity, r = o.get("user");
        this._identity = n, this.$(".context-user").find("img").attr("src", r.avatar_filename).parent().next().text(r.name), 
        this.$(".context-identity").find("img").attr("src", n.avatar_filename).next().addClass("icon16-identity-" + n.provider), 
        this.$(".identity").text(s.printExtUserName(n)), "email" !== n.provider && this.$(".xbtn-done").text("Authorize");
      }
    }
  }, d.mergeidentity = {
    options: {
      onHideAfter: function() {
        this.destory();
      },
      events: {
        "click .xbtn-donot": function() {
          this.hide();
        },
        "click .xbtn-merge": function() {
          var e = this, t = this.$(".merge-list").find("input:checked"), i = [];
          if (t.length) {
            for (var n = 0, r = t.length; r > n; ++n) i.push(t.eq(n).parents("li").data("identity-id"));
            return a.request("mergeIdentities", {
              type: "POST",
              params: {
                token: this.browsing_token
              },
              data: {
                identity_ids: "[" + ("" + i) + "]"
              }
            }, function() {
              e.hide(), window.location.href = "/";
            }), void 0;
          }
          this.hide();
        }
      },
      backdrop: !1,
      viewData: {
        cls: "mblack modal-mi",
        title: "Merge Identity",
        body: '<div class="shadow title">Merge Identity</div><div>You just successfully merged identity underneath:</div><div class="context-identity"><div class="pull-right avatar"><img width="40" height="40" alt="" src="" /><i class="provider"></i></div><div class="clearfix"><div class="pull-left box identity"></div></div></div><div class="clearfix merge-container"><div class="alert-label">Following identities might also belong to you. Merge them into your current account to avoid switching identities back and forth.</div><div class="merge-list"><ul class="unstyled"></ul></div></div>',
        footer: '<button class="pull-right xbtn-blue xbtn-merge" style="margin-left: 10px;">Merge</button><button class="pull-right xbtn-white xbtn-donot">Do NOT</button>'
      },
      onShowBefore: function(e) {
        var t = i(e.currentTarget).data("source"), n = t.merged_identity, r = t.browsing_token, a = t.mergeable_user, o = a.identities, l = '<li class="clearfix" data-identity-id="{{id}}"><label for="identity-{{i}}"><input class="pull-left" id="identity-{{i}}" name="identity-{{i}}" type="checkbox" /><div class="pull-left box identity">{{external_username}}</div><div class="pull-right avatar"><img width="40" height="40" alt="" src="{{avatar_filename}}" /><i class="provider icon16-identity-{{provider}}"></i></div></label></li>', c = this.$(".merge-list ul");
        this.$(".context-identity").find("img").attr("src", n.avatar_filename), this.$(".context-identity").find(".identity").text(s.printExtUserName(n)), 
        this.browsing_token = r;
        for (var d = 0, u = o.length; u > d; ++d) c.append(i(l.replace("{{id}}", o[d].id).replace(/\{\{i\}\}/g, d).replace("{{external_username}}", s.printExtUserName(o[d])).replace("{{avatar_filename}}", o[d].avatar_filename).replace("{{provider}}", o[d].provider)));
      }
    }
  }, d.verification_email = {
    options: {
      onHideAfter: function() {
        this.befer && (this.befer.abort(), this.befer = null), this.destory();
      },
      events: {
        "click .xbtn-verify": function(e) {
          var t = i(e.currentTarget);
          if (t.hasClass("disabled") || t.hasClass("success")) return t.hasClass("success") && this.hide(), 
          void 0;
          var n = this, r = t.data("identity_id"), s = o.get("authorization"), l = s.token;
          this.befer = a.request("verifyUserIdentity", {
            type: "POST",
            params: {
              token: l
            },
            data: {
              identity_id: r
            },
            beforeSend: function() {
              t.addClass("disabled");
            },
            complete: function() {
              t.removeClass("disabled");
            }
          }, function(e) {
            n.$(".verify-before").addClass("hide"), "VERIFYING" === e.action ? (n.$(".verify-after").removeClass("hide"), 
            t.text("Done").addClass("success")) : n.$(".xalert-error").removeClass("hide");
          });
        },
        "click .xbtn-cancel": function() {
          var e = this.dialog_from;
          this.hide(), e && (i('[data-dialog-type="' + e + '"]').trigger("click.dialog.data-api"), 
          i("#identity").focusend());
        }
      },
      backdrop: !1,
      viewData: {
        cls: "mblack modal-ve",
        title: "Verification",
        body: '<div class="shadow title">Identity Verification</div><div>Identity to verify:</div><div class="pull-right user-identity"><img class="avatar" src="" alt="" width="40" height="40"><i class="provider icon16-identity-email"></i></div><div class="box identity"></div><p class="verify-before">Confirm sending verification to your mailbox?</p><p class="verify-after hide">Verification sent, it should arrive in minutes. Please check your mailbox and follow the instruction.</p><div class="xalert-error hide"><span class="xalert-fail">Requested too much, hold on awhile.</span><br />Receive no verification email? It might be mistakenly filtered as spam, please check and un-spam. Alternatively, use ‘Manual Verification’.</div>',
        footer: '<button class="pull-right xbtn-blue xbtn-verify">Verify</button><a class="pull-right xbtn-cancel">Cancel</a>'
      },
      onShowBefore: function(e) {
        var t = i(e.currentTarget), r = t.data("identity-id") || t.parents("li").data("identity-id"), a = o.get("user"), s = n.filter(a.identities, function(e) {
          return e.id === r ? !0 : void 0;
        })[0];
        this.$(".xbtn-verify").data("identity_id", s.id), this.$(".identity").text(s.external_id), 
        this.$(".avatar").attr("src", s.avatar_filename);
      }
    }
  }, d.verification_oauth = {
    options: {
      events: {
        "click .xbtn-verify": function(e) {
          var t = i(e.currentTarget), n = this;
          if (t.hasClass("disabled") || t.hasClass("success")) return t.hasClass("success") && this.hide(), 
          void 0;
          var r = t.data("identity_id"), s = o.get("authorization"), l = s.token;
          return this.befer = a.request("verifyUserIdentity", {
            type: "POST",
            params: {
              token: l
            },
            data: {
              identity_id: r
            },
            beforeSend: function() {
              t.addClass("disabled");
            },
            complete: function() {
              t.removeClass("disabled");
            }
          }, function(e) {
            window.location.href = e.url;
          }, function(e) {
            var t = e && e.meta && e.meta.code;
            400 === t && n.hide();
          }), e.preventDefault(), !1;
        },
        "click .xbtn-cancel": function() {
          this.hide();
        }
      },
      backdrop: !1,
      viewData: {
        cls: "mblack modal-ve",
        title: "Verification",
        body: '<div class="shadow title">Identity Verification</div><div>Identity to verify:</div><div class="pull-right user-identity"><img class="avatar" src="" alt="" width="40" height="40"><i class="provider"></i></div><div class="box identity"></div><p class="xalert-twitter hide">You will be directed to Twitter website to authenticate. Don’t forget to follow @<span class="x-sign">EXFE</span> so we could send you invitation PRIVATELY through Direct Message.</p><p>We hate spam, will NEVER disappoint your trust.</p>',
        footer: '<button class="pull-right xbtn-blue xbtn-verify">Verify</button><a class="pull-right xbtn-cancel">Cancel</a>'
      },
      onHideAfter: function() {
        this.befer && (this.befer.abort(), this.befer = null), this.destory();
      },
      onShowBefore: function(e) {
        var t = i(e.currentTarget), r = t.parents("li").data("identity-id"), a = o.get("user"), l = n.find(a.identities, function(e) {
          return e.id === r ? !0 : void 0;
        });
        this.$(".xbtn-verify").data("identity_id", l.id), this.$(".identity").text(s.printExtUserName(l)), 
        this.$(".avatar").attr("src", l.avatar_filename), this.$("i.provider").addClass("icon16-identity-" + l.provider), 
        this.$(".xalert-" + l.provider).removeClass("hide");
      }
    }
  }, d.setpassword = {
    errors: {
      "400": {
        weak_password: "Too short.",
        no_password: " Password incorrect."
      },
      "401": {
        invalid_token: "Invalid Token"
      }
    },
    options: {
      onHideAfter: function() {
        this.befer && this.befer.abort() && (this.befer = null), this.destory();
      },
      events: {
        'click [data-dismiss="dialog"]': function() {
          var e = this.srcNode;
          e && e.data("redirect") && (window.location.href = "/");
        },
        "submit .modal-form": function() {
          return this.$(".xbtn-success").click(), !1;
        },
        "click .password-eye": function(e) {
          var t = i(e.currentTarget);
          t.prev().prop("type", function(e, t) {
            return "password" === t ? "text" : "password";
          }).focus(), t.toggleClass("icon16-pass-hide icon16-pass-show");
        },
        "blur #password": function() {
          var e = this.$("#password").val(), t = this.$('[for="password"]'), i = t.find("span");
          e ? 4 > e.length ? (t.addClass("label-error"), i.text(this.errors["400"].weak_password)) : (t.removeClass("label-error"), 
          i.text("")) : (t.addClass("label-error"), i.text(this.errors["400"].no_password));
        },
        "click .xbtn-success": function(e) {
          var t = this, n = t.$("#password").val(), s = t.srcNode;
          if (!this.$('[for="password"]').hasClass("label-error")) {
            e.preventDefault();
            var l = i(e.currentTarget), c = this._user, d = this._token, u = this.signed;
            if (this._setup) {
              var h = function(e, t, n, s, c, d) {
                var u = a.request("setPassword", {
                  type: "POST",
                  params: {
                    token: t
                  },
                  resources: {
                    user_id: n.id
                  },
                  data: {
                    new_password: s
                  },
                  beforeSend: function() {
                    l.addClass("disabled loading");
                  },
                  complete: function() {
                    l.removeClass("disabled loading");
                  }
                }, function(e) {
                  o.set("authorization", e), r.on("app:user:signin", e.token, e.user_id, !0), c && c.data("dialog", null).data("dialog-type", "changepassword").find("span").text("Change Password..."), 
                  i("#app-user-menu").find(".setup").remove(), d && d.hide();
                }, function(r) {
                  d && d.hide();
                  var a = r.meta;
                  if (403 === a.code) {
                    var l = a.errorType;
                    "invalid_current_password" === l && alert("Invalid current password.");
                  } else if (401 === a.code && "authenticate_timeout" === a.errorType && e) {
                    var c = i('<div data-widget="dialog" data-dialog-type="authentication" data-destory="true" class="hide"></div>');
                    i("#app-tmp").append(c);
                    var u = o.get("authorization");
                    t = u.token, c.trigger("click.dialog.data-api", {
                      callback: function() {
                        h(e, t, n, s);
                      }
                    });
                  }
                });
                d && (d.befer = u);
              };
              h(u, d, c, n, s, t);
            } else {
              var p = function(e, t, n, r, s) {
                var l = a.request("resetPassword", {
                  type: "POST",
                  data: {
                    token: t,
                    name: n.name,
                    password: r
                  }
                }, function(e) {
                  o.set("authorization", e.authorization), s && s.hide(), window.location.href = "/";
                }, function(a) {
                  s && s.hide();
                  var l = a.meta, c = l && l.code, d = l.errorType;
                  if (401 === c && "authenticate_timeout" === d) {
                    var u = i('<div data-widget="dialog" data-dialog-type="authentication" data-destory="true" class="hide"></div>');
                    i("#app-tmp").append(u);
                    var h = o.get("authorization");
                    t = h.token, u.trigger("click.dialog.data-api", {
                      callback: function() {
                        p(e, t, n, r);
                      }
                    });
                  } else 401 === c && "invalid_token" === d && (i(".token-expired").prev().addClass("hide"), 
                  i(".token-expired").removeClass("hide"));
                });
                s && (s.befer = l);
              };
              p(u, d, c, n, t);
            }
          }
        }
      },
      backdrop: !1,
      viewData: {
        cls: "mblack modal-sp",
        title: "Set Password",
        body: '<div class="shadow title">Set Password</div><form class="modal-form"><fieldset><legend>Please set your <span class="x-sign">EXFE</span> password. All identities in your account share the same password for authentication.</legend><div class="clearfix context-user"><div class="pull-left avatar"><img width="40" height="40" alt="" src="" /></div><div class="pull-left username"></div></div><div class="control-group"><div class="controls"><label class="control-label" for="password">Password: <span></span></label><input class="input-large" id="password" placeholder="Set EXFE password" type="password" autocomplete="off" /><i class="help-inline password-eye icon16-pass-hide pointer"></i></div></div></fieldset></form>',
        footer: '<button class="pull-right xbtn-blue xbtn-success">Done</button>'
      },
      onShowBefore: function(e) {
        var t = i(e.currentTarget).data("source"), n = i(e.currentTarget).data("token");
        this.signed = !1, this._setup = !1, t ? (this._user = t.user, this._token = n || t.token, 
        this._setup = t.setup) : (this.signed = !0, this._user = o.get("user"), this._token = n || o.get("authorization").token, 
        this._setup = !this._user.password), this.$(".avatar img").attr("src", this._user.avatar_filename), 
        this.$(".username").text(this._user.name);
      }
    }
  }, d.setup_verification = {
    errors: {
      "400": {
        weak_password: "Too short.",
        no_password: " Password incorrect."
      },
      "401": {
        invalid_token: "Invalid Token"
      }
    },
    options: {
      onHideAfter: function() {
        this.defer && (this.defer.abort(), this.defer = null), this.destory();
      },
      events: {
        "keypress .modal-form": function(e) {
          return 13 === e.keyCode ? (this.$(".xbtn-success").focus().trigger("click"), !1) : void 0;
        },
        'click [data-dismiss="dialog"]': function() {
          var e = this.srcNode;
          e && e.data("redirect") && (window.location.href = "/");
        },
        "blur #name": function(e) {
          var t = s.trim(i(e.currentTarget).val()), n = this.$('[for="name"]'), r = n.find("span");
          t ? s.utf8length(t) > 30 ? (r.text("Too long."), n.addClass("label-error")) : s.zh_CN.test(t) ? (n.addClass("label-error"), 
          r.text("Invalid character.")) : (n.removeClass("label-error"), r.text("")) : (n.addClass("label-error"), 
          r.text(""));
        },
        "blur #password": function(e) {
          var t = i(e.currentTarget).val(), n = this.$('[for="password"]'), r = n.find("span");
          t ? 4 > t.length ? (n.addClass("label-error"), r.text(this.errors["400"].weak_password)) : (n.removeClass("label-error"), 
          r.text("")) : (n.addClass("label-error"), r.text(this.errors["400"].no_password));
        },
        "click #password-eye": function(e) {
          var t = i(e.currentTarget), n = t.prev();
          n.prop("type", function(e, t) {
            return "password" === t ? "text" : "password";
          }), t.toggleClass("icon16-pass-hide icon16-pass-show");
        },
        "click .xbtn-success": function() {
          if (!this.$('[for="name"]').hasClass("label-error") || !this.$('[for="password"]').hasClass("label-error")) {
            var e, t = this, n = t._settings, r = n.originToken, s = "user" === n.tokenType, l = n.page, c = s ? "setup" : "setupUserByInvitationToken", d = {
              name: i.trim(this.$("#name").blur().val()),
              password: this.$("#password").blur().val()
            }, u = {}, h = t.errors;
            s ? (u.token = n.token, d.identity_id = n.browsing.identities[0].id) : d.invitation_token = r, 
            t.defer = a.request(c, {
              type: "POST",
              params: u,
              data: d
            }, function(n) {
              if ("resolve" === l) if (e = o.get("authorization")) {
                i("#app-user-menu").find(".setup").remove();
                var r = i("#app-browsing-identity"), a = r.data("settings");
                a.setup = !1, a.originToken = n.authorization.token, r.data("settings", a).trigger("click.data-api");
              } else o.set("authorization", n.authorization), window.location = "/"; else o.set("authorization", n.authorization), 
              window.location.reload();
              t && t.hide();
            }, function(e) {
              var i = e.meta, n = i && i.code, r = i && i.errorType;
              if (n in h && r in h[n]) {
                var a = t.$('[for="password"]'), s = a.find("span");
                a.addClass("label-error"), s.text(h[n].errorType);
              }
            });
          }
        }
      },
      backdrop: !1,
      viewData: {
        cls: "mblack modal-su",
        title: "Set Up Account",
        body: '<div class="shadow title">Welcome to <span class="x-sign">EXFE</span></div><form class="modal-form"><fieldset><legend>Please set up your <span class="x-sign">EXFE</span> account.</legend><div class="clearfix control-group"><div class="pull-right user-identity"><img class="avatar" src="" alt="" width="40" height="40" /><i class="provider"></i></div><div class="identity box"></div></div><div class="control-group"><label class="control-label" for="name">Name: <span></span></label><div class="controls"><input type="text" class="input-large" id="name" autocomplete="off" placeholder="Set a recognizable name" /></div></div><div class="control-group"><label class="control-label" for="password">Password: <span></span></label><div class="controls"><input type="password" class="input-large" id="password" autocomplete="off" placeholder="Set your EXFE password" /><i class="help-inline icon16-pass-hide pointer" id="password-eye"></i></div></div></fieldset></form>',
        footer: '<button class="pull-right xbtn-blue xbtn-success">Done</button><a class="pull-right xbtn-discard" data-dismiss="dialog">Cancel</a>'
      },
      onShowBefore: function(e) {
        var t = i(e.currentTarget).data("source");
        if (t) {
          this._settings = t;
          var n = t.browsing.identities[0], r = t.forward;
          !r && (t.forward = "/"), this.$("#name").val(n.name), this.$(".identity").text(s.printExtUserName(n)), 
          this.$(".avatar").attr("src", n.avatar_filename).next().addClass("icon16-identity-" + n.provider), 
          this.$(".xbtn-siea").data("source", s.printExtUserName(n));
        }
      }
    }
  }, d.setup_authenticate = {
    options: {
      onHideAfter: function() {
        this._oauth_ && (this._oauth_.abort(), this._oauth_ = null), this.destory();
      },
      events: {
        "click .xbtn-blue": function() {
          var e = this._settings.browsing.identities[0].provider;
          this._oauth_ = i.ajax({
            url: "/OAuth/Authenticate?provider=" + e,
            type: "POST",
            dataType: "JSON",
            success: function(e) {
              var t = e.meta.code;
              200 === t && (window.location.href = e.response.redirect);
            }
          });
        }
      },
      backdrop: !1,
      viewData: {
        cls: "mblack modal-su",
        title: "Set Up Account",
        body: '<div class="shadow title">Welcome to <span class="x-sign">EXFE</span></div><form class="modal-form"><fieldset><legend>Please authenticate following identity to continue.</legend><div class="clearfix control-group"><div class="pull-right user-identity"><img class="avatar" src="" alt="" width="40" height="40" /><i class="provider"></i></div><div class="box identity"></div></div></fieldset></form>',
        footer: '<button class="pull-right xbtn-blue">Authenticate</button><a class="pull-right xbtn-discard" data-dismiss="dialog">Cancel</a>'
      },
      onShowBefore: function(e) {
        var t = i(e.currentTarget).data("source");
        if (t) {
          this._settings = t;
          var n = t.browsing.identities[0], r = t.forward;
          !r && (t.forward = "/"), this.$(".identity").text(s.printExtUserName(n)), this.$(".avatar").attr("src", n.avatar_filename).next().addClass("icon16-identity-" + n.provider), 
          this.$(".xbtn-siea").data("source", s.printExtUserName(n));
        }
      }
    }
  }, d.browsing_identity = {
    options: {
      onHideAfter: function() {
        this.destory();
      },
      events: {
        "click .xbtn-dnm": function() {
          var e = this._settings.action;
          "SETUP" === e ? (i('[data-user-action="' + e + '"]').trigger("click"), this.hide()) : window.location = "/";
        },
        "click .xbtn-merge": function() {
          var e = this, t = e._settings.token, r = e._settings.invitation_token, s = this.provider, l = {
            invitation_token: r
          };
          "email" !== s && "phone" !== s && (l.refere = window.location.href), a.request("mergeIdentities", {
            type: "POST",
            params: {
              token: t
            },
            data: l,
            beforeSend: function() {
              i(".modal-footer").find("button").prop("disabled", !0);
            }
          }, function(t) {
            if (e.hide(), t.mergeable_user = null, t.mergeable_user) {
              var r = i('<div id="js-dialog-merge" data-destory="true" data-widget="dialog" data-dialog-type="mergeidentity">'), a = o.get("user");
              r.data("source", {
                merged_identity: n.find(a.identities, function(e) {
                  return e.id === identity.id ? !0 : void 0;
                }),
                browsing_token: browsing_token,
                mergeable_user: t.mergeable_user
              }), r.appendTo(i("#app-tmp")), r.trigger("click.dialog.data-api"), i(".modal-mi").css("top", 230);
            } else window.location.reload();
          }, function() {});
        }
      },
      backdrop: !1,
      viewData: {
        cls: "mblack modal-bi",
        title: "Browsing Identity",
        body: '<div class="shadow title">Merge Identity?</div><div class="user"><div class="merge-info">You’re browsing this page as <span class="buser-name"></span> <span class="oblique identity"></span>, we recommend you to merge this identity into current account <span class="user-name"></span>. Do <span class="not">NOT</span> merge if it’s not you!</div></div><div class="context-identity"><div class="pull-right avatar"><img width="40" height="40" alt="" src="" /><i class="provider"></i></div><div class="clearfix"><div class="pull-left box identity"></div></div></div><div class="clearfix context-user"><div class="pull-left avatar"><img width="40" height="40" alt="" src="" /></div><div class="pull-left username"></div></div>',
        footer: '<button class="pull-right xbtn-blue xbtn-merge">Merge and Go</button><button class="pull-right xbtn-white xbtn-dnm">Do NOT Merge</button>'
      },
      onShowBefore: function(e) {
        var t = i(e.currentTarget).data("settings");
        if (t) {
          this._settings = t;
          var n, r, a, o = t.normal, l = t.browsing, c = l.identities, d = c[0], u = s.printExtUserName(d), h = this.provider = d.provider;
          n = this.$(".merge-info"), n.find(".buser-name").text(l.name), n.find(".identity").text(u), 
          n.find(".user-name").text(o.name), r = this.$(".context-identity"), r.find(".avatar img").attr("src", d.avatar_filename).next().addClass("icon16-identity-" + h), 
          r.find(".identity").text(u), a = this.$(".context-user"), a.find(".avatar img").attr("src", o.avatar_filename), 
          a.find(".username").text(o.name);
        }
      }
    }
  }, d.read_only = {
    options: {
      onHideAfter: function() {
        this.destory();
      },
      backdrop: !1,
      viewData: {
        cls: "mblack modal-ro",
        title: "Read-only Browsing",
        body: '<div class="shadow title">Authentication</div><div>You’re browsing this page in read-only mode as identity underneath. To change anything on this page, please authenticate first.</div><div class="clearfix context-user hide"><div class="pull-left avatar"><img src="" alt="" width="40" height="40" /></div><div class="pull-left username"></div></div><div class="context-identity hide"><div class="pull-right avatar"><img src="" alt="" width="40" height="40" /><i class="provider"></i></div><div class="pull-left box identity"></div></div>',
        footer: '<button class="pull-right xbtn-blue" data-widget="dialog" data-dialog-type="identification" data-dialog-tab="d00">Authenticate</button><a class="pull-right xbtn-discard" data-dismiss="dialog">Cancel</a>'
      },
      onShowBefore: function(e) {
        var t = i(e.currentTarget).data("settings");
        if (t) {
          var n = t.isBrowsing, r = s.printExtUserName(t.identities[0]);
          if (this.$("legend span").eq(0).text(n ? "identity" : "user"), this.$(".xbtn-blue").data("source", r), 
          n) {
            var a = this.$(".context-identity").removeClass("hide");
            a.find(".identity").text(r), a.find(".avatar img").attr("src", t.identities[0].avatar_filename), 
            a.find(".provider").addClass("icon16-identity-" + t.identities[0].provider);
          } else {
            var o = this.$(".context-user").removeClass("hide");
            o.find(".username").text(t.name), o.find(".avatar img").attr("src", t.avatar_filename);
          }
        }
      }
    }
  }, d.revoked = {
    options: {
      onHideAfter: function() {
        this.destory();
      },
      backdrop: !1,
      viewData: {
        cls: "mblack modal-re",
        title: "Revoked Identity",
        body: '<div class="shadow title">Revoked Identity</div>'
      }
    }
  }, d.authentication = {
    updateIdentity: function(e) {
      var t = this.$(".context-identity");
      t.find(".avatar img").attr("src", e.avatar_filename), t.find(".provider").attr("class", "provider icon16-identity-" + e.provider), 
      t.find(".identity").text(e.eun), this._identity = e;
    },
    options: {
      viewData: {
        cls: "mblack modal-au",
        title: "Authentication",
        body: '<div class="shadow title">Authorization</div><div class="d0 hide"><div class="detials">You’re about to change your account details, for security concerns, please authenticate your account.</div><div class="clearfix context-user"><div class="pull-left avatar"><img src="" alt="" width="40" height="40" /></div><div class="pull-left username"></div></div><div class="modal-form"><div class="control-group"><label class="control-label" for="password">Password: <span></span></label><div class="controls"><input type="password" class="input-large" id="password" autocomplete="off" placeholder="Your EXFE password" /><i class="help-inline icon16-pass-hide pointer" id="password-eye"></i></div></div></div></div><div class="d1 hide"><div class="detials">You’re about to change your account details. For security concern, please re-authenticate your identity and set your <span class="x-sign">EXFE</span> password first.</div><div class="context-identity"><div class="pull-right avatar"><img src="" alt="" width="40" height="40" /><i class="provider"></i></div><div class="clearfix dropdown-toggle" data-toggle="dropdown"><div class="pull-left box identity"></div><ul class="dropdown-menu"></ul><div class="pull-left caret-outer hide"><b class="caret"></b></div></div></div><div class="why">Why I have to do this?</div><div class="answer">Sorry for the inconvenience. Sometimes, we have to compromise on experience for your account security. Re-authentication is to avoid modification by others who can possibly access your computer.</div></div>',
        footer: '<button class="pull-left xbtn xbtn-white xbtn-forgotpwd d0 hide" data-dialog-from="authentication" data-widget="dialog" data-dialog-type="forgotpassword">Forgot Password...</button><button class="pull-right xbtn xbtn-blue xbtn-auth d1 hide">Authenticate</button><button class="pull-right xbtn xbtn-blue xbtn-done d0 hide">Done</button><a class="pull-right xbtn-discard d0 hide" data-dismiss="dialog">Cancel</a>'
      },
      events: {
        "click .xbtn-done": function() {
          var e = this, t = o.get("user"), i = t.identities[0], n = i.external_username, r = i.provider, l = s.trim(e.$("#password").val());
          a.request("signin", {
            type: "POST",
            data: {
              external_username: n,
              provider: r,
              password: l,
              name: "",
              auto_signin: !0
            }
          }, function(t) {
            o.set("authorization", t);
            var i = e.callback;
            e.destory(), i();
          });
        },
        "click .xbtn-auth": function(e) {
          var t = this, n = i(e.currentTarget);
          if (n.hasClass("xbtn-success")) return t.$(".verify-after").addClass("hide"), n.removeClass("xbtn-success").text("Verify"), 
          t.hide(), !1;
          var r = t._identity.provider, s = t._identity.external_username;
          t.befer = a.request("verifyIdentity", {
            type: "POST",
            data: {
              provider: r,
              external_username: s
            }
          }, function(e) {
            "REDIRECT" === e.action && (window.location.href = e.url);
          });
        },
        "click .caret-outer": function(e) {
          this.$(".dropdown-toggle").addClass("open"), e.stopPropagation();
        },
        "hover .dropdown-menu > li": function(e) {
          var t = e.type, n = i(e.currentTarget);
          n[("mouseenter" === t ? "add" : "remove") + "Class"]("active");
        },
        "click .dropdown-menu > li": function(e) {
          var t = this.$(".dropdown-menu").data("identities"), n = i(e.currentTarget).data("index");
          this.updateIdentity(t[n]);
        }
      },
      onHideAfter: function() {
        this.befer && (this.befer.abort(), this.befer = null), this.destory();
      },
      onShowBefore: function(e) {
        var t = this, i = o.get("user"), n = i.password;
        if (t.$(".d" + (n ? 0 : 1)).removeClass("hide"), e && e._data && (t.callback = e._data.callback), 
        t.callback && (t.callback = function() {}), n) t.$(".modal-body .d0").find(".avatar img").attr("src", i.avatar_filename).parent().next().text(i.name), 
        t.$(".xbtn-forgotpwd").data("source", i.identities); else {
          var r, a, l = i.identities;
          if (l && (r = l.length)) {
            if (a = l[0], a.eun = s.printExtUserName(a), r > 1) {
              t.$(".context-identity").addClass("switcher");
              for (var c = "", d = 0; r > d; d++) c += '<li data-index="' + d + '"><i class="pull-right icon16-identity-' + l[d].provider + '"></i>', 
              l[d].eun = s.printExtUserName(l[d]), c += "<span>" + l[d].eun + "</span>", c += "</li>";
              t.$(".dropdown-menu").html(c).data("identities", l);
            }
            t.updateIdentity(a);
          }
        }
      }
    }
  }, d.unsubscribe = {
    options: {
      onHideAfter: function() {
        this.destory();
      },
      events: {
        "click .xbtn-done": function(e) {
          e.preventDefault(), this.hide();
        }
      },
      backdrop: !1,
      viewData: {
        cls: "mblack modal-unsubscribe",
        title: "Unsubscribe Email",
        body: '<div class="shadow title">Unsubscribe update email</div><p>You just unsubscribe update email of <span class="x">·X·</span> “<span class="x-title"></span>”.</p>',
        footer: '<button class="pull-right xbtn-white xbtn-done">Done</button>'
      },
      onShowBefore: function(e) {
        var t = i(e.currentTarget).data("source");
        this.$(".x-title").text(t.title);
      }
    }
  };
  var h = c.extend({
    availability: !1,
    init: function() {
      var e = this;
      r.off("widget-dialog-identification-auto"), r.on("widget-dialog-identification-auto", function(t) {
        var i = e.$('[for="identity"]'), n = i.find("span"), r = e.$('[for="password"]'), a = r.find("span");
        e.availability = !1, e.identityFlag = null;
        var s;
        "d24" === e.switchTabType && (s = "d01"), e.$(".xalert-error").addClass("hide"), 
        e.$(".help-subject").removeClass("icon14-question").addClass("icon14-clear"), t ? (i.removeClass("label-error"), 
        n.text(""), t.identity && t.identity.avatar_filename ? (e._identity = t.identity, 
        e.$(".user-identity").removeClass("hide").find("img").attr("src", t.identity.avatar_filename).next().attr("class", "provider icon16-identity-" + t.identity.provider)) : (e._identity = null, 
        e.$(".user-identity").addClass("hide")), "phone" === t.identity.provider && e.$(".phone-tip").toggleClass("hide", /\+/.test(e.$("#identity").val())), 
        e.identityFlag = t.registration_flag, "SIGN_IN" === t.registration_flag ? (s = "d01", 
        e.$(".xbtn-forgotpwd").removeClass("hide"), r.removeClass("label-error"), a.text("")) : "SIGN_UP" === t.registration_flag ? (s = "d02", 
        r.removeClass("label-error"), a.text("")) : "AUTHENTICATE" === t.registration_flag ? (s = "d00", 
        e.$(".help-subject").removeClass("icon14-question").addClass("icon14-clear"), e.$(".authenticate").removeClass("hide")) : "VERIFY" === t.registration_flag && (s = "d04"), 
        e.availability = !0) : (e.$(".phone-tip").addClass("hide"), e.$(".help-subject").removeClass("icon14-clear").addClass("icon14-question")), 
        s && e.switchTabType !== s && e.switchTab(s), e.$(".x-signin")[(e.availability ? "remove" : "add") + "Class"]("disabled"), 
        e.$(".xbtn-forgotpwd").data("source", t ? [ t.identity ] : t);
      }), r.off("widget-dialog-identification-nothing"), r.on("widget-dialog-identification-nothing", function() {
        e.$(".authenticate").addClass("hide"), e.$(".user-identity").addClass("hide"), e.$('[for="identity"]').removeClass("label-error").find("span").text(""), 
        e.$(".xbtn-forgotpwd").addClass("hide").data("source", null), e.availability = !1, 
        e.$(".x-signin")[(e.availability ? "remove" : "add") + "Class"]("disabled");
      });
    },
    resetInputs: function() {
      this.$("input").val(""), this.$(".label-error").removeClass("label-error").find("span").text(""), 
      this.$(".icon16-pass-show").toggleClass("icon16-pass-show icon16-pass-hide").prev().prop("type", "password"), 
      this.$("#identity").focusend();
    },
    setPasswordPlaceHolder: function(e) {
      "d02" === e ? this.$("#password").attr("placeholder", "Set your EXFE Password") : "d01" === e && this.$("#password").attr("placeholder", "Your EXFE Password");
    },
    getFormData: function(e) {
      var t = s.trim(this.$("#identity").val()), i = s.parseId(t);
      return ("d01" === e || "d02" === e) && (i.password = this.$("#password").val()), 
      "d01" === e && (i.auto_signin = this.$("#auto-signin").prop("checked")), "d02" === e && (i.name = s.trim(this.$("#name").val())), 
      i;
    },
    switchTab: function(e) {
      if (this.$(".d").not(".hide").addClass("hide").end().filter("." + e).removeClass("hide"), 
      this.$(".x-signin")[(this.availability ? "remove" : "add") + "Class"]("disabled"), 
      this.switchTabType = e, this.isShown && ("d00" === this.switchTabType || "d01" === this.switchTabType || "d02" === this.switchTabType)) {
        var t = this.$("#identity");
        t.focusend();
      }
      this.setPasswordPlaceHolder(e);
    }
  });
  t.Identification = h;
}), define("datepanel", function(e) {
  "use strict";
  var t = e("jquery"), i = t.browser.msie, n = e("humantime"), r = n.locales[n.locale], a = r.months, s = r.monthsShort, o = n.createEFTime, l = n.toLocaleDate, c = n.lead0, d = e("util"), u = d.trim, h = e("api"), p = e("rex"), f = e("panel").extend({
    options: {
      template: '<div class="panel date-panel" tabindex="-1" data-widget="panel" id="date-panel" editarea="date-panel"><div class="panel-body"><div class="pull-left date-container"><div class="date-input"><input type="text" name="date-string" id="date-string" autocomplete="off" /><i class="pointer icon-enter-blue place-submit"></i></div><div class="date-calendar" tabindex="-1"><ul class="unstyled clearfix" id="date-head"><li>Sun</li><li>Mon</li><li>Tue</li><li>Wed</li><li>Thu</li><li>Fri</li><li>Sat</li></ul><div class="year"></div><div class="full-month"></div><div class="table-wrapper"><table class="table" id="date-table"><tbody></tbody></table></div></div></div><div class="pull-right date-timeline hide"> <div class="fuzzy-time hide">   <ul class="unstyled time-cates">     <li data-cate="all-day">All-day</li>     <li class="hide" data-time="00:01" data-cate="late-night">Late-night</li>     <li class="hide" data-time="05:00" data-cate="dawn">Dawn</li>     <li class="hide" data-time="07:00" data-cate="breakfast">Breakfast</li>     <li class="hide" data-time="08:30" data-cate="morning">Morning</li>     <li class="hide" data-time="10:00" data-cate="brunch">Brunch</li>     <li class="hide" data-time="11:30" data-cate="lunch">Lunch</li>     <li class="hide" data-time="13:00" data-cate="noon">Noon</li>     <li class="hide" data-time="14:30" data-cate="afternoon">Afternoon</li>     <li class="hide" data-time="16:00" data-cate="tea-break">Tea-break</li>     <li class="hide" data-time="17:30" data-cate="off-work">Off-work</li>     <li class="hide" data-time="19:00" data-cate="dinner">Dinner</li>     <li class="hide" data-time="20:30" data-cate="evening">Evening</li>     <li class="hide" data-time="22:00" data-cate="night">Night</li>     <li class="hide" data-time="24:00" data-cate="late-night">Late-night</li>   </ul> </div> <div class="times-wrapper">   <div class="times"></div> </div></div></div></div>',
      parentNode: null,
      srcNode: null,
      eftime: null
    },
    init: function() {
      var e = this.options;
      this.render(), this.originEftime = e.eftime, this.eftime = Cross.time, this.dateObj = l(this.eftime), 
      delete e.eftime, this.timezone = x(), this.dateInput = new m(this, "#date-string"), 
      this.calendarTable = new g(this, ".date-calendar"), this.timeline = new v(this, ".date-timeline"), 
      this.listen();
    },
    _x: 0,
    initComponents: function() {
      var e = this.eftime, t = this.dateObj.date;
      this.calendarTable.refresh(t), 0 === this.originEftime.outputformat && (this.calendarTable.addCursorStyle(), 
      this.calendarTable.select()), this.timeline.refresh(this.eftime), this.timeline.select(this.eftime), 
      this.dateInput.change(e.origin || t.text), this.dateInput.$element.focusend(), this.eftime.begin_at.time && (this._x = 124, 
      this.element.css("left", "-=" + this._x), this.showTL());
    },
    listen: function() {
      this.element.on("click.datepanel", ".place-submit", y(this.submitSave, this)), this.element.on("keydown.datepanel", y(this.keydown, this)), 
      this.on("save", this.save), this.on("tmt-ct", this.tmtCT), this.on("tmt-di", this.tmtDI), 
      this.on("rf-di", this.rfDI), this.on("rf-tl", this.rfTL), this.on("rf-ct", this.rfCT), 
      this.on("show-tl", this.showTL);
    },
    submitSave: function() {
      this.save();
    },
    save: function(e) {
      e && (this.eftime.origin = e), t("body").trigger("save-cross");
    },
    revert: function() {
      t.extend(!0, this.eftime, this.originEftime);
    },
    tmtCT: function() {
      var e = this.calendarTable.$element;
      setTimeout(function() {
        e.focus();
      }, 0);
    },
    tmtDI: function() {
      var e = this.dateInput.$element;
      setTimeout(function() {
        e.focus();
      }, 0);
    },
    rfDI: function(e) {
      t.extend(!0, this.eftime, e), this.dateObj = l(e), this.calendarTable.refresh(this.dateObj.date), 
      0 === this.eftime.outputformat && (this.calendarTable.addCursorStyle(), this.calendarTable.select(!0)), 
      this.timeline.select(e);
    },
    rfTL: function(e, t) {
      var i, n = this.eftime, r = this.dateObj.date, a = "";
      n.begin_at.time = "", e && (i = e.split(":"), r.setHours(i[0] || 0), r.setMinutes(i[1] || 0), 
      r.setSeconds(i[2] || 0), n.begin_at.time = c(r.getUTCHours()) + ":" + c(r.getMinutes()) + ":" + c(r.getSeconds())), 
      n.begin_at.time_word = t, a = e || t, n.outputformat ? (n.outputformat = 0, n.origin = a) : (n.begin_at.date && (a = _(r) + " " + a), 
      n.origin = a), this.dateInput.change(n.origin);
    },
    rfCT: function(e) {
      var t = this.eftime, i = this.dateObj.date, n = "", r = e.split("-");
      if (i.setFullYear(r[0]), i.setMonth(r[1] - 1), i.setDate(r[2]), n = i.getUTCFullYear() + "-" + c(i.getUTCMonth() + 1) + "-" + c(i.getUTCDate()), 
      t.begin_at.date = n, t.outputformat) t.outputformat = 0, t.origin = e; else {
        var a = "";
        t.begin_at.time ? a = c(i.getHours()) + ":" + c(i.getMinutes()) : (a = t.begin_at.time_word, 
        t.begin_at.date = e), a = a ? e + " " + a : e, t.origin = a;
      }
      this.dateInput.change(t.origin);
    },
    showTL: function() {
      this.timeline.show(this.eftime), this._x || (this._x = 124, this.element.css({
        "-webkit-transform": "translate3d(-" + this._x + "px, 0, 0)"
      }));
    },
    keydown: function(e) {
      var t = this, i = e.altKey, n = e.ctrlKey, r = e.shiftKey, a = e.metaKey, s = e.keyCode;
      27 === s ? (t.revert(), t.emit("save")) : 13 === s && !(i | r) & (n | a) && t.emit && t.emit("save");
    },
    showAfter: function() {
      var e = this.srcNode;
      if (e) {
        var t = e.offset(), i = this.element, n = i.outerWidth();
        i.css({
          left: t.left - n - 15,
          top: t.top
        });
      }
      this.initComponents();
    },
    destory: function() {
      this.element.off(), this.element.remove(), this._destory();
    }
  }), m = function(e, t) {
    this.component = e, this.$container = e.element, this.tz = e.timezone, this.selector = t, 
    this.$element = e.$(t), this.listen();
  };
  m.prototype = {
    listen: function() {
      var e = this.$container, t = this.selector;
      e.on("keydown.datepanel", t, y(this.keydown, this)).on("keypress.datepanel", t, y(this.keypress, this)).on("keyup.datepanel", t, y(this.keyup, this));
    },
    keyHandler: function(e) {
      var t = this.component, i = e.keyCode;
      switch (i) {
       case 9:
        e.preventDefault(), t.emit("tmt-ct");
        break;

       case 13:
        e.preventDefault(), t.emit("save", u(this.$element.val()));
        break;

       case 40:
        var n = this.$element.val(), r = n.length, a = this.$element[0], s = w(a);
        r === s && (e.preventDefault(), t.emit("tmt-ct"));
      }
    },
    keydown: function(e) {
      this.suppressKeyPressRepeat = !!~p.indexOf([ 9, 13, 40 ], e.keyCode), this.keyHandler(e);
    },
    keypress: function(e) {
      this.suppressKeyPressRepeat || this.keyHandler(e);
    },
    keyup: function(e) {
      switch (e.stopPropagation(), e.preventDefault(), e.keyCode) {
       case 9:
       case 13:
       case 16:
       case 17:
       case 18:
       case 27:
       case 37:
       case 38:
       case 39:
       case 40:
        break;

       default:
        this.lookup();
      }
    },
    lookup: function() {
      var e = this, t = e.component, i = u(e.$element.val());
      return e.befer && (e.befer.abort(), e.befer = void 0), "" === i ? (t.emit("rf-di", o()), 
      void 0) : (e.befer = h.request("recognize", {
        type: "POST",
        data: {
          time_string: i,
          timezone: e.tz
        }
      }, function(e) {
        t && t.emit("rf-di", e.cross_time);
      }), void 0);
    },
    change: function(e) {
      this.$element.val(e);
    }
  };
  var g = function(e, t) {
    this.component = e, this.$container = e.element, this.selector = t, this.$element = e.$(t), 
    this.today = new Date(), this.todayString = _(this.today), this.cx = 0, this.cy = 0, 
    this.vpr = 3, this.vph = 44, this.len = 0, this.divTmp = '<div class="tw"><span class="m hide">{{m}}</span><span class="d">{{d}}</span></div>', 
    this.$y = this.$element.find(".year"), this.$m = this.$element.find(".full-month"), 
    this.$tw = this.$element.find(".table-wrapper"), this.$tb = this.$tw.find("tbody"), 
    this.inited = !0, this.enable = !1, this.listen();
  };
  g.prototype = {
    init: function(e) {
      var t = this.vpr, i = this.vph, n = e.getFullYear(), r = e.getMonth(), a = e.getDate(), s = e.getDay();
      e = new Date(n, r, a - s - 21), this.startDate = _(e), this.genNext(e), this.genNext(e), 
      this.genNext(e), this.endDate = _(e), this.cx = s, this.cy = t, this.scrollTop(t * i), 
      this.$trs = this.$tb.find("tr"), this.inited && (this.st = this.$tw.prop("scrollHeight") - this.$tw.outerHeight(), 
      this.inited = !1);
    },
    refresh: function(e) {
      this.$trs = this.$cursor = null, this.len = 0, this.$tb.empty(), this.init(e);
    },
    getSelectedDate: function() {
      return this.selectedDate || this.todayString;
    },
    listen: function() {
      var e = this.$container, t = this.selector;
      e.on("blur.datepanel", t, y(this.blur, this)).on("focus.datepanel", t, y(this.focus, this)).on("keydown.datepanel", t, y(this.keydown, this)).on("keypress.datepanel", t, y(this.keypress, this)).on("keyup.datepanel", t, y(this.keyup, this)).on("click.datepanel", t + " td", y(this.clickDate, this)).on("mouseenter.datepanel", t + " td", y(this.mouseenterDate, this)), 
      this.$tw.on("scroll.datepanel", y(this.scroll, this));
    },
    scroll: function(e) {
      this.enable, e.stopPropagation(), e.preventDefault();
      var t = this.$tw, i = t.scrollTop(), n = !1, r = this.$y, a = this.$m;
      (0 === i || this.st === i) && (this.enable = !0, this[0 === i ? "mpageUp" : "mpageDown"](), 
      this.$tw.scrollTop(this.vph * this.vpr), n = !0), this.updateYearMonth(), r.toggleClass("hide", n), 
      a.toggleClass("hide", n);
    },
    updateYearMonth: function() {
      if (this.$cursor) {
        var e = b(this.$cursor.data("date"));
        this.$y.text(e.getFullYear()), this.$m.text(a[e.getMonth()]);
      }
    },
    delCursorStyle: function() {
      this.$cursor && this.$cursor.removeClass("hover");
    },
    addCursorStyle: function() {
      this.$cursor = this.$trs.eq(this.cy).find("td").eq(this.cx).addClass("hover");
    },
    blur: function() {
      this.delCursorStyle();
    },
    focus: function() {
      this.addCursorStyle();
    },
    scrollTop: function(e) {
      this.$tw.scrollTop(e);
    },
    keyHandler: function(e) {
      var t = this, i = this.component, n = e.keyCode;
      switch (n) {
       case 9:
        e.preventDefault(), i.emit("tmt-di");
        break;

       case 37:
        e.preventDefault(), t.move("left");
        break;

       case 38:
        e.preventDefault(), t.move("top");
        break;

       case 39:
        e.preventDefault(), t.move("right");
        break;

       case 40:
        e.preventDefault(), t.move("down");
        break;

       case 33:
        e.preventDefault(), t.move("pageUp");
        break;

       case 34:
        e.preventDefault(), t.move("pageDown");
        break;

       case 13:
        e.preventDefault();
        break;

       case 32:
        e.preventDefault(), t.spacing();
        break;

       case 68:
        e.preventDefault(), t.refresh(b(t.getSelectedDate()));
        break;

       case 84:
        e.preventDefault(), t.refresh(t.today);
        break;

       case 35:
       case 36:      }
    },
    keydown: function(e) {
      this.suppressKeyPressRepeat = !!~p.indexOf([ 9, 13, 32, 33, 34, 35, 36, 37, 38, 39, 40, 68, 84 ], e.keyCode), 
      this.keyHandler(e);
    },
    keypress: function(e) {
      return this.suppressKeyPressRepeat ? !1 : (this.keyHandler(e), void 0);
    },
    keyup: function(e) {
      e.stopPropagation(), e.preventDefault();
    },
    clickDate: function(e) {
      e.preventDefault(), this.spacing(), this.component.emit("show-tl");
    },
    spacing: function() {
      this.selectedDate && this.$tb.find('td[data-date="' + this.selectedDate + '"]').removeClass("selected"), 
      this.select();
    },
    select: function(e) {
      this.selectedDate && this.$trs.find("td.selected").removeClass("selected");
      var t = this.selectedDate = this.$cursor.data("date");
      this.$cursor.addClass("selected"), this.updateYearMonth(), e || this.component.emit("rf-ct", t);
    },
    mouseenterDate: function(e) {
      e.preventDefault(), this.delCursorStyle();
      var i = t(e.currentTarget), n = i.parent();
      this.cx = i.index(), this.cy = n.index(), this.addCursorStyle();
    },
    move: function(e) {
      this.enable = !0, this.delCursorStyle(), this["m" + e](), this.addCursorStyle(), 
      this.enable = !1;
    },
    mleft: function() {
      0 === this.cx-- && (this.cx = 6, this.mtop());
    },
    mtop: function() {
      if (0 === this.cy--) {
        this.delTail3();
        var e = b(this.startDate, -21);
        this.startDate = _(e), this.genPrev(e), this.$trs = this.$tb.find("tr"), this.cy = 2, 
        this.$tw.scrollTop(this.vph * this.cy);
      }
      var t = this.$tw.scrollTop();
      t = Math.round(t / this.vph) * this.vph, t > this.cy * this.vph && this.$tw.scrollTop(t -= this.vph);
    },
    mright: function() {
      6 === this.cx++ && (this.cx = 0, this.mdown());
    },
    mdown: function() {
      if (this.len === ++this.cy) {
        this.delHead3();
        var e = b(this.endDate, 0);
        this.genNext(e), this.endDate = _(e), this.$trs = this.$tb.find("tr"), this.cy = 7, 
        this.$tw.scrollTop(5 * this.vph);
      }
      var t = this.$tw.scrollTop();
      t = Math.round(t / this.vph) * this.vph, this.cy * this.vph > t + this.vph * (this.vpr - 1) && this.$tw.scrollTop(t += this.vph);
    },
    mpageUp: function() {
      this.delTail3();
      var e = b(this.startDate, -21);
      this.startDate = _(e), this.genPrev(e), this.$trs = this.$tb.find("tr");
    },
    mpageDown: function() {
      this.delHead3();
      var e = b(this.endDate, 0);
      this.genNext(e), this.$trs = this.$tb.find("tr"), this.endDate = _(e);
    },
    generateHTML: function(e) {
      var t, i = this.vpr, n = this.todayString, r = this.selectedDate, a = this.divTmp, o = "", l = 0;
      for (this.len += i; i > l; ++l) {
        for (var c, d, u, h, p = 0, f = "<tr>", m = ""; 7 > p; ++p) h = "", c = _(e), d = c === n, 
        u = c === r, d && (h = "today"), u && (h += (h.length ? " " : "") + "selected"), 
        m += '<td data-date="' + c + '"' + (h.length ? ' class="' + h + '"' : "") + ">", 
        t = e.getDate(), m += a.replace("{{m}}", s[e.getMonth()]).replace("{{d}}", d ? "Today" : t), 
        m += "</td>", e.setDate(t + 1);
        f += m + "</tr>", o += f;
      }
      return o;
    },
    genPrev: function(e) {
      this.$tb.prepend(this.generateHTML(e));
    },
    genNext: function(e) {
      this.$tb.append(this.generateHTML(e));
    },
    delHead3: function() {
      this.startDate = this.$trs.eq(0).find("td").eq(0).data("date"), this.$trs.eq(0).remove(), 
      this.$trs.eq(1).remove(), this.$trs.eq(2).remove(), this.len -= 3;
    },
    delTail3: function() {
      this.endDate = this.$trs.eq(this.len - 3).find("td").eq(0).data("date"), this.$trs.eq(--this.len).remove(), 
      this.$trs.eq(--this.len).remove(), this.$trs.eq(--this.len).remove();
    }
  };
  var v = function(e, i) {
    this.component = e, this.$container = e.element, this.selector = i, this.$element = e.$(i), 
    this.divTmp = '<div class="time-item{{class}}" data-time="{{dt}}"><time>{{t}}</time></div>', 
    this.$tw = this.$element.find(".times-wrapper"), this.$tc = this.$element.find(".times"), 
    this.$ft = this.$element.find(".fuzzy-time"), this.$ts = this.$ft.find(".time-cates > li[data-time]"), 
    this.ts = p.map(this.$ts, function(e) {
      return t(e).data("time");
    }), this.x = 0, this.y = 0, this.px = 0, this.py = 0, this.l = 9, this.hh = 7, this.th = 7, 
    this.dh = 0, this.dm = 0, this.status = !1, this.isHide = !0, this.listen();
  };
  v.prototype = {
    show: function(e) {
      this.$element.removeClass("hide"), this.select(e);
    },
    select: function(e) {
      if (this.enable = !0, this.removeSelected(), e && 0 === e.outputformat && e.begin_at.time) {
        var t, i = l(e).date, n = i.getHours(), r = i.getMinutes(), a = 15 * Math.round(n / 15);
        i.setMinutes(a), this.selectedTime = c(n) + ":" + c(r), this.$selected = this.$tc.find('[data-time="' + this.selectedTime + '"]').eq(0), 
        0 === this.$selected.length && (this.$selected = this.createNormalItem(n, r, Math.floor(4 * (n + r / 60) * this.h))), 
        this.$selected.removeClass("time-hover"), this.$selected.addClass("selected"), t = parseInt(this.$selected.css("top"), 10), 
        this.$tw.scrollTop(Math.max(0, t - this.vph / 2));
      } else this.$tw.scrollTop(180);
      this.enable = !1;
    },
    refresh: function(e) {
      this.generateHTML();
      var t = this.$element.clone().attr("id", "__tmp__").css({
        visibility: "hidden",
        display: "block",
        position: "absolute"
      });
      this.$element.parent().append(t), this.rh = t.find(".times-wrapper").prop("scrollHeight"), 
      this.h = Math.floor((this.rh - this.hh - this.th) / (this.l - 1) / 12), this.a = Math.round(15 / this.h);
      var i = t.offset();
      this.ox = i.left, this.oy = i.top, this.st = t.scrollTop(), this.vph = t.innerHeight(), 
      t.remove(), this.select(e);
    },
    listen: function() {
      var e = this.$container, t = this.selector;
      e.on("mouseleave.datepanel", t, y(this.mouseleave, this)).on("mouseenter.datepanel", t + " .times-wrapper", y(this.meTW, this)).on("mousemove.datepanel", t + " .times-wrapper", y(this.mousemove, this)).on("mouseleave.datepanel", t + " .times-wrapper", y(this.mlTW, this)).on("click.datepanel", t + " .times-wrapper", y(this.clickTW, this)).on("click.datepanel", t + " .time-cates li[data-cate]", y(this.clickCT, this)), 
      this.$tw.on("scroll.datepanel", y(this.scrollTop, this));
    },
    scrollTop: function(e) {
      this.isHide && (this.$cursor.removeClass("hide"), this.isHide = !1), this.enable || (e.pageX = this.px, 
      e.pageY = this.py, this.st = this.$tw.scrollTop(), this.mousemove(e));
    },
    removeSelected: function() {
      this.$selected && (this.selectedTime = "", this.$selected.removeClass("selected"), 
      delete this.$selected);
    },
    mouseleave: function(e) {
      e.stopPropagation(), e.preventDefault(), this.$ft.addClass("hide");
    },
    mousemove: function(e) {
      e.stopPropagation(), e.preventDefault();
      var t = this.y;
      this.px = e.pageX, this.py = e.pageY, this.x = this.px - this.ox, this.y = this.py - this.oy + this.st - this.hh, 
      this.y = Math.max(0, Math.min(this.y, 4 * 3 * (this.l - 1) * this.h)), t !== this.y && (this.hoverItem(), 
      this.showFuzzyTime(e.pageY));
    },
    clickCT: function(e) {
      e.preventDefault(), this.removeSelected(), this.component.emit("rf-tl", "", t(e.currentTarget).text());
    },
    showFuzzyTime: function(e) {
      var t, i, n, r, a = 0, s = this.ts, o = new Date(2012, 12, 21, this.dh, this.dm);
      p.find(s, function(e, n) {
        return t = e.split(":"), i = new Date(2012, 12, 21, t[0], t[1]), i > o ? (a = n, 
        !0) : void 0;
      }), 0 === a && (a = 1), 24 === this.dh && (a = 14), --a, this.$ts.not(".hide").addClass("hide"), 
      this.$ts.eq(a).removeClass("hide"), this.dh >= 5 && 22 > this.dh && (this.$ts.eq(a - 1).removeClass("hide"), 
      this.$ts.eq(a + 1).removeClass("hide")), n = e - this.oy - this.th, r = this.$ts.not(".hide").length, 
      this.$ft.stop(!0, !0).animate({
        top: n - 18 * ((r + 1) / 2)
      }, 233);
    },
    meTW: function() {
      this.$cursor.removeClass("hide"), this.$ft.removeClass("hide");
    },
    mlTW: function(e) {
      var t = this.$cursor;
      e && e.preventDefault(), t.hasClass("time-label") || t.hasClass("selected") || t.addClass("hide");
    },
    clickTW: function(e) {
      e.stopPropagation(), e.preventDefault();
      var t = this.$cursor, i = t.attr("data-time"), n = i.split(":"), r = 0 === +n[0] % 3 && 0 === +n[1], a = this.$selected;
      if (t.addClass("hide"), a) {
        if (a.removeClass("selected"), i === a.attr("date-time")) return;
        a.hasClass("time-label") || (a.remove(), delete this.$selected);
      }
      r ? this.$selected = this.$tc.find('[data-time="' + i + '"]').eq(0) : (this.$selected = t.clone().removeClass("hide time-hover"), 
      t.before(this.$selected)), this.$selected.addClass("selected"), this.component.emit("rf-tl", this.selectedTime = this.$selected.data("time"), "");
    },
    hoverItem: function() {
      var e = Math.round(this.y / this.h) * this.h, t = e * this.a, i = +Math.floor(t / 60).toFixed(0), n = t % 60, r = c(i) + ":" + c(n);
      this.dh = i, this.dm = n, this.$cursor.css("top", e).attr("data-time", r).find("time").text((12 === i ? i : i % 12) + ":" + c(n) + " " + (12 > i ? "A" : "P") + "M");
    },
    createNormalItem: function(e, i, n) {
      var r = t(this.divTmp.replace("{{class}}", " time-hover").replace("{{dt}}", c(e) + ":" + c(i)).replace("{{t}}", e + ":" + c(i) + " " + (12 > e ? "A" : "P") + "M"));
      return r.css("top", n), this.$tc.append(r), r;
    },
    createLabelItem: function(e, i, n) {
      var r = t(this.divTmp.replace("{{class}}", " time-label").replace("{{dt}}", c(e) + ":" + c(i)).replace("{{t}}", (12 === e ? e : e % 12) + " " + (12 > e ? "A" : "P") + "M"));
      return r.css("top", n), this.$tc.append(r), r;
    },
    generateHTML: function() {
      for (var e = this.l, t = 0, i = 180, n = new Date(2012, 12, 21, 21, 0), r = 0, a = 0; e > t; ++t) n.setMinutes(n.getMinutes() + i), 
      r = n.getHours(), a = n.getMinutes(), 8 === t && (r = 24), this.createLabelItem(r, a, 60 * t);
      this.$cursor = this.createNormalItem(0, 0, 0).addClass("hide");
    }
  };
  var y = function(e, t) {
    return e ? function(i) {
      return e.call(t, i);
    } : void 0;
  }, _ = function(e) {
    return e.getFullYear() + "-" + c(e.getMonth() + 1) + "-" + c(e.getDate());
  }, b = function(e, t) {
    return t || (t = 0), e = e.split("-"), new Date(e[0], +e[1] - 1, +e[2] + t);
  }, x = function() {
    var e = "" + new Date(), t = e.replace(/^(?:[\w\W]+([\+\-]\d\d):?(\d\d)[\w\W]+)$/, "$1:$2"), i = e.replace(/^(?:[\w\W]+\(([a-z]+)\)[\w\W]*)$/i, "$1");
    return ("UTC" === i || "GMT" === i) && (i = ""), t + (i ? " " + i : "");
  }, w = function(e) {
    return i ? k(e) : e.selectionEnd;
  }, k = function(e) {
    var t = document.selection.createRange(), i = e.createTextRange(), n = i.duplicate();
    return i.moveToBookmark(t.getBookmark()), n.setEndPoint("EndToStart", i), n.text.length + t.text.length;
  };
  return f;
}), define("mappanel", function(e) {
  "use strict";
  var t = e("jquery"), i = t.proxy, n = t.extend, r = window._ENV_, a = r.MAP_KEY, s = r.location, o = r.site_url, l = e("humantime").lead0, c = e("rex"), d = /[\r\n]+/g, u = "\r", h = window.navigator.geolocation, p = t(window), f = t.browser.msie, m = !1, g = e("panel"), v = g.extend({
    options: {
      template: '<div class="panel map-panel" tabindex="-1" data-widget="panel" id="map-panel"><div class="panel-body"><div class="map-container"><div class="gmap-wrap"><div class="map-box" id="gmap"></div></div><div class="map-mask"></div><div class="map-resize"><span class="expand">Expand</span><span class="compact">Compact</span><span class="rb"></span><span class="lt"></span></div><div class="map-place"><div class="place-editor"><i class="pointer icon-enter-blue place-submit"></i><div class="place-filter"></div><textarea class="normal" name="place-text" id="place-text" placeholder="Enter place here."></textarea></div><div class="map-places hide"><ul class="unstyled places-list" tabindex="-1"></ul></div></div></div></div></div>',
      parentNode: null,
      srcNode: null,
      place: null
    },
    isGeoSupported: !!h,
    setGeos: function(e, t, i) {
      this.xmap.initMap(e, t, i);
    },
    init: function() {
      var e, t = this.options;
      this.render(), e = this.element, this.originPlace = t.place, this.place = n({}, t.place), 
      delete t.place, this.placeInput = new y(this, "#place-text"), this.placesList = new _(this, ".places-list"), 
      this.xmap = new b(this, "#gmap"), this.listen(), this.$resize = e.find(".map-resize"), 
      this.$mask = e.find(".map-mask");
    },
    listen: function() {
      var e = this;
      this.on("update-place", this.update), this.on("change-place", this.change), this.on("geos", this.setGeos), 
      this.on("search-completed", this.searchCompleted), this.on("placeinput-tab", this.placeInputTab), 
      this.on("placeslist-tab", this.placesListTab), this.on("cleanup", function() {
        e.placesList.clear(), e.xmap.clear();
      }), this.on("clear-marker", this.clearMarker), this.on("enter-marker", this.enterMarker), 
      this.on("enter-placeitem", this.enterPlaceItem), this.on("click-placeitem", this.clickPlaceItem), 
      this.on("zoom-map", this.zoomMap), this.element.on("click.mappanel", ".place-submit", function() {
        Cross.place = e.place, t("body").trigger("save-cross");
      }), this.element.on("keydown.mappanel", i(this.keydown, this)), this.element.on("click.mappanel", ".map-mask", function(t) {
        t.preventDefault(), e.emit("zoom-map", !1);
      }), this.element.on("click.mappanel", ".map-resize", function(i) {
        i.preventDefault();
        var n = t(this).hasClass("map-rc");
        e.emit("zoom-map", n);
      }), this.element.on("click.mappanel", function(e) {
        e.stopPropagation();
      });
    },
    save: function() {
      this.$(".place-submit").trigger("click.mappanel");
    },
    keydown: function(e) {
      var t = this, i = e.altKey, n = e.ctrlKey, r = e.shiftKey, a = e.metaKey, s = e.keyCode;
      27 === s ? t.revert() : 13 === s && !(i | r) & (n | a) ? (t.emit("update-place", t.place), 
      t.save()) : 187 === s && n ? t.emit("zoom-map", 0) : 189 === s && n && t.emit("zoom-map", 1);
    },
    zoomMap: function(e) {
      this.xmap.zoom(e);
    },
    clickPlaceItem: function(e) {
      this.emit("change-place", e, "map"), this.element.focus();
    },
    enterPlaceItem: function(e) {
      this.placesList.selectItem(e);
    },
    enterMarker: function(e, t) {
      this.xmap.showMarker(e, t);
    },
    clearMarker: function(e) {
      this.xmap.saveMarker(e || 0);
    },
    searchCompleted: function(e, t) {
      this.placesList.update(e, t);
    },
    placeInputTab: function() {
      var e = this.placesList, t = e.$element, i = e.status;
      i && setTimeout(function() {
        t.focus();
      }, 0);
    },
    placesListTab: function() {
      var e = this.placeInput.$element;
      setTimeout(function() {
        e.focusend();
      }, 0);
    },
    resetPlace: function(e) {
      return e.title = e.description = e.lat = e.lng = e.external_id = e.provider = "", 
      e;
    },
    change: function(e, t) {
      var i = this.place, n = i.title, r = i.description, a = i.lat, s = i.lng, o = !e.title, l = this.placeInput, c = this.placesList, d = !1, u = this.xmap;
      i.updated_at = k(new Date()), o ? (i = this.resetPlace(i), c.clear(), u.clear()) : (i.title = e.title, 
      i.description = e.description, i.external_id = e.external_id || "", i.provider = e.provider || "", 
      "map" === t || "list" === t ? (i.lat = e.lat, i.lng = e.lng, l.change(w(e.title, e.description)), 
      d = !0) : "input" === t && (n === e.title || e.description || (c.clear(), u.textSearch(e.title)))), 
      (n !== e.title || r !== e.description || a !== e.lat || s !== e.lng || d) && this.emit("update-place", i);
    },
    revert: function() {
      this.emit("update-place", this.originPlace);
    },
    showPlace: function() {
      var e, t, i = this, n = this.placeInput, r = this.place, a = r.title, o = r.description, l = r.lat && r.lng;
      this.focus(), n.change(w(a, o)), n.$element.focusend(), l && (t = {
        coords: {
          latitude: r.lat,
          longitude: r.lng,
          title: r.title
        }
      });
      var c = function(e, t, i, n) {
        e && e.emit && e.emit("geos", t, i, n);
      }, d = function() {
        e = {
          coords: s
        }, l || (t = e), c(i, e, t, l);
      };
      this.isGeoSupported ? h.getCurrentPosition(function(n) {
        e = n, l || (t = e), c(i, e, t, l);
      }, d, {
        enableHighAccuracy: !0,
        timeout: 6100
      }) : d();
    },
    showBefore: function() {
      this.element.attr("editarea", "map-panel");
    },
    showAfter: function() {
      var e = this, t = e.srcNode;
      if (t) {
        var i = t.offset(), n = e.element, r = n.outerWidth();
        n.css({
          left: this.oleft = i.left - r - 15,
          top: this.otop = i.top
        });
      }
      m ? e.showPlace() : T(function() {
        m = !0, e && e.showPlace && e.showPlace();
      });
    },
    destory: function() {
      this.element.off(), this.element.remove(), this._destory();
    }
  }), y = function(e, t) {
    this.component = e, this.$container = this.component.element, this.selector = t, 
    this.$element = e.$(t), this.listen();
  };
  y.prototype = {
    getPlace: function() {
      var e = this.$element.val();
      return x(e);
    },
    change: function(e) {
      this.$element.val(e);
    },
    listen: function() {
      var e = this.$container, t = this.selector;
      e.on("blur.mappanel", t, i(this.blur, this)).on("keypress.mappanel", t, i(this.keypress, this)).on("keyup.mappanel", t, i(this.keyup, this)).on("keydown.mappanel", t, i(this.keydown, this)).on("focus.mappanel", t, i(this.focus, this));
    },
    lookup: function() {
      var e = this.trim();
      this.component.emit("change-place", e, "input");
    },
    trim: function() {
      var e = this.getPlace();
      return !e.title && e.description && (this.change(e.description), e = this.getPlace()), 
      e;
    },
    blur: function() {
      this.$element.addClass("normal");
    },
    focus: function() {
      this.$element.removeClass("normal");
    },
    keyup: function(e) {
      switch (e.keyCode) {
       case 40:
       case 38:
       case 16:
       case 17:
       case 18:
       case 9:
       case 27:
        break;

       case 13:
        this.component.emit("cleanup");
        break;

       default:
        this.lookup();
      }
      e.stopPropagation(), e.preventDefault();
    },
    keyHandler: function(e) {
      var t = this.component, i = e.keyCode;
      switch (i) {
       case 9:
        e.preventDefault(), t.emit("placeinput-tab");
        break;

       case 40:
        var n = this.$element.val(), r = n.length, a = this.$element[0], s = C(a);
        r === s && (e.preventDefault(), t.emit("placeinput-tab"));
      }
    },
    keypress: function(e) {
      this.suppressKeyPressRepeat || this.keyHandler(e);
    },
    keydown: function(e) {
      this.suppressKeyPressRepeat = !!~c.indexOf([ 9, 40 ], e.keyCode), this.keyHandler(e);
    }
  };
  var _ = function(e, t) {
    this.template = '<li class="place-item{{css-class}}" data-lat="{{lat}}" data-lng="{{lng}}" data-external-id="{{external_id}}"><address><div class="title">{{title}}</div><div class="description">{{address}}</div></address></li>', 
    this.component = e, this.$container = this.component.element, this.selector = t, 
    this.$element = e.$(t), this.$items = null, this.len = 0, this.curr = 0, this.viewportRows = 12, 
    this.viewportIndex = 0, this.scrollIndexs = [ 0, 11 ], this.scrollNum = 1, this.itemPX = 40, 
    this.listen();
  };
  _.prototype = {
    listen: function() {
      var e = this.$container, t = this.selector;
      e.on("blur.mappanel", t, i(this.blur, this)).on("keypress.mappanel", t, i(this.keypress, this)).on("keyup.mappanel", t, i(this.keyup, this)).on("keydown.mappanel", t, i(this.keydown, this)).on("focus.mappanel", t, i(this.focus, this)).on("click.mappanel", t + " > li", i(this.click, this)).on("mouseenter.mappanel", t + " > li", i(this.mouseenter, this));
    },
    update: function(e, t) {
      this.status = !!e.length || t, this.$element.empty(), this.curr = 0;
      var i, n = "", r = this.template;
      this.hasPlace = !1, this.status && (t && (n += r.replace("{{css-class}}", " place-marker").replace("{{title}}", t.title).replace("{{address}}", t.description).replace("{{lat}}", t.lat).replace("{{lng}}", t.lng).replace("{{external_id}}", t.external_id), 
      this.hasPlace = !0), c.each(e, function(e) {
        i = e.geometry.location, n += r.replace("{{css-class}}", "").replace("{{title}}", e.name).replace("{{address}}", e.formatted_address).replace("{{lat}}", i.lat()).replace("{{lng}}", i.lng()).replace("{{external_id}}", e.id);
      }), this.$element.html(n)), this.$items = this.$element.find(" > li"), this.len = this.$items.length, 
      this.$element.parent().toggleClass("hide", !this.status);
    },
    blur: function() {
      this.removeCurrStyle("hover");
    },
    mouseenter: function(e) {
      var i = t(e.currentTarget), n = i.index();
      this.selectItem(n, !0), this.component.emit("enter-marker", n, this.hasPlace);
    },
    selectItem: function(e, t) {
      0 === this.len && (this.$items = this.$element.find(" > li"), this.len = this.$items.length), 
      this.removeCurrStyle("hover"), this.curr = e, !t && this.$element.scrollTop(Math.floor(e / this.viewportRows) * this.itemPX * this.viewportRows), 
      this.addCurrStyle("hover");
    },
    focus: function() {
      this.$items = this.$element.find(" > li"), this.len = this.$items.length, this.addCurrStyle("hover"), 
      this.component.emit("enter-marker", this.curr, this.hasPlace);
    },
    addCurrStyle: function(e) {
      this.$items.eq(this.curr).addClass(e);
    },
    removeCurrStyle: function(e) {
      this.len && this.$items.eq(this.curr).removeClass(e);
    },
    clear: function() {
      this.curr = 0, this.len = 0, this.viewportIndex = 0, this.$items = null, this.$element.empty().parent().addClass("hide");
    },
    setPlace: function() {
      if (0 !== this.len) {
        var e = this.component, t = this.$items.eq(this.curr), i = {
          title: t.find("div.title").text(),
          description: t.find("div.description").text(),
          lat: t.data("lat") + "",
          lng: t.data("lng") + "",
          external_id: t.data("external-id"),
          provider: "google"
        };
        this.hasPlace = !0, e.emit("clear-marker", this.curr), e.emit("change-place", i, "list"), 
        this.clear();
      }
    },
    scroll: function(e) {
      var t = this.scrollIndexs, i = this.viewportRows, n = this.len, r = this.scrollNum, a = this.itemPX, s = this.curr, o = this.viewportIndex += e;
      if (o === t[1] + 1 && s === n - 1) this.$element.scrollTop(0), this.viewportIndex = 0; else if (o === t[0] - 1 && 0 === s) this.$element.scrollTop((n - i) * a), 
      this.viewportIndex = 11; else if (o === t[0] - 1 && s > t[0] || n - (i - t[1]) > s && o === t[1] + 1) {
        var l = this.$element.scrollTop();
        this.$element.scrollTop(l += e * a * r), this.viewportIndex = t[(e + 1) / 2];
      }
    },
    prev: function() {
      this.removeCurrStyle("hover"), 0 === this.curr && (this.curr = this.len), this.curr--, 
      this.addCurrStyle("hover");
    },
    next: function() {
      this.removeCurrStyle("hover"), this.curr++, this.len === this.curr && (this.curr = 0), 
      this.addCurrStyle("hover");
    },
    keyup: function(e) {
      e.stopPropagation(), e.preventDefault();
    },
    keyHandler: function(e) {
      var t = this, i = t.component, n = t.hasPlace, r = e.ctrlKey, a = e.keyCode;
      switch (a) {
       case 9:
        e.preventDefault(), i.emit("placeslist-tab");
        break;

       case 13:
       case 32:
        r || (e.preventDefault(), t.setPlace(), i.emit("enter-marker", t.curr, n));
        break;

       case 38:
        e.stopPropagation(), e.preventDefault(), t.scroll(-1), t.prev(), i.emit("enter-marker", t.curr, n);
        break;

       case 40:
        e.stopPropagation(), e.preventDefault(), t.scroll(1), t.next(), i.emit("enter-marker", t.curr, n);
      }
    },
    keypress: function(e) {
      return this.suppressKeyPressRepeat ? !1 : (this.keyHandler(e), void 0);
    },
    keydown: function(e) {
      this.suppressKeyPressRepeat = !!~c.indexOf([ 9, 13, 32, 38, 40 ], e.keyCode), this.keyHandler(e);
    },
    click: function(e) {
      e.stopPropagation(), e.preventDefault(), this.curr = t(e.currentTarget).index(), 
      this.setPlace();
    }
  };
  var b = function(e, t) {
    this.component = e, this.selector = t, this.$element = e.$(t), this.$wrap = this.$element.parent(), 
    this.GMaps = null, this.sizeStatus = !0, this.zoom2 = 2, this.zoom12 = 12, this.zoom16 = 16, 
    this.zoomN = 16, this.a = .05, this.owidth = this.$element.width(), this.oheight = this.$element.height(), 
    this.cbid = 0, this.redMarkers = [], this.curr = 0;
  };
  b.prototype = {
    resize: function(e, t) {
      880 > e && (e = 880), 500 > t && (t = 500), this.$element.width(e).height(t);
    },
    initMap: function(e, t, i) {
      var n, r, a = this, s = this.component, o = s.place, l = t.coords, c = e.coords, d = i;
      l || (t.coords = l = {}), l.latitude || (l.latitude = "0"), l.longitude || (l.longitude = "0"), 
      this.isGo = !0, this.hasLocation = !!c, this.hasPlace = d;
      try {
        if (n = this.GMaps = window.google.maps, r = n.ControlPosition, this._center = new n.LatLng(l.latitude, l.longitude), 
        this._request = {
          radius: 5e4,
          location: this._center
        }, this.enableOptions = {
          zoomControl: !0,
          zoomControlOptions: {
            position: r.RIGHT_TOP
          },
          scaleControl: !0,
          scaleControlOptions: {
            position: r.BOTTOM_LEFT
          }
        }, this.zoomN = this.hasPlace ? this.zoom16 : this.hasLocation ? this.zoom12 : this.zoom2, 
        this._map = new n.Map(this.$element[0], this.defaultOptions = {
          zoom: this.zoomN,
          center: this._center,
          disableDefaultUI: !0,
          MapTypeId: n.MapTypeId.ROADMAP,
          panControl: !1,
          zoomControl: !1,
          scaleControl: !1
        }), this._overlay = new n.OverlayView(), this._overlay.draw = function() {}, this._overlay.setMap(this._map), 
        this.createIcons(), this.hasLocation && (this._userMarker = new n.Marker({
          map: this._map,
          position: new n.LatLng(c.latitude, c.longitude),
          icon: this.sbicon,
          title: c.title || ""
        })), this._service = new n.places.PlacesService(this._map), this.hasPlace) {
          this._map.panBy(-100, 0);
          var u = this.createBlueMarker(n.Marker, {
            map: this._map,
            position: this._center,
            icon: this.bicon,
            draggable: !0,
            title: l.title || ""
          }, o);
          this.GMaps.event.addListener(u, "dragend", function(e) {
            var t = e.latLng;
            this._place.lat = "" + t.lat(), this._place.lng = "" + t.lng(), this._place.provider = "", 
            s.emit("change-place", this._place, "map");
          }), this.GMaps.event.addListener(u, "click", function() {
            a.clearMarkers(), s.emit("change-place", this._place, "map");
          }, !1), this.GMaps.event.addListener(u, "mouseover", function() {
            a.selectMarker(this), s.emit("enter-placeitem", 0);
          });
        }
        var h, p = new n.Geocoder(), f = function(e) {
          a._timer = setTimeout(function() {
            var t, i = s.placeInput.getPlace(), r = e.latLng;
            s.placesList.clear(), a.clearBlueMarker(), a.clearMarkers(), i.lat = "" + r.lat(), 
            i.lng = "" + r.lng(), t = a.createBlueMarker(n.Marker, {
              map: a._map,
              position: r,
              icon: a.bicon,
              draggable: !0,
              title: i.title || ""
            }, i), n.event.addListener(t, "dragend", function(e) {
              var t = e.latLng;
              this._place.lat = "" + t.lat(), this._place.lng = "" + t.lng(), this._place.provider = "", 
              s.emit("change-place", this._place, "map");
            }), n.event.trigger(t, "mouseover"), h = function(e, n) {
              a._timer && h.id === a.cbid && n === window.google.maps.GeocoderStatus.OK && e.length && (clearTimeout(a._timer), 
              a.hasPlace = !0, a.cbid = 0, i.title = "Right there on map", i.description = e[0].formatted_address, 
              i.provider = "", i.external_id = "", s.emit("change-place", t._place = i, "map"));
            }, h.id = ++a.cbid, p.geocode({
              latLng: new n.LatLng(i.lat, i.lng)
            }, h);
          }, 610);
        }, m = function() {
          clearTimeout(a._timer);
        };
        c && (n.event.addListener(this._userMarker, "mousedown", f), n.event.addListener(this._userMarker, "mouseup", f)), 
        n.event.addListener(this._map, "mousedown", f), n.event.addListener(this._map, "mouseup", m), 
        n.event.addListener(this._map, "dragstart", m);
      } catch (g) {
        this.isGo = !1;
      }
    },
    createBlueMarker: function(e, t, i) {
      return this._placeMarker = this.createMarker(e, t, i), this._placeMarker.isBlue = !0, 
      this._placeMarker;
    },
    clearBlueMarker: function() {
      this.removeMarker(this._placeMarker), this._placeMarker = null;
    },
    textSearch: function(e) {
      var t, i, n = this, r = n.GMaps, a = n.isGo, s = n.component, o = n._service, l = n._request;
      a && (n.clearMarkers(), e && e !== l.query && (l.query = e, t = function(e, a) {
        t.id === n.cbid && a === r.places.PlacesServiceStatus.OK && (n.cbid = 0, i = n._placeMarker, 
        n.createMarkers(e), s.emit("search-completed", e, i ? i._place : null));
      }, t.id = ++n.cbid, o.textSearch(l, t)));
    },
    panToRight: function() {
      var e = this.GMaps, t = this._map, i = this._overlay, n = i.getProjection(), r = e.Point, a = n.fromLatLngToContainerPixel(t.getCenter()), s = n.fromContainerPixelToLatLng(new r(a.x - 100, a.y));
      t.setCenter(s);
    },
    showMarker: function(e, t) {
      var i, n;
      i = t && -1 === --e ? this._placeMarker : this.redMarkers[e], i && (this.selectMarker(i), 
      n = i.getPosition(), this._map.panTo(n)), this.sizeStatus && (this._map.setZoom(this.zoomN = this.zoom16), 
      this.panToRight());
    },
    selectMarker: function(e) {
      var t = this.ricon, i = this.bicon, n = this.currMarker;
      n && (n.setZIndex(null), n.isBlue || n.setIcon(t)), e && (e.setZIndex(377), e.isBlue || e.setIcon(i), 
      this.currMarker = e);
    },
    createIcons: function() {
      var e = this.GMaps, t = o + "/static/img/icons.png", i = e.Size, n = e.Point, r = e.MarkerImage;
      this.bicon = new r(t, new i(26, 36), new n(0, 78)), this.ricon = new r(t, new i(26, 36), new n(26, 78)), 
      this.sbicon = new r(t, new i(12, 14), new n(52, 100));
    },
    saveMarker: function(e) {
      var t = this, i = t.hasPlace;
      if (!i || 0 !== e) {
        i && (this.clearBlueMarker(), e -= 1);
        var n = this.component, r = this.GMaps.event, a = this._placeMarker = this.redMarkers.splice(e, 1)[0];
        this.hasPlace = !0, this.selectMarker(a), this.defaultOptions.zoom = this.zoomN = this.zoom16, 
        r.clearListeners(a), a.isBlue = !0, a.setDraggable(!0), r.addListener(a, "click", function() {
          t.clearMarkers(), n.emit("change-place", this._place, "map");
        }, !1), r.addListener(a, "dragend", function(e) {
          var t = e.latLng;
          this._place.lat = "" + t.lat(), this._place.lng = "" + t.lng(), this._place.provider = "", 
          n.emit("change-place", this._place, "map");
        }), r.addListener(a, "mouseover", function() {
          t.selectMarker(this), n.emit("enter-placeitem", 0);
        });
      }
      this.clearMarkers();
    },
    clear: function() {
      this._placeMarker && this.clearBlueMarker(), this.clearMarkers(), this.hasPlace = !1, 
      this.defaultOptions.zoom = this.zoomN = this.hasLocation ? this.zoom12 : this.zoom2;
    },
    removeMarker: function(e) {
      e && (e.setMap(null), e = null);
    },
    clearMarkers: function() {
      var e, t = this.redMarkers, i = this.removeMarker;
      if (t) {
        for (;e = t.shift(); ) i(e);
        this.curr = 0;
      }
    },
    createMarkers: function(e, t) {
      for (var i, n, r, a = this, s = !t, o = this.component, l = this.createMarker, c = this.GMaps, d = c.event, u = c.LatLng, h = c.Marker, p = new c.LatLngBounds(), f = this.redMarkers, m = this._map, g = this.ricon, v = 0, y = function() {
        var e = a.indexOf(a.redMarkers, this);
        o.placesList.clear(), o.emit("clear-marker", e), o.emit("click-placeitem", this._place);
      }, _ = function() {
        var e = a.indexOf(a.redMarkers, this);
        a.selectMarker(this), o.emit("enter-placeitem", e += a._placeMarker ? 1 : 0);
      }; i = e[v]; ++v) r = i.lat ? new u(i.lat, i.lng) : i.geometry.location, n = l(h, {
        map: m,
        icon: g,
        title: i.name,
        position: r,
        zIndex: 0
      }, {
        title: i.title || i.name,
        description: i.description || i.formatted_address,
        lat: "" + r.lat(),
        lng: "" + r.lng(),
        external_id: i.id || "",
        provider: "google"
      }), d.addListener(n, "click", y, !1), d.addListener(n, "mouseover", _), f.push(n), 
      s && p.extend(r);
      s && m.fitBounds(p);
    },
    createMarker: function(e, t, i, n) {
      return n = new e(t), n._place = i, n;
    },
    zoom: function(e) {
      if (this.isGo) {
        this.sizeStatus = e;
        var t = this, i = t.component, n = i.element, r = t.GMaps, a = t._map, s = t.redMarkers;
        if (this.$wrap.toggleClass("gmap-big", !e), i.$resize.toggleClass("map-rc"), i.$mask.toggleClass("hide", !e), 
        e) n.css({
          top: i.otop,
          left: i.oleft
        }), t.$element.width(t.owidth).height(t.oheight), setTimeout(function() {
          a.setOptions(t.defaultOptions), a.setCenter(t._placeMarker ? t._placeMarker.getPosition() : t._userMarker.getPosition()), 
          t.hasPlace && t.panToRight();
        }, 0); else {
          var o = p.width(), l = p.height(), c = t.a, d = p.scrollTop(), u = p.scrollLeft();
          t.resize(o * (1 - 2 * c), l * (1 - c) - 56), n.css({
            top: 56 + d,
            left: o * c + u
          }), setTimeout(function() {
            a.setOptions(t.enableOptions);
          }, 0);
        }
        r.event.trigger(a, "resize"), !t._placeMarker && s.length && (t._placeMarker = s[0]), 
        a.setCenter(t._placeMarker ? t._placeMarker.getPosition() : t._userMarker ? t._userMarker.getPosition() : null), 
        i.placeInput.$element.focusend();
      }
    },
    indexOf: function(e, t) {
      return c.indexOf(e, t);
    }
  };
  var x = function(e) {
    var i = e.split(d), n = i.length ? t.trim(i.shift()) : "", r = t.trim(i.join(u)).replace(d, "");
    return {
      title: n,
      description: r
    };
  }, w = function(e, t) {
    return e + (t ? u + t.replace(d, u) : "");
  }, k = function(e) {
    return e.getUTCFullYear() + "-" + l(e.getUTCMonth() + 1) + "-" + l(e.getUTCDate()) + " " + l(e.getUTCHours()) + ":" + l(e.getUTCMinutes()) + ":" + l(e.getUTCSeconds()) + " +0000";
  }, C = function(e) {
    return f ? E(e) : e.selectionEnd;
  }, E = function(e) {
    var t = document.selection.createRange(), i = e.createTextRange(), n = i.duplicate();
    return i.moveToBookmark(t.getBookmark()), n.setEndPoint("EndToStart", i), n.text.length + t.text.length;
  }, T = function(e) {
    if (!window.google || !window.google.maps) {
      window._loadMaps = function() {};
      var i = "google-maps-jsapi";
      t(i).remove();
      var n = document.getElementsByTagName("body")[0], r = document.createElement("script");
      window._gmap = function() {
        delete window._gmap;
      }, window._loadMaps = function() {
        window.google.load("maps", "3", {
          other_params: "key=" + a + "&sensor=false&libraries=places",
          callback: function() {
            e();
          }
        });
      }, r.async = "async", r.className = i, r.src = "//www.google.com/jsapi?callback=_loadMaps", 
      n.appendChild(r);
    }
  };
  return v;
}), define(function(e) {
  "use strict";
  function t(e) {
    return e.stopPropagation(), e.preventDefault(), !1;
  }
  function i() {
    r(p).removeClass("open");
  }
  function n(e) {
    var t = r(this), i = t.data("timer"), n = t.data("clicked"), a = t.find("div.user-panel").addClass("show"), s = -a.outerHeight();
    return e.preventDefault(), "mouseleave" !== e.type || n ? n ? (t.data("clicked", !1), 
    void 0) : i ? (clearTimeout(i), t.data("timer", i = null), !1) : (f || (a.css("top", s), 
    t.find(".user-panel").addClass("show"), f = !0), t.prev().removeClass("hide"), t.parent().addClass("user"), 
    a.stop().animate({
      top: 56
    }, 100), void 0) : (i = setTimeout(function() {
      f = !1, a.stop().animate({
        top: s
      }, 200, function() {
        t.prev().addClass("hide"), t.parent().removeClass("user");
      }), clearTimeout(i), t.data("timer", i = null);
    }, 500), t.data("timer", i), !1);
  }
  var r = e("jquery"), a = e("bus"), s = e("api"), o = e("store"), l = e("dialog"), c = e("xdialog").dialogs, d = e("xdialog").Identification, u = e("xidentity"), h = r(document.body);
  h.on("drop", t).on("dragover", t);
  var p = '[data-toggle="dropdown"]';
  h.on("click.dropdown.data-api", i);
  var f = !1;
  h.on("mouseenter.dropdown mouseleave.dropdown", "#app-user-menu .dropdown-wrapper", n), 
  h.on("click.usermenu", '#app-user-menu .dropdown-wrapper a[href^="/#"]', function() {
    var e = r("#app-user-menu .dropdown-wrapper"), t = e.find("div.user-panel").addClass("show"), i = -t.outerHeight();
    t.css("top", i), e.prev().addClass("hide").end().parent().removeClass("user"), e.data("clicked", !0);
  }), h.on("click.usermenu", "#app-signout", function() {
    a.emit("xapp:cross:end"), r(".navbar .dropdown-wrapper").find(".user-panel").remove(), 
    r("#app-signin").show().next().hide().removeClass("user").find(".fill-left").addClass("hide").end().find("#user-name span").text(""), 
    o.remove("cats"), o.remove("user"), o.remove("authorization"), window.location.href = "/";
  });
  var m = function(e, t, i) {
    s.request("checkinvitationtoken", {
      type: "POST",
      params: {
        token: e
      },
      data: {
        invitation_token: t
      }
    }, function(e) {
      e.valid && i();
    });
  }, g = function(e) {
    var t = r(this), i = o.get("authorization"), n = i && i.user_id, a = i && i.token, s = o.get("user"), l = t.data("link"), c = (t.data("event-ignore"), 
    r("#app-browsing-identity")), d = c.length;
    if (d) {
      var u = c.data(), h = u.settings, p = h.action, f = h.code, g = h.invitation_token, v = h.tokenType, y = h.readOnly, _ = h.browsing;
      if (1 === f) {
        if (l) {
          e.stopImmediatePropagation(), e.stopPropagation(), e.preventDefault();
          var b = r('<div id="read-only-browsing" data-destory="true" data-widget="dialog" data-dialog-type="read_only"></div>');
          return b.data("settings", _), r("#app-tmp").append(b), b.trigger("click"), !1;
        }
      } else if (2 === f) {
        var x = _.user_id;
        if ("SIGNIN" === p && n && n !== x) {
          if (!l && "cross" !== v) return e.stopImmediatePropagation(), e.stopPropagation(), 
          e.preventDefault(), m(a, g, function() {
            var e = r('<div id="merge-identity" data-destory="true" data-widget="dialog" data-dialog-type="browsing_identity"></div>');
            e.data("settings", {
              browsing: _,
              user: s,
              token: a,
              action: p,
              invitation_token: g
            }), r("#app-tmp").append(e), e.trigger("click");
          }), !1;
        } else if ("SETUP" === p && !y && !l) return e.stopImmediatePropagation(), e.stopPropagation(), 
        e.preventDefault(), n && n !== x ? m(a, g, function() {
          var e = r('<div id="merge-identity" data-destory="true" data-widget="dialog" data-dialog-type="browsing_identity"></div>');
          e.data("settings", {
            browsing: _,
            user: s,
            token: a,
            action: p,
            invitation_token: g
          }), r("#app-tmp").append(e), e.trigger("click");
        }) : r('[data-user-action="SETUP"]').trigger("click"), !1;
      }
    }
  };
  h.on("click.data-link", "a[data-link], div[data-link], span[data-link]", g), h.on("mousedown.data-link", "button[data-link], input[data-link], textarea[data-link]", g), 
  a.on("app:cross:edited", function(e) {
    var t = r("#app-browsing-identity"), i = t.data("settings"), n = r("#app-read-only");
    e && "no_permission" === e.error && (n.size() || r("#app-main").append(n = r('<div id="app-read-only" data-widget="dialog" data-dialog-type="read_only"></div>').data("settings", i && i.browsing || o.get("user"))), 
    n.trigger("click"));
  }), h.on("click.dialog.data-api", '[data-widget="dialog"]', function(e) {
    var t, i = r(this), n = i.data("dialog"), a = i.data("dialog-type"), s = i.data("dialog-tab"), o = i.data("dialog-from"), u = i.data("dialog-settings");
    e.preventDefault(), n || a && (t = c[a], u && (t = r.extend(!0, {}, t, u)), n = new ("identification" === a ? d : l)(t), 
    n.options.srcNode = i, o && (n.dialog_from = o), n.render(), i.data("dialog", n), 
    h.find('[data-dialog-type="' + a + '"]').not(i).data("dialog", n)), s && n.switchTab(s), 
    n.show(e);
  });
  var v = o.get("identities");
  v || (v = []), h.on("focus.typeahead.data-api", '[data-typeahead-type="identity"]', function(e) {
    var t = r(this);
    t.data("typeahead") || (e.preventDefault(), t.data("typeahead", new u({
      options: {
        source: v,
        useCache: !0,
        target: t,
        onNothing: function() {
          this.target.parent().removeClass("identity-avatar"), a.emit("widget-dialog-identification-nothing");
        },
        "onAutocomplete:finish": function(e) {
          var t;
          e && (t = e.identity) ? this.target.prev().attr("src", t.avatar_filename).parent().addClass("identity-avatar") : this.target.parent().removeClass("identity-avatar"), 
          a.emit("widget-dialog-identification-auto", e);
        }
      }
    })));
  });
}), define("filehtml5", function(e) {
  function t() {
    return "file-" + o++;
  }
  function i(e, t) {
    return function(i) {
      return e.call(t, i);
    };
  }
  var n = e("class"), r = e("emitter"), a = window, s = n.create(r, {
    initialize: function(e) {
      var i = null;
      i = s.isValidFile(e) ? e : s.isValidFile(e.file) ? e.file : !1, i && s.canUpload() && (this._file = i, 
      this._name = i.name || i.fileName, this._size = i.size || i.fileSize, this._type = i.type, 
      i.hasOwnProperty("lastModifiedDate") && (this._dateModified = i.lastModifiedDate)), 
      this._id = t();
    },
    _uploadEventHandler: function(e) {
      var t = this._xhr, i = e.type;
      switch (i) {
       case "progress":
        this.emit("uploadprogress", {
          originEvent: e,
          bytesLoaded: e.loaded,
          bytesTotal: this._size,
          percentLoaded: Math.min(100, Math.round(1e4 * e.loaded / this._size) / 100)
        }), this._bytesUploaded = e.loaded;
        break;

       case "load":
        if (t.status >= 200 && 299 >= t.status) {
          this.emit("uploadcomplete", {
            originEvent: e,
            data: e.target.responseText
          });
          var n = t.upload, r = this._boundEventHandler;
          n.removeEventListener("progress", r), n.removeEventListener("crror", r), n.removeEventListener("abort", r), 
          t.removeEventListener("load", r), t.removeEventListener("error", r), t.removeEventListener("readystatechange", r), 
          this._xhr = null;
        } else this.emit("uploaderror", {
          originEvent: e,
          status: t.status,
          statusText: t.statusText,
          source: "http"
        });
        break;

       case "error":
        this.emit("uploaderror", {
          originEvent: e,
          status: t.status,
          statusText: t.statusText,
          source: "FileHTML5"
        });
        break;

       case "abort":
        this.emit("uploadcancel", {
          originEvent: e
        });
        break;

       case "readystatechange":
        this.emit("readystatechange", {
          originEvent: e,
          readyState: e.target.readyState
        });
      }
    },
    startUpload: function(e, t, n) {
      this._bytesUploaded = 0, this._xhr = new XMLHttpRequest(), this._boundEventHandler = i(this._uploadEventHandler, this);
      var r, a = new FormData(), s = n, o = this._xhr, l = o.upload, c = this._boundEventHandler;
      for (r in t) a.append(r, t[r]);
      if (s && a.append(s, this._file), o.addEventListener("loadstart", c, !1), o.addEventListener("load", c, !1), 
      o.addEventListener("error", c, !1), o.addEventListener("abort", c, !1), o.addEventListener("loadend", c, !1), 
      o.addEventListener("readystatechange", c, !1), l.addEventListener("progress", c, !1), 
      l.addEventListener("error", c, !1), l.addEventListener("abort", c, !1), o.open("POST", e, !0), 
      o.withCredentials = !0, this._xhrHeaders) for (r in this._xhrHeaders) o.setRequestHeader(r, this._xhrHeaders[r]);
      o.send(a), this.emit("uploadstart", {
        xhr: o
      });
    },
    cancelUpload: function() {
      this._xhr && this._xhr.abort();
    }
  });
  s.isValidFile = function(e) {
    return a && a.File && e instanceof a.File;
  }, s.canUpload = function() {
    return a && a.FormData && a.XMLHttpRequest;
  };
  var o = 0;
  return s;
}), define("countrycodes", function() {
  return [ {
    country_code: "86",
    country_name: "China",
    short_name: "CN",
    search_index: "86 china cn 中国",
    support: [ "iMessage", "SMS" ],
    regular: "^\\+86",
    format_long: 11,
    format_reg: "^(.{3})(.{4})(.{4})$",
    format_str: "$1 $2 $3"
  }, {
    country_code: "1",
    country_name: "United States of America",
    short_name: "US",
    search_index: "1 united states of america us 美利坚合众国",
    support: [ "iMessage", "SMS" ],
    regular: "^\\+1",
    format_long: 10,
    format_reg: "^(.{3})(.{3})(.{4})$",
    format_str: "($1) $2-$3"
  }, {
    country_code: "1",
    country_name: "Canada",
    short_name: "CA",
    search_index: "1 canada ca 加拿大",
    support: [ "iMessage", "SMS" ],
    regular: "^\\+1",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "1242",
    country_name: "Bahamas",
    short_name: "BS",
    search_index: "1242 bahamas bs 巴哈马",
    support: [ "iMessage" ],
    regular: "^\\+1242",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "1246",
    country_name: "Barbados",
    short_name: "BB",
    search_index: "1246 barbados bb 巴巴多斯",
    support: [ "iMessage" ],
    regular: "^\\+1246",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "1264",
    country_name: "Anguilla",
    short_name: "AI",
    search_index: "1264 anguilla ai 安圭拉岛",
    support: [ "iMessage" ],
    regular: "^\\+1264",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "1268",
    country_name: "Antigua and Barbuda",
    short_name: "AG",
    search_index: "1268 antigua and barbuda ag 安提瓜和巴布达",
    support: [ "iMessage" ],
    regular: "^\\+1268",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "1284",
    country_name: "British Virgin Islands",
    short_name: "VG",
    search_index: "1284 british virgin islands vg 英属维京群岛",
    support: [ "iMessage" ],
    regular: "^\\+1284",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "1340",
    country_name: "United States Virgin Islands",
    short_name: "VI",
    search_index: "1340 united states virgin islands vi 美属维京群岛",
    support: [ "iMessage" ],
    regular: "^\\+1340",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "1345",
    country_name: "Cayman Islands",
    short_name: "KY",
    search_index: "1345 cayman islands ky 开曼群岛",
    support: [ "iMessage" ],
    regular: "^\\+1345",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "1441",
    country_name: "Bermuda",
    short_name: "BM",
    search_index: "1441 bermuda bm 百慕大",
    support: [ "iMessage" ],
    regular: "^\\+1441",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "1473",
    country_name: "Grenada",
    short_name: "GD",
    search_index: "1473 grenada gd 格林纳达岛",
    support: [ "iMessage" ],
    regular: "^\\+1473",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "1649",
    country_name: "Turks and Caicos Islands",
    short_name: "TC",
    search_index: "1649 turks and caicos islands tc 特克斯和凯科斯群岛",
    support: [ "iMessage" ],
    regular: "^\\+1649",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "1664",
    country_name: "Montserrat",
    short_name: "MS",
    search_index: "1664 montserrat ms 蒙特萨拉特岛",
    support: [ "iMessage" ],
    regular: "^\\+1664",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "1670",
    country_name: "Northern Mariana Islands",
    short_name: "MP",
    search_index: "1670 northern mariana islands mp 美国北马里亚纳群岛",
    support: [ "iMessage" ],
    regular: "^\\+1670",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "1671",
    country_name: "Guam",
    short_name: "GU",
    search_index: "1671 guam gu 关岛",
    support: [ "iMessage" ],
    regular: "^\\+1671",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "1684",
    country_name: "American Samoa",
    short_name: "AS",
    search_index: "1684 american samoa as 美属萨摩亚群岛",
    support: [ "iMessage" ],
    regular: "^\\+1684",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "1721",
    country_name: "Sint Maarten",
    short_name: "SX",
    search_index: "1721 sint maarten sx 圣马丁岛",
    support: [ "iMessage" ],
    regular: "^\\+1721",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "1758",
    country_name: "Saint Lucia",
    short_name: "LC",
    search_index: "1758 saint lucia lc 圣卢西亚",
    support: [ "iMessage" ],
    regular: "^\\+1758",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "1767",
    country_name: "Dominica",
    short_name: "DM",
    search_index: "1767 dominica dm 多米尼加",
    support: [ "iMessage" ],
    regular: "^\\+1767",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "1784",
    country_name: "Saint Vincent and the Grenadines",
    short_name: "VC",
    search_index: "1784 saint vincent and the grenadines vc 圣文森特和格林纳丁斯",
    support: [ "iMessage" ],
    regular: "^\\+1784",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "1787",
    country_name: "Puerto Rico",
    short_name: "PR",
    search_index: "1787 puerto rico pr 波多黎各",
    support: [ "iMessage" ],
    regular: "^\\+1787",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "1939",
    country_name: "Puerto Rico",
    short_name: "PR",
    search_index: "1939 puerto rico pr 波多黎各",
    support: [ "iMessage" ],
    regular: "^\\+1939",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "1809",
    country_name: "Dominican Republic",
    short_name: "DO",
    search_index: "1809 dominican republic do 多米尼加共和国",
    support: [ "iMessage" ],
    regular: "^\\+1809",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "1829",
    country_name: "Dominican Republic",
    short_name: "DO",
    search_index: "1829 dominican republic do 多米尼加共和国",
    support: [ "iMessage" ],
    regular: "^\\+1829",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "1849",
    country_name: "Dominican Republic",
    short_name: "DO",
    search_index: "1849 dominican republic do 多米尼加共和国",
    support: [ "iMessage" ],
    regular: "^\\+1849",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "1868",
    country_name: "Trinidad and Tobago",
    short_name: "TT",
    search_index: "1868 trinidad and tobago tt 特立尼达和多巴哥",
    support: [ "iMessage" ],
    regular: "^\\+1868",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "1869",
    country_name: "Saint Kitts and Nevis",
    short_name: "KN",
    search_index: "1869 saint kitts and nevis kn 圣基茨和尼维斯联邦",
    support: [ "iMessage" ],
    regular: "^\\+1869",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "1876",
    country_name: "Jamaica",
    short_name: "JM",
    search_index: "1876 jamaica jm 牙买加",
    support: [ "iMessage" ],
    regular: "^\\+1876",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "20",
    country_name: "Egypt",
    short_name: "EG",
    search_index: "20 egypt eg 埃及",
    support: [ "iMessage" ],
    regular: "^\\+20",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "212",
    country_name: "Western Sahara",
    short_name: "EH",
    search_index: "212 western sahara eh 西撒哈拉",
    support: [ "iMessage" ],
    regular: "^\\+212",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "212",
    country_name: "Morocco",
    short_name: "MA",
    search_index: "212 morocco ma 摩洛哥",
    support: [ "iMessage" ],
    regular: "^\\+212",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "213",
    country_name: "Algeria",
    short_name: "DZ",
    search_index: "213 algeria dz 阿尔及利亚",
    support: [ "iMessage" ],
    regular: "^\\+213",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "216",
    country_name: "Tunisia",
    short_name: "TN",
    search_index: "216 tunisia tn 突尼斯",
    support: [ "iMessage" ],
    regular: "^\\+216",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "218",
    country_name: "Libya",
    short_name: "LY",
    search_index: "218 libya ly 大阿拉伯利比亚民众国",
    support: [ "iMessage" ],
    regular: "^\\+218",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "220",
    country_name: "Gambia",
    short_name: "GM",
    search_index: "220 gambia gm 甘比亚",
    support: [ "iMessage" ],
    regular: "^\\+220",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "221",
    country_name: "Senegal",
    short_name: "SN",
    search_index: "221 senegal sn 塞内加尔共和国",
    support: [ "iMessage" ],
    regular: "^\\+221",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "222",
    country_name: "Mauritania",
    short_name: "MR",
    search_index: "222 mauritania mr 毛里塔尼亚",
    support: [ "iMessage" ],
    regular: "^\\+222",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "223",
    country_name: "Mali",
    short_name: "ML",
    search_index: "223 mali ml 马里",
    support: [ "iMessage" ],
    regular: "^\\+223",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "224",
    country_name: "Guinea",
    short_name: "GN",
    search_index: "224 guinea gn 几内亚",
    support: [ "iMessage" ],
    regular: "^\\+224",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "225",
    country_name: "Côte d'Ivoire",
    short_name: "CI",
    search_index: "225 côte d'ivoire ci 科特迪瓦",
    support: [ "iMessage" ],
    regular: "^\\+225",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "226",
    country_name: "Burkina Faso",
    short_name: "BF",
    search_index: "226 burkina faso bf 布基纳法索国",
    support: [ "iMessage" ],
    regular: "^\\+226",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "227",
    country_name: "Niger",
    short_name: "NE",
    search_index: "227 niger ne 尼日尔",
    support: [ "iMessage" ],
    regular: "^\\+227",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "228",
    country_name: "Togo",
    short_name: "TG",
    search_index: "228 togo tg 多哥",
    support: [ "iMessage" ],
    regular: "^\\+228",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "229",
    country_name: "Benin",
    short_name: "BJ",
    search_index: "229 benin bj 贝宁",
    support: [ "iMessage" ],
    regular: "^\\+229",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "230",
    country_name: "Mauritius",
    short_name: "MU",
    search_index: "230 mauritius mu 毛里求斯",
    support: [ "iMessage" ],
    regular: "^\\+230",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "231",
    country_name: "Liberia",
    short_name: "LR",
    search_index: "231 liberia lr 利比里亚",
    support: [ "iMessage" ],
    regular: "^\\+231",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "232",
    country_name: "Sierra Leone",
    short_name: "SL",
    search_index: "232 sierra leone sl 塞拉利昂",
    support: [ "iMessage" ],
    regular: "^\\+232",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "233",
    country_name: "Ghana",
    short_name: "GH",
    search_index: "233 ghana gh 加纳",
    support: [ "iMessage" ],
    regular: "^\\+233",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "234",
    country_name: "Nigeria",
    short_name: "NG",
    search_index: "234 nigeria ng 尼日利亚",
    support: [ "iMessage" ],
    regular: "^\\+234",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "235",
    country_name: "Chad",
    short_name: "TD",
    search_index: "235 chad td 乍得",
    support: [ "iMessage" ],
    regular: "^\\+235",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "236",
    country_name: "Central African Republic",
    short_name: "CF",
    search_index: "236 central african republic cf 中非共和国",
    support: [ "iMessage" ],
    regular: "^\\+236",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "237",
    country_name: "Cameroon",
    short_name: "CM",
    search_index: "237 cameroon cm 噶麦隆",
    support: [ "iMessage" ],
    regular: "^\\+237",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "238",
    country_name: "Cape Verde",
    short_name: "CV",
    search_index: "238 cape verde cv 佛得角",
    support: [ "iMessage" ],
    regular: "^\\+238",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "239",
    country_name: "São Tomé and Príncipe",
    short_name: "ST",
    search_index: "239 são tomé and príncipe st 圣多美与普林西比",
    support: [ "iMessage" ],
    regular: "^\\+239",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "240",
    country_name: "Equatorial Guinea",
    short_name: "GQ",
    search_index: "240 equatorial guinea gq 赤道几内亚",
    support: [ "iMessage" ],
    regular: "^\\+240",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "241",
    country_name: "Gabon",
    short_name: "GA",
    search_index: "241 gabon ga 加蓬",
    support: [ "iMessage" ],
    regular: "^\\+241",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "242",
    country_name: "Congo",
    short_name: "CG",
    search_index: "242 congo cg 刚果",
    support: [ "iMessage" ],
    regular: "^\\+242",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "243",
    country_name: "Democratic Republic of the Congo",
    short_name: "CD",
    search_index: "243 democratic republic of the congo cd 刚果民主共和国",
    support: [ "iMessage" ],
    regular: "^\\+243",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "244",
    country_name: "Angola",
    short_name: "AO",
    search_index: "244 angola ao 安哥拉",
    support: [ "iMessage" ],
    regular: "^\\+244",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "245",
    country_name: "Guinea-Bissau",
    short_name: "GW",
    search_index: "245 guinea-bissau gw 几内亚比绍共和国",
    support: [ "iMessage" ],
    regular: "^\\+245",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "248",
    country_name: "Seychelles",
    short_name: "SC",
    search_index: "248 seychelles sc 塞舌尔共和国",
    support: [ "iMessage" ],
    regular: "^\\+248",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "249",
    country_name: "Sudan",
    short_name: "SD",
    search_index: "249 sudan sd 苏丹",
    support: [ "iMessage" ],
    regular: "^\\+249",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "250",
    country_name: "Rwanda",
    short_name: "RW",
    search_index: "250 rwanda rw 卢旺达",
    support: [ "iMessage" ],
    regular: "^\\+250",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "251",
    country_name: "Ethiopia",
    short_name: "ET",
    search_index: "251 ethiopia et 埃塞俄比亚",
    support: [ "iMessage" ],
    regular: "^\\+251",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "252",
    country_name: "Somalia Democratic Republic",
    short_name: "SO",
    search_index: "252 somalia democratic republic so 索马里",
    support: [ "iMessage" ],
    regular: "^\\+252",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "253",
    country_name: "Djibouti",
    short_name: "DJ",
    search_index: "253 djibouti dj 吉布提",
    support: [ "iMessage" ],
    regular: "^\\+253",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "254",
    country_name: "Kenya",
    short_name: "KE",
    search_index: "254 kenya ke 肯尼亚",
    support: [ "iMessage" ],
    regular: "^\\+254",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "255",
    country_name: "Tanzania",
    short_name: "TZ",
    search_index: "255 tanzania tz 坦桑尼亚联合共和国",
    support: [ "iMessage" ],
    regular: "^\\+255",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "256",
    country_name: "Uganda",
    short_name: "UG",
    search_index: "256 uganda ug 乌干达",
    support: [ "iMessage" ],
    regular: "^\\+256",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "257",
    country_name: "Burundi",
    short_name: "BI",
    search_index: "257 burundi bi 布隆迪",
    support: [ "iMessage" ],
    regular: "^\\+257",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "258",
    country_name: "Mozambique",
    short_name: "MZ",
    search_index: "258 mozambique mz 莫桑比克",
    support: [ "iMessage" ],
    regular: "^\\+258",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "260",
    country_name: "Zambia",
    short_name: "ZM",
    search_index: "260 zambia zm 赞比亚",
    support: [ "iMessage" ],
    regular: "^\\+260",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "261",
    country_name: "Madagascar",
    short_name: "MG",
    search_index: "261 madagascar mg 马达加斯加",
    support: [ "iMessage" ],
    regular: "^\\+261",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "262",
    country_name: "Mayotte",
    short_name: "YT",
    search_index: "262 mayotte yt 马约特岛",
    support: [ "iMessage" ],
    regular: "^\\+262",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "263",
    country_name: "Zimbabwe",
    short_name: "ZW",
    search_index: "263 zimbabwe zw 津巴布韦共和国",
    support: [ "iMessage" ],
    regular: "^\\+263",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "264",
    country_name: "Namibia",
    short_name: "NA",
    search_index: "264 namibia na 纳米比亚",
    support: [ "iMessage" ],
    regular: "^\\+264",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "265",
    country_name: "Malawi",
    short_name: "MW",
    search_index: "265 malawi mw 马拉威",
    support: [ "iMessage" ],
    regular: "^\\+265",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "266",
    country_name: "Lesotho",
    short_name: "LS",
    search_index: "266 lesotho ls 莱索托",
    support: [ "iMessage" ],
    regular: "^\\+266",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "267",
    country_name: "Botswana",
    short_name: "BW",
    search_index: "267 botswana bw 博茨瓦纳",
    support: [ "iMessage" ],
    regular: "^\\+267",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "268",
    country_name: "Swaziland",
    short_name: "SZ",
    search_index: "268 swaziland sz 斯威士兰",
    support: [ "iMessage" ],
    regular: "^\\+268",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "269",
    country_name: "Comoros",
    short_name: "KM",
    search_index: "269 comoros km 科摩罗",
    support: [ "iMessage" ],
    regular: "^\\+269",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "27",
    country_name: "South Africa",
    short_name: "ZA",
    search_index: "27 south africa za 南非共和国",
    support: [ "iMessage" ],
    regular: "^\\+27",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "291",
    country_name: "Eritrea",
    short_name: "ER",
    search_index: "291 eritrea er 厄立特里亚",
    support: [ "iMessage" ],
    regular: "^\\+291",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "297",
    country_name: "Aruba",
    short_name: "AW",
    search_index: "297 aruba aw 阿鲁巴岛",
    support: [ "iMessage" ],
    regular: "^\\+297",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "298",
    country_name: "Faroe Islands",
    short_name: "FO",
    search_index: "298 faroe islands fo 法罗群岛",
    support: [ "iMessage" ],
    regular: "^\\+298",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "299",
    country_name: "Greenland",
    short_name: "GL",
    search_index: "299 greenland gl 格陵兰岛",
    support: [ "iMessage" ],
    regular: "^\\+299",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "30",
    country_name: "Greece",
    short_name: "GR",
    search_index: "30 greece gr 希腊",
    support: [ "iMessage" ],
    regular: "^\\+30",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "31",
    country_name: "Netherlands",
    short_name: "NL",
    search_index: "31 netherlands nl 荷兰",
    support: [ "iMessage" ],
    regular: "^\\+31",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "32",
    country_name: "Belgium",
    short_name: "BE",
    search_index: "32 belgium be 比利时",
    support: [ "iMessage" ],
    regular: "^\\+32",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "33",
    country_name: "France",
    short_name: "FR",
    search_index: "33 france fr 法国",
    support: [ "iMessage" ],
    regular: "^\\+33",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "34",
    country_name: "Spain",
    short_name: "ES",
    search_index: "34 spain es 西班牙",
    support: [ "iMessage" ],
    regular: "^\\+34",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "350",
    country_name: "Gibraltar",
    short_name: "GI",
    search_index: "350 gibraltar gi 直布罗陀",
    support: [ "iMessage" ],
    regular: "^\\+350",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "351",
    country_name: "Portugal",
    short_name: "PT",
    search_index: "351 portugal pt 葡萄牙",
    support: [ "iMessage" ],
    regular: "^\\+351",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "352",
    country_name: "Luxembourg",
    short_name: "LU",
    search_index: "352 luxembourg lu 卢森堡",
    support: [ "iMessage" ],
    regular: "^\\+352",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "353",
    country_name: "Ireland",
    short_name: "IE",
    search_index: "353 ireland ie 爱尔兰",
    support: [ "iMessage" ],
    regular: "^\\+353",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "354",
    country_name: "Iceland",
    short_name: "IS",
    search_index: "354 iceland is 冰岛",
    support: [ "iMessage" ],
    regular: "^\\+354",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "355",
    country_name: "Albania",
    short_name: "AL",
    search_index: "355 albania al 阿尔巴尼亚",
    support: [ "iMessage" ],
    regular: "^\\+355",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "356",
    country_name: "Malta",
    short_name: "MT",
    search_index: "356 malta mt 马耳他",
    support: [ "iMessage" ],
    regular: "^\\+356",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "357",
    country_name: "Cyprus",
    short_name: "CY",
    search_index: "357 cyprus cy 塞浦路斯",
    support: [ "iMessage" ],
    regular: "^\\+357",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "358",
    country_name: "Aland Islands",
    short_name: "AX",
    search_index: "358 aland islands ax 奥兰群岛",
    support: [ "iMessage" ],
    regular: "^\\+358",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "358",
    country_name: "Finland",
    short_name: "FI",
    search_index: "358 finland fi 芬兰",
    support: [ "iMessage" ],
    regular: "^\\+358",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "359",
    country_name: "Bulgaria",
    short_name: "BG",
    search_index: "359 bulgaria bg 保加利亚",
    support: [ "iMessage" ],
    regular: "^\\+359",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "36",
    country_name: "Hungary",
    short_name: "HU",
    search_index: "36 hungary hu 匈牙利",
    support: [ "iMessage" ],
    regular: "^\\+36",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "370",
    country_name: "Lithuania",
    short_name: "LT",
    search_index: "370 lithuania lt 立陶宛",
    support: [ "iMessage" ],
    regular: "^\\+370",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "371",
    country_name: "Latvia",
    short_name: "LV",
    search_index: "371 latvia lv 拉脱维亚",
    support: [ "iMessage" ],
    regular: "^\\+371",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "372",
    country_name: "Estonia",
    short_name: "EE",
    search_index: "372 estonia ee 爱沙尼亚",
    support: [ "iMessage" ],
    regular: "^\\+372",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "373",
    country_name: "Moldova",
    short_name: "MD",
    search_index: "373 moldova md 摩尔多瓦共和国",
    support: [ "iMessage" ],
    regular: "^\\+373",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "374",
    country_name: "Armenia",
    short_name: "AM",
    search_index: "374 armenia am 亚美尼亚",
    support: [ "iMessage" ],
    regular: "^\\+374",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "375",
    country_name: "Belarus",
    short_name: "BY",
    search_index: "375 belarus by 白俄罗斯",
    support: [ "iMessage" ],
    regular: "^\\+375",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "376",
    country_name: "Andorra",
    short_name: "AD",
    search_index: "376 andorra ad 安道尔",
    support: [ "iMessage" ],
    regular: "^\\+376",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "377",
    country_name: "Monaco",
    short_name: "MC",
    search_index: "377 monaco mc 摩纳哥",
    support: [ "iMessage" ],
    regular: "^\\+377",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "378",
    country_name: "San Marino",
    short_name: "SM",
    search_index: "378 san marino sm 圣马力诺",
    support: [ "iMessage" ],
    regular: "^\\+378",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "379",
    country_name: "Vatican City",
    short_name: "VA",
    search_index: "379 vatican city va 梵蒂冈",
    support: [ "iMessage" ],
    regular: "^\\+379",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "380",
    country_name: "Ukraine",
    short_name: "UA",
    search_index: "380 ukraine ua 乌克兰",
    support: [ "iMessage" ],
    regular: "^\\+380",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "381",
    country_name: "Serbia",
    short_name: "RS",
    search_index: "381 serbia rs 塞尔维亚",
    support: [ "iMessage" ],
    regular: "^\\+381",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "382",
    country_name: "Montenegro",
    short_name: "ME",
    search_index: "382 montenegro me 黑山共和国",
    support: [ "iMessage" ],
    regular: "^\\+382",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "385",
    country_name: "Croatia",
    short_name: "HR",
    search_index: "385 croatia hr 克罗地亚",
    support: [ "iMessage" ],
    regular: "^\\+385",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "386",
    country_name: "Slovenia",
    short_name: "SI",
    search_index: "386 slovenia si 斯洛文尼亚",
    support: [ "iMessage" ],
    regular: "^\\+386",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "387",
    country_name: "Bosnia And Herzegovina",
    short_name: "BA",
    search_index: "387 bosnia and herzegovina ba 波斯尼亚和黑塞哥维那",
    support: [ "iMessage" ],
    regular: "^\\+387",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "389",
    country_name: "The Former Yugoslav Republic of Macedonia",
    short_name: "MK",
    search_index: "389 the former yugoslav republic of macedonia mk 马其顿",
    support: [ "iMessage" ],
    regular: "^\\+389",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "39",
    country_name: "Vatican City",
    short_name: "VA",
    search_index: "39 vatican city va 梵蒂冈",
    support: [ "iMessage" ],
    regular: "^\\+39",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "39",
    country_name: "Italy",
    short_name: "IT",
    search_index: "39 italy it 意大利",
    support: [ "iMessage" ],
    regular: "^\\+39",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "40",
    country_name: "Romania",
    short_name: "RO",
    search_index: "40 romania ro 罗马尼亚",
    support: [ "iMessage" ],
    regular: "^\\+40",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "41",
    country_name: "Switzerland",
    short_name: "CH",
    search_index: "41 switzerland ch 瑞士",
    support: [ "iMessage" ],
    regular: "^\\+41",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "420",
    country_name: "Czech Republic",
    short_name: "CZ",
    search_index: "420 czech republic cz 捷克共和国",
    support: [ "iMessage" ],
    regular: "^\\+420",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "421",
    country_name: "Slovakia",
    short_name: "SK",
    search_index: "421 slovakia sk 斯洛伐克",
    support: [ "iMessage" ],
    regular: "^\\+421",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "423",
    country_name: "Liechtenstein",
    short_name: "LI",
    search_index: "423 liechtenstein li 列支敦士登",
    support: [ "iMessage" ],
    regular: "^\\+423",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "43",
    country_name: "Austria",
    short_name: "AT",
    search_index: "43 austria at 奥地利",
    support: [ "iMessage" ],
    regular: "^\\+43",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "44",
    country_name: "Isle Of Man",
    short_name: "IM",
    search_index: "44 isle of man im 马恩岛",
    support: [ "iMessage" ],
    regular: "^\\+44",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "44",
    country_name: "United Kingdom UK of Great Britain and Northern Ireland",
    short_name: "GB",
    search_index: "44 united kingdom uk of great britain and northern ireland gb 大不列颠及北爱尔兰联合王国",
    support: [ "iMessage" ],
    regular: "^\\+44",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "45",
    country_name: "Denmark",
    short_name: "DK",
    search_index: "45 denmark dk 丹麦",
    support: [ "iMessage", "SMS" ],
    regular: "^\\+45",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "46",
    country_name: "Sweden",
    short_name: "SE",
    search_index: "46 sweden se 瑞典",
    support: [ "iMessage" ],
    regular: "^\\+46",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "47",
    country_name: "Norway",
    short_name: "NO",
    search_index: "47 norway no 挪威",
    support: [ "iMessage" ],
    regular: "^\\+47",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "48",
    country_name: "Poland",
    short_name: "PL",
    search_index: "48 poland pl 波兰",
    support: [ "iMessage" ],
    regular: "^\\+48",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "49",
    country_name: "Germany",
    short_name: "DE",
    search_index: "49 germany de 德国",
    support: [ "iMessage" ],
    regular: "^\\+49",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "500",
    country_name: "Falkland Islands",
    short_name: "FK",
    search_index: "500 falkland islands fk 福克兰群岛",
    support: [ "iMessage" ],
    regular: "^\\+500",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "501",
    country_name: "Belize",
    short_name: "BZ",
    search_index: "501 belize bz 伯利兹",
    support: [ "iMessage" ],
    regular: "^\\+501",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "502",
    country_name: "Guatemala",
    short_name: "GT",
    search_index: "502 guatemala gt 危地马拉",
    support: [ "iMessage" ],
    regular: "^\\+502",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "503",
    country_name: "El Salvador",
    short_name: "SV",
    search_index: "503 el salvador sv 萨尔瓦多",
    support: [ "iMessage" ],
    regular: "^\\+503",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "504",
    country_name: "Honduras",
    short_name: "HN",
    search_index: "504 honduras hn 洪都拉斯",
    support: [ "iMessage" ],
    regular: "^\\+504",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "505",
    country_name: "Nicaragua",
    short_name: "NI",
    search_index: "505 nicaragua ni 尼加拉瓜",
    support: [ "iMessage" ],
    regular: "^\\+505",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "506",
    country_name: "Costa Rica",
    short_name: "CR",
    search_index: "506 costa rica cr 哥斯达黎加共和国",
    support: [ "iMessage" ],
    regular: "^\\+506",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "507",
    country_name: "Panama",
    short_name: "PA",
    search_index: "507 panama pa 巴拿马共和国",
    support: [ "iMessage" ],
    regular: "^\\+507",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "508",
    country_name: "Saint Pierre and Miquelon",
    short_name: "PM",
    search_index: "508 saint pierre and miquelon pm 圣皮埃尔岛和密克隆岛",
    support: [ "iMessage" ],
    regular: "^\\+508",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "509",
    country_name: "Haiti",
    short_name: "HT",
    search_index: "509 haiti ht 海地",
    support: [ "iMessage" ],
    regular: "^\\+509",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "51",
    country_name: "Peru",
    short_name: "PE",
    search_index: "51 peru pe 秘鲁",
    support: [ "iMessage" ],
    regular: "^\\+51",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "52",
    country_name: "Mexico",
    short_name: "MX",
    search_index: "52 mexico mx 墨西哥",
    support: [ "iMessage" ],
    regular: "^\\+52",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "53",
    country_name: "Cuba",
    short_name: "CU",
    search_index: "53 cuba cu 古巴",
    support: [ "iMessage" ],
    regular: "^\\+53",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "54",
    country_name: "Argentine Republic",
    short_name: "AR",
    search_index: "54 argentine republic ar 阿根廷",
    support: [ "iMessage" ],
    regular: "^\\+54",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "55",
    country_name: "Brazil",
    short_name: "BR",
    search_index: "55 brazil br 巴西",
    support: [ "iMessage" ],
    regular: "^\\+55",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "56",
    country_name: "Chile",
    short_name: "CL",
    search_index: "56 chile cl 智利",
    support: [ "iMessage" ],
    regular: "^\\+56",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "57",
    country_name: "Colombia",
    short_name: "CO",
    search_index: "57 colombia co 哥伦比亚",
    support: [ "iMessage" ],
    regular: "^\\+57",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "58",
    country_name: "Venezuela",
    short_name: "VE",
    search_index: "58 venezuela ve 委内瑞拉玻利瓦尔共和国",
    support: [ "iMessage" ],
    regular: "^\\+58",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "590",
    country_name: "Guadeloupe",
    short_name: "GP",
    search_index: "590 guadeloupe gp 法属瓜德罗普省",
    support: [ "iMessage" ],
    regular: "^\\+590",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "590",
    country_name: "Saint Barthélemy",
    short_name: "BL",
    search_index: "590 saint barthélemy bl 圣巴泰勒米",
    support: [ "iMessage" ],
    regular: "^\\+590",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "591",
    country_name: "Bolivia",
    short_name: "BO",
    search_index: "591 bolivia bo 玻利维亚共和国",
    support: [ "iMessage" ],
    regular: "^\\+591",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "592",
    country_name: "Guyana",
    short_name: "GY",
    search_index: "592 guyana gy 英属圭亚那",
    support: [ "iMessage" ],
    regular: "^\\+592",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "593",
    country_name: "Ecuador",
    short_name: "EC",
    search_index: "593 ecuador ec 厄瓜多尔",
    support: [ "iMessage" ],
    regular: "^\\+593",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "594",
    country_name: "French Guiana",
    short_name: "GF",
    search_index: "594 french guiana gf 法属圭亚那",
    support: [ "iMessage" ],
    regular: "^\\+594",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "595",
    country_name: "Paraguay",
    short_name: "PY",
    search_index: "595 paraguay py 巴拉圭共和国",
    support: [ "iMessage" ],
    regular: "^\\+595",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "597",
    country_name: "Suriname",
    short_name: "SR",
    search_index: "597 suriname sr 苏里南",
    support: [ "iMessage" ],
    regular: "^\\+597",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "598",
    country_name: "Uruguay",
    short_name: "UY",
    search_index: "598 uruguay uy 乌拉圭",
    support: [ "iMessage" ],
    regular: "^\\+598",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "599",
    country_name: "Curaçao",
    short_name: "CW",
    search_index: "599 curaçao cw 库拉索",
    support: [ "iMessage" ],
    regular: "^\\+599",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "599",
    country_name: "Netherlands Antilles",
    short_name: "AN",
    search_index: "599 netherlands antilles an 安的列斯岛",
    support: [ "iMessage" ],
    regular: "^\\+599",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "60",
    country_name: "Malaysia",
    short_name: "MY",
    search_index: "60 malaysia my 马来西亚",
    support: [ "iMessage" ],
    regular: "^\\+60",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "61",
    country_name: "Australia",
    short_name: "AU",
    search_index: "61 australia au 澳大利亚",
    support: [ "iMessage" ],
    regular: "^\\+61",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "61",
    country_name: "Christmas Island",
    short_name: "CX",
    search_index: "61 christmas island cx 圣诞岛",
    support: [ "iMessage" ],
    regular: "^\\+61",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "61",
    country_name: "Cocos Islands",
    short_name: "CC",
    search_index: "61 cocos islands cc 科科斯（基林）群岛",
    support: [ "iMessage" ],
    regular: "^\\+61",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "62",
    country_name: "Indonesia",
    short_name: "ID",
    search_index: "62 indonesia id 印度尼西亚",
    support: [ "iMessage" ],
    regular: "^\\+62",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "63",
    country_name: "Philippines",
    short_name: "PH",
    search_index: "63 philippines ph 菲律宾",
    support: [ "iMessage" ],
    regular: "^\\+63",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "64",
    country_name: "Pitcairn Islands",
    short_name: "PN",
    search_index: "64 pitcairn islands pn 皮特凯恩岛",
    support: [ "iMessage" ],
    regular: "^\\+64",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "64",
    country_name: "New Zealand",
    short_name: "NZ",
    search_index: "64 new zealand nz 新西兰",
    support: [ "iMessage" ],
    regular: "^\\+64",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "65",
    country_name: "Singapore",
    short_name: "SG",
    search_index: "65 singapore sg 新加坡",
    support: [ "iMessage" ],
    regular: "^\\+65",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "66",
    country_name: "Thailand",
    short_name: "TH",
    search_index: "66 thailand th 泰国",
    support: [ "iMessage" ],
    regular: "^\\+66",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "670",
    country_name: "East Timor",
    short_name: "TL",
    search_index: "670 east timor tl 帝汶岛",
    support: [ "iMessage" ],
    regular: "^\\+670",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "672",
    country_name: "Antarctica",
    short_name: "AQ",
    search_index: "672 antarctica aq 南极洲",
    support: [ "iMessage" ],
    regular: "^\\+672",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "672",
    country_name: "Norfolk Island",
    short_name: "NF",
    search_index: "672 norfolk island nf 诺福克岛",
    support: [ "iMessage" ],
    regular: "^\\+672",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "673",
    country_name: "Brunei Darussalam",
    short_name: "BN",
    search_index: "673 brunei darussalam bn 文莱达鲁萨兰国",
    support: [ "iMessage" ],
    regular: "^\\+673",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "674",
    country_name: "Nauru",
    short_name: "NR",
    search_index: "674 nauru nr 瑙鲁",
    support: [ "iMessage" ],
    regular: "^\\+674",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "675",
    country_name: "Papua New Guinea",
    short_name: "PG",
    search_index: "675 papua new guinea pg 巴布亚新几内亚",
    support: [ "iMessage" ],
    regular: "^\\+675",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "676",
    country_name: "Tonga",
    short_name: "TO",
    search_index: "676 tonga to 汤加",
    support: [ "iMessage" ],
    regular: "^\\+676",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "677",
    country_name: "Solomon Islands",
    short_name: "SB",
    search_index: "677 solomon islands sb 所罗门群岛",
    support: [ "iMessage" ],
    regular: "^\\+677",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "678",
    country_name: "Vanuatu",
    short_name: "VU",
    search_index: "678 vanuatu vu 瓦努阿图",
    support: [ "iMessage" ],
    regular: "^\\+678",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "679",
    country_name: "Fiji",
    short_name: "FJ",
    search_index: "679 fiji fj 斐济",
    support: [ "iMessage" ],
    regular: "^\\+679",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "680",
    country_name: "Palau",
    short_name: "PW",
    search_index: "680 palau pw 帕劳",
    support: [ "iMessage" ],
    regular: "^\\+680",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "681",
    country_name: "Wallis and Futuna",
    short_name: "WF",
    search_index: "681 wallis and futuna wf 瓦利斯群岛和富图纳群岛",
    support: [ "iMessage" ],
    regular: "^\\+681",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "682",
    country_name: "Cook Islands",
    short_name: "CK",
    search_index: "682 cook islands ck 库克群岛",
    support: [ "iMessage" ],
    regular: "^\\+682",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "683",
    country_name: "Niue",
    short_name: "NU",
    search_index: "683 niue nu 纽埃岛",
    support: [ "iMessage" ],
    regular: "^\\+683",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "685",
    country_name: "Samoa",
    short_name: "AS",
    search_index: "685 samoa as 美属萨摩亚领地",
    support: [ "iMessage" ],
    regular: "^\\+685",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "686",
    country_name: "Kiribati",
    short_name: "KI",
    search_index: "686 kiribati ki 基里巴斯",
    support: [ "iMessage" ],
    regular: "^\\+686",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "687",
    country_name: "New Caledonia",
    short_name: "NC",
    search_index: "687 new caledonia nc 新喀里多尼亚",
    support: [ "iMessage" ],
    regular: "^\\+687",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "688",
    country_name: "Tuvalu",
    short_name: "TV",
    search_index: "688 tuvalu tv 图瓦卢",
    support: [ "iMessage" ],
    regular: "^\\+688",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "689",
    country_name: "French Polynesia",
    short_name: "PF",
    search_index: "689 french polynesia pf 法属玻利尼西亚",
    support: [ "iMessage" ],
    regular: "^\\+689",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "690",
    country_name: "Tokelau",
    short_name: "TK",
    search_index: "690 tokelau tk 托克劳",
    support: [ "iMessage" ],
    regular: "^\\+690",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "691",
    country_name: "Micronesia",
    short_name: "FM",
    search_index: "691 micronesia fm 密克罗尼西亚",
    support: [ "iMessage" ],
    regular: "^\\+691",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "692",
    country_name: "Marshall Islands",
    short_name: "MH",
    search_index: "692 marshall islands mh 马绍尔群岛",
    support: [ "iMessage" ],
    regular: "^\\+692",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "7",
    country_name: "Russian Federation",
    short_name: "RU",
    search_index: "7 russian federation ru 俄罗斯联邦",
    support: [ "iMessage", "SMS" ],
    regular: "^\\+7",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "7",
    country_name: "Kazakhstan",
    short_name: "KZ",
    search_index: "7 kazakhstan kz 哈萨克斯坦",
    support: [ "iMessage", "SMS" ],
    regular: "^\\+7",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "81",
    country_name: "Japan",
    short_name: "JP",
    search_index: "81 japan jp 日本",
    support: [ "iMessage" ],
    regular: "^\\+81",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "82",
    country_name: "Korea",
    short_name: "KR",
    search_index: "82 korea kr 韩国",
    support: [ "iMessage" ],
    regular: "^\\+82",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "84",
    country_name: "Vietnam",
    short_name: "VN",
    search_index: "84 vietnam vn 越南",
    support: [ "iMessage" ],
    regular: "^\\+84",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "850",
    country_name: "Democratic People's Republic of Korea",
    short_name: "KP",
    search_index: "850 democratic people's republic of korea kp 朝鲜",
    support: [ "iMessage" ],
    regular: "^\\+850",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "852",
    country_name: "Hong Kong, China",
    short_name: "HK",
    search_index: "852 hong kong, china hk 香港（中国）",
    support: [ "iMessage", "SMS" ],
    regular: "^\\+852",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "853",
    country_name: "Macao, China",
    short_name: "MO",
    search_index: "853 macao, china mo 澳门（中国）",
    support: [ "iMessage" ],
    regular: "^\\+853",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "855",
    country_name: "Cambodia",
    short_name: "KH",
    search_index: "855 cambodia kh 柬埔寨",
    support: [ "iMessage" ],
    regular: "^\\+855",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "856",
    country_name: "Lao People's Democratic Republic",
    short_name: "LA",
    search_index: "856 lao people's democratic republic la 老挝人民民主共和国",
    support: [ "iMessage" ],
    regular: "^\\+856",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "880",
    country_name: "Bangladesh",
    short_name: "BD",
    search_index: "880 bangladesh bd 孟加拉共和国",
    support: [ "iMessage" ],
    regular: "^\\+880",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "886",
    country_name: "Taiwan, China",
    short_name: "TW",
    search_index: "886 taiwan, china tw 台湾（中国）",
    support: [ "iMessage", "SMS" ],
    regular: "^\\+886",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "90",
    country_name: "Turkey",
    short_name: "TR",
    search_index: "90 turkey tr 土耳其",
    support: [ "iMessage" ],
    regular: "^\\+90",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "91",
    country_name: "India",
    short_name: "IN",
    search_index: "91 india in 印度",
    support: [ "iMessage" ],
    regular: "^\\+91",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "92",
    country_name: "Pakistan",
    short_name: "PK",
    search_index: "92 pakistan pk 巴基斯坦",
    support: [ "iMessage" ],
    regular: "^\\+92",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "93",
    country_name: "Afghanistan",
    short_name: "AF",
    search_index: "93 afghanistan af 阿富汗",
    support: [ "iMessage" ],
    regular: "^\\+93",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "94",
    country_name: "Sri Lanka",
    short_name: "LK",
    search_index: "94 sri lanka lk 斯里兰卡",
    support: [ "iMessage" ],
    regular: "^\\+94",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "95",
    country_name: "Myanmar",
    short_name: "MM",
    search_index: "95 myanmar mm 缅甸",
    support: [ "iMessage" ],
    regular: "^\\+95",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "960",
    country_name: "Maldives",
    short_name: "MV",
    search_index: "960 maldives mv 马尔代夫",
    support: [ "iMessage" ],
    regular: "^\\+960",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "961",
    country_name: "Lebanon",
    short_name: "LB",
    search_index: "961 lebanon lb 黎巴嫩",
    support: [ "iMessage" ],
    regular: "^\\+961",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "962",
    country_name: "Jordan",
    short_name: "JO",
    search_index: "962 jordan jo 约旦",
    support: [ "iMessage" ],
    regular: "^\\+962",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "963",
    country_name: "Syria",
    short_name: "SY",
    search_index: "963 syria sy 阿拉伯叙利亚共和国",
    support: [ "iMessage" ],
    regular: "^\\+963",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "964",
    country_name: "Iraq",
    short_name: "IQ",
    search_index: "964 iraq iq 伊拉克",
    support: [ "iMessage" ],
    regular: "^\\+964",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "965",
    country_name: "Kuwait",
    short_name: "KW",
    search_index: "965 kuwait kw 科威特",
    support: [ "iMessage" ],
    regular: "^\\+965",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "966",
    country_name: "Saudi Arabia",
    short_name: "SA",
    search_index: "966 saudi arabia sa 沙特阿拉伯王国",
    support: [ "iMessage" ],
    regular: "^\\+966",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "967",
    country_name: "Yemen",
    short_name: "YE",
    search_index: "967 yemen ye 也门",
    support: [ "iMessage" ],
    regular: "^\\+967",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "968",
    country_name: "Oman",
    short_name: "OM",
    search_index: "968 oman om 阿曼",
    support: [ "iMessage" ],
    regular: "^\\+968",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "971",
    country_name: "United Arab Emirates",
    short_name: "AE",
    search_index: "971 united arab emirates ae 阿拉伯联合酋长国",
    support: [ "iMessage" ],
    regular: "^\\+971",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "972",
    country_name: "Israel",
    short_name: "IL",
    search_index: "972 israel il 以色列",
    support: [ "iMessage" ],
    regular: "^\\+972",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "973",
    country_name: "Bahrain",
    short_name: "BH",
    search_index: "973 bahrain bh 巴林",
    support: [ "iMessage" ],
    regular: "^\\+973",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "974",
    country_name: "Qatar",
    short_name: "QA",
    search_index: "974 qatar qa 卡塔尔",
    support: [ "iMessage" ],
    regular: "^\\+974",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "975",
    country_name: "Bhutan",
    short_name: "BT",
    search_index: "975 bhutan bt 不丹",
    support: [ "iMessage" ],
    regular: "^\\+975",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "976",
    country_name: "Mongolia",
    short_name: "MN",
    search_index: "976 mongolia mn 蒙古",
    support: [ "iMessage" ],
    regular: "^\\+976",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "977",
    country_name: "Nepal",
    short_name: "NP",
    search_index: "977 nepal np 尼泊尔",
    support: [ "iMessage" ],
    regular: "^\\+977",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "98",
    country_name: "Iran",
    short_name: "IR",
    search_index: "98 iran ir 伊朗伊斯兰共和国",
    support: [ "iMessage" ],
    regular: "^\\+98",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "992",
    country_name: "Tajikistan",
    short_name: "TJ",
    search_index: "992 tajikistan tj 塔吉克斯坦",
    support: [ "iMessage" ],
    regular: "^\\+992",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "993",
    country_name: "Turkmenistan",
    short_name: "TM",
    search_index: "993 turkmenistan tm 土库曼斯坦",
    support: [ "iMessage" ],
    regular: "^\\+993",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "994",
    country_name: "Azerbaijani Republic",
    short_name: "AZ",
    search_index: "994 azerbaijani republic az 阿塞拜疆",
    support: [ "iMessage" ],
    regular: "^\\+994",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "995",
    country_name: "Georgia",
    short_name: "GE",
    search_index: "995 georgia ge 格鲁吉亚",
    support: [ "iMessage" ],
    regular: "^\\+995",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "996",
    country_name: "Kyrgyzstan",
    short_name: "KG",
    search_index: "996 kyrgyzstan kg 吉尔吉斯斯坦",
    support: [ "iMessage" ],
    regular: "^\\+996",
    format_long: 0,
    format_reg: null,
    format_str: ""
  }, {
    country_code: "998",
    country_name: "Uzbekistan",
    short_name: "UZ",
    search_index: "998 uzbekistan uz 乌兹别克斯坦",
    support: [ "iMessage" ],
    regular: "^\\+998",
    format_long: 0,
    format_reg: null,
    format_str: ""
  } ];
}), define("phonepanel", function(e) {
  "use strict";
  var t = e("jquery"), i = e("api"), n = "", r = 0, a = "", s = "", o = e("countrycodes"), l = e("panel"), c = function(e, i) {
    o[e] !== void 0 && (r = e, i || t("#phone-panel .countrycode").val("+" + o[r].country_code), 
    t(".tips-area .ta-countrycode").html(o[r].short_name), d(), u());
  }, d = function() {
    o[r].format_long && o[r].format_reg && o[r].format_str && n.length === o[r].format_long ? t("#phone-panel .phonenumber").val(n.replace(o[r].format_reg, o[r].format_str)) : t("#phone-panel .phonenumber").val(n);
  }, u = function() {
    p(), t("#phone-panel .countrycode").val() && t("#phone-panel .name").val() && n ? t("#phone-panel .add").prop("disabled", !1) : t("#phone-panel .add").prop("disabled", !0);
  }, h = function(e, t) {
    return e.replace(t ? /&/g : /&(?!#?\w+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }, p = function() {
    var e = "+" + o[r].country_code + n;
    e !== a && (i.request("getIdentity", {
      type: "POST",
      data: {
        identities: JSON.stringify([ {
          provider: "phone",
          external_username: e
        } ])
      }
    }, function(e) {
      e && e.identities && e.identities.length && e.identities[0].connected_user_id > 0 ? (s = e.identities[0].avatar_filename, 
      t("#phone-panel .identity-avatar").attr("src", s).show(), t("#phone-panel .identity-name").html(h(e.identities[0].name)).show(), 
      t("#phone-panel .name").val(e.identities[0].name).hide(), t("#phone-panel .add").prop("disabled", !1)) : (s = "", 
      t("#phone-panel .identity-avatar").hide(), t("#phone-panel .identity-name").hide(), 
      t("#phone-panel .name").val("").show(), t("#phone-panel .add").prop("disabled", !0));
    }), a = e);
  }, f = l.extend({
    options: {
      template: '<div class="panel phone-panel" tabindex="-1" data-widget="panel" id="phone-panel"><div class="panel-body"><div class="main-info">Please complete contact info:</div><div class="clearfix input-area"><input class="countrycode" tabindex="4" type="text" /><input class="phonenumber" tabindex="5" type="text" /></div><div class="tips-area"><div class="ta-countrycode"></div><div class="ta-phonenumber">Area code and local number</div></div><ol class="clearfix complete-list"></ol><div class="name-area"><input class="name" type="text" tabindex="2" placeholder="Enter contact name" /><img class="identity-avatar"/><div class="identity-name"></div><button class="xbtn-blue add" tabindex="3" disabled="disabled">Add</button></div></div></div>',
      parentNode: null,
      srcNode: null
    },
    init: function() {
      var e, i = this;
      this.render(), e = this.element;
      for (var n = 0; o.length > n; n++) o[n].regular = RegExp(o[n].regular), o[n].format_reg = o[n].format_reg ? RegExp(o[n].format_reg) : "", 
      "US" === o[n].short_name && (r = n);
      this.listen(), t(document.body).on("click.phonepanel", function(e) {
        var n = t("#phone-panel");
        return n.length && n[0] !== e.target && !t.contains(n[0], e.target) ? (t(document.body).off("click.phonepanel"), 
        i.hide(), void 0) : void 0;
      });
    },
    listen: function() {
      var e = this, i = this.element;
      i.on("keyup.phonepanel", ".countrycode", function(e) {
        var n = function(e) {
          return '<li country-code="' + e + '">' + '<div class="li-countrycode">+' + o[e].country_code + "</div>" + '<div class="li-countryname">' + o[e].country_name + "</div>" + '<div class="li-tips">' + o[e].support.join(" and ") + " supported</div>" + "</li>";
        };
        switch (e.keyCode) {
         case 38:
         case 40:
          return;

         case 13:
          var r = t(".complete-list li.selected"), a = ~~r.attr("country-code");
          return c(a), i.find(".tips-area").show(), i.find(".complete-list").slideUp(), void 0;
        }
        var s = "", l = -1, d = t(this).val().toLowerCase();
        if (d) if (/^\+[0-9]*/.test(d)) for (var u = 0; o.length > u; u++) "+" + o[u].country_code === d ? (s = n(u) + s, 
        l = u) : -1 !== ("+" + o[u].search_index).indexOf(d) && (s += n(u), l = -1 === l ? u : l); else for (u = 0; o.length > u; u++) o[u].country_code === d ? (s = n(u) + s, 
        l = u) : -1 !== o[u].search_index.indexOf(d) && (s += n(u), l = -1 === l ? u : l);
        i.find(".complete-list").html(s), s ? (i.find(".tips-area").hide(), i.find(".complete-list").slideDown(), 
        i.find(".complete-list li").eq(0).toggleClass("selected", !0), c(l, !0)) : (i.find(".tips-area").show(), 
        i.find(".complete-list").slideUp());
      }), i.on("keydown.phonepanel", ".countrycode", function(e) {
        if (i.find(".complete-list").html()) {
          var t = i.find(".complete-list li.selected"), n = i.find(".complete-list"), r = ~~t.index(), a = 44, s = 3 * a, o = i.find(".complete-list li").length - 1, l = n.scrollTop();
          switch (e.keyCode) {
           case 38:
            event.preventDefault(), 0 > --r && (r = o);
            break;

           case 40:
            event.preventDefault(), ++r > o && (r = 0);
          }
          t.toggleClass("selected", !1), i.find(".complete-list li").eq(r).toggleClass("selected", !0);
          var c = r * a, d = c - l;
          0 > d ? n.scrollTop(c) : d + a > s && n.scrollTop(c + a - s + 1);
        }
      }), i.on("blur.phonepanel", ".countrycode", function() {
        c(r);
      }), i.on("focus.phonepanel", ".countrycode", function() {
        t(this).css("z-index", "1"), i.find(".phonenumber").css("z-index", "0");
      }), i.on("focus.phonepanel", ".phonenumber", function() {
        i.find(".phonenumber").val(n), i.find(".complete-list").html(""), i.find(".tips-area").show(), 
        i.find(".complete-list").slideUp(), t(this).prop("tabindex", "1"), t(this).css("z-index", "1"), 
        i.find(".countrycode").css("z-index", "0");
      }), i.on("blur.phonepanel", ".phonenumber", function() {
        var e = i.find(".phonenumber").val().replace(/\-|\(|\)|\ /g, "");
        n = /^[0-9]*$/.test(e) ? e : "", d(), u(), t(this).prop("tabindex", "5");
      }), i.on("mouseover.phonepanel", ".complete-list li", function() {
        t(this).siblings().filter(".selected").toggleClass("selected", !1), t(this).toggleClass("selected", !0);
      }), i.on("click.phonepanel", ".complete-list li", function() {
        var e = t(this), n = ~~e.attr("country-code");
        c(n), i.find(".tips-area").show(), i.find(".complete-list").slideUp();
      }), i.on("keyup.phonepanel", ".name", function() {
        i.find(".complete-list").html(""), i.find(".tips-area").show(), i.find(".complete-list").slideUp();
      }), i.on("keydown.phonepanel", ".name", function(a) {
        if (t(this).val() && 13 === a.keyCode) {
          var l = "+" + o[r].country_code + n, c = i.find(".name").val();
          e.add({
            provider: "phone",
            external_id: l,
            external_username: l,
            name: c,
            avatar_filename: s ? s : ExfeeWidget.api_url + "/avatar/default?name=" + c
          }), e.hide();
        }
        u();
      }), i.on("click.phonepanel", ".add", function() {
        var t = "+" + o[r].country_code + n, a = i.find(".name").val();
        e.add({
          provider: "phone",
          external_id: t,
          external_username: t,
          name: a,
          avatar_filename: s ? s : ExfeeWidget.api_url + "/avatar/default?name=" + a
        }), e.hide();
      });
    },
    save: function() {
      this.$(".place-submit").trigger("click.mappanel");
    },
    showAfter: function() {
      var e = this, i = e.srcNode;
      if (a = "", i) {
        var s = i.offset(), l = e.element, d = i.outerHeight();
        l.css({
          left: this.oleft = s.left,
          top: this.otop = s.top + d
        }), t("#phone-panel .identity-avatar").hide(), t("#phone-panel .identity-name").hide(), 
        n = i.val().replace(/\-|\(|\)|\ /g, "");
        var u = r;
        if (/^\+.*$/.test(n)) for (var h = 0; o.length > h; h++) if (o[h].regular.test(n)) {
          n = n.replace(o[h].regular, ""), u = h;
          break;
        }
        c(u), l.find(".name").focus();
      }
    },
    destory: function() {
      this.element.off(), this.element.remove(), this._destory();
    }
  });
  return f;
}), define("uploader", function(e, t) {
  function i(e, t) {
    if (window.URL && window.URL.revokeObjectURL) e.src = window.URL.createObjectURL(t); else if (window.webkitURL && window.webkitURL.createObjectURL) e.src = window.webkitURL.createObjectURL(t); else {
      var i = new FileReader();
      i.onload = function(t) {
        e.src = t.target.result;
      }, i.readAsDataURL(t);
    }
  }
  function n(e) {
    var t;
    t = e.split(",")[0].indexOf("base64") >= 0 ? atob(e.split(",")[1]) : decodeURIComponent(e.split(",")[1]);
    for (var i = e.split(",")[0].split(":")[1].split(";")[0], n = new ArrayBuffer(t.length), r = new Uint8Array(n), a = 0, s = t.length; s > a; ++a) r[a] = t.charCodeAt(a);
    var o, l = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
    if (l) {
      var c = new l();
      c.append(n), o = c.getBlob(i);
    } else o = new Blob([ n ], {
      type: i
    });
    return o;
  }
  function r(e, t) {
    if (e.mozGetAsFile) return e.mozGetAsFile(t, "image/png");
    var i = e.toDataURL("image/png"), r = n(i);
    return r;
  }
  function a(e, t) {
    var i = r(e, t);
    return i;
  }
  function s(e) {
    this.originalImage = e, this.width = e.width, this.height = e.height, this.regX = e.width / 2, 
    this.regY = e.height / 2, this.x = 0, this.y = 0, this.alpha = 1, this.visible = !0, 
    this.rotation = 0, this.scaleX = 1, this.scaleY = 1;
  }
  function o(e) {
    this.id = ++o.UID, this.canvas = e instanceof HTMLCanvasElement ? e : document.getElementById(e);
  }
  function l(e) {
    return function(t) {
      if (t > e) return 0;
      if (t *= Math.PI, 1e-16 > Math.abs(t)) return 1;
      var i = t / e;
      return Math.sin(t) * Math.sin(i) / t / i;
    };
  }
  function c(e, t, i, n, r) {
    this.canvas = e, e.width = t.width, e.height = t.height, e.style.display = "none", 
    this.ctx = e.getContext("2d"), this.ctx.drawImage(t, 0, 0), this.img = t, this.ocan = i, 
    this.src = this.ctx.getImageData(0, 0, t.width, t.height), this.dest = {
      width: n,
      height: Math.round(t.height * n / t.width)
    }, this.dest.data = Array(3 * this.dest.width * this.dest.height), this.lanczos = l(r), 
    this.ratio = t.width / n, this.rcp_ratio = 2 / this.ratio, this.range2 = Math.ceil(this.ratio * r / 2), 
    this.cacheLanc = {}, this.center = {}, this.icenter = {};
    var a = this;
    setTimeout(function() {
      a.process1(a, 0);
    }, 0);
  }
  function d() {
    h(document).off("mousemove.photozone").off("mouseup.photozone");
  }
  function u(e) {
    h(document).on("mousemove.photozone", function(t) {
      function i(e) {
        0 === _ ? (c.scaleY = y + e, 0 > c.scaleY && (c.scaleY = x / g.height), c.y -= c.scaleY * g.height - c.height) : 1 === _ ? (c.scaleX = v + e, 
        0 > c.scaleX && (c.scaleX = x / g.width), c.x -= c.scaleX * g.width - c.width) : 2 === _ ? (c.scaleY = y + e, 
        0 > c.scaleY && (c.scaleY = x / g.height)) : (c.scaleX = v + e, 0 > c.scaleX && (c.scaleX = x / g.width));
      }
      function n(e) {
        0 === _ ? (c.scaleX = v + e, 0 > c.scaleX && (c.scaleX = x / g.width), c.x -= c.scaleX * g.width - c.width) : 1 === _ ? (c.scaleY = y + e, 
        0 > c.scaleY && (c.scaleY = x / g.height)) : 2 === _ ? (c.scaleX = v + e, 0 > c.scaleX && (c.scaleX = x / g.width)) : (c.scaleY = y + e, 
        0 > c.scaleY && (c.scaleY = x / g.height), c.y -= c.scaleY * g.height - c.height);
      }
      function r(e) {
        0 === _ ? (c.scaleX = v + e, 0 > c.scaleX && (c.scaleX = x / g.width)) : 1 === _ ? (c.scaleY = y + e, 
        0 > c.scaleY && (c.scaleY = x / g.height), c.y -= c.scaleY * g.height - c.height) : 2 === _ ? (c.scaleX = v + e, 
        0 > c.scaleX && (c.scaleX = x / g.width), c.x -= c.scaleX * g.width - c.width) : (c.scaleY = y + e, 
        0 > c.scaleY && (c.scaleY = x / g.height));
      }
      function a(e) {
        0 === _ ? (c.scaleY = y + e, 0 > c.scaleY && (c.scaleY = x / g.height)) : 1 === _ ? (c.scaleX = v + e, 
        0 > c.scaleY && (c.scaleY = x / g.height)) : 2 === _ ? (c.scaleY = y + e, 0 > c.scaleY && (c.scaleY = x / g.height), 
        c.y -= c.scaleY * g.height - c.height) : (c.scaleX = v + e, 0 > c.scaleX && (c.scaleX = x / g.width), 
        c.x -= c.scaleX * g.width - c.width);
      }
      t.preventDefault();
      var s = e;
      if (s && s.dragging) {
        var o = t.pageX - s.offset[0], l = t.pageY - s.offset[1], c = s.bitmap;
        switch (s.ri) {
         case 0:
          c.x += o, c.y += l;
          break;

         case 1:
          c.x += l, c.y -= o;
          break;

         case 2:
          c.x -= o, c.y -= l;
          break;

         case 3:
          c.x -= l, c.y += o;
        }
        return s.offset[0] = t.pageX, s.offset[1] = t.pageY, s.stage.update(), s.bitmap80.updateImage(s.stage.canvas), 
        s.stage80.update(), !1;
      }
      if (s && s.resizing) {
        var d, u, h, p, o = t.pageX - s.aoffset[0], l = t.pageY - s.aoffset[1], f = s.stage.canvas.width, m = s.stage.canvas.height, c = s.bitmap, g = c.originalImage, v = s.psx, y = s.psy, _ = s.ri, b = s.aoffset, x = s.sss, w = s._canvasOffset;
        if (o || l) {
          switch (s.anchor) {
           case 0:
            var k = Math.sqrt(Math.pow(t.pageX - f - w.left, 2) + Math.pow(t.pageY - w.top - m, 2)), C = Math.sqrt(Math.pow(f, 2) + Math.pow(m, 2));
            k -= s.dr, i(k / C * x), n(k / C * x);
            break;

           case 1:
            u = b[1] - t.pageY, p = u / m, i(p * x), n(p * x);
            break;

           case 2:
            var k = Math.sqrt(Math.pow(t.pageX - w.left, 2) + Math.pow(t.pageY - w.top - m, 2)), C = Math.sqrt(Math.pow(f, 2) + Math.pow(m, 2));
            k -= s.dr, i(k / C * x), r(k / C * x);
            break;

           case 3:
            d = b[0] - t.pageX, h = d / f, n(h * x), i(h * x);
            break;

           case 4:
            d = t.pageX - b[0], h = d / f, r(h * x), a(h * x);
            break;

           case 5:
            var k = Math.sqrt(Math.pow(t.pageX - f - w.left, 2) + Math.pow(t.pageY - w.top, 2)), C = Math.sqrt(Math.pow(f, 2) + Math.pow(m, 2));
            k -= s.dr, n(k / C * x), a(k / C * x);
            break;

           case 6:
            u = t.pageY - b[1], p = u / m, r(p * x), a(p * x);
            break;

           case 7:
            var k = Math.sqrt(Math.pow(t.pageX - w.left, 2) + Math.pow(t.pageY - w.top, 2)), C = Math.sqrt(Math.pow(f, 2) + Math.pow(m, 2));
            k -= s.dr, r(k / C * x), a(k / C * x);
          }
          s.stage.update(), s.bitmap80.updateImage(s.stage.canvas), s.stage80.update();
        }
        return !1;
      }
    }).on("mouseup.photozone", function() {
      if (e) {
        if (e.resizing || e.dragging) {
          var t = document.createElement("img");
          t.onload = function() {
            new c(document.getElementById("real-avatar80"), this, e.stage80.canvas, 80, 3);
          }, t.src = e.stage.canvas.toDataURL("image/png");
        }
        e.resizing = !1, e.dragging = !1, e.anchor = null, e.bitmap && (e.psx = e.bitmap.scaleX, 
        e.psy = e.bitmap.scaleY);
      }
    });
  }
  var h = e("jquery"), p = (e("api"), e("store")), f = window._ENV_.api_url, m = e("dialog"), g = e("filehtml5"), v = m.extend({
    _fileInputField: null,
    _buttonBinding: null,
    queue: null,
    init: function() {
      this._fileInputField = null, this.queue = null, this._buttonBinding = null, this._fileList = [];
    },
    sync: function() {
      var e = this.$(".dropbox");
      this._fileInputField = h(v.HTML5FILEFIELD_TEMPLATE), e.after(this._fileInputField), 
      this._bindDropArea(), this._fileInputField.on("change", h.proxy(this._updateFileList, this));
    },
    _bindSelectFile: function() {
      var e = this._fileInputField[0];
      e.click && e.click();
    },
    _bindDropArea: function(e) {
      var t = e || {
        prevVal: null
      };
      null !== t.prevVal && (t.prevVal.detach("drop", this._ddEventhandler), t.prevVal.detach("dragenter", this._ddEventhandler), 
      t.prevVal.detach("dragover", this._ddEventhandler), t.prevVal.detach("dragleave", this._ddEventhandler));
      var i = h.proxy(this._ddEventhandler, this);
      this.element.on("drop", ".modal-main", i), this.element.on("dragenter", ".modal-main", i), 
      this.element.on("dragover", ".modal-main", i), this.element.on("dragleave", ".modal-main", i);
    },
    _ddEventhandler: function(e) {
      switch (e.stopPropagation(), e.preventDefault(), e.type) {
       case "dragenter":
        this.emit("dragenter", e);
        break;

       case "dragover":
        this.emit("dragover", e);
        break;

       case "dragleave":
        this.emit("dragleave", e);
        break;

       case "drop":
        var t = this.$(".modal-main")[0];
        if (!h.contains(t, e.target) && e.target !== t) return !1;
        this._fileselect(e.originalEvent.dataTransfer.files), this.emit("drop", e);
      }
      return !1;
    },
    _fileselect: function(e) {
      for (var t = e, i = [], n = (this.fileFilterFunction, 0), r = t.length; r > n; n++) i.push(new g(t[n]));
      this.options.limit && (i = i.slice(-this.options.limit)), i.length > 0 && this.emit("fileselect", {
        fileList: i
      });
    },
    _updateFileList: function(e) {
      this._fileselect(e.target.files);
    },
    fileFilterFunction: function(e) {
      var t = !1;
      return /^image\/(png|gif|bmp|jpg|jpeg)$/.test(e._type) && (t = !0), t;
    }
  }, {
    HTML5FILEFIELD_TEMPLATE: '<input type="file" style="visibility:hidden; width:0px; height:0px;" />'
  }), y = {
    errors: {
      server: "Failed to open, please try again.",
      format: "File format not supported.",
      size: "File is too large."
    },
    checkFile: function(e) {
      return this.checkFileFormat(e) ? !1 : this.checkFileSize(e) ? !1 : !0;
    },
    checkFileSize: function(e) {
      var t = 3145728, i = !1;
      return this.emit("toggleError", i = e._size > t, "size"), i;
    },
    checkFileFormat: function(e) {
      var t = !this.fileFilterFunction(e);
      return this.emit("toggleError", t, "format"), t;
    },
    sss: 1,
    aoffset: [ 0, 0 ],
    psx: 1,
    psy: 1,
    anchor: null,
    resizing: !1,
    dragging: !1,
    SCALE: 80 / 240,
    ri: 0,
    R: [ 0, 0 ],
    filehtml5Bind: function() {
      var e = this;
      this.filehtml5._xhrHeaders = {
        Accept: "application/json, text/javascript, */*; q=0.01"
      }, this.filehtml5.on("uploadcomplete", function(t) {
        var i = !0;
        e.$(".loading").addClass("hide"), e.$(".zoom").show(), data = JSON.parse(t.data), 
        data && 200 === data.meta.code && (i = !1, "user" === data.response.type ? h(".user-avatar .avatar, .user-panel .avatar").find("img").attr("src", data.response.avatars["80_80"]) : h('.identity-list li[data-identity-id="' + data.response.identity_id + '"] .avatar').find("img").attr("src", data.response.avatars["80_80"])), 
        e.emit("toggleError", i, "server"), e.hide();
      }), this.filehtml5.on("uploadstart", function() {
        e.$(".loading").removeClass("hide"), e.$(".upload-done").prop("disabled", !0);
      });
    },
    options: {
      limit: 1,
      onHideAfter: function() {
        var e = this.element;
        this.offSrcNode(), this.destory(), e.remove();
      },
      onShowBefore: function() {
        u(this);
      },
      onShowAfter: function(e) {
        if (this._data = e, this._canvasOffset = this.$("#avatar240").offset(), e.original) {
          var t = document.createElement("input");
          t.type = "file", this.filehtml5 = new g(t.files), this.filehtml5Bind(), this.$(".overlay").addClass("hide"), 
          this.$(".resizeable").removeClass("hide"), this.$(".upload-done").prop("disabled", !1).show(), 
          this.$(".upload-clear").hide(), this.$(".zoom").show();
          var i = this;
          i.ri = 0, i.R = [ 0, 0 ];
          var n, r, a = document.getElementById("avatar240"), l = document.getElementById("avatar80"), d = (i.r, 
          new o(a)), u = new o(l), h = document.getElementById("img-avatar");
          h.onload = function() {
            var e = Math.min(h.width, h.height);
            i.sss = 1, e > 240 && (i.sss = 240 / e), n = new s(h), i.psx = n.scaleX = i.sss, 
            i.psy = n.scaleY = i.sss, n.setPosition(a.width / 2 - (n.regX *= n.scaleX), a.height / 2 - (n.regY *= n.scaleY)), 
            n.rotation = i.ri, n.updateContext = function(e) {
              e.translate(a.width * i.R[0], a.height * i.R[1]), e.rotate(this.rotation * o.DEG_TO_RAD), 
              e.webkitImageSmoothingEnabled = e.mozImageSmoothingEnabled = !1;
            }, d.addChild(n), d.update(), i.bitmap = n, i.stage = d, r = new s(a), r.updateImage = function(e) {
              r.originalImage = e;
            }, r.updateContext = function(e) {
              e.scale(i.SCALE, i.SCALE), e.webkitImageSmoothingEnabled = e.mozImageSmoothingEnabled = !1;
            }, u.addChild(r), u.update(), i.bitmap80 = r, i.stage80 = u;
            var t = document.createElement("img");
            t.onload = function() {
              new c(document.getElementById("real-avatar80"), this, u.canvas, 80, 3);
            }, t.src = a.toDataURL("image/png");
          }, h.crossOrigin = "anonymous", h.src = e.original;
        }
      },
      onHideAfter: function() {
        this.filehtml5 && this.filehtml5.cancelUpload();
        var e = this.element;
        this.offSrcNode(), this.destory(), e.remove(), d();
      },
      onToggleError: function(e, t) {
        e ? this.$(".xalert-error").html(this.errors[t]).removeClass("hide") : this.$(".xalert-error").addClass("hide");
      },
      onDrop: function() {},
      onFileselect: function(e) {
        var t, n = e.fileList;
        if (n.length) {
          if (t = this.filehtml5 = n[0], !this.checkFile(t)) return !1;
          this.filehtml5Bind(), this.$(".overlay").addClass("hide"), this.$(".resizeable").removeClass("hide"), 
          this.$(".upload-done").prop("disabled", !1).show(), this.$(".upload-clear").hide(), 
          this.$(".zoom").hide();
          var r = this;
          r.ri = 0, r.R = [ 0, 0 ];
          var a, l, d = document.getElementById("avatar240"), u = document.getElementById("avatar80"), h = (r.r, 
          new o(d)), p = new o(u), f = document.getElementById("img-avatar");
          f.onerror = f.onload = function() {
            var e = f, t = Math.min(f.width, f.height);
            if (r.sss = 1, t > 240 && (r.sss = 240 / t), "image/gif" === r.filehtml5._type) {
              var i = document.createElement("canvas"), n = i.getContext("2d");
              i.width = e.width, i.height = e.height, n.drawImage(e, 0, 0, i.width, i.height), 
              e = i;
            }
            a = new s(e), r.psx = a.scaleX = r.sss, r.psy = a.scaleY = r.sss, a.setPosition(d.width / 2 - (a.regX *= a.scaleX), d.height / 2 - (a.regY *= a.scaleY)), 
            a.rotation = r.ri, a.updateContext = function(e) {
              e.translate(d.width * r.R[0], d.height * r.R[1]), e.rotate(this.rotation * o.DEG_TO_RAD), 
              e.webkitImageSmoothingEnabled = e.mozImageSmoothingEnabled = !1;
            }, h.addChild(a), h.update(), r.bitmap = a, r.stage = h, l = new s(d), l.updateImage = function(e) {
              l.originalImage = e;
            }, l.updateContext = function(e) {
              e.scale(r.SCALE, r.SCALE), e.webkitImageSmoothingEnabled = e.mozImageSmoothingEnabled = !1;
            }, p.addChild(l), p.update(), r.bitmap80 = l, r.stage80 = p;
            var u = document.createElement("img");
            u.onload = function() {
              new c(document.getElementById("real-avatar80"), this, p.canvas, 80, 3);
            }, u.src = d.toDataURL("image/png");
          }, f.crossOrigin = "anonymous", i(f, t._file);
        }
      },
      backdrop: !1,
      events: {
        "click .dropbox": function(e) {
          e.preventDefault(), this._fileInputField[0].value = null, this._bindSelectFile();
        },
        "mousedown #avatar240": function(e) {
          return e.preventDefault(), this.dragging = !0, this.offset = [ e.pageX, e.pageY ], 
          !1;
        },
        "click .upload": function(e) {
          e.preventDefault(), this.$(".overlay").removeClass("hide"), this.$(".resizeable").addClass("hide"), 
          this.$(".upload, .rotate, .upload-done").hide(), this.$(".back, .upload-clear").show();
        },
        "click .rotate": function() {
          this.ri++, 1 === this.ri ? this.R = [ 1, 0 ] : 2 === this.ri ? this.R = [ 1, 1 ] : 3 === this.ri ? this.R = [ 0, 1 ] : (this.ri = 0, 
          this.R = [ 0, 0 ]), this.bitmap.rotation = 90 * this.ri, this.stage.update(), this.bitmap80.updateImage(this.stage.canvas), 
          this.stage80.update();
          var e = this, t = document.createElement("img");
          return t.onload = function() {
            new c(document.getElementById("real-avatar80"), this, e.stage80.canvas, 80, 3);
          }, t.src = e.stage.canvas.toDataURL("image/png"), !1;
        },
        "hover .avatar240": function(e) {
          "mouseenter" === e.type ? this.$(".upload, .rotate").show() : this.$(".upload, .rotate").hide();
        },
        "hover .overlay": function(e) {
          if (this._data.original) {
            var t = "mouseenter" === e.type;
            h(e.currentTarget).hasClass("dropbox") && this.$(".back")[t ? "show" : "hide"]();
          }
        },
        "click .back": function() {
          return this.$(".overlay").addClass("hide"), this.$(".resizeable").removeClass("hide"), 
          this.$(".upload-done").prop("disabled", !1), this.$(".upload, .rotate, .upload-done").show(), 
          this.$(".back, .upload-clear").hide(), !1;
        },
        "click .smallphoto": function(e) {
          e.preventDefault();
          var t = "";
          if (!this.bitmap) return !1;
          if (h.browser.safari && !/chrome/.test(navigator.userAgent.toLowerCase())) {
            var i = document.createElement("canvas"), n = i.getContext("2d");
            i.width = this.bitmap.originalImage.width, i.height = this.bitmap.originalImage.height, 
            n.drawImage(this.bitmap.originalImage, 0, 0, i.width, i.height), t = i.toDataURL("image/png");
          } else t = this.bitmap.originalImage.src;
          return window.open(t);
        },
        "mousedown .resizeable": function(e) {
          e.preventDefault();
          var t = h(e.target), i = this.anchor = t.data("anchor");
          this.resizing = !0, this.aoffset = [ e.pageX, e.pageY ];
          var n = this._canvasOffset;
          return 7 === i ? this.dr = Math.sqrt(Math.pow(e.pageX - n.left, 2) + Math.pow(e.pageY - n.top, 2)) : 5 === i ? this.dr = Math.sqrt(Math.pow(e.pageX - n.left - 240, 2) + Math.pow(e.pageY - n.top, 2)) : 0 === i ? this.dr = Math.sqrt(Math.pow(e.pageX - n.left - 240, 2) + Math.pow(e.pageY - n.top - 240, 2)) : 2 === i && (this.dr = Math.sqrt(Math.pow(e.pageX - n.left, 2) + Math.pow(e.pageY - n.top - 240, 2))), 
          !1;
        },
        "click .upload-clear": function() {
          return this.$(".help-portrait").removeClass("hide"), this.$(".xbtn-yes, .xbtn-no").removeClass("hide"), 
          !1;
        },
        "click .xbtn-no": function() {
          return this.$(".help-portrait").addClass("hide"), this.$(".xbtn-yes, .xbtn-no").addClass("hide"), 
          !1;
        },
        "click .xbtn-yes": function() {
          var e = {}, t = p.get("authorization"), i = t.token;
          return this._data.identity_id && (e.identity_id = this._data.identity_id), this.filehtml5.startUpload(f + "/avatar/update?token=" + i, e), 
          !1;
        },
        "click .upload-done": function() {
          var e = this, t = this.bitmap, i = t.originalImage;
          this.stage, this.stage80;
          var n = 240 / this.sss, r = t.x / this.sss, l = t.y / this.sss, c = document.createElement("canvas");
          c.width = c.height = n;
          var d = new o(c), u = new s(i);
          u.setPosition(r, l), u.rotation = 90 * this.ri, u.scaleX = t.scaleX / this.sss, 
          u.scaleY = t.scaleY / this.sss, u.updateContext = function(t) {
            t.translate(c.width * e.R[0], c.height * e.R[1]), t.rotate(this.rotation * o.DEG_TO_RAD), 
            t.webkitImageSmoothingEnabled = t.mozImageSmoothingEnabled = !1;
          }, d.addChild(u), d.update();
          var h = a(d.canvas, "original.png"), m = a(document.getElementById("real-avatar80"), "80_80.png"), g = this;
          setTimeout(function() {
            var e = {
              original: h,
              "80_80": m
            }, t = p.get("authorization"), i = t.token;
            g._data.identity_id && (e.identity_id = g._data.identity_id), g._data = e, g.filehtml5.startUpload(f + "/avatar/update?token=" + i, e);
          }, 15.6);
        }
      },
      viewData: {
        cls: "mblack modal-uploader",
        title: "Portrait",
        body: '<div class="pull-right sider"><div class="pull-right smallphoto"><i class="icon20-zoom zoom"></i><div class="avatar80"><img id="img-avatar" src="" class="hide" alt="" /><canvas id="avatar80" width="80" height="80" class="hide"></canvas><canvas id="real-avatar80"></canvas></div><div class="overlay"></div><div class="loading hide"></div></div><div class="uploader-form"><div class="xalert-error hide"></div><button class="pull-right xbtn xbtn-blue upload-done hide">Save</button><button class="pull-right xbtn xbtn-white upload-clear hide">Clear</button></div></div><div class="photozone"><div class="anchor-n resizeable hide" data-anchor="1"></div><div class="anchor-w resizeable hide" data-anchor="3"></div><div class="anchor-e resizeable hide" data-anchor="4"></div><div class="anchor-s resizeable hide" data-anchor="6"></div><div class="anchor-nw resizeable hide" data-anchor="0"></div><div class="anchor-ne resizeable hide" data-anchor="2"></div><div class="anchor-sw resizeable hide" data-anchor="5"></div><div class="anchor-se resizeable hide" data-anchor="7"></div><div class="avatar240"><i class="icon20-upload upload"></i><i class="icon20-rotate rotate"></i><canvas id="avatar240" width="240" height="240"></canvas></div><div class="loading hide"><img src="/static/img/loading.gif" alt="" width="36" height="39" /><p>Uploading...</p></div><div class="overlay dropbox"><i class="icon20-back back"></i><img class="bigupload" src="/static/img/upload_128.png" alt="" width="128" height="128" /><div class="droptips">Drop your photo <span class="hide">or URL</span> here.<br />Alternatively, <span class="underline">open</span> local file.</div></div></div>',
        footer: '<button class="pull-right xbtn xbtn-pink xbtn-yes hide">Yes</button><button class="pull-right xbtn xbtn-white xbtn-no hide">No</button>',
        others: '<div class="help-portrait hide"><div class="modal-body"><div class="shadow title">Use default portrait?</div><div class="modal-content"><p>You have no portrait set, thus a default one will be assigned automatically. It means you will lose your primary visual identification, consequently poor recognizability confuse your friends.</p><p>Confirm using default portrait?</p></div></div></div>'
      }
    }
  };
  s.prototype = {
    setPosition: function(e, t) {
      this.x = e || 0, this.y = t || 0;
    },
    updateContext: function() {},
    updateRect: function() {
      this.width = this.originalImage.width * this.scaleX, 0 > this.width && (this.width = 1, 
      this.scaleX = this.width / this.originalImage.width), this.height = this.originalImage.height * this.scaleY, 
      0 > this.height && (this.height = 1, this.scaleY = this.height / this.originalImage.height);
    },
    draw: function(e) {
      this.updateRect(), e.drawImage(this.originalImage, this.x, this.y, this.width - 1, this.height - 1);
    }
  }, o.UID = 0, o.DEG_TO_RAD = Math.PI / 180, o.prototype = {
    toDataURL: function() {},
    clear: function() {
      var e = this.canvas.getContext("2d");
      e.setTransform(1, 0, 0, 1, 0, 0), e.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    addChild: function(e) {
      return this._children || (this._children = []), this.parent = this, this._children.push(e), 
      e;
    },
    draw: function() {
      var e, t, i, n = this._children;
      if (n && (t = this._children.length)) for (i = this.canvas.getContext("2d"), this.clear(), 
      e = 0; t > e; e++) {
        var r = n[e];
        i.save(), r.updateContext(i), r.draw(i), i.restore();
      }
    },
    update: function() {
      this.draw();
    }
  }, c.prototype.process1 = function(e, t) {
    e.center.x = (t + .5) * e.ratio, e.icenter.x = Math.floor(e.center.x);
    for (var i = 0; e.dest.height > i; i++) {
      e.center.y = (i + .5) * e.ratio, e.icenter.y = Math.floor(e.center.y);
      var n, r, a, s;
      n = r = a = s = 0;
      for (var o = e.icenter.x - e.range2; e.icenter.x + e.range2 >= o; o++) if (!(0 > o || o >= e.src.width)) {
        var l = Math.floor(1e3 * Math.abs(o - e.center.x));
        e.cacheLanc[l] || (e.cacheLanc[l] = {});
        for (var c = e.icenter.y - e.range2; e.icenter.y + e.range2 >= c; c++) if (!(0 > c || c >= e.src.height)) {
          var d = Math.floor(1e3 * Math.abs(c - e.center.y));
          void 0 == e.cacheLanc[l][d] && (e.cacheLanc[l][d] = e.lanczos(Math.sqrt(Math.pow(l * e.rcp_ratio, 2) + Math.pow(d * e.rcp_ratio, 2)) / 1e3));
          var u = e.cacheLanc[l][d];
          if (u > 0) {
            var h = 4 * (c * e.src.width + o);
            n += u, r += u * e.src.data[h], a += u * e.src.data[h + 1], s += u * e.src.data[h + 2];
          }
        }
      }
      var h = 3 * (i * e.dest.width + t);
      e.dest.data[h] = r / n, e.dest.data[h + 1] = a / n, e.dest.data[h + 2] = s / n;
    }
    ++t < e.dest.width ? setTimeout(function() {
      e.process1(e, t);
    }, 0) : setTimeout(function() {
      e.process2(e);
    }, 0);
  }, c.prototype.process2 = function(e) {
    e.canvas.width = e.dest.width, e.canvas.height = e.dest.height, e.ctx.drawImage(e.img, 0, 0), 
    e.src = e.ctx.getImageData(0, 0, e.dest.width, e.dest.height);
    for (var t, i, n = e.ocan.getContext("2d").getImageData(0, 0, e.dest.width, e.dest.height), r = 0; e.dest.width > r; r++) for (var a = 0; e.dest.height > a; a++) t = 3 * (a * e.dest.width + r), 
    i = 4 * (a * e.dest.width + r), e.src.data[i] = e.dest.data[t], e.src.data[i + 1] = e.dest.data[t + 1], 
    e.src.data[i + 2] = e.dest.data[t + 2], e.src.data[i + 3] = n.data[i + 3];
    e.ctx.putImageData(e.src, 0, 0), e.canvas.style.display = "block";
  }, t.Uploader = v, t.uploadSettings = y;
}), define(function(e) {
  "use strict";
  var t = e("jquery"), i = e("store"), n = window._ENV_, r = e("handlebars"), a = e("humantime"), s = e("rex"), o = e("util"), l = e("bus"), c = e("api");
  r.registerHelper("each", function(e, t) {
    var i, n, r = t.fn, a = t.inverse, s = "";
    if (e && e.length) for (i = 0, n = e.length; n > i; ++i) e[i].__index__ = i, s += r(e[i]); else s = a(this);
    return s;
  }), r.registerHelper("ifFalse", function(e, t) {
    return r.helpers["if"].call(this, !e, t);
  }), r.registerHelper("avatarFilename", function(e) {
    return e;
  }), r.registerHelper("printName", function(e, t) {
    return e || (e = t.match(/([^@]+)@[^@]+/)[1]), e;
  }), r.registerHelper("printTime", function(e) {
    var t = a.printEFTime(e);
    return t.content || "Sometime";
  }), r.registerHelper("printTime2", function(e) {
    var t = a.printEFTime(e);
    return t.content || "To be decided";
  }), r.registerHelper("printPlace", function(e) {
    return e || "To be decided";
  }), r.registerHelper("printTime3", function(e) {
    var t = e.begin_at;
    if (!t.date) return t.date_word || "";
    var i = a.printEFTime(e);
    return i.content || "Sometime";
  }), r.registerHelper("printTime4", function(e) {
    e = r.helpers.crossItem.call(this, e);
    var t = a.printEFTime(e);
    return t.content || "Sometime";
  }), r.registerHelper("rsvpAction", function(e, t) {
    var i = {
      ACCEPTED: "Accepted",
      INTERESTED: "Interested",
      DECLINED: "Unavailable",
      NORESPONSE: "Pending"
    }, n = s.filter(e, function(e) {
      return e.identity.id === t ? !0 : void 0;
    })[0], r = "";
    n && n in i && "INTERESTED" !== n.rsvp_status && (r += '<div><i class="', r += "icon-rsvp-" + n.rsvp_status.toLowerCase() + '"></i> ', 
    r += i[n.rsvp_status] + ": " + n.identity.name + "</div>");
    var a = s.map(e, function(e) {
      return e.by_identity.id === t && e.identity.id !== t ? e.identity.name : void 0;
    }).filter(function(e) {
      return e ? !0 : void 0;
    }).join(", ");
    return r += '<div><i class="icon-invite"></i> ', r += "Invited: " + a, r += "</div>", 
    a ? r : "";
  }), r.registerHelper("ifPlace", function(e) {
    var t = r.helpers.crossItem.call(this, "place");
    return r.helpers["if"].call(this, t.length, e);
  }), r.registerHelper("makeDefault", function(e, t, i) {
    var n = !e && "CONNECTED" === t;
    return r.helpers["if"].call(this, n, i);
  }), r.registerHelper("ifRevoked", function(e, t) {
    return r.helpers["if"].call(this, "REVOKED" === e, t);
  }), r.registerHelper("ifVerifying", function(e, t, i) {
    var n = !r.helpers.isOAuthIdentity.call(this, e, i) && "VERIFYING" === t;
    return r.helpers["if"].call(this, n, i);
  }), r.registerHelper("atName", function(e) {
    return o.printExtUserName(e, !0);
  }), r.registerHelper("editable", function(e, t, i) {
    var n = !r.helpers.isOAuthIdentity.call(this, e, i) && "CONNECTED" === t;
    return r.helpers["if"].call(this, n, i);
  }), r.registerHelper("confirmed_identities", function(e) {
    var t = s(e).filter(function(e) {
      return "ACCEPTED" === e.rsvp_status ? !0 : void 0;
    });
    return s(t.slice(0, 7)).map(function(e) {
      return e.identity.name;
    }).join(", ");
  });
  var d = function(e) {
    t(".user-xstats .attended").html(e.cross_quantity);
    var n = t("#jst-user-avatar"), a = r.compile(n.html()), o = a({
      avatar_filename: e.avatar_filename
    });
    t(".user-avatar").append(o), t("#profile .user-name").find("h3").html(e.name || e.nickname), 
    t("#profile .user-bio").text(e.bio || ""), t("#profile .user-name").find(".changepassword").attr("data-dialog-type", e.password ? "changepassword" : "setpassword").find("span").text(e.password ? "Change Password..." : "Set Password..."), 
    r.registerPartial("jst-identity-item", t("#jst-identity-item").html());
    var l = e.devices;
    l = s.filter(l, function(e) {
      return "iOS" === e.os_name && "CONNECTED" === e.status ? e : void 0;
    }), 0 === l.length && t(".exfe-app").removeClass("hide");
    var d = t("#jst-identity-list");
    a = r.compile(d.html());
    var u = e.identities;
    u[0].__default__ = !0, o = a({
      identities: u
    }), t(".identity-list").append(o);
    var h;
    if (h = t("#app-main").data("event")) {
      var p = h.action;
      if ("add_identity" === p) {
        var f = h.data, m = function(e, n, s) {
          var l = i.get("authorization"), d = l.token;
          c.request("addIdentity", {
            type: "POST",
            params: {
              token: d
            },
            data: {
              external_username: e,
              provider: n
            }
          }, function(e) {
            var n = e.identity, l = i.get("user"), c = l.identities;
            c.push(n), i.set("user", l), a = r.compile(t("#jst-identity-item").html()), o = a(e.identity), 
            t(".identity-list").append(o), s && s.destory();
          }, function(i) {
            var r = i && i.meta;
            if (r && 401 === r.code && "authenticate_timeout" === r.errorType) {
              s && s.destory();
              var a = t('<div data-widget="dialog" data-dialog-type="authentication" data-destory="true" class="hide"></div>');
              t("#app-tmp").append(a);
              var o = t.Event("click.dialog.data-api");
              o._data = {
                callback: function() {
                  m(e, n);
                }
              }, a.trigger(o);
            }
          });
        };
        m(f.identity.external_username, f.identity.provider), t("#app-main").removeData("event");
      }
    }
  }, u = function(e) {
    if (e) {
      var i = e.user_id, n = e.token;
      return c.request("crosslist", {
        params: {
          token: n
        },
        resources: {
          user_id: i
        }
      }, function(e) {
        var i = t("#jst-crosses-container");
        r.registerPartial("jst-cross-box", t("#jst-cross-box").html());
        var n = r.compile(i.html()), a = "", o = "upcoming<Upcoming> sometime<Sometime> sevendays<Next 7 days> later<Later> past<Past>", l = {};
        s.map(e.crosses, function(e) {
          l[e.sort] || (l[e.sort] = {
            crosses: []
          }), l[e.sort].crosses.push(e);
        }), l.upcoming || (l.upcoming = {}), l.upcoming.crosses || (l.upcoming.crosses = []), 
        l.upcoming.crosses.reverse();
        var c = e.more.join(" "), d = /<|>/;
        s.map(o.split(" "), function(e) {
          e = e.split(d);
          var t = l[e[0]];
          t && (t.cate = e[0], t.cate_date = e[1], t.hasMore = c.search(e[0]) > -1, a += n(t));
        }), t("#profile .crosses").append(a);
      });
    }
  }, h = function(e) {
    if (e) {
      var i = e.user_id, n = e.token, a = new Date();
      a = a.getFullYear() + "-" + (a.getMonth() + 1) + "-" + a.getDate();
      var o = c.request("crosses", {
        params: {
          token: n
        },
        resources: {
          user_id: i
        }
      }, function(e) {
        var n = e.crosses, a = [], o = {};
        if (s.each(n, function(e, t) {
          e.exfee && e.exfee.invitations && e.exfee.invitations.length && s.each(e.exfee.invitations, function(e, n) {
            o[e.id] = [ t, n ], i === e.identity.connected_user_id && "NORESPONSE" === e.rsvp_status && (e.__crossIndex = t, 
            e.__identityIndex = n, a.push(e));
          });
        }), r.registerHelper("crossItem", function(e) {
          return "place" === e ? n[this.__crossIndex][e].title : "invitationid" === e ? n[this.__crossIndex].exfee.invitations[this.__identityIndex].id : "exfeeid" === e ? n[this.__crossIndex].exfee.id : "identityid" === e ? n[this.__crossIndex].exfee.invitations[this.__identityIndex].identity.id : "name" === e ? n[this.__crossIndex].exfee.invitations[this.__identityIndex].identity.name : n[this.__crossIndex][e];
        }), r.registerHelper("conversation_nums", function() {
          return this.__conversation_nums;
        }), a.length) {
          var l = t("#jst-invitations"), c = r.compile(l.html()), d = c({
            crosses: a
          });
          t("#profile .gr-b .invitations").removeClass("hide").append(d);
        }
      });
      return o.done(f);
    }
  }, p = function(e) {
    if (e) {
      var i = e.user_id, n = e.token, a = new Date(), o = 0;
      return a.setDate(a.getDate() - 3), o = +a, a = a.getFullYear() + "-" + (a.getMonth() + 1) + "-" + a.getDate(), 
      c.request("crosses", {
        resources: {
          user_id: i
        },
        params: {
          updated_at: a,
          token: n
        }
      }, function(e) {
        var i, n = e.crosses;
        if (0 === n.length) return t(".siderbar.updates").addClass("no-updates"), void 0;
        if (i = s.filter(n, function(e) {
          var t = e.updated, i = !1;
          if (t) {
            var n, r, a;
            for (n in t) "background" !== n && (r = t[n], a = +new Date(r.updated_at.replace(/\-/g, "/")), 
            a > o ? i |= !0 : (i |= !1, t[n] = !1));
          }
          return i ? !0 : void 0;
        }), 0 === i.length) return t(".siderbar.updates").addClass("no-updates"), void 0;
        var a = t("#jst-updates").html(), l = r.compile(a), c = l({
          updates: i
        });
        t(".siderbar.updates .cross-tip").before(c);
      });
    }
  }, f = function(e) {
    e = i.get("authorization");
    var r = e.user_id, a = ~~t(".user-xstats > .attended").text(), s = i.get("newbie_guide:" + r);
    if (3 >= a && !s && 0 === t("#js-newbieguide").length) {
      var o = document.createElement("script");
      o.id = "js-newbieguide", o.type = "text/javascript", o.async = !0, o.src = "/static/js/newbieguide/0.0.5/newbieguide.min.js?t=" + n.timestamp, 
      document.getElementById("app-tmp").appendChild(o);
    }
  }, m = function() {
    var e = i.get("iosapp_dismiss");
    e || t(".ios-app").removeClass("hide");
  };
  l.on("app:profile:show", function(e) {
    e.done([ u, h, p, m ]);
  }), l.on("app:profile:identities", function(e) {
    d(e);
  }), l.on("app:addidentity", function(e) {
    var i = t("#jst-identity-list"), n = r.compile(i.html()), a = n({
      identities: [ e.identity ]
    });
    t(".identity-list").append(a);
  });
  var g = t(document.body);
  g.on("dblclick.profile", ".user-name h3", function() {
    var e = t.trim(t(this).html()), i = t('<input type="text" value="' + e + '" class="pull-left" />');
    i.data("oldValue", e), t(this).after(i).hide(), i.focusend(), t(".xbtn-changepassword").addClass("hide");
  }), g.on("focusout.profile keydown.profile", ".user-name input", function(e) {
    var n = e.type, r = e.keyCode;
    if ("focusout" === n || 9 === r || !e.shiftKey && 13 === r) {
      var a = t.trim(t(this).val()), s = t(this).data("oldValue");
      if (t(this).hide().prev().html(a || s).show(), t(this).remove(), !t(".settings-panel").data("hoverout") && t(".xbtn-changepassword").removeClass("hide"), 
      !a || a === s) return;
      var o = i.get("authorization"), d = o.token;
      c.request("updateUser", {
        type: "POST",
        params: {
          token: d
        },
        data: {
          name: a
        }
      }, function(e) {
        i.set("user", e.user), l.emit("app:page:changeusername", a);
      });
    }
  }), g.on("dblclick.profile", ".identity-list li .identity > span.identityname em", function() {
    var e = t(this), i = e.parents("li"), n = i.data("provider"), r = i.data("editable");
    if (-1 !== "twitter facebook google flickr instagram dropbox".indexOf(n)) i.find(".isOAuth").removeClass("hide"); else if (r) {
      var a = t.trim(e.text()), s = t('<input type="text" value="' + a + '" class="username-input" />');
      s.data("oldValue", a), e.after(s).hide(), s.focusend();
    }
  }), g.on("focusout.profile keydown.profile", ".identity-list .username-input", function(e) {
    var n = e.type, r = e.keyCode;
    if ("focusout" === n || 9 === r || !e.shiftKey && 13 === r) {
      var a = t.trim(t(this).val()), s = t(this).data("oldValue"), o = t(this).parents("li").data("identity-id");
      if (t(this).hide().prev().text(a || s).show(), t(this).remove(), !a || a === s) return;
      var l = i.get("authorization"), d = l.token;
      c.request("updateIdentity", {
        params: {
          token: d
        },
        resources: {
          identity_id: o
        },
        type: "POST",
        data: {
          name: a
        }
      }, function(e) {
        for (var t = e.identity, n = t.id, r = i.get("user"), a = r.identities, s = 0, o = a.length; o > s; ++s) if (a[s].id === n) {
          a[s] = t;
          break;
        }
        i.set("user", r);
      });
    }
  }), g.on("click.profile", ".xbtn-accept, .xbtn-ignore", function(e) {
    e.preventDefault(), e.stopPropagation();
    var n = t(this), r = n.data("action"), a = n.parent(), s = a.data("id"), o = t('.gr-a [data-id="' + s + '"]'), l = a.data("exfeeid"), d = a.data("identity-id"), u = a.data("name"), h = i.get("authorization"), p = h.token;
    c.request("rsvp", {
      params: {
        token: p
      },
      resources: {
        exfee_id: l
      },
      type: "POST",
      data: {
        rsvp: '[{"identity_id":' + d + ', "rsvp_status": "' + r + '", "by_identity_id": ' + d + "}]",
        by_identity_id: d
      }
    }, function() {
      if ("ACCEPTED" === r) {
        var e = o.find(">div :first-child"), t = +e.text();
        e.text(t + 1);
        var i = o.find(">div :last-child"), n = i.text();
        i.text(n + (n ? ", " : "") + u);
      }
      var s;
      a.parent().prev().length || a.parent().next().length || (s = a.parents(".invitations")), 
      a.parent().remove(), s && s.remove();
    });
  }), g.on("click.profile", "#profile div.cross-type", function(e) {
    e.preventDefault(), t(this).next().toggleClass("hide").next().toggleClass("hide"), 
    t(this).find("span.arrow").toggleClass("lt rb");
  }), g.on("hover.profile", ".changepassword", function(e) {
    var i = e.type;
    t(this).data("hoverout", "mouseleave" === i), "mouseenter" === i ? t(this).addClass("xbtn-changepassword") : t(this).removeClass("xbtn-changepassword");
  }), g.on("click.profile", ".more > a", function(e) {
    e.preventDefault();
    var n = t(this), a = n.parent(), o = a.data("cate"), l = i.get("authorization"), d = l.token, u = l.user_id, h = a.prev().find(" .cross-box").length, p = o;
    c.request("crosslist", {
      params: {
        token: d
      },
      resources: {
        user_id: u
      },
      data: {
        more_category: p,
        more_position: h
      }
    }, function(e) {
      if (e.crosses.length) {
        var t = "{{#crosses}}{{> jst-cross-box}}{{/crosses}}", i = r.compile(t);
        a.prev().append(i(e));
        var l = s.filter(e.more, function(e) {
          return e === o ? !0 : void 0;
        });
        l.length || n.remove();
      }
    });
  }), g.on("click.profile.iosapp", ".ios-app > .exfe-dismiss", function(e) {
    e.preventDefault(), i.set("iosapp_dismiss", !0), g.off("click.profile.iosapp"), 
    t(this).parent().fadeOut();
  });
  var v, y = null, _ = null, b = null;
  g.on("click.data-link", ".user-avatar .avatar, .identity-list > li > .avatar", function() {
    var i = t(this), n = i.find("img");
    if (!i.parent().data("editable")) return !1;
    var r = i.parent().data("identity-id"), a = {};
    r && (a.identity_id = r), a["80_80"] = n[0].src, a["80_80"] = decodeURIComponent(a["80_80"]), 
    a["80_80"].match(/\/80_80_/) || (a["80_80"] = ""), a.original = a["80_80"].replace(/80_80_/, "original_"), 
    y || (y = e("uploader").Uploader, v = t.extend(!0, {}, e("uploader").uploadSettings, {
      options: {
        onHideBefore: function() {
          b = _ = void 0;
        }
      }
    })), _ && (_.hide(), _ = null), _ = new y(v).render(), _.show(a);
  }), g.dndsortable({
    delay: 300,
    wrap: !0,
    list: ".identity-list",
    items: " > li",
    sort: function(e, n) {
      var r = t(e), a = t(n), s = a.parent(), o = r.index(), l = a.index(), d = s.data("draggable");
      if (d) {
        o > l ? a.before(r) : a.after(r);
        var u = i.get("authorization"), h = [];
        s.find("> li").each(function(e, i) {
          h.push(t(i).data("identity-id"));
        }), c.request("sortIdentities", {
          type: "POST",
          resources: {
            user_id: u.user_id
          },
          params: {
            token: u.token
          },
          data: {
            identity_order: "[" + ("" + h) + "]"
          }
        }, function() {
          var e = i.get("user"), t = e.identities, n = t.splice(o, 1)[0];
          t.splice(l, 0, n), i.set("user", e), s.data("draggable", !0);
        }), s.data("draggable", !1);
      }
    },
    setData: function(e) {
      return t(e).data("identity-id");
    },
    start: function() {
      var e = t(".settings-panel .identity-list"), i = e.find("> li"), n = !!e.data("draggable");
      return n ? 1 === i.size() ? !1 : (t(this).addClass("dragme"), t(".xbtn-addidentity").addClass("hide"), 
      t(".identities-trash").removeClass("hide over"), void 0) : !1;
    },
    end: function() {
      t(this).removeClass("dragme"), t(".xbtn-addidentity").removeClass("hide"), t(".identities-trash").addClass("hide over");
    }
  }), g.on("dragenter.profile", ".trash-overlay", function() {
    return t(this).parent().addClass("over"), t(".icon24-trash").addClass("icon24-trash-red"), 
    !1;
  }), g.on("dragover.profile", ".trash-overlay", function(e) {
    return e.stopPropagation(), e.preventDefault(), !1;
  }), g.on("dragleave.profile", ".trash-overlay", function() {
    return t(this).parent().removeClass("over"), t(".icon24-trash").removeClass("icon24-trash-red"), 
    !1;
  }), g.data("trash-overlay-deletable", !0), g.on("drop.profile", ".trash-overlay", function(e) {
    function n(e) {
      var r = i.get("authorization"), a = r.token, o = c.request("deleteIdentity", {
        type: "POST",
        params: {
          token: a
        },
        data: {
          identity_id: e
        }
      }, function() {
        var n = i.get("user"), r = n.identities;
        s.some(r, function(t, i) {
          return t.id === e ? (r.splice(i, 1), !0) : void 0;
        }), i.set("user", n), t('.identity-list > li[data-identity-id="' + e + '"]').remove();
      }, function(i) {
        var r = i && i.meta;
        if (r && 401 === r.code && "authenticate_timeout" === r.errorType) {
          var a = t('<div data-widget="dialog" data-dialog-type="authentication" data-destory="true" class="hide"></div>');
          t("#app-tmp").append(a);
          var s = t.Event("click.dialog.data-api");
          s._data = {
            callback: function() {
              n(e);
            }
          }, a.trigger(s);
        }
      });
      o.always(function() {
        g.data("trash-overlay-deletable", !0);
      });
    }
    var r = g.data("trash-overlay-deletable");
    if (r) {
      g.data("trash-overlay-deletable", !1), e.stopPropagation(), e.preventDefault();
      var a = e.originalEvent.dataTransfer, o = +a.getData("text/plain");
      return t(this).parent().removeClass("over"), t(".icon24-trash").removeClass("icon24-trash-red"), 
      n(o), !1;
    }
  });
}), define("user", function(e) {
  "use strict";
  function t(e) {
    var t, i = s("#app-user-menu"), n = s("#app-user-name"), r = n.find("span"), a = i.find(".dropdown-wrapper"), o = a.find(".user-panel"), l = e.identities[0], c = "/#" + d.printExtUserName(l);
    s("#app-browsing-identity").remove(), n.attr("href", c), r.text(e.name || e.nickname).removeClass("browsing-identity"), 
    t = h.compile(m.normal), o.length && o.remove(), e.profileLink = c, e.verifying = 1 === e.identities.length && "VERIFYING" === l.status, 
    a.append(t(e)), delete e.profileLink, delete e.verifying;
  }
  function i(e) {
    var t, i = s("#app-user-menu"), n = s("#app-user-name"), r = n.find("span"), a = i.find(".dropdown-wrapper"), o = a.find(".user-panel"), l = e.browsing, c = l.identities[0];
    l.isBrowsing = !0, s("#app-browsing-identity").remove(), s("#app-tmp").append(s('<div id="app-browsing-identity">').data("settings", e).attr("data-widget", "dialog").attr("data-dialog-type", "browsing_identity"));
    var d = "setup_authenticate";
    ("email" === c.provider || "phone" === c.provider) && (d = "setup_verification"), 
    n.attr("href", location.href), r.html("Browsing as: <span>" + (l.name || l.nickname) + "</span>").addClass("browsing-identity"), 
    t = h.compile(m.browsing_identity), o.length && o.remove(), a.append(t(e)), s("#app-user-menu").find(".setup").attr("data-dialog-type", d).data("source", {
      browsing: l,
      originToken: e.originToken,
      tokenType: e.tokenType,
      forward: e.forward,
      page: e.page,
      token: e.token
    });
  }
  function n(e, t) {
    e = !!e;
    var i = s(document.body), n = s("#app-menubar"), r = s("#app-main");
    t || r.empty(), i.toggleClass("hbg", e), n.toggleClass("hide", e);
  }
  function r(e) {
    e = !!e;
    var t = s("#app-user-menu"), i = s("#app-signin");
    t.toggleClass("hide", !e), i.toggleClass("hide", e);
  }
  function a(e) {
    for (var t, i, n, r, a = u.get("identities") || [], s = e.slice(0); r = a.shift(); ) {
      for (t = !1, i = 0; (n = e[i++]) && !(t = r.external_username === n.external_username); ) ;
      t || s.push(r);
    }
    u.set("identities", s);
  }
  var s = e("jquery"), o = e("rex"), l = e("api"), c = e("bus"), d = e("util"), u = e("store"), h = e("handlebars"), p = function(e, t, i, n) {
    f(e, t, function(r) {
      var l, h = u.get("last_external_username"), p = r.user;
      if (h && (l = o.find(p.identities, function(e) {
        var t = d.printExtUserName(e);
        return h === t ? !0 : void 0;
      })), l || (l = p.identities[0], u.set("last_external_username", d.printExtUserName(l))), 
      u.set("authorization", {
        token: e,
        user_id: t
      }), u.set("user", p), u.set("lastIdentity", l), a(p.identities), n = !s(".modal-su").size()) {
        var f = s("#forbidden"), m = s("#invite");
        if (f.size() || m.size()) return window.location.reload(), void 0;
        var g = s("#app-browsing-identity");
        if (g.size() && "profile" === g.attr("data-page")) return g.remove(), window.location.href = "/", 
        void 0;
        var v = decodeURIComponent(window.location.hash);
        if (i || ("" === v || /^#?(invalid)?/.test(v)) && !/^#gather/.test(v) && !/^#!/.test(v)) return setTimeout(function() {
          window.location.hash = d.printExtUserName(p.identities[0]);
        }, 16), void 0;
      }
      c.emit("app:page:usermenu", !0), c.emit("app:usermenu:updatenormal", p), c.emit("app:usermenu:crosslist", e, t), 
      c.emit("app:user:signin:after", p);
    }, function() {
      u.remove("cats"), u.remove("user"), u.remove("authorization"), window.location.href = "/";
    });
  };
  c.on("app:user:signin", p);
  var f = function(e, t, i, n) {
    l.request("getUser", {
      params: {
        token: e
      },
      resources: {
        user_id: t
      }
    }, i || function() {}, n || function() {});
  };
  c.on("app:api:getuser", f), c.on("app:usermenu:updatenormal", t), c.on("app:usermenu:updatebrowsing", i);
  var m = {
    normal: '<div class="dropdown-menu user-panel"><div class="header"><div class="meta"><a class="pull-right avatar" href="{{profileLink}}" data-link><img width="40" height="40" alt="" src="{{avatar_filename}}" /></a><a class="attended" href="{{profileLink}}" data-link><span class="attended-nums">{{cross_quantity}}</span><span class="attended-x"><em class="x">·X·</em> attended</span></a></div></div><div class="body">{{#unless password}}<div class="merge setup" data-widget="dialog" data-dialog-type="setpassword">Set <span class="x-sign">EXFE</span> password</div>{{/unless}}{{#if verifying}}<div class="merge verify" data-dialog-type="verification_{{identities.[0].provider}}" data-widget="dialog" data-identity-id="{{identities.[0].id}}"><strong>Verify</strong> identity</div>{{/if}}<div class="list"></div></div><div class="footer"><a href="/#gather" class="xbtn xbtn-gather" id="js-gatherax" data-link>Gather a <span class="x">·X·</span></a><div class="spliterline"></div><div class="actions"><a href="#" class="pull-right" id="app-signout">Sign out</a></div></div></div>',
    browsing_identity: '<div class="dropdown-menu user-panel"><div class="header"><h2>Browsing Identity</h2></div><div class="body">{{#with browsing}}<div>You are browsing this page as {{capitalize identities.[0].provider}} identity:</div><div class="identity"><span class="pull-right avatar alt40"><img src="{{identities.[0].avatar_filename}}" width="20" height="20" alt="" /></span><i class="icon16-identity-{{identities.[0].provider}}"></i><span class="oblique">{{identities.[0].external_username}}</span></div>{{#if ../setup}}<div class="merge setup" data-user-action="SETUP" data-widget="dialog"><h5>Start</h5>new account with this identity</div>{{/if}}{{/with}}{{#unless setup}}<div class="orspliter hide">or</div><div class="merge signin" data-user-action="SIGNIN" data-source="{{browsing.identities.[0].external_username}}" data-widget="dialog" data-dialog-type="identification" data-dialog-tab="d00"><h5>Authenticate</h5>to continue with this identity</div>{{/unless}}</div><div class="footer"></div></div>'
  };
  h.registerHelper("ifConnected", function(e, t) {
    return h.helpers["if"].call(this, "CONNECTED" === e, t);
  }), c.on("app:page:home", n), c.on("app:page:usermenu", r), c.on("app:page:changeusername", function(e) {
    s("#app-user-name").find("span").text(e);
  });
}), define(function(e) {
  ExfeUtilities = {
    trim: function(e) {
      return e ? e.replace(/^\s+|\s+$/g, "") : "";
    },
    escape: function(e, t) {
      return e.replace(t ? /&/g : /&(?!#?\w+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    },
    clone: function(e) {
      switch (Object.prototype.toString.call(e)) {
       case "[object Object]":
        var t = {};
        for (var i in e) t[i] = this.clone(e[i]);
        break;

       case "[object Array]":
        t = [];
        for (i in e) t.push(this.clone(e[i]));
        break;

       default:
        t = e;
      }
      return t;
    },
    getTimezone: function() {
      var e = "" + Date(), t = e.replace(/^.+([+-]\d{2})(\d{2}).+$/i, "$1:$2"), i = e.replace(/^.*\(([a-z]*)\).*$/i, "$1");
      return i = "UTC" === i || "GMT" === i ? "" : i, t + (i === e ? "" : " " + i);
    },
    parsePlacestring: function(e) {
      for (var t = e ? e.split(/\r\n|\r|\n/g) : [], i = [], n = 0; t.length > n; n++) t[n] && i.push(t[n]);
      var r = i.shift();
      return r = r ? r : "", {
        title: r,
        description: i.join("\r"),
        lng: "",
        lat: "",
        provider: "",
        external_id: "",
        id: Cross.place.id,
        type: "Place"
      };
    }
  }, ExfeeCache = {
    identities: [],
    tried_key: {},
    updated_identity: [],
    init: function() {
      var e = Store.get("exfee_cache_user_id"), t = Store.get("exfee_cache_identities");
      User && User.id && e && User.id === e && t || (t = []), this.identities = [];
      for (var i = 0; t.length > i; i++) t[i].external_username && this.identities.push(t[i]);
    },
    saveCache: function() {
      User && User.id && (Store.set("exfee_cache_user_id", User.id), Store.set("exfee_cache_identities", this.identities));
    },
    search: function(e) {
      var t = function(e, t) {
        return t ? -1 !== t.toLowerCase().indexOf(e) : !1;
      }, i = function(e, i) {
        return t(e, i.external_id) || t(e, i.external_username) || t(e, i.name);
      }, n = [];
      e = e.toLowerCase();
      for (var r = 0; this.identities.length > r; r++) i(e, this.identities[r]) && !ExfeeWidget.isMyIdentity(this.identities[r]) && ExfeeWidget.checkExistence(this.identities[r]) === !1 && n.push(ExfeUtilities.clone(this.identities[r]));
      return n;
    },
    cacheIdentities: function(e, t) {
      e = ExfeUtilities.clone(e);
      for (var i = 0; e.length > i; i++) {
        for (var n = 0; this.identities.length > n; n++) ExfeeWidget.compareIdentity(e[i], this.identities[n]) && this.identities.splice(n, 1);
        t ? this.identities.unshift(e[i]) : this.identities.push(e[i]), this.identities.length > 233 && this.identities.splice(233), 
        this.updated_identity.push(e[i]);
      }
      this.saveCache();
    },
    fetchIdentity: function(e) {
      for (var t = 0; this.identities.length > t; t++) if (ExfeeWidget.compareIdentity(e, this.identities[t])) return ExfeUtilities.clone(this.identities[t]);
      return null;
    }
  }, ExfeeWidget = {
    dom_id: "",
    rsvp_status: [ "Pending", "Accepted", "Unavailable", "Interested" ],
    editable: !1,
    complete_timer: 0,
    complete_key: "",
    complete_exfee: [],
    complete_request: 0,
    selected: "",
    completing: !1,
    callback: function() {},
    last_inputed: {},
    base_info_timer: 0,
    api_url: "",
    focus: {},
    soft_limit: 12,
    hard_limit: 50,
    blur: !0,
    make: function(e, t, i) {
      return this.dom_id = e, this.editable = t, this.callback = i, $("#" + this.dom_id + " .total").css("visibility", "hidden"), 
      $("#" + this.dom_id + " .avatar .rb").hide(), $("#" + this.dom_id).bind("mouseenter mouseleave", function(t) {
        switch (t.type) {
         case "mouseenter":
          $("#" + e + " .total").css("visibility", "visible"), $("#" + e + " .avatar .rb").show();
          break;

         case "mouseleave":
          ExfeeWidget.focus[e + "-input"] || "" !== $("#" + e + " .exfee-input").val() || ($("#" + e + " .total").css("visibility", "hidden"), 
          $("#" + e + " .avatar .rb").hide(), ExfeeWidget.showLimitWarning(!1));
        }
      }), $("#" + this.dom_id + " .input-xlarge").bind("focus keydown blur", this.inputEvent), 
      $("#" + this.dom_id + " .pointer").bind("mousedown", function(t) {
        return t.preventDefault(), t.stopPropagation(), ExfeeWidget.checkInput($("#" + e + " .input-xlarge"), !0), 
        ExfeeWidget.blur = !1, !1;
      }).bind("click", function(e) {
        return e.preventDefault(), e.stopPropagation(), !1;
      }), $(document).on("mousedown", "#" + this.dom_id + " .thumbnails > li.identity > .avatar", function() {
        ExfeeWidget.showPanel(this.parentNode);
      }), this.complete_timer = setInterval("ExfeeWidget.checkInput($('#" + this.dom_id + " .input-xlarge'))", 50), 
      ExfeUtilities.clone(this);
    },
    showAll: function(e, t) {
      var i = 0, n = 0, r = [ "ACCEPTED", "INTERESTED", "NORESPONSE", "DECLINED", "IGNORED" ];
      $("#" + this.dom_id + " .thumbnails").html("");
      for (var a = 0; r.length > a; a++) for (var s = 0; Exfee.invitations.length > s; s++) if (Exfee.invitations[s].rsvp_status === r[a]) {
        var o = Exfee.invitations[s].mates + 1;
        e && ExfeeWidget.isMyIdentity(Exfee.invitations[s].identity) || this.showOne(Exfee.invitations[s], t), 
        "ACCEPTED" === Exfee.invitations[s].rsvp_status && (i += o), n += o;
      }
      $("#" + this.dom_id + " .attended").html(i), $("#" + this.dom_id + " .total").html("of " + n);
    },
    showOne: function(e, t) {
      var i = {
        ACCEPTED: "icon14-rsvp-accepted-blue",
        DECLINED: "icon14-rsvp-declined",
        INTERESTED: "icon14-rsvp-interested",
        NORESPONSE: "icon14-rsvp-noresponse"
      };
      $("#" + this.dom_id + " .thumbnails").append('<li class="identity" id="' + e.identity.id + '" provider="' + e.identity.provider.toLowerCase() + '" external_id="' + e.identity.external_id.toLowerCase() + '" external_username="' + e.identity.external_username.toLowerCase() + '">' + '<span class="pointer avatar' + (t && "ACCEPTED" !== e.rsvp_status ? " unconfirmed" : "") + '">' + '<img src="' + e.identity.avatar_filename + '" alt="' + e.identity.external_id + '" width="50" height="50" />' + '<i class="rt' + (e.host ? " icon10-host-h" : "") + '"></i>' + '<i class="icon10-plus-' + e.mates + ' lt"></i>' + ("cross-exfee" === this.dom_id ? '<span class="rb rb-bg' + (ExfeeWidget.focus[this.dom_id + "-input"] ? "" : " hide") + '">' + '<i class="' + i[e.rsvp_status] + '"></i>' + "</span>" : "") + "</span>" + '<div class="identity-name">' + e.identity.name + "</div>" + "</li>");
    },
    showLimitWarning: function(e) {
      $(".exfee-warning").toggleClass("hide", e === !1);
    },
    showTip: function(e) {
      var t = $(e), i = t.offset(), n = {}, r = t.attr("id"), a = t.attr("provider"), s = t.attr("external_id"), o = t.attr("external_username");
      (r = ~~r) && (n.id = r), a && (n.provider = a), s && (n.external_id = s), o && (n.external_username = o);
      var l = this.getInvitationByIdentity(n);
      ExfeePanel.showTip(l, i.left, i.top + 50);
    },
    showPanel: function(e) {
      var t = $(e), i = t.offset(), n = {}, r = t.attr("id"), a = t.attr("provider"), s = t.attr("external_id"), o = t.attr("external_username");
      (r = ~~r) && (n.id = r), a && (n.provider = a), s && (n.external_id = s), o && (n.external_username = o);
      var l = this.getInvitationByIdentity(n);
      ExfeePanel.showPanel(l, i.left + 5, i.top + 5);
    },
    compareIdentity: function(e, t) {
      if (e.id && t.id && e.id === t.id) return !0;
      if (ExfeUtilities.trim(e.provider).toLowerCase() === ExfeUtilities.trim(t.provider).toLowerCase()) {
        if (e.external_id && t.external_id && ExfeUtilities.trim(e.external_id).toLowerCase() === ExfeUtilities.trim(t.external_id).toLowerCase()) return !0;
        if (e.external_username && t.external_username && ExfeUtilities.trim(e.external_username).toLowerCase() === ExfeUtilities.trim(t.external_username).toLowerCase()) return !0;
      }
      return !1;
    },
    checkExistence: function(e) {
      for (var t = 0; Exfee.invitations.length > t; t++) if (this.compareIdentity(Exfee.invitations[t].identity, e)) return t;
      return !1;
    },
    addExfee: function(e, t, i) {
      var n = ExfeeWidget.summary().items;
      if (ExfeeWidget.hard_limit > n && e) {
        var r = this.checkExistence(e);
        return r === !1 ? (Exfee.invitations.push({
          identity: ExfeUtilities.clone(e),
          rsvp_status: i ? i : "NORESPONSE",
          host: !!t,
          mates: 0
        }), this.callback()) : "REMOVED" === Exfee.invitations[r].rsvp_status && (Exfee.invitations[r].rsvp_status = "NORESPONSE", 
        this.callback()), !0;
      }
      return !1;
    },
    delExfee: function(e) {
      this.rsvpExfee(e, "REMOVED");
    },
    rsvpExfee: function(e, t) {
      var i = this.checkExistence(e);
      if (i !== !1) {
        Exfee.invitations[i].rsvp_status = t, Exfee.invitations[i].by_identity = ExfeUtilities.clone(curIdentity);
        var n = !1;
        "REMOVED" === t && curIdentity && ExfeeWidget.compareIdentity(Exfee.invitations[i].identity, curIdentity) && (n = !0), 
        this.callback(n);
      }
    },
    changeMates: function(e, t) {
      var i = this.checkExistence(e);
      i !== !1 && (t > 9 && (t = 9), 0 > t && (t = 0), Exfee.invitations[i].mates = t, 
      this.callback());
    },
    rsvpMe: function(e) {
      this.rsvpExfee(curIdentity, e);
    },
    summary: function() {
      for (var e = {
        items: 0,
        accepted: 0,
        total: 0,
        accepted_invitations: []
      }, t = 0; Exfee.invitations.length > t; t++) if ("REMOVED" !== Exfee.invitations[t].rsvp_status && "NOTIFICATION" !== Exfee.invitations[t].rsvp_status) {
        e.items++;
        var i = 1 + Exfee.invitations[t].mates;
        e.total += i, "ACCEPTED" === Exfee.invitations[t].rsvp_status && (e.accepted += i, 
        e.accepted_invitations.push(Exfee.invitations[t]));
      }
      return e;
    },
    getUTF8Length: function(e) {
      var t = 0;
      if (e) for (var i = 0; e.length > i; i++) charCode = e.charCodeAt(i), 127 > charCode ? t += 1 : charCode >= 128 && 2047 >= charCode ? t += 2 : charCode >= 2048 && 65535 >= charCode && (t += 3);
      return t;
    },
    cutLongName: function(e) {
      for (e = e ? e.replace(/[^0-9a-zA-Z_\u4e00-\u9fa5\ \'\.]+/g, " ") : ""; this.getUTF8Length(e) > 30; ) e = e.substring(0, e.length - 1);
      return e;
    },
    parseAttendeeInfo: function(e) {
      e = ExfeUtilities.trim(e);
      var t = {
        id: 0,
        name: "",
        external_id: "",
        external_username: "",
        provider: "",
        type: "identity"
      };
      if (/^[^@]*<[a-zA-Z0-9!#$%&\'*+\\\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&\'*+\\\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?>$/.test(e)) {
        var i = e.indexOf("<"), n = e.indexOf(">");
        t.external_id = ExfeUtilities.trim(e.substring(++i, n)), t.external_username = t.external_id, 
        t.name = ExfeUtilities.trim(this.cutLongName(ExfeUtilities.trim(e.substring(0, i)).replace(/^"|^'|"$|'$/g, ""))), 
        t.provider = "email";
      } else if (/^[a-zA-Z0-9!#$%&\'*+\\\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&\'*+\\\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(e)) t.external_id = e, 
      t.external_username = e, t.name = ExfeUtilities.trim(this.cutLongName(e.split("@")[0])), 
      t.provider = "email"; else if (/^@[a-z0-9_]{1,15}$|^@[a-z0-9_]{1,15}@twitter$|^[a-z0-9_]{1,15}@twitter$/i.test(e)) t.external_id = "", 
      t.external_username = e.replace(/^@|@twitter$/gi, ""), t.name = t.external_username, 
      t.provider = "twitter"; else {
        if (!/^[a-z0-9\.]{5,}@facebook$/i.test(e)) return null;
        t.external_id = "", t.external_username = e.replace(/@facebook$/gi, ""), t.name = t.external_username, 
        t.provider = "facebook";
      }
      return t.avatar_filename = encodeURI(ExfeeWidget.api_url + "/avatar/default?name=" + t.name), 
      t;
    },
    checkComplete: function(e, t, i) {
      this.showCompleteItems(e, t, t ? ExfeeCache.search(t) : [], i), this.ajaxComplete(e, t);
    },
    displayIdentity: function(e, t) {
      switch (e ? e.provider : "") {
       case "email":
       case "phone":
        return /^\+1.{10}$/.test(e.external_id) ? e.external_id.replace(/^(\+1)(.{3})(.{3})(.{4})$/, "$1 ($2) $3-$4") : /^\+86.{11}$/.test(e.external_id) ? e.external_id.replace(/^(\+86)(.{3})(.{4})(.{4})$/, "$1 $2 $3 $4") : e.external_id;

       case "twitter":
        return "@" + e.external_username + (t ? "" : "@twitter");

       case "facebook":
        return e.external_username + (t ? "" : "@facebook");

       default:
        return "";
      }
    },
    displayCompletePanel: function(e, t) {
      if (this.completing = t) {
        var i = e.offset();
        $(".ids-popmenu").css({
          left: i.left + "px",
          top: i.top + e.height() + 10 + "px",
          "max-height": "352px",
          "overflow-y": "scroll"
        }).slideDown(50);
      } else $(".ids-popmenu").slideUp(50);
    },
    showCompleteItems: function(t, i, n, r) {
      var a = function(e) {
        var t = RegExp("(" + i.replace(/^\+/, "") + ")");
        return e ? e.replace(t, '<span class="highlight">$1</span>') : "";
      }, s = $(".ids-popmenu > ol"), o = "";
      i = i ? i.toLowerCase() : "", ExfeeWidget.complete_key !== i && (ExfeeWidget.complete_exfee = [], 
      s.html("")), ExfeeWidget.complete_key = i;
      for (var l = 0; n.length > l; l++) {
        for (var c = !1, d = 0; ExfeeWidget.complete_exfee.length > d; d++) if (this.compareIdentity(ExfeeWidget.complete_exfee[d], n[l])) {
          c = !0;
          break;
        }
        if (!c) {
          ExfeeWidget.complete_exfee.push(ExfeUtilities.clone(n[l])) - 1;
          var u = n[l].provider;
          o += '<li><span class="pull-left avatar"><img src="' + n[l].avatar_filename + '" alt="" width="40" height="40">' + '<span class="rb"><i class="icon16-identity-' + n[l].provider + '"></i></span>' + "</span>" + '<div class="identity">' + '<div class="name">' + a(n[l].name) + "</div>" + "<div>" + '<span class="oblique external">' + a(this.displayIdentity(n[l], !0)) + "</span>" + ("email" === u || "phone" === u ? "" : ' <span class="provider">@' + u.charAt(0).toUpperCase() + u.substr(1) + "</span>") + "</div>" + "</div>" + "</li>";
        }
      }
      s.append(o), this.displayCompletePanel(t, i && ExfeeWidget.complete_exfee.length);
      var h = i.replace(/\-|\(|\)|\ /g, "");
      if (h && r && !ExfeeWidget.complete_exfee.length && !$("#phone-panel").length && /^[\+＋]?[0-9\uFF10-\uFF19]{5,15}$/.test(h)) {
        var p = {
          "＋": "+",
          "０": "0",
          "１": "1",
          "２": "2",
          "３": "3",
          "４": "4",
          "５": "5",
          "６": "6",
          "７": "7",
          "８": "8",
          "９": "9"
        }, f = h.split("");
        for (h = "", l = 0; f.length > l; l++) h += p[f[l]] === void 0 ? f[l] : p[f[l]];
        t.val(h);
        var m = e("phonepanel"), g = new m({
          options: {
            parentNode: $("#app-tmp"),
            srcNode: t
          },
          add: function(e) {
            ExfeeWidget.addExfee(e), t.val("");
          }
        });
        g.show();
      }
    },
    isMyIdentity: function(e) {
      return curIdentity && (this.compareIdentity(e, curIdentity) || e.connected_user_id === curIdentity.connected_user_id);
    },
    getInvitationByIdentity: function(e) {
      for (var t = 0; Exfee.invitations.length > t; t++) if (this.compareIdentity(Exfee.invitations[t].identity, e)) return Exfee.invitations[t];
      return null;
    },
    getMyInvitation: function() {
      return curIdentity ? this.getInvitationByIdentity(curIdentity) : null;
    },
    ajaxComplete: function(e, t) {
      User && t && void 0 === ExfeeCache.tried_key[t] && (this.complete_request && this.complete_request.abort(), 
      this.complete_request = Api.request("complete", {
        type: "get",
        data: {
          key: t
        }
      }, function(i) {
        for (var n = [], r = 0; i.identities.length > r; r++) ExfeeWidget.isMyIdentity(i.identities[r]) || ExfeeWidget.checkExistence(i.identities[r]) !== !1 || n.push(i.identities[r]), 
        ExfeeCache.cacheIdentities(n), ExfeeCache.tried_key[t] = !0, ExfeeWidget.complete_key === t && ExfeeWidget.showCompleteItems(e, t, n);
      }));
    },
    ajaxIdentity: function(e) {
      e && e.length && Api.request("getIdentity", {
        type: "POST",
        data: {
          identities: JSON.stringify(e)
        }
      }, function(e) {
        for (var t = [], i = 0; e.identities.length > i; i++) {
          var n = ExfeeWidget.checkExistence(e.identities[i]);
          n !== !1 && (Exfee.invitations[n].identity = e.identities[i]), t.push(e.identities[i]);
        }
        t.length && (ExfeeCache.cacheIdentities(t), window.GatherExfeeWidget.showAll(!0), 
        window.CrossExfeeWidget.showAll(!1, !0));
      });
    },
    checkInput: function(e, t) {
      if (e && e.length) {
        var i = e.val(), n = i.split(/,|;|\r|\n|\t/), r = [], a = [], s = "", o = "";
        if (ExfeeWidget.last_inputed[e[0].id] !== i || t) {
          ExfeeWidget.last_inputed[e[0].id] = i;
          for (var l = 0; n.length > l; l++) if (s = ExfeUtilities.trim(n[l])) {
            var c = ExfeeWidget.parseAttendeeInfo(s);
            c && (n.length - 1 > ~~l || t) && this.addExfee(c) ? r.push(c) : (a.push(n[l]), 
            o = n[l]);
          }
          var d = a.join("; ");
          d !== i && e.val(d), this.ajaxIdentity(r), ExfeeWidget.summary().items >= ExfeeWidget.hard_limit && i ? (o = "", 
          this.showLimitWarning()) : this.showLimitWarning(!1);
          var u = !!ExfeeWidget.parseAttendeeInfo(o) || /^\+?[0-9]{5,15}$/.test(o);
          e.parent().find(".pointer").toggleClass("icon16-exfee-plus-blue", u).toggleClass("icon16-exfee-plus", !u), 
          this.checkComplete(e, o.replace(/^@/, ""), t);
        }
      }
    },
    selectCompleteItem: function(e) {
      var t = "active";
      $(".ids-popmenu > ol > li").removeClass(t).eq(e).addClass(t);
    },
    useCompleteItem: function(e) {
      var t = ExfeeCache.fetchIdentity(this.complete_exfee[e]);
      t ? (this.complete_exfee.splice(e, 1), ExfeeCache.cacheIdentities(t)) : t = ExfeUtilities.clone(this.complete_exfee[e]), 
      this.addExfee(t);
    },
    inputEvent: function(e) {
      var t = $(e.target);
      switch (ExfeeWidget.blur = !0, e.type) {
       case "focus":
        ExfeeWidget.focus[e.target.id] = !0;
        break;

       case "keydown":
        switch (e.which) {
         case 9:
          ExfeeWidget.checkInput(t, !0);
          break;

         case 13:
          var i = $(".ids-popmenu > ol > .active"), n = i.length ? ~~i.index() : null;
          ExfeeWidget.completing && null !== n ? (ExfeeWidget.useCompleteItem(n), ExfeeWidget.displayCompletePanel(t, !1), 
          t.val("")) : ExfeeWidget.checkInput(t, !0), ExfeeWidget.blur = !1;
          break;

         case 27:
          ExfeeWidget.completing && ExfeeWidget.displayCompletePanel(t, !1);
          break;

         case 38:
         case 40:
          e.preventDefault();
          var r = $(".ids-popmenu"), a = 352, s = 50, o = r.scrollTop();
          if (!ExfeeWidget.completing) return;
          var i = r.find("ol .active"), n = ~~i.index(), l = ExfeeWidget.complete_exfee.length - 1;
          switch (e.which) {
           case 38:
            0 > --n && (n = l);
            break;

           case 40:
            ++n > l && (n = 0);
          }
          ExfeeWidget.selectCompleteItem(n);
          var c = n * s, d = c - o;
          0 > d ? r.scrollTop(c) : d + s > a && r.scrollTop(c + s - a + 1);
        }
        break;

       case "blur":
        ExfeeWidget.focus[e.target.id] = !1, ExfeeWidget.displayCompletePanel(t, !1);
        var u = function() {
          t.parent().find(".pointer").hasClass("icon16-exfee-plus-blue") && (t.parent().toggleClass("a-bounce"), 
          setTimeout(function() {
            t.parent().toggleClass("a-bounce", !1);
          }, 1e3));
        };
        setTimeout(function() {
          ExfeeWidget.blur && u(), ExfeeWidget.blur = !0;
        }, 50);
      }
    }
  };
}), define("exfeepanel", function() {
  var e = $("body");
  return e.bind("click", function(e) {
    for (var t = e.target; t && !$(t).hasClass("exfee_pop_up") && !$(t).hasClass("exfee_pop_up_save") && "BODY" !== t.tagName; ) t = t.parentNode;
    $(t).hasClass("exfee_pop_up") || $(t).hasClass("exfee_pop_up_save") || $(".exfee_pop_up").hide().remove();
  }), {
    objBody: e,
    tipId: "",
    panelId: "",
    arrRsvp: {
      NORESPONSE: [ "Pending" ],
      ACCEPTED: [ "Accepted" ],
      INTERESTED: [ "Interested" ],
      DECLINED: [ "Unavailable" ],
      IGNORED: [ "Pending" ]
    },
    invitation: {},
    editing: "",
    pre_delete: !1,
    newId: function(e) {
      return "id_" + e.identity.id + "provider_" + e.identity.provider + "external_id_" + e.identity.external_id + "external_username_" + e.identity.external_username;
    },
    showTip: function(e, t, i) {
      var n = this.newId(e), r = '<div class="tooltip tip-exfee  exfee_pop_up" style="left: ' + t + "px; top: " + i + 'px;">' + '<div class="tooltip-inner">' + "<h5>" + e.identity.name + "</h5>" + "<div>" + '<i class="icon16-identity-' + e.identity.provider + '"></i>' + '<span class="oblique">' + ExfeeWidget.displayIdentity(e.identity, !0) + "</span>" + "</div>" + "</div>" + "</div>";
      this.tipId === n && $(".tip-exfee").length || (this.tipId = n, this.hideTip(), this.objBody.append(r), 
      $(".exfeetip").show());
    },
    showPanel: function(e, t, i) {
      var n = this.newId(e), r = '<div class="exfeepanel exfee_pop_up" style="left: ' + t + "px; top: " + i + 'px; z-index: 10">' + '<div class="tooltip-inner">' + '<div class="avatar-name">' + '<span class="pull-left pointer avatar">' + '<img src="' + e.identity.avatar_filename + '" alt="" width="60" height="60" />' + '<i class="lt"></i>' + "</span>" + "<h4>" + e.identity.name + "</h4>" + "</div>" + '<div class="clearfix rsvp-actions">' + '<div class="pull-right invited">' + '<div class="mates-num hide"></div>' + '<div class="pull-left together-with hide">Mates&nbsp;</div>' + '<div class="pull-right mates-info">' + '<i class="mates-add icon-plus-blue"></i>' + "</div>" + '<div class="pull-left mates-edit hide">' + '<i class="pull-left mates-minus icon14-mates-minus"></i>' + '<span class="pull-left num"></span>' + '<i class="pull-left mates-add icon14-mates-add"></i>' + "</div>" + "</div>" + '<div class="rsvp-info">' + '<div class="rsvp-content">' + '<div class="attendance"></div>' + '<div class="by">by <span class="name"></span></div>' + "</div>" + '<div class="pull-right pointer underline setto">' + (readOnly ? "" : '<span>set to</span> <i class="icon-rsvp-declined-red"></i>') + "</div>" + "</div>" + "</div>" + '<div class="identities">' + '<ul class="identities-list">' + "<li>" + '<i class="pull-left icon16-identity-' + e.identity.provider + '"></i>' + '<span class="oblique identity">' + ExfeeWidget.displayIdentity(e.identity, !0) + "</span>" + (readOnly ? "" : '<div class="identity-btn delete"><i class="icon-minus-red"></i><button class="btn-leave">Leave</button></div>') + "</li>" + "</ul>" + '<div class="identity-actions">' + "<p>" + '<span class="xalert-fail">Remove yourself?</span>' + "<br />" + '<span class="xalter-info">You will <strong>NOT</strong> be able to access any information in this <span class="x">·X·</span>. Confirm leaving?</span>' + '<button class="pull-right btn-cancel">Cancel</button>' + "</p>" + "</div>" + "</div>" + '<!--i class="expand nomore"></i-->' + "</div>" + "</div>";
      this.invitation = ExfeUtilities.clone(e), this.panelId === n && $(".exfeepanel").length || (this.panelId = n, 
      this.editing = "", this.pre_delete = !1, this.hideTip(), this.hidePanel(), this.objBody.append(r), 
      this.bindEvents(), $(".exfeepanel").show()), this.showRsvp();
    },
    hideTip: function() {
      $(".tip-exfee").hide().remove();
    },
    hidePanel: function() {
      $(".exfeepanel").hide().remove();
    },
    showRsvp: function() {
      var e = this.invitation.by_identity ? this.invitation.by_identity : curIdentity, t = "", i = $(".exfee_pop_up .rsvp-info .setto i");
      switch (this.invitation.rsvp_status) {
       case "ACCEPTED":
        t = "DECLINED", i.toggleClass("icon-rsvp-accepted-blue", !1), i.toggleClass("icon-rsvp-declined-red", !0), 
        i.toggleClass("icon-rsvp-noresponse", !1);
        break;

       case "DECLINED":
        t = "NORESPONSE", i.toggleClass("icon-rsvp-accepted-blue", !1), i.toggleClass("icon-rsvp-declined-red", !1), 
        i.toggleClass("icon-rsvp-noresponse", !0);
        break;

       case "NORESPONSE":
       case "IGNORED":
       default:
        t = "ACCEPTED", i.toggleClass("icon-rsvp-accepted-blue", !0), i.toggleClass("icon-rsvp-declined-red", !1), 
        i.toggleClass("icon-rsvp-noresponse", !1);
      }
      $(".exfee_pop_up .rsvp-info .setto").attr("rsvp", t), $(".exfee_pop_up .rsvp-info .attendance").html(this.arrRsvp[this.invitation.rsvp_status][0]);
      for (var n = 1; 10 > n; n++) $(".exfee_pop_up .avatar-name .lt").toggleClass("icon10-plus-" + n, this.invitation.mates === n);
      switch ($(".exfee_pop_up .rsvp-info .by .name").html(e ? e.name : ""), $(".exfee_pop_up .invited .mates-num").html("+" + this.invitation.mates), 
      $(".exfee_pop_up .mates-edit .num").html(this.invitation.mates), e && this.invitation.identity.id !== e.id && "rsvp" === this.editing ? $(".exfee_pop_up .rsvp-info .by").show() : $(".exfee_pop_up .rsvp-info .by").hide(), 
      this.editing) {
       case "rsvp":
        $(".exfee_pop_up .rsvp-info").show(), $(".exfee_pop_up .rsvp-info .setto").show(), 
        $(".exfee_pop_up .invited").hide();
        break;

       case "mates":
        $(".exfee_pop_up .rsvp-info").hide(), $(".exfee_pop_up .invited").show(), $(".exfee_pop_up .invited .together-with").show(), 
        this.invitation.mates ? ($(".exfee_pop_up .mates-edit").show(), $(".exfee_pop_up .invited .mates-info").hide()) : ($(".exfee_pop_up .mates-edit").hide(), 
        $(".exfee_pop_up .invited .mates-info").show()), $(".exfee_pop_up .invited .mates-num").hide();
        break;

       default:
        $(".exfee_pop_up .rsvp-info").show(), $(".exfee_pop_up .rsvp-info .setto").hide(), 
        $(".exfee_pop_up .invited").show(), $(".exfee_pop_up .mates-edit").hide(), $(".exfee_pop_up .invited .together-with").hide(), 
        this.invitation.mates ? ($(".exfee_pop_up .invited .mates-num").show(), $(".exfee_pop_up .invited .mates-info").hide()) : ($(".exfee_pop_up .invited .mates-num").hide(), 
        readOnly ? $(".exfee_pop_up .invited .mates-info").hide() : $(".exfee_pop_up .invited .mates-info").show());
      }
      this.invitation.host ? ($(".exfee_pop_up .identities-list .delete i").hide(), $(".exfee_pop_up .identities-list .delete button").hide(), 
      $(".exfee_pop_up .identity-actions").hide()) : this.pre_delete ? ($(".exfee_pop_up .identities-list .delete i").hide(), 
      $(".exfee_pop_up .identities-list .delete button").show(), curIdentity && this.invitation.identity.id === curIdentity.id ? ($(".exfee_pop_up .identity-actions").show(), 
      $(".exfee_pop_up .identities-list .btn-leave").html("Leave")) : ($(".exfee_pop_up .identity-actions").hide(), 
      $(".exfee_pop_up .identities-list .btn-leave").html("Remove"))) : ($(".exfee_pop_up .identities-list .delete i").show(), 
      $(".exfee_pop_up .identities-list .delete button").hide(), $(".exfee_pop_up .identity-actions").hide());
    },
    bindEvents: function() {
      $(".exfee_pop_up .mates-add").bind("click", this.matesAdd), $(".exfee_pop_up .mates-minus").bind("click", this.matesMinus), 
      $(".exfee_pop_up .rsvp-info .setto").bind("click", this.rsvp), $(".exfee_pop_up .invited").bind("hover", function(e) {
        if (!readOnly) {
          switch (e.type) {
           case "mouseenter":
            ExfeePanel.editing = "mates";
            break;

           case "mouseleave":
            ExfeePanel.editing = "";
          }
          ExfeePanel.showRsvp();
        }
      }), $(".exfee_pop_up .rsvp-info").bind("hover", function(e) {
        switch (e.type) {
         case "mouseenter":
          ExfeePanel.editing = "rsvp";
          break;

         case "mouseleave":
          ExfeePanel.editing = "";
        }
        ExfeePanel.showRsvp();
      }), $(".exfee_pop_up .identities-list .delete i").bind("click", function(e) {
        e.stopPropagation(), ExfeePanel.pre_delete = !0, ExfeePanel.showRsvp();
      }), $(".exfee_pop_up .identities-list .delete button").bind("click", function() {
        ExfeeWidget.delExfee(ExfeePanel.invitation.identity), ExfeePanel.hidePanel();
      }), $(".exfee_pop_up .identity-actions .btn-cancel").bind("click", function() {
        ExfeePanel.pre_delete = !1, ExfeePanel.showRsvp();
      }), $(".exfee_pop_up").bind("click", function() {
        ExfeePanel.pre_delete = !1, ExfeePanel.showRsvp();
      }), $(".exfee_pop_up").on("click", "span.avatar > img", function() {
        window.open($(this).attr("src").replace(/\/(80_80)_/, "/original_"));
      }).on("mouseleave", function() {
        $(this).hide(144, function() {
          ExfeePanel.hidePanel();
        });
      });
    },
    matesAdd: function() {
      9 > ExfeePanel.invitation.mates && (ExfeeWidget.changeMates(ExfeePanel.invitation.identity, ++ExfeePanel.invitation.mates), 
      ExfeePanel.showRsvp());
    },
    matesMinus: function() {
      ExfeePanel.invitation.mates > 0 && (ExfeeWidget.changeMates(ExfeePanel.invitation.identity, --ExfeePanel.invitation.mates), 
      ExfeePanel.showRsvp());
    },
    rsvp: function() {
      var e = $(this).attr("rsvp");
      e && (ExfeePanel.invitation.rsvp_status = e, ExfeePanel.invitation.by_identity = ExfeUtilities.clone(curIdentity), 
      ExfeeWidget.rsvpExfee(ExfeePanel.invitation.identity, e), ExfeePanel.showRsvp());
    }
  };
}), define(function(e) {
  var t = e("jquery"), i = [], n = {
    title: "",
    description: "",
    by_identity: {
      id: 0
    },
    time: {
      begin_at: {
        date_word: "",
        date: "",
        time_word: "",
        time: "",
        timezone: "",
        id: 0,
        type: "EFTime"
      },
      origin: "",
      outputformat: 1,
      id: 0,
      type: "CrossTime"
    },
    place: {
      title: "",
      description: "",
      lng: "",
      lat: "",
      provider: "",
      external_id: "",
      id: 0,
      type: "Place"
    },
    attribute: {
      state: "published"
    },
    exfee_id: 0,
    widget: [ {
      image: "",
      widget_id: 0,
      id: 0,
      type: "Background"
    } ],
    relative: {
      id: 0,
      relation: ""
    },
    type: "Cross"
  }, r = {
    id: 0,
    type: "Exfee",
    invitations: []
  }, a = !1, s = function(e) {
    Cross.id && (t(".cross-opts .saving").show(), Api.request("editExfee", {
      type: "POST",
      resources: {
        exfee_id: Exfee.id
      },
      data: {
        by_identity_id: curIdentity.id,
        exfee: JSON.stringify(Exfee)
      }
    }, function() {
      t(".cross-opts .saving").hide(), e ? window.location.href = "/" : G.emit("app:cross:edited");
    }, function(e) {
      t(".cross-opts .saving").hide();
      var i = !e.meta || 401 !== e.meta.code && 403 !== e.meta.code ? "" : "no_permission";
      G.emit("app:cross:edited", {
        error: i
      });
    }));
  }, o = function(e) {
    if (T(), s(e), a) {
      for (var t, i, n = "·X· ", r = 3, o = [], l = 0; (t = Exfee.invitations[l++]) && (i = t.identity) && ("REMOVED" !== t.rsvp_status && r-- && o.push(i.name), 
      0 != r); ) ;
      n += o.join(", "), y(n);
    }
  }, l = function() {
    ExfeeCache.init(), ExfeeWidget.api_url = window._ENV_.api_url, window.GatherExfeeWidget = ExfeeWidget.make("gather-exfee", !0, o), 
    window.CrossExfeeWidget = ExfeeWidget.make("cross-exfee", !0, o);
  }, c = function(e) {
    if (e) {
      var i = {
        by_identity_id: curIdentity.id,
        content: e.substr(0, 233),
        id: 0,
        relative: [],
        type: "Post",
        via: "exfe.com"
      };
      t(".cross-opts .saving").show(), Api.request("addConversation", {
        resources: {
          exfee_id: Exfee.id
        },
        type: "POST",
        data: JSON.stringify(i)
      }, function(e) {
        M = e.post.created_at, t(".cross-opts .saving").hide(), N(e.post), G.emit("app:cross:edited");
      }, function(e) {
        t(".cross-opts .saving").hide();
        var i = !e.meta || 401 !== e.meta.code && 403 !== e.meta.code ? "" : "no_permission";
        G.emit("app:cross:edited", {
          error: i
        });
      });
    }
  }, d = function() {
    t("#cross-form-discard").bind("click", function() {
      window.location = "/";
    }), t("#cross-form-gather").bind("click", function() {
      if (curIdentity) {
        if (JSON.stringify(InitCross) === JSON.stringify(Cross) && 1 === Exfee.invitations.length) return !1;
        t(this).hasClass("disabled") || (t(this).prop("disabled", !0).toggleClass("disabled", !0), 
        U());
      } else {
        var e = t.trim(t("#gather-title").val());
        0 === e.length ? (t(".choose-identity .placeholder").addClass("text-error"), t(".add-identity").addClass("hide"), 
        t(".please-identity").removeClass("hide")) : t(".choose-identity .placeholder").trigger("click");
      }
    }), t(".cross-conversation .comment-form .pointer").bind("click", function() {
      var e = t(".cross-conversation .comment-form textarea");
      c(e.val()), e.val("");
    }), t(".cross-conversation .comment-form textarea").bind("keydown", function(e) {
      switch (e.which) {
       case 13:
        var i = t(this);
        e.shiftKey || (e.preventDefault(), c(i.val()), i.val(""));
      }
    });
  }, u = function() {
    var e = t("#gather-title");
    e.on("focus keydown keyup blur", function(t) {
      "keydown" === t.type && (a = !1), y(e.val(), "gather");
    });
  }, h = function(i) {
    if (t(".cross-container").length && !readOnly) {
      var n = Editing, r = i ? i.target : null, a = {
        title: [ function() {
          t(".cross-title").removeAttr("editable"), t(".cross-title .show").show(), y(t(".cross-title .edit").val(), "cross"), 
          t(".cross-title .edit").hide(), X();
        }, function() {
          t(".cross-title").attr("editable", !0), t(".cross-title .show").hide(), t(".cross-title .edit").show().focus();
        } ],
        description: [ function() {
          t(".cross-description-outer").removeAttr("editable"), t(".cross-description .show").show(), 
          t(".cross-description .edit").hide(), _(t(".cross-description .edit").val()), X();
        }, function() {
          t(".cross-description-outer").attr("editable", !0), t(".cross-description .show").hide(), 
          t(".cross-description .xbtn-more").hide(), t(".cross-description .edit").show().focus();
        } ],
        time: [ function() {
          var e = t("#date-panel");
          if (e.size()) {
            var i = e.data("widget-id"), r = App.widgetCaches[i];
            t.trim(t("#date-string").data("date")), ("date-panel" === n || "time" === n) && X(), 
            r && r.hide();
          }
          t(".cross-date").removeAttr("editable");
        }, function() {
          var i = t("#date-panel");
          if (!i.size()) {
            var n = e("datepanel"), r = new n({
              options: {
                parentNode: t("#app-tmp"),
                srcNode: t(".cross-date"),
                eftime: Cross.time
              }
            });
            r.show(), t(".cross-date").attr("editable", !0);
          }
        } ],
        place: [ function() {
          t(".cross-place").removeAttr("editable");
          var e = t("#map-panel");
          if (e.size()) {
            var i = e.data("widget-id"), r = App.widgetCaches[i];
            ("map-panel" === n || "place" === n) && (Cross.place = r.place, X()), r && r.hide();
          }
        }, function() {
          var i = t("#map-panel");
          if (!i.size()) {
            var n = e("mappanel"), r = new n({
              options: {
                parentNode: t("#app-tmp"),
                srcNode: t(".cross-place"),
                place: Cross.place
              },
              update: function(e) {
                E(e), P(e);
              }
            });
            r.show(), t(".cross-place").attr("editable", !0);
          }
        } ],
        rsvp: [ function() {
          A();
        }, function() {
          A(!0);
        } ],
        background: [ function() {}, function() {
          !i || "dblclick" !== i.type || !n && Cross.id || g(i ? i.shiftKey : !1);
        } ],
        exfee: [ function() {
          t("#cross-exfee .exfee-input").val() || (t("#cross-exfee .total").css("visibility", "hidden"), 
          t("#cross-exfee .thumbnails .avatar .rb").hide()), t("#gather-exfee .exfee-input").val() || t("#gather-exfee .thumbnails .avatar .rb").hide(), 
          ExfeeWidget.showLimitWarning(!1);
        }, function() {} ]
      };
      if (i) {
        var s = t(r).attr("editarea");
        switch (s) {
         case "rsvp":
         case "exfee":
          Editing = s;
        }
        if ("click" === i.type || "dblclick" === i.type && "background" === s) for (Editing = s; r && !Editing && "BODY" !== r.tagName; ) r = r.parentNode, 
        Editing = t(r).attr("editarea"); else Editing = "";
      }
      if ("background" === Editing) a.background[1](), Editing = n; else {
        if ("map-panel" === Editing) return;
        if ("date-panel" === Editing) return;
        for (var o in a) a[o][~~(o === Editing)]();
      }
    }
  }, p = function() {
    t("body").on("click save-cross", h), t("body").on("click.data-link", "[editarea]", h), 
    t("body").on("dblclick.data-link", '[editarea="background"]', h), t(".cross-title .edit").bind("focus keydown keyup blur", function(e) {
      if ("keydown" === e.type) switch (a = !1, e.which) {
       case 13:
        e.shiftKey || (e.preventDefault(), h());
      }
      y(t(e.target).val(), "cross");
    }), t(".cross-title, .cross-description-outer, .cross-date, .cross-place").bind("hover", function(e) {
      var i = e.type;
      Editing && "rsvp" !== Editing && ("mouseenter" !== i || t(this).attr("editable") ? t(this).removeClass("cross-hover") : t(this).addClass("cross-hover"));
    });
    var e = 0;
    t(".cross-description").bind("mousedown mouseup", function(t) {
      "mousedown" === t.type ? e = t.clientX + t.clientY : e -= t.clientX + t.clientY;
    }), t(".cross-description").bind("click", function() {
      if (!Editing && !e) {
        e = 0;
        var i = t(this), n = !i.hasClass("more");
        i.toggleClass("more", n).find(".xbtn-more").toggleClass("xbtn-less", n);
      }
    }), t(".cross-description .xbtn-more").bind("click", function(e) {
      e.stopPropagation();
      var i = !t(this).hasClass("xbtn-less");
      t(".cross-description").toggleClass("more", i), t(this).toggleClass("xbtn-less", i);
    }), t(".cross-description .editing").on("keydown", function(e) {
      var i = e.keyCode;
      switch (i) {
       case 27:
        t(this).val(Cross.description), t("body").trigger("save-cross");
        break;

       case 13:
        (e.ctrlKey || e.metaKey) && (e.preventDefault(), t("body").trigger("save-cross"));
      }
    }), t(".cross-rsvp").bind("mouseenter mouseover mouseleave", function(e) {
      if (!readOnly) switch (e.type) {
       case "mouseenter":
       case "mouseover":
        t(".cross-rsvp .show .accepted").hide(), t(".cross-rsvp .show .change").show(), 
        t(".cross-rsvp .show .by strong").html() && t(".cross-rsvp .show .by").show();
        break;

       case "mouseleave":
        t(".cross-rsvp .show .accepted").show(), t(".cross-rsvp .show .change").hide(), 
        t(".cross-rsvp .show .by").hide();
      }
    }), t(".cross-rsvp .edit .accept").bind("click", function() {
      ExfeeWidget.rsvpMe("ACCEPTED"), A();
    }), t(".cross-rsvp .edit .decline").bind("click", function() {
      ExfeeWidget.rsvpMe("DECLINED"), A();
    }), t(".cross-rsvp .edit .interested").bind("click", function() {
      ExfeeWidget.rsvpMe("INTERESTED"), A();
    }), t(".cross-place .edit").bind("keydown", function(e) {
      e.shiftKey && 13 === e.which && (e.which = 4);
    }), t(".cross-place .xbtn-more").bind("click", function(e) {
      e.stopPropagation();
      var i = !t(this).hasClass("xbtn-less");
      t(".cross-dp.cross-place > address").toggleClass("more", i), t(this).toggleClass("xbtn-less", i);
    }), t(".ids-popmenu > ol > li").live("mouseenter mousedown", function(e) {
      switch (e.type) {
       case "mouseenter":
        ExfeeWidget.selectCompleteItem(t(this).index());
        break;

       case "mousedown":
        ExfeeWidget.useCompleteItem(t(this).index()), t(".exfee-input").val("");
      }
    });
  }, f = function() {
    Cross.title.length || (Cross.title = "·X· " + (curIdentity ? curIdentity.name : ""));
  }, m = function() {
    var e = new Date(), i = V.formatDate(e.getFullYear() + "-" + (e.getMonth() + 1) + "-" + e.getDate());
    Cross.time = {
      begin_at: {
        date_word: "",
        date: i,
        time_word: "",
        time: "",
        timezone: ExfeUtilities.getTimezone(),
        id: 0,
        type: "EFTime"
      },
      origin: i,
      outputformat: 0,
      id: 0,
      type: "CrossTime"
    }, t(".cross-date .edit").val(i);
  }, g = function(e) {
    var t = ExfeUtilities.clone(window._ENV_.backgrounds);
    t.push("");
    for (var i = 0; Cross.widget.length > i && "Background" !== Cross.widget[i].type; i++) ;
    if (e) Cross.widget[i].image = ""; else {
      var n = Cross.widget[i].image;
      do Cross.widget[i].image = t[parseInt(Math.random() * t.length)]; while (n === Cross.widget[i].image);
    }
    $();
  }, v = function() {
    ExfeeWidget.addExfee(curIdentity, !0, "ACCEPTED");
  }, y = function(e, t) {
    Cross.title = ExfeUtilities.trim(e), x(t);
  }, _ = function(e) {
    Cross.description = ExfeUtilities.trim(e), w();
  }, b = function() {
    curIdentity && t(".choose-identity").html('<img src="' + curIdentity.avatar_filename + '">');
  }, x = function(e) {
    Cross.title.length && t(".choose-identity .placeholder").hasClass("text-error") && (t(".choose-identity .placeholder").removeClass("text-error"), 
    t(".add-identity").removeClass("hide"), t(".please-identity").addClass("hide"));
    var i = Cross.title.length ? ExfeUtilities.escape(Cross.title) : "Gathering for what?";
    switch (t(".cross-title .show").html(i), t(".cross-title").removeClass("single-line").removeClass("double-line"), 
    t(".cross-title h1").height() > 50 ? t(".cross-title").addClass("double-line").removeClass("single-line") : t(".cross-title").addClass("single-line").removeClass("double-line"), 
    document.title = "EXFE - " + Cross.title, e) {
     case "gather":
      t(".cross-title .edit").val(Cross.title);
      break;

     case "cross":
      t("#gather-title").val(Cross.title);
      break;

     default:
      t(".cross-title .edit").val(Cross.title), t("#gather-title").val(Cross.title);
    }
  }, w = function() {
    var e = t(".cross-description .xbtn-more").hasClass("xbtn-less"), i = "";
    t(".cross-description").toggleClass("more", !0), t(".cross-description .xbtn-more").toggleClass("xbtn-less", !1), 
    Cross.description ? (i = ExfeUtilities.escape(Cross.description).replace(/\r\n|\r|\n/g, "<br>"), 
    t(".cross-description .show").toggleClass("gray", !1).toggleClass("gsd", !1)) : (i = "Click here to describe something about this ·X·.", 
    t(".cross-description .show").toggleClass("gray", !0).toggleClass("gsd", !Cross.id)), 
    t(".cross-description .show").html() !== i && t(".cross-description .show").html(i), 
    t(".cross-description .show").height() > 180 ? (t(".cross-description").toggleClass("more", !1), 
    t(".cross-description .xbtn-more").show(), e && (t(".cross-description").toggleClass("more", !0), 
    t(".cross-description .xbtn-more").toggleClass("xbtn-less", !0))) : t(".cross-description .xbtn-more").hide(), 
    t(".cross-description .edit").val(Cross.description), Editing && "rsvp" !== Editing || Cross.description || !Cross.id ? t(".cross-description").show() : t(".cross-description").hide();
  }, k = function() {
    C(), D();
  }, C = function() {
    function e(e) {
      if (e = ExfeUtilities.trim(e)) {
        var t = e.split(":");
        if (2 === t.length) {
          var i = 60 * 60 * parseInt(t[0], 10), n = 60 * parseInt(t[1], 10);
          return i + (i > 0 ? n : -n);
        }
      }
      return null;
    }
    var i = e(Cross.time.begin_at.timezone), n = e(ExfeUtilities.getTimezone()), r = (i === n && window._ENV_.timevalid, 
    ""), a = "", s = "Pick a time.", o = !1;
    if (Cross.time.origin) {
      var l = V.printEFTime(Cross.time, "X");
      r = l.content, a = l.title;
    } else r = s, a = "Sometime", o = !0;
    t(".cross-date h2").html(a), t(".cross-time").html(r).toggleClass("gray", o);
  }, E = function(e) {
    t(".cross-dp.cross-place > h2").html(e.title ? ExfeUtilities.escape(e.title) : "Somewhere"), 
    t(".cross-dp.cross-place > address").toggleClass("more", !0), t(".cross-dp.cross-place .xbtn-more").toggleClass("xbtn-less", !1), 
    e.description ? t(".cross-dp.cross-place > address").html(ExfeUtilities.escape(e.description).replace(/\r\n|\r|\n/g, "<br>")).toggleClass("gray", !1) : t(".cross-dp.cross-place > address").html("Choose a place.").toggleClass("gray", !0), 
    t(".cross-dp.cross-place > address").height() > 80 ? (t(".cross-dp.cross-place > address").toggleClass("more", !1), 
    t(".cross-dp.cross-place .xbtn-more").show()) : t(".cross-dp.cross-place .xbtn-more").hide(), 
    e.description || e.title ? t(".cross-dp.cross-place > address").css("display", "none") : t(".cross-dp.cross-place > address").text("Choose a place.").css("display", "block");
  }, T = function() {
    window.GatherExfeeWidget.showAll(!0), window.CrossExfeeWidget.showAll(!1, !0);
  }, $ = function() {
    for (var e = 0; Cross.widget.length > e && "Background" !== Cross.widget[e].type; e++) ;
    t(".x-gather").toggleClass("no-bg", !1), t(".cross-background").css("background-image", "url(/static/img/xbg/" + (Cross.widget[e].image ? Cross.widget[e].image : "default.jpg") + ")");
  }, M = "", S = {}, I = function(e, t) {
    i = e;
    for (var n = i.length - 1; n >= 0; n--) n || (M = i[n].created_at), N(i[n], t);
  }, N = function(e, i) {
    if (void 0 === S[e.id]) {
      S[e.id] = !0;
      var n = ExfeUtilities.escape(e.content).replace(/\r\n|\n\r|\r|\n/g, "\n"), r = '<div class="avatar-comment"><span class="pull-left avatar"><img alt="" src="' + e.by_identity.avatar_filename + '" width="40" height="40" />' + "</span>" + '<div class="comment">' + "<p>" + '<span class="author"><strong>' + e.by_identity.name + "</strong>:&nbsp;</span>" + ExfeUtilities.escape(e.content).replace(/\r\n|\n\r|\r|\n/g, "<br>") + '<span class="pull-right date">' + '<time data-iso-time="' + V.toISO(e.created_at) + '"></time>' + "</span>" + "</p>" + "</div>" + "</div>";
      t(".conversation-timeline").prepend(r), i && window.webkitNotifications && 0 === window.webkitNotifications.checkPermission() && window.webkitNotifications.createNotification(null, "EXFE - " + Cross.title, e.by_identity.name + ": " + n).show();
    }
  }, D = function() {
    t("time[data-iso-time]").each(function() {
      var e = t(this);
      e.text(V(e.data("iso-time")));
    });
  }, A = function(e) {
    var i = ExfeeWidget.getMyInvitation();
    if (i) {
      var n = i.by_identity ? i.by_identity : curIdentity, r = i.identity.id === n.id;
      if ("NORESPONSE" === i.rsvp_status || "IGNORED" === i.rsvp_status || e) return r ? t(".cross-rsvp .edit .by").hide() : (t(".cross-rsvp .edit .by .avatar img").attr("src", i.by_identity.avatar_filename), 
      t(".cross-rsvp .edit .by strong").html(i.by_identity.name), t(".cross-rsvp .edit .by").show()), 
      t(".cross-rsvp .show").hide(), t(".cross-rsvp .edit").fadeIn(233), void 0;
      if ("ACCEPTED" === i.rsvp_status || "INTERESTED" === i.rsvp_status || "DECLINED" === i.rsvp_status) {
        var a = "";
        switch (i.rsvp_status) {
         case "ACCEPTED":
          a = "Accepted";
          break;

         case "DECLINED":
          a = "Unavailable";
          break;

         case "INTERESTED":
          a = "Interested";
        }
        r || "INTERESTED" === i.rsvp_status ? (t(".cross-rsvp .show .by").hide(), t(".cross-rsvp .show .by strong").html("")) : (t(".cross-rsvp .show .by .avatar img").attr("src", i.by_identity.avatar_filename), 
        t(".cross-rsvp .show .by strong").html(i.by_identity.name), t(".cross-rsvp .show .by").show());
        for (var s = ExfeeWidget.summary(), o = "", l = 0; Math.min(s.accepted_invitations.length, 5) > l; l++) o += '<li><span class="avatar alt40"><img height="20" width="20" alt="" src="' + s.accepted_invitations[l].identity.avatar_filename + '">' + (s.accepted_invitations[l].mates ? '<i class="icon10-plus-' + s.accepted_invitations[l].mates + '"></i>' : "") + "</span></li>";
        o += s.accepted ? "<li><span>" + s.accepted + " accepted.</span></li>" : "";
        var c = t(".cross-rsvp .show .accepted");
        return c.text() !== t(o).text() && c.html(o), t(".cross-rsvp .show .by").hide(), 
        t(".cross-rsvp .show .change").hide(), t(".cross-rsvp .show .attendance").html(a), 
        t(".cross-rsvp .show").fadeIn(233), t(".cross-rsvp .edit").hide(), void 0;
      }
    }
    t(".cross-rsvp .show").hide(), t(".cross-rsvp .edit").hide();
  }, P = function(e) {
    function i(i) {
      var n = i.coords;
      r = r.replace(/\{\{lat\}\}/gi, n.latitude).replace(/\{\{lng\}\}/gi, n.longitude).replace(/\{\{title\}\}/gi, ("" === e.provider ? n.latitude + "," + n.longitude + " " : "") + encodeURIComponent(e.title)), 
      t(".cross-map").append(r);
    }
    t(".cross-map").empty();
    var n = e.lat.length && e.lng.length, r = '<a target="_blank" href="https://maps.google.com/maps?key=' + _ENV_.MAP_KEY + '&q={{title}}&hl=en&ie=UTF8&sll={{lat}},{{lng}}&t=m&z=16"><img style="border-radius: 3px; box-shadow: 2px 2px 4px rgba(0, 0, 0, .25);" src="https://maps.googleapis.com/maps/api/staticmap?center={{lat}},{{lng}}&markers=icon%3a' + encodeURIComponent("http://img.exfe.com/web/map_pin_blue.png") + '%7C{{lat}},{{lng}}&zoom=13&size=280x140&maptype=road&sensor=false" alt="" width="280" height="140" /></a>';
    n && i({
      coords: {
        latitude: e.lat,
        longitude: e.lng
      }
    });
  }, O = function() {
    x(), w(), E(Cross.place), T(), $(), A(), P(Cross.place);
  }, L = function(e) {
    var t = {
      resources: {
        exfee_id: Exfee.id
      }
    };
    M && (t.params = {
      updated_at: M
    }), Api.request("conversation", t, function(t) {
      I(t.conversation, e);
    });
  }, z = function() {
    L(!0);
  }, H = function() {
    t("#conversation-form span.avatar img").attr("src", curIdentity.avatar_filename), 
    t("#conversation-form").show(), t(".conversation-timeline").html(""), t(".cross-conversation").slideDown(233), 
    M = "", S = {}, L(), convTimer = setInterval(z, 233e3);
  }, R = function(e, i) {
    Cross.id = e.id, Cross.title = e.title, Cross.description = e.description, Cross.time = e.time, 
    Cross.place = e.place, Cross.widget = e.widget, Cross.exfee_id = e.exfee.id, Exfee = e.exfee, 
    readOnly = i, K = W(), void 0 === Cross.time || void 0 === Cross.time.begin_at || Cross.time.begin_at.timezone || (Cross.time.begin_at.timezone = ExfeUtilities.getTimezone()), 
    t(".cross-date  .edit").val(Cross.time.origin), t(".cross-place .edit").val(Cross.place.title + (Cross.place.description ? "\n" + Cross.place.description : ""));
    for (var n = 0; Exfee.invitations.length > n; n++) if (ExfeeWidget.isMyIdentity(Exfee.invitations[n].identity)) {
      curIdentity = ExfeUtilities.clone(Exfee.invitations[n].identity);
      break;
    }
    O(), H();
  }, F = function(e) {
    Api.request("getCross", {
      resources: {
        cross_id: e
      }
    }, function(e) {
      R(e.cross, !1);
    }, function() {
      G.emit("app:cross:forbidden", e);
    });
  }, j = function() {
    window.Cross = ExfeUtilities.clone(n), window.Exfee = ExfeUtilities.clone(r);
  }, q = function() {
    a = !0, readOnly = !1, j(), g(), f(), m(), v(), O(), Y();
  }, U = function() {
    var e = ExfeUtilities.clone(Cross);
    e.exfee = ExfeUtilities.clone(Exfee), e.by_identity = {
      id: curIdentity.id
    }, Api.request("gather", {
      type: "POST",
      data: JSON.stringify(e),
      beforeSend: function() {
        t(".cross-opts .saving").show();
      },
      complete: function() {
        t(".cross-opts .saving").hide();
      }
    }, function(e) {
      document.location = "/#!" + e.cross.id;
    }, function() {
      t("#cross-form-gather").prop("disabled", !1).toggleClass("disabled", !1);
    });
  }, B = function() {
    t(".cross-opts .saving").show();
    var e = ExfeUtilities.clone(Cross);
    e.by_identity = {
      id: curIdentity.id
    }, Api.request("editCross", {
      type: "POST",
      resources: {
        cross_id: Cross.id
      },
      data: JSON.stringify(e)
    }, function() {
      t(".cross-opts .saving").hide(), G.emit("app:cross:edited");
    }, function(e) {
      t(".cross-opts .saving").hide();
      var i = !e.meta || 401 !== e.meta.code && 403 !== e.meta.code ? "" : "no_permission";
      G.emit("app:cross:edited", {
        error: i
      });
    });
  }, W = function() {
    return JSON.stringify({
      id: Cross.id,
      title: Cross.title,
      description: Cross.description,
      time: Cross.time.origin + ", " + Cross.time.begin_at.date + ", " + Cross.time.begin_at.time,
      place: {
        title: Cross.place.title,
        description: Cross.place.description,
        lat: Cross.place.lat,
        lng: Cross.place.lng,
        updated_at: Cross.place.updated_at
      },
      background: Cross.widget[0].image
    });
  }, X = function() {
    if (Cross.id) {
      var e = W();
      K !== e && (B(), K = e);
    }
  }, Y = function(e) {
    e ? (t(".cross-form").slideUp(233), t(".cross-edit").show(233)) : (b(), t("#gather").addClass("gathering-x"), 
    t(".cross-form").slideDown(233), t(".cross-edit").hide(233), t("#gather-title").select(), 
    t("#gather-title").focus());
  };
  window.Store = e("store"), window.Api = e("api"), window.webkitNotifications && window.webkitNotifications.requestPermission(function() {});
  var V = e("humantime");
  window.curIdentity = null, window.readOnly = !1;
  var G = e("bus"), K = "";
  G.on("xapp:cross:main", function() {
    var t = Store.get("authorization");
    window.User = t ? Store.get("user") : null, User && (Api.setToken(t.token), curIdentity = ExfeUtilities.clone(User.identities[0])), 
    j(), l(), d(), u(), Editing = "", p(), Marked = e("marked"), window.ExfeePanel = e("exfeepanel"), 
    window.showtimeTimer = setInterval(k, 50), window.convTimer = null;
  }), G.on("xapp:cross", function(e, t, i, n, r, a) {
    if (e > 0) F(e); else if (null === e) switch (t && (curIdentity = t, Api.setToken(r)), 
    R(i, n), a) {
     case "accept":
      ExfeeWidget.rsvpMe("ACCEPTED"), A();
      break;

     case "decline":
      ExfeeWidget.rsvpMe("DECLINED"), A();
    } else q(), window.InitCross = ExfeUtilities.clone(Cross);
  }), G.on("app:user:signin:after", function() {
    if (window.Cross && !window.Cross.id) {
      var e = Store.get("authorization");
      window.User = e ? Store.get("user") : null, User && (Api.setToken(e.token), curIdentity = ExfeUtilities.clone(User.identities[0]), 
      b(), v());
    }
  }), G.on("xapp:cross:end", function() {
    clearTimeout(window.showtimeTimer), clearTimeout(window.convTimer);
  }), t(document.body).on("hover", "div.lock-tag", function(e) {
    var i = e.type, n = t(this).offset();
    "mouseenter" === i ? t('<div class="tooltip tip-lock" id="app-tip-lock"><div class="inner"><div>This <span class="x">·X·</span> is private.</div><div>Accessible to only attendees.</div></div></div>').css({
      left: n.left - 135,
      top: n.top + 25
    }).appendTo(document.body) : t("#app-tip-lock").remove();
  });
});

var MD5 = function(e) {
  function t(e, t) {
    return e << t | e >>> 32 - t;
  }
  function i(e, t) {
    var i, n, r, a, s;
    return r = 2147483648 & e, a = 2147483648 & t, i = 1073741824 & e, n = 1073741824 & t, 
    s = (1073741823 & e) + (1073741823 & t), i & n ? 2147483648 ^ s ^ r ^ a : i | n ? 1073741824 & s ? 3221225472 ^ s ^ r ^ a : 1073741824 ^ s ^ r ^ a : s ^ r ^ a;
  }
  function n(e, t, i) {
    return e & t | ~e & i;
  }
  function r(e, t, i) {
    return e & i | t & ~i;
  }
  function a(e, t, i) {
    return e ^ t ^ i;
  }
  function s(e, t, i) {
    return t ^ (e | ~i);
  }
  function o(e, r, a, s, o, l, c) {
    return e = i(e, i(i(n(r, a, s), o), c)), i(t(e, l), r);
  }
  function l(e, n, a, s, o, l, c) {
    return e = i(e, i(i(r(n, a, s), o), c)), i(t(e, l), n);
  }
  function c(e, n, r, s, o, l, c) {
    return e = i(e, i(i(a(n, r, s), o), c)), i(t(e, l), n);
  }
  function d(e, n, r, a, o, l, c) {
    return e = i(e, i(i(s(n, r, a), o), c)), i(t(e, l), n);
  }
  function u(e) {
    for (var t, i = e.length, n = i + 8, r = (n - n % 64) / 64, a = 16 * (r + 1), s = Array(a - 1), o = 0, l = 0; i > l; ) t = (l - l % 4) / 4, 
    o = 8 * (l % 4), s[t] = s[t] | e.charCodeAt(l) << o, l++;
    return t = (l - l % 4) / 4, o = 8 * (l % 4), s[t] = s[t] | 128 << o, s[a - 2] = i << 3, 
    s[a - 1] = i >>> 29, s;
  }
  function h(e) {
    var t, i, n = "", r = "";
    for (i = 0; 3 >= i; i++) t = 255 & e >>> 8 * i, r = "0" + t.toString(16), n += r.substr(r.length - 2, 2);
    return n;
  }
  function p(e) {
    e = e.replace(/\r\n/g, "\n");
    for (var t = "", i = 0; e.length > i; i++) {
      var n = e.charCodeAt(i);
      128 > n ? t += String.fromCharCode(n) : n > 127 && 2048 > n ? (t += String.fromCharCode(192 | n >> 6), 
      t += String.fromCharCode(128 | 63 & n)) : (t += String.fromCharCode(224 | n >> 12), 
      t += String.fromCharCode(128 | 63 & n >> 6), t += String.fromCharCode(128 | 63 & n));
    }
    return t;
  }
  var f, m, g, v, y, _, b, x, w, k = [], C = 7, E = 12, T = 17, $ = 22, M = 5, S = 9, I = 14, N = 20, D = 4, A = 11, P = 16, O = 23, L = 6, z = 10, H = 15, R = 21;
  for (e = p(e), k = u(e), _ = 1732584193, b = 4023233417, x = 2562383102, w = 271733878, 
  f = 0; k.length > f; f += 16) m = _, g = b, v = x, y = w, _ = o(_, b, x, w, k[f + 0], C, 3614090360), 
  w = o(w, _, b, x, k[f + 1], E, 3905402710), x = o(x, w, _, b, k[f + 2], T, 606105819), 
  b = o(b, x, w, _, k[f + 3], $, 3250441966), _ = o(_, b, x, w, k[f + 4], C, 4118548399), 
  w = o(w, _, b, x, k[f + 5], E, 1200080426), x = o(x, w, _, b, k[f + 6], T, 2821735955), 
  b = o(b, x, w, _, k[f + 7], $, 4249261313), _ = o(_, b, x, w, k[f + 8], C, 1770035416), 
  w = o(w, _, b, x, k[f + 9], E, 2336552879), x = o(x, w, _, b, k[f + 10], T, 4294925233), 
  b = o(b, x, w, _, k[f + 11], $, 2304563134), _ = o(_, b, x, w, k[f + 12], C, 1804603682), 
  w = o(w, _, b, x, k[f + 13], E, 4254626195), x = o(x, w, _, b, k[f + 14], T, 2792965006), 
  b = o(b, x, w, _, k[f + 15], $, 1236535329), _ = l(_, b, x, w, k[f + 1], M, 4129170786), 
  w = l(w, _, b, x, k[f + 6], S, 3225465664), x = l(x, w, _, b, k[f + 11], I, 643717713), 
  b = l(b, x, w, _, k[f + 0], N, 3921069994), _ = l(_, b, x, w, k[f + 5], M, 3593408605), 
  w = l(w, _, b, x, k[f + 10], S, 38016083), x = l(x, w, _, b, k[f + 15], I, 3634488961), 
  b = l(b, x, w, _, k[f + 4], N, 3889429448), _ = l(_, b, x, w, k[f + 9], M, 568446438), 
  w = l(w, _, b, x, k[f + 14], S, 3275163606), x = l(x, w, _, b, k[f + 3], I, 4107603335), 
  b = l(b, x, w, _, k[f + 8], N, 1163531501), _ = l(_, b, x, w, k[f + 13], M, 2850285829), 
  w = l(w, _, b, x, k[f + 2], S, 4243563512), x = l(x, w, _, b, k[f + 7], I, 1735328473), 
  b = l(b, x, w, _, k[f + 12], N, 2368359562), _ = c(_, b, x, w, k[f + 5], D, 4294588738), 
  w = c(w, _, b, x, k[f + 8], A, 2272392833), x = c(x, w, _, b, k[f + 11], P, 1839030562), 
  b = c(b, x, w, _, k[f + 14], O, 4259657740), _ = c(_, b, x, w, k[f + 1], D, 2763975236), 
  w = c(w, _, b, x, k[f + 4], A, 1272893353), x = c(x, w, _, b, k[f + 7], P, 4139469664), 
  b = c(b, x, w, _, k[f + 10], O, 3200236656), _ = c(_, b, x, w, k[f + 13], D, 681279174), 
  w = c(w, _, b, x, k[f + 0], A, 3936430074), x = c(x, w, _, b, k[f + 3], P, 3572445317), 
  b = c(b, x, w, _, k[f + 6], O, 76029189), _ = c(_, b, x, w, k[f + 9], D, 3654602809), 
  w = c(w, _, b, x, k[f + 12], A, 3873151461), x = c(x, w, _, b, k[f + 15], P, 530742520), 
  b = c(b, x, w, _, k[f + 2], O, 3299628645), _ = d(_, b, x, w, k[f + 0], L, 4096336452), 
  w = d(w, _, b, x, k[f + 7], z, 1126891415), x = d(x, w, _, b, k[f + 14], H, 2878612391), 
  b = d(b, x, w, _, k[f + 5], R, 4237533241), _ = d(_, b, x, w, k[f + 12], L, 1700485571), 
  w = d(w, _, b, x, k[f + 3], z, 2399980690), x = d(x, w, _, b, k[f + 10], H, 4293915773), 
  b = d(b, x, w, _, k[f + 1], R, 2240044497), _ = d(_, b, x, w, k[f + 8], L, 1873313359), 
  w = d(w, _, b, x, k[f + 15], z, 4264355552), x = d(x, w, _, b, k[f + 6], H, 2734768916), 
  b = d(b, x, w, _, k[f + 13], R, 1309151649), _ = d(_, b, x, w, k[f + 4], L, 4149444226), 
  w = d(w, _, b, x, k[f + 11], z, 3174756917), x = d(x, w, _, b, k[f + 2], H, 718787259), 
  b = d(b, x, w, _, k[f + 9], R, 3951481745), _ = i(_, m), b = i(b, g), x = i(x, v), 
  w = i(w, y);
  var F = h(_) + h(b) + h(x) + h(w);
  return F.toLowerCase();
};

define("lightsaber", function(e, t, i) {
  "use strict";
  function n() {
    var e = new r();
    return g(e, _.prototype), e.request = new a(), e.response = new s(), e.init(), e;
  }
  function r() {}
  function a(e) {
    this.enableFullUrlPath = !!e, this.session = {}, this.path = "/", this.method = "GET", 
    this.updateUrl();
  }
  function s(e, t) {
    this.path = e, this.title = document.title, this.state = t || {};
  }
  function o(e) {
    e = e || {};
    var t = this;
    this.map = [], this.params = {}, this._params = [], this.caseSensitive = e.caseSensitive, 
    this.strict = e.strict, this.middleware = function(e, i, n) {
      t._dispatch(e, i, n);
    };
  }
  function l(e, t, i) {
    i = i || {}, this.path = e, this.callbacks = t, this.regexp = v(e, this.keys = [], i.sensitive, i.strict);
  }
  function c(e, t, i) {
    t = t || {}, this.name = e, this.root = t.root, this.engine = t.engine, this.ext = f(e), 
    this.timestamp = i || "", this.path = this.lookup(e);
  }
  function d(e) {
    return function(t, i, n) {
      t.app = i.app = e, t.next = n, i.locals = i.locals || m(i), n();
    };
  }
  function u() {
    return ++u.id;
  }
  function h(e, t, i) {
    var n = e.length;
    if (!n) return -1;
    if (i || (i = 0), i > n) return -1;
    for (0 > i && (i = Math.max(0, n + i)); n > i; ++i) if (i in e && e[i] === t) return i;
    return -1;
  }
  function p(e, t, i, n, r) {
    return x.get(t, function(t) {
      var a, s = t;
      "html" !== r && (a = e.compile(t), s = a(i)), n(s);
    });
  }
  function f(e) {
    return e.split(".")[1] || "html";
  }
  function m(e) {
    function t(e) {
      for (var i in e) t[i] = e[i];
      return e;
    }
    return e.viewCallbacks = e.viewCallbacks || [], t;
  }
  function g(e, t) {
    var i;
    if (e && t) for (i in t) e[i] = t[i];
    return e;
  }
  function v(e, t, i, n) {
    return e instanceof RegExp ? e : (M(e) && (e = "(" + e.join("|") + ")"), e = e.concat(n ? "" : "/?").replace(/\/\(/g, "(?:/").replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function(e, i, n, r, a, s, o) {
      return t.push({
        name: r,
        optional: !!s
      }), i = i || "", "" + (s ? "" : i) + "(?:" + (s ? i : "") + (n || "") + (a || n && "([^/.]+?)" || "([^/]+?)") + ")" + (s || "") + (o ? "(/*)?" : "");
    }).replace(/([\/.])/g, "\\$1").replace(/\*/g, "(.*)"), RegExp("^" + e + "$", i ? "" : "i"));
  }
  var y, _ = e("emitter"), b = /msie [\w.]+/.exec(navigator.userAgent.toLowerCase()), x = e("jquery") || e("zepto"), w = function(e, t) {
    return e ? function(i) {
      return e.call(t, i);
    } : void 0;
  }, k = window.location, C = window.history, E = "/", T = !1;
  x(window).on("load", function() {
    T = !0, setTimeout(function() {
      T = !1;
    }, 0);
  }), t = i.exports = n;
  var $;
  t.version = "0.0.5", $ = r.prototype, $.historySupport = y = null !== (null !== C ? C.pushState : void 0), 
  x.browser && x.browser.opera && ($.historySupport = y = !1), $.init = function() {
    this.route = E, this.stack = [], this.cache = {}, this.settings = {}, this.engines = {}, 
    this.viewCallbacks = [], this.defaultConfiguration();
  }, $.defaultConfiguration = function() {
    this.set("env", "production"), this.enable("dispatch"), this.use(d(this)), this._usedRouter = !1, 
    this._router = new o(this), this.routes = this._router.map, this._router.caseSensitive = this.enabled("case sensitive routing"), 
    this._router.strict = this.enabled("strict routing"), this.locals = m(this), this.locals.settings = this.settings, 
    this.configure("development", function() {
      this.set("env", "development");
    }), this.configure("production", function() {
      this.enable("view cache");
    });
  }, $.use = function(e, t) {
    return "string" != typeof e && (t = e, e = E), E !== e && E === e[e.length - 1] && (e = e.slice(0, -1)), 
    this.stack.push({
      route: e,
      handle: t
    }), this;
  }, $.engine = function(e, t) {
    if ("function" != typeof t) throw Error("callback function required");
    return "." !== e[0] && (e = "." + e), this.engines[e] = t, this;
  }, $.set = function(e, t) {
    return 1 !== arguments.length ? (this.settings[e] = t, this) : this.settings.hasOwnProperty(e) ? this.settings[e] : void 0;
  }, $.enabled = function(e) {
    return !!this.set(e);
  }, $.disabled = function(e) {
    return !this.set(e);
  }, $.enable = function(e) {
    return this.set(e, !0);
  }, $.disable = function(e) {
    return this.set(e, !1);
  }, $.configure = function(e, t) {
    var i = "all", n = [].slice.call(arguments);
    return t = n.pop(), n.length && (i = n), ("all" === i || ~h(i, this.settings.env)) && t.call(this), 
    this;
  }, $.render = function(e, t, i) {
    var n, r = {}, a = this.cache;
    if (this.engine, "function" == typeof t && (i = t, t = {}), g(r, this.locals), t.locals && g(r, t.locals), 
    g(r, t), r.cache = null === r.cache ? this.enabled("view cache") : r.cache, r.cache && (n = a[e]), 
    !n) {
      if (n = new c(e, {
        engine: this.set("view engine"),
        root: this.set("views")
      }, this.set("timestamp")), !n.path) {
        var s = Error('Failed to lookup view "' + e + '"');
        return s.view = n, i(s);
      }
      r.cache && (a[e] = n);
    }
    try {
      n.render(r, i);
    } catch (s) {
      i(s);
    }
  }, $.path = function() {
    return this.route;
  }, $.param = function(e, t) {
    var i, n = [].slice.call(arguments, 1), r = 0;
    if (M(e)) for (i = e.length; i > r; ++r) for (var a = 0, s = n.length; s > a; ++a) this.param(e[r], n[a]); else if ("function" == typeof e) this._router.param(e); else for (":" === e[0] && (e = e.substr(1)), 
    i = n.length; i > r; ++r) this._router.param(e, t);
    return this;
  }, $.initRouter = function() {
    this._usedRouter === !1 && (this._usedRouter = !0, this.use(this._router.middleware));
  }, $.get = function() {
    var e = [].slice.call(arguments);
    return this.initRouter(), this._router.route.apply(this._router, e);
  }, $.handle = function(e, t) {
    function i(o) {
      var l, c = n[s++];
      if (a && (e.url = e.url.substr(1), a = !1), e.url = r + e.url, c) try {
        if (l = e.url, 0 !== l.indexOf(c.route)) return i(o);
        var d = c.handle.length;
        r = c.route, e.url = e.url.substr(r.length), "/" !== e.url[0] && (e.url = "/" + e.url, 
        a = !0), o ? 4 === d ? c.handle(o, e, t, i) : i(o) : 4 > d ? c.handle(e, t, i) : i();
      } catch (u) {
        i(u);
      }
    }
    if (e.enableFullUrlPath || e.fullpath === e.path) {
      var n = this.stack, r = "", a = !1, s = 0;
      i();
    }
  }, $.run = function(e) {
    this.emit("launch"), e = e || {};
    var t = this.request, i = this.response;
    this.running || (this.running = !0, !1 === e.dispatch && this.disable("dispatch"), 
    !1 !== e.popstate && (this.historySupport && !b ? window.addEventListener("popstate", w(this.change, this), !1) : window.addEventListener("hashchange", w(this.change, this), !1)), 
    this.disabled("dispatch") || (this.handle(t, i), this.emit("launched")));
  }, $.change = function(e) {
    if (T) return T = !1;
    var t = this, i = t.request, n = t.response, r = i.url;
    return i.updateUrl(), r !== i.url ? (t.handle(i, n), e && (e.stopPropagation(), 
    e.preventDefault()), !1) : void 0;
  }, $.error = function(e, t) {
    var i = Error(t);
    return i.status = e, i;
  }, $ = a.prototype, $.updateUrl = function() {
    this.host = k.hostname, this.port = k.port || 80, this.fullpath = k.pathname, this.enableFullUrlPath && (this.path = this.fullpath), 
    this.hash = decodeURIComponent(k.hash), this.querystring = decodeURIComponent(k.search), 
    this.url = this.path + this.querystring + this.hash;
  }, $.param = function(e, t) {
    var i = this.params || {}, n = this.query || {};
    return null != i[e] && i.hasOwnProperty(e) ? i[e] : null != n[e] ? n[e] : t;
  }, $.getPath = function() {
    return this.path;
  }, $.getHost = function() {
    return this.host;
  }, $ = s.prototype, $.location = function(e) {
    window.setTimeout(function() {
      k.href = e;
    }, 16);
  }, $.redirect = function(e) {
    var t, i;
    return arguments.length, e = arguments[0], "back" === e || "forward" === e ? (C[e](), 
    void 0) : y ? (t = arguments[1], i = arguments[2] || {}, this.path = e, this.title = t || "EXFE.COM", 
    document.title = this.title, this.state = i, this.state.id = u(), this.pushState(), 
    this.app.change(), void 0) : (this.location(e), void 0);
  }, $.save = function() {
    C.replaceState(this.state, this.title, this.path);
  }, $.pushState = function() {
    C.pushState(this.state, this.title, this.path);
  }, $.render = function(e, t, i) {
    var n = this, t = t || {}, r = this.app;
    "function" == typeof t && (i = t, t = {}), t.locals = n.locals, r.render(e, t, i);
  }, $ = o.prototype, $.param = function(e, t) {
    if ("function" == typeof e) return this._params.push(e), void 0;
    var i, n, r = this._params, a = r.length;
    for (n = 0; a > n; ++n) (i = r[n](e, t)) && (t = i);
    if ("function" != typeof t) throw Error("invalid param() call for " + e + ", got " + t);
    return (this.params[e] = this.params[e] || []).push(t), this;
  }, $._dispatch = function(e, t, i) {
    var n = this.params, r = this;
    (function a(s, o) {
      function l(t) {
        a(e._route_index + 1, t);
      }
      function c(t) {
        v = 0, g = m[s++], p = g && e.params[g.name], h = g && n[g.name];
        try {
          "route" === t ? l() : t ? (s = 0, u(t)) : h && void 0 !== p ? d() : g ? c() : (s = 0, 
          u());
        } catch (t) {
          c(t);
        }
      }
      function d(i) {
        var n = h[v++];
        return i || !n ? c(i) : (n(e, t, d, p, g.name), void 0);
      }
      function u(i) {
        var n = f.callbacks[s++];
        try {
          if ("route" === i) l(); else if (i && n) {
            if (4 > n.length) return u(i);
            n(i, e, t, u);
          } else n ? n(e, t, u) : l(i);
        } catch (i) {
          u(i);
        }
      }
      var h, p, f, m, g, v = 0;
      return e.route = f = r.matchRequest(e, s), f ? (e.params = f.params, m = f.keys, 
      s = 0, c(o), void 0) : i(o);
    })(0);
  }, $.matchRequest = function(e, t) {
    var i, n = e.url, r = this.map, a = r.length;
    for (t = t || 0; a > t; ++t) if (i = r[t], i.match(n)) return e._route_index = t, 
    i;
  }, $.route = function(e) {
    e || Error("Router#get() requires a path");
    var t = [].slice.call(arguments, 1), i = new l(e, t, {
      sensitive: this.caseSensitive,
      strict: this.strict
    });
    return (this.map = this.map || []).push(i), this;
  }, $ = l.prototype, $.match = function(e) {
    this.regexp.lastIndex = 0;
    var t, i, n, r, a = this.keys, s = this.params = [], o = this.regexp.exec(e);
    if (!o) return !1;
    for (t = 1, i = o.length; i > t; ++t) n = a[t - 1], r = "string" == typeof o[t] ? decodeURIComponent(o[t]) : o[t], 
    n ? s[n.name] = r : s.push(r);
    return !0;
  }, $ = c.prototype, $.lookup = function(e) {
    return this.root + "/" + e + "?t=" + this.timestamp;
  }, $.render = function(e, t) {
    return p(this.engine, this.path, e, t, this.ext);
  }, u.id = 0;
  var M = Array.isArray;
  M || (M = function(e) {
    return e instanceof Array;
  });
}), define("middleware", function(e, t, i) {
  "use strict";
  function n() {
    var e = document.getElementsByTagName("head")[0], t = document.getElementsByName("authorization")[0], i = null;
    return t && (i = JSON.parse(t.content), e.removeChild(t)), i;
  }
  var r = e("bus"), a = e("store"), s = e("jquery"), o = i.exports = {};
  o.basicAuth = function(e, t, i) {
    var r = e.session, s = a.get("authorization"), o = a.get("user"), l = n(), c = l && l.authorization, d = l && l.data, u = l && l.event;
    !s || l && c ? !s && c && d && !u ? (a.set("oauth", r.oauth = {
      identity: d.identity,
      following: "twitter" === d.identity.provider ? !!d.twitter_following : !1,
      identity_status: d.identity_status
    }), delete r.user, a.remove("user"), a.set("authorization", r.authorization = c)) : s && c && d && !u && (s.user_id === c.user_id && s.token !== c.token ? (s.token = c.token, 
    a.set("authorization", r.authorization = s)) : s.user_id !== c.user_id && s.token !== c.token && d.identity && (a.set("oauth", r.oauth = {
      identity: d.identity,
      following: "twitter" === d.identity.provider ? !!d.twitter_following : !1,
      identity_status: d.identity_status
    }), delete r.user, a.remove("user"), a.set("authorization", r.authorization = c))) : (r.authorization = s, 
    r.user = o), l && (u && (r.event = JSON.parse(u), r.event.data = d), l.verification_token && (r.verification_token = l.verification_token), 
    l.refere && l.refere !== window.location.protocol + "//" + window.location.hostname + "/" && t.redirect(l.refere || "/")), 
    i();
  }, o.errorHandler = function(e, t) {
    var i = /^\/404/;
    if (i.exec(window.location.pathname)) {
      r.emit("app:page:home", !1, !0);
      var n = a.get("authorization");
      if (r.emit("app:page:usermenu", !!n), n) {
        var s = a.get("user");
        r.emit("app:usermenu:updatenormal", s), r.emit("app:usermenu:crosslist", n.token, n.user_id);
      }
    } else t.location("/404");
  }, o.cleanupAppTmp = function(e, t, i) {
    var n = s("#app-tmp");
    n.find("[data-widget-id]").trigger("destory.widget"), n.children().off().remove(), 
    s(".x-tmp").off().remove(), i();
  }, o.fixedFaceBookURL = function(e, t, i) {
    "#_=_" === window.location.hash && (window.location.hash = "", e.updateUrl(), s.browser.mozilla) || i();
  };
}), define("routes", function(e, t, i) {
  "use strict";
  function n(e, t) {
    function i(e, t) {
      var i = o.printExtUserName(e.identities[0]);
      t.redirect("/#" + i.replace(/ /g, ""));
    }
    var n = e.session, r = l.get("user");
    if (r) return i(r, t), void 0;
    var a = n.authorization;
    s.emit("app:user:signin", a.token, a.user_id, !0);
  }
  var r = e("rex"), a = e("api"), s = e("bus"), o = e("util"), l = e("store");
  e("user");
  var c = i.exports = {};
  c.index = function(e, t) {
    return e.session.authorization ? (n(e, t), void 0) : (s.emit("app:page:home", !0), 
    t.render("home.html", function(t) {
      $("#app-main").append(t), $.ajax({
        dataType: "script",
        cache: !0,
        url: "/static/js/newhome/0.0.1/newhome.min.js?t=" + e.app.set("timestamp")
      });
    }), void 0);
  }, c.gather = function(e, t) {
    var i = e.session;
    if (s.emit("app:page:home", !1), !i.initMenuBar) {
      var n = i.authorization, r = i.user;
      s.emit("app:page:usermenu", !!n), n && (i.initMenuBar = !0, s.emit("app:usermenu:updatenormal", r), 
      s.emit("app:usermenu:crosslist", n.token, n.user_id));
    }
    t.render("x.html", function(e) {
      $("#app-main").append(e), s.emit("xapp:cross:main"), s.emit("xapp:cross", 0);
    });
  }, c.resolveToken = function(e, t, i) {
    e.origin = "resolveToken";
    var n = e.params[0];
    s.emit("app:page:home", !1), s.emit("app:page:usermenu", !0), n ? i() : t.redirect("/#invalid/token=" + n);
  }, c.inspectResolveToken = function(e, t, i, n, r) {
    var a = e.session, c = a.user, d = a.authorization;
    a.originToken = r, a.resolveData = n;
    var u, h = n.token, p = n.user_id, f = n.user_name, m = null, g = n.token_type, v = n.action;
    !m && (d && d.user_id === p || !d && "VERIFY" === g && "VERIFIED" === v) ? (d = {
      token: h,
      user_id: p
    }, l.set("authorization", a.authorization = d), a.auto_sign = "INPUT_NEW_PASSWORD" !== v) : a.browsing_authorization = u = n, 
    s.emit("app:api:getuser", h, p, function(e) {
      var t = e.user;
      if (a.resolveData.setup = "INPUT_NEW_PASSWORD" === v && "VERIFY" === g && t.password === !1, 
      u) {
        a.browsing_user = t;
        var n, p = o.printExtUserName(t.identities[0]);
        n = d ? "/#" + p + "/token=" + r : "/#" + p, s.emit("app:usermenu:updatebrowsing", {
          normal: c,
          browsing: t,
          action: v,
          setup: "INPUT_NEW_PASSWORD" === v && "VERIFY" === g && t.password === !1,
          originToken: r,
          tokenType: "user",
          token: h,
          page: "resolve",
          readOnly: !0,
          user_name: f || t.name,
          mergeable_user: m,
          forward: n
        }, "browsing_identity");
      } else l.set("user", c = a.user = e.user), s.emit("app:usermenu:updatenormal", c), 
      s.emit("app:usermenu:crosslist", d.token, d.user_id);
      i();
    });
  }, c.resolveRequest = function(e, t, i) {
    var n = e.session, r = e.params[0];
    n.originToken = r, a.request("resolveToken", {
      type: "POST",
      data: {
        token: r
      }
    }, function(n) {
      c.inspectResolveToken(e, t, i, n, r);
    }, function() {
      t.redirect("/#invalid/token=" + r);
    });
  }, c.resolveShow = function(e, t) {
    s.emit("app:page:home", !1), s.emit("app:page:usermenu", !0);
    var i = e.session, n = i.auto_sign, a = i.originToken, o = i.user, l = i.authorization, c = i.browsing_authorization, d = i.browsing_user, u = i.resolveData, h = u.identity_id, p = u.token_type, f = null, m = u.action, g = "identity_verified.html";
    if (f) return t.render(g, function(e) {
      var t = $("#app-main");
      t.append(e);
      var i = $('<div id="js-dialog-merge" data-destory="true" data-widget="dialog" data-dialog-type="mergeidentity">');
      i.data("source", {
        merged_identity: r.find(d.identities, function(e) {
          return e.id === h ? !0 : void 0;
        }),
        browsing_token: a,
        mergeable_user: f
      }), i.appendTo($("#app-tmp")), i.trigger("click.dialog.data-api"), $(".modal-mi").css("top", 230);
    }), void 0;
    if (n && l && !c) return delete i.auto_sign, t.render(g, function(e) {
      var i = $("#app-main");
      i.append(e), i.find(".tab01").removeClass("hide"), i.find(".tab01 > p").animate({
        opacity: 0
      }, 2333, function() {
        t.redirect("/");
      });
    }), void 0;
    if (!n && "VERIFY" === p && "VERIFIED" === m) return t.render(g, function(e) {
      var t = $("#app-main");
      t.append(e), $("#app-browsing-identity").trigger("click.data-api"), $(".modal-bi").css("top", 200);
    }), void 0;
    if ("INPUT_NEW_PASSWORD" === m) {
      var v;
      "SET_PASSWORD" === p && (g = "forgot_password.html"), t.render(g, function(e) {
        $("#app-main").append(e), l && !c ? (r.find(o.identities, function(e) {
          return e.id === h ? !0 : void 0;
        }), "VERIFY" === p ? (v = $('<div class="merge setup" data-destory="true" data-user-action="setup" data-widget="dialog" data-dialog-type="setup_verification" data-redirect="true">'), 
        v.data("source", {
          browsing_user: o,
          originToken: a,
          user_name: u.user_name,
          tokenType: "user"
        })) : "SET_PASSWORD" === p && (v = $('<div class="setpassword" data-destory="true" data-widget="dialog" data-dialog-type="setpassword" data-redirect="true">'), 
        v.data("source", {
          user: o,
          token: u.setup ? l.token : a,
          setup: u.setup
        })), v.appendTo($("#app-tmp")), v.trigger("click.dialog.data-api")) : "VERIFY" === p ? (s.once("app:user:signin:after", function() {
          var e = $('<div class="addidentity" data-destory="true" data-widget="dialog" data-dialog-type="addIdentityAfterSignIn">');
          e.data("source", {
            identity: d.identities[0]
          }), e.appendTo($("#app-tmp")), e.trigger("click.dialog.data-api");
        }), $("#app-user-menu").find(".setup").trigger("click.dialog.data-api")) : (v = $('<div class="setpassword" data-destory="true" data-widget="dialog" data-dialog-type="setpassword" data-redirect="true">'), 
        v.data("source", {
          user: d,
          token: u.setup ? c.token : a,
          setup: u.setup
        }), v.appendTo($("#app-tmp")), v.trigger("click.dialog.data-api")), $(".modal-su, .modal-sp, .modal-bi").css("top", 250);
      });
    }
    delete i.browsing_authorization, delete i.resolveData, delete i.originToken;
  }, c.cross = function(e, t) {
    var i = e.session, n = i.authorization, r = i.user;
    if (!n) return s.emit("app:page:home", !1), s.emit("app:page:usermenu", !1), s.emit("app:cross:forbidden", e.params[0], null), 
    void 0;
    s.emit("app:page:home", !1), s.emit("app:page:usermenu", !0), i.initMenuBar || (s.emit("app:usermenu:updatenormal", r), 
    s.emit("app:usermenu:crosslist", n.token, n.user_id));
    var a = e.params[0];
    t.render("x.html", function(e) {
      $("#app-main").append(e), s.emit("xapp:cross:main"), s.emit("xapp:cross", a);
    });
  }, s.on("app:cross:forbidden", function(e, t) {
    $("#app-main").load("/static/views/forbidden.html", function() {
      var e = l.get("authorization"), i = {
        options: {
          keyboard: !1,
          backdrop: !1,
          viewData: {
            cls: "modal-id"
          }
        }
      };
      if (t && $(".sign-in").data("source", t.external_username), e) {
        var n = l.get("user");
        $(".details").removeClass("hide"), $(".details .avatar img").attr("src", n.avatar_filename), 
        $(".details .identity-name").text(n.name), $(".please-access").removeClass("hide"), 
        $(".modal-id").css({
          top: 380
        });
      } else $(".sign-in").data("dialog-settings", i), $(".sign-in").trigger("click.dialog.data-api"), 
      $(".sign-in").data("dialog-settings", null), $(".popmenu").addClass("hide"), $(".please-signin").removeClass("hide"), 
      $(".modal-id").css("top", 260);
    });
  }), c.crossInvitation = function(e, t) {
    var i = e.session, n = i.authorization, l = i.user, c = l && l.id, d = e.params[0], u = e.params[1];
    s.emit("app:page:home", !1), s.emit("app:page:usermenu", !!n), n && (s.emit("app:usermenu:updatenormal", l), 
    s.emit("app:usermenu:crosslist", n.token, n.user_id)), a.request("getInvitationByToken", {
      type: "POST",
      resources: {
        cross_id: d
      },
      data: {
        token: u
      }
    }, function(e) {
      var i, a = e.invitation, u = a.identity, h = a.by_identity;
      return c && (i = r.find(l.identities, function(e) {
        return e.connected_user_id === u.connected_user_id && e.id === u.id ? !0 : void 0;
      })) ? (t.redirect("/#!" + d), void 0) : "email" === u.provider ? (s.emit("app:cross:forbidden", d, u), 
      void 0) : (t.render("invite.html", function(e) {
        $("#app-main").append(e), n ? ($(".please-access").removeClass("hide"), $(".form-horizontal").addClass("fh-left"), 
        $(".details").removeClass("hide"), $(".details .avatar img").attr("src", l.avatar_filename), 
        $(".details .identity-name").text(l.name)) : $(".please-signin").removeClass("hide"), 
        $(".invite-to").find("img").attr("src", u.avatar_filename).parent().next().text(o.printExtUserName(u)), 
        $(".invite-from").find("img").attr("src", h.avatar_filename).parent().next().text(o.printExtUserName(h));
        var t = $(".x-invite").find(".redirecting"), i = t.next(), r = !1, a = u.provider;
        $(".xbtn-authenticate").attr("data-oauth", a).on("click", function(e) {
          if (e.stopPropagation(), e.preventDefault(), !r) {
            var n = $(this).data("oauth");
            $.ajax({
              url: "/OAuth/Authenticate?provider=" + n,
              type: "POST",
              dataType: "JSON",
              data: {
                refere: window.location.href
              },
              beforeSend: function() {
                r = !0, i.addClass("hide"), t.removeClass("hide");
              },
              success: function(e) {
                r = !1;
                var n = e.meta.code;
                200 === n ? window.location.href = e.response.redirect : (t.addClass("hide"), i.removeClass("hide"));
              }
            });
          }
        });
      }), void 0);
    }, function(e) {
      404 === e.meta.code && t.location("/404");
    });
  };
  var d = function(e, t, i, n, r, o, c, d, u) {
    var h = t.session, p = h.authorization, f = h.user, m = p && p.user_id || 0;
    a.request("getCrossByInvitationToken", {
      type: "POST",
      params: n,
      data: r
    }, function(t) {
      var i = t.authorization, n = t.browsing_identity, r = i && i.user_id || n && n.connected_user_id, a = t.cross_access_token, f = t.read_only, g = t.action, v = t.cross;
      s.emit("app:page:home", !1), s.emit("app:page:usermenu", !0), !1 === f && a && (o || (o = {}), 
      c = o[d] = a, l.set("cats", o));
      var y = function() {
        e.render("x.html", function(e) {
          if ($("#app-main").empty().append(e), s.emit("xapp:cross:main"), s.emit("xapp:cross", null, n, v, f, c || d, u), 
          "mute" === u) {
            var t = $('<div id="js-dialog-unsubscribe" data-destory="true" data-widget="dialog" data-dialog-type="unsubscribe">');
            t.data("source", v), t.appendTo($("#app-tmp")), t.trigger("click.dialog.data-api");
          }
        });
      };
      if (!i && f) s.emit("app:usermenu:updatebrowsing", {
        browsing: {
          identities: [ n ],
          name: n.name
        },
        action: g,
        readOnly: f,
        page: "cross",
        code: 1
      }); else {
        if ((p && m === r || !p && (p = i)) && r > 0 || p && !f && !n) return l.set("authorization", h.authorization = p), 
        s.once("app:user:signin:after", function() {
          e.redirect("/#!" + v.id);
        }), s.emit("app:user:signin", p.token, p.user_id), void 0;
        if (!f && (c || i)) {
          var _ = {
            browsing: {
              user_id: n.connected_user_id,
              identities: [ n ],
              name: n.name
            },
            originToken: d,
            action: g,
            readOnly: f,
            tokenType: "invitation",
            setup: "SETUP" === g,
            page: "cross",
            code: 2
          };
          c && (_.tokenType = "cross", _.cross_access_token = c), s.emit("app:usermenu:updatebrowsing", _);
        }
      }
      y();
    }, function(t) {
      var i = t && t.meta && t.meta.code, n = !!p;
      403 === i ? (s.emit("app:page:home", !1), s.emit("app:page:usermenu", n), n && (s.emit("app:usermenu:updatenormal", f), 
      s.emit("app:usermenu:crosslist", p.token, p.user_id)), s.emit("app:cross:forbidden", null, null)) : 404 === i && e.location("/404");
    });
  };
  c.crossToken = function(e, t, i) {
    var n, r, a = e.session, s = a.authorization, o = s && s.token, c = e.params[0], u = e.params[1], h = l.get("cats"), p = {};
    o && (p.token = o), h && (n = h[c]), r = {
      invitation_token: c
    }, n && (r.cross_access_token = n), d(t, e, i, p, r, h, n, c, u);
  }, c.crossPhoneToken = function(e, t, i) {
    var n, r, a = e.session, s = a.authorization, o = s && s.token, c = e.params[0], u = e.params[1], h = e.params[2] || "", p = l.get("cats"), f = {};
    o && (f.token = o), p && (n = p[u]), r = {
      invitation_token: u,
      cross_id: c
    }, n && (r.cross_access_token = n), d(t, e, i, f, r, p, n, u, h);
  }, c.profile = function(e, t) {
    var i = e.session, n = i.authorization, r = i.user, a = i.browsing_authorization, c = i.browsing_user, d = i.action, u = i.oauth;
    s.emit("app:page:home", !1);
    var h = e.params[2], p = h && h.match(o.tokenRegExp), f = p && p[1];
    return f && !a ? (t.redirect("/#token=" + f), void 0) : (n || a ? (document.title = "EXFE - Profile", 
    s.emit("app:page:usermenu", !0), n && !a ? (s.emit("app:usermenu:updatenormal", r), 
    s.emit("app:usermenu:crosslist", n.token, n.user_id), t.render("profile.html", function(e) {
      $("#app-main").data("event", i.event), delete i.event, $("#app-main").append(e), 
      s.emit("app:profile:identities", r);
      var t = $.Deferred(), a = $.Event("click.dialog.data-api");
      t.resolve(n), s.emit("app:profile:show", t), u ? ("connected" !== u.identity_status && (a.following = u.following, 
      a.identity = u.identity, a.token = n.token, $('<div id="app-oauth-welcome" class="hide" data-widget="dialog" data-dialog-type="welcome" data-destory="true"></div>').appendTo($("#app-tmp")).trigger(a)), 
      l.remove("oauth"), delete i.oauth) : i.verification_token && ($('<div id="app-oauth-resetpassword" class="hide" data-widget="dialog" data-dialog-type="setpassword" data-destory="true" data-redirect="false"></div>').data("token", i.verification_token).appendTo($("#app-tmp")).trigger(a), 
      delete i.verification_token);
    })) : a ? ($(document.body).attr("data-browsing"), s.emit("app:usermenu:updatebrowsing", {
      normal: r,
      browsing: c,
      action: d,
      setup: "INPUT_NEW_PASSWORD" === d,
      originToken: i.originToken,
      tokenType: "user",
      page: "profile"
    }, "browsing_identity"), delete i.originToken, t.render("profile.html", function(e) {
      $("#app-main").append(e), s.emit("app:profile:identities", c);
      var t = $.Deferred();
      t.resolve(a), s.emit("app:profile:show", t);
    })) : t.redirect("/")) : t.redirect("/"), void 0);
  }, c.invalid = function(e, t) {
    var i = e.session, n = i.authorization, r = i.user;
    document.title = "EXFE - Invalid Link", s.emit("app:page:home", !1), n ? (s.emit("app:page:usermenu", !0), 
    s.emit("app:usermenu:updatenormal", r), s.emit("app:usermenu:crosslist", n.token, n.user_id)) : s.emit("app:page:usermenu", !1), 
    t.render("invalid.html", function(e) {
      $("#app-main").append(e);
    });
  }, c.signout = function() {
    l.remove("cats"), l.remove("user"), l.remove("authorization"), window.location.href = "/";
  }, c.refreshAuthUser = function(e, t, i) {
    var n = e.session, r = n.authorization;
    return r ? (s.emit("app:api:getuser", r.token, r.user_id, function(e) {
      var t = e.user;
      return l.set("user", n.user = t), 0 === t.identities.length ? (c.signout(), void 0) : (i(), 
      void 0);
    }, function(e) {
      var t = e && e.meta && e.meta.code;
      401 === t && (l.remove("user"), l.remove("authorization"), delete n.user, delete n.authorization), 
      i();
    }), void 0) : (i(), void 0);
  };
}), define(function(e) {
  "use strict";
  var t = window._ENV_, i = e("handlebars"), n = e("middleware"), r = e("routes"), a = e("lightsaber"), s = window.App = a(), o = e("widget");
  s.widgetCaches = o.caches, s.use(n.fixedFaceBookURL), s.use(n.basicAuth), s.use(n.cleanupAppTmp), 
  s.initRouter(), s.use(n.errorHandler), s.set("timestamp", t.timestamp), s.set("view cache", !0), 
  s.set("view engine", i), s.set("views", "/static/views"), s.get(/^\/+(?:\?)?(?:ipad)?#{0,}$/, r.index), 
  s.get(/^\/+\?t=([a-zA-Z0-9]{3,})$/, function(e, t, i) {
    var n = function() {
      var e = document.getElementsByTagName("head")[0], t = document.getElementsByName("sms-token")[0], i = null;
      return t && (i = JSON.parse(t.content), e.removeChild(t)), i;
    }, a = n(), s = e.params[0];
    a ? r.inspectResolveToken(e, t, i, a, s) : t.redirect("/#invalid/token=" + s);
  }, r.resolveShow), s.get(/^\/+(?:\?)?(?:ipad)?#gather\/?$/, r.refreshAuthUser, r.gather), 
  s.get(/^\/+(?:\?)?(?:ipad)?#token=([a-zA-Z0-9]{64})\/?$/, r.resolveToken, r.resolveRequest, r.resolveShow), 
  s.get(/^\/+(?:\?)?(?:ipad)?#!([1-9][0-9]*)\/?$/, r.refreshAuthUser, r.cross), s.get(/^\/+(?:\?)?(?:ipad)?#!([1-9][0-9]*)\/([a-zA-Z0-9]{3})\/?$/, r.refreshAuthUser, r.crossInvitation), 
  s.get(/^\/+(?:\?)?(?:ipad)?#!([1-9][0-9]*)\/([a-zA-Z0-9]{4})(?:\/(accept|mute|decline))?\/?$/, r.refreshAuthUser, r.crossPhoneToken), 
  s.get(/^\/+(?:\?)?(?:ipad)?#!token=([a-zA-Z0-9]{32})\/?$/, r.refreshAuthUser, r.crossToken), 
  s.get(/^\/+(?:\?)?(?:ipad)?#!token=([a-zA-Z0-9]{32})\/(accept|mute|decline)\/?$/, r.refreshAuthUser, r.crossToken), 
  s.get(/^\/+(?:\?)?(?:ipad)?#(?:@?([^\/\s\!=]+))?@([^@\/\s]+)(?:\/?(.*))\/?$/, r.refreshAuthUser, r.profile), 
  s.get(/^\/+(?:\?)?(?:ipad)?#(\+)(1\d{10}|86\d{11})(?:\/?(.*))\/?$/, r.refreshAuthUser, r.profile), 
  s.get(/^\/+(?:\?)?(?:ipad)?#invalid\/token=([a-zA-Z0-9]{64})\/?$/, r.invalid), s.get(/^\/+(?:\?)?(?:ipad)?#signout\/?$/, r.signout), 
  s.run();
});