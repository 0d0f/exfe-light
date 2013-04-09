define(function (require, exports, module) {

    require('zepto');

    var config = require('config');

    var Store  = require('store');

    var Live   = require('live');

    var rdTime = null;

    var tridAt = 0;

    var my_invitation = null;

    var my_exfee_id   = 0;

    var my_token      = '';

    // var count_down    = 5;
    // @debug only
    var count_down    = 5000000000;

    var lastBreathe   = +new Date;

    var trim = function(string) {
        return string ? string.replace(/^\s+|\s+$/g, '') : '';
    };

    var setBtnPos = function(banner, cross) {
        var height = window.innerHeight;
        if (height > 460) {
            height = 460;
        } else if (height < 350) {
            height = 350;
        }
        $('html').css('min-height', height + 'px');
        $('.dialog-box').css('min-height', window.innerHeight - (banner ? 50 : 0) + 'px');
        if (!cross) {
            $('.actions').css('top',  (height - 86 - (banner ? 50 : 0)) + 'px');
        }
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

    var disRedirecting = function() {
        $('.redirecting').hide();
        $('footer').hide();
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
          +             '<button>Get <span class="exfe">EXFE</span> app <span class="free">free</span></button>'
          +             '<div class="redirecting">Redirecting to EXFE app in <span class="sec">' + count_down + '</span>s.</div>'
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

    var escape = function(html, encode) {
        return html
              .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#39;');
    };

    var cross = function(token, cross_id) {
        styleBody('x');
        $('#app-main').html(
            '<div class="cross redirecting">Redirecting to <span class="exfe_blue3">EXFE</span> app in <span class="sec">' + count_down + '</span>s.</div>'
          + '<div class="content">'
          +     '<div class="title_area">'
          +         '<div class="title_wrap_a">'
          +             '<div class="title_wrap_b">'
          +                 '<div class="title_text"></div>'
          +             '</div>'
          +         '</div>'
          +         '<div class="inviter"><div class="ribbon"></div><div class="textoverflow">Invited by <span class="inviter_highlight"></span></div></div>'
          +         '<div class="title_overlay"></div>'
          +     '</div>'
          +     '<div class="inf_area">'
          +         '<div class="description"><div class="xbtn-more"><span class="rb"></span><span class="lt"></span></div></div>'
          +         '<div class="time_area">'
          +             '<div class="time_major"></div>'
          +             '<div class="time_minor"></div>'
          +         '</div>'
          +         '<div class="place_area">'
          +             '<div class="place_major"></div>'
          +             '<div class="place_minor"></div>'
          +             '<a class="map_link" href="#">'
          +                 '<div class="map">'
          +                     '<img class="place_mark" src="http://img.exfe.com/web/map_pin_blue@2x.png">'
          +                 '</div>'
          +             '</a>'
          +         '</div>'
          +         '<div class="rsvp_toolbar rsvp_toolbar_off">'
          +             '<div class="tri"></div>'
          +             '<table>'
          +                 '<tr>'
          +                     '<td class="rsvp accepted">I\'m in</td>'
          +                     '<td class="rsvp unavailable">Unavailable</td>'
          +                 '</tr>'
          +             '</table>'
          +         '</div>'
          +         '<div class="exfee"><table><tr></tr></table></div>'
          +     '</div>'
          + '</div>'
          + '<footer>'
          +     '<div class="footer-wrap">'
          +         '<div class="footer_frame">'
          +             '<div class="actions" id="cross_actions">'
          +                 '<div class="subscribe">Subscribe to updates and engage in:'
          +                     '<div class="subscribe-frame">'
          +                         '<input type="text" class="email" id="email" placeholder="Enter your email">'
          +                         '<button class="btn_mail"></button>'
          +                     '</div>'
          +                 '</div>'
          +                 '<div class="get-button">'
          +                     '<button class="btn_w">Get <span class="exfe">EXFE</span> app <span class="free">free</span></button>'
          +                 '</div>'
          +                 '<div class="web-version"><span class="underline">Proceed</span> with desktop web version.</div>'
          +             '</div>'
          +         '</div>'
          +     '</div>'
          + '</footer>'
        );
        setBtnPos(true, true);
        var cats = Store.get('cats');
        if (!cats) {
            cats = {};
        }
        var submitData = {invitation_token   : token};
        if (cats[token]) {
            my_token   = submitData['cross_access_token'] = cats[token];
        } else if (cross_id) {
            submitData['cross_id'] = cross_id;
        }
        $('.rsvp.accepted').bind('click',    function() {
            rsvp('ACCEPTED');
        });
        $('.rsvp.unavailable').bind('click', function() {
            rsvp('DECLINED');
        });
        $.ajax({
            type    : 'post',
            url     : config.api_url + '/Crosses/GetCrossByInvitationToken',
            data    : submitData,
            success : function(data) {
                if (data && (data = JSON.parse(data)) && data.meta.code === 200) {
                    // render title
                    $('.title_area  .title_text').html(escape(data.response.cross.title));
                    // render description
                    $('.inf_area   .description').prepend(escape(data.response.cross.description).replace(/\r\n|\r|\n/g, '<br>'));
                    if ($('.inf_area .description').height() > 130) {
                        $('.inf_area .description .xbtn-more').show();
                        $('.inf_area .description .xbtn-more .rb').show();
                        $('.inf_area .description .xbtn-more .lt').hide();
                        $('.inf_area .description').toggleClass('limit', true).on('click', function() {
                            if ($('.inf_area .description').hasClass('limit')) {
                                $('.inf_area .description').toggleClass('limit', false);
                                $('.inf_area .description .xbtn-more .rb').hide();
                                $('.inf_area .description .xbtn-more .lt').show();
                            } else {
                                $('.inf_area .description').toggleClass('limit', true);
                                $('.inf_area .description .xbtn-more .rb').show();
                                $('.inf_area .description .xbtn-more .lt').hide();
                            }
                        });
                    } else {
                        $('.inf_area .description .xbtn-more').hide();
                    }
                    if (!data.response.cross.description) {
                        $('.time_area').addClass('no_prepend');
                    }
                    // render time
                    var timeTitle   = 'Sometime';
                    var timeContent = 'To be decided';
                    if (data.response.cross.time
                     && data.response.cross.time.begin_at
                     && data.response.cross.time.begin_at.origin
                     && data.response.cross.time.begin_at.timezone) {
                        var time    = renderCrossTime(data.response.cross.time);
                        timeTitle   = escape(time.title);
                        timeContent = escape(time.content);
                    } else {
                        $('.time_area .time_minor').toggleClass('time_tobe', true);
                    }
                    $('.time_area   .time_major').html(timeTitle);
                    $('.time_area   .time_minor').html(timeContent);
                    // render place
                    var placeTitle  = 'Somewhere';
                    var placeDesc   = 'To be decided';
                    if (data.response.cross.place
                     && data.response.cross.place.title) {
                        placeTitle = escape(data.response.cross.place.title);
                        placeDesc  = escape(data.response.cross.place.description).replace(/\r\n|\r|\n/g, '<br>');
                    } else {
                        $('.place_area .place_minor').toggleClass('place_tobe', true);
                    }
                    $('.place_area .place_major').html(placeTitle);
                    $('.place_area .place_minor').html(placeDesc);
                    if (data.response.cross.place.lat
                     && data.response.cross.place.lng) {
                        var scale = typeof window.devicePixelRatio !== 'undefined'
                             && window.devicePixelRatio <= 2
                              ? window.devicePixelRatio  : 1;
                        $('.place_area .map').css(
                            'background-image',
                            'url(https://maps.googleapis.com/maps/api/staticmap?center='
                          + data.response.cross.place.lat + ','
                          + data.response.cross.place.lng + '&markers=icon%3a'
                          + encodeURIComponent('http://img.exfe.com/web/map_pin_blue.png')
                          + '%7C'
                          + data.response.cross.place.lat + ','
                          + data.response.cross.place.lng
                          + '&zoom=13&size=290x100&maptype=road&sensor=false&scale='
                          + scale + ')'
                        );
                        $('.map_link').attr(
                            'href',
                            'http://maps.google.com/maps?daddr='
                          + encodeURIComponent(placeTitle) + '@'
                          + data.response.cross.place.lat  + ','
                          + data.response.cross.place.lng
                        );
                    } else {
                        $('.place_area .map').hide();
                    }
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
                    var myIdId  = 0;
                    if (data.response.authorization) {
                        user_id = data.response.authorization.user_id;
                        if (data.response.browsing_identity) {
                            myIdId  = data.response.browsing_identity.id;
                        }
                    } else if (data.response.browsing_identity
                            && data.response.browsing_identity.connected_user_id > 0) {
                        user_id = data.response.browsing_identity.connected_user_id;
                        myIdId  = data.response.browsing_identity.id;
                    }
                    if (typeof data.response.cross_access_token !== 'undefined') {
                        cats[token] = data.response.cross_access_token;
                        Store.set('cats', cats);
                        my_token    = data.response.cross_access_token;
                    }
                    // render exfee
                    $('.inviter').hide();
                    var idMyInv = -1;
                    var stype   = '';
                    my_exfee_id = data.response.cross.exfee.id;
                    for (i in data.response.cross.exfee.invitations) {
                        if ((user_id && user_id === data.response.cross.exfee.invitations[i].identity.connected_user_id)
                         || myIdId  === data.response.cross.exfee.invitations[i].identity.id) {
                            idMyInv = i;
                            myIdId  = data.response.cross.exfee.invitations[i].identity.id;
                            $('.inviter .inviter_highlight').html(escape(data.response.cross.exfee.invitations[i].invited_by.name));
                            $('.inviter').show();
                            my_invitation = data.response.cross.exfee.invitations[i];
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
                              +     '</div>'
                              +     '<div class="portrait_rsvp_me ' + stype + '">'
                              +     '</div>'
                              +     (data.response.cross.exfee.invitations[i].mates
                                  ? ('<div class="portrait_mymate">+'
                                  + data.response.cross.exfee.invitations[i].mates
                                  + '</div>') : '')
                              +     '<div class="name_me textcut">'
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
                            if (data.response.cross.exfee.invitations[j].rsvp_status !== orderRsvp[i]
                             || idMyInv == j) {
                                continue;
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
                              +     '<div class="name textcut">'
                              +         escape(data.response.cross.exfee.invitations[j].identity.name)
                              +     '</div>'
                              + '</td>'
                            );
                        }
                    }
                    domTr  = $('.exfee table tr').last();
                    count  = 5 - domTr.children().length;
                    for (i = 0; i < count; i++) {
                        domTr.append('<td></td>');
                    }
                    // redirecting
                    var args = null;
                    if (user_id) {
                        if (typeof data.response.authorization !== 'undefined') {
                            Store.set('authorization', data.response.authorization);
                            args = data.response.cross.id
                                 + '?user_id='     + user_id
                                 + '&token='       + data.response.authorization.token
                                 + '&identity_id=' + myIdId;
                            my_token = data.response.authorization.token;
                        } else {
                            var authorization = Store.get('authorization');
                            if (authorization
                             && typeof authorization.user_id !== 'undefined'
                             && authorization.user_id === user_id) {
                                args = data.response.cross.id
                                     + '?user_id='     + user_id
                                     + '&token='       + authorization.token
                                     + '&identity_id=' + myIdId;
                                my_token = authorization.token;
                            }
                        }
                    }
                    if (my_token && idMyInv !== -1) {
                        if (data.response.cross.exfee.invitations[idMyInv].identity.id
                        === data.response.cross.exfee.invitations[idMyInv].invited_by.id) {
                            $('.inviter').hide();
                        } else {
                            $('.rsvp_toolbar').toggleClass('rsvp_toolbar_off', false);
                        }
                        $('.portrait.me').on('click', function() {
                            $('.rsvp_toolbar').toggleClass(
                                'rsvp_toolbar_off',
                                !$('.rsvp_toolbar').hasClass('rsvp_toolbar_off')
                            );
                        });
                        if (data.response.cross.exfee.invitations[idMyInv].identity.provider === 'phone') {
                            $('.rsvp_toolbar tr').append(
                                '<td class="rsvp changename">Change my display name</td>'
                            );
                            $('.rsvp_toolbar td').css('width', '98px');
                            $('.changename').on('click', function() {
                                var strDisplayName = prompt('Change my display name:');
                                if (strDisplayName === null) {
                                } else if (strDisplayName === '') {
                                    alert('Display name cannot be empty.');
                                } else {
                                    $.ajax({
                                        type    : 'post',
                                        url     : config.api_url + '/Identities/'
                                                + data.response.cross.exfee.invitations[idMyInv].identity.id
                                                + '/Update' + '?token=' + my_token,
                                        data    : {name : strDisplayName},
                                        success : function(data) {
                                            if (data && (data = JSON.parse(data)) && data.meta.code === 200) {
                                                $('.name_me').html(
                                                    escape(data.response.identity.name)
                                                );
                                            }
                                        },
                                        error   : function() {
                                            alert('Failed, please retry later.');
                                        }
                                    });
                                }
                            });
                            $('.subscribe').show();
                            $('#email.email').on('keyup', function(event) {
                                if (event.keyCode === 13) {
                                    addNotificationIdentity(data);
                                }
                            });
                            $('.subscribe .btn_mail').on('click', function() {
                                addNotificationIdentity(data);
                            });
                        }
                    } else {
                        $('.inviter').hide();
                    }
                    if (args) {
                        redirecting(args);
                    } else {
                        disRedirecting();
                    }
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

    var addNotificationIdentity = function(data) {
        var email = $('#email.email').val();
        if (!/^[a-zA-Z0-9!#$%&\'*+\\\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&\'*+\\\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(email)) {
            $('#email.email').attr('placeholder', 'Bad email Address.');
            return;
        }
        $.ajax({
            type    : 'post',
            url     : config.api_url + '/Exfee/'
                    + data.response.cross.exfee.id
                    + '/AddNotificationIdentity' + '?token=' + my_token,
            data    : {provider          : 'email',
                       external_username : email},
            success : function(data) {
                if (data && (data = JSON.parse(data)) && data.meta.code === 200) {
                    $('.subscribe').hide();
                }
            },
            error   : function() {
                alert('Failed, please retry later.');
            }
        });
    }

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
          +             '<span class="redirecting">Redirecting to app in <span class="sec">' + count_down + '</span>s.</span>'
          +         '</div>'
          +     '</div>'
          +     '<div class="actions">'
          +         '<div class="get-button">'
          +             '<button>Get <span class="exfe">EXFE</span> app <span class="free">free</span></button>'
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

    var rsvp = function(rsvp) {
        var submitData = [{
            rsvp_status    : rsvp,
            identity_id    : my_invitation.identity.id,
            by_identity_id : my_invitation.identity.id
        }];
        $('.rsvp_toolbar').addClass('rsvp_toolbar_off');
        switch (rsvp) {
            case 'ACCEPTED':
                $('.portrait_rsvp_me').toggleClass('accepted', true);
                $('.portrait_rsvp_me').toggleClass('declined', false);
                $('.portrait_rsvp_me').toggleClass('pending',  false);
                break;
            case 'DECLINED':
                $('.portrait_rsvp_me').toggleClass('accepted', false);
                $('.portrait_rsvp_me').toggleClass('declined', true);
                $('.portrait_rsvp_me').toggleClass('pending',  false);
                break;
            default:
                $('.portrait_rsvp_me').toggleClass('accepted', false);
                $('.portrait_rsvp_me').toggleClass('declined', false);
                $('.portrait_rsvp_me').toggleClass('pending',  true);
        }
        $.ajax({
            type    : 'post',
            url     : config.api_url + '/Exfee/' + my_exfee_id + '/Rsvp?token=' + my_token,
            data    : {rsvp : JSON.stringify(submitData)},
            success : function(data) {
            },
            error   : function() {
                alert('RSVP failed!');
            }
        });
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
          +             '<span class="redirecting">Redirecting to app in <span class="sec">' + count_down + '</span>s.</span>'
          +         '</div>'
          +     '</div>'
          +     '<div class="space"></div>'
          +     '<div class="actions">'
          +         '<div class="get-button">'
          +             '<button>Get <span class="exfe">EXFE</span> app <span class="free">free</span></button>'
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
                            $('.identity .provider').attr(
                                'src',
                                '/static/img/identity_'
                              + data.response.user.identities[i].provider
                              + '_18_grey@2x.png'
                            );
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

    var parseAttendeeInfo = function(string) {
        string = trim(string);
        var objIdentity = {
            id                : 0,
            name              : '',
            external_id       : '',
            external_username : '',
            provider          : '',
            type              : 'identity'
        }
        if (/^[^@]*<[a-zA-Z0-9!#$%&\'*+\\\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&\'*+\\\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?>$/.test(string)) {
            var iLt = string.indexOf('<'),
                iGt = string.indexOf('>');
            objIdentity.external_id       = trim(string.substring(++iLt, iGt));
            objIdentity.external_username = objIdentity.external_id;
            objIdentity.name              = trim(cutLongName(trim(string.substring(0, iLt)).replace(/^"|^'|"$|'$/g, '')));
            objIdentity.provider          = 'email';
        } else if (/^[a-zA-Z0-9!#$%&\'*+\\\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&\'*+\\\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(string)) {
            objIdentity.external_id       = string;
            objIdentity.external_username = string;
            objIdentity.name              = trim(cutLongName(string.split('@')[0]));
            objIdentity.provider          = 'email';
        } else if (/^@[a-z0-9_]{1,15}$|^@[a-z0-9_]{1,15}@twitter$|^[a-z0-9_]{1,15}@twitter$/i.test(string)) {
            objIdentity.external_id       = '';
            objIdentity.external_username = string.replace(/^@|@twitter$/ig, '');
            objIdentity.name              = objIdentity.external_username;
            objIdentity.provider          = 'twitter';
        } else if (/^[a-z0-9\.]{5,}@facebook$/i.test(string)) {
        // https://www.facebook.com/help/?faq=105399436216001#What-are-the-guidelines-around-creating-a-custom-username?
            objIdentity.external_id       = '';
            objIdentity.external_username = string.replace(/@facebook$/ig, '');
            objIdentity.name              = objIdentity.external_username;
            objIdentity.provider          = 'facebook';
        } else if (/^\+[\d\-]{5,15}$/.test(string)) {
            string = string.replace(/\-|\(|\)|\ /g, '');
            objIdentity.external_id       = string;
            objIdentity.external_username = string;
            objIdentity.name              = string.replace(/^.*([\d]{4})$/, '$1');
            objIdentity.provider          = 'phone';
        } else {
            return null;
        }
        objIdentity.avatar_filename = encodeURI(config.api_url + '/avatar/default?name=' + objIdentity.name);
        return objIdentity;
    };

    var here = function(card) {
        $('#app-main').html(
            '<div class="here-main">'
          +     '<ol class="near-by"></ol>'
          +     '<div class="my-card">'
          +         '<img class="my-avatar" src="">'
          +         '<div class="name-input">'
          +             '<input type="text" class="name" value="">'
          +             '<button class="ok">OK</button>'
          +         '</div>'
          +         '<div class="identities-list">'
          +             '<ol></ol>'
          +             '<button class="add">Enter your email or mobile</button>'
          +         '</div>'
          +     '</div>'
          + '</div>'
        );

        var myCard = Store.get('user');
        if (myCard && myCard.identities && myCard.identities.length) {
            $('.here-main .name-input .name').val(myCard.name);
            $('.here-main .my-card .my-avatar').attr('src', myCard.avatar_filename);
            for (var i in myCard.identities) {
                switch (myCard.identities[i].provider) {
                    case 'email':
                    case 'phone':
                        addNewField(myCard.identities[i].external_username);
                }
            }
        }

        $('.here-main .name-input .ok').on('click', setMyCard);
        $('.here-main .name-input .name').on('keyup', function() {
            console.log(checkInput());
            $('.here-main .name-input .ok').prop('disabled', !checkInput());
        });
        $('.here-main .identities-list').on('keyup', '.new-identity', function() {
            $('.here-main .name-input .ok').prop('disabled', !checkInput());
        });
        $('.here-main .identities-list .add').on('click', addNewField);
    };

    var getUTF8Length = function(string) {
        var length = 0;
        if (string) {
            for (var i = 0; i < string.length; i++) {
                charCode = string.charCodeAt(i);
                if (charCode < 0x007f) {
                    length += 1;
                } else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) {
                    length += 2;
                } else if ((0x0800 <= charCode) && (charCode <= 0xffff)) {
                    length += 3;
                }
            }
        }
        return length;
    };

    var cutLongName = function(string) {
        string = string ? string.replace(/[^0-9a-zA-Z_\u4e00-\u9fa5\ \'\.]+/g, ' ') : '';
        while (getUTF8Length(string) > 30) {
            string = string.substring(0, string.length - 1);
        }
        return string;
    };

    var checkInput = function() {
        if (!$('.here-main .name-input .name').val()) {
            return false;
        }
        var inputs = $('.here-main .identities-list li');
        var numIds = 0;
        for (var i = 0; i < inputs.length; i++) {
            var strIdentity = $(inputs[i]).find('.new-identity').val();
            if (strIdentity) {
                if (parseAttendeeInfo(strIdentity)) {
                    numIds++;
                } else {
                    return false;
                }
            }
        }
        if (!numIds) {
            return false;
        }
        return true;
    };

    var setMyCard = function() {
        var myCard = {
            name       : $('.here-main .name-input .name').val(),
            avatar     : $('.here-main .my-card .my-avatar').attr('src'),
            identities : []
        };
        var inputs = $('.here-main .identities-list li');
        for (var i = 0; i < inputs.length; i++) {
            var objIdentity = parseAttendeeInfo($(inputs[i]).find('.new-identity').val());
            if (objIdentity) {
                myCard.identities.push(objIdentity);
            }
        }
        if (myCard.name && myCard.identities.length) {
            Live.init(myCard, liveCallback);
        }
    };

    var updateMyCard = function(card) {
        // update name
        var objName = $('.here-main .name-input .name');
        var curName = trim(objName.val()).toLowerCase();
        var gotName = trim(card.name);
        if (curName !== gotName.toLowerCase()) {
            objName.val(gotName);
        }
        // update avatar
        var objAvatar = $('.here-main .my-card .my-avatar');
        var curAvatar = trim(objAvatar.attr('src')).toLowerCase();
        var gotAvatar = trim(card.avatar);
        if (curAvatar !== gotAvatar.toLowerCase()) {
            objAvatar.attr('arc', gotAvatar);
        }
        // update identities
        var inputs = $('.here-main .identities-list li');
        var found  = {};
        for (var i = 0; i < inputs.length; i++) {
            var idItem = trim($(inputs[i]).find('.new-identity').val()).toLowerCase();
            for (var j = 0; j < card.identities.length; j++) {
                var idGot = trim(card.identities[j].external_username).toLowerCase();
                if (idItem === idGot) {
                    found[card.identities[j].external_username] = true;
                }
            }
        }
        for (i = 0; i < card.identities.length; i++) {
            if (typeof found[card.identities[i].external_username] === 'undefined') {
                addNewField(trim(card.identities[i].external_username));
            }
        }
    };

    var updateOthers = function(cards) {
        var olNearBy = $('.here-main .near-by li');
        var found    = {};
        for (var i = 0; i < olNearBy.length; i++) {
            var domItem = $(olNearBy[i]);
            var id = domItem.data('id');
            if (id) {
                if (typeof cards[id] === 'undefined') {
                    domItem.remove();
                } else {
                    updatePerson(cards[id]);
                    found[id] = true;
                }
            }
        }
        for (i in cards) {
            if (typeof found[i] === 'undefined') {
                addNewPerson(cards[i]);
            }
        }
    };

    var liveCallback = function(data) {
        if (typeof data['me'] !== 'undefined') {
            updateMyCard(data.me);
        }
        if (typeof data['others'] !== 'undefined') {
            updateOthers(data.others);
        }
    };

    var addNewField = function(val) {
        $('.here-main .identities-list').append(
            '<li><input class="new-identity" type="text" value="'
          + (Object.prototype.toString.call(val) === '[object String]' ? escape(val) : '')
          + '"></li>'
        );
    };

    var addNewPerson = function(card) {
        var objLi = $(
            '<li data-id="' + card.id + '">'
          +     '<img calss="avatar" src="' + card.avatar + '"/>'
          +     '<div class="name">' + escape(card.name) + '</div>'
          + '</li>'
        );
        objLi.data('card', card);
        $('.here-main .near-by').append(objLi);
    };

    var updatePerson = function(card) {
        // update dom
        var objLi = $('.here-main .near-by [data-id="' + card.id + '"]');
        var oldData = objLi.data('card');
        objLi.data('card', card);
        // update name
        if (trim(oldData.name).toLowerCase() !== trim(card.name).toLowerCase()) {
            objLi.find('.name').html(card.name);
        }
        // update avatar
        if (trim(oldData.avatar).toLowerCase() !== trim(card.avatar).toLowerCase()) {
            objLi.find('.avatar').attr('src', card.avatar);
        }
    };

    window.addEventListener('load', function() {
        setTimeout(function() {
            window.scrollTo(0, 0);
        }, 0);

        function isLocalStorageSupported() {
            try {
                var supported = typeof window.localStorage !== 'undefined';
                if (supported) {
                    window.localStorage.setItem('storage', 0);
                    window.localStorage.removeItem('storage');
                }
                return supported;
            } catch(err) {
                return false
            }
        }

        if (!isLocalStorageSupported()) {
            alert('EXFE cannot be used in private browsing mode.');
        }
    });

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
                } else if (hash[i].match(/^\![0-9]{1,}/)
                        && typeof hash[i + 1] !== 'undefined'
                        && hash[i + 1].match(/^.{4}/)) {
                    cross(hash[i + 1], hash[i].replace(/^\!(.*)/, '$1', hash[i]));
                    return;
                } else if (hash[i].match(/^here/)) {
                    here();
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
