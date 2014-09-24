from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.conf import settings

urlpatterns = patterns(
    '',
    url(r'^$', 'webapp.views.home', name='home'),
    url(
        r'^get_files/?(?P<search_term>.+)?$',
        'webapp.views.get_files',
        name='get_files'
    ),
    url(
        r'^get_file/(?P<file_id>[0-9]+)$',
        'webapp.views.get_file',
        name='get_file'
    ),
    url(
        r'^remove_meta_data/?$',
        'webapp.views.remove_meta_data',
        name='remove_meta_data'
    ),
    url(
        r'^add_file/?$',
        'webapp.views.add_file',
        name='add_file'
    ),
    url(
        r'^remove_file/?$',
        'webapp.views.remove_file',
        name='remove_file'
    ),
    url(
        r'^move_file/?$',
        'webapp.views.move_file',
        name='move_file'
    ),
    url(
        r'^get_fields/?$',
        'webapp.views.get_fields',
        name='get_fields'
    ),
    url(
        r'^add_meta_data/?$',
        'webapp.views.add_meta_data',
        name='add_meta_data'
    ),
    url(r'^admin/', include(admin.site.urls)),
    url(
        r'^media/(?P<path>.*)$',
        'django.views.static.serve',
        {'document_root': settings.MEDIA_ROOT}
    ),
)
