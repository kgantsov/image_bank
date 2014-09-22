define([
    'backbone',
    'backbone_paginator',
    'app/models/File'
], function(Backbone, PageableCollection, File) {
    var FileCollection = Backbone.PageableCollection.extend({
        model: File,
        url: function() {
            console.log(this);
            if (this.search_term) {
                return '/get_files/' + this.search_term;
            } else {
                return '/get_files';
            }

        },

        initialize: function(models, options) {
            this.search_term = options.search_term;
        },

        state: {
            pageSize: 10,
            firstPage: 1
        },

        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.total_count,
                lastPage: resp.last_page,
                hasNextPage: resp.has_next,
                hasPreviousPage: resp.has_previous,
                nextPage: resp.next_page,
                previousPage: resp.previous_page,
            };
        },

        parseRecords: function (resp, options) {
            return resp.files;
        }
    });
    return FileCollection
});