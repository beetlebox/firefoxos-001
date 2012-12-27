/* -*- Mode: JavaScript; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */

this.user = (function() {
  var openLogin = false;
  
  function checkToken(callback) {
    model.get(1,'user',function(data) {
      if(data.token && data.token_expires && data.token_exchange) {
        if(data.token_expires > Math.ceil(new Date().getTime() / 1000)) {
          var status = true;
        }
        else {
          exchangeToken(data, function(resp) {
            if(!resp) {
              var status = false;
            }
          });
        }
      }
      else {
        var status = false;
      }
      
      if(callback && typeof callback === "function") {
        callback(status);
      }
    })
  }
  
  function showLogin() {
    navigation.go('view-login','popup');
    openLogin = true; 
    return true;
  }
  
  function hideLogin() {
    if(openLogin()) {
      navigation.back();
      openLogin = false;
      return true;
    }
    return false;
  }
  
  function setLogged(data, callback) {
    var insert = { id: 1 };
    $.extend(insert,data);
 
    model.set(insert,'user',function() {
      if(callback && typeof callback === "function") {
        callback();
      }
    }) 
  }
  
  function exchangeToken(data, callback) {
    var ret = false;
    
    api.exchangeToken(data.token, data.token_exchange, function(resp) {
      if(resp) {
        setLogged(resp, function() {
          if(callback && typeof callback === "function") {
            callback(true);
          }
        })
      }
      else {
        if(callback && typeof callback === "function") {
          callback(false);
        }        
      }
    });
  }
  
  function update(firstname,lastname) {
    checkToken(function() {
      $.post(API+'user/update',{ firstname: firstname, lastname: lastname }, function(resp) {
        if(!resp.status) {
          if(resp.message.toLowerCase() == 'invalid or expired token') {
            showLogin();
          }
        }
      })      
    })
  }
  
  return {
    checkToken: checkToken,
    showLogin: showLogin,
    hideLogin: hideLogin,
    setLogged: setLogged
  };
}());

window.onmessage = function(event) {
  if(event.origin == 'http://localhost') {
    if(event.data.status == true) {
      user.setLogged(event.data.results, function() {
        if(event.data.action == 'input/name') {
          window.location.hash = '#profile';          
        }
        
        hideLogin();          
      });
    }
    else {
      // error login here
    }
  }
}