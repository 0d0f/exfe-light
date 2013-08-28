(function () {
  'use strict';

  var Debugger;
  if (!window.Debugger) { Debugger = window.Debugger = {}; }

  Debugger.style = '[debug]{display:block!important;}';

  // defaults to debug-off
  Debugger.status = false;

  Debugger.init = function () {
    if (this.check()) {
      this.on();
    }
  };

  Debugger.check = function () {
    return (/debug=true/i).test(location.search);
  };

  Debugger.on = function () {
    var d = document.createElement('style');
    d.id = '*debugger*';
    d.textContent = this.style;
    document.getElementsByTagName('head')[0].appendChild(d);
    this.status = true;
  };

  Debugger.off = function () {
    var d = document.getElementById('*debugger*');
    document.getElementsByTagName('head')[0].removeChild(d);
    this.status = false;
  };

  Debugger.init();
})();
