requirejs.config({
    baseUrl: '/static/js/',
    urlArgs: 'bust=' + Date.now(),
    waitSeconds: 0,
    paths: {
        jquery:             'libs/jquery/dist/jquery.min',
        cookie:             'libs/jquery.cookie/jquery.cookie',
        underscore:         'libs/underscore/underscore',
        backbone:           'libs/backbone/backbone',
        backbone_paginator: 'libs/backbone.paginator/lib/backbone.paginator',
        bootstrap:          'libs/bootstrap/dist/js/bootstrap.min',
        react:              'libs/react/react',
        text:               'libs/requirejs-text/text'
    },

    shim: {
        backbone: {
            deps: ['jquery', 'underscore', 'bootstrap', 'cookie'],
            exports: 'Backbone'
        },
        jqueryui: {
            deps: ['jquery']
        },
        bootstrap: {
            deps: ['jquery']
        }
    }
});

window.app = {
    collection: {},
    model:      {},
    views:      {},
    router:     {}
};

require(['router'], function(Router) {
    Router.initialize();
});