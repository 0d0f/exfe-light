/*! EXFE.COM QXdlc29tZSEgV2UncmUgaHVudGluZyB0YWxlbnRzIGxpa2UgeW91LiBQbGVhc2UgZHJvcCB1cyB5b3VyIENWIHRvIHdvcmtAZXhmZS5jb20uCg== */
/*! mobile@2a 2013-08-19 10:08:46 */
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
});

var Zepto = function() {
  function type(obj) {
    return null == obj ? obj + "" : class2type[toString.call(obj)] || "object";
  }
  function isFunction(value) {
    return "function" == type(value);
  }
  function isWindow(obj) {
    return null != obj && obj == obj.window;
  }
  function isDocument(obj) {
    return null != obj && obj.nodeType == obj.DOCUMENT_NODE;
  }
  function isObject(obj) {
    return "object" == type(obj);
  }
  function isPlainObject(obj) {
    return isObject(obj) && !isWindow(obj) && obj.__proto__ == Object.prototype;
  }
  function isArray(value) {
    return value instanceof Array;
  }
  function likeArray(obj) {
    return "number" == typeof obj.length;
  }
  function compact(array) {
    return filter.call(array, function(item) {
      return null != item;
    });
  }
  function flatten(array) {
    return array.length > 0 ? $.fn.concat.apply([], array) : array;
  }
  function dasherize(str) {
    return str.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase();
  }
  function classRE(name) {
    return name in classCache ? classCache[name] : classCache[name] = RegExp("(^|\\s)" + name + "(\\s|$)");
  }
  function maybeAddPx(name, value) {
    return "number" != typeof value || cssNumber[dasherize(name)] ? value : value + "px";
  }
  function defaultDisplay(nodeName) {
    var element, display;
    return elementDisplay[nodeName] || (element = document.createElement(nodeName), 
    document.body.appendChild(element), display = getComputedStyle(element, "").getPropertyValue("display"), 
    element.parentNode.removeChild(element), "none" == display && (display = "block"), 
    elementDisplay[nodeName] = display), elementDisplay[nodeName];
  }
  function children(element) {
    return "children" in element ? slice.call(element.children) : $.map(element.childNodes, function(node) {
      return 1 == node.nodeType ? node : undefined;
    });
  }
  function extend(target, source, deep) {
    for (key in source) deep && (isPlainObject(source[key]) || isArray(source[key])) ? (isPlainObject(source[key]) && !isPlainObject(target[key]) && (target[key] = {}), 
    isArray(source[key]) && !isArray(target[key]) && (target[key] = []), extend(target[key], source[key], deep)) : source[key] !== undefined && (target[key] = source[key]);
  }
  function filtered(nodes, selector) {
    return selector === undefined ? $(nodes) : $(nodes).filter(selector);
  }
  function funcArg(context, arg, idx, payload) {
    return isFunction(arg) ? arg.call(context, idx, payload) : arg;
  }
  function setAttribute(node, name, value) {
    null == value ? node.removeAttribute(name) : node.setAttribute(name, value);
  }
  function className(node, value) {
    var klass = node.className, svg = klass && klass.baseVal !== undefined;
    return value === undefined ? svg ? klass.baseVal : klass : (svg ? klass.baseVal = value : node.className = value, 
    undefined);
  }
  function deserializeValue(value) {
    var num;
    try {
      return value ? "true" == value || ("false" == value ? !1 : "null" == value ? null : isNaN(num = Number(value)) ? /^[\[\{]/.test(value) ? $.parseJSON(value) : value : num) : value;
    } catch (e) {
      return value;
    }
  }
  function traverseNode(node, fun) {
    fun(node);
    for (var key in node.childNodes) traverseNode(node.childNodes[key], fun);
  }
  var undefined, key, $, classList, camelize, uniq, emptyArray = [], slice = emptyArray.slice, filter = emptyArray.filter, document = window.document, elementDisplay = {}, classCache = {}, getComputedStyle = document.defaultView.getComputedStyle, cssNumber = {
    "column-count": 1,
    columns: 1,
    "font-weight": 1,
    "line-height": 1,
    opacity: 1,
    "z-index": 1,
    zoom: 1
  }, fragmentRE = /^\s*<(\w+|!)[^>]*>/, tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, rootNodeRE = /^(?:body|html)$/i, methodAttributes = [ "val", "css", "html", "text", "data", "width", "height", "offset" ], adjacencyOperators = [ "after", "prepend", "before", "append" ], table = document.createElement("table"), tableRow = document.createElement("tr"), containers = {
    tr: document.createElement("tbody"),
    tbody: table,
    thead: table,
    tfoot: table,
    td: tableRow,
    th: tableRow,
    "*": document.createElement("div")
  }, readyRE = /complete|loaded|interactive/, classSelectorRE = /^\.([\w-]+)$/, idSelectorRE = /^#([\w-]*)$/, tagSelectorRE = /^[\w-]+$/, class2type = {}, toString = class2type.toString, zepto = {}, tempParent = document.createElement("div");
  return zepto.matches = function(element, selector) {
    if (!element || 1 !== element.nodeType) return !1;
    var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector;
    if (matchesSelector) return matchesSelector.call(element, selector);
    var match, parent = element.parentNode, temp = !parent;
    return temp && (parent = tempParent).appendChild(element), match = ~zepto.qsa(parent, selector).indexOf(element), 
    temp && tempParent.removeChild(element), match;
  }, camelize = function(str) {
    return str.replace(/-+(.)?/g, function(match, chr) {
      return chr ? chr.toUpperCase() : "";
    });
  }, uniq = function(array) {
    return filter.call(array, function(item, idx) {
      return array.indexOf(item) == idx;
    });
  }, zepto.fragment = function(html, name, properties) {
    html.replace && (html = html.replace(tagExpanderRE, "<$1></$2>")), name === undefined && (name = fragmentRE.test(html) && RegExp.$1), 
    name in containers || (name = "*");
    var nodes, dom, container = containers[name];
    return container.innerHTML = "" + html, dom = $.each(slice.call(container.childNodes), function() {
      container.removeChild(this);
    }), isPlainObject(properties) && (nodes = $(dom), $.each(properties, function(key, value) {
      methodAttributes.indexOf(key) > -1 ? nodes[key](value) : nodes.attr(key, value);
    })), dom;
  }, zepto.Z = function(dom, selector) {
    return dom = dom || [], dom.__proto__ = $.fn, dom.selector = selector || "", dom;
  }, zepto.isZ = function(object) {
    return object instanceof zepto.Z;
  }, zepto.init = function(selector, context) {
    if (selector) {
      if (isFunction(selector)) return $(document).ready(selector);
      if (zepto.isZ(selector)) return selector;
      var dom;
      if (isArray(selector)) dom = compact(selector); else if (isObject(selector)) dom = [ isPlainObject(selector) ? $.extend({}, selector) : selector ], 
      selector = null; else if (fragmentRE.test(selector)) dom = zepto.fragment(selector.trim(), RegExp.$1, context), 
      selector = null; else {
        if (context !== undefined) return $(context).find(selector);
        dom = zepto.qsa(document, selector);
      }
      return zepto.Z(dom, selector);
    }
    return zepto.Z();
  }, $ = function(selector, context) {
    return zepto.init(selector, context);
  }, $.extend = function(target) {
    var deep, args = slice.call(arguments, 1);
    return "boolean" == typeof target && (deep = target, target = args.shift()), args.forEach(function(arg) {
      extend(target, arg, deep);
    }), target;
  }, zepto.qsa = function(element, selector) {
    var found;
    return isDocument(element) && idSelectorRE.test(selector) ? (found = element.getElementById(RegExp.$1)) ? [ found ] : [] : 1 !== element.nodeType && 9 !== element.nodeType ? [] : slice.call(classSelectorRE.test(selector) ? element.getElementsByClassName(RegExp.$1) : tagSelectorRE.test(selector) ? element.getElementsByTagName(selector) : element.querySelectorAll(selector));
  }, $.contains = function(parent, node) {
    return parent !== node && parent.contains(node);
  }, $.type = type, $.isFunction = isFunction, $.isWindow = isWindow, $.isArray = isArray, 
  $.isPlainObject = isPlainObject, $.isEmptyObject = function(obj) {
    var name;
    for (name in obj) return !1;
    return !0;
  }, $.inArray = function(elem, array, i) {
    return emptyArray.indexOf.call(array, elem, i);
  }, $.camelCase = camelize, $.trim = function(str) {
    return str.trim();
  }, $.uuid = 0, $.support = {}, $.expr = {}, $.map = function(elements, callback) {
    var value, i, key, values = [];
    if (likeArray(elements)) for (i = 0; elements.length > i; i++) value = callback(elements[i], i), 
    null != value && values.push(value); else for (key in elements) value = callback(elements[key], key), 
    null != value && values.push(value);
    return flatten(values);
  }, $.each = function(elements, callback) {
    var i, key;
    if (likeArray(elements)) {
      for (i = 0; elements.length > i; i++) if (callback.call(elements[i], i, elements[i]) === !1) return elements;
    } else for (key in elements) if (callback.call(elements[key], key, elements[key]) === !1) return elements;
    return elements;
  }, $.grep = function(elements, callback) {
    return filter.call(elements, callback);
  }, window.JSON && ($.parseJSON = JSON.parse), $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
    class2type["[object " + name + "]"] = name.toLowerCase();
  }), $.fn = {
    forEach: emptyArray.forEach,
    reduce: emptyArray.reduce,
    push: emptyArray.push,
    sort: emptyArray.sort,
    indexOf: emptyArray.indexOf,
    concat: emptyArray.concat,
    map: function(fn) {
      return $($.map(this, function(el, i) {
        return fn.call(el, i, el);
      }));
    },
    slice: function() {
      return $(slice.apply(this, arguments));
    },
    ready: function(callback) {
      return readyRE.test(document.readyState) ? callback($) : document.addEventListener("DOMContentLoaded", function() {
        callback($);
      }, !1), this;
    },
    get: function(idx) {
      return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length];
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
    each: function(callback) {
      return emptyArray.every.call(this, function(el, idx) {
        return callback.call(el, idx, el) !== !1;
      }), this;
    },
    filter: function(selector) {
      return isFunction(selector) ? this.not(this.not(selector)) : $(filter.call(this, function(element) {
        return zepto.matches(element, selector);
      }));
    },
    add: function(selector, context) {
      return $(uniq(this.concat($(selector, context))));
    },
    is: function(selector) {
      return this.length > 0 && zepto.matches(this[0], selector);
    },
    not: function(selector) {
      var nodes = [];
      if (isFunction(selector) && selector.call !== undefined) this.each(function(idx) {
        selector.call(this, idx) || nodes.push(this);
      }); else {
        var excludes = "string" == typeof selector ? this.filter(selector) : likeArray(selector) && isFunction(selector.item) ? slice.call(selector) : $(selector);
        this.forEach(function(el) {
          0 > excludes.indexOf(el) && nodes.push(el);
        });
      }
      return $(nodes);
    },
    has: function(selector) {
      return this.filter(function() {
        return isObject(selector) ? $.contains(this, selector) : $(this).find(selector).size();
      });
    },
    eq: function(idx) {
      return -1 === idx ? this.slice(idx) : this.slice(idx, +idx + 1);
    },
    first: function() {
      var el = this[0];
      return el && !isObject(el) ? el : $(el);
    },
    last: function() {
      var el = this[this.length - 1];
      return el && !isObject(el) ? el : $(el);
    },
    find: function(selector) {
      var result, $this = this;
      return result = "object" == typeof selector ? $(selector).filter(function() {
        var node = this;
        return emptyArray.some.call($this, function(parent) {
          return $.contains(parent, node);
        });
      }) : 1 == this.length ? $(zepto.qsa(this[0], selector)) : this.map(function() {
        return zepto.qsa(this, selector);
      });
    },
    closest: function(selector, context) {
      var node = this[0], collection = !1;
      for ("object" == typeof selector && (collection = $(selector)); node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)); ) node = node !== context && !isDocument(node) && node.parentNode;
      return $(node);
    },
    parents: function(selector) {
      for (var ancestors = [], nodes = this; nodes.length > 0; ) nodes = $.map(nodes, function(node) {
        return (node = node.parentNode) && !isDocument(node) && 0 > ancestors.indexOf(node) ? (ancestors.push(node), 
        node) : undefined;
      });
      return filtered(ancestors, selector);
    },
    parent: function(selector) {
      return filtered(uniq(this.pluck("parentNode")), selector);
    },
    children: function(selector) {
      return filtered(this.map(function() {
        return children(this);
      }), selector);
    },
    contents: function() {
      return this.map(function() {
        return slice.call(this.childNodes);
      });
    },
    siblings: function(selector) {
      return filtered(this.map(function(i, el) {
        return filter.call(children(el.parentNode), function(child) {
          return child !== el;
        });
      }), selector);
    },
    empty: function() {
      return this.each(function() {
        this.innerHTML = "";
      });
    },
    pluck: function(property) {
      return $.map(this, function(el) {
        return el[property];
      });
    },
    show: function() {
      return this.each(function() {
        "none" == this.style.display && (this.style.display = null), "none" == getComputedStyle(this, "").getPropertyValue("display") && (this.style.display = defaultDisplay(this.nodeName));
      });
    },
    replaceWith: function(newContent) {
      return this.before(newContent).remove();
    },
    wrap: function(structure) {
      var func = isFunction(structure);
      if (this[0] && !func) var dom = $(structure).get(0), clone = dom.parentNode || this.length > 1;
      return this.each(function(index) {
        $(this).wrapAll(func ? structure.call(this, index) : clone ? dom.cloneNode(!0) : dom);
      });
    },
    wrapAll: function(structure) {
      if (this[0]) {
        $(this[0]).before(structure = $(structure));
        for (var children; (children = structure.children()).length; ) structure = children.first();
        $(structure).append(this);
      }
      return this;
    },
    wrapInner: function(structure) {
      var func = isFunction(structure);
      return this.each(function(index) {
        var self = $(this), contents = self.contents(), dom = func ? structure.call(this, index) : structure;
        contents.length ? contents.wrapAll(dom) : self.append(dom);
      });
    },
    unwrap: function() {
      return this.parent().each(function() {
        $(this).replaceWith($(this).children());
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
    toggle: function(setting) {
      return this.each(function() {
        var el = $(this);
        (setting === undefined ? "none" == el.css("display") : setting) ? el.show() : el.hide();
      });
    },
    prev: function(selector) {
      return $(this.pluck("previousElementSibling")).filter(selector || "*");
    },
    next: function(selector) {
      return $(this.pluck("nextElementSibling")).filter(selector || "*");
    },
    html: function(html) {
      return html === undefined ? this.length > 0 ? this[0].innerHTML : null : this.each(function(idx) {
        var originHtml = this.innerHTML;
        $(this).empty().append(funcArg(this, html, idx, originHtml));
      });
    },
    text: function(text) {
      return text === undefined ? this.length > 0 ? this[0].textContent : null : this.each(function() {
        this.textContent = text;
      });
    },
    attr: function(name, value) {
      var result;
      return "string" == typeof name && value === undefined ? 0 == this.length || 1 !== this[0].nodeType ? undefined : "value" == name && "INPUT" == this[0].nodeName ? this.val() : !(result = this[0].getAttribute(name)) && name in this[0] ? this[0][name] : result : this.each(function(idx) {
        if (1 === this.nodeType) if (isObject(name)) for (key in name) setAttribute(this, key, name[key]); else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)));
      });
    },
    removeAttr: function(name) {
      return this.each(function() {
        1 === this.nodeType && setAttribute(this, name);
      });
    },
    prop: function(name, value) {
      return value === undefined ? this[0] && this[0][name] : this.each(function(idx) {
        this[name] = funcArg(this, value, idx, this[name]);
      });
    },
    data: function(name, value) {
      var data = this.attr("data-" + dasherize(name), value);
      return null !== data ? deserializeValue(data) : undefined;
    },
    val: function(value) {
      return value === undefined ? this[0] && (this[0].multiple ? $(this[0]).find("option").filter(function() {
        return this.selected;
      }).pluck("value") : this[0].value) : this.each(function(idx) {
        this.value = funcArg(this, value, idx, this.value);
      });
    },
    offset: function(coordinates) {
      if (coordinates) return this.each(function(index) {
        var $this = $(this), coords = funcArg(this, coordinates, index, $this.offset()), parentOffset = $this.offsetParent().offset(), props = {
          top: coords.top - parentOffset.top,
          left: coords.left - parentOffset.left
        };
        "static" == $this.css("position") && (props.position = "relative"), $this.css(props);
      });
      if (0 == this.length) return null;
      var obj = this[0].getBoundingClientRect();
      return {
        left: obj.left + window.pageXOffset,
        top: obj.top + window.pageYOffset,
        width: Math.round(obj.width),
        height: Math.round(obj.height)
      };
    },
    css: function(property, value) {
      if (2 > arguments.length && "string" == typeof property) return this[0] && (this[0].style[camelize(property)] || getComputedStyle(this[0], "").getPropertyValue(property));
      var css = "";
      if ("string" == type(property)) value || 0 === value ? css = dasherize(property) + ":" + maybeAddPx(property, value) : this.each(function() {
        this.style.removeProperty(dasherize(property));
      }); else for (key in property) property[key] || 0 === property[key] ? css += dasherize(key) + ":" + maybeAddPx(key, property[key]) + ";" : this.each(function() {
        this.style.removeProperty(dasherize(key));
      });
      return this.each(function() {
        this.style.cssText += ";" + css;
      });
    },
    index: function(element) {
      return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0]);
    },
    hasClass: function(name) {
      return emptyArray.some.call(this, function(el) {
        return this.test(className(el));
      }, classRE(name));
    },
    addClass: function(name) {
      return this.each(function(idx) {
        classList = [];
        var cls = className(this), newName = funcArg(this, name, idx, cls);
        newName.split(/\s+/g).forEach(function(klass) {
          $(this).hasClass(klass) || classList.push(klass);
        }, this), classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "));
      });
    },
    removeClass: function(name) {
      return this.each(function(idx) {
        return name === undefined ? className(this, "") : (classList = className(this), 
        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass) {
          classList = classList.replace(classRE(klass), " ");
        }), className(this, classList.trim()), undefined);
      });
    },
    toggleClass: function(name, when) {
      return this.each(function(idx) {
        var $this = $(this), names = funcArg(this, name, idx, className(this));
        names.split(/\s+/g).forEach(function(klass) {
          (when === undefined ? !$this.hasClass(klass) : when) ? $this.addClass(klass) : $this.removeClass(klass);
        });
      });
    },
    scrollTop: function() {
      return this.length ? "scrollTop" in this[0] ? this[0].scrollTop : this[0].scrollY : undefined;
    },
    position: function() {
      if (this.length) {
        var elem = this[0], offsetParent = this.offsetParent(), offset = this.offset(), parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? {
          top: 0,
          left: 0
        } : offsetParent.offset();
        return offset.top -= parseFloat($(elem).css("margin-top")) || 0, offset.left -= parseFloat($(elem).css("margin-left")) || 0, 
        parentOffset.top += parseFloat($(offsetParent[0]).css("border-top-width")) || 0, 
        parentOffset.left += parseFloat($(offsetParent[0]).css("border-left-width")) || 0, 
        {
          top: offset.top - parentOffset.top,
          left: offset.left - parentOffset.left
        };
      }
    },
    offsetParent: function() {
      return this.map(function() {
        for (var parent = this.offsetParent || document.body; parent && !rootNodeRE.test(parent.nodeName) && "static" == $(parent).css("position"); ) parent = parent.offsetParent;
        return parent;
      });
    }
  }, $.fn.detach = $.fn.remove, [ "width", "height" ].forEach(function(dimension) {
    $.fn[dimension] = function(value) {
      var offset, el = this[0], Dimension = dimension.replace(/./, function(m) {
        return m[0].toUpperCase();
      });
      return value === undefined ? isWindow(el) ? el["inner" + Dimension] : isDocument(el) ? el.documentElement["offset" + Dimension] : (offset = this.offset()) && offset[dimension] : this.each(function(idx) {
        el = $(this), el.css(dimension, funcArg(this, value, idx, el[dimension]()));
      });
    };
  }), adjacencyOperators.forEach(function(operator, operatorIndex) {
    var inside = operatorIndex % 2;
    $.fn[operator] = function() {
      var argType, parent, nodes = $.map(arguments, function(arg) {
        return argType = type(arg), "object" == argType || "array" == argType || null == arg ? arg : zepto.fragment(arg);
      }), copyByClone = this.length > 1;
      return 1 > nodes.length ? this : this.each(function(_, target) {
        parent = inside ? target : target.parentNode, target = 0 == operatorIndex ? target.nextSibling : 1 == operatorIndex ? target.firstChild : 2 == operatorIndex ? target : null, 
        nodes.forEach(function(node) {
          if (copyByClone) node = node.cloneNode(!0); else if (!parent) return $(node).remove();
          traverseNode(parent.insertBefore(node, target), function(el) {
            null == el.nodeName || "SCRIPT" !== el.nodeName.toUpperCase() || el.type && "text/javascript" !== el.type || el.src || window.eval.call(window, el.innerHTML);
          });
        });
      });
    }, $.fn[inside ? operator + "To" : "insert" + (operatorIndex ? "Before" : "After")] = function(html) {
      return $(html)[operator](this), this;
    };
  }), zepto.Z.prototype = $.fn, zepto.uniq = uniq, zepto.deserializeValue = deserializeValue, 
  $.zepto = zepto, $;
}();

