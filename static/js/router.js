define(['backbone'], function(Backbone) {
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
            require(['app/views/index'], function(index) {
                index.show(page, search_term);
            });
        },
        view: function(id) {
            require(['app/views/view'], function(view) {
                view.show(id);
            });
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