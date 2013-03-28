define('photox', function (require) {
  "use strict";

  var Api = require('api'),
      $ = require('jquery'),
      R = require('rex'),
      request = Api.request,
      Config = require('config'),
      PVS = Config.photo_providers,
      Dialog = require('dialog'),
      Store = require('store'),
      dialogs = require('xdialog').dialogs,
      Handlebars = require('handlebars'),
      proto;

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

  // NOTE: photox_id === cross_id
  var DataCenter = {

    // description: 获取一个 PhotoX 下的所有照片。
    getPhotoX: function (photox_id, done) {
      return request(
        'photox_getPhotoX',
        {
          resources : { photox_id : photox_id }
        },
        // {"photox" : [object:photox]}
        done
      );
    },

    // description: 获取所有身份/某个第三方身份的所有 albums & photos
    browseSource: function (identity_id, album_id, bcb, done, fail) {
      var options = {},
          data = {};
      if (identity_id) { data.identity_id = identity_id; }
      if (album_id) { data.album_id = album_id; }
      if (bcb) { options.beforeSend = bcb; }

      options.data = data;

      return request(
          'photox_borwseSource',
          options,
          // {"albums" : [array:album_object]}
          done,
          fail
        );
    },

    // description: 获取某一张照片的全尺寸版本。
    getPhoto: function (photo_id, done) {
      return request(
        'photox_getPhoto',
        {
          data : { photo_id : photo_id }
        },
        // {"photo" : [object:photo]}
        done
      );
    },

    // description: 添加照片到 PhotoX。
    add: function (photox_id, post_args, bcb, done) {
      var options = {
        type        : 'POST',
        resources   : { photox_id: photox_id },
        data        : post_args
      };
      if (bcb) {
        options.beforeSend = bcb;
      }
      return request(
        'photox_add',
        options,
        // {"photo" : [object:photo]}
        done
      );
    },

    // description: 用于从有相册功能的身份中添加照片
    // eg: Facebook, Flickr, Dropbox
    addAlbum: function (photox_id, identity_id, album_id, bcb, done) {
      return DataCenter.add(
        photox_id,
        {
          identity_id : identity_id,
          album_id    : album_id
        },
        bcb,
        done
      );
    },

    // 用于从有照片流功能的身份中添加照片
    // eg: Instagram
    addStream: function (photox_id, identity_id, min_id, max_id, bcb, done) {
      return DataCenter.add(
        photox_id,
        {
          identity_id : identity_id,
          min_id      : min_id,
          max_id      : max_id
        },
        bcb,
        done
      );
    },

    // 用于从 PhotoStream 等公开 feed 中加入照片
    // eg: PhotoStream
    addFeed: function (photox_id, stream_id, done) {
      return DataCenter.add(
        photox_id,
        { stream_id : stream_id },
        done
      );
    },

    // description: 获取照片的 like 状态。
    getLikes: function (photox_id, done) {
      return request(
        'photox_getLikes',
        {
          resources : { photox_id : photox_id }
        },
        // {"likes" : [array:response_object]}
        done
      );
    },

    // description: Like 一张照片。
    like: function (id, done) {
      return request(
        'photox_like',
        {
          type : 'POST',
          data : {id : id}
        },
        // {"like" : [object:response]}
        done
      );
    },

    delAlbum: function (photox_id, provider, album_id, bcb, done) {
      return request(
        'photox_del',
        {
          type        : 'POST',
          resources   : { photox_id : photox_id },
          data        : {
            provider    : provider,
            album_id    : album_id
          }
        },
        bcb,
        done
      );
    }
  };

  
  var XCache = {
    _: {}
  };

  XCache.init = function (keys) {
    var _ = this._, k;
    while ((k = keys.shift())) {
      _[k] = [];
    }
  };

  XCache.add = function (type, photo) {
    var pt = this._[type];
  };

  XCache.del = function (type, photo) {
  };


  /**
   * Paths Cache
   * Like the `cd` command in Shell
   */
  var FS = function () {};

  proto = FS.prototype;

  proto.has = function () {
    return !!this.uid && !!this.gid;
  };

  proto.find = function (path) {
    return R.indexOf(this.paths, path);
  };

  proto.setUid = function (iid) {
    this.uid = iid;
    return this;
  };

  proto.setGid = function (p) {
    this.gid = p;
    return this;
  }

  proto.cd = function (path, deep, cb) {
    if (!this.paths) { this.paths = []; }
    deep = deep || 1;
    this.paths = this.paths.slice(0, deep);
    var i = this.find(path);
    if (-1 === i) {
      this.paths.push(path);
    } else {
      this.paths = this.paths.slice(0, i + 1);
    }
    if (cb) { cb(path, this); }
    //console.dir(this.paths);
    return this;
  };

  proto.clear = function (cb) {
    if (this.paths) {
      this.paths.length = 0;
    }
    if (cb) { cb(); }
    return this;
  };

  proto.prev = function (cb) {
    var ps = this.paths;
    ps.pop();
    if (cb) { cb(ps[ps.length - 1], ps); }
  };


  /**
   * Nav-Tabs composition
   */
  var NavTabs = function (composition, selector, providers) {
    this.composition = composition;
    this.selector = selector;
    this.$element = composition.$(selector);
    this.providers = providers;
    this.append(providers);
  };

  proto = NavTabs.prototype;

  proto.liTmp = '<li data-provider="{{provider}}" data-iid="{{iid}}"><a href="#" class="hide-text""><i class="ix-provider ix-{{provider}}"></i></a></li>';

  proto.badgeTmmp = '<div class="badge badgex"></div>';

  proto.generate = function (providers) {
    var t = this.liTmp, h = '', p;
    providers = providers.split(' ');
    while ((p = providers.shift())) {
      p = p.split(':');
      h += t.replace(/\{\{provider\}\}/g, p[0])
          .replace(/\{\{iid\}\}/, p[1]);
    }
    return h;
  };

  proto.append = function (providers) {
    this.$element.append(this.generate(providers));
  };

  proto.switch = function (provider, keep) {
    var $e = this.$element,
        $l = $e.find('[data-provider="' + provider + '"]'),
        status = true;
    if (!$l.hasClass('active')) {
      $e.find('.active').removeClass('active');
      $l.addClass('active');
      status = false;
    } else {
      if (!keep) {
        $l.removeClass('active');
      }
    }
    return status;
  };

  proto.updateBadge = function (provider, n) {
    var $li = this.$element.find('> [data-provider="' + provider  + '"]'),
        $badge = $li.find('.badge'), t;
    if ($badge.length) {
      t = +$badge.text();
    } else {
      $badge = $(this.badgeTmmp);
      $li.append($badge);
      t = 0;
    }
    $badge.text(t + n);
  };

  /**
   * Dropbox
   * Breadcrumb composition
   */
  var Breadcrumb = function (composition, selector) {
    this.composition = composition;
    this.selector = selector;
    this.$element = composition.$(selector);

    this.initstatus = 1;
  };

  proto = Breadcrumb.prototype;

  proto.liTmp = '<li data-iid="{{iid}}" data-aid="{{aid}}"><a href="#">{{dir}}</a><span class="divider hidden"></span></li>';

  proto.displayHome = function (iid) {
    var identities = Store.get('user').identities,
        identity = R.find(identities, function (v) {
          if (v.id === iid) { return true; }
        });
    this.$element.append(this.generate(iid, '', identity.name + "'s Dropbox Photos"));
    this.initstatus = 0;
  };

  proto.generate = function (iid, aid, dir) {
    return this.liTmp
      .replace('{{iid}}', iid)
      .replace('{{aid}}', aid)
      .replace('{{dir}}', dir);
  };

  proto.show = function (iid) {
    var $e = this.$element;
    if (this.initstatus) {
      this.displayHome(iid);
    }

    this.del(1);

    if ($e.hasClass('hide')) {
      $e.removeClass('hide');
    }
  };

  proto.del = function (n) {
    var $last = this.$element.find('li').slice(n - 1);
    $last.nextAll().remove();
    //console.log($last);
    $last.find('.divider').addClass('hidden');
  };

  proto.add = function (iid, p) {
    var $li = $(this.generate(iid, p, p));
    this.$element.append($li)
    $li.prev().find('.divider').removeClass('hidden');
  };


  proto.hide = function () {
    this.$element.addClass('hide');
  };

  proto.toggle = function (status, iid) {
    status ? this.show(iid) : this.hide();
  };

  /**
   * Thumbnails composition
   */
  var Thumbnails = function (composition, selector) {
    this.composition = composition;
    this.selector = selector;
    this.$albums = composition.$(selector);
    this.$parent = this.$albums.parent();
  };

  proto = Thumbnails.prototype;

  proto.liAlbumTmp = '{{#each albums}}'
    + '<li data-provider="{{provider}}" data-iid="{{by_identity.id}}" data-aid="{{external_id}}" {{#if imported}}data-status="added"{{/if}}>'
      + '<div class="thumbnail">'
        + '<div class="badge album-badge badgex {{#unless imported}}hide{{/unless}}">√</div>'
        + '<div class="photo">'
          + '<div class="album-figure"></div>'
          + '{{#if artwork}}'
          + '<figure>'
            + '<img alt="" src="{{artwork}}" width="70" height="70" />'
          + '{{else}}'
          + '<figure class="placeholder ix-placehoder">'
          + '{{/if}}'
          + '</figure>'
        + '</div>'
        + '<h4 class="name">{{caption}}</h4>'
      + '</div>'
    + '</li>'
    + '{{/each}}';

  proto.liPhotoTmp = '{{#each photos}}'
    + '<li data-provider="{{provider}}" data-iid="{{by_identity.id}}" data-pid="{{external_id}}">'
      + '<div class="thumbnail">'
        + '<div class="badge album-badge badgex hide">√</div>'
        + '<div class="photo">'
          + '<div class="photo-figure"></div>'
          + '{{#if images.preview.url}}'
          + '<figure>'
            + '<img alt="" src="{{images.preview.url}}" width="70" height="70" />'
          + '{{else}}'
          + '<figure class="placeholder ix-placehoder">'
          + '{{/if}}'
          + '</figure>'
        + '</div>'
        + '<h4 class="name">{{caption}}</h4>'
      + '</div>'
    + '</li>'
    + '{{/each}}';

  proto.showAlbums = function () {
    var $albums = this.$albums,
        liAlbumTmp = this.liAlbumTmp,
        liPhotoTmp = this.liPhotoTmp,
        composition = this.composition;
    /*
    $.when(
      DataCenter.getPhotoX(this.cid),
      DataCenter.browseSource(null, null)
    )
    .done(function (ap, ab) {
      var d0 = ap[0],
          d1 = ab[0];
    });
    */
    DataCenter.getPhotoX(composition.cid, function (data) {
      //console.dir(data);
    });
    DataCenter.browseSource(
      null, null,
      function () {
        composition.emit('toggle-loading', true);
      },
      function (data) {
        composition.emit('toggle-loading', false);
        var at = Handlebars.compile(liAlbumTmp),
            ah = at(data),
            pt = Handlebars.compile(liPhotoTmp),
            ph = pt(data);
        $albums.html(ah + ph);
      },
      function () {
        composition.emit('toggle-loading', false);
      }
    );
  };

  proto.hideAlbums = function () {
    this.$albums.addClass('hide');
  };

  proto.switchByProvider = function (identityId, provider) {
    this.$albums
      .removeClass('hide')
      .children()
      .each(function () {
        var $li = $(this),
          p = $li.attr('data-provider');
        $li.toggleClass('hide', p !== provider);
      });
  };

  proto.showAllAlbums = function () {
    this.$albums
      .removeClass('hide')
      .find(' > .hide')
      .removeClass('hide');
  };

  proto.startUL = '<ul class="thumbnails photos hide">';
  proto.endUL = '</ul>'

  proto.generate = function (data) {
    var at = Handlebars.compile(this.liAlbumTmp),
        pt = Handlebars.compile(this.liPhotoTmp),
        ah = at(data),
        ph = pt(data);
    return this.startUL + ah + ph + this.endUL;
  };

  proto.showPhotos = function (data, status) {
    var i = data.albums.length | data.photos.length, $e;
    //if (i) {
      $e = $(this.generate(data));
      this.$albums.append($e);
      $e.removeClass('hide');
      this.$parent.append($e);
      if (status) {
        $e.find('.badge').removeClass('hide');
      }
    //}
  };

  proto.toggleBadge = function ($t) {
    var $b = $t.find('.badge');
    $b.toggleClass('hide');
    if ($b.hasClass('hide')) {
      // TODO: 删除临时 UL 菜单
      $t.find('.ulm').remove();
      $t.removeAttr('data-status');
    } else {
      // TODO: 临时 UL 菜单
      var s = 'position: absolute; z-index: 300; right: 0; color: #fff; background: #444;';
      $t.find('.thumbnail').prepend('<ul class="ulm" style="'+s+'"><li>Open</li><li class="import">Import</li></ul>');
      $t.attr('data-status', 'selected');
    }
  };

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
            + '<div class="loading hide"><img alt="" width="32" height="32" src="/static/img/loading.gif" /></div>'
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
      this.cid = options.crossId;
      this.providers = options.providers;
      delete options.providers;

      this.navTabs = new NavTabs(this, '.panel-header .nav-tabs', this.providers);
      this.breadcrumb = new Breadcrumb(this, '.panel-body .breadcrumb');
      this.thumbnails = new Thumbnails(this, '.panel-body .albums');
      this.fs = new FS();

      this.render();
      this.listen();
    },

    listen: function () {
      var self = this,
          fs = self.fs,
          cid = self.cid,
          element = self.element,
          navTabs = self.navTabs,
          thumbnails = self.thumbnails,
          breadcrumb = self.breadcrumb,
          $loading = self.element.find('.loading'),
          CLICK = 0,
          CLICKTIMER;

      element.on('click.photox', '.nav-tabs > li', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $that = $(this),
            iid = ~~$that.data('iid'), p = $that.data('provider');
        if (iid) {
          if (navTabs.switch(p)) {
            self.emit('show-albums');
            breadcrumb.toggle(false);
          } else {
            self.emit('switch-provider', iid, p);
          }
          thumbnails.$albums.nextAll('.photos').remove();
        } else {
          var dialog = new Dialog(dialogs.addidentity);
          dialog.render();
          dialog.element.find('.oauth-' + p).trigger('click');
        }
      });

      // Dropbox 
      element.on('click.photox', '.breadcrumb a', function (e) {
        e.preventDefault();
      });

      // Albums' click-event
      element.on('click.photox', '.thumbnails > li[data-aid]', function (e) {
        //console.log('click');
        e.preventDefault();
        var $t = $(this),
            iid = $t.data('iid'),
            p = $t.data('provider'),
            aid = $t.data('aid'),
            status = $t.attr('data-status');
        CLICK++;
        if (CLICK === 1) {
          CLICKTIMER = setTimeout(function () {
            thumbnails.toggleBadge($t);
            if (status === 'added') {
              DataCenter.delAlbum(
                cid, p, aid,
                function () {
                },
                function (data) {
                  $t.removeAttr('data-status');
                }
              );
            }
            CLICK = 0;
          }, 233);
        } else {
          clearTimeout(CLICKTIMER);
          navTabs.switch(p, true);

          // Dropbox's Breadcrumb
          if (p === 'dropbox') {
            breadcrumb.toggle(p === 'dropbox', iid);
            var aids = decodeURIComponent(aid).split('/'),
                len = aids.length;
            aid = aids[len - 1];
            if (!fs.has()) {
              fs.setUid(iid).setGid(p).cd('/');
            }
            //console.log(iid, aid, p, aids, status);
            fs.cd(aid, len, function (p) {
              breadcrumb.del(len);
              breadcrumb.add(iid, p);
            });
          }

          thumbnails.hideAlbums();
          DataCenter.browseSource(
            iid, aid,
            function () {
              self.emit('toggle-loading', true);
            },
            function (data) {
              self.emit('toggle-loading', false);
              thumbnails.showPhotos(data, status);
            }
          );
          CLICK = 0;
        }
      });

      // TODO: 临时 UL 菜单
      element.on('click.photox', '.ulm li.import', function (e) {
        var $e = $(this),
            $t = $e.parents('.thumbnail').parent('li'),
            iid = $t.data('iid'),
            p = $t.data('provider'),
            aid = $t.data('aid');
        e.preventDefault();
        e.stopPropagation();

        if (p === 'instagram') {
          $.when(DataCenter.browseSource(iid, aid))
            .then(function (data) {
              var ps = data.photos,
                  max_id = ps[0],
                  min_id = ps[ps.length - 1];
              DataCenter.addStream(cid, iid, min_id, max_id, null, function (data) {
                $e.parent().remove();
                $t.attr('data-status', 'added');
              });
            });
        } else {
          DataCenter.addAlbum(cid, iid, aid, null, function (data) {
            $e.parent().remove();
            $t.attr('data-status', 'added');
          });
        }

      });

      // Photos' click-event
      element.on('click.photox', '.thumbnails > li[data-pid]', function (e) {
      });

      self.on('show-albums', function () {
        thumbnails.showAllAlbums();
      });

      self.on('update-tabs-bage', function (provider, n) {
        tabs.updateBadge(provider, n);
      });

      self.on('toggle-loading', function (b) {
        $loading[(b ? 'remove' : 'add') + 'Class']('hide');
      });

      /**
       * @param {Number} iid identity-id
       * @param {String} p provider
       */
      self.on('switch-provider', function (iid, p) {
        if (p === 'dropbox') {
          fs.clear().setUid(iid).setGid(p).cd('/');
        }
        breadcrumb.toggle(p === 'dropbox', iid);
        thumbnails.switchByProvider(iid, p);
      });
    },

    showAfter: function () {
      var offset = this.srcNode.parent().offset();
      this.element.css({
        top: offset.top + 50,
        left: offset.left - 20
      });
      this.thumbnails.showAlbums();
    },

    destory: function () {
      this.element.off();
      this.element.remove();
      this._destory();
    }

  });

  return PhotoXPanel;
});

/* NOTES:
  - 打开 `phhotx-panel` 显示位置
    显示在 `Conversation` 上，最小宽度跟 `Converstaion` 一样
  - 第一次没有绑定任何 photo-identity, `albums` 区域显示什么
    有提示文字
  - ajax 操作失败
  - ajax abort
    eg: 比如选择一个 provider, 突然有进入 一个 album, 如何处理多异步回调情况
  - 没有对 Dropbox 深目录进行测试
  - Instagram 添加 folder min_id ~ max_id
*/
