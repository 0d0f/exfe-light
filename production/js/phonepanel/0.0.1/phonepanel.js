define('phonepanel', function (require) {
  "use strict";

  var $ = require('jquery'),
      proxy = $.proxy,
      extend = $.extend,
      Config = require('config'),
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
      areaInfos = require('countrycodes');

  var Panel = require('panel');

  var chooseCountry = function(index) {
    if (typeof areaInfos[index] !== 'undefined') {
      curCntry = index;
      if (rawPhone.length === areaInfos[curCntry].format_long) {
        $('#phone-panel .phonenumber').val(rawPhone.replace(
          areaInfos[curCntry].format_reg,
          areaInfos[curCntry].format_str
        ));
      }
    }
  };

  var PhonePanel = Panel.extend({

      options: {

          template: ''
          + '<div class="panel phone-panel" tabindex="-1" data-widget="panel" id="phone-panel">'
            //<div class="panel-header"></div>
            + '<div class="panel-body">'
              + '<div class="main-info">Please complete contact info:</div>'
              + '<div class="input-area">'
                + '<input class="countrycode" type="text" />'
                + '<input class="phonenumber" type="text" />'
              + '</div>'
              + '<div class="tips-area">'
                + '<div class="ta-countrycode"></div>'
                + '<div class="ta-phonenumber">Area code and local number</div>'
              + '</div>'
              + '<ol class="complete-list"></ol>'
              + '<div class="name-area">'
                + '<input class="name" type="text" placeholder="Enter contact name" />'
                + '<button class="xbtn-blue add" disabled="disabled">Add</button>'
              + '</div>'
            + '</div>'
            //<div class="panel-footer"></div>
          + '</div>'

        , parentNode: null

        , srcNode: null

      }

    , init: function () {
        var options = this.options,
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
      }

    , listen: function () {
        var self    = this, 
            element = this.element;
        element.on('keyup.phonepanel', '.countrycode', function(e) {
            switch (e.keyCode) {
                case 38: // up
                case 40: // down
                    return;
                case 13: // enter
                    var selected    = $('.complete-list li.selected');
                    var countryCode = ~~selected.attr('country-code');
                    if (typeof areaInfos[countryCode]) {
                        curCntry = countryCode;
                        $('#phone-panel .countrycode').val('+' + areaInfos[countryCode].country_code);
                        $('.tips-area .ta-countrycode').html(areaInfos[countryCode].short_name);
                     // format phone
                     // $('#phone-panel .phonenumber').val(rawPhone);
                        element.find('.tips-area').show();
                        element.find('.complete-list').slideUp();
                    }
                    return;
            }
            var found = '';
            var key   = $(this).val().toLowerCase().replace(/^\+/, '');
            if (key) {
                for (var i = 0; i < areaInfos.length; i++) {
                    if (areaInfos[i].country_code === key) {
                        found  = '<li country-code="' + i + '">'
                               +   '<div class="li-countrycode">+'
                               +     areaInfos[i].country_code
                               +   '</div>'
                               +   '<div class="li-countryname">'
                               +     areaInfos[i].country_name
                               +   '</div>'
                               +   '<div class="li-tips">'
                               +     areaInfos[i].support.join(' and ')
                               +   ' supported</div>'
                               + '</li>'
                               + found;
                        chooseCountry(i);
                    } else if (areaInfos[i].search_index.indexOf(key) !== -1) {
                        found += '<li country-code="' + i + '">'
                               +   '<div class="li-countrycode">+'
                               +     areaInfos[i].country_code
                               +   '</div>'
                               +   '<div class="li-countryname">'
                               +     areaInfos[i].country_name
                               +   '</div>'
                               +   '<div class="li-tips">'
                               +     areaInfos[i].support.join(' and ')
                               +   ' supported</div>'
                               + '</li>'
                    }
                }
            }
            element.find('.complete-list').html(found);
            if (found) {
                element.find('.tips-area').hide(); 
                element.find('.complete-list').slideDown();
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
        element.on('mouseover.phonepanel', '.complete-list li', function (e) {
            $(this).siblings().filter('.selected').toggleClass('selected', false);
            $(this).toggleClass('selected', true);
        });
        element.on('click.phonepanel', '.complete-list li', function (e) {
            var selected = $(this);
            var countryCode = ~~selected.attr('country-code');
            if (typeof areaInfos[countryCode]) {
                curCntry = countryCode;
                $('#phone-panel .countrycode').val('+' + areaInfos[countryCode].country_code);
                $('.tips-area .ta-countrycode').html(areaInfos[countryCode].short_name);
             // format phone
             // $('#phone-panel .phonenumber').val(rawPhone);
                element.find('.tips-area').show();
                element.find('.complete-list').slideUp();
            }
        });
        element.on('keyup.phonepanel', '.name', function(e) {
            if ($(this).val()) {
                element.find('.add').prop('disabled', false);
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
            } else {
                element.find('.add').prop('disabled', true);
            }
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
          rawPhone = srcNode.val().replace(/\-|\(|\)|\ /g, '');
          if (/^\+.*$/.test(rawPhone)) {
            for (var i = 0; i < areaInfos.length; i++) {
                if (areaInfos[i].regular.test(rawPhone)) {
                    curCntry = i;
                    rawPhone = rawPhone.replace(areaInfos[i].regular, '');
                    break;
                }
            }
          }
          $('#phone-panel .countrycode').val('+' + areaInfos[curCntry].country_code);
          $('.tips-area .ta-countrycode').html(areaInfos[curCntry].short_name);
          $('#phone-panel .phonenumber').val(rawPhone);
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
