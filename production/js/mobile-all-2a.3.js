/*! EXFE.COM QXdlc29tZSEgV2UncmUgaHVudGluZyB0YWxlbnRzIGxpa2UgeW91LiBQbGVhc2UgZHJvcCB1cyB5b3VyIENWIHRvIHdvcmtAZXhmZS5jb20uCg== */
<<<<<<< HEAD
/*! mobile@2a.3 2013-05-26 10:05:27 */
(function(t) {
=======
/*! mobile@2a.3 2013-05-26 10:05:26 */
(function(e) {
>>>>>>> 6a96ad7... update files
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
});

var Zepto = function() {
  function e(e) {
    return null == e ? e + "" : V[G.call(e)] || "object";
  }
  function t(t) {
    return "function" == e(t);
  }
  function i(e) {
    return null != e && e == e.window;
  }
  function n(e) {
    return null != e && e.nodeType == e.DOCUMENT_NODE;
  }
  function r(t) {
    return "object" == e(t);
  }
  function a(e) {
    return r(e) && !i(e) && e.__proto__ == Object.prototype;
  }
  function s(e) {
    return e instanceof Array;
  }
  function o(e) {
    return "number" == typeof e.length;
  }
  function l(e) {
    return I.call(e, function(e) {
      return null != e;
    });
  }
  function c(e) {
    return e.length > 0 ? C.fn.concat.apply([], e) : e;
  }
  function d(e) {
    return e.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase();
  }
  function u(e) {
    return e in P ? P[e] : P[e] = RegExp("(^|\\s)" + e + "(\\s|$)");
  }
  function h(e, t) {
    return "number" != typeof t || O[d(e)] ? t : t + "px";
  }
  function p(e) {
    var t, i;
    return A[e] || (t = N.createElement(e), N.body.appendChild(t), i = D(t, "").getPropertyValue("display"), 
    t.parentNode.removeChild(t), "none" == i && (i = "block"), A[e] = i), A[e];
  }
  function f(e) {
    return "children" in e ? M.call(e.children) : C.map(e.childNodes, function(e) {
      return 1 == e.nodeType ? e : w;
    });
  }
  function m(e, t, i) {
    for (k in t) i && (a(t[k]) || s(t[k])) ? (a(t[k]) && !a(e[k]) && (e[k] = {}), s(t[k]) && !s(e[k]) && (e[k] = []), 
    m(e[k], t[k], i)) : t[k] !== w && (e[k] = t[k]);
  }
  function g(e, t) {
    return t === w ? C(e) : C(e).filter(t);
  }
  function v(e, i, n, r) {
    return t(i) ? i.call(e, n, r) : i;
  }
  function y(e, t, i) {
    null == i ? e.removeAttribute(t) : e.setAttribute(t, i);
  }
  function _(e, t) {
    var i = e.className, n = i && i.baseVal !== w;
    return t === w ? n ? i.baseVal : i : (n ? i.baseVal = t : e.className = t, w);
  }
  function b(e) {
    var t;
    try {
      return e ? "true" == e || ("false" == e ? !1 : "null" == e ? null : isNaN(t = Number(e)) ? /^[\[\{]/.test(e) ? C.parseJSON(e) : e : t) : e;
    } catch (i) {
      return e;
    }
  }
  function x(e, t) {
    t(e);
    for (var i in e.childNodes) x(e.childNodes[i], t);
  }
  var w, k, C, E, T, $, S = [], M = S.slice, I = S.filter, N = window.document, A = {}, P = {}, D = N.defaultView.getComputedStyle, O = {
    "column-count": 1,
    columns: 1,
    "font-weight": 1,
    "line-height": 1,
    opacity: 1,
    "z-index": 1,
    zoom: 1
  }, z = /^\s*<(\w+|!)[^>]*>/, L = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, H = /^(?:body|html)$/i, R = [ "val", "css", "html", "text", "data", "width", "height", "offset" ], j = [ "after", "prepend", "before", "append" ], F = N.createElement("table"), q = N.createElement("tr"), B = {
    tr: N.createElement("tbody"),
    tbody: F,
    thead: F,
    tfoot: F,
    td: q,
    th: q,
    "*": N.createElement("div")
  }, U = /complete|loaded|interactive/, W = /^\.([\w-]+)$/, X = /^#([\w-]*)$/, Y = /^[\w-]+$/, V = {}, G = V.toString, K = {}, Z = N.createElement("div");
  return K.matches = function(e, t) {
    if (!e || 1 !== e.nodeType) return !1;
    var i = e.webkitMatchesSelector || e.mozMatchesSelector || e.oMatchesSelector || e.matchesSelector;
    if (i) return i.call(e, t);
    var n, r = e.parentNode, a = !r;
    return a && (r = Z).appendChild(e), n = ~K.qsa(r, t).indexOf(e), a && Z.removeChild(e), 
    n;
  }, T = function(e) {
    return e.replace(/-+(.)?/g, function(e, t) {
      return t ? t.toUpperCase() : "";
    });
  }, $ = function(e) {
    return I.call(e, function(t, i) {
      return e.indexOf(t) == i;
    });
  }, K.fragment = function(e, t, i) {
    e.replace && (e = e.replace(L, "<$1></$2>")), t === w && (t = z.test(e) && RegExp.$1), 
    t in B || (t = "*");
    var n, r, s = B[t];
    return s.innerHTML = "" + e, r = C.each(M.call(s.childNodes), function() {
      s.removeChild(this);
    }), a(i) && (n = C(r), C.each(i, function(e, t) {
      R.indexOf(e) > -1 ? n[e](t) : n.attr(e, t);
    })), r;
  }, K.Z = function(e, t) {
    return e = e || [], e.__proto__ = C.fn, e.selector = t || "", e;
  }, K.isZ = function(e) {
    return e instanceof K.Z;
  }, K.init = function(e, i) {
    if (e) {
      if (t(e)) return C(N).ready(e);
      if (K.isZ(e)) return e;
      var n;
      if (s(e)) n = l(e); else if (r(e)) n = [ a(e) ? C.extend({}, e) : e ], e = null; else if (z.test(e)) n = K.fragment(e.trim(), RegExp.$1, i), 
      e = null; else {
        if (i !== w) return C(i).find(e);
        n = K.qsa(N, e);
      }
      return K.Z(n, e);
    }
    return K.Z();
  }, C = function(e, t) {
    return K.init(e, t);
  }, C.extend = function(e) {
    var t, i = M.call(arguments, 1);
    return "boolean" == typeof e && (t = e, e = i.shift()), i.forEach(function(i) {
      m(e, i, t);
    }), e;
  }, K.qsa = function(e, t) {
    var i;
    return n(e) && X.test(t) ? (i = e.getElementById(RegExp.$1)) ? [ i ] : [] : 1 !== e.nodeType && 9 !== e.nodeType ? [] : M.call(W.test(t) ? e.getElementsByClassName(RegExp.$1) : Y.test(t) ? e.getElementsByTagName(t) : e.querySelectorAll(t));
  }, C.contains = function(e, t) {
    return e !== t && e.contains(t);
  }, C.type = e, C.isFunction = t, C.isWindow = i, C.isArray = s, C.isPlainObject = a, 
  C.isEmptyObject = function(e) {
    var t;
    for (t in e) return !1;
    return !0;
  }, C.inArray = function(e, t, i) {
    return S.indexOf.call(t, e, i);
  }, C.camelCase = T, C.trim = function(e) {
    return e.trim();
  }, C.uuid = 0, C.support = {}, C.expr = {}, C.map = function(e, t) {
    var i, n, r, a = [];
    if (o(e)) for (n = 0; e.length > n; n++) i = t(e[n], n), null != i && a.push(i); else for (r in e) i = t(e[r], r), 
    null != i && a.push(i);
    return c(a);
  }, C.each = function(e, t) {
    var i, n;
    if (o(e)) {
      for (i = 0; e.length > i; i++) if (t.call(e[i], i, e[i]) === !1) return e;
    } else for (n in e) if (t.call(e[n], n, e[n]) === !1) return e;
    return e;
  }, C.grep = function(e, t) {
    return I.call(e, t);
  }, window.JSON && (C.parseJSON = JSON.parse), C.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(e, t) {
    V["[object " + t + "]"] = t.toLowerCase();
  }), C.fn = {
    forEach: S.forEach,
    reduce: S.reduce,
    push: S.push,
    sort: S.sort,
    indexOf: S.indexOf,
    concat: S.concat,
    map: function(e) {
      return C(C.map(this, function(t, i) {
        return e.call(t, i, t);
      }));
    },
    slice: function() {
      return C(M.apply(this, arguments));
    },
    ready: function(e) {
      return U.test(N.readyState) ? e(C) : N.addEventListener("DOMContentLoaded", function() {
        e(C);
      }, !1), this;
    },
    get: function(e) {
      return e === w ? M.call(this) : this[e >= 0 ? e : e + this.length];
    },
    toArray: function() {
      return this.get();
    },
    size: function() {
      return this.length;
    },
    remove: function() {
      return this.each(function() {
        null != this.parentNode && this.parentNode.removeChild(this);
      });
    },
    each: function(e) {
      return S.every.call(this, function(t, i) {
        return e.call(t, i, t) !== !1;
      }), this;
    },
    filter: function(e) {
      return t(e) ? this.not(this.not(e)) : C(I.call(this, function(t) {
        return K.matches(t, e);
      }));
    },
    add: function(e, t) {
      return C($(this.concat(C(e, t))));
    },
    is: function(e) {
      return this.length > 0 && K.matches(this[0], e);
    },
    not: function(e) {
      var i = [];
      if (t(e) && e.call !== w) this.each(function(t) {
        e.call(this, t) || i.push(this);
      }); else {
        var n = "string" == typeof e ? this.filter(e) : o(e) && t(e.item) ? M.call(e) : C(e);
        this.forEach(function(e) {
          0 > n.indexOf(e) && i.push(e);
        });
      }
      return C(i);
    },
    has: function(e) {
      return this.filter(function() {
        return r(e) ? C.contains(this, e) : C(this).find(e).size();
      });
    },
    eq: function(e) {
      return -1 === e ? this.slice(e) : this.slice(e, +e + 1);
    },
    first: function() {
      var e = this[0];
      return e && !r(e) ? e : C(e);
    },
    last: function() {
      var e = this[this.length - 1];
      return e && !r(e) ? e : C(e);
    },
    find: function(e) {
      var t, i = this;
      return t = "object" == typeof e ? C(e).filter(function() {
        var e = this;
        return S.some.call(i, function(t) {
          return C.contains(t, e);
        });
      }) : 1 == this.length ? C(K.qsa(this[0], e)) : this.map(function() {
        return K.qsa(this, e);
      });
    },
    closest: function(e, t) {
      var i = this[0], r = !1;
      for ("object" == typeof e && (r = C(e)); i && !(r ? r.indexOf(i) >= 0 : K.matches(i, e)); ) i = i !== t && !n(i) && i.parentNode;
      return C(i);
    },
    parents: function(e) {
      for (var t = [], i = this; i.length > 0; ) i = C.map(i, function(e) {
        return (e = e.parentNode) && !n(e) && 0 > t.indexOf(e) ? (t.push(e), e) : w;
      });
      return g(t, e);
    },
    parent: function(e) {
      return g($(this.pluck("parentNode")), e);
    },
    children: function(e) {
      return g(this.map(function() {
        return f(this);
      }), e);
    },
    contents: function() {
      return this.map(function() {
        return M.call(this.childNodes);
      });
    },
    siblings: function(e) {
      return g(this.map(function(e, t) {
        return I.call(f(t.parentNode), function(e) {
          return e !== t;
        });
      }), e);
    },
    empty: function() {
      return this.each(function() {
        this.innerHTML = "";
      });
    },
    pluck: function(e) {
      return C.map(this, function(t) {
        return t[e];
      });
    },
    show: function() {
      return this.each(function() {
        "none" == this.style.display && (this.style.display = null), "none" == D(this, "").getPropertyValue("display") && (this.style.display = p(this.nodeName));
      });
    },
    replaceWith: function(e) {
      return this.before(e).remove();
    },
    wrap: function(e) {
      var i = t(e);
      if (this[0] && !i) var n = C(e).get(0), r = n.parentNode || this.length > 1;
      return this.each(function(t) {
        C(this).wrapAll(i ? e.call(this, t) : r ? n.cloneNode(!0) : n);
      });
    },
    wrapAll: function(e) {
      if (this[0]) {
        C(this[0]).before(e = C(e));
        for (var t; (t = e.children()).length; ) e = t.first();
        C(e).append(this);
      }
      return this;
    },
    wrapInner: function(e) {
      var i = t(e);
      return this.each(function(t) {
        var n = C(this), r = n.contents(), a = i ? e.call(this, t) : e;
        r.length ? r.wrapAll(a) : n.append(a);
      });
    },
    unwrap: function() {
      return this.parent().each(function() {
        C(this).replaceWith(C(this).children());
      }), this;
    },
    clone: function() {
      return this.map(function() {
        return this.cloneNode(!0);
      });
    },
    hide: function() {
      return this.css("display", "none");
    },
    toggle: function(e) {
      return this.each(function() {
        var t = C(this);
        (e === w ? "none" == t.css("display") : e) ? t.show() : t.hide();
      });
    },
    prev: function(e) {
      return C(this.pluck("previousElementSibling")).filter(e || "*");
    },
    next: function(e) {
      return C(this.pluck("nextElementSibling")).filter(e || "*");
    },
    html: function(e) {
      return e === w ? this.length > 0 ? this[0].innerHTML : null : this.each(function(t) {
        var i = this.innerHTML;
        C(this).empty().append(v(this, e, t, i));
      });
    },
    text: function(e) {
      return e === w ? this.length > 0 ? this[0].textContent : null : this.each(function() {
        this.textContent = e;
      });
    },
    attr: function(e, t) {
      var i;
      return "string" == typeof e && t === w ? 0 == this.length || 1 !== this[0].nodeType ? w : "value" == e && "INPUT" == this[0].nodeName ? this.val() : !(i = this[0].getAttribute(e)) && e in this[0] ? this[0][e] : i : this.each(function(i) {
        if (1 === this.nodeType) if (r(e)) for (k in e) y(this, k, e[k]); else y(this, e, v(this, t, i, this.getAttribute(e)));
      });
    },
    removeAttr: function(e) {
      return this.each(function() {
        1 === this.nodeType && y(this, e);
      });
    },
    prop: function(e, t) {
      return t === w ? this[0] && this[0][e] : this.each(function(i) {
        this[e] = v(this, t, i, this[e]);
      });
    },
    data: function(e, t) {
      var i = this.attr("data-" + d(e), t);
      return null !== i ? b(i) : w;
    },
    val: function(e) {
      return e === w ? this[0] && (this[0].multiple ? C(this[0]).find("option").filter(function() {
        return this.selected;
      }).pluck("value") : this[0].value) : this.each(function(t) {
        this.value = v(this, e, t, this.value);
      });
    },
    offset: function(e) {
      if (e) return this.each(function(t) {
        var i = C(this), n = v(this, e, t, i.offset()), r = i.offsetParent().offset(), a = {
          top: n.top - r.top,
          left: n.left - r.left
        };
        "static" == i.css("position") && (a.position = "relative"), i.css(a);
      });
      if (0 == this.length) return null;
      var t = this[0].getBoundingClientRect();
      return {
        left: t.left + window.pageXOffset,
        top: t.top + window.pageYOffset,
        width: Math.round(t.width),
        height: Math.round(t.height)
      };
    },
    css: function(t, i) {
      if (2 > arguments.length && "string" == typeof t) return this[0] && (this[0].style[T(t)] || D(this[0], "").getPropertyValue(t));
      var n = "";
      if ("string" == e(t)) i || 0 === i ? n = d(t) + ":" + h(t, i) : this.each(function() {
        this.style.removeProperty(d(t));
      }); else for (k in t) t[k] || 0 === t[k] ? n += d(k) + ":" + h(k, t[k]) + ";" : this.each(function() {
        this.style.removeProperty(d(k));
      });
      return this.each(function() {
        this.style.cssText += ";" + n;
      });
    },
    index: function(e) {
      return e ? this.indexOf(C(e)[0]) : this.parent().children().indexOf(this[0]);
    },
    hasClass: function(e) {
      return S.some.call(this, function(e) {
        return this.test(_(e));
      }, u(e));
    },
    addClass: function(e) {
      return this.each(function(t) {
        E = [];
        var i = _(this), n = v(this, e, t, i);
        n.split(/\s+/g).forEach(function(e) {
          C(this).hasClass(e) || E.push(e);
        }, this), E.length && _(this, i + (i ? " " : "") + E.join(" "));
      });
    },
    removeClass: function(e) {
      return this.each(function(t) {
        return e === w ? _(this, "") : (E = _(this), v(this, e, t, E).split(/\s+/g).forEach(function(e) {
          E = E.replace(u(e), " ");
        }), _(this, E.trim()), w);
      });
    },
    toggleClass: function(e, t) {
      return this.each(function(i) {
        var n = C(this), r = v(this, e, i, _(this));
        r.split(/\s+/g).forEach(function(e) {
          (t === w ? !n.hasClass(e) : t) ? n.addClass(e) : n.removeClass(e);
        });
      });
    },
    scrollTop: function() {
      return this.length ? "scrollTop" in this[0] ? this[0].scrollTop : this[0].scrollY : w;
    },
    position: function() {
      if (this.length) {
        var e = this[0], t = this.offsetParent(), i = this.offset(), n = H.test(t[0].nodeName) ? {
          top: 0,
          left: 0
        } : t.offset();
        return i.top -= parseFloat(C(e).css("margin-top")) || 0, i.left -= parseFloat(C(e).css("margin-left")) || 0, 
        n.top += parseFloat(C(t[0]).css("border-top-width")) || 0, n.left += parseFloat(C(t[0]).css("border-left-width")) || 0, 
        {
          top: i.top - n.top,
          left: i.left - n.left
        };
      }
    },
    offsetParent: function() {
      return this.map(function() {
        for (var e = this.offsetParent || N.body; e && !H.test(e.nodeName) && "static" == C(e).css("position"); ) e = e.offsetParent;
        return e;
      });
    }
  }, C.fn.detach = C.fn.remove, [ "width", "height" ].forEach(function(e) {
    C.fn[e] = function(t) {
      var r, a = this[0], s = e.replace(/./, function(e) {
        return e[0].toUpperCase();
      });
      return t === w ? i(a) ? a["inner" + s] : n(a) ? a.documentElement["offset" + s] : (r = this.offset()) && r[e] : this.each(function(i) {
        a = C(this), a.css(e, v(this, t, i, a[e]()));
      });
    };
  }), j.forEach(function(t, i) {
    var n = i % 2;
    C.fn[t] = function() {
      var t, r, a = C.map(arguments, function(i) {
        return t = e(i), "object" == t || "array" == t || null == i ? i : K.fragment(i);
      }), s = this.length > 1;
      return 1 > a.length ? this : this.each(function(e, t) {
        r = n ? t : t.parentNode, t = 0 == i ? t.nextSibling : 1 == i ? t.firstChild : 2 == i ? t : null, 
        a.forEach(function(e) {
          if (s) e = e.cloneNode(!0); else if (!r) return C(e).remove();
          x(r.insertBefore(e, t), function(e) {
            null == e.nodeName || "SCRIPT" !== e.nodeName.toUpperCase() || e.type && "text/javascript" !== e.type || e.src || window.eval.call(window, e.innerHTML);
          });
        });
      });
    }, C.fn[n ? t + "To" : "insert" + (i ? "Before" : "After")] = function(e) {
      return C(e)[t](this), this;
    };
  }), K.Z.prototype = C.fn, K.uniq = $, K.deserializeValue = b, C.zepto = K, C;
}();

window.Zepto = Zepto, "$" in window || (window.$ = Zepto), function(e) {
  String.prototype.trim === e && (String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
  }), Array.prototype.reduce === e && (Array.prototype.reduce = function(t) {
    if (void 0 === this || null === this) throw new TypeError();
    var i, n = Object(this), r = n.length >>> 0, a = 0;
    if ("function" != typeof t) throw new TypeError();
    if (0 == r && 1 == arguments.length) throw new TypeError();
    if (arguments.length >= 2) i = arguments[1]; else for (;;) {
      if (a in n) {
        i = n[a++];
        break;
      }
      if (++a >= r) throw new TypeError();
    }
    for (;r > a; ) a in n && (i = t.call(e, i, n[a], a, n)), a++;
    return i;
  });
}(), function(e) {
  function t(e) {
    return e._zid || (e._zid = p++);
  }
  function i(e, i, a, s) {
    if (i = n(i), i.ns) var o = r(i.ns);
    return (h[t(e)] || []).filter(function(e) {
      return !(!e || i.e && e.e != i.e || i.ns && !o.test(e.ns) || a && t(e.fn) !== t(a) || s && e.sel != s);
    });
  }
  function n(e) {
    var t = ("" + e).split(".");
    return {
      e: t[0],
      ns: t.slice(1).sort().join(" ")
    };
  }
  function r(e) {
    return RegExp("(?:^| )" + e.replace(" ", " .* ?") + "(?: |$)");
  }
  function a(t, i, n) {
    "string" != e.type(t) ? e.each(t, n) : t.split(/\s/).forEach(function(e) {
      n(e, i);
    });
  }
  function s(e, t) {
    return e.del && ("focus" == e.e || "blur" == e.e) || !!t;
  }
  function o(e) {
    return m[e] || e;
  }
  function l(i, r, l, c, d, u) {
    var p = t(i), f = h[p] || (h[p] = []);
    a(r, l, function(t, r) {
      var a = n(t);
      a.fn = r, a.sel = c, a.e in m && (r = function(t) {
        var i = t.relatedTarget;
        return !i || i !== this && !e.contains(this, i) ? a.fn.apply(this, arguments) : void 0;
      }), a.del = d && d(r, t);
      var l = a.del || r;
      a.proxy = function(e) {
        var t = l.apply(i, [ e ].concat(e.data));
        return t === !1 && (e.preventDefault(), e.stopPropagation()), t;
      }, a.i = f.length, f.push(a), i.addEventListener(o(a.e), a.proxy, s(a, u));
    });
  }
  function c(e, n, r, l, c) {
    var d = t(e);
    a(n || "", r, function(t, n) {
      i(e, t, n, l).forEach(function(t) {
        delete h[d][t.i], e.removeEventListener(o(t.e), t.proxy, s(t, c));
      });
    });
  }
  function d(t) {
    var i, n = {
      originalEvent: t
    };
    for (i in t) y.test(i) || void 0 === t[i] || (n[i] = t[i]);
    return e.each(_, function(e, i) {
      n[e] = function() {
        return this[i] = g, t[e].apply(t, arguments);
      }, n[i] = v;
    }), n;
  }
  function u(e) {
    if (!("defaultPrevented" in e)) {
      e.defaultPrevented = !1;
      var t = e.preventDefault;
      e.preventDefault = function() {
        this.defaultPrevented = !0, t.call(this);
      };
    }
  }
  var h = (e.zepto.qsa, {}), p = 1, f = {}, m = {
    mouseenter: "mouseover",
    mouseleave: "mouseout"
  };
  f.click = f.mousedown = f.mouseup = f.mousemove = "MouseEvents", e.event = {
    add: l,
    remove: c
  }, e.proxy = function(i, n) {
    if (e.isFunction(i)) {
      var r = function() {
        return i.apply(n, arguments);
      };
      return r._zid = t(i), r;
    }
    if ("string" == typeof n) return e.proxy(i[n], i);
    throw new TypeError("expected function");
  }, e.fn.bind = function(e, t) {
    return this.each(function() {
      l(this, e, t);
    });
  }, e.fn.unbind = function(e, t) {
    return this.each(function() {
      c(this, e, t);
    });
  }, e.fn.one = function(e, t) {
    return this.each(function(i, n) {
      l(this, e, t, null, function(e, t) {
        return function() {
          var i = e.apply(n, arguments);
          return c(n, t, e), i;
        };
      });
    });
  };
  var g = function() {
    return !0;
  }, v = function() {
    return !1;
  }, y = /^([A-Z]|layer[XY]$)/, _ = {
    preventDefault: "isDefaultPrevented",
    stopImmediatePropagation: "isImmediatePropagationStopped",
    stopPropagation: "isPropagationStopped"
  };
  e.fn.delegate = function(t, i, n) {
    return this.each(function(r, a) {
      l(a, i, n, t, function(i) {
        return function(n) {
          var r, s = e(n.target).closest(t, a).get(0);
          return s ? (r = e.extend(d(n), {
            currentTarget: s,
            liveFired: a
          }), i.apply(s, [ r ].concat([].slice.call(arguments, 1)))) : void 0;
        };
      });
    });
  }, e.fn.undelegate = function(e, t, i) {
    return this.each(function() {
      c(this, t, i, e);
    });
  }, e.fn.live = function(t, i) {
    return e(document.body).delegate(this.selector, t, i), this;
  }, e.fn.die = function(t, i) {
    return e(document.body).undelegate(this.selector, t, i), this;
  }, e.fn.on = function(t, i, n) {
    return !i || e.isFunction(i) ? this.bind(t, i || n) : this.delegate(i, t, n);
  }, e.fn.off = function(t, i, n) {
    return !i || e.isFunction(i) ? this.unbind(t, i || n) : this.undelegate(i, t, n);
  }, e.fn.trigger = function(t, i) {
    return ("string" == typeof t || e.isPlainObject(t)) && (t = e.Event(t)), u(t), t.data = i, 
    this.each(function() {
      "dispatchEvent" in this && this.dispatchEvent(t);
    });
  }, e.fn.triggerHandler = function(t, n) {
    var r, a;
    return this.each(function(s, o) {
      r = d("string" == typeof t ? e.Event(t) : t), r.data = n, r.target = o, e.each(i(o, t.type || t), function(e, t) {
        return a = t.proxy(r), r.isImmediatePropagationStopped() ? !1 : void 0;
      });
    }), a;
  }, "focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(t) {
    e.fn[t] = function(e) {
      return e ? this.bind(t, e) : this.trigger(t);
    };
  }), [ "focus", "blur" ].forEach(function(t) {
    e.fn[t] = function(e) {
      return e ? this.bind(t, e) : this.each(function() {
        try {
          this[t]();
        } catch (e) {}
      }), this;
    };
  }), e.Event = function(e, t) {
    "string" != typeof e && (t = e, e = t.type);
    var i = document.createEvent(f[e] || "Events"), n = !0;
    if (t) for (var r in t) "bubbles" == r ? n = !!t[r] : i[r] = t[r];
    return i.initEvent(e, n, !0, null, null, null, null, null, null, null, null, null, null, null, null), 
    i.isDefaultPrevented = function() {
      return this.defaultPrevented;
    }, i;
  };
}(Zepto), function(e) {
  function t(t, i, n) {
    var r = e.Event(i);
    return e(t).trigger(r, n), !r.defaultPrevented;
  }
  function i(e, i, n, r) {
    return e.global ? t(i || y, n, r) : void 0;
  }
  function n(t) {
    t.global && 0 === e.active++ && i(t, null, "ajaxStart");
  }
  function r(t) {
    t.global && !--e.active && i(t, null, "ajaxStop");
  }
  function a(e, t) {
    var n = t.context;
    return t.beforeSend.call(n, e, t) === !1 || i(t, n, "ajaxBeforeSend", [ e, t ]) === !1 ? !1 : (i(t, n, "ajaxSend", [ e, t ]), 
    void 0);
  }
  function s(e, t, n) {
    var r = n.context, a = "success";
    n.success.call(r, e, a, t), i(n, r, "ajaxSuccess", [ t, n, e ]), l(a, t, n);
  }
  function o(e, t, n, r) {
    var a = r.context;
    r.error.call(a, n, t, e), i(r, a, "ajaxError", [ n, r, e ]), l(t, n, r);
  }
  function l(e, t, n) {
    var a = n.context;
    n.complete.call(a, t, e), i(n, a, "ajaxComplete", [ t, n ]), r(n);
  }
  function c() {}
  function d(e) {
    return e && (e = e.split(";", 2)[0]), e && (e == k ? "html" : e == w ? "json" : b.test(e) ? "script" : x.test(e) && "xml") || "text";
  }
  function u(e, t) {
    return (e + "&" + t).replace(/[&?]{1,2}/, "?");
  }
  function h(t) {
    t.processData && t.data && "string" != e.type(t.data) && (t.data = e.param(t.data, t.traditional)), 
    !t.data || t.type && "GET" != t.type.toUpperCase() || (t.url = u(t.url, t.data));
  }
  function p(t, i, n, r) {
    var a = !e.isFunction(i);
    return {
      url: t,
      data: a ? i : void 0,
      success: a ? e.isFunction(n) ? n : void 0 : i,
      dataType: a ? r || n : n
    };
  }
  function f(t, i, n, r) {
    var a, s = e.isArray(i);
    e.each(i, function(i, o) {
      a = e.type(o), r && (i = n ? r : r + "[" + (s ? "" : i) + "]"), !r && s ? t.add(o.name, o.value) : "array" == a || !n && "object" == a ? f(t, o, n, i) : t.add(i, o);
    });
  }
  var m, g, v = 0, y = window.document, _ = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, b = /^(?:text|application)\/javascript/i, x = /^(?:text|application)\/xml/i, w = "application/json", k = "text/html", C = /^\s*$/;
  e.active = 0, e.ajaxJSONP = function(t) {
    if (!("type" in t)) return e.ajax(t);
    var i, n = "jsonp" + ++v, r = y.createElement("script"), l = function() {
      clearTimeout(i), e(r).remove(), delete window[n];
    }, d = function(e) {
      l(), e && "timeout" != e || (window[n] = c), o(null, e || "abort", u, t);
    }, u = {
      abort: d
    };
    return a(u, t) === !1 ? (d("abort"), !1) : (window[n] = function(e) {
      l(), s(e, u, t);
    }, r.onerror = function() {
      d("error");
    }, r.src = t.url.replace(/=\?/, "=" + n), e("head").append(r), t.timeout > 0 && (i = setTimeout(function() {
      d("timeout");
    }, t.timeout)), u);
  }, e.ajaxSettings = {
    type: "GET",
    beforeSend: c,
    success: c,
    error: c,
    complete: c,
    context: null,
    global: !0,
    xhr: function() {
      return new window.XMLHttpRequest();
    },
    accepts: {
      script: "text/javascript, application/javascript",
      json: w,
      xml: "application/xml, text/xml",
      html: k,
      text: "text/plain"
    },
    crossDomain: !1,
    timeout: 0,
    processData: !0,
    cache: !0
  }, e.ajax = function(t) {
    var i = e.extend({}, t || {});
    for (m in e.ajaxSettings) void 0 === i[m] && (i[m] = e.ajaxSettings[m]);
    n(i), i.crossDomain || (i.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(i.url) && RegExp.$2 != window.location.host), 
    i.url || (i.url = "" + window.location), h(i), i.cache === !1 && (i.url = u(i.url, "_=" + Date.now()));
    var r = i.dataType, l = /=\?/.test(i.url);
    if ("jsonp" == r || l) return l || (i.url = u(i.url, "callback=?")), e.ajaxJSONP(i);
    var p, f = i.accepts[r], v = {}, y = /^([\w-]+:)\/\//.test(i.url) ? RegExp.$1 : window.location.protocol, _ = i.xhr();
    i.crossDomain || (v["X-Requested-With"] = "XMLHttpRequest"), f && (v.Accept = f, 
    f.indexOf(",") > -1 && (f = f.split(",", 2)[0]), _.overrideMimeType && _.overrideMimeType(f)), 
    (i.contentType || i.contentType !== !1 && i.data && "GET" != i.type.toUpperCase()) && (v["Content-Type"] = i.contentType || "application/x-www-form-urlencoded"), 
    i.headers = e.extend(v, i.headers || {}), _.onreadystatechange = function() {
      if (4 == _.readyState) {
        _.onreadystatechange = c, clearTimeout(p);
        var t, n = !1;
        if (_.status >= 200 && 300 > _.status || 304 == _.status || 0 == _.status && "file:" == y) {
          r = r || d(_.getResponseHeader("content-type")), t = _.responseText;
          try {
            "script" == r ? (1, eval)(t) : "xml" == r ? t = _.responseXML : "json" == r && (t = C.test(t) ? null : e.parseJSON(t));
          } catch (a) {
            n = a;
          }
          n ? o(n, "parsererror", _, i) : s(t, _, i);
        } else o(null, _.status ? "error" : "abort", _, i);
      }
    };
    var b = "async" in i ? i.async : !0;
    _.open(i.type, i.url, b);
    for (g in i.headers) _.setRequestHeader(g, i.headers[g]);
    return a(_, i) === !1 ? (_.abort(), !1) : (i.timeout > 0 && (p = setTimeout(function() {
      _.onreadystatechange = c, _.abort(), o(null, "timeout", _, i);
    }, i.timeout)), _.send(i.data ? i.data : null), _);
  }, e.get = function() {
    return e.ajax(p.apply(null, arguments));
  }, e.post = function() {
    var t = p.apply(null, arguments);
    return t.type = "POST", e.ajax(t);
  }, e.getJSON = function() {
    var t = p.apply(null, arguments);
    return t.dataType = "json", e.ajax(t);
  }, e.fn.load = function(t, i, n) {
    if (!this.length) return this;
    var r, a = this, s = t.split(/\s/), o = p(t, i, n), l = o.success;
    return s.length > 1 && (o.url = s[0], r = s[1]), o.success = function(t) {
      a.html(r ? e("<div>").html(t.replace(_, "")).find(r) : t), l && l.apply(a, arguments);
    }, e.ajax(o), this;
  };
  var E = encodeURIComponent;
  e.param = function(e, t) {
    var i = [];
    return i.add = function(e, t) {
      this.push(E(e) + "=" + E(t));
    }, f(i, e, t), i.join("&").replace(/%20/g, "+");
  };
}(Zepto), function(e) {
  e.fn.serializeArray = function() {
    var t, i = [];
    return e(Array.prototype.slice.call(this.get(0).elements)).each(function() {
      t = e(this);
      var n = t.attr("type");
      "fieldset" != this.nodeName.toLowerCase() && !this.disabled && "submit" != n && "reset" != n && "button" != n && ("radio" != n && "checkbox" != n || this.checked) && i.push({
        name: t.attr("name"),
        value: t.val()
      });
    }), i;
  }, e.fn.serialize = function() {
    var e = [];
    return this.serializeArray().forEach(function(t) {
      e.push(encodeURIComponent(t.name) + "=" + encodeURIComponent(t.value));
    }), e.join("&");
  }, e.fn.submit = function(t) {
    if (t) this.bind("submit", t); else if (this.length) {
      var i = e.Event("submit");
      this.eq(0).trigger(i), i.defaultPrevented || this.get(0).submit();
    }
    return this;
  };
}(Zepto), function(e) {
  function t(t, n) {
    var l = t[o], c = l && r[l];
    if (void 0 === n) return c || i(t);
    if (c) {
      if (n in c) return c[n];
      var d = s(n);
      if (d in c) return c[d];
    }
    return a.call(e(t), n);
  }
  function i(t, i, a) {
    var l = t[o] || (t[o] = ++e.uuid), c = r[l] || (r[l] = n(t));
    return void 0 !== i && (c[s(i)] = a), c;
  }
  function n(t) {
    var i = {};
    return e.each(t.attributes, function(t, n) {
      0 == n.name.indexOf("data-") && (i[s(n.name.replace("data-", ""))] = e.zepto.deserializeValue(n.value));
    }), i;
  }
  var r = {}, a = e.fn.data, s = e.camelCase, o = e.expando = "Zepto" + +new Date();
  e.fn.data = function(n, r) {
    return void 0 === r ? e.isPlainObject(n) ? this.each(function(t, r) {
      e.each(n, function(e, t) {
        i(r, e, t);
      });
    }) : 0 == this.length ? void 0 : t(this[0], n) : this.each(function() {
      i(this, n, r);
    });
  }, e.fn.removeData = function(t) {
    return "string" == typeof t && (t = t.split(/\s+/)), this.each(function() {
      var i = this[o], n = i && r[i];
      n && e.each(t, function() {
        delete n[s(this)];
      });
    });
  };
}(Zepto), function(e) {
  function t(e) {
    return "tagName" in e ? e : e.parentNode;
  }
  function i(e, t, i, n) {
    var r = Math.abs(e - t), a = Math.abs(i - n);
    return r >= a ? e - t > 0 ? "Left" : "Right" : i - n > 0 ? "Up" : "Down";
  }
  function n() {
    c = null, d.last && (d.el.trigger("longTap"), d = {});
  }
  function r() {
    c && clearTimeout(c), c = null;
  }
  function a() {
    s && clearTimeout(s), o && clearTimeout(o), l && clearTimeout(l), c && clearTimeout(c), 
    s = o = l = c = null, d = {};
  }
  var s, o, l, c, d = {}, u = 750;
  e(document).ready(function() {
    var h, p;
    e(document.body).bind("touchstart", function(i) {
      h = Date.now(), p = h - (d.last || h), d.el = e(t(i.touches[0].target)), s && clearTimeout(s), 
      d.x1 = i.touches[0].pageX, d.y1 = i.touches[0].pageY, p > 0 && 250 >= p && (d.isDoubleTap = !0), 
      d.last = h, c = setTimeout(n, u);
    }).bind("touchmove", function(e) {
      r(), d.x2 = e.touches[0].pageX, d.y2 = e.touches[0].pageY, Math.abs(d.x1 - d.x2) > 10 && e.preventDefault();
    }).bind("touchend", function() {
      r(), d.x2 && Math.abs(d.x1 - d.x2) > 30 || d.y2 && Math.abs(d.y1 - d.y2) > 30 ? l = setTimeout(function() {
        d.el.trigger("swipe"), d.el.trigger("swipe" + i(d.x1, d.x2, d.y1, d.y2)), d = {};
      }, 0) : "last" in d && (o = setTimeout(function() {
        var t = e.Event("tap");
        t.cancelTouch = a, d.el.trigger(t), d.isDoubleTap ? (d.el.trigger("doubleTap"), 
        d = {}) : s = setTimeout(function() {
          s = null, d.el.trigger("singleTap"), d = {};
        }, 250);
      }, 0));
    }).bind("touchcancel", a), e(window).bind("scroll", a);
  }), [ "swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "doubleTap", "tap", "singleTap", "longTap" ].forEach(function(t) {
    e.fn[t] = function(e) {
      return this.bind(t, e);
    };
  });
}(Zepto), "function" == typeof define && define("zepto", function() {
  return Zepto;
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
        void 0 === this.lexer.yylloc && (this.lexer.yylloc = {});
        var u = this.lexer.yylloc;
        a.push(u);
        var h = this.lexer.options && this.lexer.options.ranges;
        "function" == typeof this.yy.parseError && (this.parseError = this.yy.parseError);
        for (var p, f, m, g, v, y, _, b, x, w = {}; ;) {
          if (m = n[n.length - 1], this.defaultActions[m] ? g = this.defaultActions[m] : ((null === p || void 0 === p) && (p = t()), 
          g = s[m] && s[m][p]), void 0 === g || !g.length || !g[0]) {
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
            v = this.performAction.call(w, o, c, l, this.yy, g[1], r, a), void 0 !== v) return v;
            _ && (n = n.slice(0, -2 * _), r = r.slice(0, -1 * _), a = a.slice(0, -1 * _)), n.push(this.productions_[g[1]][0]), 
            r.push(w.$), a.push(w._$), b = s[n[n.length - 2]][n[n.length - 1]], n.push(b);
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
          return void 0 !== e ? e : this.lex();
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
      return e.options = {}, e.performAction = function(e, t, i) {
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
  return void 0 !== e && void 0 !== t && (t.parser = n, t.Parser = n.Parser, t.parse = function() {
    return n.parse.apply(n, arguments);
  }, t.main = function(i) {
    if (!i[1]) throw Error("Usage: " + i[0] + " FILE");
    var n;
    return n = "undefined" != typeof process ? e("fs").readFileSync(e("path").resolve(i[1]), "utf8") : e("file").path(e("file").cwd()).join(i[1]).read({
      charset: "utf-8"
    }), t.parser.parse(n);
  }, void 0 !== i && e.main === i && t.main("undefined" != typeof process ? process.argv.slice(1) : e("system").args)), 
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
        return void 0 === e ? !0 : null === e ? !0 : e === !1 ? !0 : "[object Array]" === Object.prototype.toString.call(e) && 0 === e.length ? !0 : !1;
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
<<<<<<< HEAD
}), define("store", function(t, e, n) {
  "use strict";
=======
}), define("store", function(e, t, i) {
>>>>>>> 6a96ad7... update files
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
      null == i && (i = t, t = null), void 0 === n && (n = t || {}), i(n), s.set(e, n);
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
    s.enabled = !s.disabled, void 0 !== i && "function" != typeof i ? i.exports = s : "function" == typeof define && define.amd ? define(s) : this.store = s;
  })();
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
      -(i * Math.pow(2, 10 * (e -= 1)) * Math.sin(2 * (e - t) * Math.PI / n)));
    },
    Out: function(e) {
      var t, i = .1, n = .4;
      return 0 === e ? 0 : 1 === e ? 1 : (!i || 1 > i ? (i = 1, t = n / 4) : t = n * Math.asin(1 / i) / (2 * Math.PI), 
      i * Math.pow(2, -10 * e) * Math.sin(2 * (e - t) * Math.PI / n) + 1);
    },
    InOut: function(e) {
      var t, i = .1, n = .4;
      return 0 === e ? 0 : 1 === e ? 1 : (!i || 1 > i ? (i = 1, t = n / 4) : t = n * Math.asin(1 / i) / (2 * Math.PI), 
      1 > (e *= 2) ? -.5 * i * Math.pow(2, 10 * (e -= 1)) * Math.sin(2 * (e - t) * Math.PI / n) : .5 * i * Math.pow(2, -10 * (e -= 1)) * Math.sin(2 * (e - t) * Math.PI / n) + 1);
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
    s && (p.hours = s), o && (p.minutes = o), void 0 !== l && (p.day = l), h;
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
}(), define("lightsaber", function(e, t, i) {
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
    return b.get(t, function(t) {
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
    return e instanceof RegExp ? e : ($(e) && (e = "(" + e.join("|") + ")"), e = e.concat(n ? "" : "/?").replace(/\/\(/g, "(?:/").replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function(e, i, n, r, a, s, o) {
      return t.push({
        name: r,
        optional: !!s
      }), i = i || "", "" + (s ? "" : i) + "(?:" + (s ? i : "") + (n || "") + (a || n && "([^/.]+?)" || "([^/]+?)") + ")" + (s || "") + (o ? "(/*)?" : "");
    }).replace(/([\/.])/g, "\\$1").replace(/\*/g, "(.*)"), RegExp("^" + e + "$", i ? "" : "i"));
  }
  var y, _ = e("emitter"), b = e("jquery") || e("zepto"), x = b.proxy, w = window.location, k = window.history, C = "/", E = !1;
  b(window).on("load", function() {
    E = !0, setTimeout(function() {
      E = !1;
    }, 0);
  }), t = i.exports = n;
  var T;
  t.version = "0.0.5", T = r.prototype, T.historySupport = y = null !== (null !== k ? k.pushState : void 0), 
  b.browser && b.browser.opera && (T.historySupport = y = !1), T.init = function() {
    this.route = C, this.stack = [], this.cache = {}, this.settings = {}, this.engines = {}, 
    this.viewCallbacks = [], this.defaultConfiguration();
  }, T.defaultConfiguration = function() {
    this.set("env", "production"), this.enable("dispatch"), this.use(d(this)), this._usedRouter = !1, 
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
  }, T.path = function() {
    return this.route;
  }, T.param = function(e, t) {
    var i, n = [].slice.call(arguments, 1), r = 0;
    if ($(e)) for (i = e.length; i > r; ++r) for (var a = 0, s = n.length; s > a; ++a) this.param(e[r], n[a]); else if ("function" == typeof e) this._router.param(e); else for (":" === e[0] && (e = e.substr(1)), 
    i = n.length; i > r; ++r) this._router.param(e, t);
    return this;
  }, T.initRouter = function() {
    this._usedRouter === !1 && (this._usedRouter = !0, this.use(this._router.middleware));
  }, T.get = function() {
    var e = [].slice.call(arguments);
    return this.initRouter(), this._router.route.apply(this._router, e);
  }, T.handle = function(e, t) {
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
    var n = this.stack, r = "", a = !1, s = 0;
    i();
  }, T.run = function(e) {
    this.emit("launch"), e = e || {};
    var t = this.request, i = this.response;
    this.running || (this.running = !0, !1 === e.dispatch && this.disable("dispatch"), 
    !1 !== e.popstate && (this.historySupport ? b(window).on("popstate", x(this.change, this)) : b(window).on("hashchange", x(this.change, this))), 
    this.disabled("dispatch") || (this.handle(t, i), this.emit("launched")));
  }, T.change = function(e) {
    if (E) return E = !1;
    var t = this, i = t.request, n = t.response, r = i.url;
    return i.updateUrl(), "/" === r || r !== i.url ? (t.handle(i, n), e.stopPropagation(), 
    e.preventDefault(), !1) : void 0;
  }, T.error = function(e, t) {
    var i = Error(t);
    return i.status = e, i;
  }, T = a.prototype, T.updateUrl = function() {
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
    var n = this, t = t || {}, r = this.app;
    "function" == typeof t && (i = t, t = {}), t.locals = n.locals, r.render(e, t, i);
  }, T = o.prototype, T.param = function(e, t) {
    if ("function" == typeof e) return this._params.push(e), void 0;
    var i, n, r = this._params, a = r.length;
    for (n = 0; a > n; ++n) (i = r[n](e, t)) && (t = i);
    if ("function" != typeof t) throw Error("invalid param() call for " + e + ", got " + t);
    return (this.params[e] = this.params[e] || []).push(t), this;
  }, T._dispatch = function(e, t, i) {
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
  }, T.matchRequest = function(e, t) {
    var i, n = e.url, r = this.map, a = r.length;
    for (t = t || 0; a > t; ++t) if (i = r[t], i.match(n)) return e._route_index = t, 
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
    var t, i, n, r, a = this.keys, s = this.params = [], o = this.regexp.exec(e);
    if (!o) return !1;
    for (t = 1, i = o.length; i > t; ++t) n = a[t - 1], r = "string" == typeof o[t] ? decodeURIComponent(o[t]) : o[t], 
    n ? s[n.name] = r : s.push(r);
    return !0;
  }, T = c.prototype, T.lookup = function(e) {
    return this.root + "/" + e + "?t=" + this.timestamp;
  }, T.render = function(e, t) {
    return p(this.engine, this.path, e, t, this.ext);
  }, u.id = 0;
  var $ = Array.isArray;
  $ || ($ = function(e) {
    return e instanceof Array;
  });
}), define("live", function(e) {
  "use strict";
  function t() {
    navigator.geolocation.clearWatch(M);
  }
  function i() {
    M = navigator.geolocation.watchPosition(function(e) {
      e && e.coords && e.coords.latitude && e.coords.longitude && e.coords.accuracy && (h.latitude = "" + e.coords.latitude, 
      h.longitude = "" + e.coords.longitude, h.accuracy = "" + e.coords.accuracy, l = o - 5, 
      v("Location update: lat = " + h.latitude + ", " + "lng = " + h.longitude + ", " + "acu = " + h.accuracy));
    });
  }
  var n = window._ENV_, r = n.streaming_api_url, a = n.api_url;
  e("store");
  var s = "", o = 30, l = o, c = !1, d = null, u = "", h = {
    card: {
      id: "",
      name: "",
      avatar: "",
      bio: "",
      identities: [],
      timestamp: 0
    },
    latitude: "",
    longitude: "",
    accuracy: "",
    traits: []
  }, p = Date.now || function() {
    return new Date().getTime();
  }, r = r, f = null, m = null, g = null, v = function(e, t) {
    if (c) {
      var i = Object.prototype.toString.call(e), n = "" + new Date();
      "[object String]" !== i && "[object Number]" !== i && (e = JSON.stringify(e)), console.log(n.replace(/^.*(\d{2}:\d{2}:\d{2}).*$/, "$1") + " - " + e), 
      t && console.table && console.table(t);
    }
  }, y = function() {
    l = 0, v("Breathe with" + (s ? " token: " + s : "out token")), f && f.abort(), f = $.ajax({
      type: "post",
      url: r + "/v3/live/cards" + (s ? "?token=" + s : ""),
      data: JSON.stringify(h),
      success: function(e) {
        var t = e;
        t && t.length && (l = 0, s !== t[0] && (v("Got new token: " + t[0] + ", id: " + t[1]), 
        w.live && (w.kill(), v("Close current stream")), l = o), s = t[0], h.card.id = t[1]);
      },
      error: function(e) {
        e.status && e.status >= 400 && 499 >= e.status ? (s && v("Repeal token: " + s), 
        s = "", l = o) : (l = o - 5, v("Network error"));
      }
    }), !w.live && s && (w.init(r + "/v3/live/streaming?token=" + s, _, b), v("Streaming with token: " + s));
  }, _ = function(e) {
    if (e && e.length) {
      var t = JSON.parse(e[e.length - 1]);
      if (t && t.length) {
        var i = {};
        for (var n in t) t[n].id && (t[n].id === h.card.id ? (h.card.name = t[n].name, h.card.avatar = t[n].avatar, 
        h.card.bio = t[n].bio, h.card.identities = t[n].identities, h.card.timestamp = t[n].timestamp) : (t[n].avatar || (t[n].avatar = encodeURI(a + "/avatar/default?name=" + t[n].name)), 
        i[t[n].id] = t[n]));
        var r = {
          me: T(h.card),
          others: i
        }, s = JSON.stringify(r);
        v("Streaming pops: " + s, i), d && u !== s && (v("Callback"), d(r), u = s);
      } else v("Data error");
    }
  }, b = function() {
    v("Streaming is dead");
  }, x = function() {
    E(h.card) && ++l >= o && y();
  }, w = {
    prvLen: null,
    nxtIdx: null,
    timer: null,
    http: null,
    pop: null,
    dead: null,
    live: !1,
    init: function(e, t, i) {
      this.prvLen = 0, this.nxtIdx = 0, this.live = !0, this.pop = t, this.dead = i, this.http = new XMLHttpRequest(), 
      this.http.open("post", e), this.http.onreadystatechange = this.listen, this.http.send(), 
      this.timer = setInterval(this.listen, 1e3);
    },
    listen: function() {
      if (!(4 !== w.http.readyState && 3 !== w.http.readyState || 3 === w.http.readyState && 200 !== w.http.status || null === w.http.responseText)) {
        for (4 === w.http.readyState && 200 !== w.http.status && w.kill(); w.prvLen !== w.http.responseText.length && (4 !== w.http.readyState || w.prvLen !== w.http.responseText.length); ) {
          w.prvLen = w.http.responseText.length;
          var e = w.http.responseText.substring(w.nxtIdx), t = e.split("\n");
          w.nxtIdx += e.lastIndexOf("\n") + 1, "\n" === e[e.length - 1] && t[t.length] || t.pop(), 
          w.pop && w.pop(t);
        }
        4 === w.http.readyState && w.prvLen === w.http.responseText.length && w.kill();
      }
    },
    kill: function() {
      clearInterval(this.timer), this.http && this.http.abort(), this.dead && this.dead(), 
      this.live = !1;
    }
  }, k = function() {
    if (void 0 === window.DeviceMotionEvent) return null;
    var e = 50, t = 0, i = 0, n = 0, r = 0, a = 0, s = 0;
    window.addEventListener("devicemotion", function(e) {
      t = e.accelerationIncludingGravity.x, i = e.accelerationIncludingGravity.y, n = e.accelerationIncludingGravity.z;
    }, !1), setInterval(function() {
      var o = Math.abs(t - r + i - a + n - s);
      o > e && (m && m(), g && setTimeout(g, 1e3)), r = t, a = i, s = n;
    }, 100);
  }, C = function(e) {
    return e && e.external_username && e.provider ? !0 : !1;
  }, E = function(e) {
    if (e && e.name && e.identities && e.identities.length) {
      for (var t in e.identities) if (C(e.identities[t]) === !1) return !1;
      return !0;
    }
  }, T = function(e) {
    switch (Object.prototype.toString.call(e)) {
     case "[object Object]":
      var t = {};
      for (var i in e) t[i] = T(e[i]);
      break;

     case "[object Array]":
      t = [];
      for (i in e) t.push(T(e[i]));
      break;

     default:
      t = e;
    }
    return t;
  }, S = {
    init: function(e, t) {
      E(e) ? (w.kill(), h.card.name = e.name, h.card.avatar = e.avatar, h.card.bio = e.bio, 
      h.card.identities = T(e.identities), h.card.timestamp = p(), v("Set my card: " + JSON.stringify(h.card))) : v("Card error"), 
      t && (d = t, v("Set callback function")), l = o;
    },
    shake: function(e, t) {
      m = e, g = t;
    },
    startGeo: i,
    stopGeo: t
  };
  setInterval(x, 1e3), k(m, g);
  var M;
  return window.addEventListener("load", function() {
    setTimeout(function() {
      window.scrollTo(0, 0);
    }, 0);
  }), S;
}), define("mobilemiddleware", function(e, t, i) {
  "use strict";
  var n = function() {
    var e = document.getElementsByTagName("head")[0], t = document.getElementsByName("sms-token")[0], i = null;
    return t && (i = JSON.parse(t.content), e.removeChild(t)), i;
  }, r = navigator.userAgent.match(/iPhone/);
  i.exports = {
    setHtmlHeight: function(e, t, i) {
      setTimeout(function() {
        window.scrollTo(0, 0);
      }, 0), r || $("#app-main").addClass("app-box");
      var n = document.documentElement, a = window.innerHeight, s = e.app;
      a >= 444 ? a = 508 : 356 >= a && (a = 420), s.screen = {
        width: 320,
        height: a,
        ios: 420 >= a ? "iphone4" : ""
      }, n.style.minHeight = a + "px", i();
    },
    checkStorageSupported: function(e, t, i) {
      try {
        var n = window.localStorage;
        n && (n.setItem("storage", 0), n.removeItem("storage"));
      } catch (r) {
        alert("EXFE cannot be used in private browsing mode.");
      }
      i();
    },
    checkSMSToken: function(e, t, i) {
      var r = n();
      if (r) {
        var a = r.action;
        return e.resolveToken = r, "VERIFIED" === a ? t.redirect("/#verify") : "INPUT_NEW_PASSWORD" === a && t.redirect("/#set_password"), 
        void 0;
      }
      i();
    },
    cleanup: function(e, t, i) {
      delete e.smsToken, $("#app-body").css("height", "auto"), $("#app-header").addClass("hide"), 
      $("#app-footer").removeClass("ft-bg");
      var n = e.switchPageCallback;
      n ? n() : $("#app-body .page").addClass("hide"), delete e.switchPageCallback, i();
    },
    errorHandler: function(e, t) {
      e.error = {
        code: 404
      }, t.redirect("/");
    }
  };
}), define("mobilecontroller", function(e, t, i) {
  "use strict";
  var n = e("base"), r = e("store"), a = e("tween"), s = window._ENV_.api_url, o = e("handlebars"), l = e("util"), c = l.trim, d = l.parseId, u = navigator.userAgent.match(/iPad/), h = e("live"), p = function(e, t) {
    return e.replace(t ? /&/g : /&(?!#?\w+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }, f = Date.now || function() {
    return new Date().getTime();
  }, m = function() {
    window.location = "itms://itunes.apple.com/us/app/exfe/id514026604";
  }, g = function(e) {
    App.set("tryRedirectAt", f()), window.location = "exfe://crosses/" + (e || "");
  }, v = "webkitTransform" in document.body.style, y = function(e, t) {
    var i = 6 === t.length ? "" : "3d";
    e.style[v ? "webkitTransform" : "transform"] = "matrix" + i + "(" + t.join(",") + ")";
  }, _ = function() {
    var e = r.get("livecard");
    if (!e) {
      var t = {
        id: "",
        name: "",
        avatar: "",
        bio: "",
        identities: []
      };
      e = {
        card: t,
        latitude: "",
        longitude: "",
        accuracy: "",
        traits: []
      };
      var i = r.get("user");
      i && (t.name = i.name, t.avatar = i.avatar_filename, t.bio = i.bio, t.identities = i.identities), 
      r.set("livecard", e);
    }
    return e.card.id = "", e;
  }, b = [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ], x = [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 128, 28, 0, 1 ], w = [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 128, 0, 0, 1 ], k = 0, C = function() {
    return "Controller-" + k++;
  };
  t = i.exports = {};
  var E = n.extend({
    initialize: function(e) {
      this.cid = C(), this.initOptions(e), this.parseElement(), this.init(), E.caches[this.cid] = this;
    },
    parseElement: function() {
      var e = this.element, t = this.options.template;
      if (e ? this.element = e instanceof $ ? e : $(e) : t && (this.element = $(t)), !this.element) throw "element is invalid";
      this.element.attr("data-page-id", this.cid);
    },
    initOptions: function(e) {
      this.setOptions(e);
      for (var t in e) "options" !== t && (this[t] = e[t]);
    },
    init: function() {},
    destory: function() {
      this.element.off(), this._destory();
    },
    _destory: function() {
      delete E.caches[this.cid], E.superclass.destory.call(this);
    },
    $: function(e) {
      return this.element.find(e);
    }
  });
  E.caches = [], t.FooterController = E.extend({
    countDown: 5,
    element: $("#app-footer"),
    init: function() {
      this.listen();
    },
    enableTimer: !0,
    listen: function() {
      var e = this, t = e.element;
      t.on("click.footer", ".redirecting, .web-version", function() {
        window.location.href = "/?ipad" + location.hash;
      }).on("click.footer", ".get-button button", function() {
        m();
      }).on("keydown.footer", "#email", function(t) {
        if (13 === t.keyCode) {
          var i = e.$("#email").val();
          e.addNotificationIdentity(i);
        }
      }).on("click.footer", ".subscribe .btn_mail", function() {
        var t = c(e.$("#email").val());
        e.addNotificationIdentity(t);
      }), this.on("show", function(e, t, i, n) {
        var r = e.height - 96 - (t ? 60 : 0);
        this.element.removeClass("hide"), this.element.css({
          position: "relative",
          top: r + "px"
        }), this.enableTimer && this.emit("start-redirect"), u && this.$(".web-version").removeClass("hide"), 
        this.$(".error-info").toggleClass("hide", !n);
      }), this.on("reset-position", function() {
        var e = App.screen.height - 96;
        this.element.removeClass("hide"), this.element.css({
          position: "absolute",
          top: e + "px"
        }), u && this.$(".web-version").removeClass("hide");
      }), this.on("show-from-cross", function(e, t, i, n) {
        this.element.css({
          position: "relative",
          top: 0
        }), this.emit("stop-redirect"), this.element.addClass("ft-bg"), this.cross = {
          exfee_id: e,
          token: t
        }, this.$(".actions").addClass("action-cross"), this.$(".action").addClass("hide"), 
        i && this.$(".subscribe").removeClass("hide"), this.element.removeClass("hide"), 
        $("#app-footer").addClass("ft-bg"), n && this.enableTimer ? this.emit("start-redirect", n) : (this.$(".get-button").removeClass("hide"), 
        $(".redirect").addClass("hide")), u && this.$(".web-version").removeClass("hide");
      }), this.on("show-from-resolve-token", function() {
        this.emit("stop-redirect"), 1 > this.countDown ? ($(".redirecting").removeClass("hide"), 
        g()) : this.emit("start-redirect");
      }), this.on("start-redirect", function(t) {
        this.$(".get-button").addClass("hide");
        var i, n = $(".redirecting").removeClass("hide"), r = n.find(".sec"), a = e.countDown;
        r.text(i = a), this.App.set("redirectTimer", setInterval(function() {
          e.countDown = i -= 1, i >= 1 ? r.text(i) : (n.addClass("hide"), e.emit("stop-redirect"), 
          g(t));
        }, 1e3));
      }), this.on("stop-redirect", function() {
        this.enableTimer = !1, this.$(".get-button").removeClass("hide"), $(".redirecting").addClass("hide"), 
        this.App.set("redirectTimer", clearInterval(this.App.set("redirectTimer")));
      });
    },
    addNotificationIdentity: function(e, t, i) {
      t = this.cross.exfee_id, i = this.cross.token;
      var n = d(e);
      return n && "email" !== n.provider ? ($("#email.email").attr("placeholder", "Bad email Address."), 
      void 0) : ($.ajax({
        type: "POST",
        url: s + "/Exfee/" + t + "/AddNotificationIdentity" + "?token=" + i,
        data: {
          provider: n.provider,
          external_username: n.external_username
        },
        success: function(e) {
          e && e.meta && 200 === e.meta.code && $(".subscribe").hide();
        },
        error: function() {
          alert("Failed, please retry later.");
        }
      }), void 0);
    }
  }), t.VerifyController = E.extend({
    init: function() {
      this.render(), this.listen();
    },
    render: function() {
      $("#app-verify").length || this.element.appendTo($("#app-body"));
    },
    listen: function() {
      var e = this, t = this.resolveToken;
      this.on("show", function(i, n) {
        setTimeout(function() {
          window.scrollTo(0, 0);
        }, 14);
        var r = function() {
          i.error = !0, n.redirect("/");
        };
        this.element.removeClass("hide"), $("#app-body").css("height", "100%"), App.controllers.footer.emit("reset-position"), 
        $.ajax({
          type: "POST",
          url: s + "/Users/" + t.user_id + "?token=" + t.token,
          data: {
            token: t.token
          },
          success: function(i) {
            var n = i.meta;
            if (n && 200 === n.code) for (var a = i.response.user, s = a.identities, o = 0, l = s.length; l > o; ++o) {
              var c = s[o];
              if (c.id === t.identity_id) {
                e.showIdentity(c), e.$(".done-info").removeClass("hide"), App.controllers.footer.emit("show-from-resolve-token");
                break;
              }
            } else r();
          },
          error: function() {
            r();
          }
        });
      });
    },
    showIdentity: function(e) {
      var t = this.$(".identity");
      t.find(".name").text(e.name), t.find(".avatar").attr("src", e.avatar_filename);
    }
  }), t.SetPasswordController = E.extend({
    init: function() {
      this.render(), this.listen();
    },
    render: function() {
      $("#app-setpassword").length || this.element.appendTo($("#app-body"));
    },
    submitPassword: function() {
      var e = this, t = this.token, i = this.$(".set-button button"), n = this.$(".error-info"), r = this.$("#name"), a = this.$("#password"), o = a.val();
      o.length >= 4 ? (i.addClass("disabled").prop("disabled", !0), $.ajax({
        type: "POST",
        url: s + "/Users/ResetPassword",
        data: {
          token: t,
          name: name,
          password: o
        },
        success: function(t) {
          var s = t.meta;
          s && 200 === s.code ? (r.blur(), a.blur(), e.$(".done-info").removeClass("hide"), 
          n.html("").addClass("hide"), i.parent().addClass("hide"), App.controllers.footer.emit("show-from-resolve-token")) : i.removeClass("disabled").prop("disabled", !0), 
          i.removeClass("disabled").prop("disabled", !0);
        },
        error: function() {
          n.html("Failed to set password. Please try later.").removeClass("hide"), i.removeClass("disabled").prop("disabled", !1);
        }
      })) : n.html("Password must be longer than four!").removeClass("hide");
    },
    listen: function() {
      var e, t, i = this, n = this.element, r = this.resolveToken;
      n.on("touchstart.setpassword", ".pass", function() {
        t && (clearTimeout(t), t = void 0), e = f();
        var i = $(this).prev();
        i.prop("type", "password");
      }).on("touchend.setpassword", ".pass", function(i) {
        if (f() - e > 300) {
          var n = $(this).prev();
          n.prop("type", "text"), t = setTimeout(function() {
            n.prop("type", "password");
          }, 500);
        }
        return i.preventDefault(), i.stopPropagation(), !1;
      }).on("keydown.setpassword", "#password", function(e) {
        13 === e.keyCode ? i.submitPassword() : i.$(".error-info").html("");
      }).on("touchstart.setpassword", ".set-button button", function() {
        i.submitPassword();
      }), this.on("show", function(e, t) {
        setTimeout(function() {
          window.scrollTo(0, 0);
        }, 0);
        var i = function() {
          e.error = !0, t.redirect("/");
        };
        n.removeClass("hide"), $("#app-body").css("height", "100%"), $.ajax({
          type: "POST",
          url: s + "/Users/" + r.user_id + "?token=" + r.token,
          data: {
            token: r.token
          },
          success: function(e) {
            var t = e.response.user;
            return e && e.meta && 200 === e.meta.code ? ($(".identity .avatar").attr("src", t.avatar_filename), 
            $(".identity .name").html(t.name), void 0) : (i(), void 0);
          },
          error: function() {
            i();
          }
        }), App.controllers.footer.emit("reset-position");
      });
    }
  }), t.HomeController = E.extend({
    init: function() {
      this.render(), this.listen();
    },
    render: function() {
      $("#app-home").length || this.element.appendTo($("#app-body"));
    },
    listen: function() {
      var e = this, t = this.element;
      t.on("touchstart.home", "#home-card", function() {
        clearInterval(App.set("tryTimer")), App.set("tryTimer", void 0), e.stopAnimate(), 
        e.emit("goto-live");
      }), this.on("goto-live", function() {
        App.controllers.footer.emit("stop-redirect"), App.request.switchPageCallback = function() {
          t.addClass("hide");
        }, App.response.redirect("/#live");
      }), this.on("show", function(e, i) {
        var n = e.height;
        this.$(".logo-box .inner").css("top", (n - 300) / 2 + "px"), t.removeClass("hide"), 
        w[13] = (n - 64) / 2, this.setHomeCard(w), i = !(!i || 404 !== i.code);
        var r = this.$(".title");
        r.find(".normal").removeClass("hide"), i && setTimeout(function() {
          alert("Sorry. Your link is invalid or expired. Requested page was not found.");
        }, 14), this.$("#home-card").css("display", "none");
      });
    },
    setHomeCard: function(e) {
      var t = _(), i = t.card, n = i.name, r = i.avatar, a = this.$("#home-card");
      y(a[0], e), i && (n || r) ? (r || (r = n ? s + "/avatar/default?name=" + n : "/static/img/portrait_default.png"), 
      r = "url(" + r + ")") : r = "", a.find(".avatar").css("background-image", r);
    },
    aopts: {
      o: 1
    },
    createAnimate: function() {
      var e = this.aopts, t = document.getElementById("big-logo"), i = document.getElementById("home-card"), n = function() {
        t.style.opacity = e.o, i.style.opacity = 1 - e.o;
      };
      this._a = new a.Tween(e).delay(1377).to({
        o: 0
      }, 1377).easing(a.Easing.Cubic.InOut).onUpdate(n), this._b = new a.Tween(e).delay(1377).to({
        o: 1
      }, 1377).easing(a.Easing.Cubic.InOut).onUpdate(n);
    },
    startAnimate: function() {
      this._a || this._b || this.createAnimate(), this._a.chain(this._b), this._b.chain(this._a), 
      this._a.start();
    },
    stopAnimate: function() {
      var e = this.aopts, t = document.getElementById("big-logo"), i = document.getElementById("home-card");
      this._a.chain(), this._b.chain(), this._b.stop(), this._a.stop(), e.o = t.style.opacity = 1, 
      i.style.opacity = 0;
    }
  }), t.CrossController = E.extend({
    init: function() {
      this.render(), this.listen();
    },
    render: function() {
      $("#app-cross").length || this.element.appendTo($("#app-body")), $("#app-cross").removeClass("hide");
    },
    listen: function() {
      var e = this, t = this.element, i = this.token, n = this.cross, r = e.$(".rsvp_toolbar");
      t.on("touchstart.cross", ".portrait.me", function() {
        r.toggleClass("rsvp_toolbar_off", !r.hasClass("rsvp_toolbar_off"));
      }).on("touchstart.cross", ".changename", function() {
        var t = prompt("Change my display name:");
        t ? $.ajax({
          type: "POST",
          url: s + "/Identities/" + n.identity.id + "/Update" + "?token=" + i,
          data: {
            name: t
          },
          success: function(t) {
            t && t.meta && 200 === t.meta.code && e.$(".name_me").html(p(t.response.identity.name));
          },
          error: function() {
            alert("Failed, please retry later.");
          }
        }) : alert("Display name cannot be empty.");
      }).on("touchstart.cross", ".rsvp.accepted, .rsvp.unavailable", function() {
        var t = $(this).hasClass("accepted") ? "ACCEPTED" : "DECLINED";
        e.rsvp(t);
      }).on("touchstart.cross", ".inf_area .description", function() {
        var e = $(this), t = e.hasClass("clickable");
        if (t) {
          var i = e.hasClass("limit");
          e.toggleClass("limit", !i), e.find(".xbtn-more .rb").toggleClass("hidden", i), e.find(".xbtn-more .lt").toggleClass("hidden", !i);
        }
      }), this.on("show", function() {
        t.removeClass("hide");
        var e = this.$(".inf_area .description");
        e.height() > 130 && (e.addClass("limit clickable"), e.find(".xbtn-more").removeClass("hide"), 
        e.find(".xbtn-more .rb").removeClass("hidden"));
      });
    },
    rsvp: function(e) {
      var t = this.cross.identity.id, i = this.exfee_id, n = this.token, r = [ {
        rsvp_status: e,
        identity_id: t,
        by_identity_id: t
      } ];
      this.$(".rsvp_toolbar").addClass("rsvp_toolbar_off");
      var a = this.$(".portrait_rsvp_me").removeClass("accepted declined pending");
      switch (e) {
       case "ACCEPTED":
        a.addClass("accepted");
        break;

       case "DECLINED":
        a.addClass("declined");
        break;

       default:
        a.addClass("pending");
      }
      $.ajax({
        type: "post",
        url: s + "/Exfee/" + i + "/Rsvp?token=" + n,
        data: {
          rsvp: JSON.stringify(r)
        },
        success: function() {},
        error: function() {
          alert("RSVP failed!");
        }
      });
    }
  }), t.LiveController = E.extend({
    init: function() {
      this.render(), this.listen();
    },
    render: function() {
      $("#app-live").length ? this.element = $("#app-live") : this.element.appendTo($("#app-body"));
    },
    listen: function() {
      var e, t, i = this, n = this.element;
      n.on("touchstart.live", "#card-name", function(e) {
        e.stopPropagation(), setTimeout(function() {
          window.scrollTo(0, 0);
        }, 0), this.focus();
      }).on("touchend.live", ".live-form", function(e) {
        e.stopPropagation(), $(e.target).hasClass("live-form") && (n.find(".input-item").blur(), 
        App.response.redirect("/"));
      }).on("keydown.live", "#card-name", function(e) {
        var t = e.keyCode, n = c(this.value);
        n && 13 === t && i.addEmailOrPhone(this, n);
      }).on("blur.live", "#card-name", function() {
        var e = c(this.value);
        e ? i.addEmailOrPhone(this, e) : i.setCardName(this);
      }).on("keydown.live blur.live", "#add-identity", function(e) {
        var t = e.keyCode, n = c(this.value);
        (n && 13 === t || "blur" === e.type) && (i.addEmailOrPhone(this, n, !0), this.value = "");
      }).on("keydown.live blur.live", "#facebook-identity", function(e) {
        var t = e.keyCode, n = c(this.value);
        (n && 13 === t || "blur" === e.type) && (n += "@facebook", i.addFacebook(this, n) && $("#add-identity-facebook").addClass("hide"), 
        this.value = "");
      }).on("touchstart.live", ".list .input-item", function() {
        $(this).next().removeClass("hidden");
      }).on("blur.live", ".list .input-item", function() {
        $(this).next().addClass("hidden"), i.updateIdentityLi(this);
      }).on("touchstart.live", ".list .delete", function() {
        var e, t = $(this).prev()[0], n = c(t.value), r = t.getAttribute("data-provider"), a = "facebook" === r;
        a && (n += "@facebook"), e = d(n), $(this).parent().remove(), e && e.provider && i.removeIdentity(e), 
        a && i.emit("show-add-facebook");
      }).on("touchstart.live", ".btn-start", function() {
        var e = $(".list .input-item");
        e.each(function() {
          i.updateIdentityLi(this);
        });
        var t = document.getElementById("card-name");
        t.blur();
        var n = c(t.value);
        n ? i.liveCard.card.name = n : i.setCardName(t), setTimeout(function() {
          i.inspectFields() && (i.emit("post-card"), i.emit("live-gather"));
        }, 23);
      }).on("hold:live", ".live-gather .card .avatar", function() {
        var e = this, t = e.parentNode, i = $(t).data("card"), n = t.style.transform || t.style.webkitTransform, r = n.match(/([\-\d\.]+)/g).slice(1), a = document.getElementById("card-tip"), s = "";
        if (i && i.identities) {
          for (var o = 0, l = i.identities.length; l > o; ++o) {
            var c = i.identities[o], d = c.provider, u = c.external_username, h = "";
            "email" !== d && "phone" !== d && (d = d.substr(0, 1).toUpperCase() + d.substr(1), 
            h = '<span class="provider">' + d + "</span>"), s += '<li><span class="external-username' + (h ? "" : " normal") + '">' + u + "</span>" + h + "</li>";
          }
          a.querySelector("ul").innerHTML = s;
          var p = a.clientHeight, f = ~~r[12] - 68, m = ~~r[13] - (6 + p), g = 93;
          0 > f ? f = 10 : f + 200 >= 320 && (f = 110), (10 === f || 110 === f) && (g = ~~r[12] + 32 - 7 - f), 
          r[12] = f, r[13] = m - 5, r[14] = 7, y(a, r), a.querySelector(".ang").style.left = g + "px", 
          a.querySelector(".bio").innerText = i.bio, a.className = "card-tip";
        }
      }).on("touchstart.live", ".live-gather .card .avatar", function(i) {
        var n = $(this), r = 250, a = i.touches.length;
        t = f(), e && (clearTimeout(e), e = void 0), 1 === a && a >= 1 && (e = setTimeout(function() {
          n.trigger("hold:live");
        }, r));
      }).on("touchend.live", ".live-gather .card .avatar", function() {
        if (e && (clearTimeout(e), e = void 0), 250 > f() - t) {
          var i = $(this).parent();
          i.hasClass("card-me") || i.toggleClass("selected");
        }
        document.getElementById("card-tip").className = "card-tip hidden";
      }).on("touchstart.live", ".back", function() {
        i.$(".live-gather").addClass("hide"), App.response.redirect("/");
      }).on("touchstart.live", ".live-gather", function(e) {
        var t = e.target, i = $(".live-title h2"), n = i[0], r = i.hasClass("clicked");
        r && ($(".wave").css("opacity", 1), i.data("clicked", t === n || $.contains(n, t)).removeClass("clicked"), 
        $(".live-tip").addClass("live-tip-close"));
      }).on("touchstart.live", ".live-title h2", function() {
        var e = $(this), t = e.hasClass("clicked"), i = e.data("clicked");
        t || i || ($(this).addClass("clicked"), $(".wave").css("opacity", 0), $(".live-tip").removeClass("live-tip-close")), 
        e.data("clicked", !1);
      }).on("touchstart.live", ".btn-confirm", function() {
        i.postContacts();
      }), this.on("show-add-email", function() {
        this.$("#add-identity").removeClass("hide");
      }), this.on("show-add-facebook", function() {
        this.$('.list input[data-provider="facebook"]').length || this.$("#add-identity-facebook").removeClass("hide");
      }), this.on("show", function(e) {
        h.startGeo(), this.screen = e, $("#app-footer").addClass("hide"), this.element.removeClass("hide");
        var t = e.height;
        w[13] = (t - 64) / 2, y(this.$("#icard")[0], w), this.$(".live-form, .live-gahter").css("min-height", t), 
        this.$(".live-form").removeClass("hide"), this.$("#live-discover").css("opacity", 0), 
        this.$("#card-form").css({
          opacity: 0,
          "min-height": 100 * ((t - 100) / t) + "%"
        }), this.measurePositions(e.width, e.height - 10, 32, 32), this.MAPS = this._MAPS.slice(0), 
        this.$(".identities .list").empty(), this.liveCard = _(), this.updateMyCardForm(), 
        this.startAnimate();
      }), this.on("post-card", function() {
        this.postMyCard();
      }), this.on("disabled-live-btn", function(e) {
        this.$(".btn-start").toggleClass("disabled", e);
      }), this.on("live-gather", function() {
        this.$(".live-form").addClass("hide"), this.$(".live-gather").removeClass("hide"), 
        this.$(".wave").addClass("start"), this.$(".live-gather").find(".card").remove();
        var e = this.liveCard.card, t = this.genCard(e, this.coords[0][0], 0, 0, !0, this.screen.ios).appendTo(this.$(".live-gather"));
        this.updateCard(t[0], e), this._others && this.updateOthers();
      });
    },
    updateIdentityLi: function(e) {
      var t, i = e.getAttribute("data-external-username"), n = e.getAttribute("data-provider"), r = e.getAttribute("data-name"), a = "", s = c(e.value), o = !1, l = !1, u = !1;
      if (s) if ("facebook" === n && (s += "@facebook"), t = d(s), t && t.provider) {
        var h = this.findIdentity(t), p = t.provider === n && t.external_username === i;
        h && !p && (e.value = a), h || p || (u = !0, o = !0);
      } else l = !0, o = !0; else l = !0, o = !0;
      l && (e.setAttribute("data-name", a), e.setAttribute("data-external-username", a), 
      e.setAttribute("data-provider", a), setTimeout(function() {
        alert("Invalid contact.");
      }, 14)), u && (e.setAttribute("data-name", t.name), e.setAttribute("data-external-username", t.external_username), 
      e.setAttribute("data-provider", t.provider), e.value = t.external_username, $(e).prev().text(this.aliasProvider(t.provider)), 
      this.updateLiveCard(t, "+")), o && this.updateLiveCard({
        name: r,
        external_username: i,
        provider: n
      }, "-", !0), (o || u) && this.emit("post-card");
    },
    postContacts: function() {},
    inspectFields: function() {
      var e = this.liveCard.card;
      return e.name && e.identities.length;
    },
    updateCardName: function(e) {
      e.name && (this.liveCard.card.name = document.getElementById("card-name").value = e.name, 
      r.set("livecard", this.liveCard));
    },
    updateMe: function(e) {
      var t, i = document.getElementById("icard"), n = i.getAttribute("data-url");
      n !== e.avatar && (t = e.avatar, t || (t = e.name ? s + "/avatar/default?name=" + e.name : "/static/img/portrait_default.png"), 
      n !== t && (i.querySelector(".avatar").style.backgroundImage = "url(" + t + ")", 
      i.setAttribute("data-url", t)));
      var r = document.getElementById("card-bio");
      e.bio && (r.innerText = e.bio), r.className = e.bio ? "" : "hide";
    },
    postMyCard: function() {
      r.set("livecard", this.liveCard);
      var e = this.liveCard.card;
      e.name && e.identities.length && h.init(e, $.proxy(this.liveCallback, this));
    },
    state: 1,
    liveCallback: function(e) {
      var t = this.liveCard, i = e.me;
      1 === this.state && i && i.name && i.identities.length && (f() - i.timestamp > 6e4 && this.updateCardName(i), 
      this.updateMe(t.card = i), r.set("livecard", t)), this._others = e.others, this.updateOthers();
    },
    updateMyCardForm: function() {
      var e, t = this.liveCard, i = t.card, n = i.identities;
      if (n && (e = n.length)) {
        this.updateCardName(i), this.updateMe(i), this.postMyCard(), n = n.slice(0);
        for (var r, a; r = n.shift(); ) a = r.provider, ("email" === a || "phone" === a || "facebook" === a) && this.addIdentity(r, !0);
        this.emit("show-add-email"), this.emit("show-add-facebook");
      } else this.emit("disabled-live-btn", !0);
    },
    resetLiveCard: function() {
      this.emit("disabled-live-btn", !0), r.clear("livecard"), this.liveCard = _();
    },
    findIdentity: function(e) {
      var t = this.liveCard.card, i = t.identities, n = i.length;
      if (n) for (var r = 0; n > r; ++r) {
        var a = i[r];
        if (a.provider === e.provider && a.external_username === e.external_username) return !0;
      }
      return !1;
    },
    updateLiveCard: function(e, t, i) {
      var n = this.liveCard.card, a = n.identities;
      if ("+" === t) a.push(e); else {
        for (var s = 0, o = a.length; o > s; ++s) {
          var l = a[s];
          if (l.provider === e.provider && l.external_username === e.external_username) {
            a.splice(s, 1);
            break;
          }
        }
        i || 0 !== a.length || this.resetLiveCard();
      }
      r.set("livecard", this.liveCard);
    },
    setCardName: function(e) {
      var t = this.packedIdentities();
      if (t.length) {
        var i = t[0], n = "", r = i.external_username, a = i.provider;
        n = "phone" === a ? "Anonym_" + r.slice(r.length - 4) : r.split("@")[0], this.liveCard.card.name = e.value = n, 
        e.setAttribute("placeholder", "Name"), $(e).addClass("normal");
      }
    },
    addFacebook: function(e, t) {
      var i = d(t), n = i.provider;
      return n && "facebook" === n && !this.existsByIdentity(i) ? (this.addIdentity(i), 
      !0) : !1;
    },
    addEmailOrPhone: function(e, t, i) {
      i = !i;
      var n = d(t), r = n.provider;
      !r || "email" !== r && "phone" !== r || this.existsByIdentity(n) || (this.addIdentity(n), 
      i && this.setCardName(e)), i && (this.emit("show-add-email"), this.emit("show-add-facebook")), 
      this.emit("post-card");
    },
    aliasProvider: function(e) {
      return "email" === e ? e = "Email" : "phone" === e ? e = "Mobile" : "facebook" === e && (e = "Facebook"), 
      e;
    },
    genIdentity: function(e) {
      var t = o.compile($("#live-li-identity-tmpl").html()), i = e.provider;
      i = this.aliasProvider(i);
      var n = $(t({
        provider_alias: i,
        identity: e
      }));
      return n;
    },
    resetCard: function() {
      this.state = 0, this.$("#icard").removeAttr("data-url").find(".avatar").css("background", ""), 
      this.$("#card-name").attr("placeholder", "Your email or mobile no.").removeClass("normal").val(""), 
      this.$("#add-identity").addClass("hide"), this.$("#add-identity-facebook").addClass("hide");
    },
    removeIdentity: function(e) {
      var t = this.$(".identities .list li");
      0 === t.length ? (this.resetCard(), this.emit("disabled-live-btn", !0)) : "facebook" === e.provider && this.emit("show-add-facebook"), 
      this.updateLiveCard(e, "-"), this.emit("post-card");
    },
    addIdentity: function(e, t) {
      t = !t, this.state = 1;
      var i = this.$(".identities .list"), n = this.genIdentity(e);
      i.append(n), this.emit("disabled-live-btn", !1), t && (this.updateLiveCard(e, "+"), 
      this.emit("post-card"));
    },
    packedIdentities: function() {
      for (var e, t, i, n, r, a = this.$(".identities .list").find("input"), s = 0, o = a.length, l = []; o > s; ++s) e = a.eq(s), 
      t = e.attr("data-provider"), i = c(a.eq(s).val()), i && ("facebook" === t && (i += "@facebook"), 
      n = d(i), r = n.provider, !r || "email" !== r && "phone" !== r && "facebook" !== r || l.push(n));
      return l;
    },
    existsByIdentity: function(e) {
      var t, i = this.packedIdentities(), n = e.external_username, r = e.provider;
      if (0 === i.length) return !1;
      for (;t = i.shift(); ) if (t.external_username === n && t.provider === r) return !0;
      return !1;
    },
    coords: "".split(),
    _MAPS: [ [ 1, 0 ], [ 1, 1 ], [ 1, 2 ], [ 2, 0 ], [ 2, 1 ], [ 2, 2 ], [ 2, 3 ], [ 3, 0 ], [ 3, 1 ], [ 3, 2 ], [ 3, 3 ] ],
    MAPS: "".split(),
    measurePositions: function(e, t, i, n) {
      var r = this.coords;
      r[0] = [ [ .5 * e - i, .88 * t - n ] ], r[1] = Array(3), r[1][0] = [ .25 * e - 5 - i, .66 * t + 30 - n ], 
      r[1][1] = [ .5 * e - i, .66 * t - n ], r[1][2] = [ .75 * e + 5 - i, .66 * t + 30 - n ], 
      r[2] = Array(4), r[2][0] = [ .125 * e + 5 - i, .44 * t + 40 - n ], r[2][1] = [ .375 * e - i, .44 * t - n ], 
      r[2][2] = [ .625 * e - i, .44 * t - n ], r[2][3] = [ .875 * e - 5 - i, .44 * t + 40 - n ], 
      r[3] = Array(4), r[3][0] = [ .125 * e - i, .22 * t + 40 - n ], r[3][1] = [ .375 * e - i, .22 * t - n ], 
      r[3][2] = [ .625 * e - i, .22 * t - n ], r[3][3] = [ .875 * e - i, .22 * t + 40 - n ];
    },
    genCard: function(e, t, i, n, r, a) {
      var s = o.compile($("#live-card-tmpl").html()), l = b.slice(0);
      l[12] = t[0], l[13] = t[1];
      var c = $(s({
        g: i,
        i: n,
        matrix: l.join(","),
        "class": (r ? "card-me" : "card-other hide") + ("iphone4" === a ? " card-iphone4" : ""),
        card: e
      }));
      return c.data("card", e), c;
    },
    addCard: function(e) {
      var t = this.MAPS;
      if (!t || 0 === t.length) return !1;
      var i = t.shift(), n = i[0], r = i[1], s = this.coords[n][r], o = this.genCard(e, s, n, r, !1, this.screen.ios), l = o[0], c = l.style, d = b.slice(0);
      d[0] = d[5] = 0, d[12] = s[0], d[13] = s[1], o.data("card", e), this.$(".live-gather").append(o), 
      new a.Tween({
        o: 0
      }).to({
        o: 1
      }, 250).easing(a.Easing.Bounce.In).onStart(function() {
        y(l, d), o.removeClass("hide");
      }).onUpdate(function() {
        c.opacity = this.o, d[0] = d[5] = this.o, y(l, d);
      }).onComplete(function() {
        a.remove(this);
      }).start();
    },
    delCard: function(e) {
      var t = this.MAPS, i = e.getAttribute("data-g"), n = e.getAttribute("data-i"), r = b.slice(0), s = this.coords[i][n], o = e.style;
      r[12] = s[0], r[13] = s[1], new a.Tween({
        o: 1
      }).to({
        o: 0
      }, 250).easing(a.Easing.Bounce.Out).onUpdate(function() {
        o.opacity = this.o, y(e, r);
      }).onComplete(function() {
        t.unshift([ i, n ]), e.parentNode.removeChild(e), a.remove(this);
      }).start();
    },
    updateCard: function(e, t) {
      var i = e.getAttribute("data-url"), n = "";
      i && i === t.avatar || (n = t.avatar, n || (n = t.name ? s + "/avatar/default?name=" + t.name : "/static/img/portrait_default.png"), 
      i !== n && (e.querySelector(".avatar").style.backgroundImage = "url(" + n + ")", 
      e.setAttribute("data-url", n))), e.querySelector(".name").innerText = t.name, $(e).data("card", t);
    },
    updateOthers: function() {
      for (var e, t, i, n, r = this._others, a = document.querySelectorAll(".card-other"), s = a.length, o = 0; s > o; ++o) e = a[o], 
      t = e.getAttribute("id"), t in r || this.delCard(e);
      for (i in r) n = r[i], e = document.getElementById(n.id), e ? this.updateCard(e, n) : this.addCard(n);
    },
    createAnimate: function() {
      var e = this.$("#icard")[0], t = this.$("#card-form")[0], i = this.$("#live-discover")[0], n = w[13], r = x[13], s = w.slice(0);
      this.a = new a.Tween({
        o: 0
      }).to({
        o: 1
      }, 500).easing(a.Easing.Cubic.In).onUpdate(function() {
        i.style.opacity = this.o, s[13] = (n - r) * (1 - this.o) + r, y(e, s);
      }), this.b = new a.Tween({
        o: 0
      }).delay(250).to({
        o: 1
      }, 500).onUpdate(function() {
        t.style.opacity = this.o;
      });
    },
    startAnimate: function() {
      this.a || this.b || this.createAnimate(), this.a.start(), this.b.start();
    },
    stopAnimate: function() {
      this.a.stop(), this.b.stop();
    }
  });
}), define("mobileroutes", function(e, t, i) {
  "use strict";
  var n = e("store"), r = e("handlebars"), a = e("humantime"), s = window._ENV_, o = function(e) {
    var t = a.printEFTime(e, "X");
    return t;
  }, l = e("mobilecontroller"), c = l.HomeController, d = l.SetPasswordController, u = l.VerifyController, h = l.CrossController, p = l.LiveController, f = function(e, t, i, a, l, c) {
    a || (a = {}), $.ajax({
      type: "POST",
      url: s.api_url + "/Crosses/GetCrossByInvitationToken",
      data: i,
      success: function(i) {
        var s = i.meta, d = s && s.code;
        if (d && 200 === d) {
          var u = i.response, p = u.cross, f = {
            id: p.id,
            title: p.title,
            description: p.description.replace(/\r\n|\r|\n/g, "<br />"),
            time: {
              title: "Sometime",
              content: "To be decided"
            },
            place: {
              title: "Somewhere",
              description: "To be decided"
            },
            background: "default.jpg",
            read_only: !!u.read_only
          }, m = p.time;
          m && m.begin_at && m.begin_at.timezone ? f.time = o(m) : f.time.tobe = "tobe";
          var g = p.place;
          g && g.title && (f.place = {
            title: g.title,
            description: g.description.replace(/\r\n|\r|\n/g, "<br />")
          });
          var v = g.lat, y = g.lng;
          if (v && y) {
            var _ = window.devicePixelRatio >= 2 ? 2 : 1;
            f.place.map = "https://maps.googleapis.com/maps/api/staticmap?center=" + v + "," + y + "&markers=icon%3a" + encodeURIComponent("http://img.exfe.com/web/map_pin_blue.png") + "%7C" + v + "," + y + "&zoom=13&size=290x100&maptype=road&sensor=false&scale=" + _, 
            f.place.href = "http://maps.google.com/maps?daddr=" + encodeURIComponent(f.place.title) + "@" + v + "," + y;
          } else f.place.tobe = "tobe";
          var b, x = p.widget;
          if (x && (b = x.length)) for (var w = 0; b > w; ++w) if ("Background" === x[w].type) {
            f.background = x[w].image;
            break;
          }
          var k = 0, C = 0, E = u.authorization;
          E ? (k = E.user_id, u.browsing_identity && (C = u.browsing_identity.id)) : u.browsing_identity && u.browsing_identity.connected_user_id && (k = u.browsing_identity.connected_user_id, 
          C = u.browsing_identity.id), u.cross_access_token && (c = a[l] = u.cross_access_token, 
          n.set("cats", a));
          for (var T = p.exfee.invitations, S = [], M = {
            ACCEPTED: [],
            INTERESTED: [],
            NORESPONSE: [],
            IGNORED: [],
            DECLINED: []
          }, I = 0, N = T.length; N > I; ++I) {
            var A = T[I], P = "pending", D = A.rsvp_status;
            "ACCEPTED" === D ? P = "accepted" : "DECLINED" === D && (P = "declined"), A.rsvp_style = P, 
            k && k === A.identity.connected_user_id || C === A.identity.id ? (A.is_me = !0, 
            C = A.identity.id, C !== A.invited_by.id && (f.inviter = A.invited_by), A.identity.isphone = "phone" === A.identity.provider, 
            f.identity = A.identity, M.ACCEPTED.unshift(A)) : A.rsvp_status in M && M[A.rsvp_status].push(A);
          }
          S = [].concat(M.ACCEPTED, M.INTERESTED, M.NORESPONSE, M.IGNORED, M.DECLINED), f.invitations = [], 
          N = S.length;
          for (var O = 0; N > O; ) f.invitations.push(S.splice(0, 5)), O += 5;
          N = f.invitations.length;
          var z = f.invitations[N - 1], L = z.length;
          if (L && 5 > L) for (;5 - L++; ) z.push(void 0);
          var H = "";
          k && (E ? (H = f.id + "?user_id=" + k + "&token=" + E.token + "&identity_id=" + C, 
          c = E.token, n.set("authorization", E)) : (E = n.get("authorization"), E && E.user_id === k && (H = f.id + "?user_id=" + k + "&token=" + E.token + "&identity_id=" + C, 
          c = E.token)));
          var R = e.app, j = R.controllers, F = j.cross;
          F && F.destory();
          var q = r.compile($("#cross-tmpl").html());
          F = R.controllers.cross = new h({
            options: {
              template: q(f)
            },
            cross: f,
            exfee_id: p.exfee.id,
            token: c
          }), F.emit("show"), R.controllers.footer.emit("show-from-cross", p.exfee.id, c, f.identity.isphone, H);
        } else e.error = {
          code: 404
        }, t.redirect("/");
      },
      error: function() {
        e.error = {
          code: 404
        }, t.redirect("/");
      }
    });
  };
  i.exports = {
    index: function(e) {
      var t = e.error, i = e.app, n = i.controllers, r = n.home, a = n.footer, s = i.screen;
      r || (r = i.controllers.home = new c({
        options: {
          template: $("#home-tmpl").html()
        }
      })), document.title = "EXFE - The group utility for gathering.", r.emit("show", s, t), 
      a.emit("show", s, !1, !1, t === !0), delete e.error, i.currPageName = "HOME";
    },
    verify: function(e, t) {
      var i = e.session, n = i.resolveToken, r = e.app;
      if (n) {
        $("#app-header").removeClass("hide");
        var a = new u({
          options: {
            template: $("#verify-tmpl").html()
          },
          resolveToken: n
        });
        a.emit("show", e, t);
      } else e.error = !0, t.redirect("/");
      r.currPageName = "VERIFY";
    },
    setPassword: function(e, t) {
      var i = e.session, n = i.resolveToken, r = e.app;
      if (n) {
        $("#app-header").removeClass("hide");
        var a = new d({
          options: {
            template: $("#setpassword-tmpl").html()
          },
          resolveToken: n,
          token: n.origin_token
        });
        a.emit("show", e, t);
      } else e.error = !0, t.redirect("/");
      r.currPageName = "SET_PASSWORD";
    },
    resolveToken: function(e, t) {
      var i = e.app, n = e.params[0], r = function(e, t) {
        e.error = {
          code: 404
        }, t.redirect("/");
      };
      n ? $.ajax({
        type: "POST",
        url: s.api_url + "/Users/ResolveToken",
        data: {
          token: n
        },
        success: function(i) {
          if (i && i.meta && 200 === i.meta.code) {
            var a = e.session;
            a.resolveToken = i.response;
            var s = a.resolveToken.action;
            "VERIFIED" === s ? t.redirect("/#verify") : "INPUT_NEW_PASSWORD" === s && (a.resolveToken.origin_token = n, 
            t.redirect("/#set_password"));
          } else r(e, t);
        },
        error: function() {
          r(e, t);
        }
      }) : r(e, t), i.currPageName = "RESOLVE_TOKEN";
    },
    crossPhoneToken: function(e, t) {
      var i, r, a = e.app, s = e.params, o = s[0], l = s[1], c = n.get("cats");
      i = {
        invitation_token: l,
        cross_id: o
      }, c && (r = c[l]) && (i.cross_access_token = r), f(e, t, i, c, l, r), a.currPageName = "CROSS";
    },
    crossToken: function(e, t) {
      var i, r = e.app, a = e.params[0], s = n.get("cats"), o = {
        invitation_token: a
      };
      s && (i = s[a]) && (o.cross_access_token = i), f(e, t, o, s, a, i), r.currPageName = "CROSS";
    },
    live: function(e) {
      var t = e.app, i = t.controllers, n = i.live;
      n && n.destory(), n = t.controllers.live = new p({
        options: {
          template: $("#live-tmpl").html()
        }
      }), n.emit("show", t.screen, t.ios), t.currPageName = "LIVE";
    }
  };
}), define(function(e) {
  "use strict";
  var t = e("zepto"), i = e("tween"), n = e("af"), r = n.request, a = e("mobilemiddleware"), s = e("mobilecontroller").FooterController, o = e("mobileroutes"), l = Date.now || function() {
    return new Date().getTime();
  }, c = l(), d = function(e) {
    App.set("tryRedirectAt", l()), window.location = "exfe://crosses/" + (e || "");
  }, u = e("lightsaber"), h = window.App = u();
  h.use(a.setHtmlHeight), h.use(a.cleanup), h.initRouter(), h.use(a.errorHandler), 
  h.controllers = {}, h.controllers.footer = new s({
    App: h
  }), h.get(/^\/+(?:\?)?#{0,}$/, o.index), h.get(/^\/+(?:\?)?#live\/?$/, o.live), 
  h.get(/^\/+\?t=([a-zA-Z0-9]{3,})$/, function(e, t) {
    var i = function() {
      var e, t = document.getElementsByTagName("head")[0], i = document.getElementsByName("sms-token")[0];
      return i && (e = JSON.parse(i.content), t.removeChild(i)), e;
    }, n = i();
    if (n) {
      var r = n.action;
      e.session.resolveToken = n, "VERIFIED" === r ? t.redirect("/#verify") : "INPUT_NEW_PASSWORD" === r && t.redirect("/#set_password");
    } else e.error = {
      code: 404
    }, e.redirect("/");
  }), h.get(/^\/+(?:\?)?#verify\/?$/, o.verify), h.get(/^\/+(?:\?)?#set_password\/?$/, o.setPassword), 
  h.get(/^\/+(?:\?)?#token=([a-zA-Z0-9]{64})\/?$/, o.resolveToken), h.get(/^\/+(?:\?)?#!([1-9][0-9]*)\/([a-zA-Z0-9]{4})\/?$/, o.crossPhoneToken), 
  h.get(/^\/+(?:\?)?#!token=([a-zA-Z0-9]{32})\/?$/, o.crossToken), h.set("tryRedirectAt", 0), 
  h.on("launched", function() {
    function e() {
      r(e), i.update();
    }
    var n = this, a = setInterval(function() {
      var e = l(), i = n.set("tryRedirectAt");
      i && (e - c > 1500 && 1500 > Math.abs(i - c) ? (clearInterval(a), t(".get-button button").html('Open <span class="exfe">EXFE</span> app').removeClass("hide"), 
      t("#app-footer").off("click.footer", ".get-button button").on("click.footer", ".get-button button", function() {
        d();
      })) : 2e3 > e - i && (t(".get-button").removeClass("hide"), t(".redirecting").addClass("hide"))), 
      c = e;
    }, 500);
    h.set("tryTimer", a), e();
  }), h.run();
});