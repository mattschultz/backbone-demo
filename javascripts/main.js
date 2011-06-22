$(function(){
  var Post = Backbone.Model.extend({
    initialize: function() {
      this.bind('error', this.errorHandler);
    },
      
    validate: function(attrs) {
      var errors = [];
      
      if(_.isEmpty(attrs.title)) {
        errors.push('a title is required');
      }
      
      if(_.isEmpty(attrs.body)) {
        errors.push('a body is required');
      }
      
      if(_.any(errors)) {
        return errors;
      }
    },
    
    errorHandler: function(model, error) {
      alert(error.join(', '));
    }
  });
  
  var PostList = Backbone.Collection.extend({
    model: Post
  });

  var PostView = Backbone.View.extend({
    tagName: 'li',
    
    initialize: function(){
      _.bindAll(this, 'render');
    },
    
    render: function(){
      var source   = $("#post-template").html();
      var template = Handlebars.compile(source);
      var data = {
        title: this.model.get('title'),
        body:  this.model.get('body')
      }
      $(this.el).html(template(data));
      return this;
    }
  });
  
  var PostListView = Backbone.View.extend({
    el: $('.container'), // el attaches to existing element
    
    events: {
      'submit form' : 'addPost'
    },
    
    initialize: function(){
      _.bindAll(this, 'render', 'addPost', 'appendPost');
      
      this.collection = new PostList();
      this.collection.bind('add', this.appendPost);

      this.render();
    },
    
    render: function(){
      $(this.el).append('<ul></ul>');
      
      _(this.collection.models).each(function(post){
        appendPost(post);
      }, this);
    },
    
    addPost: function(){
      var titleField = $('input[name=title]');
      var bodyField = $('textarea');

      var post = new Post();
              
      if(post.set({title: titleField.val(), body: bodyField.val()})) {
        this.collection.add(post);
        titleField.val('');
        bodyField.val('');
      }
    },

    appendPost: function(post){
      var postView = new PostView({
        model: post
      });
      
      $('ul', this.el).append(postView.render().el);
    }
  });

  var postView = new PostListView();
  
  var AppController = Backbone.Controller.extend({
    routes: {
      'new_post': 'new_post'
    },

    new_post: function() {
      $('form').fadeIn();
      $('#new_post').hide();
    },
  });
  
  var appController = new AppController;
  Backbone.history.start();
});