/* -*- Mode: JavaScript; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */

this.api = (function() {
  
  var APIURL = 'http://localhost/projecte/api/';
  
  function items(last,callback) {
    $.ajaxSetup({ scriptCharset: "utf-8" , contentType: "application/json; charset=utf-8"});
    $.getJSON(APIURL+'event/list/?limit=10', function(json) {
      if(json.status == true) {
        callback(json.result);
      }                
      else {
        callback(false);
      }
    });
  }
  
  function detail(id,callback) {
    $.ajaxSetup({ scriptCharset: "utf-8" , contentType: "application/json; charset=utf-8"});
    $.getJSON(APIURL+'event/detail/?id='+id, function(json) {
      if(json.status == true) {
        callback(json.result);
      }                       
      else {
        callback(false);
      }
    });
  }
  
  function add(data) {
    var def = {
      title: '',
      description: '',
      startdate: '',
      enddate: '',
      volunteer: 1
    }
    
    $.post(APIURL+'event/add', data, function() {
      
    })
  }
  
  function exchangeToken(token,token_exchange,callback) {
    var ret  = false;
    
    $.post(APIURL+'user/token_exchange', {token: token, token_exchange: token_exchange }, function(resp) {
      if(resp.status) {
        ret = resp.results;
      }
      
      if(callback && typeof callback === "function") {
        callback(ret);
      }
    })
  }
  
  function updateProfile(data, callback) {
    $.post(APIURL+'user/update', data, function(resp) {
      if(callback && typeof callback === "function") {
        callback(resp.status);
      }
    })
  }
  
  return {
    items: items,
    detail: detail,
    add: add,
    exchangeToken: exchangeToken,
    updateProfile: updateProfile
  }
  
}());