define(function (require, exports, module) {

    require('zepto');

    var config = require('config');

    var Store  = require('store');

    var home = function() {
        // default home page
    };

    var showAppInStore = function() {
        window.location = 'itms://itunes.apple.com/us/app/facebook/id514026604';
    };

    var launchApp = function(args) {
        window.location = 'exfe://crosses/' + args;
    };

    var tryLaunchApp = function(args) {
        launchApp(args);
        var tridAt = +new Date;
        // During tests on 3g/3gs this timeout fires immediately if less than 500ms.
        setTimeout(function() {
            // To avoid failing on return to MobileSafari, ensure freshness!
            if (+new Date - tridAt < 2000) {
                showAppInStore();
            }
        }, 500);
    };

    var cross = function(token) {
        $('#app-main').html(
            '<div>'
          +     '<div id="cross_title"></div>'
          +     '<div id="cross_desc"></div>'
          + '<div>'
        );
        $.ajax({
            type    : 'post',
            url     : config.api_url + '/Crosses/GetCrossByInvitationToken',
            data    : {invitation_token : token},
            success : function(data) {
                if (data && (data = JSON.parse(data)) && data.meta.code === 200) {
                    $('#cross_title').html(data.response.cross.title);
                    $('#cross_desc').html(data.response.cross.description);
                    var args  = '?read_only='        + data.response.read_only
                              + '&action='           + data.response.action
                              + '&invitation_token=' + token;
                    if (typeof data.response.cross_access_token !== 'undefined') {
                        args += '&cross_access_token=' + data.response.cross_access_token;
                        var cats = Store.get('cats');
                        if (!cats) {
                            cats = {};
                        }
                        cats[token] = data.response.cross_access_token;
                        Store.set('cats', cats);
                    }
                    if (typeof data.authorization !== 'undefined') {
                        args += '&token' + data.response.authorization.token;
                        Store.set('authorization', data.response.authorization);
                    }
                    tryLaunchApp(args);
                    return;
                }
                // 处理失败
            },
            error   : function() {
                // token 无效
                console.log(data);
            }
        });
    };

    var inputPassword = function(token) {
        $('#app-main').html(
            '<div>'
          +     'Password: <input type="text" id="password">'
          +     '<button id="submit">Submit</button>'
          + '<div>'
        );
        $('#submit').click(function() {
            var password = $('#password').val();
            if (password.length >= 4) {
                $.ajax({
                    type    : 'post',
                    url     : config.api_url + '/Users/ResetPassword',
                    data    : {token : token, password : password},
                    success : function(data) {
                        if (data && (data = JSON.parse(data)) && data.meta.code === 200) {
                            if (data.response.authorization) {
                                console.log(data.response.authorization);
                                alert('Done');
                                return;
                            }
                        }
                        // 处理失败
                    },
                    error   : function() {
                        // token 无效
                    }
                });
            } else {
                alert('Password must be longer than four!');
            }
        });
    };

    var resolvetoken = function(token) {
        $.ajax({
            type    : 'post',
            url     : config.api_url + '/Users/ResolveToken',
            data    : {token : token},
            success : function(data) {
                if (data && (data = JSON.parse(data)) && data.meta.code === 200) {
                    switch (data.response.token_type) {
                        case 'VERIFY':
                            //
                            break;
                        case 'SET_PASSWORD':
                            //
                    }
                    switch (data.response.action) {
                        case 'VERIFIED':
                            //
                            break;
                        case 'INPUT_NEW_PASSWORD':
                            inputPassword(token);
                    }
                }
            },
            error   : function() {
                // token 无效
            }
        });
    };

    var hash = document.location.hash.replace(/^#/, '');
    if (!hash) {
        home();
    }
    hash = hash.split('/');
    for (var i = 0; i < hash.length; i++) {
        if (hash[i].match(/\/token=.*/)) {
            resolvetoken(hash[i].replace(/\/token=(.*)/, '$1', hash[i]));
        } else if (hash[i].match(/\!token=.*/)) {
            cross(hash[i].replace(/\!token=(.*)/, '$1', hash[i]));
        } else {
            // 404
        }
    }

    window.DoFullScreen = function ()  {

    var isInFullScreen = (document.fullScreenElement && document.fullScreenElement !==     null) ||    // alternative standard method
            (document.mozFullScreen || document.webkitIsFullScreen);

    var docElm = document.documentElement;
    if (!isInFullScreen) {

        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        }
        else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
            alert("Mozilla entering fullscreen!");
        }
        else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
            alert("Webkit entering fullscreen!");
        }
    }
}

});
