from django.contrib import admin

from webapp.models import File
from webapp.models import MetaData
from webapp.models import Field

admin.site.register(File)
admin.site.register(MetaData)
admin.site.register(Field)
