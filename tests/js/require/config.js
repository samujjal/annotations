define([],function () {
  // RequireJS configuration for tests
  require.config({
      baseUrl: "./../js",
      paths: {
          'timeline': 'libs/timeline-min.js',
          'scrollspy': 'libs/bootstrap/scrollspy',
          'backbone':'libs/backbone/backbone-0.9.9',
          'localstorage': 'libs/backbone/backbone.localStorage-1.0',
          'jquery': 'libs/jquery-1.7.2.min',
          'underscore': 'libs/underscore-min-1.4.3',
          'templates': '../templates',
          'domReady':'libs/require/config/domReady',
          'text':'libs/require/config/text',
          'annotations-tool':'../tests/js/annotations-tool-configuration',
          'tests':'../tests/js',
      },
      waitSeconds: 10,
      
      shim: {

         "underscore": {
           exports: "_"
         },

         "backbone": {
           deps: ["underscore", "jquery"],
           exports: "Backbone"
         },

         "localstorage": {
          deps: ["backbone"],
          exports: "Backbone"
         }
      }
  }); 
})