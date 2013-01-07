/* -*- Mode: JavaScript; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */

this.api = (function() {
  
  var APIURL = 'http://localhost/projecte/api/';
  
  function items(last,callback) {
    $.getJSON(APIURL+'event/list/?limit=10', function(json) {
      if(json.status == true) {
        callback(json.results);
      }                
      else {
        callback(false);
      }
    });
  }
  
  function detail(id,callback) {
    $.getJSON(APIURL+'event/detail/?id='+id, function(json) {
      if(json.status == true) {
        callback(json.results);
      }                       
      else {
        callback(false);
      }
    });
  }
  
  function addEvent(form,callback) {
    var def = {
      title: '',
      description: '',
      startdate: '',
      enddate: '',
      venueid: '',
      venuename: '',
      venuelocation: '',
      venuelatitude: '',
      venuelongitude: '',
      volunteer: '1',
      token: ''
    }

    var data = $.extend(def,form);
    
    $.post(APIURL+'event/add', data, function(resp) {
      if(resp.status) {
        if($.isFunction(callback)) {
          callback(resp.results);
        } 
      }
    }, 'json'); 
  }
  
  function exchangeToken(token,token_exchange,callback) {
    var ret  = false;
    
    $.post(APIURL+'user/token_exchange', {token: token, token_exchange: token_exchange }, function(resp) {
      if(resp.status) {
        ret = resp.results;
      }
      
      if($.isFunction(callback)) {
        callback(ret);
      }
    })
  }
  
  function updateProfile(data, callback) {
    $.post(APIURL+'user/update', data, function(resp) {
      if($.isFunction(callback)) {
        callback(resp.status);
      }
    })
  }
  
  function venuesearch(query,callback) {
    $.ajax({
      url: APIURL+'venue/search?q='+query,
      success: function(resp) {
        if(resp.status == true) {
          if($.isFunction(callback)) {
            callback(resp.results);
          }
        }
      },
      error: function() {
        if($.isFunction(callback)) {
          callback(false);
        }
      }  
    })
  }
  
  return {
    items: items,
    detail: detail,
    addEvent: addEvent,
    exchangeToken: exchangeToken,
    updateProfile: updateProfile,
    venuesearch: venuesearch
  }
  
}());