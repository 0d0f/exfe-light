/*! EXFE.COM QXdlc29tZSEgV2UncmUgaHVudGluZyB0YWxlbnRzIGxpa2UgeW91LiBQbGVhc2UgZHJvcCB1cyB5b3VyIENWIHRvIHdvcmtAZXhmZS5jb20uCg== */
/*! mobile@2a.4 2013-06-06 09:06:34 */
(function(t) {
  "use strict";
  function e(t, e, i) {
    var a = arguments.length;
    1 === a ? (i = t, t = void 0) : 2 === a && (i = e, e = void 0);
    var o = new r(t, e, i);
    t ? s[t] = o : i.call(o, n, o.exports, o);
  }
  function n(t) {
    var e = s[t];
    return e ? (e.exports || i(e), e.exports) : null;
  }
  function i(t) {
    var e, i = t.factory;
    delete t.factory, e = i(n, t.exports = {}, t), e && (t.exports = e);
  }
  function r(t, e, n) {
    this.id = t, this.uri = void 0, this.deps = e, "string" == typeof n && (n = Function("require", "exports", "module", n)), 
    this.factory = n, this.exports = void 0, this.filename = null, this.parent = void 0, 
    this.loaded = !1;
  }
  e.amd = {
    jQuery: !0
  }, t.define = e, r.prototype.constructor = r;
  var s = r.__cache = {};
})(this), define("class", function() {
  "use strict";
  function t(n) {
    return this instanceof t || !a(n) ? void 0 : e(n);
  }
  function e(e) {
    return e.extend = t.extend, e.implement = r, e;
  }
  function n(n, i, r, a, c) {
    function u() {
      n.apply(this, arguments), this.constructor === u && this.initialize && (this.initialize.apply(this, arguments), 
      this.initialized = !0);
    }
    return a = n.prototype, n !== t && s(u, n), u.Extends = n, c = o(a), i && s(c, i), 
    u.prototype = c, r && s(u, r), u.superclass = a, u.prototype.constructor = u, e(u);
  }
  function i() {}
  function r(t) {
    var e, n = this.prototype;
    for (e in t) n[e] = t[e];
  }
  function s(t, e) {
    var n;
    for (n in e) t[n] = e[n];
  }
  function a(t) {
    return "[object Function]" === c.call(t);
  }
  t.create = function(e, i) {
    return a(e) || (i = e, e = null), i || (i = {}), e || (e = i.Extends || t), n(e, i);
  }, t.extend = function(t, e) {
    return n(this, t, e);
  };
  var o = Object.__proto__ ? function(t) {
    return {
      __proto__: t
    };
  } : function(t) {
    return i.prototype = t, new i();
  }, c = Object.prototype.toString;
  return t;
}), define("emitter", function() {
  "use strict";
  function t() {}
  var e = /\s+/, n = Object.keys;
  return n || (n = function(t) {
    var e, n = [];
    for (e in t) t.hasOwnProperty(e) && (n[n.length] = e);
    return n;
  }), t.prototype.on = function(t, n, i) {
    var r, s, a;
    if (!n) return this;
    for (t = t.split(e), r = this.__callbacks || (this.__callbacks = {}); s = t.shift(); ) a = r[s] || (r[s] = []), 
    n.__context = i, a[a.length] = n;
    return this;
  }, t.prototype.once = function(t, n, i) {
    var r, s, a;
    if (!n) return this;
    for (t = t.split(e), r = this.__callbacks || (this.__callbacks = {}); s = t.shift(); ) a = r[s] || (r[s] = []), 
    n.__once = !0, n.__context = i, a[a.length] = n;
    return this;
  }, t.prototype.off = function(t, i, r) {
    var s, a, o, c, u;
    if (!(s = this.__callbacks)) return this;
    if (!(t || i || r)) return delete this.__callbacks, this;
    for (t = t.split(e) || n(s); a = t.shift(); ) if (o = s[a]) if (i || r) for (c = o.length - 1; c; --c) u = o[c], 
    i && u !== i || r && u.__context !== r || o.splice(c, 1); else delete s[a];
    return this;
  }, t.prototype.emit = function(t) {
    var n, i, r, s, a, o, c, u, l = [];
    if (!(n = this.__callbacks)) return this;
    for (t = t.split(e), a = arguments.length - 1; a; --a) l[a - 1] = arguments[a];
    for ((r = n.call) && (c = [ 0 ].concat(l)); i = t.shift(); ) {
      if (s = n[i]) for (a = 0, o = s.length; o > a; ++a) u = s[a], u.apply(u.__context || this, l), 
      u.__once && (s.splice(a--, 1), o--);
      if (s && r) for (c[0] = i, a = 0, o = r.length; o > a; ++a) u = r[a], u.apply(u.__context || this, c);
    }
    return this;
  }, t;
}), define("base", function(t) {
  "use strict";
  function e(t) {
    return "[object Function]" === o.call(t);
  }
  function n(t) {
    return t && "[object Object]" === o.call(t) && "isPrototypeOf" in t;
  }
  function i(t, e) {
    var r, s;
    for (r in e) s = e[r], c(s) ? s = s.slice() : n(s) && (s = i(t[r] || {}, s)), t[r] = s;
    return t;
  }
  function r(t) {
    return t[2].toLowerCase() + t.substring(3);
  }
  var s = /^on[A-Z]/, a = Object.__proto__, o = Object.prototype.toString, c = Array.isArray;
  c || (c = function(t) {
    return "[object Array]" === o.call(t);
  });
  var u = t("class"), l = t("emitter");
  return u.create(l, {
    setOptions: function(t) {
      var n, a, o;
      if (this.hasOwnProperty("options") || (this.options = {}), o = this.options, this.constructor.superclass.options && i(o, this.constructor.superclass.options), 
      this.constructor.prototype.options && i(o, this.constructor.prototype.options), 
      t && t.options && i(o, t.options), this.on) for (n in o) a = o[n], e(a) && s.test(n) && (this.on(r(n), a), 
      delete o[n]);
    },
    destory: function() {
      var t;
      for (t in this) this.hasOwnProperty(t) && delete this[t];
      a && (this.__proto__ = a);
    }
  });
});

