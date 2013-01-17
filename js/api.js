/* -*- Mode: JavaScript; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */

this.api = (function() {
  
  var APIURL = 'http://localhost/projecte/api/';
  
  function items(last,token,callback) {
    // get(APIURL+'event/list/?limit=10', function(resp) {
    //   if($.isFunction(callback)) {
    //     callback(resp.results);           
    //   }  
    // },
    // function() {
    //   if($.isFunction(callback)) {
    //     callback(false);           
    //   }      
    // })

    $.ajax({
      url: APIURL+'event/list/?limit=10&token='+token,
      dataType:'json',
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
    });          
  }
  
  function detail(id,token,callback) {
    $.ajax({
      url: APIURL+'event/detail/?id='+id+'&token='+token,
      dataType: 'json',
      success: function(resp) {
        if(resp.status) {
          if($.isFunction(callback)) {
            callback(resp.results);              
          }
        }
      },
      error: function() {
        if($.isFunction(callback)) {
          callback(resp.results);              
        }          
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
    $.ajax({
      url: APIURL+'user/token_exchange',
      type: 'POST',
      dataType:'json',
      data: 'token='+token+'&token_exchange='+token_exchange,
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
      dataType: 'json',
      success: function(resp) {
        if(resp.status == true) {
          if($.isFunction(callback)) {
            callback(resp.results);
          }
        }
      },
      error: function(xhr,status,error) {
        if($.isFunction(callback)) {
          callback(false);
        }
      }  
    })
  }
  
  function get(url,success,error) {
    var xhr = new XMLHttpRequest({
      mozSystem: true
    });
    xhr.open('GET',url, true);
    xhr.onload = function() {
      console.log(xhr);
      if(xhr.readyState == 200) {
        success(JSON.parse(xhr.response));
      }
      else {
        error(xhr.response, xhr.status);
      }
    }
    xhr.onerror = function(xhr) {
      console.log('error');
    }
    xhr.send();
  }
  
  function post(url,data,success,error) {
    var xhr = new XMLHttpRequest({
      mozSystem: true
    });
    xhr.open('POST', url, true);
    xhr.onload = function() {
      if(xhr.readyState == 200) {
        success(JSON.parse(xhr.response));
      }
      else {
        error(xhr.response, xhr.status);
      }
    }
    xhr.send(data ? $.param(data) : null);    
  }
  
  function setAttend(token,eid,type,callback) {
    var url = type == 'attend' ? APIURL+'user/setattend' : APIURL+'user/setunattend';
    
    data = {
      eid : eid,
      token: token
    }
    
    var xhr = new XMLHttpRequest({
      mozSystem: true
    });
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.onload = function() {
      if(xhr.readyState == 200) {
        if($.isFunction(callback)) {
          callback(true);
        }
      }
      else {
        if($.isFunction(callback)) {
          callback(false);
        }
      }
    }
    xhr.send(data ? $.param(data) : null);    
  }
  
  return {
    items: items,
    detail: detail,
    addEvent: addEvent,
    exchangeToken: exchangeToken,
    updateProfile: updateProfile,
    venuesearch: venuesearch,
    setAttend: setAttend
  }
  
}()); 