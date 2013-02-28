define(function (require, exports, module) {

    require('zepto');

    require('moment');

    var config = require('config');

    var Store  = require('store');

    var rdTime = null;

    var tridAt = 0;

    var lastBreathe = +new Date;

    var trim = function(string) {
        return string ? string.replace(/^\s+|\s+$/g, '') : '';
    };

    var setBtnPos = function(banner) {
        var height = window.innerHeight;
        if (height > 460) {
            height = 460;
        } else if (height < 350) {
            height = 350;
        }
        $('html').css('min-height', height + 'px');
        $('.dialog-box').css('min-height', window.innerHeight - (banner ? 50 : 0) + 'px');
        $('.actions').css('top',  (height - 86 - (banner ? 50 : 0)) + 'px');
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

    var styleBody = function(page) {
        var pages = ['home', 'x', 'verify'];
        for (var i in pages) {
            $('body').toggleClass(pages[i], pages[i] === page);
        }
    };

    var home = function(showerror) {
        styleBody('home');
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
        window.location = 'itms://itunes.apple.com/us/app/exfe/id514026604';
    };

    var launchApp = function(args) {
        // @todo ///////////////////////////////////////////////////////////////////////////////////////////////////////
        // window.location = 'exfe://crosses/' + (args ? args : '');
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

    var escape = function(html, encode) {
        return html
              .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#39;');
    };

    var cross = function(token) {
        styleBody('x');
        $('#app-main').html(
            '<div class="redirecting">Redirecting to <span class="exfe_blue3">EXFE</span> app in 3s.</div>'
          + '<div class="content">'
          +     '<div class="title_area">'
          +         '<div class="title_text"></div>'
          +         '<div class="inviter"><span class="inviter_highlight">Steve</span> invites you</div>'
          +         '<div class="title_overlay"></div>'
          +     '</div>'
          +     '<div class="inf_area">'
          +         '<div class="description"></div>'
          +         '<div class="time_area">'
          +             '<div class="time_major"></div>'
          +             '<div class="time_minor"></div>'
          +         '</div>'
          +         '<div class="place_area">'
          +             '<div class="place_major"></div>'
          +             '<div class="place_minor"></div>'
          +             '<div class="map"></div>'
          +         '</div>'
          +         '<div class="rsvp_toolbar">'
          +             '<div class="tri"></div>'
          +             '<table>'
          +                 '<tr>'
          +                     '<td class="accepted">I\'m in</td>'
          +                     '<td class="unavailable">Unavailable</td>'
          +                     '<td class="pending">Pending</td>'
          +                 '</tr>'
          +             '</table>'
          +         '</div>'
          +         '<div class="exfee"><table><tr></tr></table></div>'
          +     '</div>'
          + '</div>'
          + '<footer>'
          +     '<div class="footer-wrap">'
          +         '<div class="footer_frame">'
          +             '<button class="btn_w">Get <span class="exfe_blue2">EXFE</span> app free</button>'
          +         '</div>'
          +     '</div>'
          + '</footer>'

          //   '<div class="top-banner">'
          // +     '<div class="center">'
          // +         '<div class="welcome">Welcome to <span class="exfe">EXFE</span></div>'
          // +         '<div class="exfe-logo">'
          // +             '<img src="/static/img/exfe.png" width="30" height="30" />'
          // +         '</div>'
          // +     '</div>'
          // + '</div>'
          // + '<div class="dialog-box">'
          // +     '<div class="base-info"><span class="by"></span> sends you an invitation, engage in easily with <span class="exfe">EXFE</span> app.</div>'
          // +     '<div class="cross">'
          // +         '<div class="title"></div>'
          // +         '<div class="time"></div>'
          // +         '<div class="place"></div>'
          // +     '</div>'
          // +     '<div class="actions">'
          // +         '<div class="get-button">'
          // +             '<button>Get <span class="exfe">EXFE</span> App <span class="free">free</span></button>'
          // +             '<div class="redirecting">Redirecting to EXFE app in <span class="sec">5</span>s.</div>'
          // +         '</div>'
          // +         '<div class="web-version"><span class="underline">Proceed</span> with desktop web version.</div>'
          // +     '</div>'
          // + '</div>'
        );
        setBtnPos(true);
        var cats = Store.get('cats');
        if (!cats) {
            cats = {};
        }
        var submitData = {invitation_token   : token};
        if (cats[token]) {
            submitData['cross_access_token'] = cats[token];
        }
        $.ajax({
            type    : 'post',
            url     : config.api_url + '/Crosses/GetCrossByInvitationToken',
            data    : submitData,
            success : function(data) {
                if (data && (data = JSON.parse(data)) && data.meta.code === 200) {
                    // render title
                    $('.title_area  .title_text').html(escape(data.response.cross.title));
                    // render description
                    $('.inf_area   .description').html(escape(data.response.cross.description));
                    // render time
                    var time = renderCrossTime(data.response.cross.time);
                    $('.time_area   .time_major').html(escape(time.title));
                    $('.time_area   .time_minor').html(escape(time.content));
                    // render place
                    $('.place_area .place_major').html(escape(data.response.cross.place.title));
                    $('.place_area .place_minor').html(escape(data.response.cross.place.description).replace(/\r\n|\r|\n/g, '<br>'));
                    $('.place_area .map').css('background-image', 'url(https://maps.googleapis.com/maps/api/staticmap?center=' + data.response.cross.place.lat + ',' + data.response.cross.place.lng + '&markers=icon%3a' + encodeURIComponent('http://img.exfe.com/web/map_pin_blue.png') + '%7C' + data.response.cross.place.lat + ',' + data.response.cross.place.lng + '&zoom=13&size=290x100&maptype=road&sensor=false)');
                    // render background
                    var background = 'default.jpg';
                    for (var i = 0; i < data.response.cross.widget.length; i++) {
                        if (data.response.cross.widget[i].type === 'Background') {
                            background = data.response.cross.widget[i].image;
                            break;
                        }
                    }
                    $('.title_area').css(
                        'background',
                        'url(/static/img/xbg/' + background + ') no-repeat 50% 50%'
                    );
                    // get user_id
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
                    // render exfee
                    $('.inviter').hide();
                    var idMyInv = -1;
                    var stype   = '';
                    for (i in data.response.cross.exfee.invitations) {
                        if (user_id
                         && user_id === data.response.cross.exfee.invitations[i].identity.connected_user_id) {
                            idMyInv = i;
                            $('.inviter .inviter_highlight').html(escape(data.response.cross.exfee.invitations[i].by_identity.name));
                            $('.inviter').show();
                            switch (data.response.cross.exfee.invitations[i].rsvp_status) {
                                case 'ACCEPTED':
                                    stype = 'accepted';
                                    break;
                                case 'DECLINED':
                                    stype = 'declined';
                                    break;
                                default:
                                    stype = 'pending';
                            }
                            $('.exfee table tbody tr').first().append(
                                '<td>'
                              +     '<div class="portrait me" style="background: url('
                              +         data.response.cross.exfee.invitations[i].identity.avatar_filename
                              +         '); background-size: 50px 50px;">'
                              +         (data.response.cross.exfee.invitations[i].mates
                                      ? ('<div class="portrait_mate">+'
                                      + data.response.cross.exfee.invitations[i].mates
                                      + '</div>') : '')
                              +     '</div>'
                              +     '<div class="portrait_rsvp_me ' + stype + '">'
                              +     '</div>'
                              +     '<div class="name_me">'
                              +         escape(data.response.cross.exfee.invitations[i].identity.name)
                              +     '</div>'
                              + '</td>'
                            );
                            break;
                        }
                    }
                    var orderRsvp = ['ACCEPTED', 'INTERESTED', 'NORESPONSE', 'IGNORED', 'DECLINED'];
                    var domTr     = null;
                    for (i in orderRsvp) {
                        for (var j in data.response.cross.exfee.invitations) {
                            if (data.response.cross.exfee.invitations[j].rsvp_status !== orderRsvp[i]) {
                                //////////////////continue;
                            }
                            switch (data.response.cross.exfee.invitations[j].rsvp_status) {
                                case 'ACCEPTED':
                                    stype = 'accepted';
                                    break;
                                case 'DECLINED':
                                    stype = 'declined';
                                    break;
                                default:
                                    stype = 'pending';
                            }
                            domTr = $('.exfee table tbody tr').last();
                            if (domTr.children().length === 5) {
                                $('.exfee table tbody').append('<tr></tr>');
                            }
                            domTr = $('.exfee table tbody tr').last();
                            domTr.append(
                                '<td>'
                              +     '<div class="portrait" style="background: url('
                              +         data.response.cross.exfee.invitations[j].identity.avatar_filename
                              +         '); background-size: 50px 50px;">'
                              +         (data.response.cross.exfee.invitations[j].mates
                                       ? ('<div class="portrait_mate">+'
                                       + data.response.cross.exfee.invitations[j].mates
                                       + '</div>') : '')
                              +     '</div>'
                              +     '<div class="portrait_rsvp ' + stype + '">'
                              +     '</div>'
                              +     '<div class="name">'
                              +         escape(data.response.cross.exfee.invitations[j].identity.name)
                              +     '</div>'
                              + '</td>'
                            );
                        }
                    }
                    domTr = $('.exfee table tr').last();
                    count = 5 - domTr.children().length;
                    for (i = 0; i < count; i++) {
                        domTr.append('<td></td>');
                    }
                    // redirecting
                    var args = null;
                    if (typeof data.response.authorization !== 'undefined') {
                        Store.set('authorization', data.response.authorization);
                        args = data.response.cross.id
                             + '?user_id='     + user_id
                             + '&token='       + data.response.authorization.token
                             + '&identity_id=' + data.response.cross.exfee.invitations[i].identity.id;
                    }
                    redirecting(args);
                    return;
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
        var humantime = require('humantime');
        var dspTime   = humantime.printEFTime(crossTime, 'X');
        return dspTime;
    };

    var inputPassword = function(result, token) {
        styleBody('verify');
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
          +             '<input type="text" class="name" id="name" placeholder="Set EXFE User Name" />'
          +         '</div>'
          +         '<div>'
          +             '<input type="password" id="password" placeholder="Set EXFE Password" />'
          +             '<i class="eye icon16-pass-show"></i>'
          +             '<img width="18" height="18" class="loading" src="/static/img/loading.gif" />'
          +         '</div>'
          +         '<div class="error-info"></div>'
          +         '<div class="set-button">'
          +             '<button>Done</button>'
          +         '</div>'
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
                    $('.identity .name').val(data.response.user.name);
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
                submitPassword(token);
            } else {
                $('.error-info').html('');
            }
        });
        $('.set-button button').bind('click', function() {
            submitPassword(token);
        });
    };

    var submitPassword = function(token) {
        $('.loading').show();
        $('.eye').hide();
        var name     = trim($('#name').val());
        var password = $('#password').val();
        if (password.length >= 4) {
         // $('#password').prop('disabled', true);
            $('.set-button button').prop('disabled', true);
            $('.set-button button').toggleClass('disabled', true);
            $.ajax({
                type    : 'post',
                url     : config.api_url + '/Users/ResetPassword',
                data    : {token    : token,
                           name     : name,
                           password : password},
                success : function(data) {
                    $('.loading').hide();
                    $('.eye').show();
                    if (data && (data = JSON.parse(data)) && data.meta.code === 200) {
                        if (data.response.authorization) {
                            $('.error-info').hide();
                            $('.set-button').hide();
                            $('.done-info').show();
                            redirecting('?user_id=' + data.response.authorization.user_id + '&token=' + data.response.authorization.token);
                            return;
                        }
                    }
                    $('.loading').hide();
                    $('.eye').show();
                    $('.error-info').html('Failed to set password. Please try later.').show();
                 // $('#password').prop('disabled', false);
                    $('.set-button button').prop('disabled', false);
                    $('.set-button button').toggleClass('disabled', false);
                },
                error   : function() {
                    $('.loading').hide();
                    $('.eye').show();
                    $('.error-info').html('Failed to set password. Please try later.').show();
                 // $('#password').prop('disabled', false);
                    $('.set-button button').prop('disabled', false);
                    $('.set-button button').toggleClass('disabled', false);
                }
            });
        } else {
            $('.error-info').html('Password must be longer than four!').show();
            $('.loading').hide();
            $('.eye').show();
        }
    };

    var verification = function(result) {
        styleBody('verify');
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

    if (sms_token) {
        switch (sms_token.action) {
            case 'VERIFIED':
                verification(sms_token);
                return;
            case 'INPUT_NEW_PASSWORD':
                inputPassword(sms_token, sms_token.origin_token);
                return;
        }
        home(true);
        return;
    } else if (sms_token === false) {
        // token 无效
        home(true);
        return;
    } else {
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
    }
    home();

});
