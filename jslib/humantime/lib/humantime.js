/**
 * Humantime.js
 * Relative/absolute time.
 *
 * Referrers:
 *  https://github.com/fnando/i18n-js
 *  https://en.wikipedia.org/wiki/ECMAScript
 *  ISO 8601 http://www.w3.org/TR/NOTE-datetime
 *  https://en.wikipedia.org/wiki/ISO_8601
 *  https://en.wikipedia.org/wiki/Unix_time
 *  http://tools.ietf.org/html/rfc3339
 *    UTC YYYY-MM-DDTHH:MM:SSZ 2012-10-01T20:30:33+0800
 */
"use strict";

// Set the placeholder format. Accepts `{{placeholder}}` and `%{placeholder}`.
var PLACEHOLDER = /(?:\{\{|%\{)(\w*?)(?:\}\}?)/gm;

var ISO8601_DATE = 'YYYY-MM-DD';

var N2 = 0.2
  , N9 = 0.9999
  , N6 = 6e4;

var DATEOUTPUTFORMATS = [];

var EN = {
    monthsShort: 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ')
  , months: 'January February March April May June July August September October November December'.split(' ')
  , weekdaysShort: 'Sun Mon Tue Wed Thu Fri Sat'.split(' ')
  , weekdays: 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' ')

  , '-1': function () {
      return 'Today';
    }

  , '0': function (date) {
      var s = '', y = date['years'], m = date['months'];
      if (y) {
        s = '{{years}} year' + (y === 1 ? '' : 's');
      }
      if (m) {
        s += (s ? ' ' : '') + '{{months}} month' + (m === 1 ? '' : 's');
      }
      return s + ' ago';
    }

  , '1': function (date) {
      var s = '', d = date.days;
      if (1 === d) {
        s = 'Yesterday'
      } else if (2 === d) {
        s = 'Two days ago';
      } else {
        s = '{{days}} days ago'
      }
      return s;
    }

  , '2': function (date) {
      var s = '', isToday = date.isToday, h = date.hours;
      if (!isToday && h >= 12) {
        s = 'Yesterday';
      } else {
        s = '{{hours}} hours ago';
      }
      return s;
    }

  , '3': function () {
      return '1.5 hours ago';
    }

  , '4': function () {
      return 'An hour ago';
    }

  , '5': function (date, type) {
      return 'X' === type ? 'Just now' : '{{minutes}} minutes ago';
    }

  , '6': function (date, type) {
      return 'X' === type ? 'Now' : '{{minutes}} minutes ago';
    }

  , '7': function (date, type) {
      return 'X' === type ? 'Now' : 'Seconds ago';
    }

  , '8': function () {
      return 'In {{minutes}} minutes';
    }

  , '9': function () {
      return 'In one hour';
    }

  , '10': function () {
      return 'In 1.5 hours';
    }

  , '11': function (date) {
      var s = '', isToday = date.isToday, h = date.hours;
      if (!isToday && h >= 12) {
        s = 'Tomorrow';
      } else {
        s = 'In {{hours}} hours';
      }
      return s;
    }

  , '12': function (date) {
      var s = '', d = date.days, day = date.day;
      if (1 === d) {
        s = 'Tomorrow';
      } else if (2 === d) {
        s = 'In two days';
      } else {
        s = EN.weekdaysShort[day] + '. in {{days}} days';
      }
      return s;
    }

  , '13': function (date) {
      var s = '', y = date['years'], m = date['months'];
      if (y) {
        s = '{{years}} year' + (y === 1 ? '' : 's');
      }
      if (m) {
        s += (s ? ' ' : '') + '{{months}} month' + (m === 1 ? '' : 's');
      }
      return 'In ' + s;
    }
  };

var HumanTime = function (t, s, type, c) {
  var lang = HumanTime.locales[HumanTime.locale]
    , distanceTime = HumanTime.distanceOfTime(t, s)
    , input = HumanTime.diff(distanceTime)
    , output;

  input.type = type;

  output = HumanTime.inWords(input, lang);

  if ('function' === typeof c) {
    output = c(output.data);
  }

  return output;
};

var SETTINGS = HumanTime.settings = {
  weekStartAt: 1
};

HumanTime.locale = 'en';

HumanTime.locales = {
  en: EN
};

HumanTime.inWords = function (input, lang) {
  var token = lang[input.token]
    , type = input.type
    , date = input.date
    , message;

  if ('function' === typeof token) {
    message = token(date, type);
  } else {
    message = token;
  }

  return _replace(message, date);
};

