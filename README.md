Image bank
==========

Assignment was to build minimalistic 'image bank' application with with limited search capabilities including background processing.

What was done:

- The system should monitor one folder on the local file system (watch-folder) and register any newly appearing files to the database as a background process without any manual involvement.
- It should be possible to perform substring search for file names registered.
- It should be possible to assign "metadata" to any file through the user-interface
- It should be possible to search for metadata
- It should be possible to delete registered files from the web-UI
- The System should have at least the following views:

  - File name search + presentation of search results
  - View a file with metadata in web-interface if available. Also display image on this page if it is an image
  - Edit metadata for a file
  - Ability to have multiple metadata fields per file


Python librares:
================
- Django==1.7
- requests==1.2.3
- watchdog==0.8.1
- sorl-thumbnail==11.12.1b
- Pillow==2.5.3

Javascript librares:
====================
- bootstrap==3.2.0
- requirejs==2.1.15
- jquery==2.1.1
- backbone==1.1.2
- requirejs-text==2.0.12
- jquery.cookie==1.4.1
- backbone.paginator==2.0.2


Installation (manual mode):
===========================
Bower and NodeJS must be installed


Step 1. Installing python libraries:

    pip install -r requirements.txt

Step 2. Setup. It will setup all needed javascript libraries, migrate database, load fixtures:

    fab setup


Installation (via Docker):
==========================

    docker build -t image_bank .

Launching (manual mode):
========================

Starting web server:
--------------------

    fab server


Watching directory:
-------------------

    fab watch


Launching (via Docker):
========================

Starting web server:
--------------------

    docker run -i -p 8000:8000 --name server -v /folder/to/watch:/code/media/watchdir -t image_bank


Watching directory:
-------------------

    docker run -i --name watcher -v /folder/to/watch:/code/media/watchdir -t image_bank fab watch:0.0.0.0:8000


Usage:
======

Web application:
----------------

If you use 'fab server'and 'fab watch' application will start at http://0.0.0.0:8000 and will monitor changing of files in media/watchdir.

If you use docker application will start at http://0.0.0.0:8000 and will monitor changing of files in directory which you chose '-v /folder/to/watch'. This directory will mount to project dir '/code/media/watchdir'

if you open http://0.0.0.0:8000 you will see main page with updated files by 10 files per page. You can move to different page using pagination at the bottom of the page.

Web application has several view:
  - / - main page. if you open http://0.0.0.0:8000 you will see main page with updated files by 10 files per page. You can go to different page using pagination at the bottom of the page.
  - /#/view/<:file_id> - This page contains all info about file and all metadata which were attached to this file by web interface. Also on this page you can add new metadata to file or delete or edit attached metadata.

Search form shows on main page. So you can search files by their names, paths and metadata fields.

If you want to add some new metadata fields which can be attached to all your files you need to go in admin interface /admin/webapp/field/. Also at this page you can edit or delete any of metadata fileds. For accessing to admin interface you should use 'admin' as login and password.


Watcher application:
--------------------

Application will have watched folder after you start this application. So when you add some new files to watching folder application wiil send info about these files to the server and server will save them. If you remove file from watching folder it will be automaticaly removed from the database. Of course you can rename or move file to subdirectory and watcher will send info about it to the server.

