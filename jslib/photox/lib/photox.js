define(function (require, exports, module) {

  var config = require('config');

  var api    = require('api');


  var setToken = function(token) {
    return Api.setToken(token);
  };


  // description: 获取一个 PhotoX 下的所有照片。
  var getPhotoX = function(photox_id, success_callback) {
    return Api.request(
      'photox_getPhotoX',
      {
        type      : 'POST',
        resources : {photox_id : photox_id}
      },
      function(data) {
        // {"photox" : [object:photox]}
        success_callback(data);
      },
      function(data) {
        // - 400: param_error
        // - 401: invalid_auth
        // - 403: not_authorized
      }
    );
  };


  // description: 获取某个第三方身份的所有可添加进 PhotoX 的相册。
  var getAlbums = function(identity_id, album_id, success_callback) {
    return Api.request(
      'photox_getAlbums',
      {
        type : 'POST',
        data : {
          identity_id : identity_id,
          album_id    : album_id
        }
      },
      function(data) {
        // {"albums" : [array:album_object]}
        success_callback(data);
      },
      function(data) {
        // - 400: param_error
        // - 401: invalid_auth
      }
    );
  };


  // description: 获取某个第三方身份的照片 feed 中的照片。
  var getSourcePhotos = function(identity_id, success_callback) {
    return Api.request(
      'photox_getSourcePhotos',
      {
        type : 'POST',
        data : {identity_id : identity_id}
      },
      function(data) {
        // {"photos" : [array:photo_object]}
        success_callback(data);
      },
      function(data) {
        // 400: param_error
        // 401: invalid_auth
      }
    );
  };


  // description: 获取某一张照片的全尺寸版本。
  var getPhoto = function(photo_id, success_callback) {
    return Api.request(
      'photox_getPhoto',
      {
        type : 'POST',
        data : {photo_id : photo_id}
      },
      function(data) {
        // {"photo" : [object:photo]}
        success_callback(data);
      },
      function(data) {
        // - 400: error_getting_photo
        // - 401: invalid_auth
        // - 403: not_authorized
        // - 404: photo_not_found
      }
    );
  };


  // description: 添加照片到 PhotoX。
  var add = function(photox_id, post_args, success_callback) {
    return Api.request(
      'photox_add',
      {
        type      : 'POST',
        resources : {photox_id : photox_id},
        data      : post_args
      },
      function(data) {
        // {"photo" : [object:photo]}
        success_callback(data);
      },
      function(data) {
        // - 400: error_getting_photo
        // - 401: invalid_auth
        // - 403: not_authorized
        // - 404: photo_not_found
      }
    );
  };


  // description: 用于从有相册功能的身份中添加照片
  // eg: Facebook, Flickr, Dropbox
  var addAlbum = function(photox_id, identity_id, album_id, success_callback) {
    return add(
      photox_id,
      {
        identity_id : identity_id,
        album_id    : album_id
      },
      success_callback
    );
  };


  // 用于从有照片流功能的身份中添加照片
  // eg: Instagram
  var addStream = function(photox_id, identity_id, min_id, max_id, success_callback) {
    return add(
      photox_id,
      {
        identity_id : identity_id,
        min_id      : min_id,
        max_id      : max_id
      },
      success_callback
    );
  };


  // 用于从 PhotoStream 等公开 feed 中加入照片
  // eg: PhotoStream
  var addFeed = function(photox_id, stream_id, success_callback) {
    return add(
      photox_id,
      {stream_id : stream_id},
      success_callback
    );
  };


  // description: 获取照片的 like 状态。
  var getLikes = function(photox_id, success_callback) {
    return Api.request(
      'photox_getLikes',
      {
        type      : 'POST',
        resources : {
          photox_id : photox_id
        }
      },
      function(data) {
        // {"likes" : [array:response_object]}
        success_callback(data);
      },
      function(data) {
        // - 400: param_error
        // - 401: invalid_auth
        // - 403: not_authorized
      }
    );
  };


  // description: Like 一张照片。
  var like = function(id, success_callback) {
    return Api.request(
      'photox_like',
      {
        type : 'POST',
        data : {id : id}
      },
      function(data) {
        // {"like" : [object:response]}
        success_callback(data);
      },
      function(data) {
        // - 400: error_responsing_photo
        // - 401: invalid_auth
        // - 403: not_authorized
        // - 404: photo_not_found
      }
    );
  };


  return {
    getPhotoX       : getPhotoX,
    getAlbums       : getAlbums,
    getSourcePhotos : getSourcePhotos,
    getPhoto        : getPhoto,
    addAlbum        : addAlbum,
    addStream       : addStream,
    addFeed         : addFeed,
    getLikes        : getLikes,
    like            : like
  };

});