HumanTime.diff = function (distanceTime) {
  var t = distanceTime.target
    //, s = distanceTime.source
    , ms = distanceTime.distance
    , m = floor(ms / N6)
    , days, months, years, hours, minutes, day
    , output = { date: {} }
    , date = output.date;

  date.isToday = distanceTime.isToday

  // 有日期无时间
  if (t._isToday) {
    output.token = -1;
  }

  // m <= -43200
  else if (m < -43199) {
    output.token = 0
    years = floor(-m / 525949);
    months = floor(-m % 525949 / 43829 + N2);
  }

  // m <= -2880
  //else if (m < -2879) {
    //output.token = 1;
    //days = floor(m / 1440 + N9);
  //}

  // m <= -1440
  else if (m < -1439) {
    output.token = 1;
    days = floor(-m / 1440 + N9);
  }

  // m <= -108
  else if (m < -107) {
    output.token = 2;
    hours = floor(-m / 60 + N2);
  }

  // m <= -82
  else if (m < -81) {
    output.token = 3;
  }

  // m <= 60
  else if (m < -59) {
    output.token = 4;
  }

  // m <= -30
  else if (m < -29) {
    output.token = 5;
    minutes = -m;
  }

  // m <= -1
  else if (m < 0) {
    output.token = 6;
    minutes = -m;
  }

  // 0 m
  else if (0 === m) {
    output.token = 7;
  }

  // 1 m <= x <= 59 m
  else if (m < 60) {
    output.token = 8;
    minutes = m;
  }

  // 60 m <= x <= 81 m
  else if (m < 82) {
    output.token = 9;
  }

  // 82 m <= x <= 107 m
  else if (m < 108) {
    output.token = 10;
  }

  // 108 m <= x <= 719 m
  //else if (m < 720) {
    //output.token = 11;
  //}

  // 720 m <= x <= 1439 m
  else if (m < 1440) {
    output.token = 11;
    hours = floor(m / 60 + N2);
  }

  // 1440 m <= x <= 2879 m
  //else if (m < 2880) {
    //output.token = 12;
  //}

  // 2880 m <= x <= 43199 m
  else if (m < 42300) {
    output.token = 12;
    days = floor(m / 1440 + N9);
    day = t.getDay();
  }

  // x >= 43200
  else {
    output.token = 13;
    years = floor(m / 525949);
    months = floor(m % 525949 / 43829 + N2);

    if (12 === months) {
      months = 0;
      years++;
    }
  }

  if (years) { date.years = years; }

  if (months) { date.months = months; }

  if (days) { date.days = days; }

  if (hours) { date.hours = hours; }

  if (minutes) { date.minutes = minutes; }

  if (day) { date.day = day; }

  return output;
};

HumanTime.distanceOfTime = function (t, s) {
  if (!t) {
    t = new Date();
  } else if ('number' === typeof t) {
    t = new Date(t);
  } else if ('string' === typeof t) {
    t = parseISO(toISO(t));
  }

  if (!s) {
    s = new Date();
  } else if ('number' === typeof s) {
    s = new Date(s);
  } else if ('string' === typeof s) {
    s = parseISO(toISO(s));
  }

  // 有日期无时间，日期不相同
  if (t._reTime) {
    s.setHours(0);
    s.setMinutes(0);
    s.setSeconds(0);
    s.setMilliseconds(0);
  }

  return {
      // target datetime
      target: t
      // source datetime
    , source: s
      // millseconds
    , distance: +t - +s

    , isToday: (t.getFullYear() === s.getFullYear())
        && (t.getMonth() === s.getMonth())
        && (t.getDate() === s.getDate())
    };
};

/*
  Converts ISO8601 datetime to locale datetime.
  ES5 supprots ISO8601 datetime:
      1. var d0 = '2012-08-06T23:30:00+08:00'
      2. var d1 = '2012-08-06T23:30:00+0800'
  The moden browsers supports Date.parse(datetime), but opera-v12 not supports 1, must be 2
  */
var parseISO = HumanTime.parseISO = function (s) {
  return new Date(Date.parse(s));
};

// Normal datetime => ISO8601 datetime
// "2012-09-12 09:51:04 +0000" => "2012-09-12T09:51:04+00:00"
var toISO = HumanTime.toISO = function (s) {
  return s.replace(/\s/, 'T').replace(/\s/, '')
    .replace(/([+\-]\d\d)(?::?)(\d\d)/, '$1:$2');
};

// converts the eftime to the locale Date
HumanTime.toLocaleDate = function (eft) {
  var opf = eft.outputformat
    , now = new Date()
    , today = now.getFullYear() + '-' + lead0(now.getMonth() + 1) + '-' + lead0(now.getDate())
    , isToday = false
    , reTime = false
    , d
    , de
    , ds;
  if (opf) {
    d = now;
    ds = today;
    isToday = true;
  }
  else {
    var b = eft.begin_at
      , bd = b.date
      , bt = b.time
      , btz = b.timezone
      , s = '';

    if (bd) {
      s = bd;
    } else {
      s = today
    }

    if (bt) {
      s += 'T' + bt;
    } else {
      isToday = s === today;
      reTime = !isToday;
    }

    if (bd && bt && btz) {
      s += 'Z';
    }

    d = parseISO(s);
    if (reTime) {
      d.setHours(0);
      d.setMinutes(0);
      d.setSeconds(0);
      d.setMilliseconds(0);
    }
    de = ds = d.getFullYear() + '-' + lead0(d.getMonth() + 1) + '-' + lead0(d.getDate());
    ds += bt ? ' ' + lead0(d.getHours()) + ':' + lead0(d.getMinutes()) + ':' + lead0(d.getSeconds()) : '';
  }

  d._isToday = isToday || de === today;
  d._reTime = reTime;

  return {
    date: d
  , text: ds
  };
};


