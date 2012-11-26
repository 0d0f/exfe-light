/**
 * Exfe's DatePanel Widget.
 * 日期控件
 */
define('datepanel', function (require, exports, module) {

  var R = require('rex');
  var $ = require('jquery');
  var $proxy = $.proxy;

  var mozilla = $.browser.mozilla
    , webkit = $.browser.webkit;

  var efTime = require('eftime');
  var locale = efTime.locales[efTime.locale];
  var monthsShort = locale.monthsShort;
  var months = locale.months;
  var lead0 = efTime.lead0;
  var h12 = efTime.h12;

  var Panel = require('panel');

  var DatePanel = Panel.extend({

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

        // save origin eftime data
        this.originEftime = options.eftime;
        this.eftime = Cross.time;
        this.date = efTime.toDate(this.eftime);
        delete options.eftime;

        this.dateInput = new DateInput(this, '#date-string', this.date);
        this.calendarTable = new CalendarTable(this, '.date-calendar', this.date);
        this.timeline = new Timeline(this, '.date-timeline');
        this.listen();

        this.emit('change', { date: this.eftime.origin || this.date.text }, true);
      }

    , listen: function () {
        this.element.on('keydown.datepanel', $proxy(this.keydown, this));

        this.on('dateinput-tab', this.dateInputTab);
        this.on('calendartable-tab', this.calendarTableTab);
        this.on('change', this.change);
        this.on('refresh-calendar', this.refreshCalendar);
        this.on('save', this.save);
      }

    , keydown: function (e) {
        var self = this;
        // escape
        if (27 === e.keyCode) {
          self.revert();
          self.emit('save');
        }
        else if (e.ctrlKey && 13 === e.keyCode) {
          self.emit && self.emit('save');
        }
      }

    , save: function () {
        $.extend(true, this.originEftime, this.eftime);
        $('body').trigger('click');
      }

    , revert: function () {
        $.extend(true, this.eftime, this.originEftime);
      }

    , refreshCalendar: function (eftime) {
        $.extend(true, this.eftime, eftime);
        this.date = efTime.toDate(eftime);
        this.calendarTable.refresh(this.date);
      }

    , change: function (dobj, init) {
        dobj.date || (dobj.date = this.calendarTable.getSelectedDate());
        dobj.time || (dobj.time = this.timeline.getSelectedTime());
        var origin = dobj.date;
        var d = efTime.parseISO8601(origin);
        var ts = dobj.time.split(':');
        origin = $.trim(origin + ' ' + dobj.time);
        if (!init) {
          d.setHours(ts[0] || 0);
          d.setMinutes(ts[1] || 0);
          d.setSeconds(ts[2] || 0);
          dobj.date = d.getUTCFullYear() + '-' + (d.getUTCMonth() + 1) + '-' + d.getUTCDate();
          dobj.time = d.getUTCHours() + ':' + d.getUTCMinutes() + ':' + d.getUTCSeconds();
          dobj.timezone = getTimezone();
          $.extend(true, this.eftime, {
              begin_at: dobj
            , origin: origin
            , outputformat: 0
          });
        }
        this.dateInput.change(origin);
      }

    , dateInputTab: function () {
        var dateInput = this.dateInput
          , calendarTable = this.calendarTable;
        //dateInput.$element.blur();
        setTimeout(function () {
          calendarTable.$element.focus();
        }, 0);
      }

    , calendarTableTab: function () {
        var dateInput = this.dateInput
          , calendarTable = this.calendarTable;
        //calendarTable.$element.blur();
        setTimeout(function () {
          dateInput.$element.focus();
        }, 0);
      }

    , showAfter: function () {
        var srcNode = this.srcNode;
        if (srcNode) {
          var offset = srcNode.offset();
          var width = this.element.outerWidth();
          this.element
            .css({
                left: offset.left - width - 15
              , top: offset.top
            });
        }
        this.dateInput.$element.focusend();
        this.calendarTable.scrollTop(132);
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
  var DateInput = function (component, selector, date) {
    this.component = component;
    this.$container = this.component.element;
    this.selector = selector;
    this.$element = this.component.$(selector);
    this.date = date;
    this.befer = null;
    this.timezone = getTimezone();
    this.listen();
  };

  DateInput.prototype = {

      change: function (text) {
        this.input(text);
      }

    , input: function (s) {
        this.$element.val(s);
      }

    , listen: function () {
        var $container = this.$container
          , selector = this.selector;
        $container
          .on('blur.datepanel', selector, $.proxy(this.blur, this))
          .on('keypress.datepanel', selector, $.proxy(this.keypress, this))
          .on('keyup.datepanel', selector, $.proxy(this.keyup, this))
          .on('keydown.datepanel', selector, $.proxy(this.keydown, this))
          .on('focus.datepanel', selector, $.proxy(this.focus, this));
      }

    , blur: function (e) {}

    , focus: function (e) {}

    , keyup: function (e) {
        switch (e.keyCode) {
          case  9: // tab
          case 13: // enter
          case 16: // shift
          case 17: // ctrl
          case 18: // alt
          case 27: // escape
          case 38: // up arrow
          case 40: // down arrow
            break;

          default:
            this.lookup();
        }
        e.stopPropagation();
        e.preventDefault();
      }

    , keyHandler: function (e) {
        var self = this
          , component = this.component
          , kc = e.keyCode;
        switch (kc) {
          case 9: // tab
            e.preventDefault();
            component.emit('dateinput-tab');
            break;
          case 13: // enter
            e.preventDefault();
            component.emit('save');
            break;
        }
      }

    , keypress: function (e) {
        if (this.suppressKeyPressRepeat) {
          return;
        }
        this.keyHandler(e);
      }

    , keydown: function (e) {
        this.suppressKeyPressRepeat = !!~R.indexOf([9, 13], e.keyCode);
        this.keyHandler(e);
      }

    , lookup: function (e) {
        var self = this
          , component = self.component
          , str = $.trim(self.$element.val());

        self.befer && self.befer.abort();
        if ('' === str) {
          var ef = efTime.create();
          component.emit('refresh-calendar', ef);
          return;
        }

        self.befer = Api.request('recognize'
          , {
                type: 'POST'
              , data: {
                    time_string: str
                  , timezone: self.timezone
                }
            }
          , function (data) {
              component.emit('refresh-calendar', data.cross_time);
            }
        );
      }

  };


  /**
   * CalendarTable
   */
  var CalendarTable = function (component, selector, date) {
    this.component = component;
    this.$container = this.component.element;
    this.selector = selector;
    this.$element = this.component.$(selector);
    this.date = date;
    this.today = new Date();
    this.todayString = dateFormat(this.today);

    // Viewport
    //            [x, y]
    this.coords = [0, 0]
    this.vpRows = 3;
    this.vpHeight = 44;
    this.len = 0;
    this.$cursor = null;

    // Elements
    this.divTemp = '<div class="tw"><span class="m hide">{{m}}</span><span class="d">{{d}}</span></div>';
    this.$tableWrapper = this.$element.find('.table-wrapper');
    this.$table = this.$tableWrapper.find('table');
    this.$tbody = this.$table.find('tbody');
    this.$trs = null;
    this.$year = this.$element.find('.year');
    this.$fullMonth = this.$element.find('.full-month');

    this.initCalendar();
    this.listen();
  };

  CalendarTable.prototype = {

      initCalendar: function () {
        var day = this.date.day
          , self = this
          , y = day.getFullYear()
          , m = day.getMonth()
          , d = day.getDate()
          , dt = day.getDay()
          , date = new Date(y, m, d - dt - 21);

        this.startDate = dateFormat(date);
        this.nextPend(date);
        this.nextPend(date);
        this.nextPend(date);
        this.endDate = dateFormat(date);
        this.coords = [dt, 3];
        this.$trs = this.$tbody.find('tr');
        this.$tableWrapper.scrollTop(0);
      }

    , refresh: function (date) {
        this.$tbody.empty();
        this.$trs = null;
        this.$select = null;
        this.$cursor = null;
        this.date = date;
        this.len = 0;
        this.initCalendar();
      }

    , getSelectedDate: function () {
        return this.selectedDate || this.todayString;
      }

    , setCursorClass: function () {
        this.$cursor = this.$trs
          .eq(this.coords[1])
          .find('td')
          .eq(this.coords[0])
          .addClass('hover');
      }

    , removeCursorClass: function () {
        if (this.$cursor) {
          this.$cursor.removeClass('hover');
        }
      }

    , scrollTop: function (steps) {
        this.$tableWrapper.scrollTop(steps);
      }

    , listen: function () {
        var $container = this.$container
          , selector = this.selector
          , $tableWrapper = this.$tableWrapper;

        $container
          .on('blur.datepanel', selector, $proxy(this.blur, this))
          .on('keypress.datepanel', selector, $proxy(this.keypress, this))
          .on('keyup.datepanel', selector, $proxy(this.keyup, this))
          .on('keydown.datepanel', selector, $proxy(this.keydown, this))
          .on('focus.datepanel', selector, $proxy(this.focus, this))
          .on('mouseenter.datepanel', selector + ' td', $proxy(this.tdMouseenter, this))
          .on('click.datepanel', selector + ' td', $proxy(this.tdClick, this))

          $tableWrapper.on('scroll.datepanel', $proxy(this.scroll, this));
      }

    , scroll: function (e) {
        e.stopPropagation();
        e.preventDefault();
        var $tableWrapper = this.$tableWrapper
          , t = $tableWrapper.scrollTop();
        if (t == 0) {
          this.pageUp(this.coords);
          $tableWrapper.scrollTop(132);
          this.$year.addClass('hide');
          this.$fullMonth.addClass('hide');
        }
        else if (t == 277) { // 9 * 44 + 120
          this.pageDown(this.coords);
          this.$year.addClass('hide');
          this.$fullMonth.addClass('hide');
        } else {
          if (this.$cursor) {
            var d = toDate(this.$cursor.data('date'));
            this.$year.removeClass('hide').html(d.getFullYear());
            this.$fullMonth.removeClass('hide').html(months[d.getMonth()]);
          }
        }
      }

    , tdClick: function (e) {
        e.preventDefault();
        this.moveSpacing();
      }

    , tdMouseenter: function (e) {
        e.preventDefault();
        this.removeCursorClass();
        var $td = $(e.currentTarget)
          , $tr = $td.parent();
        this.coords[0] = $td.index();
        this.coords[1] = $tr.index();
        this.setCursorClass();
      }

    , blur: function (e) {
        this.removeCursorClass();
      }

    , focus: function (e) {
        this.setCursorClass();
      }

    , keypress: function (e) {
        if (this.suppressKeyPressRepeat) {
          return;
        }
        this.keyHandler(e);
      }

    , keyup: function (e) {
        e.stopPropagation();
        e.preventDefault();
      }

    , keydown: function (e) {
        this.suppressKeyPressRepeat = !!~R.indexOf([9, 13, 32, 33, 34, 35, 36, 37, 38, 39, 40], e.keyCode);
        this.keyHandler(e);
      }

    , keyHandler: function (e) {
        var self = this
          , component = this.component
          , coords = this.coords
          , kc = e.keyCode;
        switch (kc) {
          case 9: // tab
            e.preventDefault();
            component.emit('calendartable-tab');
            break;
          case 37: // left
            e.preventDefault();
            self.moveWrapper(coords, 'moveLeft');
            break;
          case 38: // top
            e.preventDefault();
            self.moveWrapper(coords, 'moveTop');
            break;
          case 39: // right
            e.preventDefault();
            self.moveWrapper(coords, 'moveRight');
            break;
          case 40: // down
            e.preventDefault();
            self.moveWrapper(coords, 'moveDown');
            break;
          case 33: // page up:    mac fn + ↑
            e.preventDefault();
            self.moveWrapper(coords, 'pageUp');
            break;
          case 34: // page down:  mac fn + ↓
            e.preventDefault();
            self.moveWrapper(coords, 'pageDown');
            break;
          case 13: // enter
            e.preventDefault();
            break;
          case 32: // spacing
            e.preventDefault();
            self.moveSpacing();
            break;
          case 35: // end:        mac fn + →
          case 36: // home:       mac fn + ←
            break;
        }
      }

    , moveSpacing: function () {
        if (this.selectedDate) {
          this.$trs
            .find('td[data-date="' + this.selectedDate + '"]')
            .removeClass('selected');
        }
        this.select();
      }

    , select: function () {
        this.selectedDate = this.$cursor.data('date');
        this.$cursor.addClass('selected');
        this.component.emit('change', { date: this.selectedDate });
      }

    , generateHTML: function (startDate) {
        var vr = this.vpRows
          , todayString = this.todayString
          , selectedDate = this.selectedDate
          , divTemp = this.divTemp
          , i = 0
          , tbody = '';

        this.len += vr;

        for (; i < vr; ++i) {
          var j = 0
            , tr = '<tr>'
            , td = ''
            , fs
            , isToday
            , isSelected
            , cls;

          for (; j < 7; ++j) {
            cls = '';
            fs = dateFormat(startDate);

            isToday = fs === todayString;
            isSelected = fs === selectedDate;

            isToday && (cls += 'today');
            isSelected && (cls += (cls.length ? ' ' : '') + 'selected');

            td += '<td data-date="' + fs + '"' + (cls ? (' class="' + cls + '"') : '') + '>';

            var div = divTemp
              , day = startDate.getDate();
            td += div
                    .replace('{{m}}', monthsShort[startDate.getMonth()])
                    .replace('{{d}}', isToday ? 'Today' : day);

            td += '</td>';
            startDate.setDate(day + 1);
          }

          tr += td + '</tr>';

          tbody += tr;
        }

        return tbody;
      }

    , prevPend: function (date) {
        this.$tbody
          .prepend(this.generateHTML(date));
      }

    , nextPend: function (date) {
        this.$tbody
          .append(this.generateHTML(date));
      }

    , delFirst: function () {
        var first = this.$trs.first();
        this.startDate = first.find('td').data('date');
        this.$trs.eq(0).remove();
        this.$trs.eq(1).remove();
        this.$trs.eq(2).remove();
        this.len -= 3;
      }

    , delLast: function () {
        var last = this.$trs.eq(this.len - 3);
        this.endDate = last.find('td').data('date');
        this.$trs.eq(this.len - 1).remove();
        this.$trs.eq(this.len - 2).remove();
        last.remove();
        this.len -= 3;
      }

    , moveWrapper: function (coords, type) {
        this.removeCursorClass();
        this[type](coords);
        this.setCursorClass();
      }

    , moveLeft: function (coords) {
        if (0 === coords[0]--) {
          coords[0] = 6;
          this.moveTop(coords);
        }
      }

    , moveTop: function (coords) {
        if (0 === coords[1]--) {
          this.delLast();

          var d = toDate(this.startDate, -21);
          this.startDate = dateFormat(d);
          this.prevPend(d);
          this.$trs = this.$tbody.find('tr');
          coords[1] = 2;
          this.$tableWrapper.scrollTop(this.vpHeight * coords[1]);
        }
        var t = this.$tableWrapper.scrollTop();
        if (coords[1] * this.vpHeight < t) {
          this.$tableWrapper.scrollTop(t -= this.vpHeight);
        }
      }

    , moveRight: function (coords) {
        if (6 === coords[0]++) {
          coords[0] = 0;
          this.moveDown(coords);
        }
      }

    , moveDown: function (coords) {
        if (this.len === ++coords[1]) {
          this.delFirst();

          var d = toDate(this.endDate, 0);
          this.nextPend(d);
          this.endDate = dateFormat(d);
          this.$trs = this.$tbody.find('tr');
          coords[1] = this.len - 2;
          this.$tableWrapper.scrollTop(this.vpHeight * 5);
        }
        var t = this.$tableWrapper.scrollTop();
        if (coords[1] * this.vpHeight > t + this.vpHeight * (this.vpRows - 1)) {
          this.$tableWrapper.scrollTop(t += this.vpHeight);
        }
      }

    , pageUp: function (coords) {
        if (coords[1] <= this.vpRows) {
          this.delLast();

          var d = toDate(this.startDate, -21);
          this.startDate = dateFormat(d);
          this.prevPend(d);
          this.$trs = this.$tbody.find('tr');
          coords[1] += this.vpRows;
        } else {
          var t = this.$tableWrapper.scrollTop();
          this.$tableWrapper.scrollTop(t -= this.vpHeight * this.vpRows);
        }
        coords[1] -= this.vpRows;
      }

    , pageDown: function (coords) {
        if (coords[1] >= this.len - this.vpRows) {
          this.delFirst();

          var d = toDate(this.endDate, 0);
          this.nextPend(d);
          this.endDate = dateFormat(d);
          this.$trs = this.$tbody.find('tr');
          coords[1] -= this.vpRows;
          this.$tableWrapper.scrollTop(this.vpHeight * 3);
        }
        coords[1] += this.vpRows;
        var t = this.$tableWrapper.scrollTop();
        this.$tableWrapper.scrollTop(t += this.vpHeight * this.vpRows);
      }

  };


  /**
   * Timeline
   */
  var Timeline = function (component, selector) {
    this.component = component;
    this.$container = this.component.element;
    this.selector = selector;
    this.$element = this.component.$(selector);
    this.divTmp = '<div class="time-item{{class}}" data-time="{{dt}}"><time>{{t}}</time></div>';
    this.$fuzzyTime = this.$element.find('.fuzzy-time');
    this.$timesWrapper = this.$element.find('.times-wrapper');
    this.generateHTML();
    var times = this.times = [];
    this.$times = this.$element
      .find('ul.time-cates [data-time]')
      .each(function (i, v) {
        times.push($(v).data('time'));
      });
    this.len = this.$times.length;
    this.listen();
  };

  Timeline.prototype = {

      getSelectedTime: function () {
        return this.selectedTime || '';
      }

    , listen: function () {
        var $container = this.$container
          , selector = this.selector;
        $container
          .on('hover.datepanel', selector, $.proxy(this.hover, this))
          .on('hover.datepanel', selector + ' .time-item', $.proxy(this.itemHover, this))
          .on('click.datepanel', selector + ' .time-item', $.proxy(this.itemClick, this))
      }

    , hover: function (e) {
        var type = e.type
          , isMouseLeave = 'mouseleave' === type;

        this.$fuzzyTime.toggleClass('hide', isMouseLeave);
      }

    , itemHover: function (e) {
        e.preventDefault();
        var $item = $(e.currentTarget)
          , $timesWrapper = this.$timesWrapper
          , type = e.type
          , times = this.times
          , time = $item.data('time')
          , isMouseEnter = 'mouseenter' === type
          , index = 0;
        if (isMouseEnter) {
          var t0 = time.split(':');
          var d0 = new Date(1970, 0, 1, t0[0], t0[1])
            , d1, t1;
          var t = R.find(times, function (v, i) {
            t1 = v.split(':');
            d1 = new Date(1970, 0, 1, t1[0], t1[1]);
            if (d0 < d1) {
              index = i;
              return true;
            }
          });

          index || (index = 1);
          (t0[0] === 24) && (index = 14);
          index -= 1;

          this.$times
            .addClass('hide')
            .eq(index)
            .removeClass('hide');

          if (+t0[0] >= 5 && +t0[0] < 22) {
            this.$times.eq(index - 1).removeClass('hide');
            this.$times.eq(index + 1).removeClass('hide');
          }

          var top = e.pageY - this.$timesWrapper.offset().top - 5;
          var l = this.$times.not('.hide').length;
          this.$fuzzyTime.css('top', top - (l + 1) / 2 * 18 + 'px');
        }
      }

    , itemClick: function (e) {
        this.$select && this.$select.removeClass('selected');
        var $item = $(e.currentTarget)
          , t = $item.data('time');
        this.$select = $item.addClass('selected');
        this.component.emit('change', { time: this.selectedTime = t });
      }

    , generateHTML: function () {
        var l = 97, i = 0
          , html = '', s = ''
          , h = 0, m = 0
          , isLabel = false
          , d = new Date(1970, 0, 1, 23, 45);
        for (; i < l; ++i) {
          d.setMinutes(d.getMinutes() + 15);
          h = d.getHours();
          m = d.getMinutes();
          isLabel = 0 === (i % 12);
          if (i === 96) {
            h = 24;
          }
          s = this.divTmp;
          html += s
              .replace('{{class}}', isLabel ? ' time-label' : '')
              .replace('{{dt}}', lead0(h) + ':' + lead0(m))
              .replace('{{t}}',
                  (isLabel ? (h === 0 ? '0' : h12(h))
                    : ((h === 0 ? '0' : h12(h)) + ':' + lead0(m))
                  )
                  + ' '
                  + (h < 12 ? 'AM' : 'PM')
                      );
        }
        this.$element.find('.times').html(html);
      }

  };


  /**
   * DataController
   */
  var DataController = function (component) {};


  // Helper:
  var dateFormat = function (date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  };

  var toDate = function (ds, i) {
    i || (i = 0);
    ds = ds.split('-');
    return new Date(ds[0], +ds[1] - 1, +ds[2] + i);
  };

  // get time zone
  var getTimezone = function () {
    var s = (new Date()).toString()
      , tz = s.replace(/^.*([\+\-]\d\d):?(\d\d).*$/, '$1:$2')
      , ts = s.replace(/^.*\(([a-z]*)\).*$/i, '$1');
    ts = (ts === 'UTC' || ts === 'GMT') ? '' : ts;
    return tz + (ts ? (' ' + ts) : '');
  };

  return DatePanel;
});
