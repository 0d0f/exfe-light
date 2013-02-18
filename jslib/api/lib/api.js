define('api', function (require) {
  "use strict";

  // import $.ajax
  var $ = require('jquery');
  var Config = require('config');

  // urls of API
  // 区分大小写
  var urls = {

    // base url
    base_url: Config.api_url,


    // Users
    signin: '/Users/signin',

    getRegistrationFlag: '/Users/getRegistrationFlag',

    // -------------- Must Use Token ---------------------- //
    getUser: '/Users/:user_id',

    signout: '',

    updateUser: '/Users/update',

    setPassword: '/Users/:user_id/setPassword',

    crosses: '/Users/:user_id/crosses',

    crosslist: '/Users/:user_id/crosslist',

    addIdentity: '/Users/addIdentity',

    deleteIdentity: '/Users/deleteIdentity',

    setDefaultIdentity: '/Users/setDefaultIdentity',

    mergeIdentities: '/Users/mergeIdentities',

    // Identity
    getIdentityById: '/Identities/:identity_id',

    complete: '/Identities/complete',

    getIdentity: '/Identities/get',

    updateIdentity: '/Identities/:identity_id/update',


    // Cross
    getCross: '/Crosses/:cross_id',

    gather: '/Crosses/gather',

    editCross: '/Crosses/:cross_id/edit',


    // Exfee
    rsvp: '/Exfee/:exfee_id/rsvp',

    editExfee: '/Exfee/:exfee_id/edit',


    // Conversation
    conversation: '/Conversation/:exfee_id',

    addConversation: '/Conversation/:exfee_id/add',


    // Verify
    // 登陆前
    verifyIdentity: '/Users/verifyIdentity',

    // 登陆后
    verifyUserIdentity: '/Users/verifyUserIdentity',

    forgotPassword: '/Users/forgotPassword',

    avatarUpdate: '/Avatar/update',

    // Cross Token
    getCrossByInvitationToken: '/Crosses/getCrossByInvitationToken',

    // Resolve Token
    resolveToken: '/Users/resolveToken',

    // Reset Password - `user token`
    resetPassword: '/Users/resetPassword',

    // SetupUserByInvitationToken - `cross token`
    setupUserByInvitationToken: '/Users/setupUserByInvitationToken',

    // Opening a private invitation X.
    getInvitationByToken: '/Crosses/:cross_id/getInvitationByToken',

    // cross time
    recognize: '/time/recognize',

    // sort identities
    sortIdentities: '/Users/:user_id/sortIdentities'
  };

  // Not Use Token
  //var ignore = 'signin getRegistrationFlag verifyIdentity forgotPassword getIdentityById getCrossByInvitationToken resolveToken';

  var Api = {

    // request token
    _token: null,

    setToken: function (token) {
      this._token = token;
    },

    getToken: function () {
      return this._token;
    },

    /**
     *
     * Usage:
     *
     *    Api.request('/Users/:user_id/crosslist?token=xxx'
     *      , {
     *        // url params
     *        params {
     *          more: true
     *        },
     *        // url resources
     *        resources: {
     *          user_id: 233
     *        },
     *        type: 'POST',
     *        data: {}
     *      }
     *      , function done() {}
     *      , function fail() {}
     *    );
     *
     */
    request: function (channel, options, done, fail) {
      var url = urls[channel]
        , k
        , params = options.params
        , resources = options.resources;

      if (!url) { return; }

      //if (ignore.split(' ').indexOf(channel) === -1) {

        //if (!Api._token) { return; }

      if (!params) {
        params = {};
      }

        //params.token = Api._token;
      //}

      if (params) {
        if (Api._token && !params.token) {
          params.token = Api._token;
        }
        params = $.param(params);
        url += params ? '?' + params : '';
      }

      if (resources) {
        for (k in resources) {
          url = url.replace(':' + k, encodeURIComponent(resources[k]));
        }
      }

      options.url = urls.base_url + url;

      delete options.params;
      delete options.resources;

      return _ajax(options, done, fail);
    }
  }

  // helper

  function _extend(r, s) {
    var k;
    for (k in s) {
      r[k] = s[k];
    }
    return r;
  }

  // See jQuery.ajax's settings
  // http://api.jquery.com/jQuery.ajax/
  var defaultOptions = {
    type: 'GET',
    dataType: 'JSON',
    // cors: Cross Origin Resource Share
    xhrFields: { withCredentials: true }
  };

  function _ajax(options, done, fail) {
    var o = {}, dfd;

    _extend(o, defaultOptions);

    _extend(o, options);

    // return jqXHR
    dfd = $.ajax(o);
    dfd.then(
          // done filter
          function (data) {
            var code = data && data.meta && data.meta.code;
            if (200 === code) {
              return data.response;
            }
            else {
              return $.Deferred().reject(data);
            }
          }
        /* Response Fail.
        , function (data) {
            return {
            }
          }
        */
      )
      .done(done)
      .fail(fail);

    return dfd;
  }

  return Api;

});
