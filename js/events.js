/* -*- Mode: JavaScript; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */

this.events = (function() {
  
  function list() {
    model.count('event',function(c) {
      if(c > 0) {
        model.list('event',20,0,function(data) {
          if(data) {
            show_list_grouping(data);
          }
          
          if(window.navigator.onLine) {
            api.items('', function(data) {
              if(data) {
                show_list_grouping(data);
                add(data);
              }
            });
          }
        })
      }
      else {
        if(window.navigator.onLine) {
          api.items('', function(data) {           
            if(data) {
              show_list_grouping(data);
              add(data);
            }
          });
        }
        else {
          alert('Offline!');
        }
      }
    })
  }
  
  function add(data) {
    $.each(data, function() {
      model.set(this);
    })
  }
  
  function clearAllForm() {
    $('#view-event-add').find('input,textarea').each(function() {
      $(this).val('');
    })
  }
  
  function show_list_grouping(data) {
  
    $.each(data, function() {
      var group = groupingdate(this.start);
      var groupid = group.toLowerCase().replace(' ','');  
      
      if($('#'+groupid).length == 0) {
        $('<header />', {text: group}).appendTo('#view-events-list section[data-type="list"]');
        $('<ul />', {id: groupid}).appendTo('#view-events-list section[data-type="list"]');
      }
      
      var img = $('<img />', {'src' : this.banner, 'alt': 'placeholder'}).wrap('<aside />').parent().addClass('pack-end');
      var link = $('<p />', {text: this.title, class: 'title'}); 
      var loc = $('<p />', {text: this.venue.name, class: 'location'});
      $('<li />').append(img).append(link).append(loc).wrapInner('<a href="#event-detail" data-eventid="'+this.id+'" />').appendTo('#'+groupid);
    })
  }
  
  function detail(id) {
    if(window.navigator.onLine) {
      api.detail(id, function(data) {
        if(data) {
          model.set(this);
        }
        
        
      })
    }
  }
  
  function groupingdate(time) {
    var date = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate(),0,0,0);
    var tdate = new Date(time*1000);
     
    var now = Math.round(date.getTime() / 1000);
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    
    var currdate = date.getDate();
    var itemdate = tdate.getDate();
    
    var firstdate = currdate - date.getDay();
    var lastdate = firstdate + 6;
    
    var diff = time - now; 
    var daydiff = firstdate - itemdate;
    
    
    if(diff <= 86400) {
      return 'Today';
    }                
    else if(diff > 86400 && diff <= (86400*2)) {
      return 'Tomorrow';
    }
    else if(diff >= (86400*3) && diff <= (86400*daydiff)) {
      return 'This Week';
    }
    else if(daydiff < -8 && (tdate.getFullYear() <= date.getFullYear())) {
      return months[tdate.getMonth()];
    }
    else {
      return 'Next Year';
    }
  }
  
  return {
    list: list,
    add: add,
    clearAllForm: clearAllForm
  }; 
}());


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

$(function() {
  $('#location-name').click(function(e) {
    if($('#venuename').val() && $('#venueaddress').val()) {
      navigation.go('view-event-add-location','popup');
    }
    else {
      navigation.go('view-event-search-location','popup');
    }
    e.preventDefault();
  }); 

  $('#add-location-latlong').click(function(e) {
    navigation.go('view-event-latlong-add','popup');
    var q = '';
    $('#venueid').val('');

    if(!$('#add-location-latlong').text().match('[a-zA-Z]')) {
      q = $('#add-location-latlong').text();
    }                                       
    else if($('#add-location-address').val()) {
      q = $('#add-location-address').val();
    }                                       
    else {
      q = $('#add-location-name').val();
    }

    map.openMap(q);
    $('#submit-latlong-event').removeAttr('disabled');
    e.preventDefault(); 
  });

  $('#submit-latlong-event').click(function() {
    if(map.getMarker()) {
      $('#add-location-latlong').text(map.getMarker());
      $('#venuelongitude').val(map.getLongitude());
      $('#venuelatitude').val(map.getLatitude());
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
    user.checkLogin(function(status,token) {
      if(status == 'ok') {
        api.addEvent({
          title: $('#name').val(),
          description: $('#description').val(),
          startdate: $('#date-start').val()+' '+$('#time-start').val(),
          enddate: $('#date-end').val()+' '+$('#time-end').val(),
          venueid: $('#venueid').val(),
          venuename: $('#venuename').val(),
          venueaddress: $('#venueaddress').val(),
          venuelatitude: $('#venuelatitude').val(),
          venuelongitude: $('#venuelongitude').val(),
          token: token 
        },
        function(resp) {
          model.set(resp,'event', function() {
            navigation.back(function() {
              events.list();
            });
          });
        })        
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
    $('#location-name-hidden').val($(this).attr('data-name'));
    $('#venuename,#venuelocation,#venuelatitude,#venuelongitude').val('');
    navigation.back(function() {
      $('#location-name-hidden').trigger('keyup');
    });
    e.preventDefault();
  });
  
  $('#add-location-link').click(function() {
    navigation.back();
    navigation.go('view-event-add-location','popup');
  });
  
  $('#submit-add-location').click(function() {
    $('#submit-add-location-button').trigger('click');
  })
  
  $('#add-location-form').submit(function(e) {
    e.preventDefault();
    $('#venuename,#location-name-hidden').val($('#add-location-name').val());
    $('#venueaddress').val($('#add-location-address').val());
    $('#location-name').text($('#add-location-name').val());
    navigation.back(function() {
      $('#location-name-hidden').trigger('keyup');
    });
  })  
})

