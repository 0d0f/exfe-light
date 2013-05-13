define('photox', function (require) {
  "use strict";

  var $ = require('jquery'),
      R = require('rex'),
      Bus = require('bus'),
      request = require('api').request,
      //PVS = window._ENV_.photo_providers,
      Dialog = require('dialog'),
      Store = require('store'),
      dialogs = require('xdialog').dialogs,
      Handlebars = require('handlebars'),
      proto;

  /**
   *  data-imported
   *    -2          full selected, but no submit
   *    -1          full selected
   *     0          no selected
   *    > 0         selected
   */

  Handlebars.registerHelper('px_imported', function (imported) {
    return imported > 0 ? imported : '<i class="ix-selected"></i>';
  });

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
    browseSource: function (photox_id, identity_id, album_id, bcb, done, fail) {
      var options = {},
          data = {};
      if (photox_id) { data.photox_id = photox_id; }
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
    addStream: function (photox_id, identity_id, ids, bcb, done) {
      return DataCenter.add(
        photox_id,
        {
          identity_id : identity_id,
          ids: ids
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
          data : { id : id }
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
          },
          beforeSend: bcb
        },
        done
      );
    },

    delPhotos: function (photox_id, provider, photo_ids, bcb, done) {
      return request(
        'photox_del',
        {
          type        : 'POST',
          resources   : { photox_id : photox_id },
          data        : {
            provider    : provider,
            photo_ids   : photo_ids 
          },
          beforeSend: bcb
        },
        done
      );
    }
  };


  /*
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
  */


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

  proto.liTmp = '<li{{class}} data-provider="{{provider}}" data-iid="{{iid}}"><a href="#" class="hide-text""><i class="ix-provider ix-{{provider}}"></i></a></li>';

  proto.badgeTmmp = '<div class="badge badgex"></div>';

  proto.generate = function (providers) {
    var t = this.liTmp, h = '', p;
    providers = providers.split(' ');
    while ((p = providers.shift())) {
      p = p.split(':');
      h += t.replace('{{class}}', +p[1] ? '' : ' class="no-oauth"')
        .replace(/\{\{provider\}\}/g, p[0])
        .replace('{{iid}}', p[1]);
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

  proto.liTmp = '<li data-iid="{{iid}}" data-eaid="{{aid}}"><a href="#">{{dir}}</a><span class="divider hidden"></span></li>';

  proto.displayHome = function (iid) {
    var identities = Store.get('user').identities,
        identity = R.find(identities, function (v) {
          if (v.id === iid) { return true; }
        });
    this.$element.append(this.generate(iid, '', identity.name + "'s Dropbox"));
    this.initstatus = 0;
  };

  proto.generate = function (iid, eaid, dir) {
    return this.liTmp
      .replace('{{iid}}', iid)
      .replace('{{eaid}}', eaid)
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
    + '<li data-provider="{{provider}}" data-iid="{{by_identity.id}}" data-eaid="{{external_id}}" data-imported="{{imported}}">'
      + '<div class="thumbnail">'
        + '<div class="badge album-badge badgex {{#unless imported}}hide{{/unless}}">{{{px_imported imported}}}</div>'
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
    + '<li data-provider="{{provider}}" data-iid="{{by_identity.id}}" data-imported="{{imported}}" data-epid="{{external_id}}" data-pid="{{id}}">'
      + '<div class="thumbnail">'
        + '<div class="badge album-badge badgex {{#unless imported}}hide{{/unless}}"><i class="ix-selected"></i></div>'
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
        //liPhotoTmp = this.liPhotoTmp,
        composition = this.composition,
        self = this,
        q = composition.q;
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
    //q.push(DataCenter.getPhotoX(composition.cid, function (data) {
      //console.dir(data);
    //}));
    q.push(DataCenter.browseSource(
      composition.cid,
      null, null,
      function () {
        composition.emit('toggle-loading', true);
      },
      function (data) {
        composition.emit('toggle-loading', false);
        var al = data.albums.length,
            pl = data.photos.length;
        if (al + pl) {
          var at = Handlebars.compile(liAlbumTmp),
              ah = at(data),
              ph = self.genPhotosHTML(data);
          $albums.html(ah + ph);
        } else {
          composition.emit('toggle-error', false, 'albums');
        }
      },
      function (data, code) {
        composition.emit('toggle-loading', false);
        if (code === 400) {
          composition.emit('toggle-error', false, 'albums');
        } else {
          composition.emit('toggle-error', false, 'ajax');
        }
      }
    ));
  };

  proto.genPhotosHTML = function (data) {
    var pt = Handlebars.compile(this.liPhotoTmp),
        ph = pt(data);
    return ph;
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

  proto.showPhotos = function (data) {
    var $e;
    $e = $(this.generate(data));
    this.$albums.append($e);
    $e.removeClass('hide');
    this.$parent.append($e);
      /*
      if (imported) {
        $e.find('.badge').removeClass('hide');
      }
      */
  };

  proto.toggleBadge = function ($t, status) {
    var $b = $t.find('.badge');
    $b.toggleClass('hide', status);
    if ($b.hasClass('hide')) {
      $t.attr('data-imported', '0');
    } else {
      $t.attr('data-imported', '-2');
      $b.html('<i class="ix-selected"></i>');
    }
  };

  proto.updateBadge = function (provider, i, s) {
    var $a = this.$albums
          .find('[data-provider="' + provider + '"]'),
        imported = ~~$a.attr('data-imported');

    if (s) {
      imported = i;
    } else {
      // Note: 删除时，imported = -1 情况，delete 接口应该返回
      if (imported !== -1) {
        imported += i;
      }
    }

    $a.attr('data-imported', imported);
    $a.find('.badge').text(imported).toggleClass('hide', !imported);
  };

  var Panel = require('panel');

  var PhotoXPanel = Panel.extend({

    options: {

      template: ''
        + '<div class="panel photox-panel" id="photox-panel">'
          + '<div class="clearfix panel-header">'
            + '<h3 class="pull-left title panel-title"><i class="ix-wall ix-wall-blue"></i>&nbsp;PhotoX</h3>'
            + '<ul class="pull-right nav nav-tabs"></ul>'
          + '</div>'
          + '<div class="panel-body">'
            + '<ul class="breadcrumb hide"></ul>'
            + '<div class="errors hide">'
              + '<div class="albums-error hide">'
                + '<p class="title">Oops, no photo to share.</p>'
                + '<p>Import photos from your account above.</p><br />'
                + '<p>Collects photos from a variety of your web accounts.</p>'
                + '<p>and share with everyone’s all together in the ·X·.</p>'
              + '</div>'
              + '<div class="photos-error hide">'
                + '<p class="title">Album empty.</p>'
              + '</div>'
              + '<div class="ajax-error hide">'
                + '<p class="title">Network error. Please try to reload.</p>'
              + '</div>'
            + '</div>'
            + '<div class="loading hide"><img alt="" width="32" height="32" src="/static/img/loading.gif" /></div>'
            + '<ul class="thumbnails albums"></ul>'
          + '</div>'
          + '<div class="panel-footer">'
            + '<div class="detail"><span class="selected-nums">0</span> pics selected</div>'
            + '<div class="icon-resize"></div>'
            + '<button class="xbtn-import">Import</button>'
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

      // ajax queues
      this.q = [];

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
          queue = self.q,
          $loading = self.element.find('.loading');

      element.on('click.photox', '.nav-tabs > li', function (e) {
        e.preventDefault();
        e.stopPropagation();
        self.killAjaxs();
        self.emit('toggle-loading', false);
        self.emit('toggle-error', true);
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
      /*
      element.on('click.photox', '.thumbnails > li[data-eaid]', function (e) {
        //console.log('click');
        e.preventDefault();
        var $t = $(this),
            iid = $t.data('iid'),
            p = $t.data('provider'),
            eaid = $t.data('aid'),
            imported = ~~$t.attr('data-imported');
        CLICK++;
        if (CLICK === 1) {
          CLICKTIMER = setTimeout(function () {
            thumbnails.toggleBadge($t);
            if (imported !== 0 && imported !== -2) {
              DataCenter.delAlbum(
                cid, p, eaid,
                function () { },
                function (data) {
                  $t.attr('data-imported', '0');
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
            var eaids = decodeURIComponent(aid).split('/'),
                len = eaids.length;
            eaid = aids[len - 1];
            if (!fs.has()) {
              fs.setUid(iid).setGid(p).cd('/');
            }
            //console.log(iid, eaid, p, aids, imported);
            fs.cd(eaid, len, function (p) {
              breadcrumb.del(len);
              breadcrumb.add(iGid, p);
            });
          }

          thumbnails.hideAlbums();
          DataCenter.browseSource(
            cid, iid, eaid,
            function () {
              self.emit('toggle-loading', true);
            },
            function (data) {
              self.emit('toggle-loading', false);
              var al = data.albums.length,
                  pl = data.photos.length,
                  t = al + pl;
              if (t) {
                thumbnails.showPhotos(data, imported);
              } else {
                self.emit('toggle-error', false, 'photos');
              }
            }
          );
          CLICK = 0;
        }
      });
      */
      // `longpress` event 选中
      element.on('mousedown.photox', '.thumbnails > li[data-eaid]', function (e) {
        e.preventDefault();
        var $t = $(this),
            d = $t.data(), iid = d.iid, p = d.provider, eaid = d.eaid,
            imported = ~~$t.attr('data-imported'),
            status = 0;

        var timer = setTimeout(function () {
          status = 1;
          thumbnails.toggleBadge($t);

          // ajaxing
          if (imported === -2) {
            return;
          }

          // delete
          if (imported !== 0 && imported !== -2) {
            DataCenter.delAlbum(
              cid, p, eaid, null,
              function () {
                $t.attr('data-imported', '0');

                // todo: 优化
                // 出发 `photox-widget` 更新
                Bus.emit('update-photoxwidget');
              }
            );
            return;
          }

          // add
          var cb = function () {
            $t.attr('data-imported', '-1');

            // todo: 优化
            // 出发 `photox-widget` 更新
            Bus.emit('update-photoxwidget');
          };

          if (p === 'instagram') {
            $.when(DataCenter.browseSource(cid, iid, eaid))
              .then(function (data) {
                var ps = data.photos,
                    ids = R.map(ps, function (v) {
                      return v.external_id;
                    });
                DataCenter.addStream(cid, iid, JSON.stringify(ids), null, cb);
              });
          } else {
            DataCenter.addAlbum(cid, iid, eaid, null, cb);
          }

        }, 987);

        $t.on('mouseup.photox', function () {
          clearTimeout(timer);
          $t.off('mouseup.photox');
          if (status) {
            return;
          }

          // cd folder -----------------------------
          navTabs.switch(p, true);

          // Dropbox's Breadcrumb
          if (p === 'dropbox') {
            breadcrumb.toggle(p === 'dropbox', iid);
            var eaids = decodeURIComponent(eaid).split('/'),
                len = eaids.length;
            eaid = eaids[len - 1];
            if (!fs.has()) {
              fs.setUid(iid).setGid(p).cd('/');
            }
            //console.log(iid, eaid, p, aids, imported);
            fs.cd(eaid, len, function (p) {
              breadcrumb.del(len);
              breadcrumb.add(iid, p);
            });
          }

          thumbnails.hideAlbums();
          queue.push(DataCenter.browseSource(
            cid, iid, eaid,
            function () {
              self.emit('toggle-loading', true);
            },
            function (data) {
              self.emit('toggle-loading', false);
              var al = data.albums.length,
                  pl = data.photos.length,
                  t = al + pl;
              if (t) {
                thumbnails.showPhotos(data, imported);
              } else {
                self.emit('toggle-error', false, 'photos');
              }
            },
            function (data, code, statusText) {
              if (!code && statusText === 'timeout') {
                self.emit('toggle-loading', false);
                self.emit('toggle-error', false, 'ajax');
              }
            }
          ));
          // ---------------------------------------
        });
      });


      // Photos' click-event
      element.on('click.photox', '.thumbnails > li[data-epid]', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $t = $(this),
            d = $t.data(), iid = d.iid, p = d.provider,
            epid = d.epid, pid = $t.attr('data-pid'),
            spid = '["' + pid + '"]',
            sepid = '["' + epid + '"]',
            imported = ~~$t.attr('data-imported');

        // ajaxing
        if (imported === -2) {
          return;
        }

        thumbnails.toggleBadge($t);
        // delete
        if (imported !== 0 && imported !== -2) {
          DataCenter.delPhotos(
            cid, p, spid,
            null,
            function (data) {
              var $tp = $t.parent(),
                  $ts = $tp.children(),
                  i = 0, photos = [];
              $t.attr('data-pid', 0);
              $t.attr('data-imported', 0);
              R.each(data.photox.photos, function (v) {
                if (p === v.provider) {
                  i++;
                  $t = $ts.filter('[data-epid="' + v.external_id + '"]');
                  if (!$t.size()) {
                    photos.push(v);
                  }
                  $t.attr('data-imported', 1);
                  $t.attr('data-pid', v.id);
                  $t.find('.badge').removeClass('hide');
                }
              });
              if (i) {
                $tp.append(thumbnails.genPhotosHTML({photos: photos}));
              }
              self.emit('update-albums-badge', p, i, true);

              // todo: 优化
              // 出发 `photox-widget` 更新
              Bus.emit('update-photoxwidget');
            }
          );
          return;
        }

        // add 现在只支持 `instagram` 单张
        if (p === 'instagram') {
          DataCenter.addStream(
            cid, iid, sepid,
            null,
            function (data) {
              var ps = data.photox.photos,
                  $tp = $t.parent(),
                  $ts = $tp.children(),
                  i = 0, photos = [];
              R.each(ps, function (v) {
                if (p === v.provider) {
                  i++;
                  $t = $ts.filter('[data-epid="' + v.external_id + '"]');
                  if (!$t.size()) {
                    d.photos.push(v);
                  }
                  $t.attr('data-imported', 1);
                  $t.attr('data-pid', v.id);
                  $t.find('.badge').removeClass('hide');
                }
              });
              if (i) {
                $tp.append(thumbnails.genPhotosHTML({photos: photos}));
                self.emit('update-albums-badge', p, i, true);
              }

              // todo: 优化
              // 出发 `photox-widget` 更新
              Bus.emit('update-photoxwidget');
            }
          );
        }
      });

      self.on('show-albums', function () {
        thumbnails.showAllAlbums();
      });

      //self.on('update-tabs-bage', function (provider, n) { tabs.updateBadge(provider, n); });

      self.on('toggle-loading', function (b) {
        $loading[(b ? 'remove' : 'add') + 'Class']('hide');
      });

      self.on('toggle-error', function (b, t) {
        var $es = element.find('.errors').toggleClass('hide', b);
        if (t) {
          $es.children().addClass('hide');
          if (t === 'albums') {
            $es.find('.albums-error').removeClass('hide');
          } else if (t === 'photos') {
            $es.find('.photos-error').removeClass('hide');
          } else {
            $es.find('.ajax-error').removeClass('hide');
          }
        }
      });

      self.on('update-albums-badge', function (provider, i, s) {
        thumbnails.updateBadge(provider, i, s);
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
      var offset = this.srcNode.offset();
      this.element.css({
        top: offset.top,
        left: offset.left - 20
      });
      this.thumbnails.showAlbums();
    },

    killAjaxs: function (a) {
      while ((a = this.q.shift())) {
        a.abort();
      }
    },

    destory: function () {
      this.killAjaxs();
      this.element.off();
      this.element.remove();
      this._destory();
    }

  });

  return PhotoXPanel;
});

/* NOTES:
  - 身份 re-work 情况，查看 failed_identities
  - 关掉 `PhotoX-Panel` 是否取消之前操作，还是有提示
  - 打开 `PhotoX-Panel` 显示位置
    显示在 `Conversation` 上，最小宽度跟 `Converstaion` 一样
  - 第一次没有绑定任何 photo-identity, `albums` 区域显示什么
    有提示文字
  - ajax 操作失败
  - ajax abort
    eg: 比如选择一个 provider, 突然有进入 一个 album, 如何处理多异步回调情况
  - 没有对 Dropbox 深目录进行测试
  - Instagram 添加 folder min_id ~ max_id
*/
