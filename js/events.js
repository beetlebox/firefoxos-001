/* -*- Mode: JavaScript; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */

this.events = (function() {
  
  function list() {
    model.count('event',function(c) {
      if(c > 0) {
        model.list('event',1,0,function(data) {
          if(data) {
            show_list_grouping(data);
          }
        })
      }
      else {
        if(window.navigator.onLine) {
          api.items('', function(data) {
            if(data) {
              show_list_grouping(data);
              //add(data);
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
    removeComment($('#event-list'));
    
    $.each(data, function() {
      var group = groupingdate(this.start);
      
      if($('#'+group).length == 0 ) {
        $('<header />', {text: group}).appendTo('#event-list-content');
        $('<ul />', {id: group}).appendTo('#event-list-content');
      }
      
      var img = $('<img />', {'src' : this.banner, 'alt': 'placeholder'}).wrap('<aside />').parent().addClass('pack-end');
      var link = $('<p />', {text: this.title}).wrap('<a />').parent().attr('href','#event-detail').attr('data-eventid',this.id);
      $('<li />').append(img).append(link).appendTo('#'+group);
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