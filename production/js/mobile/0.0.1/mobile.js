define(function (require, exports, module) {

    require('zepto');

    var config = require('config');

    var Store  = require('store');

    var setBtnPos = function(banner) {
        var height = window.innerHeight;
        if (height > 460) {
            height = 460;
        } else if (height < 350) {
            height = 350;
        }
        $('html').css('min-height', height + 'px');
        $('.dialog-box').css('min-height', window.innerHeight - (banner ? 50 : 0) + 'px');
        $('.actions').css('top', (height - 86 - (banner ? 50 : 0)) + 'px');
        $('.big-x').css('height', (height - 86 - (banner ? 50 : 0)) + 'px');
        // $('#app-main').css('background-image', '-webkit-gradient(linear, 0 0, 0 100%, from(#88A9CB), to(#1C2732))');
    };

    var home = function() {
        $('#app-main').html(
            '<div class="dialog-box">'
          +     '<div class="big-x">'
          +         '<div class="img"><img width="182" height="182" src="/static/img/exfe.png"/></div>'
          +     '</div>'
          +     '<div class="actions">'
          +         '<div class="get-button">'
          +             '<button>Get <span class="exfe">EXFE</span> App <span class="free">free</span></button>'
          +             '<div class="redirecting">Redirecting to EXFE app in <span class="sec">5</span>s.</div>'
          +         '</div>'
          +         '<div class="web-version"><span class="underline">Proceed</span> with desktop web version.</div>'
          +     '</div>'
          + '</div>'
        );
        setBtnPos();
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
            '<div class="top-banner">'
          +     '<div class="center">'
          +         '<div class="welcome">Welcome to <span class="exfe">EXFE</span></div>'
          +         '<div class="exfe-logo">'
          +             '<img src="/static/img/exfe.png" width="30" height="30" />'
          +         '</div>'
          +     '</div>'
          + '</div>'
          + '<div class="dialog-box">'
          +     '<div class="base-info"><span class="by">dm.</span> sends you an invitation, engage in easily with <span class="exfe">EXFE</span> app.</div>'
          +     '<div class="cross">'
          +         '<div class="title">Team dinner with Bay Area friends in San Francisco</div>'
          +         '<div class="time">6:30PM Fri, Apr 8</div>'
          +         '<div class="place">Crab House @ Pier 39</div>'
          +     '</div>'
          +     '<div class="actions">'
          +         '<div class="get-button">'
          +             '<button>Get <span class="exfe">EXFE</span> App <span class="free">free</span></button>'
          +             '<div class="redirecting">Redirecting to EXFE app in <span class="sec">5</span>s.</div>'
          +         '</div>'
          +         '<div class="web-version"><span class="underline">Proceed</span> with desktop web version.</div>'
          +     '</div>'
          + '</div>'
        );
        setBtnPos(true);
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
            '<div class="top-banner">'
          +     '<div class="center">'
          +         '<div class="welcome">Welcome to <span class="exfe">EXFE</span></div>'
          +         '<div class="exfe-logo">'
          +             '<img src="/static/img/exfe.png" width="30" height="30" />'
          +         '</div>'
          +     '</div>'
          + '</div>'
          + '<div class="dialog-box">'
          +     '<div class="verify-actions">'
          +         '<div class="identity">'
          +             '<img class="avatar" width="40" height="40" src="" />'
          +             '<span class="name">Steve Exfer</span>'
          +         '</div>'
          +         '<div>'
          +             '<input type="text" id="password" placeholder="Set EXFE Password" />'
          +         '<div>'
          +         '<div class="error-info">Failed to set password. Please try later.</div>'
          +         '<div class="done-info">'
          +             '<span class="status">Password set successfully.</span>'
          +             '<span class="redirect">Redirecting to app in <span class="sec">5</span>s.</span>'
          +         '</div>'
          +     '</div>'
          +     '<div class="actions">'
          +         '<div class="get-button">'
          +             '<button>Get <span class="exfe">EXFE</span> App <span class="free">free</span></button>'
          +             '<div class="redirecting">Redirecting to EXFE app in <span class="sec">5</span>s.</div>'
          +         '</div>'
          +         '<div class="web-version"><span class="underline">Proceed</span> with desktop web version.</div>'
          +     '</div>'
          + '<div>'
        );
        setBtnPos(true);
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

    var verification = function() {
        $('#app-main').html(
              '<div class="top-banner">'
          +     '<div class="center">'
          +         '<div class="welcome">Welcome to <span class="exfe">EXFE</span></div>'
          +         '<div class="exfe-logo">'
          +             '<img src="/static/img/exfe.png" width="30" height="30" />'
          +         '</div>'
          +     '</div>'
          + '</div>'
          + '<div class="dialog-box">'
          +     '<div class="verify-actions">'
          +         '<div class="identity">'
          +             '<img class="avatar" width="40" height="40" src="" />'
          +             '<img class="provider" width="18" height="18" src="" />'
          +             '<span class="name">Steve Exfer</span>'
          +         '</div>'
          +         '<div class="done-info">'
          +             '<span class="status">Verification succeeded.</span>'
          +             '<span class="status error">Sorry, this link is expired.</span>'
          +             '<span class="redirect">Redirecting to app in <span class="sec">5</span>s.</span>'
          +         '</div>'
          +     '</div>'
          +     '<div class="space"></div>'
          +     '<div class="actions">'
          +         '<div class="get-button">'
          +             '<button>Get <span class="exfe">EXFE</span> App <span class="free">free</span></button>'
          +             '<div class="redirecting">Redirecting to EXFE app in <span class="sec">5</span>s.</div>'
          +         '</div>'
          +         '<div class="web-version"><span class="underline">Proceed</span> with desktop web version.</div>'
          +     '</div>'
          + '<div>'
        );
        setBtnPos(true);
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
    if (hash) {
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
    } else {
        // home();
        cross();
        // console.log(window.size);
        // inputPassword();
        // verification();
    }

});
