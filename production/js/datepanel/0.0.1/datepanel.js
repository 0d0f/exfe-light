/**
 * Exfe's DatePanel Widget.
 * 日期控件
 */
define('datepanel', function (require, exports, module) {
<<<<<<< HEAD
  var $ = require('jquery');
  var Api = require('api');
  var Moment = require('moment');
=======

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

>>>>>>> dc92db8... update datepanel
  var Panel = require('panel');

  var DatePanel = Panel.extend({

      options: {

          template: ''
<<<<<<< HEAD
          + '<div class="panel date-panel" tabindex="-1" data-widget="panel" id="date-panel">'
            + '<div class="panel-header"><input type="text" name="date-string" id="date-string" /></div>'
            + '<div class="panel-body">'
                + '<div class="pull-right date-timeline"><ul class="unstyled"></ul></div>'
                + '<div class="date-container" tabindex="-1">'
                  + '<ul class="unstyled clearfix" id="date-head"><li>Sun</li><li>Mon</li><li>Tue</li><li>Wed</li><li>Thu</li><li>Fri</li><li>Sat</li></ul>'
                  + '<div class="full-month"></div>'
                  + '<table class="table" id="date-table"><tbody></tbody></table>'
=======
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
>>>>>>> dc92db8... update datepanel
              + '</div>'
            + '</div>'
            + '<div class="panel-footer"></div>'
          + '</div>'

        , parentNode: null

        , srcNode: null

        , eftime: null

      }

    , init: function () {
        var options = this.options
          , eftime;
        this.eftime = eftime = options.eftime;
        delete options.eftime;
        this.render();
        this.dateInput = new DateInput(this.$('#date-string'), this);
        this.dateInput.eftime = eftime;

        var d, sss;
        if (eftime.outputformat) {
          d = new Date();
          sss = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        } else {
          var s = '', sf = '', sf2 = '';
          var tz = (eftime.begin_at.timezone && /(^[\+\-]\d\d:\d\d)/.exec(eftime.begin_at.timezone)[1]) || '';
          if (eftime.begin_at.date) {
            s += eftime.begin_at.date;
            sf += 'YYYY-MM-DD';
            sf2 += 'YYYY-MM-DD';
          }

<<<<<<< HEAD
          if (eftime.begin_at.time) {
            s += ' ' + eftime.begin_at.time;
            sf += ' HH:mm:ss';
            sf2 += ' HH:mm:ss';
          }

          if ((eftime.begin_at.date || eftime.begin_at.time) && tz) {
            s += ' +0000';
            sf += ' ZZ'
          }

          d = Moment(s, sf);
          sss = d.format(sf2);
          d = parseISO8601(d.format(sf));
        }
=======
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
        e.preventDefault();
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
>>>>>>> dc92db8... update datepanel

        this.dateInput.input(sss);
        this.calendarTable = new CalendarTable(this.$('.date-container'), this, {
            // 日历最多显示 3 行
            maxRows: 3
          , cursor: 0
          , date: d
        });
        this.dataController = new DataController();

        this.on('updateDate', function (date, time) {
          this.dateInput.input(time + (time ? ' ' : '') + date);
        });

        this.on('refresh', function (date) {
          this.calendarTable.clean();
          var ds = date.match(/(\d{4})\-(\d{2})\-(\d{2})/);
          this.calendarTable.date = new Date(ds[1], (ds[2] - 1), ds[3]);
          this.calendarTable.refresh();
        });

        this.generateTimeLine();

        this.on('enter', function (date) {
          this.dateInput.el.data('date', date);
          $('body').trigger('click');
        });
      }

    , generateTimeLine: function () {
        var self = this;
        var ul = this.$('.date-timeline ul');
        var l = 24, i = 0, s = '';
        for (; i < 24; ++i) {
          s = i < 10 ? '0' + i : i;
          ul.append('<li>' + s + ':00</li><li>' + s + ':30</li>');
        }
        ul
          .find('li')
          .click(function (e) {
            var str = $(this).text();
            self.emit('updateDate', '', str);
          });
        setTimeout(function () {this.$('.date-timeline').scrollTop(360);}, 0);
      }

    , showBefore: function () {
        this.element.attr('editarea', 'date-panel')
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
            })
        }
<<<<<<< HEAD
        this.dateInput.el.focus();
=======
        this.dateInput.$element.focusend();
        this.calendarTable.scrollTop(132);
>>>>>>> dc92db8... update datepanel
      }

    , destory: function () {
        this.element.off();
        this.element.remove();
        this._destory();
      }

  });

  /**
   * 日期输入组件
   */
  var DateInput = function (element, component, options) {
    this.component = component;
<<<<<<< HEAD
    this.el = element;
    this.el.on('keypress.dateinput', $.proxy(this.keypress, this));
    this.el.on('keyup.dateinput', $.proxy(this.keyup, this));
    if ($.browser.webkit | $.browser.msie | $.browser.mozilla) {
      this.el.on('keydown.dateinput', $.proxy(this.keypress, this));
    }
    this.befer = null;
    //this.timezone = this.el.data('timezone');
    //if (!this.timezone) {
    this.timezone = getTimezone();
    //}
=======
    this.$container = this.component.element;
    this.selector = selector;
    this.$element = this.component.$(selector);
    this.date = date;
    this.befer = null;
    this.timezone = getTimezone();
    this.listen();
>>>>>>> dc92db8... update datepanel
  };

  DateInput.prototype = {

<<<<<<< HEAD
      input: function (datestring) {
        if (/^\d\d:\d\d$/.test($.trim(datestring))) {
          datestring = (this.component.element.find('table td.selected').data('date') || this.component.element.find('table td.today').data('date')) + ' ' + datestring;
        }
        this.el.val($.trim(datestring));
        this.el.data('date', datestring);
=======
      change: function (text) {
        this.input(text);
      }

    , input: function (s) {
        this.$element.val(s);
>>>>>>> dc92db8... update datepanel
      }

    , output: function () {
        return $.trim(this.el.val());
      }

<<<<<<< HEAD
    , lookup: function () {
        var self = this
          , component = self.component;
        self.befer && self.befer.abort();
        var date_string = $.trim(self.el.val());
        if (!date_string) {
          self.el.data('date', '');
          return;
        }
        var oldVal = self.el.data('date');
        if (oldVal === date_string) {
          return;
        }
        self.befer = Api.request('recognize'
          , {
              type: 'POST'
            , data: {
                  time_string: date_string
                , timezone: self.timezone
              }
            }
          , function (data) {
              var eftime = data.cross_time, date;
              self.eftime = data.cross_time;
              var s = '', s2, s3;
              if (eftime.begin_at.date) {
                s2 = eftime.begin_at.date;
                s = 'YYYY-MM-DD';
                s3 = s;
                if (eftime.begin_at.time) {
                  s2 += eftime.begin_at.time;
                  s += ' HH:mm:ss'
                  s3 = s;
                }
                s += ' ZZ';
                date = Moment(s2, s);
                date = date.format(s3);
              } else {
                var d = new Date();
                date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
              }
              self.el.data('date', date);
              component.emit('refresh', date);
            }
          , function (data) {
            }
        );
      }

    , keyup: function (e, keyCode) {
        //e.stopPropagation();
        var self = this;
        keyCode = e.keyCode;
        switch(keyCode) {
          case 40: // down arrow
          case 38: // up arrow
            break;

          case 9: //tab
            break;
          case 13: //enter
            break;

=======
    , blur: function (e) {}

    , focus: function (e) {}

    , keyup: function (e) {
        switch (e.keyCode) {
          case  9: // tab
          case 13: // enter
          case 16: // shift
          case 17: // ctrl
          case 18: // alt
>>>>>>> dc92db8... update datepanel
          case 27: // escape
          case 38: // up arrow
          case 40: // down arrow
            break;

          default:
            self.lookup();
        }
        //e.stopPropagation();
        e.preventDefault();
      }

<<<<<<< HEAD
    , keypress: function (e, keyCode) {
        var self = this;
        keyCode = e.keyCode;
        switch(keyCode) {
=======
    , keyHandler: function (e) {
        var self = this
          , component = this.component
          , kc = e.keyCode;
        switch (kc) {
>>>>>>> dc92db8... update datepanel
          case 9: // tab
            self.el.parent().next().find('.date-container').focus();
            e.preventDefault();
            break;
          case 13: // enter
            var ds = self.el.data('date'), m, ddd = [];
            if (m = ds.match(/(\d{4})\-(\d{2})\-(\d{2})/)) {
              ddd[0] = m[1];
              ddd[1] = +m[2] - 1;
              ddd[2] = m[3];
              m = false;
            }
            if (m = ds.match(/(\d{2}):(\d{2}):?(\d{2})?/)) {
              ddd[3] = +m[1];
              ddd[4] = +m[2];
              ddd[5] = +m[3] || 0;
            } else {
              m = false;
            }
            ddd = Moment(ddd).utc();
            var eftime = self.eftime;
            eftime.begin_at.date = ddd.format('YYYY-MM-DD');
            eftime.begin_at.time = ddd.format('HH:mm:ss');
            var date;
            var s = '', sf = '', sf2 = '';
            var tz = (eftime.begin_at.timezone && /(^[\+\-]\d\d:\d\d)/.exec(eftime.begin_at.timezone)[1]) || '';
            if (eftime.begin_at.date) {
              s += eftime.begin_at.date;
              sf += 'YYYY-MM-DD';
              sf2 += 'YYYY-MM-DD';
            }

            if (eftime.begin_at.time) {
              s += ' ' + eftime.begin_at.time;
              sf += ' HH:mm:ss';
              sf2 += ' HH:mm:ss';
            }

            if ((eftime.begin_at.date || eftime.begin_at.time) && tz) {
              s += ' +0000';
              sf += ' ZZ'
            }

            d = Moment(s, sf);

            self.el.data('date', date = ds ? d.format(sf2) : '');
            self.component.emit('enter', date);
            break;
          case 27: // escape
            e.preventDefault();
            break;
<<<<<<< HEAD
=======
          case 13: // enter
            e.preventDefault();
            component.emit('save');
            break;
        }
      }
>>>>>>> dc92db8... update datepanel

          case 38: // up arrow
            break;

<<<<<<< HEAD
          case 40: //down break
            break;
        }
        //e.stopPropagation();
      }

=======
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

>>>>>>> dc92db8... update datepanel
  };

  /**
   * 日期表格组件
   */
  var months = 'January February March April May June July August September October November December'.split(' ');
  var monthsShort = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
  /*
    <tr>
      <td> <span class="m">Sep</span> <span class="d">28</span> </td>
      <td> <span class="m">Sep</span> <span class="d">29</span> </td>
      <td class="hover today"> <span class="m">Sep</span> <span class="d">Today</span> </td>
      <td> <span class="m">Sep</span> <span class="d">31</span> </td>
      <td> <span class="m">Sep</span> <span class="d">1</span> </td>
      <td class="selected"> <span class="m">Sep</span> <span class="d">2</span> </td>
      <td> <span class="m">Sep</span> <span class="d">3</span> </td>
    </tr>
  */
  var CalendarTable = function (element, component, options) {
    this.el = element;
    this.component = component;

    this.length = 0;
    this.lines = 0;
    this.columns = 7;

    this.options = options;
    this.options || (this.options = {});
    options = this.options;
    options.maxRows || (options.maxRows = 3);
    options.cursor || (options.cursor = 0);

    this.today = new Date();
    this.date = options.date || new Date();
    this.todayString = format(this.today);

<<<<<<< HEAD
    this.nextPage(this.date);
    this.initCursor(format(this.date));
    this.setCursorClass();
    this.select();

    this.lines = options.maxRows;
    this.line = 0;

    this.column = this.date.getDay();

    this.table = this.el.find('table');

    this.keyDown();
    this.handlers();
=======
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
>>>>>>> dc92db8... update datepanel
  };

  CalendarTable.prototype = {

<<<<<<< HEAD
      refresh: function () {
        var options = this.options;
        this.length = 0;
        this.nextPage(this.date);
        this.initCursor(format(this.date));
        this.setCursorClass();
        this.select();
        this.lines = options.maxRows;
        this.line = 0;
        this.column = this.date.getDay();
        this.scrollTop(0);
      }

    , scrollTop: function (d) {
        this.table
          .css('margin-top', d);
=======
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
>>>>>>> dc92db8... update datepanel
      }

    , handlers: function () {
        var self = this
          , el = this.el
          , options = self.options;

        el.on('fucosu.calendar', 'table', function (e) {
            self.focuseable = true;
          })
          .on('blur.calendar', 'table', function (e) {
            self.focuseable = false;
          });

        el.on('mouseleave.calendar', 'table', function (e) {
          var td = self.getSelected();
          self.setCursor(td);
          self.line = td.parent().index();
          self.column = td.index();
        });

        el.on('hover.calendar', 'table td', function (e) {
          el.find('.full-month').text('');
          e.preventDefault();
          var t = e.type
            , isMouseEnter = t === 'mouseenter'
            , td = $(this);
          if (isMouseEnter) {
            self.setCursor(td);
            self.setCursorClass();
            self.line = td.parent().index();
            self.column = td.index();
          } else {
            self.currentCursor
              .removeClass('hover')
              .find('.m').addClass('hide');
          }
        })
          .on('click.calendar', 'table td', function (e) {
            var td = $(this)
              , date = td.data('date');

<<<<<<< HEAD
            self.el.find('td.selected').removeClass('selected');
            td.addClass('selected');
            self.component.emit('updateDate', date, '');
          });
      }

    , keyDown: function () {
        var self = this
          , el = this.el
          , options = self.options;
        el.on('keydown.calendar', function (e) {
          var kc = e.keyCode
            , shift = e.shiftKey;
          var ltrb = false;
          e.preventDefault();
          switch (kc) {
            // spacing
            case 32:
                self.el.find('td.selected').removeClass('selected');
                self.select();
                var date = self.currentCursor.data('date');
                self.component.emit('updateDate', date, '');
              break;
            case 13:
                self.el.find('td.selected').removeClass('selected');
                self.select();
                var date = self.currentCursor.data('date');
                self.component.emit('updateDate', date, '');
                self.component.emit('enter', date);
              break;
            // left
            case 37:
              ltrb = true;
              if (0 === self.column) {
                self.column = 6;
                if (0 === self.line) {
                  self.prevPage();
                  self.scrollTop(0);
                  self.line = 2;
                } else {
                  if (0 === self.line % 3) {
                    self.scrollTop('+=132');
                  }
                  self.line--;
                }
              } else {
                self.column--;
              }
              self.left();
              break;
            // top
            case 38:
              ltrb = true;
              if (0 === self.line) {
                self.prevPage();
                self.scrollTop(0);
                self.line = 2;
              } else {
                if (0 === self.line % 3) {
                  self.scrollTop('+=132');
                }
                self.line--;
              }
              self.top();
              break;
            case 39:
              ltrb = true;
              if (6 === self.column) {
                self.column = 0;
                if (self.line === self.lines - 1) {
                  self.nextPage();
                  self.scrollTop('-=132');
                } else {
                  if (0 === (self.line + 1) % 3) {
                    self.scrollTop('-=132');
                  }
                }
                self.line++;
              } else {
                self.column++;
              }
              self.right();
              break;
            case 40:
              ltrb = true;
              if (self.line === self.lines - 1) {
                self.nextPage();
                self.scrollTop('-=132');
              } else {
                if (0 === (self.line + 1) % 3) {
                  self.scrollTop('-=132');
                }
              }
              self.line++;
              self.bottom();
              break;
            case 9:
              self.el.parent().prev().find('input#date-string').focus();
              break;
          }
          self.el.find('.full-month').text(ltrb ? months[self.date.getMonth()] : '');
        });
      }

    , generateHTML: function (printDate) {
        var options = this.options
          , maxRows = options.maxRows
          , todayString = this.todayString
          , tdStr = '<span class="m hide">{{m}}</span><span class="d">{{d}}</span>';

        var tbody = '';

        this.lines += maxRows;

        for (var i = 0; i < maxRows; ++i) {

          var tr = '<tr>'
            , td = ''
            , fs = ''
            , isToday;

          for (var j = 0; j < 7; j++) {
            fs = format(printDate);
=======
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
>>>>>>> dc92db8... update datepanel

            isToday = fs === todayString;
            isSelected = fs === selectedDate;

            isToday && (cls += 'today');
            isSelected && (cls += (cls.length ? ' ' : '') + 'selected');

            td += '<td data-date="' + fs + '"' + (cls ? (' class="' + cls + '"') : '') + '>';

            var ts = tdStr;

            td += ts
                    .replace('{{m}}', monthsShort[printDate.getMonth()])
                    .replace('{{d}}', isToday ? 'Today' : printDate.getDate());

            td += '</td>';
            printDate.setDate(printDate.getDate() + 1);
          }

          tr += td + '</tr>';

          tbody += tr;
        }
        return tbody;
      }

<<<<<<< HEAD
    , prevPage: function () {
        var options = this.options
          , maxRows = options.maxRows
          , startOf = this.startOf
          , printDate;

        this.startOf = startOf = new Date(startOf.getFullYear(), startOf.getMonth(), startOf.getDate() - 7 * maxRows);

        printDate = new Date(startOf.getFullYear(), startOf.getMonth(), startOf.getDate());

        this.el.find('tbody').prepend(this.generateHTML(printDate));
      }

    , nextPage: function (thisDate) {
        var options = this.options
          , endOf = this.endOf;

        if (thisDate) {
          var date = thisDate.getDate()
            , day = thisDate.getDay();
          this.startOf = new Date(thisDate.getFullYear(), thisDate.getMonth(), date - day);
          this.endOf = new Date(thisDate.getFullYear(), thisDate.getMonth(), date - day);
        }

        this.length++;

        this.el.find('tbody').append(this.generateHTML(this.endOf));
      }

    , getSelected: function () {
        return this.el.find('td.selected, td.today').eq(0);
      }

    , initCursor: function (datestring) {
        this.setCursor(
          this.el.find('td[data-date="' + datestring + '"]')
        );
      }

    , setCursor: function (td) {
        this.currentCursor = td;
        var d = this.currentCursor.data('date');
        this.date = new Date(d);
      }

    , select: function () {
        this.currentCursor.addClass('selected');
      }

    , setCursorClass: function () {
        this.el.find('td.hover, td.today').removeClass('hover')
          .find('.m').addClass('hide');
        this.currentCursor.addClass('hover')
          .find('.m').removeClass('hide');
      }

    , move: function () {}

    , moveX: function () {}

    , moveY: function () {}

    , left: function () {
        var td;
        if (6 !== this.column) {
          td = this.currentCursor.prev();
        } else {
          td = this.currentCursor.parent().prev().find('td').eq(this.column);
        }
        this.setCursor(td);
        this.setCursorClass();
      }

    , top: function () {
        var td = this.currentCursor.parent().prev().find('td').eq(this.column);
        this.setCursor(td);
        this.setCursorClass();
      }

    , right: function () {
        var td;
        if (0 === this.column) {
          td = this.currentCursor.parent().next().find('td').eq(this.column);
        } else {
          td = this.currentCursor.next();
        }
        this.setCursor(td);
        this.setCursorClass();
      }

    , bottom: function () {
        var td = this.currentCursor.parent().next().find('td').eq(this.column);
        this.setCursor(td);
        this.setCursorClass();
      }

    , clean: function () {
        this.el.find('tbody').empty();
      }

  };

  /**
   * 日期数据交互组件
   */
  var DataController = function () {};

  DataController.prototype = {};


  /*
   * Helpers
   */
  // get time zone
  var getTimezone = function () {
    var s = (new Date()).toString()
      , tz = s.replace(/^.*([\+\-]\d\d):?(\d\d).*$/, '$1:$2')
      , ts = s.replace(/^.*\(([a-z]*)\).*$/i, '$1');
    ts = (ts === 'UTC' || ts === 'GMT') ? '' : ts;
    return tz + (ts ? (' ' + ts) : '');
  };

  // 2012-11-12
  var format = function (date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  };

  // days in a month.
  var daysInMonth = function (year, month) {
    var date = new Date(0);
    date.setUTCFullYear(year, month, 0);
    return date.getUTCDate();
  };

  // day of the week of the first of a month.
  var firstDayOfMonth = function (year, month) {
    var date = new Date(0);
    date.setUTCFullYear(year, month - 1, 1);
    return date.getUTCDay();
  };

  function parseISO8601(datestring) {
    datestring = datestring.replace(/-/, '/').replace(/-/, '/');
    // datestring = '2012-06-09'
    if (datestring.length > 10) {
      datestring = datestring.replace(/\.\d\d\d/, ''); // 0 ~ 999 ms
      datestring = datestring.replace(/T/, ' ');
      datestring = datestring.replace(/([\+\-]\d\d):?(\d\d)/, ' UTC$1$2');
      datestring = datestring.replace(/Z/, ' UTC+0000'); // at UTC
    }
    datestring = new Date(datestring);
    return datestring;
  }

  function printTime(time) {
    // 终端时区
    var c = Moment();
    var cz = c.format('Z');
    var b = time.begin_at;

    // Cross 时区
    var tz = (b.timezone && /(^[\+\-]\d\d:\d\d)/.exec(b.timezone)[1]) || '';
    // 创建一个 moment date-object
    var s = '', sf = '';
    if (b.date) {
      s += b.date;
      sf += 'YYYY-MM-DD';
    }

    if (b.time) {
      s += ' ' + b.time;
      sf += ' HH:mm:ss';
    }

    if ((b.date || b.time) && tz) {
      s += ' +0000';
      sf += ' ZZ'
    }

    var d = Moment(s, sf);

    var s = '', f, tt;

    // 比对时区
    var czEtz = cz === tz;

    // 直接输出 origin 时间
    if (time.outputformat) {
      s = time.origin;
      if (!czEtz) {
        s += ' ' + tz;
=======
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
>>>>>>> dc92db8... update datepanel
      }
      return s || 'Sometime';
    } else {

      if (b.time_word) {
        s += b.time_word + ' (at) ';
      }

      if (b.time) {
        s += d.format('HH:mm:ss');
      }

<<<<<<< HEAD
      if (!czEtz && tz) {
        s += ' (' + tz + ') ';
      }
=======
  /**
   * DataController
   */
  var DataController = function (component) {};
>>>>>>> dc92db8... update datepanel

      if (b.date_word) {
        s += b.date_word + ' (on) ';
      }

      if (b.date) {
        s += ' ' + d.format('YYYY-MM-DD');
      }

      if (d && d.year() !== 1900 && d.year() !== c.year()) {
        s += ' ' + d.year();
      }
    }

    return s || (sf ? d.format(sf) : 'Sometime')
  }

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
