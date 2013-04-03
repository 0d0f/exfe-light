define(function (require, exports, module) {

    require('zepto');

    var Config = require('config');

    var Store  = require('store');

    var token  = '';

    var streaming_api_url = Config.streaming_api_url;

    var secInt = 30;

    var secCnt = secInt;

    var myData = {
        'card'      : {

        },
        'latitude'  : '',
        'longitude' : '',
        'accuracy'  : '',
        'traits'    : []
    };

    var bolDebug = true;

    var submit_request = null;


    var log = function(data) {
        if (bolDebug) {
            var type = Object.prototype.toString.call(data);
            var time = new Date().toString();
            if (type !== '[object String]' && type !== '[object Number]') {
                data = JSON.stringify(data);
            }
            console.log(time.replace(/^.*(\d{2}:\d{2}:\d{2}).*$/, '$1') + ' - ' + data);
        }
    }


    var submitCard = function() {
        secCnt = 0;
        var subData = JSON.stringify(myData);
        log('Submitting with' + (token ? (' token(' + token + ')') : 'out token') + ': ' + subData);
        if (submit_request) {
            submit_request.abort();
        }
        submit_request = $.ajax({
            type    : 'post',
            url     : streaming_api_url + '/v3/live/cards' + (token ? ('?token=' + token) : ''),
            data    : subData,
            success : function(data) {
                var rawToken = JSON.parse(data);
                if (rawToken) {
                    secCnt = 0;
                    if (token !== rawToken) {
                        log('Got new token: ' + rawToken);
                        if (stream.live) {
                            stream.kill();
                            log('Close current stream.');
                        }
                        secCnt = secInt;
                    }
                    token = rawToken;
                }
            },
            error   : function(data) {
                if (token) {
                    log('Repeal token: ' + token);
                }
                token  = '';
                secCnt = secInt;
            }
        });
        if (!stream.live && token) {
            stream.init(
                streaming_api_url + '/v3/live/streaming?token=' + token,
                streamCallback, streamDead
            );
            log('Streaming with token(' + token + ')...');
        }  
    }


    var streamCallback = function(data) {
        if (data) {
            log('Streaming pops: ' + data[data.length - 1]);
        }
    };


    var streamDead = function() {
        log('Streaming is dead.');
    };


    var breatheFunc  = function() {
        if (++secCnt >= secInt) {
            submitCard();
        }
    };


    var stream = {
        prvLen : 0,
        nxtIdx : 0,
        http   : new XMLHttpRequest(),
        timer  : 0,
        pop    : null,
        dead   : null,
        live   : false,
        init   : function(url, pop, dead) {
            this.live  = true;
            this.pop   = pop;
            this.dead  = dead;
            this.http.open('get', url);
            this.http.onreadystatechange = this.listen;
            this.http.send();
            this.timer = setInterval(this.listen, 1000);
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


    window.addEventListener('load', function() {
        setTimeout(function() {
            window.scrollTo(0, 0);
        }, 0);
    });


    var breatheTimer = setInterval(breatheFunc, 1000);


});
