start:
	mkdir -p media/watchdir
	python watcher/watcher.py -d media/watchdir &
	python manage.py runserver