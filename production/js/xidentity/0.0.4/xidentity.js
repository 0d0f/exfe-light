/* jshint -W116 */
/* jshint -W030 */

define('xidentity', function (require) {
  'use strict';

  var $ = require('jquery');
  var Util = require('util');
  var Api = require('api');
  var Typeahead = require('typeahead');
  var Handlebars = require('handlebars');

  return Typeahead.extend({

    itemRender: function (item) {
      if (!this.itemTemplate) {
        this.template = Handlebars.compile(this.options.viewData.item);
      }
      item.external_provider = Util.printExtUserName(item);
      var itemHtml = $(this.template(item));
      delete item.external_provider;
      return itemHtml;
    },

    matcher: function (item) {
      var eun = item.external_username;
      return ~eun.toLowerCase().indexOf(this.query.toLowerCase());
    },

    focus: function () {
      var v = this.query = Util.trim(this.target.val());
      if (v) {
        //this.lookup();
        this.emit('search', v);
      } else {
        this.emit('nothing', v);
      }
    },

    select: function () {
      var active = this.$('.active'),
          val = active.data('value');

      if (!val) return false;

      this.target
        .val(this.updater(val))
        .change();

      this.emit('select', val);
      this.selecting = false;
      if (1 === this.element.find('li').length) {
        this.hide();
      }
    },

    mouseenter: function (e) {
      this.selecting = true;
      e.stopPropagation();
      e.preventDefault();
      this.$('.active').removeClass('active');
      $(e.currentTarget).addClass('active');
      this.select();
      return false;
    },

    tab: function () {
      return this.hide();
    },

    keypress: function (e, keyCode) {
      if (!this.isShown) return;

      keyCode = e.keyCode;
      switch (keyCode) {
      case 9: // tab
        //e.preventDefault();
        this.tab();
        break;
      //case 13: // enter
      //case 27: // escape
        //e.preventDefault();
        //break;

      case 38: // up arrow
        if (e.type !== 'keydown') break;
        e.preventDefault();
        this.selecting = true;
        this.prev();
        this.select();
        break;

      case 40: //down break
        if (e.type !== 'keydown') break;
        e.preventDefault();
        this.selecting = true;
        this.next()
        this.select();
        break;
      }

      e.stopPropagation();
    },

    options: {

      // ajax settings
      url: null,
      useCache: false,
      delay: 200,
      extraParams: {},
      autoClearResults: false,
      dataType: 'JSON',
      minLength: 1,

      viewData: {

        item: ''
          + '<li data-value="{{external_provider}}">'
            + '<i class="icon16-identity-{{provider}}"></i>'
            + '<span class="pull-left eun">{{external_username}}</span>'
            + '{{#isOAuthIdentity provider}}'
            + '<span class="pull-left provider">@{{capitalize provider}}</span>'
            + '{{/isOAuthIdentity}}'
          + '</li>'
      },

      onSelect: function (val) {
        this.emit('search', val);
      },

      // 清楚数据缓存
      onClearCache: function () {
        delete this.cache;
      },

      onSearch: function (q) {
        var that = this
          , options = that.options
          , res
          , items;

        that.cache || (that.cache = {});

        // `selecting`: up-down or mousemove
        if (!that.selecting && that.source && that.source.length) {
          items = $.grep(that.source, function (item) {
            return that.matcher(item);
          });

          if (0 === items.length) {
            that.isShown ? that.hide() : that;
          } else if (1 < items.length || q !== items[0].external_id) {
            that.render(items.slice(0)).show();
          }
        }

        if (that.timer) {
          clearTimeout(that.timer);
          // ajax loading
          that.target.next().addClass('hide');
        }

        if ((res = Util.parseId(q)).provider) {
          var identity = {
            provider: res.provider,
            external_username: res.external_username
          };

          that.timer = setTimeout(function () {
            clearTimeout(that.timer);
            search(q);
          }, options.delay);

          // falg: SIGN_IN SIGIN_UP VERIFY SET_PASSWORD
          var ajax = function (e) {
            that.ajaxDefer && that.ajaxDefer.readyState < 4 && that.ajaxDefer.abort();
            that.emit('autocomplete:beforesend', identity);
            if (options.useCache && that.cache[e]) that.emit('autocomplete:finish', that.cache[e]);
            else {
              that.ajaxDefer = Api.request('getRegistrationFlag'
                , {
                  data: identity,
                  beforesend: function () {
                    // ajax loading
                    that.target.next().removeClass('hide');
                  },
                  complete: function () {
                    // ajax loading
                    that.target.next().addClass('hide');
                  }
                }
                , function (data) {
                  if (e === that.target.val()) {
                    options.useCache && (that.cache[e] = data);
                    data.identity || (data.identity = identity);
                    that.emit('autocomplete:finish', data);
                  }
                }
              );
            }
          }

          var search = function (a) {
            if (a.length >= that.options.minLength) {
              ajax(a);
              that.searchValue = a;
            } else {
              that.emit('autocomplete:clear');
            }
          }

        } else {
          that.emit('autocomplete:finish', null);
        }
      }

    }

  });

});
