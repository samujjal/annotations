define(["jquery",
        "underscore",
        "prototypes/player_adapter",
        "models/annotation",
        "collections/annotations",
        "backbone"],
       
    function($,_not,PlayerAdapter,Annotation,Annotations){

        /**
         * View to add annotation
         */
        
        var Annotate = Backbone.View.extend({
          
          /** Main container of the appplication */
          el: $('div#annotate-container'),
          
          /** The player adapter passed during initialization part */
          playerAdapter: null,
          
          /** Events to handle by the main view */
          events: {
            "keypress #new-annotation" : "insertOnEnter",
            "click #insert"            : "insert"     
          },
          
          /**
           * @constructor
           */
          initialize: function(attr){
            if(!attr.playerAdapter || !PlayerAdapter.prototype.isPrototypeOf(attr.playerAdapter))
                throw "The player adapter is not valid! It must has PlayerAdapter as prototype.";
              
            _.bindAll(this,'insert','render','reset');
            
            this.tracks = annotationsTool.video.get("tracks");
            this.playerAdapter = attr.playerAdapter;
            this.input = this.$('#new-annotation');
          },
          
          /**
           * Proxy function for insert through 'enter' keypress
           */
          insertOnEnter: function(e){
            if(e.keyCode == 13)
              this.insert();
          },
          
          /**
           * Insert a new annotation
           */
          insert: function(){
            var value = this.input.val();
            this.input.val('');
            var time = this.playerAdapter.getCurrentTime();
            
            if(!value || (!_.isNumber(time) || time < 0))
              return;
            
            var annotation = new Annotation({text:value, start:time});
            
            if(annotationsTool.user)
              annotation.set({created_by: annotationsTool.user.id});
              
            annotationsTool.selectedTrack.get("annotations").add(annotation);
            annotation.save({
              success: function(){console.log("saved");}  
            });
          },
          
          /**
           * Reset the view
           */
          reset: function(){
            this.$el.hide();
            delete this.tracks;
            this.undelegateEvents();
          }
          
        });
            
            
        return Annotate;
    
    
});