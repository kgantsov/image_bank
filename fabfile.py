#!/usr/bin/env python
# coding: utf-8


from fabric.api import local, lcd


def install():
    # Install all needed python libraries
    local('pip install -r requirements.txt')

    # Install all needed javascript libraries
    local('bower install')

    # Migration of database
    local('python manage.py migrate')

    # Loading fixtures
    local('python manage.py loaddata webapp/fixtures/initial_data.json')


def server():
    local('python manage.py runserver 0.0.0.0:8000')


def watch():
    local('mkdir -p media/watchdir')
    with lcd('media'):
        local('pwd')
        local('python ../watcher/watcher.py -d watchdir')

