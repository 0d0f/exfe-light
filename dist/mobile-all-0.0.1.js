/*jslint evil: true */
/*!
 * https://github.com/cfddream/odof
 * License MIT
 *
 * Refer:
 *  - http://wiki.commonjs.org/wiki/CommonJS
 *  - http://wiki.commonjs.org/wiki/Modules/1.1.1
 *  - https://github.com/joyent/node/blob/master/lib/module.js
 *  - https://github.com/seajs/seajs
 *  - https://github.com/tobie/modulr-node
 *  - http://www.page.ca/~wes/CommonJS/modules-2.0-draft8/commonjs%20modules%202.0-8(2).pdf
 */
(function (context) {
  'use strict';

  /**
   * define a module
   * @api public
   */
  function define(id, deps, factory) {
    var argsLen = arguments.length;

    // define(factory)
    if (argsLen === 1) {
      factory = id;
      id = undefined;
    }
    // define(id || deps, factory);
    else if (argsLen === 2) {
      factory = deps;
      deps = undefined;
    }

    var module = new Module(id, deps, factory);
    if (id) {
      __cache[id] = module;
    // anonymous function 先简单处理匿名方法
    } else {
      factory.call(module, _require, module.exports, module);
    }
  }

  // AMD
  define.amd = { jQuery: true };

  context.define = define;

  /**
   * 不对外提供此接口
   * Accepts a module identifier.
   * @param {String} id    module.id
   */
  function _require(id) {
    var module = __cache[id];

    if (!module) {
      return null;
    }

    if (!module.exports) {
      _initExports(module);
    }

    return module.exports;
  }

  function _initExports(module/*, context*/) {
    var factory = module.factory, result;

    delete module.factory;

    result = factory(_require, module.exports = {}, module);

    if (result) {
      module.exports = result;
    }
  }

  function Module(id, deps, factory) {
    this.id = id;

    this.uri = undefined;
    // dependencies
    //this.deps = deps || [];
    this.deps = deps;

    // lazy eval
    // http://calendar.perfplanet.com/2011/lazy-evaluation-of-commonjs-modules/
    if (typeof factory === 'string') {
      factory = new Function('require', 'exports', 'module', factory);
    }
    this.factory = factory;

    this.exports = undefined;
    this.filename = null;
    // 暂时赋值为 undefined
    this.parent = undefined;
    // 后面要异步加载
    this.loaded = false;
  }

  Module.prototype.constructor = Module;

  var __cache = Module.__cache = {};

})(this);

/*jshint strict: false */
define('class', function () {
/*
 * Class
 * @author cfddream@gmail.com
 *
 * Thanks to:
 *
 *  - https://github.com/mootools/prime/blob/master/prime/index.js
 *  - https://github.com/mitsuhiko/classy/blob/master/classy.js
 *  - https://github.com/ded/klass/blob/master/klass.js
 *  - https://github.com/documentcloud/backbone/blob/master/backbone.js
 *  - https://github.com/alipay/arale/blob/master/lib/class/src/class.js
 *
 * Test:
 *
 *  - http://jsperf.com/odof-class
 *
 */

  function Class(o) {
    if (!(this instanceof Class) && isFunction(o)) {
      return classy(o);
    }
  }

  Class.create = function (parent, protoProps) {
    if (!isFunction(parent)) {
      protoProps = parent;
      parent = null;
    }
    protoProps || (protoProps = {});
    parent || (parent = protoProps.Extends || Class);
    return createClass(parent, protoProps);
  };

  Class.extend = function (protoProps, classProps) {
    return createClass(this, protoProps, classProps);
  };

  // Helpers
  // -------

  function classy(o) {
    o.extend = Class.extend;
    o.implement = implement;
    return o;
  }

  function createClass(parent, protoProps, staticProps, parentProtos, protos) {
    parentProtos = parent.prototype;

    function subclass() {
      parent.apply(this, arguments);

      // Only call initialize in self constructor.
      if (this.constructor === subclass && this.initialize) {
        this.initialize.apply(this, arguments);
        this.initialized = true;
      }
    }

    // Inherit class (static) properties from parent.
    if (parent !== Class) { mixin(subclass, parent); }

    subclass.Extends = parent;

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    protos = createProto(parentProtos);

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) { mixin(protos, protoProps); }

    subclass.prototype = protos;

    // Add static properties to the constructor function, if supplied.
    if (staticProps) { mixin(subclass, staticProps); }

    // Set a convenience property in case the parent's prototype is needed later.
    subclass.superclass = parentProtos;

    // Correctly set subclass's `prototype.constructor`.
    subclass.prototype.constructor = subclass;

    return classy(subclass);
  }

  // Shared empty constructor function to aid in prototype-chain creation.
  function ctor() {}

  // See: http://jsperf.com/object-create-vs-new-ctor
  var createProto = Object.__proto__ ?
    function (proto) {
      return { __proto__: proto };
    } :
    function (proto) {
      ctor.prototype = proto;
      return new ctor();
    };

  function implement(properties) {
    var key, proto = this.prototype;
    for (key in properties) { proto[key] = properties[key]; }
  }

  function mixin(r, s) {
    var k;
    for (k in s) { r[k] = s[k]; }
  }

  var toString = Object.prototype.toString;

  function isFunction(f) {
    return toString.call(f) === '[object Function]';
  }

  return Class;
});

/*jshint -W116*/
define('emitter', function () {
  'use strict';

 /**
  * Emitter
  *
  * Thanks to:
  *
  *  - https://github.com/documentcloud/backbone/blob/master/backbone.js
  *  - https://github.com/joyent/node/blob/master/lib/events.js
  *  - https://github.com/alipay/arale/blob/master/lib/events/src/events.js
  *
  *  Test:
  *
  *   - http://jsperf.com/odof-events-test/4
  *   - http://jsperf.com/if-vs-short-circuiting
  */
  var EVENT_SPLITTER = /\s+/
    , keys = Object.keys;

  if (!keys) {
    keys = function (o) {
      var r = [], p;
      for (p in o) {
        if (o.hasOwnProperty(p)) {
          r[r.length] = p;
        }
      }
      return r;
    };
  }

  function Emitter() {}

  Emitter.prototype.on = function (events, fn, ctx) {
    var callbacks, event, list;
    if (!fn) { return this; }
    events = events.split(EVENT_SPLITTER);

    callbacks = this.__callbacks || (this.__callbacks = {});

    while ((event = events.shift())) {
      list = callbacks[event] || (callbacks[event] = []);
      fn.__context = ctx;
      list[list.length] = fn;
    }

    return this;
  };

  Emitter.prototype.once = function (events, fn, ctx) {
    var callbacks, event, list;
    if (!fn) return this;
    events = events.split(EVENT_SPLITTER);

    callbacks = this.__callbacks || (this.__callbacks = {});

    while ((event = events.shift())) {
      list = callbacks[event] || (callbacks[event] = []);
      fn.__once = true;
      fn.__context = ctx;
      list[list.length] = fn;
    }

    return this;
  };

  Emitter.prototype.off = function (events, fn, ctx) {
    var callbacks, event, list, i, cb;
    if (!(callbacks = this.__callbacks)) return this;
    if (!(events || fn || ctx)) {
      delete this.__callbacks;
      return this;
    }

    events = events.split(EVENT_SPLITTER) || keys(callbacks);

    while ((event = events.shift())) {
      list = callbacks[event];
      if (!list) continue;

      if (!(fn || ctx)) {
        delete callbacks[event];
        continue;
      }

      for (i = list.length - 1; i; --i) {
        cb = list[i];
        if (!(fn && cb !== fn || ctx && cb.__context !== ctx)) {
          list.splice(i, 1);
        }
      }
    }

    return this;
  };

  Emitter.prototype.emit = function (events) {
    var callbacks, event, all, list, i, len, rest = [], args, cb;
    if (!(callbacks = this.__callbacks)) return this;

    events = events.split(EVENT_SPLITTER);

    for (i = arguments.length - 1; i; --i) {
      rest[i - 1] = arguments[i];
    }

    if ((all = callbacks.call)) args = [0].concat(rest);

    while ((event = events.shift())) {
      if ((list = callbacks[event])) {
        for (i = 0, len = list.length; i < len; ++i) {
          cb = list[i];
          cb.apply(cb.__context || this, rest);
          if (cb.__once) {
            list.splice(i--, 1);
            len--;
          }
        }
      }

      // if `list` not found, don't trigger `all`
      if (list && all) {
        args[0] = event;
        for (i = 0, len = all.length; i < len; ++i) {
          cb = all[i];
          cb.apply(cb.__context || this, args);
        }
      }
    }

    return this;
  };

  return Emitter;
});

/*jshint -W116*/
define('base', function (require) {
  'use strict';
  // Thanks to:
  //
  // - https://github.com/mootools/mootools-core/blob/master/Source/Class/Class.Extras.js
  // - https://github.com/alipay/arale/blob/master/lib/base/src/options.js


  // Helpers
  // -------
  var EVENT_PREFIX = /^on[A-Z]/;

  var PROTO = Object.__proto__;

  var toString = Object.prototype.toString;

  var isArray = Array.isArray;
  if (!isArray) isArray = function (a) {return toString.call(a) === '[object Array]';}

  function isFunction(f) {
    return toString.call(f) === '[object Function]';
  }

  function isPlainObject(o) {
    return o &&
      // 排除 boolean/string/number/function 等
      // 标准浏览器下，排除 window 等非 JS 对象
      // 注：ie8- 下，toString.call(window 等对象)  返回 '[object Object]'
        toString.call(o) === '[object Object]' &&
      // ie8- 下，排除 window 等非 JS 对象
        ('isPrototypeOf' in o);
  }

  function merge(receiver, supplier) {
    var key, value;

    for (key in supplier) {
      value = supplier[key];

      if (isArray(value)) {
        value = value.slice();
      } else if (isPlainObject(value)) {
        value = merge(receiver[key] || {}, value);
      }

      receiver[key] = value;
    }

    return receiver;
  }

  // Convert `onChangeTitle` to `changeTitle`
  function getEventName(name) {
    return name[2].toLowerCase() + name.substring(3);
  }

  var Class = require('class');
  var Emitter = require('emitter');

  return Class.create(Emitter, {

    setOptions: function (custom) {
      var key, value, options;
      if (!this.hasOwnProperty('options')) {
        this.options = {};
      }

      options = this.options;

      // 父类 options
      if (this.constructor.superclass.options) {
        merge(options, this.constructor.superclass.options);
      }

      // 子类 options
      if (this.constructor.prototype.options) merge(options, this.constructor.prototype.options);

      // 实例 options
      if (custom && custom.options) merge(options, custom.options);

      if (this.on) {
        for (key in options) {
          value = options[key];
          if (isFunction(value) && EVENT_PREFIX.test(key)) {
            this.on(getEventName(key), value);
            delete options[key];
          }
        }
      }
    },

    destory: function () {
      var k;
      for (k in this) {
        if (this.hasOwnProperty(k)) {
          delete this[k];
        }
      }

      if (PROTO) this.__proto__ = PROTO;
    }

  });

});

/* Zepto v1.0-3-g342d490 - zepto polyfill event ajax form data touch - zeptojs.com/license */


var Zepto = (function() {
  var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice, filter = emptyArray.filter,
    document = window.document,
    elementDisplay = {}, classCache = {},
    getComputedStyle = document.defaultView.getComputedStyle,
    cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
    fragmentRE = /^\s*<(\w+|!)[^>]*>/,
    tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
    rootNodeRE = /^(?:body|html)$/i,

    // special attributes that should be get/set via method calls
    methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

    adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
    table = document.createElement('table'),
    tableRow = document.createElement('tr'),
    containers = {
      'tr': document.createElement('tbody'),
      'tbody': table, 'thead': table, 'tfoot': table,
      'td': tableRow, 'th': tableRow,
      '*': document.createElement('div')
    },
    readyRE = /complete|loaded|interactive/,
    classSelectorRE = /^\.([\w-]+)$/,
    idSelectorRE = /^#([\w-]*)$/,
    tagSelectorRE = /^[\w-]+$/,
    class2type = {},
    toString = class2type.toString,
    zepto = {},
    camelize, uniq,
    tempParent = document.createElement('div')

  zepto.matches = function(element, selector) {
    if (!element || element.nodeType !== 1) return false
    var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
                          element.oMatchesSelector || element.matchesSelector
    if (matchesSelector) return matchesSelector.call(element, selector)
    // fall back to performing a selector:
    var match, parent = element.parentNode, temp = !parent
    if (temp) (parent = tempParent).appendChild(element)
    match = ~zepto.qsa(parent, selector).indexOf(element)
    temp && tempParent.removeChild(element)
    return match
  }

  function type(obj) {
    return obj == null ? String(obj) :
      class2type[toString.call(obj)] || "object"
  }

  function isFunction(value) { return type(value) == "function" }
  function isWindow(obj)     { return obj != null && obj == obj.window }
  function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
  function isObject(obj)     { return type(obj) == "object" }
  function isPlainObject(obj) {
    return isObject(obj) && !isWindow(obj) && obj.__proto__ == Object.prototype
  }
  function isArray(value) { return value instanceof Array }
  function likeArray(obj) { return typeof obj.length == 'number' }

  function compact(array) { return filter.call(array, function(item){ return item != null }) }
  function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
  camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
  function dasherize(str) {
    return str.replace(/::/g, '/')
           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
           .replace(/_/g, '-')
           .toLowerCase()
  }
  uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }

  function classRE(name) {
    return name in classCache ?
      classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
  }

  function maybeAddPx(name, value) {
    return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
  }

  function defaultDisplay(nodeName) {
    var element, display
    if (!elementDisplay[nodeName]) {
      element = document.createElement(nodeName)
      document.body.appendChild(element)
      display = getComputedStyle(element, '').getPropertyValue("display")
      element.parentNode.removeChild(element)
      display == "none" && (display = "block")
      elementDisplay[nodeName] = display
    }
    return elementDisplay[nodeName]
  }

  function children(element) {
    return 'children' in element ?
      slice.call(element.children) :
      $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
  }

  // `$.zepto.fragment` takes a html string and an optional tag name
  // to generate DOM nodes nodes from the given html string.
  // The generated DOM nodes are returned as an array.
  // This function can be overriden in plugins for example to make
  // it compatible with browsers that don't support the DOM fully.
  zepto.fragment = function(html, name, properties) {
    if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
    if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
    if (!(name in containers)) name = '*'

    var nodes, dom, container = containers[name]
    container.innerHTML = '' + html
    dom = $.each(slice.call(container.childNodes), function(){
      container.removeChild(this)
    })
    if (isPlainObject(properties)) {
      nodes = $(dom)
      $.each(properties, function(key, value) {
        if (methodAttributes.indexOf(key) > -1) nodes[key](value)
        else nodes.attr(key, value)
      })
    }
    return dom
  }

  // `$.zepto.Z` swaps out the prototype of the given `dom` array
  // of nodes with `$.fn` and thus supplying all the Zepto functions
  // to the array. Note that `__proto__` is not supported on Internet
  // Explorer. This method can be overriden in plugins.
  zepto.Z = function(dom, selector) {
    dom = dom || []
    dom.__proto__ = $.fn
    dom.selector = selector || ''
    return dom
  }

  // `$.zepto.isZ` should return `true` if the given object is a Zepto
  // collection. This method can be overriden in plugins.
  zepto.isZ = function(object) {
    return object instanceof zepto.Z
  }

  // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
  // takes a CSS selector and an optional context (and handles various
  // special cases).
  // This method can be overriden in plugins.
  zepto.init = function(selector, context) {
    // If nothing given, return an empty Zepto collection
    if (!selector) return zepto.Z()
    // If a function is given, call it when the DOM is ready
    else if (isFunction(selector)) return $(document).ready(selector)
    // If a Zepto collection is given, juts return it
    else if (zepto.isZ(selector)) return selector
    else {
      var dom
      // normalize array if an array of nodes is given
      if (isArray(selector)) dom = compact(selector)
      // Wrap DOM nodes. If a plain object is given, duplicate it.
      else if (isObject(selector))
        dom = [isPlainObject(selector) ? $.extend({}, selector) : selector], selector = null
      // If it's a html fragment, create nodes from it
      else if (fragmentRE.test(selector))
        dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector)
      // And last but no least, if it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
      // create a new Zepto collection from the nodes found
      return zepto.Z(dom, selector)
    }
  }

  // `$` will be the base `Zepto` object. When calling this
  // function just call `$.zepto.init, which makes the implementation
  // details of selecting nodes and creating Zepto collections
  // patchable in plugins.
  $ = function(selector, context){
    return zepto.init(selector, context)
  }

  function extend(target, source, deep) {
    for (key in source)
      if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
        if (isPlainObject(source[key]) && !isPlainObject(target[key]))
          target[key] = {}
        if (isArray(source[key]) && !isArray(target[key]))
          target[key] = []
        extend(target[key], source[key], deep)
      }
      else if (source[key] !== undefined) target[key] = source[key]
  }

  // Copy all but undefined properties from one or more
  // objects to the `target` object.
  $.extend = function(target){
    var deep, args = slice.call(arguments, 1)
    if (typeof target == 'boolean') {
      deep = target
      target = args.shift()
    }
    args.forEach(function(arg){ extend(target, arg, deep) })
    return target
  }

  // `$.zepto.qsa` is Zepto's CSS selector implementation which
  // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
  // This method can be overriden in plugins.
  zepto.qsa = function(element, selector){
    var found
    return (isDocument(element) && idSelectorRE.test(selector)) ?
      ( (found = element.getElementById(RegExp.$1)) ? [found] : [] ) :
      (element.nodeType !== 1 && element.nodeType !== 9) ? [] :
      slice.call(
        classSelectorRE.test(selector) ? element.getElementsByClassName(RegExp.$1) :
        tagSelectorRE.test(selector) ? element.getElementsByTagName(selector) :
        element.querySelectorAll(selector)
      )
  }

  function filtered(nodes, selector) {
    return selector === undefined ? $(nodes) : $(nodes).filter(selector)
  }

  $.contains = function(parent, node) {
    return parent !== node && parent.contains(node)
  }

  function funcArg(context, arg, idx, payload) {
    return isFunction(arg) ? arg.call(context, idx, payload) : arg
  }

  function setAttribute(node, name, value) {
    value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
  }

  // access className property while respecting SVGAnimatedString
  function className(node, value){
    var klass = node.className,
        svg   = klass && klass.baseVal !== undefined

    if (value === undefined) return svg ? klass.baseVal : klass
    svg ? (klass.baseVal = value) : (node.className = value)
  }

  // "true"  => true
  // "false" => false
  // "null"  => null
  // "42"    => 42
  // "42.5"  => 42.5
  // JSON    => parse if valid
  // String  => self
  function deserializeValue(value) {
    var num
    try {
      return value ?
        value == "true" ||
        ( value == "false" ? false :
          value == "null" ? null :
          !isNaN(num = Number(value)) ? num :
          /^[\[\{]/.test(value) ? $.parseJSON(value) :
          value )
        : value
    } catch(e) {
      return value
    }
  }

  $.type = type
  $.isFunction = isFunction
  $.isWindow = isWindow
  $.isArray = isArray
  $.isPlainObject = isPlainObject

  $.isEmptyObject = function(obj) {
    var name
    for (name in obj) return false
    return true
  }

  $.inArray = function(elem, array, i){
    return emptyArray.indexOf.call(array, elem, i)
  }

  $.camelCase = camelize
  $.trim = function(str) { return str.trim() }

  // plugin compatibility
  $.uuid = 0
  $.support = { }
  $.expr = { }

  $.map = function(elements, callback){
    var value, values = [], i, key
    if (likeArray(elements))
      for (i = 0; i < elements.length; i++) {
        value = callback(elements[i], i)
        if (value != null) values.push(value)
      }
    else
      for (key in elements) {
        value = callback(elements[key], key)
        if (value != null) values.push(value)
      }
    return flatten(values)
  }

  $.each = function(elements, callback){
    var i, key
    if (likeArray(elements)) {
      for (i = 0; i < elements.length; i++)
        if (callback.call(elements[i], i, elements[i]) === false) return elements
    } else {
      for (key in elements)
        if (callback.call(elements[key], key, elements[key]) === false) return elements
    }

    return elements
  }

  $.grep = function(elements, callback){
    return filter.call(elements, callback)
  }

  if (window.JSON) $.parseJSON = JSON.parse

  // Populate the class2type map
  $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase()
  })

  // Define methods that will be available on all
  // Zepto collections
  $.fn = {
    // Because a collection acts like an array
    // copy over these useful array functions.
    forEach: emptyArray.forEach,
    reduce: emptyArray.reduce,
    push: emptyArray.push,
    sort: emptyArray.sort,
    indexOf: emptyArray.indexOf,
    concat: emptyArray.concat,

    // `map` and `slice` in the jQuery API work differently
    // from their array counterparts
    map: function(fn){
      return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
    },
    slice: function(){
      return $(slice.apply(this, arguments))
    },

    ready: function(callback){
      if (readyRE.test(document.readyState)) callback($)
      else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
      return this
    },
    get: function(idx){
      return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
    },
    toArray: function(){ return this.get() },
    size: function(){
      return this.length
    },
    remove: function(){
      return this.each(function(){
        if (this.parentNode != null)
          this.parentNode.removeChild(this)
      })
    },
    each: function(callback){
      emptyArray.every.call(this, function(el, idx){
        return callback.call(el, idx, el) !== false
      })
      return this
    },
    filter: function(selector){
      if (isFunction(selector)) return this.not(this.not(selector))
      return $(filter.call(this, function(element){
        return zepto.matches(element, selector)
      }))
    },
    add: function(selector,context){
      return $(uniq(this.concat($(selector,context))))
    },
    is: function(selector){
      return this.length > 0 && zepto.matches(this[0], selector)
    },
    not: function(selector){
      var nodes=[]
      if (isFunction(selector) && selector.call !== undefined)
        this.each(function(idx){
          if (!selector.call(this,idx)) nodes.push(this)
        })
      else {
        var excludes = typeof selector == 'string' ? this.filter(selector) :
          (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
        this.forEach(function(el){
          if (excludes.indexOf(el) < 0) nodes.push(el)
        })
      }
      return $(nodes)
    },
    has: function(selector){
      return this.filter(function(){
        return isObject(selector) ?
          $.contains(this, selector) :
          $(this).find(selector).size()
      })
    },
    eq: function(idx){
      return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
    },
    first: function(){
      var el = this[0]
      return el && !isObject(el) ? el : $(el)
    },
    last: function(){
      var el = this[this.length - 1]
      return el && !isObject(el) ? el : $(el)
    },
    find: function(selector){
      var result, $this = this
      if (typeof selector == 'object')
        result = $(selector).filter(function(){
          var node = this
          return emptyArray.some.call($this, function(parent){
            return $.contains(parent, node)
          })
        })
      else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
      else result = this.map(function(){ return zepto.qsa(this, selector) })
      return result
    },
    closest: function(selector, context){
      var node = this[0], collection = false
      if (typeof selector == 'object') collection = $(selector)
      while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
        node = node !== context && !isDocument(node) && node.parentNode
      return $(node)
    },
    parents: function(selector){
      var ancestors = [], nodes = this
      while (nodes.length > 0)
        nodes = $.map(nodes, function(node){
          if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
            ancestors.push(node)
            return node
          }
        })
      return filtered(ancestors, selector)
    },
    parent: function(selector){
      return filtered(uniq(this.pluck('parentNode')), selector)
    },
    children: function(selector){
      return filtered(this.map(function(){ return children(this) }), selector)
    },
    contents: function() {
      return this.map(function() { return slice.call(this.childNodes) })
    },
    siblings: function(selector){
      return filtered(this.map(function(i, el){
        return filter.call(children(el.parentNode), function(child){ return child!==el })
      }), selector)
    },
    empty: function(){
      return this.each(function(){ this.innerHTML = '' })
    },
    // `pluck` is borrowed from Prototype.js
    pluck: function(property){
      return $.map(this, function(el){ return el[property] })
    },
    show: function(){
      return this.each(function(){
        this.style.display == "none" && (this.style.display = null)
        if (getComputedStyle(this, '').getPropertyValue("display") == "none")
          this.style.display = defaultDisplay(this.nodeName)
      })
    },
    replaceWith: function(newContent){
      return this.before(newContent).remove()
    },
    wrap: function(structure){
      var func = isFunction(structure)
      if (this[0] && !func)
        var dom   = $(structure).get(0),
            clone = dom.parentNode || this.length > 1

      return this.each(function(index){
        $(this).wrapAll(
          func ? structure.call(this, index) :
            clone ? dom.cloneNode(true) : dom
        )
      })
    },
    wrapAll: function(structure){
      if (this[0]) {
        $(this[0]).before(structure = $(structure))
        var children
        // drill down to the inmost element
        while ((children = structure.children()).length) structure = children.first()
        $(structure).append(this)
      }
      return this
    },
    wrapInner: function(structure){
      var func = isFunction(structure)
      return this.each(function(index){
        var self = $(this), contents = self.contents(),
            dom  = func ? structure.call(this, index) : structure
        contents.length ? contents.wrapAll(dom) : self.append(dom)
      })
    },
    unwrap: function(){
      this.parent().each(function(){
        $(this).replaceWith($(this).children())
      })
      return this
    },
    clone: function(){
      return this.map(function(){ return this.cloneNode(true) })
    },
    hide: function(){
      return this.css("display", "none")
    },
    toggle: function(setting){
      return this.each(function(){
        var el = $(this)
        ;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
      })
    },
    prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
    next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
    html: function(html){
      return html === undefined ?
        (this.length > 0 ? this[0].innerHTML : null) :
        this.each(function(idx){
          var originHtml = this.innerHTML
          $(this).empty().append( funcArg(this, html, idx, originHtml) )
        })
    },
    text: function(text){
      return text === undefined ?
        (this.length > 0 ? this[0].textContent : null) :
        this.each(function(){ this.textContent = text })
    },
    attr: function(name, value){
      var result
      return (typeof name == 'string' && value === undefined) ?
        (this.length == 0 || this[0].nodeType !== 1 ? undefined :
          (name == 'value' && this[0].nodeName == 'INPUT') ? this.val() :
          (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
        ) :
        this.each(function(idx){
          if (this.nodeType !== 1) return
          if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
          else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
        })
    },
    removeAttr: function(name){
      return this.each(function(){ this.nodeType === 1 && setAttribute(this, name) })
    },
    prop: function(name, value){
      return (value === undefined) ?
        (this[0] && this[0][name]) :
        this.each(function(idx){
          this[name] = funcArg(this, value, idx, this[name])
        })
    },
    data: function(name, value){
      var data = this.attr('data-' + dasherize(name), value)
      return data !== null ? deserializeValue(data) : undefined
    },
    val: function(value){
      return (value === undefined) ?
        (this[0] && (this[0].multiple ?
           $(this[0]).find('option').filter(function(o){ return this.selected }).pluck('value') :
           this[0].value)
        ) :
        this.each(function(idx){
          this.value = funcArg(this, value, idx, this.value)
        })
    },
    offset: function(coordinates){
      if (coordinates) return this.each(function(index){
        var $this = $(this),
            coords = funcArg(this, coordinates, index, $this.offset()),
            parentOffset = $this.offsetParent().offset(),
            props = {
              top:  coords.top  - parentOffset.top,
              left: coords.left - parentOffset.left
            }

        if ($this.css('position') == 'static') props['position'] = 'relative'
        $this.css(props)
      })
      if (this.length==0) return null
      var obj = this[0].getBoundingClientRect()
      return {
        left: obj.left + window.pageXOffset,
        top: obj.top + window.pageYOffset,
        width: Math.round(obj.width),
        height: Math.round(obj.height)
      }
    },
    css: function(property, value){
      if (arguments.length < 2 && typeof property == 'string')
        return this[0] && (this[0].style[camelize(property)] || getComputedStyle(this[0], '').getPropertyValue(property))

      var css = ''
      if (type(property) == 'string') {
        if (!value && value !== 0)
          this.each(function(){ this.style.removeProperty(dasherize(property)) })
        else
          css = dasherize(property) + ":" + maybeAddPx(property, value)
      } else {
        for (key in property)
          if (!property[key] && property[key] !== 0)
            this.each(function(){ this.style.removeProperty(dasherize(key)) })
          else
            css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
      }

      return this.each(function(){ this.style.cssText += ';' + css })
    },
    index: function(element){
      return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
    },
    hasClass: function(name){
      return emptyArray.some.call(this, function(el){
        return this.test(className(el))
      }, classRE(name))
    },
    addClass: function(name){
      return this.each(function(idx){
        classList = []
        var cls = className(this), newName = funcArg(this, name, idx, cls)
        newName.split(/\s+/g).forEach(function(klass){
          if (!$(this).hasClass(klass)) classList.push(klass)
        }, this)
        classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
      })
    },
    removeClass: function(name){
      return this.each(function(idx){
        if (name === undefined) return className(this, '')
        classList = className(this)
        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
          classList = classList.replace(classRE(klass), " ")
        })
        className(this, classList.trim())
      })
    },
    toggleClass: function(name, when){
      return this.each(function(idx){
        var $this = $(this), names = funcArg(this, name, idx, className(this))
        names.split(/\s+/g).forEach(function(klass){
          (when === undefined ? !$this.hasClass(klass) : when) ?
            $this.addClass(klass) : $this.removeClass(klass)
        })
      })
    },
    scrollTop: function(){
      if (!this.length) return
      return ('scrollTop' in this[0]) ? this[0].scrollTop : this[0].scrollY
    },
    position: function() {
      if (!this.length) return

      var elem = this[0],
        // Get *real* offsetParent
        offsetParent = this.offsetParent(),
        // Get correct offsets
        offset       = this.offset(),
        parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

      // Subtract element margins
      // note: when an element has margin: auto the offsetLeft and marginLeft
      // are the same in Safari causing offset.left to incorrectly be 0
      offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
      offset.left -= parseFloat( $(elem).css('margin-left') ) || 0

      // Add offsetParent borders
      parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
      parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0

      // Subtract the two offsets
      return {
        top:  offset.top  - parentOffset.top,
        left: offset.left - parentOffset.left
      }
    },
    offsetParent: function() {
      return this.map(function(){
        var parent = this.offsetParent || document.body
        while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
          parent = parent.offsetParent
        return parent
      })
    }
  }

  // for now
  $.fn.detach = $.fn.remove

  // Generate the `width` and `height` functions
  ;['width', 'height'].forEach(function(dimension){
    $.fn[dimension] = function(value){
      var offset, el = this[0],
        Dimension = dimension.replace(/./, function(m){ return m[0].toUpperCase() })
      if (value === undefined) return isWindow(el) ? el['inner' + Dimension] :
        isDocument(el) ? el.documentElement['offset' + Dimension] :
        (offset = this.offset()) && offset[dimension]
      else return this.each(function(idx){
        el = $(this)
        el.css(dimension, funcArg(this, value, idx, el[dimension]()))
      })
    }
  })

  function traverseNode(node, fun) {
    fun(node)
    for (var key in node.childNodes) traverseNode(node.childNodes[key], fun)
  }

  // Generate the `after`, `prepend`, `before`, `append`,
  // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
  adjacencyOperators.forEach(function(operator, operatorIndex) {
    var inside = operatorIndex % 2 //=> prepend, append

    $.fn[operator] = function(){
      // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
      var argType, nodes = $.map(arguments, function(arg) {
            argType = type(arg)
            return argType == "object" || argType == "array" || arg == null ?
              arg : zepto.fragment(arg)
          }),
          parent, copyByClone = this.length > 1
      if (nodes.length < 1) return this

      return this.each(function(_, target){
        parent = inside ? target : target.parentNode

        // convert all methods to a "before" operation
        target = operatorIndex == 0 ? target.nextSibling :
                 operatorIndex == 1 ? target.firstChild :
                 operatorIndex == 2 ? target :
                 null

        nodes.forEach(function(node){
          if (copyByClone) node = node.cloneNode(true)
          else if (!parent) return $(node).remove()

          traverseNode(parent.insertBefore(node, target), function(el){
            if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
               (!el.type || el.type === 'text/javascript') && !el.src)
              window['eval'].call(window, el.innerHTML)
          })
        })
      })
    }

    // after    => insertAfter
    // prepend  => prependTo
    // before   => insertBefore
    // append   => appendTo
    $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
      $(html)[operator](this)
      return this
    }
  })

  zepto.Z.prototype = $.fn

  // Export internal API functions in the `$.zepto` namespace
  zepto.uniq = uniq
  zepto.deserializeValue = deserializeValue
  $.zepto = zepto

  return $
})()

