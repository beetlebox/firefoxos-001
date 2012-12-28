/* -*- Mode: JavaScript; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */ 
 
$(function() {
  var path = window.location.href;
  var hash = window.location.hash; 

  if(hash == '') {
    window.location.href = path + '#event';
  }
  
  window.onhashchange = function () {
    $(window).trigger(window.location.hash.substring(1));
  }
  
  $(window).on('event', function() {

  });
  
  $(window).on('event-detail', function() {
    
  })
  
  $(window).on('profile', function() {
    user.getProfile();
  }); 
  
})