/* -*- Mode: JavaScript; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */ 

$(function() {
  /* General */ 
  $(document).on('keyup','.view[data-state="active"] [required]', $.debounce(function() {
    var i = 0;
    var length = $('.view[data-state="active"] [required]').length;
    
    $('.view[data-state="active"] [required]').each(function() {
      if($(this).val()) {
        i++;             
      }

      if(i == length) {
        $('.view[data-state="active"]').find('.submit-button').removeAttr('disabled');
      }
      else {
        $('.view[data-state="active"]').find('.submit-button').attr('disabled','disabled')
      }
    })                                             
    
    i = 0;
  }, 300));
  
  $('.cancel-navigation').click(function() {
    navigation.back();
    if($(this).attr('id') == 'cancel-add') {
      events.clearAllForm();
    }
    
    if($(this).attr('id') == 'cancel-add-location') {
      navigation.go('view-event-search-location','popup');
    }
  });
  
  $('button[type="reset"]').click(function(e) {
    $(this).siblings('input,textarea').val('');
    e.preventDefault();
  });
})