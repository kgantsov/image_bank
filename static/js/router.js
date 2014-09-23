define([
    'backbone', 'app/views/list_files', 'app/views/view'
], function(Backbone, ListFilesView, FileView) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            "": "index",
            "index(/)": "index",
            "index(/:page)": "index",
            "index/:page/": "index",
            "index/:page(/:search_term)": "index",
            "view(/)": "view",
            "view(/:id)": "view"
        },
        index: function(page, search_term) {
            var listFilesView = new ListFilesView({
                page:page, search_term:search_term
            });
            $('#content').html(listFilesView.render().el);
        },
        view: function(id) {
            var fileView = new FileView({id: id});
            $('#content').html(fileView.render().el);
        }
    });

    var initialize = function() {
        window.app = new AppRouter();
        Backbone.history.start({hashChange: true});
    };

    return {
        initialize: initialize
    };
});