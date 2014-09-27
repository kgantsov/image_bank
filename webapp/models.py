from django.db import models

from sorl.thumbnail import ImageField


class File(models.Model):
    name = models.CharField(max_length=255)
    path = models.CharField(max_length=255)
    image = ImageField(upload_to='images')
    mime_type = models.CharField(max_length=255)
    date_modified = models.DateTimeField(auto_now=True)
    date_created = models.DateTimeField(auto_now_add=True)

    def is_image(self):
        if self.mime_type and self.mime_type.startswith('image'):
            return True
        return False

    def __unicode__(self):
        return u'%s' % self.name


class Field(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)

    def __unicode__(self):
        return self.name


class MetaData(models.Model):
    file = models.ForeignKey(File, related_name='meta')
    field = models.ForeignKey(Field)
    value = models.TextField()

    def __unicode__(self):
        return u'%s - %s: %s' % (self.file, self.field, self.value)
