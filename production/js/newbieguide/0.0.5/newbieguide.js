define(function (require) {
  'use strict';

  var Store = require('store');

  // Profile Page, Newbie Guide

  var newbieGuide = [
    '<div class="x-tmp newbie nbg-0">Gather a <span class="x">·X·</span> here</div>',

    '<div class="x-tmp newbie nbg-1">'
      + '<div class="newbie-close"><i class="icon14-clear"></i></div>'
      + '<p>Here lists your contacts (a.k.a. identities). Email, mobile number and your accounts on Facebook, Twitter, <span class="strike">Google, etc</span> (to be supported). Add more identities to participate gathering as particular one you want, or use them to receive notification.</p>'
    + '</div>',

    '<div class="x-tmp newbie nbg-2">'
      + '<div class="newbie-close"><i class="icon14-clear"></i></div>'
      + '<h4>List of <span class="x">·X·</span> <small>(cross)</small></h4>'
      + '<p><span class="x">·X·</span> is a gathering, for things to do together.</p>'
      + '<p><span class="x">·X·</span> is private by default, everything inside is accessible to only invited attendees.</p>'
      + '<p>Got empty list? <span class="x-sign">EXFE</span> friends for meetings, parties, sports, trips, etc. Anything you want to gather friends to do.</p>'
      + '<div class="nbg-f"><span class="pointer gatherax"><span class="bb">Gather a </span><span class="bb x">·X·</span></span> now!</div>'
    + '</div>',

    '<div class="x-tmp newbie nbg-3 hide">'
      + '<div class="newbie-close"><i class="icon14-clear"></i></div>'
      + '<p>No invitation for you,<br /> yet.</p>'
    + '</div>'

  ];

  $(newbieGuide[0]).insertBefore($('.user-panel .xbtn-gather'));

  $(newbieGuide[1]).insertAfter($('.settings-panel'));

  $(newbieGuide[2]).appendTo($('.gr-a'));

  var nbg3 = $(newbieGuide[3]).appendTo($('.gr-b .invitations').removeClass('hide'));

  if (!$('.gr-b .invitations').find('.cross-list').size()) {
    nbg3.removeClass('hide');
  }

  $(document)
    .off('*.newbie')
    .on('hover.newbie', '.newbie', function (e) {
      var t = e.type, z = $(this).data('ozIndex');
      if (t === 'mouseenter') {
        !z && $(this).data('ozIndex', $(this).css('z-index'));
        $(this).css('z-index', z + 2);
      } else {
        $(this).css('z-index', z);
      }
    })

    .on('click.newbie', '.newbie > .newbie-close', function (e) {
      e.preventDefault();
      var authorization = Store.get('authorization');
      if (!authorization) { return; }
      var user_id = authorization.user_id;
      Store.set('newbie_guide:' + user_id, 1);
      var p = $(this).parent();
      p.fadeOut(function () {

        if (p.hasClass('nbg-3')) {
          if (!p.parent().find('.cross-list').length) {
            p.parent().addClass('hide');
          }
        }

        $(this).remove();
      });
    })

    .on('webkitAnimationEnd.newbie oanimationend.newbie MSAnimationEnd.newbie animationend.newbie', '.nbg-0', function () {
      $(this).removeClass('bouncey');
    })

    .on('click.newbie', '.newbie .gatherax', function (e) {
      e.preventDefault();
      $('.navbar .dropdown-wrapper').trigger('mouseenter.dropdown');
      $(window).scrollTop(0);
      $('.nbg-0').addClass('bouncey');
    });
});
