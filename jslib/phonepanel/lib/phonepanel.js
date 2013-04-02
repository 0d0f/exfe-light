define('phonepanel', function (require) {
  "use strict";

  var $ = require('jquery'),
      proxy = $.proxy,
      extend = $.extend,
      Config = require('config'),
      Api    = require('api'),
      SPLITTER = /[\r\n]+/g,
      CR = '\r',
      $win = $(window),
      isIE = $.browser.msie,
      rawPhone  = '',
      curCntry  = 0,
      objPhone  = {
        'country_code' : '',
        'phone_number' : ''
      },
      last_get  = '',
      areaInfos = require('countrycodes');

  var Panel = require('panel');

  var chooseCountry = function(index, soft) {
    if (typeof areaInfos[index] !== 'undefined') {
      curCntry = index;
      if (!soft) {
          $('#phone-panel .countrycode').val('+' + areaInfos[curCntry].country_code);
      }
      $('.tips-area .ta-countrycode').html(areaInfos[curCntry].short_name);
      formatPhone();
      checkPhone();
    }
  };

  var formatPhone = function() {
    if (areaInfos[curCntry].format_long
     && areaInfos[curCntry].format_reg
     && areaInfos[curCntry].format_str
     && rawPhone.length === areaInfos[curCntry].format_long) {
      $('#phone-panel .phonenumber').val(rawPhone.replace(
        areaInfos[curCntry].format_reg,
        areaInfos[curCntry].format_str
      ));
    } else {
      $('#phone-panel .phonenumber').val(rawPhone);
    }
  }

  var checkPhone = function() {
    getIdentity();
    if ($('#phone-panel .countrycode').val() 
     && $('#phone-panel .name').val()
     && rawPhone) {
        $('#phone-panel .add').prop('disabled', false);
    } else {
        $('#phone-panel .add').prop('disabled', true);
    }
  }

  var escape = function(html, encode) {
    return html
          .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
  }

  var getIdentity = function() {
    var cur_get = '+' + areaInfos[curCntry].country_code + rawPhone;
    if (cur_get !== last_get) {
        Api.request(
            'getIdentity',
            {
                type : 'POST',
                data : {
                    identities : JSON.stringify([{
                        'provider'          : 'phone',
                        'external_username' : cur_get
                    }])
                }
            },
            function(data) {
                if (data && data.identities && data.identities.length && data.identities[0].connected_user_id > 0) {
                    $('#phone-panel .identity-avatar').attr('src', data.identities[0].avatar_filename).show();
                    $('#phone-panel .identity-name').html(escape(data.identities[0].name)).show();
                    $('#phone-panel .name').val(data.identities[0].name).hide();
                    $('#phone-panel .add').toggleClass('match', true);
                } else {
                    $('#phone-panel .identity-avatar').hide();
                    $('#phone-panel .identity-name').hide();
                    $('#phone-panel .name').val('').show();
                    $('#phone-panel .add').toggleClass('match', false); 
                }
            }
        );
        last_get = cur_get;
    }
  }

  var PhonePanel = Panel.extend({

      options: {

          template: ''
          + '<div class="panel phone-panel" tabindex="-1" data-widget="panel" id="phone-panel">'
            //<div class="panel-header"></div>
            + '<div class="panel-body">'
              + '<div class="main-info">Please complete contact info:</div>'
              + '<div class="clearfix input-area">'
                + '<input class="countrycode" tabindex="4" type="text" />'
                + '<input class="phonenumber" tabindex="5" type="text" />'
              + '</div>'
              + '<div class="tips-area">'
                + '<div class="ta-countrycode"></div>'
                + '<div class="ta-phonenumber">Area code and local number</div>'
              + '</div>'
              + '<ol class="clearfix complete-list"></ol>'
              + '<div class="name-area">'
                + '<input class="name" type="text" tabindex="2" placeholder="Enter contact name" />'
                + '<img class="identity-avatar"/>'
                + '<div class="identity-name"></div>'
                + '<button class="xbtn-blue add" tabindex="3" disabled="disabled">Add</button>'
              + '</div>'
            + '</div>'
            //<div class="panel-footer"></div>
          + '</div>'

        , parentNode: null

        , srcNode: null

      }

    , init: function () {
        var self    = this,
            options = this.options,
            element;
        this.render();
        element = this.element;
        for (var i = 0; i < areaInfos.length; i++) {
            areaInfos[i].regular    = new RegExp(areaInfos[i].regular);
            areaInfos[i].format_reg = areaInfos[i].format_reg
                                    ? new RegExp(areaInfos[i].format_reg)
                                    : '';
            if (areaInfos[i].short_name === 'US') {
                curCntry = i;
            }
        }
        this.listen();
        $(document.body).on('click.phonepanel', function (e) {
          var $p = $('#phone-panel');
          if ($p.length
            && $p[0] !== e.target
            && !$.contains($p[0], e.target)) {
            self.hide();
            $(document.body).off('click.phonepanel');
            return;
          }
        });
      }

    , listen: function () {
        var self    = this, 
            element = this.element;
        element.on('keyup.phonepanel', '.countrycode', function(e) {
            var makeItem = function(idx) {
                return '<li country-code="' + idx + '">'
                     +   '<div class="li-countrycode">+'
                     +     areaInfos[idx].country_code
                     +   '</div>'
                     +   '<div class="li-countryname">'
                     +     areaInfos[idx].country_name
                     +   '</div>'
                     +   '<div class="li-tips">'
                     +     areaInfos[idx].support.join(' and ')
                     +   ' supported</div>'
                     + '</li>';
            }
            switch (e.keyCode) {
                case 38: // up
                case 40: // down
                    return;
                case 13: // enter
                    var selected    = $('.complete-list li.selected');
                    var countryCode = ~~selected.attr('country-code');
                    if (typeof areaInfos[countryCode]) {
                        chooseCountry(countryCode);
                        element.find('.tips-area').show();
                        element.find('.complete-list').slideUp();
                    }
                    return;
            }
            var found = '';
            var match = -1;
            var key   = $(this).val().toLowerCase();
            if (key) {
                if (/^\+[0-9]*/.test(key)) {
                    for (var i = 0; i < areaInfos.length; i++) {
                        if (('+' + areaInfos[i].country_code) === key) {
                            found  = makeItem(i) + found;
                            match  = i;
                        } else if (('+' + areaInfos[i].search_index).indexOf(key) !== -1) {
                            found += makeItem(i);
                            match  = match === -1 ? i : match;
                        }
                    }
                } else {
                    for (i = 0; i < areaInfos.length; i++) {
                        if (areaInfos[i].country_code === key) {
                            found  = makeItem(i) + found;
                            match  = i;
                        } else if (areaInfos[i].search_index.indexOf(key) !== -1) {
                            found += makeItem(i);
                            match  = match === -1 ? i : match;
                        }
                    }
                }
            }
            element.find('.complete-list').html(found);
            if (found) {
                element.find('.tips-area').hide(); 
                element.find('.complete-list').slideDown();
                element.find('.complete-list li').eq(0).toggleClass('selected', true);
                chooseCountry(match, true);
            } else {
                element.find('.tips-area').show();
                element.find('.complete-list').slideUp();
            }
        });
        element.on('keydown.phonepanel', '.countrycode', function(e) {
            if (!element.find('.complete-list').html()) {
                return;
            }
            var selected  = element.find('.complete-list li.selected');
            var cmpltList = element.find('.complete-list');
            var curIndex  = ~~selected.index();
            var celHeight = 44;
            var maxHeight = celHeight * 3;
            var maxIndex  = element.find('.complete-list li').length - 1;
            var curScroll = cmpltList.scrollTop();
            switch (e.keyCode) {
                case 38: // up
                    event.preventDefault();
                    if (--curIndex < 0) {
                        curIndex = maxIndex;
                    }
                    break;
                case 40: // down
                    event.preventDefault();
                    if (++curIndex > maxIndex) {
                        curIndex = 0;
                    }
            }
            selected.toggleClass('selected', false);
            element.find('.complete-list li').eq(curIndex).toggleClass('selected', true);
            var curCellTop = curIndex * celHeight;
            var curScrlTop = curCellTop - curScroll;
            if (curScrlTop < 0) {
                cmpltList.scrollTop(curCellTop);
            } else if (curScrlTop + celHeight > maxHeight) {
                cmpltList.scrollTop(curCellTop + celHeight - maxHeight + 1);
            }
        });
        element.on('blur.phonepanel', '.countrycode', function(e) {
            chooseCountry(curCntry);
        });
        element.on('focus.phonepanel', '.countrycode', function(e) {
            $(this).css('z-index', '1');
            element.find('.phonenumber').css('z-index', '0');
        });
        element.on('focus.phonepanel', '.phonenumber', function (e) {
            element.find('.phonenumber').val(rawPhone);
            element.find('.complete-list').html('');
            element.find('.tips-area').show();
            element.find('.complete-list').slideUp();
            $(this).prop('tabindex', '1');
            $(this).css('z-index', '1');
            element.find('.countrycode').css('z-index', '0');
        });
        element.on('blur.phonepanel', '.phonenumber', function (e) {
            var strPhone = element.find('.phonenumber').val().replace(/\-|\(|\)|\ /g, '');
            if (/^[0-9]*$/.test(strPhone)) {
                rawPhone = strPhone;
            } else {
                rawPhone = '';
            }
            formatPhone();
            checkPhone();
            $(this).prop('tabindex', '5');
        });
        element.on('mouseover.phonepanel', '.complete-list li', function (e) {
            $(this).siblings().filter('.selected').toggleClass('selected', false);
            $(this).toggleClass('selected', true);
        });
        element.on('click.phonepanel', '.complete-list li', function (e) {
            var selected = $(this);
            var countryCode = ~~selected.attr('country-code');
            if (typeof areaInfos[countryCode]) {
                chooseCountry(countryCode);
                element.find('.tips-area').show();
                element.find('.complete-list').slideUp();
            }
        });
        element.on('keyup.phonepanel', '.name', function(e) {
            element.find('.complete-list').html('');
            element.find('.tips-area').show();
            element.find('.complete-list').slideUp();
        });
        element.on('keyup.phonepanel', '.name', function(e) {
            if ($(this).val()) {
                if (e.keyCode === 13) {
                    var phoneNumber = '+' + areaInfos[curCntry].country_code + rawPhone;
                    var name        = element.find('.name').val();
                    self.add({
                        provider          : 'phone',
                        external_id       : phoneNumber,
                        external_username : phoneNumber,
                        name              : name,
                        avatar_filename   : ExfeeWidget.api_url + '/avatar/default?name=' + name,
                    });
                    self.hide();
                }
            }
            checkPhone();
        });
        element.on('click.phonepanel', '.add', function(e) {
            var phoneNumber = '+' + areaInfos[curCntry].country_code + rawPhone;
            var name        = element.find('.name').val();
            self.add({
                provider          : 'phone',
                external_id       : phoneNumber,
                external_username : phoneNumber,
                name              : name,
                avatar_filename   : ExfeeWidget.api_url + '/avatar/default?name=' + name,
            });
            self.hide();
        });
      }

    , save: function () {
        this.$('.place-submit')
          .trigger('click.mappanel');
      }

    , showAfter: function () {
        var self    = this,
            srcNode = self.srcNode;
        if (srcNode) {
          var offset  = srcNode.offset(),
              element = self.element,
              width   = element.outerWidth(),
              height  = srcNode.outerHeight();
          element.css({
            left: this.oleft = offset.left,
            top:  this.otop  = offset.top + height
          });
          $('#phone-panel .identity-avatar').hide();
          $('#phone-panel .identity-name').hide();
          rawPhone = srcNode.val().replace(/\-|\(|\)|\ /g, '');
          var fixedCntry = curCntry;
          if (/^\+.*$/.test(rawPhone)) {
            for (var i = 0; i < areaInfos.length; i++) {
                if (areaInfos[i].regular.test(rawPhone)) {
                    rawPhone = rawPhone.replace(areaInfos[i].regular, '');
                    fixedCntry = i;
                    break;
                }
            }
          }
          chooseCountry(fixedCntry);
          element.find('.name').focus();
        }
      }

    , destory: function () {
        this.element.off();
        this.element.remove();
        this._destory();
      }
  });


  return PhonePanel;
});
