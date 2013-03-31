define('photoxwidget', function (require) {
  'use strict';

  var request = require('api').request,
      R = require('rex'),
      config_photo_providers = require('config').photo_providers,
      Store = require('store'),
      PhotoXPanel = require('photox'),
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
          + '<div class="table-wrapper">'
            + '<table cellspacing="0" cellpadding="0" border-spacing="0" border="0">'
              + '<tbody><tr></tr></tbody>'
            + '</table>'
          + '</div>'
          + '<div class="btn-open"><i class="ix-wall"></i></div>'
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
      this.element.on('click.photoxwidget', '.btn-open', function (e) {
        e.preventDefault();
        e.stopPropagation();
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
        ips.push(''); providers.push('');
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

      $(document.body).on('click.photoxwidget', function (e) {
        var $p = $('#photox-panel');
        if ($p.length
          && $p[0] !== e.target
          && !$.contains($p[0], e.target)) {
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
          limited = self.limited;
      getPhotoX(this.crossId, function (data) {
        var photos = data.photox.photos,
            l = photos.length,
            b = l > limited;
        if (b) { photos = photos.slice(0, limited); }
        $tr.html(self.generate(photos, b));
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
