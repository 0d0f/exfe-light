define('routexstream', function (require) {
    'use strict';

    // http://stackoverflow.com/questions/1112413/cross-browser-implementation-of-http-streaming-push-ajax-pattern

    var _ENV_ = window._ENV_
      , api_url = _ENV_.apiv3_url

    var cross_id = 0;

    var token    = '';

    var secInt   = 10;

    var secCnt   = secInt;

    var echo     = null;

    var unat_cbf = null;

    var bolDebug = !true;
    //                          lat, lng, acc
    var myData   = { t: 0, gps: [0, 0, 0] };

    var lstLocat = '';

    var lstRoute = '';

    var submit_request       = null;

    var shake_start_callback = null;

    var shake_end_callback   = null;

    var intGeoWatch          = null;

    var updateGPS = null;

    var reStart = null;

    var START_TIME, FIRST_TIME, FIRST_CONNECT;

    var submitGps = function () {
        secCnt = 0;
        if (!token) {
            log('No token!');
            return;
        }
        log('Breathe with token: ' + token);
        if (submit_request) {
            submit_request.abort();
        }
        myData.t = Math.round(Date.now() / 1000);
        submit_request = $.ajax({
            type    : 'POST',
            url     : api_url + '/routex/breadcrumbs?coordinate=earth&token=' + token,
            data    : JSON.stringify([myData]),
            success : function (data) {
              if (data) {
                localStorage.setItem('offset-latlng', JSON.stringify(data));
                if (updateGPS) {
                  updateGPS(data);
                }
              }
            },
            error   : function (data) {
                var status = data.status;
                if (status && status >= 400 && status <= 499) {
                    log('Unauthorized.');
                    if (unat_cbf) {
                        stream.kill();
                        unat_cbf();
                    }
                } else {
                    secCnt = secInt - 5;
                    log('Network error');
                }
            }
        });
    }


    var log = function(data, table) {
        if (bolDebug) {
            var type = Object.prototype.toString.call(data);
            var time = new Date().toString();
            if (type !== '[object String]' && type !== '[object Number]') {
                data = JSON.stringify(data);
            }
            Debugger.log(time.replace(/^.*(\d{2}:\d{2}:\d{2}).*$/, '$1') + ' - ' + data);
            if (table && Debugger.table) {
                Debugger.table(table);
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
            reStart();
            Debugger.log(url);
            this.prvLen = 0;
            this.nxtIdx = 0;
            this.live   = true;
            this.pop    = pop;
            this.dead   = dead;
            var http = this.http = new XMLHttpRequest();
            http.open('post', url);
            http.onreadystatechange = this.listen;
            http.onerror = this.onError;
            START_TIME = Date.now();
            FIRST_CONNECT = false;
            http.send();
            this.timer  = setInterval(this.listen, 1000);
        },
        listen : function() {
            if (!FIRST_CONNECT) {
                FIRST_TIME = Date.now();
                FIRST_CONNECT = true;
                // Debugger.alert('Streaming 开始有会包 ' + (FIRST_TIME - START_TIME) + 'ms');
            }
            var http = stream.http;
            if ((http.readyState   !== 4 && http.readyState !== 3)
             || (http.readyState   === 3 && http.status     !== 200)
             ||  http.responseText === null) { // In konqueror http.responseText is sometimes null here...
              return;
            }
            if (http.readyState   === 4 && http.status     !== 200) {
              stream.kill();
            }
            while (stream.prvLen !== http.responseText.length) {
                if (http.readyState === 4  && stream.prvLen === http.responseText.length) {
                    break;
                }
                stream.prvLen  = http.responseText.length;
                var rawResp    = http.responseText.substring(stream.nxtIdx);
                var lneResp    = rawResp.split('\n');
                stream.nxtIdx += rawResp.lastIndexOf('\n') + 1;
                if (rawResp[rawResp.length - 1] !== '\n' || !lneResp[lneResp.length]) {
                    lneResp.pop();
                }
                if (stream.pop) {
                  if (lneResp && lneResp.length) {
                    var line;
                    while ((line = lneResp.shift()) && line.length) {
                      stream.pop(line);
                    }
                  }
                }
            }
            if (http.readyState === 4 && stream.prvLen === http.responseText.length) {
                stream.kill();
            }
        },
        onError: function () { stream.live = false; },
        kill   : function () {
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


    var streamDead = function () {
        log('Streaming is dead');
    };


    var breatheFunc  = function () {
        if (checkGps(myData)) {
            if (++secCnt >= secInt) {
                submitGps();
            }
        }
        if (!stream.live && token) {
            stream.init(
                api_url + '/routex/crosses/' + cross_id + '?_method=WATCH&coordinate=mars&token=' + token + '&force_window_open',
                streamCallback, streamDead
            );
            log('Streaming with token: ' + token);
        }
    };


    var checkGps = function (data) {
      return data && data.t && data.gps && data.gps[0] && data.gps[1] && data.gps[2];
    };


    var stopGeo = function () {
       geoService.stopWatch(intGeoWatch);
    };

    var getGeo = function (done, fail) {
      geoService.get(
          function (result) {
            myData.t = result.timestamp;
            myData.gps[0] = result.latitude;
            myData.gps[1] = result.longitude;
            myData.gps[2] = result.accuracy;
            done && done(result);
            log(
                'Location update: '
              + 'time = ' + myData.t + ', '
              + 'lat  = ' + myData.gps[0]  + ', '
              + 'lng  = ' + myData.gps[1] + ', '
              + 'acu  = ' + myData.gps[2]
            );
          }
        , function (result) {
            fail && fail(result);
          }
      );
    };

    var startGeo = function (done, fail) {
      intGeoWatch = geoService.watch(
          function (result) {
            myData.t = result.timestamp;
            myData.gps[0] = result.latitude;
            myData.gps[1] = result.longitude;
            myData.gps[2] = result.accuracy;
            done && done(result);
            log(
                'Location update: '
              + 'time = ' + myData.t + ', '
              + 'lat  = ' + myData.gps[0]  + ', '
              + 'lng  = ' + myData.gps[1] + ', '
              + 'acu  = ' + myData.gps[2]
            );
          }
        , function (result) {
            fail && fail(result);
          }
      );
    };

    /**
     * Geo Service.
     */

    var geoService = {

      options: {
          enableHighAccuracy: true
        , maximumAge: 0
        //, timeout: 29999.999999 //30000
        , timeout: 59999.999999 // 60 * 1000
      }

    , cachedOptions: {
          enableHighAccuracy: false
        , maximumAge: 60000 * 60 * 2 // 2 hours or Infinity
        , timeout: 1000 * 60 // 29999.999999 //30000
      }

    , STATUS: 0

    , freshness_threshold: 4999.999999 //5000
    , accuracy_threshold: 500

    , _success: function (done) {
        var self = this
          , freshness_threshold = this.freshness_threshold
          , accuracy_threshold = this.accuracy_threshold
          , prev = Date.now();
        // position
        return function d(p) {
          var coords = p.coords
            , result = coords
            , curr = Date.now()
            , status = false;

          if (self.STATUS === 0) {
            status = true;
          }

          if (curr - prev > freshness_threshold) {
            status = true;
          }

          if (status) {
            prev = curr + freshness_threshold;
            result.status = 'success';
            result.timestamp = Math.round(p.timestamp / 1000);
            result.accuracy = parseInt(coords.accuracy || accuracy_threshold);
            done && done(result);
            if (self.STATUS === 0) { self.STATUS = 1; }
            d = null;
          }
        };
      }

    , _error: function (fail) {
        // error
        return function f(e) {
          var result = {
              status: 'fail'
            , code: e.code
            , message: e.message
          };
          fail && fail(result);
          f = null;
        };
      }

      /**
       * Get Current Position.
       */

    , get: function (done, fail, options) {
        options = options || this.options;
        navigator.geolocation.getCurrentPosition(this._success(done), this._error(fail), options);
      }


      /**
       * Track Position.
       */

    , watch: function (done, fail/*, options*/) {
        return navigator.geolocation.watchPosition(this._success(done), this._error(fail), this.STATUS ? this.options : this.cachedOptions);
      }

      /**
       * Stop track position.
       */

    , stopWatch: function (wid) {
        wid && navigator.geolocation.clearWatch(wid);
      }
    };

    var streamCallback = function (rawData) {
        var data = JSON.parse(rawData);
        if (data && data.type) {
            log('Streaming pops: ' + data.type)
            // if (data.type === 'command' && data.action === 'init_end') {
            //     Debugger.alert('Streaming 收到 init_end ' + (Date.now() - START_TIME) + 'ms', '开始有会包到 init_end ' + (Date.now() - FIRST_TIME) + 'ms');
            // }
            echo(data)
        }
    };


    var clone = function (variable) {
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


    var routexStream = {
        init : function(intCrossId, strToken, callback, unauthorized_callback, update, reset) {
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

            updateGPS = update;
            reStart   = reset;
        },
        shake : function(start_callback, end_callback) {
            shake_start_callback = start_callback;
            shake_end_callback   = end_callback;
        },
        stop: function () {
          stream.kill();
        },
        getGeo: getGeo,
        startGeo: startGeo,
        stopGeo: stopGeo,
        geoService: geoService
    };

    var breatheTimer = setInterval(breatheFunc, 1000);

    var inthndShake  = rawShake(shake_start_callback, shake_end_callback);

    window.addEventListener('load', function () {
      setTimeout(function() {
        window.scrollTo(0, 0);
      }, 0);
    });

    return routexStream;
});
