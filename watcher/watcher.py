import os
import sys
import time
import mimetypes
import requests
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler


APP_HOST = '127.0.0.1:8000'


class ChangeHandler(FileSystemEventHandler):
    """
    React to changes in Python and Rest files by
    running unit tests (Python) or building docs (.rst)
    """

    def on_created(self, event):
        files = []
        if event.is_directory:
            return

        name = os.path.basename(event.src_path)
        mime_type = mimetypes.guess_type(event.src_path)[0]

        if mime_type and mime_type.startswith('image'):
            files = [(name, (name, open(event.src_path, 'rb'), mime_type))]

        requests.post(
            'http://%s/add_file' % APP_HOST,
            data={
                'name': name,
                'path': os.path.abspath(event.src_path),
                'mime_type': mime_type
            },
            files=files
        )

    def on_deleted(self, event):
        requests.post(
            'http://%s/remove_file' % APP_HOST,
            data={
                'path': os.path.abspath(event.src_path),
            }
        )

    def on_modified(self, event):
        files = []
        if event.is_directory:
            return

        name = os.path.basename(event.src_path)
        mime_type = mimetypes.guess_type(event.src_path)[0]

        if mime_type and mime_type.startswith('image'):
            files = [(name, (name, open(event.src_path, 'rb'), mime_type))]

        requests.post(
            'http://%s/add_file' % APP_HOST,
            data={
                'name': name,
                'path': os.path.abspath(event.src_path),
                'mime_type': mime_type
            },
            files=files
        )


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description='Watcher for media files')
    parser.add_argument(
        "-d", "--dir", required=True, help="Directory for watching"
    )

    args = parser.parse_args()

    observer = Observer()
    observer.schedule(ChangeHandler(), args.dir, recursive=True)
    observer.start()

    print 'Start watching directory [ %s ]' % os.path.abspath(args.dir)

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        print 'Stop watching directory [ %s ]' % os.path.abspath(args.dir)
    observer.join()