var FUNS = {
    date: function (y, m, d, day) {
      var lang = HumanTime.locales[HumanTime.locale];
      return lang.weekdaysShort[day] + ', ' + lang.monthsShort[m] + ' ' + d;
    }

  , time: function (h, m) {
      var _h = h > 12 ? h - 12 : h;
      var s = _h + ':' + lead0(m);
      s += h >= 12 ? 'PM' : 'AM';
      return s;
    }
  };

// EFTime display
HumanTime.printEFTime = function (eft, type, funs) {
  var opt = eft.outputformat
    , ba = eft.begin_at
    , isX = 'X' === type
    , output = {
        title: ''
      , content: ''
      }
    , origin
    , t
    , d
    , now = new Date()
    , tz;

  if (opt) {
    origin = eft.origin
      .replace(/^['"‘’“”“”‚„]+/, '')
      .replace(/['"‘’“”“”‚„]+$/, '');
    if (isX) {
      output.content = origin;
    }
    else {
      output.title = origin;
      if (ba.date) {
        eft.outputformat = 0;
        t = HumanTime.toLocaleDate(eft);
        output.content = HumanTime(t.date, now);
        eft.outputformat = 1;
      }
    }
  }
  else {
    if (!funs) {
      funs = FUNS;
    }
    if (ba) {
      if (ba.date || ba.time) {
        t = HumanTime.toLocaleDate(eft);
        d = t.date;

        if (ba.date) {
          output.title = HumanTime(t.date, now, 'X');
          output.content = ba.time_word
            + (ba.time_word && ba.time ? ' ' : '') + (ba.time ? funs.time(d.getHours(), d.getMinutes()) : '') + (ba.time || ba.time_word ? (ba.time ? ' ' : ', ') : '')
            + funs.date(d.getFullYear(), d.getMonth(), d.getDate(), d.getDay())
            + (ba.date_word ? ' ' : '')
            + ba.date_word;
        }
        else if (ba.time) {
          output.content = output.title = ba.time_word + (ba.time_word ? ' ' : '')
              + funs.time(d.getHours(), d.getMinutes())
            + (ba.date_word ? ', ' : '')
            + ba.date_word;
        }

        if (d.getFullYear() !== now.getFullYear()) {
          output.content +=  ' ' + d.getFullYear();
        }
      } else if (ba.date_word || ba.time_word) {
        output.content = output.title = ba.time_word + (ba.time_word ? ', ' : '') + ba.date_word;
      }
    }

    if (ba.timezone) {
      tz = ba.timezone.replace(/^([+\-]\d\d:\d\d)[\w\W]*$/, '$1');
      if (tz !== getTimezone(now)) {
        output.content += ' ' + ba.timezone;
      }
    }
  }

  return output;
};

// get locale timezone
var getTimezone = HumanTime.getTimezone = function (date) {
  var offset, h, m, a;
  if (!date) { date = new Date(); }
  offset = date.getTimezoneOffset();
  a = offset <= 0 ? '+' : '-';
  offset = Math.abs(offset);
  h = floor(offset / 60);
  m = offset - h * 60;
  return a + lead0(h) + ':' + lead0(m);
};

HumanTime.createEFTime = function () {
  return {
      begin_at: {
          date_word: ''
        , date: ''
        , time_word: ''
        , time: ''
        , timezone: ''
        , id: 0
        , type: 'EFTime'
      }
    , origin: ''
    , outputformat: 1
    , id: 0
    , type: 'CrossTime'
  };
};

  // 3 -> '003'
var lead0 = HumanTime.lead0 = function (n, p) {
    n = '' + n;
    if (!p) { p = 2; }
    while (n.length < p) {
      n = '0' + n;
    }
    return n;
  }

//, formatDate = HumanTime.formatDate = function (d, t) { }

, _replace = function (mess, data) {
    var ms = mess.match(PLACEHOLDER)
      , i = 0
      , regex
      , name
      , value
      , placeholder;

    if (ms) {
      for (; placeholder = ms[i]; ++i) {
        name = placeholder.replace(PLACEHOLDER, '$1');
        value = data[name];
        regex = new RegExp(placeholder.replace(/\{/gm, '\\{').replace(/\}/gm, '\\}'));
        mess = mess.replace(regex, value);
      }
    }
    return mess;
  }

, floor = function (n) {
    return n - n % 1;
  };
