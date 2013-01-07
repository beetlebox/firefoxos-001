define(['jquery','underscore','backbone','view/event'],
function($,_,Backbone,EventView) {
  
  var AppRouter = Backbone.Router.extend({
    routes: {
      'detail': 'eventDetail',
      'list': 'eventList',
      'search': 'eventSearch',
      'profile' : 'userProfile',
      '*actions': 'defaultAction'
    }
  });
  
  var initialize = function() {
    
    var app_router = new AppRouter;
    
    app_router.on('eventDetail', function() {
      var eventView = new EventView();
      eventView.detail();
    });
    
    app_router.on('route:eventList', function() {
      console.log('eventList');
    })
    
    app_router.on('route:defaultAction', function(action) {
      
    });
    
    Backbone.history.start();       
  } 
  
  return {
    initialize: initialize
  }
})