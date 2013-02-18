define(function (require) {
  console.log('Testing...');
  var data = JSON.parse(photos);
  var View = require('mnemosyne');
  var view = new View($('.mnemosyne'));

  // view.typesetting.typeset(data.response.photos.length);÷

  var slideshow = view.slideshow;
  //console.dir(data.response.photos);
  view.render(data.response.photos);
  view.update();
  $(window).trigger('throttledresize');

  $('#retypeset').click(function () {
    view.reTypeset();
    view.update();
  });

  $('#addphotos').click(function () {
    view.render(data.response.photos);
    view.update();
  });

  $('#btn-esc').click(function () {
    console.log('esc photo');
    slideshow.exit();
  });

  $('#btn-prev').click(function () {
    console.log('prev photo');
    slideshow.stop();
    slideshow.prev();
  });

  $('#btn-next').click(function () {
    console.log('next photo');
    slideshow.stop();
    slideshow.next();
  });

  $('#btn-play').click(function () {
    console.log('play photo');
    slideshow.play();
  });

  $('#btn-pause').click(function () {
    console.log('stop photo');
    slideshow.exit();
  });
});
