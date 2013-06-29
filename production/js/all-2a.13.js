/*! EXFE.COM QXdlc29tZSEgV2UncmUgaHVudGluZyB0YWxlbnRzIGxpa2UgeW91LiBQbGVhc2UgZHJvcCB1cyB5b3VyIENWIHRvIHdvcmtAZXhmZS5jb20uCg== */
/*! desktop@2a.13 2013-06-29 06:06:51 */
(function(context) {
  "use strict";
  function define(id, deps, factory) {
    var argsLen = arguments.length;
    1 === argsLen ? (factory = id, id = void 0) : 2 === argsLen && (factory = deps, 
    deps = void 0);
    var module = new Module(id, deps, factory);
    id ? __cache[id] = module : factory.call(module, _require, module.exports, module);
  }
  function _require(id) {
    var module = __cache[id];
    return module ? (module.exports || _initExports(module), module.exports) : null;
  }
  function _initExports(module) {
    var result, factory = module.factory;
    delete module.factory, result = factory(_require, module.exports = {}, module), 
    result && (module.exports = result);
  }
  function Module(id, deps, factory) {
    this.id = id, this.uri = void 0, this.deps = deps, "string" == typeof factory && (factory = Function("require", "exports", "module", factory)), 
    this.factory = factory, this.exports = void 0, this.filename = null, this.parent = void 0, 
    this.loaded = !1;
  }
  define.amd = {
    jQuery: !0
  }, context.define = define, Module.prototype.constructor = Module;
  var __cache = Module.__cache = {};
})(this), define("class", function() {
  "use strict";
  function Class(o) {
    return this instanceof Class || !isFunction(o) ? void 0 : classy(o);
  }
  function classy(o) {
    return o.extend = Class.extend, o.implement = implement, o;
  }
  function createClass(parent, protoProps, staticProps, parentProtos, protos) {
    function subclass() {
      parent.apply(this, arguments), this.constructor === subclass && this.initialize && (this.initialize.apply(this, arguments), 
      this.initialized = !0);
    }
    return parentProtos = parent.prototype, parent !== Class && mixin(subclass, parent), 
    subclass.Extends = parent, protos = createProto(parentProtos), protoProps && mixin(protos, protoProps), 
    subclass.prototype = protos, staticProps && mixin(subclass, staticProps), subclass.superclass = parentProtos, 
    subclass.prototype.constructor = subclass, classy(subclass);
  }
  function Ctor() {}
  function implement(properties) {
    var key, proto = this.prototype;
    for (key in properties) proto[key] = properties[key];
  }
  function mixin(r, s) {
    var k;
    for (k in s) r[k] = s[k];
  }
  function isFunction(f) {
    return "[object Function]" === toString.call(f);
  }
  Class.create = function(parent, protoProps) {
    return isFunction(parent) || (protoProps = parent, parent = null), protoProps || (protoProps = {}), 
    parent || (parent = protoProps.Extends || Class), createClass(parent, protoProps);
  }, Class.extend = function(protoProps, classProps) {
    return createClass(this, protoProps, classProps);
  };
  var createProto = Object.__proto__ ? function(proto) {
    return {
      __proto__: proto
    };
  } : function(proto) {
    return Ctor.prototype = proto, new Ctor();
  }, toString = Object.prototype.toString;
  return Class;
}), define("emitter", function() {
  "use strict";
  function Emitter() {}
  var EVENT_SPLITTER = /\s+/, keys = Object.keys;
  return keys || (keys = function(o) {
    var p, r = [];
    for (p in o) o.hasOwnProperty(p) && (r[r.length] = p);
    return r;
  }), Emitter.prototype.on = function(events, fn, ctx) {
    var callbacks, event, list;
    if (!fn) return this;
    for (events = events.split(EVENT_SPLITTER), callbacks = this.__callbacks || (this.__callbacks = {}); event = events.shift(); ) list = callbacks[event] || (callbacks[event] = []), 
    fn.__context = ctx, list[list.length] = fn;
    return this;
  }, Emitter.prototype.once = function(events, fn, ctx) {
    var callbacks, event, list;
    if (!fn) return this;
    for (events = events.split(EVENT_SPLITTER), callbacks = this.__callbacks || (this.__callbacks = {}); event = events.shift(); ) list = callbacks[event] || (callbacks[event] = []), 
    fn.__once = !0, fn.__context = ctx, list[list.length] = fn;
    return this;
  }, Emitter.prototype.off = function(events, fn, ctx) {
    var callbacks, event, list, i, cb;
    if (!(callbacks = this.__callbacks)) return this;
    if (!(events || fn || ctx)) return delete this.__callbacks, this;
    for (events = events.split(EVENT_SPLITTER) || keys(callbacks); event = events.shift(); ) if (list = callbacks[event]) if (fn || ctx) for (i = list.length - 1; i; --i) cb = list[i], 
    fn && cb !== fn || ctx && cb.__context !== ctx || list.splice(i, 1); else delete callbacks[event];
    return this;
  }, Emitter.prototype.emit = function(events) {
    var callbacks, event, all, list, i, len, args, cb, rest = [];
    if (!(callbacks = this.__callbacks)) return this;
    for (events = events.split(EVENT_SPLITTER), i = arguments.length - 1; i; --i) rest[i - 1] = arguments[i];
    for ((all = callbacks.call) && (args = [ 0 ].concat(rest)); event = events.shift(); ) {
      if (list = callbacks[event]) for (i = 0, len = list.length; len > i; ++i) cb = list[i], 
      cb.apply(cb.__context || this, rest), cb.__once && (list.splice(i--, 1), len--);
      if (list && all) for (args[0] = event, i = 0, len = all.length; len > i; ++i) cb = all[i], 
      cb.apply(cb.__context || this, args);
    }
    return this;
  }, Emitter;
}), define("base", function(require) {
  "use strict";
  function isFunction(f) {
    return "[object Function]" === toString.call(f);
  }
  function isPlainObject(o) {
    return o && "[object Object]" === toString.call(o) && "isPrototypeOf" in o;
  }
  function merge(receiver, supplier) {
    var key, value;
    for (key in supplier) value = supplier[key], isArray(value) ? value = value.slice() : isPlainObject(value) && (value = merge(receiver[key] || {}, value)), 
    receiver[key] = value;
    return receiver;
  }
  function getEventName(name) {
    return name[2].toLowerCase() + name.substring(3);
  }
  var EVENT_PREFIX = /^on[A-Z]/, PROTO = Object.__proto__, toString = Object.prototype.toString, isArray = Array.isArray;
  isArray || (isArray = function(a) {
    return "[object Array]" === toString.call(a);
  });
  var Class = require("class"), Emitter = require("emitter");
  return Class.create(Emitter, {
    setOptions: function(custom) {
      var key, value, options;
      if (this.hasOwnProperty("options") || (this.options = {}), options = this.options, 
      this.constructor.superclass.options && merge(options, this.constructor.superclass.options), 
      this.constructor.prototype.options && merge(options, this.constructor.prototype.options), 
      custom && custom.options && merge(options, custom.options), this.on) for (key in options) value = options[key], 
      isFunction(value) && EVENT_PREFIX.test(key) && (this.on(getEventName(key), value), 
      delete options[key]);
    },
    destory: function() {
      var k;
      for (k in this) this.hasOwnProperty(k) && delete this[k];
      PROTO && (this.__proto__ = PROTO);
    }
  });
}), define("bus", function(require) {
  "use strict";
  var Emitter = require("emitter");
  return new Emitter();
}), define("rex", function() {
  "use strict";
  function rex(v, ctx) {
    return new Rex(v, ctx);
  }
  function Rex(v, ctx) {
    this._value = v, this._context = ctx || NULL, this._chained = !1;
  }
  var NULL = null, ArrayProto = Array.prototype, ObjectProto = Object.prototype, hasOwn = ObjectProto.hasOwnProperty, toString = ObjectProto.toString, slice = ArrayProto.slice, NIndexOf = ArrayProto.indexof, NLastIndexOf = ArrayProto.lastIndexOf, NReduce = ArrayProto.reduce, NReduceRight = ArrayProto.reduceRight, R = {};
  R.each = function(a, fn, ctx) {
    var i, l = a.length;
    if (l === +l) for (i = 0; l > i; ++i) i in a && fn.call(ctx, a[i], i, a); else for (i in a) R.has(a, i) && fn.call(ctx, i, a[i], a);
  }, R.map = function(a, fn, ctx) {
    var i, j, r = [], l = a.length;
    if (l === +l) for (i = 0; l > i; ++i) i in a && (r[i] = fn.call(ctx, a[i], i, a)); else {
      j = 0;
      for (i in a) R.has(a, i) && (r[j++] = fn.call(ctx, i, a[i], a));
    }
    return r;
  }, R.some = function(a, fn, ctx) {
    for (var i = 0, l = a.length; l > i; ++i) if (i in a && fn.call(ctx, a[i], i, a)) return !0;
    return !1;
  }, R.every = function(a, fn, ctx) {
    for (var i = 0, l = a.length; l > i; ++i) if (i in a && !fn.call(ctx, a[i], i, a)) return !1;
    return !0;
  }, R.filter = R.select = function(a, fn, ctx) {
    for (var r = [], i = 0, j = 0, l = a.length; l > i; ++i) if (i in a) {
      if (!fn.call(ctx, a[i], i, a)) continue;
      r[j++] = a[i];
    }
    return r;
  }, R.indexOf = NIndexOf ? function(a, el, i) {
    return a.indexOf(el, isFinite(i) ? i : 0);
  } : function(a, el, i) {
    var l = a.length;
    if (!l) return -1;
    if (i || (i = 0), i > l) return -1;
    for (0 > i && (i = Math.max(0, l + i)); l > i; ++i) if (i in a && a[i] === el) return i;
    return -1;
  }, R.lastIndexOf = NLastIndexOf ? function(a, el, start) {
    return a.lastIndexOf(el, isFinite(start) ? start : a.length);
  } : function(a, el, i) {
    var l = a.length;
    if (i = l - 1, !l) return -1;
    for (arguments.length > 1 && (i = Math.min(i, arguments[1])), 0 > i && (i += l); i >= 0; --i) if (i in a && a[i] === el) return i;
    return -1;
  }, R.reduce = NReduce ? function(o, fn, mem, ctx) {
    return o.reduce(fn, mem, ctx);
  } : function(o, fn, mem, ctx) {
    o || (o = []);
    var i = 0, l = o.length;
    if (3 > arguments.length) for (;;) {
      if (i in o) {
        mem = o[i++];
        break;
      }
      if (++i >= l) throw new TypeError("Empty array");
    }
    for (;l > i; i++) i in o && (mem = fn.call(ctx, mem, o[i], i, o));
    return mem;
  }, R.reduceRight = NReduceRight ? function(o, fn, mem, ctx) {
    return o.reduce(fn, mem, ctx);
  } : function(o, fn, mem, ctx) {
    o || (o = []);
    var i = o.length - 1;
    if (3 > arguments.length) for (;;) {
      if (i in o) {
        mem = o[i--];
        break;
      }
      if (0 > --i) throw new TypeError("Empty array");
    }
    for (;i >= 0; --i) i in o && (mem = fn.call(ctx, mem, o[i], i, o));
    return mem;
  }, R.find = function(a, fn, ctx) {
    for (var r, i = 0, l = a.length; l > i; ++i) if (i in a && fn.call(ctx, a[i], i, a)) {
      r = a[i];
      break;
    }
    return r;
  }, R.reject = function(a, fn, ctx) {
    for (var r = [], i = 0, l = a.length; l > i; ++i) if (i in a) {
      if (fn.call(ctx, a[i], i, a)) continue;
      r[i++] = a[i];
    }
    return r;
  }, R.toArray = function(a) {
    if (!a) return [];
    if (R.isArray(a)) return a;
    if (a.toArray) return a.toArray();
    if (R.isArgs(a)) return slice.call(a);
    var k, r = [], j = 0;
    for (k in a) R.has(a, k) && (r[j++] = a[k]);
    return r;
  }, R.first = function(a) {
    return a[0];
  }, R.last = function(a) {
    return a[a.length - 1];
  }, R.size = function(a) {
    return R.toArray(a).length;
  }, R.compact = function(a) {
    return R.filter(a, function(v) {
      return !!v;
    });
  }, R.flatten = function(a) {
    return R.reduce(a, function(memo, value) {
      return R.isArray(value) ? memo.concat(R.flatten(value)) : (memo[memo.length] = value, 
      memo);
    }, []);
  }, R.unique = function(a) {
    var r = [], i = a.length - 1, j = 0;
    label: for (;i >= 0; --i) {
      for (;r.length > j; ++j) if (r[j] === a[i]) continue label;
      r[r.length] = a[i];
    }
    return r;
  }, R.merge = function(one, two) {
    var l, i = one.length, j = 0;
    if (isFinite(two.length)) for (l = two.length; l > j; j++) one[i++] = two[j]; else for (;void 0 !== two[j]; ) one[i++] = two[j++];
    return one.length = i, one;
  }, R.inArray = function(a, v) {
    return !!~R.indexOf(a, v);
  }, R.compose = function() {
    function cp() {
      for (args = arguments; i >= 0; --i) args = [ fns[i].apply(this, args) ];
      return args[0];
    }
    var args, fns = arguments, i = fns.length;
    return cp;
  }, R.has = function(o, k) {
    return hasOwn.call(o, k);
  }, R.keys = Object.keys || function(o) {
    var k, r = [], i = 0;
    for (k in o) R.has(o, k) && (r[i++] = k);
    return r;
  }, R.values = function(o) {
    var k, r = [], i = 0;
    for (k in o) R.has(o, k) && (r[i++] = o[k]);
    return r;
  }, R.extend = function() {}, R.mixin = function(r, s) {
    var p;
    for (p in s) r[p] = s[p];
  }, R.tap = function(o, f) {
    var r;
    return f && (r = f(o)), r ? r : o;
  }, R.nextTick = function(f) {
    setTimeout(f, 0);
  }, R.countDown = function(n, f) {
    function cb() {
      0 === --n && f();
    }
    return cb;
  }, R.isFunction = function(f) {
    return "function" == typeof f;
  }, R.isString = function(s) {
    return "[object String]" === toString.call(s);
  }, R.isElement = function(el) {
    return !(!el || !el.nodeType || 1 != el.nodeType);
  }, R.isArray = Array.isArray || function(a) {
    return a instanceof Array;
  }, R.isArrayLike = function(a) {
    return a && a.length && isFinite(a.length);
  }, R.isObject = function(o) {
    return o instanceof Object && !R.isFunction(o) && !R.isArray(o);
  }, R.isDate = function(d) {
    return !!(d && d.getTimezoneOffset && d.setUTCFullYear);
  }, R.isRegex = function(r) {
    return !(!(r && r.test && r.exec) || !r.ignoreCase && r.ignoreCase !== !1);
  }, R.isUndefined = function(o) {
    return o === void 0;
  }, R.isDefined = function(o) {
    return o !== void 0;
  }, R.isNaN = function(n) {
    return n !== n;
  }, R.isNull = function(o) {
    return null === o;
  }, R.isNumber = function(n) {
    return "[object Number]" === toString.call(n);
  }, R.isBoolean = function(b) {
    return b === !0 || b === !1;
  }, R.isArgs = function(a) {
    return !(!a || !R.has(a, "callee"));
  }, R.isEmpty = function(o) {
    return R.isArray(o) ? 0 === o.length : R.isObject(o) ? function() {
      for (var i in o) {
        i = 1;
        break;
      }
      return !!i;
    }() : "" === o;
  }, rex.chain = function(v, ctx) {
    return new Rex(v, ctx).chain();
  }, R.mixin(rex, R);
  var RP = Rex.prototype;
  return RP.constructor = Rex, RP.chain = function() {
    return this._chained = !0, this;
  }, RP.value = function() {
    return this._value;
  }, rex.each(R.keys(R), function(name, fn) {
    fn = rex[name], RP[name] = function() {
      for (var i = 0, ret = this._value, l = arguments.length, a = [ ret ]; l > i; ++i) a[i + 1] = arguments[i];
      return ret = fn.apply(this._context, a), this._value = ret, this._chained ? this : ret;
    };
  }), rex;
}), function(window, undefined) {
  function createOptions(options) {
    var object = optionsCache[options] = {};
    return jQuery.each(options.split(core_rspace), function(_, flag) {
      object[flag] = !0;
    }), object;
  }
  function dataAttr(elem, key, data) {
    if (data === undefined && 1 === elem.nodeType) {
      var name = "data-" + key.replace(rmultiDash, "-$1").toLowerCase();
      if (data = elem.getAttribute(name), "string" == typeof data) {
        try {
          data = "true" === data ? !0 : "false" === data ? !1 : "null" === data ? null : +data + "" === data ? +data : rbrace.test(data) ? jQuery.parseJSON(data) : data;
        } catch (e) {}
        jQuery.data(elem, key, data);
      } else data = undefined;
    }
    return data;
  }
  function isEmptyDataObject(obj) {
    var name;
    for (name in obj) if (("data" !== name || !jQuery.isEmptyObject(obj[name])) && "toJSON" !== name) return !1;
    return !0;
  }
  function returnFalse() {
    return !1;
  }
  function returnTrue() {
    return !0;
  }
  function isDisconnected(node) {
    return !node || !node.parentNode || 11 === node.parentNode.nodeType;
  }
  function sibling(cur, dir) {
    do cur = cur[dir]; while (cur && 1 !== cur.nodeType);
    return cur;
  }
  function winnow(elements, qualifier, keep) {
    if (qualifier = qualifier || 0, jQuery.isFunction(qualifier)) return jQuery.grep(elements, function(elem, i) {
      var retVal = !!qualifier.call(elem, i, elem);
      return retVal === keep;
    });
    if (qualifier.nodeType) return jQuery.grep(elements, function(elem) {
      return elem === qualifier === keep;
    });
    if ("string" == typeof qualifier) {
      var filtered = jQuery.grep(elements, function(elem) {
        return 1 === elem.nodeType;
      });
      if (isSimple.test(qualifier)) return jQuery.filter(qualifier, filtered, !keep);
      qualifier = jQuery.filter(qualifier, filtered);
    }
    return jQuery.grep(elements, function(elem) {
      return jQuery.inArray(elem, qualifier) >= 0 === keep;
    });
  }
  function createSafeFragment(document) {
    var list = nodeNames.split("|"), safeFrag = document.createDocumentFragment();
    if (safeFrag.createElement) for (;list.length; ) safeFrag.createElement(list.pop());
    return safeFrag;
  }
  function findOrAppend(elem, tag) {
    return elem.getElementsByTagName(tag)[0] || elem.appendChild(elem.ownerDocument.createElement(tag));
  }
  function cloneCopyEvent(src, dest) {
    if (1 === dest.nodeType && jQuery.hasData(src)) {
      var type, i, l, oldData = jQuery._data(src), curData = jQuery._data(dest, oldData), events = oldData.events;
      if (events) {
        delete curData.handle, curData.events = {};
        for (type in events) for (i = 0, l = events[type].length; l > i; i++) jQuery.event.add(dest, type, events[type][i]);
      }
      curData.data && (curData.data = jQuery.extend({}, curData.data));
    }
  }
  function cloneFixAttributes(src, dest) {
    var nodeName;
    1 === dest.nodeType && (dest.clearAttributes && dest.clearAttributes(), dest.mergeAttributes && dest.mergeAttributes(src), 
    nodeName = dest.nodeName.toLowerCase(), "object" === nodeName ? (dest.parentNode && (dest.outerHTML = src.outerHTML), 
    jQuery.support.html5Clone && src.innerHTML && !jQuery.trim(dest.innerHTML) && (dest.innerHTML = src.innerHTML)) : "input" === nodeName && rcheckableType.test(src.type) ? (dest.defaultChecked = dest.checked = src.checked, 
    dest.value !== src.value && (dest.value = src.value)) : "option" === nodeName ? dest.selected = src.defaultSelected : "input" === nodeName || "textarea" === nodeName ? dest.defaultValue = src.defaultValue : "script" === nodeName && dest.text !== src.text && (dest.text = src.text), 
    dest.removeAttribute(jQuery.expando));
  }
  function getAll(elem) {
    return elem.getElementsByTagName !== undefined ? elem.getElementsByTagName("*") : elem.querySelectorAll !== undefined ? elem.querySelectorAll("*") : [];
  }
  function fixDefaultChecked(elem) {
    rcheckableType.test(elem.type) && (elem.defaultChecked = elem.checked);
  }
  function vendorPropName(style, name) {
    if (name in style) return name;
    for (var capName = name.charAt(0).toUpperCase() + name.slice(1), origName = name, i = cssPrefixes.length; i--; ) if (name = cssPrefixes[i] + capName, 
    name in style) return name;
    return origName;
  }
  function isHidden(elem, el) {
    return elem = el || elem, "none" === jQuery.css(elem, "display") || !jQuery.contains(elem.ownerDocument, elem);
  }
  function showHide(elements, show) {
    for (var elem, display, values = [], index = 0, length = elements.length; length > index; index++) elem = elements[index], 
    elem.style && (values[index] = jQuery._data(elem, "olddisplay"), show ? (values[index] || "none" !== elem.style.display || (elem.style.display = ""), 
    "" === elem.style.display && isHidden(elem) && (values[index] = jQuery._data(elem, "olddisplay", css_defaultDisplay(elem.nodeName)))) : (display = curCSS(elem, "display"), 
    values[index] || "none" === display || jQuery._data(elem, "olddisplay", display)));
    for (index = 0; length > index; index++) elem = elements[index], elem.style && (show && "none" !== elem.style.display && "" !== elem.style.display || (elem.style.display = show ? values[index] || "" : "none"));
    return elements;
  }
  function setPositiveNumber(elem, value, subtract) {
    var matches = rnumsplit.exec(value);
    return matches ? Math.max(0, matches[1] - (subtract || 0)) + (matches[2] || "px") : value;
  }
  function augmentWidthOrHeight(elem, name, extra, isBorderBox) {
    for (var i = extra === (isBorderBox ? "border" : "content") ? 4 : "width" === name ? 1 : 0, val = 0; 4 > i; i += 2) "margin" === extra && (val += jQuery.css(elem, extra + cssExpand[i], !0)), 
    isBorderBox ? ("content" === extra && (val -= parseFloat(curCSS(elem, "padding" + cssExpand[i])) || 0), 
    "margin" !== extra && (val -= parseFloat(curCSS(elem, "border" + cssExpand[i] + "Width")) || 0)) : (val += parseFloat(curCSS(elem, "padding" + cssExpand[i])) || 0, 
    "padding" !== extra && (val += parseFloat(curCSS(elem, "border" + cssExpand[i] + "Width")) || 0));
    return val;
  }
  function getWidthOrHeight(elem, name, extra) {
    var val = "width" === name ? elem.offsetWidth : elem.offsetHeight, valueIsBorderBox = !0, isBorderBox = jQuery.support.boxSizing && "border-box" === jQuery.css(elem, "boxSizing");
    if (0 >= val || null == val) {
      if (val = curCSS(elem, name), (0 > val || null == val) && (val = elem.style[name]), 
      rnumnonpx.test(val)) return val;
      valueIsBorderBox = isBorderBox && (jQuery.support.boxSizingReliable || val === elem.style[name]), 
      val = parseFloat(val) || 0;
    }
    return val + augmentWidthOrHeight(elem, name, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox) + "px";
  }
  function css_defaultDisplay(nodeName) {
    if (elemdisplay[nodeName]) return elemdisplay[nodeName];
    var elem = jQuery("<" + nodeName + ">").appendTo(document.body), display = elem.css("display");
    return elem.remove(), ("none" === display || "" === display) && (iframe = document.body.appendChild(iframe || jQuery.extend(document.createElement("iframe"), {
      frameBorder: 0,
      width: 0,
      height: 0
    })), iframeDoc && iframe.createElement || (iframeDoc = (iframe.contentWindow || iframe.contentDocument).document, 
    iframeDoc.write("<!doctype html><html><body>"), iframeDoc.close()), elem = iframeDoc.body.appendChild(iframeDoc.createElement(nodeName)), 
    display = curCSS(elem, "display"), document.body.removeChild(iframe)), elemdisplay[nodeName] = display, 
    display;
  }
  function buildParams(prefix, obj, traditional, add) {
    var name;
    if (jQuery.isArray(obj)) jQuery.each(obj, function(i, v) {
      traditional || rbracket.test(prefix) ? add(prefix, v) : buildParams(prefix + "[" + ("object" == typeof v ? i : "") + "]", v, traditional, add);
    }); else if (traditional || "object" !== jQuery.type(obj)) add(prefix, obj); else for (name in obj) buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
  }
  function addToPrefiltersOrTransports(structure) {
    return function(dataTypeExpression, func) {
      "string" != typeof dataTypeExpression && (func = dataTypeExpression, dataTypeExpression = "*");
      var dataType, list, placeBefore, dataTypes = dataTypeExpression.toLowerCase().split(core_rspace), i = 0, length = dataTypes.length;
      if (jQuery.isFunction(func)) for (;length > i; i++) dataType = dataTypes[i], placeBefore = /^\+/.test(dataType), 
      placeBefore && (dataType = dataType.substr(1) || "*"), list = structure[dataType] = structure[dataType] || [], 
      list[placeBefore ? "unshift" : "push"](func);
    };
  }
  function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR, dataType, inspected) {
    dataType = dataType || options.dataTypes[0], inspected = inspected || {}, inspected[dataType] = !0;
    for (var selection, list = structure[dataType], i = 0, length = list ? list.length : 0, executeOnly = structure === prefilters; length > i && (executeOnly || !selection); i++) selection = list[i](options, originalOptions, jqXHR), 
    "string" == typeof selection && (!executeOnly || inspected[selection] ? selection = undefined : (options.dataTypes.unshift(selection), 
    selection = inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR, selection, inspected)));
    return !executeOnly && selection || inspected["*"] || (selection = inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR, "*", inspected)), 
    selection;
  }
  function ajaxExtend(target, src) {
    var key, deep, flatOptions = jQuery.ajaxSettings.flatOptions || {};
    for (key in src) src[key] !== undefined && ((flatOptions[key] ? target : deep || (deep = {}))[key] = src[key]);
    deep && jQuery.extend(!0, target, deep);
  }
  function ajaxHandleResponses(s, jqXHR, responses) {
    var ct, type, finalDataType, firstDataType, contents = s.contents, dataTypes = s.dataTypes, responseFields = s.responseFields;
    for (type in responseFields) type in responses && (jqXHR[responseFields[type]] = responses[type]);
    for (;"*" === dataTypes[0]; ) dataTypes.shift(), ct === undefined && (ct = s.mimeType || jqXHR.getResponseHeader("content-type"));
    if (ct) for (type in contents) if (contents[type] && contents[type].test(ct)) {
      dataTypes.unshift(type);
      break;
    }
    if (dataTypes[0] in responses) finalDataType = dataTypes[0]; else {
      for (type in responses) {
        if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
          finalDataType = type;
          break;
        }
        firstDataType || (firstDataType = type);
      }
      finalDataType = finalDataType || firstDataType;
    }
    return finalDataType ? (finalDataType !== dataTypes[0] && dataTypes.unshift(finalDataType), 
    responses[finalDataType]) : undefined;
  }
  function ajaxConvert(s, response) {
    var conv, conv2, current, tmp, dataTypes = s.dataTypes.slice(), prev = dataTypes[0], converters = {}, i = 0;
    if (s.dataFilter && (response = s.dataFilter(response, s.dataType)), dataTypes[1]) for (conv in s.converters) converters[conv.toLowerCase()] = s.converters[conv];
    for (;current = dataTypes[++i]; ) if ("*" !== current) {
      if ("*" !== prev && prev !== current) {
        if (conv = converters[prev + " " + current] || converters["* " + current], !conv) for (conv2 in converters) if (tmp = conv2.split(" "), 
        tmp[1] === current && (conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]])) {
          conv === !0 ? conv = converters[conv2] : converters[conv2] !== !0 && (current = tmp[0], 
          dataTypes.splice(i--, 0, current));
          break;
        }
        if (conv !== !0) if (conv && s["throws"]) response = conv(response); else try {
          response = conv(response);
        } catch (e) {
          return {
            state: "parsererror",
            error: conv ? e : "No conversion from " + prev + " to " + current
          };
        }
      }
      prev = current;
    }
    return {
      state: "success",
      data: response
    };
  }
  function createStandardXHR() {
    try {
      return new window.XMLHttpRequest();
    } catch (e) {}
  }
  function createActiveXHR() {
    try {
      return new window.ActiveXObject("Microsoft.XMLHTTP");
    } catch (e) {}
  }
  function createFxNow() {
    return setTimeout(function() {
      fxNow = undefined;
    }, 0), fxNow = jQuery.now();
  }
  function createTweens(animation, props) {
    jQuery.each(props, function(prop, value) {
      for (var collection = (tweeners[prop] || []).concat(tweeners["*"]), index = 0, length = collection.length; length > index; index++) if (collection[index].call(animation, prop, value)) return;
    });
  }
  function Animation(elem, properties, options) {
    var result, index = 0, length = animationPrefilters.length, deferred = jQuery.Deferred().always(function() {
      delete tick.elem;
    }), tick = function() {
      for (var currentTime = fxNow || createFxNow(), remaining = Math.max(0, animation.startTime + animation.duration - currentTime), percent = 1 - (remaining / animation.duration || 0), index = 0, length = animation.tweens.length; length > index; index++) animation.tweens[index].run(percent);
      return deferred.notifyWith(elem, [ animation, percent, remaining ]), 1 > percent && length ? remaining : (deferred.resolveWith(elem, [ animation ]), 
      !1);
    }, animation = deferred.promise({
      elem: elem,
      props: jQuery.extend({}, properties),
      opts: jQuery.extend(!0, {
        specialEasing: {}
      }, options),
      originalProperties: properties,
      originalOptions: options,
      startTime: fxNow || createFxNow(),
      duration: options.duration,
      tweens: [],
      createTween: function(prop, end) {
        var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
        return animation.tweens.push(tween), tween;
      },
      stop: function(gotoEnd) {
        for (var index = 0, length = gotoEnd ? animation.tweens.length : 0; length > index; index++) animation.tweens[index].run(1);
        return gotoEnd ? deferred.resolveWith(elem, [ animation, gotoEnd ]) : deferred.rejectWith(elem, [ animation, gotoEnd ]), 
        this;
      }
    }), props = animation.props;
    for (propFilter(props, animation.opts.specialEasing); length > index; index++) if (result = animationPrefilters[index].call(animation, elem, props, animation.opts)) return result;
    return createTweens(animation, props), jQuery.isFunction(animation.opts.start) && animation.opts.start.call(elem, animation), 
    jQuery.fx.timer(jQuery.extend(tick, {
      anim: animation,
      queue: animation.opts.queue,
      elem: elem
    })), animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
  }
  function propFilter(props, specialEasing) {
    var index, name, easing, value, hooks;
    for (index in props) if (name = jQuery.camelCase(index), easing = specialEasing[name], 
    value = props[index], jQuery.isArray(value) && (easing = value[1], value = props[index] = value[0]), 
    index !== name && (props[name] = value, delete props[index]), hooks = jQuery.cssHooks[name], 
    hooks && "expand" in hooks) {
      value = hooks.expand(value), delete props[name];
      for (index in value) index in props || (props[index] = value[index], specialEasing[index] = easing);
    } else specialEasing[name] = easing;
  }
  function defaultPrefilter(elem, props, opts) {
    var index, prop, value, length, dataShow, tween, hooks, oldfire, anim = this, style = elem.style, orig = {}, handled = [], hidden = elem.nodeType && isHidden(elem);
    opts.queue || (hooks = jQuery._queueHooks(elem, "fx"), null == hooks.unqueued && (hooks.unqueued = 0, 
    oldfire = hooks.empty.fire, hooks.empty.fire = function() {
      hooks.unqueued || oldfire();
    }), hooks.unqueued++, anim.always(function() {
      anim.always(function() {
        hooks.unqueued--, jQuery.queue(elem, "fx").length || hooks.empty.fire();
      });
    })), 1 === elem.nodeType && ("height" in props || "width" in props) && (opts.overflow = [ style.overflow, style.overflowX, style.overflowY ], 
    "inline" === jQuery.css(elem, "display") && "none" === jQuery.css(elem, "float") && (jQuery.support.inlineBlockNeedsLayout && "inline" !== css_defaultDisplay(elem.nodeName) ? style.zoom = 1 : style.display = "inline-block")), 
    opts.overflow && (style.overflow = "hidden", jQuery.support.shrinkWrapBlocks || anim.done(function() {
      style.overflow = opts.overflow[0], style.overflowX = opts.overflow[1], style.overflowY = opts.overflow[2];
    }));
    for (index in props) if (value = props[index], rfxtypes.exec(value)) {
      if (delete props[index], value === (hidden ? "hide" : "show")) continue;
      handled.push(index);
    }
    if (length = handled.length) for (dataShow = jQuery._data(elem, "fxshow") || jQuery._data(elem, "fxshow", {}), 
    hidden ? jQuery(elem).show() : anim.done(function() {
      jQuery(elem).hide();
    }), anim.done(function() {
      var prop;
      jQuery.removeData(elem, "fxshow", !0);
      for (prop in orig) jQuery.style(elem, prop, orig[prop]);
    }), index = 0; length > index; index++) prop = handled[index], tween = anim.createTween(prop, hidden ? dataShow[prop] : 0), 
    orig[prop] = dataShow[prop] || jQuery.style(elem, prop), prop in dataShow || (dataShow[prop] = tween.start, 
    hidden && (tween.end = tween.start, tween.start = "width" === prop || "height" === prop ? 1 : 0));
  }
  function Tween(elem, options, prop, end, easing) {
    return new Tween.prototype.init(elem, options, prop, end, easing);
  }
  function genFx(type, includeWidth) {
    var which, attrs = {
      height: type
    }, i = 0;
    for (includeWidth = includeWidth ? 1 : 0; 4 > i; i += 2 - includeWidth) which = cssExpand[i], 
    attrs["margin" + which] = attrs["padding" + which] = type;
    return includeWidth && (attrs.opacity = attrs.width = type), attrs;
  }
  function getWindow(elem) {
    return jQuery.isWindow(elem) ? elem : 9 === elem.nodeType ? elem.defaultView || elem.parentWindow : !1;
  }
  var rootjQuery, readyList, document = window.document, location = window.location, navigator = window.navigator, _jQuery = window.jQuery, _$ = window.$, core_push = Array.prototype.push, core_slice = Array.prototype.slice, core_indexOf = Array.prototype.indexOf, core_toString = Object.prototype.toString, core_hasOwn = Object.prototype.hasOwnProperty, core_trim = String.prototype.trim, jQuery = function(selector, context) {
    return new jQuery.fn.init(selector, context, rootjQuery);
  }, core_pnum = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source, core_rnotwhite = /\S/, core_rspace = /\s+/, rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, rquickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/, rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, rvalidchars = /^[\],:{}\s]*$/, rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g, rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g, rmsPrefix = /^-ms-/, rdashAlpha = /-([\da-z])/gi, fcamelCase = function(all, letter) {
    return (letter + "").toUpperCase();
  }, DOMContentLoaded = function() {
    document.addEventListener ? (document.removeEventListener("DOMContentLoaded", DOMContentLoaded, !1), 
    jQuery.ready()) : "complete" === document.readyState && (document.detachEvent("onreadystatechange", DOMContentLoaded), 
    jQuery.ready());
  }, class2type = {};
  jQuery.fn = jQuery.prototype = {
    constructor: jQuery,
    init: function(selector, context, rootjQuery) {
      var match, elem, doc;
      if (!selector) return this;
      if (selector.nodeType) return this.context = this[0] = selector, this.length = 1, 
      this;
      if ("string" == typeof selector) {
        if (match = "<" === selector.charAt(0) && ">" === selector.charAt(selector.length - 1) && selector.length >= 3 ? [ null, selector, null ] : rquickExpr.exec(selector), 
        !match || !match[1] && context) return !context || context.jquery ? (context || rootjQuery).find(selector) : this.constructor(context).find(selector);
        if (match[1]) return context = context instanceof jQuery ? context[0] : context, 
        doc = context && context.nodeType ? context.ownerDocument || context : document, 
        selector = jQuery.parseHTML(match[1], doc, !0), rsingleTag.test(match[1]) && jQuery.isPlainObject(context) && this.attr.call(selector, context, !0), 
        jQuery.merge(this, selector);
        if (elem = document.getElementById(match[2]), elem && elem.parentNode) {
          if (elem.id !== match[2]) return rootjQuery.find(selector);
          this.length = 1, this[0] = elem;
        }
        return this.context = document, this.selector = selector, this;
      }
      return jQuery.isFunction(selector) ? rootjQuery.ready(selector) : (selector.selector !== undefined && (this.selector = selector.selector, 
      this.context = selector.context), jQuery.makeArray(selector, this));
    },
    selector: "",
    jquery: "1.8.2",
    length: 0,
    size: function() {
      return this.length;
    },
    toArray: function() {
      return core_slice.call(this);
    },
    get: function(num) {
      return null == num ? this.toArray() : 0 > num ? this[this.length + num] : this[num];
    },
    pushStack: function(elems, name, selector) {
      var ret = jQuery.merge(this.constructor(), elems);
      return ret.prevObject = this, ret.context = this.context, "find" === name ? ret.selector = this.selector + (this.selector ? " " : "") + selector : name && (ret.selector = this.selector + "." + name + "(" + selector + ")"), 
      ret;
    },
    each: function(callback, args) {
      return jQuery.each(this, callback, args);
    },
    ready: function(fn) {
      return jQuery.ready.promise().done(fn), this;
    },
    eq: function(i) {
      return i = +i, -1 === i ? this.slice(i) : this.slice(i, i + 1);
    },
    first: function() {
      return this.eq(0);
    },
    last: function() {
      return this.eq(-1);
    },
    slice: function() {
      return this.pushStack(core_slice.apply(this, arguments), "slice", core_slice.call(arguments).join(","));
    },
    map: function(callback) {
      return this.pushStack(jQuery.map(this, function(elem, i) {
        return callback.call(elem, i, elem);
      }));
    },
    end: function() {
      return this.prevObject || this.constructor(null);
    },
    push: core_push,
    sort: [].sort,
    splice: [].splice
  }, jQuery.fn.init.prototype = jQuery.fn, jQuery.extend = jQuery.fn.extend = function() {
    var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = !1;
    for ("boolean" == typeof target && (deep = target, target = arguments[1] || {}, 
    i = 2), "object" == typeof target || jQuery.isFunction(target) || (target = {}), 
    length === i && (target = this, --i); length > i; i++) if (null != (options = arguments[i])) for (name in options) src = target[name], 
    copy = options[name], target !== copy && (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy))) ? (copyIsArray ? (copyIsArray = !1, 
    clone = src && jQuery.isArray(src) ? src : []) : clone = src && jQuery.isPlainObject(src) ? src : {}, 
    target[name] = jQuery.extend(deep, clone, copy)) : copy !== undefined && (target[name] = copy));
    return target;
  }, jQuery.extend({
    noConflict: function(deep) {
      return window.$ === jQuery && (window.$ = _$), deep && window.jQuery === jQuery && (window.jQuery = _jQuery), 
      jQuery;
    },
    isReady: !1,
    readyWait: 1,
    holdReady: function(hold) {
      hold ? jQuery.readyWait++ : jQuery.ready(!0);
    },
    ready: function(wait) {
      if (wait === !0 ? !--jQuery.readyWait : !jQuery.isReady) {
        if (!document.body) return setTimeout(jQuery.ready, 1);
        jQuery.isReady = !0, wait !== !0 && --jQuery.readyWait > 0 || (readyList.resolveWith(document, [ jQuery ]), 
        jQuery.fn.trigger && jQuery(document).trigger("ready").off("ready"));
      }
    },
    isFunction: function(obj) {
      return "function" === jQuery.type(obj);
    },
    isArray: Array.isArray || function(obj) {
      return "array" === jQuery.type(obj);
    },
    isWindow: function(obj) {
      return null != obj && obj == obj.window;
    },
    isNumeric: function(obj) {
      return !isNaN(parseFloat(obj)) && isFinite(obj);
    },
    type: function(obj) {
      return null == obj ? obj + "" : class2type[core_toString.call(obj)] || "object";
    },
    isPlainObject: function(obj) {
      if (!obj || "object" !== jQuery.type(obj) || obj.nodeType || jQuery.isWindow(obj)) return !1;
      try {
        if (obj.constructor && !core_hasOwn.call(obj, "constructor") && !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) return !1;
      } catch (e) {
        return !1;
      }
      var key;
      for (key in obj) ;
      return key === undefined || core_hasOwn.call(obj, key);
    },
    isEmptyObject: function(obj) {
      var name;
      for (name in obj) return !1;
      return !0;
    },
    error: function(msg) {
      throw Error(msg);
    },
    parseHTML: function(data, context, scripts) {
      var parsed;
      return data && "string" == typeof data ? ("boolean" == typeof context && (scripts = context, 
      context = 0), context = context || document, (parsed = rsingleTag.exec(data)) ? [ context.createElement(parsed[1]) ] : (parsed = jQuery.buildFragment([ data ], context, scripts ? null : []), 
      jQuery.merge([], (parsed.cacheable ? jQuery.clone(parsed.fragment) : parsed.fragment).childNodes))) : null;
    },
    parseJSON: function(data) {
      return data && "string" == typeof data ? (data = jQuery.trim(data), window.JSON && window.JSON.parse ? window.JSON.parse(data) : rvalidchars.test(data.replace(rvalidescape, "@").replace(rvalidtokens, "]").replace(rvalidbraces, "")) ? Function("return " + data)() : (jQuery.error("Invalid JSON: " + data), 
      undefined)) : null;
    },
    parseXML: function(data) {
      var xml, tmp;
      if (!data || "string" != typeof data) return null;
      try {
        window.DOMParser ? (tmp = new DOMParser(), xml = tmp.parseFromString(data, "text/xml")) : (xml = new ActiveXObject("Microsoft.XMLDOM"), 
        xml.async = "false", xml.loadXML(data));
      } catch (e) {
        xml = undefined;
      }
      return xml && xml.documentElement && !xml.getElementsByTagName("parsererror").length || jQuery.error("Invalid XML: " + data), 
      xml;
    },
    noop: function() {},
    globalEval: function(data) {
      data && core_rnotwhite.test(data) && (window.execScript || function(data) {
        window.eval.call(window, data);
      })(data);
    },
    camelCase: function(string) {
      return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
    },
    nodeName: function(elem, name) {
      return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
    },
    each: function(obj, callback, args) {
      var name, i = 0, length = obj.length, isObj = length === undefined || jQuery.isFunction(obj);
      if (args) if (isObj) {
        for (name in obj) if (callback.apply(obj[name], args) === !1) break;
      } else for (;length > i && callback.apply(obj[i++], args) !== !1; ) ; else if (isObj) {
        for (name in obj) if (callback.call(obj[name], name, obj[name]) === !1) break;
      } else for (;length > i && callback.call(obj[i], i, obj[i++]) !== !1; ) ;
      return obj;
    },
    trim: core_trim && !core_trim.call("﻿ ") ? function(text) {
      return null == text ? "" : core_trim.call(text);
    } : function(text) {
      return null == text ? "" : (text + "").replace(rtrim, "");
    },
    makeArray: function(arr, results) {
      var type, ret = results || [];
      return null != arr && (type = jQuery.type(arr), null == arr.length || "string" === type || "function" === type || "regexp" === type || jQuery.isWindow(arr) ? core_push.call(ret, arr) : jQuery.merge(ret, arr)), 
      ret;
    },
    inArray: function(elem, arr, i) {
      var len;
      if (arr) {
        if (core_indexOf) return core_indexOf.call(arr, elem, i);
        for (len = arr.length, i = i ? 0 > i ? Math.max(0, len + i) : i : 0; len > i; i++) if (i in arr && arr[i] === elem) return i;
      }
      return -1;
    },
    merge: function(first, second) {
      var l = second.length, i = first.length, j = 0;
      if ("number" == typeof l) for (;l > j; j++) first[i++] = second[j]; else for (;second[j] !== undefined; ) first[i++] = second[j++];
      return first.length = i, first;
    },
    grep: function(elems, callback, inv) {
      var retVal, ret = [], i = 0, length = elems.length;
      for (inv = !!inv; length > i; i++) retVal = !!callback(elems[i], i), inv !== retVal && ret.push(elems[i]);
      return ret;
    },
    map: function(elems, callback, arg) {
      var value, key, ret = [], i = 0, length = elems.length, isArray = elems instanceof jQuery || length !== undefined && "number" == typeof length && (length > 0 && elems[0] && elems[length - 1] || 0 === length || jQuery.isArray(elems));
      if (isArray) for (;length > i; i++) value = callback(elems[i], i, arg), null != value && (ret[ret.length] = value); else for (key in elems) value = callback(elems[key], key, arg), 
      null != value && (ret[ret.length] = value);
      return ret.concat.apply([], ret);
    },
    guid: 1,
    proxy: function(fn, context) {
      var tmp, args, proxy;
      return "string" == typeof context && (tmp = fn[context], context = fn, fn = tmp), 
      jQuery.isFunction(fn) ? (args = core_slice.call(arguments, 2), proxy = function() {
        return fn.apply(context, args.concat(core_slice.call(arguments)));
      }, proxy.guid = fn.guid = fn.guid || jQuery.guid++, proxy) : undefined;
    },
    access: function(elems, fn, key, value, chainable, emptyGet, pass) {
      var exec, bulk = null == key, i = 0, length = elems.length;
      if (key && "object" == typeof key) {
        for (i in key) jQuery.access(elems, fn, i, key[i], 1, emptyGet, value);
        chainable = 1;
      } else if (value !== undefined) {
        if (exec = pass === undefined && jQuery.isFunction(value), bulk && (exec ? (exec = fn, 
        fn = function(elem, key, value) {
          return exec.call(jQuery(elem), value);
        }) : (fn.call(elems, value), fn = null)), fn) for (;length > i; i++) fn(elems[i], key, exec ? value.call(elems[i], i, fn(elems[i], key)) : value, pass);
        chainable = 1;
      }
      return chainable ? elems : bulk ? fn.call(elems) : length ? fn(elems[0], key) : emptyGet;
    },
    now: function() {
      return new Date().getTime();
    }
  }), jQuery.ready.promise = function(obj) {
    if (!readyList) if (readyList = jQuery.Deferred(), "complete" === document.readyState) setTimeout(jQuery.ready, 1); else if (document.addEventListener) document.addEventListener("DOMContentLoaded", DOMContentLoaded, !1), 
    window.addEventListener("load", jQuery.ready, !1); else {
      document.attachEvent("onreadystatechange", DOMContentLoaded), window.attachEvent("onload", jQuery.ready);
      var top = !1;
      try {
        top = null == window.frameElement && document.documentElement;
      } catch (e) {}
      top && top.doScroll && function doScrollCheck() {
        if (!jQuery.isReady) {
          try {
            top.doScroll("left");
          } catch (e) {
            return setTimeout(doScrollCheck, 50);
          }
          jQuery.ready();
        }
      }();
    }
    return readyList.promise(obj);
  }, jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
    class2type["[object " + name + "]"] = name.toLowerCase();
  }), rootjQuery = jQuery(document);
  var optionsCache = {};
  jQuery.Callbacks = function(options) {
    options = "string" == typeof options ? optionsCache[options] || createOptions(options) : jQuery.extend({}, options);
    var memory, fired, firing, firingStart, firingLength, firingIndex, list = [], stack = !options.once && [], fire = function(data) {
      for (memory = options.memory && data, fired = !0, firingIndex = firingStart || 0, 
      firingStart = 0, firingLength = list.length, firing = !0; list && firingLength > firingIndex; firingIndex++) if (list[firingIndex].apply(data[0], data[1]) === !1 && options.stopOnFalse) {
        memory = !1;
        break;
      }
      firing = !1, list && (stack ? stack.length && fire(stack.shift()) : memory ? list = [] : self.disable());
    }, self = {
      add: function() {
        if (list) {
          var start = list.length;
          (function add(args) {
            jQuery.each(args, function(_, arg) {
              var type = jQuery.type(arg);
              "function" !== type || options.unique && self.has(arg) ? arg && arg.length && "string" !== type && add(arg) : list.push(arg);
            });
          })(arguments), firing ? firingLength = list.length : memory && (firingStart = start, 
          fire(memory));
        }
        return this;
      },
      remove: function() {
        return list && jQuery.each(arguments, function(_, arg) {
          for (var index; (index = jQuery.inArray(arg, list, index)) > -1; ) list.splice(index, 1), 
          firing && (firingLength >= index && firingLength--, firingIndex >= index && firingIndex--);
        }), this;
      },
      has: function(fn) {
        return jQuery.inArray(fn, list) > -1;
      },
      empty: function() {
        return list = [], this;
      },
      disable: function() {
        return list = stack = memory = undefined, this;
      },
      disabled: function() {
        return !list;
      },
      lock: function() {
        return stack = undefined, memory || self.disable(), this;
      },
      locked: function() {
        return !stack;
      },
      fireWith: function(context, args) {
        return args = args || [], args = [ context, args.slice ? args.slice() : args ], 
        !list || fired && !stack || (firing ? stack.push(args) : fire(args)), this;
      },
      fire: function() {
        return self.fireWith(this, arguments), this;
      },
      fired: function() {
        return !!fired;
      }
    };
    return self;
  }, jQuery.extend({
    Deferred: function(func) {
      var tuples = [ [ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ], [ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ], [ "notify", "progress", jQuery.Callbacks("memory") ] ], state = "pending", promise = {
        state: function() {
          return state;
        },
        always: function() {
          return deferred.done(arguments).fail(arguments), this;
        },
        then: function() {
          var fns = arguments;
          return jQuery.Deferred(function(newDefer) {
            jQuery.each(tuples, function(i, tuple) {
              var action = tuple[0], fn = fns[i];
              deferred[tuple[1]](jQuery.isFunction(fn) ? function() {
                var returned = fn.apply(this, arguments);
                returned && jQuery.isFunction(returned.promise) ? returned.promise().done(newDefer.resolve).fail(newDefer.reject).progress(newDefer.notify) : newDefer[action + "With"](this === deferred ? newDefer : this, [ returned ]);
              } : newDefer[action]);
            }), fns = null;
          }).promise();
        },
        promise: function(obj) {
          return null != obj ? jQuery.extend(obj, promise) : promise;
        }
      }, deferred = {};
      return promise.pipe = promise.then, jQuery.each(tuples, function(i, tuple) {
        var list = tuple[2], stateString = tuple[3];
        promise[tuple[1]] = list.add, stateString && list.add(function() {
          state = stateString;
        }, tuples[1 ^ i][2].disable, tuples[2][2].lock), deferred[tuple[0]] = list.fire, 
        deferred[tuple[0] + "With"] = list.fireWith;
      }), promise.promise(deferred), func && func.call(deferred, deferred), deferred;
    },
    when: function(subordinate) {
      var progressValues, progressContexts, resolveContexts, i = 0, resolveValues = core_slice.call(arguments), length = resolveValues.length, remaining = 1 !== length || subordinate && jQuery.isFunction(subordinate.promise) ? length : 0, deferred = 1 === remaining ? subordinate : jQuery.Deferred(), updateFunc = function(i, contexts, values) {
        return function(value) {
          contexts[i] = this, values[i] = arguments.length > 1 ? core_slice.call(arguments) : value, 
          values === progressValues ? deferred.notifyWith(contexts, values) : --remaining || deferred.resolveWith(contexts, values);
        };
      };
      if (length > 1) for (progressValues = Array(length), progressContexts = Array(length), 
      resolveContexts = Array(length); length > i; i++) resolveValues[i] && jQuery.isFunction(resolveValues[i].promise) ? resolveValues[i].promise().done(updateFunc(i, resolveContexts, resolveValues)).fail(deferred.reject).progress(updateFunc(i, progressContexts, progressValues)) : --remaining;
      return remaining || deferred.resolveWith(resolveContexts, resolveValues), deferred.promise();
    }
  }), jQuery.support = function() {
    var support, all, a, select, opt, input, fragment, eventName, i, isSupported, clickFn, div = document.createElement("div");
    if (div.setAttribute("className", "t"), div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", 
    all = div.getElementsByTagName("*"), a = div.getElementsByTagName("a")[0], a.style.cssText = "top:1px;float:left;opacity:.5", 
    !all || !all.length) return {};
    select = document.createElement("select"), opt = select.appendChild(document.createElement("option")), 
    input = div.getElementsByTagName("input")[0], support = {
      leadingWhitespace: 3 === div.firstChild.nodeType,
      tbody: !div.getElementsByTagName("tbody").length,
      htmlSerialize: !!div.getElementsByTagName("link").length,
      style: /top/.test(a.getAttribute("style")),
      hrefNormalized: "/a" === a.getAttribute("href"),
      opacity: /^0.5/.test(a.style.opacity),
      cssFloat: !!a.style.cssFloat,
      checkOn: "on" === input.value,
      optSelected: opt.selected,
      getSetAttribute: "t" !== div.className,
      enctype: !!document.createElement("form").enctype,
      html5Clone: "<:nav></:nav>" !== document.createElement("nav").cloneNode(!0).outerHTML,
      boxModel: "CSS1Compat" === document.compatMode,
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
    }, input.checked = !0, support.noCloneChecked = input.cloneNode(!0).checked, select.disabled = !0, 
    support.optDisabled = !opt.disabled;
    try {
      delete div.test;
    } catch (e) {
      support.deleteExpando = !1;
    }
    if (!div.addEventListener && div.attachEvent && div.fireEvent && (div.attachEvent("onclick", clickFn = function() {
      support.noCloneEvent = !1;
    }), div.cloneNode(!0).fireEvent("onclick"), div.detachEvent("onclick", clickFn)), 
    input = document.createElement("input"), input.value = "t", input.setAttribute("type", "radio"), 
    support.radioValue = "t" === input.value, input.setAttribute("checked", "checked"), 
    input.setAttribute("name", "t"), div.appendChild(input), fragment = document.createDocumentFragment(), 
    fragment.appendChild(div.lastChild), support.checkClone = fragment.cloneNode(!0).cloneNode(!0).lastChild.checked, 
    support.appendChecked = input.checked, fragment.removeChild(input), fragment.appendChild(div), 
    div.attachEvent) for (i in {
      submit: !0,
      change: !0,
      focusin: !0
    }) eventName = "on" + i, isSupported = eventName in div, isSupported || (div.setAttribute(eventName, "return;"), 
    isSupported = "function" == typeof div[eventName]), support[i + "Bubbles"] = isSupported;
    return jQuery(function() {
      var container, div, tds, marginDiv, divReset = "padding:0;margin:0;border:0;display:block;overflow:hidden;", body = document.getElementsByTagName("body")[0];
      body && (container = document.createElement("div"), container.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px", 
      body.insertBefore(container, body.firstChild), div = document.createElement("div"), 
      container.appendChild(div), div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", 
      tds = div.getElementsByTagName("td"), tds[0].style.cssText = "padding:0;margin:0;border:0;display:none", 
      isSupported = 0 === tds[0].offsetHeight, tds[0].style.display = "", tds[1].style.display = "none", 
      support.reliableHiddenOffsets = isSupported && 0 === tds[0].offsetHeight, div.innerHTML = "", 
      div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", 
      support.boxSizing = 4 === div.offsetWidth, support.doesNotIncludeMarginInBodyOffset = 1 !== body.offsetTop, 
      window.getComputedStyle && (support.pixelPosition = "1%" !== (window.getComputedStyle(div, null) || {}).top, 
      support.boxSizingReliable = "4px" === (window.getComputedStyle(div, null) || {
        width: "4px"
      }).width, marginDiv = document.createElement("div"), marginDiv.style.cssText = div.style.cssText = divReset, 
      marginDiv.style.marginRight = marginDiv.style.width = "0", div.style.width = "1px", 
      div.appendChild(marginDiv), support.reliableMarginRight = !parseFloat((window.getComputedStyle(marginDiv, null) || {}).marginRight)), 
      div.style.zoom !== undefined && (div.innerHTML = "", div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1", 
      support.inlineBlockNeedsLayout = 3 === div.offsetWidth, div.style.display = "block", 
      div.style.overflow = "visible", div.innerHTML = "<div></div>", div.firstChild.style.width = "5px", 
      support.shrinkWrapBlocks = 3 !== div.offsetWidth, container.style.zoom = 1), body.removeChild(container), 
      container = div = tds = marginDiv = null);
    }), fragment.removeChild(div), all = a = select = opt = input = fragment = div = null, 
    support;
  }();
  var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, rmultiDash = /([A-Z])/g;
  jQuery.extend({
    cache: {},
    deletedIds: [],
    uuid: 0,
    expando: "jQuery" + (jQuery.fn.jquery + Math.random()).replace(/\D/g, ""),
    noData: {
      embed: !0,
      object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
      applet: !0
    },
    hasData: function(elem) {
      return elem = elem.nodeType ? jQuery.cache[elem[jQuery.expando]] : elem[jQuery.expando], 
      !!elem && !isEmptyDataObject(elem);
    },
    data: function(elem, name, data, pvt) {
      if (jQuery.acceptData(elem)) {
        var thisCache, ret, internalKey = jQuery.expando, getByName = "string" == typeof name, isNode = elem.nodeType, cache = isNode ? jQuery.cache : elem, id = isNode ? elem[internalKey] : elem[internalKey] && internalKey;
        if (id && cache[id] && (pvt || cache[id].data) || !getByName || data !== undefined) return id || (isNode ? elem[internalKey] = id = jQuery.deletedIds.pop() || jQuery.guid++ : id = internalKey), 
        cache[id] || (cache[id] = {}, isNode || (cache[id].toJSON = jQuery.noop)), ("object" == typeof name || "function" == typeof name) && (pvt ? cache[id] = jQuery.extend(cache[id], name) : cache[id].data = jQuery.extend(cache[id].data, name)), 
        thisCache = cache[id], pvt || (thisCache.data || (thisCache.data = {}), thisCache = thisCache.data), 
        data !== undefined && (thisCache[jQuery.camelCase(name)] = data), getByName ? (ret = thisCache[name], 
        null == ret && (ret = thisCache[jQuery.camelCase(name)])) : ret = thisCache, ret;
      }
    },
    removeData: function(elem, name, pvt) {
      if (jQuery.acceptData(elem)) {
        var thisCache, i, l, isNode = elem.nodeType, cache = isNode ? jQuery.cache : elem, id = isNode ? elem[jQuery.expando] : jQuery.expando;
        if (cache[id]) {
          if (name && (thisCache = pvt ? cache[id] : cache[id].data)) {
            jQuery.isArray(name) || (name in thisCache ? name = [ name ] : (name = jQuery.camelCase(name), 
            name = name in thisCache ? [ name ] : name.split(" ")));
            for (i = 0, l = name.length; l > i; i++) delete thisCache[name[i]];
            if (!(pvt ? isEmptyDataObject : jQuery.isEmptyObject)(thisCache)) return;
          }
          (pvt || (delete cache[id].data, isEmptyDataObject(cache[id]))) && (isNode ? jQuery.cleanData([ elem ], !0) : jQuery.support.deleteExpando || cache != cache.window ? delete cache[id] : cache[id] = null);
        }
      }
    },
    _data: function(elem, name, data) {
      return jQuery.data(elem, name, data, !0);
    },
    acceptData: function(elem) {
      var noData = elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()];
      return !noData || noData !== !0 && elem.getAttribute("classid") === noData;
    }
  }), jQuery.fn.extend({
    data: function(key, value) {
      var parts, part, attr, name, l, elem = this[0], i = 0, data = null;
      if (key === undefined) {
        if (this.length && (data = jQuery.data(elem), 1 === elem.nodeType && !jQuery._data(elem, "parsedAttrs"))) {
          for (attr = elem.attributes, l = attr.length; l > i; i++) name = attr[i].name, name.indexOf("data-") || (name = jQuery.camelCase(name.substring(5)), 
          dataAttr(elem, name, data[name]));
          jQuery._data(elem, "parsedAttrs", !0);
        }
        return data;
      }
      return "object" == typeof key ? this.each(function() {
        jQuery.data(this, key);
      }) : (parts = key.split(".", 2), parts[1] = parts[1] ? "." + parts[1] : "", part = parts[1] + "!", 
      jQuery.access(this, function(value) {
        return value === undefined ? (data = this.triggerHandler("getData" + part, [ parts[0] ]), 
        data === undefined && elem && (data = jQuery.data(elem, key), data = dataAttr(elem, key, data)), 
        data === undefined && parts[1] ? this.data(parts[0]) : data) : (parts[1] = value, 
        this.each(function() {
          var self = jQuery(this);
          self.triggerHandler("setData" + part, parts), jQuery.data(this, key, value), self.triggerHandler("changeData" + part, parts);
        }), undefined);
      }, null, value, arguments.length > 1, null, !1));
    },
    removeData: function(key) {
      return this.each(function() {
        jQuery.removeData(this, key);
      });
    }
  }), jQuery.extend({
    queue: function(elem, type, data) {
      var queue;
      return elem ? (type = (type || "fx") + "queue", queue = jQuery._data(elem, type), 
      data && (!queue || jQuery.isArray(data) ? queue = jQuery._data(elem, type, jQuery.makeArray(data)) : queue.push(data)), 
      queue || []) : undefined;
    },
    dequeue: function(elem, type) {
      type = type || "fx";
      var queue = jQuery.queue(elem, type), startLength = queue.length, fn = queue.shift(), hooks = jQuery._queueHooks(elem, type), next = function() {
        jQuery.dequeue(elem, type);
      };
      "inprogress" === fn && (fn = queue.shift(), startLength--), fn && ("fx" === type && queue.unshift("inprogress"), 
      delete hooks.stop, fn.call(elem, next, hooks)), !startLength && hooks && hooks.empty.fire();
    },
    _queueHooks: function(elem, type) {
      var key = type + "queueHooks";
      return jQuery._data(elem, key) || jQuery._data(elem, key, {
        empty: jQuery.Callbacks("once memory").add(function() {
          jQuery.removeData(elem, type + "queue", !0), jQuery.removeData(elem, key, !0);
        })
      });
    }
  }), jQuery.fn.extend({
    queue: function(type, data) {
      var setter = 2;
      return "string" != typeof type && (data = type, type = "fx", setter--), setter > arguments.length ? jQuery.queue(this[0], type) : data === undefined ? this : this.each(function() {
        var queue = jQuery.queue(this, type, data);
        jQuery._queueHooks(this, type), "fx" === type && "inprogress" !== queue[0] && jQuery.dequeue(this, type);
      });
    },
    dequeue: function(type) {
      return this.each(function() {
        jQuery.dequeue(this, type);
      });
    },
    delay: function(time, type) {
      return time = jQuery.fx ? jQuery.fx.speeds[time] || time : time, type = type || "fx", 
      this.queue(type, function(next, hooks) {
        var timeout = setTimeout(next, time);
        hooks.stop = function() {
          clearTimeout(timeout);
        };
      });
    },
    clearQueue: function(type) {
      return this.queue(type || "fx", []);
    },
    promise: function(type, obj) {
      var tmp, count = 1, defer = jQuery.Deferred(), elements = this, i = this.length, resolve = function() {
        --count || defer.resolveWith(elements, [ elements ]);
      };
      for ("string" != typeof type && (obj = type, type = undefined), type = type || "fx"; i--; ) tmp = jQuery._data(elements[i], type + "queueHooks"), 
      tmp && tmp.empty && (count++, tmp.empty.add(resolve));
      return resolve(), defer.promise(obj);
    }
  });
  var nodeHook, boolHook, fixSpecified, rclass = /[\t\r\n]/g, rreturn = /\r/g, rtype = /^(?:button|input)$/i, rfocusable = /^(?:button|input|object|select|textarea)$/i, rclickable = /^a(?:rea|)$/i, rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i, getSetAttribute = jQuery.support.getSetAttribute;
  jQuery.fn.extend({
    attr: function(name, value) {
      return jQuery.access(this, jQuery.attr, name, value, arguments.length > 1);
    },
    removeAttr: function(name) {
      return this.each(function() {
        jQuery.removeAttr(this, name);
      });
    },
    prop: function(name, value) {
      return jQuery.access(this, jQuery.prop, name, value, arguments.length > 1);
    },
    removeProp: function(name) {
      return name = jQuery.propFix[name] || name, this.each(function() {
        try {
          this[name] = undefined, delete this[name];
        } catch (e) {}
      });
    },
    addClass: function(value) {
      var classNames, i, l, elem, setClass, c, cl;
      if (jQuery.isFunction(value)) return this.each(function(j) {
        jQuery(this).addClass(value.call(this, j, this.className));
      });
      if (value && "string" == typeof value) for (classNames = value.split(core_rspace), 
      i = 0, l = this.length; l > i; i++) if (elem = this[i], 1 === elem.nodeType) if (elem.className || 1 !== classNames.length) {
        for (setClass = " " + elem.className + " ", c = 0, cl = classNames.length; cl > c; c++) 0 > setClass.indexOf(" " + classNames[c] + " ") && (setClass += classNames[c] + " ");
        elem.className = jQuery.trim(setClass);
      } else elem.className = value;
      return this;
    },
    removeClass: function(value) {
      var removes, className, elem, c, cl, i, l;
      if (jQuery.isFunction(value)) return this.each(function(j) {
        jQuery(this).removeClass(value.call(this, j, this.className));
      });
      if (value && "string" == typeof value || value === undefined) for (removes = (value || "").split(core_rspace), 
      i = 0, l = this.length; l > i; i++) if (elem = this[i], 1 === elem.nodeType && elem.className) {
        for (className = (" " + elem.className + " ").replace(rclass, " "), c = 0, cl = removes.length; cl > c; c++) for (;className.indexOf(" " + removes[c] + " ") >= 0; ) className = className.replace(" " + removes[c] + " ", " ");
        elem.className = value ? jQuery.trim(className) : "";
      }
      return this;
    },
    toggleClass: function(value, stateVal) {
      var type = typeof value, isBool = "boolean" == typeof stateVal;
      return jQuery.isFunction(value) ? this.each(function(i) {
        jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal);
      }) : this.each(function() {
        if ("string" === type) for (var className, i = 0, self = jQuery(this), state = stateVal, classNames = value.split(core_rspace); className = classNames[i++]; ) state = isBool ? state : !self.hasClass(className), 
        self[state ? "addClass" : "removeClass"](className); else ("undefined" === type || "boolean" === type) && (this.className && jQuery._data(this, "__className__", this.className), 
        this.className = this.className || value === !1 ? "" : jQuery._data(this, "__className__") || "");
      });
    },
    hasClass: function(selector) {
      for (var className = " " + selector + " ", i = 0, l = this.length; l > i; i++) if (1 === this[i].nodeType && (" " + this[i].className + " ").replace(rclass, " ").indexOf(className) >= 0) return !0;
      return !1;
    },
    val: function(value) {
      var hooks, ret, isFunction, elem = this[0];
      {
        if (arguments.length) return isFunction = jQuery.isFunction(value), this.each(function(i) {
          var val, self = jQuery(this);
          1 === this.nodeType && (val = isFunction ? value.call(this, i, self.val()) : value, 
          null == val ? val = "" : "number" == typeof val ? val += "" : jQuery.isArray(val) && (val = jQuery.map(val, function(value) {
            return null == value ? "" : value + "";
          })), hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()], 
          hooks && "set" in hooks && hooks.set(this, val, "value") !== undefined || (this.value = val));
        });
        if (elem) return hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()], 
        hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined ? ret : (ret = elem.value, 
        "string" == typeof ret ? ret.replace(rreturn, "") : null == ret ? "" : ret);
      }
    }
  }), jQuery.extend({
    valHooks: {
      option: {
        get: function(elem) {
          var val = elem.attributes.value;
          return !val || val.specified ? elem.value : elem.text;
        }
      },
      select: {
        get: function(elem) {
          var value, i, max, option, index = elem.selectedIndex, values = [], options = elem.options, one = "select-one" === elem.type;
          if (0 > index) return null;
          for (i = one ? index : 0, max = one ? index + 1 : options.length; max > i; i++) if (option = options[i], 
          !(!option.selected || (jQuery.support.optDisabled ? option.disabled : null !== option.getAttribute("disabled")) || option.parentNode.disabled && jQuery.nodeName(option.parentNode, "optgroup"))) {
            if (value = jQuery(option).val(), one) return value;
            values.push(value);
          }
          return one && !values.length && options.length ? jQuery(options[index]).val() : values;
        },
        set: function(elem, value) {
          var values = jQuery.makeArray(value);
          return jQuery(elem).find("option").each(function() {
            this.selected = jQuery.inArray(jQuery(this).val(), values) >= 0;
          }), values.length || (elem.selectedIndex = -1), values;
        }
      }
    },
    attrFn: {},
    attr: function(elem, name, value, pass) {
      var ret, hooks, notxml, nType = elem.nodeType;
      if (elem && 3 !== nType && 8 !== nType && 2 !== nType) return pass && jQuery.isFunction(jQuery.fn[name]) ? jQuery(elem)[name](value) : elem.getAttribute === undefined ? jQuery.prop(elem, name, value) : (notxml = 1 !== nType || !jQuery.isXMLDoc(elem), 
      notxml && (name = name.toLowerCase(), hooks = jQuery.attrHooks[name] || (rboolean.test(name) ? boolHook : nodeHook)), 
      value !== undefined ? null === value ? (jQuery.removeAttr(elem, name), undefined) : hooks && "set" in hooks && notxml && (ret = hooks.set(elem, value, name)) !== undefined ? ret : (elem.setAttribute(name, value + ""), 
      value) : hooks && "get" in hooks && notxml && null !== (ret = hooks.get(elem, name)) ? ret : (ret = elem.getAttribute(name), 
      null === ret ? undefined : ret));
    },
    removeAttr: function(elem, value) {
      var propName, attrNames, name, isBool, i = 0;
      if (value && 1 === elem.nodeType) for (attrNames = value.split(core_rspace); attrNames.length > i; i++) name = attrNames[i], 
      name && (propName = jQuery.propFix[name] || name, isBool = rboolean.test(name), 
      isBool || jQuery.attr(elem, name, ""), elem.removeAttribute(getSetAttribute ? name : propName), 
      isBool && propName in elem && (elem[propName] = !1));
    },
    attrHooks: {
      type: {
        set: function(elem, value) {
          if (rtype.test(elem.nodeName) && elem.parentNode) jQuery.error("type property can't be changed"); else if (!jQuery.support.radioValue && "radio" === value && jQuery.nodeName(elem, "input")) {
            var val = elem.value;
            return elem.setAttribute("type", value), val && (elem.value = val), value;
          }
        }
      },
      value: {
        get: function(elem, name) {
          return nodeHook && jQuery.nodeName(elem, "button") ? nodeHook.get(elem, name) : name in elem ? elem.value : null;
        },
        set: function(elem, value, name) {
          return nodeHook && jQuery.nodeName(elem, "button") ? nodeHook.set(elem, value, name) : (elem.value = value, 
          undefined);
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
    prop: function(elem, name, value) {
      var ret, hooks, notxml, nType = elem.nodeType;
      if (elem && 3 !== nType && 8 !== nType && 2 !== nType) return notxml = 1 !== nType || !jQuery.isXMLDoc(elem), 
      notxml && (name = jQuery.propFix[name] || name, hooks = jQuery.propHooks[name]), 
      value !== undefined ? hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined ? ret : elem[name] = value : hooks && "get" in hooks && null !== (ret = hooks.get(elem, name)) ? ret : elem[name];
    },
    propHooks: {
      tabIndex: {
        get: function(elem) {
          var attributeNode = elem.getAttributeNode("tabindex");
          return attributeNode && attributeNode.specified ? parseInt(attributeNode.value, 10) : rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ? 0 : undefined;
        }
      }
    }
  }), boolHook = {
    get: function(elem, name) {
      var attrNode, property = jQuery.prop(elem, name);
      return property === !0 || "boolean" != typeof property && (attrNode = elem.getAttributeNode(name)) && attrNode.nodeValue !== !1 ? name.toLowerCase() : undefined;
    },
    set: function(elem, value, name) {
      var propName;
      return value === !1 ? jQuery.removeAttr(elem, name) : (propName = jQuery.propFix[name] || name, 
      propName in elem && (elem[propName] = !0), elem.setAttribute(name, name.toLowerCase())), 
      name;
    }
  }, getSetAttribute || (fixSpecified = {
    name: !0,
    id: !0,
    coords: !0
  }, nodeHook = jQuery.valHooks.button = {
    get: function(elem, name) {
      var ret;
      return ret = elem.getAttributeNode(name), ret && (fixSpecified[name] ? "" !== ret.value : ret.specified) ? ret.value : undefined;
    },
    set: function(elem, value, name) {
      var ret = elem.getAttributeNode(name);
      return ret || (ret = document.createAttribute(name), elem.setAttributeNode(ret)), 
      ret.value = value + "";
    }
  }, jQuery.each([ "width", "height" ], function(i, name) {
    jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {
      set: function(elem, value) {
        return "" === value ? (elem.setAttribute(name, "auto"), value) : undefined;
      }
    });
  }), jQuery.attrHooks.contenteditable = {
    get: nodeHook.get,
    set: function(elem, value, name) {
      "" === value && (value = "false"), nodeHook.set(elem, value, name);
    }
  }), jQuery.support.hrefNormalized || jQuery.each([ "href", "src", "width", "height" ], function(i, name) {
    jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {
      get: function(elem) {
        var ret = elem.getAttribute(name, 2);
        return null === ret ? undefined : ret;
      }
    });
  }), jQuery.support.style || (jQuery.attrHooks.style = {
    get: function(elem) {
      return elem.style.cssText.toLowerCase() || undefined;
    },
    set: function(elem, value) {
      return elem.style.cssText = value + "";
    }
  }), jQuery.support.optSelected || (jQuery.propHooks.selected = jQuery.extend(jQuery.propHooks.selected, {
    get: function(elem) {
      var parent = elem.parentNode;
      return parent && (parent.selectedIndex, parent.parentNode && parent.parentNode.selectedIndex), 
      null;
    }
  })), jQuery.support.enctype || (jQuery.propFix.enctype = "encoding"), jQuery.support.checkOn || jQuery.each([ "radio", "checkbox" ], function() {
    jQuery.valHooks[this] = {
      get: function(elem) {
        return null === elem.getAttribute("value") ? "on" : elem.value;
      }
    };
  }), jQuery.each([ "radio", "checkbox" ], function() {
    jQuery.valHooks[this] = jQuery.extend(jQuery.valHooks[this], {
      set: function(elem, value) {
        return jQuery.isArray(value) ? elem.checked = jQuery.inArray(jQuery(elem).val(), value) >= 0 : undefined;
      }
    });
  });
  var rformElems = /^(?:textarea|input|select)$/i, rtypenamespace = /^([^\.]*|)(?:\.(.+)|)$/, rhoverHack = /(?:^|\s)hover(\.\S+|)\b/, rkeyEvent = /^key/, rmouseEvent = /^(?:mouse|contextmenu)|click/, rfocusMorph = /^(?:focusinfocus|focusoutblur)$/, hoverHack = function(events) {
    return jQuery.event.special.hover ? events : events.replace(rhoverHack, "mouseenter$1 mouseleave$1");
  };
  jQuery.event = {
    add: function(elem, types, handler, data, selector) {
      var elemData, eventHandle, events, t, tns, type, namespaces, handleObj, handleObjIn, handlers, special;
      if (3 !== elem.nodeType && 8 !== elem.nodeType && types && handler && (elemData = jQuery._data(elem))) {
        for (handler.handler && (handleObjIn = handler, handler = handleObjIn.handler, selector = handleObjIn.selector), 
        handler.guid || (handler.guid = jQuery.guid++), events = elemData.events, events || (elemData.events = events = {}), 
        eventHandle = elemData.handle, eventHandle || (elemData.handle = eventHandle = function(e) {
          return jQuery === undefined || e && jQuery.event.triggered === e.type ? undefined : jQuery.event.dispatch.apply(eventHandle.elem, arguments);
        }, eventHandle.elem = elem), types = jQuery.trim(hoverHack(types)).split(" "), t = 0; types.length > t; t++) tns = rtypenamespace.exec(types[t]) || [], 
        type = tns[1], namespaces = (tns[2] || "").split(".").sort(), special = jQuery.event.special[type] || {}, 
        type = (selector ? special.delegateType : special.bindType) || type, special = jQuery.event.special[type] || {}, 
        handleObj = jQuery.extend({
          type: type,
          origType: tns[1],
          data: data,
          handler: handler,
          guid: handler.guid,
          selector: selector,
          needsContext: selector && jQuery.expr.match.needsContext.test(selector),
          namespace: namespaces.join(".")
        }, handleObjIn), handlers = events[type], handlers || (handlers = events[type] = [], 
        handlers.delegateCount = 0, special.setup && special.setup.call(elem, data, namespaces, eventHandle) !== !1 || (elem.addEventListener ? elem.addEventListener(type, eventHandle, !1) : elem.attachEvent && elem.attachEvent("on" + type, eventHandle))), 
        special.add && (special.add.call(elem, handleObj), handleObj.handler.guid || (handleObj.handler.guid = handler.guid)), 
        selector ? handlers.splice(handlers.delegateCount++, 0, handleObj) : handlers.push(handleObj), 
        jQuery.event.global[type] = !0;
        elem = null;
      }
    },
    global: {},
    remove: function(elem, types, handler, selector, mappedTypes) {
      var t, tns, type, origType, namespaces, origCount, j, events, special, eventType, handleObj, elemData = jQuery.hasData(elem) && jQuery._data(elem);
      if (elemData && (events = elemData.events)) {
        for (types = jQuery.trim(hoverHack(types || "")).split(" "), t = 0; types.length > t; t++) if (tns = rtypenamespace.exec(types[t]) || [], 
        type = origType = tns[1], namespaces = tns[2], type) {
          for (special = jQuery.event.special[type] || {}, type = (selector ? special.delegateType : special.bindType) || type, 
          eventType = events[type] || [], origCount = eventType.length, namespaces = namespaces ? RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null, 
          j = 0; eventType.length > j; j++) handleObj = eventType[j], !mappedTypes && origType !== handleObj.origType || handler && handler.guid !== handleObj.guid || namespaces && !namespaces.test(handleObj.namespace) || selector && selector !== handleObj.selector && ("**" !== selector || !handleObj.selector) || (eventType.splice(j--, 1), 
          handleObj.selector && eventType.delegateCount--, special.remove && special.remove.call(elem, handleObj));
          0 === eventType.length && origCount !== eventType.length && (special.teardown && special.teardown.call(elem, namespaces, elemData.handle) !== !1 || jQuery.removeEvent(elem, type, elemData.handle), 
          delete events[type]);
        } else for (type in events) jQuery.event.remove(elem, type + types[t], handler, selector, !0);
        jQuery.isEmptyObject(events) && (delete elemData.handle, jQuery.removeData(elem, "events", !0));
      }
    },
    customEvent: {
      getData: !0,
      setData: !0,
      changeData: !0
    },
    trigger: function(event, data, elem, onlyHandlers) {
      if (!elem || 3 !== elem.nodeType && 8 !== elem.nodeType) {
        var cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType, type = event.type || event, namespaces = [];
        if (!rfocusMorph.test(type + jQuery.event.triggered) && (type.indexOf("!") >= 0 && (type = type.slice(0, -1), 
        exclusive = !0), type.indexOf(".") >= 0 && (namespaces = type.split("."), type = namespaces.shift(), 
        namespaces.sort()), elem && !jQuery.event.customEvent[type] || jQuery.event.global[type])) if (event = "object" == typeof event ? event[jQuery.expando] ? event : new jQuery.Event(type, event) : new jQuery.Event(type), 
        event.type = type, event.isTrigger = !0, event.exclusive = exclusive, event.namespace = namespaces.join("."), 
        event.namespace_re = event.namespace ? RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, 
        ontype = 0 > type.indexOf(":") ? "on" + type : "", elem) {
          if (event.result = undefined, event.target || (event.target = elem), data = null != data ? jQuery.makeArray(data) : [], 
          data.unshift(event), special = jQuery.event.special[type] || {}, !special.trigger || special.trigger.apply(elem, data) !== !1) {
            if (eventPath = [ [ elem, special.bindType || type ] ], !onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {
              for (bubbleType = special.delegateType || type, cur = rfocusMorph.test(bubbleType + type) ? elem : elem.parentNode, 
              old = elem; cur; cur = cur.parentNode) eventPath.push([ cur, bubbleType ]), old = cur;
              old === (elem.ownerDocument || document) && eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
            }
            for (i = 0; eventPath.length > i && !event.isPropagationStopped(); i++) cur = eventPath[i][0], 
            event.type = eventPath[i][1], handle = (jQuery._data(cur, "events") || {})[event.type] && jQuery._data(cur, "handle"), 
            handle && handle.apply(cur, data), handle = ontype && cur[ontype], handle && jQuery.acceptData(cur) && handle.apply && handle.apply(cur, data) === !1 && event.preventDefault();
            return event.type = type, onlyHandlers || event.isDefaultPrevented() || special._default && special._default.apply(elem.ownerDocument, data) !== !1 || "click" === type && jQuery.nodeName(elem, "a") || !jQuery.acceptData(elem) || ontype && elem[type] && ("focus" !== type && "blur" !== type || 0 !== event.target.offsetWidth) && !jQuery.isWindow(elem) && (old = elem[ontype], 
            old && (elem[ontype] = null), jQuery.event.triggered = type, elem[type](), jQuery.event.triggered = undefined, 
            old && (elem[ontype] = old)), event.result;
          }
        } else {
          cache = jQuery.cache;
          for (i in cache) cache[i].events && cache[i].events[type] && jQuery.event.trigger(event, data, cache[i].handle.elem, !0);
        }
      }
    },
    dispatch: function(event) {
      event = jQuery.event.fix(event || window.event);
      var i, j, cur, ret, selMatch, matched, matches, handleObj, sel, handlers = (jQuery._data(this, "events") || {})[event.type] || [], delegateCount = handlers.delegateCount, args = core_slice.call(arguments), run_all = !event.exclusive && !event.namespace, special = jQuery.event.special[event.type] || {}, handlerQueue = [];
      if (args[0] = event, event.delegateTarget = this, !special.preDispatch || special.preDispatch.call(this, event) !== !1) {
        if (delegateCount && (!event.button || "click" !== event.type)) for (cur = event.target; cur != this; cur = cur.parentNode || this) if (cur.disabled !== !0 || "click" !== event.type) {
          for (selMatch = {}, matches = [], i = 0; delegateCount > i; i++) handleObj = handlers[i], 
          sel = handleObj.selector, selMatch[sel] === undefined && (selMatch[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) >= 0 : jQuery.find(sel, this, null, [ cur ]).length), 
          selMatch[sel] && matches.push(handleObj);
          matches.length && handlerQueue.push({
            elem: cur,
            matches: matches
          });
        }
        for (handlers.length > delegateCount && handlerQueue.push({
          elem: this,
          matches: handlers.slice(delegateCount)
        }), i = 0; handlerQueue.length > i && !event.isPropagationStopped(); i++) for (matched = handlerQueue[i], 
        event.currentTarget = matched.elem, j = 0; matched.matches.length > j && !event.isImmediatePropagationStopped(); j++) handleObj = matched.matches[j], 
        (run_all || !event.namespace && !handleObj.namespace || event.namespace_re && event.namespace_re.test(handleObj.namespace)) && (event.data = handleObj.data, 
        event.handleObj = handleObj, ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args), 
        ret !== undefined && (event.result = ret, ret === !1 && (event.preventDefault(), 
        event.stopPropagation())));
        return special.postDispatch && special.postDispatch.call(this, event), event.result;
      }
    },
    props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
    fixHooks: {},
    keyHooks: {
      props: "char charCode key keyCode".split(" "),
      filter: function(event, original) {
        return null == event.which && (event.which = null != original.charCode ? original.charCode : original.keyCode), 
        event;
      }
    },
    mouseHooks: {
      props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
      filter: function(event, original) {
        var eventDoc, doc, body, button = original.button, fromElement = original.fromElement;
        return null == event.pageX && null != original.clientX && (eventDoc = event.target.ownerDocument || document, 
        doc = eventDoc.documentElement, body = eventDoc.body, event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0), 
        event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0)), 
        !event.relatedTarget && fromElement && (event.relatedTarget = fromElement === event.target ? original.toElement : fromElement), 
        event.which || button === undefined || (event.which = 1 & button ? 1 : 2 & button ? 3 : 4 & button ? 2 : 0), 
        event;
      }
    },
    fix: function(event) {
      if (event[jQuery.expando]) return event;
      var i, prop, originalEvent = event, fixHook = jQuery.event.fixHooks[event.type] || {}, copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;
      for (event = jQuery.Event(originalEvent), i = copy.length; i; ) prop = copy[--i], 
      event[prop] = originalEvent[prop];
      return event.target || (event.target = originalEvent.srcElement || document), 3 === event.target.nodeType && (event.target = event.target.parentNode), 
      event.metaKey = !!event.metaKey, fixHook.filter ? fixHook.filter(event, originalEvent) : event;
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
        setup: function(data, namespaces, eventHandle) {
          jQuery.isWindow(this) && (this.onbeforeunload = eventHandle);
        },
        teardown: function(namespaces, eventHandle) {
          this.onbeforeunload === eventHandle && (this.onbeforeunload = null);
        }
      }
    },
    simulate: function(type, elem, event, bubble) {
      var e = jQuery.extend(new jQuery.Event(), event, {
        type: type,
        isSimulated: !0,
        originalEvent: {}
      });
      bubble ? jQuery.event.trigger(e, null, elem) : jQuery.event.dispatch.call(elem, e), 
      e.isDefaultPrevented() && event.preventDefault();
    }
  }, jQuery.event.handle = jQuery.event.dispatch, jQuery.removeEvent = document.removeEventListener ? function(elem, type, handle) {
    elem.removeEventListener && elem.removeEventListener(type, handle, !1);
  } : function(elem, type, handle) {
    var name = "on" + type;
    elem.detachEvent && (elem[name] === undefined && (elem[name] = null), elem.detachEvent(name, handle));
  }, jQuery.Event = function(src, props) {
    return this instanceof jQuery.Event ? (src && src.type ? (this.originalEvent = src, 
    this.type = src.type, this.isDefaultPrevented = src.defaultPrevented || src.returnValue === !1 || src.getPreventDefault && src.getPreventDefault() ? returnTrue : returnFalse) : this.type = src, 
    props && jQuery.extend(this, props), this.timeStamp = src && src.timeStamp || jQuery.now(), 
    this[jQuery.expando] = !0, undefined) : new jQuery.Event(src, props);
  }, jQuery.Event.prototype = {
    preventDefault: function() {
      this.isDefaultPrevented = returnTrue;
      var e = this.originalEvent;
      e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1);
    },
    stopPropagation: function() {
      this.isPropagationStopped = returnTrue;
      var e = this.originalEvent;
      e && (e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0);
    },
    stopImmediatePropagation: function() {
      this.isImmediatePropagationStopped = returnTrue, this.stopPropagation();
    },
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse,
    isImmediatePropagationStopped: returnFalse
  }, jQuery.each({
    mouseenter: "mouseover",
    mouseleave: "mouseout"
  }, function(orig, fix) {
    jQuery.event.special[orig] = {
      delegateType: fix,
      bindType: fix,
      handle: function(event) {
        var ret, target = this, related = event.relatedTarget, handleObj = event.handleObj;
        return handleObj.selector, (!related || related !== target && !jQuery.contains(target, related)) && (event.type = handleObj.origType, 
        ret = handleObj.handler.apply(this, arguments), event.type = fix), ret;
      }
    };
  }), jQuery.support.submitBubbles || (jQuery.event.special.submit = {
    setup: function() {
      return jQuery.nodeName(this, "form") ? !1 : (jQuery.event.add(this, "click._submit keypress._submit", function(e) {
        var elem = e.target, form = jQuery.nodeName(elem, "input") || jQuery.nodeName(elem, "button") ? elem.form : undefined;
        form && !jQuery._data(form, "_submit_attached") && (jQuery.event.add(form, "submit._submit", function(event) {
          event._submit_bubble = !0;
        }), jQuery._data(form, "_submit_attached", !0));
      }), undefined);
    },
    postDispatch: function(event) {
      event._submit_bubble && (delete event._submit_bubble, this.parentNode && !event.isTrigger && jQuery.event.simulate("submit", this.parentNode, event, !0));
    },
    teardown: function() {
      return jQuery.nodeName(this, "form") ? !1 : (jQuery.event.remove(this, "._submit"), 
      undefined);
    }
  }), jQuery.support.changeBubbles || (jQuery.event.special.change = {
    setup: function() {
      return rformElems.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (jQuery.event.add(this, "propertychange._change", function(event) {
        "checked" === event.originalEvent.propertyName && (this._just_changed = !0);
      }), jQuery.event.add(this, "click._change", function(event) {
        this._just_changed && !event.isTrigger && (this._just_changed = !1), jQuery.event.simulate("change", this, event, !0);
      })), !1) : (jQuery.event.add(this, "beforeactivate._change", function(e) {
        var elem = e.target;
        rformElems.test(elem.nodeName) && !jQuery._data(elem, "_change_attached") && (jQuery.event.add(elem, "change._change", function(event) {
          !this.parentNode || event.isSimulated || event.isTrigger || jQuery.event.simulate("change", this.parentNode, event, !0);
        }), jQuery._data(elem, "_change_attached", !0));
      }), undefined);
    },
    handle: function(event) {
      var elem = event.target;
      return this !== elem || event.isSimulated || event.isTrigger || "radio" !== elem.type && "checkbox" !== elem.type ? event.handleObj.handler.apply(this, arguments) : undefined;
    },
    teardown: function() {
      return jQuery.event.remove(this, "._change"), !rformElems.test(this.nodeName);
    }
  }), jQuery.support.focusinBubbles || jQuery.each({
    focus: "focusin",
    blur: "focusout"
  }, function(orig, fix) {
    var attaches = 0, handler = function(event) {
      jQuery.event.simulate(fix, event.target, jQuery.event.fix(event), !0);
    };
    jQuery.event.special[fix] = {
      setup: function() {
        0 === attaches++ && document.addEventListener(orig, handler, !0);
      },
      teardown: function() {
        0 === --attaches && document.removeEventListener(orig, handler, !0);
      }
    };
  }), jQuery.fn.extend({
    on: function(types, selector, data, fn, one) {
      var origFn, type;
      if ("object" == typeof types) {
        "string" != typeof selector && (data = data || selector, selector = undefined);
        for (type in types) this.on(type, selector, data, types[type], one);
        return this;
      }
      if (null == data && null == fn ? (fn = selector, data = selector = undefined) : null == fn && ("string" == typeof selector ? (fn = data, 
      data = undefined) : (fn = data, data = selector, selector = undefined)), fn === !1) fn = returnFalse; else if (!fn) return this;
      return 1 === one && (origFn = fn, fn = function(event) {
        return jQuery().off(event), origFn.apply(this, arguments);
      }, fn.guid = origFn.guid || (origFn.guid = jQuery.guid++)), this.each(function() {
        jQuery.event.add(this, types, fn, data, selector);
      });
    },
    one: function(types, selector, data, fn) {
      return this.on(types, selector, data, fn, 1);
    },
    off: function(types, selector, fn) {
      var handleObj, type;
      if (types && types.preventDefault && types.handleObj) return handleObj = types.handleObj, 
      jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler), 
      this;
      if ("object" == typeof types) {
        for (type in types) this.off(type, selector, types[type]);
        return this;
      }
      return (selector === !1 || "function" == typeof selector) && (fn = selector, selector = undefined), 
      fn === !1 && (fn = returnFalse), this.each(function() {
        jQuery.event.remove(this, types, fn, selector);
      });
    },
    bind: function(types, data, fn) {
      return this.on(types, null, data, fn);
    },
    unbind: function(types, fn) {
      return this.off(types, null, fn);
    },
    live: function(types, data, fn) {
      return jQuery(this.context).on(types, this.selector, data, fn), this;
    },
    die: function(types, fn) {
      return jQuery(this.context).off(types, this.selector || "**", fn), this;
    },
    delegate: function(selector, types, data, fn) {
      return this.on(types, selector, data, fn);
    },
    undelegate: function(selector, types, fn) {
      return 1 === arguments.length ? this.off(selector, "**") : this.off(types, selector || "**", fn);
    },
    trigger: function(type, data) {
      return this.each(function() {
        jQuery.event.trigger(type, data, this);
      });
    },
    triggerHandler: function(type, data) {
      return this[0] ? jQuery.event.trigger(type, data, this[0], !0) : undefined;
    },
    toggle: function(fn) {
      var args = arguments, guid = fn.guid || jQuery.guid++, i = 0, toggler = function(event) {
        var lastToggle = (jQuery._data(this, "lastToggle" + fn.guid) || 0) % i;
        return jQuery._data(this, "lastToggle" + fn.guid, lastToggle + 1), event.preventDefault(), 
        args[lastToggle].apply(this, arguments) || !1;
      };
      for (toggler.guid = guid; args.length > i; ) args[i++].guid = guid;
      return this.click(toggler);
    },
    hover: function(fnOver, fnOut) {
      return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
    }
  }), jQuery.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(i, name) {
    jQuery.fn[name] = function(data, fn) {
      return null == fn && (fn = data, data = null), arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
    }, rkeyEvent.test(name) && (jQuery.event.fixHooks[name] = jQuery.event.keyHooks), 
    rmouseEvent.test(name) && (jQuery.event.fixHooks[name] = jQuery.event.mouseHooks);
  }), function(window, undefined) {
    function Sizzle(selector, context, results, seed) {
      results = results || [], context = context || document;
      var match, elem, xml, m, nodeType = context.nodeType;
      if (!selector || "string" != typeof selector) return results;
      if (1 !== nodeType && 9 !== nodeType) return [];
      if (xml = isXML(context), !xml && !seed && (match = rquickExpr.exec(selector))) if (m = match[1]) {
        if (9 === nodeType) {
          if (elem = context.getElementById(m), !elem || !elem.parentNode) return results;
          if (elem.id === m) return results.push(elem), results;
        } else if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) && contains(context, elem) && elem.id === m) return results.push(elem), 
        results;
      } else {
        if (match[2]) return push.apply(results, slice.call(context.getElementsByTagName(selector), 0)), 
        results;
        if ((m = match[3]) && assertUsableClassName && context.getElementsByClassName) return push.apply(results, slice.call(context.getElementsByClassName(m), 0)), 
        results;
      }
      return select(selector.replace(rtrim, "$1"), context, results, seed, xml);
    }
    function createInputPseudo(type) {
      return function(elem) {
        var name = elem.nodeName.toLowerCase();
        return "input" === name && elem.type === type;
      };
    }
    function createButtonPseudo(type) {
      return function(elem) {
        var name = elem.nodeName.toLowerCase();
        return ("input" === name || "button" === name) && elem.type === type;
      };
    }
    function createPositionalPseudo(fn) {
      return markFunction(function(argument) {
        return argument = +argument, markFunction(function(seed, matches) {
          for (var j, matchIndexes = fn([], seed.length, argument), i = matchIndexes.length; i--; ) seed[j = matchIndexes[i]] && (seed[j] = !(matches[j] = seed[j]));
        });
      });
    }
    function siblingCheck(a, b, ret) {
      if (a === b) return ret;
      for (var cur = a.nextSibling; cur; ) {
        if (cur === b) return -1;
        cur = cur.nextSibling;
      }
      return 1;
    }
    function tokenize(selector, parseOnly) {
      var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[expando][selector];
      if (cached) return parseOnly ? 0 : cached.slice(0);
      for (soFar = selector, groups = [], preFilters = Expr.preFilter; soFar; ) {
        (!matched || (match = rcomma.exec(soFar))) && (match && (soFar = soFar.slice(match[0].length)), 
        groups.push(tokens = [])), matched = !1, (match = rcombinators.exec(soFar)) && (tokens.push(matched = new Token(match.shift())), 
        soFar = soFar.slice(matched.length), matched.type = match[0].replace(rtrim, " "));
        for (type in Expr.filter) !(match = matchExpr[type].exec(soFar)) || preFilters[type] && !(match = preFilters[type](match, document, !0)) || (tokens.push(matched = new Token(match.shift())), 
        soFar = soFar.slice(matched.length), matched.type = type, matched.matches = match);
        if (!matched) break;
      }
      return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) : tokenCache(selector, groups).slice(0);
    }
    function addCombinator(matcher, combinator, base) {
      var dir = combinator.dir, checkNonElements = base && "parentNode" === combinator.dir, doneName = done++;
      return combinator.first ? function(elem, context, xml) {
        for (;elem = elem[dir]; ) if (checkNonElements || 1 === elem.nodeType) return matcher(elem, context, xml);
      } : function(elem, context, xml) {
        if (xml) {
          for (;elem = elem[dir]; ) if ((checkNonElements || 1 === elem.nodeType) && matcher(elem, context, xml)) return elem;
        } else for (var cache, dirkey = dirruns + " " + doneName + " ", cachedkey = dirkey + cachedruns; elem = elem[dir]; ) if (checkNonElements || 1 === elem.nodeType) {
          if ((cache = elem[expando]) === cachedkey) return elem.sizset;
          if ("string" == typeof cache && 0 === cache.indexOf(dirkey)) {
            if (elem.sizset) return elem;
          } else {
            if (elem[expando] = cachedkey, matcher(elem, context, xml)) return elem.sizset = !0, 
            elem;
            elem.sizset = !1;
          }
        }
      };
    }
    function elementMatcher(matchers) {
      return matchers.length > 1 ? function(elem, context, xml) {
        for (var i = matchers.length; i--; ) if (!matchers[i](elem, context, xml)) return !1;
        return !0;
      } : matchers[0];
    }
    function condense(unmatched, map, filter, context, xml) {
      for (var elem, newUnmatched = [], i = 0, len = unmatched.length, mapped = null != map; len > i; i++) (elem = unmatched[i]) && (!filter || filter(elem, context, xml)) && (newUnmatched.push(elem), 
      mapped && map.push(i));
      return newUnmatched;
    }
    function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
      return postFilter && !postFilter[expando] && (postFilter = setMatcher(postFilter)), 
      postFinder && !postFinder[expando] && (postFinder = setMatcher(postFinder, postSelector)), 
      markFunction(function(seed, results, context, xml) {
        if (!seed || !postFinder) {
          var i, elem, postFilterIn, preMap = [], postMap = [], preexisting = results.length, elems = seed || multipleContexts(selector || "*", context.nodeType ? [ context ] : context, [], seed), matcherIn = !preFilter || !seed && selector ? elems : condense(elems, preMap, preFilter, context, xml), matcherOut = matcher ? postFinder || (seed ? preFilter : preexisting || postFilter) ? [] : results : matcherIn;
          if (matcher && matcher(matcherIn, matcherOut, context, xml), postFilter) for (postFilterIn = condense(matcherOut, postMap), 
          postFilter(postFilterIn, [], context, xml), i = postFilterIn.length; i--; ) (elem = postFilterIn[i]) && (matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem));
          if (seed) for (i = preFilter && matcherOut.length; i--; ) (elem = matcherOut[i]) && (seed[preMap[i]] = !(results[preMap[i]] = elem)); else matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut), 
          postFinder ? postFinder(null, results, matcherOut, xml) : push.apply(results, matcherOut);
        }
      });
    }
    function matcherFromTokens(tokens) {
      for (var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[" "], i = leadingRelative ? 1 : 0, matchContext = addCombinator(function(elem) {
        return elem === checkContext;
      }, implicitRelative, !0), matchAnyContext = addCombinator(function(elem) {
        return indexOf.call(checkContext, elem) > -1;
      }, implicitRelative, !0), matchers = [ function(elem, context, xml) {
        return !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
      } ]; len > i; i++) if (matcher = Expr.relative[tokens[i].type]) matchers = [ addCombinator(elementMatcher(matchers), matcher) ]; else {
        if (matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches), matcher[expando]) {
          for (j = ++i; len > j && !Expr.relative[tokens[j].type]; j++) ;
          return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && tokens.slice(0, i - 1).join("").replace(rtrim, "$1"), matcher, j > i && matcherFromTokens(tokens.slice(i, j)), len > j && matcherFromTokens(tokens = tokens.slice(j)), len > j && tokens.join(""));
        }
        matchers.push(matcher);
      }
      return elementMatcher(matchers);
    }
    function matcherFromGroupMatchers(elementMatchers, setMatchers) {
      var bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function(seed, context, xml, results, expandContext) {
        var elem, j, matcher, setMatched = [], matchedCount = 0, i = "0", unmatched = seed && [], outermost = null != expandContext, contextBackup = outermostContext, elems = seed || byElement && Expr.find.TAG("*", expandContext && context.parentNode || context), dirrunsUnique = dirruns += null == contextBackup ? 1 : Math.E;
        for (outermost && (outermostContext = context !== document && context, cachedruns = superMatcher.el); null != (elem = elems[i]); i++) {
          if (byElement && elem) {
            for (j = 0; matcher = elementMatchers[j]; j++) if (matcher(elem, context, xml)) {
              results.push(elem);
              break;
            }
            outermost && (dirruns = dirrunsUnique, cachedruns = ++superMatcher.el);
          }
          bySet && ((elem = !matcher && elem) && matchedCount--, seed && unmatched.push(elem));
        }
        if (matchedCount += i, bySet && i !== matchedCount) {
          for (j = 0; matcher = setMatchers[j]; j++) matcher(unmatched, setMatched, context, xml);
          if (seed) {
            if (matchedCount > 0) for (;i--; ) unmatched[i] || setMatched[i] || (setMatched[i] = pop.call(results));
            setMatched = condense(setMatched);
          }
          push.apply(results, setMatched), outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1 && Sizzle.uniqueSort(results);
        }
        return outermost && (dirruns = dirrunsUnique, outermostContext = contextBackup), 
        unmatched;
      };
      return superMatcher.el = 0, bySet ? markFunction(superMatcher) : superMatcher;
    }
    function multipleContexts(selector, contexts, results, seed) {
      for (var i = 0, len = contexts.length; len > i; i++) Sizzle(selector, contexts[i], results, seed);
      return results;
    }
    function select(selector, context, results, seed, xml) {
      var i, tokens, token, type, find, match = tokenize(selector);
      if (match.length, !seed && 1 === match.length) {
        if (tokens = match[0] = match[0].slice(0), tokens.length > 2 && "ID" === (token = tokens[0]).type && 9 === context.nodeType && !xml && Expr.relative[tokens[1].type]) {
          if (context = Expr.find.ID(token.matches[0].replace(rbackslash, ""), context, xml)[0], 
          !context) return results;
          selector = selector.slice(tokens.shift().length);
        }
        for (i = matchExpr.POS.test(selector) ? -1 : tokens.length - 1; i >= 0 && (token = tokens[i], 
        !Expr.relative[type = token.type]); i--) if ((find = Expr.find[type]) && (seed = find(token.matches[0].replace(rbackslash, ""), rsibling.test(tokens[0].type) && context.parentNode || context, xml))) {
          if (tokens.splice(i, 1), selector = seed.length && tokens.join(""), !selector) return push.apply(results, slice.call(seed, 0)), 
          results;
          break;
        }
      }
      return compile(selector, match)(seed, context, xml, results, rsibling.test(selector)), 
      results;
    }
    function setFilters() {}
    var cachedruns, assertGetIdNotName, Expr, getText, isXML, contains, compile, sortOrder, hasDuplicate, outermostContext, baseHasDuplicate = !0, strundefined = "undefined", expando = ("sizcache" + Math.random()).replace(".", ""), Token = String, document = window.document, docElem = document.documentElement, dirruns = 0, done = 0, pop = [].pop, push = [].push, slice = [].slice, indexOf = [].indexOf || function(elem) {
      for (var i = 0, len = this.length; len > i; i++) if (this[i] === elem) return i;
      return -1;
    }, markFunction = function(fn, value) {
      return fn[expando] = null == value || value, fn;
    }, createCache = function() {
      var cache = {}, keys = [];
      return markFunction(function(key, value) {
        return keys.push(key) > Expr.cacheLength && delete cache[keys.shift()], cache[key] = value;
      }, cache);
    }, classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(), whitespace = "[\\x20\\t\\r\\n\\f]", characterEncoding = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+", identifier = characterEncoding.replace("w", "w#"), operators = "([*^$|!~]?=)", attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace + "*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]", pseudos = ":(" + characterEncoding + ")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:" + attributes + ")|[^:]|\\\\.)*|.*))\\)|)", pos = ":(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", rtrim = RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"), rcomma = RegExp("^" + whitespace + "*," + whitespace + "*"), rcombinators = RegExp("^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*"), rpseudo = RegExp(pseudos), rquickExpr = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/, rsibling = /[\x20\t\r\n\f]*[+~]/, rheader = /h\d/i, rinputs = /input|select|textarea|button/i, rbackslash = /\\(?!\\)/g, matchExpr = {
      ID: RegExp("^#(" + characterEncoding + ")"),
      CLASS: RegExp("^\\.(" + characterEncoding + ")"),
      NAME: RegExp("^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]"),
      TAG: RegExp("^(" + characterEncoding.replace("w", "w*") + ")"),
      ATTR: RegExp("^" + attributes),
      PSEUDO: RegExp("^" + pseudos),
      POS: RegExp(pos, "i"),
      CHILD: RegExp("^:(only|nth|first|last)-child(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
      needsContext: RegExp("^" + whitespace + "*[>+~]|" + pos, "i")
    }, assert = function(fn) {
      var div = document.createElement("div");
      try {
        return fn(div);
      } catch (e) {
        return !1;
      } finally {
        div = null;
      }
    }, assertTagNameNoComments = assert(function(div) {
      return div.appendChild(document.createComment("")), !div.getElementsByTagName("*").length;
    }), assertHrefNotNormalized = assert(function(div) {
      return div.innerHTML = "<a href='#'></a>", div.firstChild && typeof div.firstChild.getAttribute !== strundefined && "#" === div.firstChild.getAttribute("href");
    }), assertAttributes = assert(function(div) {
      div.innerHTML = "<select></select>";
      var type = typeof div.lastChild.getAttribute("multiple");
      return "boolean" !== type && "string" !== type;
    }), assertUsableClassName = assert(function(div) {
      return div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>", 
      div.getElementsByClassName && div.getElementsByClassName("e").length ? (div.lastChild.className = "e", 
      2 === div.getElementsByClassName("e").length) : !1;
    }), assertUsableName = assert(function(div) {
      div.id = expando + 0, div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>", 
      docElem.insertBefore(div, docElem.firstChild);
      var pass = document.getElementsByName && document.getElementsByName(expando).length === 2 + document.getElementsByName(expando + 0).length;
      return assertGetIdNotName = !document.getElementById(expando), docElem.removeChild(div), 
      pass;
    });
    try {
      slice.call(docElem.childNodes, 0)[0].nodeType;
    } catch (e) {
      slice = function(i) {
        for (var elem, results = []; elem = this[i]; i++) results.push(elem);
        return results;
      };
    }
    Sizzle.matches = function(expr, elements) {
      return Sizzle(expr, null, null, elements);
    }, Sizzle.matchesSelector = function(elem, expr) {
      return Sizzle(expr, null, null, [ elem ]).length > 0;
    }, getText = Sizzle.getText = function(elem) {
      var node, ret = "", i = 0, nodeType = elem.nodeType;
      if (nodeType) {
        if (1 === nodeType || 9 === nodeType || 11 === nodeType) {
          if ("string" == typeof elem.textContent) return elem.textContent;
          for (elem = elem.firstChild; elem; elem = elem.nextSibling) ret += getText(elem);
        } else if (3 === nodeType || 4 === nodeType) return elem.nodeValue;
      } else for (;node = elem[i]; i++) ret += getText(node);
      return ret;
    }, isXML = Sizzle.isXML = function(elem) {
      var documentElement = elem && (elem.ownerDocument || elem).documentElement;
      return documentElement ? "HTML" !== documentElement.nodeName : !1;
    }, contains = Sizzle.contains = docElem.contains ? function(a, b) {
      var adown = 9 === a.nodeType ? a.documentElement : a, bup = b && b.parentNode;
      return a === bup || !!(bup && 1 === bup.nodeType && adown.contains && adown.contains(bup));
    } : docElem.compareDocumentPosition ? function(a, b) {
      return b && !!(16 & a.compareDocumentPosition(b));
    } : function(a, b) {
      for (;b = b.parentNode; ) if (b === a) return !0;
      return !1;
    }, Sizzle.attr = function(elem, name) {
      var val, xml = isXML(elem);
      return xml || (name = name.toLowerCase()), (val = Expr.attrHandle[name]) ? val(elem) : xml || assertAttributes ? elem.getAttribute(name) : (val = elem.getAttributeNode(name), 
      val ? "boolean" == typeof elem[name] ? elem[name] ? name : null : val.specified ? val.value : null : null);
    }, Expr = Sizzle.selectors = {
      cacheLength: 50,
      createPseudo: markFunction,
      match: matchExpr,
      attrHandle: assertHrefNotNormalized ? {} : {
        href: function(elem) {
          return elem.getAttribute("href", 2);
        },
        type: function(elem) {
          return elem.getAttribute("type");
        }
      },
      find: {
        ID: assertGetIdNotName ? function(id, context, xml) {
          if (typeof context.getElementById !== strundefined && !xml) {
            var m = context.getElementById(id);
            return m && m.parentNode ? [ m ] : [];
          }
        } : function(id, context, xml) {
          if (typeof context.getElementById !== strundefined && !xml) {
            var m = context.getElementById(id);
            return m ? m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ? [ m ] : undefined : [];
          }
        },
        TAG: assertTagNameNoComments ? function(tag, context) {
          return typeof context.getElementsByTagName !== strundefined ? context.getElementsByTagName(tag) : undefined;
        } : function(tag, context) {
          var results = context.getElementsByTagName(tag);
          if ("*" === tag) {
            for (var elem, tmp = [], i = 0; elem = results[i]; i++) 1 === elem.nodeType && tmp.push(elem);
            return tmp;
          }
          return results;
        },
        NAME: assertUsableName && function(tag, context) {
          return typeof context.getElementsByName !== strundefined ? context.getElementsByName(name) : undefined;
        },
        CLASS: assertUsableClassName && function(className, context, xml) {
          return typeof context.getElementsByClassName === strundefined || xml ? undefined : context.getElementsByClassName(className);
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
        ATTR: function(match) {
          return match[1] = match[1].replace(rbackslash, ""), match[3] = (match[4] || match[5] || "").replace(rbackslash, ""), 
          "~=" === match[2] && (match[3] = " " + match[3] + " "), match.slice(0, 4);
        },
        CHILD: function(match) {
          return match[1] = match[1].toLowerCase(), "nth" === match[1] ? (match[2] || Sizzle.error(match[0]), 
          match[3] = +(match[3] ? match[4] + (match[5] || 1) : 2 * ("even" === match[2] || "odd" === match[2])), 
          match[4] = +(match[6] + match[7] || "odd" === match[2])) : match[2] && Sizzle.error(match[0]), 
          match;
        },
        PSEUDO: function(match) {
          var unquoted, excess;
          return matchExpr.CHILD.test(match[0]) ? null : (match[3] ? match[2] = match[3] : (unquoted = match[4]) && (rpseudo.test(unquoted) && (excess = tokenize(unquoted, !0)) && (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length) && (unquoted = unquoted.slice(0, excess), 
          match[0] = match[0].slice(0, excess)), match[2] = unquoted), match.slice(0, 3));
        }
      },
      filter: {
        ID: assertGetIdNotName ? function(id) {
          return id = id.replace(rbackslash, ""), function(elem) {
            return elem.getAttribute("id") === id;
          };
        } : function(id) {
          return id = id.replace(rbackslash, ""), function(elem) {
            var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
            return node && node.value === id;
          };
        },
        TAG: function(nodeName) {
          return "*" === nodeName ? function() {
            return !0;
          } : (nodeName = nodeName.replace(rbackslash, "").toLowerCase(), function(elem) {
            return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
          });
        },
        CLASS: function(className) {
          var pattern = classCache[expando][className];
          return pattern || (pattern = classCache(className, RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)"))), 
          function(elem) {
            return pattern.test(elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "");
          };
        },
        ATTR: function(name, operator, check) {
          return function(elem) {
            var result = Sizzle.attr(elem, name);
            return null == result ? "!=" === operator : operator ? (result += "", "=" === operator ? result === check : "!=" === operator ? result !== check : "^=" === operator ? check && 0 === result.indexOf(check) : "*=" === operator ? check && result.indexOf(check) > -1 : "$=" === operator ? check && result.substr(result.length - check.length) === check : "~=" === operator ? (" " + result + " ").indexOf(check) > -1 : "|=" === operator ? result === check || result.substr(0, check.length + 1) === check + "-" : !1) : !0;
          };
        },
        CHILD: function(type, argument, first, last) {
          return "nth" === type ? function(elem) {
            var node, diff, parent = elem.parentNode;
            if (1 === first && 0 === last) return !0;
            if (parent) for (diff = 0, node = parent.firstChild; node && (1 !== node.nodeType || (diff++, 
            elem !== node)); node = node.nextSibling) ;
            return diff -= last, diff === first || 0 === diff % first && diff / first >= 0;
          } : function(elem) {
            var node = elem;
            switch (type) {
             case "only":
             case "first":
              for (;node = node.previousSibling; ) if (1 === node.nodeType) return !1;
              if ("first" === type) return !0;
              node = elem;

             case "last":
              for (;node = node.nextSibling; ) if (1 === node.nodeType) return !1;
              return !0;
            }
          };
        },
        PSEUDO: function(pseudo, argument) {
          var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo);
          return fn[expando] ? fn(argument) : fn.length > 1 ? (args = [ pseudo, pseudo, "", argument ], 
          Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(seed, matches) {
            for (var idx, matched = fn(seed, argument), i = matched.length; i--; ) idx = indexOf.call(seed, matched[i]), 
            seed[idx] = !(matches[idx] = matched[i]);
          }) : function(elem) {
            return fn(elem, 0, args);
          }) : fn;
        }
      },
      pseudos: {
        not: markFunction(function(selector) {
          var input = [], results = [], matcher = compile(selector.replace(rtrim, "$1"));
          return matcher[expando] ? markFunction(function(seed, matches, context, xml) {
            for (var elem, unmatched = matcher(seed, null, xml, []), i = seed.length; i--; ) (elem = unmatched[i]) && (seed[i] = !(matches[i] = elem));
          }) : function(elem, context, xml) {
            return input[0] = elem, matcher(input, null, xml, results), !results.pop();
          };
        }),
        has: markFunction(function(selector) {
          return function(elem) {
            return Sizzle(selector, elem).length > 0;
          };
        }),
        contains: markFunction(function(text) {
          return function(elem) {
            return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
          };
        }),
        enabled: function(elem) {
          return elem.disabled === !1;
        },
        disabled: function(elem) {
          return elem.disabled === !0;
        },
        checked: function(elem) {
          var nodeName = elem.nodeName.toLowerCase();
          return "input" === nodeName && !!elem.checked || "option" === nodeName && !!elem.selected;
        },
        selected: function(elem) {
          return elem.parentNode && elem.parentNode.selectedIndex, elem.selected === !0;
        },
        parent: function(elem) {
          return !Expr.pseudos.empty(elem);
        },
        empty: function(elem) {
          var nodeType;
          for (elem = elem.firstChild; elem; ) {
            if (elem.nodeName > "@" || 3 === (nodeType = elem.nodeType) || 4 === nodeType) return !1;
            elem = elem.nextSibling;
          }
          return !0;
        },
        header: function(elem) {
          return rheader.test(elem.nodeName);
        },
        text: function(elem) {
          var type, attr;
          return "input" === elem.nodeName.toLowerCase() && "text" === (type = elem.type) && (null == (attr = elem.getAttribute("type")) || attr.toLowerCase() === type);
        },
        radio: createInputPseudo("radio"),
        checkbox: createInputPseudo("checkbox"),
        file: createInputPseudo("file"),
        password: createInputPseudo("password"),
        image: createInputPseudo("image"),
        submit: createButtonPseudo("submit"),
        reset: createButtonPseudo("reset"),
        button: function(elem) {
          var name = elem.nodeName.toLowerCase();
          return "input" === name && "button" === elem.type || "button" === name;
        },
        input: function(elem) {
          return rinputs.test(elem.nodeName);
        },
        focus: function(elem) {
          var doc = elem.ownerDocument;
          return !(elem !== doc.activeElement || doc.hasFocus && !doc.hasFocus() || !elem.type && !elem.href);
        },
        active: function(elem) {
          return elem === elem.ownerDocument.activeElement;
        },
        first: createPositionalPseudo(function() {
          return [ 0 ];
        }),
        last: createPositionalPseudo(function(matchIndexes, length) {
          return [ length - 1 ];
        }),
        eq: createPositionalPseudo(function(matchIndexes, length, argument) {
          return [ 0 > argument ? argument + length : argument ];
        }),
        even: createPositionalPseudo(function(matchIndexes, length) {
          for (var i = 0; length > i; i += 2) matchIndexes.push(i);
          return matchIndexes;
        }),
        odd: createPositionalPseudo(function(matchIndexes, length) {
          for (var i = 1; length > i; i += 2) matchIndexes.push(i);
          return matchIndexes;
        }),
        lt: createPositionalPseudo(function(matchIndexes, length, argument) {
          for (var i = 0 > argument ? argument + length : argument; --i >= 0; ) matchIndexes.push(i);
          return matchIndexes;
        }),
        gt: createPositionalPseudo(function(matchIndexes, length, argument) {
          for (var i = 0 > argument ? argument + length : argument; length > ++i; ) matchIndexes.push(i);
          return matchIndexes;
        })
      }
    }, sortOrder = docElem.compareDocumentPosition ? function(a, b) {
      return a === b ? (hasDuplicate = !0, 0) : (a.compareDocumentPosition && b.compareDocumentPosition ? 4 & a.compareDocumentPosition(b) : a.compareDocumentPosition) ? -1 : 1;
    } : function(a, b) {
      if (a === b) return hasDuplicate = !0, 0;
      if (a.sourceIndex && b.sourceIndex) return a.sourceIndex - b.sourceIndex;
      var al, bl, ap = [], bp = [], aup = a.parentNode, bup = b.parentNode, cur = aup;
      if (aup === bup) return siblingCheck(a, b);
      if (!aup) return -1;
      if (!bup) return 1;
      for (;cur; ) ap.unshift(cur), cur = cur.parentNode;
      for (cur = bup; cur; ) bp.unshift(cur), cur = cur.parentNode;
      al = ap.length, bl = bp.length;
      for (var i = 0; al > i && bl > i; i++) if (ap[i] !== bp[i]) return siblingCheck(ap[i], bp[i]);
      return i === al ? siblingCheck(a, bp[i], -1) : siblingCheck(ap[i], b, 1);
    }, [ 0, 0 ].sort(sortOrder), baseHasDuplicate = !hasDuplicate, Sizzle.uniqueSort = function(results) {
      var elem, i = 1;
      if (hasDuplicate = baseHasDuplicate, results.sort(sortOrder), hasDuplicate) for (;elem = results[i]; i++) elem === results[i - 1] && results.splice(i--, 1);
      return results;
    }, Sizzle.error = function(msg) {
      throw Error("Syntax error, unrecognized expression: " + msg);
    }, compile = Sizzle.compile = function(selector, group) {
      var i, setMatchers = [], elementMatchers = [], cached = compilerCache[expando][selector];
      if (!cached) {
        for (group || (group = tokenize(selector)), i = group.length; i--; ) cached = matcherFromTokens(group[i]), 
        cached[expando] ? setMatchers.push(cached) : elementMatchers.push(cached);
        cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));
      }
      return cached;
    }, document.querySelectorAll && function() {
      var disconnectedMatch, oldSelect = select, rescape = /'|\\/g, rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g, rbuggyQSA = [ ":focus" ], rbuggyMatches = [ ":active", ":focus" ], matches = docElem.matchesSelector || docElem.mozMatchesSelector || docElem.webkitMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector;
      assert(function(div) {
        div.innerHTML = "<select><option selected=''></option></select>", div.querySelectorAll("[selected]").length || rbuggyQSA.push("\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)"), 
        div.querySelectorAll(":checked").length || rbuggyQSA.push(":checked");
      }), assert(function(div) {
        div.innerHTML = "<p test=''></p>", div.querySelectorAll("[test^='']").length && rbuggyQSA.push("[*^$]=" + whitespace + "*(?:\"\"|'')"), 
        div.innerHTML = "<input type='hidden'/>", div.querySelectorAll(":enabled").length || rbuggyQSA.push(":enabled", ":disabled");
      }), rbuggyQSA = RegExp(rbuggyQSA.join("|")), select = function(selector, context, results, seed, xml) {
        if (!(seed || xml || rbuggyQSA && rbuggyQSA.test(selector))) {
          var groups, i, old = !0, nid = expando, newContext = context, newSelector = 9 === context.nodeType && selector;
          if (1 === context.nodeType && "object" !== context.nodeName.toLowerCase()) {
            for (groups = tokenize(selector), (old = context.getAttribute("id")) ? nid = old.replace(rescape, "\\$&") : context.setAttribute("id", nid), 
            nid = "[id='" + nid + "'] ", i = groups.length; i--; ) groups[i] = nid + groups[i].join("");
            newContext = rsibling.test(selector) && context.parentNode || context, newSelector = groups.join(",");
          }
          if (newSelector) try {
            return push.apply(results, slice.call(newContext.querySelectorAll(newSelector), 0)), 
            results;
          } catch (qsaError) {} finally {
            old || context.removeAttribute("id");
          }
        }
        return oldSelect(selector, context, results, seed, xml);
      }, matches && (assert(function(div) {
        disconnectedMatch = matches.call(div, "div");
        try {
          matches.call(div, "[test!='']:sizzle"), rbuggyMatches.push("!=", pseudos);
        } catch (e) {}
      }), rbuggyMatches = RegExp(rbuggyMatches.join("|")), Sizzle.matchesSelector = function(elem, expr) {
        if (expr = expr.replace(rattributeQuotes, "='$1']"), !(isXML(elem) || rbuggyMatches.test(expr) || rbuggyQSA && rbuggyQSA.test(expr))) try {
          var ret = matches.call(elem, expr);
          if (ret || disconnectedMatch || elem.document && 11 !== elem.document.nodeType) return ret;
        } catch (e) {}
        return Sizzle(expr, null, null, [ elem ]).length > 0;
      });
    }(), Expr.pseudos.nth = Expr.pseudos.eq, Expr.filters = setFilters.prototype = Expr.pseudos, 
    Expr.setFilters = new setFilters(), Sizzle.attr = jQuery.attr, jQuery.find = Sizzle, 
    jQuery.expr = Sizzle.selectors, jQuery.expr[":"] = jQuery.expr.pseudos, jQuery.unique = Sizzle.uniqueSort, 
    jQuery.text = Sizzle.getText, jQuery.isXMLDoc = Sizzle.isXML, jQuery.contains = Sizzle.contains;
  }(window);
  var runtil = /Until$/, rparentsprev = /^(?:parents|prev(?:Until|All))/, isSimple = /^.[^:#\[\.,]*$/, rneedsContext = jQuery.expr.match.needsContext, guaranteedUnique = {
    children: !0,
    contents: !0,
    next: !0,
    prev: !0
  };
  jQuery.fn.extend({
    find: function(selector) {
      var i, l, length, n, r, ret, self = this;
      if ("string" != typeof selector) return jQuery(selector).filter(function() {
        for (i = 0, l = self.length; l > i; i++) if (jQuery.contains(self[i], this)) return !0;
      });
      for (ret = this.pushStack("", "find", selector), i = 0, l = this.length; l > i; i++) if (length = ret.length, 
      jQuery.find(selector, this[i], ret), i > 0) for (n = length; ret.length > n; n++) for (r = 0; length > r; r++) if (ret[r] === ret[n]) {
        ret.splice(n--, 1);
        break;
      }
      return ret;
    },
    has: function(target) {
      var i, targets = jQuery(target, this), len = targets.length;
      return this.filter(function() {
        for (i = 0; len > i; i++) if (jQuery.contains(this, targets[i])) return !0;
      });
    },
    not: function(selector) {
      return this.pushStack(winnow(this, selector, !1), "not", selector);
    },
    filter: function(selector) {
      return this.pushStack(winnow(this, selector, !0), "filter", selector);
    },
    is: function(selector) {
      return !!selector && ("string" == typeof selector ? rneedsContext.test(selector) ? jQuery(selector, this.context).index(this[0]) >= 0 : jQuery.filter(selector, this).length > 0 : this.filter(selector).length > 0);
    },
    closest: function(selectors, context) {
      for (var cur, i = 0, l = this.length, ret = [], pos = rneedsContext.test(selectors) || "string" != typeof selectors ? jQuery(selectors, context || this.context) : 0; l > i; i++) for (cur = this[i]; cur && cur.ownerDocument && cur !== context && 11 !== cur.nodeType; ) {
        if (pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors)) {
          ret.push(cur);
          break;
        }
        cur = cur.parentNode;
      }
      return ret = ret.length > 1 ? jQuery.unique(ret) : ret, this.pushStack(ret, "closest", selectors);
    },
    index: function(elem) {
      return elem ? "string" == typeof elem ? jQuery.inArray(this[0], jQuery(elem)) : jQuery.inArray(elem.jquery ? elem[0] : elem, this) : this[0] && this[0].parentNode ? this.prevAll().length : -1;
    },
    add: function(selector, context) {
      var set = "string" == typeof selector ? jQuery(selector, context) : jQuery.makeArray(selector && selector.nodeType ? [ selector ] : selector), all = jQuery.merge(this.get(), set);
      return this.pushStack(isDisconnected(set[0]) || isDisconnected(all[0]) ? all : jQuery.unique(all));
    },
    addBack: function(selector) {
      return this.add(null == selector ? this.prevObject : this.prevObject.filter(selector));
    }
  }), jQuery.fn.andSelf = jQuery.fn.addBack, jQuery.each({
    parent: function(elem) {
      var parent = elem.parentNode;
      return parent && 11 !== parent.nodeType ? parent : null;
    },
    parents: function(elem) {
      return jQuery.dir(elem, "parentNode");
    },
    parentsUntil: function(elem, i, until) {
      return jQuery.dir(elem, "parentNode", until);
    },
    next: function(elem) {
      return sibling(elem, "nextSibling");
    },
    prev: function(elem) {
      return sibling(elem, "previousSibling");
    },
    nextAll: function(elem) {
      return jQuery.dir(elem, "nextSibling");
    },
    prevAll: function(elem) {
      return jQuery.dir(elem, "previousSibling");
    },
    nextUntil: function(elem, i, until) {
      return jQuery.dir(elem, "nextSibling", until);
    },
    prevUntil: function(elem, i, until) {
      return jQuery.dir(elem, "previousSibling", until);
    },
    siblings: function(elem) {
      return jQuery.sibling((elem.parentNode || {}).firstChild, elem);
    },
    children: function(elem) {
      return jQuery.sibling(elem.firstChild);
    },
    contents: function(elem) {
      return jQuery.nodeName(elem, "iframe") ? elem.contentDocument || elem.contentWindow.document : jQuery.merge([], elem.childNodes);
    }
  }, function(name, fn) {
    jQuery.fn[name] = function(until, selector) {
      var ret = jQuery.map(this, fn, until);
      return runtil.test(name) || (selector = until), selector && "string" == typeof selector && (ret = jQuery.filter(selector, ret)), 
      ret = this.length > 1 && !guaranteedUnique[name] ? jQuery.unique(ret) : ret, this.length > 1 && rparentsprev.test(name) && (ret = ret.reverse()), 
      this.pushStack(ret, name, core_slice.call(arguments).join(","));
    };
  }), jQuery.extend({
    filter: function(expr, elems, not) {
      return not && (expr = ":not(" + expr + ")"), 1 === elems.length ? jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] : jQuery.find.matches(expr, elems);
    },
    dir: function(elem, dir, until) {
      for (var matched = [], cur = elem[dir]; cur && 9 !== cur.nodeType && (until === undefined || 1 !== cur.nodeType || !jQuery(cur).is(until)); ) 1 === cur.nodeType && matched.push(cur), 
      cur = cur[dir];
      return matched;
    },
    sibling: function(n, elem) {
      for (var r = []; n; n = n.nextSibling) 1 === n.nodeType && n !== elem && r.push(n);
      return r;
    }
  });
  var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g, rleadingWhitespace = /^\s+/, rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, rtagName = /<([\w:]+)/, rtbody = /<tbody/i, rhtml = /<|&#?\w+;/, rnoInnerhtml = /<(?:script|style|link)/i, rnocache = /<(?:script|object|embed|option|style)/i, rnoshimcache = RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"), rcheckableType = /^(?:checkbox|radio)$/, rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rscriptType = /\/(java|ecma)script/i, rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g, wrapMap = {
    option: [ 1, "<select multiple='multiple'>", "</select>" ],
    legend: [ 1, "<fieldset>", "</fieldset>" ],
    thead: [ 1, "<table>", "</table>" ],
    tr: [ 2, "<table><tbody>", "</tbody></table>" ],
    td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
    col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
    area: [ 1, "<map>", "</map>" ],
    _default: [ 0, "", "" ]
  }, safeFragment = createSafeFragment(document), fragmentDiv = safeFragment.appendChild(document.createElement("div"));
  wrapMap.optgroup = wrapMap.option, wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead, 
  wrapMap.th = wrapMap.td, jQuery.support.htmlSerialize || (wrapMap._default = [ 1, "X<div>", "</div>" ]), 
  jQuery.fn.extend({
    text: function(value) {
      return jQuery.access(this, function(value) {
        return value === undefined ? jQuery.text(this) : this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(value));
      }, null, value, arguments.length);
    },
    wrapAll: function(html) {
      if (jQuery.isFunction(html)) return this.each(function(i) {
        jQuery(this).wrapAll(html.call(this, i));
      });
      if (this[0]) {
        var wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(!0);
        this[0].parentNode && wrap.insertBefore(this[0]), wrap.map(function() {
          for (var elem = this; elem.firstChild && 1 === elem.firstChild.nodeType; ) elem = elem.firstChild;
          return elem;
        }).append(this);
      }
      return this;
    },
    wrapInner: function(html) {
      return jQuery.isFunction(html) ? this.each(function(i) {
        jQuery(this).wrapInner(html.call(this, i));
      }) : this.each(function() {
        var self = jQuery(this), contents = self.contents();
        contents.length ? contents.wrapAll(html) : self.append(html);
      });
    },
    wrap: function(html) {
      var isFunction = jQuery.isFunction(html);
      return this.each(function(i) {
        jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
      });
    },
    unwrap: function() {
      return this.parent().each(function() {
        jQuery.nodeName(this, "body") || jQuery(this).replaceWith(this.childNodes);
      }).end();
    },
    append: function() {
      return this.domManip(arguments, !0, function(elem) {
        (1 === this.nodeType || 11 === this.nodeType) && this.appendChild(elem);
      });
    },
    prepend: function() {
      return this.domManip(arguments, !0, function(elem) {
        (1 === this.nodeType || 11 === this.nodeType) && this.insertBefore(elem, this.firstChild);
      });
    },
    before: function() {
      if (!isDisconnected(this[0])) return this.domManip(arguments, !1, function(elem) {
        this.parentNode.insertBefore(elem, this);
      });
      if (arguments.length) {
        var set = jQuery.clean(arguments);
        return this.pushStack(jQuery.merge(set, this), "before", this.selector);
      }
    },
    after: function() {
      if (!isDisconnected(this[0])) return this.domManip(arguments, !1, function(elem) {
        this.parentNode.insertBefore(elem, this.nextSibling);
      });
      if (arguments.length) {
        var set = jQuery.clean(arguments);
        return this.pushStack(jQuery.merge(this, set), "after", this.selector);
      }
    },
    remove: function(selector, keepData) {
      for (var elem, i = 0; null != (elem = this[i]); i++) (!selector || jQuery.filter(selector, [ elem ]).length) && (keepData || 1 !== elem.nodeType || (jQuery.cleanData(elem.getElementsByTagName("*")), 
      jQuery.cleanData([ elem ])), elem.parentNode && elem.parentNode.removeChild(elem));
      return this;
    },
    empty: function() {
      for (var elem, i = 0; null != (elem = this[i]); i++) for (1 === elem.nodeType && jQuery.cleanData(elem.getElementsByTagName("*")); elem.firstChild; ) elem.removeChild(elem.firstChild);
      return this;
    },
    clone: function(dataAndEvents, deepDataAndEvents) {
      return dataAndEvents = null == dataAndEvents ? !1 : dataAndEvents, deepDataAndEvents = null == deepDataAndEvents ? dataAndEvents : deepDataAndEvents, 
      this.map(function() {
        return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
      });
    },
    html: function(value) {
      return jQuery.access(this, function(value) {
        var elem = this[0] || {}, i = 0, l = this.length;
        if (value === undefined) return 1 === elem.nodeType ? elem.innerHTML.replace(rinlinejQuery, "") : undefined;
        if (!("string" != typeof value || rnoInnerhtml.test(value) || !jQuery.support.htmlSerialize && rnoshimcache.test(value) || !jQuery.support.leadingWhitespace && rleadingWhitespace.test(value) || wrapMap[(rtagName.exec(value) || [ "", "" ])[1].toLowerCase()])) {
          value = value.replace(rxhtmlTag, "<$1></$2>");
          try {
            for (;l > i; i++) elem = this[i] || {}, 1 === elem.nodeType && (jQuery.cleanData(elem.getElementsByTagName("*")), 
            elem.innerHTML = value);
            elem = 0;
          } catch (e) {}
        }
        elem && this.empty().append(value);
      }, null, value, arguments.length);
    },
    replaceWith: function(value) {
      return isDisconnected(this[0]) ? this.length ? this.pushStack(jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value) : this : jQuery.isFunction(value) ? this.each(function(i) {
        var self = jQuery(this), old = self.html();
        self.replaceWith(value.call(this, i, old));
      }) : ("string" != typeof value && (value = jQuery(value).detach()), this.each(function() {
        var next = this.nextSibling, parent = this.parentNode;
        jQuery(this).remove(), next ? jQuery(next).before(value) : jQuery(parent).append(value);
      }));
    },
    detach: function(selector) {
      return this.remove(selector, !0);
    },
    domManip: function(args, table, callback) {
      args = [].concat.apply([], args);
      var results, first, fragment, iNoClone, i = 0, value = args[0], scripts = [], l = this.length;
      if (!jQuery.support.checkClone && l > 1 && "string" == typeof value && rchecked.test(value)) return this.each(function() {
        jQuery(this).domManip(args, table, callback);
      });
      if (jQuery.isFunction(value)) return this.each(function(i) {
        var self = jQuery(this);
        args[0] = value.call(this, i, table ? self.html() : undefined), self.domManip(args, table, callback);
      });
      if (this[0]) {
        if (results = jQuery.buildFragment(args, this, scripts), fragment = results.fragment, 
        first = fragment.firstChild, 1 === fragment.childNodes.length && (fragment = first), 
        first) for (table = table && jQuery.nodeName(first, "tr"), iNoClone = results.cacheable || l - 1; l > i; i++) callback.call(table && jQuery.nodeName(this[i], "table") ? findOrAppend(this[i], "tbody") : this[i], i === iNoClone ? fragment : jQuery.clone(fragment, !0, !0));
        fragment = first = null, scripts.length && jQuery.each(scripts, function(i, elem) {
          elem.src ? jQuery.ajax ? jQuery.ajax({
            url: elem.src,
            type: "GET",
            dataType: "script",
            async: !1,
            global: !1,
            "throws": !0
          }) : jQuery.error("no ajax") : jQuery.globalEval((elem.text || elem.textContent || elem.innerHTML || "").replace(rcleanScript, "")), 
          elem.parentNode && elem.parentNode.removeChild(elem);
        });
      }
      return this;
    }
  }), jQuery.buildFragment = function(args, context, scripts) {
    var fragment, cacheable, cachehit, first = args[0];
    return context = context || document, context = !context.nodeType && context[0] || context, 
    context = context.ownerDocument || context, !(1 === args.length && "string" == typeof first && 512 > first.length && context === document && "<" === first.charAt(0)) || rnocache.test(first) || !jQuery.support.checkClone && rchecked.test(first) || !jQuery.support.html5Clone && rnoshimcache.test(first) || (cacheable = !0, 
    fragment = jQuery.fragments[first], cachehit = fragment !== undefined), fragment || (fragment = context.createDocumentFragment(), 
    jQuery.clean(args, context, fragment, scripts), cacheable && (jQuery.fragments[first] = cachehit && fragment)), 
    {
      fragment: fragment,
      cacheable: cacheable
    };
  }, jQuery.fragments = {}, jQuery.each({
    appendTo: "append",
    prependTo: "prepend",
    insertBefore: "before",
    insertAfter: "after",
    replaceAll: "replaceWith"
  }, function(name, original) {
    jQuery.fn[name] = function(selector) {
      var elems, i = 0, ret = [], insert = jQuery(selector), l = insert.length, parent = 1 === this.length && this[0].parentNode;
      if ((null == parent || parent && 11 === parent.nodeType && 1 === parent.childNodes.length) && 1 === l) return insert[original](this[0]), 
      this;
      for (;l > i; i++) elems = (i > 0 ? this.clone(!0) : this).get(), jQuery(insert[i])[original](elems), 
      ret = ret.concat(elems);
      return this.pushStack(ret, name, insert.selector);
    };
  }), jQuery.extend({
    clone: function(elem, dataAndEvents, deepDataAndEvents) {
      var srcElements, destElements, i, clone;
      if (jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test("<" + elem.nodeName + ">") ? clone = elem.cloneNode(!0) : (fragmentDiv.innerHTML = elem.outerHTML, 
      fragmentDiv.removeChild(clone = fragmentDiv.firstChild)), !(jQuery.support.noCloneEvent && jQuery.support.noCloneChecked || 1 !== elem.nodeType && 11 !== elem.nodeType || jQuery.isXMLDoc(elem))) for (cloneFixAttributes(elem, clone), 
      srcElements = getAll(elem), destElements = getAll(clone), i = 0; srcElements[i]; ++i) destElements[i] && cloneFixAttributes(srcElements[i], destElements[i]);
      if (dataAndEvents && (cloneCopyEvent(elem, clone), deepDataAndEvents)) for (srcElements = getAll(elem), 
      destElements = getAll(clone), i = 0; srcElements[i]; ++i) cloneCopyEvent(srcElements[i], destElements[i]);
      return srcElements = destElements = null, clone;
    },
    clean: function(elems, context, fragment, scripts) {
      var i, j, elem, tag, wrap, depth, div, hasBody, tbody, handleScript, jsTags, safe = context === document && safeFragment, ret = [];
      for (context && context.createDocumentFragment !== undefined || (context = document), 
      i = 0; null != (elem = elems[i]); i++) if ("number" == typeof elem && (elem += ""), 
      elem) {
        if ("string" == typeof elem) if (rhtml.test(elem)) {
          for (safe = safe || createSafeFragment(context), div = context.createElement("div"), 
          safe.appendChild(div), elem = elem.replace(rxhtmlTag, "<$1></$2>"), tag = (rtagName.exec(elem) || [ "", "" ])[1].toLowerCase(), 
          wrap = wrapMap[tag] || wrapMap._default, depth = wrap[0], div.innerHTML = wrap[1] + elem + wrap[2]; depth--; ) div = div.lastChild;
          if (!jQuery.support.tbody) for (hasBody = rtbody.test(elem), tbody = "table" !== tag || hasBody ? "<table>" !== wrap[1] || hasBody ? [] : div.childNodes : div.firstChild && div.firstChild.childNodes, 
          j = tbody.length - 1; j >= 0; --j) jQuery.nodeName(tbody[j], "tbody") && !tbody[j].childNodes.length && tbody[j].parentNode.removeChild(tbody[j]);
          !jQuery.support.leadingWhitespace && rleadingWhitespace.test(elem) && div.insertBefore(context.createTextNode(rleadingWhitespace.exec(elem)[0]), div.firstChild), 
          elem = div.childNodes, div.parentNode.removeChild(div);
        } else elem = context.createTextNode(elem);
        elem.nodeType ? ret.push(elem) : jQuery.merge(ret, elem);
      }
      if (div && (elem = div = safe = null), !jQuery.support.appendChecked) for (i = 0; null != (elem = ret[i]); i++) jQuery.nodeName(elem, "input") ? fixDefaultChecked(elem) : elem.getElementsByTagName !== undefined && jQuery.grep(elem.getElementsByTagName("input"), fixDefaultChecked);
      if (fragment) for (handleScript = function(elem) {
        return !elem.type || rscriptType.test(elem.type) ? scripts ? scripts.push(elem.parentNode ? elem.parentNode.removeChild(elem) : elem) : fragment.appendChild(elem) : undefined;
      }, i = 0; null != (elem = ret[i]); i++) jQuery.nodeName(elem, "script") && handleScript(elem) || (fragment.appendChild(elem), 
      elem.getElementsByTagName !== undefined && (jsTags = jQuery.grep(jQuery.merge([], elem.getElementsByTagName("script")), handleScript), 
      ret.splice.apply(ret, [ i + 1, 0 ].concat(jsTags)), i += jsTags.length));
      return ret;
    },
    cleanData: function(elems, acceptData) {
      for (var data, id, elem, type, i = 0, internalKey = jQuery.expando, cache = jQuery.cache, deleteExpando = jQuery.support.deleteExpando, special = jQuery.event.special; null != (elem = elems[i]); i++) if ((acceptData || jQuery.acceptData(elem)) && (id = elem[internalKey], 
      data = id && cache[id])) {
        if (data.events) for (type in data.events) special[type] ? jQuery.event.remove(elem, type) : jQuery.removeEvent(elem, type, data.handle);
        cache[id] && (delete cache[id], deleteExpando ? delete elem[internalKey] : elem.removeAttribute ? elem.removeAttribute(internalKey) : elem[internalKey] = null, 
        jQuery.deletedIds.push(id));
      }
    }
  }), function() {
    var matched, browser;
    jQuery.uaMatch = function(ua) {
      ua = ua.toLowerCase();
      var match = /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || 0 > ua.indexOf("compatible") && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
      return {
        browser: match[1] || "",
        version: match[2] || "0"
      };
    }, matched = jQuery.uaMatch(navigator.userAgent), browser = {}, matched.browser && (browser[matched.browser] = !0, 
    browser.version = matched.version), browser.chrome ? browser.webkit = !0 : browser.webkit && (browser.safari = !0), 
    jQuery.browser = browser, jQuery.sub = function() {
      function jQuerySub(selector, context) {
        return new jQuerySub.fn.init(selector, context);
      }
      jQuery.extend(!0, jQuerySub, this), jQuerySub.superclass = this, jQuerySub.fn = jQuerySub.prototype = this(), 
      jQuerySub.fn.constructor = jQuerySub, jQuerySub.sub = this.sub, jQuerySub.fn.init = function(selector, context) {
        return context && context instanceof jQuery && !(context instanceof jQuerySub) && (context = jQuerySub(context)), 
        jQuery.fn.init.call(this, selector, context, rootjQuerySub);
      }, jQuerySub.fn.init.prototype = jQuerySub.fn;
      var rootjQuerySub = jQuerySub(document);
      return jQuerySub;
    };
  }();
  var curCSS, iframe, iframeDoc, ralpha = /alpha\([^)]*\)/i, ropacity = /opacity=([^)]*)/, rposition = /^(top|right|bottom|left)$/, rdisplayswap = /^(none|table(?!-c[ea]).+)/, rmargin = /^margin/, rnumsplit = RegExp("^(" + core_pnum + ")(.*)$", "i"), rnumnonpx = RegExp("^(" + core_pnum + ")(?!px)[a-z%]+$", "i"), rrelNum = RegExp("^([-+])=(" + core_pnum + ")", "i"), elemdisplay = {}, cssShow = {
    position: "absolute",
    visibility: "hidden",
    display: "block"
  }, cssNormalTransform = {
    letterSpacing: 0,
    fontWeight: 400
  }, cssExpand = [ "Top", "Right", "Bottom", "Left" ], cssPrefixes = [ "Webkit", "O", "Moz", "ms" ], eventsToggle = jQuery.fn.toggle;
  jQuery.fn.extend({
    css: function(name, value) {
      return jQuery.access(this, function(elem, name, value) {
        return value !== undefined ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
      }, name, value, arguments.length > 1);
    },
    show: function() {
      return showHide(this, !0);
    },
    hide: function() {
      return showHide(this);
    },
    toggle: function(state, fn2) {
      var bool = "boolean" == typeof state;
      return jQuery.isFunction(state) && jQuery.isFunction(fn2) ? eventsToggle.apply(this, arguments) : this.each(function() {
        (bool ? state : isHidden(this)) ? jQuery(this).show() : jQuery(this).hide();
      });
    }
  }), jQuery.extend({
    cssHooks: {
      opacity: {
        get: function(elem, computed) {
          if (computed) {
            var ret = curCSS(elem, "opacity");
            return "" === ret ? "1" : ret;
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
      "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
    },
    style: function(elem, name, value, extra) {
      if (elem && 3 !== elem.nodeType && 8 !== elem.nodeType && elem.style) {
        var ret, type, hooks, origName = jQuery.camelCase(name), style = elem.style;
        if (name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(style, origName)), 
        hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName], value === undefined) return hooks && "get" in hooks && (ret = hooks.get(elem, !1, extra)) !== undefined ? ret : style[name];
        if (type = typeof value, "string" === type && (ret = rrelNum.exec(value)) && (value = (ret[1] + 1) * ret[2] + parseFloat(jQuery.css(elem, name)), 
        type = "number"), !(null == value || "number" === type && isNaN(value) || ("number" !== type || jQuery.cssNumber[origName] || (value += "px"), 
        hooks && "set" in hooks && (value = hooks.set(elem, value, extra)) === undefined))) try {
          style[name] = value;
        } catch (e) {}
      }
    },
    css: function(elem, name, numeric, extra) {
      var val, num, hooks, origName = jQuery.camelCase(name);
      return name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(elem.style, origName)), 
      hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName], hooks && "get" in hooks && (val = hooks.get(elem, !0, extra)), 
      val === undefined && (val = curCSS(elem, name)), "normal" === val && name in cssNormalTransform && (val = cssNormalTransform[name]), 
      numeric || extra !== undefined ? (num = parseFloat(val), numeric || jQuery.isNumeric(num) ? num || 0 : val) : val;
    },
    swap: function(elem, options, callback) {
      var ret, name, old = {};
      for (name in options) old[name] = elem.style[name], elem.style[name] = options[name];
      ret = callback.call(elem);
      for (name in options) elem.style[name] = old[name];
      return ret;
    }
  }), window.getComputedStyle ? curCSS = function(elem, name) {
    var ret, width, minWidth, maxWidth, computed = window.getComputedStyle(elem, null), style = elem.style;
    return computed && (ret = computed[name], "" !== ret || jQuery.contains(elem.ownerDocument, elem) || (ret = jQuery.style(elem, name)), 
    rnumnonpx.test(ret) && rmargin.test(name) && (width = style.width, minWidth = style.minWidth, 
    maxWidth = style.maxWidth, style.minWidth = style.maxWidth = style.width = ret, 
    ret = computed.width, style.width = width, style.minWidth = minWidth, style.maxWidth = maxWidth)), 
    ret;
  } : document.documentElement.currentStyle && (curCSS = function(elem, name) {
    var left, rsLeft, ret = elem.currentStyle && elem.currentStyle[name], style = elem.style;
    return null == ret && style && style[name] && (ret = style[name]), rnumnonpx.test(ret) && !rposition.test(name) && (left = style.left, 
    rsLeft = elem.runtimeStyle && elem.runtimeStyle.left, rsLeft && (elem.runtimeStyle.left = elem.currentStyle.left), 
    style.left = "fontSize" === name ? "1em" : ret, ret = style.pixelLeft + "px", style.left = left, 
    rsLeft && (elem.runtimeStyle.left = rsLeft)), "" === ret ? "auto" : ret;
  }), jQuery.each([ "height", "width" ], function(i, name) {
    jQuery.cssHooks[name] = {
      get: function(elem, computed, extra) {
        return computed ? 0 === elem.offsetWidth && rdisplayswap.test(curCSS(elem, "display")) ? jQuery.swap(elem, cssShow, function() {
          return getWidthOrHeight(elem, name, extra);
        }) : getWidthOrHeight(elem, name, extra) : undefined;
      },
      set: function(elem, value, extra) {
        return setPositiveNumber(elem, value, extra ? augmentWidthOrHeight(elem, name, extra, jQuery.support.boxSizing && "border-box" === jQuery.css(elem, "boxSizing")) : 0);
      }
    };
  }), jQuery.support.opacity || (jQuery.cssHooks.opacity = {
    get: function(elem, computed) {
      return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : computed ? "1" : "";
    },
    set: function(elem, value) {
      var style = elem.style, currentStyle = elem.currentStyle, opacity = jQuery.isNumeric(value) ? "alpha(opacity=" + 100 * value + ")" : "", filter = currentStyle && currentStyle.filter || style.filter || "";
      style.zoom = 1, value >= 1 && "" === jQuery.trim(filter.replace(ralpha, "")) && style.removeAttribute && (style.removeAttribute("filter"), 
      currentStyle && !currentStyle.filter) || (style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : filter + " " + opacity);
    }
  }), jQuery(function() {
    jQuery.support.reliableMarginRight || (jQuery.cssHooks.marginRight = {
      get: function(elem, computed) {
        return jQuery.swap(elem, {
          display: "inline-block"
        }, function() {
          return computed ? curCSS(elem, "marginRight") : undefined;
        });
      }
    }), !jQuery.support.pixelPosition && jQuery.fn.position && jQuery.each([ "top", "left" ], function(i, prop) {
      jQuery.cssHooks[prop] = {
        get: function(elem, computed) {
          if (computed) {
            var ret = curCSS(elem, prop);
            return rnumnonpx.test(ret) ? jQuery(elem).position()[prop] + "px" : ret;
          }
        }
      };
    });
  }), jQuery.expr && jQuery.expr.filters && (jQuery.expr.filters.hidden = function(elem) {
    return 0 === elem.offsetWidth && 0 === elem.offsetHeight || !jQuery.support.reliableHiddenOffsets && "none" === (elem.style && elem.style.display || curCSS(elem, "display"));
  }, jQuery.expr.filters.visible = function(elem) {
    return !jQuery.expr.filters.hidden(elem);
  }), jQuery.each({
    margin: "",
    padding: "",
    border: "Width"
  }, function(prefix, suffix) {
    jQuery.cssHooks[prefix + suffix] = {
      expand: function(value) {
        var i, parts = "string" == typeof value ? value.split(" ") : [ value ], expanded = {};
        for (i = 0; 4 > i; i++) expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
        return expanded;
      }
    }, rmargin.test(prefix) || (jQuery.cssHooks[prefix + suffix].set = setPositiveNumber);
  });
  var r20 = /%20/g, rbracket = /\[\]$/, rCRLF = /\r?\n/g, rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i, rselectTextarea = /^(?:select|textarea)/i;
  jQuery.fn.extend({
    serialize: function() {
      return jQuery.param(this.serializeArray());
    },
    serializeArray: function() {
      return this.map(function() {
        return this.elements ? jQuery.makeArray(this.elements) : this;
      }).filter(function() {
        return this.name && !this.disabled && (this.checked || rselectTextarea.test(this.nodeName) || rinput.test(this.type));
      }).map(function(i, elem) {
        var val = jQuery(this).val();
        return null == val ? null : jQuery.isArray(val) ? jQuery.map(val, function(val) {
          return {
            name: elem.name,
            value: val.replace(rCRLF, "\r\n")
          };
        }) : {
          name: elem.name,
          value: val.replace(rCRLF, "\r\n")
        };
      }).get();
    }
  }), jQuery.param = function(a, traditional) {
    var prefix, s = [], add = function(key, value) {
      value = jQuery.isFunction(value) ? value() : null == value ? "" : value, s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
    };
    if (traditional === undefined && (traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional), 
    jQuery.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) jQuery.each(a, function() {
      add(this.name, this.value);
    }); else for (prefix in a) buildParams(prefix, a[prefix], traditional, add);
    return s.join("&").replace(r20, "+");
  };
  var ajaxLocParts, ajaxLocation, rhash = /#.*$/, rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, rquery = /\?/, rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, rts = /([?&])_=[^&]*/, rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/, _load = jQuery.fn.load, prefilters = {}, transports = {}, allTypes = [ "*/" ] + [ "*" ];
  try {
    ajaxLocation = location.href;
  } catch (e) {
    ajaxLocation = document.createElement("a"), ajaxLocation.href = "", ajaxLocation = ajaxLocation.href;
  }
  ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [], jQuery.fn.load = function(url, params, callback) {
    if ("string" != typeof url && _load) return _load.apply(this, arguments);
    if (!this.length) return this;
    var selector, type, response, self = this, off = url.indexOf(" ");
    return off >= 0 && (selector = url.slice(off, url.length), url = url.slice(0, off)), 
    jQuery.isFunction(params) ? (callback = params, params = undefined) : params && "object" == typeof params && (type = "POST"), 
    jQuery.ajax({
      url: url,
      type: type,
      dataType: "html",
      data: params,
      complete: function(jqXHR, status) {
        callback && self.each(callback, response || [ jqXHR.responseText, status, jqXHR ]);
      }
    }).done(function(responseText) {
      response = arguments, self.html(selector ? jQuery("<div>").append(responseText.replace(rscript, "")).find(selector) : responseText);
    }), this;
  }, jQuery.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(i, o) {
    jQuery.fn[o] = function(f) {
      return this.on(o, f);
    };
  }), jQuery.each([ "get", "post" ], function(i, method) {
    jQuery[method] = function(url, data, callback, type) {
      return jQuery.isFunction(data) && (type = type || callback, callback = data, data = undefined), 
      jQuery.ajax({
        type: method,
        url: url,
        data: data,
        success: callback,
        dataType: type
      });
    };
  }), jQuery.extend({
    getScript: function(url, callback) {
      return jQuery.get(url, undefined, callback, "script");
    },
    getJSON: function(url, data, callback) {
      return jQuery.get(url, data, callback, "json");
    },
    ajaxSetup: function(target, settings) {
      return settings ? ajaxExtend(target, jQuery.ajaxSettings) : (settings = target, 
      target = jQuery.ajaxSettings), ajaxExtend(target, settings), target;
    },
    ajaxSettings: {
      url: ajaxLocation,
      isLocal: rlocalProtocol.test(ajaxLocParts[1]),
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
        "*": allTypes
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
        "* text": window.String,
        "text html": !0,
        "text json": jQuery.parseJSON,
        "text xml": jQuery.parseXML
      },
      flatOptions: {
        context: !0,
        url: !0
      }
    },
    ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
    ajaxTransport: addToPrefiltersOrTransports(transports),
    ajax: function(url, options) {
      function done(status, nativeStatusText, responses, headers) {
        var isSuccess, success, error, response, modified, statusText = nativeStatusText;
        2 !== state && (state = 2, timeoutTimer && clearTimeout(timeoutTimer), transport = undefined, 
        responseHeadersString = headers || "", jqXHR.readyState = status > 0 ? 4 : 0, responses && (response = ajaxHandleResponses(s, jqXHR, responses)), 
        status >= 200 && 300 > status || 304 === status ? (s.ifModified && (modified = jqXHR.getResponseHeader("Last-Modified"), 
        modified && (jQuery.lastModified[ifModifiedKey] = modified), modified = jqXHR.getResponseHeader("Etag"), 
        modified && (jQuery.etag[ifModifiedKey] = modified)), 304 === status ? (statusText = "notmodified", 
        isSuccess = !0) : (isSuccess = ajaxConvert(s, response), statusText = isSuccess.state, 
        success = isSuccess.data, error = isSuccess.error, isSuccess = !error)) : (error = statusText, 
        (!statusText || status) && (statusText = "error", 0 > status && (status = 0))), 
        jqXHR.status = status, jqXHR.statusText = (nativeStatusText || statusText) + "", 
        isSuccess ? deferred.resolveWith(callbackContext, [ success, statusText, jqXHR ]) : deferred.rejectWith(callbackContext, [ jqXHR, statusText, error ]), 
        jqXHR.statusCode(statusCode), statusCode = undefined, fireGlobals && globalEventContext.trigger("ajax" + (isSuccess ? "Success" : "Error"), [ jqXHR, s, isSuccess ? success : error ]), 
        completeDeferred.fireWith(callbackContext, [ jqXHR, statusText ]), fireGlobals && (globalEventContext.trigger("ajaxComplete", [ jqXHR, s ]), 
        --jQuery.active || jQuery.event.trigger("ajaxStop")));
      }
      "object" == typeof url && (options = url, url = undefined), options = options || {};
      var ifModifiedKey, responseHeadersString, responseHeaders, transport, timeoutTimer, parts, fireGlobals, i, s = jQuery.ajaxSetup({}, options), callbackContext = s.context || s, globalEventContext = callbackContext !== s && (callbackContext.nodeType || callbackContext instanceof jQuery) ? jQuery(callbackContext) : jQuery.event, deferred = jQuery.Deferred(), completeDeferred = jQuery.Callbacks("once memory"), statusCode = s.statusCode || {}, requestHeaders = {}, requestHeadersNames = {}, state = 0, strAbort = "canceled", jqXHR = {
        readyState: 0,
        setRequestHeader: function(name, value) {
          if (!state) {
            var lname = name.toLowerCase();
            name = requestHeadersNames[lname] = requestHeadersNames[lname] || name, requestHeaders[name] = value;
          }
          return this;
        },
        getAllResponseHeaders: function() {
          return 2 === state ? responseHeadersString : null;
        },
        getResponseHeader: function(key) {
          var match;
          if (2 === state) {
            if (!responseHeaders) for (responseHeaders = {}; match = rheaders.exec(responseHeadersString); ) responseHeaders[match[1].toLowerCase()] = match[2];
            match = responseHeaders[key.toLowerCase()];
          }
          return match === undefined ? null : match;
        },
        overrideMimeType: function(type) {
          return state || (s.mimeType = type), this;
        },
        abort: function(statusText) {
          return statusText = statusText || strAbort, transport && transport.abort(statusText), 
          done(0, statusText), this;
        }
      };
      if (deferred.promise(jqXHR), jqXHR.success = jqXHR.done, jqXHR.error = jqXHR.fail, 
      jqXHR.complete = completeDeferred.add, jqXHR.statusCode = function(map) {
        if (map) {
          var tmp;
          if (2 > state) for (tmp in map) statusCode[tmp] = [ statusCode[tmp], map[tmp] ]; else tmp = map[jqXHR.status], 
          jqXHR.always(tmp);
        }
        return this;
      }, s.url = ((url || s.url) + "").replace(rhash, "").replace(rprotocol, ajaxLocParts[1] + "//"), 
      s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().split(core_rspace), null == s.crossDomain && (parts = rurl.exec(s.url.toLowerCase()) || !1, 
      s.crossDomain = parts && parts.join(":") + (parts[3] ? "" : "http:" === parts[1] ? 80 : 443) !== ajaxLocParts.join(":") + (ajaxLocParts[3] ? "" : "http:" === ajaxLocParts[1] ? 80 : 443)), 
      s.data && s.processData && "string" != typeof s.data && (s.data = jQuery.param(s.data, s.traditional)), 
      inspectPrefiltersOrTransports(prefilters, s, options, jqXHR), 2 === state) return jqXHR;
      if (fireGlobals = s.global, s.type = s.type.toUpperCase(), s.hasContent = !rnoContent.test(s.type), 
      fireGlobals && 0 === jQuery.active++ && jQuery.event.trigger("ajaxStart"), !s.hasContent && (s.data && (s.url += (rquery.test(s.url) ? "&" : "?") + s.data, 
      delete s.data), ifModifiedKey = s.url, s.cache === !1)) {
        var ts = jQuery.now(), ret = s.url.replace(rts, "$1_=" + ts);
        s.url = ret + (ret === s.url ? (rquery.test(s.url) ? "&" : "?") + "_=" + ts : "");
      }
      (s.data && s.hasContent && s.contentType !== !1 || options.contentType) && jqXHR.setRequestHeader("Content-Type", s.contentType), 
      s.ifModified && (ifModifiedKey = ifModifiedKey || s.url, jQuery.lastModified[ifModifiedKey] && jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[ifModifiedKey]), 
      jQuery.etag[ifModifiedKey] && jqXHR.setRequestHeader("If-None-Match", jQuery.etag[ifModifiedKey])), 
      jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + ("*" !== s.dataTypes[0] ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]);
      for (i in s.headers) jqXHR.setRequestHeader(i, s.headers[i]);
      if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === !1 || 2 === state)) return jqXHR.abort();
      strAbort = "abort";
      for (i in {
        success: 1,
        error: 1,
        complete: 1
      }) jqXHR[i](s[i]);
      if (transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR)) {
        jqXHR.readyState = 1, fireGlobals && globalEventContext.trigger("ajaxSend", [ jqXHR, s ]), 
        s.async && s.timeout > 0 && (timeoutTimer = setTimeout(function() {
          jqXHR.abort("timeout");
        }, s.timeout));
        try {
          state = 1, transport.send(requestHeaders, done);
        } catch (e) {
          if (!(2 > state)) throw e;
          done(-1, e);
        }
      } else done(-1, "No Transport");
      return jqXHR;
    },
    active: 0,
    lastModified: {},
    etag: {}
  });
  var oldCallbacks = [], rquestion = /\?/, rjsonp = /(=)\?(?=&|$)|\?\?/, nonce = jQuery.now();
  jQuery.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function() {
      var callback = oldCallbacks.pop() || jQuery.expando + "_" + nonce++;
      return this[callback] = !0, callback;
    }
  }), jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
    var callbackName, overwritten, responseContainer, data = s.data, url = s.url, hasCallback = s.jsonp !== !1, replaceInUrl = hasCallback && rjsonp.test(url), replaceInData = hasCallback && !replaceInUrl && "string" == typeof data && !(s.contentType || "").indexOf("application/x-www-form-urlencoded") && rjsonp.test(data);
    return "jsonp" === s.dataTypes[0] || replaceInUrl || replaceInData ? (callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback, 
    overwritten = window[callbackName], replaceInUrl ? s.url = url.replace(rjsonp, "$1" + callbackName) : replaceInData ? s.data = data.replace(rjsonp, "$1" + callbackName) : hasCallback && (s.url += (rquestion.test(url) ? "&" : "?") + s.jsonp + "=" + callbackName), 
    s.converters["script json"] = function() {
      return responseContainer || jQuery.error(callbackName + " was not called"), responseContainer[0];
    }, s.dataTypes[0] = "json", window[callbackName] = function() {
      responseContainer = arguments;
    }, jqXHR.always(function() {
      window[callbackName] = overwritten, s[callbackName] && (s.jsonpCallback = originalSettings.jsonpCallback, 
      oldCallbacks.push(callbackName)), responseContainer && jQuery.isFunction(overwritten) && overwritten(responseContainer[0]), 
      responseContainer = overwritten = undefined;
    }), "script") : undefined;
  }), jQuery.ajaxSetup({
    accepts: {
      script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
    },
    contents: {
      script: /javascript|ecmascript/
    },
    converters: {
      "text script": function(text) {
        return jQuery.globalEval(text), text;
      }
    }
  }), jQuery.ajaxPrefilter("script", function(s) {
    s.cache === undefined && (s.cache = !1), s.crossDomain && (s.type = "GET", s.global = !1);
  }), jQuery.ajaxTransport("script", function(s) {
    if (s.crossDomain) {
      var script, head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
      return {
        send: function(_, callback) {
          script = document.createElement("script"), script.async = "async", s.scriptCharset && (script.charset = s.scriptCharset), 
          script.src = s.url, script.onload = script.onreadystatechange = function(_, isAbort) {
            (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) && (script.onload = script.onreadystatechange = null, 
            head && script.parentNode && head.removeChild(script), script = undefined, isAbort || callback(200, "success"));
          }, head.insertBefore(script, head.firstChild);
        },
        abort: function() {
          script && script.onload(0, 1);
        }
      };
    }
  });
  var xhrCallbacks, xhrOnUnloadAbort = window.ActiveXObject ? function() {
    for (var key in xhrCallbacks) xhrCallbacks[key](0, 1);
  } : !1, xhrId = 0;
  jQuery.ajaxSettings.xhr = window.ActiveXObject ? function() {
    return !this.isLocal && createStandardXHR() || createActiveXHR();
  } : createStandardXHR, function(xhr) {
    jQuery.extend(jQuery.support, {
      ajax: !!xhr,
      cors: !!xhr && "withCredentials" in xhr
    });
  }(jQuery.ajaxSettings.xhr()), jQuery.support.ajax && jQuery.ajaxTransport(function(s) {
    if (!s.crossDomain || jQuery.support.cors) {
      var callback;
      return {
        send: function(headers, complete) {
          var handle, i, xhr = s.xhr();
          if (s.username ? xhr.open(s.type, s.url, s.async, s.username, s.password) : xhr.open(s.type, s.url, s.async), 
          s.xhrFields) for (i in s.xhrFields) xhr[i] = s.xhrFields[i];
          s.mimeType && xhr.overrideMimeType && xhr.overrideMimeType(s.mimeType), s.crossDomain || headers["X-Requested-With"] || (headers["X-Requested-With"] = "XMLHttpRequest");
          try {
            for (i in headers) xhr.setRequestHeader(i, headers[i]);
          } catch (_) {}
          xhr.send(s.hasContent && s.data || null), callback = function(_, isAbort) {
            var status, statusText, responseHeaders, responses, xml;
            try {
              if (callback && (isAbort || 4 === xhr.readyState)) if (callback = undefined, handle && (xhr.onreadystatechange = jQuery.noop, 
              xhrOnUnloadAbort && delete xhrCallbacks[handle]), isAbort) 4 !== xhr.readyState && xhr.abort(); else {
                status = xhr.status, responseHeaders = xhr.getAllResponseHeaders(), responses = {}, 
                xml = xhr.responseXML, xml && xml.documentElement && (responses.xml = xml);
                try {
                  responses.text = xhr.responseText;
                } catch (_) {}
                try {
                  statusText = xhr.statusText;
                } catch (e) {
                  statusText = "";
                }
                status || !s.isLocal || s.crossDomain ? 1223 === status && (status = 204) : status = responses.text ? 200 : 404;
              }
            } catch (firefoxAccessException) {
              isAbort || complete(-1, firefoxAccessException);
            }
            responses && complete(status, statusText, responses, responseHeaders);
          }, s.async ? 4 === xhr.readyState ? setTimeout(callback, 0) : (handle = ++xhrId, 
          xhrOnUnloadAbort && (xhrCallbacks || (xhrCallbacks = {}, jQuery(window).unload(xhrOnUnloadAbort)), 
          xhrCallbacks[handle] = callback), xhr.onreadystatechange = callback) : callback();
        },
        abort: function() {
          callback && callback(0, 1);
        }
      };
    }
  });
  var fxNow, timerId, rfxtypes = /^(?:toggle|show|hide)$/, rfxnum = RegExp("^(?:([-+])=|)(" + core_pnum + ")([a-z%]*)$", "i"), rrun = /queueHooks$/, animationPrefilters = [ defaultPrefilter ], tweeners = {
    "*": [ function(prop, value) {
      var end, unit, tween = this.createTween(prop, value), parts = rfxnum.exec(value), target = tween.cur(), start = +target || 0, scale = 1, maxIterations = 20;
      if (parts) {
        if (end = +parts[2], unit = parts[3] || (jQuery.cssNumber[prop] ? "" : "px"), "px" !== unit && start) {
          start = jQuery.css(tween.elem, prop, !0) || end || 1;
          do scale = scale || ".5", start /= scale, jQuery.style(tween.elem, prop, start + unit); while (scale !== (scale = tween.cur() / target) && 1 !== scale && --maxIterations);
        }
        tween.unit = unit, tween.start = start, tween.end = parts[1] ? start + (parts[1] + 1) * end : end;
      }
      return tween;
    } ]
  };
  jQuery.Animation = jQuery.extend(Animation, {
    tweener: function(props, callback) {
      jQuery.isFunction(props) ? (callback = props, props = [ "*" ]) : props = props.split(" ");
      for (var prop, index = 0, length = props.length; length > index; index++) prop = props[index], 
      tweeners[prop] = tweeners[prop] || [], tweeners[prop].unshift(callback);
    },
    prefilter: function(callback, prepend) {
      prepend ? animationPrefilters.unshift(callback) : animationPrefilters.push(callback);
    }
  }), jQuery.Tween = Tween, Tween.prototype = {
    constructor: Tween,
    init: function(elem, options, prop, end, easing, unit) {
      this.elem = elem, this.prop = prop, this.easing = easing || "swing", this.options = options, 
      this.start = this.now = this.cur(), this.end = end, this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
    },
    cur: function() {
      var hooks = Tween.propHooks[this.prop];
      return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
    },
    run: function(percent) {
      var eased, hooks = Tween.propHooks[this.prop];
      return this.pos = eased = this.options.duration ? jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration) : percent, 
      this.now = (this.end - this.start) * eased + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), 
      hooks && hooks.set ? hooks.set(this) : Tween.propHooks._default.set(this), this;
    }
  }, Tween.prototype.init.prototype = Tween.prototype, Tween.propHooks = {
    _default: {
      get: function(tween) {
        var result;
        return null == tween.elem[tween.prop] || tween.elem.style && null != tween.elem.style[tween.prop] ? (result = jQuery.css(tween.elem, tween.prop, !1, ""), 
        result && "auto" !== result ? result : 0) : tween.elem[tween.prop];
      },
      set: function(tween) {
        jQuery.fx.step[tween.prop] ? jQuery.fx.step[tween.prop](tween) : tween.elem.style && (null != tween.elem.style[jQuery.cssProps[tween.prop]] || jQuery.cssHooks[tween.prop]) ? jQuery.style(tween.elem, tween.prop, tween.now + tween.unit) : tween.elem[tween.prop] = tween.now;
      }
    }
  }, Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
    set: function(tween) {
      tween.elem.nodeType && tween.elem.parentNode && (tween.elem[tween.prop] = tween.now);
    }
  }, jQuery.each([ "toggle", "show", "hide" ], function(i, name) {
    var cssFn = jQuery.fn[name];
    jQuery.fn[name] = function(speed, easing, callback) {
      return null == speed || "boolean" == typeof speed || !i && jQuery.isFunction(speed) && jQuery.isFunction(easing) ? cssFn.apply(this, arguments) : this.animate(genFx(name, !0), speed, easing, callback);
    };
  }), jQuery.fn.extend({
    fadeTo: function(speed, to, easing, callback) {
      return this.filter(isHidden).css("opacity", 0).show().end().animate({
        opacity: to
      }, speed, easing, callback);
    },
    animate: function(prop, speed, easing, callback) {
      var empty = jQuery.isEmptyObject(prop), optall = jQuery.speed(speed, easing, callback), doAnimation = function() {
        var anim = Animation(this, jQuery.extend({}, prop), optall);
        empty && anim.stop(!0);
      };
      return empty || optall.queue === !1 ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
    },
    stop: function(type, clearQueue, gotoEnd) {
      var stopQueue = function(hooks) {
        var stop = hooks.stop;
        delete hooks.stop, stop(gotoEnd);
      };
      return "string" != typeof type && (gotoEnd = clearQueue, clearQueue = type, type = undefined), 
      clearQueue && type !== !1 && this.queue(type || "fx", []), this.each(function() {
        var dequeue = !0, index = null != type && type + "queueHooks", timers = jQuery.timers, data = jQuery._data(this);
        if (index) data[index] && data[index].stop && stopQueue(data[index]); else for (index in data) data[index] && data[index].stop && rrun.test(index) && stopQueue(data[index]);
        for (index = timers.length; index--; ) timers[index].elem !== this || null != type && timers[index].queue !== type || (timers[index].anim.stop(gotoEnd), 
        dequeue = !1, timers.splice(index, 1));
        (dequeue || !gotoEnd) && jQuery.dequeue(this, type);
      });
    }
  }), jQuery.each({
    slideDown: genFx("show"),
    slideUp: genFx("hide"),
    slideToggle: genFx("toggle"),
    fadeIn: {
      opacity: "show"
    },
    fadeOut: {
      opacity: "hide"
    },
    fadeToggle: {
      opacity: "toggle"
    }
  }, function(name, props) {
    jQuery.fn[name] = function(speed, easing, callback) {
      return this.animate(props, speed, easing, callback);
    };
  }), jQuery.speed = function(speed, easing, fn) {
    var opt = speed && "object" == typeof speed ? jQuery.extend({}, speed) : {
      complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
      duration: speed,
      easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
    };
    return opt.duration = jQuery.fx.off ? 0 : "number" == typeof opt.duration ? opt.duration : opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default, 
    (null == opt.queue || opt.queue === !0) && (opt.queue = "fx"), opt.old = opt.complete, 
    opt.complete = function() {
      jQuery.isFunction(opt.old) && opt.old.call(this), opt.queue && jQuery.dequeue(this, opt.queue);
    }, opt;
  }, jQuery.easing = {
    linear: function(p) {
      return p;
    },
    swing: function(p) {
      return .5 - Math.cos(p * Math.PI) / 2;
    }
  }, jQuery.timers = [], jQuery.fx = Tween.prototype.init, jQuery.fx.tick = function() {
    for (var timer, timers = jQuery.timers, i = 0; timers.length > i; i++) timer = timers[i], 
    timer() || timers[i] !== timer || timers.splice(i--, 1);
    timers.length || jQuery.fx.stop();
  }, jQuery.fx.timer = function(timer) {
    timer() && jQuery.timers.push(timer) && !timerId && (timerId = setInterval(jQuery.fx.tick, jQuery.fx.interval));
  }, jQuery.fx.interval = 13, jQuery.fx.stop = function() {
    clearInterval(timerId), timerId = null;
  }, jQuery.fx.speeds = {
    slow: 600,
    fast: 200,
    _default: 400
  }, jQuery.fx.step = {}, jQuery.expr && jQuery.expr.filters && (jQuery.expr.filters.animated = function(elem) {
    return jQuery.grep(jQuery.timers, function(fn) {
      return elem === fn.elem;
    }).length;
  });
  var rroot = /^(?:body|html)$/i;
  jQuery.fn.offset = function(options) {
    if (arguments.length) return options === undefined ? this : this.each(function(i) {
      jQuery.offset.setOffset(this, options, i);
    });
    var docElem, body, win, clientTop, clientLeft, scrollTop, scrollLeft, box = {
      top: 0,
      left: 0
    }, elem = this[0], doc = elem && elem.ownerDocument;
    if (doc) return (body = doc.body) === elem ? jQuery.offset.bodyOffset(elem) : (docElem = doc.documentElement, 
    jQuery.contains(docElem, elem) ? (elem.getBoundingClientRect !== undefined && (box = elem.getBoundingClientRect()), 
    win = getWindow(doc), clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0, 
    scrollTop = win.pageYOffset || docElem.scrollTop, scrollLeft = win.pageXOffset || docElem.scrollLeft, 
    {
      top: box.top + scrollTop - clientTop,
      left: box.left + scrollLeft - clientLeft
    }) : box);
  }, jQuery.offset = {
    bodyOffset: function(body) {
      var top = body.offsetTop, left = body.offsetLeft;
      return jQuery.support.doesNotIncludeMarginInBodyOffset && (top += parseFloat(jQuery.css(body, "marginTop")) || 0, 
      left += parseFloat(jQuery.css(body, "marginLeft")) || 0), {
        top: top,
        left: left
      };
    },
    setOffset: function(elem, options, i) {
      var position = jQuery.css(elem, "position");
      "static" === position && (elem.style.position = "relative");
      var curTop, curLeft, curElem = jQuery(elem), curOffset = curElem.offset(), curCSSTop = jQuery.css(elem, "top"), curCSSLeft = jQuery.css(elem, "left"), calculatePosition = ("absolute" === position || "fixed" === position) && jQuery.inArray("auto", [ curCSSTop, curCSSLeft ]) > -1, props = {}, curPosition = {};
      calculatePosition ? (curPosition = curElem.position(), curTop = curPosition.top, 
      curLeft = curPosition.left) : (curTop = parseFloat(curCSSTop) || 0, curLeft = parseFloat(curCSSLeft) || 0), 
      jQuery.isFunction(options) && (options = options.call(elem, i, curOffset)), null != options.top && (props.top = options.top - curOffset.top + curTop), 
      null != options.left && (props.left = options.left - curOffset.left + curLeft), 
      "using" in options ? options.using.call(elem, props) : curElem.css(props);
    }
  }, jQuery.fn.extend({
    position: function() {
      if (this[0]) {
        var elem = this[0], offsetParent = this.offsetParent(), offset = this.offset(), parentOffset = rroot.test(offsetParent[0].nodeName) ? {
          top: 0,
          left: 0
        } : offsetParent.offset();
        return offset.top -= parseFloat(jQuery.css(elem, "marginTop")) || 0, offset.left -= parseFloat(jQuery.css(elem, "marginLeft")) || 0, 
        parentOffset.top += parseFloat(jQuery.css(offsetParent[0], "borderTopWidth")) || 0, 
        parentOffset.left += parseFloat(jQuery.css(offsetParent[0], "borderLeftWidth")) || 0, 
        {
          top: offset.top - parentOffset.top,
          left: offset.left - parentOffset.left
        };
      }
    },
    offsetParent: function() {
      return this.map(function() {
        for (var offsetParent = this.offsetParent || document.body; offsetParent && !rroot.test(offsetParent.nodeName) && "static" === jQuery.css(offsetParent, "position"); ) offsetParent = offsetParent.offsetParent;
        return offsetParent || document.body;
      });
    }
  }), jQuery.each({
    scrollLeft: "pageXOffset",
    scrollTop: "pageYOffset"
  }, function(method, prop) {
    var top = /Y/.test(prop);
    jQuery.fn[method] = function(val) {
      return jQuery.access(this, function(elem, method, val) {
        var win = getWindow(elem);
        return val === undefined ? win ? prop in win ? win[prop] : win.document.documentElement[method] : elem[method] : (win ? win.scrollTo(top ? jQuery(win).scrollLeft() : val, top ? val : jQuery(win).scrollTop()) : elem[method] = val, 
        undefined);
      }, method, val, arguments.length, null);
    };
  }), jQuery.each({
    Height: "height",
    Width: "width"
  }, function(name, type) {
    jQuery.each({
      padding: "inner" + name,
      content: type,
      "": "outer" + name
    }, function(defaultExtra, funcName) {
      jQuery.fn[funcName] = function(margin, value) {
        var chainable = arguments.length && (defaultExtra || "boolean" != typeof margin), extra = defaultExtra || (margin === !0 || value === !0 ? "margin" : "border");
        return jQuery.access(this, function(elem, type, value) {
          var doc;
          return jQuery.isWindow(elem) ? elem.document.documentElement["client" + name] : 9 === elem.nodeType ? (doc = elem.documentElement, 
          Math.max(elem.body["scroll" + name], doc["scroll" + name], elem.body["offset" + name], doc["offset" + name], doc["client" + name])) : value === undefined ? jQuery.css(elem, type, value, extra) : jQuery.style(elem, type, value, extra);
        }, type, chainable ? margin : undefined, chainable, null);
      };
    });
  }), window.jQuery = window.$ = jQuery, "function" == typeof define && define.amd && define.amd.jQuery && define("jquery", [], function() {
    return jQuery;
  });
}(window), define(function(require) {
  "use strict";
  var $ = require("jquery");
  $.fn.focusend = function() {
    if (this[0]) {
      var target = this[0], l = target.value.length;
      target.focus();
      try {
        target.setSelectionRange(l, l);
      } catch (e) {}
    }
  };
}), define(function(require) {
  "use strict";
  var $ = require("jquery");
  if ($.browser.mozilla) {
    var originalFilter = $.event.mouseHooks.filter;
    $.event.mouseHooks.filter = function(event, original) {
      if (event = originalFilter(event, original), void 0 === event.offsetX) {
        var offset = $(event.target).offset();
        event.offsetY = event.pageY - offset.top, event.offsetX = event.pageX - offset.left;
      }
      return event;
    };
  }
}), define(function(require) {
  "use strict";
  function handler(event) {
    var fn, orgEvent = event || window.event, args = [].slice.call(arguments, 1), delta = 0, deltaX = 0, deltaY = 0, absDelta = 0, absDeltaXY = 0;
    return event = $.event.fix(orgEvent), event.type = "mousewheel", orgEvent.wheelDelta && (delta = orgEvent.wheelDelta), 
    orgEvent.detail && (delta = -1 * orgEvent.detail), orgEvent.deltaY && (deltaY = -1 * orgEvent.deltaY, 
    delta = deltaY), orgEvent.deltaX && (deltaX = orgEvent.deltaX, delta = -1 * deltaX), 
    void 0 !== orgEvent.wheelDeltaY && (deltaY = orgEvent.wheelDeltaY), void 0 !== orgEvent.wheelDeltaX && (deltaX = -1 * orgEvent.wheelDeltaX), 
    absDelta = Math.abs(delta), (!lowestDelta || lowestDelta > absDelta) && (lowestDelta = absDelta), 
    absDeltaXY = Math.max(Math.abs(deltaY), Math.abs(deltaX)), (!lowestDeltaXY || lowestDeltaXY > absDeltaXY) && (lowestDeltaXY = absDeltaXY), 
    fn = delta > 0 ? "floor" : "ceil", delta = Math[fn](delta / lowestDelta), deltaX = Math[fn](deltaX / lowestDeltaXY), 
    deltaY = Math[fn](deltaY / lowestDeltaXY), args.unshift(event, delta, deltaX, deltaY), 
    ($.event.dispatch || $.event.handle).apply(this, args);
  }
  var lowestDelta, lowestDeltaXY, $ = require("jquery"), toFix = [ "wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll" ], toBind = "onwheel" in document || document.documentMode >= 9 ? [ "wheel" ] : [ "mousewheel", "DomMouseScroll", "MozMousePixelScroll" ];
  if ($.event.fixHooks) for (var i = toFix.length; i; ) $.event.fixHooks[toFix[--i]] = $.event.mouseHooks;
  $.event.special.mousewheel = {
    setup: function() {
      if (this.addEventListener) for (var i = toBind.length; i; ) this.addEventListener(toBind[--i], handler, !1); else this.onmousewheel = handler;
    },
    teardown: function() {
      if (this.removeEventListener) for (var i = toBind.length; i; ) this.removeEventListener(toBind[--i], handler, !1); else this.onmousewheel = null;
    }
  }, $.fn.extend({
    mousewheel: function(fn) {
      return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },
    unmousewheel: function(fn) {
      return this.unbind("mousewheel", fn);
    }
  });
}), define(function(require) {
  "use strict";
  function dragenterData(ele, val, ded) {
    return ele = $(ele), ded = $.fn.dndsortable.defaults.dragenterData, 1 === arguments.length ? ele.data(ded) || 0 : (val ? ele.data(ded, Math.max(0, val)) : ele.data(ded, null), 
    void 0);
  }
  function sort(dragging, dropzone) {
    var sibling = $(dragging).next();
    sibling[0] === dropzone ? $(dragging).before(dropzone) : ($(dropzone).before(dragging), 
    sibling.before(dropzone));
  }
  function wrap(container, dragging, dropzone, delay, fn) {
    if (delay) {
      var t = container.data("drag-timer");
      t && (clearTimeout(t), t = null, container.removeData("drag-timer")), t = setTimeout(function() {
        fn(dragging, dropzone);
      }, delay), container.data("drag-timer", t);
    } else fn(dragging, dropzone);
  }
  var $ = require("jquery");
  $.fn.dndsortable = function(options) {
    return options = $.extend({}, $.fn.dndsortable.defaults, options), this.each(function() {
      var index, dragging, $this = $(this), selector = options.list + options.items, items = $this.find(options.items);
      items.addClass(options.childClass).prop("draggable", options.draggable), $this.on("dragstart.ui", selector, function(e) {
        return e.stopPropagation(), e.originalEvent.dataTransfer && (e.originalEvent.dataTransfer.effectAllowed = "moving", 
        e.originalEvent.dataTransfer.setData("Text", options.setData(this))), index = $(dragging = this).addClass(options.draggingClass).index(), 
        options.start && options.start.call(this, index), !0;
      }).on("dragend.ui", selector, function(e) {
        return e.stopPropagation(), $(this).removeClass(options.draggingClass), options.end && options.end.call(this, index), 
        index = void 0, dragging = null, dragenterData(this, !1), !1;
      }).on("dragenter.ui", selector, function() {
        if (!dragging || dragging === this) return !0;
        var ele = this, $ele = $(ele), prevCounter = dragenterData(this);
        return dragenterData(this, prevCounter + 1), 0 === prevCounter && ($ele.addClass(options.overClass), 
        options.wrap || wrap($this, dragging, this, options.delay, function(dragging, dropzone) {
          options.enter && options.enter.call(dropzone), $ele[$(dragging).index() < $ele.index() ? "after" : "before"](dragging);
        })), !1;
      }).on("dragleave.ui", selector, function() {
        var prevCounter = dragenterData(this);
        return dragenterData(this, prevCounter - 1), dragenterData(this) || ($(this).removeClass(options.overClass), 
        dragenterData(this, !1), options.leave && options.leave.call(this)), !1;
      }).on("drop.ui", selector, function(e) {
        return e.stopPropagation(), e.preventDefault(), this !== dragging ? (options.wrap && wrap($this, dragging, this, options.delay, function(dragging, dropzone) {
          options.sort ? options.sort.call($this, dragging, dropzone) : sort.call($this, dragging, dropzone);
          var data;
          e.originalEvent.dataTransfer && (data = e.originalEvent.dataTransfer.getData("Text")), 
          options.change && options.change.call(dropzone, data);
        }), !1) : void 0;
      }).on("dragover.ui", selector, function(e) {
        return dragging ? (e.stopPropagation(), e.preventDefault(), !1) : !0;
      });
    });
  }, $.fn.dndsortable.defaults = {
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
}), define(function(require) {
  "use strict";
  var $ = require("jquery");
  $.event.special.throttledresize = {
    setup: function() {
      $(this).bind("resize", handler);
    },
    teardown: function() {
      $(this).unbind("resize", handler);
    }
  };
  var heldCall, curr, diff, throttle = 250, handler = function() {
    curr = new Date().getTime(), diff = curr - lastCall, diff >= throttle ? (lastCall = curr, 
    $(this).trigger("throttledresize")) : (heldCall && clearTimeout(heldCall), heldCall = setTimeout(handler, throttle - diff));
  }, lastCall = 0;
});

var TWEEN = TWEEN || function() {
  var _tweens = [];
  return {
    REVISION: "10",
    getAll: function() {
      return _tweens;
    },
    removeAll: function() {
      _tweens = [];
    },
    add: function(tween) {
      _tweens.push(tween);
    },
    remove: function(tween) {
      var i = _tweens.indexOf(tween);
      -1 !== i && _tweens.splice(i, 1);
    },
    update: function(time) {
      var numTweens = _tweens.length;
      if (0 === numTweens) return !1;
      var _tween, i = 0;
      for (time = void 0 !== time ? time : void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now(); numTweens > i; ) _tween = _tweens[i], 
      _tween && _tween.update(time) ? i++ : (_tweens.splice(i, 1), numTweens--);
      return !0;
    }
  };
}();

TWEEN.Tween = function(object) {
  var _object = object, _valuesStart = {}, _valuesEnd = {}, _valuesStartRepeat = {}, _duration = 1e3, _repeat = 0, _delayTime = 0, _startTime = null, _easingFunction = TWEEN.Easing.Linear.None, _interpolationFunction = TWEEN.Interpolation.Linear, _chainedTweens = [], _onStartCallback = null, _onStartCallbackFired = !1, _onUpdateCallback = null, _onCompleteCallback = null;
  for (var field in object) _valuesStart[field] = parseFloat(object[field], 10);
  this.to = function(properties, duration) {
    return void 0 !== duration && (_duration = duration), _valuesEnd = properties, this;
  }, this.start = function(time) {
    TWEEN.add(this), _onStartCallbackFired = !1, _startTime = void 0 !== time ? time : void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now(), 
    _startTime += _delayTime;
    for (var property in _valuesEnd) {
      if (_valuesEnd[property] instanceof Array) {
        if (0 === _valuesEnd[property].length) continue;
        _valuesEnd[property] = [ _object[property] ].concat(_valuesEnd[property]);
      }
      _valuesStart[property] = _object[property], _valuesStart[property] instanceof Array == !1 && (_valuesStart[property] *= 1), 
      _valuesStartRepeat[property] = _valuesStart[property] || 0;
    }
    return this;
  }, this.stop = function() {
    return TWEEN.remove(this), this;
  }, this.delay = function(amount) {
    return _delayTime = amount, this;
  }, this.repeat = function(times) {
    return _repeat = times, this;
  }, this.easing = function(easing) {
    return _easingFunction = easing, this;
  }, this.interpolation = function(interpolation) {
    return _interpolationFunction = interpolation, this;
  }, this.chain = function() {
    return _chainedTweens = arguments, this;
  }, this.onStart = function(callback) {
    return _onStartCallback = callback, this;
  }, this.onUpdate = function(callback) {
    return _onUpdateCallback = callback, this;
  }, this.onComplete = function(callback) {
    return _onCompleteCallback = callback, this;
  }, this.update = function(time) {
    if (_startTime > time) return !0;
    _onStartCallbackFired === !1 && (null !== _onStartCallback && _onStartCallback.call(_object), 
    _onStartCallbackFired = !0);
    var elapsed = (time - _startTime) / _duration;
    elapsed = elapsed > 1 ? 1 : elapsed;
    var value = _easingFunction(elapsed);
    for (var property in _valuesEnd) {
      var start = _valuesStart[property] || 0, end = _valuesEnd[property];
      end instanceof Array ? _object[property] = _interpolationFunction(end, value) : ("string" == typeof end && (end = start + parseFloat(end, 10)), 
      _object[property] = start + (end - start) * value);
    }
    if (null !== _onUpdateCallback && _onUpdateCallback.call(_object, value), 1 == elapsed) {
      if (_repeat > 0) {
        isFinite(_repeat) && _repeat--;
        for (var property in _valuesStartRepeat) "string" == typeof _valuesEnd[property] && (_valuesStartRepeat[property] = _valuesStartRepeat[property] + parseFloat(_valuesEnd[property], 10)), 
        _valuesStart[property] = _valuesStartRepeat[property];
        return _startTime = time + _delayTime, !0;
      }
      null !== _onCompleteCallback && _onCompleteCallback.call(_object);
      for (var i = 0, numChainedTweens = _chainedTweens.length; numChainedTweens > i; i++) _chainedTweens[i].start(time);
      return !1;
    }
    return !0;
  };
}, TWEEN.Easing = {
  Linear: {
    None: function(k) {
      return k;
    }
  },
  Quadratic: {
    In: function(k) {
      return k * k;
    },
    Out: function(k) {
      return k * (2 - k);
    },
    InOut: function(k) {
      return 1 > (k *= 2) ? .5 * k * k : -.5 * (--k * (k - 2) - 1);
    }
  },
  Cubic: {
    In: function(k) {
      return k * k * k;
    },
    Out: function(k) {
      return --k * k * k + 1;
    },
    InOut: function(k) {
      return 1 > (k *= 2) ? .5 * k * k * k : .5 * ((k -= 2) * k * k + 2);
    }
  },
  Quartic: {
    In: function(k) {
      return k * k * k * k;
    },
    Out: function(k) {
      return 1 - --k * k * k * k;
    },
    InOut: function(k) {
      return 1 > (k *= 2) ? .5 * k * k * k * k : -.5 * ((k -= 2) * k * k * k - 2);
    }
  },
  Quintic: {
    In: function(k) {
      return k * k * k * k * k;
    },
    Out: function(k) {
      return --k * k * k * k * k + 1;
    },
    InOut: function(k) {
      return 1 > (k *= 2) ? .5 * k * k * k * k * k : .5 * ((k -= 2) * k * k * k * k + 2);
    }
  },
  Sinusoidal: {
    In: function(k) {
      return 1 - Math.cos(k * Math.PI / 2);
    },
    Out: function(k) {
      return Math.sin(k * Math.PI / 2);
    },
    InOut: function(k) {
      return .5 * (1 - Math.cos(Math.PI * k));
    }
  },
  Exponential: {
    In: function(k) {
      return 0 === k ? 0 : Math.pow(1024, k - 1);
    },
    Out: function(k) {
      return 1 === k ? 1 : 1 - Math.pow(2, -10 * k);
    },
    InOut: function(k) {
      return 0 === k ? 0 : 1 === k ? 1 : 1 > (k *= 2) ? .5 * Math.pow(1024, k - 1) : .5 * (-Math.pow(2, -10 * (k - 1)) + 2);
    }
  },
  Circular: {
    In: function(k) {
      return 1 - Math.sqrt(1 - k * k);
    },
    Out: function(k) {
      return Math.sqrt(1 - --k * k);
    },
    InOut: function(k) {
      return 1 > (k *= 2) ? -.5 * (Math.sqrt(1 - k * k) - 1) : .5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
    }
  },
  Elastic: {
    In: function(k) {
      var s, a = .1, p = .4;
      return 0 === k ? 0 : 1 === k ? 1 : (!a || 1 > a ? (a = 1, s = p / 4) : s = p * Math.asin(1 / a) / (2 * Math.PI), 
      -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * 2 * Math.PI / p)));
    },
    Out: function(k) {
      var s, a = .1, p = .4;
      return 0 === k ? 0 : 1 === k ? 1 : (!a || 1 > a ? (a = 1, s = p / 4) : s = p * Math.asin(1 / a) / (2 * Math.PI), 
      a * Math.pow(2, -10 * k) * Math.sin((k - s) * 2 * Math.PI / p) + 1);
    },
    InOut: function(k) {
      var s, a = .1, p = .4;
      return 0 === k ? 0 : 1 === k ? 1 : (!a || 1 > a ? (a = 1, s = p / 4) : s = p * Math.asin(1 / a) / (2 * Math.PI), 
      1 > (k *= 2) ? -.5 * a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * 2 * Math.PI / p) : .5 * a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * 2 * Math.PI / p) + 1);
    }
  },
  Back: {
    In: function(k) {
      var s = 1.70158;
      return k * k * ((s + 1) * k - s);
    },
    Out: function(k) {
      var s = 1.70158;
      return --k * k * ((s + 1) * k + s) + 1;
    },
    InOut: function(k) {
      var s = 2.5949095;
      return 1 > (k *= 2) ? .5 * k * k * ((s + 1) * k - s) : .5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
    }
  },
  Bounce: {
    In: function(k) {
      return 1 - TWEEN.Easing.Bounce.Out(1 - k);
    },
    Out: function(k) {
      return 1 / 2.75 > k ? 7.5625 * k * k : 2 / 2.75 > k ? 7.5625 * (k -= 1.5 / 2.75) * k + .75 : 2.5 / 2.75 > k ? 7.5625 * (k -= 2.25 / 2.75) * k + .9375 : 7.5625 * (k -= 2.625 / 2.75) * k + .984375;
    },
    InOut: function(k) {
      return .5 > k ? .5 * TWEEN.Easing.Bounce.In(2 * k) : .5 * TWEEN.Easing.Bounce.Out(2 * k - 1) + .5;
    }
  }
}, TWEEN.Interpolation = {
  Linear: function(v, k) {
    var m = v.length - 1, f = m * k, i = Math.floor(f), fn = TWEEN.Interpolation.Utils.Linear;
    return 0 > k ? fn(v[0], v[1], f) : k > 1 ? fn(v[m], v[m - 1], m - f) : fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
  },
  Bezier: function(v, k) {
    var i, b = 0, n = v.length - 1, pw = Math.pow, bn = TWEEN.Interpolation.Utils.Bernstein;
    for (i = 0; n >= i; i++) b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
    return b;
  },
  CatmullRom: function(v, k) {
    var m = v.length - 1, f = m * k, i = Math.floor(f), fn = TWEEN.Interpolation.Utils.CatmullRom;
    return v[0] === v[m] ? (0 > k && (i = Math.floor(f = m * (1 + k))), fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i)) : 0 > k ? v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]) : k > 1 ? v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]) : fn(v[i ? i - 1 : 0], v[i], v[i + 1 > m ? m : i + 1], v[i + 2 > m ? m : i + 2], f - i);
  },
  Utils: {
    Linear: function(p0, p1, t) {
      return (p1 - p0) * t + p0;
    },
    Bernstein: function(n, i) {
      var fc = TWEEN.Interpolation.Utils.Factorial;
      return fc(n) / fc(i) / fc(n - i);
    },
    Factorial: function() {
      var a = [ 1 ];
      return function(n) {
        var i, s = 1;
        if (a[n]) return a[n];
        for (i = n; i > 1; i--) s *= i;
        return a[n] = s;
      };
    }(),
    CatmullRom: function(p0, p1, p2, p3, t) {
      var v0 = .5 * (p2 - p0), v1 = .5 * (p3 - p1), t2 = t * t, t3 = t * t2;
      return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
    }
  }
}, "function" == typeof define && define("tween", function() {
  return TWEEN;
}), define("af", function() {
  "use strict";
  var performanceNow = window.performance && window.performance.now, now = performanceNow ? function() {
    return window.performance.now();
  } : Date.now || function() {
    return new Date().getTime();
  }, r = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame, c = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame;
  if (!r) {
    var prev = 0;
    r = function(callback) {
      var curr = now(), ms = Math.max(0, 16 - (curr - prev)), id = setTimeout(function() {
        callback(curr + ms);
      }, ms);
      return prev = curr + ms, id;
    };
  }
  return c || (c = function(id) {
    clearTimeout(id);
  }), {
    request: r,
    cancel: c
  };
}), define("store", function(require, exports, module) {
  (function() {
    function isLocalStorageNameSupported() {
      try {
        return localStorageName in win && win[localStorageName];
      } catch (err) {
        return !1;
      }
    }
    function isGlobalStorageNameSupported() {
      try {
        return globalStorageName in win && win[globalStorageName] && win[globalStorageName][win.location.hostname];
      } catch (err) {
        return !1;
      }
    }
    function withIEStorage(storeFunction) {
      return function() {
        var args = Array.prototype.slice.call(arguments, 0);
        args.unshift(storage), storageOwner.appendChild(storage), storage.addBehavior("#default#userData"), 
        storage.load(localStorageName);
        var result = storeFunction.apply(store, args);
        return storageOwner.removeChild(storage), result;
      };
    }
    function ieKeyFix(key) {
      return key.replace(forbiddenCharsRegex, "___");
    }
    var storage, store = {}, win = window, doc = win.document, localStorageName = "localStorage", globalStorageName = "globalStorage", namespace = "__storejs__";
    if (store.disabled = !1, store.set = function() {}, store.get = function() {}, store.remove = function() {}, 
    store.clear = function() {}, store.transact = function(key, defaultVal, transactionFn) {
      var val = store.get(key);
      null == transactionFn && (transactionFn = defaultVal, defaultVal = null), val === void 0 && (val = defaultVal || {}), 
      transactionFn(val), store.set(key, val);
    }, store.getAll = function() {}, store.serialize = function(value) {
      return JSON.stringify(value);
    }, store.deserialize = function(value) {
      if ("string" != typeof value) return void 0;
      try {
        return JSON.parse(value);
      } catch (e) {
        return value || void 0;
      }
    }, isLocalStorageNameSupported()) storage = win[localStorageName], store.set = function(key, val) {
      return void 0 === val ? store.remove(key) : (storage.setItem(key, store.serialize(val)), 
      val);
    }, store.get = function(key) {
      return store.deserialize(storage.getItem(key));
    }, store.remove = function(key) {
      storage.removeItem(key);
    }, store.clear = function() {
      storage.clear();
    }, store.getAll = function() {
      for (var ret = {}, i = 0; storage.length > i; ++i) {
        var key = storage.key(i);
        ret[key] = store.get(key);
      }
      return ret;
    }; else if (isGlobalStorageNameSupported()) storage = win[globalStorageName][win.location.hostname], 
    store.set = function(key, val) {
      return void 0 === val ? store.remove(key) : (storage[key] = store.serialize(val), 
      val);
    }, store.get = function(key) {
      return store.deserialize(storage[key] && storage[key].value);
    }, store.remove = function(key) {
      delete storage[key];
    }, store.clear = function() {
      for (var key in storage) delete storage[key];
    }, store.getAll = function() {
      for (var ret = {}, i = 0; storage.length > i; ++i) {
        var key = storage.key(i);
        ret[key] = store.get(key);
      }
      return ret;
    }; else if (doc.documentElement.addBehavior) {
      var storageOwner, storageContainer;
      try {
        storageContainer = new ActiveXObject("htmlfile"), storageContainer.open(), storageContainer.write('<script>document.w=window</script><iframe src="/favicon.ico"></frame>'), 
        storageContainer.close(), storageOwner = storageContainer.w.frames[0].document, 
        storage = storageOwner.createElement("div");
      } catch (e) {
        storage = doc.createElement("div"), storageOwner = doc.body;
      }
      var forbiddenCharsRegex = RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g");
      store.set = withIEStorage(function(storage, key, val) {
        return key = ieKeyFix(key), void 0 === val ? store.remove(key) : (storage.setAttribute(key, store.serialize(val)), 
        storage.save(localStorageName), val);
      }), store.get = withIEStorage(function(storage, key) {
        return key = ieKeyFix(key), store.deserialize(storage.getAttribute(key));
      }), store.remove = withIEStorage(function(storage, key) {
        key = ieKeyFix(key), storage.removeAttribute(key), storage.save(localStorageName);
      }), store.clear = withIEStorage(function(storage) {
        var attributes = storage.XMLDocument.documentElement.attributes;
        storage.load(localStorageName);
        for (var attr, i = 0; attr = attributes[i]; i++) storage.removeAttribute(attr.name);
        storage.save(localStorageName);
      }), store.getAll = withIEStorage(function(storage) {
        var attributes = storage.XMLDocument.documentElement.attributes;
        storage.load(localStorageName);
        for (var attr, ret = {}, i = 0; attr = attributes[i]; ++i) ret[attr] = store.get(attr);
        return ret;
      });
    }
    try {
      store.set(namespace, namespace), store.get(namespace) != namespace && (store.disabled = !0), 
      store.remove(namespace);
    } catch (e) {
      store.disabled = !0;
    }
    store.enabled = !store.disabled, module !== void 0 && "function" != typeof module ? module.exports = store : "function" == typeof define && define.amd ? define(store) : this.store = store;
  })();
}), define("marked", function(require, exports, module) {
  "use strict";
  (function() {
    function outputLink(cap, link) {
      return "!" !== cap[0][0] ? '<a href="' + escape(link.href) + '"' + (link.title ? ' title="' + escape(link.title) + '"' : "") + ">" + inline.lexer(cap[1]) + "</a>" : '<img src="' + escape(link.href) + '" alt="' + escape(cap[1]) + '"' + (link.title ? ' title="' + escape(link.title) + '"' : "") + ">";
    }
    function next() {
      return token = tokens.pop();
    }
    function tok() {
      switch (token.type) {
       case "space":
        return "";

       case "hr":
        return "<hr>\n";

       case "heading":
        return "<h" + token.depth + ">" + inline.lexer(token.text) + "</h" + token.depth + ">\n";

       case "code":
        return options.highlight && (token.code = options.highlight(token.text, token.lang), 
        null != token.code && token.code !== token.text && (token.escaped = !0, token.text = token.code)), 
        token.escaped || (token.text = escape(token.text, !0)), "<pre><code" + (token.lang ? ' class="lang-' + token.lang + '"' : "") + ">" + token.text + "</code></pre>\n";

       case "blockquote_start":
        for (var body = ""; "blockquote_end" !== next().type; ) body += tok();
        return "<blockquote>\n" + body + "</blockquote>\n";

       case "list_start":
        for (var type = token.ordered ? "ol" : "ul", body = ""; "list_end" !== next().type; ) body += tok();
        return "<" + type + ">\n" + body + "</" + type + ">\n";

       case "list_item_start":
        for (var body = ""; "list_item_end" !== next().type; ) body += "text" === token.type ? parseText() : tok();
        return "<li>" + body + "</li>\n";

       case "loose_item_start":
        for (var body = ""; "list_item_end" !== next().type; ) body += tok();
        return "<li>" + body + "</li>\n";

       case "html":
        return options.sanitize ? inline.lexer(token.text) : token.pre || options.pedantic ? token.text : inline.lexer(token.text);

       case "paragraph":
        return "<p>" + inline.lexer(token.text) + "</p>\n";

       case "text":
        return "<p>" + parseText() + "</p>\n";
      }
    }
    function parseText() {
      for (var top, body = token.text; (top = tokens[tokens.length - 1]) && "text" === top.type; ) body += "\n" + next().text;
      return inline.lexer(body);
    }
    function parse(src) {
      tokens = src.reverse();
      for (var out = ""; next(); ) out += tok();
      return tokens = null, token = null, out;
    }
    function escape(html, encode) {
      return html.replace(encode ? /&/g : /&(?!#?\w+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }
    function mangle(text) {
      for (var ch, out = "", l = text.length, i = 0; l > i; i++) ch = text.charCodeAt(i), 
      Math.random() > .5 && (ch = "x" + ch.toString(16)), out += "&#" + ch + ";";
      return out;
    }
    function tag() {
      var tag = "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+";
      return tag;
    }
    function replace(regex, opt) {
      return regex = regex.source, opt = opt || "", function self(name, val) {
        return name ? (regex = regex.replace(name, val.source || val), self) : RegExp(regex, opt);
      };
    }
    function noop() {}
    function marked(src, opt) {
      return setOptions(opt), parse(block.lexer(src));
    }
    function setOptions(opt) {
      opt || (opt = defaults), options !== opt && (options = opt, options.gfm ? (block.fences = block.gfm.fences, 
      block.paragraph = block.gfm.paragraph, inline.text = inline.gfm.text, inline.url = inline.gfm.url) : (block.fences = block.normal.fences, 
      block.paragraph = block.normal.paragraph, inline.text = inline.normal.text, inline.url = inline.normal.url), 
      options.pedantic ? (inline.em = inline.pedantic.em, inline.strong = inline.pedantic.strong) : (inline.em = inline.normal.em, 
      inline.strong = inline.normal.strong));
    }
    var block = {
      newline: /^\n+/,
      code: /^( {4}[^\n]+\n*)+/,
      fences: noop,
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
    block.bullet = /(?:[*+-]|\d+\.)/, block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/, 
    block.item = replace(block.item, "gm")(/bull/g, block.bullet)(), block.list = replace(block.list)(/bull/g, block.bullet)("hr", /\n+(?=(?: *[-*_]){3,} *(?:\n+|$))/)(), 
    block.html = replace(block.html)("comment", /<!--[^\0]*?-->/)("closed", /<(tag)[^\0]+?<\/\1>/)("closing", /<tag(?!:\/|@)\b(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g, tag())(), 
    block.paragraph = function() {
      var paragraph = block.paragraph.source, body = [];
      return function push(rule) {
        return rule = block[rule] ? block[rule].source : rule, body.push(rule.replace(/(^|[^\[])\^/g, "$1")), 
        push;
      }("hr")("heading")("lheading")("blockquote")("<" + tag())("def"), RegExp(paragraph.replace("body", body.join("|")));
    }(), block.normal = {
      fences: block.fences,
      paragraph: block.paragraph
    }, block.gfm = {
      fences: /^ *``` *(\w+)? *\n([^\0]+?)\s*``` *(?:\n+|$)/,
      paragraph: /^/
    }, block.gfm.paragraph = replace(block.paragraph)("(?!", "(?!" + block.gfm.fences.source.replace(/(^|[^\[])\^/g, "$1") + "|")(), 
    block.lexer = function(src) {
      var tokens = [];
      return tokens.links = {}, src = src.replace(/\r\n|\r/g, "\n").replace(/\t/g, "    "), 
      block.token(src, tokens, !0);
    }, block.token = function(src, tokens, top) {
      for (var next, loose, cap, item, space, i, l, src = src.replace(/^ +$/gm, ""); src; ) if ((cap = block.newline.exec(src)) && (src = src.substring(cap[0].length), 
      cap[0].length > 1 && tokens.push({
        type: "space"
      })), cap = block.code.exec(src)) src = src.substring(cap[0].length), cap = cap[0].replace(/^ {4}/gm, ""), 
      tokens.push({
        type: "code",
        text: options.pedantic ? cap : cap.replace(/\n+$/, "")
      }); else if (cap = block.fences.exec(src)) src = src.substring(cap[0].length), tokens.push({
        type: "code",
        lang: cap[1],
        text: cap[2]
      }); else if (cap = block.heading.exec(src)) src = src.substring(cap[0].length), 
      tokens.push({
        type: "heading",
        depth: cap[1].length,
        text: cap[2]
      }); else if (cap = block.lheading.exec(src)) src = src.substring(cap[0].length), 
      tokens.push({
        type: "heading",
        depth: "=" === cap[2] ? 1 : 2,
        text: cap[1]
      }); else if (cap = block.hr.exec(src)) src = src.substring(cap[0].length), tokens.push({
        type: "hr"
      }); else if (cap = block.blockquote.exec(src)) src = src.substring(cap[0].length), 
      tokens.push({
        type: "blockquote_start"
      }), cap = cap[0].replace(/^ *> ?/gm, ""), block.token(cap, tokens, top), tokens.push({
        type: "blockquote_end"
      }); else if (cap = block.list.exec(src)) {
        for (src = src.substring(cap[0].length), tokens.push({
          type: "list_start",
          ordered: isFinite(cap[2])
        }), cap = cap[0].match(block.item), next = !1, l = cap.length, i = 0; l > i; i++) item = cap[i], 
        space = item.length, item = item.replace(/^ *([*+-]|\d+\.) +/, ""), ~item.indexOf("\n ") && (space -= item.length, 
        item = options.pedantic ? item.replace(/^ {1,4}/gm, "") : item.replace(RegExp("^ {1," + space + "}", "gm"), "")), 
        loose = next || /\n\n(?!\s*$)/.test(item), i !== l - 1 && (next = "\n" === item[item.length - 1], 
        loose || (loose = next)), tokens.push({
          type: loose ? "loose_item_start" : "list_item_start"
        }), block.token(item, tokens), tokens.push({
          type: "list_item_end"
        });
        tokens.push({
          type: "list_end"
        });
      } else (cap = block.html.exec(src)) ? (src = src.substring(cap[0].length), tokens.push({
        type: "html",
        pre: "pre" === cap[1],
        text: cap[0]
      })) : top && (cap = block.def.exec(src)) ? (src = src.substring(cap[0].length), 
      tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      }) : top && (cap = block.paragraph.exec(src)) ? (src = src.substring(cap[0].length), 
      tokens.push({
        type: "paragraph",
        text: cap[0]
      })) : (cap = block.text.exec(src)) && (src = src.substring(cap[0].length), tokens.push({
        type: "text",
        text: cap[0]
      }));
      return tokens;
    };
    var inline = {
      escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
      autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
      url: noop,
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
    inline._linkInside = /(?:\[[^\]]*\]|[^\]]|\](?=[^\[]*\]))*/, inline._linkHref = /\s*<?([^\s]*?)>?(?:\s+['"]([^\0]*?)['"])?\s*/, 
    inline.link = replace(inline.link)("inside", inline._linkInside)("href", inline._linkHref)(), 
    inline.reflink = replace(inline.reflink)("inside", inline._linkInside)(), inline.normal = {
      url: inline.url,
      strong: inline.strong,
      em: inline.em,
      text: inline.text
    }, inline.pedantic = {
      strong: /^__(?=\S)([^\0]*?\S)__(?!_)|^\*\*(?=\S)([^\0]*?\S)\*\*(?!\*)/,
      em: /^_(?=\S)([^\0]*?\S)_(?!_)|^\*(?=\S)([^\0]*?\S)\*(?!\*)/
    }, inline.gfm = {
      url: /^(https?:\/\/[^\s]+[^.,:;"')\]\s])/,
      text: /^[^\0]+?(?=[\\<!\[_*`]|https?:\/\/| {2,}\n|$)/
    }, inline.lexer = function(src) {
      for (var link, text, href, cap, out = "", links = tokens.links; src; ) if (cap = inline.escape.exec(src)) src = src.substring(cap[0].length), 
      out += cap[1]; else if (cap = inline.autolink.exec(src)) src = src.substring(cap[0].length), 
      "@" === cap[2] ? (text = ":" === cap[1][6] ? mangle(cap[1].substring(7)) : mangle(cap[1]), 
      href = mangle("mailto:") + text) : (text = escape(cap[1]), href = text), out += '<a href="' + href + '">' + text + "</a>"; else if (cap = inline.url.exec(src)) src = src.substring(cap[0].length), 
      text = escape(cap[1]), href = text, out += '<a href="' + href + '">' + text + "</a>"; else if (cap = inline.tag.exec(src)) src = src.substring(cap[0].length), 
      out += options.sanitize ? escape(cap[0]) : cap[0]; else if (cap = inline.link.exec(src)) src = src.substring(cap[0].length), 
      out += outputLink(cap, {
        href: cap[2],
        title: cap[3]
      }); else if ((cap = inline.reflink.exec(src)) || (cap = inline.nolink.exec(src))) {
        if (src = src.substring(cap[0].length), link = (cap[2] || cap[1]).replace(/\s+/g, " "), 
        link = links[link.toLowerCase()], !link || !link.href) {
          out += cap[0][0], src = cap[0].substring(1) + src;
          continue;
        }
        out += outputLink(cap, link);
      } else (cap = inline.strong.exec(src)) ? (src = src.substring(cap[0].length), out += "<strong>" + inline.lexer(cap[2] || cap[1]) + "</strong>") : (cap = inline.em.exec(src)) ? (src = src.substring(cap[0].length), 
      out += "<em>" + inline.lexer(cap[2] || cap[1]) + "</em>") : (cap = inline.code.exec(src)) ? (src = src.substring(cap[0].length), 
      out += "<code>" + escape(cap[2], !0) + "</code>") : (cap = inline.br.exec(src)) ? (src = src.substring(cap[0].length), 
      out += "<br>") : (cap = inline.text.exec(src)) && (src = src.substring(cap[0].length), 
      out += escape(cap[0]));
      return out;
    };
    var tokens, token;
    noop.exec = noop;
    var options, defaults;
    marked.options = marked.setOptions = function(opt) {
      return defaults = opt, setOptions(opt), marked;
    }, marked.setOptions({
      gfm: !0,
      pedantic: !1,
      sanitize: !1,
      highlight: null
    }), marked.parser = function(src, opt) {
      return setOptions(opt), parse(src);
    }, marked.lexer = function(src, opt) {
      return setOptions(opt), block.lexer(src);
    }, marked.parse = marked, module !== void 0 ? module.exports = marked : this.marked = marked;
  }).call(function() {
    return this || ("undefined" != typeof window ? window : global);
  }());
}), define("handlebars", function(require, exports, module) {
  this.Handlebars = {}, function(Handlebars) {
    Handlebars.VERSION = "1.0.rc.1", Handlebars.helpers = {}, Handlebars.partials = {}, 
    Handlebars.registerHelper = function(name, fn, inverse) {
      inverse && (fn.not = inverse), this.helpers[name] = fn;
    }, Handlebars.registerPartial = function(name, str) {
      this.partials[name] = str;
    }, Handlebars.registerHelper("helperMissing", function(arg) {
      if (2 === arguments.length) return void 0;
      throw Error("Could not find property '" + arg + "'");
    });
    var toString = Object.prototype.toString, functionType = "[object Function]";
    Handlebars.registerHelper("blockHelperMissing", function(context, options) {
      var inverse = options.inverse || function() {}, fn = options.fn, type = toString.call(context);
      return type === functionType && (context = context.call(this)), context === !0 ? fn(this) : context === !1 || null == context ? inverse(this) : "[object Array]" === type ? context.length > 0 ? Handlebars.helpers.each(context, options) : inverse(this) : fn(context);
    }), Handlebars.K = function() {}, Handlebars.createFrame = Object.create || function(object) {
      Handlebars.K.prototype = object;
      var obj = new Handlebars.K();
      return Handlebars.K.prototype = null, obj;
    }, Handlebars.registerHelper("each", function(context, options) {
      var data, fn = options.fn, inverse = options.inverse, ret = "";
      if (options.data && (data = Handlebars.createFrame(options.data)), context && context.length > 0) for (var i = 0, j = context.length; j > i; i++) data && (data.index = i), 
      ret += fn(context[i], {
        data: data
      }); else ret = inverse(this);
      return ret;
    }), Handlebars.registerHelper("if", function(context, options) {
      var type = toString.call(context);
      return type === functionType && (context = context.call(this)), !context || Handlebars.Utils.isEmpty(context) ? options.inverse(this) : options.fn(this);
    }), Handlebars.registerHelper("unless", function(context, options) {
      var fn = options.fn, inverse = options.inverse;
      return options.fn = inverse, options.inverse = fn, Handlebars.helpers["if"].call(this, context, options);
    }), Handlebars.registerHelper("with", function(context, options) {
      return options.fn(context);
    }), Handlebars.registerHelper("log", function(context) {
      Handlebars.log(context);
    });
  }(this.Handlebars);
  var handlebars = function() {
    function Parser() {
      this.yy = {};
    }
    var parser = {
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
      performAction: function(yytext, yyleng, yylineno, yy, yystate, $$) {
        var $0 = $$.length - 1;
        switch (yystate) {
         case 1:
          return $$[$0 - 1];

         case 2:
          this.$ = new yy.ProgramNode($$[$0 - 2], $$[$0]);
          break;

         case 3:
          this.$ = new yy.ProgramNode($$[$0]);
          break;

         case 4:
          this.$ = new yy.ProgramNode([]);
          break;

         case 5:
          this.$ = [ $$[$0] ];
          break;

         case 6:
          $$[$0 - 1].push($$[$0]), this.$ = $$[$0 - 1];
          break;

         case 7:
          this.$ = new yy.BlockNode($$[$0 - 2], $$[$0 - 1].inverse, $$[$0 - 1], $$[$0]);
          break;

         case 8:
          this.$ = new yy.BlockNode($$[$0 - 2], $$[$0 - 1], $$[$0 - 1].inverse, $$[$0]);
          break;

         case 9:
          this.$ = $$[$0];
          break;

         case 10:
          this.$ = $$[$0];
          break;

         case 11:
          this.$ = new yy.ContentNode($$[$0]);
          break;

         case 12:
          this.$ = new yy.CommentNode($$[$0]);
          break;

         case 13:
          this.$ = new yy.MustacheNode($$[$0 - 1][0], $$[$0 - 1][1]);
          break;

         case 14:
          this.$ = new yy.MustacheNode($$[$0 - 1][0], $$[$0 - 1][1]);
          break;

         case 15:
          this.$ = $$[$0 - 1];
          break;

         case 16:
          this.$ = new yy.MustacheNode($$[$0 - 1][0], $$[$0 - 1][1]);
          break;

         case 17:
          this.$ = new yy.MustacheNode($$[$0 - 1][0], $$[$0 - 1][1], !0);
          break;

         case 18:
          this.$ = new yy.PartialNode($$[$0 - 1]);
          break;

         case 19:
          this.$ = new yy.PartialNode($$[$0 - 2], $$[$0 - 1]);
          break;

         case 20:
          break;

         case 21:
          this.$ = [ [ $$[$0 - 2] ].concat($$[$0 - 1]), $$[$0] ];
          break;

         case 22:
          this.$ = [ [ $$[$0 - 1] ].concat($$[$0]), null ];
          break;

         case 23:
          this.$ = [ [ $$[$0 - 1] ], $$[$0] ];
          break;

         case 24:
          this.$ = [ [ $$[$0] ], null ];
          break;

         case 25:
          this.$ = [ [ new yy.DataNode($$[$0]) ], null ];
          break;

         case 26:
          $$[$0 - 1].push($$[$0]), this.$ = $$[$0 - 1];
          break;

         case 27:
          this.$ = [ $$[$0] ];
          break;

         case 28:
          this.$ = $$[$0];
          break;

         case 29:
          this.$ = new yy.StringNode($$[$0]);
          break;

         case 30:
          this.$ = new yy.IntegerNode($$[$0]);
          break;

         case 31:
          this.$ = new yy.BooleanNode($$[$0]);
          break;

         case 32:
          this.$ = new yy.DataNode($$[$0]);
          break;

         case 33:
          this.$ = new yy.HashNode($$[$0]);
          break;

         case 34:
          $$[$0 - 1].push($$[$0]), this.$ = $$[$0 - 1];
          break;

         case 35:
          this.$ = [ $$[$0] ];
          break;

         case 36:
          this.$ = [ $$[$0 - 2], $$[$0] ];
          break;

         case 37:
          this.$ = [ $$[$0 - 2], new yy.StringNode($$[$0]) ];
          break;

         case 38:
          this.$ = [ $$[$0 - 2], new yy.IntegerNode($$[$0]) ];
          break;

         case 39:
          this.$ = [ $$[$0 - 2], new yy.BooleanNode($$[$0]) ];
          break;

         case 40:
          this.$ = [ $$[$0 - 2], new yy.DataNode($$[$0]) ];
          break;

         case 41:
          this.$ = new yy.IdNode($$[$0]);
          break;

         case 42:
          $$[$0 - 2].push($$[$0]), this.$ = $$[$0 - 2];
          break;

         case 43:
          this.$ = [ $$[$0] ];
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
      parseError: function(str) {
        throw Error(str);
      },
      parse: function(input) {
        function lex() {
          var token;
          return token = self.lexer.lex() || 1, "number" != typeof token && (token = self.symbols_[token] || token), 
          token;
        }
        var self = this, stack = [ 0 ], vstack = [ null ], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0;
        this.lexer.setInput(input), this.lexer.yy = this.yy, this.yy.lexer = this.lexer, 
        this.yy.parser = this, this.lexer.yylloc === void 0 && (this.lexer.yylloc = {});
        var yyloc = this.lexer.yylloc;
        lstack.push(yyloc);
        var ranges = this.lexer.options && this.lexer.options.ranges;
        "function" == typeof this.yy.parseError && (this.parseError = this.yy.parseError);
        for (var symbol, preErrorSymbol, state, action, r, p, len, newState, expected, yyval = {}; ;) {
          if (state = stack[stack.length - 1], this.defaultActions[state] ? action = this.defaultActions[state] : ((null === symbol || symbol === void 0) && (symbol = lex()), 
          action = table[state] && table[state][symbol]), action === void 0 || !action.length || !action[0]) {
            var errStr = "";
            if (!recovering) {
              expected = [];
              for (p in table[state]) this.terminals_[p] && p > 2 && expected.push("'" + this.terminals_[p] + "'");
              errStr = this.lexer.showPosition ? "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'" : "Parse error on line " + (yylineno + 1) + ": Unexpected " + (1 == symbol ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'"), 
              this.parseError(errStr, {
                text: this.lexer.match,
                token: this.terminals_[symbol] || symbol,
                line: this.lexer.yylineno,
                loc: yyloc,
                expected: expected
              });
            }
          }
          if (action[0] instanceof Array && action.length > 1) throw Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
          switch (action[0]) {
           case 1:
            stack.push(symbol), vstack.push(this.lexer.yytext), lstack.push(this.lexer.yylloc), 
            stack.push(action[1]), symbol = null, preErrorSymbol ? (symbol = preErrorSymbol, 
            preErrorSymbol = null) : (yyleng = this.lexer.yyleng, yytext = this.lexer.yytext, 
            yylineno = this.lexer.yylineno, yyloc = this.lexer.yylloc, recovering > 0 && recovering--);
            break;

           case 2:
            if (len = this.productions_[action[1]][1], yyval.$ = vstack[vstack.length - len], 
            yyval._$ = {
              first_line: lstack[lstack.length - (len || 1)].first_line,
              last_line: lstack[lstack.length - 1].last_line,
              first_column: lstack[lstack.length - (len || 1)].first_column,
              last_column: lstack[lstack.length - 1].last_column
            }, ranges && (yyval._$.range = [ lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1] ]), 
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack), 
            r !== void 0) return r;
            len && (stack = stack.slice(0, 2 * -1 * len), vstack = vstack.slice(0, -1 * len), 
            lstack = lstack.slice(0, -1 * len)), stack.push(this.productions_[action[1]][0]), 
            vstack.push(yyval.$), lstack.push(yyval._$), newState = table[stack[stack.length - 2]][stack[stack.length - 1]], 
            stack.push(newState);
            break;

           case 3:
            return !0;
          }
        }
        return !0;
      }
    }, lexer = function() {
      var lexer = {
        EOF: 1,
        parseError: function(str, hash) {
          if (!this.yy.parser) throw Error(str);
          this.yy.parser.parseError(str, hash);
        },
        setInput: function(input) {
          return this._input = input, this._more = this._less = this.done = !1, this.yylineno = this.yyleng = 0, 
          this.yytext = this.matched = this.match = "", this.conditionStack = [ "INITIAL" ], 
          this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
          }, this.options.ranges && (this.yylloc.range = [ 0, 0 ]), this.offset = 0, this;
        },
        input: function() {
          var ch = this._input[0];
          this.yytext += ch, this.yyleng++, this.offset++, this.match += ch, this.matched += ch;
          var lines = ch.match(/(?:\r\n?|\n).*/g);
          return lines ? (this.yylineno++, this.yylloc.last_line++) : this.yylloc.last_column++, 
          this.options.ranges && this.yylloc.range[1]++, this._input = this._input.slice(1), 
          ch;
        },
        unput: function(ch) {
          var len = ch.length, lines = ch.split(/(?:\r\n?|\n)/g);
          this._input = ch + this._input, this.yytext = this.yytext.substr(0, this.yytext.length - len - 1), 
          this.offset -= len;
          var oldLines = this.match.split(/(?:\r\n?|\n)/g);
          this.match = this.match.substr(0, this.match.length - 1), this.matched = this.matched.substr(0, this.matched.length - 1), 
          lines.length - 1 && (this.yylineno -= lines.length - 1);
          var r = this.yylloc.range;
          return this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
          }, this.options.ranges && (this.yylloc.range = [ r[0], r[0] + this.yyleng - len ]), 
          this;
        },
        more: function() {
          return this._more = !0, this;
        },
        less: function(n) {
          this.unput(this.match.slice(n));
        },
        pastInput: function() {
          var past = this.matched.substr(0, this.matched.length - this.match.length);
          return (past.length > 20 ? "..." : "") + past.substr(-20).replace(/\n/g, "");
        },
        upcomingInput: function() {
          var next = this.match;
          return 20 > next.length && (next += this._input.substr(0, 20 - next.length)), (next.substr(0, 20) + (next.length > 20 ? "..." : "")).replace(/\n/g, "");
        },
        showPosition: function() {
          var pre = this.pastInput(), c = Array(pre.length + 1).join("-");
          return pre + this.upcomingInput() + "\n" + c + "^";
        },
        next: function() {
          if (this.done) return this.EOF;
          this._input || (this.done = !0);
          var token, match, tempMatch, index, lines;
          this._more || (this.yytext = "", this.match = "");
          for (var rules = this._currentRules(), i = 0; rules.length > i && (tempMatch = this._input.match(this.rules[rules[i]]), 
          !tempMatch || match && !(tempMatch[0].length > match[0].length) || (match = tempMatch, 
          index = i, this.options.flex)); i++) ;
          return match ? (lines = match[0].match(/(?:\r\n?|\n).*/g), lines && (this.yylineno += lines.length), 
          this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
          }, this.yytext += match[0], this.match += match[0], this.matches = match, this.yyleng = this.yytext.length, 
          this.options.ranges && (this.yylloc.range = [ this.offset, this.offset += this.yyleng ]), 
          this._more = !1, this._input = this._input.slice(match[0].length), this.matched += match[0], 
          token = this.performAction.call(this, this.yy, this, rules[index], this.conditionStack[this.conditionStack.length - 1]), 
          this.done && this._input && (this.done = !1), token ? token : void 0) : "" === this._input ? this.EOF : this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
            text: "",
            token: null,
            line: this.yylineno
          });
        },
        lex: function() {
          var r = this.next();
          return r !== void 0 ? r : this.lex();
        },
        begin: function(condition) {
          this.conditionStack.push(condition);
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
        pushState: function(condition) {
          this.begin(condition);
        }
      };
      return lexer.options = {}, lexer.performAction = function(yy, yy_, $avoiding_name_collisions, YY_START) {
        switch ($avoiding_name_collisions) {
         case 0:
          if ("\\" !== yy_.yytext.slice(-1) && this.begin("mu"), "\\" === yy_.yytext.slice(-1) && (yy_.yytext = yy_.yytext.substr(0, yy_.yyleng - 1), 
          this.begin("emu")), yy_.yytext) return 14;
          break;

         case 1:
          return 14;

         case 2:
          return "\\" !== yy_.yytext.slice(-1) && this.popState(), "\\" === yy_.yytext.slice(-1) && (yy_.yytext = yy_.yytext.substr(0, yy_.yyleng - 1)), 
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
          return yy_.yytext = yy_.yytext.substr(3, yy_.yyleng - 5), this.popState(), 15;

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
          return yy_.yytext = yy_.yytext.substr(1, yy_.yyleng - 2).replace(/\\"/g, '"'), 29;

         case 20:
          return yy_.yytext = yy_.yytext.substr(1, yy_.yyleng - 2).replace(/\\"/g, '"'), 29;

         case 21:
          return yy_.yytext = yy_.yytext.substr(1), 27;

         case 22:
          return 31;

         case 23:
          return 31;

         case 24:
          return 30;

         case 25:
          return 34;

         case 26:
          return yy_.yytext = yy_.yytext.substr(1, yy_.yyleng - 2), 34;

         case 27:
          return "INVALID";

         case 28:
          return 5;
        }
      }, lexer.rules = [ /^(?:[^\x00]*?(?=(\{\{)))/, /^(?:[^\x00]+)/, /^(?:[^\x00]{2,}?(?=(\{\{|$)))/, /^(?:\{\{>)/, /^(?:\{\{#)/, /^(?:\{\{\/)/, /^(?:\{\{\^)/, /^(?:\{\{\s*else\b)/, /^(?:\{\{\{)/, /^(?:\{\{&)/, /^(?:\{\{![\s\S]*?\}\})/, /^(?:\{\{)/, /^(?:=)/, /^(?:\.(?=[} ]))/, /^(?:\.\.)/, /^(?:[\/.])/, /^(?:\s+)/, /^(?:\}\}\})/, /^(?:\}\})/, /^(?:"(\\["]|[^"])*")/, /^(?:'(\\[']|[^'])*')/, /^(?:@[a-zA-Z]+)/, /^(?:true(?=[}\s]))/, /^(?:false(?=[}\s]))/, /^(?:[0-9]+(?=[}\s]))/, /^(?:[a-zA-Z0-9_$-]+(?=[=}\s\/.]))/, /^(?:\[[^\]]*\])/, /^(?:.)/, /^(?:$)/ ], 
      lexer.conditions = {
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
      }, lexer;
    }();
    return parser.lexer = lexer, Parser.prototype = parser, parser.Parser = Parser, 
    new Parser();
  }();
  return require !== void 0 && exports !== void 0 && (exports.parser = handlebars, 
  exports.Parser = handlebars.Parser, exports.parse = function() {
    return handlebars.parse.apply(handlebars, arguments);
  }, exports.main = function(args) {
    if (!args[1]) throw Error("Usage: " + args[0] + " FILE");
    var source;
    return source = "undefined" != typeof process ? require("fs").readFileSync(require("path").resolve(args[1]), "utf8") : require("file").path(require("file").cwd()).join(args[1]).read({
      charset: "utf-8"
    }), exports.parser.parse(source);
  }, module !== void 0 && require.main === module && exports.main("undefined" != typeof process ? process.argv.slice(1) : require("system").args)), 
  Handlebars.Parser = handlebars, Handlebars.parse = function(string) {
    return Handlebars.Parser.yy = Handlebars.AST, Handlebars.Parser.parse(string);
  }, Handlebars.print = function(ast) {
    return new Handlebars.PrintVisitor().accept(ast);
  }, Handlebars.logger = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    level: 3,
    log: function() {}
  }, Handlebars.log = function(level, str) {
    Handlebars.logger.log(level, str);
  }, function() {
    Handlebars.AST = {}, Handlebars.AST.ProgramNode = function(statements, inverse) {
      this.type = "program", this.statements = statements, inverse && (this.inverse = new Handlebars.AST.ProgramNode(inverse));
    }, Handlebars.AST.MustacheNode = function(rawParams, hash, unescaped) {
      this.type = "mustache", this.escaped = !unescaped, this.hash = hash;
      var id = this.id = rawParams[0], params = this.params = rawParams.slice(1), eligibleHelper = this.eligibleHelper = id.isSimple;
      this.isHelper = eligibleHelper && (params.length || hash);
    }, Handlebars.AST.PartialNode = function(id, context) {
      this.type = "partial", this.id = id, this.context = context;
    };
    var verifyMatch = function(open, close) {
      if (open.original !== close.original) throw new Handlebars.Exception(open.original + " doesn't match " + close.original);
    };
    Handlebars.AST.BlockNode = function(mustache, program, inverse, close) {
      verifyMatch(mustache.id, close), this.type = "block", this.mustache = mustache, 
      this.program = program, this.inverse = inverse, this.inverse && !this.program && (this.isInverse = !0);
    }, Handlebars.AST.ContentNode = function(string) {
      this.type = "content", this.string = string;
    }, Handlebars.AST.HashNode = function(pairs) {
      this.type = "hash", this.pairs = pairs;
    }, Handlebars.AST.IdNode = function(parts) {
      this.type = "ID", this.original = parts.join(".");
      for (var dig = [], depth = 0, i = 0, l = parts.length; l > i; i++) {
        var part = parts[i];
        ".." === part ? depth++ : "." === part || "this" === part ? this.isScoped = !0 : dig.push(part);
      }
      this.parts = dig, this.string = dig.join("."), this.depth = depth, this.isSimple = 1 === parts.length && !this.isScoped && 0 === depth;
    }, Handlebars.AST.DataNode = function(id) {
      this.type = "DATA", this.id = id;
    }, Handlebars.AST.StringNode = function(string) {
      this.type = "STRING", this.string = string;
    }, Handlebars.AST.IntegerNode = function(integer) {
      this.type = "INTEGER", this.integer = integer;
    }, Handlebars.AST.BooleanNode = function(bool) {
      this.type = "BOOLEAN", this.bool = bool;
    }, Handlebars.AST.CommentNode = function(comment) {
      this.type = "comment", this.comment = comment;
    };
  }(), Handlebars.Exception = function() {
    var tmp = Error.prototype.constructor.apply(this, arguments);
    for (var p in tmp) tmp.hasOwnProperty(p) && (this[p] = tmp[p]);
    this.message = tmp.message;
  }, Handlebars.Exception.prototype = Error(), Handlebars.SafeString = function(string) {
    this.string = string;
  }, Handlebars.SafeString.prototype.toString = function() {
    return "" + this.string;
  }, function() {
    var escape = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "`": "&#x60;"
    }, badChars = /[&<>"'`]/g, possible = /[&<>"'`]/, escapeChar = function(chr) {
      return escape[chr] || "&amp;";
    };
    Handlebars.Utils = {
      escapeExpression: function(string) {
        return string instanceof Handlebars.SafeString ? "" + string : null == string || string === !1 ? "" : possible.test(string) ? string.replace(badChars, escapeChar) : string;
      },
      isEmpty: function(value) {
        return value === void 0 ? !0 : null === value ? !0 : value === !1 ? !0 : "[object Array]" === Object.prototype.toString.call(value) && 0 === value.length ? !0 : !1;
      }
    };
  }(), Handlebars.Compiler = function() {}, Handlebars.JavaScriptCompiler = function() {}, 
  function(Compiler, JavaScriptCompiler) {
    Compiler.prototype = {
      compiler: Compiler,
      disassemble: function() {
        for (var opcode, params, param, opcodes = this.opcodes, out = [], i = 0, l = opcodes.length; l > i; i++) if (opcode = opcodes[i], 
        "DECLARE" === opcode.opcode) out.push("DECLARE " + opcode.name + "=" + opcode.value); else {
          params = [];
          for (var j = 0; opcode.args.length > j; j++) param = opcode.args[j], "string" == typeof param && (param = '"' + param.replace("\n", "\\n") + '"'), 
          params.push(param);
          out.push(opcode.opcode + " " + params.join(" "));
        }
        return out.join("\n");
      },
      guid: 0,
      compile: function(program, options) {
        this.children = [], this.depths = {
          list: []
        }, this.options = options;
        var knownHelpers = this.options.knownHelpers;
        if (this.options.knownHelpers = {
          helperMissing: !0,
          blockHelperMissing: !0,
          each: !0,
          "if": !0,
          unless: !0,
          "with": !0,
          log: !0
        }, knownHelpers) for (var name in knownHelpers) this.options.knownHelpers[name] = knownHelpers[name];
        return this.program(program);
      },
      accept: function(node) {
        return this[node.type](node);
      },
      program: function(program) {
        var statement, statements = program.statements;
        this.opcodes = [];
        for (var i = 0, l = statements.length; l > i; i++) statement = statements[i], this[statement.type](statement);
        return this.isSimple = 1 === l, this.depths.list = this.depths.list.sort(function(a, b) {
          return a - b;
        }), this;
      },
      compileProgram: function(program) {
        var depth, result = new this.compiler().compile(program, this.options), guid = this.guid++;
        this.usePartial = this.usePartial || result.usePartial, this.children[guid] = result;
        for (var i = 0, l = result.depths.list.length; l > i; i++) depth = result.depths.list[i], 
        2 > depth || this.addDepth(depth - 1);
        return guid;
      },
      block: function(block) {
        var mustache = block.mustache, program = block.program, inverse = block.inverse;
        program && (program = this.compileProgram(program)), inverse && (inverse = this.compileProgram(inverse));
        var type = this.classifyMustache(mustache);
        "helper" === type ? this.helperMustache(mustache, program, inverse) : "simple" === type ? (this.simpleMustache(mustache), 
        this.opcode("pushProgram", program), this.opcode("pushProgram", inverse), this.opcode("pushLiteral", "{}"), 
        this.opcode("blockValue")) : (this.ambiguousMustache(mustache, program, inverse), 
        this.opcode("pushProgram", program), this.opcode("pushProgram", inverse), this.opcode("pushLiteral", "{}"), 
        this.opcode("ambiguousBlockValue")), this.opcode("append");
      },
      hash: function(hash) {
        var pair, val, pairs = hash.pairs;
        this.opcode("push", "{}");
        for (var i = 0, l = pairs.length; l > i; i++) pair = pairs[i], val = pair[1], this.accept(val), 
        this.opcode("assignToHash", pair[0]);
      },
      partial: function(partial) {
        var id = partial.id;
        this.usePartial = !0, partial.context ? this.ID(partial.context) : this.opcode("push", "depth0"), 
        this.opcode("invokePartial", id.original), this.opcode("append");
      },
      content: function(content) {
        this.opcode("appendContent", content.string);
      },
      mustache: function(mustache) {
        var options = this.options, type = this.classifyMustache(mustache);
        "simple" === type ? this.simpleMustache(mustache) : "helper" === type ? this.helperMustache(mustache) : this.ambiguousMustache(mustache), 
        mustache.escaped && !options.noEscape ? this.opcode("appendEscaped") : this.opcode("append");
      },
      ambiguousMustache: function(mustache, program, inverse) {
        var id = mustache.id, name = id.parts[0];
        this.opcode("getContext", id.depth), this.opcode("pushProgram", program), this.opcode("pushProgram", inverse), 
        this.opcode("invokeAmbiguous", name);
      },
      simpleMustache: function(mustache) {
        var id = mustache.id;
        "DATA" === id.type ? this.DATA(id) : id.parts.length ? this.ID(id) : (this.addDepth(id.depth), 
        this.opcode("getContext", id.depth), this.opcode("pushContext")), this.opcode("resolvePossibleLambda");
      },
      helperMustache: function(mustache, program, inverse) {
        var params = this.setupFullMustacheParams(mustache, program, inverse), name = mustache.id.parts[0];
        if (this.options.knownHelpers[name]) this.opcode("invokeKnownHelper", params.length, name); else {
          if (this.knownHelpersOnly) throw Error("You specified knownHelpersOnly, but used the unknown helper " + name);
          this.opcode("invokeHelper", params.length, name);
        }
      },
      ID: function(id) {
        this.addDepth(id.depth), this.opcode("getContext", id.depth);
        var name = id.parts[0];
        name ? this.opcode("lookupOnContext", id.parts[0]) : this.opcode("pushContext");
        for (var i = 1, l = id.parts.length; l > i; i++) this.opcode("lookup", id.parts[i]);
      },
      DATA: function(data) {
        this.options.data = !0, this.opcode("lookupData", data.id);
      },
      STRING: function(string) {
        this.opcode("pushString", string.string);
      },
      INTEGER: function(integer) {
        this.opcode("pushLiteral", integer.integer);
      },
      BOOLEAN: function(bool) {
        this.opcode("pushLiteral", bool.bool);
      },
      comment: function() {},
      opcode: function(name) {
        this.opcodes.push({
          opcode: name,
          args: [].slice.call(arguments, 1)
        });
      },
      declare: function(name, value) {
        this.opcodes.push({
          opcode: "DECLARE",
          name: name,
          value: value
        });
      },
      addDepth: function(depth) {
        if (isNaN(depth)) throw Error("EWOT");
        0 !== depth && (this.depths[depth] || (this.depths[depth] = !0, this.depths.list.push(depth)));
      },
      classifyMustache: function(mustache) {
        var isHelper = mustache.isHelper, isEligible = mustache.eligibleHelper, options = this.options;
        if (isEligible && !isHelper) {
          var name = mustache.id.parts[0];
          options.knownHelpers[name] ? isHelper = !0 : options.knownHelpersOnly && (isEligible = !1);
        }
        return isHelper ? "helper" : isEligible ? "ambiguous" : "simple";
      },
      pushParams: function(params) {
        for (var param, i = params.length; i--; ) param = params[i], this.options.stringParams ? (param.depth && this.addDepth(param.depth), 
        this.opcode("getContext", param.depth || 0), this.opcode("pushStringParam", param.string)) : this[param.type](param);
      },
      setupMustacheParams: function(mustache) {
        var params = mustache.params;
        return this.pushParams(params), mustache.hash ? this.hash(mustache.hash) : this.opcode("pushLiteral", "{}"), 
        params;
      },
      setupFullMustacheParams: function(mustache, program, inverse) {
        var params = mustache.params;
        return this.pushParams(params), this.opcode("pushProgram", program), this.opcode("pushProgram", inverse), 
        mustache.hash ? this.hash(mustache.hash) : this.opcode("pushLiteral", "{}"), params;
      }
    };
    var Literal = function(value) {
      this.value = value;
    };
    JavaScriptCompiler.prototype = {
      nameLookup: function(parent, name) {
        return /^[0-9]+$/.test(name) ? parent + "[" + name + "]" : JavaScriptCompiler.isValidJavaScriptVariableName(name) ? parent + "." + name : parent + "['" + name + "']";
      },
      appendToBuffer: function(string) {
        return this.environment.isSimple ? "return " + string + ";" : "buffer += " + string + ";";
      },
      initializeBuffer: function() {
        return this.quotedString("");
      },
      namespace: "Handlebars",
      compile: function(environment, options, context, asObject) {
        this.environment = environment, this.options = options || {}, Handlebars.log(Handlebars.logger.DEBUG, this.environment.disassemble() + "\n\n"), 
        this.name = this.environment.name, this.isChild = !!context, this.context = context || {
          programs: [],
          aliases: {}
        }, this.preamble(), this.stackSlot = 0, this.stackVars = [], this.registers = {
          list: []
        }, this.compileStack = [], this.compileChildren(environment, options);
        var opcode, opcodes = environment.opcodes;
        for (this.i = 0, l = opcodes.length; l > this.i; this.i++) opcode = opcodes[this.i], 
        "DECLARE" === opcode.opcode ? this[opcode.name] = opcode.value : this[opcode.opcode].apply(this, opcode.args);
        return this.createFunctionContext(asObject);
      },
      nextOpcode: function() {
        var opcodes = this.environment.opcodes;
        return opcodes[this.i + 1], opcodes[this.i + 1];
      },
      eat: function() {
        this.i = this.i + 1;
      },
      preamble: function() {
        var out = [];
        if (this.isChild) out.push(""); else {
          var namespace = this.namespace, copies = "helpers = helpers || " + namespace + ".helpers;";
          this.environment.usePartial && (copies = copies + " partials = partials || " + namespace + ".partials;"), 
          this.options.data && (copies += " data = data || {};"), out.push(copies);
        }
        this.environment.isSimple ? out.push("") : out.push(", buffer = " + this.initializeBuffer()), 
        this.lastContext = 0, this.source = out;
      },
      createFunctionContext: function(asObject) {
        var locals = this.stackVars.concat(this.registers.list);
        if (locals.length > 0 && (this.source[1] = this.source[1] + ", " + locals.join(", ")), 
        !this.isChild) for (var alias in this.context.aliases) this.source[1] = this.source[1] + ", " + alias + "=" + this.context.aliases[alias];
        this.source[1] && (this.source[1] = "var " + this.source[1].substring(2) + ";"), 
        this.isChild || (this.source[1] += "\n" + this.context.programs.join("\n") + "\n"), 
        this.environment.isSimple || this.source.push("return buffer;");
        for (var params = this.isChild ? [ "depth0", "data" ] : [ "Handlebars", "depth0", "helpers", "partials", "data" ], i = 0, l = this.environment.depths.list.length; l > i; i++) params.push("depth" + this.environment.depths.list[i]);
        if (asObject) return params.push(this.source.join("\n  ")), Function.apply(this, params);
        var functionSource = "function " + (this.name || "") + "(" + params.join(",") + ") {\n  " + this.source.join("\n  ") + "}";
        return Handlebars.log(Handlebars.logger.DEBUG, functionSource + "\n\n"), functionSource;
      },
      blockValue: function() {
        this.context.aliases.blockHelperMissing = "helpers.blockHelperMissing";
        var params = [ "depth0" ];
        this.setupParams(0, params), this.replaceStack(function(current) {
          return params.splice(1, 0, current), current + " = blockHelperMissing.call(" + params.join(", ") + ")";
        });
      },
      ambiguousBlockValue: function() {
        this.context.aliases.blockHelperMissing = "helpers.blockHelperMissing";
        var params = [ "depth0" ];
        this.setupParams(0, params);
        var current = this.topStack();
        params.splice(1, 0, current), this.source.push("if (!" + this.lastHelper + ") { " + current + " = blockHelperMissing.call(" + params.join(", ") + "); }");
      },
      appendContent: function(content) {
        this.source.push(this.appendToBuffer(this.quotedString(content)));
      },
      append: function() {
        var local = this.popStack();
        this.source.push("if(" + local + " || " + local + " === 0) { " + this.appendToBuffer(local) + " }"), 
        this.environment.isSimple && this.source.push("else { " + this.appendToBuffer("''") + " }");
      },
      appendEscaped: function() {
        var opcode = this.nextOpcode(), extra = "";
        this.context.aliases.escapeExpression = "this.escapeExpression", opcode && "appendContent" === opcode.opcode && (extra = " + " + this.quotedString(opcode.args[0]), 
        this.eat(opcode)), this.source.push(this.appendToBuffer("escapeExpression(" + this.popStack() + ")" + extra));
      },
      getContext: function(depth) {
        this.lastContext !== depth && (this.lastContext = depth);
      },
      lookupOnContext: function(name) {
        this.pushStack(this.nameLookup("depth" + this.lastContext, name, "context"));
      },
      pushContext: function() {
        this.pushStackLiteral("depth" + this.lastContext);
      },
      resolvePossibleLambda: function() {
        this.context.aliases.functionType = '"function"', this.replaceStack(function(current) {
          return "typeof " + current + " === functionType ? " + current + "() : " + current;
        });
      },
      lookup: function(name) {
        this.replaceStack(function(current) {
          return current + " == null || " + current + " === false ? " + current + " : " + this.nameLookup(current, name, "context");
        });
      },
      lookupData: function(id) {
        this.pushStack(this.nameLookup("data", id, "data"));
      },
      pushStringParam: function(string) {
        this.pushStackLiteral("depth" + this.lastContext), this.pushString(string);
      },
      pushString: function(string) {
        this.pushStackLiteral(this.quotedString(string));
      },
      push: function(expr) {
        this.pushStack(expr);
      },
      pushLiteral: function(value) {
        this.pushStackLiteral(value);
      },
      pushProgram: function(guid) {
        null != guid ? this.pushStackLiteral(this.programExpression(guid)) : this.pushStackLiteral(null);
      },
      invokeHelper: function(paramSize, name) {
        this.context.aliases.helperMissing = "helpers.helperMissing";
        var helper = this.lastHelper = this.setupHelper(paramSize, name);
        this.register("foundHelper", helper.name), this.pushStack("foundHelper ? foundHelper.call(" + helper.callParams + ") " + ": helperMissing.call(" + helper.helperMissingParams + ")");
      },
      invokeKnownHelper: function(paramSize, name) {
        var helper = this.setupHelper(paramSize, name);
        this.pushStack(helper.name + ".call(" + helper.callParams + ")");
      },
      invokeAmbiguous: function(name) {
        this.context.aliases.functionType = '"function"', this.pushStackLiteral("{}");
        var helper = this.setupHelper(0, name), helperName = this.lastHelper = this.nameLookup("helpers", name, "helper");
        this.register("foundHelper", helperName);
        var nonHelper = this.nameLookup("depth" + this.lastContext, name, "context"), nextStack = this.nextStack();
        this.source.push("if (foundHelper) { " + nextStack + " = foundHelper.call(" + helper.callParams + "); }"), 
        this.source.push("else { " + nextStack + " = " + nonHelper + "; " + nextStack + " = typeof " + nextStack + " === functionType ? " + nextStack + "() : " + nextStack + "; }");
      },
      invokePartial: function(name) {
        var params = [ this.nameLookup("partials", name, "partial"), "'" + name + "'", this.popStack(), "helpers", "partials" ];
        this.options.data && params.push("data"), this.context.aliases.self = "this", this.pushStack("self.invokePartial(" + params.join(", ") + ");");
      },
      assignToHash: function(key) {
        var value = this.popStack(), hash = this.topStack();
        this.source.push(hash + "['" + key + "'] = " + value + ";");
      },
      compiler: JavaScriptCompiler,
      compileChildren: function(environment, options) {
        for (var child, compiler, children = environment.children, i = 0, l = children.length; l > i; i++) {
          child = children[i], compiler = new this.compiler(), this.context.programs.push("");
          var index = this.context.programs.length;
          child.index = index, child.name = "program" + index, this.context.programs[index] = compiler.compile(child, options, this.context);
        }
      },
      programExpression: function(guid) {
        if (this.context.aliases.self = "this", null == guid) return "self.noop";
        for (var depth, child = this.environment.children[guid], depths = child.depths.list, programParams = [ child.index, child.name, "data" ], i = 0, l = depths.length; l > i; i++) depth = depths[i], 
        1 === depth ? programParams.push("depth0") : programParams.push("depth" + (depth - 1));
        return 0 === depths.length ? "self.program(" + programParams.join(", ") + ")" : (programParams.shift(), 
        "self.programWithDepth(" + programParams.join(", ") + ")");
      },
      register: function(name, val) {
        this.useRegister(name), this.source.push(name + " = " + val + ";");
      },
      useRegister: function(name) {
        this.registers[name] || (this.registers[name] = !0, this.registers.list.push(name));
      },
      pushStackLiteral: function(item) {
        return this.compileStack.push(new Literal(item)), item;
      },
      pushStack: function(item) {
        return this.source.push(this.incrStack() + " = " + item + ";"), this.compileStack.push("stack" + this.stackSlot), 
        "stack" + this.stackSlot;
      },
      replaceStack: function(callback) {
        var item = callback.call(this, this.topStack());
        return this.source.push(this.topStack() + " = " + item + ";"), "stack" + this.stackSlot;
      },
      nextStack: function() {
        var name = this.incrStack();
        return this.compileStack.push("stack" + this.stackSlot), name;
      },
      incrStack: function() {
        return this.stackSlot++, this.stackSlot > this.stackVars.length && this.stackVars.push("stack" + this.stackSlot), 
        "stack" + this.stackSlot;
      },
      popStack: function() {
        var item = this.compileStack.pop();
        return item instanceof Literal ? item.value : (this.stackSlot--, item);
      },
      topStack: function() {
        var item = this.compileStack[this.compileStack.length - 1];
        return item instanceof Literal ? item.value : item;
      },
      quotedString: function(str) {
        return '"' + str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r") + '"';
      },
      setupHelper: function(paramSize, name) {
        var params = [];
        this.setupParams(paramSize, params);
        var foundHelper = this.nameLookup("helpers", name, "helper");
        return {
          params: params,
          name: foundHelper,
          callParams: [ "depth0" ].concat(params).join(", "),
          helperMissingParams: [ "depth0", this.quotedString(name) ].concat(params).join(", ")
        };
      },
      setupParams: function(paramSize, params) {
        var param, inverse, program, options = [], contexts = [];
        options.push("hash:" + this.popStack()), inverse = this.popStack(), program = this.popStack(), 
        (program || inverse) && (program || (this.context.aliases.self = "this", program = "self.noop"), 
        inverse || (this.context.aliases.self = "this", inverse = "self.noop"), options.push("inverse:" + inverse), 
        options.push("fn:" + program));
        for (var i = 0; paramSize > i; i++) param = this.popStack(), params.push(param), 
        this.options.stringParams && contexts.push(this.popStack());
        return this.options.stringParams && options.push("contexts:[" + contexts.join(",") + "]"), 
        this.options.data && options.push("data:data"), params.push("{" + options.join(",") + "}"), 
        params.join(", ");
      }
    };
    for (var reservedWords = "break else new var case finally return void catch for switch while continue function this with default if throw delete in try do instanceof typeof abstract enum int short boolean export interface static byte extends long super char final native synchronized class float package throws const goto private transient debugger implements protected volatile double import public let yield".split(" "), compilerWords = JavaScriptCompiler.RESERVED_WORDS = {}, i = 0, l = reservedWords.length; l > i; i++) compilerWords[reservedWords[i]] = !0;
    JavaScriptCompiler.isValidJavaScriptVariableName = function(name) {
      return !JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(name) ? !0 : !1;
    };
  }(Handlebars.Compiler, Handlebars.JavaScriptCompiler), Handlebars.precompile = function(string, options) {
    options = options || {};
    var ast = Handlebars.parse(string), environment = new Handlebars.Compiler().compile(ast, options);
    return new Handlebars.JavaScriptCompiler().compile(environment, options);
  }, Handlebars.compile = function(string, options) {
    function compile() {
      var ast = Handlebars.parse(string), environment = new Handlebars.Compiler().compile(ast, options), templateSpec = new Handlebars.JavaScriptCompiler().compile(environment, options, void 0, !0);
      return Handlebars.template(templateSpec);
    }
    options = options || {};
    var compiled;
    return function(context, options) {
      return compiled || (compiled = compile()), compiled.call(this, context, options);
    };
  }, Handlebars.VM = {
    template: function(templateSpec) {
      var container = {
        escapeExpression: Handlebars.Utils.escapeExpression,
        invokePartial: Handlebars.VM.invokePartial,
        programs: [],
        program: function(i, fn, data) {
          var programWrapper = this.programs[i];
          return data ? Handlebars.VM.program(fn, data) : programWrapper ? programWrapper : programWrapper = this.programs[i] = Handlebars.VM.program(fn);
        },
        programWithDepth: Handlebars.VM.programWithDepth,
        noop: Handlebars.VM.noop
      };
      return function(context, options) {
        return options = options || {}, templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);
      };
    },
    programWithDepth: function(fn, data) {
      var args = Array.prototype.slice.call(arguments, 2);
      return function(context, options) {
        return options = options || {}, fn.apply(this, [ context, options.data || data ].concat(args));
      };
    },
    program: function(fn, data) {
      return function(context, options) {
        return options = options || {}, fn(context, options.data || data);
      };
    },
    noop: function() {
      return "";
    },
    invokePartial: function(partial, name, context, helpers, partials, data) {
      var options = {
        helpers: helpers,
        partials: partials,
        data: data
      };
      if (void 0 === partial) throw new Handlebars.Exception("The partial " + name + " could not be found");
      if (partial instanceof Function) return partial(context, options);
      if (Handlebars.compile) return partials[name] = Handlebars.compile(partial, {
        data: void 0 !== data
      }), partials[name](context, options);
      throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    }
  }, Handlebars.template = Handlebars.VM.template, Handlebars;
}), define(function(require) {
  "use strict";
  function getInvitationById(id, invitations) {
    return R.find(invitations, function(v) {
      return v.identity.id === id ? !0 : void 0;
    });
  }
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  var R = require("rex"), Handlebars = require("handlebars");
  Handlebars.registerHelper("capitalize", function(str) {
    return capitalize(str);
  }), Handlebars.registerHelper("printIdentityNameFromInvitations", function(identity_id, invitations) {
    var invitation = getInvitationById(identity_id, invitations), s = "";
    return invitation && (s = invitation.identity.name), s;
  }), Handlebars.registerHelper("isOAuthIdentity", function(provider, options) {
    var context = -1 !== "twitter facebook google flickr instagram dropbox".indexOf(provider);
    return Handlebars.helpers["if"].call(this, context, options);
  });
}), define("util", function() {
  "use strict";
  var trimLeft = /^\s+/, trimRight = /\s+$/, zh_CN = /[^0-9a-zA-Z_\u4e00-\u9fa5\ \'\.]+/g, NativeTrim = String.prototype.trim, Util = {
    zh_CN: zh_CN,
    cut30length: function(s, len) {
      if (!s) return "";
      for (s = s.replace(zh_CN, " "), len || (len = 30); Util.utf8length(s) > len; ) s = s.substring(0, s.length - 1);
      return s;
    },
    utf8length: function(s) {
      for (var c, len = s.length, u8len = 0, i = 0; len > i; i++) if (c = s.charCodeAt(i), 
      127 > c) u8len++; else if (2047 >= c) u8len += 2; else if (55295 >= c || c >= 57344) u8len += 3; else {
        if (!(56319 >= c)) throw "Error: Invalid UTF-16 sequence. Missing high-surrogate code.";
        if (c = s.charCodeAt(++i), 56320 > c || c > 57343) throw "Error: Invalid UTF-16 sequence. Missing low-surrogate code.";
        u8len += 4;
      }
      return u8len;
    },
    trim: NativeTrim ? function(s) {
      return null == s ? "" : NativeTrim.call(s);
    } : function(s) {
      return null == s ? "" : ("" + s).replace(trimLeft, "").replace(trimRight, "");
    },
    parseId: function() {
      var facebook = /^([a-z0-9_\.]{1,})@facebook$/i, twitter = /^@([a-z0-9_]{1,15})$|^@?([a-z0-9_]{1,15})@twitter$/i, instagram = /^([a-z0-9_\.]{1,})@instagram$/i, dropbox = /^(.*)@dropbox$/i, flickr = /^(.*)@flickr$/i, normal = /^[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i, enormal = /^[^@]*<[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?>$/i, phone = /^(\+)?((?:(86)?(1(?:3\d|4[57]|5\d|8\d)\d{8}))|(?:(1)?(\d{5,15})))$/;
      return function(strid) {
        var m, res = {};
        if (strid = Util.trim(strid), (m = strid.match(dropbox)) && normal.test(m[1])) res.name = m[1], 
        res.external_username = m[1], res.provider = "dropbox"; else if (m = strid.match(flickr)) res.name = m[1], 
        res.external_username = m[1], res.provider = "flickr"; else if (m = strid.match(instagram)) res.name = m[1], 
        res.external_username = m[1], res.provider = "instagram"; else if (m = strid.match(facebook)) res.name = m[1], 
        res.external_username = m[1], res.provider = "facebook"; else if (m = strid.match(twitter)) res.name = m[1] || m[2], 
        res.external_username = res.name, res.provider = "twitter"; else if (normal.test(strid)) res.name = Util.cut30length(strid.split("@")[0]), 
        res.external_username = strid, res.provider = "email"; else if (enormal.test(strid)) {
          var iLt = strid.indexOf("<");
          res.name = Util.cut30length(strid.substring(0, iLt).replace(/^"|^'|"$|'$/g, "")), 
          res.external_username = res.name, res.provider = "email";
        } else if (m = strid.replace(/[\s\-\(\)\_]/g, "").match(phone)) {
          var zone, n, flag = m[1];
          res.provider = "phone", flag ? m[3] && m[4] ? (zone = m[3], n = m[4], res.name = res.external_username = flag + zone + n) : m[5] && m[6] ? (zone = m[5], 
          n = m[6], res.name = res.external_username = flag + zone + n) : (res.name = strid, 
          res.provider = null) : (flag = "+", m[4] ? (zone = "86", n = m[4]) : (zone = "1", 
          n = m[2]), res.name = res.external_username = flag + zone + n);
        } else res.name = strid, res.provider = null;
        return res;
      };
    }(),
    tokenRegExp: /token=([a-zA-Z0-9]{32})/,
    printExtUserName: function(identity, status) {
      var username = identity.external_username, provider = identity.provider;
      switch (provider) {
       case "twitter":
        username = "@" + username + "@" + provider;
        break;

       case "facebook":
       case "instagram":
       case "flickr":
       case "dropbox":
        username += "@" + provider;
        break;

       case "phone":
        status && (/^\+1\d{10}$/.test(username) ? username = username.replace(/^(\+1)(\d{3})(\d{3})(\d{4})$/, "$1 ($2) $3-$4") : /^\+86\d{11}$/.test(username) && (username = username.replace(/^(\+86)(\d{3})(\d{4})(\d{4})$/, "$1 $2 $3 $4")));
      }
      return username;
    }
  };
  return Util;
}), function() {
  "use strict";
  var PLACEHOLDER = /(?:\{\{|%\{)(\w*?)(?:\}\}?)/gm, TIMEZONE = /[\+\-][0-9]{4}$/, ISO8601_DATE = /^\d{4}-\d{2}-\d{2}$/, ISO8601_TIME = /^\d{2}:\d{2}:\d{2}$/, N2 = .2, N6 = 6e4, D = 864e5, EN = {
    monthsShort: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
    months: "January February March April May June July August September October November December".split(" "),
    weekdaysShort: "Sun Mon Tue Wed Thu Fri Sat".split(" "),
    weekdays: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
    "-1": function() {
      return "Today";
    },
    "0": function(date) {
      var s = "", y = date.years, m = date.months;
      return y && (s = "{{years}} year" + (1 === y ? "" : "s")), m && (s += (s ? " " : "") + "{{months}} month" + (1 === m ? "" : "s")), 
      s + " ago";
    },
    "1": function(date) {
      var s = "", d = date.days;
      return s = 1 === d ? "Yesterday" : 2 === d ? "Two days ago" : "{{days}} days ago";
    },
    "2": function(date) {
      var s = "", isToday = date.isToday, h = date.hours;
      return s = !isToday && h >= 12 ? "Yesterday" : "{{hours}} hours ago";
    },
    "3": function() {
      return "1.5 hours ago";
    },
    "4": function() {
      return "An hour ago";
    },
    "5": function(date, type) {
      return "X" === type ? "Just now" : "{{minutes}} minutes ago";
    },
    "6": function(date, type) {
      return "X" === type ? "Now" : "{{minutes}} minutes ago";
    },
    "7": function(date, type) {
      return "X" === type ? "Now" : "Seconds ago";
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
    "11": function(date) {
      var s = "", isToday = date.isToday, h = date.hours;
      return s = !isToday && h >= 12 ? "Tomorrow" : "In {{hours}} hours";
    },
    "12": function(date) {
      var s = "", d = date.days, day = date.day;
      return s = 1 === d ? "Tomorrow" : 2 === d ? "In two days" : EN.weekdaysShort[day] + ". in {{days}} days";
    },
    "13": function(date) {
      var s = "", y = date.years, m = date.months;
      return y && (s = "{{years}} year" + (1 === y ? "" : "s")), m && (s += (s ? " " : "") + "{{months}} month" + (1 === m ? "" : "s")), 
      "In " + s;
    }
  }, humanTime = function(t, s, type, c) {
    var output, lang = humanTime.locales[humanTime.locale], distanceTime = humanTime.distanceOfTime(t, s), input = humanTime.diff(distanceTime);
    return input.type = type, output = humanTime.inWords(input, lang), "function" == typeof c && (output = c(output.data)), 
    output;
  }, parseISO = humanTime.parseISO = function(s) {
    return new Date(Date.parse(s));
  }, toISO = humanTime.toISO = function(s) {
    return s.replace(/\s/, "T").replace(/\s/, "").replace(/([+\-]\d\d)(?::?)(\d\d)/, "$1:$2");
  };
  humanTime.locale = "en", humanTime.locales = {
    en: EN
  }, humanTime.inWords = function(input, lang) {
    var message, token = lang[input.token], type = input.type, date = input.date;
    return message = "function" == typeof token ? token(date, type) : token, _replace(message, date);
  }, humanTime.diff = function(distanceTime) {
    var days, months, years, hours, minutes, day, t = distanceTime.target, ms = distanceTime.distance, m = floor(ms / N6), output = {
      date: {}
    }, date = output.date, _days = distanceTime.days;
    return date.isToday = distanceTime.isToday, t._isToday ? output.token = -1 : -43199 > m ? (output.token = 0, 
    years = floor(-m / 525949), months = floor(-m % 525949 / 43829 + N2)) : -1439 > m ? (output.token = 1, 
    days = 3 > -_days ? -_days : floor((-m + 1439) / 1440)) : -107 > m ? (output.token = 2, 
    hours = floor(-m / 60 + N2)) : -81 > m ? output.token = 3 : -59 > m ? output.token = 4 : -29 > m ? (output.token = 5, 
    minutes = -m) : 0 > m ? (output.token = 6, minutes = -m) : 0 === m ? output.token = 7 : 60 > m ? (output.token = 8, 
    minutes = m) : 82 > m ? output.token = 9 : 108 > m ? output.token = 10 : 1440 > m ? (output.token = 11, 
    hours = floor(m / 60 + N2)) : 43200 > m ? (output.token = 12, days = 3 > _days ? _days : floor((m + 1439) / 1440), 
    day = t.getDay()) : (output.token = 13, years = floor(m / 525949), months = floor(m % 525949 / 43829 + N2), 
    12 === months && (months = 0, years++)), years && (date.years = years), months && (date.months = months), 
    days && (date.days = days), hours && (date.hours = hours), minutes && (date.minutes = minutes), 
    day !== void 0 && (date.day = day), output;
  }, humanTime.distanceOfTime = function(t, s) {
    t ? "number" == typeof t ? t = new Date(t) : "string" == typeof t && (t = parseISO(toISO(t))) : t = new Date(), 
    s ? "number" == typeof s ? s = new Date(s) : "string" == typeof s && (s = parseISO(toISO(s))) : s = new Date(), 
    t._reTime && (s.setHours(0), s.setMinutes(0), s.setSeconds(0), s.setMilliseconds(0));
    var ty = t.getFullYear(), tm = t.getMonth(), td = t.getDate(), sy = s.getFullYear(), sm = s.getMonth(), sd = s.getDate();
    return {
      target: t,
      source: s,
      distance: +t - +s,
      days: (+new Date(ty, tm, td) - +new Date(sy, sm, sd)) / D,
      isToday: ty === sy && tm === sm && td === sd
    };
  }, humanTime.toLocaleDate = function(eft) {
    var d, de, ds, opf = eft.outputformat, now = new Date(), today = now.getFullYear() + "-" + lead0(now.getMonth() + 1) + "-" + lead0(now.getDate()), isToday = !1, reTime = !1;
    if (opf) d = now, ds = today, isToday = !0; else {
      var b = eft.begin_at, bd = b.date, time = b.time.replace(/\s/g, ""), bt = time && time.replace(TIMEZONE, ""), zone = time && (TIMEZONE.exec(time) || "Z"), btz = zone && zone[0], s = "";
      bd ? (s = formatDate(bd), bt ? s += "T" + formatTime(bt) : (reTime = !0, isToday = s === today)) : (s = today, 
      bt && (s += "T" + formatTime(bt))), bd && bt && btz && (s += btz), d = parseISO(s), 
      reTime && (d.setHours(0), d.setMinutes(0), d.setSeconds(0), d.setMilliseconds(0)), 
      de = ds = d.getFullYear() + "-" + lead0(d.getMonth() + 1) + "-" + lead0(d.getDate()), 
      ds += bt ? " " + lead0(d.getHours()) + ":" + lead0(d.getMinutes()) + ":" + lead0(d.getSeconds()) : "";
    }
    return d._isToday = isToday, d._reTime = reTime, {
      date: d,
      text: ds
    };
  };
  var FUNS = {
    date: function(y, m, d, day) {
      var lang = humanTime.locales[humanTime.locale];
      return lang.weekdaysShort[day] + ", " + lang.monthsShort[m] + " " + d;
    },
    time: function(h, m) {
      var _h = h > 12 ? h - 12 : h, s = _h + ":" + lead0(m);
      return s += h >= 12 ? "PM" : "AM";
    }
  };
  humanTime.printEFTime = function(eft, type, funs) {
    var origin, t, d, tz, ctz, opt = eft.outputformat, ba = eft.begin_at, isX = "X" === type, output = {
      title: "",
      content: ""
    }, now = new Date();
    if (opt) origin = eft.origin.replace(/^['"‘’“”“”‚„]+/, "").replace(/['"‘’“”“”‚„]+$/, ""), 
    output.title = origin, isX || (output.content = origin, ba.date && (eft.outputformat = 0, 
    t = humanTime.toLocaleDate(eft), output.content = humanTime(t.date, now), eft.outputformat = 1)); else if (funs || (funs = FUNS), 
    ba && (ba.date || ba.time ? (t = humanTime.toLocaleDate(eft), d = t.date, ba.date ? (output.title = humanTime(t.date, now, "X"), 
    output.content = ba.time_word + (ba.time_word && ba.time ? " " : "") + (ba.time ? funs.time(d.getHours(), d.getMinutes()) : "") + (ba.time || ba.time_word ? ba.time ? " " : ", " : "") + funs.date(d.getFullYear(), d.getMonth(), d.getDate(), d.getDay()) + (ba.date_word ? " " : "") + ba.date_word) : ba.time && (output.content = output.title = ba.time_word + (ba.time_word ? " " : "") + funs.time(d.getHours(), d.getMinutes()) + (ba.date_word ? ", " : "") + ba.date_word), 
    d.getFullYear() !== now.getFullYear() && (output.content += " " + d.getFullYear())) : (ba.date_word || ba.time_word) && (output.content = output.title = ba.time_word + (ba.time_word ? ", " : "") + ba.date_word), 
    ba.timezone && (tz = ba.timezone.replace(/^([+\-]\d\d:\d\d)[\w\W]*$/, "$1"), ctz = getTimezone(now), 
    tz !== ctz))) {
      var abbr = getTimezoneAbbreviation(now);
      output.content += " (" + ctz + (abbr && " " + abbr) + ")";
    }
    return output;
  }, humanTime.printTime = function(date, funs) {
    date || (date = new Date()), funs || (funs = FUNS);
    var now = new Date(), output = "";
    return output += funs.date(date.getFullYear(), date.getMonth(), date.getDate(), date.getDay()) + " " + funs.time(date.getHours(), date.getMinutes()), 
    date.getFullYear() !== now.getFullYear() && (output += " " + date.getFullYear()), 
    output;
  };
  var getTimezone = humanTime.getTimezone = function(date) {
    var offset, h, m, a;
    return date || (date = new Date()), offset = date.getTimezoneOffset(), a = 0 >= offset ? "+" : "-", 
    offset = Math.abs(offset), h = floor(offset / 60), m = offset - 60 * h, a + lead0(h) + ":" + lead0(m);
  }, getTimezoneAbbreviation = function(date) {
    var abbr;
    return date || (date = new Date()), abbr = ("" + date).replace(/^.*:\d\d( GMT[+-]\d+)? \(?([A-Za-z ]+)\)?\d*$/, "$2").replace(/[a-z ]/g, ""), 
    3 === abbr.length ? abbr : "";
  };
  humanTime.createEFTime = function() {
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
  var lead0 = humanTime.lead0 = function(n, p) {
    for (n = "" + n, p || (p = 2); p > n.length; ) n = "0" + n;
    return n;
  }, formatDate = humanTime.formatDate = function(d) {
    var s;
    return ISO8601_DATE.test(d) ? s = d : (s = d.split("-"), s[1] = lead0(s[1]), s[2] = lead0(s[2]), 
    s = s.join("-")), s;
  }, formatTime = humanTime.formatTime = function(t) {
    var s;
    return ISO8601_TIME.test(t) ? s = t : (s = t.split(":"), s[0] = lead0(s[0]), s[1] = lead0(s[1]), 
    s[2] = lead0(s[2]), s = s.join(":")), s;
  }, _replace = function(mess, data) {
    var regex, name, value, placeholder, ms = mess.match(PLACEHOLDER), i = 0;
    if (ms) for (;placeholder = ms[i]; ++i) name = placeholder.replace(PLACEHOLDER, "$1"), 
    value = data[name], regex = RegExp(placeholder.replace(/\{/gm, "\\{").replace(/\}/gm, "\\}")), 
    mess = mess.replace(regex, value);
    return mess;
  }, floor = function(n) {
    return n - n % 1;
  };
  "function" == typeof define && define("humantime", function() {
    return humanTime;
  });
}(), define("api", function(require) {
  "use strict";
  function _extend(r, s) {
    var k;
    for (k in s) s.hasOwnProperty(k) && (r[k] = s[k]);
    return r;
  }
  function _ajax(options, done, fail) {
    var dfd, promise, jqXHR, o = {};
    return _extend(o, defaultOptions), _extend(o, options), dfd = deferred(), promise = dfd.promise(), 
    jqXHR = ajax(o).done(function(data, statusText, jqXHR) {
      var code = data && data.meta && data.meta.code;
      200 === code ? dfd.resolve(data.response, statusText, jqXHR) : dfd.reject(data, code, statusText, jqXHR);
    }).fail(function(data, statusText, jqXHR) {
      var code = data && data.meta && data.meta.code;
      dfd.reject(data, code, statusText, jqXHR);
    }), promise.jqXHR = jqXHR, promise.abort = function(statusText) {
      jqXHR && (jqXHR.abort(statusText), jqXHR = dfd = promise = void 0);
    }, promise.done(done).fail(fail).fail(function(data, code) {
      /^50[024]$/.exec(code) && (window.location = "/500");
    }).always(function() {
      jqXHR = dfd = promise = void 0;
    }), promise;
  }
  var $ = require("jquery"), deferred = $.Deferred, ajax = $.ajax, param = $.param, _ENV_ = window._ENV_, urls = {
    base_url: _ENV_.api_url,
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
  }, Api = {
    _token: null,
    setToken: function(token) {
      this._token = token;
    },
    getToken: function() {
      return this._token;
    },
    request: function(channel, options, done, fail) {
      var k, url = urls[channel], params = options.params, resources = options.resources;
      if (url) {
        if (params || (params = {}), params && (Api._token && !params.token && (params.token = Api._token), 
        params = param(params), url += params ? "?" + params : ""), resources) for (k in resources) url = url.replace(":" + k, encodeURIComponent(resources[k]));
        return options.url = urls.base_url + url, delete options.params, delete options.resources, 
        _ajax(options, done, fail);
      }
    }
  }, defaultOptions = {
    type: "GET",
    dataType: "JSON",
    timeout: 1e4,
    cache: !1,
    xhrFields: {
      withCredentials: !0
    }
  };
  return Api;
}), define("widget", function(require) {
  "use strict";
  function guid() {
    return "widget-" + uuid++;
  }
  function isFunction(f) {
    return "function" == typeof f;
  }
  function getValue(o, prop) {
    var f = o[prop];
    return o && f ? isFunction(f) ? o[prop]() : f : void 0;
  }
  function setAttrOptions(r, s) {
    var k;
    for (k in s) "options" !== k && (r[k] = s[k]);
  }
  function proxy(f, c) {
    return f ? function(e) {
      return f.call(c, e);
    } : void 0;
  }
  var $ = require("jquery"), Base = require("base"), Widget = Base.extend({
    options: {
      template: "<div />",
      events: null
    },
    initialize: function(options) {
      this.cid = guid(), this.initOptions(options), this.parseElement(), this.delegateEvents(), 
      this.init(), Widget.caches[this.cid] = this;
    },
    initOptions: function(params) {
      this.setOptions(params), setAttrOptions(this, params);
    },
    parseElement: function() {
      var element = this.element, template = this.options.template;
      if (element ? this.element = element instanceof $ ? element : $(element) : template && (this.element = $(template)), 
      !this.element) throw "element is invalid";
      this.element.attr("data-widget-id", this.cid);
    },
    init: function() {},
    render: function() {
      return this;
    },
    delegateEvents: function(events) {
      if (events || (events = getValue(this.options, "events")), events) {
        this.undelegateEvents();
        var key, method, match, eventName, selector;
        for (key in events) {
          if (method = events[key] || this[key], !method) throw 'Method "' + events[key] + '" does not exist';
          match = key.match(delegateEventSplitter), eventName = match[1], selector = match[2] || null, 
          eventName += ".delegateEvents" + this.cid, this.element.on(eventName, selector, proxy(method, this));
        }
      }
    },
    undelegateEvents: function() {
      this.element.off(".delegateEvents" + this.cid);
    },
    $: function(selector) {
      return this.element.find(selector);
    },
    focus: function() {
      this.element.focus();
    },
    _destory: function() {
      delete Widget.caches[this.cid], this.undelegateEvents(), Widget.superclass.destory.call(this);
    }
  });
  Widget.caches = {};
  var delegateEventSplitter = /^(\S+)\s*(.*)$/, uuid = 0;
  return Widget;
}), define("dialog", function(require) {
  "use strict";
  function backdropFn() {
    this.isShown && this.options.backdrop ? (this.$backdrop = $(backdropNode).appendTo(this.parentNode), 
    this.$backdrop.click($.proxy(this.hide, this)), this.$backdrop.addClass("in")) : !this.isShown && this.$backdrop && (this.$backdrop.removeClass("in"), 
    removeBackdrop.call(this));
  }
  function removeBackdrop() {
    this.$backdrop.remove(), this.$backdrop = null;
  }
  function escapeFn() {
    var that = this;
    this.isShown && this.options.keyboard ? $BODY.on("keyup.dismiss.modal", function(e) {
      return 27 === e.which ? (e.stopPropagation(), e.preventDefault(), that && that.hide(), 
      !1) : void 0;
    }) : this.isShown || $BODY.off("keyup.dismiss.modal");
  }
  var $ = require("jquery"), Widget = require("widget"), $BODY = $(document.body), $TMP = $("#app-tmp"), Dialog = Widget.extend({
    options: {
      keyboard: !0,
      backdrop: !1,
      template: '<div class="modal" tabindex="-1"><div class="modal-header"><button class="close" data-dismiss="dialog">×</button><h3></h3></div><div class="modal-main"><div class="modal-body"></div><div class="modal-footer"></div></div></div>',
      parentNode: $TMP,
      srcNode: "",
      viewData: null,
      lifecycle: !0
    },
    init: function() {},
    render: function() {
      var data, options = this.options;
      if (this.parentNode = options.parentNode, this.srcNode = options.srcNode, delete options.parentNode, 
      delete options.srcNode, data = options.viewData) {
        var title = data.title, body = data.body, footer = data.footer, others = data.others, cls = data.cls;
        cls && this.element.addClass(cls), title && this.element.find("h3").eq(0).html(title), 
        body && this.element.find("div.modal-body").html(body), footer && this.element.find("div.modal-footer").html(footer), 
        others && this.element.find("div.modal-main").append(others);
      }
      return this.element.appendTo(this.parentNode), this.element.on("click.dismiss.dialog", '[data-dismiss="dialog"]', $.proxy(this.hide, this)), 
      this.element.on("destory.widget", $.proxy(this.destory, this)), this.sync(), this;
    },
    sync: function() {
      return this.emit("sync"), this;
    },
    show: function(data) {
      return $TMP.find(".modal").addClass("hide"), this.emit("showBefore", data), this.element.removeClass("hide"), 
      this.isShown = !0, escapeFn.call(this), backdropFn.call(this), this.element.addClass("in"), 
      this.emit("showAfter", data), this;
    },
    hide: function(e) {
      return this.emit("hideBefore", e), this.element.addClass("hide"), this.isShown = !1, 
      escapeFn.call(this), backdropFn.call(this), this.element.removeClass("in"), this.emit("hideAfter", e), 
      e && "stopPropagation" in e && (e.stopPropagation(), e.preventDefault()), this;
    },
    offSrcNode: function() {
      var srcNode = this.srcNode;
      srcNode && (srcNode.data("dialog", null), srcNode.data("destory") && srcNode.remove());
    },
    destory: function() {
      var $e = this.element;
      if (this.srcNode) {
        var dataType = this.srcNode.data("dialog-type");
        this.offSrcNode(), $BODY.find('[data-dialog-type="' + dataType + '"]').not($e).removeData("dialog");
      }
      this._destory(), $e.remove();
    }
  }), backdropNode = '<div id="js-modal-backdrop" class="modal-backdrop" />';
  return Dialog;
}), define("typeahead", function(require) {
  "use strict";
  function proxy(f, c) {
    return f ? function(e) {
      return f.call(c, e);
    } : void 0;
  }
  var $ = require("jquery"), Widget = require("widget"), $TMP = $("#app-tmp"), Typeahead = Widget.extend({
    options: {
      source: [],
      template: '<div class="popmenu hide"></div>',
      target: null,
      parentNode: $TMP,
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
      this.target = this.target || this.options.target, this.target.on("blur.typeahead", proxy(this.blur, this)).on("keypress.typeahead", proxy(this.keypress, this)).on("keyup.typeahead", proxy(this.keyup, this)).on("focus.typeahead", proxy(this.focus, this)), 
      $.browser.webkit | $.browser.msie | $.browser.mozilla && this.target.on("keydown.typeahead", proxy(this.keypress, this)), 
      this.element.on("click.typeahead", proxy(this.click, this)).on("mouseenter.typeahead", "li", proxy(this.mouseenter, this));
    },
    select: function() {
      var active = this.$(".active"), val = active.data("value");
      return this.target.val(this.updater(val)).change(), this.emit("select", val), this.hide();
    },
    updater: function(item) {
      return item;
    },
    itemRender: function(item) {
      return $(this.options.viewData.item).data("value", item).html(item);
    },
    render: function(items) {
      var that = this;
      items = $(items).map(function(i, item) {
        return that.itemRender(item, i)[0];
      });
      var $ul = $(this.options.viewData.menu).html(items);
      return this.element.html($ul), this;
    },
    show: function() {
      var pos = $.extend({}, this.target.offset(), {
        height: this.target.outerHeight()
      });
      return this.element.css({
        top: pos.top + pos.height,
        left: pos.left
      }), this.element.removeClass("hide"), this.isShown = !0, this;
    },
    hide: function() {
      return this.element.addClass("hide"), this.isShown = !1, this;
    },
    lookup: function() {
      return this.query = $.trim(this.target.val()), this.query ? (this.emit("search", this.query), 
      void 0) : (this.emit("nothing"), this.isShown ? this.hide() : this);
    },
    next: function() {
      var active = this.element.find(".active"), next = active.next();
      next.length || (next = this.element.find("li").first()), active.removeClass("active"), 
      next.addClass("active");
    },
    prev: function() {
      var active = this.element.find(".active"), prev = active.prev();
      prev.length || (prev = this.element.find("li").last()), active.removeClass("active"), 
      prev.addClass("active");
    },
    focus: function() {},
    keyup: function(e, keyCode) {
      switch (keyCode = e.keyCode) {
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
    keypress: function(e, keyCode) {
      if (this.isShown) {
        switch (keyCode = e.keyCode) {
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
      var that = this;
      setTimeout(function() {
        that.hide();
      }, 150);
    },
    click: function(e) {
      e.stopPropagation(), e.preventDefault(), this.select();
    },
    mouseenter: function(e) {
      this.element.find(".active").removeClass("active"), $(e.currentTarget).addClass("active");
    }
  });
  return Typeahead;
}), define("panel", function(require) {
  "use strict";
  var $ = require("jquery"), Widget = require("widget"), proxy = $.proxy, Panel = Widget.extend({
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
      var options = this.options;
      return this.parentNode = options.parentNode, this.srcNode = options.srcNode, delete options.parentNode, 
      delete options.srcNode, this.on("escape", proxy(this.hide, this)), this.on("showBefore", proxy(this.showBefore, this)), 
      this.on("showAfter", proxy(this.showAfter, this)), this.element.on("destory.widget", proxy(this.destory, this)), 
      this;
    },
    escapable: function() {
      var self = this;
      $(document).on("keydown.panel", function(e) {
        27 === e.which && self.emit("escape");
      });
    },
    show: function() {
      return this.emit("showBefore"), this.escapable(), this.element.appendTo(this.parentNode), 
      this.emit("showAfter"), this;
    },
    hide: function(ms) {
      var self = this;
      return $(document).off("keydown.panel"), self.hiding = !0, ms && setTimeout(function() {
        self.hide();
      }, ms), self.element.addClass("hide"), self._effect ? setTimeout(function() {
        self.destory();
      }, 500) : self.destory(), this;
    },
    effect: function(type) {
      return this._effect = type, this.element.addClass(type), this;
    },
    _destory: function() {
      this.undelegateEvents(), Widget.superclass.destory.call(this);
    }
  });
  return Panel;
}), define("xidentity", function(require) {
  "use strict";
  var $ = require("jquery"), Util = require("util"), Api = require("api"), Typeahead = require("typeahead"), Handlebars = require("handlebars");
  return Typeahead.extend({
    itemRender: function(item) {
      this.itemTemplate || (this.template = Handlebars.compile(this.options.viewData.item)), 
      item.external_provider = Util.printExtUserName(item);
      var itemHtml = $(this.template(item));
      return delete item.external_provider, itemHtml;
    },
    matcher: function(item) {
      var eun = item.external_username;
      return ~eun.toLowerCase().indexOf(this.query.toLowerCase());
    },
    focus: function() {
      var v = this.query = Util.trim(this.target.val());
      v ? this.emit("search", v) : this.emit("nothing", v);
    },
    select: function() {
      var active = this.$(".active"), val = active.data("value");
      return val ? (this.target.val(this.updater(val)).change(), this.emit("select", val), 
      this.selecting = !1, 1 === this.element.find("li").length && this.hide(), void 0) : !1;
    },
    mouseenter: function(e) {
      return this.selecting = !0, e.stopPropagation(), e.preventDefault(), this.$(".active").removeClass("active"), 
      $(e.currentTarget).addClass("active"), this.select(), !1;
    },
    tab: function() {
      return this.hide();
    },
    keypress: function(e, keyCode) {
      if (this.isShown) {
        switch (keyCode = e.keyCode) {
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
      onSelect: function(val) {
        this.emit("search", val);
      },
      onClearCache: function() {
        delete this.cache;
      },
      onSearch: function(q) {
        var res, items, that = this, options = that.options;
        if (that.cache || (that.cache = {}), !that.selecting && that.source && that.source.length && (items = $.grep(that.source, function(item) {
          return that.matcher(item);
        }), 0 === items.length ? that.isShown ? that.hide() : that : (items.length > 1 || q !== items[0].external_id) && that.render(items.slice(0)).show()), 
        that.timer && (clearTimeout(that.timer), that.target.next().addClass("hide")), (res = Util.parseId(q)).provider) {
          var identity = {
            provider: res.provider,
            external_username: res.external_username
          };
          that.timer = setTimeout(function() {
            clearTimeout(that.timer), search(q);
          }, options.delay);
          var ajax = function(e) {
            that.ajaxDefer && 4 > that.ajaxDefer.readyState && that.ajaxDefer.abort(), that.emit("autocomplete:beforesend", identity), 
            options.useCache && that.cache[e] ? that.emit("autocomplete:finish", that.cache[e]) : that.ajaxDefer = Api.request("getRegistrationFlag", {
              data: identity,
              beforesend: function() {
                that.target.next().removeClass("hide");
              },
              complete: function() {
                that.target.next().addClass("hide");
              }
            }, function(data) {
              e === that.target.val() && (options.useCache && (that.cache[e] = data), data.identity || (data.identity = identity), 
              that.emit("autocomplete:finish", data));
            });
          }, search = function(a) {
            a.length >= that.options.minLength ? (ajax(a), that.searchValue = a) : that.emit("autocomplete:clear");
          };
        } else that.emit("autocomplete:finish", null);
      }
    }
  });
}), define("xdialog", function(require, exports) {
  "use strict";
  var $ = require("jquery"), R = require("rex"), Bus = require("bus"), Api = require("api"), Util = require("util"), Store = require("store"), Handlebars = require("handlebars"), Dialog = require("dialog"), dialogs = {}, now = Date.now || function() {
    return new Date().getTime();
  }, togglePasswordInput = function(container, input, eyebtn) {
    var TST, TIMEOUT;
    container.on("mousedown", eyebtn, function(e) {
      if (3 === e.which) return !1;
      var $elem = $(this);
      TIMEOUT && (clearTimeout(TIMEOUT), TIMEOUT = void 0), TST = now(), TIMEOUT = setTimeout(function() {
        container.find(input).prop("type", "text"), $elem.addClass("icon16-pass-show").removeClass("icon16-pass-hide");
      }, 500);
    }).on("mouseup", eyebtn, function(e) {
      return TIMEOUT && (clearTimeout(TIMEOUT), TIMEOUT = void 0), container.find(input).prop("type", "password"), 
      $(this).removeClass("icon16-pass-show").addClass("icon16-pass-hide"), e.preventDefault(), 
      e.stopPropagation(), !1;
    });
  };
  exports.dialogs = dialogs, dialogs.identification = {
    options: {
      errors: {
        "400": "Username incorrect.",
        "403": "Password incorrect.",
        "500": "Set up this new identity."
      },
      onCheckUser: function() {
        var lastIdentity = Store.get("lastIdentity"), last_external_username = Store.get("last_external_username");
        lastIdentity && (this.availability = !0, this.$("#identity").val(last_external_username), 
        this.$(".x-signin").removeClass("disabled loading"), this.$(".user-identity").removeClass("hide").find("img").attr("src", lastIdentity.avatar_filename).next().attr("class", "provider icon16-identity-" + lastIdentity.provider), 
        this.$(".xbtn-forgotpwd").data("source", [ lastIdentity ]), this.switchTab("d01")), 
        this.$(".help-subject").toggleClass("icon14-question", !this.availability);
      },
      onShowBefore: function(e) {
        var source = $(e.currentTarget).data("source");
        "string" == typeof source ? this.$("#identity").val(source) : this.emit("checkUser");
      },
      onShowAfter: function() {
        ("d00" === this.switchTabType || "d01" === this.switchTabType || "d02" === this.switchTabType) && this.$("#identity").focusend();
      },
      onHideAfter: function() {
        this.$(".modal-body").eq(0).css("opacity", 1), this.switchTabType = "d00", this._oauth_ && (this._oauth_.abort(), 
        this._oauth_ = null), this.destory(), $(".popmenu").remove();
      },
      events: {
        "keypress .modal-main": function(e) {
          var t = this.switchTabType, kc = e.keyCode;
          !this.availability || "d01" !== t && "d02" !== t || 13 !== kc || this.$(".x-signin").click();
        },
        "click .oauth > a": function(e) {
          e.stopPropagation(), e.preventDefault();
          var that = this, $e = $(e.currentTarget), oauthType = $e.data("oauth");
          that.$(".authentication").find(".oauth-provider").text(oauthType), that._oauth_ = $.ajax({
            url: "/OAuth/Authenticate?provider=" + oauthType,
            type: "POST",
            dataType: "JSON",
            data: {
              refere: window.location.href
            },
            beforeSend: function() {
              that.$(".modal-body").eq(0).css("opacity", 0), that.switchTab("d05"), that.$(".authentication").find("img").removeClass("hide"), 
              that.$(".authentication").find(".redirecting").removeClass("hide"), that.$(".authentication").find(".xalert-fail").addClass("hide"), 
              that.$(".xbtn-oauth").addClass("hide");
            },
            success: function(data) {
              var code = data.meta.code;
              200 === code ? window.location.href = data.response.redirect : (that.$(".authentication").find("img").addClass("hide"), 
              that.$(".authentication").find(".redirecting").addClass("hide"), that.$(".authentication").find(".xalert-fail").removeClass("hide"), 
              that.$(".xbtn-oauth").removeClass("hide"));
            }
          });
        },
        "click .xbtn-oauth": function() {
          return this.$(".modal-body").eq(0).css("opacity", 1), this.switchTab("d00"), !1;
        },
        "click .xbtn-verify": function(e) {
          var that = this, $e = $(e.currentTarget);
          if ($e.hasClass("xbtn-success")) return that.$(".verify-after").addClass("hide"), 
          $e.removeClass("xbtn-success").text("Verify"), that.hide(), !1;
          var provider = that._identity.provider, external_id = that._identity.external_id;
          Api.request("verifyIdentity", {
            type: "POST",
            data: {
              provider: provider,
              external_username: external_id
            }
          }, function(data) {
            that.$(".verify-before").addClass("hide"), "VERIFYING" === data.action ? (that.$(".verify-after").removeClass("hide"), 
            $e.addClass("xbtn-success").text("Done")) : $e.addClass("verify-error").removeClass("hide");
          });
        },
        "blur #identity": function(e) {
          var val = Util.trim($(e.currentTarget).val()), $identity = this.$('[for="identity"]'), $text = $identity.find("span");
          val.length && !Util.parseId(val).provider ? ($identity.addClass("label-error"), 
          $text.text("Invalid identity.")) : ($identity.removeClass("label-error"), $text.text(""));
        },
        "blur #name": function(e) {
          var val = Util.trim($(e.currentTarget).val()), $name = this.$('[for="name"]'), $text = $name.find("span");
          val ? Util.utf8length(val) > 30 ? ($text.text("Too long."), $name.addClass("label-error")) : Util.zh_CN.test(val) ? ($name.addClass("label-error"), 
          $text.text("Invalid character.")) : ($name.removeClass("label-error"), $text.text("")) : ($name.addClass("label-error"), 
          $text.text(""));
        },
        "blur #password": function(e) {
          var val = Util.trim($(e.currentTarget).val()), $pass = this.$('[for="password"]'), $text = $pass.find("span");
          val ? ($pass.removeClass("label-error"), $text.text("")) : ($pass.addClass("label-error"), 
          $text.text("Password incorrect."));
        },
        "click .help-subject": function(e) {
          var s, $e = $(e.currentTarget);
          $e.hasClass("icon14-question") ? (s = 'Identity is your online representative, such as email, <span class="strike">mobile no.</span>, and your account username on other websites like Twitter, Facebook, etc.', 
          $e.parent().find(".xalert-error:eq(0)").html(s).removeClass("hide")) : ($e.toggleClass("icon14-question icon14-clear"), 
          this.resetInputs(), this.$(".phone-tip").addClass("hide"), this.$(".user-identity").addClass("hide"), 
          Store.remove("lastIdentity"), Store.remove("last_external_username"), Store.remove("authorization"), 
          Store.remove("user"), Store.remove("identities"), this.$('[data-typeahead-type="identity"]').data("typeahead").source = null, 
          this.switchTab("d00"));
        },
        "click .xbtn-forgotpwd": function(e) {
          e.preventDefault(), this.element.addClass("hide"), $("#js-modal-backdrop").addClass("hide");
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
          var xsignin = $(e.currentTarget);
          if (!xsignin.hasClass("disabled")) {
            var that = this, t = this.switchTabType, od = this.getFormData(t);
            that.$("#password").trigger("blur"), "d02" === t && that.$("#name").trigger("blur"), 
            od.password && ("d02" !== t || od.name) && ("d01" === t || "d02" === t) && Api.request("signin", {
              type: "POST",
              data: {
                external_username: od.external_username,
                provider: od.provider,
                password: od.password,
                name: od.name || "",
                auto_signin: !!od.auto_signin
              },
              beforeSend: function() {
                xsignin.addClass("disabled loading");
              },
              complete: function() {
                xsignin.removeClass("disabled loading");
              }
            }, function(data) {
              if (delete App.request.session.browsing_authorization, delete App.request.session.browsing_user, 
              Store.set("authorization", data), Store.set("last_external_username", Util.printExtUserName(od)), 
              that.hide(), "d01" === t || "d02" === t) window.location.reload(); else {
                var d = new Dialog(dialogs.welcome);
                d.render(), d.show({
                  identity: {
                    name: od.name,
                    provider: od.provider
                  }
                });
              }
            }, function(data) {
              var code = data.meta && data.meta.code || 400;
              that.$('[for="password"]').addClass("label-error").find("span").text(that.options.errors[code]);
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
  }, dialogs.sandbox = {
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
  }, dialogs.welcome = {
    options: {
      events: {
        "click .xbtn-go": function() {
          var that = this;
          if ("email" === this._provider) {
            if (/^\/![a-zA-z0-9]+$/.test(window.location.pathname)) return window.location = window.location.pathname, 
            void 0;
          } else this.$("#follow").prop("checked") && this._token && $.ajax({
            url: "/OAuth/followExfe?token=" + this._token,
            type: "POST",
            data: {
              identity_id: this._identity_id
            },
            success: function() {
              Store.remove("oauth");
            }
          });
          that.hide();
        },
        "click .why": function() {
          this.$(".answer").toggleClass("hidden");
        }
      },
      onShowBefore: function(data) {
        var identity = data.identity, title = this.$(".title").eq(0);
        this._provider = identity.provider, this._identity_id = identity.id, this._token = data.token, 
        this._following = data.following, title.text("Hi, " + identity.name + "."), "email" === identity.provider ? this.$(".provider-email").removeClass("hide") : "twitter" === identity.provider && (this.$(".provider-other").removeClass("hide"), 
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
  }, dialogs.forgotpassword = {
    tab: "",
    updateIdentity: function(identity) {
      var provider = identity.provider, $identity = this.$(".context-identity");
      this.$(".tab").addClass("hide"), this.$(".xbtn-done").addClass("hide"), "email" === provider ? (this.tab = "tab0", 
      this.$(".tab0").eq(0).removeClass("hide"), this.$(".xbtn-send").removeClass("hide").data("identity", identity)) : "phone" === provider ? (this.tab = "tab1", 
      this.$(".tab1").eq(0).removeClass("hide"), this.$(".xbtn-send").removeClass("hide").data("identity", identity)) : (this.tab = "tab2", 
      this.$(".tab2").eq(0).removeClass("hide"), this.$(".authenticate").removeClass("hide").data("identity", identity), 
      this.$(".provider-text").text(provider.substr(0, 1).toUpperCase() + provider.substr(1))), 
      $identity.find(".avatar img").attr("src", identity.avatar_filename), $identity.find(".provider").attr("class", "provider icon16-identity-" + provider), 
      $identity.find(".identity").text(identity.eun);
    },
    options: {
      onHideAfter: function(e) {
        if (this.befer && (this.befer.abort(), this.befer = null), e) {
          var dialog_from = this.dialog_from;
          dialog_from && $('[data-dialog-type="' + dialog_from + '"]').data("dialog").hide();
        }
        this.destory();
      },
      events: {
        "click .authenticate": function(e) {
          var that = this, $e = $(e.currentTarget), i = $e.data("identity");
          i && (that.befer = Api.request("forgotPassword", {
            type: "POST",
            data: {
              provider: i.provider,
              external_username: i.external_username
            },
            beforeSend: function() {
              that.$(".authenticate-before.tab2").removeClass("hide"), $e.addClass("disabled");
            },
            complete: function() {
              $e.removeClass("disabled");
            }
          }, function(data) {
            "REDIRECT" === data.action && (window.location.href = data.url);
          }));
        },
        "click .caret-outer": function(e) {
          this.$(".dropdown-toggle").addClass("open"), e.stopPropagation();
        },
        "hover .dropdown-menu > li": function(e) {
          var t = e.type, $e = $(e.currentTarget);
          $e[("mouseenter" === t ? "add" : "remove") + "Class"]("active");
        },
        "click .dropdown-menu > li": function(e) {
          var ids = this.$(".dropdown-menu").data("identities"), index = $(e.currentTarget).data("index");
          this.updateIdentity(ids[index]);
        },
        "click .xbtn-cancel": function() {
          var dialog_from = this.dialog_from;
          this.hide(), dialog_from && ($('[data-dialog-type="' + dialog_from + '"]').data("dialog").element.removeClass("hide"), 
          $("#js-modal-backdrop").removeClass("hide"));
        },
        "click .xbtn-done": function(e) {
          this.hide(e);
        },
        "click .xbtn-send": function(e) {
          var that = this, tab = that.tab, $e = $(e.currentTarget);
          if (!$e.hasClass("disabled")) {
            var i = $e.data("identity");
            i && (that.befer = Api.request("forgotPassword", {
              type: "POST",
              data: {
                provider: i.provider,
                external_username: i.external_username
              },
              beforeSend: function() {
                that.$(".send-before." + tab).removeClass("hide"), that.$(".send-after." + tab).addClass("hide"), 
                $e.addClass("disabled");
              },
              complete: function() {
                that.$(".send-before." + tab).addClass("hide"), that.$(".send-after." + tab).removeClass("hide"), 
                $e.removeClass("disabled");
              }
            }, function(data) {
              "VERIFYING" === data.action && (that.$(".identity").next().removeClass("hide"), 
              $e.addClass("hide"), that.$(".xbtn-done").removeClass("hide"), that.$(".send-before." + tab).addClass("hide"), 
              that.$(".send-after." + tab).removeClass("hide"));
            }));
          }
        }
      },
      onShowBefore: function(e) {
        var l, first, eun, that = this, ids = $(e.currentTarget).data("source"), providers = "email phone facebook twitter";
        if (ids && (l = ids.length)) {
          if (first = ids[0], eun = first.external_username, "twitter" === first.provider && (eun = "@" + first.external_username), 
          first.eun = eun, l > 1) {
            that.$(".context-identity").addClass("switcher");
            for (var s = "", i = 0; l > i; i++) {
              var p = ids[i].provider;
              0 > providers.search(p) || (eun = ids[i].external_username, s += '<li data-index="' + i + '"><i class="pull-right icon16-identity-' + p + '"></i>', 
              "twitter" === ids[i].provider && (eun = "@" + ids[i].external_username), ids[i].eun = eun, 
              s += "<span>" + eun + "</span>", s += "</li>");
            }
            that.$(".dropdown-menu").html(s).data("identities", ids);
          }
          this.updateIdentity(first);
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
  }, dialogs.changepassword = {
    options: {
      onHideAfter: function() {
        this.befer && (this.befer.abort(), this.befer = null), this.destory();
      },
      events: {
        "click .xbtn-resetpwd": function(e) {
          var user = Store.get("user"), identities = user.identities, is = R.filter(identities, function(v) {
            return "CONNECTED" === v.status ? !0 : void 0;
          });
          if (1 === is.length) {
            e.stopPropagation(), this.hide();
            var d = new Dialog(dialogs.forgotpassword);
            d.dialog_from = "changepassword", d.render(), $(e.currentTarget).data("identity-id", is[0].id), 
            d.show(e);
          }
        },
        "click .xbtn-forgotpwd": function(e) {
          var user = Store.get("user"), identities = user.identities, len = identities.length, ids = [];
          1 === len ? ids.push(identities[0]) : R.each(identities, function(v) {
            var s = v.status;
            ("CONNECTED" === s || "REVOKED" === s) && ids.push(v);
          }), $(e.currentTarget).data("source", ids);
        },
        "click .xbtn-success": function(e) {
          var that = this, cppwd = that.$("#cppwd").val(), cpnpwd = that.$("#cp-npwd").val();
          if (!cppwd || !cpnpwd) return cppwd ? alert("Please input new password.") : alert("Please input current password."), 
          void 0;
          e.preventDefault();
          var $e = $(e.currentTarget), authorization = Store.get("authorization"), user_id = authorization.user_id, token = authorization.token;
          that.befer = Api.request("setPassword", {
            type: "POST",
            params: {
              token: token
            },
            resources: {
              user_id: user_id
            },
            data: {
              current_password: cppwd,
              new_password: cpnpwd
            },
            beforeSend: function() {
              $e && $e.addClass("disabled loading");
            },
            complete: function() {
              $e && $e.removeClass("disabled loading");
            }
          }, function(data) {
            Store.set("authorization", data), that && that.destory();
          }, function(data) {
            var meta = data && data.meta;
            if (meta) if (403 === meta.code) {
              var errorType = data.meta.errorType;
              "invalid_current_password" === errorType && alert("Invalid current password.");
            } else 401 === meta.code && "authenticate_timeout" === meta.errorType && that && that.destory();
          });
        }
      },
      onShowBefore: function() {
        togglePasswordInput(this.element, "#cppwd", "#cppwd-eye"), togglePasswordInput(this.element, "#cp-npwd", "#cp-npwd-eye");
        var user = Store.get("user");
        this.$(".avatar > img").attr("src", user.avatar_filename), this.$(".username").text(user.name);
      },
      backdrop: !1,
      viewData: {
        cls: "modal-cp mblack modal-large",
        title: "Change Password",
        body: '<div class="shadow title">Change Password</div><form class="modal-form"><fieldset><legend>Enter your current <span class="x-sign">EXFE</span> password, and set new one. All your identities share the same password for sign-in and account management.</legend><div class="clearfix context-user"><div class="pull-left avatar"><img src="" width="40" height="40" /></div><div class="pull-left username"></div></div><div class="control-group"><label class="control-label" for="cppwd">Password:</label><div class="controls"><input class="input-large" id="cppwd" placeholder="Current password" type="password" autocomplete="off" /><i class="help-inline password-eye icon16-pass-hide pointer" id="cppwd-eye"></i></div></div><div class="control-group"><label class="control-label" for="cp-npwd">New Password:</label><div class="controls"><input class="input-large" id="cp-npwd" placeholder="Set new EXFE password" type="password" autocomplete="off" /><i class="help-inline password-eye icon16-pass-hide pointer" id="cp-npwd-eye"></i></div></div></fieldset></form>',
        footer: '<button class="xbtn-white xbtn-forgotpwd" data-dialog-from="changepassword" data-widget="dialog" data-dialog-type="forgotpassword">Forgot Password...</button><button class="pull-right xbtn-blue xbtn-success">Change</button><a class="pull-right xbtn-discard" data-dismiss="dialog">Discard</a>'
      }
    }
  }, dialogs.addidentity = {
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
          var that = this, result = that.result;
          if (!result) return !1;
          var flag = result.registration_flag, identity = result.identity, provider = identity.provider, external_username = identity.external_username, user = Store.get("user"), identities = user.identities;
          if ("AUTHENTICATE" !== flag) {
            if (R.find(identities, function(v) {
              return v.provider === provider && v.external_username === external_username ? !0 : void 0;
            })) return that.destory(), void 0;
            var addIdentity = that.addIdentity;
            addIdentity({
              external_username: external_username,
              provider: provider
            }, that, null, function(data) {
              var identity = data.identity;
              identities.push(identity), Store.set("user", user);
              var s = Handlebars.compile($("#jst-identity-item").html()), h = s(data.identity);
              $(".identity-list").append(h);
              var $ai = $(".modal-ai");
              $ai.find("#identity").prop("disabled", !0), $ai.find(".xbtn-add").addClass("hide"), 
              $ai.find(".help-subject").addClass("im-hide"), $ai.find(".phone-tip").addClass("hide"), 
              $ai.find(".success-tip").removeClass("hide"), $ai.find(".xbtn-done").removeClass("hide").focus();
            });
          } else that.$('.oauth > a[data-oauth="' + provider + '"]').trigger("click");
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
          var provider, result = this.result, external_username = "", that = this;
          if (result) {
            var identity = result.identity;
            provider = identity.provider, external_username = identity.external_username;
          } else provider = $(e.target).data("oauth");
          that.$(".authentication").find(".oauth-provider").text(provider);
          var addIdentity = that.addIdentity;
          return addIdentity({
            refere: window.location.href,
            external_username: external_username,
            provider: provider
          }, that, function() {
            that.$(".modal-body").eq(0).css("opacity", 0), that.switchTab("d1"), that.$(".authentication").find("img").removeClass("hide"), 
            that.$(".authentication").find(".redirecting").removeClass("hide"), that.$(".authentication").find(".xalert-fail").addClass("hide");
          }, function(data) {
            window.location.href = data.url, that && that.destory();
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
    addIdentity: function addIdentity(pdata, that, beforeSend, done) {
      var authorization = Store.get("authorization"), token = authorization.token, defer = Api.request("addIdentity", {
        type: "POST",
        params: {
          token: token
        },
        data: pdata,
        beforeSend: function() {
          beforeSend && beforeSend();
        }
      }, function(data) {
        done && done(data);
      }, function(data) {
        var meta = data && data.meta;
        if (meta && 401 === meta.code && "authenticate_timeout" === meta.errorType) {
          var $d = $('<div data-widget="dialog" data-dialog-type="authentication" data-destory="true" class="hide"></div>');
          $("#app-tmp").append($d);
          var e = $.Event("click.dialog.data-api");
          e._data = {
            callback: function() {
              addIdentity({
                external_username: pdata.external_username,
                provider: pdata.provider
              });
            }
          }, that && that.destory(), $d.trigger(e);
        }
      });
      that && (that.defer = defer);
    },
    switchTab: function(t) {
      this.$(".d").not(".hide").addClass("hide").end().filter("." + t).removeClass("hide"), 
      this.switchTabType = t;
    },
    reset: function() {
      this.result = null;
    },
    init: function() {
      var that = this;
      Bus.off("widget-dialog-identification-auto"), Bus.on("widget-dialog-identification-auto", function(data) {
        var r = that.result = data;
        if (that && that.$(".help-subject")[(r ? "remove" : "add") + "Class"]("im-hide"), 
        r) {
          var identity = r.identity;
          identity && identity.avatar_filename && that.$(".user-identity").removeClass("hide").find("img").attr("src", identity.avatar_filename).next().attr("class", "provider icon16-identity-" + identity.provider), 
          identity || that.reset(), that.$(".phone-tip").toggleClass("hide", "phone" !== identity.provider);
        }
      }), Bus.off("widget-dialog-identification-nothing"), Bus.on("widget-dialog-identification-nothing", function() {
        that.$(".phone-tip").addClass("hide");
      });
    }
  }, dialogs.addIdentityAfterSignIn = {
    options: {
      events: {
        "click .xbtn-cancel": function() {
          this.destory();
        },
        "click .xbtn-add": function() {
          var that = this, authorization = Store.get("authorization"), token = authorization.token, external_username = this._identity.external_username, provider = this._identity.provider;
          Api.request("addIdentity", {
            type: "POST",
            params: {
              token: token
            },
            data: {
              external_username: external_username,
              provider: provider
            }
          }, function(data) {
            var identity = data.identity, user = Store.get("user"), identities = user.identities;
            identities.push(identity), Store.set("user", user), that.destory(), window.location.href = "/";
          }, function(data) {
            var meta = data && data.meta;
            if (meta && 401 === meta.code && "authenticate_timeout" === meta.errorType) {
              that.destory();
              var $d = $('<div data-widget="dialog" data-dialog-type="authentication" data-destory="true" class="hide"></div>');
              $("#app-tmp").append($d), $d.trigger("click.dialog.data-api");
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
        var data = $(e.currentTarget).data("source"), identity = data.identity, user = Store.get("user");
        this._identity = identity, this.$(".context-user").find("img").attr("src", user.avatar_filename).parent().next().text(user.name), 
        this.$(".context-identity").find("img").attr("src", identity.avatar_filename).next().addClass("icon16-identity-" + identity.provider), 
        this.$(".identity").text(Util.printExtUserName(identity)), "email" !== identity.provider && this.$(".xbtn-done").text("Authorize");
      }
    }
  }, dialogs.mergeidentity = {
    options: {
      onHideAfter: function() {
        this.destory();
      },
      events: {
        "click .xbtn-donot": function() {
          this.hide();
        },
        "click .xbtn-merge": function() {
          var that = this, $ids = this.$(".merge-list").find("input:checked"), ids = [];
          if ($ids.length) {
            for (var i = 0, l = $ids.length; l > i; ++i) ids.push($ids.eq(i).parents("li").data("identity-id"));
            return Api.request("mergeIdentities", {
              type: "POST",
              params: {
                token: this.browsing_token
              },
              data: {
                identity_ids: "[" + ("" + ids) + "]"
              }
            }, function() {
              that.hide(), window.location.href = "/";
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
        var data = $(e.currentTarget).data("source"), merged_identity = data.merged_identity, browsing_token = data.browsing_token, mergeable_user = data.mergeable_user, identities = mergeable_user.identities, li = '<li class="clearfix" data-identity-id="{{id}}"><label for="identity-{{i}}"><input class="pull-left" id="identity-{{i}}" name="identity-{{i}}" type="checkbox" /><div class="pull-left box identity">{{external_username}}</div><div class="pull-right avatar"><img width="40" height="40" alt="" src="{{avatar_filename}}" /><i class="provider icon16-identity-{{provider}}"></i></div></label></li>', $ul = this.$(".merge-list ul");
        this.$(".context-identity").find("img").attr("src", merged_identity.avatar_filename), 
        this.$(".context-identity").find(".identity").text(Util.printExtUserName(merged_identity)), 
        this.browsing_token = browsing_token;
        for (var i = 0, l = identities.length; l > i; ++i) $ul.append($(li.replace("{{id}}", identities[i].id).replace(/\{\{i\}\}/g, i).replace("{{external_username}}", Util.printExtUserName(identities[i])).replace("{{avatar_filename}}", identities[i].avatar_filename).replace("{{provider}}", identities[i].provider)));
      }
    }
  }, dialogs.verification_email = {
    options: {
      onHideAfter: function() {
        this.befer && (this.befer.abort(), this.befer = null), this.destory();
      },
      events: {
        "click .xbtn-verify": function(e) {
          var $e = $(e.currentTarget);
          if ($e.hasClass("disabled") || $e.hasClass("success")) return $e.hasClass("success") && this.hide(), 
          void 0;
          var that = this, identity_id = $e.data("identity_id"), authorization = Store.get("authorization"), token = authorization.token;
          this.befer = Api.request("verifyUserIdentity", {
            type: "POST",
            params: {
              token: token
            },
            data: {
              identity_id: identity_id
            },
            beforeSend: function() {
              $e.addClass("disabled");
            },
            complete: function() {
              $e.removeClass("disabled");
            }
          }, function(data) {
            that.$(".verify-before").addClass("hide"), "VERIFYING" === data.action ? (that.$(".verify-after").removeClass("hide"), 
            $e.text("Done").addClass("success")) : that.$(".xalert-error").removeClass("hide");
          });
        },
        "click .xbtn-cancel": function() {
          var dialog_from = this.dialog_from;
          this.hide(), dialog_from && ($('[data-dialog-type="' + dialog_from + '"]').trigger("click.dialog.data-api"), 
          $("#identity").focusend());
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
        var $e = $(e.currentTarget), identity_id = $e.data("identity-id") || $e.parents("li").data("identity-id"), user = Store.get("user"), identity = R.filter(user.identities, function(v) {
          return v.id === identity_id ? !0 : void 0;
        })[0];
        this.$(".xbtn-verify").data("identity_id", identity.id), this.$(".identity").text(identity.external_id), 
        this.$(".avatar").attr("src", identity.avatar_filename);
      }
    }
  }, dialogs.verification_oauth = {
    options: {
      events: {
        "click .xbtn-verify": function(e) {
          var $e = $(e.currentTarget), that = this;
          if ($e.hasClass("disabled") || $e.hasClass("success")) return $e.hasClass("success") && this.hide(), 
          void 0;
          var identity_id = $e.data("identity_id"), authorization = Store.get("authorization"), token = authorization.token;
          return this.befer = Api.request("verifyUserIdentity", {
            type: "POST",
            params: {
              token: token
            },
            data: {
              identity_id: identity_id
            },
            beforeSend: function() {
              $e.addClass("disabled");
            },
            complete: function() {
              $e.removeClass("disabled");
            }
          }, function(data) {
            window.location.href = data.url;
          }, function(data) {
            var code = data && data.meta && data.meta.code;
            400 === code && that.hide();
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
        var $e = $(e.currentTarget), identity_id = $e.parents("li").data("identity-id"), user = Store.get("user"), identity = R.find(user.identities, function(v) {
          return v.id === identity_id ? !0 : void 0;
        });
        this.$(".xbtn-verify").data("identity_id", identity.id), this.$(".identity").text(Util.printExtUserName(identity)), 
        this.$(".avatar").attr("src", identity.avatar_filename), this.$("i.provider").addClass("icon16-identity-" + identity.provider), 
        this.$(".xalert-" + identity.provider).removeClass("hide");
      }
    }
  }, dialogs.setpassword = {
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
          var srcNode = this.srcNode;
          srcNode && srcNode.data("redirect") && (window.location.href = "/");
        },
        "submit .modal-form": function() {
          return this.$(".xbtn-success").click(), !1;
        },
        "blur #password": function() {
          var val = this.$("#password").val(), $pass = this.$('[for="password"]'), $text = $pass.find("span");
          val ? 4 > val.length ? ($pass.addClass("label-error"), $text.text(this.errors["400"].weak_password)) : ($pass.removeClass("label-error"), 
          $text.text("")) : ($pass.addClass("label-error"), $text.text(this.errors["400"].no_password));
        },
        "click .xbtn-success": function(e) {
          var that = this, stpwd = that.$("#password").val(), xbtn = that.srcNode;
          if (!this.$('[for="password"]').hasClass("label-error")) {
            e.preventDefault();
            var $e = $(e.currentTarget), user = this._user, token = this._token, signed = this.signed;
            if (this._setup) {
              var _setPassword = function(signed, token, user, stpwd, xbtn, that) {
                var befer = Api.request("setPassword", {
                  type: "POST",
                  params: {
                    token: token
                  },
                  resources: {
                    user_id: user.id
                  },
                  data: {
                    new_password: stpwd
                  },
                  beforeSend: function() {
                    $e.addClass("disabled loading");
                  },
                  complete: function() {
                    $e.removeClass("disabled loading");
                  }
                }, function(data) {
                  Store.set("authorization", data), Bus.emit("app:user:signin", data.token, data.user_id, !0), 
                  xbtn && xbtn.data("dialog", null).data("dialog-type", "changepassword").find("span").text("Change Password..."), 
                  $("#app-user-menu").find(".setup").remove(), that && that.hide();
                }, function(data) {
                  that && that.hide();
                  var meta = data.meta;
                  if (403 === meta.code) {
                    var errorType = meta.errorType;
                    "invalid_current_password" === errorType && alert("Invalid current password.");
                  } else if (401 === meta.code && "authenticate_timeout" === meta.errorType && signed) {
                    var $d = $('<div data-widget="dialog" data-dialog-type="authentication" data-destory="true" class="hide"></div>');
                    $("#app-tmp").append($d);
                    var authorization = Store.get("authorization");
                    token = authorization.token, $d.trigger("click.dialog.data-api", {
                      callback: function() {
                        _setPassword(signed, token, user, stpwd);
                      }
                    });
                  }
                });
                that && (that.befer = befer);
              };
              _setPassword(signed, token, user, stpwd, xbtn, that);
            } else {
              var _resetPassword = function(signed, token, user, stpwd, that) {
                var befer = Api.request("resetPassword", {
                  type: "POST",
                  data: {
                    token: token,
                    name: user.name,
                    password: stpwd
                  }
                }, function(data) {
                  Store.set("authorization", data.authorization), that && that.hide(), window.location.href = "/";
                }, function(data) {
                  that && that.hide();
                  var meta = data.meta, code = meta && meta.code, errorType = meta.errorType;
                  if (401 === code && "authenticate_timeout" === errorType) {
                    var $d = $('<div data-widget="dialog" data-dialog-type="authentication" data-destory="true" class="hide"></div>');
                    $("#app-tmp").append($d);
                    var authorization = Store.get("authorization");
                    token = authorization.token, $d.trigger("click.dialog.data-api", {
                      callback: function() {
                        _resetPassword(signed, token, user, stpwd);
                      }
                    });
                  } else 401 === code && "invalid_token" === errorType && ($(".token-expired").prev().addClass("hide"), 
                  $(".token-expired").removeClass("hide"));
                });
                that && (that.befer = befer);
              };
              _resetPassword(signed, token, user, stpwd, that);
            }
          }
        }
      },
      backdrop: !1,
      viewData: {
        cls: "mblack modal-sp",
        title: "Set Password",
        body: '<div class="shadow title">Set Password</div><form class="modal-form"><fieldset><legend>Please set your <span class="x-sign">EXFE</span> password. All identities in your account share the same password for authentication.</legend><div class="clearfix context-user"><div class="pull-left avatar"><img width="40" height="40" alt="" src="" /></div><div class="pull-left username"></div></div><div class="control-group"><div class="controls"><label class="control-label" for="password">Password: <span></span></label><input class="input-large" id="password" placeholder="Set EXFE password" type="password" autocomplete="off" /><i class="help-inline icon16-pass-hide pointer" id="password-eye"></i></div></div></fieldset></form>',
        footer: '<button class="pull-right xbtn-blue xbtn-success">Done</button>'
      },
      onShowBefore: function(e) {
        togglePasswordInput(this.element, "#password", "#password-eye");
        var data = $(e.currentTarget).data("source"), token = $(e.currentTarget).data("token");
        this.signed = !1, this._setup = !1, data ? (this._user = data.user, this._token = token || data.token, 
        this._setup = data.setup) : (this.signed = !0, this._user = Store.get("user"), this._token = token || Store.get("authorization").token, 
        this._setup = !this._user.password), this.$(".avatar img").attr("src", this._user.avatar_filename), 
        this.$(".username").text(this._user.name);
      }
    }
  }, dialogs.setup_verification = {
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
          var srcNode = this.srcNode;
          srcNode && srcNode.data("redirect") && (window.location.href = "/");
        },
        "blur #name": function(e) {
          var val = Util.trim($(e.currentTarget).val()), $name = this.$('[for="name"]'), $text = $name.find("span");
          val ? Util.utf8length(val) > 30 ? ($text.text("Too long."), $name.addClass("label-error")) : Util.zh_CN.test(val) ? ($name.addClass("label-error"), 
          $text.text("Invalid character.")) : ($name.removeClass("label-error"), $text.text("")) : ($name.addClass("label-error"), 
          $text.text(""));
        },
        "blur #password": function(e) {
          var val = $(e.currentTarget).val(), $pass = this.$('[for="password"]'), $text = $pass.find("span");
          val ? 4 > val.length ? ($pass.addClass("label-error"), $text.text(this.errors["400"].weak_password)) : ($pass.removeClass("label-error"), 
          $text.text("")) : ($pass.addClass("label-error"), $text.text(this.errors["400"].no_password));
        },
        "click .xbtn-success": function() {
          if (!this.$('[for="name"]').hasClass("label-error") || !this.$('[for="password"]').hasClass("label-error")) {
            var authorization, that = this, settings = that._settings, token = settings.originToken, isUserToken = "user" === settings.tokenType, page = settings.page, reqUrl = isUserToken ? "setup" : "setupUserByInvitationToken", postData = {
              name: $.trim(this.$("#name").blur().val()),
              password: this.$("#password").blur().val()
            }, params = {}, errors = that.errors;
            isUserToken ? (params.token = settings.token, postData.identity_id = settings.browsing.identities[0].id) : postData.invitation_token = token, 
            that.defer = Api.request(reqUrl, {
              type: "POST",
              params: params,
              data: postData
            }, function(data) {
              if ("resolve" === page) if (authorization = Store.get("authorization")) {
                $("#app-user-menu").find(".setup").remove();
                var $bi = $("#app-browsing-identity"), settings = $bi.data("settings");
                settings.setup = !1, settings.originToken = data.authorization.token, $bi.data("settings", settings).trigger("click.data-api");
              } else Store.set("authorization", data.authorization), window.location = "/"; else Store.set("authorization", data.authorization), 
              window.location.reload();
              that && that.hide();
            }, function(data) {
              var meta = data.meta, code = meta && meta.code, errorType = meta && meta.errorType;
              if (code in errors && errorType in errors[code]) {
                var $pass = that.$('[for="password"]'), $text = $pass.find("span");
                $pass.addClass("label-error"), $text.text(errors[code].errorType);
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
        togglePasswordInput(this.element, "#password", "#password-eye");
        var data = $(e.currentTarget).data("source");
        if (data) {
          this._settings = data;
          var identity = data.browsing.identities[0], forward = data.forward;
          !forward && (data.forward = "/"), this.$("#name").val(identity.name), this.$(".identity").text(Util.printExtUserName(identity)), 
          this.$(".avatar").attr("src", identity.avatar_filename).next().addClass("icon16-identity-" + identity.provider), 
          this.$(".xbtn-siea").data("source", Util.printExtUserName(identity));
        }
      }
    }
  }, dialogs.setup_authenticate = {
    options: {
      onHideAfter: function() {
        this._oauth_ && (this._oauth_.abort(), this._oauth_ = null), this.destory();
      },
      events: {
        "click .xbtn-blue": function() {
          var provider = this._settings.browsing.identities[0].provider;
          this._oauth_ = $.ajax({
            url: "/OAuth/Authenticate?provider=" + provider,
            type: "POST",
            dataType: "JSON",
            success: function(data) {
              var code = data.meta.code;
              200 === code && (window.location.href = data.response.redirect);
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
        var data = $(e.currentTarget).data("source");
        if (data) {
          this._settings = data;
          var identity = data.browsing.identities[0], forward = data.forward;
          !forward && (data.forward = "/"), this.$(".identity").text(Util.printExtUserName(identity)), 
          this.$(".avatar").attr("src", identity.avatar_filename).next().addClass("icon16-identity-" + identity.provider), 
          this.$(".xbtn-siea").data("source", Util.printExtUserName(identity));
        }
      }
    }
  }, dialogs.browsing_identity = {
    options: {
      onHideAfter: function() {
        this.destory();
      },
      events: {
        "click .xbtn-dnm": function() {
          var action = this._settings.action;
          "SETUP" === action ? ($('[data-user-action="' + action + '"]').trigger("click"), 
          this.hide()) : window.location = "/";
        },
        "click .xbtn-merge": function() {
          var that = this, token = that._settings.token, invitation_token = that._settings.invitation_token, provider = this.provider, postData = {
            invitation_token: invitation_token
          };
          "email" !== provider && "phone" !== provider && (postData.refere = window.location.href), 
          Api.request("mergeIdentities", {
            type: "POST",
            params: {
              token: token
            },
            data: postData,
            beforeSend: function() {
              $(".modal-footer").find("button").prop("disabled", !0);
            }
          }, function(data) {
            if (that.hide(), data.mergeable_user = null, data.mergeable_user) {
              var d = $('<div id="js-dialog-merge" data-destory="true" data-widget="dialog" data-dialog-type="mergeidentity">'), user = Store.get("user");
              d.data("source", {
                merged_identity: R.find(user.identities, function(v) {
                  return v.id === identity.id ? !0 : void 0;
                }),
                browsing_token: browsing_token,
                mergeable_user: data.mergeable_user
              }), d.appendTo($("#app-tmp")), d.trigger("click.dialog.data-api"), $(".modal-mi").css("top", 230);
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
        var settings = $(e.currentTarget).data("settings");
        if (settings) {
          this._settings = settings;
          var $mi, $ci, $cu, user = settings.normal, browsing = settings.browsing, bidentities = browsing.identities, bidentity = bidentities[0], beun = Util.printExtUserName(bidentity), provider = this.provider = bidentity.provider;
          $mi = this.$(".merge-info"), $mi.find(".buser-name").text(browsing.name), $mi.find(".identity").text(beun), 
          $mi.find(".user-name").text(user.name), $ci = this.$(".context-identity"), $ci.find(".avatar img").attr("src", bidentity.avatar_filename).next().addClass("icon16-identity-" + provider), 
          $ci.find(".identity").text(beun), $cu = this.$(".context-user"), $cu.find(".avatar img").attr("src", user.avatar_filename), 
          $cu.find(".username").text(user.name);
        }
      }
    }
  }, dialogs.read_only = {
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
        var settings = $(e.currentTarget).data("settings");
        if (settings) {
          var isBrowsing = settings.isBrowsing, beun = Util.printExtUserName(settings.identities[0]);
          if (this.$("legend span").eq(0).text(isBrowsing ? "identity" : "user"), this.$(".xbtn-blue").data("source", beun), 
          isBrowsing) {
            var bi = this.$(".context-identity").removeClass("hide");
            bi.find(".identity").text(beun), bi.find(".avatar img").attr("src", settings.identities[0].avatar_filename), 
            bi.find(".provider").addClass("icon16-identity-" + settings.identities[0].provider);
          } else {
            var u = this.$(".context-user").removeClass("hide");
            u.find(".username").text(settings.name), u.find(".avatar img").attr("src", settings.avatar_filename);
          }
        }
      }
    }
  }, dialogs.revoked = {
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
  }, dialogs.authentication = {
    updateIdentity: function(identity) {
      var $identity = this.$(".context-identity");
      $identity.find(".avatar img").attr("src", identity.avatar_filename), $identity.find(".provider").attr("class", "provider icon16-identity-" + identity.provider), 
      $identity.find(".identity").text(identity.eun), this._identity = identity;
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
          var that = this, user = Store.get("user"), default_identity = user.identities[0], external_username = default_identity.external_username, provider = default_identity.provider, password = Util.trim(that.$("#password").val());
          Api.request("signin", {
            type: "POST",
            data: {
              external_username: external_username,
              provider: provider,
              password: password,
              name: "",
              auto_signin: !0
            }
          }, function(data) {
            Store.set("authorization", data);
            var cb = that.callback;
            that.destory(), cb();
          });
        },
        "click .xbtn-auth": function(e) {
          var that = this, $e = $(e.currentTarget);
          if ($e.hasClass("xbtn-success")) return that.$(".verify-after").addClass("hide"), 
          $e.removeClass("xbtn-success").text("Verify"), that.hide(), !1;
          var provider = that._identity.provider, external_username = that._identity.external_username;
          that.befer = Api.request("verifyIdentity", {
            type: "POST",
            data: {
              provider: provider,
              external_username: external_username
            }
          }, function(data) {
            "REDIRECT" === data.action && (window.location.href = data.url);
          });
        },
        "click .caret-outer": function(e) {
          this.$(".dropdown-toggle").addClass("open"), e.stopPropagation();
        },
        "hover .dropdown-menu > li": function(e) {
          var t = e.type, $e = $(e.currentTarget);
          $e[("mouseenter" === t ? "add" : "remove") + "Class"]("active");
        },
        "click .dropdown-menu > li": function(e) {
          var ids = this.$(".dropdown-menu").data("identities"), index = $(e.currentTarget).data("index");
          this.updateIdentity(ids[index]);
        }
      },
      onHideAfter: function() {
        this.befer && (this.befer.abort(), this.befer = null), this.destory();
      },
      onShowBefore: function(e) {
        var that = this, user = Store.get("user"), hasPassword = user.password;
        if (that.$(".d" + (hasPassword ? 0 : 1)).removeClass("hide"), e && e._data && (that.callback = e._data.callback), 
        that.callback && (that.callback = function() {}), hasPassword) that.$(".modal-body .d0").find(".avatar img").attr("src", user.avatar_filename).parent().next().text(user.name), 
        that.$(".xbtn-forgotpwd").data("source", user.identities); else {
          var l, first, ids = user.identities;
          if (ids && (l = ids.length)) {
            if (first = ids[0], first.eun = Util.printExtUserName(first), l > 1) {
              that.$(".context-identity").addClass("switcher");
              for (var s = "", i = 0; l > i; i++) s += '<li data-index="' + i + '"><i class="pull-right icon16-identity-' + ids[i].provider + '"></i>', 
              ids[i].eun = Util.printExtUserName(ids[i]), s += "<span>" + ids[i].eun + "</span>", 
              s += "</li>";
              that.$(".dropdown-menu").html(s).data("identities", ids);
            }
            that.updateIdentity(first);
          }
        }
      }
    }
  }, dialogs.unsubscribe = {
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
        var source = $(e.currentTarget).data("source");
        this.$(".x-title").text(source.title);
      }
    }
  };
  var Identification = Dialog.extend({
    availability: !1,
    init: function() {
      var that = this;
      Bus.off("widget-dialog-identification-auto"), Bus.on("widget-dialog-identification-auto", function(data) {
        var $identityLabel = that.$('[for="identity"]'), $identityLabelSpan = $identityLabel.find("span"), $passwordLabel = that.$('[for="password"]'), $passwordLabelSpan = $passwordLabel.find("span");
        that.availability = !1, that.identityFlag = null;
        var t;
        "d24" === that.switchTabType && (t = "d01"), that.$(".xalert-error").addClass("hide"), 
        that.$(".help-subject").removeClass("icon14-question").addClass("icon14-clear"), 
        data ? ($identityLabel.removeClass("label-error"), $identityLabelSpan.text(""), 
        data.identity && data.identity.avatar_filename ? (that._identity = data.identity, 
        that.$(".user-identity").removeClass("hide").find("img").attr("src", data.identity.avatar_filename).next().attr("class", "provider icon16-identity-" + data.identity.provider)) : (that._identity = null, 
        that.$(".user-identity").addClass("hide")), "phone" === data.identity.provider && that.$(".phone-tip").toggleClass("hide", /\+/.test(that.$("#identity").val())), 
        that.identityFlag = data.registration_flag, "SIGN_IN" === data.registration_flag ? (t = "d01", 
        that.$(".xbtn-forgotpwd").removeClass("hide"), $passwordLabel.removeClass("label-error"), 
        $passwordLabelSpan.text("")) : "SIGN_UP" === data.registration_flag ? (t = "d02", 
        $passwordLabel.removeClass("label-error"), $passwordLabelSpan.text("")) : "AUTHENTICATE" === data.registration_flag ? (t = "d00", 
        that.$(".help-subject").removeClass("icon14-question").addClass("icon14-clear"), 
        that.$(".authenticate").removeClass("hide")) : "VERIFY" === data.registration_flag && (t = "d04"), 
        that.availability = !0) : (that.$(".phone-tip").addClass("hide"), that.$(".help-subject").removeClass("icon14-clear").addClass("icon14-question")), 
        t && that.switchTabType !== t && that.switchTab(t), that.$(".x-signin")[(that.availability ? "remove" : "add") + "Class"]("disabled"), 
        that.$(".xbtn-forgotpwd").data("source", data ? [ data.identity ] : data);
      }), Bus.off("widget-dialog-identification-nothing"), Bus.on("widget-dialog-identification-nothing", function() {
        that.$(".authenticate").addClass("hide"), that.$(".user-identity").addClass("hide"), 
        that.$('[for="identity"]').removeClass("label-error").find("span").text(""), that.$(".xbtn-forgotpwd").addClass("hide").data("source", null), 
        that.availability = !1, that.$(".x-signin")[(that.availability ? "remove" : "add") + "Class"]("disabled");
      }), togglePasswordInput(this.element, "#password", "#password-eye");
    },
    resetInputs: function() {
      this.$("input").val(""), this.$(".label-error").removeClass("label-error").find("span").text(""), 
      this.$(".icon16-pass-show").toggleClass("icon16-pass-show icon16-pass-hide").prev().prop("type", "password"), 
      this.$("#identity").focusend();
    },
    setPasswordPlaceHolder: function(t) {
      "d02" === t ? this.$("#password").attr("placeholder", "Set your EXFE Password") : "d01" === t && this.$("#password").attr("placeholder", "Your EXFE Password");
    },
    getFormData: function(t) {
      var val = Util.trim(this.$("#identity").val()), identity = Util.parseId(val);
      return ("d01" === t || "d02" === t) && (identity.password = this.$("#password").val()), 
      "d01" === t && (identity.auto_signin = this.$("#auto-signin").prop("checked")), 
      "d02" === t && (identity.name = Util.trim(this.$("#name").val())), identity;
    },
    switchTab: function(t) {
      if (this.$(".d").not(".hide").addClass("hide").end().filter("." + t).removeClass("hide"), 
      this.$(".x-signin")[(this.availability ? "remove" : "add") + "Class"]("disabled"), 
      this.switchTabType = t, this.isShown && ("d00" === this.switchTabType || "d01" === this.switchTabType || "d02" === this.switchTabType)) {
        var $identity = this.$("#identity");
        $identity.focusend();
      }
      this.setPasswordPlaceHolder(t);
    }
  });
  exports.Identification = Identification;
}), define("datepanel", function(require) {
  "use strict";
  var $ = require("jquery"), isIE = $.browser.msie, HT = require("humantime"), locale = HT.locales[HT.locale], months = locale.months, monthsShort = locale.monthsShort, createET = HT.createEFTime, toDate = HT.toLocaleDate, lead0 = HT.lead0, Util = require("util"), trim = Util.trim, Api = require("api"), R = require("rex"), DatePanel = require("panel").extend({
    options: {
      template: '<div class="panel date-panel" tabindex="-1" data-widget="panel" id="date-panel" editarea="date-panel"><div class="panel-body"><div class="pull-left date-container"><div class="date-input"><input type="text" name="date-string" id="date-string" autocomplete="off" /><i class="pointer icon-enter-blue place-submit"></i></div><div class="date-calendar" tabindex="-1"><ul class="unstyled clearfix" id="date-head"><li>Sun</li><li>Mon</li><li>Tue</li><li>Wed</li><li>Thu</li><li>Fri</li><li>Sat</li></ul><div class="year"></div><div class="full-month"></div><div class="table-wrapper"><table class="table" id="date-table"><tbody></tbody></table></div></div></div><div class="pull-right date-timeline hide"> <div class="fuzzy-time hide">   <ul class="unstyled time-cates">     <li data-cate="all-day">All-day</li>     <li class="hide" data-time="00:01" data-cate="late-night">Late-night</li>     <li class="hide" data-time="05:00" data-cate="dawn">Dawn</li>     <li class="hide" data-time="07:00" data-cate="breakfast">Breakfast</li>     <li class="hide" data-time="08:30" data-cate="morning">Morning</li>     <li class="hide" data-time="10:00" data-cate="brunch">Brunch</li>     <li class="hide" data-time="11:30" data-cate="lunch">Lunch</li>     <li class="hide" data-time="13:00" data-cate="noon">Noon</li>     <li class="hide" data-time="14:30" data-cate="afternoon">Afternoon</li>     <li class="hide" data-time="16:00" data-cate="tea-break">Tea-break</li>     <li class="hide" data-time="17:30" data-cate="off-work">Off-work</li>     <li class="hide" data-time="19:00" data-cate="dinner">Dinner</li>     <li class="hide" data-time="20:30" data-cate="evening">Evening</li>     <li class="hide" data-time="22:00" data-cate="night">Night</li>     <li class="hide" data-time="24:00" data-cate="late-night">Late-night</li>   </ul> </div> <div class="times-wrapper">   <div class="times"></div> </div></div></div></div>',
      parentNode: null,
      srcNode: null,
      eftime: null
    },
    init: function() {
      var options = this.options;
      this.render(), this.originEftime = options.eftime, this.eftime = Cross.time, this.dateObj = toDate(this.eftime), 
      delete options.eftime, this.timezone = getTimezone(), this.dateInput = new DateInput(this, "#date-string"), 
      this.calendarTable = new CalendarTable(this, ".date-calendar"), this.timeline = new Timeline(this, ".date-timeline"), 
      this.listen();
    },
    _x: 0,
    initComponents: function() {
      var eftime = this.eftime, date = this.dateObj.date;
      this.calendarTable.refresh(date), 0 === this.originEftime.outputformat && (this.calendarTable.addCursorStyle(), 
      this.calendarTable.select()), this.timeline.refresh(this.eftime), this.timeline.select(this.eftime), 
      this.dateInput.change(eftime.origin || date.text), this.dateInput.$element.focusend(), 
      this.eftime.begin_at.time && (this._x = 124, this.element.css("left", "-=" + this._x), 
      this.showTL());
    },
    listen: function() {
      this.element.on("click.datepanel", ".place-submit", proxy(this.submitSave, this)), 
      this.element.on("keydown.datepanel", proxy(this.keydown, this)), this.on("save", this.save), 
      this.on("tmt-ct", this.tmtCT), this.on("tmt-di", this.tmtDI), this.on("rf-di", this.rfDI), 
      this.on("rf-tl", this.rfTL), this.on("rf-ct", this.rfCT), this.on("show-tl", this.showTL);
    },
    submitSave: function() {
      this.save();
    },
    save: function(s) {
      s && (this.eftime.origin = s), $("body").trigger("save-cross");
    },
    revert: function() {
      $.extend(!0, this.eftime, this.originEftime);
    },
    tmtCT: function() {
      var $e = this.calendarTable.$element;
      setTimeout(function() {
        $e.focus();
      }, 0);
    },
    tmtDI: function() {
      var $e = this.dateInput.$element;
      setTimeout(function() {
        $e.focus();
      }, 0);
    },
    rfDI: function(eft) {
      $.extend(!0, this.eftime, eft), this.dateObj = toDate(eft), this.calendarTable.refresh(this.dateObj.date), 
      0 === this.eftime.outputformat && (this.calendarTable.addCursorStyle(), this.calendarTable.select(!0)), 
      this.timeline.select(eft);
    },
    rfTL: function(t, tw) {
      var ts, eftime = this.eftime, date = this.dateObj.date, s = "";
      eftime.begin_at.time = "", t && (ts = t.split(":"), date.setHours(ts[0] || 0), date.setMinutes(ts[1] || 0), 
      date.setSeconds(ts[2] || 0), eftime.begin_at.time = lead0(date.getUTCHours()) + ":" + lead0(date.getMinutes()) + ":" + lead0(date.getSeconds())), 
      eftime.begin_at.time_word = tw, s = t || tw, eftime.outputformat ? (eftime.outputformat = 0, 
      eftime.origin = s) : (eftime.begin_at.date && (s = dateFormat(date) + " " + s), 
      eftime.origin = s), this.dateInput.change(eftime.origin);
    },
    rfCT: function(ds) {
      var ef = this.eftime, date = this.dateObj.date, dsUTC = "", dsArray = ds.split("-");
      if (date.setFullYear(dsArray[0]), date.setMonth(dsArray[1] - 1), date.setDate(dsArray[2]), 
      dsUTC = date.getUTCFullYear() + "-" + lead0(date.getUTCMonth() + 1) + "-" + lead0(date.getUTCDate()), 
      ef.begin_at.date = dsUTC, ef.outputformat) ef.outputformat = 0, ef.origin = ds; else {
        var t = "";
        ef.begin_at.time ? t = lead0(date.getHours()) + ":" + lead0(date.getMinutes()) : (t = ef.begin_at.time_word, 
        ef.begin_at.date = ds), t = t ? ds + " " + t : ds, ef.origin = t;
      }
      this.dateInput.change(ef.origin);
    },
    showTL: function() {
      this.timeline.show(this.eftime), this._x || (this._x = 124, this.element.css({
        "-webkit-transform": "translate3d(-" + this._x + "px, 0, 0)",
        "-moz-transform": "-moz-translate3d(-" + this._x + "px, 0, 0)",
        "-ms-transform": "-ms-translate3d(-" + this._x + "px, 0, 0)",
        "-o-transform": "-o-translate3d(-" + this._x + "px, 0, 0)",
        transform: "translate3d(-" + this._x + "px, 0, 0)"
      }));
    },
    keydown: function(e) {
      var self = this, altKey = e.altKey, ctrlKey = e.ctrlKey, shiftKey = e.shiftKey, metaKey = e.metaKey, kc = e.keyCode;
      27 === kc ? (self.revert(), self.emit("save")) : 13 === kc && !(altKey | shiftKey) & (ctrlKey | metaKey) && self.emit && self.emit("save");
    },
    showAfter: function() {
      var srcNode = this.srcNode;
      if (srcNode) {
        var offset = srcNode.offset(), element = this.element, width = element.outerWidth();
        element.css({
          left: offset.left - width - 15,
          top: offset.top
        });
      }
      this.initComponents();
    },
    destory: function() {
      this.element.off(), this.element.remove(), this._destory();
    }
  }), DateInput = function(component, selector) {
    this.component = component, this.$container = component.element, this.tz = component.timezone, 
    this.selector = selector, this.$element = component.$(selector), this.listen();
  };
  DateInput.prototype = {
    listen: function() {
      var $container = this.$container, selector = this.selector;
      $container.on("keydown.datepanel", selector, proxy(this.keydown, this)).on("keypress.datepanel", selector, proxy(this.keypress, this)).on("keyup.datepanel", selector, proxy(this.keyup, this));
    },
    keyHandler: function(e) {
      var component = this.component, kc = e.keyCode;
      switch (kc) {
       case 9:
        e.preventDefault(), component.emit("tmt-ct");
        break;

       case 13:
        e.preventDefault(), component.emit("save", trim(this.$element.val()));
        break;

       case 40:
        var v = this.$element.val(), l = v.length, ele = this.$element[0], end = selectionEnd(ele);
        l === end && (e.preventDefault(), component.emit("tmt-ct"));
      }
    },
    keydown: function(e) {
      this.suppressKeyPressRepeat = !!~R.indexOf([ 9, 13, 40 ], e.keyCode), this.keyHandler(e);
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
      var self = this, component = self.component, s = trim(self.$element.val());
      return self.befer && (self.befer.abort(), self.befer = void 0), "" === s ? (component.emit("rf-di", createET()), 
      void 0) : (self.befer = Api.request("recognize", {
        type: "POST",
        data: {
          time_string: s,
          timezone: self.tz
        }
      }, function(data) {
        component && component.emit("rf-di", data.cross_time);
      }), void 0);
    },
    change: function(s) {
      this.$element.val(s);
    }
  };
  var CalendarTable = function(component, selector) {
    this.component = component, this.$container = component.element, this.selector = selector, 
    this.$element = component.$(selector), this.today = new Date(), this.todayString = dateFormat(this.today), 
    this.cx = 0, this.cy = 0, this.vpr = 3, this.vph = 44, this.len = 0, this.divTmp = '<div class="tw"><span class="m hide">{{m}}</span><span class="d">{{d}}</span></div>', 
    this.$y = this.$element.find(".year"), this.$m = this.$element.find(".full-month"), 
    this.$tw = this.$element.find(".table-wrapper"), this.$tb = this.$tw.find("tbody"), 
    this.inited = !0, this.enable = !1, this.listen();
  };
  CalendarTable.prototype = {
    init: function(date) {
      var r = this.vpr, h = this.vph, y = date.getFullYear(), m = date.getMonth(), d = date.getDate(), dt = date.getDay();
      date = new Date(y, m, d - dt - 21), this.startDate = dateFormat(date), this.genNext(date), 
      this.genNext(date), this.genNext(date), this.endDate = dateFormat(date), this.cx = dt, 
      this.cy = r, this.scrollTop(r * h), this.$trs = this.$tb.find("tr"), this.inited && (this.st = this.$tw.prop("scrollHeight") - this.$tw.outerHeight(), 
      this.inited = !1);
    },
    refresh: function(date) {
      this.$trs = this.$cursor = null, this.len = 0, this.$tb.empty(), this.init(date);
    },
    getSelectedDate: function() {
      return this.selectedDate || this.todayString;
    },
    listen: function() {
      var $container = this.$container, selector = this.selector;
      $container.on("blur.datepanel", selector, proxy(this.blur, this)).on("focus.datepanel", selector, proxy(this.focus, this)).on("keydown.datepanel", selector, proxy(this.keydown, this)).on("keypress.datepanel", selector, proxy(this.keypress, this)).on("keyup.datepanel", selector, proxy(this.keyup, this)).on("click.datepanel", selector + " td", proxy(this.clickDate, this)).on("mouseenter.datepanel", selector + " td", proxy(this.mouseenterDate, this)), 
      this.$tw.on("scroll.datepanel", proxy(this.scroll, this));
    },
    scroll: function(e) {
      this.enable, e.stopPropagation(), e.preventDefault();
      var $tw = this.$tw, t = $tw.scrollTop(), b = !1, $y = this.$y, $m = this.$m;
      (0 === t || this.st === t) && (this.enable = !0, this[0 === t ? "mpageUp" : "mpageDown"](), 
      this.$tw.scrollTop(this.vph * this.vpr), b = !0), this.updateYearMonth(), $y.toggleClass("hide", b), 
      $m.toggleClass("hide", b);
    },
    updateYearMonth: function() {
      if (this.$cursor) {
        var d = datefun(this.$cursor.data("date"));
        this.$y.text(d.getFullYear()), this.$m.text(months[d.getMonth()]);
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
    scrollTop: function(s) {
      this.$tw.scrollTop(s);
    },
    keyHandler: function(e) {
      var self = this, component = this.component, kc = e.keyCode;
      switch (kc) {
       case 9:
        e.preventDefault(), component.emit("tmt-di");
        break;

       case 37:
        e.preventDefault(), self.move("left");
        break;

       case 38:
        e.preventDefault(), self.move("top");
        break;

       case 39:
        e.preventDefault(), self.move("right");
        break;

       case 40:
        e.preventDefault(), self.move("down");
        break;

       case 33:
        e.preventDefault(), self.move("pageUp");
        break;

       case 34:
        e.preventDefault(), self.move("pageDown");
        break;

       case 13:
        e.preventDefault();
        break;

       case 32:
        e.preventDefault(), self.spacing();
        break;

       case 68:
        e.preventDefault(), self.refresh(datefun(self.getSelectedDate()));
        break;

       case 84:
        e.preventDefault(), self.refresh(self.today);
        break;

       case 35:
       case 36:      }
    },
    keydown: function(e) {
      this.suppressKeyPressRepeat = !!~R.indexOf([ 9, 13, 32, 33, 34, 35, 36, 37, 38, 39, 40, 68, 84 ], e.keyCode), 
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
    select: function(enable) {
      this.selectedDate && this.$trs.find("td.selected").removeClass("selected");
      var date = this.selectedDate = this.$cursor.data("date");
      this.$cursor.addClass("selected"), this.updateYearMonth(), enable || this.component.emit("rf-ct", date);
    },
    mouseenterDate: function(e) {
      e.preventDefault(), this.delCursorStyle();
      var $td = $(e.currentTarget), $tr = $td.parent();
      this.cx = $td.index(), this.cy = $tr.index(), this.addCursorStyle();
    },
    move: function(type) {
      this.enable = !0, this.delCursorStyle(), this["m" + type](), this.addCursorStyle(), 
      this.enable = !1;
    },
    mleft: function() {
      0 === this.cx-- && (this.cx = 6, this.mtop());
    },
    mtop: function() {
      if (0 === this.cy--) {
        this.delTail3();
        var d = datefun(this.startDate, -21);
        this.startDate = dateFormat(d), this.genPrev(d), this.$trs = this.$tb.find("tr"), 
        this.cy = 2, this.$tw.scrollTop(this.vph * this.cy);
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
        var d = datefun(this.endDate, 0);
        this.genNext(d), this.endDate = dateFormat(d), this.$trs = this.$tb.find("tr"), 
        this.cy = 7, this.$tw.scrollTop(5 * this.vph);
      }
      var t = this.$tw.scrollTop();
      t = Math.round(t / this.vph) * this.vph, this.cy * this.vph > t + this.vph * (this.vpr - 1) && this.$tw.scrollTop(t += this.vph);
    },
    mpageUp: function() {
      this.delTail3();
      var d = datefun(this.startDate, -21);
      this.startDate = dateFormat(d), this.genPrev(d), this.$trs = this.$tb.find("tr");
    },
    mpageDown: function() {
      this.delHead3();
      var d = datefun(this.endDate, 0);
      this.genNext(d), this.$trs = this.$tb.find("tr"), this.endDate = dateFormat(d);
    },
    generateHTML: function(startDate) {
      var day, r = this.vpr, ts = this.todayString, sd = this.selectedDate, divTmp = this.divTmp, tb = "", i = 0;
      for (this.len += r; r > i; ++i) {
        for (var fs, isToday, isSelected, cls, j = 0, tr = "<tr>", td = ""; 7 > j; ++j) cls = "", 
        fs = dateFormat(startDate), isToday = fs === ts, isSelected = fs === sd, isToday && (cls = "today"), 
        isSelected && (cls += (cls.length ? " " : "") + "selected"), td += '<td data-date="' + fs + '"' + (cls.length ? ' class="' + cls + '"' : "") + ">", 
        day = startDate.getDate(), td += divTmp.replace("{{m}}", monthsShort[startDate.getMonth()]).replace("{{d}}", isToday ? "Today" : day), 
        td += "</td>", startDate.setDate(day + 1);
        tr += td + "</tr>", tb += tr;
      }
      return tb;
    },
    genPrev: function(date) {
      this.$tb.prepend(this.generateHTML(date));
    },
    genNext: function(date) {
      this.$tb.append(this.generateHTML(date));
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
  var Timeline = function(component, selector) {
    this.component = component, this.$container = component.element, this.selector = selector, 
    this.$element = component.$(selector), this.divTmp = '<div class="time-item{{class}}" data-time="{{dt}}"><time>{{t}}</time></div>', 
    this.$tw = this.$element.find(".times-wrapper"), this.$tc = this.$element.find(".times"), 
    this.$ft = this.$element.find(".fuzzy-time"), this.$ts = this.$ft.find(".time-cates > li[data-time]"), 
    this.ts = R.map(this.$ts, function(e) {
      return $(e).data("time");
    }), this.x = 0, this.y = 0, this.px = 0, this.py = 0, this.l = 9, this.hh = 7, this.th = 7, 
    this.dh = 0, this.dm = 0, this.status = !1, this.isHide = !0, this.listen();
  };
  Timeline.prototype = {
    show: function(eft) {
      this.$element.removeClass("hide"), this.select(eft);
    },
    select: function(eft) {
      if (this.enable = !0, this.removeSelected(), eft && 0 === eft.outputformat && eft.begin_at.time) {
        var t, d = toDate(eft).date, h = d.getHours(), m = d.getMinutes(), n = 15 * Math.round(h / 15);
        d.setMinutes(n), this.selectedTime = lead0(h) + ":" + lead0(m), this.$selected = this.$tc.find('[data-time="' + this.selectedTime + '"]').eq(0), 
        0 === this.$selected.length && (this.$selected = this.createNormalItem(h, m, Math.floor(4 * (h + m / 60) * this.h))), 
        this.$selected.removeClass("time-hover"), this.$selected.addClass("selected"), t = parseInt(this.$selected.css("top"), 10), 
        this.$tw.scrollTop(Math.max(0, t - this.vph / 2));
      } else this.$tw.scrollTop(180);
      this.enable = !1;
    },
    refresh: function(eft) {
      this.generateHTML();
      var c = this.$element.clone().attr("id", "__tmp__").css({
        visibility: "hidden",
        display: "block",
        position: "absolute"
      });
      this.$element.parent().append(c), this.rh = c.find(".times-wrapper").prop("scrollHeight"), 
      this.h = Math.floor((this.rh - this.hh - this.th) / (this.l - 1) / 12), this.a = Math.round(15 / this.h);
      var offset = c.offset();
      this.ox = offset.left, this.oy = offset.top, this.st = c.scrollTop(), this.vph = c.innerHeight(), 
      c.remove(), this.select(eft);
    },
    listen: function() {
      var $container = this.$container, selector = this.selector;
      $container.on("mouseleave.datepanel", selector, proxy(this.mouseleave, this)).on("mouseenter.datepanel", selector + " .times-wrapper", proxy(this.meTW, this)).on("mousemove.datepanel", selector + " .times-wrapper", proxy(this.mousemove, this)).on("mouseleave.datepanel", selector + " .times-wrapper", proxy(this.mlTW, this)).on("click.datepanel", selector + " .times-wrapper", proxy(this.clickTW, this)).on("click.datepanel", selector + " .time-cates li[data-cate]", proxy(this.clickCT, this)), 
      this.$tw.on("scroll.datepanel", proxy(this.scrollTop, this));
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
      var y = this.y;
      this.px = e.pageX, this.py = e.pageY, this.x = this.px - this.ox, this.y = this.py - this.oy + this.st - this.hh, 
      this.y = Math.max(0, Math.min(this.y, 4 * 3 * (this.l - 1) * this.h)), y !== this.y && (this.hoverItem(), 
      this.showFuzzyTime(e.pageY));
    },
    clickCT: function(e) {
      e.preventDefault(), this.removeSelected(), this.component.emit("rf-tl", "", $(e.currentTarget).text());
    },
    showFuzzyTime: function(y) {
      var t, d1, dt, l, n = 0, ts = this.ts, d0 = new Date(2012, 12, 21, this.dh, this.dm);
      R.find(ts, function(v, i) {
        return t = v.split(":"), d1 = new Date(2012, 12, 21, t[0], t[1]), d1 > d0 ? (n = i, 
        !0) : void 0;
      }), 0 === n && (n = 1), 24 === this.dh && (n = 14), --n, this.$ts.not(".hide").addClass("hide"), 
      this.$ts.eq(n).removeClass("hide"), this.dh >= 5 && 22 > this.dh && (this.$ts.eq(n - 1).removeClass("hide"), 
      this.$ts.eq(n + 1).removeClass("hide")), dt = y - this.oy - this.th, l = this.$ts.not(".hide").length, 
      this.$ft.stop(!0, !0).animate({
        top: dt - 18 * ((l + 1) / 2)
      }, 233);
    },
    meTW: function() {
      this.$cursor.removeClass("hide"), this.$ft.removeClass("hide");
    },
    mlTW: function(e) {
      var $c = this.$cursor;
      e && e.preventDefault(), $c.hasClass("time-label") || $c.hasClass("selected") || $c.addClass("hide");
    },
    clickTW: function(e) {
      e.stopPropagation(), e.preventDefault();
      var $c = this.$cursor, t = $c.attr("data-time"), ts = t.split(":"), isLabel = 0 === +ts[0] % 3 && 0 === +ts[1], $s = this.$selected;
      if ($c.addClass("hide"), $s) {
        if ($s.removeClass("selected"), t === $s.attr("date-time")) return;
        $s.hasClass("time-label") || ($s.remove(), delete this.$selected);
      }
      isLabel ? this.$selected = this.$tc.find('[data-time="' + t + '"]').eq(0) : (this.$selected = $c.clone().removeClass("hide time-hover"), 
      $c.before(this.$selected)), this.$selected.addClass("selected"), this.component.emit("rf-tl", this.selectedTime = this.$selected.data("time"), "");
    },
    hoverItem: function() {
      var t = Math.round(this.y / this.h) * this.h, ms = t * this.a, h = +Math.floor(ms / 60).toFixed(0), m = ms % 60, hm = lead0(h) + ":" + lead0(m);
      this.dh = h, this.dm = m, this.$cursor.css("top", t).attr("data-time", hm).find("time").text((12 === h ? h : h % 12) + ":" + lead0(m) + " " + (12 > h ? "A" : "P") + "M");
    },
    createNormalItem: function(h, m, t) {
      var $d = $(this.divTmp.replace("{{class}}", " time-hover").replace("{{dt}}", lead0(h) + ":" + lead0(m)).replace("{{t}}", h + ":" + lead0(m) + " " + (12 > h ? "A" : "P") + "M"));
      return $d.css("top", t), this.$tc.append($d), $d;
    },
    createLabelItem: function(h, m, t) {
      var $d = $(this.divTmp.replace("{{class}}", " time-label").replace("{{dt}}", lead0(h) + ":" + lead0(m)).replace("{{t}}", (12 === h ? h : h % 12) + " " + (12 > h ? "A" : "P") + "M"));
      return $d.css("top", t), this.$tc.append($d), $d;
    },
    generateHTML: function() {
      for (var l = this.l, i = 0, step = 180, d = new Date(2012, 12, 21, 21, 0), h = 0, m = 0; l > i; ++i) d.setMinutes(d.getMinutes() + step), 
      h = d.getHours(), m = d.getMinutes(), 8 === i && (h = 24), this.createLabelItem(h, m, 60 * i);
      this.$cursor = this.createNormalItem(0, 0, 0).addClass("hide");
    }
  };
  var proxy = function(f, c) {
    return f ? function(e) {
      return f.call(c, e);
    } : void 0;
  }, dateFormat = function(date) {
    return date.getFullYear() + "-" + lead0(date.getMonth() + 1) + "-" + lead0(date.getDate());
  }, datefun = function(ds, i) {
    return i || (i = 0), ds = ds.split("-"), new Date(ds[0], +ds[1] - 1, +ds[2] + i);
  }, getTimezone = function() {
    var s = "" + new Date(), tz = s.replace(/^(?:[\w\W]+([\+\-]\d\d):?(\d\d)[\w\W]+)$/, "$1:$2"), ts = s.replace(/^(?:[\w\W]+\(([a-z]+)\)[\w\W]*)$/i, "$1");
    return ("UTC" === ts || "GMT" === ts) && (ts = ""), tz + (ts ? " " + ts : "");
  }, selectionEnd = function(inputor) {
    return isIE ? getIESelectionEnd(inputor) : inputor.selectionEnd;
  }, getIESelectionEnd = function(inputor) {
    var r = document.selection.createRange(), re = inputor.createTextRange(), rc = re.duplicate();
    return re.moveToBookmark(r.getBookmark()), rc.setEndPoint("EndToStart", re), rc.text.length + r.text.length;
  };
  return DatePanel;
}), define("mappanel", function(require) {
  "use strict";
  var $ = require("jquery"), proxy = $.proxy, extend = $.extend, _ENV_ = window._ENV_, MAP_KEY = _ENV_.MAP_KEY, LOCATION = _ENV_.location, site_url = _ENV_.site_url, lead0 = require("humantime").lead0, R = require("rex"), SPLITTER = /[\r\n]+/g, CR = "\r", geolocation = window.navigator.geolocation, $win = $(window), isIE = $.browser.msie, isMapLoaded = !1, Panel = require("panel"), MapPanel = Panel.extend({
    options: {
      template: '<div class="panel map-panel" tabindex="-1" data-widget="panel" id="map-panel"><div class="panel-body"><div class="map-container"><div class="gmap-wrap"><div class="map-box" id="gmap"></div></div><div class="map-mask"></div><div class="map-resize"><span class="expand">Expand</span><span class="compact">Compact</span><span class="rb"></span><span class="lt"></span></div><div class="map-place"><div class="place-editor"><i class="pointer icon-enter-blue place-submit"></i><div class="place-filter"></div><textarea class="normal" name="place-text" id="place-text" placeholder="Enter place here."></textarea></div><div class="map-places hide"><ul class="unstyled places-list" tabindex="-1"></ul></div></div></div></div></div>',
      parentNode: null,
      srcNode: null,
      place: null
    },
    isGeoSupported: !!geolocation,
    setGeos: function(userGeo, placeGeo, hasLatLng) {
      this.xmap.initMap(userGeo, placeGeo, hasLatLng);
    },
    init: function() {
      var element, options = this.options;
      this.render(), element = this.element, this.originPlace = options.place, this.place = extend({}, options.place), 
      delete options.place, this.placeInput = new PlaceInput(this, "#place-text"), this.placesList = new PlacesList(this, ".places-list"), 
      this.xmap = new XMap(this, "#gmap"), this.listen(), this.$resize = element.find(".map-resize"), 
      this.$mask = element.find(".map-mask");
    },
    listen: function() {
      var self = this;
      this.on("update-place", this.update), this.on("change-place", this.change), this.on("geos", this.setGeos), 
      this.on("search-completed", this.searchCompleted), this.on("placeinput-tab", this.placeInputTab), 
      this.on("placeslist-tab", this.placesListTab), this.on("cleanup", function() {
        self.placesList.clear(), self.xmap.clear();
      }), this.on("clear-marker", this.clearMarker), this.on("enter-marker", this.enterMarker), 
      this.on("enter-placeitem", this.enterPlaceItem), this.on("click-placeitem", this.clickPlaceItem), 
      this.on("zoom-map", this.zoomMap), this.element.on("click.mappanel", ".place-submit", function() {
        Cross.place = self.place, $("body").trigger("save-cross");
      }), this.element.on("keydown.mappanel", proxy(this.keydown, this)), this.element.on("click.mappanel", ".map-mask", function(e) {
        e.preventDefault(), self.emit("zoom-map", !1);
      }), this.element.on("click.mappanel", ".map-resize", function(e) {
        e.preventDefault();
        var rc = $(this).hasClass("map-rc");
        self.emit("zoom-map", rc);
      }), this.element.on("click.mappanel", function(e) {
        e.stopPropagation();
      });
    },
    save: function() {
      this.$(".place-submit").trigger("click.mappanel");
    },
    keydown: function(e) {
      var self = this, altKey = e.altKey, ctrlKey = e.ctrlKey, shiftKey = e.shiftKey, metaKey = e.metaKey, kc = e.keyCode;
      27 === kc ? self.revert() : 13 === kc && !(altKey | shiftKey) & (ctrlKey | metaKey) ? (self.emit("update-place", self.place), 
      self.save()) : 187 === kc && ctrlKey ? self.emit("zoom-map", 0) : 189 === kc && ctrlKey && self.emit("zoom-map", 1);
    },
    zoomMap: function(n) {
      this.xmap.zoom(n);
    },
    clickPlaceItem: function(place) {
      this.emit("change-place", place, "map"), this.element.focus();
    },
    enterPlaceItem: function(i) {
      this.placesList.selectItem(i);
    },
    enterMarker: function(i, hasPlace) {
      this.xmap.showMarker(i, hasPlace);
    },
    clearMarker: function(i) {
      this.xmap.saveMarker(i || 0);
    },
    searchCompleted: function(places, place) {
      this.placesList.update(places, place);
    },
    placeInputTab: function() {
      var placesList = this.placesList, $placesList = placesList.$element, s = placesList.status;
      s && setTimeout(function() {
        $placesList.focus();
      }, 0);
    },
    placesListTab: function() {
      var $placeText = this.placeInput.$element;
      setTimeout(function() {
        $placeText.focusend();
      }, 0);
    },
    resetPlace: function(p) {
      return p.title = p.description = p.lat = p.lng = p.external_id = p.provider = "", 
      p;
    },
    change: function(place, type) {
      var p = this.place, oTitle = p.title, oDesc = p.description, oLat = p.lat, oLng = p.lng, clearAll = !place.title, placeInput = this.placeInput, placesList = this.placesList, update = !1, xmap = this.xmap;
      p.updated_at = printDate(new Date()), clearAll ? (p = this.resetPlace(p), placesList.clear(), 
      xmap.clear()) : (p.title = place.title, p.description = place.description, p.external_id = place.external_id || "", 
      p.provider = place.provider || "", "map" === type || "list" === type ? (p.lat = place.lat, 
      p.lng = place.lng, placeInput.change(printPlace(place.title, place.description)), 
      update = !0) : "input" === type && (oTitle === place.title || place.description || (placesList.clear(), 
      xmap.textSearch(place.title)))), (oTitle !== place.title || oDesc !== place.description || oLat !== place.lat || oLng !== place.lng || update) && this.emit("update-place", p);
    },
    revert: function() {
      this.emit("update-place", this.originPlace);
    },
    showPlace: function() {
      var userGeo, placeGeo, self = this, placeInput = this.placeInput, place = this.place, title = place.title, description = place.description, hasLatLng = place.lat && place.lng;
      this.focus(), placeInput.change(printPlace(title, description)), placeInput.$element.focusend(), 
      hasLatLng && (placeGeo = {
        coords: {
          latitude: place.lat,
          longitude: place.lng,
          title: place.title
        }
      });
      var cbGeos = function(o, userGeo, placeGeo, hasLatLng) {
        o && o.emit && o.emit("geos", userGeo, placeGeo, hasLatLng);
      }, error = function() {
        userGeo = {
          coords: LOCATION
        }, hasLatLng || (placeGeo = userGeo), cbGeos(self, userGeo, placeGeo, hasLatLng);
      };
      this.isGeoSupported ? geolocation.getCurrentPosition(function(position) {
        userGeo = position, hasLatLng || (placeGeo = userGeo), cbGeos(self, userGeo, placeGeo, hasLatLng);
      }, error, {
        enableHighAccuracy: !0,
        timeout: 6100
      }) : error();
    },
    showBefore: function() {
      this.element.attr("editarea", "map-panel");
    },
    showAfter: function() {
      var self = this, srcNode = self.srcNode;
      if (srcNode) {
        var offset = srcNode.offset(), element = self.element, width = element.outerWidth();
        element.css({
          left: this.oleft = offset.left - width - 15,
          top: this.otop = offset.top
        });
      }
      isMapLoaded ? self.showPlace() : loadMap(function() {
        isMapLoaded = !0, self && self.showPlace && self.showPlace();
      });
    },
    destory: function() {
      this.element.off(), this.element.remove(), this._destory();
    }
  }), PlaceInput = function(component, selector) {
    this.component = component, this.$container = this.component.element, this.selector = selector, 
    this.$element = component.$(selector), this.listen();
  };
  PlaceInput.prototype = {
    getPlace: function() {
      var value = this.$element.val();
      return parsePlace(value);
    },
    change: function(s) {
      this.$element.val(s);
    },
    listen: function() {
      var $container = this.$container, selector = this.selector;
      $container.on("blur.mappanel", selector, proxy(this.blur, this)).on("keypress.mappanel", selector, proxy(this.keypress, this)).on("keyup.mappanel", selector, proxy(this.keyup, this)).on("keydown.mappanel", selector, proxy(this.keydown, this)).on("focus.mappanel", selector, proxy(this.focus, this));
    },
    lookup: function() {
      var place = this.trim();
      this.component.emit("change-place", place, "input");
    },
    trim: function() {
      var place = this.getPlace();
      return !place.title && place.description && (this.change(place.description), place = this.getPlace()), 
      place;
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
      var component = this.component, kc = e.keyCode;
      switch (kc) {
       case 9:
        e.preventDefault(), component.emit("placeinput-tab");
        break;

       case 40:
        var v = this.$element.val(), l = v.length, ele = this.$element[0], end = selectionEnd(ele);
        l === end && (e.preventDefault(), component.emit("placeinput-tab"));
      }
    },
    keypress: function(e) {
      this.suppressKeyPressRepeat || this.keyHandler(e);
    },
    keydown: function(e) {
      this.suppressKeyPressRepeat = !!~R.indexOf([ 9, 40 ], e.keyCode), this.keyHandler(e);
    }
  };
  var PlacesList = function(component, selector) {
    this.template = '<li class="place-item{{css-class}}" data-lat="{{lat}}" data-lng="{{lng}}" data-external-id="{{external_id}}"><address><div class="title">{{title}}</div><div class="description">{{address}}</div></address></li>', 
    this.component = component, this.$container = this.component.element, this.selector = selector, 
    this.$element = component.$(selector), this.$items = null, this.len = 0, this.curr = 0, 
    this.viewportRows = 12, this.viewportIndex = 0, this.scrollIndexs = [ 0, 11 ], this.scrollNum = 1, 
    this.itemPX = 40, this.listen();
  };
  PlacesList.prototype = {
    listen: function() {
      var $container = this.$container, selector = this.selector;
      $container.on("blur.mappanel", selector, proxy(this.blur, this)).on("keypress.mappanel", selector, proxy(this.keypress, this)).on("keyup.mappanel", selector, proxy(this.keyup, this)).on("keydown.mappanel", selector, proxy(this.keydown, this)).on("focus.mappanel", selector, proxy(this.focus, this)).on("click.mappanel", selector + " > li", proxy(this.click, this)).on("mouseenter.mappanel", selector + " > li", proxy(this.mouseenter, this));
    },
    update: function(places, place) {
      this.status = !!places.length || place, this.$element.empty(), this.curr = 0;
      var location, html = "", li = this.template;
      this.hasPlace = !1, this.status && (place && (html += li.replace("{{css-class}}", " place-marker").replace("{{title}}", place.title).replace("{{address}}", place.description).replace("{{lat}}", place.lat).replace("{{lng}}", place.lng).replace("{{external_id}}", place.external_id), 
      this.hasPlace = !0), R.each(places, function(v) {
        location = v.geometry.location, html += li.replace("{{css-class}}", "").replace("{{title}}", v.name).replace("{{address}}", v.formatted_address).replace("{{lat}}", location.lat()).replace("{{lng}}", location.lng()).replace("{{external_id}}", v.id);
      }), this.$element.html(html)), this.$items = this.$element.find(" > li"), this.len = this.$items.length, 
      this.$element.parent().toggleClass("hide", !this.status);
    },
    blur: function() {
      this.removeCurrStyle("hover");
    },
    mouseenter: function(e) {
      var $item = $(e.currentTarget), i = $item.index();
      this.selectItem(i, !0), this.component.emit("enter-marker", i, this.hasPlace);
    },
    selectItem: function(i, scrollable) {
      0 === this.len && (this.$items = this.$element.find(" > li"), this.len = this.$items.length), 
      this.removeCurrStyle("hover"), this.curr = i, !scrollable && this.$element.scrollTop(Math.floor(i / this.viewportRows) * this.itemPX * this.viewportRows), 
      this.addCurrStyle("hover");
    },
    focus: function() {
      this.$items = this.$element.find(" > li"), this.len = this.$items.length, this.addCurrStyle("hover"), 
      this.component.emit("enter-marker", this.curr, this.hasPlace);
    },
    addCurrStyle: function(c) {
      this.$items.eq(this.curr).addClass(c);
    },
    removeCurrStyle: function(c) {
      this.len && this.$items.eq(this.curr).removeClass(c);
    },
    clear: function() {
      this.curr = 0, this.len = 0, this.viewportIndex = 0, this.$items = null, this.$element.empty().parent().addClass("hide");
    },
    setPlace: function() {
      if (0 !== this.len) {
        var component = this.component, $li = this.$items.eq(this.curr), place = {
          title: $li.find("div.title").text(),
          description: $li.find("div.description").text(),
          lat: $li.data("lat") + "",
          lng: $li.data("lng") + "",
          external_id: $li.data("external-id"),
          provider: "google"
        };
        this.hasPlace = !0, component.emit("clear-marker", this.curr), component.emit("change-place", place, "list"), 
        this.clear();
      }
    },
    scroll: function(arrow) {
      var si = this.scrollIndexs, l = this.viewportRows, len = this.len, n = this.scrollNum, h = this.itemPX, i = this.curr, row = this.viewportIndex += arrow;
      if (row === si[1] + 1 && i === len - 1) this.$element.scrollTop(0), this.viewportIndex = 0; else if (row === si[0] - 1 && 0 === i) this.$element.scrollTop((len - l) * h), 
      this.viewportIndex = 11; else if (row === si[0] - 1 && i > si[0] || len - (l - si[1]) > i && row === si[1] + 1) {
        var t = this.$element.scrollTop();
        this.$element.scrollTop(t += arrow * h * n), this.viewportIndex = si[(arrow + 1) / 2];
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
      var self = this, component = self.component, hasPlace = self.hasPlace, ctrlKey = e.ctrlKey, kc = e.keyCode;
      switch (kc) {
       case 9:
        e.preventDefault(), component.emit("placeslist-tab");
        break;

       case 13:
       case 32:
        ctrlKey || (e.preventDefault(), self.setPlace(), component.emit("enter-marker", self.curr, hasPlace));
        break;

       case 38:
        e.stopPropagation(), e.preventDefault(), self.scroll(-1), self.prev(), component.emit("enter-marker", self.curr, hasPlace);
        break;

       case 40:
        e.stopPropagation(), e.preventDefault(), self.scroll(1), self.next(), component.emit("enter-marker", self.curr, hasPlace);
      }
    },
    keypress: function(e) {
      return this.suppressKeyPressRepeat ? !1 : (this.keyHandler(e), void 0);
    },
    keydown: function(e) {
      this.suppressKeyPressRepeat = !!~R.indexOf([ 9, 13, 32, 38, 40 ], e.keyCode), this.keyHandler(e);
    },
    click: function(e) {
      e.stopPropagation(), e.preventDefault(), this.curr = $(e.currentTarget).index(), 
      this.setPlace();
    }
  };
  var XMap = function(component, selector) {
    this.component = component, this.selector = selector, this.$element = component.$(selector), 
    this.$wrap = this.$element.parent(), this.GMaps = null, this.sizeStatus = !0, this.zoom2 = 2, 
    this.zoom12 = 12, this.zoom16 = 16, this.zoomN = 16, this.a = .05, this.owidth = this.$element.width(), 
    this.oheight = this.$element.height(), this.cbid = 0, this.redMarkers = [], this.curr = 0;
  };
  XMap.prototype = {
    resize: function(w, h) {
      880 > w && (w = 880), 500 > h && (h = 500), this.$element.width(w).height(h);
    },
    initMap: function(userPosition, placePosition, hasLatLng) {
      var GMaps, GCP, self = this, component = this.component, place = component.place, coords = placePosition.coords, ucoords = userPosition.coords, hasPlace = hasLatLng;
      coords || (placePosition.coords = coords = {}), coords.latitude || (coords.latitude = "0"), 
      coords.longitude || (coords.longitude = "0"), this.isGo = !0, this.hasLocation = !!ucoords, 
      this.hasPlace = hasPlace;
      try {
        if (GMaps = this.GMaps = window.google.maps, GCP = GMaps.ControlPosition, this._center = new GMaps.LatLng(coords.latitude, coords.longitude), 
        this._request = {
          radius: 5e4,
          location: this._center
        }, this.enableOptions = {
          zoomControl: !0,
          zoomControlOptions: {
            position: GCP.RIGHT_TOP
          },
          scaleControl: !0,
          scaleControlOptions: {
            position: GCP.BOTTOM_LEFT
          }
        }, this.zoomN = this.hasPlace ? this.zoom16 : this.hasLocation ? this.zoom12 : this.zoom2, 
        this._map = new GMaps.Map(this.$element[0], this.defaultOptions = {
          zoom: this.zoomN,
          center: this._center,
          disableDefaultUI: !0,
          MapTypeId: GMaps.MapTypeId.ROADMAP,
          panControl: !1,
          zoomControl: !1,
          scaleControl: !1
        }), this._overlay = new GMaps.OverlayView(), this._overlay.draw = function() {}, 
        this._overlay.setMap(this._map), this.createIcons(), this.hasLocation && (this._userMarker = new GMaps.Marker({
          map: this._map,
          position: new GMaps.LatLng(ucoords.latitude, ucoords.longitude),
          icon: this.sbicon,
          title: ucoords.title || ""
        })), this._service = new GMaps.places.PlacesService(this._map), this.hasPlace) {
          this._map.panBy(-100, 0);
          var marker = this.createBlueMarker(GMaps.Marker, {
            map: this._map,
            position: this._center,
            icon: this.bicon,
            draggable: !0,
            title: coords.title || ""
          }, place);
          this.GMaps.event.addListener(marker, "dragend", function(dl) {
            var latLng = dl.latLng;
            this._place.lat = "" + latLng.lat(), this._place.lng = "" + latLng.lng(), this._place.provider = "", 
            component.emit("change-place", this._place, "map");
          }), this.GMaps.event.addListener(marker, "click", function() {
            self.clearMarkers(), component.emit("change-place", this._place, "map");
          }, !1), this.GMaps.event.addListener(marker, "mouseover", function() {
            self.selectMarker(this), component.emit("enter-placeitem", 0);
          });
        }
        var cb, geocoder = new GMaps.Geocoder(), mousedown_func = function(dl) {
          self._timer = setTimeout(function() {
            var marker, place = component.placeInput.getPlace(), latLng = dl.latLng;
            component.placesList.clear(), self.clearBlueMarker(), self.clearMarkers(), place.lat = "" + latLng.lat(), 
            place.lng = "" + latLng.lng(), marker = self.createBlueMarker(GMaps.Marker, {
              map: self._map,
              position: latLng,
              icon: self.bicon,
              draggable: !0,
              title: place.title || ""
            }, place), GMaps.event.addListener(marker, "dragend", function(dl) {
              var latLng = dl.latLng;
              this._place.lat = "" + latLng.lat(), this._place.lng = "" + latLng.lng(), this._place.provider = "", 
              component.emit("change-place", this._place, "map");
            }), GMaps.event.trigger(marker, "mouseover"), cb = function(results, status) {
              self._timer && cb.id === self.cbid && status === window.google.maps.GeocoderStatus.OK && results.length && (clearTimeout(self._timer), 
              self.hasPlace = !0, self.cbid = 0, place.title = "Right there on map", place.description = results[0].formatted_address, 
              place.provider = "", place.external_id = "", component.emit("change-place", marker._place = place, "map"));
            }, cb.id = ++self.cbid, geocoder.geocode({
              latLng: new GMaps.LatLng(place.lat, place.lng)
            }, cb);
          }, 610);
        }, mouseup_func = function() {
          clearTimeout(self._timer);
        };
        ucoords && (GMaps.event.addListener(this._userMarker, "mousedown", mousedown_func), 
        GMaps.event.addListener(this._userMarker, "mouseup", mousedown_func)), GMaps.event.addListener(this._map, "mousedown", mousedown_func), 
        GMaps.event.addListener(this._map, "mouseup", mouseup_func), GMaps.event.addListener(this._map, "dragstart", mouseup_func);
      } catch (e) {
        this.isGo = !1;
      }
    },
    createBlueMarker: function(GMarker, options, place) {
      return this._placeMarker = this.createMarker(GMarker, options, place), this._placeMarker.isBlue = !0, 
      this._placeMarker;
    },
    clearBlueMarker: function() {
      this.removeMarker(this._placeMarker), this._placeMarker = null;
    },
    textSearch: function(query) {
      var cb, pm, self = this, GMaps = self.GMaps, isGo = self.isGo, component = self.component, service = self._service, request = self._request;
      isGo && (self.clearMarkers(), query && query !== request.query && (request.query = query, 
      cb = function(results, status) {
        cb.id === self.cbid && status === GMaps.places.PlacesServiceStatus.OK && (self.cbid = 0, 
        pm = self._placeMarker, self.createMarkers(results), component.emit("search-completed", results, pm ? pm._place : null));
      }, cb.id = ++self.cbid, service.textSearch(request, cb)));
    },
    panToRight: function() {
      var GMaps = this.GMaps, map = this._map, overlay = this._overlay, projection = overlay.getProjection(), GPoint = GMaps.Point, point = projection.fromLatLngToContainerPixel(map.getCenter()), center = projection.fromContainerPixelToLatLng(new GPoint(point.x - 100, point.y));
      map.setCenter(center);
    },
    showMarker: function(i, hasPlace) {
      var marker, position;
      marker = hasPlace && -1 === --i ? this._placeMarker : this.redMarkers[i], marker && (this.selectMarker(marker), 
      position = marker.getPosition(), this._map.panTo(position)), this.sizeStatus && (this._map.setZoom(this.zoomN = this.zoom16), 
      this.panToRight());
    },
    selectMarker: function(marker) {
      var ricon = this.ricon, bicon = this.bicon, currMarker = this.currMarker;
      currMarker && (currMarker.setZIndex(null), currMarker.isBlue || currMarker.setIcon(ricon)), 
      marker && (marker.setZIndex(377), marker.isBlue || marker.setIcon(bicon), this.currMarker = marker);
    },
    createIcons: function() {
      var GMaps = this.GMaps, url = site_url + "/static/img/icons.png", GSize = GMaps.Size, GPoint = GMaps.Point, MarkerImage = GMaps.MarkerImage;
      this.bicon = new MarkerImage(url, new GSize(26, 36), new GPoint(0, 78)), this.ricon = new MarkerImage(url, new GSize(26, 36), new GPoint(26, 78)), 
      this.sbicon = new MarkerImage(url, new GSize(12, 14), new GPoint(52, 100));
    },
    saveMarker: function(i) {
      var self = this, hasPlace = self.hasPlace;
      if (!hasPlace || 0 !== i) {
        hasPlace && (this.clearBlueMarker(), i -= 1);
        var component = this.component, GEvent = this.GMaps.event, marker = this._placeMarker = this.redMarkers.splice(i, 1)[0];
        this.hasPlace = !0, this.selectMarker(marker), this.defaultOptions.zoom = this.zoomN = this.zoom16, 
        GEvent.clearListeners(marker), marker.isBlue = !0, marker.setDraggable(!0), GEvent.addListener(marker, "click", function() {
          self.clearMarkers(), component.emit("change-place", this._place, "map");
        }, !1), GEvent.addListener(marker, "dragend", function(dl) {
          var latLng = dl.latLng;
          this._place.lat = "" + latLng.lat(), this._place.lng = "" + latLng.lng(), this._place.provider = "", 
          component.emit("change-place", this._place, "map");
        }), GEvent.addListener(marker, "mouseover", function() {
          self.selectMarker(this), component.emit("enter-placeitem", 0);
        });
      }
      this.clearMarkers();
    },
    clear: function() {
      this._placeMarker && this.clearBlueMarker(), this.clearMarkers(), this.hasPlace = !1, 
      this.defaultOptions.zoom = this.zoomN = this.hasLocation ? this.zoom12 : this.zoom2;
    },
    removeMarker: function(marker) {
      marker && (marker.setMap(null), marker = null);
    },
    clearMarkers: function() {
      var marker, markers = this.redMarkers, removeMarker = this.removeMarker;
      if (markers) {
        for (;marker = markers.shift(); ) removeMarker(marker);
        this.curr = 0;
      }
    },
    createMarkers: function(places, able) {
      for (var place, marker, location, self = this, enable = !able, component = this.component, createMarker = this.createMarker, GMaps = this.GMaps, GEvent = GMaps.event, GLatLng = GMaps.LatLng, GMarker = GMaps.Marker, bounds = new GMaps.LatLngBounds(), markers = this.redMarkers, map = this._map, ricon = this.ricon, i = 0, marker_click = function() {
        var i = self.indexOf(self.redMarkers, this);
        component.placesList.clear(), component.emit("clear-marker", i), component.emit("click-placeitem", this._place);
      }, marker_mouseover = function() {
        var i = self.indexOf(self.redMarkers, this);
        self.selectMarker(this), component.emit("enter-placeitem", i += self._placeMarker ? 1 : 0);
      }; place = places[i]; ++i) location = place.lat ? new GLatLng(place.lat, place.lng) : place.geometry.location, 
      marker = createMarker(GMarker, {
        map: map,
        icon: ricon,
        title: place.name,
        position: location,
        zIndex: 0
      }, {
        title: place.title || place.name,
        description: place.description || place.formatted_address,
        lat: "" + location.lat(),
        lng: "" + location.lng(),
        external_id: place.id || "",
        provider: "google"
      }), GEvent.addListener(marker, "click", marker_click, !1), GEvent.addListener(marker, "mouseover", marker_mouseover), 
      markers.push(marker), enable && bounds.extend(location);
      enable && map.fitBounds(bounds);
    },
    createMarker: function(GMarker, options, place, marker) {
      return marker = new GMarker(options), marker._place = place, marker;
    },
    zoom: function(n) {
      if (this.isGo) {
        this.sizeStatus = n;
        var self = this, component = self.component, element = component.element, GMaps = self.GMaps, map = self._map, markers = self.redMarkers;
        if (this.$wrap.toggleClass("gmap-big", !n), component.$resize.toggleClass("map-rc"), 
        component.$mask.toggleClass("hide", !n), n) element.css({
          top: component.otop,
          left: component.oleft
        }), self.$element.width(self.owidth).height(self.oheight), setTimeout(function() {
          map.setOptions(self.defaultOptions), map.setCenter(self._placeMarker ? self._placeMarker.getPosition() : self._userMarker.getPosition()), 
          self.hasPlace && self.panToRight();
        }, 0); else {
          var width = $win.width(), height = $win.height(), a = self.a, sT = $win.scrollTop(), sL = $win.scrollLeft();
          self.resize(width * (1 - 2 * a), height * (1 - a) - 56), element.css({
            top: 56 + sT,
            left: width * a + sL
          }), setTimeout(function() {
            map.setOptions(self.enableOptions);
          }, 0);
        }
        GMaps.event.trigger(map, "resize"), !self._placeMarker && markers.length && (self._placeMarker = markers[0]), 
        map.setCenter(self._placeMarker ? self._placeMarker.getPosition() : self._userMarker ? self._userMarker.getPosition() : null), 
        component.placeInput.$element.focusend();
      }
    },
    indexOf: function(markers, marker) {
      return R.indexOf(markers, marker);
    }
  };
  var parsePlace = function(placeString) {
    var ps = placeString.split(SPLITTER), title = ps.length ? $.trim(ps.shift()) : "", description = $.trim(ps.join(CR)).replace(SPLITTER, "");
    return {
      title: title,
      description: description
    };
  }, printPlace = function(title, description) {
    return title + (description ? CR + description.replace(SPLITTER, CR) : "");
  }, printDate = function(d) {
    return d.getUTCFullYear() + "-" + lead0(d.getUTCMonth() + 1) + "-" + lead0(d.getUTCDate()) + " " + lead0(d.getUTCHours()) + ":" + lead0(d.getUTCMinutes()) + ":" + lead0(d.getUTCSeconds()) + " +0000";
  }, selectionEnd = function(inputor) {
    return isIE ? getIESelectionEnd(inputor) : inputor.selectionEnd;
  }, getIESelectionEnd = function(inputor) {
    var r = document.selection.createRange(), re = inputor.createTextRange(), rc = re.duplicate();
    return re.moveToBookmark(r.getBookmark()), rc.setEndPoint("EndToStart", re), rc.text.length + r.text.length;
  }, loadMap = function(cb) {
    if (!window.google || !window.google.maps) {
      window._loadMaps = function() {};
      var gid = "google-maps-jsapi";
      $(gid).remove();
      var b = document.getElementsByTagName("body")[0], g = document.createElement("script");
      window._gmap = function() {
        delete window._gmap;
      }, window._loadMaps = function() {
        window.google.load("maps", "3", {
          other_params: "key=" + MAP_KEY + "&sensor=false&libraries=places",
          callback: function() {
            cb();
          }
        });
      }, g.async = "async", g.className = gid, g.src = "//www.google.com/jsapi?callback=_loadMaps", 
      b.appendChild(g);
    }
  };
  return MapPanel;
}), define(function(require) {
  "use strict";
  function _docddEventhandler(e) {
    return e.stopPropagation(), e.preventDefault(), !1;
  }
  function clearMenus() {
    $(toggle).removeClass("open");
  }
  function hover(e) {
    var self = $(this), timer = self.data("timer"), clicked = self.data("clicked"), $userPanel = self.find("div.user-panel").addClass("show"), h = -$userPanel.outerHeight();
    return e.preventDefault(), "mouseleave" !== e.type || clicked ? clicked ? (self.data("clicked", !1), 
    void 0) : timer ? (clearTimeout(timer), self.data("timer", timer = null), !1) : (_i_ || ($userPanel.css("top", h), 
    self.find(".user-panel").addClass("show"), _i_ = !0), self.prev().removeClass("hide"), 
    self.parent().addClass("user"), $userPanel.stop().animate({
      top: 56
    }, 100), void 0) : (timer = setTimeout(function() {
      _i_ = !1, $userPanel.stop().animate({
        top: h
      }, 200, function() {
        self.prev().addClass("hide"), self.parent().removeClass("user");
      }), clearTimeout(timer), self.data("timer", timer = null);
    }, 500), self.data("timer", timer), !1);
  }
  var $ = require("jquery"), Bus = require("bus"), Api = require("api"), Store = require("store"), Dialog = require("dialog"), dialogs = require("xdialog").dialogs, Identification = require("xdialog").Identification, IdentityPop = require("xidentity"), $BODY = $(document.body);
  $BODY.on("drop", _docddEventhandler).on("dragover", _docddEventhandler);
  var toggle = '[data-toggle="dropdown"]';
  $BODY.on("click.dropdown.data-api", clearMenus);
  var _i_ = !1;
  $BODY.on("mouseenter.dropdown mouseleave.dropdown", "#app-user-menu .dropdown-wrapper", hover), 
  $BODY.on("click.usermenu", '#app-user-menu .dropdown-wrapper a[href^="/#"]', function() {
    var self = $("#app-user-menu .dropdown-wrapper"), $userPanel = self.find("div.user-panel").addClass("show"), h = -$userPanel.outerHeight();
    $userPanel.css("top", h), self.prev().addClass("hide").end().parent().removeClass("user"), 
    self.data("clicked", !0);
  }), $BODY.on("click.usermenu", "#app-signout", function() {
    Bus.emit("xapp:cross:end"), $(".navbar .dropdown-wrapper").find(".user-panel").remove(), 
    $("#app-signin").show().next().hide().removeClass("user").find(".fill-left").addClass("hide").end().find("#user-name span").text(""), 
    Store.remove("cats"), Store.remove("user"), Store.remove("authorization"), window.location.href = "/";
  });
  var checkInvitationToken = function(token, invitation_token, cb) {
    Api.request("checkinvitationtoken", {
      type: "POST",
      params: {
        token: token
      },
      data: {
        invitation_token: invitation_token
      }
    }, function(data) {
      data.valid && cb();
    });
  }, __globlEvent = function(e) {
    var $t = $(this), auth = Store.get("authorization"), auth_user_id = auth && auth.user_id, auth_token = auth && auth.token, auth_user = Store.get("user"), actionType = $t.data("link"), $db = ($t.data("event-ignore"), 
    $("#app-browsing-identity")), status = $db.length;
    if (status) {
      var data = $db.data(), settings = data.settings, action = settings.action, code = settings.code, invitation_token = settings.invitation_token, tokenType = settings.tokenType, readOnly = settings.readOnly, browsing = settings.browsing;
      if (1 === code) {
        if (actionType) {
          e.stopImmediatePropagation(), e.stopPropagation(), e.preventDefault();
          var $d = $('<div id="read-only-browsing" data-destory="true" data-widget="dialog" data-dialog-type="read_only"></div>');
          return $d.data("settings", browsing), $("#app-tmp").append($d), $d.trigger("click"), 
          !1;
        }
      } else if (2 === code) {
        var buser_id = browsing.user_id;
        if ("SIGNIN" === action && auth_user_id && auth_user_id !== buser_id) {
          if (!actionType && "cross" !== tokenType) return e.stopImmediatePropagation(), e.stopPropagation(), 
          e.preventDefault(), checkInvitationToken(auth_token, invitation_token, function() {
            var $d = $('<div id="merge-identity" data-destory="true" data-widget="dialog" data-dialog-type="browsing_identity"></div>');
            $d.data("settings", {
              browsing: browsing,
              user: auth_user,
              token: auth_token,
              action: action,
              invitation_token: invitation_token
            }), $("#app-tmp").append($d), $d.trigger("click");
          }), !1;
        } else if ("SETUP" === action && !readOnly && !actionType) return e.stopImmediatePropagation(), 
        e.stopPropagation(), e.preventDefault(), auth_user_id && auth_user_id !== buser_id ? checkInvitationToken(auth_token, invitation_token, function() {
          var $d = $('<div id="merge-identity" data-destory="true" data-widget="dialog" data-dialog-type="browsing_identity"></div>');
          $d.data("settings", {
            browsing: browsing,
            user: auth_user,
            token: auth_token,
            action: action,
            invitation_token: invitation_token
          }), $("#app-tmp").append($d), $d.trigger("click");
        }) : $('[data-user-action="SETUP"]').trigger("click"), !1;
      }
    }
  };
  $BODY.on("click.data-link", "a[data-link], div[data-link], span[data-link]", __globlEvent), 
  $BODY.on("mousedown.data-link", "button[data-link], input[data-link], textarea[data-link]", __globlEvent), 
  Bus.on("app:cross:edited", function(data) {
    var $db = $("#app-browsing-identity"), settings = $db.data("settings"), $readOnly = $("#app-read-only");
    data && "no_permission" === data.error && ($readOnly.size() || $("#app-main").append($readOnly = $('<div id="app-read-only" data-widget="dialog" data-dialog-type="read_only"></div>').data("settings", settings && settings.browsing || Store.get("user"))), 
    $readOnly.trigger("click"));
  }), $BODY.on("click.dialog.data-api", '[data-widget="dialog"]', function(e) {
    var settings, $this = $(this), data = $this.data("dialog"), dialogType = $this.data("dialog-type"), dialogTab = $this.data("dialog-tab"), dialogFrom = $this.data("dialog-from"), dialogSettings = $this.data("dialog-settings");
    e.preventDefault(), data || dialogType && (settings = dialogs[dialogType], dialogSettings && (settings = $.extend(!0, {}, settings, dialogSettings)), 
    data = new ("identification" === dialogType ? Identification : Dialog)(settings), 
    data.options.srcNode = $this, dialogFrom && (data.dialog_from = dialogFrom), data.render(), 
    $this.data("dialog", data), $BODY.find('[data-dialog-type="' + dialogType + '"]').not($this).data("dialog", data)), 
    dialogTab && data.switchTab(dialogTab), data.show(e);
  });
  var identities = Store.get("identities");
  identities || (identities = []), $BODY.on("focus.typeahead.data-api", '[data-typeahead-type="identity"]', function(e) {
    var $this = $(this);
    $this.data("typeahead") || (e.preventDefault(), $this.data("typeahead", new IdentityPop({
      options: {
        source: identities,
        useCache: !0,
        target: $this,
        onNothing: function() {
          this.target.parent().removeClass("identity-avatar"), Bus.emit("widget-dialog-identification-nothing");
        },
        "onAutocomplete:finish": function(data) {
          var identity;
          data && (identity = data.identity) ? this.target.prev().attr("src", identity.avatar_filename).parent().addClass("identity-avatar") : this.target.parent().removeClass("identity-avatar"), 
          Bus.emit("widget-dialog-identification-auto", data);
        }
      }
    })));
  });
}), define("photox", function(require) {
  "use strict";
  var proto, $ = require("jquery"), R = require("rex"), Bus = require("bus"), request = require("api").request, Dialog = require("dialog"), Store = require("store"), dialogs = require("xdialog").dialogs, Handlebars = require("handlebars");
  Handlebars.registerHelper("px_imported", function(imported) {
    return imported > 0 ? imported : '<i class="ix-selected"></i>';
  });
  var DataCenter = {
    getPhotoX: function(photox_id, done) {
      return request("photox_getPhotoX", {
        resources: {
          photox_id: photox_id
        }
      }, done);
    },
    browseSource: function(photox_id, identity_id, album_id, bcb, done, fail) {
      var options = {}, data = {};
      return photox_id && (data.photox_id = photox_id), identity_id && (data.identity_id = identity_id), 
      album_id && (data.album_id = album_id), bcb && (options.beforeSend = bcb), options.data = data, 
      request("photox_borwseSource", options, done, fail);
    },
    getPhoto: function(photo_id, done) {
      return request("photox_getPhoto", {
        data: {
          photo_id: photo_id
        }
      }, done);
    },
    add: function(photox_id, post_args, bcb, done) {
      var options = {
        type: "POST",
        resources: {
          photox_id: photox_id
        },
        data: post_args
      };
      return bcb && (options.beforeSend = bcb), request("photox_add", options, done);
    },
    addAlbum: function(photox_id, identity_id, album_id, bcb, done) {
      return DataCenter.add(photox_id, {
        identity_id: identity_id,
        album_id: album_id
      }, bcb, done);
    },
    addStream: function(photox_id, identity_id, ids, bcb, done) {
      return DataCenter.add(photox_id, {
        identity_id: identity_id,
        ids: ids
      }, bcb, done);
    },
    addFeed: function(photox_id, stream_id, done) {
      return DataCenter.add(photox_id, {
        stream_id: stream_id
      }, done);
    },
    getLikes: function(photox_id, done) {
      return request("photox_getLikes", {
        resources: {
          photox_id: photox_id
        }
      }, done);
    },
    like: function(id, done) {
      return request("photox_like", {
        type: "POST",
        data: {
          id: id
        }
      }, done);
    },
    delAlbum: function(photox_id, provider, album_id, bcb, done) {
      return request("photox_del", {
        type: "POST",
        resources: {
          photox_id: photox_id
        },
        data: {
          provider: provider,
          album_id: album_id
        },
        beforeSend: bcb
      }, done);
    },
    delPhotos: function(photox_id, provider, photo_ids, bcb, done) {
      return request("photox_del", {
        type: "POST",
        resources: {
          photox_id: photox_id
        },
        data: {
          provider: provider,
          photo_ids: photo_ids
        },
        beforeSend: bcb
      }, done);
    }
  }, FS = function() {};
  proto = FS.prototype, proto.has = function() {
    return !!this.uid && !!this.gid;
  }, proto.find = function(path) {
    return R.indexOf(this.paths, path);
  }, proto.setUid = function(iid) {
    return this.uid = iid, this;
  }, proto.setGid = function(p) {
    return this.gid = p, this;
  }, proto.cd = function(path, deep, cb) {
    this.paths || (this.paths = []), deep = deep || 1, this.paths = this.paths.slice(0, deep);
    var i = this.find(path);
    return -1 === i ? this.paths.push(path) : this.paths = this.paths.slice(0, i + 1), 
    cb && cb(path, this), this;
  }, proto.clear = function(cb) {
    return this.paths && (this.paths.length = 0), cb && cb(), this;
  }, proto.prev = function(cb) {
    var ps = this.paths;
    ps.pop(), cb && cb(ps[ps.length - 1], ps);
  };
  var NavTabs = function(composition, selector, providers) {
    this.composition = composition, this.selector = selector, this.$element = composition.$(selector), 
    this.providers = providers, this.append(providers);
  };
  proto = NavTabs.prototype, proto.liTmp = '<li{{class}} data-provider="{{provider}}" data-iid="{{iid}}"><a href="#" class="hide-text""><i class="ix-provider ix-{{provider}}"></i></a></li>', 
  proto.badgeTmmp = '<div class="badge badgex"></div>', proto.generate = function(providers) {
    var p, t = this.liTmp, h = "";
    for (providers = providers.split(" "); p = providers.shift(); ) p = p.split(":"), 
    h += t.replace("{{class}}", +p[1] ? "" : ' class="no-oauth"').replace(/\{\{provider\}\}/g, p[0]).replace("{{iid}}", p[1]);
    return h;
  }, proto.append = function(providers) {
    this.$element.append(this.generate(providers));
  }, proto.switch = function(provider, keep) {
    var $e = this.$element, $l = $e.find('[data-provider="' + provider + '"]'), status = !0;
    return $l.hasClass("active") ? keep || $l.removeClass("active") : ($e.find(".active").removeClass("active"), 
    $l.addClass("active"), status = !1), status;
  }, proto.updateBadge = function(provider, n) {
    var t, $li = this.$element.find('> [data-provider="' + provider + '"]'), $badge = $li.find(".badge");
    $badge.length ? t = +$badge.text() : ($badge = $(this.badgeTmmp), $li.append($badge), 
    t = 0), $badge.text(t + n);
  };
  var Breadcrumb = function(composition, selector) {
    this.composition = composition, this.selector = selector, this.$element = composition.$(selector), 
    this.initstatus = 1;
  };
  proto = Breadcrumb.prototype, proto.liTmp = '<li data-iid="{{iid}}" data-eaid="{{aid}}"><a href="#">{{dir}}</a><span class="divider hidden"></span></li>', 
  proto.displayHome = function(iid) {
    var identities = Store.get("user").identities, identity = R.find(identities, function(v) {
      return v.id === iid ? !0 : void 0;
    });
    this.$element.append(this.generate(iid, "", identity.name + "'s Dropbox")), this.initstatus = 0;
  }, proto.generate = function(iid, eaid, dir) {
    return this.liTmp.replace("{{iid}}", iid).replace("{{eaid}}", eaid).replace("{{dir}}", dir);
  }, proto.show = function(iid) {
    var $e = this.$element;
    this.initstatus && this.displayHome(iid), this.del(1), $e.hasClass("hide") && $e.removeClass("hide");
  }, proto.del = function(n) {
    var $last = this.$element.find("li").slice(n - 1);
    $last.nextAll().remove(), $last.find(".divider").addClass("hidden");
  }, proto.add = function(iid, p) {
    var $li = $(this.generate(iid, p, p));
    this.$element.append($li), $li.prev().find(".divider").removeClass("hidden");
  }, proto.hide = function() {
    this.$element.addClass("hide");
  }, proto.toggle = function(status, iid) {
    status ? this.show(iid) : this.hide();
  };
  var Thumbnails = function(composition, selector) {
    this.composition = composition, this.selector = selector, this.$albums = composition.$(selector), 
    this.$parent = this.$albums.parent();
  };
  proto = Thumbnails.prototype, proto.liAlbumTmp = '{{#each albums}}<li data-provider="{{provider}}" data-iid="{{by_identity.id}}" data-eaid="{{external_id}}" data-imported="{{imported}}"><div class="thumbnail"><div class="badge album-badge badgex {{#unless imported}}hide{{/unless}}">{{{px_imported imported}}}</div><div class="photo"><div class="album-figure"></div>{{#if artwork}}<figure><img alt="" src="{{artwork}}" width="70" height="70" />{{else}}<figure class="placeholder ix-placehoder">{{/if}}</figure></div><h4 class="name">{{caption}}</h4></div></li>{{/each}}', 
  proto.liPhotoTmp = '{{#each photos}}<li data-provider="{{provider}}" data-iid="{{by_identity.id}}" data-imported="{{imported}}" data-epid="{{external_id}}" data-pid="{{id}}"><div class="thumbnail"><div class="badge album-badge badgex {{#unless imported}}hide{{/unless}}"><i class="ix-selected"></i></div><div class="photo"><div class="photo-figure"></div>{{#if images.preview.url}}<figure><img alt="" src="{{images.preview.url}}" width="70" height="70" />{{else}}<figure class="placeholder ix-placehoder">{{/if}}</figure></div><h4 class="name">{{caption}}</h4></div></li>{{/each}}', 
  proto.showAlbums = function() {
    var $albums = this.$albums, liAlbumTmp = this.liAlbumTmp, composition = this.composition, self = this, q = composition.q;
    q.push(DataCenter.browseSource(composition.cid, null, null, function() {
      composition.emit("toggle-loading", !0);
    }, function(data) {
      composition.emit("toggle-loading", !1);
      var al = data.albums.length, pl = data.photos.length;
      if (al + pl) {
        var at = Handlebars.compile(liAlbumTmp), ah = at(data), ph = self.genPhotosHTML(data);
        $albums.html(ah + ph);
      } else composition.emit("toggle-error", !1, "albums");
    }, function(data, code) {
      composition.emit("toggle-loading", !1), 400 === code ? composition.emit("toggle-error", !1, "albums") : composition.emit("toggle-error", !1, "ajax");
    }));
  }, proto.genPhotosHTML = function(data) {
    var pt = Handlebars.compile(this.liPhotoTmp), ph = pt(data);
    return ph;
  }, proto.hideAlbums = function() {
    this.$albums.addClass("hide");
  }, proto.switchByProvider = function(identityId, provider) {
    this.$albums.removeClass("hide").children().each(function() {
      var $li = $(this), p = $li.attr("data-provider");
      $li.toggleClass("hide", p !== provider);
    });
  }, proto.showAllAlbums = function() {
    this.$albums.removeClass("hide").find(" > .hide").removeClass("hide");
  }, proto.startUL = '<ul class="thumbnails photos hide">', proto.endUL = "</ul>", 
  proto.generate = function(data) {
    var at = Handlebars.compile(this.liAlbumTmp), pt = Handlebars.compile(this.liPhotoTmp), ah = at(data), ph = pt(data);
    return this.startUL + ah + ph + this.endUL;
  }, proto.showPhotos = function(data) {
    var $e;
    $e = $(this.generate(data)), this.$albums.append($e), $e.removeClass("hide"), this.$parent.append($e);
  }, proto.toggleBadge = function($t, status) {
    var $b = $t.find(".badge");
    $b.toggleClass("hide", status), $b.hasClass("hide") ? $t.attr("data-imported", "0") : ($t.attr("data-imported", "-2"), 
    $b.html('<i class="ix-selected"></i>'));
  }, proto.updateBadge = function(provider, i, s) {
    var $a = this.$albums.find('[data-provider="' + provider + '"]'), imported = ~~$a.attr("data-imported");
    s ? imported = i : -1 !== imported && (imported += i), $a.attr("data-imported", imported), 
    $a.find(".badge").text(imported).toggleClass("hide", !imported);
  };
  var Panel = require("panel"), PhotoXPanel = Panel.extend({
    options: {
      template: '<div class="panel photox-panel" id="photox-panel"><div class="clearfix panel-header"><h3 class="pull-left title panel-title"><i class="ix-wall ix-wall-blue"></i>&nbsp;PhotoX</h3><ul class="pull-right nav nav-tabs"></ul></div><div class="panel-body"><ul class="breadcrumb hide"></ul><div class="errors hide"><div class="albums-error hide"><p class="title">Oops, no photo to share.</p><p>Import photos from your account above.</p><br /><p>Collects photos from a variety of your web accounts.</p><p>and share with everyone’s all together in the ·X·.</p></div><div class="photos-error hide"><p class="title">Album empty.</p></div><div class="ajax-error hide"><p class="title">Network error. Please try to reload.</p></div></div><div class="loading hide"><img alt="" width="32" height="32" src="/static/img/loading.gif" /></div><ul class="thumbnails albums"></ul></div><div class="panel-footer"><div class="detail"><span class="selected-nums">0</span> pics selected</div><div class="icon-resize"></div><button class="xbtn-import">Import</button></div></div>',
      parentNode: null,
      srcNode: null
    },
    init: function() {
      var options = this.options;
      this.cid = options.crossId, this.providers = options.providers, delete options.providers, 
      this.navTabs = new NavTabs(this, ".panel-header .nav-tabs", this.providers), this.breadcrumb = new Breadcrumb(this, ".panel-body .breadcrumb"), 
      this.thumbnails = new Thumbnails(this, ".panel-body .albums"), this.fs = new FS(), 
      this.q = [], this.render(), this.listen();
    },
    listen: function() {
      var self = this, fs = self.fs, cid = self.cid, element = self.element, navTabs = self.navTabs, thumbnails = self.thumbnails, breadcrumb = self.breadcrumb, queue = self.q, $loading = self.element.find(".loading");
      element.on("click.photox", ".nav-tabs > li", function(e) {
        e.preventDefault(), e.stopPropagation(), self.killAjaxs(), self.emit("toggle-loading", !1), 
        self.emit("toggle-error", !0);
        var $that = $(this), iid = ~~$that.data("iid"), p = $that.data("provider");
        if (iid) navTabs.switch(p) ? (self.emit("show-albums"), breadcrumb.toggle(!1)) : self.emit("switch-provider", iid, p), 
        thumbnails.$albums.nextAll(".photos").remove(); else {
          var dialog = new Dialog(dialogs.addidentity);
          dialog.render(), dialog.element.find(".oauth-" + p).trigger("click");
        }
      }), element.on("click.photox", ".breadcrumb a", function(e) {
        e.preventDefault();
      }), element.on("mousedown.photox", ".thumbnails > li[data-eaid]", function(e) {
        e.preventDefault();
        var $t = $(this), d = $t.data(), iid = d.iid, p = d.provider, eaid = d.eaid, imported = ~~$t.attr("data-imported"), status = 0, timer = setTimeout(function() {
          if (status = 1, thumbnails.toggleBadge($t), -2 !== imported) {
            if (0 !== imported && -2 !== imported) return DataCenter.delAlbum(cid, p, eaid, null, function() {
              $t.attr("data-imported", "0"), Bus.emit("update-photoxwidget");
            }), void 0;
            var cb = function() {
              $t.attr("data-imported", "-1"), Bus.emit("update-photoxwidget");
            };
            "instagram" === p ? $.when(DataCenter.browseSource(cid, iid, eaid)).then(function(data) {
              var ps = data.photos, ids = R.map(ps, function(v) {
                return v.external_id;
              });
              DataCenter.addStream(cid, iid, JSON.stringify(ids), null, cb);
            }) : DataCenter.addAlbum(cid, iid, eaid, null, cb);
          }
        }, 987);
        $t.on("mouseup.photox", function() {
          if (clearTimeout(timer), $t.off("mouseup.photox"), !status) {
            if (navTabs.switch(p, !0), "dropbox" === p) {
              breadcrumb.toggle("dropbox" === p, iid);
              var eaids = decodeURIComponent(eaid).split("/"), len = eaids.length;
              eaid = eaids[len - 1], fs.has() || fs.setUid(iid).setGid(p).cd("/"), fs.cd(eaid, len, function(p) {
                breadcrumb.del(len), breadcrumb.add(iid, p);
              });
            }
            thumbnails.hideAlbums(), queue.push(DataCenter.browseSource(cid, iid, eaid, function() {
              self.emit("toggle-loading", !0);
            }, function(data) {
              self.emit("toggle-loading", !1);
              var al = data.albums.length, pl = data.photos.length, t = al + pl;
              t ? thumbnails.showPhotos(data, imported) : self.emit("toggle-error", !1, "photos");
            }, function(data, code, statusText) {
              code || "timeout" !== statusText || (self.emit("toggle-loading", !1), self.emit("toggle-error", !1, "ajax"));
            }));
          }
        });
      }), element.on("click.photox", ".thumbnails > li[data-epid]", function(e) {
        e.preventDefault(), e.stopPropagation();
        var $t = $(this), d = $t.data(), iid = d.iid, p = d.provider, epid = d.epid, pid = $t.attr("data-pid"), spid = '["' + pid + '"]', sepid = '["' + epid + '"]', imported = ~~$t.attr("data-imported");
        return -2 !== imported ? (thumbnails.toggleBadge($t), 0 !== imported && -2 !== imported ? (DataCenter.delPhotos(cid, p, spid, null, function(data) {
          var $tp = $t.parent(), $ts = $tp.children(), i = 0, photos = [];
          $t.attr("data-pid", 0), $t.attr("data-imported", 0), R.each(data.photox.photos, function(v) {
            p === v.provider && (i++, $t = $ts.filter('[data-epid="' + v.external_id + '"]'), 
            $t.size() || photos.push(v), $t.attr("data-imported", 1), $t.attr("data-pid", v.id), 
            $t.find(".badge").removeClass("hide"));
          }), i && $tp.append(thumbnails.genPhotosHTML({
            photos: photos
          })), self.emit("update-albums-badge", p, i, !0), Bus.emit("update-photoxwidget");
        }), void 0) : ("instagram" === p && DataCenter.addStream(cid, iid, sepid, null, function(data) {
          var ps = data.photox.photos, $tp = $t.parent(), $ts = $tp.children(), i = 0, photos = [];
          R.each(ps, function(v) {
            p === v.provider && (i++, $t = $ts.filter('[data-epid="' + v.external_id + '"]'), 
            $t.size() || d.photos.push(v), $t.attr("data-imported", 1), $t.attr("data-pid", v.id), 
            $t.find(".badge").removeClass("hide"));
          }), i && ($tp.append(thumbnails.genPhotosHTML({
            photos: photos
          })), self.emit("update-albums-badge", p, i, !0)), Bus.emit("update-photoxwidget");
        }), void 0)) : void 0;
      }), self.on("show-albums", function() {
        thumbnails.showAllAlbums();
      }), self.on("toggle-loading", function(b) {
        $loading[(b ? "remove" : "add") + "Class"]("hide");
      }), self.on("toggle-error", function(b, t) {
        var $es = element.find(".errors").toggleClass("hide", b);
        t && ($es.children().addClass("hide"), "albums" === t ? $es.find(".albums-error").removeClass("hide") : "photos" === t ? $es.find(".photos-error").removeClass("hide") : $es.find(".ajax-error").removeClass("hide"));
      }), self.on("update-albums-badge", function(provider, i, s) {
        thumbnails.updateBadge(provider, i, s);
      }), self.on("switch-provider", function(iid, p) {
        "dropbox" === p && fs.clear().setUid(iid).setGid(p).cd("/"), breadcrumb.toggle("dropbox" === p, iid), 
        thumbnails.switchByProvider(iid, p);
      });
    },
    showAfter: function() {
      var offset = this.srcNode.offset();
      this.element.css({
        top: offset.top,
        left: offset.left - 20
      }), this.thumbnails.showAlbums();
    },
    killAjaxs: function(a) {
      for (;a = this.q.shift(); ) a.abort();
    },
    destory: function() {
      this.killAjaxs(), this.element.off(), this.element.remove(), this._destory();
    }
  });
  return PhotoXPanel;
}), define("filehtml5", function(require) {
  function guid() {
    return "file-" + uuid++;
  }
  function proxy(f, c) {
    return function(e) {
      return f.call(c, e);
    };
  }
  var Class = require("class"), Emitter = require("emitter"), Win = window, FileHTML5 = Class.create(Emitter, {
    initialize: function(o) {
      var file = null;
      file = FileHTML5.isValidFile(o) ? o : FileHTML5.isValidFile(o.file) ? o.file : !1, 
      file && FileHTML5.canUpload() && (this._file = file, this._name = file.name || file.fileName, 
      this._size = file.size || file.fileSize, this._type = file.type, file.hasOwnProperty("lastModifiedDate") && (this._dateModified = file.lastModifiedDate)), 
      this._id = guid();
    },
    _uploadEventHandler: function(event) {
      var xhr = this._xhr, type = event.type;
      switch (type) {
       case "progress":
        this.emit("uploadprogress", {
          originEvent: event,
          bytesLoaded: event.loaded,
          bytesTotal: this._size,
          percentLoaded: Math.min(100, Math.round(1e4 * event.loaded / this._size) / 100)
        }), this._bytesUploaded = event.loaded;
        break;

       case "load":
        if (xhr.status >= 200 && 299 >= xhr.status) {
          this.emit("uploadcomplete", {
            originEvent: event,
            data: event.target.responseText
          });
          var xhrupload = xhr.upload, boundEventHandler = this._boundEventHandler;
          xhrupload.removeEventListener("progress", boundEventHandler), xhrupload.removeEventListener("crror", boundEventHandler), 
          xhrupload.removeEventListener("abort", boundEventHandler), xhr.removeEventListener("load", boundEventHandler), 
          xhr.removeEventListener("error", boundEventHandler), xhr.removeEventListener("readystatechange", boundEventHandler), 
          this._xhr = null;
        } else this.emit("uploaderror", {
          originEvent: event,
          status: xhr.status,
          statusText: xhr.statusText,
          source: "http"
        });
        break;

       case "error":
        this.emit("uploaderror", {
          originEvent: event,
          status: xhr.status,
          statusText: xhr.statusText,
          source: "FileHTML5"
        });
        break;

       case "abort":
        this.emit("uploadcancel", {
          originEvent: event
        });
        break;

       case "readystatechange":
        this.emit("readystatechange", {
          originEvent: event,
          readyState: event.target.readyState
        });
      }
    },
    startUpload: function(url, parameters, fileFieldName) {
      this._bytesUploaded = 0, this._xhr = new XMLHttpRequest(), this._boundEventHandler = proxy(this._uploadEventHandler, this);
      var key, uploadData = new FormData(), fileField = fileFieldName, xhr = this._xhr, xhrupload = xhr.upload, boundEventHandler = this._boundEventHandler;
      for (key in parameters) uploadData.append(key, parameters[key]);
      if (fileField && uploadData.append(fileField, this._file), xhr.addEventListener("loadstart", boundEventHandler, !1), 
      xhr.addEventListener("load", boundEventHandler, !1), xhr.addEventListener("error", boundEventHandler, !1), 
      xhr.addEventListener("abort", boundEventHandler, !1), xhr.addEventListener("loadend", boundEventHandler, !1), 
      xhr.addEventListener("readystatechange", boundEventHandler, !1), xhrupload.addEventListener("progress", boundEventHandler, !1), 
      xhrupload.addEventListener("error", boundEventHandler, !1), xhrupload.addEventListener("abort", boundEventHandler, !1), 
      xhr.open("POST", url, !0), xhr.withCredentials = !0, this._xhrHeaders) for (key in this._xhrHeaders) xhr.setRequestHeader(key, this._xhrHeaders[key]);
      xhr.send(uploadData), this.emit("uploadstart", {
        xhr: xhr
      });
    },
    cancelUpload: function() {
      this._xhr && this._xhr.abort();
    }
  });
  FileHTML5.isValidFile = function(file) {
    return Win && Win.File && file instanceof Win.File;
  }, FileHTML5.canUpload = function() {
    return Win && Win.FormData && Win.XMLHttpRequest;
  };
  var uuid = 0;
  return FileHTML5;
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
}), define("phonepanel", function(require) {
  "use strict";
  var $ = require("jquery"), Api = require("api"), rawPhone = "", curCntry = 0, last_get = "", avatar = "", areaInfos = require("countrycodes"), Panel = require("panel"), chooseCountry = function(index, soft) {
    areaInfos[index] !== void 0 && (curCntry = index, soft || $("#phone-panel .countrycode").val("+" + areaInfos[curCntry].country_code), 
    $(".tips-area .ta-countrycode").html(areaInfos[curCntry].short_name), formatPhone(), 
    checkPhone());
  }, formatPhone = function() {
    areaInfos[curCntry].format_long && areaInfos[curCntry].format_reg && areaInfos[curCntry].format_str && rawPhone.length === areaInfos[curCntry].format_long ? $("#phone-panel .phonenumber").val(rawPhone.replace(areaInfos[curCntry].format_reg, areaInfos[curCntry].format_str)) : $("#phone-panel .phonenumber").val(rawPhone);
  }, checkPhone = function() {
    getIdentity(), $("#phone-panel .countrycode").val() && $("#phone-panel .name").val() && rawPhone ? $("#phone-panel .add").prop("disabled", !1) : $("#phone-panel .add").prop("disabled", !0);
  }, escape = function(html, encode) {
    return html.replace(encode ? /&/g : /&(?!#?\w+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }, getIdentity = function() {
    var cur_get = "+" + areaInfos[curCntry].country_code + rawPhone;
    cur_get !== last_get && (Api.request("getIdentity", {
      type: "POST",
      data: {
        identities: JSON.stringify([ {
          provider: "phone",
          external_username: cur_get
        } ])
      }
    }, function(data) {
      data && data.identities && data.identities.length && data.identities[0].connected_user_id > 0 ? (avatar = data.identities[0].avatar_filename, 
      $("#phone-panel .identity-avatar").attr("src", avatar).show(), $("#phone-panel .identity-name").html(escape(data.identities[0].name)).show(), 
      $("#phone-panel .name").val(data.identities[0].name).hide(), $("#phone-panel .add").prop("disabled", !1)) : (avatar = "", 
      $("#phone-panel .identity-avatar").hide(), $("#phone-panel .identity-name").hide(), 
      $("#phone-panel .name").val("").show(), $("#phone-panel .add").prop("disabled", !0));
    }), last_get = cur_get);
  }, PhonePanel = Panel.extend({
    options: {
      template: '<div class="panel phone-panel" tabindex="-1" data-widget="panel" id="phone-panel"><div class="panel-body"><div class="main-info">Please complete contact info:</div><div class="clearfix input-area"><input class="countrycode" tabindex="4" type="text" /><input class="phonenumber" tabindex="5" type="text" /></div><div class="tips-area"><div class="ta-countrycode"></div><div class="ta-phonenumber">Area code and local number</div></div><ol class="clearfix complete-list"></ol><div class="name-area"><input class="name" type="text" tabindex="2" placeholder="Enter contact name" /><img class="identity-avatar"/><div class="identity-name"></div><button class="xbtn-blue add" tabindex="3" disabled="disabled">Add</button></div></div></div>',
      parentNode: null,
      srcNode: null
    },
    init: function() {
      var element, self = this;
      this.render(), element = this.element;
      for (var i = 0; areaInfos.length > i; i++) areaInfos[i].regular = RegExp(areaInfos[i].regular), 
      areaInfos[i].format_reg = areaInfos[i].format_reg ? RegExp(areaInfos[i].format_reg) : "", 
      "US" === areaInfos[i].short_name && (curCntry = i);
      this.listen(), $(document.body).on("click.phonepanel", function(e) {
        var $p = $("#phone-panel");
        return $p.length && $p[0] !== e.target && !$.contains($p[0], e.target) ? ($(document.body).off("click.phonepanel"), 
        self.hide(), void 0) : void 0;
      });
    },
    listen: function() {
      var self = this, element = this.element;
      element.on("keyup.phonepanel", ".countrycode", function(e) {
        var makeItem = function(idx) {
          return '<li country-code="' + idx + '">' + '<div class="li-countrycode">+' + areaInfos[idx].country_code + "</div>" + '<div class="li-countryname">' + areaInfos[idx].country_name + "</div>" + '<div class="li-tips">' + areaInfos[idx].support.join(" and ") + " supported</div>" + "</li>";
        };
        switch (e.keyCode) {
         case 38:
         case 40:
          return;

         case 13:
          var selected = $(".complete-list li.selected"), countryCode = ~~selected.attr("country-code");
          return chooseCountry(countryCode), element.find(".tips-area").show(), element.find(".complete-list").slideUp(), 
          void 0;
        }
        var found = "", match = -1, key = $(this).val().toLowerCase();
        if (key) if (/^\+[0-9]*/.test(key)) for (var i = 0; areaInfos.length > i; i++) "+" + areaInfos[i].country_code === key ? (found = makeItem(i) + found, 
        match = i) : -1 !== ("+" + areaInfos[i].search_index).indexOf(key) && (found += makeItem(i), 
        match = -1 === match ? i : match); else for (i = 0; areaInfos.length > i; i++) areaInfos[i].country_code === key ? (found = makeItem(i) + found, 
        match = i) : -1 !== areaInfos[i].search_index.indexOf(key) && (found += makeItem(i), 
        match = -1 === match ? i : match);
        element.find(".complete-list").html(found), found ? (element.find(".tips-area").hide(), 
        element.find(".complete-list").slideDown(), element.find(".complete-list li").eq(0).toggleClass("selected", !0), 
        chooseCountry(match, !0)) : (element.find(".tips-area").show(), element.find(".complete-list").slideUp());
      }), element.on("keydown.phonepanel", ".countrycode", function(e) {
        if (element.find(".complete-list").html()) {
          var selected = element.find(".complete-list li.selected"), cmpltList = element.find(".complete-list"), curIndex = ~~selected.index(), celHeight = 44, maxHeight = 3 * celHeight, maxIndex = element.find(".complete-list li").length - 1, curScroll = cmpltList.scrollTop();
          switch (e.keyCode) {
           case 38:
            event.preventDefault(), 0 > --curIndex && (curIndex = maxIndex);
            break;

           case 40:
            event.preventDefault(), ++curIndex > maxIndex && (curIndex = 0);
          }
          selected.toggleClass("selected", !1), element.find(".complete-list li").eq(curIndex).toggleClass("selected", !0);
          var curCellTop = curIndex * celHeight, curScrlTop = curCellTop - curScroll;
          0 > curScrlTop ? cmpltList.scrollTop(curCellTop) : curScrlTop + celHeight > maxHeight && cmpltList.scrollTop(curCellTop + celHeight - maxHeight + 1);
        }
      }), element.on("blur.phonepanel", ".countrycode", function() {
        chooseCountry(curCntry);
      }), element.on("focus.phonepanel", ".countrycode", function() {
        $(this).css("z-index", "1"), element.find(".phonenumber").css("z-index", "0");
      }), element.on("focus.phonepanel", ".phonenumber", function() {
        element.find(".phonenumber").val(rawPhone), element.find(".complete-list").html(""), 
        element.find(".tips-area").show(), element.find(".complete-list").slideUp(), $(this).prop("tabindex", "1"), 
        $(this).css("z-index", "1"), element.find(".countrycode").css("z-index", "0");
      }), element.on("blur.phonepanel", ".phonenumber", function() {
        var strPhone = element.find(".phonenumber").val().replace(/\-|\(|\)|\ /g, "");
        rawPhone = /^[0-9]*$/.test(strPhone) ? strPhone : "", formatPhone(), checkPhone(), 
        $(this).prop("tabindex", "5");
      }), element.on("mouseover.phonepanel", ".complete-list li", function() {
        $(this).siblings().filter(".selected").toggleClass("selected", !1), $(this).toggleClass("selected", !0);
      }), element.on("click.phonepanel", ".complete-list li", function() {
        var selected = $(this), countryCode = ~~selected.attr("country-code");
        chooseCountry(countryCode), element.find(".tips-area").show(), element.find(".complete-list").slideUp();
      }), element.on("keyup.phonepanel", ".name", function() {
        element.find(".complete-list").html(""), element.find(".tips-area").show(), element.find(".complete-list").slideUp();
      }), element.on("keydown.phonepanel", ".name", function(e) {
        if ($(this).val() && 13 === e.keyCode) {
          var phoneNumber = "+" + areaInfos[curCntry].country_code + rawPhone, name = element.find(".name").val();
          self.add({
            provider: "phone",
            external_id: phoneNumber,
            external_username: phoneNumber,
            name: name,
            avatar_filename: avatar ? avatar : ExfeeWidget.api_url + "/avatar/default?name=" + name
          }), self.hide();
        }
        checkPhone();
      }), element.on("click.phonepanel", ".add", function() {
        var phoneNumber = "+" + areaInfos[curCntry].country_code + rawPhone, name = element.find(".name").val();
        self.add({
          provider: "phone",
          external_id: phoneNumber,
          external_username: phoneNumber,
          name: name,
          avatar_filename: avatar ? avatar : ExfeeWidget.api_url + "/avatar/default?name=" + name
        }), self.hide();
      });
    },
    save: function() {
      this.$(".place-submit").trigger("click.mappanel");
    },
    showAfter: function() {
      var self = this, srcNode = self.srcNode;
      if (last_get = "", srcNode) {
        var offset = srcNode.offset(), element = self.element, height = srcNode.outerHeight();
        element.css({
          left: this.oleft = offset.left,
          top: this.otop = offset.top + height
        }), $("#phone-panel .identity-avatar").hide(), $("#phone-panel .identity-name").hide(), 
        rawPhone = srcNode.val().replace(/\-|\(|\)|\ /g, "");
        var fixedCntry = curCntry;
        if (/^\+.*$/.test(rawPhone)) for (var i = 0; areaInfos.length > i; i++) if (areaInfos[i].regular.test(rawPhone)) {
          rawPhone = rawPhone.replace(areaInfos[i].regular, ""), fixedCntry = i;
          break;
        }
        chooseCountry(fixedCntry), element.find(".name").focus();
      }
    },
    destory: function() {
      this.element.off(), this.element.remove(), this._destory();
    }
  });
  return PhonePanel;
}), define("photoxwidget", function(require) {
  "use strict";
  var request = require("api").request, R = require("rex"), Bus = require("bus"), Store = require("store"), PhotoXPanel = require("photox"), Mnemosyne = require("mnemosyne"), Widget = require("widget"), getPhotoX = function(photox_id, done) {
    return request("photox_getPhotoX", {
      resources: {
        photox_id: photox_id
      },
      data: {
        sort: "imported_time_desc",
        limit: 11
      }
    }, done);
  }, PhotoXWidget = Widget.extend({
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
      var options = this.options;
      this.parentNode = options.parentNode, this.srcNode = options.srcNode, this.crossId = options.crossId, 
      delete options.parentNode, delete options.srcNode, delete options.crossId, this.limited = 10, 
      this.$tr = this.element.find("tr"), this.listen();
    },
    listen: function() {
      var self = this;
      Bus.on("update-photoxwidget", function() {
        self.load();
      }), this.element.on("click.photoxwidget", ".btn-open, .tab-1", function(e) {
        if (e.preventDefault(), e.stopPropagation(), !$("#photox-panel").size()) {
          var i, user = Store.get("user"), identities = user.identities, photo_providers = [ "facebook", "instagram", "flickr", "dropbox" ], providers = photo_providers.slice(0), ips = [];
          R.each(identities, function(v) {
            i = R.indexOf(providers, v.provider), -1 !== i && (providers.splice(i, 1), ips.push(v.provider + ":" + v.id));
          }), ips.push(""), providers.push(""), providers = ips.join(" ") + providers.join(":0 ");
          var photoxPanel = new PhotoXPanel({
            options: {
              parentNode: $("#app-tmp"),
              srcNode: $(".cross-photox"),
              crossId: Cross.id,
              providers: providers
            }
          });
          photoxPanel.show(), self.photoxPanel = photoxPanel;
        }
      }), this.element.on("click.photoxwidget", ".table-wrapper", function(e) {
        if (e.preventDefault(), !$(".mnemosyne-panel").size()) {
          var user = Store.get("user"), mnemosyne = new Mnemosyne({
            options: {
              parentNode: $("#app-tmp"),
              srcNode: $(".table-wrapper"),
              crossId: Cross.id,
              userId: user.id
            }
          });
          mnemosyne.show();
        }
      }), $("body").on("click.photoxwidget", function(e) {
        var $p = $("#photox-panel");
        return $p.length && $p[0] !== e.target && !$.contains($p[0], e.target) ? (e.preventDefault(), 
        e.stopPropagation(), $p.trigger("destory.widget"), void 0) : void 0;
      });
    },
    generate: function(photos, b) {
      for (var image, tdTmp = this.options.tdTmp, i = 0, l = photos.length, html = ""; l > i; ++i) image = photos[i].images.preview, 
      html += tdTmp.replace("{{url}}", image.url).replace("{{height}}", 64).replace("{{width}}", 64 * image.width / image.height);
      return b && (html += this.options.tdTmpMore), html;
    },
    load: function() {
      var self = this, $tr = self.$tr, tabs = self.element.find(".tab"), tab0 = tabs.eq(0), tab1 = tabs.eq(1), limited = self.limited;
      this.defer && this.defer.abort(), this.defer = getPhotoX(this.crossId, function(data) {
        var photos = data.photox.photos, l = photos.length, b = l > limited;
        l ? (tab0.removeClass("hide"), tab1.addClass("hide"), b && (photos = photos.slice(0, limited)), 
        $tr.html(self.generate(photos, b))) : (tab0.addClass("hide"), tab1.removeClass("hide"));
      });
    },
    show: function() {
      return this.emit("showBefore"), this.element.appendTo(this.parentNode), this.emit("showAfter"), 
      this;
    }
  });
  return PhotoXWidget;
}), define("mnemosyne", function(require) {
  "use strict";
  for (var lastTime = 0, vendors = [ "ms", "moz", "webkit", "o" ], x = 0; vendors.length > x && !window.requestAnimationFrame; ++x) window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"], 
  window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
  window.requestAnimationFrame || (window.requestAnimationFrame = function(callback) {
    var currTime = new Date().getTime(), timeToCall = Math.max(0, 16 - (currTime - lastTime)), id = window.setTimeout(function() {
      callback(currTime + timeToCall);
    }, timeToCall);
    return lastTime = currTime + timeToCall, id;
  }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(id) {
    clearTimeout(id);
  });
  var VW, VH, proto, VOID = void 0, inViewport = function(t, r, b, l, h, w) {
    return (t >= 0 && h >= t || b >= 0 && h >= b) && (l >= 0 && w >= l || r >= 0 && w >= r);
  }, checkInViewport = function(e) {
    var r = e.getBoundingClientRect();
    return inViewport(r.top, r.right, r.bottom, r.left, VH, VW);
  }, slice = function(a, n) {
    for (var l = a.length, r = []; l > n; ++n) r.push(a[n]);
    return n;
  }, cos = Math.cos, sin = Math.sin, tan = Math.tan, abs = Math.abs, asin = Math.asin, sqrt = Math.sqrt, atan = Math.atan, atan2 = Math.atan2, min = Math.min, PI = Math.PI, PRECISION = 1e-6, Matrix = {
    precision: PRECISION,
    identity: function() {
      return [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ];
    },
    multiply: function multiply(b, d) {
      var h = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ];
      return h[0] = b[0] * d[0] + b[1] * d[4] + b[2] * d[8], h[1] = b[0] * d[1] + b[1] * d[5] + b[2] * d[9], 
      h[2] = b[0] * d[2] + b[1] * d[6] + b[2] * d[10], h[4] = b[4] * d[0] + b[5] * d[4] + b[6] * d[8], 
      h[5] = b[4] * d[1] + b[5] * d[5] + b[6] * d[9], h[6] = b[4] * d[2] + b[5] * d[6] + b[6] * d[10], 
      h[8] = b[8] * d[0] + b[9] * d[4] + b[10] * d[8], h[9] = b[8] * d[1] + b[9] * d[5] + b[10] * d[9], 
      h[10] = b[8] * d[2] + b[9] * d[6] + b[10] * d[10], h[12] = b[12] * d[0] + b[13] * d[4] + b[14] * d[8] + d[12], 
      h[13] = b[12] * d[1] + b[13] * d[5] + b[14] * d[9] + d[13], h[14] = b[12] * d[2] + b[13] * d[6] + b[14] * d[10] + d[14], 
      2 >= arguments.length ? h : multiply([ h ].concat(slice(arguments, 2)));
    },
    move: function(a, b) {
      return b[2] || (b[2] = 0), [ a[0], a[1], a[2], 0, a[4], a[5], a[6], 0, a[8], a[9], a[10], 0, a[12] + b[0], a[13] + b[1], a[14] + b[2], 1 ];
    },
    translate: function(a, b, d) {
      return "number" != typeof d && (d = 0), [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, a, b, d, 1 ];
    },
    scale: function(a, b, d) {
      return "number" != typeof d && (d = 1), [ a, 0, 0, 0, 0, b, 0, 0, 0, 0, d, 0, 0, 0, 0, 1 ];
    },
    rotateX: function(a, b) {
      return b = cos(a), a = sin(a), [ 1, 0, 0, 0, 0, b, a, 0, 0, -a, b, 0, 0, 0, 0, 1 ];
    },
    rotateY: function(a, b) {
      return b = cos(a), a = sin(a), [ b, 0, -a, 0, 0, 1, 0, 0, a, 0, b, 0, 0, 0, 0, 1 ];
    },
    rotateZ: function(a, b) {
      return b = cos(a), a = sin(a), [ b, a, 0, 0, -a, b, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ];
    },
    rotate: function(a, b, d, h, s, e, g) {
      return h = cos(a), a = sin(a), s = cos(b), b = sin(b), e = cos(d), d = sin(d), g = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ], 
      g[0] = s * e, g[1] = h * d + a * b * e, g[2] = a * d - h * b * e, g[4] = -s * d, 
      g[5] = h * e - a * b * d, g[6] = a * e + h * b * d, g[8] = b, g[9] = -a * s, g[10] = h * s, 
      g;
    },
    skew: function(a, b, d) {
      return [ 1, 0, 0, 0, tan(d), 1, 0, 0, tan(b), tan(a), 1, 0, 0, 0, 0, 1 ];
    },
    equal: function(a, b) {
      if (!a || !b) return !1;
      if (a == b) return !0;
      for (var d = 0, l = a.length; l > d; ++d) if (abs(a[d] - b[d]) >= PRECISION) return !1;
      return !0;
    },
    random: function(a) {
      for (a = a.slice(0), (a[0] == PI / 2 || a[0] == -PI / 2) && (a[0] = -a[0], a[1] = PI - a[1], 
      a[2] -= PI), a[0] > PI / 2 && (a[0] -= PI, a[1] = PI - a[1], a[2] -= PI), -PI / 2 > a[0] && (a[0] += PI, 
      a[1] = -PI - a[1], a[2] -= PI); -PI > a[1]; ) a[1] += 2 * PI;
      for (;a[1] >= PI; ) a[1] -= 2 * PI;
      for (;-PI > a[2]; ) a[2] += 2 * PI;
      for (;a[2] >= PI; ) a[2] -= 2 * PI;
      return a;
    },
    inverse: function(a, b, d, h, s, e, g, j, k, m, w, r) {
      return b = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ], d = a[5] * a[10] - a[6] * a[9], 
      h = a[4] * a[10] - a[6] * a[8], s = a[4] * a[9] - a[5] * a[8], e = a[1] * a[10] - a[2] * a[9], 
      g = a[0] * a[10] - a[2] * a[8], j = a[0] * a[9] - a[1] * a[8], k = a[1] * a[6] - a[2] * a[5], 
      m = a[0] * a[6] - a[2] * a[4], w = a[0] * a[5] - a[1] * a[4], r = 1 / (a[0] * d - a[1] * h + a[2] * s), 
      b[0] = r * d, b[1] = -r * e, b[2] = r * k, b[4] = -r * h, b[5] = r * g, b[6] = -r * m, 
      b[8] = r * s, b[9] = -r * j, b[10] = r * w, b[12] = -a[12] * b[0] - a[13] * b[4] - a[14] * b[8], 
      b[13] = -a[12] * b[1] - a[13] * b[5] - a[14] * b[9], b[14] = -a[12] * b[2] - a[13] * b[6] - a[14] * b[10], 
      b;
    },
    translateValues: function(a) {
      return [ a[12], a[13], a[14] ];
    },
    create: function(a) {
      var distance = function(x, y, z) {
        return d || (d = 0), sqrt(x * x + y * y + z * z);
      }, d = a[0] + distance(a[0], a[1], a[2]), h = 2 / (d * d + a[1] * a[1] + a[2] * a[2]), s = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ];
      s[0] = 1 - h * d * d, s[1] = -h * d * a[1], s[2] = -h * d * a[2], s[5] = 1 - h * a[1] * a[1], 
      s[6] = -h * a[1] * a[2], s[10] = 1 - h * a[2] * a[2], s[4] = s[1], s[8] = s[2], 
      s[9] = s[6], d = Matrix.multiply(a, s), h = distance(d[5], d[6]), d[5] > 0 && d[5] != h && (h *= -1), 
      h = d[5] + h;
      var e = 2 / (h * h + d[6] * d[6]), j = [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ];
      return j[5] = 1 - e * h * h, j[6] = -e * h * d[6], j[9] = j[6], j[10] = 1 - e * d[6] * d[6], 
      s = Matrix.multiply(s, j), d = Matrix.multiply(a, s), h = Matrix.scale(0 > d[0] ? -1 : 1, 0 > d[5] ? -1 : 1, 0 > d[10] ? -1 : 1), 
      d = Matrix.multiply(h, d), s = Matrix.multiply(s, h), h = {}, h.translate = Matrix.translateValues(a), 
      h.rotate = [ atan2(-s[6], s[10]), asin(s[2]), atan2(-s[1], s[0]) ], h.rotate[0] || (h.rotate[0] = 0, 
      h.rotate[2] = atan2(s[4], s[5])), h.scale = [ d[0], d[5], d[10] ], h.skew = [ atan(d[9] / h.scale[2]), atan(d[8] / h.scale[2]), atan(d[4] / h.scale[0]) ], 
      h;
    },
    translateTo: function(a) {
      var b = Matrix.scale(a.scale[0], a.scale[1], a.scale[2]), d = Matrix.skew(a.skew[0], a.skew[1], a.skew[2]), h = Matrix.rotate(a.rotate[0], a.rotate[1], a.rotate[2]);
      return Matrix.move(Matrix.multiply(b, d, h), a.translate);
    },
    toCSSMatrix3d: function(a, i, l) {
      for (a = a.slice(0), i = 0, l = a.length; l > i; ++i) PRECISION > abs(a[i]) && (a[i] = 0);
      return "matrix3d(" + a.join() + ")";
    }
  }, $ = require("jquery"), TWEEN = require("tween"), R = require("rex"), HumanTime = require("humantime"), Handlebars = require("handlebars"), Panel = require("panel"), request = require("api").request, addLike = function(photo_id, done, fail) {
    return request("photox_like", {
      type: "POST",
      data: {
        id: photo_id
      }
    }, done, fail);
  }, unLike = function(photo_id, done, fail) {
    return request("photox_like", {
      type: "POST",
      data: {
        id: photo_id,
        LIKE: !1
      }
    }, done, fail);
  }, getPhotoX = function(photox_id, before, done, fail) {
    return request("photox_getPhotoX", {
      resources: {
        photox_id: photox_id
      },
      beforeSend: before
    }, done, fail);
  }, mrandom = Math.random;
  Handlebars.registerHelper("photoxPrintTime", function(updated_at) {
    var d = HumanTime.parseISO(HumanTime.toISO(updated_at));
    return HumanTime.printTime(d);
  });
  var loadImage = function(f, url, cb, ecb) {
    var img = new Image(), abort = function(img) {
      img.onload = img.onerror = img = f = void 0;
    };
    img.onload = function() {
      cb && cb(img, f), abort(img);
    }, img.onerror = function() {
      ecb && ecb(img, f), abort(img);
    }, img.src = url;
  }, G_N = 0, extend = function(t, s, k) {
    for (k in s) t.hasOwnProperty(k) || (t[k] = s[k]);
    return t;
  }, random = function(n) {
    return parseInt(n * mrandom()) + 1;
  }, scaleWidthByHeight = function(h, d) {
    return h * d;
  }, scalForLarge = function(w0, h0, w1, h1) {
    var r = w1 / h1, rw = w1 / w0, rh = h1 / h0, w1 = min(w0, w1), h1 = min(h0, h1);
    return rh > rw ? w1 = h1 * r : h1 = w1 / r, [ w1, h1 ];
  }, scaleForSmall = function(w0, h0, w1, h1) {
    var r0 = w1 / h1, r1 = w0 / h0;
    return r1 > r0 ? (w1 = w0, h1 = w1 / r0) : (h1 = h0, w1 = h1 * r0), [ w1, h1 ];
  }, layoutCreator = function(g) {
    return extend({
      id: G_N++
    }, g);
  }, updateFigure = function(f, gid, ph, pw, rh, rw, rt, rl, provider) {
    f.setAttribute("data-gid", gid), f.style.opacity = 1, f.style.width = rw + "px", 
    f.style.height = rh + "px";
    var m4 = Matrix.translate(rl, rt, 6);
    if (f.style.webkitTransform = Matrix.toCSSMatrix3d(m4), f.style.transform = Matrix.toCSSMatrix3d(m4), 
    f._m4 = m4, "instagram" === provider && (pw *= 1.1, ph *= 1.1), "-1" === f.getAttribute("data-lazy")) f.setAttribute("data-whlt", [ pw, ph, (rw - pw) / 2, (rh - ph) / 2 ].join(",")); else {
      var style = f.querySelector("img").style;
      style.width = pw + "px", style.height = ph + "px", style.top = (rh - ph) / 2 + "px", 
      style.left = (rw - pw) / 2 + "px";
    }
  }, LAYOUTS = [ [ {
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
  } ] ], MNEMOSYNE = {}, RECT_TEMPLATE = '<figure class="surface" data-lazy="-1" data-id="{{id}}" data-preview-url="{{images.preview.url}}" data-preview-height="{{images.preview.height}}" data-preview-width="{{images.preview.width}}" data-fullsize-url="{{images.fullsize.url}}" data-fullsize-height="{{images.fullsize.height}}" data-fullsize-width="{{images.fullsize.width}}" data-liked="{{like}}" data-provider="{{provider}}" ><div class="photo"></div><div class="mask"></div><div class="btn-like ix-{{#unless like}}un{{/unless}}like"{{#unless like}} style="opacity: 0;"{{/unless}}></div><div class="meta"><div class="avatar"><img width="24" height="24" src="{{by_identity.avatar_filename}}" alt="" /></div><div class="title">{{caption}}</div><time>{{photoxPrintTime updated_at}}</time><div class="place"></div></div></figure>', Rect = MNEMOSYNE.Rect = function(data) {
    this.html = Handlebars.compile(RECT_TEMPLATE)(data);
  };
  Rect.prototype.toString = function() {
    return this.html;
  };
  var cellFactory = function(t, data) {
    return new MNEMOSYNE[t](data);
  }, G = function(photos, layout) {
    for (var p, b, cell, i = 0, html = ""; p = photos[i]; i++) b = layout[i], cell = cellFactory(b.type, p), 
    html += "" + cell;
    return html;
  }, Typesetting = function() {};
  proto = Typesetting.prototype, proto.defaultLayouts = LAYOUTS, proto.genLayouts = function(len) {
    for (var r, gs, g, layouts = LAYOUTS.slice(0), l = layouts.length, list = []; len; ) r = random(l > len ? len : l), 
    len -= r, gs = layouts[r - 1], g = gs[random(gs.length) - 1], list.push(layoutCreator(g));
    return list;
  };
  var SlideShow = function(component, $element) {
    this.component = component, this.$element = $element, this.animate = !0;
  };
  SlideShow.prototype.show = function(figure) {
    var $e = this.$element, s = $e[0].style;
    s.webkitTransform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, " + $("#app-tmp").scrollLeft() + ", 0, 10, 1)", 
    s.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, " + $("#app-tmp").scrollLeft() + ", 0, 10, 1)", 
    this.$element.attr("tabindex", "-1").focus(), this.clone(figure);
  }, SlideShow.prototype.exit = function() {
    var $e = this.$element, es = $e[0].style;
    $e.attr("tabindex", "none"), new TWEEN.Tween({
      o: 1
    }).to({
      o: 0
    }, 400).interpolation(TWEEN.Interpolation.Bezier).easing(TWEEN.Easing.Exponential.Out).onUpdate(function() {
      es.opacity = this.o;
    }).onComplete(function() {
      $e.empty();
    }).start(), this.img = this.curr = VOID, this.lockup = !1;
  }, SlideShow.prototype._clone_0 = function(f) {
    this.$element.empty(), this.lockup = !0;
    var self = this, r = f.getBoundingClientRect(), w = f.clientWidth, h = f.clientHeight, l = r.left, t = r.top, es = this.$element[0].style, pu = f.getAttribute("data-preview-url"), fu = f.getAttribute("data-fullsize-url"), fw = +f.getAttribute("data-fullsize-width"), fh = +f.getAttribute("data-fullsize-height"), sw = w / fw, sh = h / fh, _div = document.createElement("div");
    _div.setAttribute("class", "pic"), _div.style.width = fw + "px", _div.style.height = fh + "px";
    var _img = new Image();
    _img.src = pu;
    var m0 = Matrix.move(Matrix.multiply(Matrix.scale(sw, sh), Matrix.identity()), [ l, t, 1 ]);
    _div.style.webkitTransform = _div.style.transform = m0, loadImage(_div, fu, function(img, div) {
      img.width = fw, img.height = fh, img.src = fu, div.appendChild(img), img = VOID;
    }, function() {
      d.setAttribute("class", "load-failed");
    }), this.$element.append(_div), this.curr = f;
    var m1 = this.cal(fw, fh), style = _div.style;
    return _div._m4 = m1, new TWEEN.Tween(m0).to(m1, 400).interpolation(TWEEN.Interpolation.Bezier).easing(TWEEN.Easing.Exponential.Out).onUpdate(function(time) {
      var t = Matrix.toCSSMatrix3d(this);
      style.webkitTransform = style.transform = t, es.opacity = time;
    }).onComplete(function() {
      self.lockup = !1, _div._tween = null, TWEEN.remove(this);
    }).start(), _div;
  }, SlideShow.prototype.prev = function() {
    if (!this.lockup) {
      var prev, img = this.img, $curr = $(this.curr), $prev = $curr.prev(".surface");
      this.curr = ($prev.length ? $prev : $curr.parent().find(".surface").last())[0], 
      prev = this.clone(this.curr), this.effect(img, prev, -1);
    }
  }, SlideShow.prototype.next = function() {
    if (!this.lockup) {
      var next, img = this.img, $curr = $(this.curr), $next = $curr.next(".surface");
      this.curr = ($next.length ? $next : $curr.parent().find(".surface").first())[0], 
      next = this.clone(this.curr), this.effect(img, next, 1);
    }
  }, SlideShow.prototype.effect = function(curr, next, a) {
    this.lookup = !0;
    var self = this, cm = curr._m4, nm = next._m4, cs = curr.style, ns = next.style, cl = 50 * a;
    nm = Matrix.move(nm, [ -cl, 0, 0 ]), ns.webkitTransform = ns.transform = Matrix.toCSSMatrix3d(nm), 
    new TWEEN.Tween({
      x: 0
    }).to({
      x: cl
    }, 400).easing(TWEEN.Easing.Quadratic.InOut).onStart(function() {
      self.lockup = !0, $(curr).prevAll().remove();
    }).onUpdate(function(t) {
      cs.opacity = 1 - t, cs.webkitTransform = cs.transform = Matrix.toCSSMatrix3d(Matrix.move(cm, [ this.x, 0, 1 - t ])), 
      ns.opacity = t, ns.webkitTransform = ns.transform = Matrix.toCSSMatrix3d(Matrix.move(nm, [ this.x, 0, t ]));
    }).onComplete(function() {
      ns.opacity = 1, self.lockup = !1, TWEEN.remove(this);
    }).start();
  }, SlideShow.prototype.update = function() {
    var img = this.img, imgs = img.style, m4 = img._m4, f = this.curr, fw = +f.getAttribute("data-fullsize-width"), fh = +f.getAttribute("data-fullsize-height"), m = this.cal(fw, fh), toCSSMatrix3d = Matrix.toCSSMatrix3d;
    new TWEEN.Tween(m4).to(m, 144).easing(TWEEN.Easing.Quadratic.InOut).onUpdate(function() {
      imgs.webkitTransform = imgs.transform = toCSSMatrix3d([].slice.call(this));
    }).onComplete(function() {
      TWEEN.remove(this);
    }).start();
  }, SlideShow.prototype.cal = function(fw, fh) {
    var vw = this.vw, vh = this.vh, wh = scalForLarge(vw, vh, fw, fh), rw = wh[0], rh = wh[1], sw = rw / fw, sh = rh / fh, l = (vw - rw) / 2, t = (vh - rh) / 2;
    return Matrix.move(Matrix.multiply(Matrix.scale(sw, sh), Matrix.identity()), [ l, t, 1 ]);
  }, SlideShow.prototype._clone_1 = function(f) {
    var pu = f.getAttribute("data-preview-url"), fu = f.getAttribute("data-fullsize-url"), fw = +f.getAttribute("data-fullsize-width"), fh = +f.getAttribute("data-fullsize-height"), m = this.cal(fw, fh), _div = document.createElement("div");
    _div.setAttribute("class", "pic"), _div.style.width = fw + "px", _div.style.height = fh + "px", 
    _div._m4 = m;
    var _img = new Image();
    return _img.src = pu, m = Matrix.toCSSMatrix3d(m), _div.style.webkitTransform = _div.style.transform = m, 
    _div.style.opacity = 0, loadImage(_div, fu, function(img, div) {
      img.width = fw, img.height = fh, img.src = fu, div.appendChild(img), img = VOID;
    }, function(img, div) {
      div.setAttribute("class", "load-failed");
    }), this.$element.append(_div), _div;
  }, SlideShow.prototype.resize = function(w, h) {
    this.vw = w, this.vh = h, this.img && this.update();
  }, SlideShow.prototype.clone = function(figure) {
    var isNotFirst = !!this.curr;
    return this.curr = figure, this.img = this["_clone_" + (isNotFirst ? 1 : 0)](figure);
  };
  var Mnemosyne = Panel.extend({
    options: {
      template: '<div class="panel mnemosyne-panel perspective" tabindex="-1"><div class="panel-body perspective"><div class="gallery perspective group"></div></div></div><div class="slideshow-panel perspective group"></div>'
    },
    init: function() {
      var element, opts = this.options;
      this.crossId = opts.crossId, this.userId = opts.userId, delete opts.crossId, this.render(), 
      element = this.element, this.$appTmp = $("#app-tmp"), this.$mnemosyne = element.eq(0), 
      this.$gallery = this.$mnemosyne.find(".gallery"), this.$slideshow = element.eq(1), 
      this.typesetting = new Typesetting(), this.slideshow = new SlideShow(this, this.$slideshow), 
      this.i = 0, this.n = 0, this.offsetTop = 0, this.offsetLeft = 24, this.paddingRight = 30, 
      this.scrollLeft = 0, this.showPhotoStatus = !1, this.listen();
    },
    listen: function() {
      function animate() {
        self.frame = requestAnimationFrame(animate), TWEEN.update();
      }
      var self = this, typesetting = self.typesetting, slideshow = self.slideshow, $m = self.$mnemosyne, $g = self.$gallery, $s = self.$slideshow, $at = self.$appTmp, $WIN = $(window);
      animate(), $m.on("mouseenter.mnemosyne mouseleave.mnemosyne", ".gallery .surface", function(e) {
        e.preventDefault();
        var t = this, ts = t.style, $t = $(t), _m4 = this._m4, isMouseEnter = "mouseenter" === e.type, tween = $t.data("tween"), liked = +$t.attr("data-liked"), masks = t.querySelector(".mask").style, likes = t.querySelector(".btn-like").style, metas = t.querySelector(".meta").style, multiply = Matrix.multiply, scale = Matrix.scale, toCSSMatrix3d = Matrix.toCSSMatrix3d;
        tween || (tween = new TWEEN.Tween({
          v: 1
        }).easing(TWEEN.Easing.Cubic.InOut), $t.data("tween", tween)), tween.stop(), isMouseEnter ? tween.delay(233).to({
          v: 1.01
        }, 150).onUpdate(function(t) {
          masks.opacity = 4 * (this.v - 1), metas.opacity = t, 1 !== liked && (likes.opacity = t), 
          ts.transform = ts.webkitTransform = toCSSMatrix3d(multiply(scale(this.v, this.v), _m4));
        }) : tween.delay(0).to({
          v: 1
        }, 150).onUpdate(function(p) {
          masks.opacity = 4 * (this.v - 1), metas.opacity = .99 * (1 - p), 1 !== liked && (likes.opacity = 1 - p), 
          t.style.transform = ts.webkitTransform = toCSSMatrix3d(multiply(scale(this.v, this.v), _m4));
        }).onComplete(function() {
          $t.data("tween", null), TWEEN.remove(this);
        }), tween.start();
      }).on("click.mnemosyne", ".gallery .surface", function(e) {
        e.preventDefault(), self.scrollLeft = $at.scrollLeft(), $at.addClass("show-slideshow"), 
        self.emit("launch-slideshow", this);
      }).on("click.mnemosyne", ".surface .btn-like", function(e) {
        e.preventDefault(), e.stopPropagation();
        var $t = $(this), $p = $t.parent(), pid = +$p.data("id"), liked = +$p.attr("data-liked");
        return -2 !== liked ? ($p.attr("data-liked", -2), 1 === liked ? (unLike(pid, function() {
          $p.attr("data-liked", 0), $t.addClass("ix-unlike").removeClass("ix-like");
        }, function() {
          $p.attr("data-liked", 1);
        }), void 0) : (addLike(pid, function() {
          $p.attr("data-liked", 1), $t.addClass("ix-like").removeClass("ix-unlike");
        }, function() {
          $p.attr("data-liked", 0);
        }), void 0)) : void 0;
      }), $s.on("keydown.mnemosyne", function(e) {
        e.preventDefault();
        var keyCode = e.keyCode;
        switch (keyCode) {
         case 39:
         case 40:
          slideshow.next();
          break;

         case 38:
         case 37:
          slideshow.prev();
          break;

         case 27:
          e.stopPropagation(), self.emit("exit-slideshow");
        }
      }), $s.on("click.mnemosyne", function(e) {
        e.preventDefault(), "IMG" !== e.target.tagName && self.emit("exit-slideshow");
      }), $("html, body").bind("mousewheel.mnemosyne", function() {
        return !1;
      }), $at.bind("mousewheel.mnemosyne", function(e, d, x) {
        var left = $(this).scrollLeft(), pixels = left + x;
        return $(this).scrollLeft(pixels), !1;
      }), $at.on("scroll.mnemosyne", function(e) {
        e.preventDefault(), e.stopPropagation();
        var f, $fs = $g.find('[data-lazy="-1"]');
        if (0 !== $fs.length) for (var cb = function(img, f) {
          if (f) {
            $(f).removeClass("load-failed");
            var whlt = f.getAttribute("data-whlt").split(","), style = img.style;
            f.setAttribute("data-lazy", "1"), img.setAttribute("class", "pic"), style.width = whlt[0] + "px", 
            style.height = whlt[1] + "px", style.left = whlt[2] + "px", style.top = whlt[3] + "px", 
            style.opacity = 0, f.querySelector(".photo").appendChild(img), new TWEEN.Tween({
              v: 0
            }).to({
              v: 1
            }).easing(TWEEN.Easing.Cubic.InOut).onUpdate(function() {
              style.opacity = this.v;
            }).onComplete(function() {
              TWEEN.remove(this);
            }).start();
          }
        }, ecb = function(img, f) {
          f && (f.setAttribute("data-lazy", "-1"), $(f).addClass("load-failed"));
        }; (f = $fs.splice(0, 1)[0]) && checkInViewport(f); ) f.setAttribute("data-lazy", "0"), 
        loadImage(f, f.getAttribute("data-fullsize-url"), cb, ecb);
      }), $WIN.on("throttledresize.mnemosyne", function() {
        self.getViewport(), self.getGallery(), self.updateViewport(), self.update(), $at.trigger("scroll.mnemosyne");
      }), self.on("load-photos", function(data) {
        var photos = data.photox.photos, len = photos.length;
        len && this.emit("draw", photos, len);
      }), self.on("launch-slideshow", function(figure) {
        self.showPhotoStatus = !0;
        var gs = $g[0].style;
        new TWEEN.Tween({
          z: 3
        }).to({
          z: -610
        }, 400).easing(TWEEN.Easing.Exponential.Out).onUpdate(function(t) {
          gs.transform = gs.webkitTransform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, " + this.z + ", 1)", 
          gs.opacity = .1 * t;
        }).onComplete(function() {
          TWEEN.remove(this);
        }).start(), self.slideshow.show(figure);
      }), self.on("exit-slideshow", function() {
        self.showPhotoStatus = !1, $m.focus(), self.slideshow.exit();
        var gs = $g[0].style;
        new TWEEN.Tween({
          z: -610
        }).to({
          z: 1
        }, 400).interpolation(TWEEN.Interpolation.Bezier).easing(TWEEN.Easing.Exponential.Out).onUpdate(function(t) {
          $at.scrollLeft(self.scrollLeft), gs.transform = gs.webkitTransform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, " + this.z + ", 1)", 
          gs.opacity = .5 * (t + 1);
        }).onComplete(function() {
          $at.removeClass("show-slideshow"), TWEEN.remove(this);
        }).start();
      }), self.on("draw", function(photos, len) {
        var layouts = typesetting.genLayouts(len);
        this.drawPhotos(photos, layouts, len), $WIN.trigger("throttledresize.mnemosyne");
      }), $("body").on("click.mnemosyne", ".mnemosyne-exit", function(e) {
        e.preventDefault(), e.stopPropagation(), self.hide();
      });
    },
    updateViewport: function() {
      var x = window.scrollX, y = window.scrollY, matrix3d0 = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, " + x + ", " + y + ", 1, 1)", matrix3d1 = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, " + x + ", " + y + ", 3, 1)", matrix3d2 = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, " + x + ", " + y + ", 17, 1)", ms = $(".mnemosyne-bg")[0].style;
      ms.transform = ms.webkitTransform = matrix3d0;
      var as = this.$appTmp[0].style;
      as.transform = as.webkitTransform = matrix3d1;
      var mes = $(".mnemosyne-exit")[0].style;
      mes.transform = mes.webkitTransform = matrix3d2;
    },
    addMBG: function() {
      var matrix3d = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, " + window.scrollX + ", " + window.scrollY + ", 1, 1)", matrix3d1 = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, " + window.scrollX + ", " + window.scrollY + ", 20, 1)";
      matrix3d1 = "-webkit-transform:" + matrix3d1 + ";transform:" + matrix3d1 + ";", 
      $('<div class="mnemosyne-exit ix-exit" style="' + matrix3d1 + '"></div><div class="mnemosyne-bg perspective" style="-webkit-transform: ' + matrix3d + "; transform: " + matrix3d + ';"><div class="mnemosyne-bg-in"></div></div>').prependTo($("body"));
    },
    delMBG: function() {
      $(".mnemosyne-exit").remove(), $(".mnemosyne-bg").remove();
    },
    drawPhotos: function(photos, layouts, len) {
      var layout, cells, figure, $g = this.$gallery, i = 0, j = 0;
      for (this.layouts || (this.layouts = []), this.gid = this.layouts.length; layout = layouts[i++]; ) cells = layout.cells, 
      figure = G(photos.slice(j, j += cells.length), cells), $g.append(figure);
      this.layouts = this.layouts.concat(layouts), this.i = this.n, this.n += len;
    },
    update: function() {
      for (var layout, cells, cl, cell, aspect_ratio, $f, pw, ph, provider, margin, rw, rh, rl, rt, $g = this.$gallery, $fs = $g.find("figure").slice(this.i, this.n), gvw = this.gvw, gvh = this.gvh, gid = this.gid, layouts = this.layouts.slice(gid), offsetTop = this.offsetTop, offsetLeft = this.offsetLeft, index = 0, vh = gvh, vw = gvw; layout = layouts.shift(); ) {
        for (gid = layout.id, aspect_ratio = layout.aspect_ratio, cells = layout.cells.slice(), 
        cl = cells.length, aspect_ratio && (vw = scaleWidthByHeight(gvh, aspect_ratio)); cell = cells.shift(); ) {
          $f = $fs.eq(index), ph = +$f.data("preview-height"), pw = +$f.data("preview-width"), 
          provider = $f.data("provider"), 1 === cl && (vw = scaleWidthByHeight(gvh, pw / ph)), 
          margin = cell.margin, rh = cell.height * vh - margin.top - margin.bottom, rw = cell.width * vw - margin.left - margin.right, 
          rt = offsetTop + cell.y * vh + margin.top + (gvh - vh) / 2, rl = offsetLeft + cell.x * vw + margin.left;
          var wh = scaleForSmall(rw, rh, pw, ph);
          pw = wh[0], ph = wh[1], updateFigure($f[0], gid, ph, pw, rh, rw, rt, rl, provider), 
          index++;
        }
        offsetLeft += vw;
      }
      this.addPaddingRight(0, offsetLeft);
    },
    addPaddingRight: function(top, left) {
      var $g = this.$gallery, $pr = $g.find(".photos-padding-right");
      $pr.size() || ($pr = $('<div class="photos-padding-right"></div>').css({
        width: this.paddingRight
      })), $pr.css({
        "-webkit-transform": "translate3d(" + left + "px, " + top + "px, 0)",
        "-moz-transform": "translate3d(" + left + "px, " + top + "px, 0)",
        "-ms-transform": "translate3d(" + left + "px, " + top + "px, 0)",
        "-o-transform": "translate3d(" + left + "px, " + top + "px, 0)",
        transform: "translate3d(" + left + "px, " + top + "px, 0)"
      }), $g.append($pr);
    },
    getPhotos: function() {
      var self = this, userId = this.userId;
      getPhotoX(self.crossId, null, function(a) {
        var likes = a.likes, photos = a.photox.photos;
        R.each(photos, function(v) {
          var lk = likes[v.id];
          v.like = 0, lk && lk.length && R.each(lk, function(u) {
            u.object_id === v.id && u.by_identity.connected_user_id === userId && (v.like = 1);
          });
        }), self.emit("load-photos", a);
      });
    },
    getViewport: function() {
      var $r = this.element;
      this.vw = VW = $r.width(), this.vh = VH = $r.height(), this.slideshow.resize(this.vw, this.vh);
    },
    getGallery: function() {
      this.gvw = this.vw, this.gvh = this.vh - 40 - 60;
    },
    showBefore: function() {
      $("body").addClass("mnemosyne-start"), $("#app-tmp").css("-webkit-transform", "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, " + window.scrollX + ", " + window.scrollY + ", 3, 1)"), 
      $("#app-tmp").css("transform", "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, " + window.scrollX + ", " + window.scrollY + ", 3, 1)"), 
      this.getPhotos();
    },
    showAfter: function() {
      var $mbg = $(".mnemosyne-bg"), mbgStyle = $mbg[0].style, mbgInStyle = $mbg.find(".mnemosyne-bg-in")[0].style, $m = this.$mnemosyne, $at = ($m[0].style, 
      this.$appTmp), $g = this.$gallery, gs = $g[0].style, step0 = new TWEEN.Tween({
        v: 0
      }).to({
        v: 1
      }, 750).interpolation(TWEEN.Interpolation.Bezier).easing(TWEEN.Easing.Cubic.In).onUpdate(function() {
        mbgStyle.opacity = this.v;
      }).onComplete(function() {
        TWEEN.remove(this);
      }), step1 = new TWEEN.Tween({
        v: 0
      }).delay(250).to({
        v: 1
      }, 1e3).interpolation(TWEEN.Interpolation.Bezier).easing(TWEEN.Easing.Cubic.In).onUpdate(function() {
        mbgInStyle.opacity = this.v;
      }).onComplete(function() {
        TWEEN.remove(this);
      }), step2 = new TWEEN.Tween({
        v: 2584
      }).delay(250).to({
        v: 3
      }, 1500).interpolation(TWEEN.Interpolation.Bezier).easing(TWEEN.Easing.Cubic.In).onUpdate(function() {
        gs.webkitTransform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, " + this.v + ", 1)";
      }).onComplete(function() {
        $at.trigger("scroll.mnemosyne"), TWEEN.remove(this);
      });
      step0.start(), step1.start(), step2.start();
    },
    show: function() {
      return this.emit("showBefore"), this.escapable(), this.element.prependTo(this.parentNode), 
      this.addMBG(), this.emit("showAfter"), this;
    },
    hide: function() {
      TWEEN.removeAll();
      var self = this, mbgs = $(".mnemosyne-bg")[0].style, ms = self.$mnemosyne[0].style, ss = self.$slideshow[0].style;
      $(document).off("keydown.panel"), this.element.off(), new TWEEN.Tween({
        o: 1
      }).to({
        o: 0
      }, 250).easing(TWEEN.Easing.Cubic.In).onUpdate(function() {
        mbgs.opacity = ms.opacity = ss.opacity = this.o;
      }).onComplete(function() {
        self.destory(), TWEEN.removeAll();
      }).start();
    },
    destory: function() {
      this.delMBG(), $("html, body").unbind("mousewheel.mnemosyne"), $("body").off(".mnemosyne").removeClass("mnemosyne-start"), 
      $(".mnemosyne-exit").off("click.mnemosyne"), this.$appTmp.removeClass(".show-mnemosyne").off(".mnemosyne").css({
        "-webkit-transform": "none",
        transform: "none"
      }), $(window).off("throttledresize.mnemosyne"), cancelAnimationFrame(this.frame), 
      this.element.off(), this.element.remove(), this._destory();
    }
  });
  return Mnemosyne;
}), define("uploader", function(require, exports) {
  function readFileToImage(image, file) {
    if (window.URL && window.URL.revokeObjectURL) image.src = window.URL.createObjectURL(file); else if (window.webkitURL && window.webkitURL.createObjectURL) image.src = window.webkitURL.createObjectURL(file); else {
      var reader = new FileReader();
      reader.onload = function(e) {
        image.src = e.target.result;
      }, reader.readAsDataURL(file);
    }
  }
  function dataURItoBlob(dataURI) {
    var byteString;
    byteString = dataURI.split(",")[0].indexOf("base64") >= 0 ? atob(dataURI.split(",")[1]) : decodeURIComponent(dataURI.split(",")[1]);
    for (var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0], ab = new ArrayBuffer(byteString.length), ia = new Uint8Array(ab), i = 0, l = byteString.length; l > i; ++i) ia[i] = byteString.charCodeAt(i);
    var res, BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
    if (BlobBuilder) {
      var bb = new BlobBuilder();
      bb.append(ab), res = bb.getBlob(mimeString);
    } else res = new Blob([ ab ], {
      type: mimeString
    });
    return res;
  }
  function getAsPNGBlob(canvas, filename) {
    if (canvas.mozGetAsFile) return canvas.mozGetAsFile(filename, "image/png");
    var data = canvas.toDataURL("image/png"), blob = dataURItoBlob(data);
    return blob;
  }
  function saveCanvasAsFile(canvas, filename) {
    var blob = getAsPNGBlob(canvas, filename);
    return blob;
  }
  function Bitmap(image) {
    this.originalImage = image, this.width = image.width, this.height = image.height, 
    this.regX = image.width / 2, this.regY = image.height / 2, this.x = 0, this.y = 0, 
    this.alpha = 1, this.visible = !0, this.rotation = 0, this.scaleX = 1, this.scaleY = 1;
  }
  function Stage(canvas) {
    this.id = ++Stage.UID, this.canvas = canvas instanceof HTMLCanvasElement ? canvas : document.getElementById(canvas);
  }
  function lanczosCreate(lobes) {
    return function(x) {
      if (x > lobes) return 0;
      if (x *= Math.PI, 1e-16 > Math.abs(x)) return 1;
      var xx = x / lobes;
      return Math.sin(x) * Math.sin(xx) / x / xx;
    };
  }
  function Thumbnailer(elem, img, ocan, sx, lobes) {
    this.canvas = elem, elem.width = img.width, elem.height = img.height, elem.style.display = "none", 
    this.ctx = elem.getContext("2d"), this.ctx.drawImage(img, 0, 0), this.img = img, 
    this.ocan = ocan, this.src = this.ctx.getImageData(0, 0, img.width, img.height), 
    this.dest = {
      width: sx,
      height: Math.round(img.height * sx / img.width)
    }, this.dest.data = Array(3 * this.dest.width * this.dest.height), this.lanczos = lanczosCreate(lobes), 
    this.ratio = img.width / sx, this.rcp_ratio = 2 / this.ratio, this.range2 = Math.ceil(this.ratio * lobes / 2), 
    this.cacheLanc = {}, this.center = {}, this.icenter = {};
    var that = this;
    setTimeout(function() {
      that.process1(that, 0);
    }, 0);
  }
  function docUnBind() {
    $(document).off("mousemove.photozone").off("mouseup.photozone");
  }
  function docBind(_uploader) {
    $(document).on("mousemove.photozone", function(e) {
      function a1(sby) {
        0 === i ? (bitmap.scaleY = psy + sby, 0 > bitmap.scaleY && (bitmap.scaleY = sss / img.height), 
        bitmap.y -= bitmap.scaleY * img.height - bitmap.height) : 1 === i ? (bitmap.scaleX = psx + sby, 
        0 > bitmap.scaleX && (bitmap.scaleX = sss / img.width), bitmap.x -= bitmap.scaleX * img.width - bitmap.width) : 2 === i ? (bitmap.scaleY = psy + sby, 
        0 > bitmap.scaleY && (bitmap.scaleY = sss / img.height)) : (bitmap.scaleX = psx + sby, 
        0 > bitmap.scaleX && (bitmap.scaleX = sss / img.width));
      }
      function a3(sbx) {
        0 === i ? (bitmap.scaleX = psx + sbx, 0 > bitmap.scaleX && (bitmap.scaleX = sss / img.width), 
        bitmap.x -= bitmap.scaleX * img.width - bitmap.width) : 1 === i ? (bitmap.scaleY = psy + sbx, 
        0 > bitmap.scaleY && (bitmap.scaleY = sss / img.height)) : 2 === i ? (bitmap.scaleX = psx + sbx, 
        0 > bitmap.scaleX && (bitmap.scaleX = sss / img.width)) : (bitmap.scaleY = psy + sbx, 
        0 > bitmap.scaleY && (bitmap.scaleY = sss / img.height), bitmap.y -= bitmap.scaleY * img.height - bitmap.height);
      }
      function a4(sbx) {
        0 === i ? (bitmap.scaleX = psx + sbx, 0 > bitmap.scaleX && (bitmap.scaleX = sss / img.width)) : 1 === i ? (bitmap.scaleY = psy + sbx, 
        0 > bitmap.scaleY && (bitmap.scaleY = sss / img.height), bitmap.y -= bitmap.scaleY * img.height - bitmap.height) : 2 === i ? (bitmap.scaleX = psx + sbx, 
        0 > bitmap.scaleX && (bitmap.scaleX = sss / img.width), bitmap.x -= bitmap.scaleX * img.width - bitmap.width) : (bitmap.scaleY = psy + sbx, 
        0 > bitmap.scaleY && (bitmap.scaleY = sss / img.height));
      }
      function a6(sby) {
        0 === i ? (bitmap.scaleY = psy + sby, 0 > bitmap.scaleY && (bitmap.scaleY = sss / img.height)) : 1 === i ? (bitmap.scaleX = psx + sby, 
        0 > bitmap.scaleY && (bitmap.scaleY = sss / img.height)) : 2 === i ? (bitmap.scaleY = psy + sby, 
        0 > bitmap.scaleY && (bitmap.scaleY = sss / img.height), bitmap.y -= bitmap.scaleY * img.height - bitmap.height) : (bitmap.scaleX = psx + sby, 
        0 > bitmap.scaleX && (bitmap.scaleX = sss / img.width), bitmap.x -= bitmap.scaleX * img.width - bitmap.width);
      }
      e.preventDefault();
      var _u_ = _uploader;
      if (_u_ && _u_.dragging) {
        var dx = e.pageX - _u_.offset[0], dy = e.pageY - _u_.offset[1], bitmap = _u_.bitmap;
        switch (_u_.ri) {
         case 0:
          bitmap.x += dx, bitmap.y += dy;
          break;

         case 1:
          bitmap.x += dy, bitmap.y -= dx;
          break;

         case 2:
          bitmap.x -= dx, bitmap.y -= dy;
          break;

         case 3:
          bitmap.x -= dy, bitmap.y += dx;
        }
        return _u_.offset[0] = e.pageX, _u_.offset[1] = e.pageY, _u_.stage.update(), _u_.bitmap80.updateImage(_u_.stage.canvas), 
        _u_.stage80.update(), !1;
      }
      if (_u_ && _u_.resizing) {
        var dzx, dzy, sbx, sby, dx = e.pageX - _u_.aoffset[0], dy = e.pageY - _u_.aoffset[1], w = _u_.stage.canvas.width, h = _u_.stage.canvas.height, bitmap = _u_.bitmap, img = bitmap.originalImage, psx = _u_.psx, psy = _u_.psy, i = _u_.ri, ao = _u_.aoffset, sss = _u_.sss, canvasOffset = _u_._canvasOffset;
        if (dx || dy) {
          switch (_u_.anchor) {
           case 0:
            var dzr = Math.sqrt(Math.pow(e.pageX - w - canvasOffset.left, 2) + Math.pow(e.pageY - canvasOffset.top - h, 2)), r = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2));
            dzr -= _u_.dr, a1(dzr / r * sss), a3(dzr / r * sss);
            break;

           case 1:
            dzy = ao[1] - e.pageY, sby = dzy / h, a1(sby * sss), a3(sby * sss);
            break;

           case 2:
            var dzr = Math.sqrt(Math.pow(e.pageX - canvasOffset.left, 2) + Math.pow(e.pageY - canvasOffset.top - h, 2)), r = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2));
            dzr -= _u_.dr, a1(dzr / r * sss), a4(dzr / r * sss);
            break;

           case 3:
            dzx = ao[0] - e.pageX, sbx = dzx / w, a3(sbx * sss), a1(sbx * sss);
            break;

           case 4:
            dzx = e.pageX - ao[0], sbx = dzx / w, a4(sbx * sss), a6(sbx * sss);
            break;

           case 5:
            var dzr = Math.sqrt(Math.pow(e.pageX - w - canvasOffset.left, 2) + Math.pow(e.pageY - canvasOffset.top, 2)), r = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2));
            dzr -= _u_.dr, a3(dzr / r * sss), a6(dzr / r * sss);
            break;

           case 6:
            dzy = e.pageY - ao[1], sby = dzy / h, a4(sby * sss), a6(sby * sss);
            break;

           case 7:
            var dzr = Math.sqrt(Math.pow(e.pageX - canvasOffset.left, 2) + Math.pow(e.pageY - canvasOffset.top, 2)), r = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2));
            dzr -= _u_.dr, a4(dzr / r * sss), a6(dzr / r * sss);
          }
          _u_.stage.update(), _u_.bitmap80.updateImage(_u_.stage.canvas), _u_.stage80.update();
        }
        return !1;
      }
    }).on("mouseup.photozone", function() {
      if (_uploader) {
        if (_uploader.resizing || _uploader.dragging) {
          var img = document.createElement("img");
          img.onload = function() {
            new Thumbnailer(document.getElementById("real-avatar80"), this, _uploader.stage80.canvas, 80, 3);
          }, img.src = _uploader.stage.canvas.toDataURL("image/png");
        }
        _uploader.resizing = !1, _uploader.dragging = !1, _uploader.anchor = null, _uploader.bitmap && (_uploader.psx = _uploader.bitmap.scaleX, 
        _uploader.psy = _uploader.bitmap.scaleY);
      }
    });
  }
  var $ = require("jquery"), Store = (require("api"), require("store")), API_URL = window._ENV_.api_url, Dialog = require("dialog"), FileHTML5 = require("filehtml5"), Uploader = Dialog.extend({
    _fileInputField: null,
    _buttonBinding: null,
    queue: null,
    init: function() {
      this._fileInputField = null, this.queue = null, this._buttonBinding = null, this._fileList = [];
    },
    sync: function() {
      var $dropbox = this.$(".dropbox");
      this._fileInputField = $(Uploader.HTML5FILEFIELD_TEMPLATE), $dropbox.after(this._fileInputField), 
      this._bindDropArea(), this._fileInputField.on("change", $.proxy(this._updateFileList, this));
    },
    _bindSelectFile: function() {
      var fileinput = this._fileInputField[0];
      fileinput.click && fileinput.click();
    },
    _bindDropArea: function(e) {
      var ev = e || {
        prevVal: null
      };
      null !== ev.prevVal && (ev.prevVal.detach("drop", this._ddEventhandler), ev.prevVal.detach("dragenter", this._ddEventhandler), 
      ev.prevVal.detach("dragover", this._ddEventhandler), ev.prevVal.detach("dragleave", this._ddEventhandler));
      var _ddEventhandler = $.proxy(this._ddEventhandler, this);
      this.element.on("drop", ".modal-main", _ddEventhandler), this.element.on("dragenter", ".modal-main", _ddEventhandler), 
      this.element.on("dragover", ".modal-main", _ddEventhandler), this.element.on("dragleave", ".modal-main", _ddEventhandler);
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
        var modalmain = this.$(".modal-main")[0];
        if (!$.contains(modalmain, e.target) && e.target !== modalmain) return !1;
        this._fileselect(e.originalEvent.dataTransfer.files), this.emit("drop", e);
      }
      return !1;
    },
    _fileselect: function(files) {
      for (var newfiles = files, parsedFiles = [], i = (this.fileFilterFunction, 0), l = newfiles.length; l > i; i++) parsedFiles.push(new FileHTML5(newfiles[i]));
      this.options.limit && (parsedFiles = parsedFiles.slice(-this.options.limit)), parsedFiles.length > 0 && this.emit("fileselect", {
        fileList: parsedFiles
      });
    },
    _updateFileList: function(e) {
      this._fileselect(e.target.files);
    },
    fileFilterFunction: function(file) {
      var r = !1;
      return /^image\/(png|gif|bmp|jpg|jpeg)$/.test(file._type) && (r = !0), r;
    }
  }, {
    HTML5FILEFIELD_TEMPLATE: '<input type="file" style="visibility:hidden; width:0px; height:0px;" />'
  }), uploadSettings = {
    errors: {
      server: "Failed to open, please try again.",
      format: "File format not supported.",
      size: "File is too large."
    },
    checkFile: function(file) {
      return this.checkFileFormat(file) ? !1 : this.checkFileSize(file) ? !1 : !0;
    },
    checkFileSize: function(file) {
      var maxSize = 3145728, b = !1;
      return this.emit("toggleError", b = file._size > maxSize, "size"), b;
    },
    checkFileFormat: function(file) {
      var b = !this.fileFilterFunction(file);
      return this.emit("toggleError", b, "format"), b;
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
      var that = this;
      this.filehtml5._xhrHeaders = {
        Accept: "application/json, text/javascript, */*; q=0.01"
      }, this.filehtml5.on("uploadcomplete", function(e) {
        var b = !0;
        that.$(".loading").addClass("hide"), that.$(".zoom").show(), data = JSON.parse(e.data), 
        data && 200 === data.meta.code && (b = !1, "user" === data.response.type ? $(".user-avatar .avatar, .user-panel .avatar").find("img").attr("src", data.response.avatars["80_80"]) : $('.identity-list li[data-identity-id="' + data.response.identity_id + '"] .avatar').find("img").attr("src", data.response.avatars["80_80"])), 
        that.emit("toggleError", b, "server"), that.hide();
      }), this.filehtml5.on("uploadstart", function() {
        that.$(".loading").removeClass("hide"), that.$(".upload-done").prop("disabled", !0);
      });
    },
    options: {
      limit: 1,
      onHideAfter: function() {
        var $e = this.element;
        this.offSrcNode(), this.destory(), $e.remove();
      },
      onShowBefore: function() {
        docBind(this);
      },
      onShowAfter: function(data) {
        if (this._data = data, this._canvasOffset = this.$("#avatar240").offset(), data.original) {
          var input = document.createElement("input");
          input.type = "file", this.filehtml5 = new FileHTML5(input.files), this.filehtml5Bind(), 
          this.$(".overlay").addClass("hide"), this.$(".resizeable").removeClass("hide"), 
          this.$(".upload-done").prop("disabled", !1).show(), this.$(".upload-clear").hide(), 
          this.$(".zoom").show();
          var self = this;
          self.ri = 0, self.R = [ 0, 0 ];
          var bitmap, bitmap80, canvas = document.getElementById("avatar240"), canvas80 = document.getElementById("avatar80"), stage = (self.r, 
          new Stage(canvas)), stage80 = new Stage(canvas80), originalImage = document.getElementById("img-avatar");
          originalImage.onload = function() {
            var min = Math.min(originalImage.width, originalImage.height);
            self.sss = 1, min > 240 && (self.sss = 240 / min), bitmap = new Bitmap(originalImage), 
            self.psx = bitmap.scaleX = self.sss, self.psy = bitmap.scaleY = self.sss, bitmap.setPosition(canvas.width / 2 - (bitmap.regX *= bitmap.scaleX), canvas.height / 2 - (bitmap.regY *= bitmap.scaleY)), 
            bitmap.rotation = self.ri, bitmap.updateContext = function(ctx) {
              ctx.translate(canvas.width * self.R[0], canvas.height * self.R[1]), ctx.rotate(this.rotation * Stage.DEG_TO_RAD), 
              ctx.webkitImageSmoothingEnabled = ctx.mozImageSmoothingEnabled = !1;
            }, stage.addChild(bitmap), stage.update(), self.bitmap = bitmap, self.stage = stage, 
            bitmap80 = new Bitmap(canvas), bitmap80.updateImage = function(canvas) {
              bitmap80.originalImage = canvas;
            }, bitmap80.updateContext = function(ctx) {
              ctx.scale(self.SCALE, self.SCALE), ctx.webkitImageSmoothingEnabled = ctx.mozImageSmoothingEnabled = !1;
            }, stage80.addChild(bitmap80), stage80.update(), self.bitmap80 = bitmap80, self.stage80 = stage80;
            var img = document.createElement("img");
            img.onload = function() {
              new Thumbnailer(document.getElementById("real-avatar80"), this, stage80.canvas, 80, 3);
            }, img.src = canvas.toDataURL("image/png");
          }, originalImage.crossOrigin = "anonymous", originalImage.src = data.original;
        }
      },
      onHideAfter: function() {
        this.filehtml5 && this.filehtml5.cancelUpload();
        var $e = this.element;
        this.offSrcNode(), this.destory(), $e.remove(), docUnBind();
      },
      onToggleError: function(b, errorType) {
        b ? this.$(".xalert-error").html(this.errors[errorType]).removeClass("hide") : this.$(".xalert-error").addClass("hide");
      },
      onDrop: function() {},
      onFileselect: function(data) {
        var filehtml5, files = data.fileList;
        if (files.length) {
          if (filehtml5 = this.filehtml5 = files[0], !this.checkFile(filehtml5)) return !1;
          this.filehtml5Bind(), this.$(".overlay").addClass("hide"), this.$(".resizeable").removeClass("hide"), 
          this.$(".upload-done").prop("disabled", !1).show(), this.$(".upload-clear").hide(), 
          this.$(".zoom").hide();
          var self = this;
          self.ri = 0, self.R = [ 0, 0 ];
          var bitmap, bitmap80, canvas = document.getElementById("avatar240"), canvas80 = document.getElementById("avatar80"), stage = (self.r, 
          new Stage(canvas)), stage80 = new Stage(canvas80), originalImage = document.getElementById("img-avatar");
          originalImage.onerror = originalImage.onload = function() {
            var image = originalImage, min = Math.min(originalImage.width, originalImage.height);
            if (self.sss = 1, min > 240 && (self.sss = 240 / min), "image/gif" === self.filehtml5._type) {
              var ccc = document.createElement("canvas"), ccctx = ccc.getContext("2d");
              ccc.width = image.width, ccc.height = image.height, ccctx.drawImage(image, 0, 0, ccc.width, ccc.height), 
              image = ccc;
            }
            bitmap = new Bitmap(image), self.psx = bitmap.scaleX = self.sss, self.psy = bitmap.scaleY = self.sss, 
            bitmap.setPosition(canvas.width / 2 - (bitmap.regX *= bitmap.scaleX), canvas.height / 2 - (bitmap.regY *= bitmap.scaleY)), 
            bitmap.rotation = self.ri, bitmap.updateContext = function(ctx) {
              ctx.translate(canvas.width * self.R[0], canvas.height * self.R[1]), ctx.rotate(this.rotation * Stage.DEG_TO_RAD), 
              ctx.webkitImageSmoothingEnabled = ctx.mozImageSmoothingEnabled = !1;
            }, stage.addChild(bitmap), stage.update(), self.bitmap = bitmap, self.stage = stage, 
            bitmap80 = new Bitmap(canvas), bitmap80.updateImage = function(canvas) {
              bitmap80.originalImage = canvas;
            }, bitmap80.updateContext = function(ctx) {
              ctx.scale(self.SCALE, self.SCALE), ctx.webkitImageSmoothingEnabled = ctx.mozImageSmoothingEnabled = !1;
            }, stage80.addChild(bitmap80), stage80.update(), self.bitmap80 = bitmap80, self.stage80 = stage80;
            var img = document.createElement("img");
            img.onload = function() {
              new Thumbnailer(document.getElementById("real-avatar80"), this, stage80.canvas, 80, 3);
            }, img.src = canvas.toDataURL("image/png");
          }, originalImage.crossOrigin = "anonymous", readFileToImage(originalImage, filehtml5._file);
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
          var self = this, img = document.createElement("img");
          return img.onload = function() {
            new Thumbnailer(document.getElementById("real-avatar80"), this, self.stage80.canvas, 80, 3);
          }, img.src = self.stage.canvas.toDataURL("image/png"), !1;
        },
        "hover .avatar240": function(e) {
          "mouseenter" === e.type ? this.$(".upload, .rotate").show() : this.$(".upload, .rotate").hide();
        },
        "hover .overlay": function(e) {
          if (this._data.original) {
            var enter = "mouseenter" === e.type;
            $(e.currentTarget).hasClass("dropbox") && this.$(".back")[enter ? "show" : "hide"]();
          }
        },
        "click .back": function() {
          return this.$(".overlay").addClass("hide"), this.$(".resizeable").removeClass("hide"), 
          this.$(".upload-done").prop("disabled", !1), this.$(".upload, .rotate, .upload-done").show(), 
          this.$(".back, .upload-clear").hide(), !1;
        },
        "click .smallphoto": function(e) {
          e.preventDefault();
          var src = "";
          if (!this.bitmap) return !1;
          if ($.browser.safari && !/chrome/.test(navigator.userAgent.toLowerCase())) {
            var canvas = document.createElement("canvas"), ctx = canvas.getContext("2d");
            canvas.width = this.bitmap.originalImage.width, canvas.height = this.bitmap.originalImage.height, 
            ctx.drawImage(this.bitmap.originalImage, 0, 0, canvas.width, canvas.height), src = canvas.toDataURL("image/png");
          } else src = this.bitmap.originalImage.src;
          return window.open(src);
        },
        "mousedown .resizeable": function(e) {
          e.preventDefault();
          var $e = $(e.target), anchor = this.anchor = $e.data("anchor");
          this.resizing = !0, this.aoffset = [ e.pageX, e.pageY ];
          var offset = this._canvasOffset;
          return 7 === anchor ? this.dr = Math.sqrt(Math.pow(e.pageX - offset.left, 2) + Math.pow(e.pageY - offset.top, 2)) : 5 === anchor ? this.dr = Math.sqrt(Math.pow(e.pageX - offset.left - 240, 2) + Math.pow(e.pageY - offset.top, 2)) : 0 === anchor ? this.dr = Math.sqrt(Math.pow(e.pageX - offset.left - 240, 2) + Math.pow(e.pageY - offset.top - 240, 2)) : 2 === anchor && (this.dr = Math.sqrt(Math.pow(e.pageX - offset.left, 2) + Math.pow(e.pageY - offset.top - 240, 2))), 
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
          var data = {}, authorization = Store.get("authorization"), token = authorization.token;
          return this._data.identity_id && (data.identity_id = this._data.identity_id), this.filehtml5.startUpload(API_URL + "/avatar/update?token=" + token, data), 
          !1;
        },
        "click .upload-done": function() {
          var self = this, bitmap = this.bitmap, originalImage = bitmap.originalImage;
          this.stage, this.stage80;
          var min = 240 / this.sss, x = bitmap.x / this.sss, y = bitmap.y / this.sss, oc = document.createElement("canvas");
          oc.width = oc.height = min;
          var os = new Stage(oc), ob = new Bitmap(originalImage);
          ob.setPosition(x, y), ob.rotation = 90 * this.ri, ob.scaleX = bitmap.scaleX / this.sss, 
          ob.scaleY = bitmap.scaleY / this.sss, ob.updateContext = function(ctx) {
            ctx.translate(oc.width * self.R[0], oc.height * self.R[1]), ctx.rotate(this.rotation * Stage.DEG_TO_RAD), 
            ctx.webkitImageSmoothingEnabled = ctx.mozImageSmoothingEnabled = !1;
          }, os.addChild(ob), os.update();
          var img0 = saveCanvasAsFile(os.canvas, "original.png"), img1 = saveCanvasAsFile(document.getElementById("real-avatar80"), "80_80.png"), that = this;
          setTimeout(function() {
            var data = {
              original: img0,
              "80_80": img1
            }, authorization = Store.get("authorization"), token = authorization.token;
            that._data.identity_id && (data.identity_id = that._data.identity_id), that._data = data, 
            that.filehtml5.startUpload(API_URL + "/avatar/update?token=" + token, data);
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
  Bitmap.prototype = {
    setPosition: function(x, y) {
      this.x = x || 0, this.y = y || 0;
    },
    updateContext: function() {},
    updateRect: function() {
      this.width = this.originalImage.width * this.scaleX, 0 > this.width && (this.width = 1, 
      this.scaleX = this.width / this.originalImage.width), this.height = this.originalImage.height * this.scaleY, 
      0 > this.height && (this.height = 1, this.scaleY = this.height / this.originalImage.height);
    },
    draw: function(ctx) {
      this.updateRect(), ctx.drawImage(this.originalImage, this.x, this.y, this.width - 1, this.height - 1);
    }
  }, Stage.UID = 0, Stage.DEG_TO_RAD = Math.PI / 180, Stage.prototype = {
    toDataURL: function() {},
    clear: function() {
      var ctx = this.canvas.getContext("2d");
      ctx.setTransform(1, 0, 0, 1, 0, 0), ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    addChild: function(child) {
      return this._children || (this._children = []), this.parent = this, this._children.push(child), 
      child;
    },
    draw: function() {
      var i, l, ctx, list = this._children;
      if (list && (l = this._children.length)) for (ctx = this.canvas.getContext("2d"), 
      this.clear(), i = 0; l > i; i++) {
        var child = list[i];
        ctx.save(), child.updateContext(ctx), child.draw(ctx), ctx.restore();
      }
    },
    update: function() {
      this.draw();
    }
  }, Thumbnailer.prototype.process1 = function(self, u) {
    self.center.x = (u + .5) * self.ratio, self.icenter.x = Math.floor(self.center.x);
    for (var v = 0; self.dest.height > v; v++) {
      self.center.y = (v + .5) * self.ratio, self.icenter.y = Math.floor(self.center.y);
      var a, r, g, b;
      a = r = g = b = 0;
      for (var i = self.icenter.x - self.range2; self.icenter.x + self.range2 >= i; i++) if (!(0 > i || i >= self.src.width)) {
        var f_x = Math.floor(1e3 * Math.abs(i - self.center.x));
        self.cacheLanc[f_x] || (self.cacheLanc[f_x] = {});
        for (var j = self.icenter.y - self.range2; self.icenter.y + self.range2 >= j; j++) if (!(0 > j || j >= self.src.height)) {
          var f_y = Math.floor(1e3 * Math.abs(j - self.center.y));
          void 0 == self.cacheLanc[f_x][f_y] && (self.cacheLanc[f_x][f_y] = self.lanczos(Math.sqrt(Math.pow(f_x * self.rcp_ratio, 2) + Math.pow(f_y * self.rcp_ratio, 2)) / 1e3));
          var weight = self.cacheLanc[f_x][f_y];
          if (weight > 0) {
            var idx = 4 * (j * self.src.width + i);
            a += weight, r += weight * self.src.data[idx], g += weight * self.src.data[idx + 1], 
            b += weight * self.src.data[idx + 2];
          }
        }
      }
      var idx = 3 * (v * self.dest.width + u);
      self.dest.data[idx] = r / a, self.dest.data[idx + 1] = g / a, self.dest.data[idx + 2] = b / a;
    }
    ++u < self.dest.width ? setTimeout(function() {
      self.process1(self, u);
    }, 0) : setTimeout(function() {
      self.process2(self);
    }, 0);
  }, Thumbnailer.prototype.process2 = function(self) {
    self.canvas.width = self.dest.width, self.canvas.height = self.dest.height, self.ctx.drawImage(self.img, 0, 0), 
    self.src = self.ctx.getImageData(0, 0, self.dest.width, self.dest.height);
    for (var idx, idx2, gdata = self.ocan.getContext("2d").getImageData(0, 0, self.dest.width, self.dest.height), i = 0; self.dest.width > i; i++) for (var j = 0; self.dest.height > j; j++) idx = 3 * (j * self.dest.width + i), 
    idx2 = 4 * (j * self.dest.width + i), self.src.data[idx2] = self.dest.data[idx], 
    self.src.data[idx2 + 1] = self.dest.data[idx + 1], self.src.data[idx2 + 2] = self.dest.data[idx + 2], 
    self.src.data[idx2 + 3] = gdata.data[idx2 + 3];
    self.ctx.putImageData(self.src, 0, 0), self.canvas.style.display = "block";
  }, exports.Uploader = Uploader, exports.uploadSettings = uploadSettings;
}), define(function(require) {
  "use strict";
  var $ = require("jquery"), Store = require("store"), _ENV_ = window._ENV_, Handlebars = require("handlebars"), HumanTime = require("humantime"), R = require("rex"), Util = require("util"), Bus = require("bus"), Api = require("api");
  Handlebars.registerHelper("each", function(context, options) {
    var i, l, fn = options.fn, inverse = options.inverse, ret = "";
    if (context && context.length) for (i = 0, l = context.length; l > i; ++i) context[i].__index__ = i, 
    ret += fn(context[i]); else ret = inverse(this);
    return ret;
  }), Handlebars.registerHelper("ifFalse", function(context, options) {
    return Handlebars.helpers["if"].call(this, !context, options);
  }), Handlebars.registerHelper("avatarFilename", function(context) {
    return context;
  }), Handlebars.registerHelper("printName", function(name, external_username) {
    return name || (name = external_username.match(/([^@]+)@[^@]+/)[1]), name;
  }), Handlebars.registerHelper("printTime", function(time) {
    var t = HumanTime.printEFTime(time);
    return t.content || "Sometime";
  }), Handlebars.registerHelper("printTime2", function(time) {
    var t = HumanTime.printEFTime(time);
    return t.content || "To be decided";
  }), Handlebars.registerHelper("printPlace", function(place) {
    return place || "To be decided";
  }), Handlebars.registerHelper("printTime3", function(time) {
    var b = time.begin_at;
    if (!b.date) return b.date_word || "";
    var t = HumanTime.printEFTime(time);
    return t.content || "Sometime";
  }), Handlebars.registerHelper("printTime4", function(time) {
    time = Handlebars.helpers.crossItem.call(this, time);
    var t = HumanTime.printEFTime(time);
    return t.content || "Sometime";
  }), Handlebars.registerHelper("rsvpAction", function(identities, identity_id) {
    var rsvp = {
      ACCEPTED: "Accepted",
      INTERESTED: "Interested",
      DECLINED: "Unavailable",
      NORESPONSE: "Pending"
    }, i = R.filter(identities, function(v) {
      return v.identity.id === identity_id ? !0 : void 0;
    })[0], html = "";
    i && i in rsvp && "INTERESTED" !== i.rsvp_status && (html += '<div><i class="', 
    html += "icon-rsvp-" + i.rsvp_status.toLowerCase() + '"></i> ', html += rsvp[i.rsvp_status] + ": " + i.identity.name + "</div>");
    var is = R.map(identities, function(v) {
      return v.by_identity.id === identity_id && v.identity.id !== identity_id ? v.identity.name : void 0;
    }).filter(function(v) {
      return v ? !0 : void 0;
    }).join(", ");
    return html += '<div><i class="icon-invite"></i> ', html += "Invited: " + is, html += "</div>", 
    is ? html : "";
  }), Handlebars.registerHelper("ifPlace", function(options) {
    var title = Handlebars.helpers.crossItem.call(this, "place");
    return Handlebars.helpers["if"].call(this, title.length, options);
  }), Handlebars.registerHelper("makeDefault", function(def, status, options) {
    var context = !def && "CONNECTED" === status;
    return Handlebars.helpers["if"].call(this, context, options);
  }), Handlebars.registerHelper("ifRevoked", function(status, options) {
    return Handlebars.helpers["if"].call(this, "REVOKED" === status, options);
  }), Handlebars.registerHelper("ifVerifying", function(provider, status, options) {
    var context = !Handlebars.helpers.isOAuthIdentity.call(this, provider, options) && "VERIFYING" === status;
    return Handlebars.helpers["if"].call(this, context, options);
  }), Handlebars.registerHelper("atName", function(identity) {
    return Util.printExtUserName(identity, !0);
  }), Handlebars.registerHelper("editable", function(provider, status, options) {
    var context = !Handlebars.helpers.isOAuthIdentity.call(this, provider, options) && "CONNECTED" === status;
    return Handlebars.helpers["if"].call(this, context, options);
  }), Handlebars.registerHelper("confirmed_identities", function(context) {
    var d = R(context).filter(function(v) {
      return "ACCEPTED" === v.rsvp_status ? !0 : void 0;
    });
    return R(d.slice(0, 7)).map(function(v) {
      return v.identity.name;
    }).join(", ");
  });
  var identities_defe = function(user) {
    $(".user-xstats .attended").html(user.cross_quantity);
    var jst_user = $("#jst-user-avatar"), s = Handlebars.compile(jst_user.html()), h = s({
      avatar_filename: user.avatar_filename
    });
    $(".user-avatar").append(h), $("#profile .user-name").find("h3").html(user.name || user.nickname), 
    $("#profile .user-bio").text(user.bio || ""), $("#profile .user-name").find(".changepassword").attr("data-dialog-type", user.password ? "changepassword" : "setpassword").find("span").text(user.password ? "Change Password..." : "Set Password..."), 
    Handlebars.registerPartial("jst-identity-item", $("#jst-identity-item").html());
    var devices = user.devices;
    devices = R.filter(devices, function(v) {
      return "iOS" === v.os_name && "CONNECTED" === v.status ? v : void 0;
    }), 0 === devices.length && $(".exfe-app").removeClass("hide");
    var jst_identity_list = $("#jst-identity-list");
    s = Handlebars.compile(jst_identity_list.html());
    var identities = user.identities;
    identities[0].__default__ = !0, h = s({
      identities: identities
    }), $(".identity-list").append(h);
    var event;
    if (event = $("#app-main").data("event")) {
      var action = event.action;
      if ("add_identity" === action) {
        var data = event.data, addIdentity = function(external_username, provider, that) {
          var authorization = Store.get("authorization"), token = authorization.token;
          Api.request("addIdentity", {
            type: "POST",
            params: {
              token: token
            },
            data: {
              external_username: external_username,
              provider: provider
            }
          }, function(data) {
            var identity = data.identity, user = Store.get("user"), identities = user.identities;
            identities.push(identity), Store.set("user", user), s = Handlebars.compile($("#jst-identity-item").html()), 
            h = s(data.identity), $(".identity-list").append(h), that && that.destory();
          }, function(data) {
            var meta = data && data.meta;
            if (meta && 401 === meta.code && "authenticate_timeout" === meta.errorType) {
              that && that.destory();
              var $d = $('<div data-widget="dialog" data-dialog-type="authentication" data-destory="true" class="hide"></div>');
              $("#app-tmp").append($d);
              var e = $.Event("click.dialog.data-api");
              e._data = {
                callback: function() {
                  addIdentity(external_username, provider);
                }
              }, $d.trigger(e);
            }
          });
        };
        addIdentity(data.identity.external_username, data.identity.provider), $("#app-main").removeData("event");
      }
    }
  }, crossList_defe = function(data) {
    if (data) {
      var user_id = data.user_id, token = data.token;
      return Api.request("crosslist", {
        params: {
          token: token
        },
        resources: {
          user_id: user_id
        }
      }, function(data) {
        var jst_crosses = $("#jst-crosses-container");
        Handlebars.registerPartial("jst-cross-box", $("#jst-cross-box").html());
        var s = Handlebars.compile(jst_crosses.html()), h = "", cates = "upcoming<Upcoming> sometime<Sometime> sevendays<Next 7 days> later<Later> past<Past>", crossList = {};
        R.map(data.crosses, function(v) {
          crossList[v.sort] || (crossList[v.sort] = {
            crosses: []
          }), crossList[v.sort].crosses.push(v);
        }), crossList.upcoming || (crossList.upcoming = {}), crossList.upcoming.crosses || (crossList.upcoming.crosses = []), 
        crossList.upcoming.crosses.reverse();
        var more = data.more.join(" "), splitterReg = /<|>/;
        R.map(cates.split(" "), function(v) {
          v = v.split(splitterReg);
          var c = crossList[v[0]];
          c && (c.cate = v[0], c.cate_date = v[1], c.hasMore = more.search(v[0]) > -1, h += s(c));
        }), $("#profile .crosses").append(h);
      });
    }
  }, crosses_inversation_defe = function(data) {
    if (data) {
      var user_id = data.user_id, token = data.token, now = new Date();
      now = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
      var dfd = Api.request("crosses", {
        params: {
          token: token
        },
        resources: {
          user_id: user_id
        }
      }, function(data) {
        var crosses = data.crosses, invitations = [], identities_KV = {};
        if (R.each(crosses, function(v, i) {
          v.exfee && v.exfee.invitations && v.exfee.invitations.length && R.each(v.exfee.invitations, function(e, j) {
            identities_KV[e.id] = [ i, j ], user_id === e.identity.connected_user_id && "NORESPONSE" === e.rsvp_status && (e.__crossIndex = i, 
            e.__identityIndex = j, invitations.push(e));
          });
        }), Handlebars.registerHelper("crossItem", function(prop) {
          return "place" === prop ? crosses[this.__crossIndex][prop].title : "invitationid" === prop ? crosses[this.__crossIndex].exfee.invitations[this.__identityIndex].id : "exfeeid" === prop ? crosses[this.__crossIndex].exfee.id : "identityid" === prop ? crosses[this.__crossIndex].exfee.invitations[this.__identityIndex].identity.id : "name" === prop ? crosses[this.__crossIndex].exfee.invitations[this.__identityIndex].identity.name : crosses[this.__crossIndex][prop];
        }), Handlebars.registerHelper("conversation_nums", function() {
          return this.__conversation_nums;
        }), invitations.length) {
          var jst_invitations = $("#jst-invitations"), s = Handlebars.compile(jst_invitations.html()), h = s({
            crosses: invitations
          });
          $("#profile .gr-b .invitations").removeClass("hide").append(h);
        }
      });
      return dfd.done(newbieGuide);
    }
  }, crosses_update_defe = function(data) {
    if (data) {
      var user_id = data.user_id, token = data.token, now = new Date(), mt = 0;
      return now.setDate(now.getDate() - 3), mt = +now, now = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate(), 
      Api.request("crosses", {
        resources: {
          user_id: user_id
        },
        params: {
          updated_at: now,
          token: token
        }
      }, function(data) {
        var updates, crosses = data.crosses;
        if (0 === crosses.length) return $(".siderbar.updates").addClass("no-updates"), 
        void 0;
        if (updates = R.filter(crosses, function(v) {
          var up = v.updated, b = !1;
          if (up) {
            var k, dv, t;
            for (k in up) "background" !== k && (dv = up[k], t = +new Date(dv.updated_at.replace(/\-/g, "/")), 
            t > mt ? b |= !0 : (b |= !1, up[k] = !1));
          }
          return b ? !0 : void 0;
        }), 0 === updates.length) return $(".siderbar.updates").addClass("no-updates"), 
        void 0;
        var uh = $("#jst-updates").html(), s = Handlebars.compile(uh), h = s({
          updates: updates
        });
        $(".siderbar.updates .cross-tip").before(h);
      });
    }
  }, newbieGuide = function(data) {
    data = Store.get("authorization");
    var user_id = data.user_id, cross_nums = ~~$(".user-xstats > .attended").text(), newbie_status = Store.get("newbie_guide:" + user_id);
    if (3 >= cross_nums && !newbie_status && 0 === $("#js-newbieguide").length) {
      var s = document.createElement("script");
      s.id = "js-newbieguide", s.type = "text/javascript", s.async = !0, s.src = "/static/js/newbieguide/0.0.5/newbieguide.min.js?t=" + _ENV_.timestamp, 
      document.getElementById("app-tmp").appendChild(s);
    }
  }, iosapp = function() {
    var dismiss = Store.get("iosapp_dismiss");
    dismiss || $(".ios-app").removeClass("hide");
  };
  Bus.on("app:profile:show", function(d) {
    d.done([ crossList_defe, crosses_inversation_defe, crosses_update_defe, iosapp ]);
  }), Bus.on("app:profile:identities", function(data) {
    identities_defe(data);
  }), Bus.on("app:addidentity", function(data) {
    var jst_identity_list = $("#jst-identity-list"), s = Handlebars.compile(jst_identity_list.html()), h = s({
      identities: [ data.identity ]
    });
    $(".identity-list").append(h);
  });
  var $BODY = $(document.body);
  $BODY.on("dblclick.profile", ".user-name h3", function() {
    var value = $.trim($(this).html()), $input = $('<input type="text" value="' + value + '" class="pull-left" />');
    $input.data("oldValue", value), $(this).after($input).hide(), $input.focusend(), 
    $(".xbtn-changepassword").addClass("hide");
  }), $BODY.on("focusout.profile keydown.profile", ".user-name input", function(e) {
    var t = e.type, kc = e.keyCode;
    if ("focusout" === t || 9 === kc || !e.shiftKey && 13 === kc) {
      var value = $.trim($(this).val()), oldValue = $(this).data("oldValue");
      if ($(this).hide().prev().html(value || oldValue).show(), $(this).remove(), !$(".settings-panel").data("hoverout") && $(".xbtn-changepassword").removeClass("hide"), 
      !value || value === oldValue) return;
      var authorization = Store.get("authorization"), token = authorization.token;
      Api.request("updateUser", {
        type: "POST",
        params: {
          token: token
        },
        data: {
          name: value
        }
      }, function(data) {
        Store.set("user", data.user), Bus.emit("app:page:changeusername", value);
      });
    }
  }), $BODY.on("dblclick.profile", ".identity-list li .identity > span.identityname em", function() {
    var that = $(this), $li = that.parents("li"), provider = $li.data("provider"), editable = $li.data("editable");
    if (-1 !== "twitter facebook google flickr instagram dropbox".indexOf(provider)) $li.find(".isOAuth").removeClass("hide"); else if (editable) {
      var value = $.trim(that.text()), $input = $('<input type="text" value="' + value + '" class="username-input" />');
      $input.data("oldValue", value), that.after($input).hide(), $input.focusend();
    }
  }), $BODY.on("focusout.profile keydown.profile", ".identity-list .username-input", function(e) {
    var t = e.type, kc = e.keyCode;
    if ("focusout" === t || 9 === kc || !e.shiftKey && 13 === kc) {
      var value = $.trim($(this).val()), oldValue = $(this).data("oldValue"), identity_id = $(this).parents("li").data("identity-id");
      if ($(this).hide().prev().text(value || oldValue).show(), $(this).remove(), !value || value === oldValue) return;
      var authorization = Store.get("authorization"), token = authorization.token;
      Api.request("updateIdentity", {
        params: {
          token: token
        },
        resources: {
          identity_id: identity_id
        },
        type: "POST",
        data: {
          name: value
        }
      }, function(data) {
        for (var identity = data.identity, id = identity.id, user = Store.get("user"), identities = user.identities, i = 0, l = identities.length; l > i; ++i) if (identities[i].id === id) {
          identities[i] = identity;
          break;
        }
        Store.set("user", user);
      });
    }
  }), $BODY.on("click.profile", ".xbtn-accept, .xbtn-ignore", function(e) {
    e.preventDefault(), e.stopPropagation();
    var $that = $(this), action = $that.data("action"), p = $that.parent(), crossid = p.data("id"), cross_box = $('.gr-a [data-id="' + crossid + '"]'), exfee_id = p.data("exfeeid"), identity_id = p.data("identity-id"), name = p.data("name"), authorization = Store.get("authorization"), token = authorization.token;
    Api.request("rsvp", {
      params: {
        token: token
      },
      resources: {
        exfee_id: exfee_id
      },
      type: "POST",
      data: {
        rsvp: '[{"identity_id":' + identity_id + ', "rsvp_status": "' + action + '", "by_identity_id": ' + identity_id + "}]",
        by_identity_id: identity_id
      }
    }, function() {
      if ("ACCEPTED" === action) {
        var fs = cross_box.find(">div :first-child"), i = +fs.text();
        fs.text(i + 1);
        var ls = cross_box.find(">div :last-child"), s = ls.text();
        ls.text(s + (s ? ", " : "") + name);
      }
      var inv;
      p.parent().prev().length || p.parent().next().length || (inv = p.parents(".invitations")), 
      p.parent().remove(), inv && inv.remove();
    });
  }), $BODY.on("click.profile", "#profile div.cross-type", function(e) {
    e.preventDefault(), $(this).next().toggleClass("hide").next().toggleClass("hide"), 
    $(this).find("span.arrow").toggleClass("lt rb");
  }), $BODY.on("hover.profile", ".changepassword", function(e) {
    var t = e.type;
    $(this).data("hoverout", "mouseleave" === t), "mouseenter" === t ? $(this).addClass("xbtn-changepassword") : $(this).removeClass("xbtn-changepassword");
  }), $BODY.on("click.profile", ".more > a", function(e) {
    e.preventDefault();
    var $e = $(this), p = $e.parent(), cate = p.data("cate"), data = Store.get("authorization"), token = data.token, user_id = data.user_id, more_position = p.prev().find(" .cross-box").length, more_category = cate;
    Api.request("crosslist", {
      params: {
        token: token
      },
      resources: {
        user_id: user_id
      },
      data: {
        more_category: more_category,
        more_position: more_position
      }
    }, function(data) {
      if (data.crosses.length) {
        var h = "{{#crosses}}{{> jst-cross-box}}{{/crosses}}", s = Handlebars.compile(h);
        p.prev().append(s(data));
        var l = R.filter(data.more, function(v) {
          return v === cate ? !0 : void 0;
        });
        l.length || $e.remove();
      }
    });
  }), $BODY.on("click.profile.iosapp", ".ios-app > .exfe-dismiss", function(e) {
    e.preventDefault(), Store.set("iosapp_dismiss", !0), $BODY.off("click.profile.iosapp"), 
    $(this).parent().fadeOut();
  });
  var uploadSettings, Uploader = null, uploader = null, uploaderTarget = null;
  $BODY.on("click.data-link", ".user-avatar .avatar, .identity-list > li > .avatar", function() {
    var $e = $(this), $img = $e.find("img");
    if (!$e.parent().data("editable")) return !1;
    var identity_id = $e.parent().data("identity-id"), data = {};
    identity_id && (data.identity_id = identity_id), data["80_80"] = $img[0].src, data["80_80"] = decodeURIComponent(data["80_80"]), 
    data["80_80"].match(/\/80_80_/) || (data["80_80"] = ""), data.original = data["80_80"].replace(/80_80_/, "original_"), 
    Uploader || (Uploader = require("uploader").Uploader, uploadSettings = $.extend(!0, {}, require("uploader").uploadSettings, {
      options: {
        onHideBefore: function() {
          uploaderTarget = uploader = void 0;
        }
      }
    })), uploader && (uploader.hide(), uploader = null), uploader = new Uploader(uploadSettings).render(), 
    uploader.show(data);
  }), $BODY.dndsortable({
    delay: 300,
    wrap: !0,
    list: ".identity-list",
    items: " > li",
    sort: function(dragging, dropzone) {
      var $i = $(dragging), $z = $(dropzone), $p = $z.parent(), i = $i.index(), z = $z.index(), draggable = $p.data("draggable");
      if (draggable) {
        i > z ? $z.before($i) : $z.after($i);
        var authorization = Store.get("authorization"), identity_order = [];
        $p.find("> li").each(function(i, v) {
          identity_order.push($(v).data("identity-id"));
        }), Api.request("sortIdentities", {
          type: "POST",
          resources: {
            user_id: authorization.user_id
          },
          params: {
            token: authorization.token
          },
          data: {
            identity_order: "[" + ("" + identity_order) + "]"
          }
        }, function() {
          var user = Store.get("user"), identities = user.identities, identity = identities.splice(i, 1)[0];
          identities.splice(z, 0, identity), Store.set("user", user), $p.data("draggable", !0);
        }), $p.data("draggable", !1);
      }
    },
    setData: function(elem) {
      return $(elem).data("identity-id");
    },
    start: function() {
      var $list = $(".settings-panel .identity-list"), $lis = $list.find("> li"), draggable = !!$list.data("draggable");
      return draggable ? 1 === $lis.size() ? !1 : ($(this).addClass("dragme"), $(".xbtn-addidentity").addClass("hide"), 
      $(".identities-trash").removeClass("hide over"), void 0) : !1;
    },
    end: function() {
      $(this).removeClass("dragme"), $(".xbtn-addidentity").removeClass("hide"), $(".identities-trash").addClass("hide over");
    }
  }), $BODY.on("dragenter.profile", ".trash-overlay", function() {
    return $(this).parent().addClass("over"), $(".icon24-trash").addClass("icon24-trash-red"), 
    !1;
  }), $BODY.on("dragover.profile", ".trash-overlay", function(e) {
    return e.stopPropagation(), e.preventDefault(), !1;
  }), $BODY.on("dragleave.profile", ".trash-overlay", function() {
    return $(this).parent().removeClass("over"), $(".icon24-trash").removeClass("icon24-trash-red"), 
    !1;
  }), $BODY.data("trash-overlay-deletable", !0), $BODY.on("drop.profile", ".trash-overlay", function(e) {
    function _deleteIdentity(identity_id) {
      var authorization = Store.get("authorization"), token = authorization.token, defer = Api.request("deleteIdentity", {
        type: "POST",
        params: {
          token: token
        },
        data: {
          identity_id: identity_id
        }
      }, function() {
        var user = Store.get("user"), identities = user.identities;
        R.some(identities, function(v, i) {
          return v.id === identity_id ? (identities.splice(i, 1), !0) : void 0;
        }), Store.set("user", user), $('.identity-list > li[data-identity-id="' + identity_id + '"]').remove();
      }, function(data) {
        var meta = data && data.meta;
        if (meta && 401 === meta.code && "authenticate_timeout" === meta.errorType) {
          var $d = $('<div data-widget="dialog" data-dialog-type="authentication" data-destory="true" class="hide"></div>');
          $("#app-tmp").append($d);
          var e = $.Event("click.dialog.data-api");
          e._data = {
            callback: function() {
              _deleteIdentity(identity_id);
            }
          }, $d.trigger(e);
        }
      });
      defer.always(function() {
        $BODY.data("trash-overlay-deletable", !0);
      });
    }
    var deletable = $BODY.data("trash-overlay-deletable");
    if (deletable) {
      $BODY.data("trash-overlay-deletable", !1), e.stopPropagation(), e.preventDefault();
      var dt = e.originalEvent.dataTransfer, identity_id = +dt.getData("text/plain");
      return $(this).parent().removeClass("over"), $(".icon24-trash").removeClass("icon24-trash-red"), 
      _deleteIdentity(identity_id), !1;
    }
  });
}), define("user", function(require) {
  "use strict";
  function updateNormalUserMenu(user) {
    var tplFun, $appUserMenu = $("#app-user-menu"), $appUserName = $("#app-user-name"), $nameSpan = $appUserName.find("span"), $dropdownWrapper = $appUserMenu.find(".dropdown-wrapper"), $userPanel = $dropdownWrapper.find(".user-panel"), identity = user.identities[0], profileLink = "/#" + Util.printExtUserName(identity);
    $("#app-browsing-identity").remove(), $appUserName.attr("href", profileLink), $nameSpan.text(user.name || user.nickname).removeClass("browsing-identity"), 
    tplFun = Handlebars.compile(userMenuTpls.normal), $userPanel.length && $userPanel.remove(), 
    user.profileLink = profileLink, user.verifying = 1 === user.identities.length && "VERIFYING" === identity.status, 
    $dropdownWrapper.append(tplFun(user)), delete user.profileLink, delete user.verifying;
  }
  function updateBrowsingUserMenu(data) {
    var tplFun, $appUserMenu = $("#app-user-menu"), $appUserName = $("#app-user-name"), $nameSpan = $appUserName.find("span"), $dropdownWrapper = $appUserMenu.find(".dropdown-wrapper"), $userPanel = $dropdownWrapper.find(".user-panel"), browsing = data.browsing, identity = browsing.identities[0];
    browsing.isBrowsing = !0, $("#app-browsing-identity").remove(), $("#app-tmp").append($('<div id="app-browsing-identity">').data("settings", data).attr("data-widget", "dialog").attr("data-dialog-type", "browsing_identity"));
    var setupType = "setup_authenticate";
    ("email" === identity.provider || "phone" === identity.provider) && (setupType = "setup_verification"), 
    $appUserName.attr("href", location.href), $nameSpan.html("Browsing as: <span>" + (browsing.name || browsing.nickname) + "</span>").addClass("browsing-identity"), 
    tplFun = Handlebars.compile(userMenuTpls.browsing_identity), $userPanel.length && $userPanel.remove(), 
    $dropdownWrapper.append(tplFun(data)), $("#app-user-menu").find(".setup").attr("data-dialog-type", setupType).data("source", {
      browsing: browsing,
      originToken: data.originToken,
      tokenType: data.tokenType,
      forward: data.forward,
      page: data.page,
      token: data.token
    });
  }
  function switchPage(isHome, nocleanup) {
    isHome = !!isHome;
    var $BODY = $(document.body), $appMenubar = $("#app-menubar"), $appMain = $("#app-main");
    nocleanup || $appMain.empty(), $BODY.toggleClass("hbg", isHome), $appMenubar.toggleClass("hide", isHome);
  }
  function switchUserMenu(signed) {
    signed = !!signed;
    var $appUserMenu = $("#app-user-menu"), $appSignin = $("#app-signin");
    $appUserMenu.toggleClass("hide", !signed), $appSignin.toggleClass("hide", signed);
  }
  function refreshIdentities(identities) {
    for (var status, i, sid, id, ids = Store.get("identities") || [], cis = identities.slice(0); id = ids.shift(); ) {
      for (status = !1, i = 0; (sid = identities[i++]) && !(status = id.external_username === sid.external_username); ) ;
      status || cis.push(id);
    }
    Store.set("identities", cis);
  }
  var $ = require("jquery"), R = require("rex"), Api = require("api"), Bus = require("bus"), Util = require("util"), Store = require("store"), Handlebars = require("handlebars"), signIn = function(token, user_id, redirect, block_redirect) {
    getUser(token, user_id, function(data) {
      var identity, last_external_username = Store.get("last_external_username"), user = data.user;
      if (last_external_username && (identity = R.find(user.identities, function(v) {
        var external_username = Util.printExtUserName(v);
        return last_external_username === external_username ? !0 : void 0;
      })), identity || (identity = user.identities[0], Store.set("last_external_username", Util.printExtUserName(identity))), 
      Store.set("authorization", {
        token: token,
        user_id: user_id
      }), Store.set("user", user), Store.set("lastIdentity", identity), refreshIdentities(user.identities), 
      block_redirect = !$(".modal-su").size()) {
        var $fobidden = $("#forbidden"), $invite = $("#invite");
        if ($fobidden.size() || $invite.size()) return window.location.reload(), void 0;
        var $browsing = $("#app-browsing-identity");
        if ($browsing.size() && "profile" === $browsing.attr("data-page")) return $browsing.remove(), 
        window.location.href = "/", void 0;
        var hash = decodeURIComponent(window.location.hash);
        if (redirect || ("" === hash || /^#?(invalid)?/.test(hash)) && !/^#gather/.test(hash) && !/^#!/.test(hash)) return setTimeout(function() {
          window.location.hash = Util.printExtUserName(user.identities[0]);
        }, 16), void 0;
      }
      Bus.emit("app:page:usermenu", !0), Bus.emit("app:usermenu:updatenormal", user), 
      Bus.emit("app:usermenu:crosslist", token, user_id), Bus.emit("app:user:signin:after", user);
    }, function() {
      Store.remove("cats"), Store.remove("user"), Store.remove("authorization"), window.location.href = "/";
    });
  };
  Bus.on("app:user:signin", signIn);
  var getUser = function(token, user_id, done, fail) {
    Api.request("getUser", {
      params: {
        token: token
      },
      resources: {
        user_id: user_id
      }
    }, done || function() {}, fail || function() {});
  };
  Bus.on("app:api:getuser", getUser), Bus.on("app:usermenu:updatenormal", updateNormalUserMenu), 
  Bus.on("app:usermenu:updatebrowsing", updateBrowsingUserMenu);
  var userMenuTpls = {
    normal: '<div class="dropdown-menu user-panel"><div class="header"><div class="meta"><a class="pull-right avatar" href="{{profileLink}}" data-link><img width="40" height="40" alt="" src="{{avatar_filename}}" /></a><a class="attended" href="{{profileLink}}" data-link><span class="attended-nums">{{cross_quantity}}</span><span class="attended-x"><em class="x">·X·</em> attended</span></a></div></div><div class="body">{{#unless password}}<div class="merge setup" data-widget="dialog" data-dialog-type="setpassword">Set <span class="x-sign">EXFE</span> password</div>{{/unless}}{{#if verifying}}<div class="merge verify" data-dialog-type="verification_{{identities.[0].provider}}" data-widget="dialog" data-identity-id="{{identities.[0].id}}"><strong>Verify</strong> identity</div>{{/if}}<div class="list"></div></div><div class="footer"><a href="/#gather" class="xbtn xbtn-gather" id="js-gatherax" data-link>Gather a ·X·</a><div class="spliterline"></div><div class="actions"><a href="#" class="pull-right" id="app-signout">Sign out</a></div></div></div>',
    browsing_identity: '<div class="dropdown-menu user-panel"><div class="header"><h2>Browsing Identity</h2></div><div class="body">{{#with browsing}}<div>You are browsing this page as {{capitalize identities.[0].provider}} identity:</div><div class="identity"><span class="pull-right avatar alt40"><img src="{{identities.[0].avatar_filename}}" width="20" height="20" alt="" /></span><i class="icon16-identity-{{identities.[0].provider}}"></i><span class="oblique">{{identities.[0].external_username}}</span></div>{{#if ../setup}}<div class="merge setup" data-user-action="SETUP" data-widget="dialog"><h5>Start</h5>new account with this identity</div>{{/if}}{{/with}}{{#unless setup}}<div class="orspliter hide">or</div><div class="merge signin" data-user-action="SIGNIN" data-source="{{browsing.identities.[0].external_username}}" data-widget="dialog" data-dialog-type="identification" data-dialog-tab="d00"><h5>Authenticate</h5>to continue with this identity</div>{{/unless}}</div><div class="footer"></div></div>'
  };
  Handlebars.registerHelper("ifConnected", function(status, options) {
    return Handlebars.helpers["if"].call(this, "CONNECTED" === status, options);
  }), Bus.on("app:page:home", switchPage), Bus.on("app:page:usermenu", switchUserMenu), 
  Bus.on("app:page:changeusername", function(value) {
    $("#app-user-name").find("span").text(value);
  });
}), define(function(require) {
  ExfeUtilities = {
    trim: function(string) {
      return string ? string.replace(/^\s+|\s+$/g, "") : "";
    },
    escape: function(html, encode) {
      return html.replace(encode ? /&/g : /&(?!#?\w+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    },
    clone: function(variable) {
      switch (Object.prototype.toString.call(variable)) {
       case "[object Object]":
        var variableNew = {};
        for (var i in variable) variableNew[i] = this.clone(variable[i]);
        break;

       case "[object Array]":
        variableNew = [];
        for (i in variable) variableNew.push(this.clone(variable[i]));
        break;

       default:
        variableNew = variable;
      }
      return variableNew;
    },
    getTimezone: function() {
      var rawTimeStr = "" + Date(), numTimezone = rawTimeStr.replace(/^.+([+-]\d{2})(\d{2}).+$/i, "$1:$2"), strTimezone = rawTimeStr.replace(/^.*\(([a-z]*)\).*$/i, "$1");
      return strTimezone = "UTC" === strTimezone || "GMT" === strTimezone ? "" : strTimezone, 
      numTimezone + (strTimezone === rawTimeStr ? "" : " " + strTimezone);
    },
    parsePlacestring: function(strPlace) {
      for (var rawPlace = strPlace ? strPlace.split(/\r\n|\r|\n/g) : [], arrPlace = [], i = 0; rawPlace.length > i; i++) rawPlace[i] && arrPlace.push(rawPlace[i]);
      var title = arrPlace.shift();
      return title = title ? title : "", {
        title: title,
        description: arrPlace.join("\r"),
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
      var cached_user_id = Store.get("exfee_cache_user_id"), identities = Store.get("exfee_cache_identities");
      User && User.id && cached_user_id && User.id === cached_user_id && identities || (identities = []), 
      this.identities = [];
      for (var i = 0; identities.length > i; i++) identities[i].external_username && this.identities.push(identities[i]);
    },
    saveCache: function() {
      User && User.id && (Store.set("exfee_cache_user_id", User.id), Store.set("exfee_cache_identities", this.identities));
    },
    search: function(key) {
      var matchString = function(key, subject) {
        return subject ? -1 !== subject.toLowerCase().indexOf(key) : !1;
      }, matchIdentity = function(key, identity) {
        return matchString(key, identity.external_id) || matchString(key, identity.external_username) || matchString(key, identity.name);
      }, arrCatched = [];
      key = key.toLowerCase();
      for (var i = 0; this.identities.length > i; i++) matchIdentity(key, this.identities[i]) && !ExfeeWidget.isMyIdentity(this.identities[i]) && ExfeeWidget.checkExistence(this.identities[i]) === !1 && arrCatched.push(ExfeUtilities.clone(this.identities[i]));
      return arrCatched;
    },
    cacheIdentities: function(identities, unshift) {
      identities = ExfeUtilities.clone(identities);
      for (var i = 0; identities.length > i; i++) {
        for (var j = 0; this.identities.length > j; j++) ExfeeWidget.compareIdentity(identities[i], this.identities[j]) && this.identities.splice(j, 1);
        unshift ? this.identities.unshift(identities[i]) : this.identities.push(identities[i]), 
        this.identities.length > 233 && this.identities.splice(233), this.updated_identity.push(identities[i]);
      }
      this.saveCache();
    },
    fetchIdentity: function(identity) {
      for (var i = 0; this.identities.length > i; i++) if (ExfeeWidget.compareIdentity(identity, this.identities[i])) return ExfeUtilities.clone(this.identities[i]);
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
    make: function(dom_id, editable, callback) {
      return this.dom_id = dom_id, this.editable = editable, this.callback = callback, 
      $("#" + this.dom_id + " .total").css("visibility", "hidden"), $("#" + this.dom_id + " .avatar .rb").hide(), 
      $("#" + this.dom_id).bind("mouseenter mouseleave", function(event) {
        switch (event.type) {
         case "mouseenter":
          $("#" + dom_id + " .total").css("visibility", "visible"), $("#" + dom_id + " .avatar .rb").show();
          break;

         case "mouseleave":
          ExfeeWidget.focus[dom_id + "-input"] || "" !== $("#" + dom_id + " .exfee-input").val() || ($("#" + dom_id + " .total").css("visibility", "hidden"), 
          $("#" + dom_id + " .avatar .rb").hide());
        }
      }), $("#" + this.dom_id + " .input-xlarge").bind("focus keydown blur", this.inputEvent), 
      $("#" + this.dom_id + " .pointer").bind("mousedown", function(e) {
        return e.preventDefault(), e.stopPropagation(), ExfeeWidget.checkInput($("#" + dom_id + " .input-xlarge"), !0), 
        ExfeeWidget.blur = !1, !1;
      }).bind("click", function(e) {
        return e.preventDefault(), e.stopPropagation(), !1;
      }), $(document).on("mousedown", "#" + this.dom_id + " .thumbnails > li.identity > .avatar", function() {
        ExfeeWidget.showPanel(this.parentNode);
      }), this.complete_timer = setInterval("ExfeeWidget.checkInput($('#" + this.dom_id + " .input-xlarge'))", 50), 
      ExfeUtilities.clone(this);
    },
    showAll: function(skipMe, fadeUnconfirmed) {
      var intAccepted = 0, intTotal = 0, order = [ "ACCEPTED", "INTERESTED", "NORESPONSE", "DECLINED", "IGNORED" ];
      $("#" + this.dom_id + " .thumbnails").html("");
      for (var j = 0; order.length > j; j++) for (var i = 0; Exfee.invitations.length > i; i++) if (Exfee.invitations[i].rsvp_status === order[j]) {
        var intCell = Exfee.invitations[i].mates + 1;
        skipMe && ExfeeWidget.isMyIdentity(Exfee.invitations[i].identity) || this.showOne(Exfee.invitations[i], fadeUnconfirmed), 
        "ACCEPTED" === Exfee.invitations[i].rsvp_status && (intAccepted += intCell), intTotal += intCell;
      }
      $("#" + this.dom_id + " .attended").html(intAccepted), $("#" + this.dom_id + " .total").html("of " + intTotal);
    },
    showOne: function(invitation, fadeUnconfirmed) {
      var icons = {
        ACCEPTED: "icon14-rsvp-accepted-blue",
        DECLINED: "icon14-rsvp-declined",
        INTERESTED: "icon14-rsvp-interested",
        NORESPONSE: "icon14-rsvp-noresponse"
      };
      $("#" + this.dom_id + " .thumbnails").append('<li class="identity" id="' + invitation.identity.id + '" provider="' + invitation.identity.provider.toLowerCase() + '" external_id="' + invitation.identity.external_id.toLowerCase() + '" external_username="' + invitation.identity.external_username.toLowerCase() + '">' + '<span class="pointer avatar' + (fadeUnconfirmed && "ACCEPTED" !== invitation.rsvp_status ? " unconfirmed" : "") + '">' + '<img src="' + invitation.identity.avatar_filename + '" alt="' + invitation.identity.external_id + '" width="50" height="50" />' + '<i class="rt' + (invitation.host ? " icon10-host-h" : "") + '"></i>' + '<i class="icon10-plus-' + invitation.mates + ' lt"></i>' + ("cross-exfee" === this.dom_id ? '<span class="rb rb-bg' + (ExfeeWidget.focus[this.dom_id + "-input"] ? "" : " hide") + '">' + '<i class="' + icons[invitation.rsvp_status] + '"></i>' + "</span>" : "") + "</span>" + '<div class="identity-name">' + invitation.identity.name + "</div>" + "</li>");
    },
    showLimitWarning: function(display) {
      $(".exfee-warning").toggleClass("hide", display === !1);
    },
    showTip: function(target) {
      var objTarget = $(target), objOffset = objTarget.offset(), objIdentity = {}, id = objTarget.attr("id"), provider = objTarget.attr("provider"), external_id = objTarget.attr("external_id"), external_username = objTarget.attr("external_username");
      (id = ~~id) && (objIdentity.id = id), provider && (objIdentity.provider = provider), 
      external_id && (objIdentity.external_id = external_id), external_username && (objIdentity.external_username = external_username);
      var objInvitation = this.getInvitationByIdentity(objIdentity);
      ExfeePanel.showTip(objInvitation, objOffset.left, objOffset.top + 50);
    },
    showPanel: function(target) {
      var objTarget = $(target), objOffset = objTarget.offset(), objIdentity = {}, id = objTarget.attr("id"), provider = objTarget.attr("provider"), external_id = objTarget.attr("external_id"), external_username = objTarget.attr("external_username");
      (id = ~~id) && (objIdentity.id = id), provider && (objIdentity.provider = provider), 
      external_id && (objIdentity.external_id = external_id), external_username && (objIdentity.external_username = external_username);
      var objInvitation = this.getInvitationByIdentity(objIdentity);
      ExfeePanel.showPanel(objInvitation, objOffset.left + 5, objOffset.top + 5);
    },
    compareIdentity: function(identity_a, identity_b) {
      if (identity_a.id && identity_b.id && identity_a.id === identity_b.id) return !0;
      if (ExfeUtilities.trim(identity_a.provider).toLowerCase() === ExfeUtilities.trim(identity_b.provider).toLowerCase()) {
        if (identity_a.external_id && identity_b.external_id && ExfeUtilities.trim(identity_a.external_id).toLowerCase() === ExfeUtilities.trim(identity_b.external_id).toLowerCase()) return !0;
        if (identity_a.external_username && identity_b.external_username && ExfeUtilities.trim(identity_a.external_username).toLowerCase() === ExfeUtilities.trim(identity_b.external_username).toLowerCase()) return !0;
      }
      return !1;
    },
    checkExistence: function(identity) {
      for (var i = 0; Exfee.invitations.length > i; i++) if (this.compareIdentity(Exfee.invitations[i].identity, identity)) return i;
      return !1;
    },
    addExfee: function(identity, host, rsvp) {
      var items = ExfeeWidget.summary().items;
      if (ExfeeWidget.hard_limit > items && identity) {
        var idx = this.checkExistence(identity);
        return idx === !1 ? (Exfee.invitations.push({
          identity: ExfeUtilities.clone(identity),
          rsvp_status: rsvp ? rsvp : "NORESPONSE",
          host: !!host,
          mates: 0
        }), this.callback()) : "REMOVED" === Exfee.invitations[idx].rsvp_status && (Exfee.invitations[idx].rsvp_status = "NORESPONSE", 
        this.callback()), !0;
      }
      return !1;
    },
    delExfee: function(identity) {
      this.rsvpExfee(identity, "REMOVED");
    },
    rsvpExfee: function(identity, rsvp) {
      var idx = this.checkExistence(identity);
      if (idx !== !1) {
        Exfee.invitations[idx].rsvp_status = rsvp, Exfee.invitations[idx].by_identity = ExfeUtilities.clone(curIdentity);
        var refresh = !1;
        "REMOVED" === rsvp && curIdentity && ExfeeWidget.compareIdentity(Exfee.invitations[idx].identity, curIdentity) && (refresh = !0), 
        this.callback(refresh);
      }
    },
    changeMates: function(identity, mates) {
      var idx = this.checkExistence(identity);
      idx !== !1 && (mates > 9 && (mates = 9), 0 > mates && (mates = 0), Exfee.invitations[idx].mates = mates, 
      this.callback());
    },
    rsvpMe: function(rsvp) {
      this.rsvpExfee(curIdentity, rsvp);
    },
    summary: function() {
      for (var rtnResult = {
        items: 0,
        accepted: 0,
        total: 0,
        accepted_invitations: []
      }, i = 0; Exfee.invitations.length > i; i++) if ("REMOVED" !== Exfee.invitations[i].rsvp_status && "NOTIFICATION" !== Exfee.invitations[i].rsvp_status) {
        rtnResult.items++;
        var num = 1 + Exfee.invitations[i].mates;
        rtnResult.total += num, "ACCEPTED" === Exfee.invitations[i].rsvp_status && (rtnResult.accepted += num, 
        rtnResult.accepted_invitations.push(Exfee.invitations[i]));
      }
      return rtnResult;
    },
    getUTF8Length: function(string) {
      var length = 0;
      if (string) for (var i = 0; string.length > i; i++) charCode = string.charCodeAt(i), 
      127 > charCode ? length += 1 : charCode >= 128 && 2047 >= charCode ? length += 2 : charCode >= 2048 && 65535 >= charCode && (length += 3);
      return length;
    },
    cutLongName: function(string) {
      for (string = string ? string.replace(/[^0-9a-zA-Z_\u4e00-\u9fa5\ \'\.]+/g, " ") : ""; this.getUTF8Length(string) > 30; ) string = string.substring(0, string.length - 1);
      return string;
    },
    parseAttendeeInfo: function(string) {
      string = ExfeUtilities.trim(string);
      var objIdentity = {
        id: 0,
        name: "",
        external_id: "",
        external_username: "",
        provider: "",
        type: "identity"
      };
      if (/^[^@]*<[a-zA-Z0-9!#$%&\'*+\\\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&\'*+\\\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?>$/.test(string)) {
        var iLt = string.indexOf("<"), iGt = string.indexOf(">");
        objIdentity.external_id = ExfeUtilities.trim(string.substring(++iLt, iGt)), objIdentity.external_username = objIdentity.external_id, 
        objIdentity.name = ExfeUtilities.trim(this.cutLongName(ExfeUtilities.trim(string.substring(0, iLt)).replace(/^"|^'|"$|'$/g, ""))), 
        objIdentity.provider = "email";
      } else if (/^[a-zA-Z0-9!#$%&\'*+\\\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&\'*+\\\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(string)) objIdentity.external_id = string, 
      objIdentity.external_username = string, objIdentity.name = ExfeUtilities.trim(this.cutLongName(string.split("@")[0])), 
      objIdentity.provider = "email"; else if (/^@[a-z0-9_]{1,15}$|^@[a-z0-9_]{1,15}@twitter$|^[a-z0-9_]{1,15}@twitter$/i.test(string)) objIdentity.external_id = "", 
      objIdentity.external_username = string.replace(/^@|@twitter$/gi, ""), objIdentity.name = objIdentity.external_username, 
      objIdentity.provider = "twitter"; else {
        if (!/^[a-z0-9\.]{5,}@facebook$/i.test(string)) return null;
        objIdentity.external_id = "", objIdentity.external_username = string.replace(/@facebook$/gi, ""), 
        objIdentity.name = objIdentity.external_username, objIdentity.provider = "facebook";
      }
      return objIdentity.avatar_filename = encodeURI(ExfeeWidget.api_url + "/avatar/default?name=" + objIdentity.name), 
      objIdentity;
    },
    checkComplete: function(objInput, key, tryPhonePanel) {
      this.showCompleteItems(objInput, key, key ? ExfeeCache.search(key) : [], tryPhonePanel), 
      this.ajaxComplete(objInput, key);
    },
    displayIdentity: function(identity, shortStyle) {
      switch (identity ? identity.provider : "") {
       case "email":
       case "phone":
        return /^\+1.{10}$/.test(identity.external_id) ? identity.external_id.replace(/^(\+1)(.{3})(.{3})(.{4})$/, "$1 ($2) $3-$4") : /^\+86.{11}$/.test(identity.external_id) ? identity.external_id.replace(/^(\+86)(.{3})(.{4})(.{4})$/, "$1 $2 $3 $4") : identity.external_id;

       case "twitter":
        return "@" + identity.external_username + (shortStyle ? "" : "@twitter");

       case "facebook":
        return identity.external_username + (shortStyle ? "" : "@facebook");

       default:
        return "";
      }
    },
    displayCompletePanel: function(objInput, display) {
      if (this.completing = display) {
        var ostInput = objInput.offset();
        $(".ids-popmenu").css({
          left: ostInput.left + "px",
          top: ostInput.top + objInput.height() + 10 + "px",
          "max-height": "352px",
          "overflow-y": "scroll"
        }).slideDown(50);
      } else $(".ids-popmenu").slideUp(50);
    },
    showCompleteItems: function(objInput, key, identities, tryPhonePanel) {
      var highlight = function(string) {
        var objRe = RegExp("(" + key.replace(/^\+/, "") + ")");
        return string ? string.replace(objRe, '<span class="highlight">$1</span>') : "";
      }, objCompleteList = $(".ids-popmenu > ol"), strCompleteItems = "";
      key = key ? key.toLowerCase() : "", ExfeeWidget.complete_key !== key && (ExfeeWidget.complete_exfee = [], 
      objCompleteList.html("")), ExfeeWidget.complete_key = key;
      for (var i = 0; identities.length > i; i++) {
        for (var shown = !1, j = 0; ExfeeWidget.complete_exfee.length > j; j++) if (this.compareIdentity(ExfeeWidget.complete_exfee[j], identities[i])) {
          shown = !0;
          break;
        }
        if (!shown) {
          ExfeeWidget.complete_exfee.push(ExfeUtilities.clone(identities[i])) - 1;
          var provider = identities[i].provider;
          strCompleteItems += '<li><span class="pull-left avatar"><img src="' + identities[i].avatar_filename + '" alt="" width="40" height="40">' + '<span class="rb"><i class="icon16-identity-' + identities[i].provider + '"></i></span>' + "</span>" + '<div class="identity">' + '<div class="name">' + highlight(identities[i].name) + "</div>" + "<div>" + '<span class="oblique external">' + highlight(this.displayIdentity(identities[i], !0)) + "</span>" + ("email" === provider || "phone" === provider ? "" : ' <span class="provider">@' + provider.charAt(0).toUpperCase() + provider.substr(1) + "</span>") + "</div>" + "</div>" + "</li>";
        }
      }
      objCompleteList.append(strCompleteItems), this.displayCompletePanel(objInput, key && ExfeeWidget.complete_exfee.length);
      var phone = key.replace(/\-|\(|\)|\ /g, "");
      if (phone && tryPhonePanel && !ExfeeWidget.complete_exfee.length && !$("#phone-panel").length && /^[\+＋]?[0-9\uFF10-\uFF19]{5,15}$/.test(phone)) {
        var fullWidthCharts = {
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
        }, arrPhone = phone.split("");
        for (phone = "", i = 0; arrPhone.length > i; i++) phone += fullWidthCharts[arrPhone[i]] === void 0 ? arrPhone[i] : fullWidthCharts[arrPhone[i]];
        objInput.val(phone);
        var PhonePanel = require("phonepanel"), phonepanel = new PhonePanel({
          options: {
            parentNode: $("#app-tmp"),
            srcNode: objInput
          },
          add: function(identity) {
            ExfeeWidget.addExfee(identity), objInput.val("");
          }
        });
        phonepanel.show();
      }
    },
    isMyIdentity: function(identity) {
      return curIdentity && (this.compareIdentity(identity, curIdentity) || identity.connected_user_id === curIdentity.connected_user_id);
    },
    getInvitationByIdentity: function(identity) {
      for (var i = 0; Exfee.invitations.length > i; i++) if (this.compareIdentity(Exfee.invitations[i].identity, identity)) return Exfee.invitations[i];
      return null;
    },
    getMyInvitation: function() {
      return curIdentity ? this.getInvitationByIdentity(curIdentity) : null;
    },
    ajaxComplete: function(objInput, key) {
      User && key && void 0 === ExfeeCache.tried_key[key] && (this.complete_request && this.complete_request.abort(), 
      this.complete_request = Api.request("complete", {
        type: "get",
        data: {
          key: key
        }
      }, function(data) {
        for (var caughtIdentities = [], i = 0; data.identities.length > i; i++) ExfeeWidget.isMyIdentity(data.identities[i]) || ExfeeWidget.checkExistence(data.identities[i]) !== !1 || caughtIdentities.push(data.identities[i]), 
        ExfeeCache.cacheIdentities(caughtIdentities), ExfeeCache.tried_key[key] = !0, ExfeeWidget.complete_key === key && ExfeeWidget.showCompleteItems(objInput, key, caughtIdentities);
      }));
    },
    ajaxIdentity: function(identities) {
      identities && identities.length && Api.request("getIdentity", {
        type: "POST",
        data: {
          identities: JSON.stringify(identities)
        }
      }, function(data) {
        for (var caughtIdentities = [], i = 0; data.identities.length > i; i++) {
          var idx = ExfeeWidget.checkExistence(data.identities[i]);
          idx !== !1 && (Exfee.invitations[idx].identity = data.identities[i]), caughtIdentities.push(data.identities[i]);
        }
        caughtIdentities.length && (ExfeeCache.cacheIdentities(caughtIdentities), window.GatherExfeeWidget.showAll(!0), 
        window.CrossExfeeWidget.showAll(!1, !0));
      });
    },
    checkInput: function(objInput, force) {
      if (objInput && objInput.length) {
        var strInput = objInput.val(), arrInput = strInput.split(/,|;|\r|\n|\t/), arrValid = [], arrInvalid = [], strItem = "", strTail = "";
        if (ExfeeWidget.last_inputed[objInput[0].id] !== strInput || force) {
          ExfeeWidget.last_inputed[objInput[0].id] = strInput;
          for (var i = 0; arrInput.length > i; i++) if (strItem = ExfeUtilities.trim(arrInput[i])) {
            var item = ExfeeWidget.parseAttendeeInfo(strItem);
            item && (arrInput.length - 1 > ~~i || force) && this.addExfee(item) ? arrValid.push(item) : (arrInvalid.push(arrInput[i]), 
            strTail = arrInput[i]);
          }
          var newInput = arrInvalid.join("; ");
          newInput !== strInput && objInput.val(newInput), this.ajaxIdentity(arrValid), ExfeeWidget.summary().items >= ExfeeWidget.hard_limit && strInput && (strTail = "");
          var bolCorrect = !!ExfeeWidget.parseAttendeeInfo(strTail) || /^[\+＋]?[0-9\uFF10-\uFF19]{5,15}$/.test(strTail);
          objInput.parent().find(".pointer").toggleClass("icon16-exfee-plus-blue", bolCorrect).toggleClass("icon16-exfee-plus", !bolCorrect), 
          this.checkComplete(objInput, strTail.replace(/^@/, ""), force);
        }
      }
    },
    selectCompleteItem: function(index) {
      var className = "active";
      $(".ids-popmenu > ol > li").removeClass(className).eq(index).addClass(className);
    },
    useCompleteItem: function(index) {
      var identity = ExfeeCache.fetchIdentity(this.complete_exfee[index]);
      identity ? (this.complete_exfee.splice(index, 1), ExfeeCache.cacheIdentities(identity)) : identity = ExfeUtilities.clone(this.complete_exfee[index]), 
      this.addExfee(identity);
    },
    inputEvent: function(event) {
      var objInput = $(event.target);
      switch (ExfeeWidget.blur = !0, event.type) {
       case "focus":
        ExfeeWidget.focus[event.target.id] = !0;
        break;

       case "keydown":
        switch (event.which) {
         case 9:
          ExfeeWidget.checkInput(objInput, !0);
          break;

         case 13:
          var objSelected = $(".ids-popmenu > ol > .active"), curItem = objSelected.length ? ~~objSelected.index() : null;
          ExfeeWidget.completing && null !== curItem ? (ExfeeWidget.useCompleteItem(curItem), 
          ExfeeWidget.displayCompletePanel(objInput, !1), objInput.val("")) : ExfeeWidget.checkInput(objInput, !0), 
          ExfeeWidget.blur = !1;
          break;

         case 27:
          ExfeeWidget.completing && ExfeeWidget.displayCompletePanel(objInput, !1);
          break;

         case 38:
         case 40:
          event.preventDefault();
          var objCmpBox = $(".ids-popmenu"), cboxHeight = 352, cellHeight = 50, curScroll = objCmpBox.scrollTop();
          if (!ExfeeWidget.completing) return;
          var objSelected = objCmpBox.find("ol .active"), curItem = ~~objSelected.index(), maxIdx = ExfeeWidget.complete_exfee.length - 1;
          switch (event.which) {
           case 38:
            0 > --curItem && (curItem = maxIdx);
            break;

           case 40:
            ++curItem > maxIdx && (curItem = 0);
          }
          ExfeeWidget.selectCompleteItem(curItem);
          var curCellTop = curItem * cellHeight, curScrlTop = curCellTop - curScroll;
          0 > curScrlTop ? objCmpBox.scrollTop(curCellTop) : curScrlTop + cellHeight > cboxHeight && objCmpBox.scrollTop(curCellTop + cellHeight - cboxHeight + 1);
        }
        break;

       case "blur":
        ExfeeWidget.focus[event.target.id] = !1, ExfeeWidget.displayCompletePanel(objInput, !1);
        var cb = function() {
          objInput.parent().find(".pointer").hasClass("icon16-exfee-plus-blue") && (objInput.parent().toggleClass("a-bounce"), 
          setTimeout(function() {
            objInput.parent().toggleClass("a-bounce", !1);
          }, 1e3));
        };
        setTimeout(function() {
          ExfeeWidget.blur && cb(), ExfeeWidget.blur = !0;
        }, 50);
      }
    }
  };
}), define("exfeepanel", function() {
  var objBody = $("body");
  return objBody.bind("click", function(event) {
    for (var domEvent = event.target; domEvent && !$(domEvent).hasClass("exfee_pop_up") && !$(domEvent).hasClass("exfee_pop_up_save") && "BODY" !== domEvent.tagName; ) domEvent = domEvent.parentNode;
    $(domEvent).hasClass("exfee_pop_up") || $(domEvent).hasClass("exfee_pop_up_save") || $(".exfee_pop_up").hide().remove();
  }), {
    objBody: objBody,
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
    newId: function(invitation) {
      return "id_" + invitation.identity.id + "provider_" + invitation.identity.provider + "external_id_" + invitation.identity.external_id + "external_username_" + invitation.identity.external_username;
    },
    showTip: function(invitation, x, y) {
      var strTipId = this.newId(invitation), strPanel = '<div class="tooltip tip-exfee  exfee_pop_up" style="left: ' + x + "px; top: " + y + 'px;">' + '<div class="tooltip-inner">' + "<h5>" + invitation.identity.name + "</h5>" + "<div>" + '<i class="icon16-identity-' + invitation.identity.provider + '"></i>' + '<span class="oblique">' + ExfeeWidget.displayIdentity(invitation.identity, !0) + "</span>" + "</div>" + "</div>" + "</div>";
      this.tipId === strTipId && $(".tip-exfee").length || (this.tipId = strTipId, this.hideTip(), 
      this.objBody.append(strPanel), $(".exfeetip").show());
    },
    showPanel: function(invitation, x, y) {
      var strTipId = this.newId(invitation), strPanel = '<div class="exfeepanel exfee_pop_up" style="left: ' + x + "px; top: " + y + 'px; z-index: 10">' + '<div class="tooltip-inner">' + '<div class="avatar-name">' + '<span class="pull-left pointer avatar">' + '<img src="' + invitation.identity.avatar_filename + '" alt="" width="60" height="60" />' + '<i class="lt"></i>' + "</span>" + "<h4>" + invitation.identity.name + "</h4>" + "</div>" + '<div class="clearfix rsvp-actions">' + '<div class="pull-right invited">' + '<div class="mates-num hide"></div>' + '<div class="pull-left together-with hide">Mates&nbsp;</div>' + '<div class="pull-right mates-info">' + '<i class="mates-add icon-plus-blue"></i>' + "</div>" + '<div class="pull-left mates-edit hide">' + '<i class="pull-left mates-minus icon14-mates-minus"></i>' + '<span class="pull-left num"></span>' + '<i class="pull-left mates-add icon14-mates-add"></i>' + "</div>" + "</div>" + '<div class="rsvp-info">' + '<div class="rsvp-content">' + '<div class="attendance"></div>' + '<div class="by">by <span class="name"></span></div>' + "</div>" + '<div class="pull-right pointer underline setto">' + (readOnly ? "" : '<span>set to</span> <i class="icon-rsvp-declined-red"></i>') + "</div>" + "</div>" + "</div>" + '<div class="identities">' + '<ul class="identities-list">' + "<li>" + '<i class="pull-left icon16-identity-' + invitation.identity.provider + '"></i>' + '<span class="oblique identity">' + ExfeeWidget.displayIdentity(invitation.identity, !0) + "</span>" + (readOnly ? "" : '<div class="identity-btn delete"><i class="icon-minus-red"></i><button class="btn-leave">Leave</button></div>') + "</li>" + "</ul>" + '<div class="identity-actions">' + "<p>" + '<span class="xalert-fail">Remove yourself?</span>' + "<br />" + '<span class="xalter-info">You will <strong>NOT</strong> be able to access any information in this <span class="x">·X·</span>. Confirm leaving?</span>' + '<button class="pull-right btn-cancel">Cancel</button>' + "</p>" + "</div>" + "</div>" + '<!--i class="expand nomore"></i-->' + "</div>" + "</div>";
      this.invitation = ExfeUtilities.clone(invitation), this.panelId === strTipId && $(".exfeepanel").length || (this.panelId = strTipId, 
      this.editing = "", this.pre_delete = !1, this.hideTip(), this.hidePanel(), this.objBody.append(strPanel), 
      this.bindEvents(), $(".exfeepanel").show()), this.showRsvp();
    },
    hideTip: function() {
      $(".tip-exfee").hide().remove();
    },
    hidePanel: function() {
      $(".exfeepanel").hide().remove();
    },
    showRsvp: function() {
      var by_identity = this.invitation.by_identity ? this.invitation.by_identity : curIdentity, next_rsvp = "", objSetTo = $(".exfee_pop_up .rsvp-info .setto i");
      switch (this.invitation.rsvp_status) {
       case "ACCEPTED":
        next_rsvp = "DECLINED", objSetTo.toggleClass("icon-rsvp-accepted-blue", !1), objSetTo.toggleClass("icon-rsvp-declined-red", !0), 
        objSetTo.toggleClass("icon-rsvp-noresponse", !1);
        break;

       case "DECLINED":
        next_rsvp = "NORESPONSE", objSetTo.toggleClass("icon-rsvp-accepted-blue", !1), objSetTo.toggleClass("icon-rsvp-declined-red", !1), 
        objSetTo.toggleClass("icon-rsvp-noresponse", !0);
        break;

       case "NORESPONSE":
       case "IGNORED":
       default:
        next_rsvp = "ACCEPTED", objSetTo.toggleClass("icon-rsvp-accepted-blue", !0), objSetTo.toggleClass("icon-rsvp-declined-red", !1), 
        objSetTo.toggleClass("icon-rsvp-noresponse", !1);
      }
      $(".exfee_pop_up .rsvp-info .setto").attr("rsvp", next_rsvp), $(".exfee_pop_up .rsvp-info .attendance").html(this.arrRsvp[this.invitation.rsvp_status][0]);
      for (var i = 1; 10 > i; i++) $(".exfee_pop_up .avatar-name .lt").toggleClass("icon10-plus-" + i, this.invitation.mates === i);
      switch ($(".exfee_pop_up .rsvp-info .by .name").html(by_identity ? by_identity.name : ""), 
      $(".exfee_pop_up .invited .mates-num").html("+" + this.invitation.mates), $(".exfee_pop_up .mates-edit .num").html(this.invitation.mates), 
      by_identity && this.invitation.identity.id !== by_identity.id && "rsvp" === this.editing ? $(".exfee_pop_up .rsvp-info .by").show() : $(".exfee_pop_up .rsvp-info .by").hide(), 
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
      $(".exfee_pop_up .rsvp-info .setto").bind("click", this.rsvp), $(".exfee_pop_up .invited").bind("hover", function(event) {
        if (!readOnly) {
          switch (event.type) {
           case "mouseenter":
            ExfeePanel.editing = "mates";
            break;

           case "mouseleave":
            ExfeePanel.editing = "";
          }
          ExfeePanel.showRsvp();
        }
      }), $(".exfee_pop_up .rsvp-info").bind("hover", function(event) {
        switch (event.type) {
         case "mouseenter":
          ExfeePanel.editing = "rsvp";
          break;

         case "mouseleave":
          ExfeePanel.editing = "";
        }
        ExfeePanel.showRsvp();
      }), $(".exfee_pop_up .identities-list .delete i").bind("click", function(event) {
        event.stopPropagation(), ExfeePanel.pre_delete = !0, ExfeePanel.showRsvp();
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
      var rsvp = $(this).attr("rsvp");
      rsvp && (ExfeePanel.invitation.rsvp_status = rsvp, ExfeePanel.invitation.by_identity = ExfeUtilities.clone(curIdentity), 
      ExfeeWidget.rsvpExfee(ExfeePanel.invitation.identity, rsvp), ExfeePanel.showRsvp());
    }
  };
}), define(function(require) {
  var $ = require("jquery"), Timeline = [], rawCross = {
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
  }, rawExfee = {
    id: 0,
    type: "Exfee",
    invitations: []
  }, autoSetTitle = !1, SaveExfee = function(refresh) {
    Cross.id && ($(".cross-opts .saving").show(), Api.request("editExfee", {
      type: "POST",
      resources: {
        exfee_id: Exfee.id
      },
      data: {
        by_identity_id: curIdentity.id,
        exfee: JSON.stringify(Exfee)
      }
    }, function() {
      $(".cross-opts .saving").hide(), refresh ? window.location.href = "/" : bus.emit("app:cross:edited");
    }, function(data) {
      $(".cross-opts .saving").hide();
      var errorType = !data.meta || 401 !== data.meta.code && 403 !== data.meta.code ? "" : "no_permission";
      bus.emit("app:cross:edited", {
        error: errorType
      });
    }).always(function() {
      ExfeeWidget.showLimitWarning(ExfeeWidget.summary().items > ExfeeWidget.soft_limit);
    }));
  }, ExfeeCallback = function(refresh) {
    if (ShowExfee(), SaveExfee(refresh), autoSetTitle) {
      for (var invit, identity, title = "·X· ", n = 3, names = [], i = 0; (invit = Exfee.invitations[i++]) && (identity = invit.identity) && ("REMOVED" !== invit.rsvp_status && n-- && names.push(identity.name), 
      0 != n); ) ;
      title += names.join(", "), ChangeTitle(title);
    }
  }, ExfeeWidgestInit = function() {
    ExfeeCache.init(), ExfeeWidget.api_url = window._ENV_.api_url, window.GatherExfeeWidget = ExfeeWidget.make("gather-exfee", !0, ExfeeCallback), 
    window.CrossExfeeWidget = ExfeeWidget.make("cross-exfee", !0, ExfeeCallback);
  }, postConversation = function(strMessage) {
    if (strMessage) {
      var post = {
        by_identity_id: curIdentity.id,
        content: strMessage.substr(0, 233),
        id: 0,
        relative: [],
        type: "Post",
        via: "exfe.com"
      };
      $(".cross-opts .saving").show(), Api.request("addConversation", {
        resources: {
          exfee_id: Exfee.id
        },
        type: "POST",
        data: JSON.stringify(post)
      }, function(data) {
        lastConvUpdate = data.post.created_at, $(".cross-opts .saving").hide(), ShowMessage(data.post), 
        bus.emit("app:cross:edited");
      }, function(data) {
        $(".cross-opts .saving").hide();
        var errorType = !data.meta || 401 !== data.meta.code && 403 !== data.meta.code ? "" : "no_permission";
        bus.emit("app:cross:edited", {
          error: errorType
        });
      });
    }
  }, ButtonsInit = function() {
    $("#cross-form-discard").bind("click", function() {
      window.location = "/";
    }), $("#cross-form-gather").bind("click", function() {
      if (curIdentity) {
        if (JSON.stringify(InitCross) === JSON.stringify(Cross) && 1 === Exfee.invitations.length) return !1;
        $(this).hasClass("disabled") || ($(this).prop("disabled", !0).toggleClass("disabled", !0), 
        Gather());
      } else {
        var title = $.trim($("#gather-title").val());
        0 === title.length ? ($(".choose-identity .placeholder").addClass("text-error"), 
        $(".add-identity").addClass("hide"), $(".please-identity").removeClass("hide")) : $(".choose-identity .placeholder").trigger("click");
      }
    }), $(".cross-conversation .comment-form .pointer").bind("click", function() {
      var objInput = $(".cross-conversation .comment-form textarea");
      postConversation(objInput.val()), objInput.val("");
    }), $(".cross-conversation .comment-form textarea").bind("keydown", function(event) {
      switch (event.which) {
       case 13:
        var objInput = $(this);
        event.shiftKey || (event.preventDefault(), postConversation(objInput.val()), objInput.val(""));
      }
    });
  }, GatherFormInit = function() {
    var objGatherTitle = $("#gather-title");
    objGatherTitle.on("focus keydown keyup blur", function(event) {
      "keydown" === event.type && (autoSetTitle = !1), ChangeTitle(objGatherTitle.val(), "gather");
    });
  }, EditCross = function(event) {
    if ($(".cross-container").length && !readOnly) {
      var oldEditing = Editing, domWidget = event ? event.target : null, editMethod = {
        title: [ function() {
          $(".cross-title").removeAttr("editable"), $(".cross-title .show").show(), ChangeTitle($(".cross-title .edit").val(), "cross"), 
          $(".cross-title .edit").hide(), AutoSaveCross();
        }, function() {
          $(".cross-title").attr("editable", !0), $(".cross-title .show").hide(), $(".cross-title .edit").show().focus();
        } ],
        description: [ function() {
          $(".cross-description-outer").removeAttr("editable"), $(".cross-description .show").show(), 
          $(".cross-description .edit").hide(), ChangeDescription($(".cross-description .edit").val()), 
          AutoSaveCross();
        }, function() {
          $(".cross-description-outer").attr("editable", !0), $(".cross-description .show").hide(), 
          $(".cross-description .xbtn-more").hide(), $(".cross-description .edit").show().focus();
        } ],
        time: [ function() {
          var $dp = $("#date-panel");
          if ($dp.size()) {
            var cid = $dp.data("widget-id"), dp = App.widgetCaches[cid];
            $.trim($("#date-string").data("date")), ("date-panel" === oldEditing || "time" === oldEditing) && AutoSaveCross(), 
            dp && dp.hide();
          }
          $(".cross-date").removeAttr("editable");
        }, function() {
          var $dp = $("#date-panel");
          if (!$dp.size()) {
            var DatePanel = require("datepanel"), datepanel = new DatePanel({
              options: {
                parentNode: $("#app-tmp"),
                srcNode: $(".cross-date"),
                eftime: Cross.time
              }
            });
            datepanel.show(), $(".cross-date").attr("editable", !0);
          }
        } ],
        place: [ function() {
          $(".cross-place").removeAttr("editable");
          var $mp = $("#map-panel");
          if ($mp.size()) {
            var cid = $mp.data("widget-id"), mp = App.widgetCaches[cid];
            ("map-panel" === oldEditing || "place" === oldEditing) && (Cross.place = mp.place, 
            AutoSaveCross()), mp && mp.hide();
          }
        }, function() {
          var $dp = $("#map-panel");
          if (!$dp.size()) {
            var MapPanel = require("mappanel"), mappanel = new MapPanel({
              options: {
                parentNode: $("#app-tmp"),
                srcNode: $(".cross-place"),
                place: Cross.place
              },
              update: function(place) {
                ShowPlace(place), ShowGoogleMap(place);
              }
            });
            mappanel.show(), $(".cross-place").attr("editable", !0);
          }
        } ],
        rsvp: [ function() {
          ShowRsvp();
        }, function() {
          ShowRsvp(!0);
        } ],
        background: [ function() {}, function() {
          !event || "dblclick" !== event.type || !oldEditing && Cross.id || fixBackground(event ? event.shiftKey : !1);
        } ],
        exfee: [ function() {
          $("#cross-exfee .exfee-input").val() || ($("#cross-exfee .total").css("visibility", "hidden"), 
          $("#cross-exfee .thumbnails .avatar .rb").hide()), $("#gather-exfee .exfee-input").val() || $("#gather-exfee .thumbnails .avatar .rb").hide();
        }, function() {} ]
      };
      if (event) {
        var firstEditArea = $(domWidget).attr("editarea");
        switch (firstEditArea) {
         case "rsvp":
         case "exfee":
          Editing = firstEditArea;
        }
        if ("click" === event.type || "dblclick" === event.type && "background" === firstEditArea) for (Editing = firstEditArea; domWidget && !Editing && "BODY" !== domWidget.tagName; ) domWidget = domWidget.parentNode, 
        Editing = $(domWidget).attr("editarea"); else Editing = "";
      }
      if ("background" === Editing) editMethod.background[1](), Editing = oldEditing; else {
        if ("map-panel" === Editing) return;
        if ("date-panel" === Editing) return;
        for (var i in editMethod) editMethod[i][~~(i === Editing)]();
      }
    }
  }, Editable = function() {
    $("body").on("click save-cross", EditCross), $("body").on("click.data-link", "[editarea]", EditCross), 
    $("body").on("dblclick.data-link", '[editarea="background"]', EditCross), $(".cross-title .edit").bind("focus keydown keyup blur", function(event) {
      if ("keydown" === event.type) switch (autoSetTitle = !1, event.which) {
       case 13:
        event.shiftKey || (event.preventDefault(), EditCross());
      }
      ChangeTitle($(event.target).val(), "cross");
    }), $(".cross-title, .cross-description-outer, .cross-date, .cross-place").bind("hover", function(e) {
      var t = e.type;
      Editing && "rsvp" !== Editing && ("mouseenter" !== t || $(this).attr("editable") ? $(this).removeClass("cross-hover") : $(this).addClass("cross-hover"));
    });
    var _dest = 0;
    $(".cross-description").bind("mousedown mouseup", function(e) {
      "mousedown" === e.type ? _dest = e.clientX + e.clientY : _dest -= e.clientX + e.clientY;
    }), $(".cross-description").bind("click", function() {
      if (!Editing && !_dest) {
        _dest = 0;
        var that = $(this), status = !that.hasClass("more");
        that.toggleClass("more", status).find(".xbtn-more").toggleClass("xbtn-less", status);
      }
    }), $(".cross-description .xbtn-more").bind("click", function(event) {
      event.stopPropagation();
      var moreOrLess = !$(this).hasClass("xbtn-less");
      $(".cross-description").toggleClass("more", moreOrLess), $(this).toggleClass("xbtn-less", moreOrLess);
    }), $(".cross-description .editing").on("keydown", function(e) {
      var kc = e.keyCode;
      switch (kc) {
       case 27:
        $(this).val(Cross.description), $("body").trigger("save-cross");
        break;

       case 13:
        (e.ctrlKey || e.metaKey) && (e.preventDefault(), $("body").trigger("save-cross"));
      }
    }), $(".cross-rsvp").bind("mouseenter mouseover mouseleave", function(event) {
      if (!readOnly) switch (event.type) {
       case "mouseenter":
       case "mouseover":
        $(".cross-rsvp .show .accepted").hide(), $(".cross-rsvp .show .change").show(), 
        $(".cross-rsvp .show .by strong").html() && $(".cross-rsvp .show .by").show();
        break;

       case "mouseleave":
        $(".cross-rsvp .show .accepted").show(), $(".cross-rsvp .show .change").hide(), 
        $(".cross-rsvp .show .by").hide();
      }
    }), $(".cross-rsvp .edit .accept").bind("click", function() {
      ExfeeWidget.rsvpMe("ACCEPTED"), ShowRsvp();
    }), $(".cross-rsvp .edit .decline").bind("click", function() {
      ExfeeWidget.rsvpMe("DECLINED"), ShowRsvp();
    }), $(".cross-rsvp .edit .interested").bind("click", function() {
      ExfeeWidget.rsvpMe("INTERESTED"), ShowRsvp();
    }), $(".cross-place .edit").bind("keydown", function(event) {
      event.shiftKey && 13 === event.which && (event.which = 4);
    }), $(".cross-place .xbtn-more").bind("click", function(event) {
      event.stopPropagation();
      var moreOrLess = !$(this).hasClass("xbtn-less");
      $(".cross-dp.cross-place > address").toggleClass("more", moreOrLess), $(this).toggleClass("xbtn-less", moreOrLess);
    }), $(".ids-popmenu > ol > li").live("mouseenter mousedown", function(event) {
      switch (event.type) {
       case "mouseenter":
        ExfeeWidget.selectCompleteItem($(this).index());
        break;

       case "mousedown":
        ExfeeWidget.useCompleteItem($(this).index()), $(".exfee-input").val("");
      }
    });
  }, fixTitle = function() {
    Cross.title.length || (Cross.title = "·X· " + (curIdentity ? curIdentity.name : ""));
  }, fixTime = function() {
    var d = new Date(), strDate = HumanTime.formatDate(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate());
    Cross.time = {
      begin_at: {
        date_word: "",
        date: strDate,
        time_word: "",
        time: "",
        timezone: ExfeUtilities.getTimezone(),
        id: 0,
        type: "EFTime"
      },
      origin: strDate,
      outputformat: 0,
      id: 0,
      type: "CrossTime"
    }, $(".cross-date .edit").val(strDate);
  }, fixBackground = function(purge) {
    var backgrounds = ExfeUtilities.clone(window._ENV_.backgrounds);
    backgrounds.push("");
    for (var i = 0; Cross.widget.length > i && "Background" !== Cross.widget[i].type; i++) ;
    if (purge) Cross.widget[i].image = ""; else {
      var strBgImg = Cross.widget[i].image;
      do Cross.widget[i].image = backgrounds[parseInt(Math.random() * backgrounds.length)]; while (strBgImg === Cross.widget[i].image);
    }
    ShowBackground();
  }, fixExfee = function() {
    ExfeeWidget.addExfee(curIdentity, !0, "ACCEPTED");
  }, ChangeTitle = function(title, from) {
    Cross.title = ExfeUtilities.trim(title), ShowTitle(from);
  }, ChangeDescription = function(description) {
    Cross.description = ExfeUtilities.trim(description), ShowDescription();
  }, ShowHost = function() {
    curIdentity && $(".choose-identity").html('<img src="' + curIdentity.avatar_filename + '">');
  }, ShowTitle = function(from) {
    Cross.title.length && $(".choose-identity .placeholder").hasClass("text-error") && ($(".choose-identity .placeholder").removeClass("text-error"), 
    $(".add-identity").removeClass("hide"), $(".please-identity").addClass("hide"));
    var title = Cross.title.length ? ExfeUtilities.escape(Cross.title) : "Gathering for what?";
    switch ($(".cross-title .show").html(title), $(".cross-title").removeClass("single-line").removeClass("double-line"), 
    $(".cross-title h1").height() > 50 ? $(".cross-title").addClass("double-line").removeClass("single-line") : $(".cross-title").addClass("single-line").removeClass("double-line"), 
    document.title = "EXFE - " + Cross.title, from) {
     case "gather":
      $(".cross-title .edit").val(Cross.title);
      break;

     case "cross":
      $("#gather-title").val(Cross.title);
      break;

     default:
      $(".cross-title .edit").val(Cross.title), $("#gather-title").val(Cross.title);
    }
  }, ShowDescription = function() {
    var expended = $(".cross-description .xbtn-more").hasClass("xbtn-less"), domDesc = "";
    $(".cross-description").toggleClass("more", !0), $(".cross-description .xbtn-more").toggleClass("xbtn-less", !1), 
    Cross.description ? (domDesc = ExfeUtilities.escape(Cross.description).replace(/\r\n|\r|\n/g, "<br>"), 
    $(".cross-description .show").toggleClass("gray", !1).toggleClass("gsd", !1)) : (domDesc = "Click here to describe something about this ·X·.", 
    $(".cross-description .show").toggleClass("gray", !0).toggleClass("gsd", !Cross.id)), 
    $(".cross-description .show").html() !== domDesc && $(".cross-description .show").html(domDesc), 
    $(".cross-description .show").height() > 180 ? ($(".cross-description").toggleClass("more", !1), 
    $(".cross-description .xbtn-more").show(), expended && ($(".cross-description").toggleClass("more", !0), 
    $(".cross-description .xbtn-more").toggleClass("xbtn-less", !0))) : $(".cross-description .xbtn-more").hide(), 
    $(".cross-description .edit").val(Cross.description), Editing && "rsvp" !== Editing || Cross.description || !Cross.id ? $(".cross-description").show() : $(".cross-description").hide();
  }, ShowTime = function() {
    ShowCrossTime(), ShowMessageTime();
  }, ShowCrossTime = function() {
    function getTimezoneOffset(timezone) {
      if (timezone = ExfeUtilities.trim(timezone)) {
        var arrTimezone = timezone.split(":");
        if (2 === arrTimezone.length) {
          var intHour = 60 * 60 * parseInt(arrTimezone[0], 10), intMin = 60 * parseInt(arrTimezone[1], 10);
          return intHour + (intHour > 0 ? intMin : -intMin);
        }
      }
      return null;
    }
    var crossOffset = getTimezoneOffset(Cross.time.begin_at.timezone), timeOffset = getTimezoneOffset(ExfeUtilities.getTimezone()), strAbsTime = (crossOffset === timeOffset && window._ENV_.timevalid, 
    ""), strRelTime = "", placeholder = "Pick a time.", showGray = !1;
    if (Cross.time.origin) {
      var t = HumanTime.printEFTime(Cross.time, "X");
      strAbsTime = t.content, strRelTime = t.title;
    } else strAbsTime = placeholder, strRelTime = "Sometime", showGray = !0;
    $(".cross-date h2").html(strRelTime), $(".cross-time").html(strAbsTime).toggleClass("gray", showGray);
  }, ShowPlace = function(place) {
    $(".cross-dp.cross-place > h2").html(place.title ? ExfeUtilities.escape(place.title) : "Somewhere"), 
    $(".cross-dp.cross-place > address").toggleClass("more", !0), $(".cross-dp.cross-place .xbtn-more").toggleClass("xbtn-less", !1), 
    place.description ? $(".cross-dp.cross-place > address").html(ExfeUtilities.escape(place.description).replace(/\r\n|\r|\n/g, "<br>")).toggleClass("gray", !1) : $(".cross-dp.cross-place > address").html("Choose a place.").toggleClass("gray", !0), 
    $(".cross-dp.cross-place > address").height() > 80 ? ($(".cross-dp.cross-place > address").toggleClass("more", !1), 
    $(".cross-dp.cross-place .xbtn-more").show()) : $(".cross-dp.cross-place .xbtn-more").hide(), 
    place.description || place.title ? $(".cross-dp.cross-place > address").css("display", "none") : $(".cross-dp.cross-place > address").text("Choose a place.").css("display", "block");
  }, ShowExfee = function() {
    window.GatherExfeeWidget.showAll(!0), window.CrossExfeeWidget.showAll(!1, !0);
  }, ShowBackground = function() {
    for (var i = 0; Cross.widget.length > i && "Background" !== Cross.widget[i].type; i++) ;
    $(".x-gather").toggleClass("no-bg", !1), $(".cross-background").css("background-image", "url(/static/img/xbg/" + (Cross.widget[i].image ? Cross.widget[i].image : "default.jpg") + ")");
  }, lastConvUpdate = "", messageIds = {}, ShowTimeline = function(timeline, notification) {
    Timeline = timeline;
    for (var i = Timeline.length - 1; i >= 0; i--) i || (lastConvUpdate = Timeline[i].created_at), 
    ShowMessage(Timeline[i], notification);
  }, ShowMessage = function(message, notification) {
    if (void 0 === messageIds[message.id]) {
      messageIds[message.id] = !0;
      var txtMessage = ExfeUtilities.escape(message.content).replace(/\r\n|\n\r|\r|\n/g, "\n"), strMessage = '<div class="avatar-comment"><span class="pull-left avatar"><img alt="" src="' + message.by_identity.avatar_filename + '" width="40" height="40" />' + "</span>" + '<div class="comment">' + "<p>" + '<span class="author"><strong>' + message.by_identity.name + "</strong>:&nbsp;</span>" + ExfeUtilities.escape(message.content).replace(/\r\n|\n\r|\r|\n/g, "<br>") + '<span class="pull-right date">' + '<time data-iso-time="' + HumanTime.toISO(message.created_at) + '"></time>' + "</span>" + "</p>" + "</div>" + "</div>";
      $(".conversation-timeline").prepend(strMessage), notification && window.webkitNotifications && 0 === window.webkitNotifications.checkPermission() && window.webkitNotifications.createNotification(null, "EXFE - " + Cross.title, message.by_identity.name + ": " + txtMessage).show();
    }
  }, ShowMessageTime = function() {
    $("time[data-iso-time]").each(function() {
      var that = $(this);
      that.text(HumanTime(that.data("iso-time")));
    });
  }, ShowRsvp = function(buttons) {
    var myInvitation = ExfeeWidget.getMyInvitation();
    if (myInvitation) {
      var by_identity = myInvitation.by_identity ? myInvitation.by_identity : curIdentity, byMe = myInvitation.identity.id === by_identity.id;
      if ("NORESPONSE" === myInvitation.rsvp_status || "IGNORED" === myInvitation.rsvp_status || buttons) return byMe ? $(".cross-rsvp .edit .by").hide() : ($(".cross-rsvp .edit .by .avatar img").attr("src", myInvitation.by_identity.avatar_filename), 
      $(".cross-rsvp .edit .by strong").html(myInvitation.by_identity.name), $(".cross-rsvp .edit .by").show()), 
      $(".cross-rsvp .show").hide(), $(".cross-rsvp .edit").fadeIn(233), void 0;
      if ("ACCEPTED" === myInvitation.rsvp_status || "INTERESTED" === myInvitation.rsvp_status || "DECLINED" === myInvitation.rsvp_status) {
        var attendance = "";
        switch (myInvitation.rsvp_status) {
         case "ACCEPTED":
          attendance = "Accepted";
          break;

         case "DECLINED":
          attendance = "Unavailable";
          break;

         case "INTERESTED":
          attendance = "Interested";
        }
        byMe || "INTERESTED" === myInvitation.rsvp_status ? ($(".cross-rsvp .show .by").hide(), 
        $(".cross-rsvp .show .by strong").html("")) : ($(".cross-rsvp .show .by .avatar img").attr("src", myInvitation.by_identity.avatar_filename), 
        $(".cross-rsvp .show .by strong").html(myInvitation.by_identity.name), $(".cross-rsvp .show .by").show());
        for (var objSummary = ExfeeWidget.summary(), strSummary = "", i = 0; Math.min(objSummary.accepted_invitations.length, 5) > i; i++) strSummary += '<li><span class="avatar alt40"><img height="20" width="20" alt="" src="' + objSummary.accepted_invitations[i].identity.avatar_filename + '">' + (objSummary.accepted_invitations[i].mates ? '<i class="icon10-plus-' + objSummary.accepted_invitations[i].mates + '"></i>' : "") + "</span></li>";
        strSummary += objSummary.accepted ? "<li><span>" + objSummary.accepted + " accepted.</span></li>" : "";
        var objAccepted = $(".cross-rsvp .show .accepted");
        return objAccepted.text() !== $(strSummary).text() && objAccepted.html(strSummary), 
        $(".cross-rsvp .show .by").hide(), $(".cross-rsvp .show .change").hide(), $(".cross-rsvp .show .attendance").html(attendance), 
        $(".cross-rsvp .show").fadeIn(233), $(".cross-rsvp .edit").hide(), void 0;
      }
    }
    $(".cross-rsvp .show").hide(), $(".cross-rsvp .edit").hide();
  }, ShowGoogleMap = function(place) {
    function getMap(position) {
      var coords = position.coords;
      map_dom = map_dom.replace(/\{\{lat\}\}/gi, coords.latitude).replace(/\{\{lng\}\}/gi, coords.longitude).replace(/\{\{title\}\}/gi, ("" === place.provider ? coords.latitude + "," + coords.longitude + " " : "") + encodeURIComponent(place.title)), 
      $(".cross-map").append(map_dom);
    }
    $(".cross-map").empty();
    var hasLL = place.lat.length && place.lng.length, map_dom = '<a target="_blank" href="https://maps.google.com/maps?key=' + _ENV_.MAP_KEY + '&q={{title}}&hl=en&ie=UTF8&sll={{lat}},{{lng}}&t=m&z=16"><img src="https://maps.googleapis.com/maps/api/staticmap?center={{lat}},{{lng}}&markers=icon%3a' + encodeURIComponent("http://img.exfe.com/web/map_pin_blue.png") + '%7C{{lat}},{{lng}}&zoom=13&size=280x170&maptype=road&sensor=false" alt="" width="280" height="170" /></a>';
    hasLL && getMap({
      coords: {
        latitude: place.lat,
        longitude: place.lng
      }
    });
  }, ShowCross = function() {
    ShowTitle(), ShowDescription(), ShowPlace(Cross.place), ShowExfee(), ShowBackground(), 
    ShowRsvp(), ShowGoogleMap(Cross.place);
  }, RawGetTimeline = function(notification) {
    var args = {
      resources: {
        exfee_id: Exfee.id
      }
    };
    lastConvUpdate && (args.params = {
      updated_at: lastConvUpdate
    }), Api.request("conversation", args, function(data) {
      ShowTimeline(data.conversation, notification);
    });
  }, RtGetTimeline = function() {
    RawGetTimeline(!0);
  }, GetTimeline = function() {
    $("#conversation-form span.avatar img").attr("src", curIdentity.avatar_filename), 
    $("#conversation-form").show(), $(".conversation-timeline").html(""), $(".cross-conversation").slideDown(233), 
    lastConvUpdate = "", messageIds = {}, RawGetTimeline(), convTimer = setInterval(RtGetTimeline, 233e3);
  }, UpdateCross = function(objCross, read_only) {
    Cross.id = objCross.id, Cross.title = objCross.title, Cross.description = objCross.description, 
    Cross.time = objCross.time, Cross.place = objCross.place, Cross.widget = objCross.widget, 
    Cross.exfee_id = objCross.exfee.id, Exfee = objCross.exfee, readOnly = read_only, 
    savedCross = summaryCross(), void 0 === Cross.time || void 0 === Cross.time.begin_at || Cross.time.begin_at.timezone || (Cross.time.begin_at.timezone = ExfeUtilities.getTimezone()), 
    $(".cross-date  .edit").val(Cross.time.origin), $(".cross-place .edit").val(Cross.place.title + (Cross.place.description ? "\n" + Cross.place.description : ""));
    for (var i = 0; Exfee.invitations.length > i; i++) if (ExfeeWidget.isMyIdentity(Exfee.invitations[i].identity)) {
      curIdentity = ExfeUtilities.clone(Exfee.invitations[i].identity);
      break;
    }
    ShowCross(), GetTimeline();
  }, GetCross = function(cross_id) {
    Api.request("getCross", {
      resources: {
        cross_id: cross_id
      }
    }, function(data) {
      UpdateCross(data.cross, !1);
    }, function() {
      bus.emit("app:cross:forbidden", cross_id);
    });
  }, ResetCross = function() {
    window.Cross = ExfeUtilities.clone(rawCross), window.Exfee = ExfeUtilities.clone(rawExfee);
  }, NewCross = function() {
    autoSetTitle = !0, readOnly = !1, ResetCross(), fixBackground(), fixTitle(), fixTime(), 
    fixExfee(), ShowCross(), ShowGatherForm();
  }, Gather = function() {
    var objCross = ExfeUtilities.clone(Cross);
    objCross.exfee = ExfeUtilities.clone(Exfee), objCross.by_identity = {
      id: curIdentity.id
    }, Api.request("gather", {
      type: "POST",
      data: JSON.stringify(objCross),
      beforeSend: function() {
        $(".cross-opts .saving").show();
      },
      complete: function() {
        $(".cross-opts .saving").hide();
      }
    }, function(data) {
      document.location = "/#!" + data.cross.id;
    }, function() {
      $("#cross-form-gather").prop("disabled", !1).toggleClass("disabled", !1);
    });
  }, SaveCross = function() {
    $(".cross-opts .saving").show();
    var objCross = ExfeUtilities.clone(Cross);
    objCross.by_identity = {
      id: curIdentity.id
    }, Api.request("editCross", {
      type: "POST",
      resources: {
        cross_id: Cross.id
      },
      data: JSON.stringify(objCross)
    }, function() {
      $(".cross-opts .saving").hide(), bus.emit("app:cross:edited");
    }, function(data) {
      $(".cross-opts .saving").hide();
      var errorType = !data.meta || 401 !== data.meta.code && 403 !== data.meta.code ? "" : "no_permission";
      bus.emit("app:cross:edited", {
        error: errorType
      });
    });
  }, summaryCross = function() {
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
  }, AutoSaveCross = function() {
    if (Cross.id) {
      var curCross = summaryCross();
      savedCross !== curCross && (SaveCross(), savedCross = curCross);
    }
  }, ShowGatherForm = function(hide) {
    hide ? ($(".cross-form").slideUp(233), $(".cross-edit").show(233)) : (ShowHost(), 
    $("#gather").addClass("gathering-x"), $(".cross-form").slideDown(233), $(".cross-edit").hide(233), 
    $("#gather-title").select(), $("#gather-title").focus());
  };
  window.Store = require("store"), window.Api = require("api"), window.webkitNotifications && window.webkitNotifications.requestPermission(function() {});
  var HumanTime = require("humantime");
  window.curIdentity = null, window.readOnly = !1;
  var bus = require("bus"), savedCross = "";
  bus.on("xapp:cross:main", function() {
    var Signin = Store.get("authorization");
    window.User = Signin ? Store.get("user") : null, User && (Api.setToken(Signin.token), 
    curIdentity = ExfeUtilities.clone(User.identities[0])), ResetCross(), ExfeeWidgestInit(), 
    ButtonsInit(), GatherFormInit(), Editing = "", Editable(), Marked = require("marked"), 
    window.ExfeePanel = require("exfeepanel"), window.showtimeTimer = setInterval(ShowTime, 50), 
    window.convTimer = null;
  }), bus.on("xapp:cross", function(Cross_id, browsingIdentity, cross, read_only, invitation_token, rsvp_action) {
    if (Cross_id > 0) {
      GetCross(Cross_id);
      var pxw = new (require("photoxwidget"))({
        options: {
          crossId: Cross_id,
          parentNode: $(".cross-photox")
        }
      });
      pxw.show();
    } else if (null === Cross_id) switch (browsingIdentity && (curIdentity = browsingIdentity, 
    Api.setToken(invitation_token)), UpdateCross(cross, read_only), rsvp_action) {
     case "accept":
      ExfeeWidget.rsvpMe("ACCEPTED"), ShowRsvp();
      break;

     case "decline":
      ExfeeWidget.rsvpMe("DECLINED"), ShowRsvp();
    } else NewCross(), window.InitCross = ExfeUtilities.clone(Cross);
  }), bus.on("app:user:signin:after", function() {
    if (window.Cross && !window.Cross.id) {
      var Signin = Store.get("authorization");
      window.User = Signin ? Store.get("user") : null, User && (Api.setToken(Signin.token), 
      curIdentity = ExfeUtilities.clone(User.identities[0]), ShowHost(), fixExfee());
    }
  }), bus.on("xapp:cross:end", function() {
    clearTimeout(window.showtimeTimer), clearTimeout(window.convTimer);
  }), $(document.body).on("hover", "div.lock-tag", function(e) {
    var t = e.type, offset = $(this).offset();
    "mouseenter" === t ? $('<div class="tooltip tip-lock" id="app-tip-lock"><div class="inner"><div>This <span class="x">·X·</span> is private.</div><div>Accessible to only attendees.</div></div></div>').css({
      left: offset.left - 135,
      top: offset.top + 25
    }).appendTo(document.body) : $("#app-tip-lock").remove();
  });
});

var MD5 = function(string) {
  function RotateLeft(lValue, iShiftBits) {
    return lValue << iShiftBits | lValue >>> 32 - iShiftBits;
  }
  function AddUnsigned(lX, lY) {
    var lX4, lY4, lX8, lY8, lResult;
    return lX8 = 2147483648 & lX, lY8 = 2147483648 & lY, lX4 = 1073741824 & lX, lY4 = 1073741824 & lY, 
    lResult = (1073741823 & lX) + (1073741823 & lY), lX4 & lY4 ? 2147483648 ^ lResult ^ lX8 ^ lY8 : lX4 | lY4 ? 1073741824 & lResult ? 3221225472 ^ lResult ^ lX8 ^ lY8 : 1073741824 ^ lResult ^ lX8 ^ lY8 : lResult ^ lX8 ^ lY8;
  }
  function F(x, y, z) {
    return x & y | ~x & z;
  }
  function G(x, y, z) {
    return x & z | y & ~z;
  }
  function H(x, y, z) {
    return x ^ y ^ z;
  }
  function I(x, y, z) {
    return y ^ (x | ~z);
  }
  function FF(a, b, c, d, x, s, ac) {
    return a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac)), AddUnsigned(RotateLeft(a, s), b);
  }
  function GG(a, b, c, d, x, s, ac) {
    return a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac)), AddUnsigned(RotateLeft(a, s), b);
  }
  function HH(a, b, c, d, x, s, ac) {
    return a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac)), AddUnsigned(RotateLeft(a, s), b);
  }
  function II(a, b, c, d, x, s, ac) {
    return a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac)), AddUnsigned(RotateLeft(a, s), b);
  }
  function ConvertToWordArray(string) {
    for (var lWordCount, lMessageLength = string.length, lNumberOfWords_temp1 = lMessageLength + 8, lNumberOfWords_temp2 = (lNumberOfWords_temp1 - lNumberOfWords_temp1 % 64) / 64, lNumberOfWords = 16 * (lNumberOfWords_temp2 + 1), lWordArray = Array(lNumberOfWords - 1), lBytePosition = 0, lByteCount = 0; lMessageLength > lByteCount; ) lWordCount = (lByteCount - lByteCount % 4) / 4, 
    lBytePosition = 8 * (lByteCount % 4), lWordArray[lWordCount] = lWordArray[lWordCount] | string.charCodeAt(lByteCount) << lBytePosition, 
    lByteCount++;
    return lWordCount = (lByteCount - lByteCount % 4) / 4, lBytePosition = 8 * (lByteCount % 4), 
    lWordArray[lWordCount] = lWordArray[lWordCount] | 128 << lBytePosition, lWordArray[lNumberOfWords - 2] = lMessageLength << 3, 
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29, lWordArray;
  }
  function WordToHex(lValue) {
    var lByte, lCount, WordToHexValue = "", WordToHexValue_temp = "";
    for (lCount = 0; 3 >= lCount; lCount++) lByte = 255 & lValue >>> 8 * lCount, WordToHexValue_temp = "0" + lByte.toString(16), 
    WordToHexValue += WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
    return WordToHexValue;
  }
  function Utf8Encode(string) {
    string = string.replace(/\r\n/g, "\n");
    for (var utftext = "", n = 0; string.length > n; n++) {
      var c = string.charCodeAt(n);
      128 > c ? utftext += String.fromCharCode(c) : c > 127 && 2048 > c ? (utftext += String.fromCharCode(192 | c >> 6), 
      utftext += String.fromCharCode(128 | 63 & c)) : (utftext += String.fromCharCode(224 | c >> 12), 
      utftext += String.fromCharCode(128 | 63 & c >> 6), utftext += String.fromCharCode(128 | 63 & c));
    }
    return utftext;
  }
  var k, AA, BB, CC, DD, a, b, c, d, x = [], S11 = 7, S12 = 12, S13 = 17, S14 = 22, S21 = 5, S22 = 9, S23 = 14, S24 = 20, S31 = 4, S32 = 11, S33 = 16, S34 = 23, S41 = 6, S42 = 10, S43 = 15, S44 = 21;
  for (string = Utf8Encode(string), x = ConvertToWordArray(string), a = 1732584193, 
  b = 4023233417, c = 2562383102, d = 271733878, k = 0; x.length > k; k += 16) AA = a, 
  BB = b, CC = c, DD = d, a = FF(a, b, c, d, x[k + 0], S11, 3614090360), d = FF(d, a, b, c, x[k + 1], S12, 3905402710), 
  c = FF(c, d, a, b, x[k + 2], S13, 606105819), b = FF(b, c, d, a, x[k + 3], S14, 3250441966), 
  a = FF(a, b, c, d, x[k + 4], S11, 4118548399), d = FF(d, a, b, c, x[k + 5], S12, 1200080426), 
  c = FF(c, d, a, b, x[k + 6], S13, 2821735955), b = FF(b, c, d, a, x[k + 7], S14, 4249261313), 
  a = FF(a, b, c, d, x[k + 8], S11, 1770035416), d = FF(d, a, b, c, x[k + 9], S12, 2336552879), 
  c = FF(c, d, a, b, x[k + 10], S13, 4294925233), b = FF(b, c, d, a, x[k + 11], S14, 2304563134), 
  a = FF(a, b, c, d, x[k + 12], S11, 1804603682), d = FF(d, a, b, c, x[k + 13], S12, 4254626195), 
  c = FF(c, d, a, b, x[k + 14], S13, 2792965006), b = FF(b, c, d, a, x[k + 15], S14, 1236535329), 
  a = GG(a, b, c, d, x[k + 1], S21, 4129170786), d = GG(d, a, b, c, x[k + 6], S22, 3225465664), 
  c = GG(c, d, a, b, x[k + 11], S23, 643717713), b = GG(b, c, d, a, x[k + 0], S24, 3921069994), 
  a = GG(a, b, c, d, x[k + 5], S21, 3593408605), d = GG(d, a, b, c, x[k + 10], S22, 38016083), 
  c = GG(c, d, a, b, x[k + 15], S23, 3634488961), b = GG(b, c, d, a, x[k + 4], S24, 3889429448), 
  a = GG(a, b, c, d, x[k + 9], S21, 568446438), d = GG(d, a, b, c, x[k + 14], S22, 3275163606), 
  c = GG(c, d, a, b, x[k + 3], S23, 4107603335), b = GG(b, c, d, a, x[k + 8], S24, 1163531501), 
  a = GG(a, b, c, d, x[k + 13], S21, 2850285829), d = GG(d, a, b, c, x[k + 2], S22, 4243563512), 
  c = GG(c, d, a, b, x[k + 7], S23, 1735328473), b = GG(b, c, d, a, x[k + 12], S24, 2368359562), 
  a = HH(a, b, c, d, x[k + 5], S31, 4294588738), d = HH(d, a, b, c, x[k + 8], S32, 2272392833), 
  c = HH(c, d, a, b, x[k + 11], S33, 1839030562), b = HH(b, c, d, a, x[k + 14], S34, 4259657740), 
  a = HH(a, b, c, d, x[k + 1], S31, 2763975236), d = HH(d, a, b, c, x[k + 4], S32, 1272893353), 
  c = HH(c, d, a, b, x[k + 7], S33, 4139469664), b = HH(b, c, d, a, x[k + 10], S34, 3200236656), 
  a = HH(a, b, c, d, x[k + 13], S31, 681279174), d = HH(d, a, b, c, x[k + 0], S32, 3936430074), 
  c = HH(c, d, a, b, x[k + 3], S33, 3572445317), b = HH(b, c, d, a, x[k + 6], S34, 76029189), 
  a = HH(a, b, c, d, x[k + 9], S31, 3654602809), d = HH(d, a, b, c, x[k + 12], S32, 3873151461), 
  c = HH(c, d, a, b, x[k + 15], S33, 530742520), b = HH(b, c, d, a, x[k + 2], S34, 3299628645), 
  a = II(a, b, c, d, x[k + 0], S41, 4096336452), d = II(d, a, b, c, x[k + 7], S42, 1126891415), 
  c = II(c, d, a, b, x[k + 14], S43, 2878612391), b = II(b, c, d, a, x[k + 5], S44, 4237533241), 
  a = II(a, b, c, d, x[k + 12], S41, 1700485571), d = II(d, a, b, c, x[k + 3], S42, 2399980690), 
  c = II(c, d, a, b, x[k + 10], S43, 4293915773), b = II(b, c, d, a, x[k + 1], S44, 2240044497), 
  a = II(a, b, c, d, x[k + 8], S41, 1873313359), d = II(d, a, b, c, x[k + 15], S42, 4264355552), 
  c = II(c, d, a, b, x[k + 6], S43, 2734768916), b = II(b, c, d, a, x[k + 13], S44, 1309151649), 
  a = II(a, b, c, d, x[k + 4], S41, 4149444226), d = II(d, a, b, c, x[k + 11], S42, 3174756917), 
  c = II(c, d, a, b, x[k + 2], S43, 718787259), b = II(b, c, d, a, x[k + 9], S44, 3951481745), 
  a = AddUnsigned(a, AA), b = AddUnsigned(b, BB), c = AddUnsigned(c, CC), d = AddUnsigned(d, DD);
  var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
  return temp.toLowerCase();
};

define("lightsaber", function(require, exports, module) {
  "use strict";
  function createApplication() {
    var app = new Application();
    return merge(app, Emitter.prototype), app.request = new Request(), app.response = new Response(), 
    app.init(), app;
  }
  function Application() {}
  function Request(enableFullUrlPath) {
    this.enableFullUrlPath = !!enableFullUrlPath, this.session = {}, this.path = "/", 
    this.method = "GET", this.updateUrl();
  }
  function Response(path, state) {
    this.path = path, this.title = document.title, this.state = state || {};
  }
  function Router(options) {
    options = options || {};
    var self = this;
    this.map = [], this.params = {}, this._params = [], this.caseSensitive = options.caseSensitive, 
    this.strict = options.strict, this.middleware = function(req, res, next) {
      self._dispatch(req, res, next);
    };
  }
  function Route(path, callbacks, options) {
    options = options || {}, this.path = path, this.callbacks = callbacks, this.regexp = pathToRegexp(path, this.keys = [], options.sensitive, options.strict);
  }
  function View(name, options, timestamp) {
    options = options || {}, this.name = name, this.root = options.root, this.engine = options.engine, 
    this.ext = extname(name), this.timestamp = timestamp || "", this.path = this.lookup(name);
  }
  function lightsaberInit(app) {
    return function(req, res, next) {
      req.app = res.app = app, req.next = next, res.locals = res.locals || locals(res), 
      next();
    };
  }
  function uuid() {
    return ++uuid.id;
  }
  function indexOf(a, el, i) {
    var l = a.length;
    if (!l) return -1;
    if (i || (i = 0), i > l) return -1;
    for (0 > i && (i = Math.max(0, l + i)); l > i; ++i) if (i in a && a[i] === el) return i;
    return -1;
  }
  function read(engine, path, options, fn, ext) {
    return $.get(path, function(tpl) {
      var template, html = tpl;
      "html" !== ext && (template = engine.compile(tpl), html = template(options)), fn(html);
    });
  }
  function extname(filename) {
    return filename.split(".")[1] || "html";
  }
  function locals(obj) {
    function _locals(obj) {
      for (var key in obj) _locals[key] = obj[key];
      return obj;
    }
    return obj.viewCallbacks = obj.viewCallbacks || [], _locals;
  }
  function merge(t, s) {
    var k;
    if (t && s) for (k in s) t[k] = s[k];
    return t;
  }
  function pathToRegexp(path, keys, sensitive, strict) {
    return path instanceof RegExp ? path : (isArray(path) && (path = "(" + path.join("|") + ")"), 
    path = path.concat(strict ? "" : "/?").replace(/\/\(/g, "(?:/").replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function(_, slash, format, key, capture, optional, star) {
      return keys.push({
        name: key,
        optional: !!optional
      }), slash = slash || "", "" + (optional ? "" : slash) + "(?:" + (optional ? slash : "") + (format || "") + (capture || format && "([^/.]+?)" || "([^/]+?)") + ")" + (optional || "") + (star ? "(/*)?" : "");
    }).replace(/([\/.])/g, "\\$1").replace(/\*/g, "(.*)"), RegExp("^" + path + "$", sensitive ? "" : "i"));
  }
  var historySupport, Emitter = require("emitter"), isIE = /msie [\w.]+/.exec(navigator.userAgent.toLowerCase()), $ = require("jquery") || require("zepto"), proxy = function(f, c) {
    return f ? function(e) {
      return f.call(c, e);
    } : void 0;
  }, location = window.location, history = window.history, ROOT = "/", _firstLoad = !1;
  $(window).on("load", function() {
    _firstLoad = !0, setTimeout(function() {
      _firstLoad = !1;
    }, 0);
  }), exports = module.exports = createApplication;
  var proto;
  exports.version = "0.0.5", proto = Application.prototype, proto.historySupport = historySupport = null !== (null !== history ? history.pushState : void 0), 
  $.browser && $.browser.opera && (proto.historySupport = historySupport = !1), proto.init = function() {
    this.route = ROOT, this.stack = [], this.cache = {}, this.settings = {}, this.engines = {}, 
    this.viewCallbacks = [], this.defaultConfiguration();
  }, proto.defaultConfiguration = function() {
    this.set("env", "production"), this.enable("dispatch"), this.use(lightsaberInit(this)), 
    this._usedRouter = !1, this._router = new Router(this), this.routes = this._router.map, 
    this._router.caseSensitive = this.enabled("case sensitive routing"), this._router.strict = this.enabled("strict routing"), 
    this.locals = locals(this), this.locals.settings = this.settings, this.configure("development", function() {
      this.set("env", "development");
    }), this.configure("production", function() {
      this.enable("view cache");
    });
  }, proto.use = function(route, fn) {
    return "string" != typeof route && (fn = route, route = ROOT), ROOT !== route && ROOT === route[route.length - 1] && (route = route.slice(0, -1)), 
    this.stack.push({
      route: route,
      handle: fn
    }), this;
  }, proto.engine = function(ext, fn) {
    if ("function" != typeof fn) throw Error("callback function required");
    return "." !== ext[0] && (ext = "." + ext), this.engines[ext] = fn, this;
  }, proto.set = function(setting, val) {
    return 1 !== arguments.length ? (this.settings[setting] = val, this) : this.settings.hasOwnProperty(setting) ? this.settings[setting] : void 0;
  }, proto.enabled = function(setting) {
    return !!this.set(setting);
  }, proto.disabled = function(setting) {
    return !this.set(setting);
  }, proto.enable = function(setting) {
    return this.set(setting, !0);
  }, proto.disable = function(setting) {
    return this.set(setting, !1);
  }, proto.configure = function(env, fn) {
    var envs = "all", args = [].slice.call(arguments);
    return fn = args.pop(), args.length && (envs = args), ("all" === envs || ~indexOf(envs, this.settings.env)) && fn.call(this), 
    this;
  }, proto.render = function(name, options, fn) {
    var view, opts = {}, cache = this.cache;
    if (this.engine, "function" == typeof options && (fn = options, options = {}), merge(opts, this.locals), 
    options.locals && merge(opts, options.locals), merge(opts, options), opts.cache = null === opts.cache ? this.enabled("view cache") : opts.cache, 
    opts.cache && (view = cache[name]), !view) {
      if (view = new View(name, {
        engine: this.set("view engine"),
        root: this.set("views")
      }, this.set("timestamp")), !view.path) {
        var err = Error('Failed to lookup view "' + name + '"');
        return err.view = view, fn(err);
      }
      opts.cache && (cache[name] = view);
    }
    try {
      view.render(opts, fn);
    } catch (err) {
      fn(err);
    }
  }, proto.path = function() {
    return this.route;
  }, proto.param = function(name, fn) {
    var len, fns = [].slice.call(arguments, 1), i = 0;
    if (isArray(name)) for (len = name.length; len > i; ++i) for (var j = 0, fl = fns.length; fl > j; ++j) this.param(name[i], fns[j]); else if ("function" == typeof name) this._router.param(name); else for (":" === name[0] && (name = name.substr(1)), 
    len = fns.length; len > i; ++i) this._router.param(name, fn);
    return this;
  }, proto.initRouter = function() {
    this._usedRouter === !1 && (this._usedRouter = !0, this.use(this._router.middleware));
  }, proto.get = function() {
    var args = [].slice.call(arguments);
    return this.initRouter(), this._router.route.apply(this._router, args);
  }, proto.handle = function(req, res) {
    function next(err) {
      var path, layer = stack[index++];
      if (slashAdded && (req.url = req.url.substr(1), slashAdded = !1), req.url = removed + req.url, 
      layer) try {
        if (path = req.url, 0 !== path.indexOf(layer.route)) return next(err);
        var arity = layer.handle.length;
        removed = layer.route, req.url = req.url.substr(removed.length), "/" !== req.url[0] && (req.url = "/" + req.url, 
        slashAdded = !0), err ? 4 === arity ? layer.handle(err, req, res, next) : next(err) : 4 > arity ? layer.handle(req, res, next) : next();
      } catch (e) {
        next(e);
      }
    }
    if (req.enableFullUrlPath || req.fullpath === req.path) {
      var stack = this.stack, removed = "", slashAdded = !1, index = 0;
      next();
    }
  }, proto.run = function(options) {
    this.emit("launch"), options = options || {};
    var req = this.request, res = this.response;
    this.running || (this.running = !0, !1 === options.dispatch && this.disable("dispatch"), 
    !1 !== options.popstate && (this.historySupport && !isIE ? window.addEventListener("popstate", proxy(this.change, this), !1) : window.addEventListener("hashchange", proxy(this.change, this), !1)), 
    this.disabled("dispatch") || (this.handle(req, res), this.emit("launched")));
  }, proto.change = function(e) {
    if (_firstLoad) return _firstLoad = !1;
    var app = this, req = app.request, res = app.response, url = req.url;
    return req.updateUrl(), url !== req.url ? (app.handle(req, res), e && (e.stopPropagation(), 
    e.preventDefault()), !1) : void 0;
  }, proto.error = function(code, msg) {
    var err = Error(msg);
    return err.status = code, err;
  }, proto = Request.prototype, proto.updateUrl = function() {
    this.host = location.hostname, this.port = location.port || 80, this.fullpath = location.pathname, 
    this.enableFullUrlPath && (this.path = this.fullpath), this.hash = decodeURIComponent(location.hash), 
    this.querystring = decodeURIComponent(location.search), this.url = this.path + this.querystring + this.hash;
  }, proto.param = function(name, defaultValue) {
    var params = this.params || {}, query = this.query || {};
    return null != params[name] && params.hasOwnProperty(name) ? params[name] : null != query[name] ? query[name] : defaultValue;
  }, proto.getPath = function() {
    return this.path;
  }, proto.getHost = function() {
    return this.host;
  }, proto = Response.prototype, proto.location = function(url) {
    window.setTimeout(function() {
      location.href = url;
    }, 16);
  }, proto.redirect = function(url) {
    var title, state;
    return arguments.length, url = arguments[0], "back" === url || "forward" === url ? (history[url](), 
    void 0) : historySupport ? (title = arguments[1], state = arguments[2] || {}, this.path = url, 
    this.title = title || "EXFE.COM", document.title = this.title, this.state = state, 
    this.state.id = uuid(), this.pushState(), this.app.change(), void 0) : (this.location(url), 
    void 0);
  }, proto.save = function() {
    history.replaceState(this.state, this.title, this.path);
  }, proto.pushState = function() {
    history.pushState(this.state, this.title, this.path);
  }, proto.render = function(view, options, fn) {
    var self = this, options = options || {}, app = this.app;
    "function" == typeof options && (fn = options, options = {}), options.locals = self.locals, 
    app.render(view, options, fn);
  }, proto = Router.prototype, proto.param = function(name, fn) {
    if ("function" == typeof name) return this._params.push(name), void 0;
    var ret, i, params = this._params, len = params.length;
    for (i = 0; len > i; ++i) (ret = params[i](name, fn)) && (fn = ret);
    if ("function" != typeof fn) throw Error("invalid param() call for " + name + ", got " + fn);
    return (this.params[name] = this.params[name] || []).push(fn), this;
  }, proto._dispatch = function(req, res, next) {
    var params = this.params, self = this;
    (function pass(i, err) {
      function nextRoute(err) {
        pass(req._route_index + 1, err);
      }
      function param(err) {
        paramIndex = 0, key = keys[i++], paramVal = key && req.params[key.name], paramCallbacks = key && params[key.name];
        try {
          "route" === err ? nextRoute() : err ? (i = 0, callbacks(err)) : paramCallbacks && void 0 !== paramVal ? paramCallback() : key ? param() : (i = 0, 
          callbacks());
        } catch (err) {
          param(err);
        }
      }
      function paramCallback(err) {
        var fn = paramCallbacks[paramIndex++];
        return err || !fn ? param(err) : (fn(req, res, paramCallback, paramVal, key.name), 
        void 0);
      }
      function callbacks(err) {
        var fn = route.callbacks[i++];
        try {
          if ("route" === err) nextRoute(); else if (err && fn) {
            if (4 > fn.length) return callbacks(err);
            fn(err, req, res, callbacks);
          } else fn ? fn(req, res, callbacks) : nextRoute(err);
        } catch (err) {
          callbacks(err);
        }
      }
      var paramCallbacks, paramVal, route, keys, key, paramIndex = 0;
      return req.route = route = self.matchRequest(req, i), route ? (req.params = route.params, 
      keys = route.keys, i = 0, param(err), void 0) : next(err);
    })(0);
  }, proto.matchRequest = function(req, i) {
    var route, path = req.url, routes = this.map, len = routes.length;
    for (i = i || 0; len > i; ++i) if (route = routes[i], route.match(path)) return req._route_index = i, 
    route;
  }, proto.route = function(path) {
    path || Error("Router#get() requires a path");
    var callbacks = [].slice.call(arguments, 1), route = new Route(path, callbacks, {
      sensitive: this.caseSensitive,
      strict: this.strict
    });
    return (this.map = this.map || []).push(route), this;
  }, proto = Route.prototype, proto.match = function(path) {
    this.regexp.lastIndex = 0;
    var i, len, key, val, keys = this.keys, params = this.params = [], m = this.regexp.exec(path);
    if (!m) return !1;
    for (i = 1, len = m.length; len > i; ++i) key = keys[i - 1], val = "string" == typeof m[i] ? decodeURIComponent(m[i]) : m[i], 
    key ? params[key.name] = val : params.push(val);
    return !0;
  }, proto = View.prototype, proto.lookup = function(path) {
    return this.root + "/" + path + "?t=" + this.timestamp;
  }, proto.render = function(options, fn) {
    return read(this.engine, this.path, options, fn, this.ext);
  }, uuid.id = 0;
  var isArray = Array.isArray;
  isArray || (isArray = function(a) {
    return a instanceof Array;
  });
}), define("middleware", function(require, exports, module) {
  "use strict";
  function getAuthFromHeader() {
    var header = document.getElementsByTagName("head")[0], meta = document.getElementsByName("authorization")[0], authMeta = null;
    return meta && (authMeta = JSON.parse(meta.content), header.removeChild(meta)), 
    authMeta;
  }
  var Bus = require("bus"), Store = require("store"), $ = require("jquery"), middleware = module.exports = {};
  middleware.basicAuth = function(req, res, next) {
    var session = req.session, authorization = Store.get("authorization"), user = Store.get("user"), meta = getAuthFromHeader(), auth = meta && meta.authorization, data = meta && meta.data, event = meta && meta.event;
    !authorization || meta && auth ? !authorization && auth && data && !event ? (Store.set("oauth", session.oauth = {
      identity: data.identity,
      following: "twitter" === data.identity.provider ? !!data.twitter_following : !1,
      identity_status: data.identity_status
    }), delete session.user, Store.remove("user"), Store.set("authorization", session.authorization = auth)) : authorization && auth && data && !event && (authorization.user_id === auth.user_id && authorization.token !== auth.token ? (authorization.token = auth.token, 
    Store.set("authorization", session.authorization = authorization)) : authorization.user_id !== auth.user_id && authorization.token !== auth.token && data.identity && (Store.set("oauth", session.oauth = {
      identity: data.identity,
      following: "twitter" === data.identity.provider ? !!data.twitter_following : !1,
      identity_status: data.identity_status
    }), delete session.user, Store.remove("user"), Store.set("authorization", session.authorization = auth))) : (session.authorization = authorization, 
    session.user = user), meta && (event && (session.event = JSON.parse(event), session.event.data = data), 
    meta.verification_token && (session.verification_token = meta.verification_token), 
    meta.refere && meta.refere !== window.location.protocol + "//" + window.location.hostname + "/" && res.redirect(meta.refere || "/")), 
    next();
  }, middleware.errorHandler = function(req, res) {
    var url = /^\/404/;
    if (url.exec(window.location.pathname)) {
      Bus.emit("app:page:home", !1, !0);
      var authorization = Store.get("authorization");
      if (Bus.emit("app:page:usermenu", !!authorization), authorization) {
        var user = Store.get("user");
        Bus.emit("app:usermenu:updatenormal", user), Bus.emit("app:usermenu:crosslist", authorization.token, authorization.user_id);
      }
    } else res.location("/404");
  }, middleware.cleanupAppTmp = function(req, res, next) {
    var appTmp = $("#app-tmp");
    appTmp.find("[data-widget-id]").trigger("destory.widget"), appTmp.children().off().remove(), 
    $(".x-tmp").off().remove(), next();
  }, middleware.fixedFaceBookURL = function(req, res, next) {
    "#_=_" === window.location.hash && (window.location.hash = "", req.updateUrl(), 
    $.browser.mozilla) || next();
  };
}), define("routes", function(require, exports, module) {
  "use strict";
  function redirectToProfile(req, res) {
    function done(user, res) {
      var external_username = Util.printExtUserName(user.identities[0]);
      res.redirect("/#" + external_username.replace(/ /g, ""));
    }
    var session = req.session, user = Store.get("user");
    if (user) return done(user, res), void 0;
    var authorization = session.authorization;
    Bus.emit("app:user:signin", authorization.token, authorization.user_id, !0);
  }
  var R = require("rex"), Api = require("api"), Bus = require("bus"), Util = require("util"), Store = require("store");
  require("user");
  var routes = module.exports = {};
  routes.index = function(req, res) {
    return req.session.authorization ? (redirectToProfile(req, res), void 0) : (Bus.emit("app:page:home", !0), 
    res.render("home.html", function(tpl) {
      $("#app-main").append(tpl), $.ajax({
        dataType: "script",
        cache: !0,
        url: "/static/js/newhome/0.0.1/newhome.min.js?t=" + req.app.set("timestamp")
      });
    }), void 0);
  }, routes.gather = function(req, res) {
    var session = req.session;
    if (Bus.emit("app:page:home", !1), !session.initMenuBar) {
      var authorization = session.authorization, user = session.user;
      Bus.emit("app:page:usermenu", !!authorization), authorization && (session.initMenuBar = !0, 
      Bus.emit("app:usermenu:updatenormal", user), Bus.emit("app:usermenu:crosslist", authorization.token, authorization.user_id));
    }
    res.render("x.html", function(tpl) {
      $("#app-main").append(tpl), Bus.emit("xapp:cross:main"), Bus.emit("xapp:cross", 0);
    });
  }, routes.resolveToken = function(req, res, next) {
    req.origin = "resolveToken";
    var originToken = req.params[0];
    Bus.emit("app:page:home", !1), Bus.emit("app:page:usermenu", !0), originToken ? next() : res.redirect("/#invalid/token=" + originToken);
  }, routes.inspectResolveToken = function(req, res, next, data, originToken) {
    var session = req.session, user = session.user, authorization = session.authorization;
    session.originToken = originToken, session.resolveData = data;
    var browsing_authorization, target_token = data.token, target_user_id = data.user_id, target_user_name = data.user_name, mergeable_user = null, token_type = data.token_type, action = data.action;
    !mergeable_user && (authorization && authorization.user_id === target_user_id || !authorization && "VERIFY" === token_type && "VERIFIED" === action) ? (authorization = {
      token: target_token,
      user_id: target_user_id
    }, Store.set("authorization", session.authorization = authorization), session.auto_sign = "INPUT_NEW_PASSWORD" !== action) : session.browsing_authorization = browsing_authorization = data, 
    Bus.emit("app:api:getuser", target_token, target_user_id, function(results) {
      var new_user = results.user;
      if (session.resolveData.setup = "INPUT_NEW_PASSWORD" === action && "VERIFY" === token_type && new_user.password === !1, 
      browsing_authorization) {
        session.browsing_user = new_user;
        var forwardUrl, eun = Util.printExtUserName(new_user.identities[0]);
        forwardUrl = authorization ? "/#" + eun + "/token=" + originToken : "/#" + eun, 
        Bus.emit("app:usermenu:updatebrowsing", {
          normal: user,
          browsing: new_user,
          action: action,
          setup: "INPUT_NEW_PASSWORD" === action && "VERIFY" === token_type && new_user.password === !1,
          originToken: originToken,
          tokenType: "user",
          token: target_token,
          page: "resolve",
          readOnly: !0,
          user_name: target_user_name || new_user.name,
          mergeable_user: mergeable_user,
          forward: forwardUrl
        }, "browsing_identity");
      } else Store.set("user", user = session.user = results.user), Bus.emit("app:usermenu:updatenormal", user), 
      Bus.emit("app:usermenu:crosslist", authorization.token, authorization.user_id);
      next();
    });
  }, routes.resolveRequest = function(req, res, next) {
    var session = req.session, originToken = req.params[0];
    session.originToken = originToken, Api.request("resolveToken", {
      type: "POST",
      data: {
        token: originToken
      }
    }, function(data) {
      routes.inspectResolveToken(req, res, next, data, originToken);
    }, function() {
      res.redirect("/#invalid/token=" + originToken);
    });
  }, routes.resolveShow = function(req, res) {
    Bus.emit("app:page:home", !1), Bus.emit("app:page:usermenu", !0);
    var session = req.session, auto_sign = session.auto_sign, originToken = session.originToken, user = session.user, authorization = session.authorization, browsing_authorization = session.browsing_authorization, browsing_user = session.browsing_user, resolveData = session.resolveData, target_identity_id = resolveData.identity_id, token_type = resolveData.token_type, mergeable_user = null, action = resolveData.action, tplUrl = "identity_verified.html";
    if (mergeable_user) return res.render(tplUrl, function(tpl) {
      var $main = $("#app-main");
      $main.append(tpl);
      var d = $('<div id="js-dialog-merge" data-destory="true" data-widget="dialog" data-dialog-type="mergeidentity">');
      d.data("source", {
        merged_identity: R.find(browsing_user.identities, function(v) {
          return v.id === target_identity_id ? !0 : void 0;
        }),
        browsing_token: originToken,
        mergeable_user: mergeable_user
      }), d.appendTo($("#app-tmp")), d.trigger("click.dialog.data-api"), $(".modal-mi").css("top", 230);
    }), void 0;
    if (auto_sign && authorization && !browsing_authorization) return delete session.auto_sign, 
    res.render(tplUrl, function(tpl) {
      var $main = $("#app-main");
      $main.append(tpl), $main.find(".tab01").removeClass("hide"), $main.find(".tab01 > p").animate({
        opacity: 0
      }, 2333, function() {
        res.redirect("/");
      });
    }), void 0;
    if (!auto_sign && "VERIFY" === token_type && "VERIFIED" === action) return res.render(tplUrl, function(tpl) {
      var $main = $("#app-main");
      $main.append(tpl), $("#app-browsing-identity").trigger("click.data-api"), $(".modal-bi").css("top", 200);
    }), void 0;
    if ("INPUT_NEW_PASSWORD" === action) {
      var d;
      "SET_PASSWORD" === token_type && (tplUrl = "forgot_password.html"), res.render(tplUrl, function(tpl) {
        $("#app-main").append(tpl), authorization && !browsing_authorization ? (R.find(user.identities, function(v) {
          return v.id === target_identity_id ? !0 : void 0;
        }), "VERIFY" === token_type ? (d = $('<div class="merge setup" data-destory="true" data-user-action="setup" data-widget="dialog" data-dialog-type="setup_verification" data-redirect="true">'), 
        d.data("source", {
          browsing_user: user,
          originToken: originToken,
          user_name: resolveData.user_name,
          tokenType: "user"
        })) : "SET_PASSWORD" === token_type && (d = $('<div class="setpassword" data-destory="true" data-widget="dialog" data-dialog-type="setpassword" data-redirect="true">'), 
        d.data("source", {
          user: user,
          token: resolveData.setup ? authorization.token : originToken,
          setup: resolveData.setup
        })), d.appendTo($("#app-tmp")), d.trigger("click.dialog.data-api")) : "VERIFY" === token_type ? (Bus.once("app:user:signin:after", function() {
          var d2 = $('<div class="addidentity" data-destory="true" data-widget="dialog" data-dialog-type="addIdentityAfterSignIn">');
          d2.data("source", {
            identity: browsing_user.identities[0]
          }), d2.appendTo($("#app-tmp")), d2.trigger("click.dialog.data-api");
        }), $("#app-user-menu").find(".setup").trigger("click.dialog.data-api")) : (d = $('<div class="setpassword" data-destory="true" data-widget="dialog" data-dialog-type="setpassword" data-redirect="true">'), 
        d.data("source", {
          user: browsing_user,
          token: resolveData.setup ? browsing_authorization.token : originToken,
          setup: resolveData.setup
        }), d.appendTo($("#app-tmp")), d.trigger("click.dialog.data-api")), $(".modal-su, .modal-sp, .modal-bi").css("top", 250);
      });
    }
    delete session.browsing_authorization, delete session.resolveData, delete session.originToken;
  }, routes.cross = function(req, res) {
    var session = req.session, authorization = session.authorization, user = session.user;
    if (!authorization) return Bus.emit("app:page:home", !1), Bus.emit("app:page:usermenu", !1), 
    Bus.emit("app:cross:forbidden", req.params[0], null), void 0;
    Bus.emit("app:page:home", !1), Bus.emit("app:page:usermenu", !0), session.initMenuBar || (Bus.emit("app:usermenu:updatenormal", user), 
    Bus.emit("app:usermenu:crosslist", authorization.token, authorization.user_id));
    var cross_id = req.params[0];
    res.render("x.html", function(tpl) {
      $("#app-main").append(tpl), Bus.emit("xapp:cross:main"), Bus.emit("xapp:cross", cross_id);
    });
  }, Bus.on("app:cross:forbidden", function(cross_id, data) {
    $("#app-main").load("/static/views/forbidden.html", function() {
      var authorization = Store.get("authorization"), settings = {
        options: {
          keyboard: !1,
          backdrop: !1,
          viewData: {
            cls: "modal-id"
          }
        }
      };
      if (data && $(".sign-in").data("source", data.external_username), authorization) {
        var user = Store.get("user");
        $(".details").removeClass("hide"), $(".details .avatar img").attr("src", user.avatar_filename), 
        $(".details .identity-name").text(user.name), $(".please-access").removeClass("hide"), 
        $(".modal-id").css({
          top: 380
        });
      } else $(".sign-in").data("dialog-settings", settings), $(".sign-in").trigger("click.dialog.data-api"), 
      $(".sign-in").data("dialog-settings", null), $(".popmenu").addClass("hide"), $(".please-signin").removeClass("hide"), 
      $(".modal-id").css("top", 260);
    });
  }), routes.crossInvitation = function(req, res) {
    var session = req.session, authorization = session.authorization, user = session.user, user_id = user && user.id, cross_id = req.params[0], shortToken = req.params[1];
    Bus.emit("app:page:home", !1), Bus.emit("app:page:usermenu", !!authorization), authorization && (Bus.emit("app:usermenu:updatenormal", user), 
    Bus.emit("app:usermenu:crosslist", authorization.token, authorization.user_id)), 
    Api.request("getInvitationByToken", {
      type: "POST",
      resources: {
        cross_id: cross_id
      },
      data: {
        token: shortToken
      }
    }, function(data) {
      var _identity, invitation = data.invitation, identity = invitation.identity, by_identity = invitation.by_identity;
      return user_id && (_identity = R.find(user.identities, function(v) {
        return v.connected_user_id === identity.connected_user_id && v.id === identity.id ? !0 : void 0;
      })) ? (res.redirect("/#!" + cross_id), void 0) : "email" === identity.provider ? (Bus.emit("app:cross:forbidden", cross_id, identity), 
      void 0) : (res.render("invite.html", function(tpl) {
        $("#app-main").append(tpl), authorization ? ($(".please-access").removeClass("hide"), 
        $(".form-horizontal").addClass("fh-left"), $(".details").removeClass("hide"), $(".details .avatar img").attr("src", user.avatar_filename), 
        $(".details .identity-name").text(user.name)) : $(".please-signin").removeClass("hide"), 
        $(".invite-to").find("img").attr("src", identity.avatar_filename).parent().next().text(Util.printExtUserName(identity)), 
        $(".invite-from").find("img").attr("src", by_identity.avatar_filename).parent().next().text(Util.printExtUserName(by_identity));
        var $redirecting = $(".x-invite").find(".redirecting"), $fail = $redirecting.next(), clicked = !1, provider = identity.provider;
        $(".xbtn-authenticate").attr("data-oauth", provider).on("click", function(e) {
          if (e.stopPropagation(), e.preventDefault(), !clicked) {
            var provider = $(this).data("oauth");
            $.ajax({
              url: "/OAuth/Authenticate?provider=" + provider,
              type: "POST",
              dataType: "JSON",
              data: {
                refere: window.location.href
              },
              beforeSend: function() {
                clicked = !0, $fail.addClass("hide"), $redirecting.removeClass("hide");
              },
              success: function(data) {
                clicked = !1;
                var code = data.meta.code;
                200 === code ? window.location.href = data.response.redirect : ($redirecting.addClass("hide"), 
                $fail.removeClass("hide"));
              }
            });
          }
        });
      }), void 0);
    }, function(data) {
      404 === data.meta.code && res.location("/404");
    });
  };
  var _crosstoken = function(res, req, next, params, data, cats, cat, ctoken, rsvp) {
    var session = req.session, authorization = session.authorization, user = session.user, user_id = authorization && authorization.user_id || 0;
    Api.request("getCrossByInvitationToken", {
      type: "POST",
      params: params,
      data: data
    }, function(d) {
      var auth = d.authorization, browsing_identity = d.browsing_identity, browsing_user_id = auth && auth.user_id || browsing_identity && browsing_identity.connected_user_id, cross_access_token = d.cross_access_token, read_only = d.read_only, action = d.action, cross = d.cross;
      Bus.emit("app:page:home", !1), Bus.emit("app:page:usermenu", !0), !1 === read_only && cross_access_token && (cats || (cats = {}), 
      cat = cats[ctoken] = cross_access_token, Store.set("cats", cats));
      var render = function() {
        res.render("x.html", function(tpl) {
          if ($("#app-main").empty().append(tpl), Bus.emit("xapp:cross:main"), Bus.emit("xapp:cross", null, browsing_identity, cross, read_only, cat || ctoken, rsvp), 
          "mute" === rsvp) {
            var d = $('<div id="js-dialog-unsubscribe" data-destory="true" data-widget="dialog" data-dialog-type="unsubscribe">');
            d.data("source", cross), d.appendTo($("#app-tmp")), d.trigger("click.dialog.data-api");
          }
        });
      };
      if (!auth && read_only) Bus.emit("app:usermenu:updatebrowsing", {
        browsing: {
          identities: [ browsing_identity ],
          name: browsing_identity.name
        },
        action: action,
        readOnly: read_only,
        page: "cross",
        code: 1
      }); else {
        if ((authorization && user_id === browsing_user_id || !authorization && (authorization = auth)) && browsing_user_id > 0 || authorization && !read_only && !browsing_identity) return Store.set("authorization", session.authorization = authorization), 
        Bus.once("app:user:signin:after", function() {
          res.redirect("/#!" + cross.id);
        }), Bus.emit("app:user:signin", authorization.token, authorization.user_id), void 0;
        if (!read_only && (cat || auth)) {
          var data = {
            browsing: {
              user_id: browsing_identity.connected_user_id,
              identities: [ browsing_identity ],
              name: browsing_identity.name
            },
            originToken: ctoken,
            action: action,
            readOnly: read_only,
            tokenType: "invitation",
            setup: "SETUP" === action,
            page: "cross",
            code: 2
          };
          cat && (data.tokenType = "cross", data.cross_access_token = cat), Bus.emit("app:usermenu:updatebrowsing", data);
        }
      }
      render();
    }, function(data) {
      var status = data && data.meta && data.meta.code, hasAuth = !!authorization;
      403 === status ? (Bus.emit("app:page:home", !1), Bus.emit("app:page:usermenu", hasAuth), 
      hasAuth && (Bus.emit("app:usermenu:updatenormal", user), Bus.emit("app:usermenu:crosslist", authorization.token, authorization.user_id)), 
      Bus.emit("app:cross:forbidden", null, null)) : 404 === status && res.location("/404");
    });
  };
  routes.crossToken = function(req, res, next) {
    var cat, data, session = req.session, authorization = session.authorization, authToken = authorization && authorization.token, ctoken = req.params[0], rsvp = req.params[1], cats = Store.get("cats"), params = {};
    authToken && (params.token = authToken), cats && (cat = cats[ctoken]), data = {
      invitation_token: ctoken
    }, cat && (data.cross_access_token = cat), _crosstoken(res, req, next, params, data, cats, cat, ctoken, rsvp);
  }, routes.crossPhoneToken = function(req, res, next) {
    var cat, data, session = req.session, authorization = session.authorization, authToken = authorization && authorization.token, cross_id = req.params[0], ctoken = req.params[1], rsvp = req.params[2] || "", cats = Store.get("cats"), params = {};
    authToken && (params.token = authToken), cats && (cat = cats[ctoken]), data = {
      invitation_token: ctoken,
      cross_id: cross_id
    }, cat && (data.cross_access_token = cat), _crosstoken(res, req, next, params, data, cats, cat, ctoken, rsvp);
  }, routes.matchUserForProfile = function(req, res, next) {
    var params = req.params, name = params[0], idObject = Util.parseId(name), isNotInvalid = !1;
    if (idObject.provider) {
      var user = req.session.user, identities = user && user.identities;
      if (identities) for (var identity, i = 0; identity = identities[i++]; ) if (isNotInvalid = identity.provider === idObject.provider && identity.external_username === idObject.external_username) return next(), 
      void 0;
    }
    isNotInvalid || res.redirect("/#invalid");
  }, routes.profile = function(req, res) {
    var session = req.session, authorization = session.authorization, user = session.user, browsing_authorization = session.browsing_authorization, browsing_user = session.browsing_user, action = session.action, oauth = session.oauth;
    Bus.emit("app:page:home", !1);
    var param = req.params[2], match = param && param.match(Util.tokenRegExp), token = match && match[1];
    return token && !browsing_authorization ? (res.redirect("/#token=" + token), void 0) : (authorization || browsing_authorization ? (document.title = "EXFE - Profile", 
    Bus.emit("app:page:usermenu", !0), authorization && !browsing_authorization ? (Bus.emit("app:usermenu:updatenormal", user), 
    Bus.emit("app:usermenu:crosslist", authorization.token, authorization.user_id), 
    res.render("profile.html", function(tpl) {
      $("#app-main").data("event", session.event), delete session.event, $("#app-main").append(tpl), 
      Bus.emit("app:profile:identities", user);
      var dfd = $.Deferred(), e = $.Event("click.dialog.data-api");
      dfd.resolve(authorization), Bus.emit("app:profile:show", dfd), oauth ? ("connected" !== oauth.identity_status && (e.following = oauth.following, 
      e.identity = oauth.identity, e.token = authorization.token, $('<div id="app-oauth-welcome" class="hide" data-widget="dialog" data-dialog-type="welcome" data-destory="true"></div>').appendTo($("#app-tmp")).trigger(e)), 
      Store.remove("oauth"), delete session.oauth) : session.verification_token && ($('<div id="app-oauth-resetpassword" class="hide" data-widget="dialog" data-dialog-type="setpassword" data-destory="true" data-redirect="false"></div>').data("token", session.verification_token).appendTo($("#app-tmp")).trigger(e), 
      delete session.verification_token);
    })) : browsing_authorization ? ($(document.body).attr("data-browsing"), Bus.emit("app:usermenu:updatebrowsing", {
      normal: user,
      browsing: browsing_user,
      action: action,
      setup: "INPUT_NEW_PASSWORD" === action,
      originToken: session.originToken,
      tokenType: "user",
      page: "profile"
    }, "browsing_identity"), delete session.originToken, res.render("profile.html", function(tpl) {
      $("#app-main").append(tpl), Bus.emit("app:profile:identities", browsing_user);
      var dfd = $.Deferred();
      dfd.resolve(browsing_authorization), Bus.emit("app:profile:show", dfd);
    })) : res.redirect("/")) : res.redirect("/"), void 0);
  }, routes.invalid = function(req, res) {
    var session = req.session, authorization = session.authorization, user = session.user;
    document.title = "EXFE - Invalid Link", Bus.emit("app:page:home", !1), authorization ? (Bus.emit("app:page:usermenu", !0), 
    Bus.emit("app:usermenu:updatenormal", user), Bus.emit("app:usermenu:crosslist", authorization.token, authorization.user_id)) : Bus.emit("app:page:usermenu", !1), 
    res.render("invalid.html", function(tpl) {
      $("#app-main").append(tpl);
    });
  }, routes.signout = function() {
    Store.remove("cats"), Store.remove("user"), Store.remove("authorization"), window.location.href = "/";
  }, routes.refreshAuthUser = function(req, res, next) {
    var session = req.session, authorization = session.authorization;
    return authorization ? (Bus.emit("app:api:getuser", authorization.token, authorization.user_id, function(data) {
      var user = data.user;
      return Store.set("user", session.user = user), 0 === user.identities.length ? (routes.signout(), 
      void 0) : (next(), void 0);
    }, function(data) {
      var code = data && data.meta && data.meta.code;
      401 === code && (Store.remove("user"), Store.remove("authorization"), delete session.user, 
      delete session.authorization), next();
    }), void 0) : (next(), void 0);
  };
}), define(function(require) {
  "use strict";
  var _ENV_ = window._ENV_, Handlebars = require("handlebars"), middleware = require("middleware"), routes = require("routes"), lightsaber = require("lightsaber"), app = window.App = lightsaber(), Widget = require("widget");
  app.widgetCaches = Widget.caches, app.use(middleware.fixedFaceBookURL), app.use(middleware.basicAuth), 
  app.use(middleware.cleanupAppTmp), app.initRouter(), app.use(middleware.errorHandler), 
  app.set("timestamp", _ENV_.timestamp), app.set("view cache", !0), app.set("view engine", Handlebars), 
  app.set("views", "/static/views"), app.get(/^\/+(?:\?)?(?:ipad)?#{0,}$/, routes.index), 
  app.get(/^\/+\?t=([a-zA-Z0-9]{3,})$/, function(req, res, next) {
    var getSMSTokenFromHead = function() {
      var header = document.getElementsByTagName("head")[0], meta = document.getElementsByName("sms-token")[0], smsToken = null;
      return meta && (smsToken = JSON.parse(meta.content), header.removeChild(meta)), 
      smsToken;
    }, smsToken = getSMSTokenFromHead(), originToken = req.params[0];
    smsToken ? routes.inspectResolveToken(req, res, next, smsToken, originToken) : res.redirect("/#invalid/token=" + originToken);
  }, routes.resolveShow), app.get(/^\/+(?:\?)?(?:ipad)?#gather\/?$/, routes.refreshAuthUser, routes.gather), 
  app.get(/^\/+(?:\?)?(?:ipad)?#token=([a-zA-Z0-9]{64})\/?$/, routes.resolveToken, routes.resolveRequest, routes.resolveShow), 
  app.get(/^\/+(?:\?)?(?:ipad)?#!([1-9][0-9]*)\/?$/, routes.refreshAuthUser, routes.cross), 
  app.get(/^\/+(?:\?)?(?:ipad)?#!([1-9][0-9]*)\/([a-zA-Z0-9]{3})\/?$/, routes.refreshAuthUser, routes.crossInvitation), 
  app.get(/^\/+(?:\?)?(?:ipad)?#!([1-9][0-9]*)\/([a-zA-Z0-9]{4})(?:\/(accept|mute|decline))?\/?$/, routes.refreshAuthUser, routes.crossPhoneToken), 
  app.get(/^\/+(?:\?)?(?:ipad)?#!token=([a-zA-Z0-9]{32})\/?$/, routes.refreshAuthUser, routes.crossToken), 
  app.get(/^\/+(?:\?)?(?:ipad)?#!token=([a-zA-Z0-9]{32})\/(accept|mute|decline)\/?$/, routes.refreshAuthUser, routes.crossToken), 
  app.get(/^\/+(?:\?)?(?:ipad)?#((?:@?[^\@\/\s\!=]+@[^\#@\/\s]+)|(?:@[^\@\/\s\!=]+))(?:\/?(.*))\/?$/, routes.refreshAuthUser, routes.matchUserForProfile, routes.profile), 
  app.get(/^\/+(?:\?)?(?:ipad)?#(\+?[1-9][0-9]{3,})(?:\/?(.*))\/?$/, routes.refreshAuthUser, routes.matchUserForProfile, routes.profile), 
  app.get(/^\/+(?:\?)?(?:ipad)?#invalid(?:\/token=([a-zA-Z0-9]{4,}))?\/?$/, routes.invalid), 
  app.get(/^\/+(?:\?)?(?:ipad)?#signout\/?$/, routes.signout), app.run();
});