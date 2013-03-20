define('photox', function (require) {
  "use strict";

  var Api = require('api'),
      request = Api.request,
      Config = require('config'),
      proto;

  var setToken = function (token) {
    return Api.setToken(token);
  };

  var getPhotoProviders = function () {
    return Config.photo_providers;
  };

  var errorHandler = function (data) {
    if (data && data.meta) {
      switch (data.meta) {
        case 400:
          // param_error
          // 参数错误，需要重新提交
          return;
        case 401:
          // invalid_auth
          // 第三方权限错误，提示用户重新验证该身份的权限
          return;
        case 403:
          // not_authorized
          // 服务器权限错误，不允许此操作
          return;
        case 404:
          // photo_not_found
          // 对象不存在或已经被删除
          return;
      }
    }
    // unknow error
    // 处理未知错误
  };

  var DataCenter = {

    // description: 获取一个 PhotoX 下的所有照片。
    getPhotoX: function (photox_id, success_callback) {
      return request(
        'photox_getPhotoX',
        {
          type      : 'POST',
          resources : { photox_id : photox_id }
        },
        // {"photox" : [object:photox]}
        success_callback
      );
    },

    // description: 获取某个第三方身份的所有可添加进 PhotoX 的相册。
    getAlbums: function (identity_id, album_id, success_callback) {
      return request(
        'photox_getAlbums',
        {
          type : 'POST',
          data : {
            identity_id : identity_id,
            album_id    : album_id
          }
        },
        // {"albums" : [array:album_object]}
        success_callback
      );
    },

    // description: 获取某个第三方身份的照片 feed 中的照片。
    getSourcePhotos: function (identity_id, success_callback) {
      return request(
        'photox_getSourcePhotos',
        {
          type : 'POST',
          data : { identity_id : identity_id }
        },
        // {"photos" : [array:photo_object]}
        success_callback
      );
    },

    // description: 获取某一张照片的全尺寸版本。
    getPhoto: function (photo_id, success_callback) {
      return request(
        'photox_getPhoto',
        {
          type : 'POST',
          data : { photo_id : photo_id }
        },
        // {"photo" : [object:photo]}
        success_callback
      );
    },

    // description: 添加照片到 PhotoX。
    add: function (photox_id, post_args, success_callback) {
      return request(
        'photox_add',
        {
          type      : 'POST',
          resources : { photox_id : photox_id },
          data      : post_args
        },
        // {"photo" : [object:photo]}
        success_callback
      );
    },

    // description: 用于从有相册功能的身份中添加照片
    // eg: Facebook, Flickr, Dropbox
    addAlbum: function (photox_id, identity_id, album_id, success_callback) {
      return DataCenter.add(
        photox_id,
        {
          identity_id : identity_id,
          album_id    : album_id
        },
        success_callback
      );
    },

    // 用于从有照片流功能的身份中添加照片
    // eg: Instagram
    addStream: function (photox_id, identity_id, min_id, max_id, success_callback) {
      return DataCenter.add(
        photox_id,
        {
          identity_id : identity_id,
          min_id      : min_id,
          max_id      : max_id
        },
        success_callback
      );
    },

    // 用于从 PhotoStream 等公开 feed 中加入照片
    // eg: PhotoStream
    addFeed: function (photox_id, stream_id, success_callback) {
      return DataCenter.add(
        photox_id,
        { stream_id : stream_id },
        success_callback
      );
    },

    // description: 获取照片的 like 状态。
    getLikes: function (photox_id, success_callback) {
      return request(
        'photox_getLikes',
        {
          type      : 'POST',
          resources : { photox_id : photox_id }
        },
        // {"likes" : [array:response_object]}
        success_callback
      );
    },

    // description: Like 一张照片。
    like: function (id, success_callback) {
      return request(
        'photox_like',
        {
          type : 'POST',
          data : {id : id}
        },
        // {"like" : [object:response]}
        success_callback
      );
    }
  };


  /**
   * Nav-Tabs composition
   */
  var NavTabs = function (composition, selector, sources, identities) {
    this.composition = composition;
    this.selector = selector;
    this.$element = composition.$(selector);
  };
  proto = NavTabs.prototype;

  proto.liTmp = '<li><a href="#" class="hide-text"></a></li>';

  proto.badgeTmmp = '<div class="badge badgex"></div>';

  proto.generate = function () {};

  proto.sort = function () {};


  /**
   * Breadcrumb composition
   */
  var Breadcrumb = function () {};

  /**
   * Thumbnails composition
   */
  var Thumbnails = function () {};

  /**
   * Photos composition
   */
  var Photos = function () {};

  var Panel = require('panel');

  var PhotoXPanel = Panel.extend({

    options: {

      template: ''
        + '<div class="panel photox-panel">'
          + '<div class="clearfix panel-header">'
            + '<h3 class="pull-left title panel-title">PhotoX</h3>'
            + '<ul class="pull-right nav nav-tabs"></ul>'
          + '</div>'
          + '<div class="panel-body">'
            + '<ul class="breadcrumb hide"></ul>'
            + '<ul class="thumbnails albums"></ul>'
          + '</div>'
          + '<div class="panel-footer">'
            + '<div class="detail"><span class="selected-nums">0</span> pics selected</div>'
            + '<div class="icon-resize"></div>'
            + '<button class="xbtn-upload">Upload</button>'
          + '</div>'
        + '</div>',

      parentNode: null,

      srcNode: null
    },

    init: function () {
      var options = this.options;
      this.providers = options.providers;
      delete options.providers;

      this.render();

      this.navTabs = new NavTabs(this, '.panel-header .nav-tabs', this.providers);

      this.listen();
    },

    listen: function () {},

    showAfter: function () {
      var offset = this.srcNode.parent().offset();
      this.element.css({
        top: offset.top + 50,
        left: offset.left - 20
      });
    },

    destory: function () {
      this.element.off();
      this.element.remove();
      this._destory();
    }

  });

  return PhotoXPanel;
});

/* Notes:
  - 打开 `phhotx-panel` 显示位置
    显示在 `Conversation` 上，最小宽度跟 `Converstaion` 一样
  - 第一次没有绑定任何 photo-identity, `albums` 区域显示什么
    有提示文字
*/
