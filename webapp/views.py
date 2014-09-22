import json
from django.shortcuts import HttpResponse
from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.core.paginator import Paginator
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt

from sorl.thumbnail import get_thumbnail

from webapp.models import File
from webapp.models import MetaData
from webapp.models import Field


def home(request):
    """
    Show index page of project

    :param request:
    :return: Template
    """
    return render(request, 'webapp/index.html', {})


def get_files(request, search_term=None):
    """
    Get files with paging
    :param request:
    :param search_term: Search term
    :return:
    """
    def _prepare_data(file_obj):
        return {
            'id': file_obj.id,
            'name': file_obj.name,
            'path': file_obj.path,
            'mime_type': file_obj.mime_type
        }

    try:
        page = int(request.GET.get('page', 1))
    except ValueError:
        page = 1

    try:
        per_page = int(request.GET.get('per_page', 100))
    except ValueError:
        per_page = 1

    files = File.objects.order_by('name')

    if search_term:
        meta_data = MetaData.objects.filter(value__icontains=search_term).all()
        file_ids = [x.file_id for x in meta_data]
        files = File.objects.filter(
            Q(name__icontains=search_term) |
            Q(mime_type__icontains=search_term) |
            Q(id__in=file_ids)
        )

    paginator = Paginator(files, per_page)

    if page < 0 or page > paginator.num_pages:
        page = 1

    files_page = paginator.page(page)

    files = [_prepare_data(x) for x in files_page.object_list]

    next_page = files_page.next_page_number() if files_page.has_next() else None
    prev_page = (
        files_page.previous_page_number() if files_page.has_previous() else None
    )

    return HttpResponse(
        json.dumps({
            'status': 'success',
            'files': files,
            'total_count': paginator.count,
            'last_page': paginator.num_pages,
            'has_next': files_page.has_next(),
            'has_previous': files_page.has_previous(),
            'next_page': next_page,
            'previous_page': prev_page
        }),
        content_type="application/json"
    )


def get_file(request, file_id):
    """
    Get file by id
    :param request:
    :param file_id: ID of file
    :return:
    """
    def _prepare_meta_data(meta_obj):
        return {
            'id': meta_obj.id,
            'name': meta_obj.field.name,
            'description': meta_obj.field.description,
            'value': meta_obj.value,
        }

    file_obj = get_object_or_404(File, id=file_id)
    meta_data = [_prepare_meta_data(x) for x in file_obj.meta.all()]

    image = file_obj.image
    preview = get_thumbnail(
        file_obj.image, '640x480', quality=99
    )

    return HttpResponse(
        json.dumps({
            'id': file_obj.id,
            'name': file_obj.name,
            'path': file_obj.path,
            'mime_type': file_obj.mime_type,
            'image': image.url,
            'preview': preview.url,
            'date_modified': str(file_obj.date_modified),
            'date_created': str(file_obj.date_created),
            'meta_data': meta_data
        }),
        content_type="application/json"
    )


def add_meta_data(request):
    """
    Add meta data to file
    :param request:
    :return:
    """
    file_id = int(request.POST.get('file_id'))
    field_id = int(request.POST.get('field_id'))
    value = request.POST.get('value')

    file_obj = get_object_or_404(File, id=file_id)
    field = get_object_or_404(Field, id=field_id)

    meta_data, created = MetaData.objects.get_or_create(
        file=file_obj, field=field
    )

    if created:
        meta_data.value = value
        meta_data.save()

    return HttpResponse(
        json.dumps({'status': 'success'}),
        content_type="application/json"
    )


def remove_meta_data(request):
    """
    Delete meta data from file
    :param request:
    :return:
    """
    meta_data_id = int(request.POST.get('meta_data_id'))
    meta_data = get_object_or_404(MetaData, id=meta_data_id)
    meta_data.delete()

    return HttpResponse(
        json.dumps({'status': 'success'}),
        content_type="application/json"
    )


def get_fields(request):
    """
    Get all fields
    :param request:
    :return:
    """
    fields = [{'id': x.id, 'name': x.name} for x in Field.objects.all()]

    return HttpResponse(
        json.dumps({'status': 'success', 'fields': fields}),
        content_type="application/json"
    )


@csrf_exempt
def remove_file(request):
    """
    Remove file from database by ID or Path of file
    :param request:
    :return:
    """
    file_id = request.POST.get('file_id', None)
    path = request.POST.get('path', None)

    if file_id:
        file_obj = get_object_or_404(File, id=file_id)
    else:
        file_obj = get_object_or_404(File, path=path)

    file_obj.image.delete()
    file_obj.delete()

    return HttpResponse(
        json.dumps({'status': 'success'}),
        content_type="application/json"
    )


@csrf_exempt
def add_file(request):
    """
    Add new file to database
    :param request:
    :return:
    """
    name = request.POST.get('name')
    path = request.POST.get('path')
    mime_type = request.POST.get('mime_type')

    file_obj, created = File.objects.get_or_create(
        name=name, path=path, mime_type=mime_type
    )

    if request.FILES:
        file_name = request.FILES.values()[0]
        if len(file_name.read()) > 0:
            file_obj.image.delete()
            file_obj.image.save(name, file_name)

    file_obj.save()

    return HttpResponse(
        json.dumps({'status': 'success'}),
        content_type="application/json"
    )
