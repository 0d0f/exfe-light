define('routex', function (require) {
    "use strict";

    var _ENV_ = window._ENV_,
        streaming_api_url = 'http://api.panda.0d0f.com',
        api_url = 'http://api.panda.0d0f.com';

    var cross_id = 0;

    var token    = '';

    var secInt   = 10;

    var secCnt   = secInt;

    var echo     = null;

    var unat_cbf = null;

    var bolDebug = true;

    var myData   = {timestamp: 0, latitude : '', longitude : '', accuracy : ''};

    var lstLocat = '';

    var lstRoute = '';

    var streaming_api_url    = streaming_api_url;

    var submit_request       = null;

    var shake_start_callback = null;

    var shake_end_callback   = null;

    var intGeoWatch          = null;


    var submitGps = function() {
        secCnt = 0;
        if (!token) {
            log('No token!');
            return;
        }
        log('Breathe with token: ' + token);
        if (submit_request) {
            submit_request.abort();
        }
        submit_request = $.ajax({
            type    : 'post',
            url     : streaming_api_url + '/v3/routex/cross/' + cross_id + '/location?token=' + token,
            data    : JSON.stringify(myData),
            success : function() {},
            error   : function(data) {
                if (data.status
                 && data.status >= 400
                 && data.status <= 499) {
                    log('Unauthorized.');
                    if (unat_cbf) {
                        token = '';
                        stream.kill();
                        unat_cbf();
                    }
                } else {
                    secCnt = secInt - 5;
                    log('Network error');
                }
            }
        });
        if (!stream.live && token) {
            stream.init(
                streaming_api_url + '/v3/routex/cross/' + cross_id + '?_method=WATCH&token=' + token,
                streamCallback, streamDead
            );
            log('Streaming with token: ' + token);
        }
    }


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
            console.log( url);
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
            if (stream.http.readyState === 4 && stream.prvLen === stream.http.responseText.length) {
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


    var streamDead = function() {
        log('Streaming is dead');
    };


    var breatheFunc  = function() {
        if (checkGps(myData)) {
            if (++secCnt >= secInt) {
                submitGps();
            }
        }
    };


    var checkGps = function(data) {
        return data.timestamp && data.latitude && data.longitude && data.accuracy;
    };


    var stopGeo = function() {
        navigator.geolocation.clearWatch(intGeoWatch);
    }


    var startGeo = function() {
        intGeoWatch  = navigator.geolocation.watchPosition(function(data) {
            if (data
             && data.coords
             && data.coords.latitude
             && data.coords.longitude
             && data.coords.accuracy) {
                myData.timestamp = Math.round(+new Date() / 1000);
                myData.latitude  = data.coords.latitude.toString();
                myData.longitude = data.coords.longitude.toString();
                myData.accuracy  = data.coords.accuracy.toString();
                // secCnt        = secInt - 5;
                log(
                    'Location update: '
                  + 'time = ' + myData.timestamp + ', '
                  + 'lat  = ' + myData.latitude  + ', '
                  + 'lng  = ' + myData.longitude + ', '
                  + 'acu  = ' + myData.accuracy
                );
            }
        });
    }


    var streamCallback = function(rawData) {
        if (rawData && rawData.length) {
            var data = JSON.parse(rawData[rawData.length - 1]);
            if (data && data.name && data.data) {
                var type   = data.name.replace(/^.*\/([^\/]*)$/, '$1');
                var result = data.data;
                switch (type) {
                    case 'location':
                        var curLocat = JSON.stringify(result)
                        log('Streaming pops: ' + curLocat, result);
                        if (echo && lstLocat !== curLocat) {
                            log('Callback')
                            echo(type, result);
                            lstLocat = curLocat;
                        }
                        break;
                    case 'route':
                        var curRoute = JSON.stringify(result)
                        log('Streaming pops: ' + curRoute, result);
                        if (echo && lstRoute !== curRoute) {
                            log('Callback')
                            echo(type, result);
                            lstRoute = curRoute;
                        }
                }
            }
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


    var routex = {
        init : function(intCrossId, strToken, callback, unauthorized_callback) {
            if (!intCrossId) {
                log('Error cross id!');
                return;
            }
            if (!strToken) {
                log('Error token!');
                return;
            }
            if (!callback) {
                log('Error callback!');
                return;
            }
            if (!unauthorized_callback) {
                log('Error unauthorized callback!');
                return;
            }
            cross_id = intCrossId
            log('Set cross_id: ' + intCrossId);
            token    = strToken;
            log('Set token: '    + strToken);
            echo     = callback;
            log('Set callback function');
            unat_cbf = unauthorized_callback;
            log('Set unauthorized callback function');
            secCnt   = secInt;
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

    window.addEventListener('load', function() {
        setTimeout(function() {
            window.scrollTo(0, 0);
        }, 0);
    });

    return routex;
});



// demo
define(function (require) {
    'use strict';
    var routex = require('routex');
    routex.init(
        100699,
        '87bd2cce71a2503b52d8fe03e4949919ed1356aaeb2f3201b386d8954b491802',
        function(type, data) {
            console.log('收到数据类型: ' + type);
            console.log('数据: ');
            console.log(data);
        },
        function() {
            console.log('我被踢出来了！');
        }
    );
    routex.startGeo();
});
