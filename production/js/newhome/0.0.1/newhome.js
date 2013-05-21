define(function (require) {
  'use strict';

  var $ = require('jquery');

  // window height
  var minHeight = 680, maxHeight = 1200, distHeight = maxHeight - minHeight;

  var minW = 200, maxW = 220, distW = maxW - minW;

  // header (70 ~ 120) & start (100 ~ 150)
  var minTop = 70, maxTop = 120, distTop = maxTop - minTop;

  var calculate = function (h, t, s) {
    if (minHeight > h) {
      h = minHeight;
    } else if (h > maxHeight) {
      h = maxHeight;
    }

    t = minTop + distTop * (h - minHeight) / distHeight;
    s = (minW + distW * (h - minHeight) / distHeight) / maxW;

    return [h, t, s];
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
        $bloom = $('#bloom'),
        d, h, t, scale, s, ms, cx, cy, cr, dx, dy, tx, ty/*, rx, ry*/;

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
        scale = d[2];
        var et = (h - 460) / 2, st = floor(h - t - 36 - 30);
        $h.css('top', t);
        $e.css('top', et);
        if (!s) { $s.css('top', st); }
        $i.css('top', h - 30);
        ms = [et + 460 - (460 - 220) / 2, st];

        var matrix3d = 'scale(' + scale + ')';

        $e.css({
          '-webkit-transform': matrix3d,
          '-moz-transform':    matrix3d,
          '-ms-transform':     matrix3d,
          '-o-transform':      matrix3d,
          'transform':         matrix3d
        });

        var o = $e.offset();
        cx = o.left + 220;
        cy = o.top + 220;
        cr = min(cx, cy);

        $w.trigger('scroll.home');
      });

    $d.off('*.home')
      .on('mousemove.home touchstart.home touchmove.home', function (e) {
        e.preventDefault();
        var type = e.type, px, py;
        if (type === 'touchmove' || type === 'touchstart') {
          var touch = e.originalEvent.touches[0];
          px = touch.pageX;
          py = touch.pageY;
        } else {
          px = e.pageX;
          py = e.pageY;
        }

        dx = px - cx;
        dy = py - cy;

        tx = (dx < 0 ? 1 : -1) * min(Math.abs(dx), cr) / cr * 4;
        ty = (dy < 0 ? 1 : -1) * min(Math.abs(dy), cr) / cr * 4;

        var matrix3d = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + tx + ', ' + ty + ', 1, 1)';

        $bloom.css({
          '-webkit-transform': matrix3d,
          '-moz-transform':    matrix3d,
          '-ms-transform':     matrix3d,
          '-o-transform':      matrix3d,
          'transform':         matrix3d
        });
      })
      .on('click.home', '.introduction img', function () {
        $('html, body').animate({scrollTop: '+=100'}, 233);
      })
      .on('click.home', '#logo, .xbtn-start', function () {
        var settings = {
          options: {
            onShowAfter: function () {
              var $e = this.element;
              $e.css({top:  (h - 460) / 2});
              $e.find('#identity').focusend();
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