window.Zepto = Zepto
'$' in window || (window.$ = Zepto)

;(function(undefined){
  if (String.prototype.trim === undefined) // fix for iOS 3.2
    String.prototype.trim = function(){ return this.replace(/^\s+|\s+$/g, '') }

  // For iOS 3.x
  // from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduce
  if (Array.prototype.reduce === undefined)
    Array.prototype.reduce = function(fun){
      if(this === void 0 || this === null) throw new TypeError()
      var t = Object(this), len = t.length >>> 0, k = 0, accumulator
      if(typeof fun != 'function') throw new TypeError()
      if(len == 0 && arguments.length == 1) throw new TypeError()

      if(arguments.length >= 2)
       accumulator = arguments[1]
      else
        do{
          if(k in t){
            accumulator = t[k++]
            break
          }
          if(++k >= len) throw new TypeError()
        } while (true)

      while (k < len){
        if(k in t) accumulator = fun.call(undefined, accumulator, t[k], k, t)
        k++
      }
      return accumulator
    }

})()

;(function($){
  var $$ = $.zepto.qsa, handlers = {}, _zid = 1, specialEvents={},
      hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

  function zid(element) {
    return element._zid || (element._zid = _zid++)
  }
  function findHandlers(element, event, fn, selector) {
    event = parse(event)
    if (event.ns) var matcher = matcherFor(event.ns)
    return (handlers[zid(element)] || []).filter(function(handler) {
      return handler
        && (!event.e  || handler.e == event.e)
        && (!event.ns || matcher.test(handler.ns))
        && (!fn       || zid(handler.fn) === zid(fn))
        && (!selector || handler.sel == selector)
    })
  }
  function parse(event) {
    var parts = ('' + event).split('.')
    return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
  }
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
  }

  function eachEvent(events, fn, iterator){
    if ($.type(events) != "string") $.each(events, iterator)
    else events.split(/\s/).forEach(function(type){ iterator(type, fn) })
  }

  function eventCapture(handler, captureSetting) {
    return handler.del &&
      (handler.e == 'focus' || handler.e == 'blur') ||
      !!captureSetting
  }

  function realEvent(type) {
    return hover[type] || type
  }

  function add(element, events, fn, selector, getDelegate, capture){
    var id = zid(element), set = (handlers[id] || (handlers[id] = []))
    eachEvent(events, fn, function(event, fn){
      var handler   = parse(event)
      handler.fn    = fn
      handler.sel   = selector
      // emulate mouseenter, mouseleave
      if (handler.e in hover) fn = function(e){
        var related = e.relatedTarget
        if (!related || (related !== this && !$.contains(this, related)))
          return handler.fn.apply(this, arguments)
      }
      handler.del   = getDelegate && getDelegate(fn, event)
      var callback  = handler.del || fn
      handler.proxy = function (e) {
        var result = callback.apply(element, [e].concat(e.data))
        if (result === false) e.preventDefault(), e.stopPropagation()
        return result
      }
      handler.i = set.length
      set.push(handler)
      element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
    })
  }
  function remove(element, events, fn, selector, capture){
    var id = zid(element)
    eachEvent(events || '', fn, function(event, fn){
      findHandlers(element, event, fn, selector).forEach(function(handler){
        delete handlers[id][handler.i]
        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
      })
    })
  }

  $.event = { add: add, remove: remove }

  $.proxy = function(fn, context) {
    if ($.isFunction(fn)) {
      var proxyFn = function(){ return fn.apply(context, arguments) }
      proxyFn._zid = zid(fn)
      return proxyFn
    } else if (typeof context == 'string') {
      return $.proxy(fn[context], fn)
    } else {
      throw new TypeError("expected function")
    }
  }

  $.fn.bind = function(event, callback){
    return this.each(function(){
      add(this, event, callback)
    })
  }
  $.fn.unbind = function(event, callback){
    return this.each(function(){
      remove(this, event, callback)
    })
  }
  $.fn.one = function(event, callback){
    return this.each(function(i, element){
      add(this, event, callback, null, function(fn, type){
        return function(){
          var result = fn.apply(element, arguments)
          remove(element, type, fn)
          return result
        }
      })
    })
  }

  var returnTrue = function(){return true},
      returnFalse = function(){return false},
      ignoreProperties = /^([A-Z]|layer[XY]$)/,
      eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
      }
  function createProxy(event) {
    var key, proxy = { originalEvent: event }
    for (key in event)
      if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

    $.each(eventMethods, function(name, predicate) {
      proxy[name] = function(){
        this[predicate] = returnTrue
        return event[name].apply(event, arguments)
      }
      proxy[predicate] = returnFalse
    })
    return proxy
  }

  // emulates the 'defaultPrevented' property for browsers that have none
  function fix(event) {
    if (!('defaultPrevented' in event)) {
      event.defaultPrevented = false
      var prevent = event.preventDefault
      event.preventDefault = function() {
        this.defaultPrevented = true
        prevent.call(this)
      }
    }
  }

  $.fn.delegate = function(selector, event, callback){
    return this.each(function(i, element){
      add(element, event, callback, selector, function(fn){
        return function(e){
          var evt, match = $(e.target).closest(selector, element).get(0)
          if (match) {
            evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
            return fn.apply(match, [evt].concat([].slice.call(arguments, 1)))
          }
        }
      })
    })
  }
  $.fn.undelegate = function(selector, event, callback){
    return this.each(function(){
      remove(this, event, callback, selector)
    })
  }

  $.fn.live = function(event, callback){
    $(document.body).delegate(this.selector, event, callback)
    return this
  }
  $.fn.die = function(event, callback){
    $(document.body).undelegate(this.selector, event, callback)
    return this
  }

  $.fn.on = function(event, selector, callback){
    return !selector || $.isFunction(selector) ?
      this.bind(event, selector || callback) : this.delegate(selector, event, callback)
  }
  $.fn.off = function(event, selector, callback){
    return !selector || $.isFunction(selector) ?
      this.unbind(event, selector || callback) : this.undelegate(selector, event, callback)
  }

  $.fn.trigger = function(event, data){
    if (typeof event == 'string' || $.isPlainObject(event)) event = $.Event(event)
    fix(event)
    event.data = data
    return this.each(function(){
      // items in the collection might not be DOM elements
      // (todo: possibly support events on plain old objects)
      if('dispatchEvent' in this) this.dispatchEvent(event)
    })
  }

  // triggers event handlers on current element just as if an event occurred,
  // doesn't trigger an actual event, doesn't bubble
  $.fn.triggerHandler = function(event, data){
    var e, result
    this.each(function(i, element){
      e = createProxy(typeof event == 'string' ? $.Event(event) : event)
      e.data = data
      e.target = element
      $.each(findHandlers(element, event.type || event), function(i, handler){
        result = handler.proxy(e)
        if (e.isImmediatePropagationStopped()) return false
      })
    })
    return result
  }

  // shortcut methods for `.bind(event, fn)` for each event type
  ;('focusin focusout load resize scroll unload click dblclick '+
  'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
  'change select keydown keypress keyup error').split(' ').forEach(function(event) {
    $.fn[event] = function(callback) {
      return callback ?
        this.bind(event, callback) :
        this.trigger(event)
    }
  })

  ;['focus', 'blur'].forEach(function(name) {
    $.fn[name] = function(callback) {
      if (callback) this.bind(name, callback)
      else this.each(function(){
        try { this[name]() }
        catch(e) {}
      })
      return this
    }
  })

  $.Event = function(type, props) {
    if (typeof type != 'string') props = type, type = props.type
    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
    event.initEvent(type, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null)
    event.isDefaultPrevented = function(){ return this.defaultPrevented }
    return event
  }

})(Zepto)

;(function($){
  var jsonpID = 0,
      document = window.document,
      key,
      name,
      rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      scriptTypeRE = /^(?:text|application)\/javascript/i,
      xmlTypeRE = /^(?:text|application)\/xml/i,
      jsonType = 'application/json',
      htmlType = 'text/html',
      blankRE = /^\s*$/

  // trigger a custom event and return false if it was cancelled
  function triggerAndReturn(context, eventName, data) {
    var event = $.Event(eventName)
    $(context).trigger(event, data)
    return !event.defaultPrevented
  }

  // trigger an Ajax "global" event
  function triggerGlobal(settings, context, eventName, data) {
    if (settings.global) return triggerAndReturn(context || document, eventName, data)
  }

  // Number of active Ajax requests
  $.active = 0

  function ajaxStart(settings) {
    if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
  }
  function ajaxStop(settings) {
    if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
  }

  // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
  function ajaxBeforeSend(xhr, settings) {
    var context = settings.context
    if (settings.beforeSend.call(context, xhr, settings) === false ||
        triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
      return false

    triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
  }
  function ajaxSuccess(data, xhr, settings) {
    var context = settings.context, status = 'success'
    settings.success.call(context, data, status, xhr)
    triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
    ajaxComplete(status, xhr, settings)
  }
  // type: "timeout", "error", "abort", "parsererror"
  function ajaxError(error, type, xhr, settings) {
    var context = settings.context
    settings.error.call(context, xhr, type, error)
    triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error])
    ajaxComplete(type, xhr, settings)
  }
  // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
  function ajaxComplete(status, xhr, settings) {
    var context = settings.context
    settings.complete.call(context, xhr, status)
    triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
    ajaxStop(settings)
  }

  // Empty function, used as default callback
  function empty() {}

  $.ajaxJSONP = function(options){
    if (!('type' in options)) return $.ajax(options)

    var callbackName = 'jsonp' + (++jsonpID),
      script = document.createElement('script'),
      cleanup = function() {
        clearTimeout(abortTimeout)
        $(script).remove()
        delete window[callbackName]
      },
      abort = function(type){
        cleanup()
        // In case of manual abort or timeout, keep an empty function as callback
        // so that the SCRIPT tag that eventually loads won't result in an error.
        if (!type || type == 'timeout') window[callbackName] = empty
        ajaxError(null, type || 'abort', xhr, options)
      },
      xhr = { abort: abort }, abortTimeout

    if (ajaxBeforeSend(xhr, options) === false) {
      abort('abort')
      return false
    }

    window[callbackName] = function(data){
      cleanup()
      ajaxSuccess(data, xhr, options)
    }

    script.onerror = function() { abort('error') }

    script.src = options.url.replace(/=\?/, '=' + callbackName)
    $('head').append(script)

    if (options.timeout > 0) abortTimeout = setTimeout(function(){
      abort('timeout')
    }, options.timeout)

    return xhr
  }

  $.ajaxSettings = {
    // Default type of request
    type: 'GET',
    // Callback that is executed before request
    beforeSend: empty,
    // Callback that is executed if the request succeeds
    success: empty,
    // Callback that is executed the the server drops error
    error: empty,
    // Callback that is executed on request complete (both: error and success)
    complete: empty,
    // The context for the callbacks
    context: null,
    // Whether to trigger "global" Ajax events
    global: true,
    // Transport
    xhr: function () {
      return new window.XMLHttpRequest()
    },
    // MIME types mapping
    accepts: {
      script: 'text/javascript, application/javascript',
      json:   jsonType,
      xml:    'application/xml, text/xml',
      html:   htmlType,
      text:   'text/plain'
    },
    // Whether the request is to another domain
    crossDomain: false,
    // Default timeout
    timeout: 0,
    // Whether data should be serialized to string
    processData: true,
    // Whether the browser should be allowed to cache GET responses
    cache: true
  }

  function mimeToDataType(mime) {
    if (mime) mime = mime.split(';', 2)[0]
    return mime && ( mime == htmlType ? 'html' :
      mime == jsonType ? 'json' :
      scriptTypeRE.test(mime) ? 'script' :
      xmlTypeRE.test(mime) && 'xml' ) || 'text'
  }

  function appendQuery(url, query) {
    return (url + '&' + query).replace(/[&?]{1,2}/, '?')
  }

  // serialize payload and append it to the URL for GET requests
  function serializeData(options) {
    if (options.processData && options.data && $.type(options.data) != "string")
      options.data = $.param(options.data, options.traditional)
    if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
      options.url = appendQuery(options.url, options.data)
  }

  $.ajax = function(options){
    var settings = $.extend({}, options || {})
    for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

    ajaxStart(settings)

    if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
      RegExp.$2 != window.location.host

    if (!settings.url) settings.url = window.location.toString()
    serializeData(settings)
    if (settings.cache === false) settings.url = appendQuery(settings.url, '_=' + Date.now())

    var dataType = settings.dataType, hasPlaceholder = /=\?/.test(settings.url)
    if (dataType == 'jsonp' || hasPlaceholder) {
      if (!hasPlaceholder) settings.url = appendQuery(settings.url, 'callback=?')
      return $.ajaxJSONP(settings)
    }

    var mime = settings.accepts[dataType],
        baseHeaders = { },
        protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
        xhr = settings.xhr(), abortTimeout

    if (!settings.crossDomain) baseHeaders['X-Requested-With'] = 'XMLHttpRequest'
    if (mime) {
      baseHeaders['Accept'] = mime
      if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
      xhr.overrideMimeType && xhr.overrideMimeType(mime)
    }
    if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
      baseHeaders['Content-Type'] = (settings.contentType || 'application/x-www-form-urlencoded')
    settings.headers = $.extend(baseHeaders, settings.headers || {})

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        xhr.onreadystatechange = empty;
        clearTimeout(abortTimeout)
        var result, error = false
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
          dataType = dataType || mimeToDataType(xhr.getResponseHeader('content-type'))
          result = xhr.responseText

          try {
            // http://perfectionkills.com/global-eval-what-are-the-options/
            if (dataType == 'script')    (1,eval)(result)
            else if (dataType == 'xml')  result = xhr.responseXML
            else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
          } catch (e) { error = e }

          if (error) ajaxError(error, 'parsererror', xhr, settings)
          else ajaxSuccess(result, xhr, settings)
        } else {
          ajaxError(null, xhr.status ? 'error' : 'abort', xhr, settings)
        }
      }
    }

    var async = 'async' in settings ? settings.async : true
    xhr.open(settings.type, settings.url, async)

    for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name])

    if (ajaxBeforeSend(xhr, settings) === false) {
      xhr.abort()
      return false
    }

    if (settings.timeout > 0) abortTimeout = setTimeout(function(){
        xhr.onreadystatechange = empty
        xhr.abort()
        ajaxError(null, 'timeout', xhr, settings)
      }, settings.timeout)

    // avoid sending empty string (#319)
    xhr.send(settings.data ? settings.data : null)
    return xhr
  }

  // handle optional data/success arguments
  function parseArguments(url, data, success, dataType) {
    var hasData = !$.isFunction(data)
    return {
      url:      url,
      data:     hasData  ? data : undefined,
      success:  !hasData ? data : $.isFunction(success) ? success : undefined,
      dataType: hasData  ? dataType || success : success
    }
  }

  $.get = function(url, data, success, dataType){
    return $.ajax(parseArguments.apply(null, arguments))
  }

  $.post = function(url, data, success, dataType){
    var options = parseArguments.apply(null, arguments)
    options.type = 'POST'
    return $.ajax(options)
  }

  $.getJSON = function(url, data, success){
    var options = parseArguments.apply(null, arguments)
    options.dataType = 'json'
    return $.ajax(options)
  }

  $.fn.load = function(url, data, success){
    if (!this.length) return this
    var self = this, parts = url.split(/\s/), selector,
        options = parseArguments(url, data, success),
        callback = options.success
    if (parts.length > 1) options.url = parts[0], selector = parts[1]
    options.success = function(response){
      self.html(selector ?
        $('<div>').html(response.replace(rscript, "")).find(selector)
        : response)
      callback && callback.apply(self, arguments)
    }
    $.ajax(options)
    return this
  }

  var escape = encodeURIComponent

  function serialize(params, obj, traditional, scope){
    var type, array = $.isArray(obj)
    $.each(obj, function(key, value) {
      type = $.type(value)
      if (scope) key = traditional ? scope : scope + '[' + (array ? '' : key) + ']'
      // handle data in serializeArray() format
      if (!scope && array) params.add(value.name, value.value)
      // recurse into nested objects
      else if (type == "array" || (!traditional && type == "object"))
        serialize(params, value, traditional, key)
      else params.add(key, value)
    })
  }

  $.param = function(obj, traditional){
    var params = []
    params.add = function(k, v){ this.push(escape(k) + '=' + escape(v)) }
    serialize(params, obj, traditional)
    return params.join('&').replace(/%20/g, '+')
  }
})(Zepto)

;(function ($) {
  $.fn.serializeArray = function () {
    var result = [], el
    $( Array.prototype.slice.call(this.get(0).elements) ).each(function () {
      el = $(this)
      var type = el.attr('type')
      if (this.nodeName.toLowerCase() != 'fieldset' &&
        !this.disabled && type != 'submit' && type != 'reset' && type != 'button' &&
        ((type != 'radio' && type != 'checkbox') || this.checked))
        result.push({
          name: el.attr('name'),
          value: el.val()
        })
    })
    return result
  }

  $.fn.serialize = function () {
    var result = []
    this.serializeArray().forEach(function (elm) {
      result.push( encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value) )
    })
    return result.join('&')
  }

  $.fn.submit = function (callback) {
    if (callback) this.bind('submit', callback)
    else if (this.length) {
      var event = $.Event('submit')
      this.eq(0).trigger(event)
      if (!event.defaultPrevented) this.get(0).submit()
    }
    return this
  }

})(Zepto)

;(function($) {
  var data = {}, dataAttr = $.fn.data, camelize = $.camelCase,
    exp = $.expando = 'Zepto' + (+new Date())

  // Get value from node:
  // 1. first try key as given,
  // 2. then try camelized key,
  // 3. fall back to reading "data-*" attribute.
  function getData(node, name) {
    var id = node[exp], store = id && data[id]
    if (name === undefined) return store || setData(node)
    else {
      if (store) {
        if (name in store) return store[name]
        var camelName = camelize(name)
        if (camelName in store) return store[camelName]
      }
      return dataAttr.call($(node), name)
    }
  }

  // Store value under camelized key on node
  function setData(node, name, value) {
    var id = node[exp] || (node[exp] = ++$.uuid),
      store = data[id] || (data[id] = attributeData(node))
    if (name !== undefined) store[camelize(name)] = value
    return store
  }

  // Read all "data-*" attributes from a node
  function attributeData(node) {
    var store = {}
    $.each(node.attributes, function(i, attr){
      if (attr.name.indexOf('data-') == 0)
        store[camelize(attr.name.replace('data-', ''))] =
          $.zepto.deserializeValue(attr.value)
    })
    return store
  }

  $.fn.data = function(name, value) {
    return value === undefined ?
      // set multiple values via object
      $.isPlainObject(name) ?
        this.each(function(i, node){
          $.each(name, function(key, value){ setData(node, key, value) })
        }) :
        // get value from first element
        this.length == 0 ? undefined : getData(this[0], name) :
      // set value on all elements
      this.each(function(){ setData(this, name, value) })
  }

  $.fn.removeData = function(names) {
    if (typeof names == 'string') names = names.split(/\s+/)
    return this.each(function(){
      var id = this[exp], store = id && data[id]
      if (store) $.each(names, function(){ delete store[camelize(this)] })
    })
  }
})(Zepto)

;(function($){
  var touch = {},
    touchTimeout, tapTimeout, swipeTimeout,
    longTapDelay = 750, longTapTimeout

  function parentIfText(node) {
    return 'tagName' in node ? node : node.parentNode
  }

  function swipeDirection(x1, x2, y1, y2) {
    var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2)
    return xDelta >= yDelta ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
  }

  function longTap() {
    longTapTimeout = null
    if (touch.last) {
      touch.el.trigger('longTap')
      touch = {}
    }
  }

  function cancelLongTap() {
    if (longTapTimeout) clearTimeout(longTapTimeout)
    longTapTimeout = null
  }

  function cancelAll() {
    if (touchTimeout) clearTimeout(touchTimeout)
    if (tapTimeout) clearTimeout(tapTimeout)
    if (swipeTimeout) clearTimeout(swipeTimeout)
    if (longTapTimeout) clearTimeout(longTapTimeout)
    touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null
    touch = {}
  }

  $(document).ready(function(){
    var now, delta

    $(document.body)
      .bind('touchstart', function(e){
        now = Date.now()
        delta = now - (touch.last || now)
        touch.el = $(parentIfText(e.touches[0].target))
        touchTimeout && clearTimeout(touchTimeout)
        touch.x1 = e.touches[0].pageX
        touch.y1 = e.touches[0].pageY
        if (delta > 0 && delta <= 250) touch.isDoubleTap = true
        touch.last = now
        longTapTimeout = setTimeout(longTap, longTapDelay)
      })
      .bind('touchmove', function(e){
        cancelLongTap()
        touch.x2 = e.touches[0].pageX
        touch.y2 = e.touches[0].pageY
        if (Math.abs(touch.x1 - touch.x2) > 10)
          e.preventDefault()
      })
      .bind('touchend', function(e){
         cancelLongTap()

        // swipe
        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
            (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))

          swipeTimeout = setTimeout(function() {
            touch.el.trigger('swipe')
            touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
            touch = {}
          }, 0)

        // normal tap
        else if ('last' in touch)

          // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
          // ('tap' fires before 'scroll')
          tapTimeout = setTimeout(function() {

            // trigger universal 'tap' with the option to cancelTouch()
            // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
            var event = $.Event('tap')
            event.cancelTouch = cancelAll
            touch.el.trigger(event)

            // trigger double tap immediately
            if (touch.isDoubleTap) {
              touch.el.trigger('doubleTap')
              touch = {}
            }

            // trigger single tap after 250ms of inactivity
            else {
              touchTimeout = setTimeout(function(){
                touchTimeout = null
                touch.el.trigger('singleTap')
                touch = {}
              }, 250)
            }

          }, 0)

      })
      .bind('touchcancel', cancelAll)

    $(window).bind('scroll', cancelAll)
  })

  ;['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(m){
    $.fn[m] = function(callback){ return this.bind(m, callback) }
  })
})(Zepto)

if ( typeof define === "function") {
  define( "zepot", function () { return Zepto; } );
}

