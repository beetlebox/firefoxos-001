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
    events.list();
  });
  
  $(window).on('search', function() {
 
  })
  
  $(window).on('profile', function() {
    user.showProfile();
  });                      
  
  
  // get message
  // window.addEventListener('message',function(e) {
  //   var data = JSON.parse(e.data); 
  // 
  //   switch(data.action) {
  //     case 'event-list':
  //       events.list();
  //       break;
  //     case 'event-detail':
  //       events.detail(data.param.id);
  //       break;
  //     case 'user-profile':
  //       user.getProfile();
  //       break;
  //     default:
  //       alert('error');
  //   }
  // });
})