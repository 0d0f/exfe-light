/*! EXFE.COM */
/*! desktop@2a.1 2013-05-15 07:05:53 */
(function(e) {
  "use strict";
  function t(e, t, n) {
    var s = arguments.length;
    1 === s ? (n = e, e = void 0) : 2 === s && (n = t, t = void 0);
    var o = new a(e, t, n);
    e ? r[e] = o : n.call(o, i, o.exports, o);
  }
  function i(e) {
    var t = r[e];
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
  var r = a.__cache = {};
})(this), define("class", function() {
  "use strict";
  function e(i) {
    return this instanceof e || !s(i) ? void 0 : t(i);
  }
  function t(t) {
    return t.extend = e.extend, t.implement = a, t;
  }
  function i(i, n, a, s, l) {
    function d() {
      i.apply(this, arguments), this.constructor === d && this.initialize && (this.initialize.apply(this, arguments), 
      this.initialized = !0);
    }
    return s = i.prototype, i !== e && r(d, i), d.Extends = i, l = o(s), n && r(l, n), 
    d.prototype = l, a && r(d, a), d.superclass = s, d.prototype.constructor = d, t(d);
  }
  function n() {}
  function a(e) {
    var t, i = this.prototype;
    for (t in e) i[t] = e[t];
  }
  function r(e, t) {
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
    var a, r, s;
    if (!i) return this;
    for (e = e.split(t), a = this.__callbacks || (this.__callbacks = {}); r = e.shift(); ) s = a[r] || (a[r] = []), 
    i.__context = n, s[s.length] = i;
    return this;
  }, e.prototype.once = function(e, i, n) {
    var a, r, s;
    if (!i) return this;
    for (e = e.split(t), a = this.__callbacks || (this.__callbacks = {}); r = e.shift(); ) s = a[r] || (a[r] = []), 
    i.__once = !0, i.__context = n, s[s.length] = i;
    return this;
  }, e.prototype.off = function(e, n, a) {
    var r, s, o, l, d;
    if (!(r = this.__callbacks)) return this;
    if (!(e || n || a)) return delete this.__callbacks, this;
    for (e = e.split(t) || i(r); s = e.shift(); ) if (o = r[s]) if (n || a) for (l = o.length - 1; l; --l) d = o[l], 
    n && d !== n || a && d.__context !== a || o.splice(l, 1); else delete r[s];
    return this;
  }, e.prototype.emit = function(e) {
    var i, n, a, r, s, o, l, d, c = [];
    if (!(i = this.__callbacks)) return this;
    for (e = e.split(t), s = arguments.length - 1; s; --s) c[s - 1] = arguments[s];
    for ((a = i.call) && (l = [ 0 ].concat(c)); n = e.shift(); ) {
      if (r = i[n]) for (s = 0, o = r.length; o > s; ++s) d = r[s], d.apply(d.__context || this, c), 
      d.__once && (r.splice(s--, 1), o--);
      if (r && a) for (l[0] = n, s = 0, o = a.length; o > s; ++s) d = a[s], d.apply(d.__context || this, l);
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
    var a, r;
    for (a in t) r = t[a], l(r) ? r = r.slice() : i(r) && (r = n(e[a] || {}, r)), e[a] = r;
    return e;
  }
  function a(e) {
    return e[2].toLowerCase() + e.substring(3);
  }
  var r = /^on[A-Z]/, s = Object.__proto__, o = Object.prototype.toString, l = Array.isArray;
  l || (l = function(e) {
    return "[object Array]" === o.call(e);
  });
  var d = e("class"), c = e("emitter");
  return d.create(c, {
    setOptions: function(e) {
      var i, s, o;
      if (this.hasOwnProperty("options") || (this.options = {}), o = this.options, this.constructor.superclass.options && n(o, this.constructor.superclass.options), 
      this.constructor.prototype.options && n(o, this.constructor.prototype.options), 
      e && e.options && n(o, e.options), this.on) for (i in o) s = o[i], t(s) && r.test(i) && (this.on(a(i), s), 
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
  var i = null, n = Array.prototype, a = Object.prototype, r = a.hasOwnProperty, s = a.toString, o = n.slice, l = n.indexof, d = n.lastIndexOf, c = n.reduce, u = n.reduceRight, h = {};
  h.each = function(e, t, i) {
    var n, a = e.length;
    if (a === +a) for (n = 0; a > n; ++n) n in e && t.call(i, e[n], n, e); else for (n in e) h.has(e, n) && t.call(i, n, e[n], e);
  }, h.map = function(e, t, i) {
    var n, a, r = [], s = e.length;
    if (s === +s) for (n = 0; s > n; ++n) n in e && (r[n] = t.call(i, e[n], n, e)); else {
      a = 0;
      for (n in e) h.has(e, n) && (r[a++] = t.call(i, n, e[n], e));
    }
    return r;
  }, h.some = function(e, t, i) {
    for (var n = 0, a = e.length; a > n; ++n) if (n in e && t.call(i, e[n], n, e)) return !0;
    return !1;
  }, h.every = function(e, t, i) {
    for (var n = 0, a = e.length; a > n; ++n) if (n in e && !t.call(i, e[n], n, e)) return !1;
    return !0;
  }, h.filter = h.select = function(e, t, i) {
    for (var n = [], a = 0, r = 0, s = e.length; s > a; ++a) if (a in e) {
      if (!t.call(i, e[a], a, e)) continue;
      n[r++] = e[a];
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
    var a = 0, r = e.length;
    if (3 > arguments.length) for (;;) {
      if (a in e) {
        i = e[a++];
        break;
      }
      if (++a >= r) throw new TypeError("Empty array");
    }
    for (;r > a; a++) a in e && (i = t.call(n, i, e[a], a, e));
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
    for (var n, a = 0, r = e.length; r > a; ++a) if (a in e && t.call(i, e[a], a, e)) {
      n = e[a];
      break;
    }
    return n;
  }, h.reject = function(e, t, i) {
    for (var n = [], a = 0, r = e.length; r > a; ++a) if (a in e) {
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
    return r.call(e, t);
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
      for (var e = 0, t = this._value, n = arguments.length, a = [ t ]; n > e; ++e) a[e + 1] = arguments[e];
      return t = i.apply(this._context, a), this._value = t, this._chained ? this : t;
    };
  }), e;
}), function(e, t) {
  function i(e) {
    var t = ft[e] = {};
    return J.each(e.split(tt), function(e, i) {
      t[i] = !0;
    }), t;
  }
  function n(e, i, n) {
    if (n === t && 1 === e.nodeType) {
      var a = "data-" + i.replace(gt, "-$1").toLowerCase();
      if (n = e.getAttribute(a), "string" == typeof n) {
        try {
          n = "true" === n ? !0 : "false" === n ? !1 : "null" === n ? null : +n + "" === n ? +n : mt.test(n) ? J.parseJSON(n) : n;
        } catch (r) {}
        J.data(e, i, n);
      } else n = t;
    }
    return n;
  }
  function a(e) {
    var t;
    for (t in e) if (("data" !== t || !J.isEmptyObject(e[t])) && "toJSON" !== t) return !1;
    return !0;
  }
  function r() {
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
  function d(e, t, i) {
    if (t = t || 0, J.isFunction(t)) return J.grep(e, function(e, n) {
      var a = !!t.call(e, n, e);
      return a === i;
    });
    if (t.nodeType) return J.grep(e, function(e) {
      return e === t === i;
    });
    if ("string" == typeof t) {
      var n = J.grep(e, function(e) {
        return 1 === e.nodeType;
      });
      if (Ot.test(t)) return J.filter(t, n, !i);
      t = J.filter(t, n);
    }
    return J.grep(e, function(e) {
      return J.inArray(e, t) >= 0 === i;
    });
  }
  function c(e) {
    var t = Rt.split("|"), i = e.createDocumentFragment();
    if (i.createElement) for (;t.length; ) i.createElement(t.pop());
    return i;
  }
  function u(e, t) {
    return e.getElementsByTagName(t)[0] || e.appendChild(e.ownerDocument.createElement(t));
  }
  function h(e, t) {
    if (1 === t.nodeType && J.hasData(e)) {
      var i, n, a, r = J._data(e), s = J._data(t, r), o = r.events;
      if (o) {
        delete s.handle, s.events = {};
        for (i in o) for (n = 0, a = o[i].length; a > n; n++) J.event.add(t, i, o[i][n]);
      }
      s.data && (s.data = J.extend({}, s.data));
    }
  }
  function p(e, t) {
    var i;
    1 === t.nodeType && (t.clearAttributes && t.clearAttributes(), t.mergeAttributes && t.mergeAttributes(e), 
    i = t.nodeName.toLowerCase(), "object" === i ? (t.parentNode && (t.outerHTML = e.outerHTML), 
    J.support.html5Clone && e.innerHTML && !J.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : "input" === i && Vt.test(e.type) ? (t.defaultChecked = t.checked = e.checked, 
    t.value !== e.value && (t.value = e.value)) : "option" === i ? t.selected = e.defaultSelected : "input" === i || "textarea" === i ? t.defaultValue = e.defaultValue : "script" === i && t.text !== e.text && (t.text = e.text), 
    t.removeAttribute(J.expando));
  }
  function f(e) {
    return e.getElementsByTagName !== t ? e.getElementsByTagName("*") : e.querySelectorAll !== t ? e.querySelectorAll("*") : [];
  }
  function m(e) {
    Vt.test(e.type) && (e.defaultChecked = e.checked);
  }
  function g(e, t) {
    if (t in e) return t;
    for (var i = t.charAt(0).toUpperCase() + t.slice(1), n = t, a = vi.length; a--; ) if (t = vi[a] + i, 
    t in e) return t;
    return n;
  }
  function v(e, t) {
    return e = t || e, "none" === J.css(e, "display") || !J.contains(e.ownerDocument, e);
  }
  function y(e, t) {
    for (var i, n, a = [], r = 0, s = e.length; s > r; r++) i = e[r], i.style && (a[r] = J._data(i, "olddisplay"), 
    t ? (a[r] || "none" !== i.style.display || (i.style.display = ""), "" === i.style.display && v(i) && (a[r] = J._data(i, "olddisplay", w(i.nodeName)))) : (n = ii(i, "display"), 
    a[r] || "none" === n || J._data(i, "olddisplay", n)));
    for (r = 0; s > r; r++) i = e[r], i.style && (t && "none" !== i.style.display && "" !== i.style.display || (i.style.display = t ? a[r] || "" : "none"));
    return e;
  }
  function _(e, t, i) {
    var n = ci.exec(t);
    return n ? Math.max(0, n[1] - (i || 0)) + (n[2] || "px") : t;
  }
  function b(e, t, i, n) {
    for (var a = i === (n ? "border" : "content") ? 4 : "width" === t ? 1 : 0, r = 0; 4 > a; a += 2) "margin" === i && (r += J.css(e, i + gi[a], !0)), 
    n ? ("content" === i && (r -= parseFloat(ii(e, "padding" + gi[a])) || 0), "margin" !== i && (r -= parseFloat(ii(e, "border" + gi[a] + "Width")) || 0)) : (r += parseFloat(ii(e, "padding" + gi[a])) || 0, 
    "padding" !== i && (r += parseFloat(ii(e, "border" + gi[a] + "Width")) || 0));
    return r;
  }
  function x(e, t, i) {
    var n = "width" === t ? e.offsetWidth : e.offsetHeight, a = !0, r = J.support.boxSizing && "border-box" === J.css(e, "boxSizing");
    if (0 >= n || null == n) {
      if (n = ii(e, t), (0 > n || null == n) && (n = e.style[t]), ui.test(n)) return n;
      a = r && (J.support.boxSizingReliable || n === e.style[t]), n = parseFloat(n) || 0;
    }
    return n + b(e, t, i || (r ? "border" : "content"), a) + "px";
  }
  function w(e) {
    if (pi[e]) return pi[e];
    var t = J("<" + e + ">").appendTo(j.body), i = t.css("display");
    return t.remove(), ("none" === i || "" === i) && (ni = j.body.appendChild(ni || J.extend(j.createElement("iframe"), {
      frameBorder: 0,
      width: 0,
      height: 0
    })), ai && ni.createElement || (ai = (ni.contentWindow || ni.contentDocument).document, 
    ai.write("<!doctype html><html><body>"), ai.close()), t = ai.body.appendChild(ai.createElement(e)), 
    i = ii(t, "display"), j.body.removeChild(ni)), pi[e] = i, i;
  }
  function k(e, t, i, n) {
    var a;
    if (J.isArray(t)) J.each(t, function(t, a) {
      i || bi.test(e) ? n(e, a) : k(e + "[" + ("object" == typeof a ? t : "") + "]", a, i, n);
    }); else if (i || "object" !== J.type(t)) n(e, t); else for (a in t) k(e + "[" + a + "]", t[a], i, n);
  }
  function C(e) {
    return function(t, i) {
      "string" != typeof t && (i = t, t = "*");
      var n, a, r, s = t.toLowerCase().split(tt), o = 0, l = s.length;
      if (J.isFunction(i)) for (;l > o; o++) n = s[o], r = /^\+/.test(n), r && (n = n.substr(1) || "*"), 
      a = e[n] = e[n] || [], a[r ? "unshift" : "push"](i);
    };
  }
  function E(e, i, n, a, r, s) {
    r = r || i.dataTypes[0], s = s || {}, s[r] = !0;
    for (var o, l = e[r], d = 0, c = l ? l.length : 0, u = e === Oi; c > d && (u || !o); d++) o = l[d](i, n, a), 
    "string" == typeof o && (!u || s[o] ? o = t : (i.dataTypes.unshift(o), o = E(e, i, n, a, o, s)));
    return !u && o || s["*"] || (o = E(e, i, n, a, "*", s)), o;
  }
  function T(e, i) {
    var n, a, r = J.ajaxSettings.flatOptions || {};
    for (n in i) i[n] !== t && ((r[n] ? e : a || (a = {}))[n] = i[n]);
    a && J.extend(!0, e, a);
  }
  function $(e, i, n) {
    var a, r, s, o, l = e.contents, d = e.dataTypes, c = e.responseFields;
    for (r in c) r in n && (i[c[r]] = n[r]);
    for (;"*" === d[0]; ) d.shift(), a === t && (a = e.mimeType || i.getResponseHeader("content-type"));
    if (a) for (r in l) if (l[r] && l[r].test(a)) {
      d.unshift(r);
      break;
    }
    if (d[0] in n) s = d[0]; else {
      for (r in n) {
        if (!d[0] || e.converters[r + " " + d[0]]) {
          s = r;
          break;
        }
        o || (o = r);
      }
      s = s || o;
    }
    return s ? (s !== d[0] && d.unshift(s), n[s]) : t;
  }
  function M(e, t) {
    var i, n, a, r, s = e.dataTypes.slice(), o = s[0], l = {}, d = 0;
    if (e.dataFilter && (t = e.dataFilter(t, e.dataType)), s[1]) for (i in e.converters) l[i.toLowerCase()] = e.converters[i];
    for (;a = s[++d]; ) if ("*" !== a) {
      if ("*" !== o && o !== a) {
        if (i = l[o + " " + a] || l["* " + a], !i) for (n in l) if (r = n.split(" "), r[1] === a && (i = l[o + " " + r[0]] || l["* " + r[0]])) {
          i === !0 ? i = l[n] : l[n] !== !0 && (a = r[0], s.splice(d--, 0, a));
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
    }, 0), Yi = J.now();
  }
  function A(e, t) {
    J.each(t, function(t, i) {
      for (var n = (Qi[t] || []).concat(Qi["*"]), a = 0, r = n.length; r > a; a++) if (n[a].call(e, t, i)) return;
    });
  }
  function P(e, t, i) {
    var n, a = 0, r = Ji.length, s = J.Deferred().always(function() {
      delete o.elem;
    }), o = function() {
      for (var t = Yi || N(), i = Math.max(0, l.startTime + l.duration - t), n = 1 - (i / l.duration || 0), a = 0, r = l.tweens.length; r > a; a++) l.tweens[a].run(n);
      return s.notifyWith(e, [ l, n, i ]), 1 > n && r ? i : (s.resolveWith(e, [ l ]), 
      !1);
    }, l = s.promise({
      elem: e,
      props: J.extend({}, t),
      opts: J.extend(!0, {
        specialEasing: {}
      }, i),
      originalProperties: t,
      originalOptions: i,
      startTime: Yi || N(),
      duration: i.duration,
      tweens: [],
      createTween: function(t, i) {
        var n = J.Tween(e, l.opts, t, i, l.opts.specialEasing[t] || l.opts.easing);
        return l.tweens.push(n), n;
      },
      stop: function(t) {
        for (var i = 0, n = t ? l.tweens.length : 0; n > i; i++) l.tweens[i].run(1);
        return t ? s.resolveWith(e, [ l, t ]) : s.rejectWith(e, [ l, t ]), this;
      }
    }), d = l.props;
    for (D(d, l.opts.specialEasing); r > a; a++) if (n = Ji[a].call(l, e, d, l.opts)) return n;
    return A(l, d), J.isFunction(l.opts.start) && l.opts.start.call(e, l), J.fx.timer(J.extend(o, {
      anim: l,
      queue: l.opts.queue,
      elem: e
    })), l.progress(l.opts.progress).done(l.opts.done, l.opts.complete).fail(l.opts.fail).always(l.opts.always);
  }
  function D(e, t) {
    var i, n, a, r, s;
    for (i in e) if (n = J.camelCase(i), a = t[n], r = e[i], J.isArray(r) && (a = r[1], 
    r = e[i] = r[0]), i !== n && (e[n] = r, delete e[i]), s = J.cssHooks[n], s && "expand" in s) {
      r = s.expand(r), delete e[n];
      for (i in r) i in e || (e[i] = r[i], t[i] = a);
    } else t[n] = a;
  }
  function z(e, t, i) {
    var n, a, r, s, o, l, d, c, u = this, h = e.style, p = {}, f = [], m = e.nodeType && v(e);
    i.queue || (d = J._queueHooks(e, "fx"), null == d.unqueued && (d.unqueued = 0, c = d.empty.fire, 
    d.empty.fire = function() {
      d.unqueued || c();
    }), d.unqueued++, u.always(function() {
      u.always(function() {
        d.unqueued--, J.queue(e, "fx").length || d.empty.fire();
      });
    })), 1 === e.nodeType && ("height" in t || "width" in t) && (i.overflow = [ h.overflow, h.overflowX, h.overflowY ], 
    "inline" === J.css(e, "display") && "none" === J.css(e, "float") && (J.support.inlineBlockNeedsLayout && "inline" !== w(e.nodeName) ? h.zoom = 1 : h.display = "inline-block")), 
    i.overflow && (h.overflow = "hidden", J.support.shrinkWrapBlocks || u.done(function() {
      h.overflow = i.overflow[0], h.overflowX = i.overflow[1], h.overflowY = i.overflow[2];
    }));
    for (n in t) if (r = t[n], Vi.exec(r)) {
      if (delete t[n], r === (m ? "hide" : "show")) continue;
      f.push(n);
    }
    if (s = f.length) for (o = J._data(e, "fxshow") || J._data(e, "fxshow", {}), m ? J(e).show() : u.done(function() {
      J(e).hide();
    }), u.done(function() {
      var t;
      J.removeData(e, "fxshow", !0);
      for (t in p) J.style(e, t, p[t]);
    }), n = 0; s > n; n++) a = f[n], l = u.createTween(a, m ? o[a] : 0), p[a] = o[a] || J.style(e, a), 
    a in o || (o[a] = l.start, m && (l.end = l.start, l.start = "width" === a || "height" === a ? 1 : 0));
  }
  function O(e, t, i, n, a) {
    return new O.prototype.init(e, t, i, n, a);
  }
  function L(e, t) {
    var i, n = {
      height: e
    }, a = 0;
    for (t = t ? 1 : 0; 4 > a; a += 2 - t) i = gi[a], n["margin" + i] = n["padding" + i] = e;
    return t && (n.opacity = n.width = e), n;
  }
  function H(e) {
    return J.isWindow(e) ? e : 9 === e.nodeType ? e.defaultView || e.parentWindow : !1;
  }
  var R, F, j = e.document, q = e.location, U = e.navigator, B = e.jQuery, W = e.$, X = Array.prototype.push, Y = Array.prototype.slice, G = Array.prototype.indexOf, V = Object.prototype.toString, K = Object.prototype.hasOwnProperty, Z = String.prototype.trim, J = function(e, t) {
    return new J.fn.init(e, t, R);
  }, Q = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source, et = /\S/, tt = /\s+/, it = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, nt = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/, at = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, rt = /^[\],:{}\s]*$/, st = /(?:^|:|,)(?:\s*\[)+/g, ot = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, lt = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g, dt = /^-ms-/, ct = /-([\da-z])/gi, ut = function(e, t) {
    return (t + "").toUpperCase();
  }, ht = function() {
    j.addEventListener ? (j.removeEventListener("DOMContentLoaded", ht, !1), J.ready()) : "complete" === j.readyState && (j.detachEvent("onreadystatechange", ht), 
    J.ready());
  }, pt = {};
  J.fn = J.prototype = {
    constructor: J,
    init: function(e, i, n) {
      var a, r, s;
      if (!e) return this;
      if (e.nodeType) return this.context = this[0] = e, this.length = 1, this;
      if ("string" == typeof e) {
        if (a = "<" === e.charAt(0) && ">" === e.charAt(e.length - 1) && e.length >= 3 ? [ null, e, null ] : nt.exec(e), 
        !a || !a[1] && i) return !i || i.jquery ? (i || n).find(e) : this.constructor(i).find(e);
        if (a[1]) return i = i instanceof J ? i[0] : i, s = i && i.nodeType ? i.ownerDocument || i : j, 
        e = J.parseHTML(a[1], s, !0), at.test(a[1]) && J.isPlainObject(i) && this.attr.call(e, i, !0), 
        J.merge(this, e);
        if (r = j.getElementById(a[2]), r && r.parentNode) {
          if (r.id !== a[2]) return n.find(e);
          this.length = 1, this[0] = r;
        }
        return this.context = j, this.selector = e, this;
      }
      return J.isFunction(e) ? n.ready(e) : (e.selector !== t && (this.selector = e.selector, 
      this.context = e.context), J.makeArray(e, this));
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
      var n = J.merge(this.constructor(), e);
      return n.prevObject = this, n.context = this.context, "find" === t ? n.selector = this.selector + (this.selector ? " " : "") + i : t && (n.selector = this.selector + "." + t + "(" + i + ")"), 
      n;
    },
    each: function(e, t) {
      return J.each(this, e, t);
    },
    ready: function(e) {
      return J.ready.promise().done(e), this;
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
      return this.pushStack(J.map(this, function(t, i) {
        return e.call(t, i, t);
      }));
    },
    end: function() {
      return this.prevObject || this.constructor(null);
    },
    push: X,
    sort: [].sort,
    splice: [].splice
  }, J.fn.init.prototype = J.fn, J.extend = J.fn.extend = function() {
    var e, i, n, a, r, s, o = arguments[0] || {}, l = 1, d = arguments.length, c = !1;
    for ("boolean" == typeof o && (c = o, o = arguments[1] || {}, l = 2), "object" == typeof o || J.isFunction(o) || (o = {}), 
    d === l && (o = this, --l); d > l; l++) if (null != (e = arguments[l])) for (i in e) n = o[i], 
    a = e[i], o !== a && (c && a && (J.isPlainObject(a) || (r = J.isArray(a))) ? (r ? (r = !1, 
    s = n && J.isArray(n) ? n : []) : s = n && J.isPlainObject(n) ? n : {}, o[i] = J.extend(c, s, a)) : a !== t && (o[i] = a));
    return o;
  }, J.extend({
    noConflict: function(t) {
      return e.$ === J && (e.$ = W), t && e.jQuery === J && (e.jQuery = B), J;
    },
    isReady: !1,
    readyWait: 1,
    holdReady: function(e) {
      e ? J.readyWait++ : J.ready(!0);
    },
    ready: function(e) {
      if (e === !0 ? !--J.readyWait : !J.isReady) {
        if (!j.body) return setTimeout(J.ready, 1);
        J.isReady = !0, e !== !0 && --J.readyWait > 0 || (F.resolveWith(j, [ J ]), J.fn.trigger && J(j).trigger("ready").off("ready"));
      }
    },
    isFunction: function(e) {
      return "function" === J.type(e);
    },
    isArray: Array.isArray || function(e) {
      return "array" === J.type(e);
    },
    isWindow: function(e) {
      return null != e && e == e.window;
    },
    isNumeric: function(e) {
      return !isNaN(parseFloat(e)) && isFinite(e);
    },
    type: function(e) {
      return null == e ? e + "" : pt[V.call(e)] || "object";
    },
    isPlainObject: function(e) {
      if (!e || "object" !== J.type(e) || e.nodeType || J.isWindow(e)) return !1;
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
      (n = at.exec(e)) ? [ t.createElement(n[1]) ] : (n = J.buildFragment([ e ], t, i ? null : []), 
      J.merge([], (n.cacheable ? J.clone(n.fragment) : n.fragment).childNodes))) : null;
    },
    parseJSON: function(i) {
      return i && "string" == typeof i ? (i = J.trim(i), e.JSON && e.JSON.parse ? e.JSON.parse(i) : rt.test(i.replace(ot, "@").replace(lt, "]").replace(st, "")) ? Function("return " + i)() : (J.error("Invalid JSON: " + i), 
      t)) : null;
    },
    parseXML: function(i) {
      var n, a;
      if (!i || "string" != typeof i) return null;
      try {
        e.DOMParser ? (a = new DOMParser(), n = a.parseFromString(i, "text/xml")) : (n = new ActiveXObject("Microsoft.XMLDOM"), 
        n.async = "false", n.loadXML(i));
      } catch (r) {
        n = t;
      }
      return n && n.documentElement && !n.getElementsByTagName("parsererror").length || J.error("Invalid XML: " + i), 
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
      var a, r = 0, s = e.length, o = s === t || J.isFunction(e);
      if (n) if (o) {
        for (a in e) if (i.apply(e[a], n) === !1) break;
      } else for (;s > r && i.apply(e[r++], n) !== !1; ) ; else if (o) {
        for (a in e) if (i.call(e[a], a, e[a]) === !1) break;
      } else for (;s > r && i.call(e[r], r, e[r++]) !== !1; ) ;
      return e;
    },
    trim: Z && !Z.call("﻿ ") ? function(e) {
      return null == e ? "" : Z.call(e);
    } : function(e) {
      return null == e ? "" : (e + "").replace(it, "");
    },
    makeArray: function(e, t) {
      var i, n = t || [];
      return null != e && (i = J.type(e), null == e.length || "string" === i || "function" === i || "regexp" === i || J.isWindow(e) ? X.call(n, e) : J.merge(n, e)), 
      n;
    },
    inArray: function(e, t, i) {
      var n;
      if (t) {
        if (G) return G.call(t, e, i);
        for (n = t.length, i = i ? 0 > i ? Math.max(0, n + i) : i : 0; n > i; i++) if (i in t && t[i] === e) return i;
      }
      return -1;
    },
    merge: function(e, i) {
      var n = i.length, a = e.length, r = 0;
      if ("number" == typeof n) for (;n > r; r++) e[a++] = i[r]; else for (;i[r] !== t; ) e[a++] = i[r++];
      return e.length = a, e;
    },
    grep: function(e, t, i) {
      var n, a = [], r = 0, s = e.length;
      for (i = !!i; s > r; r++) n = !!t(e[r], r), i !== n && a.push(e[r]);
      return a;
    },
    map: function(e, i, n) {
      var a, r, s = [], o = 0, l = e.length, d = e instanceof J || l !== t && "number" == typeof l && (l > 0 && e[0] && e[l - 1] || 0 === l || J.isArray(e));
      if (d) for (;l > o; o++) a = i(e[o], o, n), null != a && (s[s.length] = a); else for (r in e) a = i(e[r], r, n), 
      null != a && (s[s.length] = a);
      return s.concat.apply([], s);
    },
    guid: 1,
    proxy: function(e, i) {
      var n, a, r;
      return "string" == typeof i && (n = e[i], i = e, e = n), J.isFunction(e) ? (a = Y.call(arguments, 2), 
      r = function() {
        return e.apply(i, a.concat(Y.call(arguments)));
      }, r.guid = e.guid = e.guid || J.guid++, r) : t;
    },
    access: function(e, i, n, a, r, s, o) {
      var l, d = null == n, c = 0, u = e.length;
      if (n && "object" == typeof n) {
        for (c in n) J.access(e, i, c, n[c], 1, s, a);
        r = 1;
      } else if (a !== t) {
        if (l = o === t && J.isFunction(a), d && (l ? (l = i, i = function(e, t, i) {
          return l.call(J(e), i);
        }) : (i.call(e, a), i = null)), i) for (;u > c; c++) i(e[c], n, l ? a.call(e[c], c, i(e[c], n)) : a, o);
        r = 1;
      }
      return r ? e : d ? i.call(e) : u ? i(e[0], n) : s;
    },
    now: function() {
      return new Date().getTime();
    }
  }), J.ready.promise = function(t) {
    if (!F) if (F = J.Deferred(), "complete" === j.readyState) setTimeout(J.ready, 1); else if (j.addEventListener) j.addEventListener("DOMContentLoaded", ht, !1), 
    e.addEventListener("load", J.ready, !1); else {
      j.attachEvent("onreadystatechange", ht), e.attachEvent("onload", J.ready);
      var i = !1;
      try {
        i = null == e.frameElement && j.documentElement;
      } catch (n) {}
      i && i.doScroll && function a() {
        if (!J.isReady) {
          try {
            i.doScroll("left");
          } catch (e) {
            return setTimeout(a, 50);
          }
          J.ready();
        }
      }();
    }
    return F.promise(t);
  }, J.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(e, t) {
    pt["[object " + t + "]"] = t.toLowerCase();
  }), R = J(j);
  var ft = {};
  J.Callbacks = function(e) {
    e = "string" == typeof e ? ft[e] || i(e) : J.extend({}, e);
    var n, a, r, s, o, l, d = [], c = !e.once && [], u = function(t) {
      for (n = e.memory && t, a = !0, l = s || 0, s = 0, o = d.length, r = !0; d && o > l; l++) if (d[l].apply(t[0], t[1]) === !1 && e.stopOnFalse) {
        n = !1;
        break;
      }
      r = !1, d && (c ? c.length && u(c.shift()) : n ? d = [] : h.disable());
    }, h = {
      add: function() {
        if (d) {
          var t = d.length;
          (function i(t) {
            J.each(t, function(t, n) {
              var a = J.type(n);
              "function" !== a || e.unique && h.has(n) ? n && n.length && "string" !== a && i(n) : d.push(n);
            });
          })(arguments), r ? o = d.length : n && (s = t, u(n));
        }
        return this;
      },
      remove: function() {
        return d && J.each(arguments, function(e, t) {
          for (var i; (i = J.inArray(t, d, i)) > -1; ) d.splice(i, 1), r && (o >= i && o--, 
          l >= i && l--);
        }), this;
      },
      has: function(e) {
        return J.inArray(e, d) > -1;
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
        return t = t || [], t = [ e, t.slice ? t.slice() : t ], !d || a && !c || (r ? c.push(t) : u(t)), 
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
  }, J.extend({
    Deferred: function(e) {
      var t = [ [ "resolve", "done", J.Callbacks("once memory"), "resolved" ], [ "reject", "fail", J.Callbacks("once memory"), "rejected" ], [ "notify", "progress", J.Callbacks("memory") ] ], i = "pending", n = {
        state: function() {
          return i;
        },
        always: function() {
          return a.done(arguments).fail(arguments), this;
        },
        then: function() {
          var e = arguments;
          return J.Deferred(function(i) {
            J.each(t, function(t, n) {
              var r = n[0], s = e[t];
              a[n[1]](J.isFunction(s) ? function() {
                var e = s.apply(this, arguments);
                e && J.isFunction(e.promise) ? e.promise().done(i.resolve).fail(i.reject).progress(i.notify) : i[r + "With"](this === a ? i : this, [ e ]);
              } : i[r]);
            }), e = null;
          }).promise();
        },
        promise: function(e) {
          return null != e ? J.extend(e, n) : n;
        }
      }, a = {};
      return n.pipe = n.then, J.each(t, function(e, r) {
        var s = r[2], o = r[3];
        n[r[1]] = s.add, o && s.add(function() {
          i = o;
        }, t[1 ^ e][2].disable, t[2][2].lock), a[r[0]] = s.fire, a[r[0] + "With"] = s.fireWith;
      }), n.promise(a), e && e.call(a, a), a;
    },
    when: function(e) {
      var t, i, n, a = 0, r = Y.call(arguments), s = r.length, o = 1 !== s || e && J.isFunction(e.promise) ? s : 0, l = 1 === o ? e : J.Deferred(), d = function(e, i, n) {
        return function(a) {
          i[e] = this, n[e] = arguments.length > 1 ? Y.call(arguments) : a, n === t ? l.notifyWith(i, n) : --o || l.resolveWith(i, n);
        };
      };
      if (s > 1) for (t = Array(s), i = Array(s), n = Array(s); s > a; a++) r[a] && J.isFunction(r[a].promise) ? r[a].promise().done(d(a, n, r)).fail(l.reject).progress(d(a, i, t)) : --o;
      return o || l.resolveWith(n, r), l.promise();
    }
  }), J.support = function() {
    var i, n, a, r, s, o, l, d, c, u, h, p = j.createElement("div");
    if (p.setAttribute("className", "t"), p.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", 
    n = p.getElementsByTagName("*"), a = p.getElementsByTagName("a")[0], a.style.cssText = "top:1px;float:left;opacity:.5", 
    !n || !n.length) return {};
    r = j.createElement("select"), s = r.appendChild(j.createElement("option")), o = p.getElementsByTagName("input")[0], 
    i = {
      leadingWhitespace: 3 === p.firstChild.nodeType,
      tbody: !p.getElementsByTagName("tbody").length,
      htmlSerialize: !!p.getElementsByTagName("link").length,
      style: /top/.test(a.getAttribute("style")),
      hrefNormalized: "/a" === a.getAttribute("href"),
      opacity: /^0.5/.test(a.style.opacity),
      cssFloat: !!a.style.cssFloat,
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
    }, o.checked = !0, i.noCloneChecked = o.cloneNode(!0).checked, r.disabled = !0, 
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
    i.appendChecked = o.checked, l.removeChild(o), l.appendChild(p), p.attachEvent) for (c in {
      submit: !0,
      change: !0,
      focusin: !0
    }) d = "on" + c, u = d in p, u || (p.setAttribute(d, "return;"), u = "function" == typeof p[d]), 
    i[c + "Bubbles"] = u;
    return J(function() {
      var n, a, r, s, o = "padding:0;margin:0;border:0;display:block;overflow:hidden;", l = j.getElementsByTagName("body")[0];
      l && (n = j.createElement("div"), n.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px", 
      l.insertBefore(n, l.firstChild), a = j.createElement("div"), n.appendChild(a), a.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", 
      r = a.getElementsByTagName("td"), r[0].style.cssText = "padding:0;margin:0;border:0;display:none", 
      u = 0 === r[0].offsetHeight, r[0].style.display = "", r[1].style.display = "none", 
      i.reliableHiddenOffsets = u && 0 === r[0].offsetHeight, a.innerHTML = "", a.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", 
      i.boxSizing = 4 === a.offsetWidth, i.doesNotIncludeMarginInBodyOffset = 1 !== l.offsetTop, 
      e.getComputedStyle && (i.pixelPosition = "1%" !== (e.getComputedStyle(a, null) || {}).top, 
      i.boxSizingReliable = "4px" === (e.getComputedStyle(a, null) || {
        width: "4px"
      }).width, s = j.createElement("div"), s.style.cssText = a.style.cssText = o, s.style.marginRight = s.style.width = "0", 
      a.style.width = "1px", a.appendChild(s), i.reliableMarginRight = !parseFloat((e.getComputedStyle(s, null) || {}).marginRight)), 
      a.style.zoom !== t && (a.innerHTML = "", a.style.cssText = o + "width:1px;padding:1px;display:inline;zoom:1", 
      i.inlineBlockNeedsLayout = 3 === a.offsetWidth, a.style.display = "block", a.style.overflow = "visible", 
      a.innerHTML = "<div></div>", a.firstChild.style.width = "5px", i.shrinkWrapBlocks = 3 !== a.offsetWidth, 
      n.style.zoom = 1), l.removeChild(n), n = a = r = s = null);
    }), l.removeChild(p), n = a = r = s = o = l = p = null, i;
  }();
  var mt = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, gt = /([A-Z])/g;
  J.extend({
    cache: {},
    deletedIds: [],
    uuid: 0,
    expando: "jQuery" + (J.fn.jquery + Math.random()).replace(/\D/g, ""),
    noData: {
      embed: !0,
      object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
      applet: !0
    },
    hasData: function(e) {
      return e = e.nodeType ? J.cache[e[J.expando]] : e[J.expando], !!e && !a(e);
    },
    data: function(e, i, n, a) {
      if (J.acceptData(e)) {
        var r, s, o = J.expando, l = "string" == typeof i, d = e.nodeType, c = d ? J.cache : e, u = d ? e[o] : e[o] && o;
        if (u && c[u] && (a || c[u].data) || !l || n !== t) return u || (d ? e[o] = u = J.deletedIds.pop() || J.guid++ : u = o), 
        c[u] || (c[u] = {}, d || (c[u].toJSON = J.noop)), ("object" == typeof i || "function" == typeof i) && (a ? c[u] = J.extend(c[u], i) : c[u].data = J.extend(c[u].data, i)), 
        r = c[u], a || (r.data || (r.data = {}), r = r.data), n !== t && (r[J.camelCase(i)] = n), 
        l ? (s = r[i], null == s && (s = r[J.camelCase(i)])) : s = r, s;
      }
    },
    removeData: function(e, t, i) {
      if (J.acceptData(e)) {
        var n, r, s, o = e.nodeType, l = o ? J.cache : e, d = o ? e[J.expando] : J.expando;
        if (l[d]) {
          if (t && (n = i ? l[d] : l[d].data)) {
            J.isArray(t) || (t in n ? t = [ t ] : (t = J.camelCase(t), t = t in n ? [ t ] : t.split(" ")));
            for (r = 0, s = t.length; s > r; r++) delete n[t[r]];
            if (!(i ? a : J.isEmptyObject)(n)) return;
          }
          (i || (delete l[d].data, a(l[d]))) && (o ? J.cleanData([ e ], !0) : J.support.deleteExpando || l != l.window ? delete l[d] : l[d] = null);
        }
      }
    },
    _data: function(e, t, i) {
      return J.data(e, t, i, !0);
    },
    acceptData: function(e) {
      var t = e.nodeName && J.noData[e.nodeName.toLowerCase()];
      return !t || t !== !0 && e.getAttribute("classid") === t;
    }
  }), J.fn.extend({
    data: function(e, i) {
      var a, r, s, o, l, d = this[0], c = 0, u = null;
      if (e === t) {
        if (this.length && (u = J.data(d), 1 === d.nodeType && !J._data(d, "parsedAttrs"))) {
          for (s = d.attributes, l = s.length; l > c; c++) o = s[c].name, o.indexOf("data-") || (o = J.camelCase(o.substring(5)), 
          n(d, o, u[o]));
          J._data(d, "parsedAttrs", !0);
        }
        return u;
      }
      return "object" == typeof e ? this.each(function() {
        J.data(this, e);
      }) : (a = e.split(".", 2), a[1] = a[1] ? "." + a[1] : "", r = a[1] + "!", J.access(this, function(i) {
        return i === t ? (u = this.triggerHandler("getData" + r, [ a[0] ]), u === t && d && (u = J.data(d, e), 
        u = n(d, e, u)), u === t && a[1] ? this.data(a[0]) : u) : (a[1] = i, this.each(function() {
          var t = J(this);
          t.triggerHandler("setData" + r, a), J.data(this, e, i), t.triggerHandler("changeData" + r, a);
        }), t);
      }, null, i, arguments.length > 1, null, !1));
    },
    removeData: function(e) {
      return this.each(function() {
        J.removeData(this, e);
      });
    }
  }), J.extend({
    queue: function(e, i, n) {
      var a;
      return e ? (i = (i || "fx") + "queue", a = J._data(e, i), n && (!a || J.isArray(n) ? a = J._data(e, i, J.makeArray(n)) : a.push(n)), 
      a || []) : t;
    },
    dequeue: function(e, t) {
      t = t || "fx";
      var i = J.queue(e, t), n = i.length, a = i.shift(), r = J._queueHooks(e, t), s = function() {
        J.dequeue(e, t);
      };
      "inprogress" === a && (a = i.shift(), n--), a && ("fx" === t && i.unshift("inprogress"), 
      delete r.stop, a.call(e, s, r)), !n && r && r.empty.fire();
    },
    _queueHooks: function(e, t) {
      var i = t + "queueHooks";
      return J._data(e, i) || J._data(e, i, {
        empty: J.Callbacks("once memory").add(function() {
          J.removeData(e, t + "queue", !0), J.removeData(e, i, !0);
        })
      });
    }
  }), J.fn.extend({
    queue: function(e, i) {
      var n = 2;
      return "string" != typeof e && (i = e, e = "fx", n--), n > arguments.length ? J.queue(this[0], e) : i === t ? this : this.each(function() {
        var t = J.queue(this, e, i);
        J._queueHooks(this, e), "fx" === e && "inprogress" !== t[0] && J.dequeue(this, e);
      });
    },
    dequeue: function(e) {
      return this.each(function() {
        J.dequeue(this, e);
      });
    },
    delay: function(e, t) {
      return e = J.fx ? J.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, function(t, i) {
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
      var n, a = 1, r = J.Deferred(), s = this, o = this.length, l = function() {
        --a || r.resolveWith(s, [ s ]);
      };
      for ("string" != typeof e && (i = e, e = t), e = e || "fx"; o--; ) n = J._data(s[o], e + "queueHooks"), 
      n && n.empty && (a++, n.empty.add(l));
      return l(), r.promise(i);
    }
  });
  var vt, yt, _t, bt = /[\t\r\n]/g, xt = /\r/g, wt = /^(?:button|input)$/i, kt = /^(?:button|input|object|select|textarea)$/i, Ct = /^a(?:rea|)$/i, Et = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i, Tt = J.support.getSetAttribute;
  J.fn.extend({
    attr: function(e, t) {
      return J.access(this, J.attr, e, t, arguments.length > 1);
    },
    removeAttr: function(e) {
      return this.each(function() {
        J.removeAttr(this, e);
      });
    },
    prop: function(e, t) {
      return J.access(this, J.prop, e, t, arguments.length > 1);
    },
    removeProp: function(e) {
      return e = J.propFix[e] || e, this.each(function() {
        try {
          this[e] = t, delete this[e];
        } catch (i) {}
      });
    },
    addClass: function(e) {
      var t, i, n, a, r, s, o;
      if (J.isFunction(e)) return this.each(function(t) {
        J(this).addClass(e.call(this, t, this.className));
      });
      if (e && "string" == typeof e) for (t = e.split(tt), i = 0, n = this.length; n > i; i++) if (a = this[i], 
      1 === a.nodeType) if (a.className || 1 !== t.length) {
        for (r = " " + a.className + " ", s = 0, o = t.length; o > s; s++) 0 > r.indexOf(" " + t[s] + " ") && (r += t[s] + " ");
        a.className = J.trim(r);
      } else a.className = e;
      return this;
    },
    removeClass: function(e) {
      var i, n, a, r, s, o, l;
      if (J.isFunction(e)) return this.each(function(t) {
        J(this).removeClass(e.call(this, t, this.className));
      });
      if (e && "string" == typeof e || e === t) for (i = (e || "").split(tt), o = 0, l = this.length; l > o; o++) if (a = this[o], 
      1 === a.nodeType && a.className) {
        for (n = (" " + a.className + " ").replace(bt, " "), r = 0, s = i.length; s > r; r++) for (;n.indexOf(" " + i[r] + " ") >= 0; ) n = n.replace(" " + i[r] + " ", " ");
        a.className = e ? J.trim(n) : "";
      }
      return this;
    },
    toggleClass: function(e, t) {
      var i = typeof e, n = "boolean" == typeof t;
      return J.isFunction(e) ? this.each(function(i) {
        J(this).toggleClass(e.call(this, i, this.className, t), t);
      }) : this.each(function() {
        if ("string" === i) for (var a, r = 0, s = J(this), o = t, l = e.split(tt); a = l[r++]; ) o = n ? o : !s.hasClass(a), 
        s[o ? "addClass" : "removeClass"](a); else ("undefined" === i || "boolean" === i) && (this.className && J._data(this, "__className__", this.className), 
        this.className = this.className || e === !1 ? "" : J._data(this, "__className__") || "");
      });
    },
    hasClass: function(e) {
      for (var t = " " + e + " ", i = 0, n = this.length; n > i; i++) if (1 === this[i].nodeType && (" " + this[i].className + " ").replace(bt, " ").indexOf(t) >= 0) return !0;
      return !1;
    },
    val: function(e) {
      var i, n, a, r = this[0];
      {
        if (arguments.length) return a = J.isFunction(e), this.each(function(n) {
          var r, s = J(this);
          1 === this.nodeType && (r = a ? e.call(this, n, s.val()) : e, null == r ? r = "" : "number" == typeof r ? r += "" : J.isArray(r) && (r = J.map(r, function(e) {
            return null == e ? "" : e + "";
          })), i = J.valHooks[this.type] || J.valHooks[this.nodeName.toLowerCase()], i && "set" in i && i.set(this, r, "value") !== t || (this.value = r));
        });
        if (r) return i = J.valHooks[r.type] || J.valHooks[r.nodeName.toLowerCase()], i && "get" in i && (n = i.get(r, "value")) !== t ? n : (n = r.value, 
        "string" == typeof n ? n.replace(xt, "") : null == n ? "" : n);
      }
    }
  }), J.extend({
    valHooks: {
      option: {
        get: function(e) {
          var t = e.attributes.value;
          return !t || t.specified ? e.value : e.text;
        }
      },
      select: {
        get: function(e) {
          var t, i, n, a, r = e.selectedIndex, s = [], o = e.options, l = "select-one" === e.type;
          if (0 > r) return null;
          for (i = l ? r : 0, n = l ? r + 1 : o.length; n > i; i++) if (a = o[i], !(!a.selected || (J.support.optDisabled ? a.disabled : null !== a.getAttribute("disabled")) || a.parentNode.disabled && J.nodeName(a.parentNode, "optgroup"))) {
            if (t = J(a).val(), l) return t;
            s.push(t);
          }
          return l && !s.length && o.length ? J(o[r]).val() : s;
        },
        set: function(e, t) {
          var i = J.makeArray(t);
          return J(e).find("option").each(function() {
            this.selected = J.inArray(J(this).val(), i) >= 0;
          }), i.length || (e.selectedIndex = -1), i;
        }
      }
    },
    attrFn: {},
    attr: function(e, i, n, a) {
      var r, s, o, l = e.nodeType;
      if (e && 3 !== l && 8 !== l && 2 !== l) return a && J.isFunction(J.fn[i]) ? J(e)[i](n) : e.getAttribute === t ? J.prop(e, i, n) : (o = 1 !== l || !J.isXMLDoc(e), 
      o && (i = i.toLowerCase(), s = J.attrHooks[i] || (Et.test(i) ? yt : vt)), n !== t ? null === n ? (J.removeAttr(e, i), 
      t) : s && "set" in s && o && (r = s.set(e, n, i)) !== t ? r : (e.setAttribute(i, n + ""), 
      n) : s && "get" in s && o && null !== (r = s.get(e, i)) ? r : (r = e.getAttribute(i), 
      null === r ? t : r));
    },
    removeAttr: function(e, t) {
      var i, n, a, r, s = 0;
      if (t && 1 === e.nodeType) for (n = t.split(tt); n.length > s; s++) a = n[s], a && (i = J.propFix[a] || a, 
      r = Et.test(a), r || J.attr(e, a, ""), e.removeAttribute(Tt ? a : i), r && i in e && (e[i] = !1));
    },
    attrHooks: {
      type: {
        set: function(e, t) {
          if (wt.test(e.nodeName) && e.parentNode) J.error("type property can't be changed"); else if (!J.support.radioValue && "radio" === t && J.nodeName(e, "input")) {
            var i = e.value;
            return e.setAttribute("type", t), i && (e.value = i), t;
          }
        }
      },
      value: {
        get: function(e, t) {
          return vt && J.nodeName(e, "button") ? vt.get(e, t) : t in e ? e.value : null;
        },
        set: function(e, i, n) {
          return vt && J.nodeName(e, "button") ? vt.set(e, i, n) : (e.value = i, t);
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
      var a, r, s, o = e.nodeType;
      if (e && 3 !== o && 8 !== o && 2 !== o) return s = 1 !== o || !J.isXMLDoc(e), s && (i = J.propFix[i] || i, 
      r = J.propHooks[i]), n !== t ? r && "set" in r && (a = r.set(e, n, i)) !== t ? a : e[i] = n : r && "get" in r && null !== (a = r.get(e, i)) ? a : e[i];
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
      var n, a = J.prop(e, i);
      return a === !0 || "boolean" != typeof a && (n = e.getAttributeNode(i)) && n.nodeValue !== !1 ? i.toLowerCase() : t;
    },
    set: function(e, t, i) {
      var n;
      return t === !1 ? J.removeAttr(e, i) : (n = J.propFix[i] || i, n in e && (e[n] = !0), 
      e.setAttribute(i, i.toLowerCase())), i;
    }
  }, Tt || (_t = {
    name: !0,
    id: !0,
    coords: !0
  }, vt = J.valHooks.button = {
    get: function(e, i) {
      var n;
      return n = e.getAttributeNode(i), n && (_t[i] ? "" !== n.value : n.specified) ? n.value : t;
    },
    set: function(e, t, i) {
      var n = e.getAttributeNode(i);
      return n || (n = j.createAttribute(i), e.setAttributeNode(n)), n.value = t + "";
    }
  }, J.each([ "width", "height" ], function(e, i) {
    J.attrHooks[i] = J.extend(J.attrHooks[i], {
      set: function(e, n) {
        return "" === n ? (e.setAttribute(i, "auto"), n) : t;
      }
    });
  }), J.attrHooks.contenteditable = {
    get: vt.get,
    set: function(e, t, i) {
      "" === t && (t = "false"), vt.set(e, t, i);
    }
  }), J.support.hrefNormalized || J.each([ "href", "src", "width", "height" ], function(e, i) {
    J.attrHooks[i] = J.extend(J.attrHooks[i], {
      get: function(e) {
        var n = e.getAttribute(i, 2);
        return null === n ? t : n;
      }
    });
  }), J.support.style || (J.attrHooks.style = {
    get: function(e) {
      return e.style.cssText.toLowerCase() || t;
    },
    set: function(e, t) {
      return e.style.cssText = t + "";
    }
  }), J.support.optSelected || (J.propHooks.selected = J.extend(J.propHooks.selected, {
    get: function(e) {
      var t = e.parentNode;
      return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null;
    }
  })), J.support.enctype || (J.propFix.enctype = "encoding"), J.support.checkOn || J.each([ "radio", "checkbox" ], function() {
    J.valHooks[this] = {
      get: function(e) {
        return null === e.getAttribute("value") ? "on" : e.value;
      }
    };
  }), J.each([ "radio", "checkbox" ], function() {
    J.valHooks[this] = J.extend(J.valHooks[this], {
      set: function(e, i) {
        return J.isArray(i) ? e.checked = J.inArray(J(e).val(), i) >= 0 : t;
      }
    });
  });
  var $t = /^(?:textarea|input|select)$/i, Mt = /^([^\.]*|)(?:\.(.+)|)$/, St = /(?:^|\s)hover(\.\S+|)\b/, It = /^key/, Nt = /^(?:mouse|contextmenu)|click/, At = /^(?:focusinfocus|focusoutblur)$/, Pt = function(e) {
    return J.event.special.hover ? e : e.replace(St, "mouseenter$1 mouseleave$1");
  };
  J.event = {
    add: function(e, i, n, a, r) {
      var s, o, l, d, c, u, h, p, f, m, g;
      if (3 !== e.nodeType && 8 !== e.nodeType && i && n && (s = J._data(e))) {
        for (n.handler && (f = n, n = f.handler, r = f.selector), n.guid || (n.guid = J.guid++), 
        l = s.events, l || (s.events = l = {}), o = s.handle, o || (s.handle = o = function(e) {
          return J === t || e && J.event.triggered === e.type ? t : J.event.dispatch.apply(o.elem, arguments);
        }, o.elem = e), i = J.trim(Pt(i)).split(" "), d = 0; i.length > d; d++) c = Mt.exec(i[d]) || [], 
        u = c[1], h = (c[2] || "").split(".").sort(), g = J.event.special[u] || {}, u = (r ? g.delegateType : g.bindType) || u, 
        g = J.event.special[u] || {}, p = J.extend({
          type: u,
          origType: c[1],
          data: a,
          handler: n,
          guid: n.guid,
          selector: r,
          needsContext: r && J.expr.match.needsContext.test(r),
          namespace: h.join(".")
        }, f), m = l[u], m || (m = l[u] = [], m.delegateCount = 0, g.setup && g.setup.call(e, a, h, o) !== !1 || (e.addEventListener ? e.addEventListener(u, o, !1) : e.attachEvent && e.attachEvent("on" + u, o))), 
        g.add && (g.add.call(e, p), p.handler.guid || (p.handler.guid = n.guid)), r ? m.splice(m.delegateCount++, 0, p) : m.push(p), 
        J.event.global[u] = !0;
        e = null;
      }
    },
    global: {},
    remove: function(e, t, i, n, a) {
      var r, s, o, l, d, c, u, h, p, f, m, g = J.hasData(e) && J._data(e);
      if (g && (h = g.events)) {
        for (t = J.trim(Pt(t || "")).split(" "), r = 0; t.length > r; r++) if (s = Mt.exec(t[r]) || [], 
        o = l = s[1], d = s[2], o) {
          for (p = J.event.special[o] || {}, o = (n ? p.delegateType : p.bindType) || o, f = h[o] || [], 
          c = f.length, d = d ? RegExp("(^|\\.)" + d.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null, 
          u = 0; f.length > u; u++) m = f[u], !a && l !== m.origType || i && i.guid !== m.guid || d && !d.test(m.namespace) || n && n !== m.selector && ("**" !== n || !m.selector) || (f.splice(u--, 1), 
          m.selector && f.delegateCount--, p.remove && p.remove.call(e, m));
          0 === f.length && c !== f.length && (p.teardown && p.teardown.call(e, d, g.handle) !== !1 || J.removeEvent(e, o, g.handle), 
          delete h[o]);
        } else for (o in h) J.event.remove(e, o + t[r], i, n, !0);
        J.isEmptyObject(h) && (delete g.handle, J.removeData(e, "events", !0));
      }
    },
    customEvent: {
      getData: !0,
      setData: !0,
      changeData: !0
    },
    trigger: function(i, n, a, r) {
      if (!a || 3 !== a.nodeType && 8 !== a.nodeType) {
        var s, o, l, d, c, u, h, p, f, m, g = i.type || i, v = [];
        if (!At.test(g + J.event.triggered) && (g.indexOf("!") >= 0 && (g = g.slice(0, -1), 
        o = !0), g.indexOf(".") >= 0 && (v = g.split("."), g = v.shift(), v.sort()), a && !J.event.customEvent[g] || J.event.global[g])) if (i = "object" == typeof i ? i[J.expando] ? i : new J.Event(g, i) : new J.Event(g), 
        i.type = g, i.isTrigger = !0, i.exclusive = o, i.namespace = v.join("."), i.namespace_re = i.namespace ? RegExp("(^|\\.)" + v.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, 
        u = 0 > g.indexOf(":") ? "on" + g : "", a) {
          if (i.result = t, i.target || (i.target = a), n = null != n ? J.makeArray(n) : [], 
          n.unshift(i), h = J.event.special[g] || {}, !h.trigger || h.trigger.apply(a, n) !== !1) {
            if (f = [ [ a, h.bindType || g ] ], !r && !h.noBubble && !J.isWindow(a)) {
              for (m = h.delegateType || g, d = At.test(m + g) ? a : a.parentNode, c = a; d; d = d.parentNode) f.push([ d, m ]), 
              c = d;
              c === (a.ownerDocument || j) && f.push([ c.defaultView || c.parentWindow || e, m ]);
            }
            for (l = 0; f.length > l && !i.isPropagationStopped(); l++) d = f[l][0], i.type = f[l][1], 
            p = (J._data(d, "events") || {})[i.type] && J._data(d, "handle"), p && p.apply(d, n), 
            p = u && d[u], p && J.acceptData(d) && p.apply && p.apply(d, n) === !1 && i.preventDefault();
            return i.type = g, r || i.isDefaultPrevented() || h._default && h._default.apply(a.ownerDocument, n) !== !1 || "click" === g && J.nodeName(a, "a") || !J.acceptData(a) || u && a[g] && ("focus" !== g && "blur" !== g || 0 !== i.target.offsetWidth) && !J.isWindow(a) && (c = a[u], 
            c && (a[u] = null), J.event.triggered = g, a[g](), J.event.triggered = t, c && (a[u] = c)), 
            i.result;
          }
        } else {
          s = J.cache;
          for (l in s) s[l].events && s[l].events[g] && J.event.trigger(i, n, s[l].handle.elem, !0);
        }
      }
    },
    dispatch: function(i) {
      i = J.event.fix(i || e.event);
      var n, a, r, s, o, l, d, c, u, h = (J._data(this, "events") || {})[i.type] || [], p = h.delegateCount, f = Y.call(arguments), m = !i.exclusive && !i.namespace, g = J.event.special[i.type] || {}, v = [];
      if (f[0] = i, i.delegateTarget = this, !g.preDispatch || g.preDispatch.call(this, i) !== !1) {
        if (p && (!i.button || "click" !== i.type)) for (r = i.target; r != this; r = r.parentNode || this) if (r.disabled !== !0 || "click" !== i.type) {
          for (o = {}, d = [], n = 0; p > n; n++) c = h[n], u = c.selector, o[u] === t && (o[u] = c.needsContext ? J(u, this).index(r) >= 0 : J.find(u, this, null, [ r ]).length), 
          o[u] && d.push(c);
          d.length && v.push({
            elem: r,
            matches: d
          });
        }
        for (h.length > p && v.push({
          elem: this,
          matches: h.slice(p)
        }), n = 0; v.length > n && !i.isPropagationStopped(); n++) for (l = v[n], i.currentTarget = l.elem, 
        a = 0; l.matches.length > a && !i.isImmediatePropagationStopped(); a++) c = l.matches[a], 
        (m || !i.namespace && !c.namespace || i.namespace_re && i.namespace_re.test(c.namespace)) && (i.data = c.data, 
        i.handleObj = c, s = ((J.event.special[c.origType] || {}).handle || c.handler).apply(l.elem, f), 
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
        var n, a, r, s = i.button, o = i.fromElement;
        return null == e.pageX && null != i.clientX && (n = e.target.ownerDocument || j, 
        a = n.documentElement, r = n.body, e.pageX = i.clientX + (a && a.scrollLeft || r && r.scrollLeft || 0) - (a && a.clientLeft || r && r.clientLeft || 0), 
        e.pageY = i.clientY + (a && a.scrollTop || r && r.scrollTop || 0) - (a && a.clientTop || r && r.clientTop || 0)), 
        !e.relatedTarget && o && (e.relatedTarget = o === e.target ? i.toElement : o), e.which || s === t || (e.which = 1 & s ? 1 : 2 & s ? 3 : 4 & s ? 2 : 0), 
        e;
      }
    },
    fix: function(e) {
      if (e[J.expando]) return e;
      var t, i, n = e, a = J.event.fixHooks[e.type] || {}, r = a.props ? this.props.concat(a.props) : this.props;
      for (e = J.Event(n), t = r.length; t; ) i = r[--t], e[i] = n[i];
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
          J.isWindow(this) && (this.onbeforeunload = i);
        },
        teardown: function(e, t) {
          this.onbeforeunload === t && (this.onbeforeunload = null);
        }
      }
    },
    simulate: function(e, t, i, n) {
      var a = J.extend(new J.Event(), i, {
        type: e,
        isSimulated: !0,
        originalEvent: {}
      });
      n ? J.event.trigger(a, null, t) : J.event.dispatch.call(t, a), a.isDefaultPrevented() && i.preventDefault();
    }
  }, J.event.handle = J.event.dispatch, J.removeEvent = j.removeEventListener ? function(e, t, i) {
    e.removeEventListener && e.removeEventListener(t, i, !1);
  } : function(e, i, n) {
    var a = "on" + i;
    e.detachEvent && (e[a] === t && (e[a] = null), e.detachEvent(a, n));
  }, J.Event = function(e, i) {
    return this instanceof J.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, 
    this.isDefaultPrevented = e.defaultPrevented || e.returnValue === !1 || e.getPreventDefault && e.getPreventDefault() ? s : r) : this.type = e, 
    i && J.extend(this, i), this.timeStamp = e && e.timeStamp || J.now(), this[J.expando] = !0, 
    t) : new J.Event(e, i);
  }, J.Event.prototype = {
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
    isDefaultPrevented: r,
    isPropagationStopped: r,
    isImmediatePropagationStopped: r
  }, J.each({
    mouseenter: "mouseover",
    mouseleave: "mouseout"
  }, function(e, t) {
    J.event.special[e] = {
      delegateType: t,
      bindType: t,
      handle: function(e) {
        var i, n = this, a = e.relatedTarget, r = e.handleObj;
        return r.selector, (!a || a !== n && !J.contains(n, a)) && (e.type = r.origType, 
        i = r.handler.apply(this, arguments), e.type = t), i;
      }
    };
  }), J.support.submitBubbles || (J.event.special.submit = {
    setup: function() {
      return J.nodeName(this, "form") ? !1 : (J.event.add(this, "click._submit keypress._submit", function(e) {
        var i = e.target, n = J.nodeName(i, "input") || J.nodeName(i, "button") ? i.form : t;
        n && !J._data(n, "_submit_attached") && (J.event.add(n, "submit._submit", function(e) {
          e._submit_bubble = !0;
        }), J._data(n, "_submit_attached", !0));
      }), t);
    },
    postDispatch: function(e) {
      e._submit_bubble && (delete e._submit_bubble, this.parentNode && !e.isTrigger && J.event.simulate("submit", this.parentNode, e, !0));
    },
    teardown: function() {
      return J.nodeName(this, "form") ? !1 : (J.event.remove(this, "._submit"), t);
    }
  }), J.support.changeBubbles || (J.event.special.change = {
    setup: function() {
      return $t.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (J.event.add(this, "propertychange._change", function(e) {
        "checked" === e.originalEvent.propertyName && (this._just_changed = !0);
      }), J.event.add(this, "click._change", function(e) {
        this._just_changed && !e.isTrigger && (this._just_changed = !1), J.event.simulate("change", this, e, !0);
      })), !1) : (J.event.add(this, "beforeactivate._change", function(e) {
        var t = e.target;
        $t.test(t.nodeName) && !J._data(t, "_change_attached") && (J.event.add(t, "change._change", function(e) {
          !this.parentNode || e.isSimulated || e.isTrigger || J.event.simulate("change", this.parentNode, e, !0);
        }), J._data(t, "_change_attached", !0));
      }), t);
    },
    handle: function(e) {
      var i = e.target;
      return this !== i || e.isSimulated || e.isTrigger || "radio" !== i.type && "checkbox" !== i.type ? e.handleObj.handler.apply(this, arguments) : t;
    },
    teardown: function() {
      return J.event.remove(this, "._change"), !$t.test(this.nodeName);
    }
  }), J.support.focusinBubbles || J.each({
    focus: "focusin",
    blur: "focusout"
  }, function(e, t) {
    var i = 0, n = function(e) {
      J.event.simulate(t, e.target, J.event.fix(e), !0);
    };
    J.event.special[t] = {
      setup: function() {
        0 === i++ && j.addEventListener(e, n, !0);
      },
      teardown: function() {
        0 === --i && j.removeEventListener(e, n, !0);
      }
    };
  }), J.fn.extend({
    on: function(e, i, n, a, s) {
      var o, l;
      if ("object" == typeof e) {
        "string" != typeof i && (n = n || i, i = t);
        for (l in e) this.on(l, i, n, e[l], s);
        return this;
      }
      if (null == n && null == a ? (a = i, n = i = t) : null == a && ("string" == typeof i ? (a = n, 
      n = t) : (a = n, n = i, i = t)), a === !1) a = r; else if (!a) return this;
      return 1 === s && (o = a, a = function(e) {
        return J().off(e), o.apply(this, arguments);
      }, a.guid = o.guid || (o.guid = J.guid++)), this.each(function() {
        J.event.add(this, e, a, n, i);
      });
    },
    one: function(e, t, i, n) {
      return this.on(e, t, i, n, 1);
    },
    off: function(e, i, n) {
      var a, s;
      if (e && e.preventDefault && e.handleObj) return a = e.handleObj, J(e.delegateTarget).off(a.namespace ? a.origType + "." + a.namespace : a.origType, a.selector, a.handler), 
      this;
      if ("object" == typeof e) {
        for (s in e) this.off(s, i, e[s]);
        return this;
      }
      return (i === !1 || "function" == typeof i) && (n = i, i = t), n === !1 && (n = r), 
      this.each(function() {
        J.event.remove(this, e, n, i);
      });
    },
    bind: function(e, t, i) {
      return this.on(e, null, t, i);
    },
    unbind: function(e, t) {
      return this.off(e, null, t);
    },
    live: function(e, t, i) {
      return J(this.context).on(e, this.selector, t, i), this;
    },
    die: function(e, t) {
      return J(this.context).off(e, this.selector || "**", t), this;
    },
    delegate: function(e, t, i, n) {
      return this.on(t, e, i, n);
    },
    undelegate: function(e, t, i) {
      return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", i);
    },
    trigger: function(e, t) {
      return this.each(function() {
        J.event.trigger(e, t, this);
      });
    },
    triggerHandler: function(e, i) {
      return this[0] ? J.event.trigger(e, i, this[0], !0) : t;
    },
    toggle: function(e) {
      var t = arguments, i = e.guid || J.guid++, n = 0, a = function(i) {
        var a = (J._data(this, "lastToggle" + e.guid) || 0) % n;
        return J._data(this, "lastToggle" + e.guid, a + 1), i.preventDefault(), t[a].apply(this, arguments) || !1;
      };
      for (a.guid = i; t.length > n; ) t[n++].guid = i;
      return this.click(a);
    },
    hover: function(e, t) {
      return this.mouseenter(e).mouseleave(t || e);
    }
  }), J.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
    J.fn[t] = function(e, i) {
      return null == i && (i = e, e = null), arguments.length > 0 ? this.on(t, null, e, i) : this.trigger(t);
    }, It.test(t) && (J.event.fixHooks[t] = J.event.keyHooks), Nt.test(t) && (J.event.fixHooks[t] = J.event.mouseHooks);
  }), function(e, t) {
    function i(e, t, i, n) {
      i = i || [], t = t || N;
      var a, r, s, o, l = t.nodeType;
      if (!e || "string" != typeof e) return i;
      if (1 !== l && 9 !== l) return [];
      if (s = x(t), !s && !n && (a = it.exec(e))) if (o = a[1]) {
        if (9 === l) {
          if (r = t.getElementById(o), !r || !r.parentNode) return i;
          if (r.id === o) return i.push(r), i;
        } else if (t.ownerDocument && (r = t.ownerDocument.getElementById(o)) && w(t, r) && r.id === o) return i.push(r), 
        i;
      } else {
        if (a[2]) return O.apply(i, L.call(t.getElementsByTagName(e), 0)), i;
        if ((o = a[3]) && ht && t.getElementsByClassName) return O.apply(i, L.call(t.getElementsByClassName(o), 0)), 
        i;
      }
      return m(e.replace(Z, "$1"), t, i, n, s);
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
    function r(e) {
      return R(function(t) {
        return t = +t, R(function(i, n) {
          for (var a, r = e([], i.length, t), s = r.length; s--; ) i[a = r[s]] && (i[a] = !(n[a] = i[a]));
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
      var n, a, r, s, o, l, d, c = q[S][e];
      if (c) return t ? 0 : c.slice(0);
      for (o = e, l = [], d = _.preFilter; o; ) {
        (!n || (a = Q.exec(o))) && (a && (o = o.slice(a[0].length)), l.push(r = [])), n = !1, 
        (a = et.exec(o)) && (r.push(n = new I(a.shift())), o = o.slice(n.length), n.type = a[0].replace(Z, " "));
        for (s in _.filter) !(a = ot[s].exec(o)) || d[s] && !(a = d[s](a, N, !0)) || (r.push(n = new I(a.shift())), 
        o = o.slice(n.length), n.type = s, n.matches = a);
        if (!n) break;
      }
      return t ? o.length : o ? i.error(e) : q(e, l).slice(0);
    }
    function l(e, t, i) {
      var n = t.dir, a = i && "parentNode" === t.dir, r = D++;
      return t.first ? function(t, i, r) {
        for (;t = t[n]; ) if (a || 1 === t.nodeType) return e(t, i, r);
      } : function(t, i, s) {
        if (s) {
          for (;t = t[n]; ) if ((a || 1 === t.nodeType) && e(t, i, s)) return t;
        } else for (var o, l = P + " " + r + " ", d = l + v; t = t[n]; ) if (a || 1 === t.nodeType) {
          if ((o = t[S]) === d) return t.sizset;
          if ("string" == typeof o && 0 === o.indexOf(l)) {
            if (t.sizset) return t;
          } else {
            if (t[S] = d, e(t, i, s)) return t.sizset = !0, t;
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
      for (var r, s = [], o = 0, l = e.length, d = null != t; l > o; o++) (r = e[o]) && (!i || i(r, n, a)) && (s.push(r), 
      d && t.push(o));
      return s;
    }
    function u(e, t, i, n, a, r) {
      return n && !n[S] && (n = u(n)), a && !a[S] && (a = u(a, r)), R(function(r, s, o, l) {
        if (!r || !a) {
          var d, u, h, p = [], m = [], g = s.length, v = r || f(t || "*", o.nodeType ? [ o ] : o, [], r), y = !e || !r && t ? v : c(v, p, e, o, l), _ = i ? a || (r ? e : g || n) ? [] : s : y;
          if (i && i(y, _, o, l), n) for (h = c(_, m), n(h, [], o, l), d = h.length; d--; ) (u = h[d]) && (_[m[d]] = !(y[m[d]] = u));
          if (r) for (d = e && _.length; d--; ) (u = _[d]) && (r[p[d]] = !(s[p[d]] = u)); else _ = c(_ === s ? _.splice(g, _.length) : _), 
          a ? a(null, s, _, l) : O.apply(s, _);
        }
      });
    }
    function h(e) {
      for (var t, i, n, a = e.length, r = _.relative[e[0].type], s = r || _.relative[" "], o = r ? 1 : 0, c = l(function(e) {
        return e === t;
      }, s, !0), p = l(function(e) {
        return H.call(t, e) > -1;
      }, s, !0), f = [ function(e, i, n) {
        return !r && (n || i !== T) || ((t = i).nodeType ? c(e, i, n) : p(e, i, n));
      } ]; a > o; o++) if (i = _.relative[e[o].type]) f = [ l(d(f), i) ]; else {
        if (i = _.filter[e[o].type].apply(null, e[o].matches), i[S]) {
          for (n = ++o; a > n && !_.relative[e[n].type]; n++) ;
          return u(o > 1 && d(f), o > 1 && e.slice(0, o - 1).join("").replace(Z, "$1"), i, n > o && h(e.slice(o, n)), a > n && h(e = e.slice(n)), a > n && e.join(""));
        }
        f.push(i);
      }
      return d(f);
    }
    function p(e, t) {
      var n = t.length > 0, a = e.length > 0, r = function(s, o, l, d, u) {
        var h, p, f, m = [], g = 0, y = "0", b = s && [], x = null != u, w = T, k = s || a && _.find.TAG("*", u && o.parentNode || o), C = P += null == w ? 1 : Math.E;
        for (x && (T = o !== N && o, v = r.el); null != (h = k[y]); y++) {
          if (a && h) {
            for (p = 0; f = e[p]; p++) if (f(h, o, l)) {
              d.push(h);
              break;
            }
            x && (P = C, v = ++r.el);
          }
          n && ((h = !f && h) && g--, s && b.push(h));
        }
        if (g += y, n && y !== g) {
          for (p = 0; f = t[p]; p++) f(b, m, o, l);
          if (s) {
            if (g > 0) for (;y--; ) b[y] || m[y] || (m[y] = z.call(d));
            m = c(m);
          }
          O.apply(d, m), x && !s && m.length > 0 && g + t.length > 1 && i.uniqueSort(d);
        }
        return x && (P = C, T = w), b;
      };
      return r.el = 0, n ? R(r) : r;
    }
    function f(e, t, n, a) {
      for (var r = 0, s = t.length; s > r; r++) i(e, t[r], n, a);
      return n;
    }
    function m(e, t, i, n, a) {
      var r, s, l, d, c, u = o(e);
      if (u.length, !n && 1 === u.length) {
        if (s = u[0] = u[0].slice(0), s.length > 2 && "ID" === (l = s[0]).type && 9 === t.nodeType && !a && _.relative[s[1].type]) {
          if (t = _.find.ID(l.matches[0].replace(st, ""), t, a)[0], !t) return i;
          e = e.slice(s.shift().length);
        }
        for (r = ot.POS.test(e) ? -1 : s.length - 1; r >= 0 && (l = s[r], !_.relative[d = l.type]); r--) if ((c = _.find[d]) && (n = c(l.matches[0].replace(st, ""), nt.test(s[0].type) && t.parentNode || t, a))) {
          if (s.splice(r, 1), e = n.length && s.join(""), !e) return O.apply(i, L.call(n, 0)), 
          i;
          break;
        }
      }
      return k(e, u)(n, t, a, i, nt.test(e)), i;
    }
    function g() {}
    var v, y, _, b, x, w, k, C, E, T, $ = !0, M = "undefined", S = ("sizcache" + Math.random()).replace(".", ""), I = String, N = e.document, A = N.documentElement, P = 0, D = 0, z = [].pop, O = [].push, L = [].slice, H = [].indexOf || function(e) {
      for (var t = 0, i = this.length; i > t; t++) if (this[t] === e) return t;
      return -1;
    }, R = function(e, t) {
      return e[S] = null == t || t, e;
    }, F = function() {
      var e = {}, t = [];
      return R(function(i, n) {
        return t.push(i) > _.cacheLength && delete e[t.shift()], e[i] = n;
      }, e);
    }, j = F(), q = F(), U = F(), B = "[\\x20\\t\\r\\n\\f]", W = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+", X = W.replace("w", "w#"), Y = "([*^$|!~]?=)", G = "\\[" + B + "*(" + W + ")" + B + "*(?:" + Y + B + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + X + ")|)|)" + B + "*\\]", V = ":(" + W + ")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:" + G + ")|[^:]|\\\\.)*|.*))\\)|)", K = ":(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + B + "*((?:-\\d)?\\d*)" + B + "*\\)|)(?=[^-]|$)", Z = RegExp("^" + B + "+|((?:^|[^\\\\])(?:\\\\.)*)" + B + "+$", "g"), Q = RegExp("^" + B + "*," + B + "*"), et = RegExp("^" + B + "*([\\x20\\t\\r\\n\\f>+~])" + B + "*"), tt = RegExp(V), it = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/, nt = /[\x20\t\r\n\f]*[+~]/, at = /h\d/i, rt = /input|select|textarea|button/i, st = /\\(?!\\)/g, ot = {
      ID: RegExp("^#(" + W + ")"),
      CLASS: RegExp("^\\.(" + W + ")"),
      NAME: RegExp("^\\[name=['\"]?(" + W + ")['\"]?\\]"),
      TAG: RegExp("^(" + W.replace("w", "w*") + ")"),
      ATTR: RegExp("^" + G),
      PSEUDO: RegExp("^" + V),
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
    }, dt = lt(function(e) {
      return e.appendChild(N.createComment("")), !e.getElementsByTagName("*").length;
    }), ct = lt(function(e) {
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
      A.insertBefore(e, A.firstChild);
      var t = N.getElementsByName && N.getElementsByName(S).length === 2 + N.getElementsByName(S + 0).length;
      return y = !N.getElementById(S), A.removeChild(e), t;
    });
    try {
      L.call(A.childNodes, 0)[0].nodeType;
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
    }, b = i.getText = function(e) {
      var t, i = "", n = 0, a = e.nodeType;
      if (a) {
        if (1 === a || 9 === a || 11 === a) {
          if ("string" == typeof e.textContent) return e.textContent;
          for (e = e.firstChild; e; e = e.nextSibling) i += b(e);
        } else if (3 === a || 4 === a) return e.nodeValue;
      } else for (;t = e[n]; n++) i += b(t);
      return i;
    }, x = i.isXML = function(e) {
      var t = e && (e.ownerDocument || e).documentElement;
      return t ? "HTML" !== t.nodeName : !1;
    }, w = i.contains = A.contains ? function(e, t) {
      var i = 9 === e.nodeType ? e.documentElement : e, n = t && t.parentNode;
      return e === n || !!(n && 1 === n.nodeType && i.contains && i.contains(n));
    } : A.compareDocumentPosition ? function(e, t) {
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
          if (typeof t.getElementById !== M && !i) {
            var n = t.getElementById(e);
            return n && n.parentNode ? [ n ] : [];
          }
        } : function(e, i, n) {
          if (typeof i.getElementById !== M && !n) {
            var a = i.getElementById(e);
            return a ? a.id === e || typeof a.getAttributeNode !== M && a.getAttributeNode("id").value === e ? [ a ] : t : [];
          }
        },
        TAG: dt ? function(e, i) {
          return typeof i.getElementsByTagName !== M ? i.getElementsByTagName(e) : t;
        } : function(e, t) {
          var i = t.getElementsByTagName(e);
          if ("*" === e) {
            for (var n, a = [], r = 0; n = i[r]; r++) 1 === n.nodeType && a.push(n);
            return a;
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
          return function(a) {
            var r = i.attr(a, e);
            return null == r ? "!=" === t : t ? (r += "", "=" === t ? r === n : "!=" === t ? r !== n : "^=" === t ? n && 0 === r.indexOf(n) : "*=" === t ? n && r.indexOf(n) > -1 : "$=" === t ? n && r.substr(r.length - n.length) === n : "~=" === t ? (" " + r + " ").indexOf(n) > -1 : "|=" === t ? r === n || r.substr(0, n.length + 1) === n + "-" : !1) : !0;
          };
        },
        CHILD: function(e, t, i, n) {
          return "nth" === e ? function(e) {
            var t, a, r = e.parentNode;
            if (1 === i && 0 === n) return !0;
            if (r) for (a = 0, t = r.firstChild; t && (1 !== t.nodeType || (a++, e !== t)); t = t.nextSibling) ;
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
          var n, a = _.pseudos[e] || _.setFilters[e.toLowerCase()] || i.error("unsupported pseudo: " + e);
          return a[S] ? a(t) : a.length > 1 ? (n = [ e, e, "", t ], _.setFilters.hasOwnProperty(e.toLowerCase()) ? R(function(e, i) {
            for (var n, r = a(e, t), s = r.length; s--; ) n = H.call(e, r[s]), e[n] = !(i[n] = r[s]);
          }) : function(e) {
            return a(e, 0, n);
          }) : a;
        }
      },
      pseudos: {
        not: R(function(e) {
          var t = [], i = [], n = k(e.replace(Z, "$1"));
          return n[S] ? R(function(e, t, i, a) {
            for (var r, s = n(e, null, a, []), o = e.length; o--; ) (r = s[o]) && (e[o] = !(t[o] = r));
          }) : function(e, a, r) {
            return t[0] = e, n(t, null, r, i), !i.pop();
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
          return rt.test(e.nodeName);
        },
        focus: function(e) {
          var t = e.ownerDocument;
          return !(e !== t.activeElement || t.hasFocus && !t.hasFocus() || !e.type && !e.href);
        },
        active: function(e) {
          return e === e.ownerDocument.activeElement;
        },
        first: r(function() {
          return [ 0 ];
        }),
        last: r(function(e, t) {
          return [ t - 1 ];
        }),
        eq: r(function(e, t, i) {
          return [ 0 > i ? i + t : i ];
        }),
        even: r(function(e, t) {
          for (var i = 0; t > i; i += 2) e.push(i);
          return e;
        }),
        odd: r(function(e, t) {
          for (var i = 1; t > i; i += 2) e.push(i);
          return e;
        }),
        lt: r(function(e, t, i) {
          for (var n = 0 > i ? i + t : i; --n >= 0; ) e.push(n);
          return e;
        }),
        gt: r(function(e, t, i) {
          for (var n = 0 > i ? i + t : i; t > ++n; ) e.push(n);
          return e;
        })
      }
    }, C = A.compareDocumentPosition ? function(e, t) {
      return e === t ? (E = !0, 0) : (e.compareDocumentPosition && t.compareDocumentPosition ? 4 & e.compareDocumentPosition(t) : e.compareDocumentPosition) ? -1 : 1;
    } : function(e, t) {
      if (e === t) return E = !0, 0;
      if (e.sourceIndex && t.sourceIndex) return e.sourceIndex - t.sourceIndex;
      var i, n, a = [], r = [], o = e.parentNode, l = t.parentNode, d = o;
      if (o === l) return s(e, t);
      if (!o) return -1;
      if (!l) return 1;
      for (;d; ) a.unshift(d), d = d.parentNode;
      for (d = l; d; ) r.unshift(d), d = d.parentNode;
      i = a.length, n = r.length;
      for (var c = 0; i > c && n > c; c++) if (a[c] !== r[c]) return s(a[c], r[c]);
      return c === i ? s(e, r[c], -1) : s(a[c], t, 1);
    }, [ 0, 0 ].sort(C), $ = !E, i.uniqueSort = function(e) {
      var t, i = 1;
      if (E = $, e.sort(C), E) for (;t = e[i]; i++) t === e[i - 1] && e.splice(i--, 1);
      return e;
    }, i.error = function(e) {
      throw Error("Syntax error, unrecognized expression: " + e);
    }, k = i.compile = function(e, t) {
      var i, n = [], a = [], r = U[S][e];
      if (!r) {
        for (t || (t = o(e)), i = t.length; i--; ) r = h(t[i]), r[S] ? n.push(r) : a.push(r);
        r = U(e, p(a, n));
      }
      return r;
    }, N.querySelectorAll && function() {
      var e, t = m, n = /'|\\/g, a = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g, r = [ ":focus" ], s = [ ":active", ":focus" ], l = A.matchesSelector || A.mozMatchesSelector || A.webkitMatchesSelector || A.oMatchesSelector || A.msMatchesSelector;
      lt(function(e) {
        e.innerHTML = "<select><option selected=''></option></select>", e.querySelectorAll("[selected]").length || r.push("\\[" + B + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)"), 
        e.querySelectorAll(":checked").length || r.push(":checked");
      }), lt(function(e) {
        e.innerHTML = "<p test=''></p>", e.querySelectorAll("[test^='']").length && r.push("[*^$]=" + B + "*(?:\"\"|'')"), 
        e.innerHTML = "<input type='hidden'/>", e.querySelectorAll(":enabled").length || r.push(":enabled", ":disabled");
      }), r = RegExp(r.join("|")), m = function(e, i, a, s, l) {
        if (!(s || l || r && r.test(e))) {
          var d, c, u = !0, h = S, p = i, f = 9 === i.nodeType && e;
          if (1 === i.nodeType && "object" !== i.nodeName.toLowerCase()) {
            for (d = o(e), (u = i.getAttribute("id")) ? h = u.replace(n, "\\$&") : i.setAttribute("id", h), 
            h = "[id='" + h + "'] ", c = d.length; c--; ) d[c] = h + d[c].join("");
            p = nt.test(e) && i.parentNode || i, f = d.join(",");
          }
          if (f) try {
            return O.apply(a, L.call(p.querySelectorAll(f), 0)), a;
          } catch (m) {} finally {
            u || i.removeAttribute("id");
          }
        }
        return t(e, i, a, s, l);
      }, l && (lt(function(t) {
        e = l.call(t, "div");
        try {
          l.call(t, "[test!='']:sizzle"), s.push("!=", V);
        } catch (i) {}
      }), s = RegExp(s.join("|")), i.matchesSelector = function(t, n) {
        if (n = n.replace(a, "='$1']"), !(x(t) || s.test(n) || r && r.test(n))) try {
          var o = l.call(t, n);
          if (o || e || t.document && 11 !== t.document.nodeType) return o;
        } catch (d) {}
        return i(n, null, null, [ t ]).length > 0;
      });
    }(), _.pseudos.nth = _.pseudos.eq, _.filters = g.prototype = _.pseudos, _.setFilters = new g(), 
    i.attr = J.attr, J.find = i, J.expr = i.selectors, J.expr[":"] = J.expr.pseudos, 
    J.unique = i.uniqueSort, J.text = i.getText, J.isXMLDoc = i.isXML, J.contains = i.contains;
  }(e);
  var Dt = /Until$/, zt = /^(?:parents|prev(?:Until|All))/, Ot = /^.[^:#\[\.,]*$/, Lt = J.expr.match.needsContext, Ht = {
    children: !0,
    contents: !0,
    next: !0,
    prev: !0
  };
  J.fn.extend({
    find: function(e) {
      var t, i, n, a, r, s, o = this;
      if ("string" != typeof e) return J(e).filter(function() {
        for (t = 0, i = o.length; i > t; t++) if (J.contains(o[t], this)) return !0;
      });
      for (s = this.pushStack("", "find", e), t = 0, i = this.length; i > t; t++) if (n = s.length, 
      J.find(e, this[t], s), t > 0) for (a = n; s.length > a; a++) for (r = 0; n > r; r++) if (s[r] === s[a]) {
        s.splice(a--, 1);
        break;
      }
      return s;
    },
    has: function(e) {
      var t, i = J(e, this), n = i.length;
      return this.filter(function() {
        for (t = 0; n > t; t++) if (J.contains(this, i[t])) return !0;
      });
    },
    not: function(e) {
      return this.pushStack(d(this, e, !1), "not", e);
    },
    filter: function(e) {
      return this.pushStack(d(this, e, !0), "filter", e);
    },
    is: function(e) {
      return !!e && ("string" == typeof e ? Lt.test(e) ? J(e, this.context).index(this[0]) >= 0 : J.filter(e, this).length > 0 : this.filter(e).length > 0);
    },
    closest: function(e, t) {
      for (var i, n = 0, a = this.length, r = [], s = Lt.test(e) || "string" != typeof e ? J(e, t || this.context) : 0; a > n; n++) for (i = this[n]; i && i.ownerDocument && i !== t && 11 !== i.nodeType; ) {
        if (s ? s.index(i) > -1 : J.find.matchesSelector(i, e)) {
          r.push(i);
          break;
        }
        i = i.parentNode;
      }
      return r = r.length > 1 ? J.unique(r) : r, this.pushStack(r, "closest", e);
    },
    index: function(e) {
      return e ? "string" == typeof e ? J.inArray(this[0], J(e)) : J.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.prevAll().length : -1;
    },
    add: function(e, t) {
      var i = "string" == typeof e ? J(e, t) : J.makeArray(e && e.nodeType ? [ e ] : e), n = J.merge(this.get(), i);
      return this.pushStack(o(i[0]) || o(n[0]) ? n : J.unique(n));
    },
    addBack: function(e) {
      return this.add(null == e ? this.prevObject : this.prevObject.filter(e));
    }
  }), J.fn.andSelf = J.fn.addBack, J.each({
    parent: function(e) {
      var t = e.parentNode;
      return t && 11 !== t.nodeType ? t : null;
    },
    parents: function(e) {
      return J.dir(e, "parentNode");
    },
    parentsUntil: function(e, t, i) {
      return J.dir(e, "parentNode", i);
    },
    next: function(e) {
      return l(e, "nextSibling");
    },
    prev: function(e) {
      return l(e, "previousSibling");
    },
    nextAll: function(e) {
      return J.dir(e, "nextSibling");
    },
    prevAll: function(e) {
      return J.dir(e, "previousSibling");
    },
    nextUntil: function(e, t, i) {
      return J.dir(e, "nextSibling", i);
    },
    prevUntil: function(e, t, i) {
      return J.dir(e, "previousSibling", i);
    },
    siblings: function(e) {
      return J.sibling((e.parentNode || {}).firstChild, e);
    },
    children: function(e) {
      return J.sibling(e.firstChild);
    },
    contents: function(e) {
      return J.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : J.merge([], e.childNodes);
    }
  }, function(e, t) {
    J.fn[e] = function(i, n) {
      var a = J.map(this, t, i);
      return Dt.test(e) || (n = i), n && "string" == typeof n && (a = J.filter(n, a)), 
      a = this.length > 1 && !Ht[e] ? J.unique(a) : a, this.length > 1 && zt.test(e) && (a = a.reverse()), 
      this.pushStack(a, e, Y.call(arguments).join(","));
    };
  }), J.extend({
    filter: function(e, t, i) {
      return i && (e = ":not(" + e + ")"), 1 === t.length ? J.find.matchesSelector(t[0], e) ? [ t[0] ] : [] : J.find.matches(e, t);
    },
    dir: function(e, i, n) {
      for (var a = [], r = e[i]; r && 9 !== r.nodeType && (n === t || 1 !== r.nodeType || !J(r).is(n)); ) 1 === r.nodeType && a.push(r), 
      r = r[i];
      return a;
    },
    sibling: function(e, t) {
      for (var i = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && i.push(e);
      return i;
    }
  });
  var Rt = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", Ft = / jQuery\d+="(?:null|\d+)"/g, jt = /^\s+/, qt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, Ut = /<([\w:]+)/, Bt = /<tbody/i, Wt = /<|&#?\w+;/, Xt = /<(?:script|style|link)/i, Yt = /<(?:script|object|embed|option|style)/i, Gt = RegExp("<(?:" + Rt + ")[\\s/>]", "i"), Vt = /^(?:checkbox|radio)$/, Kt = /checked\s*(?:[^=]|=\s*.checked.)/i, Zt = /\/(java|ecma)script/i, Jt = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g, Qt = {
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
  Qt.th = Qt.td, J.support.htmlSerialize || (Qt._default = [ 1, "X<div>", "</div>" ]), 
  J.fn.extend({
    text: function(e) {
      return J.access(this, function(e) {
        return e === t ? J.text(this) : this.empty().append((this[0] && this[0].ownerDocument || j).createTextNode(e));
      }, null, e, arguments.length);
    },
    wrapAll: function(e) {
      if (J.isFunction(e)) return this.each(function(t) {
        J(this).wrapAll(e.call(this, t));
      });
      if (this[0]) {
        var t = J(e, this[0].ownerDocument).eq(0).clone(!0);
        this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
          for (var e = this; e.firstChild && 1 === e.firstChild.nodeType; ) e = e.firstChild;
          return e;
        }).append(this);
      }
      return this;
    },
    wrapInner: function(e) {
      return J.isFunction(e) ? this.each(function(t) {
        J(this).wrapInner(e.call(this, t));
      }) : this.each(function() {
        var t = J(this), i = t.contents();
        i.length ? i.wrapAll(e) : t.append(e);
      });
    },
    wrap: function(e) {
      var t = J.isFunction(e);
      return this.each(function(i) {
        J(this).wrapAll(t ? e.call(this, i) : e);
      });
    },
    unwrap: function() {
      return this.parent().each(function() {
        J.nodeName(this, "body") || J(this).replaceWith(this.childNodes);
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
        var e = J.clean(arguments);
        return this.pushStack(J.merge(e, this), "before", this.selector);
      }
    },
    after: function() {
      if (!o(this[0])) return this.domManip(arguments, !1, function(e) {
        this.parentNode.insertBefore(e, this.nextSibling);
      });
      if (arguments.length) {
        var e = J.clean(arguments);
        return this.pushStack(J.merge(this, e), "after", this.selector);
      }
    },
    remove: function(e, t) {
      for (var i, n = 0; null != (i = this[n]); n++) (!e || J.filter(e, [ i ]).length) && (t || 1 !== i.nodeType || (J.cleanData(i.getElementsByTagName("*")), 
      J.cleanData([ i ])), i.parentNode && i.parentNode.removeChild(i));
      return this;
    },
    empty: function() {
      for (var e, t = 0; null != (e = this[t]); t++) for (1 === e.nodeType && J.cleanData(e.getElementsByTagName("*")); e.firstChild; ) e.removeChild(e.firstChild);
      return this;
    },
    clone: function(e, t) {
      return e = null == e ? !1 : e, t = null == t ? e : t, this.map(function() {
        return J.clone(this, e, t);
      });
    },
    html: function(e) {
      return J.access(this, function(e) {
        var i = this[0] || {}, n = 0, a = this.length;
        if (e === t) return 1 === i.nodeType ? i.innerHTML.replace(Ft, "") : t;
        if (!("string" != typeof e || Xt.test(e) || !J.support.htmlSerialize && Gt.test(e) || !J.support.leadingWhitespace && jt.test(e) || Qt[(Ut.exec(e) || [ "", "" ])[1].toLowerCase()])) {
          e = e.replace(qt, "<$1></$2>");
          try {
            for (;a > n; n++) i = this[n] || {}, 1 === i.nodeType && (J.cleanData(i.getElementsByTagName("*")), 
            i.innerHTML = e);
            i = 0;
          } catch (r) {}
        }
        i && this.empty().append(e);
      }, null, e, arguments.length);
    },
    replaceWith: function(e) {
      return o(this[0]) ? this.length ? this.pushStack(J(J.isFunction(e) ? e() : e), "replaceWith", e) : this : J.isFunction(e) ? this.each(function(t) {
        var i = J(this), n = i.html();
        i.replaceWith(e.call(this, t, n));
      }) : ("string" != typeof e && (e = J(e).detach()), this.each(function() {
        var t = this.nextSibling, i = this.parentNode;
        J(this).remove(), t ? J(t).before(e) : J(i).append(e);
      }));
    },
    detach: function(e) {
      return this.remove(e, !0);
    },
    domManip: function(e, i, n) {
      e = [].concat.apply([], e);
      var a, r, s, o, l = 0, d = e[0], c = [], h = this.length;
      if (!J.support.checkClone && h > 1 && "string" == typeof d && Kt.test(d)) return this.each(function() {
        J(this).domManip(e, i, n);
      });
      if (J.isFunction(d)) return this.each(function(a) {
        var r = J(this);
        e[0] = d.call(this, a, i ? r.html() : t), r.domManip(e, i, n);
      });
      if (this[0]) {
        if (a = J.buildFragment(e, this, c), s = a.fragment, r = s.firstChild, 1 === s.childNodes.length && (s = r), 
        r) for (i = i && J.nodeName(r, "tr"), o = a.cacheable || h - 1; h > l; l++) n.call(i && J.nodeName(this[l], "table") ? u(this[l], "tbody") : this[l], l === o ? s : J.clone(s, !0, !0));
        s = r = null, c.length && J.each(c, function(e, t) {
          t.src ? J.ajax ? J.ajax({
            url: t.src,
            type: "GET",
            dataType: "script",
            async: !1,
            global: !1,
            "throws": !0
          }) : J.error("no ajax") : J.globalEval((t.text || t.textContent || t.innerHTML || "").replace(Jt, "")), 
          t.parentNode && t.parentNode.removeChild(t);
        });
      }
      return this;
    }
  }), J.buildFragment = function(e, i, n) {
    var a, r, s, o = e[0];
    return i = i || j, i = !i.nodeType && i[0] || i, i = i.ownerDocument || i, !(1 === e.length && "string" == typeof o && 512 > o.length && i === j && "<" === o.charAt(0)) || Yt.test(o) || !J.support.checkClone && Kt.test(o) || !J.support.html5Clone && Gt.test(o) || (r = !0, 
    a = J.fragments[o], s = a !== t), a || (a = i.createDocumentFragment(), J.clean(e, i, a, n), 
    r && (J.fragments[o] = s && a)), {
      fragment: a,
      cacheable: r
    };
  }, J.fragments = {}, J.each({
    appendTo: "append",
    prependTo: "prepend",
    insertBefore: "before",
    insertAfter: "after",
    replaceAll: "replaceWith"
  }, function(e, t) {
    J.fn[e] = function(i) {
      var n, a = 0, r = [], s = J(i), o = s.length, l = 1 === this.length && this[0].parentNode;
      if ((null == l || l && 11 === l.nodeType && 1 === l.childNodes.length) && 1 === o) return s[t](this[0]), 
      this;
      for (;o > a; a++) n = (a > 0 ? this.clone(!0) : this).get(), J(s[a])[t](n), r = r.concat(n);
      return this.pushStack(r, e, s.selector);
    };
  }), J.extend({
    clone: function(e, t, i) {
      var n, a, r, s;
      if (J.support.html5Clone || J.isXMLDoc(e) || !Gt.test("<" + e.nodeName + ">") ? s = e.cloneNode(!0) : (ti.innerHTML = e.outerHTML, 
      ti.removeChild(s = ti.firstChild)), !(J.support.noCloneEvent && J.support.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || J.isXMLDoc(e))) for (p(e, s), 
      n = f(e), a = f(s), r = 0; n[r]; ++r) a[r] && p(n[r], a[r]);
      if (t && (h(e, s), i)) for (n = f(e), a = f(s), r = 0; n[r]; ++r) h(n[r], a[r]);
      return n = a = null, s;
    },
    clean: function(e, i, n, a) {
      var r, s, o, l, d, u, h, p, f, g, v, y = i === j && ei, _ = [];
      for (i && i.createDocumentFragment !== t || (i = j), r = 0; null != (o = e[r]); r++) if ("number" == typeof o && (o += ""), 
      o) {
        if ("string" == typeof o) if (Wt.test(o)) {
          for (y = y || c(i), h = i.createElement("div"), y.appendChild(h), o = o.replace(qt, "<$1></$2>"), 
          l = (Ut.exec(o) || [ "", "" ])[1].toLowerCase(), d = Qt[l] || Qt._default, u = d[0], 
          h.innerHTML = d[1] + o + d[2]; u--; ) h = h.lastChild;
          if (!J.support.tbody) for (p = Bt.test(o), f = "table" !== l || p ? "<table>" !== d[1] || p ? [] : h.childNodes : h.firstChild && h.firstChild.childNodes, 
          s = f.length - 1; s >= 0; --s) J.nodeName(f[s], "tbody") && !f[s].childNodes.length && f[s].parentNode.removeChild(f[s]);
          !J.support.leadingWhitespace && jt.test(o) && h.insertBefore(i.createTextNode(jt.exec(o)[0]), h.firstChild), 
          o = h.childNodes, h.parentNode.removeChild(h);
        } else o = i.createTextNode(o);
        o.nodeType ? _.push(o) : J.merge(_, o);
      }
      if (h && (o = h = y = null), !J.support.appendChecked) for (r = 0; null != (o = _[r]); r++) J.nodeName(o, "input") ? m(o) : o.getElementsByTagName !== t && J.grep(o.getElementsByTagName("input"), m);
      if (n) for (g = function(e) {
        return !e.type || Zt.test(e.type) ? a ? a.push(e.parentNode ? e.parentNode.removeChild(e) : e) : n.appendChild(e) : t;
      }, r = 0; null != (o = _[r]); r++) J.nodeName(o, "script") && g(o) || (n.appendChild(o), 
      o.getElementsByTagName !== t && (v = J.grep(J.merge([], o.getElementsByTagName("script")), g), 
      _.splice.apply(_, [ r + 1, 0 ].concat(v)), r += v.length));
      return _;
    },
    cleanData: function(e, t) {
      for (var i, n, a, r, s = 0, o = J.expando, l = J.cache, d = J.support.deleteExpando, c = J.event.special; null != (a = e[s]); s++) if ((t || J.acceptData(a)) && (n = a[o], 
      i = n && l[n])) {
        if (i.events) for (r in i.events) c[r] ? J.event.remove(a, r) : J.removeEvent(a, r, i.handle);
        l[n] && (delete l[n], d ? delete a[o] : a.removeAttribute ? a.removeAttribute(o) : a[o] = null, 
        J.deletedIds.push(n));
      }
    }
  }), function() {
    var e, t;
    J.uaMatch = function(e) {
      e = e.toLowerCase();
      var t = /(chrome)[ \/]([\w.]+)/.exec(e) || /(webkit)[ \/]([\w.]+)/.exec(e) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e) || /(msie) ([\w.]+)/.exec(e) || 0 > e.indexOf("compatible") && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e) || [];
      return {
        browser: t[1] || "",
        version: t[2] || "0"
      };
    }, e = J.uaMatch(U.userAgent), t = {}, e.browser && (t[e.browser] = !0, t.version = e.version), 
    t.chrome ? t.webkit = !0 : t.webkit && (t.safari = !0), J.browser = t, J.sub = function() {
      function e(t, i) {
        return new e.fn.init(t, i);
      }
      J.extend(!0, e, this), e.superclass = this, e.fn = e.prototype = this(), e.fn.constructor = e, 
      e.sub = this.sub, e.fn.init = function(i, n) {
        return n && n instanceof J && !(n instanceof e) && (n = e(n)), J.fn.init.call(this, i, n, t);
      }, e.fn.init.prototype = e.fn;
      var t = e(j);
      return e;
    };
  }();
  var ii, ni, ai, ri = /alpha\([^)]*\)/i, si = /opacity=([^)]*)/, oi = /^(top|right|bottom|left)$/, li = /^(none|table(?!-c[ea]).+)/, di = /^margin/, ci = RegExp("^(" + Q + ")(.*)$", "i"), ui = RegExp("^(" + Q + ")(?!px)[a-z%]+$", "i"), hi = RegExp("^([-+])=(" + Q + ")", "i"), pi = {}, fi = {
    position: "absolute",
    visibility: "hidden",
    display: "block"
  }, mi = {
    letterSpacing: 0,
    fontWeight: 400
  }, gi = [ "Top", "Right", "Bottom", "Left" ], vi = [ "Webkit", "O", "Moz", "ms" ], yi = J.fn.toggle;
  J.fn.extend({
    css: function(e, i) {
      return J.access(this, function(e, i, n) {
        return n !== t ? J.style(e, i, n) : J.css(e, i);
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
      return J.isFunction(e) && J.isFunction(t) ? yi.apply(this, arguments) : this.each(function() {
        (i ? e : v(this)) ? J(this).show() : J(this).hide();
      });
    }
  }), J.extend({
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
      "float": J.support.cssFloat ? "cssFloat" : "styleFloat"
    },
    style: function(e, i, n, a) {
      if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
        var r, s, o, l = J.camelCase(i), d = e.style;
        if (i = J.cssProps[l] || (J.cssProps[l] = g(d, l)), o = J.cssHooks[i] || J.cssHooks[l], 
        n === t) return o && "get" in o && (r = o.get(e, !1, a)) !== t ? r : d[i];
        if (s = typeof n, "string" === s && (r = hi.exec(n)) && (n = (r[1] + 1) * r[2] + parseFloat(J.css(e, i)), 
        s = "number"), !(null == n || "number" === s && isNaN(n) || ("number" !== s || J.cssNumber[l] || (n += "px"), 
        o && "set" in o && (n = o.set(e, n, a)) === t))) try {
          d[i] = n;
        } catch (c) {}
      }
    },
    css: function(e, i, n, a) {
      var r, s, o, l = J.camelCase(i);
      return i = J.cssProps[l] || (J.cssProps[l] = g(e.style, l)), o = J.cssHooks[i] || J.cssHooks[l], 
      o && "get" in o && (r = o.get(e, !0, a)), r === t && (r = ii(e, i)), "normal" === r && i in mi && (r = mi[i]), 
      n || a !== t ? (s = parseFloat(r), n || J.isNumeric(s) ? s || 0 : r) : r;
    },
    swap: function(e, t, i) {
      var n, a, r = {};
      for (a in t) r[a] = e.style[a], e.style[a] = t[a];
      n = i.call(e);
      for (a in t) e.style[a] = r[a];
      return n;
    }
  }), e.getComputedStyle ? ii = function(t, i) {
    var n, a, r, s, o = e.getComputedStyle(t, null), l = t.style;
    return o && (n = o[i], "" !== n || J.contains(t.ownerDocument, t) || (n = J.style(t, i)), 
    ui.test(n) && di.test(i) && (a = l.width, r = l.minWidth, s = l.maxWidth, l.minWidth = l.maxWidth = l.width = n, 
    n = o.width, l.width = a, l.minWidth = r, l.maxWidth = s)), n;
  } : j.documentElement.currentStyle && (ii = function(e, t) {
    var i, n, a = e.currentStyle && e.currentStyle[t], r = e.style;
    return null == a && r && r[t] && (a = r[t]), ui.test(a) && !oi.test(t) && (i = r.left, 
    n = e.runtimeStyle && e.runtimeStyle.left, n && (e.runtimeStyle.left = e.currentStyle.left), 
    r.left = "fontSize" === t ? "1em" : a, a = r.pixelLeft + "px", r.left = i, n && (e.runtimeStyle.left = n)), 
    "" === a ? "auto" : a;
  }), J.each([ "height", "width" ], function(e, i) {
    J.cssHooks[i] = {
      get: function(e, n, a) {
        return n ? 0 === e.offsetWidth && li.test(ii(e, "display")) ? J.swap(e, fi, function() {
          return x(e, i, a);
        }) : x(e, i, a) : t;
      },
      set: function(e, t, n) {
        return _(e, t, n ? b(e, i, n, J.support.boxSizing && "border-box" === J.css(e, "boxSizing")) : 0);
      }
    };
  }), J.support.opacity || (J.cssHooks.opacity = {
    get: function(e, t) {
      return si.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : "";
    },
    set: function(e, t) {
      var i = e.style, n = e.currentStyle, a = J.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : "", r = n && n.filter || i.filter || "";
      i.zoom = 1, t >= 1 && "" === J.trim(r.replace(ri, "")) && i.removeAttribute && (i.removeAttribute("filter"), 
      n && !n.filter) || (i.filter = ri.test(r) ? r.replace(ri, a) : r + " " + a);
    }
  }), J(function() {
    J.support.reliableMarginRight || (J.cssHooks.marginRight = {
      get: function(e, i) {
        return J.swap(e, {
          display: "inline-block"
        }, function() {
          return i ? ii(e, "marginRight") : t;
        });
      }
    }), !J.support.pixelPosition && J.fn.position && J.each([ "top", "left" ], function(e, t) {
      J.cssHooks[t] = {
        get: function(e, i) {
          if (i) {
            var n = ii(e, t);
            return ui.test(n) ? J(e).position()[t] + "px" : n;
          }
        }
      };
    });
  }), J.expr && J.expr.filters && (J.expr.filters.hidden = function(e) {
    return 0 === e.offsetWidth && 0 === e.offsetHeight || !J.support.reliableHiddenOffsets && "none" === (e.style && e.style.display || ii(e, "display"));
  }, J.expr.filters.visible = function(e) {
    return !J.expr.filters.hidden(e);
  }), J.each({
    margin: "",
    padding: "",
    border: "Width"
  }, function(e, t) {
    J.cssHooks[e + t] = {
      expand: function(i) {
        var n, a = "string" == typeof i ? i.split(" ") : [ i ], r = {};
        for (n = 0; 4 > n; n++) r[e + gi[n] + t] = a[n] || a[n - 2] || a[0];
        return r;
      }
    }, di.test(e) || (J.cssHooks[e + t].set = _);
  });
  var _i = /%20/g, bi = /\[\]$/, xi = /\r?\n/g, wi = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i, ki = /^(?:select|textarea)/i;
  J.fn.extend({
    serialize: function() {
      return J.param(this.serializeArray());
    },
    serializeArray: function() {
      return this.map(function() {
        return this.elements ? J.makeArray(this.elements) : this;
      }).filter(function() {
        return this.name && !this.disabled && (this.checked || ki.test(this.nodeName) || wi.test(this.type));
      }).map(function(e, t) {
        var i = J(this).val();
        return null == i ? null : J.isArray(i) ? J.map(i, function(e) {
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
  }), J.param = function(e, i) {
    var n, a = [], r = function(e, t) {
      t = J.isFunction(t) ? t() : null == t ? "" : t, a[a.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t);
    };
    if (i === t && (i = J.ajaxSettings && J.ajaxSettings.traditional), J.isArray(e) || e.jquery && !J.isPlainObject(e)) J.each(e, function() {
      r(this.name, this.value);
    }); else for (n in e) k(n, e[n], i, r);
    return a.join("&").replace(_i, "+");
  };
  var Ci, Ei, Ti = /#.*$/, $i = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, Mi = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/, Si = /^(?:GET|HEAD)$/, Ii = /^\/\//, Ni = /\?/, Ai = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, Pi = /([?&])_=[^&]*/, Di = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/, zi = J.fn.load, Oi = {}, Li = {}, Hi = [ "*/" ] + [ "*" ];
  try {
    Ei = q.href;
  } catch (Ri) {
    Ei = j.createElement("a"), Ei.href = "", Ei = Ei.href;
  }
  Ci = Di.exec(Ei.toLowerCase()) || [], J.fn.load = function(e, i, n) {
    if ("string" != typeof e && zi) return zi.apply(this, arguments);
    if (!this.length) return this;
    var a, r, s, o = this, l = e.indexOf(" ");
    return l >= 0 && (a = e.slice(l, e.length), e = e.slice(0, l)), J.isFunction(i) ? (n = i, 
    i = t) : i && "object" == typeof i && (r = "POST"), J.ajax({
      url: e,
      type: r,
      dataType: "html",
      data: i,
      complete: function(e, t) {
        n && o.each(n, s || [ e.responseText, t, e ]);
      }
    }).done(function(e) {
      s = arguments, o.html(a ? J("<div>").append(e.replace(Ai, "")).find(a) : e);
    }), this;
  }, J.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(e, t) {
    J.fn[t] = function(e) {
      return this.on(t, e);
    };
  }), J.each([ "get", "post" ], function(e, i) {
    J[i] = function(e, n, a, r) {
      return J.isFunction(n) && (r = r || a, a = n, n = t), J.ajax({
        type: i,
        url: e,
        data: n,
        success: a,
        dataType: r
      });
    };
  }), J.extend({
    getScript: function(e, i) {
      return J.get(e, t, i, "script");
    },
    getJSON: function(e, t, i) {
      return J.get(e, t, i, "json");
    },
    ajaxSetup: function(e, t) {
      return t ? T(e, J.ajaxSettings) : (t = e, e = J.ajaxSettings), T(e, t), e;
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
        "text json": J.parseJSON,
        "text xml": J.parseXML
      },
      flatOptions: {
        context: !0,
        url: !0
      }
    },
    ajaxPrefilter: C(Oi),
    ajaxTransport: C(Li),
    ajax: function(e, i) {
      function n(e, i, n, s) {
        var d, u, y, _, x, k = i;
        2 !== b && (b = 2, l && clearTimeout(l), o = t, r = s || "", w.readyState = e > 0 ? 4 : 0, 
        n && (_ = $(h, w, n)), e >= 200 && 300 > e || 304 === e ? (h.ifModified && (x = w.getResponseHeader("Last-Modified"), 
        x && (J.lastModified[a] = x), x = w.getResponseHeader("Etag"), x && (J.etag[a] = x)), 
        304 === e ? (k = "notmodified", d = !0) : (d = M(h, _), k = d.state, u = d.data, 
        y = d.error, d = !y)) : (y = k, (!k || e) && (k = "error", 0 > e && (e = 0))), w.status = e, 
        w.statusText = (i || k) + "", d ? m.resolveWith(p, [ u, k, w ]) : m.rejectWith(p, [ w, k, y ]), 
        w.statusCode(v), v = t, c && f.trigger("ajax" + (d ? "Success" : "Error"), [ w, h, d ? u : y ]), 
        g.fireWith(p, [ w, k ]), c && (f.trigger("ajaxComplete", [ w, h ]), --J.active || J.event.trigger("ajaxStop")));
      }
      "object" == typeof e && (i = e, e = t), i = i || {};
      var a, r, s, o, l, d, c, u, h = J.ajaxSetup({}, i), p = h.context || h, f = p !== h && (p.nodeType || p instanceof J) ? J(p) : J.event, m = J.Deferred(), g = J.Callbacks("once memory"), v = h.statusCode || {}, y = {}, _ = {}, b = 0, x = "canceled", w = {
        readyState: 0,
        setRequestHeader: function(e, t) {
          if (!b) {
            var i = e.toLowerCase();
            e = _[i] = _[i] || e, y[e] = t;
          }
          return this;
        },
        getAllResponseHeaders: function() {
          return 2 === b ? r : null;
        },
        getResponseHeader: function(e) {
          var i;
          if (2 === b) {
            if (!s) for (s = {}; i = $i.exec(r); ) s[i[1].toLowerCase()] = i[2];
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
      }, h.url = ((e || h.url) + "").replace(Ti, "").replace(Ii, Ci[1] + "//"), h.dataTypes = J.trim(h.dataType || "*").toLowerCase().split(tt), 
      null == h.crossDomain && (d = Di.exec(h.url.toLowerCase()) || !1, h.crossDomain = d && d.join(":") + (d[3] ? "" : "http:" === d[1] ? 80 : 443) !== Ci.join(":") + (Ci[3] ? "" : "http:" === Ci[1] ? 80 : 443)), 
      h.data && h.processData && "string" != typeof h.data && (h.data = J.param(h.data, h.traditional)), 
      E(Oi, h, i, w), 2 === b) return w;
      if (c = h.global, h.type = h.type.toUpperCase(), h.hasContent = !Si.test(h.type), 
      c && 0 === J.active++ && J.event.trigger("ajaxStart"), !h.hasContent && (h.data && (h.url += (Ni.test(h.url) ? "&" : "?") + h.data, 
      delete h.data), a = h.url, h.cache === !1)) {
        var k = J.now(), C = h.url.replace(Pi, "$1_=" + k);
        h.url = C + (C === h.url ? (Ni.test(h.url) ? "&" : "?") + "_=" + k : "");
      }
      (h.data && h.hasContent && h.contentType !== !1 || i.contentType) && w.setRequestHeader("Content-Type", h.contentType), 
      h.ifModified && (a = a || h.url, J.lastModified[a] && w.setRequestHeader("If-Modified-Since", J.lastModified[a]), 
      J.etag[a] && w.setRequestHeader("If-None-Match", J.etag[a])), w.setRequestHeader("Accept", h.dataTypes[0] && h.accepts[h.dataTypes[0]] ? h.accepts[h.dataTypes[0]] + ("*" !== h.dataTypes[0] ? ", " + Hi + "; q=0.01" : "") : h.accepts["*"]);
      for (u in h.headers) w.setRequestHeader(u, h.headers[u]);
      if (h.beforeSend && (h.beforeSend.call(p, w, h) === !1 || 2 === b)) return w.abort();
      x = "abort";
      for (u in {
        success: 1,
        error: 1,
        complete: 1
      }) w[u](h[u]);
      if (o = E(Li, h, i, w)) {
        w.readyState = 1, c && f.trigger("ajaxSend", [ w, h ]), h.async && h.timeout > 0 && (l = setTimeout(function() {
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
  var Fi = [], ji = /\?/, qi = /(=)\?(?=&|$)|\?\?/, Ui = J.now();
  J.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function() {
      var e = Fi.pop() || J.expando + "_" + Ui++;
      return this[e] = !0, e;
    }
  }), J.ajaxPrefilter("json jsonp", function(i, n, a) {
    var r, s, o, l = i.data, d = i.url, c = i.jsonp !== !1, u = c && qi.test(d), h = c && !u && "string" == typeof l && !(i.contentType || "").indexOf("application/x-www-form-urlencoded") && qi.test(l);
    return "jsonp" === i.dataTypes[0] || u || h ? (r = i.jsonpCallback = J.isFunction(i.jsonpCallback) ? i.jsonpCallback() : i.jsonpCallback, 
    s = e[r], u ? i.url = d.replace(qi, "$1" + r) : h ? i.data = l.replace(qi, "$1" + r) : c && (i.url += (ji.test(d) ? "&" : "?") + i.jsonp + "=" + r), 
    i.converters["script json"] = function() {
      return o || J.error(r + " was not called"), o[0];
    }, i.dataTypes[0] = "json", e[r] = function() {
      o = arguments;
    }, a.always(function() {
      e[r] = s, i[r] && (i.jsonpCallback = n.jsonpCallback, Fi.push(r)), o && J.isFunction(s) && s(o[0]), 
      o = s = t;
    }), "script") : t;
  }), J.ajaxSetup({
    accepts: {
      script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
    },
    contents: {
      script: /javascript|ecmascript/
    },
    converters: {
      "text script": function(e) {
        return J.globalEval(e), e;
      }
    }
  }), J.ajaxPrefilter("script", function(e) {
    e.cache === t && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1);
  }), J.ajaxTransport("script", function(e) {
    if (e.crossDomain) {
      var i, n = j.head || j.getElementsByTagName("head")[0] || j.documentElement;
      return {
        send: function(a, r) {
          i = j.createElement("script"), i.async = "async", e.scriptCharset && (i.charset = e.scriptCharset), 
          i.src = e.url, i.onload = i.onreadystatechange = function(e, a) {
            (a || !i.readyState || /loaded|complete/.test(i.readyState)) && (i.onload = i.onreadystatechange = null, 
            n && i.parentNode && n.removeChild(i), i = t, a || r(200, "success"));
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
  J.ajaxSettings.xhr = e.ActiveXObject ? function() {
    return !this.isLocal && S() || I();
  } : S, function(e) {
    J.extend(J.support, {
      ajax: !!e,
      cors: !!e && "withCredentials" in e
    });
  }(J.ajaxSettings.xhr()), J.support.ajax && J.ajaxTransport(function(i) {
    if (!i.crossDomain || J.support.cors) {
      var n;
      return {
        send: function(a, r) {
          var s, o, l = i.xhr();
          if (i.username ? l.open(i.type, i.url, i.async, i.username, i.password) : l.open(i.type, i.url, i.async), 
          i.xhrFields) for (o in i.xhrFields) l[o] = i.xhrFields[o];
          i.mimeType && l.overrideMimeType && l.overrideMimeType(i.mimeType), i.crossDomain || a["X-Requested-With"] || (a["X-Requested-With"] = "XMLHttpRequest");
          try {
            for (o in a) l.setRequestHeader(o, a[o]);
          } catch (d) {}
          l.send(i.hasContent && i.data || null), n = function(e, a) {
            var o, d, c, u, h;
            try {
              if (n && (a || 4 === l.readyState)) if (n = t, s && (l.onreadystatechange = J.noop, 
              Wi && delete Bi[s]), a) 4 !== l.readyState && l.abort(); else {
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
              a || r(-1, f);
            }
            u && r(o, d, u, c);
          }, i.async ? 4 === l.readyState ? setTimeout(n, 0) : (s = ++Xi, Wi && (Bi || (Bi = {}, 
          J(e).unload(Wi)), Bi[s] = n), l.onreadystatechange = n) : n();
        },
        abort: function() {
          n && n(0, 1);
        }
      };
    }
  });
  var Yi, Gi, Vi = /^(?:toggle|show|hide)$/, Ki = RegExp("^(?:([-+])=|)(" + Q + ")([a-z%]*)$", "i"), Zi = /queueHooks$/, Ji = [ z ], Qi = {
    "*": [ function(e, t) {
      var i, n, a = this.createTween(e, t), r = Ki.exec(t), s = a.cur(), o = +s || 0, l = 1, d = 20;
      if (r) {
        if (i = +r[2], n = r[3] || (J.cssNumber[e] ? "" : "px"), "px" !== n && o) {
          o = J.css(a.elem, e, !0) || i || 1;
          do l = l || ".5", o /= l, J.style(a.elem, e, o + n); while (l !== (l = a.cur() / s) && 1 !== l && --d);
        }
        a.unit = n, a.start = o, a.end = r[1] ? o + (r[1] + 1) * i : i;
      }
      return a;
    } ]
  };
  J.Animation = J.extend(P, {
    tweener: function(e, t) {
      J.isFunction(e) ? (t = e, e = [ "*" ]) : e = e.split(" ");
      for (var i, n = 0, a = e.length; a > n; n++) i = e[n], Qi[i] = Qi[i] || [], Qi[i].unshift(t);
    },
    prefilter: function(e, t) {
      t ? Ji.unshift(e) : Ji.push(e);
    }
  }), J.Tween = O, O.prototype = {
    constructor: O,
    init: function(e, t, i, n, a, r) {
      this.elem = e, this.prop = i, this.easing = a || "swing", this.options = t, this.start = this.now = this.cur(), 
      this.end = n, this.unit = r || (J.cssNumber[i] ? "" : "px");
    },
    cur: function() {
      var e = O.propHooks[this.prop];
      return e && e.get ? e.get(this) : O.propHooks._default.get(this);
    },
    run: function(e) {
      var t, i = O.propHooks[this.prop];
      return this.pos = t = this.options.duration ? J.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : e, 
      this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), 
      i && i.set ? i.set(this) : O.propHooks._default.set(this), this;
    }
  }, O.prototype.init.prototype = O.prototype, O.propHooks = {
    _default: {
      get: function(e) {
        var t;
        return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = J.css(e.elem, e.prop, !1, ""), 
        t && "auto" !== t ? t : 0) : e.elem[e.prop];
      },
      set: function(e) {
        J.fx.step[e.prop] ? J.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[J.cssProps[e.prop]] || J.cssHooks[e.prop]) ? J.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now;
      }
    }
  }, O.propHooks.scrollTop = O.propHooks.scrollLeft = {
    set: function(e) {
      e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now);
    }
  }, J.each([ "toggle", "show", "hide" ], function(e, t) {
    var i = J.fn[t];
    J.fn[t] = function(n, a, r) {
      return null == n || "boolean" == typeof n || !e && J.isFunction(n) && J.isFunction(a) ? i.apply(this, arguments) : this.animate(L(t, !0), n, a, r);
    };
  }), J.fn.extend({
    fadeTo: function(e, t, i, n) {
      return this.filter(v).css("opacity", 0).show().end().animate({
        opacity: t
      }, e, i, n);
    },
    animate: function(e, t, i, n) {
      var a = J.isEmptyObject(e), r = J.speed(t, i, n), s = function() {
        var t = P(this, J.extend({}, e), r);
        a && t.stop(!0);
      };
      return a || r.queue === !1 ? this.each(s) : this.queue(r.queue, s);
    },
    stop: function(e, i, n) {
      var a = function(e) {
        var t = e.stop;
        delete e.stop, t(n);
      };
      return "string" != typeof e && (n = i, i = e, e = t), i && e !== !1 && this.queue(e || "fx", []), 
      this.each(function() {
        var t = !0, i = null != e && e + "queueHooks", r = J.timers, s = J._data(this);
        if (i) s[i] && s[i].stop && a(s[i]); else for (i in s) s[i] && s[i].stop && Zi.test(i) && a(s[i]);
        for (i = r.length; i--; ) r[i].elem !== this || null != e && r[i].queue !== e || (r[i].anim.stop(n), 
        t = !1, r.splice(i, 1));
        (t || !n) && J.dequeue(this, e);
      });
    }
  }), J.each({
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
    J.fn[e] = function(e, i, n) {
      return this.animate(t, e, i, n);
    };
  }), J.speed = function(e, t, i) {
    var n = e && "object" == typeof e ? J.extend({}, e) : {
      complete: i || !i && t || J.isFunction(e) && e,
      duration: e,
      easing: i && t || t && !J.isFunction(t) && t
    };
    return n.duration = J.fx.off ? 0 : "number" == typeof n.duration ? n.duration : n.duration in J.fx.speeds ? J.fx.speeds[n.duration] : J.fx.speeds._default, 
    (null == n.queue || n.queue === !0) && (n.queue = "fx"), n.old = n.complete, n.complete = function() {
      J.isFunction(n.old) && n.old.call(this), n.queue && J.dequeue(this, n.queue);
    }, n;
  }, J.easing = {
    linear: function(e) {
      return e;
    },
    swing: function(e) {
      return .5 - Math.cos(e * Math.PI) / 2;
    }
  }, J.timers = [], J.fx = O.prototype.init, J.fx.tick = function() {
    for (var e, t = J.timers, i = 0; t.length > i; i++) e = t[i], e() || t[i] !== e || t.splice(i--, 1);
    t.length || J.fx.stop();
  }, J.fx.timer = function(e) {
    e() && J.timers.push(e) && !Gi && (Gi = setInterval(J.fx.tick, J.fx.interval));
  }, J.fx.interval = 13, J.fx.stop = function() {
    clearInterval(Gi), Gi = null;
  }, J.fx.speeds = {
    slow: 600,
    fast: 200,
    _default: 400
  }, J.fx.step = {}, J.expr && J.expr.filters && (J.expr.filters.animated = function(e) {
    return J.grep(J.timers, function(t) {
      return e === t.elem;
    }).length;
  });
  var en = /^(?:body|html)$/i;
  J.fn.offset = function(e) {
    if (arguments.length) return e === t ? this : this.each(function(t) {
      J.offset.setOffset(this, e, t);
    });
    var i, n, a, r, s, o, l, d = {
      top: 0,
      left: 0
    }, c = this[0], u = c && c.ownerDocument;
    if (u) return (n = u.body) === c ? J.offset.bodyOffset(c) : (i = u.documentElement, 
    J.contains(i, c) ? (c.getBoundingClientRect !== t && (d = c.getBoundingClientRect()), 
    a = H(u), r = i.clientTop || n.clientTop || 0, s = i.clientLeft || n.clientLeft || 0, 
    o = a.pageYOffset || i.scrollTop, l = a.pageXOffset || i.scrollLeft, {
      top: d.top + o - r,
      left: d.left + l - s
    }) : d);
  }, J.offset = {
    bodyOffset: function(e) {
      var t = e.offsetTop, i = e.offsetLeft;
      return J.support.doesNotIncludeMarginInBodyOffset && (t += parseFloat(J.css(e, "marginTop")) || 0, 
      i += parseFloat(J.css(e, "marginLeft")) || 0), {
        top: t,
        left: i
      };
    },
    setOffset: function(e, t, i) {
      var n = J.css(e, "position");
      "static" === n && (e.style.position = "relative");
      var a, r, s = J(e), o = s.offset(), l = J.css(e, "top"), d = J.css(e, "left"), c = ("absolute" === n || "fixed" === n) && J.inArray("auto", [ l, d ]) > -1, u = {}, h = {};
      c ? (h = s.position(), a = h.top, r = h.left) : (a = parseFloat(l) || 0, r = parseFloat(d) || 0), 
      J.isFunction(t) && (t = t.call(e, i, o)), null != t.top && (u.top = t.top - o.top + a), 
      null != t.left && (u.left = t.left - o.left + r), "using" in t ? t.using.call(e, u) : s.css(u);
    }
  }, J.fn.extend({
    position: function() {
      if (this[0]) {
        var e = this[0], t = this.offsetParent(), i = this.offset(), n = en.test(t[0].nodeName) ? {
          top: 0,
          left: 0
        } : t.offset();
        return i.top -= parseFloat(J.css(e, "marginTop")) || 0, i.left -= parseFloat(J.css(e, "marginLeft")) || 0, 
        n.top += parseFloat(J.css(t[0], "borderTopWidth")) || 0, n.left += parseFloat(J.css(t[0], "borderLeftWidth")) || 0, 
        {
          top: i.top - n.top,
          left: i.left - n.left
        };
      }
    },
    offsetParent: function() {
      return this.map(function() {
        for (var e = this.offsetParent || j.body; e && !en.test(e.nodeName) && "static" === J.css(e, "position"); ) e = e.offsetParent;
        return e || j.body;
      });
    }
  }), J.each({
    scrollLeft: "pageXOffset",
    scrollTop: "pageYOffset"
  }, function(e, i) {
    var n = /Y/.test(i);
    J.fn[e] = function(a) {
      return J.access(this, function(e, a, r) {
        var s = H(e);
        return r === t ? s ? i in s ? s[i] : s.document.documentElement[a] : e[a] : (s ? s.scrollTo(n ? J(s).scrollLeft() : r, n ? r : J(s).scrollTop()) : e[a] = r, 
        t);
      }, e, a, arguments.length, null);
    };
  }), J.each({
    Height: "height",
    Width: "width"
  }, function(e, i) {
    J.each({
      padding: "inner" + e,
      content: i,
      "": "outer" + e
    }, function(n, a) {
      J.fn[a] = function(a, r) {
        var s = arguments.length && (n || "boolean" != typeof a), o = n || (a === !0 || r === !0 ? "margin" : "border");
        return J.access(this, function(i, n, a) {
          var r;
          return J.isWindow(i) ? i.document.documentElement["client" + e] : 9 === i.nodeType ? (r = i.documentElement, 
          Math.max(i.body["scroll" + e], r["scroll" + e], i.body["offset" + e], r["offset" + e], r["client" + e])) : a === t ? J.css(i, n, a, o) : J.style(i, n, a, o);
        }, i, s ? a : t, s, null);
      };
    });
  }), e.jQuery = e.$ = J, "function" == typeof define && define.amd && define.amd.jQuery && define("jquery", [], function() {
    return J;
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
    var t, r = e || window.event, s = [].slice.call(arguments, 1), o = 0, l = 0, d = 0, c = 0, u = 0;
    return e = a.event.fix(r), e.type = "mousewheel", r.wheelDelta && (o = r.wheelDelta), 
    r.detail && (o = -1 * r.detail), r.deltaY && (d = -1 * r.deltaY, o = d), r.deltaX && (l = r.deltaX, 
    o = -1 * l), void 0 !== r.wheelDeltaY && (d = r.wheelDeltaY), void 0 !== r.wheelDeltaX && (l = -1 * r.wheelDeltaX), 
    c = Math.abs(o), (!i || i > c) && (i = c), u = Math.max(Math.abs(d), Math.abs(l)), 
    (!n || n > u) && (n = u), t = o > 0 ? "floor" : "ceil", o = Math[t](o / i), l = Math[t](l / n), 
    d = Math[t](d / n), s.unshift(e, o, l, d), (a.event.dispatch || a.event.handle).apply(this, s);
  }
  var i, n, a = e("jquery"), r = [ "wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll" ], s = "onwheel" in document || document.documentMode >= 9 ? [ "wheel" ] : [ "mousewheel", "DomMouseScroll", "MozMousePixelScroll" ];
  if (a.event.fixHooks) for (var o = r.length; o; ) a.event.fixHooks[r[--o]] = a.event.mouseHooks;
  a.event.special.mousewheel = {
    setup: function() {
      if (this.addEventListener) for (var e = s.length; e; ) this.addEventListener(s[--e], t, !1); else this.onmousewheel = t;
    },
    teardown: function() {
      if (this.removeEventListener) for (var e = s.length; e; ) this.removeEventListener(s[--e], t, !1); else this.onmousewheel = null;
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
      var r = e.data("drag-timer");
      r && (clearTimeout(r), r = null, e.removeData("drag-timer")), r = setTimeout(function() {
        a(t, i);
      }, n), e.data("drag-timer", r);
    } else a(t, i);
  }
  var a = e("jquery");
  a.fn.dndsortable = function(e) {
    return e = a.extend({}, a.fn.dndsortable.defaults, e), this.each(function() {
      var r, s, o = a(this), l = e.list + e.items, d = o.find(e.items);
      d.addClass(e.childClass).prop("draggable", e.draggable), o.on("dragstart.ui", l, function(t) {
        return t.stopPropagation(), t.originalEvent.dataTransfer && (t.originalEvent.dataTransfer.effectAllowed = "moving", 
        t.originalEvent.dataTransfer.setData("Text", e.setData(this))), r = a(s = this).addClass(e.draggingClass).index(), 
        e.start && e.start.call(this, r), !0;
      }).on("dragend.ui", l, function(i) {
        return i.stopPropagation(), a(this).removeClass(e.draggingClass), e.end && e.end.call(this, r), 
        r = void 0, s = null, t(this, !1), !1;
      }).on("dragenter.ui", l, function() {
        if (!s || s === this) return !0;
        var i = this, r = a(i), l = t(this);
        return t(this, l + 1), 0 === l && (r.addClass(e.overClass), e.wrap || n(o, s, this, e.delay, function(t, i) {
          e.enter && e.enter.call(i), r[a(t).index() < r.index() ? "after" : "before"](t);
        })), !1;
      }).on("dragleave.ui", l, function() {
        var i = t(this);
        return t(this, i - 1), t(this) || (a(this).removeClass(e.overClass), t(this, !1), 
        e.leave && e.leave.call(this)), !1;
      }).on("drop.ui", l, function(t) {
        return t.stopPropagation(), t.preventDefault(), this !== s ? (e.wrap && n(o, s, this, e.delay, function(n, a) {
          e.sort ? e.sort.call(o, n, a) : i.call(o, n, a);
          var r;
          t.originalEvent.dataTransfer && (r = t.originalEvent.dataTransfer.getData("Text")), 
          e.change && e.change.call(a, r);
        }), !1) : void 0;
      }).on("dragover.ui", l, function(e) {
        return s ? (e.stopPropagation(), e.preventDefault(), !1) : !0;
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
      t(this).bind("resize", s);
    },
    teardown: function() {
      t(this).unbind("resize", s);
    }
  };
  var i, n, a, r = 250, s = function() {
    n = new Date().getTime(), a = n - o, a >= r ? (o = n, t(this).trigger("throttledresize")) : (i && clearTimeout(i), 
    i = setTimeout(s, r - a));
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
  var t = e, i = {}, n = {}, a = {}, r = 1e3, s = 0, o = 0, l = null, d = TWEEN.Easing.Linear.None, c = TWEEN.Interpolation.Linear, u = [], h = null, p = !1, f = null, m = null;
  for (var g in e) i[g] = parseFloat(e[g], 10);
  this.to = function(e, t) {
    return void 0 !== t && (r = t), n = e, this;
  }, this.start = function(e) {
    TWEEN.add(this), p = !1, l = void 0 !== e ? e : void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now(), 
    l += o;
    for (var r in n) {
      if (n[r] instanceof Array) {
        if (0 === n[r].length) continue;
        n[r] = [ t[r] ].concat(n[r]);
      }
      i[r] = t[r], i[r] instanceof Array == !1 && (i[r] *= 1), a[r] = i[r] || 0;
    }
    return this;
  }, this.stop = function() {
    return TWEEN.remove(this), this;
  }, this.delay = function(e) {
    return o = e, this;
  }, this.repeat = function(e) {
    return s = e, this;
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
    var g = (e - l) / r;
    g = g > 1 ? 1 : g;
    var v = d(g);
    for (var y in n) {
      var _ = i[y] || 0, b = n[y];
      b instanceof Array ? t[y] = c(b, v) : ("string" == typeof b && (b = _ + parseFloat(b, 10)), 
      t[y] = _ + (b - _) * v);
    }
    if (null !== f && f.call(t, v), 1 == g) {
      if (s > 0) {
        isFinite(s) && s--;
        for (var y in a) "string" == typeof n[y] && (a[y] = a[y] + parseFloat(n[y], 10)), 
        i[y] = a[y];
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
    var i = e.length - 1, n = i * t, a = Math.floor(n), r = TWEEN.Interpolation.Utils.Linear;
    return 0 > t ? r(e[0], e[1], n) : t > 1 ? r(e[i], e[i - 1], i - n) : r(e[a], e[a + 1 > i ? i : a + 1], n - a);
  },
  Bezier: function(e, t) {
    var i, n = 0, a = e.length - 1, r = Math.pow, s = TWEEN.Interpolation.Utils.Bernstein;
    for (i = 0; a >= i; i++) n += r(1 - t, a - i) * r(t, i) * e[i] * s(a, i);
    return n;
  },
  CatmullRom: function(e, t) {
    var i = e.length - 1, n = i * t, a = Math.floor(n), r = TWEEN.Interpolation.Utils.CatmullRom;
    return e[0] === e[i] ? (0 > t && (a = Math.floor(n = i * (1 + t))), r(e[(a - 1 + i) % i], e[a], e[(a + 1) % i], e[(a + 2) % i], n - a)) : 0 > t ? e[0] - (r(e[0], e[0], e[1], e[1], -n) - e[0]) : t > 1 ? e[i] - (r(e[i], e[i], e[i - 1], e[i - 1], n - i) - e[i]) : r(e[a ? a - 1 : 0], e[a], e[a + 1 > i ? i : a + 1], e[a + 2 > i ? i : a + 2], n - a);
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
      var r = .5 * (i - e), s = .5 * (n - t), o = a * a, l = a * o;
      return (2 * t - 2 * i + r + s) * l + (-3 * t + 3 * i - 2 * r - s) * o + r * a + t;
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
      var i = t(), n = Math.max(0, 16 - (i - a)), r = setTimeout(function() {
        e(i + n);
      }, n);
      return a = i + n, r;
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
        t.unshift(r), h.appendChild(r), r.addBehavior("#default#userData"), r.load(d);
        var i = e.apply(s, t);
        return h.removeChild(r), i;
      };
    }
    function a(e) {
      return e.replace(m, "___");
    }
    var r, s = {}, o = window, l = o.document, d = "localStorage", c = "globalStorage", u = "__storejs__";
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
    }, e()) r = o[d], s.set = function(e, t) {
      return void 0 === t ? s.remove(e) : (r.setItem(e, s.serialize(t)), t);
    }, s.get = function(e) {
      return s.deserialize(r.getItem(e));
    }, s.remove = function(e) {
      r.removeItem(e);
    }, s.clear = function() {
      r.clear();
    }, s.getAll = function() {
      for (var e = {}, t = 0; r.length > t; ++t) {
        var i = r.key(t);
        e[i] = s.get(i);
      }
      return e;
    }; else if (t()) r = o[c][o.location.hostname], s.set = function(e, t) {
      return void 0 === t ? s.remove(e) : (r[e] = s.serialize(t), t);
    }, s.get = function(e) {
      return s.deserialize(r[e] && r[e].value);
    }, s.remove = function(e) {
      delete r[e];
    }, s.clear = function() {
      for (var e in r) delete r[e];
    }, s.getAll = function() {
      for (var e = {}, t = 0; r.length > t; ++t) {
        var i = r.key(t);
        e[i] = s.get(i);
      }
      return e;
    }; else if (l.documentElement.addBehavior) {
      var h, p;
      try {
        p = new ActiveXObject("htmlfile"), p.open(), p.write('<script>document.w=window</script><iframe src="/favicon.ico"></frame>'), 
        p.close(), h = p.w.frames[0].document, r = h.createElement("div");
      } catch (f) {
        r = l.createElement("div"), h = l.body;
      }
      var m = RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g");
      s.set = n(function(e, t, i) {
        return t = a(t), void 0 === i ? s.remove(t) : (e.setAttribute(t, s.serialize(i)), 
        e.save(d), i);
      }), s.get = n(function(e, t) {
        return t = a(t), s.deserialize(e.getAttribute(t));
      }), s.remove = n(function(e, t) {
        t = a(t), e.removeAttribute(t), e.save(d);
      }), s.clear = n(function(e) {
        var t = e.XMLDocument.documentElement.attributes;
        e.load(d);
        for (var i, n = 0; i = t[n]; n++) e.removeAttribute(i.name);
        e.save(d);
      }), s.getAll = n(function(e) {
        var t = e.XMLDocument.documentElement.attributes;
        e.load(d);
        for (var i, n = {}, a = 0; i = t[a]; ++a) n[i] = s.get(i);
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
    function r(e) {
      m = e.reverse();
      for (var i = ""; t(); ) i += n();
      return m = null, g = null, i;
    }
    function s(e, t) {
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
      return h(t), r(p.lexer(e));
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
      for (var n, a, r, s, o, l, d, e = e.replace(/^ +$/gm, ""); e; ) if ((r = p.newline.exec(e)) && (e = e.substring(r[0].length), 
      r[0].length > 1 && t.push({
        type: "space"
      })), r = p.code.exec(e)) e = e.substring(r[0].length), r = r[0].replace(/^ {4}/gm, ""), 
      t.push({
        type: "code",
        text: v.pedantic ? r : r.replace(/\n+$/, "")
      }); else if (r = p.fences.exec(e)) e = e.substring(r[0].length), t.push({
        type: "code",
        lang: r[1],
        text: r[2]
      }); else if (r = p.heading.exec(e)) e = e.substring(r[0].length), t.push({
        type: "heading",
        depth: r[1].length,
        text: r[2]
      }); else if (r = p.lheading.exec(e)) e = e.substring(r[0].length), t.push({
        type: "heading",
        depth: "=" === r[2] ? 1 : 2,
        text: r[1]
      }); else if (r = p.hr.exec(e)) e = e.substring(r[0].length), t.push({
        type: "hr"
      }); else if (r = p.blockquote.exec(e)) e = e.substring(r[0].length), t.push({
        type: "blockquote_start"
      }), r = r[0].replace(/^ *> ?/gm, ""), p.token(r, t, i), t.push({
        type: "blockquote_end"
      }); else if (r = p.list.exec(e)) {
        for (e = e.substring(r[0].length), t.push({
          type: "list_start",
          ordered: isFinite(r[2])
        }), r = r[0].match(p.item), n = !1, d = r.length, l = 0; d > l; l++) s = r[l], o = s.length, 
        s = s.replace(/^ *([*+-]|\d+\.) +/, ""), ~s.indexOf("\n ") && (o -= s.length, s = v.pedantic ? s.replace(/^ {1,4}/gm, "") : s.replace(RegExp("^ {1," + o + "}", "gm"), "")), 
        a = n || /\n\n(?!\s*$)/.test(s), l !== d - 1 && (n = "\n" === s[s.length - 1], a || (a = n)), 
        t.push({
          type: a ? "loose_item_start" : "list_item_start"
        }), p.token(s, t), t.push({
          type: "list_item_end"
        });
        t.push({
          type: "list_end"
        });
      } else (r = p.html.exec(e)) ? (e = e.substring(r[0].length), t.push({
        type: "html",
        pre: "pre" === r[1],
        text: r[0]
      })) : i && (r = p.def.exec(e)) ? (e = e.substring(r[0].length), t.links[r[1].toLowerCase()] = {
        href: r[2],
        title: r[3]
      }) : i && (r = p.paragraph.exec(e)) ? (e = e.substring(r[0].length), t.push({
        type: "paragraph",
        text: r[0]
      })) : (r = p.text.exec(e)) && (e = e.substring(r[0].length), t.push({
        type: "text",
        text: r[0]
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
      for (var i, n, a, r, l = "", d = m.links; t; ) if (r = f.escape.exec(t)) t = t.substring(r[0].length), 
      l += r[1]; else if (r = f.autolink.exec(t)) t = t.substring(r[0].length), "@" === r[2] ? (n = ":" === r[1][6] ? o(r[1].substring(7)) : o(r[1]), 
      a = o("mailto:") + n) : (n = s(r[1]), a = n), l += '<a href="' + a + '">' + n + "</a>"; else if (r = f.url.exec(t)) t = t.substring(r[0].length), 
      n = s(r[1]), a = n, l += '<a href="' + a + '">' + n + "</a>"; else if (r = f.tag.exec(t)) t = t.substring(r[0].length), 
      l += v.sanitize ? s(r[0]) : r[0]; else if (r = f.link.exec(t)) t = t.substring(r[0].length), 
      l += e(r, {
        href: r[2],
        title: r[3]
      }); else if ((r = f.reflink.exec(t)) || (r = f.nolink.exec(t))) {
        if (t = t.substring(r[0].length), i = (r[2] || r[1]).replace(/\s+/g, " "), i = d[i.toLowerCase()], 
        !i || !i.href) {
          l += r[0][0], t = r[0].substring(1) + t;
          continue;
        }
        l += e(r, i);
      } else (r = f.strong.exec(t)) ? (t = t.substring(r[0].length), l += "<strong>" + f.lexer(r[2] || r[1]) + "</strong>") : (r = f.em.exec(t)) ? (t = t.substring(r[0].length), 
      l += "<em>" + f.lexer(r[2] || r[1]) + "</em>") : (r = f.code.exec(t)) ? (t = t.substring(r[0].length), 
      l += "<code>" + s(r[2], !0) + "</code>") : (r = f.br.exec(t)) ? (t = t.substring(r[0].length), 
      l += "<br>") : (r = f.text.exec(t)) && (t = t.substring(r[0].length), l += s(r[0]));
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
      return h(t), r(e);
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
      var r = a.inverse || function() {}, s = a.fn, o = t.call(n);
      return o === i && (n = n.call(this)), n === !0 ? s(this) : n === !1 || null == n ? r(this) : "[object Array]" === o ? n.length > 0 ? e.helpers.each(n, a) : r(this) : s(n);
    }), e.K = function() {}, e.createFrame = Object.create || function(t) {
      e.K.prototype = t;
      var i = new e.K();
      return e.K.prototype = null, i;
    }, e.registerHelper("each", function(t, i) {
      var n, a = i.fn, r = i.inverse, s = "";
      if (i.data && (n = e.createFrame(i.data)), t && t.length > 0) for (var o = 0, l = t.length; l > o; o++) n && (n.index = o), 
      s += a(t[o], {
        data: n
      }); else s = r(this);
      return s;
    }), e.registerHelper("if", function(n, a) {
      var r = t.call(n);
      return r === i && (n = n.call(this)), !n || e.Utils.isEmpty(n) ? a.inverse(this) : a.fn(this);
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
      performAction: function(e, t, i, n, a, r) {
        var s = r.length - 1;
        switch (a) {
         case 1:
          return r[s - 1];

         case 2:
          this.$ = new n.ProgramNode(r[s - 2], r[s]);
          break;

         case 3:
          this.$ = new n.ProgramNode(r[s]);
          break;

         case 4:
          this.$ = new n.ProgramNode([]);
          break;

         case 5:
          this.$ = [ r[s] ];
          break;

         case 6:
          r[s - 1].push(r[s]), this.$ = r[s - 1];
          break;

         case 7:
          this.$ = new n.BlockNode(r[s - 2], r[s - 1].inverse, r[s - 1], r[s]);
          break;

         case 8:
          this.$ = new n.BlockNode(r[s - 2], r[s - 1], r[s - 1].inverse, r[s]);
          break;

         case 9:
          this.$ = r[s];
          break;

         case 10:
          this.$ = r[s];
          break;

         case 11:
          this.$ = new n.ContentNode(r[s]);
          break;

         case 12:
          this.$ = new n.CommentNode(r[s]);
          break;

         case 13:
          this.$ = new n.MustacheNode(r[s - 1][0], r[s - 1][1]);
          break;

         case 14:
          this.$ = new n.MustacheNode(r[s - 1][0], r[s - 1][1]);
          break;

         case 15:
          this.$ = r[s - 1];
          break;

         case 16:
          this.$ = new n.MustacheNode(r[s - 1][0], r[s - 1][1]);
          break;

         case 17:
          this.$ = new n.MustacheNode(r[s - 1][0], r[s - 1][1], !0);
          break;

         case 18:
          this.$ = new n.PartialNode(r[s - 1]);
          break;

         case 19:
          this.$ = new n.PartialNode(r[s - 2], r[s - 1]);
          break;

         case 20:
          break;

         case 21:
          this.$ = [ [ r[s - 2] ].concat(r[s - 1]), r[s] ];
          break;

         case 22:
          this.$ = [ [ r[s - 1] ].concat(r[s]), null ];
          break;

         case 23:
          this.$ = [ [ r[s - 1] ], r[s] ];
          break;

         case 24:
          this.$ = [ [ r[s] ], null ];
          break;

         case 25:
          this.$ = [ [ new n.DataNode(r[s]) ], null ];
          break;

         case 26:
          r[s - 1].push(r[s]), this.$ = r[s - 1];
          break;

         case 27:
          this.$ = [ r[s] ];
          break;

         case 28:
          this.$ = r[s];
          break;

         case 29:
          this.$ = new n.StringNode(r[s]);
          break;

         case 30:
          this.$ = new n.IntegerNode(r[s]);
          break;

         case 31:
          this.$ = new n.BooleanNode(r[s]);
          break;

         case 32:
          this.$ = new n.DataNode(r[s]);
          break;

         case 33:
          this.$ = new n.HashNode(r[s]);
          break;

         case 34:
          r[s - 1].push(r[s]), this.$ = r[s - 1];
          break;

         case 35:
          this.$ = [ r[s] ];
          break;

         case 36:
          this.$ = [ r[s - 2], r[s] ];
          break;

         case 37:
          this.$ = [ r[s - 2], new n.StringNode(r[s]) ];
          break;

         case 38:
          this.$ = [ r[s - 2], new n.IntegerNode(r[s]) ];
          break;

         case 39:
          this.$ = [ r[s - 2], new n.BooleanNode(r[s]) ];
          break;

         case 40:
          this.$ = [ r[s - 2], new n.DataNode(r[s]) ];
          break;

         case 41:
          this.$ = new n.IdNode(r[s]);
          break;

         case 42:
          r[s - 2].push(r[s]), this.$ = r[s - 2];
          break;

         case 43:
          this.$ = [ r[s] ];
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
        var i = this, n = [ 0 ], a = [ null ], r = [], s = this.table, o = "", l = 0, d = 0, c = 0;
        this.lexer.setInput(e), this.lexer.yy = this.yy, this.yy.lexer = this.lexer, this.yy.parser = this, 
        this.lexer.yylloc === void 0 && (this.lexer.yylloc = {});
        var u = this.lexer.yylloc;
        r.push(u);
        var h = this.lexer.options && this.lexer.options.ranges;
        "function" == typeof this.yy.parseError && (this.parseError = this.yy.parseError);
        for (var p, f, m, g, v, y, _, b, x, w = {}; ;) {
          if (m = n[n.length - 1], this.defaultActions[m] ? g = this.defaultActions[m] : ((null === p || p === void 0) && (p = t()), 
          g = s[m] && s[m][p]), g === void 0 || !g.length || !g[0]) {
            var k = "";
            if (!c) {
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
            n.push(p), a.push(this.lexer.yytext), r.push(this.lexer.yylloc), n.push(g[1]), p = null, 
            f ? (p = f, f = null) : (d = this.lexer.yyleng, o = this.lexer.yytext, l = this.lexer.yylineno, 
            u = this.lexer.yylloc, c > 0 && c--);
            break;

           case 2:
            if (_ = this.productions_[g[1]][1], w.$ = a[a.length - _], w._$ = {
              first_line: r[r.length - (_ || 1)].first_line,
              last_line: r[r.length - 1].last_line,
              first_column: r[r.length - (_ || 1)].first_column,
              last_column: r[r.length - 1].last_column
            }, h && (w._$.range = [ r[r.length - (_ || 1)].range[0], r[r.length - 1].range[1] ]), 
            v = this.performAction.call(w, o, d, l, this.yy, g[1], a, r), v !== void 0) return v;
            _ && (n = n.slice(0, 2 * -1 * _), a = a.slice(0, -1 * _), r = r.slice(0, -1 * _)), 
            n.push(this.productions_[g[1]][0]), a.push(w.$), r.push(w._$), b = s[n[n.length - 2]][n[n.length - 1]], 
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
          for (var r = this._currentRules(), s = 0; r.length > s && (i = this._input.match(this.rules[r[s]]), 
          !i || t && !(i[0].length > t[0].length) || (t = i, n = s, this.options.flex)); s++) ;
          return t ? (a = t[0].match(/(?:\r\n?|\n).*/g), a && (this.yylineno += a.length), 
          this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: a ? a[a.length - 1].length - a[a.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + t[0].length
          }, this.yytext += t[0], this.match += t[0], this.matches = t, this.yyleng = this.yytext.length, 
          this.options.ranges && (this.yylloc.range = [ this.offset, this.offset += this.yyleng ]), 
          this._more = !1, this._input = this._input.slice(t[0].length), this.matched += t[0], 
          e = this.performAction.call(this, this.yy, this, r[n], this.conditionStack[this.conditionStack.length - 1]), 
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
      var n = this.id = e[0], a = this.params = e.slice(1), r = this.eligibleHelper = n.isSimple;
      this.isHelper = r && (a.length || t);
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
        var r = e[n];
        ".." === r ? i++ : "." === r || "this" === r ? this.isScoped = !0 : t.push(r);
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
        for (var e, t, i, n = this.opcodes, a = [], r = 0, s = n.length; s > r; r++) if (e = n[r], 
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
        for (var a = 0, r = i.depths.list.length; r > a; a++) t = i.depths.list[a], 2 > t || this.addDepth(t - 1);
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
        for (var a = 0, r = n.length; r > a; a++) t = n[a], i = t[1], this.accept(i), this.opcode("assignToHash", t[0]);
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
        var a, r = e.opcodes;
        for (this.i = 0, s = r.length; s > this.i; this.i++) a = r[this.i], "DECLARE" === a.opcode ? this[a.name] = a.value : this[a.opcode].apply(this, a.args);
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
        for (var n = this.isChild ? [ "depth0", "data" ] : [ "Handlebars", "depth0", "helpers", "partials", "data" ], a = 0, r = this.environment.depths.list.length; r > a; a++) n.push("depth" + this.environment.depths.list[a]);
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
        for (var i, n, a = e.children, r = 0, s = a.length; s > r; r++) {
          i = a[r], n = new this.compiler(), this.context.programs.push("");
          var o = this.context.programs.length;
          i.index = o, i.name = "program" + o, this.context.programs[o] = n.compile(i, t, this.context);
        }
      },
      programExpression: function(e) {
        if (this.context.aliases.self = "this", null == e) return "self.noop";
        for (var t, i = this.environment.children[e], n = i.depths.list, a = [ i.index, i.name, "data" ], r = 0, s = n.length; s > r; r++) t = n[r], 
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
        var i, n, a, r = [], s = [];
        r.push("hash:" + this.popStack()), n = this.popStack(), a = this.popStack(), (a || n) && (a || (this.context.aliases.self = "this", 
        a = "self.noop"), n || (this.context.aliases.self = "this", n = "self.noop"), r.push("inverse:" + n), 
        r.push("fn:" + a));
        for (var o = 0; e > o; o++) i = this.popStack(), t.push(i), this.options.stringParams && s.push(this.popStack());
        return this.options.stringParams && r.push("contexts:[" + s.join(",") + "]"), this.options.data && r.push("data:data"), 
        t.push("{" + r.join(",") + "}"), t.join(", ");
      }
    };
    for (var n = "break else new var case finally return void catch for switch while continue function this with default if throw delete in try do instanceof typeof abstract enum int short boolean export interface static byte extends long super char final native synchronized class float package throws const goto private transient debugger implements protected volatile double import public let yield".split(" "), a = t.RESERVED_WORDS = {}, r = 0, s = n.length; s > r; r++) a[n[r]] = !0;
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
    invokePartial: function(e, t, i, n, a, r) {
      var s = {
        helpers: n,
        partials: a,
        data: r
      };
      if (void 0 === e) throw new Handlebars.Exception("The partial " + t + " could not be found");
      if (e instanceof Function) return e(i, s);
      if (Handlebars.compile) return a[t] = Handlebars.compile(e, {
        data: void 0 !== r
      }), a[t](i, s);
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
      var e = /^([a-z0-9_\.]{1,})@facebook$/i, t = /^@([a-z0-9_]{1,15})$|^@?([a-z0-9_]{1,15})@twitter$/i, i = /^([a-z0-9_\.]{1,})@instagram$/i, n = /^(.*)@dropbox$/i, r = /^(.*)@flickr$/i, s = /^[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i, o = /^[^@]*<[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?>$/i, l = /^(\+)?((?:(86)?(1(?:3\d|4[57]|5\d|8\d)\d{8}))|(?:(1)?(\d{5,15})))$/;
      return function(d) {
        var c, u = {};
        if (d = a.trim(d), (c = d.match(n)) && s.test(c[1])) u.name = c[1], u.external_username = c[1], 
        u.provider = "dropbox"; else if (c = d.match(r)) u.name = c[1], u.external_username = c[1], 
        u.provider = "flickr"; else if (c = d.match(i)) u.name = c[1], u.external_username = c[1], 
        u.provider = "instagram"; else if (c = d.match(e)) u.name = c[1], u.external_username = c[1], 
        u.provider = "facebook"; else if (c = d.match(t)) u.name = c[1] || c[2], u.external_username = u.name, 
        u.provider = "twitter"; else if (s.test(d)) u.name = a.cut30length(d.split("@")[0]), 
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
  var e = /(?:\{\{|%\{)(\w*?)(?:\}\}?)/gm, t = /^\d{4}-\d{2}-\d{2}$/, i = /^\d{2}:\d{2}:\d{2}$/, n = .2, a = 6e4, r = 864e5, s = {
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
    var a, r = o.locales[o.locale], s = o.distanceOfTime(e, t), l = o.diff(s);
    return l.type = i, a = o.inWords(l, r), "function" == typeof n && (a = n(a.data)), 
    a;
  }, l = o.parseISO = function(e) {
    return new Date(Date.parse(e));
  }, d = o.toISO = function(e) {
    return e.replace(/\s/, "T").replace(/\s/, "").replace(/([+\-]\d\d)(?::?)(\d\d)/, "$1:$2");
  };
  o.locale = "en", o.locales = {
    en: s
  }, o.inWords = function(e, t) {
    var i, n = t[e.token], a = e.type, r = e.date;
    return i = "function" == typeof n ? n(r, a) : n, g(i, r);
  }, o.diff = function(e) {
    var t, i, r, s, o, l, d = e.target, c = e.distance, u = v(c / a), h = {
      date: {}
    }, p = h.date, f = e.days;
    return p.isToday = e.isToday, d._isToday ? h.token = -1 : -43199 > u ? (h.token = 0, 
    r = v(-u / 525949), i = v(-u % 525949 / 43829 + n)) : -1439 > u ? (h.token = 1, 
    t = 3 > -f ? -f : v((-u + 1439) / 1440)) : -107 > u ? (h.token = 2, s = v(-u / 60 + n)) : -81 > u ? h.token = 3 : -59 > u ? h.token = 4 : -29 > u ? (h.token = 5, 
    o = -u) : 0 > u ? (h.token = 6, o = -u) : 0 === u ? h.token = 7 : 60 > u ? (h.token = 8, 
    o = u) : 82 > u ? h.token = 9 : 108 > u ? h.token = 10 : 1440 > u ? (h.token = 11, 
    s = v(u / 60 + n)) : 43200 > u ? (h.token = 12, t = 3 > f ? f : v((u + 1439) / 1440), 
    l = d.getDay()) : (h.token = 13, r = v(u / 525949), i = v(u % 525949 / 43829 + n), 
    12 === i && (i = 0, r++)), r && (p.years = r), i && (p.months = i), t && (p.days = t), 
    s && (p.hours = s), o && (p.minutes = o), l !== void 0 && (p.day = l), h;
  }, o.distanceOfTime = function(e, t) {
    e ? "number" == typeof e ? e = new Date(e) : "string" == typeof e && (e = l(d(e))) : e = new Date(), 
    t ? "number" == typeof t ? t = new Date(t) : "string" == typeof t && (t = l(d(t))) : t = new Date(), 
    e._reTime && (t.setHours(0), t.setMinutes(0), t.setSeconds(0), t.setMilliseconds(0));
    var i = e.getFullYear(), n = e.getMonth(), a = e.getDate(), s = t.getFullYear(), o = t.getMonth(), c = t.getDate();
    return {
      target: e,
      source: t,
      distance: +e - +t,
      days: (+new Date(i, n, a) - +new Date(s, o, c)) / r,
      isToday: i === s && n === o && a === c
    };
  }, o.toLocaleDate = function(e) {
    var t, i, n, a = e.outputformat, r = new Date(), s = r.getFullYear() + "-" + p(r.getMonth() + 1) + "-" + p(r.getDate()), o = !1, d = !1;
    if (a) t = r, n = s, o = !0; else {
      var c = e.begin_at, u = c.date, h = c.time, g = c.timezone, v = "";
      u ? (v = f(u), h ? v += "T" + m(h) : (d = !0, o = v === s)) : (v = s, h && (v += "T" + m(h))), 
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
    var n, a, r, s, l, d = e.outputformat, p = e.begin_at, f = "X" === t, m = {
      title: "",
      content: ""
    }, g = new Date();
    if (d) n = e.origin.replace(/^['"‘’“”“”‚„]+/, "").replace(/['"‘’“”“”‚„]+$/, ""), 
    m.title = n, f || (m.content = n, p.date && (e.outputformat = 0, a = o.toLocaleDate(e), 
    m.content = o(a.date, g), e.outputformat = 1)); else if (i || (i = c), p && (p.date || p.time ? (a = o.toLocaleDate(e), 
    r = a.date, p.date ? (m.title = o(a.date, g, "X"), m.content = p.time_word + (p.time_word && p.time ? " " : "") + (p.time ? i.time(r.getHours(), r.getMinutes()) : "") + (p.time || p.time_word ? p.time ? " " : ", " : "") + i.date(r.getFullYear(), r.getMonth(), r.getDate(), r.getDay()) + (p.date_word ? " " : "") + p.date_word) : p.time && (m.content = m.title = p.time_word + (p.time_word ? " " : "") + i.time(r.getHours(), r.getMinutes()) + (p.date_word ? ", " : "") + p.date_word), 
    r.getFullYear() !== g.getFullYear() && (m.content += " " + r.getFullYear())) : (p.date_word || p.time_word) && (m.content = m.title = p.time_word + (p.time_word ? ", " : "") + p.date_word), 
    p.timezone && (s = p.timezone.replace(/^([+\-]\d\d:\d\d)[\w\W]*$/, "$1"), l = u(g), 
    s !== l))) {
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
    var n, a, r, s, o = t.match(e), l = 0;
    if (o) for (;s = o[l]; ++l) a = s.replace(e, "$1"), r = i[a], n = RegExp(s.replace(/\{/gm, "\\{").replace(/\}/gm, "\\}")), 
    t = t.replace(n, r);
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
    var s, o, l, d = {};
    return t(d, c), t(d, e), s = a(), o = s.promise(), l = r(d).done(function(e, t, i) {
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
  var n = e("jquery"), a = n.Deferred, r = n.ajax, s = n.param, o = window._ENV_, l = {
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
      var r, o = l[e], c = t.params, u = t.resources;
      if (o) {
        if (c || (c = {}), c && (d._token && !c.token && (c.token = d._token), c = s(c), 
        o += c ? "?" + c : ""), u) for (r in u) o = o.replace(":" + r, encodeURIComponent(u[r]));
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
  function r(e, t) {
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
      this.setOptions(e), a(this, e);
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
        var t, i, a, s, o;
        for (t in e) {
          if (i = e[t] || this[t], !i) throw 'Method "' + e[t] + '" does not exist';
          a = t.match(d), s = a[1], o = a[2] || null, s += ".delegateEvents" + this.cid, this.element.on(s, o, r(i, this));
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
    this.isShown && this.options.keyboard ? s.on("keyup.dismiss.modal", function(t) {
      return 27 === t.which ? (t.stopPropagation(), t.preventDefault(), e && e.hide(), 
      !1) : void 0;
    }) : this.isShown || s.off("keyup.dismiss.modal");
  }
  var a = e("jquery"), r = e("widget"), s = a(document.body), o = a("#app-tmp"), l = r.extend({
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
        var i = e.title, n = e.body, r = e.footer, s = e.others, o = e.cls;
        o && this.element.addClass(o), i && this.element.find("h3").eq(0).html(i), n && this.element.find("div.modal-body").html(n), 
        r && this.element.find("div.modal-footer").html(r), s && this.element.find("div.modal-main").append(s);
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
        this.offSrcNode(), s.find('[data-dialog-type="' + t + '"]').not(e).removeData("dialog");
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
  var i = e("jquery"), n = e("widget"), a = i("#app-tmp"), r = n.extend({
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
  return r;
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
  var t = e("jquery"), i = e("util"), n = e("api"), a = e("typeahead"), r = e("handlebars");
  return a.extend({
    itemRender: function(e) {
      var i = r.compile(this.options.viewData.item);
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
        var a, r, s = this, o = s.options;
        if (s.cache || (s.cache = {}), !s.selecting && s.source && s.source.length && (r = t.grep(s.source, function(e) {
          return s.matcher(e);
        }), 0 === r.length ? s.isShown ? s.hide() : s : (r.length > 1 || e !== r[0].external_id) && s.render(r.slice(0)).show()), 
        s.timer && (clearTimeout(s.timer), s.target.next().addClass("hide")), (a = i.parseId(e)).provider) {
          var l = {
            provider: a.provider,
            external_username: a.external_username
          };
          s.timer = setTimeout(function() {
            clearTimeout(s.timer), c(e);
          }, o.delay);
          var d = function(e) {
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
          }, c = function(e) {
            e.length >= s.options.minLength ? (d(e), s.searchValue = e) : s.emit("autocomplete:clear");
          };
        } else s.emit("autocomplete:finish", null);
      }
    }
  });
}), define("xdialog", function(e, t) {
  "use strict";
  var i = e("jquery"), n = e("rex"), a = e("bus"), r = e("api"), s = e("util"), o = e("store"), l = e("handlebars"), d = e("dialog"), c = {};
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
          var a = t._identity.provider, s = t._identity.external_id;
          r.request("verifyIdentity", {
            type: "POST",
            data: {
              provider: a,
              external_username: s
            }
          }, function(e) {
            t.$(".verify-before").addClass("hide"), "VERIFYING" === e.action ? (t.$(".verify-after").removeClass("hide"), 
            n.addClass("xbtn-success").text("Done")) : n.addClass("verify-error").removeClass("hide");
          });
        },
        "blur #identity": function(e) {
          var t = s.trim(i(e.currentTarget).val()), n = this.$('[for="identity"]'), a = n.find("span");
          t.length && !s.parseId(t).provider ? (n.addClass("label-error"), a.text("Invalid identity.")) : (n.removeClass("label-error"), 
          a.text(""));
        },
        "blur #name": function(e) {
          var t = s.trim(i(e.currentTarget).val()), n = this.$('[for="name"]'), a = n.find("span");
          t ? s.utf8length(t) > 30 ? (a.text("Too long."), n.addClass("label-error")) : s.zh_CN.test(t) ? (n.addClass("label-error"), 
          a.text("Invalid character.")) : (n.removeClass("label-error"), a.text("")) : (n.addClass("label-error"), 
          a.text(""));
        },
        "blur #password": function(e) {
          var t = s.trim(i(e.currentTarget).val()), n = this.$('[for="password"]'), a = n.find("span");
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
            n.$("#password").trigger("blur"), "d02" === l && n.$("#name").trigger("blur"), u.password && ("d02" !== l || u.name) && ("d01" === l || "d02" === l) && r.request("signin", {
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
              o.set("authorization", e), o.set("last_external_username", s.printExtUserName(u)), 
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
        body: '<div class="shadow title"></div><div class="center shadow title" style="margin-bottom: 0;">Thanks for using <span class="x-sign">EXFE</span>.</div><p class="center">A utility for gathering with friends.</p><div class="modal-content"><p>We save you from calling up every one RSVP, losing in endless emails and messages off the point.</p><p><span class="x">·X·</span> (cross) is a gathering of people, for any purpose. When you get an idea to call up friends to do something together, just <span class="oblique">Gather a <span class="x">·X·</span></span>.</p><p><span class="x-sign">EXFE</span> your friends.</p><p class="provider-email hide" style="color: #191919;">*A welcome email has been sent to your mailbox. Please check to verify your address.*</p><div class="provider-other hide">&nbsp;&nbsp;<span class="underline why">why?</span><label class="pull-left checkbox pointer"><input type="checkbox" id="follow" value="1" checked />Follow @<span class="x-sign">EXFE</span> on Twitter.</label><p class="pull-left answer hidden">So we could send you invitation PRIVATELY through Direct Message. We hate spam, will NEVER disappoint your trust.</p></div></div>',
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
          a && (t.befer = r.request("forgotPassword", {
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
            a && (t.befer = r.request("forgotPassword", {
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
        var t, n, a, r = this, s = i(e.currentTarget).data("source");
        if (s && (t = s.length)) {
          if (n = s[0], a = n.external_username, "twitter" === n.provider && (a = "@" + n.external_username), 
          n.eun = a, t > 1) {
            r.$(".context-identity").addClass("switcher");
            for (var o = "", l = 0; t > l; l++) a = s[l].external_username, o += '<li data-index="' + l + '"><i class="pull-right icon16-identity-' + s[l].provider + '"></i>', 
            "twitter" === s[l].provider && (a = "@" + s[l].external_username), s[l].eun = a, 
            o += "<span>" + a + "</span>", o += "</li>";
            r.$(".dropdown-menu").html(o).data("identities", s);
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
          var t = o.get("user"), a = t.identities, r = n.filter(a, function(e) {
            return "CONNECTED" === e.status ? !0 : void 0;
          });
          if (1 === r.length) {
            e.stopPropagation(), this.hide();
            var s = new d(c.forgotpassword);
            s.dialog_from = "changepassword", s.render(), i(e.currentTarget).data("identity-id", r[0].id), 
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
          var t = o.get("user"), a = t.identities, r = [];
          n.each(a, function(e) {
            "CONNECTED" === e.status && r.push(e);
          }), i(e.currentTarget).data("source", r);
        },
        "click .xbtn-success": function(e) {
          var t = this, n = t.$("#cppwd").val(), a = t.$("#cp-npwd").val();
          if (!n || !a) return n ? alert("Please input new password.") : alert("Please input current password."), 
          void 0;
          e.preventDefault();
          var s = i(e.currentTarget), l = o.get("authorization"), d = l.user_id, c = l.token;
          t.befer = r.request("setPassword", {
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
          var t = this, a = t.registration_flag, s = t._identity;
          if (!s) return !1;
          var d = s.provider, c = s.external_username || "", u = o.get("user");
          if (n.find(u.identities, function(e) {
            return e.provider === d && e.external_username === c ? !0 : void 0;
          })) return t.destory(), void 0;
          if ("SIGN_IN" === a) {
            var h = i.trim(t.$("#password").val()), p = !1, f = "", m = r.request("signin", {
              type: "POST",
              data: {
                external_username: s.external_username,
                provider: s.provider,
                password: h,
                name: s.name || "",
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
                var e = o.get("authorization"), n = e.token, a = s.id;
                t.defer = r.request("mergeIdentities", {
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
                    var r, s, d = o.get("user"), c = d.identities;
                    c.push(n), o.set("user", d), r = l.compile(i("#jst-identity-item").html()), s = r(n), 
                    i(".identity-list").append(s), t && t.destory();
                  }
                });
              }
            }), t.defer = m;
          } else if ("SIGN_UP" === a) {
            var g = function(e, t, n) {
              var a = o.get("authorization"), s = a.token, d = r.request("addIdentity", {
                type: "POST",
                params: {
                  token: s
                },
                data: {
                  external_username: e,
                  provider: t
                }
              }, function(e) {
                var t = e.identity, a = o.get("user"), r = a.identities;
                r.push(t), o.set("user", a);
                var s = l.compile(i("#jst-identity-item").html()), d = s(e.identity);
                i(".identity-list").append(d), n && n.destory();
              }, function(a) {
                var r = a && a.meta;
                if (r && 401 === r.code && "authenticate_timeout" === r.errorType) {
                  n && n.destory();
                  var s = i('<div data-widget="dialog" data-dialog-type="authentication" data-destory="true" class="hide"></div>');
                  i("#app-tmp").append(s);
                  var o = i.Event("click.dialog.data-api");
                  o._data = {
                    callback: function() {
                      g(e, t);
                    }
                  }, s.trigger(o);
                }
              });
              n && (n.defer = d);
            };
            g(c, d, t);
          } else "AUTHENTICATE" === a && t.$('.oauth > a[data-oauth="' + s.provider + '"]').trigger("click");
        },
        "click .xbtn-verify": function(e) {
          function t(e, n, a) {
            var s = o.get("authorization"), d = s.token, c = r.request("addIdentity", {
              type: "POST",
              params: {
                token: d
              },
              data: {
                external_username: e,
                provider: n
              }
            }, function(e) {
              var t = e.identity, n = o.get("user"), r = n.identities;
              r.push(t), o.set("user", n);
              var s = l.compile(i("#jst-identity-item").html()), d = s(e.identity);
              i(".identity-list").append(d), a && a.$(".verify-before").addClass("hide"), a && a.$(".verify-after").removeClass("hide"), 
              a && a.$(".xbtn-verify").addClass("hide"), a && a.$(".xbtn-done").removeClass("hide");
            }, function(r) {
              a && (a.$(".verify-before").removeClass("hide"), a.$(".verify-after").addClass("hide"), 
              a.$(".xbtn-verify").removeClass("hide"), a.$(".xbtn-done").addClass("hide"));
              var s = r && r.meta;
              if (s && 401 === s.code && "authenticate_timeout" === s.errorType) {
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
          var a = this, s = a._identity, d = i(e.currentTarget);
          if (d.hasClass("xbtn-success")) return a.$(".verify-after").addClass("hide"), a.hide(), 
          !1;
          if (!s) return !1;
          var c = s.provider, u = s.external_username || "", h = o.get("user");
          return n.find(h.identities, function(e) {
            return e.provider === c && e.external_username === u ? !0 : void 0;
          }) ? (a.destory(), void 0) : (t(u, c, a), void 0);
        },
        "click .xbtn-done": function() {
          this.hide();
        },
        "click .oauth > a": function(e) {
          function t(e, n, a) {
            var s = o.get("authorization"), l = s.token, d = r.request("addIdentity", {
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
            }, function(r) {
              var s = r && r.meta;
              if (s && 401 === s.code && "authenticate_timeout" === s.errorType) {
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
          var n = "", a = i(e.currentTarget).data("oauth"), s = this;
          return s.$(".authentication").find(".oauth-provider").text(a), t(n, a, s), !1;
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
          e.$(".d0").removeClass("hide"), e.$(".xbtn-forgotpwd").removeClass("disabled").data("source", [ e._identity ])) : "SIGN_UP" === i ? (e._identity = s.parseId(e.$("#identity").val()), 
          e.$(".d0, .d1, .d3").addClass("hide"), e.$(".xbtn-add").removeClass("hide")) : "AUTHENTICATE" === i ? (e._identity = s.parseId(e.$("#identity").val()), 
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
          var e = this, t = o.get("authorization"), n = t.token, a = this._identity.external_username, s = this._identity.provider;
          r.request("addIdentity", {
            type: "POST",
            params: {
              token: n
            },
            data: {
              external_username: a,
              provider: s
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
        this.$(".identity").text(s.printExtUserName(n)), "email" !== n.provider && this.$(".xbtn-done").text("Authorize");
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
            return r.request("mergeIdentities", {
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
        var t = i(e.currentTarget).data("source"), n = t.merged_identity, a = t.browsing_token, r = t.mergeable_user, o = r.identities, l = '<li class="clearfix" data-identity-id="{{id}}"><label for="identity-{{i}}"><input class="pull-left" id="identity-{{i}}" name="identity-{{i}}" type="checkbox" /><div class="pull-left box identity">{{external_username}}</div><div class="pull-right avatar"><img width="40" height="40" alt="" src="{{avatar_filename}}" /><i class="provider icon16-identity-{{provider}}"></i></div></label></li>', d = this.$(".merge-list ul");
        this.$(".context-identity").find("img").attr("src", n.avatar_filename), this.$(".context-identity").find(".identity").text(s.printExtUserName(n)), 
        this.browsing_token = a;
        for (var c = 0, u = o.length; u > c; ++c) d.append(i(l.replace("{{id}}", o[c].id).replace(/\{\{i\}\}/g, c).replace("{{external_username}}", s.printExtUserName(o[c])).replace("{{avatar_filename}}", o[c].avatar_filename).replace("{{provider}}", o[c].provider)));
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
          var n = this, a = t.data("identity_id"), s = o.get("authorization"), l = s.token;
          this.befer = r.request("verifyUserIdentity", {
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
        var t = i(e.currentTarget), a = t.data("identity-id") || t.parents("li").data("identity-id"), r = o.get("user"), s = n.filter(r.identities, function(e) {
          return e.id === a ? !0 : void 0;
        })[0];
        this.$(".xbtn-verify").data("identity_id", s.id), this.$(".identity").text(s.external_id), 
        this.$(".avatar").attr("src", s.avatar_filename);
      }
    }
  }, c.verification_oauth = {
    options: {
      events: {
        "click .xbtn-verify": function(e) {
          var t = i(e.currentTarget), n = this;
          if (t.hasClass("disabled") || t.hasClass("success")) return t.hasClass("success") && this.hide(), 
          void 0;
          var a = t.data("identity_id"), s = o.get("authorization"), l = s.token;
          return this.befer = r.request("verifyUserIdentity", {
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
        var t = i(e.currentTarget), a = t.parents("li").data("identity-id"), r = o.get("user"), l = n.find(r.identities, function(e) {
          return e.id === a ? !0 : void 0;
        });
        this.$(".xbtn-verify").data("identity_id", l.id), this.$(".identity").text(s.printExtUserName(l)), 
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
        "click .password-eye": function(e) {
          var t = i(e.currentTarget), n = t.prev();
          n.prop("type", function(e, t) {
            return "password" === t ? "text" : "password";
          }), t.toggleClass("icon16-pass-hide icon16-pass-show");
        },
        "click .xbtn-success": function(e) {
          var t = this, n = t.$("#stpwd").val(), s = t.srcNode;
          if (!n) return n || alert("Please set EXFE password."), void 0;
          e.preventDefault();
          var l = i(e.currentTarget), d = this._user, c = this._token, u = this.signed;
          if (this._setup) {
            var h = function(e, t, n, s, d, c) {
              var u = r.request("setPassword", {
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
                o.set("authorization", e), a.on("app:user:signin", e.token, e.user_id, !0), d && d.data("dialog", null).data("dialog-type", "changepassword").find("span").text("Change Password..."), 
                i(".set-up").remove(), c && c.hide();
              }, function(a) {
                c && c.hide();
                var r = a.meta;
                if (403 === r.code) {
                  var l = r.errorType;
                  "invalid_current_password" === l && alert("Invalid current password.");
                } else if (401 === r.code && "authenticate_timeout" === r.errorType && e) {
                  var d = i('<div data-widget="dialog" data-dialog-type="authentication" data-destory="true" class="hide"></div>');
                  i("#app-tmp").append(d);
                  var u = o.get("authorization");
                  t = u.token, d.trigger("click.dialog.data-api", {
                    callback: function() {
                      h(e, t, n, s);
                    }
                  });
                }
              });
              c && (c.befer = u);
            };
            h(u, c, d, n, s, t);
          } else {
            var p = function(e, t, n, a, s) {
              var l = r.request("resetPassword", {
                type: "POST",
                data: {
                  token: t,
                  name: n.name,
                  password: a
                }
              }, function(e) {
                o.set("authorization", e.authorization), s && s.hide(), window.location.href = "/";
              }, function(r) {
                s && s.hide();
                var l = r.meta;
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
              s && (s.befer = l);
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
          var t = s.trim(i(e.currentTarget).val()), n = this.$('[for="name"]'), a = n.find("span");
          t ? s.utf8length(t) > 30 ? (a.text("Too long."), n.addClass("label-error")) : s.zh_CN.test(t) ? (n.addClass("label-error"), 
          a.text("Invalid character.")) : (n.removeClass("label-error"), a.text("")) : (n.addClass("label-error"), 
          a.text(""));
        },
        "blur #password": function(e) {
          var t = s.trim(i(e.currentTarget).val()), n = this.$('[for="password"]'), a = n.find("span");
          t ? (n.removeClass("label-error"), a.text("")) : (n.addClass("label-error"), a.text("Password incorrect."));
        },
        "click #password-eye": function(e) {
          var t = i(e.currentTarget), n = t.prev();
          n.prop("type", function(e, t) {
            return "password" === t ? "text" : "password";
          }), t.toggleClass("icon16-pass-hide icon16-pass-show");
        },
        "click .xbtn-success": function() {
          var e = this, t = "user" === this._tokenType, n = this._page, s = t ? "resetPassword" : "setupUserByInvitationToken", l = {};
          if (l.name = i.trim(this.$("#name").blur().val()), l.password = this.$("#password").blur().val(), 
          t ? l.token = this._originToken : l.invitation_token = this._originToken, !this.$('[for="name"]').hasClass("label-error") || !this.$('[for="password"]').hasClass("label-error")) {
            var d;
            r.request(s, {
              type: "POST",
              data: l
            }, function(t) {
              if ("resolve" === n) if (d = o.get("authorization")) {
                i("#app-user-menu").find(".set-up").remove();
                var r = i("#app-browsing-identity"), s = r.data("settings");
                s.setup = !1, s.originToken = t.authorization.token, r.data("settings", s).trigger("click.data-api");
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
          this.$(".identity").text(s.printExtUserName(n)), this.$(".avatar").attr("src", n.avatar_filename).next().addClass("icon16-identity-" + n.provider), 
          this.$(".xbtn-siea").data("source", s.printExtUserName(n));
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
          this._tokenType = t.tokenType, this._originToken = t.originToken, this.$(".identity").text(s.printExtUserName(n)), 
          this.$(".avatar").attr("src", n.avatar_filename).next().addClass("icon16-identity-" + n.provider), 
          this.$(".xbtn-siea").data("source", s.printExtUserName(n));
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
          var e = this, t = o.get("authorization"), a = t.token, s = this._token, l = this._identity, d = {
            browsing_identity_token: s,
            identity_ids: "[" + l.id + "]"
          };
          r.request("mergeIdentities", {
            type: "POST",
            params: {
              token: a
            },
            data: d
          }, function(t) {
            if (e.hide(), t.mergeable_user = null, t.mergeable_user) {
              var a = i('<div id="js-dialog-merge" data-destory="true" data-widget="dialog" data-dialog-type="mergeidentity">'), r = o.get("user");
              a.data("source", {
                merged_identity: n.find(r.identities, function(e) {
                  return e.id === l.id ? !0 : void 0;
                }),
                browsing_token: s,
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
          var n = t.normal, a = t.browsing, r = t.setup, o = t.action;
          this._token = t.originToken, this._user = n, this._browsing_user = a, this._setup = r, 
          this._action = o, this._tokenType = t.tokenType, this._user ? (this.$(".user").removeClass("hide").find("img").attr("src", n.avatar_filename).parent().next().text(n.name || n.nickname), 
          this.$(".xbtn-merge").removeClass("hide"), this.$(".browsing-tips").find(".tip-0").removeClass("hide")) : (this.$(".xbtn-sias, .xbtn-sui").addClass("pull-right"), 
          this.$(".browsing-tips").find(".tip-1").removeClass("hide")), this.$("browsing-tips").find("span").eq(this._user ? 0 : 1).removeClass("hide");
          var l = a.identities[0];
          this._identity = l;
          var d = s.printExtUserName(l);
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
          var n = t.isBrowsing, a = s.printExtUserName(t.identities[0]);
          if (this.$("legend span").eq(0).text(n ? "identity" : "user"), this.$(".xbtn-blue").data("source", a), 
          n) {
            var r = this.$(".context-identity").removeClass("hide");
            r.find(".identity").text(a), r.find(".avatar img").attr("src", t.identities[0].avatar_filename), 
            r.find(".provider").addClass("icon16-identity-" + t.identities[0].provider);
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
          var e = this, t = o.get("user"), i = t.identities[0], n = i.external_username, a = i.provider, l = s.trim(e.$("#password").val());
          r.request("signin", {
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
          var a = t._identity.provider, s = t._identity.external_username;
          t.befer = r.request("verifyIdentity", {
            type: "POST",
            data: {
              provider: a,
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
          var a, r, l = i.identities;
          if (l && (a = l.length)) {
            if (r = l[0], r.eun = s.printExtUserName(r), a > 1) {
              t.$(".context-identity").addClass("switcher");
              for (var d = "", c = 0; a > c; c++) d += '<li data-index="' + c + '"><i class="pull-right icon16-identity-' + l[c].provider + '"></i>', 
              l[c].eun = s.printExtUserName(l[c]), d += "<span>" + l[c].eun + "</span>", d += "</li>";
              t.$(".dropdown-menu").html(d).data("identities", l);
            }
            t.updateIdentity(r);
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
        var i = e.$('[for="identity"]'), n = i.find("span"), a = e.$('[for="password"]'), r = a.find("span");
        e.availability = !1, e.identityFlag = null;
        var s;
        "d24" === e.switchTabType && (s = "d01"), e.$(".xalert-error").addClass("hide"), 
        e.$(".help-subject").removeClass("icon14-question").addClass("icon14-clear"), t ? (i.removeClass("label-error"), 
        n.text(""), t.identity && t.identity.avatar_filename ? (e._identity = t.identity, 
        e.$(".user-identity").removeClass("hide").find("img").attr("src", t.identity.avatar_filename).next().attr("class", "provider icon16-identity-" + t.identity.provider)) : (e._identity = null, 
        e.$(".user-identity").addClass("hide")), "phone" === t.identity.provider && e.$(".phone-tip").toggleClass("hide", /\+/.test(e.$("#identity").val())), 
        e.identityFlag = t.registration_flag, "SIGN_IN" === t.registration_flag ? (s = "d01", 
        e.$(".xbtn-forgotpwd").removeClass("hide"), a.removeClass("label-error"), r.text("")) : "SIGN_UP" === t.registration_flag ? (s = "d02", 
        a.removeClass("label-error"), r.text("")) : "AUTHENTICATE" === t.registration_flag ? (s = "d00", 
        e.$(".help-subject").removeClass("icon14-question").addClass("icon14-clear"), e.$(".authenticate").removeClass("hide")) : "VERIFY" === t.registration_flag && (s = "d04"), 
        e.availability = !0) : (e.$(".phone-tip").addClass("hide"), e.$(".help-subject").removeClass("icon14-clear").addClass("icon14-question")), 
        s && e.switchTabType !== s && e.switchTab(s), e.$(".x-signin")[(e.availability ? "remove" : "add") + "Class"]("disabled"), 
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
  t.Identification = u;
}), define("datepanel", function(e) {
  "use strict";
  var t = e("jquery"), i = t.browser.msie, n = e("humantime"), a = n.locales[n.locale], r = a.months, s = a.monthsShort, o = n.createEFTime, l = n.toLocaleDate, d = n.lead0, c = e("util"), u = c.trim, h = e("api"), p = e("rex"), f = e("panel").extend({
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
    initComponents: function() {
      var e = this.eftime, t = this.dateObj.date;
      this.calendarTable.refresh(t), 0 === this.originEftime.outputformat && (this.calendarTable.addCursorStyle(), 
      this.calendarTable.select()), this.timeline.refresh(this.eftime), this.timeline.select(this.eftime), 
      this.dateInput.change(e.origin || t.text), this.dateInput.$element.focusend(), this.eftime.begin_at.time && this.showTL();
    },
    listen: function() {
      this.element.on("click.datepanel", ".place-submit", y(this.save, this)), this.element.on("keydown.datepanel", y(this.keydown, this)), 
      this.on("save", this.save), this.on("tmt-ct", this.tmtCT), this.on("tmt-di", this.tmtDI), 
      this.on("rf-di", this.rfDI), this.on("rf-tl", this.rfTL), this.on("rf-ct", this.rfCT), 
      this.on("show-tl", this.showTL);
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
      var i, n = this.eftime, a = this.dateObj.date, r = "";
      n.begin_at.time = "", e && (i = e.split(":"), a.setHours(i[0] || 0), a.setMinutes(i[1] || 0), 
      a.setSeconds(i[2] || 0), n.begin_at.time = d(a.getUTCHours()) + ":" + d(a.getMinutes()) + ":" + d(a.getSeconds())), 
      n.begin_at.time_word = t, r = e || t, n.outputformat ? (n.outputformat = 0, n.origin = r) : (n.begin_at.date && (r = _(a) + " " + r), 
      n.origin = r), this.dateInput.change(n.origin);
    },
    rfCT: function(e) {
      var t = this.eftime, i = this.dateObj.date, n = "", a = e.split("-");
      if (i.setFullYear(a[0]), i.setMonth(a[1] - 1), i.setDate(a[2]), n = i.getUTCFullYear() + "-" + d(i.getUTCMonth() + 1) + "-" + d(i.getUTCDate()), 
      t.begin_at.date = n, t.outputformat) t.outputformat = 0, t.origin = e; else {
        var r = "";
        t.begin_at.time ? r = d(i.getHours()) + ":" + d(i.getMinutes()) : (r = t.begin_at.time_word, 
        t.begin_at.date = e), r = r ? e + " " + r : e, t.origin = r;
      }
      this.dateInput.change(t.origin);
    },
    showTL: function() {
      this.timeline.show(this.eftime);
    },
    keydown: function(e) {
      var t = this, i = e.altKey, n = e.ctrlKey, a = e.shiftKey, r = e.metaKey, s = e.keyCode;
      27 === s ? (t.revert(), t.emit("save")) : 13 === s && !(i | a) & (n | r) && t.emit && t.emit("save");
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
        var n = this.$element.val(), a = n.length, r = this.$element[0], s = w(r);
        a === s && (e.preventDefault(), t.emit("tmt-ct"));
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
      var t = this.vpr, i = this.vph, n = e.getFullYear(), a = e.getMonth(), r = e.getDate(), s = e.getDay();
      e = new Date(n, a, r - s - 21), this.startDate = _(e), this.genNext(e), this.genNext(e), 
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
      var t = this.$tw, i = t.scrollTop(), n = !1, a = this.$y, r = this.$m;
      (0 === i || this.st === i) && (this.enable = !0, this[0 === i ? "mpageUp" : "mpageDown"](), 
      this.$tw.scrollTop(this.vph * this.vpr), n = !0), this.updateYearMonth(), a.toggleClass("hide", n), 
      r.toggleClass("hide", n);
    },
    updateYearMonth: function() {
      if (this.$cursor) {
        var e = b(this.$cursor.data("date"));
        this.$y.text(e.getFullYear()), this.$m.text(r[e.getMonth()]);
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
      var t, i = this.vpr, n = this.todayString, a = this.selectedDate, r = this.divTmp, o = "", l = 0;
      for (this.len += i; i > l; ++l) {
        for (var d, c, u, h, p = 0, f = "<tr>", m = ""; 7 > p; ++p) h = "", d = _(e), c = d === n, 
        u = d === a, c && (h = "today"), u && (h += (h.length ? " " : "") + "selected"), 
        m += '<td data-date="' + d + '"' + (h.length ? ' class="' + h + '"' : "") + ">", 
        t = e.getDate(), m += r.replace("{{m}}", s[e.getMonth()]).replace("{{d}}", c ? "Today" : t), 
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
        var t, i = l(e).date, n = i.getHours(), a = i.getMinutes(), r = 15 * Math.round(n / 15);
        i.setMinutes(r), this.selectedTime = d(n) + ":" + d(a), this.$selected = this.$tc.find('[data-time="' + this.selectedTime + '"]').eq(0), 
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
      var t, i, n, a, r = 0, s = this.ts, o = new Date(2012, 12, 21, this.dh, this.dm);
      p.find(s, function(e, n) {
        return t = e.split(":"), i = new Date(2012, 12, 21, t[0], t[1]), i > o ? (r = n, 
        !0) : void 0;
      }), 0 === r && (r = 1), 24 === this.dh && (r = 14), --r, this.$ts.not(".hide").addClass("hide"), 
      this.$ts.eq(r).removeClass("hide"), this.dh >= 5 && 22 > this.dh && (this.$ts.eq(r - 1).removeClass("hide"), 
      this.$ts.eq(r + 1).removeClass("hide")), n = e - this.oy - this.th, a = this.$ts.not(".hide").length, 
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
      var t = this.$cursor, i = t.attr("data-time"), n = i.split(":"), a = 0 === +n[0] % 3 && 0 === +n[1], r = this.$selected;
      if (t.addClass("hide"), r) {
        if (r.removeClass("selected"), i === r.attr("date-time")) return;
        r.hasClass("time-label") || (r.remove(), delete this.$selected);
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
      for (var e = this.l, t = 0, i = 180, n = new Date(2012, 12, 21, 21, 0), a = 0, r = 0; e > t; ++t) n.setMinutes(n.getMinutes() + i), 
      a = n.getHours(), r = n.getMinutes(), 8 === t && (a = 24), this.createLabelItem(a, r, 60 * t);
      this.$cursor = this.createNormalItem(0, 0, 0).addClass("hide");
    }
  };
  var y = function(e, t) {
    return e ? function(i) {
      return e.call(t, i);
    } : void 0;
  }, _ = function(e) {
    return e.getFullYear() + "-" + d(e.getMonth() + 1) + "-" + d(e.getDate());
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
  var t = e("jquery"), i = t.proxy, n = t.extend, a = window._ENV_, r = a.MAP_KEY, s = a.location, o = a.site_url, l = e("humantime").lead0, d = e("rex"), c = /[\r\n]+/g, u = "\r", h = window.navigator.geolocation, p = t(window), f = t.browser.msie, m = !1, g = e("panel"), v = g.extend({
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
      var t = this, i = e.altKey, n = e.ctrlKey, a = e.shiftKey, r = e.metaKey, s = e.keyCode;
      27 === s ? t.revert() : 13 === s && !(i | a) & (n | r) ? (t.emit("update-place", t.place), 
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
      var i = this.place, n = i.title, a = i.description, r = i.lat, s = i.lng, o = !e.title, l = this.placeInput, d = this.placesList, c = !1, u = this.xmap;
      i.updated_at = k(new Date()), o ? (i = this.resetPlace(i), d.clear(), u.clear()) : (i.title = e.title, 
      i.description = e.description, i.external_id = e.external_id || "", i.provider = e.provider || "", 
      "map" === t || "list" === t ? (i.lat = e.lat, i.lng = e.lng, l.change(w(e.title, e.description)), 
      c = !0) : "input" === t && (n === e.title || e.description || (d.clear(), u.textSearch(e.title)))), 
      (n !== e.title || a !== e.description || r !== e.lat || s !== e.lng || c) && this.emit("update-place", i);
    },
    revert: function() {
      this.emit("update-place", this.originPlace);
    },
    showPlace: function() {
      var e, t, i = this, n = this.placeInput, a = this.place, r = a.title, o = a.description, l = a.lat && a.lng;
      this.focus(), n.change(w(r, o)), n.$element.focusend(), l && (t = {
        coords: {
          latitude: a.lat,
          longitude: a.lng,
          title: a.title
        }
      });
      var d = function() {
        e = {
          coords: s
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
        var n = this.$element.val(), a = n.length, r = this.$element[0], s = C(r);
        a === s && (e.preventDefault(), t.emit("placeinput-tab"));
      }
    },
    keypress: function(e) {
      this.suppressKeyPressRepeat || this.keyHandler(e);
    },
    keydown: function(e) {
      this.suppressKeyPressRepeat = !!~d.indexOf([ 9, 40 ], e.keyCode), this.keyHandler(e);
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
      var t = this.scrollIndexs, i = this.viewportRows, n = this.len, a = this.scrollNum, r = this.itemPX, s = this.curr, o = this.viewportIndex += e;
      if (o === t[1] + 1 && s === n - 1) this.$element.scrollTop(0), this.viewportIndex = 0; else if (o === t[0] - 1 && 0 === s) this.$element.scrollTop((n - i) * r), 
      this.viewportIndex = 11; else if (o === t[0] - 1 && s > t[0] || n - (i - t[1]) > s && o === t[1] + 1) {
        var l = this.$element.scrollTop();
        this.$element.scrollTop(l += e * r * a), this.viewportIndex = t[(e + 1) / 2];
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
      var t = this, i = t.component, n = t.hasPlace, a = e.ctrlKey, r = e.keyCode;
      switch (r) {
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
      var n, a, r = this, s = this.component, o = s.place, l = t.coords, d = e.coords, c = i;
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
            s.emit("change-place", this._place, "map");
          }), this.GMaps.event.addListener(u, "click", function() {
            r.clearMarkers(), s.emit("change-place", this._place, "map");
          }, !1), this.GMaps.event.addListener(u, "mouseover", function() {
            r.selectMarker(this), s.emit("enter-placeitem", 0);
          });
        }
        var h, p = new n.Geocoder(), f = function(e) {
          r._timer = setTimeout(function() {
            var t, i = s.placeInput.getPlace(), a = e.latLng;
            s.placesList.clear(), r.clearBlueMarker(), r.clearMarkers(), i.lat = "" + a.lat(), 
            i.lng = "" + a.lng(), t = r.createBlueMarker(n.Marker, {
              map: r._map,
              position: a,
              icon: r.bicon,
              draggable: !0,
              title: i.title || ""
            }, i), n.event.addListener(t, "dragend", function(e) {
              var t = e.latLng;
              this._place.lat = "" + t.lat(), this._place.lng = "" + t.lng(), this._place.provider = "", 
              s.emit("change-place", this._place, "map");
            }), n.event.trigger(t, "mouseover"), h = function(e, n) {
              r._timer && h.id === r.cbid && n === window.google.maps.GeocoderStatus.OK && e.length && (clearTimeout(r._timer), 
              r.hasPlace = !0, r.cbid = 0, i.title = "Right there on map", i.description = e[0].formatted_address, 
              i.provider = "", i.external_id = "", s.emit("change-place", t._place = i, "map"));
            }, h.id = ++r.cbid, p.geocode({
              latLng: new n.LatLng(i.lat, i.lng)
            }, h);
          }, 610);
        }, m = function() {
          clearTimeout(r._timer);
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
      var t, i, n = this, a = n.GMaps, r = n.isGo, s = n.component, o = n._service, l = n._request;
      r && (n.clearMarkers(), e && e !== l.query && (l.query = e, t = function(e, r) {
        t.id === n.cbid && r === a.places.PlacesServiceStatus.OK && (n.cbid = 0, i = n._placeMarker, 
        n.createMarkers(e), s.emit("search-completed", e, i ? i._place : null));
      }, t.id = ++n.cbid, o.textSearch(l, t)));
    },
    panToRight: function() {
      var e = this.GMaps, t = this._map, i = this._overlay, n = i.getProjection(), a = e.Point, r = n.fromLatLngToContainerPixel(t.getCenter()), s = n.fromContainerPixelToLatLng(new a(r.x - 100, r.y));
      t.setCenter(s);
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
        var n = this.component, a = this.GMaps.event, r = this._placeMarker = this.redMarkers.splice(e, 1)[0];
        this.hasPlace = !0, this.selectMarker(r), this.defaultOptions.zoom = this.zoomN = this.zoom16, 
        a.clearListeners(r), r.isBlue = !0, r.setDraggable(!0), a.addListener(r, "click", function() {
          t.clearMarkers(), n.emit("change-place", this._place, "map");
        }, !1), a.addListener(r, "dragend", function(e) {
          var t = e.latLng;
          this._place.lat = "" + t.lat(), this._place.lng = "" + t.lng(), this._place.provider = "", 
          n.emit("change-place", this._place, "map");
        }), a.addListener(r, "mouseover", function() {
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
      for (var i, n, a, r = this, s = !t, o = this.component, l = this.createMarker, d = this.GMaps, c = d.event, u = d.LatLng, h = d.Marker, p = new d.LatLngBounds(), f = this.redMarkers, m = this._map, g = this.ricon, v = 0, y = function() {
        var e = r.indexOf(r.redMarkers, this);
        o.placesList.clear(), o.emit("clear-marker", e), o.emit("click-placeitem", this._place);
      }, _ = function() {
        var e = r.indexOf(r.redMarkers, this);
        r.selectMarker(this), o.emit("enter-placeitem", e += r._placeMarker ? 1 : 0);
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
      }), c.addListener(n, "click", y, !1), c.addListener(n, "mouseover", _), f.push(n), 
      s && p.extend(a);
      s && m.fitBounds(p);
    },
    createMarker: function(e, t, i, n) {
      return n = new e(t), n._place = i, n;
    },
    zoom: function(e) {
      if (this.isGo) {
        this.sizeStatus = e;
        var t = this, i = t.component, n = i.element, a = t.GMaps, r = t._map, s = t.redMarkers;
        if (this.$wrap.toggleClass("gmap-big", !e), i.$resize.toggleClass("map-rc"), i.$mask.toggleClass("hide", !e), 
        e) n.css({
          top: i.otop,
          left: i.oleft
        }), t.$element.width(t.owidth).height(t.oheight), setTimeout(function() {
          r.setOptions(t.defaultOptions), r.setCenter(t._placeMarker ? t._placeMarker.getPosition() : t._userMarker.getPosition()), 
          t.hasPlace && t.panToRight();
        }, 0); else {
          var o = p.width(), l = p.height(), d = t.a, c = p.scrollTop(), u = p.scrollLeft();
          t.resize(o * (1 - 2 * d), l * (1 - d) - 56), n.css({
            top: 56 + c,
            left: o * d + u
          }), setTimeout(function() {
            r.setOptions(t.enableOptions);
          }, 0);
        }
        a.event.trigger(r, "resize"), !t._placeMarker && s.length && (t._placeMarker = s[0]), 
        r.setCenter(t._placeMarker ? t._placeMarker.getPosition() : t._userMarker.getPosition()), 
        i.placeInput.$element.focusend();
      }
    },
    indexOf: function(e, t) {
      return d.indexOf(e, t);
    }
  };
  var x = function(e) {
    var i = e.split(c), n = i.length ? t.trim(i.shift()) : "", a = t.trim(i.join(u)).replace(c, "");
    return {
      title: n,
      description: a
    };
  }, w = function(e, t) {
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
          other_params: "key=" + r + "&sensor=false&libraries=places",
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
    var t = a(this), i = t.data("timer"), n = t.data("clicked"), r = t.find("div.user-panel").addClass("show"), s = -r.outerHeight();
    return e.preventDefault(), "mouseleave" !== e.type || n ? n ? (t.data("clicked", !1), 
    void 0) : i ? (clearTimeout(i), t.data("timer", i = null), !1) : (p || (r.css("top", s), 
    t.find(".user-panel").addClass("show"), p = !0), t.prev().removeClass("hide"), t.parent().addClass("user"), 
    r.stop().animate({
      top: 56
    }, 100), void 0) : (i = setTimeout(function() {
      p = !1, r.stop().animate({
        top: s
      }, 200, function() {
        t.prev().addClass("hide"), t.parent().removeClass("user");
      }), clearTimeout(i), t.data("timer", i = null);
    }, 500), t.data("timer", i), !1);
  }
  var a = e("jquery"), r = e("bus"), s = e("store"), o = e("dialog"), l = e("xdialog").dialogs, d = e("xdialog").Identification, c = e("xidentity"), u = a(document.body);
  u.on("drop", t).on("dragover", t);
  var h = '[data-toggle="dropdown"]';
  u.on("click.dropdown.data-api", i);
  var p = !1;
  u.on("mouseenter.dropdown mouseleave.dropdown", "#app-user-menu .dropdown-wrapper", n), 
  u.on("click.usermenu", '#app-user-menu .dropdown-wrapper a[href^="/#"]', function() {
    var e = a("#app-user-menu .dropdown-wrapper"), t = e.find("div.user-panel").addClass("show"), i = -t.outerHeight();
    t.css("top", i), e.prev().addClass("hide").end().parent().removeClass("user"), e.data("clicked", !0);
  }), u.on("click.usermenu", "#app-signout", function() {
    r.emit("xapp:cross:end"), a(".navbar .dropdown-wrapper").find(".user-panel").remove(), 
    a("#app-signin").show().next().hide().removeClass("user").find(".fill-left").addClass("hide").end().find("#user-name span").text(""), 
    s.remove("cats"), s.remove("user"), s.remove("authorization"), window.location.href = "/";
  }), u.on("click.data-link dblclick.data-link", "[data-link]", function(e) {
    var t = a(this).data("link"), i = a(this).data("event-ignore");
    if (e.type !== i) {
      var n = a("#app-browsing-identity"), r = n.data("read-only"), s = n.data("settings"), o = a("#app-read-only"), l = n.data("token-type");
      if (n.size() && r && "nota" === t) return e.stopImmediatePropagation(), e.stopPropagation(), 
      e.preventDefault(), o.size() || a("#app-main").append(o = a('<div id="app-read-only" data-widget="dialog" data-dialog-type="read_only"></div>').data("settings", s.browsing)), 
      o.trigger("click"), !1;
      if (n.size() && ("" === t || "nota" === t && "user" === l)) return e.stopImmediatePropagation(), 
      e.stopPropagation(), e.preventDefault(), n.trigger("click"), !1;
    }
  });
  var f = 2;
  r.on("app:cross:edited", function(e) {
    if (0 !== f) {
      f--;
      var t = a("#app-browsing-identity"), i = t.data("settings"), n = a("#app-read-only"), r = t.data("action");
      e ? e && "no_permission" === e.error && (n.size() || a("#app-main").append(n = a('<div id="app-read-only" data-widget="dialog" data-dialog-type="read_only"></div>').data("settings", i && i.browsing || s.get("user"))), 
      n.trigger("click")) : "setup" === r && a('[data-user-action="' + r + '"]').trigger("click");
    }
  }), u.on("click.dialog.data-api", '[data-widget="dialog"]', function(e) {
    var t, i = a(this), n = i.data("dialog"), r = i.data("dialog-type"), s = i.data("dialog-tab"), c = i.data("dialog-from"), h = i.data("dialog-settings");
    e.preventDefault(), n || r && (t = l[r], h && (t = a.extend(!0, {}, t, h)), n = new ("identification" === r ? d : o)(t), 
    n.options.srcNode = i, c && (n.dialog_from = c), n.render(), i.data("dialog", n), 
    u.find('[data-dialog-type="' + r + '"]').not(i).data("dialog", n)), s && n.switchTab(s), 
    n.show(e);
  });
  var m = s.get("identities");
  m || (m = []), u.on("focus.typeahead.data-api", '[data-typeahead-type="identity"]', function(e) {
    var t = a(this);
    t.data("typeahead") || (e.preventDefault(), t.data("typeahead", new c({
      options: {
        source: m,
        useCache: !0,
        target: t,
        onNothing: function() {
          this.target.parent().removeClass("identity-avatar"), r.emit("widget-dialog-identification-nothing");
        },
        "onAutocomplete:finish": function(e) {
          var t;
          e && (t = e.identity) ? this.target.prev().attr("src", t.avatar_filename).parent().addClass("identity-avatar") : this.target.parent().removeClass("identity-avatar"), 
          r.emit("widget-dialog-identification-auto", e);
        }
      }
    })));
  });
}), define("photox", function(e) {
  "use strict";
  var t, i = e("jquery"), n = e("rex"), a = e("bus"), r = e("api").request, s = e("dialog"), o = e("store"), l = e("xdialog").dialogs, d = e("handlebars");
  d.registerHelper("px_imported", function(e) {
    return e > 0 ? e : '<i class="ix-selected"></i>';
  });
  var c = {
    getPhotoX: function(e, t) {
      return r("photox_getPhotoX", {
        resources: {
          photox_id: e
        }
      }, t);
    },
    browseSource: function(e, t, i, n, a, s) {
      var o = {}, l = {};
      return e && (l.photox_id = e), t && (l.identity_id = t), i && (l.album_id = i), 
      n && (o.beforeSend = n), o.data = l, r("photox_borwseSource", o, a, s);
    },
    getPhoto: function(e, t) {
      return r("photox_getPhoto", {
        data: {
          photo_id: e
        }
      }, t);
    },
    add: function(e, t, i, n) {
      var a = {
        type: "POST",
        resources: {
          photox_id: e
        },
        data: t
      };
      return i && (a.beforeSend = i), r("photox_add", a, n);
    },
    addAlbum: function(e, t, i, n, a) {
      return c.add(e, {
        identity_id: t,
        album_id: i
      }, n, a);
    },
    addStream: function(e, t, i, n, a) {
      return c.add(e, {
        identity_id: t,
        ids: i
      }, n, a);
    },
    addFeed: function(e, t, i) {
      return c.add(e, {
        stream_id: t
      }, i);
    },
    getLikes: function(e, t) {
      return r("photox_getLikes", {
        resources: {
          photox_id: e
        }
      }, t);
    },
    like: function(e, t) {
      return r("photox_like", {
        type: "POST",
        data: {
          id: e
        }
      }, t);
    },
    delAlbum: function(e, t, i, n, a) {
      return r("photox_del", {
        type: "POST",
        resources: {
          photox_id: e
        },
        data: {
          provider: t,
          album_id: i
        },
        beforeSend: n
      }, a);
    },
    delPhotos: function(e, t, i, n, a) {
      return r("photox_del", {
        type: "POST",
        resources: {
          photox_id: e
        },
        data: {
          provider: t,
          photo_ids: i
        },
        beforeSend: n
      }, a);
    }
  }, u = function() {};
  t = u.prototype, t.has = function() {
    return !!this.uid && !!this.gid;
  }, t.find = function(e) {
    return n.indexOf(this.paths, e);
  }, t.setUid = function(e) {
    return this.uid = e, this;
  }, t.setGid = function(e) {
    return this.gid = e, this;
  }, t.cd = function(e, t, i) {
    this.paths || (this.paths = []), t = t || 1, this.paths = this.paths.slice(0, t);
    var n = this.find(e);
    return -1 === n ? this.paths.push(e) : this.paths = this.paths.slice(0, n + 1), 
    i && i(e, this), this;
  }, t.clear = function(e) {
    return this.paths && (this.paths.length = 0), e && e(), this;
  }, t.prev = function(e) {
    var t = this.paths;
    t.pop(), e && e(t[t.length - 1], t);
  };
  var h = function(e, t, i) {
    this.composition = e, this.selector = t, this.$element = e.$(t), this.providers = i, 
    this.append(i);
  };
  t = h.prototype, t.liTmp = '<li{{class}} data-provider="{{provider}}" data-iid="{{iid}}"><a href="#" class="hide-text""><i class="ix-provider ix-{{provider}}"></i></a></li>', 
  t.badgeTmmp = '<div class="badge badgex"></div>', t.generate = function(e) {
    var t, i = this.liTmp, n = "";
    for (e = e.split(" "); t = e.shift(); ) t = t.split(":"), n += i.replace("{{class}}", +t[1] ? "" : ' class="no-oauth"').replace(/\{\{provider\}\}/g, t[0]).replace("{{iid}}", t[1]);
    return n;
  }, t.append = function(e) {
    this.$element.append(this.generate(e));
  }, t.switch = function(e, t) {
    var i = this.$element, n = i.find('[data-provider="' + e + '"]'), a = !0;
    return n.hasClass("active") ? t || n.removeClass("active") : (i.find(".active").removeClass("active"), 
    n.addClass("active"), a = !1), a;
  }, t.updateBadge = function(e, t) {
    var n, a = this.$element.find('> [data-provider="' + e + '"]'), r = a.find(".badge");
    r.length ? n = +r.text() : (r = i(this.badgeTmmp), a.append(r), n = 0), r.text(n + t);
  };
  var p = function(e, t) {
    this.composition = e, this.selector = t, this.$element = e.$(t), this.initstatus = 1;
  };
  t = p.prototype, t.liTmp = '<li data-iid="{{iid}}" data-eaid="{{aid}}"><a href="#">{{dir}}</a><span class="divider hidden"></span></li>', 
  t.displayHome = function(e) {
    var t = o.get("user").identities, i = n.find(t, function(t) {
      return t.id === e ? !0 : void 0;
    });
    this.$element.append(this.generate(e, "", i.name + "'s Dropbox")), this.initstatus = 0;
  }, t.generate = function(e, t, i) {
    return this.liTmp.replace("{{iid}}", e).replace("{{eaid}}", t).replace("{{dir}}", i);
  }, t.show = function(e) {
    var t = this.$element;
    this.initstatus && this.displayHome(e), this.del(1), t.hasClass("hide") && t.removeClass("hide");
  }, t.del = function(e) {
    var t = this.$element.find("li").slice(e - 1);
    t.nextAll().remove(), t.find(".divider").addClass("hidden");
  }, t.add = function(e, t) {
    var n = i(this.generate(e, t, t));
    this.$element.append(n), n.prev().find(".divider").removeClass("hidden");
  }, t.hide = function() {
    this.$element.addClass("hide");
  }, t.toggle = function(e, t) {
    e ? this.show(t) : this.hide();
  };
  var f = function(e, t) {
    this.composition = e, this.selector = t, this.$albums = e.$(t), this.$parent = this.$albums.parent();
  };
  t = f.prototype, t.liAlbumTmp = '{{#each albums}}<li data-provider="{{provider}}" data-iid="{{by_identity.id}}" data-eaid="{{external_id}}" data-imported="{{imported}}"><div class="thumbnail"><div class="badge album-badge badgex {{#unless imported}}hide{{/unless}}">{{{px_imported imported}}}</div><div class="photo"><div class="album-figure"></div>{{#if artwork}}<figure><img alt="" src="{{artwork}}" width="70" height="70" />{{else}}<figure class="placeholder ix-placehoder">{{/if}}</figure></div><h4 class="name">{{caption}}</h4></div></li>{{/each}}', 
  t.liPhotoTmp = '{{#each photos}}<li data-provider="{{provider}}" data-iid="{{by_identity.id}}" data-imported="{{imported}}" data-epid="{{external_id}}" data-pid="{{id}}"><div class="thumbnail"><div class="badge album-badge badgex {{#unless imported}}hide{{/unless}}"><i class="ix-selected"></i></div><div class="photo"><div class="photo-figure"></div>{{#if images.preview.url}}<figure><img alt="" src="{{images.preview.url}}" width="70" height="70" />{{else}}<figure class="placeholder ix-placehoder">{{/if}}</figure></div><h4 class="name">{{caption}}</h4></div></li>{{/each}}', 
  t.showAlbums = function() {
    var e = this.$albums, t = this.liAlbumTmp, i = this.composition, n = this, a = i.q;
    a.push(c.browseSource(i.cid, null, null, function() {
      i.emit("toggle-loading", !0);
    }, function(a) {
      i.emit("toggle-loading", !1);
      var r = a.albums.length, s = a.photos.length;
      if (r + s) {
        var o = d.compile(t), l = o(a), c = n.genPhotosHTML(a);
        e.html(l + c);
      } else i.emit("toggle-error", !1, "albums");
    }, function(e, t) {
      i.emit("toggle-loading", !1), 400 === t ? i.emit("toggle-error", !1, "albums") : i.emit("toggle-error", !1, "ajax");
    }));
  }, t.genPhotosHTML = function(e) {
    var t = d.compile(this.liPhotoTmp), i = t(e);
    return i;
  }, t.hideAlbums = function() {
    this.$albums.addClass("hide");
  }, t.switchByProvider = function(e, t) {
    this.$albums.removeClass("hide").children().each(function() {
      var e = i(this), n = e.attr("data-provider");
      e.toggleClass("hide", n !== t);
    });
  }, t.showAllAlbums = function() {
    this.$albums.removeClass("hide").find(" > .hide").removeClass("hide");
  }, t.startUL = '<ul class="thumbnails photos hide">', t.endUL = "</ul>", t.generate = function(e) {
    var t = d.compile(this.liAlbumTmp), i = d.compile(this.liPhotoTmp), n = t(e), a = i(e);
    return this.startUL + n + a + this.endUL;
  }, t.showPhotos = function(e) {
    var t;
    t = i(this.generate(e)), this.$albums.append(t), t.removeClass("hide"), this.$parent.append(t);
  }, t.toggleBadge = function(e, t) {
    var i = e.find(".badge");
    i.toggleClass("hide", t), i.hasClass("hide") ? e.attr("data-imported", "0") : (e.attr("data-imported", "-2"), 
    i.html('<i class="ix-selected"></i>'));
  }, t.updateBadge = function(e, t, i) {
    var n = this.$albums.find('[data-provider="' + e + '"]'), a = ~~n.attr("data-imported");
    i ? a = t : -1 !== a && (a += t), n.attr("data-imported", a), n.find(".badge").text(a).toggleClass("hide", !a);
  };
  var m = e("panel"), g = m.extend({
    options: {
      template: '<div class="panel photox-panel" id="photox-panel"><div class="clearfix panel-header"><h3 class="pull-left title panel-title"><i class="ix-wall ix-wall-blue"></i>&nbsp;PhotoX</h3><ul class="pull-right nav nav-tabs"></ul></div><div class="panel-body"><ul class="breadcrumb hide"></ul><div class="errors hide"><div class="albums-error hide"><p class="title">Oops, no photo to share.</p><p>Import photos from your account above.</p><br /><p>Collects photos from a variety of your web accounts.</p><p>and share with everyone’s all together in the ·X·.</p></div><div class="photos-error hide"><p class="title">Album empty.</p></div><div class="ajax-error hide"><p class="title">Network error. Please try to reload.</p></div></div><div class="loading hide"><img alt="" width="32" height="32" src="/static/img/loading.gif" /></div><ul class="thumbnails albums"></ul></div><div class="panel-footer"><div class="detail"><span class="selected-nums">0</span> pics selected</div><div class="icon-resize"></div><button class="xbtn-import">Import</button></div></div>',
      parentNode: null,
      srcNode: null
    },
    init: function() {
      var e = this.options;
      this.cid = e.crossId, this.providers = e.providers, delete e.providers, this.navTabs = new h(this, ".panel-header .nav-tabs", this.providers), 
      this.breadcrumb = new p(this, ".panel-body .breadcrumb"), this.thumbnails = new f(this, ".panel-body .albums"), 
      this.fs = new u(), this.q = [], this.render(), this.listen();
    },
    listen: function() {
      var e = this, t = e.fs, r = e.cid, o = e.element, d = e.navTabs, u = e.thumbnails, h = e.breadcrumb, p = e.q, f = e.element.find(".loading");
      o.on("click.photox", ".nav-tabs > li", function(t) {
        t.preventDefault(), t.stopPropagation(), e.killAjaxs(), e.emit("toggle-loading", !1), 
        e.emit("toggle-error", !0);
        var n = i(this), a = ~~n.data("iid"), r = n.data("provider");
        if (a) d.switch(r) ? (e.emit("show-albums"), h.toggle(!1)) : e.emit("switch-provider", a, r), 
        u.$albums.nextAll(".photos").remove(); else {
          var o = new s(l.addidentity);
          o.render(), o.element.find(".oauth-" + r).trigger("click");
        }
      }), o.on("click.photox", ".breadcrumb a", function(e) {
        e.preventDefault();
      }), o.on("mousedown.photox", ".thumbnails > li[data-eaid]", function(s) {
        s.preventDefault();
        var o = i(this), l = o.data(), f = l.iid, m = l.provider, g = l.eaid, v = ~~o.attr("data-imported"), y = 0, _ = setTimeout(function() {
          if (y = 1, u.toggleBadge(o), -2 !== v) {
            if (0 !== v && -2 !== v) return c.delAlbum(r, m, g, null, function() {
              o.attr("data-imported", "0"), a.emit("update-photoxwidget");
            }), void 0;
            var e = function() {
              o.attr("data-imported", "-1"), a.emit("update-photoxwidget");
            };
            "instagram" === m ? i.when(c.browseSource(r, f, g)).then(function(t) {
              var i = t.photos, a = n.map(i, function(e) {
                return e.external_id;
              });
              c.addStream(r, f, JSON.stringify(a), null, e);
            }) : c.addAlbum(r, f, g, null, e);
          }
        }, 987);
        o.on("mouseup.photox", function() {
          if (clearTimeout(_), o.off("mouseup.photox"), !y) {
            if (d.switch(m, !0), "dropbox" === m) {
              h.toggle("dropbox" === m, f);
              var i = decodeURIComponent(g).split("/"), n = i.length;
              g = i[n - 1], t.has() || t.setUid(f).setGid(m).cd("/"), t.cd(g, n, function(e) {
                h.del(n), h.add(f, e);
              });
            }
            u.hideAlbums(), p.push(c.browseSource(r, f, g, function() {
              e.emit("toggle-loading", !0);
            }, function(t) {
              e.emit("toggle-loading", !1);
              var i = t.albums.length, n = t.photos.length, a = i + n;
              a ? u.showPhotos(t, v) : e.emit("toggle-error", !1, "photos");
            }, function(t, i, n) {
              i || "timeout" !== n || (e.emit("toggle-loading", !1), e.emit("toggle-error", !1, "ajax"));
            }));
          }
        });
      }), o.on("click.photox", ".thumbnails > li[data-epid]", function(t) {
        t.preventDefault(), t.stopPropagation();
        var s = i(this), o = s.data(), l = o.iid, d = o.provider, h = o.epid, p = s.attr("data-pid"), f = '["' + p + '"]', m = '["' + h + '"]', g = ~~s.attr("data-imported");
        return -2 !== g ? (u.toggleBadge(s), 0 !== g && -2 !== g ? (c.delPhotos(r, d, f, null, function(t) {
          var i = s.parent(), r = i.children(), o = 0, l = [];
          s.attr("data-pid", 0), s.attr("data-imported", 0), n.each(t.photox.photos, function(e) {
            d === e.provider && (o++, s = r.filter('[data-epid="' + e.external_id + '"]'), s.size() || l.push(e), 
            s.attr("data-imported", 1), s.attr("data-pid", e.id), s.find(".badge").removeClass("hide"));
          }), o && i.append(u.genPhotosHTML({
            photos: l
          })), e.emit("update-albums-badge", d, o, !0), a.emit("update-photoxwidget");
        }), void 0) : ("instagram" === d && c.addStream(r, l, m, null, function(t) {
          var i = t.photox.photos, r = s.parent(), l = r.children(), c = 0, h = [];
          n.each(i, function(e) {
            d === e.provider && (c++, s = l.filter('[data-epid="' + e.external_id + '"]'), s.size() || o.photos.push(e), 
            s.attr("data-imported", 1), s.attr("data-pid", e.id), s.find(".badge").removeClass("hide"));
          }), c && (r.append(u.genPhotosHTML({
            photos: h
          })), e.emit("update-albums-badge", d, c, !0)), a.emit("update-photoxwidget");
        }), void 0)) : void 0;
      }), e.on("show-albums", function() {
        u.showAllAlbums();
      }), e.on("toggle-loading", function(e) {
        f[(e ? "remove" : "add") + "Class"]("hide");
      }), e.on("toggle-error", function(e, t) {
        var i = o.find(".errors").toggleClass("hide", e);
        t && (i.children().addClass("hide"), "albums" === t ? i.find(".albums-error").removeClass("hide") : "photos" === t ? i.find(".photos-error").removeClass("hide") : i.find(".ajax-error").removeClass("hide"));
      }), e.on("update-albums-badge", function(e, t, i) {
        u.updateBadge(e, t, i);
      }), e.on("switch-provider", function(e, i) {
        "dropbox" === i && t.clear().setUid(e).setGid(i).cd("/"), h.toggle("dropbox" === i, e), 
        u.switchByProvider(e, i);
      });
    },
    showAfter: function() {
      var e = this.srcNode.offset();
      this.element.css({
        top: e.top,
        left: e.left - 20
      }), this.thumbnails.showAlbums();
    },
    killAjaxs: function(e) {
      for (;e = this.q.shift(); ) e.abort();
    },
    destory: function() {
      this.killAjaxs(), this.element.off(), this.element.remove(), this._destory();
    }
  });
  return g;
}), define("filehtml5", function(e) {
  function t() {
    return "file-" + o++;
  }
  function i(e, t) {
    return function(i) {
      return e.call(t, i);
    };
  }
  var n = e("class"), a = e("emitter"), r = window, s = n.create(a, {
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
      var a, r = new FormData(), s = n, o = this._xhr, l = o.upload, d = this._boundEventHandler;
      for (a in t) r.append(a, t[a]);
      if (s && r.append(s, this._file), o.addEventListener("loadstart", d, !1), o.addEventListener("load", d, !1), 
      o.addEventListener("error", d, !1), o.addEventListener("abort", d, !1), o.addEventListener("loadend", d, !1), 
      o.addEventListener("readystatechange", d, !1), l.addEventListener("progress", d, !1), 
      l.addEventListener("error", d, !1), l.addEventListener("abort", d, !1), o.open("POST", e, !0), 
      o.withCredentials = !0, this._xhrHeaders) for (a in this._xhrHeaders) o.setRequestHeader(a, this._xhrHeaders[a]);
      o.send(r), this.emit("uploadstart", {
        xhr: o
      });
    },
    cancelUpload: function() {
      this._xhr.abort();
    }
  });
  s.isValidFile = function(e) {
    return r && r.File && e instanceof r.File;
  }, s.canUpload = function() {
    return r && r.FormData && r.XMLHttpRequest;
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
    country_name: "United Kingdom of Great Britain and Northern Ireland",
    short_name: "GB",
    search_index: "44 united kingdom of great britain and northern ireland gb 大不列颠及北爱尔兰联合王国",
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
  var t = e("jquery"), i = e("api"), n = "", a = 0, r = "", s = "", o = e("countrycodes"), l = e("panel"), d = function(e, i) {
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
    e !== r && (i.request("getIdentity", {
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
      t("#phone-panel .name").val(e.identities[0].name).hide(), t("#phone-panel .add").toggleClass("match", !0)) : (s = "", 
      t("#phone-panel .identity-avatar").hide(), t("#phone-panel .identity-name").hide(), 
      t("#phone-panel .name").val("").show(), t("#phone-panel .add").toggleClass("match", !1));
    }), r = e);
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
          var a = t(".complete-list li.selected"), r = ~~a.attr("country-code");
          return d(r), i.find(".tips-area").show(), i.find(".complete-list").slideUp(), void 0;
        }
        var s = "", l = -1, c = t(this).val().toLowerCase();
        if (c) if (/^\+[0-9]*/.test(c)) for (var u = 0; o.length > u; u++) "+" + o[u].country_code === c ? (s = n(u) + s, 
        l = u) : -1 !== ("+" + o[u].search_index).indexOf(c) && (s += n(u), l = -1 === l ? u : l); else for (u = 0; o.length > u; u++) o[u].country_code === c ? (s = n(u) + s, 
        l = u) : -1 !== o[u].search_index.indexOf(c) && (s += n(u), l = -1 === l ? u : l);
        i.find(".complete-list").html(s), s ? (i.find(".tips-area").hide(), i.find(".complete-list").slideDown(), 
        i.find(".complete-list li").eq(0).toggleClass("selected", !0), d(l, !0)) : (i.find(".tips-area").show(), 
        i.find(".complete-list").slideUp());
      }), i.on("keydown.phonepanel", ".countrycode", function(e) {
        if (i.find(".complete-list").html()) {
          var t = i.find(".complete-list li.selected"), n = i.find(".complete-list"), a = ~~t.index(), r = 44, s = 3 * r, o = i.find(".complete-list li").length - 1, l = n.scrollTop();
          switch (e.keyCode) {
           case 38:
            event.preventDefault(), 0 > --a && (a = o);
            break;

           case 40:
            event.preventDefault(), ++a > o && (a = 0);
          }
          t.toggleClass("selected", !1), i.find(".complete-list li").eq(a).toggleClass("selected", !0);
          var d = a * r, c = d - l;
          0 > c ? n.scrollTop(d) : c + r > s && n.scrollTop(d + r - s + 1);
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
      }), i.on("keyup.phonepanel", ".name", function(r) {
        if (t(this).val() && 13 === r.keyCode) {
          var l = "+" + o[a].country_code + n, d = i.find(".name").val();
          e.add({
            provider: "phone",
            external_id: l,
            external_username: l,
            name: d,
            avatar_filename: s ? s : ExfeeWidget.api_url + "/avatar/default?name=" + d
          }), e.hide();
        }
        u();
      }), i.on("click.phonepanel", ".add", function() {
        var t = "+" + o[a].country_code + n, r = i.find(".name").val();
        e.add({
          provider: "phone",
          external_id: t,
          external_username: t,
          name: r,
          avatar_filename: s ? s : ExfeeWidget.api_url + "/avatar/default?name=" + r
        }), e.hide();
      });
    },
    save: function() {
      this.$(".place-submit").trigger("click.mappanel");
    },
    showAfter: function() {
      var e = this, i = e.srcNode;
      if (i) {
        var r = i.offset(), s = e.element, l = i.outerHeight();
        s.css({
          left: this.oleft = r.left,
          top: this.otop = r.top + l
        }), t("#phone-panel .identity-avatar").hide(), t("#phone-panel .identity-name").hide(), 
        n = i.val().replace(/\-|\(|\)|\ /g, "");
        var c = a;
        if (/^\+.*$/.test(n)) for (var u = 0; o.length > u; u++) if (o[u].regular.test(n)) {
          n = n.replace(o[u].regular, ""), c = u;
          break;
        }
        d(c), s.find(".name").focus();
      }
    },
    destory: function() {
      this.element.off(), this.element.remove(), this._destory();
    }
  });
  return f;
}), define("photoxwidget", function(e) {
  "use strict";
  var t = e("api").request, i = e("rex"), n = e("bus"), a = e("store"), r = e("photox"), s = e("mnemosyne"), o = e("widget"), l = function(e, i) {
    return t("photox_getPhotoX", {
      resources: {
        photox_id: e
      },
      data: {
        sort: "imported_time_desc",
        limit: 11
      }
    }, i);
  }, d = o.extend({
    options: {
      template: '<div class="widget photox-widget"><div class="tab tab-0 hide"><div class="table-wrapper"><table cellspacing="0" cellpadding="0" border-spacing="0" border="0"><tbody><tr></tr></tbody></table></div><div class="btn-open"><i class="ix-wall ix-wall-blue"></i></div></div><div class="tab tab-1 hide"><i class="ix-wall ix-wall-gay"></i>Share photos, save memory.</div></div>',
      tdTmp: '<td><figure><img class="pic" src="{{url}}" width="{{width}}" height="{{height}}" /></figure></td>',
      tdTmpMore: '<td class="more">···</td>',
      parentNode: null,
      onShowBefore: function() {
        this.emit("load");
      },
      onLoad: function() {
        this.load();
      }
    },
    init: function() {
      this.render();
    },
    render: function() {
      var e = this.options;
      this.parentNode = e.parentNode, this.srcNode = e.srcNode, this.crossId = e.crossId, 
      delete e.parentNode, delete e.srcNode, delete e.crossId, this.limited = 10, this.$tr = this.element.find("tr"), 
      this.listen();
    },
    listen: function() {
      var e = this;
      n.on("update-photoxwidget", function() {
        e.load();
      }), this.element.on("click.photoxwidget", ".btn-open, .tab-1", function(t) {
        if (t.preventDefault(), t.stopPropagation(), !$("#photox-panel").size()) {
          var n, s = a.get("user"), o = s.identities, l = [ "facebook", "instagram", "flickr", "dropbox" ], d = l.slice(0), c = [];
          i.each(o, function(e) {
            n = i.indexOf(d, e.provider), -1 !== n && (d.splice(n, 1), c.push(e.provider + ":" + e.id));
          }), c.push(""), d.push(""), d = c.join(" ") + d.join(":0 ");
          var u = new r({
            options: {
              parentNode: $("#app-tmp"),
              srcNode: $(".cross-photox"),
              crossId: Cross.id,
              providers: d
            }
          });
          u.show(), e.photoxPanel = u;
        }
      }), this.element.on("click.photoxwidget", ".table-wrapper", function(e) {
        if (e.preventDefault(), !$(".mnemosyne-panel").size()) {
          var t = a.get("user"), i = new s({
            options: {
              parentNode: $("#app-tmp"),
              srcNode: $(".table-wrapper"),
              crossId: Cross.id,
              userId: t.id
            }
          });
          i.show();
        }
      }), $("body").on("click.photoxwidget", function(e) {
        var t = $("#photox-panel");
        return t.length && t[0] !== e.target && !$.contains(t[0], e.target) ? (e.preventDefault(), 
        e.stopPropagation(), t.trigger("destory.widget"), void 0) : void 0;
      });
    },
    generate: function(e, t) {
      for (var i, n = this.options.tdTmp, a = 0, r = e.length, s = ""; r > a; ++a) i = e[a].images.preview, 
      s += n.replace("{{url}}", i.url).replace("{{height}}", 64).replace("{{width}}", 64 * i.width / i.height);
      return t && (s += this.options.tdTmpMore), s;
    },
    load: function() {
      var e = this, t = e.$tr, i = e.element.find(".tab"), n = i.eq(0), a = i.eq(1), r = e.limited;
      this.defer && this.defer.abort(), this.defer = l(this.crossId, function(i) {
        var s = i.photox.photos, o = s.length, l = o > r;
        o ? (n.removeClass("hide"), a.addClass("hide"), l && (s = s.slice(0, r)), t.html(e.generate(s, l))) : (n.addClass("hide"), 
        a.removeClass("hide"));
      });
    },
    show: function() {
      return this.emit("showBefore"), this.element.appendTo(this.parentNode), this.emit("showAfter"), 
      this;
    }
  });
  return d;
}), define("mnemosyne", function(e) {
  "use strict";
  for (var t = 0, i = [ "ms", "moz", "webkit", "o" ], n = 0; i.length > n && !window.requestAnimationFrame; ++n) window.requestAnimationFrame = window[i[n] + "RequestAnimationFrame"], 
  window.cancelAnimationFrame = window[i[n] + "CancelAnimationFrame"] || window[i[n] + "CancelRequestAnimationFrame"];
  window.requestAnimationFrame || (window.requestAnimationFrame = function(e) {
    var i = new Date().getTime(), n = Math.max(0, 16 - (i - t)), a = window.setTimeout(function() {
      e(i + n);
    }, n);
    return t = i + n, a;
  }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(e) {
    clearTimeout(e);
  });
  var a, r, s, o = void 0, l = function(e, t, i, n, a, r) {
    return (e >= 0 && a >= e || i >= 0 && a >= i) && (n >= 0 && r >= n || t >= 0 && r >= t);
  }, c = function(e) {
    var t = e.getBoundingClientRect();
    return l(t.top, t.right, t.bottom, t.left, r, a);
  }, u = function(e, t) {
    for (var i = e.length, n = []; i > t; ++t) n.push(e[t]);
    return t;
  }, h = Math.cos, p = Math.sin, f = Math.tan, m = Math.abs, g = Math.asin, v = Math.sqrt, y = Math.atan, _ = Math.atan2, b = Math.min, x = Math.PI, w = 1e-6, k = {
    precision: w,
    identity: function() {
      return [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ];
    },
    multiply: function C(e, t) {
      var i = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ];
      return i[0] = e[0] * t[0] + e[1] * t[4] + e[2] * t[8], i[1] = e[0] * t[1] + e[1] * t[5] + e[2] * t[9], 
      i[2] = e[0] * t[2] + e[1] * t[6] + e[2] * t[10], i[4] = e[4] * t[0] + e[5] * t[4] + e[6] * t[8], 
      i[5] = e[4] * t[1] + e[5] * t[5] + e[6] * t[9], i[6] = e[4] * t[2] + e[5] * t[6] + e[6] * t[10], 
      i[8] = e[8] * t[0] + e[9] * t[4] + e[10] * t[8], i[9] = e[8] * t[1] + e[9] * t[5] + e[10] * t[9], 
      i[10] = e[8] * t[2] + e[9] * t[6] + e[10] * t[10], i[12] = e[12] * t[0] + e[13] * t[4] + e[14] * t[8] + t[12], 
      i[13] = e[12] * t[1] + e[13] * t[5] + e[14] * t[9] + t[13], i[14] = e[12] * t[2] + e[13] * t[6] + e[14] * t[10] + t[14], 
      2 >= arguments.length ? i : C([ i ].concat(u(arguments, 2)));
    },
    move: function(e, t) {
      return t[2] || (t[2] = 0), [ e[0], e[1], e[2], 0, e[4], e[5], e[6], 0, e[8], e[9], e[10], 0, e[12] + t[0], e[13] + t[1], e[14] + t[2], 1 ];
    },
    translate: function(e, t, i) {
      return "number" != typeof i && (i = 0), [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, e, t, i, 1 ];
    },
    scale: function(e, t, i) {
      return "number" != typeof i && (i = 1), [ e, 0, 0, 0, 0, t, 0, 0, 0, 0, i, 0, 0, 0, 0, 1 ];
    },
    rotateX: function(e, t) {
      return t = h(e), e = p(e), [ 1, 0, 0, 0, 0, t, e, 0, 0, -e, t, 0, 0, 0, 0, 1 ];
    },
    rotateY: function(e, t) {
      return t = h(e), e = p(e), [ t, 0, -e, 0, 0, 1, 0, 0, e, 0, t, 0, 0, 0, 0, 1 ];
    },
    rotateZ: function(e, t) {
      return t = h(e), e = p(e), [ t, e, 0, 0, -e, t, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ];
    },
    rotate: function(e, t, i, n, a, r, s) {
      return n = h(e), e = p(e), a = h(t), t = p(t), r = h(i), i = p(i), s = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ], 
      s[0] = a * r, s[1] = n * i + e * t * r, s[2] = e * i - n * t * r, s[4] = -a * i, 
      s[5] = n * r - e * t * i, s[6] = e * r + n * t * i, s[8] = t, s[9] = -e * a, s[10] = n * a, 
      s;
    },
    skew: function(e, t, i) {
      return [ 1, 0, 0, 0, f(i), 1, 0, 0, f(t), f(e), 1, 0, 0, 0, 0, 1 ];
    },
    equal: function(e, t) {
      if (!e || !t) return !1;
      if (e == t) return !0;
      for (var i = 0, n = e.length; n > i; ++i) if (m(e[i] - t[i]) >= w) return !1;
      return !0;
    },
    random: function(e) {
      for (e = e.slice(0), (e[0] == x / 2 || e[0] == -x / 2) && (e[0] = -e[0], e[1] = x - e[1], 
      e[2] -= x), e[0] > x / 2 && (e[0] -= x, e[1] = x - e[1], e[2] -= x), -x / 2 > e[0] && (e[0] += x, 
      e[1] = -x - e[1], e[2] -= x); -x > e[1]; ) e[1] += 2 * x;
      for (;e[1] >= x; ) e[1] -= 2 * x;
      for (;-x > e[2]; ) e[2] += 2 * x;
      for (;e[2] >= x; ) e[2] -= 2 * x;
      return e;
    },
    inverse: function(e, t, i, n, a, r, s, o, l, d, c, u) {
      return t = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ], i = e[5] * e[10] - e[6] * e[9], 
      n = e[4] * e[10] - e[6] * e[8], a = e[4] * e[9] - e[5] * e[8], r = e[1] * e[10] - e[2] * e[9], 
      s = e[0] * e[10] - e[2] * e[8], o = e[0] * e[9] - e[1] * e[8], l = e[1] * e[6] - e[2] * e[5], 
      d = e[0] * e[6] - e[2] * e[4], c = e[0] * e[5] - e[1] * e[4], u = 1 / (e[0] * i - e[1] * n + e[2] * a), 
      t[0] = u * i, t[1] = -u * r, t[2] = u * l, t[4] = -u * n, t[5] = u * s, t[6] = -u * d, 
      t[8] = u * a, t[9] = -u * o, t[10] = u * c, t[12] = -e[12] * t[0] - e[13] * t[4] - e[14] * t[8], 
      t[13] = -e[12] * t[1] - e[13] * t[5] - e[14] * t[9], t[14] = -e[12] * t[2] - e[13] * t[6] - e[14] * t[10], 
      t;
    },
    translateValues: function(e) {
      return [ e[12], e[13], e[14] ];
    },
    create: function(e) {
      var t = function(e, t, n) {
        return i || (i = 0), v(e * e + t * t + n * n);
      }, i = e[0] + t(e[0], e[1], e[2]), n = 2 / (i * i + e[1] * e[1] + e[2] * e[2]), a = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ];
      a[0] = 1 - n * i * i, a[1] = -n * i * e[1], a[2] = -n * i * e[2], a[5] = 1 - n * e[1] * e[1], 
      a[6] = -n * e[1] * e[2], a[10] = 1 - n * e[2] * e[2], a[4] = a[1], a[8] = a[2], 
      a[9] = a[6], i = k.multiply(e, a), n = t(i[5], i[6]), i[5] > 0 && i[5] != n && (n *= -1), 
      n = i[5] + n;
      var r = 2 / (n * n + i[6] * i[6]), s = [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ];
      return s[5] = 1 - r * n * n, s[6] = -r * n * i[6], s[9] = s[6], s[10] = 1 - r * i[6] * i[6], 
      a = k.multiply(a, s), i = k.multiply(e, a), n = k.scale(0 > i[0] ? -1 : 1, 0 > i[5] ? -1 : 1, 0 > i[10] ? -1 : 1), 
      i = k.multiply(n, i), a = k.multiply(a, n), n = {}, n.translate = k.translateValues(e), 
      n.rotate = [ _(-a[6], a[10]), g(a[2]), _(-a[1], a[0]) ], n.rotate[0] || (n.rotate[0] = 0, 
      n.rotate[2] = _(a[4], a[5])), n.scale = [ i[0], i[5], i[10] ], n.skew = [ y(i[9] / n.scale[2]), y(i[8] / n.scale[2]), y(i[4] / n.scale[0]) ], 
      n;
    },
    translateTo: function(e) {
      var t = k.scale(e.scale[0], e.scale[1], e.scale[2]), i = k.skew(e.skew[0], e.skew[1], e.skew[2]), n = k.rotate(e.rotate[0], e.rotate[1], e.rotate[2]);
      return k.move(k.multiply(t, i, n), e.translate);
    },
    toCSSMatrix3d: function(e, t, i) {
      for (e = e.slice(0), t = 0, i = e.length; i > t; ++t) w > m(e[t]) && (e[t] = 0);
      return "matrix3d(" + e.join() + ")";
    }
  }, E = e("jquery"), T = e("tween"), $ = e("rex"), M = e("humantime"), S = e("handlebars"), I = e("panel"), N = e("api").request, A = function(e, t, i) {
    return N("photox_like", {
      type: "POST",
      data: {
        id: e
      }
    }, t, i);
  }, P = function(e, t, i) {
    return N("photox_like", {
      type: "POST",
      data: {
        id: e,
        LIKE: !1
      }
    }, t, i);
  }, D = function(e, t, i, n) {
    return N("photox_getPhotoX", {
      resources: {
        photox_id: e
      },
      beforeSend: t
    }, i, n);
  }, z = Math.random;
  S.registerHelper("photoxPrintTime", function(e) {
    var t = M.parseISO(M.toISO(e));
    return M.printTime(t);
  });
  var O = function(e, t, i, n) {
    var a = new Image(), r = function(t) {
      t.onload = t.onerror = t = e = void 0;
    };
    a.onload = function() {
      i && i(a, e), r(a);
    }, a.onerror = function() {
      n && n(a, e), r(a);
    }, a.src = t;
  }, L = 0, H = function(e, t, i) {
    for (i in t) e.hasOwnProperty(i) || (e[i] = t[i]);
    return e;
  }, R = function(e) {
    return parseInt(e * z()) + 1;
  }, F = function(e, t) {
    return e * t;
  }, j = function(e, t, i, n) {
    var a = i / n, r = i / e, s = n / t, i = b(e, i), n = b(t, n);
    return s > r ? i = n * a : n = i / a, [ i, n ];
  }, q = function(e, t, i, n) {
    var a = i / n, r = e / t;
    return r > a ? (i = e, n = i / a) : (n = t, i = n * a), [ i, n ];
  }, U = function(e) {
    return H({
      id: L++
    }, e);
  }, B = function(e, t, i, n, a, r, s, o, l) {
    e.setAttribute("data-gid", t), e.style.opacity = 1, e.style.width = r + "px", e.style.height = a + "px";
    var d = k.translate(o, s, 6);
    if (e.style.webkitTransform = k.toCSSMatrix3d(d), e.style.transform = k.toCSSMatrix3d(d), 
    e._m4 = d, "instagram" === l && (n *= 1.1, i *= 1.1), "-1" === e.getAttribute("data-lazy")) e.setAttribute("data-whlt", [ n, i, (r - n) / 2, (a - i) / 2 ].join(",")); else {
      var c = e.querySelector("img").style;
      c.width = n + "px", c.height = i + "px", c.top = (a - i) / 2 + "px", c.left = (r - n) / 2 + "px";
    }
  }, W = [ [ {
    type: "G",
    name: "1",
    aspect_ratio: 0,
    cells: [ {
      type: "Rect",
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      margin: {
        top: 6,
        right: 6,
        bottom: 6,
        left: 6
      }
    } ]
  } ], [ {
    type: "G",
    name: "2A1",
    aspect_ratio: .5,
    cells: [ {
      type: "Rect",
      x: 0,
      y: 0,
      width: 1,
      height: .5,
      margin: {
        top: 6,
        right: 6,
        bottom: 6,
        left: 6
      }
    }, {
      type: "Rect",
      x: 0,
      y: .5,
      width: 1,
      height: .5,
      margin: {
        top: 6,
        right: 6,
        bottom: 6,
        left: 6
      }
    } ]
  }, {
    type: "G",
    name: "2A2",
    aspect_ratio: .75,
    cells: [ {
      type: "Rect",
      x: 0,
      y: 0,
      width: 1,
      height: .5,
      margin: {
        top: 6,
        right: 6,
        bottom: 6,
        left: 6
      }
    }, {
      type: "Rect",
      x: 0,
      y: .5,
      width: 1,
      height: .5,
      margin: {
        top: 6,
        right: 6,
        bottom: 6,
        left: 6
      }
    } ]
  }, {
    type: "G",
    name: "2B1",
    aspect_ratio: 4 / 3,
    cells: [ {
      type: "Rect",
      x: 0,
      y: 0,
      width: .5,
      height: 1,
      margin: {
        top: 6,
        right: 6,
        bottom: 6,
        left: 6
      }
    }, {
      type: "Rect",
      x: .5,
      y: 0,
      width: .5,
      height: 1,
      margin: {
        top: 6,
        right: 6,
        bottom: 6,
        left: 6
      }
    } ]
  } ], [ {
    type: "G",
    name: "3A1",
    aspect_ratio: 2 / 3,
    cells: [ {
      type: "Rect",
      x: 0,
      y: 0,
      width: 1,
      height: .666666,
      margin: {
        top: 6,
        right: 6,
        bottom: 6,
        left: 6
      }
    }, {
      type: "Rect",
      x: 0,
      y: .666666,
      width: .5,
      height: .333333,
      margin: {
        top: 6,
        right: 6,
        bottom: 6,
        left: 6
      }
    }, {
      type: "Rect",
      x: .5,
      y: .666666,
      width: .5,
      height: .333333,
      margin: {
        top: 6,
        right: 6,
        bottom: 6,
        left: 6
      }
    } ]
  }, {
    type: "G",
    name: "3B1",
    aspect_ratio: 1,
    cells: [ {
      type: "Rect",
      x: 0,
      y: 0,
      width: .382,
      height: .382,
      margin: {
        top: 6,
        right: 6,
        bottom: 6,
        left: 6
      }
    }, {
      type: "Rect",
      x: .382,
      y: 0,
      width: .618,
      height: .382,
      margin: {
        top: 6,
        right: 6,
        bottom: 6,
        left: 6
      }
    }, {
      type: "Rect",
      x: 0,
      y: .382,
      width: 1,
      height: .618,
      margin: {
        top: 6,
        right: 6,
        bottom: 6,
        left: 6
      }
    } ]
  } ] ], X = {}, Y = '<figure class="surface" data-lazy="-1" data-id="{{id}}" data-preview-url="{{images.preview.url}}" data-preview-height="{{images.preview.height}}" data-preview-width="{{images.preview.width}}" data-fullsize-url="{{images.fullsize.url}}" data-fullsize-height="{{images.fullsize.height}}" data-fullsize-width="{{images.fullsize.width}}" data-liked="{{like}}" data-provider="{{provider}}" ><div class="photo"></div><div class="mask"></div><div class="btn-like ix-{{#unless like}}un{{/unless}}like"{{#unless like}} style="opacity: 0;"{{/unless}}></div><div class="meta"><div class="avatar"><img width="24" height="24" src="{{by_identity.avatar_filename}}" alt="" /></div><div class="title">{{caption}}</div><time>{{photoxPrintTime updated_at}}</time><div class="place"></div></div></figure>', G = X.Rect = function(e) {
    this.html = S.compile(Y)(e);
  };
  G.prototype.toString = function() {
    return this.html;
  };
  var V = function(e, t) {
    return new X[e](t);
  }, K = function(e, t) {
    for (var i, n, a, r = 0, s = ""; i = e[r]; r++) n = t[r], a = V(n.type, i), s += "" + a;
    return s;
  }, Z = function() {};
  s = Z.prototype, s.defaultLayouts = W, s.genLayouts = function(e) {
    for (var t, i, n, a = W.slice(0), r = a.length, s = []; e; ) t = R(r > e ? e : r), 
    e -= t, i = a[t - 1], n = i[R(i.length) - 1], s.push(U(n));
    return s;
  };
  var J = function(e, t) {
    this.component = e, this.$element = t, this.animate = !0;
  };
  J.prototype.show = function(e) {
    var t = this.$element, i = t[0].style;
    i.webkitTransform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, " + E("#app-tmp").scrollLeft() + ", 0, 10, 1)", 
    i.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, " + E("#app-tmp").scrollLeft() + ", 0, 10, 1)", 
    this.$element.attr("tabindex", "-1").focus(), this.clone(e);
  }, J.prototype.exit = function() {
    var e = this.$element, t = e[0].style;
    e.attr("tabindex", "none"), new T.Tween({
      o: 1
    }).to({
      o: 0
    }, 400).interpolation(T.Interpolation.Bezier).easing(T.Easing.Exponential.Out).onUpdate(function() {
      t.opacity = this.o;
    }).onComplete(function() {
      e.empty();
    }).start(), this.img = this.curr = o, this.lockup = !1;
  }, J.prototype._clone_0 = function(e) {
    this.$element.empty(), this.lockup = !0;
    var t = this, i = e.getBoundingClientRect(), n = e.clientWidth, a = e.clientHeight, r = i.left, s = i.top, l = this.$element[0].style, c = e.getAttribute("data-preview-url"), u = e.getAttribute("data-fullsize-url"), h = +e.getAttribute("data-fullsize-width"), p = +e.getAttribute("data-fullsize-height"), f = n / h, m = a / p, g = document.createElement("div");
    g.setAttribute("class", "pic"), g.style.width = h + "px", g.style.height = p + "px";
    var v = new Image();
    v.src = c;
    var y = k.move(k.multiply(k.scale(f, m), k.identity()), [ r, s, 1 ]);
    g.style.webkitTransform = g.style.transform = y, O(g, u, function(e, t) {
      e.width = h, e.height = p, e.src = u, t.appendChild(e), e = o;
    }, function() {
      d.setAttribute("class", "load-failed");
    }), this.$element.append(g), this.curr = e;
    var _ = this.cal(h, p), b = g.style;
    return g._m4 = _, new T.Tween(y).to(_, 400).interpolation(T.Interpolation.Bezier).easing(T.Easing.Exponential.Out).onUpdate(function(e) {
      var t = k.toCSSMatrix3d(this);
      b.webkitTransform = b.transform = t, l.opacity = e;
    }).onComplete(function() {
      t.lockup = !1, g._tween = null, T.remove(this);
    }).start(), g;
  }, J.prototype.prev = function() {
    if (!this.lockup) {
      var e, t = this.img, i = E(this.curr), n = i.prev(".surface");
      this.curr = (n.length ? n : i.parent().find(".surface").last())[0], e = this.clone(this.curr), 
      this.effect(t, e, -1);
    }
  }, J.prototype.next = function() {
    if (!this.lockup) {
      var e, t = this.img, i = E(this.curr), n = i.next(".surface");
      this.curr = (n.length ? n : i.parent().find(".surface").first())[0], e = this.clone(this.curr), 
      this.effect(t, e, 1);
    }
  }, J.prototype.effect = function(e, t, i) {
    this.lookup = !0;
    var n = this, a = e._m4, r = t._m4, s = e.style, o = t.style, l = 50 * i;
    r = k.move(r, [ -l, 0, 0 ]), o.webkitTransform = o.transform = k.toCSSMatrix3d(r), 
    new T.Tween({
      x: 0
    }).to({
      x: l
    }, 400).easing(T.Easing.Quadratic.InOut).onStart(function() {
      n.lockup = !0, E(e).prevAll().remove();
    }).onUpdate(function(e) {
      s.opacity = 1 - e, s.webkitTransform = s.transform = k.toCSSMatrix3d(k.move(a, [ this.x, 0, 1 - e ])), 
      o.opacity = e, o.webkitTransform = o.transform = k.toCSSMatrix3d(k.move(r, [ this.x, 0, e ]));
    }).onComplete(function() {
      o.opacity = 1, n.lockup = !1, T.remove(this);
    }).start();
  }, J.prototype.update = function() {
    var e = this.img, t = e.style, i = e._m4, n = this.curr, a = +n.getAttribute("data-fullsize-width"), r = +n.getAttribute("data-fullsize-height"), s = this.cal(a, r), o = k.toCSSMatrix3d;
    new T.Tween(i).to(s, 144).easing(T.Easing.Quadratic.InOut).onUpdate(function() {
      t.webkitTransform = t.transform = o([].slice.call(this));
    }).onComplete(function() {
      T.remove(this);
    }).start();
  }, J.prototype.cal = function(e, t) {
    var i = this.vw, n = this.vh, a = j(i, n, e, t), r = a[0], s = a[1], o = r / e, l = s / t, d = (i - r) / 2, c = (n - s) / 2;
    return k.move(k.multiply(k.scale(o, l), k.identity()), [ d, c, 1 ]);
  }, J.prototype._clone_1 = function(e) {
    var t = e.getAttribute("data-preview-url"), i = e.getAttribute("data-fullsize-url"), n = +e.getAttribute("data-fullsize-width"), a = +e.getAttribute("data-fullsize-height"), r = this.cal(n, a), s = document.createElement("div");
    s.setAttribute("class", "pic"), s.style.width = n + "px", s.style.height = a + "px", 
    s._m4 = r;
    var l = new Image();
    return l.src = t, r = k.toCSSMatrix3d(r), s.style.webkitTransform = s.style.transform = r, 
    s.style.opacity = 0, O(s, i, function(e, t) {
      e.width = n, e.height = a, e.src = i, t.appendChild(e), e = o;
    }, function(e, t) {
      t.setAttribute("class", "load-failed");
    }), this.$element.append(s), s;
  }, J.prototype.resize = function(e, t) {
    this.vw = e, this.vh = t, this.img && this.update();
  }, J.prototype.clone = function(e) {
    var t = !!this.curr;
    return this.curr = e, this.img = this["_clone_" + (t ? 1 : 0)](e);
  };
  var Q = I.extend({
    options: {
      template: '<div class="panel mnemosyne-panel perspective" tabindex="-1"><div class="panel-body perspective"><div class="gallery perspective group"></div></div></div><div class="slideshow-panel perspective group"></div>'
    },
    init: function() {
      var e, t = this.options;
      this.crossId = t.crossId, this.userId = t.userId, delete t.crossId, this.render(), 
      e = this.element, this.$appTmp = E("#app-tmp"), this.$mnemosyne = e.eq(0), this.$gallery = this.$mnemosyne.find(".gallery"), 
      this.$slideshow = e.eq(1), this.typesetting = new Z(), this.slideshow = new J(this, this.$slideshow), 
      this.i = 0, this.n = 0, this.offsetTop = 0, this.offsetLeft = 24, this.paddingRight = 30, 
      this.scrollLeft = 0, this.showPhotoStatus = !1, this.listen();
    },
    listen: function() {
      function e() {
        t.frame = requestAnimationFrame(e), T.update();
      }
      var t = this, i = t.typesetting, n = t.slideshow, a = t.$mnemosyne, r = t.$gallery, s = t.$slideshow, o = t.$appTmp, l = E(window);
      e(), a.on("mouseenter.mnemosyne mouseleave.mnemosyne", ".gallery .surface", function(e) {
        e.preventDefault();
        var t = this, i = t.style, n = E(t), a = this._m4, r = "mouseenter" === e.type, s = n.data("tween"), o = +n.attr("data-liked"), l = t.querySelector(".mask").style, d = t.querySelector(".btn-like").style, c = t.querySelector(".meta").style, u = k.multiply, h = k.scale, p = k.toCSSMatrix3d;
        s || (s = new T.Tween({
          v: 1
        }).easing(T.Easing.Cubic.InOut), n.data("tween", s)), s.stop(), r ? s.delay(233).to({
          v: 1.01
        }, 150).onUpdate(function(e) {
          l.opacity = 4 * (this.v - 1), c.opacity = e, 1 !== o && (d.opacity = e), i.transform = i.webkitTransform = p(u(h(this.v, this.v), a));
        }) : s.delay(0).to({
          v: 1
        }, 150).onUpdate(function(e) {
          l.opacity = 4 * (this.v - 1), c.opacity = .99 * (1 - e), 1 !== o && (d.opacity = 1 - e), 
          t.style.transform = i.webkitTransform = p(u(h(this.v, this.v), a));
        }).onComplete(function() {
          n.data("tween", null), T.remove(this);
        }), s.start();
      }).on("click.mnemosyne", ".gallery .surface", function(e) {
        e.preventDefault(), t.scrollLeft = o.scrollLeft(), o.addClass("show-slideshow"), 
        t.emit("launch-slideshow", this);
      }).on("click.mnemosyne", ".surface .btn-like", function(e) {
        e.preventDefault(), e.stopPropagation();
        var t = E(this), i = t.parent(), n = +i.data("id"), a = +i.attr("data-liked");
        return -2 !== a ? (i.attr("data-liked", -2), 1 === a ? (P(n, function() {
          i.attr("data-liked", 0), t.addClass("ix-unlike").removeClass("ix-like");
        }, function() {
          i.attr("data-liked", 1);
        }), void 0) : (A(n, function() {
          i.attr("data-liked", 1), t.addClass("ix-like").removeClass("ix-unlike");
        }, function() {
          i.attr("data-liked", 0);
        }), void 0)) : void 0;
      }), s.on("keydown.mnemosyne", function(e) {
        e.preventDefault();
        var i = e.keyCode;
        switch (i) {
         case 39:
         case 40:
          n.next();
          break;

         case 38:
         case 37:
          n.prev();
          break;

         case 27:
          e.stopPropagation(), t.emit("exit-slideshow");
        }
      }), s.on("click.mnemosyne", function(e) {
        e.preventDefault(), "IMG" !== e.target.tagName && t.emit("exit-slideshow");
      }), E("html, body").bind("mousewheel.mnemosyne", function() {
        return !1;
      }), o.bind("mousewheel.mnemosyne", function(e, t, i) {
        var n = E(this).scrollLeft(), a = n + i;
        return E(this).scrollLeft(a), !1;
      }), o.on("scroll.mnemosyne", function(e) {
        e.preventDefault(), e.stopPropagation();
        var t, i = r.find('[data-lazy="-1"]');
        if (0 !== i.length) for (var n = function(e, t) {
          if (t) {
            E(t).removeClass("load-failed");
            var i = t.getAttribute("data-whlt").split(","), n = e.style;
            t.setAttribute("data-lazy", "1"), e.setAttribute("class", "pic"), n.width = i[0] + "px", 
            n.height = i[1] + "px", n.left = i[2] + "px", n.top = i[3] + "px", n.opacity = 0, 
            t.querySelector(".photo").appendChild(e), new T.Tween({
              v: 0
            }).to({
              v: 1
            }).easing(T.Easing.Cubic.InOut).onUpdate(function() {
              n.opacity = this.v;
            }).onComplete(function() {
              T.remove(this);
            }).start();
          }
        }, a = function(e, t) {
          t && (t.setAttribute("data-lazy", "-1"), E(t).addClass("load-failed"));
        }; (t = i.splice(0, 1)[0]) && c(t); ) t.setAttribute("data-lazy", "0"), O(t, t.getAttribute("data-fullsize-url"), n, a);
      }), l.on("throttledresize.mnemosyne", function() {
        t.getViewport(), t.getGallery(), t.updateViewport(), t.update(), o.trigger("scroll.mnemosyne");
      }), t.on("load-photos", function(e) {
        var t = e.photox.photos, i = t.length;
        i && this.emit("draw", t, i);
      }), t.on("launch-slideshow", function(e) {
        t.showPhotoStatus = !0;
        var i = r[0].style;
        new T.Tween({
          z: 3
        }).to({
          z: -610
        }, 400).easing(T.Easing.Exponential.Out).onUpdate(function(e) {
          i.transform = i.webkitTransform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, " + this.z + ", 1)", 
          i.opacity = .1 * e;
        }).onComplete(function() {
          T.remove(this);
        }).start(), t.slideshow.show(e);
      }), t.on("exit-slideshow", function() {
        t.showPhotoStatus = !1, a.focus(), t.slideshow.exit();
        var e = r[0].style;
        new T.Tween({
          z: -610
        }).to({
          z: 1
        }, 400).interpolation(T.Interpolation.Bezier).easing(T.Easing.Exponential.Out).onUpdate(function(i) {
          o.scrollLeft(t.scrollLeft), e.transform = e.webkitTransform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, " + this.z + ", 1)", 
          e.opacity = .5 * (i + 1);
        }).onComplete(function() {
          o.removeClass("show-slideshow"), T.remove(this);
        }).start();
      }), t.on("draw", function(e, t) {
        var n = i.genLayouts(t);
        this.drawPhotos(e, n, t), l.trigger("throttledresize.mnemosyne");
      }), E("body").on("click.mnemosyne", ".mnemosyne-exit", function(e) {
        e.preventDefault(), e.stopPropagation(), t.hide();
      });
    },
    updateViewport: function() {
      var e = window.scrollX, t = window.scrollY, i = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, " + e + ", " + t + ", 1, 1)", n = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, " + e + ", " + t + ", 3, 1)", a = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, " + e + ", " + t + ", 17, 1)", r = E(".mnemosyne-bg")[0].style;
      r.transform = r.webkitTransform = i;
      var s = this.$appTmp[0].style;
      s.transform = s.webkitTransform = n;
      var o = E(".mnemosyne-exit")[0].style;
      o.transform = o.webkitTransform = a;
    },
    addMBG: function() {
      var e = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, " + window.scrollX + ", " + window.scrollY + ", 1, 1)", t = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, " + window.scrollX + ", " + window.scrollY + ", 20, 1)";
      t = "-webkit-transform:" + t + ";transform:" + t + ";", E('<div class="mnemosyne-exit ix-exit" style="' + t + '"></div><div class="mnemosyne-bg perspective" style="-webkit-transform: ' + e + "; transform: " + e + ';"><div class="mnemosyne-bg-in"></div></div>').prependTo(E("body"));
    },
    delMBG: function() {
      E(".mnemosyne-exit").remove(), E(".mnemosyne-bg").remove();
    },
    drawPhotos: function(e, t, i) {
      var n, a, r, s = this.$gallery, o = 0, l = 0;
      for (this.layouts || (this.layouts = []), this.gid = this.layouts.length; n = t[o++]; ) a = n.cells, 
      r = K(e.slice(l, l += a.length), a), s.append(r);
      this.layouts = this.layouts.concat(t), this.i = this.n, this.n += i;
    },
    update: function() {
      for (var e, t, i, n, a, r, s, o, l, d, c, u, h, p, f = this.$gallery, m = f.find("figure").slice(this.i, this.n), g = this.gvw, v = this.gvh, y = this.gid, _ = this.layouts.slice(y), b = this.offsetTop, x = this.offsetLeft, w = 0, k = v, C = g; e = _.shift(); ) {
        for (y = e.id, a = e.aspect_ratio, t = e.cells.slice(), i = t.length, a && (C = F(v, a)); n = t.shift(); ) {
          r = m.eq(w), o = +r.data("preview-height"), s = +r.data("preview-width"), l = r.data("provider"), 
          1 === i && (C = F(v, s / o)), d = n.margin, u = n.height * k - d.top - d.bottom, 
          c = n.width * C - d.left - d.right, p = b + n.y * k + d.top + (v - k) / 2, h = x + n.x * C + d.left;
          var E = q(c, u, s, o);
          s = E[0], o = E[1], B(r[0], y, o, s, u, c, p, h, l), w++;
        }
        x += C;
      }
      this.addPaddingRight(0, x);
    },
    addPaddingRight: function(e, t) {
      var i = this.$gallery, n = i.find(".photos-padding-right");
      n.size() || (n = E('<div class="photos-padding-right"></div>').css({
        width: this.paddingRight
      })), n.css({
        "-webkit-transform": "translate3d(" + t + "px, " + e + "px, 0)",
        "-moz-transform": "translate3d(" + t + "px, " + e + "px, 0)",
        "-ms-transform": "translate3d(" + t + "px, " + e + "px, 0)",
        "-o-transform": "translate3d(" + t + "px, " + e + "px, 0)",
        transform: "translate3d(" + t + "px, " + e + "px, 0)"
      }), i.append(n);
    },
    getPhotos: function() {
      var e = this, t = this.userId;
      D(e.crossId, null, function(i) {
        var n = i.likes, a = i.photox.photos;
        $.each(a, function(e) {
          var i = n[e.id];
          e.like = 0, i && i.length && $.each(i, function(i) {
            i.object_id === e.id && i.by_identity.connected_user_id === t && (e.like = 1);
          });
        }), e.emit("load-photos", i);
      });
    },
    getViewport: function() {
      var e = this.element;
      this.vw = a = e.width(), this.vh = r = e.height(), this.slideshow.resize(this.vw, this.vh);
    },
    getGallery: function() {
      this.gvw = this.vw, this.gvh = this.vh - 40 - 60;
    },
    showBefore: function() {
      E("body").addClass("mnemosyne-start"), E("#app-tmp").css("-webkit-transform", "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, " + window.scrollX + ", " + window.scrollY + ", 3, 1)"), 
      E("#app-tmp").css("transform", "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, " + window.scrollX + ", " + window.scrollY + ", 3, 1)"), 
      this.getPhotos();
    },
    showAfter: function() {
      var e = E(".mnemosyne-bg"), t = e[0].style, i = e.find(".mnemosyne-bg-in")[0].style, n = this.$mnemosyne, a = (n[0].style, 
      this.$appTmp), r = this.$gallery, s = r[0].style, o = new T.Tween({
        v: 0
      }).to({
        v: 1
      }, 750).interpolation(T.Interpolation.Bezier).easing(T.Easing.Cubic.In).onUpdate(function() {
        t.opacity = this.v;
      }).onComplete(function() {
        T.remove(this);
      }), l = new T.Tween({
        v: 0
      }).delay(250).to({
        v: 1
      }, 1e3).interpolation(T.Interpolation.Bezier).easing(T.Easing.Cubic.In).onUpdate(function() {
        i.opacity = this.v;
      }).onComplete(function() {
        T.remove(this);
      }), d = new T.Tween({
        v: 2584
      }).delay(250).to({
        v: 3
      }, 1500).interpolation(T.Interpolation.Bezier).easing(T.Easing.Cubic.In).onUpdate(function() {
        s.webkitTransform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, " + this.v + ", 1)";
      }).onComplete(function() {
        a.trigger("scroll.mnemosyne"), T.remove(this);
      });
      o.start(), l.start(), d.start();
    },
    show: function() {
      return this.emit("showBefore"), this.escapable(), this.element.prependTo(this.parentNode), 
      this.addMBG(), this.emit("showAfter"), this;
    },
    hide: function() {
      T.removeAll();
      var e = this, t = E(".mnemosyne-bg")[0].style, i = e.$mnemosyne[0].style, n = e.$slideshow[0].style;
      E(document).off("keydown.panel"), this.element.off(), new T.Tween({
        o: 1
      }).to({
        o: 0
      }, 250).easing(T.Easing.Cubic.In).onUpdate(function() {
        t.opacity = i.opacity = n.opacity = this.o;
      }).onComplete(function() {
        e.destory(), T.removeAll();
      }).start();
    },
    destory: function() {
      this.delMBG(), E("html, body").unbind("mousewheel.mnemosyne"), E("body").off(".mnemosyne").removeClass("mnemosyne-start"), 
      E(".mnemosyne-exit").off("click.mnemosyne"), this.$appTmp.removeClass(".show-mnemosyne").off(".mnemosyne").css({
        "-webkit-transform": "none",
        transform: "none"
      }), E(window).off("throttledresize.mnemosyne"), cancelAnimationFrame(this.frame), 
      this.element.off(), this.element.remove(), this._destory();
    }
  });
  return Q;
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
    for (var i = e.split(",")[0].split(":")[1].split(";")[0], n = new ArrayBuffer(t.length), a = new Uint8Array(n), r = 0, s = t.length; s > r; ++r) a[r] = t.charCodeAt(r);
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
  function r(e, t) {
    var i = a(e, t);
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
  function d(e, t, i, n, a) {
    this.canvas = e, e.width = t.width, e.height = t.height, e.style.display = "none", 
    this.ctx = e.getContext("2d"), this.ctx.drawImage(t, 0, 0), this.img = t, this.ocan = i, 
    this.src = this.ctx.getImageData(0, 0, t.width, t.height), this.dest = {
      width: n,
      height: Math.round(t.height * n / t.width)
    }, this.dest.data = Array(3 * this.dest.width * this.dest.height), this.lanczos = l(a), 
    this.ratio = t.width / n, this.rcp_ratio = 2 / this.ratio, this.range2 = Math.ceil(this.ratio * a / 2), 
    this.cacheLanc = {}, this.center = {}, this.icenter = {};
    var r = this;
    setTimeout(function() {
      r.process1(r, 0);
    }, 0);
  }
  function c() {
    h(document).off("mousemove.photozone").off("mouseup.photozone");
  }
  function u(e) {
    h(document).on("mousemove.photozone", function(t) {
      function i(e) {
        0 === _ ? (d.scaleY = y + e, 0 > d.scaleY && (d.scaleY = x / g.height), d.y -= d.scaleY * g.height - d.height) : 1 === _ ? (d.scaleX = v + e, 
        0 > d.scaleX && (d.scaleX = x / g.width), d.x -= d.scaleX * g.width - d.width) : 2 === _ ? (d.scaleY = y + e, 
        0 > d.scaleY && (d.scaleY = x / g.height)) : (d.scaleX = v + e, 0 > d.scaleX && (d.scaleX = x / g.width));
      }
      function n(e) {
        0 === _ ? (d.scaleX = v + e, 0 > d.scaleX && (d.scaleX = x / g.width), d.x -= d.scaleX * g.width - d.width) : 1 === _ ? (d.scaleY = y + e, 
        0 > d.scaleY && (d.scaleY = x / g.height)) : 2 === _ ? (d.scaleX = v + e, 0 > d.scaleX && (d.scaleX = x / g.width)) : (d.scaleY = y + e, 
        0 > d.scaleY && (d.scaleY = x / g.height), d.y -= d.scaleY * g.height - d.height);
      }
      function a(e) {
        0 === _ ? (d.scaleX = v + e, 0 > d.scaleX && (d.scaleX = x / g.width)) : 1 === _ ? (d.scaleY = y + e, 
        0 > d.scaleY && (d.scaleY = x / g.height), d.y -= d.scaleY * g.height - d.height) : 2 === _ ? (d.scaleX = v + e, 
        0 > d.scaleX && (d.scaleX = x / g.width), d.x -= d.scaleX * g.width - d.width) : (d.scaleY = y + e, 
        0 > d.scaleY && (d.scaleY = x / g.height));
      }
      function r(e) {
        0 === _ ? (d.scaleY = y + e, 0 > d.scaleY && (d.scaleY = x / g.height)) : 1 === _ ? (d.scaleX = v + e, 
        0 > d.scaleY && (d.scaleY = x / g.height)) : 2 === _ ? (d.scaleY = y + e, 0 > d.scaleY && (d.scaleY = x / g.height), 
        d.y -= d.scaleY * g.height - d.height) : (d.scaleX = v + e, 0 > d.scaleX && (d.scaleX = x / g.width), 
        d.x -= d.scaleX * g.width - d.width);
      }
      t.preventDefault();
      var s = e;
      if (s && s.dragging) {
        var o = t.pageX - s.offset[0], l = t.pageY - s.offset[1], d = s.bitmap;
        switch (s.ri) {
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
        return s.offset[0] = t.pageX, s.offset[1] = t.pageY, s.stage.update(), s.bitmap80.updateImage(s.stage.canvas), 
        s.stage80.update(), !1;
      }
      if (s && s.resizing) {
        var c, u, h, p, o = t.pageX - s.aoffset[0], l = t.pageY - s.aoffset[1], f = s.stage.canvas.width, m = s.stage.canvas.height, d = s.bitmap, g = d.originalImage, v = s.psx, y = s.psy, _ = s.ri, b = s.aoffset, x = s.sss, w = s._canvasOffset;
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
            k -= s.dr, i(k / C * x), a(k / C * x);
            break;

           case 3:
            c = b[0] - t.pageX, h = c / f, n(h * x), i(h * x);
            break;

           case 4:
            c = t.pageX - b[0], h = c / f, a(h * x), r(h * x);
            break;

           case 5:
            var k = Math.sqrt(Math.pow(t.pageX - f - w.left, 2) + Math.pow(t.pageY - w.top, 2)), C = Math.sqrt(Math.pow(f, 2) + Math.pow(m, 2));
            k -= s.dr, n(k / C * x), r(k / C * x);
            break;

           case 6:
            u = t.pageY - b[1], p = u / m, a(p * x), r(p * x);
            break;

           case 7:
            var k = Math.sqrt(Math.pow(t.pageX - w.left, 2) + Math.pow(t.pageY - w.top, 2)), C = Math.sqrt(Math.pow(f, 2) + Math.pow(m, 2));
            k -= s.dr, a(k / C * x), r(k / C * x);
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
          var n, a, r = document.getElementById("avatar240"), l = document.getElementById("avatar80"), c = (i.r, 
          new o(r)), u = new o(l), h = document.getElementById("img-avatar");
          h.onload = function() {
            var e = Math.min(h.width, h.height);
            i.sss = 1, e > 240 && (i.sss = 240 / e), n = new s(h), i.psx = n.scaleX = i.sss, 
            i.psy = n.scaleY = i.sss, n.setPosition(r.width / 2 - (n.regX *= n.scaleX), r.height / 2 - (n.regY *= n.scaleY)), 
            n.rotation = i.ri, n.updateContext = function(e) {
              e.translate(r.width * i.R[0], r.height * i.R[1]), e.rotate(this.rotation * o.DEG_TO_RAD), 
              e.webkitImageSmoothingEnabled = e.mozImageSmoothingEnabled = !1;
            }, c.addChild(n), c.update(), i.bitmap = n, i.stage = c, a = new s(r), a.updateImage = function(e) {
              a.originalImage = e;
            }, a.updateContext = function(e) {
              e.scale(i.SCALE, i.SCALE), e.webkitImageSmoothingEnabled = e.mozImageSmoothingEnabled = !1;
            }, u.addChild(a), u.update(), i.bitmap80 = a, i.stage80 = u;
            var t = document.createElement("img");
            t.onload = function() {
              new d(document.getElementById("real-avatar80"), this, u.canvas, 80, 3);
            }, t.src = r.toDataURL("image/png");
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
          var r, l, c = document.getElementById("avatar240"), u = document.getElementById("avatar80"), h = (a.r, 
          new o(c)), p = new o(u), f = document.getElementById("img-avatar");
          f.onerror = f.onload = function() {
            var e = f, t = Math.min(f.width, f.height);
            if (a.sss = 1, t > 240 && (a.sss = 240 / t), "image/gif" === a.filehtml5._type) {
              var i = document.createElement("canvas"), n = i.getContext("2d");
              i.width = e.width, i.height = e.height, n.drawImage(e, 0, 0, i.width, i.height), 
              e = i;
            }
            r = new s(e), a.psx = r.scaleX = a.sss, a.psy = r.scaleY = a.sss, r.setPosition(c.width / 2 - (r.regX *= r.scaleX), c.height / 2 - (r.regY *= r.scaleY)), 
            r.rotation = a.ri, r.updateContext = function(e) {
              e.translate(c.width * a.R[0], c.height * a.R[1]), e.rotate(this.rotation * o.DEG_TO_RAD), 
              e.webkitImageSmoothingEnabled = e.mozImageSmoothingEnabled = !1;
            }, h.addChild(r), h.update(), a.bitmap = r, a.stage = h, l = new s(c), l.updateImage = function(e) {
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
          var c = new o(d), u = new s(i);
          u.setPosition(a, l), u.rotation = 90 * this.ri, u.scaleX = t.scaleX / this.sss, 
          u.scaleY = t.scaleY / this.sss, u.updateContext = function(t) {
            t.translate(d.width * e.R[0], d.height * e.R[1]), t.rotate(this.rotation * o.DEG_TO_RAD), 
            t.webkitImageSmoothingEnabled = t.mozImageSmoothingEnabled = !1;
          }, c.addChild(u), c.update();
          var h = r(c.canvas, "original.png"), m = r(document.getElementById("real-avatar80"), "80_80.png"), g = this;
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
      var n, a, r, s;
      n = a = r = s = 0;
      for (var o = e.icenter.x - e.range2; e.icenter.x + e.range2 >= o; o++) if (!(0 > o || o >= e.src.width)) {
        var l = Math.floor(1e3 * Math.abs(o - e.center.x));
        e.cacheLanc[l] || (e.cacheLanc[l] = {});
        for (var d = e.icenter.y - e.range2; e.icenter.y + e.range2 >= d; d++) if (!(0 > d || d >= e.src.height)) {
          var c = Math.floor(1e3 * Math.abs(d - e.center.y));
          void 0 == e.cacheLanc[l][c] && (e.cacheLanc[l][c] = e.lanczos(Math.sqrt(Math.pow(l * e.rcp_ratio, 2) + Math.pow(c * e.rcp_ratio, 2)) / 1e3));
          var u = e.cacheLanc[l][c];
          if (u > 0) {
            var h = 4 * (d * e.src.width + o);
            n += u, a += u * e.src.data[h], r += u * e.src.data[h + 1], s += u * e.src.data[h + 2];
          }
        }
      }
      var h = 3 * (i * e.dest.width + t);
      e.dest.data[h] = a / n, e.dest.data[h + 1] = r / n, e.dest.data[h + 2] = s / n;
    }
    ++t < e.dest.width ? setTimeout(function() {
      e.process1(e, t);
    }, 0) : setTimeout(function() {
      e.process2(e);
    }, 0);
  }, d.prototype.process2 = function(e) {
    e.canvas.width = e.dest.width, e.canvas.height = e.dest.height, e.ctx.drawImage(e.img, 0, 0), 
    e.src = e.ctx.getImageData(0, 0, e.dest.width, e.dest.height);
    for (var t, i, n = e.ocan.getContext("2d").getImageData(0, 0, e.dest.width, e.dest.height), a = 0; e.dest.width > a; a++) for (var r = 0; e.dest.height > r; r++) t = 3 * (r * e.dest.width + a), 
    i = 4 * (r * e.dest.width + a), e.src.data[i] = e.dest.data[t], e.src.data[i + 1] = e.dest.data[t + 1], 
    e.src.data[i + 2] = e.dest.data[t + 2], e.src.data[i + 3] = n.data[i + 3];
    e.ctx.putImageData(e.src, 0, 0), e.canvas.style.display = "block";
  }, t.Uploader = v, t.uploadSettings = y;
}), define(function(e) {
  "use strict";
  var t = e("jquery"), i = e("store"), n = window._ENV_, a = (e("dialog"), e("xdialog").dialogs, 
  e("handlebars")), r = e("humantime"), s = e("rex"), o = e("util"), l = e("bus"), d = e("api");
  a.registerHelper("each", function(e, t) {
    var i, n, a = t.fn, r = t.inverse, s = "";
    if (e && e.length) for (i = 0, n = e.length; n > i; ++i) e[i].__index__ = i, s += a(e[i]); else s = r(this);
    return s;
  }), a.registerHelper("ifFalse", function(e, t) {
    return a.helpers["if"].call(this, !e, t);
  }), a.registerHelper("avatarFilename", function(e) {
    return e;
  }), a.registerHelper("printName", function(e, t) {
    return e || (e = t.match(/([^@]+)@[^@]+/)[1]), e;
  }), a.registerHelper("printTime", function(e) {
    var t = r.printEFTime(e);
    return t.content || "Sometime";
  }), a.registerHelper("printTime2", function(e) {
    var t = r.printEFTime(e);
    return t.content || "To be decided";
  }), a.registerHelper("printPlace", function(e) {
    return e || "To be decided";
  }), a.registerHelper("printTime3", function(e) {
    var t = e.begin_at;
    if (!t.date) return t.date_word || "";
    var i = r.printEFTime(e);
    return i.content || "Sometime";
  }), a.registerHelper("printTime4", function(e) {
    e = a.helpers.crossItem.call(this, e);
    var t = r.printEFTime(e);
    return t.content || "Sometime";
  }), a.registerHelper("rsvpAction", function(e, t) {
    var i = {
      ACCEPTED: "Accepted",
      INTERESTED: "Interested",
      DECLINED: "Unavailable",
      NORESPONSE: "Pending"
    }, n = s.filter(e, function(e) {
      return e.identity.id === t ? !0 : void 0;
    })[0], a = "";
    if (n && n in i && "INTERESTED" !== n.rsvp_status) {
      var a = '<div><i class="';
      a += "icon-rsvp-" + n.rsvp_status.toLowerCase() + '"></i> ', a += i[n.rsvp_status] + ": " + n.identity.name + "</div>";
    }
    var r = s.map(e, function(e) {
      return e.by_identity.id === t && e.identity.id !== t ? e.identity.name : void 0;
    }).filter(function(e) {
      return e ? !0 : void 0;
    }).join(", ");
    return a += '<div><i class="icon-invite"></i> ', a += "Invited: " + r, a += "</div>", 
    r ? a : "";
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
    var n = t("#jst-user-avatar"), r = a.compile(n.html()), s = r({
      avatar_filename: e.avatar_filename
    });
    t(".user-avatar").append(s), t("#profile .user-name").find("h3").html(e.name || e.nickname), 
    t("#profile .user-bio").text(e.bio || ""), t("#profile .user-name").find(".changepassword").attr("data-dialog-type", e.password ? "changepassword" : "setpassword").find("span").text(e.password ? "Change Password..." : "Set Password..."), 
    a.registerPartial("jst-identity-item", t("#jst-identity-item").html());
    var o = t("#jst-identity-list"), r = a.compile(o.html()), l = e.identities;
    l[0].__default__ = !0;
    var s = r({
      identities: l
    });
    t(".identity-list").append(s);
    var c;
    if (c = t("#app-main").data("event")) {
      var u = c.action;
      if ("add_identity" === u) {
        var h = c.data, p = function(e, n, r) {
          var s = i.get("authorization"), o = s.token;
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
            var n = e.identity, s = i.get("user"), o = s.identities;
            o.push(n), i.set("user", s);
            var l = a.compile(t("#jst-identity-item").html()), d = l(e.identity);
            t(".identity-list").append(d), r && r.destory();
          }, function(i) {
            var a = i && i.meta;
            if (a && 401 === a.code && "authenticate_timeout" === a.errorType) {
              r && r.destory();
              var s = t('<div data-widget="dialog" data-dialog-type="authentication" data-destory="true" class="hide"></div>');
              t("#app-tmp").append(s);
              var o = t.Event("click.dialog.data-api");
              o._data = {
                callback: function() {
                  p(e, n);
                }
              }, s.trigger(o);
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
          var t = 0, i = s.filter(e, function(e) {
            return "ACCEPTED" === e.rsvp_status ? (t += e.mates, !0) : void 0;
          }).length || 0;
          return i + t;
        }), a.registerHelper("total", function(e) {
          var t = 0;
          return s.filter(e, function(e) {
            return "ACCEPTED" === e.rsvp_status ? (t += e.mates, !0) : void 0;
          }), e.length + t;
        }), a.registerHelper("confirmed_identities", function(e) {
          var t = s(e).filter(function(e) {
            return "ACCEPTED" === e.rsvp_status ? !0 : void 0;
          });
          return s(t.slice(0, 7)).map(function(e) {
            return e.identity.name;
          }).join(", ");
        }), a.registerPartial("jst-cross-box", t("#jst-cross-box").html());
        var n = a.compile(i.html()), r = "", o = "upcoming<Upcoming> sometime<Sometime> sevendays<Next 7 days> later<Later> past<Past>", l = {};
        s.map(e.crosses, function(e) {
          l[e.sort] || (l[e.sort] = {
            crosses: []
          }), l[e.sort].crosses.push(e);
        }), l.upcoming || (l.upcoming = {}), l.upcoming.crosses || (l.upcoming.crosses = []), 
        l.upcoming.crosses.reverse();
        var d = e.more.join(" "), c = /<|>/;
        s.map(o.split(" "), function(e) {
          e = e.split(c);
          var t = l[e[0]];
          t && (t.cate = e[0], t.cate_date = e[1], t.hasMore = d.search(e[0]) > -1, r += n(t));
        }), t("#profile .crosses").append(r);
      });
    }
  }, h = function(e) {
    if (e) {
      var i = e.user_id, n = e.token, r = new Date();
      r = r.getFullYear() + "-" + (r.getMonth() + 1) + "-" + r.getDate();
      var o = d.request("crosses", {
        params: {
          token: n
        },
        resources: {
          user_id: i
        }
      }, function(e) {
        new Date();
        var n = e.crosses, r = [], o = {};
        if (s.each(n, function(e, t) {
          e.exfee && e.exfee.invitations && e.exfee.invitations.length && s.each(e.exfee.invitations, function(e, n) {
            o[e.id] = [ t, n ], i === e.identity.connected_user_id && "NORESPONSE" === e.rsvp_status && (e.__crossIndex = t, 
            e.__identityIndex = n, r.push(e));
          });
        }), a.registerHelper("crossItem", function(e) {
          return "place" === e ? n[this.__crossIndex][e].title : "invitationid" === e ? n[this.__crossIndex].exfee.invitations[this.__identityIndex].id : "exfeeid" === e ? n[this.__crossIndex].exfee.id : "identityid" === e ? n[this.__crossIndex].exfee.invitations[this.__identityIndex].identity.id : "name" === e ? n[this.__crossIndex].exfee.invitations[this.__identityIndex].identity.name : n[this.__crossIndex][e];
        }), a.registerHelper("conversation_nums", function() {
          return this.__conversation_nums;
        }), r.length) {
          var l = t("#jst-invitations"), d = a.compile(l.html()), c = d({
            crosses: r
          });
          t("#profile .gr-b .invitations").removeClass("hide").append(c);
        }
      });
      return o.done(f);
    }
  }, p = function(e) {
    if (e) {
      var i = e.user_id, n = e.token, r = new Date(), o = 0;
      return r.setDate(r.getDate() - 3), o = +r, r = r.getFullYear() + "-" + (r.getMonth() + 1) + "-" + r.getDate(), 
      d.request("crosses", {
        resources: {
          user_id: i
        },
        params: {
          updated_at: r,
          token: n
        }
      }, function(e) {
        var i, n = e.crosses;
        if (0 === n.length) return t(".siderbar.updates").addClass("no-updates"), void 0;
        if (i = s.filter(n, function(e) {
          var t = e.updated, i = !1;
          if (t) {
            var n, a, r;
            for (n in t) "background" !== n && (a = t[n], r = +new Date(a.updated_at.replace(/\-/g, "/")), 
            r > o ? i |= !0 : (i |= !1, t[n] = !1));
          }
          return i ? !0 : void 0;
        }), 0 === i.length) return t(".siderbar.updates").addClass("no-updates"), void 0;
        var r = t("#jst-updates").html(), l = a.compile(r), d = l({
          updates: i
        });
        t(".siderbar.updates .cross-tip").before(d);
      });
    }
  }, f = function(e) {
    if (e && (e = i.get("authorization"))) {
      var a = e.user_id, r = +t(".user-xstats > .attended").text(), s = i.get("newbie_guide:" + a);
      if (!s && 3 >= r && !t("#app-browsing-identity").length && !t(".newbie").length) {
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
    var i = t("#jst-identity-list"), n = a.compile(i.html()), r = n({
      identities: [ e.identity ]
    });
    t(".identity-list").append(r);
  });
  var g = t(document.body);
  g.on("dblclick.profile", ".user-name h3", function() {
    var e = t.trim(t(this).html()), i = t('<input type="text" value="' + e + '" class="pull-left" />');
    i.data("oldValue", e), t(this).after(i).hide(), i.focusend(), t(".xbtn-changepassword").addClass("hide");
  }), g.on("focusout.profile keydown.profile", ".user-name input", function(e) {
    var n = e.type, a = e.keyCode;
    if ("focusout" === n || 9 === a || !e.shiftKey && 13 === a) {
      var r = t.trim(t(this).val()), s = t(this).data("oldValue");
      if (t(this).hide().prev().html(r || s).show(), t(this).remove(), !t(".settings-panel").data("hoverout") && t(".xbtn-changepassword").removeClass("hide"), 
      !r || r === s) return;
      var o = i.get("authorization"), c = o.token;
      d.request("updateUser", {
        type: "POST",
        params: {
          token: c
        },
        data: {
          name: r
        }
      }, function(e) {
        i.set("user", e.user), l.emit("app:page:changeusername", r);
      });
    }
  }), g.on("dblclick.profile", ".identity-list li .identity > span.identityname em", function() {
    var e = t(this), i = e.parents("li"), n = i.data("provider"), a = (i.data("status"), 
    i.data("editable"));
    if (-1 !== "twitter facebook google flickr instagram dropbox".indexOf(n)) i.find(".isOAuth").removeClass("hide"); else if (a) {
      var r = t.trim(e.text()), s = t('<input type="text" value="' + r + '" class="username-input" />');
      s.data("oldValue", r), e.after(s).hide(), s.focusend();
    }
  }), g.on("focusout.profile keydown.profile", ".identity-list .username-input", function(e) {
    var n = e.type, a = e.keyCode;
    if ("focusout" === n || 9 === a || !e.shiftKey && 13 === a) {
      var r = t.trim(t(this).val()), s = t(this).data("oldValue"), o = t(this).parents("li").data("identity-id");
      if (t(this).hide().prev().text(r || s).show(), t(this).remove(), !r || r === s) return;
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
          name: r
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
    var n = t(this), a = n.data("action"), r = n.parent(), s = r.data("id"), o = (r.data("invitationid"), 
    t('.gr-a [data-id="' + s + '"]')), l = r.data("exfeeid"), c = r.data("identity-id"), u = r.data("name"), h = i.get("authorization"), p = h.token;
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
      var s;
      r.parent().prev().length || r.parent().next().length || (s = r.parents(".invitations")), 
      r.parent().remove(), s && s.remove();
    });
  }), g.on("click.profile", "#profile div.cross-type", function(e) {
    e.preventDefault(), t(this).next().toggleClass("hide").next().toggleClass("hide"), 
    t(this).find("span.arrow").toggleClass("lt rb");
  }), g.on("hover.profile", ".changepassword", function(e) {
    var i = e.type;
    t(this).data("hoverout", "mouseleave" === i), "mouseenter" === i ? t(this).addClass("xbtn-changepassword") : t(this).removeClass("xbtn-changepassword");
  }), g.on("click.profile", ".more > a", function(e) {
    e.preventDefault();
    var n = t(this), r = n.parent(), o = r.data("cate"), l = i.get("authorization"), c = l.token, u = l.user_id, h = r.prev().find(" .cross-box").length, p = o;
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
        r.prev().append(i(e));
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
    var a = i.parent().data("identity-id"), r = {};
    a && (r.identity_id = a), r["80_80"] = n[0].src, r["80_80"] = decodeURIComponent(r["80_80"]), 
    r["80_80"].match(/\/80_80_/) || (r["80_80"] = ""), r.original = r["80_80"].replace(/80_80_/, "original_"), 
    y || (y = e("uploader").Uploader, v = t.extend(!0, {}, e("uploader").uploadSettings, {
      options: {
        onHideBefore: function() {
          b = null, _ = null;
        }
      }
    })), _ && (_.hide(), _ = null), _ = new y(v).render(), _.show(r);
  }), g.dndsortable({
    delay: 300,
    wrap: !0,
    list: ".identity-list",
    items: " > li",
    sort: function(e, n) {
      var a = t(e), r = t(n), s = r.parent(), o = a.index(), l = r.index(), c = s.data("draggable");
      if (c) {
        o > l ? r.before(a) : r.after(a);
        var u = i.get("authorization"), h = [];
        s.find("> li").each(function(e, i) {
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
      var a = i.get("authorization"), r = a.token, o = d.request("deleteIdentity", {
        type: "POST",
        params: {
          token: r
        },
        data: {
          identity_id: e
        }
      }, function() {
        var n = i.get("user"), a = n.identities;
        s.some(a, function(t, i) {
          return t.id === e ? (a.splice(i, 1), !0) : void 0;
        }), i.set("user", n), t('.identity-list > li[data-identity-id="' + e + '"]').remove();
      }, function(i) {
        var a = i && i.meta;
        if (a && 401 === a.code && "authenticate_timeout" === a.errorType) {
          var r = t('<div data-widget="dialog" data-dialog-type="authentication" data-destory="true" class="hide"></div>');
          t("#app-tmp").append(r);
          var s = t.Event("click.dialog.data-api");
          s._data = {
            callback: function() {
              n(e);
            }
          }, r.trigger(s);
        }
      });
      o.always(function() {
        g.data("trash-overlay-deletable", !0);
      });
    }
    var a = g.data("trash-overlay-deletable");
    if (a) {
      g.data("trash-overlay-deletable", !1), e.stopPropagation(), e.preventDefault();
      var r = e.originalEvent.dataTransfer, o = +r.getData("text/plain");
      return t(this).parent().removeClass("over"), t(".icon24-trash").removeClass("icon24-trash-red"), 
      n(o), !1;
    }
  });
}), define("user", function(e) {
  "use strict";
  function t(e) {
    var t, i = s("#app-user-menu"), n = s("#app-user-name"), a = n.find("span"), r = i.find(".dropdown-wrapper"), o = r.find(".user-panel"), l = "/#" + c.printExtUserName(e.identities[0]);
    s("#app-browsing-identity").remove(), n.attr("href", l), a.text(e.name || e.nickname).removeClass("browsing-identity"), 
    t = h.compile(m.normal), o.length && o.remove(), e.profileLink = l, e.verifying = 1 === e.identities.length && "VERIFYING" === e.identities[0].status, 
    r.append(t(e)), delete e.profileLink, delete e.verifying;
  }
  function i(e) {
    var t, i = s("#app-user-menu"), n = s("#app-user-name"), a = n.find("span"), r = i.find(".dropdown-wrapper"), o = r.find(".user-panel"), l = e.browsing;
    e.browsing.isBrowsing = !0, s("#app-browsing-identity").remove(), s("#app-tmp").append(s('<div id="app-browsing-identity">').data("settings", e).attr("data-widget", "dialog").attr("data-dialog-type", "browsing_identity").attr("data-token-type", e.tokenType).attr("data-token", e.originToken).attr("data-page", e.page).attr("data-action", e.action).attr("data-read-only", e.readOnly)), 
    n.attr("href", location.href), a.html("Browsing as: <em>" + (l.name || l.nickname) + "</em>").addClass("browsing-identity"), 
    t = h.compile(m.browsing_identity), o.length && o.remove(), r.append(t(e)), s("#app-user-menu").find(".set-up").data("source", {
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
    var i = s(document.body), n = s("#app-menubar"), a = s("#app-main");
    t || a.empty(), i.toggleClass("hbg", e), n.toggleClass("hide", e);
  }
  function a(e) {
    e = !!e;
    var t = s("#app-user-menu"), i = s("#app-signin");
    t.toggleClass("hide", !e), i.toggleClass("hide", e);
  }
  function r(e) {
    var t = u.get("identities") || [], i = t.slice(0);
    0 === e.length ? t = e : o.each(e, function(e) {
      var n = o.find(i, function(t) {
        return t.id === e.id ? !0 : void 0;
      });
      n || t.push(e);
    }), u.set("identities", t);
  }
  var s = e("jquery"), o = e("rex"), l = e("api"), d = e("bus"), c = e("util"), u = e("store"), h = e("handlebars"), p = function(e, t, i, n) {
    f(e, t, function(a) {
      var l, h = u.get("last_external_username"), p = a.user;
      if (h && (l = o.find(p.identities, function(e) {
        var t = c.printExtUserName(e);
        return h === t ? !0 : void 0;
      })), l || (l = p.identities[0], u.set("last_external_username", c.printExtUserName(l))), 
      u.set("authorization", {
        token: e,
        user_id: t
      }), u.set("user", p), u.set("lastIdentity", l), r(p.identities), n = !s(".modal-su").size()) {
        var f = s("#forbidden"), m = s("#invite");
        if (f.size() || m.size()) return window.location.reload(), void 0;
        var g = s("#app-browsing-identity");
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
      for (var r = 0; a.length > r; r++) for (var s = 0; Exfee.invitations.length > s; s++) if (Exfee.invitations[s].rsvp_status === a[r]) {
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
      var t = $(e), i = t.offset(), n = {}, a = t.attr("id"), r = t.attr("provider"), s = t.attr("external_id"), o = t.attr("external_username");
      (a = ~~a) && (n.id = a), r && (n.provider = r), s && (n.external_id = s), o && (n.external_username = o);
      var l = this.getInvitationByIdentity(n);
      ExfeePanel.showTip(l, i.left, i.top + 50);
    },
    showPanel: function(e) {
      var t = $(e), i = t.offset(), n = {}, a = t.attr("id"), r = t.attr("provider"), s = t.attr("external_id"), o = t.attr("external_username");
      (a = ~~a) && (n.id = a), r && (n.provider = r), s && (n.external_id = s), o && (n.external_username = o);
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
      var r = function(e) {
        var t = RegExp("(" + i + ")");
        return e ? e.replace(t, '<span class="highlight">$1</span>') : "";
      }, s = $(".ids-popmenu > ol"), o = "";
      i = i ? i.toLowerCase() : "", ExfeeWidget.complete_key !== i && (ExfeeWidget.complete_exfee = [], 
      s.html("")), ExfeeWidget.complete_key = i;
      for (var l = 0; n.length > l; l++) {
        for (var d = !1, c = 0; ExfeeWidget.complete_exfee.length > c; c++) if (this.compareIdentity(ExfeeWidget.complete_exfee[c], n[l])) {
          d = !0;
          break;
        }
        if (!d) {
          var u = ExfeeWidget.complete_exfee.push(ExfeUtilities.clone(n[l])) - 1, h = n[l].provider;
          o += "<li" + (u ? "" : ' class="active"') + ">" + '<span class="pull-left avatar">' + '<img src="' + n[l].avatar_filename + '" alt="" width="40" height="40">' + '<span class="rb"><i class="icon16-identity-' + n[l].provider + '"></i></span>' + "</span>" + '<div class="identity">' + '<div class="name">' + r(n[l].name) + "</div>" + "<div>" + '<span class="oblique external">' + r(this.displayIdentity(n[l], !0)) + "</span>" + ("email" === h || "phone" === h ? "" : ' <span class="provider">@' + h.charAt(0).toUpperCase() + h.substr(1) + "</span>") + "</div>" + "</div>" + "</li>";
        }
      }
      s.append(o), this.displayCompletePanel(t, i && ExfeeWidget.complete_exfee.length);
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
        var i = e.val(), n = i.split(/,|;|\r|\n|\t/), a = [], r = [], s = "", o = "";
        if (ExfeeWidget.last_inputed[e[0].id] !== i || t) {
          ExfeeWidget.last_inputed[e[0].id] = i;
          for (var l = 0; n.length > l; l++) if (s = ExfeUtilities.trim(n[l])) {
            var d = ExfeeWidget.parseAttendeeInfo(s);
            d && (n.length - 1 > ~~l || t) && this.addExfee(d) ? a.push(d) : (r.push(n[l]), 
            o = n[l]);
          }
          var c = r.join("; ");
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
          var a = $(".ids-popmenu"), r = 352, s = 50, o = a.scrollTop();
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
          var d = n * s, c = d - o;
          0 > c ? a.scrollTop(d) : c + s > r && a.scrollTop(d + s - r + 1);
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
  }, r = function(e) {
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
      t(".cross-opts .saving").hide(), e ? window.location.href = "/" : Y.emit("app:cross:edited");
    }, function(e) {
      t(".cross-opts .saving").hide();
      var i = !e.meta || 401 !== e.meta.code && 403 !== e.meta.code ? "" : "no_permission";
      Y.emit("app:cross:edited", {
        error: i
      });
    }));
  }, s = function(e) {
    E(), r(e);
  }, o = function() {
    ExfeeCache.init(), ExfeeWidget.api_url = window._ENV_.api_url, window.GatherExfeeWidget = ExfeeWidget.make("gather-exfee", !0, s), 
    window.CrossExfeeWidget = ExfeeWidget.make("cross-exfee", !0, s);
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
        $ = e.post.updated_at, t(".cross-opts .saving").hide(), S(e.post), Y.emit("app:cross:edited");
      }, function(e) {
        t(".cross-opts .saving").hide();
        var i = !e.meta || 401 !== e.meta.code && 403 !== e.meta.code ? "" : "no_permission";
        Y.emit("app:cross:edited", {
          error: i
        });
      });
    }
  }, d = function() {
    t("#cross-form-discard").bind("click", function() {
      window.location = "/";
    }), t("#cross-form-gather").bind("click", function() {
      if (t("body").trigger("click"), curIdentity) t(this).hasClass("disabled") || (t(this).prop("disabled", !0).toggleClass("disabled", !0), 
      j()); else {
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
      var n = Editing, a = i ? i.target : null, r = {
        title: [ function() {
          t(".cross-title").removeAttr("editable"), t(".cross-title .show").show(), v(t(".cross-title .edit").val(), "cross"), 
          t(".cross-title .edit").hide(), B();
        }, function() {
          t(".cross-title").attr("editable", !0), t(".cross-title .show").hide(), t(".cross-title .edit").show().focus();
        } ],
        description: [ function() {
          t(".cross-description-outer").removeAttr("editable"), t(".cross-description .show").show(), 
          t(".cross-description .edit").hide(), y(t(".cross-description .edit").val()), B();
        }, function() {
          t(".cross-description-outer").attr("editable", !0), t(".cross-description .show").hide(), 
          t(".cross-description .xbtn-more").hide(), t(".cross-description .edit").show().focus();
        } ],
        time: [ function() {
          var e = t("#date-panel");
          if (e.size()) {
            var i = e.data("widget-id"), a = App.widgetCaches[i];
            t.trim(t("#date-string").data("date")), ("date-panel" === n || "time" === n) && B(), 
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
            ("map-panel" === n || "place" === n) && (Cross.place = a.place, B()), a && a.hide();
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
          N();
        }, function() {
          N(!0);
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
        var s = t(a).attr("editarea");
        switch (s) {
         case "rsvp":
         case "exfee":
          Editing = s;
        }
        if ("click" === i.type && (Editing || !Cross.id) || "dblclick" === i.type) for (Editing = s; a && !Editing && "BODY" !== a.tagName; ) a = a.parentNode, 
        Editing = t(a).attr("editarea"); else Editing = "";
      }
      if ("background" === Editing) r.background[1](), Editing = n; else {
        if ("map-panel" === Editing) return;
        if ("date-panel" === Editing) return;
        for (var o in r) r[o][~~(o === Editing)]();
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
      ExfeeWidget.rsvpMe("ACCEPTED"), N();
    }), t(".cross-rsvp .edit .decline").bind("click", function() {
      ExfeeWidget.rsvpMe("DECLINED"), N();
    }), t(".cross-rsvp .edit .interested").bind("click", function() {
      ExfeeWidget.rsvpMe("INTERESTED"), N();
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
    var e = new Date(), i = X.formatDate(e.getFullYear() + "-" + (e.getMonth() + 1) + "-" + e.getDate());
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
    Cross.title = ExfeUtilities.trim(e), b(t);
  }, y = function(e) {
    Cross.description = ExfeUtilities.trim(e), x();
  }, _ = function() {
    curIdentity && t(".choose-identity").html('<img src="' + curIdentity.avatar_filename + '">');
  }, b = function(e) {
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
  }, x = function() {
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
  }, w = function() {
    k(), I();
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
    ""), r = "", s = "Pick a time.", o = !1;
    if (Cross.time.origin) {
      var l = X.printEFTime(Cross.time, "X");
      a = l.content, r = l.title;
    } else a = s, r = "Sometime", o = !0;
    t(".cross-date h2").html(r), t(".cross-time").html(a).toggleClass("gray", o);
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
  }, $ = "", M = function(e, t) {
    i = e;
    for (var n = i.length - 1; n >= 0; n--) n || ($ = i[n].created_at), S(i[n], t);
  }, S = function(e, i) {
    var n = ExfeUtilities.escape(e.content).replace(/\r\n|\n\r|\r|\n/g, "\n"), a = '<div class="avatar-comment"><span class="pull-left avatar"><img alt="" src="' + e.by_identity.avatar_filename + '" width="40" height="40" />' + "</span>" + '<div class="comment">' + "<p>" + '<span class="author"><strong>' + e.by_identity.name + "</strong>:&nbsp;</span>" + ExfeUtilities.escape(e.content).replace(/\r\n|\n\r|\r|\n/g, "<br>") + '<span class="pull-right date">' + '<time data-iso-time="' + X.toISO(e.created_at) + '"></time>' + "</span>" + "</p>" + "</div>" + "</div>";
    t(".conversation-timeline").prepend(a), i && window.webkitNotifications && 0 === window.webkitNotifications.checkPermission() && window.webkitNotifications.createNotification(null, "EXFE - " + Cross.title, e.by_identity.name + ": " + n).show();
  }, I = function() {
    t("time[data-iso-time]").each(function() {
      var e = t(this);
      e.text(X(e.data("iso-time")));
    });
  }, N = function(e) {
    var i = ExfeeWidget.getMyInvitation();
    if (i) {
      var n = i.by_identity ? i.by_identity : curIdentity, a = i.identity.id === n.id;
      if ("NORESPONSE" === i.rsvp_status || "IGNORED" === i.rsvp_status || e) return a ? t(".cross-rsvp .edit .by").hide() : (t(".cross-rsvp .edit .by .avatar img").attr("src", i.by_identity.avatar_filename), 
      t(".cross-rsvp .edit .by strong").html(i.by_identity.name), t(".cross-rsvp .edit .by").show()), 
      t(".cross-rsvp .show").hide(), t(".cross-rsvp .edit").fadeIn(233), void 0;
      if ("ACCEPTED" === i.rsvp_status || "INTERESTED" === i.rsvp_status || "DECLINED" === i.rsvp_status) {
        var r = "";
        switch (i.rsvp_status) {
         case "ACCEPTED":
          r = "Accepted";
          break;

         case "DECLINED":
          r = "Unavailable";
          break;

         case "INTERESTED":
          r = "Interested";
        }
        a || "INTERESTED" === i.rsvp_status ? (t(".cross-rsvp .show .by").hide(), t(".cross-rsvp .show .by strong").html("")) : (t(".cross-rsvp .show .by .avatar img").attr("src", i.by_identity.avatar_filename), 
        t(".cross-rsvp .show .by strong").html(i.by_identity.name), t(".cross-rsvp .show .by").show());
        for (var s = ExfeeWidget.summary(), o = "", l = 0; Math.min(s.accepted_invitations.length, 5) > l; l++) o += '<li><span class="avatar alt40"><img height="20" width="20" alt="" src="' + s.accepted_invitations[l].identity.avatar_filename + '">' + (s.accepted_invitations[l].mates ? '<i class="icon10-plus-' + s.accepted_invitations[l].mates + '"></i>' : "") + "</span></li>";
        o += s.accepted ? "<li><span>" + s.accepted + " accepted.</span></li>" : "";
        var d = t(".cross-rsvp .show .accepted");
        return d.text() !== t(o).text() && d.html(o), t(".cross-rsvp .show .by").hide(), 
        t(".cross-rsvp .show .change").hide(), t(".cross-rsvp .show .attendance").html(r), 
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
  }, P = function() {
    b(), x(), C(Cross.place), E(), T(), N(), A(Cross.place);
  }, D = function(e) {
    var t = {
      resources: {
        exfee_id: Exfee.id
      }
    };
    $ && (t.params = {
      updated_at: $
    }), Api.request("conversation", t, function(t) {
      M(t.conversation, e);
    });
  }, z = function() {
    D(!0);
  }, O = function() {
    readOnly ? t("#conversation-form").hide() : (t("#conversation-form span.avatar img").attr("src", curIdentity.avatar_filename), 
    t("#conversation-form").show()), t(".conversation-timeline").html(""), t(".cross-conversation").slideDown(233), 
    D(), convTimer = setInterval(z, 233e3);
  }, L = function(e, i) {
    Cross.id = e.id, Cross.title = e.title, Cross.description = e.description, Cross.time = e.time, 
    Cross.place = e.place, Cross.widget = e.widget, Cross.exfee_id = e.exfee.id, Exfee = e.exfee, 
    readOnly = i, G = U(), void 0 === Cross.time || void 0 === Cross.time.begin_at || Cross.time.begin_at.timezone || (Cross.time.begin_at.timezone = ExfeUtilities.getTimezone()), 
    t(".cross-date  .edit").val(Cross.time.origin), t(".cross-place .edit").val(Cross.place.title + (Cross.place.description ? "\n" + Cross.place.description : ""));
    for (var n = 0; Exfee.invitations.length > n; n++) if (ExfeeWidget.isMyIdentity(Exfee.invitations[n].identity)) {
      curIdentity = ExfeUtilities.clone(Exfee.invitations[n].identity);
      break;
    }
    P(), O();
  }, H = function(e) {
    Api.request("getCross", {
      resources: {
        cross_id: e
      }
    }, function(e) {
      L(e.cross, !1);
    }, function() {
      Y.emit("app:cross:forbidden", e);
    });
  }, R = function() {
    window.Cross = ExfeUtilities.clone(n), window.Exfee = ExfeUtilities.clone(a);
  }, F = function() {
    readOnly = !1, R(), m(), p(), f(), g(), P(), W();
  }, j = function() {
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
  }, q = function() {
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
      t(".cross-opts .saving").hide(), Y.emit("app:cross:edited");
    }, function(e) {
      t(".cross-opts .saving").hide();
      var i = !e.meta || 401 !== e.meta.code && 403 !== e.meta.code ? "" : "no_permission";
      Y.emit("app:cross:edited", {
        error: i
      });
    });
  }, U = function() {
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
  }, B = function() {
    if (Cross.id) {
      var e = U();
      G !== e && (q(), G = e);
    }
  }, W = function(e) {
    e ? (t(".cross-form").slideUp(233), t(".cross-edit").show(233)) : (_(), t(".cross-form").slideDown(233), 
    t(".cross-edit").hide(233), t("#gather-title").select(), t("#gather-title").focus());
  };
  window.Store = e("store"), window.Api = e("api"), window.webkitNotifications && window.webkitNotifications.requestPermission(function() {});
  var X = e("humantime");
  window.curIdentity = null, window.readOnly = !1;
  var Y = e("bus"), G = "";
  Y.on("xapp:cross:main", function() {
    var t = Store.get("authorization");
    window.User = t ? Store.get("user") : null, User && (Api.setToken(t.token), curIdentity = ExfeUtilities.clone(User.identities[0])), 
    R(), o(), d(), c(), Editing = "", h(), Marked = e("marked"), window.ExfeePanel = e("exfeepanel"), 
    window.showtimeTimer = setInterval(w, 50), window.convTimer = null;
  }), Y.on("xapp:cross", function(i, n, a, r, s, o) {
    if (i > 0) {
      H(i);
      var l = new (e("photoxwidget"))({
        options: {
          crossId: i,
          parentNode: t(".cross-photox")
        }
      });
      l.show();
    } else null === i ? (n && (curIdentity = n, Api.setToken(s)), L(a, r), o && (ExfeeWidget.rsvpMe("ACCEPTED"), 
    N())) : F();
  }), Y.on("app:user:signin:after", function() {
    if (window.Cross && !window.Cross.id) {
      var e = Store.get("authorization");
      window.User = e ? Store.get("user") : null, User && (Api.setToken(e.token), curIdentity = ExfeUtilities.clone(User.identities[0]), 
      _(), g());
    }
  }), Y.on("xapp:cross:end", function() {
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
    var i, n, a, r, s;
    return a = 2147483648 & e, r = 2147483648 & t, i = 1073741824 & e, n = 1073741824 & t, 
    s = (1073741823 & e) + (1073741823 & t), i & n ? 2147483648 ^ s ^ a ^ r : i | n ? 1073741824 & s ? 3221225472 ^ s ^ a ^ r : 1073741824 ^ s ^ a ^ r : s ^ a ^ r;
  }
  function n(e, t, i) {
    return e & t | ~e & i;
  }
  function a(e, t, i) {
    return e & i | t & ~i;
  }
  function r(e, t, i) {
    return e ^ t ^ i;
  }
  function s(e, t, i) {
    return t ^ (e | ~i);
  }
  function o(e, a, r, s, o, l, d) {
    return e = i(e, i(i(n(a, r, s), o), d)), i(t(e, l), a);
  }
  function l(e, n, r, s, o, l, d) {
    return e = i(e, i(i(a(n, r, s), o), d)), i(t(e, l), n);
  }
  function d(e, n, a, s, o, l, d) {
    return e = i(e, i(i(r(n, a, s), o), d)), i(t(e, l), n);
  }
  function c(e, n, a, r, o, l, d) {
    return e = i(e, i(i(s(n, a, r), o), d)), i(t(e, l), n);
  }
  function u(e) {
    for (var t, i = e.length, n = i + 8, a = (n - n % 64) / 64, r = 16 * (a + 1), s = Array(r - 1), o = 0, l = 0; i > l; ) t = (l - l % 4) / 4, 
    o = 8 * (l % 4), s[t] = s[t] | e.charCodeAt(l) << o, l++;
    return t = (l - l % 4) / 4, o = 8 * (l % 4), s[t] = s[t] | 128 << o, s[r - 2] = i << 3, 
    s[r - 1] = i >>> 29, s;
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
  var f, m, g, v, y, _, b, x, w, k = [], C = 7, E = 12, T = 17, $ = 22, M = 5, S = 9, I = 14, N = 20, A = 4, P = 11, D = 16, z = 23, O = 6, L = 10, H = 15, R = 21;
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
  b = l(b, x, w, _, k[f + 12], N, 2368359562), _ = d(_, b, x, w, k[f + 5], A, 4294588738), 
  w = d(w, _, b, x, k[f + 8], P, 2272392833), x = d(x, w, _, b, k[f + 11], D, 1839030562), 
  b = d(b, x, w, _, k[f + 14], z, 4259657740), _ = d(_, b, x, w, k[f + 1], A, 2763975236), 
  w = d(w, _, b, x, k[f + 4], P, 1272893353), x = d(x, w, _, b, k[f + 7], D, 4139469664), 
  b = d(b, x, w, _, k[f + 10], z, 3200236656), _ = d(_, b, x, w, k[f + 13], A, 681279174), 
  w = d(w, _, b, x, k[f + 0], P, 3936430074), x = d(x, w, _, b, k[f + 3], D, 3572445317), 
  b = d(b, x, w, _, k[f + 6], z, 76029189), _ = d(_, b, x, w, k[f + 9], A, 3654602809), 
  w = d(w, _, b, x, k[f + 12], P, 3873151461), x = d(x, w, _, b, k[f + 15], D, 530742520), 
  b = d(b, x, w, _, k[f + 2], z, 3299628645), _ = c(_, b, x, w, k[f + 0], O, 4096336452), 
  w = c(w, _, b, x, k[f + 7], L, 1126891415), x = c(x, w, _, b, k[f + 14], H, 2878612391), 
  b = c(b, x, w, _, k[f + 5], R, 4237533241), _ = c(_, b, x, w, k[f + 12], O, 1700485571), 
  w = c(w, _, b, x, k[f + 3], L, 2399980690), x = c(x, w, _, b, k[f + 10], H, 4293915773), 
  b = c(b, x, w, _, k[f + 1], R, 2240044497), _ = c(_, b, x, w, k[f + 8], O, 1873313359), 
  w = c(w, _, b, x, k[f + 15], L, 4264355552), x = c(x, w, _, b, k[f + 6], H, 2734768916), 
  b = c(b, x, w, _, k[f + 13], R, 1309151649), _ = c(_, b, x, w, k[f + 4], O, 4149444226), 
  w = c(w, _, b, x, k[f + 11], L, 3174756917), x = c(x, w, _, b, k[f + 2], H, 718787259), 
  b = c(b, x, w, _, k[f + 9], R, 3951481745), _ = i(_, m), b = i(b, g), x = i(x, v), 
  w = i(w, y);
  var F = h(_) + h(b) + h(x) + h(w);
  return F.toLowerCase();
};

define("lightsaber", function(e, t, i) {
  "use strict";
  function n() {
    var e = new a();
    return g(e, _.prototype), e.request = new r(), e.response = new s(), e.init(), e;
  }
  function a() {}
  function r(e) {
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
    return b.get(t, function(t) {
      var r, s = t;
      "html" !== a && (r = e.compile(t), s = r(i)), n(s);
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
    return e instanceof RegExp ? e : ($(e) && (e = "(" + e.join("|") + ")"), e = e.concat(n ? "" : "/?").replace(/\/\(/g, "(?:/").replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function(e, i, n, a, r, s, o) {
      return t.push({
        name: a,
        optional: !!s
      }), i = i || "", "" + (s ? "" : i) + "(?:" + (s ? i : "") + (n || "") + (r || n && "([^/.]+?)" || "([^/]+?)") + ")" + (s || "") + (o ? "(/*)?" : "");
    }).replace(/([\/.])/g, "\\$1").replace(/\*/g, "(.*)"), RegExp("^" + e + "$", i ? "" : "i"));
  }
  var y, _ = e("emitter"), b = e("jquery") || e("zepto"), x = b.proxy, w = window.location, k = window.history, C = "/", E = !1;
  b(window).on("load", function() {
    E = !0, setTimeout(function() {
      E = !1;
    }, 0);
  }), t = i.exports = n;
  var T;
  t.version = "0.0.5", T = a.prototype, T.historySupport = y = null !== (null !== k ? k.pushState : void 0), 
  b.browser && b.browser.opera && (T.historySupport = y = !1), T.init = function() {
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
    var n, a = {}, r = this.cache;
    if (this.engine, "function" == typeof t && (i = t, t = {}), g(a, this.locals), t.locals && g(a, t.locals), 
    g(a, t), a.cache = null === a.cache ? this.enabled("view cache") : a.cache, a.cache && (n = r[e]), 
    !n) {
      if (n = new d(e, {
        engine: this.set("view engine"),
        root: this.set("views")
      }, this.set("timestamp")), !n.path) {
        var s = Error('Failed to lookup view "' + e + '"');
        return s.view = n, i(s);
      }
      a.cache && (r[e] = n);
    }
    try {
      n.render(a, i);
    } catch (s) {
      i(s);
    }
  }, T.path = function() {
    return this.route;
  }, T.param = function(e, t) {
    var i, n = [].slice.call(arguments, 1), a = 0;
    if ($(e)) for (i = e.length; i > a; ++a) for (var r = 0, s = n.length; s > r; ++r) this.param(e[a], n[r]); else if ("function" == typeof e) this._router.param(e); else for (":" === e[0] && (e = e.substr(1)), 
    i = n.length; i > a; ++a) this._router.param(e, t);
    return this;
  }, T.initRouter = function() {
    this._usedRouter === !1 && (this._usedRouter = !0, this.use(this._router.middleware));
  }, T.get = function() {
    var e = [].slice.call(arguments);
    return this.initRouter(), this._router.route.apply(this._router, e);
  }, T.handle = function(e, t) {
    function i(o) {
      var l, d = n[s++];
      if (r && (e.url = e.url.substr(1), r = !1), e.url = a + e.url, d) try {
        if (l = e.url, 0 !== l.indexOf(d.route)) return i(o);
        var c = d.handle.length;
        a = d.route, e.url = e.url.substr(a.length), "/" !== e.url[0] && (e.url = "/" + e.url, 
        r = !0), o ? 4 === c ? d.handle(o, e, t, i) : i(o) : 4 > c ? d.handle(e, t, i) : i();
      } catch (u) {
        i(u);
      }
    }
    var n = this.stack, a = "", r = !1, s = 0;
    i();
  }, T.run = function(e) {
    this.emit("launch"), e = e || {};
    var t = this.request, i = this.response;
    this.running || (this.running = !0, !1 === e.dispatch && this.disable("dispatch"), 
    !1 !== e.popstate && (this.historySupport ? b(window).on("popstate", x(this.change, this)) : b(window).on("hashchange", x(this.change, this))), 
    this.disabled("dispatch") || (this.handle(t, i), this.emit("launched")));
  }, T.change = function(e) {
    if (E) return E = !1;
    var t = this, i = t.request, n = t.response, a = i.url;
    return i.updateUrl(), "/" === a || a !== i.url ? (t.handle(i, n), e.stopPropagation(), 
    e.preventDefault(), !1) : void 0;
  }, T.error = function(e, t) {
    var i = Error(t);
    return i.status = e, i;
  }, T = r.prototype, T.updateUrl = function() {
    this.host = w.hostname, this.port = w.port || 80, this.fullpath = w.pathname, this.enableFullUrlPath && (this.path = this.fullpath), 
    this.hash = decodeURIComponent(w.hash), this.querystring = decodeURIComponent(w.search), 
    this.url = this.path + this.querystring + this.hash;
  }, T.param = function(e, t) {
    var i = this.params || {}, n = this.query || {};
    return null != i[e] && i.hasOwnProperty(e) ? i[e] : null != n[e] ? n[e] : t;
  }, T.getPath = function() {
    return this.path;
  }, T.getHost = function() {
    return this.host;
  }, T = s.prototype, T.location = function(e) {
    window.setTimeout(function() {
      w.href = e;
    }, 16);
  }, T.redirect = function(e) {
    var t, i;
    return arguments.length, e = arguments[0], "back" === e || "forward" === e ? (k[e](), 
    void 0) : y ? (t = arguments[1], i = arguments[2] || {}, this.path = e, this.title = t || "EXFE.COM", 
    document.title = this.title, this.state = i, this.state.id = u(), this.pushState(), 
    b(window).triggerHandler("popstate"), void 0) : (this.location(e), void 0);
  }, T.save = function() {
    k.replaceState(this.state, this.title, this.path);
  }, T.pushState = function() {
    k.pushState(this.state, this.title, this.path);
  }, T.render = function(e, t, i) {
    var n = this, t = t || {}, a = this.app;
    "function" == typeof t && (i = t, t = {}), t.locals = n.locals, a.render(e, t, i);
  }, T = o.prototype, T.param = function(e, t) {
    if ("function" == typeof e) return this._params.push(e), void 0;
    var i, n, a = this._params, r = a.length;
    for (n = 0; r > n; ++n) (i = a[n](e, t)) && (t = i);
    if ("function" != typeof t) throw Error("invalid param() call for " + e + ", got " + t);
    return (this.params[e] = this.params[e] || []).push(t), this;
  }, T._dispatch = function(e, t, i) {
    var n = this.params, a = this;
    (function r(s, o) {
      function l(t) {
        r(e._route_index + 1, t);
      }
      function d(t) {
        v = 0, g = m[s++], p = g && e.params[g.name], h = g && n[g.name];
        try {
          "route" === t ? l() : t ? (s = 0, u(t)) : h && void 0 !== p ? c() : g ? d() : (s = 0, 
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
      return e.route = f = a.matchRequest(e, s), f ? (e.params = f.params, m = f.keys, 
      s = 0, d(o), void 0) : i(o);
    })(0);
  }, T.matchRequest = function(e, t) {
    var i, n = e.url, a = this.map, r = a.length;
    for (t = t || 0; r > t; ++t) if (i = a[t], i.match(n)) return e._route_index = t, 
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
    var t, i, n, a, r = this.keys, s = this.params = [], o = this.regexp.exec(e);
    if (!o) return !1;
    for (t = 1, i = o.length; i > t; ++t) n = r[t - 1], a = "string" == typeof o[t] ? decodeURIComponent(o[t]) : o[t], 
    n ? s[n.name] = a : s.push(a);
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
  var a = e("bus"), r = e("store"), s = e("jquery"), o = i.exports = {};
  o.basicAuth = function(e, t, i) {
    var a = e.session, s = r.get("authorization"), o = r.get("user"), l = n();
    s && (!l || l && !l.authorization) ? (a.authorization = s, a.user = o) : !s && l && l.authorization && l.data && !l.event ? (r.set("oauth", a.oauth = {
      identity: l.data.identity,
      following: "twitter" === l.data.identity.provider ? !!l.data.twitter_following : !1,
      identity_status: l.data.identity_status
    }), delete a.user, r.remove("user"), r.set("authorization", a.authorization = l.authorization)) : s && l && l.authorization && l.data && !l.event && (s.user_id === l.authorization.user_id && s.token !== l.authorization.token ? (s.token = l.authorization.token, 
    r.set("authorization", a.authorization = s)) : s.user_id !== l.authorization.user_id && s.token !== l.authorization.token && l.identity && (r.set("oauth", a.oauth = {
      identity: l.data.identity,
      following: "twitter" === l.data.identity.provider ? !!l.data.twitter_following : !1,
      identity_status: l.data.identity_status
    }), delete a.user, r.remove("user"), r.set("authorization", a.authorization = l.authorization))), 
    l && (l.event && (a.event = JSON.parse(l.event), a.event.data = l.data), l.verification_token && (a.verification_token = l.verification_token), 
    l.refere && l.refere !== window.location.protocol + "//" + window.location.hostname + "/" && t.redirect(l.refere || "/")), 
    i();
  }, o.errorHandler = function(e, t) {
    var i = /^\/404/;
    if (i.exec(window.location.pathname)) {
      a.emit("app:page:home", !1, !0);
      var n = r.get("authorization");
      if (a.emit("app:page:usermenu", !!n), n) {
        var s = r.get("user");
        a.emit("app:usermenu:updatenormal", s), a.emit("app:usermenu:crosslist", n.token, n.user_id);
      }
    } else t.location("/404");
  }, o.cleanupAppTmp = function(e, t, i) {
    var n = s("#app-tmp"), a = n.find("[data-widget-id]");
    a.trigger("destory.widget"), i();
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
    var n = e.session, a = l.get("user");
    if (a) return i(a, t), void 0;
    var r = n.authorization;
    s.emit("app:user:signin", r.token, r.user_id, !0);
  }
  var a = e("rex"), r = e("api"), s = e("bus"), o = e("util"), l = e("store");
  e("user");
  var d = i.exports = {};
  d.index = function(e, t) {
    return e.session.authorization ? (n(e, t), void 0) : (s.emit("app:page:home", !0), 
    t.render("index.html", function(t) {
      var i = $("#app-main");
      i.append(t);
      var n = i.find("div.page-main"), a = $('<img class="exfe-toy" id="js-exfe-toy" src="/static/img/exfe.png" alt="" />');
      n.append(a), a.load(function() {
        $.ajax({
          dataType: "script",
          cache: !0,
          url: "/static/js/home/0.0.3/home.js?t=" + e.app.set("timestamp")
        });
      });
    }), void 0);
  }, d.gather = function(e, t) {
    var i = e.session;
    if (s.emit("app:page:home", !1), !i.initMenuBar) {
      var n = i.authorization, a = i.user;
      s.emit("app:page:usermenu", !!n), n && (i.initMenuBar = !0, s.emit("app:usermenu:updatenormal", a), 
      s.emit("app:usermenu:crosslist", n.token, n.user_id));
    }
    t.render("x.html", function(e) {
      $("#app-main").append(e), s.emit("xapp:cross:main"), s.emit("xapp:cross", 0);
    });
  }, d.resolveToken = function(e, t, i) {
    e.origin = "resolveToken";
    var n = e.params[0];
    s.emit("app:page:home", !1), s.emit("app:page:usermenu", !0), n ? i() : t.redirect("/#invalid/token=" + n);
  }, d.inspectResolveToken = function(e, t, i, n, a) {
    var r = e.session, d = r.user, c = r.authorization;
    r.resolveData = n;
    var u, h = n.token, p = n.user_id, f = n.user_name, m = null, g = n.token_type, v = n.action;
    !m && (c && c.user_id === p || !c && "VERIFY" === g && "VERIFIED" === v) ? (c = {
      token: h,
      user_id: p
    }, l.set("authorization", r.authorization = c), r.auto_sign = "INPUT_NEW_PASSWORD" !== v) : r.browsing_authorization = u = n, 
    s.emit("app:api:getuser", h, p, function(e) {
      var t = e.user;
      if (r.resolveData.setup = "INPUT_NEW_PASSWORD" === v && "VERIFY" === g && t.password === !1, 
      u) {
        r.browsing_user = t;
        var n, h = o.printExtUserName(t.identities[0]);
        n = c ? "/#" + h + "/token=" + a : "/#" + h, s.emit("app:usermenu:updatebrowsing", {
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
      } else l.set("user", d = r.user = e.user), s.emit("app:usermenu:updatenormal", d), 
      s.emit("app:usermenu:crosslist", c.token, c.user_id);
      i();
    });
  }, d.resolveRequest = function(e, t, i) {
    var n = e.session, a = e.params[0];
    n.originToken = a, r.request("resolveToken", {
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
    var i = e.session, n = i.auto_sign, r = i.originToken, o = i.user, l = i.authorization, d = i.browsing_authorization, c = i.browsing_user, u = i.resolveData, h = u.identity_id, p = u.token_type, f = null, m = u.action, g = "identity_verified.html";
    if (f) return t.render(g, function(e) {
      var t = $("#app-main");
      t.append(e);
      var i = $('<div id="js-dialog-merge" data-destory="true" data-widget="dialog" data-dialog-type="mergeidentity">');
      i.data("source", {
        merged_identity: a.find(c.identities, function(e) {
          return e.id === h ? !0 : void 0;
        }),
        browsing_token: r,
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
            originToken: r,
            user_name: u.user_name,
            tokenType: "user"
          })) : "SET_PASSWORD" === p && (v = $('<div class="setpassword" data-destory="true" data-widget="dialog" data-dialog-type="setpassword">'), 
          v.data("source", {
            user: o,
            token: u.setup ? l.token : r,
            setup: u.setup
          })), v.appendTo($("#app-tmp")), v.trigger("click.dialog.data-api");
        } else "VERIFY" === p ? (s.once("app:user:signin:after", function() {
          var e = $('<div class="addidentity" data-destory="true" data-widget="dialog" data-dialog-type="addIdentityAfterSignIn">');
          e.data("source", {
            identity: c.identities[0]
          }), e.appendTo($("#app-tmp")), e.trigger("click.dialog.data-api");
        }), $("#app-user-menu").find(".set-up").trigger("click.dialog.data-api")) : (v = $('<div class="setpassword" data-destory="true" data-widget="dialog" data-dialog-type="setpassword">'), 
        v.data("source", {
          user: c,
          token: u.setup ? d.token : r,
          setup: u.setup
        }), v.appendTo($("#app-tmp")), v.trigger("click.dialog.data-api"));
        $(".modal-su, .modal-sp, .modal-bi").css("top", 230);
      });
    }
    delete i.browsing_authorization, delete i.resolveData, delete i.originToken;
  }, d.cross = function(e, t) {
    var i = e.session, n = i.authorization, a = i.user;
    if (!n) return s.emit("app:page:home", !1), s.emit("app:page:usermenu", !1), s.emit("app:cross:forbidden", e.params[0], null), 
    void 0;
    s.emit("app:page:home", !1), s.emit("app:page:usermenu", !0), i.initMenuBar || (s.emit("app:usermenu:updatenormal", a), 
    s.emit("app:usermenu:crosslist", n.token, n.user_id));
    var r = e.params[0];
    t.render("x.html", function(e) {
      $("#app-main").append(e), s.emit("xapp:cross:main"), s.emit("xapp:cross", r);
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
  }), d.crossInvitation = function(e, t) {
    var i = e.session, n = i.authorization, l = i.user, d = l && l.id, c = e.params[0], u = e.params[1];
    s.emit("app:page:home", !1), s.emit("app:page:usermenu", !!n), n && (s.emit("app:usermenu:updatenormal", l), 
    s.emit("app:usermenu:crosslist", n.token, n.user_id)), r.request("getInvitationByToken", {
      type: "POST",
      resources: {
        cross_id: c
      },
      data: {
        token: u
      }
    }, function(e) {
      var i, r = e.invitation, u = r.identity, h = r.by_identity;
      return d && (i = a.find(l.identities, function(e) {
        return e.connected_user_id === u.connected_user_id && e.id === u.id ? !0 : void 0;
      })) ? (t.redirect("/#!" + c), void 0) : "email" === u.provider ? (s.emit("app:cross:forbidden", c, u), 
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
  var c = function(e, t, i, n, a, o, d, c, u, h) {
    var p = t.session, f = p.authorization, m = p.user;
    r.request("getCrossByInvitationToken", {
      type: "POST",
      params: n,
      data: a
    }, function(t) {
      function i() {
        e.render("x.html", function(e) {
          if ($("#app-main").empty().append(e), s.emit("xapp:cross:main"), s.emit("xapp:cross", null, a, f, v, d, !!u), 
          h) {
            var t = $('<div id="js-dialog-unsubscribe" data-destory="true" data-widget="dialog" data-dialog-type="unsubscribe">');
            t.data("source", f), t.appendTo($("#app-tmp")), t.trigger("click.dialog.data-api");
          }
        });
      }
      var n = t.authorization, a = t.browsing_identity, r = t.action, f = t.cross, g = t.cross_access_token, v = t.read_only;
      if (!1 === v && g && (o || (o = {}), o[c] = g, l.set("cats", o)), s.emit("app:page:home", !1), 
      s.emit("app:page:usermenu", !0), n || !a) {
        if (!p.initMenuBar) {
          if (n) return s.once("app:user:signin:after", function() {
            e.redirect("/#!" + f.id);
          }), s.emit("app:user:signin", n.token, n.user_id), void 0;
          e.redirect("/#!" + f.id);
        }
      } else a && s.emit("app:usermenu:updatebrowsing", {
        normal: m,
        browsing: {
          identities: [ a ],
          name: a.name
        },
        action: r,
        setup: "setup" === r,
        originToken: c,
        tokenType: "cross",
        page: "cross",
        readOnly: v
      }, "browsing_identity");
      i();
    }, function(t) {
      var i = t && t.meta && t.meta.code, n = !!f;
      403 === i ? (s.emit("app:page:home", !1), s.emit("app:page:usermenu", n), n && (s.emit("app:usermenu:updatenormal", m), 
      s.emit("app:usermenu:crosslist", f.token, f.user_id)), s.emit("app:cross:forbidden", null, null)) : 404 === i && e.location("/404");
    });
  };
  d.crossToken = function(e, t, i) {
    var n, a, r = e.session, s = r.authorization, o = s && s.token, d = e.params[0], u = e.params[1], h = "accept" === u, p = "mute" === u, f = l.get("cats"), m = {};
    o && (m.token = o), f && (n = f[d]), a = {
      invitation_token: d
    }, n && (a.cross_access_token = n), c(t, e, i, m, a, f, n, d, h, p);
  }, d.crossPhoneToken = function(e, t, i) {
    var n, a, r = e.session, s = r.authorization, o = s && s.token, d = e.params[0], u = e.params[1], h = e.params[2], p = "accept" === h, f = "mute" === h, m = l.get("cats"), g = {};
    o && (g.token = o), m && (n = m[u]), a = {
      invitation_token: u,
      cross_id: d
    }, n && (a.cross_access_token = n), c(t, e, i, g, a, m, n, u, p, f);
  }, d.profile = function(e, t) {
    var i = e.session, n = i.authorization, a = i.user, r = i.browsing_authorization, d = i.browsing_user, c = i.action, u = i.oauth;
    s.emit("app:page:home", !1);
    var h = e.params[2], p = h && h.match(o.tokenRegExp), f = p && p[1];
    return f && !r ? (t.redirect("/#token=" + f), void 0) : (n || r ? (document.title = "EXFE - Profile", 
    s.emit("app:page:usermenu", !0), n && !r ? (s.emit("app:usermenu:updatenormal", a), 
    s.emit("app:usermenu:crosslist", n.token, n.user_id), t.render("profile.html", function(e) {
      $("#app-main").data("event", i.event), delete i.event, $("#app-main").append(e), 
      s.emit("app:profile:identities", a);
      var t = $.Deferred(), r = $.Event("click.dialog.data-api");
      t.resolve(n), s.emit("app:profile:show", t), u ? ("connected" !== u.identity_status && (r.following = u.following, 
      r.identity = u.identity, r.token = n.token, $('<div id="app-oauth-welcome" class="hide" data-widget="dialog" data-dialog-type="welcome" data-destory="true"></div>').appendTo($("#app-tmp")).trigger(r)), 
      l.remove("oauth"), delete i.oauth) : i.verification_token && ($('<div id="app-oauth-resetpassword" class="hide" data-widget="dialog" data-dialog-type="setpassword" data-destory="true"></div>').data("token", i.verification_token).appendTo($("#app-tmp")).trigger(r), 
      delete i.verification_token);
    })) : r ? ($(document.body).attr("data-browsing"), s.emit("app:usermenu:updatebrowsing", {
      normal: a,
      browsing: d,
      action: c,
      setup: "INPUT_NEW_PASSWORD" === c,
      originToken: i.originToken,
      tokenType: "user",
      page: "profile"
    }, "browsing_identity"), delete i.originToken, t.render("profile.html", function(e) {
      $("#app-main").append(e), s.emit("app:profile:identities", d);
      var t = $.Deferred();
      t.resolve(r), s.emit("app:profile:show", t);
    })) : t.redirect("/")) : t.redirect("/"), void 0);
  }, d.invalid = function(e, t) {
    var i = e.session, n = i.authorization, a = i.user;
    document.title = "EXFE - Invalid Link", s.emit("app:page:home", !1), n ? (s.emit("app:page:usermenu", !0), 
    s.emit("app:usermenu:updatenormal", a), s.emit("app:usermenu:crosslist", n.token, n.user_id)) : s.emit("app:page:usermenu", !1), 
    t.render("invalid.html", function(e) {
      $("#app-main").append(e);
    });
  }, d.signout = function() {
    l.remove("cats"), l.remove("user"), l.remove("authorization"), window.location.href = "/";
  }, d.refreshAuthUser = function(e, t, i) {
    var n = e.session, a = n.authorization;
    return a ? (s.emit("app:api:getuser", a.token, a.user_id, function(e) {
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
  var t = window._ENV_, i = e("handlebars"), n = e("middleware"), a = e("routes"), r = e("lightsaber"), s = r(), o = e("widget");
  s.widgetCaches = o.caches, s.use(n.fixedFaceBookURL), s.use(n.basicAuth), s.use(n.cleanupAppTmp), 
  s.initRouter(), s.use(n.errorHandler), s.set("timestamp", t.timestamp), s.set("view cache", !0), 
  s.set("view engine", i), s.set("views", "/static/views"), s.get(/^\/+(?:\?)?(?:ipad)?#{0,}$/, a.index), 
  s.get(/^\?t=([a-zA-Z0-9]{3,})$/, function(e, t, i) {
    var n = function() {
      var e = document.getElementsByTagName("head")[0], t = document.getElementsByName("sms-token")[0], i = null;
      return t && (i = JSON.parse(t.content), e.removeChild(t)), i;
    }, r = n(), s = e.params[0];
    r ? a.inspectResolveToken(e, t, i, r, s) : t.redirect("/#invalid/token=" + s);
  }, a.resolveShow), s.get(/^\/+(?:\?)?(?:ipad)?#gather\/?$/, a.refreshAuthUser, a.gather), 
  s.get(/^\/+(?:\?)?(?:ipad)?#token=([a-zA-Z0-9]{64})\/?$/, a.resolveToken, a.resolveRequest, a.resolveShow), 
  s.get(/^\/+(?:\?)?(?:ipad)?#!([1-9][0-9]*)\/?$/, a.refreshAuthUser, a.cross), s.get(/^\/+(?:\?)?(?:ipad)?#!([1-9][0-9]*)\/([a-zA-Z0-9]{3})\/?$/, a.refreshAuthUser, a.crossInvitation), 
  s.get(/^\/+(?:\?)?(?:ipad)?#!([1-9][0-9]*)\/([a-zA-Z0-9]{4})(?:\/(accept|mute))?\/?$/, a.refreshAuthUser, a.crossPhoneToken), 
  s.get(/^\/+(?:\?)?(?:ipad)?#!token=([a-zA-Z0-9]{32})\/?$/, a.refreshAuthUser, a.crossToken), 
  s.get(/^\/+(?:\?)?(?:ipad)?#!token=([a-zA-Z0-9]{32})\/(accept|mute)\/?$/, a.refreshAuthUser, a.crossToken), 
  s.get(/^\/+(?:\?)?(?:ipad)?#([^@\/\s\!=]+)?@([^@\/\s]+)(?:\/?(.*))\/?$/, a.refreshAuthUser, a.profile), 
  s.get(/^\/+(?:\?)?(?:ipad)?#(\+)(1\d{10}|86\d{11})(?:\/?(.*))\/?$/, a.refreshAuthUser, a.profile), 
  s.get(/^\/+(?:\?)?(?:ipad)?#invalid\/token=([a-zA-Z0-9]{64})\/?$/, a.invalid), s.get(/^\/+(?:\?)?(?:ipad)?#signout\/?$/, a.signout), 
  s.run(), window.App = s;
});