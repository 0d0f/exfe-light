/**
 * Exfe's DatePanel Widget.
 * 日期控件
 */
define('datepanel', function (require, exports, module) {

  var R = require('rex');

  var efTime = require('eftime');
  var locale = efTime.locales[efTime.locale];
  var monthsShort = locale.monthsShort;
  var months = locale.months;

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
                    + '<div class="full-month"></div>'
                    + '<table class="table" id="date-table"><tbody></tbody></table>'
                  + '</div>'
                + '</div>'

                + '<div class="pull-right date-timeline">'
                  + '<div class="gathering">Gathering day</div>'
                  + '<ul class="unstyled times"></ul>'
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
        this.eftime = $.extend({}, options.eftime);
        this.date = efTime.toDate(this.eftime);
        delete options.eftime;

        this.dateInput = new DateInput(this, '#date-string', this.date);
        this.calendarTable = new CalendarTable(this, '.date-calendar', this.date);
        this.listen();
      }

    , listen: function () {
        this.on('dateinput-tab', this.dateInputTab);
        this.on('calendartable-tab', this.calendarTableTab);
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
    this.input(this.date.text);
    this.listen();
  };

  DateInput.prototype = {

      input: function (s) {
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

    , click: function (e) {}

    , blur: function (e) {}

    , keyup: function (e) {
        switch (e.keyCode) {
          case 40: // down arrow
          case 38: // up arrow
          case 16: // shift
          case 17: // ctrl
          case 18: // alt
          case  9: // tab
          case 13: // enter
          case 27: // escape
            break;

          default:
            this.lookup();
        }
        e.stopPropagation();
        e.preventDefault();
      }

    , keyHandler: function (e) {
        var component = this.component
          , kc = e.keyCode;
        switch (kc) {
          case 9: // tab
            e.preventDefault();
            component.emit('dateinput-tab');
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
        this.suppressKeyPressRepeat = !!~R.indexOf([9], e.keyCode);
        this.keyHandler(e);
      }

    , focus: function (e) {}

    , lookup: function (e) {}

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

    // start date
    this.startDate = null;

    // viewport
    this.viewportRows = 3;
    this.viewportIndex = 0;
    // line number & column number
    this.line = 0;
    this.column = 0;
    this.rowHeight = 44;
    this.scrollIndexs = [0, 2];
    this.scrollNum = 1;
    this.len = 0;

    this.pageNum = 0;
    this.pageHeight = this.rowHeight * this.viewportRows;

    this.divTemp = '<div class="tw"><span class="m hide">{{m}}</span><span class="d">{{d}}</span></div>';
    this.$table = this.$element.find('table');
    this.$tbody = this.$table.find('tbody');

    this.initTable();

    this.listen();
  };

  CalendarTable.prototype = {

      listen: function () {
        var $container = this.$container
          , selector = this.selector;
        $container
          .on('blur.datepanel', selector, $.proxy(this.blur, this))
          .on('keypress.datepanel', selector, $.proxy(this.keypress, this))
          .on('keyup.datepanel', selector, $.proxy(this.keyup, this))
          .on('keydown.datepanel', selector, $.proxy(this.keydown, this))
          .on('focus.datepanel', selector, $.proxy(this.focus, this))
          .on('click.datepanel', selector, $.proxy(this.click, this))
          .on('mouseenter.datepanel', selector + ' td', $.proxy(this.tdMouseenter, this))
          .on('mouseleave.datepanel', selector + ' td', $.proxy(this.tdMouseleave, this))
          .on('click.datepanel', selector + ' td', $.proxy(this.tdClick, this))
          .on('mousewheel.datepanel', selector, $.proxy(this.mousewheel, this));
      }

    , mousewheel: function (e, delta, deltaX, deltaY) {
        console.log(delta, deltaX, deltaY);
      }

    , tdMouseenter: function (e) {
        //this.$cursor = $(e.currentTarget)
        //  .addClass('hover');
        //this.column = this.$cursor.index();
        //this.line = this.$cursor.parent().index();
        console.log(this.column, this.line);
      }

    , tdMouseleave: function (e) {
      }

    , tdClick: function (e) {
      }

    , blur: function (e) {
        this.removeCursorClass();
      }

    , keyup: function (e) {
        e.stopPropagation();
        e.preventDefault();
      }

    , keyHandler: function (e) {
        var self = this
          , component = self.component
          , kc = e.keyCode;
        switch (kc) {
          case 9: // tab
            e.preventDefault();
            component.emit('calendartable-tab');
            break;
          case 37: // left
            e.preventDefault();
            self.moveLeft();
            break;
          case 38: // top
            e.preventDefault();
            self.moveTop();
            break;
          case 39: // right
            e.preventDefault();
            self.moveRight();
            break;
          case 40: // down
            e.preventDefault();
            self.moveDown();
            break;
          case 13: // enter
            e.preventDefault();
            break;
          case 32: // spacing
            e.preventDefault();
            self.moveSpacing();
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
        this.suppressKeyPressRepeat = !!~R.indexOf([9, 37, 38, 39, 40, 32, 13], e.keyCode);
        this.keyHandler(e);
      }

    , focus: function (e) {
        this.setCursor();
      }

    , click: function (e) {}

    , generateHTML: function (startDate) {
        this.len += 3;
        var vr = this.viewportRows
          , todayString = this.todayString
          , divTemp = this.divTemp
          , i = 0
          , tbody = '';

        for (; i < vr; ++i) {
          var j = 0
            , tr = '<tr>'
            , td = ''
            , fs
            , isToday;

          for (; j < 7; ++j) {
            fs = dateFormat(startDate);

            isToday = fs === todayString;

            td += '<td data-date="' + fs + '"' + (isToday ? ' class="today"' : '') + '>';

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

    , initTable: function () {
        var day = this.date.day
          , y = day.getFullYear()
          , m = day.getMonth()
          , d = day.getDate()
          , dt = day.getDay()
          , date = new Date(y, m, d - dt);

        this.startDate = dateFormat(date);
        this.column = dt;
        this.genNextPage(date);
        this.endDate = dateFormat(date);
        this.$trs = this.$tbody.find('tr');
      }

    // generate previouse page.
    , genPrevPage: function (date) {
        this.$tbody
          .prepend(this.generateHTML(date));
      }

    // generate next page.
    , genNextPage: function (date) {
        this.$tbody
          .append(this.generateHTML(date));
      }

    , setCursor: function () {
        this.$cursor = this.$trs
          .eq(this.line)
          .find('td')
          .eq(this.column)
          .addClass('hover');
      }

    , removeCursorClass: function () {
        this.$cursor.removeClass('hover');
      }

    , moveBefore: function () {
        this.removeCursorClass();
      }

    , moveAfter: function () {
        this.setCursor();
      }

    , selectBefore: function () {
        this.$select.removeClass('selected');
      }

    , select: function () {
        this.$select = this.$cursor
          .addClass('selected');
      }

    , selectAfter: function () {}

    , scroll: function (arrow) {
        var si = this.scrollIndexs
          , x = si[0]
          , y = si[1]
          , l = this.viewportRows
          , len = this.len
          , n = this.scrollNum
          , h = this.rowHeight
          , i = this.line
          , row = this.viewportIndex += arrow;

        console.log(arrow, this.line, x);

        if ((row === x - 1 && i > x)
            || (row === y + 1 && i < len - (l - y))) {
          var t = parseFloat(this.$table.css('margin-top')) || 0;
          this.$table.css('margin-top', t + -arrow * h * n);
          this.viewportIndex = si[(arrow + 1) / 2];
        }
      }

    , moveSpacing: function () {
        if (this.$select) {
          this.selectBefore();
        }

        this.select();

        this.selectAfter();
      }

    , prevRow: function () {
        if (0 === this.line) {
          var date = this.startDate.split('-');
          date = new Date(date[0], +date[1] - 1, +date[2] - 21);
          this.startDate = dateFormat(date);
          this.genPrevPage(date);
          this.$table.css('margin-top', - this.viewportRows * this.rowHeight + 'px');
          this.$trs = this.$tbody.find('tr');
          this.line = 3;
        }
        this.scroll(-1);
        this.line--;
      }

    , nextRow: function () {
        if (this.len - 1 === this.line) {
          var date = this.endDate.split('-');
          date = new Date(date[0], +date[1] - 1, date[2]);
          this.genNextPage(date);
          this.endDate = dateFormat(date);
          this.$trs = this.$tbody.find('tr');
        }
        this.scroll(1);
        this.line++;
      }

    , moveLeft: function () {
        this.moveBefore();

        if (0 === this.column--) {
          this.column = 6;
          this.prevRow();
        }

        this.moveAfter();
      }

    , moveTop: function () {
        this.moveBefore();

        this.prevRow();

        this.moveAfter();
      }

    , moveRight: function () {
        this.moveBefore();

        if (6 === this.column++) {
          this.column = 0;
          this.nextRow();
        }

        this.moveAfter();
      }

    , moveDown: function () {
        this.moveBefore();

        this.nextRow();

        this.moveAfter();
      }

  };


  /**
   * DataController
   */
  var DataController = function (component) {
  };


  // Helper:
  var dateFormat = function (date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  };

  return DatePanel;
});
