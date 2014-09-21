define(['backbone'], function(Backbone) {
    var File = Backbone.Model.extend({
        urlRoot: '/get_file/',
        defaults: {
            name: '',
            path: '',
            mime_type: '',
            image: null,
            preview: null,
            date_created: null,
            date_modified: null,
            meta_data: []
        }
    });
    return File
});