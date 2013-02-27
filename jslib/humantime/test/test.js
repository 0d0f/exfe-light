define(function (require) {
  var humantime = require('humantime')
    , lead0 = humantime.lead0
    , printEFTime = humantime.printEFTime;

  describe('humantime', function () {
    beforeEach(function () {
      //console.log('############### START ####################');
    });

    afterEach(function () {
      //console.log('############### END #####################');
    });

    it('Today, Token -1', function () {
      var eft = {
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
      var t = humantime.toLocaleDate(eft);
      var s = humantime(t.date, new Date());
      expect(s).to.equal('Today');
      //console.log(s);
    });

    it('Not Today, only has `date`, Token -1', function () {
      var eft = {
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
        , outputformat: 0
        , id: 0
        , type: 'CrossTime'
      };
      var now = new Date();
      var now2 = new Date(+now);
      now2.setDate(now2.getDate() - 1);
      eft.begin_at.date = now2.getFullYear() + '-' + lead0(now2.getMonth() + 1) + '-' + lead0(now2.getDate());
      var t = humantime.toLocaleDate(eft);
      var s = humantime(t.date, now);
      expect(s).to.equal('Yesterday');
      //console.log(s);
    });

    it('Not Today, has `date`+`time` Token -1', function () {
      var eft = {
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
        , outputformat: 0
        , id: 0
        , type: 'CrossTime'
      };
      var now = new Date();
      var now2 = new Date(+now);
      now2.setDate(now2.getDate() - 1);
      eft.begin_at.date = now2.getFullYear() + '-' + lead0(now2.getMonth() + 1) + '-' + lead0(now2.getDate());
      eft.begin_at.time = lead0(now2.getHours()) + ':' + lead0(now2.getMinutes()) + ':' + lead0(now2.getSeconds());
      var t = humantime.toLocaleDate(eft);
      var s = humantime(t.date, new Date());
      expect(s).to.equal('Today');
      //console.log(s);
    });

    it('Token 0, years + months ago', function () {
      var now = new Date();
      var s = humantime(new Date(now.getFullYear() - 3, now.getMonth() + 3, now.getDate()), now);
      expect(s).to.equal('2 years 9 months ago');
      //console.log(s);
    });

    it('Token 0, years ago', function () {
      var now = new Date();
      var s = humantime(new Date(now.getFullYear() - 3, now.getMonth(), now.getDate()), now);
      expect(s).to.equal('3 years ago');
      //console.log(s);
    });

    it('Token 0, months ago', function () {
      var now = new Date();
      var s = humantime(new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()), now);
      expect(s).to.equal('3 months ago');
      //console.log(s);
    });

    it('Token 1, Yesterday', function () {
      var now = new Date(), t;
      var s = humantime(t = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, now.getHours(), now.getMinutes(), now.getMilliseconds()), now);
      expect(s).to.equal('Yesterday');
      //console.log(s);
    });

    it('Token 1, Two days ago', function () {
      var now = new Date(), t;
      var s = humantime(t = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, now.getHours(), now.getMinutes(), now.getMilliseconds()), now);
      expect(s).to.equal('Two days ago');
      //console.log(s);
    });

    it('Token 1, 7 days ago', function () {
      var now = new Date(), t;
      var s = humantime(t = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, now.getHours(), now.getMinutes(), now.getMilliseconds()), now);
      expect(s).to.equal('7 days ago');
      //console.log(s);
    });

    it('Token 2, Yesterday', function () {
      var now = new Date(), t;
      now.setHours(11);
      t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getMilliseconds())
      t.setHours(t.getHours() - 13);
      var s = humantime(t, now);
      //console.log(now, t);
      expect(s).to.equal('Yesterday');
      //console.log(s);
    });

    it('Token 2, 11 hours ago', function () {
      var now = new Date(2013, 10, 1, 23, 45), t;
      t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 45, now.getMilliseconds())
      var s = humantime(t, now);
      //console.log(now, t);
      expect(s).to.equal('11 hours ago');
      //console.log(s);
    });

    it('Token 3, 1.5 hours ago', function () {
      var now = new Date(2013, 10, 1, 9, 45), t;
      t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 15, now.getMilliseconds())
      var s = humantime(t, now);
      //console.log('Token 3, 1.5 hours ago', s, (+t - +now) / 60000);
      expect(s).to.equal('1.5 hours ago');
    });

    it('Token 4, An hour ago', function () {
      var now = new Date(), t;
      t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getMilliseconds())
      t.setMinutes(t.getMinutes() - 77);
      var s = humantime(t, now);
      expect(s).to.equal('An hour ago');
      //console.log(s, (+t - +now) / 60000);
    });

    it('Token 5, 45 minutes ago', function () {
      var now = new Date(2013, 10, 1, 9, 45), t;
      t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, now.getMilliseconds())
      var s = humantime(t, now);
      expect(s).to.equal('45 minutes ago');
    });

    it('Token 5, X Just Now', function () {
      var now = new Date(2013, 10, 1, 9, 45), t;
      t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, now.getMilliseconds())
      var s = humantime(t, now, 'X');
      expect(s).to.equal('Just now');
    });

    it('Token 6, 25 minutes ago', function () {
      var now = new Date(2013, 10, 1, 9, 45), t;
      t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 20, now.getMilliseconds())
      var s = humantime(t, now);
      expect(s).to.equal('25 minutes ago');
    });

    it('Token 6, X Now', function () {
      var now = new Date(2013, 10, 1, 9, 45), t;
      t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 20, now.getMilliseconds())
      var s = humantime(t, now, 'X');
      expect(s).to.equal('Now');
    });

    it('Token 7, Seconds ago', function () {
      var now = new Date(2013, 10, 1, 9, 45), t;
      t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 45, now.getMilliseconds())
      var s = humantime(t, now);
      expect(s).to.equal('Seconds ago');
    });


    it('Token 7, X Now', function () {
      var now = new Date(2013, 10, 1, 9, 45), t;
      t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 45, now.getMilliseconds())
      var s = humantime(t, now, 'X');
      expect(s).to.equal('Now');
    });

    it('Token 8, In 15 minutes', function () {
      var now = new Date(2013, 10, 1, 9, 45), t;
      t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, now.getMilliseconds())
      var s = humantime(t, now);
      expect(s).to.equal('In 15 minutes');
    });

    it('Token 9, In one hour', function () {
      var now = new Date(2013, 10, 1, 9, 45), t;
      t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 46, now.getMilliseconds())
      var s = humantime(t, now);
      expect(s).to.equal('In one hour');
    });

    it('Token 10, In 1.5 hours', function () {
      var now = new Date(2013, 10, 1, 9, 45), t;
      t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 30, now.getMilliseconds())
      var s = humantime(t, now);
      //console.log(s, (+t - +now) / 60000);
      expect(s).to.equal('In 1.5 hours');
    });

    it('Token 11, Tomorrow', function () {
      var now = new Date(2013, 10, 1, 23, 45), t;
      t = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 13, 30, now.getMilliseconds())
      //console.log(now, t);
      var s = humantime(t, now);
      expect(s).to.equal('Tomorrow');
    });

    it('Token 11, In 7 hours', function () {
      var now = new Date(2013, 10, 1, 9, 45), t;
      t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 45, now.getMilliseconds())
      var s = humantime(t, now);
      expect(s).to.equal('In 7 hours');
    });

    it('Token 12, Tomorrow', function () {
      var now = new Date(2013, 10, 1, 9, 45), t;
      t = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 45, now.getMilliseconds())
      var s = humantime(t, now);
      expect(s).to.equal('Tomorrow');
    });

    it('Token 12, In two days', function () {
      var now = new Date(2013, 10, 1, 9, 45), t;
      t = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 9, 45, now.getMilliseconds())
      var s = humantime(t, now);
      expect(s).to.equal('In two days');
    });

    it('Token 12, Wed. in 7 days', function () {
      var now = new Date(2013, 1, 6, 9, 45), t;
      t = new Date(now.getFullYear(), now.getMonth(), 13, 9, 45, now.getMilliseconds())
      //console.log(now, t);
      var s = humantime(t, now);
      expect(s).to.equal('Wed. in 7 days');
    });

    it('Token 13, In 1 year', function () {
      var now = new Date(2013, 1, 6, 9, 45), t;
      t = new Date(now.getFullYear() + 1, now.getMonth(), 6, 9, 45, now.getMilliseconds())
      //console.log(now, t);
      var s = humantime(t, now);
      expect(s).to.equal('In 1 year');
    });

    it('Token 13, In 2 years', function () {
      var now = new Date(2013, 1, 6, 9, 45), t;
      t = new Date(now.getFullYear() + 2, now.getMonth(), 6, 9, 45, now.getMilliseconds())
      //console.log(now, t);
      var s = humantime(t, now);
      expect(s).to.equal('In 2 years');
    });

    it('Token 13, In 2 years 7 months', function () {
      var now = new Date(2013, 1, 1, 9, 45), t;
      t = new Date(now.getFullYear() + 2, 8, 6, 9, 45, now.getMilliseconds())
      //console.log(now, t);
      var s = humantime(t, now);
      expect(s).to.equal('In 2 years 7 months');
    });

    it('Origin', function () {
      var eft = {
          begin_at: {
              date_word: ''
            , date: ''
            , time_word: ''
            , time: ''
            , timezone: ''
            , id: 0
            , type: 'EFTime'
          }
        , origin: 'origin Datetime'
        , outputformat: 1
        , id: 0
        , type: 'CrossTime'
      };
      var a = printEFTime(eft);
      expect(a.title).to.equal(eft.origin);
      expect(a.content).to.equal(eft.origin);
    });

    it('Origin, `date` + `time`', function () {
      var eft = {
          begin_at: {
              date_word: ''
            , date: ''
            , time_word: ''
            , time: ''
            , timezone: ''
            , id: 0
            , type: 'EFTime'
          }
        , origin: 'origin Datetime'
        , outputformat: 1
        , id: 0
        , type: 'CrossTime'
      };
      var now = new Date();
      var now2 = new Date(+now);
      now2.setDate(now2.getDate() - 2);
      //now2.setMinutes(now2.getMinutes() - 77);
      eft.begin_at.date = now2.getFullYear() + '-' + lead0(now2.getMonth() + 1) + '-' + lead0(now2.getDate());
      eft.begin_at.time = lead0(now2.getHours()) + ':' + lead0(now2.getMinutes()) + ':' + lead0(now2.getSeconds());
      //console.log(now, now2);
      var a = printEFTime(eft);
      expect(a.title).to.equal(eft.origin);
      expect(a.content).to.equal('Yesterday');
    });

    it('`date`', function () {
      var eft = {
          begin_at: {
              date_word: ''
            , date: ''
            , time_word: ''
            , time: ''
            , timezone: ''
            , id: 0
            , type: 'EFTime'
          }
        , origin: 'origin Datetime'
        , outputformat: 0
        , id: 0
        , type: 'CrossTime'
      };
      var now = new Date();
      var now2 = new Date(+now);
      now2.setDate(now2.getDate() - 1);
      eft.begin_at.date = now2.getFullYear() + '-' + lead0(now2.getMonth() + 1) + '-' + lead0(now2.getDate());
      eft.begin_at.time = lead0(now2.getHours()) + ':' + lead0(now2.getMinutes()) + ':' + lead0(now2.getSeconds());
      var a = printEFTime(eft);
      //console.log('date', a);
      //expect(a.title).to.equal(a.content);
    });

    it('`time`', function () {
      var eft = {
          begin_at: {
              date_word: ''
            , date: ''
            , time_word: ''
            , time: ''
            , timezone: ''
            , id: 0
            , type: 'EFTime'
          }
        , origin: 'origin Datetime'
        , outputformat: 0
        , id: 0
        , type: 'CrossTime'
      };
      var now = new Date();
      var now2 = new Date(+now);
      now2.setMinutes(now2.getMinutes() - 77);
      eft.begin_at.time = lead0(now2.getHours()) + ':' + lead0(now2.getMinutes()) + ':' + lead0(now2.getSeconds());
      var a = printEFTime(eft);
      expect(a.title).to.equal(a.content);
    });

    it('`dateword` + `timeword`', function () {
      var eft = {
          begin_at: {
              date_word: 'Someday'
            , date: ''
            , time_word: 'Dinner'
            , time: ''
            , timezone: ''
            , id: 0
            , type: 'EFTime'
          }
        , origin: 'origin Datetime'
        , outputformat: 0
        , id: 0
        , type: 'CrossTime'
      };
      var a = printEFTime(eft);
      //console.log(a);
      //expect(a.title).to.equal(a.content);
    });

    it('`date` = 2013-x-xx', function () {
      var eft = {
          begin_at: {
              date_word: ''
            , date: '2012-1-12'
            , time_word: ''
            , time: ''
            , timezone: ''
            , id: 0
            , type: 'EFTime'
          }
        , origin: 'origin Datetime'
        , outputformat: 0
        , id: 0
        , type: 'CrossTime'
      };
      var now = new Date();
      eft.begin_at.date = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + (now.getDate() - 1);
      var a = printEFTime(eft);
      expect(a.title).to.equal('Yesterday');
    });

    it('`date` = 2013-x-xx, `time` = 8:2:3', function () {
      var eft = {
          begin_at: {
              date_word: ''
            , date: '2013-1-12'
            , time_word: ''
            , time: '8:3:2'
            , timezone: ''
            , id: 0
            , type: 'EFTime'
          }
        , origin: 'origin Datetime'
        , outputformat: 0
        , id: 0
        , type: 'CrossTime'
      };
      var now = new Date();
      eft.begin_at.date = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + (now.getDate() - 1);
      console.dir(eft);
      var a = printEFTime(eft);
      console.log(a);
    });

    it('`date` = 2013-01-25, `time` = 14:40:00', function () {
      var eft = {
          begin_at: {
              date_word: ''
            , date: '2013-01-25'
            , time_word: ''
            , time: '14:40:00'
            , timezone: '+08:00'
            , id: 0
            , type: 'EFTime'
          }
        , origin: 'origin Datetime'
        , outputformat: 0
        , id: 0
        , type: 'CrossTime'
      };
      var now = new Date();
      var a = printEFTime(eft);
      console.log(a);
    });

    it('`date` = 2013-03-01, `time` = 18:00:00', function () {
      var eft = {
          begin_at: {
            date_word: "", 
            date: "2013-03-01",
            time_word: "",
            time: "18:00:00",
            timezone: "-05:00 EST",
            id: 0,
            type: "EFTime"
          },
          id: 0,
          origin: "2013-03-01 13:00",
          outputformat: 0,
          type: "CrossTime"
        };
      var now = new Date();
      var a = printEFTime(eft);
      console.log(a);
    });

    it('`date` = 2013-03-01, `time` = 18:00:00', function () {
      var eft = {
          begin_at: {
            date_word: "", 
            date: "2013-03-01",
            time_word: "",
            time: "18:00:00",
            timezone: "+08:00 CST",
            id: 0,
            type: "EFTime"
          },
          id: 0,
          origin: "2013-03-01 13:00",
          outputformat: 0,
          type: "CrossTime"
        };
      var now = new Date();
      var a = printEFTime(eft);
      console.log(a);
    });
  });
});
