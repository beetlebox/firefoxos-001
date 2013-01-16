/* -*- Mode: JavaScript; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */

this.user = (function() {
  var openLogin = false;
  var openRegister = false;
  var nextDo;
  var currentToken;
  
  function checkLogin(callback) {
    var status;
    
    model.get(1,'user',function(data) {
      if(data.token && data.token_expires && data.token_exchange) {
        if(data.token_expires > Math.ceil(new Date().getTime() / 1000)) {
          currentToken = data.token;          
          if(data.firstname && data.lastname) {
            status = 'ok';
          }
          else {
            status = 'no_name';
          }
          
          if($.isFunction(callback)) {
            callback(status,currentToken);
          }
        }
        else {
          exchangeToken(data, function(resp) {
            if(resp) {
              status = 'ok';
              currentToken = resp.token
            }
            else {
              status = 'failed_exchange_token';
            }
             
            if($.isFunction(callback)) {
              callback(status,currentToken);
            } 
          });
        }
      }
      else {
        if($.isFunction(callback)) {
          callback('no_user');
        }
      }
    })
  }
  
  function showLogin(next) {
    navigation.go('view-login','popup');
    openLogin = true;
    if(next && typeof next === "function") {
      nextDo = next;
    }
    return true;
  }
  
  function hideLogin(executeNext) {
    if(openLogin) {
      navigation.back();
      openLogin = false;
      if(nextDo && executeNext) {
        nextDo();
        nextDo = null;
      }
      return true;
    }
    return false;
  }
  
  function showRegister(next) {
    hideLogin();
    navigation.go('view-register','popup');
    openRegister = true;
    if(next && typeof next === "function") {
      nextDo = next;
    }
    return true;
  }
  
  function hideRegister(executeNext) {
    if(openRegister) {
      navigation.back();
      openRegister = false;
      if(nextDo && executeNext) {
        nextDo();
        nextDo = null;
      }
      return true;
    }
    return false;
  }
  
  function setLogged(data, callback) {
    var insert = { id: 1 };
    $.extend(insert,data);
    
    model.set(insert,'user',function() {
      if($.isFunction(callback)) {
        callback();
      }
    }) 
  }
  
  function exchangeToken(data, callback) {
    var ret = false;
    
    api.exchangeToken(data.token, data.token_exchange, function(resp) {
      if(resp) {
        model.get(1,'user',function(datadb) {
          $.extend(datadb,resp);
          model.set(datadb,'user',function() {
            if($.isFunction(callback)) {
              callback(resp.token);
            }            
          })
        });
      }
      else {
        if($.isFunction(callback)) {
          callback(false);
        }        
      }
    });
  }
  
  function setProfile(option, callback) {
    checkLogin(function(resp) {
      if(resp == 'no_user') {
        showLogin();
        return false;
      } 
      
      var data = {
        firstname: '',
        lastname: '',
        bio: '',
        token: currentToken
      }

      $.extend(data,option);
          
      api.updateProfile(data, function(resp) {
        model.get(1,'user',function(datadb) {
          $.extend(datadb,option);
          model.set(datadb,'user', function() {
            if($.isFunction(callback)) {
              callback(resp);
            }          
          })          
        })
      })
    })
  }
  
  function showProfile() {
    model.get(1,'user',function(data) {
      if(data.firstname && data.lastname) {
        $('#firstname').val(data.firstname);
        $('#lastname').val(data.lastname);
        $('#submit-profile').removeAttr('disabled');
      }
      
      $('#bio').val(data.bio);
    })
  }
  
  function getProfile(callback) {
    model.get(1,'user',function(data) {
      callback(data);
    })
  }
  
  function getToken(callback) {
    checkLogin(function(cek){
      if(cek == 'ok') {
        model.get(1,'user',function(data) {
          if($.isFunction(callback)) {
            callback(data.token);            
          }
        })
      }
      else {
        callback('');
      }
    });
  }
  
  function setAttend(eid,type,callback) {
    checkLogin(function(cek){
      if(cek == 'ok') {
        user.getToken(function(token) {
          events.setAttend(token,eid,type,function(ret) {
            callback(ret);
          });
        })
      }
      else if(status == 'no_name') {
        user.showRegister(function() {
          user.getToken(function(token) {
            events.setAttend(token,eid,type,function(ret) {
              callback(ret);
            });
          })        
        })
      }
      else {
        user.showLogin(function() {
          user.getToken(function(token) {
            events.setAttend(token,eid,type,function(ret) {
              callback(ret);
            });
          })
        });
      }
    });    
  } 
   
  return {
    checkLogin: checkLogin,
    showLogin: showLogin,
    hideLogin: hideLogin,
    setLogged: setLogged,
    showRegister: showRegister,
    hideRegister: hideRegister,
    setProfile: setProfile,
    getProfile: getProfile,
    getToken: getToken,
    showProfile: showProfile,
    setAttend: setAttend
  };
}());

$(function() {
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

window.onmessage = function(event) {
  if(event.origin == 'http://localhost') {
    if(event.data.status == true) {
      user.setLogged(event.data.results, function() {
        if(event.data.action == 'input/name') {
          user.showRegister();          
        }
        else {
          user.hideLogin(true);
        }          
      });
    }
    else {
      // error login here
    }
  }
}