define(function (require, exports, module) {

    require('zepto');

    var config = require('config');

    var home = function() {
        // default home page
    };

    var cross = function() {
        // please download EXFE app to view the cross
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
                            }
                        }
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
        if (hash[i].match(/token=.*/)) {
            resolvetoken(hash[i].replace(/token=(.*)/, '$1', hash[i]));
        } else if (hash[i].match(/!token=.*/)) {
            cross();
        }
    }

});
