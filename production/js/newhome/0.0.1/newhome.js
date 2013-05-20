define(function (require) {
  'use strict';

  var $ = require('jquery');

  // window height
  var minHeight = 680, maxHeight = 1200, distHeight = maxHeight - minHeight;

  // header (70 ~ 120) & start (100 ~ 150)
  var minTop = 70, maxTop = 120, distTop = maxTop - minTop;

  var calculate = function (h, t) {
    if (minHeight > h) {
      h = minHeight;
    } else if (h > maxHeight) {
      h = maxHeight;
    }

    t = minTop + distTop * (h - minHeight) / distHeight;

    return [h, t];
  };

  var floor = Math.floor, min = Math.min;

  $(function () {
    var $w = $(window),
        $d = $(document),
        $mask = $('.top-mask'),
        $h = $('.home header'),
        $e = $('.exfe-logo'),
        $s = $('.login'),
        sStyle = $s[0].style,
        $i = $('.intros'),
        $it = $('.introduction'),
        $its = $i.find('.intro').not($it),
        d, h, t, s, ms;

    $w.off('*.home')
      .on('scroll.home', function () {
        var st = $w.scrollTop(),
            pt = min(st, 200) / 200,
            bd = $s[0].getBoundingClientRect(),
            top;

        $it.css('opacity', 0.5 + 0.5 * pt);
        $its.css('opacity', 0.2 + 0.8 * pt);

        // 直接改变 css#opacity 颜色会跳，使用 svg#fill-opacity 代替
        if (st < ms[0]) {
          $mask.attr('class', 'top-mask hide');
          $mask[0].style.fillOpacity = 0;
        } else if (ms[0] <= st) {
          $mask.attr('class', 'top-mask');
          $mask[0].style.fillOpacity = (min(st, ms[1]) - ms[0]) / (ms[1] - ms[0]);
        }

        if (bd.top < (top = 50)) {
          s = 1;
          sStyle.position = 'fixed';
          sStyle.top = top + 'px';
        } else if (bd.top === 50 && floor(st) <= (top = floor(h - t - 36 - 30)) - 50) {
          s = 0;
          sStyle.position = 'absolute';
          sStyle.top = top + 'px';
        }
      })
      .on('resize.home', function () {
        d = calculate($w.height(), 0);
        h = d[0];
        t = d[1];
        var et = (h - 600) / 2, st = floor(h - t - 36 - 30);
        $h.css('top', t);
        $e.css('top', et);
        if (!s) { $s.css('top', st); }
        $i.css('top', h - 30);
        ms = [et + 600 - (600 - 200) / 2, st];
        $w.trigger('scroll.home');
      });

    $d.off('*.home')
      .on('click.home', '.introduction img', function () {
        $('html, body').animate({scrollTop: '+=50'}, 233);
      })
      .on('click.home', '.exfe-logo, .xbtn-start', function () {
        var settings = {
          options: {
            onShowAfter: function () {
              var $e = this.element;
              $e.css({top: $w.height() / 2 + $w.scrollTop(), marginTop: - $e.height() / 2});
            },
            onHideAfter: function () {
              this.$('.modal-body').eq(0).css('opacity', 1);
              this.switchTabType = 'd00';

              // abort ajax
              if (this._oauth_) {
                this._oauth_.abort();
              }
              var $e = this.element;
              this.offSrcNode();
              this.destory();
              $e.remove();

              // @todo: 删除 `popmenu` 元素，暂时先放着
              $('.popmenu').remove();

              $('#js-modal-backdrop').addClass('hide').css('opacity', 0);
            },
            backdrop: false,
            viewData: {
              cls: 'modal-id home-dialog'
            }
          }
        };
        $('.sign-in')
          .data('dialog-settings', settings)
          .trigger('click.dialog.data-api')
          .data('dialog-settings', null);
      });

    $w.trigger('resize.home');
    $('.home').removeClass('hidden').addClass('start');
  });

});
