/*
 * jQuery throttle / debounce - v1.1 - 3/7/2010
 * http://benalman.com/projects/jquery-throttle-debounce-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 *
 * Porting to Zepto by Fikri (2012)
 */
(function($) {
  
  $.extend($, {
  
   debounce : function(fn, timeout, invokeAsap, ctx) {
  
     if(arguments.length == 3 && typeof invokeAsap != 'boolean') {
       ctx = invokeAsap;
       invokeAsap = false;
     }
  
     var timer;
  
     return function() {
  
       var args = arguments;
             ctx = ctx || this;
  
       invokeAsap && !timer && fn.apply(ctx, args);
  
       clearTimeout(timer);
  
       timer = setTimeout(function() {
         !invokeAsap && fn.apply(ctx, args);
         timer = null;
       }, timeout);
  
     };
  
   },
  
   throttle : function(fn, timeout, ctx) {
  
     var timer, args, needInvoke;
  
     return function() {
  
       args = arguments;
       needInvoke = true;
       ctx = ctx || this;
  
       if(!timer) {
         (function() {
           if(needInvoke) {
             fn.apply(ctx, args);
             needInvoke = false;
             timer = setTimeout(arguments.callee, timeout);
           }
           else {
             timer = null;
           }
         })();
       }
  
     };
  
   }
  
  });
             
})(Zepto);                    