define('handlebars', function (require, exports, module) {


// lib/handlebars/base.js

/*jshint eqnull:true*/
this.Handlebars = {};

(function(Handlebars) {

Handlebars.VERSION = "1.0.rc.1";

Handlebars.helpers  = {};
Handlebars.partials = {};

Handlebars.registerHelper = function(name, fn, inverse) {
  if(inverse) { fn.not = inverse; }
  this.helpers[name] = fn;
};

Handlebars.registerPartial = function(name, str) {
  this.partials[name] = str;
};

Handlebars.registerHelper('helperMissing', function(arg) {
  if(arguments.length === 2) {
    return undefined;
  } else {
    throw new Error("Could not find property '" + arg + "'");
  }
});

var toString = Object.prototype.toString, functionType = "[object Function]";

Handlebars.registerHelper('blockHelperMissing', function(context, options) {
  var inverse = options.inverse || function() {}, fn = options.fn;


  var ret = "";
  var type = toString.call(context);

  if(type === functionType) { context = context.call(this); }

  if(context === true) {
    return fn(this);
  } else if(context === false || context == null) {
    return inverse(this);
  } else if(type === "[object Array]") {
    if(context.length > 0) {
      return Handlebars.helpers.each(context, options);
    } else {
      return inverse(this);
    }
  } else {
    return fn(context);
  }
});

Handlebars.K = function() {};

Handlebars.createFrame = Object.create || function(object) {
  Handlebars.K.prototype = object;
  var obj = new Handlebars.K();
  Handlebars.K.prototype = null;
  return obj;
};

Handlebars.registerHelper('each', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  var ret = "", data;

  if (options.data) {
    data = Handlebars.createFrame(options.data);
  }

  if(context && context.length > 0) {
    for(var i=0, j=context.length; i<j; i++) {
      if (data) { data.index = i; }
      ret = ret + fn(context[i], { data: data });
    }
  } else {
    ret = inverse(this);
  }
  return ret;
});

Handlebars.registerHelper('if', function(context, options) {
  var type = toString.call(context);
  if(type === functionType) { context = context.call(this); }

  if(!context || Handlebars.Utils.isEmpty(context)) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

Handlebars.registerHelper('unless', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  options.fn = inverse;
  options.inverse = fn;

  return Handlebars.helpers['if'].call(this, context, options);
});

Handlebars.registerHelper('with', function(context, options) {
  return options.fn(context);
});

Handlebars.registerHelper('log', function(context) {
  Handlebars.log(context);
});

}(this.Handlebars));
;
// lib/handlebars/compiler/parser.js
/* Jison generated parser */
var handlebars = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"root":3,"program":4,"EOF":5,"statements":6,"simpleInverse":7,"statement":8,"openInverse":9,"closeBlock":10,"openBlock":11,"mustache":12,"partial":13,"CONTENT":14,"COMMENT":15,"OPEN_BLOCK":16,"inMustache":17,"CLOSE":18,"OPEN_INVERSE":19,"OPEN_ENDBLOCK":20,"path":21,"OPEN":22,"OPEN_UNESCAPED":23,"OPEN_PARTIAL":24,"params":25,"hash":26,"DATA":27,"param":28,"STRING":29,"INTEGER":30,"BOOLEAN":31,"hashSegments":32,"hashSegment":33,"ID":34,"EQUALS":35,"pathSegments":36,"SEP":37,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",14:"CONTENT",15:"COMMENT",16:"OPEN_BLOCK",18:"CLOSE",19:"OPEN_INVERSE",20:"OPEN_ENDBLOCK",22:"OPEN",23:"OPEN_UNESCAPED",24:"OPEN_PARTIAL",27:"DATA",29:"STRING",30:"INTEGER",31:"BOOLEAN",34:"ID",35:"EQUALS",37:"SEP"},
productions_: [0,[3,2],[4,3],[4,1],[4,0],[6,1],[6,2],[8,3],[8,3],[8,1],[8,1],[8,1],[8,1],[11,3],[9,3],[10,3],[12,3],[12,3],[13,3],[13,4],[7,2],[17,3],[17,2],[17,2],[17,1],[17,1],[25,2],[25,1],[28,1],[28,1],[28,1],[28,1],[28,1],[26,1],[32,2],[32,1],[33,3],[33,3],[33,3],[33,3],[33,3],[21,1],[36,3],[36,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return $$[$0-1]; 
break;
case 2: this.$ = new yy.ProgramNode($$[$0-2], $$[$0]); 
break;
case 3: this.$ = new yy.ProgramNode($$[$0]); 
break;
case 4: this.$ = new yy.ProgramNode([]); 
break;
case 5: this.$ = [$$[$0]]; 
break;
case 6: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 7: this.$ = new yy.BlockNode($$[$0-2], $$[$0-1].inverse, $$[$0-1], $$[$0]); 
break;
case 8: this.$ = new yy.BlockNode($$[$0-2], $$[$0-1], $$[$0-1].inverse, $$[$0]); 
break;
case 9: this.$ = $$[$0]; 
break;
case 10: this.$ = $$[$0]; 
break;
case 11: this.$ = new yy.ContentNode($$[$0]); 
break;
case 12: this.$ = new yy.CommentNode($$[$0]); 
break;
case 13: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]); 
break;
case 14: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]); 
break;
case 15: this.$ = $$[$0-1]; 
break;
case 16: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]); 
break;
case 17: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1], true); 
break;
case 18: this.$ = new yy.PartialNode($$[$0-1]); 
break;
case 19: this.$ = new yy.PartialNode($$[$0-2], $$[$0-1]); 
break;
case 20: 
break;
case 21: this.$ = [[$$[$0-2]].concat($$[$0-1]), $$[$0]]; 
break;
case 22: this.$ = [[$$[$0-1]].concat($$[$0]), null]; 
break;
case 23: this.$ = [[$$[$0-1]], $$[$0]]; 
break;
case 24: this.$ = [[$$[$0]], null]; 
break;
case 25: this.$ = [[new yy.DataNode($$[$0])], null]; 
break;
case 26: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 27: this.$ = [$$[$0]]; 
break;
case 28: this.$ = $$[$0]; 
break;
case 29: this.$ = new yy.StringNode($$[$0]); 
break;
case 30: this.$ = new yy.IntegerNode($$[$0]); 
break;
case 31: this.$ = new yy.BooleanNode($$[$0]); 
break;
case 32: this.$ = new yy.DataNode($$[$0]); 
break;
case 33: this.$ = new yy.HashNode($$[$0]); 
break;
case 34: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 35: this.$ = [$$[$0]]; 
break;
case 36: this.$ = [$$[$0-2], $$[$0]]; 
break;
case 37: this.$ = [$$[$0-2], new yy.StringNode($$[$0])]; 
break;
case 38: this.$ = [$$[$0-2], new yy.IntegerNode($$[$0])]; 
break;
case 39: this.$ = [$$[$0-2], new yy.BooleanNode($$[$0])]; 
break;
case 40: this.$ = [$$[$0-2], new yy.DataNode($$[$0])]; 
break;
case 41: this.$ = new yy.IdNode($$[$0]); 
break;
case 42: $$[$0-2].push($$[$0]); this.$ = $$[$0-2]; 
break;
case 43: this.$ = [$$[$0]]; 
break;
}
},
table: [{3:1,4:2,5:[2,4],6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]},{1:[3]},{5:[1,16]},{5:[2,3],7:17,8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,19],20:[2,3],22:[1,13],23:[1,14],24:[1,15]},{5:[2,5],14:[2,5],15:[2,5],16:[2,5],19:[2,5],20:[2,5],22:[2,5],23:[2,5],24:[2,5]},{4:20,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]},{4:21,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]},{5:[2,9],14:[2,9],15:[2,9],16:[2,9],19:[2,9],20:[2,9],22:[2,9],23:[2,9],24:[2,9]},{5:[2,10],14:[2,10],15:[2,10],16:[2,10],19:[2,10],20:[2,10],22:[2,10],23:[2,10],24:[2,10]},{5:[2,11],14:[2,11],15:[2,11],16:[2,11],19:[2,11],20:[2,11],22:[2,11],23:[2,11],24:[2,11]},{5:[2,12],14:[2,12],15:[2,12],16:[2,12],19:[2,12],20:[2,12],22:[2,12],23:[2,12],24:[2,12]},{17:22,21:23,27:[1,24],34:[1,26],36:25},{17:27,21:23,27:[1,24],34:[1,26],36:25},{17:28,21:23,27:[1,24],34:[1,26],36:25},{17:29,21:23,27:[1,24],34:[1,26],36:25},{21:30,34:[1,26],36:25},{1:[2,1]},{6:31,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]},{5:[2,6],14:[2,6],15:[2,6],16:[2,6],19:[2,6],20:[2,6],22:[2,6],23:[2,6],24:[2,6]},{17:22,18:[1,32],21:23,27:[1,24],34:[1,26],36:25},{10:33,20:[1,34]},{10:35,20:[1,34]},{18:[1,36]},{18:[2,24],21:41,25:37,26:38,27:[1,45],28:39,29:[1,42],30:[1,43],31:[1,44],32:40,33:46,34:[1,47],36:25},{18:[2,25]},{18:[2,41],27:[2,41],29:[2,41],30:[2,41],31:[2,41],34:[2,41],37:[1,48]},{18:[2,43],27:[2,43],29:[2,43],30:[2,43],31:[2,43],34:[2,43],37:[2,43]},{18:[1,49]},{18:[1,50]},{18:[1,51]},{18:[1,52],21:53,34:[1,26],36:25},{5:[2,2],8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,2],22:[1,13],23:[1,14],24:[1,15]},{14:[2,20],15:[2,20],16:[2,20],19:[2,20],22:[2,20],23:[2,20],24:[2,20]},{5:[2,7],14:[2,7],15:[2,7],16:[2,7],19:[2,7],20:[2,7],22:[2,7],23:[2,7],24:[2,7]},{21:54,34:[1,26],36:25},{5:[2,8],14:[2,8],15:[2,8],16:[2,8],19:[2,8],20:[2,8],22:[2,8],23:[2,8],24:[2,8]},{14:[2,14],15:[2,14],16:[2,14],19:[2,14],20:[2,14],22:[2,14],23:[2,14],24:[2,14]},{18:[2,22],21:41,26:55,27:[1,45],28:56,29:[1,42],30:[1,43],31:[1,44],32:40,33:46,34:[1,47],36:25},{18:[2,23]},{18:[2,27],27:[2,27],29:[2,27],30:[2,27],31:[2,27],34:[2,27]},{18:[2,33],33:57,34:[1,58]},{18:[2,28],27:[2,28],29:[2,28],30:[2,28],31:[2,28],34:[2,28]},{18:[2,29],27:[2,29],29:[2,29],30:[2,29],31:[2,29],34:[2,29]},{18:[2,30],27:[2,30],29:[2,30],30:[2,30],31:[2,30],34:[2,30]},{18:[2,31],27:[2,31],29:[2,31],30:[2,31],31:[2,31],34:[2,31]},{18:[2,32],27:[2,32],29:[2,32],30:[2,32],31:[2,32],34:[2,32]},{18:[2,35],34:[2,35]},{18:[2,43],27:[2,43],29:[2,43],30:[2,43],31:[2,43],34:[2,43],35:[1,59],37:[2,43]},{34:[1,60]},{14:[2,13],15:[2,13],16:[2,13],19:[2,13],20:[2,13],22:[2,13],23:[2,13],24:[2,13]},{5:[2,16],14:[2,16],15:[2,16],16:[2,16],19:[2,16],20:[2,16],22:[2,16],23:[2,16],24:[2,16]},{5:[2,17],14:[2,17],15:[2,17],16:[2,17],19:[2,17],20:[2,17],22:[2,17],23:[2,17],24:[2,17]},{5:[2,18],14:[2,18],15:[2,18],16:[2,18],19:[2,18],20:[2,18],22:[2,18],23:[2,18],24:[2,18]},{18:[1,61]},{18:[1,62]},{18:[2,21]},{18:[2,26],27:[2,26],29:[2,26],30:[2,26],31:[2,26],34:[2,26]},{18:[2,34],34:[2,34]},{35:[1,59]},{21:63,27:[1,67],29:[1,64],30:[1,65],31:[1,66],34:[1,26],36:25},{18:[2,42],27:[2,42],29:[2,42],30:[2,42],31:[2,42],34:[2,42],37:[2,42]},{5:[2,19],14:[2,19],15:[2,19],16:[2,19],19:[2,19],20:[2,19],22:[2,19],23:[2,19],24:[2,19]},{5:[2,15],14:[2,15],15:[2,15],16:[2,15],19:[2,15],20:[2,15],22:[2,15],23:[2,15],24:[2,15]},{18:[2,36],34:[2,36]},{18:[2,37],34:[2,37]},{18:[2,38],34:[2,38]},{18:[2,39],34:[2,39]},{18:[2,40],34:[2,40]}],
defaultActions: {16:[2,1],24:[2,25],38:[2,23],55:[2,21]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == "undefined")
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === "function")
        this.parseError = this.yy.parseError;
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || 1;
        if (typeof token !== "number") {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == "undefined") {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
        if (typeof action === "undefined" || !action.length || !action[0]) {
            var errStr = "";
            if (!recovering) {
                expected = [];
                for (p in table[state])
                    if (this.terminals_[p] && p > 2) {
                        expected.push("'" + this.terminals_[p] + "'");
                    }
                if (this.lexer.showPosition) {
                    errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                } else {
                    errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1?"end of input":"'" + (this.terminals_[symbol] || symbol) + "'");
                }
                this.parseError(errStr, {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }
        }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0)
                    recovering--;
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column};
            if (ranges) {
                yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
            }
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== "undefined") {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}
};
/* Jison generated lexer */
var lexer = (function(){
var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        if (this.options.ranges) this.yylloc.range = [0,0];
        this.offset = 0;
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) this.yylloc.range[1]++;

        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length-len-1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length-1);
        this.matched = this.matched.substr(0, this.matched.length-1);

        if (lines.length-1) this.yylineno -= lines.length-1;
        var r = this.yylloc.range;

        this.yylloc = {first_line: this.yylloc.first_line,
          last_line: this.yylineno+1,
          first_column: this.yylloc.first_column,
          last_column: lines ?
              (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length:
              this.yylloc.first_column - len
          };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
less:function (n) {
        this.unput(this.match.slice(n));
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            tempMatch,
            index,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (!this.options.flex) break;
            }
        }
        if (match) {
            lines = match[0].match(/(?:\r\n?|\n).*/g);
            if (lines) this.yylineno += lines.length;
            this.yylloc = {first_line: this.yylloc.last_line,
                           last_line: this.yylineno+1,
                           first_column: this.yylloc.last_column,
                           last_column: lines ? lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length};
            this.yytext += match[0];
            this.match += match[0];
            this.matches = match;
            this.yyleng = this.yytext.length;
            if (this.options.ranges) {
                this.yylloc.range = [this.offset, this.offset += this.yyleng];
            }
            this._more = false;
            this._input = this._input.slice(match[0].length);
            this.matched += match[0];
            token = this.performAction.call(this, this.yy, this, rules[index],this.conditionStack[this.conditionStack.length-1]);
            if (this.done && this._input) this.done = false;
            if (token) return token;
            else return;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    },
topState:function () {
        return this.conditionStack[this.conditionStack.length-2];
    },
pushState:function begin(condition) {
        this.begin(condition);
    }});
lexer.options = {};
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0:
                                   if(yy_.yytext.slice(-1) !== "\\") this.begin("mu");
                                   if(yy_.yytext.slice(-1) === "\\") yy_.yytext = yy_.yytext.substr(0,yy_.yyleng-1), this.begin("emu");
                                   if(yy_.yytext) return 14;
                                 
break;
case 1: return 14; 
break;
case 2:
                                   if(yy_.yytext.slice(-1) !== "\\") this.popState();
                                   if(yy_.yytext.slice(-1) === "\\") yy_.yytext = yy_.yytext.substr(0,yy_.yyleng-1);
                                   return 14;
                                 
