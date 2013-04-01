define('util', function () {
  "use strict";
  var trimLeft = /^\s+/,
      trimRight = /\s+$/,
      zh_CN = /[^0-9a-zA-Z_\u4e00-\u9fa5\ \'\.]+/g,
      trim = String.prototype.trim;

  var Util = {

    // Display Name: 0-9 a-zA-Z _ CJK字符 ' . 空格
    zh_CN: zh_CN,

    // 30个字符，并且删除中文字符
    cut30length: function (s) {
      return s.replace(zh_CN, ' ').substring(0, 30);
    },

    // https://gist.github.com/2762686
    utf8length: function (s) {
      var len = s.length, u8len = 0, i = 0, c;
      for (; i < len; i++) {
        c = s.charCodeAt(i);
        if (c < 0x007f) { // ASCII
          u8len++;
        } else if (c <= 0x07ff) {
          u8len += 2;
        } else if (c <= 0xd7ff || 0xe000 <= c) {
          u8len += 3;
        } else if (c <= 0xdbff) { // high-surrogate code
          c = s.charCodeAt(++i);
          if (c < 0xdc00 || 0xdfff < c) {// Is trailing char low-surrogate code?
            throw "Error: Invalid UTF-16 sequence. Missing low-surrogate code.";
          }
          u8len += 4;
        } else /*if (c <= 0xdfff)*/ { // low-surrogate code
          throw "Error: Invalid UTF-16 sequence. Missing high-surrogate code.";
        }
      }
      return u8len;
    },

    // Remove whitespace
    trim: trim ?
      function (s) {
        return s === null ?
          '':
          trim.call(s);
      } :
      function (s) {
        return s === null ?
          '' :
          s.toString().replace(trimLeft, '').replace(trimRight, '');
      },

    // parse phone
    parsePhone: function () {
      var reg = /^(\+)?((?:(86)?(1(?:3\d|4[57]|5\d|8\d)\d{8}))|(?:(1)?(\d{5,15})))$/;
      return function _p(strid) {

      };
    },

    // 解析 用户身份
    parseId: function () {
      var facebook = /^([a-z0-9_\.]{1,})@facebook$/i,
          twitter = /^@([a-z0-9_]{1,15})$|^@?([a-z0-9_]{1,15})@twitter$/i,
          instagram = /^([a-z0-9_\.]{1,})@instagram$/i,
          dropbox = /^(.*)@dropbox$/i,
          flickr = /^(.*)@flickr$/i,
          normal = /^[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
          enormal = /^[^@]*<[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?>$/i,
          phone = /^(\+)?((?:(86)?(1(?:3\d|4[57]|5\d|8\d)\d{8}))|(?:(1)?(\d{5,15})))$/;

      return function p(strid) {
        var res = {}, m;
        strid = Util.trim(strid);

        if ((m = strid.match(dropbox)) && (normal.test(m[1]))) {
          res.name = m[1];
          res.external_username = m[1];
          res.provider = 'dropbox';
        }

        // flickr
        else if ((m = strid.match(flickr))) {
          res.name = m[1];
          res.external_username = m[1];
          res.provider = 'flickr';
        }

        // instagram
        else if ((m = strid.match(instagram))) {
          res.name = m[1];
          res.external_username = m[1];
          res.provider = 'instagram';
        // facebook
        } else if ((m = strid.match(facebook))) {
          res.name = m[1];
          res.external_username = m[1];
          res.provider = 'facebook';

        // twitter
        } else if ((m = strid.match(twitter))) {
          res.name = m[1] || m[2];
          res.external_username = res.name;
          res.provider = 'twitter';

        // normal
        } else if (normal.test(strid)) {
          res.name = Util.cut30length(strid.split('@')[0]);
          res.external_username = strid;
          res.provider = 'email';

        // enormal
        } else if (enormal.test(strid)) {
          var iLt = strid.indexOf('<');
              //iGt = strid.indexOf('>');
          res.name = Util.cut30length(strid.substring(0, iLt).replace(/^"|^'|"$|'$/g, ''));
          //res.external_identity = strid.substring(++iLt, iGt);
          res.external_username = res.name
          res.provider = 'email';

        } else if ((m = strid.replace(/[\s\-\(\)\_]/g, '').match(phone))) {
          var flag = m[1], zone, n;
          res.provider = 'phone';
          if (flag) {
            if (m[3] && m[4]) {
              zone = m[3];
              n = m[4];
              res.name = res.external_username = flag + zone + n;
            } else if (m[5] && m[6]) {
              zone = m[5];
              n = m[6];
              res.name = res.external_username = flag + zone + n;
            } else {
              res.name = strid;
              res.provider = null;
            }
          } else {
            flag = '+';
            if (m[4]) {
              zone = '86';
              n = m[4];
            } else {
              zone = '1';
              n = m[2];
            }
            res.name = res.external_username = flag + zone + n;
          }
        } else {
          res.name = strid;
          res.provider = null;
        }

        return res;
      }

    }(),

    tokenRegExp: /token=([a-zA-Z0-9]{32})/,

    printExtUserName: function (identity, status) {
      var username = identity.external_username,
          provider = identity.provider;

      switch (provider) {
      case 'twitter':
        username = '@' + username + '@' + provider;
        break;

      case 'facebook':
      case 'instagram':
      case 'flickr':
      case 'dropbox':
        username += '@' + provider;
        break;

      case 'phone':
        if (status) {
          if (/^\+1\d{10}$/.test(username)) {
            username = username.replace(/^(\+1)(\d{3})(\d{3})(\d{4})$/, '$1 ($2) $3-$4');
          } else if (/^\+86\d{11}$/.test(username)) {
            username = username.replace(/^(\+86)(\d{3})(\d{4})(\d{4})$/, '$1 $2 $3 $4');
          }
        }
        break;
      }

      return username;
    }

  };

  return Util;

});
