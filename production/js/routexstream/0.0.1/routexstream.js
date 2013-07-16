define('routexstream', function (require) {
    'use strict';

    var _ENV_ = window._ENV_
      , streaming_api_url = _ENV_.streaming_api_url
      , api_url = _ENV_.api_url
      , geolocation = navigator.geolocation;

    var cross_id = 0;

    var token    = '';

    var secInt   = 10;

    var secCnt   = secInt;

    var echo     = null;

    var unat_cbf = null;

    var bolDebug = true;

    var myData   = { timestamp: 0, latitude : '', longitude : '', accuracy : '' };

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
            url     : streaming_api_url + '/v3/crosses/' + cross_id + '/routex/breadcrumbs?token=' + token,
            data    : JSON.stringify(myData),
            success : function() {},
            error   : function(data) {
                var status = data.status;
                if (status && status >= 400 && status <= 499) {
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
                streaming_api_url + '/v3/crosses/' + cross_id + '/routex?_method=WATCH&token=' + token,
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
            var http = this.http = new XMLHttpRequest();
            http.open('post', url, true);
            http.onreadystatechange = this.listen;
            http.send();
            this.timer  = setInterval(this.listen, 1000);
            console.log(url);
        },
        listen : function() {
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
                    stream.pop(lneResp);
                }
            }
            if (http.readyState === 4 && stream.prvLen === http.responseText.length) {
                stream.kill();
            }
        },
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
    };


    var checkGps = function (data) {
      return data.timestamp && data.latitude && data.longitude && data.accuracy;
    };


    var stopGeo = function () {
       geoService.stopWatch(intGeoWatch);
    };


    var startGeo = function (cb) {
      intGeoWatch = geoService.watch(function (result) {
          myData.timestamp = result.timestamp;
          myData.latitude  = result.latitude + '';
          myData.longitude = result.longitude + '';
          myData.accuracy  = result.accuracy + '';
          cb && cb(result);
          log(
              'Location update: '
            + 'time = ' + myData.timestamp + ', '
            + 'lat  = ' + myData.latitude  + ', '
            + 'lng  = ' + myData.longitude + ', '
            + 'acu  = ' + myData.accuracy
          );
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
      // , timeout: 30000
      , timeout: 3000
      }

    , freshness_threshold: 233
    , accuracy_threshold: 500

    , _success: function (done) {
        var freshness_threshold = this.freshness_threshold
          , accuracy_threshold = this.accuracy_threshold;
        // position
        return function d(p) {
          var coords = p.coords
            , result = coords
            , now = (new Date()).getTime()
            , timestamp = p.timestamp;

          if (now - timestamp > freshness_threshold) {
            result.status = 'success';
            result.timestamp = Math.round(timestamp / 1000);
            result.accuracy = parseInt(coords.accuracy || accuracy_threshold);
            done && done(result);
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
        };
      }

      /**
       * Get Current Position.
       */

    , get: function (done, fail, options) {
        options = options || this.options;
        geolocation.getCurrentPosition(this._success(done), this._error(fail), options);
      }


      /**
       * Track Position.
       */

    , watch: function (done, fail/*, options*/) {
        return geolocation.watchPosition(this._success(done), this._error(fail), this.options);
      }

      /**
       * Stop track position.
       */

    , stopWatch: function (wid) {
        geolocation.clearWatch(wid);
      }
    };

    var geomarks =  {
            "id": 0,
            "created_by": "cfd@exfe.com@email",
            "type": "route",
            "color": "#ff0000",
            "positions": [
                {
                    "latitude": 31.21734480179986,
                    "longitude": 121.5864718
                },
                {
                    "latitude": 31.21319463357469,
                    "longitude": 121.5972739
                },
                {
                    "latitude": 31.268121713163797,
                    "longitude": 121.5976561
                },
                {
                    "latitude": 31.247065104540905,
                    "longitude": 121.5970507
                },
                {
                    "latitude": 31.206737991954668,
                    "longitude": 121.5462089
                },
                {
                    "latitude": 31.248654045999515,
                    "longitude": 121.5291807
                },
                {
                    "latitude": 31.25565585251572,
                    "longitude": 121.5656451
                },
                {
                    "latitude": 31.268261173480656,
                    "longitude": 121.5331074
                },
                {
                    "latitude": 31.2327964098393,
                    "longitude": 121.5508703
                },
                {
                    "latitude": 31.250543878922706,
                    "longitude": 121.6255542
                }
            ]
        };

    var geomarks1 =  {
            "id": 1,
            "created_by": "0day.zh@gmail.com@email",
            "type": "route",
            "color": "#0000ff",
            "positions": [
                {
                    "latitude": 31.234197033286563,
                    "longitude": 121.5449758
                },
                {
                    "latitude": 31.255222305861768,
                    "longitude": 121.6002405
                },
                {
                    "latitude": 31.19713847061759,
                    "longitude": 121.5849201
                },
                {
                    "latitude": 31.248763796544168,
                    "longitude": 121.6172143
                },
                {
                    "latitude": 31.199140422578434,
                    "longitude": 121.5295201
                },
                {
                    "latitude": 31.23870660743816,
                    "longitude": 121.5498787
                },
                {
                    "latitude": 31.228642727640924,
                    "longitude": 121.5294021
                },
                {
                    "latitude": 31.23028873356199,
                    "longitude": 121.5390788
                },
                {
                    "latitude": 31.274770147210454,
                    "longitude": 121.6137738
                },
                {
                    "latitude": 31.180405477757102,
                    "longitude": 121.6165173
                }
            ]
        };

    var location0 = {
          "id": "0",
          "type": "location",
          "created_at": 0,
          "created_by": "",
          "updated_at": 0,
          "updated_by": "uid",
          "tags": [
            "destination",
            "park"
          ],
          "icon": "http://api.panda.0d0f.com/v3/icons/mapmark",
          "title": "2013 西藏单车旅游",
          "description": "求带、求包养、求……",
          "latitude": "31.180405477757102",
          "longitude": "121.6165173"
        };

    var location1 = {
          "id": "1",
          "type": "location",
          "created_at": 0,
          "created_by": "",
          "updated_at": 0,
          "updated_by": "uid",
          "tags": [
            "park",
            "destination"
          ],
          "icon": "http://api.panda.0d0f.com/v3/icons/mapmark",
          "title": "2013 台湾自由行",
          "description": "台北、高雄、新竹……",
          "latitude": 31.250543878922706,
          "longitude": 121.6255542
        };

    var streamCallback = function (rawData) {
        if (rawData && rawData.length) {
            var data = JSON.parse(rawData[rawData.length - 1]);
            if (data && data.type && data.data) {
                var type   = data.type.replace(/^.*\/([^\/]*)$/, '$1');
                var result = data.data;
                // test
                type = 'geomarks';
                result = [geomarks, geomarks1, location0, location1][Math.floor((Math.random() * 4))];

                switch (type) {
                    case 'breadcrumbs':
                        var curLocat = JSON.stringify(result);
                        log('Streaming pops: ' + curLocat, result);
                        if (echo && lstLocat !== curLocat) {
                            log('Callback')
                            echo(type, result);
                            lstLocat = curLocat;
                        }
                        break;
                    case 'geomarks':
                        var curRoute = JSON.stringify(result);
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