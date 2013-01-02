/* -*- Mode: JavaScript; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */ 

$(function() {
  /* General */ 
  $('.view[data-state="active"] [required]').keyup(function() {
    if($(this).val()) {
      $('.submit-button').removeAttr('disabled');      
    }
  });
  
  /* Add Event Form */
  $('#add-event-button').click(function() {
    user.checkLogin(function(status) {
      if(status == 'ok') {
        navigation.go('view-event-add','popup');        
      }
      else if(status == 'no_name') {
        user.showRegister(function() {
          navigation.go('view-event-add','popup');
        })
      }
      else {
        user.showLogin(function() {
          navigation.go('view-event-add','popup');
        });
      }
    })
  });
  
  $('.cancel-navigation').click(function() {
    navigation.back();
    if($(this).attr('id') == 'cancel-add') {
      events.clearAllForm();
    }
  });
  
  $('#location-name').click(function(e) {
    navigation.go('view-event-search-location','popup');
    e.preventDefault();
  }); 
  
  $('#location-latlong').focus(function() {
    navigation.go('view-event-latlong-add','popup');
    var q = $('#location-latlong').val() ? $('#location-latlong').val() : $('#location-name').val();
    map.openMap(q);
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
  
  $('#search-location-text').keyup($.debounce( function() {
    if($(this).val() == '') return false;
     
    $('#search-location-result').find('p.no-result').hide();       
    $('#search-location-result').find('p.loading').show();
         
    api.venuesearch($(this).val(), function(data) {
      $('#search-location-result li:not([data-template])').each(function() {
        $(this).remove();
      });
      
      $('#search-location-result').find('p.loading').hide();
      
      if(data == false) {
        $('#search-location-result').find('p.no-result').show();
        return false;
      } 
            
      var template = $('#search-location-result').find('[data-template]');

      $.each(data, function() {
        template.clone().appendTo('#search-location-result')
        .removeAttr('data-template')
        .find('a').attr('data-id',this.id).attr('data-name',this.name).attr('data-latitude',this.latitude).attr('data-longitude',this.longitude).addClass('select-venue')
        .find("p.name").text(this.name)
        .siblings("p.location").text(this.location)
      })
    });
  }, 500));
  
  $(document).on('click','.select-venue',function(e) {
    $('#venueid').val($(this).attr('data-id'));
    $('#location-name').text($(this).attr('data-name'));
    navigation.back();
    e.preventDefault();
  });
  
  $('#add-location-link').click(function() {
    navigation.back();
    navigation.popup('view-event-add-location');
  })
  
  $('#add-location-form').submit(function(e) {
    e.preventDefault();
  })
  
  /* Profile */
  $('#firstname, #lastname').keyup(function() {
    if($('#firstname').val() != '' && $('#lastname').val() != '') {
      $('#submit-profile').removeAttr('disabled');
    }
    else {
      $('#submit-profile').attr('disabled','disabled');
    }
  });
  
  $('#submit-profile').click(function() {
    $('#submit-profile-button').trigger('click');
  });
  
  $('#profile-form').submit(function(e) {
    $('#submit-profile').text('Saving').attr('disabled','disabled')
    user.setProfile({
      firstname: $('#firstname').val(),
      lastname: $('#lastname').val(),
      bio: $('#bio').val()
    }, function(resp) {
      if(resp == true) {
        $('#submit-profile').text('Save').removeAttr('disabled');
      }
      else {
        user.showLogin();
      }
    }) 
    e.preventDefault();
  });
  
  /* Register */
  $('#register-firstname, #register-lastname').keyup(function() {
    if($('#register-firstname').val() != '' && $('#register-lastname').val() != '') {
      $('#submit-register').removeAttr('disabled');
    }
    else {
      $('#submit-register').attr('disabled','disabled');
    }
  });
  
  $('#submit-register').click(function() {
    $('#submit-register-button').trigger('click');
  });
  
  $('#register-form').submit(function(e) {
    e.preventDefault();
    $('#submit-register').text('Sending').attr('disabled','disabled')
    user.setProfile({
      firstname: $('#register-firstname').val(),
      lastname: $('#register-lastname').val(),
      active: true
    },
    function(resp) {
      $('#submit-register').text('Submit').removeAttr('disabled');
      user.hideRegister(true);
    }) 
  });
})