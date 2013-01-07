require.config({
  //map: { '*': { 'jquery':'zepto' }},
  baseUrl: 'js/',
  paths: {
    jquery: 'lib/jquery',
    zepto: 'lib/zepto',
    underscore: 'lib/underscore',
    backbone: 'lib/backbone'
  }
});

requirejs(['app'], function(App) {
  App.initialize();
});
