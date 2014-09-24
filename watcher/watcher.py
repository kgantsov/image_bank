import os
import time
import mimetypes
import requests
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler


class ChangeHandler(FileSystemEventHandler):
    """
    React to changes in Python and Rest files by
    running unit tests (Python) or building docs (.rst)
    """

    host = '127.0.0.1:8000'

    def on_created(self, event):
        if event.is_directory:
            return

        name = os.path.basename(event.src_path)
        mime_type = mimetypes.guess_type(event.src_path)[0]

        requests.post(
            'http://%s/add_file' % self.host,
            data={
                'name': name,
                'path': event.src_path,
                'mime_type': mime_type
            }
        )
        print 'File [%s] created, sync to server [%s]' % (
            event.src_path, handler.host
        )

    def on_deleted(self, event):
        if event.is_directory:
            return

        requests.post(
            'http://%s/remove_file' % self.host,
            data={'path': event.src_path}
        )
        print 'File [%s] deleted, sync to server [%s]' % (
            event.src_path, handler.host
        )

    def on_moved(self, event):
        if event.is_directory:
            return

        name = os.path.basename(event.dest_path)
        requests.post(
            'http://%s/move_file' % self.host,
            data={
                'name': name,
                'path': event.src_path,
                'dest_path': event.dest_path
            }
        )
        print 'File was moved from [%s] to [%s], sync to server [%s]' % (
            event.src_path, event.dest_path, handler.host
        )


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description='Watcher for media files')
    parser.add_argument(
        "-d", "--dir", required=True, help="Directory for watching"
    )
    parser.add_argument("-s", "--server", help="Host of the server")

    args = parser.parse_args()

    observer = Observer()
    handler = ChangeHandler()
    handler.host = args.server or '127.0.0.1:8000'
    observer.schedule(handler, args.dir, recursive=True)
    observer.start()

    print 'Start watching directory [ %s ]' % os.path.abspath(args.dir)

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        print 'Stop watching directory [ %s ]' % os.path.abspath(args.dir)
    observer.join()