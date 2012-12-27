/* -*- Mode: JavaScript; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */ 

$(function() {
  $('#add-event-button').click(function() {
    user.checkToken(function(status) {
      if(status) {
        navigation.go('view-event-add','popup');        
      }
      else {
        user.showLogin();
      }
    })
  });
  
  $('.cancel-navigation').click(function() {
    navigation.back();
    if($(this).attr('id') == 'cancel-add') {
      events.clearAllForm();
    }
  }); 
  
  $('#location-latlong').focus(function() {
    navigation.go('view-event-latlong-add','popup');
    map.openMap($('#location-name').val());
    $('#submit-latlong-event').removeAttr('disabled'); 
  });
  
  $('#submit-latlong-event').click(function() {
    if(map.getMarker()) {
      $('#location-latlong').val(map.getMarker());
    }
    navigation.back();     
  });
  
  $('#search-map-button').click(function() {
    map.searchLocation($('#search-map-text').val());
  });
  
  $('#submit-event').click(function() {
    $('#submit-event-button').trigger('click');
  });
  
  $('#event-form').submit(function(e) {
    e.preventDefault();
  });
  
  $('button[type="reset"]').click(function(e) {
    $(this).siblings('input,textarea').val('');
    e.preventDefault();
  });
})