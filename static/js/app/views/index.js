define([
    'backbone',
    'app/collections/FileCollection',
    'text!app/templates/files_list.html'
], function(Backbone, FileCollection, tpl) {
    return {
        show: function(page, search_term) {
            var ListView = Backbone.View.extend({
                el: $('#content'),
                events: {
                    'click a.remove_file': 'removeFile',
                    'click button#search': 'search',
                    'submit form.search_form': 'search'
                },

                initialize: function() {
                    _.bindAll(this, 'render');

                    this.collection = new FileCollection([], {
                        search_term: search_term
                    });
                    this.listenTo(this.collection, 'add', this.render);
                    this.collection.getPage(parseInt(page) || 1);
                    this.render();
                },
                render: function() {
                    $(this.el).html(_.template(tpl)({
                        files: this.collection.models,
                        pager: this.collection.state,
                        search_term: search_term
                    }));
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
                            self.collection.getPage(1);
                            app.navigate('/')
                        }
                    });

                    e.preventDefault();
                },
            });

            var listView = new ListView();
        }
    };
});
