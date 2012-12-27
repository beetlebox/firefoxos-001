/* -*- Mode: JavaScript; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */ 

this.model = (function() {
  
  const dbname = 'projecte';
  const version = '1';
  const defaultstorename = 'event';   
  var db = null;
  var storename = '';
  
  function store(name) {
    storename = name;
    return this;
  }
  
  function transaction(mode,callback) {
    if(db) {
      storename = storename ? storename : defaultstorename;
      callback(db.transaction(storename, mode).objectStore(storename));
    }
    else {
      var request = indexedDB.open(dbname);
      
      request.onsuccess = function(e) {
        db = e.target.result;
        storename = storename ? storename : defaultstorename;
        callback(db.transaction(storename, mode).objectStore(storename));
      }                                                                  
      
      request.onerror = function(e) {
        console.error('Cannot open database');
      }                                       
      
      request.onupgradeneeded = function(e) {
        db = e.target.result;
        
        if(e.oldVersion == 0) {
          create();
        }
        else {
          upgrade();
        }
      }
    }
  }
  
  function create() {
    var e = db.createObjectStore('event', {keyPath: 'id'});
    var u = db.createObjectStore('user', {keyPath: 'id'});
    
    e.createIndex('titleIndex','title',{unique: false});
    e.createIndex('lastupdateIndex','last_update',{unique: false});
    
    u.createIndex('tokenIindex','token');
    u.createIndex('emailIndex','email');
  }
  
  function upgrade() {
    
  }
  
  function set(data,storename,callback) {
    store(storename);
    transaction('readwrite',function(store) {
      var t = store.put(data);
      if(callback && typeof callback === 'function') {
        t.onsuccess = function() {
          callback();
        }
      }
      
      t.onerror = function(e) {
        console.error('Cannot set: '+e.error.name);
      }
    })
  }
  
  function get(key,storename,callback) {
    store(storename);
    transaction('readonly', function(store) {
      var t = store.get(key);
      t.onsuccess = function(e) {
        var value = e.target.result;
        if(typeof value === 'undefined') {
          value = false;
        }
        
        if(callback && typeof callback === 'function') {
          callback(value);
        }
      }
      
      t.onerror = function(e) {
        console.error('Cannot get: '+e.error.name);
      }
    })
  }
  
  function count(storename,callback) {
    store(storename);
    transaction('readonly',function(store) {
      var t = store.count();
      
      t.onsuccess = function(e) {
        if(callback && typeof callback === 'function') {
          callback(e.target.result);
        }
      }
      
      t.onerror = function(e) {
        console.error('Cannot count: '+e.error.name);
      }
    });
  }
  
  function list(storename,limit,offset,callback) {
    var data = [];
    var i = 0;
    var s = 0;
    
    store(storename);
    transaction('readonly',function(store) {
      var t = store.openCursor();
      t.onsuccess = function(e) {
        var cursor = e.target.result;
        if(cursor) {
          if(s >= offset && i < limit) {
            data.push(cursor.value);
          }
          if(offset > s) {
            s++;
          }     
          i++;
          cursor.continue();
        }
        else {
          callback(data);
        }
      }
    })
  }
  
  return {
    set: set,
    get: get,
    count: count,
    list: list
  }
  
}());