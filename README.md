image_bank
==========


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


Installation:
=============

Step 1. Installing python libraries:

    pip install -r requirements.txt

Step 2. Installing javascript libraries:

    bower install
    
Step 3. Migrating database:

    python manage.py migrate
    python manage.py loaddata webapp/fixtures/initial_data.json
    

Launching:
==========

Starting web server:
--------------------

    python manage.py runserver


Watching directory:
-------------------

    cd media/
    python ../watcher/watcher.py -d watchdir




