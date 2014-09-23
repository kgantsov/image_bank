define([
    'backbone',
    'app/collections/FileCollection',
    'text!app/templates/files_list.html'
], function(Backbone, FileCollection, tpl) {
    var ListFilesView = Backbone.View.extend({
        events: {
            'click a.remove_file': 'removeFile',
            'click button#search': 'search',
            'submit form.search_form': 'search'
        },

        initialize: function(options) {
            _.bindAll(this, 'render');
            this.options = options;

            this.collection = new FileCollection([], {
                search_term: this.options.search_term
            });
            this.listenTo(this.collection, 'add', this.render);
            this.listenTo(this.collection, 'remove', this.render);
            this.collection.getPage(parseInt(this.options.page) || 1);
            this.render();
        },
        render: function() {
            $(this.el).html(_.template(tpl)({
                files: this.collection.models,
                pager: this.collection.state,
                search_term: this.options.search_term
            }));
            return this;
        },
        search: function() {
            window.location = '#/index/1/' + encodeURIComponent($('#term').val());
        },
        removeFile: function (e) {
            var self = this;

            var data = {
                csrfmiddlewaretoken: csrftoken = $.cookie('csrftoken'),
                file_id: $(e.currentTarget).data('id')
            };

            $.post("/remove_file/", data, function(data) {
                if (data.status == 'success') {
                    app.navigate('/');
                    self.collection.getPage(1);
                }
            });

            return e.preventDefault();
        }
    });

    return ListFilesView;
});
