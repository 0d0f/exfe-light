/**
 * Exfe's DatePanel Widget.
 * 日期控件
 */
define('datepanel', function (require/*, exports, module*/) {
  "use strict";

  var $ = require('jquery')
    , isIE = $.browser.msie
    , ET = require('eftime')
    , locale = ET.locales[ET.locale]
    , months = locale.monthsShort
    , monthsShort = locale.monthsShort
    , createET = ET.create
    , toDate = ET.toDate
    , lead0 = ET.lead0
    , Util = require('util')
    , trim = Util.trim
    , Api = require('api')
    , R = require('rex');

  /**
   * DatePanel
   */
  var DatePanel = require('panel').extend({

      options: {
          template: ''
            + '<div class="panel date-panel" tabindex="-1" data-widget="panel" id="date-panel" editarea="date-panel">'
              + '<div class="panel-body">'
                + '<div class="pull-left date-container">'
                  + '<input type="text" name="date-string" id="date-string" autocomplete="off" />'
                  + '<div class="date-calendar" tabindex="-1">'
                    + '<ul class="unstyled clearfix" id="date-head"><li>Sun</li><li>Mon</li><li>Tue</li><li>Wed</li><li>Thu</li><li>Fri</li><li>Sat</li></ul>'
                    + '<div class="year"></div>'
                    + '<div class="full-month"></div>'
                    + '<div class="table-wrapper">'
                      + '<table class="table" id="date-table"><tbody></tbody></table>'
                    + '</div>'
                  + '</div>'
                + '</div>'

                + '<div class="pull-right date-timeline">'
                   //+ ' <div class="gathering">Gathering day</div> '
                   + ' <div class="fuzzy-time hide">'
                   + '   <ul class="unstyled time-cates">'
                   + '     <li data-cate="all-day">All-day</li>'
                   + '     <li class="hide" data-time="00:01" data-cate="late-night">Late-night</li>'
                   + '     <li class="hide" data-time="05:00" data-cate="dawn">Dawn</li>'
                   + '     <li class="hide" data-time="07:00" data-cate="breakfast">Breakfast</li>'
                   + '     <li class="hide" data-time="08:30" data-cate="morning">Morning</li>'
                   + '     <li class="hide" data-time="10:00" data-cate="brunch">Brunch</li>'
                   + '     <li class="hide" data-time="11:30" data-cate="lunch">Lunch</li>'
                   + '     <li class="hide" data-time="13:00" data-cate="noon">Noon</li>'
                   + '     <li class="hide" data-time="14:30" data-cate="afternoon">Afternoon</li>'
                   + '     <li class="hide" data-time="16:00" data-cate="tea-break">Tea-break</li>'
                   + '     <li class="hide" data-time="17:30" data-cate="off-work">Off-work</li>'
                   + '     <li class="hide" data-time="19:00" data-cate="dinner">Dinner</li>'
                   + '     <li class="hide" data-time="20:30" data-cate="evening">Evening</li>'
                   + '     <li class="hide" data-time="22:00" data-cate="night">Night</li>'
                   + '     <li class="hide" data-time="24:00" data-cate="late-night">Late-night</li>'
                   + '   </ul>'
                   + ' </div>'
                   + ' <div class="times-wrapper">'
                   + '   <div class="times"></div>'
                   + ' </div>'
                + '</div>'
              + '</div>'
            + '</div>'

        , parentNode: null

        , srcNode: null

        // eftime object
        , eftime: null
      }

    , init: function () {
        var options = this.options;

        this.render();

        // saved origin eftime.
        this.originEftime = options.eftime;

        // referrer Cross.time.
        this.eftime = Cross.time;

        this.dateObj = toDate(this.eftime);
        delete options.eftime;

        // get locale timezone.
        this.timezone = getTimezone();

        this.dateInput = new DateInput(this, '#date-string');
        this.calendarTable = new CalendarTable(this, '.date-calendar');
        this.timeline = new Timeline(this, '.date-timeline');

        this.listen();
      }

    , initComponents: function () {
        var eftime = this.eftime
          , date = this.dateObj.date;
        this.calendarTable.refresh(date);
        if (0 === this.originEftime.outputformat) {
          this.calendarTable.addCursorStyle();
          this.calendarTable.select();
        }
        this.timeline.refresh(this.eftime);
        this.dateInput.change(eftime.origin || date.text);
        this.dateInput.$element.focusend();
      }

    , listen: function () {
        this.element.on('keydown.datepanel', proxy(this.keydown, this));
        // save
        this.on('save', this.save);
        // tab move to calendarTable
        this.on('tmt-ct', this.tmtCT);
        // tab move to dateInput
        this.on('tmt-di', this.tmtDI);
        // refresh from dateInput
        this.on('rf-di', this.rfDI);
        // refresh from timeline
        this.on('rf-tl', this.rfTL);
        // refresh from calendarTable
        this.on('rf-ct', this.rfCT);
      }

    , save: function (/*eft*/) {
        $('body').trigger('click');
      }

    , revert: function () {
        $.extend(true, this.eftime, this.originEftime);
      }

    , tmtCT: function () {
        var $e = this.calendarTable.$element;
        setTimeout(function () { $e.focus(); }, 0);
      }

    , tmtDI: function () {
        var $e = this.dateInput.$element;
        setTimeout(function () { $e.focus(); }, 0);
      }

    , rfDI: function (eft) {
        $.extend(true, this.eftime, eft);
        this.dateObj = toDate(eft);
        this.calendarTable.refresh(this.dateObj.date);
        if (0 === this.eftime.outputformat) {
          this.calendarTable.addCursorStyle();
          this.calendarTable.select(true);
        }
        this.timeline.select(eft);
      }

      //            time, time_word
    , rfTL: function (t, tw) {
        var eftime = this.eftime
          , date = this.dateObj.date
          , s = '' , ts;
        eftime.begin_at.time = '';
        if (t) {
          ts = t.split(':');
          date.setHours(ts[0] || 0);
          date.setMinutes(ts[1] || 0);
          date.setSeconds(ts[2] || 0);
          eftime.begin_at.time = date.getUTCHours()
            + ':' + date.getMinutes()
            + ':' + date.getSeconds();
        }
        eftime.begin_at.time_word = tw;
        s = t || tw;
        if (eftime.outputformat) {
          eftime.outputformat = 0;
          eftime.origin = s;
        }
        else {
          if (eftime.begin_at.date) {
            s = dateFormat(date) + ' ' + s;
          }
          eftime.origin = s;
        }
        this.dateInput.change(eftime.origin);
      }

    , rfCT: function (ds) {
        var ef = this.eftime
          , date = this.dateObj.date
          , dsUTC = ''
          , dsArray = ds.split('-');
        date.setFullYear(dsArray[0]);
        date.setMonth(dsArray[1] - 1);
        date.setDate(dsArray[2]);
        dsUTC = date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCDate();
        ef.begin_at.date = dsUTC;
        if (ef.outputformat) {
          ef.outputformat = 0;
          ef.origin = ds;
        }
        else {
          var t = '';
          if (ef.begin_at.time) {
            t = lead0(date.getHours()) + ':' + lead0(date.getMinutes());
          }
          else {
            t = ef.begin_at.time_word;
            ef.begin_at.date = ds;
          }
          if (t) {
            t = ds + ' ' + t;
          } else {
            t = ds;
          }
          ef.origin = t;
        }
        this.dateInput.change(ef.origin);
      }

    , keydown: function (e) {
        var self = this
            , altKey = e.altKey
            , ctrlKey = e.ctrlKey
            , shiftKey = e.shiftKey
            , metaKey = e.metaKey
            , kc = e.keyCode;
          // escape
          if (27 === kc) {
            self.revert();
            self.emit('save');
          }
          else if (13 === kc && (!(altKey | shiftKey) & (ctrlKey | metaKey))) {
            self.emit && self.emit('save');
          }
      }

    , showAfter: function () {
        var srcNode = this.srcNode;
        if (srcNode) {
          var offset = srcNode.offset()
            , element = this.element
            , width = element.outerWidth();
          element.css({
              left: offset.left - width - 15
            , top: offset.top
          });
        }
        this.initComponents();
      }

    , destory: function () {
        this.element.off();
        this.element.remove();
        this._destory();
      }

  });


  /**
   * DateInput
   */
  var DateInput = function (component, selector) {
    this.component = component;
    this.$container = component.element;
    this.tz = component.timezone;
    this.selector = selector;
    this.$element = component.$(selector);

    this.listen();
  };

  DateInput.prototype = {

      listen: function () {
        var $container = this.$container
          , selector = this.selector;

        $container
          // blur focus
          .on('keydown.datepanel', selector, proxy(this.keydown, this))
          .on('keypress.datepanel', selector, proxy(this.keypress, this))
          .on('keyup.datepanel', selector, proxy(this.keyup, this));
      }

    , keyHandler: function (e) {
        var component = this.component
          , kc = e.keyCode;

        switch (kc) {
          case 9: // tab
            e.preventDefault();
            // ct: calendarTable
            component.emit('tmt-ct');
            break;
          case 13:
            e.preventDefault();
            component.emit('save');
            break;
          case 40: // down
            // if the cursor in the last, tab to PlacesList
            var v = this.$element.val()
              , l = v.length
              , ele = this.$element[0]
              , end = selectionEnd(ele);
            if (l === end) {
              e.preventDefault();
              // ct: calendarTable
              component.emit('tmt-ct');
            }
            break;
        }
      }

    , keydown: function (e) {
        this.suppressKeyPressRepeat = !!~R.indexOf([9, 13, 40], e.keyCode);
        this.keyHandler(e);
      }

    , keypress: function (e) {
        if (this.suppressKeyPressRepeat) {
          // return false, /* Firefox 会禁用按键；webkit 则不会。wtf? */
          return;
        }
        this.keyHandler(e);
      }

    , keyup: function (e) {
        e.stopPropagation();
        e.preventDefault();
        switch (e.keyCode) {
          case  9: // tab
          case 13: // enter
          case 16: // shift
          case 17: // ctrl
          case 18: // alt
          case 27: // escape
          case 37: // left
          case 38: // up
          case 39: // right
          case 40: // down
            break;
          default:
            this.lookup();
        }
      }

    , lookup: function (/* e */) {
        var self = this
          , component = self.component
          , s = trim(self.$element.val());

        if (self.befer) {
          self.befer.abort();
          delete self.befer;
        }

        if ('' === s) {
          component.emit('rf-di', createET());
          return;
        }

        self.befer = Api.request('recognize'
          , {
                type: 'POST'
              , data: {
                    time_string: s
                  , timezone: self.tz
                }
            }
          , function (data) {
              component.emit('rf-di', data.cross_time);
            }
        );
      }

    , change: function (s) {
        this.$element.val(s);
      }
  };


  /**
   * CalendarTable
   */
  var CalendarTable = function (component, selector) {
    this.component = component;
    this.$container = component.element;
    this.selector = selector;
    this.$element = component.$(selector);
    this.today = new Date();
    this.todayString = dateFormat(this.today);

    // ViewPort
    // coords: [0, 0]
    this.cx = 0;
    this.cy = 0;
    // rows
    this.vpr = 3;
    // height of the row
    this.vph = 44;
    this.len = 0;

    // Elements
    this.divTmp = '<div class="tw"><span class="m hide">{{m}}</span><span class="d">{{d}}</span></div>';
    this.$y = this.$element.find('.year');
    this.$m = this.$element.find('.full-month');
    this.$tw = this.$element.find('.table-wrapper');
    this.$tb = this.$tw.find('tbody');

    this.inited = true;
    this.enable = false;
    this.listen();
  };

  CalendarTable.prototype = {

      init: function (date) {
        var r = this.vpr
          , h = this.vph
          , y = date.getFullYear()
          , m = date.getMonth()
          , d = date.getDate()
          , dt = date.getDay();

        date = new Date(y, m, d - dt - 21);

        this.startDate = dateFormat(date);
        this.genNext(date);
        this.genNext(date);
        this.genNext(date);
        this.endDate = dateFormat(date);
        this.cx = dt;
        this.cy = r;
        this.scrollTop(r * h);
        this.$trs = this.$tb.find('tr');
        if (this.inited) {
          this.st = this.$tw.prop('scrollHeight') - this.$tw.outerHeight();
          this.inited = false;
        }
      }

    , refresh: function (date) {
        this.$trs = this.$cursor = null;
        this.selectedDate = '';
        this.len = 0;
        this.$tb.empty();
        this.init(date);
      }

    , getSelectedDate: function () {
        return this.selectedDate || this.todayString;
      }

    , listen: function () {
        var $container = this.$container
          , selector = this.selector

        $container
          .on('blur.datepanel', selector, proxy(this.blur, this))
          .on('focus.datepanel', selector, proxy(this.focus, this))
          .on('keydown.datepanel', selector, proxy(this.keydown, this))
          .on('keypress.datepanel', selector, proxy(this.keypress, this))
          .on('keyup.datepanel', selector, proxy(this.keyup, this))
          .on('click.datepanel', selector + ' td', proxy(this.clickDate, this))
          .on('mouseenter.datepanel', selector + ' td', proxy(this.mouseenterDate, this))

        this.$tw.on('scroll.datepanel', proxy(this.scroll, this));
      }

    , scroll: function (e) {
        if (this.enable) { true; }
        e.stopPropagation();
        e.preventDefault();
        var $tw = this.$tw
          , t = $tw.scrollTop()
          , b = false
          , $y = this.$y
          , $m = this.$m;

        if (0 === t || this.st === t) {
          this.enable = true;
          this[0 === t ? 'mpageUp' : 'mpageDown']();
          this.$tw.scrollTop(this.vph * this.vpr);
          b = true;
        }
        this.updateYearMonth();
        $y.toggleClass('hide', b);
        $m.toggleClass('hide', b);
      }

    , updateYearMonth: function () {
        if (this.$cursor) {
          var d = datefun(this.$cursor.data('date'));
          this.$y.text(d.getFullYear());
          this.$m.text(months[d.getMonth()]);
        }
      }

    , delCursorStyle: function () {
        if (this.$cursor) { this.$cursor.removeClass('hover'); }
      }

    , addCursorStyle: function () {
        this.$cursor = this.$trs
          .eq(this.cy)
          .find('td')
          .eq(this.cx)
          .addClass('hover');
      }

    , blur: function () { this.delCursorStyle(); }

    , focus: function () { this.addCursorStyle(); }

    , scrollTop: function (s) { this.$tw.scrollTop(s); }

    , keyHandler: function (e) {
        var self = this
          , component = this.component
          , kc = e.keyCode;
        switch (kc) {
          case 9: // tab
            e.preventDefault();
            component.emit('tmt-di');
            break;
          case 37: // left
            e.preventDefault();
            self.move('left');
            break;
          case 38: // top
            e.preventDefault();
            self.move('top');
            break;
          case 39: // right
            e.preventDefault();
            self.move('right');
            break;
          case 40: // down
            e.preventDefault();
            self.move('down');
            break;
          case 33: // page up:    mac fn + ↑
            e.preventDefault();
            self.move('pageUp');
            break;
          case 34: // page down:  mac fn + ↓
            e.preventDefault();
            self.move('pageDown');
            break;
          case 13: // enter
            e.preventDefault();
            break;
          case 32: // spacing
            e.preventDefault();
            self.spacing();
            break;
          case 35: // end:        mac fn + →
          case 36: // home:       mac fn + ←
            break;
        }
      }

    , keydown: function (e) {
        this.suppressKeyPressRepeat = !!~R.indexOf([9, 13, 32, 33, 34, 35, 36, 37, 38, 39, 40], e.keyCode);
        this.keyHandler(e);
      }

    , keypress: function (e) {
        if (this.suppressKeyPressRepeat) {
          return false;
        }
        this.keyHandler(e);
      }

    , keyup: function (e) {
        e.stopPropagation();
        e.preventDefault();
      }

    , clickDate: function (e) {
        e.preventDefault();
        this.spacing();
      }

    , spacing: function () {
        if (this.selectedDate) {
          this.$tb.find('td[data-date="' + this.selectedDate + '"]')
            .removeClass('selected');
        }
        this.select();
      }

    , select: function (enable) {
        var date = this.selectedDate = this.$cursor.data('date');
        this.$cursor.addClass('selected');
        this.updateYearMonth();
        if (!enable) {
          this.component.emit('rf-ct', date);
        }
      }

    , mouseenterDate: function (e) {
        e.preventDefault();
        this.delCursorStyle();
        var $td = $(e.currentTarget)
          , $tr = $td.parent();
        this.cx = $td.index();
        this.cy = $tr.index();
        this.addCursorStyle();
      }

    , move: function (type) {
        this.enable = true;
        this.delCursorStyle();
        this['m' + type]();
        this.addCursorStyle();
        this.enable = false;
      }

      // move to left
    , mleft: function () {
        if (0 === this.cx--) {
          this.cx = 6;
          this.mtop();
        }
      }

      // move to top
    , mtop: function () {
        if (0 === this.cy--) {
          this.delTail3();

          var d = datefun(this.startDate, -21);
          this.startDate = dateFormat(d);
          this.genPrev(d);
          this.$trs = this.$tb.find('tr');
          this.cy = 2;
          this.$tw.scrollTop(this.vph * this.cy);
        }
        var t = this.$tw.scrollTop();
        t = Math.round(t / this.vph) * this.vph;
        if (this.cy * this.vph < t) {
          this.$tw.scrollTop(t -= this.vph);
        }
      }

      // move to right
    , mright: function () {
        if (6 === this.cx++) {
          this.cx = 0;
          this.mdown();
        }
      }

      // move to down
    , mdown: function () {
        if (this.len === ++this.cy) {
          this.delHead3();

          var d = datefun(this.endDate, 0);
          this.genNext(d);
          this.endDate = dateFormat(d);
          this.$trs = this.$tb.find('tr');
          this.cy = 7; // this.len - 2
          this.$tw.scrollTop(this.vph * 5);
        }
        var t = this.$tw.scrollTop();
        t = Math.round(t / this.vph) * this.vph;
        if (this.cy * this.vph > t + this.vph * (this.vpr - 1)) {
          this.$tw.scrollTop(t += this.vph);
        }
      }

    , mpageUp: function () {
        this.delTail3();

        var d = datefun(this.startDate, -21);
        this.startDate = dateFormat(d);
        this.genPrev(d);
        this.$trs = this.$tb.find('tr');
      }

    , mpageDown: function () {
        this.delHead3();

        var d = datefun(this.endDate, 0);
        this.genNext(d);
        this.$trs = this.$tb.find('tr');
        this.endDate = dateFormat(d);
      }

      //                    start date
    , generateHTML: function (startDate) {
        var r = this.vpr
          , ts = this.todayString
          , sd = this.selectedDate
          , divTmp = this.divTmp
          , tb = ''
          , i = 0
          , day;

        this.len += r;

        for (; i < r; ++i) {
          var j = 0, tr = '<tr>', td = ''
            , fs, isToday, isSelected, cls;

          for (; j < 7; ++j) {
            cls = '';
            fs = dateFormat(startDate);

            isToday = fs === ts;
            isSelected = fs === sd;

            if (isToday) { cls = 'today' }
            if (isSelected) { cls += (cls.length ? ' ' : '') + 'selected'; }

            td += '<td data-date="' + fs + '"' + (cls.length ? ' class="' + cls + '"' : '') + '>';
            day = startDate.getDate();
            td += divTmp
                    .replace('{{m}}', monthsShort[startDate.getMonth()])
                    .replace('{{d}}', isToday ? 'Today': day);
            td += '</td>';
            startDate.setDate(day + 1);
          }

          tr += td + '</tr>';
          tb += tr;
        }
        return tb;
      }

    , genPrev: function (date) {
        this.$tb.prepend(this.generateHTML(date));
      }

    , genNext: function (date) {
        this.$tb.append(this.generateHTML(date));
      }

      // delete head 3 tr
    , delHead3: function () {
        this.startDate = this.$trs.eq(0).find('td').eq(0).data('date');
        this.$trs.eq(0).remove();
        this.$trs.eq(1).remove();
        this.$trs.eq(2).remove();
        this.len -= 3;
      }

      // delete tail 3 tr
    , delTail3: function () {
        this.endDate = this.$trs.eq(this.len - 3).find('td').eq(0).data('date');
        this.$trs.eq(--this.len).remove();
        this.$trs.eq(--this.len).remove();
        this.$trs.eq(--this.len).remove();
      }
  };


  /**
   * Timeline
   */
  var Timeline = function (component, selector) {
    this.component = component;
    this.$container = component.element;
    this.selector = selector;
    this.$element = component.$(selector);

    // Elements
    this.divTmp = '<div class="time-item{{class}}" data-time="{{dt}}"><time>{{t}}</time></div>';
    this.$tw = this.$element.find('.times-wrapper');
    this.$tc = this.$element.find('.times');
    this.$ft = this.$element.find('.fuzzy-time');
    this.$ts = this.$ft.find('.time-cates > li[data-time]');
    this.ts = R.map(this.$ts, function (e) {
      return $(e).data('time');
    });

    // mouse point(x, y)
    this.x = 0;
    this.y = 0;
    this.px = 0;
    this.py = 0;
    // lables length
    this.l = 9;
    // head
    this.hh = 7;
    // tail
    this.th = 7;

    // hour, minutes
    this.dh = 0;
    this.dm = 0;

    // true: on scroll, not trigger after functions
    this.status = false;
    // $cursor show/hide
    this.isHide = true;

    this.listen();
  };

  Timeline.prototype = {

      //              eftime
      select: function (eft) {
        this.enable = true;
        this.removeSelected();
        if (eft
            && 0 === eft.outputformat
            && eft.begin_at.time) {
          var d = toDate(eft).date
            , h = d.getHours()
            , m = d.getMinutes()
            , n = Math.round(h / 15) * 15
            , t;
            d.setMinutes(n);
            this.selectedTime = lead0(h) + ':' + lead0(m);
            this.$selected = this.$tc
              .find('[data-time="' + this.selectedTime + '"]').eq(0);

          if (0 === this.$selected.length) {
            this.$selected = this.createNormalItem(h, m, Math.floor((h + m / 60) * this.h * (60 / 15)));
          }
          this.$selected.removeClass('time-hover');
          this.$selected.addClass('selected')

          t = parseInt(this.$selected.css('top'), 10);

          // moved to middle position
          this.$tw.scrollTop(Math.max(0, t - this.vph / 2));
        }
        else {
          this.$tw.scrollTop(180);
        }
        this.enable = false;
      }

    , refresh: function (eft) {
        this.generateHTML();
        // real-height
        this.rh = this.$tw.prop('scrollHeight');
        // item height
        this.h = Math.floor((this.rh - this.hh - this.th) / (this.l - 1) / 12);
        // time / height
        this.a = Math.round(60 / 4 / this.h);
        var offset = this.$tw.offset();
        this.ox = offset.left;
        this.oy = offset.top;
        this.st = this.$tw.scrollTop();
        // ViewPort Height
        this.vph = this.$tw.innerHeight();
        this.select(eft);
      }

    , listen: function () {
        var $container = this.$container
          , selector = this.selector;
        $container
          .on('mouseleave.datepanel', selector, proxy(this.mouseleave, this))
          .on('mouseenter.datepanel', selector + ' .times-wrapper', proxy(this.meTW, this))
          .on('mousemove.datepanel', selector + ' .times-wrapper', proxy(this.mousemove, this))
          .on('mouseleave.datepanel', selector + ' .times-wrapper', proxy(this.mlTW, this))
          .on('click.datepanel', selector + ' .times-wrapper', proxy(this.clickTW, this))
          .on('click.datepanel', selector + ' .time-cates li[data-cate]', proxy(this.clickCT, this))

        this.$tw.on('scroll.datepanel', proxy(this.scrollTop, this));
      }

    , scrollTop: function (e) {
        if (this.isHide) { this.$cursor.removeClass('hide'); this.isHide = false; }
        if (this.enable) { return; }
        e.pageX = this.px;
        e.pageY = this.py;
        this.st = this.$tw.scrollTop();
        this.mousemove(e);
      }

    , removeSelected: function () {
        if (this.$selected) {
          this.selectedTime = '';
          this.$selected.removeClass('selected');
          delete this.$selected;
        }
      }

    , mouseleave: function (e) {
        e.stopPropagation();
        e.preventDefault();
        this.$ft.addClass('hide');
      }

    , mousemove: function (e) {
        e.stopPropagation();
        e.preventDefault();
        var y = this.y;
        this.px = e.pageX;
        this.py = e.pageY;
        this.x = this.px - this.ox;
        this.y = this.py - this.oy + this.st - this.hh;
        // steps 3hours & 60 / 15
        this.y = Math.max(0, Math.min(this.y, (this.l - 1) * this.h * 3 * 4));

        if (y === this.y) { return; }
        this.hoverItem();

        this.showFuzzyTime(e.pageY);
      }

    , clickCT: function (e) {
        e.preventDefault();
        this.removeSelected();
        this.component.emit('rf-tl', '', $(e.currentTarget).text());
      }

    , showFuzzyTime: function (y) {
        var n = 0
          , ts = this.ts
          , t
          , d0 = new Date(2012, 12, 21, this.dh, this.dm)
          , d1, dt, l;
        R.find(ts, function (v, i) {
          t = v.split(':');
          d1 = new Date(2012, 12, 21, t[0], t[1]);
          if (d0 < d1) {
            n = i;
            return true;
          }
        });

        if (0 === n) { n = 1; }
        if (24 === this.dh) { n = 14; }
        --n;
        this.$ts.not('.hide').addClass('hide');
        this.$ts.eq(n).removeClass('hide');

        // from 5:00 to 22:00
        if (5 <= this.dh && this.dh < 22) {
          this.$ts.eq(n - 1).removeClass('hide');
          this.$ts.eq(n + 1).removeClass('hide');
        }
        dt = y - this.oy - this.th;
        l = this.$ts.not('.hide').length;
        this.$ft.stop(true, true).animate({'top': dt - (l + 1) / 2 * 18}, 233);
      }

    , meTW: function () {
      this.$cursor.removeClass('hide');
      this.$ft.removeClass('hide');
    }

    , mlTW: function (e) {
        var $c = this.$cursor;
        if (e) { e.preventDefault(); }
        if (!$c.hasClass('time-label') && !$c.hasClass('selected')) {
          $c.addClass('hide');
        }
      }

    , clickTW: function (e) {
        e.stopPropagation();
        e.preventDefault();
        var $c = this.$cursor
          , t = $c.attr('data-time')
          , ts = t.split(':')
          , isLabel = 0 === +ts[0] % 3 && 0 === +ts[1]
          , $s = this.$selected;
        $c.addClass('hide');
        if ($s) {
          $s.removeClass('selected');
          if (t === $s.attr('date-time')) { return; }
          if (!$s.hasClass('time-label')) {
            $s.remove();
            delete this.$selected;
          }
        }
        if (isLabel) {
          this.$selected = this.$tc.find('[data-time="' + t + '"]').eq(0);
        } else {
          this.$selected = $c.clone().removeClass('hide time-hover');
          $c.before(this.$selected);
        }
        this.$selected.addClass('selected');
        this.component.emit('rf-tl', this.selectedTime = this.$selected.data('time'), '');
      }

    , hoverItem: function () {
        var t = Math.round(this.y / this.h) * this.h
          , ms = t * this.a
          , h = +Math.floor(ms / 60).toFixed(0)
          , m = ms % 60
          , hm = lead0(h) + ':' + lead0(m);

        this.dh = h;
        this.dm = m;

        this.$cursor
          .css('top', t)
          .attr('data-time', hm)
          .find('time').text((12 === h ? h : h % 12) + ':' + lead0(m) + ' ' + (h < 12 ? 'A' : 'P') + 'M');
      }

      //                      class, hours, minutes, top, isLabel
    , createNormalItem: function (h, m, t) {
        var $d = $(this.divTmp
          .replace('{{class}}', ' time-hover')
          .replace('{{dt}}', lead0(h) + ':' + lead0(m))
          .replace('{{t}}', h + ':' + lead0(m) + ' ' + (h < 12 ? 'A' : 'P') + 'M'));
        $d.css('top', t);
        this.$tc.append($d);
        return $d;
      }

      //                      class, hours, minutes, top, isLabel
    , createLabelItem: function (h, m, t) {
        var $d = $(this.divTmp
          .replace('{{class}}', ' time-label')
          .replace('{{dt}}', lead0(h) + ':' + lead0(m))
          .replace('{{t}}', (12 === h ? h : h % 12) + ' ' + (h < 12 ? 'A' : 'P') + 'M'));
        $d.css('top', t);
        this.$tc.append($d);
        return $d;
      }

    , generateHTML: function () {
        var l = this.l
          , i = 0
          , step = 60 * 3
          , d = new Date(2012, 12, 21, 21, 0)
          , h = 0, m = 0;

        for (; i < l; ++i) {
          d.setMinutes(d.getMinutes() + step);
          h = d.getHours();
          m = d.getMinutes();
          if (8 === i) {
            h = 24;
          }
          this.createLabelItem(h, m, 60 * i);
        }

        this.$cursor = this.createNormalItem(0, 0, 0)
          .addClass('hide');
      }

  };


  // Helper:
  var proxy = function (f, c) {
    if (!f) { return; }
    return function cb(e) {
      return f.call(c, e);
    };
  };

  var dateFormat = function (date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  };

  var datefun = function (ds, i) {
    if (!i) { i = 0; }
    ds = ds.split('-');
    return new Date(ds[0], +ds[1] - 1, +ds[2] + i);
  };

  // get time zone
  var getTimezone = function () {
    var s = (new Date()).toString()
      , tz = s.replace(/^(?:[\w\W]+([\+\-]\d\d):?(\d\d)[\w\W]+)$/, '$1:$2')
      , ts = s.replace(/^(?:[\w\W]+\(([a-z]+)\)[\w\W]*)$/i, '$1');
    if (ts === 'UTC' || ts === 'GMT') { ts = ''; }
    return tz + (ts ? (' ' + ts) : '');
  };

  // get Textarea selectionEnd
  var selectionEnd = function (inputor) {
    return isIE ? getIESelectionEnd(inputor) : inputor.selectionEnd;
  }

  var getIESelectionEnd = function (inputor) {
    var r = document.selection.createRange()
      , re = inputor.createTextRange()
      , rc = re.duplicate();
    re.moveToBookmark(r.getBookmark());
    rc.setEndPoint('EndToStart', re);
    return rc.text.length + r.text.length;
  }

  return DatePanel;
});
