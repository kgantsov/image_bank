#!/usr/bin/env python
# coding: utf-8


from fabric.api import local, lcd


def setup():
    # Install all needed javascript libraries
    local('bower install')

    # Migration of database
    local('python manage.py migrate')

    # Loading fixtures
    local('python manage.py loaddata webapp/fixtures/initial_data.json')


def server(server='0.0.0.0:8000'):
    local('python manage.py runserver %s' % server)


def watch(server='0.0.0.0:8000'):
    local('mkdir -p media/watchdir')
    with lcd('media'):
        local('python ../watcher/watcher.py -d watchdir -s %s' % server)

