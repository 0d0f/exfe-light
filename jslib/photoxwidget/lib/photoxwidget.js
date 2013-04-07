define('photoxwidget', function (require) {
  'use strict';

  var request = require('api').request,
      R = require('rex'),
      Bus = require('bus'),
      //config_photo_providers = require('config').photo_providers,
      Store = require('store'),
      PhotoXPanel = require('photox'),
      Mnemosyne = require('mnemosyne'),
      Widget = require('widget'),
      getPhotoX = function (photox_id, done) {
        return request(
          'photox_getPhotoX',
          {
            resources : { photox_id : photox_id }
          },
          // {"photox" : [object:photox]}
          done
        );
      };

  var PhotoXWidget = Widget.extend({

    options: {

      template: ''
        + '<div class="widget photox-widget">'
          + '<div class="tab tab-0 hide">'
            + '<div class="table-wrapper">'
              + '<table cellspacing="0" cellpadding="0" border-spacing="0" border="0">'
                + '<tbody><tr></tr></tbody>'
              + '</table>'
            + '</div>'
            + '<div class="btn-open"><i class="ix-wall ix-wall-blue"></i></div>'
          + '</div>'
          + '<div class="tab tab-1 hide">'
            + '<i class="ix-wall ix-wall-gay"></i>Share photos, save memory.'
          + '</div>'
        + '</div>',

      tdTmp: ''
        + '<td><figure><img src="{{url}}" width="100" height="70" /></figure></td>',

      tdTmpMore: ''
        + '<td class="more"><figure>...</figure></td>',

      parentNode: null,

      onShowBefore: function () {
        this.emit('load');
      },

      onLoad: function () {
        this.load();
      }
    },

    init: function () {
      this.render();
    },

    render: function () {
      var options = this.options;
      this.parentNode = options.parentNode;
      this.srcNode = options.srcNode;
      this.crossId = options.crossId;

      delete options.parentNode;
      delete options.srcNode;
      delete options.crossId;

      this.limited = 10;
      this.$tr = this.element.find('tr');

      this.listen();
    },

    listen: function () {
      var self = this;

      Bus.on('update-photoxwidget', function () {
        self.load();
      });

      this.element.on('click.photoxwidget', '.btn-open, .tab-1', function (e) {
        e.preventDefault();
        e.stopPropagation();
        // TODO: 优化判断方法
        if ($('#photox-panel').size()) {
          return;
        }
        var user = Store.get('user');
        var identities = user.identities,
            //photo_providers = config_photo_providers,
            photo_providers = ['facebook', 'instagram', 'flickr', 'dropbox'],
            providers = photo_providers.slice(0),
            ips = [], i;
        R.each(identities, function (v) {
          i = R.indexOf(providers, v.provider);
          if (-1 !== i) {
            providers.splice(i, 1);
            ips.push(v.provider + ':' + v.id);
          }
        });
        ips.push('');
        providers.push('');
        // providers = 'flickr:1 facebook:0 dropbox:0'
        providers = ips.join(' ') + providers.join(':0 ');
        var photoxPanel = new PhotoXPanel({
          options: {
            parentNode: $('#app-tmp'),
            srcNode: $('.cross-photox'),
            crossId: Cross.id,
            providers: providers
          }
        });
        photoxPanel.show();
        self.photoxPanel = photoxPanel
      });

      this.element.on('click.photoxwidget', '.table-wrapper', function (e) {
        e.preventDefault();
        // TODO: 优化判断方法
        if ($('.mnemosyne-panel').size()) {
          return;
        }
        var mnemosyne = new Mnemosyne({
          options: {
            parentNode: $('#app-tmp'),
            srcNode: $('.table-wrapper'),
            crossId: Cross.id
          }
        });
        mnemosyne.show();
      });

      $(document.body).on('click.photoxwidget', function (e) {
        var $p = $('#photox-panel');
        if ($p.length
          && $p[0] !== e.target
          && !$.contains($p[0], e.target)) {
          e.preventDefault();
          e.stopPropagation();
          self.photoxPanel.hide();
          self.photoxPanel = null;
          return;
        }
      });
    },

    generate: function (photos, b) {
      var tdTmp = this.options.tdTmp,
          i = 0, l = photos.length,
          html = '';
      for (; i < l; ++i) {
        html += tdTmp.replace('{{url}}', photos[i].images.preview.url);
      }

      if (b) {
        html += this.options.tdTmpMore;
      }

      return html;
    },

    load: function () {
      var self = this,
          $tr = self.$tr,
          tabs = self.element.find('.tab'),
          tab0 = tabs.eq(0),
          tab1 = tabs.eq(1),
          limited = self.limited;
      if (this.defer) {
        this.defer.abort();
      }
      this.defer = getPhotoX(this.crossId, function (data) {
        var photos = data.photox.photos,
            l = photos.length,
            b = l > limited;
        if (l) {
          tab0.removeClass('hide');
          tab1.addClass('hide');
          if (b) { photos = photos.slice(0, limited); }
          $tr.html(self.generate(photos, b));
        } else {
          tab0.addClass('hide');
          tab1.removeClass('hide');
        }
      });
    },

    show: function () {

      this.emit('showBefore');

      this.element.appendTo(this.parentNode);

      this.emit('showAfter');

      return this;
    }

  });

  return PhotoXWidget;

});
