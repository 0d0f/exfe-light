/*
 * debouncedresize: special jQuery event that happens once after a window resize
 *
 * latest version and complete README available on Github:
 * https://github.com/louisremi/jquery-smartresize
 *
 * Copyright 2012 @louis_remi
 * Licensed under the MIT license.
 *
 * This saved you an hour of work? 
 * Send me music http://www.amazon.co.uk/wishlist/HNTU0468LQON
 */
define(function (require) {
  'use strict';

  var $ = require('jquery');

  $.event.special.throttledresize = {
    setup: function() {
      $( this ).bind( "resize", handler );
    },
    teardown: function() {
      $( this ).unbind( "resize", handler );
    }
  };

  var throttle = 250,
    handler = function() {
      curr = ( new Date() ).getTime();
      diff = curr - lastCall;

      if ( diff >= throttle ) {

        lastCall = curr;
        $( this ).trigger( "throttledresize" );

      } else {

        if ( heldCall ) {
          clearTimeout( heldCall );
        }

        // Promise a held call will still execute
        heldCall = setTimeout( handler, throttle - diff );
      }
    },
    lastCall = 0,
    heldCall,
    curr,
    diff;
});
