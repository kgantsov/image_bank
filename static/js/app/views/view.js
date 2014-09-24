define([
    'backbone',
    'app/models/File',
    'app/views/meta_data_popup',
    'text!app/templates/file_view.html'
], function(Backbone, File, MetaDataPopup, tpl) {
    var FileView = Backbone.View.extend({
        events: {
            'click a.remove_meta_data': 'removeMetaData',
            'click button#show_add_meta_data_popup': 'showAddMetaDataPopup',
            'click a.show_edit_meta_data_popup': 'showEditMetaDataPopup',
            'submit form.search_form': 'search'
        },

        initialize: function(options) {
            _.bindAll(this, 'render');
            this.options = options;
            var self = this;

            this.file = new File({id: this.options.id});
            this.file.on("change", this.render, this);

            this.file.fetch({
                error: function(model, xhr, options) {
                    console.log(
                        "something went wrong!", xhr.status, model, xhr, options
                    );
                }
            });

            self.render();
        },
        render: function() {
            $(this.el).html(_.template(tpl)({
                file: this.file,
                fields: this.fields
            }));
            $('.meta_data_tooltip').tooltip();
            return this;
        },
        showAddMetaDataPopup: function () {
            var metaDataPopup = new MetaDataPopup({file_id: this.options.id});
            _.extend(metaDataPopup, Backbone.Events);

            metaDataPopup.on("added_meta_data", this.on_meta_data_added, this);
            metaDataPopup.show();
        },
        showEditMetaDataPopup: function (e) {
            var metaDataPopup = new MetaDataPopup({
                file_id: this.options.id,
                meta_data_id: $(e.currentTarget).data('meta_data_id'),
                field_id: $(e.currentTarget).data('field_id'),
                value: $(e.currentTarget).data('value')
            });
            _.extend(metaDataPopup, Backbone.Events);

            metaDataPopup.on("edited_meta_data", this.on_meta_data_edited, this);
            metaDataPopup.show();

            e.preventDefault();
        },
        removeMetaData: function (e) {
            var self = this;

            var data = {
                csrfmiddlewaretoken: csrftoken = $.cookie('csrftoken'),
                meta_data_id: $(e.currentTarget).data('id')
            };
            $.post("/remove_meta_data/", data, function(data) {
                if (data.status == 'success') {
                    self.file.fetch();
                }
            });

            e.preventDefault();
        },
        on_meta_data_added: function () {
            this.file.fetch();
        },
        on_meta_data_edited: function () {
            this.file.fetch();
        }
    });

    return FileView;
});