break;
case 3: return 24; 
break;
case 4: return 16; 
break;
case 5: return 20; 
break;
case 6: return 19; 
break;
case 7: return 19; 
break;
case 8: return 23; 
break;
case 9: return 23; 
break;
case 10: yy_.yytext = yy_.yytext.substr(3,yy_.yyleng-5); this.popState(); return 15; 
break;
case 11: return 22; 
break;
case 12: return 35; 
break;
case 13: return 34; 
break;
case 14: return 34; 
break;
case 15: return 37; 
break;
case 16: /*ignore whitespace*/ 
break;
case 17: this.popState(); return 18; 
break;
case 18: this.popState(); return 18; 
break;
case 19: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2).replace(/\\"/g,'"'); return 29; 
break;
case 20: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2).replace(/\\"/g,'"'); return 29; 
break;
case 21: yy_.yytext = yy_.yytext.substr(1); return 27; 
break;
case 22: return 31; 
break;
case 23: return 31; 
break;
case 24: return 30; 
break;
case 25: return 34; 
break;
case 26: yy_.yytext = yy_.yytext.substr(1, yy_.yyleng-2); return 34; 
break;
case 27: return 'INVALID'; 
break;
case 28: return 5; 
break;
}
};
lexer.rules = [/^(?:[^\x00]*?(?=(\{\{)))/,/^(?:[^\x00]+)/,/^(?:[^\x00]{2,}?(?=(\{\{|$)))/,/^(?:\{\{>)/,/^(?:\{\{#)/,/^(?:\{\{\/)/,/^(?:\{\{\^)/,/^(?:\{\{\s*else\b)/,/^(?:\{\{\{)/,/^(?:\{\{&)/,/^(?:\{\{![\s\S]*?\}\})/,/^(?:\{\{)/,/^(?:=)/,/^(?:\.(?=[} ]))/,/^(?:\.\.)/,/^(?:[\/.])/,/^(?:\s+)/,/^(?:\}\}\})/,/^(?:\}\})/,/^(?:"(\\["]|[^"])*")/,/^(?:'(\\[']|[^'])*')/,/^(?:@[a-zA-Z]+)/,/^(?:true(?=[}\s]))/,/^(?:false(?=[}\s]))/,/^(?:[0-9]+(?=[}\s]))/,/^(?:[a-zA-Z0-9_$-]+(?=[=}\s\/.]))/,/^(?:\[[^\]]*\])/,/^(?:.)/,/^(?:$)/];
lexer.conditions = {"mu":{"rules":[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],"inclusive":false},"emu":{"rules":[2],"inclusive":false},"INITIAL":{"rules":[0,1,28],"inclusive":true}};
return lexer;})()
parser.lexer = lexer;
function Parser () { this.yy = {}; }Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = handlebars;
exports.Parser = handlebars.Parser;
exports.parse = function () { return handlebars.parse.apply(handlebars, arguments); }
exports.main = function commonjsMain(args) {
    if (!args[1])
        throw new Error('Usage: '+args[0]+' FILE');
    var source, cwd;
    if (typeof process !== 'undefined') {
        source = require('fs').readFileSync(require('path').resolve(args[1]), "utf8");
    } else {
        source = require("file").path(require("file").cwd()).join(args[1]).read({charset: "utf-8"});
    }
    return exports.parser.parse(source);
}
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(typeof process !== 'undefined' ? process.argv.slice(1) : require("system").args);
}
};
;
// lib/handlebars/compiler/base.js
Handlebars.Parser = handlebars;

Handlebars.parse = function(string) {
  Handlebars.Parser.yy = Handlebars.AST;
  return Handlebars.Parser.parse(string);
};

Handlebars.print = function(ast) {
  return new Handlebars.PrintVisitor().accept(ast);
};

Handlebars.logger = {
  DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, level: 3,

  // override in the host environment
  log: function(level, str) {}
};

Handlebars.log = function(level, str) { Handlebars.logger.log(level, str); };
;
// lib/handlebars/compiler/ast.js
(function() {

  Handlebars.AST = {};

  Handlebars.AST.ProgramNode = function(statements, inverse) {
    this.type = "program";
    this.statements = statements;
    if(inverse) { this.inverse = new Handlebars.AST.ProgramNode(inverse); }
  };

  Handlebars.AST.MustacheNode = function(rawParams, hash, unescaped) {
    this.type = "mustache";
    this.escaped = !unescaped;
    this.hash = hash;

    var id = this.id = rawParams[0];
    var params = this.params = rawParams.slice(1);

    // a mustache is an eligible helper if:
    // * its id is simple (a single part, not `this` or `..`)
    var eligibleHelper = this.eligibleHelper = id.isSimple;

    // a mustache is definitely a helper if:
    // * it is an eligible helper, and
    // * it has at least one parameter or hash segment
    this.isHelper = eligibleHelper && (params.length || hash);

    // if a mustache is an eligible helper but not a definite
    // helper, it is ambiguous, and will be resolved in a later
    // pass or at runtime.
  };

  Handlebars.AST.PartialNode = function(id, context) {
    this.type    = "partial";

    // TODO: disallow complex IDs

    this.id      = id;
    this.context = context;
  };

  var verifyMatch = function(open, close) {
    if(open.original !== close.original) {
      throw new Handlebars.Exception(open.original + " doesn't match " + close.original);
    }
  };

  Handlebars.AST.BlockNode = function(mustache, program, inverse, close) {
    verifyMatch(mustache.id, close);
    this.type = "block";
    this.mustache = mustache;
    this.program  = program;
    this.inverse  = inverse;

    if (this.inverse && !this.program) {
      this.isInverse = true;
    }
  };

  Handlebars.AST.ContentNode = function(string) {
    this.type = "content";
    this.string = string;
  };

  Handlebars.AST.HashNode = function(pairs) {
    this.type = "hash";
    this.pairs = pairs;
  };

  Handlebars.AST.IdNode = function(parts) {
    this.type = "ID";
    this.original = parts.join(".");

    var dig = [], depth = 0;

    for(var i=0,l=parts.length; i<l; i++) {
      var part = parts[i];

      if(part === "..") { depth++; }
      else if(part === "." || part === "this") { this.isScoped = true; }
      else { dig.push(part); }
    }

    this.parts    = dig;
    this.string   = dig.join('.');
    this.depth    = depth;

    // an ID is simple if it only has one part, and that part is not
    // `..` or `this`.
    this.isSimple = parts.length === 1 && !this.isScoped && depth === 0;
  };

  Handlebars.AST.DataNode = function(id) {
    this.type = "DATA";
    this.id = id;
  };

  Handlebars.AST.StringNode = function(string) {
    this.type = "STRING";
    this.string = string;
  };

  Handlebars.AST.IntegerNode = function(integer) {
    this.type = "INTEGER";
    this.integer = integer;
  };

  Handlebars.AST.BooleanNode = function(bool) {
    this.type = "BOOLEAN";
    this.bool = bool;
  };

  Handlebars.AST.CommentNode = function(comment) {
    this.type = "comment";
    this.comment = comment;
  };

})();;
// lib/handlebars/utils.js
Handlebars.Exception = function(message) {
  var tmp = Error.prototype.constructor.apply(this, arguments);

  for (var p in tmp) {
    if (tmp.hasOwnProperty(p)) { this[p] = tmp[p]; }
  }

  this.message = tmp.message;
};
Handlebars.Exception.prototype = new Error();

// Build out our basic SafeString type
Handlebars.SafeString = function(string) {
  this.string = string;
};
Handlebars.SafeString.prototype.toString = function() {
  return this.string.toString();
};

(function() {
  var escape = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };

  var badChars = /[&<>"'`]/g;
  var possible = /[&<>"'`]/;

  var escapeChar = function(chr) {
    return escape[chr] || "&amp;";
  };

  Handlebars.Utils = {
    escapeExpression: function(string) {
      // don't escape SafeStrings, since they're already safe
      if (string instanceof Handlebars.SafeString) {
        return string.toString();
      } else if (string == null || string === false) {
        return "";
      }

      if(!possible.test(string)) { return string; }
      return string.replace(badChars, escapeChar);
    },

    isEmpty: function(value) {
      if (typeof value === "undefined") {
        return true;
      } else if (value === null) {
        return true;
      } else if (value === false) {
        return true;
      } else if(Object.prototype.toString.call(value) === "[object Array]" && value.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  };
})();;
// lib/handlebars/compiler/compiler.js

/*jshint eqnull:true*/
Handlebars.Compiler = function() {};
Handlebars.JavaScriptCompiler = function() {};

(function(Compiler, JavaScriptCompiler) {
  // the foundHelper register will disambiguate helper lookup from finding a
  // function in a context. This is necessary for mustache compatibility, which
  // requires that context functions in blocks are evaluated by blockHelperMissing,
  // and then proceed as if the resulting value was provided to blockHelperMissing.

  Compiler.prototype = {
    compiler: Compiler,

    disassemble: function() {
      var opcodes = this.opcodes, opcode, out = [], params, param;

      for (var i=0, l=opcodes.length; i<l; i++) {
        opcode = opcodes[i];

        if (opcode.opcode === 'DECLARE') {
          out.push("DECLARE " + opcode.name + "=" + opcode.value);
        } else {
          params = [];
          for (var j=0; j<opcode.args.length; j++) {
            param = opcode.args[j];
            if (typeof param === "string") {
              param = "\"" + param.replace("\n", "\\n") + "\"";
            }
            params.push(param);
          }
          out.push(opcode.opcode + " " + params.join(" "));
        }
      }

      return out.join("\n");
    },

    guid: 0,

    compile: function(program, options) {
      this.children = [];
      this.depths = {list: []};
      this.options = options;

      // These changes will propagate to the other compiler components
      var knownHelpers = this.options.knownHelpers;
      this.options.knownHelpers = {
        'helperMissing': true,
        'blockHelperMissing': true,
        'each': true,
        'if': true,
        'unless': true,
        'with': true,
        'log': true
      };
      if (knownHelpers) {
        for (var name in knownHelpers) {
          this.options.knownHelpers[name] = knownHelpers[name];
        }
      }

      return this.program(program);
    },

    accept: function(node) {
      return this[node.type](node);
    },

    program: function(program) {
      var statements = program.statements, statement;
      this.opcodes = [];

      for(var i=0, l=statements.length; i<l; i++) {
        statement = statements[i];
        this[statement.type](statement);
      }
      this.isSimple = l === 1;

      this.depths.list = this.depths.list.sort(function(a, b) {
        return a - b;
      });

      return this;
    },

    compileProgram: function(program) {
      var result = new this.compiler().compile(program, this.options);
      var guid = this.guid++, depth;

      this.usePartial = this.usePartial || result.usePartial;

      this.children[guid] = result;

      for(var i=0, l=result.depths.list.length; i<l; i++) {
        depth = result.depths.list[i];

        if(depth < 2) { continue; }
        else { this.addDepth(depth - 1); }
      }

      return guid;
    },

    block: function(block) {
      var mustache = block.mustache,
          program = block.program,
          inverse = block.inverse;

      if (program) {
        program = this.compileProgram(program);
      }

      if (inverse) {
        inverse = this.compileProgram(inverse);
      }

      var type = this.classifyMustache(mustache);

      if (type === "helper") {
        this.helperMustache(mustache, program, inverse);
      } else if (type === "simple") {
        this.simpleMustache(mustache);

        // now that the simple mustache is resolved, we need to
        // evaluate it by executing `blockHelperMissing`
        this.opcode('pushProgram', program);
        this.opcode('pushProgram', inverse);
        this.opcode('pushLiteral', '{}');
        this.opcode('blockValue');
      } else {
        this.ambiguousMustache(mustache, program, inverse);

        // now that the simple mustache is resolved, we need to
        // evaluate it by executing `blockHelperMissing`
        this.opcode('pushProgram', program);
        this.opcode('pushProgram', inverse);
        this.opcode('pushLiteral', '{}');
        this.opcode('ambiguousBlockValue');
      }

      this.opcode('append');
    },

    hash: function(hash) {
      var pairs = hash.pairs, pair, val;

      this.opcode('push', '{}');

      for(var i=0, l=pairs.length; i<l; i++) {
        pair = pairs[i];
        val  = pair[1];

        this.accept(val);
        this.opcode('assignToHash', pair[0]);
      }
    },

    partial: function(partial) {
      var id = partial.id;
      this.usePartial = true;

      if(partial.context) {
        this.ID(partial.context);
      } else {
        this.opcode('push', 'depth0');
      }

      this.opcode('invokePartial', id.original);
      this.opcode('append');
    },

    content: function(content) {
      this.opcode('appendContent', content.string);
    },

    mustache: function(mustache) {
      var options = this.options;
      var type = this.classifyMustache(mustache);

      if (type === "simple") {
        this.simpleMustache(mustache);
      } else if (type === "helper") {
        this.helperMustache(mustache);
      } else {
        this.ambiguousMustache(mustache);
      }

      if(mustache.escaped && !options.noEscape) {
        this.opcode('appendEscaped');
      } else {
        this.opcode('append');
      }
    },

    ambiguousMustache: function(mustache, program, inverse) {
      var id = mustache.id, name = id.parts[0];

      this.opcode('getContext', id.depth);

      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);

      this.opcode('invokeAmbiguous', name);
    },

    simpleMustache: function(mustache, program, inverse) {
      var id = mustache.id;

      if (id.type === 'DATA') {
        this.DATA(id);
      } else if (id.parts.length) {
        this.ID(id);
      } else {
        // Simplified ID for `this`
        this.addDepth(id.depth);
        this.opcode('getContext', id.depth);
        this.opcode('pushContext');
      }

      this.opcode('resolvePossibleLambda');
    },

    helperMustache: function(mustache, program, inverse) {
      var params = this.setupFullMustacheParams(mustache, program, inverse),
          name = mustache.id.parts[0];

      if (this.options.knownHelpers[name]) {
        this.opcode('invokeKnownHelper', params.length, name);
      } else if (this.knownHelpersOnly) {
        throw new Error("You specified knownHelpersOnly, but used the unknown helper " + name);
      } else {
        this.opcode('invokeHelper', params.length, name);
      }
    },

    ID: function(id) {
      this.addDepth(id.depth);
      this.opcode('getContext', id.depth);

      var name = id.parts[0];
      if (!name) {
        this.opcode('pushContext');
      } else {
        this.opcode('lookupOnContext', id.parts[0]);
      }

      for(var i=1, l=id.parts.length; i<l; i++) {
        this.opcode('lookup', id.parts[i]);
      }
    },

    DATA: function(data) {
      this.options.data = true;
      this.opcode('lookupData', data.id);
    },

    STRING: function(string) {
      this.opcode('pushString', string.string);
    },

    INTEGER: function(integer) {
      this.opcode('pushLiteral', integer.integer);
    },

    BOOLEAN: function(bool) {
      this.opcode('pushLiteral', bool.bool);
    },

    comment: function() {},

    // HELPERS
    opcode: function(name) {
      this.opcodes.push({ opcode: name, args: [].slice.call(arguments, 1) });
    },

    declare: function(name, value) {
      this.opcodes.push({ opcode: 'DECLARE', name: name, value: value });
    },

    addDepth: function(depth) {
      if(isNaN(depth)) { throw new Error("EWOT"); }
      if(depth === 0) { return; }

      if(!this.depths[depth]) {
        this.depths[depth] = true;
        this.depths.list.push(depth);
      }
    },

    classifyMustache: function(mustache) {
      var isHelper   = mustache.isHelper;
      var isEligible = mustache.eligibleHelper;
      var options    = this.options;

      // if ambiguous, we can possibly resolve the ambiguity now
      if (isEligible && !isHelper) {
        var name = mustache.id.parts[0];

        if (options.knownHelpers[name]) {
          isHelper = true;
        } else if (options.knownHelpersOnly) {
          isEligible = false;
        }
      }

      if (isHelper) { return "helper"; }
      else if (isEligible) { return "ambiguous"; }
      else { return "simple"; }
    },

    pushParams: function(params) {
      var i = params.length, param;

      while(i--) {
        param = params[i];

        if(this.options.stringParams) {
          if(param.depth) {
            this.addDepth(param.depth);
          }

          this.opcode('getContext', param.depth || 0);
          this.opcode('pushStringParam', param.string);
        } else {
          this[param.type](param);
        }
      }
    },

    setupMustacheParams: function(mustache) {
      var params = mustache.params;
      this.pushParams(params);

      if(mustache.hash) {
        this.hash(mustache.hash);
      } else {
        this.opcode('pushLiteral', '{}');
      }

      return params;
    },

    // this will replace setupMustacheParams when we're done
    setupFullMustacheParams: function(mustache, program, inverse) {
      var params = mustache.params;
      this.pushParams(params);

      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);

      if(mustache.hash) {
        this.hash(mustache.hash);
      } else {
        this.opcode('pushLiteral', '{}');
      }

      return params;
    }
  };

  var Literal = function(value) {
    this.value = value;
  };

  JavaScriptCompiler.prototype = {
    // PUBLIC API: You can override these methods in a subclass to provide
    // alternative compiled forms for name lookup and buffering semantics
    nameLookup: function(parent, name, type) {
      if (/^[0-9]+$/.test(name)) {
        return parent + "[" + name + "]";
      } else if (JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
        return parent + "." + name;
      }
      else {
        return parent + "['" + name + "']";
      }
    },

    appendToBuffer: function(string) {
      if (this.environment.isSimple) {
        return "return " + string + ";";
      } else {
        return "buffer += " + string + ";";
      }
    },

    initializeBuffer: function() {
      return this.quotedString("");
    },

    namespace: "Handlebars",
    // END PUBLIC API

    compile: function(environment, options, context, asObject) {
      this.environment = environment;
      this.options = options || {};

      Handlebars.log(Handlebars.logger.DEBUG, this.environment.disassemble() + "\n\n");

      this.name = this.environment.name;
      this.isChild = !!context;
      this.context = context || {
        programs: [],
        aliases: { }
      };

      this.preamble();

      this.stackSlot = 0;
      this.stackVars = [];
      this.registers = { list: [] };
      this.compileStack = [];

      this.compileChildren(environment, options);

      var opcodes = environment.opcodes, opcode;

      this.i = 0;

      for(l=opcodes.length; this.i<l; this.i++) {
        opcode = opcodes[this.i];

        if(opcode.opcode === 'DECLARE') {
          this[opcode.name] = opcode.value;
        } else {
          this[opcode.opcode].apply(this, opcode.args);
        }
      }

      return this.createFunctionContext(asObject);
    },

    nextOpcode: function() {
      var opcodes = this.environment.opcodes, opcode = opcodes[this.i + 1];
      return opcodes[this.i + 1];
    },

    eat: function(opcode) {
      this.i = this.i + 1;
    },

    preamble: function() {
      var out = [];

      if (!this.isChild) {
        var namespace = this.namespace;
        var copies = "helpers = helpers || " + namespace + ".helpers;";
        if (this.environment.usePartial) { copies = copies + " partials = partials || " + namespace + ".partials;"; }
        if (this.options.data) { copies = copies + " data = data || {};"; }
        out.push(copies);
      } else {
        out.push('');
      }

      if (!this.environment.isSimple) {
        out.push(", buffer = " + this.initializeBuffer());
      } else {
        out.push("");
      }

      // track the last context pushed into place to allow skipping the
      // getContext opcode when it would be a noop
      this.lastContext = 0;
      this.source = out;
    },

    createFunctionContext: function(asObject) {
      var locals = this.stackVars.concat(this.registers.list);

      if(locals.length > 0) {
        this.source[1] = this.source[1] + ", " + locals.join(", ");
      }

      // Generate minimizer alias mappings
      if (!this.isChild) {
        var aliases = [];
        for (var alias in this.context.aliases) {
          this.source[1] = this.source[1] + ', ' + alias + '=' + this.context.aliases[alias];
        }
      }

      if (this.source[1]) {
        this.source[1] = "var " + this.source[1].substring(2) + ";";
      }

      // Merge children
      if (!this.isChild) {
        this.source[1] += '\n' + this.context.programs.join('\n') + '\n';
      }

      if (!this.environment.isSimple) {
        this.source.push("return buffer;");
      }

      var params = this.isChild ? ["depth0", "data"] : ["Handlebars", "depth0", "helpers", "partials", "data"];

      for(var i=0, l=this.environment.depths.list.length; i<l; i++) {
        params.push("depth" + this.environment.depths.list[i]);
      }

      if (asObject) {
        params.push(this.source.join("\n  "));

        return Function.apply(this, params);
      } else {
        var functionSource = 'function ' + (this.name || '') + '(' + params.join(',') + ') {\n  ' + this.source.join("\n  ") + '}';
        Handlebars.log(Handlebars.logger.DEBUG, functionSource + "\n\n");
        return functionSource;
      }
    },

    // [blockValue]
    //
    // On stack, before: hash, inverse, program, value
    // On stack, after: return value of blockHelperMissing
    //
    // The purpose of this opcode is to take a block of the form
    // `{{#foo}}...{{/foo}}`, resolve the value of `foo`, and
    // replace it on the stack with the result of properly
    // invoking blockHelperMissing.
    blockValue: function() {
      this.context.aliases.blockHelperMissing = 'helpers.blockHelperMissing';

      var params = ["depth0"];
      this.setupParams(0, params);

      this.replaceStack(function(current) {
        params.splice(1, 0, current);
        return current + " = blockHelperMissing.call(" + params.join(", ") + ")";
      });
    },

    // [ambiguousBlockValue]
    //
    // On stack, before: hash, inverse, program, value
    // Compiler value, before: lastHelper=value of last found helper, if any
    // On stack, after, if no lastHelper: same as [blockValue]
    // On stack, after, if lastHelper: value
    ambiguousBlockValue: function() {
      this.context.aliases.blockHelperMissing = 'helpers.blockHelperMissing';

      var params = ["depth0"];
      this.setupParams(0, params);

      var current = this.topStack();
      params.splice(1, 0, current);

      this.source.push("if (!" + this.lastHelper + ") { " + current + " = blockHelperMissing.call(" + params.join(", ") + "); }");
    },

    // [appendContent]
    //
    // On stack, before: ...
    // On stack, after: ...
    //
    // Appends the string value of `content` to the current buffer
    appendContent: function(content) {
      this.source.push(this.appendToBuffer(this.quotedString(content)));
    },

    // [append]
    //
    // On stack, before: value, ...
    // On stack, after: ...
    //
    // Coerces `value` to a String and appends it to the current buffer.
    //
    // If `value` is truthy, or 0, it is coerced into a string and appended
    // Otherwise, the empty string is appended
    append: function() {
      var local = this.popStack();
      this.source.push("if(" + local + " || " + local + " === 0) { " + this.appendToBuffer(local) + " }");
      if (this.environment.isSimple) {
        this.source.push("else { " + this.appendToBuffer("''") + " }");
      }
    },

    // [appendEscaped]
    //
    // On stack, before: value, ...
    // On stack, after: ...
    //
    // Escape `value` and append it to the buffer
    appendEscaped: function() {
      var opcode = this.nextOpcode(), extra = "";
      this.context.aliases.escapeExpression = 'this.escapeExpression';

      if(opcode && opcode.opcode === 'appendContent') {
        extra = " + " + this.quotedString(opcode.args[0]);
        this.eat(opcode);
      }

      this.source.push(this.appendToBuffer("escapeExpression(" + this.popStack() + ")" + extra));
    },

    // [getContext]
    //
    // On stack, before: ...
    // On stack, after: ...
    // Compiler value, after: lastContext=depth
    //
    // Set the value of the `lastContext` compiler value to the depth
    getContext: function(depth) {
      if(this.lastContext !== depth) {
        this.lastContext = depth;
      }
    },

    // [lookupOnContext]
    //
    // On stack, before: ...
    // On stack, after: currentContext[name], ...
    //
    // Looks up the value of `name` on the current context and pushes
    // it onto the stack.
    lookupOnContext: function(name) {
      this.pushStack(this.nameLookup('depth' + this.lastContext, name, 'context'));
    },

    // [pushContext]
    //
    // On stack, before: ...
    // On stack, after: currentContext, ...
    //
    // Pushes the value of the current context onto the stack.
    pushContext: function() {
      this.pushStackLiteral('depth' + this.lastContext);
    },

    // [resolvePossibleLambda]
    //
    // On stack, before: value, ...
    // On stack, after: resolved value, ...
    //
    // If the `value` is a lambda, replace it on the stack by
    // the return value of the lambda
    resolvePossibleLambda: function() {
      this.context.aliases.functionType = '"function"';

      this.replaceStack(function(current) {
        return "typeof " + current + " === functionType ? " + current + "() : " + current;
      });
    },

    // [lookup]
    //
    // On stack, before: value, ...
    // On stack, after: value[name], ...
    //
    // Replace the value on the stack with the result of looking
    // up `name` on `value`
    lookup: function(name) {
      this.replaceStack(function(current) {
        return current + " == null || " + current + " === false ? " + current + " : " + this.nameLookup(current, name, 'context');
      });
    },

    // [lookupData]
    //
    // On stack, before: ...
    // On stack, after: data[id], ...
    //
    // Push the result of looking up `id` on the current data
    lookupData: function(id) {
      this.pushStack(this.nameLookup('data', id, 'data'));
    },

    // [pushStringParam]
    //
    // On stack, before: ...
    // On stack, after: string, currentContext, ...
    //
    // This opcode is designed for use in string mode, which
    // provides the string value of a parameter along with its
    // depth rather than resolving it immediately.
    pushStringParam: function(string) {
      this.pushStackLiteral('depth' + this.lastContext);
      this.pushString(string);
    },

    // [pushString]
    //
    // On stack, before: ...
    // On stack, after: quotedString(string), ...
    //
    // Push a quoted version of `string` onto the stack
    pushString: function(string) {
      this.pushStackLiteral(this.quotedString(string));
    },

    // [push]
    //
    // On stack, before: ...
    // On stack, after: expr, ...
    //
    // Push an expression onto the stack
    push: function(expr) {
      this.pushStack(expr);
    },

    // [pushLiteral]
    //
    // On stack, before: ...
    // On stack, after: value, ...
    //
    // Pushes a value onto the stack. This operation prevents
    // the compiler from creating a temporary variable to hold
    // it.
    pushLiteral: function(value) {
      this.pushStackLiteral(value);
    },

    // [pushProgram]
    //
    // On stack, before: ...
    // On stack, after: program(guid), ...
    //
    // Push a program expression onto the stack. This takes
    // a compile-time guid and converts it into a runtime-accessible
    // expression.
    pushProgram: function(guid) {
      if (guid != null) {
        this.pushStackLiteral(this.programExpression(guid));
      } else {
        this.pushStackLiteral(null);
      }
    },

    // [invokeHelper]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of helper invocation
    //
    // Pops off the helper's parameters, invokes the helper,
    // and pushes the helper's return value onto the stack.
    //
    // If the helper is not found, `helperMissing` is called.
    invokeHelper: function(paramSize, name) {
      this.context.aliases.helperMissing = 'helpers.helperMissing';

      var helper = this.lastHelper = this.setupHelper(paramSize, name);
      this.register('foundHelper', helper.name);

      this.pushStack("foundHelper ? foundHelper.call(" +
        helper.callParams + ") " + ": helperMissing.call(" +
        helper.helperMissingParams + ")");
    },

    // [invokeKnownHelper]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of helper invocation
    //
    // This operation is used when the helper is known to exist,
    // so a `helperMissing` fallback is not required.
    invokeKnownHelper: function(paramSize, name) {
      var helper = this.setupHelper(paramSize, name);
      this.pushStack(helper.name + ".call(" + helper.callParams + ")");
    },

    // [invokeAmbiguous]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of disambiguation
    //
    // This operation is used when an expression like `{{foo}}`
    // is provided, but we don't know at compile-time whether it
    // is a helper or a path.
    //
    // This operation emits more code than the other options,
    // and can be avoided by passing the `knownHelpers` and
    // `knownHelpersOnly` flags at compile-time.
    invokeAmbiguous: function(name) {
      this.context.aliases.functionType = '"function"';

      this.pushStackLiteral('{}');
      var helper = this.setupHelper(0, name);

      var helperName = this.lastHelper = this.nameLookup('helpers', name, 'helper');
      this.register('foundHelper', helperName);

      var nonHelper = this.nameLookup('depth' + this.lastContext, name, 'context');
      var nextStack = this.nextStack();

      this.source.push('if (foundHelper) { ' + nextStack + ' = foundHelper.call(' + helper.callParams + '); }');
      this.source.push('else { ' + nextStack + ' = ' + nonHelper + '; ' + nextStack + ' = typeof ' + nextStack + ' === functionType ? ' + nextStack + '() : ' + nextStack + '; }');
    },

    // [invokePartial]
    //
    // On stack, before: context, ...
    // On stack after: result of partial invocation
    //
    // This operation pops off a context, invokes a partial with that context,
    // and pushes the result of the invocation back.
    invokePartial: function(name) {
      var params = [this.nameLookup('partials', name, 'partial'), "'" + name + "'", this.popStack(), "helpers", "partials"];

      if (this.options.data) {
        params.push("data");
      }

      this.context.aliases.self = "this";
      this.pushStack("self.invokePartial(" + params.join(", ") + ");");
    },

    // [assignToHash]
    //
    // On stack, before: value, hash, ...
    // On stack, after: hash, ...
    //
    // Pops a value and hash off the stack, assigns `hash[key] = value`
    // and pushes the hash back onto the stack.
    assignToHash: function(key) {
      var value = this.popStack();
      var hash = this.topStack();

      this.source.push(hash + "['" + key + "'] = " + value + ";");
    },

    // HELPERS

    compiler: JavaScriptCompiler,

    compileChildren: function(environment, options) {
      var children = environment.children, child, compiler;

      for(var i=0, l=children.length; i<l; i++) {
        child = children[i];
        compiler = new this.compiler();

        this.context.programs.push('');     // Placeholder to prevent name conflicts for nested children
        var index = this.context.programs.length;
        child.index = index;
        child.name = 'program' + index;
        this.context.programs[index] = compiler.compile(child, options, this.context);
      }
    },

    programExpression: function(guid) {
      this.context.aliases.self = "this";

      if(guid == null) {
        return "self.noop";
      }

      var child = this.environment.children[guid],
          depths = child.depths.list, depth;

      var programParams = [child.index, child.name, "data"];

      for(var i=0, l = depths.length; i<l; i++) {
        depth = depths[i];

        if(depth === 1) { programParams.push("depth0"); }
        else { programParams.push("depth" + (depth - 1)); }
      }

      if(depths.length === 0) {
        return "self.program(" + programParams.join(", ") + ")";
      } else {
        programParams.shift();
        return "self.programWithDepth(" + programParams.join(", ") + ")";
      }
    },

    register: function(name, val) {
      this.useRegister(name);
      this.source.push(name + " = " + val + ";");
    },

    useRegister: function(name) {
      if(!this.registers[name]) {
        this.registers[name] = true;
        this.registers.list.push(name);
      }
    },

    pushStackLiteral: function(item) {
      this.compileStack.push(new Literal(item));
      return item;
    },

    pushStack: function(item) {
      this.source.push(this.incrStack() + " = " + item + ";");
      this.compileStack.push("stack" + this.stackSlot);
      return "stack" + this.stackSlot;
    },

    replaceStack: function(callback) {
      var item = callback.call(this, this.topStack());

      this.source.push(this.topStack() + " = " + item + ";");
      return "stack" + this.stackSlot;
    },

    nextStack: function(skipCompileStack) {
      var name = this.incrStack();
      this.compileStack.push("stack" + this.stackSlot);
      return name;
    },

    incrStack: function() {
      this.stackSlot++;
      if(this.stackSlot > this.stackVars.length) { this.stackVars.push("stack" + this.stackSlot); }
      return "stack" + this.stackSlot;
    },

    popStack: function() {
      var item = this.compileStack.pop();

      if (item instanceof Literal) {
        return item.value;
      } else {
        this.stackSlot--;
        return item;
      }
    },

    topStack: function() {
      var item = this.compileStack[this.compileStack.length - 1];

      if (item instanceof Literal) {
        return item.value;
      } else {
        return item;
      }
    },

    quotedString: function(str) {
      return '"' + str
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r') + '"';
    },

    setupHelper: function(paramSize, name) {
      var params = [];
      this.setupParams(paramSize, params);
      var foundHelper = this.nameLookup('helpers', name, 'helper');

      return {
        params: params,
        name: foundHelper,
        callParams: ["depth0"].concat(params).join(", "),
        helperMissingParams: ["depth0", this.quotedString(name)].concat(params).join(", ")
      };
    },

    // the params and contexts arguments are passed in arrays
    // to fill in
    setupParams: function(paramSize, params) {
      var options = [], contexts = [], param, inverse, program;

      options.push("hash:" + this.popStack());

      inverse = this.popStack();
      program = this.popStack();

      // Avoid setting fn and inverse if neither are set. This allows
      // helpers to do a check for `if (options.fn)`
      if (program || inverse) {
        if (!program) {
          this.context.aliases.self = "this";
          program = "self.noop";
        }

        if (!inverse) {
         this.context.aliases.self = "this";
          inverse = "self.noop";
        }

        options.push("inverse:" + inverse);
        options.push("fn:" + program);
      }

      for(var i=0; i<paramSize; i++) {
        param = this.popStack();
        params.push(param);

        if(this.options.stringParams) {
          contexts.push(this.popStack());
        }
      }

      if (this.options.stringParams) {
        options.push("contexts:[" + contexts.join(",") + "]");
      }

      if(this.options.data) {
        options.push("data:data");
      }

      params.push("{" + options.join(",") + "}");
      return params.join(", ");
    }
  };

  var reservedWords = (
    "break else new var" +
    " case finally return void" +
    " catch for switch while" +
    " continue function this with" +
    " default if throw" +
    " delete in try" +
    " do instanceof typeof" +
    " abstract enum int short" +
    " boolean export interface static" +
    " byte extends long super" +
    " char final native synchronized" +
    " class float package throws" +
    " const goto private transient" +
    " debugger implements protected volatile" +
    " double import public let yield"
  ).split(" ");

  var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};

  for(var i=0, l=reservedWords.length; i<l; i++) {
    compilerWords[reservedWords[i]] = true;
  }

  JavaScriptCompiler.isValidJavaScriptVariableName = function(name) {
    if(!JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(name)) {
      return true;
    }
    return false;
  };

})(Handlebars.Compiler, Handlebars.JavaScriptCompiler);

Handlebars.precompile = function(string, options) {
  options = options || {};

  var ast = Handlebars.parse(string);
  var environment = new Handlebars.Compiler().compile(ast, options);
  return new Handlebars.JavaScriptCompiler().compile(environment, options);
};

Handlebars.compile = function(string, options) {
  options = options || {};

  var compiled;
  function compile() {
    var ast = Handlebars.parse(string);
    var environment = new Handlebars.Compiler().compile(ast, options);
    var templateSpec = new Handlebars.JavaScriptCompiler().compile(environment, options, undefined, true);
    return Handlebars.template(templateSpec);
  }

  // Template is only compiled on first use and cached after that point.
  return function(context, options) {
    if (!compiled) {
      compiled = compile();
    }
    return compiled.call(this, context, options);
  };
};
;
// lib/handlebars/runtime.js
Handlebars.VM = {
  template: function(templateSpec) {
    // Just add water
    var container = {
      escapeExpression: Handlebars.Utils.escapeExpression,
      invokePartial: Handlebars.VM.invokePartial,
      programs: [],
      program: function(i, fn, data) {
        var programWrapper = this.programs[i];
        if(data) {
          return Handlebars.VM.program(fn, data);
        } else if(programWrapper) {
          return programWrapper;
        } else {
          programWrapper = this.programs[i] = Handlebars.VM.program(fn);
          return programWrapper;
        }
      },
      programWithDepth: Handlebars.VM.programWithDepth,
      noop: Handlebars.VM.noop
    };

    return function(context, options) {
      options = options || {};
      return templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);
    };
  },

  programWithDepth: function(fn, data, $depth) {
    var args = Array.prototype.slice.call(arguments, 2);

    return function(context, options) {
      options = options || {};

      return fn.apply(this, [context, options.data || data].concat(args));
    };
  },
  program: function(fn, data) {
    return function(context, options) {
      options = options || {};

      return fn(context, options.data || data);
    };
  },
  noop: function() { return ""; },
  invokePartial: function(partial, name, context, helpers, partials, data) {
    var options = { helpers: helpers, partials: partials, data: data };

    if(partial === undefined) {
      throw new Handlebars.Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    } else if (!Handlebars.compile) {
      throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    } else {
      partials[name] = Handlebars.compile(partial, {data: data !== undefined});
      return partials[name](context, options);
    }
  }
};

Handlebars.template = Handlebars.VM.template;
;



  return Handlebars;
});

/* Copyright (c) 2010-2012 Marcus Westin
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

;(function(){
	var store = {},
		win = window,
		doc = win.document,
		localStorageName = 'localStorage',
		globalStorageName = 'globalStorage',
		namespace = '__storejs__',
		storage

	store.disabled = false
	store.set = function(key, value) {}
	store.get = function(key) {}
	store.remove = function(key) {}
	store.clear = function() {}
	store.transact = function(key, defaultVal, transactionFn) {
		var val = store.get(key)
		if (transactionFn == null) {
			transactionFn = defaultVal
			defaultVal = null
		}
		if (typeof val == 'undefined') { val = defaultVal || {} }
		transactionFn(val)
		store.set(key, val)
	}
	store.getAll = function() {}

	store.serialize = function(value) {
		return JSON.stringify(value)
	}
	store.deserialize = function(value) {
		if (typeof value != 'string') { return undefined }
		try { return JSON.parse(value) }
		catch(e) { return value || undefined }
	}

	// Functions to encapsulate questionable FireFox 3.6.13 behavior
	// when about.config::dom.storage.enabled === false
	// See https://github.com/marcuswestin/store.js/issues#issue/13
	function isLocalStorageNameSupported() {
		try { return (localStorageName in win && win[localStorageName]) }
		catch(err) { return false }
	}

	function isGlobalStorageNameSupported() {
		try { return (globalStorageName in win && win[globalStorageName] && win[globalStorageName][win.location.hostname]) }
		catch(err) { return false }
	}

	if (isLocalStorageNameSupported()) {
		storage = win[localStorageName]
		store.set = function(key, val) {
			if (val === undefined) { return store.remove(key) }
			storage.setItem(key, store.serialize(val))
			return val
		}
		store.get = function(key) { return store.deserialize(storage.getItem(key)) }
		store.remove = function(key) { storage.removeItem(key) }
		store.clear = function() { storage.clear() }
		store.getAll = function() {
			var ret = {}
			for (var i=0; i<storage.length; ++i) {
				var key = storage.key(i)
				ret[key] = store.get(key)
			}
			return ret
		}
	} else if (isGlobalStorageNameSupported()) {
		storage = win[globalStorageName][win.location.hostname]
		store.set = function(key, val) {
			if (val === undefined) { return store.remove(key) }
			storage[key] = store.serialize(val)
			return val
		}
		store.get = function(key) { return store.deserialize(storage[key] && storage[key].value) }
		store.remove = function(key) { delete storage[key] }
		store.clear = function() { for (var key in storage ) { delete storage[key] } }
		store.getAll = function() {
			var ret = {}
			for (var i=0; i<storage.length; ++i) {
				var key = storage.key(i)
				ret[key] = store.get(key)
			}
			return ret
		}

	} else if (doc.documentElement.addBehavior) {
		var storageOwner,
			storageContainer
		// Since #userData storage applies only to specific paths, we need to
		// somehow link our data to a specific path.  We choose /favicon.ico
		// as a pretty safe option, since all browsers already make a request to
		// this URL anyway and being a 404 will not hurt us here.  We wrap an
		// iframe pointing to the favicon in an ActiveXObject(htmlfile) object
		// (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
		// since the iframe access rules appear to allow direct access and
		// manipulation of the document element, even for a 404 page.  This
		// document can be used instead of the current document (which would
		// have been limited to the current path) to perform #userData storage.
		try {
			storageContainer = new ActiveXObject('htmlfile')
			storageContainer.open()
			storageContainer.write('<s' + 'cript>document.w=window</s' + 'cript><iframe src="/favicon.ico"></frame>')
			storageContainer.close()
			storageOwner = storageContainer.w.frames[0].document
			storage = storageOwner.createElement('div')
		} catch(e) {
			// somehow ActiveXObject instantiation failed (perhaps some special
			// security settings or otherwse), fall back to per-path storage
			storage = doc.createElement('div')
			storageOwner = doc.body
		}
		function withIEStorage(storeFunction) {
			return function() {
				var args = Array.prototype.slice.call(arguments, 0)
				args.unshift(storage)
				// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
				// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
				storageOwner.appendChild(storage)
				storage.addBehavior('#default#userData')
				storage.load(localStorageName)
				var result = storeFunction.apply(store, args)
				storageOwner.removeChild(storage)
				return result
			}
		}

		// In IE7, keys may not contain special chars. See all of https://github.com/marcuswestin/store.js/issues/40
		var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
		function ieKeyFix(key) {
			return key.replace(forbiddenCharsRegex, '___')
		}
		store.set = withIEStorage(function(storage, key, val) {
			key = ieKeyFix(key)
			if (val === undefined) { return store.remove(key) }
			storage.setAttribute(key, store.serialize(val))
			storage.save(localStorageName)
			return val
		})
		store.get = withIEStorage(function(storage, key) {
			key = ieKeyFix(key)
			return store.deserialize(storage.getAttribute(key))
		})
		store.remove = withIEStorage(function(storage, key) {
			key = ieKeyFix(key)
			storage.removeAttribute(key)
			storage.save(localStorageName)
		})
		store.clear = withIEStorage(function(storage) {
			var attributes = storage.XMLDocument.documentElement.attributes
			storage.load(localStorageName)
			for (var i=0, attr; attr=attributes[i]; i++) {
				storage.removeAttribute(attr.name)
			}
			storage.save(localStorageName)
		})
		store.getAll = withIEStorage(function(storage) {
			var attributes = storage.XMLDocument.documentElement.attributes
			storage.load(localStorageName)
			var ret = {}
			for (var i=0, attr; attr=attributes[i]; ++i) {
				ret[attr] = store.get(attr)
			}
			return ret
		})
	}

	try {
		store.set(namespace, namespace)
		if (store.get(namespace) != namespace) { store.disabled = true }
		store.remove(namespace)
	} catch(e) {
		store.disabled = true
	}
	store.enabled = !store.disabled

	if (typeof module != 'undefined' && typeof module != 'function') { module.exports = store }
	else if (typeof define === 'function' && define.amd) { define(store) }
	else { this.store = store }

  if (typeof define === 'function') {
    define('store', function () { return store; });
  }

})();

/**
 * @author sole / http://soledadpenades.com
 * @author mrdoob / http://mrdoob.com
 * @author Robert Eisele / http://www.xarg.org
 * @author Philippe / http://philippe.elsass.me
 * @author Robert Penner / http://www.robertpenner.com/easing_terms_of_use.html
 * @author Paul Lewis / http://www.aerotwist.com/
 * @author lechecacharro
 * @author Josh Faul / http://jocafa.com/
 * @author egraether / http://egraether.com/
 * @author endel / http://endel.me
 */

var TWEEN = TWEEN || ( function () {

	var _tweens = [];

	return {

		REVISION: '10',

		getAll: function () {

			return _tweens;

		},

		removeAll: function () {

			_tweens = [];

		},

		add: function ( tween ) {

			_tweens.push( tween );

		},

		remove: function ( tween ) {

			var i = _tweens.indexOf( tween );

			if ( i !== -1 ) {

				_tweens.splice( i, 1 );

			}

		},

		update: function ( time ) {
      var numTweens = _tweens.length;

			if ( numTweens === 0 ) return false;

			var i = 0, _tween;

			time = time !== undefined ? time : ( window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() );

			while ( i < numTweens ) {

        _tween = _tweens[i];

				if ( _tween && _tween.update( time ) ) {

					i ++;

				} else {

					_tweens.splice( i, 1 );

					numTweens --;

				}

			}

			return true;

		}
	};

} )();

TWEEN.Tween = function ( object ) {

	var _object = object;
	var _valuesStart = {};
	var _valuesEnd = {};
	var _valuesStartRepeat = {};
	var _duration = 1000;
	var _repeat = 0;
	var _delayTime = 0;
	var _startTime = null;
	var _easingFunction = TWEEN.Easing.Linear.None;
	var _interpolationFunction = TWEEN.Interpolation.Linear;
	var _chainedTweens = [];
	var _onStartCallback = null;
	var _onStartCallbackFired = false;
	var _onUpdateCallback = null;
	var _onCompleteCallback = null;

	// Set all starting values present on the target object
	for ( var field in object ) {

		_valuesStart[ field ] = parseFloat(object[field], 10);

	}

	this.to = function ( properties, duration ) {

		if ( duration !== undefined ) {

			_duration = duration;

		}

		_valuesEnd = properties;

		return this;

	};

	this.start = function ( time ) {

		TWEEN.add( this );

		_onStartCallbackFired = false;

		_startTime = time !== undefined ? time : (window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() );
		_startTime += _delayTime;

		for ( var property in _valuesEnd ) {

			// check if an Array was provided as property value
			if ( _valuesEnd[ property ] instanceof Array ) {

				if ( _valuesEnd[ property ].length === 0 ) {

					continue;

				}

				// create a local copy of the Array with the start value at the front
				_valuesEnd[ property ] = [ _object[ property ] ].concat( _valuesEnd[ property ] );

			}

			_valuesStart[ property ] = _object[ property ];

			if( ( _valuesStart[ property ] instanceof Array ) === false ) {
				_valuesStart[ property ] *= 1.0; // Ensures we're using numbers, not strings
			}

			_valuesStartRepeat[ property ] = _valuesStart[ property ] || 0;

		}

		return this;

	};

	this.stop = function () {

		TWEEN.remove( this );
		return this;

	};

	this.delay = function ( amount ) {

		_delayTime = amount;
		return this;

	};

	this.repeat = function ( times ) {

		_repeat = times;
		return this;

	};

	this.easing = function ( easing ) {

		_easingFunction = easing;
		return this;

	};

	this.interpolation = function ( interpolation ) {

		_interpolationFunction = interpolation;
		return this;

	};

	this.chain = function () {

		_chainedTweens = arguments;
		return this;

	};

	this.onStart = function ( callback ) {

		_onStartCallback = callback;
		return this;

	};

	this.onUpdate = function ( callback ) {

		_onUpdateCallback = callback;
		return this;

	};

	this.onComplete = function ( callback ) {

		_onCompleteCallback = callback;
		return this;

	};

	this.update = function ( time ) {

		if ( time < _startTime ) {

			return true;

		}

		if ( _onStartCallbackFired === false ) {

			if ( _onStartCallback !== null ) {

				_onStartCallback.call( _object );

			}

			_onStartCallbackFired = true;

		}

		var elapsed = ( time - _startTime ) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		var value = _easingFunction( elapsed );

		for ( var property in _valuesEnd ) {

			var start = _valuesStart[ property ] || 0;
			var end = _valuesEnd[ property ];

			if ( end instanceof Array ) {

				_object[ property ] = _interpolationFunction( end, value );

			} else {

				if ( typeof(end) === "string" ) {
					end = start + parseFloat(end, 10);
				}

				_object[ property ] = start + ( end - start ) * value;

			}

		}

		if ( _onUpdateCallback !== null ) {

			_onUpdateCallback.call( _object, value );

		}

		if ( elapsed == 1 ) {

			if ( _repeat > 0 ) {

				if( isFinite( _repeat ) ) {
					_repeat--;
				}

				// reassign starting values, restart by making startTime = now
				for( var property in _valuesStartRepeat ) {

					if ( typeof( _valuesEnd[ property ] ) === "string" ) {
						_valuesStartRepeat[ property ] = _valuesStartRepeat[ property ] + parseFloat(_valuesEnd[ property ], 10);
					}

					_valuesStart[ property ] = _valuesStartRepeat[ property ];

				}

				_startTime = time + _delayTime;

				return true;

			} else {

				if ( _onCompleteCallback !== null ) {

					_onCompleteCallback.call( _object );

				}

				for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i ++ ) {

					_chainedTweens[ i ].start( time );

				}

				return false;

			}

		}

		return true;

	};

};

TWEEN.Easing = {

	Linear: {

		None: function ( k ) {

			return k;

		}

	},

	Quadratic: {

		In: function ( k ) {

			return k * k;

		},

		Out: function ( k ) {

			return k * ( 2 - k );

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
			return - 0.5 * ( --k * ( k - 2 ) - 1 );

		}

	},

	Cubic: {

		In: function ( k ) {

			return k * k * k;

		},

		Out: function ( k ) {

			return --k * k * k + 1;

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
			return 0.5 * ( ( k -= 2 ) * k * k + 2 );

		}

	},

	Quartic: {

		In: function ( k ) {

			return k * k * k * k;

		},

		Out: function ( k ) {

			return 1 - ( --k * k * k * k );

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
			return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );

		}

	},

	Quintic: {

		In: function ( k ) {

			return k * k * k * k * k;

		},

		Out: function ( k ) {

			return --k * k * k * k * k + 1;

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
			return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );

		}

	},

	Sinusoidal: {

		In: function ( k ) {

			return 1 - Math.cos( k * Math.PI / 2 );

		},

		Out: function ( k ) {

			return Math.sin( k * Math.PI / 2 );

		},

		InOut: function ( k ) {

			return 0.5 * ( 1 - Math.cos( Math.PI * k ) );

		}

	},

	Exponential: {

		In: function ( k ) {

			return k === 0 ? 0 : Math.pow( 1024, k - 1 );

		},

		Out: function ( k ) {

			return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );

		},

		InOut: function ( k ) {

			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
			return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );

		}

	},

	Circular: {

		In: function ( k ) {

			return 1 - Math.sqrt( 1 - k * k );

		},

		Out: function ( k ) {

			return Math.sqrt( 1 - ( --k * k ) );

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
			return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);

		}

	},

	Elastic: {

		In: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );

		},

		Out: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );

		},

		InOut: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
			return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;

		}

	},

	Back: {

		In: function ( k ) {

			var s = 1.70158;
			return k * k * ( ( s + 1 ) * k - s );

		},

		Out: function ( k ) {

			var s = 1.70158;
			return --k * k * ( ( s + 1 ) * k + s ) + 1;

		},

		InOut: function ( k ) {

			var s = 1.70158 * 1.525;
			if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
			return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );

		}

	},

	Bounce: {

		In: function ( k ) {

			return 1 - TWEEN.Easing.Bounce.Out( 1 - k );

		},

		Out: function ( k ) {

			if ( k < ( 1 / 2.75 ) ) {

				return 7.5625 * k * k;

			} else if ( k < ( 2 / 2.75 ) ) {

				return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;

			} else if ( k < ( 2.5 / 2.75 ) ) {

				return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;

			} else {

				return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;

			}

		},

		InOut: function ( k ) {

			if ( k < 0.5 ) return TWEEN.Easing.Bounce.In( k * 2 ) * 0.5;
			return TWEEN.Easing.Bounce.Out( k * 2 - 1 ) * 0.5 + 0.5;

		}

	}

};

