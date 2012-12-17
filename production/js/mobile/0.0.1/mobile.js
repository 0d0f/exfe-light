define(function (require, exports, module) {

    require('zepto');

    require('moment');

    var config = require('config');

    var Store  = require('store');

    var rdTime = null;

    var tridAt = 0;

    var lastBreathe = +new Date;

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
        if (navigator.userAgent.match(/iPad/)) {
            $('.redirecting').unbind('click').bind('click', function() {
                location.href = '/?ipad' + location.hash;
            });
            $('.web-version').unbind('click').bind('click', function() {
                location.href = '/?ipad' + location.hash;
            }).show();
        } else {
            $('.web-version').hide();
        }
        $('.get-button button').unbind('click').bind('click', showAppInStore);
    };

    var redirecting = function(args) {
        $('.redirecting').show();
        rdTime = setInterval(function() {
            var sec = ~~$('.redirecting .sec').html() - 1;
            if (sec >= 0) {
                $('.redirecting .sec').html(sec);
            } else {
                clearTimeout(rdTime);
                tryLaunchApp(args);
                $('.actions .error-info').hide();
            }
        }, 1000);
    };

    var home = function(showerror) {
        $('#app-main').html(
            '<div class="dialog-box">'
          +     '<div class="big-x">'
          +         '<div class="img"><img width="182" height="182" src="/static/img/exfe.png"/></div>'
          +     '</div>'
          +     '<div class="actions">'
          +         '<div class="error-info">You just opened an invalid link.</div>'
          +         '<div class="get-button">'
          +             '<button>Get <span class="exfe">EXFE</span> App <span class="free">free</span></button>'
          +             '<div class="redirecting">Redirecting to EXFE app in <span class="sec">5</span>s.</div>'
          +         '</div>'
          +         '<div class="web-version"><span class="underline">Proceed</span> with desktop web version.</div>'
          +     '</div>'
          + '</div>'
        );
        if (showerror) {
            $('.actions .error-info').show();
        } else {
            $('.actions .error-info').hide();
        }
        setBtnPos();
        redirecting();
    };

    var showAppInStore = function() {
        window.location = 'itms://itunes.apple.com/us/app/facebook/id514026604';
    };

    var launchApp = function(args) {
        window.location = 'exfe://crosses/' + (args ? args : '');
    };

    // During tests on 3g/3gs this timeout fires immediately if less than 500ms.
    var tryTimer = setInterval(function () {
        var now = +new Date;
        if (tridAt) {
            if (now - lastBreathe > 1500 && Math.abs(tridAt - lastBreathe) < 1500) {
                clearTimeout(tryTimer);
                $('.get-button button').html('Open <span class="exfe">EXFE</span> app');
                $('.get-button button').unbind('click').bind('click', launchApp);
            // To avoid failing on return to MobileSafari, ensure freshness!
            } else if (now - tridAt < 2000) {
                $('.get-button button').show();
                $('.redirecting').hide();
            }
        }
        lastBreathe = now;
    }, 500);

    var tryLaunchApp = function(args) {
        tridAt = +new Date;
        launchApp(args);
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
          +     '<div class="base-info"><span class="by"></span> sends you an invitation, engage in easily with <span class="exfe">EXFE</span> app.</div>'
          +     '<div class="cross">'
          +         '<div class="title"></div>'
          +         '<div class="time"></div>'
          +         '<div class="place"></div>'
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
        var cats = Store.get('cats');
        if (!cats) {
            cats = {};
        }
        var submitData = {};
        if (cats[token]) {
            submitData = {cross_access_token : cats[token]};
        } else {
            submitData = {invitation_token   : token};
        }
        $.ajax({
            type    : 'post',
            url     : config.api_url + '/Crosses/GetCrossByInvitationToken',
            data    : submitData,
            success : function(data) {
                if (data && (data = JSON.parse(data)) && data.meta.code === 200) {
                    $('.cross .title').html(data.response.cross.title);
                    $('.cross .time').html(renderCrossTime(data.response.cross.time));
                    $('.cross .place').html(data.response.cross.place.title);
                    var user_id = 0;
                    if (data.response.authorization) {
                        user_id = data.response.authorization.user_id;
                    } else if (data.response.browsing_identity.connected_user_id) {
                        user_id = data.response.browsing_identity.connected_user_id;
                    }
                    if (typeof data.response.cross_access_token !== 'undefined') {
                        cats[token] = data.response.cross_access_token;
                        Store.set('cats', cats);
                    }
                    for (var i in data.response.cross.exfee.invitations) {
                        if (user_id
                         && user_id === data.response.cross.exfee.invitations[i].identity.connected_user_id) {
                            $('.base-info .by').html(data.response.cross.exfee.invitations[i].by_identity.name).show();
                            break;
                        }
                        $('.base-info .by').hide();
                    }
                    if (typeof data.response.authorization !== 'undefined') {
                        Store.set('authorization', data.response.authorization);
                        var args = data.response.cross.id
                                 + '?user_id='     + user_id
                                 + '&token='       + data.response.authorization.token
                                 + '&identity_id=' + data.response.cross.exfee.invitations[i].identity.id;
                        redirecting(args);
                        return;
                    }
                }
                // 处理失败
                home(true);
            },
            error   : function() {
                // token 无效
                home(true);
            }
        });
    };

    var renderCrossTime = function(crossTime) {
        function trim(string) {
            return string ? string.replace(/^\s+|\s+$/g, '') : '';
        }
        function escape(html, encode) {
            return html
                  .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;')
                  .replace(/'/g, '&#39;');
        }
        function getTimezone() {
            // W3C : 'Fri Jul 06 2012 12:28:23 GMT+0800 (CST)'
            // IE  : 'Fri Jul 6 12:28:23 UTC+0800 2012'
            var rawTimeStr  = Date().toString(),
                numTimezone = rawTimeStr.replace(/^.+([+-]\d{2})(\d{2}).+$/i, '$1:$2'),
                strTimezone = rawTimeStr.replace(/^.*\(([a-z]*)\).*$/i, '$1');
                strTimezone = strTimezone === 'UTC' || strTimezone === 'GMT' ? '' : strTimezone;
            return numTimezone + (strTimezone === rawTimeStr ? '' : (' ' + strTimezone));
        }
        function getTimezoneOffset(timezone) {
            if ((timezone = trim(timezone))) {
                var arrTimezone = timezone.split(':');
                if (arrTimezone.length === 2) {
                    var intHour = parseInt(arrTimezone[0], 10) * 60 * 60,
                        intMin  = parseInt(arrTimezone[1], 10) * 60;
                    return intHour + (intHour > 0 ? intMin : -intMin);
                }
            }
            return null;
        }
        var efTime = require('eftime');
        var crossOffset = getTimezoneOffset(crossTime.begin_at.timezone),
            timeOffset  = getTimezoneOffset(getTimezone()),
            timevalid   = crossOffset === timeOffset && require('config').timevalid,
            strAbsTime  = '', strRelTime = '', format = 'YYYY-MM-DD',
            placeholder = '';
        if (crossTime.origin) {
            var bdate = crossTime.begin_at.date
              , btime = crossTime.begin_at.time
              , bzone = crossTime.begin_at.timezone;
            if (crossTime.outputformat) {
                strAbsTime = placeholder;
                strRelTime = escape(crossTime.origin);
          } else if (bdate && btime) {
            var now = new Date()
              , matches = bdate.match(/^\d\d\d\d/m);
            var objMon = moment((moment.utc(
                crossTime.begin_at.date + ' '
              + crossTime.begin_at.time, format + ' HH:mm:ss'
            ).unix()   + (timevalid ? 0 : (crossOffset - timeOffset))) * 1000);
            strAbsTime = objMon.format('h:mmA on ddd, MMM D' + (matches && matches[0] == now.getFullYear() ? '' : ' YYYY'))
                        + (timevalid ? '' : (' ' + crossTime.begin_at.timezone));;
            strRelTime = efTime.timeAgo(bdate + ' ' + btime + ' Z', undefined, 'X');
          } else if (bdate && !btime) {
            var now = new Date()
              , matches = bdate.match(/^\d\d\d\d/m);
            strAbsTime = moment(bdate).format('On ddd, MMM D' + (matches && matches[0] == now.getFullYear() ? '' : ' YYYY'))
                        + (timevalid ? '' : (' ' + Cross.time.begin_at.timezone));;
            now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            strRelTime = efTime.timeAgo(bdate + ' ' + bzone[0] + bzone[1] + bzone[2]  + bzone[4] + bzone[5], +now);
            if (strRelTime === 'Seconds ago') {
              strRelTime = 'Today';
            }
          } else if (!bdate && btime) {
            strAbsTime = '';
            strRelTime = btime;
          }
        } else {
            strAbsTime = placeholder;
            strRelTime = 'Sometime';
        }
        return strAbsTime ? strAbsTime : escape(crossTime.origin);
    };

    var inputPassword = function(result, token) {
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
          +             '<span class="name"></span>'
          +         '</div>'
          +         '<div>'
          +             '<input type="password" id="password" placeholder="Set EXFE Password" />'
          +             '<i class="eye icon16-pass-show"></i>'
          +             '<img width="18" height="18" class="loading" src="/static/img/loading.gif" />'
          +         '</div>'
          +         '<div class="error-info"></div>'
          +         '<div class="done-info">'
          +             '<span class="status">Password set successfully.</span>'
          +             '<span class="redirecting">Redirecting to app in <span class="sec">5</span>s.</span>'
          +         '</div>'
          +     '</div>'
          +     '<div class="actions">'
          +         '<div class="get-button">'
          +             '<button>Get <span class="exfe">EXFE</span> App <span class="free">free</span></button>'
          +         '</div>'
          +         '<div class="web-version"><span class="underline">Proceed</span> with desktop web version.</div>'
          +     '</div>'
          + '</div>'
        );
        setBtnPos(true);
        $('.eye').click(function(e){
          var $input = $(this).prev();
          $input.prop('type', function (i, val) {
            return val === 'password' ? 'text' : 'password';
          });
          $(this).toggleClass('icon16-pass-hide icon16-pass-show');
        });
        $.ajax({
            type    : 'post',
            url     : config.api_url + '/Users/' + result.user_id + '?token=' + result.token,
            data    : {token : result.token},
            success : function(data) {
                if (data && (data = JSON.parse(data)) && data.meta.code === 200) {
                    $('.identity .avatar').attr('src', data.response.user.avatar_filename);
                    $('.identity .name').html(data.response.user.name);
                    return;
                }
                // error getting user informations
                home(true);
            },
            error   : function() {
                // error getting user informations
                home(true);
            }
        });
        $('#password').bind('keydown', function(event) {
            if (event.which === 13) {
                $('.loading').show();
                $('.eye').hide();
                var password = $('#password').val();
                if (password.length >= 4) {
                    $.ajax({
                        type    : 'post',
                        url     : config.api_url + '/Users/ResetPassword',
                        data    : {token : token, password : password},
                        success : function(data) {
                            $('.loading').hide();
                            $('.eye').show();
                            if (data && (data = JSON.parse(data)) && data.meta.code === 200) {
                                if (data.response.authorization) {
                                    $('.done-info').show();
                                    redirecting('?user_id=' + data.response.authorization.user_id + '&token=' + data.response.authorization.token);
                                    return;
                                }
                            }
                            $('.error-info').html('Failed to set password. Please try later.').show();
                        },
                        error   : function() {
                            $('.loading').hide();
                            $('.eye').show();
                            $('.error-info').html('Failed to set password. Please try later.').show();
                        }
                    });
                } else {
                    $('.error-info').html('Password must be longer than four!').show();
                    $('.loading').hide();
                    $('.eye').show();
                }
            } else {
                $('.error-info').hide();
            }
        });
    };

    var verification = function(result) {
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
          +             '<span class="name"></span>'
          +         '</div>'
          +         '<div class="done-info">'
          +             '<span class="status">Verification succeeded.</span>'
          +             '<span class="redirecting">Redirecting to app in <span class="sec">5</span>s.</span>'
          +         '</div>'
          +     '</div>'
          +     '<div class="space"></div>'
          +     '<div class="actions">'
          +         '<div class="get-button">'
          +             '<button>Get <span class="exfe">EXFE</span> App <span class="free">free</span></button>'
          +         '</div>'
          +         '<div class="web-version"><span class="underline">Proceed</span> with desktop web version.</div>'
          +     '</div>'
          + '<div>'
        );
        setBtnPos(true);
        $.ajax({
            type    : 'post',
            url     : config.api_url + '/Users/' + result.user_id + '?token=' + result.token,
            data    : {token : result.token},
            success : function(data) {
                if (data && (data = JSON.parse(data)) && data.meta.code === 200) {
                    for (var i in data.response.user.identities) {
                        if (data.response.user.identities[i].id === result.identity_id) {
                            $('.identity .avatar').attr('src', data.response.user.identities[i].avatar_filename);
                            $('.identity .provider').attr('src', '/static/img/identity_' + data.response.user.identities[i].provider + '_18_grey@2x.png');
                            $('.identity .name').html(data.response.user.identities[i].external_username);
                            $('.done-info').show();
                            redirecting('?user_id=' + data.response.user.user_id + '&token=' + result.token);
                            return;
                        }
                    }
                }
                // error getting identity informations
                home(true);
            },
            error   : function() {
                // error getting identity informations
                home(true);
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
                    switch (data.response.action) {
                        case 'VERIFIED':
                            verification(data.response);
                            return;
                        case 'INPUT_NEW_PASSWORD':
                            inputPassword(data.response, token);
                            return;
                    }
                }
                // token 无效
                home(true);
            },
            error   : function() {
                // token 无效
                home(true);
            }
        });
    };

    var hash = document.location.hash.replace(/^#/, '');
    if (hash) {
        hash = hash.split('/');
        for (var i = 0; i < hash.length; i++) {
            if (hash[i].match(/^token=.*/)) {
                resolvetoken(hash[i].replace(/^token=(.*)/, '$1', hash[i]));
                return;
            } else if (hash[i].match(/^\!token=.*/)) {
                cross(hash[i].replace(/^\!token=(.*)/, '$1', hash[i]));
                return;
            } else {
                // 404
                home(true);
                return;
            }
        }
    }
    home();
});
