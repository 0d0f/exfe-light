define('api', function (require) {
  "use strict";

  // import $.ajax
  var $ = require('jquery'),
      Deferred = $.Deferred,
      ajax = $.ajax,
      param = $.param,
      Config = require('config');

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

    signout: '/Users/signout/:user_id', // @todo

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
    sortIdentities: '/Users/:user_id/sortIdentities',


    // PhotoX {
    // NOTE: photox_id = cross_id

    // Get PhotoX
    photox_getPhotoX: '/photox/:photox_id',

    // Get albums & photos
    photox_borwseSource: '/photox/browseSource',

    // Get photo
    photox_getPhoto: '/photox/GetPhoto',

    // Add
    photox_add: '/photox/:photox_id/Add',

    // Get likes
    photox_getLikes: '/photox/:photox_id/GetLikes',

    // Like
    photox_like: '/photox/Like',

    // Add
    photox_del: '/photox/:photox_id/Delete'

    // PhotoX }

  };

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
        params = param(params);
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
      if (s.hasOwnProperty(k)) {
        r[k] = s[k];
      }
    }
    return r;
  }

  // See jQuery#ajax's settings
  // http://api.jquery.com/jQuery.ajax/
  var defaultOptions = {
    type: 'GET',
    dataType: 'JSON',
    //timeout: 4698,
    timeout: 10000,
    cache: false,
    // CORS: Cross Origin Resource Share
    xhrFields: { withCredentials: true }
  };

  function _ajax(options, done, fail) {
    var o = {}, dfd, promise, jqXHR;

    _extend(o, defaultOptions);

    _extend(o, options);

    dfd = Deferred();
    promise = dfd.promise();

    jqXHR = ajax(o)
      .done(function (data, statusText, jqXHR) {
        var code = data && data.meta && data.meta.code;
        if (200 === code) {
          dfd.resolve(data.response, statusText, jqXHR);
        } else {
          dfd.reject(data, code, statusText, jqXHR);
        }
      })
      .fail(function (data, statusText, jqXHR) {
          var code = data && data.meta && data.meta.code;
          dfd.reject(data, code, statusText, jqXHR);
        });

    promise.jqXHR = jqXHR;
    promise.abort = function (statusText) {
      if (jqXHR) {
        jqXHR.abort(statusText);
        jqXHR = dfd = promise = null;
      }
    };
    promise
      .done(done)
      .fail(fail)
      .always(function () { jqXHR = dfd = promise = null; });

    return promise;
  }

  return Api;

});