TWEEN.Interpolation = {

	Linear: function ( v, k ) {

		var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.Linear;

		if ( k < 0 ) return fn( v[ 0 ], v[ 1 ], f );
		if ( k > 1 ) return fn( v[ m ], v[ m - 1 ], m - f );

		return fn( v[ i ], v[ i + 1 > m ? m : i + 1 ], f - i );

	},

	Bezier: function ( v, k ) {

		var b = 0, n = v.length - 1, pw = Math.pow, bn = TWEEN.Interpolation.Utils.Bernstein, i;

		for ( i = 0; i <= n; i++ ) {
			b += pw( 1 - k, n - i ) * pw( k, i ) * v[ i ] * bn( n, i );
		}

		return b;

	},

	CatmullRom: function ( v, k ) {

		var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.CatmullRom;

		if ( v[ 0 ] === v[ m ] ) {

			if ( k < 0 ) i = Math.floor( f = m * ( 1 + k ) );

			return fn( v[ ( i - 1 + m ) % m ], v[ i ], v[ ( i + 1 ) % m ], v[ ( i + 2 ) % m ], f - i );

		} else {

			if ( k < 0 ) return v[ 0 ] - ( fn( v[ 0 ], v[ 0 ], v[ 1 ], v[ 1 ], -f ) - v[ 0 ] );
			if ( k > 1 ) return v[ m ] - ( fn( v[ m ], v[ m ], v[ m - 1 ], v[ m - 1 ], f - m ) - v[ m ] );

			return fn( v[ i ? i - 1 : 0 ], v[ i ], v[ m < i + 1 ? m : i + 1 ], v[ m < i + 2 ? m : i + 2 ], f - i );

		}

	},

	Utils: {

		Linear: function ( p0, p1, t ) {

			return ( p1 - p0 ) * t + p0;

		},

		Bernstein: function ( n , i ) {

			var fc = TWEEN.Interpolation.Utils.Factorial;
			return fc( n ) / fc( i ) / fc( n - i );

		},

		Factorial: ( function () {

			var a = [ 1 ];

			return function ( n ) {

				var s = 1, i;
				if ( a[ n ] ) return a[ n ];
				for ( i = n; i > 1; i-- ) s *= i;
				return a[ n ] = s;

			};

		} )(),

		CatmullRom: function ( p0, p1, p2, p3, t ) {

			var v0 = ( p2 - p0 ) * 0.5, v1 = ( p3 - p1 ) * 0.5, t2 = t * t, t3 = t * t2;
			return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;

		}

	}

};

if ( typeof define === "function") {
  define( "tween", function () { return TWEEN; } );
}

/**
 * `Animation Frame`
 */

define('af', function () {
  'use strict';

  var performanceNow = window.performance && window.performance.now,
      now = performanceNow ?
        function () {
          return window.performance.now();
        }
          : Date.now || function () {
              return new Date().getTime();
            };

  /** Thanks to:
   *      http://paulirish.com/2011/requestanimationframe-for-smart-animating/
   *      http://creativejs.com/resources/requestanimationframe/
   *      http://www.makeitgo.ws/articles/animationframe/
   *      https://github.com/component/raf/blob/master/index.js
   *      https://gist.github.com/paulirish/1579671
   *      https://gist.github.com/joelambert/1002116
   *      https://gist.github.com/KrofDrakula/5318048
   */

   /**
    * `requestAnimationFrame(time)`
    */

  var r = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.oRequestAnimationFrame
    || window.msRequestAnimationFrame;

   /**
    * `cancelAnimationFrame`
    */

  var c = window.cancelAnimationFrame
    || window.webkitCancelAnimationFrame
    || window.mozCancelAnimationFrame
    || window.oCancelAnimationFrame
    || window.msCancelAnimationFrame;

  if (!r) {
    var prev = 0;
    r = function (callback/*, element*/) {
      var curr = now(),
          ms = Math.max(0, 16 - (curr - prev)),
          id = setTimeout(function () {
            callback(curr + ms);
          }, ms);
      prev = curr + ms;
      return id;
    };
  }

  if (!c) {
    c = function (id) {
      clearTimeout(id);
    };
  }

  return {
    request: r,
    cancel: c
  };
});