var Zepto = function() {
  function t(t) {
    return null == t ? t + "" : J[G.call(t)] || "object";
  }
  function e(e) {
    return "function" == t(e);
  }
  function n(t) {
    return null != t && t == t.window;
  }
  function i(t) {
    return null != t && t.nodeType == t.DOCUMENT_NODE;
  }
  function r(e) {
    return "object" == t(e);
  }
  function s(t) {
    return r(t) && !n(t) && t.__proto__ == Object.prototype;
  }
  function a(t) {
    return t instanceof Array;
  }
  function o(t) {
    return "number" == typeof t.length;
  }
  function c(t) {
    return P.call(t, function(t) {
      return null != t;
    });
  }
  function u(t) {
    return t.length > 0 ? E.fn.concat.apply([], t) : t;
  }
  function l(t) {
    return t.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase();
  }
  function h(t) {
    return t in O ? O[t] : O[t] = RegExp("(^|\\s)" + t + "(\\s|$)");
  }
  function p(t, e) {
    return "number" != typeof e || H[l(t)] ? e : e + "px";
  }
  function d(t) {
    var e, n;
    return I[t] || (e = A.createElement(t), A.body.appendChild(e), n = M(e, "").getPropertyValue("display"), 
    e.parentNode.removeChild(e), "none" == n && (n = "block"), I[t] = n), I[t];
  }
  function f(t) {
    return "children" in t ? N.call(t.children) : E.map(t.childNodes, function(t) {
      return 1 == t.nodeType ? t : x;
    });
  }
  function m(t, e, n) {
    for (_ in e) n && (s(e[_]) || a(e[_])) ? (s(e[_]) && !s(t[_]) && (t[_] = {}), a(e[_]) && !a(t[_]) && (t[_] = []), 
    m(t[_], e[_], n)) : e[_] !== x && (t[_] = e[_]);
  }
  function v(t, e) {
    return e === x ? E(t) : E(t).filter(e);
  }
  function g(t, n, i, r) {
    return e(n) ? n.call(t, i, r) : n;
  }
  function y(t, e, n) {
    null == n ? t.removeAttribute(e) : t.setAttribute(e, n);
  }
  function b(t, e) {
    var n = t.className, i = n && n.baseVal !== x;
    return e === x ? i ? n.baseVal : n : (i ? n.baseVal = e : t.className = e, x);
  }
  function w(t) {
    var e;
    try {
      return t ? "true" == t || ("false" == t ? !1 : "null" == t ? null : isNaN(e = Number(t)) ? /^[\[\{]/.test(t) ? E.parseJSON(t) : t : e) : t;
    } catch (n) {
      return t;
    }
  }
  function k(t, e) {
    e(t);
    for (var n in t.childNodes) k(t.childNodes[n], e);
  }
  var x, _, E, C, S, T, $ = [], N = $.slice, P = $.filter, A = window.document, I = {}, O = {}, M = A.defaultView.getComputedStyle, H = {
    "column-count": 1,
    columns: 1,
    "font-weight": 1,
    "line-height": 1,
    opacity: 1,
    "z-index": 1,
    zoom: 1
  }, D = /^\s*<(\w+|!)[^>]*>/, j = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, L = /^(?:body|html)$/i, R = [ "val", "css", "html", "text", "data", "width", "height", "offset" ], F = [ "after", "prepend", "before", "append" ], z = A.createElement("table"), B = A.createElement("tr"), q = {
    tr: A.createElement("tbody"),
    tbody: z,
    thead: z,
    tfoot: z,
    td: B,
    th: B,
    "*": A.createElement("div")
  }, U = /complete|loaded|interactive/, V = /^\.([\w-]+)$/, W = /^#([\w-]*)$/, Z = /^[\w-]+$/, J = {}, G = J.toString, Y = {}, X = A.createElement("div");
  return Y.matches = function(t, e) {
    if (!t || 1 !== t.nodeType) return !1;
    var n = t.webkitMatchesSelector || t.mozMatchesSelector || t.oMatchesSelector || t.matchesSelector;
    if (n) return n.call(t, e);
    var i, r = t.parentNode, s = !r;
    return s && (r = X).appendChild(t), i = ~Y.qsa(r, e).indexOf(t), s && X.removeChild(t), 
    i;
  }, S = function(t) {
    return t.replace(/-+(.)?/g, function(t, e) {
      return e ? e.toUpperCase() : "";
    });
  }, T = function(t) {
    return P.call(t, function(e, n) {
      return t.indexOf(e) == n;
    });
  }, Y.fragment = function(t, e, n) {
    t.replace && (t = t.replace(j, "<$1></$2>")), e === x && (e = D.test(t) && RegExp.$1), 
    e in q || (e = "*");
    var i, r, a = q[e];
    return a.innerHTML = "" + t, r = E.each(N.call(a.childNodes), function() {
      a.removeChild(this);
    }), s(n) && (i = E(r), E.each(n, function(t, e) {
      R.indexOf(t) > -1 ? i[t](e) : i.attr(t, e);
    })), r;
  }, Y.Z = function(t, e) {
    return t = t || [], t.__proto__ = E.fn, t.selector = e || "", t;
  }, Y.isZ = function(t) {
    return t instanceof Y.Z;
  }, Y.init = function(t, n) {
    if (t) {
      if (e(t)) return E(A).ready(t);
      if (Y.isZ(t)) return t;
      var i;
      if (a(t)) i = c(t); else if (r(t)) i = [ s(t) ? E.extend({}, t) : t ], t = null; else if (D.test(t)) i = Y.fragment(t.trim(), RegExp.$1, n), 
      t = null; else {
        if (n !== x) return E(n).find(t);
        i = Y.qsa(A, t);
      }
      return Y.Z(i, t);
    }
    return Y.Z();
  }, E = function(t, e) {
    return Y.init(t, e);
  }, E.extend = function(t) {
    var e, n = N.call(arguments, 1);
    return "boolean" == typeof t && (e = t, t = n.shift()), n.forEach(function(n) {
      m(t, n, e);
    }), t;
  }, Y.qsa = function(t, e) {
    var n;
    return i(t) && W.test(e) ? (n = t.getElementById(RegExp.$1)) ? [ n ] : [] : 1 !== t.nodeType && 9 !== t.nodeType ? [] : N.call(V.test(e) ? t.getElementsByClassName(RegExp.$1) : Z.test(e) ? t.getElementsByTagName(e) : t.querySelectorAll(e));
  }, E.contains = function(t, e) {
    return t !== e && t.contains(e);
  }, E.type = t, E.isFunction = e, E.isWindow = n, E.isArray = a, E.isPlainObject = s, 
  E.isEmptyObject = function(t) {
    var e;
    for (e in t) return !1;
    return !0;
  }, E.inArray = function(t, e, n) {
    return $.indexOf.call(e, t, n);
  }, E.camelCase = S, E.trim = function(t) {
    return t.trim();
  }, E.uuid = 0, E.support = {}, E.expr = {}, E.map = function(t, e) {
    var n, i, r, s = [];
    if (o(t)) for (i = 0; t.length > i; i++) n = e(t[i], i), null != n && s.push(n); else for (r in t) n = e(t[r], r), 
    null != n && s.push(n);
    return u(s);
  }, E.each = function(t, e) {
    var n, i;
    if (o(t)) {
      for (n = 0; t.length > n; n++) if (e.call(t[n], n, t[n]) === !1) return t;
    } else for (i in t) if (e.call(t[i], i, t[i]) === !1) return t;
    return t;
  }, E.grep = function(t, e) {
    return P.call(t, e);
  }, window.JSON && (E.parseJSON = JSON.parse), E.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(t, e) {
    J["[object " + e + "]"] = e.toLowerCase();
  }), E.fn = {
    forEach: $.forEach,
    reduce: $.reduce,
    push: $.push,
    sort: $.sort,
    indexOf: $.indexOf,
    concat: $.concat,
    map: function(t) {
      return E(E.map(this, function(e, n) {
        return t.call(e, n, e);
      }));
    },
    slice: function() {
      return E(N.apply(this, arguments));
    },
    ready: function(t) {
      return U.test(A.readyState) ? t(E) : A.addEventListener("DOMContentLoaded", function() {
        t(E);
      }, !1), this;
    },
    get: function(t) {
      return t === x ? N.call(this) : this[t >= 0 ? t : t + this.length];
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
    each: function(t) {
      return $.every.call(this, function(e, n) {
        return t.call(e, n, e) !== !1;
      }), this;
    },
    filter: function(t) {
      return e(t) ? this.not(this.not(t)) : E(P.call(this, function(e) {
        return Y.matches(e, t);
      }));
    },
    add: function(t, e) {
      return E(T(this.concat(E(t, e))));
    },
    is: function(t) {
      return this.length > 0 && Y.matches(this[0], t);
    },
    not: function(t) {
      var n = [];
      if (e(t) && t.call !== x) this.each(function(e) {
        t.call(this, e) || n.push(this);
      }); else {
        var i = "string" == typeof t ? this.filter(t) : o(t) && e(t.item) ? N.call(t) : E(t);
        this.forEach(function(t) {
          0 > i.indexOf(t) && n.push(t);
        });
      }
      return E(n);
    },
    has: function(t) {
      return this.filter(function() {
        return r(t) ? E.contains(this, t) : E(this).find(t).size();
      });
    },
    eq: function(t) {
      return -1 === t ? this.slice(t) : this.slice(t, +t + 1);
    },
    first: function() {
      var t = this[0];
      return t && !r(t) ? t : E(t);
    },
    last: function() {
      var t = this[this.length - 1];
      return t && !r(t) ? t : E(t);
    },
    find: function(t) {
      var e, n = this;
      return e = "object" == typeof t ? E(t).filter(function() {
        var t = this;
        return $.some.call(n, function(e) {
          return E.contains(e, t);
        });
      }) : 1 == this.length ? E(Y.qsa(this[0], t)) : this.map(function() {
        return Y.qsa(this, t);
      });
    },
    closest: function(t, e) {
      var n = this[0], r = !1;
      for ("object" == typeof t && (r = E(t)); n && !(r ? r.indexOf(n) >= 0 : Y.matches(n, t)); ) n = n !== e && !i(n) && n.parentNode;
      return E(n);
    },
    parents: function(t) {
      for (var e = [], n = this; n.length > 0; ) n = E.map(n, function(t) {
        return (t = t.parentNode) && !i(t) && 0 > e.indexOf(t) ? (e.push(t), t) : x;
      });
      return v(e, t);
    },
    parent: function(t) {
      return v(T(this.pluck("parentNode")), t);
    },
    children: function(t) {
      return v(this.map(function() {
        return f(this);
      }), t);
    },
    contents: function() {
      return this.map(function() {
        return N.call(this.childNodes);
      });
    },
    siblings: function(t) {
      return v(this.map(function(t, e) {
        return P.call(f(e.parentNode), function(t) {
          return t !== e;
        });
      }), t);
    },
    empty: function() {
      return this.each(function() {
        this.innerHTML = "";
      });
    },
    pluck: function(t) {
      return E.map(this, function(e) {
        return e[t];
      });
    },
    show: function() {
      return this.each(function() {
        "none" == this.style.display && (this.style.display = null), "none" == M(this, "").getPropertyValue("display") && (this.style.display = d(this.nodeName));
      });
    },
    replaceWith: function(t) {
      return this.before(t).remove();
    },
    wrap: function(t) {
      var n = e(t);
      if (this[0] && !n) var i = E(t).get(0), r = i.parentNode || this.length > 1;
      return this.each(function(e) {
        E(this).wrapAll(n ? t.call(this, e) : r ? i.cloneNode(!0) : i);
      });
    },
    wrapAll: function(t) {
      if (this[0]) {
        E(this[0]).before(t = E(t));
        for (var e; (e = t.children()).length; ) t = e.first();
        E(t).append(this);
      }
      return this;
    },
    wrapInner: function(t) {
      var n = e(t);
      return this.each(function(e) {
        var i = E(this), r = i.contents(), s = n ? t.call(this, e) : t;
        r.length ? r.wrapAll(s) : i.append(s);
      });
    },
    unwrap: function() {
      return this.parent().each(function() {
        E(this).replaceWith(E(this).children());
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
    toggle: function(t) {
      return this.each(function() {
        var e = E(this);
        (t === x ? "none" == e.css("display") : t) ? e.show() : e.hide();
      });
    },
    prev: function(t) {
      return E(this.pluck("previousElementSibling")).filter(t || "*");
    },
    next: function(t) {
      return E(this.pluck("nextElementSibling")).filter(t || "*");
    },
    html: function(t) {
      return t === x ? this.length > 0 ? this[0].innerHTML : null : this.each(function(e) {
        var n = this.innerHTML;
        E(this).empty().append(g(this, t, e, n));
      });
    },
    text: function(t) {
      return t === x ? this.length > 0 ? this[0].textContent : null : this.each(function() {
        this.textContent = t;
      });
    },
    attr: function(t, e) {
      var n;
      return "string" == typeof t && e === x ? 0 == this.length || 1 !== this[0].nodeType ? x : "value" == t && "INPUT" == this[0].nodeName ? this.val() : !(n = this[0].getAttribute(t)) && t in this[0] ? this[0][t] : n : this.each(function(n) {
        if (1 === this.nodeType) if (r(t)) for (_ in t) y(this, _, t[_]); else y(this, t, g(this, e, n, this.getAttribute(t)));
      });
    },
    removeAttr: function(t) {
      return this.each(function() {
        1 === this.nodeType && y(this, t);
      });
    },
    prop: function(t, e) {
      return e === x ? this[0] && this[0][t] : this.each(function(n) {
        this[t] = g(this, e, n, this[t]);
      });
    },
    data: function(t, e) {
      var n = this.attr("data-" + l(t), e);
      return null !== n ? w(n) : x;
    },
    val: function(t) {
      return t === x ? this[0] && (this[0].multiple ? E(this[0]).find("option").filter(function() {
        return this.selected;
      }).pluck("value") : this[0].value) : this.each(function(e) {
        this.value = g(this, t, e, this.value);
      });
    },
    offset: function(t) {
      if (t) return this.each(function(e) {
        var n = E(this), i = g(this, t, e, n.offset()), r = n.offsetParent().offset(), s = {
          top: i.top - r.top,
          left: i.left - r.left
        };
        "static" == n.css("position") && (s.position = "relative"), n.css(s);
      });
      if (0 == this.length) return null;
      var e = this[0].getBoundingClientRect();
      return {
        left: e.left + window.pageXOffset,
        top: e.top + window.pageYOffset,
        width: Math.round(e.width),
        height: Math.round(e.height)
      };
    },
    css: function(e, n) {
      if (2 > arguments.length && "string" == typeof e) return this[0] && (this[0].style[S(e)] || M(this[0], "").getPropertyValue(e));
      var i = "";
      if ("string" == t(e)) n || 0 === n ? i = l(e) + ":" + p(e, n) : this.each(function() {
        this.style.removeProperty(l(e));
      }); else for (_ in e) e[_] || 0 === e[_] ? i += l(_) + ":" + p(_, e[_]) + ";" : this.each(function() {
        this.style.removeProperty(l(_));
      });
      return this.each(function() {
        this.style.cssText += ";" + i;
      });
    },
    index: function(t) {
      return t ? this.indexOf(E(t)[0]) : this.parent().children().indexOf(this[0]);
    },
    hasClass: function(t) {
      return $.some.call(this, function(t) {
        return this.test(b(t));
      }, h(t));
    },
    addClass: function(t) {
      return this.each(function(e) {
        C = [];
        var n = b(this), i = g(this, t, e, n);
        i.split(/\s+/g).forEach(function(t) {
          E(this).hasClass(t) || C.push(t);
        }, this), C.length && b(this, n + (n ? " " : "") + C.join(" "));
      });
    },
    removeClass: function(t) {
      return this.each(function(e) {
        return t === x ? b(this, "") : (C = b(this), g(this, t, e, C).split(/\s+/g).forEach(function(t) {
          C = C.replace(h(t), " ");
        }), b(this, C.trim()), x);
      });
    },
    toggleClass: function(t, e) {
      return this.each(function(n) {
        var i = E(this), r = g(this, t, n, b(this));
        r.split(/\s+/g).forEach(function(t) {
          (e === x ? !i.hasClass(t) : e) ? i.addClass(t) : i.removeClass(t);
        });
      });
    },
    scrollTop: function() {
      return this.length ? "scrollTop" in this[0] ? this[0].scrollTop : this[0].scrollY : x;
    },
    position: function() {
      if (this.length) {
        var t = this[0], e = this.offsetParent(), n = this.offset(), i = L.test(e[0].nodeName) ? {
          top: 0,
          left: 0
        } : e.offset();
        return n.top -= parseFloat(E(t).css("margin-top")) || 0, n.left -= parseFloat(E(t).css("margin-left")) || 0, 
        i.top += parseFloat(E(e[0]).css("border-top-width")) || 0, i.left += parseFloat(E(e[0]).css("border-left-width")) || 0, 
        {
          top: n.top - i.top,
          left: n.left - i.left
        };
      }
    },
    offsetParent: function() {
      return this.map(function() {
        for (var t = this.offsetParent || A.body; t && !L.test(t.nodeName) && "static" == E(t).css("position"); ) t = t.offsetParent;
        return t;
      });
    }
  }, E.fn.detach = E.fn.remove, [ "width", "height" ].forEach(function(t) {
    E.fn[t] = function(e) {
      var r, s = this[0], a = t.replace(/./, function(t) {
        return t[0].toUpperCase();
      });
      return e === x ? n(s) ? s["inner" + a] : i(s) ? s.documentElement["offset" + a] : (r = this.offset()) && r[t] : this.each(function(n) {
        s = E(this), s.css(t, g(this, e, n, s[t]()));
      });
    };
  }), F.forEach(function(e, n) {
    var i = n % 2;
    E.fn[e] = function() {
      var e, r, s = E.map(arguments, function(n) {
        return e = t(n), "object" == e || "array" == e || null == n ? n : Y.fragment(n);
      }), a = this.length > 1;
      return 1 > s.length ? this : this.each(function(t, e) {
        r = i ? e : e.parentNode, e = 0 == n ? e.nextSibling : 1 == n ? e.firstChild : 2 == n ? e : null, 
        s.forEach(function(t) {
          if (a) t = t.cloneNode(!0); else if (!r) return E(t).remove();
          k(r.insertBefore(t, e), function(t) {
            null == t.nodeName || "SCRIPT" !== t.nodeName.toUpperCase() || t.type && "text/javascript" !== t.type || t.src || window.eval.call(window, t.innerHTML);
          });
        });
      });
    }, E.fn[i ? e + "To" : "insert" + (n ? "Before" : "After")] = function(t) {
      return E(t)[e](this), this;
    };
  }), Y.Z.prototype = E.fn, Y.uniq = T, Y.deserializeValue = w, E.zepto = Y, E;
}();

window.Zepto = Zepto, "$" in window || (window.$ = Zepto), function(t) {
  String.prototype.trim === t && (String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
  }), Array.prototype.reduce === t && (Array.prototype.reduce = function(e) {
    if (this === void 0 || null === this) throw new TypeError();
    var n, i = Object(this), r = i.length >>> 0, s = 0;
    if ("function" != typeof e) throw new TypeError();
    if (0 == r && 1 == arguments.length) throw new TypeError();
    if (arguments.length >= 2) n = arguments[1]; else for (;;) {
      if (s in i) {
        n = i[s++];
        break;
      }
      if (++s >= r) throw new TypeError();
    }
    for (;r > s; ) s in i && (n = e.call(t, n, i[s], s, i)), s++;
    return n;
  });
}(), function(t) {
  function e(t) {
    return t._zid || (t._zid = d++);
  }
  function n(t, n, s, a) {
    if (n = i(n), n.ns) var o = r(n.ns);
    return (p[e(t)] || []).filter(function(t) {
      return !(!t || n.e && t.e != n.e || n.ns && !o.test(t.ns) || s && e(t.fn) !== e(s) || a && t.sel != a);
    });
  }
  function i(t) {
    var e = ("" + t).split(".");
    return {
      e: e[0],
      ns: e.slice(1).sort().join(" ")
    };
  }
  function r(t) {
    return RegExp("(?:^| )" + t.replace(" ", " .* ?") + "(?: |$)");
  }
  function s(e, n, i) {
    "string" != t.type(e) ? t.each(e, i) : e.split(/\s/).forEach(function(t) {
      i(t, n);
    });
  }
  function a(t, e) {
    return t.del && ("focus" == t.e || "blur" == t.e) || !!e;
  }
  function o(t) {
    return m[t] || t;
  }
  function c(n, r, c, u, l, h) {
    var d = e(n), f = p[d] || (p[d] = []);
    s(r, c, function(e, r) {
      var s = i(e);
      s.fn = r, s.sel = u, s.e in m && (r = function(e) {
        var n = e.relatedTarget;
        return !n || n !== this && !t.contains(this, n) ? s.fn.apply(this, arguments) : void 0;
      }), s.del = l && l(r, e);
      var c = s.del || r;
      s.proxy = function(t) {
        var e = c.apply(n, [ t ].concat(t.data));
        return e === !1 && (t.preventDefault(), t.stopPropagation()), e;
      }, s.i = f.length, f.push(s), n.addEventListener(o(s.e), s.proxy, a(s, h));
    });
  }
  function u(t, i, r, c, u) {
    var l = e(t);
    s(i || "", r, function(e, i) {
      n(t, e, i, c).forEach(function(e) {
        delete p[l][e.i], t.removeEventListener(o(e.e), e.proxy, a(e, u));
      });
    });
  }
  function l(e) {
    var n, i = {
      originalEvent: e
    };
    for (n in e) y.test(n) || void 0 === e[n] || (i[n] = e[n]);
    return t.each(b, function(t, n) {
      i[t] = function() {
        return this[n] = v, e[t].apply(e, arguments);
      }, i[n] = g;
    }), i;
  }
  function h(t) {
    if (!("defaultPrevented" in t)) {
      t.defaultPrevented = !1;
      var e = t.preventDefault;
      t.preventDefault = function() {
        this.defaultPrevented = !0, e.call(this);
      };
    }
  }
  var p = (t.zepto.qsa, {}), d = 1, f = {}, m = {
    mouseenter: "mouseover",
    mouseleave: "mouseout"
  };
  f.click = f.mousedown = f.mouseup = f.mousemove = "MouseEvents", t.event = {
    add: c,
    remove: u
  }, t.proxy = function(n, i) {
    if (t.isFunction(n)) {
      var r = function() {
        return n.apply(i, arguments);
      };
      return r._zid = e(n), r;
    }
    if ("string" == typeof i) return t.proxy(n[i], n);
    throw new TypeError("expected function");
  }, t.fn.bind = function(t, e) {
    return this.each(function() {
      c(this, t, e);
    });
  }, t.fn.unbind = function(t, e) {
    return this.each(function() {
      u(this, t, e);
    });
  }, t.fn.one = function(t, e) {
    return this.each(function(n, i) {
      c(this, t, e, null, function(t, e) {
        return function() {
          var n = t.apply(i, arguments);
          return u(i, e, t), n;
        };
      });
    });
  };
  var v = function() {
    return !0;
  }, g = function() {
    return !1;
  }, y = /^([A-Z]|layer[XY]$)/, b = {
    preventDefault: "isDefaultPrevented",
    stopImmediatePropagation: "isImmediatePropagationStopped",
    stopPropagation: "isPropagationStopped"
  };
  t.fn.delegate = function(e, n, i) {
    return this.each(function(r, s) {
      c(s, n, i, e, function(n) {
        return function(i) {
          var r, a = t(i.target).closest(e, s).get(0);
          return a ? (r = t.extend(l(i), {
            currentTarget: a,
            liveFired: s
          }), n.apply(a, [ r ].concat([].slice.call(arguments, 1)))) : void 0;
        };
      });
    });
  }, t.fn.undelegate = function(t, e, n) {
    return this.each(function() {
      u(this, e, n, t);
    });
  }, t.fn.live = function(e, n) {
    return t(document.body).delegate(this.selector, e, n), this;
  }, t.fn.die = function(e, n) {
    return t(document.body).undelegate(this.selector, e, n), this;
  }, t.fn.on = function(e, n, i) {
    return !n || t.isFunction(n) ? this.bind(e, n || i) : this.delegate(n, e, i);
  }, t.fn.off = function(e, n, i) {
    return !n || t.isFunction(n) ? this.unbind(e, n || i) : this.undelegate(n, e, i);
  }, t.fn.trigger = function(e, n) {
    return ("string" == typeof e || t.isPlainObject(e)) && (e = t.Event(e)), h(e), e.data = n, 
    this.each(function() {
      "dispatchEvent" in this && this.dispatchEvent(e);
    });
  }, t.fn.triggerHandler = function(e, i) {
    var r, s;
    return this.each(function(a, o) {
      r = l("string" == typeof e ? t.Event(e) : e), r.data = i, r.target = o, t.each(n(o, e.type || e), function(t, e) {
        return s = e.proxy(r), r.isImmediatePropagationStopped() ? !1 : void 0;
      });
    }), s;
  }, "focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(e) {
    t.fn[e] = function(t) {
      return t ? this.bind(e, t) : this.trigger(e);
    };
  }), [ "focus", "blur" ].forEach(function(e) {
    t.fn[e] = function(t) {
      return t ? this.bind(e, t) : this.each(function() {
        try {
          this[e]();
        } catch (t) {}
      }), this;
    };
  }), t.Event = function(t, e) {
    "string" != typeof t && (e = t, t = e.type);
    var n = document.createEvent(f[t] || "Events"), i = !0;
    if (e) for (var r in e) "bubbles" == r ? i = !!e[r] : n[r] = e[r];
    return n.initEvent(t, i, !0, null, null, null, null, null, null, null, null, null, null, null, null), 
    n.isDefaultPrevented = function() {
      return this.defaultPrevented;
    }, n;
  };
}(Zepto), function(t) {
  function e(e, n, i) {
    var r = t.Event(n);
    return t(e).trigger(r, i), !r.defaultPrevented;
  }
  function n(t, n, i, r) {
    return t.global ? e(n || y, i, r) : void 0;
  }
  function i(e) {
    e.global && 0 === t.active++ && n(e, null, "ajaxStart");
  }
  function r(e) {
    e.global && !--t.active && n(e, null, "ajaxStop");
  }
  function s(t, e) {
    var i = e.context;
    return e.beforeSend.call(i, t, e) === !1 || n(e, i, "ajaxBeforeSend", [ t, e ]) === !1 ? !1 : (n(e, i, "ajaxSend", [ t, e ]), 
    void 0);
  }
  function a(t, e, i) {
    var r = i.context, s = "success";
    i.success.call(r, t, s, e), n(i, r, "ajaxSuccess", [ e, i, t ]), c(s, e, i);
  }
  function o(t, e, i, r) {
    var s = r.context;
    r.error.call(s, i, e, t), n(r, s, "ajaxError", [ i, r, t ]), c(e, i, r);
  }
  function c(t, e, i) {
    var s = i.context;
    i.complete.call(s, e, t), n(i, s, "ajaxComplete", [ e, i ]), r(i);
  }
  function u() {}
  function l(t) {
    return t && (t = t.split(";", 2)[0]), t && (t == _ ? "html" : t == x ? "json" : w.test(t) ? "script" : k.test(t) && "xml") || "text";
  }
  function h(t, e) {
    return (t + "&" + e).replace(/[&?]{1,2}/, "?");
  }
  function p(e) {
    e.processData && e.data && "string" != t.type(e.data) && (e.data = t.param(e.data, e.traditional)), 
    !e.data || e.type && "GET" != e.type.toUpperCase() || (e.url = h(e.url, e.data));
  }
  function d(e, n, i, r) {
    var s = !t.isFunction(n);
    return {
      url: e,
      data: s ? n : void 0,
      success: s ? t.isFunction(i) ? i : void 0 : n,
      dataType: s ? r || i : i
    };
  }
  function f(e, n, i, r) {
    var s, a = t.isArray(n);
    t.each(n, function(n, o) {
      s = t.type(o), r && (n = i ? r : r + "[" + (a ? "" : n) + "]"), !r && a ? e.add(o.name, o.value) : "array" == s || !i && "object" == s ? f(e, o, i, n) : e.add(n, o);
    });
  }
  var m, v, g = 0, y = window.document, b = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, w = /^(?:text|application)\/javascript/i, k = /^(?:text|application)\/xml/i, x = "application/json", _ = "text/html", E = /^\s*$/;
  t.active = 0, t.ajaxJSONP = function(e) {
    if (!("type" in e)) return t.ajax(e);
    var n, i = "jsonp" + ++g, r = y.createElement("script"), c = function() {
      clearTimeout(n), t(r).remove(), delete window[i];
    }, l = function(t) {
      c(), t && "timeout" != t || (window[i] = u), o(null, t || "abort", h, e);
    }, h = {
      abort: l
    };
    return s(h, e) === !1 ? (l("abort"), !1) : (window[i] = function(t) {
      c(), a(t, h, e);
    }, r.onerror = function() {
      l("error");
    }, r.src = e.url.replace(/=\?/, "=" + i), t("head").append(r), e.timeout > 0 && (n = setTimeout(function() {
      l("timeout");
    }, e.timeout)), h);
  }, t.ajaxSettings = {
    type: "GET",
    beforeSend: u,
    success: u,
    error: u,
    complete: u,
    context: null,
    global: !0,
    xhr: function() {
      return new window.XMLHttpRequest();
    },
    accepts: {
      script: "text/javascript, application/javascript",
      json: x,
      xml: "application/xml, text/xml",
      html: _,
      text: "text/plain"
    },
    crossDomain: !1,
    timeout: 0,
    processData: !0,
    cache: !0
  }, t.ajax = function(e) {
    var n = t.extend({}, e || {});
    for (m in t.ajaxSettings) void 0 === n[m] && (n[m] = t.ajaxSettings[m]);
    i(n), n.crossDomain || (n.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(n.url) && RegExp.$2 != window.location.host), 
    n.url || (n.url = "" + window.location), p(n), n.cache === !1 && (n.url = h(n.url, "_=" + Date.now()));
    var r = n.dataType, c = /=\?/.test(n.url);
    if ("jsonp" == r || c) return c || (n.url = h(n.url, "callback=?")), t.ajaxJSONP(n);
    var d, f = n.accepts[r], g = {}, y = /^([\w-]+:)\/\//.test(n.url) ? RegExp.$1 : window.location.protocol, b = n.xhr();
    n.crossDomain || (g["X-Requested-With"] = "XMLHttpRequest"), f && (g.Accept = f, 
    f.indexOf(",") > -1 && (f = f.split(",", 2)[0]), b.overrideMimeType && b.overrideMimeType(f)), 
    (n.contentType || n.contentType !== !1 && n.data && "GET" != n.type.toUpperCase()) && (g["Content-Type"] = n.contentType || "application/x-www-form-urlencoded"), 
    n.headers = t.extend(g, n.headers || {}), b.onreadystatechange = function() {
      if (4 == b.readyState) {
        b.onreadystatechange = u, clearTimeout(d);
        var e, i = !1;
        if (b.status >= 200 && 300 > b.status || 304 == b.status || 0 == b.status && "file:" == y) {
          r = r || l(b.getResponseHeader("content-type")), e = b.responseText;
          try {
            "script" == r ? (1, eval)(e) : "xml" == r ? e = b.responseXML : "json" == r && (e = E.test(e) ? null : t.parseJSON(e));
          } catch (s) {
            i = s;
          }
          i ? o(i, "parsererror", b, n) : a(e, b, n);
        } else o(null, b.status ? "error" : "abort", b, n);
      }
    };
    var w = "async" in n ? n.async : !0;
    b.open(n.type, n.url, w);
    for (v in n.headers) b.setRequestHeader(v, n.headers[v]);
    return s(b, n) === !1 ? (b.abort(), !1) : (n.timeout > 0 && (d = setTimeout(function() {
      b.onreadystatechange = u, b.abort(), o(null, "timeout", b, n);
    }, n.timeout)), b.send(n.data ? n.data : null), b);
  }, t.get = function() {
    return t.ajax(d.apply(null, arguments));
  }, t.post = function() {
    var e = d.apply(null, arguments);
    return e.type = "POST", t.ajax(e);
  }, t.getJSON = function() {
    var e = d.apply(null, arguments);
    return e.dataType = "json", t.ajax(e);
  }, t.fn.load = function(e, n, i) {
    if (!this.length) return this;
    var r, s = this, a = e.split(/\s/), o = d(e, n, i), c = o.success;
    return a.length > 1 && (o.url = a[0], r = a[1]), o.success = function(e) {
      s.html(r ? t("<div>").html(e.replace(b, "")).find(r) : e), c && c.apply(s, arguments);
    }, t.ajax(o), this;
  };
  var C = encodeURIComponent;
  t.param = function(t, e) {
    var n = [];
    return n.add = function(t, e) {
      this.push(C(t) + "=" + C(e));
    }, f(n, t, e), n.join("&").replace(/%20/g, "+");
  };
}(Zepto), function(t) {
  t.fn.serializeArray = function() {
    var e, n = [];
    return t(Array.prototype.slice.call(this.get(0).elements)).each(function() {
      e = t(this);
      var i = e.attr("type");
      "fieldset" != this.nodeName.toLowerCase() && !this.disabled && "submit" != i && "reset" != i && "button" != i && ("radio" != i && "checkbox" != i || this.checked) && n.push({
        name: e.attr("name"),
        value: e.val()
      });
    }), n;
  }, t.fn.serialize = function() {
    var t = [];
    return this.serializeArray().forEach(function(e) {
      t.push(encodeURIComponent(e.name) + "=" + encodeURIComponent(e.value));
    }), t.join("&");
  }, t.fn.submit = function(e) {
    if (e) this.bind("submit", e); else if (this.length) {
      var n = t.Event("submit");
      this.eq(0).trigger(n), n.defaultPrevented || this.get(0).submit();
    }
    return this;
  };
}(Zepto), function(t) {
  function e(e, i) {
    var c = e[o], u = c && r[c];
    if (void 0 === i) return u || n(e);
    if (u) {
      if (i in u) return u[i];
      var l = a(i);
      if (l in u) return u[l];
    }
    return s.call(t(e), i);
  }
  function n(e, n, s) {
    var c = e[o] || (e[o] = ++t.uuid), u = r[c] || (r[c] = i(e));
    return void 0 !== n && (u[a(n)] = s), u;
  }
  function i(e) {
    var n = {};
    return t.each(e.attributes, function(e, i) {
      0 == i.name.indexOf("data-") && (n[a(i.name.replace("data-", ""))] = t.zepto.deserializeValue(i.value));
    }), n;
  }
  var r = {}, s = t.fn.data, a = t.camelCase, o = t.expando = "Zepto" + +new Date();
  t.fn.data = function(i, r) {
    return void 0 === r ? t.isPlainObject(i) ? this.each(function(e, r) {
      t.each(i, function(t, e) {
        n(r, t, e);
      });
    }) : 0 == this.length ? void 0 : e(this[0], i) : this.each(function() {
      n(this, i, r);
    });
  }, t.fn.removeData = function(e) {
    return "string" == typeof e && (e = e.split(/\s+/)), this.each(function() {
      var n = this[o], i = n && r[n];
      i && t.each(e, function() {
        delete i[a(this)];
      });
    });
  };
}(Zepto), function(t) {
  function e(t) {
    return "tagName" in t ? t : t.parentNode;
  }
  function n(t, e, n, i) {
    var r = Math.abs(t - e), s = Math.abs(n - i);
    return r >= s ? t - e > 0 ? "Left" : "Right" : n - i > 0 ? "Up" : "Down";
  }
  function i() {
    u = null, l.last && (l.el.trigger("longTap"), l = {});
  }
  function r() {
    u && clearTimeout(u), u = null;
  }
  function s() {
    a && clearTimeout(a), o && clearTimeout(o), c && clearTimeout(c), u && clearTimeout(u), 
    a = o = c = u = null, l = {};
  }
  var a, o, c, u, l = {}, h = 750;
  t(document).ready(function() {
    var p, d;
    t(document.body).bind("touchstart", function(n) {
      p = Date.now(), d = p - (l.last || p), l.el = t(e(n.touches[0].target)), a && clearTimeout(a), 
      l.x1 = n.touches[0].pageX, l.y1 = n.touches[0].pageY, d > 0 && 250 >= d && (l.isDoubleTap = !0), 
      l.last = p, u = setTimeout(i, h);
    }).bind("touchmove", function(t) {
      r(), l.x2 = t.touches[0].pageX, l.y2 = t.touches[0].pageY, Math.abs(l.x1 - l.x2) > 10 && t.preventDefault();
    }).bind("touchend", function() {
      r(), l.x2 && Math.abs(l.x1 - l.x2) > 30 || l.y2 && Math.abs(l.y1 - l.y2) > 30 ? c = setTimeout(function() {
        l.el.trigger("swipe"), l.el.trigger("swipe" + n(l.x1, l.x2, l.y1, l.y2)), l = {};
      }, 0) : "last" in l && (o = setTimeout(function() {
        var e = t.Event("tap");
        e.cancelTouch = s, l.el.trigger(e), l.isDoubleTap ? (l.el.trigger("doubleTap"), 
        l = {}) : a = setTimeout(function() {
          a = null, l.el.trigger("singleTap"), l = {};
        }, 250);
      }, 0));
    }).bind("touchcancel", s), t(window).bind("scroll", s);
  }), [ "swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "doubleTap", "tap", "singleTap", "longTap" ].forEach(function(e) {
    t.fn[e] = function(t) {
      return this.bind(e, t);
    };
  });
}(Zepto), "function" == typeof define && define("zepto", function() {
  return Zepto;
}), define("handlebars", function(t, e, n) {
  this.Handlebars = {}, function(t) {
    t.VERSION = "1.0.rc.1", t.helpers = {}, t.partials = {}, t.registerHelper = function(t, e, n) {
      n && (e.not = n), this.helpers[t] = e;
    }, t.registerPartial = function(t, e) {
      this.partials[t] = e;
    }, t.registerHelper("helperMissing", function(t) {
      if (2 === arguments.length) return void 0;
      throw Error("Could not find property '" + t + "'");
    });
    var e = Object.prototype.toString, n = "[object Function]";
    t.registerHelper("blockHelperMissing", function(i, r) {
      var s = r.inverse || function() {}, a = r.fn, o = e.call(i);
      return o === n && (i = i.call(this)), i === !0 ? a(this) : i === !1 || null == i ? s(this) : "[object Array]" === o ? i.length > 0 ? t.helpers.each(i, r) : s(this) : a(i);
    }), t.K = function() {}, t.createFrame = Object.create || function(e) {
      t.K.prototype = e;
      var n = new t.K();
      return t.K.prototype = null, n;
    }, t.registerHelper("each", function(e, n) {
      var i, r = n.fn, s = n.inverse, a = "";
      if (n.data && (i = t.createFrame(n.data)), e && e.length > 0) for (var o = 0, c = e.length; c > o; o++) i && (i.index = o), 
      a += r(e[o], {
        data: i
      }); else a = s(this);
      return a;
    }), t.registerHelper("if", function(i, r) {
      var s = e.call(i);
      return s === n && (i = i.call(this)), !i || t.Utils.isEmpty(i) ? r.inverse(this) : r.fn(this);
    }), t.registerHelper("unless", function(e, n) {
      var i = n.fn, r = n.inverse;
      return n.fn = r, n.inverse = i, t.helpers["if"].call(this, e, n);
    }), t.registerHelper("with", function(t, e) {
      return e.fn(t);
    }), t.registerHelper("log", function(e) {
      t.log(e);
    });
  }(this.Handlebars);
  var i = function() {
    function t() {
      this.yy = {};
    }
    var e = {
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
      performAction: function(t, e, n, i, r, s) {
        var a = s.length - 1;
        switch (r) {
         case 1:
          return s[a - 1];

         case 2:
          this.$ = new i.ProgramNode(s[a - 2], s[a]);
          break;

         case 3:
          this.$ = new i.ProgramNode(s[a]);
          break;

         case 4:
          this.$ = new i.ProgramNode([]);
          break;

         case 5:
          this.$ = [ s[a] ];
          break;

         case 6:
          s[a - 1].push(s[a]), this.$ = s[a - 1];
          break;

         case 7:
          this.$ = new i.BlockNode(s[a - 2], s[a - 1].inverse, s[a - 1], s[a]);
          break;

         case 8:
          this.$ = new i.BlockNode(s[a - 2], s[a - 1], s[a - 1].inverse, s[a]);
          break;

         case 9:
          this.$ = s[a];
          break;

         case 10:
          this.$ = s[a];
          break;

         case 11:
          this.$ = new i.ContentNode(s[a]);
          break;

         case 12:
          this.$ = new i.CommentNode(s[a]);
          break;

         case 13:
          this.$ = new i.MustacheNode(s[a - 1][0], s[a - 1][1]);
          break;

         case 14:
          this.$ = new i.MustacheNode(s[a - 1][0], s[a - 1][1]);
          break;

         case 15:
          this.$ = s[a - 1];
          break;

         case 16:
          this.$ = new i.MustacheNode(s[a - 1][0], s[a - 1][1]);
          break;

         case 17:
          this.$ = new i.MustacheNode(s[a - 1][0], s[a - 1][1], !0);
          break;

         case 18:
          this.$ = new i.PartialNode(s[a - 1]);
          break;

         case 19:
          this.$ = new i.PartialNode(s[a - 2], s[a - 1]);
          break;

         case 20:
          break;

         case 21:
          this.$ = [ [ s[a - 2] ].concat(s[a - 1]), s[a] ];
          break;

         case 22:
          this.$ = [ [ s[a - 1] ].concat(s[a]), null ];
          break;

         case 23:
          this.$ = [ [ s[a - 1] ], s[a] ];
          break;

         case 24:
          this.$ = [ [ s[a] ], null ];
          break;

         case 25:
          this.$ = [ [ new i.DataNode(s[a]) ], null ];
          break;

         case 26:
          s[a - 1].push(s[a]), this.$ = s[a - 1];
          break;

         case 27:
          this.$ = [ s[a] ];
          break;

         case 28:
          this.$ = s[a];
          break;

         case 29:
          this.$ = new i.StringNode(s[a]);
          break;

         case 30:
          this.$ = new i.IntegerNode(s[a]);
          break;

         case 31:
          this.$ = new i.BooleanNode(s[a]);
          break;

         case 32:
          this.$ = new i.DataNode(s[a]);
          break;

         case 33:
          this.$ = new i.HashNode(s[a]);
          break;

         case 34:
          s[a - 1].push(s[a]), this.$ = s[a - 1];
          break;

         case 35:
          this.$ = [ s[a] ];
          break;

         case 36:
          this.$ = [ s[a - 2], s[a] ];
          break;

         case 37:
          this.$ = [ s[a - 2], new i.StringNode(s[a]) ];
          break;

         case 38:
          this.$ = [ s[a - 2], new i.IntegerNode(s[a]) ];
          break;

         case 39:
          this.$ = [ s[a - 2], new i.BooleanNode(s[a]) ];
          break;

         case 40:
          this.$ = [ s[a - 2], new i.DataNode(s[a]) ];
          break;

         case 41:
          this.$ = new i.IdNode(s[a]);
          break;

         case 42:
          s[a - 2].push(s[a]), this.$ = s[a - 2];
          break;

         case 43:
          this.$ = [ s[a] ];
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
      parseError: function(t) {
        throw Error(t);
      },
      parse: function(t) {
        function e() {
          var t;
          return t = n.lexer.lex() || 1, "number" != typeof t && (t = n.symbols_[t] || t), 
          t;
        }
        var n = this, i = [ 0 ], r = [ null ], s = [], a = this.table, o = "", c = 0, u = 0, l = 0;
        this.lexer.setInput(t), this.lexer.yy = this.yy, this.yy.lexer = this.lexer, this.yy.parser = this, 
        this.lexer.yylloc === void 0 && (this.lexer.yylloc = {});
        var h = this.lexer.yylloc;
        s.push(h);
        var p = this.lexer.options && this.lexer.options.ranges;
        "function" == typeof this.yy.parseError && (this.parseError = this.yy.parseError);
        for (var d, f, m, v, g, y, b, w, k, x = {}; ;) {
          if (m = i[i.length - 1], this.defaultActions[m] ? v = this.defaultActions[m] : ((null === d || d === void 0) && (d = e()), 
          v = a[m] && a[m][d]), v === void 0 || !v.length || !v[0]) {
            var _ = "";
            if (!l) {
              k = [];
              for (y in a[m]) this.terminals_[y] && y > 2 && k.push("'" + this.terminals_[y] + "'");
              _ = this.lexer.showPosition ? "Parse error on line " + (c + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + k.join(", ") + ", got '" + (this.terminals_[d] || d) + "'" : "Parse error on line " + (c + 1) + ": Unexpected " + (1 == d ? "end of input" : "'" + (this.terminals_[d] || d) + "'"), 
              this.parseError(_, {
                text: this.lexer.match,
                token: this.terminals_[d] || d,
                line: this.lexer.yylineno,
                loc: h,
                expected: k
              });
            }
          }
          if (v[0] instanceof Array && v.length > 1) throw Error("Parse Error: multiple actions possible at state: " + m + ", token: " + d);
          switch (v[0]) {
           case 1:
            i.push(d), r.push(this.lexer.yytext), s.push(this.lexer.yylloc), i.push(v[1]), d = null, 
            f ? (d = f, f = null) : (u = this.lexer.yyleng, o = this.lexer.yytext, c = this.lexer.yylineno, 
            h = this.lexer.yylloc, l > 0 && l--);
            break;

           case 2:
            if (b = this.productions_[v[1]][1], x.$ = r[r.length - b], x._$ = {
              first_line: s[s.length - (b || 1)].first_line,
              last_line: s[s.length - 1].last_line,
              first_column: s[s.length - (b || 1)].first_column,
              last_column: s[s.length - 1].last_column
            }, p && (x._$.range = [ s[s.length - (b || 1)].range[0], s[s.length - 1].range[1] ]), 
            g = this.performAction.call(x, o, u, c, this.yy, v[1], r, s), g !== void 0) return g;
            b && (i = i.slice(0, 2 * -1 * b), r = r.slice(0, -1 * b), s = s.slice(0, -1 * b)), 
            i.push(this.productions_[v[1]][0]), r.push(x.$), s.push(x._$), w = a[i[i.length - 2]][i[i.length - 1]], 
            i.push(w);
            break;

           case 3:
            return !0;
          }
        }
        return !0;
      }
    }, n = function() {
      var t = {
        EOF: 1,
        parseError: function(t, e) {
          if (!this.yy.parser) throw Error(t);
          this.yy.parser.parseError(t, e);
        },
        setInput: function(t) {
          return this._input = t, this._more = this._less = this.done = !1, this.yylineno = this.yyleng = 0, 
          this.yytext = this.matched = this.match = "", this.conditionStack = [ "INITIAL" ], 
          this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
          }, this.options.ranges && (this.yylloc.range = [ 0, 0 ]), this.offset = 0, this;
        },
        input: function() {
          var t = this._input[0];
          this.yytext += t, this.yyleng++, this.offset++, this.match += t, this.matched += t;
          var e = t.match(/(?:\r\n?|\n).*/g);
          return e ? (this.yylineno++, this.yylloc.last_line++) : this.yylloc.last_column++, 
          this.options.ranges && this.yylloc.range[1]++, this._input = this._input.slice(1), 
          t;
        },
        unput: function(t) {
          var e = t.length, n = t.split(/(?:\r\n?|\n)/g);
          this._input = t + this._input, this.yytext = this.yytext.substr(0, this.yytext.length - e - 1), 
          this.offset -= e;
          var i = this.match.split(/(?:\r\n?|\n)/g);
          this.match = this.match.substr(0, this.match.length - 1), this.matched = this.matched.substr(0, this.matched.length - 1), 
          n.length - 1 && (this.yylineno -= n.length - 1);
          var r = this.yylloc.range;
          return this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: n ? (n.length === i.length ? this.yylloc.first_column : 0) + i[i.length - n.length].length - n[0].length : this.yylloc.first_column - e
          }, this.options.ranges && (this.yylloc.range = [ r[0], r[0] + this.yyleng - e ]), 
          this;
        },
        more: function() {
          return this._more = !0, this;
        },
        less: function(t) {
          this.unput(this.match.slice(t));
        },
        pastInput: function() {
          var t = this.matched.substr(0, this.matched.length - this.match.length);
          return (t.length > 20 ? "..." : "") + t.substr(-20).replace(/\n/g, "");
        },
        upcomingInput: function() {
          var t = this.match;
          return 20 > t.length && (t += this._input.substr(0, 20 - t.length)), (t.substr(0, 20) + (t.length > 20 ? "..." : "")).replace(/\n/g, "");
        },
        showPosition: function() {
          var t = this.pastInput(), e = Array(t.length + 1).join("-");
          return t + this.upcomingInput() + "\n" + e + "^";
        },
        next: function() {
          if (this.done) return this.EOF;
          this._input || (this.done = !0);
          var t, e, n, i, r;
          this._more || (this.yytext = "", this.match = "");
          for (var s = this._currentRules(), a = 0; s.length > a && (n = this._input.match(this.rules[s[a]]), 
          !n || e && !(n[0].length > e[0].length) || (e = n, i = a, this.options.flex)); a++) ;
          return e ? (r = e[0].match(/(?:\r\n?|\n).*/g), r && (this.yylineno += r.length), 
          this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: r ? r[r.length - 1].length - r[r.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + e[0].length
          }, this.yytext += e[0], this.match += e[0], this.matches = e, this.yyleng = this.yytext.length, 
          this.options.ranges && (this.yylloc.range = [ this.offset, this.offset += this.yyleng ]), 
          this._more = !1, this._input = this._input.slice(e[0].length), this.matched += e[0], 
          t = this.performAction.call(this, this.yy, this, s[i], this.conditionStack[this.conditionStack.length - 1]), 
          this.done && this._input && (this.done = !1), t ? t : void 0) : "" === this._input ? this.EOF : this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
            text: "",
            token: null,
            line: this.yylineno
          });
        },
        lex: function() {
          var t = this.next();
          return t !== void 0 ? t : this.lex();
        },
        begin: function(t) {
          this.conditionStack.push(t);
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
        pushState: function(t) {
          this.begin(t);
        }
      };
      return t.options = {}, t.performAction = function(t, e, n, i) {
        switch (n) {
         case 0:
          if ("\\" !== e.yytext.slice(-1) && this.begin("mu"), "\\" === e.yytext.slice(-1) && (e.yytext = e.yytext.substr(0, e.yyleng - 1), 
          this.begin("emu")), e.yytext) return 14;
          break;

         case 1:
          return 14;

         case 2:
          return "\\" !== e.yytext.slice(-1) && this.popState(), "\\" === e.yytext.slice(-1) && (e.yytext = e.yytext.substr(0, e.yyleng - 1)), 
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
          return e.yytext = e.yytext.substr(3, e.yyleng - 5), this.popState(), 15;

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
          return e.yytext = e.yytext.substr(1, e.yyleng - 2).replace(/\\"/g, '"'), 29;

         case 20:
          return e.yytext = e.yytext.substr(1, e.yyleng - 2).replace(/\\"/g, '"'), 29;

         case 21:
          return e.yytext = e.yytext.substr(1), 27;

         case 22:
          return 31;

         case 23:
          return 31;

         case 24:
          return 30;

         case 25:
          return 34;

         case 26:
          return e.yytext = e.yytext.substr(1, e.yyleng - 2), 34;

         case 27:
          return "INVALID";

         case 28:
          return 5;
        }
      }, t.rules = [ /^(?:[^\x00]*?(?=(\{\{)))/, /^(?:[^\x00]+)/, /^(?:[^\x00]{2,}?(?=(\{\{|$)))/, /^(?:\{\{>)/, /^(?:\{\{#)/, /^(?:\{\{\/)/, /^(?:\{\{\^)/, /^(?:\{\{\s*else\b)/, /^(?:\{\{\{)/, /^(?:\{\{&)/, /^(?:\{\{![\s\S]*?\}\})/, /^(?:\{\{)/, /^(?:=)/, /^(?:\.(?=[} ]))/, /^(?:\.\.)/, /^(?:[\/.])/, /^(?:\s+)/, /^(?:\}\}\})/, /^(?:\}\})/, /^(?:"(\\["]|[^"])*")/, /^(?:'(\\[']|[^'])*')/, /^(?:@[a-zA-Z]+)/, /^(?:true(?=[}\s]))/, /^(?:false(?=[}\s]))/, /^(?:[0-9]+(?=[}\s]))/, /^(?:[a-zA-Z0-9_$-]+(?=[=}\s\/.]))/, /^(?:\[[^\]]*\])/, /^(?:.)/, /^(?:$)/ ], 
      t.conditions = {
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
      }, t;
    }();
    return e.lexer = n, t.prototype = e, e.Parser = t, new t();
  }();
  return t !== void 0 && e !== void 0 && (e.parser = i, e.Parser = i.Parser, e.parse = function() {
    return i.parse.apply(i, arguments);
  }, e.main = function(n) {
    if (!n[1]) throw Error("Usage: " + n[0] + " FILE");
    var i;
    return i = "undefined" != typeof process ? t("fs").readFileSync(t("path").resolve(n[1]), "utf8") : t("file").path(t("file").cwd()).join(n[1]).read({
      charset: "utf-8"
    }), e.parser.parse(i);
  }, n !== void 0 && t.main === n && e.main("undefined" != typeof process ? process.argv.slice(1) : t("system").args)), 
  Handlebars.Parser = i, Handlebars.parse = function(t) {
    return Handlebars.Parser.yy = Handlebars.AST, Handlebars.Parser.parse(t);
  }, Handlebars.print = function(t) {
    return new Handlebars.PrintVisitor().accept(t);
  }, Handlebars.logger = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    level: 3,
    log: function() {}
  }, Handlebars.log = function(t, e) {
    Handlebars.logger.log(t, e);
  }, function() {
    Handlebars.AST = {}, Handlebars.AST.ProgramNode = function(t, e) {
      this.type = "program", this.statements = t, e && (this.inverse = new Handlebars.AST.ProgramNode(e));
    }, Handlebars.AST.MustacheNode = function(t, e, n) {
      this.type = "mustache", this.escaped = !n, this.hash = e;
      var i = this.id = t[0], r = this.params = t.slice(1), s = this.eligibleHelper = i.isSimple;
      this.isHelper = s && (r.length || e);
    }, Handlebars.AST.PartialNode = function(t, e) {
      this.type = "partial", this.id = t, this.context = e;
    };
    var t = function(t, e) {
      if (t.original !== e.original) throw new Handlebars.Exception(t.original + " doesn't match " + e.original);
    };
    Handlebars.AST.BlockNode = function(e, n, i, r) {
      t(e.id, r), this.type = "block", this.mustache = e, this.program = n, this.inverse = i, 
      this.inverse && !this.program && (this.isInverse = !0);
    }, Handlebars.AST.ContentNode = function(t) {
      this.type = "content", this.string = t;
    }, Handlebars.AST.HashNode = function(t) {
      this.type = "hash", this.pairs = t;
    }, Handlebars.AST.IdNode = function(t) {
      this.type = "ID", this.original = t.join(".");
      for (var e = [], n = 0, i = 0, r = t.length; r > i; i++) {
        var s = t[i];
        ".." === s ? n++ : "." === s || "this" === s ? this.isScoped = !0 : e.push(s);
      }
      this.parts = e, this.string = e.join("."), this.depth = n, this.isSimple = 1 === t.length && !this.isScoped && 0 === n;
    }, Handlebars.AST.DataNode = function(t) {
      this.type = "DATA", this.id = t;
    }, Handlebars.AST.StringNode = function(t) {
      this.type = "STRING", this.string = t;
    }, Handlebars.AST.IntegerNode = function(t) {
      this.type = "INTEGER", this.integer = t;
    }, Handlebars.AST.BooleanNode = function(t) {
      this.type = "BOOLEAN", this.bool = t;
    }, Handlebars.AST.CommentNode = function(t) {
      this.type = "comment", this.comment = t;
    };
  }(), Handlebars.Exception = function() {
    var t = Error.prototype.constructor.apply(this, arguments);
    for (var e in t) t.hasOwnProperty(e) && (this[e] = t[e]);
    this.message = t.message;
  }, Handlebars.Exception.prototype = Error(), Handlebars.SafeString = function(t) {
    this.string = t;
  }, Handlebars.SafeString.prototype.toString = function() {
    return "" + this.string;
  }, function() {
    var t = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "`": "&#x60;"
    }, e = /[&<>"'`]/g, n = /[&<>"'`]/, i = function(e) {
      return t[e] || "&amp;";
    };
    Handlebars.Utils = {
      escapeExpression: function(t) {
        return t instanceof Handlebars.SafeString ? "" + t : null == t || t === !1 ? "" : n.test(t) ? t.replace(e, i) : t;
      },
      isEmpty: function(t) {
        return t === void 0 ? !0 : null === t ? !0 : t === !1 ? !0 : "[object Array]" === Object.prototype.toString.call(t) && 0 === t.length ? !0 : !1;
      }
    };
  }(), Handlebars.Compiler = function() {}, Handlebars.JavaScriptCompiler = function() {}, 
  function(t, e) {
    t.prototype = {
      compiler: t,
      disassemble: function() {
        for (var t, e, n, i = this.opcodes, r = [], s = 0, a = i.length; a > s; s++) if (t = i[s], 
        "DECLARE" === t.opcode) r.push("DECLARE " + t.name + "=" + t.value); else {
          e = [];
          for (var o = 0; t.args.length > o; o++) n = t.args[o], "string" == typeof n && (n = '"' + n.replace("\n", "\\n") + '"'), 
          e.push(n);
          r.push(t.opcode + " " + e.join(" "));
        }
        return r.join("\n");
      },
      guid: 0,
      compile: function(t, e) {
        this.children = [], this.depths = {
          list: []
        }, this.options = e;
        var n = this.options.knownHelpers;
        if (this.options.knownHelpers = {
          helperMissing: !0,
          blockHelperMissing: !0,
          each: !0,
          "if": !0,
          unless: !0,
          "with": !0,
          log: !0
        }, n) for (var i in n) this.options.knownHelpers[i] = n[i];
        return this.program(t);
      },
      accept: function(t) {
        return this[t.type](t);
      },
      program: function(t) {
        var e, n = t.statements;
        this.opcodes = [];
        for (var i = 0, r = n.length; r > i; i++) e = n[i], this[e.type](e);
        return this.isSimple = 1 === r, this.depths.list = this.depths.list.sort(function(t, e) {
          return t - e;
        }), this;
      },
      compileProgram: function(t) {
        var e, n = new this.compiler().compile(t, this.options), i = this.guid++;
        this.usePartial = this.usePartial || n.usePartial, this.children[i] = n;
        for (var r = 0, s = n.depths.list.length; s > r; r++) e = n.depths.list[r], 2 > e || this.addDepth(e - 1);
        return i;
      },
      block: function(t) {
        var e = t.mustache, n = t.program, i = t.inverse;
        n && (n = this.compileProgram(n)), i && (i = this.compileProgram(i));
        var r = this.classifyMustache(e);
        "helper" === r ? this.helperMustache(e, n, i) : "simple" === r ? (this.simpleMustache(e), 
        this.opcode("pushProgram", n), this.opcode("pushProgram", i), this.opcode("pushLiteral", "{}"), 
        this.opcode("blockValue")) : (this.ambiguousMustache(e, n, i), this.opcode("pushProgram", n), 
        this.opcode("pushProgram", i), this.opcode("pushLiteral", "{}"), this.opcode("ambiguousBlockValue")), 
        this.opcode("append");
      },
      hash: function(t) {
        var e, n, i = t.pairs;
        this.opcode("push", "{}");
        for (var r = 0, s = i.length; s > r; r++) e = i[r], n = e[1], this.accept(n), this.opcode("assignToHash", e[0]);
      },
      partial: function(t) {
        var e = t.id;
        this.usePartial = !0, t.context ? this.ID(t.context) : this.opcode("push", "depth0"), 
        this.opcode("invokePartial", e.original), this.opcode("append");
      },
      content: function(t) {
        this.opcode("appendContent", t.string);
      },
      mustache: function(t) {
        var e = this.options, n = this.classifyMustache(t);
        "simple" === n ? this.simpleMustache(t) : "helper" === n ? this.helperMustache(t) : this.ambiguousMustache(t), 
        t.escaped && !e.noEscape ? this.opcode("appendEscaped") : this.opcode("append");
      },
      ambiguousMustache: function(t, e, n) {
        var i = t.id, r = i.parts[0];
        this.opcode("getContext", i.depth), this.opcode("pushProgram", e), this.opcode("pushProgram", n), 
        this.opcode("invokeAmbiguous", r);
      },
      simpleMustache: function(t) {
        var e = t.id;
        "DATA" === e.type ? this.DATA(e) : e.parts.length ? this.ID(e) : (this.addDepth(e.depth), 
        this.opcode("getContext", e.depth), this.opcode("pushContext")), this.opcode("resolvePossibleLambda");
      },
      helperMustache: function(t, e, n) {
        var i = this.setupFullMustacheParams(t, e, n), r = t.id.parts[0];
        if (this.options.knownHelpers[r]) this.opcode("invokeKnownHelper", i.length, r); else {
          if (this.knownHelpersOnly) throw Error("You specified knownHelpersOnly, but used the unknown helper " + r);
          this.opcode("invokeHelper", i.length, r);
        }
      },
      ID: function(t) {
        this.addDepth(t.depth), this.opcode("getContext", t.depth);
        var e = t.parts[0];
        e ? this.opcode("lookupOnContext", t.parts[0]) : this.opcode("pushContext");
        for (var n = 1, i = t.parts.length; i > n; n++) this.opcode("lookup", t.parts[n]);
      },
      DATA: function(t) {
        this.options.data = !0, this.opcode("lookupData", t.id);
      },
      STRING: function(t) {
        this.opcode("pushString", t.string);
      },
      INTEGER: function(t) {
        this.opcode("pushLiteral", t.integer);
      },
      BOOLEAN: function(t) {
        this.opcode("pushLiteral", t.bool);
      },
      comment: function() {},
      opcode: function(t) {
        this.opcodes.push({
          opcode: t,
          args: [].slice.call(arguments, 1)
        });
      },
      declare: function(t, e) {
        this.opcodes.push({
          opcode: "DECLARE",
          name: t,
          value: e
        });
      },
      addDepth: function(t) {
        if (isNaN(t)) throw Error("EWOT");
        0 !== t && (this.depths[t] || (this.depths[t] = !0, this.depths.list.push(t)));
      },
      classifyMustache: function(t) {
        var e = t.isHelper, n = t.eligibleHelper, i = this.options;
        if (n && !e) {
          var r = t.id.parts[0];
          i.knownHelpers[r] ? e = !0 : i.knownHelpersOnly && (n = !1);
        }
        return e ? "helper" : n ? "ambiguous" : "simple";
      },
      pushParams: function(t) {
        for (var e, n = t.length; n--; ) e = t[n], this.options.stringParams ? (e.depth && this.addDepth(e.depth), 
        this.opcode("getContext", e.depth || 0), this.opcode("pushStringParam", e.string)) : this[e.type](e);
      },
      setupMustacheParams: function(t) {
        var e = t.params;
        return this.pushParams(e), t.hash ? this.hash(t.hash) : this.opcode("pushLiteral", "{}"), 
        e;
      },
      setupFullMustacheParams: function(t, e, n) {
        var i = t.params;
        return this.pushParams(i), this.opcode("pushProgram", e), this.opcode("pushProgram", n), 
        t.hash ? this.hash(t.hash) : this.opcode("pushLiteral", "{}"), i;
      }
    };
    var n = function(t) {
      this.value = t;
    };
    e.prototype = {
      nameLookup: function(t, n) {
        return /^[0-9]+$/.test(n) ? t + "[" + n + "]" : e.isValidJavaScriptVariableName(n) ? t + "." + n : t + "['" + n + "']";
      },
      appendToBuffer: function(t) {
        return this.environment.isSimple ? "return " + t + ";" : "buffer += " + t + ";";
      },
      initializeBuffer: function() {
        return this.quotedString("");
      },
      namespace: "Handlebars",
      compile: function(t, e, n, i) {
        this.environment = t, this.options = e || {}, Handlebars.log(Handlebars.logger.DEBUG, this.environment.disassemble() + "\n\n"), 
        this.name = this.environment.name, this.isChild = !!n, this.context = n || {
          programs: [],
          aliases: {}
        }, this.preamble(), this.stackSlot = 0, this.stackVars = [], this.registers = {
          list: []
        }, this.compileStack = [], this.compileChildren(t, e);
        var r, s = t.opcodes;
        for (this.i = 0, a = s.length; a > this.i; this.i++) r = s[this.i], "DECLARE" === r.opcode ? this[r.name] = r.value : this[r.opcode].apply(this, r.args);
        return this.createFunctionContext(i);
      },
      nextOpcode: function() {
        var t = this.environment.opcodes;
        return t[this.i + 1], t[this.i + 1];
      },
      eat: function() {
        this.i = this.i + 1;
      },
      preamble: function() {
        var t = [];
        if (this.isChild) t.push(""); else {
          var e = this.namespace, n = "helpers = helpers || " + e + ".helpers;";
          this.environment.usePartial && (n = n + " partials = partials || " + e + ".partials;"), 
          this.options.data && (n += " data = data || {};"), t.push(n);
        }
        this.environment.isSimple ? t.push("") : t.push(", buffer = " + this.initializeBuffer()), 
        this.lastContext = 0, this.source = t;
      },
      createFunctionContext: function(t) {
        var e = this.stackVars.concat(this.registers.list);
        if (e.length > 0 && (this.source[1] = this.source[1] + ", " + e.join(", ")), !this.isChild) for (var n in this.context.aliases) this.source[1] = this.source[1] + ", " + n + "=" + this.context.aliases[n];
        this.source[1] && (this.source[1] = "var " + this.source[1].substring(2) + ";"), 
        this.isChild || (this.source[1] += "\n" + this.context.programs.join("\n") + "\n"), 
        this.environment.isSimple || this.source.push("return buffer;");
        for (var i = this.isChild ? [ "depth0", "data" ] : [ "Handlebars", "depth0", "helpers", "partials", "data" ], r = 0, s = this.environment.depths.list.length; s > r; r++) i.push("depth" + this.environment.depths.list[r]);
        if (t) return i.push(this.source.join("\n  ")), Function.apply(this, i);
        var a = "function " + (this.name || "") + "(" + i.join(",") + ") {\n  " + this.source.join("\n  ") + "}";
        return Handlebars.log(Handlebars.logger.DEBUG, a + "\n\n"), a;
      },
      blockValue: function() {
        this.context.aliases.blockHelperMissing = "helpers.blockHelperMissing";
        var t = [ "depth0" ];
        this.setupParams(0, t), this.replaceStack(function(e) {
          return t.splice(1, 0, e), e + " = blockHelperMissing.call(" + t.join(", ") + ")";
        });
      },
      ambiguousBlockValue: function() {
        this.context.aliases.blockHelperMissing = "helpers.blockHelperMissing";
        var t = [ "depth0" ];
        this.setupParams(0, t);
        var e = this.topStack();
        t.splice(1, 0, e), this.source.push("if (!" + this.lastHelper + ") { " + e + " = blockHelperMissing.call(" + t.join(", ") + "); }");
      },
      appendContent: function(t) {
        this.source.push(this.appendToBuffer(this.quotedString(t)));
      },
      append: function() {
        var t = this.popStack();
        this.source.push("if(" + t + " || " + t + " === 0) { " + this.appendToBuffer(t) + " }"), 
        this.environment.isSimple && this.source.push("else { " + this.appendToBuffer("''") + " }");
      },
      appendEscaped: function() {
        var t = this.nextOpcode(), e = "";
        this.context.aliases.escapeExpression = "this.escapeExpression", t && "appendContent" === t.opcode && (e = " + " + this.quotedString(t.args[0]), 
        this.eat(t)), this.source.push(this.appendToBuffer("escapeExpression(" + this.popStack() + ")" + e));
      },
      getContext: function(t) {
        this.lastContext !== t && (this.lastContext = t);
      },
      lookupOnContext: function(t) {
        this.pushStack(this.nameLookup("depth" + this.lastContext, t, "context"));
      },
      pushContext: function() {
        this.pushStackLiteral("depth" + this.lastContext);
      },
      resolvePossibleLambda: function() {
        this.context.aliases.functionType = '"function"', this.replaceStack(function(t) {
          return "typeof " + t + " === functionType ? " + t + "() : " + t;
        });
      },
      lookup: function(t) {
        this.replaceStack(function(e) {
          return e + " == null || " + e + " === false ? " + e + " : " + this.nameLookup(e, t, "context");
        });
      },
      lookupData: function(t) {
        this.pushStack(this.nameLookup("data", t, "data"));
      },
      pushStringParam: function(t) {
        this.pushStackLiteral("depth" + this.lastContext), this.pushString(t);
      },
      pushString: function(t) {
        this.pushStackLiteral(this.quotedString(t));
      },
      push: function(t) {
        this.pushStack(t);
      },
      pushLiteral: function(t) {
        this.pushStackLiteral(t);
      },
      pushProgram: function(t) {
        null != t ? this.pushStackLiteral(this.programExpression(t)) : this.pushStackLiteral(null);
      },
      invokeHelper: function(t, e) {
        this.context.aliases.helperMissing = "helpers.helperMissing";
        var n = this.lastHelper = this.setupHelper(t, e);
        this.register("foundHelper", n.name), this.pushStack("foundHelper ? foundHelper.call(" + n.callParams + ") " + ": helperMissing.call(" + n.helperMissingParams + ")");
      },
      invokeKnownHelper: function(t, e) {
        var n = this.setupHelper(t, e);
        this.pushStack(n.name + ".call(" + n.callParams + ")");
      },
      invokeAmbiguous: function(t) {
        this.context.aliases.functionType = '"function"', this.pushStackLiteral("{}");
        var e = this.setupHelper(0, t), n = this.lastHelper = this.nameLookup("helpers", t, "helper");
        this.register("foundHelper", n);
        var i = this.nameLookup("depth" + this.lastContext, t, "context"), r = this.nextStack();
        this.source.push("if (foundHelper) { " + r + " = foundHelper.call(" + e.callParams + "); }"), 
        this.source.push("else { " + r + " = " + i + "; " + r + " = typeof " + r + " === functionType ? " + r + "() : " + r + "; }");
      },
      invokePartial: function(t) {
        var e = [ this.nameLookup("partials", t, "partial"), "'" + t + "'", this.popStack(), "helpers", "partials" ];
        this.options.data && e.push("data"), this.context.aliases.self = "this", this.pushStack("self.invokePartial(" + e.join(", ") + ");");
      },
      assignToHash: function(t) {
        var e = this.popStack(), n = this.topStack();
        this.source.push(n + "['" + t + "'] = " + e + ";");
      },
      compiler: e,
      compileChildren: function(t, e) {
        for (var n, i, r = t.children, s = 0, a = r.length; a > s; s++) {
          n = r[s], i = new this.compiler(), this.context.programs.push("");
          var o = this.context.programs.length;
          n.index = o, n.name = "program" + o, this.context.programs[o] = i.compile(n, e, this.context);
        }
      },
      programExpression: function(t) {
        if (this.context.aliases.self = "this", null == t) return "self.noop";
        for (var e, n = this.environment.children[t], i = n.depths.list, r = [ n.index, n.name, "data" ], s = 0, a = i.length; a > s; s++) e = i[s], 
        1 === e ? r.push("depth0") : r.push("depth" + (e - 1));
        return 0 === i.length ? "self.program(" + r.join(", ") + ")" : (r.shift(), "self.programWithDepth(" + r.join(", ") + ")");
      },
      register: function(t, e) {
        this.useRegister(t), this.source.push(t + " = " + e + ";");
      },
      useRegister: function(t) {
        this.registers[t] || (this.registers[t] = !0, this.registers.list.push(t));
      },
      pushStackLiteral: function(t) {
        return this.compileStack.push(new n(t)), t;
      },
      pushStack: function(t) {
        return this.source.push(this.incrStack() + " = " + t + ";"), this.compileStack.push("stack" + this.stackSlot), 
        "stack" + this.stackSlot;
      },
      replaceStack: function(t) {
        var e = t.call(this, this.topStack());
        return this.source.push(this.topStack() + " = " + e + ";"), "stack" + this.stackSlot;
      },
      nextStack: function() {
        var t = this.incrStack();
        return this.compileStack.push("stack" + this.stackSlot), t;
      },
      incrStack: function() {
        return this.stackSlot++, this.stackSlot > this.stackVars.length && this.stackVars.push("stack" + this.stackSlot), 
        "stack" + this.stackSlot;
      },
      popStack: function() {
        var t = this.compileStack.pop();
        return t instanceof n ? t.value : (this.stackSlot--, t);
      },
      topStack: function() {
        var t = this.compileStack[this.compileStack.length - 1];
        return t instanceof n ? t.value : t;
      },
      quotedString: function(t) {
        return '"' + t.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r") + '"';
      },
      setupHelper: function(t, e) {
        var n = [];
        this.setupParams(t, n);
        var i = this.nameLookup("helpers", e, "helper");
        return {
          params: n,
          name: i,
          callParams: [ "depth0" ].concat(n).join(", "),
          helperMissingParams: [ "depth0", this.quotedString(e) ].concat(n).join(", ")
        };
      },
      setupParams: function(t, e) {
        var n, i, r, s = [], a = [];
        s.push("hash:" + this.popStack()), i = this.popStack(), r = this.popStack(), (r || i) && (r || (this.context.aliases.self = "this", 
        r = "self.noop"), i || (this.context.aliases.self = "this", i = "self.noop"), s.push("inverse:" + i), 
        s.push("fn:" + r));
        for (var o = 0; t > o; o++) n = this.popStack(), e.push(n), this.options.stringParams && a.push(this.popStack());
        return this.options.stringParams && s.push("contexts:[" + a.join(",") + "]"), this.options.data && s.push("data:data"), 
        e.push("{" + s.join(",") + "}"), e.join(", ");
      }
    };
    for (var i = "break else new var case finally return void catch for switch while continue function this with default if throw delete in try do instanceof typeof abstract enum int short boolean export interface static byte extends long super char final native synchronized class float package throws const goto private transient debugger implements protected volatile double import public let yield".split(" "), r = e.RESERVED_WORDS = {}, s = 0, a = i.length; a > s; s++) r[i[s]] = !0;
    e.isValidJavaScriptVariableName = function(t) {
      return !e.RESERVED_WORDS[t] && /^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(t) ? !0 : !1;
    };
  }(Handlebars.Compiler, Handlebars.JavaScriptCompiler), Handlebars.precompile = function(t, e) {
    e = e || {};
    var n = Handlebars.parse(t), i = new Handlebars.Compiler().compile(n, e);
    return new Handlebars.JavaScriptCompiler().compile(i, e);
  }, Handlebars.compile = function(t, e) {
    function n() {
      var n = Handlebars.parse(t), i = new Handlebars.Compiler().compile(n, e), r = new Handlebars.JavaScriptCompiler().compile(i, e, void 0, !0);
      return Handlebars.template(r);
    }
    e = e || {};
    var i;
    return function(t, e) {
      return i || (i = n()), i.call(this, t, e);
    };
  }, Handlebars.VM = {
    template: function(t) {
      var e = {
        escapeExpression: Handlebars.Utils.escapeExpression,
        invokePartial: Handlebars.VM.invokePartial,
        programs: [],
        program: function(t, e, n) {
          var i = this.programs[t];
          return n ? Handlebars.VM.program(e, n) : i ? i : i = this.programs[t] = Handlebars.VM.program(e);
        },
        programWithDepth: Handlebars.VM.programWithDepth,
        noop: Handlebars.VM.noop
      };
      return function(n, i) {
        return i = i || {}, t.call(e, Handlebars, n, i.helpers, i.partials, i.data);
      };
    },
    programWithDepth: function(t, e) {
      var n = Array.prototype.slice.call(arguments, 2);
      return function(i, r) {
        return r = r || {}, t.apply(this, [ i, r.data || e ].concat(n));
      };
    },
    program: function(t, e) {
      return function(n, i) {
        return i = i || {}, t(n, i.data || e);
      };
    },
    noop: function() {
      return "";
    },
    invokePartial: function(t, e, n, i, r, s) {
      var a = {
        helpers: i,
        partials: r,
        data: s
      };
      if (void 0 === t) throw new Handlebars.Exception("The partial " + e + " could not be found");
      if (t instanceof Function) return t(n, a);
      if (Handlebars.compile) return r[e] = Handlebars.compile(t, {
        data: void 0 !== s
      }), r[e](n, a);
      throw new Handlebars.Exception("The partial " + e + " could not be compiled when running in runtime-only mode");
    }
  }, Handlebars.template = Handlebars.VM.template, Handlebars;
}), define("store", function(t, e, n) {
  (function() {
    function t() {
      try {
        return u in o && o[u];
      } catch (t) {
        return !1;
      }
    }
    function e() {
      try {
        return l in o && o[l] && o[l][o.location.hostname];
      } catch (t) {
        return !1;
      }
    }
    function i(t) {
      return function() {
        var e = Array.prototype.slice.call(arguments, 0);
        e.unshift(s), p.appendChild(s), s.addBehavior("#default#userData"), s.load(u);
        var n = t.apply(a, e);
        return p.removeChild(s), n;
      };
    }
    function r(t) {
      return t.replace(m, "___");
    }
    var s, a = {}, o = window, c = o.document, u = "localStorage", l = "globalStorage", h = "__storejs__";
    if (a.disabled = !1, a.set = function() {}, a.get = function() {}, a.remove = function() {}, 
    a.clear = function() {}, a.transact = function(t, e, n) {
      var i = a.get(t);
      null == n && (n = e, e = null), i === void 0 && (i = e || {}), n(i), a.set(t, i);
    }, a.getAll = function() {}, a.serialize = function(t) {
      return JSON.stringify(t);
    }, a.deserialize = function(t) {
      if ("string" != typeof t) return void 0;
      try {
        return JSON.parse(t);
      } catch (e) {
        return t || void 0;
      }
    }, t()) s = o[u], a.set = function(t, e) {
      return void 0 === e ? a.remove(t) : (s.setItem(t, a.serialize(e)), e);
    }, a.get = function(t) {
      return a.deserialize(s.getItem(t));
    }, a.remove = function(t) {
      s.removeItem(t);
    }, a.clear = function() {
      s.clear();
    }, a.getAll = function() {
      for (var t = {}, e = 0; s.length > e; ++e) {
        var n = s.key(e);
        t[n] = a.get(n);
      }
      return t;
    }; else if (e()) s = o[l][o.location.hostname], a.set = function(t, e) {
      return void 0 === e ? a.remove(t) : (s[t] = a.serialize(e), e);
    }, a.get = function(t) {
      return a.deserialize(s[t] && s[t].value);
    }, a.remove = function(t) {
      delete s[t];
    }, a.clear = function() {
      for (var t in s) delete s[t];
    }, a.getAll = function() {
      for (var t = {}, e = 0; s.length > e; ++e) {
        var n = s.key(e);
        t[n] = a.get(n);
      }
      return t;
    }; else if (c.documentElement.addBehavior) {
      var p, d;
      try {
        d = new ActiveXObject("htmlfile"), d.open(), d.write('<script>document.w=window</script><iframe src="/favicon.ico"></frame>'), 
        d.close(), p = d.w.frames[0].document, s = p.createElement("div");
      } catch (f) {
        s = c.createElement("div"), p = c.body;
      }
      var m = RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g");
      a.set = i(function(t, e, n) {
        return e = r(e), void 0 === n ? a.remove(e) : (t.setAttribute(e, a.serialize(n)), 
        t.save(u), n);
      }), a.get = i(function(t, e) {
        return e = r(e), a.deserialize(t.getAttribute(e));
      }), a.remove = i(function(t, e) {
        e = r(e), t.removeAttribute(e), t.save(u);
      }), a.clear = i(function(t) {
        var e = t.XMLDocument.documentElement.attributes;
        t.load(u);
        for (var n, i = 0; n = e[i]; i++) t.removeAttribute(n.name);
        t.save(u);
      }), a.getAll = i(function(t) {
        var e = t.XMLDocument.documentElement.attributes;
        t.load(u);
        for (var n, i = {}, r = 0; n = e[r]; ++r) i[n] = a.get(n);
        return i;
      });
    }
    try {
      a.set(h, h), a.get(h) != h && (a.disabled = !0), a.remove(h);
    } catch (f) {
      a.disabled = !0;
    }
    a.enabled = !a.disabled, n !== void 0 && "function" != typeof n ? n.exports = a : "function" == typeof define && define.amd ? define(a) : this.store = a;
  })();
});

var TWEEN = TWEEN || function() {
  var t = [];
  return {
    REVISION: "10",
    getAll: function() {
      return t;
    },
    removeAll: function() {
      t = [];
    },
    add: function(e) {
      t.push(e);
    },
    remove: function(e) {
      var n = t.indexOf(e);
      -1 !== n && t.splice(n, 1);
    },
    update: function(e) {
      var n = t.length;
      if (0 === n) return !1;
      var i, r = 0;
      for (e = void 0 !== e ? e : void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now(); n > r; ) i = t[r], 
      i && i.update(e) ? r++ : (t.splice(r, 1), n--);
      return !0;
    }
  };
}();

TWEEN.Tween = function(t) {
  var e = t, n = {}, i = {}, r = {}, s = 1e3, a = 0, o = 0, c = null, u = TWEEN.Easing.Linear.None, l = TWEEN.Interpolation.Linear, h = [], p = null, d = !1, f = null, m = null;
  for (var v in t) n[v] = parseFloat(t[v], 10);
  this.to = function(t, e) {
    return void 0 !== e && (s = e), i = t, this;
  }, this.start = function(t) {
    TWEEN.add(this), d = !1, c = void 0 !== t ? t : void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now(), 
    c += o;
    for (var s in i) {
      if (i[s] instanceof Array) {
        if (0 === i[s].length) continue;
        i[s] = [ e[s] ].concat(i[s]);
      }
      n[s] = e[s], n[s] instanceof Array == !1 && (n[s] *= 1), r[s] = n[s] || 0;
    }
    return this;
  }, this.stop = function() {
    return TWEEN.remove(this), this;
  }, this.delay = function(t) {
    return o = t, this;
  }, this.repeat = function(t) {
    return a = t, this;
  }, this.easing = function(t) {
    return u = t, this;
  }, this.interpolation = function(t) {
    return l = t, this;
  }, this.chain = function() {
    return h = arguments, this;
  }, this.onStart = function(t) {
    return p = t, this;
  }, this.onUpdate = function(t) {
    return f = t, this;
  }, this.onComplete = function(t) {
    return m = t, this;
  }, this.update = function(t) {
    if (c > t) return !0;
    d === !1 && (null !== p && p.call(e), d = !0);
    var v = (t - c) / s;
    v = v > 1 ? 1 : v;
    var g = u(v);
    for (var y in i) {
      var b = n[y] || 0, w = i[y];
      w instanceof Array ? e[y] = l(w, g) : ("string" == typeof w && (w = b + parseFloat(w, 10)), 
      e[y] = b + (w - b) * g);
    }
    if (null !== f && f.call(e, g), 1 == v) {
      if (a > 0) {
        isFinite(a) && a--;
        for (var y in r) "string" == typeof i[y] && (r[y] = r[y] + parseFloat(i[y], 10)), 
        n[y] = r[y];
        return c = t + o, !0;
      }
      null !== m && m.call(e);
      for (var k = 0, x = h.length; x > k; k++) h[k].start(t);
      return !1;
    }
    return !0;
  };
}, TWEEN.Easing = {
  Linear: {
    None: function(t) {
      return t;
    }
  },
  Quadratic: {
    In: function(t) {
      return t * t;
    },
    Out: function(t) {
      return t * (2 - t);
    },
    InOut: function(t) {
      return 1 > (t *= 2) ? .5 * t * t : -.5 * (--t * (t - 2) - 1);
    }
  },
  Cubic: {
    In: function(t) {
      return t * t * t;
    },
    Out: function(t) {
      return --t * t * t + 1;
    },
    InOut: function(t) {
      return 1 > (t *= 2) ? .5 * t * t * t : .5 * ((t -= 2) * t * t + 2);
    }
  },
  Quartic: {
    In: function(t) {
      return t * t * t * t;
    },
    Out: function(t) {
      return 1 - --t * t * t * t;
    },
    InOut: function(t) {
      return 1 > (t *= 2) ? .5 * t * t * t * t : -.5 * ((t -= 2) * t * t * t - 2);
    }
  },
  Quintic: {
    In: function(t) {
      return t * t * t * t * t;
    },
    Out: function(t) {
      return --t * t * t * t * t + 1;
    },
    InOut: function(t) {
      return 1 > (t *= 2) ? .5 * t * t * t * t * t : .5 * ((t -= 2) * t * t * t * t + 2);
    }
  },
  Sinusoidal: {
    In: function(t) {
      return 1 - Math.cos(t * Math.PI / 2);
    },
    Out: function(t) {
      return Math.sin(t * Math.PI / 2);
    },
    InOut: function(t) {
      return .5 * (1 - Math.cos(Math.PI * t));
    }
  },
  Exponential: {
    In: function(t) {
      return 0 === t ? 0 : Math.pow(1024, t - 1);
    },
    Out: function(t) {
      return 1 === t ? 1 : 1 - Math.pow(2, -10 * t);
    },
    InOut: function(t) {
      return 0 === t ? 0 : 1 === t ? 1 : 1 > (t *= 2) ? .5 * Math.pow(1024, t - 1) : .5 * (-Math.pow(2, -10 * (t - 1)) + 2);
    }
  },
  Circular: {
    In: function(t) {
      return 1 - Math.sqrt(1 - t * t);
    },
    Out: function(t) {
      return Math.sqrt(1 - --t * t);
    },
    InOut: function(t) {
      return 1 > (t *= 2) ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
    }
  },
  Elastic: {
    In: function(t) {
      var e, n = .1, i = .4;
      return 0 === t ? 0 : 1 === t ? 1 : (!n || 1 > n ? (n = 1, e = i / 4) : e = i * Math.asin(1 / n) / (2 * Math.PI), 
      -(n * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - e) * 2 * Math.PI / i)));
    },
    Out: function(t) {
      var e, n = .1, i = .4;
      return 0 === t ? 0 : 1 === t ? 1 : (!n || 1 > n ? (n = 1, e = i / 4) : e = i * Math.asin(1 / n) / (2 * Math.PI), 
      n * Math.pow(2, -10 * t) * Math.sin((t - e) * 2 * Math.PI / i) + 1);
    },
    InOut: function(t) {
      var e, n = .1, i = .4;
      return 0 === t ? 0 : 1 === t ? 1 : (!n || 1 > n ? (n = 1, e = i / 4) : e = i * Math.asin(1 / n) / (2 * Math.PI), 
      1 > (t *= 2) ? -.5 * n * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - e) * 2 * Math.PI / i) : .5 * n * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - e) * 2 * Math.PI / i) + 1);
    }
  },
  Back: {
    In: function(t) {
      var e = 1.70158;
      return t * t * ((e + 1) * t - e);
    },
    Out: function(t) {
      var e = 1.70158;
      return --t * t * ((e + 1) * t + e) + 1;
    },
    InOut: function(t) {
      var e = 2.5949095;
      return 1 > (t *= 2) ? .5 * t * t * ((e + 1) * t - e) : .5 * ((t -= 2) * t * ((e + 1) * t + e) + 2);
    }
  },
  Bounce: {
    In: function(t) {
      return 1 - TWEEN.Easing.Bounce.Out(1 - t);
    },
    Out: function(t) {
      return 1 / 2.75 > t ? 7.5625 * t * t : 2 / 2.75 > t ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375;
    },
    InOut: function(t) {
      return .5 > t ? .5 * TWEEN.Easing.Bounce.In(2 * t) : .5 * TWEEN.Easing.Bounce.Out(2 * t - 1) + .5;
    }
  }
}, TWEEN.Interpolation = {
  Linear: function(t, e) {
    var n = t.length - 1, i = n * e, r = Math.floor(i), s = TWEEN.Interpolation.Utils.Linear;
    return 0 > e ? s(t[0], t[1], i) : e > 1 ? s(t[n], t[n - 1], n - i) : s(t[r], t[r + 1 > n ? n : r + 1], i - r);
  },
  Bezier: function(t, e) {
    var n, i = 0, r = t.length - 1, s = Math.pow, a = TWEEN.Interpolation.Utils.Bernstein;
    for (n = 0; r >= n; n++) i += s(1 - e, r - n) * s(e, n) * t[n] * a(r, n);
    return i;
  },
  CatmullRom: function(t, e) {
    var n = t.length - 1, i = n * e, r = Math.floor(i), s = TWEEN.Interpolation.Utils.CatmullRom;
    return t[0] === t[n] ? (0 > e && (r = Math.floor(i = n * (1 + e))), s(t[(r - 1 + n) % n], t[r], t[(r + 1) % n], t[(r + 2) % n], i - r)) : 0 > e ? t[0] - (s(t[0], t[0], t[1], t[1], -i) - t[0]) : e > 1 ? t[n] - (s(t[n], t[n], t[n - 1], t[n - 1], i - n) - t[n]) : s(t[r ? r - 1 : 0], t[r], t[r + 1 > n ? n : r + 1], t[r + 2 > n ? n : r + 2], i - r);
  },
  Utils: {
    Linear: function(t, e, n) {
      return (e - t) * n + t;
    },
    Bernstein: function(t, e) {
      var n = TWEEN.Interpolation.Utils.Factorial;
      return n(t) / n(e) / n(t - e);
    },
    Factorial: function() {
      var t = [ 1 ];
      return function(e) {
        var n, i = 1;
        if (t[e]) return t[e];
        for (n = e; n > 1; n--) i *= n;
        return t[e] = i;
      };
    }(),
    CatmullRom: function(t, e, n, i, r) {
      var s = .5 * (n - t), a = .5 * (i - e), o = r * r, c = r * o;
      return (2 * e - 2 * n + s + a) * c + (-3 * e + 3 * n - 2 * s - a) * o + s * r + e;
    }
  }
}, "function" == typeof define && define("tween", function() {
  return TWEEN;
}), define("af", function() {
  "use strict";
  var t = window.performance && window.performance.now, e = t ? function() {
    return window.performance.now();
  } : Date.now || function() {
    return new Date().getTime();
  }, n = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame, i = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame;
  if (!n) {
    var r = 0;
    n = function(t) {
      var n = e(), i = Math.max(0, 16 - (n - r)), s = setTimeout(function() {
        t(n + i);
      }, i);
      return r = n + i, s;
    };
  }
  return i || (i = function(t) {
    clearTimeout(t);
  }), {
    request: n,
    cancel: i
  };
}), define("util", function() {
  "use strict";
  var t = /^\s+/, e = /\s+$/, n = /[^0-9a-zA-Z_\u4e00-\u9fa5\ \'\.]+/g, i = String.prototype.trim, r = {
    zh_CN: n,
    cut30length: function(t, e) {
      if (!t) return "";
      for (t = t.replace(n, " "), e || (e = 30); r.utf8length(t) > e; ) t = t.substring(0, t.length - 1);
      return t;
    },
    utf8length: function(t) {
      for (var e, n = t.length, i = 0, r = 0; n > r; r++) if (e = t.charCodeAt(r), 127 > e) i++; else if (2047 >= e) i += 2; else if (55295 >= e || e >= 57344) i += 3; else {
        if (!(56319 >= e)) throw "Error: Invalid UTF-16 sequence. Missing high-surrogate code.";
        if (e = t.charCodeAt(++r), 56320 > e || e > 57343) throw "Error: Invalid UTF-16 sequence. Missing low-surrogate code.";
        i += 4;
      }
      return i;
    },
    trim: i ? function(t) {
      return null == t ? "" : i.call(t);
    } : function(n) {
      return null == n ? "" : ("" + n).replace(t, "").replace(e, "");
    },
    parseId: function() {
      var t = /^([a-z0-9_\.]{1,})@facebook$/i, e = /^@([a-z0-9_]{1,15})$|^@?([a-z0-9_]{1,15})@twitter$/i, n = /^([a-z0-9_\.]{1,})@instagram$/i, i = /^(.*)@dropbox$/i, s = /^(.*)@flickr$/i, a = /^[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i, o = /^[^@]*<[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?>$/i, c = /^(\+)?((?:(86)?(1(?:3\d|4[57]|5\d|8\d)\d{8}))|(?:(1)?(\d{5,15})))$/;
      return function(u) {
        var l, h = {};
        if (u = r.trim(u), (l = u.match(i)) && a.test(l[1])) h.name = l[1], h.external_username = l[1], 
        h.provider = "dropbox"; else if (l = u.match(s)) h.name = l[1], h.external_username = l[1], 
        h.provider = "flickr"; else if (l = u.match(n)) h.name = l[1], h.external_username = l[1], 
        h.provider = "instagram"; else if (l = u.match(t)) h.name = l[1], h.external_username = l[1], 
        h.provider = "facebook"; else if (l = u.match(e)) h.name = l[1] || l[2], h.external_username = h.name, 
        h.provider = "twitter"; else if (a.test(u)) h.name = r.cut30length(u.split("@")[0]), 
        h.external_username = u, h.provider = "email"; else if (o.test(u)) {
          var p = u.indexOf("<");
          h.name = r.cut30length(u.substring(0, p).replace(/^"|^'|"$|'$/g, "")), h.external_username = h.name, 
          h.provider = "email";
        } else if (l = u.replace(/[\s\-\(\)\_]/g, "").match(c)) {
          var d, f, m = l[1];
          h.provider = "phone", m ? l[3] && l[4] ? (d = l[3], f = l[4], h.name = h.external_username = m + d + f) : l[5] && l[6] ? (d = l[5], 
          f = l[6], h.name = h.external_username = m + d + f) : (h.name = u, h.provider = null) : (m = "+", 
          l[4] ? (d = "86", f = l[4]) : (d = "1", f = l[2]), h.name = h.external_username = m + d + f);
        } else h.name = u, h.provider = null;
        return h;
      };
    }(),
    tokenRegExp: /token=([a-zA-Z0-9]{32})/,
    printExtUserName: function(t, e) {
      var n = t.external_username, i = t.provider;
      switch (i) {
       case "twitter":
        n = "@" + n + "@" + i;
        break;

       case "facebook":
       case "instagram":
       case "flickr":
       case "dropbox":
        n += "@" + i;
        break;

       case "phone":
        e && (/^\+1\d{10}$/.test(n) ? n = n.replace(/^(\+1)(\d{3})(\d{3})(\d{4})$/, "$1 ($2) $3-$4") : /^\+86\d{11}$/.test(n) && (n = n.replace(/^(\+86)(\d{3})(\d{4})(\d{4})$/, "$1 $2 $3 $4")));
      }
      return n;
    }
  };
  return r;
}), function() {
  "use strict";
  var t = /(?:\{\{|%\{)(\w*?)(?:\}\}?)/gm, e = /^\d{4}-\d{2}-\d{2}$/, n = /^\d{2}:\d{2}:\d{2}$/, i = .2, r = 6e4, s = 864e5, a = {
    monthsShort: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
    months: "January February March April May June July August September October November December".split(" "),
    weekdaysShort: "Sun Mon Tue Wed Thu Fri Sat".split(" "),
    weekdays: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
    "-1": function() {
      return "Today";
    },
    "0": function(t) {
      var e = "", n = t.years, i = t.months;
      return n && (e = "{{years}} year" + (1 === n ? "" : "s")), i && (e += (e ? " " : "") + "{{months}} month" + (1 === i ? "" : "s")), 
      e + " ago";
    },
    "1": function(t) {
      var e = "", n = t.days;
      return e = 1 === n ? "Yesterday" : 2 === n ? "Two days ago" : "{{days}} days ago";
    },
    "2": function(t) {
      var e = "", n = t.isToday, i = t.hours;
      return e = !n && i >= 12 ? "Yesterday" : "{{hours}} hours ago";
    },
    "3": function() {
      return "1.5 hours ago";
    },
    "4": function() {
      return "An hour ago";
    },
    "5": function(t, e) {
      return "X" === e ? "Just now" : "{{minutes}} minutes ago";
    },
    "6": function(t, e) {
      return "X" === e ? "Now" : "{{minutes}} minutes ago";
    },
    "7": function(t, e) {
      return "X" === e ? "Now" : "Seconds ago";
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
    "11": function(t) {
      var e = "", n = t.isToday, i = t.hours;
      return e = !n && i >= 12 ? "Tomorrow" : "In {{hours}} hours";
    },
    "12": function(t) {
      var e = "", n = t.days, i = t.day;
      return e = 1 === n ? "Tomorrow" : 2 === n ? "In two days" : a.weekdaysShort[i] + ". in {{days}} days";
    },
    "13": function(t) {
      var e = "", n = t.years, i = t.months;
      return n && (e = "{{years}} year" + (1 === n ? "" : "s")), i && (e += (e ? " " : "") + "{{months}} month" + (1 === i ? "" : "s")), 
      "In " + e;
    }
  }, o = function(t, e, n, i) {
    var r, s = o.locales[o.locale], a = o.distanceOfTime(t, e), c = o.diff(a);
    return c.type = n, r = o.inWords(c, s), "function" == typeof i && (r = i(r.data)), 
    r;
  }, c = o.parseISO = function(t) {
    return new Date(Date.parse(t));
  }, u = o.toISO = function(t) {
    return t.replace(/\s/, "T").replace(/\s/, "").replace(/([+\-]\d\d)(?::?)(\d\d)/, "$1:$2");
  };
  o.locale = "en", o.locales = {
    en: a
  }, o.inWords = function(t, e) {
    var n, i = e[t.token], r = t.type, s = t.date;
    return n = "function" == typeof i ? i(s, r) : i, v(n, s);
  }, o.diff = function(t) {
    var e, n, s, a, o, c, u = t.target, l = t.distance, h = g(l / r), p = {
      date: {}
    }, d = p.date, f = t.days;
    return d.isToday = t.isToday, u._isToday ? p.token = -1 : -43199 > h ? (p.token = 0, 
    s = g(-h / 525949), n = g(-h % 525949 / 43829 + i)) : -1439 > h ? (p.token = 1, 
    e = 3 > -f ? -f : g((-h + 1439) / 1440)) : -107 > h ? (p.token = 2, a = g(-h / 60 + i)) : -81 > h ? p.token = 3 : -59 > h ? p.token = 4 : -29 > h ? (p.token = 5, 
    o = -h) : 0 > h ? (p.token = 6, o = -h) : 0 === h ? p.token = 7 : 60 > h ? (p.token = 8, 
    o = h) : 82 > h ? p.token = 9 : 108 > h ? p.token = 10 : 1440 > h ? (p.token = 11, 
    a = g(h / 60 + i)) : 43200 > h ? (p.token = 12, e = 3 > f ? f : g((h + 1439) / 1440), 
    c = u.getDay()) : (p.token = 13, s = g(h / 525949), n = g(h % 525949 / 43829 + i), 
    12 === n && (n = 0, s++)), s && (d.years = s), n && (d.months = n), e && (d.days = e), 
    a && (d.hours = a), o && (d.minutes = o), c !== void 0 && (d.day = c), p;
  }, o.distanceOfTime = function(t, e) {
    t ? "number" == typeof t ? t = new Date(t) : "string" == typeof t && (t = c(u(t))) : t = new Date(), 
    e ? "number" == typeof e ? e = new Date(e) : "string" == typeof e && (e = c(u(e))) : e = new Date(), 
    t._reTime && (e.setHours(0), e.setMinutes(0), e.setSeconds(0), e.setMilliseconds(0));
    var n = t.getFullYear(), i = t.getMonth(), r = t.getDate(), a = e.getFullYear(), o = e.getMonth(), l = e.getDate();
    return {
      target: t,
      source: e,
      distance: +t - +e,
      days: (+new Date(n, i, r) - +new Date(a, o, l)) / s,
      isToday: n === a && i === o && r === l
    };
  }, o.toLocaleDate = function(t) {
    var e, n, i, r = t.outputformat, s = new Date(), a = s.getFullYear() + "-" + d(s.getMonth() + 1) + "-" + d(s.getDate()), o = !1, u = !1;
    if (r) e = s, i = a, o = !0; else {
      var l = t.begin_at, h = l.date, p = l.time, v = l.timezone, g = "";
      h ? (g = f(h), p ? g += "T" + m(p) : (u = !0, o = g === a)) : (g = a, p && (g += "T" + m(p))), 
      h && p && v && (g += "Z"), e = c(g), u && (e.setHours(0), e.setMinutes(0), e.setSeconds(0), 
      e.setMilliseconds(0)), n = i = e.getFullYear() + "-" + d(e.getMonth() + 1) + "-" + d(e.getDate()), 
      i += p ? " " + d(e.getHours()) + ":" + d(e.getMinutes()) + ":" + d(e.getSeconds()) : "";
    }
    return e._isToday = o, e._reTime = u, {
      date: e,
      text: i
    };
  };
  var l = {
    date: function(t, e, n, i) {
      var r = o.locales[o.locale];
      return r.weekdaysShort[i] + ", " + r.monthsShort[e] + " " + n;
    },
    time: function(t, e) {
      var n = t > 12 ? t - 12 : t, i = n + ":" + d(e);
      return i += t >= 12 ? "PM" : "AM";
    }
  };
  o.printEFTime = function(t, e, n) {
    var i, r, s, a, c, u = t.outputformat, d = t.begin_at, f = "X" === e, m = {
      title: "",
      content: ""
    }, v = new Date();
    if (u) i = t.origin.replace(/^['"‘’“”“”‚„]+/, "").replace(/['"‘’“”“”‚„]+$/, ""), 
    m.title = i, f || (m.content = i, d.date && (t.outputformat = 0, r = o.toLocaleDate(t), 
    m.content = o(r.date, v), t.outputformat = 1)); else if (n || (n = l), d && (d.date || d.time ? (r = o.toLocaleDate(t), 
    s = r.date, d.date ? (m.title = o(r.date, v, "X"), m.content = d.time_word + (d.time_word && d.time ? " " : "") + (d.time ? n.time(s.getHours(), s.getMinutes()) : "") + (d.time || d.time_word ? d.time ? " " : ", " : "") + n.date(s.getFullYear(), s.getMonth(), s.getDate(), s.getDay()) + (d.date_word ? " " : "") + d.date_word) : d.time && (m.content = m.title = d.time_word + (d.time_word ? " " : "") + n.time(s.getHours(), s.getMinutes()) + (d.date_word ? ", " : "") + d.date_word), 
    s.getFullYear() !== v.getFullYear() && (m.content += " " + s.getFullYear())) : (d.date_word || d.time_word) && (m.content = m.title = d.time_word + (d.time_word ? ", " : "") + d.date_word), 
    d.timezone && (a = d.timezone.replace(/^([+\-]\d\d:\d\d)[\w\W]*$/, "$1"), c = h(v), 
    a !== c))) {
      var g = p(v);
      m.content += " (" + c + (g && " " + g) + ")";
    }
    return m;
  }, o.printTime = function(t, e) {
    t || (t = new Date()), e || (e = l);
    var n = new Date(), i = "";
    return i += e.date(t.getFullYear(), t.getMonth(), t.getDate(), t.getDay()) + " " + e.time(t.getHours(), t.getMinutes()), 
    t.getFullYear() !== n.getFullYear() && (i += " " + t.getFullYear()), i;
  };
  var h = o.getTimezone = function(t) {
    var e, n, i, r;
    return t || (t = new Date()), e = t.getTimezoneOffset(), r = 0 >= e ? "+" : "-", 
    e = Math.abs(e), n = g(e / 60), i = e - 60 * n, r + d(n) + ":" + d(i);
  }, p = function(t) {
    var e;
    return t || (t = new Date()), e = ("" + t).replace(/^.*:\d\d( GMT[+-]\d+)? \(?([A-Za-z ]+)\)?\d*$/, "$2").replace(/[a-z ]/g, ""), 
    3 === e.length ? e : "";
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
  var d = o.lead0 = function(t, e) {
    for (t = "" + t, e || (e = 2); e > t.length; ) t = "0" + t;
    return t;
  }, f = o.formatDate = function(t) {
    var n;
    return e.test(t) ? n = t : (n = t.split("-"), n[1] = d(n[1]), n[2] = d(n[2]), n = n.join("-")), 
    n;
  }, m = o.formatTime = function(t) {
    var e;
    return n.test(t) ? e = t : (e = t.split(":"), e[0] = d(e[0]), e[1] = d(e[1]), e[2] = d(e[2]), 
    e = e.join(":")), e;
  }, v = function(e, n) {
    var i, r, s, a, o = e.match(t), c = 0;
    if (o) for (;a = o[c]; ++c) r = a.replace(t, "$1"), s = n[r], i = RegExp(a.replace(/\{/gm, "\\{").replace(/\}/gm, "\\}")), 
    e = e.replace(i, s);
    return e;
  }, g = function(t) {
    return t - t % 1;
  };
  "function" == typeof define && define("humantime", function() {
    return o;
  });
}(), define("lightsaber", function(t, e, n) {
  "use strict";
  function i() {
    var t = new r();
    return v(t, b.prototype), t.request = new s(), t.response = new a(), t.init(), t;
  }
  function r() {}
  function s(t) {
    this.enableFullUrlPath = !!t, this.session = {}, this.path = "/", this.method = "GET", 
    this.updateUrl();
  }
  function a(t, e) {
    this.path = t, this.title = document.title, this.state = e || {};
  }
  function o(t) {
    t = t || {};
    var e = this;
    this.map = [], this.params = {}, this._params = [], this.caseSensitive = t.caseSensitive, 
    this.strict = t.strict, this.middleware = function(t, n, i) {
      e._dispatch(t, n, i);
    };
  }
  function c(t, e, n) {
    n = n || {}, this.path = t, this.callbacks = e, this.regexp = g(t, this.keys = [], n.sensitive, n.strict);
  }
  function u(t, e, n) {
    e = e || {}, this.name = t, this.root = e.root, this.engine = e.engine, this.ext = f(t), 
    this.timestamp = n || "", this.path = this.lookup(t);
  }
  function l(t) {
    return function(e, n, i) {
      e.app = n.app = t, e.next = i, n.locals = n.locals || m(n), i();
    };
  }
  function h() {
    return ++h.id;
  }
  function p(t, e, n) {
    var i = t.length;
    if (!i) return -1;
    if (n || (n = 0), n > i) return -1;
    for (0 > n && (n = Math.max(0, i + n)); i > n; ++n) if (n in t && t[n] === e) return n;
    return -1;
  }
  function d(t, e, n, i, r) {
    return w.get(e, function(e) {
      var s, a = e;
      "html" !== r && (s = t.compile(e), a = s(n)), i(a);
    });
  }
  function f(t) {
    return t.split(".")[1] || "html";
  }
  function m(t) {
    function e(t) {
      for (var n in t) e[n] = t[n];
      return t;
    }
    return t.viewCallbacks = t.viewCallbacks || [], e;
  }
  function v(t, e) {
    var n;
    if (t && e) for (n in e) t[n] = e[n];
    return t;
  }
  function g(t, e, n, i) {
    return t instanceof RegExp ? t : (T(t) && (t = "(" + t.join("|") + ")"), t = t.concat(i ? "" : "/?").replace(/\/\(/g, "(?:/").replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function(t, n, i, r, s, a, o) {
      return e.push({
        name: r,
        optional: !!a
      }), n = n || "", "" + (a ? "" : n) + "(?:" + (a ? n : "") + (i || "") + (s || i && "([^/.]+?)" || "([^/]+?)") + ")" + (a || "") + (o ? "(/*)?" : "");
    }).replace(/([\/.])/g, "\\$1").replace(/\*/g, "(.*)"), RegExp("^" + t + "$", n ? "" : "i"));
  }
  var y, b = t("emitter"), w = t("jquery") || t("zepto"), k = w.proxy, x = window.location, _ = window.history, E = "/", C = !1;
  w(window).on("load", function() {
    C = !0, setTimeout(function() {
      C = !1;
    }, 0);
  }), e = n.exports = i;
  var S;
  e.version = "0.0.5", S = r.prototype, S.historySupport = y = null !== (null !== _ ? _.pushState : void 0), 
  w.browser && w.browser.opera && (S.historySupport = y = !1), S.init = function() {
    this.route = E, this.stack = [], this.cache = {}, this.settings = {}, this.engines = {}, 
    this.viewCallbacks = [], this.defaultConfiguration();
  }, S.defaultConfiguration = function() {
    this.set("env", "production"), this.enable("dispatch"), this.use(l(this)), this._usedRouter = !1, 
    this._router = new o(this), this.routes = this._router.map, this._router.caseSensitive = this.enabled("case sensitive routing"), 
    this._router.strict = this.enabled("strict routing"), this.locals = m(this), this.locals.settings = this.settings, 
    this.configure("development", function() {
      this.set("env", "development");
    }), this.configure("production", function() {
      this.enable("view cache");
    });
  }, S.use = function(t, e) {
    return "string" != typeof t && (e = t, t = E), E !== t && E === t[t.length - 1] && (t = t.slice(0, -1)), 
    this.stack.push({
      route: t,
      handle: e
    }), this;
  }, S.engine = function(t, e) {
    if ("function" != typeof e) throw Error("callback function required");
    return "." !== t[0] && (t = "." + t), this.engines[t] = e, this;
  }, S.set = function(t, e) {
    return 1 !== arguments.length ? (this.settings[t] = e, this) : this.settings.hasOwnProperty(t) ? this.settings[t] : void 0;
  }, S.enabled = function(t) {
    return !!this.set(t);
  }, S.disabled = function(t) {
    return !this.set(t);
  }, S.enable = function(t) {
    return this.set(t, !0);
  }, S.disable = function(t) {
    return this.set(t, !1);
  }, S.configure = function(t, e) {
    var n = "all", i = [].slice.call(arguments);
    return e = i.pop(), i.length && (n = i), ("all" === n || ~p(n, this.settings.env)) && e.call(this), 
    this;
  }, S.render = function(t, e, n) {
    var i, r = {}, s = this.cache;
    if (this.engine, "function" == typeof e && (n = e, e = {}), v(r, this.locals), e.locals && v(r, e.locals), 
    v(r, e), r.cache = null === r.cache ? this.enabled("view cache") : r.cache, r.cache && (i = s[t]), 
    !i) {
      if (i = new u(t, {
        engine: this.set("view engine"),
        root: this.set("views")
      }, this.set("timestamp")), !i.path) {
        var a = Error('Failed to lookup view "' + t + '"');
        return a.view = i, n(a);
      }
      r.cache && (s[t] = i);
    }
    try {
      i.render(r, n);
    } catch (a) {
      n(a);
    }
  }, S.path = function() {
    return this.route;
  }, S.param = function(t, e) {
    var n, i = [].slice.call(arguments, 1), r = 0;
    if (T(t)) for (n = t.length; n > r; ++r) for (var s = 0, a = i.length; a > s; ++s) this.param(t[r], i[s]); else if ("function" == typeof t) this._router.param(t); else for (":" === t[0] && (t = t.substr(1)), 
    n = i.length; n > r; ++r) this._router.param(t, e);
    return this;
  }, S.initRouter = function() {
    this._usedRouter === !1 && (this._usedRouter = !0, this.use(this._router.middleware));
  }, S.get = function() {
    var t = [].slice.call(arguments);
    return this.initRouter(), this._router.route.apply(this._router, t);
  }, S.handle = function(t, e) {
    function n(o) {
      var c, u = i[a++];
      if (s && (t.url = t.url.substr(1), s = !1), t.url = r + t.url, u) try {
        if (c = t.url, 0 !== c.indexOf(u.route)) return n(o);
        var l = u.handle.length;
        r = u.route, t.url = t.url.substr(r.length), "/" !== t.url[0] && (t.url = "/" + t.url, 
        s = !0), o ? 4 === l ? u.handle(o, t, e, n) : n(o) : 4 > l ? u.handle(t, e, n) : n();
      } catch (h) {
        n(h);
      }
    }
    var i = this.stack, r = "", s = !1, a = 0;
    n();
  }, S.run = function(t) {
    this.emit("launch"), t = t || {};
    var e = this.request, n = this.response;
    this.running || (this.running = !0, !1 === t.dispatch && this.disable("dispatch"), 
    !1 !== t.popstate && (this.historySupport ? w(window).on("popstate", k(this.change, this)) : w(window).on("hashchange", k(this.change, this))), 
    this.disabled("dispatch") || (this.handle(e, n), this.emit("launched")));
  }, S.change = function(t) {
    if (C) return C = !1;
    var e = this, n = e.request, i = e.response, r = n.url;
    return n.updateUrl(), "/" === r || r !== n.url ? (e.handle(n, i), t.stopPropagation(), 
    t.preventDefault(), !1) : void 0;
  }, S.error = function(t, e) {
    var n = Error(e);
    return n.status = t, n;
  }, S = s.prototype, S.updateUrl = function() {
    this.host = x.hostname, this.port = x.port || 80, this.fullpath = x.pathname, this.enableFullUrlPath && (this.path = this.fullpath), 
    this.hash = decodeURIComponent(x.hash), this.querystring = decodeURIComponent(x.search), 
    this.url = this.path + this.querystring + this.hash;
  }, S.param = function(t, e) {
    var n = this.params || {}, i = this.query || {};
    return null != n[t] && n.hasOwnProperty(t) ? n[t] : null != i[t] ? i[t] : e;
  }, S.getPath = function() {
    return this.path;
  }, S.getHost = function() {
    return this.host;
  }, S = a.prototype, S.location = function(t) {
    window.setTimeout(function() {
      x.href = t;
    }, 16);
  }, S.redirect = function(t) {
    var e, n;
    return arguments.length, t = arguments[0], "back" === t || "forward" === t ? (_[t](), 
    void 0) : y ? (e = arguments[1], n = arguments[2] || {}, this.path = t, this.title = e || "EXFE.COM", 
    document.title = this.title, this.state = n, this.state.id = h(), this.pushState(), 
    w(window).triggerHandler("popstate"), void 0) : (this.location(t), void 0);
  }, S.save = function() {
    _.replaceState(this.state, this.title, this.path);
  }, S.pushState = function() {
    _.pushState(this.state, this.title, this.path);
  }, S.render = function(t, e, n) {
    var i = this, e = e || {}, r = this.app;
    "function" == typeof e && (n = e, e = {}), e.locals = i.locals, r.render(t, e, n);
  }, S = o.prototype, S.param = function(t, e) {
    if ("function" == typeof t) return this._params.push(t), void 0;
    var n, i, r = this._params, s = r.length;
    for (i = 0; s > i; ++i) (n = r[i](t, e)) && (e = n);
    if ("function" != typeof e) throw Error("invalid param() call for " + t + ", got " + e);
    return (this.params[t] = this.params[t] || []).push(e), this;
  }, S._dispatch = function(t, e, n) {
    var i = this.params, r = this;
    (function s(a, o) {
      function c(e) {
        s(t._route_index + 1, e);
      }
      function u(e) {
        g = 0, v = m[a++], d = v && t.params[v.name], p = v && i[v.name];
        try {
          "route" === e ? c() : e ? (a = 0, h(e)) : p && void 0 !== d ? l() : v ? u() : (a = 0, 
          h());
        } catch (e) {
          u(e);
        }
      }
      function l(n) {
        var i = p[g++];
        return n || !i ? u(n) : (i(t, e, l, d, v.name), void 0);
      }
      function h(n) {
        var i = f.callbacks[a++];
        try {
          if ("route" === n) c(); else if (n && i) {
            if (4 > i.length) return h(n);
            i(n, t, e, h);
          } else i ? i(t, e, h) : c(n);
        } catch (n) {
          h(n);
        }
      }
      var p, d, f, m, v, g = 0;
      return t.route = f = r.matchRequest(t, a), f ? (t.params = f.params, m = f.keys, 
      a = 0, u(o), void 0) : n(o);
    })(0);
  }, S.matchRequest = function(t, e) {
    var n, i = t.url, r = this.map, s = r.length;
    for (e = e || 0; s > e; ++e) if (n = r[e], n.match(i)) return t._route_index = e, 
    n;
  }, S.route = function(t) {
    t || Error("Router#get() requires a path");
    var e = [].slice.call(arguments, 1), n = new c(t, e, {
      sensitive: this.caseSensitive,
      strict: this.strict
    });
    return (this.map = this.map || []).push(n), this;
  }, S = c.prototype, S.match = function(t) {
    this.regexp.lastIndex = 0;
    var e, n, i, r, s = this.keys, a = this.params = [], o = this.regexp.exec(t);
    if (!o) return !1;
    for (e = 1, n = o.length; n > e; ++e) i = s[e - 1], r = "string" == typeof o[e] ? decodeURIComponent(o[e]) : o[e], 
    i ? a[i.name] = r : a.push(r);
    return !0;
  }, S = u.prototype, S.lookup = function(t) {
    return this.root + "/" + t + "?t=" + this.timestamp;
  }, S.render = function(t, e) {
    return d(this.engine, this.path, t, e, this.ext);
  }, h.id = 0;
  var T = Array.isArray;
  T || (T = function(t) {
    return t instanceof Array;
  });
}), define("live", function(t) {
  "use strict";
  function e() {
    navigator.geolocation.clearWatch(N);
  }
  function n() {
    N = navigator.geolocation.watchPosition(function(t) {
      t && t.coords && t.coords.latitude && t.coords.longitude && t.coords.accuracy && (p.latitude = "" + t.coords.latitude, 
      p.longitude = "" + t.coords.longitude, p.accuracy = "" + t.coords.accuracy, c = o - 5, 
      g("Location update: lat = " + p.latitude + ", " + "lng = " + p.longitude + ", " + "acu = " + p.accuracy));
    });
  }
  var i = window._ENV_, r = i.streaming_api_url, s = i.api_url;
  t("store");
  var a = "", o = 30, c = o, u = !1, l = null, h = "", p = {
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
  }, d = Date.now || function() {
    return new Date().getTime();
  }, r = r, f = null, m = null, v = null, g = function(t, e) {
    if (u) {
      var n = Object.prototype.toString.call(t), i = "" + new Date();
      "[object String]" !== n && "[object Number]" !== n && (t = JSON.stringify(t)), console.log(i.replace(/^.*(\d{2}:\d{2}:\d{2}).*$/, "$1") + " - " + t), 
      e && console.table && console.table(e);
    }
  }, y = function() {
    c = 0, g("Breathe with" + (a ? " token: " + a : "out token")), f && f.abort(), f = $.ajax({
      type: "post",
      url: r + "/v3/live/cards" + (a ? "?token=" + a : ""),
      data: JSON.stringify(p),
      success: function(t) {
        var e = t;
        e && e.length && (c = 0, a !== e[0] && (g("Got new token: " + e[0] + ", id: " + e[1]), 
        x.live && (x.kill(), g("Close current stream")), c = o), a = e[0], p.card.id = e[1]);
      },
      error: function(t) {
        t.status && t.status >= 400 && 499 >= t.status ? (a && g("Repeal token: " + a), 
        a = "", c = o) : (c = o - 5, g("Network error"));
      }
    }), !x.live && a && (x.init(r + "/v3/live/streaming?token=" + a, b, w), g("Streaming with token: " + a));
  }, b = function(t) {
    if (t && t.length) {
      var e = JSON.parse(t[t.length - 1]);
      if (e && e.length) {
        var n = {};
        for (var i in e) e[i].id && (e[i].id === p.card.id ? (p.card.name = e[i].name, p.card.avatar = e[i].avatar, 
        p.card.bio = e[i].bio, p.card.identities = e[i].identities, p.card.timestamp = e[i].timestamp) : (e[i].avatar || (e[i].avatar = encodeURI(s + "/avatar/default?name=" + e[i].name)), 
        n[e[i].id] = e[i]));
        var r = {
          me: S(p.card),
          others: n
        }, a = JSON.stringify(r);
        g("Streaming pops: " + a, n), l && h !== a && (g("Callback"), l(r), h = a);
      } else g("Data error");
    }
  }, w = function() {
    g("Streaming is dead");
  }, k = function() {
    C(p.card) && ++c >= o && y();
  }, x = {
    prvLen: null,
    nxtIdx: null,
    timer: null,
    http: null,
    pop: null,
    dead: null,
    live: !1,
    init: function(t, e, n) {
      this.prvLen = 0, this.nxtIdx = 0, this.live = !0, this.pop = e, this.dead = n, this.http = new XMLHttpRequest(), 
      this.http.open("post", t), this.http.onreadystatechange = this.listen, this.http.send(), 
      this.timer = setInterval(this.listen, 1e3);
    },
    listen: function() {
      if (!(4 !== x.http.readyState && 3 !== x.http.readyState || 3 === x.http.readyState && 200 !== x.http.status || null === x.http.responseText)) {
        for (4 === x.http.readyState && 200 !== x.http.status && x.kill(); x.prvLen !== x.http.responseText.length && (4 !== x.http.readyState || x.prvLen !== x.http.responseText.length); ) {
          x.prvLen = x.http.responseText.length;
          var t = x.http.responseText.substring(x.nxtIdx), e = t.split("\n");
          x.nxtIdx += t.lastIndexOf("\n") + 1, "\n" === t[t.length - 1] && e[e.length] || e.pop(), 
          x.pop && x.pop(e);
        }
        4 === x.http.readyState && x.prvLen === x.http.responseText.length && x.kill();
      }
    },
    kill: function() {
      clearInterval(this.timer), this.http && this.http.abort(), this.dead && this.dead(), 
      this.live = !1;
    }
  }, _ = function() {
    if (window.DeviceMotionEvent === void 0) return null;
    var t = 50, e = 0, n = 0, i = 0, r = 0, s = 0, a = 0;
    window.addEventListener("devicemotion", function(t) {
      e = t.accelerationIncludingGravity.x, n = t.accelerationIncludingGravity.y, i = t.accelerationIncludingGravity.z;
    }, !1), setInterval(function() {
      var o = Math.abs(e - r + n - s + i - a);
      o > t && (m && m(), v && setTimeout(v, 1e3)), r = e, s = n, a = i;
    }, 100);
  }, E = function(t) {
    return t && t.external_username && t.provider ? !0 : !1;
  }, C = function(t) {
    if (t && t.name && t.identities && t.identities.length) {
      for (var e in t.identities) if (E(t.identities[e]) === !1) return !1;
      return !0;
    }
  }, S = function(t) {
    switch (Object.prototype.toString.call(t)) {
     case "[object Object]":
      var e = {};
      for (var n in t) e[n] = S(t[n]);
      break;

     case "[object Array]":
      e = [];
      for (n in t) e.push(S(t[n]));
      break;

     default:
      e = t;
    }
    return e;
  }, T = {
    init: function(t, e) {
      C(t) ? (x.kill(), p.card.name = t.name, p.card.avatar = t.avatar, p.card.bio = t.bio, 
      p.card.identities = S(t.identities), p.card.timestamp = d(), g("Set my card: " + JSON.stringify(p.card))) : g("Card error"), 
      e && (l = e, g("Set callback function")), c = o;
    },
    shake: function(t, e) {
      m = t, v = e;
    },
    startGeo: n,
    stopGeo: e
  };
  setInterval(k, 1e3), _(m, v);
  var N;
  return window.addEventListener("load", function() {
    setTimeout(function() {
      window.scrollTo(0, 0);
    }, 0);
  }), T;
}), define("mobilemiddleware", function(t, e, n) {
  "use strict";
  var i = navigator.userAgent.match(/iPhone/);
  n.exports = {
    setHtmlHeight: function(t, e, n) {
      setTimeout(function() {
        window.scrollTo(0, 0);
      }, 0), i || $("#app-main").addClass("app-box");
      var r = document.documentElement, s = window.innerHeight, a = t.app;
      s >= 444 ? s = 508 : 356 >= s && (s = 420), a.screen = {
        width: 320,
        height: s,
        ios: 420 >= s ? "iphone4" : ""
      }, r.style.minHeight = s + "px", n();
    },
    checkStorageSupported: function(t, e, n) {
      try {
        var i = window.localStorage;
        i && (i.setItem("storage", 0), i.removeItem("storage"));
      } catch (r) {
        alert("EXFE cannot be used in private browsing mode.");
      }
      n();
    },
    cleanup: function(t, e, n) {
      delete t._data_, delete t.smsToken, $("#app-body").css("height", "auto"), $("#app-header").addClass("hide"), 
      $("#app-footer").removeClass("ft-bg");
      var i = t.switchPageCallback;
      i ? i() : $("#app-body .page").addClass("hide"), delete t.switchPageCallback, n();
    },
    errorHandler: function(t, e) {
      t.error = {
        code: 404
      }, e.redirect("/");
    }
  };
}), define("mobilecontroller", function(t, e, n) {
  "use strict";
  var i = t("base"), r = t("store"), s = t("tween"), a = window._ENV_.api_url, o = window._ENV_.app_scheme, c = window.openExfe, u = t("handlebars"), l = t("util"), h = l.trim, p = l.parseId, d = navigator.userAgent.match(/iPad/), f = t("live"), m = function(t, e) {
    return t.replace(e ? /&/g : /&(?!#?\w+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }, v = Date.now || function() {
    return new Date().getTime();
  }, g = function(t) {
    window.location = o + "://crosses/" + (t || "");
  }, y = "webkitTransform" in document.body.style, b = function(t, e) {
    var n = 6 === e.length ? "" : "3d";
    t.style[y ? "webkitTransform" : "transform"] = "matrix" + n + "(" + e.join(",") + ")";
  }, w = function() {
    var t = r.get("livecard");
    if (!t) {
      var e = {
        id: "",
        name: "",
        avatar: "",
        bio: "",
        identities: []
      };
      t = {
        card: e,
        latitude: "",
        longitude: "",
        accuracy: "",
        traits: []
      };
      var n = r.get("user");
      n && (e.name = n.name, e.avatar = n.avatar_filename, e.bio = n.bio, e.identities = n.identities), 
      r.set("livecard", t);
    }
    return t.card.id = "", t;
  }, k = [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ], x = [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 128, 28, 0, 1 ], _ = [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 128, 0, 0, 1 ], E = 0, C = function() {
    return "Controller-" + E++;
  };
  e = n.exports = {};
  var S = i.extend({
    initialize: function(t) {
      this.cid = C(), this.initOptions(t), this.parseElement(), this.init(), S.caches[this.cid] = this;
    },
    parseElement: function() {
      var t = this.element, e = this.options.template;
      if (t ? this.element = t instanceof $ ? t : $(t) : e && (this.element = $(e)), !this.element) throw "element is invalid";
      this.element.attr("data-page-id", this.cid);
    },
    initOptions: function(t) {
      this.setOptions(t);
      for (var e in t) "options" !== e && (this[e] = t[e]);
    },
    init: function() {},
    destory: function() {
      this.element.off(), this._destory();
    },
    _destory: function() {
      delete S.caches[this.cid], S.superclass.destory.call(this);
    },
    $: function(t) {
      return this.element.find(t);
    }
  });
  S.caches = [], e.FooterController = S.extend({
    element: $("#app-footer"),
    init: function() {
      this.listen();
    },
    enableTimer: !0,
    listen: function() {
      var t = this, e = t.element;
      e.on("click.footer", ".web-version", function() {
        window.location.href = "/?ipad" + location.hash;
      }).on("click.footer", ".get-button button", function(t) {
        return t.preventDefault(), c(), !1;
      }).on("keydown.footer", "#email", function(e) {
        if (13 === e.keyCode) {
          var n = t.$("#email").val();
          t.addNotificationIdentity(n);
        }
      }).on("click.footer", ".subscribe .btn_mail", function() {
        var e = h(t.$("#email").val());
        t.addNotificationIdentity(e);
      }), this.on("show", function(t, e, n, i) {
        var r = t.height - 96 - (e ? 60 : 0);
        this.element.removeClass("hide"), this.element.css({
          position: "relative",
          top: r + "px"
        }), this.$(".action").addClass("hide"), this.$(".get-button").removeClass("hide"), 
        d && this.$(".web-version").removeClass("hide"), this.$(".error-info").toggleClass("hide", !i);
      }), this.on("reset-position", function() {
        var t = App.screen.height - 96;
        this.element.removeClass("hide"), this.element.css({
          position: "absolute",
          top: t + "px"
        }), this.$(".action").addClass("hide"), this.$(".get-button").removeClass("hide"), 
        d && this.$(".web-version").removeClass("hide");
      }), this.on("show-from-cross", function(t, e, n) {
        this.element.css({
          position: "relative",
          top: 0
        }), this.element.addClass("ft-bg"), this.cross = {
          exfee_id: t,
          token: e
        }, this.$(".actions").addClass("action-cross"), this.$(".action").addClass("hide"), 
        n || this.$(".subscribe").removeClass("hide"), this.element.removeClass("hide"), 
        $("#app-footer").addClass("ft-bg"), this.$(".get-button").removeClass("hide"), d && this.$(".web-version").removeClass("hide");
      }), this.on("redirect", function(t) {
        g(t);
      });
    },
    addNotificationIdentity: function(t, e, n) {
      e = this.cross.exfee_id, n = this.cross.token;
      var i = p(t);
      return i && "email" !== i.provider ? ($("#email.email").attr("placeholder", "Bad email Address."), 
      void 0) : ($.ajax({
        type: "POST",
        url: a + "/Exfee/" + e + "/AddNotificationIdentity" + "?token=" + n,
        data: {
          provider: i.provider,
          external_username: i.external_username
        },
        success: function(t) {
          t && t.meta && 200 === t.meta.code && $(".subscribe").hide();
        },
        error: function() {
          alert("Failed, please retry later.");
        }
      }), void 0);
    }
  }), e.VerifyController = S.extend({
    init: function() {
      this.render(), this.listen();
    },
    render: function() {
      $("#app-verify").remove(), this.element.appendTo($("#app-body"));
    },
    listen: function() {
      var t = this, e = this.resolveToken;
      this.on("show", function(n, i) {
        setTimeout(function() {
          window.scrollTo(0, 0);
        }, 14);
        var r = function() {
          n.error = !0, i.redirect("/");
        }, s = e.user_id, o = e.token;
        this.element.removeClass("hide"), $("#app-body").css("height", "100%"), App.controllers.footer.emit("reset-position"), 
        $.ajax({
          type: "POST",
          url: a + "/Users/" + s + "?token=" + o,
          data: {
            token: o
          },
          success: function(n) {
            var i = n.meta;
            if (i && 200 === i.code) for (var a = n.response.user, c = a.identities, u = 0, l = c.length; l > u; ++u) {
              var h = c[u];
              if (h.id === e.identity_id) {
                if (t.showIdentity(h), t.$(".done-info").removeClass("hide"), s && o) {
                  var p = "?token=" + o + "&user_id=" + s + "&identity_id=" + h.id;
                  App.controllers.footer.emit("redirect", p);
                }
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
    showIdentity: function(t) {
      var e = this.$(".identity");
      e.find(".name").text(t.name), e.find(".avatar").attr("src", t.avatar_filename);
    }
  }), e.SetPasswordController = S.extend({
    init: function() {
      this.render(), this.listen();
    },
    render: function() {
      $("#app-setpassword").remove(), this.element.appendTo($("#app-body"));
    },
    submitPassword: function() {
      var t = this, e = this.token, n = this.$(".set-button button"), i = this.$(".error-info"), r = this.$("#name"), s = this.$("#password"), o = s.val();
      o.length >= 4 ? (n.addClass("disabled").prop("disabled", !0), $.ajax({
        type: "POST",
        url: a + "/Users/ResetPassword",
        data: {
          token: e,
          name: name,
          password: o
        },
        success: function(e) {
          var a = e.meta;
          if (a && 200 === a.code) {
            r.blur(), s.blur(), t.$(".password").addClass("hide"), t.$(".done-info").removeClass("hide"), 
            i.html("").addClass("hide"), n.parent().addClass("hide");
            var o = e.response.authorization;
            o && App.controllers.footer.emit("redirect", "?token=" + o.token + "&user_id=" + o.user_id);
          } else n.removeClass("disabled").prop("disabled", !0);
          n.removeClass("disabled").prop("disabled", !0);
        },
        error: function() {
          i.html("Failed to set password. Please try later.").removeClass("hide"), n.removeClass("disabled").prop("disabled", !1);
        }
      })) : i.html("Password must be longer than four!").removeClass("hide");
    },
    listen: function() {
      var t, e, n = this, i = this.element, r = this.resolveToken;
      i.on("touchstart.setpassword", ".pass", function() {
        e && (clearTimeout(e), e = void 0), t = v();
        var n = $(this).prev();
        n.prop("type", "password");
      }).on("touchend.setpassword", ".pass", function(n) {
        if (v() - t > 300) {
          var i = $(this).prev();
          i.prop("type", "text"), e = setTimeout(function() {
            i.prop("type", "password");
          }, 500);
        }
        return n.preventDefault(), n.stopPropagation(), !1;
      }).on("keydown.setpassword", "#password", function(t) {
        13 === t.keyCode ? n.submitPassword() : n.$(".error-info").html("");
      }).on("touchstart.setpassword", ".set-button button", function() {
        n.submitPassword();
      }), this.on("show", function(t, e) {
        setTimeout(function() {
          window.scrollTo(0, 0);
        }, 0);
        var n = function() {
          t.error = !0, e.redirect("/");
        };
        i.removeClass("hide"), $("#app-body").css("height", "100%"), $.ajax({
          type: "POST",
          url: a + "/Users/" + r.user_id + "?token=" + r.token,
          data: {
            token: r.token
          },
          success: function(t) {
            var e = t.response.user;
            return t && t.meta && 200 === t.meta.code ? ($(".identity .avatar").attr("src", e.avatar_filename), 
            $(".identity .name").html(e.name), void 0) : (n(), void 0);
          },
          error: function() {
            n();
          }
        }), App.controllers.footer.emit("reset-position");
      });
    }
  }), e.HomeController = S.extend({
    init: function() {
      this.render(), this.listen();
    },
    render: function() {
      $("#app-home").length || this.element.appendTo($("#app-body"));
    },
    listen: function() {
      var t = this, e = this.element;
      e.on("touchstart.home", "#home-card", function() {
        t.stopAnimate(), t.emit("goto-live");
      }), this.on("goto-live", function() {
        App.request.switchPageCallback = function() {
          e.addClass("hide");
        }, App.response.redirect("/#live");
      }), this.on("show", function(t, n) {
        var i = t.height;
        this.$(".logo-box .inner").css("top", (i - 300) / 2 + "px"), e.removeClass("hide"), 
        _[13] = (i - 64) / 2, this.setHomeCard(_), n = !(!n || 404 !== n.code);
        var r = this.$(".title");
        r.find(".normal").removeClass("hide"), n && setTimeout(function() {
          alert("Sorry. Your link is invalid or expired. Requested page was not found.");
        }, 14), this.$("#home-card").css("display", "none");
      });
    },
    setHomeCard: function(t) {
      var e = w(), n = e.card, i = n.name, r = n.avatar, s = this.$("#home-card");
      b(s[0], t), n && (i || r) ? (r || (r = i ? a + "/avatar/default?name=" + i : "/static/img/portrait_default.png"), 
      r = "url(" + r + ")") : r = "", s.find(".avatar").css("background-image", r);
    },
    aopts: {
      o: 1
    },
    createAnimate: function() {
      var t = this.aopts, e = document.getElementById("big-logo"), n = document.getElementById("home-card"), i = function() {
        e.style.opacity = t.o, n.style.opacity = 1 - t.o;
      };
      this._a = new s.Tween(t).delay(1377).to({
        o: 0
      }, 1377).easing(s.Easing.Cubic.InOut).onUpdate(i), this._b = new s.Tween(t).delay(1377).to({
        o: 1
      }, 1377).easing(s.Easing.Cubic.InOut).onUpdate(i);
    },
    startAnimate: function() {
      this._a || this._b || this.createAnimate(), this._a.chain(this._b), this._b.chain(this._a), 
      this._a.start();
    },
    stopAnimate: function() {
      var t = this.aopts, e = document.getElementById("big-logo"), n = document.getElementById("home-card");
      this._a.chain(), this._b.chain(), this._b.stop(), this._a.stop(), t.o = e.style.opacity = 1, 
      n.style.opacity = 0;
    }
  }), e.CrossController = S.extend({
    init: function() {
      this.render(), this.listen();
    },
    render: function() {
      $("#app-cross").remove(), this.element.appendTo($("#app-body"));
    },
    listen: function() {
      var t = this, e = this.element, n = this.token, i = this.cross, r = t.$(".rsvp_toolbar");
      e.on("touchstart.cross", ".portrait.me", function() {
        r.toggleClass("rsvp_toolbar_off", !r.hasClass("rsvp_toolbar_off"));
      }).on("touchstart.cross", ".changename", function() {
        var e = prompt("Change my display name:");
        e ? $.ajax({
          type: "POST",
          url: a + "/Identities/" + i.identity.id + "/Update" + "?token=" + n,
          data: {
            name: e
          },
          success: function(e) {
            e && e.meta && 200 === e.meta.code && t.$(".name_me").html(m(e.response.identity.name));
          },
          error: function() {
            alert("Failed, please retry later.");
          }
        }) : alert("Display name cannot be empty.");
      }).on("touchstart.cross", ".rsvp.accepted, .rsvp.unavailable", function() {
        var e = $(this).hasClass("accepted") ? "ACCEPTED" : "DECLINED";
        t.rsvp(e);
      }).on("touchstart.cross", ".inf_area .description", function() {
        var t = $(this), e = t.hasClass("clickable");
        if (e) {
          var n = t.hasClass("limit");
          t.toggleClass("limit", !n), t.find(".xbtn-more .rb").toggleClass("hidden", n), t.find(".xbtn-more .lt").toggleClass("hidden", !n);
        }
      }), this.on("show", function() {
        e.removeClass("hide");
        var t = this.$(".inf_area .description");
        t.height() > 130 && (t.addClass("limit clickable"), t.find(".xbtn-more").removeClass("hide"), 
        t.find(".xbtn-more .rb").removeClass("hidden"));
      });
    },
    rsvp: function(t) {
      var e = this.cross.identity.id, n = this.exfee_id, i = this.token, r = [ {
        rsvp_status: t,
        identity_id: e,
        by_identity_id: e
      } ];
      this.$(".rsvp_toolbar").addClass("rsvp_toolbar_off");
      var s = this.$(".portrait_rsvp_me").removeClass("accepted declined pending");
      switch (t) {
       case "ACCEPTED":
        s.addClass("accepted");
        break;

       case "DECLINED":
        s.addClass("declined");
        break;

       default:
        s.addClass("pending");
      }
      $.ajax({
        type: "post",
        url: a + "/Exfee/" + n + "/Rsvp?token=" + i,
        data: {
          rsvp: JSON.stringify(r)
        },
        success: function() {},
        error: function() {
          alert("RSVP failed!");
        }
      });
    }
  }), e.LiveController = S.extend({
    init: function() {
      this.render(), this.listen();
    },
    render: function() {
      $("#app-live").length ? this.element = $("#app-live") : this.element.appendTo($("#app-body"));
    },
    listen: function() {
      var t, e, n = this, i = this.element;
      i.on("touchstart.live", "#card-name", function(t) {
        t.stopPropagation(), setTimeout(function() {
          window.scrollTo(0, 0);
        }, 0), this.focus();
      }).on("touchend.live", ".live-form", function(t) {
        t.stopPropagation(), $(t.target).hasClass("live-form") && (i.find(".input-item").blur(), 
        App.response.redirect("/"));
      }).on("keydown.live", "#card-name", function(t) {
        var e = t.keyCode, i = h(this.value);
        i && 13 === e && n.addEmailOrPhone(this, i);
      }).on("blur.live", "#card-name", function() {
        var t = h(this.value);
        t ? n.addEmailOrPhone(this, t) : n.setCardName(this);
      }).on("keydown.live blur.live", "#add-identity", function(t) {
        var e = t.keyCode, i = h(this.value);
        (i && 13 === e || "blur" === t.type) && (n.addEmailOrPhone(this, i, !0), this.value = "");
      }).on("keydown.live blur.live", "#facebook-identity", function(t) {
        var e = t.keyCode, i = h(this.value);
        (i && 13 === e || "blur" === t.type) && (i += "@facebook", n.addFacebook(this, i) && $("#add-identity-facebook").addClass("hide"), 
        this.value = "");
      }).on("touchstart.live", ".list .input-item", function() {
        $(this).next().removeClass("hidden");
      }).on("blur.live", ".list .input-item", function() {
        $(this).next().addClass("hidden"), n.updateIdentityLi(this);
      }).on("touchstart.live", ".list .delete", function() {
        var t, e = $(this).prev()[0], i = h(e.value), r = e.getAttribute("data-provider"), s = "facebook" === r;
        s && (i += "@facebook"), t = p(i), $(this).parent().remove(), t && t.provider && n.removeIdentity(t), 
        s && n.emit("show-add-facebook");
      }).on("touchstart.live", ".btn-start", function() {
        var t = $(".list .input-item");
        t.each(function() {
          n.updateIdentityLi(this);
        });
        var e = document.getElementById("card-name");
        e.blur();
        var i = h(e.value);
        i ? n.liveCard.card.name = i : n.setCardName(e), setTimeout(function() {
          n.inspectFields() && (n.emit("post-card"), n.emit("live-gather"));
        }, 23);
      }).on("hold:live", ".live-gather .card .avatar", function() {
        var t = this, e = t.parentNode, n = $(e).data("card"), i = e.style.transform || e.style.webkitTransform, r = i.match(/([\-\d\.]+)/g).slice(1), s = document.getElementById("card-tip"), a = "";
        if (n && n.identities) {
          for (var o = 0, c = n.identities.length; c > o; ++o) {
            var u = n.identities[o], l = u.provider, h = u.external_username, p = "";
            "email" !== l && "phone" !== l && (l = l.substr(0, 1).toUpperCase() + l.substr(1), 
            p = '<span class="provider">' + l + "</span>"), a += '<li><span class="external-username' + (p ? "" : " normal") + '">' + h + "</span>" + p + "</li>";
          }
          s.querySelector("ul").innerHTML = a;
          var d = s.clientHeight, f = ~~r[12] - 68, m = ~~r[13] - (6 + d), v = 93;
          0 > f ? f = 10 : f + 200 >= 320 && (f = 110), (10 === f || 110 === f) && (v = ~~r[12] + 32 - 7 - f), 
          r[12] = f, r[13] = m - 5, r[14] = 7, b(s, r), s.querySelector(".ang").style.left = v + "px", 
          s.querySelector(".bio").innerText = n.bio, s.className = "card-tip";
        }
      }).on("touchstart.live", ".live-gather .card .avatar", function(n) {
        var i = $(this), r = 250, s = n.touches.length;
        e = v(), t && (clearTimeout(t), t = void 0), 1 === s && s >= 1 && (t = setTimeout(function() {
          i.trigger("hold:live");
        }, r));
      }).on("touchend.live", ".live-gather .card .avatar", function() {
        if (t && (clearTimeout(t), t = void 0), 250 > v() - e) {
          var n = $(this).parent();
          n.hasClass("card-me") || n.toggleClass("selected");
        }
        document.getElementById("card-tip").className = "card-tip hidden";
      }).on("touchstart.live", ".back", function() {
        n.$(".live-gather").addClass("hide"), App.response.redirect("/");
      }).on("touchstart.live", ".live-gather", function(t) {
        var e = t.target, n = $(".live-title h2"), i = n[0], r = n.hasClass("clicked");
        r && ($(".wave").css("opacity", 1), n.data("clicked", e === i || $.contains(i, e)).removeClass("clicked"), 
        $(".live-tip").addClass("live-tip-close"));
      }).on("touchstart.live", ".live-title h2", function() {
        var t = $(this), e = t.hasClass("clicked"), n = t.data("clicked");
        e || n || ($(this).addClass("clicked"), $(".wave").css("opacity", 0), $(".live-tip").removeClass("live-tip-close")), 
        t.data("clicked", !1);
      }).on("touchstart.live", ".btn-confirm", function() {
        n.postContacts();
      }), this.on("show-add-email", function() {
        this.$("#add-identity").removeClass("hide");
      }), this.on("show-add-facebook", function() {
        this.$('.list input[data-provider="facebook"]').length || this.$("#add-identity-facebook").removeClass("hide");
      }), this.on("show", function(t) {
        f.startGeo(), this.screen = t, $("#app-footer").addClass("hide"), this.element.removeClass("hide");
        var e = t.height;
        _[13] = (e - 64) / 2, b(this.$("#icard")[0], _), this.$(".live-form, .live-gahter").css("min-height", e), 
        this.$(".live-form").removeClass("hide"), this.$("#live-discover").css("opacity", 0), 
        this.$("#card-form").css({
          opacity: 0,
          "min-height": 100 * ((e - 100) / e) + "%"
        }), this.measurePositions(t.width, t.height - 10, 32, 32), this.MAPS = this._MAPS.slice(0), 
        this.$(".identities .list").empty(), this.liveCard = w(), this.updateMyCardForm(), 
        this.startAnimate();
      }), this.on("post-card", function() {
        this.postMyCard();
      }), this.on("disabled-live-btn", function(t) {
        this.$(".btn-start").toggleClass("disabled", t);
      }), this.on("live-gather", function() {
        this.$(".live-form").addClass("hide"), this.$(".live-gather").removeClass("hide"), 
        this.$(".wave").addClass("start"), this.$(".live-gather").find(".card").remove();
        var t = this.liveCard.card, e = this.genCard(t, this.coords[0][0], 0, 0, !0, this.screen.ios).appendTo(this.$(".live-gather"));
        this.updateCard(e[0], t), this._others && this.updateOthers();
      });
    },
    updateIdentityLi: function(t) {
      var e, n = t.getAttribute("data-external-username"), i = t.getAttribute("data-provider"), r = t.getAttribute("data-name"), s = "", a = h(t.value), o = !1, c = !1, u = !1;
      if (a) if ("facebook" === i && (a += "@facebook"), e = p(a), e && e.provider) {
        var l = this.findIdentity(e), d = e.provider === i && e.external_username === n;
        l && !d && (t.value = s), l || d || (u = !0, o = !0);
      } else c = !0, o = !0; else c = !0, o = !0;
      c && (t.setAttribute("data-name", s), t.setAttribute("data-external-username", s), 
      t.setAttribute("data-provider", s), setTimeout(function() {
        alert("Invalid contact.");
      }, 14)), u && (t.setAttribute("data-name", e.name), t.setAttribute("data-external-username", e.external_username), 
      t.setAttribute("data-provider", e.provider), t.value = e.external_username, $(t).prev().text(this.aliasProvider(e.provider)), 
      this.updateLiveCard(e, "+")), o && this.updateLiveCard({
        name: r,
        external_username: n,
        provider: i
      }, "-", !0), (o || u) && this.emit("post-card");
    },
    postContacts: function() {},
    inspectFields: function() {
      var t = this.liveCard.card;
      return t.name && t.identities.length;
    },
    updateCardName: function(t) {
      t.name && (this.liveCard.card.name = document.getElementById("card-name").value = t.name, 
      r.set("livecard", this.liveCard));
    },
    updateMe: function(t) {
      var e, n = document.getElementById("icard"), i = n.getAttribute("data-url");
      i !== t.avatar && (e = t.avatar, e || (e = t.name ? a + "/avatar/default?name=" + t.name : "/static/img/portrait_default.png"), 
      i !== e && (n.querySelector(".avatar").style.backgroundImage = "url(" + e + ")", 
      n.setAttribute("data-url", e)));
      var r = document.getElementById("card-bio");
      t.bio && (r.innerText = t.bio), r.className = t.bio ? "" : "hide";
    },
    postMyCard: function() {
      r.set("livecard", this.liveCard);
      var t = this.liveCard.card;
      t.name && t.identities.length && f.init(t, $.proxy(this.liveCallback, this));
    },
    state: 1,
    liveCallback: function(t) {
      var e = this.liveCard, n = t.me;
      1 === this.state && n && n.name && n.identities.length && (v() - n.timestamp > 6e4 && this.updateCardName(n), 
      this.updateMe(e.card = n), r.set("livecard", e)), this._others = t.others, this.updateOthers();
    },
    updateMyCardForm: function() {
      var t, e = this.liveCard, n = e.card, i = n.identities;
      if (i && (t = i.length)) {
        this.updateCardName(n), this.updateMe(n), this.postMyCard(), i = i.slice(0);
        for (var r, s; r = i.shift(); ) s = r.provider, ("email" === s || "phone" === s || "facebook" === s) && this.addIdentity(r, !0);
        this.emit("show-add-email"), this.emit("show-add-facebook");
      } else this.emit("disabled-live-btn", !0);
    },
    resetLiveCard: function() {
      this.emit("disabled-live-btn", !0), r.clear("livecard"), this.liveCard = w();
    },
    findIdentity: function(t) {
      var e = this.liveCard.card, n = e.identities, i = n.length;
      if (i) for (var r = 0; i > r; ++r) {
        var s = n[r];
        if (s.provider === t.provider && s.external_username === t.external_username) return !0;
      }
      return !1;
    },
    updateLiveCard: function(t, e, n) {
      var i = this.liveCard.card, s = i.identities;
      if ("+" === e) s.push(t); else {
        for (var a = 0, o = s.length; o > a; ++a) {
          var c = s[a];
          if (c.provider === t.provider && c.external_username === t.external_username) {
            s.splice(a, 1);
            break;
          }
        }
        n || 0 !== s.length || this.resetLiveCard();
      }
      r.set("livecard", this.liveCard);
    },
    setCardName: function(t) {
      var e = this.packedIdentities();
      if (e.length) {
        var n = e[0], i = "", r = n.external_username, s = n.provider;
        i = "phone" === s ? "Anonym_" + r.slice(r.length - 4) : r.split("@")[0], this.liveCard.card.name = t.value = i, 
        t.setAttribute("placeholder", "Name"), $(t).addClass("normal");
      }
    },
    addFacebook: function(t, e) {
      var n = p(e), i = n.provider;
      return i && "facebook" === i && !this.existsByIdentity(n) ? (this.addIdentity(n), 
      !0) : !1;
    },
    addEmailOrPhone: function(t, e, n) {
      n = !n;
      var i = p(e), r = i.provider;
      !r || "email" !== r && "phone" !== r || this.existsByIdentity(i) || (this.addIdentity(i), 
      n && this.setCardName(t)), n && (this.emit("show-add-email"), this.emit("show-add-facebook")), 
      this.emit("post-card");
    },
    aliasProvider: function(t) {
      return "email" === t ? t = "Email" : "phone" === t ? t = "Mobile" : "facebook" === t && (t = "Facebook"), 
      t;
    },
    genIdentity: function(t) {
      var e = u.compile($("#live-li-identity-tmpl").html()), n = t.provider;
      n = this.aliasProvider(n);
      var i = $(e({
        provider_alias: n,
        identity: t
      }));
      return i;
    },
    resetCard: function() {
      this.state = 0, this.$("#icard").removeAttr("data-url").find(".avatar").css("background", ""), 
      this.$("#card-name").attr("placeholder", "Your email or mobile no.").removeClass("normal").val(""), 
      this.$("#add-identity").addClass("hide"), this.$("#add-identity-facebook").addClass("hide");
    },
    removeIdentity: function(t) {
      var e = this.$(".identities .list li");
      0 === e.length ? (this.resetCard(), this.emit("disabled-live-btn", !0)) : "facebook" === t.provider && this.emit("show-add-facebook"), 
      this.updateLiveCard(t, "-"), this.emit("post-card");
    },
    addIdentity: function(t, e) {
      e = !e, this.state = 1;
      var n = this.$(".identities .list"), i = this.genIdentity(t);
      n.append(i), this.emit("disabled-live-btn", !1), e && (this.updateLiveCard(t, "+"), 
      this.emit("post-card"));
    },
    packedIdentities: function() {
      for (var t, e, n, i, r, s = this.$(".identities .list").find("input"), a = 0, o = s.length, c = []; o > a; ++a) t = s.eq(a), 
      e = t.attr("data-provider"), n = h(s.eq(a).val()), n && ("facebook" === e && (n += "@facebook"), 
      i = p(n), r = i.provider, !r || "email" !== r && "phone" !== r && "facebook" !== r || c.push(i));
      return c;
    },
    existsByIdentity: function(t) {
      var e, n = this.packedIdentities(), i = t.external_username, r = t.provider;
      if (0 === n.length) return !1;
      for (;e = n.shift(); ) if (e.external_username === i && e.provider === r) return !0;
      return !1;
    },
    coords: "".split(),
    _MAPS: [ [ 1, 0 ], [ 1, 1 ], [ 1, 2 ], [ 2, 0 ], [ 2, 1 ], [ 2, 2 ], [ 2, 3 ], [ 3, 0 ], [ 3, 1 ], [ 3, 2 ], [ 3, 3 ] ],
    MAPS: "".split(),
    measurePositions: function(t, e, n, i) {
      var r = this.coords;
      r[0] = [ [ .5 * t - n, .88 * e - i ] ], r[1] = Array(3), r[1][0] = [ .25 * t - 5 - n, .66 * e + 30 - i ], 
      r[1][1] = [ .5 * t - n, .66 * e - i ], r[1][2] = [ .75 * t + 5 - n, .66 * e + 30 - i ], 
      r[2] = Array(4), r[2][0] = [ .125 * t + 5 - n, .44 * e + 40 - i ], r[2][1] = [ .375 * t - n, .44 * e - i ], 
      r[2][2] = [ .625 * t - n, .44 * e - i ], r[2][3] = [ .875 * t - 5 - n, .44 * e + 40 - i ], 
      r[3] = Array(4), r[3][0] = [ .125 * t - n, .22 * e + 40 - i ], r[3][1] = [ .375 * t - n, .22 * e - i ], 
      r[3][2] = [ .625 * t - n, .22 * e - i ], r[3][3] = [ .875 * t - n, .22 * e + 40 - i ];
    },
    genCard: function(t, e, n, i, r, s) {
      var a = u.compile($("#live-card-tmpl").html()), o = k.slice(0);
      o[12] = e[0], o[13] = e[1];
      var c = $(a({
        g: n,
        i: i,
        matrix: o.join(","),
        "class": (r ? "card-me" : "card-other hide") + ("iphone4" === s ? " card-iphone4" : ""),
        card: t
      }));
      return c.data("card", t), c;
    },
    addCard: function(t) {
      var e = this.MAPS;
      if (!e || 0 === e.length) return !1;
      var n = e.shift(), i = n[0], r = n[1], a = this.coords[i][r], o = this.genCard(t, a, i, r, !1, this.screen.ios), c = o[0], u = c.style, l = k.slice(0);
      l[0] = l[5] = 0, l[12] = a[0], l[13] = a[1], o.data("card", t), this.$(".live-gather").append(o), 
      new s.Tween({
        o: 0
      }).to({
        o: 1
      }, 250).easing(s.Easing.Bounce.In).onStart(function() {
        b(c, l), o.removeClass("hide");
      }).onUpdate(function() {
        u.opacity = this.o, l[0] = l[5] = this.o, b(c, l);
      }).onComplete(function() {
        s.remove(this);
      }).start();
    },
    delCard: function(t) {
      var e = this.MAPS, n = t.getAttribute("data-g"), i = t.getAttribute("data-i"), r = k.slice(0), a = this.coords[n][i], o = t.style;
      r[12] = a[0], r[13] = a[1], new s.Tween({
        o: 1
      }).to({
        o: 0
      }, 250).easing(s.Easing.Bounce.Out).onUpdate(function() {
        o.opacity = this.o, b(t, r);
      }).onComplete(function() {
        e.unshift([ n, i ]), t.parentNode.removeChild(t), s.remove(this);
      }).start();
    },
    updateCard: function(t, e) {
      var n = t.getAttribute("data-url"), i = "";
      n && n === e.avatar || (i = e.avatar, i || (i = e.name ? a + "/avatar/default?name=" + e.name : "/static/img/portrait_default.png"), 
      n !== i && (t.querySelector(".avatar").style.backgroundImage = "url(" + i + ")", 
      t.setAttribute("data-url", i))), t.querySelector(".name").innerText = e.name, $(t).data("card", e);
    },
    updateOthers: function() {
      for (var t, e, n, i, r = this._others, s = document.querySelectorAll(".card-other"), a = s.length, o = 0; a > o; ++o) t = s[o], 
      e = t.getAttribute("id"), e in r || this.delCard(t);
      for (n in r) i = r[n], t = document.getElementById(i.id), t ? this.updateCard(t, i) : this.addCard(i);
    },
    createAnimate: function() {
      var t = this.$("#icard")[0], e = this.$("#card-form")[0], n = this.$("#live-discover")[0], i = _[13], r = x[13], a = _.slice(0);
      this.a = new s.Tween({
        o: 0
      }).to({
        o: 1
      }, 500).easing(s.Easing.Cubic.In).onUpdate(function() {
        n.style.opacity = this.o, a[13] = (i - r) * (1 - this.o) + r, b(t, a);
      }), this.b = new s.Tween({
        o: 0
      }).delay(250).to({
        o: 1
      }, 500).onUpdate(function() {
        e.style.opacity = this.o;
      });
    },
    startAnimate: function() {
      this.a || this.b || this.createAnimate(), this.a.start(), this.b.start();
    },
    stopAnimate: function() {
      this.a.stop(), this.b.stop();
    }
  });
}), define("mobileroutes", function(t, e, n) {
  "use strict";
  var i = window._ENV_, r = t("store"), s = t("handlebars"), a = t("humantime"), o = function(t) {
    var e = a.printEFTime(t, "X");
    return e;
  }, c = t("mobilecontroller"), u = c.HomeController, l = c.SetPasswordController, h = c.VerifyController, p = c.CrossController, d = c.LiveController, f = function(t, e, n, i, a, c) {
    i || (i = {});
    var u = n.response, l = u.cross, h = {
      id: l.id,
      title: l.title,
      description: l.description.replace(/\r\n|\r|\n/g, "<br />"),
      time: {
        title: "Sometime",
        content: "To be decided"
      },
      place: {
        title: "Somewhere",
        description: "To be decided"
      },
      background: "default.jpg",
      read_only: !!u.read_only,
      change_name: !1
    }, d = l.time;
    d && d.begin_at && d.begin_at.timezone ? h.time = o(d) : h.time.tobe = "tobe";
    var f = l.place;
    f && f.title && (h.place = {
      title: f.title,
      description: f.description.replace(/\r\n|\r|\n/g, "<br />")
    });
    var m = f.lat, v = f.lng;
    if (m && v) {
      var g = window.devicePixelRatio >= 2 ? 2 : 1;
      h.place.map = "https://maps.googleapis.com/maps/api/staticmap?center=" + m + "," + v + "&markers=icon%3a" + encodeURIComponent("http://img.exfe.com/web/map_pin_blue.png") + "%7C" + m + "," + v + "&zoom=13&size=290x100&maptype=road&sensor=false&scale=" + g, 
      h.place.href = "http://maps.google.com/maps?daddr=" + encodeURIComponent(h.place.title) + "@" + m + "," + v;
    } else h.place.tobe = "tobe";
    var y, b = l.widget;
    if (b && (y = b.length)) for (var w = 0; y > w; ++w) if ("Background" === b[w].type) {
      h.background = b[w].image;
      break;
    }
    var k = 0, x = 0, _ = u.authorization;
    _ ? (k = _.user_id, u.browsing_identity && (x = u.browsing_identity.id)) : u.browsing_identity && u.browsing_identity.connected_user_id && (k = u.browsing_identity.connected_user_id, 
    x = u.browsing_identity.id), u.cross_access_token && (c = i[a] = u.cross_access_token, 
    r.set("cats", i));
    for (var E = l.exfee.invitations, C = [], S = {
      ACCEPTED: [],
      INTERESTED: [],
      NORESPONSE: [],
      IGNORED: [],
      DECLINED: []
    }, T = 0, N = E.length; N > T; ++T) {
      var P = E[T], A = "pending", I = P.rsvp_status;
      "NOTIFICATION" !== I && ("ACCEPTED" === I ? A = "accepted" : "DECLINED" === I && (A = "declined"), 
      P.rsvp_style = A, k && k === P.identity.connected_user_id || x === P.identity.id ? (P.is_me = !0, 
      x = P.identity.id, x !== P.invited_by.id && (h.inviter = P.invited_by), P.identity.isphone = "phone" === P.identity.provider, 
      h.identity = P.identity, h.identity.is_accepted = "ACCEPTED" === I, S.ACCEPTED.unshift(P)) : P.rsvp_status in S && S[P.rsvp_status].push(P));
    }
    C = [].concat(S.ACCEPTED, S.INTERESTED, S.NORESPONSE, S.IGNORED, S.DECLINED), h.invitations = [], 
    N = C.length;
    for (var O = 0; N > O; ) h.invitations.push(C.splice(0, 5)), O += 5;
    N = h.invitations.length;
    var M = h.invitations[N - 1], H = M.length;
    if (H && 5 > H) for (;5 - H++; ) M.push(void 0);
    var D = "";
    k && (_ ? (D = h.id + "?user_id=" + k + "&token=" + _.token + "&identity_id=" + x, 
    c = _.token, r.set("authorization", _)) : (_ = r.get("authorization"), _ && _.user_id === k && (D = h.id + "?user_id=" + k + "&token=" + _.token + "&identity_id=" + x, 
    c = _.token))), h.identity.isphone && c && (h.change_name = !0);
    var j = t.app, L = j.controllers, R = L.cross;
    R && R.destory();
    var F = s.compile($("#cross-tmpl").html());
    R = j.controllers.cross = new p({
      options: {
        template: F(h)
      },
      cross: h,
      exfee_id: l.exfee.id,
      token: c
    }), R.emit("show"), j.controllers.footer.emit("show-from-cross", l.exfee.id, c, h.read_only, D);
  }, m = n.exports = {
    index: function(t) {
      var e = t.error, n = t.app, i = n.controllers, r = i.home, s = i.footer, a = n.screen;
      r || (r = n.controllers.home = new u({
        options: {
          template: $("#home-tmpl").html()
        }
      })), document.title = "EXFE - The group utility for gathering.", r.emit("show", a, e), 
      s.emit("show", a, !1, !1, e === !0), delete t.error, n.currPageName = "HOME";
    },
    verify: function(t, e) {
      var n = t.session, i = n.resolveToken, r = t.app;
      $("#app-header").removeClass("hide");
      var s = new h({
        options: {
          template: $("#verify-tmpl").html()
        },
        resolveToken: i
      });
      s.emit("show", t, e), r.currPageName = "VERIFY";
    },
    setPassword: function(t, e) {
      var n = t.session, i = n.resolveToken, r = t.app;
      $("#app-header").removeClass("hide");
      var s = new l({
        options: {
          template: $("#setpassword-tmpl").html()
        },
        resolveToken: i,
        token: i.origin_token
      });
      s.emit("show", t, e), r.currPageName = "SET_PASSWORD";
    },
    resolveToken: function(t, e) {
      var n = t.app, r = t.params[0], s = t._data_ = i._data_, a = t.session;
      a.resolveToken = s.response;
      var o = a.resolveToken.action;
      "VERIFIED" === o ? m.verify(t, e) : "INPUT_NEW_PASSWORD" === o && (a.resolveToken.origin_token = r, 
      m.setPassword(t, e)), n.currPageName = "RESOLVE_TOKEN";
    },
    crossPhoneToken: function(t, e) {
      var n = t.app, s = t.params, a = s[1], o = r.get("cats"), c = o && o[a], u = t._data_ = i._data_;
      f(t, e, u, o, a, c), n.currPageName = "CROSS";
    },
    crossToken: function(t, e) {
      var n = t.app, s = t.params[0], a = r.get("cats"), o = t._data_ = i._data_, c = a && a[s];
      f(t, e, o, a, s, c), n.currPageName = "CROSS";
    },
    live: function(t) {
      var e = t.app, n = e.controllers, i = n.live;
      i && i.destory(), i = e.controllers.live = new d({
        options: {
          template: $("#live-tmpl").html()
        }
      }), i.emit("show", e.screen, e.ios), e.currPageName = "LIVE";
    }
  };
}), define(function(t) {
  "use strict";
  var e = t("tween"), n = t("af"), i = n.request, r = t("mobilemiddleware"), s = t("mobilecontroller").FooterController, a = t("mobileroutes"), o = t("lightsaber"), c = window.App = o();
  c.use(r.setHtmlHeight), c.use(r.cleanup), c.initRouter(), c.use(r.errorHandler), 
  c.controllers = {}, c.controllers.footer = new s({
    App: c
  }), c.get(/^\/+(?:\?)?#{0,}$/, a.index), c.get(/^\/+(?:\?)?#live\/?$/, a.live), 
  c.get(/^\/+\?t=([a-zA-Z0-9]{3,})$/, function(t, e) {
    var n = window._ENV_._data_, i = n.action;
    t.session.resolveToken = n, "VERIFIED" === i ? a.verify(t, e) : "INPUT_NEW_PASSWORD" === i && a.setPassword(t, e);
  }), c.get(/^\/+(?:\?)?#token=([a-zA-Z0-9]{64})\/?$/, a.resolveToken), c.get(/^\/+(?:\?)?#!([1-9][0-9]*)\/([a-zA-Z0-9]{4})\/?$/, a.crossPhoneToken), 
  c.get(/^\/+(?:\?)?#!token=([a-zA-Z0-9]{32})\/?$/, a.crossToken), c.on("launched", function() {
    function t() {
      i(t), e.update();
    }
    t();
  });
});