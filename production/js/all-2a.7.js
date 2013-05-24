/*! EXFE.COM QXdlc29tZSEgV2UncmUgaHVudGluZyB0YWxlbnRzIGxpa2UgeW91LiBQbGVhc2UgZHJvcCB1cyB5b3VyIENWIHRvIHdvcmtAZXhmZS5jb20uCg== */
/*! desktop@2a.7 2013-05-24 04:05:27 */
(function(e) {
  "use strict";
  function t(e, t, n) {
    var r = arguments.length;
    1 === r ? (n = e, e = void 0) : 2 === r && (n = t, t = void 0);
    var o = new a(e, t, n);
    e ? s[e] = o : n.call(o, i, o.exports, o);
  }
  function i(e) {
    var t = s[e];
    return t ? (t.exports || n(t), t.exports) : null;
  }
  function n(e) {
    var t, n = e.factory;
    delete e.factory, t = n(i, e.exports = {}, e), t && (e.exports = t);
  }
  function a(e, t, i) {
    this.id = e, this.uri = void 0, this.deps = t, "string" == typeof i && (i = Function("require", "exports", "module", i)), 
    this.factory = i, this.exports = void 0, this.filename = null, this.parent = void 0, 
    this.loaded = !1;
  }
  t.amd = {
    jQuery: !0
  }, e.define = t, a.prototype.constructor = a;
  var s = a.__cache = {};
})(this), define("class", function() {
  "use strict";
  function e(i) {
    return this instanceof e || !r(i) ? void 0 : t(i);
  }
  function t(t) {
    return t.extend = e.extend, t.implement = a, t;
  }
  function i(i, n, a, r, l) {
    function d() {
      i.apply(this, arguments), this.constructor === d && this.initialize && (this.initialize.apply(this, arguments), 
      this.initialized = !0);
    }
    return r = i.prototype, i !== e && s(d, i), d.Extends = i, l = o(r), n && s(l, n), 
    d.prototype = l, a && s(d, a), d.superclass = r, d.prototype.constructor = d, t(d);
  }
  function n() {}
  function a(e) {
    var t, i = this.prototype;
    for (t in e) i[t] = e[t];
  }
  function s(e, t) {
    var i;
    for (i in t) e[i] = t[i];
  }
  function r(e) {
    return "[object Function]" === l.call(e);
  }
  e.create = function(t, n) {
    return r(t) || (n = t, t = null), n || (n = {}), t || (t = n.Extends || e), i(t, n);
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
    var a, s, r;
    if (!i) return this;
    for (e = e.split(t), a = this.__callbacks || (this.__callbacks = {}); s = e.shift(); ) r = a[s] || (a[s] = []), 
    i.__context = n, r[r.length] = i;
    return this;
  }, e.prototype.once = function(e, i, n) {
    var a, s, r;
    if (!i) return this;
    for (e = e.split(t), a = this.__callbacks || (this.__callbacks = {}); s = e.shift(); ) r = a[s] || (a[s] = []), 
    i.__once = !0, i.__context = n, r[r.length] = i;
    return this;
  }, e.prototype.off = function(e, n, a) {
    var s, r, o, l, d;
    if (!(s = this.__callbacks)) return this;
    if (!(e || n || a)) return delete this.__callbacks, this;
    for (e = e.split(t) || i(s); r = e.shift(); ) if (o = s[r]) if (n || a) for (l = o.length - 1; l; --l) d = o[l], 
    n && d !== n || a && d.__context !== a || o.splice(l, 1); else delete s[r];
    return this;
  }, e.prototype.emit = function(e) {
    var i, n, a, s, r, o, l, d, c = [];
    if (!(i = this.__callbacks)) return this;
    for (e = e.split(t), r = arguments.length - 1; r; --r) c[r - 1] = arguments[r];
    for ((a = i.call) && (l = [ 0 ].concat(c)); n = e.shift(); ) {
      if (s = i[n]) for (r = 0, o = s.length; o > r; ++r) d = s[r], d.apply(d.__context || this, c), 
      d.__once && (s.splice(r--, 1), o--);
      if (s && a) for (l[0] = n, r = 0, o = a.length; o > r; ++r) d = a[r], d.apply(d.__context || this, l);
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
    var a, s;
    for (a in t) s = t[a], l(s) ? s = s.slice() : i(s) && (s = n(e[a] || {}, s)), e[a] = s;
    return e;
  }
  function a(e) {
    return e[2].toLowerCase() + e.substring(3);
  }
  var s = /^on[A-Z]/, r = Object.__proto__, o = Object.prototype.toString, l = Array.isArray;
  l || (l = function(e) {
    return "[object Array]" === o.call(e);
  });
  var d = e("class"), c = e("emitter");
  return d.create(c, {
    setOptions: function(e) {
      var i, r, o;
      if (this.hasOwnProperty("options") || (this.options = {}), o = this.options, this.constructor.superclass.options && n(o, this.constructor.superclass.options), 
      this.constructor.prototype.options && n(o, this.constructor.prototype.options), 
      e && e.options && n(o, e.options), this.on) for (i in o) r = o[i], t(r) && s.test(i) && (this.on(a(i), r), 
      delete o[i]);
    },
    destory: function() {
      var e;
      for (e in this) this.hasOwnProperty(e) && delete this[e];
      r && (this.__proto__ = r);
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
  var i = null, n = Array.prototype, a = Object.prototype, s = a.hasOwnProperty, r = a.toString, o = n.slice, l = n.indexof, d = n.lastIndexOf, c = n.reduce, u = n.reduceRight, h = {};
  h.each = function(e, t, i) {
    var n, a = e.length;
    if (a === +a) for (n = 0; a > n; ++n) n in e && t.call(i, e[n], n, e); else for (n in e) h.has(e, n) && t.call(i, n, e[n], e);
  }, h.map = function(e, t, i) {
    var n, a, s = [], r = e.length;
    if (r === +r) for (n = 0; r > n; ++n) n in e && (s[n] = t.call(i, e[n], n, e)); else {
      a = 0;
      for (n in e) h.has(e, n) && (s[a++] = t.call(i, n, e[n], e));
    }
    return s;
  }, h.some = function(e, t, i) {
    for (var n = 0, a = e.length; a > n; ++n) if (n in e && t.call(i, e[n], n, e)) return !0;
    return !1;
  }, h.every = function(e, t, i) {
    for (var n = 0, a = e.length; a > n; ++n) if (n in e && !t.call(i, e[n], n, e)) return !1;
    return !0;
  }, h.filter = h.select = function(e, t, i) {
    for (var n = [], a = 0, s = 0, r = e.length; r > a; ++a) if (a in e) {
      if (!t.call(i, e[a], a, e)) continue;
      n[s++] = e[a];
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
  }, h.lastIndexOf = d ? function(e, t, i) {
    return e.lastIndexOf(t, isFinite(i) ? i : e.length);
  } : function(e, t, i) {
    var n = e.length;
    if (i = n - 1, !n) return -1;
    for (arguments.length > 1 && (i = Math.min(i, arguments[1])), 0 > i && (i += n); i >= 0; --i) if (i in e && e[i] === t) return i;
    return -1;
  }, h.reduce = c ? function(e, t, i, n) {
    return e.reduce(t, i, n);
  } : function(e, t, i, n) {
    e || (e = []);
    var a = 0, s = e.length;
    if (3 > arguments.length) for (;;) {
      if (a in e) {
        i = e[a++];
        break;
      }
      if (++a >= s) throw new TypeError("Empty array");
    }
    for (;s > a; a++) a in e && (i = t.call(n, i, e[a], a, e));
    return i;
  }, h.reduceRight = u ? function(e, t, i, n) {
    return e.reduce(t, i, n);
  } : function(e, t, i, n) {
    e || (e = []);
    var a = e.length - 1;
    if (3 > arguments.length) for (;;) {
      if (a in e) {
        i = e[a--];
        break;
      }
      if (0 > --a) throw new TypeError("Empty array");
    }
    for (;a >= 0; --a) a in e && (i = t.call(n, i, e[a], a, e));
    return i;
  }, h.find = function(e, t, i) {
    for (var n, a = 0, s = e.length; s > a; ++a) if (a in e && t.call(i, e[a], a, e)) {
      n = e[a];
      break;
    }
    return n;
  }, h.reject = function(e, t, i) {
    for (var n = [], a = 0, s = e.length; s > a; ++a) if (a in e) {
      if (t.call(i, e[a], a, e)) continue;
      n[a++] = e[a];
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
    var i, n = e.length, a = 0;
    if (isFinite(t.length)) for (i = t.length; i > a; a++) e[n++] = t[a]; else for (;void 0 !== t[a]; ) e[n++] = t[a++];
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
    return s.call(e, t);
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
    return "[object String]" === r.call(e);
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
    return "[object Number]" === r.call(e);
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
      for (var e = 0, t = this._value, n = arguments.length, a = [ t ]; n > e; ++e) a[e + 1] = arguments[e];
      return t = i.apply(this._context, a), this._value = t, this._chained ? this : t;
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
      var a = "data-" + i.replace(gt, "-$1").toLowerCase();
      if (n = e.getAttribute(a), "string" == typeof n) {
        try {
          n = "true" === n ? !0 : "false" === n ? !1 : "null" === n ? null : +n + "" === n ? +n : mt.test(n) ? Z.parseJSON(n) : n;
        } catch (s) {}
        Z.data(e, i, n);
      } else n = t;
    }
    return n;
  }
  function a(e) {
    var t;
    for (t in e) if (("data" !== t || !Z.isEmptyObject(e[t])) && "toJSON" !== t) return !1;
    return !0;
  }
  function s() {
    return !1;
  }
  function r() {
    return !0;
  }
  function o(e) {
    return !e || !e.parentNode || 11 === e.parentNode.nodeType;
  }
  function l(e, t) {
    do e = e[t]; while (e && 1 !== e.nodeType);
    return e;
  }
  function d(e, t, i) {
    if (t = t || 0, Z.isFunction(t)) return Z.grep(e, function(e, n) {
      var a = !!t.call(e, n, e);
      return a === i;
    });
    if (t.nodeType) return Z.grep(e, function(e) {
      return e === t === i;
    });
    if ("string" == typeof t) {
      var n = Z.grep(e, function(e) {
        return 1 === e.nodeType;
      });
      if (zt.test(t)) return Z.filter(t, n, !i);
      t = Z.filter(t, n);
    }
    return Z.grep(e, function(e) {
      return Z.inArray(e, t) >= 0 === i;
    });
  }
  function c(e) {
    var t = Ft.split("|"), i = e.createDocumentFragment();
    if (i.createElement) for (;t.length; ) i.createElement(t.pop());
    return i;
  }
  function u(e, t) {
    return e.getElementsByTagName(t)[0] || e.appendChild(e.ownerDocument.createElement(t));
  }
  function h(e, t) {
    if (1 === t.nodeType && Z.hasData(e)) {
      var i, n, a, s = Z._data(e), r = Z._data(t, s), o = s.events;
      if (o) {
        delete r.handle, r.events = {};
        for (i in o) for (n = 0, a = o[i].length; a > n; n++) Z.event.add(t, i, o[i][n]);
      }
      r.data && (r.data = Z.extend({}, r.data));
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
    for (var i = t.charAt(0).toUpperCase() + t.slice(1), n = t, a = vi.length; a--; ) if (t = vi[a] + i, 
    t in e) return t;
    return n;
  }
  function v(e, t) {
    return e = t || e, "none" === Z.css(e, "display") || !Z.contains(e.ownerDocument, e);
  }
  function y(e, t) {
    for (var i, n, a = [], s = 0, r = e.length; r > s; s++) i = e[s], i.style && (a[s] = Z._data(i, "olddisplay"), 
    t ? (a[s] || "none" !== i.style.display || (i.style.display = ""), "" === i.style.display && v(i) && (a[s] = Z._data(i, "olddisplay", _(i.nodeName)))) : (n = ii(i, "display"), 
    a[s] || "none" === n || Z._data(i, "olddisplay", n)));
    for (s = 0; r > s; s++) i = e[s], i.style && (t && "none" !== i.style.display && "" !== i.style.display || (i.style.display = t ? a[s] || "" : "none"));
    return e;
  }
  function b(e, t, i) {
    var n = ci.exec(t);
    return n ? Math.max(0, n[1] - (i || 0)) + (n[2] || "px") : t;
  }
  function x(e, t, i, n) {
    for (var a = i === (n ? "border" : "content") ? 4 : "width" === t ? 1 : 0, s = 0; 4 > a; a += 2) "margin" === i && (s += Z.css(e, i + gi[a], !0)), 
    n ? ("content" === i && (s -= parseFloat(ii(e, "padding" + gi[a])) || 0), "margin" !== i && (s -= parseFloat(ii(e, "border" + gi[a] + "Width")) || 0)) : (s += parseFloat(ii(e, "padding" + gi[a])) || 0, 
    "padding" !== i && (s += parseFloat(ii(e, "border" + gi[a] + "Width")) || 0));
    return s;
  }
  function w(e, t, i) {
    var n = "width" === t ? e.offsetWidth : e.offsetHeight, a = !0, s = Z.support.boxSizing && "border-box" === Z.css(e, "boxSizing");
    if (0 >= n || null == n) {
      if (n = ii(e, t), (0 > n || null == n) && (n = e.style[t]), ui.test(n)) return n;
      a = s && (Z.support.boxSizingReliable || n === e.style[t]), n = parseFloat(n) || 0;
    }
    return n + x(e, t, i || (s ? "border" : "content"), a) + "px";
  }
  function _(e) {
    if (pi[e]) return pi[e];
    var t = Z("<" + e + ">").appendTo(j.body), i = t.css("display");
    return t.remove(), ("none" === i || "" === i) && (ni = j.body.appendChild(ni || Z.extend(j.createElement("iframe"), {
      frameBorder: 0,
      width: 0,
      height: 0
    })), ai && ni.createElement || (ai = (ni.contentWindow || ni.contentDocument).document, 
    ai.write("<!doctype html><html><body>"), ai.close()), t = ai.body.appendChild(ai.createElement(e)), 
    i = ii(t, "display"), j.body.removeChild(ni)), pi[e] = i, i;
  }
  function k(e, t, i, n) {
    var a;
    if (Z.isArray(t)) Z.each(t, function(t, a) {
      i || xi.test(e) ? n(e, a) : k(e + "[" + ("object" == typeof a ? t : "") + "]", a, i, n);
    }); else if (i || "object" !== Z.type(t)) n(e, t); else for (a in t) k(e + "[" + a + "]", t[a], i, n);
  }
  function C(e) {
    return function(t, i) {
      "string" != typeof t && (i = t, t = "*");
      var n, a, s, r = t.toLowerCase().split(tt), o = 0, l = r.length;
      if (Z.isFunction(i)) for (;l > o; o++) n = r[o], s = /^\+/.test(n), s && (n = n.substr(1) || "*"), 
      a = e[n] = e[n] || [], a[s ? "unshift" : "push"](i);
    };
  }
  function E(e, i, n, a, s, r) {
    s = s || i.dataTypes[0], r = r || {}, r[s] = !0;
    for (var o, l = e[s], d = 0, c = l ? l.length : 0, u = e === zi; c > d && (u || !o); d++) o = l[d](i, n, a), 
    "string" == typeof o && (!u || r[o] ? o = t : (i.dataTypes.unshift(o), o = E(e, i, n, a, o, r)));
    return !u && o || r["*"] || (o = E(e, i, n, a, "*", r)), o;
  }
  function T(e, i) {
    var n, a, s = Z.ajaxSettings.flatOptions || {};
    for (n in i) i[n] !== t && ((s[n] ? e : a || (a = {}))[n] = i[n]);
    a && Z.extend(!0, e, a);
  }
  function $(e, i, n) {
    var a, s, r, o, l = e.contents, d = e.dataTypes, c = e.responseFields;
    for (s in c) s in n && (i[c[s]] = n[s]);
    for (;"*" === d[0]; ) d.shift(), a === t && (a = e.mimeType || i.getResponseHeader("content-type"));
    if (a) for (s in l) if (l[s] && l[s].test(a)) {
      d.unshift(s);
      break;
    }
    if (d[0] in n) r = d[0]; else {
      for (s in n) {
        if (!d[0] || e.converters[s + " " + d[0]]) {
          r = s;
          break;
        }
        o || (o = s);
      }
      r = r || o;
    }
    return r ? (r !== d[0] && d.unshift(r), n[r]) : t;
  }
  function S(e, t) {
    var i, n, a, s, r = e.dataTypes.slice(), o = r[0], l = {}, d = 0;
    if (e.dataFilter && (t = e.dataFilter(t, e.dataType)), r[1]) for (i in e.converters) l[i.toLowerCase()] = e.converters[i];
    for (;a = r[++d]; ) if ("*" !== a) {
      if ("*" !== o && o !== a) {
        if (i = l[o + " " + a] || l["* " + a], !i) for (n in l) if (s = n.split(" "), s[1] === a && (i = l[o + " " + s[0]] || l["* " + s[0]])) {
          i === !0 ? i = l[n] : l[n] !== !0 && (a = s[0], r.splice(d--, 0, a));
          break;
        }
        if (i !== !0) if (i && e["throws"]) t = i(t); else try {
          t = i(t);
        } catch (c) {
          return {
            state: "parsererror",
            error: i ? c : "No conversion from " + o + " to " + a
          };
        }
      }
      o = a;
    }
    return {
      state: "success",
      data: t
    };
  }
  function I() {
    try {
      return new e.XMLHttpRequest();
    } catch (t) {}
  }
  function N() {
    try {
      return new e.ActiveXObject("Microsoft.XMLHTTP");
    } catch (t) {}
  }
  function D() {
    return setTimeout(function() {
      Yi = t;
    }, 0), Yi = Z.now();
  }
  function P(e, t) {
    Z.each(t, function(t, i) {
      for (var n = (Qi[t] || []).concat(Qi["*"]), a = 0, s = n.length; s > a; a++) if (n[a].call(e, t, i)) return;
    });
  }
  function A(e, t, i) {
    var n, a = 0, s = Zi.length, r = Z.Deferred().always(function() {
      delete o.elem;
    }), o = function() {
      for (var t = Yi || D(), i = Math.max(0, l.startTime + l.duration - t), n = 1 - (i / l.duration || 0), a = 0, s = l.tweens.length; s > a; a++) l.tweens[a].run(n);
      return r.notifyWith(e, [ l, n, i ]), 1 > n && s ? i : (r.resolveWith(e, [ l ]), 
      !1);
    }, l = r.promise({
      elem: e,
      props: Z.extend({}, t),
      opts: Z.extend(!0, {
        specialEasing: {}
      }, i),
      originalProperties: t,
      originalOptions: i,
      startTime: Yi || D(),
      duration: i.duration,
      tweens: [],
      createTween: function(t, i) {
        var n = Z.Tween(e, l.opts, t, i, l.opts.specialEasing[t] || l.opts.easing);
        return l.tweens.push(n), n;
      },
      stop: function(t) {
        for (var i = 0, n = t ? l.tweens.length : 0; n > i; i++) l.tweens[i].run(1);
        return t ? r.resolveWith(e, [ l, t ]) : r.rejectWith(e, [ l, t ]), this;
      }
    }), d = l.props;
    for (M(d, l.opts.specialEasing); s > a; a++) if (n = Zi[a].call(l, e, d, l.opts)) return n;
    return P(l, d), Z.isFunction(l.opts.start) && l.opts.start.call(e, l), Z.fx.timer(Z.extend(o, {
      anim: l,
      queue: l.opts.queue,
      elem: e
    })), l.progress(l.opts.progress).done(l.opts.done, l.opts.complete).fail(l.opts.fail).always(l.opts.always);
  }
  function M(e, t) {
    var i, n, a, s, r;
    for (i in e) if (n = Z.camelCase(i), a = t[n], s = e[i], Z.isArray(s) && (a = s[1], 
    s = e[i] = s[0]), i !== n && (e[n] = s, delete e[i]), r = Z.cssHooks[n], r && "expand" in r) {
      s = r.expand(s), delete e[n];
      for (i in s) i in e || (e[i] = s[i], t[i] = a);
    } else t[n] = a;
  }
  function O(e, t, i) {
    var n, a, s, r, o, l, d, c, u = this, h = e.style, p = {}, f = [], m = e.nodeType && v(e);
    i.queue || (d = Z._queueHooks(e, "fx"), null == d.unqueued && (d.unqueued = 0, c = d.empty.fire, 
    d.empty.fire = function() {
      d.unqueued || c();
    }), d.unqueued++, u.always(function() {
      u.always(function() {
        d.unqueued--, Z.queue(e, "fx").length || d.empty.fire();
      });
    })), 1 === e.nodeType && ("height" in t || "width" in t) && (i.overflow = [ h.overflow, h.overflowX, h.overflowY ], 
    "inline" === Z.css(e, "display") && "none" === Z.css(e, "float") && (Z.support.inlineBlockNeedsLayout && "inline" !== _(e.nodeName) ? h.zoom = 1 : h.display = "inline-block")), 
    i.overflow && (h.overflow = "hidden", Z.support.shrinkWrapBlocks || u.done(function() {
      h.overflow = i.overflow[0], h.overflowX = i.overflow[1], h.overflowY = i.overflow[2];
    }));
    for (n in t) if (s = t[n], Gi.exec(s)) {
      if (delete t[n], s === (m ? "hide" : "show")) continue;
      f.push(n);
    }
    if (r = f.length) for (o = Z._data(e, "fxshow") || Z._data(e, "fxshow", {}), m ? Z(e).show() : u.done(function() {
      Z(e).hide();
    }), u.done(function() {
      var t;
      Z.removeData(e, "fxshow", !0);
      for (t in p) Z.style(e, t, p[t]);
    }), n = 0; r > n; n++) a = f[n], l = u.createTween(a, m ? o[a] : 0), p[a] = o[a] || Z.style(e, a), 
    a in o || (o[a] = l.start, m && (l.end = l.start, l.start = "width" === a || "height" === a ? 1 : 0));
  }
  function z(e, t, i, n, a) {
    return new z.prototype.init(e, t, i, n, a);
  }
  function L(e, t) {
    var i, n = {
      height: e
    }, a = 0;
    for (t = t ? 1 : 0; 4 > a; a += 2 - t) i = gi[a], n["margin" + i] = n["padding" + i] = e;
    return t && (n.opacity = n.width = e), n;
  }
  function H(e) {
    return Z.isWindow(e) ? e : 9 === e.nodeType ? e.defaultView || e.parentWindow : !1;
  }
  var F, R, j = e.document, q = e.location, U = e.navigator, B = e.jQuery, W = e.$, X = Array.prototype.push, Y = Array.prototype.slice, V = Array.prototype.indexOf, G = Object.prototype.toString, K = Object.prototype.hasOwnProperty, J = String.prototype.trim, Z = function(e, t) {
    return new Z.fn.init(e, t, F);
  }, Q = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source, et = /\S/, tt = /\s+/, it = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, nt = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/, at = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, st = /^[\],:{}\s]*$/, rt = /(?:^|:|,)(?:\s*\[)+/g, ot = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, lt = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g, dt = /^-ms-/, ct = /-([\da-z])/gi, ut = function(e, t) {
    return (t + "").toUpperCase();
  }, ht = function() {
    j.addEventListener ? (j.removeEventListener("DOMContentLoaded", ht, !1), Z.ready()) : "complete" === j.readyState && (j.detachEvent("onreadystatechange", ht), 
    Z.ready());
  }, pt = {};
  Z.fn = Z.prototype = {
    constructor: Z,
    init: function(e, i, n) {
      var a, s, r;
      if (!e) return this;
      if (e.nodeType) return this.context = this[0] = e, this.length = 1, this;
      if ("string" == typeof e) {
        if (a = "<" === e.charAt(0) && ">" === e.charAt(e.length - 1) && e.length >= 3 ? [ null, e, null ] : nt.exec(e), 
        !a || !a[1] && i) return !i || i.jquery ? (i || n).find(e) : this.constructor(i).find(e);
        if (a[1]) return i = i instanceof Z ? i[0] : i, r = i && i.nodeType ? i.ownerDocument || i : j, 
        e = Z.parseHTML(a[1], r, !0), at.test(a[1]) && Z.isPlainObject(i) && this.attr.call(e, i, !0), 
        Z.merge(this, e);
        if (s = j.getElementById(a[2]), s && s.parentNode) {
          if (s.id !== a[2]) return n.find(e);
          this.length = 1, this[0] = s;
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
    var e, i, n, a, s, r, o = arguments[0] || {}, l = 1, d = arguments.length, c = !1;
    for ("boolean" == typeof o && (c = o, o = arguments[1] || {}, l = 2), "object" == typeof o || Z.isFunction(o) || (o = {}), 
    d === l && (o = this, --l); d > l; l++) if (null != (e = arguments[l])) for (i in e) n = o[i], 
    a = e[i], o !== a && (c && a && (Z.isPlainObject(a) || (s = Z.isArray(a))) ? (s ? (s = !1, 
    r = n && Z.isArray(n) ? n : []) : r = n && Z.isPlainObject(n) ? n : {}, o[i] = Z.extend(c, r, a)) : a !== t && (o[i] = a));
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
        Z.isReady = !0, e !== !0 && --Z.readyWait > 0 || (R.resolveWith(j, [ Z ]), Z.fn.trigger && Z(j).trigger("ready").off("ready"));
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
      (n = at.exec(e)) ? [ t.createElement(n[1]) ] : (n = Z.buildFragment([ e ], t, i ? null : []), 
      Z.merge([], (n.cacheable ? Z.clone(n.fragment) : n.fragment).childNodes))) : null;
    },
    parseJSON: function(i) {
      return i && "string" == typeof i ? (i = Z.trim(i), e.JSON && e.JSON.parse ? e.JSON.parse(i) : st.test(i.replace(ot, "@").replace(lt, "]").replace(rt, "")) ? Function("return " + i)() : (Z.error("Invalid JSON: " + i), 
      t)) : null;
    },
    parseXML: function(i) {
      var n, a;
      if (!i || "string" != typeof i) return null;
      try {
        e.DOMParser ? (a = new DOMParser(), n = a.parseFromString(i, "text/xml")) : (n = new ActiveXObject("Microsoft.XMLDOM"), 
        n.async = "false", n.loadXML(i));
      } catch (s) {
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
      return e.replace(dt, "ms-").replace(ct, ut);
    },
    nodeName: function(e, t) {
      return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase();
    },
    each: function(e, i, n) {
      var a, s = 0, r = e.length, o = r === t || Z.isFunction(e);
      if (n) if (o) {
        for (a in e) if (i.apply(e[a], n) === !1) break;
      } else for (;r > s && i.apply(e[s++], n) !== !1; ) ; else if (o) {
        for (a in e) if (i.call(e[a], a, e[a]) === !1) break;
      } else for (;r > s && i.call(e[s], s, e[s++]) !== !1; ) ;
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
      var n = i.length, a = e.length, s = 0;
      if ("number" == typeof n) for (;n > s; s++) e[a++] = i[s]; else for (;i[s] !== t; ) e[a++] = i[s++];
      return e.length = a, e;
    },
    grep: function(e, t, i) {
      var n, a = [], s = 0, r = e.length;
      for (i = !!i; r > s; s++) n = !!t(e[s], s), i !== n && a.push(e[s]);
      return a;
    },
    map: function(e, i, n) {
      var a, s, r = [], o = 0, l = e.length, d = e instanceof Z || l !== t && "number" == typeof l && (l > 0 && e[0] && e[l - 1] || 0 === l || Z.isArray(e));
      if (d) for (;l > o; o++) a = i(e[o], o, n), null != a && (r[r.length] = a); else for (s in e) a = i(e[s], s, n), 
      null != a && (r[r.length] = a);
      return r.concat.apply([], r);
    },
    guid: 1,
    proxy: function(e, i) {
      var n, a, s;
      return "string" == typeof i && (n = e[i], i = e, e = n), Z.isFunction(e) ? (a = Y.call(arguments, 2), 
      s = function() {
        return e.apply(i, a.concat(Y.call(arguments)));
      }, s.guid = e.guid = e.guid || Z.guid++, s) : t;
    },
    access: function(e, i, n, a, s, r, o) {
      var l, d = null == n, c = 0, u = e.length;
      if (n && "object" == typeof n) {
        for (c in n) Z.access(e, i, c, n[c], 1, r, a);
        s = 1;
      } else if (a !== t) {
        if (l = o === t && Z.isFunction(a), d && (l ? (l = i, i = function(e, t, i) {
          return l.call(Z(e), i);
        }) : (i.call(e, a), i = null)), i) for (;u > c; c++) i(e[c], n, l ? a.call(e[c], c, i(e[c], n)) : a, o);
        s = 1;
      }
      return s ? e : d ? i.call(e) : u ? i(e[0], n) : r;
    },
    now: function() {
      return new Date().getTime();
    }
  }), Z.ready.promise = function(t) {
    if (!R) if (R = Z.Deferred(), "complete" === j.readyState) setTimeout(Z.ready, 1); else if (j.addEventListener) j.addEventListener("DOMContentLoaded", ht, !1), 
    e.addEventListener("load", Z.ready, !1); else {
      j.attachEvent("onreadystatechange", ht), e.attachEvent("onload", Z.ready);
      var i = !1;
      try {
        i = null == e.frameElement && j.documentElement;
      } catch (n) {}
      i && i.doScroll && function a() {
        if (!Z.isReady) {
          try {
            i.doScroll("left");
          } catch (e) {
            return setTimeout(a, 50);
          }
          Z.ready();
        }
      }();
    }
    return R.promise(t);
  }, Z.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(e, t) {
    pt["[object " + t + "]"] = t.toLowerCase();
  }), F = Z(j);
  var ft = {};
  Z.Callbacks = function(e) {
    e = "string" == typeof e ? ft[e] || i(e) : Z.extend({}, e);
    var n, a, s, r, o, l, d = [], c = !e.once && [], u = function(t) {
      for (n = e.memory && t, a = !0, l = r || 0, r = 0, o = d.length, s = !0; d && o > l; l++) if (d[l].apply(t[0], t[1]) === !1 && e.stopOnFalse) {
        n = !1;
        break;
      }
      s = !1, d && (c ? c.length && u(c.shift()) : n ? d = [] : h.disable());
    }, h = {
      add: function() {
        if (d) {
          var t = d.length;
          (function i(t) {
            Z.each(t, function(t, n) {
              var a = Z.type(n);
              "function" !== a || e.unique && h.has(n) ? n && n.length && "string" !== a && i(n) : d.push(n);
            });
          })(arguments), s ? o = d.length : n && (r = t, u(n));
        }
        return this;
      },
      remove: function() {
        return d && Z.each(arguments, function(e, t) {
          for (var i; (i = Z.inArray(t, d, i)) > -1; ) d.splice(i, 1), s && (o >= i && o--, 
          l >= i && l--);
        }), this;
      },
      has: function(e) {
        return Z.inArray(e, d) > -1;
      },
      empty: function() {
        return d = [], this;
      },
      disable: function() {
        return d = c = n = t, this;
      },
      disabled: function() {
        return !d;
      },
      lock: function() {
        return c = t, n || h.disable(), this;
      },
      locked: function() {
        return !c;
      },
      fireWith: function(e, t) {
        return t = t || [], t = [ e, t.slice ? t.slice() : t ], !d || a && !c || (s ? c.push(t) : u(t)), 
        this;
      },
      fire: function() {
        return h.fireWith(this, arguments), this;
      },
      fired: function() {
        return !!a;
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
          return a.done(arguments).fail(arguments), this;
        },
        then: function() {
          var e = arguments;
          return Z.Deferred(function(i) {
            Z.each(t, function(t, n) {
              var s = n[0], r = e[t];
              a[n[1]](Z.isFunction(r) ? function() {
                var e = r.apply(this, arguments);
                e && Z.isFunction(e.promise) ? e.promise().done(i.resolve).fail(i.reject).progress(i.notify) : i[s + "With"](this === a ? i : this, [ e ]);
              } : i[s]);
            }), e = null;
          }).promise();
        },
        promise: function(e) {
          return null != e ? Z.extend(e, n) : n;
        }
      }, a = {};
      return n.pipe = n.then, Z.each(t, function(e, s) {
        var r = s[2], o = s[3];
        n[s[1]] = r.add, o && r.add(function() {
          i = o;
        }, t[1 ^ e][2].disable, t[2][2].lock), a[s[0]] = r.fire, a[s[0] + "With"] = r.fireWith;
      }), n.promise(a), e && e.call(a, a), a;
    },
    when: function(e) {
      var t, i, n, a = 0, s = Y.call(arguments), r = s.length, o = 1 !== r || e && Z.isFunction(e.promise) ? r : 0, l = 1 === o ? e : Z.Deferred(), d = function(e, i, n) {
        return function(a) {
          i[e] = this, n[e] = arguments.length > 1 ? Y.call(arguments) : a, n === t ? l.notifyWith(i, n) : --o || l.resolveWith(i, n);
        };
      };
      if (r > 1) for (t = Array(r), i = Array(r), n = Array(r); r > a; a++) s[a] && Z.isFunction(s[a].promise) ? s[a].promise().done(d(a, n, s)).fail(l.reject).progress(d(a, i, t)) : --o;
      return o || l.resolveWith(n, s), l.promise();
    }
  }), Z.support = function() {
    var i, n, a, s, r, o, l, d, c, u, h, p = j.createElement("div");
    if (p.setAttribute("className", "t"), p.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", 
    n = p.getElementsByTagName("*"), a = p.getElementsByTagName("a")[0], a.style.cssText = "top:1px;float:left;opacity:.5", 
    !n || !n.length) return {};
    s = j.createElement("select"), r = s.appendChild(j.createElement("option")), o = p.getElementsByTagName("input")[0], 
    i = {
      leadingWhitespace: 3 === p.firstChild.nodeType,
      tbody: !p.getElementsByTagName("tbody").length,
      htmlSerialize: !!p.getElementsByTagName("link").length,
      style: /top/.test(a.getAttribute("style")),
      hrefNormalized: "/a" === a.getAttribute("href"),
      opacity: /^0.5/.test(a.style.opacity),
      cssFloat: !!a.style.cssFloat,
      checkOn: "on" === o.value,
      optSelected: r.selected,
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
    }, o.checked = !0, i.noCloneChecked = o.cloneNode(!0).checked, s.disabled = !0, 
    i.optDisabled = !r.disabled;
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
    i.appendChecked = o.checked, l.removeChild(o), l.appendChild(p), p.attachEvent) for (c in {
      submit: !0,
      change: !0,
      focusin: !0
    }) d = "on" + c, u = d in p, u || (p.setAttribute(d, "return;"), u = "function" == typeof p[d]), 
    i[c + "Bubbles"] = u;
    return Z(function() {
      var n, a, s, r, o = "padding:0;margin:0;border:0;display:block;overflow:hidden;", l = j.getElementsByTagName("body")[0];
      l && (n = j.createElement("div"), n.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px", 
      l.insertBefore(n, l.firstChild), a = j.createElement("div"), n.appendChild(a), a.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", 
      s = a.getElementsByTagName("td"), s[0].style.cssText = "padding:0;margin:0;border:0;display:none", 
      u = 0 === s[0].offsetHeight, s[0].style.display = "", s[1].style.display = "none", 
      i.reliableHiddenOffsets = u && 0 === s[0].offsetHeight, a.innerHTML = "", a.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", 
      i.boxSizing = 4 === a.offsetWidth, i.doesNotIncludeMarginInBodyOffset = 1 !== l.offsetTop, 
      e.getComputedStyle && (i.pixelPosition = "1%" !== (e.getComputedStyle(a, null) || {}).top, 
      i.boxSizingReliable = "4px" === (e.getComputedStyle(a, null) || {
        width: "4px"
      }).width, r = j.createElement("div"), r.style.cssText = a.style.cssText = o, r.style.marginRight = r.style.width = "0", 
      a.style.width = "1px", a.appendChild(r), i.reliableMarginRight = !parseFloat((e.getComputedStyle(r, null) || {}).marginRight)), 
      a.style.zoom !== t && (a.innerHTML = "", a.style.cssText = o + "width:1px;padding:1px;display:inline;zoom:1", 
      i.inlineBlockNeedsLayout = 3 === a.offsetWidth, a.style.display = "block", a.style.overflow = "visible", 
      a.innerHTML = "<div></div>", a.firstChild.style.width = "5px", i.shrinkWrapBlocks = 3 !== a.offsetWidth, 
      n.style.zoom = 1), l.removeChild(n), n = a = s = r = null);
    }), l.removeChild(p), n = a = s = r = o = l = p = null, i;
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
      return e = e.nodeType ? Z.cache[e[Z.expando]] : e[Z.expando], !!e && !a(e);
    },
    data: function(e, i, n, a) {
      if (Z.acceptData(e)) {
        var s, r, o = Z.expando, l = "string" == typeof i, d = e.nodeType, c = d ? Z.cache : e, u = d ? e[o] : e[o] && o;
        if (u && c[u] && (a || c[u].data) || !l || n !== t) return u || (d ? e[o] = u = Z.deletedIds.pop() || Z.guid++ : u = o), 
        c[u] || (c[u] = {}, d || (c[u].toJSON = Z.noop)), ("object" == typeof i || "function" == typeof i) && (a ? c[u] = Z.extend(c[u], i) : c[u].data = Z.extend(c[u].data, i)), 
        s = c[u], a || (s.data || (s.data = {}), s = s.data), n !== t && (s[Z.camelCase(i)] = n), 
        l ? (r = s[i], null == r && (r = s[Z.camelCase(i)])) : r = s, r;
      }
    },
    removeData: function(e, t, i) {
      if (Z.acceptData(e)) {
        var n, s, r, o = e.nodeType, l = o ? Z.cache : e, d = o ? e[Z.expando] : Z.expando;
        if (l[d]) {
          if (t && (n = i ? l[d] : l[d].data)) {
            Z.isArray(t) || (t in n ? t = [ t ] : (t = Z.camelCase(t), t = t in n ? [ t ] : t.split(" ")));
            for (s = 0, r = t.length; r > s; s++) delete n[t[s]];
            if (!(i ? a : Z.isEmptyObject)(n)) return;
          }
          (i || (delete l[d].data, a(l[d]))) && (o ? Z.cleanData([ e ], !0) : Z.support.deleteExpando || l != l.window ? delete l[d] : l[d] = null);
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
      var a, s, r, o, l, d = this[0], c = 0, u = null;
      if (e === t) {
        if (this.length && (u = Z.data(d), 1 === d.nodeType && !Z._data(d, "parsedAttrs"))) {
          for (r = d.attributes, l = r.length; l > c; c++) o = r[c].name, o.indexOf("data-") || (o = Z.camelCase(o.substring(5)), 
          n(d, o, u[o]));
          Z._data(d, "parsedAttrs", !0);
        }
        return u;
      }
      return "object" == typeof e ? this.each(function() {
        Z.data(this, e);
      }) : (a = e.split(".", 2), a[1] = a[1] ? "." + a[1] : "", s = a[1] + "!", Z.access(this, function(i) {
        return i === t ? (u = this.triggerHandler("getData" + s, [ a[0] ]), u === t && d && (u = Z.data(d, e), 
        u = n(d, e, u)), u === t && a[1] ? this.data(a[0]) : u) : (a[1] = i, this.each(function() {
          var t = Z(this);
          t.triggerHandler("setData" + s, a), Z.data(this, e, i), t.triggerHandler("changeData" + s, a);
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
      var a;
      return e ? (i = (i || "fx") + "queue", a = Z._data(e, i), n && (!a || Z.isArray(n) ? a = Z._data(e, i, Z.makeArray(n)) : a.push(n)), 
      a || []) : t;
    },
    dequeue: function(e, t) {
      t = t || "fx";
      var i = Z.queue(e, t), n = i.length, a = i.shift(), s = Z._queueHooks(e, t), r = function() {
        Z.dequeue(e, t);
      };
      "inprogress" === a && (a = i.shift(), n--), a && ("fx" === t && i.unshift("inprogress"), 
      delete s.stop, a.call(e, r, s)), !n && s && s.empty.fire();
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
      var n, a = 1, s = Z.Deferred(), r = this, o = this.length, l = function() {
        --a || s.resolveWith(r, [ r ]);
      };
      for ("string" != typeof e && (i = e, e = t), e = e || "fx"; o--; ) n = Z._data(r[o], e + "queueHooks"), 
      n && n.empty && (a++, n.empty.add(l));
      return l(), s.promise(i);
    }
  });
  var vt, yt, bt, xt = /[\t\r\n]/g, wt = /\r/g, _t = /^(?:button|input)$/i, kt = /^(?:button|input|object|select|textarea)$/i, Ct = /^a(?:rea|)$/i, Et = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i, Tt = Z.support.getSetAttribute;
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
      var t, i, n, a, s, r, o;
      if (Z.isFunction(e)) return this.each(function(t) {
        Z(this).addClass(e.call(this, t, this.className));
      });
      if (e && "string" == typeof e) for (t = e.split(tt), i = 0, n = this.length; n > i; i++) if (a = this[i], 
      1 === a.nodeType) if (a.className || 1 !== t.length) {
        for (s = " " + a.className + " ", r = 0, o = t.length; o > r; r++) 0 > s.indexOf(" " + t[r] + " ") && (s += t[r] + " ");
        a.className = Z.trim(s);
      } else a.className = e;
      return this;
    },
    removeClass: function(e) {
      var i, n, a, s, r, o, l;
      if (Z.isFunction(e)) return this.each(function(t) {
        Z(this).removeClass(e.call(this, t, this.className));
      });
      if (e && "string" == typeof e || e === t) for (i = (e || "").split(tt), o = 0, l = this.length; l > o; o++) if (a = this[o], 
      1 === a.nodeType && a.className) {
        for (n = (" " + a.className + " ").replace(xt, " "), s = 0, r = i.length; r > s; s++) for (;n.indexOf(" " + i[s] + " ") >= 0; ) n = n.replace(" " + i[s] + " ", " ");
        a.className = e ? Z.trim(n) : "";
      }
      return this;
    },
    toggleClass: function(e, t) {
      var i = typeof e, n = "boolean" == typeof t;
      return Z.isFunction(e) ? this.each(function(i) {
        Z(this).toggleClass(e.call(this, i, this.className, t), t);
      }) : this.each(function() {
        if ("string" === i) for (var a, s = 0, r = Z(this), o = t, l = e.split(tt); a = l[s++]; ) o = n ? o : !r.hasClass(a), 
        r[o ? "addClass" : "removeClass"](a); else ("undefined" === i || "boolean" === i) && (this.className && Z._data(this, "__className__", this.className), 
        this.className = this.className || e === !1 ? "" : Z._data(this, "__className__") || "");
      });
    },
    hasClass: function(e) {
      for (var t = " " + e + " ", i = 0, n = this.length; n > i; i++) if (1 === this[i].nodeType && (" " + this[i].className + " ").replace(xt, " ").indexOf(t) >= 0) return !0;
      return !1;
    },
    val: function(e) {
      var i, n, a, s = this[0];
      {
        if (arguments.length) return a = Z.isFunction(e), this.each(function(n) {
          var s, r = Z(this);
          1 === this.nodeType && (s = a ? e.call(this, n, r.val()) : e, null == s ? s = "" : "number" == typeof s ? s += "" : Z.isArray(s) && (s = Z.map(s, function(e) {
            return null == e ? "" : e + "";
          })), i = Z.valHooks[this.type] || Z.valHooks[this.nodeName.toLowerCase()], i && "set" in i && i.set(this, s, "value") !== t || (this.value = s));
        });
        if (s) return i = Z.valHooks[s.type] || Z.valHooks[s.nodeName.toLowerCase()], i && "get" in i && (n = i.get(s, "value")) !== t ? n : (n = s.value, 
        "string" == typeof n ? n.replace(wt, "") : null == n ? "" : n);
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
          var t, i, n, a, s = e.selectedIndex, r = [], o = e.options, l = "select-one" === e.type;
          if (0 > s) return null;
          for (i = l ? s : 0, n = l ? s + 1 : o.length; n > i; i++) if (a = o[i], !(!a.selected || (Z.support.optDisabled ? a.disabled : null !== a.getAttribute("disabled")) || a.parentNode.disabled && Z.nodeName(a.parentNode, "optgroup"))) {
            if (t = Z(a).val(), l) return t;
            r.push(t);
          }
          return l && !r.length && o.length ? Z(o[s]).val() : r;
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
    attr: function(e, i, n, a) {
      var s, r, o, l = e.nodeType;
      if (e && 3 !== l && 8 !== l && 2 !== l) return a && Z.isFunction(Z.fn[i]) ? Z(e)[i](n) : e.getAttribute === t ? Z.prop(e, i, n) : (o = 1 !== l || !Z.isXMLDoc(e), 
      o && (i = i.toLowerCase(), r = Z.attrHooks[i] || (Et.test(i) ? yt : vt)), n !== t ? null === n ? (Z.removeAttr(e, i), 
      t) : r && "set" in r && o && (s = r.set(e, n, i)) !== t ? s : (e.setAttribute(i, n + ""), 
      n) : r && "get" in r && o && null !== (s = r.get(e, i)) ? s : (s = e.getAttribute(i), 
      null === s ? t : s));
    },
    removeAttr: function(e, t) {
      var i, n, a, s, r = 0;
      if (t && 1 === e.nodeType) for (n = t.split(tt); n.length > r; r++) a = n[r], a && (i = Z.propFix[a] || a, 
      s = Et.test(a), s || Z.attr(e, a, ""), e.removeAttribute(Tt ? a : i), s && i in e && (e[i] = !1));
    },
    attrHooks: {
      type: {
        set: function(e, t) {
          if (_t.test(e.nodeName) && e.parentNode) Z.error("type property can't be changed"); else if (!Z.support.radioValue && "radio" === t && Z.nodeName(e, "input")) {
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
      var a, s, r, o = e.nodeType;
      if (e && 3 !== o && 8 !== o && 2 !== o) return r = 1 !== o || !Z.isXMLDoc(e), r && (i = Z.propFix[i] || i, 
      s = Z.propHooks[i]), n !== t ? s && "set" in s && (a = s.set(e, n, i)) !== t ? a : e[i] = n : s && "get" in s && null !== (a = s.get(e, i)) ? a : e[i];
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
      var n, a = Z.prop(e, i);
      return a === !0 || "boolean" != typeof a && (n = e.getAttributeNode(i)) && n.nodeValue !== !1 ? i.toLowerCase() : t;
    },
    set: function(e, t, i) {
      var n;
      return t === !1 ? Z.removeAttr(e, i) : (n = Z.propFix[i] || i, n in e && (e[n] = !0), 
      e.setAttribute(i, i.toLowerCase())), i;
    }
  }, Tt || (bt = {
    name: !0,
    id: !0,
    coords: !0
  }, vt = Z.valHooks.button = {
    get: function(e, i) {
      var n;
      return n = e.getAttributeNode(i), n && (bt[i] ? "" !== n.value : n.specified) ? n.value : t;
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
  var $t = /^(?:textarea|input|select)$/i, St = /^([^\.]*|)(?:\.(.+)|)$/, It = /(?:^|\s)hover(\.\S+|)\b/, Nt = /^key/, Dt = /^(?:mouse|contextmenu)|click/, Pt = /^(?:focusinfocus|focusoutblur)$/, At = function(e) {
    return Z.event.special.hover ? e : e.replace(It, "mouseenter$1 mouseleave$1");
  };
  Z.event = {
    add: function(e, i, n, a, s) {
      var r, o, l, d, c, u, h, p, f, m, g;
      if (3 !== e.nodeType && 8 !== e.nodeType && i && n && (r = Z._data(e))) {
        for (n.handler && (f = n, n = f.handler, s = f.selector), n.guid || (n.guid = Z.guid++), 
        l = r.events, l || (r.events = l = {}), o = r.handle, o || (r.handle = o = function(e) {
          return Z === t || e && Z.event.triggered === e.type ? t : Z.event.dispatch.apply(o.elem, arguments);
        }, o.elem = e), i = Z.trim(At(i)).split(" "), d = 0; i.length > d; d++) c = St.exec(i[d]) || [], 
        u = c[1], h = (c[2] || "").split(".").sort(), g = Z.event.special[u] || {}, u = (s ? g.delegateType : g.bindType) || u, 
        g = Z.event.special[u] || {}, p = Z.extend({
          type: u,
          origType: c[1],
          data: a,
          handler: n,
          guid: n.guid,
          selector: s,
          needsContext: s && Z.expr.match.needsContext.test(s),
          namespace: h.join(".")
        }, f), m = l[u], m || (m = l[u] = [], m.delegateCount = 0, g.setup && g.setup.call(e, a, h, o) !== !1 || (e.addEventListener ? e.addEventListener(u, o, !1) : e.attachEvent && e.attachEvent("on" + u, o))), 
        g.add && (g.add.call(e, p), p.handler.guid || (p.handler.guid = n.guid)), s ? m.splice(m.delegateCount++, 0, p) : m.push(p), 
        Z.event.global[u] = !0;
        e = null;
      }
    },
    global: {},
    remove: function(e, t, i, n, a) {
      var s, r, o, l, d, c, u, h, p, f, m, g = Z.hasData(e) && Z._data(e);
      if (g && (h = g.events)) {
        for (t = Z.trim(At(t || "")).split(" "), s = 0; t.length > s; s++) if (r = St.exec(t[s]) || [], 
        o = l = r[1], d = r[2], o) {
          for (p = Z.event.special[o] || {}, o = (n ? p.delegateType : p.bindType) || o, f = h[o] || [], 
          c = f.length, d = d ? RegExp("(^|\\.)" + d.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null, 
          u = 0; f.length > u; u++) m = f[u], !a && l !== m.origType || i && i.guid !== m.guid || d && !d.test(m.namespace) || n && n !== m.selector && ("**" !== n || !m.selector) || (f.splice(u--, 1), 
          m.selector && f.delegateCount--, p.remove && p.remove.call(e, m));
          0 === f.length && c !== f.length && (p.teardown && p.teardown.call(e, d, g.handle) !== !1 || Z.removeEvent(e, o, g.handle), 
          delete h[o]);
        } else for (o in h) Z.event.remove(e, o + t[s], i, n, !0);
        Z.isEmptyObject(h) && (delete g.handle, Z.removeData(e, "events", !0));
      }
    },
    customEvent: {
      getData: !0,
      setData: !0,
      changeData: !0
    },
    trigger: function(i, n, a, s) {
      if (!a || 3 !== a.nodeType && 8 !== a.nodeType) {
        var r, o, l, d, c, u, h, p, f, m, g = i.type || i, v = [];
        if (!Pt.test(g + Z.event.triggered) && (g.indexOf("!") >= 0 && (g = g.slice(0, -1), 
        o = !0), g.indexOf(".") >= 0 && (v = g.split("."), g = v.shift(), v.sort()), a && !Z.event.customEvent[g] || Z.event.global[g])) if (i = "object" == typeof i ? i[Z.expando] ? i : new Z.Event(g, i) : new Z.Event(g), 
        i.type = g, i.isTrigger = !0, i.exclusive = o, i.namespace = v.join("."), i.namespace_re = i.namespace ? RegExp("(^|\\.)" + v.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, 
        u = 0 > g.indexOf(":") ? "on" + g : "", a) {
          if (i.result = t, i.target || (i.target = a), n = null != n ? Z.makeArray(n) : [], 
          n.unshift(i), h = Z.event.special[g] || {}, !h.trigger || h.trigger.apply(a, n) !== !1) {
            if (f = [ [ a, h.bindType || g ] ], !s && !h.noBubble && !Z.isWindow(a)) {
              for (m = h.delegateType || g, d = Pt.test(m + g) ? a : a.parentNode, c = a; d; d = d.parentNode) f.push([ d, m ]), 
              c = d;
              c === (a.ownerDocument || j) && f.push([ c.defaultView || c.parentWindow || e, m ]);
            }
            for (l = 0; f.length > l && !i.isPropagationStopped(); l++) d = f[l][0], i.type = f[l][1], 
            p = (Z._data(d, "events") || {})[i.type] && Z._data(d, "handle"), p && p.apply(d, n), 
            p = u && d[u], p && Z.acceptData(d) && p.apply && p.apply(d, n) === !1 && i.preventDefault();
            return i.type = g, s || i.isDefaultPrevented() || h._default && h._default.apply(a.ownerDocument, n) !== !1 || "click" === g && Z.nodeName(a, "a") || !Z.acceptData(a) || u && a[g] && ("focus" !== g && "blur" !== g || 0 !== i.target.offsetWidth) && !Z.isWindow(a) && (c = a[u], 
            c && (a[u] = null), Z.event.triggered = g, a[g](), Z.event.triggered = t, c && (a[u] = c)), 
            i.result;
          }
        } else {
          r = Z.cache;
          for (l in r) r[l].events && r[l].events[g] && Z.event.trigger(i, n, r[l].handle.elem, !0);
        }
      }
    },
    dispatch: function(i) {
      i = Z.event.fix(i || e.event);
      var n, a, s, r, o, l, d, c, u, h = (Z._data(this, "events") || {})[i.type] || [], p = h.delegateCount, f = Y.call(arguments), m = !i.exclusive && !i.namespace, g = Z.event.special[i.type] || {}, v = [];
      if (f[0] = i, i.delegateTarget = this, !g.preDispatch || g.preDispatch.call(this, i) !== !1) {
        if (p && (!i.button || "click" !== i.type)) for (s = i.target; s != this; s = s.parentNode || this) if (s.disabled !== !0 || "click" !== i.type) {
          for (o = {}, d = [], n = 0; p > n; n++) c = h[n], u = c.selector, o[u] === t && (o[u] = c.needsContext ? Z(u, this).index(s) >= 0 : Z.find(u, this, null, [ s ]).length), 
          o[u] && d.push(c);
          d.length && v.push({
            elem: s,
            matches: d
          });
        }
        for (h.length > p && v.push({
          elem: this,
          matches: h.slice(p)
        }), n = 0; v.length > n && !i.isPropagationStopped(); n++) for (l = v[n], i.currentTarget = l.elem, 
        a = 0; l.matches.length > a && !i.isImmediatePropagationStopped(); a++) c = l.matches[a], 
        (m || !i.namespace && !c.namespace || i.namespace_re && i.namespace_re.test(c.namespace)) && (i.data = c.data, 
        i.handleObj = c, r = ((Z.event.special[c.origType] || {}).handle || c.handler).apply(l.elem, f), 
        r !== t && (i.result = r, r === !1 && (i.preventDefault(), i.stopPropagation())));
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
        var n, a, s, r = i.button, o = i.fromElement;
        return null == e.pageX && null != i.clientX && (n = e.target.ownerDocument || j, 
        a = n.documentElement, s = n.body, e.pageX = i.clientX + (a && a.scrollLeft || s && s.scrollLeft || 0) - (a && a.clientLeft || s && s.clientLeft || 0), 
        e.pageY = i.clientY + (a && a.scrollTop || s && s.scrollTop || 0) - (a && a.clientTop || s && s.clientTop || 0)), 
        !e.relatedTarget && o && (e.relatedTarget = o === e.target ? i.toElement : o), e.which || r === t || (e.which = 1 & r ? 1 : 2 & r ? 3 : 4 & r ? 2 : 0), 
        e;
      }
    },
    fix: function(e) {
      if (e[Z.expando]) return e;
      var t, i, n = e, a = Z.event.fixHooks[e.type] || {}, s = a.props ? this.props.concat(a.props) : this.props;
      for (e = Z.Event(n), t = s.length; t; ) i = s[--t], e[i] = n[i];
      return e.target || (e.target = n.srcElement || j), 3 === e.target.nodeType && (e.target = e.target.parentNode), 
      e.metaKey = !!e.metaKey, a.filter ? a.filter(e, n) : e;
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
      var a = Z.extend(new Z.Event(), i, {
        type: e,
        isSimulated: !0,
        originalEvent: {}
      });
      n ? Z.event.trigger(a, null, t) : Z.event.dispatch.call(t, a), a.isDefaultPrevented() && i.preventDefault();
    }
  }, Z.event.handle = Z.event.dispatch, Z.removeEvent = j.removeEventListener ? function(e, t, i) {
    e.removeEventListener && e.removeEventListener(t, i, !1);
  } : function(e, i, n) {
    var a = "on" + i;
    e.detachEvent && (e[a] === t && (e[a] = null), e.detachEvent(a, n));
  }, Z.Event = function(e, i) {
    return this instanceof Z.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, 
    this.isDefaultPrevented = e.defaultPrevented || e.returnValue === !1 || e.getPreventDefault && e.getPreventDefault() ? r : s) : this.type = e, 
    i && Z.extend(this, i), this.timeStamp = e && e.timeStamp || Z.now(), this[Z.expando] = !0, 
    t) : new Z.Event(e, i);
  }, Z.Event.prototype = {
    preventDefault: function() {
      this.isDefaultPrevented = r;
      var e = this.originalEvent;
      e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1);
    },
    stopPropagation: function() {
      this.isPropagationStopped = r;
      var e = this.originalEvent;
      e && (e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0);
    },
    stopImmediatePropagation: function() {
      this.isImmediatePropagationStopped = r, this.stopPropagation();
    },
    isDefaultPrevented: s,
    isPropagationStopped: s,
    isImmediatePropagationStopped: s
  }, Z.each({
    mouseenter: "mouseover",
    mouseleave: "mouseout"
  }, function(e, t) {
    Z.event.special[e] = {
      delegateType: t,
      bindType: t,
      handle: function(e) {
        var i, n = this, a = e.relatedTarget, s = e.handleObj;
        return s.selector, (!a || a !== n && !Z.contains(n, a)) && (e.type = s.origType, 
        i = s.handler.apply(this, arguments), e.type = t), i;
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
    on: function(e, i, n, a, r) {
      var o, l;
      if ("object" == typeof e) {
        "string" != typeof i && (n = n || i, i = t);
        for (l in e) this.on(l, i, n, e[l], r);
        return this;
      }
      if (null == n && null == a ? (a = i, n = i = t) : null == a && ("string" == typeof i ? (a = n, 
      n = t) : (a = n, n = i, i = t)), a === !1) a = s; else if (!a) return this;
      return 1 === r && (o = a, a = function(e) {
        return Z().off(e), o.apply(this, arguments);
      }, a.guid = o.guid || (o.guid = Z.guid++)), this.each(function() {
        Z.event.add(this, e, a, n, i);
      });
    },
    one: function(e, t, i, n) {
      return this.on(e, t, i, n, 1);
    },
    off: function(e, i, n) {
      var a, r;
      if (e && e.preventDefault && e.handleObj) return a = e.handleObj, Z(e.delegateTarget).off(a.namespace ? a.origType + "." + a.namespace : a.origType, a.selector, a.handler), 
      this;
      if ("object" == typeof e) {
        for (r in e) this.off(r, i, e[r]);
        return this;
      }
      return (i === !1 || "function" == typeof i) && (n = i, i = t), n === !1 && (n = s), 
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
      var t = arguments, i = e.guid || Z.guid++, n = 0, a = function(i) {
        var a = (Z._data(this, "lastToggle" + e.guid) || 0) % n;
        return Z._data(this, "lastToggle" + e.guid, a + 1), i.preventDefault(), t[a].apply(this, arguments) || !1;
      };
      for (a.guid = i; t.length > n; ) t[n++].guid = i;
      return this.click(a);
    },
    hover: function(e, t) {
      return this.mouseenter(e).mouseleave(t || e);
    }
  }), Z.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
    Z.fn[t] = function(e, i) {
      return null == i && (i = e, e = null), arguments.length > 0 ? this.on(t, null, e, i) : this.trigger(t);
    }, Nt.test(t) && (Z.event.fixHooks[t] = Z.event.keyHooks), Dt.test(t) && (Z.event.fixHooks[t] = Z.event.mouseHooks);
  }), function(e, t) {
    function i(e, t, i, n) {
      i = i || [], t = t || D;
      var a, s, r, o, l = t.nodeType;
      if (!e || "string" != typeof e) return i;
      if (1 !== l && 9 !== l) return [];
      if (r = w(t), !r && !n && (a = it.exec(e))) if (o = a[1]) {
        if (9 === l) {
          if (s = t.getElementById(o), !s || !s.parentNode) return i;
          if (s.id === o) return i.push(s), i;
        } else if (t.ownerDocument && (s = t.ownerDocument.getElementById(o)) && _(t, s) && s.id === o) return i.push(s), 
        i;
      } else {
        if (a[2]) return z.apply(i, L.call(t.getElementsByTagName(e), 0)), i;
        if ((o = a[3]) && ht && t.getElementsByClassName) return z.apply(i, L.call(t.getElementsByClassName(o), 0)), 
        i;
      }
      return m(e.replace(J, "$1"), t, i, n, r);
    }
    function n(e) {
      return function(t) {
        var i = t.nodeName.toLowerCase();
        return "input" === i && t.type === e;
      };
    }
    function a(e) {
      return function(t) {
        var i = t.nodeName.toLowerCase();
        return ("input" === i || "button" === i) && t.type === e;
      };
    }
    function s(e) {
      return F(function(t) {
        return t = +t, F(function(i, n) {
          for (var a, s = e([], i.length, t), r = s.length; r--; ) i[a = s[r]] && (i[a] = !(n[a] = i[a]));
        });
      });
    }
    function r(e, t, i) {
      if (e === t) return i;
      for (var n = e.nextSibling; n; ) {
        if (n === t) return -1;
        n = n.nextSibling;
      }
      return 1;
    }
    function o(e, t) {
      var n, a, s, r, o, l, d, c = q[I][e];
      if (c) return t ? 0 : c.slice(0);
      for (o = e, l = [], d = b.preFilter; o; ) {
        (!n || (a = Q.exec(o))) && (a && (o = o.slice(a[0].length)), l.push(s = [])), n = !1, 
        (a = et.exec(o)) && (s.push(n = new N(a.shift())), o = o.slice(n.length), n.type = a[0].replace(J, " "));
        for (r in b.filter) !(a = ot[r].exec(o)) || d[r] && !(a = d[r](a, D, !0)) || (s.push(n = new N(a.shift())), 
        o = o.slice(n.length), n.type = r, n.matches = a);
        if (!n) break;
      }
      return t ? o.length : o ? i.error(e) : q(e, l).slice(0);
    }
    function l(e, t, i) {
      var n = t.dir, a = i && "parentNode" === t.dir, s = M++;
      return t.first ? function(t, i, s) {
        for (;t = t[n]; ) if (a || 1 === t.nodeType) return e(t, i, s);
      } : function(t, i, r) {
        if (r) {
          for (;t = t[n]; ) if ((a || 1 === t.nodeType) && e(t, i, r)) return t;
        } else for (var o, l = A + " " + s + " ", d = l + v; t = t[n]; ) if (a || 1 === t.nodeType) {
          if ((o = t[I]) === d) return t.sizset;
          if ("string" == typeof o && 0 === o.indexOf(l)) {
            if (t.sizset) return t;
          } else {
            if (t[I] = d, e(t, i, r)) return t.sizset = !0, t;
            t.sizset = !1;
          }
        }
      };
    }
    function d(e) {
      return e.length > 1 ? function(t, i, n) {
        for (var a = e.length; a--; ) if (!e[a](t, i, n)) return !1;
        return !0;
      } : e[0];
    }
    function c(e, t, i, n, a) {
      for (var s, r = [], o = 0, l = e.length, d = null != t; l > o; o++) (s = e[o]) && (!i || i(s, n, a)) && (r.push(s), 
      d && t.push(o));
      return r;
    }
    function u(e, t, i, n, a, s) {
      return n && !n[I] && (n = u(n)), a && !a[I] && (a = u(a, s)), F(function(s, r, o, l) {
        if (!s || !a) {
          var d, u, h, p = [], m = [], g = r.length, v = s || f(t || "*", o.nodeType ? [ o ] : o, [], s), y = !e || !s && t ? v : c(v, p, e, o, l), b = i ? a || (s ? e : g || n) ? [] : r : y;
          if (i && i(y, b, o, l), n) for (h = c(b, m), n(h, [], o, l), d = h.length; d--; ) (u = h[d]) && (b[m[d]] = !(y[m[d]] = u));
          if (s) for (d = e && b.length; d--; ) (u = b[d]) && (s[p[d]] = !(r[p[d]] = u)); else b = c(b === r ? b.splice(g, b.length) : b), 
          a ? a(null, r, b, l) : z.apply(r, b);
        }
      });
    }
    function h(e) {
      for (var t, i, n, a = e.length, s = b.relative[e[0].type], r = s || b.relative[" "], o = s ? 1 : 0, c = l(function(e) {
        return e === t;
      }, r, !0), p = l(function(e) {
        return H.call(t, e) > -1;
      }, r, !0), f = [ function(e, i, n) {
        return !s && (n || i !== T) || ((t = i).nodeType ? c(e, i, n) : p(e, i, n));
      } ]; a > o; o++) if (i = b.relative[e[o].type]) f = [ l(d(f), i) ]; else {
        if (i = b.filter[e[o].type].apply(null, e[o].matches), i[I]) {
          for (n = ++o; a > n && !b.relative[e[n].type]; n++) ;
          return u(o > 1 && d(f), o > 1 && e.slice(0, o - 1).join("").replace(J, "$1"), i, n > o && h(e.slice(o, n)), a > n && h(e = e.slice(n)), a > n && e.join(""));
        }
        f.push(i);
      }
      return d(f);
    }
    function p(e, t) {
      var n = t.length > 0, a = e.length > 0, s = function(r, o, l, d, u) {
        var h, p, f, m = [], g = 0, y = "0", x = r && [], w = null != u, _ = T, k = r || a && b.find.TAG("*", u && o.parentNode || o), C = A += null == _ ? 1 : Math.E;
        for (w && (T = o !== D && o, v = s.el); null != (h = k[y]); y++) {
          if (a && h) {
            for (p = 0; f = e[p]; p++) if (f(h, o, l)) {
              d.push(h);
              break;
            }
            w && (A = C, v = ++s.el);
          }
          n && ((h = !f && h) && g--, r && x.push(h));
        }
        if (g += y, n && y !== g) {
          for (p = 0; f = t[p]; p++) f(x, m, o, l);
          if (r) {
            if (g > 0) for (;y--; ) x[y] || m[y] || (m[y] = O.call(d));
            m = c(m);
          }
          z.apply(d, m), w && !r && m.length > 0 && g + t.length > 1 && i.uniqueSort(d);
        }
        return w && (A = C, T = _), x;
      };
      return s.el = 0, n ? F(s) : s;
    }
    function f(e, t, n, a) {
      for (var s = 0, r = t.length; r > s; s++) i(e, t[s], n, a);
      return n;
    }
    function m(e, t, i, n, a) {
      var s, r, l, d, c, u = o(e);
      if (u.length, !n && 1 === u.length) {
        if (r = u[0] = u[0].slice(0), r.length > 2 && "ID" === (l = r[0]).type && 9 === t.nodeType && !a && b.relative[r[1].type]) {
          if (t = b.find.ID(l.matches[0].replace(rt, ""), t, a)[0], !t) return i;
          e = e.slice(r.shift().length);
        }
        for (s = ot.POS.test(e) ? -1 : r.length - 1; s >= 0 && (l = r[s], !b.relative[d = l.type]); s--) if ((c = b.find[d]) && (n = c(l.matches[0].replace(rt, ""), nt.test(r[0].type) && t.parentNode || t, a))) {
          if (r.splice(s, 1), e = n.length && r.join(""), !e) return z.apply(i, L.call(n, 0)), 
          i;
          break;
        }
      }
      return k(e, u)(n, t, a, i, nt.test(e)), i;
    }
    function g() {}
    var v, y, b, x, w, _, k, C, E, T, $ = !0, S = "undefined", I = ("sizcache" + Math.random()).replace(".", ""), N = String, D = e.document, P = D.documentElement, A = 0, M = 0, O = [].pop, z = [].push, L = [].slice, H = [].indexOf || function(e) {
      for (var t = 0, i = this.length; i > t; t++) if (this[t] === e) return t;
      return -1;
    }, F = function(e, t) {
      return e[I] = null == t || t, e;
    }, R = function() {
      var e = {}, t = [];
      return F(function(i, n) {
        return t.push(i) > b.cacheLength && delete e[t.shift()], e[i] = n;
      }, e);
    }, j = R(), q = R(), U = R(), B = "[\\x20\\t\\r\\n\\f]", W = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+", X = W.replace("w", "w#"), Y = "([*^$|!~]?=)", V = "\\[" + B + "*(" + W + ")" + B + "*(?:" + Y + B + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + X + ")|)|)" + B + "*\\]", G = ":(" + W + ")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:" + V + ")|[^:]|\\\\.)*|.*))\\)|)", K = ":(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + B + "*((?:-\\d)?\\d*)" + B + "*\\)|)(?=[^-]|$)", J = RegExp("^" + B + "+|((?:^|[^\\\\])(?:\\\\.)*)" + B + "+$", "g"), Q = RegExp("^" + B + "*," + B + "*"), et = RegExp("^" + B + "*([\\x20\\t\\r\\n\\f>+~])" + B + "*"), tt = RegExp(G), it = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/, nt = /[\x20\t\r\n\f]*[+~]/, at = /h\d/i, st = /input|select|textarea|button/i, rt = /\\(?!\\)/g, ot = {
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
      var t = D.createElement("div");
      try {
        return e(t);
      } catch (i) {
        return !1;
      } finally {
        t = null;
      }
    }, dt = lt(function(e) {
      return e.appendChild(D.createComment("")), !e.getElementsByTagName("*").length;
    }), ct = lt(function(e) {
      return e.innerHTML = "<a href='#'></a>", e.firstChild && typeof e.firstChild.getAttribute !== S && "#" === e.firstChild.getAttribute("href");
    }), ut = lt(function(e) {
      e.innerHTML = "<select></select>";
      var t = typeof e.lastChild.getAttribute("multiple");
      return "boolean" !== t && "string" !== t;
    }), ht = lt(function(e) {
      return e.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>", e.getElementsByClassName && e.getElementsByClassName("e").length ? (e.lastChild.className = "e", 
      2 === e.getElementsByClassName("e").length) : !1;
    }), pt = lt(function(e) {
      e.id = I + 0, e.innerHTML = "<a name='" + I + "'></a><div name='" + I + "'></div>", 
      P.insertBefore(e, P.firstChild);
      var t = D.getElementsByName && D.getElementsByName(I).length === 2 + D.getElementsByName(I + 0).length;
      return y = !D.getElementById(I), P.removeChild(e), t;
    });
    try {
      L.call(P.childNodes, 0)[0].nodeType;
    } catch (ft) {
      L = function(e) {
        for (var t, i = []; t = this[e]; e++) i.push(t);
        return i;
      };
    }
    i.matches = function(e, t) {
      return i(e, null, null, t);
    }, i.matchesSelector = function(e, t) {
      return i(t, null, null, [ e ]).length > 0;
    }, x = i.getText = function(e) {
      var t, i = "", n = 0, a = e.nodeType;
      if (a) {
        if (1 === a || 9 === a || 11 === a) {
          if ("string" == typeof e.textContent) return e.textContent;
          for (e = e.firstChild; e; e = e.nextSibling) i += x(e);
        } else if (3 === a || 4 === a) return e.nodeValue;
      } else for (;t = e[n]; n++) i += x(t);
      return i;
    }, w = i.isXML = function(e) {
      var t = e && (e.ownerDocument || e).documentElement;
      return t ? "HTML" !== t.nodeName : !1;
    }, _ = i.contains = P.contains ? function(e, t) {
      var i = 9 === e.nodeType ? e.documentElement : e, n = t && t.parentNode;
      return e === n || !!(n && 1 === n.nodeType && i.contains && i.contains(n));
    } : P.compareDocumentPosition ? function(e, t) {
      return t && !!(16 & e.compareDocumentPosition(t));
    } : function(e, t) {
      for (;t = t.parentNode; ) if (t === e) return !0;
      return !1;
    }, i.attr = function(e, t) {
      var i, n = w(e);
      return n || (t = t.toLowerCase()), (i = b.attrHandle[t]) ? i(e) : n || ut ? e.getAttribute(t) : (i = e.getAttributeNode(t), 
      i ? "boolean" == typeof e[t] ? e[t] ? t : null : i.specified ? i.value : null : null);
    }, b = i.selectors = {
      cacheLength: 50,
      createPseudo: F,
      match: ot,
      attrHandle: ct ? {} : {
        href: function(e) {
          return e.getAttribute("href", 2);
        },
        type: function(e) {
          return e.getAttribute("type");
        }
      },
      find: {
        ID: y ? function(e, t, i) {
          if (typeof t.getElementById !== S && !i) {
            var n = t.getElementById(e);
            return n && n.parentNode ? [ n ] : [];
          }
        } : function(e, i, n) {
          if (typeof i.getElementById !== S && !n) {
            var a = i.getElementById(e);
            return a ? a.id === e || typeof a.getAttributeNode !== S && a.getAttributeNode("id").value === e ? [ a ] : t : [];
          }
        },
        TAG: dt ? function(e, i) {
          return typeof i.getElementsByTagName !== S ? i.getElementsByTagName(e) : t;
        } : function(e, t) {
          var i = t.getElementsByTagName(e);
          if ("*" === e) {
            for (var n, a = [], s = 0; n = i[s]; s++) 1 === n.nodeType && a.push(n);
            return a;
          }
          return i;
        },
        NAME: pt && function(e, i) {
          return typeof i.getElementsByName !== S ? i.getElementsByName(name) : t;
        },
        CLASS: ht && function(e, i, n) {
          return typeof i.getElementsByClassName === S || n ? t : i.getElementsByClassName(e);
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
          return e[1] = e[1].replace(rt, ""), e[3] = (e[4] || e[5] || "").replace(rt, ""), 
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
          return e = e.replace(rt, ""), function(t) {
            return t.getAttribute("id") === e;
          };
        } : function(e) {
          return e = e.replace(rt, ""), function(t) {
            var i = typeof t.getAttributeNode !== S && t.getAttributeNode("id");
            return i && i.value === e;
          };
        },
        TAG: function(e) {
          return "*" === e ? function() {
            return !0;
          } : (e = e.replace(rt, "").toLowerCase(), function(t) {
            return t.nodeName && t.nodeName.toLowerCase() === e;
          });
        },
        CLASS: function(e) {
          var t = j[I][e];
          return t || (t = j(e, RegExp("(^|" + B + ")" + e + "(" + B + "|$)"))), function(e) {
            return t.test(e.className || typeof e.getAttribute !== S && e.getAttribute("class") || "");
          };
        },
        ATTR: function(e, t, n) {
          return function(a) {
            var s = i.attr(a, e);
            return null == s ? "!=" === t : t ? (s += "", "=" === t ? s === n : "!=" === t ? s !== n : "^=" === t ? n && 0 === s.indexOf(n) : "*=" === t ? n && s.indexOf(n) > -1 : "$=" === t ? n && s.substr(s.length - n.length) === n : "~=" === t ? (" " + s + " ").indexOf(n) > -1 : "|=" === t ? s === n || s.substr(0, n.length + 1) === n + "-" : !1) : !0;
          };
        },
        CHILD: function(e, t, i, n) {
          return "nth" === e ? function(e) {
            var t, a, s = e.parentNode;
            if (1 === i && 0 === n) return !0;
            if (s) for (a = 0, t = s.firstChild; t && (1 !== t.nodeType || (a++, e !== t)); t = t.nextSibling) ;
            return a -= n, a === i || 0 === a % i && a / i >= 0;
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
          var n, a = b.pseudos[e] || b.setFilters[e.toLowerCase()] || i.error("unsupported pseudo: " + e);
          return a[I] ? a(t) : a.length > 1 ? (n = [ e, e, "", t ], b.setFilters.hasOwnProperty(e.toLowerCase()) ? F(function(e, i) {
            for (var n, s = a(e, t), r = s.length; r--; ) n = H.call(e, s[r]), e[n] = !(i[n] = s[r]);
          }) : function(e) {
            return a(e, 0, n);
          }) : a;
        }
      },
      pseudos: {
        not: F(function(e) {
          var t = [], i = [], n = k(e.replace(J, "$1"));
          return n[I] ? F(function(e, t, i, a) {
            for (var s, r = n(e, null, a, []), o = e.length; o--; ) (s = r[o]) && (e[o] = !(t[o] = s));
          }) : function(e, a, s) {
            return t[0] = e, n(t, null, s, i), !i.pop();
          };
        }),
        has: F(function(e) {
          return function(t) {
            return i(e, t).length > 0;
          };
        }),
        contains: F(function(e) {
          return function(t) {
            return (t.textContent || t.innerText || x(t)).indexOf(e) > -1;
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
          return !b.pseudos.empty(e);
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
          return at.test(e.nodeName);
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
        submit: a("submit"),
        reset: a("reset"),
        button: function(e) {
          var t = e.nodeName.toLowerCase();
          return "input" === t && "button" === e.type || "button" === t;
        },
        input: function(e) {
          return st.test(e.nodeName);
        },
        focus: function(e) {
          var t = e.ownerDocument;
          return !(e !== t.activeElement || t.hasFocus && !t.hasFocus() || !e.type && !e.href);
        },
        active: function(e) {
          return e === e.ownerDocument.activeElement;
        },
        first: s(function() {
          return [ 0 ];
        }),
        last: s(function(e, t) {
          return [ t - 1 ];
        }),
        eq: s(function(e, t, i) {
          return [ 0 > i ? i + t : i ];
        }),
        even: s(function(e, t) {
          for (var i = 0; t > i; i += 2) e.push(i);
          return e;
        }),
        odd: s(function(e, t) {
          for (var i = 1; t > i; i += 2) e.push(i);
          return e;
        }),
        lt: s(function(e, t, i) {
          for (var n = 0 > i ? i + t : i; --n >= 0; ) e.push(n);
          return e;
        }),
        gt: s(function(e, t, i) {
          for (var n = 0 > i ? i + t : i; t > ++n; ) e.push(n);
          return e;
        })
      }
    }, C = P.compareDocumentPosition ? function(e, t) {
      return e === t ? (E = !0, 0) : (e.compareDocumentPosition && t.compareDocumentPosition ? 4 & e.compareDocumentPosition(t) : e.compareDocumentPosition) ? -1 : 1;
    } : function(e, t) {
      if (e === t) return E = !0, 0;
      if (e.sourceIndex && t.sourceIndex) return e.sourceIndex - t.sourceIndex;
      var i, n, a = [], s = [], o = e.parentNode, l = t.parentNode, d = o;
      if (o === l) return r(e, t);
      if (!o) return -1;
      if (!l) return 1;
      for (;d; ) a.unshift(d), d = d.parentNode;
      for (d = l; d; ) s.unshift(d), d = d.parentNode;
      i = a.length, n = s.length;
      for (var c = 0; i > c && n > c; c++) if (a[c] !== s[c]) return r(a[c], s[c]);
      return c === i ? r(e, s[c], -1) : r(a[c], t, 1);
    }, [ 0, 0 ].sort(C), $ = !E, i.uniqueSort = function(e) {
      var t, i = 1;
      if (E = $, e.sort(C), E) for (;t = e[i]; i++) t === e[i - 1] && e.splice(i--, 1);
      return e;
    }, i.error = function(e) {
      throw Error("Syntax error, unrecognized expression: " + e);
    }, k = i.compile = function(e, t) {
      var i, n = [], a = [], s = U[I][e];
      if (!s) {
        for (t || (t = o(e)), i = t.length; i--; ) s = h(t[i]), s[I] ? n.push(s) : a.push(s);
        s = U(e, p(a, n));
      }
      return s;
    }, D.querySelectorAll && function() {
      var e, t = m, n = /'|\\/g, a = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g, s = [ ":focus" ], r = [ ":active", ":focus" ], l = P.matchesSelector || P.mozMatchesSelector || P.webkitMatchesSelector || P.oMatchesSelector || P.msMatchesSelector;
      lt(function(e) {
        e.innerHTML = "<select><option selected=''></option></select>", e.querySelectorAll("[selected]").length || s.push("\\[" + B + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)"), 
        e.querySelectorAll(":checked").length || s.push(":checked");
      }), lt(function(e) {
        e.innerHTML = "<p test=''></p>", e.querySelectorAll("[test^='']").length && s.push("[*^$]=" + B + "*(?:\"\"|'')"), 
        e.innerHTML = "<input type='hidden'/>", e.querySelectorAll(":enabled").length || s.push(":enabled", ":disabled");
      }), s = RegExp(s.join("|")), m = function(e, i, a, r, l) {
        if (!(r || l || s && s.test(e))) {
          var d, c, u = !0, h = I, p = i, f = 9 === i.nodeType && e;
          if (1 === i.nodeType && "object" !== i.nodeName.toLowerCase()) {
            for (d = o(e), (u = i.getAttribute("id")) ? h = u.replace(n, "\\$&") : i.setAttribute("id", h), 
            h = "[id='" + h + "'] ", c = d.length; c--; ) d[c] = h + d[c].join("");
            p = nt.test(e) && i.parentNode || i, f = d.join(",");
          }
          if (f) try {
            return z.apply(a, L.call(p.querySelectorAll(f), 0)), a;
          } catch (m) {} finally {
            u || i.removeAttribute("id");
          }
        }
        return t(e, i, a, r, l);
      }, l && (lt(function(t) {
        e = l.call(t, "div");
        try {
          l.call(t, "[test!='']:sizzle"), r.push("!=", G);
        } catch (i) {}
      }), r = RegExp(r.join("|")), i.matchesSelector = function(t, n) {
        if (n = n.replace(a, "='$1']"), !(w(t) || r.test(n) || s && s.test(n))) try {
          var o = l.call(t, n);
          if (o || e || t.document && 11 !== t.document.nodeType) return o;
        } catch (d) {}
        return i(n, null, null, [ t ]).length > 0;
      });
    }(), b.pseudos.nth = b.pseudos.eq, b.filters = g.prototype = b.pseudos, b.setFilters = new g(), 
    i.attr = Z.attr, Z.find = i, Z.expr = i.selectors, Z.expr[":"] = Z.expr.pseudos, 
    Z.unique = i.uniqueSort, Z.text = i.getText, Z.isXMLDoc = i.isXML, Z.contains = i.contains;
  }(e);
  var Mt = /Until$/, Ot = /^(?:parents|prev(?:Until|All))/, zt = /^.[^:#\[\.,]*$/, Lt = Z.expr.match.needsContext, Ht = {
    children: !0,
    contents: !0,
    next: !0,
    prev: !0
  };
  Z.fn.extend({
    find: function(e) {
      var t, i, n, a, s, r, o = this;
      if ("string" != typeof e) return Z(e).filter(function() {
        for (t = 0, i = o.length; i > t; t++) if (Z.contains(o[t], this)) return !0;
      });
      for (r = this.pushStack("", "find", e), t = 0, i = this.length; i > t; t++) if (n = r.length, 
      Z.find(e, this[t], r), t > 0) for (a = n; r.length > a; a++) for (s = 0; n > s; s++) if (r[s] === r[a]) {
        r.splice(a--, 1);
        break;
      }
      return r;
    },
    has: function(e) {
      var t, i = Z(e, this), n = i.length;
      return this.filter(function() {
        for (t = 0; n > t; t++) if (Z.contains(this, i[t])) return !0;
      });
    },
    not: function(e) {
      return this.pushStack(d(this, e, !1), "not", e);
    },
    filter: function(e) {
      return this.pushStack(d(this, e, !0), "filter", e);
    },
    is: function(e) {
      return !!e && ("string" == typeof e ? Lt.test(e) ? Z(e, this.context).index(this[0]) >= 0 : Z.filter(e, this).length > 0 : this.filter(e).length > 0);
    },
    closest: function(e, t) {
      for (var i, n = 0, a = this.length, s = [], r = Lt.test(e) || "string" != typeof e ? Z(e, t || this.context) : 0; a > n; n++) for (i = this[n]; i && i.ownerDocument && i !== t && 11 !== i.nodeType; ) {
        if (r ? r.index(i) > -1 : Z.find.matchesSelector(i, e)) {
          s.push(i);
          break;
        }
        i = i.parentNode;
      }
      return s = s.length > 1 ? Z.unique(s) : s, this.pushStack(s, "closest", e);
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
      var a = Z.map(this, t, i);
      return Mt.test(e) || (n = i), n && "string" == typeof n && (a = Z.filter(n, a)), 
      a = this.length > 1 && !Ht[e] ? Z.unique(a) : a, this.length > 1 && Ot.test(e) && (a = a.reverse()), 
      this.pushStack(a, e, Y.call(arguments).join(","));
    };
  }), Z.extend({
    filter: function(e, t, i) {
      return i && (e = ":not(" + e + ")"), 1 === t.length ? Z.find.matchesSelector(t[0], e) ? [ t[0] ] : [] : Z.find.matches(e, t);
    },
    dir: function(e, i, n) {
      for (var a = [], s = e[i]; s && 9 !== s.nodeType && (n === t || 1 !== s.nodeType || !Z(s).is(n)); ) 1 === s.nodeType && a.push(s), 
      s = s[i];
      return a;
    },
    sibling: function(e, t) {
      for (var i = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && i.push(e);
      return i;
    }
  });
  var Ft = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", Rt = / jQuery\d+="(?:null|\d+)"/g, jt = /^\s+/, qt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, Ut = /<([\w:]+)/, Bt = /<tbody/i, Wt = /<|&#?\w+;/, Xt = /<(?:script|style|link)/i, Yt = /<(?:script|object|embed|option|style)/i, Vt = RegExp("<(?:" + Ft + ")[\\s/>]", "i"), Gt = /^(?:checkbox|radio)$/, Kt = /checked\s*(?:[^=]|=\s*.checked.)/i, Jt = /\/(java|ecma)script/i, Zt = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g, Qt = {
    option: [ 1, "<select multiple='multiple'>", "</select>" ],
    legend: [ 1, "<fieldset>", "</fieldset>" ],
    thead: [ 1, "<table>", "</table>" ],
    tr: [ 2, "<table><tbody>", "</tbody></table>" ],
    td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
    col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
    area: [ 1, "<map>", "</map>" ],
    _default: [ 0, "", "" ]
  }, ei = c(j), ti = ei.appendChild(j.createElement("div"));
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
        var i = this[0] || {}, n = 0, a = this.length;
        if (e === t) return 1 === i.nodeType ? i.innerHTML.replace(Rt, "") : t;
        if (!("string" != typeof e || Xt.test(e) || !Z.support.htmlSerialize && Vt.test(e) || !Z.support.leadingWhitespace && jt.test(e) || Qt[(Ut.exec(e) || [ "", "" ])[1].toLowerCase()])) {
          e = e.replace(qt, "<$1></$2>");
          try {
            for (;a > n; n++) i = this[n] || {}, 1 === i.nodeType && (Z.cleanData(i.getElementsByTagName("*")), 
            i.innerHTML = e);
            i = 0;
          } catch (s) {}
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
      var a, s, r, o, l = 0, d = e[0], c = [], h = this.length;
      if (!Z.support.checkClone && h > 1 && "string" == typeof d && Kt.test(d)) return this.each(function() {
        Z(this).domManip(e, i, n);
      });
      if (Z.isFunction(d)) return this.each(function(a) {
        var s = Z(this);
        e[0] = d.call(this, a, i ? s.html() : t), s.domManip(e, i, n);
      });
      if (this[0]) {
        if (a = Z.buildFragment(e, this, c), r = a.fragment, s = r.firstChild, 1 === r.childNodes.length && (r = s), 
        s) for (i = i && Z.nodeName(s, "tr"), o = a.cacheable || h - 1; h > l; l++) n.call(i && Z.nodeName(this[l], "table") ? u(this[l], "tbody") : this[l], l === o ? r : Z.clone(r, !0, !0));
        r = s = null, c.length && Z.each(c, function(e, t) {
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
    var a, s, r, o = e[0];
    return i = i || j, i = !i.nodeType && i[0] || i, i = i.ownerDocument || i, !(1 === e.length && "string" == typeof o && 512 > o.length && i === j && "<" === o.charAt(0)) || Yt.test(o) || !Z.support.checkClone && Kt.test(o) || !Z.support.html5Clone && Vt.test(o) || (s = !0, 
    a = Z.fragments[o], r = a !== t), a || (a = i.createDocumentFragment(), Z.clean(e, i, a, n), 
    s && (Z.fragments[o] = r && a)), {
      fragment: a,
      cacheable: s
    };
  }, Z.fragments = {}, Z.each({
    appendTo: "append",
    prependTo: "prepend",
    insertBefore: "before",
    insertAfter: "after",
    replaceAll: "replaceWith"
  }, function(e, t) {
    Z.fn[e] = function(i) {
      var n, a = 0, s = [], r = Z(i), o = r.length, l = 1 === this.length && this[0].parentNode;
      if ((null == l || l && 11 === l.nodeType && 1 === l.childNodes.length) && 1 === o) return r[t](this[0]), 
      this;
      for (;o > a; a++) n = (a > 0 ? this.clone(!0) : this).get(), Z(r[a])[t](n), s = s.concat(n);
      return this.pushStack(s, e, r.selector);
    };
  }), Z.extend({
    clone: function(e, t, i) {
      var n, a, s, r;
      if (Z.support.html5Clone || Z.isXMLDoc(e) || !Vt.test("<" + e.nodeName + ">") ? r = e.cloneNode(!0) : (ti.innerHTML = e.outerHTML, 
      ti.removeChild(r = ti.firstChild)), !(Z.support.noCloneEvent && Z.support.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || Z.isXMLDoc(e))) for (p(e, r), 
      n = f(e), a = f(r), s = 0; n[s]; ++s) a[s] && p(n[s], a[s]);
      if (t && (h(e, r), i)) for (n = f(e), a = f(r), s = 0; n[s]; ++s) h(n[s], a[s]);
      return n = a = null, r;
    },
    clean: function(e, i, n, a) {
      var s, r, o, l, d, u, h, p, f, g, v, y = i === j && ei, b = [];
      for (i && i.createDocumentFragment !== t || (i = j), s = 0; null != (o = e[s]); s++) if ("number" == typeof o && (o += ""), 
      o) {
        if ("string" == typeof o) if (Wt.test(o)) {
          for (y = y || c(i), h = i.createElement("div"), y.appendChild(h), o = o.replace(qt, "<$1></$2>"), 
          l = (Ut.exec(o) || [ "", "" ])[1].toLowerCase(), d = Qt[l] || Qt._default, u = d[0], 
          h.innerHTML = d[1] + o + d[2]; u--; ) h = h.lastChild;
          if (!Z.support.tbody) for (p = Bt.test(o), f = "table" !== l || p ? "<table>" !== d[1] || p ? [] : h.childNodes : h.firstChild && h.firstChild.childNodes, 
          r = f.length - 1; r >= 0; --r) Z.nodeName(f[r], "tbody") && !f[r].childNodes.length && f[r].parentNode.removeChild(f[r]);
          !Z.support.leadingWhitespace && jt.test(o) && h.insertBefore(i.createTextNode(jt.exec(o)[0]), h.firstChild), 
          o = h.childNodes, h.parentNode.removeChild(h);
        } else o = i.createTextNode(o);
        o.nodeType ? b.push(o) : Z.merge(b, o);
      }
      if (h && (o = h = y = null), !Z.support.appendChecked) for (s = 0; null != (o = b[s]); s++) Z.nodeName(o, "input") ? m(o) : o.getElementsByTagName !== t && Z.grep(o.getElementsByTagName("input"), m);
      if (n) for (g = function(e) {
        return !e.type || Jt.test(e.type) ? a ? a.push(e.parentNode ? e.parentNode.removeChild(e) : e) : n.appendChild(e) : t;
      }, s = 0; null != (o = b[s]); s++) Z.nodeName(o, "script") && g(o) || (n.appendChild(o), 
      o.getElementsByTagName !== t && (v = Z.grep(Z.merge([], o.getElementsByTagName("script")), g), 
      b.splice.apply(b, [ s + 1, 0 ].concat(v)), s += v.length));
      return b;
    },
    cleanData: function(e, t) {
      for (var i, n, a, s, r = 0, o = Z.expando, l = Z.cache, d = Z.support.deleteExpando, c = Z.event.special; null != (a = e[r]); r++) if ((t || Z.acceptData(a)) && (n = a[o], 
      i = n && l[n])) {
        if (i.events) for (s in i.events) c[s] ? Z.event.remove(a, s) : Z.removeEvent(a, s, i.handle);
        l[n] && (delete l[n], d ? delete a[o] : a.removeAttribute ? a.removeAttribute(o) : a[o] = null, 
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
  var ii, ni, ai, si = /alpha\([^)]*\)/i, ri = /opacity=([^)]*)/, oi = /^(top|right|bottom|left)$/, li = /^(none|table(?!-c[ea]).+)/, di = /^margin/, ci = RegExp("^(" + Q + ")(.*)$", "i"), ui = RegExp("^(" + Q + ")(?!px)[a-z%]+$", "i"), hi = RegExp("^([-+])=(" + Q + ")", "i"), pi = {}, fi = {
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
    style: function(e, i, n, a) {
      if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
        var s, r, o, l = Z.camelCase(i), d = e.style;
        if (i = Z.cssProps[l] || (Z.cssProps[l] = g(d, l)), o = Z.cssHooks[i] || Z.cssHooks[l], 
        n === t) return o && "get" in o && (s = o.get(e, !1, a)) !== t ? s : d[i];
        if (r = typeof n, "string" === r && (s = hi.exec(n)) && (n = (s[1] + 1) * s[2] + parseFloat(Z.css(e, i)), 
        r = "number"), !(null == n || "number" === r && isNaN(n) || ("number" !== r || Z.cssNumber[l] || (n += "px"), 
        o && "set" in o && (n = o.set(e, n, a)) === t))) try {
          d[i] = n;
        } catch (c) {}
      }
    },
    css: function(e, i, n, a) {
      var s, r, o, l = Z.camelCase(i);
      return i = Z.cssProps[l] || (Z.cssProps[l] = g(e.style, l)), o = Z.cssHooks[i] || Z.cssHooks[l], 
      o && "get" in o && (s = o.get(e, !0, a)), s === t && (s = ii(e, i)), "normal" === s && i in mi && (s = mi[i]), 
      n || a !== t ? (r = parseFloat(s), n || Z.isNumeric(r) ? r || 0 : s) : s;
    },
    swap: function(e, t, i) {
      var n, a, s = {};
      for (a in t) s[a] = e.style[a], e.style[a] = t[a];
      n = i.call(e);
      for (a in t) e.style[a] = s[a];
      return n;
    }
  }), e.getComputedStyle ? ii = function(t, i) {
    var n, a, s, r, o = e.getComputedStyle(t, null), l = t.style;
    return o && (n = o[i], "" !== n || Z.contains(t.ownerDocument, t) || (n = Z.style(t, i)), 
    ui.test(n) && di.test(i) && (a = l.width, s = l.minWidth, r = l.maxWidth, l.minWidth = l.maxWidth = l.width = n, 
    n = o.width, l.width = a, l.minWidth = s, l.maxWidth = r)), n;
  } : j.documentElement.currentStyle && (ii = function(e, t) {
    var i, n, a = e.currentStyle && e.currentStyle[t], s = e.style;
    return null == a && s && s[t] && (a = s[t]), ui.test(a) && !oi.test(t) && (i = s.left, 
    n = e.runtimeStyle && e.runtimeStyle.left, n && (e.runtimeStyle.left = e.currentStyle.left), 
    s.left = "fontSize" === t ? "1em" : a, a = s.pixelLeft + "px", s.left = i, n && (e.runtimeStyle.left = n)), 
    "" === a ? "auto" : a;
  }), Z.each([ "height", "width" ], function(e, i) {
    Z.cssHooks[i] = {
      get: function(e, n, a) {
        return n ? 0 === e.offsetWidth && li.test(ii(e, "display")) ? Z.swap(e, fi, function() {
          return w(e, i, a);
        }) : w(e, i, a) : t;
      },
      set: function(e, t, n) {
        return b(e, t, n ? x(e, i, n, Z.support.boxSizing && "border-box" === Z.css(e, "boxSizing")) : 0);
      }
    };
  }), Z.support.opacity || (Z.cssHooks.opacity = {
    get: function(e, t) {
      return ri.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : "";
    },
    set: function(e, t) {
      var i = e.style, n = e.currentStyle, a = Z.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : "", s = n && n.filter || i.filter || "";
      i.zoom = 1, t >= 1 && "" === Z.trim(s.replace(si, "")) && i.removeAttribute && (i.removeAttribute("filter"), 
      n && !n.filter) || (i.filter = si.test(s) ? s.replace(si, a) : s + " " + a);
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
        var n, a = "string" == typeof i ? i.split(" ") : [ i ], s = {};
        for (n = 0; 4 > n; n++) s[e + gi[n] + t] = a[n] || a[n - 2] || a[0];
        return s;
      }
    }, di.test(e) || (Z.cssHooks[e + t].set = b);
  });
  var bi = /%20/g, xi = /\[\]$/, wi = /\r?\n/g, _i = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i, ki = /^(?:select|textarea)/i;
  Z.fn.extend({
    serialize: function() {
      return Z.param(this.serializeArray());
    },
    serializeArray: function() {
      return this.map(function() {
        return this.elements ? Z.makeArray(this.elements) : this;
      }).filter(function() {
        return this.name && !this.disabled && (this.checked || ki.test(this.nodeName) || _i.test(this.type));
      }).map(function(e, t) {
        var i = Z(this).val();
        return null == i ? null : Z.isArray(i) ? Z.map(i, function(e) {
          return {
            name: t.name,
            value: e.replace(wi, "\r\n")
          };
        }) : {
          name: t.name,
          value: i.replace(wi, "\r\n")
        };
      }).get();
    }
  }), Z.param = function(e, i) {
    var n, a = [], s = function(e, t) {
      t = Z.isFunction(t) ? t() : null == t ? "" : t, a[a.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t);
    };
    if (i === t && (i = Z.ajaxSettings && Z.ajaxSettings.traditional), Z.isArray(e) || e.jquery && !Z.isPlainObject(e)) Z.each(e, function() {
      s(this.name, this.value);
    }); else for (n in e) k(n, e[n], i, s);
    return a.join("&").replace(bi, "+");
  };
  var Ci, Ei, Ti = /#.*$/, $i = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, Si = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/, Ii = /^(?:GET|HEAD)$/, Ni = /^\/\//, Di = /\?/, Pi = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, Ai = /([?&])_=[^&]*/, Mi = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/, Oi = Z.fn.load, zi = {}, Li = {}, Hi = [ "*/" ] + [ "*" ];
  try {
    Ei = q.href;
  } catch (Fi) {
    Ei = j.createElement("a"), Ei.href = "", Ei = Ei.href;
  }
  Ci = Mi.exec(Ei.toLowerCase()) || [], Z.fn.load = function(e, i, n) {
    if ("string" != typeof e && Oi) return Oi.apply(this, arguments);
    if (!this.length) return this;
    var a, s, r, o = this, l = e.indexOf(" ");
    return l >= 0 && (a = e.slice(l, e.length), e = e.slice(0, l)), Z.isFunction(i) ? (n = i, 
    i = t) : i && "object" == typeof i && (s = "POST"), Z.ajax({
      url: e,
      type: s,
      dataType: "html",
      data: i,
      complete: function(e, t) {
        n && o.each(n, r || [ e.responseText, t, e ]);
      }
    }).done(function(e) {
      r = arguments, o.html(a ? Z("<div>").append(e.replace(Pi, "")).find(a) : e);
    }), this;
  }, Z.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(e, t) {
    Z.fn[t] = function(e) {
      return this.on(t, e);
    };
  }), Z.each([ "get", "post" ], function(e, i) {
    Z[i] = function(e, n, a, s) {
      return Z.isFunction(n) && (s = s || a, a = n, n = t), Z.ajax({
        type: i,
        url: e,
        data: n,
        success: a,
        dataType: s
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
      isLocal: Si.test(Ci[1]),
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
    ajaxPrefilter: C(zi),
    ajaxTransport: C(Li),
    ajax: function(e, i) {
      function n(e, i, n, r) {
        var d, u, y, b, w, k = i;
        2 !== x && (x = 2, l && clearTimeout(l), o = t, s = r || "", _.readyState = e > 0 ? 4 : 0, 
        n && (b = $(h, _, n)), e >= 200 && 300 > e || 304 === e ? (h.ifModified && (w = _.getResponseHeader("Last-Modified"), 
        w && (Z.lastModified[a] = w), w = _.getResponseHeader("Etag"), w && (Z.etag[a] = w)), 
        304 === e ? (k = "notmodified", d = !0) : (d = S(h, b), k = d.state, u = d.data, 
        y = d.error, d = !y)) : (y = k, (!k || e) && (k = "error", 0 > e && (e = 0))), _.status = e, 
        _.statusText = (i || k) + "", d ? m.resolveWith(p, [ u, k, _ ]) : m.rejectWith(p, [ _, k, y ]), 
        _.statusCode(v), v = t, c && f.trigger("ajax" + (d ? "Success" : "Error"), [ _, h, d ? u : y ]), 
        g.fireWith(p, [ _, k ]), c && (f.trigger("ajaxComplete", [ _, h ]), --Z.active || Z.event.trigger("ajaxStop")));
      }
      "object" == typeof e && (i = e, e = t), i = i || {};
      var a, s, r, o, l, d, c, u, h = Z.ajaxSetup({}, i), p = h.context || h, f = p !== h && (p.nodeType || p instanceof Z) ? Z(p) : Z.event, m = Z.Deferred(), g = Z.Callbacks("once memory"), v = h.statusCode || {}, y = {}, b = {}, x = 0, w = "canceled", _ = {
        readyState: 0,
        setRequestHeader: function(e, t) {
          if (!x) {
            var i = e.toLowerCase();
            e = b[i] = b[i] || e, y[e] = t;
          }
          return this;
        },
        getAllResponseHeaders: function() {
          return 2 === x ? s : null;
        },
        getResponseHeader: function(e) {
          var i;
          if (2 === x) {
            if (!r) for (r = {}; i = $i.exec(s); ) r[i[1].toLowerCase()] = i[2];
            i = r[e.toLowerCase()];
          }
          return i === t ? null : i;
        },
        overrideMimeType: function(e) {
          return x || (h.mimeType = e), this;
        },
        abort: function(e) {
          return e = e || w, o && o.abort(e), n(0, e), this;
        }
      };
      if (m.promise(_), _.success = _.done, _.error = _.fail, _.complete = g.add, _.statusCode = function(e) {
        if (e) {
          var t;
          if (2 > x) for (t in e) v[t] = [ v[t], e[t] ]; else t = e[_.status], _.always(t);
        }
        return this;
      }, h.url = ((e || h.url) + "").replace(Ti, "").replace(Ni, Ci[1] + "//"), h.dataTypes = Z.trim(h.dataType || "*").toLowerCase().split(tt), 
      null == h.crossDomain && (d = Mi.exec(h.url.toLowerCase()) || !1, h.crossDomain = d && d.join(":") + (d[3] ? "" : "http:" === d[1] ? 80 : 443) !== Ci.join(":") + (Ci[3] ? "" : "http:" === Ci[1] ? 80 : 443)), 
      h.data && h.processData && "string" != typeof h.data && (h.data = Z.param(h.data, h.traditional)), 
      E(zi, h, i, _), 2 === x) return _;
      if (c = h.global, h.type = h.type.toUpperCase(), h.hasContent = !Ii.test(h.type), 
      c && 0 === Z.active++ && Z.event.trigger("ajaxStart"), !h.hasContent && (h.data && (h.url += (Di.test(h.url) ? "&" : "?") + h.data, 
      delete h.data), a = h.url, h.cache === !1)) {
        var k = Z.now(), C = h.url.replace(Ai, "$1_=" + k);
        h.url = C + (C === h.url ? (Di.test(h.url) ? "&" : "?") + "_=" + k : "");
      }
      (h.data && h.hasContent && h.contentType !== !1 || i.contentType) && _.setRequestHeader("Content-Type", h.contentType), 
      h.ifModified && (a = a || h.url, Z.lastModified[a] && _.setRequestHeader("If-Modified-Since", Z.lastModified[a]), 
      Z.etag[a] && _.setRequestHeader("If-None-Match", Z.etag[a])), _.setRequestHeader("Accept", h.dataTypes[0] && h.accepts[h.dataTypes[0]] ? h.accepts[h.dataTypes[0]] + ("*" !== h.dataTypes[0] ? ", " + Hi + "; q=0.01" : "") : h.accepts["*"]);
      for (u in h.headers) _.setRequestHeader(u, h.headers[u]);
      if (h.beforeSend && (h.beforeSend.call(p, _, h) === !1 || 2 === x)) return _.abort();
      w = "abort";
      for (u in {
        success: 1,
        error: 1,
        complete: 1
      }) _[u](h[u]);
      if (o = E(Li, h, i, _)) {
        _.readyState = 1, c && f.trigger("ajaxSend", [ _, h ]), h.async && h.timeout > 0 && (l = setTimeout(function() {
          _.abort("timeout");
        }, h.timeout));
        try {
          x = 1, o.send(y, n);
        } catch (T) {
          if (!(2 > x)) throw T;
          n(-1, T);
        }
      } else n(-1, "No Transport");
      return _;
    },
    active: 0,
    lastModified: {},
    etag: {}
  });
  var Ri = [], ji = /\?/, qi = /(=)\?(?=&|$)|\?\?/, Ui = Z.now();
  Z.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function() {
      var e = Ri.pop() || Z.expando + "_" + Ui++;
      return this[e] = !0, e;
    }
  }), Z.ajaxPrefilter("json jsonp", function(i, n, a) {
    var s, r, o, l = i.data, d = i.url, c = i.jsonp !== !1, u = c && qi.test(d), h = c && !u && "string" == typeof l && !(i.contentType || "").indexOf("application/x-www-form-urlencoded") && qi.test(l);
    return "jsonp" === i.dataTypes[0] || u || h ? (s = i.jsonpCallback = Z.isFunction(i.jsonpCallback) ? i.jsonpCallback() : i.jsonpCallback, 
    r = e[s], u ? i.url = d.replace(qi, "$1" + s) : h ? i.data = l.replace(qi, "$1" + s) : c && (i.url += (ji.test(d) ? "&" : "?") + i.jsonp + "=" + s), 
    i.converters["script json"] = function() {
      return o || Z.error(s + " was not called"), o[0];
    }, i.dataTypes[0] = "json", e[s] = function() {
      o = arguments;
    }, a.always(function() {
      e[s] = r, i[s] && (i.jsonpCallback = n.jsonpCallback, Ri.push(s)), o && Z.isFunction(r) && r(o[0]), 
      o = r = t;
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
        send: function(a, s) {
          i = j.createElement("script"), i.async = "async", e.scriptCharset && (i.charset = e.scriptCharset), 
          i.src = e.url, i.onload = i.onreadystatechange = function(e, a) {
            (a || !i.readyState || /loaded|complete/.test(i.readyState)) && (i.onload = i.onreadystatechange = null, 
            n && i.parentNode && n.removeChild(i), i = t, a || s(200, "success"));
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
    return !this.isLocal && I() || N();
  } : I, function(e) {
    Z.extend(Z.support, {
      ajax: !!e,
      cors: !!e && "withCredentials" in e
    });
  }(Z.ajaxSettings.xhr()), Z.support.ajax && Z.ajaxTransport(function(i) {
    if (!i.crossDomain || Z.support.cors) {
      var n;
      return {
        send: function(a, s) {
          var r, o, l = i.xhr();
          if (i.username ? l.open(i.type, i.url, i.async, i.username, i.password) : l.open(i.type, i.url, i.async), 
          i.xhrFields) for (o in i.xhrFields) l[o] = i.xhrFields[o];
          i.mimeType && l.overrideMimeType && l.overrideMimeType(i.mimeType), i.crossDomain || a["X-Requested-With"] || (a["X-Requested-With"] = "XMLHttpRequest");
          try {
            for (o in a) l.setRequestHeader(o, a[o]);
          } catch (d) {}
          l.send(i.hasContent && i.data || null), n = function(e, a) {
            var o, d, c, u, h;
            try {
              if (n && (a || 4 === l.readyState)) if (n = t, r && (l.onreadystatechange = Z.noop, 
              Wi && delete Bi[r]), a) 4 !== l.readyState && l.abort(); else {
                o = l.status, c = l.getAllResponseHeaders(), u = {}, h = l.responseXML, h && h.documentElement && (u.xml = h);
                try {
                  u.text = l.responseText;
                } catch (e) {}
                try {
                  d = l.statusText;
                } catch (p) {
                  d = "";
                }
                o || !i.isLocal || i.crossDomain ? 1223 === o && (o = 204) : o = u.text ? 200 : 404;
              }
            } catch (f) {
              a || s(-1, f);
            }
            u && s(o, d, u, c);
          }, i.async ? 4 === l.readyState ? setTimeout(n, 0) : (r = ++Xi, Wi && (Bi || (Bi = {}, 
          Z(e).unload(Wi)), Bi[r] = n), l.onreadystatechange = n) : n();
        },
        abort: function() {
          n && n(0, 1);
        }
      };
    }
  });
  var Yi, Vi, Gi = /^(?:toggle|show|hide)$/, Ki = RegExp("^(?:([-+])=|)(" + Q + ")([a-z%]*)$", "i"), Ji = /queueHooks$/, Zi = [ O ], Qi = {
    "*": [ function(e, t) {
      var i, n, a = this.createTween(e, t), s = Ki.exec(t), r = a.cur(), o = +r || 0, l = 1, d = 20;
      if (s) {
        if (i = +s[2], n = s[3] || (Z.cssNumber[e] ? "" : "px"), "px" !== n && o) {
          o = Z.css(a.elem, e, !0) || i || 1;
          do l = l || ".5", o /= l, Z.style(a.elem, e, o + n); while (l !== (l = a.cur() / r) && 1 !== l && --d);
        }
        a.unit = n, a.start = o, a.end = s[1] ? o + (s[1] + 1) * i : i;
      }
      return a;
    } ]
  };
  Z.Animation = Z.extend(A, {
    tweener: function(e, t) {
      Z.isFunction(e) ? (t = e, e = [ "*" ]) : e = e.split(" ");
      for (var i, n = 0, a = e.length; a > n; n++) i = e[n], Qi[i] = Qi[i] || [], Qi[i].unshift(t);
    },
    prefilter: function(e, t) {
      t ? Zi.unshift(e) : Zi.push(e);
    }
  }), Z.Tween = z, z.prototype = {
    constructor: z,
    init: function(e, t, i, n, a, s) {
      this.elem = e, this.prop = i, this.easing = a || "swing", this.options = t, this.start = this.now = this.cur(), 
      this.end = n, this.unit = s || (Z.cssNumber[i] ? "" : "px");
    },
    cur: function() {
      var e = z.propHooks[this.prop];
      return e && e.get ? e.get(this) : z.propHooks._default.get(this);
    },
    run: function(e) {
      var t, i = z.propHooks[this.prop];
      return this.pos = t = this.options.duration ? Z.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : e, 
      this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), 
      i && i.set ? i.set(this) : z.propHooks._default.set(this), this;
    }
  }, z.prototype.init.prototype = z.prototype, z.propHooks = {
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
  }, z.propHooks.scrollTop = z.propHooks.scrollLeft = {
    set: function(e) {
      e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now);
    }
  }, Z.each([ "toggle", "show", "hide" ], function(e, t) {
    var i = Z.fn[t];
    Z.fn[t] = function(n, a, s) {
      return null == n || "boolean" == typeof n || !e && Z.isFunction(n) && Z.isFunction(a) ? i.apply(this, arguments) : this.animate(L(t, !0), n, a, s);
    };
  }), Z.fn.extend({
    fadeTo: function(e, t, i, n) {
      return this.filter(v).css("opacity", 0).show().end().animate({
        opacity: t
      }, e, i, n);
    },
    animate: function(e, t, i, n) {
      var a = Z.isEmptyObject(e), s = Z.speed(t, i, n), r = function() {
        var t = A(this, Z.extend({}, e), s);
        a && t.stop(!0);
      };
      return a || s.queue === !1 ? this.each(r) : this.queue(s.queue, r);
    },
    stop: function(e, i, n) {
      var a = function(e) {
        var t = e.stop;
        delete e.stop, t(n);
      };
      return "string" != typeof e && (n = i, i = e, e = t), i && e !== !1 && this.queue(e || "fx", []), 
      this.each(function() {
        var t = !0, i = null != e && e + "queueHooks", s = Z.timers, r = Z._data(this);
        if (i) r[i] && r[i].stop && a(r[i]); else for (i in r) r[i] && r[i].stop && Ji.test(i) && a(r[i]);
        for (i = s.length; i--; ) s[i].elem !== this || null != e && s[i].queue !== e || (s[i].anim.stop(n), 
        t = !1, s.splice(i, 1));
        (t || !n) && Z.dequeue(this, e);
      });
    }
  }), Z.each({
    slideDown: L("show"),
    slideUp: L("hide"),
    slideToggle: L("toggle"),
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
  }, Z.timers = [], Z.fx = z.prototype.init, Z.fx.tick = function() {
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
    var i, n, a, s, r, o, l, d = {
      top: 0,
      left: 0
    }, c = this[0], u = c && c.ownerDocument;
    if (u) return (n = u.body) === c ? Z.offset.bodyOffset(c) : (i = u.documentElement, 
    Z.contains(i, c) ? (c.getBoundingClientRect !== t && (d = c.getBoundingClientRect()), 
    a = H(u), s = i.clientTop || n.clientTop || 0, r = i.clientLeft || n.clientLeft || 0, 
    o = a.pageYOffset || i.scrollTop, l = a.pageXOffset || i.scrollLeft, {
      top: d.top + o - s,
      left: d.left + l - r
    }) : d);
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
      var a, s, r = Z(e), o = r.offset(), l = Z.css(e, "top"), d = Z.css(e, "left"), c = ("absolute" === n || "fixed" === n) && Z.inArray("auto", [ l, d ]) > -1, u = {}, h = {};
      c ? (h = r.position(), a = h.top, s = h.left) : (a = parseFloat(l) || 0, s = parseFloat(d) || 0), 
      Z.isFunction(t) && (t = t.call(e, i, o)), null != t.top && (u.top = t.top - o.top + a), 
      null != t.left && (u.left = t.left - o.left + s), "using" in t ? t.using.call(e, u) : r.css(u);
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
    Z.fn[e] = function(a) {
      return Z.access(this, function(e, a, s) {
        var r = H(e);
        return s === t ? r ? i in r ? r[i] : r.document.documentElement[a] : e[a] : (r ? r.scrollTo(n ? Z(r).scrollLeft() : s, n ? s : Z(r).scrollTop()) : e[a] = s, 
        t);
      }, e, a, arguments.length, null);
    };
  }), Z.each({
    Height: "height",
    Width: "width"
  }, function(e, i) {
    Z.each({
      padding: "inner" + e,
      content: i,
      "": "outer" + e
    }, function(n, a) {
      Z.fn[a] = function(a, s) {
        var r = arguments.length && (n || "boolean" != typeof a), o = n || (a === !0 || s === !0 ? "margin" : "border");
        return Z.access(this, function(i, n, a) {
          var s;
          return Z.isWindow(i) ? i.document.documentElement["client" + e] : 9 === i.nodeType ? (s = i.documentElement, 
          Math.max(i.body["scroll" + e], s["scroll" + e], i.body["offset" + e], s["offset" + e], s["client" + e])) : a === t ? Z.css(i, n, a, o) : Z.style(i, n, a, o);
        }, i, r ? a : t, r, null);
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
        var a = t(e.target).offset();
        e.offsetY = e.pageY - a.top, e.offsetX = e.pageX - a.left;
      }
      return e;
    };
  }
}), define(function(e) {
  function t(e) {
    var t, s = e || window.event, r = [].slice.call(arguments, 1), o = 0, l = 0, d = 0, c = 0, u = 0;
    return e = a.event.fix(s), e.type = "mousewheel", s.wheelDelta && (o = s.wheelDelta), 
    s.detail && (o = -1 * s.detail), s.deltaY && (d = -1 * s.deltaY, o = d), s.deltaX && (l = s.deltaX, 
    o = -1 * l), void 0 !== s.wheelDeltaY && (d = s.wheelDeltaY), void 0 !== s.wheelDeltaX && (l = -1 * s.wheelDeltaX), 
    c = Math.abs(o), (!i || i > c) && (i = c), u = Math.max(Math.abs(d), Math.abs(l)), 
    (!n || n > u) && (n = u), t = o > 0 ? "floor" : "ceil", o = Math[t](o / i), l = Math[t](l / n), 
    d = Math[t](d / n), r.unshift(e, o, l, d), (a.event.dispatch || a.event.handle).apply(this, r);
  }
  var i, n, a = e("jquery"), s = [ "wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll" ], r = "onwheel" in document || document.documentMode >= 9 ? [ "wheel" ] : [ "mousewheel", "DomMouseScroll", "MozMousePixelScroll" ];
  if (a.event.fixHooks) for (var o = s.length; o; ) a.event.fixHooks[s[--o]] = a.event.mouseHooks;
  a.event.special.mousewheel = {
    setup: function() {
      if (this.addEventListener) for (var e = r.length; e; ) this.addEventListener(r[--e], t, !1); else this.onmousewheel = t;
    },
    teardown: function() {
      if (this.removeEventListener) for (var e = r.length; e; ) this.removeEventListener(r[--e], t, !1); else this.onmousewheel = null;
    }
  }, a.fn.extend({
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
    return e = a(e), i = a.fn.dndsortable.defaults.dragenterData, 1 === arguments.length ? e.data(i) || 0 : (t ? e.data(i, Math.max(0, t)) : e.data(i, null), 
    void 0);
  }
  function i(e, t) {
    var i = a(e).next();
    i[0] === t ? a(e).before(t) : (a(t).before(e), i.before(t));
  }
  function n(e, t, i, n, a) {
    if (n) {
      var s = e.data("drag-timer");
      s && (clearTimeout(s), s = null, e.removeData("drag-timer")), s = setTimeout(function() {
        a(t, i);
      }, n), e.data("drag-timer", s);
    } else a(t, i);
  }
  var a = e("jquery");
  a.fn.dndsortable = function(e) {
    return e = a.extend({}, a.fn.dndsortable.defaults, e), this.each(function() {
      var s, r, o = a(this), l = e.list + e.items, d = o.find(e.items);
      d.addClass(e.childClass).prop("draggable", e.draggable), o.on("dragstart.ui", l, function(t) {
        return t.stopPropagation(), t.originalEvent.dataTransfer && (t.originalEvent.dataTransfer.effectAllowed = "moving", 
        t.originalEvent.dataTransfer.setData("Text", e.setData(this))), s = a(r = this).addClass(e.draggingClass).index(), 
        e.start && e.start.call(this, s), !0;
      }).on("dragend.ui", l, function(i) {
        return i.stopPropagation(), a(this).removeClass(e.draggingClass), e.end && e.end.call(this, s), 
        s = void 0, r = null, t(this, !1), !1;
      }).on("dragenter.ui", l, function() {
        if (!r || r === this) return !0;
        var i = this, s = a(i), l = t(this);
        return t(this, l + 1), 0 === l && (s.addClass(e.overClass), e.wrap || n(o, r, this, e.delay, function(t, i) {
          e.enter && e.enter.call(i), s[a(t).index() < s.index() ? "after" : "before"](t);
        })), !1;
      }).on("dragleave.ui", l, function() {
        var i = t(this);
        return t(this, i - 1), t(this) || (a(this).removeClass(e.overClass), t(this, !1), 
        e.leave && e.leave.call(this)), !1;
      }).on("drop.ui", l, function(t) {
        return t.stopPropagation(), t.preventDefault(), this !== r ? (e.wrap && n(o, r, this, e.delay, function(n, a) {
          e.sort ? e.sort.call(o, n, a) : i.call(o, n, a);
          var s;
          t.originalEvent.dataTransfer && (s = t.originalEvent.dataTransfer.getData("Text")), 
          e.change && e.change.call(a, s);
        }), !1) : void 0;
      }).on("dragover.ui", l, function(e) {
        return r ? (e.stopPropagation(), e.preventDefault(), !1) : !0;
      });
    });
  }, a.fn.dndsortable.defaults = {
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
      t(this).bind("resize", r);
    },
    teardown: function() {
      t(this).unbind("resize", r);
    }
  };
  var i, n, a, s = 250, r = function() {
    n = new Date().getTime(), a = n - o, a >= s ? (o = n, t(this).trigger("throttledresize")) : (i && clearTimeout(i), 
    i = setTimeout(r, s - a));
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
      var n, a = 0;
      for (t = void 0 !== t ? t : void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now(); i > a; ) n = e[a], 
      n && n.update(t) ? a++ : (e.splice(a, 1), i--);
      return !0;
    }
  };
}();

TWEEN.Tween = function(e) {
  var t = e, i = {}, n = {}, a = {}, s = 1e3, r = 0, o = 0, l = null, d = TWEEN.Easing.Linear.None, c = TWEEN.Interpolation.Linear, u = [], h = null, p = !1, f = null, m = null;
  for (var g in e) i[g] = parseFloat(e[g], 10);
  this.to = function(e, t) {
    return void 0 !== t && (s = t), n = e, this;
  }, this.start = function(e) {
    TWEEN.add(this), p = !1, l = void 0 !== e ? e : void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now(), 
    l += o;
    for (var s in n) {
      if (n[s] instanceof Array) {
        if (0 === n[s].length) continue;
        n[s] = [ t[s] ].concat(n[s]);
      }
      i[s] = t[s], i[s] instanceof Array == !1 && (i[s] *= 1), a[s] = i[s] || 0;
    }
    return this;
  }, this.stop = function() {
    return TWEEN.remove(this), this;
  }, this.delay = function(e) {
    return o = e, this;
  }, this.repeat = function(e) {
    return r = e, this;
  }, this.easing = function(e) {
    return d = e, this;
  }, this.interpolation = function(e) {
    return c = e, this;
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
    var g = (e - l) / s;
    g = g > 1 ? 1 : g;
    var v = d(g);
    for (var y in n) {
      var b = i[y] || 0, x = n[y];
      x instanceof Array ? t[y] = c(x, v) : ("string" == typeof x && (x = b + parseFloat(x, 10)), 
      t[y] = b + (x - b) * v);
    }
    if (null !== f && f.call(t, v), 1 == g) {
      if (r > 0) {
        isFinite(r) && r--;
        for (var y in a) "string" == typeof n[y] && (a[y] = a[y] + parseFloat(n[y], 10)), 
        i[y] = a[y];
        return l = e + o, !0;
      }
      null !== m && m.call(t);
      for (var w = 0, _ = u.length; _ > w; w++) u[w].start(e);
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
    var i = e.length - 1, n = i * t, a = Math.floor(n), s = TWEEN.Interpolation.Utils.Linear;
    return 0 > t ? s(e[0], e[1], n) : t > 1 ? s(e[i], e[i - 1], i - n) : s(e[a], e[a + 1 > i ? i : a + 1], n - a);
  },
  Bezier: function(e, t) {
    var i, n = 0, a = e.length - 1, s = Math.pow, r = TWEEN.Interpolation.Utils.Bernstein;
    for (i = 0; a >= i; i++) n += s(1 - t, a - i) * s(t, i) * e[i] * r(a, i);
    return n;
  },
  CatmullRom: function(e, t) {
    var i = e.length - 1, n = i * t, a = Math.floor(n), s = TWEEN.Interpolation.Utils.CatmullRom;
    return e[0] === e[i] ? (0 > t && (a = Math.floor(n = i * (1 + t))), s(e[(a - 1 + i) % i], e[a], e[(a + 1) % i], e[(a + 2) % i], n - a)) : 0 > t ? e[0] - (s(e[0], e[0], e[1], e[1], -n) - e[0]) : t > 1 ? e[i] - (s(e[i], e[i], e[i - 1], e[i - 1], n - i) - e[i]) : s(e[a ? a - 1 : 0], e[a], e[a + 1 > i ? i : a + 1], e[a + 2 > i ? i : a + 2], n - a);
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
    CatmullRom: function(e, t, i, n, a) {
      var s = .5 * (i - e), r = .5 * (n - t), o = a * a, l = a * o;
      return (2 * t - 2 * i + s + r) * l + (-3 * t + 3 * i - 2 * s - r) * o + s * a + t;
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
    var a = 0;
    i = function(e) {
      var i = t(), n = Math.max(0, 16 - (i - a)), s = setTimeout(function() {
        e(i + n);
      }, n);
      return a = i + n, s;
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
        return d in o && o[d];
      } catch (e) {
        return !1;
      }
    }
    function t() {
      try {
        return c in o && o[c] && o[c][o.location.hostname];
      } catch (e) {
        return !1;
      }
    }
    function n(e) {
      return function() {
        var t = Array.prototype.slice.call(arguments, 0);
        t.unshift(s), h.appendChild(s), s.addBehavior("#default#userData"), s.load(d);
        var i = e.apply(r, t);
        return h.removeChild(s), i;
      };
    }
    function a(e) {
      return e.replace(m, "___");
    }
    var s, r = {}, o = window, l = o.document, d = "localStorage", c = "globalStorage", u = "__storejs__";
    if (r.disabled = !1, r.set = function() {}, r.get = function() {}, r.remove = function() {}, 
    r.clear = function() {}, r.transact = function(e, t, i) {
      var n = r.get(e);
      null == i && (i = t, t = null), n === void 0 && (n = t || {}), i(n), r.set(e, n);
    }, r.getAll = function() {}, r.serialize = function(e) {
      return JSON.stringify(e);
    }, r.deserialize = function(e) {
      if ("string" != typeof e) return void 0;
      try {
        return JSON.parse(e);
      } catch (t) {
        return e || void 0;
      }
    }, e()) s = o[d], r.set = function(e, t) {
      return void 0 === t ? r.remove(e) : (s.setItem(e, r.serialize(t)), t);
    }, r.get = function(e) {
      return r.deserialize(s.getItem(e));
    }, r.remove = function(e) {
      s.removeItem(e);
    }, r.clear = function() {
      s.clear();
    }, r.getAll = function() {
      for (var e = {}, t = 0; s.length > t; ++t) {
        var i = s.key(t);
        e[i] = r.get(i);
      }
      return e;
    }; else if (t()) s = o[c][o.location.hostname], r.set = function(e, t) {
      return void 0 === t ? r.remove(e) : (s[e] = r.serialize(t), t);
    }, r.get = function(e) {
      return r.deserialize(s[e] && s[e].value);
    }, r.remove = function(e) {
      delete s[e];
    }, r.clear = function() {
      for (var e in s) delete s[e];
    }, r.getAll = function() {
      for (var e = {}, t = 0; s.length > t; ++t) {
        var i = s.key(t);
        e[i] = r.get(i);
      }
      return e;
    }; else if (l.documentElement.addBehavior) {
      var h, p;
      try {
        p = new ActiveXObject("htmlfile"), p.open(), p.write('<script>document.w=window</script><iframe src="/favicon.ico"></frame>'), 
        p.close(), h = p.w.frames[0].document, s = h.createElement("div");
      } catch (f) {
        s = l.createElement("div"), h = l.body;
      }
      var m = RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g");
      r.set = n(function(e, t, i) {
        return t = a(t), void 0 === i ? r.remove(t) : (e.setAttribute(t, r.serialize(i)), 
        e.save(d), i);
      }), r.get = n(function(e, t) {
        return t = a(t), r.deserialize(e.getAttribute(t));
      }), r.remove = n(function(e, t) {
        t = a(t), e.removeAttribute(t), e.save(d);
      }), r.clear = n(function(e) {
        var t = e.XMLDocument.documentElement.attributes;
        e.load(d);
        for (var i, n = 0; i = t[n]; n++) e.removeAttribute(i.name);
        e.save(d);
      }), r.getAll = n(function(e) {
        var t = e.XMLDocument.documentElement.attributes;
        e.load(d);
        for (var i, n = {}, a = 0; i = t[a]; ++a) n[i] = r.get(i);
        return n;
      });
    }
    try {
      r.set(u, u), r.get(u) != u && (r.disabled = !0), r.remove(u);
    } catch (f) {
      r.disabled = !0;
    }
    r.enabled = !r.disabled, i !== void 0 && "function" != typeof i ? i.exports = r : "function" == typeof define && define.amd ? define(r) : this.store = r;
  })();
}), define("marked", function(e, t, i) {
  (function() {
    function e(e, t) {
      return "!" !== e[0][0] ? '<a href="' + r(t.href) + '"' + (t.title ? ' title="' + r(t.title) + '"' : "") + ">" + f.lexer(e[1]) + "</a>" : '<img src="' + r(t.href) + '" alt="' + r(e[1]) + '"' + (t.title ? ' title="' + r(t.title) + '"' : "") + ">";
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
        g.text = g.code)), g.escaped || (g.text = r(g.text, !0)), "<pre><code" + (g.lang ? ' class="lang-' + g.lang + '"' : "") + ">" + g.text + "</code></pre>\n";

       case "blockquote_start":
        for (var e = ""; "blockquote_end" !== t().type; ) e += n();
        return "<blockquote>\n" + e + "</blockquote>\n";

       case "list_start":
        for (var i = g.ordered ? "ol" : "ul", e = ""; "list_end" !== t().type; ) e += n();
        return "<" + i + ">\n" + e + "</" + i + ">\n";

       case "list_item_start":
        for (var e = ""; "list_item_end" !== t().type; ) e += "text" === g.type ? a() : n();
        return "<li>" + e + "</li>\n";

       case "loose_item_start":
        for (var e = ""; "list_item_end" !== t().type; ) e += n();
        return "<li>" + e + "</li>\n";

       case "html":
        return v.sanitize ? f.lexer(g.text) : g.pre || v.pedantic ? g.text : f.lexer(g.text);

       case "paragraph":
        return "<p>" + f.lexer(g.text) + "</p>\n";

       case "text":
        return "<p>" + a() + "</p>\n";
      }
    }
    function a() {
      for (var e, i = g.text; (e = m[m.length - 1]) && "text" === e.type; ) i += "\n" + t().text;
      return f.lexer(i);
    }
    function s(e) {
      m = e.reverse();
      for (var i = ""; t(); ) i += n();
      return m = null, g = null, i;
    }
    function r(e, t) {
      return e.replace(t ? /&/g : /&(?!#?\w+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }
    function o(e) {
      for (var t, i = "", n = e.length, a = 0; n > a; a++) t = e.charCodeAt(a), Math.random() > .5 && (t = "x" + t.toString(16)), 
      i += "&#" + t + ";";
      return i;
    }
    function l() {
      var e = "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+";
      return e;
    }
    function d(e, t) {
      return e = e.source, t = t || "", function i(n, a) {
        return n ? (e = e.replace(n, a.source || a), i) : RegExp(e, t);
      };
    }
    function c() {}
    function u(e, t) {
      return h(t), s(p.lexer(e));
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
      fences: c,
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
    p.item = d(p.item, "gm")(/bull/g, p.bullet)(), p.list = d(p.list)(/bull/g, p.bullet)("hr", /\n+(?=(?: *[-*_]){3,} *(?:\n+|$))/)(), 
    p.html = d(p.html)("comment", /<!--[^\0]*?-->/)("closed", /<(tag)[^\0]+?<\/\1>/)("closing", /<tag(?!:\/|@)\b(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g, l())(), 
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
    }, p.gfm.paragraph = d(p.paragraph)("(?!", "(?!" + p.gfm.fences.source.replace(/(^|[^\[])\^/g, "$1") + "|")(), 
    p.lexer = function(e) {
      var t = [];
      return t.links = {}, e = e.replace(/\r\n|\r/g, "\n").replace(/\t/g, "    "), p.token(e, t, !0);
    }, p.token = function(e, t, i) {
      for (var n, a, s, r, o, l, d, e = e.replace(/^ +$/gm, ""); e; ) if ((s = p.newline.exec(e)) && (e = e.substring(s[0].length), 
      s[0].length > 1 && t.push({
        type: "space"
      })), s = p.code.exec(e)) e = e.substring(s[0].length), s = s[0].replace(/^ {4}/gm, ""), 
      t.push({
        type: "code",
        text: v.pedantic ? s : s.replace(/\n+$/, "")
      }); else if (s = p.fences.exec(e)) e = e.substring(s[0].length), t.push({
        type: "code",
        lang: s[1],
        text: s[2]
      }); else if (s = p.heading.exec(e)) e = e.substring(s[0].length), t.push({
        type: "heading",
        depth: s[1].length,
        text: s[2]
      }); else if (s = p.lheading.exec(e)) e = e.substring(s[0].length), t.push({
        type: "heading",
        depth: "=" === s[2] ? 1 : 2,
        text: s[1]
      }); else if (s = p.hr.exec(e)) e = e.substring(s[0].length), t.push({
        type: "hr"
      }); else if (s = p.blockquote.exec(e)) e = e.substring(s[0].length), t.push({
        type: "blockquote_start"
      }), s = s[0].replace(/^ *> ?/gm, ""), p.token(s, t, i), t.push({
        type: "blockquote_end"
      }); else if (s = p.list.exec(e)) {
        for (e = e.substring(s[0].length), t.push({
          type: "list_start",
          ordered: isFinite(s[2])
        }), s = s[0].match(p.item), n = !1, d = s.length, l = 0; d > l; l++) r = s[l], o = r.length, 
        r = r.replace(/^ *([*+-]|\d+\.) +/, ""), ~r.indexOf("\n ") && (o -= r.length, r = v.pedantic ? r.replace(/^ {1,4}/gm, "") : r.replace(RegExp("^ {1," + o + "}", "gm"), "")), 
        a = n || /\n\n(?!\s*$)/.test(r), l !== d - 1 && (n = "\n" === r[r.length - 1], a || (a = n)), 
        t.push({
          type: a ? "loose_item_start" : "list_item_start"
        }), p.token(r, t), t.push({
          type: "list_item_end"
        });
        t.push({
          type: "list_end"
        });
      } else (s = p.html.exec(e)) ? (e = e.substring(s[0].length), t.push({
        type: "html",
        pre: "pre" === s[1],
        text: s[0]
      })) : i && (s = p.def.exec(e)) ? (e = e.substring(s[0].length), t.links[s[1].toLowerCase()] = {
        href: s[2],
        title: s[3]
      }) : i && (s = p.paragraph.exec(e)) ? (e = e.substring(s[0].length), t.push({
        type: "paragraph",
        text: s[0]
      })) : (s = p.text.exec(e)) && (e = e.substring(s[0].length), t.push({
        type: "text",
        text: s[0]
      }));
      return t;
    };
    var f = {
      escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
      autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
      url: c,
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
    f.link = d(f.link)("inside", f._linkInside)("href", f._linkHref)(), f.reflink = d(f.reflink)("inside", f._linkInside)(), 
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
      for (var i, n, a, s, l = "", d = m.links; t; ) if (s = f.escape.exec(t)) t = t.substring(s[0].length), 
      l += s[1]; else if (s = f.autolink.exec(t)) t = t.substring(s[0].length), "@" === s[2] ? (n = ":" === s[1][6] ? o(s[1].substring(7)) : o(s[1]), 
      a = o("mailto:") + n) : (n = r(s[1]), a = n), l += '<a href="' + a + '">' + n + "</a>"; else if (s = f.url.exec(t)) t = t.substring(s[0].length), 
      n = r(s[1]), a = n, l += '<a href="' + a + '">' + n + "</a>"; else if (s = f.tag.exec(t)) t = t.substring(s[0].length), 
      l += v.sanitize ? r(s[0]) : s[0]; else if (s = f.link.exec(t)) t = t.substring(s[0].length), 
      l += e(s, {
        href: s[2],
        title: s[3]
      }); else if ((s = f.reflink.exec(t)) || (s = f.nolink.exec(t))) {
        if (t = t.substring(s[0].length), i = (s[2] || s[1]).replace(/\s+/g, " "), i = d[i.toLowerCase()], 
        !i || !i.href) {
          l += s[0][0], t = s[0].substring(1) + t;
          continue;
        }
        l += e(s, i);
      } else (s = f.strong.exec(t)) ? (t = t.substring(s[0].length), l += "<strong>" + f.lexer(s[2] || s[1]) + "</strong>") : (s = f.em.exec(t)) ? (t = t.substring(s[0].length), 
      l += "<em>" + f.lexer(s[2] || s[1]) + "</em>") : (s = f.code.exec(t)) ? (t = t.substring(s[0].length), 
      l += "<code>" + r(s[2], !0) + "</code>") : (s = f.br.exec(t)) ? (t = t.substring(s[0].length), 
      l += "<br>") : (s = f.text.exec(t)) && (t = t.substring(s[0].length), l += r(s[0]));
      return l;
    };
    var m, g;
    c.exec = c;
    var v, y;
    u.options = u.setOptions = function(e) {
      return y = e, h(e), u;
    }, u.setOptions({
      gfm: !0,
      pedantic: !1,
      sanitize: !1,
      highlight: null
    }), u.parser = function(e, t) {
      return h(t), s(e);
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
    e.registerHelper("blockHelperMissing", function(n, a) {
      var s = a.inverse || function() {}, r = a.fn, o = t.call(n);
      return o === i && (n = n.call(this)), n === !0 ? r(this) : n === !1 || null == n ? s(this) : "[object Array]" === o ? n.length > 0 ? e.helpers.each(n, a) : s(this) : r(n);
    }), e.K = function() {}, e.createFrame = Object.create || function(t) {
      e.K.prototype = t;
      var i = new e.K();
      return e.K.prototype = null, i;
    }, e.registerHelper("each", function(t, i) {
      var n, a = i.fn, s = i.inverse, r = "";
      if (i.data && (n = e.createFrame(i.data)), t && t.length > 0) for (var o = 0, l = t.length; l > o; o++) n && (n.index = o), 
      r += a(t[o], {
        data: n
      }); else r = s(this);
      return r;
    }), e.registerHelper("if", function(n, a) {
      var s = t.call(n);
      return s === i && (n = n.call(this)), !n || e.Utils.isEmpty(n) ? a.inverse(this) : a.fn(this);
    }), e.registerHelper("unless", function(t, i) {
      var n = i.fn, a = i.inverse;
      return i.fn = a, i.inverse = n, e.helpers["if"].call(this, t, i);
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
      performAction: function(e, t, i, n, a, s) {
        var r = s.length - 1;
        switch (a) {
         case 1:
          return s[r - 1];

         case 2:
          this.$ = new n.ProgramNode(s[r - 2], s[r]);
          break;

         case 3:
          this.$ = new n.ProgramNode(s[r]);
          break;

         case 4:
          this.$ = new n.ProgramNode([]);
          break;

         case 5:
          this.$ = [ s[r] ];
          break;

         case 6:
          s[r - 1].push(s[r]), this.$ = s[r - 1];
          break;

         case 7:
          this.$ = new n.BlockNode(s[r - 2], s[r - 1].inverse, s[r - 1], s[r]);
          break;

         case 8:
          this.$ = new n.BlockNode(s[r - 2], s[r - 1], s[r - 1].inverse, s[r]);
          break;

         case 9:
          this.$ = s[r];
          break;

         case 10:
          this.$ = s[r];
          break;

         case 11:
          this.$ = new n.ContentNode(s[r]);
          break;

         case 12:
          this.$ = new n.CommentNode(s[r]);
          break;

         case 13:
          this.$ = new n.MustacheNode(s[r - 1][0], s[r - 1][1]);
          break;

         case 14:
          this.$ = new n.MustacheNode(s[r - 1][0], s[r - 1][1]);
          break;

         case 15:
          this.$ = s[r - 1];
          break;

         case 16:
          this.$ = new n.MustacheNode(s[r - 1][0], s[r - 1][1]);
          break;

         case 17:
          this.$ = new n.MustacheNode(s[r - 1][0], s[r - 1][1], !0);
          break;

         case 18:
          this.$ = new n.PartialNode(s[r - 1]);
          break;

         case 19:
          this.$ = new n.PartialNode(s[r - 2], s[r - 1]);
          break;

         case 20:
          break;

         case 21:
          this.$ = [ [ s[r - 2] ].concat(s[r - 1]), s[r] ];
          break;

         case 22:
          this.$ = [ [ s[r - 1] ].concat(s[r]), null ];
          break;

         case 23:
          this.$ = [ [ s[r - 1] ], s[r] ];
          break;

         case 24:
          this.$ = [ [ s[r] ], null ];
          break;

         case 25:
          this.$ = [ [ new n.DataNode(s[r]) ], null ];
          break;

         case 26:
          s[r - 1].push(s[r]), this.$ = s[r - 1];
          break;

         case 27:
          this.$ = [ s[r] ];
          break;

         case 28:
          this.$ = s[r];
          break;

         case 29:
          this.$ = new n.StringNode(s[r]);
          break;

         case 30:
          this.$ = new n.IntegerNode(s[r]);
          break;

         case 31:
          this.$ = new n.BooleanNode(s[r]);
          break;

         case 32:
          this.$ = new n.DataNode(s[r]);
          break;

         case 33:
          this.$ = new n.HashNode(s[r]);
          break;

         case 34:
          s[r - 1].push(s[r]), this.$ = s[r - 1];
          break;

         case 35:
          this.$ = [ s[r] ];
          break;

         case 36:
          this.$ = [ s[r - 2], s[r] ];
          break;

         case 37:
          this.$ = [ s[r - 2], new n.StringNode(s[r]) ];
          break;

         case 38:
          this.$ = [ s[r - 2], new n.IntegerNode(s[r]) ];
          break;

         case 39:
          this.$ = [ s[r - 2], new n.BooleanNode(s[r]) ];
          break;

         case 40:
          this.$ = [ s[r - 2], new n.DataNode(s[r]) ];
          break;

         case 41:
          this.$ = new n.IdNode(s[r]);
          break;

         case 42:
          s[r - 2].push(s[r]), this.$ = s[r - 2];
          break;

         case 43:
          this.$ = [ s[r] ];
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
        var i = this, n = [ 0 ], a = [ null ], s = [], r = this.table, o = "", l = 0, d = 0, c = 0;
        this.lexer.setInput(e), this.lexer.yy = this.yy, this.yy.lexer = this.lexer, this.yy.parser = this, 
        this.lexer.yylloc === void 0 && (this.lexer.yylloc = {});
        var u = this.lexer.yylloc;
        s.push(u);
        var h = this.lexer.options && this.lexer.options.ranges;
        "function" == typeof this.yy.parseError && (this.parseError = this.yy.parseError);
        for (var p, f, m, g, v, y, b, x, w, _ = {}; ;) {
          if (m = n[n.length - 1], this.defaultActions[m] ? g = this.defaultActions[m] : ((null === p || p === void 0) && (p = t()), 
          g = r[m] && r[m][p]), g === void 0 || !g.length || !g[0]) {
            var k = "";
            if (!c) {
              w = [];
              for (y in r[m]) this.terminals_[y] && y > 2 && w.push("'" + this.terminals_[y] + "'");
              k = this.lexer.showPosition ? "Parse error on line " + (l + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + w.join(", ") + ", got '" + (this.terminals_[p] || p) + "'" : "Parse error on line " + (l + 1) + ": Unexpected " + (1 == p ? "end of input" : "'" + (this.terminals_[p] || p) + "'"), 
              this.parseError(k, {
                text: this.lexer.match,
                token: this.terminals_[p] || p,
                line: this.lexer.yylineno,
                loc: u,
                expected: w
              });
            }
          }
          if (g[0] instanceof Array && g.length > 1) throw Error("Parse Error: multiple actions possible at state: " + m + ", token: " + p);
          switch (g[0]) {
           case 1:
            n.push(p), a.push(this.lexer.yytext), s.push(this.lexer.yylloc), n.push(g[1]), p = null, 
            f ? (p = f, f = null) : (d = this.lexer.yyleng, o = this.lexer.yytext, l = this.lexer.yylineno, 
            u = this.lexer.yylloc, c > 0 && c--);
            break;

           case 2:
            if (b = this.productions_[g[1]][1], _.$ = a[a.length - b], _._$ = {
              first_line: s[s.length - (b || 1)].first_line,
              last_line: s[s.length - 1].last_line,
              first_column: s[s.length - (b || 1)].first_column,
              last_column: s[s.length - 1].last_column
            }, h && (_._$.range = [ s[s.length - (b || 1)].range[0], s[s.length - 1].range[1] ]), 
            v = this.performAction.call(_, o, d, l, this.yy, g[1], a, s), v !== void 0) return v;
            b && (n = n.slice(0, 2 * -1 * b), a = a.slice(0, -1 * b), s = s.slice(0, -1 * b)), 
            n.push(this.productions_[g[1]][0]), a.push(_.$), s.push(_._$), x = r[n[n.length - 2]][n[n.length - 1]], 
            n.push(x);
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
          var a = this.yylloc.range;
          return this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: i ? (i.length === n.length ? this.yylloc.first_column : 0) + n[n.length - i.length].length - i[0].length : this.yylloc.first_column - t
          }, this.options.ranges && (this.yylloc.range = [ a[0], a[0] + this.yyleng - t ]), 
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
          var e, t, i, n, a;
          this._more || (this.yytext = "", this.match = "");
          for (var s = this._currentRules(), r = 0; s.length > r && (i = this._input.match(this.rules[s[r]]), 
          !i || t && !(i[0].length > t[0].length) || (t = i, n = r, this.options.flex)); r++) ;
          return t ? (a = t[0].match(/(?:\r\n?|\n).*/g), a && (this.yylineno += a.length), 
          this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: a ? a[a.length - 1].length - a[a.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + t[0].length
          }, this.yytext += t[0], this.match += t[0], this.matches = t, this.yyleng = this.yytext.length, 
          this.options.ranges && (this.yylloc.range = [ this.offset, this.offset += this.yyleng ]), 
          this._more = !1, this._input = this._input.slice(t[0].length), this.matched += t[0], 
          e = this.performAction.call(this, this.yy, this, s[n], this.conditionStack[this.conditionStack.length - 1]), 
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
      var n = this.id = e[0], a = this.params = e.slice(1), s = this.eligibleHelper = n.isSimple;
      this.isHelper = s && (a.length || t);
    }, Handlebars.AST.PartialNode = function(e, t) {
      this.type = "partial", this.id = e, this.context = t;
    };
    var e = function(e, t) {
      if (e.original !== t.original) throw new Handlebars.Exception(e.original + " doesn't match " + t.original);
    };
    Handlebars.AST.BlockNode = function(t, i, n, a) {
      e(t.id, a), this.type = "block", this.mustache = t, this.program = i, this.inverse = n, 
      this.inverse && !this.program && (this.isInverse = !0);
    }, Handlebars.AST.ContentNode = function(e) {
      this.type = "content", this.string = e;
    }, Handlebars.AST.HashNode = function(e) {
      this.type = "hash", this.pairs = e;
    }, Handlebars.AST.IdNode = function(e) {
      this.type = "ID", this.original = e.join(".");
      for (var t = [], i = 0, n = 0, a = e.length; a > n; n++) {
        var s = e[n];
        ".." === s ? i++ : "." === s || "this" === s ? this.isScoped = !0 : t.push(s);
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
        for (var e, t, i, n = this.opcodes, a = [], s = 0, r = n.length; r > s; s++) if (e = n[s], 
        "DECLARE" === e.opcode) a.push("DECLARE " + e.name + "=" + e.value); else {
          t = [];
          for (var o = 0; e.args.length > o; o++) i = e.args[o], "string" == typeof i && (i = '"' + i.replace("\n", "\\n") + '"'), 
          t.push(i);
          a.push(e.opcode + " " + t.join(" "));
        }
        return a.join("\n");
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
        for (var n = 0, a = i.length; a > n; n++) t = i[n], this[t.type](t);
        return this.isSimple = 1 === a, this.depths.list = this.depths.list.sort(function(e, t) {
          return e - t;
        }), this;
      },
      compileProgram: function(e) {
        var t, i = new this.compiler().compile(e, this.options), n = this.guid++;
        this.usePartial = this.usePartial || i.usePartial, this.children[n] = i;
        for (var a = 0, s = i.depths.list.length; s > a; a++) t = i.depths.list[a], 2 > t || this.addDepth(t - 1);
        return n;
      },
      block: function(e) {
        var t = e.mustache, i = e.program, n = e.inverse;
        i && (i = this.compileProgram(i)), n && (n = this.compileProgram(n));
        var a = this.classifyMustache(t);
        "helper" === a ? this.helperMustache(t, i, n) : "simple" === a ? (this.simpleMustache(t), 
        this.opcode("pushProgram", i), this.opcode("pushProgram", n), this.opcode("pushLiteral", "{}"), 
        this.opcode("blockValue")) : (this.ambiguousMustache(t, i, n), this.opcode("pushProgram", i), 
        this.opcode("pushProgram", n), this.opcode("pushLiteral", "{}"), this.opcode("ambiguousBlockValue")), 
        this.opcode("append");
      },
      hash: function(e) {
        var t, i, n = e.pairs;
        this.opcode("push", "{}");
        for (var a = 0, s = n.length; s > a; a++) t = n[a], i = t[1], this.accept(i), this.opcode("assignToHash", t[0]);
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
        var n = e.id, a = n.parts[0];
        this.opcode("getContext", n.depth), this.opcode("pushProgram", t), this.opcode("pushProgram", i), 
        this.opcode("invokeAmbiguous", a);
      },
      simpleMustache: function(e) {
        var t = e.id;
        "DATA" === t.type ? this.DATA(t) : t.parts.length ? this.ID(t) : (this.addDepth(t.depth), 
        this.opcode("getContext", t.depth), this.opcode("pushContext")), this.opcode("resolvePossibleLambda");
      },
      helperMustache: function(e, t, i) {
        var n = this.setupFullMustacheParams(e, t, i), a = e.id.parts[0];
        if (this.options.knownHelpers[a]) this.opcode("invokeKnownHelper", n.length, a); else {
          if (this.knownHelpersOnly) throw Error("You specified knownHelpersOnly, but used the unknown helper " + a);
          this.opcode("invokeHelper", n.length, a);
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
          var a = e.id.parts[0];
          n.knownHelpers[a] ? t = !0 : n.knownHelpersOnly && (i = !1);
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
        var a, s = e.opcodes;
        for (this.i = 0, r = s.length; r > this.i; this.i++) a = s[this.i], "DECLARE" === a.opcode ? this[a.name] = a.value : this[a.opcode].apply(this, a.args);
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
        for (var n = this.isChild ? [ "depth0", "data" ] : [ "Handlebars", "depth0", "helpers", "partials", "data" ], a = 0, s = this.environment.depths.list.length; s > a; a++) n.push("depth" + this.environment.depths.list[a]);
        if (e) return n.push(this.source.join("\n  ")), Function.apply(this, n);
        var r = "function " + (this.name || "") + "(" + n.join(",") + ") {\n  " + this.source.join("\n  ") + "}";
        return Handlebars.log(Handlebars.logger.DEBUG, r + "\n\n"), r;
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
        var n = this.nameLookup("depth" + this.lastContext, e, "context"), a = this.nextStack();
        this.source.push("if (foundHelper) { " + a + " = foundHelper.call(" + t.callParams + "); }"), 
        this.source.push("else { " + a + " = " + n + "; " + a + " = typeof " + a + " === functionType ? " + a + "() : " + a + "; }");
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
        for (var i, n, a = e.children, s = 0, r = a.length; r > s; s++) {
          i = a[s], n = new this.compiler(), this.context.programs.push("");
          var o = this.context.programs.length;
          i.index = o, i.name = "program" + o, this.context.programs[o] = n.compile(i, t, this.context);
        }
      },
      programExpression: function(e) {
        if (this.context.aliases.self = "this", null == e) return "self.noop";
        for (var t, i = this.environment.children[e], n = i.depths.list, a = [ i.index, i.name, "data" ], s = 0, r = n.length; r > s; s++) t = n[s], 
        1 === t ? a.push("depth0") : a.push("depth" + (t - 1));
        return 0 === n.length ? "self.program(" + a.join(", ") + ")" : (a.shift(), "self.programWithDepth(" + a.join(", ") + ")");
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
        var i, n, a, s = [], r = [];
        s.push("hash:" + this.popStack()), n = this.popStack(), a = this.popStack(), (a || n) && (a || (this.context.aliases.self = "this", 
        a = "self.noop"), n || (this.context.aliases.self = "this", n = "self.noop"), s.push("inverse:" + n), 
        s.push("fn:" + a));
        for (var o = 0; e > o; o++) i = this.popStack(), t.push(i), this.options.stringParams && r.push(this.popStack());
        return this.options.stringParams && s.push("contexts:[" + r.join(",") + "]"), this.options.data && s.push("data:data"), 
        t.push("{" + s.join(",") + "}"), t.join(", ");
      }
    };
    for (var n = "break else new var case finally return void catch for switch while continue function this with default if throw delete in try do instanceof typeof abstract enum int short boolean export interface static byte extends long super char final native synchronized class float package throws const goto private transient debugger implements protected volatile double import public let yield".split(" "), a = t.RESERVED_WORDS = {}, s = 0, r = n.length; r > s; s++) a[n[s]] = !0;
    t.isValidJavaScriptVariableName = function(e) {
      return !t.RESERVED_WORDS[e] && /^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(e) ? !0 : !1;
    };
  }(Handlebars.Compiler, Handlebars.JavaScriptCompiler), Handlebars.precompile = function(e, t) {
    t = t || {};
    var i = Handlebars.parse(e), n = new Handlebars.Compiler().compile(i, t);
    return new Handlebars.JavaScriptCompiler().compile(n, t);
  }, Handlebars.compile = function(e, t) {
    function i() {
      var i = Handlebars.parse(e), n = new Handlebars.Compiler().compile(i, t), a = new Handlebars.JavaScriptCompiler().compile(n, t, void 0, !0);
      return Handlebars.template(a);
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
      return function(n, a) {
        return a = a || {}, e.apply(this, [ n, a.data || t ].concat(i));
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
    invokePartial: function(e, t, i, n, a, s) {
      var r = {
        helpers: n,
        partials: a,
        data: s
      };
      if (void 0 === e) throw new Handlebars.Exception("The partial " + t + " could not be found");
      if (e instanceof Function) return e(i, r);
      if (Handlebars.compile) return a[t] = Handlebars.compile(e, {
        data: void 0 !== s
      }), a[t](i, r);
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
  var n = e("rex"), a = e("handlebars");
  a.registerHelper("capitalize", function(e) {
    return i(e);
  }), a.registerHelper("printIdentityNameFromInvitations", function(e, i) {
    var n = t(e, i), a = "";
    return n && (a = n.identity.name), a;
  }), a.registerHelper("isOAuthIdentity", function(e, t) {
    var i = -1 !== "twitter facebook google flickr instagram dropbox".indexOf(e);
    return a.helpers["if"].call(this, i, t);
  });
}), define("util", function() {
  "use strict";
  var e = /^\s+/, t = /\s+$/, i = /[^0-9a-zA-Z_\u4e00-\u9fa5\ \'\.]+/g, n = String.prototype.trim, a = {
    zh_CN: i,
    cut30length: function(e, t) {
      if (!e) return "";
      for (e = e.replace(i, " "), t || (t = 30); a.utf8length(e) > t; ) e = e.substring(0, e.length - 1);
      return e;
    },
    utf8length: function(e) {
      for (var t, i = e.length, n = 0, a = 0; i > a; a++) if (t = e.charCodeAt(a), 127 > t) n++; else if (2047 >= t) n += 2; else if (55295 >= t || t >= 57344) n += 3; else {
        if (!(56319 >= t)) throw "Error: Invalid UTF-16 sequence. Missing high-surrogate code.";
        if (t = e.charCodeAt(++a), 56320 > t || t > 57343) throw "Error: Invalid UTF-16 sequence. Missing low-surrogate code.";
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
      var e = /^([a-z0-9_\.]{1,})@facebook$/i, t = /^@([a-z0-9_]{1,15})$|^@?([a-z0-9_]{1,15})@twitter$/i, i = /^([a-z0-9_\.]{1,})@instagram$/i, n = /^(.*)@dropbox$/i, s = /^(.*)@flickr$/i, r = /^[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i, o = /^[^@]*<[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?>$/i, l = /^(\+)?((?:(86)?(1(?:3\d|4[57]|5\d|8\d)\d{8}))|(?:(1)?(\d{5,15})))$/;
      return function(d) {
        var c, u = {};
        if (d = a.trim(d), (c = d.match(n)) && r.test(c[1])) u.name = c[1], u.external_username = c[1], 
        u.provider = "dropbox"; else if (c = d.match(s)) u.name = c[1], u.external_username = c[1], 
        u.provider = "flickr"; else if (c = d.match(i)) u.name = c[1], u.external_username = c[1], 
        u.provider = "instagram"; else if (c = d.match(e)) u.name = c[1], u.external_username = c[1], 
        u.provider = "facebook"; else if (c = d.match(t)) u.name = c[1] || c[2], u.external_username = u.name, 
        u.provider = "twitter"; else if (r.test(d)) u.name = a.cut30length(d.split("@")[0]), 
        u.external_username = d, u.provider = "email"; else if (o.test(d)) {
          var h = d.indexOf("<");
          u.name = a.cut30length(d.substring(0, h).replace(/^"|^'|"$|'$/g, "")), u.external_username = u.name, 
          u.provider = "email";
        } else if (c = d.replace(/[\s\-\(\)\_]/g, "").match(l)) {
          var p, f, m = c[1];
          u.provider = "phone", m ? c[3] && c[4] ? (p = c[3], f = c[4], u.name = u.external_username = m + p + f) : c[5] && c[6] ? (p = c[5], 
          f = c[6], u.name = u.external_username = m + p + f) : (u.name = d, u.provider = null) : (m = "+", 
          c[4] ? (p = "86", f = c[4]) : (p = "1", f = c[2]), u.name = u.external_username = m + p + f);
        } else u.name = d, u.provider = null;
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
  return a;
}), function() {
  "use strict";
  var e = /(?:\{\{|%\{)(\w*?)(?:\}\}?)/gm, t = /^\d{4}-\d{2}-\d{2}$/, i = /^\d{2}:\d{2}:\d{2}$/, n = .2, a = 6e4, s = 864e5, r = {
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
      return t = 1 === i ? "Tomorrow" : 2 === i ? "In two days" : r.weekdaysShort[n] + ". in {{days}} days";
    },
    "13": function(e) {
      var t = "", i = e.years, n = e.months;
      return i && (t = "{{years}} year" + (1 === i ? "" : "s")), n && (t += (t ? " " : "") + "{{months}} month" + (1 === n ? "" : "s")), 
      "In " + t;
    }
  }, o = function(e, t, i, n) {
    var a, s = o.locales[o.locale], r = o.distanceOfTime(e, t), l = o.diff(r);
    return l.type = i, a = o.inWords(l, s), "function" == typeof n && (a = n(a.data)), 
    a;
  }, l = o.parseISO = function(e) {
    return new Date(Date.parse(e));
  }, d = o.toISO = function(e) {
    return e.replace(/\s/, "T").replace(/\s/, "").replace(/([+\-]\d\d)(?::?)(\d\d)/, "$1:$2");
  };
  o.locale = "en", o.locales = {
    en: r
  }, o.inWords = function(e, t) {
    var i, n = t[e.token], a = e.type, s = e.date;
    return i = "function" == typeof n ? n(s, a) : n, g(i, s);
  }, o.diff = function(e) {
    var t, i, s, r, o, l, d = e.target, c = e.distance, u = v(c / a), h = {
      date: {}
    }, p = h.date, f = e.days;
    return p.isToday = e.isToday, d._isToday ? h.token = -1 : -43199 > u ? (h.token = 0, 
    s = v(-u / 525949), i = v(-u % 525949 / 43829 + n)) : -1439 > u ? (h.token = 1, 
    t = 3 > -f ? -f : v((-u + 1439) / 1440)) : -107 > u ? (h.token = 2, r = v(-u / 60 + n)) : -81 > u ? h.token = 3 : -59 > u ? h.token = 4 : -29 > u ? (h.token = 5, 
    o = -u) : 0 > u ? (h.token = 6, o = -u) : 0 === u ? h.token = 7 : 60 > u ? (h.token = 8, 
    o = u) : 82 > u ? h.token = 9 : 108 > u ? h.token = 10 : 1440 > u ? (h.token = 11, 
    r = v(u / 60 + n)) : 43200 > u ? (h.token = 12, t = 3 > f ? f : v((u + 1439) / 1440), 
    l = d.getDay()) : (h.token = 13, s = v(u / 525949), i = v(u % 525949 / 43829 + n), 
    12 === i && (i = 0, s++)), s && (p.years = s), i && (p.months = i), t && (p.days = t), 
    r && (p.hours = r), o && (p.minutes = o), l !== void 0 && (p.day = l), h;
  }, o.distanceOfTime = function(e, t) {
    e ? "number" == typeof e ? e = new Date(e) : "string" == typeof e && (e = l(d(e))) : e = new Date(), 
    t ? "number" == typeof t ? t = new Date(t) : "string" == typeof t && (t = l(d(t))) : t = new Date(), 
    e._reTime && (t.setHours(0), t.setMinutes(0), t.setSeconds(0), t.setMilliseconds(0));
    var i = e.getFullYear(), n = e.getMonth(), a = e.getDate(), r = t.getFullYear(), o = t.getMonth(), c = t.getDate();
    return {
      target: e,
      source: t,
      distance: +e - +t,
      days: (+new Date(i, n, a) - +new Date(r, o, c)) / s,
      isToday: i === r && n === o && a === c
    };
  }, o.toLocaleDate = function(e) {
    var t, i, n, a = e.outputformat, s = new Date(), r = s.getFullYear() + "-" + p(s.getMonth() + 1) + "-" + p(s.getDate()), o = !1, d = !1;
    if (a) t = s, n = r, o = !0; else {
      var c = e.begin_at, u = c.date, h = c.time, g = c.timezone, v = "";
      u ? (v = f(u), h ? v += "T" + m(h) : (d = !0, o = v === r)) : (v = r, h && (v += "T" + m(h))), 
      u && h && g && (v += "Z"), t = l(v), d && (t.setHours(0), t.setMinutes(0), t.setSeconds(0), 
      t.setMilliseconds(0)), i = n = t.getFullYear() + "-" + p(t.getMonth() + 1) + "-" + p(t.getDate()), 
      n += h ? " " + p(t.getHours()) + ":" + p(t.getMinutes()) + ":" + p(t.getSeconds()) : "";
    }
    return t._isToday = o, t._reTime = d, {
      date: t,
      text: n
    };
  };
  var c = {
    date: function(e, t, i, n) {
      var a = o.locales[o.locale];
      return a.weekdaysShort[n] + ", " + a.monthsShort[t] + " " + i;
    },
    time: function(e, t) {
      var i = e > 12 ? e - 12 : e, n = i + ":" + p(t);
      return n += e >= 12 ? "PM" : "AM";
    }
  };
  o.printEFTime = function(e, t, i) {
    var n, a, s, r, l, d = e.outputformat, p = e.begin_at, f = "X" === t, m = {
      title: "",
      content: ""
    }, g = new Date();
    if (d) n = e.origin.replace(/^['"‘’“”“”‚„]+/, "").replace(/['"‘’“”“”‚„]+$/, ""), 
    m.title = n, f || (m.content = n, p.date && (e.outputformat = 0, a = o.toLocaleDate(e), 
    m.content = o(a.date, g), e.outputformat = 1)); else if (i || (i = c), p && (p.date || p.time ? (a = o.toLocaleDate(e), 
    s = a.date, p.date ? (m.title = o(a.date, g, "X"), m.content = p.time_word + (p.time_word && p.time ? " " : "") + (p.time ? i.time(s.getHours(), s.getMinutes()) : "") + (p.time || p.time_word ? p.time ? " " : ", " : "") + i.date(s.getFullYear(), s.getMonth(), s.getDate(), s.getDay()) + (p.date_word ? " " : "") + p.date_word) : p.time && (m.content = m.title = p.time_word + (p.time_word ? " " : "") + i.time(s.getHours(), s.getMinutes()) + (p.date_word ? ", " : "") + p.date_word), 
    s.getFullYear() !== g.getFullYear() && (m.content += " " + s.getFullYear())) : (p.date_word || p.time_word) && (m.content = m.title = p.time_word + (p.time_word ? ", " : "") + p.date_word), 
    p.timezone && (r = p.timezone.replace(/^([+\-]\d\d:\d\d)[\w\W]*$/, "$1"), l = u(g), 
    r !== l))) {
      var v = h(g);
      m.content += " (" + l + (v && " " + v) + ")";
    }
    return m;
  }, o.printTime = function(e, t) {
    e || (e = new Date()), t || (t = c);
    var i = new Date(), n = "";
    return n += t.date(e.getFullYear(), e.getMonth(), e.getDate(), e.getDay()) + " " + t.time(e.getHours(), e.getMinutes()), 
    e.getFullYear() !== i.getFullYear() && (n += " " + e.getFullYear()), n;
  };
  var u = o.getTimezone = function(e) {
    var t, i, n, a;
    return e || (e = new Date()), t = e.getTimezoneOffset(), a = 0 >= t ? "+" : "-", 
    t = Math.abs(t), i = v(t / 60), n = t - 60 * i, a + p(i) + ":" + p(n);
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
    var n, a, s, r, o = t.match(e), l = 0;
    if (o) for (;r = o[l]; ++l) a = r.replace(e, "$1"), s = i[a], n = RegExp(r.replace(/\{/gm, "\\{").replace(/\}/gm, "\\}")), 
    t = t.replace(n, s);
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
    var r, o, l, d = {};
    return t(d, c), t(d, e), r = a(), o = r.promise(), l = s(d).done(function(e, t, i) {
      var n = e && e.meta && e.meta.code;
      200 === n ? r.resolve(e.response, t, i) : r.reject(e, n, t, i);
    }).fail(function(e, t, i) {
      var n = e && e.meta && e.meta.code;
      r.reject(e, n, t, i);
    }), o.jqXHR = l, o.abort = function(e) {
      l && (l.abort(e), l = r = o = void 0);
    }, o.done(i).fail(n).always(function() {
      l = r = o = void 0;
    }), o;
  }
  var n = e("jquery"), a = n.Deferred, s = n.ajax, r = n.param, o = window._ENV_, l = {
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
    photox_getPhotoX: "/photox/:photox_id",
    photox_borwseSource: "/photox/browseSource",
    photox_getPhoto: "/photox/GetPhoto",
    photox_add: "/photox/:photox_id/Add",
    photox_getLikes: "/photox/:photox_id/GetLikes",
    photox_like: "/photox/Like",
    photox_del: "/photox/:photox_id/Delete"
  }, d = {
    _token: null,
    setToken: function(e) {
      this._token = e;
    },
    getToken: function() {
      return this._token;
    },
    request: function(e, t, n, a) {
      var s, o = l[e], c = t.params, u = t.resources;
      if (o) {
        if (c || (c = {}), c && (d._token && !c.token && (c.token = d._token), c = r(c), 
        o += c ? "?" + c : ""), u) for (s in u) o = o.replace(":" + s, encodeURIComponent(u[s]));
        return t.url = l.base_url + o, delete t.params, delete t.resources, i(t, n, a);
      }
    }
  }, c = {
    type: "GET",
    dataType: "JSON",
    timeout: 1e4,
    cache: !1,
    xhrFields: {
      withCredentials: !0
    }
  };
  return d;
}), define("widget", function(e) {
  "use strict";
  function t() {
    return "widget-" + c++;
  }
  function i(e) {
    return "function" == typeof e;
  }
  function n(e, t) {
    var n = e[t];
    return e && n ? i(n) ? e[t]() : n : void 0;
  }
  function a(e, t) {
    var i;
    for (i in t) "options" !== i && (e[i] = t[i]);
  }
  function s(e, t) {
    return e ? function(i) {
      return e.call(t, i);
    } : void 0;
  }
  var r = e("jquery"), o = e("base"), l = o.extend({
    options: {
      template: "<div />",
      events: null
    },
    initialize: function(e) {
      this.cid = t(), this.initOptions(e), this.parseElement(), this.delegateEvents(), 
      this.init(), l.caches[this.cid] = this;
    },
    initOptions: function(e) {
      this.setOptions(e), a(this, e);
    },
    parseElement: function() {
      var e = this.element, t = this.options.template;
      if (e ? this.element = e instanceof r ? e : r(e) : t && (this.element = r(t)), !this.element) throw "element is invalid";
      this.element.attr("data-widget-id", this.cid);
    },
    init: function() {},
    render: function() {
      return this;
    },
    delegateEvents: function(e) {
      if (e || (e = n(this.options, "events")), e) {
        this.undelegateEvents();
        var t, i, a, r, o;
        for (t in e) {
          if (i = e[t] || this[t], !i) throw 'Method "' + e[t] + '" does not exist';
          a = t.match(d), r = a[1], o = a[2] || null, r += ".delegateEvents" + this.cid, this.element.on(r, o, s(i, this));
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
  var d = /^(\S+)\s*(.*)$/, c = 0;
  return l;
}), define("dialog", function(e) {
  "use strict";
  function t() {
    this.isShown && this.options.backdrop ? (this.$backdrop = a(d).appendTo(this.parentNode), 
    this.$backdrop.click(a.proxy(this.hide, this)), this.$backdrop.addClass("in")) : !this.isShown && this.$backdrop && (this.$backdrop.removeClass("in"), 
    i.call(this));
  }
  function i() {
    this.$backdrop.remove(), this.$backdrop = null;
  }
  function n() {
    var e = this;
    this.isShown && this.options.keyboard ? r.on("keyup.dismiss.modal", function(t) {
      return 27 === t.which ? (t.stopPropagation(), t.preventDefault(), e && e.hide(), 
      !1) : void 0;
    }) : this.isShown || r.off("keyup.dismiss.modal");
  }
  var a = e("jquery"), s = e("widget"), r = a(document.body), o = a("#app-tmp"), l = s.extend({
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
        var i = e.title, n = e.body, s = e.footer, r = e.others, o = e.cls;
        o && this.element.addClass(o), i && this.element.find("h3").eq(0).html(i), n && this.element.find("div.modal-body").html(n), 
        s && this.element.find("div.modal-footer").html(s), r && this.element.find("div.modal-main").append(r);
      }
      return this.element.appendTo(this.parentNode), this.element.on("click.dismiss.dialog", '[data-dismiss="dialog"]', a.proxy(this.hide, this)), 
      this.element.on("destory.widget", a.proxy(this.destory, this)), this.sync(), this;
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
        this.offSrcNode(), r.find('[data-dialog-type="' + t + '"]').not(e).removeData("dialog");
      }
      this._destory(), e.remove();
    }
  }), d = '<div id="js-modal-backdrop" class="modal-backdrop" />';
  return l;
}), define("typeahead", function(e) {
  "use strict";
  function t(e, t) {
    return e ? function(i) {
      return e.call(t, i);
    } : void 0;
  }
  var i = e("jquery"), n = e("widget"), a = i("#app-tmp"), s = n.extend({
    options: {
      source: [],
      template: '<div class="popmenu hide"></div>',
      target: null,
      parentNode: a,
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
  return s;
}), define("panel", function(e) {
  "use strict";
  var t = e("jquery"), i = e("widget"), n = t.proxy, a = i.extend({
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
  return a;
}), define("xidentity", function(e) {
  "use strict";
  var t = e("jquery"), i = e("util"), n = e("api"), a = e("typeahead"), s = e("handlebars");
  return a.extend({
    itemRender: function(e) {
      var i = s.compile(this.options.viewData.item);
      return t(i(e));
    },
    matcher: function(e) {
      var t = e.external_id;
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
        item: '<li data-value="{{external_id}}"><i class="icon16-identity-{{provider}}"></i><span class="pull-left">{{external_id}}</span></li>'
      },
      onSelect: function(e) {
        this.emit("search", e);
      },
      onClearCache: function() {
        delete this.cache;
      },
      onSearch: function(e) {
        var a, s, r = this, o = r.options;
        if (r.cache || (r.cache = {}), !r.selecting && r.source && r.source.length && (s = t.grep(r.source, function(e) {
          return r.matcher(e);
        }), 0 === s.length ? r.isShown ? r.hide() : r : (s.length > 1 || e !== s[0].external_id) && r.render(s.slice(0)).show()), 
        r.timer && (clearTimeout(r.timer), r.target.next().addClass("hide")), (a = i.parseId(e)).provider) {
          var l = {
            provider: a.provider,
            external_username: a.external_username
          };
          r.timer = setTimeout(function() {
            clearTimeout(r.timer), c(e);
          }, o.delay);
          var d = function(e) {
            r.ajaxDefer && 4 > r.ajaxDefer.readyState && r.ajaxDefer.abort(), r.emit("autocomplete:beforesend", l), 
            o.useCache && r.cache[e] ? r.emit("autocomplete:finish", r.cache[e]) : r.ajaxDefer = n.request("getRegistrationFlag", {
              data: l,
              beforesend: function() {
                r.target.next().removeClass("hide");
              },
              complete: function() {
                r.target.next().addClass("hide");
              }
            }, function(t) {
              e === r.target.val() && (o.useCache && (r.cache[e] = t), t.identity || (t.identity = l), 
              r.emit("autocomplete:finish", t));
            });
          }, c = function(e) {
            e.length >= r.options.minLength ? (d(e), r.searchValue = e) : r.emit("autocomplete:clear");
          };
        } else r.emit("autocomplete:finish", null);
      }
    }
  });
}), define("xdialog", function(e, t) {
  "use strict";
  var i = e("jquery"), n = e("rex"), a = e("bus"), s = e("api"), r = e("util"), o = e("store"), l = e("handlebars"), d = e("dialog"), c = {};
  t.dialogs = c, c.identification = {
    options: {
      errors: {
        failed: "Password incorrect.",
        no_password: "Password incorrect.",
        no_external_id: "Set up this new identity."
      },
      onCheckUser: function() {
        var e = o.get("lastIdentity"), t = o.get("last_external_username");
        e && (this.availability = !0, this.$("#identity").val(t), this.$(".x-signin").removeClass("disabled loading"), 
        this.$(".user-identity").removeClass("hide").find("img").attr("src", e.avatar_filename).next().attr("class", "provider icon16-identity-" + e.provider), 
        this.$(".xbtn-forgotpwd").data("source", [ e ]), this.switchTab("d01")), this.$(".help-subject").toggleClass("icon14-question", !this.availability);
      },
      onShowBefore: function(e) {
        var t = i(e.currentTarget).data("source");
        t ? this.$("#identity").val(t) : this.emit("checkUser");
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
          var t = this, n = i(e.currentTarget), a = n.data("oauth");
          t.$(".authentication").find(".oauth-provider").text(a), t._oauth_ = i.ajax({
            url: "/OAuth/Authenticate?provider=" + a,
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
          var a = t._identity.provider, r = t._identity.external_id;
          s.request("verifyIdentity", {
            type: "POST",
            data: {
              provider: a,
              external_username: r
            }
          }, function(e) {
            t.$(".verify-before").addClass("hide"), "VERIFYING" === e.action ? (t.$(".verify-after").removeClass("hide"), 
            n.addClass("xbtn-success").text("Done")) : n.addClass("verify-error").removeClass("hide");
          });
        },
        "blur #identity": function(e) {
          var t = r.trim(i(e.currentTarget).val()), n = this.$('[for="identity"]'), a = n.find("span");
          t.length && !r.parseId(t).provider ? (n.addClass("label-error"), a.text("Invalid identity.")) : (n.removeClass("label-error"), 
          a.text(""));
        },
        "blur #name": function(e) {
          var t = r.trim(i(e.currentTarget).val()), n = this.$('[for="name"]'), a = n.find("span");
          t ? r.utf8length(t) > 30 ? (a.text("Too long."), n.addClass("label-error")) : r.zh_CN.test(t) ? (n.addClass("label-error"), 
          a.text("Invalid character.")) : (n.removeClass("label-error"), a.text("")) : (n.addClass("label-error"), 
          a.text(""));
        },
        "blur #password": function(e) {
          var t = r.trim(i(e.currentTarget).val()), n = this.$('[for="password"]'), a = n.find("span");
          t ? (n.removeClass("label-error"), a.text("")) : (n.addClass("label-error"), a.text("Password incorrect."));
        },
        "click .help-subject": function(e) {
          var t, n = i(e.currentTarget);
          n.hasClass("icon14-question") ? (t = 'Identity is your online representative, such as email, <span class="strike">mobile no.</span>, and your account username on other websites like Twitter, Facebook, etc.', 
          n.parent().find(".xalert-error:eq(0)").html(t).removeClass("hide")) : (n.toggleClass("icon14-question icon14-clear"), 
          this.resetInputs(), this.$(".user-identity").addClass("hide"), o.remove("lastIdentity"), 
          o.remove("last_external_username"), o.remove("authorization"), o.remove("user"), 
          o.remove("identities"), this.$('[data-typeahead-type="identity"]').data("typeahead").source = null, 
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
            var n = this, l = this.switchTabType, u = this.getFormData(l);
            n.$("#password").trigger("blur"), "d02" === l && n.$("#name").trigger("blur"), u.password && ("d02" !== l || u.name) && ("d01" === l || "d02" === l) && s.request("signin", {
              type: "POST",
              data: {
                external_username: u.external_username,
                provider: u.provider,
                password: u.password,
                name: u.name || "",
                auto_signin: !!u.auto_signin
              },
              beforeSend: function() {
                t.addClass("disabled loading");
              },
              complete: function() {
                t.removeClass("disabled loading");
              }
            }, function(e) {
              if (delete App.request.session.browsing_authorization, delete App.request.session.browsing_user, 
              o.set("authorization", e), o.set("last_external_username", r.printExtUserName(u)), 
              n.hide(), "d01" === l || "d02" === l) a.emit("app:user:signin", e.token, e.user_id, !1, !0); else {
                var t = new d(c.welcome);
                t.render(), t.show({
                  identity: {
                    name: u.name,
                    provider: u.provider
                  }
                });
              }
            }, function(e) {
              var t = e && e.meta, i = t && t.errorType || "", a = t && t.errorDetail || "";
              "no_password" === i || "failed" === i ? n.$('[for="password"]').addClass("label-error").find("span").text(a || n.options.errors[i]) : "no_external_id" === i && n.$("#name").nextAll(".xalert-info").removeClass("hide");
            });
          }
        }
      },
      backdrop: !0,
      viewData: {
        cls: "modal-id",
        title: "Start",
        body: '<div class="shadow title">Welcome to <span class="x-sign">EXFE</span></div><div class="clearfix"><div class="pull-left authorize">Authenticate with:</div><div class="pull-left oauth"><a href="#" class="oauth-twitter" data-oauth="twitter">twitter</a><a href="#" class="oauth-facebook" data-oauth="facebook">facebook</a></div></div><div class="orspliter">or</div><form class="modal-form"><fieldset><legend>Use your online identity:</legend><div class="clearfix control-group"><label class="control-label" for="identity">Identity: <span class="xalert-message"></span></label><div class="pull-right user-identity hide"><div class="avatar"><img src="" alt="" width="40" height="40" /><i class="provider"></i></div></div><div class="controls"><input type="text" class="input-large identity" id="identity" autocomplete="off" data-widget="typeahead" data-typeahead-type="identity" placeholder="Enter your email or phone" /><i class="help-subject"></i><i class="help-inline small-loading hide"></i><div class="xalert xalert-error hide" style="margin-top: 5px;"></div><div class="xalert xalert-error authenticate hide" style="margin-top: 5px;"><span class="xalert-fail">Please directly authenticate identity above.</span><br />To enable password sign-in for this identity, set an <span class="x-sign">EXFE</span> password first in your profile page.</div></div></div><div class="form-title d d02 hide">Welcome! Please set up your new account.<span class="pull-right form-title-bd"></span></div><div class="control-group d d02 hide"><label class="control-label" for="name">Display name: <span></span></label><div class="controls"><input type="text" class="input-large" id="name" autocomplete="off" placeholder="Desired recognizable name" /></div></div><div class="control-group d d01 d02 hide"><label class="control-label" for="password">Password: <span></span></label><div class="controls"><input type="password" class="input-large" id="password" autocomplete="off" /><i class="help-inline icon16-pass-hide pointer" id="password-eye"></i></div></div><div class="control-group d d01 hide"><div class="control-label"><label class="checkbox pointer"><input type="checkbox" id="auto-signin" value="1" checked />Sign in automatically</label></div></div><div class="control-group phone-tip hide"><div class="xalert">Please include country code prefix, e.g.: +1 555 450 0303</div></div><div class="verify-before d d04 hide"><span class="xalert-fail">This identity requires verification before using.</span><br />Confirm sending verification to your mailbox?</div><div class="verify-after hide">Verification sent, it should arrive in minutes. Please check your mailbox and follow the instruction.</div><div class="verify-error hide"><span class="xalert-fail">Requested too much, hold on awhile.</span><br />Receive no verification email? It might be mistakenly filtered as spam, please check and un-spam. Alternatively, use ‘Manual Verification’.</div></fieldset></form>',
        footer: '<button class="xbtn-white d d01 xbtn-forgotpwd hide" data-dialog-from="identification" data-widget="dialog" data-dialog-type="forgotpassword">Forgot Password...</button><button class="xbtn-white d d02 d04 xbtn-startover hide">Start Over</button><button class="pull-right d d04 xbtn-blue xbtn-verify hide">Verify</button><a href="#" class="pull-right xbtn-setup d d00 hide">Looking for sign-up?</a><button class="pull-right xbtn-blue d d01 d02 x-signin disabled hide">Start</button><button class="pull-right xbtn-white d d03 xbtn-isee hide">I See</button><button class="pull-right xbtn-white d hide">OK</button><button class="pull-right xbtn-white d xbtn-oauth hide">Back</button>',
        others: '<div class="isee d d03 hide"><div class="modal-body"><div class="shadow title">“Sign-Up-Free”</div><p>Tired of signing up all around? Just authorize through your existing accounts from other websites, such as Twitter, <span class="strike">Facebook, Google, etc.</span> (soon to support)</p><p>We hate spam, will NEVER disappoint your trust.</p><p>Alternatively, traditional registration process with email and password is also available.</p></div></div><div class="authentication d d05 hide"><div class="modal-body"><div class="shadow title">Authentication</div><div class="content"><img class="hide" src="/static/img/loading.gif" width="32" height="32" /><p class="redirecting hide">Redirecting to <span class="oauth-provider"></span>…</p><p class="xalert-fail hide">Failed to connect with <span class="oauth-provider"></span> server.</p></div></div></div>'
      }
    }
  }, c.sandbox = {
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
  }, c.welcome = {
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
        body: '<div class="shadow title"></div><div class="center shadow title" style="margin-bottom: 0;">Thanks for using <span class="x-sign">EXFE</span>.</div><p class="center">The group utility for gathering.</p><div class="modal-content"><p>We save you from calling up every one RSVP, losing in endless emails and messages off the point.</p><p><span class="x">·X·</span> (cross) is a gathering of people, for any purpose. When you get an idea to call up friends to do something together, just <span class="oblique">Gather a <span class="x">·X·</span></span>.</p><p><span class="x-sign">EXFE</span> your friends.</p><p class="provider-email hide" style="color: #191919;">*A welcome email has been sent to your mailbox. Please check to verify your address.*</p><div class="provider-other hide">&nbsp;&nbsp;<span class="underline why">why?</span><label class="pull-left checkbox pointer"><input type="checkbox" id="follow" value="1" checked />Follow @<span class="x-sign">EXFE</span> on Twitter.</label><p class="pull-left answer hidden">So we could send you invitation PRIVATELY through Direct Message. We hate spam, will NEVER disappoint your trust.</p></div></div>',
        footer: '<button class="pull-right xbtn-white xbtn-go">GO</button>'
      }
    }
  }, c.forgotpassword = {
    updateIdentity: function(e) {
      var t = e.provider, i = this.$(".context-identity");
      this.$(".tab").addClass("hide"), "email" === t ? (this.$(".tab1").removeClass("hide"), 
      this.$(".xbtn-send").data("identity", e)) : (this.$(".tab2").removeClass("hide"), 
      this.$(".authenticate").data("identity", e)), i.find(".avatar img").attr("src", e.avatar_filename), 
      i.find(".provider").attr("class", "provider icon16-identity-" + e.provider), i.find(".identity").text(e.eun);
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
          var t = this, n = i(e.currentTarget), a = n.data("identity");
          a && (t.befer = s.request("forgotPassword", {
            type: "POST",
            data: {
              provider: a.provider,
              external_username: a.external_username
            },
            beforeSend: function() {
              t.$(".send-before").removeClass("hide"), t.$(".send-after").addClass("hide"), n.addClass("disabled");
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
          var t = this, n = i(e.currentTarget);
          if (!n.hasClass("disabled")) {
            var a = n.data("identity");
            a && (t.befer = s.request("forgotPassword", {
              type: "POST",
              data: {
                provider: a.provider,
                external_username: a.external_username
              },
              beforeSend: function() {
                t.$(".send-before").removeClass("hide"), t.$(".send-after").addClass("hide"), n.addClass("disabled");
              },
              complete: function() {
                n.removeClass("disabled");
              }
            }, function(e) {
              "VERIFYING" === e.action && (t.$(".identity").next().removeClass("hide"), n.addClass("hide"), 
              t.$(".xbtn-done").removeClass("hide"), t.$(".send-before").addClass("hide"), t.$(".send-after").removeClass("hide"));
            }));
          }
        }
      },
      onShowBefore: function(e) {
        var t, n, a, s = this, r = i(e.currentTarget).data("source");
        if (r && (t = r.length)) {
          if (n = r[0], a = n.external_username, "twitter" === n.provider && (a = "@" + n.external_username), 
          n.eun = a, t > 1) {
            s.$(".context-identity").addClass("switcher");
            for (var o = "", l = 0; t > l; l++) a = r[l].external_username, o += '<li data-index="' + l + '"><i class="pull-right icon16-identity-' + r[l].provider + '"></i>', 
            "twitter" === r[l].provider && (a = "@" + r[l].external_username), r[l].eun = a, 
            o += "<span>" + a + "</span>", o += "</li>";
            s.$(".dropdown-menu").html(o).data("identities", r);
          }
          this.updateIdentity(n);
        }
      },
      backdrop: !1,
      viewData: {
        cls: "mblack modal-fp",
        title: "Forgot Password",
        body: '<div class="shadow title">Forgot Password</div><div>You can reset your <span class="x-sign">EXFE</span> password through identity:</div><div class="context-identity"><div class="pull-right avatar"><img src="" alt="" width="40" height="40" /><i class="provider"></i></div><div class="clearfix dropdown-toggle" data-toggle="dropdown"><div class="pull-left box identity"></div><ul class="dropdown-menu"></ul><div class="pull-left caret-outer hide"><b class="caret"></b></div></div></div><div class="alert-label"><div class="send-before tab tab1 hide">Confirm sending reset token to your mailbox?</div><div class="send-after tab hide">Verification sent, it should arrive in minutes. Please check your mailbox and follow the instruction.</div><div class="xalert-error tab hide"><p>Requested too much, hold on awhile.</p><p>Receive no verification email? It might be mistakenly filtered as spam, please check and un-spam. Alternatively, use ‘Manual Verification’.</p></div><div class="authenticate-before tab tab2 hide">You will be directed to Twitter website to authenticate identity above, you can reset password then.</div></div>',
        footer: '<button class="pull-right xbtn-white xbtn-done hide">Done</button><button class="pull-right xbtn-blue xbtn-send tab tab1 hide">Send</button><button class="pull-right xbtn-blue authenticate tab tab2 hide">Authenticate</button><a class="pull-right xbtn-cancel">Cancel</a>'
      }
    }
  }, c.changepassword = {
    options: {
      onHideAfter: function() {
        this.befer && (this.befer.abort(), this.befer = null), this.destory();
      },
      events: {
        "click .xbtn-resetpwd": function(e) {
          var t = o.get("user"), a = t.identities, s = n.filter(a, function(e) {
            return "CONNECTED" === e.status ? !0 : void 0;
          });
          if (1 === s.length) {
            e.stopPropagation(), this.hide();
            var r = new d(c.forgotpassword);
            r.dialog_from = "changepassword", r.render(), i(e.currentTarget).data("identity-id", s[0].id), 
            r.show(e);
          }
        },
        "click .password-eye": function(e) {
          var t = i(e.currentTarget), n = t.prev();
          n.prop("type", function(e, t) {
            return "password" === t ? "text" : "password";
          }), t.toggleClass("icon16-pass-hide icon16-pass-show");
        },
        "click .xbtn-forgotpwd": function(e) {
          var t = o.get("user"), a = t.identities, s = a.length, r = [];
          1 === s ? r.push(a[0]) : n.each(a, function(e) {
            var t = e.status;
            ("CONNECTED" === t || "REVOKED" === t) && r.push(e);
          }), i(e.currentTarget).data("source", r);
        },
        "click .xbtn-success": function(e) {
          var t = this, n = t.$("#cppwd").val(), a = t.$("#cp-npwd").val();
          if (!n || !a) return n ? alert("Please input new password.") : alert("Please input current password."), 
          void 0;
          e.preventDefault();
          var r = i(e.currentTarget), l = o.get("authorization"), d = l.user_id, c = l.token;
          t.befer = s.request("setPassword", {
            type: "POST",
            params: {
              token: c
            },
            resources: {
              user_id: d
            },
            data: {
              current_password: n,
              new_password: a
            },
            beforeSend: function() {
              r && r.addClass("disabled loading");
            },
            complete: function() {
              r && r.removeClass("disabled loading");
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
  }, c.addidentity = {
    options: {
      errors: {
        failed: "Password incorrect.",
        no_password: "Password incorrect.",
        no_external_id: "Set up this new identity."
      },
      backdrop: !1,
      events: {
        "click #password-eye": function(e) {
          var t = i(e.currentTarget), n = t.prev();
          n.prop("type", function(e, t) {
            return "password" === t ? "text" : "password";
          }), t.toggleClass("icon16-pass-hide icon16-pass-show");
        },
        "click .xbtn-forgotpwd": function(e) {
          var t = i(e.currentTarget), n = t.hasClass("disabled");
          return n ? (e.stopPropagation(), !1) : void 0;
        },
        "click .xbtn-startover": function() {
          this.$(".d1, d2, d3").addClass("hide"), this.$(".d0").removeClass("hide"), this.$("#identity").val("").focus();
        },
        "click .xbtn-add": function(e) {
          e.preventDefault();
          var t = this, a = t.registration_flag, r = t._identity;
          if (!r) return !1;
          var d = r.provider, c = r.external_username || "", u = o.get("user");
          if (n.find(u.identities, function(e) {
            return e.provider === d && e.external_username === c ? !0 : void 0;
          })) return t.destory(), void 0;
          if ("SIGN_IN" === a) {
            var h = i.trim(t.$("#password").val()), p = !1, f = "", m = s.request("signin", {
              type: "POST",
              data: {
                external_username: r.external_username,
                provider: r.provider,
                password: h,
                name: r.name || "",
                auto_signin: !1
              }
            }, function(e) {
              p = !0, f = e.token, t.$('[for="password"]').removeClass("label-error").find("span").text(""), 
              t.$("#name").nextAll(".xalert-info").addClass("hide");
            }, function(e) {
              var i = e.meta.errorType, n = e.meta.errorDetail;
              "no_password" === i || "failed" === i ? t.$('[for="password"]').addClass("label-error").find("span").text(n || t.options.errors[i]) : "no_external_id" === i && t.$("#name").nextAll(".xalert-info").removeClass("hide");
            });
            m.done(function() {
              if (p) {
                var e = o.get("authorization"), n = e.token, a = r.id;
                t.defer = s.request("mergeIdentities", {
                  type: "POST",
                  params: {
                    token: n
                  },
                  data: {
                    browsing_identity_token: f,
                    identity_ids: "[" + a + "]"
                  }
                }, function(e) {
                  var n = e.status[a];
                  if (n) {
                    var s, r, d = o.get("user"), c = d.identities;
                    c.push(n), o.set("user", d), s = l.compile(i("#jst-identity-item").html()), r = s(n), 
                    i(".identity-list").append(r), t && t.destory();
                  }
                });
              }
            }), t.defer = m;
          } else if ("SIGN_UP" === a) {
            var g = function(e, t, n) {
              var a = o.get("authorization"), r = a.token, d = s.request("addIdentity", {
                type: "POST",
                params: {
                  token: r
                },
                data: {
                  external_username: e,
                  provider: t
                }
              }, function(e) {
                var t = e.identity, a = o.get("user"), s = a.identities;
                s.push(t), o.set("user", a);
                var r = l.compile(i("#jst-identity-item").html()), d = r(e.identity);
                i(".identity-list").append(d), n && n.destory();
              }, function(a) {
                var s = a && a.meta;
                if (s && 401 === s.code && "authenticate_timeout" === s.errorType) {
                  n && n.destory();
                  var r = i('<div data-widget="dialog" data-dialog-type="authentication" data-destory="true" class="hide"></div>');
                  i("#app-tmp").append(r);
                  var o = i.Event("click.dialog.data-api");
                  o._data = {
                    callback: function() {
                      g(e, t);
                    }
                  }, r.trigger(o);
                }
              });
              n && (n.defer = d);
            };
            g(c, d, t);
          } else "AUTHENTICATE" === a && t.$('.oauth > a[data-oauth="' + r.provider + '"]').trigger("click");
        },
        "click .xbtn-verify": function(e) {
          function t(e, n, a) {
            var r = o.get("authorization"), d = r.token, c = s.request("addIdentity", {
              type: "POST",
              params: {
                token: d
              },
              data: {
                external_username: e,
                provider: n
              }
            }, function(e) {
              var t = e.identity, n = o.get("user"), s = n.identities;
              s.push(t), o.set("user", n);
              var r = l.compile(i("#jst-identity-item").html()), d = r(e.identity);
              i(".identity-list").append(d), a && a.$(".verify-before").addClass("hide"), a && a.$(".verify-after").removeClass("hide"), 
              a && a.$(".xbtn-verify").addClass("hide"), a && a.$(".xbtn-done").removeClass("hide");
            }, function(s) {
              a && (a.$(".verify-before").removeClass("hide"), a.$(".verify-after").addClass("hide"), 
              a.$(".xbtn-verify").removeClass("hide"), a.$(".xbtn-done").addClass("hide"));
              var r = s && s.meta;
              if (r && 401 === r.code && "authenticate_timeout" === r.errorType) {
                a && a.destory();
                var o = i('<div data-widget="dialog" data-dialog-type="authentication" data-destory="true" class="hide"></div>');
                i("#app-tmp").append(o);
                var l = i.Event("click.dialog.data-api");
                l._data = {
                  callback: function() {
                    t(e, n);
                  }
                }, o.trigger(l);
              }
            });
            a && (a.defer = c);
          }
          e.preventDefault();
          var a = this, r = a._identity, d = i(e.currentTarget);
          if (d.hasClass("xbtn-success")) return a.$(".verify-after").addClass("hide"), a.hide(), 
          !1;
          if (!r) return !1;
          var c = r.provider, u = r.external_username || "", h = o.get("user");
          return n.find(h.identities, function(e) {
            return e.provider === c && e.external_username === u ? !0 : void 0;
          }) ? (a.destory(), void 0) : (t(u, c, a), void 0);
        },
        "click .xbtn-done": function() {
          this.hide();
        },
        "click .oauth > a": function(e) {
          function t(e, n, a) {
            var r = o.get("authorization"), l = r.token, d = s.request("addIdentity", {
              type: "POST",
              params: {
                token: l
              },
              data: {
                refere: window.location.href,
                external_username: e,
                provider: n
              },
              beforeSend: function() {
                a.$(".modal-body").eq(0).css("opacity", 0), a.switchTab("d05"), a.$(".authentication").find("img").removeClass("hide"), 
                a.$(".authentication").find(".redirecting").removeClass("hide"), a.$(".authentication").find(".xalert-fail").addClass("hide");
              }
            }, function(e) {
              window.location.href = e.url, a && a.destory();
            }, function(s) {
              var r = s && s.meta;
              if (r && 401 === r.code && "authenticate_timeout" === r.errorType) {
                a && a.destory();
                var o = i('<div data-widget="dialog" data-dialog-type="authentication" data-destory="true" class="hide"></div>');
                i("#app-tmp").append(o);
                var l = i.Event("click.dialog.data-api");
                l._data = {
                  callback: function() {
                    t(e, n);
                  }
                }, o.trigger(l);
              }
            });
            a && (a.defer = d);
          }
          e.preventDefault();
          var n = "", a = i(e.currentTarget).data("oauth"), r = this;
          return r.$(".authentication").find(".oauth-provider").text(a), t(n, a, r), !1;
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
        body: '<div class="shadow title">Add Identity</div><div class="clearfix"><div class="pull-left authorize">Authenticate with:</div><div class="pull-left oauth"><a href="#" class="oauth-twitter" data-oauth="twitter">twitter</a><a href="#" class="oauth-facebook" data-oauth="facebook">facebook</a><a href="#" class="oauth-dropbox hide" data-oauth="dropbox">dropbox</a><a href="#" class="oauth-flickr hide" data-oauth="flickr">flickr</a><a href="#" class="oauth-instagram hide" data-oauth="instagram">instagram</a></div></div><div class="orspliter">or</div><form class="modal-form"><fieldset><legend>Use your online identity:</legend><div class="clearfix control-group"><label class="control-label" for="identity">Identity: <span class="xalert-message"></span></label><div class="pull-right user-identity hide"><div class="avatar"><img src="" alt="" width="40" height="40" /><i class="provider"></i></div></div><div class="controls"><input type="text" class="input-large identity" id="identity" autocomplete="off" data-widget="typeahead" data-typeahead-type="identity" placeholder="Enter your email or phone" /><i class="help-subject"></i><i class="help-inline small-loading hide"></i><div class="xalert xalert-error hide" style="margin-top: 5px;"></div><div class="xalert xalert-error authenticate hide" style="margin-top: 5px;"><span class="xalert-fail">Please directly authenticate identity above.</span><br />To enable password sign-in for this identity, set an <span class="x-sign">EXFE</span> password first in your profile page.</div></div></div><div class="control-group d d0"><label class="control-label" for="password">Password: <span></span></label><div class="controls"><input type="password" class="input-large" id="password" autocomplete="off" placeholder="Identity\'s EXFE password" /><i class="help-inline icon16-pass-hide pointer" id="password-eye"></i></div></div><div class="control-group phone-tip hide"><div class="xalert">Please include country code prefix, e.g.: +1 555 450 0303</div></div><div class="verify-before d d1 hide"><span class="xalert-fail">This identity requires verification before using.</span><br />Confirm sending verification to your mailbox?</div><div class="verify-after d2 hide">Verification sent, it should arrive in minutes. Please check your mailbox and follow the instruction.</div></fieldset></form>',
        footer: '<button class="xbtn-white xbtn-startover d d1 hide">Start Over</button><button class="xbtn-white xbtn-forgotpwd d d0 disabled" data-dialog-from="addidentity" data-widget="dialog" data-dialog-type="forgotpassword">Forgot Password...</button><button class="pull-right xbtn-blue xbtn-add d d0">Add</button><button class="pull-right xbtn-blue xbtn-verify d d1 hide">Verify</button><button class="pull-right xbtn-white xbtn-done d d2 hide">Done</button>',
        others: '<div class="authentication d d05 hide"><div class="modal-body"><div class="shadow title">Authentication</div><div class="content"><img class="hide" src="/static/img/loading.gif" width="32" height="32" /><p class="redirecting hide">Redirecting to <span class="oauth-provider"></span>…</p><p class="xalert-fail hide">Failed to connect with <span class="oauth-provider"></span> server.</p></div></div></div>'
      }
    },
    switchTab: function(e) {
      this.$(".d").not(".hide").addClass("hide").end().filter("." + e).removeClass("hide"), 
      this.switchTabType = e;
    },
    availability: !1,
    init: function() {
      var e = this;
      e.registration_flag = "", a.off("widget-dialog-identification-auto"), a.on("widget-dialog-identification-auto", function(t) {
        if (t) {
          t.identity && t.identity.avatar_filename ? (e._identity = t.identity, e.$(".user-identity").removeClass("hide").find("img").attr("src", t.identity.avatar_filename).next().attr("class", "provider icon16-identity-" + t.identity.provider)) : (e.$(".user-identity").addClass("hide"), 
          e._identity = null), "phone" === t.identity.provider && e.$(".phone-tip").toggleClass("hide", /\+/.test(e.$("#identity").val()));
          var i = t.registration_flag;
          e.registration_flag = i || "", "SIGN_IN" === i ? (e.$(".d1, .d2, .d3").addClass("hide"), 
          e.$(".d0").removeClass("hide"), e.$(".xbtn-forgotpwd").removeClass("disabled").data("source", [ e._identity ])) : "SIGN_UP" === i ? (e._identity = r.parseId(e.$("#identity").val()), 
          e.$(".d0, .d1, .d3").addClass("hide"), e.$(".xbtn-add").removeClass("hide")) : "AUTHENTICATE" === i ? (e._identity = r.parseId(e.$("#identity").val()), 
          e.$(".d1, .d2").addClass("hide"), e.$(".d0, .d3").removeClass("hide"), e.$('label[for="password"]').parent().addClass("hide")) : "VERIFY" === i && (e.$(".d0, .d2, .d3").addClass("hide"), 
          e.$(".d1").removeClass("hide")), e.$(".xbtn-success").removeClass("disabled");
        } else e.$(".xbtn-success").addClass("disabled"), e.$(".phone-tip").addClass("hide"), 
        e.$(".xbtn-forgotpwd").addClass("disabled").data("source", null);
      }), a.off("widget-dialog-identification-nothing"), a.on("widget-dialog-identification-nothing", function() {
        e.$(".control-group.d").removeClass("hide"), e.$(".phone-tip").addClass("hide");
      });
    }
  }, c.addIdentityAfterSignIn = {
    options: {
      events: {
        "click .xbtn-cancel": function() {
          this.destory();
        },
        "click .xbtn-add": function() {
          var e = this, t = o.get("authorization"), n = t.token, a = this._identity.external_username, r = this._identity.provider;
          s.request("addIdentity", {
            type: "POST",
            params: {
              token: n
            },
            data: {
              external_username: a,
              provider: r
            }
          }, function(t) {
            var i = t.identity, n = o.get("user"), a = n.identities;
            a.push(i), o.set("user", n), e.destory(), window.location.href = "/";
          }, function(t) {
            var n = t && t.meta;
            if (n && 401 === n.code && "authenticate_timeout" === n.errorType) {
              e.destory();
              var a = i('<div data-widget="dialog" data-dialog-type="authentication" data-destory="true" class="hide"></div>');
              i("#app-tmp").append(a), a.trigger("click.dialog.data-api");
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
        var t = i(e.currentTarget).data("source"), n = t.identity, a = o.get("user");
        this._identity = n, this.$(".context-user").find("img").attr("src", a.avatar_filename).parent().next().text(a.name), 
        this.$(".context-identity").find("img").attr("src", n.avatar_filename).next().addClass("icon16-identity-" + n.provider), 
        this.$(".identity").text(r.printExtUserName(n)), "email" !== n.provider && this.$(".xbtn-done").text("Authorize");
      }
    }
  }, c.mergeidentity = {
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
            for (var n = 0, a = t.length; a > n; ++n) i.push(t.eq(n).parents("li").data("identity-id"));
            return s.request("mergeIdentities", {
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
        var t = i(e.currentTarget).data("source"), n = t.merged_identity, a = t.browsing_token, s = t.mergeable_user, o = s.identities, l = '<li class="clearfix" data-identity-id="{{id}}"><label for="identity-{{i}}"><input class="pull-left" id="identity-{{i}}" name="identity-{{i}}" type="checkbox" /><div class="pull-left box identity">{{external_username}}</div><div class="pull-right avatar"><img width="40" height="40" alt="" src="{{avatar_filename}}" /><i class="provider icon16-identity-{{provider}}"></i></div></label></li>', d = this.$(".merge-list ul");
        this.$(".context-identity").find("img").attr("src", n.avatar_filename), this.$(".context-identity").find(".identity").text(r.printExtUserName(n)), 
        this.browsing_token = a;
        for (var c = 0, u = o.length; u > c; ++c) d.append(i(l.replace("{{id}}", o[c].id).replace(/\{\{i\}\}/g, c).replace("{{external_username}}", r.printExtUserName(o[c])).replace("{{avatar_filename}}", o[c].avatar_filename).replace("{{provider}}", o[c].provider)));
      }
    }
  }, c.verification_email = {
    options: {
      onHideAfter: function() {
        this.befer && (this.befer.abort(), this.befer = null), this.destory();
      },
      events: {
        "click .xbtn-verify": function(e) {
          var t = i(e.currentTarget);
          if (t.hasClass("disabled") || t.hasClass("success")) return t.hasClass("success") && this.hide(), 
          void 0;
          var n = this, a = t.data("identity_id"), r = o.get("authorization"), l = r.token;
          this.befer = s.request("verifyUserIdentity", {
            type: "POST",
            params: {
              token: l
            },
            data: {
              identity_id: a
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
        var t = i(e.currentTarget), a = t.data("identity-id") || t.parents("li").data("identity-id"), s = o.get("user"), r = n.filter(s.identities, function(e) {
          return e.id === a ? !0 : void 0;
        })[0];
        this.$(".xbtn-verify").data("identity_id", r.id), this.$(".identity").text(r.external_id), 
        this.$(".avatar").attr("src", r.avatar_filename);
      }
    }
  }, c.verification_oauth = {
    options: {
      events: {
        "click .xbtn-verify": function(e) {
          var t = i(e.currentTarget), n = this;
          if (t.hasClass("disabled") || t.hasClass("success")) return t.hasClass("success") && this.hide(), 
          void 0;
          var a = t.data("identity_id"), r = o.get("authorization"), l = r.token;
          return this.befer = s.request("verifyUserIdentity", {
            type: "POST",
            params: {
              token: l
            },
            data: {
              identity_id: a
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
        var t = i(e.currentTarget), a = t.parents("li").data("identity-id"), s = o.get("user"), l = n.find(s.identities, function(e) {
          return e.id === a ? !0 : void 0;
        });
        this.$(".xbtn-verify").data("identity_id", l.id), this.$(".identity").text(r.printExtUserName(l)), 
        this.$(".avatar").attr("src", l.avatar_filename), this.$("i.provider").addClass("icon16-identity-" + l.provider), 
        this.$(".xalert-" + l.provider).removeClass("hide");
      }
    }
  }, c.verification_phone = {
    options: {
      events: {},
      backdrop: !1,
      viewData: {
        cls: "mblack modal-ve",
        title: "Verification",
        body: '<div class="shadow title">Identity Verification</div><div>Identity to verify:</div>'
      }
    }
  }, c.setpassword = {
    options: {
      onHideAfter: function() {
        this.befer && this.befer.abort() && (this.befer = null), this.destory();
      },
      events: {
        "submit .modal-form": function() {
          return this.$(".xbtn-success").click(), !1;
        },
        "click .password-eye": function(e) {
          var t = i(e.currentTarget);
          t.prev().prop("type", function(e, t) {
            return "password" === t ? "text" : "password";
          }).focus(), t.toggleClass("icon16-pass-hide icon16-pass-show");
        },
        "click .xbtn-success": function(e) {
          var t = this, n = t.$("#stpwd").val(), r = t.srcNode;
          if (!n) return n || alert("Please set EXFE password."), void 0;
          e.preventDefault();
          var l = i(e.currentTarget), d = this._user, c = this._token, u = this.signed;
          if (this._setup) {
            var h = function(e, t, n, r, d, c) {
              var u = s.request("setPassword", {
                type: "POST",
                params: {
                  token: t
                },
                resources: {
                  user_id: n.id
                },
                data: {
                  new_password: r
                },
                beforeSend: function() {
                  l.addClass("disabled loading");
                },
                complete: function() {
                  l.removeClass("disabled loading");
                }
              }, function(e) {
                o.set("authorization", e), a.on("app:user:signin", e.token, e.user_id, !0), d && d.data("dialog", null).data("dialog-type", "changepassword").find("span").text("Change Password..."), 
                i(".set-up").remove(), c && c.hide();
              }, function(a) {
                c && c.hide();
                var s = a.meta;
                if (403 === s.code) {
                  var l = s.errorType;
                  "invalid_current_password" === l && alert("Invalid current password.");
                } else if (401 === s.code && "authenticate_timeout" === s.errorType && e) {
                  var d = i('<div data-widget="dialog" data-dialog-type="authentication" data-destory="true" class="hide"></div>');
                  i("#app-tmp").append(d);
                  var u = o.get("authorization");
                  t = u.token, d.trigger("click.dialog.data-api", {
                    callback: function() {
                      h(e, t, n, r);
                    }
                  });
                }
              });
              c && (c.befer = u);
            };
            h(u, c, d, n, r, t);
          } else {
            var p = function(e, t, n, a, r) {
              var l = s.request("resetPassword", {
                type: "POST",
                data: {
                  token: t,
                  name: n.name,
                  password: a
                }
              }, function(e) {
                o.set("authorization", e.authorization), r && r.hide(), window.location.href = "/";
              }, function(s) {
                r && r.hide();
                var l = s.meta;
                if (l && 401 === l.code && "authenticate_timeout" === l.errorType) {
                  var d = i('<div data-widget="dialog" data-dialog-type="authentication" data-destory="true" class="hide"></div>');
                  i("#app-tmp").append(d);
                  var c = o.get("authorization");
                  t = c.token, d.trigger("click.dialog.data-api", {
                    callback: function() {
                      p(e, t, n, a);
                    }
                  });
                }
              });
              r && (r.befer = l);
            };
            p(u, c, d, n, t);
          }
        }
      },
      backdrop: !1,
      viewData: {
        cls: "mblack modal-sp",
        title: "Set Password",
        body: '<div class="shadow title">Set Password</div><form class="modal-form"><fieldset><legend>Please set <span class="x-sign">EXFE</span> password of your account.<br />All your identities share the same password for sign-in and account management.</legend><div class="clearfix context-user"><div class="pull-left avatar"><img width="40" height="40" alt="" src="" /></div><div class="pull-left username"></div></div><div class="control-group"><label class="control-label" for="stpwd">Password:</label><div class="controls"><input class="input-large" id="stpwd" placeholder="Set EXFE password" type="password" autocomplete="off" /><i class="help-inline password-eye icon16-pass-hide pointer"></i></div></div></fieldset></form>',
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
  }, c.setup_email = {
    options: {
      onHideAfter: function() {
        this.destory();
      },
      events: {
        "blur #name": function(e) {
          var t = r.trim(i(e.currentTarget).val()), n = this.$('[for="name"]'), a = n.find("span");
          t ? r.utf8length(t) > 30 ? (a.text("Too long."), n.addClass("label-error")) : r.zh_CN.test(t) ? (n.addClass("label-error"), 
          a.text("Invalid character.")) : (n.removeClass("label-error"), a.text("")) : (n.addClass("label-error"), 
          a.text(""));
        },
        "blur #password": function(e) {
          var t = r.trim(i(e.currentTarget).val()), n = this.$('[for="password"]'), a = n.find("span");
          t ? (n.removeClass("label-error"), a.text("")) : (n.addClass("label-error"), a.text("Password incorrect."));
        },
        "click #password-eye": function(e) {
          var t = i(e.currentTarget), n = t.prev();
          n.prop("type", function(e, t) {
            return "password" === t ? "text" : "password";
          }), t.toggleClass("icon16-pass-hide icon16-pass-show");
        },
        "click .xbtn-success": function() {
          var e = this, t = "user" === this._tokenType, n = this._page, r = t ? "resetPassword" : "setupUserByInvitationToken", l = {};
          if (l.name = i.trim(this.$("#name").blur().val()), l.password = this.$("#password").blur().val(), 
          t ? l.token = this._originToken : l.invitation_token = this._originToken, !this.$('[for="name"]').hasClass("label-error") || !this.$('[for="password"]').hasClass("label-error")) {
            var d;
            s.request(r, {
              type: "POST",
              data: l
            }, function(t) {
              if ("resolve" === n) if (d = o.get("authorization")) {
                i("#app-user-menu").find(".set-up").remove();
                var s = i("#app-browsing-identity"), r = s.data("settings");
                r.setup = !1, r.originToken = t.authorization.token, s.data("settings", r).trigger("click.data-api");
              } else o.set("authorization", t.authorization), o.set("user", e._browsing_user), 
              window.location.href = "/"; else d = t.authorization, a.emit("app:user:signin:after", function() {
                window.location.href = "/";
              }), a.emit("app:user:signin", d.token, d.user_id);
              e.hide();
            });
          }
        }
      },
      backdrop: !1,
      viewData: {
        cls: "mblack modal-su",
        title: "Set Up Account",
        body: '<div class="shadow title">Welcome to <span class="x-sign">EXFE</span></div><form class="modal-form"><fieldset><legend>For easier further use, please set up account of your identity underneath. Otherwise, <span class="underline">sign in</span> your existing account to merge with this identity.</legend><div class="clearfix control-group"><div class="pull-right user-identity"><img class="avatar" src="" alt="" width="40" height="40" /><i class="provider"></i></div><div class="identity box"></div></div><div class="control-group"><label class="control-label" for="name">Display name: <span></span></label><div class="controls"><input type="text" class="input-large" id="name" autocomplete="off" placeholder="Your recognizable name" /></div></div><div class="control-group"><label class="control-label" for="password">Password: <span></span></label><div class="controls"><input type="password" class="input-large" id="password" autocomplete="off" placeholder="Set EXFE password" /><i class="help-inline icon16-pass-hide pointer" id="password-eye"></i></div></div></fieldset></form>',
        footer: '<button class="pull-right xbtn-blue xbtn-success">Done</button><a class="pull-right xbtn-discard" data-dismiss="dialog">Cancel</a>'
      },
      onShowBefore: function(e) {
        var t = i(e.currentTarget).data("source");
        if (t) {
          var n = t.identity;
          this._browsing_user = t.browsing_user, this._tokenType = t.tokenType, this._originToken = t.originToken, 
          this._forward = t.forward || "/", this._page = t.page, this.$("#name").val(t.user_name || ""), 
          this.$(".identity").text(r.printExtUserName(n)), this.$(".avatar").attr("src", n.avatar_filename).next().addClass("icon16-identity-" + n.provider), 
          this.$(".xbtn-siea").data("source", r.printExtUserName(n));
        }
      }
    }
  }, c.setup_twitter = {
    options: {
      onHideAfter: function() {
        this._oauth_ && (this._oauth_.abort(), this._oauth_ = null), this.destory();
      },
      events: {
        "click .authorize": function() {
          this._oauth_ = i.ajax({
            url: "/OAuth/Authenticate?provider=twitter",
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
        body: '<div class="shadow title">Welcome to <span class="x-sign">EXFE</span></div><form class="modal-form"><fieldset><legend>You’re browsing as identity underneath, please authorize through Twitter to set up your <span class="x-sign">EXFE</span> account.</legend><div class="clearfix control-group"><div class="pull-right user-identity"><img class="avatar" src="" alt="" width="40" height="40" /><i class="provider"></i></div><div class="box identity"></div></div><div class="clearfix"><button class="pull-right xbtn-blue authorize">Authorize</button><a class="pull-right underline pointer cancel" data-dismiss="dialog">Cancel</a></div></fieldset></form>',
        footer: ""
      },
      onShowBefore: function(e) {
        var t = i(e.currentTarget).data("source");
        if (t) {
          var n = t.identity;
          this._tokenType = t.tokenType, this._originToken = t.originToken, this.$(".identity").text(r.printExtUserName(n)), 
          this.$(".avatar").attr("src", n.avatar_filename).next().addClass("icon16-identity-" + n.provider), 
          this.$(".xbtn-siea").data("source", r.printExtUserName(n));
        }
      }
    }
  }, c.browsing_identity = {
    options: {
      onHideAfter: function() {
        this.destory();
      },
      events: {
        "click .xbtn-go": function() {
          window.location.href = "/";
        },
        "click .xbtn-merge": function() {
          var e = this, t = o.get("authorization"), a = t.token, r = this._token, l = this._identity, d = {
            browsing_identity_token: r,
            identity_ids: "[" + l.id + "]"
          };
          s.request("mergeIdentities", {
            type: "POST",
            params: {
              token: a
            },
            data: d
          }, function(t) {
            if (e.hide(), t.mergeable_user = null, t.mergeable_user) {
              var a = i('<div id="js-dialog-merge" data-destory="true" data-widget="dialog" data-dialog-type="mergeidentity">'), s = o.get("user");
              a.data("source", {
                merged_identity: n.find(s.identities, function(e) {
                  return e.id === l.id ? !0 : void 0;
                }),
                browsing_token: r,
                mergeable_user: t.mergeable_user
              }), a.appendTo(i("#app-tmp")), a.trigger("click.dialog.data-api"), i(".modal-mi").css("top", 230);
            } else window.location.href = "/";
          });
        }
      },
      backdrop: !1,
      viewData: {
        cls: "mblack modal-bi",
        title: "Browsing Identity",
        body: '<div class="shadow title">Browsing Identity</div><div class="user hide"><div>You’re currently signed in account underneath, you can continue with this account.</div><div class="clearfix context-user"><div class="pull-left avatar"><img width="40" height="40" alt="" src="" /></div><div class="pull-left username"></div></div><div class="clearfix"><button class="pull-right xbtn-white xbtn-go">Go</button><a class="pull-right xbtn-cancel" data-dismiss="dialog">Cancel</a></div><div class="spliterline"></div></div><div class="browsing-tips"><span class="tip-0 hide">Otherwise, you’re</span><span class="tip-1 hide">You’re</span> currently browsing this page as identity underneath, please choose an option to continue.</div><div class="context-identity"><div class="pull-right avatar"><img width="40" height="40" alt="" src="" /><i class="provider"></i></div><div class="clearfix"><div class="pull-left box identity"></div></div></div>',
        footer: '<button class="xbtn-white xbtn-sias hide" data-widget="dialog" data-dialog-type="identification" data-dialog-tab="d00">Sign In and Switch</button><button class="xbtn-white xbtn-sui hide" data-widget="dialog" data-dialog-type="setup_email">Set Up Identity</button>'
      },
      onShowBefore: function(e) {
        var t = i(e.currentTarget).data("settings");
        if (t) {
          var n = t.normal, a = t.browsing, s = t.setup, o = t.action;
          this._token = t.originToken, this._user = n, this._browsing_user = a, this._setup = s, 
          this._action = o, this._tokenType = t.tokenType, this._user ? (this.$(".user").removeClass("hide").find("img").attr("src", n.avatar_filename).parent().next().text(n.name || n.nickname), 
          this.$(".xbtn-merge").removeClass("hide"), this.$(".browsing-tips").find(".tip-0").removeClass("hide")) : (this.$(".xbtn-sias, .xbtn-sui").addClass("pull-right"), 
          this.$(".browsing-tips").find(".tip-1").removeClass("hide")), this.$("browsing-tips").find("span").eq(this._user ? 0 : 1).removeClass("hide");
          var l = a.identities[0];
          this._identity = l;
          var d = r.printExtUserName(l);
          this.$(".context-identity").find("img").attr("src", l.avatar_filename).next().addClass("icon16-identity-" + l.provider), 
          this.$(".context-identity").find(".identity").text(d), this._setup ? this.$(".xbtn-sui").removeClass("hide").attr("data-dialog-type", "setup_" + l.provider).data("source", {
            identity: l,
            originToken: t.originToken,
            tokenType: t.tokenType
          }) : this.$(".xbtn-sias").removeClass("hide").data("source", d);
        }
      }
    }
  }, c.read_only = {
    options: {
      onHideAfter: function() {
        this.destory();
      },
      backdrop: !1,
      viewData: {
        cls: "mblack modal-ro",
        title: "Read-only Browsing",
        body: '<div class="shadow title">Read-only Browsing</div><div>You’re browsing this page in read-only mode as <span></span> underneath. To change anything on this page, please <span class="underline">sign in</span> first.</div><div class="clearfix context-user hide"><div class="pull-left avatar"><img src="" alt="" width="40" height="40" /></div><div class="pull-left username"></div></div><div class="context-identity hide"><div class="pull-right avatar"><img src="" alt="" width="40" height="40" /><i class="provider"></i></div><div class="pull-left box identity"></div></div>',
        footer: '<button class="pull-right xbtn-blue" data-widget="dialog" data-dialog-type="identification" data-dialog-tab="d00">Sign In...</button><a class="pull-right xbtn-discard" data-dismiss="dialog">Cancel</a>'
      },
      onShowBefore: function(e) {
        var t = i(e.currentTarget).data("settings");
        if (t) {
          var n = t.isBrowsing, a = r.printExtUserName(t.identities[0]);
          if (this.$("legend span").eq(0).text(n ? "identity" : "user"), this.$(".xbtn-blue").data("source", a), 
          n) {
            var s = this.$(".context-identity").removeClass("hide");
            s.find(".identity").text(a), s.find(".avatar img").attr("src", t.identities[0].avatar_filename), 
            s.find(".provider").addClass("icon16-identity-" + t.identities[0].provider);
          } else {
            var o = this.$(".context-user").removeClass("hide");
            o.find(".username").text(t.name), o.find(".avatar img").attr("src", t.avatar_filename);
          }
        }
      }
    }
  }, c.revoked = {
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
  }, c.authentication = {
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
          var e = this, t = o.get("user"), i = t.identities[0], n = i.external_username, a = i.provider, l = r.trim(e.$("#password").val());
          s.request("signin", {
            type: "POST",
            data: {
              external_username: n,
              provider: a,
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
          var a = t._identity.provider, r = t._identity.external_username;
          t.befer = s.request("verifyIdentity", {
            type: "POST",
            data: {
              provider: a,
              external_username: r
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
          var a, s, l = i.identities;
          if (l && (a = l.length)) {
            if (s = l[0], s.eun = r.printExtUserName(s), a > 1) {
              t.$(".context-identity").addClass("switcher");
              for (var d = "", c = 0; a > c; c++) d += '<li data-index="' + c + '"><i class="pull-right icon16-identity-' + l[c].provider + '"></i>', 
              l[c].eun = r.printExtUserName(l[c]), d += "<span>" + l[c].eun + "</span>", d += "</li>";
              t.$(".dropdown-menu").html(d).data("identities", l);
            }
            t.updateIdentity(s);
          }
        }
      }
    }
  }, c.unsubscribe = {
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
  var u = d.extend({
    availability: !1,
    init: function() {
      var e = this;
      a.off("widget-dialog-identification-auto"), a.on("widget-dialog-identification-auto", function(t) {
        var i = e.$('[for="identity"]'), n = i.find("span"), a = e.$('[for="password"]'), s = a.find("span");
        e.availability = !1, e.identityFlag = null;
        var r;
        "d24" === e.switchTabType && (r = "d01"), e.$(".xalert-error").addClass("hide"), 
        e.$(".help-subject").removeClass("icon14-question").addClass("icon14-clear"), t ? (i.removeClass("label-error"), 
        n.text(""), t.identity && t.identity.avatar_filename ? (e._identity = t.identity, 
        e.$(".user-identity").removeClass("hide").find("img").attr("src", t.identity.avatar_filename).next().attr("class", "provider icon16-identity-" + t.identity.provider)) : (e._identity = null, 
        e.$(".user-identity").addClass("hide")), "phone" === t.identity.provider && e.$(".phone-tip").toggleClass("hide", /\+/.test(e.$("#identity").val())), 
        e.identityFlag = t.registration_flag, "SIGN_IN" === t.registration_flag ? (r = "d01", 
        e.$(".xbtn-forgotpwd").removeClass("hide"), a.removeClass("label-error"), s.text("")) : "SIGN_UP" === t.registration_flag ? (r = "d02", 
        a.removeClass("label-error"), s.text("")) : "AUTHENTICATE" === t.registration_flag ? (r = "d00", 
        e.$(".help-subject").removeClass("icon14-question").addClass("icon14-clear"), e.$(".authenticate").removeClass("hide")) : "VERIFY" === t.registration_flag && (r = "d04"), 
        e.availability = !0) : (e.$(".phone-tip").addClass("hide"), e.$(".help-subject").removeClass("icon14-clear").addClass("icon14-question")), 
        r && e.switchTabType !== r && e.switchTab(r), e.$(".x-signin")[(e.availability ? "remove" : "add") + "Class"]("disabled"), 
        e.$(".xbtn-forgotpwd").data("source", t ? [ t.identity ] : t);
      }), a.off("widget-dialog-identification-nothing"), a.on("widget-dialog-identification-nothing", function() {
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
      var t = r.trim(this.$("#identity").val()), i = r.parseId(t);
      return ("d01" === e || "d02" === e) && (i.password = this.$("#password").val()), 
      "d01" === e && (i.auto_signin = this.$("#auto-signin").prop("checked")), "d02" === e && (i.name = r.trim(this.$("#name").val())), 
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
  t.Identification = u;
}), define("datepanel", function(e) {
  "use strict";
  var t = e("jquery"), i = t.browser.msie, n = e("humantime"), a = n.locales[n.locale], s = a.months, r = a.monthsShort, o = n.createEFTime, l = n.toLocaleDate, d = n.lead0, c = e("util"), u = c.trim, h = e("api"), p = e("rex"), f = e("panel").extend({
    options: {
      template: '<div class="panel date-panel" tabindex="-1" data-widget="panel" id="date-panel" editarea="date-panel"><div class="panel-body"><div class="pull-left date-container"><div class="date-input"><input type="text" name="date-string" id="date-string" autocomplete="off" /><i class="pointer icon-enter-blue place-submit"></i></div><div class="date-calendar" tabindex="-1"><ul class="unstyled clearfix" id="date-head"><li>Sun</li><li>Mon</li><li>Tue</li><li>Wed</li><li>Thu</li><li>Fri</li><li>Sat</li></ul><div class="year"></div><div class="full-month"></div><div class="table-wrapper"><table class="table" id="date-table"><tbody></tbody></table></div></div></div><div class="pull-right date-timeline hide"> <div class="fuzzy-time hide">   <ul class="unstyled time-cates">     <li data-cate="all-day">All-day</li>     <li class="hide" data-time="00:01" data-cate="late-night">Late-night</li>     <li class="hide" data-time="05:00" data-cate="dawn">Dawn</li>     <li class="hide" data-time="07:00" data-cate="breakfast">Breakfast</li>     <li class="hide" data-time="08:30" data-cate="morning">Morning</li>     <li class="hide" data-time="10:00" data-cate="brunch">Brunch</li>     <li class="hide" data-time="11:30" data-cate="lunch">Lunch</li>     <li class="hide" data-time="13:00" data-cate="noon">Noon</li>     <li class="hide" data-time="14:30" data-cate="afternoon">Afternoon</li>     <li class="hide" data-time="16:00" data-cate="tea-break">Tea-break</li>     <li class="hide" data-time="17:30" data-cate="off-work">Off-work</li>     <li class="hide" data-time="19:00" data-cate="dinner">Dinner</li>     <li class="hide" data-time="20:30" data-cate="evening">Evening</li>     <li class="hide" data-time="22:00" data-cate="night">Night</li>     <li class="hide" data-time="24:00" data-cate="late-night">Late-night</li>   </ul> </div> <div class="times-wrapper">   <div class="times"></div> </div></div></div></div>',
      parentNode: null,
      srcNode: null,
      eftime: null
    },
    init: function() {
      var e = this.options;
      this.render(), this.originEftime = e.eftime, this.eftime = Cross.time, this.dateObj = l(this.eftime), 
      delete e.eftime, this.timezone = w(), this.dateInput = new m(this, "#date-string"), 
      this.calendarTable = new g(this, ".date-calendar"), this.timeline = new v(this, ".date-timeline"), 
      this.listen();
    },
    initComponents: function() {
      var e = this.eftime, t = this.dateObj.date;
      this.calendarTable.refresh(t), 0 === this.originEftime.outputformat && (this.calendarTable.addCursorStyle(), 
      this.calendarTable.select()), this.timeline.refresh(this.eftime), this.timeline.select(this.eftime), 
      this.dateInput.change(e.origin || t.text), this.dateInput.$element.focusend(), this.eftime.begin_at.time && this.showTL();
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
      e && (this.eftime.origin = e), t("body").trigger("click");
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
      var i, n = this.eftime, a = this.dateObj.date, s = "";
      n.begin_at.time = "", e && (i = e.split(":"), a.setHours(i[0] || 0), a.setMinutes(i[1] || 0), 
      a.setSeconds(i[2] || 0), n.begin_at.time = d(a.getUTCHours()) + ":" + d(a.getMinutes()) + ":" + d(a.getSeconds())), 
      n.begin_at.time_word = t, s = e || t, n.outputformat ? (n.outputformat = 0, n.origin = s) : (n.begin_at.date && (s = b(a) + " " + s), 
      n.origin = s), this.dateInput.change(n.origin);
    },
    rfCT: function(e) {
      var t = this.eftime, i = this.dateObj.date, n = "", a = e.split("-");
      if (i.setFullYear(a[0]), i.setMonth(a[1] - 1), i.setDate(a[2]), n = i.getUTCFullYear() + "-" + d(i.getUTCMonth() + 1) + "-" + d(i.getUTCDate()), 
      t.begin_at.date = n, t.outputformat) t.outputformat = 0, t.origin = e; else {
        var s = "";
        t.begin_at.time ? s = d(i.getHours()) + ":" + d(i.getMinutes()) : (s = t.begin_at.time_word, 
        t.begin_at.date = e), s = s ? e + " " + s : e, t.origin = s;
      }
      this.dateInput.change(t.origin);
    },
    showTL: function() {
      this.timeline.show(this.eftime);
    },
    keydown: function(e) {
      var t = this, i = e.altKey, n = e.ctrlKey, a = e.shiftKey, s = e.metaKey, r = e.keyCode;
      27 === r ? (t.revert(), t.emit("save")) : 13 === r && !(i | a) & (n | s) && t.emit && t.emit("save");
    },
    showAfter: function() {
      var e = this.srcNode;
      if (e) {
        var t = e.offset(), i = this.element, n = i.outerWidth(), a = e.outerHeight();
        i.css({
          left: t.left - n + 175 - 15,
          top: t.top + a + 7
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
        var n = this.$element.val(), a = n.length, s = this.$element[0], r = _(s);
        a === r && (e.preventDefault(), t.emit("tmt-ct"));
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
    this.today = new Date(), this.todayString = b(this.today), this.cx = 0, this.cy = 0, 
    this.vpr = 3, this.vph = 44, this.len = 0, this.divTmp = '<div class="tw"><span class="m hide">{{m}}</span><span class="d">{{d}}</span></div>', 
    this.$y = this.$element.find(".year"), this.$m = this.$element.find(".full-month"), 
    this.$tw = this.$element.find(".table-wrapper"), this.$tb = this.$tw.find("tbody"), 
    this.inited = !0, this.enable = !1, this.listen();
  };
  g.prototype = {
    init: function(e) {
      var t = this.vpr, i = this.vph, n = e.getFullYear(), a = e.getMonth(), s = e.getDate(), r = e.getDay();
      e = new Date(n, a, s - r - 21), this.startDate = b(e), this.genNext(e), this.genNext(e), 
      this.genNext(e), this.endDate = b(e), this.cx = r, this.cy = t, this.scrollTop(t * i), 
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
      var t = this.$tw, i = t.scrollTop(), n = !1, a = this.$y, s = this.$m;
      (0 === i || this.st === i) && (this.enable = !0, this[0 === i ? "mpageUp" : "mpageDown"](), 
      this.$tw.scrollTop(this.vph * this.vpr), n = !0), this.updateYearMonth(), a.toggleClass("hide", n), 
      s.toggleClass("hide", n);
    },
    updateYearMonth: function() {
      if (this.$cursor) {
        var e = x(this.$cursor.data("date"));
        this.$y.text(e.getFullYear()), this.$m.text(s[e.getMonth()]);
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
        e.preventDefault(), t.refresh(x(t.getSelectedDate()));
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
        var e = x(this.startDate, -21);
        this.startDate = b(e), this.genPrev(e), this.$trs = this.$tb.find("tr"), this.cy = 2, 
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
        var e = x(this.endDate, 0);
        this.genNext(e), this.endDate = b(e), this.$trs = this.$tb.find("tr"), this.cy = 7, 
        this.$tw.scrollTop(5 * this.vph);
      }
      var t = this.$tw.scrollTop();
      t = Math.round(t / this.vph) * this.vph, this.cy * this.vph > t + this.vph * (this.vpr - 1) && this.$tw.scrollTop(t += this.vph);
    },
    mpageUp: function() {
      this.delTail3();
      var e = x(this.startDate, -21);
      this.startDate = b(e), this.genPrev(e), this.$trs = this.$tb.find("tr");
    },
    mpageDown: function() {
      this.delHead3();
      var e = x(this.endDate, 0);
      this.genNext(e), this.$trs = this.$tb.find("tr"), this.endDate = b(e);
    },
    generateHTML: function(e) {
      var t, i = this.vpr, n = this.todayString, a = this.selectedDate, s = this.divTmp, o = "", l = 0;
      for (this.len += i; i > l; ++l) {
        for (var d, c, u, h, p = 0, f = "<tr>", m = ""; 7 > p; ++p) h = "", d = b(e), c = d === n, 
        u = d === a, c && (h = "today"), u && (h += (h.length ? " " : "") + "selected"), 
        m += '<td data-date="' + d + '"' + (h.length ? ' class="' + h + '"' : "") + ">", 
        t = e.getDate(), m += s.replace("{{m}}", r[e.getMonth()]).replace("{{d}}", c ? "Today" : t), 
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
        var t, i = l(e).date, n = i.getHours(), a = i.getMinutes(), s = 15 * Math.round(n / 15);
        i.setMinutes(s), this.selectedTime = d(n) + ":" + d(a), this.$selected = this.$tc.find('[data-time="' + this.selectedTime + '"]').eq(0), 
        0 === this.$selected.length && (this.$selected = this.createNormalItem(n, a, Math.floor(4 * (n + a / 60) * this.h))), 
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
      var t, i, n, a, s = 0, r = this.ts, o = new Date(2012, 12, 21, this.dh, this.dm);
      p.find(r, function(e, n) {
        return t = e.split(":"), i = new Date(2012, 12, 21, t[0], t[1]), i > o ? (s = n, 
        !0) : void 0;
      }), 0 === s && (s = 1), 24 === this.dh && (s = 14), --s, this.$ts.not(".hide").addClass("hide"), 
      this.$ts.eq(s).removeClass("hide"), this.dh >= 5 && 22 > this.dh && (this.$ts.eq(s - 1).removeClass("hide"), 
      this.$ts.eq(s + 1).removeClass("hide")), n = e - this.oy - this.th, a = this.$ts.not(".hide").length, 
      this.$ft.stop(!0, !0).animate({
        top: n - 18 * ((a + 1) / 2)
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
      var t = this.$cursor, i = t.attr("data-time"), n = i.split(":"), a = 0 === +n[0] % 3 && 0 === +n[1], s = this.$selected;
      if (t.addClass("hide"), s) {
        if (s.removeClass("selected"), i === s.attr("date-time")) return;
        s.hasClass("time-label") || (s.remove(), delete this.$selected);
      }
      a ? this.$selected = this.$tc.find('[data-time="' + i + '"]').eq(0) : (this.$selected = t.clone().removeClass("hide time-hover"), 
      t.before(this.$selected)), this.$selected.addClass("selected"), this.component.emit("rf-tl", this.selectedTime = this.$selected.data("time"), "");
    },
    hoverItem: function() {
      var e = Math.round(this.y / this.h) * this.h, t = e * this.a, i = +Math.floor(t / 60).toFixed(0), n = t % 60, a = d(i) + ":" + d(n);
      this.dh = i, this.dm = n, this.$cursor.css("top", e).attr("data-time", a).find("time").text((12 === i ? i : i % 12) + ":" + d(n) + " " + (12 > i ? "A" : "P") + "M");
    },
    createNormalItem: function(e, i, n) {
      var a = t(this.divTmp.replace("{{class}}", " time-hover").replace("{{dt}}", d(e) + ":" + d(i)).replace("{{t}}", e + ":" + d(i) + " " + (12 > e ? "A" : "P") + "M"));
      return a.css("top", n), this.$tc.append(a), a;
    },
    createLabelItem: function(e, i, n) {
      var a = t(this.divTmp.replace("{{class}}", " time-label").replace("{{dt}}", d(e) + ":" + d(i)).replace("{{t}}", (12 === e ? e : e % 12) + " " + (12 > e ? "A" : "P") + "M"));
      return a.css("top", n), this.$tc.append(a), a;
    },
    generateHTML: function() {
      for (var e = this.l, t = 0, i = 180, n = new Date(2012, 12, 21, 21, 0), a = 0, s = 0; e > t; ++t) n.setMinutes(n.getMinutes() + i), 
      a = n.getHours(), s = n.getMinutes(), 8 === t && (a = 24), this.createLabelItem(a, s, 60 * t);
      this.$cursor = this.createNormalItem(0, 0, 0).addClass("hide");
    }
  };
  var y = function(e, t) {
    return e ? function(i) {
      return e.call(t, i);
    } : void 0;
  }, b = function(e) {
    return e.getFullYear() + "-" + d(e.getMonth() + 1) + "-" + d(e.getDate());
  }, x = function(e, t) {
    return t || (t = 0), e = e.split("-"), new Date(e[0], +e[1] - 1, +e[2] + t);
  }, w = function() {
    var e = "" + new Date(), t = e.replace(/^(?:[\w\W]+([\+\-]\d\d):?(\d\d)[\w\W]+)$/, "$1:$2"), i = e.replace(/^(?:[\w\W]+\(([a-z]+)\)[\w\W]*)$/i, "$1");
    return ("UTC" === i || "GMT" === i) && (i = ""), t + (i ? " " + i : "");
  }, _ = function(e) {
    return i ? k(e) : e.selectionEnd;
  }, k = function(e) {
    var t = document.selection.createRange(), i = e.createTextRange(), n = i.duplicate();
    return i.moveToBookmark(t.getBookmark()), n.setEndPoint("EndToStart", i), n.text.length + t.text.length;
  };
  return f;
}), define("mappanel", function(e) {
  "use strict";
  var t = e("jquery"), i = t.proxy, n = t.extend, a = window._ENV_, s = a.MAP_KEY, r = a.location, o = a.site_url, l = e("humantime").lead0, d = e("rex"), c = /[\r\n]+/g, u = "\r", h = window.navigator.geolocation, p = t(window), f = t.browser.msie, m = !1, g = e("panel"), v = g.extend({
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
      delete t.place, this.placeInput = new y(this, "#place-text"), this.placesList = new b(this, ".places-list"), 
      this.xmap = new x(this, "#gmap"), this.listen(), this.$resize = e.find(".map-resize"), 
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
        Cross.place = e.place, t("body").click();
      }), this.element.on("keydown.mappanel", i(this.keydown, this)), this.element.on("click.mappanel", ".map-mask", function(t) {
        t.preventDefault(), e.emit("zoom-map", !1);
      }), this.element.on("click.mappanel", ".map-resize", function(i) {
        i.preventDefault();
        var n = t(this).hasClass("map-rc");
        e.emit("zoom-map", n);
      });
    },
    save: function() {
      this.$(".place-submit").trigger("click.mappanel");
    },
    keydown: function(e) {
      var t = this, i = e.altKey, n = e.ctrlKey, a = e.shiftKey, s = e.metaKey, r = e.keyCode;
      27 === r ? t.revert() : 13 === r && !(i | a) & (n | s) ? (t.emit("update-place", t.place), 
      t.save()) : 187 === r && n ? t.emit("zoom-map", 0) : 189 === r && n && t.emit("zoom-map", 1);
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
      var i = this.place, n = i.title, a = i.description, s = i.lat, r = i.lng, o = !e.title, l = this.placeInput, d = this.placesList, c = !1, u = this.xmap;
      i.updated_at = k(new Date()), o ? (i = this.resetPlace(i), d.clear(), u.clear()) : (i.title = e.title, 
      i.description = e.description, i.external_id = e.external_id || "", i.provider = e.provider || "", 
      "map" === t || "list" === t ? (i.lat = e.lat, i.lng = e.lng, l.change(_(e.title, e.description)), 
      c = !0) : "input" === t && (n === e.title || e.description || (d.clear(), u.textSearch(e.title)))), 
      (n !== e.title || a !== e.description || s !== e.lat || r !== e.lng || c) && this.emit("update-place", i);
    },
    revert: function() {
      this.emit("update-place", this.originPlace);
    },
    showPlace: function() {
      var e, t, i = this, n = this.placeInput, a = this.place, s = a.title, o = a.description, l = a.lat && a.lng;
      this.focus(), n.change(_(s, o)), n.$element.focusend(), l && (t = {
        coords: {
          latitude: a.lat,
          longitude: a.lng,
          title: a.title
        }
      });
      var d = function() {
        e = {
          coords: r
        }, l || (t = e), i.emit("geos", e, t, l);
      };
      this.isGeoSupported ? h.getCurrentPosition(function(n) {
        e = n, l || (t = e), i.emit("geos", e, t, l);
      }, d) : d();
    },
    showBefore: function() {
      this.element.attr("editarea", "map-panel");
    },
    showAfter: function() {
      var e = this, t = e.srcNode;
      if (t) {
        var i = t.offset(), n = e.element, a = n.outerWidth();
        n.css({
          left: this.oleft = i.left - a - 15,
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
      return w(e);
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
        var n = this.$element.val(), a = n.length, s = this.$element[0], r = C(s);
        a === r && (e.preventDefault(), t.emit("placeinput-tab"));
      }
    },
    keypress: function(e) {
      this.suppressKeyPressRepeat || this.keyHandler(e);
    },
    keydown: function(e) {
      this.suppressKeyPressRepeat = !!~d.indexOf([ 9, 40 ], e.keyCode), this.keyHandler(e);
    }
  };
  var b = function(e, t) {
    this.template = '<li class="place-item{{css-class}}" data-lat="{{lat}}" data-lng="{{lng}}" data-external-id="{{external_id}}"><address><div class="title">{{title}}</div><div class="description">{{address}}</div></address></li>', 
    this.component = e, this.$container = this.component.element, this.selector = t, 
    this.$element = e.$(t), this.$items = null, this.len = 0, this.curr = 0, this.viewportRows = 12, 
    this.viewportIndex = 0, this.scrollIndexs = [ 0, 11 ], this.scrollNum = 1, this.itemPX = 40, 
    this.listen();
  };
  b.prototype = {
    listen: function() {
      var e = this.$container, t = this.selector;
      e.on("blur.mappanel", t, i(this.blur, this)).on("keypress.mappanel", t, i(this.keypress, this)).on("keyup.mappanel", t, i(this.keyup, this)).on("keydown.mappanel", t, i(this.keydown, this)).on("focus.mappanel", t, i(this.focus, this)).on("click.mappanel", t + " > li", i(this.click, this)).on("mouseenter.mappanel", t + " > li", i(this.mouseenter, this));
    },
    update: function(e, t) {
      this.status = !!e.length || t, this.$element.empty(), this.curr = 0;
      var i, n = "", a = this.template;
      this.hasPlace = !1, this.status && (t && (n += a.replace("{{css-class}}", " place-marker").replace("{{title}}", t.title).replace("{{address}}", t.description).replace("{{lat}}", t.lat).replace("{{lng}}", t.lng).replace("{{external_id}}", t.external_id), 
      this.hasPlace = !0), d.each(e, function(e) {
        i = e.geometry.location, n += a.replace("{{css-class}}", "").replace("{{title}}", e.name).replace("{{address}}", e.formatted_address).replace("{{lat}}", i.lat()).replace("{{lng}}", i.lng()).replace("{{external_id}}", e.id);
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
      var t = this.scrollIndexs, i = this.viewportRows, n = this.len, a = this.scrollNum, s = this.itemPX, r = this.curr, o = this.viewportIndex += e;
      if (o === t[1] + 1 && r === n - 1) this.$element.scrollTop(0), this.viewportIndex = 0; else if (o === t[0] - 1 && 0 === r) this.$element.scrollTop((n - i) * s), 
      this.viewportIndex = 11; else if (o === t[0] - 1 && r > t[0] || n - (i - t[1]) > r && o === t[1] + 1) {
        var l = this.$element.scrollTop();
        this.$element.scrollTop(l += e * s * a), this.viewportIndex = t[(e + 1) / 2];
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
      var t = this, i = t.component, n = t.hasPlace, a = e.ctrlKey, s = e.keyCode;
      switch (s) {
       case 9:
        e.preventDefault(), i.emit("placeslist-tab");
        break;

       case 13:
       case 32:
        a || (e.preventDefault(), t.setPlace(), i.emit("enter-marker", t.curr, n));
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
      this.suppressKeyPressRepeat = !!~d.indexOf([ 9, 13, 32, 38, 40 ], e.keyCode), this.keyHandler(e);
    },
    click: function(e) {
      e.stopPropagation(), e.preventDefault(), this.curr = t(e.currentTarget).index(), 
      this.setPlace();
    }
  };
  var x = function(e, t) {
    this.component = e, this.selector = t, this.$element = e.$(t), this.$wrap = this.$element.parent(), 
    this.GMaps = null, this.sizeStatus = !0, this.zoom2 = 2, this.zoom12 = 12, this.zoom16 = 16, 
    this.zoomN = 16, this.a = .05, this.owidth = this.$element.width(), this.oheight = this.$element.height(), 
    this.cbid = 0, this.redMarkers = [], this.curr = 0;
  };
  x.prototype = {
    resize: function(e, t) {
      880 > e && (e = 880), 500 > t && (t = 500), this.$element.width(e).height(t);
    },
    initMap: function(e, t, i) {
      var n, a, s = this, r = this.component, o = r.place, l = t.coords, d = e.coords, c = i;
      l || (t.coords = l = {}), l.latitude || (l.latitude = "0"), l.longitude || (l.longitude = "0"), 
      this.isGo = !0, this.hasLocation = !!d, this.hasPlace = c;
      try {
        if (n = this.GMaps = window.google.maps, a = n.ControlPosition, this._center = new n.LatLng(l.latitude, l.longitude), 
        this._request = {
          radius: 5e4,
          location: this._center
        }, this.enableOptions = {
          zoomControl: !0,
          zoomControlOptions: {
            position: a.RIGHT_TOP
          },
          scaleControl: !0,
          scaleControlOptions: {
            position: a.BOTTOM_LEFT
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
          position: new n.LatLng(d.latitude, d.longitude),
          icon: this.sbicon,
          title: d.title || ""
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
            r.emit("change-place", this._place, "map");
          }), this.GMaps.event.addListener(u, "click", function() {
            s.clearMarkers(), r.emit("change-place", this._place, "map");
          }, !1), this.GMaps.event.addListener(u, "mouseover", function() {
            s.selectMarker(this), r.emit("enter-placeitem", 0);
          });
        }
        var h, p = new n.Geocoder(), f = function(e) {
          s._timer = setTimeout(function() {
            var t, i = r.placeInput.getPlace(), a = e.latLng;
            r.placesList.clear(), s.clearBlueMarker(), s.clearMarkers(), i.lat = "" + a.lat(), 
            i.lng = "" + a.lng(), t = s.createBlueMarker(n.Marker, {
              map: s._map,
              position: a,
              icon: s.bicon,
              draggable: !0,
              title: i.title || ""
            }, i), n.event.addListener(t, "dragend", function(e) {
              var t = e.latLng;
              this._place.lat = "" + t.lat(), this._place.lng = "" + t.lng(), this._place.provider = "", 
              r.emit("change-place", this._place, "map");
            }), n.event.trigger(t, "mouseover"), h = function(e, n) {
              s._timer && h.id === s.cbid && n === window.google.maps.GeocoderStatus.OK && e.length && (clearTimeout(s._timer), 
              s.hasPlace = !0, s.cbid = 0, i.title = "Right there on map", i.description = e[0].formatted_address, 
              i.provider = "", i.external_id = "", r.emit("change-place", t._place = i, "map"));
            }, h.id = ++s.cbid, p.geocode({
              latLng: new n.LatLng(i.lat, i.lng)
            }, h);
          }, 610);
        }, m = function() {
          clearTimeout(s._timer);
        };
        d && (n.event.addListener(this._userMarker, "mousedown", f), n.event.addListener(this._userMarker, "mouseup", f)), 
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
      var t, i, n = this, a = n.GMaps, s = n.isGo, r = n.component, o = n._service, l = n._request;
      s && (n.clearMarkers(), e && e !== l.query && (l.query = e, t = function(e, s) {
        t.id === n.cbid && s === a.places.PlacesServiceStatus.OK && (n.cbid = 0, i = n._placeMarker, 
        n.createMarkers(e), r.emit("search-completed", e, i ? i._place : null));
      }, t.id = ++n.cbid, o.textSearch(l, t)));
    },
    panToRight: function() {
      var e = this.GMaps, t = this._map, i = this._overlay, n = i.getProjection(), a = e.Point, s = n.fromLatLngToContainerPixel(t.getCenter()), r = n.fromContainerPixelToLatLng(new a(s.x - 100, s.y));
      t.setCenter(r);
    },
    showMarker: function(e, t) {
      var i, n;
      i = t && -1 === --e ? this._placeMarker : this.redMarkers[e], i && (this.selectMarker(i), 
      n = i.getPosition(), this._map.setCenter(n)), this.sizeStatus && (this._map.setZoom(this.zoomN = this.zoom16), 
      this.panToRight());
    },
    selectMarker: function(e) {
      var t = this.ricon, i = this.bicon, n = this.currMarker;
      n && (n.setZIndex(null), n.isBlue || n.setIcon(t)), e && (e.setZIndex(377), e.isBlue || e.setIcon(i), 
      this.currMarker = e);
    },
    createIcons: function() {
      var e = this.GMaps, t = o + "/static/img/icons.png", i = e.Size, n = e.Point, a = e.MarkerImage;
      this.bicon = new a(t, new i(26, 36), new n(0, 78)), this.ricon = new a(t, new i(26, 36), new n(26, 78)), 
      this.sbicon = new a(t, new i(12, 14), new n(52, 100));
    },
    saveMarker: function(e) {
      var t = this, i = t.hasPlace;
      if (!i || 0 !== e) {
        i && (this.clearBlueMarker(), e -= 1);
        var n = this.component, a = this.GMaps.event, s = this._placeMarker = this.redMarkers.splice(e, 1)[0];
        this.hasPlace = !0, this.selectMarker(s), this.defaultOptions.zoom = this.zoomN = this.zoom16, 
        a.clearListeners(s), s.isBlue = !0, s.setDraggable(!0), a.addListener(s, "click", function() {
          t.clearMarkers(), n.emit("change-place", this._place, "map");
        }, !1), a.addListener(s, "dragend", function(e) {
          var t = e.latLng;
          this._place.lat = "" + t.lat(), this._place.lng = "" + t.lng(), this._place.provider = "", 
          n.emit("change-place", this._place, "map");
        }), a.addListener(s, "mouseover", function() {
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
      e.setMap(null), e = null;
    },
    clearMarkers: function() {
      var e, t = this.redMarkers, i = this.removeMarker;
      if (t) {
        for (;e = t.shift(); ) i(e);
        this.curr = 0;
      }
    },
    createMarkers: function(e, t) {
      for (var i, n, a, s = this, r = !t, o = this.component, l = this.createMarker, d = this.GMaps, c = d.event, u = d.LatLng, h = d.Marker, p = new d.LatLngBounds(), f = this.redMarkers, m = this._map, g = this.ricon, v = 0, y = function() {
        var e = s.indexOf(s.redMarkers, this);
        o.placesList.clear(), o.emit("clear-marker", e), o.emit("click-placeitem", this._place);
      }, b = function() {
        var e = s.indexOf(s.redMarkers, this);
        s.selectMarker(this), o.emit("enter-placeitem", e += s._placeMarker ? 1 : 0);
      }; i = e[v]; ++v) a = i.lat ? new u(i.lat, i.lng) : i.geometry.location, n = l(h, {
        map: m,
        icon: g,
        title: i.name,
        position: a,
        zIndex: 0
      }, {
        title: i.title || i.name,
        description: i.description || i.formatted_address,
        lat: "" + a.lat(),
        lng: "" + a.lng(),
        external_id: i.id || "",
        provider: "google"
      }), c.addListener(n, "click", y, !1), c.addListener(n, "mouseover", b), f.push(n), 
      r && p.extend(a);
      r && m.fitBounds(p);
    },
    createMarker: function(e, t, i, n) {
      return n = new e(t), n._place = i, n;
    },
    zoom: function(e) {
      if (this.isGo) {
        this.sizeStatus = e;
        var t = this, i = t.component, n = i.element, a = t.GMaps, s = t._map, r = t.redMarkers;
        if (this.$wrap.toggleClass("gmap-big", !e), i.$resize.toggleClass("map-rc"), i.$mask.toggleClass("hide", !e), 
        e) n.css({
          top: i.otop,
          left: i.oleft
        }), t.$element.width(t.owidth).height(t.oheight), setTimeout(function() {
          s.setOptions(t.defaultOptions), s.setCenter(t._placeMarker ? t._placeMarker.getPosition() : t._userMarker.getPosition()), 
          t.hasPlace && t.panToRight();
        }, 0); else {
          var o = p.width(), l = p.height(), d = t.a, c = p.scrollTop(), u = p.scrollLeft();
          t.resize(o * (1 - 2 * d), l * (1 - d) - 56), n.css({
            top: 56 + c,
            left: o * d + u
          }), setTimeout(function() {
            s.setOptions(t.enableOptions);
          }, 0);
        }
        a.event.trigger(s, "resize"), !t._placeMarker && r.length && (t._placeMarker = r[0]), 
        s.setCenter(t._placeMarker ? t._placeMarker.getPosition() : t._userMarker.getPosition()), 
        i.placeInput.$element.focusend();
      }
    },
    indexOf: function(e, t) {
      return d.indexOf(e, t);
    }
  };
  var w = function(e) {
    var i = e.split(c), n = i.length ? t.trim(i.shift()) : "", a = t.trim(i.join(u)).replace(c, "");
    return {
      title: n,
      description: a
    };
  }, _ = function(e, t) {
    return e + (t ? u + t.replace(c, u) : "");
  }, k = function(e) {
    return e.getUTCFullYear() + "-" + l(e.getUTCMonth() + 1) + "-" + l(e.getUTCDate()) + " " + l(e.getUTCHours()) + ":" + l(e.getUTCMinutes()) + ":" + l(e.getUTCSeconds()) + " +0000";
  }, C = function(e) {
    return f ? E(e) : e.selectionEnd;
  }, E = function(e) {
    var t = document.selection.createRange(), i = e.createTextRange(), n = i.duplicate();
    return i.moveToBookmark(t.getBookmark()), n.setEndPoint("EndToStart", i), n.text.length + t.text.length;
  }, T = function(e) {
    if (!window.google || !window.google.maps) {
      window._loadMaps = function() {}, t('[src^="https://www.google.com"]').remove();
      var i = document.getElementsByTagName("body")[0], n = document.createElement("script");
      window._gmap = function() {
        delete window._gmap;
      }, window._loadMaps = function() {
        window.google.load("maps", "3", {
          other_params: "key=" + s + "&sensor=false&libraries=places",
          callback: function() {
            e();
          }
        });
      }, n.async = "async", n.src = "https://www.google.com/jsapi?callback=_loadMaps", 
      i.appendChild(n);
    }
  };
  return v;
}), define(function(e) {
  "use strict";
  function t(e) {
    return e.stopPropagation(), e.preventDefault(), !1;
  }
  function i() {
    a(h).removeClass("open");
  }
  function n(e) {
    var t = a(this), i = t.data("timer"), n = t.data("clicked"), s = t.find("div.user-panel").addClass("show"), r = -s.outerHeight();
    return e.preventDefault(), "mouseleave" !== e.type || n ? n ? (t.data("clicked", !1), 
    void 0) : i ? (clearTimeout(i), t.data("timer", i = null), !1) : (p || (s.css("top", r), 
    t.find(".user-panel").addClass("show"), p = !0), t.prev().removeClass("hide"), t.parent().addClass("user"), 
    s.stop().animate({
      top: 56
    }, 100), void 0) : (i = setTimeout(function() {
      p = !1, s.stop().animate({
        top: r
      }, 200, function() {
        t.prev().addClass("hide"), t.parent().removeClass("user");
      }), clearTimeout(i), t.data("timer", i = null);
    }, 500), t.data("timer", i), !1);
  }
  var a = e("jquery"), s = e("bus"), r = e("store"), o = e("dialog"), l = e("xdialog").dialogs, d = e("xdialog").Identification, c = e("xidentity"), u = a(document.body);
  u.on("drop", t).on("dragover", t);
  var h = '[data-toggle="dropdown"]';
  u.on("click.dropdown.data-api", i);
  var p = !1;
  u.on("mouseenter.dropdown mouseleave.dropdown", "#app-user-menu .dropdown-wrapper", n), 
  u.on("click.usermenu", '#app-user-menu .dropdown-wrapper a[href^="/#"]', function() {
    var e = a("#app-user-menu .dropdown-wrapper"), t = e.find("div.user-panel").addClass("show"), i = -t.outerHeight();
    t.css("top", i), e.prev().addClass("hide").end().parent().removeClass("user"), e.data("clicked", !0);
  }), u.on("click.usermenu", "#app-signout", function() {
    s.emit("xapp:cross:end"), a(".navbar .dropdown-wrapper").find(".user-panel").remove(), 
    a("#app-signin").show().next().hide().removeClass("user").find(".fill-left").addClass("hide").end().find("#user-name span").text(""), 
    r.remove("cats"), r.remove("user"), r.remove("authorization"), window.location.href = "/";
  }), u.on("click.data-link dblclick.data-link", "[data-link]", function(e) {
    var t = a(this).data("link"), i = a(this).data("event-ignore");
    if (e.type !== i) {
      var n = a("#app-browsing-identity"), s = n.data("read-only"), r = n.data("settings"), o = a("#app-read-only"), l = n.data("token-type");
      if (n.size() && s && "nota" === t) return e.stopImmediatePropagation(), e.stopPropagation(), 
      e.preventDefault(), o.size() || a("#app-main").append(o = a('<div id="app-read-only" data-widget="dialog" data-dialog-type="read_only"></div>').data("settings", r.browsing)), 
      o.trigger("click"), !1;
      if (n.size() && ("" === t || "nota" === t && "user" === l)) return e.stopImmediatePropagation(), 
      e.stopPropagation(), e.preventDefault(), n.trigger("click"), !1;
    }
  });
  var f = 2;
  s.on("app:cross:edited", function(e) {
    if (0 !== f) {
      f--;
      var t = a("#app-browsing-identity"), i = t.data("settings"), n = a("#app-read-only"), s = t.data("action");
      e ? e && "no_permission" === e.error && (n.size() || a("#app-main").append(n = a('<div id="app-read-only" data-widget="dialog" data-dialog-type="read_only"></div>').data("settings", i && i.browsing || r.get("user"))), 
      n.trigger("click")) : "setup" === s && a('[data-user-action="' + s + '"]').trigger("click");
    }
  }), u.on("click.dialog.data-api", '[data-widget="dialog"]', function(e) {
    var t, i = a(this), n = i.data("dialog"), s = i.data("dialog-type"), r = i.data("dialog-tab"), c = i.data("dialog-from"), h = i.data("dialog-settings");
    e.preventDefault(), n || s && (t = l[s], h && (t = a.extend(!0, {}, t, h)), n = new ("identification" === s ? d : o)(t), 
    n.options.srcNode = i, c && (n.dialog_from = c), n.render(), i.data("dialog", n), 
    u.find('[data-dialog-type="' + s + '"]').not(i).data("dialog", n)), r && n.switchTab(r), 
    n.show(e);
  });
  var m = r.get("identities");
  m || (m = []), u.on("focus.typeahead.data-api", '[data-typeahead-type="identity"]', function(e) {
    var t = a(this);
    t.data("typeahead") || (e.preventDefault(), t.data("typeahead", new c({
      options: {
        source: m,
        useCache: !0,
        target: t,
        onNothing: function() {
          this.target.parent().removeClass("identity-avatar"), s.emit("widget-dialog-identification-nothing");
        },
        "onAutocomplete:finish": function(e) {
          var t;
          e && (t = e.identity) ? this.target.prev().attr("src", t.avatar_filename).parent().addClass("identity-avatar") : this.target.parent().removeClass("identity-avatar"), 
          s.emit("widget-dialog-identification-auto", e);
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
  var n = e("class"), a = e("emitter"), s = window, r = n.create(a, {
    initialize: function(e) {
      var i = null;
      i = r.isValidFile(e) ? e : r.isValidFile(e.file) ? e.file : !1, i && r.canUpload() && (this._file = i, 
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
          var n = t.upload, a = this._boundEventHandler;
          n.removeEventListener("progress", a), n.removeEventListener("crror", a), n.removeEventListener("abort", a), 
          t.removeEventListener("load", a), t.removeEventListener("error", a), t.removeEventListener("readystatechange", a), 
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
      var a, s = new FormData(), r = n, o = this._xhr, l = o.upload, d = this._boundEventHandler;
      for (a in t) s.append(a, t[a]);
      if (r && s.append(r, this._file), o.addEventListener("loadstart", d, !1), o.addEventListener("load", d, !1), 
      o.addEventListener("error", d, !1), o.addEventListener("abort", d, !1), o.addEventListener("loadend", d, !1), 
      o.addEventListener("readystatechange", d, !1), l.addEventListener("progress", d, !1), 
      l.addEventListener("error", d, !1), l.addEventListener("abort", d, !1), o.open("POST", e, !0), 
      o.withCredentials = !0, this._xhrHeaders) for (a in this._xhrHeaders) o.setRequestHeader(a, this._xhrHeaders[a]);
      o.send(s), this.emit("uploadstart", {
        xhr: o
      });
    },
    cancelUpload: function() {
      this._xhr.abort();
    }
  });
  r.isValidFile = function(e) {
    return s && s.File && e instanceof s.File;
  }, r.canUpload = function() {
    return s && s.FormData && s.XMLHttpRequest;
  };
  var o = 0;
  return r;
}), define("phonepanel", function(e) {
  "use strict";
  var t = e("jquery"), i = e("api"), n = "", a = 0, s = "", r = "", o = e("countrycodes"), l = e("panel"), d = function(e, i) {
    o[e] !== void 0 && (a = e, i || t("#phone-panel .countrycode").val("+" + o[a].country_code), 
    t(".tips-area .ta-countrycode").html(o[a].short_name), c(), u());
  }, c = function() {
    o[a].format_long && o[a].format_reg && o[a].format_str && n.length === o[a].format_long ? t("#phone-panel .phonenumber").val(n.replace(o[a].format_reg, o[a].format_str)) : t("#phone-panel .phonenumber").val(n);
  }, u = function() {
    p(), t("#phone-panel .countrycode").val() && t("#phone-panel .name").val() && n ? t("#phone-panel .add").prop("disabled", !1) : t("#phone-panel .add").prop("disabled", !0);
  }, h = function(e, t) {
    return e.replace(t ? /&/g : /&(?!#?\w+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }, p = function() {
    var e = "+" + o[a].country_code + n;
    e !== s && (i.request("getIdentity", {
      type: "POST",
      data: {
        identities: JSON.stringify([ {
          provider: "phone",
          external_username: e
        } ])
      }
    }, function(e) {
      e && e.identities && e.identities.length && e.identities[0].connected_user_id > 0 ? (r = e.identities[0].avatar_filename, 
      t("#phone-panel .identity-avatar").attr("src", r).show(), t("#phone-panel .identity-name").html(h(e.identities[0].name)).show(), 
      t("#phone-panel .name").val(e.identities[0].name).hide(), t("#phone-panel .add").toggleClass("match", !0)) : (r = "", 
      t("#phone-panel .identity-avatar").hide(), t("#phone-panel .identity-name").hide(), 
      t("#phone-panel .name").val("").show(), t("#phone-panel .add").toggleClass("match", !1));
    }), s = e);
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
      "US" === o[n].short_name && (a = n);
      this.listen(), t(document.body).on("click.phonepanel", function(e) {
        var n = t("#phone-panel");
        return n.length && n[0] !== e.target && !t.contains(n[0], e.target) ? (i.hide(), 
        t(document.body).off("click.phonepanel"), void 0) : void 0;
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
          var a = t(".complete-list li.selected"), s = ~~a.attr("country-code");
          return d(s), i.find(".tips-area").show(), i.find(".complete-list").slideUp(), void 0;
        }
        var r = "", l = -1, c = t(this).val().toLowerCase();
        if (c) if (/^\+[0-9]*/.test(c)) for (var u = 0; o.length > u; u++) "+" + o[u].country_code === c ? (r = n(u) + r, 
        l = u) : -1 !== ("+" + o[u].search_index).indexOf(c) && (r += n(u), l = -1 === l ? u : l); else for (u = 0; o.length > u; u++) o[u].country_code === c ? (r = n(u) + r, 
        l = u) : -1 !== o[u].search_index.indexOf(c) && (r += n(u), l = -1 === l ? u : l);
        i.find(".complete-list").html(r), r ? (i.find(".tips-area").hide(), i.find(".complete-list").slideDown(), 
        i.find(".complete-list li").eq(0).toggleClass("selected", !0), d(l, !0)) : (i.find(".tips-area").show(), 
        i.find(".complete-list").slideUp());
      }), i.on("keydown.phonepanel", ".countrycode", function(e) {
        if (i.find(".complete-list").html()) {
          var t = i.find(".complete-list li.selected"), n = i.find(".complete-list"), a = ~~t.index(), s = 44, r = 3 * s, o = i.find(".complete-list li").length - 1, l = n.scrollTop();
          switch (e.keyCode) {
           case 38:
            event.preventDefault(), 0 > --a && (a = o);
            break;

           case 40:
            event.preventDefault(), ++a > o && (a = 0);
          }
          t.toggleClass("selected", !1), i.find(".complete-list li").eq(a).toggleClass("selected", !0);
          var d = a * s, c = d - l;
          0 > c ? n.scrollTop(d) : c + s > r && n.scrollTop(d + s - r + 1);
        }
      }), i.on("blur.phonepanel", ".countrycode", function() {
        d(a);
      }), i.on("focus.phonepanel", ".countrycode", function() {
        t(this).css("z-index", "1"), i.find(".phonenumber").css("z-index", "0");
      }), i.on("focus.phonepanel", ".phonenumber", function() {
        i.find(".phonenumber").val(n), i.find(".complete-list").html(""), i.find(".tips-area").show(), 
        i.find(".complete-list").slideUp(), t(this).prop("tabindex", "1"), t(this).css("z-index", "1"), 
        i.find(".countrycode").css("z-index", "0");
      }), i.on("blur.phonepanel", ".phonenumber", function() {
        var e = i.find(".phonenumber").val().replace(/\-|\(|\)|\ /g, "");
        n = /^[0-9]*$/.test(e) ? e : "", c(), u(), t(this).prop("tabindex", "5");
      }), i.on("mouseover.phonepanel", ".complete-list li", function() {
        t(this).siblings().filter(".selected").toggleClass("selected", !1), t(this).toggleClass("selected", !0);
      }), i.on("click.phonepanel", ".complete-list li", function() {
        var e = t(this), n = ~~e.attr("country-code");
        d(n), i.find(".tips-area").show(), i.find(".complete-list").slideUp();
      }), i.on("keyup.phonepanel", ".name", function() {
        i.find(".complete-list").html(""), i.find(".tips-area").show(), i.find(".complete-list").slideUp();
      }), i.on("keyup.phonepanel", ".name", function(s) {
        if (t(this).val() && 13 === s.keyCode) {
          var l = "+" + o[a].country_code + n, d = i.find(".name").val();
          e.add({
            provider: "phone",
            external_id: l,
            external_username: l,
            name: d,
            avatar_filename: r ? r : ExfeeWidget.api_url + "/avatar/default?name=" + d
          }), e.hide();
        }
        u();
      }), i.on("click.phonepanel", ".add", function() {
        var t = "+" + o[a].country_code + n, s = i.find(".name").val();
        e.add({
          provider: "phone",
          external_id: t,
          external_username: t,
          name: s,
          avatar_filename: r ? r : ExfeeWidget.api_url + "/avatar/default?name=" + s
        }), e.hide();
      });
    },
    save: function() {
      this.$(".place-submit").trigger("click.mappanel");
    },
    showAfter: function() {
      var e = this, i = e.srcNode;
      if (i) {
        var s = i.offset(), r = e.element, l = i.outerHeight();
        r.css({
          left: this.oleft = s.left,
          top: this.otop = s.top + l
        }), t("#phone-panel .identity-avatar").hide(), t("#phone-panel .identity-name").hide(), 
        n = i.val().replace(/\-|\(|\)|\ /g, "");
        var c = a;
        if (/^\+.*$/.test(n)) for (var u = 0; o.length > u; u++) if (o[u].regular.test(n)) {
          n = n.replace(o[u].regular, ""), c = u;
          break;
        }
        d(c), r.find(".name").focus();
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
    for (var i = e.split(",")[0].split(":")[1].split(";")[0], n = new ArrayBuffer(t.length), a = new Uint8Array(n), s = 0, r = t.length; r > s; ++s) a[s] = t.charCodeAt(s);
    var o, l = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
    if (l) {
      var d = new l();
      d.append(n), o = d.getBlob(i);
    } else o = new Blob([ n ], {
      type: i
    });
    return o;
  }
  function a(e, t) {
    if (e.mozGetAsFile) return e.mozGetAsFile(t, "image/png");
    var i = e.toDataURL("image/png"), a = n(i);
    return a;
  }
  function s(e, t) {
    var i = a(e, t);
    return i;
  }
  function r(e) {
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
  function d(e, t, i, n, a) {
    this.canvas = e, e.width = t.width, e.height = t.height, e.style.display = "none", 
    this.ctx = e.getContext("2d"), this.ctx.drawImage(t, 0, 0), this.img = t, this.ocan = i, 
    this.src = this.ctx.getImageData(0, 0, t.width, t.height), this.dest = {
      width: n,
      height: Math.round(t.height * n / t.width)
    }, this.dest.data = Array(3 * this.dest.width * this.dest.height), this.lanczos = l(a), 
    this.ratio = t.width / n, this.rcp_ratio = 2 / this.ratio, this.range2 = Math.ceil(this.ratio * a / 2), 
    this.cacheLanc = {}, this.center = {}, this.icenter = {};
    var s = this;
    setTimeout(function() {
      s.process1(s, 0);
    }, 0);
  }
  function c() {
    h(document).off("mousemove.photozone").off("mouseup.photozone");
  }
  function u(e) {
    h(document).on("mousemove.photozone", function(t) {
      function i(e) {
        0 === b ? (d.scaleY = y + e, 0 > d.scaleY && (d.scaleY = w / g.height), d.y -= d.scaleY * g.height - d.height) : 1 === b ? (d.scaleX = v + e, 
        0 > d.scaleX && (d.scaleX = w / g.width), d.x -= d.scaleX * g.width - d.width) : 2 === b ? (d.scaleY = y + e, 
        0 > d.scaleY && (d.scaleY = w / g.height)) : (d.scaleX = v + e, 0 > d.scaleX && (d.scaleX = w / g.width));
      }
      function n(e) {
        0 === b ? (d.scaleX = v + e, 0 > d.scaleX && (d.scaleX = w / g.width), d.x -= d.scaleX * g.width - d.width) : 1 === b ? (d.scaleY = y + e, 
        0 > d.scaleY && (d.scaleY = w / g.height)) : 2 === b ? (d.scaleX = v + e, 0 > d.scaleX && (d.scaleX = w / g.width)) : (d.scaleY = y + e, 
        0 > d.scaleY && (d.scaleY = w / g.height), d.y -= d.scaleY * g.height - d.height);
      }
      function a(e) {
        0 === b ? (d.scaleX = v + e, 0 > d.scaleX && (d.scaleX = w / g.width)) : 1 === b ? (d.scaleY = y + e, 
        0 > d.scaleY && (d.scaleY = w / g.height), d.y -= d.scaleY * g.height - d.height) : 2 === b ? (d.scaleX = v + e, 
        0 > d.scaleX && (d.scaleX = w / g.width), d.x -= d.scaleX * g.width - d.width) : (d.scaleY = y + e, 
        0 > d.scaleY && (d.scaleY = w / g.height));
      }
      function s(e) {
        0 === b ? (d.scaleY = y + e, 0 > d.scaleY && (d.scaleY = w / g.height)) : 1 === b ? (d.scaleX = v + e, 
        0 > d.scaleY && (d.scaleY = w / g.height)) : 2 === b ? (d.scaleY = y + e, 0 > d.scaleY && (d.scaleY = w / g.height), 
        d.y -= d.scaleY * g.height - d.height) : (d.scaleX = v + e, 0 > d.scaleX && (d.scaleX = w / g.width), 
        d.x -= d.scaleX * g.width - d.width);
      }
      t.preventDefault();
      var r = e;
      if (r && r.dragging) {
        var o = t.pageX - r.offset[0], l = t.pageY - r.offset[1], d = r.bitmap;
        switch (r.ri) {
         case 0:
          d.x += o, d.y += l;
          break;

         case 1:
          d.x += l, d.y -= o;
          break;

         case 2:
          d.x -= o, d.y -= l;
          break;

         case 3:
          d.x -= l, d.y += o;
        }
        return r.offset[0] = t.pageX, r.offset[1] = t.pageY, r.stage.update(), r.bitmap80.updateImage(r.stage.canvas), 
        r.stage80.update(), !1;
      }
      if (r && r.resizing) {
        var c, u, h, p, o = t.pageX - r.aoffset[0], l = t.pageY - r.aoffset[1], f = r.stage.canvas.width, m = r.stage.canvas.height, d = r.bitmap, g = d.originalImage, v = r.psx, y = r.psy, b = r.ri, x = r.aoffset, w = r.sss, _ = r._canvasOffset;
        if (o || l) {
          switch (r.anchor) {
           case 0:
            var k = Math.sqrt(Math.pow(t.pageX - f - _.left, 2) + Math.pow(t.pageY - _.top - m, 2)), C = Math.sqrt(Math.pow(f, 2) + Math.pow(m, 2));
            k -= r.dr, i(k / C * w), n(k / C * w);
            break;

           case 1:
            u = x[1] - t.pageY, p = u / m, i(p * w), n(p * w);
            break;

           case 2:
            var k = Math.sqrt(Math.pow(t.pageX - _.left, 2) + Math.pow(t.pageY - _.top - m, 2)), C = Math.sqrt(Math.pow(f, 2) + Math.pow(m, 2));
            k -= r.dr, i(k / C * w), a(k / C * w);
            break;

           case 3:
            c = x[0] - t.pageX, h = c / f, n(h * w), i(h * w);
            break;

           case 4:
            c = t.pageX - x[0], h = c / f, a(h * w), s(h * w);
            break;

           case 5:
            var k = Math.sqrt(Math.pow(t.pageX - f - _.left, 2) + Math.pow(t.pageY - _.top, 2)), C = Math.sqrt(Math.pow(f, 2) + Math.pow(m, 2));
            k -= r.dr, n(k / C * w), s(k / C * w);
            break;

           case 6:
            u = t.pageY - x[1], p = u / m, a(p * w), s(p * w);
            break;

           case 7:
            var k = Math.sqrt(Math.pow(t.pageX - _.left, 2) + Math.pow(t.pageY - _.top, 2)), C = Math.sqrt(Math.pow(f, 2) + Math.pow(m, 2));
            k -= r.dr, a(k / C * w), s(k / C * w);
          }
          r.stage.update(), r.bitmap80.updateImage(r.stage.canvas), r.stage80.update();
        }
        return !1;
      }
    }).on("mouseup.photozone", function() {
      if (e) {
        if (e.resizing || e.dragging) {
          var t = document.createElement("img");
          t.onload = function() {
            new d(document.getElementById("real-avatar80"), this, e.stage80.canvas, 80, 3);
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
      for (var t = e, i = [], n = (this.fileFilterFunction, 0), a = t.length; a > n; n++) i.push(new g(t[n]));
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
        e.$(".loading").removeClass("hide");
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
          this.$(".resizeable").removeClass("hide"), this.$(".upload-done").show(), this.$(".upload-clear").hide(), 
          this.$(".zoom").show();
          var i = this;
          i.ri = 0, i.R = [ 0, 0 ];
          var n, a, s = document.getElementById("avatar240"), l = document.getElementById("avatar80"), c = (i.r, 
          new o(s)), u = new o(l), h = document.getElementById("img-avatar");
          h.onload = function() {
            var e = Math.min(h.width, h.height);
            i.sss = 1, e > 240 && (i.sss = 240 / e), n = new r(h), i.psx = n.scaleX = i.sss, 
            i.psy = n.scaleY = i.sss, n.setPosition(s.width / 2 - (n.regX *= n.scaleX), s.height / 2 - (n.regY *= n.scaleY)), 
            n.rotation = i.ri, n.updateContext = function(e) {
              e.translate(s.width * i.R[0], s.height * i.R[1]), e.rotate(this.rotation * o.DEG_TO_RAD), 
              e.webkitImageSmoothingEnabled = e.mozImageSmoothingEnabled = !1;
            }, c.addChild(n), c.update(), i.bitmap = n, i.stage = c, a = new r(s), a.updateImage = function(e) {
              a.originalImage = e;
            }, a.updateContext = function(e) {
              e.scale(i.SCALE, i.SCALE), e.webkitImageSmoothingEnabled = e.mozImageSmoothingEnabled = !1;
            }, u.addChild(a), u.update(), i.bitmap80 = a, i.stage80 = u;
            var t = document.createElement("img");
            t.onload = function() {
              new d(document.getElementById("real-avatar80"), this, u.canvas, 80, 3);
            }, t.src = s.toDataURL("image/png");
          }, h.crossOrigin = "anonymous", h.src = e.original;
        }
      },
      onHideAfter: function() {
        var e = this.element;
        this.offSrcNode(), this.destory(), e.remove(), c();
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
          this.$(".upload-done").show(), this.$(".upload-clear").hide(), this.$(".zoom").hide();
          var a = this;
          a.ri = 0, a.R = [ 0, 0 ];
          var s, l, c = document.getElementById("avatar240"), u = document.getElementById("avatar80"), h = (a.r, 
          new o(c)), p = new o(u), f = document.getElementById("img-avatar");
          f.onerror = f.onload = function() {
            var e = f, t = Math.min(f.width, f.height);
            if (a.sss = 1, t > 240 && (a.sss = 240 / t), "image/gif" === a.filehtml5._type) {
              var i = document.createElement("canvas"), n = i.getContext("2d");
              i.width = e.width, i.height = e.height, n.drawImage(e, 0, 0, i.width, i.height), 
              e = i;
            }
            s = new r(e), a.psx = s.scaleX = a.sss, a.psy = s.scaleY = a.sss, s.setPosition(c.width / 2 - (s.regX *= s.scaleX), c.height / 2 - (s.regY *= s.scaleY)), 
            s.rotation = a.ri, s.updateContext = function(e) {
              e.translate(c.width * a.R[0], c.height * a.R[1]), e.rotate(this.rotation * o.DEG_TO_RAD), 
              e.webkitImageSmoothingEnabled = e.mozImageSmoothingEnabled = !1;
            }, h.addChild(s), h.update(), a.bitmap = s, a.stage = h, l = new r(c), l.updateImage = function(e) {
              l.originalImage = e;
            }, l.updateContext = function(e) {
              e.scale(a.SCALE, a.SCALE), e.webkitImageSmoothingEnabled = e.mozImageSmoothingEnabled = !1;
            }, p.addChild(l), p.update(), a.bitmap80 = l, a.stage80 = p;
            var u = document.createElement("img");
            u.onload = function() {
              new d(document.getElementById("real-avatar80"), this, p.canvas, 80, 3);
            }, u.src = c.toDataURL("image/png");
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
            new d(document.getElementById("real-avatar80"), this, e.stage80.canvas, 80, 3);
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
          this.$(".upload, .rotate, .upload-done").show(), this.$(".back, .upload-clear").hide(), 
          !1;
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
          var n = 240 / this.sss, a = t.x / this.sss, l = t.y / this.sss, d = document.createElement("canvas");
          d.width = d.height = n;
          var c = new o(d), u = new r(i);
          u.setPosition(a, l), u.rotation = 90 * this.ri, u.scaleX = t.scaleX / this.sss, 
          u.scaleY = t.scaleY / this.sss, u.updateContext = function(t) {
            t.translate(d.width * e.R[0], d.height * e.R[1]), t.rotate(this.rotation * o.DEG_TO_RAD), 
            t.webkitImageSmoothingEnabled = t.mozImageSmoothingEnabled = !1;
          }, c.addChild(u), c.update();
          var h = s(c.canvas, "original.png"), m = s(document.getElementById("real-avatar80"), "80_80.png"), g = this;
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
  r.prototype = {
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
        var a = n[e];
        i.save(), a.updateContext(i), a.draw(i), i.restore();
      }
    },
    update: function() {
      this.draw();
    }
  }, d.prototype.process1 = function(e, t) {
    e.center.x = (t + .5) * e.ratio, e.icenter.x = Math.floor(e.center.x);
    for (var i = 0; e.dest.height > i; i++) {
      e.center.y = (i + .5) * e.ratio, e.icenter.y = Math.floor(e.center.y);
      var n, a, s, r;
      n = a = s = r = 0;
      for (var o = e.icenter.x - e.range2; e.icenter.x + e.range2 >= o; o++) if (!(0 > o || o >= e.src.width)) {
        var l = Math.floor(1e3 * Math.abs(o - e.center.x));
        e.cacheLanc[l] || (e.cacheLanc[l] = {});
        for (var d = e.icenter.y - e.range2; e.icenter.y + e.range2 >= d; d++) if (!(0 > d || d >= e.src.height)) {
          var c = Math.floor(1e3 * Math.abs(d - e.center.y));
          void 0 == e.cacheLanc[l][c] && (e.cacheLanc[l][c] = e.lanczos(Math.sqrt(Math.pow(l * e.rcp_ratio, 2) + Math.pow(c * e.rcp_ratio, 2)) / 1e3));
          var u = e.cacheLanc[l][c];
          if (u > 0) {
            var h = 4 * (d * e.src.width + o);
            n += u, a += u * e.src.data[h], s += u * e.src.data[h + 1], r += u * e.src.data[h + 2];
          }
        }
      }
      var h = 3 * (i * e.dest.width + t);
      e.dest.data[h] = a / n, e.dest.data[h + 1] = s / n, e.dest.data[h + 2] = r / n;
    }
    ++t < e.dest.width ? setTimeout(function() {
      e.process1(e, t);
    }, 0) : setTimeout(function() {
      e.process2(e);
    }, 0);
  }, d.prototype.process2 = function(e) {
    e.canvas.width = e.dest.width, e.canvas.height = e.dest.height, e.ctx.drawImage(e.img, 0, 0), 
    e.src = e.ctx.getImageData(0, 0, e.dest.width, e.dest.height);
    for (var t, i, n = e.ocan.getContext("2d").getImageData(0, 0, e.dest.width, e.dest.height), a = 0; e.dest.width > a; a++) for (var s = 0; e.dest.height > s; s++) t = 3 * (s * e.dest.width + a), 
    i = 4 * (s * e.dest.width + a), e.src.data[i] = e.dest.data[t], e.src.data[i + 1] = e.dest.data[t + 1], 
    e.src.data[i + 2] = e.dest.data[t + 2], e.src.data[i + 3] = n.data[i + 3];
    e.ctx.putImageData(e.src, 0, 0), e.canvas.style.display = "block";
  }, t.Uploader = v, t.uploadSettings = y;
}), define(function(e) {
  "use strict";
  var t = e("jquery"), i = e("store"), n = window._ENV_, a = (e("dialog"), e("xdialog").dialogs, 
  e("handlebars")), s = e("humantime"), r = e("rex"), o = e("util"), l = e("bus"), d = e("api");
  a.registerHelper("each", function(e, t) {
    var i, n, a = t.fn, s = t.inverse, r = "";
    if (e && e.length) for (i = 0, n = e.length; n > i; ++i) e[i].__index__ = i, r += a(e[i]); else r = s(this);
    return r;
  }), a.registerHelper("ifFalse", function(e, t) {
    return a.helpers["if"].call(this, !e, t);
  }), a.registerHelper("avatarFilename", function(e) {
    return e;
  }), a.registerHelper("printName", function(e, t) {
    return e || (e = t.match(/([^@]+)@[^@]+/)[1]), e;
  }), a.registerHelper("printTime", function(e) {
    var t = s.printEFTime(e);
    return t.content || "Sometime";
  }), a.registerHelper("printTime2", function(e) {
    var t = s.printEFTime(e);
    return t.content || "To be decided";
  }), a.registerHelper("printPlace", function(e) {
    return e || "To be decided";
  }), a.registerHelper("printTime3", function(e) {
    var t = e.begin_at;
    if (!t.date) return t.date_word || "";
    var i = s.printEFTime(e);
    return i.content || "Sometime";
  }), a.registerHelper("printTime4", function(e) {
    e = a.helpers.crossItem.call(this, e);
    var t = s.printEFTime(e);
    return t.content || "Sometime";
  }), a.registerHelper("rsvpAction", function(e, t) {
    var i = {
      ACCEPTED: "Accepted",
      INTERESTED: "Interested",
      DECLINED: "Unavailable",
      NORESPONSE: "Pending"
    }, n = r.filter(e, function(e) {
      return e.identity.id === t ? !0 : void 0;
    })[0], a = "";
    if (n && n in i && "INTERESTED" !== n.rsvp_status) {
      var a = '<div><i class="';
      a += "icon-rsvp-" + n.rsvp_status.toLowerCase() + '"></i> ', a += i[n.rsvp_status] + ": " + n.identity.name + "</div>";
    }
    var s = r.map(e, function(e) {
      return e.by_identity.id === t && e.identity.id !== t ? e.identity.name : void 0;
    }).filter(function(e) {
      return e ? !0 : void 0;
    }).join(", ");
    return a += '<div><i class="icon-invite"></i> ', a += "Invited: " + s, a += "</div>", 
    s ? a : "";
  }), a.registerHelper("ifPlace", function(e) {
    var t = a.helpers.crossItem.call(this, "place");
    return a.helpers["if"].call(this, t.length, e);
  }), a.registerHelper("makeDefault", function(e, t, i) {
    var n = !e && "CONNECTED" === t;
    return a.helpers["if"].call(this, n, i);
  }), a.registerHelper("ifRevoked", function(e, t) {
    return a.helpers["if"].call(this, "REVOKED" === e, t);
  }), a.registerHelper("ifVerifying", function(e, t, i) {
    var n = !a.helpers.isOAuthIdentity.call(this, e, i) && "VERIFYING" === t;
    return a.helpers["if"].call(this, n, i);
  }), a.registerHelper("atName", function(e) {
    return o.printExtUserName(e, !0);
  }), a.registerHelper("editable", function(e, t, i) {
    var n = !a.helpers.isOAuthIdentity.call(this, e, i) && "CONNECTED" === t;
    return a.helpers["if"].call(this, n, i);
  });
  var c = function(e) {
    t(".user-xstats .attended").html(e.cross_quantity);
    var n = t("#jst-user-avatar"), s = a.compile(n.html()), r = s({
      avatar_filename: e.avatar_filename
    });
    t(".user-avatar").append(r), t("#profile .user-name").find("h3").html(e.name || e.nickname), 
    t("#profile .user-bio").text(e.bio || ""), t("#profile .user-name").find(".changepassword").attr("data-dialog-type", e.password ? "changepassword" : "setpassword").find("span").text(e.password ? "Change Password..." : "Set Password..."), 
    a.registerPartial("jst-identity-item", t("#jst-identity-item").html());
    var o = t("#jst-identity-list"), s = a.compile(o.html()), l = e.identities;
    l[0].__default__ = !0;
    var r = s({
      identities: l
    });
    t(".identity-list").append(r);
    var c;
    if (c = t("#app-main").data("event")) {
      var u = c.action;
      if ("add_identity" === u) {
        var h = c.data, p = function(e, n, s) {
          var r = i.get("authorization"), o = r.token;
          d.request("addIdentity", {
            type: "POST",
            params: {
              token: o
            },
            data: {
              external_username: e,
              provider: n
            }
          }, function(e) {
            var n = e.identity, r = i.get("user"), o = r.identities;
            o.push(n), i.set("user", r);
            var l = a.compile(t("#jst-identity-item").html()), d = l(e.identity);
            t(".identity-list").append(d), s && s.destory();
          }, function(i) {
            var a = i && i.meta;
            if (a && 401 === a.code && "authenticate_timeout" === a.errorType) {
              s && s.destory();
              var r = t('<div data-widget="dialog" data-dialog-type="authentication" data-destory="true" class="hide"></div>');
              t("#app-tmp").append(r);
              var o = t.Event("click.dialog.data-api");
              o._data = {
                callback: function() {
                  p(e, n);
                }
              }, r.trigger(o);
            }
          });
        };
        p(h.identity.external_username, h.identity.provider), t("#app-main").removeData("event");
      }
    }
  }, u = function(e) {
    if (e) {
      var i = e.user_id, n = e.token;
      return d.request("crosslist", {
        params: {
          token: n
        },
        resources: {
          user_id: i
        }
      }, function(e) {
        +new Date();
        var i = t("#jst-crosses-container");
        a.registerHelper("confirmed_nums", function(e) {
          var t = 0, i = r.filter(e, function(e) {
            return "ACCEPTED" === e.rsvp_status ? (t += e.mates, !0) : void 0;
          }).length || 0;
          return i + t;
        }), a.registerHelper("total", function(e) {
          var t = 0;
          return r.filter(e, function(e) {
            return "ACCEPTED" === e.rsvp_status ? (t += e.mates, !0) : void 0;
          }), e.length + t;
        }), a.registerHelper("confirmed_identities", function(e) {
          var t = r(e).filter(function(e) {
            return "ACCEPTED" === e.rsvp_status ? !0 : void 0;
          });
          return r(t.slice(0, 7)).map(function(e) {
            return e.identity.name;
          }).join(", ");
        }), a.registerPartial("jst-cross-box", t("#jst-cross-box").html());
        var n = a.compile(i.html()), s = "", o = "upcoming<Upcoming> sometime<Sometime> sevendays<Next 7 days> later<Later> past<Past>", l = {};
        r.map(e.crosses, function(e) {
          l[e.sort] || (l[e.sort] = {
            crosses: []
          }), l[e.sort].crosses.push(e);
        }), l.upcoming || (l.upcoming = {}), l.upcoming.crosses || (l.upcoming.crosses = []), 
        l.upcoming.crosses.reverse();
        var d = e.more.join(" "), c = /<|>/;
        r.map(o.split(" "), function(e) {
          e = e.split(c);
          var t = l[e[0]];
          t && (t.cate = e[0], t.cate_date = e[1], t.hasMore = d.search(e[0]) > -1, s += n(t));
        }), t("#profile .crosses").append(s);
      });
    }
  }, h = function(e) {
    if (e) {
      var i = e.user_id, n = e.token, s = new Date();
      s = s.getFullYear() + "-" + (s.getMonth() + 1) + "-" + s.getDate();
      var o = d.request("crosses", {
        params: {
          token: n
        },
        resources: {
          user_id: i
        }
      }, function(e) {
        new Date();
        var n = e.crosses, s = [], o = {};
        if (r.each(n, function(e, t) {
          e.exfee && e.exfee.invitations && e.exfee.invitations.length && r.each(e.exfee.invitations, function(e, n) {
            o[e.id] = [ t, n ], i === e.identity.connected_user_id && "NORESPONSE" === e.rsvp_status && (e.__crossIndex = t, 
            e.__identityIndex = n, s.push(e));
          });
        }), a.registerHelper("crossItem", function(e) {
          return "place" === e ? n[this.__crossIndex][e].title : "invitationid" === e ? n[this.__crossIndex].exfee.invitations[this.__identityIndex].id : "exfeeid" === e ? n[this.__crossIndex].exfee.id : "identityid" === e ? n[this.__crossIndex].exfee.invitations[this.__identityIndex].identity.id : "name" === e ? n[this.__crossIndex].exfee.invitations[this.__identityIndex].identity.name : n[this.__crossIndex][e];
        }), a.registerHelper("conversation_nums", function() {
          return this.__conversation_nums;
        }), s.length) {
          var l = t("#jst-invitations"), d = a.compile(l.html()), c = d({
            crosses: s
          });
          t("#profile .gr-b .invitations").removeClass("hide").append(c);
        }
      });
      return o.done(f);
    }
  }, p = function(e) {
    if (e) {
      var i = e.user_id, n = e.token, s = new Date(), o = 0;
      return s.setDate(s.getDate() - 3), o = +s, s = s.getFullYear() + "-" + (s.getMonth() + 1) + "-" + s.getDate(), 
      d.request("crosses", {
        resources: {
          user_id: i
        },
        params: {
          updated_at: s,
          token: n
        }
      }, function(e) {
        var i, n = e.crosses;
        if (0 === n.length) return t(".siderbar.updates").addClass("no-updates"), void 0;
        if (i = r.filter(n, function(e) {
          var t = e.updated, i = !1;
          if (t) {
            var n, a, s;
            for (n in t) "background" !== n && (a = t[n], s = +new Date(a.updated_at.replace(/\-/g, "/")), 
            s > o ? i |= !0 : (i |= !1, t[n] = !1));
          }
          return i ? !0 : void 0;
        }), 0 === i.length) return t(".siderbar.updates").addClass("no-updates"), void 0;
        var s = t("#jst-updates").html(), l = a.compile(s), d = l({
          updates: i
        });
        t(".siderbar.updates .cross-tip").before(d);
      });
    }
  }, f = function(e) {
    if (e && (e = i.get("authorization"))) {
      var a = e.user_id, s = +t(".user-xstats > .attended").text(), r = i.get("newbie_guide:" + a);
      if (!r && 3 >= s && !t("#app-browsing-identity").length && !t(".newbie").length) {
        var o = document.createElement("script"), l = t("script#js-newbieguide");
        o.id = "js-newbieguide", o.type = "text/javascript", o.async = !0, o.src = "/static/js/newbieguide/0.0.4/newbieguide.min.js?t=" + n.timestamp, 
        t(o).attr("data-exists", l.attr("data-exists")), l.remove();
        var d = document.body;
        d.appendChild(o);
      }
    }
  }, m = function() {
    var e = i.get("iosapp_dismiss");
    e || t(".ios-app").removeClass("hide");
  };
  l.on("app:profile:show", function(e) {
    e.done([ u, h, p, m ]);
  }), l.on("app:profile:identities", function(e) {
    c(e);
  }), l.on("app:addidentity", function(e) {
    var i = t("#jst-identity-list"), n = a.compile(i.html()), s = n({
      identities: [ e.identity ]
    });
    t(".identity-list").append(s);
  });
  var g = t(document.body);
  g.on("dblclick.profile", ".user-name h3", function() {
    var e = t.trim(t(this).html()), i = t('<input type="text" value="' + e + '" class="pull-left" />');
    i.data("oldValue", e), t(this).after(i).hide(), i.focusend(), t(".xbtn-changepassword").addClass("hide");
  }), g.on("focusout.profile keydown.profile", ".user-name input", function(e) {
    var n = e.type, a = e.keyCode;
    if ("focusout" === n || 9 === a || !e.shiftKey && 13 === a) {
      var s = t.trim(t(this).val()), r = t(this).data("oldValue");
      if (t(this).hide().prev().html(s || r).show(), t(this).remove(), !t(".settings-panel").data("hoverout") && t(".xbtn-changepassword").removeClass("hide"), 
      !s || s === r) return;
      var o = i.get("authorization"), c = o.token;
      d.request("updateUser", {
        type: "POST",
        params: {
          token: c
        },
        data: {
          name: s
        }
      }, function(e) {
        i.set("user", e.user), l.emit("app:page:changeusername", s);
      });
    }
  }), g.on("dblclick.profile", ".identity-list li .identity > span.identityname em", function() {
    var e = t(this), i = e.parents("li"), n = i.data("provider"), a = (i.data("status"), 
    i.data("editable"));
    if (-1 !== "twitter facebook google flickr instagram dropbox".indexOf(n)) i.find(".isOAuth").removeClass("hide"); else if (a) {
      var s = t.trim(e.text()), r = t('<input type="text" value="' + s + '" class="username-input" />');
      r.data("oldValue", s), e.after(r).hide(), r.focusend();
    }
  }), g.on("focusout.profile keydown.profile", ".identity-list .username-input", function(e) {
    var n = e.type, a = e.keyCode;
    if ("focusout" === n || 9 === a || !e.shiftKey && 13 === a) {
      var s = t.trim(t(this).val()), r = t(this).data("oldValue"), o = t(this).parents("li").data("identity-id");
      if (t(this).hide().prev().text(s || r).show(), t(this).remove(), !s || s === r) return;
      var l = i.get("authorization"), c = l.token;
      d.request("updateIdentity", {
        params: {
          token: c
        },
        resources: {
          identity_id: o
        },
        type: "POST",
        data: {
          name: s
        }
      }, function(e) {
        for (var t = i.get("user"), n = 0, a = t.identities.length; a > n; ++n) if (t.identities[n].id === e.identity_id) {
          t.identities[n] = identity;
          break;
        }
        i.set("user", t);
      });
    }
  }), g.on("click.profile", ".xbtn-accept, .xbtn-ignore", function(e) {
    e.preventDefault(), e.stopPropagation();
    var n = t(this), a = n.data("action"), s = n.parent(), r = s.data("id"), o = (s.data("invitationid"), 
    t('.gr-a [data-id="' + r + '"]')), l = s.data("exfeeid"), c = s.data("identity-id"), u = s.data("name"), h = i.get("authorization"), p = h.token;
    d.request("rsvp", {
      params: {
        token: p
      },
      resources: {
        exfee_id: l
      },
      type: "POST",
      data: {
        rsvp: '[{"identity_id":' + c + ', "rsvp_status": "' + a + '", "by_identity_id": ' + c + "}]",
        by_identity_id: c
      }
    }, function() {
      if ("ACCEPTED" === a) {
        var e = o.find(">div :first-child"), t = +e.text();
        e.text(t + 1);
        var i = o.find(">div :last-child"), n = i.text();
        i.text(n + (n ? ", " : "") + u);
      }
      var r;
      s.parent().prev().length || s.parent().next().length || (r = s.parents(".invitations")), 
      s.parent().remove(), r && r.remove();
    });
  }), g.on("click.profile", "#profile div.cross-type", function(e) {
    e.preventDefault(), t(this).next().toggleClass("hide").next().toggleClass("hide"), 
    t(this).find("span.arrow").toggleClass("lt rb");
  }), g.on("hover.profile", ".changepassword", function(e) {
    var i = e.type;
    t(this).data("hoverout", "mouseleave" === i), "mouseenter" === i ? t(this).addClass("xbtn-changepassword") : t(this).removeClass("xbtn-changepassword");
  }), g.on("click.profile", ".more > a", function(e) {
    e.preventDefault();
    var n = t(this), s = n.parent(), o = s.data("cate"), l = i.get("authorization"), c = l.token, u = l.user_id, h = s.prev().find(" .cross-box").length, p = o;
    d.request("crosslist", {
      params: {
        token: c
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
        var t = "{{#crosses}}{{> jst-cross-box}}{{/crosses}}", i = a.compile(t);
        s.prev().append(i(e));
        var l = r.filter(e.more, function(e) {
          return e === o ? !0 : void 0;
        });
        l.length || n.remove();
      }
    });
  }), g.on("click.profile.iosapp", ".ios-app > .exfe-dismiss", function(e) {
    e.preventDefault(), i.set("iosapp_dismiss", !0), g.off("click.profile.iosapp"), 
    t(this).parent().fadeOut();
  });
  var v, y = null, b = null, x = null;
  g.on("click.data-link", ".user-avatar .avatar, .identity-list > li > .avatar", function() {
    var i = t(this), n = i.find("img");
    if (!i.parent().data("editable")) return !1;
    var a = i.parent().data("identity-id"), s = {};
    a && (s.identity_id = a), s["80_80"] = n[0].src, s["80_80"] = decodeURIComponent(s["80_80"]), 
    s["80_80"].match(/\/80_80_/) || (s["80_80"] = ""), s.original = s["80_80"].replace(/80_80_/, "original_"), 
    y || (y = e("uploader").Uploader, v = t.extend(!0, {}, e("uploader").uploadSettings, {
      options: {
        onHideBefore: function() {
          x = null, b = null;
        }
      }
    })), b && (b.hide(), b = null), b = new y(v).render(), b.show(s);
  }), g.dndsortable({
    delay: 300,
    wrap: !0,
    list: ".identity-list",
    items: " > li",
    sort: function(e, n) {
      var a = t(e), s = t(n), r = s.parent(), o = a.index(), l = s.index(), c = r.data("draggable");
      if (c) {
        o > l ? s.before(a) : s.after(a);
        var u = i.get("authorization"), h = [];
        r.find("> li").each(function(e, i) {
          h.push(t(i).data("identity-id"));
        }), d.request("sortIdentities", {
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
          t.splice(l, 0, n), i.set("user", e), r.data("draggable", !0);
        }), r.data("draggable", !1);
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
      var a = i.get("authorization"), s = a.token, o = d.request("deleteIdentity", {
        type: "POST",
        params: {
          token: s
        },
        data: {
          identity_id: e
        }
      }, function() {
        var n = i.get("user"), a = n.identities;
        r.some(a, function(t, i) {
          return t.id === e ? (a.splice(i, 1), !0) : void 0;
        }), i.set("user", n), t('.identity-list > li[data-identity-id="' + e + '"]').remove();
      }, function(i) {
        var a = i && i.meta;
        if (a && 401 === a.code && "authenticate_timeout" === a.errorType) {
          var s = t('<div data-widget="dialog" data-dialog-type="authentication" data-destory="true" class="hide"></div>');
          t("#app-tmp").append(s);
          var r = t.Event("click.dialog.data-api");
          r._data = {
            callback: function() {
              n(e);
            }
          }, s.trigger(r);
        }
      });
      o.always(function() {
        g.data("trash-overlay-deletable", !0);
      });
    }
    var a = g.data("trash-overlay-deletable");
    if (a) {
      g.data("trash-overlay-deletable", !1), e.stopPropagation(), e.preventDefault();
      var s = e.originalEvent.dataTransfer, o = +s.getData("text/plain");
      return t(this).parent().removeClass("over"), t(".icon24-trash").removeClass("icon24-trash-red"), 
      n(o), !1;
    }
  });
}), define("user", function(e) {
  "use strict";
  function t(e) {
    var t, i = r("#app-user-menu"), n = r("#app-user-name"), a = n.find("span"), s = i.find(".dropdown-wrapper"), o = s.find(".user-panel"), l = "/#" + c.printExtUserName(e.identities[0]);
    r("#app-browsing-identity").remove(), n.attr("href", l), a.text(e.name || e.nickname).removeClass("browsing-identity"), 
    t = h.compile(m.normal), o.length && o.remove(), e.profileLink = l, e.verifying = 1 === e.identities.length && "VERIFYING" === e.identities[0].status, 
    s.append(t(e)), delete e.profileLink, delete e.verifying;
  }
  function i(e) {
    var t, i = r("#app-user-menu"), n = r("#app-user-name"), a = n.find("span"), s = i.find(".dropdown-wrapper"), o = s.find(".user-panel"), l = e.browsing;
    e.browsing.isBrowsing = !0, r("#app-browsing-identity").remove(), r("#app-tmp").append(r('<div id="app-browsing-identity">').data("settings", e).attr("data-widget", "dialog").attr("data-dialog-type", "browsing_identity").attr("data-token-type", e.tokenType).attr("data-token", e.originToken).attr("data-page", e.page).attr("data-action", e.action).attr("data-read-only", e.readOnly)), 
    n.attr("href", location.href), a.html("Browsing as: <em>" + (l.name || l.nickname) + "</em>").addClass("browsing-identity"), 
    t = h.compile(m.browsing_identity), o.length && o.remove(), s.append(t(e)), r("#app-user-menu").find(".set-up").data("source", {
      browsing_user: l,
      identity: l.identities[0],
      originToken: e.originToken,
      tokenType: e.tokenType,
      user_name: e.user_name,
      forward: e.forward,
      page: e.page
    });
  }
  function n(e, t) {
    e = !!e;
    var i = r(document.body), n = r("#app-menubar"), a = r("#app-main");
    t || a.empty(), i.toggleClass("hbg", e), n.toggleClass("hide", e);
  }
  function a(e) {
    e = !!e;
    var t = r("#app-user-menu"), i = r("#app-signin");
    t.toggleClass("hide", !e), i.toggleClass("hide", e);
  }
  function s(e) {
    var t = u.get("identities") || [], i = t.slice(0);
    0 === e.length ? t = e : o.each(e, function(e, n) {
      var a = o.find(i, function(i) {
        return i.external_username === e.external_username ? (t[n] = i, !0) : void 0;
      });
      a || t.push(e);
    }), u.set("identities", t);
  }
  var r = e("jquery"), o = e("rex"), l = e("api"), d = e("bus"), c = e("util"), u = e("store"), h = e("handlebars"), p = function(e, t, i, n) {
    f(e, t, function(a) {
      var l, h = u.get("last_external_username"), p = a.user;
      if (h && (l = o.find(p.identities, function(e) {
        var t = c.printExtUserName(e);
        return h === t ? !0 : void 0;
      })), l || (l = p.identities[0], u.set("last_external_username", c.printExtUserName(l))), 
      u.set("authorization", {
        token: e,
        user_id: t
      }), u.set("user", p), u.set("lastIdentity", l), s(p.identities), n = !r(".modal-su").size()) {
        var f = r("#forbidden"), m = r("#invite");
        if (f.size() || m.size()) return window.location.reload(), void 0;
        var g = r("#app-browsing-identity");
        if (g.size() && "profile" === g.attr("data-page")) return g.remove(), window.location.href = "/", 
        void 0;
        var v = decodeURIComponent(window.location.hash);
        if (i || ("" === v || /^#?(invalid)?/.test(v)) && !/^#gather/.test(v) && !/^#!/.test(v)) return setTimeout(function() {
          window.location.hash = c.printExtUserName(p.identities[0]);
        }, 44.5), void 0;
      }
      d.emit("app:page:usermenu", !0), d.emit("app:usermenu:updatenormal", p), d.emit("app:usermenu:crosslist", e, t), 
      d.emit("app:user:signin:after", p);
    });
  };
  d.on("app:user:signin", p);
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
  d.on("app:api:getuser", f), d.on("app:usermenu:updatenormal", t), d.on("app:usermenu:updatebrowsing", i);
  var m = {
    normal: '<div class="dropdown-menu user-panel"><div class="header"><div class="meta"><a class="pull-right avatar" href="{{profileLink}}" data-link><img width="40" height="40" alt="" src="{{avatar_filename}}" /></a><a class="attended" href="{{profileLink}}" data-link><span class="attended-nums">{{cross_quantity}}</span><span class="attended-x"><em class="x">·X·</em> attended</span></a></div></div><div class="body">{{#unless password}}<div class="merge set-up" data-widget="dialog" data-dialog-type="setpassword"><a href="#">Set Up</a> your <span class="x-sign">EXFE</span> password</div>{{/unless}}{{#if verifying}}<div class="merge verify" data-dialog-type="verification_{{identities.[0].provider}}" data-widget="dialog" data-identity-id="{{identities.[0].id}}"><strong>Verify</strong> your identity</div>{{/if}}<div class="list"></div></div><div class="footer"><a href="/#gather" class="xbtn xbtn-gather" id="js-gatherax" data-link>Gather a <span class="x">·X·</span></a><div class="spliterline"></div><div class="actions"><a href="#" class="pull-right" id="app-signout">Sign out</a></div></div></div>',
    browsing_identity: '<div class="dropdown-menu user-panel"><div class="header"><h2>Browsing Identity</h2></div><div class="body">{{#with browsing}}<div>You are browsing this page as {{capitalize identities.[0].provider}} identity:</div><div class="identity"><span class="pull-right avatar alt40"><img src="{{identities.[0].avatar_filename}}" width="20" height="20" alt="" /></span><i class="icon16-identity-{{identities.[0].provider}}"></i><span class="oblique">{{identities.[0].external_username}}</span></div>{{#if ../setup}}<div class="merge set-up" data-user-action="setup" data-widget="dialog" data-dialog-type="setup_{{identities.[0].provider}}"><a href="#">Set Up</a> new <span class="x-sign">EXFE</span> account with the browsing identity.</div>{{/if}}{{/with}}{{#unless setup}}<div class="orspliter hide">or</div><div class="merge" data-user-action="signin" data-source="{{browsing.identities.[0].external_username}}" data-widget="dialog" data-dialog-type="identification" data-dialog-tab="d00"><a href="#">Sign In</a> with browsing identity<br />{{#if normal}}(sign out from current account){{/if}}</div>{{/unless}}</div><div class="footer"></div></div>'
  };
  h.registerHelper("ifConnected", function(e, t) {
    return h.helpers["if"].call(this, "CONNECTED" === e, t);
  }), d.on("app:page:home", n), d.on("app:page:usermenu", a), d.on("app:page:changeusername", function(e) {
    r("#app-user-name").find("span").text(e);
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
      var a = i.shift();
      return a = a ? a : "", {
        title: a,
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
      for (var a = 0; this.identities.length > a; a++) i(e, this.identities[a]) && !ExfeeWidget.isMyIdentity(this.identities[a]) && ExfeeWidget.checkExistence(this.identities[a]) === !1 && n.push(ExfeUtilities.clone(this.identities[a]));
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
      $("#" + this.dom_id + " .pointer").bind("click", function() {
        ExfeeWidget.checkInput($("#" + e + " .input-xlarge"), !0);
      }), $(document).on("mousedown", "#" + this.dom_id + " .thumbnails > li.identity > .avatar", function() {
        ExfeeWidget.showPanel(this.parentNode);
      }), this.complete_timer = setInterval("ExfeeWidget.checkInput($('#" + this.dom_id + " .input-xlarge'))", 50), 
      ExfeUtilities.clone(this);
    },
    showAll: function(e, t) {
      var i = 0, n = 0, a = [ "ACCEPTED", "INTERESTED", "NORESPONSE", "DECLINED", "IGNORED" ];
      $("#" + this.dom_id + " .thumbnails").html("");
      for (var s = 0; a.length > s; s++) for (var r = 0; Exfee.invitations.length > r; r++) if (Exfee.invitations[r].rsvp_status === a[s]) {
        var o = Exfee.invitations[r].mates + 1;
        e && ExfeeWidget.isMyIdentity(Exfee.invitations[r].identity) || this.showOne(Exfee.invitations[r], t), 
        "ACCEPTED" === Exfee.invitations[r].rsvp_status && (i += o), n += o;
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
      var t = $(e), i = t.offset(), n = {}, a = t.attr("id"), s = t.attr("provider"), r = t.attr("external_id"), o = t.attr("external_username");
      (a = ~~a) && (n.id = a), s && (n.provider = s), r && (n.external_id = r), o && (n.external_username = o);
      var l = this.getInvitationByIdentity(n);
      ExfeePanel.showTip(l, i.left, i.top + 50);
    },
    showPanel: function(e) {
      var t = $(e), i = t.offset(), n = {}, a = t.attr("id"), s = t.attr("provider"), r = t.attr("external_id"), o = t.attr("external_username");
      (a = ~~a) && (n.id = a), s && (n.provider = s), r && (n.external_id = r), o && (n.external_username = o);
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
        var a = this.checkExistence(e);
        return a === !1 ? (Exfee.invitations.push({
          identity: ExfeUtilities.clone(e),
          rsvp_status: i ? i : "NORESPONSE",
          host: !!t,
          mates: 0
        }), this.callback()) : "REMOVED" === Exfee.invitations[a].rsvp_status && (Exfee.invitations[a].rsvp_status = "NORESPONSE", 
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
    showCompleteItems: function(t, i, n, a) {
      i = i.replace(/^\+/, "");
      var s = function(e) {
        var t = RegExp("(" + i + ")");
        return e ? e.replace(t, '<span class="highlight">$1</span>') : "";
      }, r = $(".ids-popmenu > ol"), o = "";
      i = i ? i.toLowerCase() : "", ExfeeWidget.complete_key !== i && (ExfeeWidget.complete_exfee = [], 
      r.html("")), ExfeeWidget.complete_key = i;
      for (var l = 0; n.length > l; l++) {
        for (var d = !1, c = 0; ExfeeWidget.complete_exfee.length > c; c++) if (this.compareIdentity(ExfeeWidget.complete_exfee[c], n[l])) {
          d = !0;
          break;
        }
        if (!d) {
          var u = ExfeeWidget.complete_exfee.push(ExfeUtilities.clone(n[l])) - 1, h = n[l].provider;
          o += "<li" + (u ? "" : ' class="active"') + ">" + '<span class="pull-left avatar">' + '<img src="' + n[l].avatar_filename + '" alt="" width="40" height="40">' + '<span class="rb"><i class="icon16-identity-' + n[l].provider + '"></i></span>' + "</span>" + '<div class="identity">' + '<div class="name">' + s(n[l].name) + "</div>" + "<div>" + '<span class="oblique external">' + s(this.displayIdentity(n[l], !0)) + "</span>" + ("email" === h || "phone" === h ? "" : ' <span class="provider">@' + h.charAt(0).toUpperCase() + h.substr(1) + "</span>") + "</div>" + "</div>" + "</li>";
        }
      }
      r.append(o), this.displayCompletePanel(t, i && ExfeeWidget.complete_exfee.length);
      var p = i.replace(/\-|\(|\)|\ /g, "");
      if (p && a && !ExfeeWidget.complete_exfee.length && !$("#phone-panel").length && /^\+?[0-9]{5,15}$/.test(p)) {
        var f = e("phonepanel"), m = new f({
          options: {
            parentNode: $("#app-tmp"),
            srcNode: t
          },
          add: function(e) {
            ExfeeWidget.addExfee(e), t.val("");
          }
        });
        m.show();
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
        for (var n = [], a = 0; i.identities.length > a; a++) ExfeeWidget.isMyIdentity(i.identities[a]) || ExfeeWidget.checkExistence(i.identities[a]) !== !1 || n.push(i.identities[a]), 
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
        var i = e.val(), n = i.split(/,|;|\r|\n|\t/), a = [], s = [], r = "", o = "";
        if (ExfeeWidget.last_inputed[e[0].id] !== i || t) {
          ExfeeWidget.last_inputed[e[0].id] = i;
          for (var l = 0; n.length > l; l++) if (r = ExfeUtilities.trim(n[l])) {
            var d = ExfeeWidget.parseAttendeeInfo(r);
            d && (n.length - 1 > ~~l || t) && this.addExfee(d) ? a.push(d) : (s.push(n[l]), 
            o = n[l]);
          }
          var c = s.join("; ");
          c !== i && e.val(c), this.ajaxIdentity(a), ExfeeWidget.summary().items >= ExfeeWidget.hard_limit && i ? (o = "", 
          this.showLimitWarning()) : this.showLimitWarning(!1);
          var u = !!ExfeeWidget.parseAttendeeInfo(o);
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
      switch (e.type) {
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
          t.val("")) : ExfeeWidget.checkInput(t, !0);
          break;

         case 27:
          ExfeeWidget.completing && ExfeeWidget.displayCompletePanel(t, !1);
          break;

         case 38:
         case 40:
          e.preventDefault();
          var a = $(".ids-popmenu"), s = 352, r = 50, o = a.scrollTop();
          if (!ExfeeWidget.completing) return;
          var i = a.find("ol .active"), n = ~~i.index(), l = ExfeeWidget.complete_exfee.length - 1;
          switch (e.which) {
           case 38:
            0 > --n && (n = l);
            break;

           case 40:
            ++n > l && (n = 0);
          }
          ExfeeWidget.selectCompleteItem(n);
          var d = n * r, c = d - o;
          0 > c ? a.scrollTop(d) : c + r > s && a.scrollTop(d + r - s + 1);
        }
        break;

       case "blur":
        ExfeeWidget.focus[e.target.id] = !1, ExfeeWidget.displayCompletePanel(t, !1);
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
      var n = this.newId(e), a = '<div class="tooltip tip-exfee  exfee_pop_up" style="left: ' + t + "px; top: " + i + 'px;">' + '<div class="tooltip-inner">' + "<h5>" + e.identity.name + "</h5>" + "<div>" + '<i class="icon16-identity-' + e.identity.provider + '"></i>' + '<span class="oblique">' + ExfeeWidget.displayIdentity(e.identity, !0) + "</span>" + "</div>" + "</div>" + "</div>";
      this.tipId === n && $(".tip-exfee").length || (this.tipId = n, this.hideTip(), this.objBody.append(a), 
      $(".exfeetip").show());
    },
    showPanel: function(e, t, i) {
      var n = this.newId(e), a = '<div class="exfeepanel exfee_pop_up" style="left: ' + t + "px; top: " + i + 'px; z-index: 10">' + '<div class="tooltip-inner">' + '<div class="avatar-name">' + '<span class="pull-left pointer avatar">' + '<img src="' + e.identity.avatar_filename + '" alt="" width="60" height="60" />' + '<i class="lt"></i>' + "</span>" + "<h4>" + e.identity.name + "</h4>" + "</div>" + '<div class="clearfix rsvp-actions">' + '<div class="pull-right invited">' + '<div class="mates-num hide"></div>' + '<div class="pull-left together-with hide">Mates&nbsp;</div>' + '<div class="pull-right mates-info">' + '<i class="mates-add icon-plus-blue"></i>' + "</div>" + '<div class="pull-left mates-edit hide">' + '<i class="pull-left mates-minus icon14-mates-minus"></i>' + '<span class="pull-left num"></span>' + '<i class="pull-left mates-add icon14-mates-add"></i>' + "</div>" + "</div>" + '<div class="rsvp-info">' + '<div class="rsvp-content">' + '<div class="attendance"></div>' + '<div class="by">by <span class="name"></span></div>' + "</div>" + '<div class="pull-right pointer underline setto">' + (readOnly ? "" : '<span>set to</span> <i class="icon-rsvp-declined-red"></i>') + "</div>" + "</div>" + "</div>" + '<div class="identities">' + '<ul class="identities-list">' + "<li>" + '<i class="pull-left icon16-identity-' + e.identity.provider + '"></i>' + '<span class="oblique identity">' + ExfeeWidget.displayIdentity(e.identity, !0) + "</span>" + (readOnly ? "" : '<div class="identity-btn delete"><i class="icon-minus-red"></i><button class="btn-leave">Leave</button></div>') + "</li>" + "</ul>" + '<div class="identity-actions">' + "<p>" + '<span class="xalert-fail">Remove yourself?</span>' + "<br />" + '<span class="xalter-info">You will <strong>NOT</strong> be able to access any information in this <span class="x">·X·</span>. Confirm leaving?</span>' + '<button class="pull-right btn-cancel">Cancel</button>' + "</p>" + "</div>" + "</div>" + '<!--i class="expand nomore"></i-->' + "</div>" + "</div>";
      this.invitation = ExfeUtilities.clone(e), this.panelId === n && $(".exfeepanel").length || (this.panelId = n, 
      this.editing = "", this.pre_delete = !1, this.hideTip(), this.hidePanel(), this.objBody.append(a), 
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
  }, a = {
    id: 0,
    type: "Exfee",
    invitations: []
  }, s = function(e) {
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
      t(".cross-opts .saving").hide(), e ? window.location.href = "/" : V.emit("app:cross:edited");
    }, function(e) {
      t(".cross-opts .saving").hide();
      var i = !e.meta || 401 !== e.meta.code && 403 !== e.meta.code ? "" : "no_permission";
      V.emit("app:cross:edited", {
        error: i
      });
    }));
  }, r = function(e) {
    E(), s(e);
  }, o = function() {
    ExfeeCache.init(), ExfeeWidget.api_url = window._ENV_.api_url, window.GatherExfeeWidget = ExfeeWidget.make("gather-exfee", !0, r), 
    window.CrossExfeeWidget = ExfeeWidget.make("cross-exfee", !0, r);
  }, l = function(e) {
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
        $ = e.post.created_at, t(".cross-opts .saving").hide(), N(e.post), V.emit("app:cross:edited");
      }, function(e) {
        t(".cross-opts .saving").hide();
        var i = !e.meta || 401 !== e.meta.code && 403 !== e.meta.code ? "" : "no_permission";
        V.emit("app:cross:edited", {
          error: i
        });
      });
    }
  }, d = function() {
    t("#cross-form-discard").bind("click", function() {
      window.location = "/";
    }), t("#cross-form-gather").bind("click", function() {
      if (t("body").trigger("click"), curIdentity) t(this).hasClass("disabled") || (t(this).prop("disabled", !0).toggleClass("disabled", !0), 
      q()); else {
        var e = t.trim(t("#gather-title").val());
        0 === e.length ? (t(".choose-identity .placeholder").addClass("text-error"), t(".add-identity").addClass("hide"), 
        t(".please-identity").removeClass("hide")) : t(".choose-identity .placeholder").trigger("click");
      }
    }), t(".cross-conversation .comment-form .pointer").bind("click", function() {
      var e = t(".cross-conversation .comment-form textarea");
      l(e.val()), e.val("");
    }), t(".cross-conversation .comment-form textarea").bind("keydown", function(e) {
      switch (e.which) {
       case 13:
        var i = t(this);
        e.shiftKey || (e.preventDefault(), l(i.val()), i.val(""));
      }
    });
  }, c = function() {
    var e = t("#gather-title");
    e.bind("focus keydown keyup blur", function() {
      v(e.val(), "gather");
    });
  }, u = function(i) {
    if (t(".cross-container").length && !readOnly) {
      var n = Editing, a = i ? i.target : null, s = {
        title: [ function() {
          t(".cross-title").removeAttr("editable"), t(".cross-title .show").show(), v(t(".cross-title .edit").val(), "cross"), 
          t(".cross-title .edit").hide(), W();
        }, function() {
          t(".cross-title").attr("editable", !0), t(".cross-title .show").hide(), t(".cross-title .edit").show().focus();
        } ],
        description: [ function() {
          t(".cross-description-outer").removeAttr("editable"), t(".cross-description .show").show(), 
          t(".cross-description .edit").hide(), y(t(".cross-description .edit").val()), W();
        }, function() {
          t(".cross-description-outer").attr("editable", !0), t(".cross-description .show").hide(), 
          t(".cross-description .xbtn-more").hide(), t(".cross-description .edit").show().focus();
        } ],
        time: [ function() {
          var e = t("#date-panel");
          if (e.size()) {
            var i = e.data("widget-id"), a = App.widgetCaches[i];
            t.trim(t("#date-string").data("date")), ("date-panel" === n || "time" === n) && W(), 
            a && a.hide();
          }
          t(".cross-date").removeAttr("editable");
        }, function() {
          var i = t("#date-panel");
          if (!i.size()) {
            var n = e("datepanel"), a = new n({
              options: {
                parentNode: t("#app-tmp"),
                srcNode: t(".cross-date"),
                eftime: Cross.time
              }
            });
            a.show(), t(".cross-date").attr("editable", !0);
          }
        } ],
        place: [ function() {
          t(".cross-place").removeAttr("editable");
          var e = t("#map-panel");
          if (e.size()) {
            var i = e.data("widget-id"), a = App.widgetCaches[i];
            ("map-panel" === n || "place" === n) && (Cross.place = a.place, W()), a && a.hide();
          }
        }, function() {
          var i = t("#map-panel");
          if (!i.size()) {
            var n = e("mappanel"), a = new n({
              options: {
                parentNode: t("#app-tmp"),
                srcNode: t(".cross-place"),
                place: Cross.place
              },
              update: function(e) {
                C(e), A(e);
              }
            });
            a.show(), t(".cross-place").attr("editable", !0);
          }
        } ],
        rsvp: [ function() {
          P();
        }, function() {
          P(!0);
        } ],
        background: [ function() {}, function() {
          !i || "dblclick" !== i.type || !n && Cross.id || m(i ? i.shiftKey : !1);
        } ],
        exfee: [ function() {
          t("#cross-exfee .exfee-input").val() || (t("#cross-exfee .total").css("visibility", "hidden"), 
          t("#cross-exfee .thumbnails .avatar .rb").hide()), t("#gather-exfee .exfee-input").val() || t("#gather-exfee .thumbnails .avatar .rb").hide(), 
          ExfeeWidget.showLimitWarning(!1);
        }, function() {} ]
      };
      if (i) {
        var r = t(a).attr("editarea");
        switch (r) {
         case "rsvp":
         case "exfee":
          Editing = r;
        }
        if ("click" === i.type && (Editing || !Cross.id) || "dblclick" === i.type) for (Editing = r; a && !Editing && "BODY" !== a.tagName; ) a = a.parentNode, 
        Editing = t(a).attr("editarea"); else Editing = "";
      }
      if ("background" === Editing) s.background[1](), Editing = n; else {
        if ("map-panel" === Editing) return;
        if ("date-panel" === Editing) return;
        for (var o in s) s[o][~~(o === Editing)]();
      }
    }
  }, h = function() {
    t("body").on("click", u), t("body").on("dblclick.data-link", "[editarea]", u), t(".cross-title .edit").bind("focus keydown keyup blur", function(e) {
      if ("keydown" === e.type) switch (e.which) {
       case 13:
        e.shiftKey || (e.preventDefault(), u());
      }
      v(t(e.target).val(), "cross");
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
      ExfeeWidget.rsvpMe("ACCEPTED"), P();
    }), t(".cross-rsvp .edit .decline").bind("click", function() {
      ExfeeWidget.rsvpMe("DECLINED"), P();
    }), t(".cross-rsvp .edit .interested").bind("click", function() {
      ExfeeWidget.rsvpMe("INTERESTED"), P();
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
        ExfeeWidget.useCompleteItem(t(this).index());
      }
    });
  }, p = function() {
    Cross.title.length || (Cross.title = curIdentity ? "Meet " + curIdentity.name : "Gather a ·X·");
  }, f = function() {
    var e = new Date(), i = Y.formatDate(e.getFullYear() + "-" + (e.getMonth() + 1) + "-" + e.getDate());
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
  }, m = function(e) {
    var t = ExfeUtilities.clone(window._ENV_.backgrounds);
    t.push("");
    for (var i = 0; Cross.widget.length > i && "Background" !== Cross.widget[i].type; i++) ;
    if (e) Cross.widget[i].image = ""; else {
      var n = Cross.widget[i].image;
      do Cross.widget[i].image = t[parseInt(Math.random() * t.length)]; while (n === Cross.widget[i].image);
    }
    T();
  }, g = function() {
    ExfeeWidget.addExfee(curIdentity, !0, "ACCEPTED");
  }, v = function(e, t) {
    Cross.title = ExfeUtilities.trim(e), x(t);
  }, y = function(e) {
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
  }, _ = function() {
    k(), D();
  }, k = function() {
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
    var i = e(Cross.time.begin_at.timezone), n = e(ExfeUtilities.getTimezone()), a = (i === n && window._ENV_.timevalid, 
    ""), s = "", r = "Pick a time.", o = !1;
    if (Cross.time.origin) {
      var l = Y.printEFTime(Cross.time, "X");
      a = l.content, s = l.title;
    } else a = r, s = "Sometime", o = !0;
    t(".cross-date h2").html(s), t(".cross-time").html(a).toggleClass("gray", o);
  }, C = function(e) {
    t(".cross-dp.cross-place > h2").html(e.title ? ExfeUtilities.escape(e.title) : "Somewhere"), 
    t(".cross-dp.cross-place > address").toggleClass("more", !0), t(".cross-dp.cross-place .xbtn-more").toggleClass("xbtn-less", !1), 
    e.description ? t(".cross-dp.cross-place > address").html(ExfeUtilities.escape(e.description).replace(/\r\n|\r|\n/g, "<br>")).toggleClass("gray", !1) : t(".cross-dp.cross-place > address").html("Choose a place.").toggleClass("gray", !0), 
    t(".cross-dp.cross-place > address").height() > 80 ? (t(".cross-dp.cross-place > address").toggleClass("more", !1), 
    t(".cross-dp.cross-place .xbtn-more").show()) : t(".cross-dp.cross-place .xbtn-more").hide();
  }, E = function() {
    window.GatherExfeeWidget.showAll(!0), window.CrossExfeeWidget.showAll(!1, !0);
  }, T = function() {
    for (var e = 0; Cross.widget.length > e && "Background" !== Cross.widget[e].type; e++) ;
    t(".x-gather").toggleClass("no-bg", !1), t(".cross-background").css("background-image", "url(/static/img/xbg/" + (Cross.widget[e].image ? Cross.widget[e].image : "default.jpg") + ")");
  }, $ = "", S = {}, I = function(e, t) {
    i = e;
    for (var n = i.length - 1; n >= 0; n--) n || ($ = i[n].created_at), N(i[n], t);
  }, N = function(e, i) {
    if (void 0 === S[e.id]) {
      S[e.id] = !0;
      var n = ExfeUtilities.escape(e.content).replace(/\r\n|\n\r|\r|\n/g, "\n"), a = '<div class="avatar-comment"><span class="pull-left avatar"><img alt="" src="' + e.by_identity.avatar_filename + '" width="40" height="40" />' + "</span>" + '<div class="comment">' + "<p>" + '<span class="author"><strong>' + e.by_identity.name + "</strong>:&nbsp;</span>" + ExfeUtilities.escape(e.content).replace(/\r\n|\n\r|\r|\n/g, "<br>") + '<span class="pull-right date">' + '<time data-iso-time="' + Y.toISO(e.created_at) + '"></time>' + "</span>" + "</p>" + "</div>" + "</div>";
      t(".conversation-timeline").prepend(a), i && window.webkitNotifications && 0 === window.webkitNotifications.checkPermission() && window.webkitNotifications.createNotification(null, "EXFE - " + Cross.title, e.by_identity.name + ": " + n).show();
    }
  }, D = function() {
    t("time[data-iso-time]").each(function() {
      var e = t(this);
      e.text(Y(e.data("iso-time")));
    });
  }, P = function(e) {
    var i = ExfeeWidget.getMyInvitation();
    if (i) {
      var n = i.by_identity ? i.by_identity : curIdentity, a = i.identity.id === n.id;
      if ("NORESPONSE" === i.rsvp_status || "IGNORED" === i.rsvp_status || e) return a ? t(".cross-rsvp .edit .by").hide() : (t(".cross-rsvp .edit .by .avatar img").attr("src", i.by_identity.avatar_filename), 
      t(".cross-rsvp .edit .by strong").html(i.by_identity.name), t(".cross-rsvp .edit .by").show()), 
      t(".cross-rsvp .show").hide(), t(".cross-rsvp .edit").fadeIn(233), void 0;
      if ("ACCEPTED" === i.rsvp_status || "INTERESTED" === i.rsvp_status || "DECLINED" === i.rsvp_status) {
        var s = "";
        switch (i.rsvp_status) {
         case "ACCEPTED":
          s = "Accepted";
          break;

         case "DECLINED":
          s = "Unavailable";
          break;

         case "INTERESTED":
          s = "Interested";
        }
        a || "INTERESTED" === i.rsvp_status ? (t(".cross-rsvp .show .by").hide(), t(".cross-rsvp .show .by strong").html("")) : (t(".cross-rsvp .show .by .avatar img").attr("src", i.by_identity.avatar_filename), 
        t(".cross-rsvp .show .by strong").html(i.by_identity.name), t(".cross-rsvp .show .by").show());
        for (var r = ExfeeWidget.summary(), o = "", l = 0; Math.min(r.accepted_invitations.length, 5) > l; l++) o += '<li><span class="avatar alt40"><img height="20" width="20" alt="" src="' + r.accepted_invitations[l].identity.avatar_filename + '">' + (r.accepted_invitations[l].mates ? '<i class="icon10-plus-' + r.accepted_invitations[l].mates + '"></i>' : "") + "</span></li>";
        o += r.accepted ? "<li><span>" + r.accepted + " accepted.</span></li>" : "";
        var d = t(".cross-rsvp .show .accepted");
        return d.text() !== t(o).text() && d.html(o), t(".cross-rsvp .show .by").hide(), 
        t(".cross-rsvp .show .change").hide(), t(".cross-rsvp .show .attendance").html(s), 
        t(".cross-rsvp .show").fadeIn(233), t(".cross-rsvp .edit").hide(), void 0;
      }
    }
    t(".cross-rsvp .show").hide(), t(".cross-rsvp .edit").hide();
  }, A = function(e) {
    function i(i) {
      var n = i.coords;
      a = a.replace(/\{\{lat\}\}/gi, n.latitude).replace(/\{\{lng\}\}/gi, n.longitude).replace(/\{\{title\}\}/gi, ("" === e.provider ? n.latitude + "," + n.longitude + " " : "") + encodeURIComponent(e.title)), 
      t(".cross-map").append(a);
    }
    t(".cross-map").empty();
    var n = e.lat.length && e.lng.length, a = '<a target="_blank" href="https://maps.google.com/maps?key=' + _ENV_.MAP_KEY + '&q={{title}}&hl=en&ie=UTF8&sll={{lat}},{{lng}}&t=m&z=16"><img style="border-radius: 3px; box-shadow: 2px 2px 4px rgba(0, 0, 0, .25);" src="https://maps.googleapis.com/maps/api/staticmap?center={{lat}},{{lng}}&markers=icon%3a' + encodeURIComponent("http://img.exfe.com/web/map_pin_blue.png") + '%7C{{lat}},{{lng}}&zoom=13&size=280x140&maptype=road&sensor=false" alt="" width="280" height="140" /></a>';
    n && i({
      coords: {
        latitude: e.lat,
        longitude: e.lng
      }
    });
  }, M = function() {
    x(), w(), C(Cross.place), E(), T(), P(), A(Cross.place);
  }, O = function(e) {
    var t = {
      resources: {
        exfee_id: Exfee.id
      }
    };
    $ && (t.params = {
      updated_at: $
    }), Api.request("conversation", t, function(t) {
      I(t.conversation, e);
    });
  }, z = function() {
    O(!0);
  }, L = function() {
    readOnly ? t("#conversation-form").hide() : (t("#conversation-form span.avatar img").attr("src", curIdentity.avatar_filename), 
    t("#conversation-form").show()), t(".conversation-timeline").html(""), t(".cross-conversation").slideDown(233), 
    $ = "", S = {}, O(), convTimer = setInterval(z, 233e3);
  }, H = function(e, i) {
    Cross.id = e.id, Cross.title = e.title, Cross.description = e.description, Cross.time = e.time, 
    Cross.place = e.place, Cross.widget = e.widget, Cross.exfee_id = e.exfee.id, Exfee = e.exfee, 
    readOnly = i, G = B(), void 0 === Cross.time || void 0 === Cross.time.begin_at || Cross.time.begin_at.timezone || (Cross.time.begin_at.timezone = ExfeUtilities.getTimezone()), 
    t(".cross-date  .edit").val(Cross.time.origin), t(".cross-place .edit").val(Cross.place.title + (Cross.place.description ? "\n" + Cross.place.description : ""));
    for (var n = 0; Exfee.invitations.length > n; n++) if (ExfeeWidget.isMyIdentity(Exfee.invitations[n].identity)) {
      curIdentity = ExfeUtilities.clone(Exfee.invitations[n].identity);
      break;
    }
    M(), L();
  }, F = function(e) {
    Api.request("getCross", {
      resources: {
        cross_id: e
      }
    }, function(e) {
      H(e.cross, !1);
    }, function() {
      V.emit("app:cross:forbidden", e);
    });
  }, R = function() {
    window.Cross = ExfeUtilities.clone(n), window.Exfee = ExfeUtilities.clone(a);
  }, j = function() {
    readOnly = !1, R(), m(), p(), f(), g(), M(), X();
  }, q = function() {
    t(".cross-opts .saving").show();
    var e = ExfeUtilities.clone(Cross);
    e.exfee = ExfeUtilities.clone(Exfee), e.by_identity = {
      id: curIdentity.id
    }, Api.request("gather", {
      type: "POST",
      data: JSON.stringify(e)
    }, function(e) {
      t(".cross-opts .saving").hide(), document.location = "/#!" + e.cross.id;
    }, function() {
      t(".cross-opts .saving").hide(), t("#cross-form-gather").prop("disabled", !1).toggleClass("disabled", !1);
    });
  }, U = function() {
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
      t(".cross-opts .saving").hide(), V.emit("app:cross:edited");
    }, function(e) {
      t(".cross-opts .saving").hide();
      var i = !e.meta || 401 !== e.meta.code && 403 !== e.meta.code ? "" : "no_permission";
      V.emit("app:cross:edited", {
        error: i
      });
    });
  }, B = function() {
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
  }, W = function() {
    if (Cross.id) {
      var e = B();
      G !== e && (U(), G = e);
    }
  }, X = function(e) {
    e ? (t(".cross-form").slideUp(233), t(".cross-edit").show(233)) : (b(), t(".cross-form").slideDown(233), 
    t(".cross-edit").hide(233), t("#gather-title").select(), t("#gather-title").focus());
  };
  window.Store = e("store"), window.Api = e("api"), window.webkitNotifications && window.webkitNotifications.requestPermission(function() {});
  var Y = e("humantime");
  window.curIdentity = null, window.readOnly = !1;
  var V = e("bus"), G = "";
  V.on("xapp:cross:main", function() {
    var t = Store.get("authorization");
    window.User = t ? Store.get("user") : null, User && (Api.setToken(t.token), curIdentity = ExfeUtilities.clone(User.identities[0])), 
    R(), o(), d(), c(), Editing = "", h(), Marked = e("marked"), window.ExfeePanel = e("exfeepanel"), 
    window.showtimeTimer = setInterval(_, 50), window.convTimer = null;
  }), V.on("xapp:cross", function(e, t, i, n, a, s) {
    if (e > 0) F(e); else if (null === e) switch (t && (curIdentity = t, Api.setToken(a)), 
    H(i, n), s) {
     case "accept":
      ExfeeWidget.rsvpMe("ACCEPTED"), P();
      break;

     case "decline":
      ExfeeWidget.rsvpMe("DECLINED"), P();
    } else j();
  }), V.on("app:user:signin:after", function() {
    if (window.Cross && !window.Cross.id) {
      var e = Store.get("authorization");
      window.User = e ? Store.get("user") : null, User && (Api.setToken(e.token), curIdentity = ExfeUtilities.clone(User.identities[0]), 
      b(), g());
    }
  }), V.on("xapp:cross:end", function() {
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
    var i, n, a, s, r;
    return a = 2147483648 & e, s = 2147483648 & t, i = 1073741824 & e, n = 1073741824 & t, 
    r = (1073741823 & e) + (1073741823 & t), i & n ? 2147483648 ^ r ^ a ^ s : i | n ? 1073741824 & r ? 3221225472 ^ r ^ a ^ s : 1073741824 ^ r ^ a ^ s : r ^ a ^ s;
  }
  function n(e, t, i) {
    return e & t | ~e & i;
  }
  function a(e, t, i) {
    return e & i | t & ~i;
  }
  function s(e, t, i) {
    return e ^ t ^ i;
  }
  function r(e, t, i) {
    return t ^ (e | ~i);
  }
  function o(e, a, s, r, o, l, d) {
    return e = i(e, i(i(n(a, s, r), o), d)), i(t(e, l), a);
  }
  function l(e, n, s, r, o, l, d) {
    return e = i(e, i(i(a(n, s, r), o), d)), i(t(e, l), n);
  }
  function d(e, n, a, r, o, l, d) {
    return e = i(e, i(i(s(n, a, r), o), d)), i(t(e, l), n);
  }
  function c(e, n, a, s, o, l, d) {
    return e = i(e, i(i(r(n, a, s), o), d)), i(t(e, l), n);
  }
  function u(e) {
    for (var t, i = e.length, n = i + 8, a = (n - n % 64) / 64, s = 16 * (a + 1), r = Array(s - 1), o = 0, l = 0; i > l; ) t = (l - l % 4) / 4, 
    o = 8 * (l % 4), r[t] = r[t] | e.charCodeAt(l) << o, l++;
    return t = (l - l % 4) / 4, o = 8 * (l % 4), r[t] = r[t] | 128 << o, r[s - 2] = i << 3, 
    r[s - 1] = i >>> 29, r;
  }
  function h(e) {
    var t, i, n = "", a = "";
    for (i = 0; 3 >= i; i++) t = 255 & e >>> 8 * i, a = "0" + t.toString(16), n += a.substr(a.length - 2, 2);
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
  var f, m, g, v, y, b, x, w, _, k = [], C = 7, E = 12, T = 17, $ = 22, S = 5, I = 9, N = 14, D = 20, P = 4, A = 11, M = 16, O = 23, z = 6, L = 10, H = 15, F = 21;
  for (e = p(e), k = u(e), b = 1732584193, x = 4023233417, w = 2562383102, _ = 271733878, 
  f = 0; k.length > f; f += 16) m = b, g = x, v = w, y = _, b = o(b, x, w, _, k[f + 0], C, 3614090360), 
  _ = o(_, b, x, w, k[f + 1], E, 3905402710), w = o(w, _, b, x, k[f + 2], T, 606105819), 
  x = o(x, w, _, b, k[f + 3], $, 3250441966), b = o(b, x, w, _, k[f + 4], C, 4118548399), 
  _ = o(_, b, x, w, k[f + 5], E, 1200080426), w = o(w, _, b, x, k[f + 6], T, 2821735955), 
  x = o(x, w, _, b, k[f + 7], $, 4249261313), b = o(b, x, w, _, k[f + 8], C, 1770035416), 
  _ = o(_, b, x, w, k[f + 9], E, 2336552879), w = o(w, _, b, x, k[f + 10], T, 4294925233), 
  x = o(x, w, _, b, k[f + 11], $, 2304563134), b = o(b, x, w, _, k[f + 12], C, 1804603682), 
  _ = o(_, b, x, w, k[f + 13], E, 4254626195), w = o(w, _, b, x, k[f + 14], T, 2792965006), 
  x = o(x, w, _, b, k[f + 15], $, 1236535329), b = l(b, x, w, _, k[f + 1], S, 4129170786), 
  _ = l(_, b, x, w, k[f + 6], I, 3225465664), w = l(w, _, b, x, k[f + 11], N, 643717713), 
  x = l(x, w, _, b, k[f + 0], D, 3921069994), b = l(b, x, w, _, k[f + 5], S, 3593408605), 
  _ = l(_, b, x, w, k[f + 10], I, 38016083), w = l(w, _, b, x, k[f + 15], N, 3634488961), 
  x = l(x, w, _, b, k[f + 4], D, 3889429448), b = l(b, x, w, _, k[f + 9], S, 568446438), 
  _ = l(_, b, x, w, k[f + 14], I, 3275163606), w = l(w, _, b, x, k[f + 3], N, 4107603335), 
  x = l(x, w, _, b, k[f + 8], D, 1163531501), b = l(b, x, w, _, k[f + 13], S, 2850285829), 
  _ = l(_, b, x, w, k[f + 2], I, 4243563512), w = l(w, _, b, x, k[f + 7], N, 1735328473), 
  x = l(x, w, _, b, k[f + 12], D, 2368359562), b = d(b, x, w, _, k[f + 5], P, 4294588738), 
  _ = d(_, b, x, w, k[f + 8], A, 2272392833), w = d(w, _, b, x, k[f + 11], M, 1839030562), 
  x = d(x, w, _, b, k[f + 14], O, 4259657740), b = d(b, x, w, _, k[f + 1], P, 2763975236), 
  _ = d(_, b, x, w, k[f + 4], A, 1272893353), w = d(w, _, b, x, k[f + 7], M, 4139469664), 
  x = d(x, w, _, b, k[f + 10], O, 3200236656), b = d(b, x, w, _, k[f + 13], P, 681279174), 
  _ = d(_, b, x, w, k[f + 0], A, 3936430074), w = d(w, _, b, x, k[f + 3], M, 3572445317), 
  x = d(x, w, _, b, k[f + 6], O, 76029189), b = d(b, x, w, _, k[f + 9], P, 3654602809), 
  _ = d(_, b, x, w, k[f + 12], A, 3873151461), w = d(w, _, b, x, k[f + 15], M, 530742520), 
  x = d(x, w, _, b, k[f + 2], O, 3299628645), b = c(b, x, w, _, k[f + 0], z, 4096336452), 
  _ = c(_, b, x, w, k[f + 7], L, 1126891415), w = c(w, _, b, x, k[f + 14], H, 2878612391), 
  x = c(x, w, _, b, k[f + 5], F, 4237533241), b = c(b, x, w, _, k[f + 12], z, 1700485571), 
  _ = c(_, b, x, w, k[f + 3], L, 2399980690), w = c(w, _, b, x, k[f + 10], H, 4293915773), 
  x = c(x, w, _, b, k[f + 1], F, 2240044497), b = c(b, x, w, _, k[f + 8], z, 1873313359), 
  _ = c(_, b, x, w, k[f + 15], L, 4264355552), w = c(w, _, b, x, k[f + 6], H, 2734768916), 
  x = c(x, w, _, b, k[f + 13], F, 1309151649), b = c(b, x, w, _, k[f + 4], z, 4149444226), 
  _ = c(_, b, x, w, k[f + 11], L, 3174756917), w = c(w, _, b, x, k[f + 2], H, 718787259), 
  x = c(x, w, _, b, k[f + 9], F, 3951481745), b = i(b, m), x = i(x, g), w = i(w, v), 
  _ = i(_, y);
  var R = h(b) + h(x) + h(w) + h(_);
  return R.toLowerCase();
};

define("lightsaber", function(e, t, i) {
  "use strict";
  function n() {
    var e = new a();
    return g(e, b.prototype), e.request = new s(), e.response = new r(), e.init(), e;
  }
  function a() {}
  function s(e) {
    this.enableFullUrlPath = !!e, this.session = {}, this.path = "/", this.method = "GET", 
    this.updateUrl();
  }
  function r(e, t) {
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
  function d(e, t, i) {
    t = t || {}, this.name = e, this.root = t.root, this.engine = t.engine, this.ext = f(e), 
    this.timestamp = i || "", this.path = this.lookup(e);
  }
  function c(e) {
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
  function p(e, t, i, n, a) {
    return x.get(t, function(t) {
      var s, r = t;
      "html" !== a && (s = e.compile(t), r = s(i)), n(r);
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
    return e instanceof RegExp ? e : ($(e) && (e = "(" + e.join("|") + ")"), e = e.concat(n ? "" : "/?").replace(/\/\(/g, "(?:/").replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function(e, i, n, a, s, r, o) {
      return t.push({
        name: a,
        optional: !!r
      }), i = i || "", "" + (r ? "" : i) + "(?:" + (r ? i : "") + (n || "") + (s || n && "([^/.]+?)" || "([^/]+?)") + ")" + (r || "") + (o ? "(/*)?" : "");
    }).replace(/([\/.])/g, "\\$1").replace(/\*/g, "(.*)"), RegExp("^" + e + "$", i ? "" : "i"));
  }
  var y, b = e("emitter"), x = e("jquery") || e("zepto"), w = x.proxy, _ = window.location, k = window.history, C = "/", E = !1;
  x(window).on("load", function() {
    E = !0, setTimeout(function() {
      E = !1;
    }, 0);
  }), t = i.exports = n;
  var T;
  t.version = "0.0.5", T = a.prototype, T.historySupport = y = null !== (null !== k ? k.pushState : void 0), 
  x.browser && x.browser.opera && (T.historySupport = y = !1), T.init = function() {
    this.route = C, this.stack = [], this.cache = {}, this.settings = {}, this.engines = {}, 
    this.viewCallbacks = [], this.defaultConfiguration();
  }, T.defaultConfiguration = function() {
    this.set("env", "production"), this.enable("dispatch"), this.use(c(this)), this._usedRouter = !1, 
    this._router = new o(this), this.routes = this._router.map, this._router.caseSensitive = this.enabled("case sensitive routing"), 
    this._router.strict = this.enabled("strict routing"), this.locals = m(this), this.locals.settings = this.settings, 
    this.configure("development", function() {
      this.set("env", "development");
    }), this.configure("production", function() {
      this.enable("view cache");
    });
  }, T.use = function(e, t) {
    return "string" != typeof e && (t = e, e = C), C !== e && C === e[e.length - 1] && (e = e.slice(0, -1)), 
    this.stack.push({
      route: e,
      handle: t
    }), this;
  }, T.engine = function(e, t) {
    if ("function" != typeof t) throw Error("callback function required");
    return "." !== e[0] && (e = "." + e), this.engines[e] = t, this;
  }, T.set = function(e, t) {
    return 1 !== arguments.length ? (this.settings[e] = t, this) : this.settings.hasOwnProperty(e) ? this.settings[e] : void 0;
  }, T.enabled = function(e) {
    return !!this.set(e);
  }, T.disabled = function(e) {
    return !this.set(e);
  }, T.enable = function(e) {
    return this.set(e, !0);
  }, T.disable = function(e) {
    return this.set(e, !1);
  }, T.configure = function(e, t) {
    var i = "all", n = [].slice.call(arguments);
    return t = n.pop(), n.length && (i = n), ("all" === i || ~h(i, this.settings.env)) && t.call(this), 
    this;
  }, T.render = function(e, t, i) {
    var n, a = {}, s = this.cache;
    if (this.engine, "function" == typeof t && (i = t, t = {}), g(a, this.locals), t.locals && g(a, t.locals), 
    g(a, t), a.cache = null === a.cache ? this.enabled("view cache") : a.cache, a.cache && (n = s[e]), 
    !n) {
      if (n = new d(e, {
        engine: this.set("view engine"),
        root: this.set("views")
      }, this.set("timestamp")), !n.path) {
        var r = Error('Failed to lookup view "' + e + '"');
        return r.view = n, i(r);
      }
      a.cache && (s[e] = n);
    }
    try {
      n.render(a, i);
    } catch (r) {
      i(r);
    }
  }, T.path = function() {
    return this.route;
  }, T.param = function(e, t) {
    var i, n = [].slice.call(arguments, 1), a = 0;
    if ($(e)) for (i = e.length; i > a; ++a) for (var s = 0, r = n.length; r > s; ++s) this.param(e[a], n[s]); else if ("function" == typeof e) this._router.param(e); else for (":" === e[0] && (e = e.substr(1)), 
    i = n.length; i > a; ++a) this._router.param(e, t);
    return this;
  }, T.initRouter = function() {
    this._usedRouter === !1 && (this._usedRouter = !0, this.use(this._router.middleware));
  }, T.get = function() {
    var e = [].slice.call(arguments);
    return this.initRouter(), this._router.route.apply(this._router, e);
  }, T.handle = function(e, t) {
    function i(o) {
      var l, d = n[r++];
      if (s && (e.url = e.url.substr(1), s = !1), e.url = a + e.url, d) try {
        if (l = e.url, 0 !== l.indexOf(d.route)) return i(o);
        var c = d.handle.length;
        a = d.route, e.url = e.url.substr(a.length), "/" !== e.url[0] && (e.url = "/" + e.url, 
        s = !0), o ? 4 === c ? d.handle(o, e, t, i) : i(o) : 4 > c ? d.handle(e, t, i) : i();
      } catch (u) {
        i(u);
      }
    }
    var n = this.stack, a = "", s = !1, r = 0;
    i();
  }, T.run = function(e) {
    this.emit("launch"), e = e || {};
    var t = this.request, i = this.response;
    this.running || (this.running = !0, !1 === e.dispatch && this.disable("dispatch"), 
    !1 !== e.popstate && (this.historySupport ? x(window).on("popstate", w(this.change, this)) : x(window).on("hashchange", w(this.change, this))), 
    this.disabled("dispatch") || (this.handle(t, i), this.emit("launched")));
  }, T.change = function(e) {
    if (E) return E = !1;
    var t = this, i = t.request, n = t.response, a = i.url;
    return i.updateUrl(), "/" === a || a !== i.url ? (t.handle(i, n), e.stopPropagation(), 
    e.preventDefault(), !1) : void 0;
  }, T.error = function(e, t) {
    var i = Error(t);
    return i.status = e, i;
  }, T = s.prototype, T.updateUrl = function() {
    this.host = _.hostname, this.port = _.port || 80, this.fullpath = _.pathname, this.enableFullUrlPath && (this.path = this.fullpath), 
    this.hash = decodeURIComponent(_.hash), this.querystring = decodeURIComponent(_.search), 
    this.url = this.path + this.querystring + this.hash;
  }, T.param = function(e, t) {
    var i = this.params || {}, n = this.query || {};
    return null != i[e] && i.hasOwnProperty(e) ? i[e] : null != n[e] ? n[e] : t;
  }, T.getPath = function() {
    return this.path;
  }, T.getHost = function() {
    return this.host;
  }, T = r.prototype, T.location = function(e) {
    window.setTimeout(function() {
      _.href = e;
    }, 16);
  }, T.redirect = function(e) {
    var t, i;
    return arguments.length, e = arguments[0], "back" === e || "forward" === e ? (k[e](), 
    void 0) : y ? (t = arguments[1], i = arguments[2] || {}, this.path = e, this.title = t || "EXFE.COM", 
    document.title = this.title, this.state = i, this.state.id = u(), this.pushState(), 
    x(window).triggerHandler("popstate"), void 0) : (this.location(e), void 0);
  }, T.save = function() {
    k.replaceState(this.state, this.title, this.path);
  }, T.pushState = function() {
    k.pushState(this.state, this.title, this.path);
  }, T.render = function(e, t, i) {
    var n = this, t = t || {}, a = this.app;
    "function" == typeof t && (i = t, t = {}), t.locals = n.locals, a.render(e, t, i);
  }, T = o.prototype, T.param = function(e, t) {
    if ("function" == typeof e) return this._params.push(e), void 0;
    var i, n, a = this._params, s = a.length;
    for (n = 0; s > n; ++n) (i = a[n](e, t)) && (t = i);
    if ("function" != typeof t) throw Error("invalid param() call for " + e + ", got " + t);
    return (this.params[e] = this.params[e] || []).push(t), this;
  }, T._dispatch = function(e, t, i) {
    var n = this.params, a = this;
    (function s(r, o) {
      function l(t) {
        s(e._route_index + 1, t);
      }
      function d(t) {
        v = 0, g = m[r++], p = g && e.params[g.name], h = g && n[g.name];
        try {
          "route" === t ? l() : t ? (r = 0, u(t)) : h && void 0 !== p ? c() : g ? d() : (r = 0, 
          u());
        } catch (t) {
          d(t);
        }
      }
      function c(i) {
        var n = h[v++];
        return i || !n ? d(i) : (n(e, t, c, p, g.name), void 0);
      }
      function u(i) {
        var n = f.callbacks[r++];
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
      return e.route = f = a.matchRequest(e, r), f ? (e.params = f.params, m = f.keys, 
      r = 0, d(o), void 0) : i(o);
    })(0);
  }, T.matchRequest = function(e, t) {
    var i, n = e.url, a = this.map, s = a.length;
    for (t = t || 0; s > t; ++t) if (i = a[t], i.match(n)) return e._route_index = t, 
    i;
  }, T.route = function(e) {
    e || Error("Router#get() requires a path");
    var t = [].slice.call(arguments, 1), i = new l(e, t, {
      sensitive: this.caseSensitive,
      strict: this.strict
    });
    return (this.map = this.map || []).push(i), this;
  }, T = l.prototype, T.match = function(e) {
    this.regexp.lastIndex = 0;
    var t, i, n, a, s = this.keys, r = this.params = [], o = this.regexp.exec(e);
    if (!o) return !1;
    for (t = 1, i = o.length; i > t; ++t) n = s[t - 1], a = "string" == typeof o[t] ? decodeURIComponent(o[t]) : o[t], 
    n ? r[n.name] = a : r.push(a);
    return !0;
  }, T = d.prototype, T.lookup = function(e) {
    return this.root + "/" + e + "?t=" + this.timestamp;
  }, T.render = function(e, t) {
    return p(this.engine, this.path, e, t, this.ext);
  }, u.id = 0;
  var $ = Array.isArray;
  $ || ($ = function(e) {
    return e instanceof Array;
  });
}), define("middleware", function(e, t, i) {
  "use strict";
  function n() {
    var e = document.getElementsByTagName("head")[0], t = document.getElementsByName("authorization")[0], i = null;
    return t && (i = JSON.parse(t.content), e.removeChild(t)), i;
  }
  var a = e("bus"), s = e("store"), r = e("jquery"), o = i.exports = {};
  o.basicAuth = function(e, t, i) {
    var a = e.session, r = s.get("authorization"), o = s.get("user"), l = n();
    r && (!l || l && !l.authorization) ? (a.authorization = r, a.user = o) : !r && l && l.authorization && l.data && !l.event ? (s.set("oauth", a.oauth = {
      identity: l.data.identity,
      following: "twitter" === l.data.identity.provider ? !!l.data.twitter_following : !1,
      identity_status: l.data.identity_status
    }), delete a.user, s.remove("user"), s.set("authorization", a.authorization = l.authorization)) : r && l && l.authorization && l.data && !l.event && (r.user_id === l.authorization.user_id && r.token !== l.authorization.token ? (r.token = l.authorization.token, 
    s.set("authorization", a.authorization = r)) : r.user_id !== l.authorization.user_id && r.token !== l.authorization.token && l.identity && (s.set("oauth", a.oauth = {
      identity: l.data.identity,
      following: "twitter" === l.data.identity.provider ? !!l.data.twitter_following : !1,
      identity_status: l.data.identity_status
    }), delete a.user, s.remove("user"), s.set("authorization", a.authorization = l.authorization))), 
    l && (l.event && (a.event = JSON.parse(l.event), a.event.data = l.data), l.verification_token && (a.verification_token = l.verification_token), 
    l.refere && l.refere !== window.location.protocol + "//" + window.location.hostname + "/" && t.redirect(l.refere || "/")), 
    i();
  }, o.errorHandler = function(e, t) {
    var i = /^\/404/;
    if (i.exec(window.location.pathname)) {
      a.emit("app:page:home", !1, !0);
      var n = s.get("authorization");
      if (a.emit("app:page:usermenu", !!n), n) {
        var r = s.get("user");
        a.emit("app:usermenu:updatenormal", r), a.emit("app:usermenu:crosslist", n.token, n.user_id);
      }
    } else t.location("/404");
  }, o.cleanupAppTmp = function(e, t, i) {
    var n = r("#app-tmp"), a = n.find("[data-widget-id]");
    a.trigger("destory.widget"), i();
  }, o.fixedFaceBookURL = function(e, t, i) {
    "#_=_" === window.location.hash && (window.location.hash = "", e.updateUrl(), r.browser.mozilla) || i();
  };
}), define("routes", function(e, t, i) {
  "use strict";
  function n(e, t) {
    function i(e, t) {
      var i = o.printExtUserName(e.identities[0]);
      t.redirect("/#" + i.replace(/ /g, ""));
    }
    var n = e.session, a = l.get("user");
    if (a) return i(a, t), void 0;
    var s = n.authorization;
    r.emit("app:user:signin", s.token, s.user_id, !0);
  }
  var a = e("rex"), s = e("api"), r = e("bus"), o = e("util"), l = e("store");
  e("user");
  var d = i.exports = {};
  d.index = function(e, t) {
    return e.session.authorization ? (n(e, t), void 0) : (r.emit("app:page:home", !0), 
    t.render("home.html", function(t) {
      $("#app-main").append(t), $.ajax({
        dataType: "script",
        cache: !0,
        url: "/static/js/newhome/0.0.1/newhome.min.js?t=" + e.app.set("timestamp")
      });
    }), void 0);
  }, d.gather = function(e, t) {
    var i = e.session;
    if (r.emit("app:page:home", !1), !i.initMenuBar) {
      var n = i.authorization, a = i.user;
      r.emit("app:page:usermenu", !!n), n && (i.initMenuBar = !0, r.emit("app:usermenu:updatenormal", a), 
      r.emit("app:usermenu:crosslist", n.token, n.user_id));
    }
    t.render("x.html", function(e) {
      $("#app-main").append(e), r.emit("xapp:cross:main"), r.emit("xapp:cross", 0);
    });
  }, d.resolveToken = function(e, t, i) {
    e.origin = "resolveToken";
    var n = e.params[0];
    r.emit("app:page:home", !1), r.emit("app:page:usermenu", !0), n ? i() : t.redirect("/#invalid/token=" + n);
  }, d.inspectResolveToken = function(e, t, i, n, a) {
    var s = e.session, d = s.user, c = s.authorization;
    s.resolveData = n;
    var u, h = n.token, p = n.user_id, f = n.user_name, m = null, g = n.token_type, v = n.action;
    !m && (c && c.user_id === p || !c && "VERIFY" === g && "VERIFIED" === v) ? (c = {
      token: h,
      user_id: p
    }, l.set("authorization", s.authorization = c), s.auto_sign = "INPUT_NEW_PASSWORD" !== v) : s.browsing_authorization = u = n, 
    r.emit("app:api:getuser", h, p, function(e) {
      var t = e.user;
      if (s.resolveData.setup = "INPUT_NEW_PASSWORD" === v && "VERIFY" === g && t.password === !1, 
      u) {
        s.browsing_user = t;
        var n, h = o.printExtUserName(t.identities[0]);
        n = c ? "/#" + h + "/token=" + a : "/#" + h, r.emit("app:usermenu:updatebrowsing", {
          normal: d,
          browsing: t,
          action: v,
          setup: "INPUT_NEW_PASSWORD" === v && "VERIFY" === g && t.password === !1,
          originToken: a,
          tokenType: "user",
          page: "resolve",
          readOnly: !0,
          user_name: f || t.name,
          mergeable_user: m,
          forward: n
        }, "browsing_identity");
      } else l.set("user", d = s.user = e.user), r.emit("app:usermenu:updatenormal", d), 
      r.emit("app:usermenu:crosslist", c.token, c.user_id);
      i();
    });
  }, d.resolveRequest = function(e, t, i) {
    var n = e.session, a = e.params[0];
    n.originToken = a, s.request("resolveToken", {
      type: "POST",
      data: {
        token: a
      }
    }, function(n) {
      d.inspectResolveToken(e, t, i, n, a);
    }, function() {
      t.redirect("/#invalid/token=" + a);
    });
  }, d.resolveShow = function(e, t) {
    var i = e.session, n = i.auto_sign, s = i.originToken, o = i.user, l = i.authorization, d = i.browsing_authorization, c = i.browsing_user, u = i.resolveData, h = u.identity_id, p = u.token_type, f = null, m = u.action, g = "identity_verified.html";
    if (f) return t.render(g, function(e) {
      var t = $("#app-main");
      t.append(e);
      var i = $('<div id="js-dialog-merge" data-destory="true" data-widget="dialog" data-dialog-type="mergeidentity">');
      i.data("source", {
        merged_identity: a.find(c.identities, function(e) {
          return e.id === h ? !0 : void 0;
        }),
        browsing_token: s,
        mergeable_user: f
      }), i.appendTo($("#app-tmp")), i.trigger("click.dialog.data-api"), $(".modal-mi").css("top", 230);
    }), void 0;
    if (n && l && !d) return delete i.auto_sign, t.render(g, function(e) {
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
      g = "forgot_password.html", t.render(g, function(e) {
        if ($("#app-main").append(e), l && !d) {
          var t = a.find(o.identities, function(e) {
            return e.id === h ? !0 : void 0;
          });
          "VERIFY" === p ? (v = $('<div class="merge set-up" data-destory="true" data-user-action="setup" data-widget="dialog" data-dialog-type="setup_email">'), 
          v.data("source", {
            browsing_user: o,
            identity: t,
            originToken: s,
            user_name: u.user_name,
            tokenType: "user"
          })) : "SET_PASSWORD" === p && (v = $('<div class="setpassword" data-destory="true" data-widget="dialog" data-dialog-type="setpassword">'), 
          v.data("source", {
            user: o,
            token: u.setup ? l.token : s,
            setup: u.setup
          })), v.appendTo($("#app-tmp")), v.trigger("click.dialog.data-api");
        } else "VERIFY" === p ? (r.once("app:user:signin:after", function() {
          var e = $('<div class="addidentity" data-destory="true" data-widget="dialog" data-dialog-type="addIdentityAfterSignIn">');
          e.data("source", {
            identity: c.identities[0]
          }), e.appendTo($("#app-tmp")), e.trigger("click.dialog.data-api");
        }), $("#app-user-menu").find(".set-up").trigger("click.dialog.data-api")) : (v = $('<div class="setpassword" data-destory="true" data-widget="dialog" data-dialog-type="setpassword">'), 
        v.data("source", {
          user: c,
          token: u.setup ? d.token : s,
          setup: u.setup
        }), v.appendTo($("#app-tmp")), v.trigger("click.dialog.data-api"));
        $(".modal-su, .modal-sp, .modal-bi").css("top", 230);
      });
    }
    delete i.browsing_authorization, delete i.resolveData, delete i.originToken;
  }, d.cross = function(e, t) {
    var i = e.session, n = i.authorization, a = i.user;
    if (!n) return r.emit("app:page:home", !1), r.emit("app:page:usermenu", !1), r.emit("app:cross:forbidden", e.params[0], null), 
    void 0;
    r.emit("app:page:home", !1), r.emit("app:page:usermenu", !0), i.initMenuBar || (r.emit("app:usermenu:updatenormal", a), 
    r.emit("app:usermenu:crosslist", n.token, n.user_id));
    var s = e.params[0];
    t.render("x.html", function(e) {
      $("#app-main").append(e), r.emit("xapp:cross:main"), r.emit("xapp:cross", s);
    });
  }, r.on("app:cross:forbidden", function(e, t) {
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
  }), d.crossInvitation = function(e, t) {
    var i = e.session, n = i.authorization, l = i.user, d = l && l.id, c = e.params[0], u = e.params[1];
    r.emit("app:page:home", !1), r.emit("app:page:usermenu", !!n), n && (r.emit("app:usermenu:updatenormal", l), 
    r.emit("app:usermenu:crosslist", n.token, n.user_id)), s.request("getInvitationByToken", {
      type: "POST",
      resources: {
        cross_id: c
      },
      data: {
        token: u
      }
    }, function(e) {
      var i, s = e.invitation, u = s.identity, h = s.by_identity;
      return d && (i = a.find(l.identities, function(e) {
        return e.connected_user_id === u.connected_user_id && e.id === u.id ? !0 : void 0;
      })) ? (t.redirect("/#!" + c), void 0) : "email" === u.provider ? (r.emit("app:cross:forbidden", c, u), 
      void 0) : (t.render("invite.html", function(e) {
        $("#app-main").append(e), n ? ($(".please-access").removeClass("hide"), $(".form-horizontal").addClass("fh-left"), 
        $(".details").removeClass("hide"), $(".details .avatar img").attr("src", l.avatar_filename), 
        $(".details .identity-name").text(l.name)) : $(".please-signin").removeClass("hide"), 
        $(".invite-to").find("img").attr("src", u.avatar_filename).parent().next().text(o.printExtUserName(u)), 
        $(".invite-from").find("img").attr("src", h.avatar_filename).parent().next().text(o.printExtUserName(h));
        var t = $(".x-invite").find(".redirecting"), i = t.next(), a = !1;
        $(".xbtn-authenticate").on("click", function(e) {
          if (e.stopPropagation(), e.preventDefault(), !a) {
            var n = $(this).data("oauth");
            $.ajax({
              url: "/OAuth/Authenticate?provider=" + n,
              type: "POST",
              dataType: "JSON",
              data: {
                refere: window.location.href
              },
              beforeSend: function() {
                a = !0, i.addClass("hide"), t.removeClass("hide");
              },
              success: function(e) {
                a = !1;
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
  var c = function(e, t, i, n, a, o, d, c, u) {
    var h = t.session, p = h.authorization, f = h.user;
    s.request("getCrossByInvitationToken", {
      type: "POST",
      params: n,
      data: a
    }, function(t) {
      function i() {
        e.render("x.html", function(e) {
          if ($("#app-main").empty().append(e), r.emit("xapp:cross:main"), r.emit("xapp:cross", null, a, p, g, d || c, u), 
          "mute" === u) {
            var t = $('<div id="js-dialog-unsubscribe" data-destory="true" data-widget="dialog" data-dialog-type="unsubscribe">');
            t.data("source", p), t.appendTo($("#app-tmp")), t.trigger("click.dialog.data-api");
          }
        });
      }
      var n = t.authorization, a = t.browsing_identity, s = t.action, p = t.cross, m = t.cross_access_token, g = t.read_only;
      if (!1 === g && m && (o || (o = {}), o[c] = m, l.set("cats", o)), r.emit("app:page:home", !1), 
      r.emit("app:page:usermenu", !0), n || !a) {
        if (!h.initMenuBar) {
          if (n) return r.once("app:user:signin:after", function() {
            e.redirect("/#!" + p.id);
          }), r.emit("app:user:signin", n.token, n.user_id), void 0;
          e.redirect("/#!" + p.id);
        }
      } else a && r.emit("app:usermenu:updatebrowsing", {
        normal: f,
        browsing: {
          identities: [ a ],
          name: a.name
        },
        action: s,
        setup: "setup" === s,
        originToken: c,
        tokenType: "cross",
        page: "cross",
        readOnly: g
      }, "browsing_identity");
      i();
    }, function(t) {
      var i = t && t.meta && t.meta.code, n = !!p;
      403 === i ? (r.emit("app:page:home", !1), r.emit("app:page:usermenu", n), n && (r.emit("app:usermenu:updatenormal", f), 
      r.emit("app:usermenu:crosslist", p.token, p.user_id)), r.emit("app:cross:forbidden", null, null)) : 404 === i && e.location("/404");
    });
  };
  d.crossToken = function(e, t, i) {
    var n, a, s = e.session, r = s.authorization, o = r && r.token, d = e.params[0], u = e.params[1], h = l.get("cats"), p = {};
    o && (p.token = o), h && (n = h[d]), a = {
      invitation_token: d
    }, n && (a.cross_access_token = n), c(t, e, i, p, a, h, n, d, u);
  }, d.crossPhoneToken = function(e, t, i) {
    var n, a, s = e.session, r = s.authorization, o = r && r.token, d = e.params[0], u = e.params[1], h = e.params[2] || "", p = l.get("cats"), f = {};
    o && (f.token = o), p && (n = p[u]), a = {
      invitation_token: u,
      cross_id: d
    }, n && (a.cross_access_token = n), c(t, e, i, f, a, p, n, u, h);
  }, d.profile = function(e, t) {
    var i = e.session, n = i.authorization, a = i.user, s = i.browsing_authorization, d = i.browsing_user, c = i.action, u = i.oauth;
    r.emit("app:page:home", !1);
    var h = e.params[2], p = h && h.match(o.tokenRegExp), f = p && p[1];
    return f && !s ? (t.redirect("/#token=" + f), void 0) : (n || s ? (document.title = "EXFE - Profile", 
    r.emit("app:page:usermenu", !0), n && !s ? (r.emit("app:usermenu:updatenormal", a), 
    r.emit("app:usermenu:crosslist", n.token, n.user_id), t.render("profile.html", function(e) {
      $("#app-main").data("event", i.event), delete i.event, $("#app-main").append(e), 
      r.emit("app:profile:identities", a);
      var t = $.Deferred(), s = $.Event("click.dialog.data-api");
      t.resolve(n), r.emit("app:profile:show", t), u ? ("connected" !== u.identity_status && (s.following = u.following, 
      s.identity = u.identity, s.token = n.token, $('<div id="app-oauth-welcome" class="hide" data-widget="dialog" data-dialog-type="welcome" data-destory="true"></div>').appendTo($("#app-tmp")).trigger(s)), 
      l.remove("oauth"), delete i.oauth) : i.verification_token && ($('<div id="app-oauth-resetpassword" class="hide" data-widget="dialog" data-dialog-type="setpassword" data-destory="true"></div>').data("token", i.verification_token).appendTo($("#app-tmp")).trigger(s), 
      delete i.verification_token);
    })) : s ? ($(document.body).attr("data-browsing"), r.emit("app:usermenu:updatebrowsing", {
      normal: a,
      browsing: d,
      action: c,
      setup: "INPUT_NEW_PASSWORD" === c,
      originToken: i.originToken,
      tokenType: "user",
      page: "profile"
    }, "browsing_identity"), delete i.originToken, t.render("profile.html", function(e) {
      $("#app-main").append(e), r.emit("app:profile:identities", d);
      var t = $.Deferred();
      t.resolve(s), r.emit("app:profile:show", t);
    })) : t.redirect("/")) : t.redirect("/"), void 0);
  }, d.invalid = function(e, t) {
    var i = e.session, n = i.authorization, a = i.user;
    document.title = "EXFE - Invalid Link", r.emit("app:page:home", !1), n ? (r.emit("app:page:usermenu", !0), 
    r.emit("app:usermenu:updatenormal", a), r.emit("app:usermenu:crosslist", n.token, n.user_id)) : r.emit("app:page:usermenu", !1), 
    t.render("invalid.html", function(e) {
      $("#app-main").append(e);
    });
  }, d.signout = function() {
    l.remove("cats"), l.remove("user"), l.remove("authorization"), window.location.href = "/";
  }, d.refreshAuthUser = function(e, t, i) {
    var n = e.session, a = n.authorization;
    return a ? (r.emit("app:api:getuser", a.token, a.user_id, function(e) {
      var t = e.user;
      return l.set("user", n.user = t), 0 === t.identities.length ? (d.signout(), void 0) : (i(), 
      void 0);
    }, function(e) {
      var t = e && e.meta && e.meta.code;
      401 === t && (l.remove("user"), l.remove("authorization"), delete n.user, delete n.authorization), 
      i();
    }), void 0) : (i(), void 0);
  };
}), define(function(e) {
  "use strict";
  var t = window._ENV_, i = e("handlebars"), n = e("middleware"), a = e("routes"), s = e("lightsaber"), r = window.App = s(), o = e("widget");
  r.widgetCaches = o.caches, r.use(n.fixedFaceBookURL), r.use(n.basicAuth), r.use(n.cleanupAppTmp), 
  r.initRouter(), r.use(n.errorHandler), r.set("timestamp", t.timestamp), r.set("view cache", !0), 
  r.set("view engine", i), r.set("views", "/static/views"), r.get(/^\/+(?:\?)?(?:ipad)?#{0,}$/, a.index), 
  r.get(/^\/+\?t=([a-zA-Z0-9]{3,})$/, function(e, t, i) {
    var n = function() {
      var e = document.getElementsByTagName("head")[0], t = document.getElementsByName("sms-token")[0], i = null;
      return t && (i = JSON.parse(t.content), e.removeChild(t)), i;
    }, s = n(), r = e.params[0];
    s ? a.inspectResolveToken(e, t, i, s, r) : t.redirect("/#invalid/token=" + r);
  }, a.resolveShow), r.get(/^\/+(?:\?)?(?:ipad)?#gather\/?$/, a.refreshAuthUser, a.gather), 
  r.get(/^\/+(?:\?)?(?:ipad)?#token=([a-zA-Z0-9]{64})\/?$/, a.resolveToken, a.resolveRequest, a.resolveShow), 
  r.get(/^\/+(?:\?)?(?:ipad)?#!([1-9][0-9]*)\/?$/, a.refreshAuthUser, a.cross), r.get(/^\/+(?:\?)?(?:ipad)?#!([1-9][0-9]*)\/([a-zA-Z0-9]{3})\/?$/, a.refreshAuthUser, a.crossInvitation), 
  r.get(/^\/+(?:\?)?(?:ipad)?#!([1-9][0-9]*)\/([a-zA-Z0-9]{4})(?:\/(accept|mute|decline))?\/?$/, a.refreshAuthUser, a.crossPhoneToken), 
  r.get(/^\/+(?:\?)?(?:ipad)?#!token=([a-zA-Z0-9]{32})\/?$/, a.refreshAuthUser, a.crossToken), 
  r.get(/^\/+(?:\?)?(?:ipad)?#!token=([a-zA-Z0-9]{32})\/(accept|mute|decline)\/?$/, a.refreshAuthUser, a.crossToken), 
  r.get(/^\/+(?:\?)?(?:ipad)?#([^@\/\s\!=]+)?@([^@\/\s]+)(?:\/?(.*))\/?$/, a.refreshAuthUser, a.profile), 
  r.get(/^\/+(?:\?)?(?:ipad)?#(\+)(1\d{10}|86\d{11})(?:\/?(.*))\/?$/, a.refreshAuthUser, a.profile), 
  r.get(/^\/+(?:\?)?(?:ipad)?#invalid\/token=([a-zA-Z0-9]{64})\/?$/, a.invalid), r.get(/^\/+(?:\?)?(?:ipad)?#signout\/?$/, a.signout), 
  r.run();
});