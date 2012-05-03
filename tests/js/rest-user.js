require(['domReady',
         'jquery',
	 'models/user',
         'collections/users',
         'backbone-annotations-sync',
         'order!underscore',
         'order!backbone',
         'order!libs/tests/qunit'],
                    
        function(domReady,$,User, Users, AnnotationSync){
        
            domReady(function(){
                QUnit.config.autostart = false;
                
                var user, base_user, users;
                
                module("User",  {
                        setup: function() {
                            users = new Users();
                            user  = new User({user_extid:'testid',nickname:'pinguin'}); 
                            users.add(user);
                            Backbone.sync = AnnotationSync;
                            base_user = user.clone();
                            config = {
                                restEndpointUrl: window.restUrl
                            };
                        }
                });
                
                
                test("Save user",function(){
                    stop();
                    
                    AnnotationSync('update',user,{
                                error: function(error){
                                    ok(false, error);
                                    start();
                                },
                                
                                success: function(data){
                                    ok(true, "Saved successfully");
                                    
                                    ok(user.get('id')!==undefined,"Id has been set");
                                    start();
                                }
                    },config);

                })
                
                test("Get user",1,function(){
                    stop();
                    
                    AnnotationSync('read',user,{
                                error: function(error){
                                    ok(false, error);
                                    start();
                                },
                                
                                success: function(data){
                                    ok(true, "Got user in json:" + data);
                                    start();
                                }
                    },config);
                })
                
                 
            });
            
});