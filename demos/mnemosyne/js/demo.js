define(function (require) {
  //console.log('Demo ...');
  var data = JSON.parse(photos);
  var ViewWidget = require('mnemosyne');
  var view = new ViewWidget($('.mnem-wrapper'));
  var slideshow = view.slideshow;

  view.render(data.response.photos.slice(0, 30));
  view.update();
  $(window).trigger('throttledresize');
  view.lazyLoad();
  view.doscroll();
  view.startShow();
  view.doscroll();

  $('#retypeset').click(function () {
    view.reTypeset();
    view.update();
  });

  $('#addphotos').click(function () {
    view.render(data.response.photos);
    view.update();
  });

  $('#btn-esc').click(function () {
    // console.log('esc photo');
    slideshow.exit();
  });

  $('#btn-prev').click(function () {
    // console.log('prev photo');
    slideshow.stop();
    slideshow.prev();
  });

  $('#btn-next').click(function () {
    // console.log('next photo');
    slideshow.stop();
    slideshow.next();
  });

  $('#btn-play').click(function () {
    // console.log('play photo');
    slideshow.play();
  });

  $('#btn-pause').click(function () {
    // console.log('stop photo');
    slideshow.exit();
  });
});