window.Zepto = Zepto, "$" in window || (window.$ = Zepto), function(undefined) {
  String.prototype.trim === undefined && (String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
  }), Array.prototype.reduce === undefined && (Array.prototype.reduce = function(fun) {
    if (this === void 0 || null === this) throw new TypeError();
    var accumulator, t = Object(this), len = t.length >>> 0, k = 0;
    if ("function" != typeof fun) throw new TypeError();
    if (0 == len && 1 == arguments.length) throw new TypeError();
    if (arguments.length >= 2) accumulator = arguments[1]; else for (;;) {
      if (k in t) {
        accumulator = t[k++];
        break;
      }
      if (++k >= len) throw new TypeError();
    }
    for (;len > k; ) k in t && (accumulator = fun.call(undefined, accumulator, t[k], k, t)), 
    k++;
    return accumulator;
  });
}(), function($) {
  function zid(element) {
    return element._zid || (element._zid = _zid++);
  }
  function findHandlers(element, event, fn, selector) {
    if (event = parse(event), event.ns) var matcher = matcherFor(event.ns);
    return (handlers[zid(element)] || []).filter(function(handler) {
      return !(!handler || event.e && handler.e != event.e || event.ns && !matcher.test(handler.ns) || fn && zid(handler.fn) !== zid(fn) || selector && handler.sel != selector);
    });
  }
  function parse(event) {
    var parts = ("" + event).split(".");
    return {
      e: parts[0],
      ns: parts.slice(1).sort().join(" ")
    };
  }
  function matcherFor(ns) {
    return RegExp("(?:^| )" + ns.replace(" ", " .* ?") + "(?: |$)");
  }
  function eachEvent(events, fn, iterator) {
    "string" != $.type(events) ? $.each(events, iterator) : events.split(/\s/).forEach(function(type) {
      iterator(type, fn);
    });
  }
  function eventCapture(handler, captureSetting) {
    return handler.del && ("focus" == handler.e || "blur" == handler.e) || !!captureSetting;
  }
  function realEvent(type) {
    return hover[type] || type;
  }
  function add(element, events, fn, selector, getDelegate, capture) {
    var id = zid(element), set = handlers[id] || (handlers[id] = []);
    eachEvent(events, fn, function(event, fn) {
      var handler = parse(event);
      handler.fn = fn, handler.sel = selector, handler.e in hover && (fn = function(e) {
        var related = e.relatedTarget;
        return !related || related !== this && !$.contains(this, related) ? handler.fn.apply(this, arguments) : void 0;
      }), handler.del = getDelegate && getDelegate(fn, event);
      var callback = handler.del || fn;
      handler.proxy = function(e) {
        var result = callback.apply(element, [ e ].concat(e.data));
        return result === !1 && (e.preventDefault(), e.stopPropagation()), result;
      }, handler.i = set.length, set.push(handler), element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
    });
  }
  function remove(element, events, fn, selector, capture) {
    var id = zid(element);
    eachEvent(events || "", fn, function(event, fn) {
      findHandlers(element, event, fn, selector).forEach(function(handler) {
        delete handlers[id][handler.i], element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
      });
    });
  }
  function createProxy(event) {
    var key, proxy = {
      originalEvent: event
    };
    for (key in event) ignoreProperties.test(key) || void 0 === event[key] || (proxy[key] = event[key]);
    return $.each(eventMethods, function(name, predicate) {
      proxy[name] = function() {
        return this[predicate] = returnTrue, event[name].apply(event, arguments);
      }, proxy[predicate] = returnFalse;
    }), proxy;
  }
  function fix(event) {
    if (!("defaultPrevented" in event)) {
      event.defaultPrevented = !1;
      var prevent = event.preventDefault;
      event.preventDefault = function() {
        this.defaultPrevented = !0, prevent.call(this);
      };
    }
  }
  var handlers = ($.zepto.qsa, {}), _zid = 1, specialEvents = {}, hover = {
    mouseenter: "mouseover",
    mouseleave: "mouseout"
  };
  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = "MouseEvents", 
  $.event = {
    add: add,
    remove: remove
  }, $.proxy = function(fn, context) {
    if ($.isFunction(fn)) {
      var proxyFn = function() {
        return fn.apply(context, arguments);
      };
      return proxyFn._zid = zid(fn), proxyFn;
    }
    if ("string" == typeof context) return $.proxy(fn[context], fn);
    throw new TypeError("expected function");
  }, $.fn.bind = function(event, callback) {
    return this.each(function() {
      add(this, event, callback);
    });
  }, $.fn.unbind = function(event, callback) {
    return this.each(function() {
      remove(this, event, callback);
    });
  }, $.fn.one = function(event, callback) {
    return this.each(function(i, element) {
      add(this, event, callback, null, function(fn, type) {
        return function() {
          var result = fn.apply(element, arguments);
          return remove(element, type, fn), result;
        };
      });
    });
  };
  var returnTrue = function() {
    return !0;
  }, returnFalse = function() {
    return !1;
  }, ignoreProperties = /^([A-Z]|layer[XY]$)/, eventMethods = {
    preventDefault: "isDefaultPrevented",
    stopImmediatePropagation: "isImmediatePropagationStopped",
    stopPropagation: "isPropagationStopped"
  };
  $.fn.delegate = function(selector, event, callback) {
    return this.each(function(i, element) {
      add(element, event, callback, selector, function(fn) {
        return function(e) {
          var evt, match = $(e.target).closest(selector, element).get(0);
          return match ? (evt = $.extend(createProxy(e), {
            currentTarget: match,
            liveFired: element
          }), fn.apply(match, [ evt ].concat([].slice.call(arguments, 1)))) : void 0;
        };
      });
    });
  }, $.fn.undelegate = function(selector, event, callback) {
    return this.each(function() {
      remove(this, event, callback, selector);
    });
  }, $.fn.live = function(event, callback) {
    return $(document.body).delegate(this.selector, event, callback), this;
  }, $.fn.die = function(event, callback) {
    return $(document.body).undelegate(this.selector, event, callback), this;
  }, $.fn.on = function(event, selector, callback) {
    return !selector || $.isFunction(selector) ? this.bind(event, selector || callback) : this.delegate(selector, event, callback);
  }, $.fn.off = function(event, selector, callback) {
    return !selector || $.isFunction(selector) ? this.unbind(event, selector || callback) : this.undelegate(selector, event, callback);
  }, $.fn.trigger = function(event, data) {
    return ("string" == typeof event || $.isPlainObject(event)) && (event = $.Event(event)), 
    fix(event), event.data = data, this.each(function() {
      "dispatchEvent" in this && this.dispatchEvent(event);
    });
  }, $.fn.triggerHandler = function(event, data) {
    var e, result;
    return this.each(function(i, element) {
      e = createProxy("string" == typeof event ? $.Event(event) : event), e.data = data, 
      e.target = element, $.each(findHandlers(element, event.type || event), function(i, handler) {
        return result = handler.proxy(e), e.isImmediatePropagationStopped() ? !1 : void 0;
      });
    }), result;
  }, "focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(event) {
    $.fn[event] = function(callback) {
      return callback ? this.bind(event, callback) : this.trigger(event);
    };
  }), [ "focus", "blur" ].forEach(function(name) {
    $.fn[name] = function(callback) {
      return callback ? this.bind(name, callback) : this.each(function() {
        try {
          this[name]();
        } catch (e) {}
      }), this;
    };
  }), $.Event = function(type, props) {
    "string" != typeof type && (props = type, type = props.type);
    var event = document.createEvent(specialEvents[type] || "Events"), bubbles = !0;
    if (props) for (var name in props) "bubbles" == name ? bubbles = !!props[name] : event[name] = props[name];
    return event.initEvent(type, bubbles, !0, null, null, null, null, null, null, null, null, null, null, null, null), 
    event.isDefaultPrevented = function() {
      return this.defaultPrevented;
    }, event;
  };
}(Zepto), function($) {
  function triggerAndReturn(context, eventName, data) {
    var event = $.Event(eventName);
    return $(context).trigger(event, data), !event.defaultPrevented;
  }
  function triggerGlobal(settings, context, eventName, data) {
    return settings.global ? triggerAndReturn(context || document, eventName, data) : void 0;
  }
  function ajaxStart(settings) {
    settings.global && 0 === $.active++ && triggerGlobal(settings, null, "ajaxStart");
  }
  function ajaxStop(settings) {
    settings.global && !--$.active && triggerGlobal(settings, null, "ajaxStop");
  }
  function ajaxBeforeSend(xhr, settings) {
    var context = settings.context;
    return settings.beforeSend.call(context, xhr, settings) === !1 || triggerGlobal(settings, context, "ajaxBeforeSend", [ xhr, settings ]) === !1 ? !1 : (triggerGlobal(settings, context, "ajaxSend", [ xhr, settings ]), 
    void 0);
  }
  function ajaxSuccess(data, xhr, settings) {
    var context = settings.context, status = "success";
    settings.success.call(context, data, status, xhr), triggerGlobal(settings, context, "ajaxSuccess", [ xhr, settings, data ]), 
    ajaxComplete(status, xhr, settings);
  }
  function ajaxError(error, type, xhr, settings) {
    var context = settings.context;
    settings.error.call(context, xhr, type, error), triggerGlobal(settings, context, "ajaxError", [ xhr, settings, error ]), 
    ajaxComplete(type, xhr, settings);
  }
  function ajaxComplete(status, xhr, settings) {
    var context = settings.context;
    settings.complete.call(context, xhr, status), triggerGlobal(settings, context, "ajaxComplete", [ xhr, settings ]), 
    ajaxStop(settings);
  }
  function empty() {}
  function mimeToDataType(mime) {
    return mime && (mime = mime.split(";", 2)[0]), mime && (mime == htmlType ? "html" : mime == jsonType ? "json" : scriptTypeRE.test(mime) ? "script" : xmlTypeRE.test(mime) && "xml") || "text";
  }
  function appendQuery(url, query) {
    return (url + "&" + query).replace(/[&?]{1,2}/, "?");
  }
  function serializeData(options) {
    options.processData && options.data && "string" != $.type(options.data) && (options.data = $.param(options.data, options.traditional)), 
    !options.data || options.type && "GET" != options.type.toUpperCase() || (options.url = appendQuery(options.url, options.data));
  }
  function parseArguments(url, data, success, dataType) {
    var hasData = !$.isFunction(data);
    return {
      url: url,
      data: hasData ? data : void 0,
      success: hasData ? $.isFunction(success) ? success : void 0 : data,
      dataType: hasData ? dataType || success : success
    };
  }
  function serialize(params, obj, traditional, scope) {
    var type, array = $.isArray(obj);
    $.each(obj, function(key, value) {
      type = $.type(value), scope && (key = traditional ? scope : scope + "[" + (array ? "" : key) + "]"), 
      !scope && array ? params.add(value.name, value.value) : "array" == type || !traditional && "object" == type ? serialize(params, value, traditional, key) : params.add(key, value);
    });
  }
  var key, name, jsonpID = 0, document = window.document, rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, scriptTypeRE = /^(?:text|application)\/javascript/i, xmlTypeRE = /^(?:text|application)\/xml/i, jsonType = "application/json", htmlType = "text/html", blankRE = /^\s*$/;
  $.active = 0, $.ajaxJSONP = function(options) {
    if (!("type" in options)) return $.ajax(options);
    var abortTimeout, callbackName = "jsonp" + ++jsonpID, script = document.createElement("script"), cleanup = function() {
      clearTimeout(abortTimeout), $(script).remove(), delete window[callbackName];
    }, abort = function(type) {
      cleanup(), type && "timeout" != type || (window[callbackName] = empty), ajaxError(null, type || "abort", xhr, options);
    }, xhr = {
      abort: abort
    };
    return ajaxBeforeSend(xhr, options) === !1 ? (abort("abort"), !1) : (window[callbackName] = function(data) {
      cleanup(), ajaxSuccess(data, xhr, options);
    }, script.onerror = function() {
      abort("error");
    }, script.src = options.url.replace(/=\?/, "=" + callbackName), $("head").append(script), 
    options.timeout > 0 && (abortTimeout = setTimeout(function() {
      abort("timeout");
    }, options.timeout)), xhr);
  }, $.ajaxSettings = {
    type: "GET",
    beforeSend: empty,
    success: empty,
    error: empty,
    complete: empty,
    context: null,
    global: !0,
    xhr: function() {
      return new window.XMLHttpRequest();
    },
    accepts: {
      script: "text/javascript, application/javascript",
      json: jsonType,
      xml: "application/xml, text/xml",
      html: htmlType,
      text: "text/plain"
    },
    crossDomain: !1,
    timeout: 0,
    processData: !0,
    cache: !0
  }, $.ajax = function(options) {
    var settings = $.extend({}, options || {});
    for (key in $.ajaxSettings) void 0 === settings[key] && (settings[key] = $.ajaxSettings[key]);
    ajaxStart(settings), settings.crossDomain || (settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) && RegExp.$2 != window.location.host), 
    settings.url || (settings.url = "" + window.location), serializeData(settings), 
    settings.cache === !1 && (settings.url = appendQuery(settings.url, "_=" + Date.now()));
    var dataType = settings.dataType, hasPlaceholder = /=\?/.test(settings.url);
    if ("jsonp" == dataType || hasPlaceholder) return hasPlaceholder || (settings.url = appendQuery(settings.url, "callback=?")), 
    $.ajaxJSONP(settings);
    var abortTimeout, mime = settings.accepts[dataType], baseHeaders = {}, protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol, xhr = settings.xhr();
    settings.crossDomain || (baseHeaders["X-Requested-With"] = "XMLHttpRequest"), mime && (baseHeaders.Accept = mime, 
    mime.indexOf(",") > -1 && (mime = mime.split(",", 2)[0]), xhr.overrideMimeType && xhr.overrideMimeType(mime)), 
    (settings.contentType || settings.contentType !== !1 && settings.data && "GET" != settings.type.toUpperCase()) && (baseHeaders["Content-Type"] = settings.contentType || "application/x-www-form-urlencoded"), 
    settings.headers = $.extend(baseHeaders, settings.headers || {}), xhr.onreadystatechange = function() {
      if (4 == xhr.readyState) {
        xhr.onreadystatechange = empty, clearTimeout(abortTimeout);
        var result, error = !1;
        if (xhr.status >= 200 && 300 > xhr.status || 304 == xhr.status || 0 == xhr.status && "file:" == protocol) {
          dataType = dataType || mimeToDataType(xhr.getResponseHeader("content-type")), result = xhr.responseText;
          try {
            "script" == dataType ? (1, eval)(result) : "xml" == dataType ? result = xhr.responseXML : "json" == dataType && (result = blankRE.test(result) ? null : $.parseJSON(result));
          } catch (e) {
            error = e;
          }
          error ? ajaxError(error, "parsererror", xhr, settings) : ajaxSuccess(result, xhr, settings);
        } else ajaxError(null, xhr.status ? "error" : "abort", xhr, settings);
      }
    };
    var async = "async" in settings ? settings.async : !0;
    xhr.open(settings.type, settings.url, async);
    for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name]);
    return ajaxBeforeSend(xhr, settings) === !1 ? (xhr.abort(), !1) : (settings.timeout > 0 && (abortTimeout = setTimeout(function() {
      xhr.onreadystatechange = empty, xhr.abort(), ajaxError(null, "timeout", xhr, settings);
    }, settings.timeout)), xhr.send(settings.data ? settings.data : null), xhr);
  }, $.get = function() {
    return $.ajax(parseArguments.apply(null, arguments));
  }, $.post = function() {
    var options = parseArguments.apply(null, arguments);
    return options.type = "POST", $.ajax(options);
  }, $.getJSON = function() {
    var options = parseArguments.apply(null, arguments);
    return options.dataType = "json", $.ajax(options);
  }, $.fn.load = function(url, data, success) {
    if (!this.length) return this;
    var selector, self = this, parts = url.split(/\s/), options = parseArguments(url, data, success), callback = options.success;
    return parts.length > 1 && (options.url = parts[0], selector = parts[1]), options.success = function(response) {
      self.html(selector ? $("<div>").html(response.replace(rscript, "")).find(selector) : response), 
      callback && callback.apply(self, arguments);
    }, $.ajax(options), this;
  };
  var escape = encodeURIComponent;
  $.param = function(obj, traditional) {
    var params = [];
    return params.add = function(k, v) {
      this.push(escape(k) + "=" + escape(v));
    }, serialize(params, obj, traditional), params.join("&").replace(/%20/g, "+");
  };
}(Zepto), function($) {
  $.fn.serializeArray = function() {
    var el, result = [];
    return $(Array.prototype.slice.call(this.get(0).elements)).each(function() {
      el = $(this);
      var type = el.attr("type");
      "fieldset" != this.nodeName.toLowerCase() && !this.disabled && "submit" != type && "reset" != type && "button" != type && ("radio" != type && "checkbox" != type || this.checked) && result.push({
        name: el.attr("name"),
        value: el.val()
      });
    }), result;
  }, $.fn.serialize = function() {
    var result = [];
    return this.serializeArray().forEach(function(elm) {
      result.push(encodeURIComponent(elm.name) + "=" + encodeURIComponent(elm.value));
    }), result.join("&");
  }, $.fn.submit = function(callback) {
    if (callback) this.bind("submit", callback); else if (this.length) {
      var event = $.Event("submit");
      this.eq(0).trigger(event), event.defaultPrevented || this.get(0).submit();
    }
    return this;
  };
}(Zepto), function($) {
  function getData(node, name) {
    var id = node[exp], store = id && data[id];
    if (void 0 === name) return store || setData(node);
    if (store) {
      if (name in store) return store[name];
      var camelName = camelize(name);
      if (camelName in store) return store[camelName];
    }
    return dataAttr.call($(node), name);
  }
  function setData(node, name, value) {
    var id = node[exp] || (node[exp] = ++$.uuid), store = data[id] || (data[id] = attributeData(node));
    return void 0 !== name && (store[camelize(name)] = value), store;
  }
  function attributeData(node) {
    var store = {};
    return $.each(node.attributes, function(i, attr) {
      0 == attr.name.indexOf("data-") && (store[camelize(attr.name.replace("data-", ""))] = $.zepto.deserializeValue(attr.value));
    }), store;
  }
  var data = {}, dataAttr = $.fn.data, camelize = $.camelCase, exp = $.expando = "Zepto" + +new Date();
  $.fn.data = function(name, value) {
    return void 0 === value ? $.isPlainObject(name) ? this.each(function(i, node) {
      $.each(name, function(key, value) {
        setData(node, key, value);
      });
    }) : 0 == this.length ? void 0 : getData(this[0], name) : this.each(function() {
      setData(this, name, value);
    });
  }, $.fn.removeData = function(names) {
    return "string" == typeof names && (names = names.split(/\s+/)), this.each(function() {
      var id = this[exp], store = id && data[id];
      store && $.each(names, function() {
        delete store[camelize(this)];
      });
    });
  };
}(Zepto), function($) {
  function parentIfText(node) {
    return "tagName" in node ? node : node.parentNode;
  }
  function swipeDirection(x1, x2, y1, y2) {
    var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2);
    return xDelta >= yDelta ? x1 - x2 > 0 ? "Left" : "Right" : y1 - y2 > 0 ? "Up" : "Down";
  }
  function longTap() {
    longTapTimeout = null, touch.last && (touch.el.trigger("longTap"), touch = {});
  }
  function cancelLongTap() {
    longTapTimeout && clearTimeout(longTapTimeout), longTapTimeout = null;
  }
  function cancelAll() {
    touchTimeout && clearTimeout(touchTimeout), tapTimeout && clearTimeout(tapTimeout), 
    swipeTimeout && clearTimeout(swipeTimeout), longTapTimeout && clearTimeout(longTapTimeout), 
    touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null, touch = {};
  }
  var touchTimeout, tapTimeout, swipeTimeout, longTapTimeout, touch = {}, longTapDelay = 750;
  $(document).ready(function() {
    var now, delta;
    $(document.body).bind("touchstart", function(e) {
      now = Date.now(), delta = now - (touch.last || now), touch.el = $(parentIfText(e.touches[0].target)), 
      touchTimeout && clearTimeout(touchTimeout), touch.x1 = e.touches[0].pageX, touch.y1 = e.touches[0].pageY, 
      delta > 0 && 250 >= delta && (touch.isDoubleTap = !0), touch.last = now, longTapTimeout = setTimeout(longTap, longTapDelay);
    }).bind("touchmove", function(e) {
      cancelLongTap(), touch.x2 = e.touches[0].pageX, touch.y2 = e.touches[0].pageY, Math.abs(touch.x1 - touch.x2) > 10 && e.preventDefault();
    }).bind("touchend", function() {
      cancelLongTap(), touch.x2 && Math.abs(touch.x1 - touch.x2) > 30 || touch.y2 && Math.abs(touch.y1 - touch.y2) > 30 ? swipeTimeout = setTimeout(function() {
        touch.el.trigger("swipe"), touch.el.trigger("swipe" + swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)), 
        touch = {};
      }, 0) : "last" in touch && (tapTimeout = setTimeout(function() {
        var event = $.Event("tap");
        event.cancelTouch = cancelAll, touch.el.trigger(event), touch.isDoubleTap ? (touch.el.trigger("doubleTap"), 
        touch = {}) : touchTimeout = setTimeout(function() {
          touchTimeout = null, touch.el.trigger("singleTap"), touch = {};
        }, 250);
      }, 0));
    }).bind("touchcancel", cancelAll), $(window).bind("scroll", cancelAll);
  }), [ "swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "doubleTap", "tap", "singleTap", "longTap" ].forEach(function(m) {
    $.fn[m] = function(callback) {
      return this.bind(m, callback);
    };
  });
}(Zepto), "function" == typeof define && define("zepto", function() {
  return Zepto;
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
}(), define("lightsaber", function(require, exports, module) {
  "use strict";
  function createApplication() {
    var app = new Application(), request = new Request(), response = new Response();
    return merge(app, Emitter.prototype), app.request = request, app.response = response, 
    request.app = response.app = app, app.init(), app;
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
  function lightsaberInit() {
    return function(req, res, next) {
      req.next = next, res.locals = res.locals || locals(res), next();
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
    this.cache = {}, this.settings = {}, this.engines = {}, this.route = ROOT, this.stack = [], 
    this.viewCallbacks = [], this.defaultConfiguration();
  }, proto.defaultConfiguration = function() {
    this.set("env", "production"), this.enable("dispatch"), this.use(lightsaberInit(this)), 
    this._router = new Router(this), this.routes = this._router.map, this._usedRouter = !1, 
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
    !1 !== options.popstate && (this.historySupport && !isIE ? $(window).on("popstate", proxy(this.change, this)) : $(window).on("hashchange", proxy(this.change, this))), 
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
}), define("live", function(require) {
  "use strict";
  function stopGeo() {
    navigator.geolocation.clearWatch(intGeoWatch);
  }
  function startGeo() {
    intGeoWatch = navigator.geolocation.watchPosition(function(data) {
      data && data.coords && data.coords.latitude && data.coords.longitude && data.coords.accuracy && (myData.latitude = "" + data.coords.latitude, 
      myData.longitude = "" + data.coords.longitude, myData.accuracy = "" + data.coords.accuracy, 
      secCnt = secInt - 5, log("Location update: lat = " + myData.latitude + ", " + "lng = " + myData.longitude + ", " + "acu = " + myData.accuracy));
    });
  }
  var _ENV_ = window._ENV_, streaming_api_url = _ENV_.streaming_api_url, api_url = _ENV_.api_url;
  require("store");
  var token = "", secInt = 30, secCnt = secInt, bolDebug = !1, echo = null, lstEcho = "", myData = {
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
  }, now = Date.now || function() {
    return new Date().getTime();
  }, streaming_api_url = streaming_api_url, submit_request = null, shake_start_callback = null, shake_end_callback = null, log = function(data, table) {
    if (bolDebug) {
      var type = Object.prototype.toString.call(data), time = "" + new Date();
      "[object String]" !== type && "[object Number]" !== type && (data = JSON.stringify(data)), 
      console.log(time.replace(/^.*(\d{2}:\d{2}:\d{2}).*$/, "$1") + " - " + data), table && console.table && console.table(table);
    }
  }, submitCard = function() {
    secCnt = 0, log("Breathe with" + (token ? " token: " + token : "out token")), submit_request && submit_request.abort(), 
    submit_request = $.ajax({
      type: "post",
      url: streaming_api_url + "/v3/live/cards" + (token ? "?token=" + token : ""),
      data: JSON.stringify(myData),
      success: function(data) {
        var rawToken = data;
        rawToken && rawToken.length && (secCnt = 0, token !== rawToken[0] && (log("Got new token: " + rawToken[0] + ", id: " + rawToken[1]), 
        stream.live && (stream.kill(), log("Close current stream")), secCnt = secInt), token = rawToken[0], 
        myData.card.id = rawToken[1]);
      },
      error: function(data) {
        data.status && data.status >= 400 && 499 >= data.status ? (token && log("Repeal token: " + token), 
        token = "", secCnt = secInt) : (secCnt = secInt - 5, log("Network error"));
      }
    }), !stream.live && token && (stream.init(streaming_api_url + "/v3/live/streaming?token=" + token, streamCallback, streamDead), 
    log("Streaming with token: " + token));
  }, streamCallback = function(data) {
    var rawCards = JSON.parse(data);
    if (rawCards && rawCards.length) {
      var cards = {};
      for (var i in rawCards) rawCards[i].id && (rawCards[i].id === myData.card.id ? (myData.card.name = rawCards[i].name, 
      myData.card.avatar = rawCards[i].avatar, myData.card.bio = rawCards[i].bio, myData.card.identities = rawCards[i].identities, 
      myData.card.timestamp = rawCards[i].timestamp) : (rawCards[i].avatar || (rawCards[i].avatar = encodeURI(api_url + "/avatar/default?name=" + rawCards[i].name)), 
      cards[rawCards[i].id] = rawCards[i]));
      var result = {
        me: clone(myData.card),
        others: cards
      }, curEcho = JSON.stringify(result);
      log("Streaming pops: " + curEcho, cards), echo && lstEcho !== curEcho && (log("Callback"), 
      echo(result), lstEcho = curEcho);
    } else log("Data error");
  }, streamDead = function() {
    log("Streaming is dead");
  }, breatheFunc = function() {
    checkCard(myData.card) && ++secCnt >= secInt && submitCard();
  }, stream = {
    prvLen: null,
    nxtIdx: null,
    timer: null,
    http: null,
    pop: null,
    dead: null,
    live: !1,
    init: function(url, pop, dead) {
      this.prvLen = 0, this.nxtIdx = 0, this.live = !0, this.pop = pop, this.dead = dead, 
      this.http = new XMLHttpRequest(), this.http.open("post", url), this.http.onreadystatechange = this.listen, 
      this.http.send(), this.timer = setInterval(this.listen, 1e3);
    },
    listen: function() {
      if (!(4 !== stream.http.readyState && 3 !== stream.http.readyState || 3 === stream.http.readyState && 200 !== stream.http.status || null === stream.http.responseText)) {
        for (4 === stream.http.readyState && 200 !== stream.http.status && stream.kill(); stream.prvLen !== stream.http.responseText.length && (4 !== stream.http.readyState || stream.prvLen !== stream.http.responseText.length); ) {
          stream.prvLen = stream.http.responseText.length;
          var rawResp = stream.http.responseText.substring(stream.nxtIdx), lneResp = rawResp.split("\n");
          if (stream.nxtIdx += rawResp.lastIndexOf("\n") + 1, "\n" === rawResp[rawResp.length - 1] && lneResp[lneResp.length] || lneResp.pop(), 
          stream.pop && lneResp && lneResp.length) for (var line; (line = lneResp.shift()) && line.length; ) stream.pop(line);
        }
        4 === stream.http.readyState && stream.prvLen === stream.http.responseText.length && stream.kill();
      }
    },
    kill: function() {
      clearInterval(this.timer), this.http && this.http.abort(), this.dead && this.dead(), 
      this.live = !1;
    }
  }, rawShake = function() {
    if (window.DeviceMotionEvent === void 0) return null;
    var sensitivity = 50, x1 = 0, y1 = 0, z1 = 0, x2 = 0, y2 = 0, z2 = 0;
    window.addEventListener("devicemotion", function(e) {
      x1 = e.accelerationIncludingGravity.x, y1 = e.accelerationIncludingGravity.y, z1 = e.accelerationIncludingGravity.z;
    }, !1), setInterval(function() {
      var change = Math.abs(x1 - x2 + y1 - y2 + z1 - z2);
      change > sensitivity && (shake_start_callback && shake_start_callback(), shake_end_callback && setTimeout(shake_end_callback, 1e3)), 
      x2 = x1, y2 = y1, z2 = z1;
    }, 100);
  }, checkIdentity = function(identity) {
    return identity && identity.external_username && identity.provider ? !0 : !1;
  }, checkCard = function(card) {
    if (card && card.name && card.identities && card.identities.length) {
      for (var i in card.identities) if (checkIdentity(card.identities[i]) === !1) return !1;
      return !0;
    }
  }, clone = function(variable) {
    switch (Object.prototype.toString.call(variable)) {
     case "[object Object]":
      var variableNew = {};
      for (var i in variable) variableNew[i] = clone(variable[i]);
      break;

     case "[object Array]":
      variableNew = [];
      for (i in variable) variableNew.push(clone(variable[i]));
      break;

     default:
      variableNew = variable;
    }
    return variableNew;
  }, live = {
    init: function(card, callback) {
      checkCard(card) ? (stream.kill(), myData.card.name = card.name, myData.card.avatar = card.avatar, 
      myData.card.bio = card.bio, myData.card.identities = clone(card.identities), myData.card.timestamp = now(), 
      log("Set my card: " + JSON.stringify(myData.card))) : log("Card error"), callback && (echo = callback, 
      log("Set callback function")), secCnt = secInt;
    },
    shake: function(start_callback, end_callback) {
      shake_start_callback = start_callback, shake_end_callback = end_callback;
    },
    startGeo: startGeo,
    stopGeo: stopGeo
  };
  setInterval(breatheFunc, 1e3), rawShake(shake_start_callback, shake_end_callback);
  var intGeoWatch;
  return window.addEventListener("load", function() {
    setTimeout(function() {
      window.scrollTo(0, 0);
    }, 0);
  }), live;
}), define("routexstream", function() {
  "use strict";
  var _ENV_ = window._ENV_, api_url = _ENV_.apiv3_url, cross_id = 0, token = "", secInt = 10, secCnt = secInt, echo = null, unat_cbf = null, bolDebug = !!0, myData = {
    t: 0,
    gps: [ 0, 0, 0 ]
  }, submit_request = null, shake_start_callback = null, shake_end_callback = null, intGeoWatch = null, submitGps = function() {
    return secCnt = 0, token ? (log("Breathe with token: " + token), submit_request && submit_request.abort(), 
    submit_request = $.ajax({
      type: "POST",
      url: api_url + "/routex/breadcrumbs?coordinate=earth&token=" + token,
      data: JSON.stringify([ myData ]),
      success: function(data) {
        data && localStorage.setItem("offset-latlng", JSON.stringify(data));
      },
      error: function(data) {
        var status = data.status;
        status && status >= 400 && 499 >= status ? (log("Unauthorized."), unat_cbf && (stream.kill(), 
        unat_cbf())) : (secCnt = secInt - 5, log("Network error"));
      }
    }), void 0) : (log("No token!"), void 0);
  }, log = function(data, table) {
    if (bolDebug) {
      var type = Object.prototype.toString.call(data), time = "" + new Date();
      "[object String]" !== type && "[object Number]" !== type && (data = JSON.stringify(data)), 
      console.log(time.replace(/^.*(\d{2}:\d{2}:\d{2}).*$/, "$1") + " - " + data), table && console.table && console.table(table);
    }
  }, rawShake = function() {
    if (window.DeviceMotionEvent === void 0) return null;
    var sensitivity = 50, x1 = 0, y1 = 0, z1 = 0, x2 = 0, y2 = 0, z2 = 0;
    window.addEventListener("devicemotion", function(e) {
      x1 = e.accelerationIncludingGravity.x, y1 = e.accelerationIncludingGravity.y, z1 = e.accelerationIncludingGravity.z;
    }, !1), setInterval(function() {
      var change = Math.abs(x1 - x2 + y1 - y2 + z1 - z2);
      change > sensitivity && (shake_start_callback && shake_start_callback(), shake_end_callback && setTimeout(shake_end_callback, 1e3)), 
      x2 = x1, y2 = y1, z2 = z1;
    }, 100);
  }, stream = {
    prvLen: null,
    nxtIdx: null,
    timer: null,
    http: null,
    pop: null,
    dead: null,
    live: !1,
    init: function(url, pop, dead) {
      console.log(url), this.prvLen = 0, this.nxtIdx = 0, this.live = !0, this.pop = pop, 
      this.dead = dead;
      var http = this.http = new XMLHttpRequest();
      http.open("post", url), http.onreadystatechange = this.listen, http.send(), this.timer = setInterval(this.listen, 1e3);
    },
    listen: function() {
      var http = stream.http;
      if (!(4 !== http.readyState && 3 !== http.readyState || 3 === http.readyState && 200 !== http.status || null === http.responseText)) {
        for (4 === http.readyState && 200 !== http.status && stream.kill(); stream.prvLen !== http.responseText.length && (4 !== http.readyState || stream.prvLen !== http.responseText.length); ) {
          stream.prvLen = http.responseText.length;
          var rawResp = http.responseText.substring(stream.nxtIdx), lneResp = rawResp.split("\n");
          if (stream.nxtIdx += rawResp.lastIndexOf("\n") + 1, "\n" === rawResp[rawResp.length - 1] && lneResp[lneResp.length] || lneResp.pop(), 
          stream.pop && lneResp && lneResp.length) for (var line; (line = lneResp.shift()) && line.length; ) stream.pop(line);
        }
        4 === http.readyState && stream.prvLen === http.responseText.length && stream.kill();
      }
    },
    kill: function() {
      clearInterval(this.timer), this.http && this.http.abort(), this.dead && this.dead(), 
      this.live = !1;
    }
  }, streamDead = function() {
    log("Streaming is dead");
  }, breatheFunc = function() {
    checkGps(myData) && ++secCnt >= secInt && submitGps(), !stream.live && token && (stream.init(api_url + "/routex/crosses/" + cross_id + "?_method=WATCH&coordinate=mars&token=" + token, streamCallback, streamDead), 
    log("Streaming with token: " + token));
  }, checkGps = function(data) {
    return data && data.ts && data.lat && data.lng && data.acc;
  }, stopGeo = function() {
    geoService.stopWatch(intGeoWatch);
  }, getGeo = function(done, fail) {
    geoService.get(function(result) {
      myData.t = result.timestamp, myData.gps[0] = result.latitude, myData.gps[1] = result.longitude, 
      myData.gps[2] = result.accuracy, done && done(result), log("Location update: time = " + myData.t + ", " + "lat  = " + myData.gps[0] + ", " + "lng  = " + myData.gps[1] + ", " + "acu  = " + myData.gps[2]);
    }, function(result) {
      fail && fail(result);
    });
  }, startGeo = function(done, fail) {
    intGeoWatch = geoService.watch(function(result) {
      myData.t = result.timestamp, myData.gps[0] = result.latitude, myData.gps[1] = result.longitude, 
      myData.gps[2] = result.accuracy, done && done(result), log("Location update: time = " + myData.t + ", " + "lat  = " + myData.gps[0] + ", " + "lng  = " + myData.gps[1] + ", " + "acu  = " + myData.gps[2]);
    }, function(result) {
      fail && fail(result);
    });
  }, geoService = {
    options: {
      enableHighAccuracy: !0,
      maximumAge: 0,
      timeout: 29999.999999
    },
    cachedOptions: {
      enableHighAccuracy: !1,
      maximumAge: 72e5,
      timeout: 5e3
    },
    STATUS: 0,
    freshness_threshold: 4999.999999,
    accuracy_threshold: 500,
    _success: function(done) {
      var self = this, freshness_threshold = this.freshness_threshold, accuracy_threshold = this.accuracy_threshold, prev = new Date().getTime();
      return function d(p) {
        var coords = p.coords, result = coords, curr = new Date().getTime(), status = !1;
        0 === self.STATUS && (status = !0), curr - prev > freshness_threshold && (status = !0), 
        status && (prev = curr + freshness_threshold, result.status = "success", result.timestamp = Math.round(p.timestamp / 1e3), 
        result.accuracy = parseInt(coords.accuracy || accuracy_threshold), done && done(result), 
        0 === self.STATUS && (self.STATUS = 1), d = null);
      };
    },
    _error: function(fail) {
      return function f(e) {
        var result = {
          status: "fail",
          code: e.code,
          message: e.message
        };
        fail && fail(result), f = null;
      };
    },
    get: function(done, fail, options) {
      options = options || this.options, navigator.geolocation.getCurrentPosition(this._success(done), this._error(fail), options);
    },
    watch: function(done, fail) {
      return navigator.geolocation.watchPosition(this._success(done), this._error(fail), this.STATUS ? this.options : this.cachedOptions);
    },
    stopWatch: function(wid) {
      wid && navigator.geolocation.clearWatch(wid);
    }
  }, streamCallback = function(rawData) {
    var data = JSON.parse(rawData);
    data && data.type && (log("Streaming pops: " + data.type), echo(data));
  }, routexStream = {
    init: function(intCrossId, strToken, callback, unauthorized_callback) {
      return intCrossId ? strToken ? callback ? unauthorized_callback ? (cross_id = intCrossId, 
      log("Set cross_id: " + intCrossId), token = strToken, log("Set token: " + strToken), 
      echo = callback, log("Set callback function"), unat_cbf = unauthorized_callback, 
      log("Set unauthorized callback function"), secCnt = secInt, void 0) : (log("Error unauthorized callback!"), 
      void 0) : (log("Error callback!"), void 0) : (log("Error token!"), void 0) : (log("Error cross id!"), 
      void 0);
    },
    shake: function(start_callback, end_callback) {
      shake_start_callback = start_callback, shake_end_callback = end_callback;
    },
    getGeo: getGeo,
    startGeo: startGeo,
    stopGeo: stopGeo,
    geoService: geoService
  };
  return setInterval(breatheFunc, 1e3), rawShake(shake_start_callback, shake_end_callback), 
  window.addEventListener("load", function() {
    setTimeout(function() {
      window.scrollTo(0, 0);
    }, 0);
  }), routexStream;
}), define("routexmaps", function(require) {
  "use strict";
  function RoutexMaps(options) {
    options = this.options = options || {}, this.svgLayer = this.options.svg, delete this.options.svg, 
    this.latOffset = 0, this.lngOffset = 0, this.routes = {}, this.places = {}, this.tiplines = {}, 
    this.breadcrumbs = {}, this.geoMarkers = {}, this.icons = {}, this.updated = {}, 
    this._breadcrumbs = {}, this.boundsOffset = {
      left: 50,
      top: 0
    }, this.labels = [], window._loadmaps_ = function(rm, mapDiv, mapOptions, callback) {
      return function cb() {
        var GMaps = google.maps, GEvent = GMaps.event;
        GMaps.InfoBox = require("infobox"), GMaps.TextLabel = require("maplabel");
        var icons = rm.icons;
        icons.dotGrey = new GMaps.MarkerImage(SITE_URL + "/static/img/map_dot_grey@2x.png", new GMaps.Size(36, 36), new GMaps.Point(0, 0), new GMaps.Point(9, 9), new GMaps.Size(18, 18)), 
        icons.dotRed = new GMaps.MarkerImage(SITE_URL + "/static/img/map_dot_red@2x.png", new GMaps.Size(36, 36), new GMaps.Point(0, 0), new GMaps.Point(9, 9), new GMaps.Size(18, 18)), 
        icons.arrowBlue = new GMaps.MarkerImage(SITE_URL + "/static/img/map_arrow_blue@2x.png", new GMaps.Size(40, 40), new GMaps.Point(0, 0), new GMaps.Point(10, 10), new GMaps.Size(20, 20)), 
        icons.arrowGrey = new GMaps.MarkerImage(SITE_URL + "/static/img/map_arrow_g5@2x.png", new GMaps.Size(40, 40), new GMaps.Point(0, 0), new GMaps.Point(10, 10), new GMaps.Size(20, 20)), 
        GMaps.visualRefresh = !0, mapOptions.center = rm.toLatLng(35.86166, 104.195397), 
        mapOptions.mapTypeId = GMaps.MapTypeId.ROADMAP, mapOptions.disableDefaultUI = !0, 
        mapOptions.minZoom = 1;
        var map = rm.map = new GMaps.Map(mapDiv, mapOptions), overlay = rm.overlay = new GMaps.OverlayView();
        overlay.draw = function() {}, overlay.setMap(map);
        var initListener = GEvent.addListener(map, "tilesloaded", function() {
          function clear(t) {
            clearTimeout(t), t = null;
          }
          GEvent.addListener(map, "bounds_changed", function() {
            GEvent.trigger(map, "zoom_changed");
          }), GEvent.addListener(map, "zoom_changed", function() {
            rm.contains();
          });
          var t, MD_TIME, time = 377;
          GEvent.addDomListener(mapDiv, "touchstart", function(e) {
            console.dir(e), rm.hideIdentityPanel(), rm.hideNearBy(), MD_TIME = Date.now(), clear(t), 
            t = setTimeout(function() {
              e.preventDefault();
              var touch = e.touches[0], point = {
                x: touch.pageX,
                y: touch.pageY
              };
              rm.showNearBy(point);
            }, time), GEvent.clearListeners(mapDiv, "touchmove"), GEvent.addDomListenerOnce(mapDiv, "touchmove", function() {
              clear(t), rm.hideTiplines();
            });
          }), GEvent.addDomListener(mapDiv, "touchend", function() {
            377 > Date.now() - MD_TIME && clear(t);
          }), GEvent.removeListener(initListener);
        });
        callback(map), cb = null;
      };
    }(this, options.mapDiv, options.mapOptions, options.callback);
  }
  var SITE_URL = window._ENV_.site_url, EarthRadiusMeters = 6378137, distance = function(lat1, lng1, lat2, lng2) {
    var R = EarthRadiusMeters, dLat = (lat2 - lat1) * Math.PI / 180, dLon = (lng2 - lng1) * Math.PI / 180, a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2), c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)), d = R * c;
    return d;
  }, toRad = function(l) {
    return l * Math.PI / 180;
  }, toDeg = function(angle) {
    return 180 * angle / Math.PI;
  }, bearing = function(lat1, lon1, lat2, lon2) {
    lat1 = toRad(lat1), lon1 = toRad(lon1), lat2 = toRad(lat2), lon2 = toRad(lon2);
    var dLon = lon2 - lon1, y = Math.sin(dLon) * Math.cos(lat2), x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon), angle = Math.atan2(y, x);
    return 0 > angle && (angle += 2 * Math.PI), toDeg(angle);
  }, distanceOutput = function(n, s, t, r) {
    return t = '<span class="unit">{{u}}</span>', n = Math.floor(n), r = {
      text: "",
      status: 0,
      distance: n
    }, 30 > n ? (r.status = 4, r.text = "抵达") : r.text = 1e3 > n ? n + t.replace("{{u}}", "米") : 9e3 > n ? (n / 1e3 + "").slice(0, 3) + t.replace("{{u}}", "公里") : "9+" + t.replace("{{u}}", "公里"), 
    r;
  }, toHex = function(n) {
    return (1 * n).toString(16);
  }, pad0 = function(n) {
    return n += "", n + (n.length > 1 ? "" : "0");
  }, MAX_INDEX = 610, ROUTE = "route", LOCATION = "location", DESTINATION = "destination", BREADCRUMBS = "breadcrumbs", TIME_STEPS = [ 0, 1, 3, 5, 10, 15 ], proto = RoutexMaps.prototype;
  proto.load = function(cb) {
    var n = document.createElement("script");
    n.type = "text/javascript", n.async = !0, n.onload = n.onerror = n.onreadystatechange = function() {
      /^(?:loaded|complete|undefined)$/.test(n.readyState) && (n = n.onload = n.onerror = n.onreadystatechange = null, 
      cb && cb());
    }, n.src = this.options.url, document.body.appendChild(n);
  }, proto.fromContainerPixelToLatLng = function(point) {
    return this.overlay.getProjection().fromContainerPixelToLatLng(point);
  }, proto.fromLatLngToContainerPixel = function(latlng) {
    return this.overlay.getProjection().fromLatLngToContainerPixel(latlng);
  }, proto.showIdentityPanel = function(uid) {
    this.hideNearBy();
    var data, t, gm = this.geoMarkers[uid], geoLocation = this.geoLocation, destinationPlace = this.destinationPlace, identity = $('#identities-overlay .identity[data-uid="' + uid + '"]').data("identity"), $otherInfo = $("#other-info"), now = Math.round(Date.now() / 1e3);
    if (gm) {
      if (data = gm.data.positions[0], t = Math.floor((now - data.ts) / 60), $otherInfo.find(".name").text(identity.name), 
      t > 1 ? ($otherInfo.find(".update").removeClass("hide").find(".time").text(t), $otherInfo.find(".please-update").removeClass("hide")) : ($otherInfo.find(".update").addClass("hide"), 
      $otherInfo.find(".please-update").addClass("hide")), destinationPlace) {
        var p2 = destinationPlace.getPosition(), d = distance(p2.lat(), p2.lng(), data.lat, data.lng), result = distanceOutput(d);
        $otherInfo.find(".dest").removeClass("hide").find(".m").html(result.text);
      } else $otherInfo.find(".dest").addClass("hide");
      if (geoLocation) {
        var p2 = geoLocation.getPosition(), d = distance(p2.lat(), p2.lng(), data.lat, data.lng), result = distanceOutput(d);
        $otherInfo.find(".dest-me").removeClass("hide").find(".m").html(result.text);
      } else $otherInfo.find(".dest-me").removeClass("hide");
      $otherInfo.removeClass("hide");
      var w = $(window).width(), h = $(window).height(), oh = $otherInfo.height(), ow = $otherInfo.width(), point = this.fromLatLngToContainerPixel(gm.getPosition()), left = point.x - ow / 2, top = point.y - oh / 2;
      0 > left && (left = 50), left + ow > w && (left = w - ow), 0 > top && (top = 20), 
      top + oh > h && (top = h - oh), $otherInfo.css({
        left: left,
        top: top
      });
    }
  }, proto.hideIdentityPanel = function() {
    $("#other-info").addClass("hide");
  };
  var NEARBY_TMP = '<div id="nearby" class="info-windown"></div>', PLACE_TMP = '<div class="place-marker"><h4 class="title"></h4><div class="description"></div></div>', IDENTITY_TMP = '<div class="geo-marker clearfix"><img width="30" height="30" src="" alt="" /><div class="detial"><div class="name"></div><div class="status"></div></div></div>';
  return proto.hideNearBy = function() {
    $("#nearby").remove();
  }, proto.distance100px = function(p0, b) {
    var a = this.fromLatLngToContainerPixel(p0), d = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    return 100 >= d;
  }, proto.showNearBy = function(point) {
    if (point) {
      var latlng, p, center = point, status = !1, places = (this.myuid, this.places), geoMarkers = this.geoMarkers, geoLocation = this.geoLocation, geoPosition = geoLocation && geoLocation.getPosition(), destinationPlace = this.destinationPlace, destinationPosition = destinationPlace && destinationPlace.getPosition(), now = Date.now() / 1e3;
      console.log("-----------------------", geoPosition, destinationPosition);
      var nbDiv = $(NEARBY_TMP);
      for (var k in places) if (p = places[k], latlng = p.getPosition(), this.distance100px(latlng, center)) {
        status || (status = !0);
        var tmp = $(PLACE_TMP);
        tmp.find(".title").text(p.data.title), tmp.find(".description").text(p.data.description), 
        nbDiv.append($("<div></div>").append(tmp));
      }
      for (var k in geoMarkers) if (p = geoMarkers[k], latlng = p.getPosition(), this.distance100px(latlng, center)) {
        status || (status = !0), p.data.id.split("@")[0];
        var identity = $('#identities-overlay .identity[data-uid="' + k + '"]').data("identity"), tmp = $(IDENTITY_TMP);
        tmp.find("img").attr("src", identity.avatar_filename), tmp.find(".name").text(identity.name), 
        tmp.attr("data-uid", k);
        var position = p.data.positions[0], n = Math.floor((now - position.t) / 60), dm = "", dd = "", str = "";
        if (geoPosition) {
          var s = distanceOutput(distance(latlng.lat(), latlng.lng(), geoPosition.lat(), geoPosition.lng()));
          dm = s.text;
        }
        if (destinationPosition) {
          var s = distanceOutput(distance(latlng.lat(), latlng.lng(), destinationPosition.lat(), destinationPosition.lng()));
          dd = s.text;
        }
        1 >= n ? (dd && (str += "<span>距离目的地" + dd + "</span>"), dm && (str += "<span>与您相距" + dm + "</span>")) : (str += "<span>" + n + "分钟前所处位置</span>", 
        dd && (str += "<span>距离目的地" + dd + "</span>")), str && tmp.find(".status").html(str), 
        nbDiv.append($("<div></div>").append(tmp));
      }
      if (status) {
        var width = $(window).width(), height = $(window).height();
        nbDiv.css({
          left: (width - 200 + 50) / 2,
          top: (height - 132) / 2
        }), $("#routex").append(nbDiv);
      }
    }
  }, proto.draw = function(data) {
    var tag, type = data.type, action = data.action, isDelete = action && "delete" === action, hasTags = data.tags, tags = hasTags && data.tags.slice(0);
    switch (console.log(type, action, isDelete, tags, data), type) {
     case LOCATION:
      var isDestination;
      if (hasTags) for (;tag = tags.shift(); ) if (tag === DESTINATION) {
        isDestination = !0;
        var i = data.tags.indexOf("cross_place");
        i > 0 && data.tags.splice(i, 1);
        break;
      }
      isDelete ? this.removePlace(data) : this.drawPlace(data, isDestination);
      break;

     case ROUTE:
      var isBreadcrumbs;
      if (hasTags) for (;tag = tags.shift(); ) if (tag === BREADCRUMBS) {
        isBreadcrumbs = !0;
        break;
      }
      isBreadcrumbs ? this.drawGeoMarker(data) : isDelete ? this.removeRoute(data) : this.drawRoute(data);
    }
  }, proto.removePlace = function(data) {
    var places = this.places, id = data.id, p = places[id];
    p && (p.setMap(null), p = null, delete places[id]);
  }, proto.drawRoute = function(data) {
    var r, d, p, gps, routes = this.routes, id = data.id, positions = data.positions.slice(0), coords = [];
    if (!routes.hasOwnProperty(id) || (r = routes[id], d = r.data, d.updated_at !== data.updated_at)) {
      for (r || (r = routes[id] = this.addPolyline(data)); p = positions.shift(); ) gps = p.gps, 
      coords.push(this.toLatLng(gps[0], gps[1]));
      r.setPath(coords), r.data = data;
    }
  }, proto.removeRoute = function(data) {
    var routes = this.routes, id = data.id, r = routes[id];
    r && (r.setMap(null), r = null, delete routes[id]);
  }, proto.addPolyline = function(data) {
    var rgba = data.color && data.color.split(",") || [], color = "#" + (rgba.length ? pad0(toHex(rgba[0])) + pad0(toHex(rgba[1])) + pad0(toHex(rgba[2])) : "007BFF"), alpha = rgba[3] || 1, p = new google.maps.Polyline({
      map: this.map,
      index: MAX_INDEX - 5,
      geodesic: !0,
      strokeColor: color,
      strokeWeight: 4,
      strokeOpacity: alpha
    });
    return p;
  }, proto.drawPlace = function(data, isDestination) {
    var p, d, latlng, places = this.places, id = data.id;
    if ((!places.hasOwnProperty(id) || (p = places[id], d = p.data, d.updated_at !== data.updated_at)) && (p || (p = places[id] = this.addPoint(data, isDestination)), 
    latlng = this.toLatLng(data.lat, data.lng), p.setPosition(latlng), p.data = data, 
    isDestination)) {
      var geoLocation = this.geoLocation;
      (!geoLocation || geoLocation && 0 == geoLocation._status) && this.panToDestination(latlng), 
      this.destinationPlace = p, p.setZIndex(MAX_INDEX);
    }
  }, proto.monit = function() {
    var uid, isme, d, n, gm, b, $e, tl, u = this.updated, bs = this.breadcrumbs, icons = this.icons, gms = this.geoMarkers, tiplines = this.tiplines, dp = this.destinationPlace, geo = this.geoLocation, myuid = this.myuid, curr_uid = this.uid, now = Math.round(new Date().getTime() / 1e3);
    for (uid in u) if (u.hasOwnProperty(uid)) if (d = u[uid], isme = myuid == uid, n = Math.floor((now - d.t) / 60), 
    gm = isme ? geo : gms[uid], this.distanceMatrix(uid, gm, dp, n), b = bs[uid], tl = tiplines[uid], 
    $e = $('#identities-overlay .identity[data-uid="' + uid + '"]').find(".icon"), curr_uid && curr_uid == uid && this._breadcrumbs[curr_uid] && this.showTextLabels(curr_uid, this._breadcrumbs[curr_uid].positions.slice(0), 1 >= n), 
    1 >= n) {
      if ($e.length && ($e.hasClass("icon-arrow-grey") || $e.hasClass("icon-arrow-red") ? $e.attr("class", "icon icon-arrow-red") : $e.attr("class", "icon icon-dot-red")), 
      b && b.setOptions({
        strokeOpacity: 0,
        icons: [ {
          icon: {
            path: "M0,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 z",
            fillColor: "#FF7E98",
            fillOpacity: .8,
            strokeColor: "#fff",
            strokeOpacity: .8,
            strokeWeight: 1,
            scale: .5
          },
          repeat: "50px",
          offset: "0"
        } ]
      }), isme) continue;
      tl && tl.setAttribute("stroke", "#FF7E98"), gm && gm.setIcon(icons.dotRed);
    } else {
      if ($e.length && ($e.hasClass("icon-arrow-grey") || $e.hasClass("icon-arrow-red") ? $e.attr("class", "icon icon-arrow-grey") : $e.attr("class", "icon icon-dot-grey")), 
      b && b.setOptions({
        strokeOpacity: 0,
        icons: [ {
          icon: {
            path: "M0,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 z",
            fillColor: "#b2b2b2",
            fillOpacity: .8,
            strokeColor: "#fff",
            strokeOpacity: .8,
            strokeWeight: 1,
            scale: .5
          },
          repeat: "50px",
          offset: "0"
        } ]
      }), isme) continue;
      tl && tl.setAttribute("stroke", "#b2b2b2"), gm && gm.setIcon(icons.dotGrey);
    }
  }, proto.toLatLng = function(lat, lng) {
    return new google.maps.LatLng(1 * lat, 1 * lng);
  }, proto.drawBreadcrumbs = function(data) {
    this.breadcrumbs, data.uid;
  }, proto.drawGeoMarker = function(data) {
    var g, d, latlng, gps, gms = this.geoMarkers, uid = data.id.split("@")[0];
    if (this.updatePositions(data), uid != this.myuid) {
      if (gms.hasOwnProperty(uid) && (g = gms[uid], d = g.data, d.updated_at === data.updated_at)) return;
      g || (g = gms[uid] = this.addGeoMarker()), gps = data.positions[0].gps, latlng = this.toLatLng(gps[0], gps[1]), 
      g.setPosition(latlng), g.data = data, this.updateTipline(uid, latlng);
    }
  }, proto.updatePositions = function(data) {
    var id = data.id.split("@")[0];
    this._breadcrumbs[id] ? this._breadcrumbs[id].positions.unshift(data.positions[0]) : this._breadcrumbs[id] = data, 
    this.updated[id] = this._breadcrumbs[id].positions[0];
  }, proto.addGeoMarker = function() {
    var gm = new google.maps.Marker({
      map: this.map,
      animation: 2,
      zIndex: MAX_INDEX - 2,
      icon: this.icons.dotGrey,
      shape: {
        type: "circle",
        circle: [ 9, 9, 9 ]
      },
      optimized: !1
    });
    return gm;
  }, proto.distanceMatrix = function(uid, gm, dp, time) {
    time = time || 0;
    var $identity = $('#identities-overlay .identity[data-uid="' + uid + '"]'), $detial = $identity.find(".detial"), $icon = $detial.find(".icon"), $distance = $detial.find(".distance");
    if (gm && dp) {
      var p0 = gm.getPosition(), p1 = dp.getPosition(), lat1 = p0.lat(), lng1 = p0.lng(), lat2 = p1.lat(), lng2 = p1.lng(), d = distance(lat2, lng2, lat1, lng1), r = bearing(lat2, lng2, lat1, lng1), result = distanceOutput(d);
      result.rotate = r, $distance.html(result.text), $icon.css("-webkit-transform", "rotate(" + r + "deg)"), 
      $icon.attr("class", "icon icon-arrow-" + (1 >= time ? "red" : "grey")), $detial.css("visibility", "visible");
    } else gm ? ($icon.hasClass("icon-dot-red") || $icon.hasClass("icon-dot-red") || $icon.attr("class", "icon icon-dot" + (1 >= time ? "red" : "grey")), 
    $distance.html((time >= 9 ? "9+" : time) + '<span class="unit">分钟前</span>'), $detial.css("visibility", "visible")) : $detial.css("visibility", "hidden");
  }, proto.fitBoundsWithDestination = function(uid) {
    var destinationPlace = this.destinationPlace, isme = this.myuid == uid, gm = isme ? this.geoLocation : this.geoMarkers[uid];
    if (gm) {
      var gmlatlng = gm.getPosition(), map = this.map;
      if (destinationPlace) {
        var bounds, dlatlng = destinationPlace.getPosition(), p = this.fromLatLngToContainerPixel(dlatlng);
        isme ? bounds = this.calculateBoundsByCenter(gmlatlng, [ dlatlng ]) : (bounds = new google.maps.LatLngBounds(), 
        50 > p.x && (p = this.fromContainerPixelToLatLng(new google.maps.Point(p.x - 50, p.y)), 
        bounds.extend(p)), bounds.extend(gmlatlng), bounds.extend(dlatlng)), map.fitBounds(bounds);
      } else (isme || !map.getBounds().contains(gmlatlng)) && (7 > map.getZoom() && map.setZoom(15), 
      map.panTo(gmlatlng));
    }
  }, proto.panToDestination = function(position) {
    var map = this.map;
    7 > map.getZoom() && map.setZoom(15), map.panTo(position || this.destinationPlace.getPosition());
  }, proto.calculateBoundsByCenter = function(center, others) {
    for (var point, coord, c, bounds = new google.maps.LatLngBounds(), points = []; coord = others.shift(); ) point = this.fromLatLngToContainerPixel(coord), 
    points.push(point);
    for (var d, p, c = this.fromLatLngToContainerPixel(center), maxd = 0; p = points.shift(); ) d = Math.sqrt(Math.pow(p.x - c.x, 2) + Math.pow(p.y - c.y, 2)), 
    d > maxd && (maxd = d);
    var sw = this.fromContainerPixelToLatLng(new google.maps.Point(c.x - maxd - 50, c.y - maxd - 50)), ne = this.fromContainerPixelToLatLng(new google.maps.Point(c.x + maxd + 50, c.y + maxd + 50));
    return bounds.extend(sw), bounds.extend(center), bounds.extend(ne), bounds;
  }, proto.addBreadcrumbs = function() {
    var color = "#b2b2b2", alpha = .8, p = new google.maps.Polyline({
      map: this.map,
      visible: !1,
      index: MAX_INDEX - 5,
      strokeOpacity: 0,
      icons: [ {
        icon: {
          path: "M0,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 z",
          fillColor: color,
          fillOpacity: alpha,
          strokeColor: "#fff",
          strokeOpacity: .8,
          strokeWeight: 1,
          scale: .5
        },
        fixedRotation: !0,
        repeat: "50px",
        offset: "0"
      } ]
    });
    return p;
  }, proto.MIN_PIXL = 50, proto.distanceMatrixPixl = function(p0, p1, n) {
    n = n || 50;
    var a = this.fromLatLngToContainerPixel(new google.maps.LatLng(p0[0], p0[1])), b = this.fromLatLngToContainerPixel(new google.maps.LatLng(p1[0], p1[1])), d = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    return d >= n;
  }, proto.showTextLabels = function(uid, positions, bool) {
    if (uid) {
      for (var label, marker, p, t, prev, now = Math.round(Date.now() / 1e3), labels = this.labels, map = this.map, ps = positions.slice(0), b = !0, start = 0, end = 120, i = 0, ignore = 0; p = ps.shift(); ) if (t = 10 * Math.floor((now - p.t) / 600), 
      ignore !== t) {
        if (ignore = t, t > end) break;
        prev && (b = this.distanceMatrixPixl(p.gps, prev.gps)), t > start && b && (-1 != TIME_STEPS.indexOf(t) || t > 15) && (start = t, 
        label = labels[i], label ? marker = label.marker : (marker = new google.maps.Marker({
          map: map,
          zIndex: MAX_INDEX - 4,
          optimized: !1
        }), label = labels[i] = new google.maps.TextLabel({
          map: map,
          zIndex: MAX_INDEX - 3
        }), label.marker = marker), marker && (marker.setPosition(this.toLatLng(p.gps[0], p.gps[1])), 
        marker.setIcon({
          path: "M0,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 z",
          fillColor: bool ? "#FF7E98" : "#b2b2b2",
          fillOpacity: .8,
          strokeColor: "#fff",
          strokeOpacity: .8,
          strokeWeight: 1,
          scale: .5
        })), label.set("text", t + "分钟前"), prev = p, i++);
      }
      for (var len = labels.length - 1; len > i; len--) label = labels[len], label && label.setMap(null), 
      labels.splice(len, 1);
    }
  }, proto.removeTextLabels = function() {
    for (var label, labels = this.labels; label = labels.shift(); ) label.setMap(null);
    labels.length = 0;
  }, proto.updateBreadcrumbs = function(uid) {
    var data, b, p, gps, coords = [];
    if (data = this._breadcrumbs[uid]) {
      var positions0 = data.positions.slice(0), positions1 = positions0.slice(0);
      if (this.showTextLabels(uid, positions0), b = this.breadcrumbs[uid]) {
        for (;p = positions1.pop(); ) gps = p.gps, coords.push(this.toLatLng(gps[0], gps[1]));
        b.setPath(coords);
      }
    }
  }, proto.showBreadcrumbs = function(uid) {
    if (this._breadcrumbs[uid]) {
      var pb, bds = this.breadcrumbs, puid = this.uid, b = bds[uid];
      if (delete this.uid, b || (b = bds[uid] = this.addBreadcrumbs()), b && this.updateBreadcrumbs(uid), 
      uid !== puid) pb = bds[puid], pb && (pb.setMap(null), delete bds[puid], pb = null, 
      this.removeTextLabels()), b && (b.setVisible(!0), this.uid = uid); else if (b) {
        var v = !b.getVisible();
        b.setVisible(v), v ? this.uid = uid : (b.setMap(null), delete bds[uid], b = null, 
        this.removeTextLabels());
      }
      console.log("current breadcrumbs", uid);
    }
  }, proto.addPoint = function(data, isDestination) {
    var self = this, GMaps = google.maps, map = this.map, m = new GMaps.Marker({
      map: map,
      animation: 2,
      zIndex: MAX_INDEX - 5,
      icon: new GMaps.MarkerImage(data.icon, new GMaps.Size(48, 68), new GMaps.Point(0, 0), new GMaps.Point(12, 34), new GMaps.Size(24, 34))
    }), GEvent = GMaps.event;
    return m.isDestination = isDestination, GEvent.addListener(m, "mousedown", function(e) {
      if (e && e.stop(), self.removeInfobox(this)) return !1;
      var infobox = self.infobox = new GMaps.InfoBox({
        content: self.infoWindowTemplate.replace("{{title}}", data.title).replace("{{description}}", data.description),
        maxWidth: 200,
        pixelOffset: new GMaps.Size(-100, -38),
        boxClass: "park",
        closeBoxMargin: "",
        closeBoxURL: "",
        alignBottom: !0,
        enableEventPropagation: !1,
        leftBoundary: 60,
        zIndex: 610,
        boxId: isDestination ? "destination" : "",
        events: function() {
          if (isDestination) {
            var ib = this;
            ib.editing = !1, GEvent.addDomListener(this.div_, "touchstart", function() {
              if (!ib.editing) {
                var infoWindown = this.querySelector(".info-windown"), title = this.querySelector(".title").innerHTML, description = this.querySelector(".description").innerHTML, ct = document.createElement("input");
                ct.type = "text", ct.value = title;
                var cd = document.createElement("textarea");
                cd.value = description, infoWindown.appendChild(ct), infoWindown.appendChild(cd), 
                this.querySelector(".title").className = "title hide", this.querySelector(".description").className = "description hide", 
                ib.editing = !0;
              }
            });
          }
        }
      });
      infobox._marker = this, infobox.open(map, this), GEvent.addListenerOnce(this, "mouseout", function() {
        if (infobox.editing) {
          var data = infobox._marker.data, title = $("#destination input").val().trim(), description = $("#destination textarea").val().trim();
          data.title = title, data.description = description, data.updated_at = Math.round(Date.now() / 1e3), 
          $("#destination input, #description textarea").remove(), $("#destination .title").text(title).removeClass("hide"), 
          $("#destination .description").text(description).removeClass("hide"), self.controller.editDestination(data);
        }
        infobox.close(), delete infobox._marker, infobox = self.infobox = null;
      });
    }), m;
  }, proto.removeInfobox = function(marker) {
    var m, infobox = this.infobox;
    return infobox && (m = infobox._marker, infobox.close(), delete infobox._marker, 
    infobox = this.infobox = null, m === marker) ? !0 : void 0;
  }, proto.infoWindowTemplate = '<div class="info-windown"><h2 class="title">{{title}}</h2><div class="description">{{description}}</div></div>', 
  proto.contains = function() {
    var uid, gm, latlng, mapBounds = this.map.getBounds(), GMaps = google.maps, sw = mapBounds.getSouthWest(), ne = mapBounds.getNorthEast(), bounds = new GMaps.LatLngBounds(), geoMarkers = this.geoMarkers, ids = document.getElementById("identities")._ids || {};
    sw = this.fromLatLngToContainerPixel(sw), sw = this.fromContainerPixelToLatLng(new GMaps.Point(sw.x + 50, sw.y)), 
    bounds.extend(sw), bounds.extend(ne);
    for (uid in geoMarkers) gm = geoMarkers[uid], latlng = gm.getPosition(), this.containsOne(uid, latlng, bounds, ids);
    console.log("map zoom", this.map.getZoom());
  }, proto.containsOne = function(uid, latlng, bounds, ids, b) {
    bounds || (bounds = this.map.getBounds()), ids || (ids = document.getElementById("identities")._ids || {}), 
    bounds.contains(latlng) && (b = ids[uid]) ? this.showTipline(uid, b) : this.hideTipline(uid);
  }, proto.hideTiplines = function() {
    var uid, tls = this.tiplines;
    for (uid in tls) this.hideTipline(uid);
  }, proto.updateTipline = function(uid, latlng) {
    var tl = this.tiplines[uid];
    tl || (tl = this.tiplines[uid] = this.addTipline(uid)), latlng && this.containsOne(uid, tl._lastlatlng = latlng);
  }, proto.addTipline = function() {
    var tl = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    return tl.setAttribute("fill", "none"), tl.setAttribute("stroke", "#b2b2b2"), tl.setAttribute("stroke-width", 1), 
    tl.setAttribute("stroke-linecap", "round"), tl.setAttribute("stroke-linejoin", "round"), 
    tl.setAttribute("style", "-webkit-filter: drop-shadow(12px 12px 7px rgba(0,0,0,0.5));"), 
    tl.setAttributeNS(null, "display", "none"), this.svgLayer.appendChild(tl), tl;
  }, proto.showTipline = function(uid, bound) {
    var p, tl = this.tiplines[uid];
    if (tl) {
      var f = [ bound[1], bound[2] ], s = [ f[0] + 13, f[1] ], points = [ f.join(","), s.join(",") ].join(" "), p = this.fromLatLngToContainerPixel(tl._lastlatlng);
      tl.setAttribute("points", points + " " + p.x + "," + p.y), tl.setAttributeNS(null, "display", "block");
    }
  }, proto.hideTipline = function(uid) {
    var tl = this.tiplines[uid];
    tl && tl.setAttributeNS(null, "display", "none");
  }, proto.updateGeoLocation = function(uid, position) {
    var latlng, gps, geoLocation = this.geoLocation;
    if (!geoLocation) {
      geoLocation = this.geoLocation = new google.maps.Marker({
        map: this.map,
        zIndex: MAX_INDEX - 1,
        visible: !0,
        animation: 2,
        icon: this.icons.arrowGrey,
        shape: {
          type: "rect",
          rect: [ 0, 0, 20, 20 ]
        },
        optimized: !1
      }), geoLocation._status = 0;
      var lastlatlng = JSON.parse(window.localStorage.getItem("position"));
      lastlatlng && (gps = lastlatlng.gps, geoLocation._status = 1, latlng = this.toLatLng(1 * gps[0] + this.latOffset, 1 * gps[1] + this.lngOffset), 
      geoLocation.setPosition(latlng), this.map.setZoom(15), this.map.panTo(latlng));
    }
    position && (gps = position.gps, latlng = this.toLatLng(1 * gps[0] + this.latOffset, 1 * gps[1] + this.lngOffset), 
    geoLocation.setIcon(this.icons.arrowBlue), geoLocation.setPosition(latlng), 2 !== geoLocation._status && (this.map.setZoom(15), 
    this.map.panTo(latlng)), geoLocation._status = 2, uid && position && this.updatePositions({
      id: uid + "",
      positions: [ position ]
    })), uid && (this.updated[uid] = position || lastlatlng), geoLocation._uid = uid;
  }, proto.switchGEOStyle = function(status) {
    var geoLocation = this.geoLocation;
    geoLocation && geoLocation.setIcon(this.icons["arrow" + (status ? "Blue" : "Grey")]);
  }, RoutexMaps;
}), define("maplabel", function() {
  function Label(opt_options) {
    this.setValues(opt_options);
    var span = this.span_ = document.createElement("span");
    span.className = "text-label", span.style.cssText = "position: relative; left: -46%; top: -23px;white-space: nowrap;padding: 2px;";
    var div = this.div_ = document.createElement("div");
    div.appendChild(span), div.style.cssText = "position: absolute; display: none";
  }
  return Label.prototype = new google.maps.OverlayView(), Label.prototype.onAdd = function() {
    var pane = this.getPanes().overlayImage;
    pane.appendChild(this.div_);
    var me = this;
    this.listeners_ = [ google.maps.event.addListener(this, "position_changed", function() {
      me.draw();
    }), google.maps.event.addListener(this, "text_changed", function() {
      me.draw();
    }), google.maps.event.addListener(this, "zindex_changed", function() {
      me.draw();
    }) ];
  }, Label.prototype.onRemove = function() {
    var marker = this.marker;
    marker && (marker.setMap(null), delete this.marker), this.div_.parentNode.removeChild(this.div_);
    for (var i = 0, I = this.listeners_.length; I > i; ++i) google.maps.event.removeListener(this.listeners_[i]);
  }, Label.prototype.draw = function() {
    var projection = this.getProjection(), latlng = this.marker ? this.marker.getPosition() : this.get("position"), position = projection.fromLatLngToDivPixel(latlng), div = this.div_;
    div.style.left = position.x + "px", div.style.top = position.y + "px", div.style.display = "block", 
    div.style.zIndex = this.get("zIndex"), this.span_.innerHTML = "" + this.get("text");
  }, Label;
}), define("infobox", function() {
  function InfoBox(opt_opts) {
    opt_opts = opt_opts || {}, google.maps.OverlayView.apply(this, arguments), this.content_ = opt_opts.content || "", 
    this.disableAutoPan_ = opt_opts.disableAutoPan || !1, this.maxWidth_ = opt_opts.maxWidth || 0, 
    this.pixelOffset_ = opt_opts.pixelOffset || new google.maps.Size(0, 0), this.position_ = opt_opts.position || new google.maps.LatLng(0, 0), 
    this.zIndex_ = opt_opts.zIndex || null, this.leftBoundary = opt_opts.leftBoundary || 0, 
    this.events = opt_opts.events || function() {}, this.boxClass_ = opt_opts.boxClass || "infoBox", 
    this.boxId_ = opt_opts.boxId || "infobox", this.boxStyle_ = opt_opts.boxStyle || {}, 
    this.closeBoxMargin_ = opt_opts.closeBoxMargin || "2px", this.closeBoxURL_ = opt_opts.closeBoxURL || "http://www.google.com/intl/en_us/mapfiles/close.gif", 
    "" === opt_opts.closeBoxURL && (this.closeBoxURL_ = ""), this.infoBoxClearance_ = opt_opts.infoBoxClearance || new google.maps.Size(1, 1), 
    opt_opts.visible === void 0 && (opt_opts.visible = opt_opts.isHidden === void 0 ? !0 : !opt_opts.isHidden), 
    this.isHidden_ = !opt_opts.visible, this.alignBottom_ = opt_opts.alignBottom || !1, 
    this.pane_ = opt_opts.pane || "floatPane", this.enableEventPropagation_ = opt_opts.enableEventPropagation || !1, 
    this.div_ = null, this.closeListener_ = null, this.moveListener_ = null, this.contextListener_ = null, 
    this.eventListeners_ = null, this.fixedWidthSet_ = null;
  }
  return InfoBox.prototype = new google.maps.OverlayView(), InfoBox.prototype.createInfoBoxDiv_ = function() {
    var i, events, bw, me = this, cancelHandler = function(e) {
      e.cancelBubble = !0, e.stopPropagation && e.stopPropagation();
    }, ignoreHandler = function(e) {
      e.returnValue = !1, e.preventDefault && e.preventDefault(), me.enableEventPropagation_ || cancelHandler(e);
    };
    if (!this.div_) {
      if (this.div_ = document.createElement("div"), this.setBoxStyle_(), this.content_.nodeType === void 0 ? this.div_.innerHTML = this.getCloseBoxImg_() + this.content_ : (this.div_.innerHTML = this.getCloseBoxImg_(), 
      this.div_.appendChild(this.content_)), this.getPanes()[this.pane_].appendChild(this.div_), 
      this.addClickHandler_(), this.div_.style.width ? this.fixedWidthSet_ = !0 : 0 !== this.maxWidth_ && this.div_.offsetWidth > this.maxWidth_ ? (this.div_.style.width = this.maxWidth_, 
      this.div_.style.overflow = "auto", this.fixedWidthSet_ = !0) : (bw = this.getBoxWidths_(), 
      this.div_.style.width = this.div_.offsetWidth - bw.left - bw.right + "px", this.fixedWidthSet_ = !1), 
      this.panBox_(this.disableAutoPan_), !this.enableEventPropagation_) {
        for (this.eventListeners_ = [], events = [ "mousedown", "mouseover", "mouseout", "mouseup", "click", "dblclick", "touchstart", "touchend", "touchmove" ], 
        i = 0; events.length > i; i++) this.eventListeners_.push(google.maps.event.addDomListener(this.div_, events[i], cancelHandler));
        this.eventListeners_.push(google.maps.event.addDomListener(this.div_, "mouseover", function() {
          this.style.cursor = "default";
        }));
      }
      this.contextListener_ = google.maps.event.addDomListener(this.div_, "contextmenu", ignoreHandler), 
      google.maps.event.trigger(this, "domready");
    }
  }, InfoBox.prototype.getCloseBoxImg_ = function() {
    var img = "";
    return "" !== this.closeBoxURL_ && (img = "<img", img += " src='" + this.closeBoxURL_ + "'", 
    img += " align=right", img += " style='", img += " position: relative;", img += " cursor: pointer;", 
    img += " margin: " + this.closeBoxMargin_ + ";", img += "'>"), img;
  }, InfoBox.prototype.addClickHandler_ = function() {
    var closeBox;
    "" !== this.closeBoxURL_ ? (closeBox = this.div_.firstChild, this.closeListener_ = google.maps.event.addDomListener(closeBox, "click", this.getCloseClickHandler_())) : this.closeListener_ = null;
  }, InfoBox.prototype.getCloseClickHandler_ = function() {
    var me = this;
    return function(e) {
      e.cancelBubble = !0, e.stopPropagation && e.stopPropagation(), google.maps.event.trigger(me, "closeclick"), 
      me.close();
    };
  }, InfoBox.prototype.panBox_ = function(disablePan) {
    var map, bounds, xOffset = 0, yOffset = 0;
    if (!disablePan && (map = this.getMap(), map instanceof google.maps.Map)) {
      bounds = map.getBounds(), bounds.contains(this.position_) || map.setCenter(this.position_);
      var mapDiv = map.getDiv(), mapWidth = mapDiv.offsetWidth, mapHeight = mapDiv.offsetHeight, iwOffsetX = this.pixelOffset_.width, iwOffsetY = this.pixelOffset_.height, iwWidth = this.div_.offsetWidth, iwHeight = this.div_.offsetHeight, padX = this.infoBoxClearance_.width, padY = this.infoBoxClearance_.height, pixPosition = this.getProjection().fromLatLngToContainerPixel(this.position_), leftBoundary = this.leftBoundary;
      -iwOffsetX + padX + leftBoundary > pixPosition.x ? xOffset = pixPosition.x + iwOffsetX - padX - leftBoundary : pixPosition.x + iwWidth + iwOffsetX + padX > mapWidth && (xOffset = pixPosition.x + iwWidth + iwOffsetX + padX - mapWidth + 10), 
      this.alignBottom_ ? -iwOffsetY + padY + iwHeight > pixPosition.y ? yOffset = pixPosition.y + iwOffsetY - padY - iwHeight : pixPosition.y + iwOffsetY + padY > mapHeight && (yOffset = pixPosition.y + iwOffsetY + padY - mapHeight) : -iwOffsetY + padY > pixPosition.y ? yOffset = pixPosition.y + iwOffsetY - padY : pixPosition.y + iwHeight + iwOffsetY + padY > mapHeight && (yOffset = pixPosition.y + iwHeight + iwOffsetY + padY - mapHeight), 
      (0 !== xOffset || 0 !== yOffset) && (map.getCenter(), map.panBy(xOffset, yOffset));
    }
  }, InfoBox.prototype.setBoxStyle_ = function() {
    var i, boxStyle;
    if (this.div_) {
      this.div_.className = this.boxClass_, this.div_.id = this.boxId_, this.div_.style.cssText = "", 
      boxStyle = this.boxStyle_;
      for (i in boxStyle) boxStyle.hasOwnProperty(i) && (this.div_.style[i] = boxStyle[i]);
      this.div_.style.opacity !== void 0 && "" !== this.div_.style.opacity && (this.div_.style.filter = "alpha(opacity=" + 100 * this.div_.style.opacity + ")"), 
      this.div_.style.position = "absolute", this.div_.style.visibility = "hidden", null !== this.zIndex_ && (this.div_.style.zIndex = this.zIndex_);
    }
  }, InfoBox.prototype.getBoxWidths_ = function() {
    var computedStyle, bw = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    }, box = this.div_;
    return document.defaultView && document.defaultView.getComputedStyle ? (computedStyle = box.ownerDocument.defaultView.getComputedStyle(box, ""), 
    computedStyle && (bw.top = parseInt(computedStyle.borderTopWidth, 10) || 0, bw.bottom = parseInt(computedStyle.borderBottomWidth, 10) || 0, 
    bw.left = parseInt(computedStyle.borderLeftWidth, 10) || 0, bw.right = parseInt(computedStyle.borderRightWidth, 10) || 0)) : document.documentElement.currentStyle && box.currentStyle && (bw.top = parseInt(box.currentStyle.borderTopWidth, 10) || 0, 
    bw.bottom = parseInt(box.currentStyle.borderBottomWidth, 10) || 0, bw.left = parseInt(box.currentStyle.borderLeftWidth, 10) || 0, 
    bw.right = parseInt(box.currentStyle.borderRightWidth, 10) || 0), bw;
  }, InfoBox.prototype.onRemove = function() {
    this.div_ && (this.div_.parentNode.removeChild(this.div_), this.div_ = null);
  }, InfoBox.prototype.draw = function() {
    this.createInfoBoxDiv_();
    var pixPosition = this.getProjection().fromLatLngToDivPixel(this.position_);
    this.div_.style.left = pixPosition.x + this.pixelOffset_.width + "px", this.alignBottom_ ? this.div_.style.bottom = -(pixPosition.y + this.pixelOffset_.height) + "px" : this.div_.style.top = pixPosition.y + this.pixelOffset_.height + "px", 
    this.div_.style.visibility = this.isHidden_ ? "hidden" : "visible", this.events && this.events();
  }, InfoBox.prototype.setOptions = function(opt_opts) {
    opt_opts.boxClass !== void 0 && (this.boxClass_ = opt_opts.boxClass, this.setBoxStyle_()), 
    opt_opts.boxStyle !== void 0 && (this.boxStyle_ = opt_opts.boxStyle, this.setBoxStyle_()), 
    opt_opts.content !== void 0 && this.setContent(opt_opts.content), opt_opts.disableAutoPan !== void 0 && (this.disableAutoPan_ = opt_opts.disableAutoPan), 
    opt_opts.maxWidth !== void 0 && (this.maxWidth_ = opt_opts.maxWidth), opt_opts.pixelOffset !== void 0 && (this.pixelOffset_ = opt_opts.pixelOffset), 
    opt_opts.alignBottom !== void 0 && (this.alignBottom_ = opt_opts.alignBottom), opt_opts.position !== void 0 && this.setPosition(opt_opts.position), 
    opt_opts.zIndex !== void 0 && this.setZIndex(opt_opts.zIndex), opt_opts.closeBoxMargin !== void 0 && (this.closeBoxMargin_ = opt_opts.closeBoxMargin), 
    opt_opts.closeBoxURL !== void 0 && (this.closeBoxURL_ = opt_opts.closeBoxURL), opt_opts.infoBoxClearance !== void 0 && (this.infoBoxClearance_ = opt_opts.infoBoxClearance), 
    opt_opts.isHidden !== void 0 && (this.isHidden_ = opt_opts.isHidden), opt_opts.visible !== void 0 && (this.isHidden_ = !opt_opts.visible), 
    opt_opts.enableEventPropagation !== void 0 && (this.enableEventPropagation_ = opt_opts.enableEventPropagation), 
    this.div_ && this.draw();
  }, InfoBox.prototype.setContent = function(content) {
    this.content_ = content, this.div_ && (this.closeListener_ && (google.maps.event.removeListener(this.closeListener_), 
    this.closeListener_ = null), this.fixedWidthSet_ || (this.div_.style.width = ""), 
    content.nodeType === void 0 ? this.div_.innerHTML = this.getCloseBoxImg_() + content : (this.div_.innerHTML = this.getCloseBoxImg_(), 
    this.div_.appendChild(content)), this.fixedWidthSet_ || (this.div_.style.width = this.div_.offsetWidth + "px", 
    content.nodeType === void 0 ? this.div_.innerHTML = this.getCloseBoxImg_() + content : (this.div_.innerHTML = this.getCloseBoxImg_(), 
    this.div_.appendChild(content))), this.addClickHandler_()), google.maps.event.trigger(this, "content_changed");
  }, InfoBox.prototype.setPosition = function(latlng) {
    this.position_ = latlng, this.div_ && this.draw(), google.maps.event.trigger(this, "position_changed");
  }, InfoBox.prototype.setZIndex = function(index) {
    this.zIndex_ = index, this.div_ && (this.div_.style.zIndex = index), google.maps.event.trigger(this, "zindex_changed");
  }, InfoBox.prototype.setVisible = function(isVisible) {
    this.isHidden_ = !isVisible, this.div_ && (this.div_.style.visibility = this.isHidden_ ? "hidden" : "visible");
  }, InfoBox.prototype.getContent = function() {
    return this.content_;
  }, InfoBox.prototype.getPosition = function() {
    return this.position_;
  }, InfoBox.prototype.getZIndex = function() {
    return this.zIndex_;
  }, InfoBox.prototype.getVisible = function() {
    var isVisible;
    return isVisible = this.getMap() === void 0 || null === this.getMap() ? !1 : !this.isHidden_;
  }, InfoBox.prototype.show = function() {
    this.isHidden_ = !1, this.div_ && (this.div_.style.visibility = "visible");
  }, InfoBox.prototype.hide = function() {
    this.isHidden_ = !0, this.div_ && (this.div_.style.visibility = "hidden");
  }, InfoBox.prototype.open = function(map, anchor) {
    var me = this;
    anchor && (this.position_ = anchor.getPosition(), this.moveListener_ = google.maps.event.addListener(anchor, "position_changed", function() {
      me.setPosition(this.getPosition());
    })), this.setMap(map), this.div_ && this.panBox_();
  }, InfoBox.prototype.close = function() {
    var i;
    if (this.closeListener_ && (google.maps.event.removeListener(this.closeListener_), 
    this.closeListener_ = null), this.eventListeners_) {
      for (i = 0; this.eventListeners_.length > i; i++) google.maps.event.removeListener(this.eventListeners_[i]);
      this.eventListeners_ = null;
    }
    this.moveListener_ && (google.maps.event.removeListener(this.moveListener_), this.moveListener_ = null), 
    this.contextListener_ && (google.maps.event.removeListener(this.contextListener_), 
    this.contextListener_ = null), this.setMap(null);
  }, InfoBox;
}), define("mobilemiddleware", function(require, exports, module) {
  "use strict";
  var iPhone = navigator.userAgent.match(/iPhone/);
  module.exports = {
    setHtmlHeight: function(req, res, next) {
      setTimeout(function() {
        window.scrollTo(0, 0);
      }, 0), iPhone || $("#app-main").addClass("app-box");
      var html = document.documentElement, height = window.innerHeight, app = req.app;
      height >= 444 ? height = 508 : 356 >= height && (height = 420), app.screen = {
        width: 320,
        height: height,
        ios: 420 >= height ? "iphone4" : ""
      }, html.style.minHeight = height + "px", next();
    },
    checkStorageSupported: function(req, res, next) {
      try {
        var localStorage = window.localStorage;
        localStorage && (localStorage.setItem("storage", 0), localStorage.removeItem("storage"));
      } catch (err) {
        alert("EXFE cannot be used in private browsing mode.");
      }
      next();
    },
    cleanup: function(req, res, next) {
      delete req._data_, delete req.smsToken, $("#app-body").css("height", "auto"), $("#app-header").addClass("hide"), 
      $("#app-footer").removeClass("ft-bg");
      var switchPageCallback = req.switchPageCallback;
      switchPageCallback ? switchPageCallback() : $("#app-body .page").addClass("hide"), 
      delete req.switchPageCallback, next();
    },
    errorHandler: function(req, res) {
      req.error = {
        code: 404
      }, res.redirect("/");
    }
  };
}), define("mobilecontroller", function(require, exports, module) {
  "use strict";
  var Base = require("base"), Store = require("store"), TWEEN = require("tween"), _ENV_ = window._ENV_, api_url = _ENV_.api_url, apiv3_url = _ENV_.apiv3_url, app_scheme = _ENV_.app_scheme, app_prefix_url = app_scheme + "://crosses/", openExfe = (_ENV_.AMAP_KEY, 
  window.openExfe), Handlebars = require("handlebars"), $ = require("zepto"), util = require("util"), trim = util.trim, parseId = util.parseId, iPad = navigator.userAgent.match(/iPad/), Live = require("live"), escape = function(html, encode) {
    return html.replace(encode ? /&/g : /&(?!#?\w+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }, now = Date.now || function() {
    return new Date().getTime();
  }, hasWebkitTransform = "webkitTransform" in document.body.style, setCSSMatrix = function(e, m) {
    var d = 6 === m.length ? "" : "3d";
    e.style[hasWebkitTransform ? "webkitTransform" : "transform"] = "matrix" + d + "(" + m.join(",") + ")";
  }, getLiveCard = function() {
    var liveCard = Store.get("livecard");
    if (!liveCard) {
      var card = {
        id: "",
        name: "",
        avatar: "",
        bio: "",
        identities: []
      };
      liveCard = {
        card: card,
        latitude: "",
        longitude: "",
        accuracy: "",
        traits: []
      };
      var user = Store.get("user");
      user && (card.name = user.name, card.avatar = user.avatar_filename, card.bio = user.bio, 
      card.identities = user.identities), Store.set("livecard", liveCard);
    }
    return liveCard.card.id = "", liveCard;
  }, M4 = [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ], MCP0 = [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 128, 28, 0, 1 ], MCP1 = [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 128, 0, 0, 1 ], uuid = 0, guid = function() {
    return "Controller-" + uuid++;
  };
  exports = module.exports = {};
  var Controller = Base.extend({
    initialize: function(options) {
      this.cid = guid(), this.initOptions(options), this.parseElement(), this.init(), 
      Controller.caches[this.cid] = this;
    },
    parseElement: function() {
      var element = this.element, template = this.options.template;
      if (element ? this.element = element instanceof $ ? element : $(element) : template && (this.element = $(template)), 
      !this.element) throw "element is invalid";
      this.element.attr("data-page-id", this.cid);
    },
    initOptions: function(params) {
      this.setOptions(params);
      for (var k in params) "options" !== k && (this[k] = params[k]);
    },
    init: function() {},
    destory: function() {
      this.element.off(), this._destory();
    },
    _destory: function() {
      delete Controller.caches[this.cid], Controller.superclass.destory.call(this);
    },
    $: function(selector) {
      return this.element.find(selector);
    }
  });
  Controller.caches = [], exports.FooterController = Controller.extend({
    element: $("#app-footer"),
    init: function() {
      this.listen();
    },
    enableTimer: !0,
    listen: function() {
      var self = this, element = self.element;
      element.on("click.footer", ".web-version", function() {
        window.location.href = "/?ipad" + location.hash;
      }).on("click.footer", ".get-button button", function(e) {
        return e.preventDefault(), openExfe(), !1;
      }).on("keydown.footer", "#email", function(e) {
        if (13 === e.keyCode) {
          var email = self.$("#email").val();
          self.addNotificationIdentity(email);
        }
      }).on("click.footer", ".subscribe .btn_mail", function() {
        var email = trim(self.$("#email").val());
        self.addNotificationIdentity(email);
      }), this.on("show", function(screen, hasBanner, hasCross, hasError) {
        var top = screen.height - 96 - (hasBanner ? 60 : 0);
        this.element.removeClass("hide"), this.element.css({
          position: "relative",
          top: top + "px"
        }), this.$(".action").addClass("hide"), this.$(".get-button").removeClass("hide"), 
        iPad && this.$(".web-version").removeClass("hide"), this.$(".error-info").toggleClass("hide", !hasError);
      }), this.on("reset-position", function() {
        var top = App.screen.height - 96;
        this.element.removeClass("hide"), this.element.css({
          position: "absolute",
          top: top + "px"
        }), this.$(".action").addClass("hide"), this.$(".get-button").removeClass("hide"), 
        iPad && this.$(".web-version").removeClass("hide");
      }), this.on("show-from-cross", function(exfee_id, token, read_only) {
        this.element.css({
          position: "relative",
          top: 0
        }), this.element.addClass("ft-bg"), this.cross = {
          exfee_id: exfee_id,
          token: token
        }, this.$(".actions").addClass("action-cross"), this.$(".action").addClass("hide"), 
        read_only || this.$(".subscribe").removeClass("hide"), this.element.removeClass("hide"), 
        $("#app-footer").addClass("ft-bg"), this.$(".get-button").removeClass("hide"), iPad && this.$(".web-version").removeClass("hide");
      }), this.on("redirect", function(args, cb) {
        window.launchApp(app_prefix_url + args, cb);
      });
    },
    addNotificationIdentity: function(email, exfee_id, token) {
      exfee_id = this.cross.exfee_id, token = this.cross.token;
      var identity = parseId(email);
      return identity && "email" !== identity.provider ? ($("#email.email").attr("placeholder", "Bad email Address."), 
      void 0) : ($.ajax({
        type: "POST",
        url: api_url + "/Exfee/" + exfee_id + "/AddNotificationIdentity" + "?token=" + token,
        data: {
          provider: identity.provider,
          external_username: identity.external_username
        },
        success: function(data) {
          data && data.meta && 200 === data.meta.code && $(".subscribe").hide();
        },
        error: function() {
          alert("Failed, please retry later.");
        }
      }), void 0);
    }
  }), exports.VerifyController = Controller.extend({
    init: function() {
      this.render(), this.listen();
    },
    render: function() {
      $("#app-verify").remove(), this.element.appendTo($("#app-body"));
    },
    listen: function() {
      var self = this, resolveToken = this.resolveToken;
      this.on("show", function(req, res) {
        setTimeout(function() {
          window.scrollTo(0, 0);
        }, 14);
        var cb = function() {
          req.error = !0, res.redirect("/");
        };
        this.element.removeClass("hide"), $("#app-body").css("height", "100%");
        var user = Store.get("tmp-user");
        if (user) {
          for (var identities = user.identities, i = 0, len = identities.length; len > i; ++i) {
            var identity = identities[i];
            if (identity.id === resolveToken.identity_id) {
              self.showIdentity(identity), self.$(".done-info").removeClass("hide");
              break;
            }
          }
          return Store.remove("tmp-user"), Store.remove("tmp-token"), App.controllers.footer.emit("reset-position"), 
          void 0;
        }
        var done = function(args) {
          App.controllers.footer.emit("redirect", args, function() {
            var search = window.search.substr(1);
            search && (search = "&" + search), window.location = "/?redirect" + search + window.location.hash;
          });
        }, user_id = resolveToken.user_id, token = resolveToken.token;
        $.ajax({
          type: "POST",
          url: api_url + "/Users/" + user_id + "?token=" + token,
          data: {
            token: token
          },
          success: function(data) {
            var meta = data.meta;
            if (meta && 200 === meta.code) for (var user = data.response.user, identities = user.identities, i = 0, len = identities.length; len > i; ++i) {
              var identity = identities[i];
              if (identity.id === resolveToken.identity_id) {
                if (self.showIdentity(identity), self.$(".done-info").removeClass("hide"), Store.set("tmp-user", user), 
                App.controllers.footer.emit("reset-position"), user_id && token) {
                  var args = "?token=" + token + "&user_id=" + user_id + "&identity_id=" + identity.id;
                  done(args);
                }
                break;
              }
            } else cb();
          },
          error: function() {
            cb();
          }
        });
      });
    },
    showIdentity: function(identity) {
      var $identity = this.$(".identity");
      $identity.find(".name").text(identity.name), $identity.find(".avatar").attr("src", identity.avatar_filename);
    }
  }), exports.SetPasswordController = Controller.extend({
    init: function() {
      this.render(), this.listen();
    },
    render: function() {
      $("#app-setpassword").remove(), this.element.appendTo($("#app-body"));
    },
    submitPassword: function() {
      var self = this, token = this.token, $button = this.$(".set-button button"), $error = this.$(".error-info"), $name = this.$("#name"), $pass = this.$("#password"), name = trim($name.val()), password = $pass.val();
      password.length >= 4 ? ($button.addClass("disabled").prop("disabled", !0), $.ajax({
        type: "POST",
        url: api_url + "/Users/ResetPassword",
        data: {
          token: token,
          name: name,
          password: password
        },
        success: function(data) {
          var meta = data.meta;
          if (meta && 200 === meta.code) {
            $name.blur(), $pass.blur(), self.$(".password").addClass("hide"), self.$(".done-info").removeClass("hide"), 
            $error.html("").addClass("hide"), $button.parent().addClass("hide");
            var authorization = data.response.authorization;
            authorization && App.controllers.footer.emit("redirect", "?token=" + authorization.token + "&user_id=" + authorization.user_id, function() {
              var search = window.location.search.substr(1);
              search && (search = "&" + search), window.location = "/?redirect" + search + window.location.hash;
            });
          } else 401 === meta.code && ($error.html('<span class="t">Token expired.</span> Please request to reset password again.').removeClass("hide"), 
          $pass.prop("disabled", !0), $button.parent().addClass("hide"));
          $button.prop("disabled", !0);
        },
        error: function() {
          $error.html("Failed to set password. Please try later.").removeClass("hide"), $button.prop("disabled", !1);
        }
      })) : $error.html("Password must be longer than four!").removeClass("hide");
    },
    listen: function() {
      var TST, TOUCH_TIMEOUT, self = this, element = this.element, resolveToken = this.resolveToken;
      element.on("touchstart.setpassword", ".pass", function() {
        TOUCH_TIMEOUT && (clearTimeout(TOUCH_TIMEOUT), TOUCH_TIMEOUT = void 0), TST = now();
        var $input = $(this).prev();
        $input.prop("type", "password");
      }).on("touchend.setpassword", ".pass", function(e) {
        if (now() - TST > 300) {
          var $input = $(this).prev();
          $input.prop("type", "text"), TOUCH_TIMEOUT = setTimeout(function() {
            $input.prop("type", "password");
          }, 500);
        }
        return e.preventDefault(), e.stopPropagation(), !1;
      }).on("keydown.setpassword", "#password", function(e) {
        13 === e.keyCode ? self.submitPassword() : self.$(".error-info").html("");
      }).on("touchstart.setpassword", ".set-button button", function() {
        self.submitPassword();
      }), this.on("show", function(req, res) {
        setTimeout(function() {
          window.scrollTo(0, 0);
        }, 0);
        var cb = function() {
          req.error = !0, res.redirect("/");
        };
        element.removeClass("hide"), $("#app-body").css("height", "100%");
        var user = Store.get("tmp-user");
        return user ? ($(".identity .avatar").attr("src", user.avatar_filename), $(".identity .name").html(user.name), 
        window.noExfeApp && ($(".password").addClass("hide"), $(".set-button").addClass("hide"), 
        $(".done-info").removeClass("hide")), App.controllers.footer.emit("reset-position"), 
        Store.remove("tmp-user"), Store.remove("tmp-token"), void 0) : ($.ajax({
          type: "POST",
          url: api_url + "/Users/" + resolveToken.user_id + "?token=" + resolveToken.token,
          data: {
            token: resolveToken.token
          },
          success: function(data) {
            var user = data.response.user;
            return data && data.meta && 200 === data.meta.code ? ($(".identity .avatar").attr("src", user.avatar_filename), 
            $(".identity .name").html(user.name), Store.set("tmp-user", user), App.controllers.footer.emit("reset-position"), 
            void 0) : (cb(), void 0);
          },
          error: function() {
            cb();
          }
        }), void 0);
      });
    }
  }), exports.HomeController = Controller.extend({
    init: function() {
      this.render(), this.listen();
    },
    render: function() {
      $("#app-home").length || this.element.appendTo($("#app-body"));
    },
    listen: function() {
      var self = this, element = this.element;
      element.on("touchstart.home", "#home-card", function() {
        self.stopAnimate(), self.emit("goto-live");
      }), this.on("goto-live", function() {
        App.request.switchPageCallback = function() {
          element.addClass("hide");
        }, App.response.redirect("/#live");
      }), this.on("show", function(screen, error) {
        var h = screen.height;
        this.$(".logo-box .inner").css("top", (h - 300) / 2 + "px"), element.removeClass("hide"), 
        MCP1[13] = (h - 64) / 2, this.setHomeCard(MCP1), error = !(!error || 404 !== error.code);
        var $title = this.$(".title");
        $title.find(".normal").removeClass("hide"), error && setTimeout(function() {
          alert("Sorry. Your link is invalid or expired. Requested page was not found.");
        }, 14), this.$("#home-card").css("display", "none");
      });
    },
    setHomeCard: function(m4) {
      var liveCard = getLiveCard(), card = liveCard.card, name = card.name, avatar = card.avatar, $homeCard = this.$("#home-card");
      setCSSMatrix($homeCard[0], m4), card && (name || avatar) ? (avatar || (avatar = name ? api_url + "/avatar/default?name=" + name : "/static/img/portrait_default.png"), 
      avatar = "url(" + avatar + ")") : avatar = "", $homeCard.find(".avatar").css("background-image", avatar);
    },
    aopts: {
      o: 1
    },
    createAnimate: function() {
      var aopts = this.aopts, logo = document.getElementById("big-logo"), card = document.getElementById("home-card"), update = function() {
        logo.style.opacity = aopts.o, card.style.opacity = 1 - aopts.o;
      };
      this._a = new TWEEN.Tween(aopts).delay(1377).to({
        o: 0
      }, 1377).easing(TWEEN.Easing.Cubic.InOut).onUpdate(update), this._b = new TWEEN.Tween(aopts).delay(1377).to({
        o: 1
      }, 1377).easing(TWEEN.Easing.Cubic.InOut).onUpdate(update);
    },
    startAnimate: function() {
      this._a || this._b || this.createAnimate(), this._a.chain(this._b), this._b.chain(this._a), 
      this._a.start();
    },
    stopAnimate: function() {
      var aopts = this.aopts, logo = document.getElementById("big-logo"), card = document.getElementById("home-card");
      this._a.chain(), this._b.chain(), this._b.stop(), this._a.stop(), aopts.o = logo.style.opacity = 1, 
      card.style.opacity = 0;
    }
  }), exports.CrossController = Controller.extend({
    init: function() {
      this.render(), this.listen();
    },
    render: function() {
      $("#app-cross").remove(), this.element.appendTo($("#app-body"));
    },
    listen: function() {
      var self = this, element = this.element, token = this.token, cross = this.cross, $rsvp_toolbar = self.$(".rsvp_toolbar");
      element.on("touchstart.cross", ".portrait.me", function() {
        $rsvp_toolbar.toggleClass("rsvp_toolbar_off", !$rsvp_toolbar.hasClass("rsvp_toolbar_off"));
      }).on("touchstart.cross", ".changename", function() {
        var name = prompt("Change my display name:");
        name ? $.ajax({
          type: "POST",
          url: api_url + "/Identities/" + cross.identity.id + "/Update" + "?token=" + token,
          data: {
            name: name
          },
          success: function(data) {
            data && data.meta && 200 === data.meta.code && self.$(".name_me").html(escape(data.response.identity.name));
          },
          error: function() {
            alert("Failed, please retry later.");
          }
        }) : alert("Display name cannot be empty.");
      }).on("touchstart.cross", ".rsvp.accepted, .rsvp.unavailable", function() {
        var type = $(this).hasClass("accepted") ? "ACCEPTED" : "DECLINED";
        self.rsvp(type);
      }).on("touchstart.cross", ".inf_area .description", function() {
        var $t = $(this), clickable = $t.hasClass("clickable");
        if (clickable) {
          var limit = $t.hasClass("limit");
          $t.toggleClass("limit", !limit), $t.find(".xbtn-more .rb").toggleClass("hidden", limit), 
          $t.find(".xbtn-more .lt").toggleClass("hidden", !limit);
        }
      }), this.on("show", function() {
        element.removeClass("hide");
        var $desc = this.$(".inf_area .description");
        $desc.height() > 130 && ($desc.addClass("limit clickable"), $desc.find(".xbtn-more").removeClass("hide"), 
        $desc.find(".xbtn-more .rb").removeClass("hidden"));
      });
    },
    rsvp: function(status) {
      var id = this.cross.identity.id, exfee_id = this.exfee_id, token = this.token, data = [ {
        rsvp_status: status,
        identity_id: id,
        by_identity_id: id
      } ];
      this.$(".rsvp_toolbar").addClass("rsvp_toolbar_off");
      var $rsvpMe = this.$(".portrait_rsvp_me").removeClass("accepted declined pending");
      switch (status) {
       case "ACCEPTED":
        $rsvpMe.addClass("accepted");
        break;

       case "DECLINED":
        $rsvpMe.addClass("declined");
        break;

       default:
        $rsvpMe.addClass("pending");
      }
      $.ajax({
        type: "post",
        url: api_url + "/Exfee/" + exfee_id + "/Rsvp?token=" + token,
        data: {
          rsvp: JSON.stringify(data)
        },
        success: function() {},
        error: function() {
          alert("RSVP failed!");
        }
      });
    }
  }), exports.LiveController = Controller.extend({
    init: function() {
      this.render(), this.listen();
    },
    render: function() {
      $("#app-live").length ? this.element = $("#app-live") : this.element.appendTo($("#app-body"));
    },
    listen: function() {
      var TOUCH_TIMEOUT, TOUCH_TIME, self = this, element = this.element;
      element.on("touchstart.live", "#card-name", function(e) {
        e.stopPropagation(), setTimeout(function() {
          window.scrollTo(0, 0);
        }, 0), this.focus();
      }).on("touchend.live", ".live-form", function(e) {
        e.stopPropagation(), $(e.target).hasClass("live-form") && (element.find(".input-item").blur(), 
        App.response.redirect("/"));
      }).on("keydown.live", "#card-name", function(e) {
        var k = e.keyCode, v = trim(this.value);
        v && 13 === k && self.addEmailOrPhone(this, v);
      }).on("blur.live", "#card-name", function() {
        var v = trim(this.value);
        v ? self.addEmailOrPhone(this, v) : self.setCardName(this);
      }).on("keydown.live blur.live", "#add-identity", function(e) {
        var k = e.keyCode, v = trim(this.value);
        (v && 13 === k || "blur" === e.type) && (self.addEmailOrPhone(this, v, !0), this.value = "");
      }).on("keydown.live blur.live", "#facebook-identity", function(e) {
        var k = e.keyCode, v = trim(this.value);
        (v && 13 === k || "blur" === e.type) && (v += "@facebook", self.addFacebook(this, v) && $("#add-identity-facebook").addClass("hide"), 
        this.value = "");
      }).on("touchstart.live", ".list .input-item", function() {
        $(this).next().removeClass("hidden");
      }).on("blur.live", ".list .input-item", function() {
        $(this).next().addClass("hidden"), self.updateIdentityLi(this);
      }).on("touchstart.live", ".list .delete", function() {
        var identity, input = $(this).prev()[0], v = trim(input.value), dp = input.getAttribute("data-provider"), isFacebook = "facebook" === dp;
        isFacebook && (v += "@facebook"), identity = parseId(v), $(this).parent().remove(), 
        identity && identity.provider && self.removeIdentity(identity), isFacebook && self.emit("show-add-facebook");
      }).on("touchstart.live", ".btn-start", function() {
        var $inputs = $(".list .input-item");
        $inputs.each(function() {
          self.updateIdentityLi(this);
        });
        var cardName = document.getElementById("card-name");
        cardName.blur();
        var v = trim(cardName.value);
        v ? self.liveCard.card.name = v : self.setCardName(cardName), setTimeout(function() {
          self.inspectFields() && (self.emit("post-card"), self.emit("live-gather"));
        }, 23);
      }).on("hold:live", ".live-gather .card .avatar", function() {
        var t = this, pe = t.parentNode, card = $(pe).data("card"), matrix = pe.style.transform || pe.style.webkitTransform, m = matrix.match(/([\-\d\.]+)/g).slice(1), tip = document.getElementById("card-tip"), html = "";
        if (card && card.identities) {
          for (var i = 0, l = card.identities.length; l > i; ++i) {
            var identity = card.identities[i], p = identity.provider, eu = identity.external_username, ps = "";
            "email" !== p && "phone" !== p && (p = p.substr(0, 1).toUpperCase() + p.substr(1), 
            ps = '<span class="provider">' + p + "</span>"), html += '<li><span class="external-username' + (ps ? "" : " normal") + '">' + eu + "</span>" + ps + "</li>";
          }
          tip.querySelector("ul").innerHTML = html;
          var h = tip.clientHeight, x = ~~m[12] - 68, y = ~~m[13] - (6 + h), ax = 93;
          0 > x ? x = 10 : x + 200 >= 320 && (x = 110), (10 === x || 110 === x) && (ax = ~~m[12] + 32 - 7 - x), 
          m[12] = x, m[13] = y - 5, m[14] = 7, setCSSMatrix(tip, m), tip.querySelector(".ang").style.left = ax + "px", 
          tip.querySelector(".bio").innerText = card.bio, tip.className = "card-tip";
        }
      }).on("touchstart.live", ".live-gather .card .avatar", function(e) {
        var $t = $(this), delta = 250, fingers = e.touches.length;
        TOUCH_TIME = now(), TOUCH_TIMEOUT && (clearTimeout(TOUCH_TIMEOUT), TOUCH_TIMEOUT = void 0), 
        1 === fingers && fingers >= 1 && (TOUCH_TIMEOUT = setTimeout(function() {
          $t.trigger("hold:live");
        }, delta));
      }).on("touchend.live", ".live-gather .card .avatar", function() {
        if (TOUCH_TIMEOUT && (clearTimeout(TOUCH_TIMEOUT), TOUCH_TIMEOUT = void 0), 250 > now() - TOUCH_TIME) {
          var $p = $(this).parent();
          $p.hasClass("card-me") || $p.toggleClass("selected");
        }
        document.getElementById("card-tip").className = "card-tip hidden";
      }).on("touchstart.live", ".back", function() {
        self.$(".live-gather").addClass("hide"), App.response.redirect("/");
      }).on("touchstart.live", ".live-gather", function(e) {
        var t = e.target, $h2 = $(".live-title h2"), h2 = $h2[0], has = $h2.hasClass("clicked");
        has && ($(".wave").css("opacity", 1), $h2.data("clicked", t === h2 || $.contains(h2, t)).removeClass("clicked"), 
        $(".live-tip").addClass("live-tip-close"));
      }).on("touchstart.live", ".live-title h2", function() {
        var $t = $(this), has = $t.hasClass("clicked"), clicked = $t.data("clicked");
        has || clicked || ($(this).addClass("clicked"), $(".wave").css("opacity", 0), $(".live-tip").removeClass("live-tip-close")), 
        $t.data("clicked", !1);
      }).on("touchstart.live", ".btn-confirm", function() {
        self.postContacts();
      }), this.on("show-add-email", function() {
        this.$("#add-identity").removeClass("hide");
      }), this.on("show-add-facebook", function() {
        this.$('.list input[data-provider="facebook"]').length || this.$("#add-identity-facebook").removeClass("hide");
      }), this.on("show", function(screen) {
        Live.startGeo(), this.screen = screen, $("#app-footer").addClass("hide"), this.element.removeClass("hide");
        var h = screen.height;
        MCP1[13] = (h - 64) / 2, setCSSMatrix(this.$("#icard")[0], MCP1), this.$(".live-form, .live-gahter").css("min-height", h), 
        this.$(".live-form").removeClass("hide"), this.$("#live-discover").css("opacity", 0), 
        this.$("#card-form").css({
          opacity: 0,
          "min-height": 100 * ((h - 100) / h) + "%"
        }), this.measurePositions(screen.width, screen.height - 10, 32, 32), this.MAPS = this._MAPS.slice(0), 
        this.$(".identities .list").empty(), this.liveCard = getLiveCard(), this.updateMyCardForm(), 
        this.startAnimate();
      }), this.on("post-card", function() {
        this.postMyCard();
      }), this.on("disabled-live-btn", function(type) {
        this.$(".btn-start").toggleClass("disabled", type);
      }), this.on("live-gather", function() {
        this.$(".live-form").addClass("hide"), this.$(".live-gather").removeClass("hide"), 
        this.$(".wave").addClass("start"), this.$(".live-gather").find(".card").remove();
        var card = this.liveCard.card, $me = this.genCard(card, this.coords[0][0], 0, 0, !0, this.screen.ios).appendTo(this.$(".live-gather"));
        this.updateCard($me[0], card), this._others && this.updateOthers();
      });
    },
    updateIdentityLi: function(elem) {
      var identity, eun = elem.getAttribute("data-external-username"), p = elem.getAttribute("data-provider"), n = elem.getAttribute("data-name"), empty = "", v = trim(elem.value), delable = !1, failed = !1, addable = !1;
      if (v) if ("facebook" === p && (v += "@facebook"), identity = parseId(v), identity && identity.provider) {
        var has = this.findIdentity(identity), isSelf = identity.provider === p && identity.external_username === eun;
        has && !isSelf && (elem.value = empty), has || isSelf || (addable = !0, delable = !0);
      } else failed = !0, delable = !0; else failed = !0, delable = !0;
      failed && (elem.setAttribute("data-name", empty), elem.setAttribute("data-external-username", empty), 
      elem.setAttribute("data-provider", empty), setTimeout(function() {
        alert("Invalid contact.");
      }, 14)), addable && (elem.setAttribute("data-name", identity.name), elem.setAttribute("data-external-username", identity.external_username), 
      elem.setAttribute("data-provider", identity.provider), elem.value = identity.external_username, 
      $(elem).prev().text(this.aliasProvider(identity.provider)), this.updateLiveCard(identity, "+")), 
      delable && this.updateLiveCard({
        name: n,
        external_username: eun,
        provider: p
      }, "-", !0), (delable || addable) && this.emit("post-card");
    },
    postContacts: function() {},
    inspectFields: function() {
      var card = this.liveCard.card;
      return card.name && card.identities.length;
    },
    updateCardName: function(card) {
      card.name && (this.liveCard.card.name = document.getElementById("card-name").value = card.name, 
      Store.set("livecard", this.liveCard));
    },
    updateMe: function(card) {
      var a1, icard = document.getElementById("icard"), a0 = icard.getAttribute("data-url");
      a0 !== card.avatar && (a1 = card.avatar, a1 || (a1 = card.name ? api_url + "/avatar/default?name=" + card.name : "/static/img/portrait_default.png"), 
      a0 !== a1 && (icard.querySelector(".avatar").style.backgroundImage = "url(" + a1 + ")", 
      icard.setAttribute("data-url", a1)));
      var bioDiv = document.getElementById("card-bio");
      card.bio && (bioDiv.innerText = card.bio), bioDiv.className = card.bio ? "" : "hide";
    },
    postMyCard: function() {
      Store.set("livecard", this.liveCard);
      var card = this.liveCard.card;
      card.name && card.identities.length && Live.init(card, $.proxy(this.liveCallback, this));
    },
    state: 1,
    liveCallback: function(result) {
      var liveCard = this.liveCard, myCard = result.me;
      1 === this.state && myCard && myCard.name && myCard.identities.length && (now() - myCard.timestamp > 6e4 && this.updateCardName(myCard), 
      this.updateMe(liveCard.card = myCard), Store.set("livecard", liveCard)), this._others = result.others, 
      this.updateOthers();
    },
    updateMyCardForm: function() {
      var len, liveCard = this.liveCard, card = liveCard.card, identities = card.identities;
      if (identities && (len = identities.length)) {
        this.updateCardName(card), this.updateMe(card), this.postMyCard(), identities = identities.slice(0);
        for (var identity, provider; identity = identities.shift(); ) provider = identity.provider, 
        ("email" === provider || "phone" === provider || "facebook" === provider) && this.addIdentity(identity, !0);
        this.emit("show-add-email"), this.emit("show-add-facebook");
      } else this.emit("disabled-live-btn", !0);
    },
    resetLiveCard: function() {
      this.emit("disabled-live-btn", !0), Store.clear("livecard"), this.liveCard = getLiveCard();
    },
    findIdentity: function(identity) {
      var card = this.liveCard.card, identities = card.identities, len = identities.length;
      if (len) for (var i = 0; len > i; ++i) {
        var id = identities[i];
        if (id.provider === identity.provider && id.external_username === identity.external_username) return !0;
      }
      return !1;
    },
    updateLiveCard: function(identity, operation, enable) {
      var card = this.liveCard.card, identities = card.identities;
      if ("+" === operation) identities.push(identity); else {
        for (var i = 0, len = identities.length; len > i; ++i) {
          var id = identities[i];
          if (id.provider === identity.provider && id.external_username === identity.external_username) {
            identities.splice(i, 1);
            break;
          }
        }
        enable || 0 !== identities.length || this.resetLiveCard();
      }
      Store.set("livecard", this.liveCard);
    },
    setCardName: function(elem) {
      var identities = this.packedIdentities();
      if (identities.length) {
        var identity = identities[0], name = "", eun = identity.external_username, provider = identity.provider;
        name = "phone" === provider ? "Anonym_" + eun.slice(eun.length - 4) : eun.split("@")[0], 
        this.liveCard.card.name = elem.value = name, elem.setAttribute("placeholder", "Name"), 
        $(elem).addClass("normal");
      }
    },
    addFacebook: function(elem, v) {
      var identity = parseId(v), provider = identity.provider;
      return provider && "facebook" === provider && !this.existsByIdentity(identity) ? (this.addIdentity(identity), 
      !0) : !1;
    },
    addEmailOrPhone: function(elem, v, status) {
      status = !status;
      var identity = parseId(v), provider = identity.provider;
      !provider || "email" !== provider && "phone" !== provider || this.existsByIdentity(identity) || (this.addIdentity(identity), 
      status && this.setCardName(elem)), status && (this.emit("show-add-email"), this.emit("show-add-facebook")), 
      this.emit("post-card");
    },
    aliasProvider: function(provider) {
      return "email" === provider ? provider = "Email" : "phone" === provider ? provider = "Mobile" : "facebook" === provider && (provider = "Facebook"), 
      provider;
    },
    genIdentity: function(identity) {
      var tmpl = Handlebars.compile($("#live-li-identity-tmpl").html()), provider = identity.provider;
      provider = this.aliasProvider(provider);
      var $li = $(tmpl({
        provider_alias: provider,
        identity: identity
      }));
      return $li;
    },
    resetCard: function() {
      this.state = 0, this.$("#icard").removeAttr("data-url").find(".avatar").css("background", ""), 
      this.$("#card-name").attr("placeholder", "Your email or mobile no.").removeClass("normal").val(""), 
      this.$("#add-identity").addClass("hide"), this.$("#add-identity-facebook").addClass("hide");
    },
    removeIdentity: function(identity) {
      var lis = this.$(".identities .list li");
      0 === lis.length ? (this.resetCard(), this.emit("disabled-live-btn", !0)) : "facebook" === identity.provider && this.emit("show-add-facebook"), 
      this.updateLiveCard(identity, "-"), this.emit("post-card");
    },
    addIdentity: function(identity, status) {
      status = !status, this.state = 1;
      var list = this.$(".identities .list"), li = this.genIdentity(identity);
      list.append(li), this.emit("disabled-live-btn", !1), status && (this.updateLiveCard(identity, "+"), 
      this.emit("post-card"));
    },
    packedIdentities: function() {
      for (var input, dp, v, identity, provider, inputs = this.$(".identities .list").find("input"), i = 0, len = inputs.length, identities = []; len > i; ++i) input = inputs.eq(i), 
      dp = input.attr("data-provider"), v = trim(inputs.eq(i).val()), v && ("facebook" === dp && (v += "@facebook"), 
      identity = parseId(v), provider = identity.provider, !provider || "email" !== provider && "phone" !== provider && "facebook" !== provider || identities.push(identity));
      return identities;
    },
    existsByIdentity: function(identity) {
      var id, identities = this.packedIdentities(), eun = identity.external_username, p = identity.provider;
      if (0 === identities.length) return !1;
      for (;id = identities.shift(); ) if (id.external_username === eun && id.provider === p) return !0;
      return !1;
    },
    coords: "".split(),
    _MAPS: [ [ 1, 0 ], [ 1, 1 ], [ 1, 2 ], [ 2, 0 ], [ 2, 1 ], [ 2, 2 ], [ 2, 3 ], [ 3, 0 ], [ 3, 1 ], [ 3, 2 ], [ 3, 3 ] ],
    MAPS: "".split(),
    measurePositions: function(w, h, l, t) {
      var coords = this.coords;
      coords[0] = [ [ .5 * w - l, .88 * h - t ] ], coords[1] = Array(3), coords[1][0] = [ .25 * w - 5 - l, .66 * h + 30 - t ], 
      coords[1][1] = [ .5 * w - l, .66 * h - t ], coords[1][2] = [ .75 * w + 5 - l, .66 * h + 30 - t ], 
      coords[2] = Array(4), coords[2][0] = [ .125 * w + 5 - l, .44 * h + 40 - t ], coords[2][1] = [ .375 * w - l, .44 * h - t ], 
      coords[2][2] = [ .625 * w - l, .44 * h - t ], coords[2][3] = [ .875 * w - 5 - l, .44 * h + 40 - t ], 
      coords[3] = Array(4), coords[3][0] = [ .125 * w - l, .22 * h + 40 - t ], coords[3][1] = [ .375 * w - l, .22 * h - t ], 
      coords[3][2] = [ .625 * w - l, .22 * h - t ], coords[3][3] = [ .875 * w - l, .22 * h + 40 - t ];
    },
    genCard: function(card, pos, g, i, isMe, ios) {
      var tmpl = Handlebars.compile($("#live-card-tmpl").html()), m = M4.slice(0);
      m[12] = pos[0], m[13] = pos[1];
      var $card = $(tmpl({
        g: g,
        i: i,
        matrix: m.join(","),
        "class": (isMe ? "card-me" : "card-other hide") + ("iphone4" === ios ? " card-iphone4" : ""),
        card: card
      }));
      return $card.data("card", card), $card;
    },
    addCard: function(card) {
      var MAPS = this.MAPS;
      if (!MAPS || 0 === MAPS.length) return !1;
      var gi = MAPS.shift(), g = gi[0], i = gi[1], pos = this.coords[g][i], $card = this.genCard(card, pos, g, i, !1, this.screen.ios), elem = $card[0], s = elem.style, m = M4.slice(0);
      m[0] = m[5] = 0, m[12] = pos[0], m[13] = pos[1], $card.data("card", card), this.$(".live-gather").append($card), 
      new TWEEN.Tween({
        o: 0
      }).to({
        o: 1
      }, 250).easing(TWEEN.Easing.Bounce.In).onStart(function() {
        setCSSMatrix(elem, m), $card.removeClass("hide");
      }).onUpdate(function() {
        s.opacity = this.o, m[0] = m[5] = this.o, setCSSMatrix(elem, m);
      }).onComplete(function() {
        TWEEN.remove(this);
      }).start();
    },
    delCard: function(elem) {
      var MAPS = this.MAPS, g = elem.getAttribute("data-g"), i = elem.getAttribute("data-i"), m = M4.slice(0), pos = this.coords[g][i], s = elem.style;
      m[12] = pos[0], m[13] = pos[1], new TWEEN.Tween({
        o: 1
      }).to({
        o: 0
      }, 250).easing(TWEEN.Easing.Bounce.Out).onUpdate(function() {
        s.opacity = this.o, setCSSMatrix(elem, m);
      }).onComplete(function() {
        MAPS.unshift([ g, i ]), elem.parentNode.removeChild(elem), TWEEN.remove(this);
      }).start();
    },
    updateCard: function(elem, card) {
      var a0 = elem.getAttribute("data-url"), a1 = "";
      a0 && a0 === card.avatar || (a1 = card.avatar, a1 || (a1 = card.name ? api_url + "/avatar/default?name=" + card.name : "/static/img/portrait_default.png"), 
      a0 !== a1 && (elem.querySelector(".avatar").style.backgroundImage = "url(" + a1 + ")", 
      elem.setAttribute("data-url", a1))), elem.querySelector(".name").innerText = card.name, 
      $(elem).data("card", card);
    },
    updateOthers: function() {
      for (var elem, id, k, card, cards = this._others, elems = document.querySelectorAll(".card-other"), len = elems.length, i = 0; len > i; ++i) elem = elems[i], 
      id = elem.getAttribute("id"), id in cards || this.delCard(elem);
      for (k in cards) card = cards[k], elem = document.getElementById(card.id), elem ? this.updateCard(elem, card) : this.addCard(card);
    },
    createAnimate: function() {
      var icard = this.$("#icard")[0], cardForm = this.$("#card-form")[0], discover = this.$("#live-discover")[0], m1_13 = MCP1[13], m0_13 = MCP0[13], m = MCP1.slice(0);
      this.a = new TWEEN.Tween({
        o: 0
      }).to({
        o: 1
      }, 500).easing(TWEEN.Easing.Cubic.In).onUpdate(function() {
        discover.style.opacity = this.o, m[13] = (m1_13 - m0_13) * (1 - this.o) + m0_13, 
        setCSSMatrix(icard, m);
      }), this.b = new TWEEN.Tween({
        o: 0
      }).delay(250).to({
        o: 1
      }, 500).onUpdate(function() {
        cardForm.style.opacity = this.o;
      });
    },
    startAnimate: function() {
      this.a || this.b || this.createAnimate(), this.a.start(), this.b.start();
    },
    stopAnimate: function() {
      this.a.stop(), this.b.stop();
    }
  });
  var routexStream = require("routexstream");
  routexStream.geoService, exports.RouteXController = Controller.extend({
    init: function() {
      this.render(), this.listen();
    },
    render: function() {
      $("#app-routex").remove(), this.element.appendTo($("#app-container")), this.loadMaps();
    },
    listen: function() {
      var self = this, element = self.element, $win = $(window), $myInfo = self.$("#my-info"), $openExfe = self.$("#open-exfe"), $locate = self.$("#locate"), isScroll = !1;
      $win.on("orientationchange", function() {
        var height = $win.height();
        $win.width(), $locate.css("-webkit-transform", "translate3d(0, 0, 0)"), $openExfe.css("-webkit-transform", "translate3d(0, 0, 0)"), 
        $("#identities").css("max-height", 60 * Math.round(height / 60) - 60 - 100 + 5);
      });
      var gotoGPS = function(e, showBreadcrumbs) {
        var status = self.checkGPSStyle();
        if (self.mapReadyStatus) {
          var uid = self.mapController.myuid;
          showBreadcrumbs && self.mapController.showBreadcrumbs(uid), self.mapController.fitBoundsWithDestination(uid);
        }
        2 === status || 1 === status && self.startStream();
      };
      element.on("tap.maps", function(e) {
        self.tapElement && e.target !== self.tapElement && !$.contains($myInfo[0], e.target) && ($myInfo.addClass("hide"), 
        self.tapElement = null);
      }), element.on("tap.maps", "#locate", gotoGPS), element.on("touchstart.maps", "#isme .avatar", function(e) {
        return gotoGPS(e, !0), self.tapElement === this ? ($myInfo.addClass("hide"), self.tapElement = null, 
        !1) : ($myInfo.hasClass("hide") && $myInfo.removeClass("hide"), $myInfo.css("-webkit-transform", "translate3d(50px, 6px, 233px)"), 
        self.tapElement = this, void 0);
      }), element.on("touchstart.maps", "#nearby .geo-marker", function(e) {
        if (e.preventDefault(), self.mapReadyStatus) {
          var uid = $(this).data("uid");
          self.mapController.showIdentityPanel(uid);
        }
      }), element.on("touchstart.maps", "#my-info .discover", function() {
        $myInfo.addClass("hide"), self.tapElement = null, $("#shuidi-dialog").removeClass("hide");
      }), element.on("touchstart.maps", "#shuidi-dialog", function(e) {
        "shuidi-dialog" === e.target.id && (e.stopPropagation(), $("#shuidi-dialog").addClass("hide"));
      }), element.on("touchstart.maps", "#shuidi-dialog .app-btn", function(e) {
        e.preventDefault();
        var args = "", params = [];
        return this.cross && (args += this.cross.id), this.myUserId && params.push("user_id=" + this.myUserId), 
        this.token && params.push("token=" + this.token), this.myIdentityId && params.push("identity_id=" + this.myIdentityId), 
        params.length && (args += "?"), args += params.join("&"), openExfe(app_prefix_url + args), 
        !1;
      }), element.on("touchstart.maps", "#shuidi-dialog .notify-ok", function(e) {
        e.preventDefault();
        var v = $("#notify-provider").val();
        return self.addNotificationIdentity(v), !1;
      }), element.on("tap.maps", "#identities .avatar", function() {
        if (!isScroll) {
          var $that = $(this), $d = $that.parent().parent(), uid = $d.data("uid");
          self.mapReadyStatus && (self.mapController.showBreadcrumbs(uid), self.mapController.fitBoundsWithDestination(uid));
        }
      }), element.on("tap.maps", "#open-exfe", function() {
        console.log("remove cats..."), Store.remove("cats"), Store.remove("offset-latlng");
      });
      var $identities = element.find("#identities");
      $identities.on("scroll.maps", function() {
        $myInfo.hasClass("hide") || $myInfo.addClass("hide");
        var $avatars = $(this).find(".avatar"), pb = this.getBoundingClientRect(), height = pb.height, minT = (this.scrollTop, 
        pb.top), maxT = height + minT, ids = this._ids = {};
        $avatars.each(function(i) {
          var bound = this.getBoundingClientRect(), uid = $(this).parents(".identity").data("uid"), t = bound.height / 2 + bound.top;
          t >= minT && maxT >= t && (ids[uid] = [ i, 46, t ]);
        }), self.mapReadyStatus && self.mapController && self.mapController.contains(), 
        console.log(pb, ids);
      }), element.on("touchmove.maps", "#identities-overlay", function(e) {
        e.stopPropagation(), e.preventDefault();
      }), element.on("touchmove", ".info-windown", function(e) {
        e.preventDefault();
      });
      var _t, pageY = 0, scrollTop = 0;
      $identities.on("touchstart.maps", function(e) {
        isScroll = !1, pageY = e.pageY, scrollTop = this.scrollTop;
      }), $identities.on("touchend.maps", function() {
        _t && clearTimeout(_t), _t = setTimeout(function() {
          isScroll = !1;
        }, 233);
      }), $identities.on("touchmove.maps", function(e) {
        isScroll = !0, e.preventDefault(), this.scrollTop = pageY - e.pageY + scrollTop;
      }), self.on("show", function() {
        $("html, body").css({
          "min-height": $win.height()
        }), console.log("This is Smith-Token.", self.isSmithToken), $win.trigger("orientationchange"), 
        self.createIdentitiesList(), self.streaming();
      });
    },
    updateExfeeName: function() {
      this.element.find("#exfee-name").text(this.cross.exfee.name);
    },
    createFreeIdentitiesList: function(identities) {
      var identity, tmp = '<li data-identity-id="{{id}}" data-free="{{free}}" data-uid="{{external_username}}@{{provider}}"><img src="{{avatar_filename}}" alt="" class="avatar{{is_free}}" /><div class="name">{{external_username}}</div></li>', $identities = this.element.find("#free-identities .identities");
      for (identities = identities.slice(0); identity = identities.shift(); ) $identities.append(tmp.replace("{{id}}", identity.id).replace("{{avatar_filename}}", identity.avatar_filename).replace(/\{\{external_username\}\}/g, identity.external_username).replace("{{provider}}", identity.provider).replace("{{is_free}}", (identity.free ? " " : " no-") + "free").replace("{{free}}", identity.free));
    },
    loadMaps: function() {
      var self = this, RoutexMaps = require("routexmaps"), mc = this.mapController = new RoutexMaps({
        url: "//maps.googleapis.com/maps/api/js?sensor=false&language=zh_CN&v=3&callback=_loadmaps_",
        mapDiv: this.$("#map")[0],
        mapOptions: {
          zoom: 5
        },
        svg: this.$("#svg")[0],
        callback: function() {
          self.mapReadyStatus = !0, self.mapController.updateGeoLocation(mc.myuid, self.position);
        }
      });
      mc.myuid = this.myuid, mc.myIdentity = this.myIdentity, this.setLatLngOffset(), 
      mc.tracking = !0, mc.load(), mc.controller = self, this.token && this.cross_id && $.ajax({
        url: apiv3_url + "/routex/breadcrumbs/crosses/" + this.cross_id + "?coordinate=mars&token=" + this.token,
        type: "GET",
        dataType: "json",
        success: function(data) {
          if (data && data.length) for (var d, id; d = data.shift(); ) id = d.id.split("@")[0], 
          mc._breadcrumbs[id] ? mc._breadcrumbs[id].positions = [].contact(d.positions, mc._breadcrumbs[id].positions) : mc._breadcrumbs[id] = d;
        }
      });
    },
    mapReadyStatus: !1,
    editDestination: function(destination) {
      destination && $.ajax({
        type: "POST",
        url: apiv3_url + "/routex/geomarks/crosses/" + this.cross_id + "/location/" + destination.id + "?coordinate=mars&token=" + this.token + "&_method=PUT",
        data: JSON.stringify(destination),
        success: function(data) {
          console.log(data);
        },
        error: function(data) {
          console.log(data);
        }
      });
    },
    setLatLngOffset: function() {
      var offset = Store.get("offset-latlng");
      offset && (this.mapController.latOffset = 1 * offset.earth_to_mars_latitude, this.mapController.lngOffset = 1 * offset.earth_to_mars_longitude);
    },
    streaming: function() {
      if (this.cross_id && this.token) {
        var data = {
          cross_id: this.cross_id,
          save_breadcrumbs: !0,
          after_in_seconds: 7200
        };
        $.ajax({
          type: "POST",
          url: apiv3_url + "/routex/users/crosses?token=" + this.token,
          data: JSON.stringify([ data ]),
          success: function(data) {
            console.log("success", data);
          },
          error: function(data) {
            console.log("error", data);
          }
        });
      }
      var self = this;
      this.initStream(), this.startStream(), console.log("start streaming"), console.log("start monit"), 
      this.timer = setInterval(function() {
        self.mapReadyStatus && (console.log(new Date()), self.mapController.monit());
      }, 1e3);
    },
    initStream: function() {
      var self = this;
      routexStream.init(self.cross.id, self.token, function(result) {
        self.mapReadyStatus && self.mapController && (self.mapController.myuid || (self.mapController.myuid = self.myuid), 
        self.mapController.draw(result));
      }, function(e) {
        console.log(e);
      });
    },
    addNotificationIdentity: function(email, exfee_id, token) {
      exfee_id = this.cross.exfee.id, token = this.token;
      var identity = parseId(email);
      return identity && "email" !== identity.provider && "phone" !== identity.provider ? ($("#notify-provider.email").attr("placeholder", "请输入正确的手机号或电子邮件。"), 
      void 0) : ($.ajax({
        type: "POST",
        url: api_url + "/Exfee/" + exfee_id + "/AddNotificationIdentity" + "?token=" + token,
        data: {
          provider: identity.provider,
          external_username: identity.external_username
        },
        success: function(data) {
          data && data.meta && 200 === data.meta.code && $("#shuidi-dialog").addClass("hide");
        },
        error: function() {
          alert("Failed, please retry later.");
        }
      }), void 0);
    },
    startStream: function() {
      var self = this;
      self.switchGPSStyle(0), routexStream.stopGeo(), routexStream.startGeo(function(r) {
        self.position = {
          gps: [ r.latitude + "", r.longitude + "", r.accuracy ],
          t: r.timestamp
        }, Store.set("position", self.position), self.switchGPSStyle(2), self.trackGeoLocation();
      }, function(r) {
        self.switchGPSStyle(1), console.log(r.status, r), routexStream.stopGeo(), self.mapController && self.mapController.switchGEOStyle(0);
      });
    },
    checkGPSStyle: function() {
      return ~~this.$("#locate").attr("data-status");
    },
    switchGPSStyle: function(status, c) {
      0 === status ? c = "load" : 1 === status ? c = "grey" : (status = 2, c = "blue"), 
      this.$("#locate").removeClass().addClass(c).attr("data-status", status);
    },
    trackGeoLocation: function() {
      var mapController = this.mapController, position = this.position, mapReadyStatus = this.mapReadyStatus;
      mapReadyStatus && mapController && (console.log("tracking"), this.setLatLngOffset(), 
      mapController.updateGeoLocation(this.myuid, position));
    },
    updateMe: function(myIdentity) {
      this.myIdentity = myIdentity, console.log("my identity", this.myIdentity);
      var div = this.$("#isme");
      div.attr("data-uid", myIdentity.connected_user_id), div.attr("data-name", myIdentity.name), 
      div.find("img").attr("src", myIdentity.avatar_filename), div.data("identity", myIdentity);
    },
    updateNotifyProvider: function(euns) {
      if (euns.length) for (var eun, identity; eun = euns.shift(); ) if (identity = parseId(eun), 
      identity && ("phone" === identity.provider || "email" === identity.provider)) {
        $("#notify-provider").val(identity.external_username);
        break;
      }
    },
    createIdentitiesList: function() {
      for (var invitation, identity, exfee = this.cross.exfee, $identities = this.$("#identities"), myUserId = this.myUserId, smith_id = (this.myIdentityId, 
      this.smith_id), invitations = exfee.invitations.slice(0); invitation = invitations.shift(); ) if (identity = invitation.identity, 
      smith_id !== identity.id) if (myUserId !== identity.connected_user_id) {
        var div = $('<div class="identity"><div class="abg"><img src="" alt="" class="avatar"></div><div class="detial"><i class="icon icon-dot-grey"></i><span class="distance">方位？</span></div></div>');
        div.attr("data-uid", identity.connected_user_id), div.attr("data-name", identity.name), 
        div.find("img").attr("src", identity.avatar_filename), $identities.append(div), 
        div.data("identity", identity);
      } else this.myuid = identity.connected_user_id, this.updateMe(identity), this.updateNotifyProvider(invitation.notification_identities.slice(0));
      window.getComputedStyle($identities[0]).webkitTransform, $identities.parent().css("-webkit-transform", "translate3d(0, 0, 0)"), 
      console.log("trigger handler scroll.maps"), $("#identities").triggerHandler("scroll");
    }
  });
}), define("mobileroutes", function(require, exports, module) {
  "use strict";
  var _ENV_ = window._ENV_, Store = require("store"), Handlebars = require("handlebars"), humantime = require("humantime"), renderCrossTime = function(crossTime) {
    var dspTime = humantime.printEFTime(crossTime, "X");
    return dspTime;
  }, Controllers = require("mobilecontroller"), HomeController = Controllers.HomeController, SetPasswordController = Controllers.SetPasswordController, VerifyController = Controllers.VerifyController, CrossController = Controllers.CrossController, LiveController = Controllers.LiveController, RouteXController = Controllers.RouteXController, showCross = function(req, res, data, cats, ctoken, token) {
    cats || (cats = {});
    var response = data.response, originCross = response.cross, cross = {
      id: originCross.id,
      title: originCross.title,
      description: originCross.description.replace(/\r\n|\r|\n/g, "<br />"),
      time: {
        title: "Sometime",
        content: "To be decided"
      },
      place: {
        title: "Somewhere",
        description: "To be decided"
      },
      background: "default.jpg",
      read_only: !!response.read_only,
      change_name: !1
    }, time = originCross.time;
    time && time.begin_at && time.begin_at.timezone ? cross.time = renderCrossTime(time) : cross.time.tobe = "tobe";
    var place = originCross.place;
    place && place.title && (cross.place = {
      title: place.title,
      description: place.description.replace(/\r\n|\r|\n/g, "<br />")
    });
    var lat = place.lat, lng = place.lng;
    if (lat && lng) {
      var scale = window.devicePixelRatio >= 2 ? 2 : 1;
      cross.place.map = "https://maps.googleapis.com/maps/api/staticmap?center=" + lat + "," + lng + "&markers=icon%3a" + encodeURIComponent("http://img.exfe.com/web/map_pin_blue.png") + "%7C" + lat + "," + lng + "&zoom=13&size=290x100&maptype=road&sensor=false&scale=" + scale, 
      cross.place.href = "http://maps.google.com/maps?daddr=" + encodeURIComponent(cross.place.title) + "@" + lat + "," + lng;
    } else cross.place.tobe = "tobe";
    var wl, widget = originCross.widget;
    if (widget && (wl = widget.length)) for (var wi = 0; wl > wi; ++wi) if ("Background" === widget[wi].type) {
      cross.background = widget[wi].image;
      break;
    }
    var user_id = 0, myIdId = 0, authorization = response.authorization;
    authorization ? (user_id = authorization.user_id, response.browsing_identity && (myIdId = response.browsing_identity.id)) : response.browsing_identity && response.browsing_identity.connected_user_id && (user_id = response.browsing_identity.connected_user_id, 
    myIdId = response.browsing_identity.id), response.cross_access_token && (token = cats[ctoken] = response.cross_access_token, 
    Store.set("cats", cats));
    for (var originInvitations = originCross.exfee.invitations, invitations = [], orderRSVP = {
      ACCEPTED: [],
      INTERESTED: [],
      NORESPONSE: [],
      IGNORED: [],
      DECLINED: []
    }, display_rsvp = !1, i = 0, len = originInvitations.length; len > i; ++i) {
      var invitation = originInvitations[i], is_me = user_id && user_id === invitation.identity.connected_user_id || myIdId === invitation.identity.id, is_curr_id = user_id && user_id === invitation.identity.connected_user_id && myIdId === invitation.identity.id, style = "pending", rsvp_status = invitation.rsvp_status;
      (is_curr_id || "NOTIFICATION" !== rsvp_status) && ("ACCEPTED" === rsvp_status ? style = "accepted" : "DECLINED" === rsvp_status && (style = "declined"), 
      invitation.rsvp_style = style, is_me ? (display_rsvp = "pending" === style, invitation.is_me = !0, 
      myIdId = invitation.identity.id, myIdId !== invitation.invited_by.id && (cross.inviter = invitation.invited_by), 
      myIdId !== invitation.by_identity.id && (display_rsvp = !0), invitation.identity.isphone = "phone" === invitation.identity.provider, 
      cross.identity = invitation.identity, orderRSVP.ACCEPTED.unshift(invitation)) : invitation.rsvp_status in orderRSVP && orderRSVP[invitation.rsvp_status].push(invitation));
    }
    cross.hide_rsvp = !display_rsvp, invitations = [].concat(orderRSVP.ACCEPTED, orderRSVP.INTERESTED, orderRSVP.NORESPONSE, orderRSVP.IGNORED, orderRSVP.DECLINED), 
    cross.invitations = [], len = invitations.length;
    for (var j = 0; len > j; ) cross.invitations.push(invitations.splice(0, 5)), j += 5;
    len = cross.invitations.length;
    var invs = cross.invitations[len - 1], k = invs.length;
    if (k && 5 > k) for (;5 - k++; ) invs.push(void 0);
    var args = "";
    user_id && (authorization ? (args = cross.id + "?user_id=" + user_id + "&token=" + authorization.token + "&identity_id=" + myIdId, 
    token = authorization.token, Store.set("authorization", authorization)) : (authorization = Store.get("authorization"), 
    authorization && authorization.user_id === user_id && (args = cross.id + "?user_id=" + user_id + "&token=" + authorization.token + "&identity_id=" + myIdId, 
    token = authorization.token))), token && cross.identity.isphone && (cross.change_name = !0);
    var app = req.app, controllers = app.controllers, crossCont = controllers.cross;
    crossCont && crossCont.destory();
    var tmpl = Handlebars.compile($("#cross-tmpl").html());
    crossCont = app.controllers.cross = new CrossController({
      options: {
        template: tmpl(cross)
      },
      cross: cross,
      exfee_id: originCross.exfee.id,
      token: token
    }), crossCont.emit("show"), app.controllers.footer.emit("show-from-cross", originCross.exfee.id, token, cross.read_only, args);
  }, routes = module.exports = {
    index: function(req) {
      var error = req.error, app = req.app, controllers = app.controllers, homeCont = controllers.home, footerCont = controllers.footer, screen = app.screen;
      homeCont || (homeCont = app.controllers.home = new HomeController({
        options: {
          template: $("#home-tmpl").html()
        }
      })), document.title = "EXFE - The group utility for gathering.", homeCont.emit("show", screen, error), 
      footerCont.emit("show", screen, !1, !1, error === !0), delete req.error, app.currPageName = "HOME";
    },
    verify: function(req, res) {
      var session = req.session, resolveToken = session.resolveToken, app = req.app;
      $("#app-header").removeClass("hide");
      var verifyCont = new VerifyController({
        options: {
          template: $("#verify-tmpl").html()
        },
        resolveToken: resolveToken
      });
      verifyCont.emit("show", req, res), app.currPageName = "VERIFY";
    },
    setPassword: function(req, res) {
      var session = req.session, resolveToken = session.resolveToken, app = req.app;
      $("#app-header").removeClass("hide");
      var setPasswordCont = new SetPasswordController({
        options: {
          template: $("#setpassword-tmpl").html()
        },
        resolveToken: resolveToken,
        token: resolveToken.origin_token
      });
      setPasswordCont.emit("show", req, res), app.currPageName = "SET_PASSWORD";
    },
    resolveToken: function(req, res) {
      var app = req.app, originToken = req.params[0], data = req._data_ = _ENV_._data_, session = req.session;
      session.resolveToken = data;
      var action = session.resolveToken.action;
      "VERIFIED" === action ? routes.verify(req, res) : "INPUT_NEW_PASSWORD" === action && (session.resolveToken.origin_token = originToken, 
      routes.setPassword(req, res)), app.currPageName = "RESOLVE_TOKEN";
    },
    crossPhoneToken: function(req, res) {
      var app = req.app, params = req.params, ctoken = params[2], cats = Store.get("cats"), token = cats && cats[ctoken], data = req._data_ = _ENV_._data_;
      showCross(req, res, data, cats, ctoken, token), app.currPageName = "CROSS";
    },
    crossToken: function(req, res) {
      var app = req.app, ctoken = req.params[1], cats = Store.get("cats"), data = req._data_ = _ENV_._data_, token = cats && cats[ctoken];
      showCross(req, res, data, cats, ctoken, token), app.currPageName = "CROSS";
    },
    live: function(req) {
      var app = req.app, controllers = app.controllers, liveCont = controllers.live;
      liveCont && liveCont.destory(), liveCont = app.controllers.live = new LiveController({
        options: {
          template: $("#live-tmpl").html()
        }
      }), liveCont.emit("show", app.screen, app.ios), app.currPageName = "LIVE";
    },
    routex: function(req) {
      document.title = "活点地图";
      var app = req.app, ctoken = req.params[0], response = _ENV_._data_.response, tokenInfos = _ENV_._data_.tokenInfos, cross = response.cross, cross_access_token = (response.action, 
      response.cross_access_token), browsing_identity = response.browsing_identity, cats = Store.get("cats") || {}, token = cats && cats[ctoken];
      cross_access_token && (token = cats[ctoken] = cross_access_token, Store.set("cats", cats));
      var routexCont = app.controllers.routex = new RouteXController({
        options: {
          template: $("#routex-tmpl").html()
        },
        lastGPS: Store.get("position"),
        cross: cross,
        cross_id: cross && cross.id,
        ctoken: ctoken,
        token: token || tokenInfos[0] || ctoken,
        myIdentityId: browsing_identity && browsing_identity.id || tokenInfos[1] || 0,
        myUserId: browsing_identity && browsing_identity.connected_user_id || 0,
        smith_id: window._ENV_.smith_id,
        isSmithToken: !!window._ENV_.smith_id
      });
      routexCont.emit("show");
    }
  };
}), define(function(require) {
  "use strict";
  var TWEEN = require("tween"), AF = require("af"), requestAnimationFrame = AF.request, middleware = require("mobilemiddleware"), FooterController = require("mobilecontroller").FooterController, routes = require("mobileroutes"), lightsaber = require("lightsaber"), app = window.App = lightsaber();
  app.use(middleware.setHtmlHeight), app.use(middleware.cleanup), app.initRouter(), 
  app.use(middleware.errorHandler), app.request.enableFullUrlPath = !0, app.controllers = {}, 
  app.controllers.footer = new FooterController({
    App: app
  }), app.get(/^\/+(?:\?)?#{0,}$/, routes.index), app.get(/^\/+(?:\?)?#live\/?$/, routes.live), 
  app.get(/^\/+\?(?:(?:redirect)&)?t=([a-zA-Z0-9]{3,})$/, function(req, res) {
    var smsToken = window._ENV_._data_, action = smsToken.action;
    req.session.resolveToken = smsToken, "VERIFIED" === action ? routes.verify(req, res) : "INPUT_NEW_PASSWORD" === action && routes.setPassword(req, res);
  }), app.get(/^\/+(?:\?(?:redirect)?)?#token=([a-zA-Z0-9]{64})\/?$/, routes.resolveToken), 
  app.get(/^\/+(?:\?(?:redirect)?)?#!([1-9][0-9]*)\/([a-zA-Z0-9]{4})\/?$/, routes.crossPhoneToken), 
  app.get(/^\/+(?:\?(?:redirect)?)?#!token=([a-zA-Z0-9]{32})\/?$/, routes.crossToken), 
  app.get(/^\/+(?:\?(?:redirect)?)?#!token=([a-zA-Z0-9]{4,})\/routex\/?$/, routes.routex), 
  app.get(/^\/+!token=([a-zA-Z0-9]{4,})\/routex\/?$/, routes.routex), app.get(/^\/+!\d+\/routex\/?\?xcode=([a-zA-Z0-9]{4,})$/, routes.routex), 
  app.on("launched", function() {
    function animate() {
      requestAnimationFrame(animate), TWEEN.update();
    }
    animate();
  });
});