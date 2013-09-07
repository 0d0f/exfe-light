(function () {
  'use strict';

  var Debugger;
  if (!window.Debugger) { Debugger = window.Debugger = window.console || {}; }

  Debugger._style = '[debug]{display:block!important;}';

  // defaults to debug-off
  window.DEBUG = Debugger.STATUS = false;

  Debugger.MODE = 0;

  Debugger._init = function () {
    if (this._check()) {
      this._on();
    }
  };

  Debugger._check = function () {
    return (/debug=true/i).test(location.search);
  };

  Debugger._on = function () {
    var d = document.createElement('style');
    d.id = '*debugger*';
    d.textContent = this.style;
    document.getElementsByTagName('head')[0].appendChild(d);
    window.DEBUG = this.STATUS = true;
  };

  Debugger._off = function () {
    var d = document.getElementById('*debugger*');
    document.getElementsByTagName('head')[0].removeChild(d);
    window.DEBUG = this.STATUS = false;
  };

  Debugger.alert = function () { window.alert(arguments.toString()); };

  Debugger._init();
})();