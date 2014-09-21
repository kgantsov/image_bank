define([
    'backbone',
    'app/models/File',
    'text!app/templates/file_view.html'
], function(Backbone, File, tpl) {
    return {
        show: function(id) {
            var FileView = Backbone.View.extend({
                el: $('#content'),
                events: {
                    'click a.remove_meta_data': 'removeMetaData',
                    'click button#add_meta_data': 'addMetaData',
                    'submit form.search_form': 'search',
                    'submit form.add_meta_data': 'addMetaData'
                },

                initialize: function(){
                    _.bindAll(this, 'render');
                    var self = this;

                    this.file = new File({id: id});
                    this.file.on("change", this.render, this);

                    this.file.fetch({
                        error: function(model, xhr, options) {
                            console.log("something went wrong!", xhr.status, model, xhr, options);
                        }
                    });

                    $.get("/get_fields/", function(data) {
                        if (data.status == 'success') {
                            console.log('DID', data.fields);
                            self.fields = data.fields;
                            self.render();
                        }
                    });
                },
                render: function() {
                    var self = this;
                    console.log('SSSSSSSSSSS', this.file.get('id'), this.file.get('name'));
                    console.log('SSSSSSSSSSS', this.file.get('meta_data'));

                    $('#meta_data_popup').on('hidden.bs.modal', function () {});

                    $(this.el).html(_.template(tpl)({
                        file: this.file,
                        fields: this.fields
                    }));
                    $('.meta_data_tooltip').tooltip();
                },
                removeMetaData: function (e) {
                    var self = this;

                    var data = {
                        csrfmiddlewaretoken: csrftoken = $.cookie('csrftoken'),
                        meta_data_id: $(e.currentTarget).data('id')
                    };
                    $.post("/remove_meta_data/", data, function(data) {
                        if (data.status == 'success') {
                            console.log('DID');
                            self.file.fetch();
                        }
                    });

                    e.preventDefault();
                },
                addMetaData: function (e) {
                    var self = this;
                    var data = {
                        csrfmiddlewaretoken: csrftoken = $.cookie('csrftoken'),
                        file_id: id,
                        field_id: $('#field_id').val(),
                        value: $('#value').val()
                    };
                    $.post("/add_meta_data/", data, function(data) {
                        if (data.status == 'success') {
                            $('#meta_data_popup').on('hidden.bs.modal', function () {
                                self.file.fetch();
                            });
                            $('#meta_data_popup').modal('toggle');
                        }
                    });

                    e.preventDefault();
                }
            });

            var fileView = new FileView();

        }
    };
});