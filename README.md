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

Step 2. Setup. It will setup all needed javascript libraries, migrate database, load fixtures:

    fab setup


Launching:
==========

Starting web server:
--------------------

    fab server


Watching directory:
-------------------

    fab watch




