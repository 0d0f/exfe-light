define('live', function (require) {
    "use strict";

    var Config = require('config');

    var Store  = require('store');

    var token  = '';

    var secInt = 30;

    var secCnt = secInt;

    var bolDebug = !false;

    var echo     = null;

    var lstEcho  = '';

    var myData   = {
        card      : {
            id         : '',
            name       : '',
            avatar     : '',
            bio        : '',
            identities : [],
        },
        latitude  : '',
        longitude : '',
        accuracy  : '',
        traits    : []
    };

    var streaming_api_url = Config.streaming_api_url;

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
                        } else {
                            if (!rawCards[i].avatar) {
                                rawCards[i].avatar = encodeURI(
                                    Config.api_url + '/avatar/default?name=' + rawCards[i].name
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
            // temporary @leaskh with @googollee
            secCnt      = secInt - 3;
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
        }
    };


    var breatheTimer = setInterval(breatheFunc, 1000);


    var inthndShake  = rawShake(shake_start_callback, shake_end_callback);


    var intGeoWatch  = navigator.geolocation.watchPosition(function(data) {
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


    window.addEventListener('load', function() {
        setTimeout(function() {
            window.scrollTo(0, 0);
        }, 0);
    });


    return live;
});
