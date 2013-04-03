define(function (require, exports, module) {

    require('zepto');

    var Config = require('config');

    var Store  = require('store');

    var token  = '';

    window.addEventListener('load', function() {
        setTimeout(function() {
            window.scrollTo(0, 0);
        }, 0);
    });

    var breatheFunc  = function() {
        console.log('leask');
    };

    var breatheTimer = setInterval(breatheFunc, 1000);

});
