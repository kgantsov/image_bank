define([
    'backbone',
    'text!app/templates/meta_data_popup.html'
], function(Backbone, tpl) {

    var MetaDataPopup = Backbone.View.extend({
        el: '#meta_data_popup_container',
        popup_el: '#meta_data_popup',

        events: {
            'click button#add_meta_data': 'addMetaData',
            'click button#edit_meta_data': 'editMetaData',
            'submit form.add_meta_data': 'addMetaData',
            'submit form.edit_meta_data': 'editMetaData'
        },

        initialize: function(options) {
            _.bindAll(this, 'render');
            this.options = options;
        },
        render: function() {
            $(this.el).html(_.template(tpl)({
                fields: this.fields,
                file_id: this.options.file_id,
                meta_data_id: this.options.meta_data_id,
                field_id: this.options.field_id,
                value: this.options.value
            }));
            return this;
        },
        show: function () {
            var self = this;

            $.get("/get_fields/", function(data) {
                if (data.status == 'success') {
                    self.fields = data.fields;
                    self.render();
                    $(self.popup_el).modal();
                }
            });
        },
        addMetaData: function (e) {
            var self = this;
            var data = {
                csrfmiddlewaretoken: csrftoken = $.cookie('csrftoken'),
                file_id: this.options.file_id,
                field_id: $('#field_id').val(),
                value: $('#value').val()
            };
            $.post("/add_meta_data/", data, function(data) {
                if (data.status == 'success') {
                    $(self.popup_el).on('hidden.bs.modal', function () {
                        self.trigger("added_meta_data", "Meta Data was added");
                    });
                    $(self.popup_el).modal('toggle');
                }
            });

            e.preventDefault();
        },
        editMetaData: function (e) {
            var self = this;
            var data = {
                csrfmiddlewaretoken: csrftoken = $.cookie('csrftoken'),
                file_id: this.options.file_id,
                meta_data_id: this.options.meta_data_id,
                field_id: $('#field_id').val(),
                value: $('#value').val()
            };
            $.post("/add_meta_data/", data, function(data) {
                if (data.status == 'success') {
                    $(self.popup_el).on('hidden.bs.modal', function () {
                        self.trigger("edited_meta_data", "Meta Data was edited");
                    });
                    $(self.popup_el).modal('toggle');
                }
            });

            e.preventDefault();
        }
    });

    return MetaDataPopup;
});