define('util', function () {
  "use strict";
  var trimLeft = /^\s+/,
      trimRight = /\s+$/,
      zh_CN = /[^0-9a-zA-Z_\u4e00-\u9fa5\ \'\.]+/g,
      NativeTrim = String.prototype.trim;

  var Util = {

    // Display Name: 0-9 a-zA-Z _ CJK字符 ' . 空格
    zh_CN: zh_CN,

    // 30个字符，并且删除中文字符
    cut30length: function (s, len) {
      //return s.replace(zh_CN, ' ').substring(0, 30);
      if (!s) {
        return '';
      }
      s = s.replace(zh_CN, ' ');
      len || (len = 30);
      while (Util.utf8length(s) > len) {
        s  = s.substring(0, s.length - 1)
      }
      return s;
    },

    // https://gist.github.com/2762686
    utf8length: function (s) {
      var len = s.length, u8len = 0, i = 0, c;
      for (; i < len; i++) {
        c = s.charCodeAt(i);
        if (c < 0x007f) { // ASCII
          u8len++;
        } else if (c <= 0x07ff) {
          u8len += 2;
        } else if (c <= 0xd7ff || 0xe000 <= c) {
          u8len += 3;
        } else if (c <= 0xdbff) { // high-surrogate code
          c = s.charCodeAt(++i);
          if (c < 0xdc00 || 0xdfff < c) {// Is trailing char low-surrogate code?
            throw "Error: Invalid UTF-16 sequence. Missing low-surrogate code.";
          }
          u8len += 4;
        } else /*if (c <= 0xdfff)*/ { // low-surrogate code
          throw "Error: Invalid UTF-16 sequence. Missing high-surrogate code.";
        }
      }
      return u8len;
    },

    // Remove whitespace
    trim: NativeTrim ?
      function (s) {
        /*jshint -W116*/
        return s == null ?
          '':
          NativeTrim.call(s);
      } :
      function (s) {
        /*jshint -W116*/
        return s == null ?
          '' :
          s.toString().replace(trimLeft, '').replace(trimRight, '');
      },

    // parse phone
    /*
    parsePhone: function () {
      var reg = /^(\+)?((?:(86)?(1(?:3\d|4[57]|5\d|8\d)\d{8}))|(?:(1)?(\d{5,15})))$/;
      return function _p(strid) { };
    },
    */

    // 解析 用户身份
    parseId: (function () {
      var facebook = /^([a-z0-9_\.]{1,})@facebook$/i,
          twitter = /^@([a-z0-9_]{1,15})$|^@?([a-z0-9_]{1,15})@twitter$/i,
          instagram = /^([a-z0-9_\.]{1,})@instagram$/i,
          dropbox = /^(.*)@dropbox$/i,
          flickr = /^(.*)@flickr$/i,
          normal = /^[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
          enormal = /^[^@]*<[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?>$/i,
          phone = /^(\+)?((?:(86)?(1(?:3\d|4[57]|5\d|8\d)\d{8}))|(?:(1)?(\d{5,15})))$/;

      return function p(strid) {
        var res = {}, m;
        strid = Util.trim(strid);

        if ((m = strid.match(dropbox)) && (normal.test(m[1]))) {
          res.name = m[1];
          res.external_username = m[1];
          res.provider = 'dropbox';
        }

        // flickr
        else if ((m = strid.match(flickr))) {
          res.name = m[1];
          res.external_username = m[1];
          res.provider = 'flickr';
        }

        // instagram
        else if ((m = strid.match(instagram))) {
          res.name = m[1];
          res.external_username = m[1];
          res.provider = 'instagram';
        // facebook
        } else if ((m = strid.match(facebook))) {
          res.name = m[1];
          res.external_username = m[1];
          res.provider = 'facebook';

        // twitter
        } else if ((m = strid.match(twitter))) {
          res.name = m[1] || m[2];
          res.external_username = res.name;
          res.provider = 'twitter';

        // normal
        } else if (normal.test(strid)) {
          res.name = Util.cut30length(strid.split('@')[0]);
          res.external_username = strid;
          res.provider = 'email';

        // enormal
        } else if (enormal.test(strid)) {
          var iLt = strid.indexOf('<');
              //iGt = strid.indexOf('>');
          res.name = Util.cut30length(strid.substring(0, iLt).replace(/^"|^'|"$|'$/g, ''));
          //res.external_identity = strid.substring(++iLt, iGt);
          res.external_username = res.name
          res.provider = 'email';

        } else if ((m = strid.replace(/[\s\-\(\)\_]/g, '').match(phone))) {
          var flag = m[1], zone, n;
          res.provider = 'phone';
          if (flag) {
            if (m[3] && m[4]) {
              zone = m[3];
              n = m[4];
              res.name = res.external_username = flag + zone + n;
            } else if (m[5] && m[6]) {
              zone = m[5];
              n = m[6];
              res.name = res.external_username = flag + zone + n;
            } else {
              res.name = strid;
              res.provider = null;
            }
          } else {
            flag = '+';
            if (m[4]) {
              zone = '86';
              n = m[4];
            } else {
              zone = '1';
              n = m[2];
            }
            res.name = res.external_username = flag + zone + n;
          }
        } else {
          res.name = strid;
          res.provider = null;
        }

        return res;
      }

    })(),

    tokenRegExp: /token=([a-zA-Z0-9]{32})/,

    printExtUserName: function (identity, status) {
      var username = identity.external_username,
          provider = identity.provider;

      switch (provider) {
      case 'twitter':
        username = '@' + username + '@' + provider;
        break;

      case 'facebook':
      case 'instagram':
      case 'flickr':
      case 'dropbox':
        username += '@' + provider;
        break;

      case 'phone':
        if (status) {
          if (/^\+1\d{10}$/.test(username)) {
            username = username.replace(/^(\+1)(\d{3})(\d{3})(\d{4})$/, '$1 ($2) $3-$4');
          } else if (/^\+86\d{11}$/.test(username)) {
            username = username.replace(/^(\+86)(\d{3})(\d{4})(\d{4})$/, '$1 $2 $3 $4');
          }
        }
        break;
      }

      return username;
    }

  };

  return Util;

});

/*jshint -W003*/

/**
 * Humantime.js
 * Relative/absolute time.
 *
 * Referrers:
 *  https://github.com/fnando/i18n-js
 *  https://en.wikipedia.org/wiki/ECMAScript
 *  ISO 8601 http://www.w3.org/TR/NOTE-datetime
 *  https://en.wikipedia.org/wiki/ISO_8601
 *  https://en.wikipedia.org/wiki/Unix_time
 *  http://tools.ietf.org/html/rfc3339
 *    UTC YYYY-MM-DDTHH:MM:SSZ 2012-10-01T20:30:33+0800
 */
"use strict";

// Set the placeholder format. Accepts `{{placeholder}}` and `%{placeholder}`.
var PLACEHOLDER = /(?:\{\{|%\{)(\w*?)(?:\}\}?)/gm;

var ISO8601_DATE = /^\d{4}-\d{2}-\d{2}$/
  , ISO8601_TIME = /^\d{2}:\d{2}:\d{2}$/;

var N2 = 0.2
  //, N9 = 0.9999
  , N6 = 6e4
  , D = 8.64e7;

var EN = {
    monthsShort: 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ')
  , months: 'January February March April May June July August September October November December'.split(' ')
  , weekdaysShort: 'Sun Mon Tue Wed Thu Fri Sat'.split(' ')
  , weekdays: 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' ')

  , '-1': function () {
      return 'Today';
    }

  , '0': function (date) {
      var s = '', y = date.years, m = date.months;
      if (y) {
        s = '{{years}} year' + (y === 1 ? '' : 's');
      }
      if (m) {
        s += (s ? ' ' : '') + '{{months}} month' + (m === 1 ? '' : 's');
      }
      return s + ' ago';
    }

  , '1': function (date) {
      var s = '', d = date.days;
      if (1 === d) {
        s = 'Yesterday'
      } else if (2 === d) {
        s = 'Two days ago';
      } else {
        s = '{{days}} days ago'
      }
      return s;
    }

  , '2': function (date) {
      var s = '', isToday = date.isToday, h = date.hours;
      if (!isToday && h >= 12) {
        s = 'Yesterday';
      } else {
        s = '{{hours}} hours ago';
      }
      return s;
    }

  , '3': function () {
      return '1.5 hours ago';
    }

  , '4': function () {
      return 'An hour ago';
    }

  , '5': function (date, type) {
      return 'X' === type ? 'Just now' : '{{minutes}} minutes ago';
    }

  , '6': function (date, type) {
      return 'X' === type ? 'Now' : '{{minutes}} minutes ago';
    }

  , '7': function (date, type) {
      return 'X' === type ? 'Now' : 'Seconds ago';
    }

  , '8': function () {
      return 'In {{minutes}} minutes';
    }

  , '9': function () {
      return 'In one hour';
    }

  , '10': function () {
      return 'In 1.5 hours';
    }

  , '11': function (date) {
      var s = '', isToday = date.isToday, h = date.hours;
      if (!isToday && h >= 12) {
        s = 'Tomorrow';
      } else {
        s = 'In {{hours}} hours';
      }
      return s;
    }

  , '12': function (date) {
      var s = '', d = date.days, day = date.day;
      if (1 === d) {
        s = 'Tomorrow';
      } else if (2 === d) {
        s = 'In two days';
      } else {
        s = EN.weekdaysShort[day] + '. in {{days}} days';
      }
      return s;
    }

  , '13': function (date) {
      var s = '', y = date.years, m = date.months;
      if (y) {
        s = '{{years}} year' + (y === 1 ? '' : 's');
      }
      if (m) {
        s += (s ? ' ' : '') + '{{months}} month' + (m === 1 ? '' : 's');
      }
      return 'In ' + s;
    }
  };

var HumanTime = function (t, s, type, c) {
  var lang = HumanTime.locales[HumanTime.locale]
    , distanceTime = HumanTime.distanceOfTime(t, s)
    , input = HumanTime.diff(distanceTime)
    , output;

  input.type = type;

  output = HumanTime.inWords(input, lang);

  if ('function' === typeof c) {
    output = c(output.data);
  }

  return output;
};

/*
  Converts ISO8601 datetime to locale datetime.
  ES5 supprots ISO8601 datetime:
      1. var d0 = '2012-08-06T23:30:00+08:00'
      2. var d1 = '2012-08-06T23:30:00+0800'
  The moden browsers supports Date.parse(datetime), but opera-v12 not supports 1, must be 2
  */
var parseISO = HumanTime.parseISO = function (s) {
  return new Date(Date.parse(s));
};

// Normal datetime => ISO8601 datetime
// "2012-09-12 09:51:04 +0000" => "2012-09-12T09:51:04+00:00"
var toISO = HumanTime.toISO = function (s) {
  return s.replace(/\s/, 'T').replace(/\s/, '')
    .replace(/([+\-]\d\d)(?::?)(\d\d)/, '$1:$2');
};

/*
var SETTINGS = HumanTime.settings = {
  weekStartAt: 1
};
*/

HumanTime.locale = 'en';

HumanTime.locales = {
  en: EN
};

HumanTime.inWords = function (input, lang) {
  var token = lang[input.token]
    , type = input.type
    , date = input.date
    , message;

  if ('function' === typeof token) {
    message = token(date, type);
  } else {
    message = token;
  }

  return _replace(message, date);
};

HumanTime.diff = function (distanceTime) {
  var t = distanceTime.target
    //, s = distanceTime.source
    , ms = distanceTime.distance
    , m = floor(ms / N6)
    , days, months, years, hours, minutes, day
    , output = { date: {} }
    , date = output.date
    , _days = distanceTime.days;

  date.isToday = distanceTime.isToday

  // 有日期无时间
  if (t._isToday) {
    output.token = -1;
  }

  // m <= -43200
  else if (m < -43199) {
    output.token = 0
    years = floor(-m / 525949);
    months = floor(-m % 525949 / 43829 + N2);
  }

  // m <= -2880
  //else if (m < -2879) {
    //output.token = 1;
    //days = floor(m / 1440 + N9);
  //}

  // m <= -1440
  else if (m < -1439) {
    output.token = 1;
    //days = floor(-m / 1440 + N9);
    //days = floor((-m - 1) / 1440 + 1);
    days = -_days < 3 ? -_days : floor((-m + 1439) / 1440);
  }

  // m <= -108
  else if (m < -107) {
    output.token = 2;
    hours = floor(-m / 60 + N2);
  }

  // m <= -82
  else if (m < -81) {
    output.token = 3;
  }

  // m <= 60
  else if (m < -59) {
    output.token = 4;
  }

  // m <= -30
  else if (m < -29) {
    output.token = 5;
    minutes = -m;
  }

  // m <= -1
  else if (m < 0) {
    output.token = 6;
    minutes = -m;
  }

  // 0 m
  else if (0 === m) {
    output.token = 7;
  }

  // 1 m <= x <= 59 m
  else if (m < 60) {
    output.token = 8;
    minutes = m;
  }

  // 60 m <= x <= 81 m
  else if (m < 82) {
    output.token = 9;
  }

  // 82 m <= x <= 107 m
  else if (m < 108) {
    output.token = 10;
  }

  // 108 m <= x <= 719 m
  //else if (m < 720) {
    //output.token = 11;
  //}

  // 720 m <= x <= 1439 m
  else if (m < 1440) {
    output.token = 11;
    hours = floor(m / 60 + N2);
  }

  // 1440 m <= x <= 2879 m
  //else if (m < 2880) {
    //output.token = 12;
  //}

  // 2880 m <= x <= 43199 m
  else if (m < 43200) {
    output.token = 12;
    days = _days < 3 ? _days : floor((m + 1439) / 1440);
    day = t.getDay();
  }

  // x >= 43200
  else {
    output.token = 13;
    years = floor(m / 525949);
    months = floor(m % 525949 / 43829 + N2);

    if (12 === months) {
      months = 0;
      years++;
    }
  }

  if (years) { date.years = years; }

  if (months) { date.months = months; }

  if (days) { date.days = days; }

  if (hours) { date.hours = hours; }

  if (minutes) { date.minutes = minutes; }

  if ('undefined' !== typeof day) { date.day = day; }

  return output;
};

HumanTime.distanceOfTime = function (t, s) {
  if (!t) {
    t = new Date();
  } else if ('number' === typeof t) {
    t = new Date(t);
  } else if ('string' === typeof t) {
    t = parseISO(toISO(t));
  }

  if (!s) {
    s = new Date();
  } else if ('number' === typeof s) {
    s = new Date(s);
  } else if ('string' === typeof s) {
    s = parseISO(toISO(s));
  }

  // 有日期无时间，日期不相同
  if (t._reTime) {
    s.setHours(0);
    s.setMinutes(0);
    s.setSeconds(0);
    s.setMilliseconds(0);
  }

  var ty = t.getFullYear(),
      tm = t.getMonth(),
      td = t.getDate(),
      sy = s.getFullYear(),
      sm = s.getMonth(),
      sd = s.getDate();

  return {
      // target datetime
      target: t
      // source datetime
    , source: s
      // millseconds
    , distance: +t - +s

    , days: (+new Date(ty, tm, td) - +new Date(sy, sm, sd)) / D

    , isToday: (ty === sy)
        && (tm === sm)
        && (td === sd)
    };
};

// converts the eftime to the locale Date
HumanTime.toLocaleDate = function (eft) {
  var opf = eft.outputformat
    , now = new Date()
    , today = now.getFullYear() + '-' + lead0(now.getMonth() + 1) + '-' + lead0(now.getDate())
    , isToday = false
    , reTime = false
    , d
    , de
    , ds;
  if (opf) {
    d = now;
    ds = today;
    isToday = true;
  }
  else {
    var b = eft.begin_at
      , bd = b.date
      , bt = b.time
      , btz = b.timezone
      , s = '';

    if (bd) {
      s = formatDate(bd);
      if (bt) {
        s += 'T' + formatTime(bt);
      } else {
        reTime = true;
        isToday = s === today;
      }
    } else {
      s = today;
      if (bt) {
        s += 'T' + formatTime(bt);
      }
    }

    if (bd && bt && btz) {
      s += 'Z';
    }

    d = parseISO(s);
    if (reTime) {
      d.setHours(0);
      d.setMinutes(0);
      d.setSeconds(0);
      d.setMilliseconds(0);
    }
    de = ds = d.getFullYear() + '-' + lead0(d.getMonth() + 1) + '-' + lead0(d.getDate());
    ds += bt ? ' ' + lead0(d.getHours()) + ':' + lead0(d.getMinutes()) + ':' + lead0(d.getSeconds()) : '';
  }

  d._isToday = isToday;
  d._reTime = reTime;

  return {
    date: d
  , text: ds
  };
};


var FUNS = {
    date: function (y, m, d, day) {
      var lang = HumanTime.locales[HumanTime.locale];
      return lang.weekdaysShort[day] + ', ' + lang.monthsShort[m] + ' ' + d;
    }

  , time: function (h, m) {
      var _h = h > 12 ? h - 12 : h;
      var s = _h + ':' + lead0(m);
      s += h >= 12 ? 'PM' : 'AM';
      return s;
    }
  };

// EFTime display
HumanTime.printEFTime = function (eft, type, funs) {
  var opt = eft.outputformat,
      ba = eft.begin_at,
      isX = ('X' === type),
      output = { title: '', content: '' },
      now = new Date(),
      origin, t, d, tz, ctz;

  if (opt) {
    origin = eft.origin
      .replace(/^['"‘’“”“”‚„]+/, '')
      .replace(/['"‘’“”“”‚„]+$/, '');

    output.title = origin;
    if (!isX) {
      output.content = origin;
      if (ba.date) {
        eft.outputformat = 0;
        t = HumanTime.toLocaleDate(eft);
        output.content = HumanTime(t.date, now);
        eft.outputformat = 1;
      }
    }
  }
  else {
    if (!funs) {
      funs = FUNS;
    }

    if (ba) {
      if (ba.date || ba.time) {
        t = HumanTime.toLocaleDate(eft);
        d = t.date;

        if (ba.date) {
          output.title = HumanTime(t.date, now, 'X');
          output.content = ba.time_word
            + (ba.time_word && ba.time ? ' ' : '') + (ba.time ? funs.time(d.getHours(), d.getMinutes()) : '') + (ba.time || ba.time_word ? (ba.time ? ' ' : ', ') : '')
            + funs.date(d.getFullYear(), d.getMonth(), d.getDate(), d.getDay())
            + (ba.date_word ? ' ' : '')
            + ba.date_word;
        }
        else if (ba.time) {
          output.content = output.title = ba.time_word + (ba.time_word ? ' ' : '')
              + funs.time(d.getHours(), d.getMinutes())
            + (ba.date_word ? ', ' : '')
            + ba.date_word;
        }

        if (d.getFullYear() !== now.getFullYear()) {
          output.content +=  ' ' + d.getFullYear();
        }
      } else if (ba.date_word || ba.time_word) {
        output.content = output.title = ba.time_word + (ba.time_word ? ', ' : '') + ba.date_word;
      }

      if (ba.timezone) {
        tz = ba.timezone.replace(/^([+\-]\d\d:\d\d)[\w\W]*$/, '$1');
        ctz = getTimezone(now);
        if (tz !== ctz) {
          var abbr = getTimezoneAbbreviation(now);
          output.content += ' (' + ctz + (abbr && (' ' + abbr)) + ')';
        }
      }
    }
  }

  return output;
};

HumanTime.printTime = function (date, funs) {
  if (!date) { date = new Date(); }
  if (!funs) { funs = FUNS; }
  var now = new Date(), output = '';
  output += funs.date(date.getFullYear(), date.getMonth(), date.getDate(), date.getDay())
          + ' ' + funs.time(date.getHours(), date.getMinutes())
  if (date.getFullYear() !== now.getFullYear()) {
    output +=  ' ' + date.getFullYear();
  }

  return output;
};

// get locale timezone
var getTimezone = HumanTime.getTimezone = function (date) {
  var offset, h, m, a;
  if (!date) { date = new Date(); }
  offset = date.getTimezoneOffset();
  a = offset <= 0 ? '+' : '-';
  offset = Math.abs(offset);
  h = floor(offset / 60);
  m = offset - h * 60;
  return a + lead0(h) + ':' + lead0(m);
};

// get timezone abbreviation
var getTimezoneAbbreviation = function (date) {
  var abbr;
  if (!date) { date = new Date(); }
  // http://pubs.opengroup.org/onlinepubs/007908799/xsh/strftime.html
  // http://yuilibrary.com/yui/docs/api/files/date_js_date-format.js.html#l124
  // abbreviation
  abbr = date.toString().replace(/^.*:\d\d( GMT[+-]\d+)? \(?([A-Za-z ]+)\)?\d*$/, "$2").replace(/[a-z ]/g, "");
  return 3 === abbr.length ? abbr : '';
};

HumanTime.createEFTime = function () {
  return {
    begin_at: {
      date_word: '',
      date: '',
      time_word: '',
      time: '',
      timezone: '',
      id: 0,
      type: 'EFTime'
    },
    origin: '',
    outputformat: 1,
    id: 0,
    type: 'CrossTime'
  };
};

  // 3 -> '003'
var lead0 = HumanTime.lead0 = function (n, p) {
    n = '' + n;
    if (!p) { p = 2; }
    while (n.length < p) {
      n = '0' + n;
    }
    return n;
  }

, formatDate = HumanTime.formatDate = function (d) {
    var s;
    if (ISO8601_DATE.test(d)) {
      s = d;
    } else {
      s = d.split('-');
      s[1] = lead0(s[1]);
      s[2] = lead0(s[2]);
      s = s.join('-');
    }
    return s;
  }

, formatTime = HumanTime.formatTime = function (t) {
    var s;
    if (ISO8601_TIME.test(t)) {
      s = t;
    } else {
      s = t.split(':');
      s[0] = lead0(s[0]);
      s[1] = lead0(s[1]);
      s[2] = lead0(s[2]);
      s = s.join(':');
    }
    return s;
  }

, _replace = function (mess, data) {
    var ms = mess.match(PLACEHOLDER)
      , i = 0
      , regex
      , name
      , value
      , placeholder;

    if (ms) {
      for (; placeholder = ms[i]; ++i) {
        name = placeholder.replace(PLACEHOLDER, '$1');
        value = data[name];
        regex = new RegExp(placeholder.replace(/\{/gm, '\\{').replace(/\}/gm, '\\}'));
        mess = mess.replace(regex, value);
      }
    }
    return mess;
  }

, floor = function (n) {
    return n - n % 1;
  };

if (typeof define === 'function') {
  define('humantime', function () {
    return HumanTime;
  });
}

/**
 *「May the force be with you. 愿原力与你同在.」
 *
 * Refer:
 *    - https://github.com/senchalabs/connect
 *    - https://github.com/visionmedia/page.js
 *    - https://github.com/visionmedia/express/tree/master/lib
 *    - https://github.com/maccman/spine/blob/master/lib/route.js
 */
define('lightsaber', function (require, exports, module) {
  'use strict';

  /**
   * Module dependencies
   */
  var Emitter = require('emitter'),
      $ = require('jquery') || require('zepto'),
      proxy = $.proxy;

  var location = window.location,
      history = window.history,
      historySupport,
      ROOT = '/';

  // http://cacheandquery.com/blog/category/technology/
  var _firstLoad = false;
  $(window).on('load', function (e) {
    _firstLoad = true;
    setTimeout(function () { _firstLoad = false; }, 0);
  });

  // Create Application
  function createApplication() {
    var app = new Application();
    merge(app, Emitter.prototype);
    app.request = new Request();
    app.response = new Response();
    app.init();
    return app;
  }

  // export module
  exports = module.exports = createApplication;

  var proto;

  // lightsaber version
  exports.version = '0.0.5';

  // Application
  function Application() {}

  proto = Application.prototype;

  // html5 history support
  proto.historySupport = historySupport = (history !== null ? history.pushState : void 0) !== null;

  // wtf? window.onpopstate v12?
  if ($.browser && $.browser.opera) {
    proto.historySupport = historySupport = false;
  }

  proto.init = function () {
    this.route = ROOT;
    this.stack = [];
    this.cache = {};
    this.settings = {};
    this.engines = {};
    this.viewCallbacks = [];
    this.defaultConfiguration();
  };

  proto.defaultConfiguration = function () {
    // default settings
    this.set('env', 'production');

    // perform initial dispatch
    this.enable('dispatch');

    // implict middleware
    this.use(lightsaberInit(this));

    // router
    this._usedRouter = false;
    this._router = new Router(this);
    this.routes = this._router.map;
    this._router.caseSensitive = this.enabled('case sensitive routing');
    this._router.strict = this.enabled('strict routing');

    // setup locals
    this.locals = locals(this);

    // default locals
    this.locals.settings = this.settings;

    this.configure('development', function () {
      this.set('env', 'development');
    });

    this.configure('production', function () {
      this.enable('view cache');
    });
  };

  proto.use = function (route, fn) {
    // default route to '/'
    if ('string' !== typeof route) {
      fn = route;
      route = ROOT;
    }

    // '/abcdefg/' => '/abcdefg'
    if (ROOT !== route && ROOT === route[route.length - 1]) {
      route = route.slice(0, -1);
    }

    this.stack.push({ route: route, handle: fn });

    return this;
  };

  /**
   * Register the given template engine callback `fn`
   */
  proto.engine = function (ext, fn) {
    if ('function' !== typeof fn) throw new Error('callback function required');
    if ('.' !== ext[0]) ext = '.' + ext;
    this.engines[ext] = fn;
    return this;
  };

  proto.set = function (setting, val) {
    if (1 === arguments.length) {
      if (this.settings.hasOwnProperty(setting)) {
        return this.settings[setting];
      }
    } else {
      this.settings[setting] = val;
      return this;
    }
  };

  proto.enabled = function (setting) {
    return !!this.set(setting);
  };

  proto.disabled = function (setting) {
    return !this.set(setting);
  };

  proto.enable = function (setting) {
    return this.set(setting, true);
  };

  proto.disable = function (setting) {
    return this.set(setting, false);
  };

  proto.configure = function (env, fn) {
    var envs = 'all'
      , args = [].slice.call(arguments);

    fn = args.pop();

    if (args.length) envs = args;

    //if ('all' === envs || ~envs.indexOf(this.settings.env)) fn.call(this);
    if ('all' === envs || ~indexOf(envs, this.settings.env)) fn.call(this);

    return this;
  };

  proto.render = function (name, options, fn) {
    var self = this
      , opts = {}
      , cache = this.cache
      , engine = this.engine
      , view;

    if ('function' === typeof options) {
      fn = options;
      options = {};
    }

    // merge app.locals
    merge(opts, this.locals);

    // merge options.locals
    if (options.locals) merge(opts, options.locals);

    // merge options
    merge(opts, options);

    // set .cache unless explicitly provided
    opts.cache = null === opts.cache
      ? this.enabled('view cache')
      : opts.cache;

      // primed
    if (opts.cache) view = cache[name];

    if (!view) {
      view = new View(name, {
          engine: this.set('view engine')
        , root: this.set('views')
      }, this.set('timestamp'));

      if (!view.path) {
        var err = new Error('Failed to lookup view "' + name + '"');
        err.view = view;
        return fn(err);
      }

      // prime the cache
      if (opts.cache) cache[name] = view;
    }

    // render
    try {
      view.render(opts, fn);
    } catch (err) {
      fn(err);
    }
  };

  proto.path = function () {
    return this.route;
  };

  proto.param = function (name, fn) {
    var fns = [].slice.call(arguments, 1)
      , i = 0
      , len;

    // array
    if (isArray(name)) {
      for (len = name.length; i < len; ++i) {
        for (var j = 0, fl = fns.length; j < fl; ++j) {
          this.param(name[i], fns[j]);
        }
      }
    }
    // param logic
    else if ('function' === typeof name) {
      this._router.param(name);
    // single
    } else {
      if (':' === name[0]) name = name.substr(1);
      for (len = fns.length; i < len; ++i) {
        this._router.param(name, fn);
      }
    }

    return this;
  };

  proto.initRouter = function () {
    if (this._usedRouter === false) {
      this._usedRouter = true;
      this.use(this._router.middleware);
    }
  };

  // get method request
  proto.get = function () {
    var args = [].slice.call(arguments);
    this.initRouter();
    return this._router.route.apply(this._router, args);
  };

  /*
   * Handle request
   *
   * @api private
   */
  proto.handle = function (req, res, out) {
    var stack = this.stack
      , removed = ''
      , slashAdded = false
      , index = 0;

    function next(err) {
      // next callback
      var layer = stack[index++]
        , path;

      if (slashAdded) {
        req.url = req.url.substr(1);
        slashAdded = false;
      }

      req.url = removed + req.url;

      // all done
      if (!layer) {
        return;
      }

      try {

        path = req.url;

        if (0 !== path.indexOf(layer.route)) return next(err);

        // get handle function argumens length
        var arity = layer.handle.length;

        // debug
        //console.log(index, 'path', path, arity, layer.handle.toString());

        removed = layer.route;
        req.url = req.url.substr(removed.length);

        if ('/' !== req.url[0]) {
          req.url = '/' + req.url;
          slashAdded = true;
        }

        if (err) {
          if (4 === arity) {
            layer.handle(err, req, res, next);
          } else {
            next(err);
          }
        } else if (4 > arity) {
          layer.handle(req, res, next);
        } else {
          next();
        }

      } catch (e) {
        next(e);
      }

    }

    next()
  };

  // run app
  proto.run = function (options) {
    // onLaunch
    this.emit('launch');

    options = options || {};

    var req = this.request
      , res = this.response;

    if (this.running) return;
    this.running = true;

    if (false === options.dispatch) this.disable('dispatch');

    if (false !== options.popstate) {

      if (this.historySupport) {
        //$(window).on('popstate', { app: this }, this.change);
        $(window).on('popstate', proxy(this.change, this));
        //window.addEventListener('popstate', this.change, false);
      } else {
        //$(window).on('hashchange', { app: this }, this.change);
        $(window).on('hashchange', proxy(this.change, this));
        //window.addEventListener('hashchange', this.change, false);
      }

    }

    if (this.disabled('dispatch')) return;

    this.handle(req, res);

    // onLaunched
    this.emit('launched');
  };

  proto.change = function (e) {
    if (_firstLoad) return _firstLoad = false;

    //console.dir(e.originalEvent);

    /*
    var app = e.data.app
      , req = app.request
      , res = app.response
      , url = req.url;
    */

    var app = this
      , req = app.request
      , res = app.response
      , url = req.url;

    req.updateUrl();

    if ('/' !== url && url === req.url) return;

    app.handle(req, res);

    e.stopPropagation()
    e.preventDefault()

    //delete e.data;

    return false;
  };

  // Generate an `Error`
  proto.error = function (code, msg) {
    var err = new Error(msg);
    err.status = code;
    return err;
  };



  // Request
  function Request(enableFullUrlPath) {
    // listen full url path
    this.enableFullUrlPath = !!enableFullUrlPath;

    // session
    this.session = {};

    this.path = '/';
    this.method = 'GET';
    this.updateUrl();
  }

  // Request.prototype
  proto = Request.prototype;

  proto.updateUrl = function () {
    this.host = location.hostname;
    this.port = location.port || 80;
    this.fullpath = location.pathname;
    this.enableFullUrlPath && (this.path = this.fullpath);
    this.hash = decodeURIComponent(location.hash);
    this.querystring = decodeURIComponent(location.search);
    this.url = this.path + this.querystring + this.hash;
  };

  proto.param = function (name, defaultValue) {
    var params = this.params || {}
      , query = this.query || {};
    if (null != params[name] && params.hasOwnProperty(name)) return params[name];
    if (null != query[name]) return query[name];
    return defaultValue;
  };

  proto.getPath = function () {
    return this.path;
  };

  proto.getHost = function () {
    return this.host;
  };


  // Response
  function Response(path, state) {
    this.path = path;
    this.title = document.title;
    this.state = state || {};
  }

  // Response.prototype
  proto = Response.prototype;

  proto.location = function (url) {
    window.setTimeout(function () {
      location.href = url;
    }, 16);
  };

  // redirect('back')
  // redirect('/user', 'User Page', {id: 'user'});
  proto.redirect = function (url) {
    var argsLen = arguments.length
      , title
      , state;

    // `back` `forward`
    //if (1 === argsLen) {
    url = arguments[0];
    if (url === 'back' || url === 'forward') {
      history[url]();
      //} else {
      //  // 进入线程, 防止失败
      //  _redirect(url);
      //}
      return;
    }

    if (!historySupport) {
      //location.hash = this.path.substr(2);
      this.location(url);
      return;
    }

    title = arguments[1];
    state = arguments[2] || {};

    this.path = url;
    this.title = title || 'EXFE.COM';
    document.title = this.title;
    this.state = state;
    this.state.id = uuid();
    this.pushState();

    $(window).triggerHandler('popstate');
  };

  // save state
  proto.save = function () {
    history.replaceState(this.state, this.title, this.path);
  };

  // push the state onto the history stack
  proto.pushState = function () {
    history.pushState(this.state, this.title, this.path);
  };

  proto.render = function (view, options, fn) {
    var self = this
      , options = options || {}
      , app = this.app;

    // support callback function as second arg
    if ('function' === typeof options) {
      fn = options, options = {};
    }

    // merge res.locals
    options.locals = self.locals;

    // render
    app.render(view, options, fn);
  };


  // Router
  function Router(options) {
    options = options || {};
    var self = this;
    this.map = [];
    this.params = {};
    this._params = [];
    this.caseSensitive = options.caseSensitive;
    this.strict = options.strict;
    this.middleware = function router(req, res, next) {
      self._dispatch(req, res, next);
    };
  }

  proto = Router.prototype;

  proto.param = function (name, fn) {
    // param logic
    if ('function' === typeof name) {
      this._params.push(name);
      return;
    }

    // apply param functions
    var params = this._params
      , len = params.length
      , ret
      , i;

    for (i = 0; i < len; ++i) {
      if (ret = params[i](name, fn)) {
        fn = ret;
      }
    }

    // ensure we end up with a
    // middleware function
    if ('function' !== typeof fn) {
      throw new Error('invalid param() call for ' + name + ', got ' + fn);
    }

    (this.params[name] = this.params[name] || []).push(fn);
    return this;
  };

  proto._dispatch = function (req, res, next) {
    var params = this.params
      , self = this;

    // route dispatch
    (function pass(i, err) {
      var paramCallbacks
        , paramIndex = 0
        , paramVal
        , route
        , keys
        , key;

      // match next route
      function nextRoute(err) {
        pass(req._route_index + 1, err);
      }

      // match route
      req.route = route = self.matchRequest(req, i);

      // no route
      if (!route) return next(err);

      // we have a route
      // start at param 0
      req.params = route.params;
      keys = route.keys;
      i = 0;

      // param callbacks
      function param(err) {
        paramIndex = 0;
        key = keys[i++];
        paramVal = key && req.params[key.name];
        paramCallbacks = key && params[key.name];

        // debug
        //console.log(paramVal, paramCallbacks);

        try {
          if ('route' === err) {
            nextRoute();
          } else if (err) {
            i = 0;
            callbacks(err);
          } else if (paramCallbacks && undefined !== paramVal) {
            paramCallback();
          } else if (key) {
            param();
          } else {
            i = 0;
            callbacks();
          }
        } catch (err) {
          param(err);
        }
      }

      param(err);

      // single param callbacks
      function paramCallback(err) {
        var fn = paramCallbacks[paramIndex++];
        if (err || !fn) return param(err);
        fn(req, res, paramCallback, paramVal, key.name);
      }

      // innvoke route callbacks
      function callbacks(err) {
        var fn = route.callbacks[i++];
        try {
          if ('route' === err) {
            nextRoute();
          } else if (err && fn) {
            if (4 > fn.length) return callbacks(err);
            fn(err, req, res, callbacks);
          } else if (fn) {
            fn(req, res, callbacks);
          } else {
            nextRoute(err);
          }
        } catch (err) {
          callbacks(err);
        }
      }

    })(0);

  };

  proto.matchRequest = function (req, i) {
    var path = req.url
      , routes = this.map
      , len = routes.length
      , route;

    i = i || 0
    // matching routes
    for (; i < len; ++i) {
      route = routes[i];
      if (route.match(path)) {
        req._route_index = i;
        return route;
      }
    }

  };

  proto.route = function (path) {
    if (!path) new Error('Router#get() requires a path');

    var callbacks = [].slice.call(arguments, 1)
      , route = new Route(path, callbacks, {
          sensitive: this.caseSensitive
        , strict: this.strict
      });

    (this.map = this.map || []).push(route);
    return this;
  };


  // Route
  function Route(path, callbacks, options) {
    options  = options || {};
    //this.method = 'GET';
    this.path = path;
    this.callbacks = callbacks;
    this.regexp = pathToRegexp(path
      , this.keys = []
      , options.sensitive
      , options.strict);
  }

  proto = Route.prototype;

  proto.match = function (path) {
    this.regexp.lastIndex = 0;

    var keys = this.keys
      , params = this.params = []
      , m = this.regexp.exec(path)
      , i, len
      , key, val;

    if (!m) return false;

    for (i = 1, len = m.length; i < len; ++i) {
      key = keys[i - 1];
      val = 'string' === typeof m[i]
        ? decodeURIComponent(m[i])
        : m[i];

      if (key) {
        params[key.name] = val;
      } else {
        params.push(val);
      }
    }

    return true;
  };


  // View
  function View(name, options, timestamp) {
    options = options || {};
    this.name = name;
    this.root = options.root;
    this.engine = options.engine;
    this.ext = extname(name);
    this.timestamp = timestamp || '';
    this.path = this.lookup(name);
  }

  proto = View.prototype;

  proto.lookup  = function (path) {
    return this.root + '/' + path + '?t=' + this.timestamp;
  };

  proto.render = function (options, fn) {
    //this.engine(this.path, options, fn);
    return read(this.engine, this.path, options, fn, this.ext);
  };



  // Middlewars
  // **************************************************

  // lightsaber init middleware:
  function lightsaberInit(app) {
    return function init(req, res, next) {
      req.app = res.app = app;

      //req.res = res;
      //res.req = req;

      req.next = next;

      res.locals = res.locals || locals(res);

      next();
    };
  }


  // Helper
  // **************************************************
  function uuid() {
    return ++uuid.id;
  }
  uuid.id = 0;

  // [].indexOf
  function indexOf(a, el, i) {
    var l = a.length;
    if (!l) return -1;
    i || (i = 0);
    if (i > l) return -1;
    (i < 0) && (i = Math.max(0, l + i));
    for (; i < l; ++i) {
      if (i in a && a[i] === el) return i;
    }
    return -1;
  }

  // ajax get template
  function read(engine, path, options, fn, ext) {
    return $.get(path, function (tpl) {
      var template, html = tpl;
      if (ext !== 'html') {
        template = engine.compile(tpl);
        html = template(options);
      }
      fn(html);
    });
  }

  // extname
  function extname(filename) {
    return filename.split('.')[1] || 'html';
  }

  // locals
  function locals(obj) {
    obj.viewCallbacks = obj.viewCallbacks || [];

    function locals(obj) {
      for (var key in obj) locals[key] = obj[key];
      return obj;
    }

    return locals;
  }

  // merge
  function merge(t, s) {
    var k;
    if (t && s) {
      for (k in s) {
        t[k] = s[k];
      }
    }
    return t;
  }

  // isArray
  var isArray = Array.isArray;
  if (!isArray) {
    isArray = function (a) {
      return a instanceof Array;
    };
  }

  // pathToRegexp
  function pathToRegexp(path, keys, sensitive, strict) {
    if (path instanceof RegExp) return path;
    if (isArray(path)) path = '(' + path.join('|') + ')';
    path = path
      .concat(strict ? '' : '/?')
      .replace(/\/\(/g, '(?:/')
      .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function(_, slash, format, key, capture, optional, star) {
        keys.push({ name: key, optional: !! optional });
        slash = slash || '';
        return ''
          + (optional ? '' : slash)
          + '(?:'
          + (optional ? slash : '')
          + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
          + (optional || '')
          + (star ? '(/*)?' : '');
      })
    .replace(/([\/.])/g, '\\$1')
    .replace(/\*/g, '(.*)');
    return new RegExp('^' + path + '$', sensitive ? '' : 'i');
  }
});

define('live', function (require) {
    "use strict";

    var _ENV_ = window._ENV_,
        streaming_api_url = _ENV_.streaming_api_url,
        api_url = _ENV_.api_url;

    var Store  = require('store');

    var token  = '';

    var secInt = 30;

    var secCnt = secInt;

    var bolDebug = false;

    var echo     = null;

    var lstEcho  = '';

    var myData   = {
        card      : {
            id         : '',
            name       : '',
            avatar     : '',
            bio        : '',
            identities : [],
            timestamp  : 0
        },
        latitude  : '',
        longitude : '',
        accuracy  : '',
        traits    : []
    };

    var now = Date.now || function () { return new Date().getTime(); };

    var streaming_api_url = streaming_api_url;

    var submit_request    = null;

    var shake_start_callback = null;

    var shake_end_callback   = null;


    var log = function(data, table) {
        if (bolDebug) {
            var type = Object.prototype.toString.call(data);
            var time = new Date().toString();
            if (type !== '[object String]' && type !== '[object Number]') {
                data = JSON.stringify(data);
            }
            console.log(time.replace(/^.*(\d{2}:\d{2}:\d{2}).*$/, '$1') + ' - ' + data);
            if (table && console.table) {
                console.table(table);
            }
        }
    }


    var submitCard = function() {
        secCnt = 0;
        log('Breathe with' + (token ? (' token: ' + token) : 'out token'));
        if (submit_request) {
            submit_request.abort();
        }
        submit_request = $.ajax({
            type    : 'post',
            url     : streaming_api_url + '/v3/live/cards' + (token ? ('?token=' + token) : ''),
            data    : JSON.stringify(myData),
            success : function(data) {
                //var rawToken = JSON.parse(data);
                var rawToken = data;
                if (rawToken && rawToken.length) {
                    secCnt = 0;
                    if (token !== rawToken[0]) {
                        log('Got new token: ' + rawToken[0] + ', id: ' + rawToken[1]);
                        if (stream.live) {
                            stream.kill();
                            log('Close current stream');
                        }
                        secCnt = secInt;
                    }
                    token = rawToken[0];
                    myData.card.id = rawToken[1];
                }
            },
            error   : function(data) {
                if (data.status
                 && data.status >= 400
                 && data.status <= 499) {
                    if (token) {
                        log('Repeal token: ' + token);
                    }
                    token  = '';
                    secCnt = secInt;
                } else {
                    secCnt = secInt - 5;
                    log('Network error');
                }
            }
        });
        if (!stream.live && token) {
            stream.init(
                streaming_api_url + '/v3/live/streaming?token=' + token,
                streamCallback, streamDead
            );
            log('Streaming with token: ' + token);
        }
    }


    var streamCallback = function(data) {
        if (data && data.length) {
            var rawCards = JSON.parse(data[data.length - 1]);
            if (rawCards && rawCards.length) {
                var cards = {};
                for (var i in rawCards) {
                    if (rawCards[i].id) {
                        if (rawCards[i].id === myData.card.id) {
                            myData.card.name       = rawCards[i].name;
                            myData.card.avatar     = rawCards[i].avatar;
                            myData.card.bio        = rawCards[i].bio;
                            myData.card.identities = rawCards[i].identities;
                            myData.card.timestamp  = rawCards[i].timestamp;
                        } else {
                            if (!rawCards[i].avatar) {
                                rawCards[i].avatar = encodeURI(
                                    api_url + '/avatar/default?name=' + rawCards[i].name
                                );
                            }
                            cards[rawCards[i].id] = rawCards[i];
                        }
                    }
                }
                var result  = {me : clone(myData.card), others : cards};
                var curEcho = JSON.stringify(result);
                log('Streaming pops: ' + curEcho, cards);
                if (echo && lstEcho !== curEcho) {
                    log('Callback')
                    echo(result);
                    lstEcho = curEcho;
                }
            } else {
                log('Data error');
            }
        }
    };


    var streamDead = function() {
        log('Streaming is dead');
    };


    var breatheFunc  = function() {
        if (checkCard(myData.card)) {
            if (++secCnt >= secInt) {
                submitCard();
            }
        }
    };


    var stream = {
        prvLen : null,
        nxtIdx : null,
        timer  : null,
        http   : null,
        pop    : null,
        dead   : null,
        live   : false,
        init   : function(url, pop, dead) {
            this.prvLen = 0;
            this.nxtIdx = 0;
            this.live   = true;
            this.pop    = pop;
            this.dead   = dead;
            this.http   = new XMLHttpRequest();
            this.http.open('post', url);
            this.http.onreadystatechange = this.listen;
            this.http.send();
            this.timer  = setInterval(this.listen, 1000);
        },
        listen : function() {
            if ((stream.http.readyState   !== 4 && stream.http.readyState !== 3)
             || (stream.http.readyState   === 3 && stream.http.status     !== 200)
             ||  stream.http.responseText === null) { // In konqueror http.responseText is sometimes null here...
                return;
            }
            if ( stream.http.readyState   === 4 && stream.http.status     !== 200) {
                stream.kill();
            }
            while (stream.prvLen !== stream.http.responseText.length) {
                if (stream.http.readyState === 4  && stream.prvLen === stream.http.responseText.length) {
                    break;
                }
                stream.prvLen  = stream.http.responseText.length;
                var rawResp    = stream.http.responseText.substring(stream.nxtIdx);
                var lneResp    = rawResp.split('\n');
                stream.nxtIdx += rawResp.lastIndexOf('\n') + 1;
                if (rawResp[rawResp.length - 1] !== '\n' || !lneResp[lneResp.length]) {
                    lneResp.pop();
                }
                if (stream.pop) {
                    stream.pop(lneResp);
                }
            }
            if ( stream.http.readyState === 4 && stream.prvLen === stream.http.responseText.length) {
                stream.kill();
            }
        },
        kill   : function() {
            clearInterval(this.timer);
            if (this.http) {
                this.http.abort();
            }
            if (this.dead) {
                this.dead();
            }
            this.live = false;
        }
    };


    var rawShake = function() {
        if (typeof window.DeviceMotionEvent === 'undefined') {
            return null;
        }
        // Shake sensitivity (a lower number is more)
        var sensitivity = 50;
        // Position variables
        var x1 = 0, y1 = 0, z1 = 0, x2 = 0, y2 = 0, z2 = 0;
        // Listen to motion events and update the position
        window.addEventListener('devicemotion', function (e) {
            x1 = e.accelerationIncludingGravity.x;
            y1 = e.accelerationIncludingGravity.y;
            z1 = e.accelerationIncludingGravity.z;
        }, false);
        // Periodically check the position and fire
        // if the change is greater than the sensitivity
        setInterval(function () {
            var change = Math.abs(x1 - x2 + y1 - y2 + z1 - z2);
            if (change > sensitivity) {
                if (shake_start_callback) {
                    shake_start_callback();
                }
                if (shake_end_callback) {
                    setTimeout(shake_end_callback, 1000);
                }
            }
            // Update new position
            x2 = x1;
            y2 = y1;
            z2 = z1;
        }, 100);
    };


    var checkIdentity = function(identity) {
        if (identity
         && identity.external_username
         && identity.provider) {
            return true;
        }
        return false;
    };


    var checkCard = function(card) {
        if (card
         && card.name
         && card.identities
         && card.identities.length) {
            for (var i in card.identities) {
                if (checkIdentity(card.identities[i]) === false) {
                    return false;
                }
            }
            return true;
        }
    };


    var clone = function(variable) {
        switch (Object.prototype.toString.call(variable)) {
            case '[object Object]':       // Object instanceof Object
                var variableNew = {};
                for (var i in variable) {
                    variableNew[i] = clone(variable[i]);
                }
                break;
            case '[object Array]':        // Object instanceof Array
                variableNew = [];
                for (i in variable) {
                    variableNew.push(clone(variable[i]));
                }
                break;
            default:                      // typeof Object === 'function' || etc
                variableNew = variable;
        }
        return variableNew;
    };


    var live = {
        init : function(card, callback) {
            if (checkCard(card)) {
                stream.kill();
                myData.card.name       = card.name;
                myData.card.avatar     = card.avatar;
                myData.card.bio        = card.bio;
                myData.card.identities = clone(card.identities);
                myData.card.timestamp  = now();
                log('Set my card: ' + JSON.stringify(myData.card));
            } else {
                log('Card error');
            }
            if (callback) {
                echo = callback;
                log('Set callback function');
            }
            secCnt = secInt;
        },
        shake : function(start_callback, end_callback) {
            shake_start_callback = start_callback;
            shake_end_callback   = end_callback;
        },
        startGeo: startGeo,
        stopGeo: stopGeo
    };


    var breatheTimer = setInterval(breatheFunc, 1000);


    var inthndShake  = rawShake(shake_start_callback, shake_end_callback);

    var intGeoWatch;

    function stopGeo() {
        navigator.geolocation.clearWatch(intGeoWatch);
    }

    function startGeo() {
        intGeoWatch  = navigator.geolocation.watchPosition(function(data) {
            if (data
             && data.coords
             && data.coords.latitude
             && data.coords.longitude
             && data.coords.accuracy) {
                myData.latitude  = data.coords.latitude.toString();
                myData.longitude = data.coords.longitude.toString();
                myData.accuracy  = data.coords.accuracy.toString();
                secCnt           = secInt - 5;
                log(
                    'Location update: '
                  + 'lat = ' + myData.latitude  + ', '
                  + 'lng = ' + myData.longitude + ', '
                  + 'acu = ' + myData.accuracy
                );
            }
        });
    }


    window.addEventListener('load', function() {
        setTimeout(function() {
            window.scrollTo(0, 0);
        }, 0);
    });


    return live;
});

define('mobilemiddleware', function (require, exports, module) {
  'use strict';

  var getSMSTokenFromHead = function () {
    var header = document.getElementsByTagName('head')[0],
        meta = document.getElementsByName('sms-token')[0],
        smsToken = null;

    if (meta) {
      smsToken = JSON.parse(meta.content);
      header.removeChild(meta);
    }

    return smsToken;
  },

  iPhone = navigator.userAgent.match(/iPhone/);


  module.exports = {

    // hacked hide safari-nav-bar
    setHtmlHeight: function (req, res, next) {

      setTimeout(function() {
        window.scrollTo(0, 0);
      }, 0);

      if (!iPhone) {
        $('#app-main').addClass('app-box');
      }

      // Status-bar: 20px
      // Nav-bar: 60px
      // Button-bar: 44px
      var html = document.documentElement,
          height = window.innerHeight,
          app = req.app;

      // 1136 / 2 - (20 + 60 + 44)
      if (height >= 444) {
        height = 508;
      // 960 / 2 - (20 + 60 + 44)
      } else if (height <= 356) {
        height = 420;
      }

      app.screen = {
        width: 320,
        height: height,
        ios: (height <= 420 ? 'iphone4': '')
      };

      html.style.minHeight = height + 'px';

      next();
    },

    checkStorageSupported: function (req, res, next) {
      try {
        var localStorage = window.localStorage;
        if (localStorage) {
          localStorage.setItem('storage', 0);
          localStorage.removeItem('storage');
        }
      } catch(err) {
        alert('EXFE cannot be used in private browsing mode.');
      }

      next();
    },

    // check `sms-token`
    checkSMSToken: function (req, res, next) {
      var smsToken = getSMSTokenFromHead();

      if (smsToken) {
        var action = smsToken.action;
        req.resolveToken = smsToken;
        if ('VERIFIED' === action) {

          res.redirect('/#verify');

        } else if ('INPUT_NEW_PASSWORD' === action) {

          res.redirect('/#set_password');

        }
        return;
      }

      next();
    },

    // cleanup `Pages`
    cleanup: function (req, res, next) {
      delete req.smsToken;
      $('#app-body').css('height', 'auto');
      $('#app-header').addClass('hide');
      $('#app-footer').removeClass('ft-bg');

      // Todo: 切换页面, before -> done -> after
      var switchPageCallback = req.switchPageCallback;
      if (switchPageCallback) {
        switchPageCallback();
      } else {
        $('#app-body .page').addClass('hide');
        //.remove();
      }
      delete req.switchPageCallback;

      next();
    },

    errorHandler: function (req, res) {
      req.error = {
        code: 404
      };
      res.redirect('/');
    }

  };

});

define('mobilecontroller', function (require, exports, module) {
  'use strict';

  var Base = require('base'),
      Store = require('store'),
      TWEEN = require('tween'),
      api_url = window._ENV_.api_url,
      Handlebars = require('handlebars'),

      util   = require('util'),
      trim = util.trim,
      parseId = util.parseId,

      iPad = navigator.userAgent.match(/iPad/),

      Live   = require('live'),

      escape = function (html, encode) {
        return html
          .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      },

      now = Date.now || function () { return new Date().getTime(); },

      showAppInStore = function() {
        window.location = 'itms://itunes.apple.com/us/app/exfe/id514026604';
      },

      launchApp = function (args) {
        App.set('tryRedirectAt', now());
        window.location = 'exfe://crosses/' + (args || '');
      },

      hasWebkitTransform = ('webkitTransform' in document.body.style),
      setCSSMatrix = function (e, m) {
        var d = m.length === 6 ? '' : '3d';
        e.style[hasWebkitTransform ? 'webkitTransform' : 'transform'] = 'matrix' + d + '(' + m.join(',') + ')';
      },

      getLiveCard = function () {
        var liveCard = Store.get('livecard');
        if (!liveCard) {
          var card = {
            id         : '',
            name       : '',
            avatar     : '',
            bio        : '',
            identities : []
          };
          liveCard = {
            // Note: 是否清空原来 user.id
            card: card,
            latitude  : '',
            longitude : '',
            accuracy  : '',
            traits    : []
          };
          var user = Store.get('user');
          if (user) {
            card.name = user.name;
            card.avatar = user.avatar_filename;
            card.bio = user.bio;
            card.identities = user.identities;
          }
          Store.set('livecard', liveCard);
        }
        liveCard.card.id = '';
        return liveCard;
      },


      /**- _ -**/
      M4    = [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0,   0,  0, 0, 1 ],
      MCP0  = [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 128, 28, 0, 1 ], // `live-edit` my-card position
      MCP1  = [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 128,  0, 0, 1 ], // `home` home-card position
      /**- _ -**/

      uuid = 0,
      guid = function () {
        return 'Controller-' + uuid++;
      };

  exports = module.exports = {};

  // `Controllers`
  var Controller = Base.extend({

    initialize: function (options) {
      this.cid = guid();
      this.initOptions(options);
      this.parseElement();
      this.init();
      Controller.caches[this.cid] = this;
    },

    parseElement: function () {
      var element = this.element,
          template = this.options.template;

      if (element) {
        this.element = element instanceof $ ? element : $(element);
      } else if (template) {
        this.element = $(template);
      }

      if (!this.element) {
        throw 'element is invalid';
      }

      this.element.attr('data-page-id', this.cid);
    },

    initOptions: function (params) {
      this.setOptions(params);

      //delete params.options;

      for (var k in params) {
        if (k !== 'options') { this[k] = params[k]; }
      }
    },

    init: function () {},

    destory: function () {
      this.element.off();
      this._destory();
    },

    _destory: function () {
      delete Controller.caches[this.cid];
      Controller.superclass.destory.call(this);
    },

    $: function (selector) {
      return this.element.find(selector);
    }

  });

  Controller.caches = [];


  // `app-footer` controller
  exports.FooterController = Controller.extend({

    countDown: 5,
    //countDown: 500000,

    element: $('#app-footer'),

    init: function () {
      this.listen();
    },

    enableTimer: true,

    listen: function () {
      var self = this,
          element = self.element;
      element
        .on('click.footer', '.redirecting, .web-version', function () {
          window.location.href = '/?ipad' + location.hash;
        })
        .on('click.footer', '.get-button button', function () {
          showAppInStore();
        })

        .on('keydown.footer', '#email', function (e) {
          if (e.keyCode === 13) {
            var email = self.$('#email').val();
            self.addNotificationIdentity(email);
          }
        })
        .on('click.footer', '.subscribe .btn_mail', function () {
          var email = trim(self.$('#email').val());
          self.addNotificationIdentity(email);
        })

      this.on('show', function (screen, hasBanner, hasCross, hasError) {
        var top = screen.height - 96 - (hasBanner ? 60 : 0);
        this.element.removeClass('hide');
        this.element.css({
          position: 'relative',
          top:  top + 'px'
        });
        if (this.enableTimer) {
          this.emit('start-redirect');
        }
        if (iPad) {
          this.$('.web-version').removeClass('hide');
        }
        this.$('.error-info').toggleClass('hide', !hasError);
      });

      this.on('reset-position', function () {
        var top = App.screen.height - 96;
        this.element.removeClass('hide');
        this.element.css({
          position: 'absolute',
          top:  top + 'px'
        });
        if (iPad) {
          this.$('.web-version').removeClass('hide');
        }
      });

      this.on('show-from-cross', function (exfee_id, token, args) {
        this.element.css({
          position: 'relative',
          top: 0,
        });
        this.emit('stop-redirect');
        this.element.addClass('ft-bg');
        this.cross = {
          exfee_id: exfee_id,
          token: token
        };
        this.$('.actions').addClass('action-cross')
        this.$('.action').addClass('hide');
        if (token) {
          this.$('.subscribe').removeClass('hide')
        }
        this.element.removeClass('hide');
        $('#app-footer').addClass('ft-bg');
        if (args && this.enableTimer) {
          this.emit('start-redirect', args);
        } else {
          this.$('.get-button').removeClass('hide');
          $('.redirect').addClass('hide');
        }
        if (iPad) {
          this.$('.web-version').removeClass('hide');
        }
      });

      this.on('show-from-resolve-token', function () {
        this.emit('stop-redirect');
        if (this.countDown < 1) {
          $('.redirecting').removeClass('hide');
          launchApp();
        } else {
          this.emit('start-redirect');
        }
      });

      this.on('start-redirect', function (args) {
        this.$('.get-button').addClass('hide');
        var $r = $('.redirecting').removeClass('hide'), $s = $r.find('.sec'), countDown = self.countDown, si;
        $s.text(si = countDown);
        this.App.set('redirectTimer', setInterval(function() {
          self.countDown = si -= 1;
          if (si >= 1) {
            $s.text(si);
          } else {
            $r.addClass('hide');
            self.emit('stop-redirect');
            launchApp(args);
            //$('.actions .error-info').hide();
          }
        }, 1000));
      });

      this.on('stop-redirect', function () {
        this.enableTimer = false;
        this.$('.get-button').removeClass('hide');
        $('.redirecting').addClass('hide');
        this.App.set('redirectTimer', clearInterval(this.App.set('redirectTimer')));
      });
    },

    addNotificationIdentity: function (email, exfee_id, token) {
      exfee_id = this.cross.exfee_id;
      token = this.cross.token;
      var identity = parseId(email);
      if (identity && identity.provider !== 'email') {
        $('#email.email').attr('placeholder', 'Bad email Address.');
        return;
      }
      $.ajax({
        type: 'POST',
        url: api_url + '/Exfee/'+ exfee_id + '/AddNotificationIdentity' + '?token=' + token,
        data: {
          provider: identity.provider,
          external_username: identity.external_username
        },
        success : function(data) {
          if (data && data.meta && data.meta.code === 200) {
            $('.subscribe').hide();
          }
        },
        error   : function() {
          alert('Failed, please retry later.');
        }
      });
    }
  });


  // `verify` controller
  exports.VerifyController = Controller.extend({

    init: function () {
      this.render();
      this.listen();
    },

    render: function () {
      if (!$('#app-verify').length) {
        this.element.appendTo($('#app-body'));
      }
    },

    listen: function () {
      var self = this,
          resolveToken = this.resolveToken;
      this.on('show', function (req, res) {
        setTimeout(function () {
          window.scrollTo(0, 0);
        }, 14);
        var cb = function () {
          // error getting identity informations
          req.error = true;
          res.redirect('/');
        };
        this.element.removeClass('hide');
        $('#app-body').css('height', '100%');
        App.controllers.footer.emit('reset-position');
        $.ajax({
          type: 'POST',
          url: api_url + '/Users/' + resolveToken.user_id + '?token=' + resolveToken.token,
          data: { token : resolveToken.token },
          success: function (data) {
            var meta = data.meta;
            if (meta && meta.code === 200) {
              var user = data.response.user,
                  identities = user.identities;
              for (var i = 0, len = identities.length; i < len; ++i) {
                var identity = identities[i];
                if (identity.id === resolveToken.identity_id) {
                  self.showIdentity(identity);
                  self.$('.done-info').removeClass('hide');
                  App.controllers.footer.emit('show-from-resolve-token');
                  break;
                }
              }
              return;
            }
            // error getting identity informations
            cb();
          },
          error: function () { cb(); }
        });
      });
    },

    showIdentity: function (identity) {
      var $identity = this.$('.identity');
      $identity.find('.name').text(identity.name);
      $identity.find('.avatar').attr('src', identity.avatar_filename);
      //$identity.find('.provider').attr('src', '/static/img/identity_' + identity.provider + '_18_grey@2x.png');
    }

  });


  // `set-password` controller
  exports.SetPasswordController = Controller.extend({
    init: function () {
      this.render();
      this.listen();
    },

    render: function () {
      if (!$('#app-setpassword').length) {
        this.element.appendTo($('#app-body'));
      }
    },

    submitPassword: function () {
      var self = this,
          token = this.token,
          $button = this.$('.set-button button'),
          $error = this.$('.error-info'),
          $name = this.$('#name'),
          $pass = this.$('#password'),
          name = trim($name.val()),
          password = $pass.val();
      if (name && password.length >= 4) {
        $button
          .addClass('disabled')
          .prop('disabled', true);

        $.ajax({
          type: 'POST',
          url: api_url + '/Users/ResetPassword',
          data: {
            token: token,
            name: name,
            password: password
          },
          success: function (data) {
            var meta = data.meta;
            if (meta && meta.code === 200) {
              $name.blur();
              $pass.blur();
              self.$('.done-info').removeClass('hide');
              $error.html('').addClass('hide');
              $button.parent().addClass('hide');
              App.controllers.footer.emit('show-from-resolve-token');
            } else {
              $button.removeClass('disabled').prop('disabled', true);
            }
            $button.removeClass('disabled').prop('disabled', true);
          },
          error: function () {
            $error.html('Failed to set password. Please try later.').removeClass('hide');
            $button.removeClass('disabled').prop('disabled', false);
          }
        });
      } else {
        $error.html('Password must be longer than four!').removeClass('hide');
      }
    },

    listen: function () {
      var self = this,
          element = this.element,
          resolveToken = this.resolveToken;

      var TST, TOUCH_TIMEOUT;
      element.on('touchstart.setpassword', '.pass', function () {
        if (TOUCH_TIMEOUT) {
          clearTimeout(TOUCH_TIMEOUT);
          TOUCH_TIMEOUT = void 0;
        }
        TST = now();
        var $input = $(this).prev();
        $input.prop('type', 'password');
      })
        .on('touchend.setpassword', '.pass', function (e) {
          // 0.3 minute
          if (now() - TST > 0.3 * 1000) {
            var $input = $(this).prev();
            $input.prop('type', 'text');
            // 0.5 minute
            TOUCH_TIMEOUT = setTimeout(function () {
              $input.prop('type', 'password');
            }, 500);
          }
          e.preventDefault();
          e.stopPropagation();
          return false;
        })
        .on('keydown.setpassword', '#password', function (e) {
          if (e.keyCode === 13) {
            self.submitPassword();
          } else {
            self.$('.error-info').html('');
          }
        })
          .on('touchstart.setpassword', '.set-button button', function () {
            self.submitPassword();
          });

      this.on('show', function (req, res) {
        setTimeout(function () {
          window.scrollTo(0, 0);
        }, 0)
        var cb = function () {
          // error getting identity informations
          req.error = true;
          res.redirect('/');
        };
        element.removeClass('hide');
        $('#app-body').css('height', '100%');
        App.controllers.footer.emit('reset-position');

        $.ajax({
          type: 'POST',
          url: api_url + '/Users/' + resolveToken.user_id + '?token=' + resolveToken.token,
          data: { token : resolveToken.token },
          success: function (data) {
            var user = data.response.user;
            if (data && data.meta && data.meta.code === 200) {
              $('.identity .avatar').attr('src', user.avatar_filename);
              $('.identity .name').html(user.name);
              return;
            }
            cb();
          },
          error: function() {
            cb();
          }
        });
      });
    }
  });


  // `home` controller
  exports.HomeController = Controller.extend({
    //options: {template: '<div/>'},

    init: function () {
      this.render();
      this.listen();
    },

    render: function () {
      if (!$('#app-home').length) {
        this.element.appendTo($('#app-body'));
      }
    },

    listen: function () {
      var self = this,
          element = this.element;

      element.on('touchstart.home', '#home-card', function () {
        clearInterval(App.set('tryTimer'));
        App.set('tryTimer', void 0);

        self.stopAnimate();

        // {{{
        self.emit('goto-live');
        // }}}
      })

      this.on('goto-live', function () {
        App.controllers.footer.emit('stop-redirect');

        App.request.switchPageCallback = function () {
          element.addClass('hide');
        };
        App.response.redirect('/#live');
      });

      this.on('show', function (screen, error) {
        // set `logo` & `my-card` position
        var h = screen.height;
        this.$('.logo-box .inner').css('top', (h - 300) / 2 + 'px');
        element.removeClass('hide');
        MCP1[13] = (h - 64) / 2;
        this.setHomeCard(MCP1);

        error = !!(error && (error.code === 404));

        var $title = this.$('.title');
        /*
        $title.find('.normal').toggleClass('hide', error);
        $title.find('.invalid').toggleClass('hide', !error);
        */
        $title.find('.normal').removeClass('hide');
        if (error) {
          setTimeout(function () {
            alert('Sorry. Your link is invalid or expired. Requested page was not found.');
          }, 14)
        }

        // @note: 先隐藏掉 live 功能，等待功能完善
        this.$('#home-card').css('display', 'none');
        //this.startAnimate();
      });
    },

    setHomeCard: function (m4) {
      var liveCard = getLiveCard(), card = liveCard.card,
          name = card.name, avatar = card.avatar,
          $homeCard = this.$('#home-card');
      setCSSMatrix($homeCard[0], m4);
      if (card && (name || avatar)) {
        if (!avatar) {
          avatar = name ? (api_url + '/avatar/default?name=' + name) : '/static/img/portrait_default.png';
        }
        avatar = 'url(' + avatar + ')';
      } else {
        avatar = '';
      }
      $homeCard.find('.avatar').css('background-image', avatar);
    },

    // animation options
    aopts: { o: 1 },

    createAnimate: function () {
      var aopts = this.aopts,
          logo = document.getElementById('big-logo'),
          card = document.getElementById('home-card'),
          update = function () {
            logo.style.opacity = aopts.o;
            card.style.opacity = 1 - aopts.o;
          };

      this._a = new TWEEN.Tween(aopts)
        .delay(1377)
        .to({ o: 0 }, 1377)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate(update);

      this._b = new TWEEN.Tween(aopts)
        .delay(1377)
        .to({ o: 1 }, 1377)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate(update);
    },

    startAnimate: function () {
      if (!this._a && !this._b) {
        this.createAnimate();
      }

      this._a.chain(this._b);
      this._b.chain(this._a);

      this._a.start();
    },

    stopAnimate: function () {
      var aopts = this.aopts,
          logo = document.getElementById('big-logo'),
          card = document.getElementById('home-card');

      this._a.chain();
      this._b.chain();
      this._b.stop();
      this._a.stop();

      aopts.o = logo.style.opacity = 1;
      card.style.opacity = 0;
    }

  });


  // `Cross` controller
  exports.CrossController = Controller.extend({

    init: function () {
      this.render();
      this.listen();
    },

    render: function () {
      if (!$('#app-cross').length) {
        this.element.appendTo($('#app-body'));
      }
    },

    listen: function () {
      var self = this,
          element = this.element,
          token = this.token,
          cross = this.cross;

      var $rsvp_toolbar = self.$('.rsvp_toolbar');
      element.on('touchstart.cross', '.portrait.me', function () {
        $rsvp_toolbar.toggleClass(
          'rsvp_toolbar_off',
          !$rsvp_toolbar.hasClass('rsvp_toolbar_off')
        );
      })
      // change name
        .on('touchstart.cross', '.changename', function () {
          var name = prompt('Change my display name:');
          if (!name) {
            alert('Display name cannot be empty.');
          } else {
            $.ajax({
              type: 'POST',
              url: api_url + '/Identities/'+ cross.identity.id + '/Update' + '?token=' + token,
              data: { name : name },
              success: function(data) {
                if (data && data.meta && data.meta.code === 200) {
                  self.$('.name_me').html(escape(data.response.identity.name));
                }
              },
              error: function() {
                alert('Failed, please retry later.');
              }
            });
          }
        })

      // rsvp
        .on('touchstart.cross', '.rsvp.accepted, .rsvp.unavailable', function () {
          var type = $(this).hasClass('accepted') ? 'ACCEPTED' : 'DECLINED';
          self.rsvp(type);
        })

      // description
        .on('touchstart.cross', '.inf_area .description', function () {
          var $t = $(this),
              clickable = $t.hasClass('clickable');
          if (clickable) {
            var limit = $t.hasClass('limit');
            $t.toggleClass('limit', !limit);
            $t.find('.xbtn-more .rb').toggleClass('hidden', limit);
            $t.find('.xbtn-more .lt').toggleClass('hidden', !limit);
          }
        })

      this.on('show', function () {
        element.removeClass('hide');

        var $desc = this.$('.inf_area .description');
        if ($desc.height() > 130) {
          $desc.addClass('limit clickable');
          $desc.find('.xbtn-more').removeClass('hide');
          $desc.find('.xbtn-more .rb').removeClass('hidden');
        }
      });

    },

    rsvp: function (status) {
      var id = this.cross.identity.id, exfee_id = this.exfee_id, token = this.token;
      var data = [{
        rsvp_status: status,
        identity_id: id,
        by_identity_id: id
      }];
      this.$('.rsvp_toolbar').addClass('rsvp_toolbar_off');
      var $rsvpMe = this.$('.portrait_rsvp_me').removeClass('accepted declined pending');
      switch (status) {
      case 'ACCEPTED':
        $rsvpMe.addClass('accepted');
        break;
      case 'DECLINED':
        $rsvpMe.addClass('declined');
        break;
      default:
        $rsvpMe.addClass('pending');
      }
      $.ajax({
        type: 'post',
        url: api_url + '/Exfee/' + exfee_id + '/Rsvp?token=' + token,
        data: { rsvp: JSON.stringify(data) },
        success : function() {},
        error   : function() {
          alert('RSVP failed!');
        }
      });
    }

  });


  // `live` controller
  exports.LiveController = Controller.extend({
    init: function () {
      this.render();
      this.listen();
    },

    render: function () {
      if (!$('#app-live').length) {
        this.element.appendTo($('#app-body'));
      } else {
        this.element = $('#app-live');
      }
    },

    listen: function () {
      var self = this,
          element = this.element;

      var TOUCH_TIMEOUT, TOUCH_TIME;

      element.on('touchstart.live', '#card-name', function (e) {
        e.stopPropagation();
        setTimeout(function () {
          window.scrollTo(0, 0);
        }, 0);
        this.focus();
      })

        .on('touchend.live', '.live-form', function (e) {
          e.stopPropagation();
          if ($(e.target).hasClass('live-form')) {
            element.find('.input-item').blur();
            App.response.redirect('/');
          }
        })

        .on('keydown.live', '#card-name', function (e) {
          var k = e.keyCode, v = trim(this.value);
          if (v && k === 13) {
            self.addEmailOrPhone(this, v);
          }
        })
        .on('blur.live', '#card-name', function () {
          var v = trim(this.value);
          if (v) {
            self.addEmailOrPhone(this, v);
          } else {
            self.setCardName(this);
          }
        })

        .on('keydown.live blur.live', '#add-identity', function (e) {
          var k = e.keyCode, v = trim(this.value);
          if ((v && k === 13) || e.type === 'blur') {
            self.addEmailOrPhone(this, v, true);
            this.value = '';
          }
        })

        .on('keydown.live blur.live', '#facebook-identity', function (e) {
          var k = e.keyCode, v = trim(this.value);
          if ((v && k === 13) || e.type === 'blur') {
            v += '@facebook';
            if (self.addFacebook(this, v)) {
              $('#add-identity-facebook').addClass('hide');
            }
            this.value = '';
          }
        })

      .on('touchstart.live', '.list .input-item', function () {
        $(this).next().removeClass('hidden')
      })
      .on('blur.live', '.list .input-item', function () {
        $(this).next().addClass('hidden')
        self.updateIdentityLi(this);
      })

      .on('touchstart.live', '.list .delete', function () {
        var input = $(this).prev()[0],
            v = trim(input.value),
            dp = input.getAttribute('data-provider'),
            isFacebook = dp === 'facebook',
            identity;

        if (isFacebook) {
          v += '@facebook';
        }

        identity = parseId(v);

        $(this).parent().remove();
        if (identity && identity.provider) {
          self.removeIdentity(identity);
        }

        if (isFacebook) {
          self.emit('show-add-facebook');
        }
      })

        .on('touchstart.live', '.btn-start', function () {
          var $inputs = $('.list .input-item');
          $inputs.each(function () {
            self.updateIdentityLi(this);
          });

          var cardName = document.getElementById('card-name');
          cardName.blur();
          var v = trim(cardName.value);
          if (v) {
            self.liveCard.card.name = v;
          } else {
            self.setCardName(cardName);
          }

          setTimeout(function () {
            if (self.inspectFields()) {
              self.emit('post-card');
              self.emit('live-gather');
            }
          }, 23)

          //}
        })
        .on('hold:live', '.live-gather .card .avatar', function () {
            var t = this, pe = t.parentNode;
            var card = $(pe).data('card')
            var matrix = pe.style.transform || pe.style.webkitTransform;
            var m = matrix.match(/([\-\d\.]+)/g).slice(1);
            var tip = document.getElementById('card-tip');
            var html = '';
            if (card && card.identities) {
              for (var i = 0, l = card.identities.length; i < l; ++i) {
                var identity = card.identities[i], p = identity.provider, eu = identity.external_username;
                var ps = '';
                if (p !== 'email' && p !== 'phone') {
                  p = p.substr(0, 1).toUpperCase() + p.substr(1);
                  ps = '<span class="provider">'+p+'</span>'
                }
                html += '<li><span class="external-username'+(ps ? '' : ' normal')+'">'+eu+'</span>'+ps+'</li>'
              }
              tip.querySelector('ul').innerHTML = html;
              var h = tip.clientHeight;
              var x = ~~m[12] - (200 - 64) / 2, y = ~~m[13] - (6 + h), ax = 93;
              if (x < 0) {
                x = 10;
              } else if (x + 200 >= 320) {
                x = 320 - 200 - 10;
              }
              if (x === 10 || x === 110 ) {
                ax = ~~m[12] + 32 - 7 - x;
              }
              m[12] = x;
              m[13] = y - 5;
              m[14] = 7;
              setCSSMatrix(tip, m);
              tip.querySelector('.ang').style.left = ax + 'px';
              tip.querySelector('.bio').innerText = card.bio;
              tip.className = 'card-tip';
            }
          })

          .on('touchstart.live', '.live-gather .card .avatar', function (e) {
              var $t = $(this), delta = 250, fingers = e.touches.length;
              TOUCH_TIME = now();
              if (TOUCH_TIMEOUT) {
                clearTimeout(TOUCH_TIMEOUT);
                TOUCH_TIMEOUT = void 0;
              }
              if (fingers === 1) {
                if (fingers >= 1) {
                  TOUCH_TIMEOUT = setTimeout(function () {
                    $t.trigger('hold:live');
                  }, delta);
                }
              }
            })

          .on('touchend.live', '.live-gather .card .avatar', function () {
              if (TOUCH_TIMEOUT) {
                clearTimeout(TOUCH_TIMEOUT);
                TOUCH_TIMEOUT = void 0;
              }
              if (now() - TOUCH_TIME < 250) {
                var $p = $(this).parent();
                if (!$p.hasClass('card-me')) {
                  $p.toggleClass('selected');
                }
              }
              document.getElementById('card-tip').className = 'card-tip hidden';
            })

          .on('touchstart.live', '.back', function () {
            self.$('.live-gather').addClass('hide');
            App.response.redirect('/');
          })

          .on('touchstart.live', '.live-gather', function (e) {
            var t = e.target,
                $h2 = $('.live-title h2'),
                h2 = $h2[0],
                has = $h2.hasClass('clicked');
            if (has) {
              $('.wave').css('opacity', 1);
              $h2.data('clicked', t === h2 || $.contains(h2, t))
                  .removeClass('clicked');
              $('.live-tip').addClass('live-tip-close');
            }
          })

          .on('touchstart.live', '.live-title h2', function () {
            var $t = $(this);
            var has = $t.hasClass('clicked'), clicked = $t.data('clicked');
            if (!has && !clicked) {
              $(this).addClass('clicked');
              $('.wave').css('opacity', 0);
              $('.live-tip').removeClass('live-tip-close');
            }
            $t.data('clicked', false);
          })

          .on('touchstart.live', '.btn-confirm', function () {
            // todo: 提交联系人
            self.postContacts();
          });

      this.on('show-add-email', function () {
        this.$('#add-identity').removeClass('hide');
      });

      this.on('show-add-facebook', function () {
        if (this.$('.list input[data-provider="facebook"]').length) {
          return;
        }
        this.$('#add-identity-facebook').removeClass('hide');
      });

      this.on('show', function (screen) {
        Live.startGeo();

        this.screen = screen;

        $('#app-footer').addClass('hide');

        this.element.removeClass('hide');
        var h = screen.height;
        MCP1[13] = (h - 64) / 2;
        setCSSMatrix(this.$('#icard')[0], MCP1);
        this.$('.live-form, .live-gahter').css('min-height', h);

        this.$('.live-form').removeClass('hide');
        //this.$('.card-form').removeClass('hide');
        this.$('#live-discover').css('opacity', 0);
        this.$('#card-form').css({
          'opacity': 0,
          'min-height': ((h - 100) / h) * 100 + '%'
        });

        this.measurePositions(screen.width, screen.height - 10, 64 / 2,  64 / 2);
        this.MAPS = this._MAPS.slice(0);

        this.$('.identities .list').empty();
        this.liveCard = getLiveCard();
        this. updateMyCardForm();

        this.startAnimate();
      });

      this.on('post-card', function () {
        this.postMyCard();
      });

      this.on('disabled-live-btn', function (type) {
        this.$('.btn-start')
          .toggleClass('disabled', type);
          //.prop('disabled', type);
      });

      this.on('live-gather', function () {
        this.$('.live-form').addClass('hide');
        this.$('.live-gather').removeClass('hide');
        this.$('.wave').addClass('start');

        this.$('.live-gather').find('.card').remove();
        var card = this.liveCard.card;
        var $me = this.genCard(card, this.coords[0][0], 0, 0, true, this.screen.ios)
          .appendTo(this.$('.live-gather'));
        this.updateCard($me[0], card);

        if (this._others) {
          this.updateOthers();
        }
      });
    },

    // 编辑 input, 后检查更新
    updateIdentityLi: function (elem) {
      var eun = elem.getAttribute('data-external-username'),
          p = elem.getAttribute('data-provider'),
          n = elem.getAttribute('data-name'),
          empty = '',
          v = trim(elem.value), delable = false, failed = false, addable = false, identity;

      if (v) {
        if (p === 'facebook') {
          v += '@facebook';
        }
        identity = parseId(v);
        if (identity && identity.provider) {
          var has = this.findIdentity(identity), isSelf = (identity.provider === p && identity.external_username === eun);
          if (has && !isSelf) {
            elem.value = empty;
          }
          if (!has && !isSelf) {
            addable = true;
            delable = true;
          }
        } else {
          failed = true;
          delable = true;
        }
      } else {
        failed = true;
        delable = true;
      }

      if (failed) {
        //elem.value = '';
        elem.setAttribute('data-name', empty);
        elem.setAttribute('data-external-username', empty);
        elem.setAttribute('data-provider', empty);
        setTimeout(function () {
          alert('Invalid contact.');
        }, 14);
      }

      if (addable) {
        elem.setAttribute('data-name', identity.name);
        elem.setAttribute('data-external-username', identity.external_username);
        elem.setAttribute('data-provider', identity.provider);
        elem.value = identity.external_username;
        $(elem).prev().text(this.aliasProvider(identity.provider));
        this.updateLiveCard(identity, '+');
      }

      if (delable) {
        this.updateLiveCard({
          name: n,
          external_username: eun,
          provider: p
        }, '-', true);
      }

      if (delable || addable) {
        this.emit('post-card');
      }
    },

    postContacts: function () {},

    inspectFields: function () {
      var card = this.liveCard.card;
      return card.name && card.identities.length;
    },

    updateCardName: function (card) {
      if (card.name) {
        this.liveCard.card.name = document.getElementById('card-name').value = card.name;
        Store.set('livecard', this.liveCard)
      }
    },

    updateMe: function (card) {
      var icard = document.getElementById('icard'), a0 = icard.getAttribute('data-url'), a1;
      if (a0 !== card.avatar) {
        a1 = card.avatar;
        if (!a1) {
          a1 = card.name ? (api_url + '/avatar/default?name=' + card.name) : '/static/img/portrait_default.png';
        }
        if (a0 !== a1) {
          icard.querySelector('.avatar').style.backgroundImage = 'url(' + a1 + ')';
          icard.setAttribute('data-url', a1);
        }
      }
      var bioDiv = document.getElementById('card-bio');
      if (card.bio) {
        bioDiv.innerText = card.bio;
      }
      bioDiv.className = card.bio ? '' : 'hide';
    },

    postMyCard: function () {
      Store.set('livecard', this.liveCard);
      var card = this.liveCard.card;
      if (card.name && card.identities.length) {
        Live.init(card, $.proxy(this.liveCallback, this));
      }
    },

    // 是否更新界面
    state: 1,

    liveCallback: function (result) {
      var liveCard = this.liveCard, myCard = result.me;
      // @todo: 检查时间 timestamp
      if (this.state === 1) {
        if (myCard
            && myCard.name
            && myCard.identities.length) {

          // 1 minute
          if (now() - myCard.timestamp > 60 * 1000) {
            this.updateCardName(myCard);
          }

          this.updateMe(liveCard.card = myCard);
          Store.set('livecard', liveCard);
        }
      }
      this._others = result.others;
      this.updateOthers();
    },

    updateMyCardForm: function () {
      var liveCard = this.liveCard,
          card = liveCard.card,
          identities = card.identities,
          len;
      if (identities && (len = identities.length)) {
        this.updateCardName(card);
        this.updateMe(card);

        this.postMyCard();

        identities = identities.slice(0);

        var identity, provider;
        while ((identity = identities.shift())) {
          provider = identity.provider;
          if (provider === 'email'
            || provider === 'phone'
            || provider === 'facebook') {

            this.addIdentity(identity, true);
          }
        }

        this.emit('show-add-email');
        this.emit('show-add-facebook');
      } else {
        this.emit('disabled-live-btn', true);
      }
    },

    resetLiveCard: function () {
      this.emit('disabled-live-btn', true);
      Store.clear('livecard');
      this.liveCard = getLiveCard();
    },

    findIdentity: function (identity) {
      var card = this.liveCard.card,
          identities = card.identities,
          len = identities.length;
      if (len) {
        for (var i = 0; i < len; ++i) {
          var id = identities[i];
          if (id.provider === identity.provider
            && id.external_username === identity.external_username) {
            return true;
          }
        }
      }
      return false;
    },

    updateLiveCard: function (identity, operation, enable) {
      var card = this.liveCard.card, identities = card.identities;
      // add
      if (operation === '+') {
        identities.push(identity);
      // remove
      } else {
        for (var i = 0, len = identities.length; i < len; ++i) {
          var id = identities[i];
          if (id.provider === identity.provider
            && id.external_username === identity.external_username) {
            identities.splice(i, 1);
            break;
          }
        }
        if (!enable && identities.length === 0) {
          this.resetLiveCard();
        }
      }
      Store.set('livecard', this.liveCard);
    },

    setCardName: function (elem) {
      var identities = this.packedIdentities();
      if (identities.length) {
        var identity = identities[0],
            name = '',
            eun = identity.external_username,
            provider = identity.provider;
        if (provider === 'phone') {
          name = 'Anonym_' + eun.slice(eun.length - 4);
        } else {
          name = eun.split('@')[0];
        }

        this.liveCard.card.name = elem.value = name;

        elem.setAttribute('placeholder', 'Name');
        $(elem).addClass('normal');
      }
    },

    addFacebook: function (elem, v) {
      var identity = parseId(v), provider = identity.provider;
      if (provider
        && (provider === 'facebook')
        && !this.existsByIdentity(identity)) {

        this.addIdentity(identity);
        return true;
      }
      return false;
    },

    addEmailOrPhone: function (elem, v, status) {
      status = !status;
      var identity = parseId(v), provider = identity.provider;
      if (provider
        && (provider === 'email' || provider === 'phone')
        && !this.existsByIdentity(identity)) {

        this.addIdentity(identity);
        if (status) {
          this.setCardName(elem);
        }
      }

      if (status) {
        this.emit('show-add-email');
        this.emit('show-add-facebook');
      }

      this.emit('post-card');
    },

    aliasProvider: function (provider) {
      if (provider === 'email') {
        provider = 'Email';
      } else if (provider === 'phone') {
        provider = 'Mobile';
      } else if (provider === 'facebook') {
        provider = 'Facebook';
      }
      return provider;
    },

    genIdentity: function (identity) {
      var tmpl = Handlebars.compile($('#live-li-identity-tmpl').html()),
          provider = identity.provider;

      provider = this.aliasProvider(provider);

      var $li = $(
        tmpl({
          provider_alias: provider,
          identity: identity
        }
      ));
      return $li;
    },

    resetCard: function () {
      this.state = 0;

      this.$('#icard')
        .removeAttr('data-url')
        .find('.avatar')
          .css('background', '');

      this.$('#card-name')
        .attr('placeholder', 'Your email or mobile no.')
        .removeClass('normal')
        .val('');

      this.$('#add-identity').addClass('hide');
      this.$('#add-identity-facebook').addClass('hide');
    },

    removeIdentity: function (identity) {
      var lis = this.$('.identities .list li');
      if (0 === lis.length) {
        this.resetCard();
        this.emit('disabled-live-btn', true);
      } else {
        if(identity.provider === 'facebook') {
          this.emit('show-add-facebook');
        }
      }

      this.updateLiveCard(identity, '-');
      this.emit('post-card');
    },

    addIdentity: function (identity, status) {
      status = !status;

      this.state = 1;

      // 刷新 storge
      var list = this.$('.identities .list'),
          li = this.genIdentity(identity);
      list.append(li);

      this.emit('disabled-live-btn', false);

      if (status) {
        this.updateLiveCard(identity, '+');
        this.emit('post-card');
      }
    },

    packedIdentities: function () {
      var inputs = this.$('.identities .list').find('input'),
          i = 0, len = inputs.length,
          identities = [], input, dp,
          v, identity, provider;
      for (; i < len; ++i) {
        input = inputs.eq(i);
        dp = input.attr('data-provider');
        v = trim(inputs.eq(i).val());
        if (!v) {
          continue;
        }
        if (dp === 'facebook') {
          v += '@facebook';
        }
        identity = parseId(v);
        provider = identity.provider;
        if (provider
          && (
            provider === 'email'
            || provider === 'phone'
            || provider === 'facebook'
          )
        ) {
          identities.push(identity);
        }
      }
      return identities;
    },

    existsByIdentity: function (identity) {
      var identities = this.packedIdentities(),
          eun = identity.external_username, p = identity.provider, id;

      if (0 === identities.length) {
        return false;
      }

      while ((id = identities.shift())) {
        if (id.external_username === eun && id.provider === p) {
          return true;
        }
      }

      return false;
    },

    coords: ''.split(),
    _MAPS: [ [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2], [2, 3], [3, 0], [3, 1], [3, 2], [3, 3] ],
    MAPS: ''.split(),
    measurePositions: function (w, h, l, t) {
      var coords = this.coords;

      coords[0] = [ [w * 0.5 - l, h * 0.88 - t] ];

      coords[1] = new Array(3);
      coords[1][0] = [ w * 0.25 - 5  - l, h * 0.66 + 30 - t ];
      coords[1][1] = [ w * 0.5 - l      , h * 0.66 - t ];
      coords[1][2] = [ w * 0.75 + 5  - l, h * 0.66 + 30 - t ];

      coords[2] = new Array(4);
      coords[2][0] = [ w * 0.125 + 5 - l, h * 0.44 + 40 - t ];
      coords[2][1] = [ w * 0.375 - l    , h * 0.44 - t ];
      coords[2][2] = [ w * 0.625 - l    , h * 0.44 - t ];
      coords[2][3] = [ w * 0.875 - 5 - l, h * 0.44 + 40 - t ];

      coords[3] = new Array(4);
      coords[3][0] = [ w * 0.125 - l, h * 0.22 + 40 - t ];
      coords[3][1] = [ w * 0.375 - l, h * 0.22 - t ];
      coords[3][2] = [ w * 0.625 - l, h * 0.22 - t ];
      coords[3][3] = [ w * 0.875 - l, h * 0.22 + 40 - t ];
    },

    genCard: function (card, pos, g, i, isMe, ios) {
      var tmpl = Handlebars.compile($('#live-card-tmpl').html()),
          m = M4.slice(0);
      m[12] = pos[0];
      m[13] = pos[1];

      var $card = $(
        tmpl({
          g: g,
          i: i,
          matrix: m.join(','),
          'class': (isMe ? 'card-me' : 'card-other hide') + (ios === 'iphone4' ? ' card-iphone4' : ''),
          card: card
        })
      );

      $card.data('card', card);
      return $card;
    },

    addCard: function (card) {
      var MAPS = this.MAPS;
      if (!MAPS || MAPS.length === 0) {
        return false;
      }
      var gi = MAPS.shift(), g = gi[0], i = gi[1], pos = this.coords[g][i],
          $card = this.genCard(card, pos, g, i, false, this.screen.ios), elem = $card[0], s = elem.style,
          m = M4.slice(0);

      m[0] = m[5] = 0;
      m[12] = pos[0];
      m[13] = pos[1];
      $card.data('card', card);
      this.$('.live-gather').append($card);
      new TWEEN.Tween({ o: 0 })
        .to({ o: 1 }, 250)
        .easing(TWEEN.Easing.Bounce.In)
        .onStart(function () {
          setCSSMatrix(elem, m);
          $card.removeClass('hide')
        })
        .onUpdate(function () {
          s.opacity = this.o;
          m[0] = m[5] = this.o;
          setCSSMatrix(elem, m);
        })
        .onComplete(function () {
          TWEEN.remove(this);
        })
        .start();
    },

    delCard: function (elem) {
      var MAPS = this.MAPS,
          g = elem.getAttribute('data-g'), i = elem.getAttribute('data-i'),
          m = M4.slice(0), pos = this.coords[g][i], s = elem.style;
      m[12] = pos[0]
      m[13] = pos[1];
      new TWEEN.Tween({ o: 1 })
        .to({ o: 0 }, 250)
        .easing(TWEEN.Easing.Bounce.Out)
        .onUpdate(function () {
          s.opacity = this.o;
          setCSSMatrix(elem, m);
        })
        .onComplete(function () {
          MAPS.unshift([g, i]);
          elem.parentNode.removeChild(elem);
          TWEEN.remove(this);
        })
        .start();
    },

    updateCard: function (elem, card) {
      var a0 = elem.getAttribute('data-url'), a1 = '';
      if (!a0 || a0 !== card.avatar) {
        a1 = card.avatar;
        if (!a1) {
          a1 = card.name ? (api_url + '/avatar/default?name=' + card.name) : '/static/img/portrait_default.png';
        }
        if (a0 !== a1) {
          elem.querySelector('.avatar').style.backgroundImage = 'url(' + a1 + ')';
          elem.setAttribute('data-url', a1);
        }
      }
      elem.querySelector('.name').innerText = card.name;
      $(elem).data('card', card);
    },

    updateOthers: function () {
      var cards = this._others;
      var elems = document.querySelectorAll('.card-other'), len = elems.length, i = 0, elem, id, k, card;
      // 删除 old-card
      for (; i < len; ++i) {
        elem = elems[i];
        id = elem.getAttribute('id');
        if (!(id in cards)) {
          this.delCard(elem);
        }
      }

      // 添加 更新卡片
      for (k in cards) {
        card = cards[k];
        elem = document.getElementById(card.id);
        if (elem) {
          this.updateCard(elem, card);
        } else {
          this.addCard(card);
        }
      }
    },

    createAnimate: function () {
      var icard = this.$('#icard')[0];
      var cardForm = this.$('#card-form')[0];
      var discover = this.$('#live-discover')[0];
      var m1_13 = MCP1[13], m0_13 = MCP0[13];
      var m = MCP1.slice(0);
      this.a = new TWEEN.Tween({ o: 0 })
        .to({ o: 1 }, 500)
        .easing(TWEEN.Easing.Cubic.In)
        //.onStart(function () {//window.scrollTo(0, 0); })
        .onUpdate(function () {
          discover.style.opacity = this.o;
          m[13] = (m1_13 - m0_13) * (1 - this.o) + m0_13;
          setCSSMatrix(icard, m);
        });

      this.b = new TWEEN.Tween({ o: 0 })
        .delay(250)
        .to({ o: 1 }, 500)
        .onUpdate(function () {
          cardForm.style.opacity  = this.o;
        });
        //.onComplete(function () {});
    },

    startAnimate: function () {
      if (!this.a && !this.b) {
        this.createAnimate();
      }
      this.a.start();
      this.b.start();
    },

    stopAnimate: function () {
      this.a.stop();
      this.b.stop();
    }

  });

});

define('mobileroutes', function (require, exports, module) {
  'use strict';

  var Store = require('store'),
      Handlebars = require('handlebars'),
      humantime = require('humantime'),

      _ENV_ = window._ENV_,

      renderCrossTime = function(crossTime) {
        var dspTime   = humantime.printEFTime(crossTime, 'X');
        return dspTime;
      };

  var Controllers = require('mobilecontroller'),
      HomeController = Controllers.HomeController,
      SetPasswordController = Controllers.SetPasswordController,
      VerifyController = Controllers.VerifyController,
      CrossController = Controllers.CrossController,
      LiveController = Controllers.LiveController;

  var showCross = function (req, res, data, cats, ctoken, token) {
      cats || (cats = {});
      $.ajax({
        type: 'POST',
        url: _ENV_.api_url + '/Crosses/GetCrossByInvitationToken',
        data: data,
        success: function (data) {
          var meta = data.meta,
              code = meta && meta.code;

          if (code && code === 200) {
            var response = data.response;
            var originCross = response.cross;
            var cross = {
              id: originCross.id,
              title: originCross.title,
              description: originCross.description.replace(/\r\n|\r|\n/g, '<br />'),
              time: {
                title: 'Sometime',
                content: 'To be decided'
              },
              place: {
                title: 'Somewhere',
                description: 'To be decided'
              },
              background: 'default.jpg',
              read_only: !!response.read_only
            };

            // time
            var time = originCross.time;
            if (time
              && time.begin_at
              && time.begin_at.origin
              && time.begin_at.timezone) {
              cross.time = renderCrossTime(time);
            } else {
              cross.time.tobe = 'tobe';
            }

            // place
            var place = originCross.place;
            if (place && place.title) {
              cross.place = {
                title: place.title,
                description: place.description.replace(/\r\n|\r|\n/g, '<br />')
              };
            }
            var lat = place.lat, lng = place.lng;
            if (lat && lng) {
              var scale = window.devicePixelRatio >= 2 ? 2 : 1;
              cross.place.map = 'https://maps.googleapis.com/maps/api/staticmap?center='
                + lat + ',' + lng + '&markers=icon%3a'
                + encodeURIComponent('http://img.exfe.com/web/map_pin_blue.png')
                + '%7C'
                + lat + ',' + lng
                + '&zoom=13&size=290x100&maptype=road&sensor=false&scale='
                + scale;
              cross.place.href = 'http://maps.google.com/maps?daddr='
                + encodeURIComponent(cross.place.title) + '@'
                + lat  + ',' + lng;
            } else {
              cross.place.tobe = 'tobe';
            }

            // title background
            var widget = originCross.widget, wl;
            if (widget && (wl = widget.length)) {
              for (var wi = 0; wi < wl; ++wi) {
                if (widget[wi].type === 'Background') {
                  cross.background = widget[wi].image;
                  break;
                }
              }
            }

            // user_id
            var user_id = 0;
            // identity_id
            var myIdId = 0;
            var authorization = response.authorization;
            if (authorization) {
              user_id = authorization.user_id;
              if (response.browsing_identity) {
                myIdId = response.browsing_identity.id;
              }
            } else if (response.browsing_identity
              && response.browsing_identity.connected_user_id) {
              user_id = response.browsing_identity.connected_user_id;
              myIdId = response.browsing_identity.id;
            }

            if (response.cross_access_token) {
              token = cats[ctoken] = response.cross_access_token;
              Store.set('cats', cats);
            }

            var originInvitations = originCross.exfee.invitations;
            var invitations = [];
            //'ACCEPTED', 'INTERESTED', 'NORESPONSE', 'IGNORED', 'DECLINED'
            var orderRSVP = {
              ACCEPTED: [],
              INTERESTED: [],
              NORESPONSE: [],
              IGNORED: [],
              DECLINED: []
            };
            // current identity rsvp
            for (var i = 0, len = originInvitations.length; i < len; ++i) {
              var invitation = originInvitations[i];
              var style = 'pending', rsvp_status = invitation.rsvp_status;
              if (rsvp_status === 'ACCEPTED') {
                style = 'accepted';
              } else if (rsvp_status === 'DECLINED') {
                style = 'declined';
              }
              invitation.rsvp_style = style;
              if ((user_id && user_id === invitation.identity.connected_user_id)
                    || myIdId === invitation.identity.id) {
                invitation.is_me = true;
                myIdId = invitation.identity.id;
                if (myIdId !== invitation.invited_by.id) {
                  cross.inviter = invitation.invited_by;
                }
                //invitations.unshift(invitation);
                invitation.isphone = invitation.provider === 'phone';
                cross.identity = invitation.identity;
                orderRSVP.ACCEPTED.unshift(invitation);
              } else {
                //invitations.push(invitation);
                if (invitation.rsvp_status in orderRSVP) {
                  orderRSVP[invitation.rsvp_status].push(invitation);
                }
              }
            }

            invitations = [].concat(
              orderRSVP.ACCEPTED,
              orderRSVP.INTERESTED,
              orderRSVP.NORESPONSE,
              orderRSVP.IGNORED,
              orderRSVP.DECLINED
            );

            cross.invitations = [];
            len = invitations.length;
            var j = 0;
            while (j < len) {
              cross.invitations.push(invitations.splice(0, 5));
              j += 5;
            }
            len = cross.invitations.length;
            var invs = cross.invitations[len - 1], k = invs.length;
            if (k && k < 5) {
              while (5 - k++) {
                invs.push(void 0);
              }
            }

            var args = '';
            if (user_id) {
              if (authorization) {
                args = cross.id
                     + '?user_id='     + user_id
                     + '&token='       + authorization.token
                     + '&identity_id=' + myIdId;
                token = authorization.token;
                Store.set('authorization', authorization);
              } else {
                authorization = Store.get('authorization');
                if (authorization && authorization.user_id === user_id) {
                  args = cross.id
                       + '?user_id='     + user_id
                       + '&token='       + authorization.token
                       + '&identity_id=' + myIdId;
                  token = authorization.token;
                }
              }
            }

            // cross
            var app = req.app, controllers = app.controllers,
                crossCont = controllers.cross;

            if (crossCont) {
              crossCont.destory();
            }

            var tmpl = Handlebars.compile($('#cross-tmpl').html());
            crossCont = app.controllers.cross = new CrossController({
              options: {
                template: tmpl(cross)
              },
              cross: cross,
              exfee_id: originCross.exfee.id,
              token: token
            });

            crossCont.emit('show');

            app.controllers.footer.emit('show-from-cross', originCross.exfee.id, token, args);
          } else {
            req.error = { code: 404 };
            res.redirect('/');
          }
        },
        error: function () {
          req.error = { code: 404 };
          res.redirect('/');
        }
      });

    };

  module.exports = {

    // `index`
    index: function (req) {
      var error = req.error,
          app = req.app, controllers = app.controllers,
          homeCont = controllers.home,
          footerCont = controllers.footer,
          screen = app.screen;
      if (!homeCont) {
        homeCont = app.controllers.home = new HomeController({
          options: {
            template: $('#home-tmpl').html()
          }
        });
      }
      document.title = 'EXFE - A utility for gathering with friends.';
      homeCont.emit('show', screen, error);
      footerCont.emit('show', screen, false, false, error === true);
      delete req.error;

      app.currPageName = 'HOME';
    },

    verify: function (req, res) {
      var session = req.session,
          resolveToken = session.resolveToken,
          app = req.app;
      if (resolveToken) {
        $('#app-header').removeClass('hide');
        var verifyCont = new VerifyController({
          options: {
            template: $('#verify-tmpl').html()
          },
          resolveToken: resolveToken
        });
        verifyCont.emit('show', req, res);
      } else {
        req.error = true;
        res.redirect('/');
      }

      app.currPageName = 'VERIFY';
    },

    setPassword: function (req, res) {
      var session = req.session,
          resolveToken = session.resolveToken,
          app = req.app;
      if (resolveToken) {
        $('#app-header').removeClass('hide');
        var setPasswordCont = new SetPasswordController({
          options: {
            template: $('#setpassword-tmpl').html()
          },
          resolveToken: resolveToken,
          token: resolveToken.origin_token
        });
        setPasswordCont.emit('show', req, res);
      } else {
        req.error = true;
        res.redirect('/');
      }

      app.currPageName = 'SET_PASSWORD';
    },

    // `resolve-token`
    resolveToken: function (req, res) {
      var app = req.app,
          originToken = req.params[0],
          cb = function (req, res) {
            req.error = {
              code: 404
            };
            res.redirect('/');
          };


      if (originToken) {

        $.ajax({
          type: 'POST',
          url: _ENV_.api_url + '/Users/ResolveToken',
          data: { token : originToken },
          success: function (data) {
            if (data && data.meta && data.meta.code === 200) {
              // todo: rename
              var session = req.session;
              session.resolveToken = data.response;
              var action = session.resolveToken.action;
              if (action === 'VERIFIED') {
                res.redirect('/#verify');
              } else if (action === 'INPUT_NEW_PASSWORD') {
                session.resolveToken.origin_token = originToken;
                res.redirect('/#set_password');
              }
            } else {
              cb(req, res);
            }
          },
          error: function () {
            cb(req, res);
          }
        });

      } else {
        cb(req, res);
      }

      app.currPageName = 'RESOLVE_TOKEN';
    },

    // `cross`

    // `phone-cross-token`
    crossPhoneToken: function (req, res) {
      var app = req.app;
      var params = req.params,
          cross_id = params[0],
          ctoken = params[1];

      var cats = Store.get('cats'),
          data, token;

      data = {
        invitation_token: ctoken,
        cross_id: cross_id
      };

      if (cats && (token = cats[ctoken])) {
        data.cross_access_token = token;
      }

      showCross(req, res, data, cats, ctoken, token);

      app.currPageName = 'CROSS';
    },

    // `cross-token`
    crossToken: function (req, res) {
      var app = req.app;
      var ctoken = req.params[0],
          cats = Store.get('cats'),
          data = { invitation_token: ctoken },
          token;

      if (cats && (token = cats[ctoken])) {
        data.cross_access_token = token;
      }

      showCross(req, res, data, cats, ctoken, token);

      app.currPageName = 'CROSS';
    },


    // `live`
    live: function (req) {
      var app = req.app, controllers = app.controllers,
          liveCont = controllers.live;

      if (liveCont) {
        liveCont.destory();
      }

      liveCont = app.controllers.live = new LiveController({
        options: {
          template: $('#live-tmpl').html()
        }
      });

      liveCont.emit('show', app.screen, app.ios);

      app.currPageName = 'LIVE' ;
    }

  };

});

define(function (require) {
  'use strict';

  var $ = require('zepto'),
      TWEEN = require('tween'),

      // animation {{{
      AF = require('af'),
      requestAnimationFrame = AF.request,
      // animation }}}

      middleware = require('mobilemiddleware'),
      FooterController = require('mobilecontroller').FooterController,
      routes = require('mobileroutes');

  /**- Helpers -**/
  var now = Date.now || function () { return new Date().getTime(); },

      lastBreathe = now(),

      launchApp = function (args) {
        App.set('tryRedirectAt', now());
        window.location = 'exfe://crosses/' + (args || '');
      };

  var lightsaber = require('lightsaber');

  // Create App   ***********************************
  var app = lightsaber();
  app.use(middleware.setHtmlHeight);
  //app.use(middleware.checkSMSToken);
  app.use(middleware.cleanup);
  app.initRouter();
  app.use(middleware.errorHandler);

  app.controllers = {};

  // @todo: 优化这种引用 或者 改掉
  app.controllers.footer = new FooterController({ App: app });

  // `index`
  // index - `/#?`
  // /^\/+#?\/?$/i
  app.get(/^\/+(?:\?)?#{0,}$/, routes.index);

  // `live`
  app.get(/^\/+(?:\?)?#live\/?$/, routes.live);

  // `verify`
  // sms token
  // ?t=2345
  app.get(/^\?t=([a-zA-Z0-9]{3,})$/, function (req, res) {
    var getSMSTokenFromHead = function () {
      var header = document.getElementsByTagName('head')[0],
          meta = document.getElementsByName('sms-token')[0],
          smsToken = null;

      if (meta) {
        smsToken = JSON.parse(meta.content);
        header.removeChild(meta);
      }

      return smsToken;
    };
    var smsToken = getSMSTokenFromHead();

    if (smsToken) {
      var action = smsToken.action;
      req.resolveToken = smsToken;
      if ('VERIFIED' === action) {

        res.redirect('/#verify');

      } else if ('INPUT_NEW_PASSWORD' === action) {

        res.redirect('/#set_password');

      }
    } else {
      req.error = { code: 404 };
      req.redirect('/');
    }
  });
  app.get(/^\/+(?:\?)?#verify\/?$/, routes.verify);

  // `set-password`
  app.get(/^\/+(?:\?)?#set_password\/?$/, routes.setPassword);

  // resolve-token - `/#token=5c9a628f2b4f863435bc8d599a857c21`
  app.get(/^\/+(?:\?)?#token=([a-zA-Z0-9]{64})\/?$/, routes.resolveToken);

  // `cross`
  // phone-cross-token - `/#!233/8964`
  app.get(/^\/+(?:\?)?#!([1-9][0-9]*)\/([a-zA-Z0-9]{4})\/?$/, routes.crossPhoneToken);
  // cross-token - `/#!token=63435bc8d599a857c215c9a628f2b4f8`
  app.get(/^\/+(?:\?)?#!token=([a-zA-Z0-9]{32})\/?$/, routes.crossToken);

  // redirect time
  app.set('tryRedirectAt', 0);

  app.on('launched', function () {
    var self = this;
    // During tests on 3g/3gs this timeout fires immediately if less than 500ms.
    var tryTimer = setInterval(function () {
      var n = now(), tryRedirectAt = self.set('tryRedirectAt');
      if (tryRedirectAt) {
        if (n - lastBreathe > 1500 && Math.abs(tryRedirectAt - lastBreathe) < 1500) {
          clearInterval(tryTimer);
          $('.get-button button').html('Open <span class="exfe">EXFE</span> app').removeClass('hide');
          $('#app-footer')
            .off('click.footer', '.get-button button')
            .on('click.footer', '.get-button button', function () {
              launchApp();
            });
        // To avoid failing on return to MobileSafari, ensure freshness!
        } else if (n - tryRedirectAt < 2000) {
          $('.get-button').removeClass('hide');
          $('.redirecting').addClass('hide');
        }
      }
      lastBreathe = n;
    }, 500);

    app.set('tryTimer', tryTimer);

    function animate() {
      requestAnimationFrame(animate);
      TWEEN.update();
    }
    animate();
  });

  // app running
  app.run();

  //window.pageshow = function () {};

  // global
  window.App = app;

});
