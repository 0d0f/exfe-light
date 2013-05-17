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

  $(function () {
    var $w = $(window),
        $d = $(document),
        $tb = $('.topbar'),
        $h = $('.home header'),
        $e = $('.exfe-logo'),
        $s = $('.xbtn-start'),
        $i = $('.intros'),
        $it = $('.introduction'),
        $its = $i.find('.intro').not($it),
        d, h, t, s;

    $w.off('*.home')
      .on('scroll.home', function () {
        var st = $w.scrollTop(), pt = st;
        if (st > 200) { pt = 200; }
        pt /= 200;
        $it.css('opacity', 0.5 + 0.5 * pt);
        $its.css('opacity', 0.2 + 0.8 * pt);

        var bounding = $s[0].getBoundingClientRect();

        $tb.toggleClass('hide', st <= 0);

        if (Math.floor(st + t) <= Math.floor(h - t - 36 - 30)) {
          s = 0;
          $s.css({
            position: 'absolute',
            top: h - t - 36 - 30
          });
        } else if ( bounding.top <= 60) {
          s = 1;
          $s.css({
            position: 'fixed',
            top: 60
          });
        }
      })
      .on('resize.home', function () {
        d = calculate($w.height(), 0);
        h = d[0];
        t = d[1];
        $tb.css('height', t + 130);
        $h.css('top', t);
        $e.css('top', (h - 600) / 2);
        if (!s) { $s.css('top', h - t - 36 - 30); }
        $i.css('top', h - 30);
      });

    $d.off('*.home')
      .on('click.home', '.exfe-logo, .xbtn-start', function () {
        var settings = {
          options: {
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
